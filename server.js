const express = require("express");
const cors = require("cors");
const imageRoutes = require("./routes/imageRoutes"); // Import routes
require("dotenv").config();

const app = express();
const port = 5000;

app.use(cors());

// Use the image routes
app.use("/api/images", imageRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
