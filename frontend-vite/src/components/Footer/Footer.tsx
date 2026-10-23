import "./Footer.css";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <span>© {year} RR Sea Foods</span>
      <span className="footer-sep">·</span>
      <span>Fresh Seafood Management</span>
      <span className="footer-sep">·</span>
      <span className="footer-version">v1.0.0</span>
    </footer>
  );
}
