import React from "react";

const PlacesList = ({ places }) => {
  if (places.length === 0) {
    return <p>No results yet. Try asking!</p>;
  }

  return (
    <ul>
      {places.map((place, idx) => (
        <li key={idx}>{place.name}</li>
      ))}
    </ul>
  );
};

export default PlacesList;
