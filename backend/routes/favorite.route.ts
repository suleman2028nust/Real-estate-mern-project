import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { addFavorite, removeFavorite, getUserFavorites } from '../controllers/favorite.controller.js';

const router = express.Router();

router.post('/add', verifyToken, addFavorite);
router.delete('/remove/:id', verifyToken, removeFavorite);
router.get('/user/:userId', verifyToken, getUserFavorites);

export default router;
