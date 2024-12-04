import { useEffect } from "react";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";

const WORKOUTS_API_URL = "http://localhost:5174/api/workouts";

function Home() {
  // GLOBAL CONTEXT (state)
  const { workouts, dispatch } = useWorkoutsContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      const response = await fetch(WORKOUTS_API_URL);
      const jsonRes = await response.json();

      if (response.ok) {
        // setWorkouts(jsonRes);
        dispatch({ type: "SET_WORKOUTS", payload: jsonRes });
      }
    };

    fetchWorkouts();
  }, [dispatch]);

  return (
    <div className="home">
      <div className="workouts">
        {workouts &&
          workouts.map((workout) => (
            <WorkoutDetails key={workout._id} workout={workout} />
          ))}
      </div>
      <div className="workout-form-container">
        <WorkoutForm />
      </div>
    </div>
  );
}

export default Home;
