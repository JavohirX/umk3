import com.nokia.mid.ui.FullCanvas;
import javax.microedition.lcdui.Graphics;

/**
 * Nokia FullCanvas / LCDUI Canvas implementation bridging desktop rendering,
 * full-screen buffer blitting, and key input dispatch to the input subsystem.
 */
public final class MainCanvasBridge extends FullCanvas {
   public boolean isDisplayActive;
   public int canvasWidth;
   public RenderContext renderContext = CoreEngine.val_rendercontext_a;

   public final void hideNotify() {
      CoreEngine.exec_a_gamemidletloop_to_void(CoreEngine.val_gamemidletloop_b);
      CoreEngine.val_gamemidletloop_b.val_bool_h = true;
   }

   public final void showNotify() {
      CoreEngine.val_gamemidletloop_b.stopGameLoop();
      CoreEngine.exec_a_short_short_short_gamemidletloop_to_void((short)7, (short)0, (short)0, CoreEngine.val_gamemidletloop_b);
   }

   public final void sizeChanged(int var1, int var2) {
   }

   public final void keyPressed(int var1) {
      CoreEngine.exec_a_short_short_short_gamemidletloop_to_void((short)1, (short)(var1 >> 16), (short)var1, CoreEngine.val_gamemidletloop_b);
   }

   public final void keyReleased(int var1) {
      CoreEngine.exec_a_short_short_short_gamemidletloop_to_void((short)2, (short)(var1 >> 16), (short)var1, CoreEngine.val_gamemidletloop_b);
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public final void paint(Graphics var1) {
      Object var2 = CoreEngine.val_object_a;
      synchronized (CoreEngine.val_object_a){} // $VF: monitorenter 

      try {
         if (!this.isDisplayActive) {
            this.isDisplayActive = true;
         }

         this.renderContext.targetGraphics = var1;
         RenderContext var4 = CoreEngine.val_rendercontext_a;
         if (CoreEngine.val_rendercontext_a.clipColor > 0) {
            var4.clipColor--;
            short[] var5;
            (var5 = new short[3])[0] = 0;
            var5[1] = 0;
            var5[2] = 0;
            int var11 = CoreEngine.val_rendercontext_a.viewportCoords[0];
            short var10 = CoreEngine.val_rendercontext_a.viewportCoords[1];
            short var9 = CoreEngine.val_rendercontext_a.viewportCoords[2];
            short var3 = CoreEngine.val_rendercontext_a.viewportCoords[3];
            int var10000 = var4.targetGraphics.getColor();
            var4.targetGraphics.setColor(var5[0], var5[1], var5[2]);
            var4.targetGraphics.fillRect(var11, var10, var9, var3);
            var11 = var10000 & 16777215;
            var4.targetGraphics.setColor(var11);
         }

         InputManager var13 = ((RootGameState)CoreEngine.val_globalcontext_a.currentScene).inputManager;
         ((RootGameState)CoreEngine.val_globalcontext_a.currentScene).inputManager.graphicsAdapter.renderContext = var4;
         CoreEngine.exec_a_to_rootgamestate().flowController.renderFlow(var13.graphicsAdapter);
         CoreEngine.val_globalcontext_a.currentScene.isScenePaused = false;
         // $VF: monitorexit
      } catch (Throwable var8) {
         Throwable var6 = var8;

         while (true) {
            try {
               // $VF: monitorexit
               throw var6;
            } catch (Throwable var7) {
               var6 = var7;
            }
         }
      }

      CoreEngine.isGlobalPaused = false;
      if (CoreEngine.val_gamemidletloop_b.val_bool_g) {
         CoreEngine.isGlobalPaused = true;
         CoreEngine.val_globalcontext_a.currentScene.isScenePaused = true;
         CoreEngine.val_gamemidletloop_b.val_bool_g = false;
      }
   }
}
