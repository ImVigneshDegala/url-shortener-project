import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import axios from "axios";

function App() {
  const [url, setUrl] = useState("");
  const [validity, setValidity] = useState(10);
  const [shortLink, setShortLink] = useState(null);
  const [stats, setStats] = useState(null);

  const handleShorten = async () => {
    try {
      const res = await axios.post("http://localhost:5000/shorturls", {
        url,
        validity,
      });
      setShortLink(res.data.shortLink);
      setStats(null);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStats = async () => {
    if (!shortLink) return;
    const shortCode = shortLink.split("/").pop();
    try {
      const res = await axios.get(`http://localhost:5000/shorturls/${shortCode}`);
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Typography variant="h4" align="center" gutterBottom>
        🔗 URL Shortener
      </Typography>

      <Card>
        <CardContent>
          <TextField
            label="Enter URL"
            variant="outlined"
            fullWidth
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Validity (minutes)"
            type="number"
            variant="outlined"
            fullWidth
            value={validity}
            onChange={(e) => setValidity(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" color="primary" fullWidth onClick={handleShorten}>
            Shorten URL
          </Button>
        </CardContent>
      </Card>

      {shortLink && (
        <Box mt={3} textAlign="center">
          <Typography variant="h6">✅ Short URL:</Typography>
          <a href={shortLink} target="_blank" rel="noreferrer">
            {shortLink}
          </a>
          <Box mt={2}>
            <Button variant="outlined" onClick={fetchStats}>
              View Stats
            </Button>
          </Box>
        </Box>
      )}

      {stats && (
        <Box mt={3}>
          <Typography variant="h6">📊 Stats:</Typography>
          <pre>{JSON.stringify(stats, null, 2)}</pre>
        </Box>
      )}
    </Container>
  );
}

export default App;
