import javax.microedition.media.Player;

/**
 * Linked-list node representing an individual audio track or sound effect clip.
 * Encapsulates the J2ME Player, clip name, duration, loop count, and priority.
 */
public final class AudioClipNode {
   public byte[] rawAudioData;
   public AudioClipNode nextClip;
   public AudioClipNode prevClip;
   public Player mediaPlayer;
   public String clipName;
   public AudioClipNode parentClip;
   public int clipSoundId;

   public AudioClipNode(int var1) {
      if (var1 != 1) {
         if (var1 == 2) {
            this.clipName = new String();
            this.prevClip = new AudioClipNode(0);
         }
      } else {
         this.nextClip = new AudioClipNode(2);
      }
   }

   public AudioClipNode(AudioClipNode var1, String var2) {
      this.nextClip = new AudioClipNode(2);
      this.nextClip = new AudioClipNode(2);
      this.nextClip.clipName = var2;
      this.nextClip.prevClip = var1;
   }

   public AudioClipNode(byte[] var1, int var2) {
      this.clipSoundId = var2;
      AudioClipNode var4;
      var4 = new AudioClipNode(0);
      var4.rawAudioData = var1;
      
      String var3 = new String("Undefined");
      switch (var1[0]) {
         case -1:
         case 73:
            var3 = "audio/mpeg";
            break;
         case 35:
            var3 = "audio/amr";
            break;
         case 77:
            var3 = "audio/midi";
            break;
         case 82:
            var3 = "audio/x-wav";
      }

      AudioClipNode var5 = new AudioClipNode(var4, var3);
      this.parentClip = var5;
   }
}
