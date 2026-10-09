class HttpError extends Error {
  constructor(status, message, code, fields) {
    super(message);
    this.name = 'HttpError';
    this.status = status;
    this.code = code || 'ERROR';
    this.fields = fields;
  }
}

module.exports = { HttpError };
