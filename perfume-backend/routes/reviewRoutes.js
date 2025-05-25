import express from "express";
import Review from "../models/reviewModel.js";

const router = express.Router();

// POST: Add a review to a product
router.post("/", async (req, res) => {
  try {
    const { productId, user, rating, comment } = req.body;
    
    if (!productId || !user || !rating || !comment) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newReview = new Review({ productId, user, rating, comment });
    await newReview.save();

    res.status(201).json({ message: "Review added successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error adding review.", error });
  }
});

// GET: Fetch reviews for a specific product
router.get("/:productId", async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Error fetching reviews.", error });
  }
});

export default router;
