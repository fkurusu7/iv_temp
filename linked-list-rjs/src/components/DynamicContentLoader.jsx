import { useState } from "react";

function DynamicContentLoader() {
  const [content, setContent] = useState([]);

  const loadContent = async (id) => {
    await new Promise((resolve) => {
      setTimeout(resolve, 100);
    });

    const loadedContent = { id, text: `Tab ${id} Data` };
    setContent((prevData) => [...prevData, loadedContent]);
  };

  const handleClick = (id) => loadContent(id);

  return (
    <div className="dynamic-wrapper">
      <div className="buttons-wrapper">
        <button className="btn" onClick={() => handleClick(1)}>
          tab-1
        </button>
        <button className="btn" onClick={() => handleClick(2)}>
          tab-2
        </button>
        <button className="btn" onClick={() => handleClick(3)}>
          tab-3
        </button>
        <button className="btn" onClick={() => handleClick(4)}>
          tab-4
        </button>
        <button className="btn" onClick={() => handleClick(5)}>
          tab-5
        </button>
      </div>

      <div className="dynamic-content">
        <h2>Loaded Content</h2>
        <ul>
          {content.map((item, i) => {
            return <li key={`${item.id} - ${i}`}>{item.text}</li>;
          })}
        </ul>
      </div>
    </div>
  );
}

export default DynamicContentLoader;
