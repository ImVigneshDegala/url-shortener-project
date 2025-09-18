import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!url) return alert("Please enter a URL");

    try {
      const res = await fetch("http://localhost:5000/shorturls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (res.status === 201 && data.shortLink) {
        setLinks((prev) => [...prev, data.shortLink]);
        setUrl("");
        setError("");
      } else if (res.status === 403) {
        setError("Limit reached: You cannot shorten more than 5 URLs.");
      } else {
        setError(data.error || "Unknown error");
      }
    } catch (err) {
      console.error(err);
      setError("Server error");
    }
  };

  return (
    <div
      style={{
        fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif",
        background: "#f0f2f5",
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          background: "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          width: "420px",
          textAlign: "center",
        }}
      >
        <h1 style={{ color: "#222", marginBottom: "20px" }}>URL Shortener</h1>

        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter a URL to shorten"
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "6px",
            marginBottom: "8px",
            fontSize: "14px",
          }}
          disabled={links.length >= 5}
        />

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "12px",
            background: links.length >= 5 ? "#bbb" : "#007bff",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: links.length >= 5 ? "not-allowed" : "pointer",
            fontSize: "15px",
            fontWeight: "500",
            marginBottom: "10px",
          }}
          disabled={links.length >= 5}
        >
          Shorten URL
        </button>

        {/* Note for users */}
        <p style={{ fontSize: "13px", color: "#666", marginBottom: "15px" }}>
          (Note: You can shorten upto <strong>5 URLs</strong> only.)
        </p>

        {error && (
          <p
            style={{
              color: "red",
              marginTop: "5px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {error}
          </p>
        )}

        <h2 style={{ marginTop: "20px", color: "#444", fontSize: "18px" }}>
          Shortened Links
        </h2>

        {links.length === 0 ? (
          <p style={{ color: "#666", fontSize: "14px" }}>
            No links have been shortened yet.
          </p>
        ) : (
          <ol
            style={{
              textAlign: "left",
              marginTop: "10px",
              paddingLeft: "20px",
              fontSize: "14px",
            }}
          >
            {links.map((link, index) => (
              <li key={index} style={{ marginBottom: "8px" }}>
                <a
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none", color: "#007bff" }}
                >
                  {link}
                </a>
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

export default App;
