import javax.microedition.lcdui.Canvas;
import javax.microedition.lcdui.Graphics;

/**
 * Keypad and keyboard input processor. Converts raw key codes into combat action
 * bitmasks (Up, Down, Left, Right, High Punch, Low Punch, High Kick, Low Kick, Block, Run).
 */
public final class InputManager extends Canvas {
   public int pressedKeyBitmask;
   public int releasedKeyBitmask;
   public int repeatedKeyBitmask;
   public int activeKeyBitmask;
   public GraphicsAdapter graphicsAdapter = new GraphicsAdapter();

   public final int getWidth() {
      return CoreEngine.exec_a_arr_int_to_int(CoreEngine.exec_c_to_arr_int());
   }

   public final int getHeight() {
      return CoreEngine.exec_b_arr_int_to_int(CoreEngine.exec_c_to_arr_int());
   }

   public final void keyPressed(int var1) {
      this.handleKeyEvent(CoreEngine.exec_c_int_to_int(var1), true);
   }

   public final void keyReleased(int var1) {
      this.handleKeyEvent(CoreEngine.exec_c_int_to_int(var1), false);
   }

   public final void keyRepeated(int var1) {
   }

   public InputManager() {
      CoreEngine.exec_b_to_contextservicenode();
      CoreEngine.exec_b_to_contextservicenode();
   }

   public final void paint(Graphics var1) {
   }

   public final void handleKeyEvent(int var1, boolean var2) {
      if (this.activeKeyBitmask <= 0) {
         int var3;
         switch (var1) {
            case 1:
               var3 = 1;
               break;
            case 2:
               var3 = 2;
               break;
            case 3:
               var3 = 4;
               break;
            case 4:
               var3 = 8;
               break;
            case 5:
            case 6:
            default:
               var3 = 0;
               break;
            case 7:
               var3 = 16;
               break;
            case 8:
               var3 = 1048576;
               break;
            case 9:
               var3 = 524288;
               break;
            case 10:
               var3 = 8388608;
               break;
            case 11:
               var3 = 2097152;
               break;
            case 12:
               var3 = 4194304;
               break;
            case 13:
               var3 = 32;
               break;
            case 14:
               var3 = 64;
               break;
            case 15:
               var3 = 262144;
               break;
            case 16:
               var3 = 131072;
               break;
            case 17:
               var3 = 128;
               break;
            case 18:
               var3 = 256;
               break;
            case 19:
               var3 = 512;
               break;
            case 20:
               var3 = 1024;
               break;
            case 21:
               var3 = 2048;
               break;
            case 22:
               var3 = 4096;
               break;
            case 23:
               var3 = 8192;
               break;
            case 24:
               var3 = 16384;
               break;
            case 25:
               var3 = 32768;
               break;
            case 26:
               var3 = 65536;
         }

         if (var3 == 0) {
            if (CoreEngine.exec_d_int_to_int(var1) != 0) {
               CoreEngine.exec_a_to_long();
               if (var2) {
                  return;
               }

               return;
            }
         } else {
            CoreEngine.exec_a_to_long();
            GameFlowController var4 = CoreEngine.exec_a_to_rootgamestate().flowController;
            if (var2) {
               this.releasedKeyBitmask |= var3;
               this.pressedKeyBitmask |= var3;
               var4.handleKeyPress(var3);
               return;
            }

            this.repeatedKeyBitmask |= var3;
            this.pressedKeyBitmask &= ~var3;
            var4.handleKeyRelease(var3);
         }
      }
   }
}
