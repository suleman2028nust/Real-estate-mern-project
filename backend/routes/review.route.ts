import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createReview, getListingReviews, updateReview, deleteReview } from '../controllers/review.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createReview);
router.get('/get/:listingId', getListingReviews); // Anyone can read reviews
router.post('/update/:id', verifyToken, updateReview);
router.delete('/delete/:id', verifyToken, deleteReview);

export default router;
