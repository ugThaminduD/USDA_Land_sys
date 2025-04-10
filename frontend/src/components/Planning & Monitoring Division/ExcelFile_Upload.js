import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Alert,  
  Snackbar,
  Container,
  TextField
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';


const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [topic, setTopic] = useState("");
  const navigate = useNavigate();

  // Handle File Change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Check if it's an Excel file
    if (file && (file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      setSelectedFile(file);
      setError("");
    } else {
      setSelectedFile(null);
      setError("Please select a valid Excel file (.xlsx or .xls)");
      setOpenSnackbar(true);
    }
  };

  // Upload Excel File
  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      setOpenSnackbar(true);
      return;
    }

    // Check if the topic is empty
    if (!topic.trim()) { 
      setError("Please enter a topic/category");
      setOpenSnackbar(true);
      return;
    }

    // Add file size check on frontend
    if (selectedFile.size > 100 * 1024 * 1024) { // 100MB in bytes
      setError("File size too large. Maximum size allowed is 100MB");
      setOpenSnackbar(true);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('topic', topic || "General");


    setLoading(true);
    try {
      const response = await axios.post('/upload/excel_document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        setSuccess(true);
        setSelectedFile(null);
        setTopic("");
        setTimeout(() => {
          setSuccess(false);
          navigate('/excel/files'); // Redirect to files list after successful upload
        }, 2000);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 
                        "Error uploading file. Please ensure the file is a valid Excel file with proper data structure.";
      console.error("Upload error:", err);
      setError(errorMessage);
      setOpenSnackbar(true);
    } finally {
      setLoading(false);
    }
  };

  // Close Snackbar
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };



  return (
    <Container maxWidth="auto" sx={{ 
      background: 'linear-gradient(to right bottom, rgb(245, 220, 198), rgb(255, 140, 0))',
      minHeight: '100vh',
      py: 2,
    }}>

      <Paper elevation={3} sx={{ p: 4, mt: 4 }} >

        {/* Back Home Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate('/')}
            sx={{ 
              mb: 2,
              color: 'black',
              borderColor: 'black',
              backgroundColor: 'rgba(255, 94, 0, 0.5)',
              '&:hover': {
                borderColor: 'primary.dark',
                backgroundColor: 'rgba(255, 0, 0, 0.82)'
              }
            }}
          >
            Back to Land List
          </Button>
        </Box>

        <Typography variant="h4" align="center" gutterBottom>
          Excel File Upload
        </Typography>
        

        {/* Upload area */}
        <Box 
          sx={{ 
            border: '2px dashed #ccc', 
            borderRadius: 2, 
            p: 3, mb: 3,
            textAlign: 'center',
            minHeight: 200,
            backgroundColor: '#f8f9fa',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: '#f1f3f5',
            }
          }}
          onClick={() => document.getElementById('file-input').click()}
        >
          {success ? (
            <Box sx={{ color: 'success.main', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <CheckCircleIcon sx={{ fontSize: 60, mb: 1 }} />
              <Typography variant="h6">Upload Successful!</Typography>
            </Box>
          ) : (
            <>
              <CloudUploadIcon sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Drag & Drop or Click to Upload Excel File
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Supports .xlsx and .xls formats || Maximum size allowed is 100MB
              </Typography>
              
              {selectedFile && (
                <Typography variant="body1" sx={{ mt: 2, fontWeight: 'medium' }}>
                  Selected: {selectedFile.name}
                </Typography>
              )}
            </>
          )}
          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </Box>


        {/* Add topic input field */}
        <TextField
          fullWidth
          label="Topic/Category"
          variant="outlined"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          margin="normal"
          placeholder="E.g. Land Data, Budget, Inventory, etc."
          sx={{ mb: 3 }}
        />
        
        {/* Upload Button */}
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleUpload}
            disabled={!selectedFile || loading || success}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ px: 4, py: 1.5 }}
          >
            {loading ? 'Uploading...' : 'Upload File'}
          </Button>
        </Box>
        
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
        
      </Paper>

    </Container>
  );
};

export default FileUpload;