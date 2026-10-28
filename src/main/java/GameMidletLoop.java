import javax.microedition.lcdui.Display;
import javax.microedition.midlet.MIDlet;

/**
 * Main MIDlet lifecycle and frame timing loop. Drives the fixed-timestep thread,
 * computes frame deltas, updates root game states, and triggers canvas repainting.
 */
public class GameMidletLoop extends MIDlet implements Runnable {
   public long lastFrameTimeMs = System.currentTimeMillis();
   public long targetFrameTimeMs = -1L;
   public long[] frameHistoryArray = new long[8];
   public int loopState;
   public volatile boolean isRunning;
   public boolean isPaused;
   public volatile boolean isInitialized;
   public boolean isBackgrounded;
   public boolean isTerminated;
   public String gameVersionString = "";
   public long val_long_c = System.currentTimeMillis();
   public volatile boolean isExitRequested;
   public boolean val_bool_g;
   public boolean val_bool_h;
   public Thread gameLoopThread;

   public GameMidletLoop() {
      this.isPaused = true;
      CoreEngine.val_gamemidletloop_a = this;
      CoreEngine.val_gamemidletloop_b = this;
   }

   public void startApp() {
      this.stopGameLoop();
   }

   public final void stopGameLoop() {
      if (this.targetFrameTimeMs != -1L) {
         this.lastFrameTimeMs = this.lastFrameTimeMs + (System.currentTimeMillis() - this.targetFrameTimeMs);
         this.targetFrameTimeMs = -1L;
      }

      if (this.gameLoopThread == null && this.isPaused) {
         this.gameLoopThread = new Thread(this);
         GlobalContext var1;
         var1 = new GlobalContext();
         CoreEngine.val_globalcontext_a = var1;
         var1.gameMidletLoop = this;
         CoreEngine.val_rendercontext_a = new RenderContext(CoreEngine.exec_b_to_arr_int());
         CoreEngine.val_scenebase_a = new RootGameState();
         this.gameLoopThread.start();
      } else {
         if (this.isInitialized || this.isRunning) {
            CoreEngine.exec_a_short_short_short_gamemidletloop_to_void((short)6, (short)0, (short)0, this);
         }
      }
   }

   public void pauseApp() {
      CoreEngine.exec_a_gamemidletloop_to_void(this);
   }

