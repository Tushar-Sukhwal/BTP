// src/utils/compression/dpcm.ts
// Clamp value to 0-255
function clamp(val: number): number {
  return Math.max(0, Math.min(255, val));
}

// Wrap value to 0-255 (modulo 256)
function wrap(val: number): number {
  return ((val % 256) + 256) % 256;
}

// DPCM ENCODE with optional wrap (default: clamp)
export function dpcmEncode(matrix: number[][][], mode: 'clamp' | 'wrap' = 'clamp'): number[][][] {
  const height = matrix.length;
  const width = matrix[0].length;
  const residuals = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => [0, 0, 0])
  );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 3; c++) { // R, G, B
        const prev = x === 0 ? 0 : matrix[y][x - 1][c];
        let diff = matrix[y][x][c] - prev;
        residuals[y][x][c] = (mode === 'wrap') ? wrap(diff) : clamp(diff);
      }
    }
  }
  return residuals;
}

// DPCM DECODE with optional wrap (default: clamp)
export function dpcmDecode(residuals: number[][][], mode: 'clamp' | 'wrap' = 'clamp'): number[][][] {
  const height = residuals.length;
  const width = residuals[0].length;
  const matrix = Array.from({ length: height }, () =>
    Array.from({ length: width }, () => [0, 0, 0])
  );

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      for (let c = 0; c < 3; c++) {
        const prev = x === 0 ? 0 : matrix[y][x - 1][c];
        let value = residuals[y][x][c] + prev;
        matrix[y][x][c] = (mode === 'wrap') ? wrap(value) : clamp(value);
      }
    }
  }
  return matrix;
}
