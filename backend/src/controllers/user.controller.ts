import express from "express";
import mongoose from "mongoose";

// config
import redisClient from "../config/redis.config";

// Utils
import { AsyncRequestHandler } from "../utils/asyncRequestHandler";
import AppError from "../utils/appError";

// Models
import userModel, { ERole, IUser } from "../models/user.model";
import profileModel, { IProfile } from "../models/profile.model";
import projectModel, { IProject } from "../models/project.model";
import likeModel from "../models/like.model";
import commentModel from "../models/comment.model";
import replyCommentModel from "../models/replied-comment-model";
import contactRequestModel from "../models/contact-request.model";

const getUserProfile = async (req: express.Request, res: express.Response) => {
  type TUser = IUser & { profile?: IProfile };

  const username = req.query.username;

  let user: Partial<TUser> | null = null;

  const cachedProfile = await redisClient.get(
    `profile:${username ? username : req.signedInUser?.username}`
  );

  if (cachedProfile) {
    res.status(200).json({
      ok: true,
      msg: "Fetched user profile successfully.",
      data: JSON.parse(cachedProfile),
    });
    return;
  }

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

  // Caching user profile
  await redisClient.set(
    `profile:${user?.username}`,
    JSON.stringify({ ...user, ...profile.toObject() })
  );
  await redisClient.expire(`profile:${user?.username}`, 60);

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

  const cachedProjects = await redisClient.get(
    `project:${userId ? userId : req.signedInUser?.id}`
  );

  if (cachedProjects) {
    res.status(200).json({
      ok: true,
      msg: "Project fetched successfully.",
      data: JSON.parse(cachedProjects),
    });
    return;
  }

  if (!userId || typeof userId !== "string") {
    projects = await projectModel.find({ userId: req.signedInUser?.id });
  } else {
    if (!mongoose.Types.ObjectId.isValid(userId))
      throw new AppError("Invalid user id.", 400);

    const isUser = await userModel.findById(userId);
    if (!isUser) throw new AppError("User not found.", 404);

    projects = await projectModel.find({ userId });
  }

  if (projects.length <= 0)
    res.status(200).json({
      ok: true,
      msg: "No projects yet.",
    });

  await redisClient.set(
    `project:${userId ? userId : req.signedInUser?.id}`,
    JSON.stringify(projects)
  );
  await redisClient.expire(
    `project:${userId ? userId : req.signedInUser?.id}`,
    60
  );

  res.status(200).json({
    ok: true,
    msg: "Projects fetched successfully.",
    data: projects,
  });
};

const getProject = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const projectId = req.params.project_id;

  if (
    !projectId ||
    typeof projectId !== "string" ||
    !mongoose.Types.ObjectId.isValid(projectId)
  )
    throw new AppError("Project ID required.", 400);

  const project = await projectModel.findById(projectId);
  if (!project) throw new AppError("Project not found.", 404);

  const likes = await likeModel.find({ project_id: project.id });
  const comments = await commentModel.find({ project_id: project.id });

  const modifiedProject = {
    ...project.toObject(),
    likes_count: likes.length,
    comment_counts: comments.length,
  };

  res.status(200).json({
    ok: true,
    msg: "Project fetched successfully.",
    data: modifiedProject,
  });
};

const getLikes = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const projectId = req.params.project_id;

  if (
    !projectId ||
    typeof projectId !== "string" ||
    !mongoose.Types.ObjectId.isValid(projectId)
  )
    throw new AppError("Invalid Project ID.", 400);

  const likes = await likeModel.find({ project_id: projectId });

  if (likes.length == 0) {
    res.status(200).json({
      ok: true,
      msg: "No Likes",
    });
    return;
  }

  const usersWhoLiked = await Promise.all(
    likes.map(async (like) => {
      return await userModel
        .findById(like.liked_by)
        .select("_id username name profile");
    })
  );

  res.status(200).json({
    ok: true,
    msg: "Liked data fetched successfully.",
    data: usersWhoLiked,
  });
};

const getComments = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const projectId = req.params.project_id;

  if (
    !projectId ||
    typeof projectId !== "string" ||
    !mongoose.Types.ObjectId.isValid(projectId)
  )
    throw new AppError("Invalid Project ID", 400);

  const comments = await commentModel.find({ project_id: projectId });

  const commentsWithReplies = await Promise.all(
    comments.map(async (comment) => {
      const replies = await replyCommentModel.find({ reply_on: comment.id });
      return {
        ...comment,
        replies,
      };
    })
  );

  res.status(200).json({
    ok: true,
    msg: "Comment fetched successfully.",
    data: commentsWithReplies,
  });
};

const getContactRequest = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const contactRequest = await contactRequestModel.find({
    developer_id: req.signedInUser?.id,
    is_accepted: false,
  });

  res.status(200).json({
    ok: true,
    msg:
      contactRequest.length != 0
        ? "Contact Request fetched successfully."
        : "No Requests.",
    data: contactRequest,
  });
};

const getContact = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  let contacts:(IProfile | null)[] = [];

  if (req.signedInUser?.role === ERole.RECRUITER) {
    const contactRequests = await contactRequestModel.find({
      recruiter_id: req.signedInUser?.id,
    });

    contacts = await Promise.all(
      contactRequests.map(async (contactRequest) => {
        return await profileModel.findOne({
          userId: contactRequest.developer_id,
        });
      })
    );
  } else {
    const contactRequests = await contactRequestModel.find({
      developer_id: req.signedInUser?.id,
    });

    contacts = await Promise.all(
      contactRequests.map(async (contactRequest) => {
        return await profileModel.findOne({
          userId: contactRequest.recruiter_id,
        });
      })
    );
  }

  res.status(200).json({
    ok: true,
    msg: "Contact fetched successfully.",
    data: contacts
  })
};

export const GetUserProfile = AsyncRequestHandler(getUserProfile);
export const SearchDevelopers = AsyncRequestHandler(searchDevelopers);
export const GetAllProjects = AsyncRequestHandler(getAllProjects);
export const GetProject = AsyncRequestHandler(getProject);
export const GetLikes = AsyncRequestHandler(getLikes);
export const GetComments = AsyncRequestHandler(getComments);
export const GetContactRequest = AsyncRequestHandler(getContactRequest);
export const GetContact = AsyncRequestHandler(getContact);
