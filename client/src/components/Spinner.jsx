// Spinner.js
import React from 'react';
import styled, { keyframes } from 'styled-components';

// Keyframe animation for the spinner
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Styled spinner component
const SpinnerWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Spinner = styled.div`
  border: 8px solid #f3f3f3; /* Light grey background */
  border-top: 8px solid black; /* Blue color */
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 2s linear infinite;
`;

const SpinnerComponent = () => {
  return (
    <SpinnerWrapper>
      <Spinner />
    </SpinnerWrapper>
  );
};

export default SpinnerComponent;
