import { useNavigate } from "react-router-dom";
import "../../pages/Dashboard/Dashboard.css";

export default function Profile() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const role = user.role ?? user.roles?.[0] ?? "ROLE_USER";

  return (
    <div className="dash-home">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-sub">Your personal identity and credentials on RR Sea Foods</p>
        </div>
        <button
          className="btn-primary"
          onClick={() => navigate("/dashboard/settings")}
          type="button"
        >
          ⚙ Edit in Settings
        </button>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="chart-card">
          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #0c447c)",
                color: "#ffffff",
                fontSize: 28,
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 14px rgba(37, 99, 235, 0.3)",
              }}
            >
              {(user.username ?? user.name ?? "U").charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 style={{ margin: "0 0 6px", fontSize: 20, fontWeight: 700, color: "#0f172a" }}>
                {user.name || `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "User"}
              </h2>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: role === "ROLE_SUPER_ADMIN" ? "#eff6ff" : "#f1f5f9",
                  color: role === "ROLE_SUPER_ADMIN" ? "#1d4ed8" : "#334155",
                }}
              >
                {role === "ROLE_SUPER_ADMIN" ? "Super Admin" : role === "ROLE_ADMIN" ? "Admin" : "Standard User"}
              </span>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: "#64748b", fontSize: 14 }}>User ID</span>
              <strong style={{ color: "#0f172a", fontSize: 14 }}>#{user.id ?? 1}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: "#64748b", fontSize: 14 }}>Username</span>
              <strong style={{ color: "#0f172a", fontSize: 14 }}>{user.username ?? "—"}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: "#64748b", fontSize: 14 }}>Email Address</span>
              <strong style={{ color: "#2563eb", fontSize: 14 }}>{user.email ?? "—"}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f1f5f9" }}>
              <span style={{ color: "#64748b", fontSize: 14 }}>Phone / Mobile</span>
              <strong style={{ color: "#0f172a", fontSize: 14 }}>{user.mobile ?? "—"}</strong>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0" }}>
              <span style={{ color: "#64748b", fontSize: 14 }}>Account Status</span>
              <span style={{ color: "#16a34a", fontWeight: 600, fontSize: 14 }}>● Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

