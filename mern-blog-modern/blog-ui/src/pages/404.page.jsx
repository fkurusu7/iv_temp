import { Link } from "react-router-dom";
import notFound from "./../imgs/404.png";
import logo from "./../imgs/full-logo.png";

function PageNotFound() {
  return (
    <section className="h-cover relative p-10 flex flex-col items-center gap-20 text-center">
      <img
        src={notFound}
        alt="Not found page"
        className="select-none border-2 border-grey w-72 aspect-square object-cover"
      />
      <h1 className="text-4xl font-gelasio leading-7 ">Page not found</h1>
      <p className="text-dark-grey text-xl leading-7 mt-8">
        The page does not exist. Head back to{" "}
        <Link to={"/"} className="text-black underline">
          home page
        </Link>
      </p>
      <div className="mt-auto">
        <img
          src={logo}
          alt="logo"
          className="h-8 object-contain block mx-auto select-none"
        />
      </div>
    </section>
  );
}

export default PageNotFound;
