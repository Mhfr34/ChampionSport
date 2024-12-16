import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  width: 1200px;
  width: 100%;
`;

const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  width: 100%;
  align-items: flex-start;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ImageContainer = styled.div`
  display: flex;
  flex-direction: column-reverse;
  gap: 16px;
  @media (min-width: 768px) {
    flex-direction: row-reverse;
  }
`;

const ActiveImageWrapper = styled.div`
  position: relative;
  background-color: #f9f9f9;
  height: 450px;
  width: 400px;
  overflow: hidden;
  @media (max-width: 768px) {
    height: 300px;
    width: 300px;
    
  }
`;

const ActiveImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: fill;
  transition: transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1), transform-origin 0.5s cubic-bezier(0.4, 0.0, 0.2, 1);
`;

const ImageList = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  overflow-x: auto;
  @media (min-width: 768px) {
    flex-direction: column;
    overflow-y: auto;
  }
`;

const Thumbnail = styled.div`
  height: 80px;
  width: 80px;
  background-color: #f9f9f9;
  cursor: pointer;
`;

const ThumbnailImage = styled.img`
  height: 100%;
  width: 100%;
  object-fit: fill;
`;

const DetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  @media (min-width: 768px) {
    width: 400px;
  }
`;

const BrandName = styled.p`
  background-color: #eaeaea;
  color: black;
  text-align: center;
  padding: 4px 8px;
  width: fit-content;
  border-radius: 16px;
  @media (min-width: 768px) {
    text-align: left;
  }
`;

const ProductName = styled.h2`
  font-size: 24px;
  font-weight: 500;
  color: black;
  @media (min-width: 768px) {
    font-size: 32px;
  }
`;

const Category = styled.p`
  color: #6c6c6c;
  text-transform: capitalize;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 500;
  color: black;
  @media (min-width: 768px) {
    font-size: 24px;
  }
`;

const Price = styled.p`
  color: black;
`;

const Description = styled.div`
  margin-top: 16px;
`;

const DescriptionHeading = styled.p`
  font-weight: 500;
  color: black;
`;

const DescriptionText = styled.p`
  color: black;
`;

const ProductDetails = () => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
  });
  const params = useParams();
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState("");
  const [zoomStyle, setZoomStyle] = useState({ transform: "scale(1)", transformOrigin: "center center" });

  const fetchProductDetails = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/product-details`, {
        productId: params?.id,
      });
      setData(response.data?.data);
      setActiveImage(response.data?.data?.productImage[0]);
    } catch (error) {
      console.error("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  }, [params?.id]);

  useEffect(() => {
    fetchProductDetails();
  }, [fetchProductDetails]);

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transform: "scale(2)", // Adjust scale for desired zoom level
      transformOrigin: `${x}% ${y}%`,
      transition: "transform 0.5s cubic-bezier(0.4, 0.0, 0.2, 1)", // Smooth scaling
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ transform: "scale(1)", transformOrigin: "center center" });
  };

  const handleMouseEnterProduct = (imageURL) => {
    setActiveImage(imageURL);
  };

  return (
    <Container>
      <FlexRow>
        {/* Product Image */}
        <ImageContainer>
          <ActiveImageWrapper>
            <ActiveImage
              src={activeImage}
              style={zoomStyle}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            />
          </ActiveImageWrapper>
          <ImageList>
            {loading
              ? new Array(4).fill(null).map((_, index) => (
                  <Thumbnail key={`loadingImage-${index}`} />
                ))
              : data?.productImage?.map((imgURL) => (
                  <Thumbnail key={imgURL} onMouseEnter={() => handleMouseEnterProduct(imgURL)}>
                    <ThumbnailImage src={imgURL} />
                  </Thumbnail>
                ))}
          </ImageList>
        </ImageContainer>
        {/* Product Details */}
        <DetailsWrapper>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <BrandName>{data?.brandName}</BrandName>
              <ProductName>{data?.productName}</ProductName>
              <Category>{data?.category}</Category>
              <PriceContainer>
                <Price>${data.price}</Price>
              </PriceContainer>
              <Description>
                <DescriptionHeading>Description:</DescriptionHeading>
                <DescriptionText>{data?.description}</DescriptionText>
              </Description>
            </>
          )}
        </DetailsWrapper>
      </FlexRow>
    </Container>
  );
};

export default ProductDetails;
