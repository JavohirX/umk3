"""
Shared test setup: the whole run uses a throwaway database, so nothing logged while testing (the fight log's
background writer included) can land in the developer's real data/immortal_combat.db.
"""

import os
import tempfile

import pytest

import server.db as db
from server.telemetry import telemetry


@pytest.fixture(scope="session", autouse=True)
def throwaway_database():
    original = db.DB_PATH
    fd, path = tempfile.mkstemp(suffix=".db")
    os.close(fd)
    db.DB_PATH = path
    db.init_db()
    yield
    telemetry.flush()
    db.DB_PATH = original
    for suffix in ("", "-wal", "-shm"):
        try:
            os.remove(path + suffix)
        except OSError:
            pass


@pytest.fixture(autouse=True)
def fight_log_settles():
    """Whatever a test logged is written before the next test (and before it swaps its own database out)."""
    yield
    telemetry.flush()
