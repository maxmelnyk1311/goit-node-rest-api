import express from "express";
import { userRegister, userLogIn, userLogOut, getCurrentUser, uploadAvatar } from "../controllers/usersControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";
import uploadMiddleware from "../middleware/upload.js";

const jsonParser = express.json();

const usersRouter = express.Router();

usersRouter.post("/register", jsonParser, userRegister);
usersRouter.post("/login", jsonParser, userLogIn);
usersRouter.post("/logout", authMiddleware, userLogOut);
usersRouter.get("/current", authMiddleware, getCurrentUser);
usersRouter.patch(
    "/avatar",
    authMiddleware,
    uploadMiddleware.single("avatar"),
    uploadAvatar,
);

export default usersRouter;