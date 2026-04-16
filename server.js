const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Gender Classifier API running"
  });
});

app.get("/api/classify", async (req, res) => {
  try {
    let { name } = req.query;

    if (name === undefined) {
      return res.status(400).json({
        status: "error",
        message: "Name query parameter is required"
      });
    }

    if (typeof name !== "string") {
      return res.status(422).json({
        status: "error",
        message: "Invalid name type"
      });
    }

    name = name.trim();

    if (!name) {
      return res.status(400).json({
        status: "error",
        message: "Name query parameter is required"
      });
    }

    let apiResponse;

    try {
      apiResponse = await axios.get(
        `https://api.genderize.io?name=${name}`
      );
    } catch (err) {
      return res.status(502).json({
        status: "error",
        message: "Failed to fetch data from Genderize API"
      });
    }

    const { gender, probability, count } = apiResponse.data;

    if (!gender || count === 0) {
      return res.json({
        status: "error",
        message: "No prediction available for the provided name"
      });
    }

    const sample_size = count;

    const is_confident =
      probability >= 0.7 && sample_size >= 100;

    const processed_at = new Date().toISOString();

    return res.json({
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
    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
