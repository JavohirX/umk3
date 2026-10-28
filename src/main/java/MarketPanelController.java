import java.util.Vector;

/**
 * Menu and UI dialog controller handling options screens, secret unlocks,
 * sound toggles, and game settings.
 */
public final class MarketPanelController {
   public short val_short_a;
   public int val_int_a = 0;
   public int val_int_b = -1;
   public int val_int_c = -1;
   public int val_int_d = -1;
   public String[] val_arr_string_a;
   public short[] val_arr_short_a;
   public short[] val_arr_short_b;
   public short[] val_arr_short_c;
   public int[] val_arr_int_a;
   public String[] val_arr_string_b;
   public String[] val_arr_string_c;
   public short[] val_arr_short_d = new short[11];
   public EncodedTextBuffer[] val_arr_encodedtextbuffer_a = new EncodedTextBuffer[11];
   public Object[] val_arr_object_a;
   public int val_int_e = 0;
   public boolean val_bool_a;
   public int val_int_f;
   public boolean val_bool_b = true;
   public int val_int_g;
   public int val_int_h = 0;
   public int val_int_i = 0;
   public int val_int_F;
   public String val_string_a;
   public SpriteImage val_spriteimage_a;
   public SpriteImage val_spriteimage_b;
   public short val_short_b = -1;
   public short val_short_c = -1;
   public int val_int_j;
   public int val_int_k;
   public int val_int_l;
   public short[] val_arr_short_e;
   public short[] val_arr_short_f;
   public short[] val_arr_short_g;
   public short[] val_arr_short_h;
   public String val_string_b;
   public EncodedTextBuffer val_encodedtextbuffer_a;
   public EncodedTextBuffer val_encodedtextbuffer_b;
   public EncodedTextBuffer val_encodedtextbuffer_c;
   public boolean val_bool_c = true;
   public boolean val_bool_d = true;
   public int val_int_m = 0;
   public int val_int_G;
   public int val_int_n;
   public int val_int_o = 0;
   public int val_int_p;
   public int val_int_q = 6;
   public int val_int_r;
   public int val_int_s;
   public int val_int_t;
   public int val_int_u;
   public int val_int_v;
   public int val_int_w;
   public boolean val_bool_e;
   public int val_int_x;
   public int val_int_y;
   public int val_int_z;
   public int val_int_A;
   public int val_int_B;
   public short[][] val_arr_arr_short_a;
   public short[][] val_arr_arr_short_b;
   public short[] val_arr_short_i;
   public short[][] val_arr_arr_short_c;
   public String[][] val_arr_arr_string_a;
   public EncodedTextBuffer[] val_arr_encodedtextbuffer_b;
   public EncodedTextBuffer val_encodedtextbuffer_d;
   public int val_int_C;
   public int val_int_D;
   public EncodedTextBuffer val_encodedtextbuffer_e;
   public EncodedTextBuffer val_encodedtextbuffer_f;
   public SpriteImage[] val_arr_spriteimage_a;
   public int val_int_E = 0;

   public MarketPanelController(int var1, int var2) {
      this.val_int_d = var1;
      this.val_int_c = var2;

      for (int var3 = 0; var3 < CoreEngine.val_arr_byte_a.length; var3++) {
         CoreEngine.val_arr_byte_a[var3] = -1;
      }
   }

