import Post from "../models/post.model.js";
import { errorHAndler } from "../utils/error.js";

export const create = async (req, res, next) => {
  const { title, content } = req.body;
  console.log(req.body);
  console.log(req.user);
  const { isAdmin } = req.user;

  if (!isAdmin) {
    return next(errorHAndler(403, "You are not allowed to create a post"));
  }

  if (!title || !content) {
    return next(errorHAndler(400, "Please provide all required fields"));
  }

  const slug = title
    .toLowerCase()
    .split(" ")
    .join("-")
    .replace(/[^a-zA-Z0-9-]/g, "");
  const post = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await post.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
