import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Container, Paper, Typography, Grid, Divider, Box,
    Card, CardMedia, CircularProgress, Chip, Stack, Button,
    Link, List, ListItem, ListItemIcon, ListItemText, Accordion,
    AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, 
} from "@mui/material";
import {
    LocationOn, Description,
    Person, Phone, Email, CalendarToday,
    Business, Home, ArrowBack, PictureAsPdf,
    InsertDriveFile, ExpandMore,
    People, Assessment, Landscape, PhotoLibrary,
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

    if (!land) return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
            <CircularProgress />
        </Box>
    );

    // Helper function to render image gallery
    const renderImageGallery = (images, title) => {
        if (!images || images.length === 0) {
            return (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
                    <Typography color="textSecondary">No {title.toLowerCase()} available</Typography>
                </Paper>
            );
        }

        return (
            <Grid container spacing={2}>
                {images.map((image, index) => (
                    <Grid item xs={6} md={4} key={index}>
                        <Card elevation={2}>
                            <CardMedia
                                component="img"
                                height="200"
                                image={image}
                                alt={`${title} ${index + 1}`}
                                sx={{ objectFit: 'cover', cursor: 'pointer' }}
                                onClick={() => window.open(image, '_blank')}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>
        );
    };

    // Helper function to render document list
    const renderDocumentList = (documents, title) => {
        if (!documents || documents.length === 0) {
            return (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
                    <Typography color="textSecondary">No {title.toLowerCase()} available</Typography>
                </Paper>
            );
        }

        return (
            <List>
                {documents.map((doc, index) => (
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
        );
    };

    // Helper function to render housing statistics
    const renderHousingStats = () => {
        const housingData = [
            { type: 'Shanty Housing', units: land.Shanty_Housing_Units, families: land.Families_in_Shanties },
            { type: 'Slum Housing', units: land.Slum_Housing_Units, families: land.Families_in_Slums },
            { type: 'Line Room Housing', units: land.Line_Room_Housing_Units, families: land.Families_in_Line_Rooms },
            { type: 'Scattered Housing', units: land.Scattered_Housing_Units, families: land.Families_in_Scattered_Housing },
            { type: 'Vulnerable Housing', units: land.Vulnerable_Housing_Units, families: land.Families_in_Vulnerable_Housing },
            { type: 'Other Housing', units: land.Other_Housing_Units, families: land.Families_in_Other_Housing },
        ].filter(item => item.units || item.families);

        if (housingData.length === 0) {
            return (
                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.100' }}>
                    <Typography color="textSecondary">No housing data available</Typography>
                </Paper>
            );
        }

        return (
            <TableContainer component={Paper} elevation={1}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'primary.main' }}>
                            <TableCell sx={{ color: 'white' }}>Housing Type</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Units</TableCell>
                            <TableCell sx={{ color: 'white' }} align="right">Families</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {housingData.map((row, index) => (
                            <TableRow key={index} hover>
                                <TableCell>{row.type}</TableCell>
                                <TableCell align="right">{row.units || 'N/A'}</TableCell>
                                <TableCell align="right">{row.families || 'N/A'}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    
    return (
        <Container maxWidth="xl" sx={{ 
            py: 4, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            minHeight: '100vh' 
        }}>
            {/* Back button */}
            <Button
                variant="outlined"
                startIcon={<ArrowBack />}
                onClick={() => navigate('/data/list')}
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

            <Paper elevation={3} sx={{ p: 4, backgroundColor: '#ffffff' }}>

                {/* Title and Section Chips in horizontal line */}           
                <Box sx={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    mb: 3, flexWrap: 'wrap', gap: 8, p: 3, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2,color: 'white'
                }}>
                    <Typography variant="h4" color="primary" sx={{ m: 0, color: 'white', fontWeight: 'bold' }} >
                        Land & Social Details
                    </Typography>
                    
                    {/* Show which sections are available */}
                    <Stack direction="row" spacing={1}>
                        {land.formSections?.land && <Chip label="Land Details Available" color="primary" fontWeight="bold" />}
                        {land.formSections?.social && <Chip label="Social Details Available" color="secondary" fontWeight="bold" />}
                        {!land.formSections?.land && !land.formSections?.social && <Chip label="Legacy Data" color="default" fontWeight="bold" />}
                    </Stack>
                </Box>  

                {/* Location Information */}
                <Accordion 
                    defaultExpanded 
                    sx={{ 
                        mb: 2,
                        background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                        '&:before': {
                            display: 'none',
                        },
                        borderRadius: '8px !important',
                        overflow: 'hidden'
                    }}
                >
                    <AccordionSummary 
                        expandIcon={<ExpandMore />}
                        sx={{ 
                            backgroundColor: '#ff7043',
                            color: 'white',
                            '& .MuiAccordionSummary-expandIconWrapper': {
                                color: 'white'
                            }
                        }}
                    >
                        <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                            <LocationOn /> Location Information
                        </Typography>
                    </AccordionSummary>
                    
                    <AccordionDetails sx={{ backgroundColor: '#fff3e0', p: 3 }}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={3}>
                                <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderLeft: '4px solid #ff5722' }}>
                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Province</Typography>
                                    <Typography variant="h6" color="primary">{land.Provinces}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderLeft: '4px solid #ff5722' }}>
                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>District</Typography>
                                    <Typography variant="h6" color="primary">{land.Districts}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderLeft: '4px solid #ff5722' }}>
                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Divisional Secretariat</Typography>
                                    <Typography variant="h6" color="primary">{land.Divisional_secretariats}</Typography>
                                </Paper>
                            </Grid>
                            <Grid item xs={12} md={3}>
                                <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderLeft: '4px solid #ff5722' }}>
                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>GN Division</Typography>
                                    <Typography variant="h6" color="primary">
                                        {land.Land_Grama_Niladhari_Division || 
                                         land.Social_Grama_Niladhari_Division || 
                                         land.Grama_Niladhari_divisions || 
                                         'N/A'}
                                    </Typography>
                                </Paper>
                            </Grid>
                        </Grid>
                    </AccordionDetails>
                </Accordion>

                {/* Land Details Section */}
                {land.formSections?.land && (
                    <Accordion 
                        sx={{ 
                            mb: 2,
                            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                            '&:before': {
                                display: 'none',
                            },
                            borderRadius: '8px !important',
                            overflow: 'hidden'
                        }}
                    >
                        <AccordionSummary 
                            expandIcon={<ExpandMore />}
                            sx={{ 
                                backgroundColor: '#4caf50',
                                color: 'white',
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    color: 'white'
                                }
                            }}
                        >
                            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                                <Landscape /> Land Details
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ backgroundColor: '#e8f5e8', p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Basic Land Information */}
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                                            Basic Information
                                        </Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#4caf50' }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Land Address</Typography>
                                                    <Typography variant="body1">{land.Land_address || "Not provided"}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Land Location</Typography>
                                                    <Typography variant="body1">{land.Land_location || "Not provided"}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Area of Land</Typography>
                                                    <Chip 
                                                        label={`${land.Land_Area_of_Land} ${land.Land_Area_of_Land_Unit}`} 
                                                        sx={{ backgroundColor: '#4caf50', color: 'white', fontWeight: 'bold' }}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Current Use</Typography>
                                                    <Typography variant="body1">{land.Land_current_use || "Not specified"}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={12}>
                                                <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Description</Typography>
                                                    <Typography variant="body1">{land.Land_description || "No description provided"}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* Local Employee Details */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2, height: 'fit-content' }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2e7d32', fontWeight: 'bold' }}>
                                            <Person /> Local Employee Details
                                        </Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#4caf50' }} />
                                        <Stack spacing={2}>
                                            <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Name</Typography>
                                                <Typography variant="body1">{land.local_employee_name || "N/A"}</Typography>
                                            </Box>
                                            <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Phone</Typography>
                                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Phone fontSize="small" /> {land.local_employee_phone_number || "N/A"}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Email</Typography>
                                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Email fontSize="small" /> {land.local_employee_email || "N/A"}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Day of Entry</Typography>
                                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <CalendarToday fontSize="small" /> 
                                                    {land.Day_of_Entry ? new Date(land.Day_of_Entry).toLocaleDateString() : "N/A"}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>

                                {/* Owner Details */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2, height: 'fit-content' }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2e7d32', fontWeight: 'bold' }}>
                                            <Business /> Owner Details
                                        </Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#4caf50' }} />
                                        <Stack spacing={2}>
                                            <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Ownership Type</Typography>
                                                <Chip label={land.Land_ownership} sx={{ backgroundColor: '#ff9800', color: 'white' }} />
                                            </Box>
                                            <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Owner Name</Typography>
                                                <Typography variant="body1">{land.Land_owner_name}</Typography>
                                            </Box>
                                            <Box sx={{ p: 2, backgroundColor: '#f1f8e9', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Contact Information</Typography>
                                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Email fontSize="small" /> {land.email || "N/A"}
                                                </Typography>
                                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                    <Phone fontSize="small" /> {land.phone_number || "N/A"}
                                                </Typography>
                                                <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <Home fontSize="small" /> {land.Land_owner_address || "N/A"}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>

                                {/* Land Images */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#2e7d32', fontWeight: 'bold' }}>
                                            <PhotoLibrary /> Land Images
                                        </Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#4caf50' }} />
                                        {renderImageGallery(land.Land_images, "Land Images")}
                                    </Paper>
                                </Grid>

                                {/* Land Documents */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#2e7d32', fontWeight: 'bold' }}>Land Documents</Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#4caf50' }} />
                                        {renderDocumentList(land.Land_documents, "Land Documents")}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Social Details Section */}
                {land.formSections?.social && (
                    <Accordion 
                        sx={{ 
                            mb: 2,
                            background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
                            '&:before': {
                                display: 'none',
                            },
                            borderRadius: '8px !important',
                            overflow: 'hidden'
                        }}
                    >
                        <AccordionSummary 
                            expandIcon={<ExpandMore />}
                            sx={{ 
                                backgroundColor: '#ff9800',
                                color: 'white',
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    color: 'white'
                                }
                            }}
                        >
                            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                                <People /> Social Details
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ backgroundColor: '#fff3e0', p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Population Statistics */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#f57c00', fontWeight: 'bold' }}>Population Statistics</Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#ff9800' }} />
                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1, textAlign: 'center' }}>
                                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Total Population</Typography>
                                                    <Chip label={land.Total_Population || 0} sx={{ backgroundColor: '#ff9800', color: 'white', fontWeight: 'bold' }} />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1, textAlign: 'center' }}>
                                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Total Families</Typography>
                                                    <Chip label={land.Total_Families || 0} sx={{ backgroundColor: '#e91e63', color: 'white', fontWeight: 'bold' }} />
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1, textAlign: 'center' }}>
                                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Male Population</Typography>
                                                    <Typography variant="h6" color="primary">{land.Total_Male_Population || 0}</Typography>
                                                </Box>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1, textAlign: 'center' }}>
                                                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Female Population</Typography>
                                                    <Typography variant="h6" color="secondary">{land.Total_Female_Population || 0}</Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* Land Area Information */}
                                {/* <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2, height: 'fit-content' }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#f57c00', fontWeight: 'bold' }}>Land Information</Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#ff9800' }} />
                                        <Stack spacing={2}>
                                            <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Social Area of Land</Typography>
                                                <Chip 
                                                    label={`${land.Social_Area_of_Land} ${land.Social_Area_of_Land_Unit}`} 
                                                    sx={{ backgroundColor: '#ff9800', color: 'white', fontWeight: 'bold' }}
                                                />
                                            </Box>
                                            <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Land Extent</Typography>
                                                <Typography variant="body1">{land.Land_Extent || "N/A"}</Typography>
                                            </Box>
                                            <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Land Lot Details</Typography>
                                                <Typography variant="body1">{land.Land_Lot_Details || "N/A"}</Typography>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid> */}

