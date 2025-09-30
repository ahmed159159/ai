import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import PlacesList from "./components/PlacesList";
import MapView from "./components/MapView";
import { getPlaces } from "./services/geoapify";

function App() {
  const [places, setPlaces] = useState([]);
  const [position, setPosition] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        loadPlaces(pos.coords.latitude, pos.coords.longitude);
      },
      () => {
        alert("Couldn't get your location, using default (Cairo).");
        setPosition([30.0444, 31.2357]);
        loadPlaces(30.0444, 31.2357);
      }
    );
  }, []);

  const loadPlaces = async (lat, lon, category = "catering.restaurant") => {
    const results = await getPlaces(lat, lon, category);
    setPlaces(results);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 border-r overflow-y-auto">
        <Header onSearch={(cat) => loadPlaces(position[0], position[1], cat)} />
        <PlacesList places={places} />
      </div>
      <div className="w-2/3">
        {position && <MapView center={position} places={places} />}
      </div>
    </div>
  );
}

export default App;
