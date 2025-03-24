import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Paper,
    Typography,
    Grid,
    Divider,
    Box,
    Card,
    CardMedia,
    CircularProgress,
    Chip,
    Stack,
    Button
} from "@mui/material";
import {
    LocationOn,
    Description,
    Person,
    Phone,
    Email,
    CalendarToday,
    Business,
    Home, ArrowBack
} from "@mui/icons-material";


const LandDetails = () => {
    const { id } = useParams();
    const [land, setLand] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/get/land/${id}`)
            .then(res => setLand(res.data))
            .catch(err => console.error(err));
    }, [id]);

    // if (!land) return <p>Loading...</p>;
    if (!land) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );

    // return (
    //     <div>
    //         <h2>Land Location</h2>
    //         <p><strong>Province:</strong> {land.Provinces}</p>
    //         <p><strong>District:</strong> {land.Districts}</p>
    //         <p><strong>Divisional Secretariat:</strong> {land.Divisional_secretariats}</p>
    //         <p><strong>Grama Niladhari Division:</strong> {land.Grama_Niladhari_divisions}</p>

    //         <h3>Land Details</h3>
    //         <p><strong>Land Address:</strong> {land.Land_address || "Not provided"}</p>
    //         <p><strong>Land Location:</strong> {land.Land_location}</p>
    //         <p><strong>Area of Land:</strong> {land.Area_of_Land}</p>
    //         <p><strong>Description:</strong> {land.Land_description}</p>
    //         <p><strong>Land Image:</strong> {land.Land_image ? <img src={land.Land_image} alt="Land Photos" /> : "No image available"}</p>

    //         <h3>Local Agent</h3>
    //         <p><strong>Local Agent Name:</strong> {land.local_employee_name}</p>
    //         <p><strong>Local Agent Phone:</strong> {land.local_employee_phone_number}</p>

    //         <h3>USDA Entry Details</h3>
    //         <p><strong>USDA Entry Employee Name:</strong> {land.USDA_Entry_employee_name}</p>
    //         <p><strong>Day of Entry:</strong> {new Date(land.Day_of_Entry).toLocaleDateString()}</p>

    //         <h3>Owner Details</h3>
    //         <p><strong>Land Ownership:</strong> {land.Land_ownership}</p>
    //         <p><strong>Land Owner Name:</strong> {land.Land_owner_name}</p>
    //         <p><strong>Land Owner Address:</strong> {land.Land_owner_address}</p>
    //         <p><strong>Owner Email:</strong> {land.email}</p>
    //         <p><strong>Owner Phone:</strong> {land.phone_number}</p>

    //         <p><strong>Last Updated:</strong> {new Date(land.updatedAt).toLocaleDateString()}</p>
    //         <p><strong>Created On:</strong> {new Date(land.createdAt).toLocaleDateString()}</p>
    //     </div>
    // );


    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>

            {/* Add the back button */}
            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/')}
                sx={{ 
                mb: 3,
                color: 'black',
                borderColor: 'black',
                backgroundColor: 'rgba(255, 94, 0, 0.5)',
                '&:hover': {
                  borderColor: 'primary.dark',
                  backgroundColor: 'rgba(255, 0, 0, 0.82)'
                }
              }}
            >
                Back to Home
            </Button>

            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" gutterBottom color="primary">
                    Land Details
                </Typography>

                <Grid container spacing={4}>

                    {/* Location Information */}
                    <Grid item xs={12}>
                        <Box mb={3}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LocationOn color="primary" /> Location Information
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" color="textSecondary">Province</Typography>
                                    <Typography variant="body1">{land.Provinces}</Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" color="textSecondary">District</Typography>
                                    <Typography variant="body1">{land.Districts}</Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" color="textSecondary">Divisional Secretariat</Typography>
                                    <Typography variant="body1">{land.Divisional_secretariats}</Typography>
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <Typography variant="subtitle2" color="textSecondary">Grama Niladhari Division</Typography>
                                    <Typography variant="body1">{land.Grama_Niladhari_divisions}</Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>

                    {/* Land Details */}
                    <Grid item xs={12} md={8}>
                        <Box mb={3}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Description color="primary" /> Land Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Land Address</Typography>
                                    <Typography variant="body1">{land.Land_address || "Not provided"}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Land Location</Typography>
                                    <Typography variant="body1">{land.Land_location}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Area of Land</Typography>
                                    <Chip label={land.Area_of_Land} color="primary" variant="outlined" />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Description</Typography>
                                    <Typography variant="body1">{land.Land_description}</Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Land Image */}
                    <Grid item xs={12} md={4}>
                        {land.Land_image ? (
                            <Card elevation={2}>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image={land.Land_image}
                                    alt="Land Photos"
                                    sx={{ objectFit: 'cover' }}
                                />
                            </Card>
                        ) : (
                            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
                                <Typography color="textSecondary">No image available</Typography>
                            </Paper>
                        )}
                    </Grid>

                    {/* Local Agent & USDA Details */}
                    <Grid item xs={12} md={6}>
                        <Box mb={3}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Person color="primary" /> Local Agent
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Name</Typography>
                                    <Typography variant="body1">{land.local_employee_name}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Phone</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Phone fontSize="small" /> {land.local_employee_phone_number}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Owner Details */}
                    <Grid item xs={12} md={6}>
                        <Box mb={3}>
                            <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Business color="primary" /> Owner Details
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Ownership Type</Typography>
                                    <Chip label={land.Land_ownership} color="secondary" />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Owner Name</Typography>
                                    <Typography variant="body1">{land.Land_owner_name}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="subtitle2" color="textSecondary">Contact Information</Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Email fontSize="small" /> {land.email}
                                    </Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Phone fontSize="small" /> {land.phone_number}
                                    </Typography>
                                    <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Home fontSize="small" /> {land.Land_owner_address}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Box>
                    </Grid>

                    {/* Timestamps */}
                    <Grid item xs={12}>
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" spacing={4} justifyContent="flex-end">
                            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday fontSize="small" /> Created: {new Date(land.createdAt).toLocaleDateString()}
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <CalendarToday fontSize="small" /> Last Updated: {new Date(land.updatedAt).toLocaleDateString()}
                            </Typography>
                        </Stack>
                    </Grid>

                </Grid>
            </Paper>

        </Container>
    );


};

export default LandDetails;
