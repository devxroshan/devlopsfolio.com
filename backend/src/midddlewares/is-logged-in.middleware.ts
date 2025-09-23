import express from 'express'
import AppError from '../utils/appError'
import { verifyAccessToken } from '../utils/verifyJWTToken'

import userModel, {IUser} from '../models/user.model'


declare global {
    namespace Express {
        interface Request {
            signedInUser: IUser 
        }
    }
}

export const isLoggedIn = async (req: express.Request, res: express.Response, next: express.NextFunction):Promise<void> => {
    const accessToken = req.cookies['accessToken']
    if(!accessToken){
        throw new AppError('AccessToken not found.', 400)
    }

    const verifiedToken = verifyAccessToken(accessToken);
    if(!verifiedToken)
        throw new AppError('Unable to verify access token.', 400)

    try {
        const user = await userModel.findById(accessToken.userId)
        if(!user)
            throw new AppError('Invalid access token.', 400)
    
        req.signedInUser = user
        next()
    } catch (error) {
        if(process.env.NODE_ENV === 'development')
            console.log(error)
        throw new AppError('Internal Server Error.', 500)
    }
}