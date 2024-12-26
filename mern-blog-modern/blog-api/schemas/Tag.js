import mongoose from "mongoose";

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
tagSchema.pre("save", (next) => {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove non-word chars (except spaces and dashes)
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/-+/g, "-") // Replace multiple dashes with single dash
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
  }
  next();
});

const Tag = mongoose.model("Tag", tagSchema);

export default Tag;
