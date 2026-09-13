import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Mic } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { getRole, practiceRoles } from "@/lib/roles-content";

const SITE = "https://cadence-dj.lovable.app";

export const Route = createFileRoute("/interview-questions/$role")({
  loader: ({ params }) => {
    const role = getRole(params.role);
    if (!role) throw notFound();
    return { role };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Not found — Cadence" }, { name: "robots", content: "noindex" }],
      };
    }
    const { role } = loaderData;
    const title = `${role.name} (${role.questions.length} Practice Questions) — Cadence`;
    const description = `${role.tagline} Practice out loud with an AI voice interviewer and get scored feedback on every answer.`;
    const url = `${SITE}/interview-questions/${params.role}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: role.name,
            itemListElement: role.questions.map((q, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: q,
            })),
          }),
        },
      ],
    };
  },
  component: RoleQuestionsPage,
  notFoundComponent: RoleNotFound,
});

function RoleNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-5 text-center">
      <h1 className="font-display text-3xl font-bold">Role not found</h1>
      <p className="mt-3 text-muted-foreground">
        We don't have a question set for that role yet.
      </p>
      <Button asChild className="mt-6">
        <Link to="/interview-questions">Browse all roles</Link>
      </Button>
    </div>
  );
}

function RoleQuestionsPage() {
  const { role } = Route.useLoaderData();
  const others = practiceRoles.filter((r) => r.slug !== role.slug).slice(0, 3);

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
        <Link
          to="/interview-questions"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          All roles
        </Link>

        <h1 className="mt-6 font-display text-4xl font-bold leading-tight">{role.name}</h1>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{role.description}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {role.levels.map((level) => (
            <span
              key={level}
              className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground"
            >
              {level}
            </span>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">Practice questions</h2>
          <ol className="mt-6 space-y-4">
            {role.questions.map((question, i) => (
              <li key={question} className="rounded-2xl border border-border bg-card p-5">
                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                  Question {i + 1}
                </span>
                <p className="mt-1.5 leading-relaxed">{question}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl font-semibold">What strong answers sound like</h2>
          <div className="mt-6 grid gap-4">
            {role.tips.map((tip) => (
              <div key={tip.title} className="rounded-2xl border border-border bg-card p-5">
                <h3 className="font-semibold">{tip.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{tip.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-surface-deep p-8">
          <h2 className="font-display text-2xl font-semibold text-on-dark">
            Practice these out loud
          </h2>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-on-dark-muted">
            Reading questions isn't the same as answering them. Run a free voice session as a{" "}
            {role.shortName.toLowerCase()} candidate and get a score with specific fixes.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 bg-on-dark text-surface-deep hover:bg-on-dark-muted"
          >
            <Link to="/auth">
              <Mic className="size-4" />
              Start a voice interview
            </Link>
          </Button>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-lg font-semibold">More roles</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {others.map((other) => (
              <Link
                key={other.slug}
                to="/interview-questions/$role"
                params={{ role: other.slug }}
                className="group flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary"
              >
                {other.shortName}
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
            <Link to="/interview-prep-guide" className="hover:text-on-dark">
              Interview prep guide
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
