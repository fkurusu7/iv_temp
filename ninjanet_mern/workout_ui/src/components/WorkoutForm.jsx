import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WORKOUTS_API_URL = "http://localhost:5174/api/workouts";

function WorkoutForm() {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const [title, setTitle] = useState("");
  const [load, setLoad] = useState("");
  const [reps, setReps] = useState("");
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!user) {
      setError("You must be logged in");
      return;
    }

    const workout = { title, load, reps };

    const response = await fetch(WORKOUTS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      mode: "cors",
      body: JSON.stringify(workout),
    });

    const resJson = await response.json();

    if (!response.ok) {
      setError(resJson.error);
      setEmptyFields(resJson.emptyFields);
      console.log(resJson.emptyFields);
    }

    if (response.ok) {
      setError(null);
      setTitle("");
      setLoad("");
      setReps("");
      setEmptyFields([]);
      dispatch({ type: "CREATE_WORKOUT", payload: resJson });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Add New Workout</h1>
      <div className="input-box">
        <label htmlFor="title">Exercise Title</label>
        <input
          type="text"
          className={`input ${
            emptyFields.includes("title") ? "input-error" : ""
          }`}
          id="title"
          name="title"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
      </div>
      <div className="input-box">
        <label htmlFor="load">Exercise Load (kg)</label>
        <input
          type="text"
          className={`input ${
            emptyFields.includes("load") ? "input-error" : ""
          }`}
          id="load"
          name="load"
          value={load}
          onChange={(ev) => setLoad(ev.target.value)}
        />
      </div>
      <div className="input-box">
        <label htmlFor="reps">Exercise Reps</label>
        <input
          type="text"
          className={`input ${
            emptyFields.includes("reps") ? "input-error" : ""
          }`}
          id="reps"
          name="reps"
          value={reps}
          onChange={(ev) => setReps(ev.target.value)}
        />
      </div>
      <div className="input-box">
        <button type="submit">Save</button>
      </div>
      {error && <div className="error-form">{error}</div>}
    </form>
  );
}

export default WorkoutForm;
