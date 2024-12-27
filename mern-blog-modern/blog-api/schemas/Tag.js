import mongoose, { Schema } from "mongoose";
import { generateSlug } from "../utils/slugify.js";

const tagSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    postCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timesatmps: true }
);

//  create indexes for better query performance
tagSchema.index({ name: 1 });
tagSchema.index({ slug: 1 });

// PRE-save middleware to generate slug from name
tagSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = generateSlug(this.name);
  }
  next();
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
