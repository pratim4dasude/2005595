

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import TrainList from "./TrainList";
import TrainDetails from "./TrainDetails";
// import './TrainList.css'; // Import the CSS file
const App = () => {
  return (
    <Router>
      <div>
        <nav>
          {/* <header> Train List</header> */}
          <ul>
            <li>
              <Link to="/">All Trains</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<TrainList />} />
          <Route path="/trains/:trainNumber" element={<TrainDetails />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

