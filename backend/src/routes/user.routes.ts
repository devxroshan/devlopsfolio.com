import express from 'express';


// Controllers
import { GetUserProfile,
    SearchDevelopers,
    GetAllProjects,
    GetProject,
    GetLikes,
    GetComments
 } from '../controllers/user.controller';


// Middlewares
import { isLoggedIn } from '../midddlewares/is-logged-in.middleware';

const router:express.Router = express.Router();


router.get('/profile',isLoggedIn, GetUserProfile); // GET /api/v1/user/profile?username=someusername, to get the self profile of the logged in user no need to pass username query param, it will be fetched from the token
router.get('/search-by-skills', isLoggedIn, SearchDevelopers);
router.get('/all-projects', isLoggedIn, GetAllProjects) //projects?user_id=....
router.get('/project/:project_id', isLoggedIn, GetProject)
router.get('/project/likes/:project_id', isLoggedIn, GetLikes)
router.get('/project/comments/:project_id', isLoggedIn, GetComments)


export default router;