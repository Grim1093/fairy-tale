// story/backend/src/app.ts

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import registerRoutes from './routes/register';
import yakoaRoutes from './routes/yakoaRoutes';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API Routes
app.use('/api/register', registerRoutes);
app.use('/api/yakoa', yakoaRoutes);

// Default route (optional)
app.get('/', (_req, res) => {
  res.send('✅ Yakoa + Story backend is running!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running at http://localhost:${PORT}`);
});
