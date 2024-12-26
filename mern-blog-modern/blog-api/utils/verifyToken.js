import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

export const verifyToken = (req, res, next) => {
  // get token from request cookies process.env.USER_COOKIE
  const token = req.cookies.user_token;
  // validate there is a token, if not error 401 Unauthorized
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  // veify token with jwt.verify
  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    //  -- error?  401 Unauthorized
    if (error) {
      return next(errorHandler(401, "Unauthorized"));
    }
    // add user (from token) to request ==> req.user = user
    req.user = user;
    // go to the next action with next()
    next();
  });
};
