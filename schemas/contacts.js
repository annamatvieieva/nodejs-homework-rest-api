const Joi = require("joi");

const addContactSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(20)
    .pattern(
      /^[a-zA-Zа-яА-Я]+(([' -][a-zA-Zа-яА-Я ])?[a-zA-Zа-яА-Я]*)+$/,
      "name"
    )
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  phone: Joi.string()
    .min(4)
    .max(12)
    .pattern(/^[0-9]+$/, "numbers")
    .required(),
}).messages({
  "any.required": "Missing required name field",
});

const putContactSchema = Joi.object({
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
})
  .min(1)
  .message("Missing fields");

const patchContactSchema = Joi.object({
  favorite: Joi.boolean()
    .required()
    .messages({ message: "Missing field favorite" }),
});

module.exports = {
  addContactSchema,
  putContactSchema,
  patchContactSchema,
};
