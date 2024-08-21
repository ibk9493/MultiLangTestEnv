import React, { useState } from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Select,
  MenuItem,
} from '@mui/material';

function PhotoGallery({ photos, onVote, onComment }) {
  const [newComment, setNewComment] = useState('');
  const [sortBy, setSortBy] = useState('votes');
  const [filterCategory, setFilterCategory] = useState('all'); // Assuming we'll add categories later

  // Function to sort photos based on criteria
  const sortPhotos = (photos) => {
    switch (sortBy) {
      case 'votes':
        return [...photos].sort((a, b) => b.votes - a.votes);
      case 'recent':
        // Assuming each photo has a timestamp or date property
        return [...photos].sort((a, b) => new Date(b.date) - new Date(a.date));
      default:
        return photos;
    }
  };

  // Function to filter photos by category
  const filterPhotos = (photos) => {
    if (filterCategory === 'all') return photos;
    return photos.filter((photo) => photo.category === filterCategory);
  };

  const sortedAndFilteredPhotos = sortPhotos(filterPhotos(photos));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <MenuItem value="votes">Most Votes</MenuItem>
          <MenuItem value="recent">Most Recent</MenuItem>
        </Select>

        {/* Placeholder for future category filter */}
        <Select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} disabled>
          <MenuItem value="all">All Categories</MenuItem>
          {/* Add more categories here when needed */}
        </Select>
      </div>

      {sortedAndFilteredPhotos.map((photo, index) => (
        <Card key={index} style={{ marginBottom: '20px' }} elevation={3}>
          <CardMedia
            component="img"
            alt={photo.caption}
            height="140"
            image={photo.url}
            title={photo.caption}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {photo.caption}
            </Typography>
            <Button variant="outlined" color="primary" onClick={() => onVote(index)}>
              Vote ({photo.votes})
            </Button>
            <div>
              <List>
                {photo.comments &&
                  photo.comments.map((comment, cIndex) => (
                    <ListItem key={cIndex}>
                      <ListItemText primary={comment} />
                    </ListItem>
                  ))}
              </List>
              <TextField
                fullWidth
                variant="outlined"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={() => {
                  onComment(index, newComment);
                  setNewComment('');
                }}
              >
                Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default PhotoGallery;
