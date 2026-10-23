import { useState, useEffect } from "react";
import { updateSettings, changePassword } from "../../apis/api";
import { validatePassword } from "../../apis/validations";
import "./Dashboard.css";

export default function Settings() {
  const localUser = JSON.parse(localStorage.getItem("user") ?? "{}");

  const [profile, setProfile] = useState({
    username: localUser.username ?? "",
    firstname: localUser.firstName ?? localUser.firstname ?? "",
    lastname: localUser.lastName ?? localUser.lastname ?? "",
    email: localUser.email ?? "",
    mobile: localUser.mobile ?? "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [profileMsg, setProfileMsg] = useState("");
  const [profileErr, setProfileErr] = useState("");
  const [passMsg, setPassMsg] = useState("");
  const [passErr, setPassErr] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPass, setLoadingPass] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileErr("");
    setLoadingProfile(true);

    try {
      const res = await updateSettings(localUser.id || 1, profile);
      setProfileMsg(res.message || "Profile updated successfully!");

      // Update local user
      const updatedUser = { ...localUser, ...profile, name: `${profile.firstname} ${profile.lastname}`.trim() };
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err: any) {
      setProfileErr(err.message || "Failed to update profile settings");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg("");
    setPassErr("");

    if (!passwords.currentPassword) {
      setPassErr("Current password is required");
      return;
    }

    if (!validatePassword(passwords.newPassword)) {
      setPassErr("New password must start with capital letter, contain at least 1 special character and number (min 6 chars).");
      return;
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setPassErr("New password and confirm password do not match");
      return;
    }

    setLoadingPass(true);
    try {
      const res = await changePassword(passwords);
      setPassMsg(res.message || "Password changed successfully!");
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: any) {
      setPassErr(err.message || "Failed to change password");
    } finally {
      setLoadingPass(false);
    }
  };

  return (
    <div className="dash-home">
      <div className="page-header">
        <div>
          <h1 className="page-title">Account Settings</h1>
          <p className="page-sub">Manage your profile information and security preferences</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: 24 }}>
        {/* Profile Details Card */}
        <div className="chart-card">
          <h2 className="card-title" style={{ marginBottom: 18 }}>Personal Profile</h2>

          {profileMsg && (
            <div style={{ padding: "10px 14px", background: "#dcfce7", color: "#15803d", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {profileMsg}
            </div>
          )}
          {profileErr && (
            <div style={{ padding: "10px 14px", background: "#fee2e2", color: "#b91c1c", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {profileErr}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>Username</label>
              <input
                type="text"
                value={profile.username}
                disabled
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#64748b", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>First Name</label>
                <input
                  type="text"
                  value={profile.firstname}
                  onChange={(e) => setProfile({ ...profile, firstname: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>Last Name</label>
                <input
                  type="text"
                  value={profile.lastname}
                  onChange={(e) => setProfile({ ...profile, lastname: e.target.value })}
                  style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>Email Address</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>Mobile Number</label>
              <input
                type="text"
                value={profile.mobile}
                onChange={(e) => setProfile({ ...profile, mobile: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loadingProfile} style={{ marginTop: 8 }}>
              {loadingProfile ? "Saving changes..." : "Save Profile Details"}
            </button>
          </form>
        </div>

        {/* Change Password Card */}
        <div className="chart-card">
          <h2 className="card-title" style={{ marginBottom: 18 }}>Security & Password</h2>

          {passMsg && (
            <div style={{ padding: "10px 14px", background: "#dcfce7", color: "#15803d", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {passMsg}
            </div>
          )}
          {passErr && (
            <div style={{ padding: "10px 14px", background: "#fee2e2", color: "#b91c1c", borderRadius: 8, fontSize: 13, marginBottom: 16 }}>
              {passErr}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                value={passwords.currentPassword}
                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>New Password</label>
              <input
                type="password"
                placeholder="Enter strong new password"
                value={passwords.newPassword}
                onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                required
              />
            </div>

            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#475569", marginBottom: 5 }}>Confirm New Password</label>
              <input
                type="password"
                placeholder="Re-enter new password"
                value={passwords.confirmPassword}
                onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1px solid #cbd5e1", boxSizing: "border-box" }}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={loadingPass} style={{ marginTop: 8 }}>
              {loadingPass ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

