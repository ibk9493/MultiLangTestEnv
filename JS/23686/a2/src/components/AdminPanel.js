import React from 'react';
import { Typography, List, ListItem, ListItemText, Button } from '@mui/material';

function AdminPanel({ photos, onDisqualify }) {
  return (
    <div>
      <Typography variant="h5">Admin Panel</Typography>
      <List>
        {photos.map((photo, index) => (
          <ListItem key={index}>
            <ListItemText 
              primary={photo.caption} 
              secondary={`Votes: ${photo.votes}, Comments: ${photo.comments ? photo.comments.length : 0}`} 
            />
            <Button 
              variant="outlined" 
              color={photo.disqualified ? "primary" : "secondary"}
              onClick={() => onDisqualify(index)}
            >
              {photo.disqualified ? 'Requalify' : 'Disqualify'}
            </Button>
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default AdminPanel;