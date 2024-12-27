import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { nanoid } from "nanoid";
import { logger } from "../utils/logger.js";
import { errorHandler } from "../utils/error.js";
import Post from "../schemas/Post.js";
import Tag from "../schemas/Tag.js";
import User from "../schemas/User.js";
import mongoose from "mongoose";
import { generateSlug } from "../utils/slugify.js";

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

// Create a Post
export const createPost = async (req, res, next) => {
  const start = performance.now();
  try {
    const userId = req.user.id;
    const { title, banner, content, tags, description, draft } = req.body;

    // Validation helper function
    const validatePostData = () => {
      if (draft && !title) {
        logger.error(
          "Title empty: " + title,
          new Error("Draft - Title is empty")
        );
        return next(
          errorHandler(400, "Please provide Title field for a Draft")
        );
      }

      const requiredFields = {
        title,
        banner,
        content,
        tags,
        description,
      };
      const emptyFields = Object.entries(requiredFields).filter(
        ([key, value]) => {
          if (key === "content") return Object.keys(value).length === 0;
          if (key === "tags") return value.length === 0;
          return !value;
        }
      );

      if (emptyFields.length > 0) {
        return next(
          errorHandler(
            400,
            `Missing required fields: ${emptyFields.join(", ")}`
          )
        );
      }
    };
    validatePostData();

    // Process Tags
    const processedTags = tags.map((tag) => tag.toLowerCase().trim());
    const uniqueTags = [...new Set(processedTags)]; // Remove duplicates
    logger.info(`TAGS: ${uniqueTags}`);

    // handle tags in bulk
    const tagOperations = uniqueTags.map((tagName) => ({
      updateOne: {
        filter: { name: tagName },
        update: {
          name: tagName,
          createdBy: userId,
          // Generate slug here since bulkWrite won't trigger pre-save
          slug: generateSlug(tagName),
        },
        upsert: true,
      },
    }));
    await Tag.bulkWrite(tagOperations);
    const tagDocs = await Tag.find({ name: { $in: uniqueTags } });
    const tagIds = tagDocs.map((tag) => tag._id);

    // Create post with processed tags
    const post = new Post({
      title,
      banner,
      content,
      description,
      draft,
      tags: tagIds,
      userId,
    });

    // Save post - slug will be generated by middleware
    // Use transaction to ensure data consitency
    const session = await mongoose.startSession();
    let savedPost;

    try {
      await session.withTransaction(async () => {
        savedPost = await post.save({ session });

        await User.findByIdAndUpdate(
          userId,
          {
            $inc: { "account_info.total_posts": 1 },
            $push: { posts: savedPost._id },
          },
          { session }
        );
      });
    } finally {
      await session.endSession();
    }

    // Log performance metrics
    const duration = performance.now() - start;
    logger.info("Post creation performance", {
      duration,
      userId: req.user.id,
      tagsCount: tags.length,
    });

    // Return response
    res.status(201).json({
      success: true,
      data: savedPost,
      message: "Post created successfully",
    });
  } catch (error) {
    logger.error("Create post error:", {
      error: error.message,
      userId: req.user?.id,
      title: req.body?.title,
    });
    next(error);
  }
};

// TODO: create  tag route to fetch tags and return them to the front
