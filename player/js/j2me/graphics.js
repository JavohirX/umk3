/**
 * J2ME LCDUI Graphics and Image Implementation using HTML5 2D Canvas
 */

import UPNG from "../lib/upng.js";
import { ResourceManager } from "./runtime.js";

export class Graphics {
    // LCDUI Anchor Constants
    static HCENTER = 1;
    static VCENTER = 2;
    static LEFT = 4;
    static RIGHT = 8;
    static TOP = 16;
    static BOTTOM = 32;
    static BASELINE = 64;

    // LCDUI Sprite Transform Constants (Authentic MIDP 2.0 J2ME Specification)
    static TRANS_NONE = 0;
    static TRANS_MIRROR_ROT180 = 1;
    static TRANS_MIRROR = 2;
    static TRANS_ROT180 = 3;
    static TRANS_MIRROR_ROT270 = 4;
    static TRANS_ROT90 = 5;
    static TRANS_ROT270 = 6;
    static TRANS_MIRROR_ROT90 = 7;

    constructor(ctx, image = null) {
        this.ctx = ctx;
        this.image = image;
        this.currentColor = 0;
        this.clipX = 0;
        this.clipY = 0;
        this.clipWidth = ctx?.canvas?.width || 352;
        this.clipHeight = ctx?.canvas?.height || 416;

        if (this.ctx) {
            this.ctx.imageSmoothingEnabled = false;
            try { this.ctx.save(); } catch (e) {}
        }
    }

    resetClip() {
        if (this.ctx) {
            try {
                this.ctx.restore();
                this.ctx.save();
            } catch (e) {}
        }
        this.clipX = 0;
        this.clipY = 0;
        this.clipWidth = this.ctx?.canvas?.width || 352;
        this.clipHeight = this.ctx?.canvas?.height || 416;
    }

    setColor(...args) {
        if (args.length >= 3) {
            const r = args[0] & 0xFF;
            const g = args[1] & 0xFF;
            const b = args[2] & 0xFF;
            this.currentColor = (r << 16) | (g << 8) | b;
            const colorStr = `rgb(${r},${g},${b})`;
            if (this.ctx) {
                this.ctx.fillStyle = colorStr;
                this.ctx.strokeStyle = colorStr;
            }
        } else {
            const rgb = (args[0] || 0) & 0xFFFFFF;
            this.currentColor = rgb;
            const r = (rgb >> 16) & 0xFF;
            const g = (rgb >> 8) & 0xFF;
            const b = rgb & 0xFF;
            const colorStr = `rgb(${r},${g},${b})`;
            if (this.ctx) {
                this.ctx.fillStyle = colorStr;
                this.ctx.strokeStyle = colorStr;
            }
        }
    }

    getColor() {
        return this.currentColor;
    }

    setClip(x, y, w, h) {
        this.clipX = x;
        this.clipY = y;
        this.clipWidth = w;
        this.clipHeight = h;
        if (this.ctx) {
            try {
                this.ctx.restore();
                this.ctx.save();
                this.ctx.beginPath();
                this.ctx.rect(x, y, w, h);
                this.ctx.clip();
            } catch (e) {}
        }
    }

    getClipX() { return this.clipX; }
    getClipY() { return this.clipY; }
    getClipWidth() { return this.clipWidth; }
    getClipHeight() { return this.clipHeight; }

    fillRect(x, y, w, h) {
        if (w <= 0 || h <= 0) return;
        this.ctx.fillRect(x, y, w, h);
    }

