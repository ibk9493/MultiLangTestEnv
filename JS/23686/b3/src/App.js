import React, { useState, useEffect } from 'react';
import { Container, Grid, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import PhotoUpload from './components/PhotoUpload';
import PhotoGallery from './components/PhotoGallery';
import Leaderboard from './components/Leaderboard';
import AdminPanel from './components/AdminPanel';

function App() {
  const [photos, setPhotos] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [sortCriteria, setSortCriteria] = useState('mostVotes');
  const [filterCategory, setFilterCategory] = useState('all');
  const [userVotes, setUserVotes] = useState({});

  const ADMIN_PASSWORD = 'admin123';
  const VOTES_PER_DAY = 5;

  useEffect(() => {
    const storedVotes = JSON.parse(localStorage.getItem('userVotes')) || {};
    setUserVotes(storedVotes);
  }, []);

  const handlePhotoSubmit = (photo) => {
    const newPhoto = { 
      ...photo, 
      votes: 0, 
      comments: [], 
      disqualified: false, 
      date: new Date().toISOString(),
      category: photo.category || 'uncategorized' // Add category support
    };
    setPhotos([...photos, newPhoto]);
  };

  const handleVote = (index) => {
    const today = new Date().toDateString();
    const userVotesToday = userVotes[today] || 0;

    if (userVotesToday < VOTES_PER_DAY && !photos[index].disqualified) {
      const newPhotos = [...photos];
      newPhotos[index].votes += 1;
      setPhotos(newPhotos);

      const newUserVotes = {...userVotes};
      newUserVotes[today] = userVotesToday + 1;
      setUserVotes(newUserVotes);
      localStorage.setItem('userVotes', JSON.stringify(newUserVotes));
    } else {
      alert("You've reached your voting limit for today!");
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

  const sortPhotos = (photos) => {
    switch (sortCriteria) {
      case 'mostVotes':
        return [...photos].sort((a, b) => b.votes - a.votes);
      case 'mostRecent':
        return [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return photos;
    }
  };

  const filterPhotos = (photos) => {
    if (filterCategory === 'all') return photos;
    return photos.filter(photo => photo.category === filterCategory);
  };

  const displayedPhotos = sortPhotos(filterPhotos(photos));

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
      <Grid container spacing={2} style={{ marginBottom: '20px' }}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
              <MenuItem value="mostVotes">Most Votes</MenuItem>
              <MenuItem value="mostRecent">Most Recent</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Filter By Category</InputLabel>
            <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="landscape">Landscape</MenuItem>
              <MenuItem value="portrait">Portrait</MenuItem>
              <MenuItem value="abstract">Abstract</MenuItem>
              <MenuItem value="uncategorized">Uncategorized</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <PhotoGallery 
            photos={displayedPhotos} 
            onVote={handleVote} 
            onComment={handleComment}
            isAdmin={isAdmin}
            onDisqualify={handleDisqualify}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Leaderboard photos={displayedPhotos.filter(photo => !photo.disqualified)} />
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