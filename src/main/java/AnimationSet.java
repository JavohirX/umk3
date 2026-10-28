/**
 * Animation descriptor containing part count arrays, frame indices, and frame offset pointers.
 * Defines how individual sprite parts assemble into sequential animation loops for fighter stances and moves.
 */
public final class AnimationSet {
   public byte[] partCountArray;
   public byte[][] spriteIndexMatrix;
   public boolean isLoaded;
   public SpriteImage[] spriteImages;
   public int[] frameDelayArray;
   public byte[] animConfigBytes;
   public int animFrameCount;
   public int currentFrameIndex;
   public int[] animDurationArray;
   public byte[] animPriorityBytes;
   public int totalAnimFrames;
   public long[] val_arr_long_a;

   public final void setFrame(int var1) {
      if (var1 != this.animFrameCount && var1 <= this.spriteImages.length) {
         if (this.isLoaded) {
            this.spriteImages[this.animFrameCount] = null;
            this.animFrameCount = var1;
            if (this.spriteImages[this.animFrameCount] == null) {
               CoreEngine.copyByteArray(this.partCountArray, 0, this.partCountArray.length, this.spriteIndexMatrix[this.animFrameCount]);
               this.spriteImages[this.animFrameCount] = CoreEngine.exec_a_arr_byte_int_int_to_spriteimage(this.partCountArray, 0, this.partCountArray.length);
               return;
            }
         } else if (this.spriteImages[var1] != null) {
            this.animFrameCount = var1;
         }
      }
   }

   public final SpriteImage getCurrentFrame() {
      return this.spriteImages[this.animFrameCount];
   }

   public final int getPartMinX(int var1) {
      long var2 = this.val_arr_long_a[this.animPriorityBytes[var1] & 0xFF];
      return (this.animDurationArray[var1] & 4) != 0 ? (int)(var2 & 65535L) : (int)(var2 >>> 16 & 65535L);
   }

   public final int getPartMaxX(int var1) {
      long var2 = this.val_arr_long_a[this.animPriorityBytes[var1] & 0xFF];
      return (this.animDurationArray[var1] & 4) != 0 ? (int)(var2 >>> 16 & 65535L) : (int)(var2 & 65535L);
   }
}
