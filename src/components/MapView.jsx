import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapView({ center, places }) {
  useEffect(() => {
    const map = L.map("map").setView(center, 14);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    L.marker(center).addTo(map).bindPopup("You are here");

    places.forEach((place) => {
      L.marker([place.lat, place.lon])
        .addTo(map)
        .bindPopup(`<b>${place.name}</b><br/>${place.address}`);
    });

    return () => {
      map.remove();
    };
  }, [center, places]);

  return <div id="map" className="h-full w-full"></div>;
}

export default MapView;
