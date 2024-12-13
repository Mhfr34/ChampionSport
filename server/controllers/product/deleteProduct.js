const productModel = require("../../models/productModel");

const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.body;

        // Check if productId is provided
        if (!productId) {
            return res.status(400).json({
                message: "Product ID is required",
                error: true,
                success: false
            });
        }

        // Find and delete the product
        const deletedProduct = await productModel.findByIdAndDelete(productId);

        // Check if product exists
        if (!deletedProduct) {
            return res.status(404).json({
                message: "Product not found",
                error: true,
                success: false
            });
        }

        res.json({
            data: deletedProduct,
            message: "Product deleted successfully",
            success: true,
            error: false
        });

    } catch (err) {
        res.status(500).json({
            message: err?.message || "Server Error",
            error: true,
            success: false
        });
    }
};

module.exports = deleteProduct;
