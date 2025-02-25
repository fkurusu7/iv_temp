import useNotification from "./hooks/useNotification";

function App() {
  // custom hook
  const { NotificationComponent, triggerNotification } =
    useNotification("bottom-left");
  return (
    <div className="container">
      <h1>TOAST</h1>
      <button
        onClick={() =>
          triggerNotification({
            type: "success",
            message: "Success upload",
            duration: 3000,
          })
        }
      >
        Success
      </button>
      <button
        onClick={() =>
          triggerNotification({
            type: "error",
            message: "Error upload",
            duration: 3000,
          })
        }
      >
        Error
      </button>
      {NotificationComponent}
    </div>
  );
}

export default App;