    drawRect(x, y, w, h) {
        if (w < 0 || h < 0) return;
        this.ctx.strokeRect(x + 0.5, y + 0.5, w, h);
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1 + 0.5, y1 + 0.5);
        this.ctx.lineTo(x2 + 0.5, y2 + 0.5);
        this.ctx.stroke();
    }

    fillTriangle(x1, y1, x2, y2, x3, y3) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x3, y3);
        this.ctx.closePath();
        this.ctx.fill();
    }

    adjustX(x, width, anchor) {
        if ((anchor & Graphics.HCENTER) !== 0) {
            return x - (width >> 1);
        } else if ((anchor & Graphics.RIGHT) !== 0) {
            return x - width;
        }
        return x;
    }

    adjustY(y, height, anchor) {
        if ((anchor & Graphics.VCENTER) !== 0) {
            return y - (height >> 1);
        } else if ((anchor & Graphics.BOTTOM) !== 0) {
            return y - height;
        }
        return y;
    }

    drawImage(image, x, y, anchor = 0) {
        if (!image) return;
        const canvas = image.getCanvas();
        if (!canvas) return;
        const ax = this.adjustX(x, image.getWidth(), anchor);
        const ay = this.adjustY(y, image.getHeight(), anchor);
        this.ctx.drawImage(canvas, ax, ay);
    }

    drawRegion(srcImage, srcX, srcY, w, h, transform, dstX, dstY, anchor = 0) {
        if (!srcImage || w <= 0 || h <= 0) return;
        const canvas = srcImage.getCanvas ? srcImage.getCanvas() : srcImage;
        if (!canvas) return;

        // Clamp source coordinates to source canvas boundaries
        if (srcX < 0) { w += srcX; srcX = 0; }
        if (srcY < 0) { h += srcY; srcY = 0; }
        if (canvas.width && srcX + w > canvas.width) { w = canvas.width - srcX; }
        if (canvas.height && srcY + h > canvas.height) { h = canvas.height - srcY; }
        if (w <= 0 || h <= 0) return;

        const isRotated = (transform === Graphics.TRANS_ROT90 ||
                           transform === Graphics.TRANS_ROT270 ||
                           transform === Graphics.TRANS_MIRROR_ROT90 ||
                           transform === Graphics.TRANS_MIRROR_ROT270);

        const destW = isRotated ? h : w;
        const destH = isRotated ? w : h;

        const ax = this.adjustX(dstX, destW, anchor);
        const ay = this.adjustY(dstY, destH, anchor);

        const ctx = this.ctx;
        ctx.save();
        ctx.translate(ax, ay);

        switch (transform) {
            case Graphics.TRANS_NONE:
                break;
            case Graphics.TRANS_MIRROR:
                ctx.translate(w, 0);
                ctx.scale(-1, 1);
                break;
            case Graphics.TRANS_MIRROR_ROT180:
                ctx.translate(0, h);
                ctx.scale(1, -1);
                break;
            case Graphics.TRANS_ROT180:
                ctx.translate(w, h);
                ctx.rotate(Math.PI);
                break;
            case Graphics.TRANS_ROT90:
                ctx.translate(destW, 0);
                ctx.rotate(Math.PI / 2);
                break;
            case Graphics.TRANS_ROT270:
                ctx.translate(0, destH);
                ctx.rotate(Math.PI * 1.5);
                break;
            case Graphics.TRANS_MIRROR_ROT90:
                ctx.translate(destW, 0);
                ctx.rotate(Math.PI / 2);
                ctx.translate(w, 0);
                ctx.scale(-1, 1);
                break;
            case Graphics.TRANS_MIRROR_ROT270:
                ctx.translate(0, destH);
                ctx.rotate(Math.PI * 1.5);
                ctx.translate(w, 0);
                ctx.scale(-1, 1);
                break;
        }

        ctx.drawImage(canvas, srcX, srcY, w, h, 0, 0, w, h);
        ctx.restore();
    }

    drawRGB(rgbData, offset, scanlength, x, y, width, height, processAlpha) {
        if (width <= 0 || height <= 0) return;
        const imgData = this.ctx.createImageData(width, height);
        const d = imgData.data;
        let dstIdx = 0;
        for (let row = 0; row < height; row++) {
            let srcIdx = offset + row * scanlength;
            for (let col = 0; col < width; col++) {
                const pixel = rgbData[srcIdx++];
                d[dstIdx++] = (pixel >> 16) & 0xFF;
                d[dstIdx++] = (pixel >> 8) & 0xFF;
                d[dstIdx++] = pixel & 0xFF;
                d[dstIdx++] = processAlpha ? ((pixel >> 24) & 0xFF) : 0xFF;
            }
        }
        this.ctx.putImageData(imgData, x, y);
    }
}

export class Image {
    constructor(canvas, isMutable = false) {
        this.canvas = canvas;
        this.isMutable = isMutable;
        this.ctx = (canvas && typeof canvas.getContext === 'function') ? canvas.getContext('2d') : null;
        if (this.ctx) {
            this.ctx.imageSmoothingEnabled = false;
        }
    }

    static createCanvasElement(w, h) {
        if (typeof document !== 'undefined' && document.createElement) {
            const c = document.createElement('canvas');
            c.width = Math.max(1, w);
            c.height = Math.max(1, h);
            return c;
        } else if (typeof OffscreenCanvas !== 'undefined') {
            return new OffscreenCanvas(Math.max(1, w), Math.max(1, h));
        }
        return { width: Math.max(1, w), height: Math.max(1, h) };
    }

    static createImage(...args) {
        if (args.length === 2 && typeof args[0] === 'number') {
            const [w, h] = args;
            const c = Image.createCanvasElement(w, h);
            return new Image(c, true);
        }

        if (args.length === 1 && typeof args[0] === 'string') {
            const path = args[0];
            const bytes = ResourceManager.getBytes(path);
            if (!bytes) {
                console.warn(`[Image] Asset not found: ${path}`);
                return new Image(Image.createCanvasElement(1, 1), false);
            }
            return Image.createFromBytes(bytes, 0, bytes.length);
        }

        if (args.length === 3) {
            const [bytes, offset, length] = args;
            return Image.createFromBytes(bytes, offset, length);
        }

        return new Image(Image.createCanvasElement(1, 1), false);
    }

