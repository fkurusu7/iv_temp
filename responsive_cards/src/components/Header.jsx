import Heading from "./Heading";

function Header() {
  return (
    <header>
      <Heading text={"Reliable, efficient delivery"} isBold={false} />
      <Heading text={"Powered by Technology"} isBold={true} />
      <p className="subtitle">
        Our Artificial Intelligence powered tools use millions of project data
        points to ensure that your project is successful
      </p>
    </header>
  );
}

export default Header;
