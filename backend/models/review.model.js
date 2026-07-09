import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    userRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only leave one review per listing
reviewSchema.index({ userRef: 1, listingRef: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
