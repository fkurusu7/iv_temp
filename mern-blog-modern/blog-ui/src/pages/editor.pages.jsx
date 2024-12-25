// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
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

const uploadImageByUrl = async (url) => {
  console.log("URL image", url);
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

const uploadImageByFile = async (img) => {
  try {
    const uploadedImageURL = await uploadImageToAWS(img);
    return { success: 1, file: { url: uploadedImageURL } };
  } catch (error) {
    console.log(error.message);
    console.log(error);
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
  // image: {
  //   class: Image,
  //   config: {
  //     // endpoints: {
  //     //   byFile: "your-backend-upload-endpoint", // Replace with your upload endpoint
  //     // },
  //     uploader: {
  //       uploadByUrl: uploadImageByUrl,
  //       uploadByFile: uploadImageByFile,
  //     },
  //     actions: [
  //       {
  //         name: "withUrl",
  //         icon: '<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10.043 8.265l3.183-3.183h-2.924a4.29 4.29 0 0 0-4.285 4.285v1.06h1.06v-1.06a3.23 3.23 0 0 1 3.225-3.225h2.924l-3.183 3.183z"/><path d="M10.043 11.735l3.183 3.183h-2.924a4.29 4.29 0 0 1-4.285-4.285v-1.06h1.06v1.06a3.23 3.23 0 0 0 3.225 3.225h2.924l-3.183-3.183z"/></svg>',
  //         title: "Add image by URL",
  //         toggle: true,
  //       },
  //     ],
  //   },
  // },
  image: {
    class: Image,
    config: {
      uploader: {
        uploadByUrl: uploadImageByUrl,
        uploadByFile: uploadImageByFile,
      },
    },
  },
  code: Code,
  linkTool: {
    class: LinkTool,
    config: {
      endpoint: "your-backend-link-endpoint", // Replace with your link endpoint
    },
  },
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  // const [uploadImgError, setUploadImgError] = useState(null);

  // TODO: Add tag component, to add new tags use an input to get the tags separated by comas, add a multi-select element which loads the persisted tags and could be selected for the current post, for new tags, these will be saved after the post is published.

  const postInitialState = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: {} },
  };
  const [editorFormData, setEditorFormData] = useState(postInitialState);

  useEffect(() => {
    let editor;

    const debouncedOnChange = debounce(async () => {
      try {
        const savedData = await editor.save();
        setEditorFormData((prev) => ({ ...prev, content: savedData }));
      } catch (error) {
        console.error("Saving failed...", error);
      }
    }, 500);

    const initEditor = async () => {
      if (!editorInstanceRef.current) {
        try {
          // const EditorJS = await import("@editorjs/editor-js");
          editor = new EditorJS({
            holder: "textEditor",
            tools: EDITOR_JS_TOOLS,
            data: editorFormData.content,
            placeholder: "Post Content",
            onChange: debouncedOnChange,
            onReady: () => {
              editorInstanceRef.current = editor;
            },
          });
        } catch (error) {
          console.error("Editor initialization failed:", error);
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

  console.log(editorFormData);
  const handleBannerUpload = async (ev) => {
    const img = ev.target.files[0];
    if (!img) return;

    let loadingToast = toast.loading("Uploading...");

    // setUploadImgError(null);
    setIsUploadingImage(true);

    try {
      const imageUploadedUrl = await uploadImageToAWS(img);
      setEditorFormData({
        ...editorFormData,
        [ev.target.id]: imageUploadedUrl,
      });
      toast.success("Image uploaded successfully!", {
        id: loadingToast,
      });
    } catch (error) {
      toast.error(error.message || "Failed to upload image", {
        id: loadingToast,
      });
      setUploadedImage(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleTitleKeyDown = (ev) => {
    // Avoid pressing Enter key in text area box
    if (ev.keyCode === 13) {
      ev.preventDefault();
    }
  };

  const handleTitleChange = (ev) => {
    const input = ev.target;
    const { value, id } = input;
    input.style.height = "auto";
    input.style.height = input.scrollHeight + "px";
    setEditorFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to={"/"} className="flex-none w-10">
          <img src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">
          {editorFormData.title ? editorFormData.title : "New Post"}
        </p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
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
                    isUploadingImage && "opacity-50"
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
            {/* BANNER end */}
          </div>
          {/* TITLE */}
          <textarea
            name="title"
            id="title"
            placeholder="Title Post"
            // className="text-4xl border border-grey px-2 rounded font-medium w-full h-[68px] outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
            className="text-2xl border border-grey p-4 rounded font-medium w-full h-[48px] overflow-hidden leading-none outline-none resize-none mt-10 placeholder:opacity-40"
            onKeyDown={handleTitleKeyDown}
            onChange={handleTitleChange}
            value={editorFormData.title}
            rows="1"
          ></textarea>
          <hr className="w-full opacity-10 my-5" />
          {/* TAGS */}
          {/* CONTENT */}
          {/* EDITOR Area */}
          <div id="textEditor" className="max-w-full"></div>
        </section>
      </AnimationWrapper>
    </>
  );
}

export default Editor;
