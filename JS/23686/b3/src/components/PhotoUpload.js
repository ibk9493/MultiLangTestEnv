import React, { useState } from 'react';
import { Button, TextField, Select, MenuItem, FormControl, InputLabel } from '@mui/material';

function PhotoUpload({ onSubmit }) {
  const [photoURL, setPhotoURL] = useState('');
  const [caption, setCaption] = useState('');
  const [category, setCategory] = useState('uncategorized');

  const submitPhoto = (e) => {
    e.preventDefault();
    onSubmit({ url: photoURL, caption: caption, category: category });
    setPhotoURL('');
    setCaption('');
    setCategory('uncategorized');
  };

  return (
    <form onSubmit={submitPhoto}>
      <TextField 
        label="Photo URL" 
        value={photoURL} 
        onChange={e => setPhotoURL(e.target.value)} 
        fullWidth 
        required 
        margin="normal"
      />
      <TextField 
        label="Caption" 
        value={caption} 
        onChange={e => setCaption(e.target.value)} 
        fullWidth 
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Category</InputLabel>
        <Select value={category} onChange={e => setCategory(e.target.value)}>
          <MenuItem value="landscape">Landscape</MenuItem>
          <MenuItem value="portrait">Portrait</MenuItem>
          <MenuItem value="abstract">Abstract</MenuItem>
          <MenuItem value="uncategorized">Uncategorized</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">
        Submit Photo
      </Button>
    </form>
  );
}

export default PhotoUpload;