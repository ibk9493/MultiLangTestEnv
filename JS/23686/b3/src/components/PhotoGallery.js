import React, { useState } from 'react';
import { Card, CardMedia, CardContent, Typography, Button, TextField, List, ListItem, ListItemText, Chip } from '@mui/material';

function PhotoGallery({ photos, onVote, onComment, isAdmin, onDisqualify }) {
  const [commentText, setCommentText] = useState('');

  const handleCommentSubmit = (photoIndex) => {
    onComment(photoIndex, commentText);
    setCommentText('');
  };

  return (
    <div>
      {photos.map((photo, index) => (
        <Card key={index} style={{ marginBottom: '20px' }}>
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
            <Chip label={photo.category} color="primary" style={{ marginBottom: '10px' }} />
            <Typography variant="body2" color="textSecondary" component="p">
              Submitted on: {new Date(photo.date).toLocaleDateString()}
            </Typography>
            <Button variant="outlined" color="primary" onClick={() => onVote(index)} disabled={photo.disqualified}>
              Vote ({photo.votes})
            </Button>
            {isAdmin && (
              <Button variant="outlined" color="secondary" onClick={() => onDisqualify(index)}>
                {photo.disqualified ? 'Requalify' : 'Disqualify'}
              </Button>
            )}
            <Typography variant="h6" style={{ marginTop: '10px' }}>Comments</Typography>
            <List>
              {photo.comments && photo.comments.map((comment, commentIndex) => (
                <ListItem key={commentIndex}>
                  <ListItemText primary={comment} />
                </ListItem>
              ))}
            </List>
            <TextField
              label="Add a comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button onClick={() => handleCommentSubmit(index)}>Submit Comment</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default PhotoGallery;