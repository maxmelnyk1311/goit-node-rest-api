import express from "express";
import { userRegister, userLogIn, userLogOut } from "../controllers/usersControllers.js";
import authMiddleware from "../middleware/authMiddleware.js";

const jsonParser = express.json();

const usersRouter = express.Router();

usersRouter.post("/register", jsonParser, userRegister);
usersRouter.post("/login", jsonParser, userLogIn);
usersRouter.post("/logout", authMiddleware, userLogOut);

export default usersRouter;