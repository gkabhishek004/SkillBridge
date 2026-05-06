import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { getDashboardPath } from '../utils/roleHelper';
import Loader from '../components/common/Loader';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <Loader fullScreen />;

  if (!user) return <Navigate to="/login" replace />;

  if (user.needsRoleSetup) return <Navigate to="/signup/complete" replace />;

  const path = getDashboardPath(user.role);
  return <Navigate to={path} replace />;
};

export default Dashboard;
