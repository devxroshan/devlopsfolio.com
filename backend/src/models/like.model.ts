import { Schema, model, Document } from 'mongoose';

export interface ILike extends Document {
    liked_by: Schema.Types.ObjectId;
    project_id: Schema.Types.ObjectId;
}

const likeSchema = new Schema<ILike>({
    liked_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    project_id: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
}, { timestamps: true});

export default model<ILike>('Like', likeSchema);