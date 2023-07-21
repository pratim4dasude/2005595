import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TrainList.css";
const TrainList = () => {
  const [trains, setTrains] = useState([]);

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await axios.get("http://localhost:5000/trains");
        setTrains(response.data);
      } catch (error) {
        console.error("Error fetching train data:", error.message);
        setTrains([]);
      }
    };

    fetchTrains();
  }, []);

  if (trains.length === 0) {
    return (
      <div>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>Train Schedules</h1>
      <table>
        <thead>
          <tr>
            <th>Train Name</th>
            <th>Train Number</th>
            <th>Departure Time</th>
            <th>Seats Available (Sleeper/AC)</th>
            <th>Price (Sleeper/AC)</th>
            <th>Delayed By (Minutes)</th>
          </tr>
        </thead>
        <tbody>
          {trains.map((train, index) => (
            <tr key={index}>
              <td>
                <a href={`/trains/${train.trainNumber}`}>{train.trainName}</a>
              </td>
              <td>{train.trainNumber}</td>
              <td>
                {train.departureTime.Hours}:{train.departureTime.Minutes}
              </td>
              <td>
                {train.seatsAvailable.sleeper}/{train.seatsAvailable.AC}
              </td>
              <td>
                {train.price.sleeper}/{train.price.AC}
              </td>
              <td>{train.delayedBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainList;
