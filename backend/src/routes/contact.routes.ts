import express from 'express'

// Middlewares
import { isLoggedIn } from '../midddlewares/is-logged-in.middleware';


// Controllers
import { ContactRequest } from '../controllers/contact.controller';

const router:express.Router = express.Router();


router.post('/', isLoggedIn, ContactRequest)

router.patch('/accept', isLoggedIn, ContactRequest)

router.delete('/', isLoggedIn, ContactRequest)


export default router;