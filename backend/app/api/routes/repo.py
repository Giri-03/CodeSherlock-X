from fastapi import APIRouter
from pydantic import BaseModel

from app.services.github_service import (
    clone_repository,
    delete_repository
)

from app.services.repo_parser import (
    parse_repository
)

from app.services.bob_service import (
    analyze_repository_with_bob
)

from app.utils.context_store import (
    repository_context_store
)

router = APIRouter(
    prefix="/api/repo",
    tags=["Repository"]
)


class RepoRequest(BaseModel):
    github_url: str


@router.post("/analyze")
def analyze_repository(data: RepoRequest):

    cloned = clone_repository(
        data.github_url
    )

    parsed_data = parse_repository(
        cloned["local_path"]
    )

    important_preview = {
        key: value[:3000]
        for key, value in parsed_data[
            "important_files"
        ].items()
    }

    context = f"""
Framework:
{parsed_data["framework"]}

Directory Tree:
{parsed_data["directory_tree"][:12000]}

Important Files:
{important_preview}
"""

    repository_context_store[
        cloned["repo_id"]
    ] = context

    bob_analysis = analyze_repository_with_bob(
        context
    )

    response = {
        "repo_id": cloned["repo_id"],
        "framework": parsed_data["framework"],
        "directory_tree": parsed_data[
            "directory_tree"
        ],
        "important_files": list(
            parsed_data[
                "important_files"
            ].keys()
        ),
        "bob_analysis": bob_analysis
    }

    delete_repository(
        cloned["local_path"]
    )

    return response


from fastapi import HTTPException


@router.delete("/clear/{repo_id}")
def clear_repository(repo_id: str):
    """
    Clear a repository's context from the store.
    Called when the user starts a new analysis.
    """
    if repo_id not in repository_context_store:
        raise HTTPException(
            status_code=404,
            detail=f"Repository '{repo_id}' not found"
        )

    del repository_context_store[repo_id]

    return {
        "success": True,
        "message": f"Repository {repo_id} cleared"
    }


@router.delete("/clear")
def clear_all_repositories():
    """
    Clear all repository contexts from the store.
    """
    count = len(repository_context_store)
    repository_context_store.clear()

    return {
        "success": True,
        "message": f"Cleared {count} repository context(s)"
    }
