import express from 'express';

// Config
import { userSignUpSchema } from '../config/validation-schema';


// Middlewares
import { schemaValidator } from '../midddlewares/schema-validator.middleware';



const router:express.Router = express.Router();


router.post('/signup',schemaValidator(userSignUpSchema), );


export default router;