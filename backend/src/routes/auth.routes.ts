import express from 'express';

// Config
import { userSignUpSchema } from '../config/validation-schema';


// Middlewares
import { schemaValidator } from '../midddlewares/schema-validator.middleware';


// Controller
import {
    SignUp,
    VerifyEmail,
    Login
} from '../controllers/auth.controller'


const router:express.Router = express.Router();


router.post('/signup',schemaValidator(userSignUpSchema), SignUp);
router.get('/verify-email', VerifyEmail);
router.get('/login', Login);


export default router;