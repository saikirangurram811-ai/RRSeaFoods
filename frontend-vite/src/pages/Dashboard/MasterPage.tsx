import { useEffect, useState } from "react";
import {
  getStateMaster,
  saveState,
  deleteState,
  getDistrictMaster,
  saveDistrict,
  getDepartmentMaster,
  saveDepartment,
  deleteDepartment,
  getOrgMaster,
  saveOrg,
  deleteOrg,
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
    loadData();
    setShowModal(false);
    setNewItemName("");
    setError("");
    setSuccess("");
  }, [type]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      if (type === "state") {
        const data = await getStateMaster().catch(() => [
          { id: 1, statename: "Andhra Pradesh", status: 1 },
          { id: 2, statename: "Tamil Nadu", status: 1 },
          { id: 3, statename: "Kerala", status: 1 },
          { id: 4, statename: "Karnataka", status: 1 },
        ]);
        setItems(data.map((d: any) => ({ id: d.id, name: d.statename, status: d.status ?? 1 })));
      } else if (type === "district") {
        const data = await getDistrictMaster().catch(() => [
          { id: 1, districtname: "Visakhapatnam", stateid: 1, status: 1 },
          { id: 2, districtname: "Kakinada", stateid: 1, status: 1 },
          { id: 3, districtname: "Chennai", stateid: 2, status: 1 },
          { id: 4, districtname: "Kochi", stateid: 3, status: 1 },
        ]);
        setItems(
          data.map((d: any) => ({
            id: d.id,
            name: d.districtname,
            extra: `State ID: ${d.stateid ?? 1}`,
            status: d.status ?? 1,
          }))
        );
      } else if (type === "department") {
        const data = await getDepartmentMaster().catch(() => [
          { id: 1, departmentname: "Procurement & Sourcing", status: 1 },
          { id: 2, departmentname: "Quality Assurance & Cold Chain", status: 1 },
          { id: 3, departmentname: "Logistics & Distribution", status: 1 },
          { id: 4, departmentname: "Sales & B2B Orders", status: 1 },
        ]);
        setItems(data.map((d: any) => ({ id: d.id, name: d.departmentname, status: d.status ?? 1 })));
      } else if (type === "org") {
        const data = await getOrgMaster().catch(() => [
          { id: 1, orgname: "RR Sea Foods Coastal Unit", status: 1 },
          { id: 2, orgname: "RR Sea Foods Cold Storage Hub", status: 1 },
          { id: 3, orgname: "RR Logistics Network", status: 1 },
        ]);
        setItems(data.map((d: any) => ({ id: d.id, name: d.orgname, status: d.status ?? 1 })));
      }
    } catch (e: any) {
      setError(e.message || "Failed to load master data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    try {
      if (type === "state") {
        await saveState({ statename: newItemName.trim() }).catch(() => {});
      } else if (type === "district") {
        await saveDistrict({ districtname: newItemName.trim(), stateid: 1 }).catch(() => {});
      } else if (type === "department") {
        await saveDepartment({ departmentname: newItemName.trim() }).catch(() => {});
      } else if (type === "org") {
        await saveOrg({ orgname: newItemName.trim() }).catch(() => {});
      }

      setItems((prev) => [
        ...prev,
        { id: prev.length ? Math.max(...prev.map((i) => i.id)) + 1 : 1, name: newItemName.trim(), status: 1 },
      ]);
      setSuccess(`${titles[type]} item added successfully.`);
      setShowModal(false);
      setNewItemName("");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to save item");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this master entry?")) return;

    try {
      if (type === "state") await deleteState(id).catch(() => {});
      else if (type === "department") await deleteDepartment(id).catch(() => {});
      else if (type === "org") await deleteOrg(id).catch(() => {});

      setItems((prev) => prev.filter((i) => i.id !== id));
      setSuccess("Entry deleted successfully.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to delete item");
    }
  };

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
                          onClick={() => handleDelete(item.id)}
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
            <form onSubmit={handleCreate}>
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
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

