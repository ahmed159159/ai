import axios from "axios";

const API_KEY = "89ed60158e6045cfb6a5119eb7cf0cd6";

export const getPlaces = async (lat, lon, category) => {
  try {
    const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},2000&limit=20&apiKey=${API_KEY}`;
    const { data } = await axios.get(url);

    return data.features.map((f) => ({
      name: f.properties.name || "Unnamed",
      address: f.properties.formatted,
      lat: f.geometry.coordinates[1],
      lon: f.geometry.coordinates[0],
    }));
  } catch (err) {
    console.error("Error fetching places", err);
    return [];
  }
};
