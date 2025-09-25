import { Request, Response } from "express";
import mongoose from "mongoose";

// Models
import commentModel from "../models/comment.model";
import projectModel, { IProject } from "../models/project.model";
import replyCommentModel from "../models/replied-comment-model"

// Utils
import { AsyncRequestHandler } from "../utils/asyncRequestHandler";
import AppError from "../utils/appError";


const commentOnProject = async (req: Request, res: Response): Promise<void> => {
  const projectId: string = req.params.project_id;
  const { comment } = req.query;

  if (!comment || typeof comment !== "string" || comment.trim() === "") {
    throw new AppError("Comment query must be a non-empty string", 400);
  }

  if(!projectId || typeof projectId !== "string" || mongoose.Types.ObjectId.isValid(projectId) === false) {
    throw new AppError("Project ID is required", 400);
  }

  const project = await projectModel.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const newComment = await commentModel.create({
    comment_by: req.signedInUser?.id,
    project_id: projectId,
    content: comment.trim(),
  })

  if (!newComment) {
    throw new AppError("Failed to add comment", 500);
  }

  res.status(201).json({
    ok: true,
    msg: "Comment added successfully",
    data: newComment,
  });
};


const replyOnComment = async (req: Request, res: Response): Promise<void> => {
  const commentId: string = req.params.comment_id;
  const { reply } = req.query;

  if (!reply || typeof reply !== "string" || reply.trim() === "") {
    throw new AppError("Reply must be a non-empty string", 400);
  }

  if(!commentId || typeof commentId !== "string" || mongoose.Types.ObjectId.isValid(commentId) === false) {
    throw new AppError("Comment ID is required", 400);
  }

  const replyComment = await replyCommentModel.create({
    reply_by: req.signedInUser?.id,
    reply_on: commentId,
    content: reply.trim(),
  });

  if (!replyComment) {
    throw new AppError("Failed to add reply", 500);
  }

  res.status(201).json({
    ok: true,
    msg: "Reply added successfully",
    data: replyComment,
  });
};


const deleteReplyComment = async (req: Request, res: Response): Promise<void> => {
  const replyCommentId: string = req.params.reply_comment_id;

  if (!replyCommentId || typeof replyCommentId !== "string" || mongoose.Types.ObjectId.isValid(replyCommentId) === false) {
    throw new AppError("Reply comment ID is required", 400);
  }

  const deletedReply = await replyCommentModel.findByIdAndDelete(replyCommentId);
  if (!deletedReply) {
    throw new AppError("Reply comment not found or already deleted", 404);
  }

  res.status(200).json({
    ok: true,
    msg: "Reply comment deleted successfully",

  });
};

const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const commentId: string = req.params.comment_id;

  if (!commentId || typeof commentId !== "string" || mongoose.Types.ObjectId.isValid(commentId) === false) {
    throw new AppError("Comment ID is required", 400);
  }

  const deletedComment = await commentModel.findByIdAndDelete(commentId);
  if (!deletedComment) {
    throw new AppError("Comment not found or already deleted", 404);
  }

  const deletedReplies = await replyCommentModel.deleteMany({ reply_on: commentId });

  if (!deletedReplies) {
    throw new AppError("Failed to delete associated replies", 500);
  }

  res.status(200).json({
    ok: true,
    msg: "Comment and its replies deleted successfully",
  });
};


export const CommentOnProject = AsyncRequestHandler(commentOnProject);
export const ReplyOnComment = AsyncRequestHandler(replyOnComment);
export const DeleteReplyComment = AsyncRequestHandler(deleteReplyComment);
export const DeleteComment = AsyncRequestHandler(deleteComment);