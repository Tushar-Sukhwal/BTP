// src/controllers/compressionController.ts
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import {
  imageToRgbMatrix,
  rgbMatrixToImage,
  calculatePSNR,
  calculateCompressionRatio,
} from "../utils/imageUtils";
import { dpcmEncode, dpcmDecode } from "../utils/compression/dpcm";
import { dctCompress } from "../utils/compression/dct";
import { waveletCompress } from "../utils/compression/wavelet";

export const compressImage = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;
    const { algorithm = "all" } = req.query;

    // Get the image path
    const uploadsDir = path.join(__dirname, "../../public/uploads");
    const processingDir = path.join(
      __dirname,
      `../../public/processed/${imageId}`
    );

    // Ensure the processing directory exists
    if (!fs.existsSync(processingDir)) {
      fs.mkdirSync(processingDir, { recursive: true });
    }

    // Find the image file
    const files = fs
      .readdirSync(uploadsDir)
      .filter((file) => file.startsWith(imageId));

    if (files.length === 0) {
      return res.status(404).json({ message: "Image not found" });
    }

    const imagePath = path.join(uploadsDir, files[0]);

    // Get original file size
    const originalSize = fs.statSync(imagePath).size;

    // Convert image to RGB matrix
    const rgbMatrix = await imageToRgbMatrix(imagePath);

    // Apply selected algorithms
    const algorithms =
      algorithm === "all" ? ["dpcm", "dct", "wavelet"] : [algorithm as string];

    const results = [];

    for (const algo of algorithms) {
      let processedMatrix;
      let outputPath;

      switch (algo) {
        case "dpcm":
          // Apply DPCM compression
          const residuals = dpcmEncode(rgbMatrix);
          processedMatrix = dpcmDecode(residuals);
          outputPath = path.join(processingDir, `${imageId}_dpcm.png`);
          break;

        case "dct":
          // Apply DCT compression
          processedMatrix = dctCompress(rgbMatrix, 50); // Quality 50
          outputPath = path.join(processingDir, `${imageId}_dct.png`);
          break;

        case "wavelet":
          // Apply Wavelet compression
          processedMatrix = waveletCompress(rgbMatrix);
          outputPath = path.join(processingDir, `${imageId}_wavelet.png`);
          break;

        case "apubt3-nup":
          // Placeholder for APUBT3-NUP algorithm
          // In a real implementation, this would be implemented properly
          processedMatrix = rgbMatrix; // Just copy for now
          outputPath = path.join(processingDir, `${imageId}_apubt3nup.png`);
          break;

        default:
          continue;
      }

      // Save processed image
      await rgbMatrixToImage(processedMatrix, outputPath);

      // Get compressed file size
      const compressedSize = fs.statSync(outputPath).size;

      // Calculate metrics
      const psnr = calculatePSNR(rgbMatrix, processedMatrix);
      const compressionRatio = calculateCompressionRatio(
        originalSize,
        compressedSize
      );

      results.push({
        algorithm: algo,
        psnr,
        compressionRatio,
        outputPath: path.relative(
          path.join(__dirname, "../../public"),
          outputPath
        ),
      });
    }

    return res.status(200).json({
      message: "Image compressed successfully",
      results,
    });
  } catch (error) {
    console.error("Compression error:", error);
    return res.status(500).json({ message: "Server error during compression" });
  }
};

export const compareCompression = async (req: Request, res: Response) => {
  try {
    const { imageId } = req.params;

    const processingDir = path.join(
      __dirname,
      `../../public/processed/${imageId}`
    );

    if (!fs.existsSync(processingDir)) {
      return res
        .status(404)
        .json({ message: "No compressed images found for this image" });
    }

    // Get the original image
    const uploadsDir = path.join(__dirname, "../../public/uploads");
    const files = fs
      .readdirSync(uploadsDir)
      .filter((file) => file.startsWith(imageId));

    if (files.length === 0) {
      return res.status(404).json({ message: "Original image not found" });
    }

    const originalImagePath = path.join(uploadsDir, files[0]);
    const originalSize = fs.statSync(originalImagePath).size;

    // Get all compressed images
    const compressedFiles = fs.readdirSync(processingDir);

    if (compressedFiles.length === 0) {
      return res.status(404).json({ message: "No compressed images found" });
    }

    // Gather results
    const results = [];

    for (const file of compressedFiles) {
      const compressedImagePath = path.join(processingDir, file);
      const compressedSize = fs.statSync(compressedImagePath).size;

      // Get algorithm name from filename
      const nameMatch = file.match(/_([a-z0-9-]+)\.png$/);
      if (!nameMatch) continue;

      const algorithm = nameMatch[1];

      // Get RGB matrices
      const originalMatrix = await imageToRgbMatrix(originalImagePath);
      const compressedMatrix = await imageToRgbMatrix(compressedImagePath);

      // Calculate metrics
      const psnr = calculatePSNR(originalMatrix, compressedMatrix);
      const compressionRatio = calculateCompressionRatio(
        originalSize,
        compressedSize
      );

      results.push({
        algorithm,
        psnr,
        compressionRatio,
        file,
        originalSize,
        compressedSize,
      });
    }

    return res.status(200).json({
      message: "Compression comparison",
      originalImage: files[0],
      results,
    });
  } catch (error) {
    console.error("Comparison error:", error);
    return res.status(500).json({ message: "Server error during comparison" });
  }
};
