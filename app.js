<<<<<<< Updated upstream
import "dotenv/config";
=======
>>>>>>> Stashed changes
import express from "express";
import morgan from "morgan";
import cors from "cors";

<<<<<<< Updated upstream
import "./db/contacts.js";
import contactsRouter from "./routes/contactsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import authMiddleware from "./middleware/authMiddleware.js";
=======
import contactsRouter from "./routes/contactsRouter.js";
>>>>>>> Stashed changes

const app = express();

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

<<<<<<< Updated upstream
app.use("/api/contacts", authMiddleware, contactsRouter);
app.use("/users", usersRouter);
=======
app.use("/api/contacts", contactsRouter);
>>>>>>> Stashed changes

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});
