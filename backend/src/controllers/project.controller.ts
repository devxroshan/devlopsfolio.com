import { Request, Response } from "express";

// Config

// Middlewares


// Models
import projectModel, { IProject } from "../models/project.model";

// Utils
import { AsyncRequestHandler } from "../utils/asyncRequestHandler";
import AppError from "../utils/appError";


const createProject  = async (req: Request, res: Response): Promise<void> => {
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
      msg: 'Project created successfully',
      data: newProject,
    });
}

const updateProject  = async (req: Request, res: Response): Promise<void> => {
    const projectId: string = req.params.id;
    const project_info: Partial<IProject> = req.body;
    
    if(Object.keys(project_info).length === 0) {
        throw new AppError("No valid fields provided for update", 400);
    }

    for (const key in project_info) {
        if (project_info[key as keyof IProject] === undefined || project_info[key as keyof IProject] === null || project_info[key as keyof IProject] === '') {
            throw new AppError(`Invalid value for field: ${key}`, 400);
        }
    }

    if(project_info.hasOwnProperty('tech_stack') && (!Array.isArray(project_info.tech_stack) || project_info.tech_stack.length === 0) || (project_info.tech_stack?.length != 0 && project_info.tech_stack?.some(tech => typeof tech !== 'string' || tech.trim() === ''))) {
        throw new AppError("tech_stack must be a string & non-empty array and it should not be a empty string.", 400);
    }

    const updatedProject = await projectModel.findOneAndUpdate(
      { _id: projectId, userId: req.signedInUser?.id },
      project_info,
      { new: true }
    );

    if (!updatedProject) {
      throw new AppError("Project not found or you do not have permission to update it", 404);
    }

    res.status(200).json({
      ok: true,
      msg: 'Project updated successfully',
      data: updatedProject,
    });
}

const deleteProject  = async (req: Request, res: Response): Promise<void> => {
    const projectId: string = req.params.id;

    const deletedProject = await projectModel.findOneAndDelete(
      { _id: projectId, userId: req.signedInUser?.id }
    );
    if (!deletedProject) {
      throw new AppError("Project not found or you do not have permission to delete it", 404);
    }
    res.status(200).json({
      ok: true,
      msg: 'Project deleted successfully',
    });
}



export const CreateProject = AsyncRequestHandler(createProject);
export const UpdateProject = AsyncRequestHandler(updateProject);
export const DeleteProject = AsyncRequestHandler(deleteProject);