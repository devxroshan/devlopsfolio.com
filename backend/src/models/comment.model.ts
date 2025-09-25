import mongoose from 'mongoose';

export interface IComment extends mongoose.Document {
    project_id: mongoose.Schema.Types.ObjectId;
    comment_by: mongoose.Schema.Types.ObjectId;
    content: string;
}

const commentSchema = new mongoose.Schema<IComment>({
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    comment_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
}, { timestamps: true });

const Comment = mongoose.model<IComment>('Comment', commentSchema);
export default Comment;