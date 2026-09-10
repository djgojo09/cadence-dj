import { createFileRoute, Link } from "@tanstack/react-router";
import { Mic, ListChecks, LineChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Cadence — Practice interviews out loud" },
      {
        name: "description",
        content:
          "Cadence runs a live voice interview, transcribes every word, and returns a score with the exact lines to sharpen.",
      },
      { property: "og:title", content: "Cadence — Practice interviews out loud" },
      {
        property: "og:description",
        content: "Voice interview practice with a live transcript and scored AI feedback.",
      },
    ],
  }),
  component: Landing,
});

const steps = [
  {
    icon: ListChecks,
    title: "Pick a role and level",
    body: "Choose the job you're interviewing for. Questions match the bar you're being measured against.",
  },
  {
    icon: Mic,
    title: "Answer out loud",
    body: "Speak like you would in the room. Your words appear as a clean, readable transcript.",
  },
  {
    icon: LineChart,
    title: "Read your score",
    body: "Category scores, what you did well, and the specific fixes to rehearse next.",
  },
];

function Landing() {
  const { user, loading } = useAuth();
  const primaryTo = user ? "/practice" : "/auth";

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg bg-primary font-display text-sm font-bold text-primary-foreground">
              P
            </span>
            <span className="font-display text-lg font-semibold tracking-tight text-primary">
              Cadence
            </span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/history">History</Link>
                </Button>
                <Button asChild size="sm">
                  <Link to="/practice">Open workspace</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm">
                  <Link to="/auth">Sign in</Link>
                </Button>
                <Button asChild size="sm" disabled={loading}>
                  <Link to="/auth">Start free</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5">
        <section className="grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
              <span className="size-1.5 rounded-full bg-success" />
              AI voice rehearsal, scored in real time
            </span>
            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              Walk in like you already have the job.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              Cadence runs a live voice interview, transcribes every word, then hands back a score
              and the exact lines to sharpen before the real thing.
            </p>
            <div className="mt-8">
              <Button asChild size="lg" className="px-7">
                <Link to={primaryTo}>Start a practice interview</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span className="flex items-center gap-2">
                <span className="size-2 animate-pulse rounded-full bg-success" />
                Live · Frontend Engineering
              </span>
              <span>04:12</span>
            </div>
            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Interviewer
                </p>
                <p className="mt-1.5 text-[15px] leading-relaxed">
                  Tell me about a project where you improved performance.
                </p>
              </div>
              <div className="border-t border-border pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-success">You</p>
                <p className="mt-1.5 text-[15px] leading-relaxed text-muted-foreground">
                  I cut our bundle size by 42% by code-splitting the dashboard, which took first
                  paint from 4.1s down to 1.9s.
                </p>
              </div>
            </div>
            <div className="mt-6 space-y-3 border-t border-border pt-5">
              {[
                { label: "Clarity", value: 88 },
                { label: "Structure", value: 81 },
                { label: "Impact", value: 76 },
              ].map((row) => (
                <div key={row.label}>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{row.label}</span>
                    <span className="text-foreground">{row.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${row.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border py-16">
          <h2 className="font-display text-2xl font-semibold">How it works</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.title} className="rounded-2xl border border-border bg-card p-6">
                <step.icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-4 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <section className="bg-surface-deep">
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-on-dark">
              Ready for your next interview?
            </h2>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-on-dark-muted">
              Run a full voice session in under ten minutes and get scored feedback right away.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-on-dark px-7 text-surface-deep hover:bg-on-dark-muted"
          >
            <Link to={primaryTo}>Start a practice interview</Link>
          </Button>
        </div>
      </section>

      <footer className="bg-surface-dark">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-6 text-sm text-on-dark-muted">
          <span className="font-display font-semibold text-on-dark">Cadence</span>
          <span>Practice out loud. Improve on purpose.</span>
        </div>
      </footer>
    </div>
  );
}
