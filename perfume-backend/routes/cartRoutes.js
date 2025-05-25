const express = require("express");
const mongoose = require("mongoose");
const Cart = require("../models/Cart Schema");

const router = express.Router();

// Middleware to protect routes
function isAuthenticated(req, res, next) {
  // Check req.isAuthenticated as a function (usually from passport)
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "Unauthorized" });
}

// Add item to cart
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity, volume } = req.body;

    if (!productId || !quantity || !volume) {
      return res.status(400).json({ message: "Missing productId, quantity or volume" });
    }

    const productObjectId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.product.toString() === productObjectId.toString() && item.volume === volume
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productObjectId, quantity, volume });
    }

    await cart.save();
    console.log("✅ Cart after update:", cart);
    res.status(200).json(cart);
  } catch (err) {
    console.error("Error in POST /api/cart:", err);
    res.status(500).json({ error: err.message });
  }
});


router.put("/", isAuthenticated, async (req, res) => {
  const { productId, volume, action } = req.body; // action = 'increment' or 'decrement'

  if (!productId || !volume || !action) {
    return res.status(400).json({ message: "Missing productId, volume or action" });
  }

  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(400).json({ message: "Cart not found" });

    const item = cart.items.find(
      (item) => item.product.toString() === productId && item.volume === volume
    );
    if (!item) return res.status(400).json({ message: "Item not found in cart" });

    if (action === "increment") {
      item.quantity += 1;
    } else if (action === "decrement") {
      item.quantity = Math.max(item.quantity - 1, 0);
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    // Remove item if quantity is zero after decrement
    if (item.quantity === 0) {
      cart.items = cart.items.filter(
        (item) => !(item.product.toString() === productId && item.volume === volume)
      );
    }

    await cart.save();
    return res.json({ message: "Cart updated", cart });
  } catch (err) {
    console.error("Error updating cart:", err);
    return res.status(500).json({ message: "Error updating cart", error: err.message });
  }
});



// Delete item from cart
router.delete("/:productId", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { volume } = req.body; // volume in request body

    if (!volume) {
      return res.status(400).json({ message: "Volume is required to remove item" });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    // Filter out the item with matching product and volume
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(
      item =>
        item.product.toString() !== productId || item.volume !== volume
    );

    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();

    console.log("Updated cart:", cart);
    res.json({ message: "Item removed from cart", cart });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Error removing item", error: err.message });
  }
});

// Get user cart
router.get("/", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOne({ userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({ items: [] }); // Return empty array if no cart
    }

    res.json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
