/**
 * Text encoding and localization buffer. Decodes proprietary compressed text tables
 * into displayable character strings, menu labels, and subtitle messages.
 */
public final class EncodedTextBuffer {
   public byte[] textBytes;
   public int textLength;
   public int bufferCapacity;
   public int encodingType;
   public byte flagsByte;
   public byte[] secondaryBytes;
   public EncodedTextBuffer[] childBuffers;

   public EncodedTextBuffer() {
   }

   public EncodedTextBuffer(String var1) {
      this.textLength = 0;
      this.bufferCapacity = var1.length();
      this.encodingType = this.bufferCapacity;
      this.flagsByte = 65;
      this.textBytes = new byte[this.encodingType];

      for (int var2 = 0; var2 < this.textBytes.length; var2++) {
         this.textBytes[var2] = 0;
      }

      for (int var3 = 0; var3 < this.bufferCapacity; var3++) {
         this.textBytes[var3] = (byte)var1.charAt(var3);
      }
   }

   public EncodedTextBuffer(int var1, byte var2) {
      this.flagsByte = 65;
      this.textLength = 0;
      this.textBytes = CoreEngine.exec_a_to_fontcharmap().formatInt(var1);
      this.bufferCapacity = CoreEngine.exec_a_arr_short_to_int(
         CoreEngine.exec_a_tokenstring_to_arr_short(CoreEngine.exec_a_string_to_tokenstring(new String(this.textBytes)))
      );
      this.encodingType = this.bufferCapacity;
   }

   public EncodedTextBuffer(int var1) {
      this.flagsByte = -64;
      this.textBytes = new byte[var1 << 1];
      this.encodingType = var1;
      this.textLength = 0;
      this.bufferCapacity = 0;
   }

