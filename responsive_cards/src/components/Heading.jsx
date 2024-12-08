/* eslint-disable react/prop-types */
function Heading({ text, isBold }) {
  return <h1 className={isBold ? "isBold" : "isLight"}>{text}</h1>;
}

export default Heading;
