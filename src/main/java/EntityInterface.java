/**
 * Common interface for all interactive game entities (actors, projectiles, effects,
 * and core engine simulation). Defines bounding boxes, collision queries, and tick updates.
 */
public interface EntityInterface {
      /**
    * Returns the bounding box coordinates [x1, y1, x2, y2] for collision detection.
    */
   int[] getBounds();

   boolean checkHitBox(int var1, int[] var2, int var3);

   int getStateValue(int var1);

   boolean isActive();

   boolean testCollision(int[] var1);

   int interactWithEntity(EntityInterface var1, int[] var2);

      /**
    * Advances entity logic, physics, animations, and state counters for the current frame.
    */
   void updateTick();

   void applyAction(int var1);

   boolean checkIntersect(int[] var1);

      /**
    * Returns whether this entity is active and participating in the simulation.
    */
   boolean isAlive();
}
