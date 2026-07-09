import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import userRouter from '../backend/routes/user.route.js';
import authRouter from '../backend/routes/auth.route.js';
import listingRouter from '../backend/routes/listing.route.js';
import messageRouter from '../backend/routes/message.route.js';
import favoriteRouter from '../backend/routes/favorite.route.js';
import reviewRouter from '../backend/routes/review.route.js';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();

// Force Google DNS so MongoDB Atlas SRV records always resolve
// (fixes ECONNREFUSED on restrictive ISPs/routers)
dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);

mongoose
  .connect(process.env.MONGO)
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

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

export default app;
