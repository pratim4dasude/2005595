

const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 5000;

const COMPANY_NAME = process.env.COMPANY_NAME || "Train Central";
const CLIENT_ID =
  process.env.CLIENT_ID || "c9b1814d-e5bb-4348-8cb1-9f6adfb91816";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "cQZpTAzceEsIpdYb";

const getAccessToken = async () => {
  try {
    console.log("Fetching access token...");
    const response = await axios.post("http://20.244.56.144/train/auth", {
      companyName: COMPANY_NAME,
      clientID: CLIENT_ID,
      ownerName: "Pratim M Dasude", 
      ownerEmail: "2005595@kiit.ac.in",
      rollNo: "2005595",
      clientSecret: CLIENT_SECRET,
    });

    if (
      response.status !== 200 ||
      !response.data ||
      !response.data.access_token
    ) {
      throw new Error(
        "Failed to obtain access token from John Doe Railways server"
      );
    }

    console.log("Access token obtained successfully!");
    return response.data.access_token;
  } catch (error) {
    console.error("Failed to fetch access token:", error.message);
    throw new Error(
      "Failed to obtain access token from John Doe Railways server"
    );
  }
};

const fetchTrainSchedules = async () => {
  try {
    const accessToken = await getAccessToken();
    const response = await axios.get("http://20.244.56.144/train/trains", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (
      response.status !== 200 ||
      !response.data ||
      !Array.isArray(response.data)
    ) {
      throw new Error(
        "Failed to fetch train schedules from John Doe Railways server"
      );
    }

    return response.data;
  } catch (error) {
    console.error("Failed to fetch train schedules:", error.message);
    throw new Error(
      "Failed to fetch train schedules from John Doe Railways server"
    );
  }
};

const getCurrentTimeInMinutes = () => {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
};

const filterTrainsInNext12Hours = (trains) => {
  const currentTime = getCurrentTimeInMinutes();
  const twelveHoursLater = currentTime + 720;

  return trains.filter(
    (train) =>
      train.departureTime.Hours * 60 + train.departureTime.Minutes >=
        currentTime + 30 &&
      train.departureTime.Hours * 60 + train.departureTime.Minutes <=
        twelveHoursLater
  );
};

const sortTrains = (trains) => {
  return trains.sort((a, b) => {
    const priceA = a.price.sleeper + a.price.AC;
    const priceB = b.price.sleeper + b.price.AC;
    if (priceA !== priceB) {
      return priceA - priceB;
    }
     
    const seatsAvailableA = a.seatsAvailable.sleeper + a.seatsAvailable.AC;
    const seatsAvailableB = b.seatsAvailable.sleeper + b.seatsAvailable.AC;
    if (seatsAvailableA !== seatsAvailableB) {
      return seatsAvailableB - seatsAvailableA;
    }

    const delayA = a.delayedBy || 0;
    const delayB = b.delayedBy || 0;
    const departureTimeA =
      a.departureTime.Hours * 60 + a.departureTime.Minutes + delayA;
    const departureTimeB =
      b.departureTime.Hours * 60 + b.departureTime.Minutes + delayB;

    return departureTimeB - departureTimeA;
  });
};

let cachedTrainSchedules = [];
let cacheExpiry = 0;

app.get("/trains", async (req, res) => {
  try {
    if (Date.now() < cacheExpiry) {
      console.log("Serving from cache...");
      return res.json(
        sortTrains(filterTrainsInNext12Hours(cachedTrainSchedules))
      );
    }

    console.log("Fetching fresh train schedules...");
    const trains = await fetchTrainSchedules();
    cachedTrainSchedules = trains;
    cacheExpiry = Date.now() + 60000; 

    return res.json(sortTrains(filterTrainsInNext12Hours(trains)));
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to fetch train schedules" });
  }
});

app.get("/train/trains/:trainNumber", (req, res) => {
  const trainNumber = req.params.trainNumber;
  const train = trains.find((t) => t.trainNumber === trainNumber);

  if (!train) {
    return res.status(404).json({ message: "Train not found." });
  }

  res.json(train);
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
