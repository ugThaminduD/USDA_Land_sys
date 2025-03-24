import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Container,
  Typography,
  Stack, Alert, Snackbar, IconButton
} from "@mui/material";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CloudUpload } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "axios";

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const LandInput = () => {

  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });
  const [errors, setErrors] = useState({
    email: "",
    phone_number: ""
  });
  const [formData, setFormData] = useState({
    Provinces: "",
    Districts: "",
    Divisional_secretariats: "",
    Grama_Niladhari_divisions: "",

    Land_address: "",
    Land_location: "",
    Area_of_Land: "",
    Land_description: "",

    local_employee_name: "",
    local_employee_phone_number: "",

    USDA_Entry_employee_name: "",
    Day_of_Entry: "",

    Land_ownership: "",
    Land_owner_name: "",
    Land_owner_address: "",
    email: "",
    phone_number: "",
  });


  // Add useEffect to fetch land data if id exists
  useEffect(() => {
    if (id) {
      setIsLoading(true);
      axios.get(`/get/land/${id}`)
        .then(res => {
          setFormData(res.data);
          setToast({
            open: true,
            message: "Land details loaded successfully",
            severity: "info"
          });
        })
        .catch(err => {
          console.error("Error fetching land details:", err);
          setToast({
            open: true,
            message: "Failed to load land details",
            severity: "error"
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]); 

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    setErrors(prev => ({
      ...prev,
      [name]: ""
    }));

    // Validate on change
    if (name === "email" && value) {
      if (!validateEmail(value)) {
        setErrors(prev => ({
          ...prev,
          email: "Please enter a valid email address"
        }));
      }
    }
    if (name === "phone_number" && value) {
      if (!validatePhone(value)) {
        setErrors(prev => ({
          ...prev,
          phone_number: "Please enter a valid 10-digit phone number"
        }));
      }
    }
  };

  // Handle image change
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);
    setSelectedImages(prev => [...prev, ...files]);
    
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  // Handle remove image
  const handleRemoveImage = (index) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submission
    const validationErrors = {};
        
    if (formData.email && !validateEmail(formData.email)) {
        validationErrors.email = "Please enter a valid email address";
    }
    
    if (formData.phone_number && !validatePhone(formData.phone_number)) {
        validationErrors.phone_number = "Please enter a valid 10-digit phone number";
    }

    // If there are validation errors, show them and stop submission
    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setToast({
            open: true,
            message: "Please fix the validation errors before submitting",
            severity: "error"
        });
        return;
    }

    setIsLoading(true);

    try {

      let imageUrls = formData.Land_images || []; // Keep existing images

      // Upload new images if any are selected
      if (selectedImages.length > 0) {
        const formData = new FormData();
        selectedImages.forEach(image => {
            formData.append('images', image);
        });
        
        try {
          const uploadResponse = await axios.post('/upload/images', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
          imageUrls = [...imageUrls, ...uploadResponse.data.imageUrls];
        } catch (error) {
          console.error('Error uploading images:', error);
          setToast({
            open: true,
            message: "Failed to upload images. Please try again.",
            severity: "error"
          });
          return;
        }
      }

      // Format the date properly
      const formattedData = {
        ...formData,
        Day_of_Entry: new Date(formData.Day_of_Entry).toISOString(),
        Land_images: imageUrls
      };

      // Choose API endpoint based on whether we're updating or creating
      const apiCall = id
        ? axios.put(`/update/land/${id}`, formattedData)
        : axios.post("/add", formattedData);

      const response = await apiCall;

      if (response.status >= 200 && response.status < 300) {
        // alert("Land details have been successfully saved!");
        setToast({
          open: true,
          message: id 
            ? "Land details have been successfully updated!" 
            : "Land details have been successfully saved!",
          severity: "success"
        });
        
        // Add navigation after successful submission
        setTimeout(() => {
          if (id) {
              navigate('/'); // For updates, go to list page
          } else {
              setFormData({
                  Provinces: "",
                  Districts: "",
                  Divisional_secretariats: "",
                  Grama_Niladhari_divisions: "",
                  Land_address: "",
                  Land_location: "",
                  Area_of_Land: "",
                  Land_description: "",
                  local_employee_name: "",
                  local_employee_phone_number: "",
                  USDA_Entry_employee_name: "",
                  Day_of_Entry: "",
                  Land_ownership: "",
                  Land_owner_name: "",
                  Land_owner_address: "",
                  email: "",
                  phone_number: "",
              });
              // navigate('/'); // For new entries, go to list page
          }
        }, 1500); // Wait 1.5 seconds to show the success message before navigating
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      // alert("Failed to save land details. Please try again.");
      setToast({
        open: true,
        message: id 
          ? "Failed to update land details. Please try again." 
          : "Failed to save land details. Please try again.",
        severity: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation functions
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  // Close toast alert msg
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };


  // Data arrays
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


  return (
    <Box sx={{ 
      // backgroundColor: '#eef2f6', // Light grey background
      background: 'linear-gradient(to right bottom,rgb(245, 220, 198),rgb(255, 140, 0))',
      minHeight: '100vh',
      py: 5,
    }}>

      <Container maxWidth="lg" sx={{ 
        backgroundColor: 'white',
        borderRadius: 2,
        border: '1px solid rgb(251, 58, 0)',
        boxShadow: 1,
        p: 4
      }}>
        <Stack spacing={4}>

          {/* Add the back button here, before the title */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
            <Button
              variant="outlined"
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
              Back to Home
            </Button>
          </Box>

          <Typography 
            variant="h3" component="h1" 
            align="center"
            sx={{ 
              color: 'primary.main',
              textDecoration: 'underline',
              mb: 3
            }}
          > Land Registration Form </Typography>

          {/* Submission Form */}
          <Box component="form" 
            onSubmit={handleSubmit}
            sx={{
              '& .MuiGrid-container': {
                backgroundColor: 'white',
                p: 3,
                borderRadius: 2,
                border: '2px solid',
                // mb: 10,  // Add this
                width: '100%',  // Add this
                '& .MuiGrid-item': {  // Add this
                  padding: 2,  // Adjust padding inside grid items
                }
              }
            }}
          >

            <Stack spacing={4}>
              
              {/* Location Details */}
              <Typography variant="h5" gutterBottom>Location Details</Typography>
              <Grid container spacing={3} >
                <Grid item xs={12} md={6} >
                  <TextField
                    select
                    fullWidth
                    required
                    label="Province"
                    name="Provinces"
                    onChange={handleChange}
                    value={formData.Provinces}
                  >
                    {provinces.map((province) => (
                      <MenuItem key={province} value={province}>
                        {province}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    required
                    label="District"
                    name="Districts"
                    onChange={handleChange}
                    value={formData.Districts}
                  >
                    {districts.map((district) => (
                      <MenuItem key={district} value={district}>
                        {district}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Divisional Secretariat"
                    name="Divisional_secretariats"
                    onChange={handleChange}
                    value={formData.Divisional_secretariats}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Grama Niladhari Division"
                    name="Grama_Niladhari_divisions"
                    onChange={handleChange}
                    value={formData.Grama_Niladhari_divisions}
                  />
                </Grid>
              </Grid>

              {/* Land Details */}
              <Typography variant="h5" gutterBottom>Land Details</Typography>
              <Grid container spacing={3} >
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Land Address"
                    name="Land_address"
                    onChange={handleChange}
                    value={formData.Land_address}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Land Location"
                    name="Land_location"
                    onChange={handleChange}
                    value={formData.Land_location}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="Area of Land"
                    name="Area_of_Land"
                    onChange={handleChange}
                    value={formData.Area_of_Land}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Land Description"
                    name="Land_description"
                    onChange={handleChange}
                    value={formData.Land_description}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    border: '2px dashed rgba(255, 94, 0, 0.5)', // Changed to match your theme
                    p: 3, // Increased padding
                    borderRadius: 2, // Increased border radius
                    textAlign: 'center',
                    bgcolor: 'rgba(255, 240, 230, 0.2)', // Light background
                    minHeight: '300px', // Set minimum height
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Button
                      component="label"
                      variant="contained"
                      startIcon={<CloudUpload />}
                      sx={{ mb: 2 }}
                    >
                      Upload Land Image
                      <VisuallyHiddenInput 
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                      />
                    </Button>
                    
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {imagePreviews.map((preview, index) => (
                        <Grid item xs={6} key={index}>
                          <Box sx={{ 
                            position: 'relative',
                            borderRadius: '8px',
                            // border: '10px solid rgba(255, 94, 0, 0.5)',
                            overflow: 'hidden',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
                          }}>
                            <img 
                              src={preview} 
                              alt={`Land Preview ${index + 1}`} 
                              style={{
                                  width: '100%',
                                  height: '150px',
                                  borderRadius: '4px'
                              }}
                            />
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 4,
                                right: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                  color: 'white'
                                },
                                padding: '4px',
                                size: 'small'
                              }}
                              onClick={() => handleRemoveImage(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                         </Box>
                        </Grid>
                      ))}
                      {formData.Land_images && formData.Land_images.map((imageUrl, index) => (
                        <Grid item xs={6} key={`existing-${index}`}>
                          <Box sx={{ 
                            position: 'relative',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}>
                            <img 
                              src={imageUrl} 
                              alt={`Existing Land ${index + 1}`} 
                              style={{
                                width: '100%',
                                height: '150px',
                                objectFit: 'cover',
                              }}
                            />
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>

              </Grid>
              

              {/* Local Employee Details */}
              <Typography variant="h5" gutterBottom>Local Employee Details</Typography>
              <Grid container spacing={3} >
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Local Employee Name"
                    name="local_employee_name"
                    onChange={handleChange}
                    value={formData.local_employee_name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Local Employee Phone Number"
                    name="local_employee_phone_number"
                    onChange={handleChange}
                    value={formData.local_employee_phone_number}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                    InputProps={{
                      inputProps: {
                        pattern: "[0-9]{10}"
                      }
                    }}
                  />
                </Grid>
              </Grid>

              {/* USDA Details */}
              <Typography variant="h5" gutterBottom>USDA Details</Typography>
              <Grid container spacing={3} >
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    label="USDA Entry Employee Name"
                    name="USDA_Entry_employee_name"
                    onChange={handleChange}
                    value={formData.USDA_Entry_employee_name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    required
                    type="date"
                    label="Day of Entry"
                    name="Day_of_Entry"
                    onChange={handleChange}
                    value={formData.Day_of_Entry}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
              </Grid>

              {/* Ownership Details */}
              <Typography variant="h5" gutterBottom>Ownership Details</Typography>
              <Grid container spacing={3} >
                <Grid item xs={12} md={6}>
                  <TextField
                    select
                    fullWidth
                    required
                    label="Land Ownership"
                    name="Land_ownership"
                    onChange={handleChange}
                    value={formData.Land_ownership}
                  >
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
                    required
                    label="Land Owner Name"
                    name="Land_owner_name"
                    onChange={handleChange}
                    value={formData.Land_owner_name}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Land Owner Address"
                    name="Land_owner_address"
                    onChange={handleChange}
                    value={formData.Land_owner_address}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="email"
                    label="Email"
                    name="email"
                    onChange={handleChange}
                    value={formData.email}
                    error={!!errors.email}
                    helperText={errors.email}
                    InputProps={{
                      inputProps: {
                        pattern: "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$"
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone_number"
                    onChange={handleChange}
                    value={formData.phone_number}
                    error={!!errors.phone_number}
                    helperText={errors.phone_number}
                    InputProps={{
                      inputProps: {
                        pattern: "[0-9]{10}"
                      }
                    }}
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isLoading}
                sx={{ mt: 2, width: { xs: '100%', md: '200px' }, alignSelf: 'center' }}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>

            </Stack>

          </Box>

        </Stack>
      </Container>


      {/* Toast alert msg */}
      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseToast} 
          severity={toast.severity}
          sx={{ width: '100%' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>

    </Box>
  );
};

export default LandInput;
