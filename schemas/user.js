const Joi = require("joi");

const authSchema = Joi.object({
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .min(6)
    .required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
}).messages({
  "any.required": "Missing required name field",
});

const verifySchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required()
    .messages({ message: "Missing required field email" }),
});

module.exports = {
  authSchema,
  verifySchema,
};
