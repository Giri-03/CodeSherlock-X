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
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")


def send_bob_request(prompt: str, max_tokens: int = 400):
    payload = {
        "model": LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
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
        return "LLM rate limit exceeded. Please try again later."

    response.raise_for_status()

    data = response.json()

    if "choices" in data and data["choices"]:
        choice = data["choices"][0]
        if "message" in choice:
            return choice["message"]["content"]
        if "text" in choice:
            return choice["text"]

    return extract_ai_text(data)


def analyze_repository_with_bob(context: str):
    prompt = f"""
Analyze this software repository.

Repository Context:
{context[:6000]}
"""
    return send_bob_request(prompt, 400)


def ask_repository_question(context: str, question: str):
    prompt = f"""
Repository Context:
{context[:6000]}

Question:
{question}
"""
    return send_bob_request(prompt, 300)


def analyze_pull_request(diff: str):
    prompt = f"""
Analyze this pull request diff:

{diff[:4000]}
"""
    return send_bob_request(prompt, 500)


def generate_documentation(context: str, doc_type: str):
    prompt = f"""
Generate {doc_type} documentation.

Repository Context:
{context[:6000]}
"""
    return send_bob_request(prompt, 500)


def analyze_technical_debt(context: str):
    prompt = f"""
Analyze technical debt.

Repository Context:
{context[:6000]}
"""
    return send_bob_request(prompt, 500)
