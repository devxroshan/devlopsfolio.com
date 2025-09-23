import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
    username: string,
    name: string,
    email: string,
    password: string,
    is_verified: boolean,
    profile_pic: string,
}

const userSchema:Schema<IUser> = new Schema<IUser>({
    username: {type: String, required: [true, 'Username is required.'], unique: [true, 'Username must be unique.']},
    name: {type: String, required: [true, 'Name is required.']},
    email: {type: String, required: [true, 'Email is required.'], unique: [true, 'Email must be unique.']},
    password: {type: String, required: [true, 'Password is required.']},
    is_verified: {type: Boolean, default: false},
    profile_pic: {type: String, default: ''}
}, {timestamps: true})

export default mongoose.model<IUser>('User', userSchema)