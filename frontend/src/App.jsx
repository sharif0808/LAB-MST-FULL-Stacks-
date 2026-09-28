import { useEffect, useState } from "react";
import "./App.css";

function LoadingScreen({ type }) {
  const content = {
    login: {
      title: "Authenticating",
      text: "Verifying your credentials and preparing your secure workspace...",
    },

    logout: {
      title: "Signing You Out",
      text: "Closing your session and clearing authentication data...",
    },

    reload: {
      title: "Restoring Session",
      text: "Checking your JWT and restoring your protected workspace...",
    },
  };

  return (
    <div className={`loading-screen ${type}`}>
      <div className="loading-bg-glow"></div>

      <div className="loading-box">

        {type === "login" && (
          <div className="login-loader">
            <div className="auth-ring ring-one"></div>

            <div className="auth-ring ring-two"></div>

            <div className="auth-center">
              ✓
            </div>
          </div>
        )}

        {type === "logout" && (
          <div className="logout-loader">
            <div className="logout-door"></div>

            <div className="logout-arrow">
              →
            </div>
          </div>
        )}

        {type === "reload" && (
          <div className="reload-loader">
            <div className="reload-ring"></div>

            <div className="reload-center">
              ↻
            </div>
          </div>
        )}

        <h1>
          {content[type].title}
        </h1>

        <p>
          {content[type].text}
        </p>

        <div className="loading-progress">
          <span></span>
        </div>

        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>

      </div>
    </div>
  );
}


