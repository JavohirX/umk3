import javax.microedition.lcdui.Image;

/**
 * Sprite sheet representation managing sub-image rectangles, frame offsets,
 * anchor points, and horizontal flipping for fighter sprites.
 */
public final class SpriteImage {
   public AbstractImage sourceImage;

   public SpriteImage(byte[] var1, int var2, int var3) {
      this.sourceImage = new ConcreteImage();
      ConcreteImage var4;
      (var4 = (ConcreteImage)this.sourceImage).underlyingImage = Image.createImage(var1, var2, var3);
      var4.imageWidth = (short)var4.underlyingImage.getWidth();
      var4.imageHeight = (short)var4.underlyingImage.getHeight();
   }

   public SpriteImage(String var1) {
      this.sourceImage = new ConcreteImage(CoreEngine.exec_a_string_to_tokenstring(var1));
   }

   public SpriteImage() {
      this.sourceImage = new ConcreteImage();
   }
}
