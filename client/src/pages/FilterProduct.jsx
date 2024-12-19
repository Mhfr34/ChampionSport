import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaFilter } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { FiTrash, FiEdit, FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import UpdateProduct from "../components/UpdateProduct";

const FilterProduct = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const categories = ["MEN", "SHOES", "KIDS", "BAGS", "ACCESSORIES"];

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const categoryParams = searchParams.get("category");
        const categoriesArray = categoryParams ? categoryParams.split(",") : [];
        setSelectedCategories(categoriesArray);

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/filter-product`, {
          category: categoriesArray.length ? categoriesArray : undefined,
        });

        setProducts(response.data.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    const fetchFavorites = async () => {
      const token = localStorage.getItem("authToken");
      if (!token) return;

      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get-favorite-products`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(response.data.data);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      }
    };

    const role = localStorage.getItem("userRole");
    setUserRole(role);

    fetchFilteredProducts();
    fetchFavorites();
  }, [location.search]);

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleCategorySelect = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((cat) => cat !== category)
      : [...selectedCategories, category];

    const searchParams = new URLSearchParams(location.search);
    updatedCategories.length
      ? searchParams.set("category", updatedCategories.join(","))
      : searchParams.delete("category");

    setSelectedCategories(updatedCategories);
    navigate({ search: searchParams.toString() });
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setIsUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteClick = async (productId) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Authentication token not found.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/delete-product`,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        toast.success("Product deleted successfully!");
        setProducts(products.filter((product) => product._id !== productId));
      } else {
        toast.error("Failed to delete the product.");
      }
    } catch (error) {
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
      ? `${process.env.REACT_APP_BACKEND_URL}/api/remove-from-favorites`
      : `${process.env.REACT_APP_BACKEND_URL}/api/add-to-favorites`;

    try {
      const response = await axios.post(
        endpoint,
        { productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updatedFavorites = isFavorite
          ? favorites.filter((fav) => fav._id !== productId)
          : [...favorites, products.find((product) => product._id === productId)];

        setFavorites(updatedFavorites);
        toast.success(isFavorite ? "Removed from favorites!" : "Added to favorites!");
      } else {
        toast.error("Failed to update favorites.");
      }
    } catch (error) {
      toast.error("An error occurred while updating favorites.");
    }
  };

  const isFavorite = (productId) => {
    return Array.isArray(favorites) && favorites.some((favorite) => favorite._id === productId); // Ensure favorites is an array before using .some()
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <Title>Filter Products</Title>
      <FilterContainer>
        <FilterButton onClick={toggleDropdown}>
          <FaFilter size={18} style={{ marginRight: "8px" }} />
          <BsChevronDown size={14} />
        </FilterButton>
        {dropdownOpen && (
          <DropdownMenu>
            {categories.map((category) => (
              <DropdownItem key={category}>
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategorySelect(category)}
                />
                {category}
              </DropdownItem>
            ))}
          </DropdownMenu>
        )}
      </FilterContainer>

      <CardGrid>
        {products.map((product) => (
          <Card key={product._id}>
            <Link to={`/product/${product._id}`}>
            <Image src={product.productImage[0]} alt={product.productName} />
            </Link> 
            <Icons>
              {userRole === "ADMIN" ? (
                <>
                  <EditIcon onClick={() => handleEditClick(product)} />
                  <TrashIcon onClick={() => handleDeleteClick(product._id)} />
                </>
              ) : (
                <HeartIcon
                  filled={isFavorite(product._id)}
                  onClick={() => handleFavoriteToggle(product._id, isFavorite(product._id))}
                />
              )}
            </Icons>
            <Info>
              <ProductName>{product.productName}</ProductName>
              <Brand>{product.category}</Brand>
              <Price>${product.price}</Price>
              <Description>{product.description}</Description>
            </Info>
          </Card>
        ))}
      </CardGrid>

      {isUpdateModalOpen && (
        <UpdateProduct productData={selectedProduct} onClose={handleCloseModal} />
      )}
    </Container>
  );
};

export default FilterProduct;


// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
  color: #222;
  font-size: 28px;
`;

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 20px;
`;

const FilterButton = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  color: black;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 50px;
  left: 0;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 200px;
`;

const DropdownItem = styled.label`
  display: flex;
  align-items: center;
  padding: 10px 15px;
  cursor: pointer;
  font-size: 14px;
  color: #333;

  input {
    margin-right: 10px;
  }

  &:hover {
    background-color: #f5f5f5;
  }
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
`;

const Image = styled.img`
  width: 100%;
  height: 280px;

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
  transition: transform 0.3s, background 0.3s, color 0.3s;

  &:hover {
    background: black;
    color: white;
    transform: scale(1.1);
  }
`;

const TrashIcon = styled(FiTrash)`
  background: white;
  color: black;
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.3s, background 0.3s, color 0.3s;

  &:hover {
    background: black;
    color: white;
    transform: scale(1.1);
  }
`;

const HeartIcon = styled(FiHeart)`
  color: ${({ filled }) => (filled ? "red" : "black")};
  background: white;
  fill: ${({ filled }) => (filled ? "red" : "white")};
  padding: 5px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.3s, color 0.3s, fill 0.3s;

  &:hover {
    color: red;
    fill: red;
    transform: scale(1.1);
  }
`;


const Info = styled.div`
  padding: 15px;
`;

const ProductName = styled.h2`
  font-size: 18px;
  margin-bottom: 10px;
`;

const Price = styled.p`
  font-size: 16px;
  font-weight: bold;
  color: #222;
  margin: 0 0 10px;
`;

const Brand = styled.p`
  font-size: 14px;
  color: #666;
`;
const Description = styled.p`
  font-size: 14px;
  color: #777;
  line-height: 1.5;
`;