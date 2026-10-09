const { HttpError } = require('../utils/httpError');

function errorHandler(err, _req, res, next) {
  if (res.headersSent) {
    next(err);
    return;
  }

  if (err instanceof HttpError) {
    const body = { error: err.message, code: err.code };
    if (err.fields && Object.keys(err.fields).length) body.fields = err.fields;
    res.status(err.status).json(body);
    return;
  }

  if (err.type === 'entity.parse.failed') {
    res.status(400).json({
      error: 'The request body was not valid JSON.',
      code: 'INVALID_INPUT',
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    error: 'Something went wrong on our side. Please try again.',
    code: 'SERVER_ERROR',
  });
}

module.exports = { errorHandler };
