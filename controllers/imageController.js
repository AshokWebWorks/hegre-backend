const axios = require("axios");
const cloudinary = require("../config/cloudinaryConfig");

// Helper function to fetch and transform images
const fetchAndTransformImages = async (url, params) => {
  const response = await axios.get(url, {
    auth: {
      username: process.env.API_KEY,
      password: process.env.API_SECRET,
    },
    params: { ...params, max_results: 5 },
  });

  // Transform images
  return {
    resources: response.data.resources.map((image) => ({
      ...image,
      url: cloudinary.url(image.public_id, {
        transformation: [
          { width: 1000, crop: "scale" },
          { quality: "35" },
          { fetch_format: "webp" },
        ],
      }),
    })),
    next_cursor: response.data.next_cursor, // Return next_cursor for pagination
  };
};

// Get all images
const getAllImages = async (req, res) => {
  const { next_cursor } = req.query; // Use next_cursor if provided
  try {
    const { resources, next_cursor: newCursor } = await fetchAndTransformImages(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/image`,
      { next_cursor }
    );
    res.json({ resources, next_cursor: newCursor }); // Return next_cursor in the response
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get images by folder name
const getImagesByFolder = async (req, res) => {
  const { folder_name } = req.params;
  const { next_cursor } = req.query;
  try {
    const { resources, next_cursor: newCursor } = await fetchAndTransformImages(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/by_asset_folder`,
      { asset_folder: folder_name, next_cursor }
    );
    res.json({ resources, next_cursor: newCursor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get images by tag
const getImagesByTag = async (req, res) => {
  const { tag } = req.params;
  const { next_cursor } = req.query;
  try {
    const { resources, next_cursor: newCursor } = await fetchAndTransformImages(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/resources/image/tags/${tag}`,
      { next_cursor }
    );
    res.json({ resources, next_cursor: newCursor });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllImages,
  getImagesByFolder,
  getImagesByTag,
};
