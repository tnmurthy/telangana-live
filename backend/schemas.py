from datetime import UTC, datetime

from pydantic import BaseModel, Field


class ContentModel(BaseModel):
    title: str = Field(..., min_length=5, max_length=200)
    category: str
    content: str
    source_url: str | None = None
    generated_code: str | None = None
    status: str = "active"
    token_usage: int = 0
    civic_tags: list[str] | None = None
    entities: dict | None = None
    district: str | None = None
    vector_embedding: list[float] | None = None
    created_at: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())

class ActivityLogModel(BaseModel):
    agent: str
    action: str
    status: str
    details: str | None = None
    tokens_used: int = 0
    timestamp: str = Field(default_factory=lambda: datetime.now(UTC).isoformat())

class CivicCorrelationModel(BaseModel):
    content_id: int
    entity_type: str
    entity_id: str
    correlation_score: float = 1.0
    is_active: bool = True
    created_at: str | None = Field(default_factory=lambda: datetime.now(UTC).isoformat())

