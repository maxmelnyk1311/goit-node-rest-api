import * as fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const filePath = path.resolve("db", "contacts.json");

function writeContacts(contacts) {
  return fs.writeFile(filePath, JSON.stringify(contacts));
}

async function listContacts() {
  const data = await fs.readFile(filePath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function getContactById(id) {
  const contacts = await listContacts();
  const contactToFind = contacts.find((contact) => contact.id === id);

  if (contactToFind === undefined) {
    return null;
  } else {
    return contactToFind;
  }
}

async function removeContact(contactId) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);

  if (index === -1) {
    return null;
  }

  const removedContact = contacts[index];
  contacts.splice(index, 1);
  await writeContacts(contacts);
  return removedContact;
}

async function addContact(name, email, phone) {
  const contacts = await listContacts();
  const newContact = { name, email, phone, id: crypto.randomUUID() };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
}

async function changeContact(contactId, infoToUpdate) {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  
  if (index === -1) {
    return null;
  }

  const updatedContact = {...contacts[index], ...infoToUpdate};
  contacts[index] = updatedContact;
  await writeContacts(contacts);
  return updatedContact;
};

export default { listContacts, getContactById, removeContact, addContact, changeContact };
