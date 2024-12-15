import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { FiTrash, FiEdit, FiHeart } from "react-icons/fi"; // Import icons
import { toast } from "react-toastify";
import { useLocation, Link } from "react-router-dom";
import UpdateProduct from "../components/UpdateProduct"; // Assuming this is your UpdateProduct modal

const Search = () => {
    const [products, setProducts] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [userRole, setUserRole] = useState(null);

    const location = useLocation();

    const fetchSearchResults = async (query) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/search?q=${query}`);
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

            const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/get-favorite-products`, {
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
            ? `${process.env.REACT_APP_BACKEND_URL}/api/remove-from-favorites`
            : `${process.env.REACT_APP_BACKEND_URL}/api/add-to-favorites`;

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

    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setIsUpdateModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsUpdateModalOpen(false);
        setSelectedProduct(null);
        const query = new URLSearchParams(location.search).get("q");
        if (query) {
            fetchSearchResults(query);
        }
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
                const query = new URLSearchParams(location.search).get("q");
                if (query) {
                    fetchSearchResults(query);
                }
            } else {
                toast.error("Failed to delete the product.");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the product.");
        }
    };

    const isFavorite = (productId) => favorites.some((favorite) => favorite._id === productId);

    useEffect(() => {
        const query = new URLSearchParams(location.search).get("q");
        if (query) {
            fetchSearchResults(query);
        }

        const role = localStorage.getItem("userRole");
        setUserRole(role);
        fetchFavorites();
    }, [location.search]);

    return (
        <Container>
            <Title>Search Results: {products.length}</Title>
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
                            <Brand>{product.brandName}</Brand>
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
