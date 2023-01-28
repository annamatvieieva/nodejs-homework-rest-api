function validateBody(schema) {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const err = new Error(error.message);
      return next(err);
    }
    return next();
  };
}

module.exports = {
  validateBody,
};
