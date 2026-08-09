import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      {/* Navbar */}
      <header className="navbar">
        <div className="logo">
          <span>🐟</span> RR Sea Foods
        </div>

        <div className="nav-buttons">
          <button
            className="btn-ghost"
            onClick={() => navigate("/login")}
          >
            Login
          </button>

          <button
            className="btn-primary"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="hero">
        <div className="hero-left">
          <span className="hero-tag">🌊 Fresh From Ocean</span>

          <h1>
            Fresh Seafood <br />
            Delivered to <span>Your Doorstep</span>
          </h1>

          <p>
            Experience premium quality seafood sourced directly from trusted
            fishermen. Fresh, hygienic and delivered with care.
          </p>

          <div className="hero-buttons">
            <button
              className="btn-primary btn-lg"
              onClick={() => navigate("/register")}
            >
              Get Started
            </button>

            <button
              className="btn-outline btn-lg"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>

        <div className="hero-right">
          <img
            src="/logo.png"
            alt="RR Sea Foods"
            className="hero-logo"
          />
        </div>
      </section>

      <footer>
        © 2026 RR Sea Foods • Developed by SaRa Tek
      </footer>
    </div>
  );
}

export default Home;