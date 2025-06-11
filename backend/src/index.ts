import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import registerRoute from './routes/register';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/register', registerRoute);

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running at http://localhost:${PORT}`);
});
