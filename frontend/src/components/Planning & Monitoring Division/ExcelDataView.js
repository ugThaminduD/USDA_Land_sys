import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  Breadcrumbs,
  Link, Grid,
  Chip, MenuItem,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ListIcon from '@mui/icons-material/List';



const ExcelDataView = () => {
    const { id } = useParams(); // If viewing a specific file
    const [excelData, setExcelData] = useState([]);
    const [fileName, setFileName] = useState('');
    const [topic, setTopic] = useState('');
    const [uploadDate, setUploadDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [headers, setHeaders] = useState([]);
    const [sheetName, setSheetName] = useState(''); // For multi-sheet files
    const [parentFile, setParentFile] = useState(''); // For multi-sheet files
    const navigate = useNavigate();

    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDsDivision, setSelectedDsDivision] = useState('');

    // const districts = [...new Set(excelData.map(item => item.district))].filter(Boolean);
    // const provinces = [...new Set(excelData.map(item => item.province))].filter(Boolean);
    // const dsDivisions = [...new Set(excelData.map(item => item.dsDivision))].filter(Boolean);

    // Provinces, Districts, DS Divisions arrays
    const provinces = [
        "Central", "Eastern", "North Central",
        "Northern", "North Western", "Sabaragamuwa",
        "Southern", "Uva", "Western",
    ];
    const districts = [
        "Ampara", "Anuradhapura", "Badulla", "Batticaloa", "Colombo", "Galle",
        "Gampaha", "Hambantota", "Jaffna", "Kalutara", "Kandy", "Kegalle",
        "Kilinochchi", "Kurunegala", "Mannar", "Matale", "Matara", "Monaragala",
        "Mullaitivu", "Nuwara Eliya", "Polonnaruwa", "Puttalam",
        "Ratnapura", "Trincomalee", "Vavuniya",
    ];
    const ds_divisions = [
        "Colombo", "Sri Jayawarndanapura Kotte", "Dehiwala", "Maharagama", "Kesbewa", "Moratuwa", "Padukka", "Negambo", 
        "Kelaniya", "Minuwangoda", "Mahara", "Hambantota", "Pitabeddara", "Welipitiya",
        "Akmeemana", "Baddegama", "Balapitiya", "Ambalangoda", "Kamburupitiya", "Hakmana", "Angunukolapelessa", 
    ]




    useEffect(() => {
        const fetchExcelData = async () => {
        try {
            setLoading(true);
            
            let response;
            if (id) {
                // Fetch specific file data
                response = await axios.get(`/excel/file/${id}`);
                if (response.data.success) {
                    setExcelData(response.data.data || []);
                    setFileName(response.data.fileName || '');
                    setTopic(response.data.topic || '');
                    setSheetName(response.data.sheetName || '');
                    setParentFile(response.data.parentFile || '');
                    setUploadDate(response.data.uploadDate || null);
                }
            } else {
                // Fetch all data (backwards compatibility)
                response = await axios.get('/data');
                if (response.data.success) {
                    setExcelData(response.data.data || []);
                    setFileName('All Excel Data');
                }
            }
            
            // Extract headers
            if (response.data.success && 
                ((id && response.data.data && response.data.data.length > 0) || 
                (!id && response.data.data && response.data.data.length > 0))) {
                    // Use first item to determine headers
                    const firstItem = id ? response.data.data[0] : response.data.data[0];
                    if (firstItem) {
                        setHeaders(Object.keys(firstItem).filter(key => key !== '_id' && key !== '__v'));
                    }
            } else {
                if (!id) {
                    setError('No data found');
                }
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch Excel data');
        } finally {
            setLoading(false);
        }
        };

        fetchExcelData();
    }, [id]);

    // Filter function for search
    const filteredData = excelData.filter(item => {
        if (!searchTerm) return true;
        const searchTermLower = searchTerm.toLowerCase();
            
        // Search across all fields
        return Object.values(item).some(value => 
            value && value.toString().toLowerCase().includes(searchTermLower)
        );
        
    });

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
            py: 2,
        }}>

            <Box sx={{ 
                mb: 4, mt: 2, p: 3,
                backgroundColor: 'white',
                border: '1px solid rgb(251, 58, 0)',
                borderRadius: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>
                {/* Breadcrumbs navigation */}
                <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
                    <Link 
                        color="inherit" 
                        href="#" 
                        onClick={(e) => {
                        e.preventDefault();
                        navigate('/');
                        }}
                    >
                        Home
                    </Link>
                    <Link 
                        color="inherit" 
                        href="#" 
                        onClick={(e) => {
                        e.preventDefault();
                        navigate('/excel/files');
                        }}
                    >
                        Excel Files
                    </Link>
                    <Typography color="text.primary">{fileName}</Typography>
                </Breadcrumbs>

                <Typography variant="h4" component="h2" gutterBottom >
                    {fileName}
                </Typography>

                {/* File metadata when viewing a specific file */}
                {id && !loading && (
                    <Box sx={{ mb: 2 }}>
                        <Chip 
                            label={`Topic: ${topic}`} 
                            variant="outlined" 
                            sx={{ mr: 1, mb: 1 }} 
                        />
                        {sheetName && (
                            <Chip 
                                label={`Sheet: ${sheetName}`} 
                                variant="outlined"
                                color="info"
                                sx={{ mr: 1, mb: 1 }} 
                            />
                        )}
                        {parentFile && (
                            <Chip 
                                label={`From: ${parentFile}`} 
                                variant="outlined"
                                color="secondary"
                                sx={{ mr: 1, mb: 1 }} 
                            />
                        )}
                        {uploadDate && (
                            <Chip 
                                label={`Uploaded: ${formatDate(uploadDate)}`} 
                                variant="outlined"
                                sx={{ mb: 1 }}
                            />
                        )}
                    </Box>
                )}

                {/* Navigation and Action Buttons */}
                <Box sx={{ display: 'flex', gap: 2, mb: 3, borderBottom: '2px solid black', pb: 1 }}>
                    <Button
                        variant="outlined"
                        startIcon={<ArrowBackIcon />}
                        onClick={() => id ? navigate('/excel/files') : navigate('/')}
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
                        {id ? 'Back to Files List' : 'Back to Land List'}
                    </Button>
                
                    {!id && (
                        <Button
                            variant="outlined"
                            startIcon={<ListIcon />}
                            onClick={() => navigate('/excel/files')}
                        >
                            View Files List
                        </Button>
                    )}
                
                    <Button
                        variant="contained"
                        color="success"
                        startIcon={<CloudUploadIcon />}
                        onClick={() => navigate('/upload/excelDocument')}
                    >
                        Upload New Excel File
                    </Button>
                </Box>

                {/* Search Box Field */}
                <Box sx={{ 
                    mb: 4,  mt: 3, p: 3, // Add padding
                    // backgroundColor: 'rgba(255, 140, 0, 0.1)', // Light orange background
                    backgroundColor: 'white',
                    border: '2px solid rgb(251, 58, 0)', // Orange border
                    borderRadius: 2, // Rounded corners
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow
                }}>

                    <Typography variant="h6" gutterBottom sx={{
                        mb: 2, display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold'
                    }}>
                        <SearchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Search
                    </Typography>

                    {/* Provinces, Districts, Ds Divisions search dropdown */}
                    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField
                            select
                            label="Province"
                            name='Provinces'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            fullWidth
                            size="small"
                            // sx={{ minWidth: 350 }}
                        >
                            <MenuItem value="">All Provinces</MenuItem>
                            {provinces.map((province) => (
                                <MenuItem key={province} value={province}>
                                    {province}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select 
                            label="District"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            fullWidth
                            size="small"
                            // sx={{ minWidth: 350 }}
                        >
                            <MenuItem value="">All Districts</MenuItem>
                            {districts.map((district) => (
                                <MenuItem key={district} value={district}>
                                    {district}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            select 
                            label="DS Division"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            variant="outlined"
                            fullWidth
                            size="small"
                            // sx={{ minWidth: 350 }}
                        >
                            <MenuItem value="">All Districts</MenuItem>
                            {ds_divisions.map((ds_division) => (
                                <MenuItem key={ds_division} value={ds_division}>
                                    {ds_division}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>

                    {/* search input bar */}
                    <TextField
                        fullWidth
                        variant="outlined"
                        placeholder="Search in any field..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        size="small"
                        // sx={{ mb: 3 }}
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

                {/* Data Table */}
                {!loading && !error && headers.length > 0 && (
                <TableContainer component={Paper} elevation={3} sx={{ maxHeight: 'calc(150vh - 300px)', overflow: 'auto' }}>
                    <Table stickyHeader aria-label="excel data table">

                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                {headers.map((header, index) => (
                                    <TableCell 
                                        key={index} 
                                        sx={{ 
                                            backgroundColor: '#1976d2',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            position: 'sticky',
                                            top: 0,
                                            zIndex: 1
                                        }}
                                    >
                                        {header}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {filteredData.length > 0 ? (
                                filteredData.map((row, rowIndex) => (
                                    <TableRow key={rowIndex} hover>
                                        {headers.map((header, cellIndex) => (
                                            <TableCell key={cellIndex}>
                                                {row[header] !== undefined ? row[header].toString() : ''}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={headers.length} align="center">
                                        No matching data found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>

                    </Table>
                </TableContainer>
                )}
                
                {!loading && !error && headers.length === 0 && (
                    <Alert severity="info">
                        No Excel data available. Please upload an Excel file first.
                    </Alert>
                )}
            </Box>

        </Container>
    );
};

export default ExcelDataView;