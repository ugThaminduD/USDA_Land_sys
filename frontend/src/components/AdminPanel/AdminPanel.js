import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Container, Box, MenuItem, List, ListItem, ListItemText } from "@mui/material";
import { isAdmin } from "../../utils/auth";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const AdminPanel = () => {
    const [un, setUn] = useState("");
    const [pwd, setPwd] = useState("");
    const [role, setRole] = useState("user");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("No token found");
                return;
            }
            const response = await axios.get(`${API_URL}/getALL`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            setMessage(error.response?.data?.message || error.response?.data?.error || "Error fetching users");
        }
    };
    useEffect(() => {
        if (isAdmin()) {
            fetchUsers();
        }
    }, []);

    const handleCreateUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("No token found");
                return;
            }
            const response = await axios.post(
                `${API_URL}/add`,
                { un, pwd, role },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage(`User ${un} created successfully!`);
            setUn("");
            setPwd("");
            setRole("user");
            fetchUsers(); // Refresh user list
        } catch (error) {
            setMessage(error.response?.data?.message || error.response?.data?.error || "Error creating user");
        }
    };

    // if (!isAdmin()) {
    //     return <Typography variant="h6">Access Denied</Typography>;
    // }

    return (
        <Container>
            <Typography variant="h4">Admin Panel</Typography>
            <Box>
                <TextField
                    label="Username"
                    value={un}
                    onChange={(e) => setUn(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="Password"
                    type="password"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    fullWidth
                    margin="normal"
                />
                <TextField
                    select
                    label="Role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    fullWidth
                    margin="normal"
                >
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </TextField>
                <Button variant="contained" color="primary" onClick={handleCreateUser}>
                    Create User
                </Button>
                {message && <Typography variant="body1">{message}</Typography>}
            </Box>
            <Box mt={4}>
                <Typography variant="h6">User List</Typography>
                <List>
                    {users.map((user) => (
                        <ListItem key={user._id}>
                            <ListItemText primary={user.un} secondary={user.role} />
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Container>
    );
};

export default AdminPanel;