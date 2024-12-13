import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import TextInput from "./TextInput";
import Button from "./Button";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const SignUp = ({ setOpenAuth }) => {
  // Receive setOpenAuth as a prop
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validate password
    if (formData.password.length < 8) {
      setLoading(false);
      setError("Password must be at least 8 characters long." || error);
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    // Validate email format
    if (!validateEmail(formData.email)) {
      setLoading(false);
      setError("Please enter a valid email address.");
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/signup",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setSuccess("Account created successfully!");
      toast.success("Account created successfully!" || success);
      setOpenAuth(false); // Close the modal on successful signup
      console.log("Response:", response.data); // Debugging response
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      if (err.response?.status === 400) {
        setError(
          err.response?.data?.message || "An error occurred while signing up."
        );
        toast.error(
          err.response?.data?.message || "An error occurred while signing up."
        );
      } else {
        setError("An unexpected error occurred.");
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <div>
          <Title>Create New Account 👋</Title>
          <Span>Please enter details to create a new account</Span>
        </div>
        <div
          style={{
            display: "flex",
            gap: "20px",
            flexDirection: "column",
            marginTop: "30px",
          }}
        >
          <TextInput
            label="Full Name"
            placeholder="Enter your full name"
            name="name"
            value={formData.name}
            handleChange={handleChange}
          />
          <TextInput
            label="Email Address"
            placeholder="Enter your email address"
            name="email"
            value={formData.email}
            handleChange={handleChange}
          />
          <TextInput
            label="Password"
            placeholder="Enter your password"
            name="password"
            value={formData.password}
            handleChange={handleChange}
            password
          />
          <Button
            text={loading ? "Signing Up..." : "Sign Up"}
            onClick={handleSubmit} // Add this line to handle the click event
            disabled={loading}
          />
        </div>
      </form>
    </Container>
  );
};

export default SignUp;
