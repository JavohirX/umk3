/**
 * High-level game flow controller. Coordinates scene transitions across the title screen,
 * main menu, difficulty select, warrior ladder, match rounds, and game over screens.
 */
public class GameFlowController {
      /**
    * Initializes game flow, audio, screen dimensions, cheats, and blood mode.
    * Called once at game startup.
    */
   public void initFlow() {
      try {
         CoreEngine.exec_a_arr_string_arr_int_arr_string_to_void(CoreEngine.val_arr_string_a, CoreEngine.val_arr_int_e, CoreEngine.val_arr_string_b);
         CoreEngine.val_int_p = CoreEngine.readIntFromBytes(CoreEngine.loadResourceBytesByName("/hdr"));
         CoreEngine.exec_c_audioplaybackcontext_to_void((CoreEngine.val_audiomanager_a = CoreEngine.exec_a_to_audiomanager()).playbackContext);
         CoreEngine.val_bool_b = true;
         CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth();
         CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight();
         CoreEngine.exec_b_int_int_to_void(0, 0);
         CoreEngine.exec_c_to_bool();
         int var2;
         if ((var2 = CoreEngine.exec_b_int_to_int(CoreEngine.val_int_g)) >= 0) {
            CoreEngine.exec_h_int_to_void(var2);
            CoreEngine.val_bool_f = true;
         } else {
            CoreEngine.exec_h_int_to_void(-1 - var2);
            CoreEngine.val_bool_f = false;
         }

         CoreEngine.setGameState(0);
         String var3;
         if ((var3 = CoreEngine.exec_b_string_to_string("Blood")) != null) {
            if (var3.equals("off")) {
               CoreEngine.val_bool_i = false;
            } else if (var3.equals("red")) {
               CoreEngine.val_bool_i = true;
               CoreEngine.val_bool_j = true;
            } else if (var3.equals("green")) {
               CoreEngine.val_bool_i = true;
               CoreEngine.val_bool_j = false;
            }
         }

         if (!CoreEngine.val_bool_i) {
            CoreEngine.val_bool_g = false;
         } else {
            String var4;
            if ((var4 = CoreEngine.exec_b_string_to_string("Fatality")) != null) {
               CoreEngine.val_bool_g = var4.equals("on");
            }
         }

         if (CoreEngine.exec_b_string_to_string("Cheats") != null && CoreEngine.exec_b_string_to_string("Cheats").equals("on")) {
            CoreEngine.val_bool_h = true;
         }

         CoreEngine.val_string_a = CoreEngine.exec_b_string_to_string("MIDlet-Version");
         byte[] var5 = CoreEngine.exec_a_int_to_arr_byte(11);
         CoreEngine.val_arr_short_a = (short[])((Object[])CoreEngine.exec_a_spriteimage_arr_byte_to_object(
            CoreEngine.exec_a_int_to_spriteimage(ResourceSlotTable.val_arr_arr_int_a[ResourceSlotTable.val_arr_byte_a[4]][2]), var5
         ))[2];
      } catch (Exception var1) {
      }
   }

      /**
    * Resumes the game when returning from pause or background.
    * Restores audio and resets menu/match clocks.
    */
   public void resumeFlow() {
      CoreEngine.exec_m_to_void();
      if (CoreEngine.val_int_h == 11) {
         CoreEngine.exec_k_to_void();
         CoreEngine.exec_j_to_void();
      }

      if (CoreEngine.val_int_q != 1 && CoreEngine.val_int_q != 2) {
         CoreEngine.exec_n_to_void();
         CoreEngine.exec_o_to_void();
      } else {
         CoreEngine.exec_l_to_void();
         CoreEngine.exec_g_to_void();
         CoreEngine.val_int_q = 0;
      }
   }

      /**
    * Pauses the game, muting active audio and locking inputs.
    */
   public void pauseFlow() {
      CoreEngine.exec_m_to_void();
      if (CoreEngine.val_int_h == 11) {
         CoreEngine.exec_k_to_void();
         CoreEngine.exec_j_to_void();
      }

      CoreEngine.exec_n_to_void();
   }

