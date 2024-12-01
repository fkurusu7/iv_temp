/* eslint-disable react/prop-types */
import { useState } from "react";
import "./App.css";

function Cell({ filled, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`cell ${filled && "active"}`}
      disabled={filled}
    >
      {/* */}
    </button>
  );
}

const configCells = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
];

function App() {
  const [order, setOrder] = useState([]);

  const deActivateCell = () => {
    const timer = setInterval(() => {
      setOrder((originalOrder) => {
        const newOrder = originalOrder.slice();
        newOrder.pop();

        if (newOrder.length === 0) {
          clearInterval(timer);
        }
        return newOrder;
      });
    }, 400);
  };

  const activateCell = (i) => {
    const newOrder = [...order, i];
    setOrder(newOrder);
    console.log(newOrder);

    // deactivate by retracing clicks
    if (newOrder.length === configCells.flat(1).filter(Boolean).length) {
      console.log("length reached");
      deActivateCell();
    }
  };

  return (
    <>
      <div className="wrapper">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${configCells[0].length}, 1fr)`,
          }}
        >
          {configCells
            .flat(1)
            .map((val, i) =>
              val ? (
                <Cell
                  key={i}
                  filled={order.includes(i)}
                  onClick={() => activateCell(i)}
                />
              ) : (
                <span key={i} />
              )
            )}
        </div>
      </div>
    </>
  );
}

export default App;
