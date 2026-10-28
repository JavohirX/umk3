/**
 * Contextual service node linking dynamic sprite instances, render nodes,
 * and engine resources in a linked-list structure.
 */
public final class ContextServiceNode {
   public short val_short_a;
   public FeatureFlag val_featureflag_a;
   public ContextServiceNode val_contextservicenode_a;
   public Object val_object_a;
   public byte[] val_arr_byte_a;
   public short[] val_arr_short_a;
   public short[] val_arr_short_b;
   public short[] val_arr_short_c;
   public byte[] val_arr_byte_b;
   public Object val_object_b;

   public ContextServiceNode(int var1) {
      this.val_short_a = (short)var1;
      switch (var1) {
         case 1:
            return;
         case 2:
            return;
         case 3:
            return;
         case 4:
            CoreEngine.exec_a_int_int_scenebase_to_void(7, 5, CoreEngine.val_globalcontext_a.currentScene);
            CoreEngine.exec_a_int_int_scenebase_to_void(13, 5, CoreEngine.val_globalcontext_a.currentScene);
            CoreEngine.exec_a_int_int_scenebase_to_void(9, 6, CoreEngine.val_globalcontext_a.currentScene);
            CoreEngine.exec_a_int_int_scenebase_to_void(10, 6, CoreEngine.val_globalcontext_a.currentScene);
            CoreEngine.exec_a_int_int_scenebase_to_void(14, 6, CoreEngine.val_globalcontext_a.currentScene);
            return;
         case 5:
            this.val_contextservicenode_a = new ContextServiceNode(2);
            return;
         case 6:
            return;
         default:
            this.val_featureflag_a = new FeatureFlag();
      }
   }
}
