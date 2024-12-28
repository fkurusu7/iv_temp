import { useEffect, useState } from "react";

function ExistingTags({ editorFormData, setEditorFormData }) {
  const [existingTags, setExistingTags] = useState([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);
  const [errorTags, setErrorTags] = useState(null);

  // Fetch Top Tags
  useEffect(() => {
    const fetchTopTags = async (params) => {
      setIsLoadingTags(true);
      setErrorTags("");
      try {
        const response = await fetch("/api/tags/top");
        if (!response.ok) {
          throw new Error("Failed to fetch tags");
        }
        const jsonResponse = await response.json();
        setExistingTags(jsonResponse.data);
      } catch (error) {
        console.log("Tags Error: ", error.message);
        setErrorTags(
          "Error loading Tags. Please add by hand your post's tag(s)"
        );
        setExistingTags([]);
      } finally {
        setIsLoadingTags(false);
      }
    };

    fetchTopTags();
  }, []);

  const handleAddExistingTag = (tag) => {
    // Prevent adding duplicate tags
    if (!editorFormData.tags.includes(tag)) {
      setEditorFormData((prev) => ({ ...prev, tags: [...prev.tags, tag] }));
    }
  };

  const isTagSelected = (tag) => editorFormData.tags.includes(tag);

  return (
    <div className="m-2 w-full">
      {isLoadingTags ? (
        <p className="text-gray-600">Loading tags...</p>
      ) : errorTags ? (
        <p className="text-red-500">{errorTags}</p>
      ) : existingTags.length === 0 ? (
        <p className="text-gray-600">No Tags found</p>
      ) : (
        <>
          <p>Existing tags:</p>
          <div className="flex flex-wrap gap-2 m-3">
            {existingTags.map((tag, idx) => {
              const selected = isTagSelected(tag);
              return (
                <button
                  key={`${tag}-${idx}`}
                  className={`
                    outline-none min-w-[1ch] py-1 px-2 
                    bg-dark-grey text-white rounded-full 
                    inline-block transition-opacity
                    ${
                      selected
                        ? "cursor-not-allowed bg-opacity-50"
                        : "cursor-pointer hover:bg-opacity-50"
                    }
                  `}
                  disabled={selected}
                  onClick={() => handleAddExistingTag(tag)}
                  title={selected ? "Tag already added" : "Click to add tag"}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default ExistingTags;
