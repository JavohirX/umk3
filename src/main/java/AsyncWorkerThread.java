/**
 * Background worker thread handling asynchronous decompression, asset streaming,
 * and sound decoding off the main game thread to maintain steady frame rates.
 */
public final class AsyncWorkerThread extends Thread {
   public byte threadPriority;

   public AsyncWorkerThread(byte var1) {
      this.threadPriority = var1;
   }

   public final void run() {
      CoreEngine.exec_c_byte_to_void(this.threadPriority);
      CoreEngine.exec_d_to_bool();
   }
}
