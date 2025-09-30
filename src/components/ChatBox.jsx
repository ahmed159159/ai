import React from "react";
import PlacesList from "./PlacesList";

const ChatBox = ({ query, setQuery, handleSearch, places }) => {
  return (
    <div className="chat-box">
      <div className="chat-results">
        <h3>Result of AI</h3>
        <PlacesList places={places} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Enter your question"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>Send</button>
      </div>
    </div>
  );
};

export default ChatBox;
