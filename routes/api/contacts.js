const express = require("express");
const { validateBody } = require("../../middlewares");
const { tryCatchWrapper } = require("../../helpers/index");
const {getContacts,
	getContactByID,
	createContact,
	deleteContact,
	changeContact,
	changeFavoriteStatus} = require("../../controllers/contacts.controller");
const {addContactSchema, putContactSchema, patchContactSchema} = require ('../../schemas/contacts.js');

const router = express.Router();

router.get("/", tryCatchWrapper(getContacts));
router.get("/:contactId", tryCatchWrapper(getContactByID));
router.post("/", validateBody(addContactSchema), tryCatchWrapper(createContact));
router.delete("/:contactId", tryCatchWrapper(deleteContact));
router.put("/:contactId", validateBody(putContactSchema), tryCatchWrapper(changeContact));
router.patch( "/:contactId/favorite", validateBody(patchContactSchema), tryCatchWrapper(changeFavoriteStatus));

module.exports = router;
