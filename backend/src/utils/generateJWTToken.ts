import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import AppError from "./appError";


export type JWTExpiresIn = `${number}${"s" | "m" | "h" | "d" | "w"}`;



export const generateJWTToken = (userId: string, expiresIn: JWTExpiresIn): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }

  if (!process.env.ACCESS_TOKEN_EXPIRY) {
    throw new Error(
      "ACCESS_TOKEN_EXPIRY is not defined in environment variables"
    );
  }

  const options:SignOptions = {
    algorithm: 'HS512',
    expiresIn
  }

  try {
    return jwt.sign({userId}, process.env.JWT_SECRET, )
  } catch (error) {
    if(process.env.NODE_ENV === 'development'){
        console.log(error)
    }
    throw new AppError('Internal Server Error', 500)
  }
};
