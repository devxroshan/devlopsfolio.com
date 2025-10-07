import express from 'express';

// Middlewares
import { isLoggedIn } from '../midddlewares/is-logged-in.middleware';
import { isContactAllowed } from '../midddlewares/is-contact-allowed.middleware';

const router:express.Router = express.Router();


router.post('/', isLoggedIn, isContactAllowed)

export default router;
