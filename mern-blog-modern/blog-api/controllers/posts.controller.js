import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { logger } from "../utils/logger.js";

const getS3Client = () => {
  return new S3Client({
    region: "us-east-2",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
};

const generateImageUploadUrl = async () => {
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
    const urlUploadImage = await generateImageUploadUrl();
    res.status(200).json({ urlUploadImage });
  } catch (error) {
    next(error);
  }
};
