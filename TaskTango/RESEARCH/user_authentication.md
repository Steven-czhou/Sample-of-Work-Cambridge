Research Report
Connecting React Login Pages to Backends
Summary of Work
I researched how to connect a React login page to a backend API to handle user authentication. This research involved understanding the concepts of token-based authentication (e.g., JWT), secure communication with APIs, and managing user sessions in a React application. I implemented a sample project where a React frontend communicates with a Node.js backend for login functionality.

Motivation
The login functionality is a critical component of our project, requiring secure and seamless communication between the React frontend and the backend API. To achieve this, I needed to learn how to handle user authentication, secure tokens (like JWT), and manage user sessions effectively.

Time Spent
Understanding Authentication Concepts: 1 hour
Following Tutorials and Implementing Sample Code: 2 hours
Writing this Report: 30 minutes
Total Time Spent: 3.5 hours

Results
Key Concepts Learned:
Token-Based Authentication

Use JSON Web Tokens (JWT) for stateless authentication. The backend issues a token upon successful login, which the frontend stores (commonly in localStorage or cookies) and sends with subsequent requests for authentication.
Securing API Communication

Always use HTTPS to encrypt data between frontend and backend.
Set HTTP headers to include authentication tokens.
Session Management in React

Use React context or libraries like Redux to store and manage user authentication state.
Implement automatic token refresh or logout on token expiration.
Implementation Steps:
Backend Setup (Node.js):

Created a simple Node.js server using Express to handle login requests.

Implemented a /login endpoint that validates user credentials and issues a JWT.

Sample code:

javascript
Copy code
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Dummy validation
    if (username === 'user' && password === 'pass') {
        const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).send('Invalid credentials');
});

app.listen(3001, () => console.log('Server running on port 3001'));
Frontend Implementation (React):

Created a login form with fields for username and password.

Used the fetch API to send credentials to the backend and handle the token response.

Stored the JWT in localStorage and added it to subsequent requests via headers.

Sample code:

javascript
Copy code
import React, { useState } from 'react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });
            if (!response.ok) throw new Error('Login failed');
            const { token } = await response.json();
            localStorage.setItem('token', token);
            setMessage('Login successful!');
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
            <p>{message}</p>
        </div>
    );
};

export default Login;
Testing the Flow:

Verified successful login by checking the JWT stored in localStorage.
Tested API authentication by sending requests with the token in the Authorization header.
Repository:
I have pushed the sample project to a repository for reference: RESEARCH-React-Login-Backend

Sources
React Documentation - Forms
MDN - Fetch API
JWT.io - Introduction to JWT
Node.js Express Guide
Auth0 Blog - React Authentication Using JWTs