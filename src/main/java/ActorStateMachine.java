/**
 * Hierarchical finite state machine representing a character or interactable actor in combat.
 * Tracks actor state, coordinate boundaries, current animation indices, velocity vectors,
 * and active collision boxes. Implements {@link EntityInterface}.
 */
public final class ActorStateMachine implements EntityInterface {
   public int actorState;
   public int actorSubState;
   public int actorPosX;
   public int actorPosY;
   public boolean isActorActive;
   public int actorFacingDirection;
   public int actorCurrentAnimation = 0;
   public int actorActionFrame;
   public int actorTimer;
   public int[] actorBoundsArray = new int[11];
   public CoreEngine val_coreengine_a;
   public CoreEngine val_coreengine_b;
   public boolean actorGroundedFlag;
   public int actorVelocityX;

   public final void setPosition(int var1, int var2) {
      this.actorBoundsArray[0] = var1 << 8;
      this.actorBoundsArray[1] = var2 << 8;
   }

   public final void setFacingDirection(int var1) {
      switch (var1) {
         case 2:
            if (this.actorActionFrame != 3 && this.actorActionFrame != 5 && this.actorActionFrame != 4 && this.actorActionFrame != 1) {
               this.setActionFrame(0);
            } else {
               this.setActionFrame(3);
            }

            this.isActorActive = false;
            CoreEngine.exec_b_entityinterface_int_to_void(this, this.actorTimer);
            break;
         case 3:
            this.isActorActive = true;
            CoreEngine.exec_a_entityinterface_int_to_void(this, this.actorTimer);
            this.val_coreengine_b = null;
      }

      this.actorCurrentAnimation = var1;
   }

   public void setAnimation(int var1) {
      this.actorSubState = var1;
      this.actorState = 1;
   }

   public final void setActionFrame(int var1) {
      label37:
      switch (var1) {
         case 0:
            if (this.actorActionFrame == 4) {
               this.resetAnimation();
            } else {
               this.setAnimation(0);
            }
            break;
         case 1:
            if (this.actorActionFrame == 4 || this.actorActionFrame == 6) {
               CoreEngine.exec_a_int_int_bool_bool_to_void(this.val_coreengine_a.exec_a_to_int(), this.getPosY(), false, false);
               this.setFacingDirection(3);
               return;
            }

            this.actorVelocityX = 0;
            this.setAnimation(1);
            if (this.actorActionFrame == 2) {
               this.clearState();
            } else if (this.actorActionFrame == 3) {
               this.setAnimation(3);
               this.setPosition(this.val_coreengine_a.exec_a_to_int(), this.val_coreengine_a.exec_b_to_int() + -12);
               this.val_coreengine_a.updateActor(32);
            } else if (this.actorActionFrame == 1) {
               this.setPosition(this.val_coreengine_a.exec_a_to_int(), this.getPosY());
            } else if (this.actorActionFrame == 5) {
               CoreEngine.exec_a_int_int_to_void(this.val_coreengine_a.exec_a_to_int(), this.val_coreengine_a.exec_b_to_int() - 78);
            }
            break;
         case 2:
            switch (this.actorActionFrame) {
               case 0:
                  this.resetAnimation();
                  break label37;
               case 1:
               case 2:
               case 5:
               default:
                  this.setAnimation(1);
                  break label37;
               case 3:
                  this.setAnimation(1);
                  break label37;
               case 4:
               case 6:
                  CoreEngine.exec_a_int_int_bool_bool_to_void(this.val_coreengine_a.exec_a_to_int(), this.getPosY(), false, false);
                  this.setFacingDirection(3);
                  return;
            }
         case 3:
            this.setAnimation(2);
      }

      this.actorPosY = 0;
      this.actorPosX = var1;
   }

