import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

// Styled components
const Container = styled.div`
  padding: 20px;
  text-align: center;
`;

const ProductsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: stretch;
  gap: 16px;
`;

const ProductCard = styled(Link)` /* Updated to be a Link component */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  width: 250px;
  background-color: #fff;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  text-decoration: none; /* Remove underline */
  color: inherit; /* Inherit text color */

  &:hover {
    transform: scale(1.05);
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 50%;
  border-radius: 8px;
  margin-bottom: 10px;
`;

const ProductName = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 8px;
  height: 48px;
  overflow: hidden;
`;

const BrandName = styled.p`
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 8px;
  height: 20px;
  overflow: hidden;
`;

const ProductDescription = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 8px;
  height: 60px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ProductPrice = styled.p`
  font-weight: bold;
  font-size: 1rem;
  color: #000;
`;

const LoadingText = styled.p`
  font-size: 1rem;
  color: #888;
`;

const ErrorText = styled.p`
  font-size: 1rem;
  color: red;
`;

const SeeMoreContainer = styled.div`
  margin-top: 20px;
  margin-right: 140px;
  text-align: right;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const SeeMoreLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  font-size: 1rem;
  color: black;
  text-decoration: none;
  font-weight: bold;

  &:hover {
    color: grey;
    text-decoration: underline;
  }

  svg {
    margin-left: 8px;
  }
`;

const NewArrivalsLimited = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/api/last-eight-product`
        );
        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Error fetching products");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <LoadingText>Loading...</LoadingText>;
  if (error) return <ErrorText>Error: {error}</ErrorText>;

  return (
    <Container>
      <ProductsGrid>
        {products.map((product) => (
          <ProductCard key={product._id} to={`/product/${product._id}`}> {/* Navigate to product/:id */}
            <ProductImage
              src={product.productImage[0]}
              alt={product.productName}
            />
            <ProductName>{product.productName}</ProductName>
            <BrandName>{product.brandName}</BrandName>
            <ProductDescription>{product.description}</ProductDescription>
            <ProductPrice>${product.price}</ProductPrice>
          </ProductCard>
        ))}
      </ProductsGrid>
      <SeeMoreContainer>
        <SeeMoreLink to="/New_arrivals">
          See More <FaArrowRight />
        </SeeMoreLink>
      </SeeMoreContainer>
    </Container>
  );
};

export default NewArrivalsLimited;
