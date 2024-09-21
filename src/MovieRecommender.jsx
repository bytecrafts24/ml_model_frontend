import React, { useState } from 'react';
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
} from '@mui/material';
import { getMovieRecommendations } from './api/ImdbRecommender-ws'

const MovieRecommender = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setMovieTitle(e.target.value);
  };

  const fetchRecommendations = async () => {
    try {
      const response = await getMovieRecommendations(movieTitle);
      setRecommendations(response.recommendations);
      setError('');
    } catch (err) {
      setRecommendations([]);
      setError(
        err.response?.data?.error || 'An error occurred while fetching recommendations'
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movieTitle.trim() !== '') {
      fetchRecommendations();
    } else {
      setError('Please enter a movie title');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={2}>
        <Typography variant="h4" component="h1" gutterBottom>
          Movie Recommender
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} mb={2}>
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
        {recommendations.length > 0 && (
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
        )}
      </Box>
    </Container>
  );
};

export default MovieRecommender;

