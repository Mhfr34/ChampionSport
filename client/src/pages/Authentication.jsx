import { Modal } from "@mui/material";
import React, { useState } from "react";
import styled from "styled-components";
import LogoImage from "../utils/Images/logo.png";
import AuthImage from "../utils/Images/AuthImage.jpg";
import { Close } from "@mui/icons-material";
import SignIn from "../components/SignIn";
import SignUp from "../components/SignUp";
import ForgotPassword from "../components/ForgotPassword";

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
  &:hover {
    background: ${({ theme }) => theme.primary + 20};
  }
`;

const Text = styled.p`
  display: flex;
  gap: 12px;
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.text_secondary};
  margin-top: 16px;
  @media (max-width: 400px) {
    font-size: 14px;
  }
`;

const TextButton = styled.div`
  color: ${({ theme }) => theme.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
`;

const Authentication = ({ openAuth, setOpenAuth }) => {
  const [view, setView] = useState("login"); // Track current view ("login", "signup", "forgotPassword")

  const handleClose = () => {
    setView("login"); // Reset to login view on modal close
    setOpenAuth(false);
  };

  return (
    <Modal open={openAuth} onClose={handleClose}>
      <Container>
        <Left>
          <Logo src={LogoImage} />
          <Image src={AuthImage} />
        </Left>
        <Right>
          <CloseButton>
            <Close onClick={handleClose} />
          </CloseButton>
          {view === "login" ? (
            <>
              <SignIn setOpenAuth={setOpenAuth} onForgotPassword={() => setView("forgotPassword")} />
              <Text onClick={() => setView("signup")}>
                Don't have an account? <TextButton>Sign Up</TextButton>
              </Text>
            </>
          ) : view === "signup" ? (
            <>
              <SignUp setOpenAuth={setOpenAuth} />
              <Text>
                Already have an account? <TextButton onClick={() => setView("login")}>Sign In</TextButton>
              </Text>
            </>
          ) : (
            <ForgotPassword setOpenAuth={setOpenAuth} />
          )}
        </Right>
      </Container>
    </Modal>
  );
};

export default Authentication;
