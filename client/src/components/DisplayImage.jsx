import React from 'react';
import styled from 'styled-components';
import { CgClose } from 'react-icons/cg';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Container = styled.div`
  background-color: white;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  max-width: 80vw;
  max-height: 80vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.div`
  margin-left: auto;
  font-size: 24px;
  cursor: pointer;
  color: inherit;
  &:hover {
    color: #e3342f;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 16px;
  max-width: 80vh;
  max-height: 80vh;
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
`;

const DisplayImage = ({ imgUrl, onClose }) => {
  return (
    <Overlay>
      <Container>
        <CloseButton onClick={onClose}>
          <CgClose />
        </CloseButton>
        <ImageWrapper>
          <StyledImage src={imgUrl} alt="display" />
        </ImageWrapper>
      </Container>
    </Overlay>
  );
};

export default DisplayImage;
