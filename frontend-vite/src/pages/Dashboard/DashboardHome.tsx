import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface StatCard {
  label: string;
  value: string | number;
  change: string;
  up: boolean;
  icon: string;
}

export interface User { id: number; name: string; email: string; }
export default function DashboardHome() {
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, []);

  const [userCount, setUserCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [showUsersTable, setShowUsersTable] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");

  // useEffect(() => {
  //   getUserList()
  //     .then((users) => setUserCount(users.length))
  //     .catch(() => setUserCount(0))
  //     .finally(() => setLoading(false));
  // }, []);

  const stats: StatCard[] = [
    { label: "Total Users", value: loading ? "…" : userCount, change: "+12% this month", up: true, icon: "👥" },
    { label: "Active Sessions", value: 42, change: "+5% today", up: true, icon: "🟢" },
    { label: "Reports Filed", value: 128, change: "+3 since yesterday", up: true, icon: "📋" },
    { label: "Pending Tasks", value: 7, change: "−2 resolved today", up: false, icon: "⏳" },
  ];

  const activity = [
    { time: "2 min ago", text: "New user registered", type: "user" },
    { time: "14 min ago", text: "Report #128 submitted", type: "report" },
    { time: "1 hr ago", text: "Settings updated", type: "system" },
    { time: "3 hr ago", text: "User account deactivated", type: "warn" },
    { time: "Yesterday", text: "Database backup completed", type: "system" },
  ];

  return (
    <div className="dash-home">
      {/* Page title */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-sub">Welcome {user.username ?? user.email ?? "User"}</p>
        </div>
        <button className="btn-primary">+ New Report</button>
      </div>

      {/* Stat cards */}
      <div className="stat-grid">
        {stats.map((s) => (
          <div className="stat-card" key={s.label} onClick={() => { if (s.label === "Total Users") setShowUsersTable(prev => !prev); }}
            style={{ cursor: s.label === "Total Users" ? "pointer" : "default" }}>
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

      {/* Bottom: chart placeholder + activity */}
      <div className="dash-bottom">

        {/* Chart placeholder */}
         (
          <div className="chart-card">
            <div className="card-head">
              <h2 className="card-title">User Growth</h2>
              <div className="chart-tabs">
                {["Week", "Month", "Year"].map((t) => (
                  <button key={t} className={`chart-tab ${t === "Month" ? "active" : ""}`}>{t}</button>
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
        )

        {/* Activity feed */}
        <div className="activity-card">
          <div className="card-head">
            <h2 className="card-title">Recent Activity</h2>
            <button className="link-btn">View all</button>
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