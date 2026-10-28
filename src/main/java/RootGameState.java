/**
 * Root game scene coordinating the active game flow controller, match timers,
 * input managers, and combat rendering loop. Extends {@link SceneBase}.
 */
public final class RootGameState extends SceneBase {
   public InputManager inputManager;
   public GameFlowController flowController;
   public FontCharmap fontCharmap;
   public long gameTimer;
   public boolean isLoaded;
   public long lastUpdateTimestamp;

   public RootGameState() {
      CoreEngine.exec_a_int_int_scenebase_to_void(9, 0, this);
      CoreEngine.exec_a_int_int_scenebase_to_void(7, 0, this);
      CoreEngine.exec_a_int_int_scenebase_to_void(13, 0, this);
      CoreEngine.exec_a_int_int_scenebase_to_void(14, 0, this);
      CoreEngine.exec_a_int_int_scenebase_to_void(10, 0, this);
      CoreEngine.exec_a_scenebase_to_void(this);

      for (short var1 = 0; var1 < 33; var1++) {
         if (super.sceneConfigShorts[var1] == 0) {
            super.sceneConfigShorts[var1] = var1;
         }
      }

      FeatureFlag var2;
      if (!(var2 = CoreEngine.exec_a_to_contextservicenode().val_featureflag_a).flagEnabled) {
         var2.flagEnabled = true;
      }

      this.fontCharmap = new FontCharmap();
      this.inputManager = new InputManager();
      this.flowController = new GameFlowController(this.inputManager);
      this.flowController.initFlow();
   }
}
