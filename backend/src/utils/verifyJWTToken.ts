import jwt, {JwtPayload} from 'jsonwebtoken'
import AppError from './appError';


interface AccessTokenPayload extends JwtPayload {
  userId: string;
}

export const verifyJWTToken = (accessToken: string): AccessTokenPayload => {
    try {
        return jwt.verify(accessToken, process.env.JWT_SECRET as string) as AccessTokenPayload
    } catch (error) {
        if(process.env.NODe_ENV === 'development'){
            console.log(error)
        }
        throw new AppError('Internal Server Error', 500)
    }
}