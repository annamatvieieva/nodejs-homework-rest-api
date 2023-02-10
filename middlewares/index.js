const {httpError} = require('../helpers/index');

function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const err = new httpError(400, error.message);
      return next(err);
    }
    return next();
  };
}

async function auth (req, res, next) {
next();
}

module.exports = {
  validateBody,
  auth,
};
