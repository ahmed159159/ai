const API_KEY = "YOUR_GEOAPIFY_API_KEY";

export const searchPlaces = async (query) => {
  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(query)}&apiKey=${API_KEY}`
    );
    const data = await response.json();

    return data.features.map((item) => ({
      name: item.properties.formatted,
      lat: item.properties.lat,
      lon: item.properties.lon,
    }));
  } catch (error) {
    console.error("Error fetching places:", error);
    return [];
  }
};
