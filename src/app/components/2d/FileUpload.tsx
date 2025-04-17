// components/FileUpload.tsx
import React, { FC } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

const FileUpload: FC<FileUploadProps> = ({ onFileSelect }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: '.csv, .json',
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
  });

  return (
    <div className="mb-6 w-full max-w-md" {...getRootProps()}>
      <input {...getInputProps()} />
      <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center cursor-pointer hover:shadow-lg transition-all">
        <p className="text-lg text-blue-300 font-semibold">
          Drag & Drop your CSV or JSON file here
        </p>
        <p className="text-sm text-blue-500">or click to select file</p>
      </div>
    </div>
  );
};

export default FileUpload;
