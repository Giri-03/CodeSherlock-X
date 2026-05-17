from fastapi import APIRouter
from pydantic import BaseModel

from app.utils.context_store import (
    repository_context_store
)

from app.services.bob_service import (
    generate_documentation
)

router = APIRouter(
    prefix="/api/docs",
    tags=["Documentation"]
)


class DocsRequest(BaseModel):
    repo_id: str
    doc_type: str


@router.post("/generate")
def generate_docs(data: DocsRequest):

    context = repository_context_store.get(
        data.repo_id
    )

    if not context:
        return {
            "error": "Repository context not found"
        }

    result = generate_documentation(
        context,
        data.doc_type
    )

    return {
        "doc_type": data.doc_type,
        "documentation": result
    }