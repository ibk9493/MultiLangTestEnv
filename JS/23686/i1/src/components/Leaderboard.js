import React from 'react';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

function Leaderboard({ photos }) {
  return (
    <div>
      <Typography variant="h6">Leaderboard</Typography>
      <List>
        {photos.map((photo, index) => (
          <ListItem key={index}>
            <ListItemText primary={`${index + 1}. ${photo.caption} - Votes: ${photo.votes}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}

export default Leaderboard;