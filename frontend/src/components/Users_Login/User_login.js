import React, { useState } from "react";
import { TextField, Button, Typography, Container } from "@mui/material";
import { login } from "../../utils/auth";

const Login = () => {
    const [un, setUn] = useState("");
    const [pwd, setPwd] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        const response = await login(un, pwd);
        if (response.success) {
            // Redirect based on user role
            window.location.href = response.user.role === "admin" ? "/" : "/";
        } else {
            setError("Invalid username or password");
        }
    };

    return (
        <Container maxWidth="xs">
            <Typography variant="h4" component="h1" gutterBottom>
                User Login
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            <form onSubmit={handleLogin}>
                <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={un}
                    onChange={(e) => setUn(e.target.value)}
                    required
                />
                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    required
                />
                <Button type="submit" variant="contained" color="primary" fullWidth>
                    Login
                </Button>
            </form>
        </Container>
    );
};

export default Login;