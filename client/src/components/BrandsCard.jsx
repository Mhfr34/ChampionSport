import React from 'react';
import styled from 'styled-components';

const brands = [
  { name: 'Adidas', logo: 'https://lb.mikesport.com/cdn/shop/files/Adidas_b9e2c5a8-933b-4c6c-9523-b5af43b38908.jpg?v=1665650823' },
  { name: 'New Balance', logo: 'https://lb.mikesport.com/cdn/shop/files/New_Balance_5788c863-30fc-45b7-a6d3-27ecb75f79ef.jpg?v=1665650973' },
  { name: 'Under Armour', logo: 'https://download.logo.wine/logo/Under_Armour/Under_Armour-Logo.wine.png' },
  { name: 'Reebok', logo: 'https://logos-world.net/wp-content/uploads/2020/05/Reebok-Logo.jpg' },
  { name: 'The North Face', logo: 'https://lb.mikesport.com/cdn/shop/files/tnf_1e4516de-5b94-4869-ae7a-6053d7b1712d.jpg?v=1614352432' },
  { name: 'Nike', logo: 'https://lb.mikesport.com/cdn/shop/files/Nike_New_Logo.png?v=1730188678' },
];

const BrandsCard = () => {
  return (
    <div style={{ marginLeft: "20px" }}>
      <Title>Top Brands</Title>
      <BrandsContainer>
        {brands.map((brand, index) => (
          <BrandBox key={index}>
            <BrandLogo src={brand.logo} alt={brand.name} />
          </BrandBox>
        ))}
      </BrandsContainer>
    </div>
  );
};

export default BrandsCard;

// Styled Components
const Title = styled.h2`
  font-weight: bold;
  color: black;
  text-align: left;
  margin-bottom: 20px;
`;

const BrandsContainer = styled.div`
  display: flex;
  justify-content: center; /* Ensure equal spacing between items */
  width: 100%;
  align-items: center;
  gap: 20px;
  @media (max-width: 768px) {
    justify-content: center;
    gap: 20px; /* Adjust gap to 20px on smaller screens */
    margin-right: 15px;
  }
`;

const BrandBox = styled.div`
  width: 210px;
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  @media (max-width: 768px) {
    width: 152px;
    height: 152px;
  }
  @media (min-width: 1600px) {
    width: 220px;
    height: 220px;
  }
`;

const BrandLogo = styled.img`
  max-width: 80%;
  max-height: 80%;
  object-fit: contain;
  cursor: pointer;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;
