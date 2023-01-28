const Joi = require("joi");

const contactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .pattern(
      /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)+$/,
      "name"
    ),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  phone: Joi.string()
    .min(4)
    .max(12)
    .pattern(/^[0-9]+$/, "numbers"),
});

module.exports = {
  contactSchema,
};
