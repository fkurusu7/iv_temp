import { useEffect, useState } from "react";

/* eslint-disable react/prop-types */
function ProgressBar() {
  const [value, setValue] = useState(0);
  const [percentage, setPercentage] = useState(value);
  const [success, setSuccess] = useState(false);

  const complete = () => {
    setSuccess(true);
  };

  useEffect(() => {
    setInterval(() => {
      setValue((val) => val + 1);
    }, 100);

    // CLEAR INTERVAL return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPercentage(Math.min(100, Math.max(value, 0)));
    if (value > 100) complete();
  }, [value]);

  return (
    <div className="progress-bar">
      <h1>Progress Bar</h1>
      <div className="progress">
        <span style={{ color: percentage > 49 && "#2c2c2c" }}>
          {percentage.toFixed()}%
        </span>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuenow={percentage.toFixed()}
          aria-valuemax={100}
          className="progress-fill"
          style={{ width: `${percentage}%` }}
          // style={{
          //   transform: `scaleX(${percentage / 100})`,
          //   transformOrigin: "left",
          // }}
        ></div>
      </div>
      <span>{success ? "Complete" : "loading..."}</span>
    </div>
  );
}

export default ProgressBar;
