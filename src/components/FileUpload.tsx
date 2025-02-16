"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { FaUpload, FaSpinner } from "react-icons/fa";

type FileUploadProps = {
  onUpload: (file: File) => Promise<void>;
};

export const FileUpload = ({ onUpload }: FileUploadProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsProcessing(true);
      try {
        await onUpload(acceptedFiles[0]);
      } finally {
        setIsProcessing(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE_MB * 1024 * 1024,
    accept: ACCEPTED_MIME_TYPES,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all 
        ${
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-400 hover:border-blue-400"
        }
        ${isProcessing ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      <input {...getInputProps()} />

      <motion.div
        animate={{ rotate: isProcessing ? 360 : 0 }}
        transition={{ duration: 1, repeat: Infinity }}
        className="inline-block mb-3"
      >
        {isProcessing ? (
          <FaSpinner className="w-8 h-8 text-blue-400 mx-auto" />
        ) : (
          <FaUpload className="w-8 h-8 text-blue-400 mx-auto" />
        )}
      </motion.div>

      <p className="text-base text-gray-200 mb-1">
        {isProcessing
          ? "Processing..."
          : isDragActive
          ? "Drop file here"
          : "Drag & drop or click to upload"}
      </p>
      <p className="text-sm text-gray-400">
        Supported formats: PNG, JPG, PDF (max {MAX_FILE_SIZE_MB}MB)
      </p>
    </div>
  );
};
