import Post from "../models/post.model.js";
import { errorHAndler } from "../utils/error.js";

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    console.log(oneMonthAgo);

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

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

export const remove = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHAndler(403, "You are not allowed to delete this post"));
  }

  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json({ message: "Post has been deleted" });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  console.log("REQ", req.user, req.params);
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHAndler(403, "You are not allowed to update this post"));
  }

  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
