import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
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
    return res
      .status(400)
      .json({ message: "Server Error", error: error.message });
  }
};
