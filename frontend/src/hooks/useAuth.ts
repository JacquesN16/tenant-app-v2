import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { AxiosError } from 'axios';

export const useAuth = () => {
  interface UserAuth {
  email: string;
}

  const [user, setUser] = useState<UserAuth | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', response.data.accessToken);
      setUser({ email });
      toast.success('Logged in successfully!');
      navigate('/properties');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'Signup failed';
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err.message || 'Signup failed');
        toast.error(err.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/signup', { firstName, lastName, email, password });
      toast.success(response.data.message);
      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'Signup failed';
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err.message || 'Signup failed');
        toast.error(err.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      toast.success(response.data.message);
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'Forgot password request failed';
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err.message || 'Forgot password request failed');
        toast.error(err.message || 'Forgot password request failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (token: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/reset-password', { token, password });
      toast.success(response.data.message);
      navigate('/login');
    } catch (err: unknown) {
      if (err instanceof AxiosError) {
        const errorMessage = err.response?.data?.message || 'Password reset failed';
        setError(errorMessage);
        toast.error(errorMessage);
      } else if (err instanceof Error) {
        setError(err.message || 'Password reset failed');
        toast.error(err.message || 'Password reset failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
    navigate('/login');
  };

  return { user, loading, error, login, signup, forgotPassword, resetPassword, logout };
};
