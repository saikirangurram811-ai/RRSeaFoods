import { useEffect, useState } from "react";
import { getUserList, type User } from "../../apis/api";
import "../../components/DynamicTableForm/DynamicCSS/DynamicTable.css";
import "./Dashboard.css";

export default function Userlist() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    getUserList()
      .then((data) => {
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          setUsers([]);
        }
      })
      .catch((err) => {
        setError(err.message || "Failed to load user list");
      })
      .finally(() => setLoading(false));
  };

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const username = (u.username ?? "").toLowerCase();
    const email = (u.email ?? "").toLowerCase();
    const name = `${u.firstname ?? ""} ${u.lastname ?? ""}`.toLowerCase();
    return username.includes(q) || email.includes(q) || name.includes(q);
  });

  return (
    <div className="dash-home">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-sub">View and manage registered accounts across the RR Sea Foods platform</p>
        </div>
        <button className="btn-primary" onClick={fetchUsers} type="button">
          ↻ Refresh List
        </button>
      </div>

      <div className="dt-root">
        {error && <div className="dt-error">{error}</div>}

        <div className="dt-toolbar">
          <input
            className="dt-search"
            type="text"
            placeholder="Search by username, name, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="dt-toolbar-right">
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Total: <strong>{filteredUsers.length}</strong> {filteredUsers.length === 1 ? "user" : "users"}
            </span>
          </div>
        </div>

        <div className="dt-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email Address</th>
                <th>Mobile</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="dt-state">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="dt-state">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td>#{u.id}</td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{u.username}</td>
                    <td>{u.firstname ? `${u.firstname} ${u.lastname ?? ""}` : u.username}</td>
                    <td style={{ color: "#2563eb" }}>{u.email}</td>
                    <td>{u.mobile || "—"}</td>
                    <td>
                      <span
                        style={{
                          padding: "4px 10px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background: "#eff6ff",
                          color: "#1d4ed8",
                        }}
                      >
                        USER
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
