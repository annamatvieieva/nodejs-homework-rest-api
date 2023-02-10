const mongoose = require("mongoose");

const schema = mongoose.Schema(
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
  { versionKey: false,
    owner: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'user',
    } }
);

const Contact = mongoose.model("contact", schema);

module.exports = {
  Contact,
};
