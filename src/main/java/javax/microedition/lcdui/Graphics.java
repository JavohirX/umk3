package javax.microedition.lcdui;

import java.awt.Color;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.geom.AffineTransform;
import java.awt.image.BufferedImage;

/**
 * Desktop compatibility implementation of LCDUI Graphics.
 */
public class Graphics {
    public static final int HCENTER = 1;
    public static final int VCENTER = 2;
    public static final int LEFT = 4;
    public static final int RIGHT = 8;
    public static final int TOP = 16;
    public static final int BOTTOM = 32;
    public static final int BASELINE = 64;

    public static final int TRANS_NONE = 0;
    public static final int TRANS_ROT90 = 1;
    public static final int TRANS_ROT180 = 2;
    public static final int TRANS_ROT270 = 3;
    public static final int TRANS_MIRROR = 4;
    public static final int TRANS_MIRROR_ROT90 = 5;
    public static final int TRANS_MIRROR_ROT180 = 6;
    public static final int TRANS_MIRROR_ROT270 = 7;

    private final Graphics2D g2d;
    private int currentColor = 0;
    private int transX = 0;
    private int transY = 0;

    public Graphics(Graphics2D g2d) {
        this.g2d = g2d;
        this.g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_OFF);
        this.g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR);
    }

    public Graphics(BufferedImage bi) {
        this(bi.createGraphics());
    }

    public Graphics2D getGraphics2D() {
        return g2d;
    }

    public void setColor(int RGB) {
        this.currentColor = RGB & 0xFFFFFF;
        int alpha = (RGB >>> 24) == 0 ? 0xFF : (RGB >>> 24);
        g2d.setColor(new Color((currentColor >> 16) & 0xFF, (currentColor >> 8) & 0xFF, currentColor & 0xFF, alpha));
    }

    public void setColor(int red, int green, int blue) {
        this.currentColor = ((red & 0xFF) << 16) | ((green & 0xFF) << 8) | (blue & 0xFF);
        g2d.setColor(new Color(red, green, blue));
    }

    public int getColor() {
        return currentColor;
    }

    public void setGrayScale(int value) {
        setColor(value, value, value);
    }

    private static int drawCallCount = 0;

    public void fillRect(int x, int y, int width, int height) {
        if (width <= 0 || height <= 0) return;
        if (drawCallCount++ < 20 || drawCallCount % 100 == 0) {
            System.out.println("[Graphics] fillRect x=" + x + " y=" + y + " w=" + width + " h=" + height + " color=" + Integer.toHexString(currentColor));
        }
        g2d.fillRect(x, y, width, height);
    }

    public void drawRect(int x, int y, int width, int height) {
        if (width < 0 || height < 0) return;
        g2d.drawRect(x, y, width, height);
    }

    public void drawRoundRect(int x, int y, int width, int height, int arcWidth, int arcHeight) {
        g2d.drawRoundRect(x, y, width, height, arcWidth, arcHeight);
    }

    public void fillRoundRect(int x, int y, int width, int height, int arcWidth, int arcHeight) {
        g2d.fillRoundRect(x, y, width, height, arcWidth, arcHeight);
    }

    public void drawLine(int x1, int y1, int x2, int y2) {
        g2d.drawLine(x1, y1, x2, y2);
    }

    public void fillTriangle(int x1, int y1, int x2, int y2, int x3, int y3) {
        g2d.fillPolygon(new int[] { x1, x2, x3 }, new int[] { y1, y2, y3 }, 3);
    }

    public void drawArc(int x, int y, int width, int height, int startAngle, int arcAngle) {
        g2d.drawArc(x, y, width, height, startAngle, arcAngle);
    }

    public void fillArc(int x, int y, int width, int height, int startAngle, int arcAngle) {
        g2d.fillArc(x, y, width, height, startAngle, arcAngle);
    }

    public void drawString(String str, int x, int y, int anchor) {
        if (str == null) return;
        int ax = adjustX(x, g2d.getFontMetrics().stringWidth(str), anchor);
        int ay = adjustY(y, g2d.getFontMetrics().getAscent(), anchor);
        g2d.drawString(str, ax, ay);
    }

    public void drawSubstring(String str, int offset, int len, int x, int y, int anchor) {
        if (str == null || offset < 0 || len <= 0 || offset + len > str.length()) return;
        drawString(str.substring(offset, offset + len), x, y, anchor);
    }

    public void drawChar(char character, int x, int y, int anchor) {
        drawString(String.valueOf(character), x, y, anchor);
    }

    public void drawChars(char[] data, int offset, int length, int x, int y, int anchor) {
        if (data == null || offset < 0 || length <= 0) return;
        drawString(new String(data, offset, length), x, y, anchor);
    }

    public void drawImage(Image img, int x, int y, int anchor) {
        if (img == null || img.getBufferedImage() == null) return;
        BufferedImage bi = img.getBufferedImage();
        int ax = adjustX(x, bi.getWidth(), anchor);
        int ay = adjustY(y, bi.getHeight(), anchor);
        if (drawCallCount++ < 30 || drawCallCount % 50 == 0) {
            System.out.println("[Graphics] drawImage " + bi.getWidth() + "x" + bi.getHeight() + " at (" + ax + "," + ay + ")");
        }
        g2d.drawImage(bi, ax, ay, null);
    }

    public void drawRegion(Image src, int x_src, int y_src, int width, int height,
                           int transform, int x_dest, int y_dest, int anchor) {
        if (src == null || src.getBufferedImage() == null || width <= 0 || height <= 0) return;
        BufferedImage bi = src.getBufferedImage();
        if (x_src + width > bi.getWidth()) width = bi.getWidth() - x_src;
        if (y_src + height > bi.getHeight()) height = bi.getHeight() - y_src;
        if (width <= 0 || height <= 0) return;

        BufferedImage sub = bi.getSubimage(x_src, y_src, width, height);
        if (drawCallCount++ < 30 || drawCallCount % 50 == 0) {
            System.out.println("[Graphics] drawRegion src=" + bi.getWidth() + "x" + bi.getHeight() + " at (" + x_dest + "," + y_dest + ") w=" + width + " h=" + height + " trans=" + transform);
        }

        int destW = (transform == TRANS_ROT90 || transform == TRANS_ROT270 ||
                     transform == TRANS_MIRROR_ROT90 || transform == TRANS_MIRROR_ROT270) ? height : width;
        int destH = (transform == TRANS_ROT90 || transform == TRANS_ROT270 ||
                     transform == TRANS_MIRROR_ROT90 || transform == TRANS_MIRROR_ROT270) ? width : height;

        int ax = adjustX(x_dest, destW, anchor);
        int ay = adjustY(y_dest, destH, anchor);

        AffineTransform original = g2d.getTransform();
        AffineTransform at = new AffineTransform();
        at.translate(ax, ay);

        switch (transform) {
            case TRANS_NONE:
                break;
            case TRANS_MIRROR:
                at.translate(width, 0);
                at.scale(-1, 1);
                break;
            case TRANS_MIRROR_ROT180:
                at.translate(0, height);
                at.scale(1, -1);
                break;
            case TRANS_ROT180:
                at.translate(width, height);
                at.rotate(Math.PI);
                break;
            case TRANS_ROT90:
                at.translate(height, 0);
                at.rotate(Math.PI / 2);
                break;
            case TRANS_ROT270:
                at.translate(0, width);
                at.rotate(Math.PI * 1.5);
                break;
            case TRANS_MIRROR_ROT90:
                at.translate(height, 0);
                at.rotate(Math.PI / 2);
                at.translate(width, 0);
                at.scale(-1, 1);
                break;
            case TRANS_MIRROR_ROT270:
                at.translate(0, width);
                at.rotate(Math.PI * 1.5);
                at.translate(width, 0);
                at.scale(-1, 1);
                break;
        }

        g2d.drawImage(sub, at, null);
        g2d.setTransform(original);
    }

    public void drawRGB(int[] rgbData, int offset, int scanlength, int x, int y, int width, int height, boolean processAlpha) {
        if (width <= 0 || height <= 0 || rgbData == null) return;
        BufferedImage bi = new BufferedImage(width, height, processAlpha ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB);
        bi.setRGB(0, 0, width, height, rgbData, offset, scanlength);
        g2d.drawImage(bi, x, y, null);
    }

    public void clipRect(int x, int y, int width, int height) {
        g2d.clipRect(x, y, width, height);
    }

    public void setClip(int x, int y, int width, int height) {
        g2d.setClip(x, y, width, height);
    }

    public int getClipX() {
        java.awt.Rectangle r = g2d.getClipBounds();
        return r != null ? r.x : 0;
    }

    public int getClipY() {
        java.awt.Rectangle r = g2d.getClipBounds();
        return r != null ? r.y : 0;
    }

    public int getClipWidth() {
        java.awt.Rectangle r = g2d.getClipBounds();
        return r != null ? r.width : 352;
    }

    public int getClipHeight() {
        java.awt.Rectangle r = g2d.getClipBounds();
        return r != null ? r.height : 416;
    }

    public void translate(int x, int y) {
        transX += x;
        transY += y;
        g2d.translate(x, y);
    }

    public int getTranslateX() {
        return transX;
    }

    public int getTranslateY() {
        return transY;
    }

    private int adjustX(int x, int w, int anchor) {
        if ((anchor & HCENTER) != 0) return x - w / 2;
        if ((anchor & RIGHT) != 0) return x - w;
        return x;
    }

    private int adjustY(int y, int h, int anchor) {
        if ((anchor & VCENTER) != 0) return y - h / 2;
        if ((anchor & BOTTOM) != 0) return y - h;
        return y;
    }
}
