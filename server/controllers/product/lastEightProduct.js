const productModel = require("../../models/productModel");

const lastEightProductController = async (req, res) => {
  try {
    const lastEightProducts = await productModel
      .find()
      .sort({ createdAt: -1 }) // Sort by creation date in descending order
      .limit(8); // Limit the results to the last 8 products

    res.json({
      message: "Last 8 Products",
      success: true,
      error: false,
      data: lastEightProducts,
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = lastEightProductController;
