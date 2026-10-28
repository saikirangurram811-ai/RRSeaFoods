import { useEffect, useState } from "react";
import {
} from "../../apis/api";
import "../../components/DynamicTableForm/DynamicCSS/DynamicTable.css";
import "./Dashboard.css";

interface Props {
  type: "state" | "district" | "department" | "org";
}

interface MasterItem {
  id: number;
  name: string;
  extra?: string | number;
  status: number;
}

export default function MasterPage({ type }: Props) {
  const [items, setItems] = useState<MasterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const titles = {
    state: "State Master",
    district: "District Master",
    department: "Department Master",
    org: "Organisation Master",
  };

  const descriptions = {
    state: "Manage state geographical master entries",
    district: "Manage districts mapped under states",
    department: "Manage internal operational departments",
    org: "Manage affiliated organisations and branches",
  };

  useEffect(() => {
    setShowModal(false);
    setNewItemName("");
    setError("");
    setSuccess("");
  }, [type]);





 

  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="dash-home">
      <div className="page-header">
        <div>
          <h1 className="page-title">{titles[type]}</h1>
          <p className="page-sub">{descriptions[type]}</p>
        </div>
        <button className="btn-primary" onClick={() => setShowModal(true)} type="button">
          + Add New Entry
        </button>
      </div>

      <div className="dt-root">
        {error && <div className="dt-error">{error}</div>}
        {success && (
          <div
            style={{
              padding: "10px 16px",
              background: "#dcfce7",
              color: "#15803d",
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 500,
            }}
          >
            {success}
          </div>
        )}

        <div className="dt-toolbar">
          <input
            className="dt-search"
            type="text"
            placeholder={`Search ${titles[type]}...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="dt-toolbar-right">
            <span style={{ fontSize: 13, color: "#64748b" }}>
              Total: <strong>{filtered.length}</strong> items
            </span>
          </div>
        </div>

        <div className="dt-wrap">
          <table className="dt-table">
            <thead>
              <tr>
                <th style={{ width: 80 }}>ID</th>
                <th>Name</th>
                {type === "district" && <th>Parent State</th>}
                <th>Status</th>
                <th style={{ width: 120 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="dt-state">
                    Loading {titles[type]}...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="dt-state">
                    No entries found.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>
                    <td style={{ fontWeight: 600, color: "#0f172a" }}>{item.name}</td>
                    {type === "district" && <td>{item.extra}</td>}
                    <td>
                      <span
                        style={{
                          padding: "4px 9px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                          background: item.status === 1 ? "#dcfce7" : "#fee2e2",
                          color: item.status === 1 ? "#15803d" : "#b91c1c",
                        }}
                      >
                        {item.status === 1 ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="act-btn delete"
                          // onClick={() => handleDelete(item.id)}
                          type="button"
                          title="Delete entry"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.5)",
            backdropFilter: "blur(3px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: 24,
              width: "100%",
              maxWidth: 440,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700 }}>
              Add to {titles[type]}
            </h2>
            {/* <form onSubmit={handleCreate}> */}
              <div style={{ marginBottom: 16 }}>
                <label
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 6,
                    color: "#334155",
                  }}
                >
                  Entry Name
                </label>
                <input
                  type="text"
                  placeholder={`Enter ${type} name`}
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: "1px solid #cbd5e1",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                  autoFocus
                  required
                />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
                <button
                  type="button"
                  className="act-btn"
                  onClick={() => setShowModal(false)}
                  style={{ background: "#f1f5f9", padding: "8px 16px", borderRadius: 8 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: "8px 16px", borderRadius: 8 }}
                >
                  Save Entry
                </button>
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

