import React, { useState, useEffect } from 'react';
import { 
  Button, 
  Card, 
  CardMedia, 
  CardContent, 
  Typography, 
  Grid, 
  IconButton,
  Container,
  Box
} from '@mui/material';
import { ThumbUp } from '@mui/icons-material';

const PhotoContestWidget = () => {
  const [photos, setPhotos] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    // Fetch initial photos and leaderboard data
    fetchPhotos();
    fetchLeaderboard();
  }, []);

  const fetchPhotos = () => {
    // Mock API call to fetch photos
    const fetchedPhotos = [
      { id: 1, url: 'photo1.jpg', title: 'Sunset', votes: 10 },
      { id: 2, url: 'photo2.jpg', title: 'Mountains', votes: 15 },
      { id: 3, url: 'photo3.jpg', title: 'Ocean', votes: 8 },
    ];
    setPhotos(fetchedPhotos);
  };

  const fetchLeaderboard = () => {
    // Mock API call to fetch leaderboard data
    const fetchedLeaderboard = [
      { id: 2, title: 'Mountains', votes: 15 },
      { id: 1, title: 'Sunset', votes: 10 },
      { id: 3, title: 'Ocean', votes: 8 },
    ];
    setLeaderboard(fetchedLeaderboard);
  };

  const handlePhotoSubmit = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Handle photo submission
      // Mock update: Add a new photo to the photos array
      const newPhoto = {
        id: photos.length + 1,
        url: URL.createObjectURL(file),
        title: file.name,
        votes: 0
      };
      setPhotos([...photos, newPhoto]);
      // Update the server (API call)
      // Example: uploadPhoto(newPhoto)
    }
  };

  const handleVote = (photoId) => {
    // Handle voting
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, votes: photo.votes + 1 } : photo
    );
    setPhotos(updatedPhotos);

    // Update leaderboard
    const updatedLeaderboard = [...updatedPhotos].sort((a, b) => b.votes - a.votes);
    setLeaderboard(updatedLeaderboard);

    // Update server with new vote count
    // Example: updateVote(photoId)
  };

  const determineWinners = () => {
    // Determine the top 3 winners based on votes
    const topWinners = leaderboard.slice(0, 3).map((winner, index) => ({
      ...winner,
      prize: index === 0 ? 'Gold Medal' : index === 1 ? 'Silver Medal' : 'Bronze Medal'
    }));
    setWinners(topWinners);
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Community Photo Contest
      </Typography>
      
      <Box mb={3}>
        <Button
          variant="contained"
          color="primary"
          component="label"
        >
          Submit Photo
          <input
            type="file"
            hidden
            onChange={handlePhotoSubmit}
          />
        </Button>
      </Box>

      <Grid container spacing={3}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={photo.url}
                alt={photo.title}
              />
              <CardContent>
                <Typography variant="body2">{photo.title}</Typography>
                <IconButton onClick={() => handleVote(photo.id)}>
                  <ThumbUp />
                </IconButton>
                <Typography variant="body2">{photo.votes} votes</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Leaderboard
        </Typography>
        {leaderboard.map((entry, index) => (
          <Typography key={entry.id}>
            {index + 1}. {entry.title} - {entry.votes} votes
          </Typography>
        ))}
      </Box>

      <Box mt={4}>
        <Button
          variant="contained"
          color="secondary"
          onClick={determineWinners}
        >
          Determine Winners
        </Button>
        <PrizeSystem winners={winners} />
      </Box>
    </Container>
  );
};

const PrizeSystem = ({ winners }) => (
  <Box mt={4}>
    <Typography variant="h5" gutterBottom>
      Prize Winners
    </Typography>
    {winners.map((winner, index) => (
      <Typography key={winner.id}>
        {index + 1}st Place: {winner.title} - {winner.prize}
      </Typography>
    ))}
  </Box>
);

export default PhotoContestWidget;