    static createFromBytes(bytes, offset = 0, length = undefined) {
        if (!bytes || length === 0) {
            return new Image(Image.createCanvasElement(1, 1), false);
        }

        const totalLen = (length !== undefined) ? length : (bytes.length - offset);
        if (totalLen <= 0) {
            return new Image(Image.createCanvasElement(1, 1), false);
        }

        let u8;
        if (bytes instanceof Uint8Array) {
            const start = (bytes.byteOffset || 0) + offset;
            u8 = new Uint8Array(bytes.buffer, start, totalLen);
        } else {
            // Standard JS Array of bytes (from createArray / J2ME)
            u8 = new Uint8Array(totalLen);
            for (let i = 0; i < totalLen; i++) {
                u8[i] = bytes[offset + i] & 0xFF;
            }
        }

        try {
            const arrayBuf = u8.buffer.slice(u8.byteOffset, u8.byteOffset + u8.byteLength);
            const decoded = UPNG.decode(arrayBuf);
            const w = decoded.width;
            const h = decoded.height;
            const rgba = UPNG.toRGBA8(decoded)[0];

            const c = Image.createCanvasElement(w, h);
            if (c && c.getContext && typeof ImageData !== 'undefined') {
                const ctx = c.getContext('2d');
                const imgData = new ImageData(new Uint8ClampedArray(rgba), w, h);
                ctx.putImageData(imgData, 0, 0);
            }

            return new Image(c, false);
        } catch (e) {
            console.error('[Image] UPNG decode failed:', e);
            return new Image(Image.createCanvasElement(1, 1), false);
        }
    }

    getWidth() {
        return this.canvas ? this.canvas.width : 0;
    }

    getHeight() {
        return this.canvas ? this.canvas.height : 0;
    }

    getCanvas() {
        return this.canvas;
    }

    getGraphics() {
        if (!this.isMutable) {
            throw new Error("Image is immutable");
        }
        return new Graphics(this.ctx, this);
    }
}

// --- Canvas & Display Subsystem ---

export class Displayable {
    showNotify() {}
    hideNotify() {}
}

export class Canvas extends Displayable {
    static UP = 1;
    static LEFT = 2;
    static RIGHT = 5;
    static DOWN = 6;
    static FIRE = 8;
    static GAME_A = 9;
    static GAME_B = 10;
    static GAME_C = 11;
    static GAME_D = 12;

    getGameAction(keyCode) {
        switch (keyCode) {
            case -1: case 38: return Canvas.UP;
            case -2: case 40: return Canvas.DOWN;
            case -3: case 37: return Canvas.LEFT;
            case -4: case 39: return Canvas.RIGHT;
            case -5: case 13: case 32: return Canvas.FIRE;
            case -6: return Canvas.GAME_A;
            case -7: return Canvas.GAME_B;
            default: return 0;
        }
    }

    paint(g) {}
    
    repaint() {
        this.serviceRepaints();
    }
    
    serviceRepaints() {
        const display = Display.getDisplay();
        const g = display?.getGraphics();
        if (g) {
            g.resetClip();
            this.paint(g);
        }
    }

    keyPressed(keyCode) {}
    keyReleased(keyCode) {}
    keyRepeated(keyCode) {}
    isShown() { return true; }
}

export class FullCanvas extends Canvas {}

export class Display {
    static currentDisplay = null;
    static currentGraphics = null;

    static getDisplay(midlet) {
        if (!Display.currentDisplay) {
            Display.currentDisplay = new Display();
        }
        return Display.currentDisplay;
    }

    setCurrent(d) {
        if (this.current && this.current !== d && typeof this.current.hideNotify === 'function') {
            this.current.hideNotify();
        }
        this.current = d;
        if (this.current && typeof this.current.showNotify === 'function') {
            this.current.showNotify();
        }
    }

    getCurrent() {
        return this.current;
    }

    setGraphics(g) {
        Display.currentGraphics = g;
        this.graphics = g;
    }

    getGraphics() {
        return Display.currentGraphics || this.graphics;
    }

    vibrate(duration) {
        try {
            if (typeof window !== 'undefined' && window.Telegram?.WebApp?.HapticFeedback) {
                if (duration > 150) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
                } else if (duration > 50) {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
                } else {
                    window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
                }
                return true;
            }
            if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
                return navigator.vibrate(duration);
            }
        } catch (e) {}
        return true;
    }

    flashBacklight(duration) {
        return true;
    }

    static repaint() {
        if (Display.currentDisplay && Display.currentDisplay.current) {
            Display.currentDisplay.current.repaint();
        }
    }

    static serviceRepaints() {
        if (Display.currentDisplay && Display.currentDisplay.current) {
            Display.currentDisplay.current.serviceRepaints();
        }
    }
}

export class MIDlet {
    constructor() {
        MIDlet.instance = this;
        if (typeof CoreEngine !== 'undefined') {
            CoreEngine.midletInstance = this;
        }
    }

    getResourceAsStream(name) {
        return ResourceManager.getResourceAsStream(name);
    }

    getAppProperty(key) {
        const props = {
            "MIDlet-Name": "Ultimate Mortal Kombat 3",
            "MIDlet-Version": "1.0.0",
            "Blood": "red",
            "Fatality": "on",
            "Cheats": "off"
        };
        return props[key] || null;
    }

    startApp() {}
    pauseApp() {}
    destroyApp(unconditional) {}
    notifyDestroyed() {}
}
