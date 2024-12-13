import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { HiArrowLongRight } from "react-icons/hi2";


const Card = styled.div`
  width: 500px;
  height: 500px;
  display: flex;
  transition: all 0.3s ease-out;
  cursor: pointer;
  &:hover {
    transform: translateY(-4px);
  }
  @media (max-width: 768px) {
    width: 100%;
    height: 370px;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  flex: 1;
  overflow: hidden;
`;

const Image = styled.img`
  width: 86%;
  height: 100%; 
  object-fit: fill;
  transition: transform 0.3s ease-out;
  &:hover {
    transform: scale(1.05);
  }
  @media (max-width: 768px) {
    width: 90%;
    height: 100%;
  }
`;

const Menu = styled.div`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: center;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    @media (max-width: 768px) {
   bottom: 40px;
  }
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 40px;
  color: black;
  width: 130px;
  background: white;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  border: 1px solid black; /* Black border */
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.15); /* Small shadow */
  transition: background 0.3s ease, transform 0.3s ease;

  &:hover {
    background: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 4px 15px;
  }
   
`;

const SPANE = styled.h3`
font-size:14px;
margin-right:10px;
  @media (max-width: 768px) {
   font-size:10px;
margin-right:10px;
  }

`

const ProductCategoryCard = ({ category }) => {
  const navigate = useNavigate();
  return (
    <Card onClick={() => navigate(`/filter-product?category=${category.name}`)}>
      <Top>
        <Image src={category.img} alt={category.name} />
        <Menu>
          <Button>
            <SPANE>{category.name}</SPANE>
            <HiArrowLongRight style={{ fontSize: "1.7rem"}} />
          </Button>
        </Menu>
      </Top>
    </Card>
  );
};

export default ProductCategoryCard;
