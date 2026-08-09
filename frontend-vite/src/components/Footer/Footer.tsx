import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <span>© {year} Practice Portal</span>
      <span className="footer-sep">·</span>
      <span>Built with React + Spring Boot</span>
      <span className="footer-sep">·</span>
      <span className="footer-version">v1.0.0</span>
    </footer>
  );
}