   public final boolean isAvailable() {
      if (this.val_arr_int_a == null || CoreEngine.val_bool_m) {
         this.showOffer();
      }

      boolean var1;
      if (this.val_int_e != 0) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public void showOffer() {
      String var4;
      if ((var4 = CoreEngine.exec_a_string_to_string("MG_Impl")) == null) {
         this.val_int_e = 0;
      } else {
         if (!(var4 = var4.toLowerCase()).equals("static")) {
            if (var4.equals("wapstatic")) {
            }

            if (var4.equals("wap")) {
               this.val_int_e = 2;
            } else {
               if (!var4.equals("wapstatic")) {
                  this.val_int_e = 0;
                  return;
               }

               this.val_int_e = 3;
            }
         } else {
            this.val_int_e = 1;
         }

         String var5;
         if ((var5 = CoreEngine.exec_a_string_to_string("MG_PRODUCTS")) != null && var5.length() != 0) {
            int var6 = 0;
            int var1 = -1;

            int var7;
            do {
               String var2;
               if ((var7 = var5.indexOf(44, var1 + 1)) == -1) {
                  var2 = var5.substring(var1 + 1);
               } else {
                  var2 = var5.substring(var1 + 1, var7);
               }

               var1 = var7;
               if (var2.startsWith("MGPANEL")
                  && var2.length() == "MGPANEL".length() + 1
                  && var2.charAt(var2.length() - 1) >= '0'
                  && var2.charAt(var2.length() - 1) <= '9') {
                  int var8 = var2.charAt(var2.length() - 1) - '0';
                  String var9;
                  if ((var9 = CoreEngine.exec_a_string_to_string("MG_MGPANEL" + var8)) != null && var8 < this.val_arr_short_i.length) {
                     boolean var14 = false;
                     int var3 = -1;

                     int var27;
                     do {
                        if ((var27 = var9.indexOf(44, var3 + 1)) == -1) {
                           var4 = var9.substring(var3 + 1);
                        } else {
                           var4 = var9.substring(var3 + 1, var27);
                        }

                        var3 = var27;

                        for (int var29 = 0; var29 < this.val_arr_arr_string_a[var8].length; var29++) {
                           if (this.val_arr_arr_string_a[var8][var29].equals(var4)) {
                              var14 = true;
                           }
                        }

                        if (var14) {
                           var6++;
                           break;
                        }
                     } while (var27 != -1);
                  }
               } else {
                  boolean var11 = false;

                  for (int var10 = 0; var10 < this.val_arr_string_a.length; var10++) {
                     if (this.val_arr_string_a[var10].equals(var2)) {
                        var11 = true;
                        break;
                     }
                  }

                  if (var11) {
                     var6++;
                  }
               }
            } while (var7 != -1);

            if (var6 == 0) {
               this.val_int_e = 0;
            }

            this.val_arr_int_a = new int[var6];
            this.val_arr_string_b = new String[var6];
            this.val_arr_string_c = new String[var6];
            int var30 = -1;
            int var28 = 0;
            Vector var26;
            var26 = new Vector();
            Vector var25;
            var25 = new Vector();

            for (int var24 = 0; var24 < this.val_arr_int_a.length; var24++) {
               if ((var6 = var5.indexOf(44, var30 + 1)) == -1) {
                  var4 = var5.substring(var30 + 1);
               } else {
                  var4 = var5.substring(var30 + 1, var6);
               }

               var30 = var6;
               if (var4.startsWith("MGPANEL")
                  && var4.length() == "MGPANEL".length() + 1
                  && var4.charAt(var4.length() - 1) >= '0'
                  && var4.charAt(var4.length() - 1) <= '9') {
                  var6 = var4.charAt(var4.length() - 1) - '0';
                  String var16;
                  if ((var16 = CoreEngine.exec_a_string_to_string("MG_MGPANEL" + var6)) != null && var6 < this.val_arr_short_i.length) {
                     var26.setSize(0);
                     var25.setSize(0);
                     int var15 = -1;

                     do {
                        String var31;
                        if ((var1 = var16.indexOf(44, var15 + 1)) == -1) {
                           var31 = var16.substring(var15 + 1);
                        } else {
                           var31 = var16.substring(var15 + 1, var1);
                        }

                        var15 = var1;

                        for (int var20 = 0; var20 < this.val_arr_arr_string_a[var6].length; var20++) {
                           if (this.val_arr_arr_string_a[var6][var20].equals(var31) && !var26.contains(var31)) {
                              var26.addElement(var31);
                              var25.addElement(new Short(this.val_arr_arr_short_c[var6][var20]));
                           }
                        }
                     } while (var1 != -1);

                     if (var26.size() == 0) {
                        var24--;
                     } else {
                        this.val_arr_int_a[var24] = var6 | -2147483648;
                        int var32 = var26.size();
                        this.val_arr_arr_string_a[var6] = new String[var32];
                        this.val_arr_arr_short_c[var6] = new short[var32];

                        for (int var21 = 0; var21 < var32; var21++) {
                           this.val_arr_arr_string_a[var6][var21] = var26.elementAt(var21).toString();
                           this.val_arr_arr_short_c[var6][var21] = (Short)var25.elementAt(var21);
                        }

                        if (var28 < var32) {
                           var28 = var32;
                        }
                     }
                  } else {
                     var24--;
                  }
               } else {
                  this.val_arr_int_a[var24] = -2;
                  this.val_arr_string_b[var24] = null;
                  this.val_arr_string_c[var24] = null;

                  for (int var12 = 0; var12 < this.val_arr_string_a.length; var12++) {
                     if (this.val_arr_string_a[var12].equals(var4)) {
                        this.val_arr_int_a[var24] = var12;
                        this.val_arr_string_b[var24] = CoreEngine.exec_a_string_to_string("MG_BUYURI_" + var4);
                        this.val_arr_string_c[var24] = CoreEngine.exec_a_string_to_string("MG_CATURI_" + var4);
                        if (this.val_arr_string_b[var24] != null) {
                           this.val_arr_string_b[var24] = this.val_arr_string_b[var24].trim();
                        }

                        if (this.val_arr_string_c[var24] != null) {
                           this.val_arr_string_c[var24] = this.val_arr_string_c[var24].trim();
                        }
                        break;
                     }
                  }

                  if (this.val_arr_int_a[var24] == -2) {
                     var24--;
                  }
               }
            }

            this.val_arr_encodedtextbuffer_b = new EncodedTextBuffer[var28];
            this.val_arr_spriteimage_a = new SpriteImage[var28];
         } else {
            this.val_int_e = 0;
         }
      }
   }

   public final void loadMarketData() {
      boolean var1;
      if (this.val_int_e == 2
         && CoreEngine.exec_a_string_to_string("MG_BUYURI_" + this.val_arr_arr_string_a[this.val_arr_int_a[this.val_int_g] & 2147483647][this.val_int_j])
            == null) {
         var1 = true;
      } else {
         var1 = false;
      }

      if (var1) {
         this.val_encodedtextbuffer_e = null;
      } else {
         this.val_encodedtextbuffer_e = this.val_arr_encodedtextbuffer_a[5];
      }

      this.val_encodedtextbuffer_f = this.val_arr_encodedtextbuffer_a[6];
   }

   public final void setMarketItem(String var1) {
      if (this.val_arr_int_a == null || CoreEngine.val_bool_m) {
         this.showOffer();
      }

      for (int var2 = 0; var2 < this.val_arr_encodedtextbuffer_a.length; var2++) {
         this.val_arr_encodedtextbuffer_a[var2] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_d[var2], null);
      }

      this.val_string_b = var1;
      this.val_int_g = 0;
      this.val_bool_a = true;
      this.val_int_h = 0;
      this.selectIndex(0);
      CoreEngine.exec_a_object_to_void(this.val_arr_object_a[0]);
      this.val_arr_short_e = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(this.val_arr_encodedtextbuffer_a[0], this.val_int_d - 10);
      this.val_arr_short_f = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(this.val_arr_encodedtextbuffer_a[4], this.val_int_d - 10);
   }

