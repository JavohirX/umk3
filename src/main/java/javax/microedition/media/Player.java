package javax.microedition.media;

import javax.microedition.media.control.VolumeControl;

/**
 * Desktop compatibility interface for Media Player.
 */
public interface Player extends Controllable {
    int UNREALIZED = 100;
    int REALIZED = 200;
    int PREFETCHED = 300;
    int STARTED = 400;
    int CLOSED = 0;
    long TIME_UNKNOWN = -1L;

    void realize();
    void prefetch();
    void start();
    void stop();
    void deallocate();
    void close();
    int getState();
    void setLoopCount(int count);
    long setMediaTime(long now);
    long getMediaTime();
    long getDuration();
    String getContentType();
    Control getControl(String controlType);
    Control[] getControls();
}
