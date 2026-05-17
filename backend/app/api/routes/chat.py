from fastapi import APIRouter
from pydantic import BaseModel

from app.utils.context_store import (
    repository_context_store
)

from app.services.bob_service import (
    ask_repository_question
)

router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    repo_id: str
    question: str


@router.post("/ask")
def ask_question(data: ChatRequest):

    context = repository_context_store.get(
        data.repo_id
    )

    if not context:
        return {
            "error": "Repository context not found"
        }

    answer = ask_repository_question(
        context,
        data.question
    )

    return {
        "question": data.question,
        "answer": answer
    }