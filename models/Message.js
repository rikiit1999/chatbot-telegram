const mongoose = require('mongoose');

// Define the schema
const messageSchema = new mongoose.Schema({
    username: String,
    text: String,
});

// Create and export the model
const Message = mongoose.model('Message', messageSchema);
module.exports = Message;