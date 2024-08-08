async function sendMessage() {
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;
    const errorDiv = document.getElementById('error');

    if (!username || !message) {
        errorDiv.textContent = 'Username and message are required';
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, text: message }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            errorDiv.textContent = `Error: ${errorData.message || 'Failed to send message'}`;
        } else {
            alert('Message sent successfully');
            document.getElementById('username').value = '';
            document.getElementById('message').value = '';
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        errorDiv.textContent = 'An error occurred';
    }
}