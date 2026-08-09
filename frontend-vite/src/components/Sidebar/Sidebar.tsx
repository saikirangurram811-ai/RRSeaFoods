import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
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
    to: "/dashboard/users",
    icon: "👥",
    label: "Users",
    allowedRoles: ["ROLE_SUPER_ADMIN"],
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

  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const user = JSON.parse(localStorage.getItem("user") ?? "{}");
  
  const role = user.role ?? user.roles?.[0] ?? "USER";

  const filteredNAV = NAV.filter(item => item.allowedRoles.includes(role));

  function logout() {
    localStorage.removeItem("user");
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
        <div className="sidebar-logo">
          <span className="logo-mark">N</span>
          {!collapsed && <span className="logo-text">Practice-Pr</span>}
        </div>

        <button
          className="toggle-btn"
          onClick={onToggle}
          title="Toggle sidebar"
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {filteredNAV.map((item) => (
          <div key={item.to}>

            {/* Main Menu */}
            <div
              className="nav-link"
              // onClick={() =>
              //   item.children
              //     ? toggleSubmenu(item.label)
              //     : navigate(item.to)
              // }

              onClick={() => {
                if (item.children) {
                  toggleSubmenu(item.label);
                } else {
                  navigate(item.to);
                  window.location.reload();
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
            {!collapsed &&
              item.children &&
              openMenu === item.label && (
                <div className="submenu">
                  {item.children.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      className={({ isActive }) =>
                        `submenu-link ${isActive ? "submenu-link--active" : ""
                        }`
                      }
                    >
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
          </div>
        ))}
      </nav>


      {/* Bottom */}
      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">
            {(user.username ?? "U")
              .charAt(0)
              .toUpperCase()}
          </div>

          {!collapsed && (
            <div className="user-info">
              {/* <span className="user-name">
                {localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!).email : "User"}
              </span>

              <span className="user-role">Member</span> */}
              <span className="user-name">
                {user.username ?? "User"}  
              </span>
              <span className="user-role">
                {role === "ROLE_SUPER_ADMIN" ? "Super Admin" : role === "ROLE_ADMIN" ? "Admin" : "User"}  
              </span>
            </div>
          )}
        </div>

        <button
          className="logout-btn"
          onClick={logout}
          title="Sign out"
        >
          {collapsed ? "⇤" : "Sign out"}
        </button>
      </div>
    </aside>
  );
}