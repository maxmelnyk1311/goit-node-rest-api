import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { createUserSchema, logInUserSchema } from "../schemas/userSchemas.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password, subscription } = req.body;
    const emailTrimAndLower = email.trim().toLowerCase();

    const { error } = createUserSchema.validate(
      { email: emailTrimAndLower, password, subscription },
      {
        convert: false,
      }
    );
    console.log("error: ", error);
    if (typeof error !== "undefined") {
      return res
        .status(400)
        .json({ message: "Помилка від Joi або іншої бібліотеки валідації" });
    }

    const user = await User.findOne({ email: emailTrimAndLower });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userInfo = await User.create({
      email: emailTrimAndLower,
      password: passwordHash,
      subscription,
    });
    res.status(201).json(userInfo);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userLogIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const emailTrimAndLower = email.trim().toLowerCase();

    const { error } = logInUserSchema.validate(
      { email: emailTrimAndLower, password },
      {
        convert: false,
      }
    );
    if (typeof error !== "undefined") {
      return res
        .status(400)
        .json({ message: "Помилка від Joi або іншої бібліотеки валідації" });
    }

    const user = await User.findOne({ email: emailTrimAndLower });
    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: 60 * 60 }
    );
    await User.findByIdAndUpdate(user._id, { token });

    res.status(200).json({
      token,
      user: {
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userLogOut = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
