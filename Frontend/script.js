// Function to add messages to chat UI
function addMessage(sender, text) {
    const chatMessages = document.getElementById("chat-messages");
    const messageDiv = document.createElement("div");
    messageDiv.className = sender === "user" ? "user-message message" : "bot-message message";
    messageDiv.textContent = text;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to latest message
}

// Function to handle user input and send API request
function sendMessage() {
    const userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    addMessage("user", userInput);

    // Corrected API request
    fetch("https://eac-chatbot-4jwb.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
    })
        .then(response => response.json())
        .then(data => {
            console.log("Bot response:", data);  // Debugging

            // Correctly extract chatbot response
            if (data.response) {
                addMessage("bot", data.response);
            } else {
                addMessage("bot", "Error: Unexpected API response format.");
            }
        })
        .catch(error => {
            console.error("Error fetching response:", error);
            addMessage("bot", "Error: Unable to connect to chatbot.");
        });

    document.getElementById("user-input").value = ""; // Clear input after sending
}
function clearChat() {
    fetch("https://eac-chatbot-4jwb.onrender.com/clear", {
        method: "POST"
    })
        .then(() => {
            document.getElementById("chat-messages").innerHTML = "";
            addMessage("bot", "Chat history cleared. How can I assist you now?");
        });
}



