export const codeMap = {
    'Enter': 13,
    'Backspace': 8,
    'Delete': 46,
    'ArrowLeft': 37,
    'ArrowRight': 39,
    'ArrowUp': 38,
    'ArrowDown': 40,
    'Escape': 27,
    'Digit0': 48,
    'Digit1': 49,
    'Digit2': 50,
    'Digit3': 51,
    'Digit4': 52,
    'Digit5': 53,
    'Digit6': 54,
    'Digit7': 55,
    'Digit8': 56,
    'Digit9': 57,
    'Numpad0': 96,
    'Numpad1': 97,
    'Numpad2': 98,
    'Numpad3': 99,
    'Numpad4': 100,
    'Numpad5': 101,
    'Numpad6': 102,
    'Numpad7': 103,
    'Numpad8': 104,
    'Numpad9': 105,
    'NumpadDivide': 111,
    'NumpadMultiply': 106,
    'NumpadAsterisk': 106,
    'F1': 112,
    'F2': 113,
    'F3': 114,
    'Space': 32,
    'KeyQ': 81,
    'KeyW': 87,
    'KeyE': 69,
    'KeyR': 82,
    'KeyA': 65,
    'KeyS': 83,
    'KeyD': 68,
    'KeyZ': 90,
    'KeyX': 88,
    'KeyC': 67,
};

export class KeyRepeatManager {
    static TIME_TO_FIRST_REPEAT = 400;
    static REPEAT_INTERVAL = 30;

    keyStates = new Map();
    listener = null;

    register(callback) {
        if (callback !== null && typeof callback !== 'function') {
            console.error("KeyRepeater.register: Provided callback is not a function or null.");
            return;
        }
        this.listener = callback;
    }

    post(isDown, key, args = {}) {
        if (!key) return;

        const currentState = this.keyStates.get(key);

        if (isDown) {
            if (currentState) {
                currentState.args = args || {};
            } else {
                const newState = {
                    args: args || {},
                    timeoutToFirstRepeatId: null,
                    repeatIntervalId: null,
                };
                this.keyStates.set(key, newState);

                this.emit('down', key, newState.args);

                newState.timeoutToFirstRepeatId = setTimeout(() => {
                    this.emit('repeat', key, newState.args);
                    newState.repeatIntervalId = setInterval(() => {
                        this.emit('repeat', key, newState.args);
                    }, KeyRepeatManager.REPEAT_INTERVAL);
                }, KeyRepeatManager.TIME_TO_FIRST_REPEAT);
            }
        } else if (currentState) {
            this.emit('up', key, currentState.args);

            if (currentState.repeatIntervalId === null) {
                clearTimeout(currentState.timeoutToFirstRepeatId);
                this.emit('click', key, currentState.args);
            } else {
                clearInterval(currentState.repeatIntervalId);
            }

            this.keyStates.delete(key);
        }
    }

    emit(eventType, key, args) {
        if (this.listener) {
            try {
                this.listener(eventType, key, args);
            } catch (error) {
                console.error('Error in key event listener:', error);
            }
        }
    }
}
