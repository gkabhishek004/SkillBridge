import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Loader from '../components/common/Loader';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isSignedIn } = useAuth();

  if (loading) return <Loader fullScreen />;
  if (!isSignedIn) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
