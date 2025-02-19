import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { Box, Button, Typography, CircularProgress } from "@mui/material";
import { useAuth } from "../../store/AuthContext";
import axiosClient from "../../utils/axiosClient";

const FileUpload: React.FC = () => {
  const { userId } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"], "image/*": [] }, // Accept PDFs and images
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    if (userId) {
      formData.append("uploadedBy", userId.toString()); // Use dynamic userId
      formData.append("studentId", "1"); // Replace with actual student ID
    }

    setUploading(true);

    try {
      await axiosClient.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("File uploaded successfully!");
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      alert("File upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Box
      sx={{
        p: 2,
        border: "2px dashed #ccc",
        borderRadius: 2,
        textAlign: "center",
      }}
    >
      <div {...getRootProps()} style={{ cursor: "pointer" }}>
        <input {...getInputProps()} />
        <Typography variant="h6">
          {file
            ? `Selected: ${file.name}`
            : "Drag & drop a file or click to select"}
        </Typography>
      </div>
      {file && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          sx={{ mt: 2 }}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={24} /> : "Upload"}
        </Button>
      )}
    </Box>
  );
};

export default FileUpload;
