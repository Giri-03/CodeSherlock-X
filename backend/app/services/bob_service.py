import os
import requests

from dotenv import load_dotenv

from app.utils.response_parser import (
    extract_ai_text
)

load_dotenv()

# Supports any OpenAI-compatible endpoint.
# Defaults to Groq (free tier: https://console.groq.com)
# Set LLM_API_KEY and optionally LLM_API_URL + LLM_MODEL in .env
LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_API_URL = os.getenv(
    "LLM_API_URL",
    "https://api.groq.com/openai/v1/chat/completions"
)
LLM_MODEL = os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")


def send_bob_request(prompt: str, max_tokens: int = 1200):
    """
    Generic LLM request handler (OpenAI-compatible chat completions).
    Works with Groq, OpenAI, Ollama, or any compatible provider.
    """

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

    response.raise_for_status()

    data = response.json()

    # OpenAI chat completions format: choices[0].message.content
    if "choices" in data and data["choices"]:
        choice = data["choices"][0]
        if "message" in choice:
            return choice["message"]["content"]
        if "text" in choice:
            return choice["text"]

    # WatsonX / other formats fallback
    return extract_ai_text(data)


def analyze_repository_with_bob(context: str):
    """
    Analyze repository architecture and engineering structure.
    """

    prompt = f"""You are an expert software architect.

Analyze this software repository.

Provide clean markdown with sections.

Include:

# Architecture Overview
- Explain overall architecture

# Main Modules
- Important modules and responsibilities

# Framework Analysis
- Explain framework usage

# Engineering Risks
- Potential scalability or maintainability concerns

# Recommendations
- Suggested engineering improvements

Repository Context:
{context}
"""

    return send_bob_request(prompt, max_tokens=1500)


def ask_repository_question(context: str, question: str):
    """
    Repository-aware AI chat.
    """

    prompt = f"""You are an expert software architect.

Use the repository context below to answer the user's question accurately.

Return professional markdown.

Repository Context:
{context}

User Question:
{question}

Include:
- direct explanation
- architecture insights
- likely relevant modules/files
- engineering observations
"""

    return send_bob_request(prompt, max_tokens=1200)


def analyze_pull_request(diff: str):
    """
    Analyze pull request impact.
    """

    prompt = f"""You are an expert senior software engineer.

Analyze this pull request diff.

Return professional markdown.

Include:

# Pull Request Summary
- Explain changes clearly

# Impacted Modules
- Which systems are affected

# Regression Risks
- Possible breaking behavior

# Security Concerns
- Security implications

# Recommended Tests
- Suggested testing strategy

# Deployment Risks
- Infrastructure or rollout concerns

Pull Request Diff:
{diff[:12000]}
"""

    return send_bob_request(prompt, max_tokens=1600)


def generate_documentation(context: str, doc_type: str):
    """
    Generate engineering documentation.
    """

    prompt = f"""Generate professional engineering documentation.

Return clean markdown.

Documentation Type:
{doc_type}

Include:
- overview
- architecture
- setup
- workflows
- important modules
- engineering notes

Repository Context:
{context}
"""

    return send_bob_request(prompt, max_tokens=1800)


def analyze_technical_debt(context: str):
    """
    Analyze technical debt and maintainability.
    """

    prompt = f"""You are a principal software architect.

Analyze this repository for technical debt and engineering risks.

Return professional markdown.

Include:

# Maintainability Score
Give a score from 1-10

# Risky Modules
- Explain risky areas

# Architecture Concerns
- Coupling
- scalability
- complexity

# Complexity Hotspots
- Potentially fragile systems

# Refactor Recommendations
- Suggested improvements

# Long-Term Engineering Risks
- Future scaling concerns

Repository Context:
{context}
"""

    return send_bob_request(prompt, max_tokens=1600)
