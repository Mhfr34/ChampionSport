import React from "react";
import styled from "styled-components";
import { FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import LogoImg from "../utils/Images/logo.png";

const FooterContainer = styled.footer`
  background-color: #808080;
  color: ${({ theme }) => theme.text_secondary};
  padding: 20px 0;
  margin-top: auto;
  @media screen and (max-width: 768px) {
    padding: 10px 0;
  }
`;

const FooterContent = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  max-width: 1500px;
  margin: 0 auto;
  padding: 20px;
  @media screen and (max-width: 768px) {
    padding: 10px;
    flex-direction: column;
    align-items: center;
  }
`;

const Section = styled.div`
  flex: 1;
  max-width: 300px;
  margin: 10px 0px;
  @media screen and (max-width: 768px) {
    max-width: 100%;
    margin: 0;
    text-align: center;
  }
`;

const Logo = styled.img`
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  margin-top: -70px;
  @media screen and (max-width: 768px) {
    display: none; /* Hide the logo */
  }
`;

const Title = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: black;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 15px;
  font-size: 1.5rem;
  @media screen and (max-width: 768px) {
    justify-content: center;
  }
`;

const IconLink = styled.a`
  color: ${({ color }) => color};
  &:hover {
    opacity: 0.8;
  }
`;

const Footer = () => {
  return (
    <FooterContainer id="footer">
      <FooterContent>
        <Section>
          <Logo src={LogoImg} alt="Logo" />
        </Section>
        <Section style={{ maxWidth: "170px" }}>
          <Title>About Us</Title>
          <p style={{ color: "white" }}>Our Story</p>
          <p style={{ color: "white" }}>Careers</p>
          <p style={{ color: "white" }}>Sustainability</p>
          <p style={{ color: "white" }}>Terms of Service</p>
        </Section>
        <Section>
          <Title>Contact Information</Title>
          <p style={{ color: "white" }}>Email: support@sportswear.com</p>
          <p style={{ color: "white" }}>Phone: 71/491580</p>
          <p style={{ color: "white" }}>
          Address: Near Sfeir Bridge, directly opposite Harkous Restaurant.
          </p>
        </Section>
        <Section>
          <Title>Connect With Us</Title>
          <SocialIcons>
            <IconLink
              href="https://www.instagram.com/champions.sport.online/x"
              target="_blank"
              rel="noopener noreferrer"
              color="#E1306C"
            >
              <FaInstagram />
            </IconLink>
            <IconLink
              href="https://wa.me/96171491580"
              target="_blank"
              rel="noopener noreferrer"
              color="#25D366"
            >
              <FaWhatsapp />
            </IconLink>
            <IconLink
              href="https://www.tiktok.com/@champions.sports"
              target="_blank"
              rel="noopener noreferrer"
              color="#000000"
            >
              <FaTiktok />
            </IconLink>
          </SocialIcons>
        </Section>
      </FooterContent>
      <p
        style={{
          textAlign: "center",
          fontSize: "0.8rem",
          marginTop: "10px",
          color: "white",
        }}
      >
        &copy; {new Date().getFullYear()} Champions Sport. All Rights Reserved.
      </p>
    </FooterContainer>
  );
};

export default Footer;
