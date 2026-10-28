/**
 * String token array container used for script evaluation, menu item hierarchies,
 * and localized message formatting.
 */
public final class TokenString {
   public short[] tokenShortArray;

   public TokenString() {
      CoreEngine.exec_a_arr_short_int_tokenstring_to_void(new short[]{0}, 0, this);
   }

   public TokenString(short[] var1) {
      CoreEngine.exec_a_arr_short_int_tokenstring_to_void(var1, CoreEngine.exec_a_arr_short_to_int(var1), this);
   }

   public final boolean equals(Object var1) {
      if (!(var1 instanceof TokenString)) {
         return false;
      }

      TokenString var2 = (TokenString)var1;
      int var4 = CoreEngine.exec_a_arr_short_to_int(this.tokenShortArray);
      boolean var5;
      if (CoreEngine.exec_a_arr_short_to_int(var2.tokenShortArray) != var4) {
         var5 = false;
      } else {
         short[] var3 = var2.tokenShortArray;
         int var6 = 0;

         while (true) {
            if (var6 >= var4) {
               var5 = true;
               break;
            }

            if (this.tokenShortArray[var6] != var3[var6]) {
               var5 = false;
               break;
            }

            var6++;
         }
      }

      return var5;
   }
}
