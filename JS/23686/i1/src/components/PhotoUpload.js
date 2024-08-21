import React, { useState } from 'react';
import { Button, TextField } from '@mui/material';

function PhotoUpload({ onSubmit }) {
  const [photoURL, setPhotoURL] = useState('');
  const [caption, setCaption] = useState('');

  const submitPhoto = (e) => {
    e.preventDefault();
    onSubmit({ url: photoURL, caption: caption });
    setPhotoURL('');
    setCaption('');
  };

  return (
    <form onSubmit={submitPhoto}>
      <TextField 
        label="Photo URL" 
        value={photoURL} 
        onChange={e => setPhotoURL(e.target.value)} 
        fullWidth 
        required 
      />
      <TextField 
        label="Caption" 
        value={caption} 
        onChange={e => setCaption(e.target.value)} 
        fullWidth 
        margin="normal"
      />
      <Button type="submit" variant="contained" color="primary">
        Submit Photo
      </Button>
    </form>
  );
}

export default PhotoUpload;