// import contactsService from "../services/contactsServices.js";
import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import Contact from "../models/contactModel.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find();
    console.log(contacts);
    res.status(200).json(contacts);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getOneContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.length !== 24) {
      return res.status(404).json({ message: "Contact not found" });
    }
    
    const contact = await Contact.findById(id);

    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.length !== 24) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const contact = await Contact.findByIdAndDelete(id);
    
    if (contact) {
      res.status(200).json(contact);
    } else {
      res.status(404).json({ message: "Contact not found" });
    }
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createContact = async (req, res) => {
  try {
    const contact = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
    };

    const { error } = createContactSchema.validate(contact, {
      convert: false,
    });
    if (typeof error !== "undefined") {
      return res.status(400).json({ message: error.message });
    }

    const result = await Contact.create(contact);
    console.log(result);
    // const newContact = await contactsService.addContact(name, email, phone);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.length !== 24) {
      return res.status(404).json({ message: "Contact not found" });
    }
    const infoToUpdate = req.body;

    const { error } = updateContactSchema.validate(infoToUpdate, {
      convert: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, infoToUpdate, { new: true })
    console.log(updatedContact);
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateStatusContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (id.length !== 24) {
      return res.status(404).json({ message: "Contact not found" });
    }
    const favorite = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(id, favorite, { new: true });
    if (!updatedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.status(200).json(updatedContact);
  } catch (error) {
    
  }
}
