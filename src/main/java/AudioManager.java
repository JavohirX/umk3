import java.util.Vector;

/**
 * Central audio subsystem controller. Manages sound effect and music channels,
 * volume control, track pooling, mute states, and audio playback.
 */
public final class AudioManager {
   public Vector audioClipNodes;
   public boolean isAudioEnabled;
   public int currentSoundId;
   public int loopCount;
   public AudioPlaybackContext playbackContext = CoreEngine.exec_a_audioplaybackcontext_to_audioplaybackcontext(CoreEngine.getGlobalAudioContext());

   public final void unloadClip(int var1) {
      if ((var1 = this.findClipIndex(var1)) != -1) {
         this.audioClipNodes.elementAt(var1);
         this.audioClipNodes.removeElementAt(var1);
      }
   }

   public final void setLooping(int var1) {
      boolean var2;
      if (var1 != 0 && var1 != 1) {
         var2 = true;
      } else {
         var2 = false;
      }

      CoreEngine.exec_a_bool_audioplaybackcontext_to_void(var2, this.playbackContext);
   }

   public final void playSound(int var1) {
      if (this.isAudioEnabled) {
         if (this.currentSoundId != 1 || !CoreEngine.isChannelActive(this.playbackContext)) {
            this.stopSound();
            if (this.findClipIndex(var1) == -1) {
               AudioClipNode var2;
               var2 = new AudioClipNode(CoreEngine.exec_a_int_to_arr_byte(var1), var1);
               this.audioClipNodes.addElement(var2);
            }

            if (var1 != this.loopCount) {
               int var3 = this.findClipIndex(var1);
               CoreEngine.assignClipToChannel(((AudioClipNode)this.audioClipNodes.elementAt(var3)).parentClip, this.playbackContext);
               this.loopCount = var1;
            }

            CoreEngine.resumeAudioChannel(this.playbackContext);
         }
      }
   }

      /**
    * Stops currently playing sound effects on this channel.
    */
   public final void stopSound() {
      if (this.loopCount != -1) {
         if (this.loopCount == this.loopCount) {
            CoreEngine.pauseAudioChannel(this.playbackContext);
         }
      }
   }

   public AudioManager() {
      this.audioClipNodes = new Vector();
      this.isAudioEnabled = true;
      this.currentSoundId = 0;
      this.loopCount = -1;
   }

   public int findClipIndex(int var1) {
      for (int var2 = 0; var2 < this.audioClipNodes.size(); var2++) {
         if (((AudioClipNode)this.audioClipNodes.elementAt(var2)).clipSoundId == var1) {
            return var2;
         }
      }

      return -1;
   }
}
