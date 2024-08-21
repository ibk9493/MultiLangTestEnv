import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, TextField, List, ListItem, ListItemText } from '@mui/material';

function PhotoGallery({ photos, onVote, onComment }) {
  const [newComment, setNewComment] = useState('');

  return (
    <div>
      {photos.map((photo, index) => (
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
                {photo.comments && photo.comments.map((comment, cIndex) => (
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