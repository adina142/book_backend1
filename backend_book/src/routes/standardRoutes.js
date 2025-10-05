const express = require('express');
const router = express.Router();
const {
  getAllStandards,
  getStandard,
  search,
  uploadStandard
} = require('../controllers/standardController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/all', getAllStandards); // GET /api/standards/all - Get all standards
router.get('/search', search); // GET /api/standards/search?q=risk - Search standards
router.get('/:slug', getStandard); // GET /api/standards/pmbok - Get specific standard

// Protected routes (only logged-in users can upload)
router.post('/', protect, uploadStandard);

module.exports = router;