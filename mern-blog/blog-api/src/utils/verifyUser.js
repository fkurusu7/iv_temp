import jwt from "jsonwebtoken";
import { errorHAndler } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.user_token;
  if (!token) {
    return next(errorHAndler(401, "Unauthorized"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(errorHAndler(401, "Unauthorized"));
    }
    console.log("VERIFY token: ", user);
    req.user = user;
    next();
  });
};
