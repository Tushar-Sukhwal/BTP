// src/utils/imageUtils.ts
import sharp from "sharp";
import fs from "fs";
import path from "path";

// Convert image to RGB matrix
export async function imageToRgbMatrix(
  imagePath: string
): Promise<number[][][]> {
  try {
    const { data, info } = await sharp(imagePath)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const matrix: number[][][] = [];

    for (let y = 0; y < height; y++) {
      matrix[y] = [];
      for (let x = 0; x < width; x++) {
        const pos = (y * width + x) * channels;
        matrix[y][x] = [
          data[pos], // R
          data[pos + 1], // G
          data[pos + 2], // B
        ];
      }
    }

    return matrix;
  } catch (error) {
    console.error("Error converting image to RGB matrix:", error);
    throw error;
  }
}

// Convert RGB matrix back to an image
export async function rgbMatrixToImage(
  matrix: number[][][],
  outputPath: string
): Promise<void> {
  try {
    const height = matrix.length;
    const width = matrix[0].length;
    const channels = 3; // RGB

    const data = Buffer.alloc(width * height * channels);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const pos = (y * width + x) * channels;
        data[pos] = matrix[y][x][0]; // R
        data[pos + 1] = matrix[y][x][1]; // G
        data[pos + 2] = matrix[y][x][2]; // B
      }
    }

    await sharp(data, {
      raw: {
        width,
        height,
        channels,
      },
    }).toFile(outputPath);
  } catch (error) {
    console.error("Error converting RGB matrix to image:", error);
    throw error;
  }
}

// Calculate PSNR between two images
export function calculatePSNR(
  original: number[][][],
  compressed: number[][][]
): number {
  const height = original.length;
  const width = original[0].length;

  let mse = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 3; c++) {
        const diff = original[y][x][c] - compressed[y][x][c];
        mse += diff * diff;
      }
    }
  }

  mse /= height * width * 3;

  if (mse === 0) return Infinity;

  const maxValue = 255;
  const psnr = 10 * Math.log10((maxValue * maxValue) / mse);

  return psnr;
}

// Calculate compression ratio
export function calculateCompressionRatio(
  originalSize: number,
  compressedSize: number
): number {
  return originalSize / compressedSize;
}
