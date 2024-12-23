import { Link } from "react-router-dom";
import logo from "./../imgs/logo.png";
import defaultBanner from "./../imgs/blog-banner.png";
import AnimationWrapper from "../common/page-animation";
import { uploadImageToAWS } from "../common/aws";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";

function Editor() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadImgError, setUploadImgError] = useState(null);

  const handleBannerUpload = async (ev) => {
    const img = ev.target.files[0];
    if (!img) return;

    let loadingToast = toast.loading("Uploading...");

    setUploadImgError(null);
    setIsUploadingImage(true);

    try {
      const imageUploadedUrl = await uploadImageToAWS(img);
      setUploadedImage(imageUploadedUrl);
      toast.success("Image uploaded successfully!", {
        id: loadingToast, // Replaces the loading toast
      });
    } catch (error) {
      setUploadImgError(error.message);
      toast.error(err.message || "Failed to upload image", {
        id: loadingToast, // Replaces the loading toast
      });
      setUploadedImage(null);
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <>
      <Toaster />
      <nav className="navbar">
        <Link to={"/"} className="flex-none w-10">
          <img src={logo} alt="logo" />
        </Link>
        <p className="max-md:hidden text-black line-clamp-1 w-full">New Post</p>
        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2">Publish</button>
          <button className="btn-light py-2">Save draft</button>
        </div>
      </nav>

      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video bg-white border-4 border-grey hover:opacity-80">
              <label htmlFor="uploadBaner">
                {isUploadingImage && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-30">
                    <p className="text-white">Uploading...</p>
                  </div>
                )}
                <img
                  src={uploadedImage || defaultBanner}
                  alt="banner"
                  className={`z-20 cursor-pointer ${
                    isUploadingImage && "opacity-50"
                  }`}
                />
                <input
                  type="file"
                  id="uploadBaner"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                  disabled={isUploadingImage}
                />
              </label>
            </div>
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
}

export default Editor;
