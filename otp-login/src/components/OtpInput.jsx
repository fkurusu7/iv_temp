/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

function OtpInput({ length = 4, onOtpSubmit }) {
  const [otp, setOtp] = useState(new Array(length).fill(""));

  // To focus on the first OTP input
  const inputRefs = useRef([]);

  useEffect(() => {
    // if the first input in refs has a value, focus on it
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, ev) => {
    const value = ev.target.value;

    // validate value is a number
    if (isNaN(value)) return;

    // make a copy of otp array
    const newOtp = [...otp];
    // allow only one value for the otp number
    newOtp[index] = value.substring(value.length - 1);
    // add value to otp array
    setOtp(newOtp);

    // Move to next input:
    // 1. value is present
    // 2. index (0...3) is one less than length (4 - 1 = 3)
    // 3. inputRefs.current[index + 1] should be something after the current input
    if (value && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }

    // execute a function once all otp inputs have been populated
    // submit trigger
    if (index === length - 1) {
      const combinedOtp = newOtp.join("");
      if (combinedOtp.length === length) onOtpSubmit(combinedOtp);
    }
  };

  // move cursor to the right of current value in an input
  const handleClick = (index) => {
    inputRefs.current[index].setSelectionRange(1, 1);

    // if click on any input where index is > 0, go back to the first empty input
    if (index > 0) {
      inputRefs.current[otp.indexOf("")].focus();
    }
  };

  // Going back in the otp inputs when backspace is pressed
  const handleKeyDown = (index, ev) => {
    // 2nd validation. otp[index] is empty or doesn't exist
    // 4th validation. have access to previous input from current input
    if (
      ev.key === "Backspace" &&
      !otp[index] &&
      index > 0 &&
      inputRefs.current[index - 1]
    ) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="otp-inputs">
      {otp.map((value, index) => {
        return (
          <input
            key={index}
            className="otp-input"
            type="text"
            ref={(input) => (inputRefs.current[index] = input)}
            value={value}
            onChange={(ev) => handleChange(index, ev)}
            onClick={() => handleClick(index)}
            onKeyDown={(ev) => handleKeyDown(index, ev)}
          />
        );
      })}
    </div>
  );
}

export default OtpInput;
