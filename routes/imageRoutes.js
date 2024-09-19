const express = require("express");
const {
  getAllImages,
  getImagesByFolder,
  getImagesByTag,
} = require("../controllers/imageController");

const router = express.Router();

// Route to get all images
router.get("/", getAllImages);

// Route to get images by folder name
router.get("/folder/:folder_name", getImagesByFolder);

// Route to get images by tag
router.get("/tag/:tag", getImagesByTag);

module.exports = router;
