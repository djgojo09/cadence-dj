export interface PracticeRole {
  slug: string;
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  levels: string[];
  skills: string[];
  questions: string[];
  tips: { title: string; body: string }[];
}

export const practiceRoles: PracticeRole[] = [
  {
    slug: "software-engineer",
    name: "Software Engineer Interview Questions",
    shortName: "Software Engineer",
    tagline: "Behavioral and technical questions asked in software engineering interviews.",
    description:
      "Software engineering interviews blend behavioral questions with system thinking. Interviewers listen for how you scope problems, make trade-offs, and measure results — not just what you built. Practicing out loud helps you turn project stories into clear, structured answers.",
    levels: ["Entry level", "Mid level", "Senior"],
    skills: ["Problem decomposition", "Technical trade-offs", "Collaboration", "Ownership", "Measuring impact"],
    questions: [
      "Tell me about a project where you significantly improved performance. What was the bottleneck and how did you find it?",
      "Describe a time you disagreed with a teammate about a technical approach. How did you resolve it?",
      "Walk me through how you would design a URL shortener. What trade-offs are you making?",
      "Tell me about a bug that was hard to track down. How did you debug it?",
      "Describe a time you had to ship something on a tight deadline. What did you cut and why?",
      "How do you approach reviewing code from a teammate you disagree with?",
      "Tell me about a time you improved the developer experience or tooling for your team.",
      "What's a technical decision you made that you'd make differently today?",
    ],
    tips: [
      {
        title: "Quantify the outcome",
        body: "Numbers make stories credible: load times, error rates, bundle size, users affected. Before the interview, write down two or three metrics per project.",
      },
      {
        title: "Narrate your trade-offs",
        body: "Strong candidates explain what they chose not to do and why. Interviewers score judgment, not just output.",
      },
      {
        title: "Keep answers under two minutes",
        body: "Aim for 60–90 seconds per answer, then pause. A follow-up question is a good sign; a rambling monologue is not.",
      },
    ],
  },
  {
    slug: "product-manager",
    name: "Product Manager Interview Questions",
    shortName: "Product Manager",
    tagline: "Product sense, strategy, and execution questions asked in PM interviews.",
    description:
      "Product manager interviews test structured thinking, prioritization, and communication. Most loops include product sense, execution, and behavioral rounds. Rehearsing answers out loud is the fastest way to make your frameworks sound natural instead of memorized.",
    levels: ["Associate PM", "Product Manager", "Senior PM"],
    skills: ["Prioritization", "Product sense", "Metrics and analytics", "Stakeholder communication", "Strategy"],
    questions: [
      "Tell me about a product you love. How would you improve it?",
      "How would you decide what to build next quarter for a product with flat growth?",
      "Describe a time you used data to change a product decision.",
      "How would you measure the success of a new onboarding flow?",
      "Tell me about a time you had to say no to an important stakeholder.",
      "Design a product to help people find a new job. Who is it for and what's the core loop?",
      "Describe a launch that didn't go as planned. What did you learn?",
      "How do you balance quick wins against long-term bets on a roadmap?",
    ],
    tips: [
      {
        title: "Lead with a framework, not a formula",
        body: "Name your structure — users, problems, solutions, metrics — then adapt it to the question. Rigid frameworks sound rehearsed; flexible ones sound senior.",
      },
      {
        title: "Define success before solving",
        body: "State the goal and the metric you'd move before proposing features. It shows you optimize for outcomes, not output.",
      },
      {
        title: "Practice the pause",
        body: "Taking five seconds to structure your answer reads as confidence. Silence is cheaper than backtracking.",
      },
    ],
  },
  {
    slug: "data-analyst",
    name: "Data Analyst Interview Questions",
    shortName: "Data Analyst",
    tagline: "SQL, analytics, and business-case questions asked in data analyst interviews.",
    description:
      "Data analyst interviews combine technical screens (SQL, statistics) with business-case questions about metrics and experimentation. Interviewers want to hear how you turn ambiguous questions into analysis a team can act on.",
    levels: ["Entry level", "Mid level", "Senior"],
    skills: ["SQL and querying", "Metric design", "Experimentation", "Data storytelling", "Business judgment"],
    questions: [
      "Tell me about an analysis that changed a business decision. What was your process?",
      "How would you measure whether a new feature is successful?",
      "Describe a time you found a data quality issue. How did you handle it?",
      "Walk me through how you'd investigate a sudden drop in daily active users.",
      "How do you explain a complex finding to a non-technical stakeholder?",
      "Tell me about a time your analysis was challenged. How did you respond?",
      "How would you design an A/B test for a pricing change?",
      "Describe a dashboard or report you built that people actually used. What made it work?",
    ],
    tips: [
      {
        title: "Structure case questions out loud",
        body: "Clarify the goal, state your hypotheses, then describe the data you'd pull. Saying your plan before diving in is what interviewers score.",
      },
      {
        title: "Prepare two metrics deep-dives",
        body: "Have ready one metric you designed and one you diagnosed after it moved. Both come up in nearly every loop.",
      },
      {
        title: "Talk about impact, not queries",
        body: "The differentiator at the end of an answer is what changed because of your work — a decision made, a cost saved, a launch reversed.",
      },
    ],
  },
  {
    slug: "marketing-manager",
    name: "Marketing Manager Interview Questions",
    shortName: "Marketing Manager",
    tagline: "Campaign, growth, and brand questions asked in marketing interviews.",
    description:
      "Marketing manager interviews probe how you plan campaigns, allocate budget, and prove results. Expect questions on channels you've run, experiments you've designed, and how you connect marketing activity to revenue.",
    levels: ["Marketing Manager", "Senior Marketing Manager", "Head of Marketing"],
    skills: ["Campaign strategy", "Budget allocation", "Analytics and attribution", "Positioning", "Cross-functional leadership"],
    questions: [
      "Walk me through a campaign you ran end to end. What worked and what would you change?",
      "How would you launch a product in a market where the category leader is well known?",
      "Tell me about a time a campaign underperformed. What did you do next?",
      "How do you decide how to split budget across channels?",
      "Describe how you've measured the return on a brand or content investment.",
      "Tell me about a time you repositioned a product or message. How did you know it was needed?",
      "How would you grow signups by 20% in a quarter with a fixed budget?",
      "Describe a time you aligned sales and marketing around a shared goal.",
    ],
    tips: [
      {
        title: "Anchor every story in a number",
        body: "Conversion rate, CAC, pipeline influenced, retention lift — pick the metric that mattered and put it in the first two sentences.",
      },
      {
        title: "Show your testing muscle",
        body: "Interviewers favor marketers who run disciplined experiments. Describe the hypothesis, the test, and the decision it drove.",
      },
      {
        title: "Connect activity to revenue",
        body: "Even for brand work, explain the chain from your campaign to a business outcome. It's the difference between a manager and a strategist.",
      },
    ],
  },
  {
    slug: "sales-representative",
    name: "Sales Representative Interview Questions",
    shortName: "Sales Representative",
    tagline: "Prospecting, discovery, and closing questions asked in sales interviews.",
    description:
      "Sales interviews test how you build pipeline, run discovery, and handle rejection. Many include a mock pitch or role-play, so practicing your answers out loud — with real pacing and tone — matters more here than in almost any other role.",
    levels: ["SDR", "Account Executive", "Senior AE"],
    skills: ["Discovery", "Objection handling", "Pipeline management", "Storytelling", "Closing"],
    questions: [
      "Walk me through your sales process from first touch to close.",
      "Tell me about the hardest deal you ever won. What made the difference?",
      "How do you handle a prospect who says your price is too high?",
      "Describe a quarter where you missed your number. What did you change?",
      "Pitch me the product you sell now, as if I were a skeptical buyer.",
      "How do you decide which accounts to spend your time on?",
      "Tell me about a deal you lost. What did you learn from it?",
      "How do you keep a long sales cycle moving without pestering the buyer?",
    ],
    tips: [
      {
        title: "Treat the interview like a discovery call",
        body: "Ask a question or two about the team's motion and targets. It demonstrates the exact skill they're hiring for.",
      },
      {
        title: "Know your numbers cold",
        body: "Quota attainment, average deal size, win rate, cycle length. Quoting real figures signals a rep who manages a real pipeline.",
      },
      {
        title: "Rehearse the objection answers",
        body: "Price, timing, and competitor objections appear in every loop. Record yourself answering each until it sounds conversational, not scripted.",
      },
    ],
  },
  {
    slug: "customer-success-manager",
    name: "Customer Success Manager Interview Questions",
    shortName: "Customer Success Manager",
    tagline: "Retention, renewal, and escalation questions asked in CSM interviews.",
    description:
      "Customer success interviews focus on retention stories: saving at-risk accounts, driving adoption, and growing renewals. Interviewers listen for empathy backed by process — playbooks, health scores, and clear commercial outcomes.",
    levels: ["Customer Success Manager", "Senior CSM", "Enterprise CSM"],
    skills: ["Relationship building", "Escalation handling", "Renewals and expansion", "Adoption playbooks", "Executive communication"],
    questions: [
      "Tell me about an at-risk account you saved. How did you know it was at risk?",
      "How do you run a quarterly business review for a customer who sees little value?",
      "Describe a time you turned an unhappy customer into a reference.",
      "How do you prioritize your book of business when everything feels urgent?",
      "Tell me about a renewal you lost. What would you do differently?",
      "How would you handle a customer demanding a feature your product doesn't have?",
      "Describe how you've identified and closed an expansion opportunity.",
      "How do you onboard a new customer in their first 30 days?",
    ],
    tips: [
      {
        title: "Frame stories around retention numbers",
        body: "Renewal rate, churn saved, expansion revenue — CSM interviews reward candidates who tie relationship work to commercial outcomes.",
      },
      {
        title: "Show your early-warning system",
        body: "Explain the signals you watch — usage drops, champion changes, support tickets — and the playbook each one triggers.",
      },
      {
        title: "Prepare one escalation story",
        body: "Every CSM loop asks about an angry customer. Structure yours: the stakes, what you did in the first 24 hours, and how the account ended.",
      },
    ],
  },
];

export function getRole(slug: string) {
  return practiceRoles.find((role) => role.slug === slug);
}
