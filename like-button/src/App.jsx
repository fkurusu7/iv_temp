/* eslint-disable no-unused-vars */
import { useState } from "react";
import "./App.css";

const API_URL = "https://www.greatfrontend.com/api/questions/like-button";

const fetchPost = async (liked) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ action: liked ? "unlike" : "like" }),
    });

    if (!res.ok) {
      let errorBody;
      try {
        errorBody = await res.json();
      } catch (error) {
        errorBody = res.statusText;
      }
      // Throw an error with more context
      throw new Error(JSON.stringify(errorBody));
    }
    return await res.json();
  } catch (error) {
    // Log the full error for debugging
    console.error("Fetch error:", error);
    throw error; // Re-throw to be caught in handleToggleLike
  }
};

function App() {
  const [liked, setLiked] = useState(false);

  // will work to the loading state
  const [isFetching, setIsFetching] = useState(false);
  const [error, setError] = useState("");

  const handleToggleLike = async () => {
    setIsFetching(true);
    setError("");

    try {
      const res = await fetchPost(liked);
      console.log("handle", res);
      setLiked(!liked);
    } catch (error) {
      const errorObj = JSON.parse(error.message);
      console.log("handle error: ", errorObj.message);
      setError(errorObj.message);
    } finally {
      setIsFetching(false);
    }
  };

  // Fetch the result from API
  // useEffect(() => {
  //   return () => {};
  // }, []);

  return (
    <div>
      <button
        disabled={isFetching}
        className={`like-btn ${liked ? "liked" : ""}`}
        onClick={handleToggleLike}
      >
        {isFetching ? "↻" : liked ? "❤️" : "♡"}
        <span>{liked ? "Unlike" : "Like"}</span>
      </button>
      {/* <button>↻ Like</button> */}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
