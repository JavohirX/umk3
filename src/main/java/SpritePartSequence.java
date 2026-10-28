/**
 * Composite sprite part layout engine. Assembles multi-layer character sprites
 * (torso, limbs, head) into complete animated fighter stances.
 */
public final class SpritePartSequence {
   public short[] frameOffsets;
   public byte[] frameDurations;
   public short[] partOffsets;
   public int totalFrames;
   public int sequenceFlags;

   public SpritePartSequence(int var1, int var2, int var3, int var4) {
      this.frameOffsets = new short[var2 * 3];
      if (var1 != var2) {
         this.frameDurations = new byte[var1];
      }

      this.partOffsets = new short[var1];
      this.totalFrames = var3 | var4 << 8;
   }

   public final void setPlaybackMode(int var1) {
      this.totalFrames = this.totalFrames & -4 | var1;
   }

   public boolean isMultiPart() {
      boolean var1;
      if (this.frameDurations != null) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public final int getFrameCount() {
      return this.partOffsets.length;
   }

   public final int getTotalDuration() {
      return this.sequenceFlags;
   }

   public int getStartPartIndex(int var1) {
      int var2 = var1;
      if (this.isMultiPart() && var1 != 0) {
         var2 = (this.frameDurations[var1 - 1] & 255) + 1;
      }

      return var2;
   }

   public int getEndPartIndex(int var1) {
      int var2 = var1;
      if (this.isMultiPart()) {
         var2 = this.frameDurations[var1] & 255;
      }

      return var2;
   }

   public final void calculateBounds(AnimationSet var1, int[] var2) {
      int var8 = this.partOffsets.length;
      int[] var9 = CoreEngine.val_arr_int_c;
      this.renderPart(0, var1, var9, 2);
      int var4 = var9[2];
      int var3 = var9[3];
      int var5 = var9[4];
      int var6 = var9[5];

      for (int var7 = 0; var7 < var8; var7++) {
         this.renderPart(var7, var1, var9, 2);
         var4 = Math.min(var4, var9[2]);
         var3 = Math.min(var3, var9[3]);
         var5 = Math.max(var5, var9[4]);
         var6 = Math.max(var6, var9[5]);
      }

      var2[0] = var4;
      var2[1] = var3;
      var2[2] = var5;
      var2[3] = var6;
   }

   public final int getSequenceWidth(AnimationSet var1) {
      this.calculateBounds(var1, CoreEngine.val_arr_int_d);
      return CoreEngine.val_arr_int_d[2] - CoreEngine.val_arr_int_d[0];
   }

   public final int getSequenceHeight(AnimationSet var1) {
      this.calculateBounds(var1, CoreEngine.val_arr_int_d);
      return CoreEngine.val_arr_int_d[3] - CoreEngine.val_arr_int_d[1];
   }

   public final int getFrameDelay(AnimationSet var1) {
      this.calculateBounds(var1, CoreEngine.val_arr_int_d);
      return CoreEngine.val_arr_int_d[0];
   }

   public final void renderPart(int var1, AnimationSet var2, int[] var3, int var4) {
      int var5 = this.getStartPartIndex(var1) * 3;
      int var13 = this.getEndPartIndex(var1) * 3;
      int[] var15 = CoreEngine.val_arr_int_c;
      this.renderFrameAt(var5, var2, 0, var15);
      int var6 = -var15[0];
      int var7 = -var15[1];
      int var8 = var6;
      int var9 = var7;

      while (var5 <= var13) {
         int var10 = var5;
         short var16;
         short var10003 = var16 = this.frameOffsets[var10];
         this.renderFrameAt(var5, var2, 0, var15);
         var10 = -var15[0];
         int var11 = -var15[1];
         int var12 = var2.getPartMinX(var10003) + var10;
         int var10001 = var2.getPartMaxX(var16) + var11;
         var6 = Math.min(var6, var10);
         var7 = Math.min(var7, var11);
         var8 = Math.max(var8, var12);
         var9 = Math.max(var9, var10001);
         var5 += 3;
      }

      int var19 = var4 + 1;
      int var10002 = var4 + 1;
      var3[var4] = var6;
      var13 = var10002 + 1;
      var3[var19] = var7;
      var19 = var13 + 1;
      var3[var13] = var8;
      var3[var19] = var9;
   }

   public void renderFrameAt(int var1, AnimationSet var2, int var3, int[] var4) {
      short var6 = this.frameOffsets[var1 + 1];
      int var5 = this.frameOffsets[var1 + 2];
      int var7 = var6;
      switch (var3) {
         case 0:
         default:
            break;
         case 1:
            var7 = var5;
            var5 = var2.getPartMinX(this.frameOffsets[var1]) - var6;
            break;
         case 2:
            var7 = var2.getPartMinX(this.frameOffsets[var1]) - var6;
            var5 = var2.getPartMaxX(this.frameOffsets[var1]) - var5;
            break;
         case 3:
            var7 = var2.getPartMaxX(this.frameOffsets[var1]) - var5;
            var5 = var6;
            break;
         case 4:
            var7 = var2.getPartMinX(this.frameOffsets[var1]) - var6;
            break;
         case 5:
            var7 = var5;
            var5 = var6;
            break;
         case 6:
            var7 = var6;
            var5 = var2.getPartMaxX(this.frameOffsets[var1]) - var5;
            break;
         case 7:
            var7 = var2.getPartMaxX(this.frameOffsets[var1]) - var5;
            var5 = var2.getPartMinX(this.frameOffsets[var1]) - var6;
      }

      var4[0] = var7;
      var4[1] = var5;
   }

   public final int getPartXOffset(int var1) {
      short var2;
      if (var1 == 0) {
         var2 = 0;
      } else {
         var2 = this.partOffsets[var1 - 1];
      }

      return CoreEngine.exec_a_int_int_int_to_int(var2, var1, 1);
   }

   public final int getPartYOffset(int var1, int var2) {
      int var3 = var1 & 3;
      int var4 = (var1 & 65532) >>> 2;
      var1 >>>= 16;
      switch (var3) {
         case 1:
            var1 += var2;
            break;
         case 2:
            var1 -= var2;
      }

      switch (this.totalFrames & 3) {
         case 0:
            if (var1 >= this.sequenceFlags || var1 <= 0) {
               var3 = 0;
            }
            break;
         case 1:
            if (var1 >= this.sequenceFlags) {
               var1 -= this.sequenceFlags;
               var4 = 0;
            } else if (var1 < 0) {
               var1 += this.sequenceFlags;
               var4 = this.partOffsets.length;
            }
            break;
         case 2:
            if (var1 < 0) {
               var3 = 1;
            } else if (var1 >= this.sequenceFlags) {
               var3 = 2;
            }
      }

      switch (var3) {
         case 1:
            var2 = this.partOffsets.length - 1;

            while (var4 < var2 && var1 >= this.partOffsets[var4]) {
               var4++;
            }
            break;
         case 2:
            while (var4 > 0 && var1 < this.partOffsets[var4 - 1]) {
               var4--;
            }
      }

      return CoreEngine.exec_a_int_int_int_to_int(var1, var4, var3);
   }

   public final void drawSequence(int var1, AnimationSet var2, int var3, int var4, int var5) {
      int var6;
      var1 = this.getStartPartIndex(var6 = (var1 & 65532) >>> 2);
      int var10000 = this.getEndPartIndex(var6);
      var6 = var1 + (var1 << 1);
      int var7 = var10000 + (var10000 << 1);
      int[] var16 = CoreEngine.val_arr_int_c;

      while (var6 <= var7) {
         this.renderFrameAt(var6, var2, var5, var16);
         int var9 = var6;
         short var10001 = this.frameOffsets[var9];
         int var10002 = var3 - var16[0];
         int var12 = var4 - var16[1];
         int var11 = var10002;
         short var18 = var10001;
         AnimationSet var8 = var2;
         int var10 = TransformTable.val_arr_int_a[CoreEngine.val_arr_int_b[var8.animDurationArray[var18]] + (var5 << 3)];
         long var13 = var8.val_arr_long_a[var8.animPriorityBytes[var18] & 0xFF];
         CoreEngine.val_graphicsadapter_a
            .drawRegion(
               var8.getCurrentFrame(),
               (int)(var13 >>> 48 & 65535L),
               (int)(var13 >>> 32 & 65535L),
               (int)(var13 >>> 16 & 65535L),
               (int)var13 & 65535,
               CoreEngine.val_arr_int_a[var10],
               var11,
               var12,
               20
            );
         var6 += 3;
      }
   }
}
