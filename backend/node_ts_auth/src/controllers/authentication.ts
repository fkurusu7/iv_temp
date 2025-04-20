import express from "express";
import { createUser, getUserByEmail, User, UserModel } from "../db/user";
import { authentication, random } from "../helpers";

export const register = async (
  req: express.Request,
  res: express.Response
): Promise<express.Response | void> => {
  try {
    const { username, password, email } = req.body;

    if (!email || !password || !username) {
      return res.sendStatus(400);
    }

    const existingUSer = await getUserByEmail(email);
    if (existingUSer) return res.sendStatus(400);

    const salt = random();
    const user = await createUser({
      email,
      username,
      authentication: {
        salt,
        password: authentication(salt, password),
      },
    });

    return res.status(200).json(user).end();
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

export const login = async (req: express.Request, res: express.Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(400);

    const user = (await UserModel.findOne({ email }).select(
      "+authentication.password +authentication.salt"
    )) as User | null;

    if (!user) return res.sendStatus(400);

    const expectedHash = authentication(user.authentication.salt, password);
  } catch (error) {
    console.log("Logging in Error: ", error);
    return res.sendStatus(400);
  }
};
