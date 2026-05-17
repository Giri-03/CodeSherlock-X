import os
import requests
from dotenv import load_dotenv
from app.utils.response_parser import extract_ai_text

load_dotenv()

LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_API_URL = os.getenv(
    "LLM_API_URL",
    "https://api.groq.com/openai/v1/chat/completions"
)

# cheaper + faster model
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")


def send_bob_request(prompt: str, max_tokens: int = 400):
    payload = {
        "model": LLM_MODEL,
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "max_tokens": max_tokens,
        "temperature": 0.3
    }

    headers = {
        "Authorization": f"Bearer {LLM_API_KEY}",
        "Content-Type": "application/json"
    }

    response = requests.post(
        LLM_API_URL,
        headers=headers,
        json=payload,
        timeout=60
    )

    if response.status_code == 429:
        return "Groq API rate limit exceeded. Please try again in a minute."

    response.raise_for_status()

    data = response.json()

    if "choices" in data and data["choices"]:
        choice = data["choices"][0]
        if "message" in choice:
            return choice["message"]["content"]
        if "text" in choice:
            return choice["text"]

    return extract_ai_text(data)
