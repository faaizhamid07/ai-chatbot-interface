from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from anthropic import Anthropic
from dotenv import load_dotenv
import os

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

client = Anthropic(
    api_key=os.getenv("ECOMAGENT_API_KEY"),
    base_url="https://api.ecomagent.in/"
)

@app.get("/")
def home():
    return {"status": "running"}

@app.get("/chat")
def chat(message: str):
    try:
        response = client.messages.create(
            model="claude-opus-4.8",
            max_tokens=1000,
            messages=[
                {
                    "role": "user",
                    "content": message
                }
            ]
        )

        return {
            "reply": response.content[0].text
        }

    except Exception as e:
        print("ERROR:", repr(e))
        return {
            "reply": f"Error: {str(e)}"
        }