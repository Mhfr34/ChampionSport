import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { FaFilter } from "react-icons/fa";
import { BsChevronDown } from "react-icons/bs";
import { FiTrash, FiEdit, FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import UpdateProduct from "../components/UpdateProduct";
import SpinnerComponent from "../components/Spinner";

const FilterProduct = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const userRole = useMemo(() => localStorage.getItem("userRole"), []);
  const authToken = useMemo(() => localStorage.getItem("authToken"), []);

  const categories = ["MEN", "SHOES", "KIDS", "BAGS", "ACCESSORIES"];

  // Create axios instance with default config
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URL,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });

    // Add request interceptor for error handling
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        const message = error.response?.data?.message || "An error occurred";
        toast.error(message);
        return Promise.reject(error);
      }
    );

    return instance;
  }, [authToken]);

  // Fetch products based on selected categories
  const fetchFilteredProducts = useCallback(
    async (categoriesArray) => {
      setLoading(true);
      try {
        const response = await api.post(
          `${process.env.REACT_APP_BACKEND_URL}/api/filter-product`,
          {
            category: categoriesArray.length ? categoriesArray : undefined,
          }
        );
        setProducts(response.data.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [api]
  );

  // Fetch favorites list
  const fetchFavorites = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await api.get("/api/get-favorite-products");
      if (response.data.success) {
        setFavorites(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, [api, authToken]);

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

  const handleFavoriteToggle = async (productId, isFavorite) => {
    if (!authToken) {
      toast.error("Please login first!");
      return;
    }

    const endpoint = isFavorite
      ? "/api/remove-from-favorites"
      : "/api/add-to-favorites";

    try {
      const response = await api.post(endpoint, { productId });
      if (response.data.success) {
        const updatedFavorites = isFavorite
          ? favorites.filter((fav) => fav._id !== productId)
          : [
              ...favorites,
              products.find((product) => product._id === productId),
            ];

        setFavorites(updatedFavorites);
        toast.success(
          isFavorite ? "Removed from favorites!" : "Added to favorites!"
        );
      }
    } catch (error) {
      toast.error("An error occurred while updating favorites.");
    }
  };

  const handleDeleteClick = async (productId) => {
    if (!authToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      const response = await api.post("/api/delete-product", { productId });
      if (response.data.success) {
        setProducts((prev) =>
          prev.filter((product) => product._id !== productId)
        );
        toast.success("Product deleted successfully!");
      }
    } catch (error) {
      toast.error("An error occurred while deleting the product.");
    }
  };

  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
  };

  const isFavorite = (productId) => {
    return favorites.some((favorite) => favorite._id === productId);
  };

  // Debounce filter updates
  const debouncedFetchFilteredProducts = useMemo(
    () => debounce(fetchFilteredProducts, 300),
    [fetchFilteredProducts]
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoriesArray = queryParams.get("category")
      ? queryParams.get("category").split(",")
      : [];
    setSelectedCategories(categoriesArray);
    debouncedFetchFilteredProducts(categoriesArray);
    fetchFavorites();

    return () => {
      debouncedFetchFilteredProducts.cancel();
    };
  }, [location.search, debouncedFetchFilteredProducts, fetchFavorites]);

  if (loading) return <SpinnerComponent />;
  if (error) return <div>Error: {error}</div>;

  return (
    <Container>
      <Title>Filter Products</Title>
      <FilterContainer>
        <FilterButton onClick={() => setDropdownOpen(!dropdownOpen)}>
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
            <CategoryLabel category={product.category}>
              {product.category}
            </CategoryLabel>
            <Link
              to={`/product/${product._id}`}
              onClick={(e) => {
                if (isUpdateModalOpen) {
                  e.preventDefault(); // Prevent navigation when modal is open
                }
              }}
            >
              <Image
                src={product.productImage[0]}
                alt={product.productName}
                loading="lazy"
              />
            </Link>
            <Icons>
              {userRole === "ADMIN" ? (
                <>
                  <EditIcon
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsUpdateModalOpen(true);
                    }}
                  />
                  <TrashIcon onClick={() => handleDeleteClick(product._id)} />
                </>
              ) : (
                <HeartIcon
                  filled={isFavorite(product._id)}
                  onClick={() =>
                    handleFavoriteToggle(product._id, isFavorite(product._id))
                  }
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
        ))}
      </CardGrid>

      {isUpdateModalOpen && (
        <UpdateProduct
          productData={selectedProduct}
          onClose={handleCloseModal}
        />
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
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

const CategoryLabel = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${({ category }) => getCategoryColor(category)};
  color: white;
  font-size: 12px;
  font-weight: bold;
  padding: 5px 10px;
  border-radius: 5px;
  text-transform: uppercase;
`;

// Function to return the background color based on the category
const getCategoryColor = (category) => {
  switch (category) {
    case "MEN":
      return "#007BFF"; // Blue
    case "BAGS":
      return "#28A745"; // Green
    case "KIDS":
      return "#FFC107"; // Yellow
    case "SHOES":
      return "#DC3545"; // Red
    case "ACCESSORIES":
      return "#6F42C1"; // Purple
    default:
      return "#6C757D"; // Gray
  }
};

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
