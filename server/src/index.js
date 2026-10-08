require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { connectDb } = require('./db');
const routes = require('./routes');
const { errorHandler } = require('./middleware/errorHandler');

const port = Number(process.env.PORT) || 4000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/halcyon';
const clientOrigin = process.env.CLIENT_ORIGIN || 'http://localhost:3000';

const app = express();

app.use(cors({ origin: clientOrigin }));
app.use(express.json({ limit: '20kb' }));

app.get('/', (_req, res) => {
  res.json({ name: 'Halcyon API', health: '/api/health' });
});

app.use('/api', routes);

app.use((_req, res) => {
  res.status(404).json({ error: 'That route does not exist.', code: 'NOT_FOUND' });
});

app.use(errorHandler);

async function main() {
  await connectDb(mongoUri);
  app.listen(port, () => {
    console.log('API on http://localhost:%s', port);
  });
}

main().catch((err) => {
  console.error('The API could not start.', err.message);
  process.exit(1);
});
