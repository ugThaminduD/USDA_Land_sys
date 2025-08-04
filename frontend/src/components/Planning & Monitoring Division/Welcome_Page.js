import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Grid,
  Card,
  Button,
  Chip,
} from "@mui/material";
import { logout, getCurrentUser, isAdmin } from "../../utils/auth";
import logo from "../../img/LogoUSDA.png";
import backgroundImage from '../../img/WelcomeBG.jpg';



const planningSections = [
    { name: "Data Collection Form", route: "/data/input" },
    { name: "Data Visualization", route: "/data/list" },

    // { name: "Excel Data Management", route: "/excel/files" },
    // { name: "Excel File Uploader", route: "/upload/excelDocument" },
    // { name: "Monitoring Reports", route: "/monitoring-reports" },
    // { name: "GIS Mapping", route: "/gis-mapping" },
    // { name: "Project Planning", route: "/project-planning" },
];

const PlanningWelcomePage = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser();

    const handleLogin = () => {
        navigate('/login'); // Navigate to login page
    };
    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: "cover",
                // background: "linear-gradient(to right bottom,rgb(244, 151, 38),rgb(237, 121, 20))",
                py: 5,
            }}
        >
            {/* Header Section */}
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    px: 3,
                    py: 2,
                    backgroundColor: "white",
                    borderBottom: "2px solid rgb(251, 58, 0)",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
            >
                <img src={logo} alt="Logo" style={{ width: 60, height: 60 }} />
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: "bold",
                        color: "rgb(251, 58, 0)",
                        textAlign: "center",
                    }}
                >
                    WELCOME TO <span style={{ color: "orangered" }}>PLANNING & MONITORING</span> DIVISION
                </Typography>

                {/* User Info and Login/Logout */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {currentUser ? (
                        // Show user info and logout when logged in
                        <>
                            <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Welcome, {currentUser?.full_name || currentUser?.un}
                                </Typography>
                                <Chip 
                                    label={currentUser?.role?.toUpperCase()} 
                                    color={isAdmin() ? "error" : "primary"} 
                                    size="small" 
                                />
                            </Box>
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleLogout}
                                size="small"
                            >
                                Logout
                            </Button>
                            {isAdmin() && (
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => navigate('/admin')}
                                    size="small"
                                >
                                    Admin Panel
                                </Button>
                            )}
                        </>
                    ) : (
                        // Show login button when not logged in
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleLogin}
                            size="small"
                            sx={{
                                backgroundColor: "rgb(251, 58, 0)",
                                "&:hover": {
                                    backgroundColor: "rgb(220, 50, 0)",
                                }
                            }}
                        >
                            Login
                        </Button>
                    )}
                </Box>
            </Box>

            

            <Box sx={{ px: 3, mt: 6 }}>
                <Box
                    sx={{
                        background: "rgba(255,255,255,0.15)",
                        borderRadius: 3,
                        boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                        p: 4,
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        width: "90%",
                        // maxWidth: 1200,
                        mx: "auto",
                    }}
                >
                    <Box
                        sx={{
                            minWidth: 70,
                            minHeight: 70,
                            background: "linear-gradient(135deg, #fb3a00 60%, #ffb347 100%)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 2,
                            boxShadow: "0 2px 8px rgba(251,58,0,0.15)",
                        }}
                    >
                        <Typography variant="h4" sx={{ color: "white", fontWeight: "bold" }}>
                            i
                        </Typography>
                    </Box>
                    <Box>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: "bold",
                                mb: 2,
                                letterSpacing: 1,
                                lineHeight: 1.3,
                                textAlign: "center", // Center the text
                            }}
                        >
                            NATIONAL LEVEL<br />
                            SOCIO-ECONOMIC SURVEY ON<br />
                            URBAN LOW-INCOME SETTLEMENTS<br />
                            <span
                                style={{
                                    color: "#fff",
                                    fontWeight: 400,
                                    fontSize: "0.7em", // Make "CONDUCTED BY USDA" smaller
                                    display: "block",
                                    marginTop: 4,
                                }}
                            >
                                CONDUCTED BY USDA
                            </span>
                        </Typography>
                        <Typography variant="body1" sx={{ color: "white", fontSize: 18 }}>
                            {/* The <b>Planning & Monitoring Division</b> is dedicated to effective land management, data-driven decision making, and project planning to support sustainable development and resource monitoring. */}
                            National Level Census on Socio-economic of urban low-income settlements was planned to obtain
                            up-to-date information on low-income housing need of urban low-income settlements. And also,
                            this survey planned to get information about socio-economic information of low-income
                            settlements and suitable available lands which can be used for low and middle income housing
                            projects
                        </Typography>
                    </Box>
                </Box>
            </Box>
            
            {/* Cards Section */}
            <Box sx={{ px: 3, mt: 6 }}>
                <Grid container spacing={0} gap={4} justifyContent="center">
                    {planningSections.map((section, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card
                                sx={{
                                    height: 150,
                                    width: 300,
                                    margin: "auto",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
                                    border: "1px solid rgb(251, 58, 0)",
                                    borderRadius: "10px",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease-in-out",
                                    backgroundColor: "white",
                                    color: "#ff8c00",
                                    "&:hover": {
                                        transform: "translateY(-5px)",
                                        boxShadow: "0 5px 15px rgba(0, 0, 0, 0.3)",
                                        backgroundColor: "#ff8c00",
                                        color: "white",
                                    },
                                }}
                                onClick={() => navigate(section.route)}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        fontWeight: "bold",
                                        textAlign: "center",
                                        color: "inherit",
                                    }}
                                >
                                    {section.name}
                                </Typography>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>

        </Box>
    );
};

export default PlanningWelcomePage;