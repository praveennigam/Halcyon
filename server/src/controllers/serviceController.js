const { listServices } = require('../data/services');

function list(_req, res) {
  res.json({ services: listServices() });
}

module.exports = { list };
