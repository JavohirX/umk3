package javax.microedition.media.control;

/**
 * Desktop compatibility implementation of VolumeControl.
 */
public interface VolumeControl extends javax.microedition.media.Control {
    int setLevel(int level);
    int getLevel();
    void setMute(boolean mute);
    boolean isMuted();
}
