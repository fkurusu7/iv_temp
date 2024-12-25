import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { logger } from "../utils/logger.js";
import { errorHandler } from "../utils/error.js";

const getS3Client = () => {
  return new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

const generateAWSImageUploadUrl = async () => {
  const s3Client = getS3Client();
  const date = new Date();
  const imageName = `${nanoid()}-${date.getTime()}.jpeg`;

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: imageName,
    ContentType: "image/jpeg",
  });
  const urlUploadImage = await getSignedUrl(s3Client, command, {
    Expires: 1000,
  });

  return urlUploadImage;
};

export const getImageUploadUrl = async (req, res, next) => {
  try {
    const urlUploadImage = await generateAWSImageUploadUrl();
    res.status(200).json({ urlUploadImage });
  } catch (error) {
    next(error);
  }
};

// Image upload from Editor.js
export const fetchImageByUrl = async (req, res, next) => {
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  try {
    const { url } = req.body;

    if (!url) {
      return res
        .status(400)
        .json({ success: 0, error: "Valid URL is required" });
    }

    // Validate if URL points to a VALID image
    const headResponse = await fetch(url, { method: "HEAD" });
    const contentType = headResponse.headers.get("content-type");
    const contentLength = parseInt(
      headResponse.headers.get("content-length") || "0"
    );

    // Validate image type
    if (!ALLOWED_TYPES.includes(contentType)) {
      return res.status(400).json({
        success: 0,
        error: "Invalid image type",
      });
    }

    // Validate size
    if (contentLength > MAX_IMAGE_SIZE) {
      return res.status(400).json({
        success: 0,
        error: "Image too large (max 5MB)",
      });
    }

    // Fetch the actual image
    const imageResponse = await fetch(url);
    logger.info(imageResponse);

    // Return the validated image information
    return res.status(200).json({
      success: 1,
      url: url,
      meta: {
        type: contentType,
        size: contentLength,
      },
    });
  } catch (error) {
    logger.error("500 - Failed to fetch image: ", error.message);
    return (
      res.status(500),
      json({
        success: 0,
        error: "Failed to fetch image",
      })
    );
  }
};
