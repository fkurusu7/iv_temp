/* eslint-disable react/prop-types */
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

const WORKOUTS_API_URL = "http://localhost:5174/api/workouts/";

function WorkoutDetails({ workout }) {
  const { dispatch } = useWorkoutsContext();

  const handleDelete = async () => {
    const response = await fetch(WORKOUTS_API_URL + workout._id, {
      method: "DELETE",
    });

    // if (!response.ok) {
    // }

    if (response.ok) {
      dispatch({ type: "DELETE_WORKOUT", payload: workout._id });
    }
  };

  return (
    <div className="workout">
      <h4>{workout.title}</h4>
      <p>
        <strong>Load (kg):</strong>
        {workout.load}
      </p>
      <p>
        <strong>Reps:</strong>
        {workout.reps}
      </p>
      <p>
        {formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}
      </p>

      <span className="material-symbols-outlined" onClick={handleDelete}>
        delete
      </span>
    </div>
  );
}

export default WorkoutDetails;
