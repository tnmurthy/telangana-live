from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ContentModel(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    category: str
    content: str
    source_url: Optional[str] = None
    generated_code: Optional[str] = None
    status: str = "active"
    token_usage: int = 0
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class ActivityLogModel(BaseModel):
    agent: str
    action: str
    status: str
    details: Optional[str] = None
    tokens_used: int = 0
    timestamp: str = Field(default_factory=lambda: datetime.now().isoformat())
