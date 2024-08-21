import React, { useState } from "react";
import {Button, Container, Grid, Typography } from "@mui/material";
import PhotoUpload from "./components/PhotoUpload";
import PhotoGallery from "./components/PhotoGallery";
import Leaderboard from "./components/Leaderboard";

import AdminPanel from "./components/AdminPanel";

function App() {
  
  const [isAdmin, setIsAdmin] = useState(false);
  const adminPassword = "admin123"; // Hardcoded password for simplicity

  const login = (password) => {
    if (password === adminPassword) {
      setIsAdmin(true);
    }
  };

  const [photos, setPhotos] = useState([]);
  const [userVotes, setUserVotes] = useState({}); // { userId: { photoIndex: count } }
  const VOTES_PER_DAY = 5; // Example limit


  const handlePhotoSubmit = (photo) => {
    setPhotos([...photos, { ...photo, votes: 0 }]);
  };


  // Function to check if a user can vote
  const canUserVote = (userId, photoIndex) => {
    const today = new Date().toDateString();
    if (!userVotes[userId] || !userVotes[userId][today]) {
      return true;
    }
    const votesToday = Object.values(userVotes[userId][today]).reduce((a, b) => a + b, 0);
    return votesToday < VOTES_PER_DAY && (!userVotes[userId][today][photoIndex] || userVotes[userId][today][photoIndex] < 1);
  };

  // Function to handle vote with limits
  const handleVote = (index) => {
    const userId = 'user123'; // This should be dynamically set based on user identity
    if (canUserVote(userId, index)) {
      const newPhotos = [...photos];
      newPhotos[index].votes += 1;
      setPhotos(newPhotos.sort((a, b) => b.votes - a.votes));

      // Update user's vote count
      setUserVotes(prev => {
        const userVoteData = { ...prev[userId] };
        const date = new Date().toDateString();
        userVoteData[date] = userVoteData[date] || {};
        userVoteData[date][index] = (userVoteData[date][index] || 0) + 1;
        return { ...prev, [userId]: userVoteData };
      });
    } else {
      alert('You have reached your voting limit for today or for this photo.');
    }
  };


  return (
    <Container maxWidth="md">
      <div>
        {!isAdmin ? (
          <Button
            variant="contained"
            color="primary"
            style={{ position: "absolute", top: 10, right: 10 }}
            onClick={() => {
              const password = prompt("Enter admin password:");
              login(password);
            }}
          >
            Admin Login
          </Button>
        ) : (
          <AdminPanel
            photos={photos}
            onDisqualify={(index) => {
              // Function to disqualify an image
              const newPhotos = photos.filter((_, i) => i !== index);
              setPhotos(newPhotos);
            }}
          />
        )}
        {/* Rest of your app */}
      </div>
      <Typography variant="h4" align="center" gutterBottom>
        Community Photo Contest
      </Typography>

      <PhotoUpload onSubmit={handlePhotoSubmit} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <PhotoGallery photos={photos} onVote={handleVote} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Leaderboard photos={photos} />
        </Grid>
      </Grid>
    </Container>
  );
}

export default App;
