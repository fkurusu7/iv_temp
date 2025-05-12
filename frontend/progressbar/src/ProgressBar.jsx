/* eslint-disable react/prop-types */
function ProgressBar({ value = 0, onComplete = () => {} }) {
  const MIN = 0;
  const MAX = 100;

  // this percentage var is derived state
  const percentage = Math.min(MAX, Math.max(value, MIN)).toFixed();

  if (value > 100) {
    onComplete();
  }

  return (
    <div className="progressbar">
      <span style={{ color: percentage > 50 ? "#242424" : "#646cff" }}>
        {percentage} %
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
