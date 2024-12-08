import Card from "./components/Card";
import Header from "./components/Header";

function App() {
  return (
    <div>
      <Header />
      <div className="card-container">
        <Card
          title={"Team Builder"}
          description={
            "Scans our talent network to create the optimal team for your project"
          }
          imageSrc={"./icon-calculator.svg"}
        />
      </div>
    </div>
  );
}

export default App;
