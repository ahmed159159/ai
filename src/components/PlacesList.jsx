import React from "react";

function PlacesList({ places }) {
  return (
    <div className="p-4">
      <h2 className="font-bold mb-2">Results:</h2>
      {places.length === 0 && <p>No results found.</p>}
      <ul>
        {places.map((place, idx) => (
          <li key={idx} className="mb-2 border-b pb-2">
            <h3 className="font-semibold">{place.name}</h3>
            <p>{place.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PlacesList;
