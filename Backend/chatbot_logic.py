import requests
import config
import os

class HybridChatbot:
    def __init__(self):
        self.history_file = "chat_history.txt"
        self.max_turns = 6  # Remember up to 6 exchanges

        self.predefined_responses = {
            "hello": "Hi there! How can I assist you today?",
            "hi": "Hello! What’s on your mind?",
            "hey": "Hey! Ready to talk health?",
        }

        with open("doctor_chatbot_prompt.txt", "r") as file:
            self.context = file.read()

        # Load history from file (if it exists)
        self.history = self.load_history()

        self.gemini_api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent"

    def load_history(self):
        if os.path.exists(self.history_file):
            with open(self.history_file, "r") as file:
                lines = file.read().strip().split("\n")
                return lines
        return []

    def save_history(self):
        with open(self.history_file, "w") as file:
            file.write("\n".join(self.history))

    def clear_history(self):
        self.history = []
        if os.path.exists(self.history_file):
            os.remove(self.history_file)

    def get_response(self, user_input):
        user_input_lower = user_input.lower()

        if user_input_lower in self.predefined_responses:
            return self.predefined_responses[user_input_lower]

        # Add patient message to history
        self.history.append(f"Patient: {user_input}")

        # Limit to last N exchanges
        if len(self.history) > self.max_turns * 2:
            self.history = self.history[-self.max_turns * 2:]

        prompt = f"{self.context}\n\n" + "\n".join(self.history) + "\nDoctor:"

        headers = {"Content-Type": "application/json"}
        params = {"key": config.GEMINI_API_KEY}
        data = {
            "contents": [
                {
                    "parts": [
                        {"text": prompt}
                    ]
                }
            ]
        }

        try:
            response = requests.post(self.gemini_api_url, headers=headers, params=params, json=data)
            result = response.json()

            if "candidates" in result:
                reply = result['candidates'][0]['content']['parts'][0]['text']
                self.history.append(f"Doctor: {reply}")
                self.save_history()
                return reply
            else:
                return f"Error from Gemini API: {result.get('error', 'No candidates returned')}"
        except Exception as e:
            return f"Error contacting Gemini API: {str(e)}"





