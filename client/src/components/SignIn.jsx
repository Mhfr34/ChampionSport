import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';
// import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 36px;
`;

const Title = styled.div`
  font-size: 25px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
`;

const TextButton = styled.div`
  width: 100%;
  text-align: end;
  color: ${({ theme }) => theme.text_primary};
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  &:hover {
    color: ${({ theme }) => theme.primary};
  }
`;

const SignIn = ({ setOpenAuth, onForgotPassword }) => {
  // const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState({
    email: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError({
      ...error,
      [e.target.name]: '', // Clear specific error on typing
    });
    setServerError(''); // Clear server error on typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    let isValid = true;
    if (!formData.email) {
      setError((prevError) => ({
        ...prevError,
        email: 'Email is required',
      }));
      isValid = false;
    }
    if (!formData.password) {
      setError((prevError) => ({
        ...prevError,
        password: 'Password is required',
      }));
      isValid = false;
    }

    if (!isValid) return;

    try {
      setLoading(true);
      // Send sign-in request to the backend
      const response = await axios.post(
        'http://localhost:8080/api/login',
        formData,
        {
          withCredentials: true, // To handle cookies for JWT
        }
      );

      // Handle successful login
      if (response.data.success) {
        localStorage.setItem('authToken', response.data.data.token); // Store JWT token
        localStorage.setItem('userRole', response.data.data.role); // Store user role
        localStorage.setItem('userId', response.data.data._id); // Make sure _id is not undefined // Store user ID
        setOpenAuth(false); // Close SignIn modal after successful login
        window.location.reload(); // Refresh the page to update authentication state
      } else {
        setServerError(response.data.message); // Set error message from server
      }
    } catch (err) {
      setServerError(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div>
        <Title>Welcome to Champions Sport 👋</Title>
        <Span>Please login with your details here</Span>
      </div>
      <div style={{ display: 'flex', gap: '20px', flexDirection: 'column' }}>
        <TextInput
          label="Email Address"
          placeholder="Enter your email address"
          name="email"
          value={formData.email}
          handleChange={handleChange}
          error={error.email}
        />
        <TextInput
          label="Password"
          placeholder="Enter your password"
          name="password"
          value={formData.password}
          handleChange={handleChange}
          error={error.password}
          password={true}
        />
        <TextButton onClick={onForgotPassword}>Forgot Password?</TextButton>
        {serverError && <div style={{ color: 'red' }}>{serverError}</div>}
        <Button
          text={loading ? 'Signing In...' : 'Sign In'}
          onClick={handleSubmit}
          disabled={loading}
        />
      </div>
    </Container>
  );
};

export default SignIn;
