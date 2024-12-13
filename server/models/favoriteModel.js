const mongoose = require("mongoose");

const favoriteSchema = new mongoose.Schema(
  {
    productId: {
      ref: "product",
      type:String,
    },
    userId: String,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const favoriteModel = mongoose.model("favorite", favoriteSchema);

module.exports = favoriteModel;