   public final void selectIndex(int var1) {
      if (this.val_arr_int_a[var1] != -1 && (this.val_arr_int_a[var1] & -2147483648) != 0) {
         this.val_int_G = this.val_arr_int_a[var1] & 2147483647;

         for (int var24 = 0; var24 < this.val_arr_spriteimage_a.length; var24++) {
            this.val_arr_spriteimage_a[var24] = null;
         }

         for (int var25 = 0; var25 < this.val_arr_arr_short_c[this.val_int_G].length; var25++) {
            this.val_arr_encodedtextbuffer_b[var25] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(
               this.val_arr_arr_short_c[this.val_int_G][var25], null
            );

            try {
               this.val_arr_spriteimage_a[var25] = CoreEngine.exec_a_string_to_spriteimage(
                  "/mgc" + this.val_arr_arr_string_a[this.val_int_G][var25].toLowerCase() + ".png"
               );
            } catch (Exception var5) {
            }
         }

         this.val_encodedtextbuffer_d = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_i[this.val_int_G], null);
         this.val_int_j = 0;
         this.val_int_k = 0;
         this.val_int_E = 0;
         this.val_int_C = this.val_arr_arr_short_c[this.val_int_G].length;
         this.loadMarketData();
         this.dismissMarket();
         this.val_int_h = 3;
      } else {
         this.val_int_F = this.val_arr_int_a[var1];
         if (this.val_int_F != -1) {
            try {
               this.val_spriteimage_a = CoreEngine.exec_a_string_to_spriteimage("/mgi" + this.val_arr_string_a[this.val_int_F].toLowerCase() + ".png");
            } catch (Exception var8) {
               this.val_spriteimage_a = null;
            }

            byte var2 = CoreEngine.exec_a_to_fontcharmap().val_byte_d;
            this.val_spriteimage_b = null;
            this.val_short_b = -1;
            this.val_short_c = -1;
            if (this.val_arr_arr_short_a[var2] != null && this.val_arr_arr_short_a[var2][this.val_int_F] != -1) {
               try {
                  this.val_spriteimage_b = CoreEngine.exec_a_string_to_spriteimage(
                     "/mgi" + this.val_arr_string_a[this.val_int_F].toLowerCase() + "_" + CoreEngine.exec_a_to_fontcharmap().val_byte_d + ".png"
                  );
                  this.val_short_b = this.val_arr_arr_short_a[var2][this.val_int_F];
                  this.val_short_c = this.val_arr_arr_short_b[var2][this.val_int_F];
               } catch (Exception var7) {
               }
            }

            this.val_encodedtextbuffer_a = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_c[this.val_int_F], null);
            this.val_encodedtextbuffer_c = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_b[this.val_int_F], null);
            this.val_encodedtextbuffer_b = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_a[this.val_int_F], null);
            switch (this.val_int_e) {
               case 1:
                  this.val_bool_c = false;
                  this.val_bool_d = true;
                  this.val_int_m = 1;
                  break;
               case 2:
                  boolean var12;
                  if (this.val_arr_string_b[var1] != null && this.val_arr_string_b[var1].compareTo("") != 0) {
                     var12 = true;
                  } else {
                     var12 = false;
                  }

                  this.val_bool_c = var12;
                  if (this.val_arr_string_c[var1] != null && this.val_arr_string_c[var1].compareTo("") != 0) {
                     var12 = true;
                  } else {
                     var12 = false;
                  }

                  this.val_bool_d = var12;
                  if (this.val_bool_c) {
                     this.val_int_m = 0;
                  } else if (this.val_bool_d) {
                     this.val_int_m = 1;
                  } else {
                     this.val_int_m = 2;
                  }
                  break;
               case 3:
                  this.val_bool_d = true;
                  if (this.val_arr_string_b[var1] != null && this.val_arr_string_b[var1].compareTo("") != 0) {
                     this.val_bool_c = true;
                     this.val_int_m = 0;
                  } else {
                     this.val_bool_c = false;
                     this.val_int_m = 1;
                  }
            }
         } else {
            try {
               this.val_spriteimage_a = CoreEngine.exec_a_string_to_spriteimage("/mgi" + "LOG".toLowerCase() + ".png");
            } catch (Exception var6) {
               this.val_spriteimage_b = null;
               this.val_short_b = -1;
               this.val_short_c = -1;
            }

            this.val_encodedtextbuffer_a = this.val_arr_encodedtextbuffer_a[1];
            this.val_encodedtextbuffer_c = this.val_arr_encodedtextbuffer_a[2];
            this.val_encodedtextbuffer_b = this.val_arr_encodedtextbuffer_a[3];
            this.val_bool_c = false;
            if (this.val_int_e != 2 || this.val_arr_string_c[var1] != null && this.val_arr_string_c[var1].compareTo("") != 0) {
               this.val_bool_d = true;
               this.val_int_m = 1;
            } else {
               this.val_bool_d = false;
               this.val_int_m = 2;
            }
         }

         if (this.val_int_m != 2) {
            this.val_encodedtextbuffer_e = this.val_arr_encodedtextbuffer_a[5];
         } else {
            this.val_encodedtextbuffer_e = null;
         }

         this.val_encodedtextbuffer_f = this.val_arr_encodedtextbuffer_a[6];
         this.val_int_p = (this.val_int_d << 2) / 5;
         int var14 = this.val_int_c;
         this.val_int_w = 0;
         if (this.val_bool_b) {
            CoreEngine.exec_a_object_to_void(this.val_arr_object_a[3]);
            this.val_int_w = CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int();
            var14 -= this.val_int_w;
         }

         var14 -= 2;
         if (this.val_bool_d) {
            var14 -= 5;
            if (this.val_int_m == 1) {
               CoreEngine.exec_a_object_to_void(this.val_arr_object_a[2]);
            } else {
               CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);
            }

            var14 -= CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int();
            this.val_int_v = var14;
            if ((
                  var1 = CoreEngine.exec_a_encodedtextbuffer_to_int(this.val_encodedtextbuffer_c)
                     + 6
                     + CoreEngine.exec_c_to_int()
                     - CoreEngine.exec_d_to_int()
                     + 6
               )
               > this.val_int_p) {
               this.val_int_p = var1;
            }
         }

         if (this.val_bool_c) {
            var14 -= 5;
            if (this.val_int_m == 0) {
               CoreEngine.exec_a_object_to_void(this.val_arr_object_a[2]);
            } else {
               CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);
            }

            var14 -= CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int();
            this.val_int_u = var14;
            if ((
                  var1 = CoreEngine.exec_a_encodedtextbuffer_to_int(this.val_arr_encodedtextbuffer_a[10])
                     + 6
                     + CoreEngine.exec_c_to_int()
                     - CoreEngine.exec_d_to_int()
                     + 6
               )
               > this.val_int_p) {
               this.val_int_p = var1;
            }
         }

         if (this.val_bool_d && this.val_bool_c) {
            var14 -= 2;
            this.val_int_u = var14;
         }

         var14 -= 2;
         if (this.val_spriteimage_a != null) {
            CoreEngine.exec_a_object_to_void(this.val_arr_object_a[0]);
            this.val_arr_short_g = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(this.val_encodedtextbuffer_a, this.val_int_d - 2);
            this.val_arr_short_h = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(this.val_encodedtextbuffer_b, this.val_int_d - 2);
            int var19;
            this.val_int_t = var19 = var14 - (this.val_arr_short_g[0] * CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()) + -5;
            int var20;
            this.val_int_o = var20 = var19 - (this.val_arr_short_h[0] * CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int());
            var14 = var20 - this.val_spriteimage_a.sourceImage.imageHeight;
            this.val_int_r = var14;
            this.val_int_s = this.val_int_r + (this.val_spriteimage_a.sourceImage.imageHeight >> 1);
         } else {
            CoreEngine.exec_a_object_to_void(this.val_arr_object_a[0]);
            this.val_arr_short_g = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(
               this.val_encodedtextbuffer_a, this.val_int_d - (CoreEngine.val_byte_b >> 1)
            );
            int var22;
            this.val_int_t = var22 = var14 - this.val_arr_short_g[0] * CoreEngine.exec_c_to_int();
            var14 = var22 - CoreEngine.exec_c_to_int();
            this.val_int_r = var14;
            this.val_int_s = this.val_int_r + (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int() >> 1);
         }

         var14--;
         CoreEngine.exec_a_object_to_void(this.val_arr_object_a[4]);
         this.val_int_n = CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int() + 1 + 1;
         if (var14 >= this.val_int_n) {
            this.val_bool_e = true;
            var14 -= this.val_int_n;
         } else {
            this.val_bool_e = false;
         }

         if (var14 > 0) {
            var1 = var14 * 3 / 10;
            int var3 = var14 >> 2;
            this.val_int_r -= var14 - var1;
            this.val_int_s -= var14 - var1;
            this.val_int_t -= var14 - var1 - var3;
            this.val_int_o -= var14 - var1 - var3;
            int var4;
            this.val_int_u = this.val_int_u - (var14 - var1 - var3 - (var4 = var14 >> 2));
            this.val_int_v -= var14 - var1 - var3 - var4;
         }

         this.val_int_h = 0;
      }
   }

   public void dismissMarket() {
      int var1 = this.val_int_c;
      if (this.val_bool_b) {
         CoreEngine.exec_a_object_to_void(this.val_arr_object_a[3]);
         this.val_int_w = CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int();
         var1 -= this.val_int_w;
      }

      int var10000 = var1 + -2 + -1 - (CoreEngine.val_byte_a << 1) + -8;
      CoreEngine.exec_a_object_to_void(this.val_arr_object_a[4]);
      this.val_int_n = CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int() + 1 + 1;
      this.val_bool_e = true;
      var1 = var10000 - this.val_int_n;
      CoreEngine.exec_a_object_to_void(this.val_arr_object_a[0]);
      int var2 = CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int();
      if (this.val_arr_spriteimage_a[0] != null && this.val_arr_spriteimage_a[0].sourceImage.imageHeight > var2) {
         this.val_int_B = this.val_arr_spriteimage_a[0].sourceImage.imageHeight;
      } else {
         this.val_int_B = var2;
      }

      this.val_int_B += 4;
      if ((var2 = var1 / this.val_int_B) >= this.val_int_C) {
         var2 = this.val_int_C;
      }

      this.val_int_l = var2;
      if ((var2 = var1 - this.val_int_l * (this.val_int_B + 1)) < 0) {
         var2 = 0;
      }

      this.val_int_x = this.val_int_c - this.val_int_w - 2 - (var2 >> 2) + 3;
      this.val_int_y = this.val_int_n + 1 + (var2 >> 2) + 3;
      this.val_int_z = this.val_int_n + 1 + CoreEngine.val_byte_a + (var2 >> 1) + 3 + 1;
      var2 = 0;
      CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);

      for (int var5 = 0; var5 < this.val_int_C; var5++) {
         if (var5 == this.val_int_j) {
            CoreEngine.exec_a_object_to_void(this.val_arr_object_a[2]);
         }

         int var3 = CoreEngine.exec_a_encodedtextbuffer_to_int(this.val_arr_encodedtextbuffer_b[var5]);
         if (var5 == this.val_int_j) {
            CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);
         }

         var3 += 4;
         if (this.val_arr_spriteimage_a[var5] == null) {
            var3 += this.val_int_D;
         } else {
            var3 += this.val_arr_spriteimage_a[var5].sourceImage.imageWidth;
         }

         if (var3 > var2) {
            var2 = var3;
         }
      }

      this.val_int_A = this.val_int_d - var2 >> 1;
      if (this.val_int_A <= CoreEngine.val_byte_a + 6 + 1) {
         this.val_int_A = CoreEngine.val_byte_a + 6 + 1;
      }
   }

   public final String getMarketUrl(String var1) {
      StringBuffer var2;
      var2 = new StringBuffer(var1);
      if (var1.indexOf(63) == -1) {
         var2.append('?');
      } else {
         var2.append('&');
      }

      var2.append("ctx");
      var2.append('=');
      var2.append(this.val_string_b);
      var2.append('&');
      var2.append("lng");
      var2.append('=');
      var2.append(CoreEngine.exec_a_to_fontcharmap().val_arr_arr_byte_a[CoreEngine.exec_a_to_fontcharmap().val_byte_d]);

      for (int var4 = 1; var4 < 10; var4++) {
         String var3;
         if ((var3 = CoreEngine.exec_b_string_to_string("MG_REPORTING_NAME" + var4)) != null) {
            var2.append('&');
            var2.append(var3);
            var2.append('=');
            var2.append(CoreEngine.exec_b_string_to_string("MG_REPORTING_VALUE" + var4));
         }
      }

      return var2.toString();
   }

   public final void showError() {
      CoreEngine.exec_a_to_gameflowcontroller();
      this.val_encodedtextbuffer_e = this.val_arr_encodedtextbuffer_a[7];
      this.val_encodedtextbuffer_f = this.val_arr_encodedtextbuffer_a[8];
      this.val_int_h = 1;
   }

   public final void cleanupMarket() {
      this.val_arr_short_e = null;
      this.val_arr_short_f = null;
      this.val_arr_short_g = null;
      this.val_string_a = null;
      this.val_string_b = null;
      this.val_spriteimage_a = null;
      this.val_spriteimage_b = null;
      this.val_encodedtextbuffer_a = null;
      this.val_encodedtextbuffer_b = null;
      this.val_encodedtextbuffer_c = null;
      this.val_encodedtextbuffer_d = null;
      this.val_encodedtextbuffer_e = null;
      this.val_encodedtextbuffer_f = null;

      for (int var1 = 0; var1 < this.val_arr_spriteimage_a.length; var1++) {
         this.val_arr_spriteimage_a[var1] = null;
      }

      for (int var2 = 0; var2 < this.val_arr_encodedtextbuffer_b.length; var2++) {
         this.val_arr_encodedtextbuffer_b[var2] = null;
      }
   }

   public final void renderHeader(GraphicsAdapter var1, int var2, int var3) {
      var2 += this.val_int_q >> 1;
      var1.setColor(-16757361);

      for (int var4 = 0; var4 <= CoreEngine.val_byte_a; var4++) {
         var1.drawLine(var2 + var4, var3 - var4, var2 + var4, var3 + var4);
      }

      var1.setColor(-9462329);
      var1.drawLine(var2, var3, var2 + CoreEngine.val_byte_a, var3 - CoreEngine.val_byte_a);
      var1.drawLine(var2, var3, var2 + CoreEngine.val_byte_a, var3 + CoreEngine.val_byte_a);
      var1.drawLine(var2 + CoreEngine.val_byte_a, var3 - CoreEngine.val_byte_a, var2 + CoreEngine.val_byte_a, var3 + CoreEngine.val_byte_a);
   }

   public final void renderFooter(GraphicsAdapter var1, int var2, int var3) {
      var2 -= this.val_int_q >> 1;
      var1.setColor(-16757361);

      for (int var4 = 0; var4 <= CoreEngine.val_byte_a; var4++) {
         var1.drawLine(var2 - var4, var3 - var4, var2 - var4, var3 + var4);
      }

      var1.setColor(-9462329);
      var1.drawLine(var2, var3, var2 - CoreEngine.val_byte_a, var3 - CoreEngine.val_byte_a);
      var1.drawLine(var2, var3, var2 - CoreEngine.val_byte_a, var3 + CoreEngine.val_byte_a);
      var1.drawLine(var2 - CoreEngine.val_byte_a, var3 - CoreEngine.val_byte_a, var2 - CoreEngine.val_byte_a, var3 + CoreEngine.val_byte_a);
   }

   public final void renderRow(GraphicsAdapter var1, int var2, int var3, EncodedTextBuffer var4, boolean bSelected) {
      int var6 = 0;
      if (bSelected) {
         CoreEngine.exec_a_object_to_void(this.val_arr_object_a[2]);
         if (this.val_arr_object_a[2] == this.val_arr_object_a[1]) {
            var6 = 1;
         }
      } else {
         CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);
      }

      int var7;
      int var8 = (var7 = CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()) + 3 + 2;
      int posX = (this.val_int_d - var3) >> 1;
      var1.setColor(-16777216);
      var1.fillRect(posX, var2, var3, var8);
      var1.setColor(-16757361);
      var1.fillRect(posX, var2, var3 - 1, var8 - 1);
      var1.setColor(-9462329);
      var1.drawLine(posX + 1, var2 + 1, posX + var3 - 2, var2 + 1);
      var1.drawLine(posX + 1, var2 + 1, posX + 1, var2 + var8 - 3);
      if (bSelected) {
         var1.setColor(-1);
         int cursorX = posX + (var7 >> 1) + 3;
         var8 = var2 + (var8 >> 1);
         var7 = (var7 >> 1) - 1;

         for (int var10 = 0; var10 <= var7; var10++) {
            var1.drawLine(cursorX - var10, var8 - var10, var6 - var10, var8 + var10);
         }
      }

      CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var4, this.val_int_d >> 1, var2 + 2, 17);
   }
}
