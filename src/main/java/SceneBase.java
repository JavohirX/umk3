/**
 * Abstract base class for all game scenes, providing scene timers,
 * state transitions, pause flags, and lifecycle methods.
 */
public abstract class SceneBase {
   public long[] sceneTimers = null;
   public boolean isSceneActive;
   public boolean isSceneVisible;
   public boolean isScenePaused;
   public boolean isTransitioning;
   public int sceneStateId;
   public short[] sceneConfigShorts = new short[33];
   public int sceneDuration;
   public boolean sceneCompleteFlag;
   public short[] sceneExtraShorts = new short[33];

   public SceneBase() {
      this.isSceneVisible = true;
      this.isScenePaused = true;
      this.sceneStateId = 0;
      this.sceneCompleteFlag = true;
      CoreEngine.val_globalcontext_a.currentScene = this;
      GlobalContext var1 = CoreEngine.val_globalcontext_a;
      if (CoreEngine.val_globalcontext_a.serviceNodeB == null) {
         var1.serviceNodeB = new ContextServiceNode(4);
      }

      this.sceneTimers = new long[2];
      this.sceneTimers[0] = System.currentTimeMillis();
      this.sceneTimers[1] = 0L;
   }
}
