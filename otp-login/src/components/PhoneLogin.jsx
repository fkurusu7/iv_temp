import { useState } from "react";
import OtpInput from "./OtpInput";

function PhoneLogin() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showOtp, setShowOtp] = useState(false);

  const handlePhoneNumber = (ev) => {
    setPhoneNumber(ev.target.value);
  };

  const handlePhoneSubmit = (ev) => {
    ev.preventDefault();

    // Phone Validations
    const regex = /[^0-9]/g;
    if (phoneNumber.length < 10 || regex.test(phoneNumber)) {
      alert("Invalid phone number");
      return;
    }

    // Call the API

    // Show the OTP Input
    setShowOtp(true);
  };

  const handleOtpSubmit = (otp) => {
    console.log("OTP login", otp);
  };

  return (
    <div className="otp-wrapper">
      {!showOtp ? (
        <form onSubmit={handlePhoneSubmit} className="phone-form">
          <input
            placeholder="Enter Phone Number"
            type="text"
            name="phone"
            id="phone"
            value={phoneNumber}
            onChange={handlePhoneNumber}
          />
          <button type="submit">Submit</button>
        </form>
      ) : (
        <div className="otp-inputs-wrapper">
          <p>
            Enter OTP sent to <span className="otp-phone">{phoneNumber}</span>
          </p>
          <OtpInput onOtpSubmit={handleOtpSubmit} />
        </div>
      )}
    </div>
  );
}

export default PhoneLogin;
