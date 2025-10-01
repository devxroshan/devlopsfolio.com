import express from 'express';

// Config
import { companySchema } from '../config/validation-schema';

// Middlewares
import { isLoggedIn } from '../midddlewares/is-logged-in.middleware';
import { schemaValidator } from '../midddlewares/schema-validator.middleware';


// Controllers
import { CreateCompany, UpdateCompany, DeleteCompany, ChangeCompanyIcon, RemoveCompanyIcon } from '../controllers/company.controller';


const router:express.Router = express.Router();


router.post('/', isLoggedIn,schemaValidator(companySchema), CreateCompany);

router.put('/update', isLoggedIn,schemaValidator(companySchema.omit({logo_url: true})), UpdateCompany);
router.put('/change-icon', isLoggedIn, ChangeCompanyIcon);
router.put('/remove-icon', isLoggedIn, RemoveCompanyIcon);

router.delete('/', isLoggedIn, DeleteCompany)


export default router;  