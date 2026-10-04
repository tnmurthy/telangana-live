"""
telangana.live's tables live in the `telangana` schema of a Supabase project
shared with other apps (supabase/migrations/20261004_telangana_schema.sql).
Backend writers must target that schema, never `public`.

Run with:  pytest tests/test_database_schema.py
"""
import os
import sys
from unittest.mock import patch

repo_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(repo_root, "backend"))

import core.database as database  # noqa: E402


def test_backend_client_targets_telangana_schema():
    db = database.SupabaseDB()
    db.url, db.key = "https://example.supabase.co", "service-key"
    with patch.object(database, "create_client") as raw:
        _ = db.client
    _, kwargs = raw.call_args
    assert kwargs["options"].schema == "telangana"


def test_news_aggregation_writes_to_telangana_schema():
    path = os.path.join(repo_root, "backend", "scripts", "news_aggregation.py")
    source = open(path, encoding="utf-8").read()
    assert '"Content-Profile": SUPABASE_SCHEMA' in source
    assert 'SUPABASE_SCHEMA = os.environ.get("SUPABASE_SCHEMA", "telangana")' in source
