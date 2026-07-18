import mongoose, { Document, Schema } from 'mongoose';

export interface IFavorite extends Document {
  userRef: mongoose.Types.ObjectId;
  listingRef: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const favoriteSchema = new Schema<IFavorite>(
  {
    userRef: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listingRef: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure a user can only favorite a specific listing once
favoriteSchema.index({ userRef: 1, listingRef: 1 }, { unique: true });

const Favorite = mongoose.model<IFavorite>('Favorite', favoriteSchema);

export default Favorite;
