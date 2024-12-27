import mongoose, { Schema } from "mongoose";
import Tag from "./Tag.js";
import { generateSlug } from "../utils/slugify.js";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    slug: {
      type: String,
      // required: true,
      unique: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    banner: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      maxlength: 200,
      required: true,
    },
    content: {
      type: [],
      required: true,
      default: [],
    },
    tags: {
      type: [Schema.Types.ObjectId],
      ref: "tag",
    },
    activity: {
      total_likes: {
        type: Number,
        default: 0,
        min: 0,
      },
      total_comments: {
        type: Number,
        default: 0,
        min: 0,
      },
      total_reads: {
        type: Number,
        default: 0,
        min: 0,
      },
      total_parent_comments: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    draft: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    comments: {
      type: [Schema.Types.ObjectId],
      ref: "comments",
    },
    version: { type: Number, default: 1 },
    history: [
      {
        content: Object,
        updatedAt: Date,
        version: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for better query performance
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ slug: 1 }, { unique: true });
postSchema.index({ tags: 1, createdAt: -1 });

// When updating posts, maintain history
postSchema.pre("save", function (next) {
  if (this.isModified("content")) {
    this.history.push({
      content: this.content,
      updatedAt: new Date(),
      version: this.version,
    });
    this.version += 1;
  }
  next();
});

// Middleware to update tag postCount when a post is saved or removed
postSchema.pre("save", async function (next) {
  if (this.isModified("tags")) {
    // Ensure oldTags is an array of strings/ObjectIds, not nested array
    const oldTags = (this._oldTags || []).flat();
    const newTags = (this.tags || []).flat();

    // Decrease count for removed tags
    const removedTags = oldTags.filter((tag) => !newTags.includes(tag));
    if (removedTags.length) {
      await Tag.updateMany(
        { _id: { $in: removedTags } },
        { $inc: { postCount: -1 } }
      );
    }

    // Increase count for new tags
    const addedTags = newTags.filter((tag) => !oldTags.includes(tag));
    if (addedTags.length) {
      await Tag.updateMany(
        { _id: { $in: addedTags } },
        { $inc: { postCount: 1 } }
      );
    }
  }
  next();
});

postSchema.pre("remove", async function (next) {
  if (this.tags?.length) {
    await Tag.updateMany(
      { _id: { $in: this.tags } },
      { $inc: { postCount: -1 } }
    );
  }
  next();
});

// check slug uniqueness
postSchema.methods.generateUniqueSlug = async function () {
  let slug = this.slug;
  let counter = 1;

  while (true) {
    const existingPost = await this.constructor.findOne({
      slug,
      _id: { $ne: this._id }, // Exclude current post when updating
    });

    if (!existingPost) break;

    // If slug exists, append counter and try again
    slug = `${this.slug}-${counter}`;
    counter++;
  }

  this.slug = slug;
};

// Update the pre-save middleware to use the unique slug generator
postSchema.pre("save", async function (next) {
  if (this.isModified("title")) {
    this.slug = generateSlug(this.title);
    await this.generateUniqueSlug();
  }
  next();
});

const Post = mongoose.model("Post", postSchema);
export default Post;
