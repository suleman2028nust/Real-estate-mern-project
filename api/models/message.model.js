import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    listingRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    senderRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['INQUIRY', 'OFFER', 'TOUR_REQUEST'],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: null, // Used for offers
    },
    date: {
      type: Date,
      default: null, // Used for tour requests
    },
    status: {
      type: String,
      enum: ['PENDING', 'READ', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

const Message = mongoose.model('Message', messageSchema);

export default Message;
