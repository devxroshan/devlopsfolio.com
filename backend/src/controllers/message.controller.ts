import express from "express";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Config
import redisClient from "../config/redis.config";

// Models
import messageModel, { IMessage } from "../models/message.model";

// Utils
import { AsyncRequestHandler } from "../utils/asyncRequestHandler";
import AppError from "../utils/appError";

const sendMessage = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const recipientId = req.params.receiver_id;
  const messageContent = req.body.content;

  if (!messageContent || messageContent.trim() === "")
    throw new AppError("Message content cannot be empty", 400);

  if (
    !recipientId ||
    recipientId.trim() === "" ||
    !mongoose.Types.ObjectId.isValid(recipientId)
  )
    throw new AppError("Invalid recipient ID", 400);

  if (recipientId === req.signedInUser?.id)
    throw new AppError("You can't send message to yourself.", 400);

  if (
    req.query.message_id &&
    (typeof req.query.message_id !== "string" ||
      !mongoose.Types.ObjectId.isValid(req.query.message_id))
  )
    throw new AppError("Invalid replied message ID", 400);

  const msgIdForRedis = uuidv4();

  const currentDate = new Date(Date.now())

  const messageObj = {
    id: msgIdForRedis,
      sender: req.signedInUser?.id,
      recipient: recipientId,
      content: messageContent,
      is_seen: false,
      is_pinned: false,
      replied_to: req.query.message_id ? req.query.message_id : null,
      createdAt: currentDate.toISOString()
  }

  // Saving to Redis
  await redisClient.rpush(
    `messages`,
    JSON.stringify(messageObj)
  );

  await redisClient.set(
    `msg:${msgIdForRedis}`,
    JSON.stringify(messageObj)
  );

  res.status(201).json({
    ok: true,
    msg: "Message sent successfully",
    data: messageObj
  });
};

const pinMessage = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const messageId = req.params.message_id;
  let updatedMsg: Partial<IMessage> | null = null;

  if (!messageId || messageId.trim() === "")
    throw new AppError("Invalid message ID", 400);

  const messageFromRedis: string | null = await redisClient.get(
    `msg:${messageId}`
  );

  if (messageFromRedis) {
    const parsedMsg: Partial<IMessage> = JSON.parse(messageFromRedis);
    if (
      parsedMsg?.sender?.toString() !== req.signedInUser?.id.toString() &&
      parsedMsg?.recipient?.toString() !== req.signedInUser?.id.toString()
    )
      throw new AppError("You are not authorized to pin this message", 403);

    if (parsedMsg.is_pinned) parsedMsg.is_pinned = false;
    else parsedMsg.is_pinned = true;

    updatedMsg = parsedMsg;

    await redisClient.set(`msg:${messageId}`, JSON.stringify(updatedMsg))
  } else {
    if (!mongoose.Types.ObjectId.isValid(messageId))
      throw new AppError("Invalid message ID.", 400);

    const message = await messageModel.findById(messageId);
    if (!message) throw new AppError("Message not found", 404);

    if (
      message.sender.toString() !== req.signedInUser?.id.toString() &&
      message.recipient.toString() !== req.signedInUser?.id.toString()
    )
      throw new AppError("You are not authorized to pin this message", 403);

    message.is_pinned = !message.is_pinned;
    updatedMsg = await message.save();
  }

  res.status(200).json({
    ok: true,
    msg: updatedMsg?.is_pinned
      ? "Message pinned successfully"
      : "Message unpinned successfully",
    data: updatedMsg,
  });
};

const deleteMessage = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const messageId = req.params.message_id;

  if (!messageId || messageId.trim() === "")
    throw new AppError("Invalid message ID", 400);

  const msgFromRedis: string | null = await redisClient.get(`msg:${messageId}`);

  if (msgFromRedis) {
    await redisClient.del(`msg:${messageId}`);
  } else {
    if (!mongoose.Types.ObjectId.isValid(messageId))
      throw new AppError("Invalid message ID.", 400);

    const message = await messageModel.findById(messageId);
    if (!message) throw new AppError("Message not found", 404);

    if (message.sender.toString() !== req.signedInUser?.id.toString())
      throw new AppError("You are not authorized to delete this message", 403);

    await message.deleteOne();
  }

  res.status(200).json({
    ok: true,
    msg: "Message deleted successfully",
  });
};

const setMessageSeen = async (req: express.Request, res: express.Response):Promise<void> => {
  const {messageId} = req.params

  let updatedMsg:Partial<IMessage>

  if(!messageId || typeof messageId !== 'string' || messageId.trim() === '')
    throw new AppError('Message ID required.', 400)

  const msgFromRedis = await redisClient.get(`msg:${messageId}`)
  if(msgFromRedis){
    const parsedMsg = JSON.parse(msgFromRedis)
    
    updatedMsg = {
      ...parsedMsg,
      is_seen: true
    }

    await redisClient.set(`msg:${messageId}`, JSON.stringify(updatedMsg))
  }else {
    if(!mongoose.Types.ObjectId.isValid(messageId))
      throw new AppError("Invalid Message ID.", 400)

    const message = await messageModel.findById(messageId)
    if(!message)
      throw new AppError('Message not found.', 404)

    message.is_seen = true
    updatedMsg = await message.save()
  }

  res.status(200).json({
    ok: true,
    msg: 'Message seen successfully.',
    data: updatedMsg
  })
}



export const SendMessage = AsyncRequestHandler(sendMessage);
export const PinMessage = AsyncRequestHandler(pinMessage);
export const DeleteMessage = AsyncRequestHandler(deleteMessage);
export const SetMessageSeen = AsyncRequestHandler(setMessageSeen);
