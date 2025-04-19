// src/routes/uploadRoutes.ts
import { Router } from "express";
import asyncHandler from "express-async-handler";
import { uploadImage } from "../controllers/uploadController";
import upload from "../middlewares/multerMiddleware";

const router = Router();

// This library handles the type conversion internally
router.post("/", upload.single("image"), asyncHandler(uploadImage as any));

export default router;
