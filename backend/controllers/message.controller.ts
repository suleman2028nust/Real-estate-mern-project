import { Request, Response, NextFunction } from 'express';
import Message from '../models/message.model.js';
import { errorHandler } from '../utils/error.js';

export const createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { listingRef, receiverRef, type, content, amount, date } = req.body;
    const message = await Message.create({
      listingRef,
      senderRef: req.user.id,
      receiverRef,
      type,
      content,
      amount,
      date,
    });
    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getUserMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const messages = await Message.find({
      $or: [{ senderRef: req.user.id }, { receiverRef: req.user.id }],
    })
      .populate('listingRef', 'name imageUrls type')
      .populate('senderRef', 'username avatar email')
      .populate('receiverRef', 'username avatar email')
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    next(error);
  }
};

export const updateMessageStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return next(errorHandler(404, 'Message not found!'));
    }

    if (req.user.id !== message.receiverRef.toString()) {
      return next(errorHandler(401, 'You can only update your own received messages!'));
    }

    const updatedMessage = await Message.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    next(error);
  }
};
