import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
  Box,
  Typography,
} from "@mui/material";
import axiosClient from "../../utils/axiosClient";

interface FileData {
  id: number;
  filePath: string;
}

const FileList: React.FC = () => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get("/api/files")
      .then((response) => {
        setFiles(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching files:", error);
        setLoading(false);
      });
  }, []);

  const handleDownload = async (id: number) => {
    try {
      const response = await axiosClient.get(`/api/files/download/${id}`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data]);
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.setAttribute("download", `file_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">Available Reports</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {files.map((file) => (
            <ListItem key={file.id}>
              <ListItemText primary={file.filePath} />
              <Button
                variant="outlined"
                onClick={() => handleDownload(file.id)}
              >
                Download
              </Button>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default FileList;
