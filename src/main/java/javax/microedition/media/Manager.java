package javax.microedition.media;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import javax.microedition.media.control.VolumeControl;
import javax.sound.midi.MidiSystem;
import javax.sound.midi.Sequencer;
import javax.sound.sampled.AudioInputStream;
import javax.sound.sampled.AudioSystem;
import javax.sound.sampled.Clip;
import javax.sound.sampled.FloatControl;

/**
 * Desktop compatibility implementation of Media Manager.
 * Supports MIDI playback via javax.sound.midi and sampled audio via javax.sound.sampled.
 */
public class Manager {

    public static Player createPlayer(InputStream stream, String type) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            byte[] buf = new byte[4096];
            int r;
            while ((r = stream.read(buf)) != -1) {
                baos.write(buf, 0, r);
            }
            byte[] audioBytes = baos.toByteArray();
            System.out.println("[Audio] Manager.createPlayer: " + type + " (" + audioBytes.length + " bytes)");
            return new DesktopAudioPlayer(audioBytes, type);
        } catch (Exception e) {
            return new NullPlayer(type);
        }
    }

    public static Player createPlayer(String locator) {
        return new NullPlayer(locator);
    }

    public static String[] getSupportedContentTypes(String protocol) {
        return new String[]{"audio/midi", "audio/x-wav", "audio/amr", "audio/mpeg"};
    }

    public static String[] getSupportedProtocols(String contentType) {
        return new String[]{"device", "file", "http"};
    }

    private static class DesktopAudioPlayer implements Player, VolumeControl {
        private final byte[] data;
        private final String contentType;
        private int state = UNREALIZED;
        private int loopCount = 1;
        private int volumeLevel = 100;
        private boolean muted = false;

        private Sequencer midiSequencer;
        private Clip audioClip;

        DesktopAudioPlayer(byte[] data, String contentType) {
            this.data = data;
            this.contentType = contentType;
        }

        @Override
        public void realize() {
            if (state < REALIZED) {
                state = REALIZED;
            }
        }

        @Override
        public void prefetch() {
            realize();
            if (state < PREFETCHED) {
                try {
                    if ("audio/midi".equalsIgnoreCase(contentType) || (data.length > 4 && data[0] == 'M' && data[1] == 'T')) {
                        midiSequencer = MidiSystem.getSequencer();
                        if (midiSequencer != null) {
                            midiSequencer.open();
                            midiSequencer.setSequence(new ByteArrayInputStream(data));
                        }
                    } else {
                        try (AudioInputStream ais = AudioSystem.getAudioInputStream(new ByteArrayInputStream(data))) {
                            audioClip = AudioSystem.getClip();
                            audioClip.open(ais);
                        }
                    }
                } catch (Exception ignored) {
                }
                state = PREFETCHED;
            }
        }

        @Override
        public void start() {
            prefetch();
            state = STARTED;
            try {
                if (midiSequencer != null && midiSequencer.isOpen()) {
                    midiSequencer.setLoopCount(loopCount == -1 ? Sequencer.LOOP_CONTINUOUSLY : loopCount - 1);
                    midiSequencer.start();
                } else if (audioClip != null && audioClip.isOpen()) {
                    audioClip.setFramePosition(0);
                    if (loopCount == -1) {
                        audioClip.loop(Clip.LOOP_CONTINUOUSLY);
                    } else {
                        audioClip.start();
                    }
                }
            } catch (Exception ignored) {
            }
        }

        @Override
        public void stop() {
            try {
                if (midiSequencer != null && midiSequencer.isOpen()) {
                    midiSequencer.stop();
                }
                if (audioClip != null && audioClip.isOpen()) {
                    audioClip.stop();
                }
            } catch (Exception ignored) {
            }
            if (state == STARTED) {
                state = PREFETCHED;
            }
        }

        @Override
        public void deallocate() {
            stop();
            state = UNREALIZED;
        }

        @Override
        public void close() {
            stop();
            try {
                if (midiSequencer != null) {
                    midiSequencer.close();
                    midiSequencer = null;
                }
                if (audioClip != null) {
                    audioClip.close();
                    audioClip = null;
                }
            } catch (Exception ignored) {
            }
            state = CLOSED;
        }

        @Override
        public int getState() {
            return state;
        }

        @Override
        public void setLoopCount(int count) {
            this.loopCount = count;
        }

        @Override
        public long setMediaTime(long now) {
            try {
                if (midiSequencer != null && midiSequencer.isOpen()) {
                    midiSequencer.setMicrosecondPosition(now);
                }
                if (audioClip != null && audioClip.isOpen()) {
                    audioClip.setMicrosecondPosition(now);
                }
            } catch (Exception ignored) {
            }
            return now;
        }

        @Override
        public long getMediaTime() {
            if (midiSequencer != null && midiSequencer.isOpen()) {
                return midiSequencer.getMicrosecondPosition();
            }
            if (audioClip != null && audioClip.isOpen()) {
                return audioClip.getMicrosecondPosition();
            }
            return 0L;
        }

        @Override
        public long getDuration() {
            return TIME_UNKNOWN;
        }

        @Override
        public String getContentType() {
            return contentType;
        }

        @Override
        public Control getControl(String controlType) {
            if ("VolumeControl".equalsIgnoreCase(controlType) || controlType.endsWith("VolumeControl")) {
                return this;
            }
            return null;
        }

        @Override
        public Control[] getControls() {
            return new Control[] { this };
        }

        @Override
        public int setLevel(int level) {
            this.volumeLevel = Math.max(0, Math.min(100, level));
            if (audioClip != null && audioClip.isControlSupported(FloatControl.Type.MASTER_GAIN)) {
                FloatControl gain = (FloatControl) audioClip.getControl(FloatControl.Type.MASTER_GAIN);
                float dB = (float) (Math.log10(Math.max(1, volumeLevel) / 100.0) * 20.0);
                gain.setValue(Math.max(gain.getMinimum(), Math.min(gain.getMaximum(), dB)));
            }
            return volumeLevel;
        }

        @Override
        public int getLevel() {
            return volumeLevel;
        }

        @Override
        public void setMute(boolean mute) {
            this.muted = mute;
        }

        @Override
        public boolean isMuted() {
            return muted;
        }
    }

    private static class NullPlayer implements Player, VolumeControl {
        private final String type;
        private int state = UNREALIZED;

        NullPlayer(String type) {
            this.type = type;
        }

        @Override public void realize() { state = REALIZED; }
        @Override public void prefetch() { state = PREFETCHED; }
        @Override public void start() { state = STARTED; }
        @Override public void stop() { if (state == STARTED) state = PREFETCHED; }
        @Override public void deallocate() { state = UNREALIZED; }
        @Override public void close() { state = CLOSED; }
        @Override public int getState() { return state; }
        @Override public void setLoopCount(int count) {}
        @Override public long setMediaTime(long now) { return now; }
        @Override public long getMediaTime() { return 0L; }
        @Override public long getDuration() { return TIME_UNKNOWN; }
        @Override public String getContentType() { return type; }
        @Override public Control getControl(String controlType) {
            if ("VolumeControl".equalsIgnoreCase(controlType)) return this;
            return null;
        }
        @Override public Control[] getControls() { return new Control[] { this }; }
        @Override public int setLevel(int level) { return level; }
        @Override public int getLevel() { return 100; }
        @Override public void setMute(boolean mute) {}
        @Override public boolean isMuted() { return false; }
    }
}
