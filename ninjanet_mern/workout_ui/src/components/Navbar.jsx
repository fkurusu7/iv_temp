import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  const handleLogout = () => {
    logout();
  };
  return (
    <header className="navbar-header">
      <div className="container">
        <Link to={"/"}>Workout Buddy</Link>
        <nav>
          {user ? (
            <div>
              <span>{user.email}</span>
              <button onClick={handleLogout}>Log out</button>
            </div>
          ) : (
            <div>
              <Link to={"/login"}>Log in</Link>
              <Link to={"/signup"}>Sign up</Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
