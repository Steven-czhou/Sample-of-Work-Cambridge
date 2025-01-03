import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Avatar, Box } from '@mui/material';

export default function ChangeAvatarDialog({ open, avatar, onAvatarChange, onClose }) {
  const handleFileChange = (event) => {
    const file = event.target.files[0]; // Get the uploaded file
    if (file) {
      const reader = new FileReader(); // Create a FileReader instance
      reader.onload = (e) => {
        onAvatarChange(e.target.result); // Update the avatar using the callback
      };
      reader.readAsDataURL(file); // Read the file content
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', pb: 1 }}
      >
        Change Avatar
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3, // Add spacing between the avatar and file upload button
        }}
      >
        {/* Avatar display */}
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            src={avatar}
            sx={{
              width: 120,
              height: 120,
              border: '4px solid #1976d2', // Add a blue border around the avatar
              borderRadius: '50%', // Ensure the avatar is circular
              boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)', // Add a subtle shadow
            }}
          />
        </Box>

        {/* Custom file upload button */}
        <Box>
          <input
            type="file"
            id="avatar-upload"
            accept="image/*" // Restrict the file type to images
            onChange={handleFileChange}
            style={{ display: 'none' }} // Hide the original file input
          />
          <label
            htmlFor="avatar-upload"
            style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: '#1976d2',
              color: '#fff',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = '#155a9c')} // Change color on hover
            onMouseLeave={(e) => (e.target.style.backgroundColor = '#1976d2')} // Reset color on hover out
          >
            Choose File
          </label>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'center' }}>
        <Button onClick={onClose} sx={{ color: '#1976d2', fontWeight: 'bold' }}>
          CLOSE
        </Button>
      </DialogActions>
    </Dialog>
  );
}
