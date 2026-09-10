import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/history")({
  head: () => ({
    meta: [
      { title: "Your progress — Cadence" },
      {
        name: "description",
        content: "Review past voice interview sessions, scores, strengths and improvement tips.",
      },
      { property: "og:title", content: "Your progress — Cadence" },
      { property: "og:description", content: "Past interview sessions and scores in one place." },
    ],
  }),
  component: History,
});

type Category = { name: string; score: number };

function History() {
  const { data, isLoading } = useQuery({
    queryKey: ["interview-sessions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("interview_sessions")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const sessions = data ?? [];
  const scored = sessions.filter((s) => typeof s.overall_score === "number");
  const average = scored.length
    ? Math.round(scored.reduce((sum, s) => sum + (s.overall_score ?? 0), 0) / scored.length)
    : null;

  return (
    <main className="mx-auto max-w-6xl px-5 py-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold">Your progress</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Every session saved, scored, and ready to revisit.
          </p>
        </div>
        <Button asChild>
          <Link to="/practice">New practice session</Link>
        </Button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Stat label="Sessions" value={sessions.length.toString()} />
        <Stat label="Average score" value={average === null ? "—" : average.toString()} />
        <Stat
          label="Last practiced"
          value={
            sessions[0] ? new Date(sessions[0].created_at).toLocaleDateString() : "Not yet"
          }
        />
      </div>

      <div className="mt-8 space-y-4">
        {isLoading && <p className="text-sm text-muted-foreground">Loading your sessions…</p>}

        {!isLoading && sessions.length === 0 && (
          <div className="rounded-2xl border border-border bg-card p-8 text-center">
            <h2 className="font-display text-lg font-semibold">No sessions yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Run your first voice interview and your transcript, scores and tips will show up
              here.
            </p>
            <Button asChild size="lg" className="mt-6">
              <Link to="/practice">Start a practice interview</Link>
            </Button>
          </div>
        )}

        {sessions.map((session) => {
          const categories = (session.category_scores as unknown as Category[]) ?? [];
          const strengths = (session.strengths as unknown as string[]) ?? [];
          const improvements = (session.improvements as unknown as string[]) ?? [];
          return (
            <article key={session.id} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="font-display text-lg font-semibold">
                    {session.experience_level} {session.role_title}
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(session.created_at).toLocaleString()} ·{" "}
                    {Math.max(1, Math.round(session.duration_seconds / 60))} min
                  </p>
                </div>
                <div className="grid size-14 place-items-center rounded-xl bg-secondary font-display text-xl font-bold">
                  {session.overall_score ?? "—"}
                </div>
              </div>

              {session.summary && (
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
                  {session.summary}
                </p>
              )}

              {categories.length > 0 && (
                <div className="mt-5 grid gap-4 sm:grid-cols-4">
                  {categories.map((category) => (
                    <div key={category.name}>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{category.name}</span>
                        <span className="text-foreground">{category.score}</span>
                      </div>
                      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${category.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(strengths.length > 0 || improvements.length > 0) && (
                <div className="mt-6 grid gap-6 border-t border-border pt-5 sm:grid-cols-2">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-success">
                      What worked
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                      {strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-accent">
                      Sharpen next
                    </h3>
                    <ul className="mt-3 space-y-2 text-sm leading-relaxed">
                      {improvements.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-2 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
