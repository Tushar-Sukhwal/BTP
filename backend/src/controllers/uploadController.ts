// src/controllers/uploadController.ts
import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export const uploadImage = (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Create a folder for this image
    const imageId = path.parse(req.file.filename).name;
    const processingDir = path.join(__dirname, `../../public/processed/${imageId}`);
    
    if (!fs.existsSync(processingDir)) {
      fs.mkdirSync(processingDir, { recursive: true });
    }

    return res.status(200).json({
      message: 'File uploaded successfully',
      file: req.file,
      imageId
    });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ message: 'Server error during upload' });
  }
};
