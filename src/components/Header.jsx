import React, { useState } from "react";

function Header({ onSearch }) {
  const [category, setCategory] = useState("catering.restaurant");

  const handleSearch = () => {
    onSearch(category);
  };

  return (
    <div className="p-4 bg-purple-600 text-white">
      <h1 className="text-lg font-bold">Geo Food Finder</h1>
      <select
        className="mt-2 w-full p-2 text-black rounded"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="catering.restaurant">🍽️ Restaurants</option>
        <option value="catering.cafe">☕ Cafes</option>
        <option value="commercial.supermarket">🛒 Supermarkets</option>
      </select>
      <button
        onClick={handleSearch}
        className="mt-2 w-full bg-white text-purple-600 p-2 rounded"
      >
        Search
      </button>
    </div>
  );
}

export default Header;

