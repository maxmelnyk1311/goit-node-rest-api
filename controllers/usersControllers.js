import * as fs from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcrypt";
import gravatar from "gravatar";
import Jimp from "jimp";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { createUserSchema, logInUserSchema } from "../schemas/userSchemas.js";

export const userRegister = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email === undefined) {
      return res.status(400).json({ message: "Write email!" });
    }

    const { error } = createUserSchema.validate(
      { email, password },
      {
        convert: false,
      }
    );
    if (typeof error !== "undefined") {
      return res.status(400).json({ message: error.message });
    }

    const emailTrimAndLower = email.trim().toLowerCase();
    const user = await User.findOne({ email: emailTrimAndLower });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const userInfo = await User.create({
      email: emailTrimAndLower,
      password: passwordHash,
      avatarURL: gravatar.url(emailTrimAndLower),
    });
    res.status(201).json({
      user: {
        email: userInfo.email,
        subscription: userInfo.subscription,
      },
    });
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const userLogIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (email === undefined) {
      return res.status(400).json({ message: "Write email!" });
    }

    const { error } = logInUserSchema.validate(
      { email, password },
      {
        convert: false,
      }
    );

    if (typeof error !== "undefined") {
      return res.status(400).json({ message: error.message });
    }

    const emailTrimAndLower = email.trim().toLowerCase();

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
};

export const getCurrentUser = async (req, res, next) => {
  res.status(200).json({
    email: req.user.email,
    subscription: req.user.subscription,
  });
};

export const uploadAvatar = async (req, res, next) => {
  try {
    if(!req.file) {
      return res.status(400).send({message: "We need image to change avatar!"})
    }
    const image = await Jimp.read(req.file.path);
    image.resize(250, 250).write(path.resolve(req.file.path));

    await fs.rename(
      req.file.path,
      path.resolve("public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
    res.json({ avatarURL: user.avatarURL});
  } catch (error) {
    console.error("Error: ", error);
    next(error);
  }
};

// export const getAvatar = async (req, res, next) => {
//   try {
//     console.log(req.user);
//     const user = await User.findById(req.user.id);

//     if (user === null) {
//       return res.status(404).send({ message: "User not found" });
//     }

//     if (user.avatarURL === null) {
//       return res.status(404).send({ message: "Avatar not found" });
//     }

//     res.sendFile(path.resolve("public/avatars", user.avatarURL));
//   } catch (error) {
//     console.error("Error: ", error);
//     next(error);
//   }
// };
