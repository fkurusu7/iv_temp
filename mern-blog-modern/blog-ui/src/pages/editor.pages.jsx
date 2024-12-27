// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import { debounce } from "lodash";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Embed from "@editorjs/embed";
import Image from "@editorjs/image";
import Code from "@editorjs/code";
import InlineCode from "@editorjs/inline-code";
import LinkTool from "@editorjs/link";
import Marker from "@editorjs/marker";
import Quote from "@editorjs/quote";

import logo from "./../imgs/logo.png";
import defaultBanner from "./../imgs/blog-banner.png";
import AnimationWrapper from "../common/page-animation";
import { uploadImageToAWS } from "../common/aws";
import Tag from "../components/tags.component";

// Constants
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_TAGS = 5;
const MAX_TAG_LENGTH = 10;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];
const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

// Validation schemas
const validateForm = (formData) => {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = "Title is required";
  } else if (formData.title.length > MAX_TITLE_LENGTH) {
    errors.title = `Title must be less than ${MAX_TITLE_LENGTH} characters`;
  }

  if (!formData.description.trim()) {
    errors.description = "Description is required";
  } else if (formData.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
  }

  if (!formData.banner) {
    errors.banner = "Banner image is required";
  }

  if (formData.tags.length === 0) {
    errors.tags = "At least one tag is required";
  } else if (formData.tags.length > MAX_TAGS) {
    errors.tags = `Maximum ${MAX_TAGS} tags allowed`;
  }

  if (!formData.content || formData.content.blocks?.length === 0) {
    errors.content = "Content is required";
  }

  return errors;
};

// Image upload helpers
const validateImage = (file) => {
  if (!file) return "No file selected";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Invalid file type. Only JPG and PNG are allowed";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "File size too large. Maximum size is 5MB";
  }
  return null;
};

/* TODO: Work on this once the blog is done
const uploadImageByUrl = async (url) => {
  try {
    const response = await fetch("/api/posts/fetchImageUrl", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url }),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    if (!data.success) {
      return {
        success: 0,
        error: data.error || "Failed to fetch image",
      };
    }

    // Now fetch the image as a blob
    const imageResponse = await fetch(data.url);
    const blobImage = await imageResponse.blob();

    // Create a File object from the blob
    const imageFile = new File([blobImage], "image.jpg", {
      type: data.meta.type,
    });
    // Upload to AWS using your existing function
    const awsUrl = await uploadImageToAWS(imageFile);

    return {
      success: 1,
      file: {
        url: awsUrl,
      },
    };
  } catch (error) {
    console.error("Error uploading image by URL:", error);
    return {
      success: 0,
      error: error.message || "Could not fetch image",
    };
  }
};
*/
const uploadImageByFile = async (img) => {
  try {
    const validationError = validateImage(img);
    if (validationError) {
      throw new Error(validationError);
    }

    const uploadedImageURL = await uploadImageToAWS(img);
    return { success: 1, file: { url: uploadedImageURL } };
  } catch (error) {
    console.error("Upload Image Error: ", error);
    return { success: 0, error: "Failed to upload image" };
  }
};

// TODO: delete images that were deleted from the editor
// https://claude.ai/chat/541a35e5-d348-4167-93ab-2e75954e2cbf