   public void updateFlow(long var1) {
      CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth();
      if ((CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight()) >= CoreEngine.val_int_n) {
         CoreEngine.val_int_f = CoreEngine.val_int_e = (int)(var1 - CoreEngine.val_long_a);
         if (CoreEngine.val_int_e > 125) {
            CoreEngine.val_int_e = 125;
         }

         CoreEngine.val_long_a = var1;
         CoreEngine.exec_h_to_void();
         CoreEngine.val_int_i = CoreEngine.val_int_i + CoreEngine.val_int_e;
         CoreEngine.exec_e_to_void();
         switch (CoreEngine.val_int_h) {
            case 0:
               CoreEngine.val_long_a = var1;
               CoreEngine.setGameState(1);
               return;
            case 1:
               if (CoreEngine.val_int_i > 3000) {
                  CoreEngine.setGameState(2);
                  return;
               }
               break;
            case 2:
               if (CoreEngine.val_int_i > 2000) {
                  CoreEngine.setGameState(3);
                  return;
               }
               break;
            case 3:
               if (CoreEngine.val_int_i > 2000) {
                  if (CoreEngine.val_bool_f) {
                     CoreEngine.setGameState(5);
                     return;
                  }

                  CoreEngine.setGameState(4);
                  return;
               }
               break;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
               CoreEngine.initGameState();
               return;
            case 9:
               if (CoreEngine.val_bool_c) {
                  boolean[] var3 = CoreEngine.val_arr_bool_a;
                  boolean var5;
                  if (!CoreEngine.val_marketpanelcontroller_a.isAvailable()) {
                     var5 = true;
                  } else {
                     var5 = false;
                  }

                  var3[20] = var5;
                  CoreEngine.exec_c_int_to_void(0);
                  CoreEngine.val_bool_c = false;
               }

               CoreEngine.initGameState();
               return;
            case 10:
               if (!CoreEngine.val_marketpanelcontroller_a.val_bool_a) {
                  CoreEngine.setGameState(9);
                  CoreEngine.exec_e_int_to_void(CoreEngine.exec_e_int_to_int(20));
                  return;
               }

               MarketPanelController var4 = CoreEngine.val_marketpanelcontroller_a;
               switch (CoreEngine.val_marketpanelcontroller_a.val_int_h) {
                  case 0:
                     if ((var4.val_int_f & 2052) != 0) {
                        var4.val_int_g--;
                        if (var4.val_int_g < 0) {
                           var4.val_int_g = var4.val_arr_int_a.length - 1;
                        }

                        var4.selectIndex(var4.val_int_g);
                     } else if ((var4.val_int_f & 8200) != 0) {
                        var4.val_int_g++;
                        var4.val_int_g = var4.val_int_g % var4.val_arr_int_a.length;
                        var4.selectIndex(var4.val_int_g);
                     } else if (((var4.val_int_f & 513) != 0 || (var4.val_int_f & 32770) != 0) && var4.val_bool_c && var4.val_bool_d) {
                        if (var4.val_int_m == 1) {
                           var4.val_int_m = 0;
                        } else {
                           var4.val_int_m = 1;
                        }
                     } else if ((var4.val_int_f & 524352) != 0) {
                        var4.val_bool_a = false;
                        var4.cleanupMarket();
                     } else if ((var4.val_int_f & 4144) != 0) {
                        if (var4.val_int_m == 0) {
                           var4.val_string_a = var4.val_arr_string_b[var4.val_int_g];
                           var4.val_int_i = var4.val_int_h;
                           var4.showError();
                        } else if (var4.val_int_m == 1) {
                           if (var4.val_int_e != 1
                              && (
                                 var4.val_int_e != 3
                                    || var4.val_arr_string_c[var4.val_int_g] != null && var4.val_arr_string_c[var4.val_int_g].compareTo("") != 0
                              )) {
                              var4.val_string_a = var4.val_arr_string_c[var4.val_int_g];
                              var4.val_int_i = var4.val_int_h;
                              var4.showError();
                           } else {
                              var4.val_encodedtextbuffer_e = null;
                              var4.val_encodedtextbuffer_f = var4.val_arr_encodedtextbuffer_a[6];
                              var4.val_int_i = var4.val_int_h;
                              var4.val_int_h = 2;
                           }
                        }
                     }
                     break;
                  case 1:
                     if ((var4.val_int_f & 524352) != 0) {
                        var4.val_encodedtextbuffer_e = var4.val_arr_encodedtextbuffer_a[5];
                        var4.val_encodedtextbuffer_f = var4.val_arr_encodedtextbuffer_a[6];
                        var4.val_int_h = var4.val_int_i;
                     } else if ((var4.val_int_f & 32) != 0) {
                        String var6 = var4.getMarketUrl(var4.val_string_a);
                        CoreEngine.exec_a_to_gameflowcontroller();
                        CoreEngine.exec_a_tokenstring_to_bool(
                           CoreEngine.exec_a_arr_short_to_tokenstring(
                              CoreEngine.exec_a_tokenstring_to_arr_short(CoreEngine.exec_a_string_to_tokenstring(new String(var6)))
                           )
                        );
                     }
                     break;
                  case 2:
                     if ((var4.val_int_f & 524352) != 0) {
                        var4.val_encodedtextbuffer_e = var4.val_arr_encodedtextbuffer_a[5];
                        var4.val_encodedtextbuffer_f = var4.val_arr_encodedtextbuffer_a[6];
                        var4.val_int_h = var4.val_int_i;
                     }
                     break;
                  case 3:
                     label180: {
                        if ((var4.val_int_f & 2052) != 0 && var4.val_arr_int_a.length > 0) {
                           var4.val_int_g--;
                           if (var4.val_int_g < 0) {
                              var4.val_int_g = var4.val_arr_int_a.length - 1;
                           }

                           var4.selectIndex(var4.val_int_g);
                        } else if ((var4.val_int_f & 8200) != 0 && var4.val_arr_int_a.length > 0) {
                           var4.val_int_g++;
                           var4.val_int_g = var4.val_int_g % var4.val_arr_int_a.length;
                           var4.selectIndex(var4.val_int_g);
                        } else if ((var4.val_int_f & 524352) != 0) {
                           var4.val_bool_a = false;
                           var4.cleanupMarket();
                        } else if ((var4.val_int_f & 513) != 0) {
                           var4.val_int_j--;
                           var4.val_int_E = 0;
                           if (var4.val_int_j < 0) {
                              var4.val_int_j = var4.val_int_C - 1;
                           }

                           var4.loadMarketData();
                        } else if ((var4.val_int_f & 32770) != 0) {
                           var4.val_int_j++;
                           var4.val_int_j = var4.val_int_j % var4.val_int_C;
                           var4.val_int_E = 0;
                           var4.loadMarketData();
                        } else if ((var4.val_int_f & 4144) != 0) {
                           String var2 = null;
                           if (var4.val_int_e == 2 || var4.val_int_e == 3) {
                              var2 = CoreEngine.exec_a_string_to_string(
                                 "MG_BUYURI_" + var4.val_arr_arr_string_a[var4.val_arr_int_a[var4.val_int_g] & 2147483647][var4.val_int_j]
                              );
                           }

                           if (var2 == null) {
                              if (var4.val_int_e == 2) {
                                 break label180;
                              }

                              var4.val_encodedtextbuffer_e = null;
                              var4.val_encodedtextbuffer_f = var4.val_arr_encodedtextbuffer_a[6];
                              var4.val_int_i = var4.val_int_h;
                              var4.val_int_h = 2;
                           } else {
                              var4.val_string_a = var2;
                              var4.val_int_i = var4.val_int_h;
                              var4.showError();
                           }
                        }

                        if (var4.val_int_j < var4.val_int_k) {
                           var4.val_int_k = var4.val_int_j;
                           var4.val_int_E = 0;
                        }

                        if (var4.val_int_j >= var4.val_int_k + var4.val_int_l) {
                           var4.val_int_k = var4.val_int_j - var4.val_int_l + 1;
                           var4.val_int_E = 0;
                        }
                     }
               }

               var4.val_int_f = 0;
               return;
            case 11:
               CoreEngine.tickGameState();
         }
      }
   }

