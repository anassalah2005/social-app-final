import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthContextProvider';
import { Navigate } from 'react-router-dom';

export default function Gard({ children }) {
  const { token } = useContext(AuthContext);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}