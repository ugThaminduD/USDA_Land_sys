import {
  Box,
  Button,
  TextField,
  MenuItem,
  Grid,
  Container,
  Typography,
  Link,
  Stack,
  Alert,
  Snackbar,
  IconButton,
} from "@mui/material";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CloudUpload } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import FilePresentIcon from "@mui/icons-material/FilePresent";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";

import axios from "axios";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
const HEADER_BG = "#8B0000";
const HEADER_TEXT = "#fff";
const SECTION_HEADER_BG = "#b71c1c";
const SECTION_HEADER_TEXT = "#fff";
const FORM_BG = "#f9f5ee";
const REQUIRED_COLOR = "#d32f2f";

const LandInput = () => {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [documentPreviews, setDocumentPreviews] = useState([]);
  const navigate = useNavigate();
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [errors, setErrors] = useState({
    email: "",
    phone_number: "",
  });
  const [formSections, setFormSections] = useState({
    land: false,
    social: false,
  });
  const [formData, setFormData] = useState({
    Provinces: "",
    Districts: "",
    Divisional_secretariats: "",
    Grama_Niladhari_divisions: "",

    Land_address: "",
    Land_location: "",
    Area_of_Land: "",
    Area_of_Land_Unit: "", // Default unit
    Land_description: "",
    Land_current_use: "",
    Land_images: [],
    Land_documents: [],

    local_employee_name: "",
    local_employee_phone_number: "",
    local_employee_email: "",

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
      axios
        .get(`/get/land/${id}`)
        .then((res) => {
          setFormData(res.data);
          setToast({
            open: true,
            message: "Land details loaded successfully",
            severity: "info",
          });
        })
        .catch((err) => {
          console.error("Error fetching land details:", err);
          setToast({
            open: true,
            message: "Failed to load land details",
            severity: "error",
          });
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  // Handler for section selection //// Land or Social
  const handleSectionChange = (e) => {
    setFormSections((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    // Validate on change
    if (name === "email" && value) {
      if (!validateEmail(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Please enter a valid email address",
        }));
      }
    }
    if (name === "phone_number" && value) {
      if (!validatePhone(value)) {
        setErrors((prev) => ({
          ...prev,
          phone_number: "Please enter a valid 10-digit phone number",
        }));
      }
    }
  };

  // Handle image change
  const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    // Check number of files
    if (selectedImages.length + files.length > 5) {
      setToast({
        open: true,
        message: "Maximum 5 images allowed",
        severity: "error",
      });
      return;
    }

    // Validate each file
    const validFiles = files.filter((file) => validateImage(file));

    setSelectedImages((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  // Handle remove existing image
  const handleRemoveExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      Land_images: prev.Land_images.filter((_, i) => i !== index),
    }));

    setToast({
      open: true,
      message: "Image removed. Save changes to update.",
      severity: "info",
    });
  };

  // Handle document change
  const handleDocumentChange = (event) => {
    const files = Array.from(event.target.files);

    // Check number of files
    if (selectedDocuments.length + files.length > 5) {
      setToast({
        open: true,
        message: "Maximum 5 documents allowed",
        severity: "error",
      });
      return;
    }

    // Validate each file
    const validFiles = files.filter((file) => validateDocument(file));

    setSelectedDocuments((prev) => [...prev, ...validFiles]);
    const newPreviews = validFiles.map((file) => ({
      name: file.name,
      type: file.type,
      size: (file.size / 1024).toFixed(1) + " KB",
    }));
    setDocumentPreviews((prev) => [...prev, ...newPreviews]);
  };

  // Handle remove existing document
  const handleRemoveExistingDocument = (index) => {
    setFormData((prev) => ({
      ...prev,
      Land_documents: prev.Land_documents.filter((_, i) => i !== index),
    }));

    setToast({
      open: true,
      message: "Document removed. Save changes to update.",
      severity: "info",
    });
  };

  // Handle Full Land Registration Submission Form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submission
    const validationErrors = {};

    if (formData.email && !validateEmail(formData.email)) {
      validationErrors.email = "Please enter a valid email address";
    }

    if (formData.phone_number && !validatePhone(formData.phone_number)) {
      validationErrors.phone_number =
        "Please enter a valid 10-digit phone number";
    }

    // If there are validation errors, show them and stop submission
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setToast({
        open: true,
        message: "Please fix the validation errors before submitting",
        severity: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      let imageUrls = formData.Land_images || []; // Keep existing images
      let documentUrls = formData.Land_documents || []; // Keep existing documents

      // Upload new images if any are selected
      if (selectedImages.length > 0) {
        const imageFormData = new FormData();
        selectedImages.forEach((image) => {
          imageFormData.append("images", image);
        });

        try {
          const uploadResponse = await axios.post(
            "/upload/images",
            imageFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                // Optional: Add upload progress handling
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`Image Upload Progress: ${progress}%`);
              },
            }
          );

          if (!uploadResponse.data.imageUrls) {
            throw new Error("No image URLs returned from server");
          }

          imageUrls = [...imageUrls, ...uploadResponse.data.imageUrls];
        } catch (error) {
          console.error("Error uploading images:", error);
          setToast({
            open: true,
            message: `Failed to upload images: ${
              error.response?.data?.error || error.message
            }`,
            severity: "error",
          });
          return;
        }
      }

      // Upload new documents if any are selected
      if (selectedDocuments.length > 0) {
        const docFormData = new FormData();
        selectedDocuments.forEach((doc) => {
          docFormData.append("documents", doc);
        });

        try {
          const uploadResponse = await axios.post(
            "/upload/documents",
            docFormData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log(`Document Upload Progress: ${progress}%`);
              },
            }
          );

          if (!uploadResponse.data.documentUrls) {
            throw new Error("No document URLs returned from server");
          }

          documentUrls = [...documentUrls, ...uploadResponse.data.documentUrls];
        } catch (error) {
          console.error("Error uploading documents:", error);
          setToast({
            open: true,
            message: `Failed to upload documents: ${
              error.response?.data?.error || error.message
            }`,
            severity: "error",
          });
          return;
        }
      }

      // Format the date properly
      const formattedData = {
        ...formData,
        Day_of_Entry: new Date(formData.Day_of_Entry).toISOString(),
        Land_images: imageUrls,
        Land_documents: documentUrls,
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
          severity: "success",
        });

        // Add navigation after successful submission
        // Wait 1.5 seconds to show the success message before navigating
        setTimeout(() => {
          if (id) {
            navigate("/"); // For updates, go to list page
          } else {
            setFormData({
              Provinces: "",
              Districts: "",
              Divisional_secretariats: "",
              Grama_Niladhari_divisions: "",
              Land_address: "",
              Land_location: "",
              Area_of_Land: "",
              Area_of_Land_Unit: "", // Reset to default unit
              Land_description: "",
              Land_current_use: "",
              Land_images: [],
              Land_documents: [],
              local_employee_name: "",
              local_employee_phone_number: "",
              local_employee_email: "",
              USDA_Entry_employee_name: "",
              Day_of_Entry: "",
              Land_ownership: "",
              Land_owner_name: "",
              Land_owner_address: "",
              email: "",
              phone_number: "",
            });
            // Also reset the preview states
            setSelectedImages([]);
            setImagePreviews([]);
            setSelectedDocuments([]);
            setDocumentPreviews([]);
            // navigate('/'); // For new entries, go to list page
          }
        }, 1500);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      // alert("Failed to save land details. Please try again.");
      setToast({
        open: true,
        message: id
          ? "Failed to update land details. Please try again."
          : "Failed to save land details. Please try again.",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Validation email, phone functions
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validatePhone = (phone) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(phone);
  };

  // Validate image
  const validateImage = (file) => {
    // Size validation (5MB)
    if (file.size > 20 * 1024 * 1024) {
      setToast({
        open: true,
        message: `Image ${file.name} is too large. Maximum size is 20MB`,
        severity: "error",
      });
      return false;
    }

    // Type validation
    if (!file.type.startsWith("image/")) {
      setToast({
        open: true,
        message: `File ${file.name} is not an image`,
        severity: "error",
      });
      return false;
    }

    return true;
  };

  // Validate document
  const validateDocument = (file) => {
    // Size validation (10MB)
    if (file.size > 100 * 1024 * 1024) {
      setToast({
        open: true,
        message: `Document ${file.name} is too large. Maximum size is 100MB`,
        severity: "error",
      });
      return false;
    }

    // Type validation
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      setToast({
        open: true,
        message: `File ${file.name} type not supported. Only PDF, DOC, DOCX, XLS, XLSX, and TXT files are allowed`,
        severity: "error",
      });
      return false;
    }

    return true;
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
    <Box component="form" onSubmit={handleSubmit}
      sx={{
        minHeight: "100vh",
        background: FORM_BG,
        fontFamily: "'Segoe UI', Arial, sans-serif",
      }}
    >
      {/* Office Header */}
      <Box
        sx={{
          background: HEADER_BG,
          color: HEADER_TEXT,
          py: 2, px: 3, 
          display: "flex",
          alignItems: "center", justifyContent: "center",
          borderBottom: "4px solid #b71c1c",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: 700, letterSpacing: 1 }}>
          USDA Data Collection System
        </Typography>
      </Box>

      {/* Common field Form */} 
      <Container
        maxWidth="md"
        sx={{
          background: "#fff",
          borderRadius: 2, boxShadow: 2,
          mt: 4, mb: 2, px: { xs: 1, sm: 4 },
          py: 4, border: "1.5px solid #b71c1c",
        }}
      >
        <Box>
          <Grid
            container
            spacing={2}
            sx={{ background: FORM_BG, borderRadius: 2, p: 1 }}
          >
            {/* Location Details */}
            <Grid item xs={12}>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 600, fontSize: 18, background: SECTION_HEADER_BG,
                  color: SECTION_HEADER_TEXT,
                  borderRadius: 1, px: 3, mb: 1
                }}
              >
                Government administrative Details
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                select fullWidth required size="small"
                label={
                  <>
                    <span style={{ color: REQUIRED_COLOR }}>*</span> 
                    Province
                  </>
                }
                name="Provinces"
                onChange={handleChange}
                value={formData.Provinces}
                InputLabelProps={{ style: { fontSize: 16 } }}
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
                select fullWidth required size="small"
                label={
                  <>
                    <span style={{ color: REQUIRED_COLOR }}>*</span> 
                    District
                  </>
                }
                name="Districts"
                onChange={handleChange}
                value={formData.Districts}
                InputLabelProps={{ style: { fontSize: 16 } }}
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
                fullWidth required size="small"
                label={
                  <>
                    <span style={{ color: REQUIRED_COLOR }}>*</span>
                    Divisional Secretariat
                  </>
                }
                name="Divisional_secretariats"
                onChange={handleChange}
                value={formData.Divisional_secretariats}
                InputLabelProps={{ style: { fontSize: 16 } }}
              />
            </Grid>
            {/* <Grid item xs={12} md={6}>
              <TextField
                fullWidth required size="small"
                label={
                  <>
                    <span style={{ color: REQUIRED_COLOR }}>*</span>
                    Grama Niladhari Division
                  </>
                }
                name="Grama_Niladhari_divisions"
                onChange={handleChange}
                value={formData.Grama_Niladhari_divisions}
                InputLabelProps={{ style: { fontSize: 16 } }}
              />
            </Grid>  */}
          </Grid>
        </Box>
      </Container>

      {/* Section selection => LAND OR SOCIAL */}
      <Container
        maxWidth="md"
        sx={{
          background: "#fff",
          borderRadius: 2, boxShadow: 2,
          mt: 2, mb: 2, px: { xs: 1, sm: 4 },
          py: 1, border: "1.5px solid #b71c1c",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 2, justifyContent: "space-between" }}>
          <Typography variant="body2" sx={{ color: "#888", mt: 1 }}>
            Select which details you want to add.
          </Typography>
          <FormGroup row>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formSections.land}
                  onChange={handleSectionChange}
                  name="land"
                />
              }
              label="Land Details"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formSections.social}
                  onChange={handleSectionChange}
                  name="social"
                />
              }
              label="Social Details"
            />
          </FormGroup>
        </Box>
          
        
        
      </Container>

      {/* Conditionally render Land Details form */}
      {formSections.land && (
        <Container
          maxWidth="md"
          sx={{
            background: "#fff",
            borderRadius: 2,
            boxShadow: 2,
            mt: 4, mb: 2, px: { xs: 1, sm: 4 },
            py: 4, border: "1.5px solid #b71c1c",
          }}
        >
          {/* Land Details Form */}
          <Box>
            <Grid
              container
              spacing={2}
              sx={{ background: FORM_BG, borderRadius: 2, p: 2 }}
            >

              {/* Land Details */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, fontSize: 18, background: SECTION_HEADER_BG,
                    color: SECTION_HEADER_TEXT,
                    borderRadius: 1, px: 3, mb: 1
                  }}
                >
                  Land Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth size="small"
                  label="Land Address"
                  name="Land_address"
                  onChange={handleChange}
                  value={formData.Land_address}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth size="small"
                  label="Land Location"
                  name="Land_location"
                  onChange={handleChange}
                  value={formData.Land_location}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Grid container spacing={1}>
                  <Grid item xs={7}>
                    <TextField
                      fullWidth required size="small"
                      label={
                        <>
                          <span style={{ color: REQUIRED_COLOR }}>*</span>
                          Area of Land
                        </>
                      }
                      name="Area_of_Land"
                      onChange={handleChange}
                      value={formData.Area_of_Land}
                      InputLabelProps={{ style: { fontSize: 16 } }}
                      type="number" inputProps={{ min: 0 }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{formData.Area_of_Land_Unit}</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <TextField
                      select fullWidth required size="small" label="Unit"
                      name="Area_of_Land_Unit"
                      onChange={handleChange}
                      value={formData.Area_of_Land_Unit}
                      InputLabelProps={{ style: { fontSize: 16 } }}
                    >
                      <MenuItem value="Hectares">Hectares</MenuItem>
                      <MenuItem value="Perches">Perches</MenuItem>
                      <MenuItem value="Acres">Acres</MenuItem>
                      <MenuItem value="Square Feet">Square Feet</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth multiline size="small" rows={3}
                  label="Land Description"
                  name="Land_description"
                  onChange={handleChange}
                  value={formData.Land_description}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>
                           
                {/* Land Images */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    border: '2px dashed rgba(255, 94, 0, 0.5)', // Changed to match your theme
                    p: 3, borderRadius: 2, textAlign: 'center',
                    bgcolor: 'rgba(255, 240, 230, 0.2)', // Light background
                    minHeight: '200px', // Set minimum height
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Button
                      component="label" size="small"
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
                              onClick={() => handleRemoveExistingImage(index)}
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
                            {/* Add delete button for existing images */}
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
                              onClick={() => handleRemoveExistingImage(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
                {/* Land Documents */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    border: '2px dashed rgba(0, 120, 255, 0.5)', // Different color for documents
                    p: 3,
                    borderRadius: 2,
                    textAlign: 'center',
                    bgcolor: 'rgba(230, 240, 255, 0.2)', // Light blue background
                    minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Button
                      component="label" size="small"
                      variant="contained"
                      startIcon={<FilePresentIcon />}
                      sx={{ mb: 2, bgcolor: 'info.main' }}
                    >
                      Upload Documents
                      <VisuallyHiddenInput 
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        multiple
                        onChange={handleDocumentChange}
                      />
                    </Button>
                    
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {documentPreviews.map((doc, index) => (
                        <Grid item xs={12} key={index}>
                          <Box sx={{ 
                            position: 'relative',
                            borderRadius: '8px',
                            p: 2,
                            bgcolor: 'background.paper',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {doc.type.includes('pdf') ? 
                              <PictureAsPdfIcon color="error" sx={{ mr: 1 }} /> : 
                              <DescriptionIcon color="info" sx={{ mr: 1 }} />
                            }
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" noWrap>{doc.name}</Typography>
                              <Typography variant="caption" color="textSecondary">{doc.size}</Typography>
                            </Box>
                            <IconButton
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                  color: 'white'
                                },
                                padding: '4px',
                                size: 'small'
                              }}
                              onClick={() => handleRemoveExistingDocument(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                      {formData.Land_documents && formData.Land_documents.map((docUrl, index) => (
                        <Grid item xs={12} key={`existing-doc-${index}`}>
                          <Box sx={{ 
                            position: 'relative',
                            borderRadius: '8px',
                            p: 2,
                            bgcolor: 'background.paper',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            overflow: 'hidden'
                          }}>
                            {docUrl.toLowerCase().endsWith('.pdf') ? 
                              <PictureAsPdfIcon color="error" sx={{ mr: 1, flexShrink: 0 }} /> : 
                              <DescriptionIcon color="info" sx={{ mr: 1, flexShrink: 0 }} />
                            }
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" noWrap 
                                sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  width: '100%'
                                }}
                              >
                                {docUrl.split('/').pop()}
                              </Typography>
                              <Typography variant="caption" color="textSecondary"
                                sx={{
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {/* For PDFs, open in new tab with PDF viewer */}
                                {docUrl.toLowerCase().endsWith('.pdf') ? (
                                  <Link
                                    href={docUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      textDecoration: 'none',
                                      '&:hover': {
                                        textDecoration: 'underline'
                                      }
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.open(docUrl, '_blank', 'noopener,noreferrer');
                                    }}
                                  >
                                    View PDF
                                  </Link>
                                ) : (
                                  // For other documents, regular download
                                  <Link
                                    href={docUrl}
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
                                )}
                              </Typography>
                            </Box>
                            {/* Add delete button for existing documents */}
                            <IconButton
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                  color: 'white'
                                },
                                padding: '4px',
                                size: 'small',
                                flexShrink: 0
                              }}
                              onClick={() => handleRemoveExistingDocument(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>                
              
              <Grid item xs={12} md={6}>
                <Typography
                  variant="body2"
                  sx={{ color: "black", mt: 1, mb: 1 }}
                >
                  Land Current Use or Value of the Land:<br />
                  <span style={{ color: "#666" }}>Agriculture, Residential, Commercial, Vacant, etc.</span>
                </Typography>
              </Grid> 
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth size="small"
                  label="Land Current Use/ Value"
                  name="Land_current_use"
                  onChange={handleChange}
                  value={formData.Land_current_use || ""}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                  placeholder="Agriculture, Residential, Commercial, Vacant, etc."
                />
              </Grid> 

              {/* Local Employee Details */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, fontSize: 18, background: SECTION_HEADER_BG,
                    color: SECTION_HEADER_TEXT,
                    borderRadius: 1, px: 3, mb: 1
                  }}
                >
                  Local Employee Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth size="small"
                  label="Local Employee Name"
                  name="local_employee_name"
                  onChange={handleChange}
                  value={formData.local_employee_name}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth size="small"
                  label="Local Employee Phone Number"
                  name="local_employee_phone_number"
                  onChange={handleChange}
                  value={formData.local_employee_phone_number}
                  error={!!errors.phone_number}
                  helperText={errors.phone_number}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth type="email" size="small"
                  label="Email"
                  name="local_employee_email"
                  onChange={handleChange}
                  value={formData.local_employee_email}
                  error={!!errors.local_employee_email}
                  helperText={errors.local_employee_email}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>

              {/* USDA Details */}
              {/* <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, fontSize: 18, background: SECTION_HEADER_BG,
                    color: SECTION_HEADER_TEXT,
                    borderRadius: 1, px: 3, mb: 1
                  }}
                >
                  USDA Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth required size="small"
                  label={
                    <>
                      <span style={{ color: REQUIRED_COLOR }}>*</span> USDA Entry
                      Employee Name
                    </>
                  }
                  name="USDA_Entry_employee_name"
                  onChange={handleChange}
                  value={formData.USDA_Entry_employee_name}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth required type="date" size="small"
                  label={
                    <>
                      <span style={{ color: REQUIRED_COLOR }}>*</span> Day of
                      Entry
                    </>
                  }
                  name="Day_of_Entry"
                  onChange={handleChange}
                  value={formData.Day_of_Entry}
                  InputLabelProps={{ shrink: true, style: { fontSize: 16 } }}
                />
              </Grid> */}

              {/* Ownership Details */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, fontSize: 18, background: SECTION_HEADER_BG,
                    color: SECTION_HEADER_TEXT,
                    borderRadius: 1, px: 3, mb: 1
                  }}
                >
                  Ownership Details
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  select fullWidth required size="small"
                  label={
                    <>
                      <span style={{ color: REQUIRED_COLOR }}>*</span> Land
                      Ownership
                    </>
                  }
                  name="Land_ownership"
                  onChange={handleChange}
                  value={formData.Land_ownership}
                  InputLabelProps={{ style: { fontSize: 16 } }}
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
                  fullWidth required size="small"
                  label={
                    <>
                      <span style={{ color: REQUIRED_COLOR }}>*</span> 
                      Land Owner Name/ Government Office
                    </>
                  }
                  name="Land_owner_name"
                  onChange={handleChange}
                  value={formData.Land_owner_name}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth size="small"
                  label="Land Owner Address"
                  name="Land_owner_address"
                  onChange={handleChange}
                  value={formData.Land_owner_address}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth type="email" size="small"
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  value={formData.email}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth multiline rows={2} size="small"
                  label="Phone Numbers"
                  name="phone_number"
                  onChange={handleChange}
                  value={formData.phone_number}
                  error={!!errors.phone_number}
                  helperText={errors.phone_number}
                  InputLabelProps={{ style: { fontSize: 16 } }}
                />
              </Grid>

            </Grid>
          </Box>
        </Container>
      )}




      

      {/* Conditionally render Social Details form */}
      {formSections.social && (
        <Container
          maxWidth="md"
          sx={{
            background: "#fff",
            borderRadius: 2,
            boxShadow: 2,
            mt: 4, mb: 6, px: { xs: 1, sm: 4 },
            py: 4, border: "1.5px solid #1976d2",
          }}
        >
          {/* Social Details Form */}
          <Box>
            <Grid
              container spacing={2}
              sx={{ background: FORM_BG, borderRadius: 2, p: 2 }}
            >

              {/* Social Details Topic */}
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 600, fontSize: 18, background: SECTION_HEADER_BG,
                    color: SECTION_HEADER_TEXT,
                    borderRadius: 1, px: 3, mb: 1
                  }}
                >
                  Social Details
                </Typography>
              </Grid>

      {/* Grama Niladhari Division Details */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          label="Grama Niladhari Division (Name and Number)"
          name="Grama_Niladhari_Division"
          onChange={handleChange}
          value={formData.Grama_Niladhari_Division || ""}
          placeholder="e.g., Nugegoda 519"
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>

      {/* Population Details */}
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Total Population"
          name="Total_Population"
          onChange={handleChange}
          value={formData.Total_Population || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Total Number of Families"
          name="Total_Families"
          onChange={handleChange}
          value={formData.Total_Families || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Total Male Population"
          name="Total_Male_Population"
          onChange={handleChange}
          value={formData.Total_Male_Population || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Total Female Population"
          name="Total_Female_Population"
          onChange={handleChange}
          value={formData.Total_Female_Population || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>      

      {/* Housing Details */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: 18,
            background: SECTION_HEADER_BG,
            color: SECTION_HEADER_TEXT,
            borderRadius: 1,
            px: 3,
            mb: 1,
          }}
        >
          Housing Details
        </Typography>
        <Typography variant="body2" sx={{ color: "#888", mt: 1 }}>
          ***Only fill the relevant fields
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Shanty Housing Units"
          name="Shanty_Housing_Units"
          onChange={handleChange}
          value={formData.Shanty_Housing_Units || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Families in Shanties"
          name="Families_in_Shanties"
          onChange={handleChange}
          value={formData.Families_in_Shanties || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Slum Housing Units"
          name="Slum_Housing_Units"
          onChange={handleChange}
          value={formData.Slum_Housing_Units || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Families in Slums"
          name="Families_in_Slums"
          onChange={handleChange}
          value={formData.Families_in_Slums || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Line Room Housing Units"
          name="Line_Room_Housing_Units"
          onChange={handleChange}
          value={formData.Line_Room_Housing_Units || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Families in Line Rooms"
          name="Families_in_Line_Rooms"
          onChange={handleChange}
          value={formData.Families_in_Line_Rooms || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Scattered Housing Units"
          name="Scattered_Housing_Units"
          onChange={handleChange}
          value={formData.Scattered_Housing_Units || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Families in Scattered Housing"
          name="Families_in_Scattered_Housing"
          onChange={handleChange}
          value={formData.Families_in_Scattered_Housing || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Housing Units in Vulnerable Condition"
          name="Vulnerable_Housing_Units"
          onChange={handleChange}
          value={formData.Vulnerable_Housing_Units || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Number of Families in Vulnerable Housing"
          name="Families_in_Vulnerable_Housing"
          onChange={handleChange}
          value={formData.Families_in_Vulnerable_Housing || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Other Types of Housing Units"
          name="Other_Housing_Units"
          onChange={handleChange}
          value={formData.Other_Housing_Units || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          type="number"
          label="Families in Other Types of Housing"
          name="Families_in_Other_Housing"
          onChange={handleChange}
          value={formData.Families_in_Other_Housing || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>

      {/* Land Details */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: 18,
            background: SECTION_HEADER_BG,
            color: SECTION_HEADER_TEXT,
            borderRadius: 1,
            px: 3,
            mb: 1,
          }}
        >
          Land Details
        </Typography>
      </Grid>      
      <Grid item xs={12} md={6}>
        <Grid container spacing={1}>
          <Grid item xs={7}>
            <TextField
              fullWidth required size="small"
              label={
                <>
                  <span style={{ color: REQUIRED_COLOR }}>*</span>
                  Area of Land
                </>
              }
              name="Area_of_Land"
              onChange={handleChange}
              value={formData.Area_of_Land}
              InputLabelProps={{ style: { fontSize: 16 } }}
              type="number" inputProps={{ min: 0 }}
              InputProps={{
                  endAdornment: (
                  <InputAdornment position="end">{formData.Area_of_Land_Unit}</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              select fullWidth required size="small" label="Unit"
              name="Area_of_Land_Unit"
              onChange={handleChange}
              value={formData.Area_of_Land_Unit}
              InputLabelProps={{ style: { fontSize: 16 } }}
            >
              <MenuItem value="Hectares">Hectares</MenuItem>
              <MenuItem value="Perches">Perches</MenuItem>
              <MenuItem value="Acres">Acres</MenuItem>
              <MenuItem value="Square Feet">Square Feet</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Grid>      
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          label="Land Extent"
          name="Land_Extent"
          onChange={handleChange}
          value={formData.Land_Extent || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          label="Land Lot Details"
          name="Land_Lot_Details"
          onChange={handleChange}
          value={formData.Land_Lot_Details || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>

      {/* Vulnerability and Livability */}
      <Grid item xs={12} sx={{ mt: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            fontSize: 18,
            background: SECTION_HEADER_BG,
            color: SECTION_HEADER_TEXT,
            borderRadius: 1,
            px: 3,
            mb: 1,
          }}
        >
          Vulnerability and Livability
        </Typography>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          select
          label="Vulnerability Index"
          name="Vulnerability_Index"
          onChange={handleChange}
          value={formData.Vulnerability_Index || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        >
          <MenuItem value="Low">Low</MenuItem>
          <MenuItem value="Moderate">Moderate</MenuItem>
          <MenuItem value="High">High</MenuItem>
          <MenuItem value="Critical">Critical</MenuItem>
        </TextField>
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          select
          label="Livability Condition"
          name="Livability_Condition"
          onChange={handleChange}
          value={formData.Livability_Condition || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        >
          <MenuItem value="Good">Good</MenuItem>
          <MenuItem value="Moderate">Moderate</MenuItem>
          <MenuItem value="Poor">Poor</MenuItem>
          <MenuItem value="Critical">Critical</MenuItem>
        </TextField>
      </Grid>

      {/* Additional Notes */}
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={3}
          size="small"
          label="Additional Notes or Observations"
          name="Additional_Notes"
          onChange={handleChange}
          value={formData.Additional_Notes || ""}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid>
      {/* Photos Available (Derived) */}
      {/* <Grid item xs={12} md={6}>
        <TextField
          fullWidth
          size="small"
          label="Photos Available"
          name="Photos_Available"
          value={formData.Land_images ? formData.Land_images.length : 0} // Derived from Land_images array
          InputProps={{
            readOnly: true,
          }}
          InputLabelProps={{ style: { fontSize: 16 } }}
        />
      </Grid> */}


                {/* Land Images */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    border: '2px dashed rgba(255, 94, 0, 0.5)', // Changed to match your theme
                    p: 3, borderRadius: 2, textAlign: 'center',
                    bgcolor: 'rgba(255, 240, 230, 0.2)', // Light background
                    // minHeight: '200px', // Set minimum height
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Button
                      component="label" size="small"
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
                                top: 4, right: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                  color: 'white'
                                },
                                padding: '4px',
                                size: 'small'
                              }}
                              onClick={() => handleRemoveExistingImage(index)}
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
                            {/* Add delete button for existing images */}
                            <IconButton
                              sx={{
                                position: 'absolute',
                                top: 4, right: 4,
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                  color: 'white'
                                },
                                padding: '4px',
                                size: 'small'
                              }}
                              onClick={() => handleRemoveExistingImage(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>
                {/* Land Documents */}
                <Grid item xs={12} md={6}>
                  <Box sx={{ 
                    border: '2px dashed rgba(0, 120, 255, 0.5)', // Different color for documents
                    p: 3, borderRadius: 2, textAlign: 'center',
                    bgcolor: 'rgba(230, 240, 255, 0.2)', // Light blue background
                    // minHeight: '200px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 2
                  }}>
                    <Button
                      component="label" size="small"
                      variant="contained"
                      startIcon={<FilePresentIcon />}
                      sx={{ mb: 2, bgcolor: 'info.main' }}
                    >
                      Upload Documents
                      <VisuallyHiddenInput 
                        type="file"
                        accept=".pdf,.doc,.docx,.xls,.xlsx,.txt"
                        multiple
                        onChange={handleDocumentChange}
                      />
                    </Button>
                    
                    <Grid container spacing={2} sx={{ mt: 2 }}>
                      {documentPreviews.map((doc, index) => (
                        <Grid item xs={12} key={index}>
                          <Box sx={{ 
                            position: 'relative',
                            borderRadius: '8px',
                            p: 2,
                            bgcolor: 'background.paper',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center'
                          }}>
                            {doc.type.includes('pdf') ? 
                              <PictureAsPdfIcon color="error" sx={{ mr: 1 }} /> : 
                              <DescriptionIcon color="info" sx={{ mr: 1 }} />
                            }
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="body2" noWrap>{doc.name}</Typography>
                              <Typography variant="caption" color="textSecondary">{doc.size}</Typography>
                            </Box>
                            <IconButton
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                  color: 'white'
                                },
                                padding: '4px',
                                size: 'small'
                              }}
                              onClick={() => handleRemoveExistingDocument(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                      {formData.Land_documents && formData.Land_documents.map((docUrl, index) => (
                        <Grid item xs={12} key={`existing-doc-${index}`}>
                          <Box sx={{ 
                            position: 'relative',
                            borderRadius: '8px',
                            p: 2,
                            bgcolor: 'background.paper',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            width: '100%',
                            overflow: 'hidden'
                          }}>
                            {docUrl.toLowerCase().endsWith('.pdf') ? 
                              <PictureAsPdfIcon color="error" sx={{ mr: 1, flexShrink: 0 }} /> : 
                              <DescriptionIcon color="info" sx={{ mr: 1, flexShrink: 0 }} />
                            }
                            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                              <Typography variant="body2" noWrap 
                                sx={{ 
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  width: '100%'
                                }}
                              >
                                {docUrl.split('/').pop()}
                              </Typography>
                              <Typography variant="caption" color="textSecondary"
                                sx={{
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}
                              >
                                {/* For PDFs, open in new tab with PDF viewer */}
                                {docUrl.toLowerCase().endsWith('.pdf') ? (
                                  <Link
                                    href={docUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      textDecoration: 'none',
                                      '&:hover': {
                                        textDecoration: 'underline'
                                      }
                                    }}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      window.open(docUrl, '_blank', 'noopener,noreferrer');
                                    }}
                                  >
                                    View PDF
                                  </Link>
                                ) : (
                                  // For other documents, regular download
                                  <Link
                                    href={docUrl}
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
                                )}
                              </Typography>
                            </Box>
                            {/* Add delete button for existing documents */}
                            <IconButton
                              sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                                '&:hover': {
                                  backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                  color: 'white'
                                },
                                padding: '4px',
                                size: 'small',
                                flexShrink: 0
                              }}
                              onClick={() => handleRemoveExistingDocument(index)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Grid>      

            </Grid>
          </Box>
        </Container>
      )}





      {/* Submit Button after all forms */}
      <Container maxWidth="md" sx={{ textAlign: "center", mt: 3, mb: 4 }}>
        <Button
          type="submit" size="small"
          variant="contained"
          disabled={isLoading}
          sx={{
            background: SECTION_HEADER_BG,
            color: "#fff",
            fontWeight: 600, fontSize: 16,
            px: 2, py: 1, borderRadius: 2,
            "&:hover": { background: "#a31515" },
          }}
        >
          {isLoading ? "Submitting..." : "Submit All"}
        </Button>
      </Container>
      
      {/* Toast alert msg */}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseToast}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LandInput;
