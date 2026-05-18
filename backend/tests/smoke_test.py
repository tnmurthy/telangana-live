"""
Smoke Tests for Telangana.Live Backend
Quick validation that core systems initialize without errors.
Run before comprehensive testing to catch major breakage early.
"""

import sys
import os

# Add parent directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


def test_backend_imports():
    """Verify all core backend modules import successfully."""
    try:
        from core.config import CONFIG
        from core.database import db
        from core.logger import logger
        from core.llm_provider import LLMProvider
        assert CONFIG is not None
        assert logger is not None
        print("[OK] Core imports successful")
    except Exception as e:
        raise AssertionError(f"Core import failed: {e}")


def test_agent_imports():
    """Verify all agents can be imported without errors."""
    try:
        from agents.content_monitor import ContentMonitor
        from agents.content_generator import ContentGenerator
        from agents.quality_checker import QualityChecker
        from agents.price_sync_agent import PriceSyncAgent
        from agents.news_sync_agent import NewsSyncAgent
        assert all([ContentMonitor, ContentGenerator, QualityChecker, PriceSyncAgent, NewsSyncAgent])
        print("[OK] All agents import successfully")
    except Exception as e:
        raise AssertionError(f"Agent import failed: {e}")


def test_config_loaded():
    """Verify environment configuration is properly loaded."""
    try:
        from core.config import CONFIG
        assert CONFIG is not None, "CONFIG not loaded"
        # Note: Some env vars may not be set in all environments (local dev vs cloud)
        # Check that at least the config object exists and has basic structure
        assert isinstance(CONFIG, dict), "CONFIG is not a dictionary"
        print("[OK] Configuration loaded successfully")
    except AssertionError as e:
        raise AssertionError(f"Configuration check failed: {e}")
    except Exception as e:
        raise AssertionError(f"Config load error: {e}")


def test_llm_provider_initialization():
    """Verify LLM provider can be initialized."""
    try:
        from core.llm_provider import LLMProvider
        from core.config import CONFIG
        
        provider = LLMProvider()
        assert provider is not None, "LLMProvider object is None"
        # Don't validate specific provider - it may be configured differently per environment
        print("[OK] LLM provider initialized successfully")
    except Exception as e:
        raise AssertionError(f"LLM provider initialization failed: {e}")


def test_database_module_loads():
    """Verify database module can be loaded (connection test is environment-dependent)."""
    try:
        from core.database import db
        assert db is not None
        # Don't test actual connection in smoke test as it requires live Supabase
        print("[OK] Database module loaded successfully")
    except Exception as e:
        raise AssertionError(f"Database module load failed: {e}")


def test_logger_initialization():
    """Verify logging system initializes."""
    try:
        from core.logger import logger
        assert logger is not None
        # Try to log something to ensure it's working
        logger.info("[SMOKE] Smoke test in progress...")
        print("[OK] Logger initialized successfully")
    except Exception as e:
        raise AssertionError(f"Logger initialization failed: {e}")


if __name__ == "__main__":
    """Run smoke tests directly without pytest."""
    print("\n" + "="*70)
    print("TELANGANA.LIVE BACKEND SMOKE TEST")
    print("="*70 + "\n")
    
    tests = [
        ("Core Imports", test_backend_imports),
        ("Agent Imports", test_agent_imports),
        ("Configuration", test_config_loaded),
        ("LLM Provider", test_llm_provider_initialization),
        ("Database Module", test_database_module_loads),
        ("Logger", test_logger_initialization),
    ]
    
    passed = 0
    failed = 0
    
    for test_name, test_func in tests:
        try:
            print(f"\n[TEST] {test_name}...", end=" ")
            test_func()
            passed += 1
        except AssertionError as e:
            print(f"\n[FAIL] {e}")
            failed += 1
        except Exception as e:
            print(f"\n[ERROR] {e}")
            failed += 1
    
    print("\n" + "="*70)
    print(f"RESULTS: {passed} passed, {failed} failed")
    print("="*70 + "\n")
    
    sys.exit(0 if failed == 0 else 1)
