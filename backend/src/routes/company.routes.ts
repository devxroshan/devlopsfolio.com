import express from 'express';

// Config
import { companySchema } from '../config/validation-schema';

// Middlewares
import { isLoggedIn } from '../midddlewares/is-logged-in.middleware';
import { schemaValidator } from '../midddlewares/schema-validator.middleware';


// Controllers
import { CreateCompany, UpdateCompany, DeleteCompany } from '../controllers/company.controller';


const router:express.Router = express.Router();


router.post('/', isLoggedIn,schemaValidator(companySchema), CreateCompany);

router.put('/update', isLoggedIn,schemaValidator(companySchema.omit({logo_url: true})), UpdateCompany); 

router.delete('/', isLoggedIn, DeleteCompany)


export default router;  