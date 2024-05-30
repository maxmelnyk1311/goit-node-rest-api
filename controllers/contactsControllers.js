import mongoose from "mongoose";
import { createContactSchema, updateContactSchema, updateFavoriteInContact } from "../schemas/contactsSchemas.js";
import Contact from "../models/contactModel.js";

export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find({ owner: req.user.id });
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
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Contact not found" });
    }
    
    const contact = await Contact.findOne({ _id: id, owner: req.user.id });

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
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const contact = await Contact.findById(id);
    if (contact === null) {
      res.status(404).json({ message: "Contact not found" });
    }

    if (contact.owner.toString() !== req.user.id.toString()) {
      return res.status(403).send({message: "Not authorized to delete this contact"});
    }
    
    await Contact.findByIdAndDelete(id);
    res.status(200).json(contact);
   
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
      favorite: req.body.favorite,
      owner: req.user.id
    };

    const { error } = createContactSchema.validate(contact, {
      convert: false,
    });
    console.log(error);
    if (typeof error !== "undefined") {
      return res.status(400).json({ message: error.message });
    }

    const result = await Contact.create(contact);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const infoToUpdate = req.body;
    if (Object.keys(infoToUpdate).length === 0) {
      return res.status(400).json({ message: "Body must have at least one field" });
    }

    const { error } = updateContactSchema.validate(infoToUpdate, {
      convert: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = await Contact.findById(id);
    if (contact === null) {
      res.status(404).json({ message: "Contact not found" });
    }

    if (contact.owner.toString() !== req.user.id.toString()) {
      return res.status(403).send({message: "Not authorized to update this contact"});
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, infoToUpdate, { new: true })
    res.status(200).json(updatedContact);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateStatusContact = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({ message: "Contact not found" });
    }

    const favorite = req.body;
    const { error } = updateFavoriteInContact.validate(favorite, {
      convert: false,
    });
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const contact = await Contact.findById(id);
    if (contact === null) {
      res.status(404).json({ message: "Contact not found" });
    }
    if (contact.owner.toString() !== req.user.id.toString()) {
      return res.status(403).send({message: "Not authorized to update this contact"});
    }

    const updatedContact = await Contact.findByIdAndUpdate(id, favorite, { new: true });
    res.status(200).json(updatedContact);
  } catch (error) {
    
  }
}
