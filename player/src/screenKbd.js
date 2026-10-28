const touchKeyMap = new Map();
let handleKey = null;

function getKeyAtPoint(x, y) {
    const el = document.elementFromPoint(x, y);
    return el ? el.closest('.ctrl-btn, .key') : null;
}

function triggerHaptic() {
    try {
        if (navigator.vibrate) {
            navigator.vibrate(12);
        }
    } catch (e) {}
}

function activateKey(keyEl) {
    if (keyEl && !keyEl.classList.contains('active')) {
        keyEl.classList.add('active');
        triggerHaptic();
        if (handleKey && keyEl.dataset.key) {
            const keys = keyEl.dataset.key.split(',');
            for (const k of keys) {
                handleKey(true, k.trim());
            }
        }
    }
}

function deactivateKey(keyEl) {
    if (keyEl && keyEl.classList.contains('active')) {
        keyEl.classList.remove('active');
        if (handleKey && keyEl.dataset.key) {
            const keys = keyEl.dataset.key.split(',');
            for (const k of keys) {
                handleKey(false, k.trim());
            }
        }
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const keyEl = getKeyAtPoint(touch.clientX, touch.clientY);
        if (keyEl) {
            touchKeyMap.set(touch.identifier, keyEl);
            activateKey(keyEl);
        }
    }
}

function handleTouchMove(e) {
    e.preventDefault();
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const currentKeyEl = getKeyAtPoint(touch.clientX, touch.clientY);
        const previousKeyEl = touchKeyMap.get(touch.identifier);

        if (currentKeyEl !== previousKeyEl) {
            if (previousKeyEl) deactivateKey(previousKeyEl);
            if (currentKeyEl) {
                activateKey(currentKeyEl);
                touchKeyMap.set(touch.identifier, currentKeyEl);
            } else {
                touchKeyMap.delete(touch.identifier);
            }
        }
    }
}

function handleTouchEnd(e) {
    e.preventDefault();
    const touches = e.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const keyEl = touchKeyMap.get(touch.identifier);
        if (keyEl) {
            deactivateKey(keyEl);
            touchKeyMap.delete(touch.identifier);
        }
    }
}

// Mouse fallback for testing on desktop
function handleMouseDown(e) {
    const keyEl = e.target.closest('.ctrl-btn, .key');
    if (keyEl) {
        activateKey(keyEl);
        const upHandler = () => {
            deactivateKey(keyEl);
            window.removeEventListener('mouseup', upHandler);
        };
        window.addEventListener('mouseup', upHandler);
    }
}

export function initKbdListeners() {
    const containers = document.querySelectorAll('.mobile-controls-panel, .keypad-area, .keypad-part');
    containers.forEach(container => {
        container.addEventListener('touchstart', handleTouchStart, { passive: false });
        container.addEventListener('touchmove', handleTouchMove, { passive: false });
        container.addEventListener('touchend', handleTouchEnd, { passive: false });
        container.addEventListener('touchcancel', handleTouchEnd, { passive: false });
        container.addEventListener('mousedown', handleMouseDown);
    });
}

export function setKbdHandler(handler) {
    handleKey = handler;
}
