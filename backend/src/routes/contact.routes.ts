import express from 'express'

// Middlewares
import { isLoggedIn } from '../midddlewares/is-logged-in.middleware';


// Controllers
import { AcceptContactRequest, ContactRequest, DeleteContactRequest } from '../controllers/contact.controller';

const router:express.Router = express.Router();


router.post('/', isLoggedIn, ContactRequest)

router.patch('/accept', isLoggedIn, AcceptContactRequest) // ?contact_request_id=...

router.delete('/', isLoggedIn, DeleteContactRequest)


export default router;