import { Request, Response } from "express";

// Config

// Middlewares

// Models
import profileModel, {
  EAvailability,
  EField,
  IProfile,
} from "../models/profile.model";

// Utils
import { AsyncRequestHandler } from "../utils/asyncRequestHandler";
import AppError from "../utils/appError";
import userModel, { ERole } from "../models/user.model";

const createProfile = async (req: Request, res: Response): Promise<void> => {
  const profile_info: Omit<IProfile, "userId"> = req.body;


  const isProfileExists = await profileModel.exists({
    userId: req.signedInUser?.id,
  });

  if (
    isProfileExists && req.query.createAnyWay != "true" &&
    !req.query.createAnyWay
  )
    throw new AppError("Profile already exists.", 400);

  if (isProfileExists && req.query.createAnyWay == "true") {
    await profileModel.deleteOne({ userId: req.signedInUser?.id });
  }

  const newProfile = await profileModel.create({
    userId: req.signedInUser?.id,
    ...profile_info,
  });

  res.status(200).json({
    ok: true,
    msg: "Profile created successfully.",
    data: newProfile,
  });
};

const updateProfile = async (req: Request, res: Response): Promise<void> => {
  const { field, fieldValue } = req.query;

  const isInField: boolean = [
    EField.AVAILABILITY,
    EField.BIO,
    EField.EXPERIENCE_IN_YEAR,
    EField.LOCATION,
    EField.SOCIAL_MEDIA_LINKS,
    EField.WEBSITE,
    EField.WORKED_AT,
    EField.SKILLS,
  ].includes(field as EField);

  if (!fieldValue || !field || !isInField)
    throw new AppError("Invalid field or Field value not given.", 400);

  const profile = await profileModel.findOne({ userId: req.signedInUser?.id });

  if (!profile) throw new AppError("Profile not found.", 404);

  if (field === EField.BIO) {
    profile.bio = fieldValue as string;
  } else if (field === EField.AVAILABILITY) {
    profile.availability = fieldValue as EAvailability;
  } else if (field === EField.EXPERIENCE_IN_YEAR) {
    profile.experience_in_year = Number(fieldValue as string);
  } else if (field === EField.LOCATION) {
    profile.location = fieldValue as string;
  } else if (field === EField.SOCIAL_MEDIA_LINKS) {
    profile.social_media_links.push(fieldValue as string);
  } else if (field === EField.WEBSITE) {
    profile.website = fieldValue as string;
  } else if (field === EField.WORKED_AT) {
    profile.worked_at = fieldValue as string;
  } else if (field === EField.SKILLS) {
    if(req.signedInUser?.role === ERole.RECRUITER)
      throw new AppError("Recruiters cannot add skills.", 403)

    if(typeof fieldValue !== 'string' || fieldValue.trim() === '')
      throw new AppError("Invalid skills.", 400)

    const skills = fieldValue.split(',').map(skill => skill.trim());
    for(const skill of skills) {
      if(!profile.skills.includes(skill))
        profile.skills.push(skill);
    }
  }

  await profile.save();
  res.status(200).json({
    ok: true,
    msg: `${field} changed successfully.`,
  });
};

const changeProfilePic = async (
  req: Request,
  res: Response
): Promise<void> => {};

const removeProfilePic = async (
  req: Request,
  res: Response
): Promise<void> => {};

const removeSocialMediaLink = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { linkIndex } = req.query;

  if (!linkIndex || Number.isNaN(linkIndex)) throw new AppError("Link index required.", 400);

  const profile = await profileModel.findOne({
    userId: req.signedInUser?.id,
  });

  if(!profile)
    throw new AppError('Profile not found.', 404)

  if(Number(linkIndex) > profile.social_media_links.length || Number(linkIndex) < 0)
    throw new AppError('Link index is out of range.', 400)

  profile.social_media_links.splice(Number(linkIndex) - 1, 1);
  await profile.save();

  res.status(200).json({
    ok: true,
    msg: 'Link removed successfully.'
  })
};

const deleteProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
    const isDeleted = await profileModel.deleteOne({userId: req.signedInUser?.id})

    if(!isDeleted)
      throw new AppError("Unable to delete profile.", 500)

    res.status(200).json({
      ok: false,
      msg: 'Profile deleted successfully.'
    })
};


export const CreateProfile = AsyncRequestHandler(createProfile);
export const UpdateProfile = AsyncRequestHandler(updateProfile);
export const ChangeProfilePic = AsyncRequestHandler(changeProfilePic);
export const RemoveProfilePic = AsyncRequestHandler(removeProfilePic);
export const RemoveSocialMediaLink = AsyncRequestHandler(removeSocialMediaLink);
export const DeleteProfile = AsyncRequestHandler(deleteProfile);
