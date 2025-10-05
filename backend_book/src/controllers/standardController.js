const Standard = require('../models/Standard');
const { sendSuccess, sendError } = require('../utils/response');

// GET ALL standards
exports.getAllStandards = async (req, res) => {
  try {
    const standards = await Standard.find({});
    sendSuccess(res, 200, standards);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// GET specific standard by slug
exports.getStandard = async (req, res) => {
  try {
    const { slug } = req.params;
    const standard = await Standard.findOne({ slug });
    
    if (!standard) {
      return sendError(res, 404, 'Standard not found');
    }
    
    sendSuccess(res, 200, standard);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// SEARCH within standards - FIXED VERSION
exports.search = async (req, res) => {
  try {
    const q = req.query.q || '';
    
    if (!q.trim()) {
      // If no search query, return all standards
      const standards = await Standard.find({});
      return sendSuccess(res, 200, standards);
    }

    // Return full standards that match the search
    const standards = await Standard.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { 'sections.title': { $regex: q, $options: 'i' } },
        { 'sections.text': { $regex: q, $options: 'i' } },
        { 'sections.subsections.title': { $regex: q, $options: 'i' } },
        { 'sections.subsections.text': { $regex: q, $options: 'i' } }
      ]
    });

    sendSuccess(res, 200, standards);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};

// UPLOAD a standard
exports.uploadStandard = async (req, res) => {
  try {
    const { slug, title, version, meta, sections } = req.body;
    if (!slug || !title || !sections) return sendError(res, 400, 'slug, title and sections required');

    const existing = await Standard.findOne({ slug });
    if (existing) return sendError(res, 409, 'Standard already exists');

    const std = new Standard({ slug, title, version, meta, sections });
    await std.save();
    sendSuccess(res, 201, std);
  } catch (err) {
    sendError(res, 500, err.message);
  }
};