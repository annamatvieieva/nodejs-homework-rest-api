const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const {
  addContactSchema,
  putContactSchema,
  patchContactSchema,
} = require("../../schemas/contacts");
const { validateBody } = require("../../middlewares");
const { Contact } = require("../../models/contacts");

router.get("/", async (req, res) => {
  const contacts = await Contact.find();
  res.json(contacts);
});

router.get("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: "Id is not valid" });
  } else {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
    } else {
      res.json(contact);
    }
  }
});

router.post("/", validateBody(addContactSchema), async (req, res) => {
  const { name, email, phone } = req.body;
  const contact = {
    name,
    email,
    phone,
  };
  newContact = await Contact.create(contact);
  res.status(201).json(newContact);
});

router.delete("/:contactId", async (req, res) => {
  const { contactId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(contactId)) {
    return res.status(400).json({ message: "Id is not valid" });
  } else {
    const contact = await Contact.findById(contactId);
    if (!contact) {
      res.status(404).json({ message: "Not found" });
    } else {
      await Contact.findByIdAndRemove(contactId);
      res.status(200).json({ message: "Contact deleted" });
    }
  }
});

router.put(
  "/:contactId",
  validateBody(putContactSchema),
  async (req, res, next) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: "Id is not valid" });
    } else {
      const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
      });
      if (!contact) {
        res.status(404).json({ message: "Not found" });
      } else {
        res.status(200).json(contact);
      }
    }
  }
);

router.patch(
  "/:contactId/favorite",
  validateBody(patchContactSchema),
  async (req, res, next) => {
    const { contactId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(contactId)) {
      return res.status(400).json({ message: "Id is not valid" });
    } else {
      const contact = await Contact.findByIdAndUpdate(contactId, req.body, {
        new: true,
      });
      if (!contact) {
        res.status(404).json({ message: "Not found" });
      } else {
        res.status(200).json(contact);
      }
    }
  }
);

module.exports = router;
