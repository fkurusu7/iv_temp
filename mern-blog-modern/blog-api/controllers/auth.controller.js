import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { nanoid } from "nanoid";

import User from "./../schemas/User.js";
import { logger } from "./../utils/logger.js";
import { errorHandler } from "../utils/error.js";

// regex for email
let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
// regex for password
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

const formatDataToSend = (user) => {
  return {
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  return isUsernameNotUnique ? username + nanoid() : username;
};

export const signup = async (req, res, next) => {
  // Set timeout for the entire request
  const timeout = 30000; // 30 seconds
  res.setTimeout(timeout, () => {
    return next(errorHandler(408, "Request timeout - please try again"));
    // return res.status(408).json({
    //   error: "Request timeout - please try again",
    // });
  });

  const { fullname, email, password } = req.body;

  // Validate data
  if (fullname.length < 3) {
    return next(errorHandler(403, "Fullname must be at least 3 letters long"));
  }
  if (!email.length) {
    return next(errorHandler(403, "Email is empty"));
  }
  if (!emailRegex.test(email)) {
    return next(errorHandler(403, "Email is invalid"));
  }
  if (!passwordRegex.test(password)) {
    return next(
      errorHandler(
        403,
        "Password should be 6 to 20 characters long with a numeric, lowercase and uppercase letters"
      )
    );
  }

  try {
    const [hashedPassword, username] = await Promise.all([
      bcryptjs.hashSync(password, 10),
      generateUsername(email),
    ]);

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

    // Clear timeout since request completed successfully
    res.setTimeout(0);

    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    // Return response with user data formatted and access token
    return res
      .status(200)
      .cookie("user_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json(userFormatted);
  } catch (error) {
    if (error.code === 11000) {
      logger.error("Email already exists", error);
      return next(errorHandler(409, "Email already exists"));
    } else {
      logger.error("SIGNUP error: ", error);
      return next(error);
    }
  }
};

export const signin = async (req, res, next) => {
  let { email, password } = req.body;

  if (!email.length) {
    return next(errorHandler(403, "Email is empty"));
  }
  if (!emailRegex.test(email)) {
    return next(errorHandler(403, "Email is invalid"));
  }
  try {
    // Get USER info from DB
    const user = await User.findOne({ "personal_info.email": email });
    if (!user) {
      return next(errorHandler(404, "User/Email not found"));
    }

    // VALIDATE Password
    const validPassword = bcryptjs.compareSync(
      password,
      user.personal_info.password
    );
    logger.info("Passowrd: " + password);
    logger.info("Valid Passowrd: " + validPassword);
    if (!validPassword) {
      return next(errorHandler(404, "Invalid credentials"));
    }

    // Return response with user data formatted and access token
    const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    return res
      .status(200)
      .cookie("user_token", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json(formatDataToSend(user));
  } catch (error) {
    return next(error);
  }
};
