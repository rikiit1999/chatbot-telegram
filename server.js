const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fetch = require('node-fetch') ;
const cors = require('cors');

require('dotenv').config();

const Message = require('./models/Message'); // Import the Message model

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Telegram Bot details
const botToken = process.env.SECRET_TOKEN;

const groupChatId = '-1002229716632'; // Replace with group chat ID

// Endpoint to send a message
app.post('/send-message', async (req, res) => {
    const { username, text } = req.body;

    if (!username || !text) {
        return res.status(400).json({ message: 'Username and text are required' });
    }

    try {
        // Save message to MongoDB
        const newMessage = new Message({ username, text });
        await newMessage.save();

        // Send message to Telegram
        // axios
        const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: groupChatId,
                text: `${username}: ${text}`,
            }),
        });

        const result = await response.json();

        console.log('Telegram API Response:', result);

        if (response.ok) {
            res.status(200).json({ message: 'Message sent successfully' });
        } else {
            res.status(500).json({ message: result.description || 'Failed to send message' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'An error occurred' });
    }
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});