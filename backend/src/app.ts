import express from 'express';
import { configDotenv } from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import {Strategy as GoogleStrategy, Profile as GoogleProfile, VerifyCallback} from 'passport-google-oauth20';

configDotenv()

const app = express();
const PORT = process.env.PORT || 8000;

// Config
import connectDB from './config/db';

// Utils
import { errorHandler } from './midddlewares/error-handler.middleware';

// Routes
import authRoutes from './routes/auth.routes'
import profileRoutes from './routes/profile.routes'
import projectRoutes from './routes/project.routes'
import commentRoutes from './routes/comment.routes'
import companyRoutes from './routes/company.routes';
import contactRoutes from './routes/contact.routes';
import messageRoutes from './routes/message.routes';

// Connect to the database
connectDB();

app.use(cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(passport.initialize());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// PassportJS
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: `${process.env.SERVER}/api/v1/auth/google-auth`
}, (accessToken: string, refreshToken: string, profile: GoogleProfile, done: VerifyCallback) => {
  interface GoogleOAuthProfile {
    name: string,
    email: string,
    profile_pic: string
  }

  const user: GoogleOAuthProfile = {
    name: profile.displayName,
    email: profile.emails ? profile.emails[0].value : '',
    profile_pic: profile.photos ? profile.photos[0].value : ''
  }
  return done(null, user);
}))

// Routes
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/profile', profileRoutes)
app.use('/api/v1/project', projectRoutes)
app.use('/api/v1/comment', commentRoutes)
app.use('/api/v1/company', companyRoutes)
app.use('/api/v1/contact', contactRoutes)
app.use('/api/v1/message', messageRoutes)


app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});