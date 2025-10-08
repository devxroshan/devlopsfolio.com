import express from 'express';
import mongoose from 'mongoose';

// Models
import Message, {IMessage} from '../models/message.model';

// Utils
import { AsyncRequestHandler } from '../utils/asyncRequestHandler';
import AppError from '../utils/appError';


const sendMessage = async (req: express.Request, res: express.Response):Promise<void> => {
    const recipientId = req.params.receiver_id;
    const messageContent = req.body.content;

    if (!messageContent || messageContent.trim() === '') 
        throw new AppError('Message content cannot be empty', 400);

    if(!recipientId || recipientId.trim() === '' || !mongoose.Types.ObjectId.isValid(recipientId))
        throw new AppError('Invalid recipient ID', 400);

    if(req.query.message_id && (typeof req.query.message_id !== 'string' || !mongoose.Types.ObjectId.isValid(req.query.message_id)))
        throw new AppError('Invalid replied message ID', 400);

    const newMessage: IMessage = new Message({
        sender: req.signedInUser?._id,
        recipient: recipientId,
        content: messageContent,
        replied_to: req.query.message_id || null
    });

    if(!newMessage)
        throw new AppError('Failed to create message', 500);

    await newMessage.save();

    res.status(201).json({
        ok: true,
        msg: 'Message sent successfully',
        data: newMessage
    });
}

const pinMessage = async (req: express.Request, res: express.Response):Promise<void> => {
    const messageId = req.params.message_id;

    if(!messageId || messageId.trim() === '' || !mongoose.Types.ObjectId.isValid(messageId))
        throw new AppError('Invalid message ID', 400);
    const message = await Message.findById(messageId);
    if(!message)
        throw new AppError('Message not found', 404);

    if(message.sender.toString() !== req.signedInUser?.id.toString() && message.recipient.toString() !== req.signedInUser?.id.toString())
        throw new AppError('You are not authorized to pin this message', 403);

    message.is_pinned = !message.is_pinned;
    await message.save();

    res.status(200).json({
        ok: true,
        msg: message.is_pinned ? 'Message pinned successfully' : 'Message unpinned successfully',
        data: message
    });
}

const deleteMessage = async (req: express.Request, res: express.Response):Promise<void> => {
    const messageId = req.params.message_id;

    if(!messageId || messageId.trim() === '' || !mongoose.Types.ObjectId.isValid(messageId))
        throw new AppError('Invalid message ID', 400);
    const message = await Message.findById(messageId);
    if(!message)
        throw new AppError('Message not found', 404);

    if(message.sender.toString() !== req.signedInUser?.id.toString())
        throw new AppError('You are not authorized to delete this message', 403);
    
    await message.deleteOne();

    res.status(200).json({
        ok: true,
        msg: 'Message deleted successfully'
    });
}

export const SendMessage = AsyncRequestHandler(sendMessage);
export const PinMessage = AsyncRequestHandler(pinMessage);
export const DeleteMessage = AsyncRequestHandler(deleteMessage);