import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Children, useEffect, useState } from "react";
import "./Sidebar.css";

interface Props {
  collapsed: boolean;
  onToggle: () => void;
}

const NAV = [
  {
    to: "/dashboard",
    icon: "⊞",
    label: "Dashboard",
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
  },
  {
    to: "/dashboard/product",
    icon: "👥",
    label: "Product",
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
  },
  {
    to: "/dashboard/stock",
    icon: "📊",
    label: "Stock",
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
  },
  {
    to: "/dashboard/master",
    icon: "📊",
    label: "Master",
    allowedRoles: ["ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
    children: [
      {
        to: "/dashboard/master/state",
        label: "State Master",
      },
      {
        to: "/dashboard/master/district",
        label: "District Master",
      },
      {
        to: "/dashboard/master/department",
        label: "Department Master",
      },
      {
        to: "/dashboard/master/org",
        label: "Organisation Master",
      },
    ],
  },
  {
    to: "/dashboard/settings",
    icon: "⚙",
    label: "Settings",
    allowedRoles: ["ROLE_USER", "ROLE_ADMIN", "ROLE_SUPER_ADMIN"],
  },
];

export default function Sidebar({ collapsed, onToggle }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  // Auto-expand menu if current route is a child
  useEffect(() => {
    if (location.pathname.startsWith("/dashboard/master")) {
      setOpenMenu("Master");
    }
  }, [location.pathname]);


  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  const role = user.role ?? user.roles?.[0] ?? "ROLE_USER";

  const filteredNAV = NAV.filter((item) =>
    item.allowedRoles.some((r) => r === role || role.includes(r))
  );

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    localStorage.clear();
    navigate("/login");
  }

  function toggleSubmenu(label: string) {
    setOpenMenu(openMenu === label ? null : label);
  }

  return (
    <aside className={`sidebar ${collapsed ? "sidebar--col" : ""}`}>
      {/* Logo */}
      <div className="sidebar-top">
        <div className="sidebar-logo" onClick={() => navigate("/dashboard")} style={{ cursor: "pointer" }}>
          <img
            src="/rrseafoodslogo.png"
            alt="RR Sea Foods Logo"
            className="sidebar-logo-img"
          />
          {!collapsed && <span className="logo-text">RR Sea Foods</span>}
        </div>

        <button
          className="toggle-btn"
          onClick={onToggle}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          type="button"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {filteredNAV.map((item) => {
          const isItemActive =
            item.to === "/dashboard"
              ? location.pathname === "/dashboard"
              : location.pathname.startsWith(item.to);

          return (
            <div key={item.to}>
              {/* Main Menu */}
              <div
                className={`nav-link ${isItemActive ? "nav-link--active" : ""}`}
                onClick={() => {
                  if (item.children) {
                    toggleSubmenu(item.label);
                  } else {
                    navigate(item.to);
                  }
                }}
              >
                <span className="nav-icon">{item.icon}</span>

                {!collapsed && (
                  <>
                    <span className="nav-label">{item.label}</span>

                    {item.children && (
                      <span className="nav-arrow">
                        {openMenu === item.label ? "⌄" : "›"}
                      </span>
                    )}
                  </>
                )}
              </div>

              {/* Submenu */}
              {!collapsed && item.children && openMenu === item.label && (
                <div className="submenu">
                  {item.children.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive }) =>
                        `submenu-link ${isActive ? "submenu-link--active" : ""}`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div
          className="sidebar-user"
          onClick={() => navigate("/dashboard/profile")}
          style={{ cursor: "pointer" }}
          title="View profile"
        >
          <div className="user-avatar">
            {(user.username ?? user.name ?? "U").charAt(0).toUpperCase()}
          </div>

          {!collapsed && (
            <div className="user-info">
              <span className="user-name">
                {user.username ?? user.name ?? "User"}
              </span>
              <span className="user-role">
                {role === "ROLE_SUPER_ADMIN"
                  ? "Super Admin"
                  : role === "ROLE_ADMIN"
                    ? "Admin"
                    : "User"}
              </span>
            </div>
          )}
        </div>

        <button
          className="logout-btn"
          onClick={logout}
          title="Sign out"
          type="button"
        >
          {collapsed ? "⇤" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}
