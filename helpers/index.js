function tryCatchWrapper(fn) {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (err) {
      return next(err);
    }
  };
}

function httpError(status, mess) {
  const err = new Error(mess);
  err.status = status;
  return err;
}

module.exports = {
  tryCatchWrapper,
  httpError,
};
