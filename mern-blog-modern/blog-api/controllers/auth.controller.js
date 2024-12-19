import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "./../schemas/User.js";
import { logger } from "./../utils/logger.js";

import { formatDataToSend, generateUsername } from "../utils/helpers.js";

// regex for email
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// regex for password
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

export const signup = async (req, res, next) => {
  const { fullname, email, password } = req.body;

  // Validate data
  if (fullname.length < 3) {
    return res
      .status(403)
      .json({ error: "Fullname must be at least 3 letters long" });
  }
  if (!email.length) {
    return res.status(403).json({ error: "Email is empty" });
  }
  if (!emailRegex.test(email)) {
    return res.status(403).json({ error: "Email is invalid" });
  }
  if (!passwordRegex.test(password)) {
    return res.status(403).json({
      error:
        "Password should be 6 to 20 characters long with a numeric, lowercase and uppercase letters",
    });
  }

  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    const username = await generateUsername(email);

    let user = new User({
      personal_info: {
        fullname,
        email,
        password: hashedPassword,
        username,
      },
    });

    const savedUser = await user.save();
    const userFormatted = formatDataToSend(savedUser);
    logger.info("User formatted: " + userFormatted);
    return res.status(200).json(userFormatted);
  } catch (error) {
    console.log("ERROR X ", error);
    if (error.code === 11000) {
      logger.error("MONGO Error", error);
      error.statusCode = 409;
      error.message = "Email already exists";
      logger.error("Email already exists", error);
      next(error);
    }
    logger.error("SIGNUP error: ", error);
  }
};
