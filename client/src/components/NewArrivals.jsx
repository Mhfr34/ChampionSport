import React, { useEffect, useState, memo } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiTrash, FiEdit, FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import UpdateProduct from "./UpdateProduct"; // Assuming this is your UpdateProduct modal

// LazyLoad for product images
import LazyLoad from "react-lazyload";

// Debounce utility function
const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

// Reusable ProductCard component
const ProductCard = memo(
  ({ product, onEdit, onDelete, onFavoriteToggle, isFavorite, userRole }) => {
    return (
      <Card>
        <Link to={`/product/${product._id}`}>
          <LazyLoad height={200} offset={100}>
            <Image src={product.productImage[0]} alt={product.productName} />
          </LazyLoad>
        </Link>
        <Icons>
          {userRole === "ADMIN" ? (
            <>
              <EditIcon onClick={() => onEdit(product)} />
              <TrashIcon onClick={() => onDelete(product._id)} />
            </>
          ) : (
            <HeartIcon
              filled={isFavorite}
              onClick={() => onFavoriteToggle(product._id, isFavorite)}
            />
          )}
        </Icons>
        <Info>
          <ProductName>{product.productName}</ProductName>
          <Brand>{product.brandName}</Brand>
          <Price>${product.price}</Price>
          <Description>{product.description}</Description>
        </Info>
      </Card>
    );
  }
);

// Main NewArrivals component
const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get-all-product`
      );
      if (response.data.success) {
        setProducts(response.data.data);
      } else {
        console.error("Failed to fetch products");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/api/get-favorite-products`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setFavorites(response.data.data);
      } else {
        console.log("Failed to fetch favorite products.");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    setUserRole(role);
    fetchProducts();
    fetchFavorites();
  }, []);

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
    fetchProducts();
  };

  const handleDeleteClick = async (productId) => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        toast.error("Authentication token not found.");
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/delete-product`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Product deleted successfully!");
        fetchProducts();
      } else {
        toast.error("Failed to delete the product.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product.");
    }
  };

  const handleFavoriteToggle = debounce(async (productId, isFavorite) => {
    const updatedFavorites = isFavorite
      ? favorites.filter((fav) => fav._id !== productId)
      : [...favorites, { _id: productId }];

    setFavorites(updatedFavorites);

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

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to update favorites");
      }

      toast.success(
        isFavorite
          ? "Product removed from favorites!"
          : "Product added to favorites!"
      );
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("An error occurred while updating favorites.");
      setFavorites(favorites); // Rollback on error
    }
  }, 300);

  const isFavorite = (productId) =>
    favorites.some((favorite) => favorite._id === productId);

  return (
    <Container>
      <Title>New Arrivals</Title>
      <CardGrid>
        {products.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onFavoriteToggle={handleFavoriteToggle}
            isFavorite={isFavorite(product._id)}
            userRole={userRole}
          />
        ))}
      </CardGrid>

      {isUpdateModalOpen && (
        <UpdateProduct productData={selectedProduct} onClose={handleCloseModal} />
      )}
    </Container>
  );
};

export default NewArrivals;

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
  height: 280px;
  background-color: transparent;
`;

const Icons = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
`;

const EditIcon = styled(FiEdit)`
  background: white;
  color: black;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: black;
    color: white;
  }
`;

const TrashIcon = styled(FiTrash)`
  background: white;
  color: black;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;

  &:hover {
    background: black;
    color: white;
  }
`;

const HeartIcon = styled(FiHeart)`
  color:${({ filled }) => (filled ? "red" : "black")};
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

