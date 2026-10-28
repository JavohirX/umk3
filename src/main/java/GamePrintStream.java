import java.io.OutputStream;
import java.io.PrintStream;

/**
 * Compatibility stream wrapper redirecting standard game logging output.
 */
public class GamePrintStream extends PrintStream {
    public GamePrintStream(OutputStream out) {
        super(out, true);
    }
}
