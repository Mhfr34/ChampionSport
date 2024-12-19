import React, { useState, useEffect, useCallback, useMemo } from "react";
import styled from "styled-components";
import axios from "axios";
import { FiTrash, FiEdit, FiHeart } from "react-icons/fi";
import { toast } from "react-toastify";
import { useLocation, Link } from "react-router-dom";
import { debounce } from "lodash";
import UpdateProduct from "../components/UpdateProduct";
import SpinnerComponent from "../components/Spinner";

const Search = () => {
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userRole = useMemo(() => localStorage.getItem("userRole"), []);
  const authToken = useMemo(() => localStorage.getItem("authToken"), []);
  
  const location = useLocation();

  // Create axios instance with default config
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: process.env.REACT_APP_BACKEND_URL,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    });

    // Add request interceptor for error handling
    instance.interceptors.response.use(
      response => response,
      error => {
        const message = error.response?.data?.message || "An error occurred";
        toast.error(message);
        return Promise.reject(error);
      }
    );

    return instance;
  }, [authToken]);

  // Memoize search results fetch function
  const fetchSearchResults = useCallback(async (query) => {
    if (!query) return;
    setIsLoading(true);
    try {
      const response = await api.get(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.data.success) {
        setProducts(response.data.data);
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [api]);

  // Debounce search to prevent excessive API calls
  const debouncedSearch = useMemo(
    () => debounce(fetchSearchResults, 300),
    [fetchSearchResults]
  );

  // Memoize favorites fetch function
  const fetchFavorites = useCallback(async () => {
    if (!authToken) return;
    try {
      const response = await api.get('/api/get-favorite-products');
      if (response.data.success) {
        setFavorites(response.data.data || []);
      }
    } catch (error) {
      console.error("Favorites error:", error);
    }
  }, [api, authToken]);

  const handleFavoriteToggle = useCallback(async (productId, isFavorite) => {
    if (!authToken) {
      toast.error("Please login first!");
      return;
    }

    const endpoint = isFavorite
      ? '/api/remove-from-favorites'
      : '/api/add-to-favorites';

    try {
      const response = await api.post(endpoint, { productId });
      if (response.data.success) {
        setFavorites(prev => 
          isFavorite
            ? prev.filter(fav => fav._id !== productId)
            : [...prev, { _id: productId }]
        );
        toast.success(isFavorite ? "Removed from favorites!" : "Added to favorites!");
      }
    } catch (error) {
      console.error("Favorite toggle error:", error);
    }
  }, [api, authToken]);

  const handleDeleteClick = useCallback(async (productId) => {
    if (!authToken) {
      toast.error("Authentication required");
      return;
    }

    try {
      const response = await api.post('/api/delete-product', { productId });
      if (response.data.success) {
        setProducts(prev => prev.filter(product => product._id !== productId));
        toast.success("Product deleted successfully!");
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  }, [api, authToken]);

  // Memoize isFavorite check
  const isFavorite = useCallback((productId) => 
    favorites.some(favorite => favorite._id === productId),
    [favorites]
  );

  useEffect(() => {
    const query = new URLSearchParams(location.search).get("q");
    if (query) {
      debouncedSearch(query);
    }
    fetchFavorites();

    return () => {
      debouncedSearch.cancel();
    };
  }, [location.search, debouncedSearch, fetchFavorites]);

  // Handle modal close and update products in state
  const handleCloseModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedProduct(null);
    // Instead of refetching all products, just update the product list if modified
    const query = new URLSearchParams(location.search).get("q");
    if (query) {
      fetchSearchResults(query); // This triggers re-fetch if search query is still active
    }
  };

  return (
    <Container>
      <Title>Search Results: {products.length}</Title>
      {isLoading ? (
        <SpinnerComponent />
      ) : (
        <CardGrid>
          {products.map((product) => (
            <Card key={product._id}>
              {/* Prevent page reload on Link when editing or deleting */}
              <Link to={`/product/${product._id}`} onClick={(e) => {
                if (isUpdateModalOpen) {
                  e.preventDefault();  // Prevent navigation when modal is open
                }
              }}>
                <Image 
                  src={product.productImage[0]} 
                  alt={product.productName} 
                  loading="lazy"
                />
              </Link>
              <Icons>
                {userRole === "ADMIN" ? (
                  <>
                    <EditIcon onClick={() => {
                      setSelectedProduct(product);
                      setIsUpdateModalOpen(true);
                    }} />
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
                <Brand>{product.brandName}</Brand>
                <Price>${product.price}</Price>
                <Description>{product.description}</Description>
              </Info>
            </Card>
          ))}
        </CardGrid>
      )}

      {isUpdateModalOpen && (
        <UpdateProduct
          productData={selectedProduct}
          onClose={handleCloseModal}
        />
      )}
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
