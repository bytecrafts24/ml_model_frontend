import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Alert,
  Container,
} from "@mui/material";
import { getMovieRecommendations } from "./api/ImdbRecommender-ws";

const MovieRecommender = () => {
  const [movieTitle, setMovieTitle] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setMovieTitle(e.target.value);
  };

  const fetchRecommendations = async () => {
    getMovieRecommendations(movieTitle)
      .then((res) => {
        setRecommendations(res.data.recommendations);
        setError("");
      })
      .catch((err) => {
        setRecommendations([]);
        setError(err || "An error occurred while fetching recommendations");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movieTitle.trim() !== "") {
      fetchRecommendations();
    } else {
      setError("Please enter a movie title");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Movie Recommender
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            mb={2}
          >
            <Box flexGrow={1} mr={{ md: 2 }}>
              <TextField
                label="Enter movie title"
                variant="outlined"
                value={movieTitle}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Box>
            <Box>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth
              >
                Get Recommendations
              </Button>
            </Box>
          </Box>
        </form>
        {error && <Alert severity="error">{error}</Alert>}
        {typeof recommendations === "string" ? (
          <Box mt={3}>
            <Typography variant="h6" component="h2">
              {recommendations.split("Did you mean one of these?")[0]}{" "}
              {/* Show error message */}
            </Typography>
            {recommendations.includes("Did you mean one of these?") && (
              <Typography variant="body1" component="p">
                Did you mean one of these?
                <ul>
                  {recommendations
                    .split("Did you mean one of these?")[1]
                    .split(",")
                    .map((suggestion, index) => (
                      <li key={index}>{suggestion.trim()}</li>
                    ))}
                </ul>
              </Typography>
            )}
          </Box>
        ) : (
          // Display the list of recommendations if it's an array
          recommendations?.length > 0 && (
            <Box mt={3}>
              <Typography variant="h6" component="h2">
                Recommendations:
              </Typography>
              <List>
                {recommendations.map((movie, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={movie} />
                  </ListItem>
                ))}
              </List>
            </Box>
          )
        )}
      </Box>
    </Container>
  );
};

export default MovieRecommender;
