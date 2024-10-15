import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { CircularProgress } from '@mui/material';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className='min-h-screen flex flex-col items-center justify-center'>
    <CircularProgress/>
  </div>;

  return user ? children : navigate('/');
};

export default ProtectedRoute;
