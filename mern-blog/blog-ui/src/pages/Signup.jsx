import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (ev) => {
    setFormData({ ...formData, [ev.target.id]: ev.target.value.trim() });
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setErrorMessage("Please fill out all fields.");
    }

    try {
      setErrorMessage(null);
      setIsLoading(true);
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const jsonData = await response.json();
      console.log(jsonData);
      if (!response.ok) {
        setErrorMessage(jsonData.message);
      }
      if (response.ok) {
        navigate("/signin");
      }
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link
            to={"/"}
            className="no-underline text-4xl font-semibold dark:text-white"
          >
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Kurusu&apos;s
            </span>
            Blog
          </Link>
          <p className="text-sm mt-5">
            Demo project. Sign up with your email and password or Google
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Name" />
              <TextInput
                type="text"
                placeholder="Name"
                id="name"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Email" />
              <TextInput
                type="email"
                placeholder="Email"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <div>
              <Button
                gradientDuoTone="purpleToPink"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    <span className="pl-3">Loading...</span>
                  </>
                ) : (
                  "Sign up"
                )}
              </Button>
            </div>
            {errorMessage && (
              <Alert className="mt-5" color="failure">
                {errorMessage}
              </Alert>
            )}
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an Account?</span>
            <Link to={"/signin"} className="text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
