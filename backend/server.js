import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load routers
import { initDatabase } from './database/dbInit.js';
import authRouter from './routes/auth.js';
import roomsRouter from './routes/rooms.js';
import bookingsRouter from './routes/bookings.js';
import guestsRouter from './routes/guests.js';
import pricingRouter from './routes/pricing.js';
import usersRouter from './routes/users.js';
import expensesRouter from './routes/expenses.js';
import calendarRouter from './routes/calendar.js';
import queueRouter from './routes/queue.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import './backupService.js'; // Initialize automated backups

// High Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(cors());
app.use(express.json());

// Global Rate Limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again later.' }
});
app.use('/api', globalLimiter);

import notificationsRouter from './routes/notifications.js';

app.use('/api/auth', authRouter);
app.use('/api/rooms', roomsRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/api/guests', guestsRouter);
app.use('/api/pricing', pricingRouter);
app.use('/api/users', usersRouter);
app.use('/api/expenses', expensesRouter);
app.use('/api/calendar', calendarRouter);
app.use('/api/queue', queueRouter);
app.use('/api/notifications', notificationsRouter);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Root endpoint for browser visits
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Bethel Meadows API</title>
        <style>
          body { font-family: system-ui, sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #0f172a; color: white; }
          h1 { color: #facc15; }
          p { color: #94a3b8; }
        </style>
      </head>
      <body>
        <h1>🏨 Bethel Meadows API Server</h1>
        <p>The backend server is running successfully!</p>
        <p>Base API endpoint: <code>/api</code></p>
      </body>
    </html>
  `);
});
// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server!' });
});

initDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Bethel Meadows API Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error("Failed to initialize database on startup:", err);
  process.exit(1);
});
