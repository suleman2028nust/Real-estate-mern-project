import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import messageRouter from './routes/message.route.js';
import favoriteRouter from './routes/favorite.route.js';
import reviewRouter from './routes/review.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';
import { AppError } from './utils/error.js';

dotenv.config();

// Force Google DNS so MongoDB Atlas SRV records always resolve
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

mongoose
  .connect(process.env.MONGO as string)
  .then(() => {
    console.log('Connected to MongoDB!');
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();

const app = express();

app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}!`);
});

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);
app.use('/api/message', messageRouter);
app.use('/api/favorite', favoriteRouter);
app.use('/api/review', reviewRouter);

app.use(express.static(path.join(__dirname, '/frontend/dist')));

app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// Global error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
