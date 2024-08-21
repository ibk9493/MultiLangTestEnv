import React, { useState } from 'react';
import { Container, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import PhotoUpload from './components/PhotoUpload';
import PhotoGallery from './components/PhotoGallery';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';

function App() {
  const [photos, setPhotos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [password, setPassword] = useState('');

  const ADMIN_PASSWORD = 'admin123'; // Hard-coded password (not secure for production!)

  const handlePhotoSubmit = (photo) => {
    setPhotos([...photos, { ...photo, votes: 0, comments: [], disqualified: false }]);
  };

  const handleVote = (index) => {
    if (!photos[index].disqualified) {
      const newPhotos = [...photos];
      newPhotos[index].votes += 1;
      setPhotos(newPhotos.sort((a, b) => b.votes - a.votes));
    }
  };

  const handleComment = (index, comment) => {
    const newPhotos = [...photos];
    if (!newPhotos[index].comments) {
      newPhotos[index].comments = [];
    }
    newPhotos[index].comments.push(comment);
    setPhotos(newPhotos);
  };

  const handleDisqualify = (index) => {
    const newPhotos = [...photos];
    newPhotos[index].disqualified = !newPhotos[index].disqualified;
    setPhotos(newPhotos);
  };

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      setLoginOpen(false);
    } else {
      alert('Incorrect password');
    }
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" align="center" gutterBottom>
        Community Photo Contest
      </Typography>
      <Button 
        variant="contained" 
        color={isAdmin ? "secondary" : "primary"} 
        onClick={() => isAdmin ? setIsAdmin(false) : setLoginOpen(true)}
        style={{ position: 'absolute', top: '10px', right: '10px' }}
      >
        {isAdmin ? 'Logout' : 'Admin Login'}
      </Button>
      <PhotoUpload onSubmit={handlePhotoSubmit} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <PhotoGallery 
            photos={photos} 
            onVote={handleVote} 
            onComment={handleComment}
            isAdmin={isAdmin}
            onDisqualify={handleDisqualify}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Leaderboard photos={photos.filter(photo => !photo.disqualified)} />
          {isAdmin && <AdminPanel photos={photos} onDisqualify={handleDisqualify} />}
        </Grid>
      </Grid>
      <Dialog open={loginOpen} onClose={() => setLoginOpen(false)}>
        <DialogTitle>Admin Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLoginOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogin} color="primary">
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default App;