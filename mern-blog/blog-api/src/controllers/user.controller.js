import User from "../models/user.model.js";
import { errorHAndler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHAndler(403, "You are not allowed to update this user"));
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHAndler(403, "You are not allowed to update this user"));
    }

    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }

  if (req.body.name) {
    if (req.body.name.length < 6 || req.body.name.length > 20) {
      return next(
        errorHAndler(400, "User name must be between 7 and 20 characters")
      );
    }
    if (req.body.name.includes(" ")) {
      return next(errorHAndler(400, "User name cannot contain spaces"));
    }
    console.log(req.body.name, req.body.email, req.body.password);

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name: req.body.name,
            email: req.body.email,
            profilePicture: req.body.profilePicture,
            password: req.body.password,
          },
        },
        { new: true }
      );
      console.log(updatedUser);
      res.status(200).json({
        user: {
          id: updatedUser._id,
          email: updatedUser.email,
          name: updatedUser.name,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHAndler(403, "You are not allowed to delete this user"));
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};
