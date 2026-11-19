
import Link from "next/link";

const features = [
  {
    icon: "✧",
    title: "A thoughtful chat space",
    description:
      "Ask questions, explore ideas and work through complex topics in one focused interface.",
  },
  {
    icon: "◌",
    title: "A clearer workflow",
    description:
      "Keep conversations organised and return to the ideas that matter.",
  },
  {
    icon: "⌘",
    title: "Built to grow",
    description:
      "A flexible foundation for future tools, accounts and subscription features.",
  },
];

export default function Home() {
  return (
    <main className="site-shell">
      <nav className="site-nav">
        <Link href="/" className="site-logo">
          <span className="site-logo-mark">B</span>
          BONIT <span className="site-logo-light">AI</span>
        </Link>

        <div className="site-links">
          <Link href="/">Home</Link>
          <Link href="/plans">Plans</Link>
        </div>

        <Link href="/chat" className="site-nav-cta">
          Open BONIT <span>↗</span>
        </Link>
      </nav>

      <section className="landing-hero">
        <div className="landing-orb" />
        <div className="landing-eyebrow">
          A NEW PERSPECTIVE ON INTELLIGENCE
        </div>

        <h1>
          Make room for
          <br />
          <span>better thinking.</span>
        </h1>

        <p className="landing-description">
          Meet BONIT AI — a considered space to ask, create, discover and move
          ideas forward.
        </p>

        <div className="landing-actions">
          <Link href="/chat" className="landing-button primary">
            Start a conversation <span>↗</span>
          </Link>
          <Link href="/plans" className="landing-button secondary">
            Explore plans
          </Link>
        </div>

        <div className="landing-footnote">
          CURIOUS BY DESIGN · POWERED BY GROQ
        </div>
      </section>

      <section className="landing-section">
        <div className="landing-section-heading">
          <div className="landing-eyebrow">THE BONIT EXPERIENCE</div>
          <h2>Less noise. More possibility.</h2>
          <p>
            A clean interface and a capable AI assistant, designed to make
            every conversation feel intentional.
          </p>
        </div>

        <div className="landing-feature-grid">
          {features.map((feature) => (
            <article className="landing-feature" key={feature.title}>
              <div className="landing-feature-icon">{feature.icon}</div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div>
          <div className="landing-eyebrow">YOUR NEXT IDEA STARTS HERE</div>
          <h2>Open a conversation.</h2>
          <p>Bring a question. Leave with a new perspective.</p>
        </div>

        <Link href="/chat" className="landing-button primary">
          Enter BONIT AI <span>↗</span>
        </Link>
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} BONIT AI</span>
        <span>Curious by design.</span>
      </footer>
    </main>
  );
}
