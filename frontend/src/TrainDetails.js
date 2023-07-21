

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const TrainDetails = () => {
  const { trainNumber } = useParams();
  const [train, setTrain] = useState(null);

  useEffect(() => {
    const fetchTrainDetails = async () => {
      try {
        const response = await axios.get(`/train/trains/${trainNumber}`); 
        setTrain(response.data);
      } catch (error) {
        console.error("Error fetching train details:", error.message);
        setTrain(null);
      }
    };

    fetchTrainDetails();
  }, [trainNumber]);

  if (!train) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Train Details</h1>
      <table>
        <tbody>
          <tr>
            <td>Train Name:</td>
            <td>{train.trainName}</td>
          </tr>
          <tr>
            <td>Train Number:</td>
            <td>{train.trainNumber}</td>
          </tr>
          <tr>
            <td>Departure Time:</td>
            <td>
              {train.departureTime.Hours}:{train.departureTime.Minutes}
            </td>
          </tr>
          <tr>
            <td>Seats Available (Sleeper/AC):</td>
            <td>
              {train.seatsAvailable.sleeper}/{train.seatsAvailable.AC}
            </td>
          </tr>
          <tr>
            <td>Price (Sleeper/AC):</td>
            <td>
              {train.price.sleeper}/{train.price.AC}
            </td>
          </tr>
          <tr>
            <td>Delayed By (Minutes):</td>
            <td>{train.delayedBy}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TrainDetails;
