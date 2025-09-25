import express from "express";

// Config
import { projectSchema } from "../config/validation-schema";

// Middlewares
import { isLoggedIn } from "../midddlewares/is-logged-in.middleware";
import { schemaValidator } from "../midddlewares/schema-validator.middleware";

// Controllers
import {
  CreateProject,
  UpdateProject,
  DeleteProject,
  LikeProject,
  ViewProject,
} from "../controllers/project.controller";

const router: express.Router = express.Router();

router.post("/", isLoggedIn, schemaValidator(projectSchema), CreateProject);

router.put("/update/:id", isLoggedIn, UpdateProject);
router.put("/:project_id/like", isLoggedIn, LikeProject);
router.put("/:project_id/view", isLoggedIn, ViewProject);

router.delete("/:project_id", isLoggedIn, DeleteProject);

export default router;
