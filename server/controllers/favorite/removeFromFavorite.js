const favoriteModel = require("../../models/favoriteModel");

const removeFromFavoriteController = async (req, res) => {
  try {
    const { productId } = req?.body;
    const currentUser = req.userId;

    // Check if the product exists in the user's favorites
    const favoriteEntry = await favoriteModel.findOneAndDelete({ productId, userId: currentUser });

    if (!favoriteEntry) {
      return res.json({
        message: "Product not found in favorites",
        success: false,
        error: true,
      });
    }

    return res.json({
      message: "Product removed from favorites",
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

module.exports = removeFromFavoriteController;
