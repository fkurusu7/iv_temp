/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect } from "react";
import { useState } from "react";

const tenureData = [12, 24, 36, 48, 60];

function App() {
  const [cost, setCost] = useState(0);
  const [interest, setInterest] = useState(10);
  const [fee, setFee] = useState(0);
  const [downpayment, setDownPayment] = useState(0);
  const [emi, setEmi] = useState(0);
  const [tenure, setTenure] = useState(12);

  useEffect(() => {
    if (!(cost > 0)) {
      setDownPayment(0);
      setEmi(0);
    }

    const emi = calculateEmi(downpayment);
    setEmi(emi);
  }, [cost, downpayment, tenure]);

  const calculateEmi = (downpayment) => {
    // EMI amount = [P * R * (1 + R)**N] / [(1 + R)**N - 1]
    if (!cost) return;

    const loanAmount = cost - downpayment; // P
    const rateOfInterest = interest / 100;
    const numOfYears = tenure / 12;

    const EMI =
      (loanAmount * rateOfInterest * (1 + rateOfInterest) ** numOfYears) /
      ((1 + rateOfInterest) ** numOfYears - 1);

    return Number(EMI / 12).toFixed(0);
  };

  const calculateDP = (emi) => {
    if (!cost) return;

    const downpaymentPercent = 100 - (emi / calculateEmi(0)) * 100;
    return Number((downpaymentPercent / 100) * cost).toFixed(0);
  };

  const updateEmi = (ev) => {
    if (!cost) return;

    const downPm = Number(ev.target.value);
    setDownPayment(downPm.toFixed(0));

    // Calculate EMI and update it
    const EMI = calculateEmi(downPm);
    setEmi(EMI);
  };

  const updateDownPayment = (ev) => {
    if (!cost) return;

    const emi = Number(ev.target.value);
    setEmi(emi.toFixed(0));

    // Calculate Downpayment and update it
    const dp = calculateDP(emi);
    setDownPayment(dp);
  };

  return (
    <div className="container">
      <h1 className="title">EMI Calculator</h1>
      <div className="calculator-container">
        <div className="input-container">
          {/* COST */}
          <div className="input-wrapper">
            <label htmlFor="cost">Total Cost of Asset</label>
            <input
              type="number"
              id="cost"
              className="input"
              placeholder="Total cost of Assets"
              value={cost}
              onChange={(ev) => setCost(ev.target.value)}
            />
          </div>
          {/* INTEREST */}
          <div className="input-wrapper">
            <label htmlFor="interest">Interest Rate (%)</label>
            <input
              type="number"
              id="interest"
              className="input"
              value={interest}
              onChange={(ev) => setInterest(ev.target.value)}
            />
          </div>
          {/* PROCESSING FEE */}
          <div className="input-wrapper">
            <label htmlFor="fee">Processing Fee</label>
            <input
              type="number"
              id="fee"
              className="input"
              placeholder="Processing Fee"
              value={fee}
              onChange={(ev) => setFee(ev.target.value)}
            />
          </div>
        </div>
        {/* SLIDERS */}
        <div className="slider-container">
          {/* DOWNPAYMENT */}
          <div className="slider-wrapper">
            <label htmlFor="downpayment">Down Payment</label>
            <span>
              Total Downpayment{" "}
              {(
                Number(downpayment) +
                (cost - downpayment) * (fee / 100)
              ).toFixed(0)}
            </span>
            <input
              type="range"
              id="downpayment"
              className="slider"
              min={0}
              max={cost}
              value={downpayment}
              onChange={updateEmi}
            />
            <div className="slider-info">
              <span>0%</span>
              <span>{downpayment}</span>
              <span>100%</span>
            </div>
          </div>
          {/* EMI */}
          <div className="slider-wrapper">
            <label htmlFor="emi">EMI</label>
            <span>TOTAL Loan Amount: {Number(emi * tenure).toFixed(0)}</span>
            <input
              type="range"
              id="emi"
              className="slider"
              min={calculateEmi(cost)}
              max={calculateEmi(0)}
              value={emi}
              onChange={updateDownPayment}
            />
            <div className="slider-info">
              <span>{calculateEmi(cost)}</span>
              <span>{emi}</span>
              <span>{calculateEmi(0)}</span>
            </div>
          </div>
          {/* TENURE */}
          <div className="slider-wrapper">
            <p>Tenure</p>
            <div className="btns">
              {tenureData.map((t) => {
                return (
                  <button
                    key={t}
                    className={`tenure-btn ${t === tenure && "active"}`}
                    onClick={() => setTenure(t)}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
