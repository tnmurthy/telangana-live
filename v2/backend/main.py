from fastapi import FastAPI
from api.v2 import civic
from core.config import settings

app = FastAPI(title="Telangana.live Compute Engine", version="2.0.0")

app.include_router(civic.router, prefix="/api/v2/civic", tags=["Civic"])

@app.get("/")
async def root():
    return {"status": "online", "engine": "FastAPI 2.0"}
