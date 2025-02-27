import { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";

function App() {
  const [value, setValue] = useState(0);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setInterval(() => {
      setValue((val) => val + 1);
    }, 100);
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
