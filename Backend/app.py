from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from chatbot_logic import HybridChatbot

app = FastAPI()
chatbot = HybridChatbot()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define data model
class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat(request: ChatRequest):
    """Main chat route"""
    banned_keywords = [
        "capital", "president", "country", "state", "india", "usa", "us", "math",
        "weather", "sports", "movie", "actor", "date", "currency", "science", "history"
    ]

    if any(word in request.question.lower() for word in banned_keywords):
        return {
            "response": "I am here to assist only with health-related questions. Please ask something about your well-being or medical concerns."
        }

    response = chatbot.get_response(request.question)
    return {"response": response}

# ✅ Add /clear route to reset memory
@app.post("/clear")
async def clear():
    chatbot.clear_history()
    return {"status": "cleared"}