const EDITOR_JS_TOOLS = {
  header: {
    class: Header,
    config: {
      placeholder: "Enter a header",
      levels: [2, 3, 4],
      defaultLevel: 2,
    },
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: "unordered",
    },
  },
  image: {
    class: Image,
    config: {
      uploader: {
        // uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  code: { class: Code, inlineToolbar: true },
  linkTool: LinkTool,
  quote: {
    class: Quote,
    inlineToolbar: true,
    config: {
      quotePlaceholder: "Enter a quote",
      captionPlaceholder: "Quote's author",
    },
  },
  marker: {
    class: Marker,
    shortcut: "CMD+SHIFT+M", // Keyboard shortcut
    config: {
      className: "custom-marker-class", // Optional custom CSS class
      defaultStyle: "background: #7fff51;", // Default marker style
    },
  },
  embed: {
    class: Embed,
    config: {
      services: {
        youtube: true,
        codesandbox: true,
      },
    },
  },
};

function Editor() {
  const editorInstanceRef = useRef(null);
  const postInitialState = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    description: "",
  };
  const [editorFormData, setEditorFormData] = useState(postInitialState);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const navigate = useNavigate();

  // EDITOR initialization
  useEffect(() => {
    let editor;

    const debouncedOnChange = debounce(async () => {
      try {
        const savedData = await editor.save();
        setEditorFormData((prev) => ({ ...prev, content: savedData }));
      } catch (error) {
        console.error("Editor save failed: ", error);
        toast.error("Failed to save Post Content");
      }
    }, 700);

    const initEditor = async () => {
      if (!editorInstanceRef.current) {
        try {
          editor = new EditorJS({
            holder: "textEditor",
            tools: EDITOR_JS_TOOLS,
            data: editorFormData.content,
            placeholder: "Start writing your post...",
            onChange: debouncedOnChange,
            onReady: () => {
              editorInstanceRef.current = editor;
            },
          });
        } catch (error) {
          console.error("Editor initialization failed: ", error);
          toast.error("Failed to initialize editor. Please reload page");
        }
      }
    };

    initEditor();

    // Cleanup
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.isReady
          .then(() => {
            editorInstanceRef.current.destroy();
            editorInstanceRef.current = null;
          })
          .catch((e) => console.error("ERROR destroying editor:", e));
      }
    };
  }, []);

  // Upload main (Banner) Post Image
  const handleBannerUpload = async (ev) => {
    const img = ev.target.files[0];
    if (!img) return;
    const validationError = validateImage(img);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    let loadingToast = toast.loading("Uploading Image...");
    setIsUploadingImage(true);

    try {
      const imageUploadedUrl = await uploadImageToAWS(img);
      setEditorFormData((prev) => ({
        ...prev,
        banner: imageUploadedUrl,
      }));
      toast.success("Image uploaded successfully!", {
        id: loadingToast,
      });
    } catch (error) {
      toast.error(error.message || "Failed to upload image", {
        id: loadingToast,
      });
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Do not allow Enter key to work
  const handleTitleKeyDown = (ev) => {
    // Avoid pressing Enter key in text area box
    if (ev.keyCode === 13) {
      ev.preventDefault();
    }
  };

  // Increase text area height
  const handleTextAreaChange = (ev) => {
    const { value, id } = ev.target;
    const input = ev.target;
    // Autoresize textarea
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";

    setEditorFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  // Add Tags to the EditorForm by pressing Enter Key or the Coma key
  const handleAddTag = (ev) => {
    if (
      ev.target.value.trim().length &&
      (ev.keyCode === 13 || ev.keyCode === 188)
    ) {
      ev.preventDefault();
      const tagName = ev.target.value.trim().toLowerCase();

      if (editorFormData.tags.length >= MAX_TAGS) {
        toast.error(`Maximum ${MAX_TAGS} tags allowed`);
        ev.target.value = "";
        return;
      }

      if (tagName.length > MAX_TAG_LENGTH) {
        toast.error(`Tag must be less than ${MAX_TAG_LENGTH} characters`);
        ev.target.value = "";
        return;
      }

      // check if tag already present in tags array
      if (editorFormData.tags.includes(tagName)) {
        toast.error("Tag already exists");
        ev.target.value = "";
        return;
      }

      setEditorFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagName],
      }));
      ev.target.value = "";
      // Clear error when tags are added
      setFormErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditorFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleTagEdit = (oldTag, newTag) => {
    if (!newTag.length) {
      toast.error("Tag cannot be empty");
      return;
    }
    if (newTag.length > MAX_TAG_LENGTH) {
      toast.error(`Tag must be less than ${MAX_TAG_LENGTH} characters`);
      return;
    }
    setEditorFormData((prev) => ({
      ...prev,
      tags: prev.tags.map((tag) =>
        tag === oldTag ? newTag.trim().toLowerCase() : tag
      ),
    }));
  };

  const handleSubmitPublish = async (ev) => {
    // Validate Editor Component Data
    const errors = validateForm(editorFormData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix the errors before publishing");
      return;
    }

    let loadingToast = toast.loading("Publishing...");
    setIsSubmitting(true);

    try {
      // TODO: Handle Draft posts, similar to publishing

      const response = await fetch("/api/posts/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editorFormData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to publish post");
      }

      toast.success("Post Published successfully", { id: loadingToast });
      navigate("/"); // TODO: start working on the Post page/component
    } catch (error) {
      console.log("Publish error: ", error);
      toast.error(error.message || "Failed to publish post", {
        id: loadingToast,
      });
    } finally {
      setIsSubmitting(true);
    }
  };

  console.log(editorFormData);

  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to={"/"} className="flex-none w-10">
          <img src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {editorFormData.title || "New Post"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button
            className="btn-dark py-2"
            onClick={handleSubmitPublish}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
          <button className="btn-light py-2">Save draft</button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          {/* BANNER Image */}
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
              <label htmlFor="banner">
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                    <p className="text-white">Uploading...</p>
                  </div>
                )}
                <img
                  src={editorFormData.banner || defaultBanner}
                  alt="banner"
                  className={`z-20 cursor-pointer ${
                    isUploadingImage ? "opacity-50" : ""
                  }`}
                />
                <input
                  type="file"
                  id="banner"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                  disabled={isUploadingImage}
                />
              </label>
            </div>
            {formErrors.banner && (
              <p className="text-red-500 text-sm mt-1">{formErrors.banner}</p>
            )}
            {/* BANNER end */}
          </div>
          {/* TITLE */}
          <div className="mt-10 space-y-6">
            <textarea
              name="title"
              id="title"
              placeholder="Title Post"
              className="text-2xl border border-grey p-4 rounded font-medium w-full h-[48px] overflow-hidden leading-none outline-none resize-none mt-10 placeholder:opacity-40"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTextAreaChange}
              value={editorFormData.title}
              rows="1"
            ></textarea>
            {formErrors.title && (
              <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {editorFormData.title.length}/{MAX_TITLE_LENGTH}
            </p>
          </div>

          {/* TAGS */}

          <div
            className={`relative input-box px-2 py-2 mt-2${
              formErrors.tags ? "border-red-500" : ""
            }`}
          >
            <input
              type="text"
              placeholder="Add tags (max 5 tags) by Pressing Enter or Coma Key..."
              className="sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white"
              onKeyDown={handleAddTag}
            />
            <div className="flex flex-wrap gap-2">
              {editorFormData.tags.map((tag, i) => {
                return (
                  <Tag
                    tagName={tag}
                    key={tag + i}
                    handleRemovetag={handleRemoveTag}
                    handleTagEdit={handleTagEdit}
                  />
                );
              })}
            </div>
            {formErrors.tags && (
              <p className="text-red-500 text-sm mt-1">{formErrors.tags}</p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {editorFormData.tags.length}/{MAX_TAGS} tags used
            </p>
          </div>
          {/* DESCRIPTION */}
          <div className="mt-10">
            <textarea
              name="description"
              id="description"
              placeholder={`Write a short description (max ${MAX_DESCRIPTION_LENGTH} characters)`}
              className={`text-lg border p-4 rounded font-medium w-full h-[48px] overflow-hidden leading-none outline-none resize-none placeholder:opacity-40 ${
                formErrors.description ? "border-red-500" : "border-grey"
              }`}
              onChange={handleTextAreaChange}
              value={editorFormData.description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows="1"
            ></textarea>
            {formErrors.description && (
              <p className="text-red-500 text-sm mt-1">
                {formErrors.description}
              </p>
            )}
            <p className="text-sm text-gray-500 mt-1">
              {editorFormData.description.length}/{MAX_DESCRIPTION_LENGTH}
            </p>
          </div>
          <hr className="w-full opacity-10 my-5" />
          {/* CONTENT */}
          {/* EDITOR Area */}
          <div>
            <div id="textEditor" className="max-w-full"></div>
            {/* ERRORS */}
            {formErrors.content && (
              <p className="text-red-500 text-sm mt-1">{formErrors.content}</p>
            )}
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}

export default Editor;
