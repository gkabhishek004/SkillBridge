import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import useAuth from '../hooks/useAuth';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import StudentDashboard from '../pages/student/StudentDashboard';
import TrainerDashboard from '../pages/trainer/TrainerDashboard';
import InstitutionDashboard from '../pages/institution/InstitutionDashboard';
import ManagerDashboard from '../pages/manager/ManagerDashboard';
import MonitoringDashboard from '../pages/monitoring/MonitoringDashboard';

const AppRoutes = () => {
  const { isSignedIn } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/signup" element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Signup />} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

      <Route path="/student/*" element={<ProtectedRoute allowedRoles={['STUDENT']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/trainer/*" element={<ProtectedRoute allowedRoles={['TRAINER']}><TrainerDashboard /></ProtectedRoute>} />
      <Route path="/institution/*" element={<ProtectedRoute allowedRoles={['INSTITUTION']}><InstitutionDashboard /></ProtectedRoute>} />
      <Route path="/manager/*" element={<ProtectedRoute allowedRoles={['MANAGER']}><ManagerDashboard /></ProtectedRoute>} />
      <Route path="/monitoring/*" element={<ProtectedRoute allowedRoles={['MONITORING']}><MonitoringDashboard /></ProtectedRoute>} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