   public void renderFlow(GraphicsAdapter var1) {
      CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth();
      if ((CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight()) < CoreEngine.val_int_n) {
         if (!CoreEngine.val_bool_k) {
            this.pauseFlow();
         }

         CoreEngine.val_bool_k = true;
         CoreEngine.val_encodedtextbuffer_a = CoreEngine.exec_a_int_int_to_encodedtextbuffer(CoreEngine.val_int_g, 1);
         var1.setClip(0, 0, CoreEngine.val_int_n, CoreEngine.val_int_o);
         var1.setColor(0);
         var1.fillRect(0, 0, CoreEngine.val_int_n, CoreEngine.val_int_o);
         var1.setColor(-1);
         CoreEngine.exec_a_byte_to_void((byte)5);
         CoreEngine.exec_b_byte_to_void((byte)5);
         short[] var7;
         short[] var10000 = var7 = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(CoreEngine.val_encodedtextbuffer_a, CoreEngine.val_int_n - 10);
         CoreEngine.renderSecondary(var1);
         short var11 = var10000[0];
         CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
            CoreEngine.val_encodedtextbuffer_a, var7, 1, var11, CoreEngine.val_int_n >> 1, CoreEngine.val_int_o >> 1, 3
         );
      } else {
         if (CoreEngine.val_bool_k) {
            this.resumeFlow();
         }

         CoreEngine.val_bool_k = false;
         CoreEngine.val_graphicsadapter_a = var1;
         var1.setColor(0);
         var1.fillRect(0, 0, CoreEngine.val_int_n, CoreEngine.val_int_o);
         CoreEngine.renderSecondary(CoreEngine.val_graphicsadapter_a);
         boolean var8;
         if (!CoreEngine.val_bool_d) {
            var8 = true;
         } else {
            var8 = false;
         }

         CoreEngine.val_bool_d = var8;
         if (var8) {
            boolean var9;
            if (!CoreEngine.val_bool_e) {
               var9 = true;
            } else {
               var9 = false;
            }

            CoreEngine.val_bool_e = var9;
         }

         switch (CoreEngine.val_int_h) {
            case 0:
               return;
            case 1:
               CoreEngine.val_spritepartsequence_c
                  .drawSequence(CoreEngine.val_int_l, CoreEngine.val_animationset_c, CoreEngine.val_int_n / 2, CoreEngine.val_int_o / 2, 0);
               return;
            case 2:
               CoreEngine.val_spritepartsequence_d
                  .drawSequence(CoreEngine.val_int_m, CoreEngine.val_animationset_d, CoreEngine.val_int_n / 2, CoreEngine.val_int_o / 2, 0);
               return;
            case 3:
               CoreEngine.val_spritepartsequence_a
                  .drawSequence(CoreEngine.val_int_j, CoreEngine.val_animationset_a, CoreEngine.val_int_n / 2, CoreEngine.val_int_o / 2, 0);
               CoreEngine.val_spritepartsequence_b
                  .drawSequence(CoreEngine.val_int_k, CoreEngine.val_animationset_b, CoreEngine.val_int_n / 2, CoreEngine.val_int_o / 2, 0);
               return;
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
               CoreEngine.tickSubState();
               CoreEngine.exec_i_to_void();
               return;
            case 9:
               CoreEngine.tickSubState();
               CoreEngine.exec_i_to_void();
               return;
            case 10:
               if (CoreEngine.val_marketpanelcontroller_a.val_bool_a) {
                  GraphicsAdapter var2 = CoreEngine.val_graphicsadapter_a;
                  MarketPanelController var10 = CoreEngine.val_marketpanelcontroller_a;
                  var2.setClip(0, 0, var10.val_int_d, var10.val_int_c);
                  var2.setColor(-1);
                  var2.fillRect(0, 0, var10.val_int_d, var10.val_int_c);
                  switch (var10.val_int_h) {
                     case 0:
                        var10.val_int_q--;
                        if (var10.val_int_q < 0) {
                           var10.val_int_q = 6;
                        }

                        if (var10.val_bool_e) {
                           var2.setColor(-16757361);
                           CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[4]);
                           var2.fillRect(0, 0, var10.val_int_d, var10.val_int_n);
                           CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_arr_encodedtextbuffer_a[9], var10.val_int_d >> 1, 1, 17);
                        }

                        if (var10.val_spriteimage_a != null) {
                           var2.drawImage(var10.val_spriteimage_a, var10.val_int_d >> 1, var10.val_int_r, 17);
                           if (var10.val_spriteimage_b != null) {
                              var2.drawImage(
                                 var10.val_spriteimage_b,
                                 (var10.val_int_d - var10.val_spriteimage_a.sourceImage.imageWidth >> 1) + var10.val_short_b,
                                 var10.val_int_r + var10.val_short_c,
                                 20
                              );
                           }

                           if (var10.val_arr_int_a.length > 1) {
                              var10.renderHeader(
                                 var2, (var10.val_int_d - var10.val_spriteimage_a.sourceImage.imageWidth >> 2) - (CoreEngine.val_byte_a >> 1), var10.val_int_s
                              );
                              var10.renderFooter(
                                 var2,
                                 var10.val_int_d - (var10.val_int_d - var10.val_spriteimage_a.sourceImage.imageWidth >> 2) + (CoreEngine.val_byte_a >> 1),
                                 var10.val_int_s
                              );
                           }

                           CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[0]);
                           CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
                              var10.val_encodedtextbuffer_b, var10.val_arr_short_h, 1, var10.val_arr_short_h[0], var10.val_int_d >> 1, var10.val_int_o, 17
                           );
                           CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
                              var10.val_encodedtextbuffer_a, var10.val_arr_short_g, 1, var10.val_arr_short_g[0], var10.val_int_d >> 1, var10.val_int_t, 17
                           );
                        } else {
                           CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[0]);
                           CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_encodedtextbuffer_b, var10.val_int_d >> 1, var10.val_int_r, 17);
                           CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
                              var10.val_encodedtextbuffer_a, var10.val_arr_short_g, 1, var10.val_arr_short_g[0], var10.val_int_d >> 1, var10.val_int_t, 17
                           );
                           if (var10.val_arr_int_a.length > 1) {
                              var10.renderHeader(var2, 1, var10.val_int_s);
                              var10.renderFooter(var2, var10.val_int_d - 1, var10.val_int_s);
                           }
                        }

                        if (var10.val_bool_c) {
                           int var15 = var10.val_int_u;
                           int var19 = var10.val_int_p;
                           EncodedTextBuffer var23 = var10.val_arr_encodedtextbuffer_a[10];
                           boolean var12;
                           if (var10.val_int_m == 0) {
                              var12 = true;
                           } else {
                              var12 = false;
                           }

                           var10.renderRow(var2, var15, var19, var23, var12);
                        }

                        if (var10.val_bool_d) {
                           int var24 = var10.val_int_v;
                           int var20 = var10.val_int_p;
                           EncodedTextBuffer var16 = var10.val_encodedtextbuffer_c;
                           boolean var13;
                           if (var10.val_int_m == 1) {
                              var13 = true;
                           } else {
                              var13 = false;
                           }

                           var10.renderRow(var2, var24, var20, var16, var13);
                        }
                        break;
                     case 1:
                        CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[0]);
                        CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
                           var10.val_arr_encodedtextbuffer_a[4],
                           var10.val_arr_short_f,
                           1,
                           var10.val_arr_short_f[0],
                           var10.val_int_d >> 1,
                           var10.val_int_c - var10.val_int_w >> 1,
                           3
                        );
                        break;
                     case 2:
                        CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[0]);
                        CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
                           var10.val_arr_encodedtextbuffer_a[0],
                           var10.val_arr_short_e,
                           1,
                           var10.val_arr_short_e[0],
                           var10.val_int_d >> 1,
                           var10.val_int_c - var10.val_int_w >> 1,
                           3
                        );
                        break;
                     case 3:
                        var10.val_int_q--;
                        if (var10.val_int_q < 0) {
                           var10.val_int_q = 6;
                        }

                        if (var10.val_bool_e) {
                           var2.setColor(-16757361);
                           var2.fillRect(0, 0, var10.val_int_d, var10.val_int_n);
                           CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[4]);
                           CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_encodedtextbuffer_d, var10.val_int_d >> 1, 1, 17);
                        }

                        int var6 = var10.val_int_z;
                        CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[1]);

                        for (int var5 = var10.val_int_k; var5 < var10.val_int_k + var10.val_int_l; var5++) {
                           if (var5 == var10.val_int_j) {
                              CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[2]);
                           }

                           int var4 = var10.val_int_D;
                           if (var10.val_arr_spriteimage_a[var5] != null) {
                              var4 = var10.val_arr_spriteimage_a[var5].sourceImage.imageWidth;
                              var2.drawImage(var10.val_arr_spriteimage_a[var5], var10.val_int_A, var6 + (var10.val_int_B >> 1), 6);
                           }

                           var4 = var10.val_int_A + var4 + 4;
                           int var3 = var6 + (var10.val_int_B >> 1) - (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int() >> 1);
                           var2.setClip(var4, var3, var10.val_int_d - var10.val_int_A - var4, CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int());
                           if (var5 == var10.val_int_j) {
                              CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(
                                 var10.val_arr_encodedtextbuffer_b[var5], var4 - (var10.val_int_E >> 1), var3, 20
                              );
                              var10.val_int_E++;
                              if (var4 - (var10.val_int_E >> 1) + CoreEngine.exec_a_encodedtextbuffer_to_int(var10.val_arr_encodedtextbuffer_b[var5])
                                 < var10.val_int_d - var10.val_int_A) {
                                 var10.val_int_E = 0;
                              }
                           } else {
                              CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_arr_encodedtextbuffer_b[var5], var4, var3, 20);
                           }

                           var2.setClip(0, 0, var10.val_int_d, var10.val_int_c);
                           var6 += var10.val_int_B;
                           if (var5 == var10.val_int_j) {
                              CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[1]);
                           }
                        }

                        if (var10.val_int_k > 0) {
                           var6 = var10.val_int_d >> 1;
                           int var17 = var10.val_int_y - (var10.val_int_q >> 1);
                           var2.setColor(-16757361);
                           var2.fillTriangle(
                              var6,
                              var17,
                              var6 - CoreEngine.val_byte_a,
                              var17 + CoreEngine.val_byte_a,
                              var6 + CoreEngine.val_byte_a,
                              var17 + CoreEngine.val_byte_a
                           );
                        }

                        if (var10.val_int_k + var10.val_int_l < var10.val_int_C) {
                           var6 = var10.val_int_d >> 1;
                           int var18 = var10.val_int_x - (6 - (var10.val_int_q >> 1));
                           var2.setColor(-16757361);
                           var2.fillTriangle(
                              var6,
                              var18,
                              var6 - CoreEngine.val_byte_a,
                              var18 - CoreEngine.val_byte_a,
                              var6 + CoreEngine.val_byte_a,
                              var18 - CoreEngine.val_byte_a
                           );
                        }

                        if (var10.val_arr_int_a.length > 1) {
                           var10.renderHeader(var2, var10.val_int_A - CoreEngine.val_byte_a >> 1, var10.val_int_c >> 1);
                           var10.renderFooter(var2, var10.val_int_d - (var10.val_int_A - CoreEngine.val_byte_a >> 1), var10.val_int_c >> 1);
                        }
                  }

                  if (var10.val_bool_b) {
                     CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[3]);
                     if (var10.val_encodedtextbuffer_e != null) {
                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(
                           var10.val_encodedtextbuffer_e, 2, var10.val_int_c + CoreEngine.exec_d_to_int() - 2, 36
                        );
                     }

                     if (var10.val_encodedtextbuffer_f != null) {
                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(
                           var10.val_encodedtextbuffer_f, var10.val_int_d - 2, var10.val_int_c + CoreEngine.exec_d_to_int() - 2, 40
                        );
                     }
                  }

                  return;
               }
               break;
            case 11:
               CoreEngine.renderScene(CoreEngine.val_graphicsadapter_a);
               CoreEngine.exec_i_to_void();
         }
      }
   }

   public void handleKeyPress(int var1) {
      CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth();
      if ((CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight()) >= CoreEngine.val_int_n) {
         CoreEngine.exec_g_int_to_void(var1);
         if (CoreEngine.val_int_h == 9 || CoreEngine.val_int_h == 10) {
            boolean var10000;
            label85: {
               int var2 = var1;
               MarketPanelController var5 = CoreEngine.val_marketpanelcontroller_a;
               if (CoreEngine.val_marketpanelcontroller_a.val_bool_a) {
                  var5.val_int_f |= var2;
               } else {
                  byte var7;
                  int var3 = 0;

                  while (true) {
                     if (var3 >= 10) {
                        var7 = -1;
                        break;
                     }

                     if ((var2 & 128 << var3) != 0) {
                        var7 = (byte)var3;
                        break;
                     }

                     var3++;
                  }

                  byte var6 = var7;
                  if (var7 == -1) {
                     var5.val_short_a = 0;
                     var5.val_int_a = 0;
                  } else if (var5.val_int_a == 0) {
                     var5.val_short_a = (short)(var5.val_short_a << 4);
                     var5.val_short_a = (short)(var5.val_short_a | var7 + 1);
                     if (var5.val_short_a == -26472) {
                        var5.val_int_b = 3;
                        var5.val_int_a = 1;
                     } else {
                        if (var5.val_short_a == -26461) {
                           CoreEngine.val_arr_byte_a[4] = 1;
                           CoreEngine.val_bool_m = true;
                           var5.val_short_a = 0;
                           var10000 = true;
                           break label85;
                        }

                        if (var5.val_short_a == -26475) {
                           var5.val_int_b = 0;
                           var5.val_int_a = 1;
                        } else if (var5.val_short_a == -26473) {
                           var5.val_int_b = 1;
                           var5.val_int_a = 1;
                        } else if (var5.val_short_a == -26476) {
                           var5.val_int_b = 2;
                           var5.val_int_a = 1;
                        }
                     }
                  } else if (var5.val_int_a == 1) {
                     boolean var4 = false;
                     if (var5.val_int_b == 0) {
                        if (var7 >= 0 && var7 <= 3) {
                           var4 = false;
                        } else {
                           var4 = true;
                        }
                     } else if (var5.val_int_b == 2 || var5.val_int_b == 1) {
                        if (var6 >= 0 && var6 <= 2) {
                           var4 = false;
                        } else {
                           var4 = true;
                        }
                     }

                     if (!var4) {
                        CoreEngine.val_arr_byte_a[var5.val_int_b] = var6;
                        CoreEngine.val_bool_m = true;
                     }

                     var5.val_int_a = 0;
                     var5.val_short_a = 0;
                     var10000 = true;
                     break label85;
                  }
               }

               var10000 = false;
            }

            if (var10000) {
               CoreEngine.val_bool_c = true;
            }
         }
      }
   }

   public void handleKeyRelease(int var1) {
      CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth();
      if ((CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight()) >= CoreEngine.val_int_n) {
         CoreEngine.exec_j_int_to_void(var1);
      }
   }

   public GameFlowController(InputManager var1) {
      CoreEngine.val_inputmanager_a = var1;
   }

   public GameFlowController() {
   }
}
