package javax.microedition.lcdui;

import java.awt.Color;
import java.awt.Dimension;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.image.BufferedImage;
import javax.microedition.midlet.MIDlet;
import javax.swing.JFrame;
import javax.swing.JPanel;
import javax.swing.SwingUtilities;
import javax.imageio.ImageIO;

/**
 * Desktop compatibility implementation of LCDUI Display.
 * Hosts the game in a clean, retro-scaled Swing window.
 */
public class Display {
    public static final int GAME_WIDTH = 352;
    public static final int GAME_HEIGHT = 416;
    public static final int SCALE = 2; // 2x retro pixel scale: 704x832

    private static Display instance;
    private static JFrame frame;
    private static GameCanvasPanel panel;
    private static Displayable currentDisplayable;
    private static BufferedImage offscreenBuffer;
    private static Graphics offscreenGraphics;

    public Display() {
    }

    public static synchronized Display getDisplay(MIDlet midlet) {
        if (instance == null) {
            instance = new Display();
            initWindow();
        }
        return instance;
    }

    private static void initWindow() {
        if (frame != null) return;
        offscreenBuffer = new BufferedImage(GAME_WIDTH, GAME_HEIGHT, BufferedImage.TYPE_INT_RGB);
        offscreenGraphics = new Graphics(offscreenBuffer);

        frame = new JFrame("Ultimate Mortal Kombat 3 (EA Mobile)");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        frame.setResizable(false);

        panel = new GameCanvasPanel();
        panel.setPreferredSize(new Dimension(GAME_WIDTH * SCALE, GAME_HEIGHT * SCALE));
        panel.setBackground(Color.BLACK);
        panel.setFocusable(true);

        panel.addKeyListener(new KeyAdapter() {
            @Override
            public void keyPressed(KeyEvent e) {
                int code = mapKeyCode(e);
                if (code != 0 && currentDisplayable instanceof Canvas) {
                    ((Canvas) currentDisplayable).keyPressed(code);
                }
            }

            @Override
            public void keyReleased(KeyEvent e) {
                int code = mapKeyCode(e);
                if (code != 0 && currentDisplayable instanceof Canvas) {
                    ((Canvas) currentDisplayable).keyReleased(code);
                }
            }
        });

        frame.getContentPane().add(panel);
        frame.pack();
        frame.setLocationRelativeTo(null);
        frame.setVisible(true);
        panel.requestFocusInWindow();
    }

    private static int mapKeyCode(KeyEvent e) {
        switch (e.getKeyCode()) {
            case KeyEvent.VK_UP:
                return -1; // UP
            case KeyEvent.VK_DOWN:
                return -2; // DOWN
            case KeyEvent.VK_LEFT:
                return -3; // LEFT
            case KeyEvent.VK_RIGHT:
                return -4; // RIGHT
            case KeyEvent.VK_ENTER:
            case KeyEvent.VK_SPACE:
                return -5; // FIRE / SELECT
            case KeyEvent.VK_Z:
                return 49; // '1' - High Punch
            case KeyEvent.VK_X:
                return 50; // '2' - High Kick
            case KeyEvent.VK_C:
                return 51; // '3' - Low Punch
            case KeyEvent.VK_V:
                return 52; // '4' - Low Kick
            case KeyEvent.VK_A:
                return 53; // '5' - Block
            case KeyEvent.VK_S:
                return 54; // '6' - Run
            case KeyEvent.VK_F1:
            case KeyEvent.VK_Q:
                return -6; // Softkey 1 (Options/Menu)
            case KeyEvent.VK_F2:
            case KeyEvent.VK_ESCAPE:
                return -7; // Softkey 2 (Back)
            case KeyEvent.VK_NUMPAD0:
            case KeyEvent.VK_0:
                return 48;
            case KeyEvent.VK_NUMPAD1:
            case KeyEvent.VK_1:
                return 49;
            case KeyEvent.VK_NUMPAD2:
            case KeyEvent.VK_2:
                return 50;
            case KeyEvent.VK_NUMPAD3:
            case KeyEvent.VK_3:
                return 51;
            case KeyEvent.VK_NUMPAD4:
            case KeyEvent.VK_4:
                return 52;
            case KeyEvent.VK_NUMPAD5:
            case KeyEvent.VK_5:
                return 53;
            case KeyEvent.VK_NUMPAD6:
            case KeyEvent.VK_6:
                return 54;
            case KeyEvent.VK_NUMPAD7:
            case KeyEvent.VK_7:
                return 55;
            case KeyEvent.VK_NUMPAD8:
            case KeyEvent.VK_8:
                return 56;
            case KeyEvent.VK_NUMPAD9:
            case KeyEvent.VK_9:
                return 57;
            case KeyEvent.VK_MULTIPLY:
                return 42; // '*'
            case KeyEvent.VK_NUMBER_SIGN:
                return 35; // '#'
            default:
                return 0;
        }
    }

    public void setCurrent(Displayable next) {
        if (currentDisplayable != null) {
            currentDisplayable.hideNotify();
        }
        currentDisplayable = next;
        if (currentDisplayable != null) {
            currentDisplayable.showNotify();
        }
        repaint();
    }

    public Displayable getCurrent() {
        return currentDisplayable;
    }

    public static void postKey(int code) {
        if (currentDisplayable instanceof Canvas) {
            Canvas c = (Canvas) currentDisplayable;
            c.keyPressed(code);
            try { Thread.sleep(60); } catch (Exception ignored) {}
            c.keyReleased(code);
        }
    }

    public static void repaint() {
        if (panel != null) {
            panel.repaint();
        }
    }

    public static void serviceRepaints() {
        if (panel != null && currentDisplayable instanceof Canvas) {
            renderFrame();
            panel.paintImmediately(0, 0, panel.getWidth(), panel.getHeight());
        }
    }

    private static int frameCounter = 0;

    private static void renderFrame() {
        if (offscreenBuffer == null || offscreenGraphics == null) return;
        if (currentDisplayable instanceof Canvas) {
            offscreenGraphics.setClip(0, 0, GAME_WIDTH, GAME_HEIGHT);
            ((Canvas) currentDisplayable).paint(offscreenGraphics);
            frameCounter++;
            if (frameCounter % 30 == 0 || frameCounter == 5) {
                try {
                    ImageIO.write(offscreenBuffer, "png", new java.io.File("game_screen.png"));
                } catch (Exception ignored) {}
            }
        }
    }

    public boolean vibrate(int duration) {
        return true;
    }

    private static class GameCanvasPanel extends JPanel {
        @Override
        protected void paintComponent(java.awt.Graphics g) {
            super.paintComponent(g);
            renderFrame();
            if (offscreenBuffer != null) {
                Graphics2D g2d = (Graphics2D) g;
                g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_NEAREST_NEIGHBOR);
                g2d.drawImage(offscreenBuffer, 0, 0, GAME_WIDTH * SCALE, GAME_HEIGHT * SCALE, null);
            }
        }
    }
}
