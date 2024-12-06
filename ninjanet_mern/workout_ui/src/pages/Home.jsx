import { useEffect } from "react";
import WorkoutDetails from "../components/WorkoutDetails";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";

const WORKOUTS_API_URL = "http://localhost:5174/api/workouts";

function Home() {
  // GLOBAL CONTEXT (state)
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchWorkouts = async () => {
      // method GET
      const response = await fetch(WORKOUTS_API_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const jsonRes = await response.json();

      if (response.ok) {
        // setWorkouts(jsonRes);
        dispatch({ type: "SET_WORKOUTS", payload: jsonRes });
      }
    };

    if (user) {
      fetchWorkouts();
    }
  }, [dispatch, user]);

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
