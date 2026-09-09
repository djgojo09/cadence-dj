import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateQuestions, reviewInterview } from "@/lib/interview.functions";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

export const Route = createFileRoute("/_authenticated/practice")({
  head: () => ({
    meta: [
      { title: "Interview workspace — Prepwave" },
      {
        name: "description",
        content:
          "Choose a role and level, run a voice interview, follow the live transcript, and get scored feedback.",
      },
      { property: "og:title", content: "Interview workspace — Prepwave" },
      { property: "og:description", content: "Run a voice interview and get scored feedback." },
    ],
  }),
  component: Practice,
});

const ROLES = [
  "Software Engineer",
  "Frontend Engineer",
  "Product Manager",
  "Product Designer",
  "Data Scientist",
  "Marketing Manager",
  "Customer Success Manager",
];
const LEVELS = ["Intern", "Junior", "Mid-level", "Senior", "Lead"];

type Line = { speaker: "interviewer" | "candidate"; text: string };
type Feedback = {
  id: string;
  overallScore: number;
  summary: string;
  categories: { name: string; score: number }[];
  strengths: string[];
  improvements: string[];
};

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function Practice() {
  const askQuestions = useServerFn(generateQuestions);
  const askReview = useServerFn(reviewInterview);
  const speech = useSpeechRecognition();

  const [role, setRole] = useState<string>("Software Engineer");
  const [level, setLevel] = useState<string>("Senior");
  const [stage, setStage] = useState<"setup" | "permission" | "live" | "scoring" | "done">("setup");
  const [micGranted, setMicGranted] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcript, setTranscript] = useState<Line[]>([]);
  const [seconds, setSeconds] = useState(0);
  const [preparing, setPreparing] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (stage !== "live") return;
    const timer = window.setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => window.clearInterval(timer);
  }, [stage]);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [transcript, speech.interim]);

  useEffect(() => {
    if (speech.error) toast.error(speech.error);
  }, [speech.error]);

  const appendAnswer = useCallback((text: string) => {
    setTranscript((prev) => {
      const last = prev[prev.length - 1];
      if (last?.speaker === "candidate") {
        return [...prev.slice(0, -1), { speaker: "candidate", text: `${last.text} ${text}`.trim() }];
      }
      return [...prev, { speaker: "candidate", text }];
    });
  }, []);

  async function requestMic() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicGranted(true);
      await beginInterview();
    } catch {
      toast.error("Microphone access was blocked. Allow it in your browser to run a voice interview.");
    }
  }

  async function beginInterview() {
    setPreparing(true);
    try {
      const result = await askQuestions({ data: { role, level } });
      setQuestions(result.questions);
      setQuestionIndex(0);
      setSeconds(0);
      setFeedback(null);
      setTranscript([{ speaker: "interviewer", text: result.questions[0] ?? "" }]);
      setStage("live");
      speech.start(appendAnswer);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't start the interview.");
    } finally {
      setPreparing(false);
    }
  }

  function nextQuestion() {
    const next = questionIndex + 1;
    const question = questions[next];
    if (!question) return;
    setQuestionIndex(next);
    setTranscript((prev) => [...prev, { speaker: "interviewer", text: question }]);
  }

  async function finish() {
    speech.stop();
    const answered = transcript.some((line) => line.speaker === "candidate" && line.text.length > 8);
    if (!answered) {
      toast.error("Answer at least one question out loud before finishing.");
      return;
    }
    setStage("scoring");
    try {
      const result = await askReview({
        data: { role, level, durationSeconds: seconds, transcript },
      });
      setFeedback(result);
      setStage("done");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Couldn't score this session.");
      setStage("live");
    }
  }

  function reset() {
    speech.stop();
    setStage("setup");
    setTranscript([]);
    setQuestions([]);
    setSeconds(0);
    setFeedback(null);
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Interview workspace</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {stage === "live"
              ? `Question ${questionIndex + 1} of ${questions.length}`
              : "Set up your session, then answer out loud."}
          </p>
        </div>
        {stage === "live" && (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span
              className={
                speech.listening
                  ? "flex items-center gap-2 text-success"
                  : "flex items-center gap-2"
              }
            >
              <span
                className={`size-2 rounded-full ${speech.listening ? "animate-pulse bg-success" : "bg-muted-foreground"}`}
              />
              {speech.listening ? "Listening" : "Paused"}
            </span>
            <span className="tabular-nums text-foreground">{formatTime(seconds)}</span>
          </div>
        )}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[320px_1fr]">
        {/* Left column: setup + controls */}
        <div className="space-y-5">
          <section className="rounded-2xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-semibold">Session setup</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={setRole} disabled={stage === "live"}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROLES.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="level">Experience level</Label>
                <Select value={level} onValueChange={setLevel} disabled={stage === "live"}>
                  <SelectTrigger id="level">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LEVELS.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {stage === "setup" && (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={() => (micGranted ? beginInterview() : setStage("permission"))}
                  disabled={preparing}
                >
                  {preparing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Preparing questions
                    </>
                  ) : (
                    "Start voice interview"
                  )}
                </Button>
              )}

              {stage === "live" && (
                <div className="space-y-2">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      speech.listening ? speech.stop() : speech.start(appendAnswer)
                    }
                  >
                    {speech.listening ? (
                      <>
                        <MicOff className="size-4" /> Pause recording
                      </>
                    ) : (
                      <>
                        <Mic className="size-4" /> Resume recording
                      </>
                    )}
                  </Button>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="w-full"
                    onClick={nextQuestion}
                    disabled={questionIndex >= questions.length - 1}
                  >
                    Next question
                  </Button>
                  <Button size="lg" className="w-full" onClick={finish}>
                    Finish and get feedback
                  </Button>
                </div>
              )}

              {(stage === "done" || stage === "scoring") && (
                <Button
                  size="lg"
                  className="w-full"
                  onClick={reset}
                  disabled={stage === "scoring"}
                >
                  Start a new session
                </Button>
              )}
            </div>
          </section>

          {!speech.supported && (
            <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">
              Live speech isn't available in this browser. Chrome or Edge on desktop gives the best
              transcript.
            </p>
          )}

          <Button asChild variant="ghost" className="w-full">
            <Link to="/history">See past sessions</Link>
          </Button>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {stage === "permission" && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <ShieldCheck className="size-6 text-primary" aria-hidden />
              <h2 className="mt-4 font-display text-xl font-semibold">
                Before we turn on your microphone
              </h2>
              <ul className="mt-4 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
                <li>
                  Your browser will ask for permission. We use the microphone only while a session
                  is running, and you can pause it at any time.
                </li>
                <li>
                  Your speech is turned into text in your browser to build the live transcript. No
                  audio recording is uploaded or stored.
                </li>
                <li>
                  Only the finished transcript, your scores and tips are saved to your account so
                  you can look back at them.
                </li>
              </ul>
              <div className="mt-6 flex flex-wrap gap-3">
                <Button size="lg" onClick={requestMic} disabled={preparing}>
                  {preparing ? (
                    <>
                      <Loader2 className="size-4 animate-spin" /> Preparing questions
                    </>
                  ) : (
                    <>
                      <Mic className="size-4" /> Allow microphone and start
                    </>
                  )}
                </Button>
                <Button size="lg" variant="ghost" onClick={() => setStage("setup")}>
                  Not now
                </Button>
              </div>
            </section>
          )}

          {(stage === "live" || stage === "scoring" || stage === "done") && (
            <section className="rounded-2xl border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border px-6 py-4">
                <h2 className="font-display text-base font-semibold">Transcript</h2>
                <span className="text-xs text-muted-foreground">
                  {transcript.filter((l) => l.speaker === "candidate").length} answers
                </span>
              </div>
              <div className="max-h-[460px] space-y-5 overflow-y-auto px-6 py-5">
                {transcript.map((line, index) => (
                  <div
                    key={index}
                    className={
                      index === 0 ? "" : "border-t border-border pt-5 first:border-0 first:pt-0"
                    }
                  >
                    <p
                      className={`text-xs font-semibold uppercase tracking-wider ${line.speaker === "interviewer" ? "text-primary" : "text-success"}`}
                    >
                      {line.speaker === "interviewer" ? "Interviewer" : "You"}
                    </p>
                    <p className="mt-2 text-[17px] leading-8 text-foreground">{line.text}</p>
                  </div>
                ))}
                {speech.interim && (
                  <div className="border-t border-border pt-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-success">
                      You
                    </p>
                    <p className="mt-2 text-[17px] leading-8 text-muted-foreground">
                      {speech.interim}…
                    </p>
                  </div>
                )}
                <div ref={transcriptEndRef} />
              </div>
            </section>
          )}

          {stage === "scoring" && (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
              <Loader2 className="size-4 animate-spin" />
              Reviewing your answers and scoring the session…
            </div>
          )}

          {stage === "done" && feedback && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-center gap-5">
                <div className="grid size-16 place-items-center rounded-2xl bg-secondary">
                  <span className="font-display text-2xl font-bold">{feedback.overallScore}</span>
                </div>
                <div className="min-w-[220px] flex-1">
                  <h2 className="font-display text-xl font-semibold">Session feedback</h2>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted-foreground">
                    {feedback.summary}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {feedback.categories.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{category.name}</span>
                      <span className="font-medium">{category.score}</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-700"
                        style={{ width: `${category.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-success">
                    What worked
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed">
                    {feedback.strengths.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Sharpen next
                  </h3>
                  <ul className="mt-3 space-y-2.5 text-[15px] leading-relaxed">
                    {feedback.improvements.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          )}

          {stage === "setup" && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="font-display text-xl font-semibold">Ready when you are</h2>
              <p className="mt-2 max-w-prose text-[15px] leading-relaxed text-muted-foreground">
                Pick the role and level on the left, then start. You'll get five spoken questions,
                a live transcript of your answers, and a scored review at the end. We'll explain the
                microphone permission before anything starts recording.
              </p>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
