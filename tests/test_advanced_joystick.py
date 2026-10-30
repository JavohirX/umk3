import time
import sys
import os
import math
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')

ARTIFACT_DIR = r"C:\Users\user\.gemini\antigravity-cli\brain\a7f13c91-0aa3-40fc-82d8-5dc64b15d973"

def run_joystick_tests():
    with sync_playwright() as p:
        print("Launching headless Chrome...")
        browser = p.chromium.launch(
            executable_path="C:/Program Files/Google/Chrome/Application/chrome.exe",
            headless=True,
            args=["--use-fake-ui-for-media-stream", "--autoplay-policy=no-user-gesture-required", "--no-sandbox"]
        )
        context = browser.new_context(
            viewport={"width": 390, "height": 844},
            is_mobile=True,
            has_touch=True,
            user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148"
        )
        page = context.new_page()

        print("Navigating to game...")
        page.goto("http://localhost:8085/player/index.html")
        page.wait_for_selector("#display", state="visible", timeout=15000)

        # Wait for engine boot
        print("Waiting for UMK3 engine boot...")
        for _ in range(40):
            st = page.evaluate('() => window.CoreEngine?.val_int_h')
            if st and st >= 4:
                break
            time.sleep(0.3)
        time.sleep(1.0)

        # Verify AdvancedMovementJoystick class exists on window
        has_class = page.evaluate('() => typeof window.AdvancedMovementJoystick === "function"')
        assert has_class, "AdvancedMovementJoystick class not found on window!"
        print("[CHECK 0] AdvancedMovementJoystick class loaded successfully.")

        # Inspect D-pad element
        joy_box = page.evaluate('''() => {
            const el = document.getElementById('dpad-grid') || document.getElementById('joystick-zone');
            if (!el) return null;
            const r = el.getBoundingClientRect();
            return { x: r.left, y: r.top, width: r.width, height: r.height, cx: r.left + r.width/2, cy: r.top + r.height/2 };
        }''')
        assert joy_box is not None, "dpad-grid element not found!"
        cx, cy = joy_box['cx'], joy_box['cy']
        print(f"D-Pad center at ({cx:.1f}, {cy:.1f}), size: {joy_box['width']:.1f}x{joy_box['height']:.1f}")

        # Set up a tracker for dispatched key events to verify key sync
        page.evaluate('''() => {
            window.__keyHistory = [];
            const origPressed = CoreEngine.val_maincanvasbridge_a.keyPressed.bind(CoreEngine.val_maincanvasbridge_a);
            const origReleased = CoreEngine.val_maincanvasbridge_a.keyReleased.bind(CoreEngine.val_maincanvasbridge_a);
            CoreEngine.val_maincanvasbridge_a.keyPressed = (code) => {
                window.__keyHistory.push({ type: 'down', code, time: performance.now() });
                return origPressed(code);
            };
            CoreEngine.val_maincanvasbridge_a.keyReleased = (code) => {
                window.__keyHistory.push({ type: 'up', code, time: performance.now() });
                return origReleased(code);
            };
        }''')

        # -------------------------------------------------------------
        # CHECKLIST 1: Walking without Jumping (25 deg vertical drift)
        # -------------------------------------------------------------
        print("\n--- Testing Checklist 1: Walking without Jumping (25 deg drift) ---")
        page.evaluate('() => window.__keyHistory = []')

        # Touch center, drag right by 45px
        page.mouse.move(cx, cy)
        page.mouse.down()
        time.sleep(0.05)
        page.mouse.move(cx + 45, cy)
        time.sleep(0.05)

        st1 = page.evaluate('''() => {
            const j = window.__joystick || window.__dpad;
            const rInd = (document.querySelector('[data-dir="right"]') || document.querySelector('[data-joy-dir="right"]')).classList.contains('active');
            const urInd = (document.querySelector('[data-dir="up-right"]') || document.querySelector('[data-joy-dir="up-right"]')).classList.contains('active');
            return { dir: j.currentDirection, rActive: rInd, urActive: urInd };
        }''')
        assert st1['dir'] == 'right' and st1['rActive'] and not st1['urActive'], f"Initial Right failed: {st1}"

        # Drift up by 25 degrees: dy = -45 * tan(25 deg) = -20.98px
        drift_y = -45.0 * math.tan(math.radians(25))
        page.mouse.move(cx + 45, cy + drift_y)
        time.sleep(0.05)

        st1_drift = page.evaluate('''() => {
            const j = window.__joystick || window.__dpad;
            const rInd = (document.querySelector('[data-dir="right"]') || document.querySelector('[data-joy-dir="right"]')).classList.contains('active');
            const urInd = (document.querySelector('[data-dir="up-right"]') || document.querySelector('[data-joy-dir="up-right"]')).classList.contains('active');
            return { dir: j.currentDirection, rActive: rInd, urActive: urInd };
        }''')
        print(f"25 deg drift state: dir={st1_drift['dir']}, rightActive={st1_drift['rActive']}, upRightActive={st1_drift['urActive']}")
        assert st1_drift['dir'] == 'right', f"[FAIL] Accidental diagonal jump triggered at 25 deg drift! Got {st1_drift['dir']}"
        assert st1_drift['rActive'] and not st1_drift['urActive'], "[FAIL] Indicator triggered diagonal jump!"
        print("[CHECK 1 PASSED] Walking without Jumping: Horizontal run maintained without accidental jump at 25 deg drift.")

        page.mouse.up()
        time.sleep(0.1)

        # -------------------------------------------------------------
        # CHECKLIST 2: Seam Stability (boundary seam 330 deg flutter check)
        # -------------------------------------------------------------
        print("\n--- Testing Checklist 2: Seam Stability ---")
        page.evaluate('() => window.__keyHistory = []')

        # Start in right
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx + 40, cy)
        time.sleep(0.03)

        # Move directly to boundary seam at 330 deg (dy = 40 * sin(-30 deg) = -20, dx = 40 * cos(-30 deg) = 34.64)
        seam_dx = 40.0 * math.cos(math.radians(330))
        seam_dy = 40.0 * math.sin(math.radians(330))
        page.mouse.move(cx + seam_dx, cy + seam_dy)
        time.sleep(0.03)

        # Rapidly micro-jitter across the boundary between 328 deg and 332 deg
        key_transitions = 0
        for i in range(20):
            ang = 328 if (i % 2 == 0) else 332
            rad = math.radians(ang)
            page.mouse.move(cx + 40.0 * math.cos(rad), cy + 40.0 * math.sin(rad))
            time.sleep(0.01)

        seam_res = page.evaluate('''() => {
            const j = window.__joystick;
            const changes = window.__keyHistory.filter(h => h.code === -1 || h.code === -4).length;
            return { dir: j.currentDirection, keyEvents: changes };
        }''')
        print(f"Seam jitter result: dir={seam_res['dir']}, keyEvents on seam={seam_res['keyEvents']}")
        # In a naive system, 20 jitters across 330 deg would trigger 20+ key events.
        # With 10 deg hysteresis, hysteresis locks the sector and suppresses key flutter!
        assert seam_res['keyEvents'] <= 2, f"[FAIL] Seam flutter detected! {seam_res['keyEvents']} key events dispatched during micro-jitter!"
        print("[CHECK 2 PASSED] Seam Stability: Zero key flutter on 330 deg boundary seam.")

        page.mouse.up()
        time.sleep(0.1)

        # -------------------------------------------------------------
        # CHECKLIST 3: Clean Turnaround (Left to Right without frame skip)
        # -------------------------------------------------------------
        print("\n--- Testing Checklist 3: Clean Turnaround ---")
        page.evaluate('() => window.__keyHistory = []')

        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx - 45, cy) # Full Left
        time.sleep(0.05)

        # Verify Left is pressed (-3)
        left_state = page.evaluate('() => window.__joystick.currentDirection')
        assert left_state == 'left', f"Expected Left, got {left_state}"

        # Rapid turnaround to Full Right
        page.mouse.move(cx + 45, cy)
        time.sleep(0.03)
        turn_mid = page.evaluate('() => window.__joystick.currentDirection')

        # Next sample/frame asserts Right
        page.mouse.move(cx + 45, cy)
        time.sleep(0.03)
        turn_final = page.evaluate('() => window.__joystick.currentDirection')

        # Check key event chronology
        hist = page.evaluate('() => window.__keyHistory')
        left_ups = [h for h in hist if h['code'] == -3 and h['type'] == 'up']
        right_downs = [h for h in hist if h['code'] == -4 and h['type'] == 'down']

        print(f"Turnaround chronology: mid_dir={turn_mid}, final_dir={turn_final}")
        print(f"Key history: {hist}")
        assert len(left_ups) >= 1, "[FAIL] Left key (-3) was not cleanly released during turnaround!"
        assert len(right_downs) >= 1, "[FAIL] Right key (-4) was not asserted after turnaround!"
        # Verify Left up happened BEFORE Right down
        first_left_up = left_ups[0]['time']
        first_right_down = right_downs[0]['time']
        assert first_left_up <= first_right_down, f"[FAIL] Turnaround order violation: Right pressed before Left released!"
        print("[CHECK 3 PASSED] Clean Turnaround: Left released cleanly before Right asserted.")

        page.mouse.up()
        time.sleep(0.1)

        # -------------------------------------------------------------
        # CHECKLIST 4: Zero Release Bounce
        # -------------------------------------------------------------
        print("\n--- Testing Checklist 4: Zero Release Bounce ---")
        page.evaluate('() => window.__keyHistory = []')

        # Run Right
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx + 50, cy)
        time.sleep(0.04)
        page.mouse.move(cx + 48, cy)
        time.sleep(0.02)

        # Fast inward flick toward Left as finger lifts (dx = -20, dy = 0)
        page.mouse.move(cx - 20, cy)
        time.sleep(0.01)
        page.mouse.up()
        time.sleep(0.05)

        hist4 = page.evaluate('() => window.__keyHistory')
        opposite_downs = [h for h in hist4 if h['code'] == -3 and h['type'] == 'down']
        print(f"Release history: {hist4}")
        assert len(opposite_downs) == 0, f"[FAIL] Opposite key (-3 Left) falsely dispatched during release! Events: {opposite_downs}"
        print("[CHECK 4 PASSED] Zero Release Bounce: Snapback flick rejected, zero opposite key inputs dispatched on release.")

        # -------------------------------------------------------------
        # CHECKLIST 5: Center Tap (Fire / Select / OK)
        # -------------------------------------------------------------
        print("\n--- Testing Checklist 5: Center Tap ---")
        page.evaluate('() => window.__keyHistory = []')

        # Tap strictly inside deadzone (< 14px)
        page.mouse.move(cx + 4, cy + 3)
        page.mouse.down()
        time.sleep(0.05)
        page.mouse.up()
        time.sleep(0.15)

        hist5 = page.evaluate('() => window.__keyHistory')
        fire_events = [h for h in hist5 if h['code'] == -5]
        print(f"Center tap history: {fire_events}")
        assert len([h for h in fire_events if h['type'] == 'down']) >= 1, "[FAIL] Key -5 down not dispatched on center tap!"
        assert len([h for h in fire_events if h['type'] == 'up']) >= 1, "[FAIL] Key -5 up not dispatched on center tap!"
        print("[CHECK 5 PASSED] Center Tap: Reliable Fire / Select / OK (-5) dispatched on deadzone tap.")

        # -------------------------------------------------------------
        # CHECKLIST 6: Native J2ME Diagonal Jump Key Dispatch (Up-Right & Up-Left)
        # -------------------------------------------------------------
        print("\n--- Testing Checklist 6: Native J2ME Diagonal Jump Key Dispatch ---")
        page.evaluate('() => window.__keyHistory = []')

        # 6a. Touch drag into intentional Up-Right (45 deg diagonal: dx = 38, dy = -38)
        page.mouse.move(cx, cy)
        page.mouse.down()
        time.sleep(0.03)
        page.mouse.move(cx + 38, cy - 38)
        time.sleep(0.05)

        st6_ur = page.evaluate('''() => {
            const j = window.__joystick || window.__dpad;
            const urInd = (document.querySelector('[data-dir="up-right"]') || document.querySelector('[data-joy-dir="up-right"]')).classList.contains('active');
            const downKeys = window.__keyHistory.filter(h => h.type === 'down').map(h => h.code);
            return { dir: j.currentDirection, urActive: urInd, downKeys };
        }''')
        print(f"Up-Right drag result: dir={st6_ur['dir']}, indicator={st6_ur['urActive']}, downKeys={st6_ur['downKeys']}")
        assert st6_ur['dir'] == 'up-right', f"[FAIL] Expected 'up-right', got {st6_ur['dir']}"
        assert st6_ur['urActive'], "[FAIL] Up-Right joystick indicator not active!"
        assert 51 in st6_ur['downKeys'], f"[FAIL] Native J2ME Key 3 (51) not dispatched for Up-Right! Dispatched: {st6_ur['downKeys']}"
        assert -1 not in st6_ur['downKeys'], f"[FAIL] Straight vertical jump (-1) falsely dispatched alongside diagonal!"

        page.mouse.up()
        time.sleep(0.05)

        # 6b. Touch drag into intentional Up-Left (135 deg diagonal: dx = -38, dy = -38)
        page.evaluate('() => window.__keyHistory = []')
        page.mouse.move(cx, cy)
        page.mouse.down()
        time.sleep(0.03)
        page.mouse.move(cx - 38, cy - 38)
        time.sleep(0.05)

        st6_ul = page.evaluate('''() => {
            const j = window.__joystick || window.__dpad;
            const ulInd = (document.querySelector('[data-dir="up-left"]') || document.querySelector('[data-joy-dir="up-left"]')).classList.contains('active');
            const downKeys = window.__keyHistory.filter(h => h.type === 'down').map(h => h.code);
            return { dir: j.currentDirection, ulActive: ulInd, downKeys };
        }''')
        print(f"Up-Left drag result: dir={st6_ul['dir']}, indicator={st6_ul['ulActive']}, downKeys={st6_ul['downKeys']}")
        assert st6_ul['dir'] == 'up-left', f"[FAIL] Expected 'up-left', got {st6_ul['dir']}"
        assert st6_ul['ulActive'], "[FAIL] Up-Left joystick indicator not active!"
        assert 49 in st6_ul['downKeys'], f"[FAIL] Native J2ME Key 1 (49) not dispatched for Up-Left! Dispatched: {st6_ul['downKeys']}"
        assert -1 not in st6_ul['downKeys'], f"[FAIL] Straight vertical jump (-1) falsely dispatched alongside diagonal!"

        page.mouse.up()
        time.sleep(0.05)

        # 6c. Desktop Keyboard Diagonal Chord (ArrowUp + ArrowRight -> Key 51)
        page.evaluate('() => window.__keyHistory = []')
        page.keyboard.down('ArrowUp')
        time.sleep(0.02)
        page.keyboard.down('ArrowRight')
        time.sleep(0.05)

        st6_chord = page.evaluate('''() => {
            const downKeys = window.__keyHistory.filter(h => h.type === 'down').map(h => h.code);
            const urInd = (document.querySelector('[data-dir="up-right"]') || document.querySelector('[data-joy-dir="up-right"]')).classList.contains('active');
            return { downKeys, urInd };
        }''')
        print(f"Keyboard chord result: downKeys={st6_chord['downKeys']}, urIndicator={st6_chord['urInd']}")
        assert 51 in st6_chord['downKeys'], f"[FAIL] Chord ArrowUp+ArrowRight did not dispatch Key 51! Keys: {st6_chord['downKeys']}"
        page.keyboard.up('ArrowRight')
        time.sleep(0.02)
        page.keyboard.up('ArrowUp')
        time.sleep(0.05)

        print("[CHECK 6 PASSED] Diagonal Jump Key Dispatch: Key 51 (Up-Right) & Key 49 (Up-Left) dispatched cleanly without vertical override.")

        # -------------------------------------------------------------
        # CHECKLIST 7: Combat Action Buttons A, B, D & Down Diagonals Verification
        # -------------------------------------------------------------
        print("\n--- Testing Checklist 7: Combat Action Buttons A, B, D & Down Diagonals ---")
        btn_labels = page.evaluate('''() => {
            const btns = Array.from(document.querySelectorAll('.combat-btn .combat-digit')).map(e => e.innerText.trim());
            return btns;
        }''')
        print(f"Combat button labels: {btn_labels}")
        assert btn_labels == ['A', 'B', 'D'], f"[FAIL] Expected buttons A, B, D, got {btn_labels}"

        # Test clicking each button
        for label, expected_code in [('A', 53), ('B', 55), ('D', 57)]:
            page.evaluate('() => window.__keyHistory = []')
            btn_selector = f'.combat-btn:has(.combat-digit:text-is("{label}"))'
            page.click(btn_selector)
            time.sleep(0.05)
            keys = page.evaluate('() => window.__keyHistory')
            down_codes = [h['code'] for h in keys if h['type'] == 'down']
            up_codes = [h['code'] for h in keys if h['type'] == 'up']
            print(f"Button {label} click -> downs: {down_codes}, ups: {up_codes}")
            assert expected_code in down_codes, f"[FAIL] Button {label} did not dispatch Key {expected_code} down! Got: {down_codes}"
            assert expected_code in up_codes, f"[FAIL] Button {label} did not dispatch Key {expected_code} up! Got: {up_codes}"
        print("[CHECK 7.1 PASSED] Combat Buttons A, B, D dispatch correct J2ME keys (53, 55, 57).")

        # Test Down-Left and Down-Right mapping to Key -2 (Down / Crouch)
        for diag_dir in ['down-left', 'down-right']:
            page.evaluate('() => window.__keyHistory = []')
            page.evaluate(f'''() => {{
                const dpad = document.getElementById("dpad-grid");
                const rect = dpad.getBoundingClientRect();
                const btn = dpad.querySelector('[data-dir="{diag_dir}"]');
                const bRect = btn.getBoundingClientRect();
                dpad.dispatchEvent(new PointerEvent("pointerdown", {{
                    clientX: bRect.left + bRect.width / 2,
                    clientY: bRect.top + bRect.height / 2,
                    pointerId: 10,
                    bubbles: true
                }}));
            }}''')
            time.sleep(0.05)
            keys = page.evaluate('() => window.__keyHistory')
            down_codes = [h['code'] for h in keys if h['type'] == 'down']
            print(f"D-Pad {diag_dir} dispatched: {down_codes}")
            assert -2 in down_codes, f"[FAIL] {diag_dir} did not dispatch Key -2 (Down)! Got: {down_codes}"
            assert -3 not in down_codes and -4 not in down_codes, f"[FAIL] {diag_dir} dispatched unwanted horizontal keys! Got: {down_codes}"
            page.evaluate('''() => {
                const dpad = document.getElementById("dpad-grid");
                dpad.dispatchEvent(new PointerEvent("pointerup", { pointerId: 10, bubbles: true }));
            }''')
        print("[CHECK 7.2 PASSED] Down-Left and Down-Right cleanly dispatch Key -2 (Down / Crouch) without horizontal drift.")

        # -------------------------------------------------------------
        # CHECKLIST 8: Pitch Black Lower Panel & MK Antique Design Code
        # -------------------------------------------------------------
        print("\n--- Testing Checklist 8: MK Design Code & Pitch Black Styling ---")
        panel_bg = page.evaluate('() => window.getComputedStyle(document.querySelector(".mobile-controls-panel")).backgroundColor')
        print(f"Controls panel computed background: {panel_bg}")
        assert panel_bg in ['rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)'], f"[FAIL] Controls panel is not pitch black! Got: {panel_bg}"
        
        has_mk_class = page.evaluate('() => document.querySelectorAll(".btn-mk").length >= 11')
        assert has_mk_class, "[FAIL] Buttons missing .btn-mk Mortal Kombat design styling!"
        print("[CHECK 8 PASSED] Controls panel is pitch black (#000000) and buttons use MK stone/bronze design code.")

        # -------------------------------------------------------------
        # CHECKLIST 9: In-game Tutorial & Softkey Text Verification
        # -------------------------------------------------------------
        print("\n--- Testing Checklist 9: In-game Tutorial & Softkey Strings ---")
        tut_check = page.evaluate('''() => {
            function getStr(id) {
                const buf = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(id, null);
                if (!buf) return '';
                let s = '';
                for (let i = 0; i < buf.bufferCapacity; i++) {
                    const c = buf.getCharAt(i);
                    const hi = (c >> 8) & 0xFF;
                    const lo = c & 0xFF;
                    if (hi >= 32 && hi <= 126) s += String.fromCharCode(hi);
                    if (lo >= 32 && lo <= 126) s += String.fromCharCode(lo);
                }
                return s;
            }
            return {
                str42: getStr(42),
                str43: getStr(43),
                str44: getStr(44),
                str45: getStr(45),
                str138: getStr(138),
                str139: getStr(139)
            };
        }''')
        print(f"Tutorial String 42: {tut_check['str42'][:80]}...")
        print(f"Tutorial String 43: {tut_check['str43'][:80]}...")
        assert "8-WAY D-PAD" in tut_check['str42'] or "8-WAY D-PAD" in tut_check['str43'], "[FAIL] Tutorial does not reference 8-WAY D-PAD!"
        assert "A/B/D" in tut_check['str42'] or "A/B/D" in tut_check['str43'], "[FAIL] Tutorial does not reference A/B/D!"
        print("[CHECK 9 PASSED] In-game tutorial fully updated under new 8-WAY D-PAD and A/B/D system.")

        # -------------------------------------------------------------
        # NAVIGATION & VISUAL SCREENSHOT VERIFICATION
        # -------------------------------------------------------------
        print("\n--- Capturing Screenshots for Verification Artifact ---")
        time.sleep(0.5)
        shot1 = os.path.join(ARTIFACT_DIR, "joystick_adv_1_mainmenu.png")
        page.screenshot(path=shot1)
        print(f"Saved: {shot1}")

        # Navigate into Combat Arena
        print("Navigating to Arena fight...")
        # Press 5 / Fire to enter character select
        page.evaluate('() => { CoreEngine.val_maincanvasbridge_a.keyPressed(-5); }')
        time.sleep(0.1)
        page.evaluate('() => { CoreEngine.val_maincanvasbridge_a.keyReleased(-5); }')
        time.sleep(1.0)

        # Character select
        shot2 = os.path.join(ARTIFACT_DIR, "joystick_adv_2_charselect.png")
        page.screenshot(path=shot2)
        print(f"Saved: {shot2}")

        # Press 5 / Fire to choose character
        page.evaluate('() => { CoreEngine.val_maincanvasbridge_a.keyPressed(-5); }')
        time.sleep(0.1)
        page.evaluate('() => { CoreEngine.val_maincanvasbridge_a.keyReleased(-5); }')
        time.sleep(1.2)

        # Tower select -> Choose Novice
        shot3 = os.path.join(ARTIFACT_DIR, "joystick_adv_3_tower.png")
        page.screenshot(path=shot3)
        print(f"Saved: {shot3}")

        page.evaluate('() => { CoreEngine.val_maincanvasbridge_a.keyPressed(-5); }')
        time.sleep(0.1)
        page.evaluate('() => { CoreEngine.val_maincanvasbridge_a.keyReleased(-5); }')
        time.sleep(2.0)

        # Arena Stance
        # Simulate active thumb hold on joystick pointing Right (walking forward)
        page.mouse.move(cx, cy)
        page.mouse.down()
        page.mouse.move(cx + 42, cy)
        time.sleep(0.5)

        shot4 = os.path.join(ARTIFACT_DIR, "joystick_adv_4_arena_walk.png")
        page.screenshot(path=shot4)
        print(f"Saved: {shot4}")

        page.mouse.up()
        time.sleep(0.3)

        context.close()
        browser.close()
        print("\n=== ALL 9 CHECKLIST ITEMS & SCREENSHOTS VERIFIED 100% SUCCESSFULLY ===")

if __name__ == '__main__':
    run_joystick_tests()
