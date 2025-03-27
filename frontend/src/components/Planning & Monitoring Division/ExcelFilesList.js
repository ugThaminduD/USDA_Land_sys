import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Divider,
  TextField,
  InputAdornment,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TableViewIcon from '@mui/icons-material/TableView';



const ExcelFilesList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/excel/files');
                
                if (response.data.success && response.data.files) {
                    setFiles(response.data.files);
                } else {
                    setError('No files found');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to fetch Excel files');
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    // Filter files based on search term
    const filteredFiles = files.filter(file => {
        if (!searchTerm) return true;
        const searchTermLower = searchTerm.toLowerCase();
        return (
            file.fileName.toLowerCase().includes(searchTermLower) ||
            file.topic.toLowerCase().includes(searchTermLower)
        );
    });

    // Group files by topic
    const groupedFiles = filteredFiles.reduce((acc, file) => {
        const topic = file.topic || 'General';
        if (!acc[topic]) acc[topic] = [];
        acc[topic].push(file);
        return acc;
    }, {});

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };



    return (
        <Container maxWidth="xl" sx={{ 
            background: 'linear-gradient(to right bottom, rgb(245, 220, 198), rgb(255, 140, 0))',
            minHeight: '100vh',
            py: 5,
        }}>

            <Box sx={{ 
                mb: 4, 
                mt: 3, 
                p: 3,
                backgroundColor: 'white',
                border: '1px solid rgb(251, 58, 0)',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
                <Typography variant="h4" component="h2" gutterBottom>
                    Excel Files List
                </Typography>

                {/* Navigation and Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => navigate('/')}
                        sx={{ 
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
                
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => navigate('/upload/excelDocument')}
                    >
                        Upload New Excel File
                    </Button>

                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<TableViewIcon />}
                        onClick={() => navigate('/excel/data/view')}
                    >
                        View All Data
                    </Button>
                </Box>

                {/* Search Field */}
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search by file name or topic..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 3 }}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                        ),
                    }}
                />

                {/* Loading, Error states */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                {/* Files List by Topic */}
                {!loading && !error && Object.keys(groupedFiles).length === 0 && (
                    <Alert severity="info">
                        No Excel files available. Please upload an Excel file first.
                    </Alert>
                )}

                {!loading && !error && Object.keys(groupedFiles).map(topic => (
                    <Box key={topic} sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ 
                            backgroundColor: '#f5f5f5', 
                            p: 1, 
                            borderRadius: '4px 4px 0 0',
                            fontWeight: 'bold'
                        }}>
                            {topic}
                        </Typography>
                        <Paper elevation={1}>
                            <List>
                                {groupedFiles[topic].map((file, index) => (
                                    <React.Fragment key={file._id}>
                                        {index > 0 && <Divider />}
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={() => navigate(`/excel/file/${file._id}`)}>
                                                <ListItemText 
                                                    primary={file.fileName}
                                                    secondary={`Uploaded: ${formatDate(file.uploadDate)}`}
                                                />
                                                <Chip 
                                                    label="View Data" 
                                                    color="primary" 
                                                    size="small" 
                                                    sx={{ ml: 1 }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    </Box>
                ))}
            </Box>

        </Container>
    );
};

export default ExcelFilesList;