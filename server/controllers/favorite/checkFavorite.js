const favoriteModel = require("../../models/favoriteModel");
const productModel = require("../../models/productModel"); // Assuming you have a product model for product details

const getFavoriteProductsController = async (req, res) => {
  try {
    const currentUser = req.userId;

    // Find all favorite entries for the current user
    const favoriteProducts = await favoriteModel.find({ userId: currentUser });

    if (favoriteProducts.length === 0) {
      return res.json({
        data: [],
        message: "No favorite products found",
        success: true,
        error: false,
      });
    }

    // Extract the product IDs from the favorite entries
    const productIds = favoriteProducts.map((fav) => fav.productId);

    // Fetch the products corresponding to the favorite product IDs
    const products = await productModel.find({ _id: { $in: productIds } });

    if (!products || products.length === 0) {
      return res.json({
        message: "Products not found",
        success: false,
        error: true,
      });
    }

    // Return the favorite products
    return res.json({
      data: products,
      message: "Favorite products fetched successfully",
      success: true,
      error: false,
    });
  } catch (err) {
    res.json({
      message: err?.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = getFavoriteProductsController;
