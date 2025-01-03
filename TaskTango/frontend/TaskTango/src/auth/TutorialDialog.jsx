import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton, Box, Typography, TextField, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const CS571_WITAI_ACCESS_TOKEN = "JPJX7CP4RXL5CHVZL3KE2C6OOZW4RXMZ";

const TutorialDialog = ({ open, onClose }) => {
  const [messages, setMessages] = useState([
    { sender: 'system', text: 'Welcome to TaskTango! :) Type your question, or ask for help if you’re lost!' },
  ]);
  const [userInput, setUserInput] = useState('');

  // Handle sending a message
  const handleSend = async () => {
    if (!userInput.trim()) return;

    // Append user's message to chat
    setMessages((prev) => [...prev, { sender: 'user', text: userInput }]);

    try {
      const response = await fetch(`https://api.wit.ai/message?q=${encodeURIComponent(userInput)}`, {
        headers: { Authorization: `Bearer ${CS571_WITAI_ACCESS_TOKEN}` },
      });

      if (!response.ok) {
        setMessages((prev) => [
          ...prev,
          { sender: 'system', text: "Sorry, I couldn't process your request. Please try again." },
        ]);
        return;
      }

      const data = await response.json();
      console.log("Wit.AI response:", data);

      let intent = null;
      if (data.intents && data.intents.length > 0) {
        intent = data.intents[0].name;
      }

      // Handle intents
      if (intent === "project_abstract") {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'system',
            text: `TaskTango is a user-friendly project management tool designed to streamline task tracking and collaboration through customizable Kanban boards. Users can create multiple Kanban boards with custom columns that fit the unique workflows of their projects or teams. Each board allows for seamless task management, including creating, editing, and moving tasks between different stages of progress.`,
          },
        ]);
      } else if (intent === "customer_target") {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'system',
            text: `TaskTango is designed for individuals and teams across various industries who need a flexible and intuitive project management tool. It caters to personal and professional project management needs, making it an ideal solution for anyone looking to improve task tracking and team communication.`,
          },
        ]);
      } else if (intent === "get_help") {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'system',
            text: `Here are some tips to get started with TaskTango:\n- Create a new Kanban board to organize your tasks.\n- Add custom columns to fit your workflow.\n- Drag and drop tasks between columns to track progress.\n- Share your board with others and assign roles like viewer or editor.\n- Use the duplicate board feature to quickly replicate workflows.`,

          },
        ]);
      } else {
        // Default response for any other intent
        setMessages((prev) => [
          ...prev,
          {
            sender: 'system',
            text: "Sorry, I cannot answer that question right now. I hope to provide an answer in the next update.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error during message handling:", error);
      setMessages((prev) => [
        ...prev,
        { sender: 'system', text: "An error occurred. Please try again later." },
      ]);
    }

    setUserInput('');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: { height: '500px', width: '600px', display: 'flex', flexDirection: 'column' },
      }}
    >
      <DialogTitle>
        Tutorial
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ flex: 1, overflowY: 'auto' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {messages.map((msg, index) => (
            <Box
              key={index}
              sx={{
                display: 'flex',
                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  bgcolor: msg.sender === 'user' ? '#d0f0d0' : '#e0e0ff',
                  borderRadius: 2,
                  p: 1,
                  maxWidth: '70%',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {msg.text}
              </Typography>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
        <TextField
          variant="outlined"
          size="small"
          fullWidth
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <Button onClick={handleSend} variant="contained" sx={{ height: '40px' }}>
          Send
        </Button>
      </Box>
    </Dialog>
  );
};

export default TutorialDialog;
