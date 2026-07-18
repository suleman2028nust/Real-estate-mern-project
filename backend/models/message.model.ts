import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage extends Document {
  listingRef: mongoose.Types.ObjectId;
  senderRef: mongoose.Types.ObjectId;
  receiverRef: mongoose.Types.ObjectId;
  type: 'INQUIRY' | 'OFFER' | 'TOUR_REQUEST';
  content: string;
  amount?: number | null;
  date?: Date | null;
  status: 'PENDING' | 'READ' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    listingRef: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    senderRef: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiverRef: {
      type: Schema.Types.ObjectId,
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
      default: null,
    },
    date: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: ['PENDING', 'READ', 'ACCEPTED', 'REJECTED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
);

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;
