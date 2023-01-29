const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();
const {
  addContactSchema,
  putContactSchema,
} = require("../../schemas/contacts");
const {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
} = require("../../models/contacts");
const { validateBody } = require("../../middlewares");

router.get("/", async (req, res) => {
  const contacts = await listContacts();
  res.json(contacts);
});

router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    res.status(404).json({ message: "Not found" });
  } else {
    res.json(contact);
  }
});

router.post("/", validateBody(addContactSchema), async (req, res) => {
  const { name, email, phone } = req.body;
  const contact = {
    id: nanoid(),
    name,
    email,
    phone,
  };
  await addContact(contact);
  res.status(201).json(contact);
});

router.delete("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    res.status(404).json({ message: "Not found" });
  } else {
    await removeContact(contactId);
    res.status(200).json({ message: "Contact deleted" });
  }
});

router.put(
  "/:contactId",
  validateBody(putContactSchema),
  async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await updateContact(contactId, req.body);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.status(200).json(contact);
    }
  }
);

module.exports = router;
