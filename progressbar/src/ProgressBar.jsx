import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
function ProgressBar({ value = 0, onComplete = () => {} }) {
  const MIN = 0;
  const MAX = 100;
  const [percentage, setPercentage] = useState(value);

  useEffect(() => {
    setPercentage(Math.min(MAX, Math.max(value, MIN)).toFixed());

    if (value > 100) {
      onComplete();
    }
  }, [onComplete, value]);

  return (
    <div className="progressbar">
      <span style={{ color: percentage > 49 ? "#ffffffde" : "#a0a4ff" }}>
        {percentage}%
      </span>
      <div
        className="progress"
        // style={{ width: `${percentage}%` }}
        style={{
          transform: `scaleX(${percentage / MAX})`,
          transformOrigin: "left",
        }}
        role="progressbar"
        aria-valuemin={MIN}
        aria-valuenow={percentage}
        aria-valuemax={MAX}
      ></div>
    </div>
  );
}

export default ProgressBar;
