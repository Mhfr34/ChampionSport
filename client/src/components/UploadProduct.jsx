import React, { useState, useRef } from "react";
import styled from "styled-components";
import { CgClose } from "react-icons/cg";
import axios from "axios";
import { FaCloudUploadAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { category } from "../utils/data";
import uploadImage from "../helpers/uploadImage";
import { toast } from "react-toastify"; // Import toast

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.35);
  z-index: 1000;
`;

const Modal = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 10px;
  width: 100%;
  max-width: 600px;
  max-height: 90%;
  overflow-y: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.5rem;
`;

const CloseButton = styled.div`
  cursor: pointer;
  font-size: 1.5rem;
  color: black;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Label = styled.label`
  font-weight: 500;
  color: black;
`;

const Input = styled.input`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f7f7f7;
`;

const Select = styled.select`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f7f7f7;
`;

const UploadBox = styled.div`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  cursor: pointer;
  background: #f7f7f7;
`;

const UploadIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 2rem;
  color: #888;
`;

const ImagePreview = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 5px;
  cursor: pointer;
`;

const DeleteButton = styled.div`
  padding: 0 2px;
  position: absolute;
  top: 0;
  right: 0;
  color: black;
  border-radius: 50%;
  cursor: pointer;
  display: none;
  font-size: 1.1rem;

  ${ImageContainer}:hover & {
    display: block;
  }
`;

const Textarea = styled.textarea`
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f7f7f7;
  resize: none;
`;

const SubmitButton = styled.button`
  padding: 0.75rem;
  background: black;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: #333;
  }
`;

const UploadProduct = ({ onClose }) => {
  const [data, setData] = useState({
    productName: "",
    brandName: "",
    category: "",
    productImage: [],
    description: "",
    price: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadProduct = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const uploadImageCloudinary = await uploadImage(file);

      if (uploadImageCloudinary?.url) {
        setData((prev) => ({
          ...prev,
          productImage: [...prev.productImage, uploadImageCloudinary.url],
        }));
      } else {
        throw new Error("Image upload failed.");
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload image.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleDeleteProductImage = (index) => {
    const newProductImage = [...data.productImage];
    newProductImage.splice(index, 1);
    setData((prev) => ({
      ...prev,
      productImage: newProductImage,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("authToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/upload-product`, // Adjust the endpoint if needed
        data,
        config
      );

      if (response.data.success) {
        toast.success("Product uploaded successfully!");
        setData({
          productName: "",
          brandName: "",
          category: "",
          productImage: [],
          description: "",
          price: "",
        });
      } else {
        throw new Error(response.data.message || "Failed to upload product.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Overlay>
      <Modal>
        <Header>
          <Title>Upload Product</Title>
          <CloseButton onClick={onClose}>
            <CgClose />
          </CloseButton>
        </Header>
        <Form onSubmit={handleSubmit}>
          <Label>Product Name:</Label>
          <Input
            type="text"
            name="productName"
            value={data.productName}
            onChange={handleOnChange}
            placeholder="Enter product name"
            required
          />

          <Label>Brand Name:</Label>
          <Input
            type="text"
            name="brandName"
            value={data.brandName}
            onChange={handleOnChange}
            placeholder="Enter brand name"
            required
          />

          <Label>Category:</Label>
          <Select
            name="category"
            value={data.category}
            onChange={handleOnChange}
            required
          >
            <option value="">Select Category</option>
            {category.map((cat, index) => (
              <option key={index} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </Select>

          <Label>Product Image:</Label>
          <UploadBox onClick={handleUploadClick}>
            <UploadIcon>
              <FaCloudUploadAlt />
              <p>Upload Product Image</p>
            </UploadIcon>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUploadProduct}
              hidden
            />
          </UploadBox>

          <ImagePreview>
            {data.productImage.map((el, index) => (
              <ImageContainer key={index}>
                <Image src={el} alt="Product" />
                <DeleteButton onClick={() => handleDeleteProductImage(index)}>
                  <MdDelete />
                </DeleteButton>
              </ImageContainer>
            ))}
          </ImagePreview>

          <Label>Price:</Label>
          <Input
            type="number"
            name="price"
            value={data.price}
            onChange={handleOnChange}
            placeholder="Enter price"
            required
          />

          <Label>Description:</Label>
          <Textarea
            name="description"
            value={data.description}
            onChange={handleOnChange}
            placeholder="Enter product description"
            required
          />

          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload Product"}
          </SubmitButton>
        </Form>
      </Modal>
    </Overlay>
  );
};

export default UploadProduct;
