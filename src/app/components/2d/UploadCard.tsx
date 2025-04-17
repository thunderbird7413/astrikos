'use client';
import { useDropzone } from 'react-dropzone';

interface UploadCardProps {
  onFileDrop: (file: File) => void;
}

export default function UploadCard({ onFileDrop }: UploadCardProps) {
  const { getRootProps, getInputProps } = useDropzone({
    accept: ['.csv', '.json'], // Using simple extension matching for CSV and JSON
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileDrop(acceptedFiles[0]);  // Trigger file drop callback
      }
    },
  });

  return (
    <div
      {...getRootProps()}
      className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer"
    >
      <input {...getInputProps()} />
      <p className="text-lg text-blue-300 font-semibold">
        Drag & Drop your CSV or JSON file here
      </p>
      <p className="text-sm text-blue-500">or click to select file</p>
    </div>
  );
}
