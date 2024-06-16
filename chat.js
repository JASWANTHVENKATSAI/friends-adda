document.getElementById('chat-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const messageInput = document.getElementById('message');
    const message = messageInput.value.trim();
    if (message !== '') {
        const chatBox = document.getElementById('chat-box');
        const newMessage = document.createElement('div');
        newMessage.textContent = message;
        chatBox.appendChild(newMessage);
        messageInput.value = '';
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to the bottom
    }
});
