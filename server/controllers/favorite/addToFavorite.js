const favoriteModel = require("../../models/favoriteModel");

const addToFavoriteController = async (req, res) => {
  try {
    const { productId } = req?.body;
    const currentUser = req.userId;

    // Check if the product is already in the user's favorites
    const isProductInFavorites = await favoriteModel.findOne({ productId, userId: currentUser });

    console.log("isProductInFavorites", isProductInFavorites);

    if (isProductInFavorites) {
      return res.json({
        message: "Product already exists in favorites",
        success: false,
        error: true,
      });
    }

    // Create the new favorite entry
    const payload = {
      productId: productId,
      userId: currentUser,
    };

    const newFavorite = new favoriteModel(payload);
    const savedFavorite = await newFavorite.save();

    return res.json({
      data: savedFavorite,
      message: "Product added to favorites",
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

module.exports = addToFavoriteController;
