import { Request, Response } from "express";
import multer from "multer";
import { InputFile } from "node-appwrite/file";
import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// Config
import { storage } from "../config/appwrite.config";

// Middlewares

// Models
import projectModel, { IProject } from "../models/project.model";

// Utils
import { AsyncRequestHandler } from "../utils/asyncRequestHandler";
import AppError from "../utils/appError";
import likeModel from "../models/like.model";

import { multerStorage } from "../app";
import { uploadMulterFiles } from "../utils/multerUpload";

const createProject = async (req: Request, res: Response): Promise<void> => {
  const project_info: Omit<IProject, "userId"> = req.body;

  const newProject = await projectModel.create({
    userId: req.signedInUser?.id,
    ...project_info,
  });

  if (!newProject) {
    throw new AppError("Failed to create project", 500);
  }

  res.status(201).json({
    ok: true,
    msg: "Project created successfully",
    data: newProject,
  });
};

const updateProject = async (req: Request, res: Response): Promise<void> => {
  const projectId: string = req.params.project_id;
  const project_info: Partial<IProject> = req.body;

  if (Object.keys(project_info).length === 0) {
    throw new AppError("No valid fields provided for update", 400);
  }

  for (const key in project_info) {
    if (
      project_info[key as keyof IProject] === undefined ||
      project_info[key as keyof IProject] === null ||
      project_info[key as keyof IProject] === ""
    ) {
      throw new AppError(`Invalid value for field: ${key}`, 400);
    }
  }

  if (
    (project_info.hasOwnProperty("tech_stack") &&
      (!Array.isArray(project_info.tech_stack) ||
        project_info.tech_stack.length === 0)) ||
    (project_info.tech_stack?.length != 0 &&
      project_info.tech_stack?.some(
        (tech) => typeof tech !== "string" || tech.trim() === ""
      ))
  ) {
    throw new AppError(
      "tech_stack must be a string & non-empty array and it should not be a empty string.",
      400
    );
  }

  const updatedProject = await projectModel.findOneAndUpdate(
    { _id: projectId, userId: req.signedInUser?.id },
    project_info,
    { new: true }
  );

  if (!updatedProject) {
    throw new AppError(
      "Project not found or you do not have permission to update it",
      404
    );
  }

  res.status(200).json({
    ok: true,
    msg: "Project updated successfully",
    data: updatedProject,
  });
};

const deleteProject = async (req: Request, res: Response): Promise<void> => {
  const projectId: string = req.params.project_id;

  const deletedProject = await projectModel.findOneAndDelete({
    _id: projectId,
    userId: req.signedInUser?.id,
  });
  if (!deletedProject) {
    throw new AppError(
      "Project not found or you do not have permission to delete it",
      404
    );
  }
  res.status(200).json({
    ok: true,
    msg: "Project deleted successfully",
  });
};

const likeProject = async (req: Request, res: Response): Promise<void> => {
  const projectId: string = req.params.project_id;

  const project = await projectModel.findById(projectId);
  if (!project) {
    throw new AppError("Project not found", 404);
  }

  const existingLike = await likeModel.findOne({
    liked_by: req.signedInUser?.id,
    project_id: projectId,
  });

  if (existingLike) {
    const deletedLike = await likeModel.findByIdAndDelete(existingLike._id);
    if (!deletedLike) {
      throw new AppError("Failed to unlike project", 500);
    }

    res.status(200).json({
      ok: true,
      msg: "Project unliked successfully",
    });
    return;
  }

  const newLike = await likeModel.create({
    liked_by: req.signedInUser?.id,
    project_id: projectId,
  });

  if (!newLike) {
    throw new AppError("Failed to like project", 500);
  }

  res.status(201).json({
    ok: true,
    msg: "Project liked successfully",
    data: newLike,
  });
};

const viewProject = async (req: Request, res: Response): Promise<void> => {
  const projectId: string = req.params.project_id;
  // Functionality to be Implemented.
  res.status(200).json({
    ok: true,
    msg: `View project with ID: ${projectId} - Functionality to be implemented`,
  });
};

const addProjectImg = async (req: Request, res: Response): Promise<void> => {
  const projectId = req.query.project_id;

  let projectImgURL: string[] = [];
  let files: Express.Multer.File[] = [];

  if (
    !projectId ||
    typeof projectId !== "string" ||
    mongoose.Types.ObjectId.isValid(projectId) === false
  )
    throw new AppError("Project ID required.", 400);


    await uploadMulterFiles(req, res)

    files = req.files as Express.Multer.File[]

  const isAllUploaded = await Promise.all(
    files.map(async (file) => {
      const fileId:string = uuidv4()

      const isUploaded = await storage.createFile(
        process.env.STORAGE_BUCKET_ID as string,
        `${fileId}`,
        InputFile.fromBuffer(file.buffer, `${fileId}.jpg`)
      );

      if (!isUploaded)
        return res.status(500).json({
          ok: false,
          msg: "Failed to upload project img.",
        });

      projectImgURL.push(
        `https://fra.cloud.appwrite.io/v1/storage/buckets/${
          process.env.STORAGE_BUCKET_ID as string
        }/files/${fileId}/view?project=${
          process.env.APPWRITE_PROJECT_ID as string
        }&mode=admin?refreshToken=${Date.now()}`
      );
    })
  );

  if (!isAllUploaded)
    res.status(500).json({
      ok: false,
      msg: "Failed to upload project img.",
    });

  const isProjectUpdated = await projectModel.findByIdAndUpdate(projectId, {
    $push: {
      project_img: projectImgURL,
    },
  });

  if (!isProjectUpdated)
    throw new AppError("Failed to update project img.", 500);

  res.status(200).json({
    ok: true,
    msg: "Project img uploaded successfully.",
    data: projectImgURL,
  });
};

export const CreateProject = AsyncRequestHandler(createProject);
export const UpdateProject = AsyncRequestHandler(updateProject);
export const DeleteProject = AsyncRequestHandler(deleteProject);
export const LikeProject = AsyncRequestHandler(likeProject);
export const ViewProject = AsyncRequestHandler(viewProject);
export const AddProjectImg = AsyncRequestHandler(addProjectImg);
