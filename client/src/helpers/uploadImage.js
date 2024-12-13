const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME_CLOUDINARY}/image/upload`
const uploadImage = async (image) => {
    const formData = new FormData();
    formData.append("file", image);
    formData.append("upload_preset", "ecommerce_store_product");
  
    try {
      const dataResponse = await fetch(url, {
        method: "post",
        body: formData,
      });
  
      const jsonResponse = await dataResponse.json();
      console.log("Cloudinary response:", jsonResponse); // Log the response
      return jsonResponse;
    } catch (error) {
      console.error("Error uploading image:", error); // Log any errors
      return null;
    }
  };
export default uploadImage