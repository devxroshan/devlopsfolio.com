import express from 'express';

// Middlewares
import { isLoggedIn } from '../midddlewares/is-logged-in.middleware';
import { isContactAllowed } from '../midddlewares/is-contact-allowed.middleware';
import { DeleteMessage, PinMessage, SendMessage, SetMessageSeen } from '../controllers/message.controller';

const router:express.Router = express.Router();


router.post('/:receiver_id', isLoggedIn, isContactAllowed, SendMessage) //reply?message_id=...

router.patch('/pin-unpin/:message_id', isLoggedIn, PinMessage)
router.patch('/seen/:message_id', isLoggedIn, SetMessageSeen)

router.delete('/:message_id', isLoggedIn, DeleteMessage)


export default router;
