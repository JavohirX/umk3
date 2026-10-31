"""
tests/test_architecture_guard.py
Architecture Guard — blocks deployment if forbidden UI patterns are detected.

Runs in CI/CD on every push. Fails the pipeline if:
  1. Forbidden custom multiplayer UI overlay files exist in player/
  2. Forbidden CSS/HTML class patterns are present in JS source files
  3. Forbidden neon-theme or custom SVG hero card imports exist
  4. The multiplayer_ui.js tombstone has been replaced with real UI logic

This test is the permanent CI guardian against rogue custom overlays.
"""
import os
import re
import glob
import pytest

PLAYER_DIR = os.path.join(os.path.dirname(__file__), '..', 'player')
PLAYER_JS_DIR = os.path.join(PLAYER_DIR, 'js')

# ── Forbidden file patterns ─────────────────────────────────────────────────
FORBIDDEN_FILE_PATTERNS = [
    '*neon*',
    '*hero_picker*',
    '*theme_custom*',
    '*custom_ui*',
]

# ── Patterns that must NOT appear in any .js file ───────────────────────────
FORBIDDEN_JS_PATTERNS = [
    # Old MultiplayerUI neon class imports
    r'import\s+\{[^}]*MultiplayerUI[^}]*\}\s+from',
    r'new\s+MultiplayerUI\s*\(',
    # Neon SVG hero gradient IDs from the deleted multiplayer_ui.js
    r'scorpGrad|subzGrad|kitGrad|kanoGrad|liuGrad|sonyaGrad',
    # Old view IDs that belong to the deleted neon UI
    r'mp-view-hero-select',
    r'mp-view-versus',
    r'mp-view-victory',
    r'mk-multiplayer-root',
    # Specific neon UI strings
    r'SELECT YOUR FIGHTER',
    r'CANCEL BATTLE',
    r'Auto-cancels in',
    r'SHARE CHALLENGE LINK',
    r'hero-svg-card',
]

# ── Patterns that must NOT appear in any HTML file ───────────────────────────
FORBIDDEN_HTML_PATTERNS = [
    r'mp-view-hero-select',
    r'mp-view-versus',
    r'mp-view-victory',
    r'mk-multiplayer-root',
    r'mp-fullscreen-overlay',
]

# ── The tombstone file must NOT be replaced with real logic ─────────────────
TOMBSTONE_FILE = os.path.join(PLAYER_JS_DIR, 'multiplayer_ui.js')
TOMBSTONE_SIGNATURE = 'TOMBSTONE'  # must remain present
TOMBSTONE_FORBIDDEN = [
    r'this\.root\s*=',
    r'document\.createElement.*div',
    r'innerHTML\s*=\s*`',
    r'<svg',
    r'SELECT YOUR FIGHTER',
    r'CANCEL BATTLE',
]


# ── Tests ────────────────────────────────────────────────────────────────────

def test_no_forbidden_files_in_player():
    """No rogue custom-UI files should exist in the player directory."""
    found = []
    for pattern in FORBIDDEN_FILE_PATTERNS:
        matches = glob.glob(os.path.join(PLAYER_DIR, '**', pattern), recursive=True)
        found.extend(matches)
    assert not found, (
        f"Forbidden file(s) found in player/: {found}\n"
        "Delete these files — they are banned custom UI artifacts."
    )


def test_no_forbidden_js_patterns_in_source():
    """No neon overlay patterns must appear in any .js file under player/js/."""
    js_files = glob.glob(os.path.join(PLAYER_JS_DIR, '*.js'))
    violations = []
    for path in js_files:
        fname = os.path.basename(path)
        # Skip the tombstone itself for most checks (checked separately)
        if fname == 'multiplayer_ui.js':
            continue
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        for pattern in FORBIDDEN_JS_PATTERNS:
            if re.search(pattern, content):
                violations.append(f"{fname}: pattern '{pattern}'")
    assert not violations, (
        "Forbidden neon/custom-UI pattern(s) found in JS source files:\n"
        + "\n".join(f"  - {v}" for v in violations)
    )


def test_no_forbidden_html_patterns_in_entrypoints():
    """No neon overlay DOM elements must appear in any HTML entrypoint."""
    html_files = glob.glob(os.path.join(PLAYER_DIR, '*.html'))
    violations = []
    for path in html_files:
        fname = os.path.basename(path)
        with open(path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        # Strip script tags so inline anti-neon guard arrays don't self-match
        content_no_scripts = re.sub(r'<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>', '', content, flags=re.IGNORECASE)
        for pattern in FORBIDDEN_HTML_PATTERNS:
            if re.search(pattern, content_no_scripts):
                violations.append(f"{fname}: pattern '{pattern}'")
    assert not violations, (
        "Forbidden neon overlay DOM ID(s) found in HTML entrypoints:\n"
        + "\n".join(f"  - {v}" for v in violations)
    )


def test_tombstone_file_exists_and_is_safe():
    """multiplayer_ui.js must exist as a tombstone, not as a real UI module."""
    assert os.path.isfile(TOMBSTONE_FILE), (
        "player/js/multiplayer_ui.js tombstone is missing! "
        "It must exist to neutralize any cached client that tries to load it."
    )
    with open(TOMBSTONE_FILE, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()

    # Must still carry the tombstone signature
    assert TOMBSTONE_SIGNATURE in content, (
        "player/js/multiplayer_ui.js no longer contains 'TOMBSTONE' marker. "
        "It may have been replaced with real UI logic — revert it!"
    )

    # Must not contain real UI construction code
    for pattern in TOMBSTONE_FORBIDDEN:
        assert not re.search(pattern, content), (
            f"player/js/multiplayer_ui.js tombstone contains forbidden pattern '{pattern}'. "
            "It appears someone replaced the tombstone with real UI code — revert it!"
        )


def test_network_pure_has_no_ui_imports():
    """network_pure.js must not import or instantiate MultiplayerUI."""
    path = os.path.join(PLAYER_JS_DIR, 'network_pure.js')
    assert os.path.isfile(path), "network_pure.js is missing!"
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    assert 'MultiplayerUI' not in content, (
        "network_pure.js references MultiplayerUI — this is forbidden."
    )
    assert 'multiplayer_ui' not in content, (
        "network_pure.js imports from multiplayer_ui — this is forbidden."
    )


def test_game_pure_has_no_ui_imports():
    """game_pure.js must not import or instantiate MultiplayerUI."""
    path = os.path.join(PLAYER_JS_DIR, 'game_pure.js')
    assert os.path.isfile(path), "game_pure.js is missing!"
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    assert 'MultiplayerUI' not in content, (
        "game_pure.js references MultiplayerUI — this is forbidden."
    )
    assert 'multiplayer_ui' not in content, (
        "game_pure.js imports from multiplayer_ui — this is forbidden."
    )


def test_version_handshake_present_in_server():
    """server/multiplayer.py must send the build_version in the joined handshake."""
    path = os.path.join(os.path.dirname(__file__), '..', 'server', 'multiplayer.py')
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    assert 'build_version' in content, (
        "server/multiplayer.py is missing the 'build_version' handshake. "
        "Add it back — it's Safeguard #1 against stale client cache."
    )


def test_version_handshake_handler_present_in_client():
    """network_pure.js must verify the build_version and trigger hard-reload on mismatch."""
    path = os.path.join(PLAYER_JS_DIR, 'network_pure.js')
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    assert 'build_version' in content, (
        "network_pure.js is missing the 'build_version' handshake check. "
        "Add it back — it's Safeguard #1 against stale client cache."
    )
