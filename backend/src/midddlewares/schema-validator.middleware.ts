import express from "express";
import { ZodObject } from "zod";

export const schemaValidator = (schema: ZodObject<any>) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void => {
    try {
      const result = schema.safeParse(req.body);

      if (!result.success) {
        const errors = result.error.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));

        res.status(400).json({
            ok: false,
          msg: "Invalid request body",
          errors: errors,
        });
        return;
      }

      
      req.body = result.data;
      next();
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error(error);
        return;
      }
      res.status(400).json({ message: "Invalid request data" });
    }
  };
};
