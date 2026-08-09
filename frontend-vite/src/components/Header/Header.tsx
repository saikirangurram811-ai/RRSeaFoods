import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

/** Turn /dashboard/users → ["Dashboard", "Users"] */
function useBreadcrumb() {
  const { pathname } = useLocation();
  return pathname
    .split("/")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1));
}

export default function Header() {
  const crumbs = useBreadcrumb();
  const navigate = useNavigate();

  const handleProfileClick = () => {
    console.log("Profile avatar clicked, navigating to /dashboard/profile");
    navigate("/dashboard/profile");
  };

  return (
    <header className="header">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="breadcrumb">
        {crumbs.map((c, i) => (
          <span key={i} className="breadcrumb-item">
            {i > 0 && <span className="breadcrumb-sep"></span>}
            <span className={i === crumbs.length - 1 ? "bc-current" : "bc-past"}>
              {c}
            </span>
          </span>
        ))}
      </nav>

      {/* Right side */}

      <div className="header-right">
        
        {/* Search */}
        {/* <div className="header-search">
          <span className="search-icon">⌕</span>
          <input placeholder="Search…" type="text" />
        </div> */}

        {/* Notification bell */}
        {/* <button className="icon-btn" title="Notifications">
          <span>🔔</span>
          <span className="notif-dot" />
        </button> */}

        {/* Avatar */}
        <button 
          className="header-avatar" 
          onClick={handleProfileClick}
          title="Go to profile"
          aria-label="User profile"
        >
          {(JSON.parse(localStorage.getItem("user") ?? "{}").username ?? 'U').charAt(0).toUpperCase()}
        </button>
      </div>
    </header>
  );
}