import "./App.css";
import ProgressBar from "./components/ProgressBar";
import Quiz from "./components/Quiz";

function App() {
  return (
    <div className="app">
      <ProgressBar />
      <hr />
      <Quiz />
    </div>
  );
}

export default App;
