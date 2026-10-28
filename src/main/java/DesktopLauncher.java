import java.io.FileOutputStream;
import java.io.OutputStream;
import java.io.PrintStream;

/**
 * Desktop entry point providing Java 22 Swing/AWT desktop host window,
 * keyboard event translation, scaling buffer, and MIDlet lifecycle dispatch.
 */
public class DesktopLauncher {
    public static void main(String[] args) {
        try {
            FileOutputStream fos = new FileOutputStream("launcher_log.txt", false);
            // Tee output to both console and file
            OutputStream tee = new OutputStream() {
                @Override
                public void write(int b) throws java.io.IOException {
                    fos.write(b);
                    System.err.write(b);
                }
                @Override
                public void write(byte[] b, int off, int len) throws java.io.IOException {
                    fos.write(b, off, len);
                    System.err.write(b, off, len);
                }
                @Override
                public void flush() throws java.io.IOException {
                    fos.flush();
                    System.err.flush();
                }
            };
            GamePrintStream gps = new GamePrintStream(tee);
            System.setOut(gps);
        } catch (Exception ignored) {}

        System.out.println("Starting Ultimate Mortal Kombat 3 Desktop...");
        Thread.setDefaultUncaughtExceptionHandler((t, e) -> {
            System.err.println("Uncaught exception in " + t + ":");
            e.printStackTrace();
        });
        try {
            Class<?> midletClass = Class.forName("com.ea.sdk.SDKMIDlet");
            Object midlet = midletClass.getDeclaredConstructor().newInstance();
            java.lang.reflect.Method startApp = midletClass.getMethod("startApp");
            System.out.println("Invoking startApp()...");
            startApp.invoke(midlet);
            System.out.println("startApp() invoked successfully!");

            if (args.length > 0 && "test".equals(args[0])) {
                new Thread(() -> {
                    try {
                        System.out.println("[Autopilot] Waiting 3s for language screen...");
                        Thread.sleep(3000);
                        System.out.println("[Autopilot] Pressing FIRE to select English...");
                        javax.microedition.lcdui.Display.postKey(-5);
                        Thread.sleep(2500);
                        System.out.println("[Autopilot] Pressing FIRE to pass Title Screen...");
                        javax.microedition.lcdui.Display.postKey(-5);
                        Thread.sleep(2500);
                        System.out.println("[Autopilot] Pressing FIRE on Main Menu...");
                        javax.microedition.lcdui.Display.postKey(-5);
                        Thread.sleep(2500);
                        System.out.println("[Autopilot] Pressing FIRE on Tower / Mode select...");
                        javax.microedition.lcdui.Display.postKey(-5);
                        Thread.sleep(2500);
                        System.out.println("[Autopilot] Pressing FIRE on Fighter Select...");
                        javax.microedition.lcdui.Display.postKey(-5);
                        Thread.sleep(4000);
                        System.out.println("[Autopilot] Kombat Arena started!");
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }).start();
            }
        } catch (Throwable t) {
            t.printStackTrace();
        }
    }
}
