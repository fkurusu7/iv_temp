import "./App.css";
import SelectableGrid from "./components/SelectableGrid";

function App() {
  return (
    <div>
      <h1>Selectable</h1>
      <SelectableGrid rows={10} cols={10} />
    </div>
  );
}

export default App;
