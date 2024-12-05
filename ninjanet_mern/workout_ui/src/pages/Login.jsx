import { useState } from "react";
import { useLogin } from "../hooks/useLogin";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { login, error, isLoading } = useLogin();

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    await login(email, password);
  };

  return (
    <form className="login" onSubmit={handleSubmit}>
      <h1>Log In</h1>
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
        <button disabled={isLoading} type="submit">
          Login
        </button>
      </div>
      {error && <div>{error}</div>}
    </form>
  );
}

export default Login;
