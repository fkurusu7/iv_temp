import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHAndler } from "../utils/error.js";

export const signup = async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    next(errorHAndler(400, "All fields are required"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
  });

  try {
    await newUser.save();
    return res.status(201).json({ message: "Signed up successfully!" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(errorHAndler(400, "All fields are required"));
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(errorHAndler(404, "User not found"));
    }

    const validPassword = bcryptjs.compareSync(password, user.password);
    console.log(validPassword);
    if (!validPassword) {
      return next(errorHAndler(404, "Invalid Credentials"));
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res
      .status(200)
      .cookie("user_token", token, { httpOnly: true })
      .json({
        user: {
          id: user._id,
          isAdmin: user.isAdmin,
          email: user.email,
          name: user.name,
        },
      });
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      res
        .status(200)
        .cookie("user_token", token, { httpOnly: true })
        .json({
          user: {
            id: user._id,
            isAdmin: user.isAdmin,
            email: user.email,
            name: user.name,
          },
        });
    } else {
      const password =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(password, 10);
      const newUser = new User({
        name:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await newUser.save();

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET
      );
      res
        .status(200)
        .cookie("user_token", token, { httpOnly: true })
        .json({ user: { email: newUser.email, name: newUser.name } });
    }
  } catch (error) {}
};
