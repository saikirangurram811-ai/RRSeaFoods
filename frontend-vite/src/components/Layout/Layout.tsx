
import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Layout.css";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = localStorage.getItem("user");
    if (!isLoggedIn || !user) {
      localStorage.clear();
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className={`shell ${collapsed ? "collapsed" : ""}`}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <div className="shell-body">
        <Header />
        <main className="shell-main">
          <Outlet />
        </main>
        <Footer />
        <div
          id="toast-area"
          style={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        />
      </div>
    </div>
  );
}