import { useState } from "react";

/* eslint-disable react/prop-types */
function SelectableGrid({ rows, cols }) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [selectedBoxes, setSelectedBoxes] = useState([]);

  const handleMU = () => {
    setIsMouseDown(false);
  };

  const handleMD = (boxNumber) => {
    setIsMouseDown(true);
    setSelectedBoxes([boxNumber]);
  };

  const handleME = (boxNumber) => {
    if (isMouseDown) {
      const startBox = selectedBoxes[0];
      const endBox = boxNumber;

      const startRow = Math.floor((startBox - 1) / cols);
      const startCol = (startBox - 1) % cols;
      const endRow = Math.floor((endBox - 1) / cols);
      const endCol = (endBox - 1) % cols;

      const minRow = Math.min(startRow, endRow);
      const maxRow = Math.max(startRow, endRow);
      const minCol = Math.min(startCol, endCol);
      const maxCol = Math.max(startCol, endCol);

      const selected = [];
      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          console.log(row, cols, col);

          selected.push(row * cols + col + 1);
        }
      }
      setSelectedBoxes(selected);
    }
  };

  return (
    <div
      className="grid"
      onMouseUp={() => handleMU()}
      style={{ "--rows": rows, "--cols": cols }}
    >
      {[...Array(rows * cols).keys()].map((_, i) => (
        <div
          className={`box ${selectedBoxes.includes(i + 1) ? "selected" : ""}`}
          key={i}
          onMouseDown={() => handleMD(i + 1)}
          onMouseEnter={() => handleME(i + 1)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
}

export default SelectableGrid;
