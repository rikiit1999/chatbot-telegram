// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const fetch = require('node-fetch') ;
const cors = require('cors');

// Initialize Express app
const app = express();
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://itrikiatt:itrikiatt@cluster0.jsi3wz1.mongodb.net/chatbot-telegram?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Message schema and model
const messageSchema = new mongoose.Schema({
    username: String,
    text: String,
});
const Message = mongoose.model('Message', messageSchema);

// Telegram Bot details
const botToken = ''; // Replace with Telegram bot token
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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});