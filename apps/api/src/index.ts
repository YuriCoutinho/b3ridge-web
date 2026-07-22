import cors from 'cors';
import express from 'express';

const PORT = Number(process.env.PORT ?? 3333);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/healthcheck', (_req, res) => {
  res.json({ status: 'ok', service: 'api' });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
