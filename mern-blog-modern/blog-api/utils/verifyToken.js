import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import { logger } from "./logger.js";

export const verifyToken = (req, res, next) => {
  // get token from request cookies process.env.USER_COOKIE
  logger.info(req);
  logger.info("====> Cookies: " + req.cookies);
  const token = req.cookies.user_token;
  logger.info("====> TOKEN: " + token);

  // validate there is a token, if not error 401 Unauthorized
  if (!token) {
    return next(errorHandler(401, "Unauthorized"));
  }
  // veify token with jwt.verify
  jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
    //  -- error?  401 Unauthorized
    if (error) {
      return next(errorHandler(401, "Unauthorized"));
    }
    // add user (from token) to request ==> req.user = user
    req.user = decoded;
    // go to the next action with next()
    next();
  });
};