   public void resetAnimation() {
      this.actorSubState = 0;
      SpritePartSequence var10001 = this.getCurrentSequence();
      int var1 = var10001.sequenceFlags;
      int var2 = var10001.partOffsets.length - 1;
      this.actorState = CoreEngine.exec_a_int_int_int_to_int(var1, var2, 1);
   }

   public final SpritePartSequence getCurrentSequence() {
      return CoreEngine.val_arr_arr_spritepartsequence_a != null
            && this.actorSubState >= 0
            && this.actorSubState < CoreEngine.val_arr_arr_spritepartsequence_a[this.actorActionFrame].length
         ? CoreEngine.val_arr_arr_spritepartsequence_a[this.actorActionFrame][this.actorSubState]
         : null;
   }

   public final boolean isAnimationFinished() {
      boolean var1;
      if (CoreEngine.exec_g_int_to_int(this.actorState) == 0) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public final int getPosY() {
      return this.actorBoundsArray[1] >> 8;
   }

   public final void clearState() {
      byte var1;
      if (this.actorFacingDirection > 0) {
         var1 = 2;
      } else {
         var1 = 1;
      }

      int var2 = this.getAnimationDuration();
      int var3 = this.getY();
      byte var4;
      if (this.val_coreengine_a.characterId == 5) {
         var4 = 1;
      } else {
         var4 = 0;
      }

      CoreEngine.exec_a_int_int_int_int_to_void(var1, var2, var3, var4);
   }

   public final void translatePosition(int var1, int var2) {
      var1 = this.actorBoundsArray[0] + var1;
      this.actorBoundsArray[0] = var1;
      var2 = this.actorBoundsArray[1] + var2;
      this.actorBoundsArray[1] = var2;
   }

   public final boolean isActive() {
      return true;
   }

   public final int[] getBounds() {
      return this.actorBoundsArray;
   }

   public final boolean checkIntersect(int[] var1) {
      return true;
   }

   public final boolean checkHitBox(int var1, int[] var2, int var3) {
      int var4 = this.getAnimationDuration();
      int var5 = this.getY();
      short[] var6 = null;
      switch (var1) {
         case 1:
            switch (this.actorPosX) {
               case 0:
                  var6 = CoreEngine.val_arr_arr_short_a[this.actorActionFrame];
                  break;
               case 3:
                  if (this.actorPosY > 130) {
                     var6 = CoreEngine.val_arr_arr_short_b[this.actorActionFrame];
                  }
            }
         default:
            if (var6 != null) {
               var2[var3] = var5 + var6[0];
               var2[var3 + 3] = var5 + var6[3];
               if (this.actorFacingDirection == 1) {
                  var2[var3 + 1] = var4 + var6[1];
                  var2[var3 + 2] = var4 + var6[2];
               } else {
                  var2[var3 + 1] = var4 - var6[2];
                  var2[var3 + 2] = var4 - var6[1];
               }

               return true;
            } else {
               return false;
            }
      }
   }

   public final int getStateValue(int var1) {
      return var1 != 1 || this.actorPosX != 0 && this.actorPosX != 3 ? 0 : 1;
   }

   public final boolean testCollision(int[] var1) {
      return false;
   }

   public final int interactWithEntity(EntityInterface var1, int[] var2) {
      return 0;
   }

   public final void applyAction(int var1) {
   }

   public final void updateTick() {
   }

   public int getAnimationDuration() {
      return this.actorBoundsArray[0] >> 8;
   }

   public final int getY() {
      return this.actorBoundsArray[1] >> 8;
   }

   public final boolean isGrounded() {
      boolean var1;
      if (this.actorCurrentAnimation == 2) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public final int getPosX() {
      switch (this.actorActionFrame) {
         case 3:
            int var1 = 0;
            if (this.actorPosX == 1) {
               var1 = -106496 * Math.min(900, this.actorPosY) / 900;
            }

            return var1 + 65536;
         default:
            return 81920;
      }
   }

   public final boolean isAlive() {
      return false;
   }
}
