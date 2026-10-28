import javax.microedition.lcdui.Graphics;

/**
 * Rendering context cache holding viewport dimensions, clip rectangles,
 * screen offset coordinates, and drawing modes.
 */
public final class RenderContext {
   public int clipColor;
   public short[] viewportCoords;
   public int[] clipBounds;
   public Graphics targetGraphics;

   public RenderContext(int[] var1) {
      int[] var2;
      (var2 = new int[3])[0] = var1[0];
      var2[1] = var1[1];
      var2[2] = var1[2];
      this.clipBounds = var2;
      short var5 = (short)var1[0];
      short var4 = (short)var1[1];
      short[] var3;
      (var3 = new short[4])[0] = 0;
      var3[1] = 0;
      var3[2] = var5;
      var3[3] = var4;
      this.viewportCoords = var3;
   }
}
