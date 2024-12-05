import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const USER_API_URL = "http://localhost:5174/api/user";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${USER_API_URL}/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const resJson = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(resJson.error);
    }

    if (response.ok) {
      // save the json response (email and token) to local storage
      localStorage.setItem("user", JSON.stringify(resJson));

      // Update the AuthContext
      dispatch({ type: "LOGIN", payload: resJson });
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
