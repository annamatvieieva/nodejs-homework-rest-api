const { Contact } = require("../models/contacts");
const { httpError } = require("../helpers/index");
const {idContactsValidation} = require('../middlewares/index');

async function getContacts (req, res) {
  const contacts = await Contact.find();
  return res.json(contacts);
};

async  function getContactByID(req, res) {
  const { contactId } = req.params;

  idContactsValidation(contactId);

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new httpError (404, "Not found");
  }

  res.json(contact);
};

async  function createContact (req, res) {
  const { name, email, phone } = req.body;
  const contact = {
    name,
    email,
    phone,
  };
  const newContact = await Contact.create(contact);
  res.status(201).json(newContact);
};

async function deleteContact (req, res) {
  const { contactId } = req.params;

  idContactsValidation(contactId);

  const contact = await Contact.findById(contactId);

  if (!contact) {
    throw new httpError (404, "Not found");
  } 

  await Contact.findByIdAndRemove(contactId);
  res.status(200).json({ message: "Contact deleted" });
};

async function changeContact (req, res, next) {
  const { contactId } = req.params;

  idContactsValidation(contactId)

  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,});

  if (!contact) {
		throw new httpError (404, "Not found");} 

  res.status(200).json(contact);
};

async function changeFavoriteStatus (req, res, next) {
  const { contactId } = req.params;
  idContactsValidation(contactId)
		 
  const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,});

  if (!contact) {
		throw new httpError (404, "Not found");
  } 

  res.status(200).json(contact);     
};

module.exports = {
	getContacts,
	getContactByID,
	createContact,
	deleteContact,
	changeContact,
	changeFavoriteStatus
	};
