// src/utils/compression/wavelet.ts
// Simplified Haar wavelet transform
export function waveletCompress(
  matrix: number[][][],
  level: number = 1
): number[][][] {
  const height = matrix.length;
  const width = matrix[0].length;

  // Create a copy of the matrix to work with
  const result = JSON.parse(JSON.stringify(matrix)) as number[][][];

  // Apply wavelet transform for each level
  for (let l = 0; l < level; l++) {
    const currentHeight = height >> l;
    const currentWidth = width >> l;

    // Process each color channel
    for (let c = 0; c < 3; c++) {
      // Process rows
      for (let y = 0; y < currentHeight; y++) {
        const row = new Array(currentWidth);
        for (let x = 0; x < currentWidth; x++) {
          row[x] = result[y][x][c];
        }

        const transformed = haarTransform1D(row);

        for (let x = 0; x < currentWidth; x++) {
          result[y][x][c] = transformed[x];
        }
      }

      // Process columns
      for (let x = 0; x < currentWidth; x++) {
        const col = new Array(currentHeight);
        for (let y = 0; y < currentHeight; y++) {
          col[y] = result[y][x][c];
        }

        const transformed = haarTransform1D(col);

        for (let y = 0; y < currentHeight; y++) {
          result[y][x][c] = transformed[y];
        }
      }
    }
  }

  return result;
}

// 1D Haar wavelet transform
function haarTransform1D(data: number[]): number[] {
  const n = data.length;
  const result = new Array(n);

  // Apply one level of Haar transform
  for (let i = 0; i < n; i += 2) {
    const avg = (data[i] + (i + 1 < n ? data[i + 1] : data[i])) / 2;
    const diff = (data[i] - (i + 1 < n ? data[i + 1] : data[i])) / 2;

    result[i / 2] = avg;
    result[n / 2 + i / 2] = diff;
  }

  return result;
}
