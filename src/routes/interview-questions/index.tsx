import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { practiceRoles } from "@/lib/roles-content";

const SITE = "https://cadence-dj.lovable.app";

export const Route = createFileRoute("/interview-questions/")({
  head: () => ({
    meta: [
      { title: "Mock Interview Questions by Role — Cadence" },
      {
        name: "description",
        content:
          "Practice real interview questions for software engineers, product managers, data analysts, marketers, sales reps, and CSMs — out loud, with AI feedback.",
      },
      { property: "og:title", content: "Mock Interview Questions by Role — Cadence" },
      {
        property: "og:description",
        content:
          "Role-specific interview questions with a live voice practice session and scored AI feedback.",
      },
      { property: "og:url", content: `${SITE}/interview-questions` },
    ],
    links: [{ rel: "canonical", href: `${SITE}/interview-questions` }],
  }),
  component: InterviewQuestionsHub,
});

function InterviewQuestionsHub() {
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

      <main className="mx-auto max-w-6xl px-5 py-14">
        <div className="max-w-2xl">
          <h1 className="font-display text-4xl font-bold leading-tight">
            Mock interview questions, by role
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
            Pick the job you're interviewing for. Each page has the questions interviewers actually
            ask — and a free voice practice session that scores your answers.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {practiceRoles.map((role) => (
            <Link
              key={role.slug}
              to="/interview-questions/$role"
              params={{ role: role.slug }}
              className="group rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary"
            >
              <h2 className="font-display text-lg font-semibold">{role.shortName}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{role.tagline}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                View questions
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>

        <section className="mt-16 rounded-2xl border border-border bg-card p-8 sm:flex sm:items-center sm:justify-between sm:gap-8">
          <div>
            <h2 className="font-display text-xl font-semibold">Don't just read — rehearse</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted-foreground">
              Cadence runs a live voice interview with follow-up questions, transcribes your
              answers, and scores clarity, structure, and impact.
            </p>
          </div>
          <Button asChild size="lg" className="mt-5 shrink-0 sm:mt-0">
            <Link to="/auth">
              <Mic className="size-4" />
              Try a voice interview
            </Link>
          </Button>
        </section>
      </main>

      <footer className="bg-surface-dark">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-sm text-on-dark-muted">
          <Logo size={26} inverted />
          <nav className="flex gap-5">
            <Link to="/" className="hover:text-on-dark">Home</Link>
            <Link to="/interview-prep-guide" className="hover:text-on-dark">
              Interview prep guide
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
