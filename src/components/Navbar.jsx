import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
 <nav
  style={{
    padding: "1rem",
    background: "#333",
    color: "white",
    display: "flex",
    alignItems: "center",
  }}
>
  <Link
    to="/dashboard"
    style={{ marginRight: "5rem", color: "#fff", textDecoration: "none" }}
    onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
    onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
  >
    Dashboard
  </Link>

  <Link
    to="/teams"
    style={{ marginRight: "1rem", color: "#fff", textDecoration: "none" }}
    onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
    onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
  >
    My Teams
  </Link>

  <Link
    to="/tasks"
    style={{ marginRight: "1rem", color: "#fff", textDecoration: "none" }}
    onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
    onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
  >
    My Tasks
  </Link>

  <Link
    to="/analytics"
    style={{ marginRight: "1rem", color: "#fff", textDecoration: "none" }}
    onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
    onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
  >
    Analytics
  </Link>

  {/* Push logout to the right */}
  <div style={{ marginLeft: "auto" }}>
    <button onClick={handleLogout} style={{ padding: "0.5rem 1rem" }}>
      Logout
    </button>
  </div>
</nav>
  );
}

export default Navbar;
