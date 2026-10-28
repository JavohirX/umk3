import java.io.IOException;
import java.io.InputStream;

/**
 * Decompressing resource stream reader extracting compressed sprite sheets,
 * sound clips, and level maps from game data packages.
 */
public final class PackedResourceStream extends InputStream {
   public InputStream underlyingStream;
   public int streamLength = 0;
   public int currentOffset;
   public int resourceId;
   public int chunkSize;
   public int remainingBytes;
   public String resourceName;

   public PackedResourceStream(int var1) {
      if (!CoreEngine.val_bool_a) {
         CoreEngine.exec_f_to_void();
      }

      int[] var2 = CoreEngine.exec_a_int_to_arr_int(var1);
      this.chunkSize = var2[0];
      this.currentOffset = var2[1];
      this.resourceId = var2[2];
      this.remainingBytes = var2[3];
      this.resourceName = "/df" + this.chunkSize + "_" + this.remainingBytes;
      if (CoreEngine.val_inputstream_a != null
         && this.chunkSize == CoreEngine.val_int_b
         && CoreEngine.val_int_d == this.remainingBytes
         && CoreEngine.val_int_c <= this.currentOffset) {
         this.underlyingStream = CoreEngine.val_inputstream_a;
         CoreEngine.val_inputstream_a = null;
         CoreEngine.skipStreamBytes(this.underlyingStream, this.currentOffset - CoreEngine.val_int_c);
      } else {
         this.underlyingStream = CoreEngine.midletInstance.getClass().getResourceAsStream(this.resourceName);
         if (this.currentOffset > 0) {
            CoreEngine.skipStreamBytes(this.underlyingStream, this.currentOffset);
         }
      }

      this.streamLength = 0;
   }

   public final void close() throws IOException {
      if (CoreEngine.val_inputstream_a != null && CoreEngine.val_inputstream_a != this.underlyingStream) {
         CoreEngine.val_inputstream_a.close();
      }

      CoreEngine.val_inputstream_a = this.underlyingStream;
      CoreEngine.val_int_b = this.chunkSize;
      CoreEngine.val_int_c = this.currentOffset + this.streamLength;
      CoreEngine.val_int_d = this.remainingBytes;
   }

   public final int read() throws IOException {
      if (this.streamLength >= this.resourceId) {
         return -1;
      }

      this.streamLength++;
      return this.underlyingStream.read();
   }

   public final int read(byte[] var1) throws IOException {
      return this.read(var1, 0, var1.length);
   }

   public final int read(byte[] var1, int var2, int var3) throws IOException {
      if (this.streamLength >= this.resourceId) {
         return -1;
      }

      int var4 = var3;
      if (this.streamLength + var3 > this.resourceId) {
         var4 = this.resourceId - this.streamLength;
      }

      if ((var4 = CoreEngine.bufferedStreamRead(this.underlyingStream, var1, var2, var4)) != -1) {
         this.streamLength += var4;
      }

      return var4;
   }

   public final int available() {
      return this.resourceId - this.streamLength;
   }

   public final long skip(long var1) {
      if ((var1 = CoreEngine.skipStreamBytes(this.underlyingStream, var1)) > 0L) {
         this.streamLength = (int)(this.streamLength + var1);
      }

      return var1;
   }

   public final void reset() {
      this.underlyingStream = CoreEngine.midletInstance.getClass().getResourceAsStream(this.resourceName);
      CoreEngine.skipStreamBytes(this.underlyingStream, this.currentOffset);
      this.streamLength = 0;
   }
}
