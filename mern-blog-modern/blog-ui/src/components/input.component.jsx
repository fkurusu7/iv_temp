import { useState } from "react";

function InputBox({ name, type, id, value, placeholder, icon }) {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="relative w-[100%] mb-4">
      <input
        type={
          type === "password" ? (passwordVisible ? "text" : "password") : type
        }
        name={name}
        id={id}
        placeholder={placeholder}
        defaultValue={value}
        className="input-box"
      />
      <i className={`fi ${icon} input-icon`}></i>
      {type === "password" && (
        <i
          className={`fi ${
            passwordVisible ? "fi-rr-eye" : "fi-rr-eye-crossed"
          } input-icon left-[auto] right-4 cursor-pointer`}
          onClick={() => setPasswordVisible((currVal) => !currVal)}
        ></i>
      )}
    </div>
  );
}

export default InputBox;
