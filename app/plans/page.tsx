
import Link from "next/link";

const plans = [
  {
    name: "Tier 01",
    price: "$75",
    description: "A considered starting point",
    features: [
      "AI chat access",
      "Conversation history",
      "Core assistant experience",
    ],
  },
  {
    name: "Tier 02",
    price: "$150",
    description: "For more ambitious workflows",
    features: [
      "Everything in Tier 01",
      "Expanded usage allowance",
      "Priority feature access",
    ],
  },
  {
    name: "Tier 03",
    price: "$220",
    description: "For serious everyday use",
    features: [
      "Everything in Tier 02",
      "Higher usage allowance",
      "Advanced workspace features",
    ],
    popular: true,
  },
  {
    name: "Tier 04",
    price: "$330",
    description: "The complete BONIT experience",
    features: [
      "Everything in Tier 03",
      "Highest planned usage tier",
      "Future premium capabilities",
    ],
  },
];

export default function Plans() {
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

      <section className="plans-heading">
        <div className="landing-eyebrow">PLANS & ACCESS</div>
        <h1>Choose your <span>orbit.</span></h1>
        <p>
          Find the proposed BONIT AI tier that matches your workflow.
        </p>
        <div className="plans-notice">
          These are proposed pricing tiers. Subscription billing and checkout
          are not connected yet.
        </div>
      </section>

      <section className="plans-grid">
        {plans.map((plan) => (
          <article
            className={`plan-card ${plan.popular ? "plan-card-featured" : ""}`}
            key={plan.name}
          >
            {plan.popular && (
              <div className="plan-popular-label">FEATURED TIER</div>
            )}

            <div className="landing-eyebrow">{plan.name}</div>
            <h2 className="plan-price">
              {plan.price}
              <span> / month</span>
            </h2>

            <p className="plan-description">{plan.description}</p>

            <div className="plan-divider" />

            <ul className="plan-features">
              {plan.features.map((feature) => (
                <li key={feature}>
                  <span>✓</span> {feature}
                </li>
              ))}
            </ul>

            <a
              className="plan-button"
              href={`mailto:hello@bonitai.com?subject=${encodeURIComponent(
                `Enquiry about ${plan.name}`
              )}`}
            >
              Enquire about this tier <span>↗</span>
            </a>
          </article>
        ))}
      </section>

      <div className="plans-back">
        <Link href="/">← Back to home</Link>
      </div>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} BONIT AI</span>
        <span>Curious by design.</span>
      </footer>
    </main>
  );
}