   public void destroyApp(boolean var1) {
      if (!this.isExitRequested) {
         this.isExitRequested = true;
      }
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public void run() {
      CoreEngine.val_maincanvasbridge_a = new MainCanvasBridge();
      CoreEngine.isGlobalPaused = false;
      Display.getDisplay(this).setCurrent(CoreEngine.val_maincanvasbridge_a);
      this.isPaused = false;

      while (!this.isExitRequested) {
         long var1 = System.currentTimeMillis();
         Object engineLock = CoreEngine.val_object_a;
         synchronized (CoreEngine.val_object_a){} // $VF: monitorenter 

         try {
            while (this.loopState > 0) {
               long[] var9 = this.frameHistoryArray;
               synchronized (this.frameHistoryArray){} // $VF: monitorenter 

               short var3;
               int var4;
               try {
                  long[] var37 = this.frameHistoryArray;
                  var3 = (short)(this.frameHistoryArray[0] >>> 48);
                  var4 = (int)((var37[0] & 281474976645120L) >>> 16);
                  if (this.loopState > 1) {
                     for (int var5 = 0; var5 < 7; var5++) {
                        var37[var5] = var37[var5 + 1];
                     }
                  }

                  this.loopState--;
                  // $VF: monitorexit
               } catch (Throwable var20) {
                  Throwable var36 = var20;

                  while (true) {
                     try {
                        // $VF: monitorexit
                        throw var36;
                     } catch (Throwable var18) {
                        var36 = var18;
                     }
                  }
               }

               switch (var3) {
                  case 1:
                     CoreEngine.exec_f_int_to_void(var4);
                     break;
                  case 2:
                     CoreEngine.exec_i_int_to_void(var4);
                     break;
                  case 3:
                     if (CoreEngine.val_scenebase_a.sceneStateId != var4) {
                        CoreEngine.exec_a_int_bool_scenebase_to_void(var4, false, CoreEngine.val_scenebase_a);
                     }
                     break;
                  case 4:
                     CoreEngine.exec_a_int_bool_scenebase_to_void(var4, true, CoreEngine.val_scenebase_a);
                     break;
                  case 5:
                     this.isInitialized = false;
                     this.isRunning = true;
                     SceneBase var42 = CoreEngine.val_globalcontext_a.currentScene;
                     if (CoreEngine.val_globalcontext_a.currentScene.isSceneVisible) {
                        var42.isSceneVisible = false;
                        var42.isScenePaused = true;

                        for (int var33 = 0; var33 < 33; var33++) {
                           CoreEngine.exec_a_int_bool_scenebase_to_void(var42.sceneExtraShorts[var33], true, var42);
                        }
                     }

                     var42 = CoreEngine.val_globalcontext_a.currentScene;
                     if (!CoreEngine.val_globalcontext_a.currentScene.isSceneActive) {
                        var42.isSceneActive = true;
                        var42.sceneTimers[1] = System.currentTimeMillis();
                        RootGameState root42 = (RootGameState)var42;
                         if (!root42.isLoaded) {
                           root42.flowController.pauseFlow();
                           root42.isLoaded = true;
                        }
                     }
                     break;
                  case 6:
                     this.val_long_c = System.currentTimeMillis();
                     if (this.isRunning) {
                        SceneBase var39 = CoreEngine.val_globalcontext_a.currentScene;
                        if (!CoreEngine.val_globalcontext_a.currentScene.isSceneVisible) {
                           var39.isSceneVisible = true;
                           var39.isScenePaused = true;
                        }

                        var39 = CoreEngine.val_globalcontext_a.currentScene;
                        if (CoreEngine.val_globalcontext_a.currentScene.isSceneActive) {
                           var39.isSceneActive = false;
                           long[] var10000 = var39.sceneTimers;
                           long var6 = var39.sceneTimers[0] + (System.currentTimeMillis() - var39.sceneTimers[1]);
                           var10000[0] = var6;
                           var39.sceneTimers[1] = 0L;
                           RootGameState root39 = (RootGameState)var39;
                            if (root39.isLoaded) {
                               root39.gameTimer = root39.gameTimer + (System.currentTimeMillis() - root39.lastUpdateTimestamp);
                               InputManager var32;
                               (var32 = CoreEngine.exec_a_to_rootgamestate().inputManager).activeKeyBitmask = 0;
                               var32.pressedKeyBitmask = 0;
                               var32.releasedKeyBitmask = 0;
                               var32.repeatedKeyBitmask = 0;
                               root39.isLoaded = false;
                               root39.flowController.resumeFlow();
                            }
                        }

                        CoreEngine.getGlobalAudioContext();
                        CoreEngine.exec_a_bool_to_void(this.isBackgrounded);

                        try {
                           Thread.sleep(1L);
                        } catch (InterruptedException var15) {
                        }

                        this.isRunning = false;
                        this.val_bool_g = true;
                     }
                     break;
                  case 7:
                     CoreEngine.isGlobalPaused = true;
                     CoreEngine.val_globalcontext_a.currentScene.isScenePaused = true;
                     break;
                  case 8:
                     SceneBase var38 = CoreEngine.val_globalcontext_a.currentScene;
                     if (!CoreEngine.val_globalcontext_a.currentScene.isTransitioning) {
                        var38.isTransitioning = true;
                     }

                     CoreEngine.exec_b_gamemidletloop_to_void(CoreEngine.val_gamemidletloop_a);
               }
            }

            // $VF: monitorexit
         } catch (Throwable var21) {
            Throwable var10 = var21;

            while (true) {
               try {
                  // $VF: monitorexit
                  throw var10;
               } catch (Throwable var17) {
                  var10 = var17;
               }
            }
         }

         if (this.isRunning) {
            if (this.val_bool_h && CoreEngine.val_maincanvasbridge_a.isShown()) {
               this.val_bool_h = false;
               this.stopGameLoop();
            }

            try {
               Thread.sleep(100L);
            } catch (Exception var14) {
            }
         } else {
            Object var45 = CoreEngine.val_object_a;
            synchronized (CoreEngine.val_object_a){} // $VF: monitorenter 

            try {
               MainCanvasBridge var35 = CoreEngine.val_maincanvasbridge_a;
               int frameDelta;
               if (this.targetFrameTimeMs == -1L) {
                  frameDelta = (int)(System.currentTimeMillis() - this.lastFrameTimeMs);
               } else {
                  frameDelta = (int)(this.targetFrameTimeMs - this.lastFrameTimeMs);
               }

               int var25 = frameDelta;
               frameDelta -= var35.canvasWidth;
               SceneBase var23 = CoreEngine.val_globalcontext_a.currentScene;
               int var22 = var23.sceneDuration;
               if (CoreEngine.val_globalcontext_a.currentScene.sceneStateId != 0) {
                  if (var22 == Integer.MAX_VALUE) {
                     var22 = -350;
                  } else if ((var22 += frameDelta) > 150) {
                     var22 = 0;
                  }
               }

               var23.sceneDuration = var22;
               RootGameState rootState = (RootGameState)var23;
               InputManager var24 = rootState.inputManager;
               long var26;
               rootState.lastUpdateTimestamp = var26 = System.currentTimeMillis();
               rootState.flowController.updateFlow(var26 - rootState.gameTimer);
               Thread.yield();

               try {
                  Thread.sleep(10L);
               } catch (InterruptedException var13) {
               }

               rootState.isScenePaused = true;
               if (var24.activeKeyBitmask > 0) {
                  var24.activeKeyBitmask--;
               }

               var24.releasedKeyBitmask = 0;
               var24.repeatedKeyBitmask = 0;
               var35.canvasWidth = var25;
               CoreEngine.isGlobalPaused = true;
               // $VF: monitorexit
            } catch (Throwable var19) {
               Throwable var34 = var19;

               while (true) {
                  try {
                     // $VF: monitorexit
                     throw var34;
                  } catch (Throwable var16) {
                     var34 = var16;
                  }
               }
            }

            if (this.isExitRequested) {
               return;
            }

            if (var1 - this.val_long_c < 2000L) {
               CoreEngine.isGlobalPaused = true;
               CoreEngine.val_globalcontext_a.currentScene.isScenePaused = true;
            }

            if (CoreEngine.isGlobalPaused && CoreEngine.val_globalcontext_a.currentScene.isScenePaused) {
               CoreEngine.val_maincanvasbridge_a.repaint();

               try {
                  CoreEngine.val_maincanvasbridge_a.serviceRepaints();
               } catch (Exception var12) {
               }
            }

            long var27 = (int)(System.currentTimeMillis() - var1);
            var27 = CoreEngine.frameTimestampMs - var27;
            Thread.yield();
            if (var27 < 10L) {
               var27 = 10L;
            }

            try {
               if (var27 < 1L) {
                  var27 = 1L;
               }

               Thread.sleep(var27);
            } catch (InterruptedException var11) {
            }
         }
      }
   }
}
