import { Link } from "react-router-dom";

const heroImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC6Co8_PvtYGmXC2XeM1oVNHAn_I-lkgGO_0t5SSR8szeGVPdnmtCVQDf7Elg2MbEluTFj5R_d513G2Jp-GzOUG33zmbgdBX9BOVr1u2ij-deHXfqdsNeBB0XLvnnqIaiK46xKXiwaah0nfukoBJhOhwuk1GmQQQnKe5u21RntJLhO20cSlau982WwabwboBFRlT0Vt71hh0ULbdqSiUUYuC85eLw6nCa3jodsHiI402MHthAYtQjEq0htaUXhBEfLujDrOdsV0gkM";

const bentoImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCrPHS9OKyyJvrnc6acDrcZZrOa8LSN8f9SzpwPW52fvRHJFCthewkkuQDNifFI6Fsap99hQ7kBQOqn_nmzggW14as1AOcawpLDxwlD6D_4ThhhPY5Jo0fma-nHHNlEPIY2XsJGnnNk2zAvdmja8X9C5yh1TkI6wRFPDnYWAC17J_ZtGLhQEDxn4mUctf2qm5b6SD2ySCDU_z3c8ST2s1Nu1Tbz3-WrOoAoh-3cmEGFmMNmifoW-cwrQVB9y-5e9Fq18SHHkHQGQPQ";

const ctaBgImg =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD88SmJ512bBYjctGh43LZM7MdKkvf0NcncOugujiWyOwXpiU9Oq8-SdVJYxOaPDW-LPC9ksYxxh4my0_xuNm9k4-2tBnDljRSMlNNqCDzmRRiteXlgYzxbWyCaisVe62e0h-ETYXuxSI1F3iGElpnv81KIrgw1_nb-_bTb2tdkcy2I7nmjjuvOLDbeHpDBuqzLM8VnucMp-pKbhmqgK0xJbUqc25Xp_0RAD8sB2GoOlTFL3KAMTO4e30mkCPmHT8L4GffNKH3JtiY";

