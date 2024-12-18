import { Link } from "react-router-dom";
import InputBox from "../components/input.component";
import googleIcon from "../imgs/google.png";
import AnimationWrapper from "../common/page-animation";

function UserAuthForm({ type }) {
  return (
    <AnimationWrapper keyValue={type}>
      <section className="h-cover flex items-center justify-center">
        <form className="w-[80%] max-w-[400px]">
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
          />
          <InputBox
            name={"password"}
            id={"password"}
            type={"password"}
            placeholder={"Password"}
            icon={"fi-rr-key"}
          />
          <button className="btn-dark center mt-14" type="submit">
            {type === "signin" ? "Sign in" : "Sign up"}
          </button>

          <div className="relative w-full flex items-center gap-2 my-10 opacity-10 uppercase text-black font-bold">
            <hr className="w-1/2 border-black" />
            <p>or</p>
            <hr className="w-1/2 border-black" />
          </div>

          <button className="btn-dark flex items-center justify-center gap-4 w-[90%] center">
            <img src={googleIcon} alt="Google" className="w-5" />
            Continue with Google
          </button>

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
