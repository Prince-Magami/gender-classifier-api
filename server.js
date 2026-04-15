const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/api/classify", async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === "") {
      return res.status(400).json({
        status: "error",
        message: "Name query parameter is required"
      });
    }

    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Name must be a string"
      });
    }

    const apiResponse = await axios.get(
      `https://api.genderize.io?name=${encodeURIComponent(name)}`,
      { timeout: 3000 }
    );

    const { gender, probability, count } = apiResponse.data;

    if (gender === null || count === 0) {
      return res.status(200).json({
        status: "error",
        message: "No prediction available for the provided name"
      });
    }

    const sample_size = count;

    const is_confident =
      probability >= 0.7 && sample_size >= 100;

    const processed_at = new Date().toISOString();

    return res.status(200).json({
      status: "success",
      data: {
        name,
        gender,
        probability,
        sample_size,
        is_confident,
        processed_at
      }
    });

  } catch (error) {
    console.error("Error:", error.message);

    if (error.response) {
      return res.status(502).json({
        status: "error",
        message: "Genderize API responded with an error"
      });
    } else if (error.request) {
      return res.status(502).json({
        status: "error",
        message: "No response from Genderize API"
      });
    } else {
      return res.status(500).json({
        status: "error",
        message: "Internal server error"
      });
    }
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
