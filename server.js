const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Gender Classifier API is running",
    usage: "/api/classify?name=John"
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

    let apiResponse;

    try {
      apiResponse = await axios({
        method: "GET",
        url: "https://api.genderize.io",
        params: { name },
        timeout: 8000,
        headers: {
          Accept: "application/json",
          "User-Agent": "Mozilla/5.0"
        }
      });
    } catch (apiError) {
      console.error("Genderize API ERROR:", apiError.message);

      return res.status(502).json({
        status: "error",
        message: "External API error occurred"
      });
    }

    const { gender, probability, count } = apiResponse.data;

    if (!gender || count === 0) {
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
    console.error("SERVER ERROR:", error.message);

    return res.status(500).json({
      status: "error",
      message: "Internal server error"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
