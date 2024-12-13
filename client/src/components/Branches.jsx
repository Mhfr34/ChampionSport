import React, { useState } from "react";
import styled from "styled-components";
import { branches } from "../helpers/branches";

const Branches = () => {
  const [selectedBranch, setSelectedBranch] = useState(branches[0]);

  return (
    <Container>
      <BranchDetails>
        <BranchImage src={selectedBranch.img} alt={selectedBranch.name} />
        <BranchName>{selectedBranch.name}</BranchName>
        <BranchLocation>{selectedBranch.location}</BranchLocation>
      </BranchDetails>
      <CircleContainer>
        {branches.map((branch, index) => (
          <Circle
            key={index}
            onClick={() => setSelectedBranch(branch)}
            isActive={selectedBranch.name === branch.name}
          >
            <CircleImage src={branch.img} alt={branch.name} />
          </Circle>
        ))}
      </CircleContainer>
    </Container>
  );
};

export default Branches;

// Styled Components
const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const CircleContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 30px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 15px;
  }

  @media (max-width: 480px) {
    gap: 10px;
  }
`;

const Circle = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 3px solid ${({ isActive }) => (isActive ? "#000" : "#ddd")};
  overflow: hidden;
  cursor: pointer;
  transition: border 0.3s;

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }

  @media (max-width: 480px) {
    width: 60px;
    height: 60px;
  }
`;

const CircleImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BranchDetails = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 15px;
  }

  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

const BranchImage = styled.img`
  width: 1200px;
  max-height: 500px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 20px;

  @media (max-width: 768px) {
  width: 600px;
    max-height: 350px;
  }

  @media (max-width: 480px) {
    max-height: 200px;
    width: 600px;
  }
`;

const BranchName = styled.h4`
  font-size: 24px;
  margin: 10px 0 5px;

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const BranchLocation = styled.p`
  font-size: 18px;
  color: #555;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
`;
