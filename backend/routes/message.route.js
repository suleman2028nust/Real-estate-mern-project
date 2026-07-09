import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { createMessage, getUserMessages, updateMessageStatus } from '../controllers/message.controller.js';

const router = express.Router();

router.post('/create', verifyToken, createMessage);
router.get('/get', verifyToken, getUserMessages);
router.post('/update/:id', verifyToken, updateMessageStatus);

export default router;
