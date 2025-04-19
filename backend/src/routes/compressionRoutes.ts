// src/routes/compressionRoutes.ts
import { Router, Request, Response, NextFunction } from "express";
import {
  compressImage,
  compareCompression,
} from "../controllers/compressionController";

const router = Router();

// Create an async handler to properly catch Promise rejections
const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Use asyncHandler to wrap the async controller methods
router.post("/:imageId", asyncHandler(compressImage));
router.get("/compare/:imageId", asyncHandler(compareCompression));

export default router;
