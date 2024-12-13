const express = require("express");
const authToken = require("../middleware/authToken");
const UploadProductController = require("../controllers/product/uploadProduct");
const userSignUpController = require("../controllers/user/userSignUp");
const userSignInController = require("../controllers/user/userSignIn");
const userLogout = require("../controllers/user/userLogout");
const forgetPassword = require("../controllers/user/forgetPassword");
const resetPassword = require("../controllers/user/resetPassword");
const lastEightProductController = require("../controllers/product/lastEightProduct");
const getProductDetails = require("../controllers/product/getProductDetails");
const getProductController = require("../controllers/product/getProduct");
const updateProductController = require("../controllers/product/updateProduct");
const deleteProduct = require("../controllers/product/deleteProduct");
const filterProductController = require("../controllers/product/filterProduct");
const checkFavorite = require("../controllers/favorite/checkFavorite");
const addToFavoriteController = require("../controllers/favorite/addToFavorite");
const removeFromFavoriteController = require("../controllers/favorite/removeFromFavorite");
const getFavoriteProductsController = require("../controllers/favorite/checkFavorite");
const getAllUserFavoritesController = require("../controllers/favorite/allFavorite");
const searchProduct = require("../controllers/product/searchProduct");

const router = express.Router();

//user
router.post("/signup", userSignUpController);
router.post("/login", userSignInController);
router.get("/logout", userLogout);
router.post("/forgot-password", forgetPassword); // Forgot password route
router.post("/reset-password/:token", resetPassword); // Reset password route4

//product
router.post("/upload-product", authToken, UploadProductController);
router.get("/last-eight-product", lastEightProductController);
router.post("/product-details", getProductDetails);
router.get("/get-all-product", getProductController);
router.post("/update-product", authToken, updateProductController);
router.post("/delete-product", authToken, deleteProduct);
router.post("/filter-product", filterProductController);
router.get("/search",searchProduct)

//favorite
router.post("/add-to-favorites", authToken, addToFavoriteController);
router.get("/get-favorite-products", authToken, getFavoriteProductsController);
router.post("/remove-from-favorites", authToken, removeFromFavoriteController);
router.get("/all-favorite", authToken, getAllUserFavoritesController);
module.exports = router;
