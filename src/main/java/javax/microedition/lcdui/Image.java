package javax.microedition.lcdui;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import javax.imageio.ImageIO;

/**
 * Desktop compatibility implementation of LCDUI Image.
 */
public class Image {
    private final BufferedImage bufferedImage;
    private final boolean mutable;

    public Image(BufferedImage bi, boolean mutable) {
        this.bufferedImage = bi;
        this.mutable = mutable;
    }

    public static Image createImage(int width, int height) {
        BufferedImage bi = new BufferedImage(Math.max(1, width), Math.max(1, height), BufferedImage.TYPE_INT_ARGB);
        return new Image(bi, true);
    }

    public static Image createImage(String name) {
        if (name == null) return null;
        if (!name.startsWith("/")) name = "/" + name;
        try (InputStream is = Image.class.getResourceAsStream(name)) {
            if (is == null) {
                // Try without leading slash
                try (InputStream is2 = Image.class.getResourceAsStream(name.substring(1))) {
                    if (is2 != null) {
                        BufferedImage bi = ImageIO.read(is2);
                        if (bi != null) return new Image(bi, false);
                    }
                }
                return null;
            }
            BufferedImage bi = ImageIO.read(is);
            if (bi != null) return new Image(bi, false);
        } catch (Exception ignored) {
        }
        return null;
    }

    public static Image createImage(byte[] imageData, int imageOffset, int imageLength) {
        if (imageData == null || imageLength <= 0) return null;
        String magic = (imageData != null && imageData.length >= imageOffset + 4) ?
            String.format("%02X %02X %02X %02X", imageData[imageOffset], imageData[imageOffset+1], imageData[imageOffset+2], imageData[imageOffset+3]) : "short";
        try (ByteArrayInputStream bais = new ByteArrayInputStream(imageData, imageOffset, imageLength)) {
            BufferedImage bi = ImageIO.read(bais);
            if (bi != null) {
                System.out.println("[Image] Loaded byte[] image: " + bi.getWidth() + "x" + bi.getHeight() + " magic=" + magic);
                return new Image(bi, false);
            } else {
                System.err.println("[Image] ImageIO.read returned null! len=" + imageLength + " magic=" + magic);
            }
        } catch (Exception e) {
            System.err.println("[Image] Failed to read byte[] image: " + e);
        }
        return null;
    }

    public static Image createRGBImage(int[] rgb, int width, int height, boolean processAlpha) {
        int type = processAlpha ? BufferedImage.TYPE_INT_ARGB : BufferedImage.TYPE_INT_RGB;
        BufferedImage bi = new BufferedImage(width, height, type);
        bi.setRGB(0, 0, width, height, rgb, 0, width);
        return new Image(bi, false);
    }

    public static Image createImage(Image image, int x, int y, int width, int height, int transform) {
        BufferedImage sub = image.getBufferedImage().getSubimage(x, y, width, height);
        // Note: transform can be applied if needed
        return new Image(sub, false);
    }

    public int getWidth() {
        return bufferedImage != null ? bufferedImage.getWidth() : 0;
    }

    public int getHeight() {
        return bufferedImage != null ? bufferedImage.getHeight() : 0;
    }

    public Graphics getGraphics() {
        if (!mutable) {
            throw new IllegalStateException("Image is immutable");
        }
        return new Graphics(bufferedImage);
    }

    public BufferedImage getBufferedImage() {
        return bufferedImage;
    }

    public boolean isMutable() {
        return mutable;
    }

    public void getRGB(int[] rgbData, int offset, int scanlength, int x, int y, int width, int height) {
        if (bufferedImage != null) {
            bufferedImage.getRGB(x, y, width, height, rgbData, offset, scanlength);
        }
    }
}
