import { multerStorage } from "../app";
import multer from "multer";
import { Request, Response } from "express";

export const uploadMulterFiles = (req: Request, res: Response) => {
  return new Promise<void>((resolve, reject) => {
    multerStorage.array("project-img", 5)(req, res, (err: any) => {
      if (err instanceof multer.MulterError) {
        switch (err.code) {
          case "LIMIT_UNEXPECTED_FILE":
            return reject({ status: 400, msg: "Too many files uploaded. Max 5 allowed." });
          case "LIMIT_FILE_SIZE":
            return reject({ status: 400, msg: "File too large. Max 5 MB allowed." });
          case "LIMIT_FILE_COUNT":
            return reject({ status: 400, msg: "Too many files uploaded." });
          default:
            return reject({ status: 400, msg: err.message });
        }
      } else if (err) {
        return reject({ status: 500, msg: err.message });
      }

      if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
        return reject({ status: 400, msg: "No files uploaded." });
      }

      resolve();
    });
  });
};
