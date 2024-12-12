import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
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
