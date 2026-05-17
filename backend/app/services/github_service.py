from git import Repo
import uuid
import os
import shutil
import stat
import time
import requests

TEMP_REPO_DIR = r"C:\temp\repos"

from fastapi import HTTPException
import requests


def fetch_pull_request_diff(pr_url: str):
    if "/pull/" not in pr_url:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid GitHub Pull Request URL"
        )

    parts = pr_url.rstrip("/").split("/")

    try:
        owner = parts[3]
        repo = parts[4]
        pr_number = parts[-1]

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Invalid GitHub PR URL"
        )

    api_url = (
        f"https://api.github.com/repos/"
        f"{owner}/{repo}/pulls/{pr_number}"
    )

    headers = {
        "Accept": "application/vnd.github.v3.diff",
        "User-Agent": "CodeSherlock-X"
    }

    response = requests.get(
        api_url,
        headers=headers,
        timeout=30
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail=f"GitHub API returned {response.status_code}"
        )

    return response.text

def clone_repository(github_url: str):
    """
    Clone GitHub repository temporarily.
    Optimized for large repositories.
    """

    os.makedirs(
        TEMP_REPO_DIR,
        exist_ok=True
    )

    repo_id = str(uuid.uuid4())[:8]

    local_path = os.path.join(
        TEMP_REPO_DIR,
        repo_id
    )

    Repo.clone_from(
        github_url,
        local_path,
        depth=1,
        multi_options=[
            "--single-branch"
        ]
    )

    return {
        "repo_id": repo_id,
        "local_path": local_path
    }


def remove_readonly(func, path, exc_info):
    """
    Fix Windows file permission issues.
    """
    os.chmod(path, stat.S_IWRITE)
    func(path)


def delete_repository(local_path: str):
    """
    Delete cloned repository safely.
    Windows-safe cleanup.
    """

    if not os.path.exists(local_path):
        return

    for _ in range(5):
        try:
            shutil.rmtree(
                local_path,
                onerror=remove_readonly
            )
            return

        except PermissionError:
            time.sleep(1)

    print(
        f"Warning: failed cleanup for {local_path}"
    )