<Grid item xs={12} md={6}>
    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2, height: 'fit-content' }}>
        <Typography variant="h6" gutterBottom sx={{ color: '#f57c00', fontWeight: 'bold' }}>Land Information</Typography>
        <Divider sx={{ mb: 2, borderColor: '#ff9800' }} />
        <Stack spacing={2}>
            {/* Display land entries if they exist */}
            {land.landEntries && land.landEntries.length > 0 ? (
                <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                    <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold', mb: 1 }}>Land Entries</Typography>
                    {land.landEntries.map((entry, index) => (
                        <Box key={index} sx={{ mb: 1, p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
                            <Typography variant="body2">
                                <strong>Area:</strong> {entry.landArea} {entry.landAreaUnit}
                            </Typography>
                            {entry.landLocation && (
                                <Typography variant="body2">
                                    <strong>Location:</strong> {entry.landLocation}
                                </Typography>
                            )}
                            {entry.ownership && (
                                <Typography variant="body2">
                                    <strong>Ownership:</strong> {entry.ownership}
                                </Typography>
                            )}
                            {entry.companyName && (
                                <Typography variant="body2">
                                    <strong>Company/Owner:</strong> {entry.companyName}
                                </Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            ) : (
                <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                    <Typography variant="body2" color="textSecondary">No land entries available</Typography>
                </Box>
            )}
            
            <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Land Extent</Typography>
                <Typography variant="body1">{land.Land_Extent || "N/A"}</Typography>
            </Box>
            <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Land Lot Details</Typography>
                <Typography variant="body1">{land.Land_Lot_Details || "N/A"}</Typography>
            </Box>
        </Stack>
    </Paper>
</Grid>


                                {/* Housing Statistics */}
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#f57c00', fontWeight: 'bold' }}>Housing Statistics</Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#ff9800' }} />
                                        {renderHousingStats()}
                                    </Paper>
                                </Grid>

                                {/* Assessment Information */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#f57c00', fontWeight: 'bold' }}>
                                            <Assessment /> Assessment
                                        </Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#ff9800' }} />
                                        <Stack spacing={2}>
                                            <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Vulnerability Index</Typography>
                                                <Chip 
                                                    label={land.Vulnerability_Index || "Not assessed"} 
                                                    sx={{
                                                        backgroundColor: 
                                                            land.Vulnerability_Index === 'Critical' ? '#f44336' :
                                                            land.Vulnerability_Index === 'High' ? '#ff9800' :
                                                            land.Vulnerability_Index === 'Moderate' ? '#2196f3' :
                                                            '#4caf50',
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </Box>
                                            <Box sx={{ p: 2, backgroundColor: '#fff8e1', borderRadius: 1 }}>
                                                <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Livability Condition</Typography>
                                                <Chip 
                                                    label={land.Livability_Condition || "Not assessed"} 
                                                    sx={{
                                                        backgroundColor: 
                                                            land.Livability_Condition === 'Critical' || land.Livability_Condition === 'Poor' ? '#f44336' :
                                                            land.Livability_Condition === 'Moderate' ? '#ff9800' :
                                                            '#4caf50',
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </Box>
                                        </Stack>
                                    </Paper>
                                </Grid>

                                {/* Additional Notes */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#f57c00', fontWeight: 'bold' }}>Additional Notes</Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#ff9800' }} />
                                        <Paper sx={{ p: 2, bgcolor: '#fff8e1', borderRadius: 1 }}>
                                            <Typography variant="body1">
                                                {land.Additional_Notes || "No additional notes provided"}
                                            </Typography>
                                        </Paper>
                                    </Paper>
                                </Grid>

                                {/* Social Images */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: '#f57c00', fontWeight: 'bold' }}>
                                            <PhotoLibrary /> Social Images
                                        </Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#ff9800' }} />
                                        {renderImageGallery(land.Social_images, "Social Images")}
                                    </Paper>
                                </Grid>

                                {/* Social Documents */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 3, backgroundColor: '#ffffff', borderRadius: 2, boxShadow: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ color: '#f57c00', fontWeight: 'bold' }}>Social Documents</Typography>
                                        <Divider sx={{ mb: 2, borderColor: '#ff9800' }} />
                                        {renderDocumentList(land.Social_documents, "Social Documents")}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                )}

                {/* Legacy Data Section (for old records) */}
                {!land.formSections?.land && !land.formSections?.social && (
                    <Accordion 
                        sx={{ 
                            mb: 2,
                            background: 'linear-gradient(135deg, #d7d2cc 0%, #304352 100%)',
                            '&:before': {
                                display: 'none',
                            },
                            borderRadius: '8px !important',
                            overflow: 'hidden'
                        }}
                    >
                        <AccordionSummary 
                            expandIcon={<ExpandMore />}
                            sx={{ 
                                backgroundColor: '#616161',
                                color: 'white',
                                '& .MuiAccordionSummary-expandIconWrapper': {
                                    color: 'white'
                                }
                            }}
                        >
                            <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
                                <Description /> Legacy Data
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails sx={{ backgroundColor: '#f5f5f5', p: 3 }}>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderLeft: '4px solid #616161' }}>
                                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>Area of Land</Typography>
                                        <Typography variant="body1">{land.Area_of_Land || "N/A"}</Typography>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, backgroundColor: '#ffffff', borderLeft: '4px solid #616161' }}>
                                        <Typography variant="subtitle2" color="textSecondary" sx={{ fontWeight: 'bold' }}>USDA Employee Name</Typography>
                                        <Typography variant="body1">{land.USDA_Entry_employee_name || "N/A"}</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </AccordionDetails>
                    </Accordion>
                )}
 
                {/* Timestamps */}
                <Box sx={{ 
                    mt: 4,  pt: 2, 
                    borderTop: '2px solid', 
                    borderColor: '#e0e0e0',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 2, p: 2
                }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={4} justifyContent="flex-end">
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white', fontWeight: 'bold' }}>
                            <CalendarToday fontSize="small" /> Created: {new Date(land.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white', fontWeight: 'bold' }}>
                            <CalendarToday fontSize="small" /> Last Updated: {new Date(land.updatedAt).toLocaleDateString()}
                        </Typography>
                    </Stack>
                </Box>

            </Paper>
        </Container>
    );
};

export default LandDetails;