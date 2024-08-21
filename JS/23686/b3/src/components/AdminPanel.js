import React from 'react';
import { Button, List, ListItem, ListItemText, Typography } from '@mui/material';

function AdminPanel({ photos, onDisqualify }) {
  return (
    <div>
      <Typography variant="h6">Admin Panel</Typography>
      <List>
        {photos.map((photo, index) => (
          <ListItem key={index}>
            <ListItemText primary={photo.caption} secondary={`Votes: ${photo.votes}`} />
            <Button 
              variant="outlined" 
              color="error" 
              onClick={() => onDisqualify(index)}
            >
              Disqualify
            </Button>
          </ListItem>
        ))}
      </List>
      {/* Here you can add more admin tools like comment moderation */}
    </div>
  );
}

export default AdminPanel;