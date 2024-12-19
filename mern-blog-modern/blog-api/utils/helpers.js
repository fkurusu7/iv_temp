import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import User from "../schemas/User.js";

export const formatDataToSend = (user) => {
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

  return {
    accessToken,
    profile_img: user.personal_info.profile_img,
    username: user.personal_info.username,
    fullname: user.personal_info.fullname,
  };
};

export const generateUsername = async (email) => {
  let username = email.split("@")[0];
  let isUsernameNotUnique = await User.exists({
    "personal_info.username": username,
  }).then((result) => result);

  return isUsernameNotUnique ? username + nanoid() : username;
};
