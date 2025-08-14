import React, { useState, useEffect } from "react";
import { 
    TextField, 
    Button, 
    Typography, 
    Container, 
    Box, 
    MenuItem, 
    List, 
    ListItem, 
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert,
    Paper,
    Divider,
    Chip
} from "@mui/material";
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    ArrowBack as ArrowBackIcon,
    PersonAdd as PersonAddIcon,
    People as PeopleIcon,
    AdminPanelSettings as AdminIcon
} from "@mui/icons-material";
import { isAdmin } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:5000/api/users";

const AdminPanel = () => {
    const navigate = useNavigate();
    const [un, setUn] = useState("");
    const [pwd, setPwd] = useState("");
    const [role, setRole] = useState("user");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);
    const [editDialog, setEditDialog] = useState(false);
    const [deleteDialog, setDeleteDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editData, setEditData] = useState({ un: "", pwd: "", role: "user" });

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setMessage("No token found. Please login again.");
                return;
            }
            
            if (!isAdmin()) {
                setMessage("Access denied. Admins only.");
                return;
            }

            const response = await axios.get(`${API_URL}/getALL`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
            setMessage("");
        } catch (error) {
            console.error("Fetch users error:", error);
            if (error.response?.status === 403) {
                setMessage("Access denied. Admins only.");
            } else if (error.response?.status === 401) {
                setMessage("Session expired. Please login again.");
            } else {
                setMessage(error.response?.data?.message || error.response?.data?.error || "Error fetching users");
            }
        }
    };

    useEffect(() => {
        if (isAdmin()) {
            fetchUsers();
        } else {
            setMessage("Access denied. Admins only.");
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
            fetchUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || error.response?.data?.error || "Error creating user");
        }
    };

    const handleEditUser = (user) => {
        setSelectedUser(user);
        setEditData({ un: user.un, pwd: "", role: user.role });
        setEditDialog(true);
    };

    const handleUpdateUser = async () => {
        try {
            const token = localStorage.getItem("token");
            const updateData = { un: editData.un, role: editData.role };
            if (editData.pwd) {
                updateData.pwd = editData.pwd;
            }
            
            await axios.put(
                `${API_URL}/update/${selectedUser._id}`,
                updateData,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("User updated successfully!");
            setEditDialog(false);
            fetchUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || error.response?.data?.error || "Error updating user");
        }
    };

    const handleDeleteUser = (user) => {
        setSelectedUser(user);
        setDeleteDialog(true);
    };

    const confirmDeleteUser = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(
                `${API_URL}/delete/${selectedUser._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessage("User deleted successfully!");
            setDeleteDialog(false);
            fetchUsers();
        } catch (error) {
            setMessage(error.response?.data?.message || error.response?.data?.error || "Error deleting user");
        }
    };

    const handleBack = () => {
        navigate(-1); // Go back to previous page
    };

    if (!isAdmin()) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Paper elevation={3} sx={{ p: 4, backgroundColor: '#f5f5f5' }}>
                    <Box display="flex" alignItems="center" mb={3}>
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBack}
                            sx={{ mr: 2, color: '#1976d2' }}
                        >
                            Back
                        </Button>
                        <AdminIcon sx={{ mr: 2, color: '#d32f2f', fontSize: 32 }} />
                        <Typography variant="h4" sx={{ color: '#d32f2f', fontWeight: 'bold' }}>
                            Admin Panel - User Management
                        </Typography>
                    </Box>
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Access denied. This panel is only accessible to administrators.
                    </Alert>
                </Paper>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

            {/* Header */}
            <Paper elevation={3} sx={{ p: 3, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                        <Button
                            startIcon={<ArrowBackIcon />}
                            onClick={handleBack}
                            sx={{ mr: 2, color: 'white', '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' } }}
                        >
                            Back
                        </Button>
                        <AdminIcon sx={{ mr: 2, fontSize: 32 }} />
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            Admin Panel - User Management
                        </Typography>
                    </Box>
                    <Chip 
                        icon={<PeopleIcon />} 
                        label={`${users.length} Users`} 
                        sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }}
                    />
                </Box>
            </Paper>

            {/* Message Alert */}
            {message && (
                <Alert 
                    severity={message.includes("successfully") ? "success" : "error"} 
                    sx={{ 
                        mb: 3,
                        '& .MuiAlert-icon': {
                            color: message.includes("successfully") ? '#2e7d32' : '#d32f2f'
                        }
                    }}
                >
                    {message}
                </Alert>
            )}

            {/* Create User Form */}
            <Paper elevation={2} sx={{ p: 3, mb: 4, backgroundColor: '#f8f9fa' }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <PersonAddIcon sx={{ mr: 1, color: '#1976d2' }} />
                    <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' }}>
                        Create New User
                    </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />
                
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Username"
                        value={un}
                        onChange={(e) => setUn(e.target.value)}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: '#1976d2' },
                                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                            }
                        }}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        value={pwd}
                        onChange={(e) => setPwd(e.target.value)}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: '#1976d2' },
                                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                            }
                        }}
                    />
                    <TextField
                        label="Role" select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        fullWidth
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: '#1976d2' },
                                '&.Mui-focused fieldset': { borderColor: '#1976d2' }
                            }
                        }}
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                    <Button 
                        variant="contained" 
                        onClick={handleCreateUser}
                        startIcon={<PersonAddIcon />}
                        sx={{ 
                            mt: 1,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            '&:hover': {
                                background: 'linear-gradient(45deg, #1976D2 30%, #1976D2 90%)',
                            }
                        }}
                    >
                        Create User
                    </Button>
                </Box>
            </Paper>

            {/* User List */}
            <Paper elevation={2} sx={{ backgroundColor: '#f8f9fa' }}>
                <Box p={3}>
                    <Box display="flex" alignItems="center" mb={2}>
                        <PeopleIcon sx={{ mr: 1, color: '#388e3c' }} />
                        <Typography variant="h6" sx={{ color: '#388e3c', fontWeight: 'bold' }}>
                            User List
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    
                    <List>
                        {users.map((user, index) => (
                            <Paper
                                key={user._id}
                                elevation={1}
                                sx={{ 
                                    mb: 1, 
                                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f5f5f5',
                                    '&:hover': { backgroundColor: '#e3f2fd' }
                                }}
                            >
                                <ListItem>
                                    <ListItemText
                                        primary={
                                            <Box display="flex" alignItems="center" gap={1}>
                                                <Typography variant="h6" sx={{ color: '#1976d2' }}>
                                                    {user.un}
                                                </Typography>
                                                <Chip 
                                                    label={user.role} 
                                                    size="small"
                                                    color={user.role === 'admin' ? 'error' : 'primary'}
                                                    variant="outlined"
                                                />
                                            </Box>
                                        }
                                        secondary={
                                            <Typography color="textSecondary">
                                                Created: {new Date(user.createdAt).toLocaleDateString()}
                                            </Typography>
                                        }
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton 
                                            edge="end" 
                                            aria-label="edit"
                                            onClick={() => handleEditUser(user)}
                                            sx={{ 
                                                color: '#ff9800',
                                                '&:hover': { backgroundColor: 'rgba(255, 152, 0, 0.1)' }
                                            }}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            edge="end" 
                                            aria-label="delete"
                                            onClick={() => handleDeleteUser(user)}
                                            sx={{ 
                                                color: '#f44336',
                                                '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                                            }}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </Paper>
                        ))}
                        {users.length === 0 && (
                            <Paper elevation={1} sx={{ p: 3, textAlign: 'center', backgroundColor: '#fff3e0' }}>
                                <Typography color="textSecondary">
                                    No users found. Create your first user above.
                                </Typography>
                            </Paper>
                        )}
                    </List>
                </Box>
            </Paper>

            {/* Edit User Dialog */}
            <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)', color: 'white' }}>
                    <Box display="flex" alignItems="center">
                        <EditIcon sx={{ mr: 1 }} />
                        Edit User
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <TextField
                        label="Username"
                        value={editData.un}
                        onChange={(e) => setEditData({...editData, un: e.target.value})}
                        fullWidth
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: '#ff9800' },
                                '&.Mui-focused fieldset': { borderColor: '#ff9800' }
                            }
                        }}
                    />
                    <TextField
                        label="New Password (leave empty to keep current)"
                        type="password"
                        value={editData.pwd}
                        onChange={(e) => setEditData({...editData, pwd: e.target.value})}
                        fullWidth
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: '#ff9800' },
                                '&.Mui-focused fieldset': { borderColor: '#ff9800' }
                            }
                        }}
                    />
                    <TextField
                        select
                        label="Role"
                        value={editData.role}
                        onChange={(e) => setEditData({...editData, role: e.target.value})}
                        fullWidth
                        margin="normal"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                '&:hover fieldset': { borderColor: '#ff9800' },
                                '&.Mui-focused fieldset': { borderColor: '#ff9800' }
                            }
                        }}
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </TextField>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setEditDialog(false)} sx={{ color: '#666' }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleUpdateUser} 
                        variant="contained"
                        sx={{ 
                            background: 'linear-gradient(45deg, #ff9800 30%, #f57c00 90%)',
                            '&:hover': { background: 'linear-gradient(45deg, #f57c00 30%, #ef6c00 90%)' }
                        }}
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ background: 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)', color: 'white' }}>
                    <Box display="flex" alignItems="center">
                        <DeleteIcon sx={{ mr: 1 }} />
                        Confirm Delete
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        This action cannot be undone!
                    </Alert>
                    <Typography>
                        Are you sure you want to delete user <strong>"{selectedUser?.un}"</strong>?
                    </Typography>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={() => setDeleteDialog(false)} sx={{ color: '#666' }}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmDeleteUser} 
                        variant="contained" 
                        sx={{ 
                            background: 'linear-gradient(45deg, #f44336 30%, #d32f2f 90%)',
                            '&:hover': { background: 'linear-gradient(45deg, #d32f2f 30%, #c62828 90%)' }
                        }}
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            
        </Container>
    );
};

export default AdminPanel;