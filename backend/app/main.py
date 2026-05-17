from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import repo, chat, pr, docs, tests

app = FastAPI(title="CodeSherlock X API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://codesherlock-x-1.onrender.com",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(repo.router)
app.include_router(chat.router)
app.include_router(pr.router)
app.include_router(docs.router)
app.include_router(tests.router)


@app.get("/")
def root():
    return {"message": "CodeSherlock X Backend Running"}
