import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { Link } from "react-router-dom";
import { FiTrash, FiEdit, FiHeart } from "react-icons/fi"; // Import icons
import { toast } from "react-toastify";
import UpdateProduct from "./UpdateProduct"; // Assuming this is your UpdateProduct modal

// Reusable ProductCard component for each product
const ProductCard = ({ product, onEdit, onDelete, onFavoriteToggle, isFavorite, userRole }) => {
  return (
    <Card>
      <Link to={`/product/${product._id}`}>
        <Image src={product.productImage[0]} alt={product.productName} />
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
};

// Main NewArrivals component
const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [favorites, setFavorites] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/get-all-product");
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
      if (!token) {
       
        return;
      }
  
      const response = await axios.get("http://localhost:8080/api/get-favorite-products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.data.success) {
        const favoritesData = response.data.data;
        setFavorites(favoritesData); // Store the favorite products
  
        // Show toast only if the favorites list is empty and it has not been shown before
        if (favoritesData.length === 0 && !localStorage.getItem("favoritesChecked")) {
          toast.info("Your favorites list is empty.");
          localStorage.setItem("favoritesChecked", "true"); // Mark the favorites list check
        }
      } else {
        toast.error(response.data.message || "Failed to fetch favorite products.");
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("An error occurred while fetching favorite products.");
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
        "http://localhost:8080/api/delete-product",
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
      const response = await axios.post(
        endpoint,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (response.data.success) {
        // After the favorite toggle, check if the product was removed or added and update the toast accordingly
        if (isFavorite) {
          toast.success("Product removed from favorites!");
        } else {
          toast.success("Product added to favorites!");
        }
        
        // Fetch updated favorite list only once after the action
        fetchFavorites();
      } else {
        toast.error("Failed to update favorites.");
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
      toast.error("An error occurred while updating favorites.");
    }
  };
  

  const isFavorite = (productId) => favorites.some((favorite) => favorite._id === productId);

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

