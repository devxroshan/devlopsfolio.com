import mongoose from 'mongoose';

export interface IMessage extends mongoose.Document {
    sender: mongoose.Types.ObjectId;
    recipient: mongoose.Types.ObjectId;
    content: string;
    is_seen: boolean;
    is_delivered: boolean;
}

const messageSchema = new mongoose.Schema<IMessage>({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    is_seen: { type: Boolean, default: false },
    is_delivered: { type: Boolean, default: false },
}, {
    timestamps: true,
})

const Message = mongoose.model<IMessage>('Message', messageSchema);

export default Message;