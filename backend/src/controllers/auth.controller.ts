import express from "express";
import bcryptjs from "bcryptjs";

// Config
import { emailVerification, welcomeEmail } from "../config/email-templates";

// Models
import userModel from "../models/user.model";

// Utils
import AppError from "../utils/appError";
import { SendMail } from "../utils/sendMail";
import { generateJWTToken, JWTExpiresIn } from "../utils/generateJWTToken";
import { AsyncRequestHandler } from "../utils/asyncRequestHandler";
import { verifyJWTToken } from "../utils/verifyJWTToken";

// Middlewares

const signUp = async (req: express.Request, res: express.Response) => {
  const { authParty } = req.query;

  const isEmailExists = await userModel.exists({ email: req.body.email });
  const isUsernameExists = await userModel.exists({
    username: req.body.username,
  });

  if (isEmailExists) throw new AppError("Email alreay exits.", 400);

  if (isUsernameExists) throw new AppError("Username already exists.", 400);

  const hashSalt = await bcryptjs.genSalt(
    parseInt(process.env.SALT_ROUNDS as string)
  );
  const hashedPassword = await bcryptjs.hash(req.body.password, hashSalt);

  const newUser = await userModel.create({
    username: req.body.username,
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  if (!newUser) throw new AppError("Internal Server Error.", 500);

  if (authParty == "google") {
    const verificationToken = generateJWTToken(newUser.id, "5m");

    const isSent = await SendMail({
      to: newUser.email,
      subject: "Email Verification",
      html: emailVerification(
        newUser.name,
        `${process.env.SERVER}/api/auth/verify-email?token=${verificationToken}`,
        new Date().getFullYear.toString()
      ),
    });

    if (!isSent)
      throw new AppError(
        "User created but failed to send verification email.",
        400
      );

    res.status(200).json({
      ok: true,
      msg: "User registered successfully. Please check your email inbox for verification.",
    });
    return;
  }

  const accessToken = generateJWTToken(newUser.id, process.env.ACCESS_TOKEN_EXPIRY as JWTExpiresIn)
  
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  }).json({
    ok: true,
    msg: "Logged in successfully."
  })
};

const verifyEmail = async (req: express.Request, res: express.Response) => {
  const { token } = req.query;

  if (!token || typeof token !== "string") {
    throw new AppError("Invalid token.", 400);
  }

  const verifiedToken = verifyJWTToken(token);

  if (!verifiedToken || !verifiedToken.userId)
    throw new AppError("Invalid or expired token.", 400);

  const user = await userModel.findByIdAndUpdate(verifiedToken.userId, {
    $set: {
      is_verified: true,
    },
  });

  if (!user) throw new AppError("Unable to verify user.", 400);

  await SendMail({
    to: user.email,
    subject: "Welcome to devlopsfolio.com",
    html: welcomeEmail(user.name, new Date().getFullYear().toString()),
  });

  res.status(200).json({
    ok: true,
    msg: "User verified successfully.",
  });
};

const login = async (req: express.Request, res: express.Response) => {
  if (
    !req.query.email_or_username ||
    typeof req.query.email_or_username !== "string" ||
    !req.query.password ||
    typeof req.query.password !== "string"
  )
    throw new AppError("Email or Username and Password required.", 400);

  const doesUserExists = await userModel.findOne({
    $or: [
      { email: req.query.email_or_username },
      { username: req.query.email_or_username },
    ],
  });

  if (!doesUserExists) throw new AppError("User not found.", 404);

  const isPassword = await bcryptjs.compare(
    req.query.password,
    doesUserExists.password
  );

  if (!isPassword) throw new AppError("Incorrect Password.", 400);

  const accessToken = generateJWTToken(doesUserExists.id, "30d");

  const { password, ...userWithOutPass } = doesUserExists.toObject();

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    })
    .json({
      ok: true,
      accessToken: process.env.NODE_ENV === "development" ? accessToken : "",
      msg: "Login successful.",
      data: userWithOutPass,
    });
};

const googleAuth = async (
  req: express.Request,
  res: express.Response
): Promise<void> => {
  const { name, profile_pic, email } = req.user as {
    name: string;
    profile_pic: string;
    email: string;
  };

  const doesUserExists = await userModel.findOne({ email });
  if (!doesUserExists) {
    res.redirect(
      `${process.env.CLIENT_GOOGLE_SIGNUP_URL}?name=${name}&profile_pic=${profile_pic}&email=${email}`
    );
    return;
  }

  if (!doesUserExists.is_verified) {
    doesUserExists.is_verified = true;
    await doesUserExists.save();
  }

  const accessToken = generateJWTToken(
    doesUserExists.id,
    process.env.ACCESS_TOKEN_EXPIRY as JWTExpiresIn
  );

  res.redirect(`${process.env.CLIENT_URL}?accessToken=${accessToken}`);
};

export const SignUp = AsyncRequestHandler(signUp);
export const VerifyEmail = AsyncRequestHandler(verifyEmail);
export const Login = AsyncRequestHandler(login);
export const GoogleAuth = AsyncRequestHandler(googleAuth);
