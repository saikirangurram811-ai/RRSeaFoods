import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserList, type User } from "../../apis/api";
import "./Dashboard.css";

interface StatCard {
  label: string;
  value: string | number;
  change: string;
  up: boolean;
  icon: string;
  route?: string;
}

export default function DashboardHome() {
  const navigate = useNavigate();

  const [userCount, setUserCount] = useState<number>(0);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUsersTable, setShowUsersTable] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") ?? "{}");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    getUserList()
      .then((data) => {
        if (Array.isArray(data)) {
          setUserCount(data.length);
          setUsers(data);
        } else {
          setUserCount(1);
        }
      })
      .catch(() => {
        setUserCount(1);
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const stats: StatCard[] = [
    {
      label: "Total Users",
      value: loading ? "…" : userCount,
      change: "+12% this month",
      up: true,
      icon: "👥",
      route: "/dashboard/users",
    },
    {
      label: "Active Sessions",
      value: 1,
      change: "Current online",
      up: true,
      icon: "🟢",
    },
    {
      label: "Seafood Orders",
      value: 84,
      change: "+15% this week",
      up: true,
      icon: "🐟",
    },
    {
      label: "Inventory Status",
      value: "Good",
      change: "All items stocked",
      up: true,
      icon: "📦",
    },
  ];

  const activity = [
    { time: "Just now", text: "Logged into RR Sea Foods portal", type: "user" },
    { time: "2 min ago", text: "New customer inquiry registered", type: "report" },
    { time: "1 hr ago", text: "Master catalog synchronized", type: "system" },
    { time: "Yesterday", text: "Daily inventory backup completed", type: "system" },
  ];

  return (
    <div className="dash-home">
      {/* Page title */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard Overview</h1>
          <p className="page-sub">
            Welcome back - <strong>{user.name ?? user.username ?? "Admin"}</strong> 
            {/* ({user.role ?? user.roles?.[0] ?? "User"}) */}
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate("/dashboard/master/state")}
          type="button"
        >
          + Manage Masters
        </button>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {stats.map((s) => (
          <div
            className="stat-card"
            key={s.label}
            onClick={() => {
              if (s.route) {
                navigate(s.route);
              } else if (s.label === "Total Users") {
                setShowUsersTable((prev) => !prev);
              }
            }}
            style={{ cursor: s.route || s.label === "Total Users" ? "pointer" : "default" }}
          >
            <div className="stat-top">
              <span className="stat-icon">{s.icon}</span>
              <span className={`stat-badge ${s.up ? "up" : "down"}`}>
                {s.up ? "↑" : "↓"} {s.change}
              </span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick toggle users preview if clicked */}
      {showUsersTable && users.length > 0 && (
        <div style={{ marginBottom: 28, background: "#fff", padding: 20, borderRadius: 14, border: "1px solid #e8edf5" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700 }}>Quick Users Overview</h3>
            <button
              className="link-btn"
              onClick={() => navigate("/dashboard/users")}
              type="button"
            >
              Go to Full Users Page →
            </button>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #e2e8f0", textAlign: "left" }}>
                <th style={{ padding: "8px 12px" }}>ID</th>
                <th style={{ padding: "8px 12px" }}>Username</th>
                <th style={{ padding: "8px 12px" }}>Name</th>
                <th style={{ padding: "8px 12px" }}>Email</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 5).map((u) => (
                <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                  <td style={{ padding: "8px 12px" }}>{u.id}</td>
                  <td style={{ padding: "8px 12px", fontWeight: 600 }}>{u.username}</td>
                  <td style={{ padding: "8px 12px" }}>{u.firstname ? `${u.firstname} ${u.lastname ?? ""}` : (u.username ?? "User")}</td>
                  <td style={{ padding: "8px 12px", color: "#64748b" }}>{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom: chart + activity */}
      <div className="dash-bottom">
        {/* User Growth Chart */}
        <div className="chart-card">
          <div className="card-head">
            <h2 className="card-title">Order & Activity Growth</h2>
            <div className="chart-tabs">
              {["Week", "Month", "Year"].map((t) => (
                <button
                  key={t}
                  className={`chart-tab ${t === "Month" ? "active" : ""}`}
                  type="button"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="fake-chart">
            {[40, 65, 45, 80, 55, 90, 72, 60, 85, 70, 95, 88].map((h, i) => (
              <div key={i} className="bar-wrap">
                <div className="bar" style={{ height: `${h}%` }} />
                <span className="bar-label">
                  {["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="activity-card">
          <div className="card-head">
            <h2 className="card-title">Recent Activity</h2>
            <button className="link-btn" type="button">
              Live Feed
            </button>
          </div>
          <ul className="activity-list">
            {activity.map((a, i) => (
              <li key={i} className="activity-item">
                <span className={`activity-dot dot-${a.type}`} />
                <div className="activity-content">
                  <span className="activity-text">{a.text}</span>
                  <span className="activity-time">{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
