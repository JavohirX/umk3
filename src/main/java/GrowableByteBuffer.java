/**
 * Dynamically resizing byte buffer used for binary asset streaming and decompression.
 */
public final class GrowableByteBuffer {
   public byte[] bufferData = null;
   public int byteCount;
   public int maxCapacity = 32;
}
