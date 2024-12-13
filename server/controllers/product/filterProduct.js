const productModel = require("../../models/productModel");

const filterProductController = async (req, res) => {
  try {
    const categoryList = req?.body?.category || [];

    const query = categoryList.length
      ? { category: { $in: categoryList } } // Filter by categories if provided
      : {}; // Empty query to fetch all products

    const products = await productModel.find(query);

    res.json({
      data: products,
      message: "Products fetched successfully",
      error: false,
      success: true,
    });
  } catch (err) {
    res.json({
      message: err.message || err,
      error: true,
      success: false,
    });
  }
};

module.exports = filterProductController;
