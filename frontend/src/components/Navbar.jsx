import { supabase } from "../supabaseClient";

function Navbar({ session, profile, isAdmin }) {
  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      await supabase.auth.signOut();
      window.location.href = "/";
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">

        {/* NotifyHub Logo */}
        <a href="/" className="notifyhub-logo">
          <span className="logo-icon">🔔</span>
          <span className="logo-text">
            Notify<span>Hub</span>
          </span>
        </a>

        {/* Navigation */}
        <div className="nav-links">
          <a href="/">Home</a>
          <a href="/announcements">Announcements</a>
          <a href="/events">Events</a>
          
          {session && (
            <a href="/queries">Queries</a>
          )}
          
          {session && isAdmin && (
            <a href="/admin">Admin</a>
          )}

          {session ? (
            <div style={{ display: "flex", alignItems: "center", gap: "15px", marginLeft: "10px" }}>
              <span className="category-badge" style={{ margin: 0, textTransform: "none" }}>
                👤 {isAdmin ? "Admin" : (profile?.name || "Student")}
              </span>
              <button 
                onClick={handleLogout}
                style={{
                  background: "transparent",
                  color: "#ff4d6d",
                  border: "1px solid #ff4d6d",
                  borderRadius: "8px",
                  padding: "5px 12px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.target.style.background = "#ff4d6d";
                  e.target.style.color = "#ffffff";
                }}
                onMouseOut={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.color = "#ff4d6d";
                }}
              >
                Logout
              </button>
            </div>
          ) : (
            <a 
              href="/auth" 
              style={{
                background: "linear-gradient(135deg, #6c2cff 0%, #3f8cff 100%)",
                color: "#ffffff",
                borderRadius: "8px",
                padding: "8px 16px",
                fontWeight: "bold",
                display: "inline-block"
              }}
            >
              Sign In
            </a>
          )}
        </div>

      </div>
    </nav>
  );
}

export default Navbar;