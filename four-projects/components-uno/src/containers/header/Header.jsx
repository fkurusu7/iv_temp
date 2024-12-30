import "./header.css";

import people from "./../../assets/people.png";
import ai from "./../../assets/ai.png";

function Header() {
  return (
    <div className="gpt3__header section__padding" id="home">
      <div className="gpt3__header-content">
        <h1 className="gradient__text">
          Lets Build Something amaizing with GPT-3 OpenAI
        </h1>
        <p>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Est,
          officiis perferendis aperiam pariatur eaque unde voluptatum odio
          soluta sequi, sit consectetur, totam autem nostrum amet similique.
          Ipsa placeat, non ratione atque optio dicta enim obcaecati voluptate
          sed qui libero repellendus!
        </p>
        <div className="gpt3__header-content-input">
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Your Email Address"
          />
          <button type="button">Get started</button>
        </div>

        <div className="gpt3__header-content__people">
          <img src={people} alt="people" />
          <p>1,600 people requested access a visit in last 24 hours</p>
        </div>
      </div>
      <div className="gpt3__header-image">
        <img src={ai} alt="AI" />
      </div>
    </div>
  );
}

export default Header;
