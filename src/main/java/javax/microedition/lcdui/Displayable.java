package javax.microedition.lcdui;

/**
 * Desktop compatibility implementation of LCDUI Displayable.
 */
public abstract class Displayable {
    protected int width = 352;
    protected int height = 416;
    protected boolean shown = false;

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public boolean isShown() {
        return shown;
    }

    protected void showNotify() {
        shown = true;
    }

    protected void hideNotify() {
        shown = false;
    }

    protected void sizeChanged(int w, int h) {
        this.width = w;
        this.height = h;
    }
}
