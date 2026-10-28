import javax.microedition.lcdui.Image;

/**
 * 2D graphics wrapper providing accelerated drawing primitives, clipped region rendering,
 * sprite transformations, and color fill operations over {@link javax.microedition.lcdui.Graphics}.
 */
public final class GraphicsAdapter {
   public RenderContext renderContext;

   public final void drawLine(int var1, int var2, int var3, int var4) {
      int var5 = var4;
      var4 = var3;
      var3 = var2;
      var2 = var1;
      this.renderContext.targetGraphics.drawLine(var2, var3, var4, var5);
   }

   public final void drawRect(int var1, int var2, int var3, int var4) {
      int var10003 = var3 + 1;
      int var5 = var4 + 1;
      var4 = var10003;
      var3 = var2;
      var2 = var1;
      this.renderContext.targetGraphics.drawRect(var2, var3, var4 + -1, var5 + -1);
   }

   public final void drawRegion(SpriteImage var1, int var2, int var3, int var4, int var5, int var6, int var7, int var8, int var9) {
      RenderContext var10000 = this.renderContext;
      Image var10001 = var1.sourceImage.getImage();
      int var10006 = CoreEngine.getTransformMask(var6);
      int var10 = var9;
      var9 = var8;
      var8 = var7;
      var7 = var10006;
      var6 = var5;
      var5 = var4;
      var4 = var3;
      var3 = var2;
      Image var11 = var10001;
      var10000.targetGraphics.drawRegion(var11, var3, var4, var5, var6, var7 >>> 16, var8, var9, var10);
   }

   public final void drawRGB(int[] var1, int var2, int var3, int var4, int var5, int var6) {
      int[] var10001 = var1;
      int var7 = var3;
      var6 = var6;
      var5 = var5;
      var4 = var4;
      var3 = var2;
      int[] var8 = var10001;
      this.renderContext.targetGraphics.drawRGB(var8, var3, var7, var4, var5, var6, 1, true);
   }

   public final void fillRect(int var1, int var2, int var3, int var4) {
      int var5 = var4;
      var4 = var3;
      var3 = var2;
      var2 = var1;
      this.renderContext.targetGraphics.fillRect(var2, var3, var4, var5);
   }

   public final void fillTriangle(int var1, int var2, int var3, int var4, int var5, int var6) {
      int var7 = var6;
      var6 = var5;
      var5 = var4;
      var4 = var3;
      var3 = var2;
      var2 = var1;
      this.renderContext.targetGraphics.fillTriangle(var2, var3, var4, var5, var6, var7);
   }

   public final void setClip(int var1, int var2, int var3, int var4) {
      int var5 = var4;
      var4 = var3;
      var3 = var2;
      var2 = var1;
      this.renderContext.targetGraphics.setClip(var2, var3, var4, var5);
   }

   public final void setColor(int var1) {
      var1 = var1;
      this.renderContext.targetGraphics.setColor(var1 & 16777215);
   }

   public final void drawImage(SpriteImage var1, int var2, int var3, int var4) {
      this.drawRegion(var1, 0, 0, var1.sourceImage.imageWidth, var1.sourceImage.imageHeight, 0, var2, var3, var4);
   }
}
