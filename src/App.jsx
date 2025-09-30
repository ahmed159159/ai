import React, { useState } from "react";
import Header from "./components/Header";
import ChatBox from "./components/ChatBox";
import MapView from "./components/MapView";
import { searchPlaces } from "./services/geoapify";

const App = () => {
  const [places, setPlaces] = useState([]);
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query) return;
    const results = await searchPlaces(query);
    setPlaces(results);
  };

  return (
    <div className="app-container">
      <Header />
      <div className="content">
        <ChatBox
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
          places={places}
        />
        <MapView places={places} />
      </div>
    </div>
  );
};

export default App;
