import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Typography,
    Container,
    IconButton,
    TextField,
    Grid,
    Box,
    MenuItem
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";



const LandList = () => {
    const [lands, setLands] = useState([]);
    const [searchCriteria, setSearchCriteria] = useState({
        Provinces: "",
        Districts: "",
        Divisional_secretariats: "",
        Land_ownership: "",
        Land_owner_name: ""
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



    return (
        <Container maxWidth="xl" sx={{ 
            // backgroundColor: '#eef2f6', // Light grey background
            background: 'linear-gradient(to right bottom,rgb(245, 220, 198),rgb(255, 140, 0))',
            minHeight: '100vh',
            py: 5,
        }}>

            {/* Search Section */}
            <Box sx={{ 
                mb: 4, 
                mt: 3, 
                p: 3, // Add padding
                // backgroundColor: 'rgba(255, 140, 0, 0.1)', // Light orange background
                backgroundColor: 'white',
                border: '2px solid rgb(251, 58, 0)', // Orange border
                borderRadius: 2, // Rounded corners
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow
            }}>

                <Typography variant="h6" gutterBottom sx={{
                    color: 'rgb(251, 58, 0)',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold'
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
                            label="Search by Land Owner Name"
                            name="Land_owner_name"
                            value={searchCriteria.Land_owner_name}
                            onChange={handleSearchChange}
                            size="small"
                        />
                    </Grid>
                </Grid>

                {/* Clear Search Button */}
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="outlined"
                        onClick={() => setSearchCriteria({
                            Provinces: "",
                            Districts: "",
                            Divisional_secretariats: "",
                            Land_ownership: "",
                            Land_owner_name: ""
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
                    color="primary"
                    startIcon={<AddIcon />}
                    component={Link}
                    to="/input"
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


            <Box sx={{ 
                mb: 4, 
                mt: 3, 
                p: 3, // Add padding
                backgroundColor: 'white',
                border: '1px solid rgb(251, 58, 0)', // Orange border
                borderRadius: 2, // Rounded corners
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)', // Subtle shadow
            }}>

                <Typography variant="h4" component="h2" gutterBottom>
                    Land Registered List
                </Typography>

                {/* Land List Table */}  
                <TableContainer component={Paper} elevation={3}>
                    <Table sx={{ minWidth: 650 }} aria-label="land list table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white' }}>Land ID</TableCell>
                                <TableCell sx={{ color: 'white' }}>Province</TableCell>
                                <TableCell sx={{ color: 'white' }}>District</TableCell>
                                <TableCell sx={{ color: 'white' }}>Divisional Secretariat</TableCell>
                                <TableCell sx={{ color: 'white' }}>Grama Niladhari Division</TableCell>
                                <TableCell sx={{ color: 'white' }}>Land Location</TableCell>
                                <TableCell sx={{ color: 'white' }}>Area of Land</TableCell>
                                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {lands.map((land) => (
                                <TableRow key={land._id} hover>
                                    <TableCell>{land._id}</TableCell>
                                    <TableCell>{land.Provinces}</TableCell>
                                    <TableCell>{land.Districts}</TableCell>
                                    <TableCell>{land.Divisional_secretariats}</TableCell>
                                    <TableCell>{land.Grama_Niladhari_divisions}</TableCell>
                                    <TableCell>{land.Land_location}</TableCell>
                                    <TableCell>{land.Area_of_Land}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            component={Link}
                                            to={`/land/${land._id}`}
                                            color="info"
                                            size="small"
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton
                                            component={Link}
                                            to={`/edit/land/${land._id}`}
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
