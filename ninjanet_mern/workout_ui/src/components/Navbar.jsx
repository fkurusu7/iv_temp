import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar-header">
      <div className="container">
        <Link to={"/"}>Workout Buddy</Link>
      </div>
    </header>
  );
}

export default Navbar;
