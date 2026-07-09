import Favorite from '../models/favorite.model.js';
import { errorHandler } from '../utils/error.js';

export const addFavorite = async (req, res, next) => {
  try {
    const { listingId } = req.body;
    
    // Check if already favorited
    const existing = await Favorite.findOne({ userRef: req.user.id, listingRef: listingId });
    if (existing) {
      return next(errorHandler(400, 'Listing is already in your favorites!'));
    }

    const newFavorite = new Favorite({
      userRef: req.user.id,
      listingRef: listingId,
    });

    await newFavorite.save();
    res.status(201).json({ success: true, message: 'Added to favorites!', favorite: newFavorite });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const favorite = await Favorite.findById(req.params.id);
    if (!favorite) return next(errorHandler(404, 'Favorite not found!'));
    
    if (req.user.id !== favorite.userRef.toString()) {
      return next(errorHandler(401, 'You can only remove your own favorites!'));
    }

    await Favorite.findByIdAndDelete(req.params.id);
    res.status(200).json('Favorite has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserFavorites = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(401, 'You can only view your own favorites!'));
  }
  try {
    const favorites = await Favorite.find({ userRef: req.params.userId }).populate('listingRef');
    res.status(200).json(favorites);
  } catch (error) {
    next(error);
  }
};
