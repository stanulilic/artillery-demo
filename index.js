const express = require("express");
const { faker } = require("@faker-js/faker");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Mock authentication middleware
function authenticate(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader || authHeader !== "Bearer MOCK_API_KEY") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// Function to convert temperature from Celsius to Fahrenheit
function convertCelsiusToFahrenheit(celsius) {
  return (celsius * 9) / 5 + 32;
}

// Mock weather data generator function
function generateWeatherData(city) {
  return {
    city,
    temperature: faker.number.int({ min: -20, max: 40 }),
    humidity: faker.number.int({ min: 0, max: 100 }),
    condition: faker.helpers.arrayElement([
      "Sunny",
      "Cloudy",
      "Rainy",
      "Snowy",
    ]),
  };
}

// Home endpoint
app.get("/", (req, res) => {
  res.send("Welcome to the Weather API");
});
// Endpoint to get weather information for a given city
app.get("/weather", (req, res) => {
  const city = req.query.city || "NewYork"; // Default city is NewYork if not specified
  const weatherData = generateWeatherData(city);
  res.json(weatherData);
});

// Endpoint to get weather information for a given city
app.get("/auth-required-weather", authenticate, (req, res) => {
  const city = req.query.city || "NewYork"; // Default city is NewYork if not specified
  const weatherData = generateWeatherData(city);
  res.json(weatherData);
});

// Endpoint to convert Celsius temperature to Fahrenheit
app.post("/convert-celsius-to-fahrenheit", (req, res) => {
  const { temperature } = req.body;
  // Convert Celsius temperature to Fahrenheit
  const temperatureFahrenheit = convertCelsiusToFahrenheit(temperature);

  res.json({ temperatureFahrenheit });
});

app.post("/signup", (req, res) => {
  const { email, password } = req.body;
  // For demonstration purposes, echo back the received data
  console.log(email, password);
  res.json({
    message: "Signup successful",
    email,
    password,
  });
});

// Sample endpoint to receive POST requests
app.post("/data", (req, res) => {
  console.log(req.body);
  res.status(201).json({ message: "Data received successfully" });
});

// Endpoint to get the current time
app.get("/time", (req, res) => {
  const currentTime = new Date().toLocaleTimeString();
  res.json({ currentTime });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
