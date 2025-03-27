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
    Button, Link, List,
    ListItem, ListItemIcon, ListItemText,
} from "@mui/material";
import {
    LocationOn,
    Description,
    Person,
    Phone,
    Email,
    CalendarToday,
    Business,
    Home, ArrowBack, PictureAsPdf,
    InsertDriveFile,
} from "@mui/icons-material";


const LandDetails = () => {
    const { id } = useParams();
    const [land, setLand] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/get/land/${id}`)
            .then(res => {
                setLand(res.data)
                console.log('Land data:', res.data)
            })
            .catch(err => console.error(err));
    }, [id]);

    // if (!land) return <p>Loading...</p>;
    if (!land) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );



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
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Land Images</Typography>
                        {land.Land_images && land.Land_images.length > 0 ? (
                            <Grid container spacing={2}>
                                {land.Land_images.map((image, index) => (
                                    <Grid item xs={6} key={index}>
                                        <Card elevation={2}>
                                            <CardMedia
                                                component="img"
                                                height="150"
                                                image={image}
                                                alt={`Land Photo ${index + 1}`}
                                                sx={{ objectFit: 'cover' }}
                                            />
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
                                <Typography color="textSecondary">No images available</Typography>
                            </Paper>
                        )}
                    </Grid>

                    {/* Land Documents */}
                    {/* <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Land Documents</Typography>
                        {land.Land_documents && land.Land_documents.length > 0 ? (
                            <List>
                                {land.Land_documents.map((doc, index) => (
                                    <ListItem key={index} 
                                        component={Paper} 
                                        sx={{ mb: 1, p: 1, borderRadius: 1 }}
                                    >
                                        <ListItemIcon>
                                            {doc.toLowerCase().endsWith('.pdf') 
                                                ? <PictureAsPdf color="error" /> 
                                                : <InsertDriveFile color="info" />
                                            }
                                        </ListItemIcon>
                                        <ListItemText 
                                            primary={doc.split('/').pop()} 
                                            secondary={
                                                <Link 
                                                    href={doc} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                >
                                                    View Document
                                                </Link>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
                                <Typography color="textSecondary">No documents available</Typography>
                            </Paper>
                        )}
                    </Grid> */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom>Land Documents</Typography>
                        {land.Land_documents && land.Land_documents.length > 0 ? (
                            <List>
                                {land.Land_documents.map((doc, index) => (
                                    <ListItem key={index} 
                                    component={Paper} 
                                    sx={{ mb: 1, p: 1, borderRadius: 1 }}
                                    >
                                    <ListItemIcon>
                                        {doc.toLowerCase().endsWith('.pdf') 
                                        ? <PictureAsPdf color="error" /> 
                                        : <InsertDriveFile color="info" />
                                        }
                                    </ListItemIcon>
                                    <ListItemText 
                                        primary={doc.split('/').pop()} 
                                        secondary={
                                        doc.toLowerCase().endsWith('.pdf') ? (
                                            <Link
                                            href={doc}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                window.open(doc, '_blank', 'noopener,noreferrer');
                                            }}
                                            sx={{
                                                cursor: 'pointer',
                                                textDecoration: 'none',
                                                '&:hover': {
                                                textDecoration: 'underline'
                                                }
                                            }}
                                            >
                                            View PDF
                                            </Link>
                                        ) : (
                                            <Link
                                            href={doc}
                                            download
                                            sx={{
                                                textDecoration: 'none',
                                                '&:hover': {
                                                textDecoration: 'underline'
                                                }
                                            }}
                                            >
                                            Download Document
                                            </Link>
                                        )
                                        }
                                    />
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
                            <Typography color="textSecondary">No documents available</Typography>
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
