import express from "express";

// Utils
import { AsyncRequestHandler } from "../utils/asyncRequestHandler";
import AppError from "../utils/appError";

// Models
import userModel, { IUser } from "../models/user.model";
import profileModel, { IProfile } from "../models/profile.model";
import mongoose from "mongoose";
import projectModel, { IProject } from "../models/project.model";
import e from "express";

const getUserProfile = async (req: express.Request, res: express.Response) => {
  type TUser = IUser & { profile?: IProfile };

  const username = req.query.username;

  let user: Partial<TUser> | null = null;

  if (!username || typeof username !== "string" || username.trim() === "") {
    if (!req.signedInUser) {
      throw new AppError("User not found", 404);
    }

    user = req.signedInUser;

    const { password, ...userWithoutPassword } = req.signedInUser.toObject();
    user = userWithoutPassword;
  } else {
    user = await userModel
      .findOne({ username: username.trim() })
      .select("-password");

    if (!user) {
      throw new AppError("User not found", 404);
    }
  }

  const profile = await profileModel.findOne({ userId: req.signedInUser._id });

  if (!profile) throw new AppError("Profile not found", 404);

  res.status(200).json({
    ok: true,
    msg: "User profile fetched successfully",
    data: { ...user, ...profile.toObject() },
  });
};

const searchDevelopers = async (
  req: express.Request,
  res: express.Response
) => {
  const skills = req.query.skills;
  if (!skills || typeof skills !== "string" || skills.trim() === "") {
    throw new AppError("Skills query param is required", 400);
  }

  const skillsArray = skills.split(",").map((skill) => skill.trim());

  const profiles = await profileModel.find({
    skills: { $in: skillsArray },
  });

  const users = await userModel
    .find({
      _id: { $in: profiles.map((profile) => profile.userId) },
    })
    .select("-password");

  const results = profiles.map((profile) => {
    const user = users.find(
      (user) => user.id.toString() === profile.userId.toString()
    );
    return {
      ...profile.toObject(),
      ...user?.toObject(),
    };
  });

  res.status(200).json({
    ok: true,
    msg: "Developers fetched successfully",
    data: { ...results, count: results.length },
  });
};

const getAllProjects = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const userId = req.query.user_id;

  let projects: IProject[] = [];

  if (!userId || typeof userId !== "string") {
    projects = await projectModel.find({ userId: req.signedInUser?.id });
  } else {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new AppError("Invalid user id.", 400);

    const isUser = await userModel.findById(userId)
    if(!isUser)
      throw new AppError('User not found.', 404)

    projects = await projectModel.find({ userId });
  }

  if (projects.length <= 0)
    res.status(200).json({
      ok: true,
      msg: "No projects yet.",
    });

  res.status(200).json({
    ok: true,
    msg: "Projects fetched successfully.",
    data: projects,
  });
};

const getProject = async (req: express.Request, res: express.Response): Promise<void> => {
  const projectId = req.params.project_id;

  if(!projectId || typeof projectId !== "string" || !mongoose.Types.ObjectId.isValid(projectId))
    throw new AppError("Project ID required.", 400)

  const project = await projectModel.findById(projectId)
  if(!project)
    throw new AppError('Project not found.', 404)

  res.status(200).json({
    ok: true,
    msg: 'Project fetched successfully.',
    data: project
  })
};

export const GetUserProfile = AsyncRequestHandler(getUserProfile);
export const SearchDevelopers = AsyncRequestHandler(searchDevelopers);
export const GetAllProjects = AsyncRequestHandler(getAllProjects);
export const GetProject = AsyncRequestHandler(getProject);
