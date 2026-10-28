/**
 * Service locator maintaining global references to active game scenes,
 * MIDlet controller, and application lifecycle states.
 */
public final class GlobalContext {
   public SceneBase currentScene;
   public GameMidletLoop gameMidletLoop;
   public GameFlowController gameFlowController;
   public AudioPlaybackContext rootAudioContext;
   public ContextServiceNode serviceNodeA;
   public ContextServiceNode serviceNodeB;
   public ContextServiceNode serviceNodeC;
}
