import React from 'react';
import { Card, CardMedia, CardContent, Typography, Button } from '@mui/material';

function PhotoGallery({ photos, onVote }) {
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
            <Button variant="outlined" color="primary" onClick={() => onVote(index)}>
              Vote ({photo.votes})
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default PhotoGallery;