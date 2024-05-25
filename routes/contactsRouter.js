import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
<<<<<<< Updated upstream
  updateStatusContact,
} from "../controllers/contactsControllers.js";

const jsonParser = express.json();

=======
} from "../controllers/contactsControllers.js";

>>>>>>> Stashed changes
const contactsRouter = express.Router();

contactsRouter.get("/", getAllContacts);

<<<<<<< Updated upstream
contactsRouter.get("/:id", getOneContact); 

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", jsonParser, createContact);

contactsRouter.put("/:id", jsonParser, updateContact);

contactsRouter.patch("/:id/favorite", jsonParser, updateStatusContact);
=======
contactsRouter.get("/:id", getOneContact);

contactsRouter.delete("/:id", deleteContact);

contactsRouter.post("/", createContact);

contactsRouter.put("/:id", updateContact);
>>>>>>> Stashed changes

export default contactsRouter;
