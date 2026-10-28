import java.io.IOException;
import java.io.InputStream;

/**
 * Bitmap font charmap and glyph metrics loader. Parses font character maps
 * from resource streams and calculates character widths and heights.
 */
public final class FontCharmap {
   public byte[] val_arr_byte_f;
   public byte[] val_arr_byte_a;
   public byte[][] val_arr_arr_byte_a;
   public short[] val_arr_short_a;
   public byte[] val_arr_byte_b;
   public byte[] val_arr_byte_c;
   public short[][] val_arr_arr_short_a;
   public short[] val_arr_short_b;
   public byte[] val_arr_byte_d;
   public byte[][] val_arr_arr_byte_b;
   public short[][] val_arr_arr_short_b;
   public byte val_byte_a;
   public byte val_byte_b;
   public byte val_byte_c;
   public short[] val_arr_short_c;
   public byte[] val_arr_byte_e;
   public byte val_byte_d;
   public byte val_byte_e;
   public short[] val_arr_short_d = new short[128];
   public int val_int_a;
   public short[] val_arr_short_e;
   public int val_int_b;
   public GraphicsAdapter val_graphicsadapter_a;
   public int[] val_arr_int_a = null;
   public int[] val_arr_int_b = null;
   public boolean val_bool_a;
   public boolean val_bool_b;
   public AudioManager val_audiomanager_a;
   public ContextServiceNode val_contextservicenode_a = new ContextServiceNode(6);

   public FontCharmap() {
      this.val_arr_int_a = new int[2];
      this.val_arr_int_b = new int[4];
      this.val_byte_d = 0;
   }

   public final byte[] formatInt(int var1) {
      if (this.val_arr_byte_f == null) {
         this.val_arr_byte_f = new byte[11];
      }

      int var2 = 10;
      int var3 = var1;
      if (var1 < 0) {
         var3 = -var1;
      }

      for (int var4 = 10; var4 >= 0; var4--) {
         this.val_arr_byte_f[var4] = (byte)(var3 % 10 | 48);
         var3 /= 10;
         if (this.val_arr_byte_f[var4] != 48) {
            var2 = var4;
         }
      }

      if (var1 < 0) {
         this.val_arr_byte_f[--var2] = 45;
      }

      short var6;
      byte[] var5 = new byte[(var6 = (short)(11 - var2)) + 1];
      System.arraycopy(this.val_arr_byte_f, var2, var5, 0, var6);
      var5[var6] = 0;
      return var5;
   }

   public final int renderText(byte[] var1, int var2, byte[] var3, int var4, short var5, int var6, int var7) {
      int var8;
      if (var7 == 0) {
         var8 = var5 << 1;
      } else {
         var8 = var5;
      }

      if (var6 != var7 && (var6 != 1 || var7 == 0)) {
         for (int var11 = var2; var11 < var2 + var5; var11++) {
            short var10;
            short var9 = var10 = (short)(var1[var11] & 0xFF);
            if (var10 > 127) {
               var9 = this.val_arr_short_d[var10 - 128];
            }

            int var10001 = var4 + 1;
            int var10002 = var4 + 1;
            var3[var4] = (byte)(var9 >> 8);
            var4 = var10002 + 1;
            var3[var10001] = (byte)var9;
         }
      } else {
         System.arraycopy(var1, var2, var3, var4, var8);
      }

      return var8;
   }

   public final int getCharWidth(short var1) {
      int var2 = this.val_contextservicenode_a.val_arr_byte_a[6] & 255;
      return var1 == -1
         ? (this.val_contextservicenode_a.val_arr_byte_a[5] & 0xFF) + var2
         : (this.val_contextservicenode_a.val_arr_byte_b[var1 & 65535] & 0xFF) + var2;
   }

   public final short getKerning(short var1, int var2) {
      int var3 = this.val_contextservicenode_a.val_arr_short_b.length;
      if (var2 == 0) {
         return this.val_contextservicenode_a.val_arr_short_c[CoreEngine.exec_a_arr_short_int_int_int_int_fontcharmap_to_int(
            this.val_contextservicenode_a.val_arr_short_b, var1, 0, var3 - 1, var3, this
         )];
      } else {
         return var1 >= 128 && var2 != this.val_arr_byte_a[this.val_byte_d]
            ? -1
            : this.val_contextservicenode_a.val_arr_short_c[this.val_contextservicenode_a.val_arr_short_a[var1] & 65535];
      }
   }

   public final void setFontPalette(int[] var1, int var2) {
      byte var3;
      if ((var3 = this.val_contextservicenode_a.val_arr_byte_a[8]) == 1) {
         var1[0] += var2;
      } else if (var3 == 4) {
         var1[0] -= var2;
      } else if (var3 == 2) {
         var1[1] += var2;
      } else {
         if (var3 == 8) {
            var1[1] -= var2;
         }
      }
   }

   public final void setFontStyle(byte var1) {
      int var2 = 0;

      for (short var3 = 1; var3 < var1; var3++) {
         if ((this.val_int_a & 1 << var3) != 0) {
            var2++;
         }
      }

      byte[] var8 = new byte[2];

      try {
         InputStream var5;
         CoreEngine.skipStreamBytes(var5 = CoreEngine.midletInstance.getClass().getResourceAsStream("/charmap"), var2 << 8);

         for (int var6 = 0; var6 < 128; var6++) {
            var8[0] = (byte)var5.read();
            var8[1] = (byte)var5.read();
            this.val_arr_short_d[var6] = CoreEngine.readShortBigEndian(var8, 0);
         }

         var5.close();
      } catch (IOException var4) {
      }

      if (this.val_contextservicenode_a.val_object_b != null && (this.val_contextservicenode_a.val_arr_byte_a[10] & 4) == 0) {
         int var9 = this.val_contextservicenode_a.val_arr_short_b.length;

         for (short var7 = 128; var7 < 256; var7++) {
            this.val_contextservicenode_a.val_arr_short_a[var7] = (short)CoreEngine.exec_a_arr_short_int_int_int_int_fontcharmap_to_int(
               this.val_contextservicenode_a.val_arr_short_b, this.val_arr_short_d[var7 - 128], 0, var9 - 1, var9, this
            );
         }

         this.val_contextservicenode_a.val_arr_byte_a[11] = this.val_arr_byte_a[this.val_byte_d];
      }
   }
}
