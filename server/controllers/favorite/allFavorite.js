const favoriteModel = require("../../models/favoriteModel");
const productModel = require("../../models/productModel");

const getAllUserFavoritesController = async (req, res) => {
  try {
    const currentUser = req.userId; // Assuming authentication middleware adds this

    // Fetch favorite entries and populate product details
    const favoriteEntries = await favoriteModel.find({ userId: currentUser }).populate({
      path: "productId", // Assuming `productId` references the product model
      model: "product",
    });

    if (!favoriteEntries || favoriteEntries.length === 0) {
      return res.json({
        data: [],
        message: "No favorite products found",
        success: true,
        error: false,
      });
    }

    // Format the response to include product details
    const favoriteProducts = favoriteEntries.map((entry) => ({
      favoriteId: entry._id, // Optional: Favorite entry ID
      productDetails: {
        id: entry.productId._id,
        name: entry.productId.productName,
        brand: entry.productId.brandName,
        category: entry.productId.category,
        productImage: entry.productId.productImage,
        description: entry.productId.description,
        price: entry.productId.price,
      },
      addedAt: entry.createdAt, // Timestamp when added to favorites
    }));

    return res.json({
      data: favoriteProducts,
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

module.exports = getAllUserFavoritesController;
