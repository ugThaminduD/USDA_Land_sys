import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/auth';

const ProtectedRoute = ({ children }) => {
    const user = getCurrentUser();
    
    if (!user || !localStorage.getItem('token')) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;