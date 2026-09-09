import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { streamText, Output, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider, INTERVIEW_MODEL } from "./ai-gateway.server";

const SetupSchema = z.object({
  role: z.string().min(1).max(80),
  level: z.string().min(1).max(40),
});

const QuestionsSchema = z.object({
  questions: z.array(z.string()),
});

const FeedbackSchema = z.object({
  overallScore: z.number(),
  summary: z.string(),
  categories: z.array(z.object({ name: z.string(), score: z.number() })),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});

export type Feedback = z.infer<typeof FeedbackSchema>;

function getKey() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured yet.");
  return key;
}

function providerOptions() {
  return { lovable: { reasoningEffort: "low" as const } };
}

export const generateQuestions = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => SetupSchema.parse(input))
  .handler(async ({ data }) => {
    const gateway = createLovableAiGatewayProvider(getKey(), { structuredOutputs: true });
    const result = streamText({
      model: gateway(INTERVIEW_MODEL),
      output: Output.object({ schema: QuestionsSchema }),
      providerOptions: providerOptions(),
      system:
        "You are a seasoned hiring interviewer. Write realistic spoken interview questions. No numbering, no preamble.",
      prompt: `Write exactly 5 interview questions for a ${data.level} ${data.role} candidate. Mix one warm-up, three role-specific or behavioural questions, and one closing question. Each question must be one or two sentences.`,
    });

    try {
      const output = await result.output;
      const questions = output.questions.filter(Boolean).slice(0, 5);
      if (questions.length === 0) throw new Error("empty");
      return { questions };
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        return {
          questions: [
            `Tell me about yourself and why this ${data.role} role interests you.`,
            `Walk me through a project you're proud of as a ${data.level} ${data.role}.`,
            "Describe a time you disagreed with a teammate. How did you handle it?",
            "Tell me about a decision you made with incomplete information.",
            "What questions do you have for us?",
          ],
        };
      }
      throw error;
    }
  });

const ReviewSchema = z.object({
  role: z.string().min(1).max(80),
  level: z.string().min(1).max(40),
  durationSeconds: z.number().int().min(0).max(60 * 60 * 4),
  transcript: z
    .array(
      z.object({
        speaker: z.enum(["interviewer", "candidate"]),
        text: z.string().max(6000),
      }),
    )
    .min(1)
    .max(60),
});

export const reviewInterview = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => ReviewSchema.parse(input))
  .handler(async ({ data, context }) => {
    const gateway = createLovableAiGatewayProvider(getKey(), { structuredOutputs: true });
    const transcriptText = data.transcript
      .map((line) => `${line.speaker === "interviewer" ? "Interviewer" : "Candidate"}: ${line.text}`)
      .join("\n");

    const result = streamText({
      model: gateway(INTERVIEW_MODEL),
      output: Output.object({ schema: FeedbackSchema }),
      providerOptions: providerOptions(),
      system:
        "You are an experienced interview coach. Be specific, kind and direct. Scores are integers 0-100. Use exactly these four category names: Clarity, Structure, Relevance, Confidence. Give 2-3 strengths and 2-3 improvements, each one sentence, each referencing something the candidate actually said. The summary is at most two sentences.",
      prompt: `Role: ${data.level} ${data.role}\nSpoken transcript:\n${transcriptText}`,
    });

    let feedback: Feedback;
    try {
      feedback = await result.output;
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        throw new Error("The coach couldn't score this session. Try recording a longer answer.");
      }
      throw error;
    }

    const clamp = (n: number) => Math.max(0, Math.min(100, Math.round(n)));
    const categories = feedback.categories.slice(0, 4).map((c) => ({
      name: c.name,
      score: clamp(c.score),
    }));

    const { data: saved, error } = await context.supabase
      .from("interview_sessions")
      .insert({
        user_id: context.userId,
        role_title: data.role,
        experience_level: data.level,
        transcript: data.transcript,
        overall_score: clamp(feedback.overallScore),
        category_scores: categories,
        strengths: feedback.strengths.slice(0, 3),
        improvements: feedback.improvements.slice(0, 3),
        summary: feedback.summary,
        duration_seconds: data.durationSeconds,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    return {
      id: saved.id,
      overallScore: clamp(feedback.overallScore),
      summary: feedback.summary,
      categories,
      strengths: feedback.strengths.slice(0, 3),
      improvements: feedback.improvements.slice(0, 3),
    };
  });
