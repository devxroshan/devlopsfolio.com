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
  AddProjectImg
} from "../controllers/project.controller";

const router: express.Router = express.Router();

router.post("/", isLoggedIn, schemaValidator(projectSchema), CreateProject);

router.patch("/add-project-img", isLoggedIn, AddProjectImg)
router.patch("/update/:id", isLoggedIn, UpdateProject);
router.patch("/:project_id/view", isLoggedIn, ViewProject);

router.put("/:project_id/like", isLoggedIn, LikeProject);

router.delete("/:project_id", isLoggedIn, DeleteProject);

export default router;
