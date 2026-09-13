import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { practiceRoles } from "@/lib/roles-content";

const SITE = "https://cadence-dj.lovable.app";

export const Route = createFileRoute("/interview-prep-guide")({
  head: () => ({
    meta: [
      { title: "How to Prepare for a Job Interview: A Practical Guide — Cadence" },
      {
        name: "description",
        content:
          "A step-by-step interview preparation guide: research the role, structure answers with STAR, rehearse out loud, and fix the mistakes that cost offers.",
      },
      {
        property: "og:title",
        content: "How to Prepare for a Job Interview: A Practical Guide — Cadence",
      },
      {
        property: "og:description",
        content:
          "Research, structure, and out-loud rehearsal — a practical system for walking into your next interview ready.",
      },
      { property: "og:type", content: "article" },
      { property: "og:url", content: `${SITE}/interview-prep-guide` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/interview-prep-guide` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: "How to Prepare for a Job Interview: A Practical Guide",
          description:
            "A step-by-step interview preparation guide covering research, answer structure, and out-loud rehearsal.",
          author: { "@type": "Organization", name: "Cadence" },
        }),
      },
    ],
  }),
  component: InterviewPrepGuide,
});

const steps = [
  {
    title: "Start from the job description, not your resume",
    body: "Highlight the five or six requirements the posting repeats. Those are what you'll be scored on. For each one, prepare a story from your experience that shows you've done it — that's your answer bank.",
  },
  {
    title: "Structure every story with STAR",
    body: "Situation, Task, Action, Result. Spend one sentence on Situation and Task together, most of your time on Action, and always land on a Result with a number if you can. Interviewers score structure as much as content.",
  },
  {
    title: "Rehearse out loud, not in your head",
    body: "Silent reading feels like preparation but isn't — speaking uses different recall. Say your answers out loud at least twice. You'll immediately hear where you ramble, where you skip the result, and where your pacing falls apart.",
  },
  {
    title: "Record yourself once",
    body: "One recorded run-through reveals filler words, flat tone, and missing structure better than ten mental rehearsals. Transcription makes it even clearer: you can see every 'um' and every answer with no ending.",
  },
  {
    title: "Prepare your questions for them",
    body: "Two or three thoughtful questions about the team's goals and how success is measured signal seniority. Avoid anything answerable from the company's homepage.",
  },
  {
    title: "Do a full dress rehearsal",
    body: "The day before, run a complete mock interview from greeting to closing questions. Treat it like the real thing — same time of day, same setup. Familiarity is what reads as confidence in the room.",
  },
];

const mistakes = [
  {
    title: "Answering without a result",
    body: "The most common failure isn't a weak story — it's a story that never lands. End every answer with what changed and how you know.",
  },
  {
    title: "Memorizing scripts word for word",
    body: "Scripted answers collapse the moment an interviewer asks a follow-up. Rehearse the structure and the key beats, not the sentences.",
  },
  {
    title: "Talking for more than two minutes",
    body: "Long answers lose the room. Aim for 60–90 seconds, then stop. If they want more, they'll ask — and that's a good sign.",
  },
];

function InterviewPrepGuide() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center" aria-label="Cadence home">
            <Logo size={32} />
          </Link>
          <Button asChild size="sm">
            <Link to="/auth">Start free</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-14">
        <h1 className="font-display text-4xl font-bold leading-tight">
          How to prepare for a job interview
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Most interview prep is silent reading — and it doesn't hold up in the room. This guide
          covers a preparation system that works: build an answer bank from the job description,
          structure your stories, and rehearse out loud until your answers sound natural.
        </p>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">The six-step prep system</h2>
          <ol className="mt-6 space-y-4">
            {steps.map((step, i) => (
              <li key={step.title} className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Step {i + 1}
                </span>
                <h3 className="mt-1 font-semibold">{step.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Three mistakes that cost offers</h2>
          <div className="mt-6 grid gap-4">
            {mistakes.map((mistake) => (
              <div key={mistake.title} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-semibold">{mistake.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {mistake.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-surface-deep p-8">
          <h2 className="font-display text-2xl font-semibold text-on-dark">
            Rehearse with an AI interviewer
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-on-dark-muted">
            Cadence runs a live voice interview for your role, transcribes every word, and scores
            your clarity, structure, and impact — the dress rehearsal from step six, on demand.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-on-dark text-surface-deep hover:bg-on-dark-muted"
          >
            <Link to="/auth">
              <Mic className="size-4" />
              Start a practice interview
            </Link>
          </Button>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-lg font-semibold">Questions by role</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {practiceRoles.map((role) => (
              <Link
                key={role.slug}
                to="/interview-questions/$role"
                params={{ role: role.slug }}
                className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary"
              >
                {role.shortName}
                <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-surface-dark">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-sm text-on-dark-muted">
          <Logo size={26} inverted />
          <nav className="flex gap-5">
            <Link to="/" className="hover:text-on-dark">Home</Link>
            <Link to="/interview-questions" className="hover:text-on-dark">
              Questions by role
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
