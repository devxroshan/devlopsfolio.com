import express from 'express'


// Config
import { profileSchema } from '../config/validation-schema';

// Middlewares
import { schemaValidator } from '../midddlewares/schema-validator.middleware';

// Controllers
import { ChangeProfilePic, CreateProfile, DeleteProfile, RemoveProfilePic, RemoveSocialMediaLink, UpdateProfile } from '../controllers/profile.controller';
import { isLoggedIn } from '../midddlewares/is-logged-in.middleware';

const router:express.Router = express.Router()


router.post('/',isLoggedIn, schemaValidator(profileSchema), CreateProfile)

router.put('/update',isLoggedIn, UpdateProfile) // update?field=<bio/website/location..>&fieldValue=<"Hello">
router.put('/remove-link',isLoggedIn, RemoveSocialMediaLink)
router.put('/profile-pic',isLoggedIn, ChangeProfilePic)
router.put('/remove-profile-pic',isLoggedIn, RemoveProfilePic)

router.delete('/',isLoggedIn, DeleteProfile) 


export default router;
