"""
Immortal Combat - One admin panel read, in a process of its own

`python -m server.admin_read` takes what to read as JSON on stdin and writes the answer to stdout. The game server is one
Python event loop relaying inputs, and Python runs one thread at a time, so adding up the fight log on another thread of
that process makes every relayed input wait its turn: one such read froze a load test of 100 fighting players for 15
seconds. In a process of its own, at the lowest priority, a read only gets the CPU the game isn't using.

Every query of a read sees the same moment of the database, so a fight that starts halfway through can't turn up in one
query and not the next. In WAL mode this holds nobody up: the game keeps writing while a read runs.
"""

import csv
import io
import json
import os
import sqlite3
import sys

import server.admin_stats as stats


def read_connection(path: str) -> sqlite3.Connection:
    conn = sqlite3.connect(path, timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA query_only=ON")
    conn.execute("BEGIN")
    return conn


def tab_page(conn: sqlite3.Connection, what: dict, scope: stats.Scope) -> bytes:
    tab = what["tab"]
    if tab == "fights":
        sections = stats.tab_fights(conn, scope, what["query"], what["only"], offset=what["offset"])
    elif tab == "quality":
        sections = stats.tab_quality(conn, scope, what["writer_health"])
    else:
        sections = stats.TABS[tab](conn, scope)
    return json.dumps({"status": "ok", "scope": stats.scope_summary(conn, scope), "sections": sections}).encode()


def fight_page(conn: sqlite3.Connection, what: dict) -> bytes:
    """null when there is no such fight."""
    detail = stats.fight_detail(conn, what["match_id"])
    return json.dumps(None if detail is None else {"status": "ok", **detail}).encode()


def export_file(conn: sqlite3.Connection, what: dict, scope: stats.Scope) -> bytes:
    columns, rows = stats.export_rows(conn, what["name"], scope)
    out = io.StringIO()
    out.write("﻿")  # without this mark Excel garbles Cyrillic names
    writer = csv.writer(out)
    writer.writerow(columns)
    writer.writerows(rows)
    return out.getvalue().encode("utf-8")


def main():
    if hasattr(os, "nice"):
        os.nice(19)
    what = json.load(sys.stdin)
    scope = stats.Scope(**what["scope"]) if "scope" in what else None
    conn = read_connection(what["db_path"])
    try:
        if what["kind"] == "tab":
            answer = tab_page(conn, what, scope)
        elif what["kind"] == "fight":
            answer = fight_page(conn, what)
        else:
            answer = export_file(conn, what, scope)
    finally:
        conn.close()
    sys.stdout.buffer.write(answer)


if __name__ == "__main__":
    main()
