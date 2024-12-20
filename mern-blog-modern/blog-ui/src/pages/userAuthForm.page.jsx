import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";

// regex for email
const EMAIL_REGEX = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// regex for password
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

function UserAuthForm({ type }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    ...(type !== "signin" && { fullname: "" }),
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (ev) => {
    const { value, id } = ev.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    // Validate data
    if (type !== "signin" && formData.fullname.length < 3) {
      setErrorMessage("Fullname must be at least 3 letters long");
    }
    if (!formData.email.length || !EMAIL_REGEX.test(formData.email)) {
      setErrorMessage("Email is invalid");
    }
    if (!PASSWORD_REGEX.test(formData.password)) {
      setErrorMessage(
        "Password should be 6 to 20 characters long with a numeric, lowercase and uppercase letters"
      );
    }

    try {
      setErrorMessage(null);
      setIsLoading(true);
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const jsonData = await response.json();

      if (response.ok) {
        // navigate to home page
        navigate("/");
      } else {
        setErrorMessage(jsonData.message);
      }
    } catch (error) {
      console.log("ERROR", error.message);
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <form className="w-[80%] max-w-[400px]" onSubmit={handleSubmit}>
          <h1 className="text-4xl font-gelasio capitalize text-center mb-10">
            {type === "signin" ? "Welcome back" : "Join us today"}
          </h1>

          {type !== "signin" ? (
            <InputBox
              name={"fullname"}
              id={"fullname"}
              type={"text"}
              placeholder={"Full name"}
              icon={"fi-rr-user"}
              value={formData.fullname}
              handleChange={handleChange}
            />
          ) : (
            ""
          )}
          <InputBox
            name={"email"}
            id={"email"}
            type={"email"}
            placeholder={"Email"}
            icon={"fi-rr-envelope"}
            value={formData.email}
            handleChange={handleChange}
          />
          <InputBox
            name={"password"}
            id={"password"}
            type={"password"}
            placeholder={"Password"}
            icon={"fi-rr-key"}
            value={formData.password}
            handleChange={handleChange}
          />
          {errorMessage && <p>{errorMessage}</p>}

          {/* SUBMIT Button */}
          <button
            className="btn-dark center mt-14"
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading
              ? "Loading..."
              : type === "signin"
              ? "Sign in"
              : "Sign up"}
          </button>

          {/* DIVIDER for Google button */}
          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={googleIcon} alt="Google" className="w-5" />
            Continue with Google
          </button>

          {/* Links for sign in or sign up */}
          {type === "signin" ? (
            <p className="mt-6 textdarkgrç text-xl text-center">
              Don't have an account?{" "}
              <Link
                to={"/signup"}
                className="underline text-black text-xl ml-1"
              >
                Sign up
              </Link>
            </p>
          ) : (
            <p className="mt-6 textdarkgrç text-xl text-center">
              Already have an account?
              <Link
                to={"/signin"}
                className="underline text-black text-xl ml-1"
              >
                Sign in
              </Link>
            </p>
          )}
        </form>
      </section>
    </AnimationWrapper>
  );
}

export default UserAuthForm;
