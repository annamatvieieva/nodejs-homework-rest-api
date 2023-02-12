Jimp = require("jimp");

function tryCatchWrapper(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
};

module.exports = {
  tryCatchWrapper,
};
