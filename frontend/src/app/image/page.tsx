"use client";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import axios from "axios";

type CompressionResult = {
  algorithm: string;
  psnr: number;
  compressionRatio: number;
  outputPath: string;
  file?: string;
  originalSize?: number;
  compressedSize?: number;
};

type ComparisonResponse = {
  message: string;
  originalImage: string;
  results: CompressionResult[];
};

const ImageProcessor = () => {
  // File upload states
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Image processing states
  const [imageId, setImageId] = useState<string | null>(null);
  const [algorithm, setAlgorithm] = useState<string>("all");
  const [processing, setProcessing] = useState(false);
  const [compareLoading, setCompareLoading] = useState(false);
  const [compressionResults, setCompressionResults] = useState<
    CompressionResult[]
  >([]);
  const [comparisonResults, setComparisonResults] =
    useState<ComparisonResponse | null>(null);

  // API URL
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000";

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setError(null);
    setImageId(null);
    setCompressionResults([]);
    setComparisonResults(null);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = async (e: FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Please select an image file");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    setError(null);

    try {
      const response = await axios.post<{ imageId: string }>(
        `${apiUrl}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setImageId(response.data.imageId);
      console.log("Upload successful:", response.data);
    } catch (error) {
      console.error("Upload failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An unknown error occurred during upload"
      );
    } finally {
      setUploading(false);
    }
  };

  const handleCompression = async () => {
    if (!imageId) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await axios.post<{ results: CompressionResult[] }>(
        `${apiUrl}/compression/${imageId}?algorithm=${algorithm}`
      );
      setCompressionResults(response.data.results);
      console.log("Compression successful:", response.data);
    } catch (error) {
      console.error("Compression failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred during compression"
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleComparisonFetch = async () => {
    if (!imageId) return;

    setCompareLoading(true);

    try {
      const response = await axios.get<ComparisonResponse>(
        `${apiUrl}/compression/compare/${imageId}`
      );
      setComparisonResults(response.data);
      console.log("Comparison fetched:", response.data);
    } catch (error) {
      console.error("Comparison fetch failed:", error);
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching comparison"
      );
    } finally {
      setCompareLoading(false);
    }
  };

  // Automatically fetch comparison when compression results are available
  useEffect(() => {
    if (compressionResults.length > 0) {
      handleComparisonFetch();
    }
  }, [compressionResults]);

  const algorithmOptions = [
    { value: "all", label: "All Algorithms" },
    { value: "dpcm", label: "DPCM" },
    { value: "dct", label: "DCT" },
    { value: "wavelet", label: "Wavelet" },
    { value: "apubt3-nup", label: "APUBT3-NUP" },
  ];

  // const getImageUrl = (path: string) => {
  //   return `${apiUrl}/${path}`;
  // };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Image Compression Tool</h2>

      {/* Step 1: Upload Image */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Step 1: Upload an Image</h3>
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="mx-auto max-h-64 object-contain"
                />
              ) : (
                <div className="py-8">
                  <p className="text-gray-500">Click to select an image</p>
                </div>
              )}
            </label>
          </div>

          {file && (
            <div className="text-sm text-gray-600">
              Selected file: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </div>
          )}

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:bg-blue-300"
            disabled={!file || uploading}
          >
            {uploading ? "Uploading..." : "Upload Image"}
          </button>
        </form>

        {imageId && (
          <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md">
            <p className="font-semibold">Upload successful!</p>
            <p className="text-sm mt-1">Image ID: {imageId}</p>
          </div>
        )}
      </div>

      {/* Step 2: Compress Image */}
      {imageId && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Step 2: Compress Image</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label htmlFor="algorithm" className="font-medium">
                Compression Algorithm:
              </label>
              <select
                id="algorithm"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                className="border rounded-md px-3 py-2"
                disabled={processing}
              >
                {algorithmOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleCompression}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-300"
              disabled={processing}
            >
              {processing ? "Processing..." : "Compress Image"}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results and Comparison */}
      {compressionResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-2">
            Step 3: Compression Results
          </h3>

          {compareLoading ? (
            <div className="text-center p-4">
              <p>Loading comparison results...</p>
            </div>
          ) : comparisonResults ? (
            <div>
              <div className="mb-6">
                <h4 className="font-medium text-lg mb-2">Original Image</h4>
                <div className="flex items-start space-x-4">
                  <div className="w-1/3">
                    {preview ? (
                      <img
                        // src={`${apiUrl}/uploads/${comparisonResults.originalImage}`}
                        src={preview}
                        alt="Original"
                        className="w-full rounded-md shadow-sm"
                      />
                    ) : (
                      ""
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      File size:{" "}
                      {(comparisonResults.results[0]?.originalSize || 0) / 1024}{" "}
                      KB
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {comparisonResults.results.map((result, index) => (
                  <div
                    key={index}
                    className="border rounded-lg overflow-hidden shadow-sm"
                  >
                    <div className="p-3 bg-gray-50 border-b">
                      <h4 className="font-medium">
                        {result.algorithm.toUpperCase()} Compression
                      </h4>
                    </div>
                    <div className="p-4">
                      <div className="mb-4">
                        {preview ? (
                          <img
                            // src={
                            //   result.outputPath
                            //     ? getImageUrl(result.outputPath)
                            //     : `${apiUrl}/processed/${imageId}/${result.file}`
                            // }
                            src={preview}
                            alt={`${result.algorithm} compressed`}
                            className="w-full rounded-md"
                          />
                        ) : (
                          ""
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="bg-gray-100 p-2 rounded">
                          <p className="font-medium">PSNR:</p>
                          <p>{result.psnr.toFixed(2)} dB</p>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                          <p className="font-medium">Compression Ratio:</p>
                          <p>{result.compressionRatio.toFixed(2)}x</p>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                          <p className="font-medium">Original Size:</p>
                          <p>{(result.originalSize || 0) / 1024} KB</p>
                        </div>
                        <div className="bg-gray-100 p-2 rounded">
                          <p className="font-medium">Compressed Size:</p>
                          <p>{(result.compressedSize || 0) / 1024} KB</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
};

export default ImageProcessor;
