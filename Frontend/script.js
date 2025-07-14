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

    fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userInput }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.response) {
                addMessage("bot", data.response);
                speakText(data.response); // Optional TTS
            } else {
                addMessage("bot", "Error: Unexpected API response.");
            }
        })
        .catch(error => {
            console.error("Error:", error);
            addMessage("bot", "Error: Unable to connect to chatbot.");
        });

    document.getElementById("user-input").value = "";
}

// Voice-to-Text using Web Speech API
function startListening() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";
    recognition.start();

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("user-input").value = transcript;
        sendMessage();  // Auto-send after voice input
    };

    recognition.onerror = function (event) {
        console.error("Speech recognition error:", event.error);
        addMessage("bot", "Error using microphone.");
    };
}

// Optional: Text-to-Speech
function speakText(text) {
    if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        window.speechSynthesis.speak(utterance);
    }
}

// Clear chat history
function clearChat() {
    fetch("http://localhost:8000/clear", {
        method: "POST"
    })
        .then(() => {
            document.getElementById("chat-messages").innerHTML = "";
            addMessage("bot", "Chat history cleared. How can I assist you now?");
        });
}
