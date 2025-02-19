import React from "react";
import { Container, Typography } from "@mui/material";
import FileUpload from "./ProgressTrackingAndReportSharing/FileUpload";
import FileList from "./ProgressTrackingAndReportSharing/FileList";

const Dashboard: React.FC = () => {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Progress Tracking and Report Sharing
      </Typography>
      <FileUpload />
      <FileList />
    </Container>
  );
};

export default Dashboard;
