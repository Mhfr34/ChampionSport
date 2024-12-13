import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FiHeart } from "react-icons/fi"; // Import heart icon
import { toast } from "react-toastify";
import { useLocation, Link } from "react-router-dom"; // Import Link for navigation

const Search = () => {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const location = useLocation();
    
    const fetchSearchResults = async (query) => {
      try {
        const response = await axios.get(`http://localhost:8080/api/search?q=${query}`);
        if (response.data.success) {
          setProducts(response.data.data);
        } else {
          toast.error("No products found.");
        }
      } catch (error) {
        toast.error("Error fetching search results.");
      }
    };
  
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;
  
        const response = await axios.get("http://localhost:8080/api/get-favorite-products", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (response.data.success) {
          setFavorites(response.data.data);
        } else {
          toast.error(response.data.message || "Failed to fetch favorite products.");
        }
      } catch (error) {
        toast.error("Error fetching favorites.");
      }
    };
  
    const handleFavoriteToggle = async (productId, isFavorite) => {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Please login first!");
        return;
      }
  
      const endpoint = isFavorite
        ? "http://localhost:8080/api/remove-from-favorites"
        : "http://localhost:8080/api/add-to-favorites";
  
      try {
        const response = await axios.post(endpoint, { productId }, { headers: { Authorization: `Bearer ${token}` } });
  
        if (response.data.success) {
          fetchFavorites();
          toast.success(isFavorite ? "Product removed from favorites!" : "Product added to favorites!");
        } else {
          toast.error("Failed to update favorites.");
        }
      } catch (error) {
        toast.error("An error occurred while updating favorites.");
      }
    };
  
    const isFavorite = (productId) => favorites.some((favorite) => favorite._id === productId);
  
    useEffect(() => {
      const query = new URLSearchParams(location.search).get("q");
      if (query) {
        fetchSearchResults(query);
      }
      fetchFavorites();
    }, [location.search]);
  
    return (
      <Container>
        <Title>
         Search Results: {products.length}
        </Title>
        <CardGrid>
          {products.map((product) => (
            <Card key={product._id}>
              <Link to={`/product/${product._id}`}>
                <Image src={product.productImage[0]} alt={product.productName} />
              </Link>
              <Icons>
                <HeartIcon
                  filled={isFavorite(product._id)}
                  onClick={() => handleFavoriteToggle(product._id, isFavorite(product._id))}
                />
              </Icons>
              <Info>
                <ProductName>{product.productName}</ProductName>
                <Brand>{product.brandName}</Brand>
                <Price>${product.price}</Price>
                <Description>{product.description}</Description>
              </Info>
            </Card>
          ))}
        </CardGrid>
      </Container>
    );
};

export default Search;

// Styled components for layout
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: transparent;
`;

const Title = styled.h2`
  text-align: left;
  margin-bottom: 20px;
  font-size: 18px;
  color: #222;
  font-weight: 500;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const Card = styled.div`
  position: relative;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const Image = styled.img`
  width: 100%;
  height: 180px;
  object-fit: contain;
  background-color: transparent;
`;

const Icons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
`;

const HeartIcon = styled(FiHeart)`
  color: ${({ filled }) => (filled ? "red" : "black")};
  background: white;
  fill: ${({ filled }) => (filled ? "red" : "white")};
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    color: red;
    fill: red;
  }
`;

const Info = styled.div`
  padding: 15px;
`;

const ProductName = styled.h2`
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 10px;
  color: #333;
`;

const Brand = styled.p`
  font-size: 14px;
  color: #666;
  margin: 0 0 5px;
`;

const Price = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #222;
  margin: 0 0 10px;
`;

const Description = styled.p`
  font-size: 14px;
  color: #777;
  line-height: 1.5;
`;