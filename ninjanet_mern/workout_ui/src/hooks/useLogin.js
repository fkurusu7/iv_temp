import { useState } from "react";
import { useAuthContext } from "./useAuthContext";

const USER_API_URL = "http://localhost:5174/api/user";

export const useLogin = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(null);
  const { dispatch } = useAuthContext();

  const login = async (email, password) => {
    setIsLoading(true);
    setError(null);

    const response = await fetch(`${USER_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const resJson = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      setError(resJson.error);
    }

    if (response.ok) {
      // save the use to local storage
      localStorage.setItem("user", JSON.stringify(resJson));

      // update the auth context
      dispatch({ type: "LOGIN", payload: resJson });

      // set loading to false
      setIsLoading(false);
    }
  };

  return { login, isLoading, error };
};
