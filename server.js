const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Gender Classifier API is running",
    endpoint: "/api/classify?name=YourName"
  });
});

app.get("/api/classify", async (req, res) => {
  try {
    let { name } = req.query;

    if (typeof name === "string") {
      name = name.trim();
    }

    if (
      !name ||
      typeof name !== "string" ||
      name === "" ||
      name.toLowerCase() === "undefined" ||
      name.toLowerCase() === "null"
    ) {
      return res.status(400).json({
        status: "error",
        message: "Name query parameter is required"
      });
    }

    const apiResponse = await axios.get("https://api.genderize.io", {
      params: { name },
      timeout: 3000
    });

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
        message: "External API error occurred"
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
