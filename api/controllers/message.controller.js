import Message from '../models/message.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';

export const createMessage = async (req, res, next) => {
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
    return res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

export const getUserMessages = async (req, res, next) => {
  try {
    // Get messages where the user is either the sender or receiver
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

export const updateMessageStatus = async (req, res, next) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) {
      return next(errorHandler(404, 'Message not found!'));
    }

    // Only the receiver can update status (e.g., mark READ, ACCEPT offer)
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
