# Gender Classifier API

##  Project Overview

The Gender Classifier API is a backend service that predicts the gender of a given name using the Genderize API. It processes the raw API response, applies validation rules, and returns a structured, meaningful result with confidence analysis.

## Features

* Accepts a name as a query parameter
* Integrates with the Genderize API
* Extracts and processes response data
* Applies confidence logic based on probability and sample size
* Handles errors and edge cases properly
* Includes CORS support for external access
* Provides clean and consistent JSON responses

## Live API

 https://gender-classifier-api-7na9.onrender.com



## API Endpoint

### GET `/api/classify`


## Success Response

```json
{
  "status": "success",
  "data": {
    "name": "John",
    "gender": "male",
    "probability": 1,
    "sample_size": 2692560,
    "is_confident": true,
    "processed_at": "2026-04-15T12:00:00Z"
  }
}

## Error Responses

### 400 Bad Request

```json
{
  "status": "error",
  "message": "Name query parameter is required"
}
```

### 422 Unprocessable Entity

```json
{
  "status": "error",
  "message": "Name must be a string"
}
```

### No Prediction Available

```json
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
```

### External API Failure (502)

```json
{
  "status": "error",
  "message": "No response from Genderize API"
}
```

---

## Local Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/your-username/gender-classifier-api.git
```

2. Navigate into the folder:

```bash
cd gender-classifier-api
```

3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
node server.js
```

5. Open in browser:

```
http://localhost:3000/api/classify?name=John
```

---

## Processing Logic

* Extracts:

  * gender
  * probability
  * count → renamed to `sample_size`

* Computes:

  * `is_confident = true` if:

    * probability ≥ 0.7 AND
    * sample_size ≥ 100

* Generates:

  * `processed_at` (UTC, ISO 8601 format)

---

## Edge Case Handling

If:

* gender is null OR
* sample size is 0

Then:

```json
{
  "status": "error",
  "message": "No prediction available for the provided name"
}
```

---

## Additional Notes

* CORS enabled for all origins
* Optimized for fast response time
* Handles multiple requests efficiently
* Designed with clean architecture and best practices

---

## Repository
https://github.com/Prince-Magami/gender-classifier-api.git
