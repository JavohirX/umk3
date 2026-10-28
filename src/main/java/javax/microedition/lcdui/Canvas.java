package javax.microedition.lcdui;

/**
 * Desktop compatibility implementation of LCDUI Canvas.
 */
public abstract class Canvas extends Displayable {
    public static final int UP = 1;
    public static final int LEFT = 2;
    public static final int RIGHT = 5;
    public static final int DOWN = 6;
    public static final int FIRE = 8;
    public static final int GAME_A = 9;
    public static final int GAME_B = 10;
    public static final int GAME_C = 11;
    public static final int GAME_D = 12;

    public static final int KEY_NUM0 = 48;
    public static final int KEY_NUM1 = 49;
    public static final int KEY_NUM2 = 50;
    public static final int KEY_NUM3 = 51;
    public static final int KEY_NUM4 = 52;
    public static final int KEY_NUM5 = 53;
    public static final int KEY_NUM6 = 54;
    public static final int KEY_NUM7 = 55;
    public static final int KEY_NUM8 = 56;
    public static final int KEY_NUM9 = 57;
    public static final int KEY_STAR = 42;
    public static final int KEY_POUND = 35;

    public Canvas() {
    }

    public abstract void paint(Graphics g);

    public void repaint() {
        Display.repaint();
    }

    public void repaint(int x, int y, int width, int height) {
        Display.repaint();
    }

    public void serviceRepaints() {
        Display.serviceRepaints();
    }

    public void keyPressed(int keyCode) {
    }

    public void keyReleased(int keyCode) {
    }

    public void keyRepeated(int keyCode) {
    }

    public int getGameAction(int keyCode) {
        switch (keyCode) {
            case -1:
            case 38: // Up arrow
                return UP;
            case -2:
            case 40: // Down arrow
                return DOWN;
            case -3:
            case 37: // Left arrow
                return LEFT;
            case -4:
            case 39: // Right arrow
                return RIGHT;
            case -5:
            case 10: // Enter
            case 32: // Space
                return FIRE;
            default:
                return 0;
        }
    }

    public int getKeyCode(int gameAction) {
        switch (gameAction) {
            case UP: return -1;
            case DOWN: return -2;
            case LEFT: return -3;
            case RIGHT: return -4;
            case FIRE: return -5;
            default: return 0;
        }
    }

    public boolean isDoubleBuffered() {
        return true;
    }

    public boolean hasPointerEvents() {
        return false;
    }

    public void setFullScreenMode(boolean mode) {
    }
}
