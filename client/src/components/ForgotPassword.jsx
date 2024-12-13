import React, { useState } from 'react';
import styled from 'styled-components';
import TextInput from './TextInput';
import Button from './Button';
import { CircularProgress } from '@mui/material';
import { toast } from 'react-toastify'; // for notifications

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  gap: 24px;
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

const Message = styled.div`
  color: ${({ isError }) => (isError ? 'red' : 'green')};
`;

const ForgotPassword = ({ setOpenAuth }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError('');
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }

    // Optional: Add email format validation
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setLoading(true);

      // Make API call similar to UploadProduct logic
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/forgot-password`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const responseData = await response.json();

      if (responseData.success) {
        setMessage('Password reset link sent to your email.');
        toast.success(responseData.message); // show success toast
      } else {
        setError(responseData.message || 'Something went wrong');
        toast.error(responseData.message); // show error toast
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
      toast.error('An error occurred'); // show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Title>Reset Your Password</Title>
      <Span>Enter your email to receive a password reset link</Span>
      <TextInput
        label="Email Address"
        placeholder="Enter your email address"
        name="email"
        value={email}
        handleChange={handleChange}
        error={error}
      />
      <Message isError={!!error}>{error || message}</Message>
      <Button
        text={loading ? <CircularProgress size={20} color="inherit" /> : 'Send Reset Link'}
        onClick={handleSubmit}
        disabled={loading}
      />
    </Container>
  );
};

export default ForgotPassword;
