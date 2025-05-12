import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

function App() {
  const [value, setValue] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setValue((val) => {
        return val < 100 ? val + 1 : 100;
      });
    }, 100);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="container">
      <h1>Progress Bar Example</h1>
      <ProgressBar value={value} onComplete={() => setSuccess(true)} />
      {success && <span>Complete</span>}
    </div>
  );
}

export default App;
