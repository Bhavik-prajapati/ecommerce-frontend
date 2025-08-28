import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import api from "../store/api";

const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const [isValid, setIsValid] = useState(null); 

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsValid(false);
        return;
      }
      try {
        const res = await api.post(
          "auth/verify",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setIsValid(res.data.valid);
      } catch (err) {
        setIsValid(false);
      }
    };

    checkAuth();
  }, [token]);

  if (isValid === null) return <p>Loading...</p>; 
  if (!isValid) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
