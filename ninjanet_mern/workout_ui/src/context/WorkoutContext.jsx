/* eslint-disable react/prop-types */
import { createContext, useReducer } from "react";

const WorkoutsContext = createContext();

const workoutsReducer = (state, action) => {
  // returns the object 'workouts' (which is an Array of objects) in the useReducer
  switch (action.type) {
    case "SET_WORKOUTS":
      return { workouts: action.payload };

    case "CREATE_WORKOUT":
      return { workouts: [action.payload, ...state.workouts] };

    case "DELETE_WORKOUT":
      // action.payload === workout._id
      return {
        workouts: state.workouts.filter((wo) => wo._id !== action.payload),
      };
    default:
      return state;
  }
};

export function WorkoutsContextProvider({ children }) {
  const [state, dispatch] = useReducer(workoutsReducer, {
    workouts: null,
  });

  // The value prop will provide the state for the app
  return (
    <WorkoutsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </WorkoutsContext.Provider>
  );
}

export default WorkoutsContext;
