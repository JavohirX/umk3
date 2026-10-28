/**
 * Visual effect entity managing combat particles, blood splatters, projectile sparks,
 * dust clouds, and impact animations. Implements {@link EntityInterface}.
 */
public final class EffectActor implements EntityInterface {
   public int[] effectCoordinates;
   public boolean isEffectActive;
   public int effectType;
   public int effectDuration = 0;
   public int effectFrame = 0;
   public int effectMaxFrames = 0;
   public int effectPosX;
   public int effectPosY;
   public int effectVelocityX;
   public int effectVelocityY;
   public int effectAccelerationX;
   public int effectAccelerationY;
   public int effectScale;
   public boolean effectVisible;
   public boolean effectLooping;
   public boolean effectAttached;
   public int effectAlpha;
   public boolean effectFlipped;
   public AnimationSet val_animationset_a;
   public AnimationSet val_animationset_b;
   public SpritePartSequence val_spritepartsequence_a;
   public SpritePartSequence val_spritepartsequence_b;
   public int effectRotation;
   public boolean effectFinished;
   public int effectPalette;
   public int effectPriority;
   public int effectTargetX;
   public int effectTargetY;
   public boolean val_bool_g;

   public final boolean isActive() {
      boolean var1;
      if (this.effectAccelerationX == 2) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public final int[] getBounds() {
      return this.effectCoordinates;
   }

   public final boolean checkIntersect(int[] var1) {
      return false;
   }

   public final boolean checkHitBox(int var1, int[] var2, int var3) {
      return false;
   }

   public final int getStateValue(int var1) {
      return 0;
   }

   public final boolean testCollision(int[] var1) {
      boolean var2;
      if (this.effectPosX == 0 && this.effectPosY == 0) {
         var2 = false;
      } else {
         this.effectDuration = this.effectPosX;
         this.effectFrame = this.effectPosY;
         this.effectMaxFrames = this.effectVelocityX;
         if (this.effectType == 0 && this.effectAttached) {
            this.effectPosX = CoreEngine.exec_a_int_int_to_int(0, 32) - 16 + this.effectPosX;
            this.effectPosY = CoreEngine.exec_a_int_int_to_int(0, 32) - 16 + this.effectPosY;
         }

         var1[0] = this.effectCoordinates[7];
         var1[1] = 0;
         var1[2] = this.effectVelocityX;
         var1[3] = this.effectPosX << 8;
         var1[4] = this.effectPosY << 8;
         var1[1] = this.effectVelocityY;
         if (this.effectAccelerationY == 5) {
            if (this.effectPosX > 0) {
               this.effectFinished = true;
               this.effectRotation = this.val_spritepartsequence_a.getPartXOffset(0);
            } else {
               this.effectFinished = false;
               this.effectRotation = this.val_spritepartsequence_a.getPartXOffset(this.val_spritepartsequence_a.partOffsets.length - 1);
            }
         }

         this.effectPosX = 0;
         this.effectPosY = 0;
         this.effectTargetX = this.effectCoordinates[0];
         this.effectTargetY = this.effectCoordinates[1];
         var2 = true;
      }

      return var2;
   }

   public final int interactWithEntity(EntityInterface var1, int[] var2) {
      return 0;
   }

   public final void applyAction(int var1) {
      switch (var1) {
         case 8:
            if (this.isEffectActive) {
               boolean var2;
               if (this.effectType < 2) {
                  this.effectType++;
                  this.effectPosX = (short)(this.effectDuration / 2);
                  this.effectPosY = (short)(Math.abs(this.effectFrame) / 2);
                  this.effectVelocityX = (short)(this.effectMaxFrames / 2);
                  this.effectCoordinates[7] = 5;
                  var2 = true;
               } else {
                  var2 = false;
               }

               if (!var2) {
                  this.isEffectActive = false;
                  this.effectRotation = 0;
                  return;
               }
            } else if (this.effectLooping) {
               CoreEngine.exec_a_effectactor_to_void(this);
            }
      }
   }

   public final void updateTick() {
   }

   public final boolean isAlive() {
      return false;
   }
}
