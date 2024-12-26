import mongoose, { Schema } from "mongoose";
import Tag from "./Tag";

const postSchema = mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    slug: {
      type: String,
      required: true,
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
    tags: [
      {
        type: [Schema.Types.ObjectId],
        ref: "tag",
      },
    ],
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
  },
  {
    timestamps: true,
  }
);

// Create compound indexes for better query performance
postSchema.index({ userId: 1, createdAt: -1 });
postSchema.index({ slug: 1 }, { unique: true });
postSchema.index({ tags: 1, createdAt: -1 });

// Middleware to update tag postCount when a post is saved or removed
postSchema.pre("save", async function (next) {
  if (this.isModified("tags")) {
    const oldTags = this._oldTags || [];
    const newTags = this.tags || [];

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
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and dashes)
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/-+/g, "-") // Replace multiple dashes with single dash
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes

    await this.generateUniqueSlug();
  }
  next();
});

const Post = mongoose.model("Post", postSchema);
export default Post;
