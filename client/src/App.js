// src/App.js

import React, { useState } from "react";
import "./App.css";

function App() {
  const [videoDescription, setVideoDescription] = useState("");
  const [designDescription, setDesignDescription] = useState("");
  const [colorScheme, setColorScheme] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(""); // URL形式に変更

  const handleGenerateThumbnail = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:5000/api/generate-thumbnail",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            videoDescription,
            designDescription,
            colorScheme,
          }),
        }
      );

      const data = await response.json();

      // エラーチェック
      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to generate thumbnail"}`);
        return;
      }

      // 生成されたサムネイル画像のURLを設定
      setThumbnailUrl(data.imageUrl); // ここでURLを設定
    } catch (error) {
      console.error("Error generating thumbnail:", error);
      alert("An error occurred while generating the thumbnail.");
    }
  };

  return (
    <div className="App">
      <h1>YouTube Thumbnail Generator</h1>
      <div className="input-container">
        <label>
          Video Description:
          <input
            type="text"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            placeholder="Describe your video"
          />
        </label>
      </div>
      <div className="input-container">
        <label>
          Design Description:
          <input
            type="text"
            value={designDescription}
            onChange={(e) => setDesignDescription(e.target.value)}
            placeholder="Describe your design"
          />
        </label>
      </div>
      <div className="input-container">
        <label>
          Color Scheme:
          <input
            type="text"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
            placeholder="Describe the color scheme"
          />
        </label>
      </div>
      <button onClick={handleGenerateThumbnail}>Generate Thumbnail</button>
      {thumbnailUrl && (
        <div>
          <h2>Generated Thumbnail</h2>
          <img src={thumbnailUrl} alt="Generated Thumbnail" />
          <a href={thumbnailUrl} download="thumbnail.png">
            Download Thumbnail
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
