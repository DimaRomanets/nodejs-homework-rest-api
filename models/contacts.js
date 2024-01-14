// const fs = require("node:fs/promises");
// const path = require("node:path");
// const { nanoid } = require("nanoid");
// const contactsPath = path.join(__dirname, "contacts.json");

// const listContacts = async () => {
//   const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
//   return JSON.parse(data);
// };

// const getContactById = async (id) => {
//   const contacts = await listContacts();
//   return contacts.find((contact) => contact.id === id) || null;
// };

// const removeContact = async (id) => {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((contact) => contact.id === id);

//   if (index === -1) {
//     return null;
//   }
//   const [result] = contacts.splice(index, 1);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return result;
// };

// const addContact = async (data) => {
//   const contacts = await listContacts();
//   const newContact = { id: nanoid(), ...data };
//   contacts.push(newContact);
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
//   return newContact;
// };

// const updateContact = async (id, data) => {
//   const contacts = await listContacts();
//   const index = contacts.findIndex((contact) => contact.id === id);

//   if (index === -1) {
//     return null;
//   }
//   contacts[index] = { ...contacts[index], ...data };
//   await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));

//   return contacts[index];
// };

// module.exports = {
//   listContacts,
//   getContactById,
//   removeContact,
//   addContact,
//   updateContact,
// };

const Joi = require("joi");

const { handleMongooseError } = require("../helpers");

const { Schema, model } = require("mongoose");

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
  },
  { versionKey: false, timestamps: true }
);
contactSchema.post("save", handleMongooseError);

const addSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": `Missing required name field`,
  }),
  email: Joi.string().required().messages({
    "any.required": `Missing required email field`,
  }),
  phone: Joi.string().required().messages({
    "any.required": `Missing required phone field`,
  }),
  favorite: Joi.boolean(),
});
const addSchemaPut = Joi.object({
  name: Joi.string().messages({
    "any.required": `Missing required name field`,
  }),
  email: Joi.string().messages({
    "any.required": `Missing required email field`,
  }),
  phone: Joi.string().messages({
    "any.required": `Missing required phone field`,
  }),
  favorite: Joi.boolean(),
});

const updateFavoriteSchemas = Joi.object({
  favorite: Joi.boolean(),
});

const schemas = { addSchema, addSchemaPut, updateFavoriteSchemas };

const Contact = model("contact", contactSchema);

module.exports = {
  Contact,
  schemas,
};
