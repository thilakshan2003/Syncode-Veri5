import './LandingPage.css';

function LandingPage() {
  return (
    <div className="landing-page">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M28.2188 5.25C31.1354 5.25 33.5781 6.32917 35.5469 8.4875C37.5156 10.6458 38.5 13.2125 38.5 16.1875C38.5 16.7125 38.4708 17.2302 38.4125 17.7406C38.3542 18.251 38.2521 18.7542 38.1063 19.25H27.1687L24.1938 14.7875C24.0479 14.5542 23.8438 14.3646 23.5812 14.2188C23.3188 14.0729 23.0417 14 22.75 14C22.3708 14 22.0281 14.1167 21.7219 14.35C21.4156 14.5833 21.2042 14.875 21.0875 15.225L18.725 22.3125L17.1937 20.0375C17.0479 19.8042 16.8438 19.6146 16.5813 19.4688C16.3187 19.3229 16.0417 19.25 15.75 19.25H3.89375C3.74792 18.7542 3.64583 18.251 3.5875 17.7406C3.52917 17.2302 3.5 16.7271 3.5 16.2312C3.5 13.2271 4.47708 10.6458 6.43125 8.4875C8.38542 6.32917 10.8208 5.25 13.7375 5.25C15.1375 5.25 16.4573 5.52708 17.6969 6.08125C18.9365 6.63542 20.0375 7.40833 21 8.4C21.9333 7.40833 23.0198 6.63542 24.2594 6.08125C25.499 5.52708 26.8188 5.25 28.2188 5.25ZM21 36.75C20.475 36.75 19.9719 36.6552 19.4906 36.4656C19.0094 36.276 18.5792 35.9917 18.2 35.6125L6.475 23.8438C6.3 23.6687 6.13958 23.4937 5.99375 23.3188C5.84792 23.1437 5.70208 22.9542 5.55625 22.75H14.7875L17.7625 27.2125C17.9083 27.4458 18.1125 27.6354 18.375 27.7812C18.6375 27.9271 18.9146 28 19.2063 28C19.5854 28 19.9354 27.8833 20.2563 27.65C20.5771 27.4167 20.7958 27.125 20.9125 26.775L23.275 19.6875L24.7625 21.9625C24.9375 22.1958 25.1562 22.3854 25.4187 22.5312C25.6812 22.6771 25.9583 22.75 26.25 22.75H36.4L35.9625 23.275L35.525 23.8L23.7563 35.6125C23.3771 35.9917 22.9542 36.276 22.4875 36.4656C22.0208 36.6552 21.525 36.75 21 36.75Z" fill="#28A99E"/>
          </svg>
          <span className="logo-text">Veri5</span>
        </div>
        <nav className="nav">
          <a href="#health-dashboard" className="nav-link">Health Dashboard</a>
          <a href="#testing" className="nav-link">Testing</a>
          <a href="#consultation" className="nav-link">Consultation</a>
          <a href="#resources" className="nav-link">Resources</a>
        </nav>
        <button className="login-btn">Login</button>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-badge">Secure Verification</div>
        <h1 className="hero-title">
          Your health, <span className="hero-title-accent">Your privacy</span>
        </h1>
        <p className="hero-description">
          A privacy-first sexual health verification platform focused on trust and dignity. Securely verify and share your status without compromising your identity.
        </p>
        <div className="hero-actions">
          <button className="btn-primary">Get Started Now</button>
          <a href="/security">
            <button className="btn-secondary">Our Privacy Policy</button>
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="features-header">
          <h2 className="features-title">Simple. Secure. Respectful.</h2>
          <p className="features-subtitle">We've redesigned the verification process to prioritize your dignity.</p>
        </div>
        
        <div className="features-grid">
          <a href="/testing" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_90_3)">
                    <path d="M18.5 1.54175C10.1817 1.54175 3.41669 8.30675 3.41669 16.6251C3.41669 22.0001 6.34919 26.6734 10.6667 29.2051V35.4584L16.52 31.9792C17.1642 32.0684 17.8238 32.1251 18.5 32.1251C26.8184 32.1251 33.5834 25.3601 33.5834 16.6251C33.5834 8.29008 26.8184 1.54175 18.5 1.54175ZM20.0417 23.1667H16.9584V20.0834H20.0417V23.1667ZM20.0417 16.6251H16.9584V9.87508H20.0417V16.6251Z" fill="#28A99E"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_90_3">
                      <rect width="37" height="37" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h3 className="feature-title">Test</h3>
              <p className="feature-description">
                Visit a partner lab for a screening or securely upload your existing certified health results.
              </p>
            </div>
          </a>

          <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_90_11)">
                    <path d="M28.2188 5.25C31.1354 5.25 33.5781 6.32917 35.5469 8.4875C37.5156 10.6458 38.5 13.2125 38.5 16.1875C38.5 16.7125 38.4708 17.2302 38.4125 17.7406C38.3542 18.251 38.2521 18.7542 38.1063 19.25H27.1687L24.1938 14.7875C24.0479 14.5542 23.8438 14.3646 23.5812 14.2188C23.3188 14.0729 23.0417 14 22.75 14C22.3708 14 22.0281 14.1167 21.7219 14.35C21.4156 14.5833 21.2042 14.875 21.0875 15.225L18.725 22.3125L17.1937 20.0375C17.0479 19.8042 16.8438 19.6146 16.5813 19.4688C16.3187 19.3229 16.0417 19.25 15.75 19.25H3.89375C3.74792 18.7542 3.64583 18.251 3.5875 17.7406C3.52917 17.2302 3.5 16.7271 3.5 16.2312C3.5 13.2271 4.47708 10.6458 6.43125 8.4875C8.38542 6.32917 10.8208 5.25 13.7375 5.25C15.1375 5.25 16.4573 5.52708 17.6969 6.08125C18.9365 6.63542 20.0375 7.40833 21 8.4C21.9333 7.40833 23.0198 6.63542 24.2594 6.08125C25.499 5.52708 26.8188 5.25 28.2188 5.25ZM21 36.75C20.475 36.75 19.9719 36.6552 19.4906 36.4656C19.0094 36.276 18.5792 35.9917 18.2 35.6125L6.475 23.8438C6.3 23.6687 6.13958 23.4937 5.99375 23.3188C5.84792 23.1437 5.70208 22.9542 5.55625 22.75H14.7875L17.7625 27.2125C17.9083 27.4458 18.1125 27.6354 18.375 27.7812C18.6375 27.9271 18.9146 28 19.2063 28C19.5854 28 19.9354 27.8833 20.2563 27.65C20.5771 27.4167 20.7958 27.125 20.9125 26.775L23.275 19.6875L24.7625 21.9625C24.9375 22.1958 25.1562 22.3854 25.4187 22.5312C25.6812 22.6771 25.9583 22.75 26.25 22.75H36.4L35.9625 23.275L35.525 23.8L23.7563 35.6125C23.3771 35.9917 22.9542 36.276 22.4875 36.4656C22.0208 36.6552 21.525 36.75 21 36.75Z" fill="#28A99E"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_90_11">
                      <rect width="37" height="37" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h3 className="feature-title">Health Dashboard</h3>
              <p className="feature-description">
                Our secure system validates data using zero-knowledge proofs without storing your identity or raw data.
              </p>
            </div>
          </a>

          <a href="/dashboard" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_90_19)">
                    <path d="M24.6667 7.70842L22.4775 9.89758L20.0263 7.44633V24.6667H16.9738V7.44633L14.5225 9.89758L12.3334 7.70842L18.5 1.54175L24.6667 7.70842ZM30.8334 15.4167V32.3751C30.8334 34.0709 29.4459 35.4584 27.75 35.4584H9.25002C7.53877 35.4584 6.16669 34.0709 6.16669 32.3751V15.4167C6.16669 13.7055 7.53877 12.3334 9.25002 12.3334H13.875V15.4167H9.25002V32.3751H27.75V15.4167H23.125V12.3334H27.75C29.4459 12.3334 30.8334 13.7055 30.8334 15.4167Z" fill="#28A99E"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_90_19">
                      <rect width="37" height="37" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <h3 className="feature-title">Share Status</h3>
              <p className="feature-description">
                Share your status via the app to another user. Statuses are End to end encrypted and expire after a set duration.
              </p>
            </div>
          </a>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="trusted">
        <p className="trusted-text">Trusted by leading health institutions</p>
        <div className="trusted-logos">
          <div className="trusted-logo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6667 6.66667H9.33333V1.33333H6.66667V6.66667H1.33333V9.33333H6.66667V14.6667H9.33333V9.33333H14.6667V6.66667Z" fill="#A0BDB9"/>
            </svg>
            <span>LANKA HOSPITALS</span>
          </div>
          <div className="trusted-logo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6667 6.66667H9.33333V1.33333H6.66667V6.66667H1.33333V9.33333H6.66667V14.6667H9.33333V9.33333H14.6667V6.66667Z" fill="#A0BDB9"/>
            </svg>
            <span>MEDIHELP</span>
          </div>
          <div className="trusted-logo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6667 6.66667H9.33333V1.33333H6.66667V6.66667H1.33333V9.33333H6.66667V14.6667H9.33333V9.33333H14.6667V6.66667Z" fill="#A0BDB9"/>
            </svg>
            <span>KNOW4SURE</span>
          </div>
          <div className="trusted-logo">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_trusted)">
                <path d="M8 1.33333L3.33333 3.33333V7.33333C3.33333 10.9467 5.86667 14.3467 8 15C10.1333 14.3467 12.6667 10.9467 12.6667 7.33333V3.33333L8 1.33333ZM8 7.98667H11.3333C10.9467 10.5067 9.28 12.8 8 13.6267V8H4.66667V4.14667L8 2.61333V7.98667Z" fill="#A0BDB9"/>
              </g>
              <defs>
                <clipPath id="clip0_trusted">
                  <rect width="16" height="16" fill="white"/>
                </clipPath>
              </defs>
            </svg>
            <span>ASIRI LABORATORIES</span>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <h2 className="cta-title">Ready to take control of your sexual health privacy?</h2>
        <p className="cta-description">
          Join thousands of others who prioritize trust and responsibility. Your dignity is just a few clicks away.
        </p>
        <button className="btn-primary">Create Private Account</button>
      </section>
    </div>
  );
}

export default LandingPage;
