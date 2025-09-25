import mongoose from 'mongoose';

export interface IReplyComment extends mongoose.Document {
    reply_by: mongoose.Schema.Types.ObjectId;
    reply_on: mongoose.Schema.Types.ObjectId;
    content: string;
}

const replyCommentSchema = new mongoose.Schema<IReplyComment>({
    reply_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reply_on: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const ReplyComment = mongoose.model<IReplyComment>('ReplyComment', replyCommentSchema);
export default ReplyComment;