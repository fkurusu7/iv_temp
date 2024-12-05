import { useState } from "react";
import { useSignup } from "../hooks/useSignup";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    console.log(email, password);
    signup(email, password);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h1>Sign Up</h1>
      <div className="input-box">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          className={`input`}
          id="email"
          name="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
        />
      </div>
      <div className="input-box">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          className={`input`}
          id="password"
          name="password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
      </div>
      <div className="input-box">
        <button type="submit" disabled={isLoading}>
          Sign up
        </button>
        {error && <div className="error">{error}</div>}
      </div>
    </form>
  );
}

export default Signup;
