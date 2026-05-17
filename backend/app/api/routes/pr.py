import uuid

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.services.github_service import (
    fetch_pull_request_diff
)

from app.services.bob_service import (
    analyze_pull_request
)

router = APIRouter(
    prefix="/api/pr",
    tags=["Pull Requests"]
)

# In-memory store: pr_id -> analysis result
pr_result_store: dict = {}


class PRRequest(BaseModel):
    pr_url: str


def _parse_pr_url(pr_url: str) -> dict:
    """Extract owner, repo, pr_number from a GitHub PR URL."""
    try:
        parts = pr_url.rstrip("/").split("/")
        owner = parts[3]
        repo = parts[4]
        pr_number = parts[-1]
        return {"owner": owner, "repo": repo, "pr_number": pr_number}
    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub PR URL format"
        )


@router.post("/analyze")
def analyze_pr(data: PRRequest):
    """
    Analyze a GitHub pull request.
    Returns a pr_id that can be used to clear the result later.
    """
    meta = _parse_pr_url(data.pr_url)

    diff = fetch_pull_request_diff(data.pr_url)

    analysis = analyze_pull_request(diff)

    pr_id = str(uuid.uuid4())

    result = {
        "pr_id": pr_id,
        "pr_url": data.pr_url,
        "owner": meta["owner"],
        "repo": meta["repo"],
        "pr_number": meta["pr_number"],
        "analysis": analysis
    }

    pr_result_store[pr_id] = result

    return result


@router.delete("/clear/{pr_id}")
def clear_pr_result(pr_id: str):
    """
    Clear a stored PR analysis result by pr_id.
    Called when the user clicks 'Clear' / 'Revert' on the frontend.
    """
    if pr_id not in pr_result_store:
        raise HTTPException(
            status_code=404,
            detail=f"PR result '{pr_id}' not found"
        )

    del pr_result_store[pr_id]

    return {
        "success": True,
        "message": f"PR result {pr_id} cleared successfully"
    }


@router.delete("/clear")
def clear_all_pr_results():
    """
    Clear all stored PR analysis results.
    """
    count = len(pr_result_store)
    pr_result_store.clear()

    return {
        "success": True,
        "message": f"Cleared {count} PR result(s)"
    }


@router.get("/result/{pr_id}")
def get_pr_result(pr_id: str):
    """
    Retrieve a previously stored PR analysis result.
    """
    if pr_id not in pr_result_store:
        raise HTTPException(
            status_code=404,
            detail=f"PR result '{pr_id}' not found"
        )

    return pr_result_store[pr_id]
