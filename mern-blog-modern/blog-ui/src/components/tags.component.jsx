// TODO: comprar drano max gel en walmart
import { useRef, useState } from "react";

function Tag({ tagName, handleRemovetag, handleTagEdit }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTag, setEditedTag] = useState(tagName);
  const inputRef = useRef(null);

  const handleKeyDown = (ev) => {
    if (ev.keyCode === 13) {
      ev.preventDefault();
      handleTagEdit(tagName, editedTag);
      ev.target.blur();
    }
  };

  return (
    <div className="relative mt-2 mr-2 p-2 pr-10 px-5 bg-white rounded-full inline-block hover:bg-opacity-50">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editedTag}
          onChange={(ev) => setEditedTag(ev.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing(false)}
          className="outline-none bg-transparent w-[11ch]"
          autoFocus
        />
      ) : (
        <p
          className="outline-none min-w-[1ch]"
          onClick={() => setIsEditing(true)}
        >
          {tagName}
        </p>
      )}
      <button
        className="rounded-full absolute right-3 top-1/2 mt-[2px] -translate-y-1/2"
        onClick={() => handleRemovetag(tagName)}
      >
        <i className="fi fi-br-cross text-sm pointer-events-none"></i>
      </button>
    </div>
  );
}

export default Tag;
