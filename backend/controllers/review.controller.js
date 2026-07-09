import Review from '../models/review.model.js';
import { errorHandler } from '../utils/error.js';

export const createReview = async (req, res, next) => {
  try {
    const { listingId, rating, comment } = req.body;
    
    // Check if user already reviewed
    const existing = await Review.findOne({ userRef: req.user.id, listingRef: listingId });
    if (existing) {
      return next(errorHandler(400, 'You have already reviewed this property!'));
    }

    const newReview = new Review({
      userRef: req.user.id,
      listingRef: listingId,
      rating,
      comment,
    });

    await newReview.save();
    
    // Populate user details before returning
    const populatedReview = await newReview.populate('userRef', 'username avatar');
    
    res.status(201).json(populatedReview);
  } catch (error) {
    next(error);
  }
};

export const getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ listingRef: req.params.listingId })
      .populate('userRef', 'username avatar')
      .sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(errorHandler(404, 'Review not found!'));
    
    if (req.user.id !== review.userRef.toString()) {
      return next(errorHandler(401, 'You can only update your own reviews!'));
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          rating: req.body.rating,
          comment: req.body.comment,
        },
      },
      { new: true }
    ).populate('userRef', 'username avatar');

    res.status(200).json(updatedReview);
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(errorHandler(404, 'Review not found!'));
    
    if (req.user.id !== review.userRef.toString()) {
      return next(errorHandler(401, 'You can only delete your own reviews!'));
    }

    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json('Review has been deleted!');
  } catch (error) {
    next(error);
  }
};
