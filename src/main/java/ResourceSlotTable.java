/**
 * Resource slot allocation table tracking loaded texture banks and cached sprite sheets.
 */
public abstract class ResourceSlotTable {
   public static final byte[] val_arr_byte_a;
   public static final int[][] val_arr_arr_int_a;

   static {
      byte[] var0;
      (var0 = new byte[9])[0] = 0;
      var0[1] = 1;
      var0[2] = 2;
      var0[3] = 3;
      var0[4] = 4;
      var0[5] = 5;
      var0[6] = 6;
      var0[7] = 7;
      var0[8] = 8;
      val_arr_byte_a = var0;
      int[][] var2 = new int[9][];
      int[] var1;
      (var1 = new int[4])[0] = 0;
      var1[1] = 1;
      var1[2] = 0;
      var1[3] = -1;
      var2[0] = var1;
      (var1 = new int[4])[0] = 0;
      var1[1] = 3;
      var1[2] = 2;
      var1[3] = -1;
      var2[1] = var1;
      (var1 = new int[4])[0] = 0;
      var1[1] = 6;
      var1[2] = 4;
      var1[3] = -1;
      var2[2] = var1;
      (var1 = new int[4])[0] = 0;
      var1[1] = 6;
      var1[2] = 4;
      var1[3] = 5;
      var2[3] = var1;
      (var1 = new int[4])[0] = 0;
      var1[1] = 10;
      var1[2] = 7;
      var1[3] = -1;
      var2[4] = var1;
      (var1 = new int[4])[0] = 0;
      var1[1] = 10;
      var1[2] = 7;
      var1[3] = 8;
      var2[5] = var1;
      (var1 = new int[4])[0] = 0;
      var1[1] = 10;
      var1[2] = 7;
      var1[3] = 9;
      var2[6] = var1;
      (var1 = new int[4])[0] = 0;
      var1[1] = 14;
      var1[2] = 12;
      var1[3] = 13;
      var2[7] = var1;
      (var1 = new int[4])[0] = 0;
      var1[1] = 14;
      var1[2] = 12;
      var1[3] = -1;
      var2[8] = var1;
      val_arr_arr_int_a = var2;
   }
}
