/**
 * Combo and special move pattern tables. Defines directional and button input
 * sequences for special moves, combos, and Fatalities.
 */
public abstract class PatternTable {
   public static final byte[][] val_arr_arr_byte_a;

   static {
      byte[][] var0 = new byte[8][];
      byte[] var1;
      (var1 = new byte[8])[0] = 5;
      var1[1] = 0;
      var1[2] = 1;
      var1[3] = 0;
      var1[4] = 1;
      var1[5] = 3;
      var1[6] = 7;
      var1[7] = 2;
      var0[0] = var1;
      (var1 = new byte[8])[0] = 0;
      var1[1] = 0;
      var1[2] = 0;
      var1[3] = 1;
      var1[4] = 3;
      var1[5] = 2;
      var1[6] = 0;
      var1[7] = 4;
      var0[1] = var1;
      (var1 = new byte[8])[0] = 4;
      var1[1] = 0;
      var1[2] = 1;
      var1[3] = 1;
      var1[4] = 1;
      var1[5] = 3;
      var1[6] = 0;
      var1[7] = 5;
      var0[2] = var1;
      (var1 = new byte[8])[0] = 3;
      var1[1] = 0;
      var1[2] = 2;
      var1[3] = 1;
      var1[4] = 2;
      var1[5] = 1;
      var1[6] = 0;
      var1[7] = 6;
      var0[3] = var1;
      (var1 = new byte[8])[0] = 1;
      var1[1] = 0;
      var1[2] = 0;
      var1[3] = 2;
      var1[4] = 6;
      var1[5] = 5;
      var1[6] = 1;
      var1[7] = 7;
      var0[4] = var1;
      (var1 = new byte[8])[0] = 6;
      var1[1] = 1;
      var1[2] = 1;
      var1[3] = 2;
      var1[4] = 4;
      var1[5] = 6;
      var1[6] = 2;
      var1[7] = 7;
      var0[5] = var1;
      (var1 = new byte[8])[0] = 2;
      var1[1] = 0;
      var1[2] = 2;
      var1[3] = 2;
      var1[4] = 5;
      var1[5] = 4;
      var1[6] = 3;
      var1[7] = 7;
      var0[6] = var1;
      (var1 = new byte[8])[0] = -1;
      var1[1] = 2;
      var1[2] = 1;
      var1[3] = 3;
      var1[4] = 4;
      var1[5] = 6;
      var1[6] = 5;
      var1[7] = 0;
      var0[7] = var1;
      val_arr_arr_byte_a = var0;
   }
}
