/* eslint-disable react/prop-types */
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

function OtpInput({ length = 4, onOtpSubmit = () => {} }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));
  console.log(otp);
  const otpInputRefs = useRef([]);

  useEffect(() => {
    if (otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (i, ev) => {
    const value = ev.target.value;

    if (isNaN(value)) return;

    const newOtp = [...otp];
    // Allow only one input to be the last one
    newOtp[i] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Move to the next input if current field is populated
    if (value && i < length - 1 && otpInputRefs.current[i + 1]) {
      otpInputRefs.current[i + 1].focus();
    }

    // submit once all otp numbers are entered
    const combinedOtp = newOtp.join("");
    if (combinedOtp.length === length) onOtpSubmit(combinedOtp);
  };

  const handleClick = (i) => {
    otpInputRefs.current[i].setSelectionRange(1, 1);

    if (i > 0 && !otp[i - 1]) {
      otpInputRefs.current[otp.indexOf("")].focus();
    }
  };

  const handleKeyDown = (i, ev) => {
    if (
      ev.key === "Backspace" &&
      !otp[i] &&
      i > 0 &&
      otpInputRefs.current[i - 1]
    ) {
      // move focus to the previous input field on backspace
      otpInputRefs.current[i - 1].focus();
    }
  };

  return (
    <div className="otp-inputs">
      {otp.map((val, i) => {
        return (
          <input
            className="otp-input"
            ref={(input) => (otpInputRefs.current[i] = input)}
            key={i}
            value={val}
            type="text"
            onChange={(ev) => handleChange(i, ev)}
            onClick={() => handleClick(i)}
            onKeyDown={(ev) => handleKeyDown(i, ev)}
          />
        );
      })}
    </div>
  );
}

export default OtpInput;
