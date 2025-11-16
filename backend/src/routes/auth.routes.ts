import express from 'express';

// Config
import { userSignUpSchema } from '../config/validation-schema.config';


// Middlewares
import { schemaValidator } from '../midddlewares/schema-validator.middleware';


// Controller
import {
    SignUp,
    VerifyEmail,
    Login,
    GoogleAuth
} from '../controllers/auth.controller'
import passport, { session } from 'passport';


const router:express.Router = express.Router();


router.post('/signup',schemaValidator(userSignUpSchema), SignUp); // ?authParty=google query when user signed up using google
router.get('/verify-email', VerifyEmail);
router.get('/login', Login);

// Google Login & SignUp
router.get('/google-consent', passport.authenticate('google', {scope: ['profile', 'email'], session: false}))
router.get('/google-auth', passport.authenticate('google', {failureRedirect: `${process.env.CLIENT_URL}/auth/google-auth-failed`, session: false}), GoogleAuth)


export default router;