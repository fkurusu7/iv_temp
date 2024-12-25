export const uploadImageToAWS = async (image) => {
  try {
    // Validate file type and size
    if (!image.type.includes("image/")) {
      throw new Error("Please upload an image file");
    }
    // 5mb limit
    if (image.size > 5 * 1024 * 1024) {
      throw new Error("Image size should be less than 5MB");
    }

    // Fetch AWS-S3 signed URL to upload image from frontend
    const response = await fetch("/api/posts/getImageUploadUrl");
    if (!response.ok) {
      throw new Error("Failed to get upload-URL");
    }

    const { urlUploadImage } = await response.json();

    // Upload to S3
    const awsResponse = await fetch(urlUploadImage, {
      method: "PUT",
      headers: {
        "Content-Type": image.type,
      },
      body: image,
    });

    if (!awsResponse.ok) {
      throw new Error("Failed to upload image");
    }

    // Return the public URL
    return urlUploadImage.split("?")[0];
  } catch (error) {
    throw error; // Re-trow to handle in component
  }
};
