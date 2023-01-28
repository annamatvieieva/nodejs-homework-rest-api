const fs = require("fs/promises");
const path = require("path");
const contactsPath = path.resolve(__dirname, "contacts.json");

async function readContacts() {
  const contactsRaw = await fs.readFile(contactsPath);
  const contacts = JSON.parse(contactsRaw);
  return contacts;
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 4));
}

const listContacts = async () => {
  const contacts = await readContacts();
  return contacts;
};

const getContactById = async (contactId) => {
  const contacts = await readContacts();
  const contact = contacts.find(({ id }) => id === contactId);
  return contact || null;
};

const removeContact = async (contactId) => {
  const contacts = await readContacts();
  const updateContacts = contacts.filter(({ id }) => id !== contactId);
  await writeContacts(updateContacts);
};

const addContact = async (body) => {
  const contacts = await readContacts();
  contacts.push(body);
  await writeContacts(contacts);
};

const updateContact = async (contactId, body) => {
  const { name, email, phone } = body;
  const contacts = await readContacts();
  const contact = contacts.find(({ id }) => id === contactId);
  if (!contact) {
    return null;
  } else {
    const contactIndex = contacts.findIndex((contact) => {
      return contact.id === contactId;
    });
    contacts[contactIndex].name = name || contacts[contactIndex].name;
    contacts[contactIndex].email = email || contacts[contactIndex].email;
    contacts[contactIndex].phone = phone || contacts[contactIndex].phone;
    await writeContacts(contacts);
    const updContact = await getContactById(contactId);
    return updContact;
  }
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
