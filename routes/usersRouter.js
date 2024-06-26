import express from "express";
import { userRegister, userLogIn, userLogOut, getCurrentUser, uploadAvatar, userVerify, resendVerification } from "../controllers/usersControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/upload.js";

const jsonParser = express.json();

const usersRouter = express.Router();

usersRouter.post("/register", jsonParser, userRegister);
usersRouter.post("/login", jsonParser, userLogIn);
usersRouter.post("/logout", authMiddleware, userLogOut);
usersRouter.get("/current", authMiddleware, getCurrentUser);
usersRouter.patch(
    "/avatars",
    authMiddleware,
    uploadMiddleware.single("avatar"),
    uploadAvatar,
);
usersRouter.get("/verify/:verificationToken", userVerify);
usersRouter.post("/verify", resendVerification);



export default usersRouter;