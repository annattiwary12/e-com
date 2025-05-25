// routes/userRoutes.js
const express = require('express');
const router = express.Router();

// GET /api/user
router.get('/', (req, res) => {
  console.log('User:', req.user);
  console.log('Is Authenticated:', req.isAuthenticated());

  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json({
      username: req.user.displayName || req.user.name || req.user.username,
      email: req.user.email,
    });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
});

module.exports = router;
