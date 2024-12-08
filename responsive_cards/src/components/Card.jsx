/* eslint-disable react/prop-types */
function Card({ title, description, imageSrc, borderClr }) {
  return (
    <div className="card" style={{ borderColor: borderClr }}>
      <h3>{title}</h3>
      <p>{description}</p>
      <img src={imageSrc} alt="SVG" />
    </div>
  );
}

export default Card;
