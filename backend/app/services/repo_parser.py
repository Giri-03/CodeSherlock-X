import os

IMPORTANT_FILES = [
    "package.json",
    "requirements.txt",
    "README.md",
    "pyproject.toml",
    "Dockerfile",
    "docker-compose.yml",
    "next.config.js",
    "vite.config.js",
    "tsconfig.json"
]

IGNORE_DIRS = [
    ".git",
    "node_modules",
    "__pycache__",
    "venv",
    ".next",
    "dist",
    "build",
    ".idea",
    ".vscode",
    "docs",
    "examples",
    "example",
    "tests",
    "test",
    "__tests__"
]

MAX_TREE_DEPTH = 4
MAX_FILE_SIZE = 12000


def generate_directory_tree(
    start_path,
    prefix="",
    depth=0
):
    """
    Generate clean repository tree.
    """

    tree = ""

    if depth > MAX_TREE_DEPTH:
        return tree

    try:
        items = sorted(os.listdir(start_path))
    except Exception:
        return tree

    for item in items:
        if item in IGNORE_DIRS:
            continue

        item_path = os.path.join(start_path, item)

        tree += f"{prefix}|-- {item}\n"

        if os.path.isdir(item_path):
            tree += generate_directory_tree(
                item_path,
                prefix + "    ",
                depth + 1
            )

    return tree


def extract_important_files(repo_path):
    """
    Extract important project files.
    """

    extracted = {}

    for root, dirs, files in os.walk(repo_path):
        dirs[:] = [
            d for d in dirs
            if d not in IGNORE_DIRS
        ]

        for file in files:
            if file not in IMPORTANT_FILES:
                continue

            file_path = os.path.join(root, file)

            relative_path = os.path.relpath(
                file_path,
                repo_path
            )

            try:
                with open(
                    file_path,
                    "r",
                    encoding="utf-8",
                    errors="ignore"
                ) as f:
                    extracted[relative_path] = f.read(
                        MAX_FILE_SIZE
                    )

            except Exception:
                extracted[relative_path] = (
                    "Could not read file"
                )

    return extracted


def detect_framework(important_files):
    """
    Detect framework accurately.
    """

    file_keys = list(
        important_files.keys()
    )

    combined = "\n".join(
        important_files.values()
    ).lower()

    joined_keys = " ".join(
        file_keys
    ).lower()

    if "next.config.js" in joined_keys:
        return "Next.js"

    if "vite.config.js" in joined_keys:
        return "Vite"

    if "package.json" in joined_keys:
        if '"next"' in combined:
            return "Next.js"

        if '"react"' in combined:
            return "React"

        if '"vue"' in combined:
            return "Vue"

        if '"nuxt"' in combined:
            return "Nuxt"

        if '"@angular"' in combined:
            return "Angular"

        if '"express"' in combined:
            return "Express"

        if '"@nestjs"' in combined:
            return "NestJS"

    if (
        "requirements.txt" in joined_keys
        or "pyproject.toml" in joined_keys
    ):
        if "django" in combined:
            return "Django"

        if "fastapi" in combined:
            return "FastAPI"

        if "flask" in combined:
            return "Flask"

    return "Unknown"


def parse_repository(repo_path):
    """
    Main parser.
    """

    tree = generate_directory_tree(repo_path)

    important_files = extract_important_files(
        repo_path
    )

    framework = detect_framework(
        important_files
    )

    return {
        "directory_tree": tree,
        "important_files": important_files,
        "framework": framework
    }