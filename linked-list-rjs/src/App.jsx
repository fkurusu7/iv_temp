import DynamicContentLoader from "./components/DynamicContentLoader";

function App() {
  return (
    <div className="container">
      <h1>Dynamic content loader with LRU Cache</h1>
      <DynamicContentLoader />
    </div>
  );
}

export default App;
