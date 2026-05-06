import { useAppAuth } from '../context/AuthContext';

const useAuth = () => {
  const { user, loading, isSignedIn, signIn, signOut, setUser } = useAppAuth();

  return {
    user,
    loading,
    isSignedIn,
    signIn,
    signOut,
    setUser,
    role: user?.role,
    isStudent: user?.role === 'STUDENT',
    isTrainer: user?.role === 'TRAINER',
    isInstitution: user?.role === 'INSTITUTION',
    isManager: user?.role === 'MANAGER',
    isMonitoring: user?.role === 'MONITORING',
  };
};

export default useAuth;