function HomePage() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <Link className="landing-brand" to="/">
          <span className="landing-logo-mark" aria-hidden>
            <span className="material-symbols-outlined" style={{ fontSize: "1.35rem", fontVariationSettings: "'FILL' 1" }}>
              eco
            </span>
          </span>
          <span className="landing-wordmark">Spore</span>
        </Link>
        <div className="landing-nav-actions">
          <Link className="landing-nav-link" to="/home">
            Open app
          </Link>
          <Link className="landing-nav-pill" to="/home">
            Enter with invite
          </Link>
        </div>
      </header>

      <main>
        <section className="landing-hero">
          <div className="landing-hero-glow" aria-hidden />
          <div className="landing-container">
            <div className="landing-hero-inner">
              <div className="landing-eyebrow">
                <span className="landing-eyebrow-dot" />
                Private beta
              </div>
              <h1 className="landing-title">
                Small circles.
                <br />
                Steady support.
              </h1>
              <p className="landing-lede">
                A calm space for people you trust—gentle check-ins and thoughtful prompts when someone might need a
                little extra care.
              </p>
              <div className="landing-cta-row">
                <Link className="landing-btn landing-btn--primary landing-btn--wide" to="/home">
                  Get started
                </Link>
                <Link className="landing-btn landing-btn--secondary landing-btn--wide" to="/home">
                  Enter with invite
                </Link>
              </div>
            </div>

            <div className="landing-hero-media">
              <div className="landing-hero-frame">
                <div className="landing-hero-frame-inner">
                  <img alt="" src={heroImg} />
                  <div className="landing-float-card">
                    <div className="landing-float-card-head">
                      <div className="landing-float-icon">
                        <span className="material-symbols-outlined" style={{ fontSize: "1.35rem" }}>
                          favorite
                        </span>
                      </div>
                      <div>
                        <h3>A gentle note</h3>
                        <p className="sub">Inner circle</p>
                      </div>
                    </div>
                    <p>
                      The group&apos;s been a little quieter lately—a low-key hello might help everyone feel seen.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section landing-section--layer">
          <div className="landing-container">
            <div className="landing-features">
              <div className="landing-feature">
                <div className="landing-feature-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: "1.75rem" }}>
                    groups
                  </span>
                </div>
                <h3>Trusted circles</h3>
                <p>
                  Built for intimacy—small groups of people who actually know each other, where support can feel natural.
                </p>
                <ul className="landing-checklist">
                  <li>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    No public profiles
                  </li>
                  <li>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    Invite-only spaces
                  </li>
                </ul>
              </div>
              <div className="landing-feature">
                <div className="landing-feature-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: "1.75rem" }}>
                    shield_person
                  </span>
                </div>
                <h3>Privacy-first patterns</h3>
                <p>
                  You see the shape of how the circle is doing—not a feed of personal surveillance. Personal detail stays
                  where it belongs.
                </p>
                <ul className="landing-checklist">
                  <li>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    Check-ins you control
                  </li>
                  <li>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    Shared context, not exposure
                  </li>
                </ul>
              </div>
              <div className="landing-feature">
                <div className="landing-feature-icon">
                  <span className="material-symbols-outlined" style={{ fontSize: "1.75rem" }}>
                    auto_awesome
                  </span>
                </div>
                <h3>Thoughtful prompts</h3>
                <p>
                  Light suggestions for when to reach out and what to say—so connection feels easier, not performative.
                </p>
                <ul className="landing-checklist">
                  <li>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    Warm, optional nudges
                  </li>
                  <li>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      check_circle
                    </span>
                    Empathy-forward tone
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-container">
            <div className="landing-mosaic-head">
              <h2>Space to breathe</h2>
              <p>Tools that stay out of the way until you need them—never a dashboard yelling for attention.</p>
            </div>
            <div className="landing-mosaic">
              <div className="landing-tile landing-tile--large landing-tile--tint-green">
                <span className="landing-tile-kicker">Reflection</span>
                <h4>Your words stay yours</h4>
                <p>
                  Optional insights can help you notice patterns over time—without turning your journal into something
                  exposed or scored.
                </p>
                <div className="landing-tile-deco" aria-hidden>
                  <img alt="" src={bentoImg} />
                </div>
              </div>
              <div className="landing-tile landing-tile--side landing-tile--tint-blue">
                <div className="landing-tile-icon">
                  <span className="material-symbols-outlined">notifications</span>
                </div>
                <h4>Soft nudges</h4>
                <p>
                  Nothing buzzes like an alarm. You might see a quiet suggestion when a friend could use a text or a
                  walk.
                </p>
              </div>
              <div className="landing-tile landing-tile--half landing-tile--tint-warm">
                <h4>Shared rhythm</h4>
                <p>A simple sense of how the circle is doing—grounded, human, never a leaderboard.</p>
              </div>
              <div className="landing-tile landing-tile--half landing-tile--tint-blue">
                <h4>Room to opt in</h4>
                <p>Every prompt is optional. You choose what you share, and when—without pressure to perform.</p>
              </div>
              <div className="landing-tile landing-tile--wide landing-tile--tint-rose">
                <div className="landing-tile-row">
                  <div>
                    <h4>Invitations that feel intentional</h4>
                    <p>Bring in only the people who belong in the room. Spore stays a closed, gentle ecosystem by design.</p>
                  </div>
                  <div className="landing-tile-orbs" aria-hidden>
                    <div className="landing-tile-orb">
                      <span className="material-symbols-outlined">person_add</span>
                    </div>
                    <div className="landing-tile-orb">
                      <span className="material-symbols-outlined">mail</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-section">
          <div className="landing-container">
            <div className="landing-cta">
              <div className="landing-cta-bg">
                <img alt="" src={ctaBgImg} />
              </div>
              <h2>Ready to tend your circle?</h2>
              <p>Invite-only for now—so every space stays safe, small, and cared for.</p>
              <div className="landing-cta-actions">
                <Link className="landing-btn landing-btn--on-dark" to="/home">
                  Request an invite
                </Link>
                <a className="landing-cta-link" href="#">
                  Read our care principles
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-container landing-footer-grid">
          <div>
            <div className="landing-footer-brand">
              <span className="landing-logo-mark" aria-hidden>
                <span className="material-symbols-outlined" style={{ fontSize: "1rem", fontVariationSettings: "'FILL' 1" }}>
                  eco
                </span>
              </span>
              <span>Spore</span>
            </div>
            <p className="landing-footer-lede">
              A private, calm companion for the people you trust—built with care for emotional safety.
            </p>
            <p className="landing-footer-copy">© 2026 Spore Labs</p>
          </div>
          <div className="landing-footer-col">
            <h5>Product</h5>
            <ul>
              <li>
                <a href="#">Safety &amp; care</a>
              </li>
              <li>
                <a href="#">How we use AI</a>
              </li>
              <li>
                <a href="#">For communities</a>
              </li>
              <li>
                <a href="#">Roadmap</a>
              </li>
            </ul>
          </div>
          <div className="landing-footer-col">
            <h5>Company</h5>
            <ul>
              <li>
                <a href="#">Our story</a>
              </li>
              <li>
                <a href="#">Privacy</a>
              </li>
              <li>
                <a href="#">Terms</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
