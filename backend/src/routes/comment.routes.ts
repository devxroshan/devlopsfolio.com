import express from "express";

// Middlewares
import { isLoggedIn } from "../midddlewares/is-logged-in.middleware";

// Controllers
import {
  ReplyOnComment,
  DeleteComment,
  DeleteReplyComment,
  CommentOnProject,
} from "../controllers/comment.controller";

const router: express.Router = express.Router();

router.post("/:project_id", isLoggedIn, CommentOnProject); // ?comment="Great Work!"

router.post("/:comment_id/reply", isLoggedIn, ReplyOnComment); // reply?reply="Thank you!"

router.delete(
    "/reply-comment/:reply_comment_id",
    isLoggedIn,
    DeleteReplyComment
);
router.delete("/:comment_id", isLoggedIn, DeleteComment);

export default router;
