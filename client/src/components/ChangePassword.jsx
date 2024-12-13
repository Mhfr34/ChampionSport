import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { toast } from 'react-toastify';
import LogoImage from '../utils/Images/logo.png';
import AuthImage from '../utils/Images/AuthImage.jpg';
import TextInput from './TextInput';
import Button from './Button';
import { Close } from '@mui/icons-material';
import { Modal } from '@mui/material';

// Full screen modal to cover the entire viewport
const Container = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  background: ${({ theme }) => theme.bg};
`;

const Left = styled.div`
  flex: 1;
  position: relative;
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

const Right = styled.div`
  flex: 0.9;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 40px;
  gap: 16px;
  @media screen and (max-width: 768px) {
    flex: 1;
  }
`;

const Logo = styled.img`
  position: absolute;
  top: -25px;
  left: 20px;
  z-index: 10;
  height: 150px;
  width: 150px;
`;

const Image = styled.img`
  position: relative;
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  border-radius: 50%;
  padding: 2px;
  width: 32px;
  height: 32px;
  border: 1px solid ${({ theme }) => theme.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  &:hover {
    background: ${({ theme }) => theme.primary + 20};
  }
`;

const Title = styled.div`
  font-size: 25px;
  font-weight: 800;
  color: ${({ theme }) => theme.primary};
  text-align: center;
`;

const Span = styled.div`
  font-size: 16px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary + 90};
  margin-bottom: 20px;
  text-align: center;
`;

const ChangePassword = ({ onClose }) => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError({
      ...error,
      [e.target.name]: '',
    });
  };

  const handleClose = () => {
    onClose(); // Call the onClose function
    navigate('/'); // Redirect to home page
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;
    const newErrors = {};

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
      isValid = false;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }
    setError(newErrors);

    if (!isValid) return;

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/reset-password/${token}`,
        { newPassword: formData.newPassword }
      );

      if (response.data.success) {
        toast.success('Password has been reset successfully');
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open onClose={handleClose}>
      <Container>
        <Left>
          <Logo src={LogoImage} />
          <Image src={AuthImage} />
        </Left>
        <Right>
          <CloseButton onClick={handleClose}>
            <Close />
          </CloseButton>
          <Title>Reset Password</Title>
          <Span>Please enter your new password</Span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <TextInput
              label="New Password"
              placeholder="Enter new password"
              name="newPassword"
              value={formData.newPassword}
              handleChange={handleChange}
              error={error.newPassword}
              password={true}
            />
            <TextInput
              label="Confirm Password"
              placeholder="Confirm new password"
              name="confirmPassword"
              value={formData.confirmPassword}
              handleChange={handleChange}
              error={error.confirmPassword}
              password={true}
            />
            <Button
              text={loading ? 'Resetting...' : 'Reset Password'}
              onClick={handleSubmit}
              disabled={loading}
            />
          </div>
        </Right>
      </Container>
    </Modal>
  );
};

export default ChangePassword;