function App() {
  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  const [user, setUser] =
    useState(null);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [loadingType, setLoadingType] =
    useState("reload");


  const wait = (milliseconds) => {
    return new Promise((resolve) => {
      setTimeout(resolve, milliseconds);
    });
  };


  // Restore session when page loads/reloads
  useEffect(() => {
    let cancelled = false;

    const restoreSession = async () => {
      setLoadingType("reload");
      setLoading(true);

      const savedToken =
        localStorage.getItem("token");

      if (savedToken) {
        try {
          const response = await fetch(
            "http://localhost:5000/api/dashboard",
            {
              headers: {
                Authorization:
                  `Bearer ${savedToken}`,
              },
            }
          );

          const data =
            await response.json();

          if (!response.ok) {
            localStorage.removeItem(
              "token"
            );

            if (!cancelled) {
              setToken(null);
              setUser(null);
            }
          } else {
            if (!cancelled) {
              setToken(savedToken);

              setUser({
                userId: data.userId,
                role: data.role,
              });
            }
          }
        } catch (error) {
          console.error(error);

          localStorage.removeItem(
            "token"
          );

          if (!cancelled) {
            setToken(null);
            setUser(null);

            setError(
              "Unable to verify session. Make sure the backend is running."
            );
          }
        }
      }

      await wait(1600);

      if (!cancelled) {
        setLoading(false);
      }
    };

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);


  // Login
  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(data.message);

        return;
      }

      localStorage.setItem(
        "token",
        data.token
      );

      setLoadingType("login");
      setLoading(true);

      await wait(1700);

      setToken(data.token);
      setUser(data.user);

      setLoading(false);

    } catch (error) {
      console.error(error);

      setError(
        "Unable to connect to backend"
      );
    }
  };


  // Logout
  const handleLogout = async () => {
    setLoadingType("logout");
    setLoading(true);

    await wait(1500);

    localStorage.removeItem("token");

    setToken(null);
    setUser(null);

    setUsername("");
    setPassword("");

    setShowPassword(false);

    setError("");

    setLoading(false);
  };


  // Loading screen
  if (loading) {
    return (
      <LoadingScreen
        type={loadingType}
      />
    );
  }


  // LOGIN PAGE
  if (!token) {
    return (
      <div className="app">

        <div className="neon-orb orb-one">
        </div>

        <div className="neon-orb orb-two">
        </div>

        <div className="login-card">

          <div className="security-status-top">

            <span></span>

            SECURE AUTHENTICATION

          </div>


          <div className="login-logo">
            🔐
          </div>


          <h1>
            JWT Authentication
          </h1>


          <p className="subtitle">
            Secure access to your protected
            science knowledge dashboard
          </p>


          <form onSubmit={handleLogin}>

            <div className="input-group">

              <label>
                Username
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  👤
                </span>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                    )
                  }
                  required
                />

              </div>

            </div>


            <div className="input-group">

              <label>
                Password
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  🔑
                </span>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />


                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  title={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M3 3l18 18" />

                      <path d="M10.6 10.6a2 2 0 002.8 2.8" />

                      <path d="M9.9 4.2A10.7 10.7 0 0112 4c5.5 0 9.5 5 9.5 5a16 16 0 01-3 3.7" />

                      <path d="M6.6 6.6C4.1 8.2 2.5 12 2.5 12s4 5 9.5 5a10 10 0 004-.8" />
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      width="20"
                      height="20"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M2.5 12s4-6 9.5-6 9.5 6 9.5 6-4 6-9.5 6-9.5-6-9.5-6z" />

                      <circle
                        cx="12"
                        cy="12"
                        r="3"
                      />
                    </svg>
                  )}

                </button>

              </div>

            </div>


            {error && (
              <div className="error">
                {error}
              </div>
            )}


            <button
              className="login-btn"
              type="submit"
            >

              <span>
                LOGIN SECURELY
              </span>

              <span className="login-arrow">
                →
              </span>

            </button>

          </form>


          <div className="secure-line">

            <span></span>

            <p>
              JWT Protected Access
            </p>

            <span></span>

          </div>


          <div className="demo-box">

            <div className="demo-title">
              Demo Credentials
            </div>


            <div className="demo-account">

              <div>
                <span>
                  ADMIN
                </span>
              </div>

              <p>
                admin / admin123
              </p>

            </div>


            <div className="demo-account">

              <div>
                <span>
                  USER
                </span>
              </div>

              <p>
                user / user123
              </p>

            </div>

          </div>


          <div className="login-footer">

            <span className="footer-dot">
            </span>

            Token based secure authentication

          </div>

        </div>

      </div>
    );
  }


  // PROTECTED HOME PAGE
  return (
    <div className="dashboard">

      <nav className="navbar">

        <div className="brand">

          <div className="brand-icon">
            ⚛
          </div>

          <div>

            <h2>
              Science Knowledge Hub
            </h2>

            <small>
              JWT Protected Dashboard
            </small>

          </div>

        </div>


        <div className="nav-right">

          <span className="online-dot">
          </span>

          <span className="role">
            {user?.role}
          </span>

          <button
            className="logout-btn"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>


      <main className="dashboard-content">

        {/* HERO */}

        <section className="dashboard-hero">

          <div className="hero-content">

            <div className="hero-badge">

              <span></span>

              JWT AUTHENTICATED SESSION

            </div>


            <h1>
              Welcome to the
              <span>
                {" "}Science Knowledge Hub
              </span>
            </h1>


            <p>
              Explore scientific concepts from
              physics, astronomy, biology,
              artificial intelligence and
              cosmology inside your protected
              dashboard.
            </p>


            <div className="hero-user-info">

              <div>

                <small>
                  USER ID
                </small>

                <strong>
                  #{user?.userId}
                </strong>

              </div>


              <div>

                <small>
                  ROLE
                </small>

                <strong>
                  {user?.role}
                </strong>

              </div>


              <div>

                <small>
                  SESSION
                </small>

                <strong className="active-text">
                  ● Secure
                </strong>

              </div>

            </div>

          </div>


          <div className="science-atom">

            <div className="atom">

              <div className="nucleus">
              </div>


              <div className="orbit orbit-1">
                <span></span>
              </div>


              <div className="orbit orbit-2">
                <span></span>
              </div>


              <div className="orbit orbit-3">
                <span></span>
              </div>

            </div>

          </div>

        </section>


        {/* AUTHENTICATION INFORMATION */}

        <section className="account-cards">

          <div className="info-card">

            <div className="info-icon blue">
              #
            </div>

            <div>

              <p>
                User ID
              </p>

              <h3>
                {user?.userId}
              </h3>

            </div>

          </div>


          <div className="info-card">

            <div className="info-icon purple">
              ◈
            </div>

            <div>

              <p>
                User Role
              </p>

              <h3>
                {user?.role}
              </h3>

            </div>

          </div>


          <div className="info-card">

            <div className="info-icon green">
              ✓
            </div>

            <div>

              <p>
                Authentication
              </p>

              <h3 className="authenticated">
                Verified
              </h3>

            </div>

          </div>


          <div className="info-card">

            <div className="info-icon cyan">
              JWT
            </div>

            <div>

              <p>
                Token Status
              </p>

              <h3>
                Valid
              </h3>

            </div>

          </div>

        </section>


        {/* SCIENCE HEADING */}

        <section className="science-heading">

          <p className="section-label">
            EXPLORE SCIENCE
          </p>

          <h2>
            Scientific Knowledge
          </h2>

          <p>
            Encyclopedia-style introductions
            to important scientific concepts.
          </p>

        </section>


        {/* SCIENCE CARDS */}

        <section className="science-grid">

          <article className="science-card physics-card">

            <div className="science-card-top">

              <span className="science-icon">
                ⚛
              </span>

              <span className="category">
                PHYSICS
              </span>

            </div>


            <h2>
              Quantum Mechanics
            </h2>


            <p>
              Quantum mechanics describes the
              behaviour of matter and energy at
              atomic and subatomic scales. At
              these scales, physical systems can
              behave very differently from objects
              in everyday classical physics.
            </p>


            <div className="science-fact">

              <strong>
                Did you know?
              </strong>

              <span>
                Light demonstrates both wave-like
                and particle-like behaviour.
              </span>

            </div>

          </article>


          <article className="science-card space-card">

            <div className="science-card-top">

              <span className="science-icon">
                🌌
              </span>

              <span className="category">
                ASTRONOMY
              </span>

            </div>


            <h2>
              Black Holes
            </h2>


            <p>
              A black hole is a region of spacetime
              where gravity becomes so strong that
              objects crossing its event horizon
              cannot escape. Stellar black holes
              can form after the collapse of
              massive stars.
            </p>


            <div className="science-fact">

              <strong>
                Supermassive Black Holes
              </strong>

              <span>
                Many large galaxies contain a
                supermassive black hole near
                their centres.
              </span>

            </div>

          </article>


          <article className="science-card biology-card">

            <div className="science-card-top">

              <span className="science-icon">
                🧬
              </span>

              <span className="category">
                BIOLOGY
              </span>

            </div>


            <h2>
              DNA
            </h2>


            <p>
              DNA stands for deoxyribonucleic acid.
              It stores genetic information used
              by living organisms for development,
              reproduction and biological
              functions.
            </p>


            <div className="science-fact">

              <strong>
                Four Bases
              </strong>

              <span>
                DNA uses adenine, thymine,
                cytosine and guanine as its
                four nucleotide bases.
              </span>

            </div>

          </article>


          <article className="science-card ai-card">

            <div className="science-card-top">

              <span className="science-icon">
                🤖
              </span>

              <span className="category">
                COMPUTER SCIENCE
              </span>

            </div>


            <h2>
              Artificial Intelligence
            </h2>


            <p>
              Artificial intelligence is the field
              of computing focused on creating
              systems that can perform tasks such
              as learning, reasoning, perception,
              language processing and
              decision-making.
            </p>


            <div className="science-fact">

              <strong>
                Machine Learning
              </strong>

              <span>
                Machine-learning systems discover
                patterns from data to make
                predictions or decisions.
              </span>

            </div>

          </article>


          <article className="science-card relativity-card">

            <div className="science-card-top">

              <span className="science-icon">
                ⏱
              </span>

              <span className="category">
                RELATIVITY
              </span>

            </div>


            <h2>
              Theory of Relativity
            </h2>


            <p>
              Einstein's theories of special and
              general relativity changed our
              understanding of space, time,
              motion and gravity. General
              relativity describes gravity using
              the curvature of spacetime.
            </p>


            <div className="formula-box">
              E = mc²
            </div>

          </article>


          <article className="science-card universe-card">

            <div className="science-card-top">

              <span className="science-icon">
                ✨
              </span>

              <span className="category">
                COSMOLOGY
              </span>

            </div>


            <h2>
              The Universe
            </h2>


            <p>
              The observable universe contains
              enormous numbers of galaxies, stars,
              planets, gas and other forms of
              matter and energy. Astronomical
              observations show that the universe
              is expanding.
            </p>


            <div className="science-fact">

              <strong>
                Looking into the past
              </strong>

              <span>
                Because light takes time to travel,
                observing distant galaxies means
                seeing them as they were long ago.
              </span>

            </div>

          </article>

        </section>


        {/* FEATURED ARTICLE */}

        <section className="feature-article">

          <div className="article-label">
            FEATURED SCIENCE ARTICLE
          </div>


          <div className="article-layout">

            <div className="article-content">

              <p className="article-category">
                ATOMIC PHYSICS
              </p>


              <h2>
                What exactly is an atom?
              </h2>


              <p>
                An atom is a basic unit of ordinary
                matter. It consists of a small
                nucleus containing protons and
                neutrons, surrounded by electrons.
              </p>


              <p>
                Almost all of an atom's mass is
                concentrated inside its nucleus.
                Electrons occupy quantum states
                around the nucleus rather than
                travelling in simple planetary
                paths.
              </p>


              <p>
                Chemical elements are defined by
                the number of protons inside their
                nuclei. Hydrogen has one proton,
                carbon has six and oxygen has eight.
              </p>

            </div>


            <div className="article-stats">

              <div className="stat">

                <strong>
                  118
                </strong>

                <span>
                  Recognized chemical elements
                </span>

              </div>


              <div className="stat">

                <strong>
                  ~10⁻¹⁰ m
                </strong>

                <span>
                  Typical atomic scale
                </span>

              </div>


              <div className="stat">

                <strong>
                  3
                </strong>

                <span>
                  Familiar subatomic particle types
                </span>

              </div>

            </div>

          </div>

        </section>


        {/* QUICK FACTS */}

        <section className="quick-facts">

          <div className="quick-title">

            <p className="section-label">
              QUICK FACTS
            </p>

            <h2>
              Science in Numbers
            </h2>

          </div>


          <div className="fact-grid">

            <div className="fact-item">

              <strong>
                299,792,458
              </strong>

              <span>
                metres per second
              </span>

              <p>
                Speed of light in vacuum
              </p>

            </div>


            <div className="fact-item">

              <strong>
                ~4.54 Billion
              </strong>

              <span>
                years
              </span>

              <p>
                Approximate age of Earth
              </p>

            </div>


            <div className="fact-item">

              <strong>
                8
              </strong>

              <span>
                planets
              </span>

              <p>
                In our Solar System
              </p>

            </div>


            <div className="fact-item">

              <strong>
                H₂O
              </strong>

              <span>
                molecule
              </span>

              <p>
                Chemical formula of water
              </p>

            </div>

          </div>

        </section>


        {/* SECURITY */}

        <section className="protected-card">

          <div>

            <span className="protected-label">
              🔐 JWT PROTECTED
            </span>

            <h2>
              Secure Knowledge Environment
            </h2>

            <p>
              This page is displayed only after
              your JWT has been successfully
              verified by the Node.js backend.
            </p>

          </div>


          <div className="security-status">

            <span></span>

            JWT Valid

          </div>

        </section>


        <footer className="dashboard-footer">

          <p>
            JWT Authentication • React • Node.js • Express
          </p>

          <span>
            Protected Science Dashboard
          </span>

        </footer>

      </main>

    </div>
  );
}

export default App;