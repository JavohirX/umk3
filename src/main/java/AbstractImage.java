import javax.microedition.lcdui.Image;

/**
 * Abstract base class for all image and sprite wrappers in the engine.
 * Encapsulates underlying dimensions (imageWidth, imageHeight) and provides
 * an abstract {@link #getImage()} accessor for rendering.
 */
public abstract class AbstractImage {
   public short imageWidth;
   public short imageHeight;

   public abstract Image getImage();
}
