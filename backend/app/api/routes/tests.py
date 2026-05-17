from fastapi import APIRouter
from pydantic import BaseModel

from app.utils.context_store import (
    repository_context_store
)

from app.services.bob_service import (
    analyze_technical_debt
)

router = APIRouter(
    prefix="/api/tests",
    tags=["Technical Debt"]
)


class DebtRequest(BaseModel):
    repo_id: str


@router.post("/technical-debt")
def technical_debt_analysis(
    data: DebtRequest
):

    context = repository_context_store.get(
        data.repo_id
    )

    if not context:
        return {
            "error": "Repository context not found"
        }

    result = analyze_technical_debt(
        context
    )

    return {
        "technical_debt": result
    }