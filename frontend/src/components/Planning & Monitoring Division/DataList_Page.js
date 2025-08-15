import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button, Typography, Container,
    IconButton, TextField, Grid, Box, MenuItem, Chip
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    ArrowBack as ArrowBackIcon,
    Visibility as VisibilityIcon,
    Add as AddIcon,
    Search as SearchIcon,
    CloudUpload as CloudUploadIcon
} from "@mui/icons-material";

const LandList = () => {
    const navigate = useNavigate();
    const [lands, setLands] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState({
        Provinces: "",
        Districts: "",
        Divisional_secretariats: "",
        Land_ownership: "",
        Land_Area_of_Land: "",
        // Land_owner_name: ""
    });

    // Province and Districts arrays
    const provinces = [
        "Central Province",
        "Eastern Province",
        "North Central Province",
        "Northern Province",
        "North Western Province",
        "Sabaragamuwa Province",
        "Southern Province",
        "Uva Province",
        "Western Province",
    ];
    const districts = [
        "Ampara",
        "Anuradhapura",
        "Badulla",
        "Batticaloa",
        "Colombo",
        "Galle",
        "Gampaha",
        "Hambantota",
        "Jaffna",
        "Kalutara",
        "Kandy",
        "Kegalle",
        "Kilinochchi",
        "Kurunegala",
        "Mannar",
        "Matale",
        "Matara",
        "Monaragala",
        "Mullaitivu",
        "Nuwara Eliya",
        "Polonnaruwa",
        "Puttalam",
        "Ratnapura",
        "Trincomalee",
        "Vavuniya",
    ];
    const land_ownerships = ["Government", "Private Own"];


    useEffect(() => {
        const fetchLands = async () => {
            try {
                // Build query string from searchCriteria
                const queryParams = new URLSearchParams();
                Object.entries(searchCriteria).forEach(([key, value]) => {
                    if (value) queryParams.append(key, value);
                });

                const response = await axios.get(`/getALL/lands?${queryParams}`);
                setLands(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchLands();
    }, [searchCriteria]); // Re-fetch when search criteria changes

    // Handle search input changes
    const handleSearchChange = (event) => {
        const { name, value } = event.target;
        setSearchCriteria(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Handle delete action
    const handleDelete = (id) => {
        axios.delete(`/delete/land/${id}`)
            .then(() => {
                alert("Land deleted successfully!");
                setLands(lands.filter(land => land._id !== id));
            })
            .catch(err => console.error(err));
    };

    // Helper function to get section chips
    const getSectionChips = (land) => {
        const chips = [];
        if (land.formSections?.land) {
            chips.push(<Chip key="land" label="Land" color="primary" size="small" sx={{ mr: 0.5 }} />);
        }
        if (land.formSections?.social) {
            chips.push(<Chip key="social" label="Social" color="secondary" size="small" />);
        }
        return chips.length > 0 ? chips : <Chip label="Legacy" color="default" size="small" />;
    };

    // Handle back navigation
    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };


    return (
        <Container maxWidth="xl" sx={{ 
            background: 'linear-gradient(to right bottom,rgb(245, 220, 198),rgb(255, 140, 0))',
            minHeight: '100vh',
            py: 5,
        }}>

            {/* Search Section */}
            <Box sx={{ 
                mb: 4, mt: 3, p: 3, backgroundColor: 'white',
                border: '2px solid rgb(251, 58, 0)',
                borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>

                <Typography variant="h6" gutterBottom sx={{
                    color: 'rgb(251, 58, 0)',
                    display: 'flex', alignItems: 'center',      fontWeight: 'bold'
                }}>
                    <SearchIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Search
                </Typography>

                {/* Search Input Fields */}
                <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                        <TextField
                            select
                            fullWidth
                            label="Search by Province"
                            name="Provinces"
                            value={searchCriteria.Provinces}
                            onChange={handleSearchChange}
                            size="small"
                        >
                            <MenuItem value="">All Provinces</MenuItem>
                            {provinces.map((province) => (
                                <MenuItem key={province} value={province}>
                                    {province}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            select
                            fullWidth
                            label="Search by District"
                            name="Districts"
                            value={searchCriteria.Districts}
                            onChange={handleSearchChange}
                            size="small"
                        >
                            <MenuItem value="">All Districts</MenuItem>
                            {districts.map((district) => (
                                <MenuItem key={district} value={district}>
                                    {district}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            label="Search by Divisional Secretariat"
                            name="Divisional_secretariats"
                            value={searchCriteria.Divisional_secretariats}
                            onChange={handleSearchChange}
                            size="small"
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            select
                            fullWidth
                            label="Search by Land Ownership"
                            name="Land_ownership"
                            value={searchCriteria.Land_ownership}
                            onChange={handleSearchChange}
                            size="small"
                        >
                            <MenuItem value="">All Ownership Types</MenuItem>
                            {land_ownerships.map((ownership) => (
                                <MenuItem key={ownership} value={ownership}>
                                    {ownership}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            label="Search by Land Area"
                            name="Land_Area_of_Land"
                            value={searchCriteria.Land_Area_of_Land}
                            onChange={handleSearchChange}
                            size="small"
                            placeholder="e.g. 5, >10, <20, 10-50"
                            helperText="Enter area value or range (e.g., 5, >10, <20, 10-50)"
                        />
                    </Grid>
                </Grid>

                {/* Clear Search Button */}
                <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={() => setSearchCriteria({
                            Provinces: "",
                            Districts: "",
                            Divisional_secretariats: "",
                            Land_ownership: "",
                            Land_Area_of_Land: "",
                            // Land_owner_name: ""
                        })}
                        size="small"
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
                        Clear Search
                    </Button>
                </Box>

            </Box>

            {/* Create Action Button */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3, mt: 3 }}>

                <Button
                    variant="contained"
                    startIcon={<ArrowBackIcon />}
                    onClick={handleBack}
                    sx={{ 
                        backgroundColor: '#f44336',
                        color: 'white',
                        '&:hover': { 
                            backgroundColor: '#d32f2f',
                            transform: 'scale(1.05)'
                        },
                        transition: 'all 0.2s ease-in-out'
                    }}
                >
                    Back
                </Button>

                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/data/input"
                >
                    Create New Land
                </Button>
                
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<CloudUploadIcon />}
                    component={Link}
                    to="/upload/excelDocument"
                    sx={{ backgroundColor: '#4caf50' }}
                >
                    Upload Excel File
                </Button>
                
                <Button
                    variant="contained"
                    color="info"
                    startIcon={<VisibilityIcon />}
                    component={Link}
                    to="/excel/files"
                    sx={{ backgroundColor: '#2196f3' }}
                >
                    View Excel Data
                </Button>

            </Box>

            {/* Main Content */}
            <Box sx={{ 
                mb: 4, mt: 3, p: 3, backgroundColor: 'white',
                border: '1px solid rgb(251, 58, 0)',
                borderRadius: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}>

                <Typography variant="h4" component="h2" gutterBottom>
                    Land & Social Data List
                </Typography>

                {/* Land List Table */}  
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="land list table">

                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                {/* <TableCell sx={{ color: 'white' }}>Land ID</TableCell> */}
                                <TableCell sx={{ color: 'white' }}>Province</TableCell>
                                <TableCell sx={{ color: 'white' }}>District</TableCell>
                                <TableCell sx={{ color: 'white' }}>Divisional Secretariat</TableCell>
                                <TableCell sx={{ color: 'white' }}>GN Division</TableCell>
                                <TableCell sx={{ color: 'white' }}>Land Location</TableCell>
                                <TableCell sx={{ color: 'white' }}>Land Area</TableCell>
                                <TableCell sx={{ color: 'white' }}>Social Area</TableCell>
                                <TableCell sx={{ color: 'white' }}>Sections</TableCell>
                                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {lands.map((land) => (
                                <TableRow key={land._id} hover>
                                    {/* <TableCell sx={{ fontSize: '12px' }}>{land._id}</TableCell> */}
                                    <TableCell>{land.Provinces}</TableCell>
                                    <TableCell>{land.Districts}</TableCell>
                                    <TableCell>{land.Divisional_secretariats}</TableCell>
                                    <TableCell>
                                        {land.Land_Grama_Niladhari_Division || 
                                         land.Social_Grama_Niladhari_Division || 
                                         land.Grama_Niladhari_divisions || 
                                         'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {land.Land_location || 
                                         land.Land_address || 
                                         'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {land.Land_Area_of_Land ? 
                                            `${land.Land_Area_of_Land} ${land.Land_Area_of_Land_Unit}` : 
                                            land.Area_of_Land || 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {land.Social_Area_of_Land ? 
                                            `${land.Social_Area_of_Land} ${land.Social_Area_of_Land_Unit}` : 
                                            'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {getSectionChips(land)}
                                    </TableCell>

                                    {/* action buttons */}
                                    <TableCell>
                                        <IconButton
                                            component={Link}
                                            to={`/data/details/${land._id}`}
                                            color="info"
                                            size="small"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            to={`/edit/data/${land._id}`}
                                            color="warning"
                                            size="small"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(land._id)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                    
                                </TableRow>
                            ))}
                        </TableBody>

                    </Table>
                </TableContainer>
            </Box> 

        </Container>
    );
};

export default LandList;