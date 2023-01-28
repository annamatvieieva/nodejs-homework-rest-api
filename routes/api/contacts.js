const express = require("express");
const { nanoid } = require("nanoid");
const router = express.Router();
const { contactSchema } = require("../../schemas/contacts");
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

router.post("/", validateBody(contactSchema), async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    res.status(400).json({ message: "Missing required name field" });
  } else {
    const contact = {
      id: nanoid(),
      name,
      email,
      phone,
    };
    await addContact(contact);
    res.status(201).json(contact);
  }
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
  validateBody(contactSchema),
  async (req, res, next) => {
    const { contactId } = req.params;
    if (JSON.stringify(req.body) == "{}") {
      res.status(400).json({ message: "Missing fields" });
    } else {
      const contact = await updateContact(contactId, req.body);
      if (!contact) {
        res.status(404).json({ message: "Not found" });
      } else {
        res.status(200).json(contact);
      }
    }
  }
);

module.exports = router;
