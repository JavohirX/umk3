package javax.microedition.midlet;

import java.util.HashMap;
import java.util.Map;

/**
 * Desktop compatibility implementation of MIDlet.
 */
public abstract class MIDlet {
    private static final Map<String, String> APP_PROPERTIES = new HashMap<>();

    static {
        APP_PROPERTIES.put("Blood", "red");
        APP_PROPERTIES.put("Fatality", "on");
        APP_PROPERTIES.put("Cheats", "on");
        APP_PROPERTIES.put("MIDlet-Version", "1.0.0");
        APP_PROPERTIES.put("MIDlet-Name", "Ultimate Mortal Kombat 3");
        APP_PROPERTIES.put("MIDlet-Vendor", "EA Mobile");
    }

    public MIDlet() {
    }

    protected abstract void startApp();

    protected abstract void pauseApp();

    protected abstract void destroyApp(boolean unconditional);

    public final void notifyDestroyed() {
        System.exit(0);
    }

    public final void notifyPaused() {
    }

    public String getAppProperty(String key) {
        if (key == null) return null;
        return APP_PROPERTIES.get(key);
    }

    public static void setAppProperty(String key, String value) {
        if (key != null && value != null) {
            APP_PROPERTIES.put(key, value);
        }
    }

    public boolean platformRequest(String url) {
        try {
            java.awt.Desktop.getDesktop().browse(new java.net.URI(url));
            return true;
        } catch (Exception e) {
            System.out.println("platformRequest: " + url);
            return false;
        }
    }
}
