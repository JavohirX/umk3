/**
 * Active playback channel context holding channel IDs, active sound indices,
 * and playback status flags for concurrent sound channels.
 */
public final class AudioPlaybackContext {
   public short channelId;
   public AudioPlaybackContext nextContext;
   public AudioPlaybackContext prevContext;
   public AudioPlaybackContext[] contextPool;
   public short volumeLevel;
   public short priorityLevel;
   public boolean isPlaying;
   public boolean isPaused;
   public int playbackPosition;
   public AudioClipNode activeClipNode;
   public AudioClipNode val_audioclipnode_b;
   public int[] val_arr_int_a;
   public AudioClipNode[] val_arr_audioclipnode_a;

   public AudioPlaybackContext(int var1) {
      this.channelId = (short)var1;
      switch (var1) {
         case 1:
            this.contextPool = null;
            this.volumeLevel = 255;
            this.prevContext = new AudioPlaybackContext(3);
            this.priorityLevel = CoreEngine.exec_a_audioplaybackcontext_to_short(this);
            CoreEngine.val_globalcontext_a.rootAudioContext = this;
            AudioPlaybackContext[] var3 = new AudioPlaybackContext[1];

            for (int var2 = 0; var2 <= 0; var2++) {
               var3[0] = new AudioPlaybackContext(0);
            }

            this.contextPool = var3;
            return;
         case 2:
            this.volumeLevel = 255;
            return;
         case 3:
            this.val_arr_audioclipnode_a = new AudioClipNode[CoreEngine.audioChannelCount];
            this.val_arr_int_a = new int[CoreEngine.audioChannelCount];
            return;
         default:
            this.nextContext = new AudioPlaybackContext(2);
      }
   }
}