   public boolean isWritable() {
      boolean var1;
      if ((this.flagsByte & 128) != 0) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public final EncodedTextBuffer appendBuffer(EncodedTextBuffer var1) {
      if (!this.isWritable()) {
         return this;
      }

      byte var2 = (byte)(this.flagsByte & 63);
      byte var5;
      if ((var5 = (byte)(var1.flagsByte & 63)) != var2 && var5 != 1 && var2 != 0) {
         return this;
      }

      int var3 = this.textLength;
      int var4;
      if (var2 == 0) {
         var4 = this.bufferCapacity << 1;
      } else {
         var4 = this.bufferCapacity;
      }

      CoreEngine.exec_a_to_fontcharmap().renderText(var1.textBytes, var1.textLength, this.textBytes, var3 + var4, (short)var1.bufferCapacity, var5, var2);
      this.bufferCapacity = this.bufferCapacity + var1.bufferCapacity;
      return this;
   }

   public final EncodedTextBuffer appendString(String var1) {
      if (!this.isWritable()) {
         return this;
      }

      int var2 = var1.length();
      int var3 = this.bufferCapacity;
      this.bufferCapacity += var2;

      for (int var4 = 0; var4 < var2; var4++) {
         this.setCharAt(var3 + var4, var1.charAt(var4));
      }

      return this;
   }

   public final EncodedTextBuffer appendInt(int var1) {
      if (!this.isWritable()) {
         return this;
      }

      if (this.secondaryBytes == null) {
         this.secondaryBytes = new byte[11];
      }

      int var2 = 10;
      long var3 = var1;
      if (var1 < 0) {
         var3 = -var3;
      }

      for (int var5 = 10; var5 >= 0; var5--) {
         this.secondaryBytes[var5] = (byte)(var3 % 10L | 48L);
         var3 /= 10L;
         if (this.secondaryBytes[var5] != 48) {
            var2 = var5;
         }
      }

      if (var1 < 0) {
         this.secondaryBytes[--var2] = 45;
      }

      short var6 = (short)(11 - var2);
      byte var7 = (byte)(this.flagsByte & 63);
      int var4 = this.textLength;
      int var8;
      if (var7 == 0) {
         var8 = this.bufferCapacity << 1;
      } else {
         var8 = this.bufferCapacity;
      }

      CoreEngine.exec_a_to_fontcharmap().renderText(this.secondaryBytes, var2, this.textBytes, var4 + var8, var6, 1, var7);
      this.bufferCapacity += var6;
      return this;
   }

   public final void setCharAt(int var1, char var2) {
      if (this.isWritable()) {
         byte var3 = (byte)(this.flagsByte & 63);
         short var5;
         short var4 = var5 = (short)var2;
         if (var5 > 127 && var3 != 0) {
            FontCharmap var8;
            var4 = (short)(
               CoreEngine.exec_a_arr_short_int_int_int_int_fontcharmap_to_int(
                     (var8 = CoreEngine.exec_a_to_fontcharmap()).val_arr_short_d, var5, 0, 127, 128, var8
                  )
                  + 128
            );
         }

         var2 = (char)this.textLength;
         if (var3 == 0) {
            var1 <<= 1;
         }

         var2 += var1;
         if (var3 == 0) {
            this.textBytes[var2++] = (byte)(var4 >> 8);
         }

         this.textBytes[var2] = (byte)var4;
      }
   }

   public final short getCharAt(int var1) {
      int var2;
      return (this.flagsByte & 63) == 0
         ? (short)((this.textBytes[var2 = this.textLength + (var1 << 1)] & 255) << 8 | this.textBytes[var2 + 1] & 0xFF)
         : (short)(this.textBytes[this.textLength + var1] & 0xFF);
   }

   public final EncodedTextBuffer concatAll(EncodedTextBuffer[] var1) {
      EncodedTextBuffer var2;
      var2 = new EncodedTextBuffer();
      var2.flagsByte = (byte)(this.flagsByte & 63);
      var2.textLength = 0;
      int var3 = 0;

      for (int var4 = 0; var4 < this.bufferCapacity; var4++) {
         if (this.getCharAt(var4) == 92) {
            if (++var4 < this.bufferCapacity) {
               short var5;
               if ((var5 = this.getCharAt(var4)) == 92) {
                  var3--;
               } else if (var5 >= 48 && var5 <= 90) {
                  var5 -= 48;
                  if ((var1[var5].flagsByte & 63) != var2.flagsByte && (var1[var5].flagsByte & 63) != 1) {
                     var2.flagsByte = 0;
                  }

                  var3 += var1[var5].bufferCapacity - 2;
               }
            }
         }
      }

      var2.flagsByte = (byte)(var2.flagsByte | 64);
      var2.bufferCapacity = (short)(this.bufferCapacity + var3);
      var2.encodingType = var2.bufferCapacity;
      int var11;
      if ((var2.flagsByte & 63) == 0) {
         var11 = var2.bufferCapacity << 1;
      } else {
         var11 = var2.bufferCapacity;
      }

      var2.textBytes = new byte[var11];
      var11 = 0;
      var3 = 0;
      byte var6;
      if ((this.flagsByte & 63) == 0) {
         var6 = 2;
      } else {
         var6 = 1;
      }

      for (int var9 = 0; var9 < this.bufferCapacity; var9++) {
         if (this.getCharAt(var9) == 92) {
            var11 += CoreEngine.exec_a_to_fontcharmap()
               .renderText(this.textBytes, this.textLength + var3 * var6, var2.textBytes, var11, (short)(var9 - var3), this.flagsByte & 63, var2.flagsByte & 63);
            var3 = var9++;
            if (var9 < this.bufferCapacity) {
               short var7;
               if ((var7 = this.getCharAt(var9)) == 92) {
                  var3 = var9;
               } else if (var7 >= 48 && var7 <= 90) {
                  var7 -= 48;
                  var11 += CoreEngine.exec_a_to_fontcharmap()
                     .renderText(
                        var1[var7].textBytes,
                        var1[var7].textLength,
                        var2.textBytes,
                        var11,
                        (short)var1[var7].bufferCapacity,
                        var1[var7].flagsByte & 63,
                        var2.flagsByte & 63
                     );
                  var3 = var9 + 1;
               }
            }
         }
      }

      CoreEngine.exec_a_to_fontcharmap()
         .renderText(
            this.textBytes, this.textLength + var3 * var6, var2.textBytes, var11, (short)(this.bufferCapacity - var3), this.flagsByte & 63, var2.flagsByte & 63
         );
      return var2;
   }

   public final EncodedTextBuffer copyFrom(EncodedTextBuffer var1) {
      if (this.childBuffers == null) {
         this.childBuffers = new EncodedTextBuffer[1];
      }

      this.childBuffers[0] = var1;
      return this.concatAll(this.childBuffers);
   }

   public final EncodedTextBuffer substring(int var1) {
      if (this.childBuffers == null) {
         this.childBuffers = new EncodedTextBuffer[1];
      }

      this.childBuffers[0] = new EncodedTextBuffer(var1, (byte)0);
      EncodedTextBuffer var10000 = this.concatAll(this.childBuffers);
      this.childBuffers[0] = null;
      return var10000;
   }

   public final EncodedTextBuffer prepend(EncodedTextBuffer var1) {
      byte var2 = (byte)(this.flagsByte & 63);
      byte var4 = (byte)(var1.flagsByte & 63);
      EncodedTextBuffer var5;
      var5 = new EncodedTextBuffer();
      var5.bufferCapacity = this.bufferCapacity + var1.bufferCapacity;
      var5.encodingType = var5.bufferCapacity;
      var5.textLength = 0;
      if (var2 != var4 && var4 != 1) {
         var5.flagsByte = 0;
      } else {
         var5.flagsByte = var2;
      }

      int var3;
      if (var5.flagsByte == 0) {
         var3 = var5.bufferCapacity << 1;
      } else {
         var3 = var5.bufferCapacity;
      }

      var5.textBytes = new byte[var3];
      var3 = CoreEngine.exec_a_to_fontcharmap()
         .renderText(this.textBytes, this.textLength, var5.textBytes, 0, (short)this.bufferCapacity, var2, var5.flagsByte);
      CoreEngine.exec_a_to_fontcharmap().renderText(var1.textBytes, var1.textLength, var5.textBytes, var3, (short)var1.bufferCapacity, var4, var5.flagsByte);
      var5.flagsByte = (byte)(var5.flagsByte | 64);
      return var5;
   }

   public final String toString() {
      StringBuffer var1;
      var1 = new StringBuffer(this.bufferCapacity);

      for (int var2 = 0; var2 < this.bufferCapacity; var2++) {
         short var3;
         char var4;
         if ((var3 = this.getCharAt(var2)) > 127 && (this.flagsByte & 63) != 0) {
            var4 = (char)CoreEngine.exec_a_to_fontcharmap().val_arr_short_d[var3 - 128];
         } else {
            var4 = (char)var3;
         }

         var1.append(var4);
      }

      return var1.toString();
   }
}
