import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box, Grid,
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
  InputAdornment, Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import TableViewIcon from '@mui/icons-material/TableView';
import DownloadIcon from '@mui/icons-material/Download';


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

    // Group files by topic and then by parentFile
    const organizeFiles = () => {
        const filesByTopic = {};
        
        filteredFiles.forEach(file => {
            const topic = file.topic || 'General';
            
            if (!filesByTopic[topic]) {
                filesByTopic[topic] = {
                    standalone: [],
                    byParent: {}
                };
            }

            // If the file is part of a multi-sheet file
            if (file.parentFile) {
                if (!filesByTopic[topic].byParent[file.parentFile]) {
                    filesByTopic[topic].byParent[file.parentFile] = [];
                }
                filesByTopic[topic].byParent[file.parentFile].push(file);
            } else {
                // Standalone file
                filesByTopic[topic].standalone.push(file);
            }
            
            // // Check if it's part of a multi-sheet file
            // if (file.parentFile) {
            //     if (!filesByTopic[topic].byParent[file.parentFile]) {
            //         filesByTopic[topic].byParent[file.parentFile] = [];
            //     }
            //     filesByTopic[topic].byParent[file.parentFile].push(file);
            // } else {
            //     filesByTopic[topic].standalone.push(file);
            // }
        });
        
        return filesByTopic;
    };
    
    const organizedFiles = organizeFiles();



    // Download handler not yet implemented
    const handleDownload = async (fileId, fileName, event) => {
        event.stopPropagation(); // Prevent navigation when clicking download
        try {
            setLoading(true);
            const response = await axios.get(`/excel/download/${fileId}`, {
                responseType: 'blob'
            });

            // Create blob link to download
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Download error:', error);
            setError('Failed to download file');
        } finally {
            setLoading(false);
        }
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

                    {/* <Button
                        variant="contained"
                        color="info"
                        startIcon={<TableViewIcon />}
                        onClick={() => navigate('/excel/data/view')}
                    >
                        View All Data
                    </Button> */}
                </Box>

                {/* Search Field */}
                <Box sx={{ mb: 3, borderBottom: '2px solid black' }}>
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search by file name or topic..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{ mb: 3 }}
                        size="small"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                </Box>

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
                    <Box key={topic} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ 
                            backgroundColor: '#f5f5f5', 
                            p: 1, 
                            borderRadius: '4px 4px 0 0',
                            fontWeight: 'bold'
                        }}>
                            {topic}
                        </Typography>
                        
                        {/* Standalone files (single sheet) */}
                        {/* {organizedFiles[topic].standalone && organizedFiles[topic].standalone.length > 0 && ( */}
                        {organizedFiles[topic].standalone.length > 0 && (
                            <Paper elevation={1} sx={{ mb: 2 }}>
                                <List>
                                    {organizedFiles[topic].standalone.map((file, index) => (
                                        <React.Fragment key={file._id}>
                                            {index > 0 && <Divider />}
                                            <ListItem disablePadding>
                                                <ListItemButton >       {/* onClick={() => navigate(`/excel/file/${file._id}`)} */}
                                                    <ListItemText 
                                                        primary={file.fileName}
                                                        secondary={`Uploaded: ${formatDate(file.uploadDate)}`}
                                                    />
                                                    <Box sx={{ display: 'flex', gap: 1 }}>
                                                        <Chip 
                                                            label="View File"
                                                            icon={<TableViewIcon />} 
                                                            color="info" 
                                                            size="medium" 
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                navigate(`/excel/file/${file._id}`);
                                                            }}
                                                        />
                                                        {/* <Chip 
                                                            icon={<DownloadIcon />}
                                                            label="Download" 
                                                            color="secondary" 
                                                            size="small" 
                                                            onClick={(e) => handleDownload(file._id, file.fileName, e)}
                                                        /> */}
                                                    </Box>
                                                </ListItemButton>
                                            </ListItem>
                                        </React.Fragment>
                                    ))}
                                </List>
                            </Paper>
                        )}
                        
                        {/* Multi-sheet files */}
                        {/* {organizedFiles[topic].byParent && Object.keys(organizedFiles[topic].byParent).map(parentFile => ( */}
                        {Object.keys(organizedFiles[topic].byParent).map(parentFile => (
                            <Box key={parentFile} sx={{ mb: 2 }}>
                                <Typography variant="subtitle1" sx={{ 
                                    backgroundColor: '#e3f2fd', 
                                    p: 0.75, 
                                    pl: 2,
                                    borderRadius: '4px 4px 0 0',
                                    fontWeight: 500
                                }}>
                                    {parentFile} 
                                    <Chip 
                                        label={`${organizedFiles[topic].byParent[parentFile].length} sheets`} 
                                        size="small" 
                                    />
                                    {/* <Chip 
                                        icon={<DownloadIcon />}
                                        label="Download" 
                                        color="secondary" 
                                        size="small" 
                                        onClick={(e) => {
                                            const parentFileId = organizedFiles[topic].byParent[parentFile][0]?.excelFileId; // Get the fileId of the parent file
                                            handleDownload(parentFileId, `${parentFile}.xlsx`, e);
                                        }}
                                    />    */}
                                </Typography>
                                <Paper elevation={1}>
                                    <List>
                                        {organizedFiles[topic].byParent[parentFile].map((file, index) => (
                                            <React.Fragment key={file._id}>
                                                {index > 0 && <Divider />}
                                                <ListItem disablePadding>
                                                    <ListItemButton >  {/* onClick={() => navigate(`/excel/file/${file._id}`)} */}
                                                        <ListItemText 
                                                            primary={file.sheetName || `Sheet ${index + 1}`}
                                                            secondary={`Uploaded: ${formatDate(file.uploadDate)}`}
                                                        />
                                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                                            <Chip 
                                                                label="View File" 
                                                                icon={<TableViewIcon />} 
                                                                color="info" 
                                                                size="medium" 
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    navigate(`/excel/file/${file._id}`);
                                                                }}
                                                            />
                                                            {/* <Chip 
                                                                icon={<DownloadIcon />}
                                                                label="Download" 
                                                                color="secondary" 
                                                                size="small" 
                                                                onClick={(e) => handleDownload(file._id, file.fileName, e)}
                                                            /> */}
                                                        </Box>
                                                    </ListItemButton>
                                                </ListItem>
                                            </React.Fragment>
                                        ))}
                                    </List>
                                </Paper>
                            </Box>
                        ))}



{/* Singel Files view as 2nd option to view data */}
                        {/* {!loading && !error && filteredFiles.map(file => (
                            <Box key={file._id} sx={{ mb: 2 }}>
                                <Paper elevation={1}>
                                    <List>
                                        <ListItem disablePadding>
                                            <ListItemButton onClick={() => navigate(`/excel/file/${file._id}`)}>
                                                <ListItemText 
                                                    primary={file.fileName}
                                                    secondary={`Uploaded: ${formatDate(file.uploadDate)} | Sheets: ${file.sheetCount || 1}`}
                                                />
                                                <Chip 
                                                    icon={<DownloadIcon />}
                                                    label="Download" 
                                                    color="secondary" 
                                                    size="normal" 
                                                    onClick={(e) => handleDownload(file._id, file.fileName, e)}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Box>
                        ))} */}
                    </Box>
                ))}
            </Box>

        </Container>
    );
};

export default ExcelFilesList;