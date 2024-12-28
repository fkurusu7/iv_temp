import Tag from "../schemas/Tag.js";

export const getAllTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({})
      .sort({ name: 1 })
      .select("name slug postCount");

    res.status(200).json({ success: true, data: tags });
  } catch (error) {
    next(error);
  }
};

export const getTopTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({})
      .sort({ postCount: -1, name: 1 })
      .limit(5)
      .select("name -_id");

    res.status(200).json({
      success: true,
      data: tags.map((tag) => tag.name),
    });
  } catch (error) {
    next(error);
  }
};
