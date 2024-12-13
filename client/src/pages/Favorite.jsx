import React, { useEffect, useState, useCallback, useRef } from "react";
import styled from "styled-components";
import axios from "axios";
import { toast } from "react-toastify";
import { FiHeart } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

// Reusable ProductCard component
const ProductCard = ({ product, onFavoriteToggle, isFavorite }) => {
  return (
    <Card>
      <Link to={`/product/${product._id}`}>
        <Image src={product.productImage[0]} alt={product.productName} />
      </Link>
      <Icons>
        <HeartIcon
          filled={isFavorite}
          onClick={() => onFavoriteToggle(product._id, isFavorite)}
        />
      </Icons>
      <Info>
        <ProductName>{product.productName}</ProductName>
        <Brand>{product.brandName}</Brand>
        <Price>${product.price}</Price>
        <Description>{product.description}</Description>
      </Info>
    </Card>
  );
};

// Main Favorite component
const Favorite = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const toastDisplayed = useRef(false);

  const fetchFavorites = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      if (!token) {
        if (!toastDisplayed.current) {
          toast.error("Please log in to view your favorites.");
          toastDisplayed.current = true; // Mark toast as displayed
        }
        navigate("/");
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get-favorite-products`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setFavorites(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch favorite products.");
      }
    } catch (err) {
      setError(err.message || "An error occurred while fetching favorites.");
    } finally {
      setLoading(false);
    }
  }, [navigate]);
  const handleFavoriteToggle = async (productId, isFavorite) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Please login first!");
      return;
    }

    const endpoint = isFavorite
      ? `${process.env.REACT_APP_BACKEND_URL}/api/remove-from-favorites`
      : `${process.env.REACT_APP_BACKEND_URL}/api/add-to-favorites`;

    try {
      const response = await axios.post(
        endpoint,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success(
          isFavorite
            ? "Product removed from favorites!"
            : "Product added to favorites!"
        );
        fetchFavorites();
      } else {
        toast.error("Failed to update favorites.");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("An error occurred while updating favorites.");
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const isFavorite = (productId) =>
    favorites.some((favorite) => favorite._id === productId);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage>{error}</ErrorMessage>;
  }

  if (favorites.length === 0) {
    return <EmptyMessage>No favorite products found.</EmptyMessage>;
  }

  return (
    <Container>
      <Title>Your Favorite Products</Title>
      <CardGrid>
        {favorites.map((favorite) => (
          <ProductCard
            key={favorite._id}
            product={favorite}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={isFavorite(favorite._id)}
          />
        ))}
      </CardGrid>
    </Container>
  );
};

export default Favorite;

// Styled components for layout
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  background-color: transparent;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #222;
  font-size: 28px;
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

const ErrorMessage = styled.div`
  text-align: center;
  color: red;
  font-size: 16px;
`;

const EmptyMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #555;
`;
