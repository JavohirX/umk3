import javax.microedition.lcdui.Image;

/**
 * Direct concrete wrapper around {@link javax.microedition.lcdui.Image},
 * providing width, height, and direct raster image access.
 */
public final class ConcreteImage extends AbstractImage {
   public Image underlyingImage;

   public ConcreteImage() {
   }

   public ConcreteImage(TokenString var1) {
      String var2;
      var2 = new String(CoreEngine.exec_a_tokenstring_to_string(var1));
      String var4 = var2;
      if (var2.charAt(0) != '/') {
         var4 = '/' + var2;
      }

      try {
         this.underlyingImage = Image.createImage(var4);
      } catch (Exception var3) {
      }

      if (this.underlyingImage != null) {
         super.imageWidth = (short)this.underlyingImage.getWidth();
         super.imageHeight = (short)this.underlyingImage.getHeight();
      }
   }

   public final Image getImage() {
      return this.underlyingImage;
   }
}
