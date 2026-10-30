// Ultimate Mortal Kombat 3 - 1:1 Transpiled Native JavaScript Engine
import {
    createArray,
    createMultiArray,
    arraycopy,
    makeString,
    System,
    JVector,
    InputStream,
    ByteArrayInputStream,
    ByteArrayOutputStream,
    DataInputStream,
    DataOutputStream,
    RecordStore,
    ResourceManager,
    Thread,
    Random,
    StringBuffer,
    StringBuilder,
    Integer,
    Short,
    Byte,
    Long
} from '../j2me/runtime.js';

import {
    Graphics,
    Image,
    Displayable,
    Canvas,
    FullCanvas,
    Display,
    MIDlet
} from '../j2me/graphics.js';

import {
    Manager,
    Player,
    VolumeControl
} from '../j2me/audio.js';

// Global environment bindings for J2ME compatibility
globalThis.Integer = Integer;
globalThis.Short = Short;
globalThis.Byte = Byte;
globalThis.Long = Long;
globalThis.Thread = Thread;
globalThis.Random = Random;
globalThis.StringBuffer = StringBuffer;
globalThis.StringBuilder = StringBuilder;
globalThis.System = System;
globalThis.ResourceManager = ResourceManager;
globalThis.Graphics = Graphics;
globalThis.Image = Image;
globalThis.Manager = Manager;
globalThis.RecordStore = RecordStore;
globalThis.createArray = createArray;
globalThis.createMultiArray = createMultiArray;
globalThis.arraycopy = arraycopy;
globalThis.makeString = makeString;


export class EntityInterface {
    getBounds() {}
    checkHitBox(var1, var2, var3) {}
    getStateValue(var1) {}
    isActive() {}
    testCollision(var1) {}
    interactWithEntity(var1, var2) {}
    updateTick() {}
    applyAction(var1) {}
    checkIntersect(var1) {}
    isAlive() {}
}
globalThis.EntityInterface = EntityInterface;


export class TransformTable {
    static val_arr_int_a = null;
    static {
        let var0 = null;
        ((var0 = createArray(64, 0))[0] = 0);
        (var0[1] = 1);
        (var0[2] = 2);
        (var0[3] = 3);
        (var0[4] = 4);
        (var0[5] = 5);
        (var0[6] = 6);
        (var0[7] = 7);
        (var0[8] = 1);
        (var0[9] = 2);
        (var0[10] = 3);
        (var0[11] = 0);
        (var0[12] = 5);
        (var0[13] = 6);
        (var0[14] = 7);
        (var0[15] = 4);
        (var0[16] = 2);
        (var0[17] = 3);
        (var0[18] = 0);
        (var0[19] = 1);
        (var0[20] = 6);
        (var0[21] = 7);
        (var0[22] = 4);
        (var0[23] = 5);
        (var0[24] = 3);
        (var0[25] = 0);
        (var0[26] = 1);
        (var0[27] = 2);
        (var0[28] = 7);
        (var0[29] = 4);
        (var0[30] = 5);
        (var0[31] = 6);
        (var0[32] = 4);
        (var0[33] = 7);
        (var0[34] = 6);
        (var0[35] = 5);
        (var0[36] = 0);
        (var0[37] = 3);
        (var0[38] = 2);
        (var0[39] = 1);
        (var0[40] = 5);
        (var0[41] = 4);
        (var0[42] = 7);
        (var0[43] = 6);
        (var0[44] = 1);
        (var0[45] = 0);
        (var0[46] = 3);
        (var0[47] = 2);
        (var0[48] = 6);
        (var0[49] = 5);
        (var0[50] = 4);
        (var0[51] = 7);
        (var0[52] = 2);
        (var0[53] = 1);
        (var0[54] = 0);
        (var0[55] = 3);
        (var0[56] = 7);
        (var0[57] = 6);
        (var0[58] = 5);
        (var0[59] = 4);
        (var0[60] = 3);
        (var0[61] = 2);
        (var0[62] = 1);
        (var0[63] = 0);
        (TransformTable.val_arr_int_a = var0);
    }
}
globalThis.TransformTable = TransformTable;
globalThis.TransformTable = TransformTable;


export class PatternTable {
    static val_arr_arr_byte_a = null;
    static {
        let var0 = createArray(8, null);
        let var1 = null;
        ((var1 = createArray(8, 0))[0] = 5);
        (var1[1] = 0);
        (var1[2] = 1);
        (var1[3] = 0);
        (var1[4] = 1);
        (var1[5] = 3);
        (var1[6] = 7);
        (var1[7] = 2);
        (var0[0] = var1);
        ((var1 = createArray(8, 0))[0] = 0);
        (var1[1] = 0);
        (var1[2] = 0);
        (var1[3] = 1);
        (var1[4] = 3);
        (var1[5] = 2);
        (var1[6] = 0);
        (var1[7] = 4);
        (var0[1] = var1);
        ((var1 = createArray(8, 0))[0] = 4);
        (var1[1] = 0);
        (var1[2] = 1);
        (var1[3] = 1);
        (var1[4] = 1);
        (var1[5] = 3);
        (var1[6] = 0);
        (var1[7] = 5);
        (var0[2] = var1);
        ((var1 = createArray(8, 0))[0] = 3);
        (var1[1] = 0);
        (var1[2] = 2);
        (var1[3] = 1);
        (var1[4] = 2);
        (var1[5] = 1);
        (var1[6] = 0);
        (var1[7] = 6);
        (var0[3] = var1);
        ((var1 = createArray(8, 0))[0] = 1);
        (var1[1] = 0);
        (var1[2] = 0);
        (var1[3] = 2);
        (var1[4] = 6);
        (var1[5] = 5);
        (var1[6] = 1);
        (var1[7] = 7);
        (var0[4] = var1);
        ((var1 = createArray(8, 0))[0] = 6);
        (var1[1] = 1);
        (var1[2] = 1);
        (var1[3] = 2);
        (var1[4] = 4);
        (var1[5] = 6);
        (var1[6] = 2);
        (var1[7] = 7);
        (var0[5] = var1);
        ((var1 = createArray(8, 0))[0] = 2);
        (var1[1] = 0);
        (var1[2] = 2);
        (var1[3] = 2);
        (var1[4] = 5);
        (var1[5] = 4);
        (var1[6] = 3);
        (var1[7] = 7);
        (var0[6] = var1);
        ((var1 = createArray(8, 0))[0] = -1);
        (var1[1] = 2);
        (var1[2] = 1);
        (var1[3] = 3);
        (var1[4] = 4);
        (var1[5] = 6);
        (var1[6] = 5);
        (var1[7] = 0);
        (var0[7] = var1);
        (PatternTable.val_arr_arr_byte_a = var0);
    }
}
globalThis.PatternTable = PatternTable;
globalThis.PatternTable = PatternTable;


export class ResourceSlotTable {
    static val_arr_byte_a = null;
    static val_arr_arr_int_a = null;
    static {
        let var0 = null;
        ((var0 = createArray(9, 0))[0] = 0);
        (var0[1] = 1);
        (var0[2] = 2);
        (var0[3] = 3);
        (var0[4] = 4);
        (var0[5] = 5);
        (var0[6] = 6);
        (var0[7] = 7);
        (var0[8] = 8);
        (ResourceSlotTable.val_arr_byte_a = var0);
        let var2 = createArray(9, null);
        let var1 = null;
        ((var1 = createArray(4, 0))[0] = 0);
        (var1[1] = 1);
        (var1[2] = 0);
        (var1[3] = -1);
        (var2[0] = var1);
        ((var1 = createArray(4, 0))[0] = 0);
        (var1[1] = 3);
        (var1[2] = 2);
        (var1[3] = -1);
        (var2[1] = var1);
        ((var1 = createArray(4, 0))[0] = 0);
        (var1[1] = 6);
        (var1[2] = 4);
        (var1[3] = -1);
        (var2[2] = var1);
        ((var1 = createArray(4, 0))[0] = 0);
        (var1[1] = 6);
        (var1[2] = 4);
        (var1[3] = 5);
        (var2[3] = var1);
        ((var1 = createArray(4, 0))[0] = 0);
        (var1[1] = 10);
        (var1[2] = 7);
        (var1[3] = -1);
        (var2[4] = var1);
        ((var1 = createArray(4, 0))[0] = 0);
        (var1[1] = 10);
        (var1[2] = 7);
        (var1[3] = 8);
        (var2[5] = var1);
        ((var1 = createArray(4, 0))[0] = 0);
        (var1[1] = 10);
        (var1[2] = 7);
        (var1[3] = 9);
        (var2[6] = var1);
        ((var1 = createArray(4, 0))[0] = 0);
        (var1[1] = 14);
        (var1[2] = 12);
        (var1[3] = 13);
        (var2[7] = var1);
        ((var1 = createArray(4, 0))[0] = 0);
        (var1[1] = 14);
        (var1[2] = 12);
        (var1[3] = -1);
        (var2[8] = var1);
        (ResourceSlotTable.val_arr_arr_int_a = var2);
    }
}
globalThis.ResourceSlotTable = ResourceSlotTable;
globalThis.ResourceSlotTable = ResourceSlotTable;


export class AudioMetaTable {
    static val_arr_byte_a = null;
    static val_arr_int_a = null;
    static val_arr_byte_b = null;
    static val_arr_byte_c = null;
    static val_arr_byte_d = null;
    static val_arr_int_b = null;
    static val_arr_byte_e = null;
    static val_arr_int_c = null;
    static {
        let var0 = null;
        ((var0 = createArray(55, 0))[0] = 0);
        (var0[1] = 1);
        (var0[2] = 2);
        (var0[3] = 3);
        (var0[4] = 4);
        (var0[5] = 5);
        (var0[6] = 6);
        (var0[7] = 7);
        (var0[8] = 8);
        (var0[9] = 9);
        (var0[10] = 10);
        (var0[11] = 11);
        (var0[12] = 12);
        (var0[13] = 13);
        (var0[14] = 14);
        (var0[15] = 15);
        (var0[16] = 16);
        (var0[17] = 17);
        (var0[18] = 18);
        (var0[19] = 19);
        (var0[20] = 20);
        (var0[21] = 21);
        (var0[22] = 22);
        (var0[23] = 23);
        (var0[24] = 24);
        (var0[25] = 25);
        (var0[26] = 26);
        (var0[27] = 27);
        (var0[28] = 28);
        (var0[29] = 29);
        (var0[30] = 30);
        (var0[31] = 31);
        (var0[32] = 32);
        (var0[33] = 33);
        (var0[34] = 34);
        (var0[35] = 35);
        (var0[36] = 36);
        (var0[37] = 37);
        (var0[38] = 38);
        (var0[39] = 39);
        (var0[40] = 40);
        (var0[41] = 41);
        (var0[42] = 42);
        (var0[43] = 43);
        (var0[44] = 44);
        (var0[45] = 45);
        (var0[46] = 46);
        (var0[47] = 47);
        (var0[48] = 48);
        (var0[49] = 49);
        (var0[50] = 50);
        (var0[51] = 51);
        (var0[52] = 52);
        (var0[53] = 53);
        (var0[54] = 54);
        (AudioMetaTable.val_arr_byte_a = (var0));
        let var0_int = createArray(55, 0);
        (var0_int[0] = 31);
        (var0_int[1] = 32);
        (var0_int[2] = 33);
        (var0_int[3] = 34);
        (var0_int[4] = 35);
        (var0_int[5] = 36);
        (var0_int[6] = 37);
        (var0_int[7] = 38);
        (var0_int[8] = 39);
        (var0_int[9] = 40);
        (var0_int[10] = 41);
        (var0_int[11] = 42);
        (var0_int[12] = 43);
        (var0_int[13] = 44);
        (var0_int[14] = 45);
        (var0_int[15] = 46);
        (var0_int[16] = 47);
        (var0_int[17] = 48);
        (var0_int[18] = 49);
        (var0_int[19] = 50);
        (var0_int[20] = 51);
        (var0_int[21] = 52);
        (var0_int[22] = 53);
        (var0_int[23] = 54);
        (var0_int[24] = 55);
        (var0_int[25] = 56);
        (var0_int[26] = 57);
        (var0_int[27] = 58);
        (var0_int[28] = 59);
        (var0_int[29] = 60);
        (var0_int[30] = 61);
        (var0_int[31] = 62);
        (var0_int[32] = 63);
        (var0_int[33] = 64);
        (var0_int[34] = 65);
        (var0_int[35] = 66);
        (var0_int[36] = 67);
        (var0_int[37] = 68);
        (var0_int[38] = 69);
        (var0_int[39] = 70);
        (var0_int[40] = 71);
        (var0_int[41] = 72);
        (var0_int[42] = 73);
        (var0_int[43] = 74);
        (var0_int[44] = 75);
        (var0_int[45] = 76);
        (var0_int[46] = 77);
        (var0_int[47] = 78);
        (var0_int[48] = 79);
        (var0_int[49] = 80);
        (var0_int[50] = 81);
        (var0_int[51] = 82);
        (var0_int[52] = 83);
        (var0_int[53] = 84);
        (var0_int[54] = 85);
        (AudioMetaTable.val_arr_int_a = var0_int);
        let var2 = null;
        ((var2 = createArray(55, 0))[0] = 1);
        (var2[1] = 1);
        (var2[2] = 1);
        (var2[3] = 1);
        (var2[4] = 1);
        (var2[5] = 0);
        (var2[6] = 1);
        (var2[7] = 0);
        (var2[8] = 0);
        (var2[9] = 0);
        (var2[10] = 0);
        (var2[11] = 0);
        (var2[12] = 0);
        (var2[13] = 0);
        (var2[14] = 0);
        (var2[15] = 0);
        (var2[16] = 0);
        (var2[17] = 0);
        (var2[18] = 1);
        (var2[19] = 1);
        (var2[20] = 1);
        (var2[21] = 1);
        (var2[22] = 1);
        (var2[23] = 1);
        (var2[24] = 1);
        (var2[25] = 1);
        (var2[26] = 1);
        (var2[27] = 1);
        (var2[28] = 0);
        (var2[29] = 0);
        (var2[30] = 0);
        (var2[31] = 0);
        (var2[32] = 0);
        (var2[33] = 0);
        (var2[34] = 0);
        (var2[35] = 0);
        (var2[36] = 0);
        (var2[37] = 0);
        (var2[38] = 0);
        (var2[39] = 0);
        (var2[40] = 0);
        (var2[41] = 0);
        (var2[42] = 0);
        (var2[43] = 0);
        (var2[44] = 0);
        (var2[45] = 0);
        (var2[46] = 0);
        (var2[47] = 0);
        (var2[48] = 0);
        (var2[49] = 0);
        (var2[50] = 0);
        (var2[51] = 0);
        (var2[52] = 0);
        (var2[53] = 0);
        (var2[54] = 0);
        (AudioMetaTable.val_arr_byte_b = (var2));
        ((var2 = createArray(55, 0))[0] = 0);
        (var2[1] = 0);
        (var2[2] = 0);
        (var2[3] = 0);
        (var2[4] = 0);
        (var2[5] = 0);
        (var2[6] = 0);
        (var2[7] = 0);
        (var2[8] = 0);
        (var2[9] = 0);
        (var2[10] = 0);
        (var2[11] = 0);
        (var2[12] = 0);
        (var2[13] = 0);
        (var2[14] = 0);
        (var2[15] = 0);
        (var2[16] = 0);
        (var2[17] = 0);
        (var2[18] = 0);
        (var2[19] = 0);
        (var2[20] = 0);
        (var2[21] = 0);
        (var2[22] = 0);
        (var2[23] = 0);
        (var2[24] = 0);
        (var2[25] = 0);
        (var2[26] = 0);
        (var2[27] = 0);
        (var2[28] = 0);
        (var2[29] = 0);
        (var2[30] = 0);
        (var2[31] = 0);
        (var2[32] = 0);
        (var2[33] = 0);
        (var2[34] = 0);
        (var2[35] = 0);
        (var2[36] = 0);
        (var2[37] = 0);
        (var2[38] = 0);
        (var2[39] = 0);
        (var2[40] = 0);
        (var2[41] = 0);
        (var2[42] = 0);
        (var2[43] = 0);
        (var2[44] = 0);
        (var2[45] = 0);
        (var2[46] = 0);
        (var2[47] = 0);
        (var2[48] = 0);
        (var2[49] = 0);
        (var2[50] = 0);
        (var2[51] = 0);
        (var2[52] = 0);
        (var2[53] = 0);
        (var2[54] = 0);
        (AudioMetaTable.val_arr_byte_c = var2);
        ((var2 = createArray(16, 0))[0] = 0);
        (var2[1] = 1);
        (var2[2] = 2);
        (var2[3] = 3);
        (var2[4] = 4);
        (var2[5] = 5);
        (var2[6] = 6);
        (var2[7] = 7);
        (var2[8] = 8);
        (var2[9] = 9);
        (var2[10] = 10);
        (var2[11] = 11);
        (var2[12] = 12);
        (var2[13] = 13);
        (var2[14] = 14);
        (var2[15] = 15);
        (AudioMetaTable.val_arr_byte_d = var2);
        let var2_int = [7800, 3900, 2200, 4900, 3700];
        (AudioMetaTable.val_arr_int_b = var2_int);
        let var6 = null;
        ((var6 = createArray(16, 0))[0] = 1);
        (var6[1] = 1);
        (var6[2] = 1);
        (var6[3] = 1);
        (var6[4] = 1);
        (var6[5] = 0);
        (var6[6] = 0);
        (var6[7] = 0);
        (var6[8] = 0);
        (var6[9] = 0);
        (var6[10] = 0);
        (var6[11] = 1);
        (var6[12] = 1);
        (var6[13] = 1);
        (var6[14] = 1);
        (var6[15] = 0);
        (AudioMetaTable.val_arr_byte_e = (var6));
        let var6_int = createArray(16, 0);
        (var6_int[0] = 16);
        (var6_int[1] = 20);
        (var6_int[2] = 17);
        (var6_int[3] = 18);
        (var6_int[4] = 19);
        (var6_int[5] = 15);
        (var6_int[6] = 21);
        (var6_int[7] = 25);
        (var6_int[8] = 22);
        (var6_int[9] = 23);
        (var6_int[10] = 24);
        (var6_int[11] = 26);
        (var6_int[12] = 27);
        (var6_int[13] = 28);
        (var6_int[14] = 29);
        (var6_int[15] = 30);
        (AudioMetaTable.val_arr_int_c = var6_int);
    }
}
globalThis.AudioMetaTable = AudioMetaTable;
globalThis.AudioMetaTable = AudioMetaTable;


export class CharacterPresetTable {
    static val_arr_arr_int_a = null;
    static {
        let var0 = createArray(5, null);
        let var1 = null;
        ((var1 = createArray(24, 0))[0] = 117440567);
        (var1[1] = 117440566);
        (var1[2] = 117440565);
        (var1[3] = 0);
        (var1[4] = 0);
        (var1[5] = 0);
        (var1[6] = 1);
        (var1[7] = -1);
        (var1[8] = 7);
        (var1[9] = 32);
        (var1[10] = 24);
        (var1[11] = 11);
        (var1[12] = 64);
        (var1[13] = 170);
        (var1[14] = 192);
        (var1[15] = 256);
        (var1[16] = 256);
        (var1[17] = 256);
        (var1[18] = 256);
        (var1[19] = 0);
        (var1[20] = 0);
        (var1[21] = 24);
        (var1[22] = 4);
        (var1[23] = 10);
        (var0[0] = var1);
        ((var1 = createArray(24, 0))[0] = 117440564);
        (var1[1] = 117440563);
        (var1[2] = 117440562);
        (var1[3] = 0);
        (var1[4] = 0);
        (var1[5] = 0);
        (var1[6] = -2);
        (var1[7] = -1);
        (var1[8] = 6);
        (var1[9] = 48);
        (var1[10] = 24);
        (var1[11] = 12);
        (var1[12] = 64);
        (var1[13] = 170);
        (var1[14] = 192);
        (var1[15] = 256);
        (var1[16] = 256);
        (var1[17] = 256);
        (var1[18] = 256);
        (var1[19] = 0);
        (var1[20] = 0);
        (var1[21] = 24);
        (var1[22] = 1);
        (var1[23] = 7);
        (var0[1] = var1);
        ((var1 = createArray(24, 0))[0] = 117440555);
        (var1[1] = 117440554);
        (var1[2] = 117440553);
        (var1[3] = 0);
        (var1[4] = 0);
        (var1[5] = 0);
        (var1[6] = 4);
        (var1[7] = 4);
        (var1[8] = 5);
        (var1[9] = 32);
        (var1[10] = 24);
        (var1[11] = 12);
        (var1[12] = 64);
        (var1[13] = 16);
        (var1[14] = 64);
        (var1[15] = 256);
        (var1[16] = 256);
        (var1[17] = 256);
        (var1[18] = 256);
        (var1[19] = 40);
        (var1[20] = 20);
        (var1[21] = 24);
        (var1[22] = 0);
        (var1[23] = 6);
        (var0[2] = var1);
        ((var1 = createArray(24, 0))[0] = 117440558);
        (var1[1] = 117440557);
        (var1[2] = 117440556);
        (var1[3] = 0);
        (var1[4] = 0);
        (var1[5] = 0);
        (var1[6] = -2);
        (var1[7] = -2);
        (var1[8] = -2);
        (var1[9] = 48);
        (var1[10] = 24);
        (var1[11] = 12);
        (var1[12] = 64);
        (var1[13] = 128);
        (var1[14] = 192);
        (var1[15] = 256);
        (var1[16] = 85);
        (var1[17] = 128);
        (var1[18] = 256);
        (var1[19] = 40);
        (var1[20] = 20);
        (var1[21] = 24);
        (var1[22] = 2);
        (var1[23] = 8);
        (var0[3] = var1);
        ((var1 = createArray(24, 0))[0] = 117440561);
        (var1[1] = 117440560);
        (var1[2] = 117440559);
        (var1[3] = 0);
        (var1[4] = 0);
        (var1[5] = 0);
        (var1[6] = 0);
        (var1[7] = -1);
        (var1[8] = 7);
        (var1[9] = 48);
        (var1[10] = 24);
        (var1[11] = 11);
        (var1[12] = 64);
        (var1[13] = 128);
        (var1[14] = 192);
        (var1[15] = 256);
        (var1[16] = 85);
        (var1[17] = 128);
        (var1[18] = 256);
        (var1[19] = 986634);
        (var1[20] = 526085);
        (var1[21] = 24);
        (var1[22] = 3);
        (var1[23] = 9);
        (var0[4] = var1);
        (CharacterPresetTable.val_arr_arr_int_a = var0);
    }
}
globalThis.CharacterPresetTable = CharacterPresetTable;
globalThis.CharacterPresetTable = CharacterPresetTable;


export class SceneBase {
    sceneTimers = null;
    isSceneActive = false;
    isSceneVisible = false;
    isScenePaused = false;
    isTransitioning = false;
    sceneStateId = 0;
    sceneConfigShorts = createArray(33, 0);
    sceneDuration = 0;
    sceneCompleteFlag = false;
    sceneExtraShorts = createArray(33, 0);
    constructor() {
        (this.isSceneVisible = true);
        (this.isScenePaused = true);
        (this.sceneStateId = 0);
        (this.sceneCompleteFlag = true);
        (CoreEngine.val_globalcontext_a.currentScene = this);
        let var1 = CoreEngine.val_globalcontext_a;
        if ((CoreEngine.val_globalcontext_a.serviceNodeB) === (null)) {
            (var1.serviceNodeB = new ContextServiceNode(4));
        }
        (this.sceneTimers = createArray(2, 0));
        (this.sceneTimers[0] = Date.now());
        (this.sceneTimers[1] = 0);
    }
}
globalThis.SceneBase = SceneBase;
globalThis.SceneBase = SceneBase;


export class AbstractImage {
    imageWidth = 0;
    imageHeight = 0;
    getImage() {}
}
globalThis.AbstractImage = AbstractImage;
globalThis.AbstractImage = AbstractImage;


export class FeatureFlag {
    flagEnabled = false;
}
globalThis.FeatureFlag = FeatureFlag;
globalThis.FeatureFlag = FeatureFlag;


export class ConcreteImage extends AbstractImage {
    underlyingImage = null;
    constructor(...args) {
        super();
        if (args.length === 0) {
            this._init_0();
        }
        else if (args.length === 1) {
            this._init_1(args[0]);
        }
    }
    _init_0() {

    }
    _init_1(var1) {
        let var2 = null;
        (var2 = makeString(CoreEngine.exec_a_tokenstring_to_string(var1)));
        let var4 = var2;
        if ((var2.charAt(0)) !== ('/')) {
            (var4 = ('/' + var2));
        }
        try {
            (this.underlyingImage = Image.createImage(var4));
        } catch (var3) {

        }
        if ((this.underlyingImage) !== (null)) {
            (this.imageWidth = (((this.underlyingImage.getWidth()) << 16) >> 16));
            (this.imageHeight = (((this.underlyingImage.getHeight()) << 16) >> 16));
        }
    }
    getImage() {
        return this.underlyingImage;
    }
}
globalThis.ConcreteImage = ConcreteImage;
globalThis.ConcreteImage = ConcreteImage;


export class SpriteImage {
    sourceImage = null;
    constructor(...args) {
        if (args.length === 0) {
            this._init_0();
        }
        else if (args.length === 1) {
            this._init_1(args[0]);
        }
        else if (args.length === 3) {
            this._init_2(args[0], args[1], args[2]);
        }
    }
    _init_0() {
        (this.sourceImage = new ConcreteImage());
    }
    _init_1(var1) {
        (this.sourceImage = new ConcreteImage(CoreEngine.exec_a_string_to_tokenstring(var1)));
    }
    _init_2(var1, var2, var3) {
        (this.sourceImage = new ConcreteImage());
        let var4 = null;
        ((var4 = (this.sourceImage)).underlyingImage = Image.createImage(var1, var2, var3));
        (var4.imageWidth = (((var4.underlyingImage.getWidth()) << 16) >> 16));
        (var4.imageHeight = (((var4.underlyingImage.getHeight()) << 16) >> 16));
    }
}
globalThis.SpriteImage = SpriteImage;
globalThis.SpriteImage = SpriteImage;


export class RenderContext {
    clipColor = 0;
    viewportCoords = null;
    clipBounds = null;
    targetGraphics = null;
    constructor(var1) {
        let var2 = null;
        ((var2 = createArray(3, 0))[0] = var1[0]);
        (var2[1] = var1[1]);
        (var2[2] = var1[2]);
        (this.clipBounds = var2);
        let var5 = (((var1[0]) << 16) >> 16);
        let var4 = (((var1[1]) << 16) >> 16);
        let var3 = null;
        ((var3 = createArray(4, 0))[0] = 0);
        (var3[1] = 0);
        (var3[2] = var5);
        (var3[3] = var4);
        (this.viewportCoords = var3);
    }
}
globalThis.RenderContext = RenderContext;
globalThis.RenderContext = RenderContext;


export class GrowableByteBuffer {
    bufferData = null;
    byteCount = 0;
    maxCapacity = 32;
}
globalThis.GrowableByteBuffer = GrowableByteBuffer;
globalThis.GrowableByteBuffer = GrowableByteBuffer;


export class PackedResourceStream extends InputStream {
    underlyingStream = null;
    streamLength = 0;
    currentOffset = 0;
    resourceId = 0;
    chunkSize = 0;
    remainingBytes = 0;
    resourceName = null;
    constructor(var1) {
        super();
        if (!CoreEngine.val_bool_a) {
            CoreEngine.exec_f_to_void();
        }
        let var2 = CoreEngine.exec_a_int_to_arr_int(var1);
        (this.chunkSize = var2[0]);
        (this.currentOffset = var2[1]);
        (this.resourceId = var2[2]);
        (this.remainingBytes = var2[3]);
        (this.resourceName = ((("/df" + this.chunkSize) + "_") + this.remainingBytes));
        if (((((CoreEngine.val_inputstream_a) !== (null) && (this.chunkSize) === (CoreEngine.val_int_b)) && (CoreEngine.val_int_d) === (this.remainingBytes)) && (CoreEngine.val_int_c <= this.currentOffset))) {
            (this.underlyingStream = CoreEngine.val_inputstream_a);
            (CoreEngine.val_inputstream_a = null);
            CoreEngine.skipStreamBytes(this.underlyingStream, (this.currentOffset - CoreEngine.val_int_c));
        } else {
            (this.underlyingStream = CoreEngine.midletInstance.getResourceAsStream(this.resourceName));
            if ((this.currentOffset > 0)) {
                CoreEngine.skipStreamBytes(this.underlyingStream, this.currentOffset);
            }
        }
        (this.streamLength = 0);
    }
    close() {
        if (((CoreEngine.val_inputstream_a) !== (null) && (CoreEngine.val_inputstream_a) !== (this.underlyingStream))) {
            CoreEngine.val_inputstream_a.close();
        }
        (CoreEngine.val_inputstream_a = this.underlyingStream);
        (CoreEngine.val_int_b = this.chunkSize);
        (CoreEngine.val_int_c = (this.currentOffset + this.streamLength));
        (CoreEngine.val_int_d = this.remainingBytes);
    }
    read(...args) {
        if (args.length === 0) {
            return this._read_0();
        }
        else if (args.length === 1) {
            return this._read_1(args[0]);
        }
        else if (args.length === 3) {
            return this._read_2(args[0], args[1], args[2]);
        }
        return this._read_2(args[0], args[1], args[2]);
    }
    _read_0() {
        if ((this.streamLength >= this.resourceId)) {
            return -1;
        }
        this.streamLength++;
        return this.underlyingStream.read();
    }
    _read_1(var1) {
        return this.read(var1, 0, var1.length);
    }
    _read_2(var1, var2, var3) {
        if ((this.streamLength >= this.resourceId)) {
            return -1;
        }
        let var4 = var3;
        if (((this.streamLength + var3) > this.resourceId)) {
            (var4 = (this.resourceId - this.streamLength));
        }
        if (((var4 = CoreEngine.bufferedStreamRead(this.underlyingStream, var1, var2, var4))) !== (-1)) {
            (this.streamLength += var4);
        }
        return var4;
    }
    available() {
        return (this.resourceId - this.streamLength);
    }
    skip(var1) {
        if (((var1 = CoreEngine.skipStreamBytes(this.underlyingStream, var1)) > 0)) {
            (this.streamLength = (((this.streamLength + var1)) | 0));
        }
        return var1;
    }
    reset() {
        (this.underlyingStream = CoreEngine.midletInstance.getResourceAsStream(this.resourceName));
        CoreEngine.skipStreamBytes(this.underlyingStream, this.currentOffset);
        (this.streamLength = 0);
    }
}
globalThis.PackedResourceStream = PackedResourceStream;
globalThis.PackedResourceStream = PackedResourceStream;


export class TokenString {
    tokenShortArray = null;
    constructor(...args) {
        if (args.length === 0) {
            this._init_0();
        }
        else if (args.length === 1) {
            this._init_1(args[0]);
        }
    }
    _init_0() {
        CoreEngine.exec_a_arr_short_int_tokenstring_to_void([0], 0, this);
    }
    _init_1(var1) {
        CoreEngine.exec_a_arr_short_int_tokenstring_to_void(var1, CoreEngine.exec_a_arr_short_to_int(var1), this);
    }
    equals(var1) {
        if (!(var1 instanceof TokenString)) {
            return false;
        }
        let var2 = (var1);
        let var4 = CoreEngine.exec_a_arr_short_to_int(this.tokenShortArray);
        let var5 = false;
        if ((CoreEngine.exec_a_arr_short_to_int(var2.tokenShortArray)) !== (var4)) {
            (var5 = false);
        } else {
            let var3 = var2.tokenShortArray;
            let var6 = 0;
            while (true) {
                if ((var6 >= var4)) {
                    (var5 = true);
                    break;
                }
                if ((this.tokenShortArray[var6]) !== (var3[var6])) {
                    (var5 = false);
                    break;
                }
                var6++;
            }
        }
        return var5;
    }
}
globalThis.TokenString = TokenString;
globalThis.TokenString = TokenString;


export class TokenWrapper {
    wrappedToken = new TokenString();
}
globalThis.TokenWrapper = TokenWrapper;
globalThis.TokenWrapper = TokenWrapper;


export class GlobalContext {
    currentScene = null;
    gameMidletLoop = null;
    gameFlowController = null;
    rootAudioContext = null;
    serviceNodeA = null;
    serviceNodeB = null;
    serviceNodeC = null;
}
globalThis.GlobalContext = GlobalContext;
globalThis.GlobalContext = GlobalContext;


export class AudioPlaybackContext {
    channelId = 0;
    nextContext = null;
    prevContext = null;
    contextPool = null;
    volumeLevel = 0;
    priorityLevel = 0;
    isPlaying = false;
    isPaused = false;
    playbackPosition = 0;
    activeClipNode = null;
    val_audioclipnode_b = null;
    val_arr_int_a = null;
    val_arr_audioclipnode_a = null;
    constructor(var1) {
        (this.channelId = (((var1) << 16) >> 16));
        switch (var1) {
            case 1:
                (this.contextPool = null);
                (this.volumeLevel = 255);
                (this.prevContext = new AudioPlaybackContext(3));
                (this.priorityLevel = CoreEngine.exec_a_audioplaybackcontext_to_short(this));
                (CoreEngine.val_globalcontext_a.rootAudioContext = this);
                let var3 = createArray(1, null);
                for (let var2 = 0; (var2 <= 0); var2++) {
                    (var3[0] = new AudioPlaybackContext(0));
                }
                (this.contextPool = var3);
                return;
            case 2:
                (this.volumeLevel = 255);
                return;
            case 3:
                (this.val_arr_audioclipnode_a = createArray(CoreEngine.audioChannelCount, null));
                (this.val_arr_int_a = createArray(CoreEngine.audioChannelCount, 0));
                return;
            default:
                (this.nextContext = new AudioPlaybackContext(2));
        }
    }
}
globalThis.AudioPlaybackContext = AudioPlaybackContext;
globalThis.AudioPlaybackContext = AudioPlaybackContext;


export class AudioClipNode {
    rawAudioData = null;
    nextClip = null;
    prevClip = null;
    mediaPlayer = null;
    clipName = null;
    parentClip = null;
    clipSoundId = 0;
    constructor(...args) {
        if (args.length === 1) {
            this._init_0(args[0]);
        }
        else if (args.length === 2 && args[0] instanceof AudioClipNode) {
            this._init_1(args[0], args[1]);
        }
        else if (args.length === 2) {
            this._init_2(args[0], args[1]);
        }
    }
    _init_0(var1) {
        if ((var1) !== (1)) {
            if ((var1) === (2)) {
                (this.clipName = makeString());
                (this.prevClip = new AudioClipNode(0));
            }
        } else {
            (this.nextClip = new AudioClipNode(2));
        }
    }
    _init_1(var1, var2) {
        (this.nextClip = new AudioClipNode(2));
        (this.nextClip.clipName = var2);
        (this.nextClip.prevClip = var1);
        if (var1 && var1.clipSoundId !== undefined) {
            (this.nextClip.clipSoundId = var1.clipSoundId);
        }
    }
    _init_2(var1, var2) {
        (this.clipSoundId = var2);
        let var4 = null;
        (var4 = new AudioClipNode(0));
        (var4.rawAudioData = var1);
        (var4.clipSoundId = var2);
        let var3 = makeString("Undefined");
        const firstByte = (var1 && var1.length > 0) ? (var1[0] < 0 ? var1[0] + 256 : var1[0]) : 0;
        switch (firstByte) {
            case 255:
            case -1:
            case 73:
                (var3 = "audio/mpeg");
                break;
            case 35:
                (var3 = "audio/amr");
                break;
            case 77:
                (var3 = "audio/midi");
                break;
            case 82:
                (var3 = "audio/x-wav");
        }
        let var5 = new AudioClipNode(var4, var3);
        (this.parentClip = var5);
    }
}
globalThis.AudioClipNode = AudioClipNode;
globalThis.AudioClipNode = AudioClipNode;


export class AudioManager {
    audioClipNodes = null;
    isAudioEnabled = false;
    currentSoundId = 0;
    loopCount = 0;
    playbackContext = CoreEngine.exec_a_audioplaybackcontext_to_audioplaybackcontext(CoreEngine.getGlobalAudioContext());
    constructor() {
        (this.audioClipNodes = new JVector());
        (this.isAudioEnabled = true);
        (this.currentSoundId = 0);
        (this.loopCount = -1);
    }
    unloadClip(var1) {
        if (((var1 = this.findClipIndex(var1))) !== (-1)) {
            this.audioClipNodes.elementAt(var1);
            this.audioClipNodes.removeElementAt(var1);
        }
    }
    setLooping(var1) {
        let var2 = false;
        if (((var1) !== (0) && (var1) !== (1))) {
            (var2 = true);
        } else {
            (var2 = false);
        }
        CoreEngine.exec_a_bool_audioplaybackcontext_to_void(var2, this.playbackContext);
    }
    playSound(var1) {
        if (this.isAudioEnabled) {
            if (((this.currentSoundId) !== (1) || !CoreEngine.isChannelActive(this.playbackContext))) {
                this.stopSound();
                if ((this.findClipIndex(var1)) === (-1)) {
                    let var2 = null;
                    (var2 = new AudioClipNode(CoreEngine.exec_a_int_to_arr_byte(var1), var1));
                    this.audioClipNodes.addElement(var2);
                }
                if ((var1) !== (this.loopCount)) {
                    let var3 = this.findClipIndex(var1);
                    CoreEngine.assignClipToChannel((this.audioClipNodes.elementAt(var3)).parentClip, this.playbackContext);
                    (this.loopCount = var1);
                }
                CoreEngine.resumeAudioChannel(this.playbackContext);
            }
        }
    }
    stopSound() {
        if ((this.loopCount) !== (-1)) {
            if ((this.loopCount) === (this.loopCount)) {
                CoreEngine.pauseAudioChannel(this.playbackContext);
            }
        }
    }
    findClipIndex(var1) {
        for (let var2 = 0; (var2 < this.audioClipNodes.size()); var2++) {
            if (((this.audioClipNodes.elementAt(var2)).clipSoundId) === (var1)) {
                return var2;
            }
        }
        return -1;
    }
}
globalThis.AudioManager = AudioManager;
globalThis.AudioManager = AudioManager;


export class EffectActor {
    effectCoordinates = null;
    isEffectActive = false;
    effectType = 0;
    effectDuration = 0;
    effectFrame = 0;
    effectMaxFrames = 0;
    effectPosX = 0;
    effectPosY = 0;
    effectVelocityX = 0;
    effectVelocityY = 0;
    effectAccelerationX = 0;
    effectAccelerationY = 0;
    effectScale = 0;
    effectVisible = false;
    effectLooping = false;
    effectAttached = false;
    effectAlpha = 0;
    effectFlipped = false;
    val_animationset_a = null;
    val_animationset_b = null;
    val_spritepartsequence_a = null;
    val_spritepartsequence_b = null;
    effectRotation = 0;
    effectFinished = false;
    effectPalette = 0;
    effectPriority = 0;
    effectTargetX = 0;
    effectTargetY = 0;
    val_bool_g = false;
    isActive() {
        let var1 = false;
        if ((this.effectAccelerationX) === (2)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    getBounds() {
        return this.effectCoordinates;
    }
    checkIntersect(var1) {
        return false;
    }
    checkHitBox(var1, var2, var3) {
        return false;
    }
    getStateValue(var1) {
        return 0;
    }
    testCollision(var1) {
        let var2 = false;
        if (((this.effectPosX) === (0) && (this.effectPosY) === (0))) {
            (var2 = false);
        } else {
            (this.effectDuration = this.effectPosX);
            (this.effectFrame = this.effectPosY);
            (this.effectMaxFrames = this.effectVelocityX);
            if (((this.effectType) === (0) && this.effectAttached)) {
                (this.effectPosX = ((CoreEngine.exec_a_int_int_to_int(0, 32) - 16) + this.effectPosX));
                (this.effectPosY = ((CoreEngine.exec_a_int_int_to_int(0, 32) - 16) + this.effectPosY));
            }
            (var1[0] = this.effectCoordinates[7]);
            (var1[1] = 0);
            (var1[2] = this.effectVelocityX);
            (var1[3] = (this.effectPosX << 8));
            (var1[4] = (this.effectPosY << 8));
            (var1[1] = this.effectVelocityY);
            if ((this.effectAccelerationY) === (5)) {
                if ((this.effectPosX > 0)) {
                    (this.effectFinished = true);
                    (this.effectRotation = this.val_spritepartsequence_a.getPartXOffset(0));
                } else {
                    (this.effectFinished = false);
                    (this.effectRotation = this.val_spritepartsequence_a.getPartXOffset((this.val_spritepartsequence_a.partOffsets.length - 1)));
                }
            }
            (this.effectPosX = 0);
            (this.effectPosY = 0);
            (this.effectTargetX = this.effectCoordinates[0]);
            (this.effectTargetY = this.effectCoordinates[1]);
            (var2 = true);
        }
        return var2;
    }
    interactWithEntity(var1, var2) {
        return 0;
    }
    applyAction(var1) {
        switch (var1) {
            case 8:
                if (this.isEffectActive) {
                    let var2 = false;
                    if ((this.effectType < 2)) {
                        this.effectType++;
                        (this.effectPosX = (((Math.trunc((this.effectDuration) / (2))) << 16) >> 16));
                        (this.effectPosY = (((Math.trunc((Math.abs(this.effectFrame)) / (2))) << 16) >> 16));
                        (this.effectVelocityX = (((Math.trunc((this.effectMaxFrames) / (2))) << 16) >> 16));
                        (this.effectCoordinates[7] = 5);
                        (var2 = true);
                    } else {
                        (var2 = false);
                    }
                    if (!var2) {
                        (this.isEffectActive = false);
                        (this.effectRotation = 0);
                        return;
                    }
                } else {
                    if (this.effectLooping) {
                        CoreEngine.exec_a_effectactor_to_void(this);
                    }
                }
        }
    }
    updateTick() {

    }
    isAlive() {
        return false;
    }
}
globalThis.EffectActor = EffectActor;
globalThis.EffectActor = EffectActor;


export class AsyncWorkerThread extends Thread {
    threadPriority = 0;
    constructor(var1) {
        super();
        (this.threadPriority = var1);
    }
    run() {
        CoreEngine.exec_c_byte_to_void(this.threadPriority);
        CoreEngine.exec_d_to_bool();
    }
}
globalThis.AsyncWorkerThread = AsyncWorkerThread;
globalThis.AsyncWorkerThread = AsyncWorkerThread;


export class SpritePartSequence {
    frameOffsets = null;
    frameDurations = null;
    partOffsets = null;
    totalFrames = 0;
    sequenceFlags = 0;
    constructor(var1, var2, var3, var4) {
        (this.frameOffsets = createArray((var2 * 3), 0));
        if ((var1) !== (var2)) {
            (this.frameDurations = createArray(var1, 0));
        }
        (this.partOffsets = createArray(var1, 0));
        (this.totalFrames = (var3 | (var4 << 8)));
    }
    setPlaybackMode(var1) {
        (this.totalFrames = ((this.totalFrames & -4) | var1));
    }
    isMultiPart() {
        let var1 = false;
        if ((this.frameDurations) !== (null)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    getFrameCount() {
        return this.partOffsets.length;
    }
    getTotalDuration() {
        return this.sequenceFlags;
    }
    getStartPartIndex(var1) {
        let var2 = var1;
        if ((this.isMultiPart() && (var1) !== (0))) {
            (var2 = ((this.frameDurations[(var1 - 1)] & 255) + 1));
        }
        return var2;
    }
    getEndPartIndex(var1) {
        let var2 = var1;
        if (this.isMultiPart()) {
            (var2 = (this.frameDurations[var1] & 255));
        }
        return var2;
    }
    calculateBounds(var1, var2) {
        let var8 = this.partOffsets.length;
        let var9 = CoreEngine.val_arr_int_c;
        this.renderPart(0, var1, var9, 2);
        let var4 = var9[2];
        let var3 = var9[3];
        let var5 = var9[4];
        let var6 = var9[5];
        for (let var7 = 0; (var7 < var8); var7++) {
            this.renderPart(var7, var1, var9, 2);
            (var4 = Math.min(var4, var9[2]));
            (var3 = Math.min(var3, var9[3]));
            (var5 = Math.max(var5, var9[4]));
            (var6 = Math.max(var6, var9[5]));
        }
        (var2[0] = var4);
        (var2[1] = var3);
        (var2[2] = var5);
        (var2[3] = var6);
    }
    getSequenceWidth(var1) {
        this.calculateBounds(var1, CoreEngine.val_arr_int_d);
        return (CoreEngine.val_arr_int_d[2] - CoreEngine.val_arr_int_d[0]);
    }
    getSequenceHeight(var1) {
        this.calculateBounds(var1, CoreEngine.val_arr_int_d);
        return (CoreEngine.val_arr_int_d[3] - CoreEngine.val_arr_int_d[1]);
    }
    getFrameDelay(var1) {
        this.calculateBounds(var1, CoreEngine.val_arr_int_d);
        return CoreEngine.val_arr_int_d[0];
    }
    renderPart(var1, var2, var3, var4) {
        let var5 = (this.getStartPartIndex(var1) * 3);
        let var13 = (this.getEndPartIndex(var1) * 3);
        let var15 = CoreEngine.val_arr_int_c;
        this.renderFrameAt(var5, var2, 0, var15);
        let var6 = -var15[0];
        let var7 = -var15[1];
        let var8 = var6;
        let var9 = var7;
        while ((var5 <= var13)) {
            let var10 = var5;
            let var16 = 0;
            let var10003 = (var16 = this.frameOffsets[var10]);
            this.renderFrameAt(var5, var2, 0, var15);
            (var10 = -var15[0]);
            let var11 = -var15[1];
            let var12 = (var2.getPartMinX(var10003) + var10);
            let var10001 = (var2.getPartMaxX(var16) + var11);
            (var6 = Math.min(var6, var10));
            (var7 = Math.min(var7, var11));
            (var8 = Math.max(var8, var12));
            (var9 = Math.max(var9, var10001));
            (var5 += 3);
        }
        let var19 = (var4 + 1);
        let var10002 = (var4 + 1);
        (var3[var4] = var6);
        (var13 = (var10002 + 1));
        (var3[var19] = var7);
        (var19 = (var13 + 1));
        (var3[var13] = var8);
        (var3[var19] = var9);
    }
    renderFrameAt(var1, var2, var3, var4) {
        let var6 = this.frameOffsets[(var1 + 1)];
        let var5 = this.frameOffsets[(var1 + 2)];
        let var7 = var6;
        switch (var3) {
            case 0:
            default:
                break;
            case 1:
                (var7 = var5);
                (var5 = (var2.getPartMinX(this.frameOffsets[var1]) - var6));
                break;
            case 2:
                (var7 = (var2.getPartMinX(this.frameOffsets[var1]) - var6));
                (var5 = (var2.getPartMaxX(this.frameOffsets[var1]) - var5));
                break;
            case 3:
                (var7 = (var2.getPartMaxX(this.frameOffsets[var1]) - var5));
                (var5 = var6);
                break;
            case 4:
                (var7 = (var2.getPartMinX(this.frameOffsets[var1]) - var6));
                break;
            case 5:
                (var7 = var5);
                (var5 = var6);
                break;
            case 6:
                (var7 = var6);
                (var5 = (var2.getPartMaxX(this.frameOffsets[var1]) - var5));
                break;
            case 7:
                (var7 = (var2.getPartMaxX(this.frameOffsets[var1]) - var5));
                (var5 = (var2.getPartMinX(this.frameOffsets[var1]) - var6));
        }
        (var4[0] = var7);
        (var4[1] = var5);
    }
    getPartXOffset(var1) {
        let var2 = 0;
        if ((var1) === (0)) {
            (var2 = 0);
        } else {
            (var2 = this.partOffsets[(var1 - 1)]);
        }
        return CoreEngine.exec_a_int_int_int_to_int(var2, var1, 1);
    }
    getPartYOffset(var1, var2) {
        let var3 = (var1 & 3);
        let var4 = ((var1 & 65532) >>> 2);
        (var1 >>>= 16);
        switch (var3) {
            case 1:
                (var1 += var2);
                break;
            case 2:
                (var1 -= var2);
        }
        switch ((this.totalFrames & 3)) {
            case 0:
                if (((var1 >= this.sequenceFlags) || (var1 <= 0))) {
                    (var3 = 0);
                }
                break;
            case 1:
                if ((var1 >= this.sequenceFlags)) {
                    (var1 -= this.sequenceFlags);
                    (var4 = 0);
                } else {
                    if ((var1 < 0)) {
                        (var1 += this.sequenceFlags);
                        (var4 = this.partOffsets.length);
                    }
                }
                break;
            case 2:
                if ((var1 < 0)) {
                    (var3 = 1);
                } else {
                    if ((var1 >= this.sequenceFlags)) {
                        (var3 = 2);
                    }
                }
        }
        switch (var3) {
            case 1:
                (var2 = (this.partOffsets.length - 1));
                while (((var4 < var2) && (var1 >= this.partOffsets[var4]))) {
                    var4++;
                }
                break;
            case 2:
                while (((var4 > 0) && (var1 < this.partOffsets[(var4 - 1)]))) {
                    var4--;
                }
        }
        return CoreEngine.exec_a_int_int_int_to_int(var1, var4, var3);
    }
    drawSequence(var1, var2, var3, var4, var5) {
        let var6 = 0;
        (var1 = this.getStartPartIndex((var6 = ((var1 & 65532) >>> 2))));
        let var10000 = this.getEndPartIndex(var6);
        (var6 = (var1 + (var1 << 1)));
        let var7 = (var10000 + (var10000 << 1));
        let var16 = CoreEngine.val_arr_int_c;
        while ((var6 <= var7)) {
            this.renderFrameAt(var6, var2, var5, var16);
            let var9 = var6;
            let var10001 = this.frameOffsets[var9];
            let var10002 = (var3 - var16[0]);
            let var12 = (var4 - var16[1]);
            let var11 = var10002;
            let var18 = var10001;
            let var8 = var2;
            let var10 = TransformTable.val_arr_int_a[(CoreEngine.val_arr_int_b[var8.animDurationArray[var18]] + (var5 << 3))];
            let u64 = BigInt(var8.val_arr_long_a[(var8.animPriorityBytes[var18] & 0xFF)]);
            let srcX = Number((u64 >> 48n) & 0xFFFFn);
            let srcY = Number((u64 >> 32n) & 0xFFFFn);
            let w = Number((u64 >> 16n) & 0xFFFFn);
            let h = Number(u64 & 0xFFFFn);
            CoreEngine.val_graphicsadapter_a.drawRegion(var8.getCurrentFrame(), srcX, srcY, w, h, CoreEngine.val_arr_int_a[var10], var11, var12, 20);
            (var6 += 3);
        }
    }
}
globalThis.SpritePartSequence = SpritePartSequence;
globalThis.SpritePartSequence = SpritePartSequence;


export class ContextServiceNode {
    val_short_a = 0;
    val_featureflag_a = null;
    val_contextservicenode_a = null;
    val_object_a = null;
    val_arr_byte_a = null;
    val_arr_short_a = null;
    val_arr_short_b = null;
    val_arr_short_c = null;
    val_arr_byte_b = null;
    val_object_b = null;
    constructor(var1) {
        (this.val_short_a = (((var1) << 16) >> 16));
        switch (var1) {
            case 1:
                return;
            case 2:
                return;
            case 3:
                return;
            case 4:
                CoreEngine.exec_a_int_int_scenebase_to_void(7, 5, CoreEngine.val_globalcontext_a.currentScene);
                CoreEngine.exec_a_int_int_scenebase_to_void(13, 5, CoreEngine.val_globalcontext_a.currentScene);
                CoreEngine.exec_a_int_int_scenebase_to_void(9, 6, CoreEngine.val_globalcontext_a.currentScene);
                CoreEngine.exec_a_int_int_scenebase_to_void(10, 6, CoreEngine.val_globalcontext_a.currentScene);
                CoreEngine.exec_a_int_int_scenebase_to_void(14, 6, CoreEngine.val_globalcontext_a.currentScene);
                return;
            case 5:
                (this.val_contextservicenode_a = new ContextServiceNode(2));
                return;
            case 6:
                return;
            default:
                (this.val_featureflag_a = new FeatureFlag());
        }
    }
}
globalThis.ContextServiceNode = ContextServiceNode;
globalThis.ContextServiceNode = ContextServiceNode;


export class EncodedTextBuffer {
    textBytes = null;
    textLength = 0;
    bufferCapacity = 0;
    encodingType = 0;
    flagsByte = 0;
    secondaryBytes = null;
    childBuffers = null;
    constructor(...args) {
        if (args.length === 0) {
            this._init_0();
        }
        else if (args.length === 1 && typeof args[0] === 'string') {
            this._init_1(args[0]);
        }
        else if (args.length === 1 && typeof args[0] === 'number') {
            this._init_2(args[0]);
        }
        else if (args.length === 2) {
            this._init_3(args[0], args[1]);
        }
    }
    _init_0() {

    }
    _init_1(var1) {
        (this.textLength = 0);
        (this.bufferCapacity = var1.length);
        (this.encodingType = this.bufferCapacity);
        (this.flagsByte = 65);
        (this.textBytes = createArray(this.encodingType, 0));
        for (let var2 = 0; (var2 < this.textBytes.length); var2++) {
            (this.textBytes[var2] = 0);
        }
        for (let var3 = 0; (var3 < this.bufferCapacity); var3++) {
            (this.textBytes[var3] = (((var1.charAt(var3)) << 24) >> 24));
        }
    }
    _init_2(var1) {
        (this.flagsByte = -64);
        (this.textBytes = createArray((var1 << 1), 0));
        (this.encodingType = var1);
        (this.textLength = 0);
        (this.bufferCapacity = 0);
    }
    _init_3(var1, var2) {
        (this.flagsByte = 65);
        (this.textLength = 0);
        (this.textBytes = CoreEngine.exec_a_to_fontcharmap().formatInt(var1));
        (this.bufferCapacity = CoreEngine.exec_a_arr_short_to_int(CoreEngine.exec_a_tokenstring_to_arr_short(CoreEngine.exec_a_string_to_tokenstring(makeString(this.textBytes)))));
        (this.encodingType = this.bufferCapacity);
    }
    isWritable() {
        let var1 = false;
        if (((this.flagsByte & 128)) !== (0)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    appendBuffer(var1) {
        if (!this.isWritable()) {
            return this;
        }
        let var2 = ((((this.flagsByte & 63)) << 24) >> 24);
        let var5 = 0;
        if (((((var5 = ((((var1.flagsByte & 63)) << 24) >> 24))) !== (var2) && (var5) !== (1)) && (var2) !== (0))) {
            return this;
        }
        let var3 = this.textLength;
        let var4 = 0;
        if ((var2) === (0)) {
            (var4 = (this.bufferCapacity << 1));
        } else {
            (var4 = this.bufferCapacity);
        }
        CoreEngine.exec_a_to_fontcharmap().renderText(var1.textBytes, var1.textLength, this.textBytes, (var3 + var4), (((var1.bufferCapacity) << 16) >> 16), var5, var2);
        (this.bufferCapacity = (this.bufferCapacity + var1.bufferCapacity));
        return this;
    }
    appendString(var1) {
        if (!this.isWritable()) {
            return this;
        }
        let var2 = var1.length;
        let var3 = this.bufferCapacity;
        (this.bufferCapacity += var2);
        for (let var4 = 0; (var4 < var2); var4++) {
            this.setCharAt((var3 + var4), var1.charAt(var4));
        }
        return this;
    }
    appendInt(var1) {
        if (!this.isWritable()) {
            return this;
        }
        if ((this.secondaryBytes) === (null)) {
            (this.secondaryBytes = createArray(11, 0));
        }
        let var2 = 10;
        let var3 = var1;
        if ((var1 < 0)) {
            (var3 = -var3);
        }
        for (let var5 = 10; (var5 >= 0); var5--) {
            (this.secondaryBytes[var5] = (((((var3 % 10) | 48)) << 24) >> 24));
            (var3 = Math.trunc(var3 / (10)));
            if ((this.secondaryBytes[var5]) !== (48)) {
                (var2 = var5);
            }
        }
        if ((var1 < 0)) {
            (this.secondaryBytes[--var2] = 45);
        }
        let var6 = ((((11 - var2)) << 16) >> 16);
        let var7 = ((((this.flagsByte & 63)) << 24) >> 24);
        let var4 = this.textLength;
        let var8 = 0;
        if ((var7) === (0)) {
            (var8 = (this.bufferCapacity << 1));
        } else {
            (var8 = this.bufferCapacity);
        }
        CoreEngine.exec_a_to_fontcharmap().renderText(this.secondaryBytes, var2, this.textBytes, (var4 + var8), var6, 1, var7);
        (this.bufferCapacity += var6);
        return this;
    }
    setCharAt(var1, var2) {
        if (this.isWritable()) {
            let var3 = ((((this.flagsByte & 63)) << 24) >> 24);
            let var5 = 0;
            let var4 = (var5 = (((var2) << 16) >> 16));
            if (((var5 > 127) && (var3) !== (0))) {
                let var8 = null;
                (var4 = ((((CoreEngine.exec_a_arr_short_int_int_int_int_fontcharmap_to_int((var8 = CoreEngine.exec_a_to_fontcharmap()).val_arr_short_d, var5, 0, 127, 128, var8) + 128)) << 16) >> 16));
            }
            (var2 = ((this.textLength) & 0xFFFF));
            if ((var3) === (0)) {
                (var1 <<= 1);
            }
            (var2 += var1);
            if ((var3) === (0)) {
                (this.textBytes[var2++] = ((((var4 >> 8)) << 24) >> 24));
            }
            (this.textBytes[var2] = (((var4) << 24) >> 24));
        }
    }
    getCharAt(var1) {
        let var2 = 0;
        return (((this.flagsByte & 63)) === (0) ? ((((((this.textBytes[(var2 = (this.textLength + (var1 << 1)))] & 255) << 8) | (this.textBytes[(var2 + 1)] & 0xFF))) << 16) >> 16) : ((((this.textBytes[(this.textLength + var1)] & 0xFF)) << 16) >> 16));
    }
    concatAll(var1) {
        let var2 = null;
        (var2 = new EncodedTextBuffer());
        (var2.flagsByte = ((((this.flagsByte & 63)) << 24) >> 24));
        (var2.textLength = 0);
        let var3 = 0;
        for (let var4 = 0; (var4 < this.bufferCapacity); var4++) {
            if ((this.getCharAt(var4)) === (92)) {
                if ((++var4 < this.bufferCapacity)) {
                    let var5 = 0;
                    if (((var5 = this.getCharAt(var4))) === (92)) {
                        var3--;
                    } else {
                        if (((var5 >= 48) && (var5 <= 90))) {
                            (var5 -= 48);
                            if ((((var1[var5].flagsByte & 63)) !== (var2.flagsByte) && ((var1[var5].flagsByte & 63)) !== (1))) {
                                (var2.flagsByte = 0);
                            }
                            (var3 += (var1[var5].bufferCapacity - 2));
                        }
                    }
                }
            }
        }
        (var2.flagsByte = ((((var2.flagsByte | 64)) << 24) >> 24));
        (var2.bufferCapacity = ((((this.bufferCapacity + var3)) << 16) >> 16));
        (var2.encodingType = var2.bufferCapacity);
        let var11 = 0;
        if (((var2.flagsByte & 63)) === (0)) {
            (var11 = (var2.bufferCapacity << 1));
        } else {
            (var11 = var2.bufferCapacity);
        }
        (var2.textBytes = createArray(var11, 0));
        (var11 = 0);
        (var3 = 0);
        let var6 = 0;
        if (((this.flagsByte & 63)) === (0)) {
            (var6 = 2);
        } else {
            (var6 = 1);
        }
        for (let var9 = 0; (var9 < this.bufferCapacity); var9++) {
            if ((this.getCharAt(var9)) === (92)) {
                (var11 += CoreEngine.exec_a_to_fontcharmap().renderText(this.textBytes, (this.textLength + (var3 * var6)), var2.textBytes, var11, ((((var9 - var3)) << 16) >> 16), (this.flagsByte & 63), (var2.flagsByte & 63)));
                (var3 = var9++);
                if ((var9 < this.bufferCapacity)) {
                    let var7 = 0;
                    if (((var7 = this.getCharAt(var9))) === (92)) {
                        (var3 = var9);
                    } else {
                        if (((var7 >= 48) && (var7 <= 90))) {
                            (var7 -= 48);
                            (var11 += CoreEngine.exec_a_to_fontcharmap().renderText(var1[var7].textBytes, var1[var7].textLength, var2.textBytes, var11, (((var1[var7].bufferCapacity) << 16) >> 16), (var1[var7].flagsByte & 63), (var2.flagsByte & 63)));
                            (var3 = (var9 + 1));
                        }
                    }
                }
            }
        }
        CoreEngine.exec_a_to_fontcharmap().renderText(this.textBytes, (this.textLength + (var3 * var6)), var2.textBytes, var11, ((((this.bufferCapacity - var3)) << 16) >> 16), (this.flagsByte & 63), (var2.flagsByte & 63));
        return var2;
    }
    copyFrom(var1) {
        if ((this.childBuffers) === (null)) {
            (this.childBuffers = createArray(1, null));
        }
        (this.childBuffers[0] = var1);
        return this.concatAll(this.childBuffers);
    }
    substring(var1) {
        if ((this.childBuffers) === (null)) {
            (this.childBuffers = createArray(1, null));
        }
        (this.childBuffers[0] = new EncodedTextBuffer(var1, (((0) << 24) >> 24)));
        let var10000 = this.concatAll(this.childBuffers);
        (this.childBuffers[0] = null);
        return var10000;
    }
    prepend(var1) {
        let var2 = ((((this.flagsByte & 63)) << 24) >> 24);
        let var4 = ((((var1.flagsByte & 63)) << 24) >> 24);
        let var5 = null;
        (var5 = new EncodedTextBuffer());
        (var5.bufferCapacity = (this.bufferCapacity + var1.bufferCapacity));
        (var5.encodingType = var5.bufferCapacity);
        (var5.textLength = 0);
        if (((var2) !== (var4) && (var4) !== (1))) {
            (var5.flagsByte = 0);
        } else {
            (var5.flagsByte = var2);
        }
        let var3 = 0;
        if ((var5.flagsByte) === (0)) {
            (var3 = (var5.bufferCapacity << 1));
        } else {
            (var3 = var5.bufferCapacity);
        }
        (var5.textBytes = createArray(var3, 0));
        (var3 = CoreEngine.exec_a_to_fontcharmap().renderText(this.textBytes, this.textLength, var5.textBytes, 0, (((this.bufferCapacity) << 16) >> 16), var2, var5.flagsByte));
        CoreEngine.exec_a_to_fontcharmap().renderText(var1.textBytes, var1.textLength, var5.textBytes, var3, (((var1.bufferCapacity) << 16) >> 16), var4, var5.flagsByte);
        (var5.flagsByte = ((((var5.flagsByte | 64)) << 24) >> 24));
        return var5;
    }
    toString() {
        let var1 = null;
        (var1 = new StringBuffer(this.bufferCapacity));
        for (let var2 = 0; (var2 < this.bufferCapacity); var2++) {
            let var3 = 0;
            let var4 = 0;
            if ((((var3 = this.getCharAt(var2)) > 127) && ((this.flagsByte & 63)) !== (0))) {
                (var4 = ((CoreEngine.exec_a_to_fontcharmap().val_arr_short_d[(var3 - 128)]) & 0xFFFF));
            } else {
                (var4 = ((var3) & 0xFFFF));
            }
            var1.append(var4);
        }
        return var1.toString();
    }
}
globalThis.EncodedTextBuffer = EncodedTextBuffer;
globalThis.EncodedTextBuffer = EncodedTextBuffer;


export class GraphicsAdapter {
    renderContext = null;
    drawLine(var1, var2, var3, var4) {
        let var5 = var4;
        (var4 = var3);
        (var3 = var2);
        (var2 = var1);
        this.renderContext.targetGraphics.drawLine(var2, var3, var4, var5);
    }
    drawRect(var1, var2, var3, var4) {
        let var10003 = (var3 + 1);
        let var5 = (var4 + 1);
        (var4 = var10003);
        (var3 = var2);
        (var2 = var1);
        this.renderContext.targetGraphics.drawRect(var2, var3, (var4 + -1), (var5 + -1));
    }
    drawRegion(var1, var2, var3, var4, var5, var6, var7, var8, var9) {
        let var10000 = this.renderContext;
        let var10001 = var1.sourceImage.getImage();
        let var10006 = CoreEngine.getTransformMask(var6);
        let var10 = var9;
        (var9 = var8);
        (var8 = var7);
        (var7 = var10006);
        (var6 = var5);
        (var5 = var4);
        (var4 = var3);
        (var3 = var2);
        let var11 = var10001;
        var10000.targetGraphics.drawRegion(var11, var3, var4, var5, var6, (var7 >>> 16), var8, var9, var10);
    }
    drawRGB(var1, var2, var3, var4, var5, var6) {
        let var10001 = var1;
        let var7 = var3;
        (var6 = var6);
        (var5 = var5);
        (var4 = var4);
        (var3 = var2);
        let var8 = var10001;
        this.renderContext.targetGraphics.drawRGB(var8, var3, var7, var4, var5, var6, 1, true);
    }
    fillRect(var1, var2, var3, var4) {
        let var5 = var4;
        (var4 = var3);
        (var3 = var2);
        (var2 = var1);
        this.renderContext.targetGraphics.fillRect(var2, var3, var4, var5);
    }
    fillTriangle(var1, var2, var3, var4, var5, var6) {
        let var7 = var6;
        (var6 = var5);
        (var5 = var4);
        (var4 = var3);
        (var3 = var2);
        (var2 = var1);
        this.renderContext.targetGraphics.fillTriangle(var2, var3, var4, var5, var6, var7);
    }
    setClip(var1, var2, var3, var4) {
        let var5 = var4;
        (var4 = var3);
        (var3 = var2);
        (var2 = var1);
        this.renderContext.targetGraphics.setClip(var2, var3, var4, var5);
    }
    setColor(var1) {
        (var1 = var1);
        this.renderContext.targetGraphics.setColor((var1 & 16777215));
    }
    drawImage(var1, var2, var3, var4) {
        this.drawRegion(var1, 0, 0, var1.sourceImage.imageWidth, var1.sourceImage.imageHeight, 0, var2, var3, var4);
    }
}
globalThis.GraphicsAdapter = GraphicsAdapter;
globalThis.GraphicsAdapter = GraphicsAdapter;


export class ActorStateMachine {
    actorState = 0;
    actorSubState = 0;
    actorPosX = 0;
    actorPosY = 0;
    isActorActive = false;
    actorFacingDirection = 0;
    actorCurrentAnimation = 0;
    actorActionFrame = 0;
    actorTimer = 0;
    actorBoundsArray = createArray(11, 0);
    val_coreengine_a = null;
    val_coreengine_b = null;
    actorGroundedFlag = false;
    actorVelocityX = 0;
    setPosition(var1, var2) {
        (this.actorBoundsArray[0] = (var1 << 8));
        (this.actorBoundsArray[1] = (var2 << 8));
    }
    setFacingDirection(var1) {
        switch (var1) {
            case 2:
                if (((((this.actorActionFrame) !== (3) && (this.actorActionFrame) !== (5)) && (this.actorActionFrame) !== (4)) && (this.actorActionFrame) !== (1))) {
                    this.setActionFrame(0);
                } else {
                    this.setActionFrame(3);
                }
                (this.isActorActive = false);
                CoreEngine.exec_b_entityinterface_int_to_void(this, this.actorTimer);
                break;
            case 3:
                (this.isActorActive = true);
                CoreEngine.exec_a_entityinterface_int_to_void(this, this.actorTimer);
                (this.val_coreengine_b = null);
        }
        (this.actorCurrentAnimation = var1);
    }
    setAnimation(var1) {
        (this.actorSubState = var1);
        (this.actorState = 1);
    }
    setActionFrame(var1) {
        label37: switch (var1) {
            case 0:
                if ((this.actorActionFrame) === (4)) {
                    this.resetAnimation();
                } else {
                    this.setAnimation(0);
                }
                break;
            case 1:
                if (((this.actorActionFrame) === (4) || (this.actorActionFrame) === (6))) {
                    CoreEngine.exec_a_int_int_bool_bool_to_void(this.val_coreengine_a.exec_a_to_int(), this.getPosY(), false, false);
                    this.setFacingDirection(3);
                    return;
                }
                (this.actorVelocityX = 0);
                this.setAnimation(1);
                if ((this.actorActionFrame) === (2)) {
                    this.clearState();
                } else {
                    if ((this.actorActionFrame) === (3)) {
                        this.setAnimation(3);
                        this.setPosition(this.val_coreengine_a.exec_a_to_int(), (this.val_coreengine_a.exec_b_to_int() + -12));
                        this.val_coreengine_a.updateActor(32);
                    } else {
                        if ((this.actorActionFrame) === (1)) {
                            this.setPosition(this.val_coreengine_a.exec_a_to_int(), this.getPosY());
                        } else {
                            if ((this.actorActionFrame) === (5)) {
                                CoreEngine.exec_a_int_int_to_void(this.val_coreengine_a.exec_a_to_int(), (this.val_coreengine_a.exec_b_to_int() - 78));
                            }
                        }
                    }
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
        (this.actorPosY = 0);
        (this.actorPosX = var1);
    }
    resetAnimation() {
        (this.actorSubState = 0);
        let var10001 = this.getCurrentSequence();
        let var1 = var10001.sequenceFlags;
        let var2 = (var10001.partOffsets.length - 1);
        (this.actorState = CoreEngine.exec_a_int_int_int_to_int(var1, var2, 1));
    }
    getCurrentSequence() {
        return ((((CoreEngine.val_arr_arr_spritepartsequence_a) !== (null) && (this.actorSubState >= 0)) && (this.actorSubState < CoreEngine.val_arr_arr_spritepartsequence_a[this.actorActionFrame].length)) ? CoreEngine.val_arr_arr_spritepartsequence_a[this.actorActionFrame][this.actorSubState] : null);
    }
    isAnimationFinished() {
        let var1 = false;
        if ((CoreEngine.exec_g_int_to_int(this.actorState)) === (0)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    getPosY() {
        return (this.actorBoundsArray[1] >> 8);
    }
    clearState() {
        let var1 = 0;
        if ((this.actorFacingDirection > 0)) {
            (var1 = 2);
        } else {
            (var1 = 1);
        }
        let var2 = this.getAnimationDuration();
        let var3 = this.getY();
        let var4 = 0;
        if ((this.val_coreengine_a.characterId) === (5)) {
            (var4 = 1);
        } else {
            (var4 = 0);
        }
        CoreEngine.exec_a_int_int_int_int_to_void(var1, var2, var3, var4);
    }
    translatePosition(var1, var2) {
        (var1 = (this.actorBoundsArray[0] + var1));
        (this.actorBoundsArray[0] = var1);
        (var2 = (this.actorBoundsArray[1] + var2));
        (this.actorBoundsArray[1] = var2);
    }
    isActive() {
        return true;
    }
    getBounds() {
        return this.actorBoundsArray;
    }
    checkIntersect(var1) {
        return true;
    }
    checkHitBox(var1, var2, var3) {
        let var4 = this.getAnimationDuration();
        let var5 = this.getY();
        let var6 = null;
        switch (var1) {
            case 1:
                switch (this.actorPosX) {
                    case 0:
                        (var6 = CoreEngine.val_arr_arr_short_a[this.actorActionFrame]);
                        break;
                    case 3:
                        if ((this.actorPosY > 130)) {
                            (var6 = CoreEngine.val_arr_arr_short_b[this.actorActionFrame]);
                        }
                }
            default:
                if ((var6) !== (null)) {
                    (var2[var3] = (var5 + var6[0]));
                    (var2[(var3 + 3)] = (var5 + var6[3]));
                    if ((this.actorFacingDirection) === (1)) {
                        (var2[(var3 + 1)] = (var4 + var6[1]));
                        (var2[(var3 + 2)] = (var4 + var6[2]));
                    } else {
                        (var2[(var3 + 1)] = (var4 - var6[2]));
                        (var2[(var3 + 2)] = (var4 - var6[1]));
                    }
                    return true;
                } else {
                    return false;
                }
        }
    }
    getStateValue(var1) {
        return (((var1) !== (1) || ((this.actorPosX) !== (0) && (this.actorPosX) !== (3))) ? 0 : 1);
    }
    testCollision(var1) {
        return false;
    }
    interactWithEntity(var1, var2) {
        return 0;
    }
    applyAction(var1) {

    }
    updateTick() {

    }
    getAnimationDuration() {
        return (this.actorBoundsArray[0] >> 8);
    }
    getY() {
        return (this.actorBoundsArray[1] >> 8);
    }
    isGrounded() {
        let var1 = false;
        if ((this.actorCurrentAnimation) === (2)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    getPosX() {
        switch (this.actorActionFrame) {
            case 3:
                let var1 = 0;
                if ((this.actorPosX) === (1)) {
                    (var1 = Math.trunc(((-106496 * Math.min(900, this.actorPosY))) / (900)));
                }
                return (var1 + 65536);
            default:
                return 81920;
        }
    }
    isAlive() {
        return false;
    }
}
globalThis.ActorStateMachine = ActorStateMachine;
globalThis.ActorStateMachine = ActorStateMachine;


export class InputManager extends Canvas {
    pressedKeyBitmask = 0;
    releasedKeyBitmask = 0;
    repeatedKeyBitmask = 0;
    activeKeyBitmask = 0;
    graphicsAdapter = new GraphicsAdapter();
    constructor() {
        super();
        CoreEngine.exec_b_to_contextservicenode();
        CoreEngine.exec_b_to_contextservicenode();
    }
    getWidth() {
        return CoreEngine.exec_a_arr_int_to_int(CoreEngine.exec_c_to_arr_int());
    }
    getHeight() {
        return CoreEngine.exec_b_arr_int_to_int(CoreEngine.exec_c_to_arr_int());
    }
    keyPressed(var1) {
        this.handleKeyEvent(CoreEngine.exec_c_int_to_int(var1), true);
    }
    keyReleased(var1) {
        this.handleKeyEvent(CoreEngine.exec_c_int_to_int(var1), false);
    }
    keyRepeated(var1) {

    }
    paint(var1) {

    }
    handleKeyEvent(var1, var2) {
        if ((this.activeKeyBitmask <= 0)) {
            let var3 = 0;
            switch (var1) {
                case 1:
                    (var3 = 1);
                    break;
                case 2:
                    (var3 = 2);
                    break;
                case 3:
                    (var3 = 4);
                    break;
                case 4:
                    (var3 = 8);
                    break;
                case 5:
                case 6:
                default:
                    (var3 = 0);
                    break;
                case 7:
                    (var3 = 16);
                    break;
                case 8:
                    (var3 = 1048576);
                    break;
                case 9:
                    (var3 = 524288);
                    break;
                case 10:
                    (var3 = 8388608);
                    break;
                case 11:
                    (var3 = 2097152);
                    break;
                case 12:
                    (var3 = 4194304);
                    break;
                case 13:
                    (var3 = 32);
                    break;
                case 14:
                    (var3 = 64);
                    break;
                case 15:
                    (var3 = 262144);
                    break;
                case 16:
                    (var3 = 131072);
                    break;
                case 17:
                    (var3 = 128);
                    break;
                case 18:
                    (var3 = 256);
                    break;
                case 19:
                    (var3 = 512);
                    break;
                case 20:
                    (var3 = 1024);
                    break;
                case 21:
                    (var3 = 2048);
                    break;
                case 22:
                    (var3 = 4096);
                    break;
                case 23:
                    (var3 = 8192);
                    break;
                case 24:
                    (var3 = 16384);
                    break;
                case 25:
                    (var3 = 32768);
                    break;
                case 26:
                    (var3 = 65536);
            }
            if ((var3) === (0)) {
                if ((CoreEngine.exec_d_int_to_int(var1)) !== (0)) {
                    CoreEngine.exec_a_to_long();
                    if (var2) {
                        return;
                    }
                    return;
                }
            } else {
                CoreEngine.exec_a_to_long();
                let var4 = CoreEngine.exec_a_to_rootgamestate().flowController;
                if (var2) {
                    (this.releasedKeyBitmask |= var3);
                    (this.pressedKeyBitmask |= var3);
                    var4.handleKeyPress(var3);
                    return;
                }
                (this.repeatedKeyBitmask |= var3);
                (this.pressedKeyBitmask &= ~var3);
                var4.handleKeyRelease(var3);
            }
        }
    }
}
globalThis.InputManager = InputManager;
globalThis.InputManager = InputManager;


export class MarketPanelController {
    val_short_a = 0;
    val_int_a = 0;
    val_int_b = -1;
    val_int_c = -1;
    val_int_d = -1;
    val_arr_string_a = null;
    val_arr_short_a = null;
    val_arr_short_b = null;
    val_arr_short_c = null;
    val_arr_int_a = null;
    val_arr_string_b = null;
    val_arr_string_c = null;
    val_arr_short_d = createArray(11, 0);
    val_arr_encodedtextbuffer_a = createArray(11, null);
    val_arr_object_a = null;
    val_int_e = 0;
    val_bool_a = false;
    val_int_f = 0;
    val_bool_b = true;
    val_int_g = 0;
    val_int_h = 0;
    val_int_i = 0;
    val_int_F = 0;
    val_string_a = null;
    val_spriteimage_a = null;
    val_spriteimage_b = null;
    val_short_b = -1;
    val_short_c = -1;
    val_int_j = 0;
    val_int_k = 0;
    val_int_l = 0;
    val_arr_short_e = null;
    val_arr_short_f = null;
    val_arr_short_g = null;
    val_arr_short_h = null;
    val_string_b = null;
    val_encodedtextbuffer_a = null;
    val_encodedtextbuffer_b = null;
    val_encodedtextbuffer_c = null;
    val_bool_c = true;
    val_bool_d = true;
    val_int_m = 0;
    val_int_G = 0;
    val_int_n = 0;
    val_int_o = 0;
    val_int_p = 0;
    val_int_q = 6;
    val_int_r = 0;
    val_int_s = 0;
    val_int_t = 0;
    val_int_u = 0;
    val_int_v = 0;
    val_int_w = 0;
    val_bool_e = false;
    val_int_x = 0;
    val_int_y = 0;
    val_int_z = 0;
    val_int_A = 0;
    val_int_B = 0;
    val_arr_arr_short_a = null;
    val_arr_arr_short_b = null;
    val_arr_short_i = null;
    val_arr_arr_short_c = null;
    val_arr_arr_string_a = null;
    val_arr_encodedtextbuffer_b = null;
    val_encodedtextbuffer_d = null;
    val_int_C = 0;
    val_int_D = 0;
    val_encodedtextbuffer_e = null;
    val_encodedtextbuffer_f = null;
    val_arr_spriteimage_a = null;
    val_int_E = 0;
    constructor(var1, var2) {
        (this.val_int_d = var1);
        (this.val_int_c = var2);
        for (let var3 = 0; (var3 < CoreEngine.val_arr_byte_a.length); var3++) {
            (CoreEngine.val_arr_byte_a[var3] = -1);
        }
    }
    isAvailable() {
        if (((this.val_arr_int_a) === (null) || CoreEngine.val_bool_m)) {
            this.showOffer();
        }
        let var1 = false;
        if ((this.val_int_e) !== (0)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    showOffer() {
        let var4 = null;
        if (((var4 = CoreEngine.exec_a_string_to_string("MG_Impl"))) === (null)) {
            (this.val_int_e = 0);
        } else {
            if (!((var4 = var4.toLowerCase()) !== null && (var4 = var4.toLowerCase()).equals("static"))) {
                if (var4.equals("wapstatic")) {

                }
                if (var4.equals("wap")) {
                    (this.val_int_e = 2);
                } else {
                    if (!var4.equals("wapstatic")) {
                        (this.val_int_e = 0);
                        return;
                    }
                    (this.val_int_e = 3);
                }
            } else {
                (this.val_int_e = 1);
            }
            let var5 = null;
            if ((((var5 = CoreEngine.exec_a_string_to_string("MG_PRODUCTS"))) !== (null) && (var5.length) !== (0))) {
                let var6 = 0;
                let var1 = -1;
                let var7 = 0;
                do {
                    let var2 = null;
                    if (((var7 = var5.indexOf(44, (var1 + 1)))) === (-1)) {
                        (var2 = var5.substring((var1 + 1)));
                    } else {
                        (var2 = var5.substring((var1 + 1), var7));
                    }
                    (var1 = var7);
                    if ((((var2.startsWith("MGPANEL") && (var2.length) === (("MGPANEL".length + 1))) && (var2.charAt((var2.length - 1)) >= 48)) && (var2.charAt((var2.length - 1)) <= 57))) {
                        let var8 = (var2.charAt((var2.length - 1)) - 48);
                        let var9 = null;
                        if ((((var9 = CoreEngine.exec_a_string_to_string(("MG_MGPANEL" + var8)))) !== (null) && (var8 < this.val_arr_short_i.length))) {
                            let var14 = false;
                            let var3 = -1;
                            let var27 = 0;
                            do {
                                if (((var27 = var9.indexOf(44, (var3 + 1)))) === (-1)) {
                                    (var4 = var9.substring((var3 + 1)));
                                } else {
                                    (var4 = var9.substring((var3 + 1), var27));
                                }
                                (var3 = var27);
                                for (let var29 = 0; (var29 < this.val_arr_arr_string_a[var8].length); var29++) {
                                    if ((this.val_arr_arr_string_a[var8][var29] !== null && this.val_arr_arr_string_a[var8][var29].equals(var4))) {
                                        (var14 = true);
                                    }
                                }
                                if (var14) {
                                    var6++;
                                    break;
                                }
                            } while ((var27) !== (-1));
                        }
                    } else {
                        let var11 = false;
                        for (let var10 = 0; (var10 < this.val_arr_string_a.length); var10++) {
                            if ((this.val_arr_string_a[var10] !== null && this.val_arr_string_a[var10].equals(var2))) {
                                (var11 = true);
                                break;
                            }
                        }
                        if (var11) {
                            var6++;
                        }
                    }
                } while ((var7) !== (-1));
                if ((var6) === (0)) {
                    (this.val_int_e = 0);
                }
                (this.val_arr_int_a = createArray(var6, 0));
                (this.val_arr_string_b = createArray(var6, null));
                (this.val_arr_string_c = createArray(var6, null));
                let var30 = -1;
                let var28 = 0;
                let var26 = null;
                (var26 = new JVector());
                let var25 = null;
                (var25 = new JVector());
                for (let var24 = 0; (var24 < this.val_arr_int_a.length); var24++) {
                    if (((var6 = var5.indexOf(44, (var30 + 1)))) === (-1)) {
                        (var4 = var5.substring((var30 + 1)));
                    } else {
                        (var4 = var5.substring((var30 + 1), var6));
                    }
                    (var30 = var6);
                    if ((((var4.startsWith("MGPANEL") && (var4.length) === (("MGPANEL".length + 1))) && (var4.charAt((var4.length - 1)) >= 48)) && (var4.charAt((var4.length - 1)) <= 57))) {
                        (var6 = (var4.charAt((var4.length - 1)) - 48));
                        let var16 = null;
                        if ((((var16 = CoreEngine.exec_a_string_to_string(("MG_MGPANEL" + var6)))) !== (null) && (var6 < this.val_arr_short_i.length))) {
                            var26.setSize(0);
                            var25.setSize(0);
                            let var15 = -1;
                            do {
                                let var31 = null;
                                if (((var1 = var16.indexOf(44, (var15 + 1)))) === (-1)) {
                                    (var31 = var16.substring((var15 + 1)));
                                } else {
                                    (var31 = var16.substring((var15 + 1), var1));
                                }
                                (var15 = var1);
                                for (let var20 = 0; (var20 < this.val_arr_arr_string_a[var6].length); var20++) {
                                    if (((this.val_arr_arr_string_a[var6][var20] !== null && this.val_arr_arr_string_a[var6][var20].equals(var31)) && !var26.contains(var31))) {
                                        var26.addElement(var31);
                                        var25.addElement(Short.valueOf(this.val_arr_arr_short_c[var6][var20]));
                                    }
                                }
                            } while ((var1) !== (-1));
                            if ((var26.size()) === (0)) {
                                var24--;
                            } else {
                                (this.val_arr_int_a[var24] = (var6 | -2147483648));
                                let var32 = var26.size();
                                (this.val_arr_arr_string_a[var6] = createArray(var32, null));
                                (this.val_arr_arr_short_c[var6] = createArray(var32, 0));
                                for (let var21 = 0; (var21 < var32); var21++) {
                                    (this.val_arr_arr_string_a[var6][var21] = var26.elementAt(var21).toString());
                                    (this.val_arr_arr_short_c[var6][var21] = (var25.elementAt(var21)));
                                }
                                if ((var28 < var32)) {
                                    (var28 = var32);
                                }
                            }
                        } else {
                            var24--;
                        }
                    } else {
                        (this.val_arr_int_a[var24] = -2);
                        (this.val_arr_string_b[var24] = null);
                        (this.val_arr_string_c[var24] = null);
                        for (let var12 = 0; (var12 < this.val_arr_string_a.length); var12++) {
                            if ((this.val_arr_string_a[var12] !== null && this.val_arr_string_a[var12].equals(var4))) {
                                (this.val_arr_int_a[var24] = var12);
                                (this.val_arr_string_b[var24] = CoreEngine.exec_a_string_to_string(("MG_BUYURI_" + var4)));
                                (this.val_arr_string_c[var24] = CoreEngine.exec_a_string_to_string(("MG_CATURI_" + var4)));
                                if ((this.val_arr_string_b[var24]) !== (null)) {
                                    (this.val_arr_string_b[var24] = this.val_arr_string_b[var24].trim());
                                }
                                if ((this.val_arr_string_c[var24]) !== (null)) {
                                    (this.val_arr_string_c[var24] = this.val_arr_string_c[var24].trim());
                                }
                                break;
                            }
                        }
                        if ((this.val_arr_int_a[var24]) === (-2)) {
                            var24--;
                        }
                    }
                }
                (this.val_arr_encodedtextbuffer_b = createArray(var28, null));
                (this.val_arr_spriteimage_a = createArray(var28, null));
            } else {
                (this.val_int_e = 0);
            }
        }
    }
    loadMarketData() {
        let var1 = false;
        if (((this.val_int_e) === (2) && (CoreEngine.exec_a_string_to_string(("MG_BUYURI_" + this.val_arr_arr_string_a[(this.val_arr_int_a[this.val_int_g] & 2147483647)][this.val_int_j]))) === (null))) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        if (var1) {
            (this.val_encodedtextbuffer_e = null);
        } else {
            (this.val_encodedtextbuffer_e = this.val_arr_encodedtextbuffer_a[5]);
        }
        (this.val_encodedtextbuffer_f = this.val_arr_encodedtextbuffer_a[6]);
    }
    setMarketItem(var1) {
        if (((this.val_arr_int_a) === (null) || CoreEngine.val_bool_m)) {
            this.showOffer();
        }
        for (let var2 = 0; (var2 < this.val_arr_encodedtextbuffer_a.length); var2++) {
            (this.val_arr_encodedtextbuffer_a[var2] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_d[var2], null));
        }
        (this.val_string_b = var1);
        (this.val_int_g = 0);
        (this.val_bool_a = true);
        (this.val_int_h = 0);
        this.selectIndex(0);
        CoreEngine.exec_a_object_to_void(this.val_arr_object_a[0]);
        (this.val_arr_short_e = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(this.val_arr_encodedtextbuffer_a[0], (this.val_int_d - 10)));
        (this.val_arr_short_f = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(this.val_arr_encodedtextbuffer_a[4], (this.val_int_d - 10)));
    }
    selectIndex(var1) {
        if (((this.val_arr_int_a[var1]) !== (-1) && ((this.val_arr_int_a[var1] & -2147483648)) !== (0))) {
            (this.val_int_G = (this.val_arr_int_a[var1] & 2147483647));
            for (let var24 = 0; (var24 < this.val_arr_spriteimage_a.length); var24++) {
                (this.val_arr_spriteimage_a[var24] = null);
            }
            for (let var25 = 0; (var25 < this.val_arr_arr_short_c[this.val_int_G].length); var25++) {
                (this.val_arr_encodedtextbuffer_b[var25] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_arr_short_c[this.val_int_G][var25], null));
                try {
                    (this.val_arr_spriteimage_a[var25] = CoreEngine.exec_a_string_to_spriteimage((("/mgc" + this.val_arr_arr_string_a[this.val_int_G][var25].toLowerCase()) + ".png")));
                } catch (var5) {

                }
            }
            (this.val_encodedtextbuffer_d = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_i[this.val_int_G], null));
            (this.val_int_j = 0);
            (this.val_int_k = 0);
            (this.val_int_E = 0);
            (this.val_int_C = this.val_arr_arr_short_c[this.val_int_G].length);
            this.loadMarketData();
            this.dismissMarket();
            (this.val_int_h = 3);
        } else {
            (this.val_int_F = this.val_arr_int_a[var1]);
            if ((this.val_int_F) !== (-1)) {
                try {
                    (this.val_spriteimage_a = CoreEngine.exec_a_string_to_spriteimage((("/mgi" + this.val_arr_string_a[this.val_int_F].toLowerCase()) + ".png")));
                } catch (var8) {
                    (this.val_spriteimage_a = null);
                }
                let var2 = CoreEngine.exec_a_to_fontcharmap().val_byte_d;
                (this.val_spriteimage_b = null);
                (this.val_short_b = -1);
                (this.val_short_c = -1);
                if (((this.val_arr_arr_short_a[var2]) !== (null) && (this.val_arr_arr_short_a[var2][this.val_int_F]) !== (-1))) {
                    try {
                        (this.val_spriteimage_b = CoreEngine.exec_a_string_to_spriteimage((((("/mgi" + this.val_arr_string_a[this.val_int_F].toLowerCase()) + "_") + CoreEngine.exec_a_to_fontcharmap().val_byte_d) + ".png")));
                        (this.val_short_b = this.val_arr_arr_short_a[var2][this.val_int_F]);
                        (this.val_short_c = this.val_arr_arr_short_b[var2][this.val_int_F]);
                    } catch (var7) {

                    }
                }
                (this.val_encodedtextbuffer_a = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_c[this.val_int_F], null));
                (this.val_encodedtextbuffer_c = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_b[this.val_int_F], null));
                (this.val_encodedtextbuffer_b = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(this.val_arr_short_a[this.val_int_F], null));
                switch (this.val_int_e) {
                    case 1:
                        (this.val_bool_c = false);
                        (this.val_bool_d = true);
                        (this.val_int_m = 1);
                        break;
                    case 2:
                        let var12 = false;
                        if (((this.val_arr_string_b[var1]) !== (null) && (this.val_arr_string_b[var1].compareTo("")) !== (0))) {
                            (var12 = true);
                        } else {
                            (var12 = false);
                        }
                        (this.val_bool_c = var12);
                        if (((this.val_arr_string_c[var1]) !== (null) && (this.val_arr_string_c[var1].compareTo("")) !== (0))) {
                            (var12 = true);
                        } else {
                            (var12 = false);
                        }
                        (this.val_bool_d = var12);
                        if (this.val_bool_c) {
                            (this.val_int_m = 0);
                        } else {
                            if (this.val_bool_d) {
                                (this.val_int_m = 1);
                            } else {
                                (this.val_int_m = 2);
                            }
                        }
                        break;
                    case 3:
                        (this.val_bool_d = true);
                        if (((this.val_arr_string_b[var1]) !== (null) && (this.val_arr_string_b[var1].compareTo("")) !== (0))) {
                            (this.val_bool_c = true);
                            (this.val_int_m = 0);
                        } else {
                            (this.val_bool_c = false);
                            (this.val_int_m = 1);
                        }
                }
            } else {
                try {
                    (this.val_spriteimage_a = CoreEngine.exec_a_string_to_spriteimage((("/mgi" + "LOG".toLowerCase()) + ".png")));
                } catch (var6) {
                    (this.val_spriteimage_b = null);
                    (this.val_short_b = -1);
                    (this.val_short_c = -1);
                }
                (this.val_encodedtextbuffer_a = this.val_arr_encodedtextbuffer_a[1]);
                (this.val_encodedtextbuffer_c = this.val_arr_encodedtextbuffer_a[2]);
                (this.val_encodedtextbuffer_b = this.val_arr_encodedtextbuffer_a[3]);
                (this.val_bool_c = false);
                if (((this.val_int_e) !== (2) || ((this.val_arr_string_c[var1]) !== (null) && (this.val_arr_string_c[var1].compareTo("")) !== (0)))) {
                    (this.val_bool_d = true);
                    (this.val_int_m = 1);
                } else {
                    (this.val_bool_d = false);
                    (this.val_int_m = 2);
                }
            }
            if ((this.val_int_m) !== (2)) {
                (this.val_encodedtextbuffer_e = this.val_arr_encodedtextbuffer_a[5]);
            } else {
                (this.val_encodedtextbuffer_e = null);
            }
            (this.val_encodedtextbuffer_f = this.val_arr_encodedtextbuffer_a[6]);
            (this.val_int_p = Math.trunc(((this.val_int_d << 2)) / (5)));
            let var14 = this.val_int_c;
            (this.val_int_w = 0);
            if (this.val_bool_b) {
                CoreEngine.exec_a_object_to_void(this.val_arr_object_a[3]);
                (this.val_int_w = (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()));
                (var14 -= this.val_int_w);
            }
            (var14 -= 2);
            if (this.val_bool_d) {
                (var14 -= 5);
                if ((this.val_int_m) === (1)) {
                    CoreEngine.exec_a_object_to_void(this.val_arr_object_a[2]);
                } else {
                    CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);
                }
                (var14 -= (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()));
                (this.val_int_v = var14);
                if (((var1 = ((((CoreEngine.exec_a_encodedtextbuffer_to_int(this.val_encodedtextbuffer_c) + 6) + CoreEngine.exec_c_to_int()) - CoreEngine.exec_d_to_int()) + 6)) > this.val_int_p)) {
                    (this.val_int_p = var1);
                }
            }
            if (this.val_bool_c) {
                (var14 -= 5);
                if ((this.val_int_m) === (0)) {
                    CoreEngine.exec_a_object_to_void(this.val_arr_object_a[2]);
                } else {
                    CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);
                }
                (var14 -= (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()));
                (this.val_int_u = var14);
                if (((var1 = ((((CoreEngine.exec_a_encodedtextbuffer_to_int(this.val_arr_encodedtextbuffer_a[10]) + 6) + CoreEngine.exec_c_to_int()) - CoreEngine.exec_d_to_int()) + 6)) > this.val_int_p)) {
                    (this.val_int_p = var1);
                }
            }
            if ((this.val_bool_d && this.val_bool_c)) {
                (var14 -= 2);
                (this.val_int_u = var14);
            }
            (var14 -= 2);
            if ((this.val_spriteimage_a) !== (null)) {
                CoreEngine.exec_a_object_to_void(this.val_arr_object_a[0]);
                (this.val_arr_short_g = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(this.val_encodedtextbuffer_a, (this.val_int_d - 2)));
                (this.val_arr_short_h = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(this.val_encodedtextbuffer_b, (this.val_int_d - 2)));
                let var19 = 0;
                (this.val_int_t = (var19 = ((var14 - ((this.val_arr_short_g[0] * CoreEngine.exec_c_to_int()) - CoreEngine.exec_d_to_int())) + -5)));
                let var20 = 0;
                (this.val_int_o = (var20 = (var19 - ((this.val_arr_short_h[0] * CoreEngine.exec_c_to_int()) - CoreEngine.exec_d_to_int()))));
                (var14 = (var20 - this.val_spriteimage_a.sourceImage.imageHeight));
                (this.val_int_r = var14);
                (this.val_int_s = (this.val_int_r + (this.val_spriteimage_a.sourceImage.imageHeight >> 1)));
            } else {
                CoreEngine.exec_a_object_to_void(this.val_arr_object_a[0]);
                (this.val_arr_short_g = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(this.val_encodedtextbuffer_a, (this.val_int_d - (CoreEngine.val_byte_b >> 1))));
                let var22 = 0;
                (this.val_int_t = (var22 = (var14 - (this.val_arr_short_g[0] * CoreEngine.exec_c_to_int()))));
                (var14 = (var22 - CoreEngine.exec_c_to_int()));
                (this.val_int_r = var14);
                (this.val_int_s = (this.val_int_r + ((CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()) >> 1)));
            }
            var14--;
            CoreEngine.exec_a_object_to_void(this.val_arr_object_a[4]);
            (this.val_int_n = (((CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()) + 1) + 1));
            if ((var14 >= this.val_int_n)) {
                (this.val_bool_e = true);
                (var14 -= this.val_int_n);
            } else {
                (this.val_bool_e = false);
            }
            if ((var14 > 0)) {
                (var1 = Math.trunc(((var14 * 3)) / (10)));
                let var3 = (var14 >> 2);
                (this.val_int_r -= (var14 - var1));
                (this.val_int_s -= (var14 - var1));
                (this.val_int_t -= ((var14 - var1) - var3));
                (this.val_int_o -= ((var14 - var1) - var3));
                let var4 = 0;
                (this.val_int_u = (this.val_int_u - (((var14 - var1) - var3) - (var4 = (var14 >> 2)))));
                (this.val_int_v -= (((var14 - var1) - var3) - var4));
            }
            (this.val_int_h = 0);
        }
    }
    dismissMarket() {
        let var1 = this.val_int_c;
        if (this.val_bool_b) {
            CoreEngine.exec_a_object_to_void(this.val_arr_object_a[3]);
            (this.val_int_w = (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()));
            (var1 -= this.val_int_w);
        }
        let var10000 = ((((var1 + -2) + -1) - (CoreEngine.val_byte_a << 1)) + -8);
        CoreEngine.exec_a_object_to_void(this.val_arr_object_a[4]);
        (this.val_int_n = (((CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()) + 1) + 1));
        (this.val_bool_e = true);
        (var1 = (var10000 - this.val_int_n));
        CoreEngine.exec_a_object_to_void(this.val_arr_object_a[0]);
        let var2 = (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int());
        if (((this.val_arr_spriteimage_a[0]) !== (null) && (this.val_arr_spriteimage_a[0].sourceImage.imageHeight > var2))) {
            (this.val_int_B = this.val_arr_spriteimage_a[0].sourceImage.imageHeight);
        } else {
            (this.val_int_B = var2);
        }
        (this.val_int_B += 4);
        if (((var2 = Math.trunc((var1) / (this.val_int_B))) >= this.val_int_C)) {
            (var2 = this.val_int_C);
        }
        (this.val_int_l = var2);
        if (((var2 = (var1 - (this.val_int_l * (this.val_int_B + 1)))) < 0)) {
            (var2 = 0);
        }
        (this.val_int_x = ((((this.val_int_c - this.val_int_w) - 2) - (var2 >> 2)) + 3));
        (this.val_int_y = (((this.val_int_n + 1) + (var2 >> 2)) + 3));
        (this.val_int_z = (((((this.val_int_n + 1) + CoreEngine.val_byte_a) + (var2 >> 1)) + 3) + 1));
        (var2 = 0);
        CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);
        for (let var5 = 0; (var5 < this.val_int_C); var5++) {
            if ((var5) === (this.val_int_j)) {
                CoreEngine.exec_a_object_to_void(this.val_arr_object_a[2]);
            }
            let var3 = CoreEngine.exec_a_encodedtextbuffer_to_int(this.val_arr_encodedtextbuffer_b[var5]);
            if ((var5) === (this.val_int_j)) {
                CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);
            }
            (var3 += 4);
            if ((this.val_arr_spriteimage_a[var5]) === (null)) {
                (var3 += this.val_int_D);
            } else {
                (var3 += this.val_arr_spriteimage_a[var5].sourceImage.imageWidth);
            }
            if ((var3 > var2)) {
                (var2 = var3);
            }
        }
        (this.val_int_A = ((this.val_int_d - var2) >> 1));
        if ((this.val_int_A <= ((CoreEngine.val_byte_a + 6) + 1))) {
            (this.val_int_A = ((CoreEngine.val_byte_a + 6) + 1));
        }
    }
    getMarketUrl(var1) {
        let var2 = null;
        (var2 = new StringBuffer(var1));
        if ((var1.indexOf(63)) === (-1)) {
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
        for (let var4 = 1; (var4 < 10); var4++) {
            let var3 = null;
            if (((var3 = CoreEngine.exec_b_string_to_string(("MG_REPORTING_NAME" + var4)))) !== (null)) {
                var2.append('&');
                var2.append(var3);
                var2.append('=');
                var2.append(CoreEngine.exec_b_string_to_string(("MG_REPORTING_VALUE" + var4)));
            }
        }
        return var2.toString();
    }
    showError() {
        CoreEngine.exec_a_to_gameflowcontroller();
        (this.val_encodedtextbuffer_e = this.val_arr_encodedtextbuffer_a[7]);
        (this.val_encodedtextbuffer_f = this.val_arr_encodedtextbuffer_a[8]);
        (this.val_int_h = 1);
    }
    cleanupMarket() {
        (this.val_arr_short_e = null);
        (this.val_arr_short_f = null);
        (this.val_arr_short_g = null);
        (this.val_string_a = null);
        (this.val_string_b = null);
        (this.val_spriteimage_a = null);
        (this.val_spriteimage_b = null);
        (this.val_encodedtextbuffer_a = null);
        (this.val_encodedtextbuffer_b = null);
        (this.val_encodedtextbuffer_c = null);
        (this.val_encodedtextbuffer_d = null);
        (this.val_encodedtextbuffer_e = null);
        (this.val_encodedtextbuffer_f = null);
        for (let var1 = 0; (var1 < this.val_arr_spriteimage_a.length); var1++) {
            (this.val_arr_spriteimage_a[var1] = null);
        }
        for (let var2 = 0; (var2 < this.val_arr_encodedtextbuffer_b.length); var2++) {
            (this.val_arr_encodedtextbuffer_b[var2] = null);
        }
    }
    renderHeader(var1, var2, var3) {
        (var2 += (this.val_int_q >> 1));
        var1.setColor(-16757361);
        for (let var4 = 0; (var4 <= CoreEngine.val_byte_a); var4++) {
            var1.drawLine((var2 + var4), (var3 - var4), (var2 + var4), (var3 + var4));
        }
        var1.setColor(-9462329);
        var1.drawLine(var2, var3, (var2 + CoreEngine.val_byte_a), (var3 - CoreEngine.val_byte_a));
        var1.drawLine(var2, var3, (var2 + CoreEngine.val_byte_a), (var3 + CoreEngine.val_byte_a));
        var1.drawLine((var2 + CoreEngine.val_byte_a), (var3 - CoreEngine.val_byte_a), (var2 + CoreEngine.val_byte_a), (var3 + CoreEngine.val_byte_a));
    }
    renderFooter(var1, var2, var3) {
        (var2 -= (this.val_int_q >> 1));
        var1.setColor(-16757361);
        for (let var4 = 0; (var4 <= CoreEngine.val_byte_a); var4++) {
            var1.drawLine((var2 - var4), (var3 - var4), (var2 - var4), (var3 + var4));
        }
        var1.setColor(-9462329);
        var1.drawLine(var2, var3, (var2 - CoreEngine.val_byte_a), (var3 - CoreEngine.val_byte_a));
        var1.drawLine(var2, var3, (var2 - CoreEngine.val_byte_a), (var3 + CoreEngine.val_byte_a));
        var1.drawLine((var2 - CoreEngine.val_byte_a), (var3 - CoreEngine.val_byte_a), (var2 - CoreEngine.val_byte_a), (var3 + CoreEngine.val_byte_a));
    }
    renderRow(var1, var2, var3, var4, bSelected) {
        let var6 = 0;
        if (bSelected) {
            CoreEngine.exec_a_object_to_void(this.val_arr_object_a[2]);
            if ((this.val_arr_object_a[2]) === (this.val_arr_object_a[1])) {
                (var6 = 1);
            }
        } else {
            CoreEngine.exec_a_object_to_void(this.val_arr_object_a[1]);
        }
        let var7 = 0;
        let var8 = (((var7 = (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int())) + 3) + 2);
        let posX = ((this.val_int_d - var3) >> 1);
        var1.setColor(-16777216);
        var1.fillRect(posX, var2, var3, var8);
        var1.setColor(-16757361);
        var1.fillRect(posX, var2, (var3 - 1), (var8 - 1));
        var1.setColor(-9462329);
        var1.drawLine((posX + 1), (var2 + 1), ((posX + var3) - 2), (var2 + 1));
        var1.drawLine((posX + 1), (var2 + 1), (posX + 1), ((var2 + var8) - 3));
        if (bSelected) {
            var1.setColor(-1);
            let cursorX = ((posX + (var7 >> 1)) + 3);
            (var8 = (var2 + (var8 >> 1)));
            (var7 = ((var7 >> 1) - 1));
            for (let var10 = 0; (var10 <= var7); var10++) {
                var1.drawLine((cursorX - var10), (var8 - var10), (var6 - var10), (var8 + var10));
            }
        }
        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var4, (this.val_int_d >> 1), (var2 + 2), 17);
    }
}
globalThis.MarketPanelController = MarketPanelController;
globalThis.MarketPanelController = MarketPanelController;


export class GameFlowController {
    constructor(...args) {
        if (args.length === 0) {
            this._init_0();
        }
        else if (args.length === 1) {
            this._init_1(args[0]);
        }
    }
    _init_0() {

    }
    _init_1(var1) {
        (CoreEngine.val_inputmanager_a = var1);
    }
    initFlow() {
        try {
            CoreEngine.exec_a_arr_string_arr_int_arr_string_to_void(CoreEngine.val_arr_string_a, CoreEngine.val_arr_int_e, CoreEngine.val_arr_string_b);
            (CoreEngine.val_int_p = CoreEngine.readIntFromBytes(CoreEngine.loadResourceBytesByName("/hdr")));
            CoreEngine.exec_c_audioplaybackcontext_to_void((CoreEngine.val_audiomanager_a = CoreEngine.exec_a_to_audiomanager()).playbackContext);
            (CoreEngine.val_bool_b = true);
            (CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth());
            (CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight());
            CoreEngine.exec_b_int_int_to_void(0, 0);
            CoreEngine.exec_c_to_bool();
            let var2 = 0;
            if (((var2 = CoreEngine.exec_b_int_to_int(CoreEngine.val_int_g)) >= 0)) {
                CoreEngine.exec_h_int_to_void(var2);
                (CoreEngine.val_bool_f = true);
            } else {
                CoreEngine.exec_h_int_to_void((-1 - var2));
                (CoreEngine.val_bool_f = false);
            }
            CoreEngine.setGameState(0);
            let var3 = null;
            if (((var3 = CoreEngine.exec_b_string_to_string("Blood"))) !== (null)) {
                if (var3.equals("off")) {
                    (CoreEngine.val_bool_i = false);
                } else {
                    if (var3.equals("red")) {
                        (CoreEngine.val_bool_i = true);
                        (CoreEngine.val_bool_j = true);
                    } else {
                        if (var3.equals("green")) {
                            (CoreEngine.val_bool_i = true);
                            (CoreEngine.val_bool_j = false);
                        }
                    }
                }
            }
            if (!CoreEngine.val_bool_i) {
                (CoreEngine.val_bool_g = false);
            } else {
                let var4 = null;
                if (((var4 = CoreEngine.exec_b_string_to_string("Fatality"))) !== (null)) {
                    (CoreEngine.val_bool_g = var4.equals("on"));
                }
            }
            if (((CoreEngine.exec_b_string_to_string("Cheats")) !== (null) && (CoreEngine.exec_b_string_to_string("Cheats") !== null && CoreEngine.exec_b_string_to_string("Cheats").equals("on")))) {
                (CoreEngine.val_bool_h = true);
            }
            (CoreEngine.val_string_a = CoreEngine.exec_b_string_to_string("MIDlet-Version"));
            let var5 = CoreEngine.exec_a_int_to_arr_byte(11);
            (CoreEngine.val_arr_short_a = ((CoreEngine.exec_a_spriteimage_arr_byte_to_object(CoreEngine.exec_a_int_to_spriteimage(ResourceSlotTable.val_arr_arr_int_a[ResourceSlotTable.val_arr_byte_a[4]][2]), var5))[2]));
        } catch (var1) {

        }
    }
    resumeFlow() {
        CoreEngine.exec_m_to_void();
        if ((CoreEngine.val_int_h) === (11)) {
            CoreEngine.exec_k_to_void();
            CoreEngine.exec_j_to_void();
        }
        if (((CoreEngine.val_int_q) !== (1) && (CoreEngine.val_int_q) !== (2))) {
            CoreEngine.exec_n_to_void();
            CoreEngine.exec_o_to_void();
        } else {
            CoreEngine.exec_l_to_void();
            CoreEngine.exec_g_to_void();
            (CoreEngine.val_int_q = 0);
        }
    }
    pauseFlow() {
        CoreEngine.exec_m_to_void();
        if ((CoreEngine.val_int_h) === (11)) {
            CoreEngine.exec_k_to_void();
            CoreEngine.exec_j_to_void();
        }
        CoreEngine.exec_n_to_void();
    }
    updateFlow(var1) {
        (CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth());
        if (((CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight()) >= CoreEngine.val_int_n)) {
            let delta = (CoreEngine.val_long_a === 0) ? 16 : (((var1 - CoreEngine.val_long_a)) | 0);
            if (delta > 125) delta = 125;
            if (delta < 0) delta = 16;
            (CoreEngine.val_int_f = (CoreEngine.val_int_e = delta));
            if ((CoreEngine.val_int_e > 125)) {
                (CoreEngine.val_int_e = 125);
            }
            (CoreEngine.val_long_a = var1);
            CoreEngine.exec_h_to_void();
            (CoreEngine.val_int_i = (CoreEngine.val_int_i + CoreEngine.val_int_e));
            CoreEngine.exec_e_to_void();
            switch (CoreEngine.val_int_h) {
                case 0:
                    (CoreEngine.val_long_a = var1);
                    CoreEngine.setGameState(1);
                    return;
                case 1:
                    if ((CoreEngine.val_int_i > 3000)) {
                        CoreEngine.setGameState(2);
                        return;
                    }
                    break;
                case 2:
                    if ((CoreEngine.val_int_i > 2000)) {
                        CoreEngine.setGameState(3);
                        return;
                    }
                    break;
                case 3:
                    if ((CoreEngine.val_int_i > 2000)) {
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
                        let var3 = CoreEngine.val_arr_bool_a;
                        let var5 = false;
                        if (!CoreEngine.val_marketpanelcontroller_a.isAvailable()) {
                            (var5 = true);
                        } else {
                            (var5 = false);
                        }
                        (var3[20] = var5);
                        CoreEngine.exec_c_int_to_void(0);
                        (CoreEngine.val_bool_c = false);
                    }
                    CoreEngine.initGameState();
                    return;
                case 10:
                    if (!CoreEngine.val_marketpanelcontroller_a.val_bool_a) {
                        CoreEngine.setGameState(9);
                        CoreEngine.exec_e_int_to_void(CoreEngine.exec_e_int_to_int(20));
                        return;
                    }
                    let var4 = CoreEngine.val_marketpanelcontroller_a;
                    switch (CoreEngine.val_marketpanelcontroller_a.val_int_h) {
                        case 0:
                            if (((var4.val_int_f & 2052)) !== (0)) {
                                var4.val_int_g--;
                                if ((var4.val_int_g < 0)) {
                                    (var4.val_int_g = (var4.val_arr_int_a.length - 1));
                                }
                                var4.selectIndex(var4.val_int_g);
                            } else {
                                if (((var4.val_int_f & 8200)) !== (0)) {
                                    var4.val_int_g++;
                                    (var4.val_int_g = (var4.val_int_g % var4.val_arr_int_a.length));
                                    var4.selectIndex(var4.val_int_g);
                                } else {
                                    if ((((((var4.val_int_f & 513)) !== (0) || ((var4.val_int_f & 32770)) !== (0)) && var4.val_bool_c) && var4.val_bool_d)) {
                                        if ((var4.val_int_m) === (1)) {
                                            (var4.val_int_m = 0);
                                        } else {
                                            (var4.val_int_m = 1);
                                        }
                                    } else {
                                        if (((var4.val_int_f & 524352)) !== (0)) {
                                            (var4.val_bool_a = false);
                                            var4.cleanupMarket();
                                        } else {
                                            if (((var4.val_int_f & 4144)) !== (0)) {
                                                if ((var4.val_int_m) === (0)) {
                                                    (var4.val_string_a = var4.val_arr_string_b[var4.val_int_g]);
                                                    (var4.val_int_i = var4.val_int_h);
                                                    var4.showError();
                                                } else {
                                                    if ((var4.val_int_m) === (1)) {
                                                        if (((var4.val_int_e) !== (1) && ((var4.val_int_e) !== (3) || ((var4.val_arr_string_c[var4.val_int_g]) !== (null) && (var4.val_arr_string_c[var4.val_int_g].compareTo("")) !== (0))))) {
                                                            (var4.val_string_a = var4.val_arr_string_c[var4.val_int_g]);
                                                            (var4.val_int_i = var4.val_int_h);
                                                            var4.showError();
                                                        } else {
                                                            (var4.val_encodedtextbuffer_e = null);
                                                            (var4.val_encodedtextbuffer_f = var4.val_arr_encodedtextbuffer_a[6]);
                                                            (var4.val_int_i = var4.val_int_h);
                                                            (var4.val_int_h = 2);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            break;
                        case 1:
                            if (((var4.val_int_f & 524352)) !== (0)) {
                                (var4.val_encodedtextbuffer_e = var4.val_arr_encodedtextbuffer_a[5]);
                                (var4.val_encodedtextbuffer_f = var4.val_arr_encodedtextbuffer_a[6]);
                                (var4.val_int_h = var4.val_int_i);
                            } else {
                                if (((var4.val_int_f & 32)) !== (0)) {
                                    let var6 = var4.getMarketUrl(var4.val_string_a);
                                    CoreEngine.exec_a_to_gameflowcontroller();
                                    CoreEngine.exec_a_tokenstring_to_bool(CoreEngine.exec_a_arr_short_to_tokenstring(CoreEngine.exec_a_tokenstring_to_arr_short(CoreEngine.exec_a_string_to_tokenstring(makeString(var6)))));
                                }
                            }
                            break;
                        case 2:
                            if (((var4.val_int_f & 524352)) !== (0)) {
                                (var4.val_encodedtextbuffer_e = var4.val_arr_encodedtextbuffer_a[5]);
                                (var4.val_encodedtextbuffer_f = var4.val_arr_encodedtextbuffer_a[6]);
                                (var4.val_int_h = var4.val_int_i);
                            }
                            break;
                        case 3:
                            label180: {
                                if ((((var4.val_int_f & 2052)) !== (0) && (var4.val_arr_int_a.length > 0))) {
                                    var4.val_int_g--;
                                    if ((var4.val_int_g < 0)) {
                                        (var4.val_int_g = (var4.val_arr_int_a.length - 1));
                                    }
                                    var4.selectIndex(var4.val_int_g);
                                } else {
                                    if ((((var4.val_int_f & 8200)) !== (0) && (var4.val_arr_int_a.length > 0))) {
                                        var4.val_int_g++;
                                        (var4.val_int_g = (var4.val_int_g % var4.val_arr_int_a.length));
                                        var4.selectIndex(var4.val_int_g);
                                    } else {
                                        if (((var4.val_int_f & 524352)) !== (0)) {
                                            (var4.val_bool_a = false);
                                            var4.cleanupMarket();
                                        } else {
                                            if (((var4.val_int_f & 513)) !== (0)) {
                                                var4.val_int_j--;
                                                (var4.val_int_E = 0);
                                                if ((var4.val_int_j < 0)) {
                                                    (var4.val_int_j = (var4.val_int_C - 1));
                                                }
                                                var4.loadMarketData();
                                            } else {
                                                if (((var4.val_int_f & 32770)) !== (0)) {
                                                    var4.val_int_j++;
                                                    (var4.val_int_j = (var4.val_int_j % var4.val_int_C));
                                                    (var4.val_int_E = 0);
                                                    var4.loadMarketData();
                                                } else {
                                                    if (((var4.val_int_f & 4144)) !== (0)) {
                                                        let var2 = null;
                                                        if (((var4.val_int_e) === (2) || (var4.val_int_e) === (3))) {
                                                            (var2 = CoreEngine.exec_a_string_to_string(("MG_BUYURI_" + var4.val_arr_arr_string_a[(var4.val_arr_int_a[var4.val_int_g] & 2147483647)][var4.val_int_j])));
                                                        }
                                                        if ((var2) === (null)) {
                                                            if ((var4.val_int_e) === (2)) {
                                                                break label180;
                                                            }
                                                            (var4.val_encodedtextbuffer_e = null);
                                                            (var4.val_encodedtextbuffer_f = var4.val_arr_encodedtextbuffer_a[6]);
                                                            (var4.val_int_i = var4.val_int_h);
                                                            (var4.val_int_h = 2);
                                                        } else {
                                                            (var4.val_string_a = var2);
                                                            (var4.val_int_i = var4.val_int_h);
                                                            var4.showError();
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                                if ((var4.val_int_j < var4.val_int_k)) {
                                    (var4.val_int_k = var4.val_int_j);
                                    (var4.val_int_E = 0);
                                }
                                if ((var4.val_int_j >= (var4.val_int_k + var4.val_int_l))) {
                                    (var4.val_int_k = ((var4.val_int_j - var4.val_int_l) + 1));
                                    (var4.val_int_E = 0);
                                }
                            }
                    }
                    (var4.val_int_f = 0);
                    return;
                case 11:
                    CoreEngine.tickGameState();
            }
        }
    }
    renderFlow(var1) {
        (CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth());
        if (((CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight()) < CoreEngine.val_int_n)) {
            if (!CoreEngine.val_bool_k) {
                this.pauseFlow();
            }
            (CoreEngine.val_bool_k = true);
            (CoreEngine.val_encodedtextbuffer_a = CoreEngine.exec_a_int_int_to_encodedtextbuffer(CoreEngine.val_int_g, 1));
            var1.setClip(0, 0, CoreEngine.val_int_n, CoreEngine.val_int_o);
            var1.setColor(0);
            var1.fillRect(0, 0, CoreEngine.val_int_n, CoreEngine.val_int_o);
            var1.setColor(-1);
            CoreEngine.exec_a_byte_to_void((((5) << 24) >> 24));
            CoreEngine.exec_b_byte_to_void((((5) << 24) >> 24));
            let var7 = null;
            let var10000 = (var7 = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(CoreEngine.val_encodedtextbuffer_a, (CoreEngine.val_int_n - 10)));
            CoreEngine.renderSecondary(var1);
            let var11 = var10000[0];
            CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_a, var7, 1, var11, (CoreEngine.val_int_n >> 1), (CoreEngine.val_int_o >> 1), 3);
        } else {
            if (CoreEngine.val_bool_k) {
                this.resumeFlow();
            }
            (CoreEngine.val_bool_k = false);
            (CoreEngine.val_graphicsadapter_a = var1);
            var1.setColor(0);
            var1.fillRect(0, 0, CoreEngine.val_int_n, CoreEngine.val_int_o);
            CoreEngine.renderSecondary(CoreEngine.val_graphicsadapter_a);
            let var8 = false;
            if (!CoreEngine.val_bool_d) {
                (var8 = true);
            } else {
                (var8 = false);
            }
            (CoreEngine.val_bool_d = var8);
            if (var8) {
                let var9 = false;
                if (!CoreEngine.val_bool_e) {
                    (var9 = true);
                } else {
                    (var9 = false);
                }
                (CoreEngine.val_bool_e = var9);
            }
            switch (CoreEngine.val_int_h) {
                case 0:
                    return;
                case 1:
                    CoreEngine.val_spritepartsequence_c.drawSequence(CoreEngine.val_int_l, CoreEngine.val_animationset_c, Math.trunc((CoreEngine.val_int_n) / (2)), Math.trunc((CoreEngine.val_int_o) / (2)), 0);
                    return;
                case 2:
                    CoreEngine.val_spritepartsequence_d.drawSequence(CoreEngine.val_int_m, CoreEngine.val_animationset_d, Math.trunc((CoreEngine.val_int_n) / (2)), Math.trunc((CoreEngine.val_int_o) / (2)), 0);
                    return;
                case 3:
                    CoreEngine.val_spritepartsequence_a.drawSequence(CoreEngine.val_int_j, CoreEngine.val_animationset_a, Math.trunc((CoreEngine.val_int_n) / (2)), Math.trunc((CoreEngine.val_int_o) / (2)), 0);
                    CoreEngine.val_spritepartsequence_b.drawSequence(CoreEngine.val_int_k, CoreEngine.val_animationset_b, Math.trunc((CoreEngine.val_int_n) / (2)), Math.trunc((CoreEngine.val_int_o) / (2)), 0);
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
                        let var2 = CoreEngine.val_graphicsadapter_a;
                        let var10 = CoreEngine.val_marketpanelcontroller_a;
                        var2.setClip(0, 0, var10.val_int_d, var10.val_int_c);
                        var2.setColor(-1);
                        var2.fillRect(0, 0, var10.val_int_d, var10.val_int_c);
                        switch (var10.val_int_h) {
                            case 0:
                                var10.val_int_q--;
                                if ((var10.val_int_q < 0)) {
                                    (var10.val_int_q = 6);
                                }
                                if (var10.val_bool_e) {
                                    var2.setColor(-16757361);
                                    CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[4]);
                                    var2.fillRect(0, 0, var10.val_int_d, var10.val_int_n);
                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_arr_encodedtextbuffer_a[9], (var10.val_int_d >> 1), 1, 17);
                                }
                                if ((var10.val_spriteimage_a) !== (null)) {
                                    var2.drawImage(var10.val_spriteimage_a, (var10.val_int_d >> 1), var10.val_int_r, 17);
                                    if ((var10.val_spriteimage_b) !== (null)) {
                                        var2.drawImage(var10.val_spriteimage_b, (((var10.val_int_d - var10.val_spriteimage_a.sourceImage.imageWidth) >> 1) + var10.val_short_b), (var10.val_int_r + var10.val_short_c), 20);
                                    }
                                    if ((var10.val_arr_int_a.length > 1)) {
                                        var10.renderHeader(var2, (((var10.val_int_d - var10.val_spriteimage_a.sourceImage.imageWidth) >> 2) - (CoreEngine.val_byte_a >> 1)), var10.val_int_s);
                                        var10.renderFooter(var2, ((var10.val_int_d - ((var10.val_int_d - var10.val_spriteimage_a.sourceImage.imageWidth) >> 2)) + (CoreEngine.val_byte_a >> 1)), var10.val_int_s);
                                    }
                                    CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[0]);
                                    CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(var10.val_encodedtextbuffer_b, var10.val_arr_short_h, 1, var10.val_arr_short_h[0], (var10.val_int_d >> 1), var10.val_int_o, 17);
                                    CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(var10.val_encodedtextbuffer_a, var10.val_arr_short_g, 1, var10.val_arr_short_g[0], (var10.val_int_d >> 1), var10.val_int_t, 17);
                                } else {
                                    CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[0]);
                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_encodedtextbuffer_b, (var10.val_int_d >> 1), var10.val_int_r, 17);
                                    CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(var10.val_encodedtextbuffer_a, var10.val_arr_short_g, 1, var10.val_arr_short_g[0], (var10.val_int_d >> 1), var10.val_int_t, 17);
                                    if ((var10.val_arr_int_a.length > 1)) {
                                        var10.renderHeader(var2, 1, var10.val_int_s);
                                        var10.renderFooter(var2, (var10.val_int_d - 1), var10.val_int_s);
                                    }
                                }
                                if (var10.val_bool_c) {
                                    let var15 = var10.val_int_u;
                                    let var19 = var10.val_int_p;
                                    let var23 = var10.val_arr_encodedtextbuffer_a[10];
                                    let var12 = false;
                                    if ((var10.val_int_m) === (0)) {
                                        (var12 = true);
                                    } else {
                                        (var12 = false);
                                    }
                                    var10.renderRow(var2, var15, var19, var23, var12);
                                }
                                if (var10.val_bool_d) {
                                    let var24 = var10.val_int_v;
                                    let var20 = var10.val_int_p;
                                    let var16 = var10.val_encodedtextbuffer_c;
                                    let var13 = false;
                                    if ((var10.val_int_m) === (1)) {
                                        (var13 = true);
                                    } else {
                                        (var13 = false);
                                    }
                                    var10.renderRow(var2, var24, var20, var16, var13);
                                }
                                break;
                            case 1:
                                CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[0]);
                                CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(var10.val_arr_encodedtextbuffer_a[4], var10.val_arr_short_f, 1, var10.val_arr_short_f[0], (var10.val_int_d >> 1), ((var10.val_int_c - var10.val_int_w) >> 1), 3);
                                break;
                            case 2:
                                CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[0]);
                                CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(var10.val_arr_encodedtextbuffer_a[0], var10.val_arr_short_e, 1, var10.val_arr_short_e[0], (var10.val_int_d >> 1), ((var10.val_int_c - var10.val_int_w) >> 1), 3);
                                break;
                            case 3:
                                var10.val_int_q--;
                                if ((var10.val_int_q < 0)) {
                                    (var10.val_int_q = 6);
                                }
                                if (var10.val_bool_e) {
                                    var2.setColor(-16757361);
                                    var2.fillRect(0, 0, var10.val_int_d, var10.val_int_n);
                                    CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[4]);
                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_encodedtextbuffer_d, (var10.val_int_d >> 1), 1, 17);
                                }
                                let var6 = var10.val_int_z;
                                CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[1]);
                                for (let var5 = var10.val_int_k; (var5 < (var10.val_int_k + var10.val_int_l)); var5++) {
                                    if ((var5) === (var10.val_int_j)) {
                                        CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[2]);
                                    }
                                    let var4 = var10.val_int_D;
                                    if ((var10.val_arr_spriteimage_a[var5]) !== (null)) {
                                        (var4 = var10.val_arr_spriteimage_a[var5].sourceImage.imageWidth);
                                        var2.drawImage(var10.val_arr_spriteimage_a[var5], var10.val_int_A, (var6 + (var10.val_int_B >> 1)), 6);
                                    }
                                    (var4 = ((var10.val_int_A + var4) + 4));
                                    let var3 = ((var6 + (var10.val_int_B >> 1)) - ((CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()) >> 1));
                                    var2.setClip(var4, var3, ((var10.val_int_d - var10.val_int_A) - var4), (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()));
                                    if ((var5) === (var10.val_int_j)) {
                                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_arr_encodedtextbuffer_b[var5], (var4 - (var10.val_int_E >> 1)), var3, 20);
                                        var10.val_int_E++;
                                        if ((((var4 - (var10.val_int_E >> 1)) + CoreEngine.exec_a_encodedtextbuffer_to_int(var10.val_arr_encodedtextbuffer_b[var5])) < (var10.val_int_d - var10.val_int_A))) {
                                            (var10.val_int_E = 0);
                                        }
                                    } else {
                                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_arr_encodedtextbuffer_b[var5], var4, var3, 20);
                                    }
                                    var2.setClip(0, 0, var10.val_int_d, var10.val_int_c);
                                    (var6 += var10.val_int_B);
                                    if ((var5) === (var10.val_int_j)) {
                                        CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[1]);
                                    }
                                }
                                if ((var10.val_int_k > 0)) {
                                    (var6 = (var10.val_int_d >> 1));
                                    let var17 = (var10.val_int_y - (var10.val_int_q >> 1));
                                    var2.setColor(-16757361);
                                    var2.fillTriangle(var6, var17, (var6 - CoreEngine.val_byte_a), (var17 + CoreEngine.val_byte_a), (var6 + CoreEngine.val_byte_a), (var17 + CoreEngine.val_byte_a));
                                }
                                if (((var10.val_int_k + var10.val_int_l) < var10.val_int_C)) {
                                    (var6 = (var10.val_int_d >> 1));
                                    let var18 = (var10.val_int_x - (6 - (var10.val_int_q >> 1)));
                                    var2.setColor(-16757361);
                                    var2.fillTriangle(var6, var18, (var6 - CoreEngine.val_byte_a), (var18 - CoreEngine.val_byte_a), (var6 + CoreEngine.val_byte_a), (var18 - CoreEngine.val_byte_a));
                                }
                                if ((var10.val_arr_int_a.length > 1)) {
                                    var10.renderHeader(var2, ((var10.val_int_A - CoreEngine.val_byte_a) >> 1), (var10.val_int_c >> 1));
                                    var10.renderFooter(var2, (var10.val_int_d - ((var10.val_int_A - CoreEngine.val_byte_a) >> 1)), (var10.val_int_c >> 1));
                                }
                        }
                        if (var10.val_bool_b) {
                            CoreEngine.exec_a_object_to_void(var10.val_arr_object_a[3]);
                            if ((var10.val_encodedtextbuffer_e) !== (null)) {
                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_encodedtextbuffer_e, 2, ((var10.val_int_c + CoreEngine.exec_d_to_int()) - 2), 36);
                            }
                            if ((var10.val_encodedtextbuffer_f) !== (null)) {
                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var10.val_encodedtextbuffer_f, (var10.val_int_d - 2), ((var10.val_int_c + CoreEngine.exec_d_to_int()) - 2), 40);
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
    handleKeyPress(var1) {
        (CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth());
        if (((CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight()) >= CoreEngine.val_int_n)) {
            CoreEngine.exec_g_int_to_void(var1);
            if (((CoreEngine.val_int_h) === (9) || (CoreEngine.val_int_h) === (10))) {
                let var10000 = false;
                label85: {
                    let var2 = var1;
                    let var5 = CoreEngine.val_marketpanelcontroller_a;
                    if (CoreEngine.val_marketpanelcontroller_a.val_bool_a) {
                        (var5.val_int_f |= var2);
                    } else {
                        let var7 = 0;
                        let var3 = 0;
                        while (true) {
                            if ((var3 >= 10)) {
                                (var7 = -1);
                                break;
                            }
                            if (((var2 & (128 << var3))) !== (0)) {
                                (var7 = (((var3) << 24) >> 24));
                                break;
                            }
                            var3++;
                        }
                        let var6 = var7;
                        if ((var7) === (-1)) {
                            (var5.val_short_a = 0);
                            (var5.val_int_a = 0);
                        } else {
                            if ((var5.val_int_a) === (0)) {
                                (var5.val_short_a = ((((var5.val_short_a << 4)) << 16) >> 16));
                                (var5.val_short_a = ((((var5.val_short_a | (var7 + 1))) << 16) >> 16));
                                if ((var5.val_short_a) === (-26472)) {
                                    (var5.val_int_b = 3);
                                    (var5.val_int_a = 1);
                                } else {
                                    if ((var5.val_short_a) === (-26461)) {
                                        (CoreEngine.val_arr_byte_a[4] = 1);
                                        (CoreEngine.val_bool_m = true);
                                        (var5.val_short_a = 0);
                                        (var10000 = true);
                                        break label85;
                                    }
                                    if ((var5.val_short_a) === (-26475)) {
                                        (var5.val_int_b = 0);
                                        (var5.val_int_a = 1);
                                    } else {
                                        if ((var5.val_short_a) === (-26473)) {
                                            (var5.val_int_b = 1);
                                            (var5.val_int_a = 1);
                                        } else {
                                            if ((var5.val_short_a) === (-26476)) {
                                                (var5.val_int_b = 2);
                                                (var5.val_int_a = 1);
                                            }
                                        }
                                    }
                                }
                            } else {
                                if ((var5.val_int_a) === (1)) {
                                    let var4 = false;
                                    if ((var5.val_int_b) === (0)) {
                                        if (((var7 >= 0) && (var7 <= 3))) {
                                            (var4 = false);
                                        } else {
                                            (var4 = true);
                                        }
                                    } else {
                                        if (((var5.val_int_b) === (2) || (var5.val_int_b) === (1))) {
                                            if (((var6 >= 0) && (var6 <= 2))) {
                                                (var4 = false);
                                            } else {
                                                (var4 = true);
                                            }
                                        }
                                    }
                                    if (!var4) {
                                        (CoreEngine.val_arr_byte_a[var5.val_int_b] = var6);
                                        (CoreEngine.val_bool_m = true);
                                    }
                                    (var5.val_int_a = 0);
                                    (var5.val_short_a = 0);
                                    (var10000 = true);
                                    break label85;
                                }
                            }
                        }
                    }
                    (var10000 = false);
                }
                if (var10000) {
                    (CoreEngine.val_bool_c = true);
                }
            }
        }
    }
    handleKeyRelease(var1) {
        (CoreEngine.val_int_n = CoreEngine.val_inputmanager_a.getWidth());
        if (((CoreEngine.val_int_o = CoreEngine.val_inputmanager_a.getHeight()) >= CoreEngine.val_int_n)) {
            CoreEngine.exec_j_int_to_void(var1);
        }
    }
}
globalThis.GameFlowController = GameFlowController;
globalThis.GameFlowController = GameFlowController;


export class AnimationSet {
    partCountArray = null;
    spriteIndexMatrix = null;
    isLoaded = false;
    spriteImages = null;
    frameDelayArray = null;
    animConfigBytes = null;
    animFrameCount = 0;
    currentFrameIndex = 0;
    animDurationArray = null;
    animPriorityBytes = null;
    totalAnimFrames = 0;
    val_arr_long_a = null;
    setFrame(var1) {
        if (((var1) !== (this.animFrameCount) && (var1 <= this.spriteImages.length))) {
            if (this.isLoaded) {
                (this.spriteImages[this.animFrameCount] = null);
                (this.animFrameCount = var1);
                if ((this.spriteImages[this.animFrameCount]) === (null)) {
                    CoreEngine.copyByteArray(this.partCountArray, 0, this.partCountArray.length, this.spriteIndexMatrix[this.animFrameCount]);
                    (this.spriteImages[this.animFrameCount] = CoreEngine.exec_a_arr_byte_int_int_to_spriteimage(this.partCountArray, 0, this.partCountArray.length));
                    return;
                }
            } else {
                if ((this.spriteImages[var1]) !== (null)) {
                    (this.animFrameCount = var1);
                }
            }
        }
    }
    getCurrentFrame() {
        return this.spriteImages[this.animFrameCount];
    }
    getPartMinX(var1) {
        let var2 = this.val_arr_long_a[(this.animPriorityBytes[var1] & 0xFF)];
        return (((this.animDurationArray[var1] & 4)) !== (0) ? (((var2 & 65535)) | 0) : ((((var2 >>> 16) & 65535)) | 0));
    }
    getPartMaxX(var1) {
        let var2 = this.val_arr_long_a[(this.animPriorityBytes[var1] & 0xFF)];
        return (((this.animDurationArray[var1] & 4)) !== (0) ? ((((var2 >>> 16) & 65535)) | 0) : (((var2 & 65535)) | 0));
    }
}
globalThis.AnimationSet = AnimationSet;
globalThis.AnimationSet = AnimationSet;


export class FontCharmap {
    val_arr_byte_f = null;
    val_arr_byte_a = null;
    val_arr_arr_byte_a = null;
    val_arr_short_a = null;
    val_arr_byte_b = null;
    val_arr_byte_c = null;
    val_arr_arr_short_a = null;
    val_arr_short_b = null;
    val_arr_byte_d = null;
    val_arr_arr_byte_b = null;
    val_arr_arr_short_b = null;
    val_byte_a = 0;
    val_byte_b = 0;
    val_byte_c = 0;
    val_arr_short_c = null;
    val_arr_byte_e = null;
    val_byte_d = 0;
    val_byte_e = 0;
    val_arr_short_d = createArray(128, 0);
    val_int_a = 0;
    val_arr_short_e = null;
    val_int_b = 0;
    val_graphicsadapter_a = null;
    val_arr_int_a = null;
    val_arr_int_b = null;
    val_bool_a = false;
    val_bool_b = false;
    val_audiomanager_a = null;
    val_contextservicenode_a = new ContextServiceNode(6);
    constructor() {
        (this.val_arr_int_a = createArray(2, 0));
        (this.val_arr_int_b = createArray(4, 0));
        (this.val_byte_d = 0);
    }
    formatInt(var1) {
        if ((this.val_arr_byte_f) === (null)) {
            (this.val_arr_byte_f = createArray(11, 0));
        }
        let var2 = 10;
        let var3 = var1;
        if ((var1 < 0)) {
            (var3 = -var1);
        }
        for (let var4 = 10; (var4 >= 0); var4--) {
            (this.val_arr_byte_f[var4] = (((((var3 % 10) | 48)) << 24) >> 24));
            (var3 = Math.trunc(var3 / (10)));
            if ((this.val_arr_byte_f[var4]) !== (48)) {
                (var2 = var4);
            }
        }
        if ((var1 < 0)) {
            (this.val_arr_byte_f[--var2] = 45);
        }
        let var6 = 0;
        let var5 = createArray(((var6 = ((((11 - var2)) << 16) >> 16)) + 1), 0);
        System.arraycopy(this.val_arr_byte_f, var2, var5, 0, var6);
        (var5[var6] = 0);
        return var5;
    }
    renderText(var1, var2, var3, var4, var5, var6, var7) {
        let var8 = 0;
        if ((var7) === (0)) {
            (var8 = (var5 << 1));
        } else {
            (var8 = var5);
        }
        if (((var6) !== (var7) && ((var6) !== (1) || (var7) === (0)))) {
            for (let var11 = var2; (var11 < (var2 + var5)); var11++) {
                let var10 = 0;
                let var9 = (var10 = ((((var1[var11] & 0xFF)) << 16) >> 16));
                if ((var10 > 127)) {
                    (var9 = this.val_arr_short_d[(var10 - 128)]);
                }
                let var10001 = (var4 + 1);
                let var10002 = (var4 + 1);
                (var3[var4] = ((((var9 >> 8)) << 24) >> 24));
                (var4 = (var10002 + 1));
                (var3[var10001] = (((var9) << 24) >> 24));
            }
        } else {
            System.arraycopy(var1, var2, var3, var4, var8);
        }
        return var8;
    }
    getCharWidth(var1) {
        let var2 = (this.val_contextservicenode_a.val_arr_byte_a[6] & 255);
        return ((var1) === (-1) ? ((this.val_contextservicenode_a.val_arr_byte_a[5] & 0xFF) + var2) : ((this.val_contextservicenode_a.val_arr_byte_b[(var1 & 65535)] & 0xFF) + var2));
    }
    getKerning(var1, var2) {
        let var3 = this.val_contextservicenode_a.val_arr_short_b.length;
        if ((var2) === (0)) {
            return this.val_contextservicenode_a.val_arr_short_c[CoreEngine.exec_a_arr_short_int_int_int_int_fontcharmap_to_int(this.val_contextservicenode_a.val_arr_short_b, var1, 0, (var3 - 1), var3, this)];
        } else {
            return (((var1 >= 128) && (var2) !== (this.val_arr_byte_a[this.val_byte_d])) ? -1 : this.val_contextservicenode_a.val_arr_short_c[(this.val_contextservicenode_a.val_arr_short_a[var1] & 65535)]);
        }
    }
    setFontPalette(var1, var2) {
        let var3 = 0;
        if (((var3 = this.val_contextservicenode_a.val_arr_byte_a[8])) === (1)) {
            (var1[0] += var2);
        } else {
            if ((var3) === (4)) {
                (var1[0] -= var2);
            } else {
                if ((var3) === (2)) {
                    (var1[1] += var2);
                } else {
                    if ((var3) === (8)) {
                        (var1[1] -= var2);
                    }
                }
            }
        }
    }
    setFontStyle(var1) {
        let var2 = 0;
        for (let var3 = 1; (var3 < var1); var3++) {
            if (((this.val_int_a & (1 << var3))) !== (0)) {
                var2++;
            }
        }
        let var8 = createArray(2, 0);
        try {
            let var5 = null;
            CoreEngine.skipStreamBytes((var5 = CoreEngine.midletInstance.getResourceAsStream("/charmap")), (var2 << 8));
            for (let var6 = 0; (var6 < 128); var6++) {
                (var8[0] = (((var5.read()) << 24) >> 24));
                (var8[1] = (((var5.read()) << 24) >> 24));
                (this.val_arr_short_d[var6] = CoreEngine.readShortBigEndian(var8, 0));
            }
            var5.close();
        } catch (var4) {

        }
        if (((this.val_contextservicenode_a.val_object_b) !== (null) && ((this.val_contextservicenode_a.val_arr_byte_a[10] & 4)) === (0))) {
            let var9 = this.val_contextservicenode_a.val_arr_short_b.length;
            for (let var7 = 128; (var7 < 256); var7++) {
                (this.val_contextservicenode_a.val_arr_short_a[var7] = (((CoreEngine.exec_a_arr_short_int_int_int_int_fontcharmap_to_int(this.val_contextservicenode_a.val_arr_short_b, this.val_arr_short_d[(var7 - 128)], 0, (var9 - 1), var9, this)) << 16) >> 16));
            }
            (this.val_contextservicenode_a.val_arr_byte_a[11] = this.val_arr_byte_a[this.val_byte_d]);
        }
    }
}
globalThis.FontCharmap = FontCharmap;
globalThis.FontCharmap = FontCharmap;


export class RootGameState extends SceneBase {
    inputManager = null;
    flowController = null;
    fontCharmap = null;
    gameTimer = 0;
    isLoaded = false;
    lastUpdateTimestamp = 0;
    constructor() {
        super();
        CoreEngine.exec_a_int_int_scenebase_to_void(9, 0, this);
        CoreEngine.exec_a_int_int_scenebase_to_void(7, 0, this);
        CoreEngine.exec_a_int_int_scenebase_to_void(13, 0, this);
        CoreEngine.exec_a_int_int_scenebase_to_void(14, 0, this);
        CoreEngine.exec_a_int_int_scenebase_to_void(10, 0, this);
        CoreEngine.exec_a_scenebase_to_void(this);
        for (let var1 = 0; (var1 < 33); var1++) {
            if ((this.sceneConfigShorts[var1]) === (0)) {
                (this.sceneConfigShorts[var1] = var1);
            }
        }
        let var2 = null;
        if (!(var2 = CoreEngine.exec_a_to_contextservicenode().val_featureflag_a).flagEnabled) {
            (var2.flagEnabled = true);
        }
        (this.fontCharmap = new FontCharmap());
        (this.inputManager = new InputManager());
        (this.flowController = new GameFlowController(this.inputManager));
        this.flowController.initFlow();
    }
}
globalThis.RootGameState = RootGameState;
globalThis.RootGameState = RootGameState;


export class CoreEngine {
    actorPhysicsArray = null;
    actorActiveFlag = false;
    currentAnimSet = null;
    spriteSequences = null;
    actorTimerR = 0;
    actorTimerS = 0;
    actorTimerT = 0;
    actorTimerU = 0;
    actorTimerV = 0;
    actorTimerW = 0;
    actorTimerX = 0;
    actorTimerY = 0;
    actorTimerZ = 0;
    actorCounterA = 0;
    actorCounterB = 0;
    actorCounterC = 0;
    actorCounterD = 0;
    actorCounterE = 0;
    actorCurrentAnimIndex = 0;
    characterMoveFrames = null;
    actorSubStateG = 0;
    actorSubStateH = 0;
    actorLifecycleState = 0;
    static actorPoolArray = null;
    characterId = 0;
    playerSlot = 0;
    animationTick = 0;
    facingDirectionFlag = 0;
    scratchpadBuffer = null;
    playerSideIndex = 0;
    layerDepth = 0;
    val_int_O = 0;
    val_bool_o = false;
    val_bool_p = false;
    val_bool_q = false;
    spawnParamP = 0;
    val_bool_r = false;
    val_bool_s = false;
    val_bool_t = false;
    val_int_Q = 0;
    val_int_R = 0;
    val_int_S = 0;
    requestedAnimIndex = 0;
    currentHealth = 0;
    superMeterEnergy = 0;
    energyDrainFlag = 0;
    fighterNameBuffer = null;
    opposingActorRef = null;
    val_int_X = 0;
    val_arr_int_g = null;
    val_int_Y = 0;
    linkedStateMachine = null;
    val_int_Z = 0;
    val_arr_arr_byte_a = null;
    val_bool_u = false;
    val_bool_v = false;
    val_bool_w = false;
    val_bool_x = false;
    val_bool_y = false;
    val_bool_z = false;
    val_spritepartsequence_e = null;
    val_animationset_f = null;
    val_bool_A = false;
    val_bool_B = false;
    val_int_aa = 0;
    fighterTitleBuffer = null;
    val_int_ab = 0;
    val_int_ac = 0;
    val_bool_C = false;
    val_bool_D = false;
    val_bool_E = false;
    val_bool_F = false;
    val_animationset_g = null;
    val_spritepartsequence_f = null;
    val_bool_G = false;
    val_int_ad = 0;
    spriteTransformLookupB = null;
    spriteTransformLookupC = null;
    static val_arr_byte_c = null;
    static val_arr_int_h = null;
    static val_animationset_h = null;
    static val_arr_spritepartsequence_b = null;
    static val_spritepartsequence_g = null;
    static val_spritepartsequence_h = null;
    static val_int_ae = 0;
    static val_byte_c = 0;
    static val_byte_d = 0;
    static val_int_af = 0;
    static val_int_ag = 0;
    static val_int_ah = 0;
    static val_int_ai = 0;
    static val_int_aj = 0;
    static val_int_ak = 0;
    static val_bool_a = false;
    static val_int_al = 0;
    static val_int_am = 0;
    static val_arr_int_i = null;
    static val_arr_arr_int_a = null;
    static val_int_an = 0;
    static val_arr_arr_bool_a = null;
    static val_arr_int_j = null;
    static val_arr_arr_int_b = null;
    static val_inputstream_a = null;
    static val_int_b = -1;
    static val_int_c = -1;
    static val_int_d = -1;
    static val_arr_byte_d = null;
    static val_arr_int_a = null;
    static val_arr_int_b = null;
    static val_byte_e = 0;
    static val_animationset_i = null;
    static val_arr_arr_byte_b = createMultiArray([3, 0], 0);
    static val_arr_byte_e = createArray(3, 0);
    static val_arr_byte_f = createArray(3, 0);
    static val_arr_int_k = createArray(3, 0);
    static val_arr_int_l = createArray(3, 0);
    static val_arr_int_m = createArray(3, 0);
    static val_arr_int_n = createArray(3, 0);
    static val_arr_int_o = createArray(3, 0);
    static val_arr_int_p = createArray(3, 0);
    static val_int_ao = 0;
    static val_int_ap = 0;
    static val_int_aq = 0;
    static val_int_ar = 0;
    static val_int_as = 0;
    static val_int_at = 0;
    static val_animationset_j = null;
    static val_spritepartsequence_i = null;
    static val_int_au = 0;
    static val_int_av = 0;
    static val_int_aw = 0;
    static val_int_ax = 0;
    static val_int_ay = 0;
    static val_int_az = 0;
    static val_arr_int_q = null;
    static val_arr_byte_g = null;
    static midletInstance = null;
    static val_thread_a = null;
    static val_bool_H = false;
    static val_int_aA = 0;
    static val_byte_f = -1;
    static val_byte_g = -1;
    static val_int_aB = 0;
    static val_int_aC = 0;
    static val_int_aD = 0;
    static val_arr_int_r = null;
    static val_int_aE = 0;
    static val_bool_I = false;
    static val_bool_J = false;
    static val_arr_int_s = createArray(5, 0);
    static val_int_aF = 0;
    static val_arr_int_t = null;
    static val_arr_encodedtextbuffer_a = null;
    static val_arr_int_u = null;
    static val_int_aG = 0;
    static val_encodedtextbuffer_d = null;
    static val_byte_h = 0;
    static val_byte_i = 0;
    static val_int_aH = 0;
    static val_arr_bool_a = createArray(29, false);
    static val_arr_int_v = null;
    static val_arr_int_w = null;
    static val_arr_int_x = null;
    static val_arr_int_y = null;
    static val_arr_int_z = null;
    static val_arr_int_A = null;
    static val_arr_int_B = null;
    static val_arr_int_C = null;
    static val_arr_int_D = null;
    static val_arr_int_E = null;
    static val_arr_int_F = null;
    static val_arr_int_G = null;
    static val_arr_int_H = null;
    static val_arr_int_I = null;
    static val_arr_int_J = null;
    static val_arr_int_K = null;
    static val_arr_int_L = null;
    static val_arr_int_M = null;
    static val_arr_int_N = null;
    static val_int_aI = 0;
    static val_int_aJ = 0;
    static val_int_aK = 0;
    static val_arr_int_O = createArray(4, 0);
    static val_arr_int_P = createArray(4, 0);
    static val_arr_int_Q = createArray(4, 0);
    static val_int_aL = 0;
    static val_int_aM = 0;
    static val_int_aN = 0;
    static val_int_aO = 0;
    static val_int_aP = 0;
    static val_int_aQ = 0;
    static val_int_aR = 0;
    static val_encodedtextbuffer_e = null;
    static val_int_aS = 0;
    static val_arr_short_d = null;
    static val_int_aT = 0;
    static val_int_aU = 0;
    static val_int_aV = 0;
    static val_int_aW = 0;
    static val_int_aX = 0;
    static val_int_aY = 0;
    static val_int_aZ = 0;
    static val_bool_K = false;
    static val_bool_L = false;
    static val_bool_M = false;
    static val_bool_N = false;
    static val_arr_int_R = null;
    static val_arr_int_S = null;
    static val_arr_animationset_a = null;
    static val_arr_animationset_b = null;
    static val_arr_int_T = null;
    static val_arr_int_U = null;
    static val_arr_int_V = null;
    static val_arr_int_W = null;
    static val_arr_spritepartsequence_c = null;
    static val_arr_spritepartsequence_d = null;
    static val_arr_int_X = null;
    static val_arr_int_Y = null;
    static val_arr_int_Z = null;
    static val_arr_int_aa = null;
    static val_arr_int_ab = null;
    static val_arr_int_ac = null;
    static val_arr_int_ad = null;
    static val_arr_int_ae = null;
    static val_arr_int_af = null;
    static val_int_ba = 0;
    static val_bool_O = false;
    static val_bool_P = false;
    static val_int_bb = 0;
    static val_int_bc = 0;
    static val_arr_byte_h = null;
    static val_arr_byte_i = null;
    static val_arr_arr_byte_c = createMultiArray([10, 3], 0);
    static val_arr_int_ag = createArray(10, 0);
    static val_arr_encodedtextbuffer_b = createArray(10, null);
    static val_arr_encodedtextbuffer_c = createArray(10, null);
    static val_arr_encodedtextbuffer_d = createArray(10, null);
    static val_int_bd = 0;
    static val_int_be = 0;
    static val_int_bf = 0;
    static val_int_bg = 0;
    static val_int_bh = 0;
    static val_int_bi = 0;
    static val_encodedtextbuffer_f = null;
    static val_encodedtextbuffer_g = null;
    static val_encodedtextbuffer_h = null;
    static val_int_bj = 0;
    static val_int_bk = 0;
    static val_int_bl = 0;
    static val_int_bm = 0;
    static val_int_bn = 0;
    static val_int_bo = 0;
    static val_bool_Q = false;
    static val_bool_R = false;
    static val_arr_short_e = null;
    static val_arr_byte_j = null;
    static val_arr_encodedtextbuffer_e = null;
    static val_int_bp = 0;
    static val_bool_S = false;
    static val_int_bq = 0;
    static val_int_br = 0;
    static val_bool_T = false;
    static val_int_bs = 0;
    static val_int_bt = 167772241;
    static val_arr_int_ah = null;
    static val_animationset_k = null;
    static val_arr_spritepartsequence_e = null;
    static val_arr_int_ai = null;
    static val_arr_int_aj = createArray(4, 0);
    static val_arr_int_ak = createArray(4, 0);
    static val_arr_int_al = createArray(4, 0);
    static val_arr_int_am = createArray(4, 0);
    static val_int_e = 0;
    static val_int_f = 0;
    static val_long_a = 0;
    static val_int_bu = 0;
    static val_int_bv = 2;
    static val_int_g = -1;
    static val_int_bw = 1;
    static val_int_bx = 1;
    static val_bool_b = false;
    static val_int_h = -1;
    static val_int_i = 0;
    static val_graphicsadapter_a = null;
    static val_marketpanelcontroller_a = null;
    static val_bool_c = false;
    static val_bool_d = false;
    static val_bool_e = false;
    static val_audiomanager_a = null;
    static val_int_by = 0;
    static val_animationset_a = null;
    static val_animationset_b = null;
    static val_animationset_c = null;
    static val_animationset_d = null;
    static val_spritepartsequence_a = null;
    static val_spritepartsequence_b = null;
    static val_spritepartsequence_c = null;
    static val_spritepartsequence_d = null;
    static val_int_j = 0;
    static val_int_k = 0;
    static val_int_l = 0;
    static val_int_m = 0;
    static val_inputmanager_a = null;
    static val_arr_object_a = createArray(9, null);
    static val_int_n = 0;
    static val_int_o = 0;
    static val_int_bz = 0;
    static val_int_bA = 0;
    static val_int_bB = 0;
    static val_int_bC = 0;
    static val_int_bD = 0;
    static val_int_bE = 0;
    static val_int_p = 0;
    static val_bool_f = false;
    static val_bool_g = true;
    static val_bool_h = false;
    static val_bool_i = true;
    static val_bool_j = true;
    static val_bool_U = false;
    static val_string_a = null;
    static val_bool_V = true;
    static val_arr_short_a = null;
    static val_encodedtextbuffer_a = new EncodedTextBuffer();
    static val_bool_k = false;
    static val_int_bF = 0;
    static val_int_bG = 0;
    static val_int_bH = 0;
    static val_bool_W = false;
    static val_bool_X = false;
    static val_byte_j = 0;
    static val_byte_k = 0;
    static val_int_bI = 0;
    static val_byte_l = 0;
    static val_byte_m = 0;
    static val_int_bJ = 0;
    static val_int_bK = 0;
    static val_encodedtextbuffer_i = null;
    static val_int_bL = 0;
    static val_int_bM = 0;
    static val_int_bN = 0;
    static val_animationset_l = null;
    static val_spritepartsequence_j = null;
    static val_spritepartsequence_k = null;
    static val_spritepartsequence_l = null;
    static val_int_bO = 0;
    static val_int_bP = 0;
    static val_bool_Y = false;
    static val_arr_int_an = null;
    static val_arr_animationset_c = null;
    static val_arr_int_ao = null;
    static val_arr_int_ap = null;
    static val_arr_spritepartsequence_f = null;
    static val_arr_spritepartsequence_g = null;
    static val_int_bQ = 0;
    static val_int_bR = 0;
    static val_arr_int_aq = null;
    static val_arr_int_ar = null;
    static val_arr_int_as = null;
    static val_arr_int_at = null;
    static val_int_bS = 0;
    static val_encodedtextbuffer_j = null;
    static val_byte_n = 0;
    static val_int_bT = 0;
    static val_int_bU = 0;
    static val_int_bV = 0;
    static val_byte_o = 0;
    static val_byte_p = 0;
    static val_arr_arr_int_c = null;
    static val_arr_int_au = null;
    static val_int_bW = 0;
    static val_arr_int_av = null;
    static val_int_bX = 0;
    static val_int_bY = 0;
    static val_arr_int_aw = null;
    static val_encodedtextbuffer_k = null;
    static val_encodedtextbuffer_l = null;
    static val_int_bZ = 0;
    static val_int_ca = 0;
    static val_int_cb = 0;
    static val_int_cc = 0;
    static val_int_cd = 0;
    static val_int_ce = 0;
    static val_int_cf = 0;
    static val_int_cg = 0;
    static val_int_ch = 0;
    static val_int_ci = 0;
    static val_int_cj = 0;
    static val_int_ck = 0;
    static val_int_cl = 0;
    static val_int_cm = 0;
    static val_int_cn = 0;
    static val_int_co = 0;
    static val_int_cp = 0;
    static val_int_cq = 0;
    static val_arr_arr_bool_b = null;
    static val_int_cr = 0;
    static val_int_cs = 0;
    static val_bool_Z = false;
    static val_arr_int_ax = null;
    static val_arr_animationset_d = null;
    static val_arr_int_ay = null;
    static val_arr_int_az = null;
    static val_arr_spritepartsequence_h = null;
    static val_arr_spritepartsequence_i = null;
    static val_int_ct = 0;
    static val_arr_int_aA = null;
    static val_arr_int_aB = null;
    static val_arr_int_aC = null;
    static val_arr_int_aD = null;
    static val_int_cu = 0;
    static val_int_cv = 0;
    static val_bool_aa = false;
    static val_arr_int_c = createArray(6, 0);
    static val_arr_int_d = createArray(4, 0);
    static val_int_cw = 0;
    static val_int_cx = 0;
    static val_arr_int_aE = null;
    static val_int_cy = 0;
    static val_int_cz = 0;
    static val_arr_arr_int_d = null;
    static val_int_cA = 0;
    static val_encodedtextbuffer_m = null;
    static val_arr_short_f = null;
    static val_int_cB = 0;
    static val_int_cC = 0;
    static val_int_cD = 0;
    static val_int_cE = 0;
    static val_bool_ab = false;
    static val_bool_ac = false;
    static val_bool_ad = false;
    static val_bool_ae = false;
    static val_bool_af = false;
    static val_int_cF = 0;
    static val_bool_ag = false;
    static val_int_cG = 0;
    static val_bool_ah = false;
    static val_bool_ai = false;
    static val_long_c = 0;
    static val_long_d = 0;
    static val_long_e = 0;
    static val_long_f = 0;
    static val_long_g = 0;
    static val_bool_aj = false;
    static val_int_cH = 0;
    static val_animationset_m = null;
    static val_spritepartsequence_m = null;
    static val_int_cI = 0;
    static val_int_cJ = 0;
    static val_int_cK = 0;
    static val_int_cL = 0;
    static val_int_cM = 0;
    static val_int_cN = 0;
    static val_encodedtextbuffer_n = null;
    static val_bool_ak = false;
    static val_bool_al = false;
    static val_arr_byte_k = null;
    static val_bool_am = false;
    static val_int_cO = 0;
    static val_byte_q = 4;
    static val_arr_arr_byte_d = null;
    static val_arr_byte_l = null;
    static val_int_cP = 0;
    static val_int_cQ = 0;
    static val_int_cR = 0;
    static val_int_cS = 0;
    static val_int_cT = 0;
    static val_int_cU = 0;
    static val_int_cV = 0;
    static val_int_cW = 0;
    static val_int_cX = 0;
    static val_int_cY = 0;
    static val_int_cZ = 0;
    static val_int_da = 0;
    static val_int_db = 0;
    static val_int_dc = 0;
    static val_int_dd = 0;
    static val_int_de = 0;
    static val_int_df = 0;
    static val_int_dg = 0;
    static val_int_dh = 0;
    static val_int_di = 0;
    static val_int_dj = 0;
    static val_int_dk = 0;
    static val_int_dl = 0;
    static val_int_dm = 0;
    static val_int_dn = 0;
    static val_int_do = 0;
    static val_int_dp = 0;
    static val_int_dq = 0;
    static val_int_dr = 0;
    static val_int_ds = 0;
    static val_int_dt = 0;
    static val_int_du = 0;
    static val_int_dv = 0;
    static val_int_dw = 0;
    static val_int_dx = 0;
    static val_int_dy = 0;
    static val_int_dz = 0;
    static val_encodedtextbuffer_o = null;
    static val_int_dA = 0;
    static val_arr_int_aF = null;
    static val_int_dB = 0;
    static val_int_dC = 0;
    static val_encodedtextbuffer_p = null;
    static val_encodedtextbuffer_q = null;
    static val_encodedtextbuffer_r = null;
    static val_animationset_n = null;
    static val_spritepartsequence_n = null;
    static val_arr_int_aG = createArray(2, 0);
    static val_arr_encodedtextbuffer_f = createArray(2, null);
    static val_arr_encodedtextbuffer_g = createArray(2, null);
    static val_encodedtextbuffer_s = null;
    static val_encodedtextbuffer_t = null;
    static val_arr_int_aH = createArray(2, 0);
    static val_arr_int_aI = createArray(2, 0);
    static val_arr_int_aJ = createArray(2, 0);
    static val_arr_int_aK = createArray(2, 0);
    static val_arr_int_aL = createArray(2, 0);
    static val_arr_int_aM = createArray(2, 0);
    static val_arr_int_aN = createArray(2, 0);
    static val_int_dD = 0;
    static val_int_dE = 0;
    static val_int_dF = 0;
    static val_int_dG = 0;
    static val_int_dH = 0;
    static val_int_dI = 0;
    static val_int_dJ = 0;
    static val_int_dK = 0;
    static val_bool_an = false;
    static val_bool_ao = false;
    static val_bool_ap = false;
    static val_bool_aq = false;
    static val_bool_ar = false;
    static val_bool_as = false;
    static val_bool_at = false;
    static val_bool_au = false;
    static val_bool_av = false;
    static val_int_dL = 0;
    static val_int_q = 0;
    static val_int_dM = 0;
    static val_int_dN = 0;
    static val_int_dO = 0;
    static val_int_dP = 0;
    static val_byte_r = 0;
    static val_int_dQ = 0;
    static val_int_dR = 0;
    static val_coreengine_b = null;
    static val_coreengine_c = null;
    static val_coreengine_d = null;
    static val_int_dS = 0;
    static val_int_dT = 0;
    static val_int_dU = 0;
    static val_int_dV = 0;
    static val_coreengine_e = null;
    static val_bool_aw = false;
    static val_bool_ax = false;
    static val_byte_s = 0;
    static val_byte_t = 0;
    static val_encodedtextbuffer_u = null;
    static val_encodedtextbuffer_v = null;
    static val_encodedtextbuffer_w = null;
    static val_animationset_o = null;
    static val_spritepartsequence_o = null;
    static val_animationset_p = null;
    static val_spritepartsequence_p = null;
    static val_int_dW = 0;
    static val_int_dX = 0;
    static val_int_dY = 0;
    static val_bool_ay = false;
    static val_bool_az = false;
    static val_bool_aA = false;
    static val_int_dZ = 0;
    static val_int_ea = 0;
    static val_encodedtextbuffer_x = null;
    static val_encodedtextbuffer_y = null;
    static val_encodedtextbuffer_z = null;
    static val_encodedtextbuffer_A = null;
    static val_encodedtextbuffer_B = null;
    static val_encodedtextbuffer_C = null;
    static val_encodedtextbuffer_D = null;
    static val_encodedtextbuffer_E = null;
    static val_encodedtextbuffer_F = null;
    static val_encodedtextbuffer_G = null;
    static val_encodedtextbuffer_H = null;
    static val_encodedtextbuffer_I = null;
    static val_encodedtextbuffer_J = null;
    static val_encodedtextbuffer_K = null;
    static val_int_eb = 0;
    static val_int_ec = 0;
    static val_int_ed = 0;
    static val_bool_aB = false;
    static val_int_ee = 0;
    static val_animationset_q = null;
    static val_spritepartsequence_q = null;
    static val_int_ef = 0;
    static val_spritepartsequence_r = null;
    static val_int_eg = 0;
    static val_encodedtextbuffer_L = null;
    static val_arr_short_g = null;
    static val_encodedtextbuffer_M = null;
    static val_arr_short_h = null;
    static val_int_eh = 0;
    static val_int_ei = 0;
    static val_bool_aC = false;
    static val_bool_aD = false;
    static val_bool_aE = false;
    static val_encodedtextbuffer_N = null;
    static val_int_ej = 0;
    static val_encodedtextbuffer_O = null;
    static val_bool_aF = false;
    static val_bool_aG = false;
    static val_int_ek = 0;
    static val_bool_aH = false;
    static val_bool_aI = false;
    static val_bool_aJ = false;
    static val_bool_aK = false;
    static val_bool_aL = false;
    static val_bool_aM = false;
    static val_arr_arr_int_e = null;
    static val_arr_arr_int_f = null;
    static val_arr_arr_int_g = null;
    static val_arr_int_aO = null;
    static val_arr_effectactor_a = null;
    static val_int_el = 0;
    static val_int_em = 0;
    static val_arr_animationset_e = null;
    static val_animationset_r = null;
    static val_arr_animationset_f = null;
    static val_animationset_s = null;
    static val_animationset_t = null;
    static val_animationset_u = null;
    static val_spritepartsequence_s = null;
    static val_spritepartsequence_t = null;
    static val_animationset_v = null;
    static val_arr_spritepartsequence_j = null;
    static val_spritepartsequence_u = null;
    static val_spritepartsequence_v = null;
    static val_spritepartsequence_w = null;
    static val_spritepartsequence_x = null;
    static val_spritepartsequence_y = null;
    static val_spritepartsequence_z = null;
    static val_spritepartsequence_A = null;
    static val_arr_int_aP = null;
    static val_arr_int_aQ = null;
    static val_animationset_w = null;
    static val_spritepartsequence_B = null;
    static val_animationset_x = null;
    static val_arr_spritepartsequence_k = null;
    static val_rendercontext_a = null;
    static val_globalcontext_a = null;
    static val_object_a = new Object();
    static val_gamemidletloop_a = null;
    static val_scenebase_a = null;
    static val_maincanvasbridge_a = null;
    static isGlobalPaused = true;
    static val_gamemidletloop_b = null;
    static frameTimestampMs = 25;
    static audioChannelCount = 1;
    static val_arr_byte_m = createArray(0, 0);
    static saveRecordStore = null;
    static val_arr_byte_n = null;
    static val_int_en = -1;
    static val_int_eo = -1;
    static val_int_ep = -1;
    static val_bool_aN = false;
    static val_arr_string_a = null;
    static val_arr_int_e = null;
    static val_arr_string_b = createArray(0, null);
    static val_arr_arr_spritepartsequence_a = null;
    static val_arr_animationset_g = null;
    static val_arr_actorstatemachine_a = null;
    static val_arr_byte_o = null;
    static val_arr_int_aR = null;
    static val_arr_int_aS = null;
    static val_arr_int_aT = null;
    static val_arr_int_aU = null;
    static val_arr_int_aV = null;
    static val_arr_int_aW = null;
    static val_arr_arr_int_h = null;
    static val_arr_arr_short_c = null;
    static val_arr_arr_short_d = null;
    static val_arr_arr_short_e = null;
    static val_arr_arr_short_f = null;
    static val_arr_int_aX = null;
    static val_arr_int_aY = null;
    static val_arr_int_aZ = null;
    static val_arr_int_ba = null;
    static val_arr_int_bb = null;
    static val_arr_int_bc = null;
    static val_arr_int_bd = null;
    static val_arr_int_be = null;
    static val_arr_int_bf = null;
    static val_arr_arr_byte_e = null;
    static val_arr_arr_byte_f = null;
    static val_arr_arr_byte_g = null;
    static val_arr_arr_byte_h = null;
    static val_arr_arr_byte_i = null;
    static val_arr_arr_byte_j = null;
    static val_arr_arr_byte_k = null;
    static val_arr_arr_byte_l = null;
    static val_arr_arr_byte_m = null;
    static val_arr_arr_byte_n = null;
    static val_arr_arr_byte_o = null;
    static val_arr_arr_byte_p = null;
    static val_arr_arr_byte_q = null;
    static val_arr_arr_byte_r = null;
    static val_arr_arr_byte_s = null;
    static val_arr_arr_byte_t = null;
    static val_arr_arr_byte_u = null;
    static val_arr_arr_byte_v = null;
    static val_arr_arr_arr_arr_byte_a = null;
    static val_arr_arr_int_i = null;
    static val_arr_arr_arr_byte_b = null;
    static val_arr_arr_byte_w = null;
    static val_arr_arr_short_g = null;
    static val_arr_arr_short_h = null;
    static val_arr_short_i = null;
    static val_arr_short_j = null;
    static val_arr_short_k = null;
    static val_arr_short_l = null;
    static val_arr_short_m = null;
    static val_arr_short_n = null;
    static val_arr_short_o = null;
    static val_arr_short_p = null;
    static val_arr_short_q = null;
    static val_arr_short_r = null;
    static val_arr_short_s = null;
    static val_arr_short_t = null;
    static val_arr_short_u = null;
    static val_arr_short_v = null;
    static val_arr_short_w = null;
    static val_arr_short_x = null;
    static val_arr_short_y = null;
    static val_arr_short_z = null;
    static val_arr_short_A = null;
    static val_arr_short_B = null;
    static val_arr_short_C = null;
    static val_arr_short_D = null;
    static val_arr_short_E = null;
    static val_arr_short_F = null;
    static val_arr_arr_byte_x = null;
    static val_arr_int_bg = null;
    static val_arr_string_c = null;
    static val_arr_int_bh = null;
    static val_arr_arr_byte_y = null;
    static val_arr_string_d = null;
    static val_int_eq = 0;
    static val_int_er = 0;
    static val_int_es = 0;
    static val_int_et = 0;
    static val_arr_byte_p = null;
    static val_int_eu = 0;
    static val_int_ev = 0;
    static val_animationset_y = null;
    static val_spritepartsequence_C = null;
    static val_bool_aO = false;
    static val_int_ew = 0;
    static val_animationset_z = null;
    static val_spritepartsequence_D = null;
    static val_spritepartsequence_E = null;
    static val_spritepartsequence_F = null;
    static val_int_ex = 0;
    static val_int_ey = 0;
    static val_bool_aP = false;
    static val_int_ez = 0;
    static val_int_eA = 0;
    static val_animationset_A = null;
    static val_animationset_B = null;
    static val_spritepartsequence_G = null;
    static val_spritepartsequence_H = null;
    static val_bool_aQ = false;
    static val_coreengine_f = null;
    static val_animationset_C = null;
    static val_spritepartsequence_I = null;
    static val_arr_int_bi = null;
    static val_arr_arr_int_j = null;
    static val_arr_arr_short_a = null;
    static val_arr_arr_short_b = null;
    static val_arr_int_bj = null;
    static globalRandom = new Random(Date.now());
    static val_arr_long_a = null;
    static val_arr_arr_entityinterface_a = null;
    static val_arr_int_bk = null;
    static val_int_eB = -1;
    static val_int_eC = 0;
    static val_arr_int_bl = null;
    static val_int_eD = 0;
    static val_int_eE = 0;
    static val_arr_int_bm = null;
    static val_arr_int_bn = null;
    static val_arr_int_bo = null;
    static val_arr_int_bp = null;
    static val_arr_int_bq = null;
    static val_arr_int_br = null;
    static val_int_eF = 0;
    static val_int_eG = 0;
    static val_int_eH = 0;
    static val_int_eI = 0;
    static val_int_eJ = -1;
    static val_arr_int_bs = createArray(800, 0);
    static val_arr_arr_int_k = null;
    static val_arr_arr_arr_byte_c = null;
    static val_arr_arr_byte_z = null;
    static val_arr_string_e = null;
    static val_int_eK = 0;
    static val_int_eL = 0;
    static val_int_eM = 0;
    static val_int_eN = 0;
    static val_int_eO = 0;
    static val_int_eP = 0;
    static val_int_eQ = 0;
    static val_int_eR = 0;
    static val_int_eS = 0;
    static val_int_eT = 0;
    static val_int_eU = 0;
    static val_int_eV = 0;
    static val_int_eW = 0;
    static val_int_eX = 0;
    static val_byte_a = 8;
    static val_byte_b = (((((0 + CoreEngine.val_byte_a) + 6)) << 24) >> 24);
    static val_arr_byte_a = createArray(5, 0);
    static val_bool_m = false;
    static {
        CoreEngine.initStaticTables1();
        CoreEngine.initStaticTables2();
        CoreEngine.initStaticTables3();
        CoreEngine.initStaticTables4();
        CoreEngine.initStaticTables5();
        CoreEngine.initStaticTables6();
        CoreEngine.initStaticTables7();
        CoreEngine.initStaticTables8();
    }
    constructor() {
        (this.actorPhysicsArray = createArray(11, 0));
        (this.scratchpadBuffer = createArray(128, 0));
        CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
        this.setActorAnimation(1);
    }
    setActorAnimation(var1) {
        if (((this.actorCurrentAnimIndex) !== (var1) && this.canAcceptAnimCommand())) {
            (this.requestedAnimIndex = var1);
            (this.actorCurrentAnimIndex = var1);
        }
    }
    getActiveComboByte() {
        if ((this.facingDirectionFlag) === (0)) {
            let var3 = 0;
            if ((this.actorCurrentAnimIndex) === (1)) {
                if ((this.playerSideIndex) === (0)) {
                    (var3 = 0);
                } else {
                    (var3 = 2);
                }
            } else {
                if ((this.playerSideIndex) === (0)) {
                    (var3 = 1);
                } else {
                    (var3 = 3);
                }
            }
            let var1 = CoreEngine.val_arr_arr_int_k[var3];
            for (let var4 = 0; (var4 < var1.length); var4++) {
                let var2 = 0;
                if (((((var4) !== (0) && (var4) !== (1)) && (var4) !== (2)) && (var4) !== (3))) {
                    (var2 = CoreEngine.val_int_dH);
                } else {
                    (var2 = CoreEngine.val_int_dF);
                }
                if (((var1[var4] & var2)) !== (0)) {
                    return var4;
                }
            }
        }
        return 10;
    }
    canAcceptAnimCommand() {
        let var1 = false;
        if ((((((((((((this.actorTimerW) !== (0) && (this.actorTimerW) !== (1)) && (this.actorTimerW) !== (2)) && (this.actorTimerW) !== (3)) && ((this.actorTimerW) !== (9) || (this.actorTimerX) !== (0))) && ((this.actorTimerW) !== (12) || (this.actorTimerX) !== (0))) && ((this.actorTimerW) !== (14) || (this.actorTimerX < 200))) && ((this.actorTimerW) !== (25) || (this.actorTimerX) !== (0))) && ((this.actorTimerW) !== (24) || (this.actorTimerX) !== (0))) && ((this.actorTimerW) !== (15) || (this.actorTimerX) !== (0))) && (this.actorTimerW) !== (102))) {
            (var1 = false);
        } else {
            (var1 = true);
        }
        return var1;
    }
    static spawnActor(var0, var1, var2, var3, var4, var5, var6, var7) {
        let var8 = null;
        for (let var9 = 0; (var9 < 8); var9++) {
            if ((CoreEngine.actorPoolArray[var9].actorLifecycleState) === (0)) {
                ((var8 = CoreEngine.actorPoolArray[var9]).facingDirectionFlag = var9);
                var8.setCharacterId(var0);
                (var8.layerDepth = var4);
                (var8.playerSideIndex = var5);
                (var8.val_bool_o = var6);
                (var8.val_int_O = var7);
                (var8.val_bool_q = true);
                var8.setActorPosition(var1, 0);
                var8.setActorAnimation(var3);
                break;
            }
        }
        return var8;
    }
    adjustEnergyMeter(var1) {
        if (((var1 < 0) && (this.superMeterEnergy > 0))) {
            (this.energyDrainFlag = 0);
        }
        (this.superMeterEnergy += var1);
        (this.superMeterEnergy = Math.max(this.superMeterEnergy, 0));
        (this.superMeterEnergy = Math.min(this.superMeterEnergy, 25600));
    }
    toString() {
        return this.fighterNameBuffer.toString();
    }
    setCharacterId(var1) {
        let var2 = false;
        if (((this.characterId) === (var1) && (this.actorLifecycleState) === (2))) {
            (var2 = false);
        } else {
            (var2 = true);
        }
        (this.characterId = var1);
        if (var2) {
            CoreEngine.exec_a_entityinterface_int_to_void(this, this.val_int_O);
            this.setActorLifecycle(1);
        }
    }
    setActorPosition(var1, var2) {
        (this.actorPhysicsArray[0] = (var1 << 8));
        (this.actorPhysicsArray[1] = (var2 << 8));
        (this.actorPhysicsArray[8] = (var1 << 8));
        (this.actorPhysicsArray[9] = (var2 << 8));
        (this.actorPhysicsArray[7] = 0);
    }
    static initActorPool() {
        (CoreEngine.actorPoolArray = createArray(8, null));
        for (let var0 = 0; (var0 < CoreEngine.actorPoolArray.length); var0++) {
            (CoreEngine.actorPoolArray[var0] = new CoreEngine());
        }
    }
    setActorLifecycle(var1) {
        switch (var1) {
            case 0:
            default:
                break;
            case 1:
                (this.val_bool_p = false);
                (this.animationTick = 0);
                break;
            case 2:
                this.updateActor(0);
                (this.actorActiveFlag = true);
                if (this.val_bool_q) {
                    CoreEngine.exec_b_entityinterface_int_to_void(this, this.val_int_O);
                }
                if (this.val_bool_o) {
                    (this.val_bool_p = true);
                }
                (this.val_bool_y = true);
                (this.val_bool_A = false);
                break;
            case 3:
                CoreEngine.exec_a_entityinterface_int_to_void(this, this.val_int_O);
                let var2 = this;
                for (let var3 = 0; (var3 < CoreEngine.actorPoolArray.length); var3++) {
                    if ((CoreEngine.actorPoolArray[var3]) === (var2)) {
                        (CoreEngine.actorPoolArray[var3].actorLifecycleState = 0);
                    }
                }
                let var4 = this.characterId;
                let var5 = 0;
                let var10000 = false;
                while (true) {
                    if ((var5 >= CoreEngine.actorPoolArray.length)) {
                        (var10000 = true);
                        break;
                    }
                    if (((CoreEngine.actorPoolArray[var5]) !== (null) && (CoreEngine.actorPoolArray[var5].characterId) === (var4))) {
                        (var10000 = false);
                        break;
                    }
                    var5++;
                }
                if (var10000) {
                    CoreEngine.exec_E_int_to_void(this.spriteTransformLookupB[0]);
                    CoreEngine.exec_J_int_to_void(this.characterId);
                }
        }
        (this.actorLifecycleState = var1);
    }
    static tickActors() {
        if ((CoreEngine.actorPoolArray) === (null)) {
            CoreEngine.initActorPool();
        }
        for (let var0 = 0; (var0 < CoreEngine.actorPoolArray.length); var0++) {
            let var1 = null;
            switch ((var1 = CoreEngine.actorPoolArray[var0]).actorLifecycleState) {
                case 1:
                    if ((var1.animationTick >= 4)) {
                        var1.setActorLifecycle(2);
                    }
                    break;
                case 3:
                    var1.setActorLifecycle(0);
            }
            switch (var1.actorLifecycleState) {
                case 1:
                    switch (var1.animationTick) {
                        case 0:
                            var1.exec_f_to_bool();
                            var1.animationTick++;
                            break;
                        case 1:
                            var1.exec_g_to_bool();
                            var1.animationTick++;
                            break;
                        case 2:
                            var1.animationTick++;
                            break;
                        case 3:
                            (var1.currentHealth = 100);
                            (var1.superMeterEnergy = 25600);
                            (var1.spriteTransformLookupB = CoreEngine.val_arr_arr_short_g[var1.characterId]);
                            (var1.spriteTransformLookupC = CoreEngine.val_arr_arr_short_h[var1.characterId]);
                            (var1.characterMoveFrames = CoreEngine.val_arr_arr_arr_arr_byte_a[var1.characterId]);
                            if (((var1.playerSideIndex) === (1) && (var1.characterMoveFrames) !== (null))) {
                                let var2 = var1.characterMoveFrames;
                                let var7 = createArray(var1.characterMoveFrames.length, null);
                                for (let var3 = 0; (var3 < var2.length); var3++) {
                                    (var7[var3] = createArray(var2[var3].length, null));
                                    for (let var4 = 0; (var4 < var2[var3].length); var4++) {
                                        if ((var4) === (0)) {
                                            switch (var3) {
                                                case 0:
                                                    (var7[var3][var4] = createArray(2, 0));
                                                    (var7[var3][var4][0] = 9);
                                                    (var7[var3][var4][1] = 2);
                                                    break;
                                                case 1:
                                                    (var7[var3][var4] = createArray(2, 0));
                                                    (var7[var3][var4][0] = 7);
                                                    (var7[var3][var4][1] = 2);
                                                    break;
                                                case 2:
                                                    (var7[var3][var4] = createArray(1, 0));
                                                    (var7[var3][var4][0] = 2);
                                            }
                                        } else {
                                            (var7[var3][var4] = createArray(var2[var3][var4].length, 0));
                                            for (let var5 = 0; (var5 < var2[var3][var4].length); var5++) {
                                                let var6 = var2[var3][var4][var5];
                                                let var8 = false;
                                                if (((var4 % 2)) === (0)) {
                                                    (var8 = true);
                                                } else {
                                                    (var8 = false);
                                                }
                                                if ((!var8 || ((var6) !== (0) && (var6) !== (1)))) {
                                                    (var7[var3][var4][var5] = var6);
                                                } else {
                                                    (var7[var3][var4][var5] = 2);
                                                }
                                            }
                                        }
                                    }
                                }
                                (var1.characterMoveFrames = var7);
                            }
                            if ((var1.playerSideIndex) === (0)) {
                                (var1.val_arr_arr_byte_a = CoreEngine.val_arr_arr_arr_byte_b[var1.characterId]);
                            } else {
                                (var1.val_arr_arr_byte_a = CoreEngine.val_arr_arr_byte_w);
                            }
                            let var12 = var1.characterId;
                            let var10 = var1.characterMoveFrames;
                            let var9 = var1.val_arr_arr_byte_a;
                            let var14 = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(46, null);
                            let var15 = null;
                            ((var15 = createArray(8, null))[0] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(CoreEngine.val_arr_int_bd[var12], null));
                            (var15[1] = new EncodedTextBuffer(CoreEngine.exec_a_arr_byte_to_string(var9[0])));
                            (var15[2] = new EncodedTextBuffer(CoreEngine.exec_a_arr_byte_to_string(var9[1])));
                            if ((var10) !== (null)) {
                                (var15[3] = new EncodedTextBuffer(CoreEngine.exec_a_arr_arr_byte_to_string(var10[0])));
                                (var15[4] = new EncodedTextBuffer(CoreEngine.exec_a_arr_arr_byte_to_string(var10[1])));
                                (var15[5] = new EncodedTextBuffer(CoreEngine.exec_a_arr_arr_byte_to_string(var10[2])));
                            } else {
                                (var15[3] = new EncodedTextBuffer("---"));
                                (var15[4] = new EncodedTextBuffer("---"));
                                (var15[5] = new EncodedTextBuffer("---"));
                            }
                            let var13 = false;
                            if ((var12) !== (6)) {
                                (var13 = true);
                            } else {
                                (var13 = false);
                            }
                            let var11 = var13;
                            if (((var9[2]) !== (null) && var13)) {
                                (var15[6] = new EncodedTextBuffer(CoreEngine.exec_a_arr_byte_to_string(var9[2])));
                            } else {
                                (var15[6] = new EncodedTextBuffer("---"));
                            }
                            if (((var9[3]) !== (null) && var11)) {
                                (var15[7] = new EncodedTextBuffer(CoreEngine.exec_a_arr_byte_to_string(var9[3])));
                            } else {
                                (var15[7] = new EncodedTextBuffer("---"));
                            }
                            (var1.fighterTitleBuffer = var14.concatAll(var15));
                            (var1.fighterNameBuffer = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(CoreEngine.val_arr_int_bd[var1.characterId], null));
                            (var1.val_arr_int_g = CoreEngine.val_arr_arr_int_i[var1.characterId]);
                            var1.animationTick++;
                    }
            }
            if ((CoreEngine.actorPoolArray[var0].actorLifecycleState) === (2)) {
                let var16 = null;
                let var17 = null;
                if (((((var17 = CoreEngine.actorPoolArray[var0]).val_bool_y && ((var16 = var17.exec_a_to_spritepartsequence())) !== (null)) && (var17.actorTimerW) !== (18)) && (var17.actorTimerW) !== (19))) {
                    (var17.actorTimerR = var16.getPartYOffset(var17.actorTimerR, CoreEngine.val_int_e));
                }
                CoreEngine.exec_a_coreengine_to_void(var17);
                (var17.val_bool_u = false);
                (var17.val_bool_v = false);
            }
        }
    }
    setActorSubState(var1) {
        (this.val_bool_z = false);
        (this.actorTimerV = var1);
        (this.actorTimerR = 1);
    }
    setActorDirection(var1) {
        (this.val_bool_z = false);
        (this.actorTimerV = var1);
        let var10001 = this.exec_a_to_spritepartsequence();
        (var1 = var10001.sequenceFlags);
        let var2 = (var10001.partOffsets.length - 1);
        (this.actorTimerR = CoreEngine.exec_a_int_int_int_to_int(var1, var2, 2));
    }
    setActorHealthDelta(var1) {
        (this.val_bool_z = false);
        (this.actorTimerV = var1);
        let var10001 = this.exec_a_to_spritepartsequence();
        (var1 = var10001.sequenceFlags);
        let var2 = (var10001.partOffsets.length - 1);
        (this.actorTimerR = CoreEngine.exec_a_int_int_int_to_int(var1, var2, 1));
    }
    exec_a_spritepartsequence_animationset_to_void(var1, var2) {
        (this.actorTimerR = 1);
        (this.val_bool_z = true);
        (this.val_spritepartsequence_e = var1);
        (this.val_animationset_f = var2);
    }
    exec_f_to_bool() {
        let var3 = CoreEngine.val_arr_int_aS[this.characterId];
        try {
            let var2 = 0;
            if (CoreEngine.exec_y_to_bool()) {
                (var2 = 2);
            } else {
                (var2 = 1);
            }
            let var1 = createArray(var2, 0);
            if (CoreEngine.exec_y_to_bool()) {
                (var2 = 2);
            } else {
                (var2 = 1);
            }
            let var8 = createArray(var2, 0);
            let var4 = this;
            let var5 = false;
            if ((CoreEngine.val_int_dQ) === (CoreEngine.val_int_dR)) {
                (var5 = true);
            } else {
                (var5 = false);
            }
            if (((var5 || CoreEngine.exec_A_to_bool()) && (var4) === (CoreEngine.val_coreengine_c))) {
                (var5 = true);
            } else {
                (var5 = false);
            }
            if (var5) {
                (var1[0] = CoreEngine.val_arr_int_aT[this.characterId]);
            } else {
                (var1[0] = -1);
            }
            (var8[0] = 0);
            if (CoreEngine.exec_y_to_bool()) {
                (var8[1] = 0);
                (var1[1] = CoreEngine.val_arr_int_aU[this.characterId]);
            }
            (this.currentAnimSet = CoreEngine.exec_a_int_arr_int_arr_byte_bool_to_animationset(var3, var1, var8, false));
            return false;
        } catch (var6) {
            return true;
        }
    }
    exec_r_int_to_void(var1) {
        (this.spawnParamP = var1);
        this.currentAnimSet.setFrame(this.spawnParamP);
    }
    exec_g_to_bool() {
        let var4 = CoreEngine.val_arr_arr_int_h[this.characterId];
        try {
            (this.spriteSequences = createArray(Math.trunc((var4.length) / (2)), null));
            for (let var1 = 0; (var1 < var4.length); (var1 += 2)) {
                let var2 = var4[var1];
                let var3 = var4[(var1 + 1)];
                if ((var2) !== (-1)) {
                    (this.spriteSequences[Math.trunc((var1) / (2))] = CoreEngine.exec_a_int_int_to_spritepartsequence(var2, var3));
                }
            }
            return false;
        } catch (var5) {
            return true;
        }
    }
    updateActor(var1) {
        if (this.exec_r_to_bool()) {
            let var2 = false;
            if ((((((((((var1) !== (6) && (var1) !== (8)) && (var1) !== (7)) && (var1) !== (3)) && (var1) !== (11)) && (var1) !== (17)) && (var1) !== (30)) && (var1) !== (16)) && (var1) !== (10))) {
                (var2 = false);
            } else {
                (var2 = true);
            }
            if (var2) {
                return;
            }
        }
        switch (this.actorTimerW) {
            case 4:
            case 5:
            case 9:
            case 10:
            case 11:
            case 21:
                (this.actorTimerY = 0);
            case 6:
            case 7:
            case 8:
            case 12:
            case 13:
            case 14:
            case 15:
            case 16:
            case 17:
            case 18:
            case 19:
            case 20:
            case 22:
            case 24:
            case 25:
            case 26:
            case 27:
            case 28:
            case 29:
            case 31:
            case 32:
            default:
                break;
            case 23:
                this.exec_r_int_to_void(0);
                break;
            case 30:
                (this.val_bool_y = true);
                (this.val_int_Y = 0);
        }
        (this.val_bool_r = false);
        (this.val_bool_w = false);
        (this.val_bool_x = false);
        (this.val_bool_s = false);
        (this.val_bool_z = false);
        (this.val_int_ad = 0);
        if ((((((var1) === (30) || (var1) === (4)) || (var1) === (31)) || (var1) === (9)) || (var1) === (26))) {
            (CoreEngine.val_coreengine_d = this);
        }
        switch (var1) {
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 17:
                this.exec_b_int_to_bool(0);
            case 12:
            case 14:
            case 15:
            case 16:
            case 18:
            case 20:
            case 22:
            case 23:
            case 24:
            case 25:
            case 27:
            case 28:
            case 29:
            case 30:
            default:
                break;
            case 13:
                if ((this.playerSlot) === (19)) {
                    this.exec_b_int_to_bool(5);
                }
                break;
            case 19:
                let var3 = null;
                let var4 = false;
                if ((((var3 = CoreEngine.exec_b_coreengine_to_coreengine(this)).characterId) !== (2) && (var3.characterId) !== (5))) {
                    (var4 = false);
                } else {
                    (var4 = true);
                }
                if (var4) {
                    this.exec_b_int_to_bool(5);
                }
                break;
            case 21:
                this.exec_b_int_to_bool(7);
                break;
            case 26:
                this.exec_b_int_to_bool(10);
                break;
            case 31:
                if (((CoreEngine.exec_g_to_int() >= 64) && (CoreEngine.exec_b_coreengine_to_coreengine(this).actorTimerW) !== (15))) {
                    this.exec_b_int_to_bool(0);
                }
        }
        label134: switch (var1) {
            case 0:
                CoreEngine.exec_b_coreengine_to_void(this);
                if ((this.actorTimerW) === (24)) {
                    this.setActorDirection(1);
                } else {
                    this.setActorSubState(0);
                }
                break;
            case 1:
                if ((this.actorTimerW) !== (1)) {
                    this.setActorSubState(6);
                }
                break;
            case 2:
                if ((this.actorTimerW) !== (2)) {
                    this.setActorDirection(6);
                }
                break;
            case 3:
                if ((this.actorTimerW) !== (3)) {
                    if ((this.actorTimerW) === (25)) {
                        this.setActorDirection(5);
                    } else {
                        if (((this.actorTimerW) !== (11) && (this.actorTimerW) !== (10))) {
                            this.setActorSubState(4);
                        } else {
                            this.setActorHealthDelta(4);
                        }
                    }
                }
                break;
            case 4:
                this.setActorSubState(10);
                (this.val_bool_F = false);
                (this.val_bool_E = false);
                CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
                break;
            case 5:
                this.setActorSubState(14);
                CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
                break;
            case 6:
            case 8:
                this.setActorSubState(17);
                break;
            case 7:
                this.setActorSubState(19);
                break;
            case 9:
                this.setActorSubState(20);
                CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
                break;
            case 10:
                this.setActorSubState(15);
                CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
                break;
            case 11:
                this.setActorSubState(13);
                CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
                break;
            case 12:
                this.setActorSubState(3);
                break;
            case 13:
                CoreEngine.exec_M_int_to_void(500);
                (CoreEngine.val_int_eW = 300);
                this.setActorSubState(8);
                break;
            case 14:
                CoreEngine.exec_b_coreengine_to_void(this);
                this.setActorSubState(9);
                break;
            case 15:
                this.setActorSubState(2);
                break;
            case 16:
                if ((this.actorTimerW) !== (16)) {
                    this.setActorSubState(7);
                }
                break;
            case 17:
                (this.actorCounterE += 2500);
                this.setActorSubState(16);
                this.opposingActorRef.updateActor(18);
                CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
                (CoreEngine.val_coreengine_d = this);
                break;
            case 18:
                (this.actorActiveFlag = false);
                (this.val_bool_s = true);
                break;
            case 19:
                this.exec_s_int_to_void(16);
                (this.actorActiveFlag = false);
                (this.val_bool_s = false);
                break;
            case 20:
                this.setActorSubState(33);
                break;
            case 21:
                (this.actorTimerZ = 0);
                (this.linkedStateMachine = null);
                if (this.actorActiveFlag) {
                    this.setActorSubState(21);
                } else {
                    this.setActorSubState(27);
                }
                this.exec_r_to_void();
                break;
            case 22:
                (this.val_bool_s = true);
                this.setActorSubState(22);
                break;
            case 23:
                this.exec_r_int_to_void(1);
                (this.val_int_Z = ((this.actorTimerR & 65532) >>> 2));
                break;
            case 24:
                this.setActorSubState(1);
                (this.val_bool_G = true);
                break;
            case 25:
                this.setActorSubState(5);
                (this.val_bool_G = true);
                break;
            case 26:
                (this.actorCounterA = 0);
                switch (this.characterId) {
                    case 0:
                        this.setActorSubState(26);
                        (this.actorCurrentAnimIndex = -this.actorCurrentAnimIndex);
                        break label134;
                    case 1:
                        this.setActorSubState(26);
                        break label134;
                    case 2:
                        this.setActorSubState(26);
                        (this.actorTimerS = 1);
                        break label134;
                    case 3:
                        this.setActorSubState(19);
                        break label134;
                    case 4:
                        (this.actorActiveFlag = false);
                        break;
                    case 5:
                        CoreEngine.exec_a_int_int_bool_bool_to_void(this.exec_a_to_int(), (this.exec_b_to_int() - 55), true, false);
                    case 6:
                        break;
                    default:
                        break label134;
                }
                this.setActorSubState(26);
                break;
            case 27:
                this.setActorSubState(23);
                this.exec_r_to_void();
                break;
            case 28:
            case 33:
                (CoreEngine.val_coreengine_d = this);
                (CoreEngine.val_int_eu = 0);
                (CoreEngine.val_int_ev = 0);
                (CoreEngine.val_bool_aO = false);
            case 29:
            case 37:
            case 38:
            case 39:
            case 40:
            case 41:
            case 42:
            case 43:
            case 44:
            case 45:
            case 46:
            case 47:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 58:
            case 59:
            case 60:
            case 61:
            case 62:
            case 63:
            case 64:
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 91:
            case 92:
            case 93:
            case 94:
            case 95:
            case 96:
            case 97:
            case 98:
            case 99:
            case 101:
            default:
                break;
            case 30:
                (this.val_int_aa = 500);
                CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
                this.setActorSubState(this.characterMoveFrames[this.actorSubStateG][((this.actorSubStateH << 1) + 1)][0]);
                break;
            case 31:
                if (this.val_bool_E) {
                    this.setActorDirection(11);
                } else {
                    this.setActorSubState(11);
                }
                (this.val_bool_F = false);
                CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
                break;
            case 32:
                this.exec_r_to_void();
                this.setActorSubState(23);
                break;
            case 34:
                (this.actorActiveFlag = false);
                break;
            case 35:
                this.exec_r_to_void();
                this.setActorSubState(3);
                break;
            case 36:
                this.exec_r_to_void();
                this.setActorDirection(19);
                break;
            case 100:
                this.setActorSubState(27);
                break;
            case 102:
                this.setActorSubState(3);
                (this.actorActiveFlag = true);
                (this.actorPhysicsArray[1] = 0);
                (this.val_bool_t = true);
        }
        (this.actorTimerX = 0);
        (this.playerSlot = this.actorTimerW);
        (this.actorTimerW = var1);
    }
    exec_r_to_void() {
        (this.actorPhysicsArray[7] = 0);
        (this.actorPhysicsArray[4] = 0);
        (this.actorPhysicsArray[2] = 0);
        (this.actorPhysicsArray[3] = 0);
    }
    exec_a_to_spritepartsequence() {
        if (this.val_bool_z) {
            return this.val_spritepartsequence_e;
        } else {
            return ((((this.spriteSequences) !== (null) && (this.actorTimerV >= 0)) && (this.actorTimerV < this.spriteSequences.length)) ? this.spriteSequences[this.actorTimerV] : null);
        }
    }
    exec_h_to_bool() {
        let var1 = false;
        if (((this.actorTimerR & 3)) === (0)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    exec_a_to_arr_byte() {
        return ((((this.actorSubStateH + 1) << 1) >= this.characterMoveFrames[this.actorSubStateG].length) ? null : this.characterMoveFrames[this.actorSubStateG][((this.actorSubStateH + 1) << 1)]);
    }
    exec_d_to_arr_int() {
        return this.val_arr_int_g;
    }
    exec_d_int_int_to_void(var1, var2) {
        (this.actorTimerV = var1);
        (this.actorTimerR = this.exec_a_to_spritepartsequence().getPartXOffset(var2));
    }
    exec_i_to_bool() {
        let var1 = false;
        if ((this.currentHealth <= 0)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    exec_j_to_bool() {
        let var1 = false;
        if ((this.superMeterEnergy <= 0)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    exec_e_to_int() {
        return this.layerDepth;
    }
    exec_e_int_int_to_void(var1, var2) {
        let var3 = (this.actorPhysicsArray[0] + var1);
        (this.actorPhysicsArray[0] = var3);
        (var3 = (this.actorPhysicsArray[1] + var2));
        (this.actorPhysicsArray[1] = var3);
        (var3 = (this.actorPhysicsArray[8] + var1));
        (this.actorPhysicsArray[8] = var3);
        (var3 = (this.actorPhysicsArray[9] + var2));
        (this.actorPhysicsArray[9] = var3);
    }
    exec_k_to_bool() {
        return this.val_bool_p;
    }
    exec_s_to_void() {
        let var1 = CoreEngine.exec_b_coreengine_to_coreengine(this);
        let var2 = CoreEngine.exec_a_coreengine_to_coreengine(this);
        (this.val_int_ab = (this.val_int_ab + CoreEngine.val_int_f));
        let var3 = 0;
        switch (CoreEngine.val_int_bx) {
            case 0:
                (var3 = 5);
                break;
            case 1:
                (var3 = 20);
                break;
            case 2:
                (var3 = 40);
        }
        switch (CoreEngine.val_int_cz) {
            case 0:
                (var3 += 5);
                break;
            case 1:
                (var3 += 10);
                break;
            case 2:
                (var3 += 20);
        }
        switch (CoreEngine.val_int_bx) {
            case 0:
                (var3 += (CoreEngine.val_int_cA << 3));
                break;
            case 1:
                (var3 += (CoreEngine.val_int_cA * 10));
                break;
            case 2:
                (var3 += (CoreEngine.val_int_cA * 12));
        }
        (var3 = Math.min(100, var3));
        if ((this.val_int_ab > this.val_int_ac)) {
            (this.val_int_ac = CoreEngine.exec_a_int_int_to_int(700, 2000));
            (this.val_int_ab = 0);
            let var8 = false;
            if ((CoreEngine.exec_a_int_int_to_int(0, 100) < var3)) {
                (var8 = true);
            } else {
                (var8 = false);
            }
            (this.val_bool_C = var8);
        }
        if ((this.characterId) === (6)) {
            (var1 = this);
            (var2 = CoreEngine.exec_b_coreengine_to_coreengine(this));
            switch (var1.actorTimerW) {
                case 0:
                case 1:
                case 2:
                case 3:
                    if ((((var1.playerSlot) === (24) || (var1.playerSlot) === (25)) || (var1.playerSlot) === (15))) {
                        var1.updateActor(26);
                        return;
                    }
                    if ((var2.actorTimerW) === (10)) {
                        if ((var2.actorTimerX < 200)) {
                            var1.updateActor(2);
                            return;
                        }
                        if ((CoreEngine.exec_g_to_int() < 64)) {
                            var1.updateActor(21);
                            return;
                        }
                        var1.updateActor(26);
                        return;
                    }
                    if (((var2.actorTimerW) !== (27) || (var2.actorTimerX >= 630))) {
                        if (((var2.actorTimerW) === (21) || (var2.actorTimerW) === (12))) {
                            let var6 = 0;
                            if ((CoreEngine.exec_a_int_int_to_int(0, 1)) === (0)) {
                                (var6 = 21);
                            } else {
                                (var6 = 26);
                            }
                            var1.updateActor(var6);
                            return;
                        }
                        if ((var2.actorTimerW) === (9)) {
                            if ((var2.playerSlot) === (8)) {
                                var1.updateActor(21);
                                return;
                            }
                            var1.updateActor(26);
                            return;
                        }
                        if ((var2.actorTimerW) === (6)) {
                            var1.updateActor(26);
                            return;
                        }
                        if ((CoreEngine.exec_g_to_int() <= 64)) {
                            switch (CoreEngine.exec_a_int_int_to_int(0, 3)) {
                                case 0:
                                    var1.updateActor(4);
                                    return;
                                case 1:
                                    var1.updateActor(5);
                                    return;
                                case 2:
                                    var1.updateActor(21);
                                    return;
                                case 3:
                                    var1.updateActor(26);
                                default:
                                    return;
                            }
                        }
                        if ((var2.actorTimerW) === (1)) {
                            var1.updateActor(2);
                            return;
                        }
                        var1.updateActor(1);
                    }
            }
        } else {
            if (!this.val_bool_C) {
                switch (this.actorTimerW) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                        if ((this.val_int_ab > 1800)) {
                            switch (CoreEngine.exec_a_int_int_to_int(0, 1)) {
                                case 0:
                                    this.updateActor(26);
                                    break;
                                case 1:
                                    if (this.exec_s_to_bool()) {
                                        this.updateActor(21);
                                    }
                            }
                        } else {
                            if ((this.actorTimerW) !== (0)) {
                                this.updateActor(0);
                            }
                        }
                }
            }
            if (this.val_bool_C) {
                switch (this.actorTimerW) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 16:
                        if (((this.playerSlot) === (15) && ((var1.actorTimerW) === (4) || (var1.actorTimerW) === (31)))) {
                            this.updateActor(11);
                            return;
                        }
                        if ((((var1.actorTimerW) === (30) && (CoreEngine.exec_g_to_int() <= 64)) && ((this.playerSlot) === (24) || (this.playerSlot) === (25)))) {
                            if ((var2) !== (null)) {
                                (this.opposingActorRef = var2);
                                this.updateActor(17);
                                return;
                            }
                            this.updateActor(2);
                            return;
                        }
                        if ((CoreEngine.val_int_dL) === (3)) {
                            if ((var1.actorTimerV) === (22)) {
                                if (this.exec_l_to_bool()) {
                                    this.updateActor(33);
                                    return;
                                }
                                if (this.exec_m_to_bool()) {
                                    this.updateActor(28);
                                    return;
                                }
                                if (this.exec_s_to_bool()) {
                                    this.updateActor(21);
                                    return;
                                }
                            }
                            break;
                        } else {
                            if ((var1.actorTimerW) === (1)) {
                                this.updateActor(2);
                                return;
                            }
                            if ((((var1.actorTimerW) === (12) || (var1.actorTimerW) === (13)) || (var1.actorTimerW) === (14))) {
                                this.updateActor(2);
                                return;
                            }
                            if ((((this.actorTimerW) === (3) && (var1.linkedStateMachine) !== (null)) && var1.linkedStateMachine.isGrounded())) {
                                this.updateActor(3);
                                return;
                            }
                            if (((var1.actorTimerW) === (22) && !var1.exec_i_to_bool())) {
                                if ((CoreEngine.exec_g_to_int() > 60)) {
                                    this.updateActor(1);
                                    return;
                                }
                                this.updateActor(10);
                                return;
                            }
                            if ((var1.actorTimerW) === (23)) {
                                if ((CoreEngine.exec_g_to_int() > 60)) {
                                    this.updateActor(1);
                                    return;
                                }
                                this.updateActor(10);
                                return;
                            }
                            if (((((CoreEngine.exec_g_to_int() > 92) && (CoreEngine.exec_g_to_int() < 106)) && (CoreEngine.exec_a_int_int_to_int(0, 100) <= 10)) && this.exec_s_to_bool())) {
                                this.updateActor(21);
                                return;
                            }
                            if ((var1.actorTimerW) === (21)) {
                                if ((CoreEngine.exec_g_to_int() > 128)) {
                                    if ((this.characterId) === (1)) {
                                        this.updateActor(26);
                                        return;
                                    }
                                    if ((this.characterId) === (0)) {
                                        this.updateActor(26);
                                        return;
                                    }
                                    if ((this.characterId) === (5)) {
                                        this.updateActor(26);
                                        return;
                                    }
                                    this.updateActor(3);
                                    return;
                                }
                                if ((CoreEngine.exec_g_to_int() > 92)) {
                                    this.updateActor(6);
                                    return;
                                }
                                this.updateActor(11);
                                return;
                            }
                            if (((var2) !== (null) && (CoreEngine.exec_a_int_int_to_int(0, 100) <= 20))) {
                                (this.opposingActorRef = var2);
                                this.updateActor(17);
                                return;
                            }
                            if (((var1.actorTimerW) === (10) && (CoreEngine.exec_g_to_int() < 60))) {
                                if ((var1.actorTimerX > 300)) {
                                    this.updateActor(10);
                                    return;
                                }
                                this.updateActor(3);
                                return;
                            }
                            if ((var1.actorTimerW) === (5)) {
                                this.updateActor(11);
                                return;
                            }
                            if (((var1.actorTimerW) !== (6) && (var1.actorTimerW) !== (9))) {
                                if ((var1.actorTimerW) === (8)) {
                                    if (((CoreEngine.exec_g_to_int() > 128) && this.exec_s_to_bool())) {
                                        this.updateActor(21);
                                        return;
                                    }
                                    if ((this.actorTimerX >= 500)) {
                                        this.updateActor(6);
                                        return;
                                    }
                                    if ((this.actorTimerW) !== (0)) {
                                        this.updateActor(0);
                                        return;
                                    }
                                    break;
                                }
                                if (((((var1.actorTimerW) === (6) || (var1.actorTimerW) === (7)) && (CoreEngine.exec_g_to_int() >= 100)) && ((this.characterId) === (2) || (this.characterId) === (3)))) {
                                    if ((this.characterId) === (2)) {
                                        this.updateActor(26);
                                        return;
                                    }
                                    break;
                                }
                                if ((CoreEngine.exec_g_to_int() < 60)) {
                                    if (var1.actorActiveFlag) {
                                        (this.actorSubStateH = 0);
                                        (this.actorSubStateG = CoreEngine.exec_a_int_int_to_int(0, (this.characterMoveFrames.length - 1)));
                                        this.updateActor(30);
                                        return;
                                    }
                                    switch (CoreEngine.exec_a_int_int_to_int(0, 3)) {
                                        case 0:
                                            this.updateActor(10);
                                            return;
                                        case 1:
                                            this.updateActor(4);
                                            return;
                                        case 2:
                                            this.updateActor(5);
                                            return;
                                        case 3:
                                            this.updateActor(11);
                                        default:
                                            return;
                                    }
                                }
                                this.updateActor(1);
                                return;
                            }
                            if (((var1.actorPhysicsArray[4] > 0) && (CoreEngine.exec_g_to_int() < 48))) {
                                this.updateActor(10);
                                return;
                            }
                            this.updateActor(16);
                            return;
                        }
                    case 6:
                        if ((this.actorTimerX > 500)) {
                            this.updateActor(9);
                            return;
                        }
                        break;
                    case 30:
                        if (((((this.val_bool_r && (this.exec_a_to_arr_byte()) !== (null)) && (this.val_int_aa >= 150)) && (this.val_int_aa < 400)) && this.val_bool_C)) {
                            this.exec_t_to_void();
                        }
                }
            }
        }
    }
    exec_l_to_bool() {
        let var1 = false;
        if ((((!this.val_bool_G && !this.exec_i_to_bool()) && (CoreEngine.val_int_dL) === (3)) && (CoreEngine.exec_b_coreengine_to_coreengine(this).actorTimerW) === (22))) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    exec_t_to_void() {
        this.actorSubStateH++;
        if ((this.actorSubStateH < Math.trunc((this.characterMoveFrames[this.actorSubStateG].length) / (2)))) {
            (this.superMeterEnergy = 0);
            this.updateActor(30);
        }
    }
    exec_a_arr_byte_to_bool(var1) {
        for (let var2 = 0; (var2 < 2); var2++) {
            let var5 = var2;
            let var4 = var1;
            let var3 = this.scratchpadBuffer;
            let var6 = 0;
            let var7 = 0;
            let var8 = 0;
            let var9 = -100;
            let var10 = -100;
            let var12 = var5;
            let var10000 = false;
            label71: {
                while ((var12 < var3.length)) {
                    let var13 = var3[var12];
                    let var11 = var4[((var4.length - 1) - var6)];
                    if ((((var9) !== (-100) && (var13) === (var9)) && (var8 > 0))) {
                        var8++;
                    } else {
                        if (((var13) !== (var11) || ((var8) !== (0) && (var10) === (var13)))) {
                            if ((var13) === (10)) {
                                var7++;
                                (var8 = 0);
                            } else {
                                if ((var13) !== (var11)) {
                                    break;
                                }
                            }
                        } else {
                            var6++;
                            (var9 = (((var11) << 24) >> 24));
                            var8++;
                            (var7 = 0);
                            (var10 = (((var11) << 24) >> 24));
                        }
                    }
                    (var11 = var7);
                    if ((CoreEngine.val_int_dL) === (3)) {
                        (var13 = 3);
                    } else {
                        (var13 = 1);
                    }
                    if ((var11 <= (var13 * 9))) {
                        (var11 = var8);
                        if ((CoreEngine.val_int_dL) === (3)) {
                            (var13 = 3);
                        } else {
                            (var13 = 1);
                        }
                        if ((var11 <= (var13 * 6))) {
                            if ((var6) === (var4.length)) {
                                (var10000 = true);
                                break label71;
                            }
                            var12++;
                            continue;
                        }
                    }
                    (var10000 = false);
                    break label71;
                }
                (var10000 = false);
            }
            if (var10000) {
                return true;
            }
        }
        return false;
    }
    exec_u_to_void() {
        if ((!CoreEngine.val_bool_am || (this) !== (CoreEngine.val_coreengine_c))) {
            let var1 = this.getActiveComboByte();
            let var2 = -1;
            let var3 = false;
            if ((((((this.characterId) === (0) && this.exec_t_to_bool()) && !this.actorActiveFlag) && ((((this.actorTimerW) === (6) || (this.actorTimerW) === (8)) || (this.actorTimerW) === (7)) || (this.actorTimerW) === (9))) && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[1]))) {
                (var2 = 26);
                (var3 = true);
            } else {
                let var4 = false;
                if (((this.spriteTransformLookupC) === (null) || (((((this.actorTimerW) !== (6) && (this.actorTimerW) !== (7)) && (this.actorTimerW) !== (8)) && (this.actorTimerW) !== (9)) && ((this.actorTimerW) !== (36) || (this.playerSlot) !== (9))))) {
                    (var4 = false);
                } else {
                    (var4 = true);
                }
                if ((var4 && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[0]))) {
                    (var2 = 21);
                    (var3 = true);
                }
            }
            if ((var2) === (-1)) {
                switch (this.actorTimerW) {
                    case 0:
                    case 1:
                    case 2:
                    case 3:
                    case 16:
                        if ((this.exec_l_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[3]))) {
                            (var2 = 33);
                            (var3 = true);
                        } else {
                            if ((this.exec_m_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[2]))) {
                                (var2 = 28);
                                (var3 = true);
                            } else {
                                if ((this.exec_t_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[1]))) {
                                    (var2 = 26);
                                    (var3 = true);
                                } else {
                                    if (((CoreEngine.exec_a_coreengine_to_coreengine(this)) !== (null) && this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(4)))) {
                                        (this.opposingActorRef = CoreEngine.exec_a_coreengine_to_coreengine(this));
                                        if ((this.opposingActorRef) !== (null)) {
                                            (var2 = 17);
                                            (var3 = true);
                                        }
                                    } else {
                                        if ((this.exec_s_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[0]))) {
                                            (var2 = 21);
                                            (var3 = true);
                                        } else {
                                            if ((((CoreEngine.exec_g_to_int() < 64) && (this.actorTimerW) !== (3)) && (this.exec_f_to_int() >= 0))) {
                                                (this.actorSubStateG = this.exec_f_to_int());
                                                (this.actorSubStateH = 0);
                                                (var2 = 30);
                                                (var3 = true);
                                            } else {
                                                if ((this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(0)) && !this.exec_j_to_bool())) {
                                                    if (((this.playerSlot) !== (16) || (this.actorTimerX > 1200))) {
                                                        (var2 = 16);
                                                    }
                                                } else {
                                                    if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(3))) {
                                                        (var2 = 11);
                                                    } else {
                                                        if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(2))) {
                                                            (var2 = 5);
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    case 27:
                        if ((CoreEngine.exec_b_coreengine_to_coreengine(this).actorTimerT > 0)) {
                            if ((this.exec_t_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[1]))) {
                                (var2 = 26);
                                (var3 = true);
                            } else {
                                if ((this.exec_s_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[0]))) {
                                    (var2 = 21);
                                    (var3 = true);
                                }
                            }
                        }
                }
            }
            if ((var2) === (-1)) {
                label189: switch (this.actorTimerW) {
                    case 0:
                        if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(1))) {
                            (var2 = 4);
                        }
                        if ((var2) === (-1)) {
                            switch (var1) {
                                case 4:
                                    (var2 = 8);
                                    break label189;
                                case 5:
                                    (var2 = 7);
                                    break label189;
                                case 6:
                                    (var2 = 6);
                                    break label189;
                                case 7:
                                    (var2 = 1);
                                    break label189;
                                case 8:
                                    (var2 = 3);
                                    break label189;
                                case 9:
                                    (var2 = 2);
                            }
                        }
                        break;
                    case 1:
                        if (((var1) !== (7) || !this.val_bool_p)) {
                            (var2 = 0);
                        }
                        break;
                    case 2:
                        if (((var1) !== (9) || !this.val_bool_p)) {
                            (var2 = 0);
                        }
                        break;
                    case 3:
                        if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(1))) {
                            (var2 = 10);
                        }
                        if ((var2) === (-1)) {
                            switch (var1) {
                                case 4:
                                    (var2 = 8);
                                    break label189;
                                case 5:
                                    (var2 = 7);
                                    break label189;
                                case 6:
                                    (var2 = 6);
                                    break label189;
                                case 7:
                                    (var2 = 1);
                                case 8:
                                default:
                                    break label189;
                                case 9:
                                    (var2 = 2);
                            }
                        }
                        break;
                    case 4:
                        if (((this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(1)) && (this.actorTimerX > 200)) && !this.exec_r_to_bool())) {
                            (var2 = 31);
                        }
                    case 5:
                    case 9:
                    case 10:
                    case 11:
                    case 12:
                    case 13:
                    case 15:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                    case 25:
                    case 26:
                    case 27:
                    case 28:
                    case 29:
                    default:
                        break;
                    case 6:
                    case 7:
                    case 8:
                        if ((((var1) === (2) || (var1) === (0)) || (var1) === (1))) {
                            (var2 = 9);
                            (var3 = true);
                        }
                        break;
                    case 14:
                        switch (var1) {
                            case 4:
                                (var2 = 8);
                                break label189;
                            case 5:
                                (var2 = 7);
                                break label189;
                            case 6:
                                (var2 = 6);
                            default:
                                break label189;
                        }
                    case 16:
                        switch (var1) {
                            case 4:
                                (var2 = 8);
                                break;
                            case 5:
                                (var2 = 7);
                                break;
                            case 6:
                                (var2 = 6);
                            case 7:
                            default:
                                break;
                            case 8:
                                (var2 = 3);
                                break;
                            case 9:
                                (var2 = 2);
                        }
                        if (((var2) === (-1) && (this.getActiveComboByte()) !== (7))) {
                            (var2 = 0);
                        }
                        break;
                    case 30:
                        let var6 = null;
                        if (((((this.val_bool_r && ((var6 = this.exec_a_to_arr_byte())) !== (null)) && (this.val_int_aa >= 150)) && (this.val_int_aa < 400)) && this.exec_a_arr_byte_to_bool(var6))) {
                            this.exec_t_to_void();
                        }
                        break;
                    case 31:
                        if ((this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(1)) && !this.val_bool_F)) {
                            let var5 = false;
                            if (!this.val_bool_E) {
                                (var5 = true);
                            } else {
                                (var5 = false);
                            }
                            (this.val_bool_E = var5);
                            (this.val_bool_F = true);
                        }
                }
            }
            if (var3) {
                CoreEngine.exec_a_arr_byte_to_void(this.scratchpadBuffer);
            }
            if ((var2) !== (-1)) {
                this.updateActor(var2);
            }
        }
    }
    exec_f_to_int() {
        if (((this.characterMoveFrames) !== (null) && CoreEngine.exec_b_coreengine_to_coreengine(this).actorActiveFlag)) {
            for (let var1 = 0; (var1 < this.characterMoveFrames.length); var1++) {
                if (this.exec_a_arr_byte_to_bool(this.characterMoveFrames[var1][0])) {
                    return var1;
                }
            }
            return -1;
        } else {
            return -1;
        }
    }
    exec_m_to_bool() {
        if ((((!this.exec_i_to_bool() && (CoreEngine.val_int_dL) === (3)) && (CoreEngine.exec_b_coreengine_to_coreengine(this).actorTimerW) === (22)) && this.exec_s_to_bool())) {
            switch (this.characterId) {
                case 2:
                    let var1 = false;
                    if ((CoreEngine.exec_g_to_int() < 128)) {
                        (var1 = true);
                    } else {
                        (var1 = false);
                    }
                    return var1;
                default:
                    return true;
            }
        } else {
            return false;
        }
    }
    exec_a_to_animationset() {
        return (this.val_bool_z ? this.val_animationset_f : this.currentAnimSet);
    }
    exec_c_graphicsadapter_to_void(var1) {
        let var2 = ((this.actorPhysicsArray[0] >> 8) - CoreEngine.val_int_eO);
        let var3 = ((this.actorPhysicsArray[1] >> 8) - CoreEngine.exec_k_to_int());
        let var4 = this.exec_a_to_spritepartsequence();
        let var5 = null;
        if ((((var5 = this.exec_a_to_animationset())) !== (null) && (var4) !== (null))) {
            let var7 = 0;
            if ((this.actorCurrentAnimIndex) === (1)) {
                (var7 = 0);
            } else {
                (var7 = 4);
            }
            let var6 = var7;
            if (((this.actorTimerW) === (18) || this.val_bool_D)) {
                (var6 = this.val_int_X);
                if ((this.actorCurrentAnimIndex) === (-1)) {
                    switch (var6) {
                        case 0:
                            (var6 = 4);
                            break;
                        case 1:
                            (var6 = 7);
                            break;
                        case 2:
                            (var6 = 6);
                            break;
                        case 3:
                            (var6 = 5);
                    }
                }
            }
            if (((this.actorTimerW) === (100) || (this.actorTimerW) === (101))) {
                var1.setColor(9985856);
                let var7_x = ((this.linkedStateMachine.actorBoundsArray[0] >> 8) - CoreEngine.val_int_eO);
                let var8 = ((this.linkedStateMachine.actorBoundsArray[1] >> 8) - CoreEngine.exec_k_to_int());
                var1.drawLine((var2 + (this.spriteTransformLookupB[1] * this.actorCurrentAnimIndex)), (var8 - 1), var7_x, (var8 - 1));
                var1.drawLine((var2 + (this.spriteTransformLookupB[1] * this.actorCurrentAnimIndex)), var8, var7_x, var8);
            }
            if (this.val_bool_B) {
                let var10 = 0;
                if (CoreEngine.val_bool_d) {
                    (var10 = 1);
                } else {
                    (var10 = -1);
                }
                (var2 += (var10 << 1));
            }
            (this.val_bool_B = false);
            var4.drawSequence(this.actorTimerR, var5, var2, var3, var6);
        }
    }
    isActive() {
        let var1 = false;
        if (((!this.val_bool_A && (this.actorTimerW) !== (23)) && ((this.actorTimerW) !== (26) || (this.characterId) !== (5)))) {
            (var1 = false);
        } else {
            (var1 = true);
        }
        return var1;
    }
    getBounds() {
        return this.actorPhysicsArray;
    }
    checkIntersect(var1) {
        let var2 = false;
        let var3 = false;
        let var4 = false;
        let var5 = false;
        let var6 = false;
        let var7 = false;
        let var8 = false;
        let var9 = false;
        let var10 = 0;
        let var11 = CoreEngine.val_arr_short_D;
        if ((this.actorTimerW) === (26)) {
            switch (this.characterId) {
                case 0:
                    (var11 = CoreEngine.val_arr_short_v);
                    (var10 = 13);
                    (var3 = true);
                    break;
                case 1:
                    (var11 = CoreEngine.val_arr_short_u);
                    (var10 = 12);
                    (var2 = true);
                    break;
                case 2:
                    (var8 = true);
                    break;
                case 3:
                    (var11 = CoreEngine.val_arr_short_B);
                    (var10 = 15);
                    (var6 = true);
                    (var2 = true);
                    (var5 = true);
                    break;
                case 4:
                    (var11 = CoreEngine.val_arr_short_B);
                    (var10 = 17);
                    (var6 = true);
                    (var2 = true);
                    (var5 = true);
                case 5:
                default:
                    break;
                case 6:
                    (var11 = CoreEngine.val_arr_short_C);
                    (var10 = 14);
                    (var6 = true);
                    (var2 = true);
                    (var5 = true);
                    (var4 = true);
            }
        } else {
            switch (this.actorTimerW) {
                case 4:
                case 31:
                    (var6 = true);
                    (var10 = 5);
                    if ((this.characterId) === (6)) {
                        (var11 = CoreEngine.val_arr_short_C);
                        (var10 = 14);
                        (var2 = true);
                        (var5 = true);
                        (var4 = true);
                    }
                    break;
                case 5:
                    (var10 = 15);
                    if ((this.characterId) === (6)) {
                        (var11 = CoreEngine.val_arr_short_C);
                        (var2 = true);
                        (var10 = 14);
                        (var5 = true);
                        (var4 = true);
                        (var6 = true);
                    }
                    break;
                case 9:
                    (var11 = CoreEngine.val_arr_short_z);
                    (var2 = true);
                    (var10 = 14);
                    (var5 = true);
                    (var6 = true);
                    break;
                case 10:
                    (var11 = CoreEngine.val_arr_short_w);
                    (var2 = true);
                    (var10 = 20);
                    (var5 = true);
                    (var7 = true);
                    break;
                case 11:
                    (var11 = CoreEngine.val_arr_short_y);
                    (var2 = true);
                    (var10 = 10);
                    (var9 = true);
                    break;
                case 30:
                    let var12 = null;
                    if (((var12 = this.characterMoveFrames[this.actorSubStateG][((this.actorSubStateH << 1) + 1)])[3]) === (1)) {
                        (var11 = CoreEngine.val_arr_short_A);
                    } else {
                        if ((var12[3]) === (2)) {
                            (var11 = CoreEngine.val_arr_short_B);
                        }
                    }
                    (var5 = true);
                    let var13 = false;
                    if ((var12[3] > 0)) {
                        (var13 = true);
                    } else {
                        (var13 = false);
                    }
                    (var2 = var13);
                    (var10 = var12[2]);
                    if ((var12[4]) === (1)) {
                        (var6 = true);
                    } else {
                        (var6 = false);
                    }
                    if ((var12[4]) === (2)) {
                        (var7 = true);
                    } else {
                        (var7 = false);
                    }
            }
        }
        if ((this.characterId) === (6)) {
            (var10 <<= 1);
        }
        (var1[0] = (var11[0] << 8));
        (var1[1] = (var11[1] << 8));
        (var1[3] = var11[2]);
        (var1[5] = var10);
        let var22 = 0;
        if (var2) {
            (var22 = 256);
        } else {
            (var22 = 0);
        }
        (var1[4] = var22);
        let var23 = var1[4];
        if (var3) {
            (var10 = 128);
        } else {
            (var10 = 0);
        }
        (var1[4] = (var23 | var10));
        let var24 = var1[4];
        let var15 = 0;
        if (var4) {
            (var15 = 2);
        } else {
            (var15 = 0);
        }
        (var1[4] = (var24 | var15));
        let var25 = var1[4];
        if (var5) {
            (var15 = 8192);
        } else {
            (var15 = 0);
        }
        (var1[4] = (var25 | var15));
        let var26 = var1[4];
        if (var6) {
            (var15 = 2048);
        } else {
            (var15 = 0);
        }
        (var1[4] = (var26 | var15));
        let var27 = var1[4];
        if (var7) {
            (var15 = 4096);
        } else {
            (var15 = 0);
        }
        (var1[4] = (var27 | var15));
        let var28 = var1[4];
        let var19 = 0;
        if (var8) {
            (var19 = 1);
        } else {
            (var19 = 0);
        }
        (var1[4] = (var28 | var19));
        let var29 = var1[4];
        if (var9) {
            (var19 = (((4) << 24) >> 24));
        } else {
            (var19 = (((0) << 24) >> 24));
        }
        (var1[4] = (var29 | var19));
        let var30 = var1[4];
        if (var9) {
            (var19 = 16384);
        } else {
            (var19 = 0);
        }
        (var1[4] = (var30 | var19));
        (var1[2] = this.actorTimerW);
        return true;
    }
    checkHitBox(var1, var2, var3) {
        let var4 = 0;
        let var5 = 0;
        let var6 = null;
        (var4 = this.exec_a_to_int());
        (var5 = this.exec_b_to_int());
        (var6 = null);
        label102: switch (var1) {
            case 0:
                switch (this.actorTimerW) {
                    case 3:
                    case 11:
                    case 13:
                    case 14:
                        (var6 = CoreEngine.val_arr_short_i);
                        break label102;
                    case 4:
                    case 5:
                    case 10:
                    case 12:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 22:
                    case 23:
                    case 24:
                    case 25:
                    case 27:
                    case 29:
                    case 30:
                    case 31:
                    case 32:
                    case 33:
                    case 34:
                    default:
                        (var6 = CoreEngine.val_arr_short_n);
                        break label102;
                    case 6:
                    case 7:
                    case 8:
                    case 9:
                    case 35:
                    case 36:
                        (var6 = CoreEngine.val_arr_short_m);
                        break label102;
                    case 21:
                        if (this.actorActiveFlag) {
                            (var6 = CoreEngine.val_arr_short_n);
                        } else {
                            (var6 = CoreEngine.val_arr_short_m);
                        }
                        (var6 = var6);
                        break label102;
                    case 26:
                        if ((this.characterId) === (1)) {
                            (var6 = CoreEngine.val_arr_short_j);
                        } else {
                            if ((this.characterId) === (3)) {
                                (var6 = CoreEngine.val_arr_short_k);
                            } else {
                                if ((this.characterId) === (5)) {
                                    return false;
                                }
                                if ((this.characterId) === (6)) {
                                    (var6 = CoreEngine.val_arr_short_i);
                                } else {
                                    (var6 = CoreEngine.val_arr_short_l);
                                }
                            }
                        }
                        break label102;
                    case 28:
                        return false;
                }
            case 1:
                if (this.val_bool_r) {
                    return false;
                }
                switch (this.actorTimerW) {
                    case 4:
                    case 31:
                        if (this.exec_a_int_to_bool(200)) {
                            (var6 = CoreEngine.val_arr_arr_short_e[this.characterId]);
                        }
                        break;
                    case 5:
                        if (this.exec_a_int_to_bool(290)) {
                            (var6 = CoreEngine.val_arr_arr_short_f[this.characterId]);
                        }
                    case 6:
                    case 7:
                    case 8:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                    case 25:
                    case 27:
                    case 28:
                    case 29:
                    default:
                        break;
                    case 9:
                        if ((this.actorTimerX > 80)) {
                            (var6 = CoreEngine.val_arr_arr_short_c[this.characterId]);
                        }
                        break;
                    case 10:
                        if (this.exec_a_int_to_bool(200)) {
                            (var6 = CoreEngine.val_arr_short_o);
                        }
                        break;
                    case 11:
                        if (this.exec_a_int_to_bool(300)) {
                            (var6 = CoreEngine.val_arr_arr_short_d[this.characterId]);
                        }
                        break;
                    case 26:
                        if (((this.characterId) === (1) && (this.actorTimerX > 100))) {
                            (var6 = CoreEngine.val_arr_short_p);
                        } else {
                            if ((this.characterId) === (0)) {
                                (var6 = CoreEngine.val_arr_short_q);
                            } else {
                                if ((this.characterId) === (3)) {
                                    if ((this.actorTimerV) === (26)) {
                                        (var6 = CoreEngine.val_arr_short_r);
                                    }
                                } else {
                                    if (((this.characterId) === (4) && (this.actorTimerX > 0))) {
                                        (var6 = CoreEngine.val_arr_short_E);
                                    } else {
                                        if (((this.characterId) === (6) && (this.actorTimerX > 250))) {
                                            (var6 = CoreEngine.val_arr_short_F);
                                        } else {
                                            if (((this.characterId) === (2) && (this.actorTimerX > 250))) {
                                                (var6 = CoreEngine.val_arr_short_s);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    case 30:
                        let var7 = this.characterMoveFrames[this.actorSubStateG][((this.actorSubStateH << 1) + 1)];
                        if (((this.actorTimerX >= (20 * var7[1])) && (this.actorTimerX < ((20 * var7[1]) + 200)))) {
                            (var6 = CoreEngine.val_arr_short_t);
                        }
                }
        }
        if ((var6) !== (null)) {
            (var2[var3] = (var5 + var6[0]));
            (var2[(var3 + 3)] = (var5 + var6[3]));
            if ((this.actorCurrentAnimIndex) === (1)) {
                (var2[(var3 + 1)] = (var4 + var6[1]));
                (var2[(var3 + 2)] = (var4 + var6[2]));
            } else {
                (var2[(var3 + 1)] = (var4 - var6[2]));
                (var2[(var3 + 2)] = (var4 - var6[1]));
            }
            return true;
        } else {
            return false;
        }
    }
    exec_a_int_to_bool(var1) {
        let var2 = false;
        if (((this.actorTimerX >= var1) && (this.actorTimerX < (var1 + 140)))) {
            (var2 = true);
        } else {
            (var2 = false);
        }
        return var2;
    }
    getStateValue(var1) {
        return (((this.actorTimerW) !== (18) && (this.actorTimerW) !== (19)) ? 1 : 0);
    }
    testCollision(var1) {
        let var2 = false;
        let var3 = 0;
        let var4 = 0;
        let var5 = 0;
        let var6 = 0;
        if ((this.actorTimerW) === (26)) {
            switch (this.characterId) {
                case 0:
                    if (!this.val_bool_s) {
                        if (this.val_bool_w) {
                            (var5 = -(4096 * this.actorCurrentAnimIndex));
                            (var6 = 20480);
                            (var4 = 800);
                            (this.actorActiveFlag = false);
                            (var2 = true);
                            (this.val_bool_s = true);
                            (this.actorTimerX = 0);
                        } else {
                            (var5 = (32768 * this.actorCurrentAnimIndex));
                            (var6 = 8192);
                            (var4 = 500);
                            (this.actorActiveFlag = false);
                            (var2 = true);
                            (this.val_bool_s = true);
                        }
                    }
            }
        } else {
            if ((((((this.actorTimerW) === (17) && (this.characterId) === (5)) && this.actorActiveFlag) && (this.actorTimerX < 750)) && (this.actorTimerX > 100))) {
                (var5 = -(4096 * this.actorCurrentAnimIndex));
                (var6 = 32768);
                (var4 = 750);
                (this.actorActiveFlag = false);
                (var2 = true);
                (this.val_bool_s = true);
            }
        }
        if (this.val_bool_t) {
            (var3 = 120);
            (var4 = 100);
            (var5 = 0);
            (var6 = -768);
            (this.val_bool_t = false);
            (var2 = true);
        } else {
            if ((!this.actorActiveFlag || (((this.actorTimerW) !== (8) && (this.actorTimerW) !== (7)) && (this.actorTimerW) !== (6)))) {
                if (((((this.actorTimerW) === (12) || (this.actorTimerW) === (19)) || (this.actorTimerW) === (22)) && !this.val_bool_s)) {
                    if (((this.actorTimerW) === (12) && (this.actorCounterB >= 2))) {
                        (var4 = ((this.val_int_S * 204) >> 8));
                        (var5 = ((this.val_int_Q * 204) >> 8));
                        (var6 = ((this.val_int_R * 204) >> 8));
                    } else {
                        (var4 = this.val_int_S);
                        (var5 = this.val_int_Q);
                        (var6 = this.val_int_R);
                    }
                    (this.actorActiveFlag = false);
                    (this.val_bool_s = true);
                    (var2 = true);
                }
            } else {
                if ((this.actorTimerW) === (7)) {
                    (var6 = 0);
                } else {
                    (var6 = this.actorCurrentAnimIndex);
                }
                (var5 = var6);
                if ((this.actorTimerW) === (8)) {
                    (var5 = -var6);
                }
                (var5 *= 28672);
                (var6 = 28672);
                (var4 = 800);
                (this.actorActiveFlag = false);
                (var2 = true);
            }
        }
        if (var2) {
            (var1[0] = 5);
            (var1[1] = var3);
            (var1[2] = var4);
            (var1[3] = var5);
            (var1[4] = var6);
            return true;
        } else {
            return false;
        }
    }
    interactWithEntity(var1, var2) {
        (CoreEngine.val_coreengine_e = this);
        if ((var1 instanceof CoreEngine)) {
            let var36 = null;
            (var36 = (var1)).checkIntersect(var2);
            let var19 = var2[5];
            CoreEngine.exec_e_coreengine_to_void(this);
            let var16 = 15;
            let var4 = var2[4];
            let var5 = ((var4 & 256)) !== (0);
            let var6 = ((var4 & 4)) !== (0);
            let var7 = ((var4 & 128)) !== (0);
            let var8 = ((var4 & 2)) !== (0);
            let var21 = ((var4 & 1)) !== (0);
            let var24 = ((var4 & 16384)) !== (0);
            let var27 = var36.actorCurrentAnimIndex;
            (this.val_int_Q = (var2[0] * var27));
            (this.val_int_R = var2[1]);
            (this.val_int_S = var2[3]);
            if ((!this.actorActiveFlag || var5)) {
                (var16 = 12);
                this.actorCounterB++;
            }
            if (((var16) !== (12) && var7)) {
                (var16 = 27);
            }
            if (var21) {
                (var16 = 34);
            }
            (var21 = false);
            if ((!this.exec_a_bool_to_bool(var6) && !this.exec_b_bool_to_bool(var6))) {
                this.updateActor(var16);
            } else {
                if (var8) {
                    this.updateActor(27);
                } else {
                    if ((!var6 && !this.exec_n_to_bool())) {
                        this.updateActor(24);
                    } else {
                        this.updateActor(25);
                    }
                }
                (var21 = true);
            }
            if ((var19 > 0)) {
                if (var21) {
                    if (this.exec_b_bool_to_bool(var6)) {
                        (var19 <<= 1);
                    }
                    this.exec_s_int_to_void(Math.trunc((var19) / (3)));
                } else {
                    this.exec_s_int_to_void(var19);
                }
                (var36.val_bool_x = true);
            }
            if (var24) {
                if (var21) {
                    this.actorCounterD++;
                } else {
                    this.actorCounterC++;
                }
            }
            if (var21) {
                (var36.val_bool_w = true);
                if ((CoreEngine.exec_b_coreengine_to_coreengine(this).actorTimerW) === (26)) {
                    CoreEngine.exec_b_coreengine_to_coreengine(this).exec_b_int_to_bool(12);
                } else {
                    this.exec_b_int_to_bool(1);
                }
            } else {
                switch (var36.actorTimerW) {
                    case 4:
                    case 31:
                        this.exec_b_int_to_bool(2);
                        break;
                    case 5:
                    case 11:
                        this.exec_b_int_to_bool(5);
                    case 6:
                    case 7:
                    case 8:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                    case 25:
                    case 27:
                    case 28:
                    case 29:
                    default:
                        break;
                    case 9:
                        this.exec_b_int_to_bool(5);
                        break;
                    case 10:
                        CoreEngine.exec_M_int_to_void(100);
                        this.exec_b_int_to_bool(6);
                        break;
                    case 26:
                        if ((CoreEngine.exec_b_coreengine_to_coreengine(this).characterId) === (6)) {
                            this.exec_b_int_to_bool(6);
                        } else {
                            if ((CoreEngine.exec_b_coreengine_to_coreengine(this).characterId) === (1)) {
                                this.exec_b_int_to_bool(5);
                            } else {
                                CoreEngine.exec_b_coreengine_to_coreengine(this).exec_b_int_to_bool(11);
                            }
                        }
                        break;
                    case 30:
                        if ((!var5 && (var36.actorTimerV) !== (25))) {
                            this.exec_b_int_to_bool(5);
                        } else {
                            this.exec_b_int_to_bool(6);
                        }
                }
                switch (var36.actorTimerW) {
                    case 4:
                    case 31:
                        (var36.actorCounterE += 500);
                        break;
                    case 5:
                        (var36.actorCounterE += 2000);
                    case 6:
                    case 7:
                    case 8:
                    case 12:
                    case 13:
                    case 14:
                    case 15:
                    case 16:
                    case 17:
                    case 18:
                    case 19:
                    case 20:
                    case 21:
                    case 22:
                    case 23:
                    case 24:
                    case 25:
                    case 27:
                    case 28:
                    case 29:
                    default:
                        break;
                    case 9:
                        (var36.actorCounterE += 2000);
                        break;
                    case 10:
                        (var36.actorCounterE += 2000);
                        break;
                    case 11:
                        (var36.actorCounterE += 1000);
                        break;
                    case 26:
                        (var36.actorCounterE += 2000);
                        break;
                    case 30:
                        (var36.actorCounterE += 500);
                }
                if (((var4 & 8192)) !== (0)) {
                    (CoreEngine.val_int_eW = 300);
                }
                (this.actorCurrentAnimIndex = -var27);
                let var37 = -1;
                if (((var4 & 4096)) !== (0)) {
                    (var37 = 0);
                } else {
                    if (((var4 & 2048)) !== (0)) {
                        if ((this.actorCurrentAnimIndex) === (1)) {
                            (var37 = 2);
                        } else {
                            (var37 = 1);
                        }
                    }
                }
                if ((var37 >= 0)) {
                    (var27 = this.exec_a_to_int());
                    let var24_val = ((this.characterId) === (5) ? 1 : 0);
                    CoreEngine.exec_a_int_int_int_int_to_void(var37, var27, -87, var24_val);
                }
            }
            return 0;
        } else {
            if (!(var1 instanceof ActorStateMachine)) {
                return 0;
            }
            let var12 = (var1);
            let var11 = this.exec_a_bool_to_bool(false);
            let var10 = CoreEngine.val_arr_int_bj[var12.actorActionFrame];
            let var9 = this.actorCurrentAnimIndex;
            let var20 = 0;
            switch (var12.actorActionFrame) {
                case 0:
                    if (!var11) {
                        if ((var9) === (-1)) {
                            (var20 = 2);
                        } else {
                            (var20 = 1);
                        }
                        break;
                    }
                default:
                    (var20 = -1);
            }
            if ((var10 > 0)) {
                CoreEngine.exec_e_coreengine_to_void(this);
                CoreEngine.exec_M_int_to_void(100);
            }
            if ((!var11 && !this.exec_b_bool_to_bool(false))) {
                (var12.val_coreengine_b.actorCounterE += 2000);
                this.exec_s_int_to_void(var10);
                if (((var12.val_coreengine_b) !== (null) && (var12.val_coreengine_b.characterId) === (5))) {
                    this.exec_b_int_to_bool(14);
                } else {
                    var12.val_coreengine_b.exec_b_int_to_bool(8);
                }
                let var14 = this;
                let var18 = var12;
                if (!var12.isActorActive) {
                    (var18.val_coreengine_a = var14);
                    (var14 = var18.val_coreengine_b);
                    let var17 = 0;
                    if (((var17 = var18.val_coreengine_b.spriteTransformLookupB[0])) === (0)) {
                        if ((var14.actorTimerW) === (21)) {
                            var14.updateActor(101);
                            var14.linkedStateMachine.val_coreengine_a.updateActor(102);
                        }
                    } else {
                        if ((var17) === (1)) {
                            if ((var14.linkedStateMachine.val_coreengine_a.actorTimerW) === (23)) {
                                var14.updateActor(23);
                                (var14.linkedStateMachine.val_coreengine_a.actorTimerX = 3500);
                            } else {
                                if (((var14.actorTimerW) !== (23) && (var14.actorTimerW) === (21))) {
                                    var14.updateActor(0);
                                }
                                var14.linkedStateMachine.val_coreengine_a.updateActor(23);
                            }
                        } else {
                            if ((var17) === (2)) {
                                var14.linkedStateMachine.val_coreengine_a.updateActor(27);
                            }
                        }
                    }
                    (var18.isActorActive = true);
                    var18.setActionFrame(1);
                    if ((var18.actorActionFrame) === (3)) {
                        var18.setPosition(var18.val_coreengine_a.exec_a_to_int(), (var18.val_coreengine_a.exec_b_to_int() + -12));
                        (var18.actorFacingDirection = -var18.val_coreengine_a.actorCurrentAnimIndex);
                    } else {
                        if (((var18.actorActionFrame) !== (5) && (var18.actorActionFrame) !== (4))) {
                            if ((var18.actorActionFrame) === (6)) {
                                var18.val_coreengine_a.updateActor(12);
                                var18.val_coreengine_a.exec_a_arr_short_to_void(CoreEngine.val_arr_short_C);
                            }
                        } else {
                            if (var18.val_coreengine_a.actorActiveFlag) {
                                var18.val_coreengine_a.updateActor(27);
                            } else {
                                var18.val_coreengine_a.updateActor(12);
                                var18.val_coreengine_a.exec_a_arr_short_to_void(CoreEngine.val_arr_short_B);
                            }
                        }
                    }
                }
            } else {
                if (((this.actorTimerW) !== (3) && (this.actorTimerW) !== (3))) {
                    this.updateActor(24);
                } else {
                    this.updateActor(25);
                }
                this.exec_s_int_to_void(Math.trunc((var10) / (3)));
                let var13 = this;
                let var3 = var12;
                label253: if (!var12.isActorActive) {
                    (var3.isActorActive = true);
                    if ((var3.actorActionFrame) === (3)) {
                        (var3.val_coreengine_a = var13);
                        var3.setPosition(var3.val_coreengine_a.exec_a_to_int(), (var3.val_coreengine_a.exec_b_to_int() + -12));
                        (var3.actorFacingDirection = -var3.val_coreengine_a.actorCurrentAnimIndex);
                    } else {
                        if ((var3.actorActionFrame) === (1)) {
                            (var3.val_coreengine_a = var13);
                            var3.setPosition(var3.val_coreengine_a.exec_a_to_int(), var3.getPosY());
                        } else {
                            if ((var3.actorActionFrame) === (6)) {
                                (var3.val_coreengine_a = var13);
                                var13.updateActor(27);
                            } else {
                                if (((var3.actorActionFrame) === (5) || (var3.actorActionFrame) === (4))) {
                                    (var3.val_coreengine_a = var13);
                                    var3.setActionFrame(1);
                                    break label253;
                                }
                            }
                        }
                    }
                    var3.setActionFrame(2);
                }
                if ((var12.val_coreengine_b) === (null)) {
                    this.exec_b_int_to_bool(1);
                } else {
                    var12.val_coreengine_b.exec_b_int_to_bool(9);
                }
            }
            if ((var20 >= 0)) {
                let var35 = this.exec_a_to_int();
                let var11_y = (this.exec_b_to_int() + -87);
                let var23_val = ((this.characterId) === (5) ? 1 : 0);
                CoreEngine.exec_a_int_int_int_int_to_void(var20, var35, var11_y, var23_val);
            }
            return 0;
        }
    }
    exec_b_int_to_bool(var1) {
        let var2 = 0;
        if (((var2 = CoreEngine.val_arr_arr_byte_x[this.characterId][var1])) === (-1)) {
            return false;
        }
        CoreEngine.exec_a_byte_bool_to_void((((var2) << 24) >> 24), false);
        return true;
    }
    exec_a_bool_to_bool(var1) {
        if ((this.val_bool_p && this.exec_o_to_bool())) {
            let var2 = false;
            if ((this.layerDepth) === (0)) {
                if ((this.getActiveComboByte()) === (9)) {
                    (var2 = true);
                } else {
                    (var2 = false);
                }
            } else {
                (var2 = this.val_bool_C);
            }
            if (((var2 && !var1) || this.exec_n_to_bool())) {
                return true;
            }
        }
        return false;
    }
    exec_n_to_bool() {
        if ((this.layerDepth) === (0)) {
            let var1 = false;
            if ((this.getActiveComboByte()) === (8)) {
                (var1 = true);
            } else {
                (var1 = false);
            }
            return var1;
        } else {
            return this.val_bool_C;
        }
    }
    exec_o_to_bool() {
        let var1 = false;
        if ((!this.actorActiveFlag || (((((((((this.actorTimerW) !== (2) && (this.actorTimerW) !== (0)) && (this.actorTimerW) !== (1)) && (this.actorTimerW) !== (3)) && (this.actorTimerW) !== (16)) && (this.actorTimerW) !== (14)) && (this.actorTimerW) !== (27)) && (this.actorTimerW) !== (25)) && (this.actorTimerW) !== (24)))) {
            (var1 = false);
        } else {
            (var1 = true);
        }
        return var1;
    }
    exec_b_bool_to_bool(var1) {
        if ((this.exec_o_to_bool() && !this.exec_a_bool_to_bool(var1))) {
            if ((((this.playerSideIndex) !== (1) || (this.layerDepth) !== (0)) || (CoreEngine.val_bool_am && (this) === (CoreEngine.val_coreengine_c)))) {
                (var1 = false);
            } else {
                (var1 = true);
            }
            if (var1) {
                return true;
            }
        }
        return false;
    }
    exec_s_int_to_void(var1) {
        if (((CoreEngine.exec_b_coreengine_to_coreengine(this)) === (null) || (CoreEngine.exec_b_coreengine_to_coreengine(this).currentHealth > 0))) {
            if ((this.characterId) === (6)) {
                (var1 = Math.trunc(var1 / (2)));
            }
            (this.currentHealth -= var1);
            (this.actorTimerU += var1);
            if ((this.currentHealth < 0)) {
                (this.currentHealth = 0);
            }
        }
    }
    applyAction(var1) {
        switch (var1) {
            case 2:
                (this.val_bool_u = true);
                return;
            case 4:
                (this.val_bool_v = true);
            default:
                return;
            case 8:
                (this.actorActiveFlag = true);
        }
    }
    updateTick() {
        (this.val_bool_r = true);
        (this.val_int_ad = this.actorTimerX);
        if (((this.characterId) !== (0) || (this.actorTimerW) !== (26))) {
            if (!this.actorActiveFlag) {
                (this.val_bool_t = true);
            }
        }
    }
    exec_a_to_int() {
        return (this.actorPhysicsArray[0] >> 8);
    }
    exec_b_to_int() {
        return (this.actorPhysicsArray[1] >> 8);
    }
    exec_b_int_to_arr_byte(var1) {
        return CoreEngine.val_arr_arr_arr_byte_c[this.playerSideIndex][var1];
    }
    exec_p_to_bool() {
        let var1 = false;
        if ((((this.exec_a_to_int() >= (CoreEngine.val_int_as + 48)) || (this.actorCurrentAnimIndex) !== (1)) && ((this.exec_a_to_int() <= (CoreEngine.val_int_at - 48)) || (this.actorCurrentAnimIndex) !== (-1)))) {
            (var1 = false);
        } else {
            (var1 = true);
        }
        return var1;
    }
    exec_q_to_bool() {
        let var1 = false;
        if (((((this.actorTimerW) !== (26) || (this.characterId) !== (0)) || this.val_bool_r) && ((this.actorTimerW) !== (26) || (this.characterId) !== (5)))) {
            (var1 = false);
        } else {
            (var1 = true);
        }
        return var1;
    }
    exec_r_to_bool() {
        let var1 = false;
        if ((this.characterId) === (6)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    isAlive() {
        let var1 = false;
        if (((this.actorActiveFlag && (this.actorTimerW) !== (12)) && (this.actorTimerW) !== (9))) {
            (var1 = false);
        } else {
            (var1 = true);
        }
        return var1;
    }
    exec_a_arr_short_to_void(var1) {
        (this.val_int_Q = ((-this.actorCurrentAnimIndex * var1[0]) << 8));
        (this.val_int_R = (var1[1] << 8));
        (this.val_int_S = var1[2]);
        (this.val_bool_s = false);
    }
    exec_s_to_bool() {
        let var1 = false;
        if (((CoreEngine.exec_b_coreengine_to_coreengine(this).actorTimerW) === (19) || ((this.linkedStateMachine) !== (null) && this.linkedStateMachine.isGrounded()))) {
            (var1 = false);
        } else {
            (var1 = true);
        }
        if ((this.characterId) !== (0)) {
            return var1;
        }
        if ((!var1 || ((CoreEngine.val_int_dL) === (2) && (CoreEngine.exec_b_coreengine_to_coreengine(this).actorTimerW) === (22)))) {
            (var1 = false);
        } else {
            (var1 = true);
        }
        return var1;
    }
    exec_t_to_bool() {
        if ((this.characterId) === (0)) {
            let var2 = false;
            if ((this.actorCounterA > 2000)) {
                (var2 = true);
            } else {
                (var2 = false);
            }
            return var2;
        } else {
            if ((this.characterId) === (2)) {
                let var1 = false;
                if ((CoreEngine.exec_b_coreengine_to_coreengine(this).actorCounterB <= 0)) {
                    (var1 = true);
                } else {
                    (var1 = false);
                }
                return var1;
            } else {
                return true;
            }
        }
    }
    exec_u_to_bool() {
        let var1 = false;
        if ((this.actorLifecycleState) === (2)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        return var1;
    }
    static exec_a_coreengine_to_void(var0) {
        (var0.actorTimerX = (var0.actorTimerX + CoreEngine.val_int_e));
        let var7 = var0;
        (var0.energyDrainFlag = (var0.energyDrainFlag + CoreEngine.val_int_e));
        if ((var7.energyDrainFlag > 3000)) {
            var7.adjustEnergyMeter(Math.trunc(((CoreEngine.val_int_e * 19200)) / (1000)));
        }
        (var7 = var0);
        (var0.val_int_Y = (var0.val_int_Y + CoreEngine.val_int_e));
        if (((!var7.actorActiveFlag || (var7.actorTimerW) === (13)) || (var7.actorTimerW) === (14))) {
            (var7.val_int_Y = 0);
        }
        (var0.actorTimerZ = (var0.actorTimerZ + CoreEngine.val_int_e));
        (var0.actorCounterA = (var0.actorCounterA + CoreEngine.val_int_e));
        if (var0.exec_a_bool_to_bool(false)) {
            CoreEngine.exec_b_coreengine_to_void(var0);
        }
        (var0.actorTimerY = (var0.actorTimerY + CoreEngine.val_int_e));
        (var7 = var0);
        let var9 = var0.getActiveComboByte();
        let var51 = var7.scratchpadBuffer;
        for (let var8 = (var51.length - 2); (var8 >= 0); var8--) {
            (var51[(var8 + 1)] = var51[var8]);
        }
        (var51[0] = (((var9) << 24) >> 24));
        if (var0.exec_k_to_bool()) {
            switch (var0.exec_e_to_int()) {
                case 0:
                    var0.exec_u_to_void();
                case 1:
                default:
                    break;
                case 2:
                    var0.exec_s_to_void();
            }
        }
        label1033: switch (var0.actorTimerW) {
            case 0:
                if (var0.exec_i_to_bool()) {
                    if ((CoreEngine.val_int_dL) === (3)) {
                        var0.updateActor(22);
                    } else {
                        var0.updateActor(12);
                        (var0.val_bool_s = true);
                    }
                }
                break;
            case 1:
            case 2:
                if (!var0.exec_k_to_bool()) {
                    var0.updateActor(0);
                }
                break;
            case 3:
                if (var0.exec_i_to_bool()) {
                    var0.updateActor(12);
                    (var0.val_bool_s = true);
                }
                break;
            case 4:
                if ((var0.exec_s_to_bool() && var0.exec_a_arr_byte_to_bool(var0.val_arr_arr_byte_a[0]))) {
                    var0.updateActor(21);
                } else {
                    if ((var0.exec_t_to_bool() && var0.exec_a_arr_byte_to_bool(var0.val_arr_arr_byte_a[1]))) {
                        var0.updateActor(26);
                    } else {
                        if (var0.val_bool_F) {
                            if ((var0.actorTimerX > 200)) {
                                var0.updateActor(31);
                            }
                        } else {
                            if (var0.exec_h_to_bool()) {
                                var0.updateActor(0);
                            }
                        }
                    }
                }
                break;
            case 5:
                if (var0.exec_h_to_bool()) {
                    var0.updateActor(0);
                }
                break;
            case 6:
            case 7:
            case 8:
                if ((var0.actorActiveFlag && (var0.actorTimerX > 500))) {
                    var0.updateActor(0);
                }
                break;
            case 9:
                if (var0.val_bool_r) {
                    var0.updateActor(36);
                    var0.setActorHealthDelta(20);
                }
                if (var0.actorActiveFlag) {
                    var0.updateActor(0);
                }
                break;
            case 10:
                if (var0.exec_h_to_bool()) {
                    var0.updateActor(0);
                }
                break;
            case 11:
                if (var0.exec_h_to_bool()) {
                    var0.updateActor(0);
                }
                break;
            case 12:
                if (((var0.actorTimerX > 200) && var0.actorActiveFlag)) {
                    var0.updateActor(13);
                }
                break;
            case 13:
                if (((var0.actorTimerX > 150) && (!var0.exec_i_to_bool() || (CoreEngine.val_int_dL) === (3)))) {
                    var0.updateActor(14);
                }
                break;
            case 14:
                if (var0.exec_h_to_bool()) {
                    if (!var0.exec_i_to_bool()) {
                        var0.updateActor(0);
                    } else {
                        if ((CoreEngine.val_int_dL) === (3)) {
                            var0.updateActor(22);
                        } else {
                            var0.updateActor(13);
                        }
                    }
                }
                break;
            case 15:
                if ((var0.exec_h_to_bool() && (((CoreEngine.exec_b_coreengine_to_coreengine(var0)) === (null) || (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerW) !== (30)) || (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorSubStateH <= 0)))) {
                    var0.updateActor(0);
                }
                break;
            case 16:
                if (var0.exec_j_to_bool()) {
                    var0.updateActor(0);
                }
                break;
            case 17:
                (var7 = var0);
                let var55 = false;
                if ((var0.actorTimerX > var7.val_arr_int_g[0])) {
                    (var55 = true);
                } else {
                    (var55 = false);
                }
                if ((var55 && (var0.opposingActorRef.actorTimerW) === (18))) {
                    let var1 = var0.exec_d_to_arr_int();
                    (var0.opposingActorRef.val_bool_s = false);
                    (var0.opposingActorRef.val_int_Q = -((var1[2] << 8) * var0.actorCurrentAnimIndex));
                    (var0.opposingActorRef.val_int_R = (var1[3] << 8));
                    (var0.opposingActorRef.val_int_S = var1[4]);
                    var0.opposingActorRef.updateActor(19);
                    CoreEngine.exec_a_coreengine_arr_int_int_int_int_int_to_void(var0.opposingActorRef, var1, (var0.spriteSequences[16].getFrameCount() - 1), var0.exec_a_to_int(), var0.exec_b_to_int(), -var0.actorCurrentAnimIndex);
                    if ((var0.characterId) === (5)) {
                        CoreEngine.exec_aq_to_void();
                    }
                }
                (var7 = var0);
                let var57 = false;
                if ((var0.exec_h_to_bool() && (var7.actorTimerX > var7.val_arr_int_g[1]))) {
                    (var57 = true);
                } else {
                    (var57 = false);
                }
                if (var57) {
                    var0.updateActor(0);
                }
            case 18:
            case 20:
            case 28:
            case 29:
            case 33:
            case 37:
            case 38:
            case 39:
            case 40:
            case 41:
            case 42:
            case 43:
            case 44:
            case 45:
            case 46:
            case 47:
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 58:
            case 59:
            case 60:
            case 61:
            case 62:
            case 63:
            case 64:
            case 65:
            case 66:
            case 67:
            case 68:
            case 69:
            case 70:
            case 71:
            case 72:
            case 73:
            case 74:
            case 75:
            case 76:
            case 77:
            case 78:
            case 79:
            case 80:
            case 81:
            case 82:
            case 83:
            case 84:
            case 85:
            case 86:
            case 87:
            case 88:
            case 89:
            case 90:
            case 91:
            case 92:
            case 93:
            case 94:
            case 95:
            case 96:
            case 97:
            case 98:
            case 99:
            default:
                break;
            case 19:
                if (var0.actorActiveFlag) {
                    var0.updateActor(13);
                }
                break;
            case 21:
                (var7 = var0);
                let var53 = false;
                if ((!var0.exec_h_to_bool() || ((!var7.actorActiveFlag || (var7.actorTimerX <= CoreEngine.val_arr_int_bg[var7.characterId])) && (var7.actorActiveFlag || (var7.actorTimerX <= 450))))) {
                    (var53 = false);
                } else {
                    (var53 = true);
                }
                if (var53) {
                    if (var0.actorActiveFlag) {
                        var0.updateActor(0);
                    } else {
                        var0.updateActor(36);
                    }
                }
                break;
            case 22:
                if (((((CoreEngine.val_int_dL) !== (3) && (CoreEngine.val_int_dL) !== (4)) && !var0.exec_i_to_bool()) && ((var0.actorTimerX > 1300) || !CoreEngine.exec_b_coreengine_to_coreengine(var0).actorActiveFlag))) {
                    var0.updateActor(0);
                }
                break;
            case 23:
                if ((var0.actorTimerX > 3500)) {
                    if (var0.actorActiveFlag) {
                        var0.updateActor(0);
                    } else {
                        var0.updateActor(35);
                    }
                }
                break;
            case 24:
                if ((var0.actorTimerX > 300)) {
                    var0.updateActor(0);
                }
                break;
            case 25:
                if ((var0.actorTimerX > 300)) {
                    if (var0.exec_r_to_bool()) {
                        var0.updateActor(0);
                    } else {
                        var0.updateActor(3);
                    }
                }
                break;
            case 26:
                switch (var0.characterId) {
                    case 0:
                        if ((var0.actorActiveFlag && (var0.actorTimerX > 500))) {
                            var0.updateActor(0);
                        }
                        break label1033;
                    case 1:
                        if ((var0.actorTimerX > 750)) {
                            var0.updateActor(0);
                        }
                        break label1033;
                    case 2:
                        if (((var0.actorTimerX > 3000) || ((CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerW) === (34) && (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerX > 800)))) {
                            var0.updateActor(0);
                        }
                    case 3:
                    default:
                        break label1033;
                    case 4:
                        if ((var0.actorTimerX > 800)) {
                            (var0.actorActiveFlag = true);
                            var0.updateActor(0);
                        }
                        break label1033;
                    case 5:
                        if (((var0.actorTimerV) === (27) && var0.exec_h_to_bool())) {
                            var0.updateActor(0);
                        }
                        break label1033;
                    case 6:
                        if ((var0.actorTimerX > 700)) {
                            var0.updateActor(0);
                        }
                        break label1033;
                }
            case 27:
                if ((var0.actorTimerX > 630)) {
                    if (var0.actorActiveFlag) {
                        var0.updateActor(0);
                    } else {
                        var0.updateActor(35);
                    }
                }
                break;
            case 30:
                if ((var0.exec_h_to_bool() && (var0.actorTimerX >= 600))) {
                    var0.updateActor(0);
                }
                break;
            case 31:
                if ((var0.exec_s_to_bool() && var0.exec_a_arr_byte_to_bool(var0.val_arr_arr_byte_a[0]))) {
                    var0.updateActor(21);
                } else {
                    if ((var0.exec_t_to_bool() && var0.exec_a_arr_byte_to_bool(var0.val_arr_arr_byte_a[1]))) {
                        var0.updateActor(26);
                    } else {
                        if (var0.val_bool_F) {
                            if (((var0.val_bool_E && (var0.actorTimerX >= 250)) || (!var0.val_bool_E && (var0.actorTimerX >= 400)))) {
                                var0.updateActor(31);
                                (var0.val_bool_F = false);
                            }
                        } else {
                            if ((var0.exec_h_to_bool() && (var0.actorTimerX > 700))) {
                                var0.updateActor(0);
                            }
                        }
                    }
                }
                break;
            case 32:
                if ((var0.actorTimerX > 2500)) {
                    if (var0.actorActiveFlag) {
                        var0.updateActor(0);
                    } else {
                        var0.updateActor(35);
                    }
                }
                break;
            case 34:
                if ((var0.actorTimerX > 3000)) {
                    var0.updateActor(35);
                }
                break;
            case 35:
                if (var0.actorActiveFlag) {
                    (var0.actorActiveFlag = true);
                    var0.updateActor(13);
                    var0.setActorPosition(var0.exec_a_to_int(), 0);
                }
                break;
            case 36:
                if (var0.actorActiveFlag) {
                    (var0.actorActiveFlag = true);
                    var0.updateActor(0);
                    var0.setActorPosition(var0.exec_a_to_int(), 0);
                }
                break;
            case 100:
                if ((var0.exec_h_to_bool() && (CoreEngine.exec_g_to_int() <= 64))) {
                    var0.updateActor(0);
                    var0.linkedStateMachine.val_coreengine_a.updateActor(22);
                    var0.linkedStateMachine.setFacingDirection(3);
                }
                break;
            case 101:
                if ((var0.actorTimerX > 300)) {
                    var0.updateActor(100);
                }
                break;
            case 102:
                if (((((CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerW) !== (21) && (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerW) !== (101)) && (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerW) !== (100)) && (var0.actorTimerX > 300))) {
                    var0.updateActor(0);
                }
        }
        label961: switch (var0.actorTimerW) {
            case 0:
                if (((var0.actorTimerV) === (1) && var0.exec_h_to_bool())) {
                    var0.setActorSubState(0);
                }
                break;
            case 1:
                CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((28672 * var0.actorCurrentAnimIndex) * CoreEngine.val_int_e)) / (1000)), 0);
                break;
            case 2:
                CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((-28672 * var0.actorCurrentAnimIndex) * CoreEngine.val_int_e)) / (1000)), 0);
                break;
            case 3:
                if (((var0.actorTimerV) === (5) && var0.exec_h_to_bool())) {
                    var0.setActorHealthDelta(4);
                }
                break;
            case 6:
                if (((var0.actorTimerV) === (17) && (var0.actorTimerX >= 100))) {
                    var0.setActorSubState(18);
                }
                break;
            case 8:
                if (((var0.actorTimerV) === (17) && (var0.actorTimerX >= 100))) {
                    var0.setActorDirection(18);
                }
                break;
            case 10:
                if ((var0.val_bool_r && (var0.actorTimerX < 1000))) {
                    let var28 = Math.min(5, (var0.spriteSequences[var0.actorTimerV].getFrameCount() - 1));
                    (var0.actorTimerR = var0.exec_a_to_spritepartsequence().getPartXOffset(var28));
                }
                break;
            case 12:
                if ((var0.actorPhysicsArray[0]) === (0)) {
                    CoreEngine.exec_a_entityinterface_int_int_to_void(var0, 0, Math.trunc(((7680 * CoreEngine.val_int_e)) / (1000)));
                } else {
                    if ((var0.actorTimerX < Math.trunc((var0.actorPhysicsArray[3]) / (3)))) {
                        var0.setActorSubState(3);
                    }
                }
                break;
            case 16:
                CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((57344 * var0.actorCurrentAnimIndex) * CoreEngine.val_int_e)) / (1000)), 0);
                var0.adjustEnergyMeter(Math.trunc(((-25600 * CoreEngine.val_int_e)) / (1000)));
                break;
            case 17:
                if ((var0.opposingActorRef.actorTimerW) === (18)) {
                    let var27 = var0.exec_d_to_arr_int();
                    let var21 = CoreEngine.exec_j_int_to_int(var0.actorTimerR);
                    CoreEngine.exec_a_coreengine_arr_int_int_int_int_int_to_void(var0.opposingActorRef, var27, var21, var0.exec_a_to_int(), var0.exec_b_to_int(), -var0.actorCurrentAnimIndex);
                }
                break;
            case 21:
                let var25 = null;
                if (var0.actorActiveFlag) {
                    (var25 = var0.spriteTransformLookupB);
                } else {
                    (var25 = var0.spriteTransformLookupC);
                }
                if (((var0.actorTimerX > var25[3]) && (var0.linkedStateMachine) === (null))) {
                    let var86 = var25[0];
                    let var89 = (var0.exec_a_to_int() + (var25[1] * var0.actorCurrentAnimIndex));
                    let var90 = (var0.exec_b_to_int() + var25[2]);
                    let var26 = var0;
                    let var20 = var0.val_int_O;
                    let var82 = var0.actorCurrentAnimIndex;
                    (var9 = var90);
                    let var72 = var89;
                    let var66 = var86;
                    let var30 = 0;
                    let var87 = null;
                    while (true) {
                        if ((var30 >= 8)) {
                            (var87 = null);
                            break;
                        }
                        if (!CoreEngine.val_arr_actorstatemachine_a[var30].isGrounded()) {
                            let var31 = null;
                            ((var31 = CoreEngine.val_arr_actorstatemachine_a[var30]).actorActionFrame = var66);
                            (var31.actorTimer = var20);
                            var31.setPosition(var72, var9);
                            (var31.actorFacingDirection = var82);
                            (var31.val_coreengine_b = var26);
                            var31.setFacingDirection(2);
                            (var87 = var31);
                            break;
                        }
                        var30++;
                    }
                    (var0.linkedStateMachine = var87);
                }
                break;
            case 23:
                if ((var0.actorTimerX < 1000)) {
                    (var0.val_bool_B = true);
                }
                var0.exec_d_int_int_to_void(var0.actorTimerV, var0.val_int_Z);
                if ((var0.characterId) === (0)) {
                    (var7 = var0);
                    if (((var0.linkedStateMachine) !== (null) && var7.linkedStateMachine.isGrounded())) {
                        var7.linkedStateMachine.setFacingDirection(3);
                        (var7.linkedStateMachine = null);
                    }
                }
                (var7 = var0);
                if ((var0.opposingActorRef) !== (null)) {
                    var7.opposingActorRef.updateActor(0);
                    (var7.opposingActorRef = null);
                }
                break;
            case 26:
                switch (var0.characterId) {
                    case 0:
                        let var24 = false;
                        if ((var0.actorCurrentAnimIndex) === (-1)) {
                            (var24 = var0.val_bool_u);
                        } else {
                            (var24 = var0.val_bool_v);
                        }
                        let var19 = ((CoreEngine.exec_p_to_int() - CoreEngine.exec_o_to_int()) - 64);
                        if (var0.val_bool_w) {
                            if ((var0.actorTimerV) !== (18)) {
                                (var0.val_bool_s = false);
                                var0.setActorSubState(18);
                                (var0.actorTimerX = 0);
                            }
                        } else {
                            if (var0.val_bool_x) {
                                (var0.val_bool_x = false);
                                (var0.val_bool_t = true);
                            } else {
                                if (var24) {
                                    var0.exec_e_int_int_to_void((-var0.actorCurrentAnimIndex * (var19 << 8)), 0);
                                }
                            }
                        }
                        break label961;
                    case 1:
                        if (!var0.val_bool_r) {
                            CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((90112 * var0.actorCurrentAnimIndex) * CoreEngine.val_int_e)) / (1000)), 0);
                        }
                        break label961;
                    case 2:
                        (var0.actorTimerS = CoreEngine.val_spritepartsequence_I.getPartYOffset(var0.actorTimerS, CoreEngine.val_int_e));
                        break label961;
                    case 3:
                        if ((var0.val_bool_r && ((var0.actorTimerX - var0.val_int_ad) <= 200))) {
                            CoreEngine.exec_a_entityinterface_int_int_to_void(var0, 0, 0);
                        } else {
                            if (((var0.actorTimerX < 800) && !var0.val_bool_r)) {
                                if ((var0.actorTimerV) === (19)) {
                                    (var0.actorActiveFlag = false);
                                    CoreEngine.exec_a_entityinterface_int_int_to_void(var0, 0, Math.trunc(((-98304 * CoreEngine.val_int_e)) / (1000)));
                                    if ((var0.exec_b_to_int() <= -80)) {
                                        var0.setActorPosition(var0.exec_a_to_int(), -80);
                                        var0.setActorSubState(26);
                                    }
                                } else {
                                    if ((var0.actorTimerV) === (26)) {
                                        CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((var0.actorCurrentAnimIndex * 131072) * CoreEngine.val_int_e)) / (1000)), 0);
                                    }
                                }
                            } else {
                                if ((var0.actorTimerV) !== (19)) {
                                    var0.setActorDirection(19);
                                }
                                CoreEngine.exec_a_entityinterface_int_int_to_void(var0, 0, Math.trunc(((98304 * CoreEngine.val_int_e)) / (1000)));
                                if ((var0.exec_b_to_int() >= 0)) {
                                    var0.setActorPosition(var0.exec_a_to_int(), 0);
                                    (var0.actorActiveFlag = true);
                                    var0.updateActor(0);
                                }
                            }
                        }
                        break label961;
                    case 4:
                        if (!var0.val_bool_r) {
                            CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((98304 * var0.actorCurrentAnimIndex) * CoreEngine.val_int_e)) / (1000)), 0);
                        }
                        break label961;
                    case 5:
                        if ((var0.exec_h_to_bool() && (var0.actorTimerV) === (26))) {
                            let var18 = CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                            let var23 = 0;
                            if (CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_p_to_bool()) {
                                (var23 = (var18 - (var0.actorCurrentAnimIndex << 6)));
                            } else {
                                (var23 = (var18 + (var0.actorCurrentAnimIndex << 6)));
                            }
                            var0.setActorPosition(var23, 0);
                            var0.setActorDirection(27);
                            CoreEngine.exec_a_int_int_bool_bool_to_void(var0.exec_a_to_int(), (var0.exec_b_to_int() - 55), true, true);
                            (var0.actorCounterE += 2000);
                        }
                        break label961;
                    case 6:
                        if (((var0.actorTimerX <= 400) && !var0.val_bool_r)) {
                            CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((var0.actorCurrentAnimIndex * 49152) * CoreEngine.val_int_e)) / (1000)), 0);
                        }
                    default:
                        break label961;
                }
            case 27:
                CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((var0.actorCurrentAnimIndex * -20480) * CoreEngine.val_int_e)) / (1000)), 0);
                break;
            case 28:
                let var29 = CoreEngine.val_int_eu;
                if (!CoreEngine.val_bool_g) {
                    switch (CoreEngine.val_int_eu) {
                        case 0:
                            CoreEngine.exec_ak_to_void();
                            break;
                        case 1:
                            if ((CoreEngine.val_int_ev) === (0)) {
                                var0.setActorSubState(6);
                            } else {
                                if (((CoreEngine.exec_g_to_int() > 64) && (CoreEngine.val_int_ev < 3000))) {
                                    var0.exec_e_int_int_to_void(Math.trunc((((var0.actorCurrentAnimIndex * 28672) * CoreEngine.val_int_e)) / (1000)), 0);
                                    break;
                                }
                                CoreEngine.exec_ak_to_void();
                            }
                            break;
                        case 2:
                            if ((CoreEngine.val_int_ev) === (0)) {
                                var0.setActorSubState(4);
                            } else {
                                if ((CoreEngine.val_int_ev > 1000)) {
                                    CoreEngine.exec_ak_to_void();
                                }
                            }
                            break;
                        case 3:
                            if ((CoreEngine.val_int_ev) === (0)) {
                                var0.setActorSubState(15);
                            } else {
                                if ((CoreEngine.val_int_ev > 200)) {
                                    CoreEngine.exec_ak_to_void();
                                }
                            }
                            break;
                        case 4:
                            if ((CoreEngine.val_int_ev) === (0)) {
                                CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                                CoreEngine.exec_M_int_to_void(500);
                                CoreEngine.exec_b_coreengine_to_coreengine(var0).setActorSubState(3);
                                (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_int_Q = ((var0.actorCurrentAnimIndex * CoreEngine.val_arr_short_x[0]) << 8));
                                (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_int_R = (CoreEngine.val_arr_short_x[1] << 8));
                                (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_int_S = CoreEngine.val_arr_short_x[2]);
                                (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_s = false);
                                let var48 = CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                                let var40 = (CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -87);
                                let var35 = 0;
                                if ((CoreEngine.exec_b_coreengine_to_coreengine(var0).characterId) === (5)) {
                                    (var35 = 1);
                                } else {
                                    (var35 = 0);
                                }
                                CoreEngine.exec_a_int_int_int_int_to_void(0, var48, var40, var35);
                                CoreEngine.exec_aq_to_void();
                            } else {
                                if (((CoreEngine.val_int_ev > 400) && CoreEngine.exec_b_coreengine_to_coreengine(var0).actorActiveFlag)) {
                                    CoreEngine.exec_ak_to_void();
                                }
                            }
                            break;
                        case 5:
                            if ((CoreEngine.val_int_ev) === (0)) {
                                var0.setActorSubState(33);
                                CoreEngine.exec_b_coreengine_to_coreengine(var0).setActorSubState(8);
                                CoreEngine.exec_aq_to_void();
                            } else {
                                if (var0.exec_h_to_bool()) {
                                    (CoreEngine.val_bool_aO = true);
                                }
                            }
                    }
                } else {
                    label930: switch (var0.characterId) {
                        case 0:
                            switch (CoreEngine.val_int_eu) {
                                case 0:
                                    var0.setActorSubState(28);
                                    (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = false);
                                    (var0.val_bool_y = false);
                                    CoreEngine.exec_ak_to_void();
                                    CoreEngine.exec_R_to_void();
                                    break label930;
                                case 1:
                                    CoreEngine.exec_R_to_void();
                                    CoreEngine.exec_ak_to_void();
                                    break label930;
                                case 2:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_ab_to_void();
                                    }
                                    CoreEngine.exec_U_to_void();
                                    CoreEngine.exec_ak_to_void();
                                    break label930;
                                case 3:
                                    (var0.val_bool_y = true);
                                    if (var0.exec_h_to_bool()) {
                                        CoreEngine.exec_ak_to_void();
                                    }
                                    break label930;
                                case 4:
                                    if ((CoreEngine.val_int_ev) !== (0)) {
                                        if ((CoreEngine.val_int_ev > 1500)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                        break label930;
                                    }
                                    let var34 = (var0.exec_a_to_int() + (37 * var0.actorCurrentAnimIndex));
                                    let var39 = (var0.exec_b_to_int() + -72);
                                    let var17 = CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                                    let var47 = CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int();
                                    for (let var22 = 0; (var22 < 12); var22++) {
                                        let var88 = (var17 + (CoreEngine.exec_a_int_int_to_int(0, 48) - 24));
                                        let var81 = (var22 * 80);
                                        (var9 = var88);
                                        let var71 = var39;
                                        let var63 = var34;
                                        CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var34, var71, (var9 - var63), var71, 400, var81, 2, 0, 1500, (((0) << 24) >> 24), false, false, false, false, false, false, CoreEngine.val_animationset_u, CoreEngine.val_spritepartsequence_s, CoreEngine.val_animationset_u, CoreEngine.val_spritepartsequence_s);
                                    }
                                    CoreEngine.exec_i_int_int_to_void(var17, var47);
                                    (var0.val_bool_A = true);
                                    (CoreEngine.val_int_ev = 0);
                                    break label930;
                                case 5:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                                        CoreEngine.exec_M_int_to_void(500);
                                        CoreEngine.exec_g_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                                    } else {
                                        if ((CoreEngine.val_int_ev > 300)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 6:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_spritepartsequence_animationset_to_void(CoreEngine.val_spritepartsequence_C, CoreEngine.val_animationset_y);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1500)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 7:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = true);
                                    } else {
                                        if (CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_h_to_bool()) {
                                            (CoreEngine.val_bool_aO = true);
                                        }
                                    }
                                default:
                                    break label930;
                            }
                        case 1:
                            switch (CoreEngine.val_int_eu) {
                                case 0:
                                    if ((CoreEngine.val_int_ev) !== (0)) {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                        break label930;
                                    }
                                    (var0.val_bool_A = true);
                                    (var0.val_bool_y = false);
                                    if (((CoreEngine.val_animationset_v) === (null) || (CoreEngine.val_arr_spritepartsequence_j) === (null))) {
                                        try {
                                            let var62 = CoreEngine.val_arr_int_aP;
                                            let var70 = CoreEngine.exec_b_int_to_animationset(CoreEngine.val_arr_int_aP[0]);
                                            let var76 = createArray(Math.trunc(((var62.length - 1)) / (2)), null);
                                            for (let var80 = 1; (var80 < var62.length); (var80 += 2)) {
                                                (var76[Math.trunc((var80) / (2))] = CoreEngine.exec_a_int_int_to_spritepartsequence(var62[var80], var62[(var80 + 1)]));
                                            }
                                            (CoreEngine.val_animationset_v = var70);
                                            (CoreEngine.val_arr_spritepartsequence_j = var76);
                                        } catch (var15) {

                                        }
                                    }
                                    if (((CoreEngine.val_animationset_w) === (null) || (CoreEngine.val_spritepartsequence_B) === (null))) {
                                        try {
                                            (CoreEngine.val_animationset_w = CoreEngine.exec_b_int_to_animationset(134217837));
                                            (CoreEngine.val_spritepartsequence_B = CoreEngine.exec_a_int_int_to_spritepartsequence(134217758, 0));
                                        } catch (var14) {

                                        }
                                    }
                                    CoreEngine.exec_U_to_void();
                                    break label930;
                                case 1:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(28);
                                        (var0.val_bool_y = true);
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 2:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.val_bool_aw = false);
                                        CoreEngine.exec_i_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                                        let var84 = (var0.exec_a_to_int() + (var0.actorCurrentAnimIndex * 37));
                                        let var85 = (var0.exec_b_to_int() + -90);
                                        let var79 = (CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -90);
                                        (var9 = CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int());
                                        let var69 = var85;
                                        let var61 = var84;
                                        CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var84, var69, (var9 - var61), (var69 - var79), 1000, 0, 2, 0, 1000, (((0) << 24) >> 24), false, false, false, false, false, false, CoreEngine.val_animationset_w, CoreEngine.val_spritepartsequence_B, CoreEngine.val_animationset_w, CoreEngine.val_spritepartsequence_B);
                                        (CoreEngine.val_int_ev = 0);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 400)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 3:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = false);
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_r_int_to_void(1);
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 4:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(6);
                                    } else {
                                        if (((CoreEngine.exec_g_to_int() > 64) && (CoreEngine.val_int_ev < 3000))) {
                                            var0.exec_e_int_int_to_void(Math.trunc((((var0.actorCurrentAnimIndex * 28672) * CoreEngine.val_int_e)) / (1000)), 0);
                                            break label930;
                                        }
                                        CoreEngine.exec_ak_to_void();
                                    }
                                    break label930;
                                case 5:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(4);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 6:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_M_int_to_void(500);
                                        var0.setActorSubState(15);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 200)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 7:
                                    if ((CoreEngine.val_int_ev) !== (0)) {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                        break label930;
                                    }
                                    CoreEngine.exec_h_byte_to_void((((53) << 24) >> 24));
                                    CoreEngine.exec_b_coreengine_to_coreengine(var0).setActorSubState(-1);
                                    let var68 = CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int();
                                    let var60 = CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                                    for (let var74 = 0; (var74 < 5); var74++) {
                                        for (let var10 = 0; (var10 < CoreEngine.val_arr_spritepartsequence_j.length); var10++) {
                                            let var16 = 0;
                                            switch (var74) {
                                                case 0:
                                                    (var16 = -24);
                                                    break;
                                                case 1:
                                                    (var16 = -12);
                                                    break;
                                                case 2:
                                                    (var16 = 0);
                                                    break;
                                                case 3:
                                                    (var16 = 12);
                                                    break;
                                                case 4:
                                                    (var16 = 24);
                                            }
                                            let var83 = (var60 + var16);
                                            let var10001 = (var68 + (-var10 * 10));
                                            let var10002 = (CoreEngine.exec_a_int_int_to_int(0, 128) - 64);
                                            let var10003 = CoreEngine.exec_a_int_int_to_int(160, 220);
                                            CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var83, var10001, var10002, var10003, (var10003 * 7), 0, 5, 2, 0, (((0) << 24) >> 24), true, false, false, false, true, false, CoreEngine.val_animationset_v, CoreEngine.val_arr_spritepartsequence_j[var10], CoreEngine.val_animationset_v, CoreEngine.val_arr_spritepartsequence_j[var10]);
                                        }
                                    }
                                    CoreEngine.exec_aq_to_void();
                                    break label930;
                                case 8:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(33);
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            (CoreEngine.val_bool_aO = true);
                                        }
                                    }
                                default:
                                    break label930;
                            }
                        case 2:
                            switch (CoreEngine.val_int_eu) {
                                case 0:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (var0.val_bool_A = true);
                                        (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = false);
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).setActorSubState(22);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 1:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(6);
                                        CoreEngine.exec_i_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                                    } else {
                                        if (((CoreEngine.exec_g_to_int() > 54) && (CoreEngine.val_int_ev < 3000))) {
                                            var0.exec_e_int_int_to_void(Math.trunc((((var0.actorCurrentAnimIndex * 28672) * CoreEngine.val_int_e)) / (1000)), 0);
                                            break label930;
                                        }
                                        CoreEngine.exec_ak_to_void();
                                    }
                                    break label930;
                                case 2:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorPosition((CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int() - (var0.actorCurrentAnimIndex * 54)), var0.exec_b_to_int());
                                        var0.setActorSubState(4);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 3:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.val_int_ev = 0);
                                        CoreEngine.exec_M_int_to_void(500);
                                        var0.setActorSubState(24);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 150)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 4:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).setActorSubState(31);
                                        let var46 = CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                                        let var38 = (CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int() - 78);
                                        let var33 = 0;
                                        if ((CoreEngine.exec_b_coreengine_to_coreengine(var0).characterId) === (5)) {
                                            (var33 = 1);
                                        } else {
                                            (var33 = 0);
                                        }
                                        CoreEngine.exec_a_int_int_int_int_to_void(0, var46, var38, var33);
                                        CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), (CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int() - 78), (32 * var0.actorCurrentAnimIndex), 112, 1000, 0, 5, 2, 0, (((0) << 24) >> 24), true, false, false, false, true, false, CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_animationset(), CoreEngine.exec_b_coreengine_to_coreengine(var0).spriteSequences[32], CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_animationset(), CoreEngine.exec_b_coreengine_to_coreengine(var0).spriteSequences[32]);
                                        CoreEngine.exec_aq_to_void();
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1500)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 5:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        let var45 = CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                                        let var37 = (CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -87);
                                        let var32 = 0;
                                        if ((CoreEngine.exec_b_coreengine_to_coreengine(var0).characterId) === (5)) {
                                            (var32 = 1);
                                        } else {
                                            (var32 = 0);
                                        }
                                        CoreEngine.exec_a_int_int_int_int_to_void(0, var45, var37, var32);
                                        var0.setActorSubState(33);
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            (CoreEngine.val_bool_aO = true);
                                        }
                                    }
                                default:
                                    break label930;
                            }
                        case 3:
                            switch (CoreEngine.val_int_eu) {
                                case 0:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(0);
                                        (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = false);
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).setActorSubState(22);
                                        CoreEngine.exec_R_to_void();
                                        CoreEngine.exec_ab_to_void();
                                        CoreEngine.exec_U_to_void();
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 1:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(28);
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 2:
                                    CoreEngine.exec_ak_to_void();
                                    break label930;
                                case 3:
                                    if ((CoreEngine.val_int_ev > 1000)) {
                                        CoreEngine.exec_ak_to_void();
                                    } else {
                                        (CoreEngine.val_bool_aP = true);
                                        let var44 = (var0.exec_a_to_int() + (var0.actorCurrentAnimIndex * 19));
                                        let var36 = (var0.exec_b_to_int() + -70);
                                        (CoreEngine.val_int_ex = CoreEngine.exec_b_int_int_int_int_to_int(var44, (var44 + (var0.actorCurrentAnimIndex * -32)), (var44 + (var0.actorCurrentAnimIndex * 80)), CoreEngine.val_int_ev));
                                        (CoreEngine.val_int_ey = CoreEngine.exec_b_int_int_int_int_to_int(var36, (var36 + -100), (var36 + -20), CoreEngine.val_int_ev));
                                    }
                                    break label930;
                                case 4:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.val_int_ez = CoreEngine.val_int_ex);
                                        (CoreEngine.val_int_eA = CoreEngine.val_int_ey);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 400)) {
                                            CoreEngine.exec_ak_to_void();
                                        } else {
                                            let var10000 = (CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int() - CoreEngine.val_int_ez);
                                            let var43 = ((CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -32) - CoreEngine.val_int_eA);
                                            (CoreEngine.val_int_ex = (Math.trunc(((var10000 * CoreEngine.val_int_ev)) / (400)) + CoreEngine.val_int_ez));
                                            (CoreEngine.val_int_ey = (CoreEngine.val_int_eA + Math.trunc(((var43 * CoreEngine.val_int_ev)) / (400))));
                                        }
                                    }
                                    break label930;
                                case 5:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_M_int_to_void(500);
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                                        CoreEngine.exec_g_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                                        (CoreEngine.val_bool_aP = false);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 300)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 6:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_spritepartsequence_animationset_to_void(CoreEngine.val_spritepartsequence_C, CoreEngine.val_animationset_y);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1500)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 7:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = true);
                                        var0.setActorSubState(33);
                                    } else {
                                        (CoreEngine.val_bool_aO = true);
                                    }
                                default:
                                    break label930;
                            }
                        case 4:
                            switch (CoreEngine.val_int_eu) {
                                case 0:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_R_to_void();
                                        var0.setActorSubState(33);
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 1:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = false);
                                        try {
                                            (CoreEngine.val_animationset_A = CoreEngine.exec_b_int_to_animationset(134217844));
                                            (CoreEngine.val_animationset_B = CoreEngine.exec_a_int_to_animationset(134217845));
                                            (CoreEngine.val_spritepartsequence_G = CoreEngine.exec_a_int_int_to_spritepartsequence(134217775, 0));
                                            (CoreEngine.val_spritepartsequence_H = CoreEngine.exec_a_int_int_to_spritepartsequence(134217776, 0));
                                        } catch (var13) {

                                        }
                                        CoreEngine.exec_ab_to_void();
                                        CoreEngine.exec_U_to_void();
                                    } else {
                                        CoreEngine.exec_ak_to_void();
                                    }
                                    break label930;
                                case 2:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.exec_a_spritepartsequence_animationset_to_void(CoreEngine.val_spritepartsequence_H, CoreEngine.val_animationset_B);
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 3:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(-1);
                                        (CoreEngine.val_bool_aw = false);
                                        CoreEngine.exec_i_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                                    } else {
                                        if ((CoreEngine.val_int_ev >= 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 4:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_f_coreengine_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0));
                                        var0.setActorPosition(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                                        var0.setActorSubState(28);
                                        (CoreEngine.val_bool_aQ = true);
                                        (CoreEngine.val_coreengine_f = var0);
                                    } else {
                                        if ((CoreEngine.val_int_ev >= 50)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 5:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                                        CoreEngine.exec_g_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                                    } else {
                                        if ((CoreEngine.val_int_ev >= 300)) {
                                            CoreEngine.exec_ak_to_void();
                                        } else {
                                            if (var0.exec_h_to_bool()) {
                                                var0.setActorSubState(-1);
                                                (CoreEngine.val_coreengine_f = null);
                                                (CoreEngine.val_bool_aQ = false);
                                            }
                                        }
                                    }
                                    break label930;
                                case 6:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_spritepartsequence_animationset_to_void(CoreEngine.val_spritepartsequence_C, CoreEngine.val_animationset_y);
                                    } else {
                                        if ((CoreEngine.val_int_ev >= 1500)) {
                                            CoreEngine.exec_ak_to_void();
                                        } else {
                                            if (var0.exec_h_to_bool()) {
                                                var0.setActorSubState(-1);
                                                (CoreEngine.val_coreengine_f = null);
                                                (CoreEngine.val_bool_aQ = false);
                                            }
                                        }
                                    }
                                    break label930;
                                case 7:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = true);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 8:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorPosition((CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int() - 64), var0.exec_b_to_int());
                                        let var73 = CoreEngine.val_animationset_B;
                                        let var67 = CoreEngine.val_spritepartsequence_H;
                                        (var7 = var0);
                                        (var0.actorTimerR = 2);
                                        (var7.val_bool_z = true);
                                        (var7.val_spritepartsequence_e = var67);
                                        (var7.val_animationset_f = var73);
                                        (var7.actorTimerR = CoreEngine.exec_a_int_int_int_to_int(var7.val_spritepartsequence_e.getTotalDuration(), (var7.val_spritepartsequence_e.getFrameCount() - 1), 2));
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break label930;
                                case 9:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(33);
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            (CoreEngine.val_bool_aO = true);
                                        }
                                    }
                                default:
                                    break label930;
                            }
                        case 5:
                            switch (CoreEngine.val_int_eu) {
                                case 0:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (var0.val_bool_A = true);
                                        var0.setActorSubState(0);
                                        CoreEngine.exec_K_to_void();
                                        if ((CoreEngine.val_animationset_s) === (null)) {
                                            try {
                                                let var58 = 0;
                                                if (CoreEngine.exec_B_to_bool()) {
                                                    (var58 = 0);
                                                } else {
                                                    (var58 = 3);
                                                }
                                                (CoreEngine.val_animationset_s = CoreEngine.exec_a_int_byte_to_animationset(134217840, var58));
                                                (CoreEngine.val_spritepartsequence_z = CoreEngine.exec_a_int_int_to_spritepartsequence(134217770, 0));
                                            } catch (var12) {

                                            }
                                        }
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break;
                                case 1:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(28);
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break;
                                case 2:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(29);
                                    } else {
                                        if ((CoreEngine.val_int_ev > 1000)) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break;
                                case 3:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.val_int_ev = 0);
                                    } else {
                                        if ((var0.exec_b_to_int() > -200)) {
                                            var0.exec_e_int_int_to_void(0, Math.trunc(((-32768 * CoreEngine.val_int_e)) / (1000)));
                                        } else {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break;
                                case 4:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorPosition(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), (var0.exec_b_to_int() - 78));
                                        (var0.val_int_X = 2);
                                        (var0.val_bool_D = true);
                                        CoreEngine.exec_i_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                                    } else {
                                        if ((var0.exec_b_to_int() < -220)) {
                                            var0.exec_e_int_int_to_void(0, Math.trunc(((32768 * CoreEngine.val_int_e)) / (1000)));
                                        } else {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break;
                                case 5:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        CoreEngine.exec_M_int_to_void(500);
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).setActorSubState(22);
                                        (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = false);
                                        (CoreEngine.val_int_ew = 0);
                                        CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                                    } else {
                                        if ((CoreEngine.val_int_ew >= 4)) {
                                            CoreEngine.exec_ak_to_void();
                                        } else {
                                            CoreEngine.exec_aq_to_void();
                                            var0.exec_e_int_int_to_void(0, Math.trunc(((24576 * CoreEngine.val_int_e)) / (1000)));
                                            if (((CoreEngine.val_int_ew) === (0) || (Math.trunc((CoreEngine.val_int_ev) / (160)) > CoreEngine.val_int_ew))) {
                                                let var42 = (CoreEngine.val_int_ew * 24);
                                                CoreEngine.exec_h_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), ((CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -87) + var42));
                                                if (((CoreEngine.val_int_ew % 2)) === (0)) {
                                                    CoreEngine.exec_f_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), ((CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + var42) - 78));
                                                }
                                                CoreEngine.val_int_ew++;
                                            }
                                            if (((CoreEngine.val_int_ev >= 700) && (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerV) !== (-1))) {
                                                (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerV = -1);
                                            }
                                        }
                                    }
                                    break;
                                case 6:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerV = -1);
                                    } else {
                                        if ((var0.exec_b_to_int() < 100)) {
                                            var0.exec_e_int_int_to_void(0, Math.trunc(((24576 * CoreEngine.val_int_e)) / (1000)));
                                        } else {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break;
                                case 7:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorPosition(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), 0);
                                        (var0.val_bool_D = false);
                                        var0.setActorDirection(27);
                                        CoreEngine.exec_a_int_int_bool_bool_to_void(var0.exec_a_to_int(), (var0.exec_b_to_int() - 55), true, true);
                                    } else {
                                        if (var0.exec_h_to_bool()) {
                                            CoreEngine.exec_ak_to_void();
                                        }
                                    }
                                    break;
                                case 8:
                                    if ((CoreEngine.val_int_ev) === (0)) {
                                        var0.setActorSubState(33);
                                    } else {
                                        (CoreEngine.val_bool_aO = true);
                                    }
                            }
                    }
                }
                if ((CoreEngine.val_int_eu) === (var29)) {
                    (CoreEngine.val_int_ev = (CoreEngine.val_int_ev + CoreEngine.val_int_e));
                } else {
                    (CoreEngine.val_int_ev = 0);
                }
                break;
            case 30:
                if (var0.val_bool_r) {
                    let var41 = false;
                    if ((var0.val_int_aa) === (0)) {
                        (var41 = true);
                    } else {
                        (var41 = false);
                    }
                    (var0.val_bool_y = var41);
                    (var0.val_int_aa = Math.max(0, (var0.val_int_aa - CoreEngine.val_int_e)));
                } else {
                    CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((16384 * var0.actorCurrentAnimIndex) * CoreEngine.val_int_e)) / (1000)), 0);
                }
                break;
            case 33:
                let var6 = CoreEngine.val_int_eu;
                switch (CoreEngine.val_int_eu) {
                    case 0:
                        if ((CoreEngine.val_int_ev) === (0)) {
                            (CoreEngine.exec_b_coreengine_to_coreengine(var0).val_bool_y = false);
                            var0.setActorSubState(33);
                        } else {
                            if (var0.exec_h_to_bool()) {
                                CoreEngine.exec_ak_to_void();
                            }
                        }
                        break;
                    case 1:
                        if ((CoreEngine.val_int_ev) === (0)) {
                            CoreEngine.exec_R_to_void();
                            CoreEngine.exec_U_to_void();
                            let var5 = CoreEngine.exec_b_coreengine_to_coreengine(var0);
                            let var4 = CoreEngine.val_arr_int_aV[var5.characterId];
                            let var3 = CoreEngine.val_arr_int_aW[var5.characterId];
                            if ((var4) !== (-1)) {
                                try {
                                    (var5.val_animationset_g = CoreEngine.exec_a_int_to_animationset(var4));
                                    (var5.val_spritepartsequence_f = CoreEngine.exec_a_int_int_to_spritepartsequence(var3, 0));
                                } catch (var11) {

                                }
                            }
                            CoreEngine.exec_U_to_void();
                        } else {
                            CoreEngine.exec_ak_to_void();
                        }
                        break;
                    case 2:
                        if ((CoreEngine.val_int_ev) === (0)) {
                            CoreEngine.exec_aq_to_void();
                            CoreEngine.exec_g_int_int_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                        } else {
                            if ((CoreEngine.val_int_ev > 300)) {
                                CoreEngine.exec_ak_to_void();
                            }
                        }
                        break;
                    case 3:
                        if ((CoreEngine.val_int_ev) === (0)) {
                            CoreEngine.exec_b_coreengine_to_coreengine(var0).exec_a_spritepartsequence_animationset_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0).val_spritepartsequence_f, CoreEngine.exec_b_coreengine_to_coreengine(var0).val_animationset_g);
                        } else {
                            if ((CoreEngine.val_int_ev > 2500)) {
                                (CoreEngine.val_bool_aO = true);
                            }
                        }
                }
                if ((CoreEngine.val_int_eu) === (var6)) {
                    (CoreEngine.val_int_ev = (CoreEngine.val_int_ev + CoreEngine.val_int_e));
                } else {
                    (CoreEngine.val_int_ev = 0);
                }
                break;
            case 34:
                var0.exec_r_to_void();
                (var0.actorActiveFlag = false);
                if ((var0.exec_b_to_int() <= -80)) {
                    CoreEngine.exec_a_entityinterface_int_int_to_void(var0, Math.trunc((((-var0.actorCurrentAnimIndex * 4096) * CoreEngine.val_int_e)) / (1000)), 0);
                } else {
                    CoreEngine.exec_a_entityinterface_int_int_to_void(var0, 0, Math.trunc(((-16384 * CoreEngine.val_int_e)) / (1000)));
                }
                var0.setActorSubState(3);
                break;
            case 35:
                CoreEngine.exec_a_entityinterface_int_int_to_void(var0, 0, Math.trunc(((73728 * CoreEngine.val_int_e)) / (1000)));
                break;
            case 36:
                if (((var0.playerSlot) !== (9) || (var0.actorTimerX >= 180))) {
                    CoreEngine.exec_a_entityinterface_int_int_to_void(var0, 0, Math.trunc(((73728 * CoreEngine.val_int_e)) / (1000)));
                }
                break;
            case 100:
                let var2 = var0.linkedStateMachine.val_coreengine_a;
                if ((CoreEngine.exec_g_to_int() > 64)) {
                    CoreEngine.exec_a_entityinterface_int_int_to_void(var2, Math.trunc((((-var0.actorCurrentAnimIndex << 16) * CoreEngine.val_int_e)) / (1000)), 0);
                }
                var2.exec_d_int_int_to_void(3, 0);
                break;
            case 102:
                var0.exec_d_int_int_to_void(3, 0);
        }
        if (var0.canAcceptAnimCommand()) {
            (var0.actorCurrentAnimIndex = var0.requestedAnimIndex);
        }
    }
    static renderAllActors() {
        if ((CoreEngine.val_int_dN) === (2)) {
            let var0 = CoreEngine.val_int_dL;
            let var1 = CoreEngine.val_byte_e;
            if ((CoreEngine.val_int_bv) !== (1)) {
                switch (var0) {
                    case 0:
                    case 1:
                    case 2:
                        if ((!CoreEngine.val_bool_aF && !CoreEngine.val_bool_aG)) {
                            (CoreEngine.val_bool_aF = true);
                            CoreEngine.exec_b_byte_bool_to_void((((CharacterPresetTable.val_arr_arr_int_a[var1][22]) << 24) >> 24), false);
                            (CoreEngine.val_int_ek = 0);
                        } else {
                            if ((CoreEngine.val_bool_aF && !CoreEngine.val_bool_aG)) {
                                if (((CoreEngine.val_int_ek = (CoreEngine.val_int_ek + CoreEngine.val_int_e)) > AudioMetaTable.val_arr_int_b[(((CharacterPresetTable.val_arr_arr_int_a[var1][22]) << 24) >> 24)])) {
                                    (CoreEngine.val_bool_aF = false);
                                    (CoreEngine.val_bool_aG = true);
                                }
                            } else {
                                if ((CoreEngine.val_bool_aG && !CoreEngine.val_bool_aH)) {
                                    (CoreEngine.val_bool_aH = true);
                                    CoreEngine.exec_b_byte_bool_to_void((((CharacterPresetTable.val_arr_arr_int_a[var1][23]) << 24) >> 24), false);
                                }
                            }
                        }
                        break;
                    case 3:
                        if (!CoreEngine.val_bool_aI) {
                            (CoreEngine.val_bool_aI = true);
                            CoreEngine.exec_b_byte_bool_to_void((((15) << 24) >> 24), false);
                        }
                        break;
                    case 4:
                        if (CoreEngine.val_bool_aI) {
                            (CoreEngine.val_bool_aI = false);
                            if ((CoreEngine.val_int_eb) === (1)) {
                                if (!CoreEngine.val_bool_aJ) {
                                    (CoreEngine.val_bool_aJ = true);
                                    CoreEngine.exec_b_byte_bool_to_void((((13) << 24) >> 24), true);
                                }
                            } else {
                                if (!CoreEngine.val_bool_aM) {
                                    (CoreEngine.val_bool_aM = true);
                                    CoreEngine.exec_b_byte_bool_to_void((((11) << 24) >> 24), true);
                                }
                            }
                        }
                    case 5:
                    default:
                        break;
                    case 6:
                        if (CoreEngine.val_bool_aJ) {
                            (CoreEngine.val_bool_aJ = false);
                            (CoreEngine.val_bool_aK = true);
                            CoreEngine.exec_b_byte_bool_to_void((((14) << 24) >> 24), false);
                        } else {
                            if (((!CoreEngine.val_bool_aL && !CoreEngine.val_bool_aK) && !CoreEngine.val_bool_aM)) {
                                (CoreEngine.val_bool_aL = true);
                                CoreEngine.exec_b_byte_bool_to_void((((12) << 24) >> 24), false);
                            }
                        }
                }
            }
        }
        (CoreEngine.val_int_dO = (CoreEngine.val_int_dO + CoreEngine.val_int_e));
        switch (CoreEngine.val_int_dN) {
            case 1:
                if (((CoreEngine.val_int_dP > 0) && (CoreEngine.val_int_dP < 5))) {
                    if ((CoreEngine.val_coreengine_b) === (null)) {
                        let var33 = CoreEngine.val_int_dQ;
                        let var25 = 0;
                        if ((CoreEngine.val_int_bw) === (1)) {
                            (var25 = 0);
                        } else {
                            (var25 = 1);
                        }
                        ((CoreEngine.val_coreengine_b = CoreEngine.spawnActor(var33, -64, 0, 1, 0, var25, false, 0)).actorCounterE = ((CoreEngine.val_long_g) | 0));
                        CoreEngine.exec_U_to_void();
                    } else {
                        CoreEngine.tickActors();
                        (CoreEngine.val_int_dP = (1 + CoreEngine.val_coreengine_b.animationTick));
                    }
                } else {
                    if (((CoreEngine.val_int_dP < 5) || (CoreEngine.val_int_dP >= 9))) {
                        switch (CoreEngine.val_int_dP) {
                            case 0:
                                CoreEngine.exec_a_byte_to_void((((2) << 24) >> 24));
                                CoreEngine.exec_a_byte_to_void((((3) << 24) >> 24));
                                if (!CoreEngine.val_bool_am) {
                                    CoreEngine.exec_d_bool_to_void(true);
                                    CoreEngine.exec_I_to_void();
                                }
                                CoreEngine.initActorPool();
                                CoreEngine.exec_Q_to_void();
                                (CoreEngine.val_arr_arr_entityinterface_a = createMultiArray([3, 50], null));
                                (CoreEngine.val_arr_int_bl = createArray(20, 0));
                                (CoreEngine.val_arr_int_bp = createArray(20, 0));
                                (CoreEngine.val_arr_int_bq = createArray(4, 0));
                                (CoreEngine.val_arr_int_bk = createArray(3, 0));
                                (CoreEngine.val_arr_int_br = createArray(8, 0));
                                (CoreEngine.val_int_eC = 0);
                                CoreEngine.exec_T_to_void();
                                (CoreEngine.val_bool_aO = false);
                                (CoreEngine.val_int_eu = 0);
                                (CoreEngine.val_int_ev = 0);
                                if (!CoreEngine.val_bool_P) {
                                    try {
                                        (CoreEngine.val_arr_animationset_b = createArray(CoreEngine.val_arr_int_S.length, null));
                                        for (let var31 = 0; (var31 < CoreEngine.val_arr_int_S.length); var31++) {
                                            (CoreEngine.val_arr_animationset_b[var31] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_S[var31], -1, (((0) << 24) >> 24), false));
                                        }
                                        (CoreEngine.val_arr_spritepartsequence_d = createArray(CoreEngine.val_arr_int_U.length, null));
                                        (CoreEngine.val_arr_int_ae = createArray(CoreEngine.val_arr_int_U.length, 0));
                                        (CoreEngine.val_arr_int_ac = createArray(CoreEngine.val_arr_int_U.length, 0));
                                        (CoreEngine.val_arr_int_ad = createArray(CoreEngine.val_arr_int_U.length, 0));
                                        for (let var32 = 0; (var32 < CoreEngine.val_arr_int_U.length); var32++) {
                                            (CoreEngine.val_arr_spritepartsequence_d[var32] = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_int_U[var32], 1));
                                            (CoreEngine.val_arr_int_ae[var32] = 1);
                                            (CoreEngine.val_arr_int_ac[var32] = CoreEngine.val_arr_spritepartsequence_d[var32].getSequenceWidth(CoreEngine.val_arr_animationset_b[CoreEngine.val_arr_int_W[var32]]));
                                            (CoreEngine.val_arr_int_ad[var32] = CoreEngine.val_arr_spritepartsequence_d[var32].getSequenceHeight(CoreEngine.val_arr_animationset_b[CoreEngine.val_arr_int_W[var32]]));
                                        }
                                        (CoreEngine.val_bool_P = true);
                                    } catch (var13) {
                                        var13.printStackTrace();
                                    }
                                }
                                try {
                                    (CoreEngine.val_animationset_z = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217839, -1, (((0) << 24) >> 24), false));
                                    (CoreEngine.val_spritepartsequence_D = CoreEngine.exec_a_int_int_to_spritepartsequence(134217767, 1));
                                    (CoreEngine.val_spritepartsequence_E = CoreEngine.exec_a_int_int_to_spritepartsequence(134217768, 1));
                                    (CoreEngine.val_spritepartsequence_F = CoreEngine.exec_a_int_int_to_spritepartsequence(134217769, 1));
                                } catch (var12) {

                                }
                                if (CoreEngine.exec_A_to_bool()) {
                                    CoreEngine.exec_R_to_void();
                                    (CoreEngine.val_encodedtextbuffer_w = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(115, null));
                                }
                                (CoreEngine.val_int_dT = 0);
                                CoreEngine.val_int_dP++;
                                CoreEngine.exec_U_to_void();
                            case 1:
                            case 2:
                            case 3:
                            case 4:
                            case 5:
                            case 6:
                            case 7:
                            case 8:
                            default:
                                break;
                            case 9:
                                CoreEngine.exec_a_byte_int_to_void(CoreEngine.val_byte_r, -1);
                                CoreEngine.val_int_dP++;
                                CoreEngine.exec_U_to_void();
                                break;
                            case 10:
                                CoreEngine.val_int_dP++;
                                break;
                            case 11:
                                CoreEngine.val_int_dP++;
                                break;
                            case 12:
                                CoreEngine.val_int_dP++;
                                break;
                            case 13:
                                CoreEngine.val_int_dP++;
                                break;
                            case 14:
                                CoreEngine.val_int_dP++;
                                break;
                            case 15:
                                CoreEngine.val_int_dP++;
                                break;
                            case 16:
                                CoreEngine.val_int_dP++;
                                break;
                            case 17:
                                CoreEngine.val_int_dP++;
                                break;
                            case 18:
                                CoreEngine.val_int_dP++;
                                break;
                            case 19:
                                CoreEngine.val_int_dP++;
                                break;
                            case 20:
                                CoreEngine.val_int_dP++;
                                break;
                            case 21:
                                (CoreEngine.val_arr_effectactor_a = createArray(50, null));
                                (CoreEngine.val_int_el = 0);
                                (CoreEngine.val_int_em = -1);
                                for (let var28 = 0; (var28 < 50); var28++) {
                                    (CoreEngine.val_arr_effectactor_a[var28] = new EffectActor());
                                    (CoreEngine.val_arr_effectactor_a[var28].effectCoordinates = createArray(11, 0));
                                }
                                if ((CoreEngine.val_arr_animationset_e) === (null)) {
                                    try {
                                        (CoreEngine.val_arr_animationset_e = createArray(2, null));
                                        (CoreEngine.val_arr_animationset_f = createArray(2, null));
                                        let var29 = CoreEngine.val_arr_animationset_e;
                                        let var41 = 0;
                                        if (CoreEngine.val_bool_j) {
                                            (var41 = 0);
                                        } else {
                                            (var41 = 3);
                                        }
                                        let var18 = var41;
                                        (var29[0] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217825, -1, var18, false));
                                        let var42 = CoreEngine.val_arr_animationset_f;
                                        let var30 = 0;
                                        if (CoreEngine.val_bool_j) {
                                            (var30 = 0);
                                        } else {
                                            (var30 = 3);
                                        }
                                        (var18 = var30);
                                        (var42[0] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217826, -1, var18, false));
                                        (CoreEngine.val_spritepartsequence_u = CoreEngine.exec_a_int_int_to_spritepartsequence(134217729, 1));
                                        (CoreEngine.val_spritepartsequence_w = CoreEngine.exec_a_int_int_to_spritepartsequence(134217728, 0));
                                        (CoreEngine.val_spritepartsequence_y = CoreEngine.exec_a_int_int_to_spritepartsequence(134217730, 0));
                                    } catch (var11) {

                                    }
                                }
                                CoreEngine.val_int_dP++;
                                CoreEngine.exec_U_to_void();
                                break;
                            case 22:
                                let var22 = CoreEngine.val_coreengine_c.fighterNameBuffer;
                                let var17 = CoreEngine.val_coreengine_b.fighterNameBuffer;
                                let var14 = CoreEngine.val_int_bA;
                                let var7 = CoreEngine.val_int_bz;
                                CoreEngine.exec_a_byte_to_void((((1) << 24) >> 24));
                                CoreEngine.exec_a_byte_to_void((((0) << 24) >> 24));
                                (CoreEngine.val_int_cQ = var7);
                                (CoreEngine.val_int_cP = var14);
                                (CoreEngine.val_encodedtextbuffer_p = var17);
                                (CoreEngine.val_encodedtextbuffer_q = var22);
                                (CoreEngine.val_int_dz = 99);
                                (CoreEngine.val_encodedtextbuffer_o = CoreEngine.exec_a_int_to_encodedtextbuffer(99));
                                (CoreEngine.val_int_dA = 0);
                                (CoreEngine.val_int_dt = 0);
                                (CoreEngine.val_int_du = 0);
                                CoreEngine.exec_b_byte_to_void((((0) << 24) >> 24));
                                (CoreEngine.val_int_cT = CoreEngine.exec_a_encodedtextbuffer_to_int(CoreEngine.val_encodedtextbuffer_o));
                                (CoreEngine.val_int_cU = CoreEngine.exec_c_to_int());
                                (CoreEngine.val_int_cR = ((0 + Math.trunc((CoreEngine.val_int_cP) / (2))) - Math.trunc((CoreEngine.val_int_cT) / (2))));
                                (CoreEngine.val_int_cS = (CoreEngine.val_int_cQ + 5));
                                (CoreEngine.val_int_cV = 5);
                                (CoreEngine.val_int_cY = ((CoreEngine.val_int_cR - 3) - CoreEngine.val_int_cV));
                                (CoreEngine.val_int_cW = ((CoreEngine.val_int_cP - 5) - CoreEngine.val_int_cY));
                                (CoreEngine.val_int_cX = ((CoreEngine.val_int_cS + CoreEngine.val_int_cU) + 3));
                                (CoreEngine.val_int_dB = 10240);
                                (CoreEngine.val_encodedtextbuffer_r = new EncodedTextBuffer(10)).appendInt(CoreEngine.val_int_dA);
                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                (CoreEngine.val_int_dl = CoreEngine.exec_l_to_int());
                                (CoreEngine.val_int_dk = ((CoreEngine.val_int_cX - CoreEngine.val_int_dl) - 2));
                                (CoreEngine.val_arr_int_aF = createArray((CoreEngine.val_int_cY + 1), 0));
                                for (let var5 = 0; (var5 < (CoreEngine.val_int_cY + 1)); var5++) {
                                    if (((var5 % 2)) === (0)) {
                                        (CoreEngine.val_arr_int_aF[var5] = 2005401600);
                                    } else {
                                        (CoreEngine.val_arr_int_aF[var5] = 2009858048);
                                    }
                                }
                                CoreEngine.exec_b_byte_to_void((((1) << 24) >> 24));
                                (CoreEngine.val_int_cZ = (CoreEngine.exec_c_to_int() + 4));
                                (CoreEngine.val_int_di = (CoreEngine.val_int_cV + 5));
                                (CoreEngine.val_int_dj = ((CoreEngine.val_int_cW + CoreEngine.val_int_cY) - 5));
                                (CoreEngine.val_int_dm = (CoreEngine.val_int_cX + 2));
                                (CoreEngine.val_int_db = 25600);
                                (CoreEngine.val_int_da = 25600);
                                (CoreEngine.val_int_dd = 0);
                                (CoreEngine.val_int_dc = 0);
                                (CoreEngine.val_int_dh = 0);
                                (CoreEngine.val_int_dg = 0);
                                (CoreEngine.val_int_dn = Math.trunc(((CoreEngine.val_int_cY * 40)) / (100)));
                                if (((CoreEngine.val_int_do = Math.trunc(((CoreEngine.val_int_cZ * 40)) / (100))) < 3)) {
                                    (CoreEngine.val_int_do = 3);
                                }
                                (CoreEngine.val_int_dq = 25600);
                                (CoreEngine.val_int_dp = 25600);
                                (CoreEngine.val_int_df = 25600);
                                (CoreEngine.val_int_de = 25600);
                                (CoreEngine.val_int_dr = (CoreEngine.val_int_ds = CoreEngine.val_int_dn));
                                (CoreEngine.val_int_dC = 17920);
                                try {
                                    (CoreEngine.val_animationset_n = CoreEngine.exec_a_int_int_byte_bool_to_animationset(150994953, -1, (((0) << 24) >> 24), false));
                                    (CoreEngine.val_spritepartsequence_n = CoreEngine.exec_a_int_int_to_spritepartsequence(150994944, 0));
                                } catch (var10) {

                                }
                                (CoreEngine.val_int_dw = CoreEngine.val_spritepartsequence_n.getSequenceWidth(CoreEngine.val_animationset_n));
                                (CoreEngine.val_int_dv = CoreEngine.val_spritepartsequence_n.getSequenceHeight(CoreEngine.val_animationset_n));
                                (CoreEngine.val_int_dy = 5);
                                (CoreEngine.val_int_dx = (((CoreEngine.val_int_cX + CoreEngine.val_int_cZ) + CoreEngine.val_int_do) + 5));
                                (CoreEngine.val_encodedtextbuffer_s = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(126, null));
                                (CoreEngine.val_encodedtextbuffer_t = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(127, null));
                                CoreEngine.exec_U_to_void();
                                CoreEngine.val_int_dP++;
                                break;
                            case 23:
                                CoreEngine.exec_D_int_to_void(CoreEngine.val_coreengine_b.characterId);
                                CoreEngine.exec_N_int_to_void(CoreEngine.val_coreengine_b.spriteTransformLookupB[0]);
                                CoreEngine.exec_D_int_to_void(CoreEngine.val_coreengine_c.characterId);
                                CoreEngine.exec_N_int_to_void(CoreEngine.val_coreengine_c.spriteTransformLookupB[0]);
                                CoreEngine.val_int_dP++;
                        }
                    } else {
                        if ((CoreEngine.val_coreengine_c) === (null)) {
                            let var4 = CoreEngine.val_int_dR;
                            let var3 = 0;
                            if (CoreEngine.val_bool_am) {
                                (var3 = 0);
                            } else {
                                (var3 = 2);
                            }
                            let var2 = 0;
                            if ((CoreEngine.val_int_bw) === (1)) {
                                (var2 = 0);
                            } else {
                                (var2 = 1);
                            }
                            (CoreEngine.val_coreengine_c = CoreEngine.spawnActor(var4, 64, 0, -1, var3, var2, false, 1));
                            if (CoreEngine.val_bool_am) {
                                (CoreEngine.val_int_ei = CoreEngine.val_coreengine_c.currentHealth);
                            }
                            CoreEngine.exec_U_to_void();
                        } else {
                            CoreEngine.tickActors();
                            (CoreEngine.val_int_dP = (5 + CoreEngine.val_coreengine_c.animationTick));
                        }
                    }
                }
                if ((CoreEngine.val_int_dP) === (24)) {
                    CoreEngine.exec_U_to_void();
                    CoreEngine.exec_z_int_to_void(2);
                }
            case 0:
            case 2:
            case 3:
            default:
                (CoreEngine.val_int_ej = (CoreEngine.val_int_ej - CoreEngine.val_int_e));
                if (((CoreEngine.val_bool_h && (CoreEngine.val_coreengine_b) !== (null)) && (CoreEngine.val_coreengine_b.scratchpadBuffer) !== (null))) {
                    if (CoreEngine.val_bool_aD) {
                        (CoreEngine.val_coreengine_b.currentHealth = 100);
                    }
                    if (CoreEngine.val_bool_aE) {
                        (CoreEngine.val_coreengine_c.currentHealth = 100);
                    }
                    let var38 = CoreEngine.val_int_dQ;
                    let var6 = CoreEngine.val_int_dR;
                    let var20 = CoreEngine.val_byte_r;
                    let var15 = false;
                    let var23 = CoreEngine.val_coreengine_b;
                    for (let var26 = 0; (var26 < CoreEngine.val_arr_arr_byte_z.length); var26++) {
                        if (var23.exec_a_arr_byte_to_bool(CoreEngine.val_arr_arr_byte_z[var26])) {
                            let var43 = false;
                            let var34 = 0;
                            let var34_flag = false;
                            switch (var26) {
                                case 0:
                                    (CoreEngine.val_coreengine_b.currentHealth = 0);
                                    CoreEngine.val_coreengine_b.updateActor(13);
                                    (CoreEngine.val_coreengine_b.actorPhysicsArray[1] = 0);
                                    CoreEngine.drawTextLabel(2);
                                    CoreEngine.val_coreengine_c.updateActor(0);
                                    (CoreEngine.val_bool_aD = false);
                                    break;
                                case 1:
                                    (CoreEngine.val_coreengine_c.currentHealth = 0);
                                    CoreEngine.val_coreengine_c.updateActor(13);
                                    (CoreEngine.val_coreengine_c.actorPhysicsArray[1] = 0);
                                    CoreEngine.drawTextLabel(2);
                                    CoreEngine.val_coreengine_b.updateActor(0);
                                    (CoreEngine.val_bool_aE = false);
                                    break;
                                case 2:
                                    if (!CoreEngine.val_bool_aC) {
                                        (var43 = true);
                                    } else {
                                        (var43 = false);
                                    }
                                    (CoreEngine.val_bool_aC = var43);
                                    (var43 = true);
                                    (var34_flag = CoreEngine.val_bool_aC);
                                    break;
                                case 3:
                                    if (!CoreEngine.val_bool_aD) {
                                        (var43 = true);
                                    } else {
                                        (var43 = false);
                                    }
                                    (CoreEngine.val_bool_aD = var43);
                                    (var43 = true);
                                    (var34_flag = CoreEngine.val_bool_aD);
                                    break;
                                case 4:
                                    if (!CoreEngine.val_bool_aE) {
                                        (var43 = true);
                                    } else {
                                        (var43 = false);
                                    }
                                    (CoreEngine.val_bool_aE = var43);
                                    (var43 = true);
                                    (var34_flag = CoreEngine.val_bool_aE);
                                    break;
                                case 5:
                                    (CoreEngine.val_int_dS = 0);
                                    break;
                                case 6:
                                    let var44 = CoreEngine.val_coreengine_c;
                                    if ((CoreEngine.val_coreengine_c.layerDepth) === (0)) {
                                        (var34 = 2);
                                    } else {
                                        (var34 = 0);
                                    }
                                    (var44.layerDepth = var34);
                                    (var43 = true);
                                    if ((CoreEngine.val_coreengine_c.layerDepth) === (2)) {
                                        (var34 = 1);
                                    } else {
                                        (var34 = 0);
                                    }
                                    break;
                                case 7:
                                    (CoreEngine.val_coreengine_b.actorCounterE += 100000);
                                    break;
                                case 8:
                                    (var38 = ((var38 + 1) % 7));
                                    (var15 = true);
                                    break;
                                case 9:
                                    (var6 = ((var6 + 1) % 7));
                                    (var15 = true);
                                    break;
                                case 10:
                                    (var20 = (((((var20 + 1) % CharacterPresetTable.val_arr_arr_int_a.length)) << 24) >> 24));
                                    (var15 = true);
                            }
                            CoreEngine.exec_a_arr_byte_to_void(var23.scratchpadBuffer);
                            let var8 = null;
                            let var9 = new StringBuffer().append(CoreEngine.val_arr_string_e[var26]);
                            let var49 = null;
                            if (var43) {
                                let var48 = new StringBuffer().append(" - ");
                                let var36 = null;
                                if (var34_flag) {
                                    (var36 = "ON");
                                } else {
                                    (var36 = "OFF");
                                }
                                (var49 = var48.append(var36).toString());
                            } else {
                                (var49 = "");
                            }
                            (var8 = new EncodedTextBuffer(var9.append(var49).toString()));
                            (CoreEngine.val_encodedtextbuffer_N = var8);
                            (CoreEngine.val_int_ej = 3500);
                        }
                        if (var15) {
                            CoreEngine.exec_M_to_void();
                            CoreEngine.exec_a_int_int_byte_to_void(var38, var6, var20);
                            return;
                        }
                    }
                }
                if (CoreEngine.val_bool_ax) {
                    CoreEngine.exec_M_to_void();
                }
                if (((CoreEngine.val_int_dN) === (2) && !CoreEngine.exec_z_to_bool())) {
                    CoreEngine.updateBattleState();
                    CoreEngine.transitionGameState();
                    CoreEngine.tickActors();
                    CoreEngine.renderOverlays();
                    CoreEngine.updateVsScreenState();
                    CoreEngine.exec_F_to_void();
                    CoreEngine.renderHUD();
                    if ((CoreEngine.val_coreengine_b.exec_a_to_int() < CoreEngine.val_coreengine_c.exec_a_to_int())) {
                        CoreEngine.val_coreengine_b.setActorAnimation(1);
                        CoreEngine.val_coreengine_c.setActorAnimation(-1);
                    } else {
                        CoreEngine.val_coreengine_b.setActorAnimation(-1);
                        CoreEngine.val_coreengine_c.setActorAnimation(1);
                    }
                    let var55 = (CoreEngine.val_coreengine_b.exec_a_to_int() + Math.trunc(((CoreEngine.val_coreengine_c.exec_a_to_int() - CoreEngine.val_coreengine_b.exec_a_to_int())) / (2)));
                    let var54 = Math.trunc(((CoreEngine.val_coreengine_c.exec_b_to_int() + CoreEngine.val_coreengine_b.exec_b_to_int())) / (2));
                    let var50 = null;
                    if ((CoreEngine.val_coreengine_b.actorTimerW) === (18)) {
                        (var50 = CoreEngine.val_coreengine_b);
                    } else {
                        if ((CoreEngine.val_coreengine_c.actorTimerW) === (18)) {
                            (var50 = CoreEngine.val_coreengine_c);
                        } else {
                            (var50 = null);
                        }
                    }
                    if ((var50) !== (null)) {
                        let var10000 = CoreEngine.exec_b_coreengine_to_coreengine(var50);
                        (var55 = var10000.exec_a_to_int());
                        (var54 = var10000.exec_b_to_int());
                    }
                    let var51 = false;
                    if (CoreEngine.val_bool_aw) {
                        if ((!CoreEngine.val_coreengine_b.exec_q_to_bool() && !CoreEngine.val_coreengine_c.exec_q_to_bool())) {
                            (var54 += ((0 - Math.trunc((CoreEngine.val_int_bE) / (2))) + CoreEngine.val_int_ar));
                            (var51 = true);
                        } else {
                            if ((!CoreEngine.val_coreengine_b.exec_q_to_bool() && CoreEngine.val_coreengine_c.exec_q_to_bool())) {
                                (var55 = CoreEngine.val_coreengine_b.exec_a_to_int());
                                (var54 += ((0 - Math.trunc((CoreEngine.val_int_bE) / (2))) + CoreEngine.val_int_ar));
                                (var51 = true);
                            } else {
                                if ((CoreEngine.val_coreengine_b.exec_q_to_bool() && !CoreEngine.val_coreengine_c.exec_q_to_bool())) {
                                    (var55 = CoreEngine.val_coreengine_c.exec_a_to_int());
                                    (var54 += ((0 - Math.trunc((CoreEngine.val_int_bE) / (2))) + CoreEngine.val_int_ar));
                                    (var51 = true);
                                }
                            }
                        }
                    }
                    if (var51) {
                        CoreEngine.exec_a_int_int_bool_to_void(var55, var54, false);
                    }
                }
                if ((CoreEngine.val_int_dN) === (2)) {
                    let var10002 = (CoreEngine.val_coreengine_b.superMeterEnergy >> 8);
                    let var10003 = (CoreEngine.val_coreengine_c.superMeterEnergy >> 8);
                    let var10006 = Math.trunc((CoreEngine.val_int_dS) / (1000));
                    let var40 = ((CoreEngine.val_long_d) | 0);
                    let var39 = var10006;
                    let var27 = CoreEngine.val_int_dV;
                    let var24 = CoreEngine.val_int_dU;
                    let var21 = var10003;
                    let var16 = var10002;
                    let var52 = CoreEngine.val_coreengine_c.currentHealth;
                    (CoreEngine.val_int_da = (CoreEngine.val_coreengine_b.currentHealth << 8));
                    (CoreEngine.val_int_db = (var52 << 8));
                    (CoreEngine.val_int_dp = (var16 << 8));
                    (CoreEngine.val_int_dq = (var21 << 8));
                    (CoreEngine.val_int_dt = var24);
                    (CoreEngine.val_int_du = var27);
                    if ((CoreEngine.val_int_dz) !== (var39)) {
                        (CoreEngine.val_int_dz = var39);
                        (CoreEngine.val_encodedtextbuffer_o = CoreEngine.exec_a_int_to_encodedtextbuffer(var39));
                    }
                    if ((CoreEngine.val_int_dA) !== (var40)) {
                        (CoreEngine.val_encodedtextbuffer_r = new EncodedTextBuffer(10)).appendInt(var40);
                        (CoreEngine.val_int_dA = var40);
                    }
                    let var53 = CoreEngine.val_coreengine_c.fighterNameBuffer;
                    (CoreEngine.val_encodedtextbuffer_p = CoreEngine.val_coreengine_b.fighterNameBuffer);
                    (CoreEngine.val_encodedtextbuffer_q = var53);
                    let var37 = CoreEngine.val_coreengine_b.actorCounterE;
                    if ((CoreEngine.val_coreengine_b.actorCounterE) !== (CoreEngine.val_long_c)) {
                        if ((CoreEngine.val_long_d) === (0)) {
                            (CoreEngine.val_long_f = 1000);
                            (CoreEngine.val_long_e = CoreEngine.val_long_c);
                            (CoreEngine.val_long_d = var37);
                        } else {
                            (CoreEngine.val_long_f = 0);
                            (CoreEngine.val_long_e = CoreEngine.val_long_d);
                        }
                    }
                    (CoreEngine.val_long_c = var37);
                    CoreEngine.exec_A_to_void();
                    CoreEngine.renderBackground();
                }
                if ((CoreEngine.val_int_dL) !== (14)) {
                    CoreEngine.exec_a_byte_byte_to_void(CoreEngine.val_byte_s, CoreEngine.val_byte_t);
                }
        }
    }
    static renderHUD() {
        for ((CoreEngine.val_int_eC = 0); (CoreEngine.val_int_eC < 3); CoreEngine.val_int_eC++) {
            for ((CoreEngine.val_int_eB = 0); (CoreEngine.val_int_eB < CoreEngine.val_arr_int_bk[CoreEngine.val_int_eC]); CoreEngine.val_int_eB++) {
                let var0 = null;
                if ((((CoreEngine.val_arr_int_bm = (var0 = CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB]).getBounds())) !== (null) && var0.isAlive())) {
                    return;
                }
            }
        }
        for ((CoreEngine.val_int_eC = 0); (CoreEngine.val_int_eC < 3); CoreEngine.val_int_eC++) {
            for ((CoreEngine.val_int_eB = 0); (CoreEngine.val_int_eB < CoreEngine.val_arr_int_bk[CoreEngine.val_int_eC]); CoreEngine.val_int_eB++) {
                let var6 = null;
                if ((((CoreEngine.val_arr_int_bm = (var6 = CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB]).getBounds())) !== (null) && !var6.isAlive())) {
                    for (let var7 = 0; (var7 < var6.getStateValue(0)); var7++) {
                        if (var6.checkHitBox(0, CoreEngine.val_arr_int_bl, CoreEngine.val_int_eD)) {
                            (CoreEngine.val_int_eE = CoreEngine.val_int_eD);
                            (CoreEngine.val_int_eD += 5);
                            let var1 = CoreEngine.val_arr_int_bq;
                            for (let var2 = (CoreEngine.val_int_eC + 1); (var2 < 3); var2++) {
                                for (let var3 = 0; (var3 < CoreEngine.val_arr_int_bk[var2]); var3++) {
                                    (CoreEngine.val_arr_int_bo = CoreEngine.val_arr_arr_entityinterface_a[var2][var3].getBounds());
                                    for (let var4 = 0; (var4 < CoreEngine.val_arr_arr_entityinterface_a[var2][var3].getStateValue(0)); var4++) {
                                        if (CoreEngine.val_arr_arr_entityinterface_a[var2][var3].checkHitBox(0, CoreEngine.val_arr_int_bl, CoreEngine.val_int_eD)) {
                                            let var10000 = CoreEngine.exec_a_int_int_int_int_to_int(CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 3)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)], CoreEngine.val_arr_int_bl[CoreEngine.val_int_eD]);
                                            let var5 = 0;
                                            (var1[0] = 0);
                                            (var1[1] = 0);
                                            (var1[2] = 0);
                                            (var1[3] = 0);
                                            (CoreEngine.val_arr_int_bn = CoreEngine.val_arr_arr_entityinterface_a[var2][var3].getBounds());
                                            switch (var10000) {
                                                case 1:
                                                    (var1[0] = ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)]) - 1));
                                                    if (((CoreEngine.val_arr_int_bn[10] ^ 1)) === (1)) {
                                                        (var1[1] = (CoreEngine.val_arr_int_bl[CoreEngine.val_int_eD] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 3)]));
                                                    }
                                                    (var5 = 1);
                                                    break;
                                                case 2:
                                                    (var1[0] = ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)]) + 1));
                                                    if (((CoreEngine.val_arr_int_bn[10] ^ 1)) === (1)) {
                                                        (var1[1] = (CoreEngine.val_arr_int_bl[CoreEngine.val_int_eD] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 3)]));
                                                    }
                                                    (var5 = 1);
                                                    break;
                                                case 3:
                                                    if ((((CoreEngine.val_arr_int_bn[10] & 4)) === (4) && ((CoreEngine.val_arr_int_bn[10] & 8)) === (8))) {
                                                        (var1[0] = (((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)]) >> 1) - 1));
                                                        (var1[2] = (((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)]) >> 1) + 1));
                                                    } else {
                                                        if (((CoreEngine.val_arr_int_bn[10] & 4)) === (4)) {
                                                            (var1[0] = ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)]) - 1));
                                                        } else {
                                                            if (((CoreEngine.val_arr_int_bn[10] & 8)) === (8)) {
                                                                (var1[2] = ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)]) + 1));
                                                            }
                                                        }
                                                    }
                                                    (var5 = 1);
                                                    break;
                                                case 4:
                                                    if ((((CoreEngine.val_arr_int_bn[10] & 8)) === (8) && ((CoreEngine.val_arr_int_bn[10] & 4)) === (4))) {
                                                        (var1[0] = (((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)]) >> 1) + 1));
                                                        (var1[2] = (((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)]) >> 1) - 1));
                                                    } else {
                                                        if (((CoreEngine.val_arr_int_bn[10] & 8)) === (8)) {
                                                            (var1[0] = ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)]) + 1));
                                                        } else {
                                                            if (((CoreEngine.val_arr_int_bn[10] & 4)) === (4)) {
                                                                (var1[2] = ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)]) - 1));
                                                            }
                                                        }
                                                    }
                                                    (var5 = 1);
                                                    break;
                                                case 5:
                                                    (var1[2] = ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)]) + 1));
                                                    if (((CoreEngine.val_arr_int_bn[10] ^ 1)) === (1)) {
                                                        (var1[3] = (CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 3)]));
                                                    }
                                                    (var5 = 1);
                                                    break;
                                                case 6:
                                                    (var1[2] = ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)]) - 1));
                                                    if (((CoreEngine.val_arr_int_bn[10] ^ 1)) === (1)) {
                                                        (var1[3] = (CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 3)]));
                                                    }
                                                    (var5 = 1);
                                            }
                                            if ((var5) !== (0)) {
                                                (var5 = (CoreEngine.val_arr_int_bm[0] + (var1[0] << 8)));
                                                (CoreEngine.val_arr_int_bm[0] = var5);
                                                (var5 = (CoreEngine.val_arr_int_bm[1] + (var1[1] << 8)));
                                                (CoreEngine.val_arr_int_bm[1] = var5);
                                                if ((CoreEngine.val_arr_int_bm[7]) !== (0)) {
                                                    (var5 = (CoreEngine.val_arr_int_bm[8] + (var1[0] << 8)));
                                                    (CoreEngine.val_arr_int_bm[8] = var5);
                                                    (var5 = (CoreEngine.val_arr_int_bm[9] + (var1[1] << 8)));
                                                    (CoreEngine.val_arr_int_bm[9] = var5);
                                                }
                                                if ((CoreEngine.val_arr_int_bm[7]) !== (0)) {
                                                    (var5 = (CoreEngine.val_arr_int_bm[8] + (var1[2] << 8)));
                                                    (CoreEngine.val_arr_int_bm[8] = var5);
                                                    (var5 = (CoreEngine.val_arr_int_bm[9] + (var1[3] << 8)));
                                                    (CoreEngine.val_arr_int_bm[9] = var5);
                                                }
                                                if ((CoreEngine.val_arr_int_bm[1] > 0)) {
                                                    CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].applyAction(8);
                                                    (CoreEngine.val_arr_int_bm[1] = 0);
                                                } else {
                                                    if ((CoreEngine.val_arr_int_bm[1] < CoreEngine.val_int_eF)) {
                                                        CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].applyAction(1);
                                                        (CoreEngine.val_arr_int_bm[1] = CoreEngine.val_int_eF);
                                                    }
                                                }
                                                if ((CoreEngine.val_arr_int_bm[0] < CoreEngine.val_int_eG)) {
                                                    CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].applyAction(2);
                                                    (CoreEngine.val_arr_int_bm[0] = CoreEngine.val_int_eG);
                                                } else {
                                                    if ((CoreEngine.val_arr_int_bm[0] > CoreEngine.val_int_eH)) {
                                                        CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].applyAction(4);
                                                        (CoreEngine.val_arr_int_bm[0] = CoreEngine.val_int_eH);
                                                    }
                                                }
                                                (var5 = (CoreEngine.val_arr_int_bo[0] + (var1[2] << 8)));
                                                (CoreEngine.val_arr_int_bo[0] = var5);
                                                (var5 = (CoreEngine.val_arr_int_bo[1] + (var1[3] << 8)));
                                                (CoreEngine.val_arr_int_bo[1] = var5);
                                                if ((CoreEngine.val_arr_int_bo[1] > 0)) {
                                                    (CoreEngine.val_arr_int_bo[1] = 0);
                                                } else {
                                                    if ((CoreEngine.val_arr_int_bo[1] < CoreEngine.val_int_eF)) {
                                                        (CoreEngine.val_arr_int_bo[1] = CoreEngine.val_int_eF);
                                                    }
                                                }
                                                if ((CoreEngine.val_arr_int_bo[0] < CoreEngine.val_int_eG)) {
                                                    (CoreEngine.val_arr_int_bo[0] = CoreEngine.val_int_eG);
                                                } else {
                                                    if ((CoreEngine.val_arr_int_bo[0] > CoreEngine.val_int_eH)) {
                                                        (CoreEngine.val_arr_int_bo[0] = CoreEngine.val_int_eH);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            (CoreEngine.val_int_eD -= 5);
                        }
                    }
                }
            }
        }
    }
    static renderBackground() {
        let var0 = null;
        (CoreEngine.val_int_dM = (CoreEngine.val_int_dM + CoreEngine.val_int_e));
        (var0 = CoreEngine.exec_a_to_coreengine());
        label356: switch (CoreEngine.val_int_dL) {
            case 0:
                if ((((CoreEngine.val_int_dM - CoreEngine.val_int_aA) > 2500) || CoreEngine.val_bool_am)) {
                    (CoreEngine.val_int_aA = 0);
                    CoreEngine.drawTextLabel(1);
                }
                break;
            case 1:
                if ((CoreEngine.val_int_dM >= 1500)) {
                    CoreEngine.drawTextLabel(2);
                }
                break;
            case 2:
                if (CoreEngine.exec_z_to_bool()) {
                    CoreEngine.drawTextLabel(11);
                } else {
                    if (((CoreEngine.val_coreengine_b.currentHealth <= 0) || (CoreEngine.val_coreengine_c.currentHealth <= 0))) {
                        if (((CoreEngine.val_coreengine_c.currentHealth <= 0) && CoreEngine.exec_A_to_bool())) {
                            let var5 = false;
                            if ((CoreEngine.exec_A_to_bool() && (CoreEngine.val_int_ec < (CoreEngine.val_arr_byte_k.length - 1)))) {
                                (var5 = true);
                            } else {
                                (var5 = false);
                            }
                            if (var5) {
                                CoreEngine.drawTextLabel(13);
                                break;
                            }
                        }
                        let var6 = false;
                        if (CoreEngine.val_bool_am) {
                            if (((CoreEngine.val_int_dQ) !== (6) && CoreEngine.val_coreengine_c.exec_i_to_bool())) {
                                (var6 = true);
                            } else {
                                (var6 = false);
                            }
                        } else {
                            if ((((CoreEngine.val_int_dQ) === (6) || (CoreEngine.val_int_dR) === (6)) || (((CoreEngine.val_int_dU <= 0) || !CoreEngine.val_coreengine_c.exec_i_to_bool()) && ((CoreEngine.val_int_dV <= 0) || !CoreEngine.val_coreengine_b.exec_i_to_bool())))) {
                                (var6 = false);
                            } else {
                                (var6 = true);
                            }
                        }
                        if (var6) {
                            (CoreEngine.val_bool_aO = false);
                            CoreEngine.drawTextLabel(3);
                        } else {
                            if ((((CoreEngine.exec_a_to_coreengine()) === (CoreEngine.val_coreengine_b) && (CoreEngine.val_int_dU > 0)) && (CoreEngine.exec_b_coreengine_to_coreengine(CoreEngine.exec_a_to_coreengine()).characterId) === (6))) {
                                if ((CoreEngine.val_int_cA) === ((CoreEngine.exec_m_to_int() - 1))) {
                                    (var6 = true);
                                } else {
                                    (var6 = false);
                                }
                                if (var6) {
                                    CoreEngine.exec_ac_to_void();
                                    CoreEngine.drawTextLabel(6);
                                    break;
                                }
                            }
                            CoreEngine.drawTextLabel(6);
                        }
                    }
                }
                break;
            case 3:
                let var1 = 0;
                if (((CoreEngine.val_int_bx) !== (0) && (CoreEngine.val_int_cz) !== (0))) {
                    (var1 = 1);
                } else {
                    (var1 = 2);
                }
                (var1 *= 3500);
                let var2 = false;
                if (((CoreEngine.val_coreengine_b.actorTimerW) !== (28) && (CoreEngine.val_coreengine_c.actorTimerW) !== (28))) {
                    (var2 = false);
                } else {
                    (var2 = true);
                }
                if (var2) {
                    (CoreEngine.val_int_eb = 1);
                    CoreEngine.drawTextLabel(4);
                } else {
                    if (((CoreEngine.val_coreengine_b.actorTimerW) !== (33) && (CoreEngine.val_coreengine_c.actorTimerW) !== (33))) {
                        (var2 = false);
                    } else {
                        (var2 = true);
                    }
                    if (var2) {
                        (CoreEngine.val_int_eb = 2);
                        CoreEngine.drawTextLabel(4);
                    } else {
                        if (((((CoreEngine.val_int_dM - CoreEngine.val_int_aA) >= var1) && !CoreEngine.val_bool_aC) || (((CoreEngine.val_coreengine_e) !== (null) && CoreEngine.val_bool_ay) && CoreEngine.val_bool_az))) {
                            (CoreEngine.val_int_aA = 0);
                            let var12 = null;
                            if (((var12 = CoreEngine.exec_b_coreengine_to_coreengine(var0)).actorTimerW) === (22)) {
                                var12.updateActor(12);
                                (var12.val_bool_s = true);
                            }
                            CoreEngine.drawTextLabel(6);
                        }
                    }
                }
                break;
            case 4:
                if (CoreEngine.val_bool_aO) {
                    CoreEngine.drawTextLabel(6);
                }
                break;
            case 5:
                if (CoreEngine.val_bool_at) {
                    CoreEngine.drawTextLabel(15);
                }
                (CoreEngine.val_int_ee = (CoreEngine.val_int_ee + CoreEngine.val_int_e));
                switch (CoreEngine.val_int_ed) {
                    case 0:
                        if ((((CoreEngine.val_coreengine_c.exec_h_to_bool() && CoreEngine.val_coreengine_c.actorActiveFlag) || (CoreEngine.val_coreengine_c.actorTimerW) === (22)) || (CoreEngine.val_coreengine_c.actorTimerW) === (102))) {
                            CoreEngine.val_int_ed++;
                            (CoreEngine.val_int_ee = 0);
                        }
                        break label356;
                    case 1:
                        if ((CoreEngine.val_int_ee > 500)) {
                            CoreEngine.exec_a_byte_bool_to_void((((47) << 24) >> 24), false);
                            CoreEngine.exec_M_int_to_void(2000);
                            CoreEngine.val_int_ed++;
                            (CoreEngine.val_int_ee = 0);
                            (CoreEngine.val_int_eg = 1);
                        }
                        break label356;
                    case 2:
                        if ((CoreEngine.val_int_ee > 2000)) {
                            CoreEngine.val_int_ed++;
                            (CoreEngine.val_int_eg = CoreEngine.val_spritepartsequence_r.getPartXOffset(0));
                        }
                        break label356;
                    case 3:
                        (CoreEngine.val_int_ef = 1);
                        CoreEngine.val_int_ed++;
                        break label356;
                    case 4:
                        if ((((CoreEngine.val_int_ef & 65532) >>> 2)) === ((CoreEngine.val_spritepartsequence_q.partOffsets.length - 2))) {
                            CoreEngine.val_int_ed++;
                            (CoreEngine.val_int_ee = 0);
                        }
                        break label356;
                    case 5:
                        if ((CoreEngine.val_int_ee > 1000)) {
                            CoreEngine.val_int_ed++;
                            (CoreEngine.val_int_ee = 0);
                        }
                        break label356;
                    case 6:
                        if ((CoreEngine.val_int_ee > 1000)) {
                            CoreEngine.val_int_ed++;
                            (CoreEngine.val_int_ee = 0);
                        }
                        break label356;
                    case 7:
                        if ((CoreEngine.val_int_ee > 1000)) {
                            CoreEngine.val_int_ed++;
                            (CoreEngine.val_int_ee = 0);
                        }
                        break label356;
                    case 8:
                        if ((CoreEngine.val_int_ee > 1000)) {
                            CoreEngine.val_int_ed++;
                            (CoreEngine.val_int_ee = 0);
                        }
                        break label356;
                    case 9:
                        if ((CoreEngine.val_int_ee > 1000)) {
                            CoreEngine.val_int_ed++;
                            (CoreEngine.val_int_ee = 0);
                        }
                        break label356;
                    case 10:
                        if ((CoreEngine.val_int_ee > 3000)) {
                            CoreEngine.drawTextLabel(15);
                        }
                    default:
                        break label356;
                }
            case 6:
                if (((CoreEngine.val_int_dM - CoreEngine.val_int_aA) > 1500)) {
                    (CoreEngine.val_int_aA = 0);
                    CoreEngine.drawTextLabel(7);
                }
                break;
            case 7:
                if (((CoreEngine.val_int_dM - CoreEngine.val_int_aA) > 1000)) {
                    if ((!CoreEngine.val_bool_am && (CoreEngine.exec_a_to_coreengine().layerDepth) !== (2))) {
                        CoreEngine.drawTextLabel(8);
                    } else {
                        CoreEngine.exec_V_to_void();
                    }
                }
                break;
            case 8:
                if (((CoreEngine.val_int_dM - CoreEngine.val_int_aA) > 2000)) {
                    (CoreEngine.val_int_aA = 0);
                    CoreEngine.exec_V_to_void();
                }
                break;
            case 9:
                if (((CoreEngine.val_int_dM - CoreEngine.val_int_aA) > 3500)) {
                    (CoreEngine.val_int_aA = 0);
                    CoreEngine.exec_W_to_void();
                }
                break;
            case 10:
                if (((CoreEngine.val_int_dM - CoreEngine.val_int_aA) > 3500)) {
                    (CoreEngine.val_int_aA = 0);
                    CoreEngine.exec_W_to_void();
                }
                break;
            case 11:
                if ((CoreEngine.val_int_dM > 1500)) {
                    if ((var0) !== (null)) {
                        CoreEngine.drawTextLabel(6);
                    } else {
                        CoreEngine.drawTextLabel(12);
                    }
                }
                break;
            case 12:
                if ((CoreEngine.val_int_dM >= 1500)) {
                    if (((CoreEngine.val_int_dU) !== (2) && (CoreEngine.val_int_dV) !== (2))) {
                        CoreEngine.drawTextLabel(0);
                    } else {
                        CoreEngine.drawTextLabel(15);
                    }
                }
                break;
            case 13:
                if ((CoreEngine.val_coreengine_c.actorLifecycleState) === (2)) {
                    CoreEngine.exec_D_int_to_void(CoreEngine.val_int_dR);
                    CoreEngine.exec_N_int_to_void(CoreEngine.val_coreengine_c.spriteTransformLookupB[0]);
                    CoreEngine.exec_U_to_void();
                    CoreEngine.val_coreengine_c.updateActor(6);
                    CoreEngine.drawTextLabel(2);
                }
                break;
            case 14:
                CoreEngine.exec_a_byte_byte_to_void((((1) << 24) >> 24), (((2) << 24) >> 24));
                if (CoreEngine.val_bool_at) {
                    (CoreEngine.val_bool_aO = false);
                    CoreEngine.exec_z_int_to_void(2);
                } else {
                    if (CoreEngine.val_bool_au) {
                        (CoreEngine.val_bool_ax = true);
                    }
                }
                break;
            case 15:
                if (CoreEngine.exec_x_to_bool()) {
                    (CoreEngine.val_bool_ax = true);
                } else {
                    CoreEngine.drawTextLabel(14);
                }
        }
        label259: switch (CoreEngine.val_int_dL) {
            case 0:
                CoreEngine.val_coreengine_b.setActorPosition(-64, 0);
                CoreEngine.val_coreengine_c.setActorPosition(64, 0);
                CoreEngine.updateBattleState();
                CoreEngine.transitionGameState();
                CoreEngine.renderHUD();
                CoreEngine.renderOverlays();
            case 1:
            case 3:
            case 4:
            case 8:
            case 11:
            case 12:
            default:
                break;
            case 2:
                if (CoreEngine.val_bool_am) {
                    if ((CoreEngine.val_int_ei) !== (CoreEngine.val_coreengine_c.currentHealth)) {
                        (CoreEngine.val_int_ei = CoreEngine.val_coreengine_c.currentHealth);
                        (CoreEngine.val_int_eh = 0);
                    }
                    if (((CoreEngine.val_int_eh = (CoreEngine.val_int_eh + CoreEngine.val_int_e)) > 3500)) {
                        (CoreEngine.val_int_eh = 0);
                        (CoreEngine.val_coreengine_c.currentHealth = 100);
                        (CoreEngine.val_int_ei = CoreEngine.val_coreengine_c.currentHealth);
                    }
                }
                if (!CoreEngine.val_bool_am) {
                    (CoreEngine.val_int_dS = (CoreEngine.val_int_dS - CoreEngine.val_int_e));
                }
                for (let var15 = 0; (var15 < 2); var15++) {
                    let var10 = null;
                    if ((var15) === (0)) {
                        (var10 = CoreEngine.val_coreengine_b);
                    } else {
                        (var10 = CoreEngine.val_coreengine_c);
                    }
                    (var0 = var10);
                    if (((((var10.actorCounterB >= 4) && (CoreEngine.exec_b_coreengine_to_coreengine(var10).actorTimerW) !== (21)) && (CoreEngine.exec_b_coreengine_to_coreengine(var10).actorTimerW) !== (26)) && (CoreEngine.exec_b_coreengine_to_coreengine(var10).actorTimerW) !== (30))) {
                        CoreEngine.exec_c_coreengine_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var10));
                    }
                    if (((((var0.actorCounterC >= 4) && (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerW) !== (21)) && (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerW) !== (26)) && (CoreEngine.exec_b_coreengine_to_coreengine(var0).actorTimerW) !== (30))) {
                        CoreEngine.exec_c_coreengine_to_void(CoreEngine.exec_b_coreengine_to_coreengine(var0));
                        (var0.actorCounterC = 0);
                    }
                }
                break;
            case 5:
                if ((CoreEngine.val_int_ed <= 0)) {
                    CoreEngine.exec_i_int_int_to_void(CoreEngine.val_coreengine_c.exec_a_to_int(), 0);
                } else {
                    CoreEngine.exec_a_int_int_bool_to_void(0, 0, true);
                }
                if ((CoreEngine.val_int_ed < 7)) {
                    (CoreEngine.val_int_eW = 300);
                }
                switch (CoreEngine.val_int_ed) {
                    case 0:
                    case 5:
                        let var14 = false;
                        if (!CoreEngine.val_bool_aB) {
                            (var14 = true);
                        } else {
                            (var14 = false);
                        }
                        (CoreEngine.val_bool_aB = var14);
                        break label259;
                    case 1:
                    case 7:
                        (CoreEngine.val_bool_aB = true);
                        break label259;
                    case 2:
                        (CoreEngine.val_bool_aB = false);
                        (CoreEngine.val_int_eg = CoreEngine.val_spritepartsequence_r.getPartYOffset(CoreEngine.val_int_eg, CoreEngine.val_int_e));
                    case 3:
                    default:
                        break label259;
                    case 4:
                        (CoreEngine.val_bool_aB = false);
                        (CoreEngine.val_int_ef = CoreEngine.val_spritepartsequence_q.getPartYOffset(CoreEngine.val_int_ef, CoreEngine.val_int_e));
                        break label259;
                    case 6:
                        (CoreEngine.val_bool_aB = true);
                        (CoreEngine.val_int_ef = CoreEngine.val_spritepartsequence_q.getPartYOffset(CoreEngine.val_int_ef, CoreEngine.val_int_e));
                        break label259;
                    case 8:
                        (CoreEngine.val_bool_aB = false);
                        break label259;
                }
            case 6:
            case 7:
                if ((((var0.actorTimerW) !== (20) && ((((var0.actorTimerW) === (0) || (var0.actorTimerW) === (3)) || (var0.actorTimerW) === (1)) || (var0.actorTimerW) === (16))) && !CoreEngine.exec_z_to_bool())) {
                    var0.updateActor(20);
                }
                break;
            case 9:
                (CoreEngine.val_int_dX = CoreEngine.val_spritepartsequence_o.getPartYOffset(CoreEngine.val_int_dX, CoreEngine.val_int_e));
                break;
            case 10:
                (CoreEngine.val_int_dY = CoreEngine.val_spritepartsequence_p.getPartYOffset(CoreEngine.val_int_dY, CoreEngine.val_int_e));
                break;
            case 13:
                if (((CoreEngine.val_coreengine_c.actorLifecycleState) === (0) && (CoreEngine.val_int_dM >= 750))) {
                    let var8 = CoreEngine.val_int_ec;
                    let var13 = CoreEngine.val_arr_byte_k[var8];
                    if ((CoreEngine.val_coreengine_b.actorCurrentAnimIndex) === (1)) {
                        (var8 = (CoreEngine.val_int_eH >> 8));
                    } else {
                        (var8 = (CoreEngine.val_int_eG >> 8));
                    }
                    let var10003 = -CoreEngine.val_coreengine_b.actorCurrentAnimIndex;
                    CoreEngine.exec_h_byte_to_void(CoreEngine.val_arr_byte_o[var13]);
                    (CoreEngine.val_coreengine_c = CoreEngine.spawnActor(var13, var8, 0, var10003, 2, 0, true, 1));
                    (CoreEngine.val_int_dR = var13);
                    CoreEngine.exec_U_to_void();
                }
        }
        (CoreEngine.val_coreengine_e = null);
    }
    static drawTextLabel(var0) {
        switch (CoreEngine.val_int_dL) {
            case 2:
                CoreEngine.exec_ai_to_void();
        }
        (CoreEngine.val_bool_ay = false);
        (CoreEngine.val_bool_az = false);
        (CoreEngine.val_int_dM = 0);
        switch (var0) {
            case 0:
                CoreEngine.exec_Z_to_void();
                CoreEngine.exec_P_to_void();
                CoreEngine.exec_S_to_void();
                CoreEngine.val_coreengine_b.setActorPosition(-64, 0);
                CoreEngine.val_coreengine_b.setActorAnimation(1);
                (CoreEngine.val_coreengine_b.currentHealth = 100);
                (CoreEngine.val_coreengine_b.superMeterEnergy = 25600);
                CoreEngine.val_coreengine_b.updateActor(0);
                (CoreEngine.val_coreengine_b.val_bool_p = false);
                CoreEngine.exec_a_arr_byte_to_void(CoreEngine.val_coreengine_b.scratchpadBuffer);
                (CoreEngine.val_coreengine_b.val_bool_A = false);
                (CoreEngine.val_coreengine_b.actorTimerU = 0);
                (CoreEngine.val_coreengine_b.actorTimerT = 0);
                (CoreEngine.val_coreengine_b.actorActiveFlag = true);
                (CoreEngine.val_coreengine_b.val_bool_G = false);
                (CoreEngine.val_coreengine_b.val_bool_y = true);
                (CoreEngine.val_coreengine_b.actorTimerZ = 99000);
                (CoreEngine.val_coreengine_b.actorCounterA = 99000);
                (CoreEngine.val_coreengine_b.actorCounterC = 0);
                (CoreEngine.val_coreengine_b.actorCounterD = 0);
                (CoreEngine.val_coreengine_b.actorCounterB = 0);
                CoreEngine.val_coreengine_b.exec_r_int_to_void(0);
                CoreEngine.val_coreengine_c.setActorPosition(64, 0);
                CoreEngine.val_coreengine_c.setActorAnimation(-1);
                (CoreEngine.val_coreengine_c.currentHealth = 100);
                (CoreEngine.val_coreengine_c.superMeterEnergy = 25600);
                CoreEngine.val_coreengine_c.updateActor(0);
                (CoreEngine.val_coreengine_c.val_bool_p = false);
                CoreEngine.exec_a_arr_byte_to_void(CoreEngine.val_coreengine_c.scratchpadBuffer);
                (CoreEngine.val_coreengine_c.val_bool_A = false);
                (CoreEngine.val_coreengine_c.actorTimerU = 0);
                (CoreEngine.val_coreengine_c.actorTimerT = 0);
                (CoreEngine.val_coreengine_c.actorActiveFlag = true);
                (CoreEngine.val_coreengine_c.val_bool_G = false);
                (CoreEngine.val_coreengine_c.val_bool_y = true);
                (CoreEngine.val_coreengine_c.actorTimerZ = 99000);
                (CoreEngine.val_coreengine_c.actorCounterA = 99000);
                (CoreEngine.val_coreengine_c.actorCounterC = 0);
                (CoreEngine.val_coreengine_c.actorCounterD = 0);
                (CoreEngine.val_coreengine_c.actorCounterB = 0);
                CoreEngine.val_coreengine_c.exec_r_int_to_void(0);
                (CoreEngine.val_bool_aw = true);
                (CoreEngine.val_int_dc = 0);
                (CoreEngine.val_int_dd = 0);
                (CoreEngine.val_int_de = 0);
                (CoreEngine.val_int_df = 0);
                CoreEngine.exec_ai_to_void();
                (CoreEngine.val_int_dS = 99000);
                CoreEngine.val_int_dT++;
                CoreEngine.exec_a_int_int_bool_to_void(0, 0, true);
                CoreEngine.exec_K_int_to_void(0);
                if (!CoreEngine.val_bool_am) {
                    switch (CoreEngine.val_int_dT) {
                        case 1:
                            CoreEngine.exec_a_byte_bool_to_void((((40) << 24) >> 24), false);
                            break;
                        case 2:
                            CoreEngine.exec_a_byte_bool_to_void((((41) << 24) >> 24), false);
                            break;
                        case 3:
                            CoreEngine.exec_a_byte_bool_to_void((((42) << 24) >> 24), false);
                    }
                }
                (CoreEngine.val_encodedtextbuffer_x = CoreEngine.val_encodedtextbuffer_u.substring(CoreEngine.val_int_dT));
                if (CoreEngine.exec_A_to_bool()) {
                    (CoreEngine.val_int_ec = 0);
                    (CoreEngine.val_coreengine_c.val_bool_p = false);
                    (CoreEngine.val_coreengine_c.val_bool_o = false);
                    CoreEngine.val_coreengine_c.setCharacterId(CoreEngine.val_arr_byte_k[0]);
                    CoreEngine.exec_D_int_to_void(CoreEngine.val_coreengine_c.characterId);
                    CoreEngine.exec_N_int_to_void(CoreEngine.val_arr_arr_short_g[CoreEngine.val_coreengine_c.characterId][0]);
                    CoreEngine.exec_U_to_void();
                }
                break;
            case 1:
                (CoreEngine.val_encodedtextbuffer_A = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(24, null));
                CoreEngine.exec_a_byte_bool_to_void((((14) << 24) >> 24), false);
                break;
            case 2:
                (CoreEngine.val_coreengine_b.val_bool_p = true);
                (CoreEngine.val_coreengine_c.val_bool_p = true);
                break;
            case 3:
                (CoreEngine.val_coreengine_b.val_bool_p = false);
                (CoreEngine.val_coreengine_c.val_bool_p = false);
                (CoreEngine.exec_a_to_coreengine().val_bool_p = true);
                let var8 = false;
                switch (CoreEngine.exec_b_coreengine_to_coreengine(CoreEngine.exec_a_to_coreengine()).characterId) {
                    case 2:
                        (var8 = false);
                        break;
                    case 3:
                        (var8 = false);
                        break;
                    default:
                        (var8 = true);
                }
                if (var8) {
                    (CoreEngine.val_encodedtextbuffer_G = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(64, null));
                    CoreEngine.exec_a_byte_bool_to_void((((16) << 24) >> 24), false);
                } else {
                    (CoreEngine.val_encodedtextbuffer_G = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(65, null));
                    CoreEngine.exec_a_byte_bool_to_void((((15) << 24) >> 24), false);
                }
                break;
            case 4:
                CoreEngine.exec_K_int_to_void(1);
                (CoreEngine.val_coreengine_b.val_bool_p = false);
                (CoreEngine.val_coreengine_c.val_bool_p = false);
                (CoreEngine.val_bool_aw = false);
                break;
            case 5:
                (CoreEngine.val_coreengine_b.currentAnimSet = null);
                (CoreEngine.val_byte_s = 3);
                (CoreEngine.val_byte_t = 0);
                CoreEngine.exec_ac_to_void();
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                (CoreEngine.val_encodedtextbuffer_B = CoreEngine.val_encodedtextbuffer_v.copyFrom(CoreEngine.exec_a_to_coreengine().fighterNameBuffer));
                (CoreEngine.val_arr_short_g = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short((CoreEngine.val_encodedtextbuffer_L = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(69, null)), (CoreEngine.val_int_bD - 16)));
                (CoreEngine.val_arr_short_h = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short((CoreEngine.val_encodedtextbuffer_M = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(70, null)), (CoreEngine.val_int_bD - 16)));
                CoreEngine.exec_K_int_to_void(1);
                (CoreEngine.val_int_dU = 2);
                (CoreEngine.val_bool_aB = false);
                (CoreEngine.val_int_ed = 0);
                (CoreEngine.val_int_ee = 0);
                (CoreEngine.val_bool_aw = false);
                (CoreEngine.val_coreengine_b.val_bool_p = false);
                (CoreEngine.val_coreengine_c.val_bool_p = false);
                CoreEngine.exec_i_int_int_to_void(CoreEngine.val_coreengine_c.exec_a_to_int(), 0);
                try {
                    (CoreEngine.val_animationset_q = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217842, -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_spritepartsequence_q = CoreEngine.exec_a_int_int_to_spritepartsequence(134217772, 0));
                    (CoreEngine.val_spritepartsequence_r = CoreEngine.exec_a_int_int_to_spritepartsequence(100663311, 1));
                    CoreEngine.exec_U_to_void();
                    CoreEngine.exec_U_to_void();
                } catch (var4) {

                }
                break;
            case 6:
                switch (CoreEngine.val_int_eb) {
                    case 1:
                        try {
                            let var5 = 0;
                            if (CoreEngine.val_bool_j) {
                                (var5 = 0);
                            } else {
                                (var5 = 3);
                            }
                            (var5 = var5);
                            (CoreEngine.val_animationset_o = CoreEngine.exec_a_int_int_byte_bool_to_animationset(150994955, -1, var5, false));
                            (CoreEngine.val_spritepartsequence_o = CoreEngine.exec_a_int_int_to_spritepartsequence(150994946, 1));
                            (CoreEngine.val_int_dX = 1);
                            (CoreEngine.val_int_dW = CoreEngine.val_spritepartsequence_o.getSequenceHeight(CoreEngine.val_animationset_o));
                            CoreEngine.exec_U_to_void();
                        } catch (var3) {

                        }
                        break;
                    case 2:
                        try {
                            (CoreEngine.val_animationset_p = CoreEngine.exec_a_int_int_byte_bool_to_animationset(150994954, -1, (((0) << 24) >> 24), false));
                            (CoreEngine.val_spritepartsequence_p = CoreEngine.exec_a_int_int_to_spritepartsequence(150994945, 0));
                            (CoreEngine.val_int_dY = 1);
                            CoreEngine.exec_U_to_void();
                        } catch (var2) {

                        }
                }
                let var7 = null;
                if (((var7 = CoreEngine.exec_a_to_coreengine())) === (CoreEngine.val_coreengine_c)) {
                    CoreEngine.val_int_dV++;
                } else {
                    if ((var7) === (CoreEngine.val_coreengine_b)) {
                        CoreEngine.val_int_dU++;
                    }
                }
                (CoreEngine.val_coreengine_b.val_bool_p = false);
                (CoreEngine.val_coreengine_c.val_bool_p = false);
                if ((var7) !== (null)) {
                    CoreEngine.exec_a_byte_bool_to_void(CoreEngine.val_arr_byte_o[var7.characterId], false);
                }
                if ((var7) !== (null)) {
                    (CoreEngine.val_encodedtextbuffer_B = CoreEngine.val_encodedtextbuffer_v.copyFrom(var7.fighterNameBuffer));
                } else {
                    (CoreEngine.val_encodedtextbuffer_B = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(57, null));
                }
                break;
            case 7:
                if ((CoreEngine.exec_a_to_coreengine()) !== (null)) {
                    CoreEngine.exec_a_byte_bool_to_void((((54) << 24) >> 24), false);
                }
                break;
            case 8:
                let var1 = false;
                if (((CoreEngine.exec_a_to_coreengine()) !== (null) && (CoreEngine.exec_a_to_coreengine().currentHealth) === (100))) {
                    (var1 = true);
                } else {
                    (var1 = false);
                }
                (CoreEngine.val_int_dZ = (1000 * Math.trunc((CoreEngine.val_int_dS) / (1000))));
                let var10 = CoreEngine.exec_a_to_coreengine();
                (var10.actorCounterE = (var10.actorCounterE + CoreEngine.val_int_dZ));
                (CoreEngine.val_encodedtextbuffer_E = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(62, null));
                (CoreEngine.val_encodedtextbuffer_F = new EncodedTextBuffer(6)).appendInt(CoreEngine.val_int_dZ);
                if (var1) {
                    CoreEngine.exec_a_byte_bool_to_void((((17) << 24) >> 24), false);
                    if ((CoreEngine.val_bool_aA && (CoreEngine.val_int_dT) === (2))) {
                        (CoreEngine.val_int_ea = 500000);
                        (var10 = CoreEngine.exec_a_to_coreengine());
                        (var10.actorCounterE = (var10.actorCounterE + CoreEngine.val_int_ea));
                        (CoreEngine.val_encodedtextbuffer_C = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(61, null));
                    } else {
                        (CoreEngine.val_int_ea = 200000);
                        (var10 = CoreEngine.exec_a_to_coreengine());
                        (var10.actorCounterE = (var10.actorCounterE + CoreEngine.val_int_ea));
                        (CoreEngine.val_encodedtextbuffer_C = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(60, null));
                        if ((CoreEngine.val_int_dT) === (1)) {
                            (CoreEngine.val_bool_aA = true);
                        }
                    }
                } else {
                    (CoreEngine.val_int_ea = (800 * CoreEngine.exec_a_to_coreengine().currentHealth));
                    (var10 = CoreEngine.exec_a_to_coreengine());
                    (var10.actorCounterE = (var10.actorCounterE + CoreEngine.val_int_ea));
                    (CoreEngine.val_encodedtextbuffer_C = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(63, null));
                }
                (CoreEngine.val_encodedtextbuffer_D = new EncodedTextBuffer(6)).appendInt(CoreEngine.val_int_ea);
                break;
            case 9:
                CoreEngine.exec_a_byte_bool_to_void((((13) << 24) >> 24), true);
                if ((CoreEngine.exec_a_to_coreengine().layerDepth) === (0)) {
                    (CoreEngine.exec_a_to_coreengine().actorCounterE += 100000);
                    (CoreEngine.val_encodedtextbuffer_I = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(66, null));
                    (CoreEngine.val_encodedtextbuffer_H = new EncodedTextBuffer(6)).appendInt(100000);
                } else {
                    (CoreEngine.val_encodedtextbuffer_I = new EncodedTextBuffer());
                    (CoreEngine.val_encodedtextbuffer_H = new EncodedTextBuffer());
                }
                break;
            case 10:
                CoreEngine.exec_a_byte_bool_to_void((((5) << 24) >> 24), true);
                if ((CoreEngine.exec_a_to_coreengine().layerDepth) === (0)) {
                    (CoreEngine.exec_a_to_coreengine().actorCounterE += 100000);
                    (CoreEngine.val_encodedtextbuffer_J = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(67, null));
                    (CoreEngine.val_encodedtextbuffer_K = new EncodedTextBuffer(6)).appendInt(100000);
                } else {
                    (CoreEngine.val_encodedtextbuffer_J = new EncodedTextBuffer());
                    (CoreEngine.val_encodedtextbuffer_K = new EncodedTextBuffer());
                }
                break;
            case 11:
                (CoreEngine.val_encodedtextbuffer_y = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(58, null));
                break;
            case 12:
                (CoreEngine.val_encodedtextbuffer_z = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(57, null));
                CoreEngine.val_int_dU++;
                CoreEngine.val_int_dV++;
                break;
            case 13:
                CoreEngine.exec_P_to_void();
                CoreEngine.exec_S_to_void();
                CoreEngine.exec_g_int_int_to_void(CoreEngine.val_coreengine_c.exec_a_to_int(), CoreEngine.val_coreengine_c.exec_b_to_int());
                CoreEngine.val_coreengine_c.setActorLifecycle(3);
                if ((CoreEngine.val_coreengine_c.characterId) !== (CoreEngine.val_coreengine_b.characterId)) {
                    CoreEngine.exec_E_int_to_void(CoreEngine.val_arr_arr_short_g[CoreEngine.val_coreengine_c.characterId][0]);
                    CoreEngine.exec_J_int_to_void(CoreEngine.val_coreengine_c.characterId);
                }
                CoreEngine.exec_U_to_void();
                CoreEngine.val_int_ec++;
                break;
            case 14:
                (CoreEngine.val_encodedtextbuffer_O = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(85, null));
                (CoreEngine.val_int_q = 1);
                (CoreEngine.val_long_c = CoreEngine.val_long_g);
                (CoreEngine.val_long_d = CoreEngine.val_long_g);
                (CoreEngine.val_long_e = CoreEngine.val_long_g);
                CoreEngine.exec_ah_to_void();
                CoreEngine.exec_U_to_void();
            case 15:
        }
        (CoreEngine.val_int_dL = var0);
    }
    static renderOverlays() {
        (CoreEngine.val_int_eJ = -1);
        for ((CoreEngine.val_int_eC = 0); (CoreEngine.val_int_eC < 3); CoreEngine.val_int_eC++) {
            for ((CoreEngine.val_int_eB = 0); (CoreEngine.val_int_eB < CoreEngine.val_arr_int_bk[CoreEngine.val_int_eC]); CoreEngine.val_int_eB++) {
                for (let var0 = 0; (var0 < CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].getStateValue(1)); var0++) {
                    if (CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].checkHitBox(1, CoreEngine.val_arr_int_bl, CoreEngine.val_int_eD)) {
                        (CoreEngine.val_int_eE = CoreEngine.val_int_eD);
                        (CoreEngine.val_int_eD += 5);
                        let var1 = false;
                        for (let var2 = 0; (var2 < 3); var2++) {
                            if ((var2) !== (CoreEngine.val_int_eC)) {
                                for (let var3 = 0; (var3 < CoreEngine.val_arr_int_bk[var2]); var3++) {
                                    (CoreEngine.val_arr_int_bo = CoreEngine.val_arr_arr_entityinterface_a[var2][var3].getBounds());
                                    for (let var4 = 0; (var4 < CoreEngine.val_arr_arr_entityinterface_a[var2][var3].getStateValue(0)); var4++) {
                                        if ((CoreEngine.val_arr_arr_entityinterface_a[var2][var3].checkHitBox(0, CoreEngine.val_arr_int_bl, CoreEngine.val_int_eD) && (CoreEngine.exec_a_int_int_int_int_to_int(CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 3)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)], CoreEngine.val_arr_int_bl[CoreEngine.val_int_eD])) !== (0))) {
                                            CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].checkIntersect(CoreEngine.val_arr_int_br);
                                            CoreEngine.exec_a_int_int_int_int_arr_int_to_void(CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 3)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)], CoreEngine.val_arr_int_bl[CoreEngine.val_int_eD], CoreEngine.val_arr_int_bq);
                                            if (!var1) {
                                                CoreEngine.exec_a_arr_int_arr_int_int_int_int_int_to_void(CoreEngine.val_arr_int_br, CoreEngine.val_arr_int_bq, var2, var3, CoreEngine.val_int_eC, CoreEngine.val_int_eB);
                                                (var1 = true);
                                            }
                                        }
                                    }
                                    for (let var5 = 0; (var5 < CoreEngine.val_arr_arr_entityinterface_a[var2][var3].getStateValue(1)); var5++) {
                                        if ((CoreEngine.val_arr_arr_entityinterface_a[var2][var3].checkHitBox(1, CoreEngine.val_arr_int_bl, CoreEngine.val_int_eD) && (CoreEngine.exec_a_int_int_int_int_to_int(CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 3)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)], CoreEngine.val_arr_int_bl[CoreEngine.val_int_eD])) !== (0))) {
                                            CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].checkIntersect(CoreEngine.val_arr_int_br);
                                            CoreEngine.exec_a_int_int_int_int_arr_int_to_void(CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 1)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 3)], CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eD + 2)], CoreEngine.val_arr_int_bl[CoreEngine.val_int_eD], CoreEngine.val_arr_int_bq);
                                            if (!var1) {
                                                CoreEngine.exec_a_arr_int_arr_int_int_int_int_int_to_void(CoreEngine.val_arr_int_br, CoreEngine.val_arr_int_bq, var2, var3, CoreEngine.val_int_eC, CoreEngine.val_int_eB);
                                                (var1 = true);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        (CoreEngine.val_int_eD -= 5);
                    }
                }
            }
        }
        if ((CoreEngine.val_int_eJ) !== (-1)) {
            (CoreEngine.val_arr_int_br[0] = CoreEngine.val_arr_int_bs[CoreEngine.val_int_eJ]);
            (CoreEngine.val_arr_int_br[1] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 1)]);
            (CoreEngine.val_arr_int_br[2] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 2)]);
            (CoreEngine.val_arr_int_br[3] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 3)]);
            (CoreEngine.val_arr_int_br[4] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 4)]);
            (CoreEngine.val_arr_int_br[5] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 5)]);
            (CoreEngine.val_arr_int_br[6] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 6)]);
            (CoreEngine.val_arr_int_br[7] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 7)]);
            (CoreEngine.val_arr_int_bq[0] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 8)]);
            (CoreEngine.val_arr_int_bq[1] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 9)]);
            (CoreEngine.val_arr_int_bq[2] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 10)]);
            (CoreEngine.val_arr_int_bq[3] = CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 11)]);
            CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 12)]][CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 13)]].interactWithEntity(CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 14)]][CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 15)]], CoreEngine.val_arr_int_br);
            CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 14)]][CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eJ + 15)]].updateTick();
            (CoreEngine.val_int_eI = 0);
        } else {
            for (let var6 = 0; (var6 < CoreEngine.val_int_eI); (var6 += 16)) {
                (CoreEngine.val_arr_int_br[0] = CoreEngine.val_arr_int_bs[var6]);
                (CoreEngine.val_arr_int_br[1] = CoreEngine.val_arr_int_bs[(var6 + 1)]);
                (CoreEngine.val_arr_int_br[2] = CoreEngine.val_arr_int_bs[(var6 + 2)]);
                (CoreEngine.val_arr_int_br[3] = CoreEngine.val_arr_int_bs[(var6 + 3)]);
                (CoreEngine.val_arr_int_br[4] = CoreEngine.val_arr_int_bs[(var6 + 4)]);
                (CoreEngine.val_arr_int_br[5] = CoreEngine.val_arr_int_bs[(var6 + 5)]);
                (CoreEngine.val_arr_int_br[6] = CoreEngine.val_arr_int_bs[(var6 + 6)]);
                (CoreEngine.val_arr_int_br[7] = CoreEngine.val_arr_int_bs[(var6 + 7)]);
                (CoreEngine.val_arr_int_bq[0] = CoreEngine.val_arr_int_bs[(var6 + 8)]);
                (CoreEngine.val_arr_int_bq[1] = CoreEngine.val_arr_int_bs[(var6 + 9)]);
                (CoreEngine.val_arr_int_bq[2] = CoreEngine.val_arr_int_bs[(var6 + 10)]);
                (CoreEngine.val_arr_int_bq[3] = CoreEngine.val_arr_int_bs[(var6 + 11)]);
                CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_arr_int_bs[(var6 + 12)]][CoreEngine.val_arr_int_bs[(var6 + 13)]].interactWithEntity(CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_arr_int_bs[(var6 + 14)]][CoreEngine.val_arr_int_bs[(var6 + 15)]], CoreEngine.val_arr_int_br);
                CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_arr_int_bs[(var6 + 14)]][CoreEngine.val_arr_int_bs[(var6 + 15)]].updateTick();
            }
            (CoreEngine.val_int_eI = 0);
        }
    }
    static tickGameState() {
        if (CoreEngine.val_bool_ah) {
            CoreEngine.initGameState();
        } else {
            if (CoreEngine.val_bool_ai) {
                if (CoreEngine.val_bool_ao) {
                    (CoreEngine.val_int_cO = 0);
                    CoreEngine.val_int_cE++;
                    (CoreEngine.val_bool_af = true);
                } else {
                    (CoreEngine.val_bool_af = false);
                }
                if (CoreEngine.val_bool_an) {
                    (CoreEngine.val_int_cO = 0);
                    CoreEngine.val_int_cE--;
                    (CoreEngine.val_bool_ad = true);
                } else {
                    (CoreEngine.val_bool_ad = false);
                }
                if (CoreEngine.val_bool_ar) {
                    if (((CoreEngine.val_int_cO = (CoreEngine.val_int_cO + CoreEngine.val_int_e)) > 150)) {
                        (CoreEngine.val_int_cO = 0);
                        CoreEngine.val_int_cE--;
                    }
                    (CoreEngine.val_bool_ad = true);
                }
                if (CoreEngine.val_bool_as) {
                    if (((CoreEngine.val_int_cO = (CoreEngine.val_int_cO + CoreEngine.val_int_e)) > 150)) {
                        (CoreEngine.val_int_cO = 0);
                        CoreEngine.val_int_cE++;
                    }
                    (CoreEngine.val_bool_af = true);
                }
                if (CoreEngine.val_bool_au) {
                    (CoreEngine.val_bool_ai = false);
                    CoreEngine.exec_Z_to_void();
                }
                if (((CoreEngine.val_int_cE + CoreEngine.val_int_cF) > (CoreEngine.val_arr_short_f[0] + 1))) {
                    (CoreEngine.val_int_cE = ((CoreEngine.val_arr_short_f[0] - CoreEngine.val_int_cF) + 1));
                }
                if ((CoreEngine.val_int_cE <= 0)) {
                    (CoreEngine.val_int_cE = 1);
                }
                if (CoreEngine.val_bool_ab) {
                    if (((CoreEngine.val_int_cE + CoreEngine.val_int_cF) <= CoreEngine.val_arr_short_f[0])) {
                        (CoreEngine.val_bool_ae = true);
                    } else {
                        (CoreEngine.val_bool_ae = false);
                    }
                    if ((CoreEngine.val_int_cE > 1)) {
                        (CoreEngine.val_bool_ac = true);
                        return;
                    }
                    (CoreEngine.val_bool_ac = false);
                }
            } else {
                if ((((CoreEngine.val_int_cw) === (3) && (CoreEngine.val_int_dL) !== (14)) && CoreEngine.val_bool_au)) {
                    CoreEngine.exec_k_to_void();
                } else {
                    if (((((CoreEngine.val_int_cw) === (3) && (CoreEngine.val_int_dL) !== (14)) && (CoreEngine.val_int_dL) !== (5)) && CoreEngine.val_bool_at)) {
                        if (((CoreEngine.val_int_cw) === (3) && CoreEngine.exec_v_to_bool())) {
                            CoreEngine.exec_l_to_void();
                            (CoreEngine.val_bool_ai = true);
                            CoreEngine.exec_b_byte_to_void(CoreEngine.val_byte_q);
                            (CoreEngine.val_arr_short_f = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short((CoreEngine.val_encodedtextbuffer_m = (CoreEngine.val_encodedtextbuffer_m = (CoreEngine.val_encodedtextbuffer_m = new EncodedTextBuffer(500)).appendBuffer(CoreEngine.val_coreengine_b.fighterTitleBuffer)).appendString(("||" + CoreEngine.exec_a_to_encodedtextbuffer()))), (CoreEngine.val_int_n - 16)));
                            (CoreEngine.val_int_cE = 1);
                            (CoreEngine.val_int_cF = Math.trunc(((CoreEngine.val_int_o - CoreEngine.val_int_ai)) / (CoreEngine.exec_l_to_int())));
                            CoreEngine.exec_a_byte_byte_to_void((((0) << 24) >> 24), (((4) << 24) >> 24));
                            let var8 = (CoreEngine.val_arr_short_f[0] > CoreEngine.val_int_cF);
                            (CoreEngine.val_bool_ab = var8);
                            if (var8) {
                                (CoreEngine.val_int_cF = (Math.trunc((((CoreEngine.val_int_o - CoreEngine.val_int_ai) - (2 * CoreEngine.exec_h_to_int()))) / (CoreEngine.exec_l_to_int())) - 1));
                                (CoreEngine.val_int_cO = 0);
                            }
                            let var8_pos = Math.trunc(((CoreEngine.val_int_o - CoreEngine.val_int_ai)) / (2));
                            let var10 = 0;
                            if (CoreEngine.val_bool_ab) {
                                (var10 = (CoreEngine.exec_h_to_int() - Math.trunc(((7 * CoreEngine.exec_l_to_int())) / (4))));
                            } else {
                                (var10 = 0);
                            }
                            (CoreEngine.val_int_cB = ((CoreEngine.val_int_cB = (var8_pos + var10)) - Math.trunc(((Math.min(CoreEngine.val_arr_short_f[0], CoreEngine.val_int_cF) * CoreEngine.exec_l_to_int())) / (2))));
                            return;
                        }
                    } else {
                        label369: {
                            (CoreEngine.val_int_cx = (CoreEngine.val_int_cx + CoreEngine.val_int_e));
                            switch (CoreEngine.val_int_cw) {
                                case 0:
                                    if ((CoreEngine.val_bool_aa && !CoreEngine.val_bool_am)) {
                                        (CoreEngine.val_int_cz = CoreEngine.val_int_bZ);
                                        (CoreEngine.val_int_cA = CoreEngine.val_int_ce);
                                        (CoreEngine.val_arr_arr_int_d = CoreEngine.val_arr_arr_int_c);
                                        (CoreEngine.val_bool_ag = true);
                                        (CoreEngine.val_int_cy = CoreEngine.val_int_cu);
                                        CoreEngine.exec_u_int_to_void(4);
                                        break label369;
                                    }
                                    CoreEngine.exec_u_int_to_void(1);
                                    break label369;
                                case 1:
                                    if (CoreEngine.val_bool_W) {
                                        (CoreEngine.val_int_cy = CoreEngine.exec_n_to_int());
                                        if (CoreEngine.val_bool_am) {
                                            CoreEngine.exec_u_int_to_void(3);
                                        } else {
                                            CoreEngine.exec_u_int_to_void(2);
                                        }
                                    }
                                    if (CoreEngine.val_bool_X) {
                                        CoreEngine.exec_u_int_to_void(11);
                                    }
                                    break label369;
                                case 2:
                                    if (!CoreEngine.val_bool_Z) {
                                        break label369;
                                    }
                                    (CoreEngine.val_int_cz = CoreEngine.val_int_bZ);
                                    (CoreEngine.val_int_cG = CoreEngine.exec_j_to_int());
                                    CoreEngine.exec_a_byte_byte_to_void((((0) << 24) >> 24), (((0) << 24) >> 24));
                                    let var1 = false;
                                    if ((CoreEngine.val_int_cy) === (6)) {
                                        (var1 = true);
                                    } else {
                                        (var1 = CoreEngine.val_bool_ag);
                                    }
                                    if (!var1) {
                                        (CoreEngine.val_bool_ag = true);
                                        CoreEngine.exec_u_int_to_void(10);
                                        break label369;
                                    }
                                    break;
                                case 3:
                                    if (!CoreEngine.val_bool_ax) {
                                        break label369;
                                    }
                                    if (!CoreEngine.exec_x_to_bool()) {
                                        CoreEngine.exec_X_to_void();
                                        break label369;
                                    }
                                    if (!CoreEngine.val_bool_am) {
                                        CoreEngine.val_int_cA++;
                                        CoreEngine.exec_b_to_byte();
                                        if ((CoreEngine.val_int_cA >= CoreEngine.exec_m_to_int())) {
                                            if (CoreEngine.val_bool_al) {
                                                (CoreEngine.val_bool_al = false);
                                                CoreEngine.exec_u_int_to_void(7);
                                            } else {
                                                if ((CoreEngine.val_int_cy) === (6)) {
                                                    CoreEngine.exec_u_int_to_void(6);
                                                } else {
                                                    CoreEngine.exec_u_int_to_void(5);
                                                }
                                            }
                                            CoreEngine.exec_d_bool_to_void(false);
                                            CoreEngine.exec_I_to_void();
                                        } else {
                                            CoreEngine.exec_u_int_to_void(4);
                                        }
                                        break label369;
                                    }
                                    CoreEngine.exec_b_to_byte();
                                    break;
                                case 4:
                                    if (CoreEngine.val_bool_Z) {
                                        (CoreEngine.val_arr_byte_k = null);
                                        let var4 = false;
                                        if ((CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ][(CoreEngine.val_int_ce + 1)]) === (-2)) {
                                            (var4 = true);
                                        } else {
                                            (var4 = false);
                                        }
                                        if (var4) {
                                            ((CoreEngine.val_arr_byte_k = createArray(3, 0))[0] = 4);
                                            (CoreEngine.val_arr_byte_k[1] = 1);
                                            (CoreEngine.val_arr_byte_k[2] = 0);
                                            (CoreEngine.val_int_cG = CoreEngine.val_arr_byte_k[0]);
                                        } else {
                                            if ((CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ][(CoreEngine.val_int_ce + 1)]) === (-1)) {
                                                (var4 = true);
                                            } else {
                                                (var4 = false);
                                            }
                                            if (var4) {
                                                ((CoreEngine.val_arr_byte_k = createArray(2, 0))[0] = 3);
                                                (CoreEngine.val_arr_byte_k[1] = 2);
                                                (CoreEngine.val_int_cG = CoreEngine.val_arr_byte_k[0]);
                                            } else {
                                                if ((CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ][(CoreEngine.val_int_ce + 1)] >= 0)) {
                                                    (var4 = true);
                                                } else {
                                                    (var4 = false);
                                                }
                                                if (var4) {
                                                    (CoreEngine.val_int_cG = CoreEngine.exec_j_to_int());
                                                }
                                            }
                                        }
                                        CoreEngine.exec_u_int_to_void(3);
                                    }
                                    break label369;
                                case 5:
                                    if (((CoreEngine.val_bool_at || CoreEngine.val_bool_av) || (CoreEngine.val_encodedtextbuffer_m) === (null))) {
                                        CoreEngine.exec_u_int_to_void(6);
                                    }
                                    break label369;
                                case 6:
                                    if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
                                        CoreEngine.exec_X_to_void();
                                    }
                                    break label369;
                                case 7:
                                    if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
                                        CoreEngine.exec_u_int_to_void(5);
                                    }
                                    break label369;
                                case 8:
                                    (CoreEngine.val_bool_S = !CoreEngine.val_bool_S);
                                    if ((CoreEngine.val_bool_ap && (--CoreEngine.val_int_bp < 0))) {
                                        (CoreEngine.val_int_bp = 2);
                                    }
                                    if ((CoreEngine.val_bool_aq && (++CoreEngine.val_int_bp > 2))) {
                                        (CoreEngine.val_int_bp = 0);
                                    }
                                    if (CoreEngine.val_bool_an) {
                                        CoreEngine.exec_x_int_to_void((CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp] + 1));
                                        (CoreEngine.val_int_bq = 20);
                                        (CoreEngine.val_int_br = 20);
                                    }
                                    if (CoreEngine.val_bool_ao) {
                                        CoreEngine.exec_x_int_to_void((CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp] - 1));
                                        (CoreEngine.val_int_bq = 20);
                                        (CoreEngine.val_int_br = 20);
                                    }
                                    if ((CoreEngine.val_bool_ar && (--CoreEngine.val_int_br <= 0))) {
                                        if (((CoreEngine.val_int_bq -= 4) < 2)) {
                                            (CoreEngine.val_int_bq = 2);
                                        }
                                        (CoreEngine.val_int_br = CoreEngine.val_int_bq);
                                        CoreEngine.exec_x_int_to_void((CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp] + 1));
                                    }
                                    if ((CoreEngine.val_bool_as && (--CoreEngine.val_int_br <= 0))) {
                                        if (((CoreEngine.val_int_bq -= 4) < 2)) {
                                            (CoreEngine.val_int_bq = 2);
                                        }
                                        (CoreEngine.val_int_br = CoreEngine.val_int_bq);
                                        CoreEngine.exec_x_int_to_void((CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp] - 1));
                                    }
                                    if ((CoreEngine.val_bool_av && (++CoreEngine.val_int_bp > 2))) {
                                        if (CoreEngine.val_bool_Q) {
                                            (CoreEngine.val_bool_R = true);
                                        } else {
                                            (CoreEngine.val_int_bp = 2);
                                        }
                                    }
                                    if ((CoreEngine.val_bool_Q && CoreEngine.val_bool_at)) {
                                        (CoreEngine.val_bool_R = true);
                                    }
                                    (CoreEngine.val_arr_int_aj[0] = (((CoreEngine.val_int_bm + Math.trunc((CoreEngine.val_int_bn) / (2))) - Math.trunc((CoreEngine.val_arr_int_al[0]) / (2))) + (CoreEngine.val_int_bp * (CoreEngine.val_int_bn + CoreEngine.val_int_bo))));
                                    (CoreEngine.val_arr_int_aj[1] = (((CoreEngine.val_int_bm + Math.trunc((CoreEngine.val_int_bn) / (2))) - Math.trunc((CoreEngine.val_arr_int_al[0]) / (2))) + (CoreEngine.val_int_bp * (CoreEngine.val_int_bn + CoreEngine.val_int_bo))));
                                    let var0 = ((((CoreEngine.val_bool_Q ? 1 : 0)) << 24) >> 24);
                                    (CoreEngine.val_byte_h = var0);
                                    CoreEngine.exec_a_byte_byte_to_void(var0, CoreEngine.val_byte_i);
                                    if (CoreEngine.val_bool_R) {
                                        (CoreEngine.val_int_cH = CoreEngine.exec_a_arr_byte_int_to_int(CoreEngine.val_arr_byte_j, ((CoreEngine.val_long_c) | 0)));
                                        CoreEngine.exec_u_int_to_void(9);
                                    }
                                    break label369;
                                case 9:
                                    if ((((CoreEngine.val_int_cx > 3000) || CoreEngine.val_bool_at) || CoreEngine.val_bool_av)) {
                                        CoreEngine.exec_d_bool_to_void(false);
                                        CoreEngine.exec_I_to_void();
                                        CoreEngine.exec_u_int_to_void(11);
                                    }
                                    break label369;
                                case 10:
                                    if ((!CoreEngine.val_bool_at && !CoreEngine.val_bool_av)) {
                                        break label369;
                                    }
                                    break;
                                default:
                                    break label369;
                            }
                            CoreEngine.exec_u_int_to_void(3);
                        }
                        switch (CoreEngine.val_int_cw) {
                            case 1:
                                switch (CoreEngine.val_int_bG) {
                                    case 0:
                                        if (CoreEngine.val_bool_ap) {
                                            CoreEngine.exec_e_byte_to_void(PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][4]);
                                        }
                                        if (CoreEngine.val_bool_aq) {
                                            CoreEngine.exec_e_byte_to_void(PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][5]);
                                        }
                                        if (CoreEngine.val_bool_an) {
                                            CoreEngine.exec_e_byte_to_void(PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][6]);
                                        }
                                        if (CoreEngine.val_bool_ao) {
                                            CoreEngine.exec_e_byte_to_void(PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][7]);
                                        }
                                        if (CoreEngine.val_bool_au) {
                                            (CoreEngine.val_bool_X = true);
                                        }
                                        if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
                                            switch (PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][1]) {
                                                case 0:
                                                case 1:
                                                    if (CoreEngine.exec_a_byte_to_bool(CoreEngine.val_byte_n)) {
                                                        CoreEngine.exec_a_byte_bool_to_void(CoreEngine.val_arr_byte_o[CoreEngine.exec_n_to_int()], false);
                                                        CoreEngine.exec_A_int_to_void(2);
                                                        if (!CoreEngine.val_bool_Y) {
                                                            CoreEngine.exec_C_int_to_void(PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][0]);
                                                        }
                                                        CoreEngine.exec_an_to_void();
                                                        return;
                                                    }
                                                    break;
                                                case 2:
                                                    CoreEngine.exec_A_int_to_void(1);
                                                    return;
                                            }
                                        }
                                        (CoreEngine.val_int_bP = (CoreEngine.val_int_bP + CoreEngine.val_int_e));
                                        if ((!CoreEngine.val_bool_Y && (CoreEngine.val_int_bP > 700))) {
                                            if (CoreEngine.exec_a_byte_to_bool(CoreEngine.val_byte_n)) {
                                                CoreEngine.exec_C_int_to_void(PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][0]);
                                                (CoreEngine.val_spritepartsequence_j = CoreEngine.val_spritepartsequence_k);
                                                (CoreEngine.val_int_bO = 1);
                                            } else {
                                                (CoreEngine.val_int_bP = 0);
                                            }
                                        }
                                        break;
                                    case 1:
                                        if (((CoreEngine.val_int_bI = (CoreEngine.val_int_bI + CoreEngine.val_int_e)) > 1000)) {
                                            CoreEngine.exec_e_byte_to_void(CoreEngine.val_byte_j);
                                            CoreEngine.exec_a_byte_bool_to_void(CoreEngine.val_arr_byte_o[CoreEngine.exec_n_to_int()], false);
                                            CoreEngine.exec_A_int_to_void(2);
                                            if (!CoreEngine.val_bool_Y) {
                                                CoreEngine.exec_C_int_to_void(PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][0]);
                                            }
                                            CoreEngine.exec_an_to_void();
                                        } else {
                                            CoreEngine.exec_e_byte_to_void((CoreEngine.val_byte_k = CoreEngine.exec_c_to_byte()));
                                        }
                                        break;
                                    case 2:
                                        try {
                                            (CoreEngine.val_int_bF = (CoreEngine.val_int_bF + CoreEngine.val_int_e));
                                            let var7 = 0;
                                            if ((CoreEngine.val_int_bH) === (16711680)) {
                                                (var7 = 16777215);
                                            } else {
                                                (var7 = 16711680);
                                            }
                                            (CoreEngine.val_int_bH = var7);
                                            if (((CoreEngine.val_int_bF - CoreEngine.val_int_aA) > 1000)) {
                                                (CoreEngine.val_int_aA = 0);
                                                (CoreEngine.val_bool_W = true);
                                            }
                                        } catch (var2) {

                                        }
                                }
                                if (CoreEngine.val_bool_Y) {
                                    (CoreEngine.val_int_bO = CoreEngine.val_spritepartsequence_j.getPartYOffset(CoreEngine.val_int_bO, CoreEngine.val_int_e));
                                }
                                CoreEngine.exec_a_byte_byte_to_void(CoreEngine.val_byte_l, CoreEngine.val_byte_m);
                                return;
                            case 2:
                            case 4:
                                CoreEngine.updateSplashState();
                                return;
                            case 3:
                                (CoreEngine.val_long_f = (CoreEngine.val_long_f + CoreEngine.val_int_e));
                                (CoreEngine.val_long_d = Math.min((CoreEngine.val_long_d = Math.max((CoreEngine.val_long_d = (CoreEngine.val_long_e + Math.trunc((((CoreEngine.val_long_c - CoreEngine.val_long_e) * CoreEngine.val_long_f)) / (1000)))), CoreEngine.val_long_e)), CoreEngine.val_long_c));
                                CoreEngine.renderAllActors();
                                return;
                            case 5:
                            case 10:
                                (CoreEngine.val_int_cI = CoreEngine.val_spritepartsequence_m.getPartYOffset(CoreEngine.val_int_cI, CoreEngine.val_int_e));
                            case 6:
                            case 9:
                                CoreEngine.exec_a_byte_byte_to_void((((3) << 24) >> 24), (((0) << 24) >> 24));
                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                if ((!CoreEngine.val_bool_ak && (((CoreEngine.val_int_cD = (CoreEngine.val_int_cD - Math.trunc(((5376 * CoreEngine.val_int_e)) / (1000)))) >> 8) < (8 + (2 * CoreEngine.exec_c_to_int()))))) {
                                    if ((((CoreEngine.val_int_cD >> 8) + (((CoreEngine.val_arr_short_f[0] - CoreEngine.val_int_cE) + 1) * CoreEngine.exec_c_to_int())) < ((CoreEngine.val_int_o - CoreEngine.val_int_ai) - CoreEngine.exec_c_to_int()))) {
                                        (CoreEngine.val_int_cD = (CoreEngine.val_int_cD + Math.trunc(((5376 * CoreEngine.val_int_e)) / (1000))));
                                        (CoreEngine.val_bool_ak = true);
                                    } else {
                                        CoreEngine.val_int_cE++;
                                        (CoreEngine.val_int_cD = (CoreEngine.val_int_cD + (CoreEngine.exec_c_to_int() << 8)));
                                    }
                                }
                                (CoreEngine.val_int_cC = Math.trunc((((CoreEngine.val_int_o - CoreEngine.val_int_ai) - (CoreEngine.val_int_cD >> 8))) / (CoreEngine.exec_c_to_int())));
                                break;
                            case 7:
                                CoreEngine.exec_a_byte_byte_to_void((((3) << 24) >> 24), (((0) << 24) >> 24));
                                return;
                            case 8:
                                return;
                        }
                    }
                }
            }
        }
    }
    static tickSubState() {
        if (CoreEngine.val_bool_I) {
            for (let var0 = 0; (var0 < CoreEngine.val_int_n); (var0 += CoreEngine.val_arr_int_X[0])) {
                for (let var1 = 0; (var1 < CoreEngine.val_int_o); (var1 += CoreEngine.val_arr_int_Y[0])) {
                    CoreEngine.exec_b_int_int_int_to_void(0, var0, var1);
                }
            }
        }
        if (CoreEngine.val_bool_I) {
            for (let var6 = 0; (var6 <= CoreEngine.val_int_n); (var6 += CoreEngine.val_arr_int_X[1])) {
                CoreEngine.exec_b_int_int_int_to_void(1, var6, 0);
            }
        }
        switch (CoreEngine.val_int_aH) {
            case 0:
            case 1:
                CoreEngine.exec_a_bool_bool_bool_bool_int_int_int_int_bool_to_void(CoreEngine.val_bool_K, CoreEngine.val_bool_M, CoreEngine.val_bool_L, CoreEngine.val_bool_N, CoreEngine.val_int_aV, CoreEngine.val_int_aW, CoreEngine.val_int_aX, CoreEngine.val_int_aY, false);
                break;
            case 2:
            case 3:
                CoreEngine.exec_a_bool_bool_bool_bool_int_int_int_int_bool_to_void(CoreEngine.val_bool_K, CoreEngine.val_bool_M, CoreEngine.val_bool_L, CoreEngine.val_bool_N, CoreEngine.val_int_aV, CoreEngine.val_int_aW, CoreEngine.val_int_aX, CoreEngine.val_int_aY, true);
        }
        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_d, Math.trunc((CoreEngine.val_int_n) / (2)), CoreEngine.val_int_aI, 17);
        switch (CoreEngine.val_int_aE) {
            case 0:
            case 1:
            case 2:
            case 3:
                for (let var15 = 0; (var15 < CoreEngine.val_arr_int_t.length); var15++) {
                    let var7 = CoreEngine.val_int_bb;
                    let var8 = (CoreEngine.val_int_aL + (var15 * (CoreEngine.val_arr_int_P[CoreEngine.val_int_aH] + CoreEngine.val_arr_int_Q[CoreEngine.val_int_aH])));
                    let var9 = CoreEngine.val_int_ba;
                    let var10 = CoreEngine.val_arr_int_P[CoreEngine.val_int_aH];
                    let var11 = CoreEngine.val_arr_encodedtextbuffer_a[CoreEngine.val_arr_int_t[var15]];
                    let var20 = CoreEngine.val_arr_int_u[CoreEngine.val_arr_int_t[var15]];
                    let var18 = false;
                    if ((CoreEngine.val_int_aD) === (CoreEngine.val_arr_int_t[var15])) {
                        (var18 = true);
                    } else {
                        (var18 = false);
                    }
                    let var5 = CoreEngine.val_int_aH;
                    let var4 = -1;
                    if (((CoreEngine.val_arr_int_r) !== (null) && (CoreEngine.val_arr_int_r[CoreEngine.val_arr_int_t[var15]]) === (20))) {
                        (var4 = 6);
                    }
                    let var14 = (((var4) << 24) >> 24);
                    let var2 = var18;
                    if ((var5) === (0)) {
                        CoreEngine.val_graphicsadapter_a.setColor(789000);
                        CoreEngine.val_graphicsadapter_a.fillRect((var7 + CoreEngine.val_arr_int_Y[3]), var8, (var9 - (2 * CoreEngine.val_arr_int_Y[3])), CoreEngine.val_arr_int_Y[3]);
                        CoreEngine.val_graphicsadapter_a.setColor(10920337);
                        CoreEngine.val_graphicsadapter_a.fillRect((var7 + CoreEngine.val_arr_int_Y[3]), ((var8 + var10) - CoreEngine.val_arr_int_Y[3]), (var9 - (2 * CoreEngine.val_arr_int_Y[3])), CoreEngine.val_arr_int_Y[3]);
                        CoreEngine.val_graphicsadapter_a.setColor(1842466);
                        CoreEngine.val_graphicsadapter_a.fillRect(var7, (var8 + CoreEngine.val_arr_int_Y[3]), CoreEngine.val_arr_int_Y[3], (var10 - (2 * CoreEngine.val_arr_int_Y[3])));
                        CoreEngine.val_graphicsadapter_a.setColor(13618372);
                        CoreEngine.val_graphicsadapter_a.fillRect(((var7 + var9) - CoreEngine.val_arr_int_Y[3]), (var8 + CoreEngine.val_arr_int_Y[3]), CoreEngine.val_arr_int_Y[3], (var10 - (2 * CoreEngine.val_arr_int_Y[3])));
                        CoreEngine.val_arr_spritepartsequence_c[2].drawSequence(CoreEngine.val_arr_int_ab[2], CoreEngine.val_arr_animationset_a[CoreEngine.val_arr_int_V[2]], (var7 - CoreEngine.val_arr_int_Z[2]), (var8 - CoreEngine.val_arr_int_aa[2]), 0);
                        CoreEngine.val_arr_spritepartsequence_c[3].drawSequence(CoreEngine.val_arr_int_ab[3], CoreEngine.val_arr_animationset_a[CoreEngine.val_arr_int_V[3]], (((var7 - CoreEngine.val_arr_int_Z[3]) + var9) - CoreEngine.val_arr_int_X[3]), (var8 - CoreEngine.val_arr_int_aa[3]), 0);
                        CoreEngine.val_arr_spritepartsequence_c[4].drawSequence(CoreEngine.val_arr_int_ab[4], CoreEngine.val_arr_animationset_a[CoreEngine.val_arr_int_V[4]], (var7 - CoreEngine.val_arr_int_Z[4]), (((var8 - CoreEngine.val_arr_int_aa[4]) + var10) - CoreEngine.val_arr_int_Y[4]), 0);
                        CoreEngine.val_arr_spritepartsequence_c[5].drawSequence(CoreEngine.val_arr_int_ab[5], CoreEngine.val_arr_animationset_a[CoreEngine.val_arr_int_V[5]], (((var7 - CoreEngine.val_arr_int_Z[5]) + var9) - CoreEngine.val_arr_int_X[5]), (((var8 - CoreEngine.val_arr_int_aa[5]) + var10) - CoreEngine.val_arr_int_Y[5]), 0);
                        let var10001 = CoreEngine.val_arr_int_Y[3];
                        let var10003 = CoreEngine.val_arr_int_Y[3];
                        let var10005 = (CoreEngine.val_arr_int_Y[3] << 1);
                        let var3 = (var10 - (2 * CoreEngine.val_arr_int_Y[3]));
                        (var4 = (var9 - var10005));
                        (var5 = (var8 + var10003));
                        let var21 = (var7 + var10001);
                        for (let var19 = 0; (var19 < var3); var19++) {
                            CoreEngine.val_graphicsadapter_a.drawRGB(CoreEngine.val_arr_int_af, (var19 % 2), var4, var21, (var5 + var19), var4);
                        }
                    } else {
                        if (var18) {
                            if (((var5) !== (2) && (var5) !== (3))) {
                                CoreEngine.exec_b_int_int_int_to_void(6, ((((var7 + Math.trunc((var9) / (2))) - Math.trunc((var20) / (2))) - CoreEngine.val_int_bc) - CoreEngine.val_arr_int_X[6]), ((var8 + Math.trunc((var10) / (2))) - Math.trunc((CoreEngine.val_arr_int_Y[6]) / (2))));
                                CoreEngine.exec_b_int_int_int_to_void(6, (((var7 + Math.trunc((var9) / (2))) + Math.trunc((var20) / (2))) + CoreEngine.val_int_bc), ((var8 + Math.trunc((var10) / (2))) - Math.trunc((CoreEngine.val_arr_int_Y[6]) / (2))));
                            } else {
                                CoreEngine.exec_a_int_int_int_to_void(0, ((((var7 + Math.trunc((var9) / (2))) - Math.trunc((var20) / (2))) - CoreEngine.val_int_bc) - CoreEngine.val_arr_int_X[6]), ((var8 + Math.trunc((var10) / (2))) - Math.trunc((CoreEngine.val_arr_int_Y[6]) / (2))));
                                CoreEngine.exec_a_int_int_int_to_void(0, (((var7 + Math.trunc((var9) / (2))) + Math.trunc((var20) / (2))) + CoreEngine.val_int_bc), ((var8 + Math.trunc((var10) / (2))) - Math.trunc((CoreEngine.val_arr_int_Y[6]) / (2))));
                            }
                        }
                    }
                    if ((var14) !== (-1)) {
                        CoreEngine.exec_b_byte_to_void(var14);
                    } else {
                        if (var2) {
                            CoreEngine.exec_b_byte_to_void((((5) << 24) >> 24));
                        } else {
                            CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                        }
                    }
                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var11, ((var7 + Math.trunc((var9) / (2))) - Math.trunc((var20) / (2))), ((var8 + Math.trunc((var10) / (2))) - Math.trunc((CoreEngine.exec_c_to_int()) / (2))), 20);
                }
                break;
            case 4:
            case 5:
            case 6:
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_e, CoreEngine.val_arr_short_d, CoreEngine.val_int_aS, Math.min(CoreEngine.val_arr_short_d[0], CoreEngine.val_int_aR), CoreEngine.val_int_aM, CoreEngine.val_int_aN, CoreEngine.val_int_aU);
                return;
            case 7:
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                let var13 = CoreEngine.val_int_bd;
                for (let var12 = 0; (var12 < CoreEngine.val_int_bi); var12++) {
                    if (((CoreEngine.val_int_bs) !== (var12) || !CoreEngine.val_bool_T)) {
                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_arr_encodedtextbuffer_c[var12], CoreEngine.val_int_be, var13, 24);
                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_arr_encodedtextbuffer_b[var12], CoreEngine.val_int_be, var13, 20);
                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_arr_encodedtextbuffer_d[var12], CoreEngine.val_int_bf, var13, 24);
                    }
                    (var13 += (CoreEngine.val_int_bh + CoreEngine.val_int_bg));
                }
        }
    }
    static transitionGameState() {
        for ((CoreEngine.val_int_eC = 0); (CoreEngine.val_int_eC < 3); CoreEngine.val_int_eC++) {
            for ((CoreEngine.val_int_eB = 0); (CoreEngine.val_int_eB < CoreEngine.val_arr_int_bk[CoreEngine.val_int_eC]); CoreEngine.val_int_eB++) {
                ((CoreEngine.val_arr_int_bm = CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].getBounds())[10] = 16777215);
                if ((!CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].isActive() && (CoreEngine.val_arr_int_bm) !== (null))) {
                    if (CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].testCollision(CoreEngine.val_arr_int_bp)) {
                        let var0 = CoreEngine.val_arr_int_bp;
                        (CoreEngine.val_arr_int_bm[4] = 0);
                        (CoreEngine.val_arr_int_bm[2] = var0[1]);
                        (CoreEngine.val_arr_int_bm[3] = var0[2]);
                        (CoreEngine.val_arr_int_bm[5] = var0[3]);
                        (CoreEngine.val_arr_int_bm[6] = var0[4]);
                        (CoreEngine.val_arr_int_bm[7] = var0[0]);
                        (CoreEngine.val_arr_int_bm[8] = CoreEngine.val_arr_int_bm[0]);
                        (CoreEngine.val_arr_int_bm[9] = CoreEngine.val_arr_int_bm[1]);
                        if (((CoreEngine.val_arr_int_bm[7]) === (5) && (CoreEngine.val_arr_int_bm[6] < 0))) {
                            (CoreEngine.val_arr_int_bm[4] = Math.trunc((CoreEngine.val_arr_int_bm[3]) / (2)));
                            (CoreEngine.val_arr_int_bm[6] = -CoreEngine.val_arr_int_bm[6]);
                            (CoreEngine.val_arr_int_bm[8] = (CoreEngine.val_arr_int_bm[8] - Math.trunc((CoreEngine.val_arr_int_bm[5]) / (2))));
                            let var1 = (((4 * CoreEngine.val_arr_int_bm[6]) * CoreEngine.val_arr_int_bm[4]) * CoreEngine.val_arr_int_bm[4]);
                            (CoreEngine.val_arr_int_bm[9] = ((((Math.trunc((((4 * CoreEngine.val_arr_int_bm[6]) * CoreEngine.val_arr_int_bm[4])) / (CoreEngine.val_arr_int_bm[3]))) | 0) + CoreEngine.val_arr_int_bm[9]) - ((Math.trunc((var1) / ((CoreEngine.val_arr_int_bm[3] * CoreEngine.val_arr_int_bm[3])))) | 0)));
                        }
                    }
                    if ((CoreEngine.val_arr_int_bm[7]) !== (0)) {
                        if ((CoreEngine.val_arr_int_bm[2] > 0)) {
                            let var9 = (CoreEngine.val_arr_int_bm[2] - CoreEngine.val_int_e);
                            (CoreEngine.val_arr_int_bm[2] = var9);
                        } else {
                            if ((CoreEngine.val_arr_int_bm[7]) !== (5)) {
                                (CoreEngine.val_arr_int_bm[4] = Math.min((CoreEngine.val_arr_int_bm[4] + CoreEngine.val_int_e), CoreEngine.val_arr_int_bm[3]));
                            } else {
                                let var7 = (CoreEngine.val_arr_int_bm[4] + CoreEngine.val_int_e);
                                (CoreEngine.val_arr_int_bm[4] = var7);
                            }
                            let var14 = 0;
                            label109: {
                                (var14 = 0);
                                let var10000 = 0;
                                switch (CoreEngine.val_arr_int_bm[7]) {
                                    case 1:
                                        (var10000 = (CoreEngine.val_arr_int_bm[4] << 8));
                                        let var23 = (CoreEngine.val_arr_int_bm[3] << 8);
                                        let var18 = var10000;
                                        if ((var10000 < 0)) {
                                            (var10000 = 0);
                                        } else {
                                            let var24 = 0;
                                            (var10000 = (var24 = Math.trunc(((var18 << 8)) / (var23))));
                                            (var10000 = ((((var10000 * var10000) >> 8) * var24) >> 8));
                                        }
                                        (var14 = var10000);
                                        break label109;
                                    case 2:
                                        (var10000 = (CoreEngine.val_arr_int_bm[4] << 8));
                                        let var20 = (CoreEngine.val_arr_int_bm[3] << 8);
                                        let var17 = var10000;
                                        if ((var10000 < 0)) {
                                            (var10000 = 0);
                                        } else {
                                            (var20 = Math.trunc(((var17 << 8)) / (var20)));
                                            (var10000 = (3 * var20));
                                            let var22 = ((((var20 * var20) >> 8) * var20) >> 8);
                                            (var10000 = ((var10000 - (3 * ((var20 * var20) >> 8))) + var22));
                                        }
                                        (var14 = var10000);
                                        break label109;
                                    case 3:
                                        (var10000 = (CoreEngine.val_arr_int_bm[4] << 8));
                                        let var5 = (CoreEngine.val_arr_int_bm[3] << 8);
                                        let var3 = var10000;
                                        if ((var10000 < 0)) {
                                            (var10000 = 0);
                                        } else {
                                            (var5 = Math.trunc((((var5 - var3) << 8)) / (var5)));
                                            (var10000 = (256 - ((3 * (var3 = ((var5 * var5) >> 8))) - (2 * ((var3 * var5) >> 8)))));
                                        }
                                        break;
                                    case 4:
                                    case 5:
                                        (var10000 = Math.trunc(((CoreEngine.val_arr_int_bm[4] << 8)) / (CoreEngine.val_arr_int_bm[3])));
                                        break;
                                    default:
                                        break label109;
                                }
                                (var14 = var10000);
                            }
                            (CoreEngine.val_arr_int_bm[0] = (CoreEngine.val_arr_int_bm[8] + ((((var14 * CoreEngine.val_arr_int_bm[5]) >> 8)) | 0)));
                            switch (CoreEngine.val_arr_int_bm[7]) {
                                case 1:
                                case 2:
                                case 3:
                                case 4:
                                    if ((CoreEngine.val_arr_int_bm[6]) !== (0)) {
                                        (CoreEngine.val_arr_int_bm[1] = (CoreEngine.val_arr_int_bm[9] - ((((var14 * CoreEngine.val_arr_int_bm[6]) >> 8)) | 0)));
                                    }
                                    break;
                                case 5:
                                    let var32 = CoreEngine.val_arr_int_bm[9];
                                    (var14 = (((4 * CoreEngine.val_arr_int_bm[6]) * CoreEngine.val_arr_int_bm[4]) * CoreEngine.val_arr_int_bm[4]));
                                    (CoreEngine.val_arr_int_bm[1] = ((var32 - ((Math.trunc((((4 * CoreEngine.val_arr_int_bm[6]) * CoreEngine.val_arr_int_bm[4])) / (CoreEngine.val_arr_int_bm[3]))) | 0)) + ((Math.trunc((var14) / ((CoreEngine.val_arr_int_bm[3] * CoreEngine.val_arr_int_bm[3])))) | 0)));
                            }
                            if ((CoreEngine.val_arr_int_bm[7]) !== (5)) {
                                if ((CoreEngine.val_arr_int_bm[4]) === (CoreEngine.val_arr_int_bm[3])) {
                                    (CoreEngine.val_arr_int_bm[7] = 0);
                                }
                            } else {
                                if ((CoreEngine.val_arr_int_bm[1] >= 0)) {
                                    (CoreEngine.val_arr_int_bm[7] = 0);
                                    if ((CoreEngine.val_arr_int_bm[1]) === (0)) {
                                        let var8 = (CoreEngine.val_arr_int_bm[1] + 1);
                                        (CoreEngine.val_arr_int_bm[1] = var8);
                                    }
                                }
                            }
                        }
                    }
                    if ((CoreEngine.val_arr_int_bm[1] > 0)) {
                        CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].applyAction(8);
                        (CoreEngine.val_arr_int_bm[1] = 0);
                    } else {
                        if ((CoreEngine.val_arr_int_bm[1] < CoreEngine.val_int_eF)) {
                            CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].applyAction(1);
                            if ((CoreEngine.val_int_eC) !== (2)) {
                                (CoreEngine.val_arr_int_bm[1] = CoreEngine.val_int_eF);
                            }
                        }
                    }
                    if ((CoreEngine.val_arr_int_bm[0] < CoreEngine.val_int_eG)) {
                        CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].applyAction(2);
                        if ((CoreEngine.val_int_eC) !== (2)) {
                            (CoreEngine.val_arr_int_bm[0] = CoreEngine.val_int_eG);
                        }
                    } else {
                        if ((CoreEngine.val_arr_int_bm[0] > CoreEngine.val_int_eH)) {
                            CoreEngine.val_arr_arr_entityinterface_a[CoreEngine.val_int_eC][CoreEngine.val_int_eB].applyAction(4);
                            if ((CoreEngine.val_int_eC) !== (2)) {
                                (CoreEngine.val_arr_int_bm[0] = CoreEngine.val_int_eH);
                            }
                        }
                    }
                    if ((CoreEngine.val_arr_int_bm[1]) === (0)) {
                        let var10 = (CoreEngine.val_arr_int_bm[10] ^ 1);
                        (CoreEngine.val_arr_int_bm[10] = var10);
                    }
                    if ((CoreEngine.val_arr_int_bm[1]) === (CoreEngine.val_int_eF)) {
                        let var11 = (CoreEngine.val_arr_int_bm[10] ^ 2);
                        (CoreEngine.val_arr_int_bm[10] = var11);
                    }
                    if ((CoreEngine.val_arr_int_bm[0]) === (CoreEngine.val_int_eG)) {
                        let var12 = (CoreEngine.val_arr_int_bm[10] ^ 4);
                        (CoreEngine.val_arr_int_bm[10] = var12);
                    }
                    if ((CoreEngine.val_arr_int_bm[0]) === (CoreEngine.val_int_eH)) {
                        let var13 = (CoreEngine.val_arr_int_bm[10] ^ 8);
                        (CoreEngine.val_arr_int_bm[10] = var13);
                    }
                }
            }
        }
    }
    static exec_a_arr_int_bool_encodedtextbuffer_to_void(var0, var1, var2) {
        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
        (CoreEngine.val_int_aE = var0[0]);
        (CoreEngine.val_bool_I = (var1));
        (CoreEngine.val_bool_K = false);
        (CoreEngine.val_bool_L = false);
        (CoreEngine.val_byte_h = 0);
        let var3 = (((((CoreEngine.val_int_aF > 0) ? 4 : 0)) << 24) >> 24);
        (CoreEngine.val_byte_i = var3);
        switch (CoreEngine.val_int_aE) {
            case 0:
                (CoreEngine.val_int_aH = 0);
                (CoreEngine.val_byte_h = 3);
                break;
            case 1:
                (CoreEngine.val_int_aH = 2);
                (CoreEngine.val_byte_h = 3);
                break;
            case 2:
                (CoreEngine.val_int_aH = 3);
                (CoreEngine.val_byte_h = 1);
                break;
            case 3:
                (CoreEngine.val_int_aH = 1);
                (CoreEngine.val_byte_h = 1);
                break;
            case 4:
                (CoreEngine.val_int_aH = 1);
                (CoreEngine.val_byte_h = 1);
                (CoreEngine.val_byte_i = 2);
                break;
            case 5:
                (CoreEngine.val_int_aH = 1);
                break;
            case 6:
                (CoreEngine.val_int_aH = 3);
        }
        (CoreEngine.val_encodedtextbuffer_d = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[1], null));
        switch (CoreEngine.val_int_aE) {
            case 0:
            case 1:
                (var3 = 0);
                for (let var8 = 0; (var8 < Math.trunc(((var0.length - 2)) / (2))); var8++) {
                    if (!CoreEngine.val_arr_bool_a[var0[(((var8 << 1) + 2) + 1)]]) {
                        var3++;
                    }
                }
                (CoreEngine.val_int_aG = var3);
                (CoreEngine.val_arr_int_r = createArray(var3, 0));
                (CoreEngine.val_arr_encodedtextbuffer_a = createArray(CoreEngine.val_int_aG, null));
                (CoreEngine.val_arr_int_u = createArray(CoreEngine.val_int_aG, 0));
                let isOverMax = (CoreEngine.val_int_aG > CoreEngine.val_arr_int_O[CoreEngine.val_int_aH]);
                (CoreEngine.val_bool_J = isOverMax);
                if (isOverMax) {
                    (CoreEngine.val_arr_int_t = createArray(3, 0));
                } else {
                    (CoreEngine.val_arr_int_t = createArray(CoreEngine.val_int_aG, 0));
                }
                CoreEngine.exec_L_to_void();
                let var17 = 0;
                for (let var9 = 0; (var9 < Math.trunc(((var0.length - 2)) / (2))); var9++) {
                    if (!CoreEngine.val_arr_bool_a[var0[(((var9 << 1) + 2) + 1)]]) {
                        (CoreEngine.val_arr_encodedtextbuffer_a[var17] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[((var9 << 1) + 2)], null));
                        (CoreEngine.val_arr_int_r[var17] = var0[(((var9 << 1) + 2) + 1)]);
                        (CoreEngine.val_arr_int_u[var17] = CoreEngine.exec_a_encodedtextbuffer_to_int(CoreEngine.val_arr_encodedtextbuffer_a[var17]));
                        var17++;
                    }
                }
                CoreEngine.exec_e_int_to_void(0);
                return;
            case 2:
            case 3:
                (CoreEngine.val_arr_encodedtextbuffer_a = createArray((CoreEngine.val_int_aG = (var0.length - 2)), null));
                (CoreEngine.val_arr_int_u = createArray(CoreEngine.val_int_aG, 0));
                (CoreEngine.val_arr_int_r = null);
                let var14 = false;
                if ((CoreEngine.val_int_aG > CoreEngine.val_arr_int_O[CoreEngine.val_int_aH])) {
                    (var14 = true);
                } else {
                    (var14 = false);
                }
                (CoreEngine.val_bool_J = var14);
                if (var14) {
                    (CoreEngine.val_arr_int_t = createArray(3, 0));
                } else {
                    (CoreEngine.val_arr_int_t = createArray(CoreEngine.val_int_aG, 0));
                }
                CoreEngine.exec_L_to_void();
                for (let var15 = 0; (var15 < CoreEngine.val_int_aG); var15++) {
                    (CoreEngine.val_arr_encodedtextbuffer_a[var15] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[(var15 + 2)], null));
                    (CoreEngine.val_arr_int_u[var15] = CoreEngine.exec_a_encodedtextbuffer_to_int(CoreEngine.val_arr_encodedtextbuffer_a[var15]));
                }
                CoreEngine.exec_e_int_to_void(0);
                return;
            case 4:
            case 5:
            case 6:
                (CoreEngine.val_arr_int_r = null);
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                let var10 = false;
                let var4 = (CoreEngine.val_int_aE) === (4);
                let var5 = (((((CoreEngine.val_int_aE) !== (4) ? 20 : 17)) << 24) >> 24);
                let var1_val = ((CoreEngine.val_int_aE) !== (4) ? CoreEngine.val_int_bb : Math.trunc((CoreEngine.val_int_n) / (2)));
                let var10_val = ((CoreEngine.val_int_aE) !== (4) ? CoreEngine.val_int_aJ : (CoreEngine.val_int_aJ + Math.trunc(((CoreEngine.val_int_aK - CoreEngine.val_int_aJ)) / (2))));
                let var6 = var2;
                if ((var2) === (null)) {
                    (var6 = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[2], null));
                }
                let var10000 = (CoreEngine.val_int_n - (2 * CoreEngine.val_int_bb));
                (CoreEngine.val_int_aM = var1_val);
                (CoreEngine.val_int_aN = var10_val);
                (CoreEngine.val_int_aO = var10000);
                (CoreEngine.val_int_aP = (CoreEngine.val_int_aK - CoreEngine.val_int_aJ));
                (CoreEngine.val_encodedtextbuffer_e = var6);
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                (CoreEngine.val_int_aQ = Math.trunc((CoreEngine.val_int_aP) / (CoreEngine.exec_c_to_int())));
                (CoreEngine.val_arr_short_d = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(CoreEngine.val_encodedtextbuffer_e, CoreEngine.val_int_aO));
                (CoreEngine.val_int_aS = 1);
                (CoreEngine.val_int_aT = Math.max(((CoreEngine.val_arr_short_d[0] - CoreEngine.val_int_aQ) + CoreEngine.val_int_aS), CoreEngine.val_int_aS));
                let var19 = 0;
                if ((CoreEngine.val_int_aQ > CoreEngine.val_arr_short_d[0])) {
                    (var19 = CoreEngine.val_arr_short_d[0]);
                } else {
                    (var19 = CoreEngine.val_int_aQ);
                }
                (CoreEngine.val_int_aR = var19);
                (CoreEngine.val_int_aU = var5);
                if (var4) {
                    (CoreEngine.val_int_aN = (CoreEngine.val_int_aN - Math.trunc(((Math.min(CoreEngine.val_arr_short_d[0], CoreEngine.val_int_aR) * CoreEngine.exec_c_to_int())) / (2))));
                }
                CoreEngine.exec_J_to_void();
        }
    }
    static exec_A_to_void() {
        if ((CoreEngine.val_int_dc > CoreEngine.val_int_da)) {
            (CoreEngine.val_int_dc = Math.max(CoreEngine.val_int_da, (CoreEngine.val_int_dc - Math.trunc((((CoreEngine.val_int_e * CoreEngine.val_int_dB) + 500)) / (1000)))));
        } else {
            if ((CoreEngine.val_int_dc < CoreEngine.val_int_da)) {
                (CoreEngine.val_int_dc = Math.min(CoreEngine.val_int_da, (CoreEngine.val_int_dc + Math.trunc((((CoreEngine.val_int_e * CoreEngine.val_int_dB) + 500)) / (1000)))));
            }
        }
        if ((CoreEngine.val_int_dd > CoreEngine.val_int_db)) {
            (CoreEngine.val_int_dd = Math.max(CoreEngine.val_int_db, (CoreEngine.val_int_dd - Math.trunc((((CoreEngine.val_int_e * CoreEngine.val_int_dB) + 500)) / (1000)))));
        } else {
            if ((CoreEngine.val_int_dd < CoreEngine.val_int_db)) {
                (CoreEngine.val_int_dd = Math.min(CoreEngine.val_int_db, (CoreEngine.val_int_dd + Math.trunc((((CoreEngine.val_int_e * CoreEngine.val_int_dB) + 500)) / (1000)))));
            }
        }
        if ((CoreEngine.val_int_de > CoreEngine.val_int_dp)) {
            (CoreEngine.val_int_de = Math.max(CoreEngine.val_int_dp, (CoreEngine.val_int_de - Math.trunc((((CoreEngine.val_int_e * CoreEngine.val_int_dC) + 500)) / (1000)))));
        } else {
            if ((CoreEngine.val_int_de < CoreEngine.val_int_dp)) {
                (CoreEngine.val_int_de = Math.min(CoreEngine.val_int_dp, (CoreEngine.val_int_de + Math.trunc((((CoreEngine.val_int_e * CoreEngine.val_int_dC) + 500)) / (1000)))));
            }
        }
        if ((CoreEngine.val_int_df > CoreEngine.val_int_dq)) {
            (CoreEngine.val_int_df = Math.max(CoreEngine.val_int_dq, (CoreEngine.val_int_df - Math.trunc((((CoreEngine.val_int_e * CoreEngine.val_int_dC) + 500)) / (1000)))));
        } else {
            if ((CoreEngine.val_int_df < CoreEngine.val_int_dq)) {
                (CoreEngine.val_int_df = Math.min(CoreEngine.val_int_dq, (CoreEngine.val_int_df + Math.trunc((((CoreEngine.val_int_e * CoreEngine.val_int_dC) + 500)) / (1000)))));
            }
        }
        (CoreEngine.val_int_dg = (Math.trunc(((CoreEngine.val_int_dc * CoreEngine.val_int_cY)) / (100)) >> 8));
        (CoreEngine.val_int_dh = (Math.trunc(((CoreEngine.val_int_dd * CoreEngine.val_int_cY)) / (100)) >> 8));
        (CoreEngine.val_int_dr = (Math.trunc(((CoreEngine.val_int_de * CoreEngine.val_int_dn)) / (100)) >> 8));
        (CoreEngine.val_int_ds = (Math.trunc(((CoreEngine.val_int_df * CoreEngine.val_int_dn)) / (100)) >> 8));
        for (let var0 = 0; (var0 < 2); var0++) {
            switch (CoreEngine.val_arr_int_aG[var0]) {
                case 0:
                default:
                    break;
                case 1:
                    let var3 = (CoreEngine.val_arr_int_aN[var0] + CoreEngine.val_int_e);
                    (CoreEngine.val_arr_int_aN[var0] = var3);
                    (CoreEngine.val_arr_int_aJ[var0] = (CoreEngine.val_arr_int_aH[var0] + Math.trunc((((CoreEngine.val_arr_int_aI[var0] - CoreEngine.val_arr_int_aH[var0]) * CoreEngine.val_arr_int_aN[var0])) / (600))));
                    if ((CoreEngine.val_arr_int_aN[var0] > 600)) {
                        (CoreEngine.val_arr_int_aJ[var0] = CoreEngine.val_arr_int_aI[var0]);
                    }
                    (CoreEngine.val_arr_int_aM[var0] = (CoreEngine.val_arr_int_aK[var0] + Math.trunc((((CoreEngine.val_arr_int_aL[var0] - CoreEngine.val_arr_int_aK[var0]) * (CoreEngine.val_arr_int_aN[var0] - 300))) / (600))));
                    if (((CoreEngine.val_arr_int_aN[var0] - 300) > 600)) {
                        (CoreEngine.val_arr_int_aM[var0] = CoreEngine.val_arr_int_aL[var0]);
                        (CoreEngine.val_arr_int_aG[var0] = 2);
                        (CoreEngine.val_arr_int_aN[var0] = 0);
                    }
                    break;
                case 2:
                    let var2 = (CoreEngine.val_arr_int_aN[var0] + CoreEngine.val_int_e);
                    (CoreEngine.val_arr_int_aN[var0] = var2);
                    if ((CoreEngine.val_arr_int_aN[var0] > 500)) {
                        (CoreEngine.val_arr_int_aG[var0] = 3);
                        (CoreEngine.val_arr_int_aN[var0] = 0);
                    }
                    break;
                case 3:
                    let var1 = (CoreEngine.val_arr_int_aN[var0] + CoreEngine.val_int_e);
                    (CoreEngine.val_arr_int_aN[var0] = var1);
                    (CoreEngine.val_arr_int_aJ[var0] = (CoreEngine.val_arr_int_aI[var0] - Math.trunc((((CoreEngine.val_arr_int_aI[var0] - CoreEngine.val_arr_int_aH[var0]) * CoreEngine.val_arr_int_aN[var0])) / (600))));
                    if ((CoreEngine.val_arr_int_aN[var0] > 600)) {
                        (CoreEngine.val_arr_int_aJ[var0] = CoreEngine.val_arr_int_aH[var0]);
                    }
                    if ((CoreEngine.val_arr_int_aN[var0] > 300)) {
                        (CoreEngine.val_arr_int_aM[var0] = (CoreEngine.val_arr_int_aL[var0] - Math.trunc((((CoreEngine.val_arr_int_aL[var0] - CoreEngine.val_arr_int_aK[var0]) * (CoreEngine.val_arr_int_aN[var0] - 300))) / (600))));
                    }
                    if (((CoreEngine.val_arr_int_aN[var0] - 300) > 600)) {
                        (CoreEngine.val_arr_int_aM[var0] = CoreEngine.val_arr_int_aK[var0]);
                        (CoreEngine.val_arr_int_aG[var0] = 0);
                    }
            }
        }
    }
    static readIntFromBytes(var0) {
        let var1 = null;
        if ((var1 = CoreEngine.exec_a_to_fontcharmap()).val_bool_a) {
            return var1.val_byte_e;
        }
        (var1.val_byte_a = var0[1]);
        (var1.val_int_a = ((((var0[2] & 255) << 16) | ((var0[3] & 255) << 8)) | (var0[4] & 255)));
        let var2 = CoreEngine.readShortBigEndian(var0, 5);
        (var1.val_byte_e = var0[7]);
        let var10001 = var0[8];
        let var3 = 10;
        (var1.val_byte_c = ((((var10001 + 1)) << 24) >> 24));
        (var1.val_byte_b = ((((var0[9] + 1)) << 24) >> 24));
        (var1.val_arr_byte_a = createArray(var1.val_byte_e, 0));
        (var1.val_arr_arr_byte_a = createArray(var1.val_byte_e, null));
        (var1.val_arr_byte_e = createArray(var1.val_byte_e, 0));
        (var1.val_arr_short_a = createArray(var1.val_byte_b, 0));
        (var1.val_arr_byte_b = createArray(var1.val_byte_b, 0));
        (var1.val_arr_byte_c = createArray(var1.val_byte_b, 0));
        (var1.val_arr_arr_short_a = createArray(var1.val_byte_e, null));
        (var1.val_arr_short_b = createArray(var1.val_byte_b, 0));
        for (let var4 = 0; (var4 < var1.val_arr_short_b.length); var4++) {
            (var1.val_arr_short_b[var4] = 0);
        }
        (var1.val_arr_short_c = createArray(var1.val_byte_b, 0));
        for (let var5 = 0; (var5 < var1.val_arr_short_c.length); var5++) {
            (var1.val_arr_short_c[var5] = 0);
        }
        (var1.val_arr_byte_d = createArray(var1.val_byte_b, 0));
        (var1.val_arr_arr_byte_b = createArray(var1.val_byte_c, null));
        (var1.val_arr_arr_short_b = createArray(var1.val_byte_c, null));
        for (let var13 = 0; (var13 < var1.val_byte_c); var13++) {
            (var1.val_arr_arr_short_b[var13] = null);
        }
        (var1.val_arr_short_a[0] = var2);
        for (let var14 = 0; (var14 < var1.val_byte_e); var14++) {
            (var1.val_arr_arr_short_a[var14] = createArray(var1.val_byte_b, 0));
        }
        for (let var15 = 0; (var15 < var1.val_byte_c); var15++) {
            (var1.val_arr_arr_byte_b[var15] = null);
        }
        let var10 = ((((var2 + 1)) << 16) >> 16);
        for (let var16 = 0; (var16 < var1.val_byte_e); var16++) {
            (var1.val_arr_arr_byte_a[var16] = createArray(5, 0));
            for (let var6 = 0; (var6 < 5); var6++) {
                (var1.val_arr_arr_byte_a[var16][var6] = var0[(var3 + var6)]);
            }
            let var20 = ((((((((var3 + 5)) << 16) >> 16) + 1)) << 16) >> 16);
            (var1.val_arr_byte_a[var16] = var0[((((var3 + 5)) << 16) >> 16)]);
            (var3 = ((((var20 + 1)) << 16) >> 16));
            (var1.val_arr_byte_e[var16] = var0[var20]);
            if ((var2 > 0)) {
                if ((var1.val_arr_arr_short_b[0]) === (null)) {
                    (var1.val_arr_arr_short_b[0] = createArray((var1.val_byte_e * var10), 0));
                }
                for (let var21 = 0; (var21 < var10); var21++) {
                    (var1.val_arr_arr_short_b[0][((var16 * var10) + var21)] = CoreEngine.readShortBigEndian(var0, var3));
                    (var3 = ((((var3 + 2)) << 16) >> 16));
                }
            }
        }
        if ((var2 > 0)) {
            let var22 = var1.val_arr_arr_short_b[0][((var1.val_byte_e * var10) - 1)];
            (var1.val_arr_arr_byte_b[0] = createArray(var22, 0));
            let var10000 = var1.val_arr_arr_byte_b[0];
            let var7 = var22;
            let var17 = var3;
            let var11 = var0;
            let var8 = var10000;
            System.arraycopy(var11, var17, var8, 0, var7);
            (var3 += var22);
        }
        for (let var23 = 1; (var23 < var1.val_byte_b); var23++) {
            (var1.val_arr_byte_b[var23] = ((((var0[var3] & 192)) << 24) >> 24));
            (var1.val_arr_byte_c[var23] = ((((var0[var3] & 63)) << 24) >> 24));
            let var18 = 0;
            (var10001 = (var18 = ((((var3 + 1)) << 16) >> 16)));
            let var12 = var1.val_arr_short_a;
            (var3 = CoreEngine.readShortBigEndian(var0, var10001));
            (var12[var23] = var3);
            (var3 = ((((var18 + 2)) << 16) >> 16));
            if (((var1.val_arr_short_a[var23] + 1) > var1.val_arr_short_c[var1.val_arr_byte_c[var23]])) {
                (var1.val_arr_short_c[var1.val_arr_byte_c[var23]] = ((((var1.val_arr_short_a[var23] + 1)) << 16) >> 16));
            }
            for (let var19 = 0; (var19 < var1.val_byte_e); var19++) {
                (var1.val_arr_arr_short_a[var19][var23] = CoreEngine.readShortBigEndian(var0, var3));
                if (((var1.val_arr_arr_short_a[var19][var23] & 65535) > (var1.val_arr_short_b[var1.val_arr_byte_c[var23]] & 65535))) {
                    (var1.val_arr_short_b[var1.val_arr_byte_c[var23]] = var1.val_arr_arr_short_a[var19][var23]);
                }
                (var3 = ((((var3 + 2)) << 16) >> 16));
            }
        }
        if ((var1.val_arr_byte_a[var1.val_byte_d] > 1)) {
            var1.setFontStyle(var1.val_arr_byte_a[var1.val_byte_d]);
        }
        (var1.val_bool_a = true);
        return var1.val_byte_e;
    }
    static initGameState() {
        if ((CoreEngine.val_arr_spritepartsequence_c) !== (null)) {
            for (let var0 = 0; (var0 < CoreEngine.val_arr_int_T.length); var0++) {
                (CoreEngine.val_arr_int_ab[var0] = CoreEngine.val_arr_spritepartsequence_c[var0].getPartYOffset(CoreEngine.val_arr_int_ab[var0], CoreEngine.val_int_e));
            }
        }
        if ((CoreEngine.val_arr_spritepartsequence_d) !== (null)) {
            for (let var1 = 0; (var1 < CoreEngine.val_arr_int_U.length); var1++) {
                (CoreEngine.val_arr_int_ae[var1] = CoreEngine.val_arr_spritepartsequence_d[var1].getPartYOffset(CoreEngine.val_arr_int_ae[var1], CoreEngine.val_int_e));
            }
        }
        if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
            switch (CoreEngine.val_int_aC) {
                case 8:
                    let var3 = CoreEngine.val_globalcontext_a.currentScene;
                    if (!CoreEngine.val_globalcontext_a.currentScene.isTransitioning) {
                        (var3.isTransitioning = true);
                    }
                    CoreEngine.exec_b_gamemidletloop_to_void(CoreEngine.val_gamemidletloop_a);
                    return;
                case 9:
                    CoreEngine.exec_N_to_void();
                    CoreEngine.exec_d_bool_to_void(false);
                    (CoreEngine.val_long_g = 0);
                    (CoreEngine.val_bool_U = false);
                    CoreEngine.exec_I_to_void();
                    CoreEngine.exec_w_to_bool();
                    return;
                case 10:
                    CoreEngine.exec_h_int_to_void(CoreEngine.val_int_aD);
                    CoreEngine.exec_w_to_bool();
                    return;
                case 11:
                    CoreEngine.exec_h_int_to_void(CoreEngine.val_int_aD);
                    CoreEngine.exec_I_to_void();
                    CoreEngine.setGameState(5);
                    return;
                case 12:
                    console.log("s_currentSelectedItem 1");
                    CoreEngine.exec_I_int_to_void(CoreEngine.val_int_aD);
                    if ((CoreEngine.val_int_aD) === (2)) {
                        CoreEngine.exec_a_byte_bool_to_void((((38) << 24) >> 24), false);
                    } else {
                        if ((CoreEngine.val_int_aD) === (0)) {
                            CoreEngine.exec_b_byte_bool_to_void((((5) << 24) >> 24), false);
                        }
                    }
                    CoreEngine.exec_w_to_bool();
                    return;
                case 13:
                    if ((CoreEngine.val_int_aD) !== (CoreEngine.val_int_bv)) {
                        CoreEngine.exec_I_int_to_void(CoreEngine.val_int_aD);
                        CoreEngine.exec_I_to_void();
                    }
                    if ((CoreEngine.val_int_aD) === (2)) {
                        CoreEngine.exec_a_byte_bool_to_void((((38) << 24) >> 24), false);
                    } else {
                        if (((CoreEngine.val_int_aD - 1)) === (0)) {
                            CoreEngine.exec_b_byte_bool_to_void((((13) << 24) >> 24), false);
                        }
                    }
                    if (CoreEngine.val_bool_b) {
                        CoreEngine.setGameState(6);
                        return;
                    }
                    (CoreEngine.val_int_bu = 1);
                    if (CoreEngine.val_bool_V) {
                        CoreEngine.setGameState(7);
                        return;
                    }
                    CoreEngine.setGameState(9);
                    return;
                case 14:
                case 28:
                    (CoreEngine.val_int_bu = CoreEngine.val_int_aD);
                    if ((CoreEngine.val_int_aD) === (0)) {
                        CoreEngine.exec_M_int_to_void(100);
                    }
                    CoreEngine.exec_w_to_bool();
                    return;
                case 15:
                    console.log("5");
                    if ((CoreEngine.val_int_aD) !== (CoreEngine.val_int_bu)) {
                        (CoreEngine.val_int_bu = CoreEngine.val_int_aD);
                        CoreEngine.exec_I_to_void();
                    }
                    if ((CoreEngine.val_int_aD) === (0)) {
                        CoreEngine.exec_M_int_to_void(100);
                    }
                    if (CoreEngine.val_bool_V) {
                        CoreEngine.setGameState(7);
                    } else {
                        CoreEngine.setGameState(9);
                    }
                    break;
                case 16:
                    (CoreEngine.val_int_bx = CoreEngine.val_int_aD);
                    CoreEngine.exec_w_to_bool();
                    return;
                case 17:
                    console.log("6");
                    if ((CoreEngine.val_int_aD) !== (CoreEngine.val_int_bx)) {
                        (CoreEngine.val_int_bx = CoreEngine.val_int_aD);
                        CoreEngine.exec_I_to_void();
                    }
                    CoreEngine.setGameState(8);
                    break;
                case 18:
                    (CoreEngine.val_int_bw = CoreEngine.val_int_aD);
                    CoreEngine.exec_w_to_bool();
                    return;
                case 19:
                    (CoreEngine.val_int_bw = CoreEngine.val_int_aD);
                    (CoreEngine.val_bool_V = false);
                    CoreEngine.exec_I_to_void();
                    CoreEngine.setGameState(9);
                    break;
                case 20:
                case 22:
                case 23:
                case 24:
                case 26:
                default:
                    if ((CoreEngine.val_int_aE) === (0)) {
                        CoreEngine.exec_a_byte_bool_to_void((((38) << 24) >> 24), false);
                        CoreEngine.exec_L_int_to_void(CoreEngine.val_int_aC);
                        CoreEngine.exec_c_int_to_void(CoreEngine.val_arr_int_r[CoreEngine.val_int_aD]);
                        return;
                    }
                    if ((CoreEngine.val_int_aE) === (1)) {
                        CoreEngine.exec_L_int_to_void(CoreEngine.val_int_aC);
                        CoreEngine.exec_c_int_to_void(CoreEngine.val_arr_int_r[CoreEngine.val_int_aD]);
                    }
                    break;
                case 21:
                    CoreEngine.setGameState(11);
                    return;
                case 25:
                    CoreEngine.exec_I_to_void();
                    (CoreEngine.val_bool_ah = false);
                    CoreEngine.exec_Z_to_void();
                    CoreEngine.exec_af_to_void();
                    CoreEngine.setGameState(9);
                    break;
                case 27:
                    CoreEngine.exec_I_int_to_void(CoreEngine.val_int_aD);
                    if ((CoreEngine.val_int_aD) === (2)) {
                        CoreEngine.exec_a_byte_bool_to_void((((38) << 24) >> 24), false);
                    } else {
                        if (((CoreEngine.val_int_aD - 1)) === (0)) {
                            CoreEngine.exec_b_byte_bool_to_void((((13) << 24) >> 24), false);
                        }
                    }
                    CoreEngine.exec_w_to_bool();
            }
        }
        if (CoreEngine.val_bool_au) {
            switch (CoreEngine.val_int_aC) {
                case 1:
                    CoreEngine.exec_I_to_void();
                    CoreEngine.exec_w_to_bool();
                case 7:
                    break;
                case 21:
                    CoreEngine.exec_d_bool_to_void(false);
                    (CoreEngine.val_long_g = 0);
                    CoreEngine.exec_I_to_void();
                    CoreEngine.setGameState(11);
                    break;
                default:
                    if (CoreEngine.exec_w_to_bool()) {
                        return;
                    }
            }
        }
        switch (CoreEngine.val_int_aE) {
            case 0:
            case 3:
                if (CoreEngine.val_bool_ao) {
                    CoreEngine.exec_e_int_to_void((CoreEngine.val_int_aD + 1));
                    if (CoreEngine.val_bool_I) {
                        CoreEngine.exec_a_byte_bool_to_void((((37) << 24) >> 24), false);
                    }
                }
                if (CoreEngine.val_bool_an) {
                    CoreEngine.exec_e_int_to_void((CoreEngine.val_int_aD - 1));
                    if (CoreEngine.val_bool_I) {
                        CoreEngine.exec_a_byte_bool_to_void((((37) << 24) >> 24), false);
                    }
                }
                CoreEngine.exec_O_to_void();
                break;
            case 1:
            case 2:
                if (CoreEngine.val_bool_ao) {
                    CoreEngine.exec_e_int_to_void((CoreEngine.val_int_aD + 1));
                }
                if (CoreEngine.val_bool_an) {
                    CoreEngine.exec_e_int_to_void((CoreEngine.val_int_aD - 1));
                }
                CoreEngine.exec_O_to_void();
                break;
            case 4:
            case 5:
            case 6:
                CoreEngine.exec_J_to_void();
                break;
            case 7:
                if ((CoreEngine.val_int_bs) !== (-1)) {
                    let var2 = false;
                    if (!CoreEngine.val_bool_T) {
                        (var2 = true);
                    } else {
                        (var2 = false);
                    }
                    (CoreEngine.val_bool_T = var2);
                    if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
                        CoreEngine.exec_c_int_to_void(0);
                    }
                }
        }
        CoreEngine.exec_a_byte_byte_to_void(CoreEngine.val_byte_h, CoreEngine.val_byte_i);
    }
    static exec_u_int_to_void(var0) {
        CoreEngine.exec_H_int_to_void(CoreEngine.val_int_cw);
        CoreEngine.exec_a_byte_byte_to_void((((0) << 24) >> 24), (((0) << 24) >> 24));
        switch (var0) {
            case 0:
                (CoreEngine.val_int_cz = -1);
                (CoreEngine.val_int_cA = 0);
                (CoreEngine.val_arr_arr_int_d = null);
                (CoreEngine.val_bool_ag = false);
                (CoreEngine.val_long_c = 0);
                break;
            case 1:
                (CoreEngine.val_int_bS = 8);
                (CoreEngine.val_encodedtextbuffer_j = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(26, null));
                try {
                    (CoreEngine.val_arr_animationset_c = createArray(CoreEngine.val_arr_int_an.length, null));
                    for (let var15 = 0; (var15 < CoreEngine.val_arr_int_an.length); var15++) {
                        if ((var15) === (2)) {
                            (CoreEngine.val_arr_animationset_c[var15] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_an[var15], 167772231, (((0) << 24) >> 24), false));
                        } else {
                            (CoreEngine.val_arr_animationset_c[var15] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_an[var15], -1, (((0) << 24) >> 24), false));
                        }
                    }
                    (CoreEngine.val_arr_spritepartsequence_f = createArray(CoreEngine.val_arr_int_ao.length, null));
                    (CoreEngine.val_arr_int_at = createArray(CoreEngine.val_arr_int_ao.length, 0));
                    (CoreEngine.val_arr_int_ar = createArray(CoreEngine.val_arr_int_ao.length, 0));
                    (CoreEngine.val_arr_int_as = createArray(CoreEngine.val_arr_int_ao.length, 0));
                    for (let var19 = 0; (var19 < CoreEngine.val_arr_int_ao.length); var19++) {
                        (CoreEngine.val_arr_spritepartsequence_f[var19] = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_int_ao[var19], 1));
                        (CoreEngine.val_arr_int_at[var19] = 1);
                        (CoreEngine.val_arr_int_ar[var19] = CoreEngine.val_arr_spritepartsequence_f[var19].getSequenceWidth(CoreEngine.val_arr_animationset_c[CoreEngine.val_arr_int_ap[var19]]));
                        (CoreEngine.val_arr_int_as[var19] = CoreEngine.val_arr_spritepartsequence_f[var19].getSequenceHeight(CoreEngine.val_arr_animationset_c[CoreEngine.val_arr_int_ap[var19]]));
                    }
                    (CoreEngine.val_arr_spritepartsequence_g = createArray(CoreEngine.val_arr_int_aR.length, null));
                    (CoreEngine.val_arr_int_aq = createArray(CoreEngine.val_arr_int_aR.length, 0));
                    (CoreEngine.val_int_bQ = CoreEngine.val_arr_int_ar[1]);
                    (CoreEngine.val_int_bR = 5);
                    for (let var20 = 0; (var20 < CoreEngine.val_arr_int_aR.length); var20++) {
                        (CoreEngine.val_arr_spritepartsequence_g[var20] = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_int_aR[var20], 1));
                        (CoreEngine.val_arr_int_aq[var20] = 1);
                    }
                } catch (var10) {

                }
                (CoreEngine.val_bool_W = false);
                (CoreEngine.val_bool_X = false);
                (CoreEngine.val_bool_Y = false);
                (CoreEngine.val_int_bP = 0);
                CoreEngine.exec_A_int_to_void(0);
                CoreEngine.exec_e_byte_to_void((((0) << 24) >> 24));
                let var22 = 0;
                let var16 = 0;
                for (let var21 = 0; (var21 < PatternTable.val_arr_arr_byte_a.length); var21++) {
                    (var22 = Math.max(var22, CoreEngine.exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var21][2])));
                    (var16 = Math.max(var16, CoreEngine.exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var21][3])));
                }
                (CoreEngine.val_int_bJ = (var22 + CoreEngine.val_int_bQ));
                (CoreEngine.val_int_bK = (var16 + CoreEngine.val_int_bQ));
                (CoreEngine.val_int_bT = ((CoreEngine.val_int_n - CoreEngine.val_int_bJ) - 16));
                (CoreEngine.val_int_bU = (CoreEngine.val_int_bS + Math.trunc(((((CoreEngine.val_int_o - CoreEngine.val_int_ai) - CoreEngine.val_int_bS) - CoreEngine.val_int_bK)) / (2))));
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                (CoreEngine.val_int_bL = ((CoreEngine.val_int_o - CoreEngine.val_int_ai) - CoreEngine.exec_c_to_int()));
                (CoreEngine.val_int_bM = Math.trunc((CoreEngine.val_int_bT) / (2)));
                (CoreEngine.val_int_bN = (CoreEngine.val_int_bU + CoreEngine.val_int_bK));
                CoreEngine.exec_U_to_void();
                break;
            case 2:
                let var14 = createMultiArray([3, 0], 0);
                let var18 = 9;
                for (let var3 = 2; (var3 >= 0); var3--) {
                    (var14[var3] = createArray((var18 + 1), 0));
                    (var14[var3][0] = CoreEngine.val_arr_int_aE[var3]);
                    for (let var4 = var18; (var4 > 0); var4--) {
                        if ((var4) === (var18)) {
                            (var14[var3][var4] = 6);
                        } else {
                            if (((var4) === ((var18 - 1)) && (var3 > 0))) {
                                if ((var3) === (2)) {
                                    (var14[var3][var4] = -2);
                                } else {
                                    if ((var3) === (1)) {
                                        (var14[var3][var4] = -1);
                                    }
                                }
                            } else {
                                if (((var4) === ((var18 - 2)) && (var3) === (2))) {
                                    (var14[var3][var4] = -1);
                                } else {
                                    let var23 = false;
                                    while (!var23) {
                                        (var14[var3][var4] = CoreEngine.exec_a_int_int_to_int(0, 6));
                                        (var23 = true);
                                        for (let var24 = var18; (var24 > var4); var24--) {
                                            if ((var14[var3][var24]) === (var14[var3][var4])) {
                                                (var23 = false);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    (var18 -= 2);
                    if ((var18 < 3)) {
                        (var18 = 3);
                    }
                }
                (CoreEngine.val_arr_arr_int_d = var14);
                CoreEngine.exec_H_to_void();
                CoreEngine.exec_a_arr_arr_int_to_void(CoreEngine.val_arr_arr_int_d);
                (CoreEngine.val_int_cu = CoreEngine.val_int_cy);
                CoreEngine.exec_v_int_to_void(0);
                break;
            case 3:
                if (((CoreEngine.val_long_c > CoreEngine.val_long_g) && !CoreEngine.val_bool_am)) {
                    (CoreEngine.val_long_g = CoreEngine.val_long_c);
                }
                let var6 = CoreEngine.val_int_cy;
                let var5 = 0;
                if (CoreEngine.val_bool_am) {
                    (var5 = CoreEngine.val_int_cy);
                } else {
                    (var5 = CoreEngine.val_int_cG);
                }
                CoreEngine.exec_a_int_int_byte_to_void(var6, var5, CoreEngine.exec_b_to_byte());
                if (!CoreEngine.val_bool_am) {
                    (CoreEngine.val_long_d = CoreEngine.val_long_g);
                    (CoreEngine.val_long_e = CoreEngine.val_long_g);
                }
                break;
            case 4:
                CoreEngine.exec_H_to_void();
                CoreEngine.exec_a_arr_arr_int_to_void(CoreEngine.val_arr_arr_int_d);
                (CoreEngine.val_int_bZ = CoreEngine.val_int_cz);
                CoreEngine.exec_y_int_to_void(CoreEngine.val_int_cA);
                (CoreEngine.val_int_cu = CoreEngine.val_int_cy);
                CoreEngine.exec_v_int_to_void(4);
                break;
            case 5:
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                try {
                    (CoreEngine.val_animationset_m = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_aS[CoreEngine.val_int_cy], -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_spritepartsequence_m = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_arr_int_h[CoreEngine.val_int_cy][66], 0));
                    (CoreEngine.val_int_cI = 1);
                    (CoreEngine.val_int_cK = CoreEngine.val_spritepartsequence_m.getSequenceHeight(CoreEngine.val_animationset_m));
                    let var2 = CoreEngine.val_animationset_m;
                    let var12 = CoreEngine.val_spritepartsequence_m;
                    CoreEngine.val_spritepartsequence_m.renderPart((CoreEngine.val_spritepartsequence_m.partOffsets.length - 1), var2, CoreEngine.val_arr_int_d, 0);
                    (CoreEngine.val_int_cJ = (CoreEngine.val_arr_int_d[2] - CoreEngine.val_arr_int_d[0]));
                    (var2 = CoreEngine.val_animationset_m);
                    (var12 = CoreEngine.val_spritepartsequence_m);
                    CoreEngine.val_spritepartsequence_m.renderPart((CoreEngine.val_spritepartsequence_m.partOffsets.length - 1), var2, CoreEngine.val_arr_int_d, 0);
                    (CoreEngine.val_int_cL = -CoreEngine.val_arr_int_d[0]);
                    (CoreEngine.val_int_cM = ((CoreEngine.val_int_o - CoreEngine.val_int_ai) - Math.trunc((((((CoreEngine.val_int_o - CoreEngine.val_int_ai) - 8) - CoreEngine.exec_c_to_int()) - CoreEngine.val_int_cK)) / (2))));
                } catch (var8) {

                }
                (CoreEngine.val_encodedtextbuffer_n = CoreEngine.val_encodedtextbuffer_B.prepend(new EncodedTextBuffer("")));
                CoreEngine.exec_B_int_to_void(CoreEngine.val_arr_int_be[CoreEngine.val_int_cy]);
                CoreEngine.exec_U_to_void();
                break;
            case 6:
                (CoreEngine.val_encodedtextbuffer_n = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(128, null));
                CoreEngine.exec_F_int_to_void(111);
                break;
            case 7:
                CoreEngine.exec_F_int_to_void(134);
                break;
            case 8:
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                try {
                    (CoreEngine.val_animationset_k = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_int_bt, -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_arr_spritepartsequence_e = createArray(4, null));
                    (CoreEngine.val_arr_int_ai = createArray(4, 0));
                    (CoreEngine.val_arr_int_al = createArray(4, 0));
                    (CoreEngine.val_arr_int_am = createArray(4, 0));
                    (CoreEngine.val_arr_int_aj = createArray(4, 0));
                    (CoreEngine.val_arr_int_ak = createArray(4, 0));
                    for (let var1 = 0; (var1 < 4); var1++) {
                        (CoreEngine.val_arr_spritepartsequence_e[var1] = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_int_ah[var1], 0));
                        (CoreEngine.val_arr_int_ai[var1] = 1);
                        (CoreEngine.val_arr_int_al[var1] = CoreEngine.val_arr_spritepartsequence_e[var1].getSequenceWidth(CoreEngine.val_animationset_k));
                        (CoreEngine.val_arr_int_am[var1] = CoreEngine.val_arr_spritepartsequence_e[var1].getSequenceHeight(CoreEngine.val_animationset_k));
                    }
                } catch (var9) {

                }
                (CoreEngine.val_int_bp = 0);
                (CoreEngine.val_encodedtextbuffer_f = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(113, null));
                (CoreEngine.val_encodedtextbuffer_g = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(114, null));
                (CoreEngine.val_encodedtextbuffer_h = new EncodedTextBuffer("_"));
                (CoreEngine.val_arr_short_e = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short(CoreEngine.val_encodedtextbuffer_g, (CoreEngine.val_int_n - 32)));
                if (((CoreEngine.val_int_bj = Math.trunc(((CoreEngine.val_int_bk = (Math.trunc(((CoreEngine.val_int_o - CoreEngine.val_int_ai)) / (2)) - (CoreEngine.val_arr_short_e[0] * CoreEngine.exec_c_to_int())))) / (2))) > (CoreEngine.val_int_bk - CoreEngine.exec_c_to_int()))) {
                    (CoreEngine.val_int_bj = (CoreEngine.val_int_bk - CoreEngine.exec_c_to_int()));
                }
                (CoreEngine.val_int_bl = (((CoreEngine.val_int_bl = Math.trunc((((CoreEngine.val_int_o - CoreEngine.val_int_ai) - (CoreEngine.val_int_bk + (CoreEngine.val_arr_short_e[0] * CoreEngine.exec_c_to_int())))) / (2))) + CoreEngine.val_int_bk) + (CoreEngine.val_arr_short_e[0] * CoreEngine.exec_c_to_int())));
                (CoreEngine.val_int_bo = 16);
                (CoreEngine.val_int_bn = CoreEngine.exec_a_encodedtextbuffer_to_int(CoreEngine.val_encodedtextbuffer_h));
                (CoreEngine.val_int_bm = (3 * (CoreEngine.val_int_bn + CoreEngine.val_int_bo)));
                (CoreEngine.val_int_bm = (Math.trunc(((CoreEngine.val_int_n - CoreEngine.val_int_bm)) / (2)) + Math.trunc((CoreEngine.val_int_bo) / (2))));
                (CoreEngine.val_arr_int_aj[2] = (CoreEngine.val_int_bm - (3 * CoreEngine.val_arr_int_al[2])));
                (CoreEngine.val_arr_int_aj[3] = (((CoreEngine.val_int_bm + (3 * (CoreEngine.val_int_bn + CoreEngine.val_int_bo))) - CoreEngine.val_int_bo) + (2 * CoreEngine.val_arr_int_al[3])));
                (CoreEngine.val_arr_int_aj[0] = ((CoreEngine.val_int_bm + Math.trunc((CoreEngine.val_int_bn) / (2))) - Math.trunc((CoreEngine.val_arr_int_al[0]) / (2))));
                (CoreEngine.val_arr_int_aj[1] = ((CoreEngine.val_int_bm + Math.trunc((CoreEngine.val_int_bn) / (2))) - Math.trunc((CoreEngine.val_arr_int_al[1]) / (2))));
                (CoreEngine.val_arr_int_ak[0] = (CoreEngine.val_int_bl - (2 * CoreEngine.val_arr_int_am[0])));
                (CoreEngine.val_arr_int_ak[1] = ((CoreEngine.val_int_bl + CoreEngine.exec_c_to_int()) + CoreEngine.val_arr_int_am[1]));
                (CoreEngine.val_arr_int_ak[2] = ((CoreEngine.val_int_bl + Math.trunc((CoreEngine.exec_c_to_int()) / (2))) - Math.trunc((CoreEngine.val_arr_int_am[2]) / (2))));
                (CoreEngine.val_arr_int_ak[3] = ((CoreEngine.val_int_bl + Math.trunc((CoreEngine.exec_c_to_int()) / (2))) - Math.trunc((CoreEngine.val_arr_int_am[3]) / (2))));
                (CoreEngine.val_arr_byte_j = createArray(3, 0));
                (CoreEngine.val_arr_encodedtextbuffer_e = createArray(3, null));
                for (let var11 = 0; (var11 < 3); var11++) {
                    (CoreEngine.val_arr_byte_j[var11] = CoreEngine.val_arr_byte_h[var11]);
                    (CoreEngine.val_arr_encodedtextbuffer_e[var11] = new EncodedTextBuffer(1));
                    CoreEngine.val_arr_encodedtextbuffer_e[var11].appendInt(0);
                    CoreEngine.val_arr_encodedtextbuffer_e[var11].setCharAt(0, ((CoreEngine.val_arr_short_a[CoreEngine.val_arr_byte_j[var11]]) & 0xFFFF));
                }
                (CoreEngine.val_bool_Q = true);
                (CoreEngine.val_byte_h = 1);
                (CoreEngine.val_byte_i = 0);
                (CoreEngine.val_encodedtextbuffer_d = new EncodedTextBuffer(""));
                (CoreEngine.val_bool_L = false);
                (CoreEngine.val_bool_K = false);
                (CoreEngine.val_bool_R = false);
                (CoreEngine.val_int_bq = 20);
                (CoreEngine.val_int_br = 20);
                break;
            case 9:
                CoreEngine.exec_F_int_to_void(68);
                break;
            case 10:
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                try {
                    (CoreEngine.val_animationset_m = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_aS[CoreEngine.val_int_cy], -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_spritepartsequence_m = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_arr_int_h[CoreEngine.val_int_cy][0], 1));
                    (CoreEngine.val_int_cI = 1);
                    (CoreEngine.val_int_cK = CoreEngine.val_spritepartsequence_m.getSequenceHeight(CoreEngine.val_animationset_m));
                    (CoreEngine.val_int_cJ = CoreEngine.val_spritepartsequence_m.getSequenceWidth(CoreEngine.val_animationset_m));
                    (CoreEngine.val_int_cL = -CoreEngine.val_spritepartsequence_m.getFrameDelay(CoreEngine.val_animationset_m));
                    (CoreEngine.val_int_cM = ((CoreEngine.val_int_o - CoreEngine.val_int_ai) - Math.trunc((((((CoreEngine.val_int_o - CoreEngine.val_int_ai) - 8) - CoreEngine.exec_c_to_int()) - CoreEngine.val_int_cK)) / (2))));
                } catch (var7) {

                }
                (CoreEngine.val_encodedtextbuffer_n = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(CoreEngine.val_arr_int_bd[CoreEngine.val_int_cy], null));
                CoreEngine.exec_B_int_to_void(CoreEngine.val_arr_int_bf[CoreEngine.val_int_cy]);
                CoreEngine.exec_U_to_void();
                break;
            case 11:
                if (CoreEngine.val_bool_aj) {
                    CoreEngine.setGameState(9);
                    CoreEngine.exec_c_int_to_void(7);
                    (CoreEngine.val_bool_aj = false);
                } else {
                    CoreEngine.setGameState(9);
                }
        }
        (CoreEngine.val_int_cx = 0);
        (CoreEngine.val_int_cw = var0);
    }
    static exec_a_encodedtextbuffer_int_int_int_int_int_to_void(var0, var1, var2, var3, var4, var5) {
        let var6 = null;
        let var7 = ((var6 = CoreEngine.exec_a_to_fontcharmap()).val_contextservicenode_a.val_arr_byte_a[3] & 255);
        let var8 = CoreEngine.exec_c_to_int();
        let var9 = var6.val_contextservicenode_a.val_arr_byte_a[8];
        let var10 = var6.val_contextservicenode_a.val_arr_byte_a[9];
        let var11 = false;
        if (((var6.val_contextservicenode_a.val_arr_byte_a[10] & 2)) !== (0)) {
            (var11 = true);
        } else {
            (var11 = false);
        }
        let var12 = 0;
        let var14 = 0;
        if (((var5 & 8)) !== (0)) {
            (var12 = (0 - CoreEngine.exec_a_encodedtextbuffer_int_int_to_int(var0, var1, var2)));
        } else {
            if (((var5 & 1)) !== (0)) {
                (var12 = (0 - (CoreEngine.exec_a_encodedtextbuffer_int_int_to_int(var0, var1, var2) >> 1)));
            }
        }
        if (((var5 & 64)) !== (0)) {
            (var14 = (0 - var7));
        } else {
            if (((var5 & 32)) !== (0)) {
                (var14 = (0 - var8));
            }
        }
        if ((var9) === (1)) {
            (var3 += var12);
            (var4 += var14);
        } else {
            if ((var9) === (4)) {
                (var3 -= var12);
                (var4 -= var14);
            } else {
                if ((var9) === (2)) {
                    (var3 -= var14);
                    (var4 += var12);
                } else {
                    if ((var9) === (8)) {
                        (var3 -= var14);
                        (var4 -= var12);
                    }
                }
            }
        }
        (var6.val_arr_int_a[0] = var3);
        (var6.val_arr_int_a[1] = var4);
        (var12 = (var0.flagsByte & 63));
        if (((var9 & 5)) !== (0)) {
            (var14 = ((var9 & 4) >> 1));
        } else {
            (var14 = (((var10 & 1) << 1) + ((~var10 & 2) >> 1)));
        }
        let var24 = (((var14) << 24) >> 24);
        if (((var9 & 10)) !== (0)) {
            (var14 = ((var9 & 8) >> 2));
        } else {
            (var14 = ((var10 & 2) + (~var10 & 1)));
        }
        (var10 = (((var14) << 24) >> 24));
        (var9 = var6.val_graphicsadapter_a.renderContext.targetGraphics.getColor());
        for (let var23 = var1; (var23 < (var1 + var2)); var23++) {
            let var31 = 0;
            if ((((var31 = var0.getCharAt(var23))) !== (173) || (var23) === (((var1 + var2) - 1)))) {
                let var13 = var6.getKerning((((var31) << 16) >> 16), var12);
                let var15 = var6.getCharWidth((((var13) << 16) >> 16));
                if ((var13) === (-1)) {
                    if ((var31) !== (32)) {
                        var6.val_graphicsadapter_a.setColor(65280);
                        var6.val_graphicsadapter_a.fillRect(var6.val_arr_int_a[0], var6.val_arr_int_a[1], var15, var8);
                        var6.val_graphicsadapter_a.setColor(16711680);
                        var6.val_graphicsadapter_a.drawLine(var6.val_arr_int_a[0], var6.val_arr_int_a[1], (var6.val_arr_int_a[0] + var15), (var6.val_arr_int_a[1] + var8));
                        var6.val_graphicsadapter_a.drawLine(var6.val_arr_int_a[0], (var6.val_arr_int_a[1] + var8), (var6.val_arr_int_a[0] + var15), var6.val_arr_int_a[1]);
                    }
                    var6.setFontPalette(var6.val_arr_int_a, var15);
                } else {
                    let var22 = (((((var31 = ((((var13 + 1)) << 16) >> 16)) + 1)) << 16) >> 16);
                    (var13 = (var6.val_contextservicenode_a.val_arr_byte_b[var31] & 255));
                    for (let var16 = 0; (var16 < var13); var16++) {
                        if (!var11) {
                            let var17 = (var6.val_contextservicenode_a.val_arr_byte_b[var22] & 255);
                            let var18 = (var6.val_contextservicenode_a.val_arr_byte_b[(var31 = ((((var22 + 1)) << 16) >> 16))] & 255);
                            let var19 = var6.val_contextservicenode_a.val_arr_byte_b[++var31];
                            let var10004 = ++var31;
                            let var10003 = var6.val_contextservicenode_a.val_arr_byte_b[var10004];
                            let var38 = var6.val_contextservicenode_a.val_arr_byte_b[var10004];
                            let var20 = (var6.val_contextservicenode_a.val_arr_byte_b[++var31] & 255);
                            (var22 = ((((((((var31 + 1)) << 16) >> 16) + 1)) << 16) >> 16));
                            let var21 = (var6.val_contextservicenode_a.val_arr_byte_b[((((var31 + 1)) << 16) >> 16)] & 255);
                            (var6.val_arr_int_b[0] = var19);
                            (var31 = ((((var38 - var7)) << 16) >> 16));
                            (var6.val_arr_int_b[1] = var31);
                            (var6.val_arr_int_b[2] = (-var19 - var20));
                            (var6.val_arr_int_b[3] = ((var7 - var10003) - var21));
                            var6.val_graphicsadapter_a.drawRegion((var6.val_contextservicenode_a.val_object_a), var17, var18, var20, var21, var6.val_contextservicenode_a.val_arr_byte_a[7], (var6.val_arr_int_a[0] + var6.val_arr_int_b[var24]), (var6.val_arr_int_a[1] + var6.val_arr_int_b[var10]), 0);
                        }
                    }
                    var6.setFontPalette(var6.val_arr_int_a, var15);
                }
            }
        }
        var6.val_graphicsadapter_a.setColor(var9);
    }
    static exec_a_byte_int_to_void(var0, var1) {
        (CoreEngine.val_byte_e = var0);
        (CoreEngine.val_animationset_i = null);
        try {
            if (((CoreEngine.val_int_az = (CoreEngine.val_int_ay = Math.max((CoreEngine.val_int_ay = Math.trunc(((CoreEngine.val_int_bE - (CharacterPresetTable.val_arr_arr_int_a[var0][11] << 5))) / (2))), 0)))) !== (0)) {
                CoreEngine.exec_b_int_int_to_void(Math.max(0, CoreEngine.val_int_ay), Math.max(0, CoreEngine.val_int_ay));
                (CoreEngine.val_int_az = (CoreEngine.val_int_az + ((CharacterPresetTable.val_arr_arr_int_a[var0][11] - 10) << 5)));
            }
            if (((CoreEngine.val_int_az) === (0) && (CoreEngine.val_int_bE < 320))) {
                (CoreEngine.val_int_az = (CoreEngine.val_int_bE - 320));
            }
            (CoreEngine.val_int_ao = Math.trunc(((-CharacterPresetTable.val_arr_arr_int_a[var0][10] << 5)) / (2)));
            (CoreEngine.val_int_ap = Math.trunc(((CharacterPresetTable.val_arr_arr_int_a[var0][10] << 5)) / (2)));
            (CoreEngine.val_int_aq = ((CoreEngine.val_int_ar = ((CharacterPresetTable.val_arr_arr_int_a[var0][9] + (CoreEngine.val_int_bE - 320)) - CoreEngine.val_int_az)) - (CharacterPresetTable.val_arr_arr_int_a[var0][11] << 5)));
            (CoreEngine.val_int_as = (CoreEngine.val_int_ao + CharacterPresetTable.val_arr_arr_int_a[var0][12]));
            (CoreEngine.val_int_at = (CoreEngine.val_int_ap - CharacterPresetTable.val_arr_arr_int_a[var0][12]));
            for (let var2 = 0; (var2 < 3); var2++) {
                let var4 = CoreEngine.openResourceStream(CharacterPresetTable.val_arr_arr_int_a[var0][var2]);
                (CoreEngine.val_arr_byte_e[var2] = (((var4.readUnsignedByte()) << 24) >> 24));
                (CoreEngine.val_arr_byte_f[var2] = (((var4.readUnsignedByte()) << 24) >> 24));
                (CoreEngine.val_arr_int_k[var2] = (CoreEngine.val_arr_byte_e[var2] << 5));
                (CoreEngine.val_arr_int_l[var2] = (CoreEngine.val_arr_byte_f[var2] << 5));
                var4.readUnsignedByte();
                let var3 = CoreEngine.exec_a_datainputstream_to_int(var4);
                (CoreEngine.val_arr_arr_byte_b[var2] = createArray((CoreEngine.val_arr_byte_e[var2] * CoreEngine.val_arr_byte_f[var2]), 0));
                var4.readFully(CoreEngine.val_arr_arr_byte_b[var2]);
                var4.close();
                if ((CoreEngine.val_animationset_i) === (null)) {
                    switch (var1) {
                        case -1:
                            (CoreEngine.val_animationset_i = CoreEngine.exec_a_int_arr_int_arr_byte_bool_to_animationset(var3, CoreEngine.val_arr_int_q, CoreEngine.val_arr_byte_g, true));
                            (CoreEngine.val_int_ax = 0);
                            break;
                        case 0:
                            (CoreEngine.val_animationset_i = CoreEngine.exec_a_int_int_byte_bool_to_animationset(var3, -1, (((0) << 24) >> 24), true));
                            (CoreEngine.val_int_ax = 0);
                            break;
                        case 1:
                            (CoreEngine.val_animationset_i = CoreEngine.exec_a_int_int_byte_bool_to_animationset(var3, -1, (((1) << 24) >> 24), true));
                            (CoreEngine.val_int_ax = 1);
                    }
                }
                (CoreEngine.val_arr_int_m[var2] = (((CharacterPresetTable.val_arr_arr_int_a[var0][(var2 + 3)] << 5) + Math.trunc((CoreEngine.val_arr_int_k[var2]) / (2))) - CoreEngine.val_int_bC));
                (CoreEngine.val_arr_int_n[var2] = ((-CharacterPresetTable.val_arr_arr_int_a[var0][(var2 + 6)] << 5) - CoreEngine.val_int_az));
                (CoreEngine.val_arr_int_o[var2] = CoreEngine.val_arr_int_m[var2]);
                (CoreEngine.val_arr_int_p[var2] = CoreEngine.val_arr_int_n[var2]);
            }
        } catch (var6) {

        }
        try {
            let var7 = -1;
            switch (CoreEngine.val_byte_e) {
                case 0:
                    (var7 = 117440552);
                    (CoreEngine.val_spritepartsequence_i = CoreEngine.exec_a_int_int_to_spritepartsequence(117440515, 1));
                    (CoreEngine.val_int_au = 1);
                    break;
                case 1:
                    (var7 = 117440551);
                    (CoreEngine.val_spritepartsequence_i = CoreEngine.exec_a_int_int_to_spritepartsequence(117440514, 1));
                    (CoreEngine.val_int_au = 1);
                    break;
                case 2:
                    (var7 = 117440550);
                    (CoreEngine.val_int_au = 1);
                    (CoreEngine.val_spritepartsequence_i = CoreEngine.exec_a_int_int_to_spritepartsequence(117440513, 1));
                    (CoreEngine.val_int_av = 64);
                    break;
                case 3:
                    (var7 = 117440550);
                    (CoreEngine.val_spritepartsequence_i = CoreEngine.exec_a_int_int_to_spritepartsequence(117440513, 1));
                    (CoreEngine.val_int_au = 1);
                    (CoreEngine.val_int_av = 96);
                    (CoreEngine.val_int_aw = ((96 + CoreEngine.val_int_az) + CoreEngine.val_int_bz));
                    break;
                case 4:
                    (var7 = 117440549);
                    (CoreEngine.val_spritepartsequence_i = CoreEngine.exec_a_int_int_to_spritepartsequence(117440512, 1));
                    (CoreEngine.val_int_au = 1);
            }
            if ((var7) !== (-1)) {
                switch (var1) {
                    case -1:
                        (CoreEngine.val_animationset_j = CoreEngine.exec_a_int_arr_int_arr_byte_bool_to_animationset(var7, CoreEngine.val_arr_int_q, CoreEngine.val_arr_byte_g, true));
                        return;
                    case 0:
                        (CoreEngine.val_animationset_j = CoreEngine.exec_a_int_int_byte_bool_to_animationset(var7, -1, (((0) << 24) >> 24), false));
                    default:
                        return;
                    case 1:
                        (CoreEngine.val_animationset_j = CoreEngine.exec_a_int_int_byte_bool_to_animationset(var7, -1, (((1) << 24) >> 24), false));
                        return;
                }
            }
        } catch (var5) {

        }
    }
    static updateSplashState() {
        for (let var0 = 0; (var0 < CoreEngine.val_arr_int_ay.length); var0++) {
            (CoreEngine.val_arr_int_aD[var0] = CoreEngine.val_arr_spritepartsequence_h[var0].getPartYOffset(CoreEngine.val_arr_int_aD[var0], CoreEngine.val_int_e));
        }
        CoreEngine.exec_a_int_int_bool_to_void(0, 0, true);
        CoreEngine.updateBattleState();
        switch (CoreEngine.val_int_bV) {
            case 0:
                if (CoreEngine.val_bool_ap) {
                    if ((--CoreEngine.val_int_bZ < 0)) {
                        (CoreEngine.val_int_bZ = (CoreEngine.val_arr_arr_int_c.length - 1));
                    }
                    CoreEngine.exec_ad_to_void();
                    CoreEngine.exec_a_byte_bool_to_void((((37) << 24) >> 24), false);
                }
                if (CoreEngine.val_bool_aq) {
                    if ((++CoreEngine.val_int_bZ >= CoreEngine.val_arr_arr_int_c.length)) {
                        (CoreEngine.val_int_bZ = 0);
                    }
                    CoreEngine.exec_ad_to_void();
                    CoreEngine.exec_a_byte_bool_to_void((((37) << 24) >> 24), false);
                }
                if ((CoreEngine.val_bool_av || CoreEngine.val_bool_at)) {
                    CoreEngine.exec_a_byte_bool_to_void((((38) << 24) >> 24), false);
                    CoreEngine.exec_v_int_to_void(1);
                }
                if (CoreEngine.val_bool_au) {
                    CoreEngine.exec_u_int_to_void(1);
                }
                break;
            case 1:
                if ((++CoreEngine.val_int_cr >= CoreEngine.val_arr_arr_bool_b[CoreEngine.val_int_bZ].length)) {
                    (CoreEngine.val_int_cr = (CoreEngine.val_arr_arr_bool_b[CoreEngine.val_int_bZ].length - 1));
                    if ((++CoreEngine.val_int_cs > CoreEngine.val_arr_arr_bool_b[CoreEngine.val_int_bZ].length)) {
                        (CoreEngine.val_arr_arr_bool_b[CoreEngine.val_int_bZ] = createArray(((CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ].length - 1) + 1), false));
                        CoreEngine.exec_v_int_to_void(2);
                        return;
                    }
                }
                for (let var1 = 0; (var1 < CoreEngine.val_arr_arr_bool_b[CoreEngine.val_int_bZ].length); var1++) {
                    if (((var1 >= CoreEngine.val_int_cs) && (var1 <= CoreEngine.val_int_cr))) {
                        (CoreEngine.val_arr_arr_bool_b[CoreEngine.val_int_bZ][var1] = true);
                    } else {
                        (CoreEngine.val_arr_arr_bool_b[CoreEngine.val_int_bZ][var1] = false);
                    }
                }
                if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
                    CoreEngine.exec_am_to_void();
                }
                break;
            case 2:
                if (((CoreEngine.val_int_co = (CoreEngine.val_int_co + CoreEngine.val_int_e)) <= 1000)) {
                    (CoreEngine.val_int_cq = (0 + Math.trunc(((CoreEngine.val_int_co * CoreEngine.val_int_cn)) / (1000))));
                } else {
                    if ((CoreEngine.val_int_co >= 1500)) {
                        CoreEngine.exec_v_int_to_void(3);
                    }
                }
                if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
                    CoreEngine.exec_am_to_void();
                }
                return;
            case 3:
                if (((CoreEngine.val_int_cp = (CoreEngine.val_int_cp + CoreEngine.val_int_e)) > 2000)) {
                    CoreEngine.exec_v_int_to_void(5);
                } else {
                    (CoreEngine.val_int_cb = (0 + Math.trunc(((CoreEngine.val_int_cp * CoreEngine.val_int_cc)) / (2000))));
                }
                if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
                    CoreEngine.exec_am_to_void();
                }
                break;
            case 4:
                if (((CoreEngine.val_int_cm = (CoreEngine.val_int_cm + CoreEngine.val_int_e)) >= 1000)) {
                    (CoreEngine.val_int_cd = 0);
                    if ((CoreEngine.val_int_cm >= 2000)) {
                        CoreEngine.exec_am_to_void();
                    }
                } else {
                    (CoreEngine.val_int_cd = (CoreEngine.val_int_cl + Math.trunc(((CoreEngine.val_int_cm * (0 - CoreEngine.val_int_cl))) / (1000))));
                }
                if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
                    CoreEngine.exec_am_to_void();
                }
                break;
            case 5:
                if (((CoreEngine.val_int_cj = (CoreEngine.val_int_cj + CoreEngine.val_int_e)) > 500)) {
                    (CoreEngine.val_int_ci = (CoreEngine.val_int_ci + CoreEngine.val_int_e));
                    (CoreEngine.val_int_cd = (CoreEngine.val_int_cf + Math.trunc(((CoreEngine.val_int_ci * (CoreEngine.val_int_cg - CoreEngine.val_int_cf))) / (CoreEngine.val_int_ch))));
                    if ((CoreEngine.val_int_ci >= CoreEngine.val_int_ch)) {
                        (CoreEngine.val_int_cd = CoreEngine.val_int_cg);
                        if (((CoreEngine.val_int_ck = (CoreEngine.val_int_ck + CoreEngine.val_int_e)) > 1000)) {
                            CoreEngine.exec_am_to_void();
                        }
                    }
                }
                if ((CoreEngine.val_bool_at || CoreEngine.val_bool_av)) {
                    CoreEngine.exec_am_to_void();
                }
        }
        CoreEngine.exec_a_byte_byte_to_void(CoreEngine.val_byte_o, CoreEngine.val_byte_p);
    }
    static updateSelectScreenState() {
        if (!CoreEngine.val_bool_O) {
            try {
                (CoreEngine.val_arr_animationset_a = createArray(CoreEngine.val_arr_int_R.length, null));
                for (let var0 = 0; (var0 < CoreEngine.val_arr_int_R.length); var0++) {
                    (CoreEngine.val_arr_animationset_a[var0] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_R[var0], -1, (((0) << 24) >> 24), false));
                }
                (CoreEngine.val_arr_spritepartsequence_c = createArray(CoreEngine.val_arr_int_T.length, null));
                (CoreEngine.val_arr_int_ab = createArray(CoreEngine.val_arr_int_T.length, 0));
                (CoreEngine.val_arr_int_X = createArray(CoreEngine.val_arr_int_T.length, 0));
                (CoreEngine.val_arr_int_Y = createArray(CoreEngine.val_arr_int_T.length, 0));
                (CoreEngine.val_arr_int_Z = createArray(CoreEngine.val_arr_int_T.length, 0));
                (CoreEngine.val_arr_int_aa = createArray(CoreEngine.val_arr_int_T.length, 0));
                for (let var3 = 0; (var3 < CoreEngine.val_arr_int_T.length); var3++) {
                    (CoreEngine.val_arr_spritepartsequence_c[var3] = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_int_T[var3], 1));
                    (CoreEngine.val_arr_int_ab[var3] = 1);
                    (CoreEngine.val_arr_int_X[var3] = CoreEngine.val_arr_spritepartsequence_c[var3].getSequenceWidth(CoreEngine.val_arr_animationset_a[CoreEngine.val_arr_int_V[var3]]));
                    (CoreEngine.val_arr_int_Y[var3] = CoreEngine.val_arr_spritepartsequence_c[var3].getSequenceHeight(CoreEngine.val_arr_animationset_a[CoreEngine.val_arr_int_V[var3]]));
                    (CoreEngine.val_arr_int_Z[var3] = CoreEngine.val_arr_spritepartsequence_c[var3].getFrameDelay(CoreEngine.val_arr_animationset_a[CoreEngine.val_arr_int_V[var3]]));
                    let var10000 = CoreEngine.val_arr_int_aa;
                    let var1 = null;
                    CoreEngine.val_arr_spritepartsequence_c[var3].calculateBounds((var1 = CoreEngine.val_arr_animationset_a[CoreEngine.val_arr_int_V[var3]]), CoreEngine.val_arr_int_d);
                    (var10000[var3] = CoreEngine.val_arr_int_d[1]);
                }
                (CoreEngine.val_int_bb = 10);
                (CoreEngine.val_arr_int_af = createArray(((CoreEngine.val_int_ba = (CoreEngine.val_int_n - (2 * CoreEngine.val_int_bb))) + 1), 0));
                for (let var4 = 0; (var4 < (CoreEngine.val_int_ba + 1)); var4++) {
                    if (((var4 % 2)) === (0)) {
                        (CoreEngine.val_arr_int_af[var4] = 0);
                    } else {
                        (CoreEngine.val_arr_int_af[var4] = -12304077);
                    }
                }
                (CoreEngine.val_bool_O = true);
            } catch (var2) {
                var2.printStackTrace();
            }
            CoreEngine.exec_a_byte_to_void((((4) << 24) >> 24));
            CoreEngine.exec_a_byte_to_void((((5) << 24) >> 24));
            CoreEngine.exec_a_byte_to_void((((6) << 24) >> 24));
            CoreEngine.exec_U_to_void();
        }
        (CoreEngine.val_int_aV = (Math.trunc((CoreEngine.val_int_n) / (2)) - Math.trunc((CoreEngine.exec_i_to_int()) / (2))));
        (CoreEngine.val_int_aW = CoreEngine.val_arr_int_Y[1]);
        (CoreEngine.val_int_aX = (Math.trunc((CoreEngine.val_int_n) / (2)) - Math.trunc((CoreEngine.exec_i_to_int()) / (2))));
        (CoreEngine.val_int_aY = ((CoreEngine.val_int_o - CoreEngine.val_int_ai) - CoreEngine.exec_h_to_int()));
        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
        (CoreEngine.val_int_aI = 8);
        (CoreEngine.val_int_aJ = ((CoreEngine.val_int_aW + CoreEngine.exec_h_to_int()) + Math.trunc((CoreEngine.exec_c_to_int()) / (2))));
        (CoreEngine.val_int_aK = (CoreEngine.val_int_aY - Math.trunc((CoreEngine.exec_c_to_int()) / (2))));
        (CoreEngine.val_int_bc = 15);
        (CoreEngine.val_arr_int_P[0] = 45);
        (CoreEngine.val_arr_int_Q[0] = 10);
        (CoreEngine.val_arr_int_O[0] = Math.trunc(((CoreEngine.val_int_aK - CoreEngine.val_int_aJ)) / ((CoreEngine.val_arr_int_P[0] + CoreEngine.val_arr_int_Q[0]))));
        (CoreEngine.val_arr_int_P[1] = 20);
        (CoreEngine.val_arr_int_Q[1] = 10);
        (CoreEngine.val_arr_int_O[1] = Math.trunc(((CoreEngine.val_int_aK - CoreEngine.val_int_aJ)) / ((CoreEngine.val_arr_int_P[1] + CoreEngine.val_arr_int_Q[1]))));
        (CoreEngine.val_arr_int_P[2] = 20);
        (CoreEngine.val_arr_int_Q[2] = 10);
        (CoreEngine.val_arr_int_O[2] = Math.trunc(((CoreEngine.val_int_aK - CoreEngine.val_int_aJ)) / ((CoreEngine.val_arr_int_P[2] + CoreEngine.val_arr_int_Q[2]))));
        (CoreEngine.val_arr_int_P[3] = 20);
        (CoreEngine.val_arr_int_Q[3] = 10);
        (CoreEngine.val_arr_int_O[3] = Math.trunc(((CoreEngine.val_int_aK - CoreEngine.val_int_aJ)) / ((CoreEngine.val_arr_int_P[3] + CoreEngine.val_arr_int_Q[3]))));
    }
    static updateVsScreenState() {
        if ((CoreEngine.val_arr_actorstatemachine_a) === (null)) {
            CoreEngine.exec_Q_to_void();
        }
        for (let var0 = 0; (var0 < CoreEngine.val_arr_actorstatemachine_a.length); var0++) {
            let var1 = null;
            switch ((var1 = CoreEngine.val_arr_actorstatemachine_a[var0]).actorCurrentAnimation) {
                case 3:
                    var1.setFacingDirection(0);
            }
            if (CoreEngine.val_arr_actorstatemachine_a[var0].isGrounded()) {
                (CoreEngine.val_arr_actorstatemachine_a[var0].actorPosY = ((var1 = CoreEngine.val_arr_actorstatemachine_a[var0]).actorPosY + CoreEngine.val_int_e));
                switch (var1.actorPosX) {
                    case 0:
                        if ((var1.actorPosY > 1500)) {
                            var1.setFacingDirection(3);
                        }
                        break;
                    case 1:
                        if ((var1.actorActionFrame) === (0)) {
                            if (((var1.val_coreengine_a) !== (null) && (var1.val_coreengine_a.actorTimerW) === (102))) {
                                if ((var1.actorPosY > 1500)) {
                                    var1.setFacingDirection(3);
                                }
                                break;
                            }
                            var1.setActionFrame(2);
                        } else {
                            if ((var1.actorActionFrame) === (1)) {
                                if (var1.isAnimationFinished()) {
                                    var1.setFacingDirection(3);
                                }
                            } else {
                                if ((var1.actorActionFrame) === (3)) {
                                    if (((var1.val_coreengine_a) === (null) || (var1.val_coreengine_a.actorTimerW) !== (32))) {
                                        (var1.val_coreengine_a = null);
                                        var1.setActionFrame(2);
                                    }
                                } else {
                                    if ((var1.actorActionFrame) === (2)) {
                                        if (((Math.trunc((var1.actorPosY) / (400)) > var1.actorVelocityX) && (var1.actorVelocityX < 2))) {
                                            var1.clearState();
                                            var1.actorVelocityX++;
                                        }
                                        if ((var1.actorPosY < 750)) {
                                            var1.setPosition((var1.val_coreengine_a.exec_a_to_int() + (var1.val_coreengine_a.actorCurrentAnimIndex * 10)), var1.getY());
                                        } else {
                                            if ((var1.actorPosY < 1500)) {
                                                var1.translatePosition(Math.trunc((((-var1.actorFacingDirection * 98304) * CoreEngine.val_int_e)) / (1000)), Math.trunc(((-81920 * CoreEngine.val_int_e)) / (1000)));
                                            } else {
                                                var1.setFacingDirection(3);
                                            }
                                        }
                                    } else {
                                        if (((var1.actorActionFrame) === (5) && var1.isAnimationFinished())) {
                                            var1.setFacingDirection(3);
                                        }
                                    }
                                }
                            }
                        }
                        break;
                    case 2:
                        if ((var1.actorActionFrame) === (0)) {
                            if ((var1.actorPosY > 500)) {
                                var1.setFacingDirection(3);
                            }
                        } else {
                            if ((var1.actorActionFrame) === (2)) {
                                if ((var1.actorPosY < 1500)) {
                                    var1.translatePosition(Math.trunc((((-var1.actorFacingDirection * 98304) * CoreEngine.val_int_e)) / (1000)), Math.trunc(((-81920 * CoreEngine.val_int_e)) / (1000)));
                                } else {
                                    var1.setFacingDirection(3);
                                }
                            } else {
                                if (var1.isAnimationFinished()) {
                                    var1.setFacingDirection(3);
                                }
                            }
                        }
                        break;
                    case 3:
                        if (((var1.val_coreengine_b) === (null) || (var1.val_coreengine_b.actorTimerW) !== (21))) {
                            var1.setFacingDirection(3);
                        } else {
                            if (var1.isAnimationFinished()) {
                                var1.setActionFrame(0);
                            }
                        }
                }
                switch (var1.actorPosX) {
                    case 0:
                        var1.translatePosition(Math.trunc((((var1.actorFacingDirection * var1.getPosX()) * CoreEngine.val_int_e)) / (1000)), 0);
                        break;
                    case 1:
                        if ((var1.actorActionFrame) === (0)) {
                            (var1.actorBoundsArray[0] = var1.val_coreengine_a.actorPhysicsArray[0]);
                            (var1.actorBoundsArray[1] = (var1.val_coreengine_a.actorPhysicsArray[1] + -22016));
                        } else {
                            if (((var1.actorActionFrame) === (3) && (var1.val_coreengine_a) !== (null))) {
                                CoreEngine.exec_a_entityinterface_int_int_to_void(var1.val_coreengine_a, Math.trunc((((var1.actorFacingDirection * var1.getPosX()) * CoreEngine.val_int_e)) / (1000)), 0);
                                var1.setPosition(var1.val_coreengine_a.exec_a_to_int(), (var1.val_coreengine_a.exec_b_to_int() + -12));
                            }
                        }
                }
                let var2 = null;
                if (((var2 = var1.getCurrentSequence())) !== (null)) {
                    (var1.actorState = var2.getPartYOffset(var1.actorState, CoreEngine.val_int_e));
                }
            }
        }
    }
    static exec_c_int_to_void(var0) {
        (CoreEngine.val_int_aD = 0);
        (CoreEngine.val_int_aC = var0);
        switch (var0) {
            case 0:
                CoreEngine.exec_b_byte_bool_to_void((((5) << 24) >> 24), false);
                CoreEngine.exec_aa_to_void();
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_y, true, null);
                if ((CoreEngine.val_bool_X && CoreEngine.val_bool_am)) {
                    CoreEngine.exec_e_int_to_void(CoreEngine.exec_e_int_to_int(22));
                    (CoreEngine.val_bool_X = false);
                    return;
                }
                break;
            case 1:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_z, true, null);
                return;
            case 2:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_H, true, null);
                return;
            case 3:
                let var9 = null;
                (var9 = new EncodedTextBuffer(1000));
                var9.appendBuffer(CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(41, null));
                let var4 = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(135, null);
                var9.appendString(("||" + var4));
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_J, true, var9);
                return;
            case 4:
                let var8 = null;
                if ((CoreEngine.val_int_bw) === (1)) {
                    (var8 = CoreEngine.exec_c_to_encodedtextbuffer());
                } else {
                    (var8 = CoreEngine.exec_b_to_encodedtextbuffer());
                }
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_K, true, var8);
                return;
            case 5:
                let var10000 = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(CoreEngine.val_arr_int_I[2], null);
                let var6 = CoreEngine.val_string_a;
                let var3 = var10000;
                if ((var10000.childBuffers) === (null)) {
                    (var3.childBuffers = createArray(1, null));
                }
                (var3.childBuffers[0] = new EncodedTextBuffer(var6));
                (var10000 = var3.concatAll(var3.childBuffers));
                (var3.childBuffers[0] = null);
                let var7 = var10000;
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_I, true, var7);
                return;
            case 6:
                CoreEngine.exec_w_int_to_void(-1);
                return;
            case 7:
                CoreEngine.exec_w_int_to_void(CoreEngine.val_int_cH);
                return;
            case 8:
                CoreEngine.exec_a_arr_int_to_void(CoreEngine.val_arr_int_M);
                return;
            case 9:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_N, true, null);
                return;
            case 10:
                CoreEngine.exec_a_arr_int_bool_to_void(CoreEngine.val_arr_int_A, true);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_g);
                return;
            case 11:
                CoreEngine.exec_a_arr_int_bool_to_void(CoreEngine.val_arr_int_A, false);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_g);
                return;
            case 12:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_B, true, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bv);
                return;
            case 13:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_B, false, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bv);
                return;
            case 14:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_C, true, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bu);
                return;
            case 15:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_C, false, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bu);
                return;
            case 16:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_F, true, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bx);
                return;
            case 17:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_F, false, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bx);
                return;
            case 18:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_G, true, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bw);
                return;
            case 19:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_G, false, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bw);
                return;
            case 20:
                CoreEngine.setGameState(10);
                return;
            case 21:
                (CoreEngine.val_bool_am = false);
                CoreEngine.exec_c_to_bool();
                if (CoreEngine.val_bool_aa) {
                    CoreEngine.exec_a_arr_int_to_void(CoreEngine.val_arr_int_L);
                    return;
                }
                (CoreEngine.val_long_g = 0);
                CoreEngine.setGameState(11);
                return;
            case 22:
                (CoreEngine.val_bool_am = true);
                CoreEngine.setGameState(11);
                break;
            case 23:
                CoreEngine.exec_I_to_void();
                (CoreEngine.val_bool_ah = false);
                CoreEngine.exec_Z_to_void();
                return;
            case 24:
                CoreEngine.exec_aa_to_void();
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_v, false, null);
                return;
            case 25:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_w, false, null);
                return;
            case 26:
                let var2 = null;
                (var2 = new EncodedTextBuffer(1500));
                let var1 = null;
                if ((CoreEngine.val_int_bw) === (1)) {
                    (var1 = CoreEngine.exec_c_to_encodedtextbuffer());
                } else {
                    (var1 = CoreEngine.exec_b_to_encodedtextbuffer());
                }
                (var1 = var2.appendBuffer(var1).appendString("||").appendBuffer(CoreEngine.val_coreengine_b.fighterTitleBuffer).appendString("||").appendBuffer(CoreEngine.exec_a_to_encodedtextbuffer()));
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_x, false, var1);
                return;
            case 27:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_D, false, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bv);
                return;
            case 28:
                CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(CoreEngine.val_arr_int_E, false, null);
                CoreEngine.exec_e_int_to_void(CoreEngine.val_int_bu);
                return;
        }
    }
    static updateBattleState() {
        if ((CoreEngine.val_int_eU) !== (CoreEngine.val_int_eK)) {
            let var0 = Math.trunc(((96 * CoreEngine.val_int_e)) / (1000));
            if ((CoreEngine.val_int_eU > CoreEngine.val_int_eK)) {
                (CoreEngine.val_int_eK += var0);
                if ((CoreEngine.val_int_eU < CoreEngine.val_int_eK)) {
                    (CoreEngine.val_int_eK = CoreEngine.val_int_eU);
                }
            } else {
                (CoreEngine.val_int_eK -= var0);
                if ((CoreEngine.val_int_eU > CoreEngine.val_int_eK)) {
                    (CoreEngine.val_int_eK = CoreEngine.val_int_eU);
                }
            }
        }
        if ((CoreEngine.val_int_eV) !== (CoreEngine.val_int_eL)) {
            (CoreEngine.val_int_eL = (CoreEngine.val_int_eL + Math.trunc(((CoreEngine.val_int_eV - CoreEngine.val_int_eL)) / (3))));
        }
        if ((CoreEngine.val_int_eW > 0)) {
            (CoreEngine.val_int_eW = (CoreEngine.val_int_eW - CoreEngine.val_int_e));
            let var3 = 0;
            if (CoreEngine.val_bool_e) {
                (var3 = 5);
            } else {
                (var3 = 0);
            }
            (CoreEngine.val_int_eX = var3);
        } else {
            (CoreEngine.val_int_eX = 0);
        }
        (CoreEngine.val_int_eO = (CoreEngine.val_int_eK - Math.trunc((CoreEngine.val_int_eM) / (2))));
        (CoreEngine.val_int_eP = (CoreEngine.val_int_eL - Math.trunc((CoreEngine.val_int_eN) / (2))));
        (CoreEngine.val_int_eQ = (CoreEngine.val_int_eO + CoreEngine.val_int_eM));
        let var4 = ((CoreEngine.val_int_eP + CoreEngine.val_int_eN) - Math.max((CoreEngine.val_int_eR = (CoreEngine.val_int_eP + CoreEngine.val_int_eN)), 0));
        (CoreEngine.val_int_eR -= var4);
        (CoreEngine.val_int_eP -= var4);
        (CoreEngine.val_int_eL -= var4);
        (var4 = (CoreEngine.val_int_eP - Math.max(CoreEngine.val_int_eP, CoreEngine.val_int_aq)));
        (CoreEngine.val_int_eR -= var4);
        (CoreEngine.val_int_eP -= var4);
        (CoreEngine.val_int_eL -= var4);
        (var4 = (CoreEngine.val_int_eR - Math.min(CoreEngine.val_int_eR, CoreEngine.val_int_ar)));
        (CoreEngine.val_int_eR -= var4);
        (CoreEngine.val_int_eP -= var4);
        (CoreEngine.val_int_eL -= var4);
        (var4 = (CoreEngine.val_int_eO - Math.max(CoreEngine.val_int_eO, CoreEngine.val_int_ao)));
        (CoreEngine.val_int_eO -= var4);
        (CoreEngine.val_int_eQ -= var4);
        (CoreEngine.val_int_eK -= var4);
        (var4 = (CoreEngine.val_int_eQ - Math.min(CoreEngine.val_int_eQ, CoreEngine.val_int_ap)));
        (CoreEngine.val_int_eO -= var4);
        (CoreEngine.val_int_eQ -= var4);
        let var10000 = (CoreEngine.val_int_eK -= var4);
        let var1 = (((CoreEngine.val_int_eL + CoreEngine.val_int_eX) + Math.trunc((CoreEngine.val_int_bE) / (2))) - CoreEngine.val_int_ar);
        (var4 = var10000);
        for (let var2 = 0; (var2 < 3); var2++) {
            (CoreEngine.val_arr_int_o[var2] = (((var4 * CharacterPresetTable.val_arr_arr_int_a[CoreEngine.val_byte_e][(var2 + 13)]) >> 8) + CoreEngine.val_arr_int_m[var2]));
            (CoreEngine.val_arr_int_p[var2] = (((var1 * CharacterPresetTable.val_arr_arr_int_a[CoreEngine.val_byte_e][(var2 + 16)]) >> 8) + CoreEngine.val_arr_int_n[var2]));
        }
        switch (CoreEngine.val_byte_e) {
            case 0:
                (CoreEngine.val_int_au = CoreEngine.val_spritepartsequence_i.getPartYOffset(CoreEngine.val_int_au, CoreEngine.val_int_e));
                (CoreEngine.val_int_av = (-CoreEngine.val_arr_int_o[1] + 352));
                (CoreEngine.val_int_aw = ((-CoreEngine.val_arr_int_p[1] + 224) + CoreEngine.val_int_bz));
                break;
            case 1:
                (CoreEngine.val_int_au = CoreEngine.val_spritepartsequence_i.getPartYOffset(CoreEngine.val_int_au, CoreEngine.val_int_e));
                (CoreEngine.val_int_av = (-CoreEngine.val_arr_int_o[0] + 288));
                (CoreEngine.val_int_aw = ((-CoreEngine.val_arr_int_p[0] + 160) + CoreEngine.val_int_bz));
                break;
            case 2:
                (CoreEngine.val_int_au = CoreEngine.val_spritepartsequence_i.getPartYOffset(CoreEngine.val_int_au, CoreEngine.val_int_e));
                (CoreEngine.val_int_aw = ((((64 - CoreEngine.val_arr_int_p[0]) + CoreEngine.val_arr_int_n[0]) + CoreEngine.val_int_ay) + CoreEngine.val_int_bz));
                break;
            case 3:
                (CoreEngine.val_int_au = CoreEngine.val_spritepartsequence_i.getPartYOffset(CoreEngine.val_int_au, CoreEngine.val_int_e));
                break;
            case 4:
                (CoreEngine.val_int_au = CoreEngine.val_spritepartsequence_i.getPartYOffset(CoreEngine.val_int_au, CoreEngine.val_int_e));
                (CoreEngine.val_int_av = (-CoreEngine.val_arr_int_o[1] + 320));
                (CoreEngine.val_int_aw = ((-CoreEngine.val_arr_int_p[1] + 256) + CoreEngine.val_int_bz));
        }
        (CoreEngine.val_int_eS = (CoreEngine.val_int_eO + 36));
        (CoreEngine.val_int_eT = (CoreEngine.val_int_eQ - 36));
        if ((CoreEngine.val_int_dL) === (4)) {
            CoreEngine.exec_c_int_int_int_to_void(Math.max(CoreEngine.val_int_eS, CoreEngine.val_int_as), -CoreEngine.val_int_bE, Math.min(CoreEngine.val_int_eT, CoreEngine.val_int_at));
        } else {
            CoreEngine.exec_c_int_int_int_to_void(Math.max(CoreEngine.val_int_eS, CoreEngine.val_int_as), (CoreEngine.val_int_eP + 78), Math.min(CoreEngine.val_int_eT, CoreEngine.val_int_at));
        }
    }
    static resumeAudioChannel(var0) {
        while ((var0.channelId) !== (2)) {
            (var0 = var0.nextContext);
        }
        while (true) {
            let var15 = var0.val_audioclipnode_b;
            if (((CoreEngine.getClipDuration(var0.val_audioclipnode_b)) === (200) && ((var15.mediaPlayer) !== (null) || CoreEngine.isClipPlayable(var15)))) {
                let var1 = CoreEngine.getGlobalAudioContext();
                let var2 = true;
                let var3 = false;
                while (!var3) {
                    try {

                        try {
                            label238: {
                                let var14 = null;
                                let var40 = null;
                                label219: {
                                    if ((var15.mediaPlayer.getState()) !== (300)) {
                                        let var4 = var1.prevContext;
                                        let var5 = var15.clipName;
                                        let var6 = var2;
                                        let var7 = Integer.MAX_VALUE;
                                        let var8 = -1;
                                        let var9 = false;
                                        let var10 = var4.val_arr_audioclipnode_a;
                                        let var11 = Integer.MAX_VALUE;
                                        let var12 = -1;
                                        let var13 = 0;
                                        let var36 = 0;
                                        let var37 = null;
                                        let var41 = -1;

                                        try {
                                            (var36 = 0);
                                        } catch (var28) {
                                            (var14 = var28);
                                            break label219;
                                        }
                                        label215: {
                                            while (true) {
                                                label240: {
                                                    label211: {
                                                        try {
                                                            if ((var36 >= CoreEngine.audioChannelCount)) {
                                                                break label211;
                                                            }
                                                            if ((var10[var36]) === (null)) {
                                                                if ((var6 && !var9)) {
                                                                    break;
                                                                }
                                                                break label240;
                                                            }
                                                        } catch (var31) {
                                                            (var14 = var31);
                                                            break label219;
                                                        }
                                                        try {
                                                            if ((var10[var36].clipName) === (var5)) {
                                                                var13++;
                                                            }
                                                            break label240;
                                                        } catch (var27) {
                                                            (var14 = var27);
                                                            break label219;
                                                        }
                                                    }
                                                    label242: {
                                                        label243: {
                                                            try {
                                                                if (var9) {
                                                                    (var8 = var12);
                                                                }
                                                                if ((var8) === (-1)) {
                                                                    break label243;
                                                                }
                                                                (var37 = var10[var8]);
                                                                (var13 = 0);
                                                            } catch (var29) {
                                                                (var14 = var29);
                                                                break label219;
                                                            }
                                                            while (true) {
                                                                try {
                                                                    if ((var13 > 0)) {
                                                                        break;
                                                                    }
                                                                    if ((CoreEngine.getGlobalAudioContext().contextPool[var13].nextContext.activeClipNode.nextClip) === (var37)) {
                                                                        CoreEngine.stopClipPlayback(var37);
                                                                        break label242;
                                                                    }
                                                                } catch (var30) {
                                                                    (var14 = var30);
                                                                    break label219;
                                                                }
                                                                try {
                                                                    var13++;
                                                                } catch (var25) {
                                                                    (var14 = var25);
                                                                    break label219;
                                                                }
                                                            }
                                                            try {
                                                                CoreEngine.freeAudioClip(var37);
                                                            } catch (var24) {
                                                                (var14 = var24);
                                                                break label219;
                                                            }
                                                        }
                                                        try {

                                                        } catch (var23) {
                                                            (var14 = var23);
                                                            break label219;
                                                        }
                                                        (var41 = var8);
                                                        break label215;
                                                    }
                                                    (var41 = var8);
                                                    break label215;
                                                }
                                                try {
                                                    if (var5.equals("audio/midi")) {
                                                        if ((var13) === (16)) {
                                                            (var9 = true);
                                                        }
                                                    } else {
                                                        if (var5.equals("audio/x-wav")) {
                                                            if ((var13) === (16)) {
                                                                (var9 = true);
                                                            }
                                                        } else {
                                                            if ((var5.equals("audio/amr") && (var13) === (16))) {
                                                                (var9 = true);
                                                            }
                                                        }
                                                    }
                                                    if ((((var10[var36]) !== (null) && (var10[var36].clipName) === (var5)) && (var4.val_arr_int_a[var36] < var11))) {
                                                        (var11 = var4.val_arr_int_a[var36]);
                                                        (var12 = var36);
                                                    }
                                                    if ((((var4.val_arr_int_a[var36] < var7) && !var9) && (var10[var36]) !== (null))) {
                                                        (var7 = var4.val_arr_int_a[var36]);
                                                        (var8 = var36);
                                                    }
                                                    var36++;
                                                } catch (var26) {
                                                    (var14 = var26);
                                                    break label219;
                                                }
                                            }
                                            (var41 = var36);
                                        }
                                        if ((var41) !== (-1)) {
                                            var15.mediaPlayer.prefetch();
                                            let var38 = var1.prevContext;

                                            try {
                                                (var38.val_arr_audioclipnode_a[var41] = var15);
                                                let var10000 = var38.val_arr_int_a;
                                                let var10002 = var38.playbackPosition;
                                                let var43 = (var38.playbackPosition + 1);
                                                (var38.playbackPosition = var43);
                                                (var10000[var41] = var10002);
                                                break label238;
                                            } catch (var21) {
                                                let var42 = var21;
                                                while (true) {
                                                    try {
                                                        throw var42;
                                                    } catch (var20) {
                                                        (var42 = var20);
                                                    }
                                                }
                                            }
                                        }
                                    }
                                    (var3 = true);
                                    break label238;
                                }
                                while (true) {
                                    try {
                                        throw var14;
                                    } catch (var22) {
                                        (var14 = var22);
                                    }
                                }
                            }
                        } catch (var32) {
                            let var16 = var32;
                            while (true) {
                                try {
                                    throw var16;
                                } catch (var19) {
                                    (var16 = var19);
                                }
                            }
                        }
                    } catch (var33) {
                        (var2 = false);
                    }
                }
            }
            try {
                let var44 = null;

                try {
                    if ((CoreEngine.getClipDuration(var15)) === (300)) {
                        CoreEngine.getGlobalAudioContext();
                        if (!CoreEngine.getGlobalAudioContext().isPlaying) {
                            CoreEngine.destroyAudioChannel(var0);
                            if (var0.isPaused) {
                                (var0.isPaused = false);
                            }
                            var15.mediaPlayer.start();
                        }
                    }
                    return;
                } catch (var18) {
                    let var39 = var18;
                    while (true) {
                        try {
                            throw var39;
                        } catch (var17) {
                            (var39 = var17);
                        }
                    }
                }
            } catch (var34) {
                if ((var0.playbackPosition >= 20)) {
                    return;
                }
                var0.playbackPosition++;
            }
        }
    }
    static exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var0, var1, var2, var3, var4, var5, var6, var7, var8, var9, var10, var11, var12, var13, var14, var15, var16, var17, var18, var19) {
        let var20 = -1;
        for (let var21 = 0; (var21 < 50); var21++) {
            if ((CoreEngine.val_arr_effectactor_a[var21].effectAccelerationX) === (0)) {
                (var20 = var21);
                break;
            }
        }
        let var23 = var20;
        if ((var20) !== (-1)) {
            (CoreEngine.val_arr_effectactor_a[var20].effectCoordinates[0] = (var0 << 8));
            (CoreEngine.val_arr_effectactor_a[var20].effectCoordinates[1] = (var1 << 8));
            (CoreEngine.val_arr_effectactor_a[var20].effectPosX = var2);
            (CoreEngine.val_arr_effectactor_a[var20].effectPosY = var3);
            (CoreEngine.val_arr_effectactor_a[var20].effectVelocityX = var4);
            (CoreEngine.val_arr_effectactor_a[var20].effectVelocityY = var5);
            (CoreEngine.val_arr_effectactor_a[var20].effectCoordinates[2] = var5);
            (CoreEngine.val_arr_effectactor_a[var20].effectCoordinates[7] = var6);
            (CoreEngine.val_arr_effectactor_a[var20].effectAlpha = var7);
            (CoreEngine.val_arr_effectactor_a[var20].effectScale = var8);
            (CoreEngine.val_arr_effectactor_a[var20].effectAccelerationY = var9);
            (CoreEngine.val_arr_effectactor_a[var20].isEffectActive = var10);
            (CoreEngine.val_arr_effectactor_a[var20].effectFlipped = var11);
            (CoreEngine.val_arr_effectactor_a[var20].effectVisible = var12);
            (CoreEngine.val_arr_effectactor_a[var20].effectLooping = var13);
            (CoreEngine.val_arr_effectactor_a[var20].effectAttached = var14);
            (CoreEngine.val_arr_effectactor_a[var20].val_animationset_a = var16);
            (CoreEngine.val_arr_effectactor_a[var20].val_spritepartsequence_a = var17);
            (CoreEngine.val_arr_effectactor_a[var20].val_animationset_b = var18);
            (CoreEngine.val_arr_effectactor_a[var20].val_spritepartsequence_b = var19);
            (CoreEngine.val_arr_effectactor_a[var20].val_bool_g = var15);
            (CoreEngine.val_arr_effectactor_a[var20].effectAccelerationX = 1);
            (CoreEngine.val_arr_effectactor_a[var20].effectType = 0);
            switch (var9) {
                case 0:
                    (CoreEngine.val_arr_effectactor_a[var20].effectRotation = 1);
                    CoreEngine.val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(1);
                    break;
                case 1:
                    (CoreEngine.val_arr_effectactor_a[var20].effectRotation = 2);
                    CoreEngine.val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(1);
                    break;
                case 2:
                    (CoreEngine.val_arr_effectactor_a[var20].effectRotation = 1);
                    CoreEngine.val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(0);
                    break;
                case 3:
                    (CoreEngine.val_arr_effectactor_a[var20].effectRotation = 2);
                    CoreEngine.val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(0);
                    let var22 = CoreEngine.val_arr_effectactor_a[var20].val_spritepartsequence_a;
                    (CoreEngine.val_arr_effectactor_a[var20].effectRotation = CoreEngine.exec_a_int_int_int_to_int(CoreEngine.val_arr_effectactor_a[var20].val_spritepartsequence_a.sequenceFlags, (var22.partOffsets.length - 1), 2));
                    break;
                case 4:
                    (CoreEngine.val_arr_effectactor_a[var20].effectRotation = 1);
                    CoreEngine.val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(2);
                case 5:
            }
            CoreEngine.exec_b_entityinterface_int_to_void(CoreEngine.val_arr_effectactor_a[var23], 2);
            CoreEngine.val_int_el++;
            if ((var23 > CoreEngine.val_int_em)) {
                (CoreEngine.val_int_em = var23);
            }
            return true;
        } else {
            return false;
        }
    }
    static exec_a_arr_byte_int_contextservicenode_to_void(var0, var1, var2) {
        while ((var2.val_short_a) === (5)) {
            (var2 = var2.val_contextservicenode_a);
        }
        try {
            CoreEngine.exec_b_bool_to_void(true);
            if ((CoreEngine.val_arr_byte_n) === (null)) {
                ((CoreEngine.val_arr_byte_n = createArray((var1 + 3), 0))[0] = (((CoreEngine.val_int_ep) << 24) >> 24));
                (CoreEngine.val_arr_byte_n[1] = ((((var1 >> 8)) << 24) >> 24));
                (CoreEngine.val_arr_byte_n[2] = (((var1) << 24) >> 24));
                System.arraycopy(var0, 0, CoreEngine.val_arr_byte_n, 3, var1);
                CoreEngine.saveRecordStore.setRecord(CoreEngine.val_int_eo, CoreEngine.val_arr_byte_n, 0, CoreEngine.val_arr_byte_n.length);
            } else {
                let var5 = 0;
                if ((CoreEngine.val_int_en < CoreEngine.val_arr_byte_n.length)) {
                    (var5 = (((CoreEngine.val_arr_byte_n[(CoreEngine.val_int_en + 1)] & 255) << 8) | (CoreEngine.val_arr_byte_n[(CoreEngine.val_int_en + 2)] & 255)));
                }
                if ((var5) === (var1)) {
                    (CoreEngine.val_int_en += 3);
                    System.arraycopy(var0, 0, CoreEngine.val_arr_byte_n, CoreEngine.val_int_en, var1);
                    CoreEngine.saveRecordStore.setRecord(CoreEngine.val_int_eo, CoreEngine.val_arr_byte_n, 0, CoreEngine.val_arr_byte_n.length);
                } else {
                    if ((var5 > var1)) {
                        CoreEngine.val_int_en++;
                        (CoreEngine.val_arr_byte_n[CoreEngine.val_int_en++] = ((((var1 >> 8)) << 24) >> 24));
                        (CoreEngine.val_arr_byte_n[CoreEngine.val_int_en++] = (((var1) << 24) >> 24));
                        System.arraycopy(var0, 0, CoreEngine.val_arr_byte_n, CoreEngine.val_int_en, var1);
                        System.arraycopy(CoreEngine.val_arr_byte_n, (CoreEngine.val_int_en + var5), CoreEngine.val_arr_byte_n, (CoreEngine.val_int_en + var1), ((CoreEngine.val_arr_byte_n.length - CoreEngine.val_int_en) - var5));
                        CoreEngine.saveRecordStore.setRecord(CoreEngine.val_int_eo, CoreEngine.val_arr_byte_n, 0, ((CoreEngine.val_arr_byte_n.length - var5) + var1));
                    } else {
                        let var3 = ((CoreEngine.val_arr_byte_n.length + var1) - var5);
                        if ((var5) === (0)) {
                            (var3 += 3);
                        }
                        let var6 = createArray(var3, 0);
                        System.arraycopy(CoreEngine.val_arr_byte_n, 0, var6, 0, CoreEngine.val_int_en);
                        (var6[CoreEngine.val_int_en++] = (((CoreEngine.val_int_ep) << 24) >> 24));
                        (var6[CoreEngine.val_int_en++] = ((((var1 >> 8)) << 24) >> 24));
                        (var6[CoreEngine.val_int_en++] = (((var1) << 24) >> 24));
                        System.arraycopy(var0, 0, var6, CoreEngine.val_int_en, var1);
                        if ((var5) !== (0)) {
                            System.arraycopy(CoreEngine.val_arr_byte_n, (CoreEngine.val_int_en + var5), var6, (CoreEngine.val_int_en + var1), (CoreEngine.val_arr_byte_n.length - (CoreEngine.val_int_en + var5)));
                        }
                        CoreEngine.saveRecordStore.setRecord(CoreEngine.val_int_eo, var6, 0, var6.length);
                    }
                }
            }
            CoreEngine.saveRecordStore.closeRecordStore();
        } catch (var4) {

        }
    }
    static exec_F_to_void() {
        for (let var0 = 0; (var0 < CoreEngine.val_arr_effectactor_a.length); var0++) {
            let var1 = null;
            if (((((var1 = CoreEngine.val_arr_effectactor_a[var0])) !== (null) && (var1.effectAccelerationX) !== (0)) && (var1.effectCoordinates[2] <= 0))) {
                (var1.effectPalette = (var1.effectCoordinates[0] - var1.effectTargetX));
                (var1.effectPriority = (var1.effectCoordinates[1] - var1.effectTargetY));
                (var1.effectTargetX = var1.effectCoordinates[0]);
                (var1.effectTargetY = var1.effectCoordinates[1]);
                switch (var1.effectAccelerationX) {
                    case 1:
                        if ((var1.effectAccelerationY) === (5)) {
                            if ((var1.effectAccelerationX) === (1)) {
                                let var10000 = var1.effectPalette;
                                let var6 = var1.effectPriority;
                                let var4 = var10000;
                                let var8 = var10000;
                                if ((var4 < 0)) {
                                    (var8 = (0 - var4));
                                }
                                let var10 = var6;
                                if ((var6 < 0)) {
                                    (var10 = (0 - var6));
                                }
                                let var18 = 0;
                                label136: {
                                    if ((var10 <= var8)) {
                                        if ((var8) === (0)) {
                                            (var18 = ((var6 >= 0) ? 0 : 2));
                                            break label136;
                                        }
                                        (var8 = Math.trunc(((var10 << 9)) / (var8)));
                                        (var10 = 1);
                                    } else {
                                        if ((var10) === (0)) {
                                            (var18 = ((var4 >= 0) ? 1 : 3));
                                            break label136;
                                        }
                                        (var8 = Math.trunc(((var8 << 9)) / (var10)));
                                        (var10 = 0);
                                    }
                                    (var8 = (CoreEngine.val_arr_long_a[(((var8 >> 2)) | 0)] + var8));
                                    if ((var4 >= 0)) {
                                        if ((var6 >= 0)) {
                                            if ((var10) !== (0)) {
                                                (var8 = (1024 - var8));
                                            }
                                        } else {
                                            if ((var10) !== (0)) {
                                                (var8 += 1024);
                                            } else {
                                                (var8 = (2048 - var8));
                                            }
                                        }
                                    } else {
                                        if ((var6 >= 0)) {
                                            if ((var10) !== (0)) {
                                                (var8 += 3072);
                                            } else {
                                                (var8 = (4096 - var8));
                                            }
                                        } else {
                                            if ((var10) !== (0)) {
                                                (var8 = (3072 - var8));
                                            } else {
                                                (var8 += 2048);
                                            }
                                        }
                                    }
                                    if (((var10 = (180 - ((var8 * 90) >> 10))) < 0)) {
                                        (var10 += 360);
                                    }
                                    (var18 = ((var10) | 0));
                                }
                                let var3 = Math.trunc(((var18 * var1.val_spritepartsequence_a.partOffsets.length)) / (360));
                                let var2 = ((var1.effectRotation & 65532) >>> 2);
                                if ((var3) !== (var2)) {
                                    if (var1.effectFinished) {
                                        if ((var3 < var2)) {
                                            (var3 = var2);
                                        }
                                    } else {
                                        if ((var3 > var2)) {
                                            (var3 = var2);
                                        }
                                    }
                                    (var1.effectRotation = var1.val_spritepartsequence_a.getPartXOffset(var3));
                                }
                            }
                        } else {
                            (var1.effectRotation = var1.val_spritepartsequence_a.getPartYOffset(var1.effectRotation, CoreEngine.val_int_e));
                        }
                        if ((var1.effectFlipped && (var1.effectPriority > 0))) {
                            let var12 = createArray(4, 0);
                            var1.val_spritepartsequence_a.renderPart(((var1.effectRotation & 65532) >>> 2), var1.val_animationset_a, var12, 0);
                            if (((Math.trunc((((var12[3] - var12[1]) << 8)) / (2)) + var1.effectCoordinates[1]) >= 0)) {
                                (var1.effectRotation = 1);
                                (var1.effectAccelerationX = 2);
                                (var1.effectCoordinates[1] = 0);
                                if (var1.effectAttached) {
                                    let var19 = var1.effectCoordinates;
                                    let var13 = (var1.effectCoordinates[1] + ((CoreEngine.exec_a_int_int_to_int(0, CharacterPresetTable.val_arr_arr_int_a[CoreEngine.val_byte_e][21]) - Math.trunc((CharacterPresetTable.val_arr_arr_int_a[CoreEngine.val_byte_e][21]) / (2))) << 8));
                                    (var19[1] = var13);
                                }
                                (var1.val_bool_g = true);
                            }
                        }
                        break;
                    case 2:
                        (var1.effectRotation = var1.val_spritepartsequence_b.getPartYOffset(var1.effectRotation, CoreEngine.val_int_e));
                }
                switch (var1.effectAlpha) {
                    case 0:
                        (var1.effectScale = (var1.effectScale - CoreEngine.val_int_e));
                        if ((var1.effectScale < 0)) {
                            CoreEngine.exec_a_effectactor_to_void(var1);
                        }
                        break;
                    case 1:
                        if (((var1.effectRotation & 3)) === (0)) {
                            CoreEngine.exec_a_effectactor_to_void(var1);
                        }
                    case 2:
                }
                if ((var1.effectVisible && (((var1.effectCoordinates[0] >> 8) < CoreEngine.val_int_eO) || ((var1.effectCoordinates[0] >> 8) > CoreEngine.val_int_eQ)))) {
                    CoreEngine.exec_a_effectactor_to_void(var1);
                }
            }
        }
    }
    static setGameState(var0) {
        (CoreEngine.val_int_by = var0);
        switch (CoreEngine.val_int_h) {
            case 0:
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 10:
            default:
                break;
            case 1:
                (CoreEngine.val_animationset_c = null);
                (CoreEngine.val_spritepartsequence_c = null);
                break;
            case 2:
                (CoreEngine.val_animationset_d = null);
                (CoreEngine.val_spritepartsequence_d = null);
                break;
            case 3:
                (CoreEngine.val_animationset_a = null);
                (CoreEngine.val_animationset_b = null);
                (CoreEngine.val_spritepartsequence_a = null);
                (CoreEngine.val_spritepartsequence_b = null);
                break;
            case 9:
                (CoreEngine.val_arr_animationset_a = null);
                (CoreEngine.val_arr_spritepartsequence_c = null);
                (CoreEngine.val_bool_O = false);
                CoreEngine.exec_g_byte_to_void((((5) << 24) >> 24));
                CoreEngine.exec_g_byte_to_void((((8) << 24) >> 24));
                CoreEngine.exec_g_byte_to_void((((7) << 24) >> 24));
                CoreEngine.exec_g_byte_to_void((((6) << 24) >> 24));
                if ((CoreEngine.val_int_by) !== (10)) {
                    (CoreEngine.val_marketpanelcontroller_a = null);
                }
                break;
            case 11:
                CoreEngine.exec_af_to_void();
        }
        let var10000 = CoreEngine.val_int_by;
        CoreEngine.exec_m_to_void();
        switch (var10000) {
            case 0:
                CoreEngine.exec_h_int_to_int(1);
                try {
                    (CoreEngine.val_animationset_h = CoreEngine.exec_a_int_int_byte_bool_to_animationset(167772245, -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_spritepartsequence_g = CoreEngine.exec_a_int_int_to_spritepartsequence(167772196, 1));
                    (CoreEngine.val_spritepartsequence_h = CoreEngine.exec_a_int_int_to_spritepartsequence(167772197, 1));
                    (CoreEngine.val_arr_spritepartsequence_b = createArray(CoreEngine.val_arr_int_h.length, null));
                    for (let var18 = 1; (var18 <= 6); var18++) {
                        (CoreEngine.val_arr_spritepartsequence_b[var18] = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_int_h[var18], 1));
                    }
                    (CoreEngine.val_int_ae = 1);
                } catch (var13) {
                    var13.printStackTrace();
                }
                (CoreEngine.val_int_aj = 20);
                (CoreEngine.val_int_ak = -15);
                (CoreEngine.val_int_af = CoreEngine.val_int_aj);
                (CoreEngine.val_int_ag = (CoreEngine.val_int_n - CoreEngine.val_int_aj));
                (CoreEngine.val_int_ah = (CoreEngine.val_int_o + CoreEngine.val_int_ak));
                (CoreEngine.val_int_ai = ((CoreEngine.val_int_o - CoreEngine.val_int_ah) + Math.trunc((CoreEngine.val_arr_spritepartsequence_b[1].getSequenceHeight(CoreEngine.val_animationset_h)) / (2))));
                CoreEngine.val_spritepartsequence_g.getSequenceWidth(CoreEngine.val_animationset_h);
                break;
            case 1:
                try {
                    (CoreEngine.val_animationset_c = CoreEngine.exec_a_int_int_byte_bool_to_animationset(167772235, -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_spritepartsequence_c = CoreEngine.exec_a_int_int_to_spritepartsequence(167772181, 1));
                    (CoreEngine.val_int_l = 1);
                } catch (var12) {

                }
                break;
            case 2:
                try {
                    (CoreEngine.val_animationset_d = CoreEngine.exec_a_int_int_byte_bool_to_animationset(167772244, -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_spritepartsequence_d = CoreEngine.exec_a_int_int_to_spritepartsequence(167772194, 1));
                    (CoreEngine.val_int_m = 1);
                } catch (var11) {

                }
                break;
            case 3:
                try {
                    (CoreEngine.val_animationset_a = CoreEngine.exec_a_int_int_byte_bool_to_animationset(167772242, -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_animationset_b = CoreEngine.exec_a_int_int_byte_bool_to_animationset(167772243, -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_spritepartsequence_a = CoreEngine.exec_a_int_int_to_spritepartsequence(167772192, 1));
                    (CoreEngine.val_spritepartsequence_b = CoreEngine.exec_a_int_int_to_spritepartsequence(167772193, 1));
                    (CoreEngine.val_int_j = 1);
                    (CoreEngine.val_int_k = 1);
                } catch (var10) {

                }
                break;
            case 4:
                CoreEngine.updateSelectScreenState();
                CoreEngine.exec_c_int_to_void(11);
                break;
            case 5:
                if (CoreEngine.val_bool_f) {
                    CoreEngine.updateSelectScreenState();
                }
                CoreEngine.exec_c_int_to_void(13);
                break;
            case 6:
                CoreEngine.exec_c_int_to_void(15);
                break;
            case 7:
                CoreEngine.exec_c_int_to_void(17);
                break;
            case 8:
                CoreEngine.exec_c_int_to_void(19);
                break;
            case 9:
                let var40 = (CoreEngine.val_marketpanelcontroller_a = new MarketPanelController(CoreEngine.val_int_n, CoreEngine.val_int_o));
                let var1 = CoreEngine.loadResourceBytesByName("/moregames");
                let var14 = var40;
                let var2 = 2;
                let var3 = var1[1];
                (var14.val_arr_string_a = createArray(var3, null));
                (var14.val_arr_short_a = createArray(var3, 0));
                (var14.val_arr_short_b = createArray(var3, 0));
                (var14.val_arr_short_c = createArray(var3, 0));
                for (let var4 = 0; (var4 < var3); var4++) {
                    let var5 = 0;
                    let var21 = 0;
                    (var14.val_arr_string_a[var4] = makeString(var1, (var5 = (var2 + 1)), (var21 = var1[var2])));
                    (var2 = (var5 + var21));
                }
                let var27 = (var3 << 1);
                let var23 = (var3 << 2);
                for (let var6 = 0; (var6 < var3); var6++) {
                    (var14.val_arr_short_a[var6] = CoreEngine.exec_b_arr_byte_int_to_short(var1, var2));
                    (var14.val_arr_short_b[var6] = CoreEngine.exec_b_arr_byte_int_to_short(var1, (var2 + var27)));
                    (var14.val_arr_short_c[var6] = CoreEngine.exec_b_arr_byte_int_to_short(var1, (var2 + var23)));
                    (var2 += 2);
                }
                let var31 = (var2 + var23);
                for (let var28 = 0; (var28 < var14.val_arr_encodedtextbuffer_a.length); var28++) {
                    (var14.val_arr_short_d[var28] = CoreEngine.exec_b_arr_byte_int_to_short(var1, var31));
                    (var31 += 2);
                }
                (var23 = (var31 + 1));
                let var32 = var1[var31];
                (var14.val_arr_arr_short_a = createArray(var32, null));
                (var14.val_arr_arr_short_b = createArray(var32, null));
                for (let var22 = 0; (var22 < var3); var22++) {
                    for (let var29 = 0; (var29 < var32); var29++) {
                        let var7 = CoreEngine.exec_b_arr_byte_int_to_short(var1, var23);
                        let var8 = CoreEngine.exec_b_arr_byte_int_to_short(var1, (var23 + 2));
                        (var23 += 4);
                        if (((var7) !== (-1) && (var8) !== (-1))) {
                            if ((var14.val_arr_arr_short_a[var29]) === (null)) {
                                (var14.val_arr_arr_short_a[var29] = createArray(var3, 0));
                                (var14.val_arr_arr_short_b[var29] = createArray(var3, 0));
                                for (let var9 = 0; (var9 < var3); var9++) {
                                    (var14.val_arr_arr_short_a[var29][var9] = -1);
                                    (var14.val_arr_arr_short_b[var29][var9] = -1);
                                }
                            }
                            (var14.val_arr_arr_short_a[var29][var22] = var7);
                            (var14.val_arr_arr_short_b[var29][var22] = var8);
                        }
                    }
                }
                let var37 = (var23 + 1);
                let var36 = var1[var23];
                (var14.val_arr_short_i = createArray(var36, 0));
                (var14.val_arr_arr_short_c = createArray(var36, null));
                (var14.val_arr_arr_string_a = createArray(var36, null));
                for (let var35 = 0; (var35 < var36); var35++) {
                    let var10001 = (var32 = (var37 + 1));
                    let var30 = var1[var37];
                    let var38 = var14.val_arr_short_i;
                    let var25 = CoreEngine.exec_b_arr_byte_int_to_short(var1, var10001);
                    (var38[var35] = var25);
                    (var37 = (var32 + 2));
                    (var14.val_arr_arr_short_c[var35] = createArray(var30, 0));
                    (var14.val_arr_arr_string_a[var35] = createArray(var30, null));
                    for (let var34 = 0; (var34 < var30); var34++) {
                        (var14.val_arr_arr_short_c[var35][var34] = CoreEngine.exec_b_arr_byte_int_to_short(var1, var37));
                        let var39 = ((var37 + 2) + 1);
                        let var26 = var1[(var37 + 2)];
                        (var14.val_arr_arr_string_a[var35][var34] = makeString(var1, var39, var26));
                        (var37 = (var39 + var26));
                    }
                }
                CoreEngine.exec_a_byte_to_void((((8) << 24) >> 24));
                CoreEngine.exec_a_byte_to_void((((7) << 24) >> 24));
                let var15 = null;
                ((var15 = createArray(5, null))[0] = CoreEngine.val_arr_object_a[ResourceSlotTable.val_arr_byte_a[8]]);
                (var15[2] = CoreEngine.val_arr_object_a[ResourceSlotTable.val_arr_byte_a[7]]);
                (var15[3] = CoreEngine.val_arr_object_a[ResourceSlotTable.val_arr_byte_a[8]]);
                (var15[4] = CoreEngine.val_arr_object_a[ResourceSlotTable.val_arr_byte_a[8]]);
                (var15[1] = CoreEngine.val_arr_object_a[ResourceSlotTable.val_arr_byte_a[8]]);
                let var19 = var15;
                let var16 = CoreEngine.val_marketpanelcontroller_a;
                (CoreEngine.val_marketpanelcontroller_a.val_arr_object_a = var19);
                let var41 = CoreEngine.exec_a_to_fontcharmap().val_contextservicenode_a.val_object_b;
                CoreEngine.exec_a_object_to_void(var19[0]);
                (var16.val_int_D = (CoreEngine.exec_c_to_int() - CoreEngine.exec_d_to_int()));
                CoreEngine.exec_a_object_to_void(var41);
                CoreEngine.updateSelectScreenState();
                let var17 = CoreEngine.val_arr_bool_a;
                let var20 = false;
                if (!CoreEngine.val_marketpanelcontroller_a.isAvailable()) {
                    (var20 = true);
                } else {
                    (var20 = false);
                }
                (var17[20] = var20);
                CoreEngine.exec_c_int_to_void(0);
                CoreEngine.exec_e_to_void();
                CoreEngine.initGameState();
                break;
            case 10:
                CoreEngine.exec_h_int_to_int(2);
                CoreEngine.val_marketpanelcontroller_a.setMarketItem("mnu");
                CoreEngine.exec_l_to_void();
                break;
            case 11:
                CoreEngine.exec_a_byte_byte_to_void((((0) << 24) >> 24), (((5) << 24) >> 24));
                (CoreEngine.val_int_cw = 0);
                CoreEngine.exec_u_int_to_void(0);
        }
        (CoreEngine.val_int_h = CoreEngine.val_int_by);
        (CoreEngine.val_int_i = 0);
    }
    static updateRoundResultState() {
        for (let var0 = 0; (var0 < 3); var0++) {
            switch (CoreEngine.val_byte_e) {
                case 2:
                case 3:
                    if ((var0) === (0)) {
                        CoreEngine.val_spritepartsequence_i.drawSequence(CoreEngine.val_int_au, CoreEngine.val_animationset_j, CoreEngine.val_int_av, CoreEngine.val_int_aw, 0);
                    }
                    break;
                case 4:
                    if ((var0) === (1)) {
                        CoreEngine.val_spritepartsequence_i.drawSequence(CoreEngine.val_int_au, CoreEngine.val_animationset_j, CoreEngine.val_int_av, CoreEngine.val_int_aw, 0);
                    }
            }
            let var8 = var0;
            let var1 = (-CoreEngine.val_arr_int_p[var0] % 32);
            let var2 = Math.trunc((CoreEngine.val_arr_int_p[var0]) / (32));
            let var3 = (-CoreEngine.val_arr_int_o[var0] % 32);
            let var4 = Math.trunc((CoreEngine.val_arr_int_o[var0]) / (32));
            if ((var3 > 0)) {
                (var3 -= 32);
                var4--;
            }
            if ((var4 < 0)) {
                (var4 = ((var4 % CoreEngine.val_arr_byte_e[var8]) + CoreEngine.val_arr_byte_e[var8]));
            }
            if ((var4 >= CoreEngine.val_arr_byte_e[var8])) {
                (var4 %= CoreEngine.val_arr_byte_e[var8]);
            }
            if ((var2 < 0)) {
                (var1 -= (var2 << 5));
                (var2 = 0);
            }
            let var5 = CoreEngine.val_int_bE;
            if (((CoreEngine.val_arr_int_p[var8] + var5) > CoreEngine.val_arr_int_l[var8])) {
                (var5 = ((CoreEngine.val_arr_int_l[var8] + var1) - (var2 << 5)));
            }
            while ((var1 < var5)) {
                let var9 = var3;
                let var10 = var4;
                let var6 = ((var2 * CoreEngine.val_arr_byte_e[var8]) + var4);
                while ((var9 < CoreEngine.val_int_bA)) {
                    let var7 = 0;
                    if (((var7 = CoreEngine.val_arr_arr_byte_b[var8][var6]) > 0)) {
                        let var10001 = (var7 + -1);
                        let var13 = (var1 + CoreEngine.val_int_bz);
                        let var12 = var9;
                        let var11 = var10001;
                        let var16 = CoreEngine.val_animationset_i;
                        let u64 = BigInt(CoreEngine.val_animationset_i.val_arr_long_a[(var16.animPriorityBytes[var11] & 0xFF)]);
                        let srcX = Number((u64 >> 48n) & 0xFFFFn);
                        let srcY = Number((u64 >> 32n) & 0xFFFFn);
                        let w = Number((u64 >> 16n) & 0xFFFFn);
                        let h = Number(u64 & 0xFFFFn);
                        CoreEngine.val_graphicsadapter_a.drawRegion(var16.getCurrentFrame(), srcX, srcY, w, h, var16.animDurationArray[var11], var12, var13, 20);
                    }
                    (var9 += 32);
                    var10++;
                    var6++;
                    if ((var10) === (CoreEngine.val_arr_byte_e[var8])) {
                        (var10 = 0);
                        (var6 -= CoreEngine.val_arr_byte_e[var8]);
                    }
                }
                (var1 += 32);
                var2++;
            }
            switch (CoreEngine.val_byte_e) {
                case 0:
                    if ((var0) === (1)) {
                        CoreEngine.val_spritepartsequence_i.drawSequence(CoreEngine.val_int_au, CoreEngine.val_animationset_j, CoreEngine.val_int_av, CoreEngine.val_int_aw, 0);
                    }
                    break;
                case 1:
                    if ((var0) === (1)) {
                        CoreEngine.val_spritepartsequence_i.drawSequence(CoreEngine.val_int_au, CoreEngine.val_animationset_j, CoreEngine.val_int_av, CoreEngine.val_int_aw, 0);
                    }
            }
        }
    }
    static exec_v_int_to_void(var0) {
        (CoreEngine.val_int_bV = var0);
        switch (var0) {
            case 0:
                (CoreEngine.val_byte_o = 3);
                (CoreEngine.val_byte_p = 4);
                (CoreEngine.val_encodedtextbuffer_k = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(27, null));
                (CoreEngine.val_arr_arr_bool_b = createMultiArray([CoreEngine.val_arr_arr_int_c.length, 1], false));
                for (let var1 = 0; (var1 < CoreEngine.val_arr_arr_int_c.length); var1++) {
                    (CoreEngine.val_arr_arr_bool_b[var1] = createArray(((CoreEngine.val_arr_arr_int_c[var1].length - 1) + 1), false));
                }
                (CoreEngine.val_int_cq = 0);
                (CoreEngine.val_int_cv = 3);
                (CoreEngine.val_int_cb = 0);
                CoreEngine.exec_a_byte_bool_to_void((((7) << 24) >> 24), false);
                break;
            case 1:
                (CoreEngine.val_byte_o = 3);
                (CoreEngine.val_byte_p = 0);
                (CoreEngine.val_int_cr = -1);
                (CoreEngine.val_int_cs = 0);
                (CoreEngine.val_int_cv = 4);
                break;
            case 2:
                (CoreEngine.val_byte_o = 3);
                (CoreEngine.val_byte_p = 0);
                (CoreEngine.val_int_cn = (Math.trunc(((CoreEngine.val_int_bD - CoreEngine.val_arr_int_aB[8])) / (2)) - CoreEngine.val_arr_int_av[CoreEngine.val_int_bZ]));
                (CoreEngine.val_int_co = 0);
                if ((CoreEngine.val_int_cn) === (0)) {
                    (CoreEngine.val_int_co = 1000);
                }
                (CoreEngine.val_int_cq = 0);
                (CoreEngine.val_int_cv = 4);
                break;
            case 3:
                (CoreEngine.val_int_cp = 0);
                (CoreEngine.val_int_cc = ((CoreEngine.val_int_bY + (CoreEngine.val_int_bE - CoreEngine.val_int_bX)) + CoreEngine.val_arr_int_aC[8]));
                break;
            case 4:
                CoreEngine.exec_b_byte_bool_to_void((((5) << 24) >> 24), false);
                (CoreEngine.val_byte_o = 3);
                (CoreEngine.val_byte_p = 0);
                (CoreEngine.val_encodedtextbuffer_k = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ][0], null));
                CoreEngine.exec_y_int_to_void(CoreEngine.val_int_ce);
                (CoreEngine.val_int_cv = 3);
                break;
            case 5:
                (CoreEngine.val_byte_o = 3);
                (CoreEngine.val_byte_p = 0);
                (CoreEngine.val_encodedtextbuffer_k = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ][0], null));
                (CoreEngine.val_int_ce = 0);
                CoreEngine.exec_y_int_to_void(0);
                (CoreEngine.val_int_cf = (Math.trunc((CoreEngine.val_int_bE) / (2)) + ((CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ].length - 1) * CoreEngine.val_arr_int_aC[6])));
                (CoreEngine.val_int_cg = CoreEngine.val_arr_int_aC[6]);
                (CoreEngine.val_int_cd = CoreEngine.val_int_cf);
                (CoreEngine.val_int_ci = 0);
                (CoreEngine.val_int_ch = (700 * (CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ].length - 1)));
                (CoreEngine.val_int_cj = 0);
                (CoreEngine.val_int_ck = 0);
                (CoreEngine.val_int_cv = 3);
        }
        (CoreEngine.val_bool_Z = false);
    }
    static exec_h_int_to_int(var0) {
        let var1 = CoreEngine.exec_a_to_fontcharmap();
        let var2 = CoreEngine.midletInstance;
        let var3 = createArray(2, 0);
        if ((CoreEngine.exec_e_int_to_bool(var0) && !var1.val_bool_b)) {
            return var1.val_arr_short_a[var0];
        }
        let var4 = null;
        try {
            let var5 = 0;
            if (((var1.val_arr_byte_b[var0] & 64)) === (0)) {
                (var5 = var1.val_byte_d);
            } else {
                (var5 = 0);
            }
            let var6 = var5;
            if ((var1.val_byte_a) === (0)) {
                (var4 = var2.getResourceAsStream(("/t_" + makeString(var1.val_arr_arr_byte_a[var5]).trim())));
                for (let var9 = 1; (var9 < var0); var9++) {
                    if ((((var1.val_arr_byte_b[var9] & 64)) === (0) || (var6) === (0))) {
                        CoreEngine.skipStreamBytes(var4, (((var1.val_arr_short_a[var9] + 1) << 1) + (var1.val_arr_arr_short_a[var6][var9] & 65535)));
                    }
                }
            } else {
                if ((var1.val_byte_a) === (1)) {
                    (var4 = var2.getResourceAsStream((("/t_" + makeString(var1.val_arr_arr_byte_a[var5]).trim()) + var0)));
                }
            }
            (var5 = var1.val_arr_byte_c[var0]);
            if ((var1.val_arr_arr_short_b[var5]) === (null)) {
                (var1.val_arr_arr_short_b[var5] = createArray(var1.val_arr_short_c[var5], 0));
            }
            for (let var8 = 0; (var8 < (var1.val_arr_short_a[var0] + 1)); var8++) {
                (var3[0] = (((var4.read()) << 24) >> 24));
                (var3[1] = (((var4.read()) << 24) >> 24));
                (var1.val_arr_arr_short_b[var5][var8] = CoreEngine.readShortBigEndian(var3, 0));
            }
            if ((var1.val_arr_arr_byte_b[var5]) === (null)) {
                (var1.val_arr_arr_byte_b[var5] = createArray((var1.val_arr_short_b[var5] & 65535), 0));
            }
            CoreEngine.bufferedStreamRead(var4, var1.val_arr_arr_byte_b[var5], 0, (var1.val_arr_arr_short_a[var6][var0] & 65535));
            (var1.val_arr_byte_d[var5] = (((var0) << 24) >> 24));
            var4.close();
        } catch (var7) {

        }
        return var1.val_arr_short_a[var0];
    }
    static renderScene(var0) {
        if (CoreEngine.val_bool_ah) {
            CoreEngine.tickSubState();
        } else {
            if (CoreEngine.val_bool_ai) {
                CoreEngine.exec_b_byte_to_void(CoreEngine.val_byte_q);
                let var48 = CoreEngine.val_int_cB;
                let var17 = Math.min(CoreEngine.val_arr_short_f[0], (CoreEngine.val_int_cE + CoreEngine.val_int_cF));
                for (let var29 = (CoreEngine.val_int_cE - 1); (var29 < var17); var29++) {
                    let var58 = CoreEngine.val_encodedtextbuffer_m;
                    let var67 = CoreEngine.val_arr_short_f[(var29 + 1)];
                    let var72 = (CoreEngine.val_arr_short_f[(var29 + 2)] - CoreEngine.val_arr_short_f[(var29 + 1)]);
                    let var79 = 0;
                    if ((var29) === ((CoreEngine.val_arr_short_f[0] - 1))) {
                        (var79 = 0);
                    } else {
                        (var79 = -1);
                    }
                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_int_int_to_void(var58, var67, (var72 + var79), Math.trunc((CoreEngine.val_int_n) / (2)), var48, 17);
                    (var48 += CoreEngine.exec_l_to_int());
                }
                if (CoreEngine.val_bool_ab) {
                    CoreEngine.exec_a_bool_bool_bool_bool_int_int_int_int_bool_to_void(CoreEngine.val_bool_ac, CoreEngine.val_bool_ad, CoreEngine.val_bool_ae, CoreEngine.val_bool_af, (Math.trunc((CoreEngine.val_int_n) / (2)) - Math.trunc((CoreEngine.exec_i_to_int()) / (2))), 0, (Math.trunc((CoreEngine.val_int_n) / (2)) - Math.trunc((CoreEngine.exec_i_to_int()) / (2))), ((CoreEngine.val_int_o - CoreEngine.val_int_ai) - CoreEngine.exec_h_to_int()), true);
                }
            } else {
                try {
                    switch (CoreEngine.val_int_cw) {
                        case 1:
                            try {
                                try {
                                    for (let var15 = 0; (var15 < CoreEngine.val_int_n); (var15 += CoreEngine.val_arr_int_ar[3])) {
                                        for (let var25 = 0; (var25 < CoreEngine.val_int_o); (var25 += CoreEngine.val_arr_int_as[3])) {
                                            CoreEngine.exec_e_int_int_int_to_void(3, var15, var25);
                                        }
                                    }
                                } catch (var8) {

                                }
                                try {
                                    /* yield */;
                                    for (let var26 = 0; (var26 <= CoreEngine.val_int_n); (var26 += CoreEngine.val_arr_int_ar[0])) {
                                        CoreEngine.exec_e_int_int_int_to_void(0, var26, 0);
                                    }
                                    CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_j, Math.trunc((CoreEngine.val_int_n) / (2)), CoreEngine.val_int_bS, 17);
                                } catch (var9) {

                                }
                                /* yield */;
                                let var27 = CoreEngine.val_byte_n;
                                CoreEngine.val_graphicsadapter_a.setColor(CoreEngine.val_int_bH);
                                CoreEngine.val_graphicsadapter_a.fillRect(((CoreEngine.exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var27][2]) + CoreEngine.val_int_bT) - 3), ((CoreEngine.exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var27][3]) + CoreEngine.val_int_bU) - 3), (CoreEngine.val_int_bQ + 6), (CoreEngine.val_int_bQ + 6));
                                for (let var47 = 0; (var47 < PatternTable.val_arr_arr_byte_a.length); var47++) {
                                    let var57 = PatternTable.val_arr_arr_byte_a[var47][0];
                                    let var66 = 0;
                                    if (CoreEngine.exec_a_byte_to_bool(var47)) {
                                        (var66 = 0);
                                    } else {
                                        (var66 = PatternTable.val_arr_arr_byte_a[var47][1]);
                                    }
                                    let var83 = CoreEngine.exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var47][2]);
                                    let var10001 = CoreEngine.val_int_bT;
                                    (var27 = (CoreEngine.exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var47][3]) + CoreEngine.val_int_bU));
                                    let var16 = (var83 + var10001);
                                    switch (var66) {
                                        case 0:
                                            CoreEngine.val_arr_spritepartsequence_g[var57].drawSequence(CoreEngine.val_arr_int_aq[var57], CoreEngine.val_arr_animationset_c[1], var16, var27, 0);
                                            break;
                                        case 1:
                                            CoreEngine.val_arr_spritepartsequence_f[1].drawSequence(CoreEngine.val_arr_int_aq[1], CoreEngine.val_arr_animationset_c[1], var16, var27, 0);
                                            break;
                                        case 2:
                                            CoreEngine.val_arr_spritepartsequence_f[2].drawSequence(CoreEngine.val_arr_int_aq[2], CoreEngine.val_arr_animationset_c[1], var16, var27, 0);
                                    }
                                }
                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_i, Math.trunc((CoreEngine.val_int_n) / (2)), CoreEngine.val_int_bL, 17);
                                if (CoreEngine.val_bool_Y) {
                                    CoreEngine.val_spritepartsequence_j.drawSequence(CoreEngine.val_int_bO, CoreEngine.val_animationset_l, CoreEngine.val_int_bM, CoreEngine.val_int_bN, 0);
                                    return;
                                }
                            } catch (var10) {

                            }
                            return;
                        case 2:
                        case 4:
                            CoreEngine.exec_ae_to_void();
                            CoreEngine.updateRoundResultState();
                            switch (CoreEngine.val_int_bV) {
                                case 0:
                                case 1:
                                case 2:
                                case 3:
                                    let var14 = CoreEngine.val_int_cb;
                                    for (let var24 = 0; (var24 < CoreEngine.val_arr_arr_int_c.length); var24++) {
                                        let var56 = (CoreEngine.val_arr_int_av[var24] + CoreEngine.val_int_cq);
                                        let var65 = CoreEngine.val_arr_arr_int_c[var24];
                                        let var10000 = (CoreEngine.val_int_bX - CoreEngine.val_arr_int_aC[8]);
                                        let var46 = CoreEngine.val_arr_arr_bool_b[var24];
                                        let var76 = ((var10000 + var14) + CoreEngine.val_int_bz);
                                        if (var46[0]) {
                                            CoreEngine.val_arr_spritepartsequence_h[7].drawSequence(CoreEngine.val_arr_int_aD[7], CoreEngine.val_arr_animationset_d[4], var56, var76, 0);
                                        } else {
                                            CoreEngine.val_arr_spritepartsequence_h[7].drawSequence(CoreEngine.val_arr_int_aD[7], CoreEngine.val_arr_animationset_d[3], var56, var76, 0);
                                        }
                                        for (let var71 = 0; (var71 < (var65.length - 1)); var71++) {
                                            (var76 -= CoreEngine.val_arr_int_aC[8]);
                                            if (var46[(var71 + 1)]) {
                                                CoreEngine.val_arr_spritepartsequence_h[8].drawSequence(CoreEngine.val_arr_int_aD[8], CoreEngine.val_arr_animationset_d[4], var56, var76, 0);
                                            } else {
                                                CoreEngine.val_arr_spritepartsequence_h[8].drawSequence(CoreEngine.val_arr_int_aD[8], CoreEngine.val_arr_animationset_d[3], var56, var76, 0);
                                            }
                                        }
                                    }
                                    let var77 = CoreEngine.val_int_cb;
                                    CoreEngine.exec_d_int_int_int_to_void(CoreEngine.val_int_cv, (((CoreEngine.val_arr_int_av[CoreEngine.val_int_bZ] + CoreEngine.val_int_cq) + Math.trunc((CoreEngine.val_arr_int_aB[7]) / (2))) - Math.trunc((CoreEngine.val_arr_int_aB[3]) / (2))), (((((CoreEngine.val_int_bX - Math.trunc((CoreEngine.val_arr_int_aC[7]) / (2))) - Math.trunc((CoreEngine.exec_c_to_int()) / (2))) - CoreEngine.val_arr_int_aC[3]) + var77) + CoreEngine.val_int_bz));
                                    CoreEngine.exec_b_byte_to_void((((1) << 24) >> 24));
                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_l, ((CoreEngine.val_arr_int_av[CoreEngine.val_int_bZ] + CoreEngine.val_int_cq) + Math.trunc((CoreEngine.val_arr_int_aB[7]) / (2))), ((((CoreEngine.val_int_bX - Math.trunc((CoreEngine.val_arr_int_aC[7]) / (2))) - Math.trunc((CoreEngine.exec_c_to_int()) / (2))) + var77) + CoreEngine.val_int_bz), 17);
                                    break;
                                case 4:
                                    CoreEngine.exec_a_arr_int_int_int_int_bool_to_void(CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ], CoreEngine.val_int_cu, CoreEngine.val_int_ce, CoreEngine.val_int_cd, false);
                                    break;
                                case 5:
                                    CoreEngine.exec_a_arr_int_int_int_int_bool_to_void(CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ], CoreEngine.val_int_cu, CoreEngine.val_int_ce, CoreEngine.val_int_cd, true);
                            }
                            CoreEngine.exec_aj_to_void();
                            for (let var78 = 0; (var78 <= CoreEngine.val_int_n); (var78 += CoreEngine.val_arr_int_aB[0])) {
                                CoreEngine.exec_d_int_int_int_to_void(0, var78, 0);
                            }
                            CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                            CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_k, Math.trunc((CoreEngine.val_int_n) / (2)), CoreEngine.val_int_ca, 17);
                            return;
                        case 3:
                            (var0 = var0);
                            if ((CoreEngine.val_int_dN) === (1)) {
                                let var23 = (Math.trunc((CoreEngine.val_int_o) / (2)) - 4);
                                let var45 = (CoreEngine.val_int_n - 8);
                                let var10003 = Math.min(Math.trunc(((var45 * (CoreEngine.val_int_dP + 1))) / (24)), var45);
                                var0.setColor(6689058);
                                var0.fillRect(4, var23, var45, 8);
                                var0.setColor(16729088);
                                var0.fillRect(4, var23, var10003, 8);
                                var0.setColor(249700927);
                                var0.drawRect(4, var23, var45, 8);
                            } else {
                                if ((CoreEngine.val_int_dN) === (2)) {
                                    CoreEngine.exec_ae_to_void();
                                    if ((CoreEngine.val_int_dL) !== (15)) {
                                        if (((CoreEngine.val_int_dL) !== (14) && ((CoreEngine.val_int_dL) !== (0) || ((CoreEngine.val_int_dM > 300) && (CoreEngine.val_coreengine_c.actorLifecycleState) === (2))))) {
                                            var0.setColor(CharacterPresetTable.val_arr_arr_int_a[CoreEngine.val_byte_e][(19 + CoreEngine.val_int_ax)]);
                                            var0.fillRect(0, CoreEngine.val_int_bz, CoreEngine.val_int_bD, CoreEngine.val_int_bE);
                                            CoreEngine.updateRoundResultState();
                                            if ((CoreEngine.val_int_dL) !== (5)) {
                                                if (((CoreEngine.val_coreengine_b) !== (null) && CoreEngine.val_coreengine_b.exec_u_to_bool())) {
                                                    CoreEngine.exec_d_coreengine_to_void(CoreEngine.val_coreengine_b);
                                                }
                                                if (((CoreEngine.val_coreengine_c) !== (null) && CoreEngine.val_coreengine_c.exec_u_to_bool())) {
                                                    CoreEngine.exec_d_coreengine_to_void(CoreEngine.val_coreengine_c);
                                                }
                                                for (let var3 = 0; (var3 < CoreEngine.val_arr_effectactor_a.length); var3++) {
                                                    let var4 = null;
                                                    if (((((var4 = CoreEngine.val_arr_effectactor_a[var3])) !== (null) && (var4.effectAccelerationX) !== (0)) && var4.val_bool_g)) {
                                                        CoreEngine.exec_b_effectactor_to_void(var4);
                                                    }
                                                }
                                                if ((CoreEngine.val_coreengine_d) === (CoreEngine.val_coreengine_b)) {
                                                    if (((CoreEngine.val_coreengine_c) !== (null) && CoreEngine.val_coreengine_c.exec_u_to_bool())) {
                                                        CoreEngine.val_coreengine_c.exec_c_graphicsadapter_to_void(var0);
                                                    }
                                                    if (((CoreEngine.val_coreengine_b) !== (null) && CoreEngine.val_coreengine_b.exec_u_to_bool())) {
                                                        CoreEngine.val_coreengine_b.exec_c_graphicsadapter_to_void(var0);
                                                    }
                                                } else {
                                                    if (((CoreEngine.val_coreengine_b) !== (null) && CoreEngine.val_coreengine_b.exec_u_to_bool())) {
                                                        CoreEngine.val_coreengine_b.exec_c_graphicsadapter_to_void(var0);
                                                    }
                                                    if (((CoreEngine.val_coreengine_c) !== (null) && CoreEngine.val_coreengine_c.exec_u_to_bool())) {
                                                        CoreEngine.val_coreengine_c.exec_c_graphicsadapter_to_void(var0);
                                                    }
                                                }
                                                if ((CoreEngine.val_arr_actorstatemachine_a) === (null)) {
                                                    CoreEngine.exec_Q_to_void();
                                                }
                                                for (let var49 = 0; (var49 < CoreEngine.val_arr_actorstatemachine_a.length); var49++) {
                                                    if ((CoreEngine.val_arr_actorstatemachine_a[var49].actorCurrentAnimation) === (2)) {
                                                        let var2 = null;
                                                        let var59 = (((var2 = CoreEngine.val_arr_actorstatemachine_a[var49]).actorBoundsArray[0] >> 8) - CoreEngine.val_int_eO);
                                                        let var5 = ((var2.actorBoundsArray[1] >> 8) - CoreEngine.exec_k_to_int());
                                                        let var6 = var2.getCurrentSequence();
                                                        let var19 = CoreEngine.val_arr_animationset_g[var2.actorActionFrame];
                                                        (var2.actorGroundedFlag = !var2.actorGroundedFlag);
                                                        let isAction0 = ((var2.actorActionFrame) === (0) && (var2.actorPosX) === (2));
                                                        if ((((!isAction0 || var2.actorGroundedFlag) && (var19) !== (null)) && (var6) !== (null))) {
                                                            let transform = ((var2.actorFacingDirection) === (1) ? 0 : 4);
                                                            var6.drawSequence(var2.actorState, var19, var59, var5, transform);
                                                        }
                                                    }
                                                }
                                                for (let var50 = 0; (var50 < CoreEngine.val_arr_effectactor_a.length); var50++) {
                                                    let var60 = null;
                                                    if (((((var60 = CoreEngine.val_arr_effectactor_a[var50])) !== (null) && (var60.effectAccelerationX) !== (0)) && !var60.val_bool_g)) {
                                                        CoreEngine.exec_b_effectactor_to_void(var60);
                                                    }
                                                }
                                                if (CoreEngine.val_bool_aP) {
                                                    CoreEngine.val_spritepartsequence_s.drawSequence(1, CoreEngine.val_animationset_u, (CoreEngine.val_int_ex - CoreEngine.val_int_eO), (CoreEngine.val_int_ey - CoreEngine.exec_k_to_int()), 0);
                                                } else {
                                                    if ((CoreEngine.val_bool_aQ && (CoreEngine.val_spritepartsequence_H.partOffsets.length > ((CoreEngine.val_coreengine_f.actorTimerR & 65532) >>> 2)))) {
                                                        CoreEngine.val_spritepartsequence_G.drawSequence(CoreEngine.val_coreengine_f.actorTimerR, CoreEngine.val_animationset_A, (CoreEngine.val_coreengine_f.exec_a_to_int() - CoreEngine.val_int_eO), (CoreEngine.val_coreengine_f.exec_b_to_int() - CoreEngine.exec_k_to_int()), 0);
                                                    }
                                                }
                                                for (let var51 = 0; (var51 < CoreEngine.actorPoolArray.length); var51++) {
                                                    if ((((CoreEngine.actorPoolArray[var51].actorLifecycleState) === (2) && (CoreEngine.actorPoolArray[var51].characterId) === (2)) && (CoreEngine.actorPoolArray[var51].actorTimerW) === (26))) {
                                                        let var61 = CoreEngine.actorPoolArray[var51];
                                                        let var68 = CoreEngine.val_spritepartsequence_I;
                                                        let var73 = var61.actorTimerS;
                                                        let var20 = CoreEngine.val_animationset_C;
                                                        let var30 = (var61.exec_a_to_int() - CoreEngine.val_int_eO);
                                                        let var82 = (var61.exec_b_to_int() - CoreEngine.exec_k_to_int());
                                                        let var62 = 0;
                                                        if ((var61.actorCurrentAnimIndex) === (1)) {
                                                            (var62 = 0);
                                                        } else {
                                                            (var62 = 4);
                                                        }
                                                        var68.drawSequence(var73, var20, var30, var82, var62);
                                                    }
                                                }
                                                let var52 = var0;
                                                CoreEngine.exec_b_byte_to_void((((0) << 24) >> 24));
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_o, CoreEngine.val_int_cR, CoreEngine.val_int_cS, 20);
                                                if (!CoreEngine.val_bool_am) {
                                                    CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_r, CoreEngine.val_int_cV, CoreEngine.val_int_dk, 20);
                                                }
                                                var52.setColor(255);
                                                var52.fillRect(CoreEngine.val_int_cV, CoreEngine.val_int_cX, CoreEngine.val_int_dg, CoreEngine.val_int_cZ);
                                                var52.fillRect(((CoreEngine.val_int_cW + CoreEngine.val_int_cY) - CoreEngine.val_int_dh), CoreEngine.val_int_cX, CoreEngine.val_int_dh, CoreEngine.val_int_cZ);
                                                CoreEngine.exec_a_graphicsadapter_int_int_int_int_to_void(var52, (CoreEngine.val_int_cV + CoreEngine.val_int_dg), CoreEngine.val_int_cX, (CoreEngine.val_int_cY - CoreEngine.val_int_dg), CoreEngine.val_int_cZ);
                                                CoreEngine.exec_a_graphicsadapter_int_int_int_int_to_void(var52, CoreEngine.val_int_cW, CoreEngine.val_int_cX, (CoreEngine.val_int_cY - CoreEngine.val_int_dh), CoreEngine.val_int_cZ);
                                                var52.setColor(13157464);
                                                var52.drawRect(CoreEngine.val_int_cV, CoreEngine.val_int_cX, CoreEngine.val_int_cY, (CoreEngine.val_int_cZ - 1));
                                                var52.drawRect(CoreEngine.val_int_cW, CoreEngine.val_int_cX, CoreEngine.val_int_cY, (CoreEngine.val_int_cZ - 1));
                                                CoreEngine.exec_b_byte_to_void((((1) << 24) >> 24));
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_p, CoreEngine.val_int_di, CoreEngine.val_int_dm, 20);
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_q, CoreEngine.val_int_dj, CoreEngine.val_int_dm, 24);
                                                var52.setColor(65280);
                                                var52.fillRect(CoreEngine.val_int_cV, (CoreEngine.val_int_cX + CoreEngine.val_int_cZ), CoreEngine.val_int_dr, CoreEngine.val_int_do);
                                                var52.fillRect(((CoreEngine.val_int_cW + CoreEngine.val_int_cY) - CoreEngine.val_int_ds), (CoreEngine.val_int_cX + CoreEngine.val_int_cZ), CoreEngine.val_int_ds, CoreEngine.val_int_do);
                                                CoreEngine.exec_a_graphicsadapter_int_int_int_int_to_void(var52, (CoreEngine.val_int_cV + CoreEngine.val_int_dr), (CoreEngine.val_int_cX + CoreEngine.val_int_cZ), (CoreEngine.val_int_dn - CoreEngine.val_int_dr), CoreEngine.val_int_do);
                                                CoreEngine.exec_a_graphicsadapter_int_int_int_int_to_void(var52, ((CoreEngine.val_int_cW + CoreEngine.val_int_cY) - CoreEngine.val_int_dn), (CoreEngine.val_int_cX + CoreEngine.val_int_cZ), (CoreEngine.val_int_dn - CoreEngine.val_int_ds), CoreEngine.val_int_do);
                                                var52.setColor(13157464);
                                                var52.drawRect(CoreEngine.val_int_cV, ((CoreEngine.val_int_cX + CoreEngine.val_int_cZ) - 1), CoreEngine.val_int_dn, CoreEngine.val_int_do);
                                                var52.drawRect(((CoreEngine.val_int_cW + CoreEngine.val_int_cY) - CoreEngine.val_int_dn), ((CoreEngine.val_int_cX + CoreEngine.val_int_cZ) - 1), CoreEngine.val_int_dn, CoreEngine.val_int_do);
                                                if (!CoreEngine.val_bool_am) {
                                                    for (let var53 = 0; (var53 < CoreEngine.val_int_dt); var53++) {
                                                        CoreEngine.val_spritepartsequence_n.drawSequence(0, CoreEngine.val_animationset_n, (CoreEngine.val_int_cV + ((CoreEngine.val_int_dy + CoreEngine.val_int_dw) * var53)), CoreEngine.val_int_dx, 0);
                                                    }
                                                    for (let var54 = 0; (var54 < CoreEngine.val_int_du); var54++) {
                                                        CoreEngine.val_spritepartsequence_n.drawSequence(0, CoreEngine.val_animationset_n, (((CoreEngine.val_int_cW + CoreEngine.val_int_cY) - CoreEngine.val_int_dw) - ((CoreEngine.val_int_dy + CoreEngine.val_int_dw) * var54)), CoreEngine.val_int_dx, 0);
                                                    }
                                                }
                                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                for (let var55 = 0; (var55 < 2); var55++) {
                                                    if ((CoreEngine.val_arr_int_aG[var55]) !== (0)) {
                                                        let var63 = CoreEngine.val_arr_encodedtextbuffer_f[var55];
                                                        let var69 = CoreEngine.val_arr_int_aJ[var55];
                                                        let var74 = CoreEngine.val_int_dD;
                                                        let var21 = 0;
                                                        if ((var55) === (0)) {
                                                            (var21 = 24);
                                                        } else {
                                                            (var21 = 20);
                                                        }
                                                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var63, var69, var74, var21);
                                                        let var22 = CoreEngine.val_arr_encodedtextbuffer_g[var55];
                                                        (var74 = CoreEngine.val_arr_int_aM[var55]);
                                                        (var69 = CoreEngine.val_int_dE);
                                                        let var64 = 0;
                                                        if ((var55) === (0)) {
                                                            (var64 = 24);
                                                        } else {
                                                            (var64 = 20);
                                                        }
                                                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(var22, var74, var69, var64);
                                                    }
                                                }
                                            }
                                        }
                                        label257: switch (CoreEngine.val_int_dL) {
                                            case 0:
                                                if (((CoreEngine.val_int_dM > 300) && !CoreEngine.val_bool_am)) {
                                                    CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_x, CoreEngine.val_int_bC, (CoreEngine.val_int_dx + CoreEngine.val_int_dv), 17);
                                                    if (CoreEngine.exec_A_to_bool()) {
                                                        CoreEngine.exec_b_byte_to_void((((1) << 24) >> 24));
                                                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_w, CoreEngine.val_int_bC, (Math.min((CoreEngine.val_int_o - CoreEngine.val_int_ai), CoreEngine.val_int_bB) - CoreEngine.exec_c_to_int()), 17);
                                                    }
                                                }
                                                CoreEngine.val_coreengine_b.setActorPosition(-64, 0);
                                                CoreEngine.val_coreengine_c.setActorPosition(64, 0);
                                                break;
                                            case 1:
                                                let var44 = 0;
                                                if (CoreEngine.val_bool_e) {
                                                    (var44 = 2);
                                                } else {
                                                    (var44 = 3);
                                                }
                                                CoreEngine.exec_b_byte_to_void(var44);
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_A, CoreEngine.val_int_bC, (CoreEngine.val_int_dx + CoreEngine.val_int_dv), 17);
                                            case 2:
                                            case 4:
                                            case 13:
                                            default:
                                                break;
                                            case 3:
                                                let var43 = 0;
                                                if (CoreEngine.val_bool_e) {
                                                    (var43 = 2);
                                                } else {
                                                    (var43 = 3);
                                                }
                                                CoreEngine.exec_b_byte_to_void(var43);
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_G, CoreEngine.val_int_bC, (CoreEngine.val_int_dx + CoreEngine.val_int_dv), 17);
                                                break;
                                            case 5:
                                                if (CoreEngine.val_bool_aB) {
                                                    var0.setColor(16777215);
                                                    var0.fillRect(0, CoreEngine.val_int_bz, CoreEngine.val_int_bD, CoreEngine.val_int_bE);
                                                }
                                                switch (CoreEngine.val_int_ed) {
                                                    case 0:
                                                        CoreEngine.val_coreengine_c.exec_c_graphicsadapter_to_void(var0);
                                                    case 1:
                                                    case 7:
                                                    default:
                                                        break label257;
                                                    case 2:
                                                    case 3:
                                                    case 4:
                                                    case 5:
                                                    case 6:
                                                        CoreEngine.val_spritepartsequence_r.drawSequence(CoreEngine.val_int_eg, CoreEngine.val_coreengine_c.currentAnimSet, -CoreEngine.val_int_eO, -CoreEngine.exec_k_to_int(), 0);
                                                        if ((CoreEngine.val_int_ed >= 4)) {
                                                            CoreEngine.val_spritepartsequence_q.drawSequence(CoreEngine.val_int_ef, CoreEngine.val_animationset_q, -CoreEngine.val_int_eO, -CoreEngine.exec_k_to_int(), 0);
                                                        }
                                                        break label257;
                                                    case 8:
                                                    case 9:
                                                    case 10:
                                                        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                        let var41 = (CoreEngine.val_int_dx + CoreEngine.val_int_dv);
                                                        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_B, CoreEngine.val_int_bC, var41, 17);
                                                        (var41 += (2 * CoreEngine.exec_c_to_int()));
                                                        if ((CoreEngine.val_int_ed >= 9)) {
                                                            CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_L, CoreEngine.val_arr_short_g, 1, CoreEngine.val_arr_short_g[0], CoreEngine.val_int_bC, var41, 17);
                                                            (var41 += ((CoreEngine.val_arr_short_g[0] + 1) * CoreEngine.exec_c_to_int()));
                                                        }
                                                        if ((CoreEngine.val_int_ed) === (10)) {
                                                            CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_M, CoreEngine.val_arr_short_h, 1, CoreEngine.val_arr_short_h[0], CoreEngine.val_int_bC, var41, 17);
                                                        }
                                                        break label257;
                                                }
                                            case 6:
                                            case 7:
                                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_B, CoreEngine.val_int_bC, (CoreEngine.val_int_dx + CoreEngine.val_int_dv), 17);
                                                break;
                                            case 8:
                                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                let var37 = (CoreEngine.val_int_dx + CoreEngine.val_int_dv);
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_C, CoreEngine.val_int_bC, var37, 17);
                                                (var37 += CoreEngine.exec_c_to_int());
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_D, CoreEngine.val_int_bC, var37, 17);
                                                if ((CoreEngine.val_int_dM > 1000)) {
                                                    (var37 += CoreEngine.exec_c_to_int());
                                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_E, CoreEngine.val_int_bC, var37, 17);
                                                    (var37 += CoreEngine.exec_c_to_int());
                                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_F, CoreEngine.val_int_bC, var37, 17);
                                                }
                                                break;
                                            case 9:
                                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                let var34 = (CoreEngine.val_int_dx + CoreEngine.val_int_dv);
                                                CoreEngine.val_spritepartsequence_o.drawSequence(CoreEngine.val_int_dX, CoreEngine.val_animationset_o, CoreEngine.val_int_bC, var34, 0);
                                                (var34 += CoreEngine.val_int_dW);
                                                if (!CoreEngine.val_bool_am) {
                                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_I, CoreEngine.val_int_bC, var34, 17);
                                                    (var34 += CoreEngine.exec_c_to_int());
                                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_H, CoreEngine.val_int_bC, var34, 17);
                                                }
                                                break;
                                            case 10:
                                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                let var31 = ((CoreEngine.val_int_dx + CoreEngine.val_int_dv) + 40);
                                                CoreEngine.val_spritepartsequence_p.drawSequence(CoreEngine.val_int_dY, CoreEngine.val_animationset_p, CoreEngine.val_int_bC, var31, 0);
                                                (var31 += 24);
                                                if (!CoreEngine.val_bool_am) {
                                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_J, CoreEngine.val_int_bC, var31, 17);
                                                    (var31 += CoreEngine.exec_c_to_int());
                                                    CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_K, CoreEngine.val_int_bC, var31, 17);
                                                }
                                                break;
                                            case 11:
                                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_y, CoreEngine.val_int_bC, (CoreEngine.val_int_dx + CoreEngine.val_int_dv), 17);
                                                break;
                                            case 12:
                                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_z, CoreEngine.val_int_bC, (CoreEngine.val_int_dx + CoreEngine.val_int_dv), 17);
                                                break;
                                            case 14:
                                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_O, Math.trunc((CoreEngine.val_int_n) / (2)), (Math.trunc((CoreEngine.val_int_o) / (2)) - CoreEngine.val_int_ai), 17);
                                                (CoreEngine.val_int_q = 2);
                                        }
                                    }
                                    CoreEngine.exec_aj_to_void();
                                }
                            }
                            if ((CoreEngine.val_int_ej > 0)) {
                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_N, CoreEngine.val_int_bC, ((CoreEngine.val_int_dx + CoreEngine.val_int_dv) + 32), 17);
                            }
                            return;
                        case 5:
                        case 10:
                            CoreEngine.exec_ag_to_void();
                            CoreEngine.val_spritepartsequence_m.drawSequence(CoreEngine.val_int_cI, CoreEngine.val_animationset_m, CoreEngine.val_int_cL, CoreEngine.val_int_cM, 0);
                            CoreEngine.exec_c_bool_to_void(false);
                            return;
                        case 6:
                            CoreEngine.exec_ag_to_void();
                            CoreEngine.exec_c_bool_to_void(true);
                            return;
                        case 7:
                        case 9:
                            CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                            CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_m, CoreEngine.val_arr_short_f, CoreEngine.val_int_cE, CoreEngine.val_arr_short_f[0], Math.trunc((CoreEngine.val_int_n) / (2)), (Math.trunc((CoreEngine.val_int_o) / (2)) - Math.trunc(((CoreEngine.val_arr_short_f[0] * CoreEngine.exec_c_to_int())) / (2))), 17);
                        default:
                            return;
                        case 8:
                            if (!CoreEngine.val_bool_R) {
                                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                                CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_f, Math.trunc((CoreEngine.val_int_n) / (2)), CoreEngine.val_int_bj, 17);
                                CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_g, CoreEngine.val_arr_short_e, 1, CoreEngine.val_arr_short_e[0], Math.trunc((CoreEngine.val_int_n) / (2)), CoreEngine.val_int_bk, 17);
                                let var12 = CoreEngine.val_int_bm;
                                for (let var1 = 0; (var1 < 3); var1++) {
                                    if (((var1) !== (CoreEngine.val_int_bp) || !CoreEngine.val_bool_S)) {
                                        if ((CoreEngine.val_arr_byte_j[var1]) !== (0)) {
                                            CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_arr_encodedtextbuffer_e[var1], var12, CoreEngine.val_int_bl, 20);
                                        } else {
                                            CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_h, var12, CoreEngine.val_int_bl, 20);
                                        }
                                    }
                                    (var12 += (CoreEngine.val_int_bn + CoreEngine.val_int_bo));
                                }
                                for (let var18 = 0; (var18 < 4); var18++) {
                                    CoreEngine.val_arr_spritepartsequence_e[var18].drawSequence(CoreEngine.val_arr_int_ai[var18], CoreEngine.val_animationset_k, CoreEngine.val_arr_int_aj[var18], CoreEngine.val_arr_int_ak[var18], 0);
                                }
                                CoreEngine.exec_i_to_void();
                                return;
                            }
                    }
                } catch (var11) {

                }
            }
        }
    }
    static exec_a_spriteimage_arr_byte_to_object(var0, var1) {
        let var6 = CoreEngine.exec_a_to_fontcharmap();
        let var2 = 0;
        let isBit128 = (((var2 = var1[0]) & 128)) !== (0);
        let var5 = ((var2 & 64)) !== (0);
        let var7 = createArray(12, 0);
        System.arraycopy(var1, 1, var7, 0, 7);
        (var7[7] = 0);
        (var7[8] = var7[0]);
        (var7[9] = var7[1]);
        (var7[10] = ((((isBit128 ? 2 : 1)) << 24) >> 24));
        if (var5) {
            (var7[10] = ((((var7[10] | 128)) << 24) >> 24));
        }
        let var3 = (((CoreEngine.readShortBigEndian(var1, 8)) << 16) >> 16);
        let var8 = CoreEngine.readShortBigEndian(var1, 10);
        (var2 = 12);
        let var4 = createArray(var3, 0);
        for (let var13 = 0; (var13 < var3); var13++) {
            (var4[var13] = CoreEngine.readShortBigEndian(var1, var2));
            (var2 += 2);
        }
        let var14 = createArray((var3 + 1), 0);
        for (let var9 = 0; (var9 < var3); var9++) {
            (var14[var9] = CoreEngine.readShortBigEndian(var1, var2));
            (var2 += 2);
        }
        (var14[var3] = -1);
        let var16 = null;
        let var17 = 0;
        System.arraycopy(var1, var2, (var16 = createArray((var17 = ((var3 << 1) + (var8 * 6))), 0)), 0, var17);
        let var18 = createArray(256, 0);
        for (let var11 = 0; (var11 < 128); var11++) {
            (var18[var11] = (((CoreEngine.exec_a_arr_short_int_int_int_int_fontcharmap_to_int(var4, var11, 0, (var3 - 1), var4.length, var6)) << 16) >> 16));
        }
        (var7[11] = 1);
        let var15 = null;
        ((var15 = createArray(6, null))[0] = var7);
        (var15[1] = var4);
        (var15[2] = var18);
        (var15[3] = var14);
        (var15[4] = var16);
        (var15[5] = null);
        let var19 = null;
        ((var19 = createArray(8, null))[0] = var0);
        (var19[1] = var15[0]);
        (var19[2] = var15[1]);
        (var19[3] = var15[2]);
        (var19[4] = var15[3]);
        (var19[5] = var15[4]);
        (var19[6] = var15[5]);
        (var19[7] = Integer.valueOf(-1));
        return var19;
    }
    static exec_a_int_int_int_int_arr_int_to_void(var0, var1, var2, var3, var4) {
        let var5 = 0;
        let var6 = 0;
        if (((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] > var0) && (CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)] < var0))) {
            (var5 = Math.min((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] - var0), (var2 - var0)));
        } else {
            if ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)] < var2)) {
                (var5 = Math.min((var2 - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)]), (CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)])));
            }
        }
        if ((CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE] < var1)) {
            (var6 = Math.min((var1 - CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE]), (var1 - var3)));
        } else {
            if ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 3)] < var3)) {
                (var6 = Math.min((var3 - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 3)]), (CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE] - CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 3)])));
            }
        }
        (var0 = Math.min(var0, CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)]));
        (var2 = Math.min(var2, CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)]));
        (var3 = Math.max(var3, CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 3)]));
        (var1 = Math.max(var1, CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE]));
        if ((var2 > var0)) {
            (var0 = var2);
        }
        if ((var1 < var3)) {
            (var3 = var1);
        }
        (var4[0] = var3);
        (var4[3] = (var3 + var6));
        (var4[1] = var0);
        (var4[2] = (var0 + var5));
    }
    static exec_a_int_int_int_int_to_int(var0, var1, var2, var3) {
        if ((((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)] < var2) && (CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] > var0)) || ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)] > var2) && (CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] < var0)))) {
            if ((((CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE] < var1) && (CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 3)] > var3)) || ((CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE] > var1) && (CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 3)] < var3)))) {
                if ((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 3)] < (var3 + ((var1 - var3) >> 2)))) {
                    return (((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] + CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)]) > (var2 + var0)) ? 2 : 1);
                } else {
                    if (((CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE] < var1) && (CoreEngine.val_arr_int_bl[CoreEngine.val_int_eE] > (var1 - ((var1 - var3) >> 2))))) {
                        return (((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] + CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)]) > (var2 + var0)) ? 6 : 5);
                    } else {
                        return (((CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 2)] + CoreEngine.val_arr_int_bl[(CoreEngine.val_int_eE + 1)]) > (var2 + var0)) ? 4 : 3);
                    }
                }
            } else {
                return 0;
            }
        } else {
            return 0;
        }
    }
    static exec_a_encodedtextbuffer_int_to_arr_short(var0, var1) {
        let var11 = var0.bufferCapacity;
        let var2 = null;
        if (((var2 = CoreEngine.exec_a_to_fontcharmap()).val_arr_short_e) === (null)) {
            (var2.val_arr_short_e = createArray(50, 0));
            (var2.val_int_b = 50);
        }
        let var10 = var2.val_arr_short_e;
        let var12 = (var0.flagsByte & 63);
        let var3 = 0;
        let var4 = 0;
        let var5 = -1;
        (var10[1] = 0);
        let var6 = 2;
        for (let var7 = 0; (var7 < var11); var7++) {
            let var8 = var0.getCharAt(var7);
            if (((var6 + 3) >= var2.val_int_b)) {
                (var2.val_arr_short_e = createArray((var2.val_int_b + 50), 0));
                CoreEngine.exec_a_arr_short_arr_short_int_to_void(var10, var2.val_arr_short_e, var2.val_int_b);
                (var10 = var2.val_arr_short_e);
                (var2.val_int_b += 50);
            }
            if ((var8) === (124)) {
                (var10[var6++] = ((((var7 + 1)) << 16) >> 16));
                (var3 = 0);
                (var4 = 0);
                (var5 = -1);
            } else {
                let var9 = var2.getCharWidth(var2.getKerning(var8, var12));
                (var3 += var9);
                (var4 += var9);
                if ((var3 > var1)) {
                    if ((var5) === (-1)) {
                        (var10[var6++] = (((var7) << 16) >> 16));
                        (var3 = var9);
                        (var4 = 0);
                    } else {
                        (var10[var6++] = ((((var5 + 1)) << 16) >> 16));
                        if (((var8) !== (32) && (var8) !== (173))) {
                            (var5 = -1);
                        } else {
                            (var5 = var7);
                        }
                        (var3 = var4);
                        (var4 = 0);
                    }
                } else {
                    if (((var8) === (32) || (var8) === (173))) {
                        (var5 = var7);
                        (var4 = 0);
                    }
                }
            }
        }
        (var10[0] = ((((var6 - 1)) << 16) >> 16));
        (var10[var6] = (((var11) << 16) >> 16));
        (var10[(var6 + 1)] = 124);
        let var13 = null;
        CoreEngine.exec_a_arr_short_arr_short_int_to_void(var10, (var13 = createArray((var6 + 2), 0)), (var6 + 2));
        return var13;
    }
    static exec_w_int_to_void(var0) {
        (CoreEngine.val_int_bs = var0);
        for (let var1 = 0; (var1 < 10); var1++) {
            (CoreEngine.val_arr_encodedtextbuffer_c[var1] = new EncodedTextBuffer(4));
            CoreEngine.val_arr_encodedtextbuffer_c[var1].appendInt((var1 + 1));
            CoreEngine.val_arr_encodedtextbuffer_c[var1].appendString(". ");
            (CoreEngine.val_arr_encodedtextbuffer_b[var1] = new EncodedTextBuffer(3));
            (CoreEngine.val_arr_encodedtextbuffer_d[var1] = new EncodedTextBuffer(10));
            CoreEngine.val_arr_encodedtextbuffer_d[var1].appendInt(CoreEngine.val_arr_int_ag[var1]);
            for (let var2 = 0; (var2 < 3); var2++) {
                CoreEngine.val_arr_encodedtextbuffer_b[var1].appendInt(0);
                CoreEngine.val_arr_encodedtextbuffer_b[var1].setCharAt(var2, ((CoreEngine.val_arr_short_a[CoreEngine.val_arr_arr_byte_c[var1][var2]]) & 0xFFFF));
            }
        }
        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
        (CoreEngine.val_int_bh = CoreEngine.exec_l_to_int());
        (CoreEngine.val_int_bg = 1);
        let var3 = 0;
        if (((CoreEngine.val_int_bi = Math.trunc(((var3 = (((CoreEngine.val_int_o - CoreEngine.val_arr_int_Y[1]) - CoreEngine.val_int_ai) - CoreEngine.exec_l_to_int()))) / ((CoreEngine.val_int_bh + CoreEngine.val_int_bg)))) > 10)) {
            (CoreEngine.val_int_bi = 10);
        }
        (CoreEngine.val_int_bg = Math.trunc(((var3 - (CoreEngine.val_int_bi * CoreEngine.val_int_bh))) / (CoreEngine.val_int_bi)));
        (CoreEngine.val_int_bd = ((Math.trunc(((var3 - (CoreEngine.val_int_bi * (CoreEngine.val_int_bh + CoreEngine.val_int_bg)))) / (2)) + CoreEngine.val_arr_int_Y[1]) + Math.trunc((CoreEngine.val_int_bh) / (2))));
        if ((CoreEngine.val_int_bs) === (-1)) {
            (CoreEngine.val_byte_h = 0);
            (CoreEngine.val_byte_i = 4);
        } else {
            (CoreEngine.val_byte_h = 1);
            (CoreEngine.val_byte_i = 0);
        }
        (CoreEngine.val_bool_L = false);
        (CoreEngine.val_bool_K = false);
        (CoreEngine.val_int_aE = 7);
        (CoreEngine.val_encodedtextbuffer_d = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(21, null));
        (CoreEngine.val_int_be = 48);
        (CoreEngine.val_int_bf = (CoreEngine.val_int_n - 32));
    }
    static exec_e_to_void() {
        (CoreEngine.val_int_dF = CoreEngine.val_int_dI);
        (CoreEngine.val_int_dG = CoreEngine.val_int_dJ);
        (CoreEngine.val_int_dH = CoreEngine.val_int_dK);
        (CoreEngine.val_int_dI = 0);
        (CoreEngine.val_int_dJ = 0);
        (CoreEngine.val_int_dK = (CoreEngine.val_int_dK & ~CoreEngine.val_int_dG));
        let var0 = false;
        if (((CoreEngine.val_int_dF & 32)) !== (0)) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        (CoreEngine.val_bool_at = var0);
        if ((((CoreEngine.val_int_dF & 64)) === (0) && ((CoreEngine.val_int_dF & 524288)) === (0))) {
            (var0 = false);
        } else {
            (var0 = true);
        }
        (CoreEngine.val_bool_au = var0);
        if ((((CoreEngine.val_int_dF & 512)) === (0) && ((CoreEngine.val_int_dF & 1)) === (0))) {
            (var0 = false);
        } else {
            (var0 = true);
        }
        (CoreEngine.val_bool_an = var0);
        if ((((CoreEngine.val_int_dF & 32768)) === (0) && ((CoreEngine.val_int_dF & 2)) === (0))) {
            (var0 = false);
        } else {
            (var0 = true);
        }
        (CoreEngine.val_bool_ao = var0);
        if ((((CoreEngine.val_int_dF & 2048)) === (0) && ((CoreEngine.val_int_dF & 4)) === (0))) {
            (var0 = false);
        } else {
            (var0 = true);
        }
        (CoreEngine.val_bool_ap = var0);
        if ((((CoreEngine.val_int_dF & 8192)) === (0) && ((CoreEngine.val_int_dF & 8)) === (0))) {
            (var0 = false);
        } else {
            (var0 = true);
        }
        (CoreEngine.val_bool_aq = var0);
        if ((((CoreEngine.val_int_dF & 4096)) === (0) && ((CoreEngine.val_int_dF & 16)) === (0))) {
            (var0 = false);
        } else {
            (var0 = true);
        }
        (CoreEngine.val_bool_av = var0);
        if ((((CoreEngine.val_int_dH & 512)) === (0) && ((CoreEngine.val_int_dH & 1)) === (0))) {
            (var0 = false);
        } else {
            (var0 = true);
        }
        (CoreEngine.val_bool_ar = var0);
        if ((((CoreEngine.val_int_dH & 32768)) === (0) && ((CoreEngine.val_int_dH & 2)) === (0))) {
            (var0 = false);
        } else {
            (var0 = true);
        }
        (CoreEngine.val_bool_as = var0);
    }
    static exec_a_object_to_void(var0) {
        let var1 = null;
        ((var1 = CoreEngine.exec_a_to_fontcharmap()).val_contextservicenode_a.val_object_b = null);
        (var1.val_contextservicenode_a.val_arr_byte_a = null);
        (var1.val_contextservicenode_a.val_object_a = null);
        (var1.val_contextservicenode_a.val_arr_short_b = null);
        (var1.val_contextservicenode_a.val_arr_short_a = null);
        (var1.val_contextservicenode_a.val_arr_short_c = null);
        (var1.val_contextservicenode_a.val_arr_byte_b = null);
        if ((var0) !== (null)) {
            (var1.val_contextservicenode_a.val_object_a = (var0)[0]);
            (var1.val_contextservicenode_a.val_arr_byte_a = ((var0)[1]));
            (var1.val_contextservicenode_a.val_arr_short_b = ((var0)[2]));
            (var1.val_contextservicenode_a.val_arr_short_a = ((var0)[3]));
            (var1.val_contextservicenode_a.val_arr_short_c = ((var0)[4]));
            (var1.val_contextservicenode_a.val_arr_byte_b = ((var0)[5]));
            if ((((var1.val_arr_byte_a) !== (null) && (var1.val_contextservicenode_a.val_arr_byte_a[11]) !== (var1.val_arr_byte_a[var1.val_byte_d])) && (var1.val_arr_byte_a[var1.val_byte_d] > 1))) {
                let var2 = var1.val_contextservicenode_a.val_arr_short_b.length;
                for (let var3 = 128; (var3 < 256); var3++) {
                    (var1.val_contextservicenode_a.val_arr_short_a[var3] = (((CoreEngine.exec_a_arr_short_int_int_int_int_fontcharmap_to_int(var1.val_contextservicenode_a.val_arr_short_b, var1.val_arr_short_d[(var3 - 128)], 0, (var2 - 1), var2, var1)) << 16) >> 16));
                }
                (var1.val_contextservicenode_a.val_arr_byte_a[11] = var1.val_arr_byte_a[var1.val_byte_d]);
            }
        }
        (var1.val_contextservicenode_a.val_object_b = var0);
    }
    static copyByteArray(var0, var1, var2, var3) {
        var1 = CoreEngine.readIntWithLength(var0, var1, var2);
        let var6 = (CoreEngine.readIntAtOffset(var0, var1) - var1);
        if (var3.length < var6) {
            var6 = var3.length;
        }
        for (let var9 = 0; var9 < var6; var9++) {
            var0[var9 + var1] = var3[var9];
        }
        var6 = (((var0[var1 - 8] & 255) << 24) | ((var0[var1 - 7] & 255) << 16) | ((var0[var1 - 6] & 255) << 8) | (var0[var1 - 5] & 255)) >>> 0;
        if (!CoreEngine._crcTable) {
            CoreEngine._crcTable = new BigInt64Array(256);
            const poly = 3988292384n;
            for (let i = 0n; i < 256n; i++) {
                let c = i;
                for (let k = 0n; k < 8n; k++) {
                    c = (c & 1n) ? (poly ^ (c >> 1n)) : (c >> 1n);
                }
                CoreEngine._crcTable[Number(i)] = c;
            }
        }
        const crcTable = CoreEngine._crcTable;
        let crc = 4294967295n;
        for (let var12 = 0; var12 < var6 + 4; var12++) {
            const b = BigInt(var0[var1 - 4 + var12] & 255);
            const idx = Number((crc ^ b) & 0xFFn);
            crc = crcTable[idx] ^ (crc >> 8n);
        }
        crc ^= 4294967295n;
        var0[var1 + var6] = Number((crc >> 24n) & 0xFFn);
        var0[var1 + var6 + 1] = Number((crc >> 16n) & 0xFFn);
        var0[var1 + var6 + 2] = Number((crc >> 8n) & 0xFFn);
        var0[var1 + var6 + 3] = Number(crc & 0xFFn);
    }
    static exec_H_to_void() {
        CoreEngine.exec_a_byte_to_void((((1) << 24) >> 24));
        CoreEngine.exec_a_byte_int_to_void((((4) << 24) >> 24), 1);
        CoreEngine.exec_T_to_void();
        (CoreEngine.val_int_ca = 8);
        try {
            (CoreEngine.val_arr_animationset_d = createArray(CoreEngine.val_arr_int_ax.length, null));
            for (let var0 = 0; (var0 < CoreEngine.val_arr_int_ax.length); var0++) {
                if ((var0) === (4)) {
                    (CoreEngine.val_arr_animationset_d[var0] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_ax[var0], -1, (((2) << 24) >> 24), false));
                } else {
                    (CoreEngine.val_arr_animationset_d[var0] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_ax[var0], -1, (((0) << 24) >> 24), false));
                }
            }
            (CoreEngine.val_arr_spritepartsequence_h = createArray(CoreEngine.val_arr_int_ay.length, null));
            (CoreEngine.val_arr_int_aD = createArray(CoreEngine.val_arr_int_ay.length, 0));
            (CoreEngine.val_arr_int_aB = createArray(CoreEngine.val_arr_int_ay.length, 0));
            (CoreEngine.val_arr_int_aC = createArray(CoreEngine.val_arr_int_ay.length, 0));
            for (let var2 = 0; (var2 < CoreEngine.val_arr_int_ay.length); var2++) {
                (CoreEngine.val_arr_spritepartsequence_h[var2] = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_int_ay[var2], 1));
                (CoreEngine.val_arr_int_aD[var2] = 1);
                (CoreEngine.val_arr_int_aB[var2] = CoreEngine.val_arr_spritepartsequence_h[var2].getSequenceWidth(CoreEngine.val_arr_animationset_d[CoreEngine.val_arr_int_az[var2]]));
                (CoreEngine.val_arr_int_aC[var2] = CoreEngine.val_arr_spritepartsequence_h[var2].getSequenceHeight(CoreEngine.val_arr_animationset_d[CoreEngine.val_arr_int_az[var2]]));
            }
            (CoreEngine.val_arr_spritepartsequence_i = createArray(CoreEngine.val_arr_int_aR.length, null));
            (CoreEngine.val_arr_int_aA = createArray(CoreEngine.val_arr_int_aR.length, 0));
            (CoreEngine.val_int_ct = CoreEngine.val_arr_int_aB[1]);
            for (let var3 = 0; (var3 < CoreEngine.val_arr_int_aR.length); var3++) {
                (CoreEngine.val_arr_spritepartsequence_i[var3] = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_int_aR[var3], 1));
                (CoreEngine.val_arr_int_aA[var3] = 1);
            }
        } catch (var1) {

        }
        CoreEngine.exec_U_to_void();
    }
    static exec_f_to_void() {
        let var0 = CoreEngine.midletInstance.getResourceAsStream("/index");
        try {
            CoreEngine.readStreamBytes(var0, 1);
            (CoreEngine.val_int_al = CoreEngine.readStreamBytes(var0, 2));
            let var1 = CoreEngine.readStreamBytes(var0, 1);
            (CoreEngine.val_int_am = CoreEngine.readStreamBytes(var0, 1));
            let var2 = CoreEngine.val_int_al;
            let var3 = CoreEngine.val_int_am;
            (CoreEngine.val_arr_int_i = createArray(var2, 0));
            (CoreEngine.val_arr_arr_int_a = createMultiArray([var2, (var3 + 1)], 0));
            for (let var4 = 0; (var4 < var2); var4++) {
                (CoreEngine.val_arr_int_i[var4] = CoreEngine.readStreamBytes(var0, 2));
                for (let var5 = 0; (var5 < (var3 + 1)); var5++) {
                    (CoreEngine.val_arr_arr_int_a[var4][var5] = CoreEngine.readStreamBytes(var0, var1));
                }
                CoreEngine.readStreamBytes(var0, var1);
            }
            let var8 = 0;
            (CoreEngine.val_int_an = (var8 = CoreEngine.readStreamBytes(var0, 2)));
            let var15 = Math.trunc((var3) / (8));
            if (((var3 % 8) > 0)) {
                var15++;
            }
            (CoreEngine.val_arr_arr_bool_a = createMultiArray([var8, var3], false));
            (CoreEngine.val_arr_int_j = createArray(var8, 0));
            (CoreEngine.val_arr_arr_int_b = createArray(var8, null));
            for (let var9 = 0; (var9 < var8); var9++) {
                let var10 = CoreEngine.readStreamBytes(var0, var15);
                let var14 = 0;
                for (let var11 = 0; (var11 < var3); var11++) {
                    let var13 = CoreEngine.val_arr_arr_bool_a[var9];
                    let var6 = var11;
                    let var7 = false;
                    if (((var10 & (1 << var11))) !== (0)) {
                        (var7 = true);
                    } else {
                        (var7 = false);
                    }
                    (var13[var6] = var7);
                    if (CoreEngine.val_arr_arr_bool_a[var9][var11]) {
                        var14++;
                    }
                }
                (CoreEngine.val_arr_int_j[var9] = CoreEngine.readStreamBytes(var0, var1));
                (CoreEngine.val_arr_arr_int_b[var9] = createArray(var14, 0));
                let var17 = 0;
                for (let var16 = 0; (var16 < var3); var16++) {
                    if (CoreEngine.val_arr_arr_bool_a[var9][var16]) {
                        (CoreEngine.val_arr_arr_int_b[var9][var17++] = CoreEngine.readStreamBytes(var0, var1));
                    }
                }
            }
        } catch (var12) {

        }
        (CoreEngine.val_bool_a = true);
    }
    static exec_a_arr_int_arr_int_int_int_int_int_to_void(var0, var1, var2, var3, var4, var5) {
        (CoreEngine.val_arr_int_bs[CoreEngine.val_int_eI] = var0[0]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 1)] = var0[1]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 2)] = var0[2]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 3)] = var0[3]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 4)] = var0[4]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 5)] = var0[5]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 6)] = var0[6]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 7)] = var0[7]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 8)] = var1[0]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 9)] = var1[1]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 10)] = var1[2]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 11)] = var1[3]);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 12)] = var2);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 13)] = var3);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 14)] = var4);
        (CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 15)] = var5);
        if (((CoreEngine.val_arr_int_bs[(CoreEngine.val_int_eI + 4)] | 512)) !== (0)) {
            (CoreEngine.val_int_eJ = CoreEngine.val_int_eI);
        }
        (CoreEngine.val_int_eI += 16);
    }
    static exec_b_int_to_int(var0) {
        if ((CoreEngine.exec_a_to_fontcharmap().val_arr_arr_byte_a.length) === (1)) {
            return 0;
        }
        let var1 = CoreEngine.exec_b_string_to_string("Force-Locale");
        let var5 = 0;
        let var2 = createArray((var5 = CoreEngine.exec_a_to_fontcharmap().val_arr_arr_byte_a.length), null);
        for (let var3 = 0; (var3 < var5); var3++) {
            (var2[var3] = makeString(CoreEngine.exec_a_to_fontcharmap().val_arr_arr_byte_a[var3]));
        }
        if ((var0) === (-1)) {
            let var8 = 0;
            if ((var1) === (null)) {
                (var8 = 2);
            } else {
                let var9 = null;
                (var1 = (var9 = var1.toLowerCase().trim()));
                if ((var9.length < 2)) {
                    (var8 = 2);
                } else {
                    if (var9.equals("menu")) {
                        (var8 = 1);
                    } else {
                        if (var9.startsWith("auto-")) {
                            (var8 = 3);
                            (var1 = var9.substring(5));
                        } else {
                            (var8 = 4);
                        }
                    }
                }
            }
            for (let var6 = 0; (var6 < var2.length); var6++) {
                if ((var2[var6].length > 2)) {
                    let var4 = var2[var6].substring(0, 2);
                    let var7 = true;
                    for (let var10 = 0; (var10 < var2.length); var10++) {
                        if (((var6) !== (var10) && var2[var10].startsWith(var4))) {
                            (var7 = false);
                            break;
                        }
                    }
                    if (var7) {
                        (var2[var6] = var4);
                    }
                }
            }
            if ((((var8) === (2) || (var8) === (3)) || (var8) === (1))) {
                (var0 = CoreEngine.exec_a_arr_string_to_byte(var2));
                if (((var8) === (1) && (var0 >= 0))) {
                    (var0 = (-1 - var0));
                }
            }
            if (((var8) === (4) || ((var8) === (3) && (var0) === (-1)))) {
                for (let var11 = 0; (var11 < var2.length); var11++) {
                    if (var1.startsWith(var2[var11])) {
                        (var0 = var11);
                        break;
                    }
                }
            }
            if (((var8) === (4) && (var0) === (-1))) {
                (var0 = CoreEngine.exec_a_arr_string_to_byte(var2));
            }
        }
        return var0;
    }
    static exec_a_arr_int_int_int_int_bool_to_void(var0, var1, var2, var3, var4) {
        let var5 = Math.trunc(((CoreEngine.val_int_bD - CoreEngine.val_arr_int_aB[5])) / (2));
        let var6 = (CoreEngine.val_int_bE - CoreEngine.val_arr_int_aC[6]);
        if (var4) {
            (var6 += (var3 % CoreEngine.val_arr_int_aC[5]));
        }
        let var7 = (Math.trunc(((CoreEngine.val_int_bE - CoreEngine.val_arr_int_aC[0])) / (CoreEngine.val_arr_int_aC[5])) + 1);
        let var8 = (var2 - Math.trunc((var7) / (2)));
        if (var4) {
            (var8 += Math.trunc((var3) / (CoreEngine.val_arr_int_aC[5])));
        }
        (var7 = (var8 + var7));
        for (let var9 = var8; (var9 <= var7); var9++) {
            if ((var9) === (-1)) {
                CoreEngine.exec_d_int_int_int_to_void(5, var5, (var6 + CoreEngine.val_int_bz));
            } else {
                if (((var9 >= -1) && (var9 < (var0.length - 1)))) {
                    let var10001 = (var9 + 1);
                    (var8 = (var6 + CoreEngine.val_int_bz));
                    let var10 = (var5 + 0);
                    let var11 = var0[var10001];
                    CoreEngine.exec_d_int_int_int_to_void(6, var10, var8);
                    switch (var11) {
                        case -2:
                            CoreEngine.exec_d_int_int_int_to_void(10, (var10 + 75), (var8 + 14));
                            break;
                        case -1:
                            CoreEngine.exec_d_int_int_int_to_void(9, (var10 + 75), (var8 + 14));
                            break;
                        default:
                            CoreEngine.exec_f_int_int_int_to_void(var11, (var10 + 75), (var8 + 14));
                    }
                    if ((var9) === (var2)) {
                        (var11 = (((var5 + CoreEngine.val_arr_int_aB[6]) - 75) - CoreEngine.val_int_ct));
                        (var10 = (var6 + 14));
                        if (!var4) {
                            (var8 = var3);
                        } else {
                            (var8 = 0);
                        }
                        CoreEngine.exec_f_int_int_int_to_void(var1, var11, ((var10 + var8) + CoreEngine.val_int_bz));
                    }
                }
            }
            (var6 -= CoreEngine.val_arr_int_aC[6]);
        }
    }
    static pauseAudioChannel(param0) {
        let var0 = param0;
        while (var0 && (var0.channelId) !== (2)) {
            (var0 = var0.nextContext);
        }
        if (!var0) return;
        let var1 = var0.val_audioclipnode_b;
        if (var1 && var1.mediaPlayer) {
            try {
                var1.mediaPlayer.stop();
            } catch (_) {}
            var0.isPaused = true;
        }
    }
    static exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(var0, var1, var2, var3, var4, var5, var6) {
        let var7 = CoreEngine.exec_a_to_fontcharmap();
        let var8 = CoreEngine.exec_c_to_int();
        let var9 = 0;
        let var10 = 0;
        let var11 = 0;
        if (((var6 & 2)) !== (0)) {
            (var11 = (((var1[0] * var8) - var7.val_contextservicenode_a.val_arr_byte_a[2]) >> 1));
            (var6 ^= 2);
        } else {
            if (((var6 & 32)) !== (0)) {
                (var11 = ((var1[0] * var8) - var7.val_contextservicenode_a.val_arr_byte_a[2]));
                (var6 ^= 32);
            }
        }
        (var6 |= 16);
        if ((var7.val_contextservicenode_a.val_arr_byte_a[9]) === (1)) {
            (var4 -= var11);
            (var9 = var8);
        } else {
            if ((var7.val_contextservicenode_a.val_arr_byte_a[9]) === (4)) {
                (var4 += var11);
                (var9 = -var8);
            } else {
                if ((var7.val_contextservicenode_a.val_arr_byte_a[9]) === (2)) {
                    (var5 -= var11);
                    (var10 = var8);
                } else {
                    (var5 += var11);
                    (var10 = -var8);
                }
            }
        }
        let var15 = var1[((var1[0] & 65535) + 2)];
        for (let var17 = var2; (var17 < (var2 + var3)); var17++) {
            (var8 = (var1[var17] & 65535));
            let var12 = ((var1[(var17 + 1)] & 65535) - var8);
            let var13 = 0;
            if ((((var13 = var0.getCharAt(((var1[(var17 + 1)] & 65535) - 1)))) === (var15) || (var13) === (32))) {
                var12--;
            }
            CoreEngine.exec_a_encodedtextbuffer_int_int_int_int_int_to_void(var0, var8, var12, var4, var5, var6);
            (var4 += var9);
            (var5 += var10);
        }
    }
    static exec_c_to_bool() {
        try {
            if ((CoreEngine.val_arr_byte_l) === (null)) {
                let var0 = 0;
                let var10000 = null;
                if (((var0 = CoreEngine.exec_a_contextservicenode_to_int(CoreEngine.exec_c_to_contextservicenode()))) === (-1)) {
                    (var10000 = null);
                } else {
                    CoreEngine.exec_c_to_contextservicenode();
                    let var6 = null;
                    CoreEngine.exec_b_arr_byte_to_int((var6 = createArray(var0, 0)));
                    (var10000 = var6);
                }
                (CoreEngine.val_arr_byte_l = var10000);
            }
            if ((CoreEngine.val_arr_byte_l) === (null)) {
                throw new IOException();
            }
            let var2 = null;
            (var2 = new DataInputStream(new ByteArrayInputStream(CoreEngine.val_arr_byte_l)));
            CoreEngine.exec_I_int_to_void(var2.readByte());
            (CoreEngine.val_int_bu = var2.readByte());
            CoreEngine.exec_h_int_to_void(var2.readByte());
            let loadedBw = var2.readByte();
            if (typeof localStorage !== 'undefined' && !localStorage.getItem('umk3_advanced_mode_default_applied')) {
                (CoreEngine.val_int_bw = 1);
                try { localStorage.setItem('umk3_advanced_mode_default_applied', '1'); } catch (_) {}
            } else {
                (CoreEngine.val_int_bw = loadedBw);
            }
            (CoreEngine.val_int_bx = var2.readByte());
            let var12 = var2.readBoolean();
            CoreEngine.exec_d_bool_to_void(var12);
            if (var12) {
                let var3 = createMultiArray([var2.readByte(), 0], 0);
                for (let var7 = 0; (var7 < var3.length); var7++) {
                    (var3[var7] = createArray(var2.readByte(), 0));
                    for (let var1 = 0; (var1 < var3[var7].length); var1++) {
                        (var3[var7][var1] = var2.readInt());
                    }
                }
                (CoreEngine.val_arr_arr_int_c = var3);
                (CoreEngine.val_int_bZ = var2.readInt());
                (CoreEngine.val_int_ce = var2.readInt());
                (CoreEngine.val_int_cu = var2.readInt());
                (CoreEngine.val_long_g = var2.readInt());
            }
            let var11 = createArray(3, 0);
            for (let var10 = 0; (var10 < 10); var10++) {
                for (let var8 = 0; (var8 < 3); var8++) {
                    (var11[var8] = var2.readByte());
                }
                CoreEngine.exec_a_int_arr_byte_to_void(var10, var11);
                let var4 = var2.readInt();
                let var9 = var10;
                (CoreEngine.val_arr_int_ag[var9] = var4);
            }
            (CoreEngine.val_bool_U = var2.readBoolean());
            (CoreEngine.val_bool_V = var2.readBoolean());
            return true;
        } catch (var5) {
            CoreEngine.exec_d_bool_to_void(false);
            CoreEngine.exec_N_to_void();
            (CoreEngine.val_bool_V = true);
            CoreEngine.exec_I_to_void();
            return false;
        }
    }
    static exec_i_int_to_int(var0) {
        if ((var0) === (-1)) {
            return 1;
        }
        if ((var0) === (-2)) {
            return 2;
        }
        if ((var0) === (-3)) {
            return 3;
        }
        if ((var0) === (-4)) {
            return 4;
        }
        if ((var0) === (99999)) {
            return 9;
        }
        if ((var0) === (-8)) {
            return 10;
        }
        if ((var0) === (42)) {
            return 16;
        }
        if ((var0) === (35)) {
            return 15;
        }
        if ((var0) === (-5)) {
            return 7;
        }
        if ((var0) === (-6)) {
            return 13;
        }
        if ((var0) === (-7)) {
            return 14;
        }
        if ((var0) === (99999)) {
            return 0;
        }
        if ((var0) === (99999)) {
            return 0;
        }
        if ((var0) === (99999)) {
            return 0;
        }
        if ((var0) === (99999)) {
            return 0;
        }
        if ((var0) === (99999)) {
            return 0;
        }
        if ((var0) === (99999)) {
            return 0;
        }
        let var2 = 0;
        if (((var0 >= 48) && (var0 <= 57))) {
            (var2 = ((var0 - 48) + 17));
        } else {
            switch (var0) {
                case 0:
                    (var2 = 0);
                    break;
                case 35:
                    (var2 = 15);
                    break;
                case 42:
                    (var2 = 16);
                    break;
                default:
                    let var1 = 0;
                    if (((var0 >= 48) && (var0 <= 57))) {
                        (var1 = ((var0 - 48) + 17));
                    } else {
                        switch (var0) {
                            case 8:
                                (var1 = 10);
                                break;
                            case 35:
                                (var1 = 15);
                                break;
                            case 42:
                                (var1 = 16);
                                break;
                            default:
                                (var1 = 0);
                        }
                    }
                    (var2 = var1);
                    if ((var1) !== (0)) {
                        (var2 = var1);
                    } else {
                        try {
                            switch (CoreEngine.val_maincanvasbridge_a.getGameAction(var0)) {
                                case 1:
                                    (var2 = 1);
                                    break;
                                case 2:
                                    (var2 = 3);
                                case 3:
                                case 4:
                                case 7:
                                default:
                                    break;
                                case 5:
                                    (var2 = 4);
                                    break;
                                case 6:
                                    (var2 = 2);
                                    break;
                                case 8:
                                    (var2 = 7);
                            }
                        } catch (var3) {

                        }
                    }
            }
        }
        return var2;
    }
    static exec_a_int_int_int_int_to_void(var0, var1, var2, var3) {
        switch (var0) {
            case 0:
                if (CoreEngine.val_bool_i) {
                    CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var1, var2, 0, 0, 0, 0, 0, 1, 0, (((2) << 24) >> 24), false, false, false, false, false, false, CoreEngine.val_arr_animationset_f[var3], CoreEngine.val_spritepartsequence_y, CoreEngine.val_arr_animationset_f[var3], CoreEngine.val_spritepartsequence_y);
                }
                for (let var6 = 0; (var6 < CoreEngine.val_arr_arr_int_e.length); var6++) {
                    CoreEngine.exec_a_int_int_int_int_int_int_to_void(var1, var2, CoreEngine.val_arr_arr_int_e[var6][0], CoreEngine.val_arr_arr_int_e[var6][1], CoreEngine.val_arr_arr_int_e[var6][2], var3);
                }
                break;
            case 1:
                for (let var5 = 0; (var5 < CoreEngine.val_arr_arr_int_g.length); var5++) {
                    CoreEngine.exec_b_int_int_int_int_int_int_to_void(var1, var2, CoreEngine.val_arr_arr_int_g[var5][0], CoreEngine.val_arr_arr_int_g[var5][1], CoreEngine.val_arr_arr_int_g[var5][2], var3);
                }
                CoreEngine.exec_a_int_int_int_int_int_int_to_void(var1, var2, 64, 64, 600, var3);
                CoreEngine.exec_a_int_int_int_int_int_int_to_void(var1, var2, 64, 64, 600, var3);
                CoreEngine.exec_a_int_int_int_int_int_int_to_void(var1, var2, 64, 64, 600, var3);
                return;
            case 2:
                for (let var4 = 0; (var4 < CoreEngine.val_arr_arr_int_g.length); var4++) {
                    CoreEngine.exec_b_int_int_int_int_int_int_to_void(var1, var2, -CoreEngine.val_arr_arr_int_g[var4][0], CoreEngine.val_arr_arr_int_g[var4][1], CoreEngine.val_arr_arr_int_g[var4][2], var3);
                }
                CoreEngine.exec_a_int_int_int_int_int_int_to_void(var1, var2, -64, 64, 600, var3);
                CoreEngine.exec_a_int_int_int_int_int_int_to_void(var1, var2, -64, 64, 600, var3);
                CoreEngine.exec_a_int_int_int_int_int_int_to_void(var1, var2, -64, 64, 600, var3);
        }
    }
    static exec_b_bool_to_void(var0) {
        try {
            (CoreEngine.val_bool_aN = true);
            (CoreEngine.val_int_eo = 1);
            (CoreEngine.val_int_ep = 0);
            (CoreEngine.saveRecordStore = RecordStore.openRecordStore("DataStore", true));
            (CoreEngine.val_int_en = 0);
            if (var0) {
                for (let var2 = (CoreEngine.saveRecordStore.getNumRecords() + 1); (var2 <= CoreEngine.val_int_eo); var2++) {
                    CoreEngine.saveRecordStore.addRecord(CoreEngine.val_arr_byte_m, 0, 0);
                }
            } else {
                if ((CoreEngine.saveRecordStore.getNumRecords() < CoreEngine.val_int_eo)) {
                    (CoreEngine.val_bool_aN = false);
                    return;
                }
            }
            if (((CoreEngine.val_arr_byte_n = CoreEngine.saveRecordStore.getRecord(CoreEngine.val_int_eo))) === (null)) {
                (CoreEngine.val_bool_aN = false);
            } else {
                while (((CoreEngine.val_int_en < CoreEngine.val_arr_byte_n.length) && (CoreEngine.val_arr_byte_n[CoreEngine.val_int_en]) !== (CoreEngine.val_int_ep))) {
                    (CoreEngine.val_int_en = ((CoreEngine.val_int_en = (CoreEngine.val_int_en + (((CoreEngine.val_arr_byte_n[(CoreEngine.val_int_en + 1)] & 255) << 8) | (CoreEngine.val_arr_byte_n[(CoreEngine.val_int_en + 2)] & 255)))) + 3));
                }
                if ((CoreEngine.val_int_en < CoreEngine.val_arr_byte_n.length)) {
                    (var0 = true);
                } else {
                    (var0 = false);
                }
                (CoreEngine.val_bool_aN = var0);
            }
        } catch (var1) {

        }
    }
    static exec_a_int_bool_scenebase_to_void(var0, var1, var2) {
        while (true) {
            switch (var0) {
                case 0:
                    return;
                case 11:
                    if (!var1) {
                        let var9 = CoreEngine.val_globalcontext_a.rootAudioContext;
                        CoreEngine.setChannelVolume(((((CoreEngine.val_globalcontext_a.rootAudioContext.volumeLevel + 51)) << 16) >> 16), var9);
                    }
                    return;
                case 12:
                    if (!var1) {
                        let var8 = CoreEngine.val_globalcontext_a.rootAudioContext;
                        CoreEngine.setChannelVolume(((((CoreEngine.val_globalcontext_a.rootAudioContext.volumeLevel - 51)) << 16) >> 16), var8);
                    }
                    return;
                default:
                    let var3 = var0;
                    if ((var2.sceneConfigShorts[var0]) !== (0)) {
                        (var3 = var2.sceneConfigShorts[var0]);
                    }
                    let var4 = var3;
                    let var5 = var2.sceneConfigShorts[var3];
                    let var6 = var2.sceneExtraShorts[var5];
                    if (var1) {
                        if ((var6) === (var0)) {
                            (var2.sceneExtraShorts[var5] = 0);
                            if ((var2.sceneStateId) === (var0)) {
                                (var2.sceneStateId = 0);
                            }
                            (var2).inputManager.handleKeyEvent(var4, false);
                            return;
                        }
                        if (var2.sceneCompleteFlag) {
                            (var1 = true);
                            (var0 = var6);
                            continue;
                        }
                    } else {
                        if ((var6) !== (0)) {
                            if ((var5) !== (0)) {
                                (var5 = var6);
                                if ((var2.sceneConfigShorts[var6]) !== (0)) {
                                    (var5 = var2.sceneConfigShorts[var6]);
                                }
                                if ((var5) === (var4)) {
                                    return;
                                }
                            }
                            CoreEngine.exec_a_int_bool_scenebase_to_void(var6, true, var2);
                            if (!var2.sceneCompleteFlag) {
                                (var1 = false);
                                continue;
                            }
                        } else {
                            (var2.sceneExtraShorts[var5] = (((var0) << 16) >> 16));
                            (var2.sceneStateId = var0);
                            (var2.sceneDuration = Integer.MAX_VALUE);
                            (var2).inputManager.handleKeyEvent(var3, true);
                        }
                    }
                    return;
            }
        }
    }
    static exec_I_to_void() {
        try {
            let var0 = null;
            (var0 = new ByteArrayOutputStream());
            let var4 = null;
            (var4 = new DataOutputStream(var0));
            var4.writeByte(CoreEngine.val_int_bv);
            var4.writeByte(CoreEngine.val_int_bu);
            var4.writeByte(CoreEngine.val_int_g);
            var4.writeByte(CoreEngine.val_int_bw);
            var4.writeByte(CoreEngine.val_int_bx);
            if (CoreEngine.val_bool_aa) {
                var4.writeBoolean(true);
                let var1 = CoreEngine.val_arr_arr_int_c;
                var4.writeByte(var1.length);
                for (let var2 = 0; (var2 < var1.length); var2++) {
                    var4.writeByte(var1[var2].length);
                    for (let var3 = 0; (var3 < var1[var2].length); var3++) {
                        var4.writeInt(var1[var2][var3]);
                    }
                }
                var4.writeInt(CoreEngine.val_int_bZ);
                var4.writeInt(CoreEngine.val_int_ce);
                var4.writeInt(CoreEngine.val_int_cu);
                var4.writeInt(((CoreEngine.val_long_g) | 0));
            } else {
                var4.writeBoolean(false);
            }
            for (let var10 = 0; (var10 < 10); var10++) {
                let var6 = var10;
                let var9 = CoreEngine.val_arr_arr_byte_c[var6];
                for (let var7 = 0; (var7 < 3); var7++) {
                    var4.writeByte(var9[var7]);
                }
                (var6 = var10);
                var4.writeInt(CoreEngine.val_arr_int_ag[var6]);
            }
            var4.writeBoolean(CoreEngine.val_bool_U);
            var4.writeBoolean(CoreEngine.val_bool_V);
            let var10000 = (CoreEngine.val_arr_byte_l = var0.toByteArray());
            CoreEngine.exec_a_arr_byte_int_contextservicenode_to_void(var10000, var10000.length, CoreEngine.exec_c_to_contextservicenode());
            CoreEngine.exec_c_to_contextservicenode();
        } catch (var5) {

        }
    }
    static exec_a_arr_arr_int_to_void(var0) {
        (CoreEngine.val_arr_arr_int_c = var0);
        (CoreEngine.val_arr_int_au = createArray(var0.length, 0));
        (CoreEngine.val_arr_int_aw = createArray(var0.length, 0));
        (CoreEngine.val_arr_int_av = createArray(var0.length, 0));
        (CoreEngine.val_int_bY = 0);
        (CoreEngine.val_int_bW = Math.trunc(((CoreEngine.val_int_bD - (CoreEngine.val_arr_int_aB[8] * CoreEngine.val_arr_arr_int_c.length))) / ((CoreEngine.val_arr_arr_int_c.length + 1))));
        for (let var1 = 0; (var1 < var0.length); var1++) {
            (CoreEngine.val_arr_int_au[var1] = ((var0[var1].length - 1) * CoreEngine.val_arr_int_aC[8]));
            if ((CoreEngine.val_arr_int_au[var1] > CoreEngine.val_int_bY)) {
                (CoreEngine.val_int_bY = CoreEngine.val_arr_int_au[var1]);
            }
            (CoreEngine.val_arr_int_av[var1] = (((var1 + 1) * CoreEngine.val_int_bW) + (var1 * CoreEngine.val_arr_int_aB[7])));
            (CoreEngine.val_arr_int_aw[var1] = ((var0[var1].length - 1) * CoreEngine.val_arr_int_aC[6]));
        }
        (CoreEngine.val_int_bX = Math.max((CoreEngine.val_arr_int_aC[0] + CoreEngine.val_int_bY), (CoreEngine.val_int_bE - CoreEngine.val_int_ar)));
        (CoreEngine.val_int_bZ = 1);
        CoreEngine.exec_ad_to_void();
    }
    static exec_a_int_arr_int_to_arr_spriteimage(var0, var1) {
        try {
            let var2 = null;
            (var2 = new PackedResourceStream(var0));
            let var7 = createArray(var2.resourceId, 0);
            var2.read(var7);
            var2.close();
            let var3 = createArray(var1.length, null);
            for (let var8 = 0; (var8 < var3.length); var8++) {
                if ((var1[var8]) === (-1)) {
                    (var3[var8] = CoreEngine.exec_a_arr_byte_int_int_to_spriteimage(var7, 0, var7.length));
                    break;
                }
            }
            for (let var9 = 0; (var9 < var3.length); var9++) {
                if ((var1[var9]) !== (-1)) {
                    let var4 = null;
                    (var4 = new PackedResourceStream(var1[var9]));
                    let var5 = createArray(var4.resourceId, 0);
                    var4.read(var5);
                    var4.close();
                    let var10 = 0;
                    while (((var10 < (var7.length - 4)) && ((((var7[var10]) !== (CoreEngine.val_arr_byte_d[0]) || (var7[(var10 + 1)]) !== (CoreEngine.val_arr_byte_d[1])) || (var7[(var10 + 2)]) !== (CoreEngine.val_arr_byte_d[2])) || (var7[(var10 + 3)]) !== (CoreEngine.val_arr_byte_d[3])))) {
                        var10++;
                    }
                    System.arraycopy(var5, 0, var7, (var10 + -4), var5.length);
                    (var3[var9] = CoreEngine.exec_a_arr_byte_int_int_to_spriteimage(var7, 0, var7.length));
                }
            }
            return var3;
        } catch (var6) {
            return null;
        }
    }
    static exec_a_short_short_short_gamemidletloop_to_void(var0, var1, var2, var3) {
        if (((!var3.isInitialized && !var3.isRunning) || (var0) === (6))) {
            switch (var0) {
                case 5:
                    (var3.isInitialized = true);
                    CoreEngine.getGlobalAudioContext();
                    (var3.isBackgrounded = CoreEngine.getGlobalAudioContext().isPlaying);
                    CoreEngine.getGlobalAudioContext();
                    CoreEngine.exec_a_bool_to_void(true);
                    CoreEngine.exec_a_int_featureflag_to_void(0, CoreEngine.exec_a_to_contextservicenode().val_featureflag_a);
                    let var4 = var3.frameHistoryArray;

                    try {
                        (var3.loopState = 0);
                        break;
                    } catch (var9) {
                        let var10 = var9;
                        while (true) {
                            try {
                                throw var10;
                            } catch (var8) {
                                (var10 = var8);
                            }
                        }
                    }
                case 6:
                    CoreEngine.getGlobalAudioContext();
                    CoreEngine.getGlobalAudioContext();
                    CoreEngine.exec_a_bool_to_void(false);
            }
            let var11 = 1;
            let var5 = var3.frameHistoryArray;

            try {
                switch (var0) {
                    case 1:
                        if ((var3.loopState >= 5)) {
                            (var11 = 0);
                        }
                        break;
                    case 5:
                    case 6:
                        if ((var3.loopState >= 8)) {
                            (var11 = 0);
                        }
                        break;
                    default:
                        if ((var3.loopState >= 6)) {
                            (var11 = 0);
                        }
                }
                if ((var11) !== (0)) {
                    let var10000 = var3.frameHistoryArray;
                    let var10001 = var3.loopState;
                    (var11 = (var3.loopState + 1));
                    (var3.loopState = var11);
                    (var10000[var10001] = ((BigInt(var0 & 0xFFFF) << 48n) | (BigInt(var1 & 0xFFFF) << 32n) | (BigInt(var2 & 0xFFFF) << 16n)));
                }
            } catch (var7) {
                let var12 = var7;
                while (true) {
                    try {
                        throw var12;
                    } catch (var6) {
                        (var12 = var6);
                    }
                }
            }
        }
    }
    static exec_a_string_to_string(var0) {
        if (CoreEngine.val_bool_m) {
            if (var0.startsWith("MG_CATURI_")) {
                if ((CoreEngine.val_arr_byte_a[1]) === (2)) {
                    return null;
                }
            } else {
                if ((var0.startsWith("MG_BUYURI_") && (CoreEngine.val_arr_byte_a[2]) === (2))) {
                    return null;
                }
            }
            if (var0.equals("MG_Impl")) {
                switch (CoreEngine.val_arr_byte_a[0]) {
                    case 0:
                        return "off";
                    case 1:
                        return "static";
                    case 2:
                        return "wap";
                    case 3:
                        return "wapstatic";
                }
            }
            if (var0.equals("MG_PRODUCTS")) {
                let var1 = null;
                if (((var1 = CoreEngine.exec_b_string_to_string(var0))) === (null)) {
                    return null;
                }
                if ((CoreEngine.val_arr_byte_a[3]) === (0)) {
                    return "";
                }
                (var0 = var1.trim());
                if ((CoreEngine.val_arr_byte_a[3]) !== (-1)) {
                    let var2 = -1;
                    let var4 = 0;
                    while (((var4 < CoreEngine.val_arr_byte_a[3]) && ((var2 = var0.indexOf(44, (var2 + 1)))) !== (-1))) {
                        var4++;
                    }
                    if ((var2) !== (-1)) {
                        (var0 = var0.substring(0, var2));
                    }
                }
                if ((CoreEngine.val_arr_byte_a[4]) !== (-1)) {
                    let var5 = 0;
                    if (((var5 = var0.indexOf(44, 0))) === (-1)) {
                        return var0;
                    }
                    (var0 = ((var0.substring((var5 + 1)) + ',') + var0.substring(0, var5)));
                }
                return var0;
            }
        }
        return CoreEngine.exec_b_string_to_string(var0);
    }
    static exec_a_int_int_byte_to_spriteimage(var0, var1, var2) {
        let var3 = (var0 & 16777215);
        (var0 >>>= 24);
        let var8 = null;
        if ((CoreEngine.val_arr_int_bh[var0]) === (0)) {
            let var9 = CoreEngine.val_arr_string_d[var3];
            (var8 = CoreEngine.exec_a_string_to_spriteimage(("/" + var9)));
        } else {
            CoreEngine.exec_G_int_to_void(var0);
            let var10001 = 0;
            let var5 = 0;
            let var6 = 0;
            try {
                let var4 = new DataInputStream(new ByteArrayInputStream(CoreEngine.val_arr_arr_byte_y[var0]));
                (var10001 = var4.readInt());
                var4.readInt();
                var4.skipBytes((var3 << 3));
                (var5 = var4.readInt());
                (var6 = (((4 + var10001) + 4) + var4.readInt()));
                var4.close();
            } catch (varEx) {

            }
            let var11 = null;
            let var10 = null;
            if (((var1) !== (-1) || (var2) !== (0))) {
                (var11 = CoreEngine.exec_a_arr_byte_int_int_to_arr_byte(CoreEngine.val_arr_arr_byte_y[var0], var6, var5));
            }
            if ((var1) !== (-1)) {
                (var10 = CoreEngine.loadResourceBytes(var1));
            }
            if ((var2) !== (0)) {
                if ((var10) === (null)) {
                    (var10 = createArray(var11.length, 0));
                    System.arraycopy(var11, 0, var10, 0, var11.length);
                }
                CoreEngine.exec_a_arr_byte_byte_to_void(var10, var2);
            }
            if ((var10) !== (null)) {
                CoreEngine.copyByteArray(CoreEngine.val_arr_arr_byte_y[var0], var6, var5, var10);
            }
            (var8 = CoreEngine.exec_a_arr_byte_int_int_to_spriteimage(CoreEngine.val_arr_arr_byte_y[var0], var6, var5));
            if ((var11) !== (null)) {
                CoreEngine.copyByteArray(CoreEngine.val_arr_arr_byte_y[var0], var6, var5, var11);
            }
            (CoreEngine.val_int_er = var6);
            (CoreEngine.val_int_es = var5);
            (CoreEngine.val_int_et = var0);
            (CoreEngine.val_arr_byte_p = var10);
        }
        return var8;
    }
    static exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0, var1) {
        let var2 = CoreEngine.exec_a_to_fontcharmap();
        let var3 = -1;
        let var4 = 0;
        for (let var5 = 0; (var5 < var2.val_byte_b); var5++) {
            (var4 += var2.val_arr_short_a[var5]);
            if ((var0 < var4)) {
                (var3 = var5);
                break;
            }
        }
        let var7 = (var0 - (var4 - var2.val_arr_short_a[var3]));
        let var6 = var2.val_arr_byte_c[var3];
        if ((var1) === (null)) {
            (var1 = new EncodedTextBuffer());
        } else {
            if (((var1.flagsByte & 64)) !== (0)) {
                (var1.textBytes = null);
                (var1.textBytes = null);
            }
        }
        (var1.textBytes = var2.val_arr_arr_byte_b[var6]);
        (var1.textLength = (var2.val_arr_arr_short_b[var6][var7] & 65535));
        (var1.bufferCapacity = ((var2.val_arr_arr_short_b[var6][(var7 + 1)] & 65535) - (var2.val_arr_arr_short_b[var6][var7] & 65535)));
        let var8 = var2.val_arr_byte_a[var2.val_byte_d];
        if (((var2.val_arr_byte_b[var3] & -63)) !== (0)) {
            (var8 = 0);
        }
        if ((var8) === (0)) {
            (var1.bufferCapacity = ((((var1.bufferCapacity >> 1)) << 16) >> 16));
        }
        (var1.flagsByte = var8);
        (var1.encodingType = var1.bufferCapacity);
        return var1;
    }
    static exec_a_int_int_to_spritepartsequence(var0, var1) {
        try {
            let var7 = null;
            (var0 = (var7 = CoreEngine.openResourceStream(var0)).readUnsignedByte());
            let var2 = var7.readUnsignedByte();
            let var8 = null;
            (var8 = new SpritePartSequence(var2, var7.readUnsignedByte(), var1, var0));
            let var9 = 0;
            for (let var10 = 0; (var10 < var2); var10++) {
                let var15 = var7.readShort();
                (var0 = var7.readUnsignedByte());
                for (let var3 = 0; (var3 < var0); var3++) {
                    let var10000 = var7.readUnsignedByte();
                    let var4 = var7.readShort();
                    let var5 = var7.readShort();
                    let var11 = var10;
                    let var12 = (((var10000) << 16) >> 16);
                    let var6 = 0;
                    (var8.frameOffsets[(var6 = (var9 * 3))] = var12);
                    (var8.frameOffsets[++var6] = (((var4) << 16) >> 16));
                    (var8.frameOffsets[(var6 + 1)] = (((var5) << 16) >> 16));
                    if ((var8.frameDurations) !== (null)) {
                        (var8.frameDurations[var10] = (((var9) << 24) >> 24));
                    }
                    if ((var8.partOffsets[var11]) === (0)) {
                        let var18 = var8.partOffsets;
                        if ((var11) === (0)) {
                            (var6 = var15);
                        } else {
                            (var6 = (var8.partOffsets[(var11 - 1)] + var15));
                        }
                        (var18[var11] = (((var6) << 16) >> 16));
                        (var8.sequenceFlags += var15);
                    }
                    var9++;
                }
            }
            var7.close();
            return var8;
        } catch (varEx) {
            return null;
        }
    }
    static exec_b_string_to_arr_byte(var0) {
        let var2 = ("/" + var0);
        let var3 = System.out.getResourceAsStream(var2);
        let var4 = null;
        (var4 = new GrowableByteBuffer());
        let var9 = -1;
        try {
            (var9 = var3.read());
        } catch (var8) {
            (var9 = -1);
        }
        while ((var9) !== (-1)) {
            let var10 = (((var9) << 24) >> 24);
            let var5 = var4.byteCount;
            let var6 = 0;
            let var1 = (var6 = (var4.byteCount + 1));
            let var12 = 0;
            if ((var4.bufferData) === (null)) {
                (var12 = 0);
            } else {
                (var12 = var4.bufferData.length);
            }
            if ((var12 < var6)) {
                if (((var6 - var12) < var4.maxCapacity)) {
                    (var1 = (var12 + var4.maxCapacity));
                }
                let var13 = createArray(var1, 0);
                for (let var11 = 0; (var11 < var4.byteCount); var11++) {
                    (var13[var11] = var4.bufferData[var11]);
                }
                (var4.bufferData = var13);
            }
            (var4.bufferData[var5] = var10);
            (var4.byteCount = var6);
            try {
                (var9 = var3.read());
            } catch (var7) {
                (var9 = -1);
            }
        }
        let var15 = createArray(var4.byteCount, 0);
        for (let var14 = 0; (var14 < var4.byteCount); var14++) {
            (var15[var14] = var4.bufferData[var14]);
        }
        return var15;
    }
    static exec_a_entityinterface_int_int_to_void(var0, var1, var2) {
        let var10000 = (CoreEngine.val_arr_int_bm = var0.getBounds());
        let var3 = (var10000[0] + var1);
        (var10000[0] = var3);
        (var3 = (CoreEngine.val_arr_int_bm[1] + var2));
        (CoreEngine.val_arr_int_bm[1] = var3);
        if ((CoreEngine.val_arr_int_bm[7]) !== (0)) {
            (var3 = (CoreEngine.val_arr_int_bm[8] + var1));
            (CoreEngine.val_arr_int_bm[8] = var3);
            (var3 = (CoreEngine.val_arr_int_bm[9] + var2));
            (CoreEngine.val_arr_int_bm[9] = var3);
        }
        if ((CoreEngine.val_arr_int_bm[1] > 0)) {
            var0.applyAction(8);
            (CoreEngine.val_arr_int_bm[1] = 0);
        } else {
            if ((CoreEngine.val_arr_int_bm[1] < CoreEngine.val_int_eF)) {
                var0.applyAction(1);
                (CoreEngine.val_arr_int_bm[1] = CoreEngine.val_int_eF);
            }
        }
        if ((CoreEngine.val_arr_int_bm[0] < CoreEngine.val_int_eG)) {
            var0.applyAction(2);
            (CoreEngine.val_arr_int_bm[0] = CoreEngine.val_int_eG);
        } else {
            if ((CoreEngine.val_arr_int_bm[0] > CoreEngine.val_int_eH)) {
                var0.applyAction(4);
                (CoreEngine.val_arr_int_bm[0] = CoreEngine.val_int_eH);
            }
        }
    }
    static exec_a_arr_int_bool_to_void(var0, var1) {
        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
        (CoreEngine.val_int_aE = var0[0]);
        (CoreEngine.val_bool_I = (var1));
        (CoreEngine.val_byte_h = 1);
        let var_b = (((((CoreEngine.val_int_aF > 0) ? 4 : 0)) << 24) >> 24);
        (CoreEngine.val_byte_i = var_b);
        (CoreEngine.val_int_aH = 1);
        (CoreEngine.val_arr_encodedtextbuffer_a = createArray((CoreEngine.val_int_aG = CoreEngine.val_int_p), null));
        (CoreEngine.val_arr_int_u = createArray(CoreEngine.val_int_aG, 0));
        (CoreEngine.val_encodedtextbuffer_d = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[1], null));
        let var3 = false;
        if ((CoreEngine.val_int_aG > CoreEngine.val_arr_int_O[CoreEngine.val_int_aH])) {
            (var3 = true);
        } else {
            (var3 = false);
        }
        (CoreEngine.val_bool_J = var3);
        if (var3) {
            (CoreEngine.val_arr_int_t = createArray(3, 0));
        } else {
            (CoreEngine.val_arr_int_t = createArray(CoreEngine.val_int_aG, 0));
        }
        CoreEngine.exec_L_to_void();
        (CoreEngine.val_int_aD = 0);
        for (let var4 = 0; (var4 < CoreEngine.val_int_aG); var4++) {
            (CoreEngine.val_arr_encodedtextbuffer_a[var4] = CoreEngine.exec_a_int_int_to_encodedtextbuffer(var4, 0));
            (CoreEngine.val_arr_int_u[var4] = CoreEngine.exec_a_encodedtextbuffer_to_int(CoreEngine.val_arr_encodedtextbuffer_a[var4]));
        }
        CoreEngine.exec_e_int_to_void(0);
    }
    static exec_x_int_to_void(var0) {
        (CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp] = (((var0) << 24) >> 24));
        if ((CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp] > (CoreEngine.val_arr_short_a.length - 1))) {
            (CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp] = 0);
        }
        if ((CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp] < 0)) {
            (CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp] = ((((CoreEngine.val_arr_short_a.length - 1)) << 24) >> 24));
        }
        CoreEngine.val_arr_encodedtextbuffer_e[CoreEngine.val_int_bp].setCharAt(0, ((CoreEngine.val_arr_short_a[CoreEngine.val_arr_byte_j[CoreEngine.val_int_bp]]) & 0xFFFF));
        let var1 = true;
        for (let var2 = 0; (var2 < 3); var2++) {
            if ((CoreEngine.val_arr_byte_j[var2]) !== (CoreEngine.val_arr_byte_i[var2])) {
                (var1 = false);
            }
        }
        if (!var1) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        (CoreEngine.val_bool_Q = var1);
    }
    static assignClipToChannel(var0, var1) {
        (var1 = var1.nextContext);
        let var2 = null;

        let var9 = null;
        label65: {
            label64: {
                try {
                    if ((var1.val_audioclipnode_b) === (null)) {
                        break label64;
                    }
                    if ((CoreEngine.isChannelActive(var1) || (CoreEngine.isChannelBusy(var1) && !CoreEngine.val_globalcontext_a.currentScene.isSceneActive))) {
                        CoreEngine.pauseAudioChannel(var1);
                    }
                    if (((var1.activeClipNode) === (var0) && (var1.val_audioclipnode_b.mediaPlayer) !== (null))) {
                        return;
                    }
                } catch (var6) {
                    (var9 = var6);
                    break label65;
                }
                try {
                    if (((CoreEngine.getClipDuration(var1.val_audioclipnode_b)) !== (300) && (var1.val_audioclipnode_b.mediaPlayer) !== (null))) {
                        CoreEngine.freeAudioClip(var1.val_audioclipnode_b);
                    }
                } catch (var5) {
                    (var9 = var5);
                    break label65;
                }
            }
            try {
                (var1.activeClipNode = var0);
                (var1.playbackPosition = 0);
                if ((var1.activeClipNode) !== (null)) {
                    (var0 = var0.nextClip);
                    (var1.val_audioclipnode_b = var0);
                    if ((var0.mediaPlayer) === (null)) {
                        CoreEngine.isClipPlayable(var0);
                    }
                    CoreEngine.exec_a_bool_audioplaybackcontext_to_void(var1.isPlaying, var1);
                } else {
                    (var1.val_audioclipnode_b = null);
                }
                return;
            } catch (var4) {
                (var9 = var4);
            }
        }
        while (true) {
            try {
                throw var9;
            } catch (var3) {
                (var9 = var3);
            }
        }
    }
    static exec_a_arr_byte_byte_to_void(var0, var1) {
        for (let var2 = 0; (var2 <= (var0.length - 3)); (var2 += 3)) {
            let var3 = (var0[var2] & 255);
            let var4 = (var0[(var2 + 1)] & 255);
            let var5 = (var0[(var2 + 2)] & 255);
            switch (var1) {
                case 1:
                    (var3 = Math.trunc(((var3 * 5)) / (10)));
                    (var4 = Math.trunc(((var4 * 5)) / (10)));
                    (var5 = Math.trunc(((var5 * 5)) / (10)));
                    break;
                case 2:
                    (var3 = Math.min(255, Math.trunc(((var3 << 4)) / (10))));
                    (var4 = Math.min(255, Math.trunc(((var4 << 4)) / (10))));
                    (var5 = Math.min(255, Math.trunc(((var5 << 4)) / (10))));
                    break;
                case 3:
                    (var4 = Math.trunc(((var3 * 7)) / (10)));
                    (var3 = Math.trunc(((var3 << 2)) / (10)));
            }
            (var0[var2] = (((var3) << 24) >> 24));
            (var0[(var2 + 1)] = (((var4) << 24) >> 24));
            (var0[(var2 + 2)] = (((var5) << 24) >> 24));
        }
    }
    static exec_c_int_to_bool(var0) {
        let var1 = null;
        let var2 = (var1 = CoreEngine.exec_a_to_fontcharmap()).val_byte_d;
        if ((((var1.val_arr_arr_byte_a) !== (null) && (var0 >= 0)) && (var0 < var1.val_byte_e))) {
            (var1.val_byte_d = (((var0) << 24) >> 24));
        }
        if ((var1.val_byte_d) !== (var2)) {
            (var1.val_bool_b = true);
            for (let var3 = 1; (var3 < var1.val_byte_b); var3++) {
                if ((CoreEngine.exec_e_int_to_bool(var3) && ((var1.val_arr_byte_b[var3] & 64)) === (0))) {
                    CoreEngine.exec_h_int_to_int(var3);
                }
            }
            (var1.val_bool_b = false);
            if (((var1.val_arr_byte_a[var1.val_byte_d]) !== (var1.val_arr_byte_a[var2]) && (var1.val_arr_byte_a[var1.val_byte_d] > 1))) {
                var1.setFontStyle(var1.val_arr_byte_a[var1.val_byte_d]);
            }
        }
        let var4 = false;
        if ((var1.val_byte_d) === (var0)) {
            (var4 = true);
        } else {
            (var4 = false);
        }
        return var4;
    }
    static exec_a_byte_bool_to_void(var0, var1) {
        if ((var0) !== (-1)) {
            if (((var0 = AudioMetaTable.val_arr_byte_a[var0])) !== (-1)) {
                if ((AudioMetaTable.val_arr_int_a[var0]) !== (-1)) {
                    if (((CoreEngine.val_int_bv) === (2) || (var1 && (CoreEngine.val_int_bv) === (0)))) {
                        if ((CoreEngine.val_thread_a) !== (null)) {
                            if (CoreEngine.val_thread_a.isAlive()) {
                                if ((AudioMetaTable.val_arr_byte_c[var0]) === (1)) {
                                    return;
                                }
                                try {
                                    CoreEngine.val_thread_a.join();
                                } catch (var2) {

                                }
                            }
                            (CoreEngine.val_thread_a = null);
                            (CoreEngine.val_bool_H = false);
                            (CoreEngine.val_int_aA = 0);
                        }
                        if ((AudioMetaTable.val_arr_byte_b[var0]) === (1)) {
                            CoreEngine.exec_f_byte_to_void(var0);
                            return;
                        }
                        (CoreEngine.val_bool_H = true);
                        (CoreEngine.val_thread_a = new AsyncWorkerThread(var0)).setPriority(10);
                        CoreEngine.val_thread_a.start();
                    }
                }
            }
        }
    }
    static exec_e_int_to_void(var0) {
        (CoreEngine.val_int_aD = var0);
        if ((var0 >= CoreEngine.val_int_aG)) {
            (CoreEngine.val_int_aD = 0);
        }
        if ((CoreEngine.val_int_aD < 0)) {
            (CoreEngine.val_int_aD = (CoreEngine.val_int_aG - 1));
        }
        if (CoreEngine.val_bool_J) {
            let var2 = CoreEngine.val_arr_int_t;
            let var4 = 0;
            if ((CoreEngine.val_int_aD > 0)) {
                (var4 = (CoreEngine.val_int_aD - 1));
            } else {
                (var4 = (CoreEngine.val_int_aG - 1));
            }
            (var2[0] = var4);
            (CoreEngine.val_arr_int_t[1] = CoreEngine.val_int_aD);
            let var5 = CoreEngine.val_arr_int_t;
            if ((CoreEngine.val_int_aD < (CoreEngine.val_int_aG - 1))) {
                (var0 = (CoreEngine.val_int_aD + 1));
            } else {
                (var0 = 0);
            }
            (var5[2] = var0);
        } else {
            let var1 = 0;
            while ((var1 < CoreEngine.val_int_aG)) {
                (CoreEngine.val_arr_int_t[var1] = var1++);
            }
        }
    }
    static exec_g_to_void() {
        for (let var0 = 0; (var0 < 16); var0++) {
            if (((AudioMetaTable.val_arr_byte_d[var0]) !== (-1) && (AudioMetaTable.val_arr_int_c[AudioMetaTable.val_arr_byte_d[var0]]) !== (-1))) {
                try {
                    CoreEngine.val_audiomanager_a.unloadClip(AudioMetaTable.val_arr_int_c[AudioMetaTable.val_arr_byte_d[var0]]);
                } catch (var2) {

                }
            }
        }
        for (let var3 = 0; (var3 < 55); var3++) {
            if (((AudioMetaTable.val_arr_byte_a[var3]) !== (-1) && (AudioMetaTable.val_arr_int_a[AudioMetaTable.val_arr_byte_a[var3]]) !== (-1))) {
                try {
                    CoreEngine.val_audiomanager_a.unloadClip(AudioMetaTable.val_arr_int_a[AudioMetaTable.val_arr_byte_a[var3]]);
                } catch (var1) {

                }
            }
        }
    }
    static exec_b_byte_bool_to_void(var0, var1) {
        if ((var0) !== (-1)) {
            if (((var0 = AudioMetaTable.val_arr_byte_d[var0])) !== (-1)) {
                if ((AudioMetaTable.val_arr_int_c[var0]) !== (-1)) {
                    if (((CoreEngine.val_int_bv) === (0) || (var1 && (CoreEngine.val_int_bv) === (2)))) {
                        if (((var0) !== (CoreEngine.val_byte_f) || (AudioMetaTable.val_arr_byte_e[var0]) !== (0))) {
                            CoreEngine.exec_l_to_void();
                            (CoreEngine.val_byte_f = var0);
                            try {
                                if ((AudioMetaTable.val_arr_byte_e[var0]) === (0)) {
                                    CoreEngine.val_audiomanager_a.setLooping(-1);
                                } else {
                                    CoreEngine.val_audiomanager_a.setLooping(1);
                                }
                                (CoreEngine.val_audiomanager_a.currentSoundId = 0);
                                CoreEngine.val_audiomanager_a.playSound(AudioMetaTable.val_arr_int_c[var0]);
                            } catch (var2) {

                            }
                        }
                    }
                }
            }
        }
    }
    static exec_c_int_to_int(var0) {
        if (((var0 >= 48) && (var0 <= 57))) {
            return ((var0 - 48) + 17);
        }
        switch (var0) {
            case 0:
                return 0;
            case 35:
                return 15;
            case 42:
                return 16;
            default:
                let var1 = 0;
                if (((var0 >= 48) && (var0 <= 57))) {
                    (var1 = ((var0 - 48) + 17));
                } else {
                    switch (var0) {
                        case 8:
                            (var1 = 10);
                            break;
                        case 35:
                            (var1 = 15);
                            break;
                        case 42:
                            (var1 = 16);
                            break;
                        default:
                            (var1 = 0);
                    }
                }
                let var2 = var1;
                if ((var1) !== (0)) {
                    return var1;
                } else {
                    try {
                        switch (CoreEngine.val_maincanvasbridge_a.getGameAction(var0)) {
                            case 1:
                                (var2 = 1);
                                break;
                            case 2:
                                (var2 = 3);
                            case 3:
                            case 4:
                            case 7:
                            default:
                                break;
                            case 5:
                                (var2 = 4);
                                break;
                            case 6:
                                (var2 = 2);
                                break;
                            case 8:
                                (var2 = 7);
                        }
                    } catch (var3) {

                    }
                    return var2;
                }
        }
    }
    static exec_J_to_void() {
        (CoreEngine.val_int_aZ = (CoreEngine.val_int_aZ + CoreEngine.val_int_e));
        (CoreEngine.val_bool_M = CoreEngine.val_bool_ar);
        (CoreEngine.val_bool_N = CoreEngine.val_bool_as);
        if ((CoreEngine.val_int_aZ > 100)) {
            if (CoreEngine.val_bool_N) {
                if ((CoreEngine.val_int_aS < CoreEngine.val_int_aT)) {
                    CoreEngine.val_int_aS++;
                }
                (CoreEngine.val_int_aZ = 1);
            }
            if (CoreEngine.val_bool_M) {
                if ((CoreEngine.val_int_aS > 1)) {
                    CoreEngine.val_int_aS--;
                }
                (CoreEngine.val_int_aZ = 0);
            }
        }
        let var0 = false;
        if ((CoreEngine.val_int_aS > 1)) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        (CoreEngine.val_bool_K = var0);
        if ((CoreEngine.val_int_aS < CoreEngine.val_int_aT)) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        (CoreEngine.val_bool_L = var0);
    }
    static exec_a_arr_byte_int_to_int(var0, var1) {
        let var2 = 9;
        for (let var3 = 9; (var3 >= 0); var3--) {
            if ((var1 > CoreEngine.val_arr_int_ag[var3])) {
                (var2 = var3);
            }
        }
        for (let var6 = 9; (var6 > var2); var6--) {
            let var7 = var6;
            let var8 = (var6 - 1);
            let var4 = createArray(3, 0);
            for (let var5 = 0; (var5 < 3); var5++) {
                (var4[var5] = CoreEngine.val_arr_arr_byte_c[var8][var5]);
            }
            CoreEngine.exec_a_int_arr_byte_to_void(var7, var4);
            (CoreEngine.val_arr_int_ag[var6] = CoreEngine.val_arr_int_ag[(var6 - 1)]);
        }
        CoreEngine.exec_a_int_arr_byte_to_void(var2, var0);
        (CoreEngine.val_arr_int_ag[var2] = var1);
        return var2;
    }
    static exec_a_int_to_arr_int(var0) {
        let var1 = CoreEngine.val_arr_int_j[var0];
        let var2 = CoreEngine.val_arr_int_i;
        let var3 = 0;
        for (let var4 = 0; (var4 < CoreEngine.val_int_al); var4++) {
            if ((((var2[var4] >= var0) && (var4 > 0)) && (var2[(var4 - 1)] < var0))) {
                (var3 = var4);
                break;
            }
        }
        let var7 = 0;
        if ((var0) === (var2[var3])) {
            (var7 = (CoreEngine.val_arr_arr_int_a[var3][0] - var1));
        } else {
            let var5 = 0;
            if (((var5 = (var0 + 1)) < CoreEngine.val_int_an)) {
                (var7 = (CoreEngine.val_arr_int_j[var5] - var1));
            }
        }
        ((var2 = createArray(4, 0))[0] = var3);
        (var2[1] = var1);
        (var2[2] = var7);
        (var2[3] = 0);
        return var2;
    }
    static exec_a_arr_byte_to_string(var0) {
        let var1 = "";
        for (let var2 = 0; (var2 < var0.length); var2++) {
            if ((var2 > 0)) {
                (var1 = (var1 + "-"));
            }
            let var4 = new StringBuffer().append(var1);
            let var10000 = var0[var2];
            let var3 = null;
            (var3 = new EncodedTextBuffer(""));
            switch (var10000) {
                case 0:
                    CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(96, var3);
                    break;
                case 1:
                    CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(98, var3);
                    break;
                case 2:
                    CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(96, var3);
                    break;
                case 3:
                    CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(100, var3);
                case 4:
                case 5:
                case 6:
                default:
                    break;
                case 7:
                    CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(88, var3);
                    break;
                case 8:
                    CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(92, var3);
                    break;
                case 9:
                    CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(90, var3);
            }
            (var1 = var4.append(var3).toString());
        }
        return var1;
    }
    static exec_a_int_int_to_encodedtextbuffer(var0, var1) {
        let var2 = CoreEngine.exec_a_to_fontcharmap();
        if ((var1 >= var2.val_arr_short_a[0])) {
            return null;
        }
        (var1 += ((var2.val_arr_short_a[0] + 1) * var0));
        let var3 = null;
        (var3 = new EncodedTextBuffer());
        (var3.textBytes = var2.val_arr_arr_byte_b[0]);
        (var3.textLength = var2.val_arr_arr_short_b[0][var1]);
        (var3.bufferCapacity = ((var2.val_arr_arr_short_b[0][(var1 + 1)] - var2.val_arr_arr_short_b[0][var1]) >> 1));
        (var3.encodingType = var3.bufferCapacity);
        (var3.flagsByte = 0);
        return var3;
    }
    static exec_a_byte_to_void(var0) {
        let var1 = ResourceSlotTable.val_arr_byte_a[var0];
        if ((CoreEngine.val_arr_object_a[var1]) === (null)) {
            switch (ResourceSlotTable.val_arr_arr_int_a[var1][0]) {
                case 0:
                    let var2 = CoreEngine.exec_a_int_to_arr_byte(ResourceSlotTable.val_arr_arr_int_a[var1][1]);
                    if ((ResourceSlotTable.val_arr_arr_int_a[var1][3]) === (-1)) {
                        (CoreEngine.val_arr_object_a[var1] = CoreEngine.exec_a_spriteimage_arr_byte_to_object(CoreEngine.exec_a_int_to_spriteimage(ResourceSlotTable.val_arr_arr_int_a[var1][2]), var2));
                        return;
                    }
                    let var10002 = ResourceSlotTable.val_arr_arr_int_a[var1][2];
                    let var3 = ResourceSlotTable.val_arr_arr_int_a[var1][3];
                    (CoreEngine.val_arr_object_a[var1] = CoreEngine.exec_a_spriteimage_arr_byte_to_object(CoreEngine.exec_a_int_arr_int_to_arr_spriteimage(var10002, [var3])[0], var2));
            }
        }
    }
    static openResourceStream(var0) {
        let var1 = (var0 & 16777215);
        let var2 = (var0 >>> 24);
        let var3 = CoreEngine.val_arr_int_bh[var2];
        let var4 = null;
        if ((var3) === (0)) {
            (var4 = CoreEngine.openResourceStreamByName(CoreEngine.val_arr_string_d[var1]));
        } else {
            if ((var3) === (1)) {
                CoreEngine.exec_G_int_to_void(var2);
                let var6 = null;
                (var6 = new DataInputStream(new ByteArrayInputStream(CoreEngine.val_arr_arr_byte_y[var2])));
                (var4 = var6);
                try {
                    let var10002 = var6.readInt();
                    var6.readInt();
                    var6.skipBytes((var1 << 3));
                    (CoreEngine.val_int_eq = var6.readInt());
                    (var2 = var6.readInt());
                    var6.reset();
                    var6.skipBytes((((4 + var10002) + 4) + var2));
                } catch (varEx) {

                }
            }
        }
        return var4;
    }
    static exec_a_tokenstring_to_bool(var0) {
        let var1 = false;
        if ((var0.tokenShortArray[0]) === (0)) {
            (var1 = true);
        } else {
            (var1 = false);
        }
        let var3 = false;
        if (var1) {
            (var3 = false);
        } else {
            let var4 = CoreEngine.exec_a_tokenstring_to_string(var0);
            let var5 = CoreEngine.val_gamemidletloop_a;
            (var1 = false);
            let var10000 = CoreEngine.exec_a_string_to_tokenstring("Browser-Launch-Enabled");
            let var6 = null;
            (var6 = new TokenWrapper());
            let var11 = CoreEngine.exec_a_tokenstring_to_string(var10000);
            (var0 = var6.wrappedToken);
            (var10000 = CoreEngine.exec_a_string_to_tokenstring(CoreEngine.exec_c_string_to_string(var11)));
            let var2 = var10000.tokenShortArray;
            let var3_len = CoreEngine.exec_a_arr_short_to_int(var10000.tokenShortArray);
            CoreEngine.exec_a_arr_short_int_tokenstring_to_void(var2, var3_len, var0);
            CoreEngine.exec_a_tokenstring_to_string(var6.wrappedToken);
            try {
                (var5.isTerminated = true);
                (var5.gameVersionString = var4);
                CoreEngine.exec_b_gamemidletloop_to_void(var5);
                (var1 = true);
            } catch (var7) {

            }
            (var3 = var1);
        }
        return (var3);
    }
    static exec_b_effectactor_to_void(var0) {
        if ((var0.effectCoordinates[2] <= 0)) {
            let var10000 = (var0.effectCoordinates[0] >> 8);
            let var1 = (var0.effectCoordinates[1] >> 8);
            let var2 = (var10000 - CoreEngine.val_int_eO);
            (var1 -= CoreEngine.exec_k_to_int());
            switch (var0.effectAccelerationX) {
                case 1:
                    if (((var0.val_animationset_a) !== (null) && (var0.val_spritepartsequence_a) !== (null))) {
                        var0.val_spritepartsequence_a.drawSequence(var0.effectRotation, var0.val_animationset_a, var2, var1, 0);
                    }
                    break;
                case 2:
                    if (((var0.val_animationset_b) !== (null) && (var0.val_spritepartsequence_b) !== (null))) {
                        var0.val_spritepartsequence_b.drawSequence(var0.effectRotation, var0.val_animationset_b, var2, var1, 0);
                        return;
                    }
            }
        }
    }
    static exec_b_coreengine_to_void(var0) {
        (var0.actorCounterC = 0);
        (var0.actorCounterB = 0);
        if ((var0) === (CoreEngine.val_coreengine_b)) {
            (CoreEngine.val_bool_ay = true);
        } else {
            if ((var0) === (CoreEngine.val_coreengine_c)) {
                (CoreEngine.val_bool_az = true);
            }
        }
        if ((var0.actorTimerT >= 2)) {
            if ((CoreEngine.val_int_dL) === (2)) {
                let var1 = null;
                if ((var0) === (CoreEngine.val_coreengine_b)) {
                    (var1 = CoreEngine.val_coreengine_c);
                } else {
                    (var1 = CoreEngine.val_coreengine_b);
                }
                let var4 = 0;
                if ((var1) === (CoreEngine.val_coreengine_b)) {
                    (var4 = 0);
                } else {
                    (var4 = 1);
                }
                let var3 = var0.actorTimerU;
                let var2 = var0.actorTimerT;
                let var5 = var4;
                CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
                (CoreEngine.val_arr_int_aG[var5] = 1);
                (CoreEngine.val_arr_encodedtextbuffer_f[var5] = CoreEngine.val_encodedtextbuffer_s.substring(var2));
                (CoreEngine.val_arr_encodedtextbuffer_g[var5] = CoreEngine.val_encodedtextbuffer_t.substring(var3));
                (var3 = (16 + Math.max(CoreEngine.exec_a_encodedtextbuffer_to_int(CoreEngine.val_arr_encodedtextbuffer_f[var5]), CoreEngine.exec_a_encodedtextbuffer_to_int(CoreEngine.val_arr_encodedtextbuffer_g[var5]))));
                switch (var5) {
                    case 0:
                        (CoreEngine.val_arr_int_aH[0] = 0);
                        (CoreEngine.val_arr_int_aK[0] = 0);
                        (CoreEngine.val_arr_int_aI[0] = (CoreEngine.val_arr_int_aH[0] + var3));
                        (CoreEngine.val_arr_int_aL[0] = (CoreEngine.val_arr_int_aK[0] + var3));
                        break;
                    default:
                        (CoreEngine.val_arr_int_aH[1] = CoreEngine.val_int_bA);
                        (CoreEngine.val_arr_int_aK[1] = CoreEngine.val_int_bA);
                        (CoreEngine.val_arr_int_aI[1] = (CoreEngine.val_arr_int_aH[1] - var3));
                        (CoreEngine.val_arr_int_aL[1] = (CoreEngine.val_arr_int_aK[1] - var3));
                }
                (CoreEngine.val_arr_int_aJ[var5] = CoreEngine.val_arr_int_aH[var5]);
                (CoreEngine.val_arr_int_aM[var5] = CoreEngine.val_arr_int_aK[var5]);
                (CoreEngine.val_arr_int_aN[var5] = 0);
                (CoreEngine.val_int_dE = ((CoreEngine.val_int_dD = ((CoreEngine.val_int_dx + CoreEngine.val_int_dv) + 8)) + CoreEngine.exec_c_to_int()));
            } else {
                (var0.actorTimerT = 0);
                (var0.actorTimerU = 0);
            }
        }
        (var0.actorTimerT = 0);
        (var0.actorTimerU = 0);
    }
    static exec_y_int_to_void(var0) {
        (CoreEngine.val_int_ce = var0);
        if ((var0 >= (CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ].length - 1))) {
            (CoreEngine.val_int_ce = ((CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ].length - 1) - 1));
        }
        if ((CoreEngine.val_int_ce < 0)) {
            (CoreEngine.val_int_ce = 0);
        }
        if ((CoreEngine.val_int_ce > 0)) {
            (CoreEngine.val_int_cm = 0);
            (CoreEngine.val_int_cd = (CoreEngine.val_int_cl = CoreEngine.val_arr_int_aC[6]));
        } else {
            (CoreEngine.val_int_cm = 1000);
            (CoreEngine.val_int_cl = 0);
            (CoreEngine.val_int_cd = 0);
        }
    }
    static exec_d_byte_to_void(var0) {
        if ((CoreEngine.val_arr_byte_c[var0]) === (0)) {
            CoreEngine.val_spritepartsequence_g.drawSequence(CoreEngine.val_int_ae, CoreEngine.val_animationset_h, 0, CoreEngine.val_int_o, 0);
            CoreEngine.val_arr_spritepartsequence_b[var0].drawSequence(CoreEngine.val_int_ae, CoreEngine.val_animationset_h, CoreEngine.val_int_af, CoreEngine.val_int_ah, 0);
        } else {
            CoreEngine.val_spritepartsequence_h.drawSequence(CoreEngine.val_int_ae, CoreEngine.val_animationset_h, CoreEngine.val_int_n, CoreEngine.val_int_o, 0);
            CoreEngine.val_arr_spritepartsequence_b[var0].drawSequence(CoreEngine.val_int_ae, CoreEngine.val_animationset_h, CoreEngine.val_int_ag, CoreEngine.val_int_ah, 0);
        }
    }
    static exec_a_entityinterface_int_to_void(var0, var1) {
        for (let var2 = 0; (var2 < CoreEngine.val_arr_int_bk[var1]); var2++) {
            if ((CoreEngine.val_arr_arr_entityinterface_a[var1][var2] !== null && CoreEngine.val_arr_arr_entityinterface_a[var1][var2].equals(var0))) {
                for (let var3 = var2; (var3 < (CoreEngine.val_arr_int_bk[var1] - 1)); var3++) {
                    (CoreEngine.val_arr_arr_entityinterface_a[var1][var3] = CoreEngine.val_arr_arr_entityinterface_a[var1][(var3 + 1)]);
                }
                let var4 = (CoreEngine.val_arr_int_bk[var1] - 1);
                (CoreEngine.val_arr_int_bk[var1] = var4);
            }
        }
    }
    static exec_f_int_int_to_void(var0, var1) {
        for (let var2 = 0; (var2 < CoreEngine.val_arr_spritepartsequence_k.length); var2++) {
            let var3 = CoreEngine.exec_a_int_int_to_int(0, 8);
            let var4 = 0;
            let var5 = ((var4 = CoreEngine.exec_a_int_int_to_int(160, 220)) * 7);
            let var6 = 0;
            if (((var6 = CoreEngine.exec_a_int_int_to_int(0, 1)) > 0)) {
                (var3 += 8);
            } else {
                (var3 = (-var3 - 8));
            }
            let var8 = 0;
            if ((var6 > 0)) {
                (var8 = 32);
            } else {
                (var8 = -32);
            }
            CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var0, var1, (var3 + var8), var4, var5, (var2 * 100), 5, 2, 0, (((0) << 24) >> 24), true, false, false, false, true, false, CoreEngine.val_animationset_x, CoreEngine.val_arr_spritepartsequence_k[var2], CoreEngine.val_animationset_x, CoreEngine.val_arr_spritepartsequence_k[var2]);
        }
    }
    static exec_a_bool_bool_bool_bool_int_int_int_int_bool_to_void(var0, var1, var2, var3, var4, var5, var6, var7, var8) {
        if (var0) {
            if (var1) {
                if (var8) {
                    CoreEngine.exec_a_int_int_int_to_void(2, var4, var5);
                } else {
                    CoreEngine.exec_b_int_int_int_to_void(8, var4, var5);
                }
            } else {
                if (var8) {
                    CoreEngine.exec_a_int_int_int_to_void(1, var4, var5);
                } else {
                    CoreEngine.exec_b_int_int_int_to_void(7, var4, var5);
                }
            }
        }
        if (var2) {
            if (var3) {
                if (var8) {
                    CoreEngine.exec_a_int_int_int_to_void(4, var6, var7);
                    return;
                }
                CoreEngine.exec_b_int_int_int_to_void(10, var6, var7);
                return;
            }
            if (var8) {
                CoreEngine.exec_a_int_int_int_to_void(3, var6, var7);
                return;
            }
            CoreEngine.exec_b_int_int_int_to_void(9, var6, var7);
        }
    }
    static exec_a_int_arr_int_arr_byte_bool_to_animationset(var0, var1, var2, var3) {
        let var6 = CoreEngine.openResourceStream(var0);
        let var7 = 0;
        let var10 = null;
        let var9 = null;
        let var19 = null;
        try {
            (var7 = CoreEngine.exec_a_datainputstream_to_int(var6));
            let var4 = 0;
            (var10 = createArray((var4 = var6.readUnsignedByte()), 0));
            for (let var5 = 0; (var5 < var4); var5++) {
                (var10[var5] = var6.readLong());
            }
            let var8 = 0;
            (var9 = createArray((var8 = var6.readUnsignedByte()), 0));
            (var19 = createArray(var8, 0));
            for (let var16 = 0; (var16 < var8); var16++) {
                (var9[var16] = (((var6.readUnsignedByte()) << 24) >> 24));
                (var19[var16] = (((var6.readUnsignedByte()) << 24) >> 24));
            }
            var6.close();
        } catch (varEx) {

        }
        let var22 = (var3);
        let var20 = var2;
        let var17 = var1;
        let var14 = var19;
        (var2 = var9);
        let var12 = var10;
        (var0 = var7);
        let var26 = null;
        (var26 = new AnimationSet());
        (var26.totalAnimFrames = var17.length);
        (var26.spriteImages = createArray(var26.totalAnimFrames, null));
        (var26.frameDelayArray = var17);
        (var26.animConfigBytes = var20);
        (var26.animFrameCount = 0);
        (var26.spriteImages[var26.animFrameCount] = CoreEngine.exec_a_int_int_byte_to_spriteimage(var0, var17[var26.animFrameCount], var20[var26.animFrameCount]));
        (var26.isLoaded = var22);
        if ((var26.isLoaded && (var26.totalAnimFrames > 1))) {
            (var26.partCountArray = createArray(CoreEngine.val_int_es, 0));
            System.arraycopy(CoreEngine.val_arr_arr_byte_y[CoreEngine.val_int_et], CoreEngine.val_int_er, var26.partCountArray, 0, CoreEngine.val_int_es);
            (var26.spriteIndexMatrix = createMultiArray([var26.totalAnimFrames, 0], 0));
            if ((CoreEngine.val_arr_byte_p) !== (null)) {
                (var26.spriteIndexMatrix[var26.animFrameCount] = createArray(CoreEngine.val_arr_byte_p.length, 0));
                for (let var23 = 0; (var23 < CoreEngine.val_arr_byte_p.length); var23++) {
                    (var26.spriteIndexMatrix[var26.animFrameCount][var23] = CoreEngine.val_arr_byte_p[var23]);
                }
            } else {
                (var26.spriteIndexMatrix[var26.animFrameCount] = CoreEngine.exec_a_arr_byte_int_int_to_arr_byte(var26.partCountArray, 0, CoreEngine.val_int_es));
            }
        }
        (var26.animPriorityBytes = var2);
        (var26.val_arr_long_a = var12);
        (var26.animDurationArray = createArray(var14.length, 0));
        (var26.currentFrameIndex = var0);
        for (let var24 = 0; (var24 < var14.length); var24++) {
            (var26.animDurationArray[var24] = CoreEngine.val_arr_int_a[var14[var24]]);
        }
        for (let var25 = 1; (var25 < var26.totalAnimFrames); var25++) {
            let var21 = var26.animConfigBytes[var25];
            let var4 = var26.frameDelayArray[var25];
            let var3_idx = var25;
            (var26.frameDelayArray[var25] = var4);
            (var26.animConfigBytes[var25] = var21);
            if (var26.isLoaded) {
                if ((var4) !== (-1)) {
                    (var26.spriteIndexMatrix[var25] = CoreEngine.loadResourceBytes(var4));
                } else {
                    (var26.spriteIndexMatrix[var25] = createArray(var26.spriteIndexMatrix[0].length, 0));
                    System.arraycopy(var26.spriteIndexMatrix[0], 0, var26.spriteIndexMatrix[var25], 0, var26.spriteIndexMatrix[0].length);
                }
                if ((var21) !== (0)) {
                    CoreEngine.exec_a_arr_byte_byte_to_void(var26.spriteIndexMatrix[var3_idx], var21);
                }
            } else {
                (var26.spriteImages[var25] = CoreEngine.exec_a_int_int_byte_to_spriteimage(var26.currentFrameIndex, var4, var21));
            }
        }
        return var26;
    }
    static exec_a_arr_string_to_byte(var0) {
        let var1 = -1;
        let var2 = null;
        if (((var2 = System.getProperty("microedition.locale"))) !== (null)) {
            let var3 = null;
            let var4 = 0;
            if (((var4 = (var3 = var2.toLowerCase().trim()).length) < 2)) {
                return -1;
            }
            for (let var5 = 0; (var5 < var0.length); var5++) {
                if (((var0[var5].length > var4) && var0[var5].startsWith(var3))) {
                    (var1 = -1);
                    break;
                }
                if (var3.startsWith(var0[var5])) {
                    (var1 = (((var5) << 24) >> 24));
                    break;
                }
            }
        }
        return var1;
    }
    static isClipPlayable(var0) {
        try {
            let var1 = null;

            try {
                const soundId = var0.clipSoundId || (var0.prevClip ? var0.prevClip.clipSoundId : 0);
                (var0.mediaPlayer = Manager.createPlayer(new ByteArrayInputStream(var0.prevClip.rawAudioData), var0.clipName, soundId));
                var0.mediaPlayer.realize();
            } catch (var4) {
                let var2 = var4;
                while (true) {
                    try {
                        throw var2;
                    } catch (var3) {
                        (var2 = var3);
                    }
                }
            }
        } catch (var5) {
            if ((var0.mediaPlayer) !== (null)) {
                var0.mediaPlayer.close();
            }
            (var0.mediaPlayer = null);
        }
        let var6 = false;
        if ((var0.mediaPlayer) !== (null)) {
            (var6 = true);
        } else {
            (var6 = false);
        }
        return var6;
    }
    static exec_b_arr_byte_to_int(var0) {
        let var1 = var0;
        let var2 = -1;
        try {
            CoreEngine.exec_b_bool_to_void(false);
            if (CoreEngine.val_bool_aN) {
                (var2 = (((CoreEngine.val_arr_byte_n[(CoreEngine.val_int_en + 1)] & 255) << 8) | (CoreEngine.val_arr_byte_n[(CoreEngine.val_int_en + 2)] & 255)));
                if ((var0.length) !== (var2)) {
                    (var1 = createArray(var2, 0));
                }
                System.arraycopy(CoreEngine.val_arr_byte_n, (CoreEngine.val_int_en + 3), var1, 0, var2);
            }
            CoreEngine.saveRecordStore.closeRecordStore();
        } catch (var3) {

        }
        return var2;
    }
    static readIntAtOffset(var0, var1) {
        while ((((((var0[(var1 + 2)]) !== (116) || (var0[(var1 + 3)]) !== (82)) || (var0[(var1 + 4)]) !== (78)) || (var0[(var1 + 5)]) !== (83)) && ((((var0[(var1 + 2)]) !== (73) || (var0[(var1 + 3)]) !== (68)) || (var0[(var1 + 4)]) !== (65)) || (var0[(var1 + 5)]) !== (84)))) {
            var1++;
        }
        return var1;
    }
    static exec_a_bool_audioplaybackcontext_to_void(var0, var1) {
        while ((var1.channelId) !== (2)) {
            (var1 = var1.nextContext);
        }
        let var2 = null;

        try {
            (var1.isPlaying = (var0));
            if (((var1.val_audioclipnode_b) !== (null) && (var1.val_audioclipnode_b.mediaPlayer) !== (null))) {
                try {
                    let var8 = var1.val_audioclipnode_b.mediaPlayer;
                    let loopCount = (var0 ? -1 : 1);
                    var8.setLoopCount(loopCount);
                } catch (var3) {

                }
            }
        } catch (var5) {
            let var7 = var5;
            while (true) {
                try {
                    throw var7;
                } catch (var4) {
                    (var7 = var4);
                }
            }
        }
    }
    static exec_a_to_encodedtextbuffer() {
        let var0 = null;
        ((var0 = createArray(12, null))[0] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(88, null));
        (var0[1] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(87, null));
        (var0[2] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(90, null));
        (var0[3] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(89, null));
        (var0[4] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(92, null));
        (var0[5] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(91, null));
        (var0[6] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(96, null));
        (var0[7] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(95, null));
        (var0[8] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(98, null));
        (var0[9] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(97, null));
        if ((CoreEngine.val_int_bw) === (0)) {
            (var0[8] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(100, null));
            (var0[9] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(99, null));
        }
        return CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(47, null).concatAll(var0);
    }
    static exec_b_int_int_int_int_to_int(var0, var1, var2, var3) {
        return ((var3 >= 1000) ? var1 : ((var0 - ((Math.trunc(((((var0 - var2)) * var3)) / (1000))) | 0)) - ((Math.trunc((((((var0 - ((Math.trunc(((((var0 - var2)) * var3)) / (1000))) | 0)) - (var2 - ((Math.trunc(((((var2 - var1)) * var3)) / (1000))) | 0)))) * var3)) / (1000))) | 0)));
    }
    static destroyAudioChannel(var0) {
        try {
            let var1 = null;

            try {
                let var6 = null;
                if (((var0.val_audioclipnode_b) !== (null) && ((var6 = (var0.val_audioclipnode_b.mediaPlayer.getControl("VolumeControl")))) !== (null))) {
                    CoreEngine.getGlobalAudioContext();
                    var6.setLevel((((100 * var0.volumeLevel) * CoreEngine.val_globalcontext_a.rootAudioContext.priorityLevel) >> 16));
                }
            } catch (var4) {
                let var2 = var4;
                while (true) {
                    try {
                        throw var2;
                    } catch (var3) {
                        (var2 = var3);
                    }
                }
            }
        } catch (var5) {

        }
    }
    static exec_g_int_int_to_void(var0, var1) {
        for (let var2 = 0; (var2 < CoreEngine.val_arr_int_aO.length); (var2 += 3)) {
            let var3 = (var0 + CoreEngine.val_arr_int_aO[var2]);
            let var4 = (var1 + CoreEngine.val_arr_int_aO[(var2 + 1)]);
            let var5 = CoreEngine.val_arr_int_aO[(var2 + 2)];
            let var6 = null;
            if ((CoreEngine.exec_a_int_int_to_int(0, 1)) === (0)) {
                (var6 = CoreEngine.val_spritepartsequence_s);
            } else {
                (var6 = CoreEngine.val_spritepartsequence_t);
            }
            CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var3, var4, 1, 1, 1000, var5, 5, 1, 0, (((2) << 24) >> 24), false, false, false, false, false, false, CoreEngine.val_animationset_u, var6, CoreEngine.val_animationset_u, var6);
        }
    }
    static exec_a_arr_short_int_tokenstring_to_void(var0, var1, var2) {
        if ((var2.tokenShortArray) !== (var0)) {
            (var2.tokenShortArray = null);
            (var2.tokenShortArray = createArray((var1 + 1), 0));
            let var3 = var2.tokenShortArray;
            for (let var4 = 0; (var4 < var1); var4++) {
                (var3[var4] = var0[var4]);
                if ((var0[var4]) === (0)) {
                    break;
                }
            }
            (var2.tokenShortArray[(var2.tokenShortArray.length - 1)] = 0);
        }
    }
    static isChannelActive(var0) {
        while ((var0.channelId) !== (2)) {
            (var0 = var0.nextContext);
        }
        let var4 = null;
        let var5 = false;
        if ((((var4 = var0.val_audioclipnode_b)) !== (null) && (var4.mediaPlayer) !== (null))) {
            let var1 = null;

            try {
                if (((var4) !== (null) && (CoreEngine.getClipDuration(var4)) === (400))) {
                    (var5 = true);
                } else {
                    (var5 = false);
                }
            } catch (var3) {
                let var6 = var3;
                while (true) {
                    try {
                        throw var6;
                    } catch (var2) {
                        (var6 = var2);
                    }
                }
            }
        } else {
            (var5 = false);
        }
        return var5;
    }
    static exec_c_coreengine_to_void(var0) {
        if (((var0.actorTimerW) !== (27) && (var0.actorTimerW) !== (12))) {
            if (var0.actorActiveFlag) {
                var0.updateActor(27);
            } else {
                (var0.val_int_S = CoreEngine.val_arr_short_D[2]);
                (var0.val_int_R = (CoreEngine.val_arr_short_D[1] << 8));
                (var0.val_int_Q = (((-1 * var0.actorCurrentAnimIndex) * CoreEngine.val_arr_short_D[0]) << 8));
                (var0.val_bool_s = false);
                var0.updateActor(12);
            }
        }
    }
    static exec_a_coreengine_arr_int_int_int_int_int_to_void(var0, var1, var2, var3, var4, var5) {
        (var2 = (5 + (var2 * 5)));
        let var10002 = var1[var2];
        let var8 = var1[(var2 + 1)];
        let var10004 = var1[(var2 + 2)];
        let var10005 = var1[(var2 + 3)];
        (var2 = var1[(var2 + 4)]);
        var0.exec_d_int_int_to_void(var10004, var10005);
        var0.setActorPosition((var3 - (var10002 * var5)), (var4 + var8));
        (var0.val_int_X = var2);
        (var0.actorCurrentAnimIndex = var5);
    }
    static exec_a_contextservicenode_to_int(var0) {
        while ((var0.val_short_a) === (5)) {
            (var0 = var0.val_contextservicenode_a);
        }
        let var2 = -1;
        try {
            CoreEngine.exec_b_bool_to_void(false);
            if (CoreEngine.val_bool_aN) {
                (var2 = (((CoreEngine.val_arr_byte_n[(CoreEngine.val_int_en + 1)] & 255) << 8) | (CoreEngine.val_arr_byte_n[(CoreEngine.val_int_en + 2)] & 255)));
            }
            CoreEngine.saveRecordStore.closeRecordStore();
        } catch (var1) {

        }
        return var2;
    }
    static exec_K_to_void() {
        if (((CoreEngine.val_animationset_x) === (null) || (CoreEngine.val_arr_spritepartsequence_k) === (null))) {
            try {
                let var0 = CoreEngine.val_arr_int_aQ;
                let var1 = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_aQ[0], -1, (((0) << 24) >> 24), false);
                let var2 = createArray(Math.trunc(((var0.length - 1)) / (2)), null);
                for (let var3 = 1; (var3 < var0.length); (var3 += 2)) {
                    (var2[Math.trunc((var3) / (2))] = CoreEngine.exec_a_int_int_to_spritepartsequence(var0[var3], var0[(var3 + 1)]));
                }
                (CoreEngine.val_animationset_x = var1);
                (CoreEngine.val_arr_spritepartsequence_k = var2);
                return;
            } catch (var4) {

            }
        }
    }
    static exec_a_int_int_to_void(var0, var1) {
        for (let var2 = 0; (var2 < CoreEngine.val_arr_arr_int_f.length); var2++) {
            let var3 = 0;
            CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var0, var1, CoreEngine.val_arr_arr_int_f[var2][0], CoreEngine.val_arr_arr_int_f[var2][1], (var3 = CoreEngine.val_arr_arr_int_f[var2][2]), 0, 5, 0, (var3 + CoreEngine.exec_a_int_int_to_int(1000, 2000)), (((5) << 24) >> 24), false, true, false, false, true, false, CoreEngine.val_animationset_r, CoreEngine.val_spritepartsequence_v, CoreEngine.val_animationset_r, CoreEngine.val_spritepartsequence_x);
        }
    }
    static exec_z_int_to_void(var0) {
        switch (var0) {
            case 0:
            case 3:
            default:
                break;
            case 1:
                CoreEngine.exec_l_to_void();
                CoreEngine.exec_g_to_void();
                (CoreEngine.val_int_dP = 0);
                (CoreEngine.val_encodedtextbuffer_v = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(59, null));
                (CoreEngine.val_encodedtextbuffer_u = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(56, null));
                (CoreEngine.val_byte_s = 0);
                (CoreEngine.val_byte_t = 0);
                break;
            case 2:
                CoreEngine.exec_Z_to_void();
                (CoreEngine.val_int_dU = 0);
                (CoreEngine.val_int_dV = 0);
                (CoreEngine.val_int_dT = 0);
                if (CoreEngine.val_bool_am) {
                    (CoreEngine.val_int_eh = 0);
                }
                CoreEngine.exec_K_int_to_void(0);
                CoreEngine.drawTextLabel(0);
                (CoreEngine.val_byte_s = 6);
                (CoreEngine.val_byte_t = 5);
        }
        (CoreEngine.val_int_dN = var0);
        (CoreEngine.val_int_dO = 0);
    }
    static exec_b_to_byte() {
        if (CoreEngine.val_bool_am) {
            return (((CoreEngine.exec_a_int_int_to_int(0, 4)) << 24) >> 24);
        }
        if ((CoreEngine.val_int_cA) === ((CoreEngine.exec_m_to_int() - 1))) {
            return 4;
        }
        if ((CoreEngine.val_int_cA) === (0)) {
            return 0;
        }
        let var0 = 0;
        if ((((var0 = ((((CoreEngine.val_int_cA % 5)) << 24) >> 24))) === (4) || (CoreEngine.val_int_cA >= 4))) {
            (var0 = (((((CoreEngine.val_int_cA + Math.trunc((CoreEngine.val_int_cA) / (4))) % 5)) << 24) >> 24));
        }
        return var0;
    }
    static exec_e_byte_to_void(var0) {
        (CoreEngine.val_byte_n = var0);
        (CoreEngine.val_byte_l = 1);
        (CoreEngine.val_byte_m = 4);
        (CoreEngine.val_bool_Y = false);
        (CoreEngine.val_int_bP = 0);
        if (CoreEngine.exec_a_byte_to_bool(var0)) {
            (CoreEngine.val_encodedtextbuffer_i = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(CoreEngine.val_arr_int_bd[PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][0]], null));
        } else {
            (CoreEngine.val_encodedtextbuffer_i = new EncodedTextBuffer(""));
            if ((PatternTable.val_arr_arr_byte_a[var0][1]) === (1)) {
                (CoreEngine.val_byte_l = 0);
            }
        }
    }
    static exec_b_int_int_to_void(var0, var1) {
        (CoreEngine.val_int_bz = var0);
        (CoreEngine.val_int_bA = CoreEngine.val_int_n);
        (CoreEngine.val_int_bB = (CoreEngine.val_int_o - var1));
        (CoreEngine.val_int_bD = CoreEngine.val_int_bA);
        (CoreEngine.val_int_bE = (CoreEngine.val_int_bB - CoreEngine.val_int_bz));
        (CoreEngine.val_int_bC = (0 + Math.trunc((CoreEngine.val_int_bD) / (2))));
    }
    static exec_d_int_to_bool(var0) {
        let var2 = CoreEngine.val_arr_arr_int_j[var0];
        try {
            (CoreEngine.val_arr_arr_spritepartsequence_a[var0] = createArray(Math.trunc((var2.length) / (2)), null));
            for (let var1 = 0; (var1 < var2.length); (var1 += 2)) {
                let var10000 = var2[var1];
                let var10001 = var2[(var1 + 1)];
                let var3 = CoreEngine.val_arr_arr_spritepartsequence_a[var0];
                let var4 = CoreEngine.exec_a_int_int_to_spritepartsequence(var10000, var10001);
                (var3[Math.trunc((var1) / (2))] = var4);
            }
        } catch (var5) {

        }
        return false;
    }
    static exec_L_to_void() {
        (CoreEngine.val_int_aL = ((CoreEngine.val_int_aL = CoreEngine.val_int_aJ) + Math.trunc((((CoreEngine.val_int_aK - CoreEngine.val_int_aJ) - ((CoreEngine.val_arr_int_t.length * (CoreEngine.val_arr_int_P[CoreEngine.val_int_aH] + CoreEngine.val_arr_int_Q[CoreEngine.val_int_aH])) - CoreEngine.val_arr_int_Q[CoreEngine.val_int_aH]))) / (2))));
    }
    static readIntWithLength(var0, var1, var2) {
        for (let var3 = var1; (var3 < ((var1 + var2) - 4)); var3++) {
            if (((((var0[var3]) === (80) && (var0[(var3 + 1)]) === (76)) && (var0[(var3 + 2)]) === (84)) && (var0[(var3 + 3)]) === (69))) {
                return (var3 + 4);
            }
        }
        return 0;
    }
    static exec_a_effectactor_to_void(var0) {
        CoreEngine.exec_a_entityinterface_int_to_void(var0, 2);
        (var0.effectAccelerationX = 0);
        (var0.val_animationset_a = null);
        (var0.val_spritepartsequence_a = null);
        (var0.val_animationset_b = null);
        (var0.val_spritepartsequence_b = null);
        CoreEngine.val_int_el--;
        let var1 = -1;
        for (let var2 = 0; (var2 <= CoreEngine.val_int_em); var2++) {
            if ((CoreEngine.val_arr_effectactor_a[var2].effectAccelerationX) !== (0)) {
                (var1 = var2);
            }
        }
        (CoreEngine.val_int_em = var1);
    }
    static exec_c_bool_to_void(var0) {
        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
        let var3 = CoreEngine.val_encodedtextbuffer_m;
        let var1 = CoreEngine.val_arr_short_f;
        let var2 = CoreEngine.val_int_cE;
        let var4 = Math.min(CoreEngine.val_arr_short_f[0], CoreEngine.val_int_cC);
        let var5 = 0;
        if (var0) {
            (var5 = Math.trunc((CoreEngine.val_int_n) / (2)));
        } else {
            (var5 = CoreEngine.val_int_cN);
        }
        let var6 = (CoreEngine.val_int_cD >> 8);
        let alignFlag = (var0 ? 1 : 4);
        CoreEngine.exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(var3, var1, var2, var4, var5, var6, (16 | alignFlag));
    }
    static exec_A_int_to_void(var0) {
        (CoreEngine.val_int_bG = var0);
        (CoreEngine.val_byte_l = 1);
        (CoreEngine.val_byte_m = 4);
        switch (CoreEngine.val_int_bG) {
            case 0:
                (CoreEngine.val_int_bH = 16711680);
                return;
            case 1:
                (CoreEngine.val_int_bH = 16711680);
                (CoreEngine.val_byte_k = CoreEngine.exec_c_to_byte());
                (CoreEngine.val_byte_j = CoreEngine.exec_c_to_byte());
                CoreEngine.exec_e_byte_to_void(CoreEngine.val_byte_k);
                (CoreEngine.val_byte_l = 0);
                (CoreEngine.val_byte_m = 0);
                (CoreEngine.val_int_bI = 0);
                return;
            case 2:
                (CoreEngine.val_int_bH = 16777215);
                (CoreEngine.val_int_bF = 0);
                (CoreEngine.val_byte_l = 0);
                (CoreEngine.val_byte_m = 0);
        }
    }
    static exec_d_coreengine_to_void(var0) {
        let var1 = null;
        if ((var0.exec_b_to_int() < -20)) {
            (var1 = CoreEngine.val_spritepartsequence_F);
        } else {
            if ((var0.exec_b_to_int() < -10)) {
                (var1 = CoreEngine.val_spritepartsequence_E);
            } else {
                (var1 = CoreEngine.val_spritepartsequence_D);
            }
        }
        if ((((var1) !== (null) && (CoreEngine.val_animationset_z) !== (null)) && (var0.actorTimerV) !== (-1))) {
            var1.drawSequence(1, CoreEngine.val_animationset_z, (var0.exec_a_to_int() - CoreEngine.val_int_eO), (0 - CoreEngine.exec_k_to_int()), 0);
        }
    }
    static exec_M_to_void() {
        CoreEngine.exec_l_to_void();
        (CoreEngine.val_coreengine_b = null);
        (CoreEngine.val_coreengine_c = null);
        (CoreEngine.val_coreengine_d = null);
        (CoreEngine.val_animationset_q = null);
        (CoreEngine.actorPoolArray = null);
        CoreEngine.exec_ao_to_void();
        (CoreEngine.val_arr_effectactor_a = null);
        CoreEngine.exec_P_to_void();
        (CoreEngine.val_arr_animationset_e = null);
        (CoreEngine.val_arr_animationset_f = null);
        (CoreEngine.val_spritepartsequence_u = null);
        (CoreEngine.val_spritepartsequence_w = null);
        (CoreEngine.val_spritepartsequence_y = null);
        (CoreEngine.val_animationset_v = null);
        (CoreEngine.val_arr_spritepartsequence_j = null);
        (CoreEngine.val_animationset_x = null);
        (CoreEngine.val_arr_spritepartsequence_k = null);
        (CoreEngine.val_animationset_w = null);
        (CoreEngine.val_spritepartsequence_B = null);
        (CoreEngine.val_animationset_t = null);
        CoreEngine.exec_al_to_void();
        (CoreEngine.val_animationset_u = null);
        (CoreEngine.val_spritepartsequence_s = null);
        (CoreEngine.val_spritepartsequence_t = null);
        (CoreEngine.val_animationset_s = null);
        (CoreEngine.val_spritepartsequence_z = null);
        (CoreEngine.val_arr_arr_entityinterface_a = null);
        (CoreEngine.val_arr_int_bl = null);
        (CoreEngine.val_arr_int_bp = null);
        (CoreEngine.val_arr_int_bq = null);
        (CoreEngine.val_arr_actorstatemachine_a = null);
        (CoreEngine.val_arr_animationset_g = null);
        (CoreEngine.val_arr_arr_spritepartsequence_a = null);
        CoreEngine.exec_ah_to_void();
        (CoreEngine.val_arr_int_aF = null);
        CoreEngine.exec_g_byte_to_void((((1) << 24) >> 24));
        CoreEngine.exec_g_byte_to_void((((0) << 24) >> 24));
        CoreEngine.exec_g_byte_to_void((((2) << 24) >> 24));
        CoreEngine.exec_g_byte_to_void((((3) << 24) >> 24));
        (CoreEngine.val_bool_P = false);
        (CoreEngine.val_arr_animationset_b = null);
        (CoreEngine.val_arr_spritepartsequence_d = null);
        (CoreEngine.val_animationset_z = null);
        (CoreEngine.val_spritepartsequence_D = null);
        (CoreEngine.val_spritepartsequence_E = null);
        (CoreEngine.val_spritepartsequence_F = null);
        CoreEngine.exec_ap_to_void();
        (CoreEngine.val_bool_aP = false);
        (CoreEngine.val_animationset_y = null);
        (CoreEngine.val_spritepartsequence_C = null);
        (CoreEngine.val_int_eW = 0);
        (CoreEngine.val_animationset_A = null);
        (CoreEngine.val_animationset_B = null);
        (CoreEngine.val_spritepartsequence_G = null);
        (CoreEngine.val_spritepartsequence_H = null);
    }
    static exec_a_arr_arr_byte_to_string(var0) {
        let var1 = "";
        for (let var2 = 0; (var2 < var0.length); (var2 += 2)) {
            if ((var2 > 0)) {
                (var1 = (var1 + ","));
            }
            let var10000 = var0[var2];
            let var4 = new StringBuffer().append(var1);
            let var3 = CoreEngine.exec_a_arr_byte_to_string(var10000);
            (var1 = var4.append(var3).toString());
        }
        return var1;
    }
    static exec_a_arr_short_int_int_int_int_fontcharmap_to_int(var0, var1, var2, var3, var4, var5) {
        while ((var2 <= var3)) {
            let var6 = ((var2 + var3) >> 1);
            let var7 = (var0[var6] & 65535);
            if ((var1) === (var7)) {
                return var6;
            }
            if ((var1 < var7)) {
                return CoreEngine.exec_a_arr_short_int_int_int_int_fontcharmap_to_int(var0, var1, var2, (var6 - 1), var4, var5);
            }
            (var2 = (var6 + 1));
        }
        return var4;
    }
    static freeAudioClip(var0) {
        if ((var0.mediaPlayer) !== (null)) {
            let var1 = null;

            try {
                CoreEngine.removeClipFromChannel(var0, CoreEngine.getGlobalAudioContext().prevContext);
                try {
                    var0.mediaPlayer.close();
                } catch (var2) {

                }
                (var0.mediaPlayer = null);
            } catch (var4) {
                let var5 = var4;
                while (true) {
                    try {
                        throw var5;
                    } catch (var3) {
                        (var5 = var3);
                    }
                }
            }
        }
    }
    static exec_a_int_int_bool_bool_to_void(var0, var1, var2, var3) {
        let subType = ((((var3 ? 3 : 2)) << 24) >> 24);
        CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var0, var1, 0, 0, 0, 0, 0, 1, 0, subType, false, false, false, false, false, var2, CoreEngine.val_animationset_t, CoreEngine.val_spritepartsequence_A, CoreEngine.val_animationset_t, CoreEngine.val_spritepartsequence_A);
    }
    static exec_N_to_void() {
        let var0 = createArray(10, false);
        CoreEngine.exec_a_int_arr_byte_to_void(0, CoreEngine.val_arr_arr_byte_d[0]);
        (CoreEngine.val_arr_int_ag[0] = 1000000);
        (var0[0] = true);
        for (let var1 = 1; (var1 < 10); var1++) {
            let var2 = 0;
            do {
                (var2 = CoreEngine.exec_a_int_int_to_int(1, 9));
            } while (var0[var2]);
            (var0[var2] = true);
            CoreEngine.exec_a_int_arr_byte_to_void(var1, CoreEngine.val_arr_arr_byte_d[var2]);
            let var3 = (1000000 - (var1 * 100000));
            (var2 = var1);
            (CoreEngine.val_arr_int_ag[var2] = var3);
        }
    }
    static exec_B_int_to_void(var0) {
        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
        (CoreEngine.val_arr_short_f = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short((CoreEngine.val_encodedtextbuffer_m = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0, null)), ((CoreEngine.val_int_n - CoreEngine.val_int_cJ) - 2)));
        (CoreEngine.val_int_cD = ((CoreEngine.val_int_o - 32) << 8));
        (CoreEngine.val_int_cN = (CoreEngine.val_int_cJ + 2));
        (CoreEngine.val_int_cE = 1);
        (CoreEngine.val_bool_ak = false);
    }
    static exec_C_int_to_void(var0) {
        try {
            (CoreEngine.val_int_bP = 0);
            (CoreEngine.val_animationset_l = CoreEngine.exec_a_int_int_byte_bool_to_animationset(CoreEngine.val_arr_int_aS[var0], -1, (((0) << 24) >> 24), false));
            (CoreEngine.val_spritepartsequence_l = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_arr_int_h[var0][66], 0));
            (CoreEngine.val_spritepartsequence_k = CoreEngine.exec_a_int_int_to_spritepartsequence(CoreEngine.val_arr_arr_int_h[var0][0], 1));
            (CoreEngine.val_bool_Y = true);
        } catch (var1) {

        }
        CoreEngine.exec_U_to_void();
    }
    static exec_b_byte_to_void(var0) {
        if ((CoreEngine.val_arr_object_a[ResourceSlotTable.val_arr_byte_a[var0]]) === (null)) {
            CoreEngine.exec_a_byte_to_void(ResourceSlotTable.val_arr_byte_a[var0]);
        }
        switch (ResourceSlotTable.val_arr_arr_int_a[ResourceSlotTable.val_arr_byte_a[var0]][0]) {
            case 0:
                CoreEngine.exec_a_object_to_void(CoreEngine.val_arr_object_a[ResourceSlotTable.val_arr_byte_a[var0]]);
        }
    }
    static exec_O_to_void() {
        (CoreEngine.val_bool_L = CoreEngine.val_bool_J);
        (CoreEngine.val_bool_K = CoreEngine.val_bool_J);
        let var0 = false;
        if ((CoreEngine.val_bool_L && CoreEngine.val_bool_as)) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        (CoreEngine.val_bool_N = var0);
        if ((CoreEngine.val_bool_K && CoreEngine.val_bool_ar)) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        (CoreEngine.val_bool_M = var0);
    }
    static bufferedStreamRead(var0, var1, var2, var3) {
        try {
            for (let var4 = 0; (var4 < var3); var4++) {
                let var5 = 0;
                if (((var5 = var0.read())) === (-1)) {
                    if ((var4) === (0)) {
                        (var5 = -1);
                    } else {
                        (var5 = var4);
                    }
                    return var5;
                }
                (var1[(var4 + var2)] = (((var5) << 24) >> 24));
            }
            return var3;
        } catch (varEx) {
            return -1;
        }
    }
    static exec_a_string_to_tokenstring(var0) {
        let var1 = null;
        let var2 = createArray(((var1 = var0.toCharArray()).length + 1), 0);
        for (let var3 = 0; (var3 < var1.length); var3++) {
            (var2[var3] = (((var1[var3]) << 16) >> 16));
        }
        (var2[(var2.length - 1)] = 0);
        return new TokenString(var2);
    }
    static removeClipFromChannel(var0, var1) {

        try {
            for (let var5 = 0; (var5 < CoreEngine.audioChannelCount); var5++) {
                if ((var1.val_arr_audioclipnode_a[var5]) === (var0)) {
                    (var1.val_arr_audioclipnode_a[var5] = null);
                    break;
                }
            }
        } catch (var4) {
            let var2 = var4;
            while (true) {
                try {
                    throw var2;
                } catch (var3) {
                    (var2 = var3);
                }
            }
        }
    }
    static exec_P_to_void() {
        if ((CoreEngine.val_arr_effectactor_a) !== (null)) {
            for (let var0 = 0; (var0 < CoreEngine.val_arr_effectactor_a.length); var0++) {
                if (((CoreEngine.val_arr_effectactor_a[var0]) !== (null) && (CoreEngine.val_arr_effectactor_a[var0].effectAccelerationX) !== (0))) {
                    CoreEngine.exec_a_effectactor_to_void(CoreEngine.val_arr_effectactor_a[var0]);
                }
            }
        }
    }
    static exec_v_to_bool() {
        let var0 = false;
        if ((CoreEngine.val_int_dN) === (2)) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        if ((((((var0 && (CoreEngine.val_int_cw) === (3)) && !CoreEngine.val_bool_ah) && (CoreEngine.val_int_dL) !== (5)) && (CoreEngine.val_int_dL) !== (14)) && !CoreEngine.val_bool_ai)) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        return var0;
    }
    static exec_f_byte_to_void(var0) {
        if ((var0) !== (-1)) {
            if ((AudioMetaTable.val_arr_int_a[var0]) !== (-1)) {
                try {
                    CoreEngine.val_audiomanager_a.setLooping(1);
                    let var1 = 0;
                    (CoreEngine.val_audiomanager_a.currentSoundId = (var1 = AudioMetaTable.val_arr_byte_c[var0]));
                    CoreEngine.val_audiomanager_a.playSound(AudioMetaTable.val_arr_int_a[var0]);
                } catch (var2) {

                }
            }
        }
    }
    static exec_a_int_to_spriteimage(var0) {
        try {
            let var1 = null;
            (var1 = new PackedResourceStream(var0));
            let var4 = createArray(var1.resourceId, 0);
            var1.read(var4, 0, var1.resourceId);
            let var2 = null;
            (var2 = new SpriteImage(var4, 0, var4.length));
            var1.close();
            return var2;
        } catch (var3) {
            return null;
        }
    }
    static setChannelVolume(var0, var1) {
        if ((var0 > 255)) {
            (var0 = 255);
        }
        if ((var0 < 0)) {
            (var0 = 0);
        }
        (var1.volumeLevel = var0);
        (var1.priorityLevel = var1.volumeLevel);
        for (let var2 = 0; (var2 <= 0); var2++) {
            CoreEngine.destroyAudioChannel(var1.contextPool[0].nextContext);
        }
    }
    static exec_a_byte_audioclipnode_to_bool(var0, var1) {
        if ((var0) === (1)) {
            var1.clipName.equals("audio/x-wav");
            var1.clipName.equals("audio/midi");
            var1.clipName.equals("audio/amr");
            return true;
        } else {
            if ((var0) === (0)) {
                var1.clipName.equals("audio/x-wav");
                var1.clipName.equals("audio/midi");
                var1.clipName.equals("audio/amr");
                return true;
            } else {
                return false;
            }
        }
    }
    static exec_h_to_void() {
        if (((CoreEngine.val_byte_g) !== (-1) && ((CoreEngine.val_int_aB = (CoreEngine.val_int_aB - CoreEngine.val_int_e)) < 0))) {
            (CoreEngine.val_int_aB = 0);
            CoreEngine.exec_b_byte_bool_to_void(CoreEngine.val_byte_g, false);
            (CoreEngine.val_byte_g = -1);
        }
        if (CoreEngine.val_bool_H) {
            (CoreEngine.val_int_aA = (CoreEngine.val_int_aA + CoreEngine.val_int_e));
        }
    }
    static exec_D_int_to_void(var0) {
        switch (var0) {
            case 2:
                try {
                    (CoreEngine.val_animationset_C = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217846, -1, (((0) << 24) >> 24), false));
                    (CoreEngine.val_spritepartsequence_I = CoreEngine.exec_a_int_int_to_spritepartsequence(134217777, 1));
                    return;
                } catch (var3) {

                }
            default:
                return;
            case 3:
                if ((CoreEngine.val_animationset_r) === (null)) {
                    try {
                        (CoreEngine.val_animationset_r = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217843, -1, (((0) << 24) >> 24), false));
                        (CoreEngine.val_spritepartsequence_v = CoreEngine.exec_a_int_int_to_spritepartsequence(134217773, 1));
                        (CoreEngine.val_spritepartsequence_x = CoreEngine.exec_a_int_int_to_spritepartsequence(134217774, 0));
                        return;
                    } catch (var2) {

                    }
                }
                return;
            case 4:
                CoreEngine.exec_Y_to_void();
                return;
            case 5:
                if ((CoreEngine.val_arr_animationset_e[1]) === (null)) {
                    try {
                        (CoreEngine.val_arr_animationset_e[1] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217825, 134217822, (((0) << 24) >> 24), false));
                        (CoreEngine.val_arr_animationset_f[1] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217826, 134217823, (((0) << 24) >> 24), false));
                    } catch (var1) {

                    }
                }
                CoreEngine.exec_Y_to_void();
                return;
            case 6:
                CoreEngine.exec_Y_to_void();
        }
    }
    static exec_a_datainputstream_to_int(var0) {
        let var1 = -1;
        try {
            switch (var0.readUnsignedByte()) {
                case 1:
                    let var4 = var0.readUnsignedByte();
                    (var1 = ((var4 & 192) << 18));
                    (var1 = ((var4 & 63) | var1));
                    break;
                case 2:
                    let var10000 = var0.readUnsignedShort();
                    (var1 = ((var10000 & 61440) << 12));
                    (var1 = ((var10000 & 4095) | var1));
                case 3:
                default:
                    break;
                case 4:
                    (var1 = var0.readInt());
            }
        } catch (varEx) {

        }
        return var1;
    }
    static exec_E_int_to_void(var0) {
        (CoreEngine.val_arr_animationset_g[var0] = null);
        let var2 = CoreEngine.val_arr_arr_int_j[var0];
        for (let var1 = 0; (var1 < var2.length); (var1 += 2)) {
            (CoreEngine.val_arr_arr_spritepartsequence_a[var0][Math.trunc((var1) / (2))] = null);
        }
    }
    static exec_a_encodedtextbuffer_int_int_to_int(var0, var1, var2) {
        let var3 = CoreEngine.exec_a_to_fontcharmap();
        let var4 = 0;
        let var6 = (var0.flagsByte & 63);
        for (let var5 = var1; (var5 < (var1 + var2)); var5++) {
            (var4 += var3.getCharWidth(var3.getKerning(var0.getCharAt(var5), var6)));
        }
        return var4;
    }
    static exec_e_audioplaybackcontext_to_void(var0) {
        let var1 = null;

        try {
            for (let var5 = 0; (var5 <= 0); var5++) {
                CoreEngine.pauseAudioChannel(var0.contextPool[0].nextContext);
            }
        } catch (var4) {
            let var2 = var4;
            while (true) {
                try {
                    throw var2;
                } catch (var3) {
                    (var2 = var3);
                }
            }
        }
    }
    static exec_a_tokenstring_to_string(var0) {
        let var1 = CoreEngine.exec_a_arr_short_to_int(var0.tokenShortArray);
        let var2 = 0;
        let var3 = createArray(var1, 0);
        for (let var4 = 0; (var4 < var1); var4++) {
            let var5 = var2++;
            (var3[var4] = ((var0.tokenShortArray[var5]) & 0xFFFF));
        }
        return makeString(var3);
    }
    static exec_a_int_int_int_int_int_int_to_void(var0, var1, var2, var3, var4, var5) {
        if (CoreEngine.val_bool_i) {
            CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var0, var1, var2, var3, var4, 0, 5, 0, (var4 + CoreEngine.exec_a_int_int_to_int(1000, 2000)), (((5) << 24) >> 24), false, true, false, false, true, false, CoreEngine.val_arr_animationset_e[var5], CoreEngine.val_spritepartsequence_u, CoreEngine.val_arr_animationset_e[var5], CoreEngine.val_spritepartsequence_w);
        }
    }
    static exec_Q_to_void() {
        (CoreEngine.val_arr_actorstatemachine_a = createArray(8, null));
        (CoreEngine.val_arr_arr_spritepartsequence_a = createMultiArray([7, 4], null));
        (CoreEngine.val_arr_animationset_g = createArray(7, null));
        for (let var0 = 0; (var0 < CoreEngine.val_arr_actorstatemachine_a.length); var0++) {
            (CoreEngine.val_arr_actorstatemachine_a[var0] = new ActorStateMachine());
        }
    }
    static stopClipPlayback(var0) {
        try {
            let var1 = null;

            try {
                CoreEngine.removeClipFromChannel(var0, CoreEngine.getGlobalAudioContext().prevContext);
                var0.mediaPlayer.deallocate();
            } catch (var3) {
                let var5 = var3;
                while (true) {
                    try {
                        throw var5;
                    } catch (var2) {
                        (var5 = var2);
                    }
                }
            }
        } catch (var4) {

        }
    }
    static exec_b_int_int_int_int_int_int_to_void(var0, var1, var2, var3, var4, var5) {
        if (CoreEngine.val_bool_i) {
            CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var0, var1, var2, var3, var4, 0, 5, 0, 500, (((5) << 24) >> 24), false, false, true, true, true, false, CoreEngine.val_arr_animationset_e[var5], CoreEngine.val_spritepartsequence_u, CoreEngine.val_arr_animationset_e[var5], CoreEngine.val_spritepartsequence_u);
        }
    }
    static exec_F_int_to_void(var0) {
        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
        (CoreEngine.val_arr_short_f = CoreEngine.exec_a_encodedtextbuffer_int_to_arr_short((CoreEngine.val_encodedtextbuffer_m = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0, null)), (CoreEngine.val_int_n - 16)));
        (CoreEngine.val_int_cD = ((CoreEngine.val_int_o - 32) << 8));
        (CoreEngine.val_int_cN = 8);
        (CoreEngine.val_int_cE = 1);
        (CoreEngine.val_bool_ak = false);
    }
    static exec_w_to_bool() {
        let var0 = -1;
        if ((CoreEngine.val_int_aF > 0)) {
            (var0 = CoreEngine.val_arr_int_s[CoreEngine.val_int_aF]);
            CoreEngine.val_int_aF--;
        }
        if ((var0) !== (-1)) {
            let var10000 = CoreEngine.val_int_aC;
            CoreEngine.exec_c_int_to_void(var0);
            CoreEngine.exec_e_int_to_void(CoreEngine.exec_e_int_to_int(var10000));
            return true;
        } else {
            return false;
        }
    }
    static exec_b_entityinterface_int_to_void(var0, var1) {
        if ((CoreEngine.val_arr_int_bk[var1] <= 50)) {
            (CoreEngine.val_arr_arr_entityinterface_a[var1][CoreEngine.val_arr_int_bk[var1]] = var0);
            let var2 = (CoreEngine.val_arr_int_bk[var1] + 1);
            (CoreEngine.val_arr_int_bk[var1] = var2);
        }
    }
    static exec_a_arr_byte_int_int_to_arr_byte(var0, var1, var2) {
        (var1 = CoreEngine.readIntWithLength(var0, var1, var2));
        let var3 = createArray((CoreEngine.readIntAtOffset(var0, var1) - var1), 0);
        for (let var5 = 0; (var5 < var3.length); var5++) {
            (var3[var5] = var0[(var1 + var5)]);
        }
        return var3;
    }
    static exec_G_int_to_void(var0) {
        if ((CoreEngine.val_arr_arr_byte_y[var0]) === (null)) {
            try {
                let var1 = CoreEngine.openResourceStreamByName(CoreEngine.val_arr_string_c[var0]);
                let var2 = createArray(var1.readInt(), 0);
                (CoreEngine.val_arr_arr_byte_y[var0] = var2);
                var1.readFully(CoreEngine.val_arr_arr_byte_y[var0]);
                var1.close();
            } catch (varEx) {

            }
        }
    }
    static getClipDuration(var0) {
        let var1 = 0;
        let var2 = null;

        try {
            if ((var0.mediaPlayer) !== (null)) {
                (var1 = var0.mediaPlayer.getState());
            }
            return var1;
        } catch (var4) {
            let var5 = var4;
            while (true) {
                try {
                    throw var5;
                } catch (var3) {
                    (var5 = var3);
                }
            }
        }
    }
    static exec_a_gamemidletloop_to_void(var0) {
        let var1 = Date.now();
        if ((var0.targetFrameTimeMs) === (-1)) {
            (var0.targetFrameTimeMs = var1);
        }
        if ((((!var0.isInitialized && !var0.isRunning) && !var0.isPaused) && !var0.isExitRequested)) {
            CoreEngine.exec_a_short_short_short_gamemidletloop_to_void((((5) << 16) >> 16), (((0) << 16) >> 16), (((0) << 16) >> 16), var0);
        }
    }
    static openResourceStreamByName(var0) {
        let var1 = null;
        (var1 = new StringBuffer((var0.length + 1)));
        if ((var0.indexOf(47)) !== (0)) {
            var1.append('/');
        }
        var1.append(var0);
        (var0 = var1.toString());
        return new DataInputStream(CoreEngine.val_inputmanager_a.getResourceAsStream(var0));
    }
    static exec_e_int_to_bool(var0) {
        let var1 = null;
        let var2 = (var1 = CoreEngine.exec_a_to_fontcharmap()).val_arr_byte_c[var0];
        let var3 = false;
        if (((var1.val_arr_arr_byte_b[var2]) !== (null) && (var1.val_arr_byte_d[var2]) === (var0))) {
            (var3 = true);
        } else {
            (var3 = false);
        }
        return var3;
    }
    static exec_c_to_int() {
        let var0 = null;
        return ((((var0 = CoreEngine.exec_a_to_fontcharmap()).val_contextservicenode_a.val_arr_byte_a[3] & 0xFF) + (var0.val_contextservicenode_a.val_arr_byte_a[4] & 0xFF)) + var0.val_contextservicenode_a.val_arr_byte_a[2]);
    }
    static exec_R_to_void() {
        if ((((CoreEngine.val_animationset_u) === (null) || (CoreEngine.val_spritepartsequence_s) === (null)) || (CoreEngine.val_spritepartsequence_t) === (null))) {
            try {
                (CoreEngine.val_animationset_u = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217835, -1, (((0) << 24) >> 24), false));
                (CoreEngine.val_spritepartsequence_s = CoreEngine.exec_a_int_int_to_spritepartsequence(134217755, 0));
                (CoreEngine.val_spritepartsequence_t = CoreEngine.exec_a_int_int_to_spritepartsequence(134217756, 0));
                return;
            } catch (var0) {

            }
        }
    }
    static exec_a_to_coreengine() {
        if ((CoreEngine.val_coreengine_b.currentHealth > CoreEngine.val_coreengine_c.currentHealth)) {
            return CoreEngine.val_coreengine_b;
        } else {
            return ((CoreEngine.val_coreengine_b.currentHealth < CoreEngine.val_coreengine_c.currentHealth) ? CoreEngine.val_coreengine_c : null);
        }
    }
    static exec_H_int_to_void(var0) {
        switch (var0) {
            case 1:
                (CoreEngine.val_arr_spritepartsequence_f = null);
                (CoreEngine.val_arr_animationset_c = null);
                (CoreEngine.val_arr_spritepartsequence_g = null);
                (CoreEngine.val_animationset_l = null);
                (CoreEngine.val_spritepartsequence_j = null);
                (CoreEngine.val_spritepartsequence_k = null);
                (CoreEngine.val_spritepartsequence_l = null);
                return;
            case 2:
            case 4:
                (CoreEngine.val_arr_animationset_d = null);
                (CoreEngine.val_arr_spritepartsequence_h = null);
                (CoreEngine.val_arr_spritepartsequence_i = null);
                CoreEngine.exec_g_byte_to_void((((1) << 24) >> 24));
                CoreEngine.exec_ao_to_void();
                return;
            case 3:
                CoreEngine.exec_M_to_void();
                return;
            case 5:
            case 6:
            case 7:
            case 9:
            case 10:
                (CoreEngine.val_encodedtextbuffer_m = null);
                (CoreEngine.val_arr_short_f = null);
                (CoreEngine.val_animationset_m = null);
                (CoreEngine.val_spritepartsequence_m = null);
            default:
                return;
            case 8:
                (CoreEngine.val_animationset_k = null);
                (CoreEngine.val_arr_spritepartsequence_e = null);
        }
    }
    static exec_a_int_int_int_to_void(var0, var1, var2) {
        if ((CoreEngine.val_arr_spritepartsequence_d) !== (null)) {
            CoreEngine.val_arr_spritepartsequence_d[var0].drawSequence(CoreEngine.val_arr_int_ae[var0], CoreEngine.val_arr_animationset_b[CoreEngine.val_arr_int_W[var0]], var1, var2, 0);
        }
    }
    static exec_b_int_int_int_to_void(var0, var1, var2) {
        if ((CoreEngine.val_arr_spritepartsequence_c) !== (null)) {
            CoreEngine.val_arr_spritepartsequence_c[var0].drawSequence(CoreEngine.val_arr_int_ab[var0], CoreEngine.val_arr_animationset_a[CoreEngine.val_arr_int_V[var0]], var1, var2, 0);
        }
    }
    static exec_a_graphicsadapter_int_int_int_int_to_void(var0, var1, var2, var3, var4) {
        for (let var5 = 0; (var5 < var4); var5++) {
            var0.drawRGB(CoreEngine.val_arr_int_aF, (var5 % 2), var3, var1, (var2 + var5), var3);
        }
    }
    static exec_a_byte_to_bool(var0) {
        let var1 = false;
        if (((PatternTable.val_arr_arr_byte_a[var0][1]) === (0) || ((PatternTable.val_arr_arr_byte_a[var0][1]) === (1) && CoreEngine.val_bool_U))) {
            (var1 = true);
        }
        return var1;
    }
    static exec_I_int_to_void(var0) {
        if ((var0) !== (CoreEngine.val_int_bv)) {
            (CoreEngine.val_int_bv = var0);
            CoreEngine.exec_l_to_void();
            CoreEngine.exec_g_to_void();
            if ((CoreEngine.val_inputstream_a) !== (null)) {
                try {
                    CoreEngine.val_inputstream_a.close();
                } catch (var2) {

                }
                (CoreEngine.val_inputstream_a = null);
            }
            let var1 = CoreEngine.val_audiomanager_a;
            let var3 = false;
            if ((var0) === (1)) {
                (var3 = false);
            } else {
                (var3 = true);
            }
            let var5 = var3;
            let var4 = var1;
            (var1.isAudioEnabled = var5);
            if (!var5) {
                var4.stopSound();
            }
        }
    }
    static exec_a_int_arr_byte_to_void(var0, var1) {
        (CoreEngine.val_arr_arr_byte_c[var0] = createArray(3, 0));
        for (let var2 = 0; (var2 < 3); var2++) {
            (CoreEngine.val_arr_arr_byte_c[var0][var2] = var1[var2]);
        }
    }
    static exec_c_int_int_int_to_void(var0, var1, var2) {
        (CoreEngine.val_int_eG = (var0 << 8));
        (CoreEngine.val_int_eF = (var1 << 8));
        (CoreEngine.val_int_eH = (var2 << 8));
    }
    static exec_J_int_to_void(var0) {
        switch (var0) {
            case 2:
                CoreEngine.exec_ap_to_void();
            default:
                return;
            case 3:
                CoreEngine.exec_al_to_void();
                return;
            case 4:
                (CoreEngine.val_animationset_t = null);
                return;
            case 5:
                (CoreEngine.val_arr_animationset_e[1] = null);
                (CoreEngine.val_arr_animationset_f[1] = null);
                (CoreEngine.val_animationset_t = null);
                return;
            case 6:
                (CoreEngine.val_animationset_t = null);
        }
    }
    static exec_a_int_int_byte_bool_to_animationset(var0, var1, var2, var3) {
        return CoreEngine.exec_a_int_arr_int_arr_byte_bool_to_animationset(var0, [var1], [var2], var3);
    }
    static exec_S_to_void() {
        if ((CoreEngine.val_arr_actorstatemachine_a) !== (null)) {
            for (let var0 = 0; (var0 < CoreEngine.val_arr_actorstatemachine_a.length); var0++) {
                CoreEngine.val_arr_actorstatemachine_a[var0].setFacingDirection(3);
            }
        }
    }
    static exec_b_gamemidletloop_to_void(var0) {
        (var0.isExitRequested = true);
        CoreEngine.exec_e_audioplaybackcontext_to_void(CoreEngine.getGlobalAudioContext());
        /* System.gc() */;
        if (var0.isTerminated) {
            try {
                var0.platformRequest(var0.gameVersionString);
            } catch (var1) {

            }
        }
        var0.notifyDestroyed();
    }
    static exec_d_int_int_int_to_void(var0, var1, var2) {
        CoreEngine.val_arr_spritepartsequence_h[var0].drawSequence(CoreEngine.val_arr_int_aD[var0], CoreEngine.val_arr_animationset_d[CoreEngine.val_arr_int_az[var0]], var1, var2, 0);
    }
    static exec_e_int_int_int_to_void(var0, var1, var2) {
        CoreEngine.val_arr_spritepartsequence_f[var0].drawSequence(CoreEngine.val_arr_int_at[var0], CoreEngine.val_arr_animationset_c[CoreEngine.val_arr_int_ap[var0]], var1, var2, 0);
    }
    static readStreamBytes(var0, var1) {
        let var2 = 0;
        let var3 = 0;
        try {
            for (let var4 = (var1 << 3); (var3 < var4); (var3 += 8)) {
                (var2 |= ((var0.read() & 0xFF) << var3));
            }
        } catch (varEx) {

        }
        return var2;
    }
    static exec_a_int_int_bool_to_void(var0, var1, var2) {
        if (var2) {
            (CoreEngine.val_int_eU = var0);
            (CoreEngine.val_int_eV = var1);
            (CoreEngine.val_int_eK = var0);
            (CoreEngine.val_int_eL = var1);
        } else {
            (CoreEngine.val_int_eU = var0);
            (CoreEngine.val_int_eV = var1);
        }
    }
    static isChannelBusy(var0) {
        let var1 = null;

        try {
            let var5 = var0.isPaused;
            return var5;
        } catch (var3) {
            let var4 = var3;
            while (true) {
                try {
                    throw var4;
                } catch (var2) {
                    (var4 = var2);
                }
            }
        }
    }
    static exec_x_to_bool() {
        if (CoreEngine.val_bool_am) {
            return true;
        }
        let var0 = false;
        if (((CoreEngine.val_int_dU) === (2) && (CoreEngine.val_int_dU > CoreEngine.val_int_dV))) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        return var0;
    }
    static exec_a_coreengine_to_coreengine(var0) {
        let var1 = CoreEngine.exec_b_coreengine_to_coreengine(var0);
        if ((!var0.exec_p_to_bool() && (CoreEngine.exec_g_to_int() <= 64))) {
            let var3 = false;
            if (((((var0 = var0).actorTimerY <= 200) || var0.exec_r_to_bool()) || ((((var0.actorTimerW) !== (0) && (var0.actorTimerW) !== (1)) && (var0.actorTimerW) !== (2)) && (var0.actorTimerW) !== (16)))) {
                (var3 = false);
            } else {
                (var3 = true);
            }
            if (var3) {
                (var0 = var1);
                let var5 = false;
                if (((((var1.val_int_Y > 200) && !var0.exec_r_to_bool()) && (var0.actorTimerW) !== (27)) && (var0.actorTimerW) !== (15))) {
                    (var5 = true);
                } else {
                    (var5 = false);
                }
                if (var5) {
                    return var1;
                }
            }
        }
        return null;
    }
    static exec_a_int_int_byte_to_void(var0, var1, var2) {
        (CoreEngine.val_int_dQ = var0);
        (CoreEngine.val_int_dR = var1);
        (CoreEngine.val_byte_r = var2);
        (CoreEngine.val_bool_ax = false);
        (CoreEngine.val_bool_aA = false);
        (CoreEngine.val_int_ec = 0);
        (CoreEngine.val_int_eb = 0);
        CoreEngine.exec_z_int_to_void(1);
    }
    static exec_a_int_to_arr_byte(var0) {
        try {
            let var1 = null;
            (var1 = new PackedResourceStream(var0));
            let var3 = createArray(var1.resourceId, 0);
            var1.read(var3);
            var1.close();
            return var3;
        } catch (var2) {
            return null;
        }
    }
    static exec_a_arr_string_arr_int_arr_string_to_void(var0, var1, var2) {
        (CoreEngine.val_arr_string_c = var0);
        (CoreEngine.val_arr_int_bh = var1);
        (CoreEngine.val_arr_arr_byte_y = createArray(var0.length, null));
        (CoreEngine.val_arr_string_d = var2);
    }
    static exec_f_int_to_bool(var0) {
        let var1 = CoreEngine.val_arr_int_bi[var0];
        try {
            (CoreEngine.val_arr_animationset_g[var0] = CoreEngine.exec_a_int_int_byte_bool_to_animationset(var1, -1, (((0) << 24) >> 24), false));
            return false;
        } catch (var2) {
            return true;
        }
    }
    static exec_a_string_to_spriteimage(var0) {
        let var1 = null;
        (var1 = new SpriteImage(var0));
        if ((var1.sourceImage.getImage()) === (null)) {
            throw new RuntimeException("Error creating SDKImage from a file path.");
        } else {
            return var1;
        }
    }
    static exec_b_arr_byte_int_to_short(var0, var1) {
        return ((((((var0[var1] & 255) << 8) | (var0[(var1 + 1)] & 0xFF))) << 16) >> 16);
    }
    static skipStreamBytes(var0, var1) {
        try {
            for (let var3 = 0; (var3 < var1); var3++) {
                if ((var0.read()) === (-1)) {
                    return var3;
                }
            }
        } catch (varEx) {

        }
        return var1;
    }
    static readShortBigEndian(var0, var1) {
        return ((((((var0[var1] & 255) << 8) | (var0[(var1 + 1)] & 0xFF))) << 16) >> 16);
    }
    static exec_d_int_to_int(var0) {
        if (((var0 >= 17) && (var0 <= 26))) {
            return ((var0 - 17) + 48);
        }
        switch (var0) {
            case 10:
                return 8;
            case 15:
                return 35;
            case 16:
                return 42;
            default:
                return 0;
        }
    }
    static exec_a_int_featureflag_to_void(var0, var1) {
        if (var1.flagEnabled) {
            Display.getDisplay(CoreEngine.val_globalcontext_a.gameMidletLoop).vibrate(var0);
            Date.now();
        }
    }
    static exec_f_int_int_int_to_void(var0, var1, var2) {
        CoreEngine.val_arr_spritepartsequence_i[var0].drawSequence(CoreEngine.val_arr_int_aA[var0], CoreEngine.val_arr_animationset_d[1], var1, var2, 0);
    }
    static exec_e_int_to_int(var0) {
        for (let var1 = 0; (var1 < CoreEngine.val_int_aG); var1++) {
            if ((CoreEngine.val_arr_int_r[var1]) === (var0)) {
                return var1;
            }
        }
        return 0;
    }
    static exec_K_int_to_void(var0) {
        (CoreEngine.val_int_ax = var0);
        CoreEngine.val_animationset_i.setFrame(CoreEngine.val_int_ax);
        if ((CoreEngine.val_animationset_j) !== (null)) {
            CoreEngine.val_animationset_j.setFrame(CoreEngine.val_int_ax);
        }
    }
    static exec_T_to_void() {
        (CoreEngine.val_int_eK = 0);
        (CoreEngine.val_int_eL = CoreEngine.val_int_bz);
        (CoreEngine.val_int_eM = CoreEngine.val_int_bD);
        (CoreEngine.val_int_eN = CoreEngine.val_int_bE);
    }
    static exec_a_int_int_to_int(var0, var1) {
        return (Math.abs((CoreEngine.globalRandom.nextInt() % ((var1 - var0) + 1))) + var0);
    }
    static loadResourceBytes(var0) {
        let var1 = null;
        try {
            let var10000 = CoreEngine.openResourceStream(var0);
            var10000.readFully((var1 = createArray(CoreEngine.val_int_eq, 0)));
            var10000.close();
        } catch (var2) {

        }
        return var1;
    }
    static exec_U_to_void() {
        for (let var0 = 0; (var0 < CoreEngine.val_arr_arr_byte_y.length); var0++) {
            (CoreEngine.val_arr_arr_byte_y[var0] = null);
        }
        try {
            /* System.gc() */;
            /* yield */;
        } catch (var1) {

        }
    }
    static getGlobalAudioContext() {
        if ((CoreEngine.val_globalcontext_a.rootAudioContext) === (null)) {
            (CoreEngine.val_globalcontext_a.rootAudioContext = new AudioPlaybackContext(1));
        }
        return CoreEngine.val_globalcontext_a.rootAudioContext;
    }
    static exec_a_to_contextservicenode() {
        if ((CoreEngine.val_globalcontext_a.serviceNodeC) === (null)) {
            (CoreEngine.val_globalcontext_a.serviceNodeC = new ContextServiceNode(0));
        }
        return CoreEngine.val_globalcontext_a.serviceNodeC;
    }
    static exec_h_int_int_to_void(var0, var1) {
        if (CoreEngine.val_bool_i) {
            CoreEngine.exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(var0, var1, 0, 0, 0, 0, 0, 1, 0, (((2) << 24) >> 24), false, false, false, false, false, false, CoreEngine.val_animationset_s, CoreEngine.val_spritepartsequence_z, CoreEngine.val_animationset_s, CoreEngine.val_spritepartsequence_z);
        }
    }
    static exec_b_coreengine_to_coreengine(var0) {
        if ((var0) === (CoreEngine.val_coreengine_b)) {
            return CoreEngine.val_coreengine_c;
        } else {
            return ((var0) === (CoreEngine.val_coreengine_c) ? CoreEngine.val_coreengine_b : null);
        }
    }
    static exec_g_to_int() {
        let var0 = 0;
        if (((var0 = (CoreEngine.val_coreengine_c.exec_a_to_int() - CoreEngine.val_coreengine_b.exec_a_to_int())) < 0)) {
            (var0 = -var0);
        }
        return var0;
    }
    static exec_y_to_bool() {
        let var0 = false;
        if ((((CoreEngine.val_int_dQ) !== (1) && (CoreEngine.val_int_dR) !== (1)) && !CoreEngine.exec_A_to_bool())) {
            (var0 = false);
        } else {
            (var0 = true);
        }
        return var0;
    }
    static exec_V_to_void() {
        if (CoreEngine.val_bool_aO) {
            switch (CoreEngine.val_int_eb) {
                case 1:
                    CoreEngine.drawTextLabel(9);
                    return;
                case 2:
                    CoreEngine.drawTextLabel(10);
            }
        } else {
            CoreEngine.exec_W_to_void();
        }
    }
    static exec_W_to_void() {
        if ((((CoreEngine.val_int_dU) !== (2) && (CoreEngine.val_int_dV) !== (2)) && !CoreEngine.val_bool_am)) {
            CoreEngine.drawTextLabel(0);
        } else {
            CoreEngine.drawTextLabel(15);
        }
    }
    static exec_X_to_void() {
        if ((((CoreEngine.val_long_c) | 0) > CoreEngine.val_arr_int_ag[9])) {
            (CoreEngine.val_bool_aj = true);
            CoreEngine.exec_u_int_to_void(8);
        } else {
            (CoreEngine.val_bool_aj = false);
            CoreEngine.exec_u_int_to_void(9);
        }
    }
    static exec_c_to_byte() {
        let var0 = 0;
        while ((!CoreEngine.exec_a_byte_to_bool((var0 = (((CoreEngine.exec_a_int_int_to_int(0, (PatternTable.val_arr_arr_byte_a.length - 1))) << 24) >> 24))) || (CoreEngine.val_byte_n) === (var0))) {

        }
        return var0;
    }
    static exec_i_to_void() {
        if ((CoreEngine.val_byte_c) !== (0)) {
            CoreEngine.exec_d_byte_to_void(CoreEngine.val_byte_c);
        }
        if ((CoreEngine.val_byte_d) !== (0)) {
            CoreEngine.exec_d_byte_to_void(CoreEngine.val_byte_d);
        }
    }
    static exec_a_to_audiomanager() {
        let var0 = null;
        if (((var0 = CoreEngine.exec_a_to_fontcharmap()).val_audiomanager_a) === (null)) {
            (var0.val_audiomanager_a = new AudioManager());
        }
        return var0.val_audiomanager_a;
    }
    static exec_b_to_contextservicenode() {
        let var0 = CoreEngine.val_globalcontext_a;
        if ((CoreEngine.val_globalcontext_a.serviceNodeB) === (null)) {
            (var0.serviceNodeB = new ContextServiceNode(4));
        }
        return var0.serviceNodeB;
    }
    static exec_c_to_contextservicenode() {
        let var0 = CoreEngine.val_globalcontext_a;
        if ((CoreEngine.val_globalcontext_a.serviceNodeA) === (null)) {
            (var0.serviceNodeA = new ContextServiceNode(5));
        }
        return var0.serviceNodeA;
    }
    static exec_c_string_to_string(var0) {
        let var1 = null;
        try {
            (var1 = CoreEngine.val_gamemidletloop_a.getAppProperty(var0));
        } catch (var2) {

        }
        if ((var1) === (null)) {
            (var1 = "NULL");
        }
        return var1;
    }
    static exec_a_to_gameflowcontroller() {
        let var0 = CoreEngine.val_globalcontext_a;
        if ((CoreEngine.val_globalcontext_a.gameFlowController) === (null)) {
            (var0.gameFlowController = new GameFlowController());
        }
        return var0.gameFlowController;
    }
    static exec_a_scenebase_to_void(var0) {
        let var1 = var0.sceneExtraShorts;
        for (let var2 = 0; (var2 < 33); var2++) {
            (var1[var2] = 0);
        }
        (var0.sceneStateId = 0);
    }
    static exec_Y_to_void() {
        if ((CoreEngine.val_animationset_t) === (null)) {
            try {
                (CoreEngine.val_animationset_t = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217841, -1, (((0) << 24) >> 24), false));
                (CoreEngine.val_spritepartsequence_A = CoreEngine.exec_a_int_int_to_spritepartsequence(134217771, 0));
                return;
            } catch (var0) {

            }
        }
    }
    static exec_j_to_void() {
        if (((CoreEngine.val_coreengine_b) !== (null) && (CoreEngine.val_coreengine_c) !== (null))) {
            CoreEngine.exec_a_arr_byte_to_void(CoreEngine.val_coreengine_b.scratchpadBuffer);
            CoreEngine.exec_a_arr_byte_to_void(CoreEngine.val_coreengine_c.scratchpadBuffer);
        }
    }
    static exec_Z_to_void() {
        (CoreEngine.val_bool_aG = false);
        (CoreEngine.val_bool_aF = false);
        (CoreEngine.val_bool_aH = false);
        (CoreEngine.val_bool_aI = false);
        (CoreEngine.val_bool_aJ = false);
        (CoreEngine.val_bool_aL = false);
        (CoreEngine.val_bool_aK = false);
        (CoreEngine.val_bool_aM = false);
    }
    static exec_a_encodedtextbuffer_int_int_int_to_void(var0, var1, var2, var3) {
        CoreEngine.exec_a_encodedtextbuffer_int_int_int_int_int_to_void(var0, 0, var0.bufferCapacity, var1, var2, var3);
    }
    static exec_a_int_int_scenebase_to_void(var0, var1, var2) {
        CoreEngine.exec_a_scenebase_to_void(var2);
        (var2.sceneConfigShorts[var0] = (((var1) << 16) >> 16));
    }
    static exec_f_int_to_void(var0) {
        (var0 = CoreEngine.exec_i_int_to_int(var0));
        if ((CoreEngine.val_scenebase_a.sceneStateId) !== (var0)) {
            CoreEngine.exec_a_int_bool_scenebase_to_void(var0, false, CoreEngine.val_scenebase_a);
        }
    }
    static exec_b_to_arr_int() {
        let var0 = null;
        ((var0 = createArray(3, 0))[0] = 352);
        (var0[1] = 416);
        (var0[2] = 24);
        return var0;
    }
    static exec_a_arr_byte_to_void(var0) {
        for (let var1 = 0; (var1 < var0.length); var1++) {
            (var0[var1] = 10);
        }
    }
    static exec_g_int_to_void(var0) {
        (CoreEngine.val_int_dI |= var0);
        (CoreEngine.val_int_dK |= var0);
    }
    static exec_a_int_to_encodedtextbuffer(var0) {
        let var1 = null;
        (var1 = new EncodedTextBuffer(""));
        let var2 = var1;
        if ((var0 < 10)) {
            let var3 = "0";
            (var2 = var1.prepend(new EncodedTextBuffer(var3)));
        }
        return var2.prepend(new EncodedTextBuffer(var0, (((0) << 24) >> 24)));
    }
    static exec_k_to_void() {
        if (CoreEngine.exec_v_to_bool()) {
            CoreEngine.exec_l_to_void();
            CoreEngine.exec_g_to_void();
            (CoreEngine.val_bool_ah = true);
            CoreEngine.exec_c_int_to_void(24);
        }
    }
    static exec_a_int_int_int_to_int(var0, var1, var2) {
        return (((var0 << 16) | (var1 << 2)) | var2);
    }
    static exec_h_to_int() {
        let var0 = 0;
        if ((CoreEngine.val_arr_int_ad) === (null)) {
            (var0 = CoreEngine.val_arr_int_Y[7]);
        } else {
            (var0 = CoreEngine.val_arr_int_ad[1]);
        }
        return var0;
    }
    static exec_i_to_int() {
        let var0 = 0;
        if ((CoreEngine.val_arr_int_ac) === (null)) {
            (var0 = CoreEngine.val_arr_int_X[7]);
        } else {
            (var0 = CoreEngine.val_arr_int_ac[1]);
        }
        return var0;
    }
    static exec_L_int_to_void(var0) {
        CoreEngine.val_int_aF++;
        (CoreEngine.val_arr_int_s[CoreEngine.val_int_aF] = var0);
    }
    static exec_b_to_encodedtextbuffer() {
        let var0 = null;
        ((var0 = createArray(2, null))[0] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(136, null));
        (var0[1] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(139, null));
        return CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(42, null).concatAll(var0);
    }
    static exec_c_to_encodedtextbuffer() {
        let var0 = null;
        ((var0 = createArray(2, null))[0] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(136, null));
        (var0[1] = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(139, null));
        return CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(43, null).concatAll(var0);
    }
    static exec_aa_to_void() {
        (CoreEngine.val_int_aF = 0);
        for (let var0 = 0; (var0 < 5); var0++) {
            (CoreEngine.val_arr_int_s[var0] = -1);
        }
    }
    static exec_l_to_void() {
        try {
            CoreEngine.val_audiomanager_a.stopSound();
        } catch (var0) {

        }
        (CoreEngine.val_byte_f = -1);
        (CoreEngine.val_byte_g = -1);
        (CoreEngine.val_int_aA = 0);
    }
    static loadResourceBytesByName(var0) {
        try {
            if ((var0.charAt(0)) === ('/')) {
                (var0 = var0.substring(1));
            }
        } catch (var1) {

        }
        return CoreEngine.exec_b_string_to_arr_byte(var0);
    }
    static exec_ab_to_void() {
        try {
            (CoreEngine.val_animationset_y = CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217836, -1, (((0) << 24) >> 24), false));
            (CoreEngine.val_spritepartsequence_C = CoreEngine.exec_a_int_int_to_spritepartsequence(134217757, 0));
        } catch (var0) {

        }
    }
    static exec_a_arr_short_to_int(var0) {
        let var1 = 0;
        while ((var0[var1]) !== (0)) {
            var1++;
        }
        return var1;
    }
    static exec_a_bool_to_void(var0) {
        (CoreEngine.getGlobalAudioContext().isPlaying = var0);
        if (var0) {
            CoreEngine.exec_e_audioplaybackcontext_to_void(CoreEngine.getGlobalAudioContext());
        }
    }
    static exec_m_to_void() {
        (CoreEngine.val_int_dF = 0);
        (CoreEngine.val_int_dG = 0);
        (CoreEngine.val_int_dH = 0);
        (CoreEngine.val_int_dI = 0);
        (CoreEngine.val_int_dJ = 0);
        (CoreEngine.val_int_dK = 0);
    }
    static exec_ac_to_void() {
        if (((CoreEngine.val_int_bZ) === (2) && !CoreEngine.val_bool_U)) {
            (CoreEngine.val_bool_U = true);
            (CoreEngine.val_bool_al = true);
        }
    }
    static exec_j_to_int() {
        return CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ][(CoreEngine.val_int_ce + 1)];
    }
    static exec_ad_to_void() {
        (CoreEngine.val_encodedtextbuffer_l = CoreEngine.exec_a_int_encodedtextbuffer_to_encodedtextbuffer(CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ][0], null));
    }
    static exec_ae_to_void() {
        CoreEngine.val_graphicsadapter_a.setClip(0, CoreEngine.val_int_bz, CoreEngine.val_int_bD, CoreEngine.val_int_bE);
    }
    static exec_h_int_to_void(var0) {
        if ((var0 >= 0)) {
            (CoreEngine.val_int_g = var0);
            CoreEngine.exec_c_int_to_bool(var0);
        }
    }
    static exec_n_to_void() {
        if ((CoreEngine.val_byte_f) !== (-1)) {
            let var10000 = CoreEngine.val_byte_f;
            CoreEngine.exec_l_to_void();
            (CoreEngine.val_byte_g = var10000);
            (CoreEngine.val_int_aB = 1000);
        }
    }
    static exec_b_string_to_string(var0) {
        (var0 = var0);
        new TokenWrapper();
        if (((var0 = CoreEngine.exec_c_string_to_string(var0)) !== null && (var0 = CoreEngine.exec_c_string_to_string(var0)).equals("NULL"))) {
            (var0 = null);
        }
        return var0;
    }
    static exec_k_to_int() {
        return ((CoreEngine.val_int_eP + CoreEngine.val_int_eX) - CoreEngine.val_int_bz);
    }
    static exec_a_arr_byte_int_int_to_spriteimage(var0, var1, var2) {
        return new SpriteImage(var0, var1, var2);
    }
    static exec_l_to_int() {
        return (CoreEngine.exec_a_to_fontcharmap().val_contextservicenode_a.val_arr_byte_a[3] & 0xFF);
    }
    static exec_c_audioplaybackcontext_to_void(var0) {
        let var10000 = var0.nextContext;
        (var0.nextContext.volumeLevel = 255);
        CoreEngine.destroyAudioChannel(var10000);
    }
    static exec_z_to_bool() {
        let var0 = false;
        if ((CoreEngine.val_int_dS <= 0)) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        return var0;
    }
    static exec_A_to_bool() {
        let var0 = false;
        if ((CoreEngine.val_arr_byte_k) !== (null)) {
            (var0 = true);
        } else {
            (var0 = false);
        }
        return var0;
    }
    static exec_af_to_void() {
        (CoreEngine.val_arr_byte_k = null);
        (CoreEngine.val_arr_arr_int_d = null);
        CoreEngine.exec_H_int_to_void(CoreEngine.val_int_cw);
        (CoreEngine.val_int_cw = 11);
    }
    static exec_ag_to_void() {
        CoreEngine.exec_b_byte_to_void((((4) << 24) >> 24));
        CoreEngine.exec_a_encodedtextbuffer_int_int_int_to_void(CoreEngine.val_encodedtextbuffer_n, Math.trunc((CoreEngine.val_int_n) / (2)), 8, 17);
    }
    static exec_m_to_int() {
        return (CoreEngine.val_arr_arr_int_c[CoreEngine.val_int_bZ].length - 1);
    }
    static exec_a_byte_to_int(var0) {
        return (var0 * (CoreEngine.val_int_bQ + CoreEngine.val_int_bR));
    }
    static exec_M_int_to_void(var0) {
        if ((CoreEngine.val_int_bu) === (0)) {
            if ((var0) === (0)) {
                let var1 = CoreEngine.exec_a_to_contextservicenode();
                CoreEngine.exec_a_int_featureflag_to_void(0, var1.val_featureflag_a);
                return;
            }
            CoreEngine.exec_a_int_featureflag_to_void(var0, CoreEngine.exec_a_to_contextservicenode().val_featureflag_a);
        }
    }
    static exec_g_byte_to_void(var0) {
        (CoreEngine.val_arr_object_a[ResourceSlotTable.val_arr_byte_a[var0]] = null);
    }
    static exec_a_to_long() {
        return (Date.now() - CoreEngine.exec_a_to_rootgamestate().gameTimer);
    }
    static exec_i_int_int_to_void(var0, var1) {
        (CoreEngine.val_int_eU = var0);
        (CoreEngine.val_int_eV = var1);
    }
    static exec_a_encodedtextbuffer_to_int(var0) {
        return CoreEngine.exec_a_encodedtextbuffer_int_int_to_int(var0, 0, var0.bufferCapacity);
    }
    static exec_d_to_int() {
        return CoreEngine.exec_a_to_fontcharmap().val_contextservicenode_a.val_arr_byte_a[2];
    }
    static exec_a_arr_short_arr_short_int_to_void(var0, var1, var2) {
        System.arraycopy(var0, 0, var1, 0, var2);
    }
    static exec_i_int_to_void(var0) {
        CoreEngine.exec_a_int_bool_scenebase_to_void(CoreEngine.exec_i_int_to_int(var0), true, CoreEngine.val_scenebase_a);
    }
    static exec_a_to_fontcharmap() {
        return (CoreEngine.val_globalcontext_a.currentScene).fontCharmap;
    }
    static exec_e_coreengine_to_void(var0) {
        var0.actorTimerT++;
    }
    static exec_ah_to_void() {
        (CoreEngine.val_animationset_o = null);
        (CoreEngine.val_spritepartsequence_o = null);
        (CoreEngine.val_animationset_p = null);
        (CoreEngine.val_spritepartsequence_p = null);
    }
    static exec_j_int_to_void(var0) {
        (CoreEngine.val_int_dJ |= var0);
    }
    static exec_ai_to_void() {
        (CoreEngine.val_arr_int_aG[0] = 0);
        (CoreEngine.val_arr_int_aG[1] = 0);
    }
    static exec_d_bool_to_void(var0) {
        (CoreEngine.val_bool_aa = var0);
        if (!var0) {
            (CoreEngine.val_int_ce = 0);
        }
    }
    static exec_n_to_int() {
        return PatternTable.val_arr_arr_byte_a[CoreEngine.val_byte_n][0];
    }
    static exec_aj_to_void() {
        CoreEngine.val_graphicsadapter_a.setClip(0, 0, CoreEngine.val_int_n, CoreEngine.val_int_o);
    }
    static exec_a_byte_byte_to_void(var0, var1) {
        (CoreEngine.val_byte_c = var0);
        (CoreEngine.val_byte_d = var1);
    }
    static exec_o_to_int() {
        return CoreEngine.val_int_eO;
    }
    static exec_ak_to_void() {
        CoreEngine.val_int_eu++;
    }
    static exec_a_int_byte_to_animationset(var0, var1) {
        return CoreEngine.exec_a_int_int_byte_bool_to_animationset(134217840, -1, var1, false);
    }
    static exec_a_int_to_animationset(var0) {
        return CoreEngine.exec_a_int_int_byte_bool_to_animationset(var0, -1, (((0) << 24) >> 24), false);
    }
    static exec_N_int_to_void(var0) {
        CoreEngine.exec_f_int_to_bool(var0);
        CoreEngine.exec_d_int_to_bool(var0);
    }
    static renderSecondary(var0) {
        (CoreEngine.exec_a_to_fontcharmap().val_graphicsadapter_a = var0);
    }
    static exec_a_to_rootgamestate() {
        return (CoreEngine.val_globalcontext_a.currentScene);
    }
    static exec_a_arr_short_to_tokenstring(var0) {
        return new TokenString(var0);
    }
    static exec_a_audioplaybackcontext_to_audioplaybackcontext(var0) {
        return var0.contextPool[0];
    }
    static exec_al_to_void() {
        (CoreEngine.val_animationset_r = null);
        (CoreEngine.val_spritepartsequence_x = null);
        (CoreEngine.val_spritepartsequence_v = null);
    }
    static exec_j_int_to_int(var0) {
        return ((var0 & 65532) >>> 2);
    }
    static exec_am_to_void() {
        (CoreEngine.val_bool_Z = true);
        CoreEngine.exec_l_to_void();
        CoreEngine.exec_g_to_void();
    }
    static exec_an_to_void() {
        (CoreEngine.val_spritepartsequence_j = CoreEngine.val_spritepartsequence_l);
        (CoreEngine.val_int_bO = 1);
    }
    static exec_d_to_bool() {
        (CoreEngine.val_bool_H = false);
        return false;
    }
    static exec_ao_to_void() {
        (CoreEngine.val_animationset_i = null);
        (CoreEngine.val_animationset_j = null);
        (CoreEngine.val_spritepartsequence_i = null);
    }
    static exec_ap_to_void() {
        (CoreEngine.val_spritepartsequence_I = null);
        (CoreEngine.val_animationset_C = null);
    }
    static exec_b_int_to_animationset(var0) {
        return CoreEngine.exec_a_int_int_byte_bool_to_animationset(var0, -1, (((0) << 24) >> 24), false);
    }
    static getTransformMask(var0) {
        return (var0 << 16);
    }
    static exec_c_to_arr_int() {
        return CoreEngine.val_rendercontext_a.clipBounds;
    }
    static exec_a_arr_int_to_int(var0) {
        return var0[0];
    }
    static exec_b_arr_int_to_int(var0) {
        return var0[1];
    }
    static exec_a_tokenstring_to_arr_short(var0) {
        return var0.tokenShortArray;
    }
    static exec_a_audioplaybackcontext_to_short(var0) {
        return var0.volumeLevel;
    }
    static exec_f_coreengine_to_void(var0) {
        (CoreEngine.val_coreengine_d = var0);
    }
    static exec_g_int_to_int(var0) {
        return (var0 & 3);
    }
    static exec_a_arr_int_to_void(var0) {
        CoreEngine.exec_a_arr_int_bool_encodedtextbuffer_to_void(var0, true, null);
    }
    static exec_c_byte_to_void(var0) {
        CoreEngine.exec_f_byte_to_void(var0);
    }
    static exec_h_byte_to_void(var0) {
        CoreEngine.exec_a_byte_bool_to_void(var0, false);
    }
    static exec_aq_to_void() {
        (CoreEngine.val_int_eW = 300);
    }
    static exec_p_to_int() {
        return CoreEngine.val_int_eQ;
    }
    static exec_B_to_bool() {
        return CoreEngine.val_bool_j;
    }
    static exec_o_to_void() {
        (CoreEngine.val_int_aB = 1000);
    }
    static initStaticTables1() {
        (CoreEngine.val_arr_byte_c = [(((2) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24), (((1) << 24) >> 24), (((0) << 24) >> 24)]);
        (CoreEngine.val_arr_int_h = [0, 167772201, 167772200, 167772199, 167772195, 167772202, 167772198]);
        (CoreEngine.val_int_b = -1);
        (CoreEngine.val_int_c = -1);
        (CoreEngine.val_int_d = -1);
        (CoreEngine.val_arr_byte_d = [(((80) << 24) >> 24), (((76) << 24) >> 24), (((84) << 24) >> 24), (((69) << 24) >> 24)]);
        (CoreEngine.val_arr_int_a = [0, 6, 3, 5, 2, 4, 1, 7]);
        (CoreEngine.val_arr_int_b = [0, 6, 4, 2, 5, 3, 1, 7]);
        (CoreEngine.val_arr_arr_byte_b = [[], [], []]);
        (CoreEngine.val_arr_byte_e = [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)]);
        (CoreEngine.val_arr_byte_f = [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)]);
        (CoreEngine.val_arr_int_k = [0, 0, 0]);
        (CoreEngine.val_arr_int_l = [0, 0, 0]);
        (CoreEngine.val_arr_int_m = [0, 0, 0]);
        (CoreEngine.val_arr_int_n = [0, 0, 0]);
        (CoreEngine.val_arr_int_o = [0, 0, 0]);
        (CoreEngine.val_arr_int_p = [0, 0, 0]);
        (CoreEngine.val_arr_int_q = [-1, -1]);
        (CoreEngine.val_arr_byte_g = [(((0) << 24) >> 24), (((1) << 24) >> 24)]);
        (CoreEngine.val_byte_f = (((-1) << 24) >> 24));
        (CoreEngine.val_byte_g = (((-1) << 24) >> 24));
        (CoreEngine.val_arr_int_s = [0, 0, 0, 0, 0]);
        (CoreEngine.val_arr_bool_a = [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
        (CoreEngine.val_arr_int_v = [1, 71, 86, 23, 31, 27, 11, 28, 20, 26, 72, 25]);
        (CoreEngine.val_arr_int_w = [4, 25, 51]);
    }
    static initStaticTables2() {
        (CoreEngine.val_arr_int_x = [6, 20, 74]);
        (CoreEngine.val_arr_int_y = [0, 72, 17, 21, 23, 20, 18, 22, 19, 1, 20, 2, 22, 5, 21, 6, 25, 8]);
        (CoreEngine.val_arr_int_z = [0, 19, 31, 12, 11, 14, 36, 10, 32, 16, 37, 18, 40, 9]);
        (CoreEngine.val_arr_int_A = [3, 36]);
        (CoreEngine.val_arr_int_B = [3, 31, 10, 13]);
        (CoreEngine.val_arr_int_C = [3, 11, 12, 13]);
        (CoreEngine.val_arr_int_D = [2, 31, 10, 13]);
        (CoreEngine.val_arr_int_E = [2, 11, 12, 13]);
        (CoreEngine.val_arr_int_F = [3, 32, 33, 34, 35]);
        (CoreEngine.val_arr_int_G = [3, 37, 38, 39]);
        (CoreEngine.val_arr_int_H = [0, 20, 17, 3, 37, 4]);
        (CoreEngine.val_arr_int_I = [5, 22, 112]);
        (CoreEngine.val_arr_int_J = [5, 20, 41]);
        (CoreEngine.val_arr_int_K = [5, 20, 41]);
        (CoreEngine.val_arr_int_L = [4, 17, 53]);
        (CoreEngine.val_arr_int_M = [4, 25, 50]);
        (CoreEngine.val_arr_int_N = [4, 40, 52]);
        (CoreEngine.val_arr_int_O = [0, 0, 0, 0]);
        (CoreEngine.val_arr_int_P = [0, 0, 0, 0]);
        (CoreEngine.val_arr_int_Q = [0, 0, 0, 0]);
        (CoreEngine.val_arr_int_R = [167772236, 167772237, 167772239, 167772240]);
        (CoreEngine.val_arr_int_S = [167772240, 167772239]);
        (CoreEngine.val_arr_int_T = [167772184, 167772189, 167772176, 167772175, 167772178, 167772177, 167772179, 167772164, 167772165, 167772162, 167772163]);
        (CoreEngine.val_arr_int_U = [167772179, 167772164, 167772165, 167772162, 167772163]);
        (CoreEngine.val_arr_int_V = [0, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2]);
    }
    static initStaticTables3() {
        (CoreEngine.val_arr_int_W = [0, 1, 1, 1, 1]);
        (CoreEngine.val_arr_byte_h = [(((11) << 24) >> 24), (((11) << 24) >> 24), (((11) << 24) >> 24)]);
        (CoreEngine.val_arr_byte_i = [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)]);
        (CoreEngine.val_arr_arr_byte_c = [[(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)]]);
        (CoreEngine.val_arr_int_ag = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        (CoreEngine.val_arr_encodedtextbuffer_b = [null, null, null, null, null, null, null, null, null, null]);
        (CoreEngine.val_arr_encodedtextbuffer_c = [null, null, null, null, null, null, null, null, null, null]);
        (CoreEngine.val_arr_encodedtextbuffer_d = [null, null, null, null, null, null, null, null, null, null]);
        (CoreEngine.val_int_bt = 167772241);
        (CoreEngine.val_arr_int_ah = [167772188, 167772185, 167772186, 167772187]);
        (CoreEngine.val_arr_int_aj = [0, 0, 0, 0]);
        (CoreEngine.val_arr_int_ak = [0, 0, 0, 0]);
        (CoreEngine.val_arr_int_al = [0, 0, 0, 0]);
        (CoreEngine.val_arr_int_am = [0, 0, 0, 0]);
        (CoreEngine.val_int_bv = 2);
        (CoreEngine.val_int_g = -1);
        (CoreEngine.val_int_bx = 1);
        (CoreEngine.val_int_h = -1);
        (CoreEngine.val_arr_object_a = [null, null, null, null, null, null, null, null, null]);
        (CoreEngine.val_bool_g = true);
        (CoreEngine.val_bool_i = true);
        (CoreEngine.val_bool_j = true);
        (CoreEngine.val_bool_V = true);
        (CoreEngine.val_arr_int_an = [167772237, 167772234, 167772236]);
        (CoreEngine.val_arr_int_ao = [167772189, 167772167, 167772168, 167772184]);
    }
    static initStaticTables4() {
        (CoreEngine.val_arr_int_ap = [0, 1, 1, 2]);
        (CoreEngine.val_arr_int_ax = [167772237, 167772234, 167772240, 167772238, 167772238, 167772232, 167772233]);
        (CoreEngine.val_arr_int_ay = [167772189, 167772167, 167772167, 167772179, 167772180, 167772182, 167772183, 167772190, 167772191, 167772160, 167772161]);
        (CoreEngine.val_arr_int_az = [0, 1, 1, 2, 2, 3, 3, 3, 3, 5, 6]);
        (CoreEngine.val_arr_int_c = [0, 0, 0, 0, 0, 0]);
        (CoreEngine.val_arr_int_d = [0, 0, 0, 0]);
        (CoreEngine.val_arr_int_aE = [28, 29, 30]);
        (CoreEngine.val_byte_q = (((4) << 24) >> 24));
        (CoreEngine.val_arr_arr_byte_d = [[(((28) << 24) >> 24), (((19) << 24) >> 24), (((21) << 24) >> 24)], [(((20) << 24) >> 24), (((11) << 24) >> 24), (((13) << 24) >> 24)], [(((12) << 24) >> 24), (((28) << 24) >> 24), (((31) << 24) >> 24)], [(((11) << 24) >> 24), (((28) << 24) >> 24), (((15) << 24) >> 24)], [(((11) << 24) >> 24), (((14) << 24) >> 24), (((28) << 24) >> 24)], [(((25) << 24) >> 24), (((22) << 24) >> 24), (((1) << 24) >> 24)], [(((15) << 24) >> 24), (((14) << 24) >> 24), (((25) << 24) >> 24)], [(((23) << 24) >> 24), (((11) << 24) >> 24), (((30) << 24) >> 24)], [(((33) << 24) >> 24), (((11) << 24) >> 24), (((15) << 24) >> 24)], [(((29) << 24) >> 24), (((25) << 24) >> 24), (((16) << 24) >> 24)]]);
        (CoreEngine.val_arr_int_aG = [0, 0]);
        (CoreEngine.val_arr_encodedtextbuffer_f = [null, null]);
        (CoreEngine.val_arr_encodedtextbuffer_g = [null, null]);
        (CoreEngine.val_arr_int_aH = [0, 0]);
        (CoreEngine.val_arr_int_aI = [0, 0]);
        (CoreEngine.val_arr_int_aJ = [0, 0]);
        (CoreEngine.val_arr_int_aK = [0, 0]);
        (CoreEngine.val_arr_int_aL = [0, 0]);
        (CoreEngine.val_arr_int_aM = [0, 0]);
        (CoreEngine.val_arr_int_aN = [0, 0]);
        (CoreEngine.val_arr_arr_int_e = [[32, 160, 1200], [-32, 160, 1200], [64, 128, 1200], [-64, 128, 1200], [96, 96, 1000], [-96, 96, 1000]]);
        (CoreEngine.val_arr_arr_int_f = [[32, 160, 900], [-32, 160, 900], [64, 128, 900], [-64, 128, 900], [96, 96, 900], [-96, 96, 900]]);
        (CoreEngine.val_arr_arr_int_g = [[32, 32, 550], [64, 32, 650], [96, 32, 620], [64, 64, 610], [96, 64, 580], [64, 96, 590]]);
        (CoreEngine.val_arr_int_aO = [17, -18, 0, -5, -17, 0, 6, -24, 0, 16, -35, 0, -4, -32, 0, 7, -44, 0, 13, -59, 100, -2, -56, 100, 26, -51, 100, -14, -50, 100, 21, -72, 200, 4, -73, 200, -11, -69, 200, 14, -86, 200, -3, -88, 200, 5, -101, 200, -18, -36, 200, 30, -36, 200]);
        (CoreEngine.val_arr_int_aP = [134217838, 134217759, 1, 134217760, 1, 134217761, 1, 134217762, 1, 134217763, 1, 134217764, 1, 134217765, 1, 134217766, 1]);
        (CoreEngine.val_arr_int_aQ = [134217827, 134217731, 1, 134217732, 1, 134217733, 1, 134217734, 1, 134217735, 1, 134217736, 1, 134217736, 1, 134217737, 1, 134217738, 1, 134217738, 1, 134217739, 1]);
    }
    static initStaticTables5() {
        (CoreEngine.isGlobalPaused = true);
        (CoreEngine.frameTimestampMs = 25);
        (CoreEngine.audioChannelCount = (((1) << 16) >> 16));
        (CoreEngine.val_arr_byte_m = []);
        (CoreEngine.val_int_en = -1);
        (CoreEngine.val_int_eo = -1);
        (CoreEngine.val_int_ep = -1);
        (CoreEngine.val_arr_string_a = ["a.mbf", "b.mbf", "c.mbf", "d.mbf", "e.mbf", "f.mbf", "g.mbf", "h.mbf", "i.mbf", "j.mbf", "k.mbf"]);
        (CoreEngine.val_arr_int_e = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]);
        (CoreEngine.val_arr_string_b = []);
        (CoreEngine.val_arr_byte_o = [(((43) << 24) >> 24), (((51) << 24) >> 24), (((28) << 24) >> 24), (((49) << 24) >> 24), (((32) << 24) >> 24), (((8) << 24) >> 24), (((46) << 24) >> 24)]);
        (CoreEngine.val_arr_int_aR = [167772171, 167772174, 167772169, 167772173, 167772170, 167772166, 167772172]);
        (CoreEngine.val_arr_int_aS = [39, 16777255, 33554472, 67108903, 50331688, 83886120, 100663317]);
        (CoreEngine.val_arr_int_aT = [37, 16777253, 33554470, 67108901, 50331686, 83886118, 100663314]);
        (CoreEngine.val_arr_int_aU = [38, 16777254, 33554471, 67108902, 50331687, 83886119, 100663315]);
        (CoreEngine.val_arr_int_aV = [40, 16777256, 33554473, 67108904, 50331689, 83886121, -1]);
        (CoreEngine.val_arr_int_aW = [32, 16777248, 33554465, 67108896, 50331681, 83886113, -1]);
        (CoreEngine.val_arr_arr_int_h = [[0, 1, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 7, 1, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 1, 19, 0, 20, 0, 21, 0, 22, 1, 23, 1, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, -1, 0, -1, 0, 29, 0, 30, 1, 31, 0], [16777217, 1, 16777218, 0, 16777219, 0, 16777220, 0, 16777221, 0, 16777222, 0, 16777223, 1, 16777224, 1, 16777225, 0, 16777226, 0, 16777227, 0, 16777228, 0, 16777229, 0, 16777230, 0, 16777231, 0, 16777232, 0, 16777233, 0, 16777234, 0, 16777235, 1, 16777236, 0, 16777237, 0, 16777238, 0, 16777239, 1, 16777240, 1, 16777241, 0, 16777242, 0, 16777243, 0, -1, 0, 16777244, 0, -1, 0, -1, 0, 16777245, 0, 16777246, 1, 16777247, 0], [33554433, 1, 33554434, 0, 33554435, 0, 33554436, 0, 33554437, 0, 33554438, 0, 33554439, 1, 33554440, 1, 33554441, 0, 33554442, 0, 33554443, 0, 33554444, 0, 33554445, 0, 33554446, 0, 33554447, 0, 33554448, 0, 33554449, 0, 33554450, 0, 33554451, 1, 33554452, 0, 33554453, 0, 33554454, 0, 33554455, 1, 33554456, 1, 33554457, 0, 33554458, 0, 33554459, 1, 33554460, 0, 33554461, 0, -1, 0, -1, 0, 33554462, 0, 33554463, 1, 33554464, 0], [67108865, 1, 67108866, 0, 67108867, 0, 67108868, 0, 67108869, 0, 67108870, 0, 67108871, 1, 67108872, 1, 67108873, 0, 67108874, 0, 67108875, 0, 67108876, 0, 67108877, 0, 67108878, 0, 67108879, 0, 67108880, 0, 67108881, 0, 67108882, 0, 67108883, 1, 67108884, 0, 67108885, 0, 67108886, 0, 67108887, 1, 67108888, 1, 67108889, 0, 67108890, 0, 67108891, 0, -1, 0, 67108892, 0, -1, 0, -1, 0, 67108893, 0, 67108894, 1, 67108895, 0], [50331649, 1, 50331650, 0, 50331651, 0, 50331652, 0, 50331653, 0, 50331654, 0, 50331655, 1, 50331656, 1, 50331657, 0, 50331658, 0, 50331659, 0, 50331660, 0, 50331661, 0, 50331662, 0, 50331663, 0, 50331664, 0, 50331665, 0, 50331666, 0, 50331667, 1, 50331668, 0, 50331669, 0, 50331670, 0, 50331671, 1, 50331672, 1, 50331673, 0, 50331674, 0, 50331675, 0, 50331676, 0, 50331677, 0, -1, 0, -1, 0, 50331678, 0, 50331679, 1, 50331680, 0], [83886081, 1, 83886082, 0, 83886083, 0, 83886084, 0, 83886085, 0, 83886086, 0, 83886087, 1, 83886088, 1, 83886089, 0, 83886090, 0, 83886091, 0, 83886092, 0, 83886093, 0, 83886094, 0, 83886095, 0, 83886096, 0, 83886097, 0, 83886098, 0, 83886099, 1, 83886100, 0, 83886101, 0, 83886102, 0, 83886103, 1, 83886104, 1, 83886105, 0, 83886106, 0, 83886107, 0, 83886107, 0, 83886108, 0, 83886109, 1, -1, 0, 83886110, 0, 83886111, 1, 83886112, 0], [100663297, 1, 100663298, 0, 100663299, 0, 100663299, 0, 100663297, 1, 100663298, 0, 100663300, 1, 100663300, 1, 100663301, 0, 100663302, 0, 100663303, 0, -1, -1, -1, -1, -1, -1, 100663304, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 100663305, 0, 100663297, 1, 100663306, 1, -1, -1, -1, -1, 100663307, 0, 100663307, 0, -1, -1, -1, -1, -1, 0, 100663308, 0, 100663309, 1, 100663310, 0]]);
        (CoreEngine.val_arr_arr_short_c = [[(((-55) << 16) >> 16), (((3) << 16) >> 16), (((49) << 16) >> 16), (((-20) << 16) >> 16)], [(((-60) << 16) >> 16), (((36) << 16) >> 16), (((74) << 16) >> 16), (((-27) << 16) >> 16)], [(((-70) << 16) >> 16), (((15) << 16) >> 16), (((60) << 16) >> 16), (((-30) << 16) >> 16)], [(((-72) << 16) >> 16), (((13) << 16) >> 16), (((72) << 16) >> 16), (((-37) << 16) >> 16)], [(((-87) << 16) >> 16), (((11) << 16) >> 16), (((53) << 16) >> 16), (((-45) << 16) >> 16)], [(((-80) << 16) >> 16), (((23) << 16) >> 16), (((78) << 16) >> 16), (((-34) << 16) >> 16)], [(((-70) << 16) >> 16), (((-8) << 16) >> 16), (((45) << 16) >> 16), (((-10) << 16) >> 16)]]);
        (CoreEngine.val_arr_arr_short_d = [[(((-20) << 16) >> 16), (((40) << 16) >> 16), (((80) << 16) >> 16), (((0) << 16) >> 16)], [(((-15) << 16) >> 16), (((30) << 16) >> 16), (((75) << 16) >> 16), (((0) << 16) >> 16)], [(((-18) << 16) >> 16), (((44) << 16) >> 16), (((73) << 16) >> 16), (((0) << 16) >> 16)], [(((-22) << 16) >> 16), (((44) << 16) >> 16), (((85) << 16) >> 16), (((0) << 16) >> 16)], [(((-14) << 16) >> 16), (((31) << 16) >> 16), (((73) << 16) >> 16), (((0) << 16) >> 16)], [(((-17) << 16) >> 16), (((36) << 16) >> 16), (((77) << 16) >> 16), (((0) << 16) >> 16)], [(((-50) << 16) >> 16), (((12) << 16) >> 16), (((45) << 16) >> 16), (((-10) << 16) >> 16)]]);
        (CoreEngine.val_arr_arr_short_e = [[(((-90) << 16) >> 16), (((10) << 16) >> 16), (((52) << 16) >> 16), (((-70) << 16) >> 16)], [(((-100) << 16) >> 16), (((10) << 16) >> 16), (((58) << 16) >> 16), (((-80) << 16) >> 16)], [(((-90) << 16) >> 16), (((10) << 16) >> 16), (((68) << 16) >> 16), (((-70) << 16) >> 16)], [(((-90) << 16) >> 16), (((10) << 16) >> 16), (((47) << 16) >> 16), (((-70) << 16) >> 16)], [(((-90) << 16) >> 16), (((10) << 16) >> 16), (((47) << 16) >> 16), (((-70) << 16) >> 16)], [(((-90) << 16) >> 16), (((10) << 16) >> 16), (((47) << 16) >> 16), (((-70) << 16) >> 16)], [(((-105) << 16) >> 16), (((10) << 16) >> 16), (((72) << 16) >> 16), (((-85) << 16) >> 16)]]);
        (CoreEngine.val_arr_arr_short_f = [[(((-75) << 16) >> 16), (((10) << 16) >> 16), (((47) << 16) >> 16), (((-55) << 16) >> 16)], [(((-75) << 16) >> 16), (((10) << 16) >> 16), (((46) << 16) >> 16), (((-55) << 16) >> 16)], [(((-75) << 16) >> 16), (((10) << 16) >> 16), (((59) << 16) >> 16), (((-55) << 16) >> 16)], [(((-75) << 16) >> 16), (((10) << 16) >> 16), (((62) << 16) >> 16), (((-55) << 16) >> 16)], [(((-75) << 16) >> 16), (((10) << 16) >> 16), (((53) << 16) >> 16), (((-55) << 16) >> 16)], [(((-75) << 16) >> 16), (((10) << 16) >> 16), (((62) << 16) >> 16), (((-55) << 16) >> 16)], [(((-75) << 16) >> 16), (((10) << 16) >> 16), (((77) << 16) >> 16), (((-55) << 16) >> 16)]]);
        (CoreEngine.val_arr_int_aX = [750, 1000, 32, 16, 260, 49, 0, 0, 0, 0, 57, 0, 17, 0, 0, 51, 3, 17, 0, 0, 21, -1, 4, 0, 0, 16, -7, 5, 0, 0, 78, -48, 17, 0, 3, -19, -140, 3, 0, 2, -76, -62, 8, 0, 0]);
        (CoreEngine.val_arr_int_aY = [600, 1000, 92, 32, 400, 47, 0, 0, 0, 0, 39, -12, 2, 0, 0, 49, -30, 17, 0, 0, 27, -12, 3, 0, 0, -7, -31, 9, 0, 0, -41, -40, 8, 0, 0, -58, -48, 8, 0, 0, -52, -50, 9, 0, 0]);
        (CoreEngine.val_arr_int_aZ = [580, 1200, 48, 92, 800, 48, 1, 0, 0, 0, 37, 0, 3, 0, 0, 14, -171, 3, 0, 2, -36, -80, 9, 0, 0, -55, -37, 8, 0, 0, -43, 0, 8, 0, 0]);
    }
    static initStaticTables6() {
        (CoreEngine.val_arr_int_ba = [530, 1000, 64, 16, 350, 33, 0, 0, 0, 0, 17, -1, 4, 0, 0, 78, -48, 3, 0, 3, 62, -38, 3, 0, 3, -26, -132, 3, 0, 2, -76, -52, 8, 0, 0]);
        (CoreEngine.val_arr_int_bb = [580, 1000, 64, 16, 350, 37, 0, 0, 0, 0, 25, 0, 4, 0, 0, 25, -8, 5, 0, 0, 5, -3, 5, 0, 0, 59, -36, 3, 0, 3, -27, -109, 3, 0, 2, -73, -32, 8, 0, 0]);
        (CoreEngine.val_arr_int_bc = [850, 1000, -112, 86, 650, 32, -1, 0, 0, 0, 22, 0, 0, 0, 0, 64, -51, 3, 0, 3, -14, -110, 3, 0, 2, -8, 0, 8, 0, 0, 0, 0, 8, 0, 0]);
        (CoreEngine.val_arr_int_bd = [2, 3, 4, 6, 8, 7, 5]);
        (CoreEngine.val_arr_int_be = [80, 79, 82, 83, 81, 84, 80]);
        (CoreEngine.val_arr_int_bf = [74, 73, 76, 77, 75, 78, 74]);
        (CoreEngine.val_arr_arr_byte_e = [[(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((9) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((7) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_f = [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((13) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((10) << 24) >> 24), (((8) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_g = [[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((21) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((21) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_h = [[(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((17) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_i = [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((10) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((14) << 24) >> 24), (((8) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_j = [[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((17) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((14) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_k = [[(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((11) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((15) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_l = [[(((0) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((11) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((11) << 24) >> 24), (((8) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_m = [[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((25) << 24) >> 24), (((11) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((9) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((12) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_n = [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((5) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((5) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_o = [[(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((5) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((8) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_p = [[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((5) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((14) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_q = [[(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((9) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_r = [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((9) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_s = [[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((9) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_t = [[(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((14) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_u = [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_byte_v = [[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((12) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_arr_arr_byte_a = [[[[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((21) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((21) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]], [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((13) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((10) << 24) >> 24), (((8) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]], [[(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((9) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((7) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]]], [[[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((17) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((14) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]], [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((10) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((14) << 24) >> 24), (((8) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]], [[(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((17) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]], [[[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((25) << 24) >> 24), (((11) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((9) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((12) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]], [[(((0) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((11) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((11) << 24) >> 24), (((8) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]], [[(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((11) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((10) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((15) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]], [[[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((5) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((14) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]], [[(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((5) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((8) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]], [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((5) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((5) << 24) >> 24), (((4) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]], [[[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((12) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]], [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]], [[(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((14) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((25) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]], [[[(((7) << 24) >> 24), (((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((9) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((15) << 24) >> 24), (((15) << 24) >> 24), (((6) << 24) >> 24), (((1) << 24) >> 24), (((2) << 24) >> 24)]], [[(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((5) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((14) << 24) >> 24), (((16) << 24) >> 24), (((9) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]], [[(((0) << 24) >> 24)], [(((25) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((0) << 24) >> 24)], [(((10) << 24) >> 24), (((9) << 24) >> 24), (((6) << 24) >> 24), (((0) << 24) >> 24), (((1) << 24) >> 24)], [(((1) << 24) >> 24)], [(((24) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((2) << 24) >> 24), (((1) << 24) >> 24)]]], null]);
    }
    static initStaticTables7() {
        (CoreEngine.val_arr_arr_int_i = [[750, 1000, 32, 16, 260, 49, 0, 0, 0, 0, 57, 0, 17, 0, 0, 51, 3, 17, 0, 0, 21, -1, 4, 0, 0, 16, -7, 5, 0, 0, 78, -48, 17, 0, 3, -19, -140, 3, 0, 2, -76, -62, 8, 0, 0], [600, 1000, 92, 32, 400, 47, 0, 0, 0, 0, 39, -12, 2, 0, 0, 49, -30, 17, 0, 0, 27, -12, 3, 0, 0, -7, -31, 9, 0, 0, -41, -40, 8, 0, 0, -58, -48, 8, 0, 0, -52, -50, 9, 0, 0], [580, 1200, 48, 92, 800, 48, 1, 0, 0, 0, 37, 0, 3, 0, 0, 14, -171, 3, 0, 2, -36, -80, 9, 0, 0, -55, -37, 8, 0, 0, -43, 0, 8, 0, 0], [530, 1000, 64, 16, 350, 33, 0, 0, 0, 0, 17, -1, 4, 0, 0, 78, -48, 3, 0, 3, 62, -38, 3, 0, 3, -26, -132, 3, 0, 2, -76, -52, 8, 0, 0], [580, 1000, 64, 16, 350, 37, 0, 0, 0, 0, 25, 0, 4, 0, 0, 25, -8, 5, 0, 0, 5, -3, 5, 0, 0, 59, -36, 3, 0, 3, -27, -109, 3, 0, 2, -73, -32, 8, 0, 0], [850, 1000, -112, 86, 650, 32, -1, 0, 0, 0, 22, 0, 0, 0, 0, 64, -51, 3, 0, 3, -14, -110, 3, 0, 2, -8, 0, 8, 0, 0, 0, 0, 8, 0, 0], null]);
        (CoreEngine.val_arr_arr_arr_byte_b = [[[(((9) << 24) >> 24), (((9) << 24) >> 24), (((0) << 24) >> 24)], [(((8) << 24) >> 24), (((9) << 24) >> 24), (((0) << 24) >> 24)], [(((8) << 24) >> 24), (((8) << 24) >> 24), (((7) << 24) >> 24), (((1) << 24) >> 24)], [(((8) << 24) >> 24), (((8) << 24) >> 24), (((1) << 24) >> 24)]], [[(((8) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24)], [(((9) << 24) >> 24), (((9) << 24) >> 24), (((1) << 24) >> 24)], [(((9) << 24) >> 24), (((9) << 24) >> 24), (((9) << 24) >> 24), (((0) << 24) >> 24)], [(((8) << 24) >> 24), (((8) << 24) >> 24), (((1) << 24) >> 24)]], [[(((7) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24)], [(((9) << 24) >> 24), (((9) << 24) >> 24), (((9) << 24) >> 24), (((0) << 24) >> 24)], [(((7) << 24) >> 24), (((7) << 24) >> 24), (((7) << 24) >> 24), (((1) << 24) >> 24)], [(((8) << 24) >> 24), (((8) << 24) >> 24), (((1) << 24) >> 24)]], [[(((7) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24)], [(((7) << 24) >> 24), (((9) << 24) >> 24), (((0) << 24) >> 24)], [(((7) << 24) >> 24), (((7) << 24) >> 24), (((7) << 24) >> 24), (((1) << 24) >> 24)], [(((8) << 24) >> 24), (((8) << 24) >> 24), (((1) << 24) >> 24)]], [[(((7) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24)], [(((7) << 24) >> 24), (((7) << 24) >> 24), (((1) << 24) >> 24)], [(((7) << 24) >> 24), (((7) << 24) >> 24), (((7) << 24) >> 24), (((1) << 24) >> 24)], [(((8) << 24) >> 24), (((8) << 24) >> 24), (((1) << 24) >> 24)]], [[(((9) << 24) >> 24), (((9) << 24) >> 24), (((1) << 24) >> 24)], [(((7) << 24) >> 24), (((9) << 24) >> 24), (((0) << 24) >> 24)], [(((7) << 24) >> 24), (((7) << 24) >> 24), (((7) << 24) >> 24), (((1) << 24) >> 24)], [(((8) << 24) >> 24), (((8) << 24) >> 24), (((1) << 24) >> 24)]], [[(((7) << 24) >> 24), (((7) << 24) >> 24), (((0) << 24) >> 24)], [(((7) << 24) >> 24), (((7) << 24) >> 24), (((1) << 24) >> 24)], null, null]]);
        (CoreEngine.val_arr_arr_byte_w = [[(((3) << 24) >> 24)], [(((9) << 24) >> 24), (((3) << 24) >> 24)], [(((3) << 24) >> 24)], [(((9) << 24) >> 24), (((3) << 24) >> 24)]]);
        (CoreEngine.val_arr_arr_short_g = [[(((0) << 16) >> 16), (((16) << 16) >> 16), (((-86) << 16) >> 16), (((50) << 16) >> 16)], [(((1) << 16) >> 16), (((34) << 16) >> 16), (((-66) << 16) >> 16), (((150) << 16) >> 16)], [(((2) << 16) >> 16), (((24) << 16) >> 16), (((-66) << 16) >> 16), (((200) << 16) >> 16)], [(((5) << 16) >> 16), (((42) << 16) >> 16), (((-69) << 16) >> 16), (((100) << 16) >> 16)], [(((4) << 16) >> 16), (((14) << 16) >> 16), (((-86) << 16) >> 16), (((170) << 16) >> 16)], [(((3) << 16) >> 16), (((8) << 16) >> 16), (((-76) << 16) >> 16), (((0) << 16) >> 16)], [(((6) << 16) >> 16), (((16) << 16) >> 16), (((-96) << 16) >> 16), (((280) << 16) >> 16)]]);
        (CoreEngine.val_arr_arr_short_h = [null, null, [(((2) << 16) >> 16), (((26) << 16) >> 16), (((-80) << 16) >> 16), (((100) << 16) >> 16)], null, [(((4) << 16) >> 16), (((46) << 16) >> 16), (((-110) << 16) >> 16), (((0) << 16) >> 16)], null, null]);
        (CoreEngine.val_arr_short_i = [(((-48) << 16) >> 16), (((-24) << 16) >> 16), (((24) << 16) >> 16), (((0) << 16) >> 16)]);
        (CoreEngine.val_arr_short_j = [(((-48) << 16) >> 16), (((-48) << 16) >> 16), (((32) << 16) >> 16), (((0) << 16) >> 16)]);
        (CoreEngine.val_arr_short_k = [(((-88) << 16) >> 16), (((-48) << 16) >> 16), (((32) << 16) >> 16), (((-48) << 16) >> 16)]);
        (CoreEngine.val_arr_short_l = [(((-80) << 16) >> 16), (((-22) << 16) >> 16), (((22) << 16) >> 16), (((0) << 16) >> 16)]);
        (CoreEngine.val_arr_short_m = [(((-94) << 16) >> 16), (((-24) << 16) >> 16), (((24) << 16) >> 16), (((-49) << 16) >> 16)]);
        (CoreEngine.val_arr_short_n = [(((-96) << 16) >> 16), (((-22) << 16) >> 16), (((22) << 16) >> 16), (((0) << 16) >> 16)]);
        (CoreEngine.val_arr_short_o = [(((-120) << 16) >> 16), (((8) << 16) >> 16), (((48) << 16) >> 16), (((-64) << 16) >> 16)]);
        (CoreEngine.val_arr_short_p = [(((-16) << 16) >> 16), (((16) << 16) >> 16), (((64) << 16) >> 16), (((0) << 16) >> 16)]);
        (CoreEngine.val_arr_short_q = [(((-90) << 16) >> 16), (((16) << 16) >> 16), (((48) << 16) >> 16), (((-20) << 16) >> 16)]);
        (CoreEngine.val_arr_short_r = [(((-100) << 16) >> 16), (((32) << 16) >> 16), (((70) << 16) >> 16), (((-70) << 16) >> 16)]);
        (CoreEngine.val_arr_short_s = [(((-160) << 16) >> 16), (((-16) << 16) >> 16), (((80) << 16) >> 16), (((-60) << 16) >> 16)]);
        (CoreEngine.val_arr_short_t = [(((-120) << 16) >> 16), (((8) << 16) >> 16), (((48) << 16) >> 16), (((-12) << 16) >> 16)]);
        (CoreEngine.val_arr_short_u = [(((32) << 16) >> 16), (((32) << 16) >> 16), (((400) << 16) >> 16)]);
        (CoreEngine.val_arr_short_v = [(((92) << 16) >> 16), (((92) << 16) >> 16), (((800) << 16) >> 16)]);
        (CoreEngine.val_arr_short_w = [(((64) << 16) >> 16), (((128) << 16) >> 16), (((1000) << 16) >> 16)]);
        (CoreEngine.val_arr_short_x = [(((70) << 16) >> 16), (((245) << 16) >> 16), (((1600) << 16) >> 16)]);
        (CoreEngine.val_arr_short_y = [(((32) << 16) >> 16), (((32) << 16) >> 16), (((400) << 16) >> 16)]);
        (CoreEngine.val_arr_short_z = [(((64) << 16) >> 16), (((92) << 16) >> 16), (((700) << 16) >> 16)]);
        (CoreEngine.val_arr_short_A = [(((64) << 16) >> 16), (((128) << 16) >> 16), (((1000) << 16) >> 16)]);
        (CoreEngine.val_arr_short_B = [(((96) << 16) >> 16), (((64) << 16) >> 16), (((600) << 16) >> 16)]);
    }
    static initStaticTables8() {
        (CoreEngine.val_arr_short_C = [(((130) << 16) >> 16), (((72) << 16) >> 16), (((730) << 16) >> 16)]);
        (CoreEngine.val_arr_short_D = [(((64) << 16) >> 16), (((32) << 16) >> 16), (((400) << 16) >> 16)]);
        (CoreEngine.val_arr_short_E = [(((-80) << 16) >> 16), (((-16) << 16) >> 16), (((68) << 16) >> 16), (((-50) << 16) >> 16)]);
        (CoreEngine.val_arr_short_F = [(((-110) << 16) >> 16), (((10) << 16) >> 16), (((55) << 16) >> 16), (((-10) << 16) >> 16)]);
        (CoreEngine.val_arr_arr_byte_x = [[(((2) << 24) >> 24), (((6) << 24) >> 24), (((39) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((24) << 24) >> 24), (((25) << 24) >> 24), (((45) << 24) >> 24), (((44) << 24) >> 24), (((6) << 24) >> 24), (((-1) << 24) >> 24), (((39) << 24) >> 24), (((6) << 24) >> 24), (((12) << 24) >> 24), (((9) << 24) >> 24)], [(((2) << 24) >> 24), (((6) << 24) >> 24), (((39) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((24) << 24) >> 24), (((25) << 24) >> 24), (((52) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((2) << 24) >> 24), (((6) << 24) >> 24), (((-1) << 24) >> 24), (((12) << 24) >> 24), (((9) << 24) >> 24)], [(((1) << 24) >> 24), (((6) << 24) >> 24), (((39) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((20) << 24) >> 24), (((21) << 24) >> 24), (((31) << 24) >> 24), (((29) << 24) >> 24), (((6) << 24) >> 24), (((30) << 24) >> 24), (((-1) << 24) >> 24), (((6) << 24) >> 24), (((11) << 24) >> 24), (((20) << 24) >> 24)], [(((1) << 24) >> 24), (((6) << 24) >> 24), (((39) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((20) << 24) >> 24), (((21) << 24) >> 24), (((50) << 24) >> 24), (((-1) << 24) >> 24), (((6) << 24) >> 24), (((-1) << 24) >> 24), (((34) << 24) >> 24), (((6) << 24) >> 24), (((11) << 24) >> 24), (((20) << 24) >> 24)], [(((3) << 24) >> 24), (((6) << 24) >> 24), (((39) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((22) << 24) >> 24), (((23) << 24) >> 24), (((35) << 24) >> 24), (((34) << 24) >> 24), (((34) << 24) >> 24), (((36) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((33) << 24) >> 24), (((23) << 24) >> 24)], [(((0) << 24) >> 24), (((6) << 24) >> 24), (((39) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((18) << 24) >> 24), (((19) << 24) >> 24), (((10) << 24) >> 24), (((-1) << 24) >> 24), (((6) << 24) >> 24), (((34) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((12) << 24) >> 24), (((19) << 24) >> 24)], [(((4) << 24) >> 24), (((6) << 24) >> 24), (((39) << 24) >> 24), (((-1) << 24) >> 24), (((-1) << 24) >> 24), (((26) << 24) >> 24), (((27) << 24) >> 24), (((4) << 24) >> 24), (((48) << 24) >> 24), (((6) << 24) >> 24), (((4) << 24) >> 24), (((-1) << 24) >> 24), (((6) << 24) >> 24), (((47) << 24) >> 24), (((9) << 24) >> 24)]]);
        (CoreEngine.val_arr_int_bg = [1500, 1500, 1000, 800, 900, 800, 900]);
        (CoreEngine.val_arr_int_bi = [134217831, 134217828, 134217829, 134217833, 134217830, 134217832, 134217834]);
        (CoreEngine.val_arr_arr_int_j = [[134217746, 0, 134217745, 0], [134217740, 0, 134217741, 0, 134217742, 0], [134217743, 1, 134217743, 1], [134217750, 1, 134217751, 0, 134217753, 0, 134217752, 1], [134217744, 0, 134217744, 0, 134217744, 0], [134217747, 1, 134217748, 0, 134217749, 0], [134217754, 1, 134217754, 0]]);
        (CoreEngine.val_arr_arr_short_a = [[(((-5) << 16) >> 16), (((-32) << 16) >> 16), (((0) << 16) >> 16), (((5) << 16) >> 16)], [(((-11) << 16) >> 16), (((15) << 16) >> 16), (((64) << 16) >> 16), (((11) << 16) >> 16)], [(((-19) << 16) >> 16), (((-19) << 16) >> 16), (((18) << 16) >> 16), (((18) << 16) >> 16)], [(((-37) << 16) >> 16), (((0) << 16) >> 16), (((40) << 16) >> 16), (((59) << 16) >> 16)], [(((-9) << 16) >> 16), (((0) << 16) >> 16), (((88) << 16) >> 16), (((9) << 16) >> 16)], [(((-16) << 16) >> 16), (((-16) << 16) >> 16), (((14) << 16) >> 16), (((16) << 16) >> 16)], [(((-26) << 16) >> 16), (((-28) << 16) >> 16), (((25) << 16) >> 16), (((21) << 16) >> 16)]]);
        (CoreEngine.val_arr_arr_short_b = [[(((-5) << 16) >> 16), (((-32) << 16) >> 16), (((0) << 16) >> 16), (((5) << 16) >> 16)], [(((-11) << 16) >> 16), (((15) << 16) >> 16), (((44) << 16) >> 16), (((11) << 16) >> 16)], [(((-19) << 16) >> 16), (((-19) << 16) >> 16), (((18) << 16) >> 16), (((18) << 16) >> 16)], [(((-37) << 16) >> 16), (((0) << 16) >> 16), (((40) << 16) >> 16), (((59) << 16) >> 16)], [(((-9) << 16) >> 16), (((0) << 16) >> 16), (((44) << 16) >> 16), (((9) << 16) >> 16)], [(((-16) << 16) >> 16), (((-16) << 16) >> 16), (((14) << 16) >> 16), (((16) << 16) >> 16)], [(((-26) << 16) >> 16), (((-28) << 16) >> 16), (((25) << 16) >> 16), (((21) << 16) >> 16)]]);
        (CoreEngine.val_arr_int_bj = [5, 0, 15, 0, 15, 18, 25]);
        (CoreEngine.val_arr_long_a = [0, 1, 2, 3, 4, 5, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 28, 29, 30, 31, 32, 32, 33, 34, 35, 35, 36, 37, 37, 38, 39, 39, 40, 40, 41, 41, 42, 42, 43, 43, 44, 44, 44, 45, 45, 45, 45, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 45, 45, 45, 44, 44, 44, 43, 43, 43, 42, 42, 41, 41, 40, 39, 39, 38, 38, 37, 36, 35, 35, 34, 33, 32, 31, 31, 30, 29, 28, 27, 26, 25, 24, 23, 22, 21, 19, 18, 17, 16, 15, 14, 12, 11, 10, 8, 7, 6, 4, 3, 1, 0]);
        (CoreEngine.val_int_eB = -1);
        (CoreEngine.val_int_eJ = -1);
        (CoreEngine.val_arr_int_bs = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
        (CoreEngine.val_arr_arr_int_k = [[20496, 65536, 0, 0, 256, 513, 1024, 8200, 32770, 2052, 0], [20496, 65536, 0, 0, 1024, 513, 256, 2052, 32770, 8200, 0], [0, 0, 4112, 16384, 256, 513, 1024, 8200, 32770, 2052, 0], [0, 0, 4112, 16384, 1024, 513, 256, 2052, 32770, 8200, 0]]);
        (CoreEngine.val_arr_arr_arr_byte_c = [[[(((7) << 24) >> 24), (((7) << 24) >> 24)], [(((0) << 24) >> 24)], [(((1) << 24) >> 24)], [(((9) << 24) >> 24), (((1) << 24) >> 24)], [(((7) << 24) >> 24), (((0) << 24) >> 24)], [(((9) << 24) >> 24), (((9) << 24) >> 24), (((9) << 24) >> 24)]], [[(((7) << 24) >> 24), (((7) << 24) >> 24)], [(((2) << 24) >> 24)], [(((7) << 24) >> 24), (((2) << 24) >> 24)], [(((9) << 24) >> 24), (((2) << 24) >> 24)], [(((3) << 24) >> 24)], [(((9) << 24) >> 24), (((9) << 24) >> 24), (((9) << 24) >> 24)]]]);
        (CoreEngine.val_arr_arr_byte_z = [[(((7) << 24) >> 24), (((7) << 24) >> 24), (((9) << 24) >> 24), (((9) << 24) >> 24)], [(((9) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24), (((7) << 24) >> 24)], [(((5) << 24) >> 24), (((8) << 24) >> 24), (((5) << 24) >> 24), (((8) << 24) >> 24)], [(((6) << 24) >> 24), (((5) << 24) >> 24), (((4) << 24) >> 24)], [(((4) << 24) >> 24), (((5) << 24) >> 24), (((6) << 24) >> 24)], [(((5) << 24) >> 24), (((8) << 24) >> 24), (((9) << 24) >> 24), (((7) << 24) >> 24)], [(((8) << 24) >> 24), (((8) << 24) >> 24), (((5) << 24) >> 24), (((5) << 24) >> 24)], [(((9) << 24) >> 24), (((9) << 24) >> 24), (((9) << 24) >> 24), (((9) << 24) >> 24)], [(((5) << 24) >> 24), (((5) << 24) >> 24), (((7) << 24) >> 24), (((7) << 24) >> 24)], [(((5) << 24) >> 24), (((5) << 24) >> 24), (((9) << 24) >> 24), (((9) << 24) >> 24)], [(((4) << 24) >> 24), (((4) << 24) >> 24), (((6) << 24) >> 24), (((6) << 24) >> 24)]]);
        (CoreEngine.val_arr_string_e = ["INSTANT KILL P1", "INSTANT KILL P2", "FINISH EXTENSION", "GODMODE P1", "GODMODE P2", "INSTANT TIMEOVER", "A.I.", "SCORE BONUS", "CHANGE P1", "CHANGE P2", "CHANGE ARENA"]);
        (CoreEngine.val_byte_a = (((8) << 24) >> 24));
        (CoreEngine.val_byte_b = (((14) << 24) >> 24));
        (CoreEngine.val_arr_byte_a = [(((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24), (((0) << 24) >> 24)]);
    }
}
globalThis.CoreEngine = CoreEngine;
globalThis.CoreEngine = CoreEngine;


export class MainCanvasBridge extends FullCanvas {
    isDisplayActive = false;
    canvasWidth = 0;
    renderContext = CoreEngine.val_rendercontext_a;
    hideNotify() {
        CoreEngine.exec_a_gamemidletloop_to_void(CoreEngine.val_gamemidletloop_b);
        (CoreEngine.val_gamemidletloop_b.val_bool_h = true);
    }
    showNotify() {
        CoreEngine.val_gamemidletloop_b.stopGameLoop();
        CoreEngine.exec_a_short_short_short_gamemidletloop_to_void((((7) << 16) >> 16), (((0) << 16) >> 16), (((0) << 16) >> 16), CoreEngine.val_gamemidletloop_b);
    }
    sizeChanged(var1, var2) {

    }
    keyPressed(var1) {
        CoreEngine.exec_a_short_short_short_gamemidletloop_to_void((((1) << 16) >> 16), ((((var1 >> 16)) << 16) >> 16), (((var1) << 16) >> 16), CoreEngine.val_gamemidletloop_b);
    }
    keyReleased(var1) {
        CoreEngine.exec_a_short_short_short_gamemidletloop_to_void((((2) << 16) >> 16), ((((var1 >> 16)) << 16) >> 16), (((var1) << 16) >> 16), CoreEngine.val_gamemidletloop_b);
    }
    paint(var1) {
        let var2 = CoreEngine.val_object_a;

        try {
            if (!this.isDisplayActive) {
                (this.isDisplayActive = true);
            }
            (this.renderContext.targetGraphics = var1);
            let var4 = CoreEngine.val_rendercontext_a;
            if ((CoreEngine.val_rendercontext_a.clipColor > 0)) {
                var4.clipColor--;
                let var5 = null;
                ((var5 = createArray(3, 0))[0] = 0);
                (var5[1] = 0);
                (var5[2] = 0);
                let var11 = CoreEngine.val_rendercontext_a.viewportCoords[0];
                let var10 = CoreEngine.val_rendercontext_a.viewportCoords[1];
                let var9 = CoreEngine.val_rendercontext_a.viewportCoords[2];
                let var3 = CoreEngine.val_rendercontext_a.viewportCoords[3];
                let var10000 = var4.targetGraphics.getColor();
                var4.targetGraphics.setColor(var5[0], var5[1], var5[2]);
                var4.targetGraphics.fillRect(var11, var10, var9, var3);
                (var11 = (var10000 & 16777215));
                var4.targetGraphics.setColor(var11);
            }
            let var13 = (CoreEngine.val_globalcontext_a.currentScene).inputManager;
            ((CoreEngine.val_globalcontext_a.currentScene).inputManager.graphicsAdapter.renderContext = var4);
            CoreEngine.exec_a_to_rootgamestate().flowController.renderFlow(var13.graphicsAdapter);
            (CoreEngine.val_globalcontext_a.currentScene.isScenePaused = false);
        } catch (var8) {
            console.error("[MainCanvasBridge.paint Error]:", var8);
        }
        (CoreEngine.isGlobalPaused = false);
        if (CoreEngine.val_gamemidletloop_b.val_bool_g) {
            (CoreEngine.isGlobalPaused = true);
            (CoreEngine.val_globalcontext_a.currentScene.isScenePaused = true);
            (CoreEngine.val_gamemidletloop_b.val_bool_g = false);
        }
    }
}
globalThis.MainCanvasBridge = MainCanvasBridge;
globalThis.MainCanvasBridge = MainCanvasBridge;


export class GameMidletLoop extends MIDlet {
    lastFrameTimeMs = Date.now();
    targetFrameTimeMs = -1;
    frameHistoryArray = createArray(8, 0);
    loopState = 0;
    isRunning = false;
    isPaused = false;
    isInitialized = false;
    isBackgrounded = false;
    isTerminated = false;
    gameVersionString = "";
    val_long_c = Date.now();
    isExitRequested = false;
    val_bool_g = false;
    val_bool_h = false;
    gameLoopThread = null;
    constructor() {
        super();
        (this.isPaused = true);
        (CoreEngine.val_gamemidletloop_a = this);
        (CoreEngine.val_gamemidletloop_b = this);
    }
    startApp() {
        this.stopGameLoop();
    }
    stopGameLoop() {
        if ((this.targetFrameTimeMs) !== (-1)) {
            (this.lastFrameTimeMs = (this.lastFrameTimeMs + (Date.now() - this.targetFrameTimeMs)));
            (this.targetFrameTimeMs = -1);
        }
        if (((this.gameLoopThread) === (null) && this.isPaused)) {
            (this.gameLoopThread = new Thread(this));
            let var1 = null;
            (var1 = new GlobalContext());
            (CoreEngine.val_globalcontext_a = var1);
            (var1.gameMidletLoop = this);
            (CoreEngine.val_rendercontext_a = new RenderContext(CoreEngine.exec_b_to_arr_int()));
            (CoreEngine.val_scenebase_a = new RootGameState());
            this.gameLoopThread.start();
        } else {
            if ((this.isInitialized || this.isRunning)) {
                CoreEngine.exec_a_short_short_short_gamemidletloop_to_void((((6) << 16) >> 16), (((0) << 16) >> 16), (((0) << 16) >> 16), this);
            }
        }
    }
    pauseApp() {
        CoreEngine.exec_a_gamemidletloop_to_void(this);
    }
    destroyApp(var1) {
        if (!this.isExitRequested) {
            (this.isExitRequested = true);
        }
    }
        initLoop() {
        if (!CoreEngine.val_maincanvasbridge_a) {
            CoreEngine.val_maincanvasbridge_a = new MainCanvasBridge();
        }
        CoreEngine.isGlobalPaused = false;
        Display.getDisplay(this).setCurrent(CoreEngine.val_maincanvasbridge_a);
        this.isPaused = false;
        this.lastFrameTimeMs = Date.now();
    }
    run() {
        this.initLoop();
    }
    stepFrame() {
        if (this.isExitRequested) {
            return;
        }
        if (!CoreEngine.val_maincanvasbridge_a) {
            this.initLoop();
        }
        let var1 = Date.now();

        try {
            while ((this.loopState > 0)) {
                let var9 = this.frameHistoryArray;

                let var3 = 0;
                let var4 = 0;
                try {
                    let var37 = this.frameHistoryArray;
                    let entry = BigInt(this.frameHistoryArray[0]);
                    (var3 = Number((entry >> 48n) & 0xFFFFn));
                    if (var3 > 32767) var3 -= 65536;
                    let hi = Number((entry >> 32n) & 0xFFFFn);
                    let lo = Number((entry >> 16n) & 0xFFFFn);
                    (var4 = (hi << 16) | lo);
                    if ((this.loopState > 1)) {
                        for (let var5 = 0; (var5 < 7); var5++) {
                            (var37[var5] = var37[(var5 + 1)]);
                        }
                    }
                    this.loopState--;
                } catch (var20) {
                    console.error("[GameMidletLoop] Error popping frame history:", var20);
                    break;
                }
                switch (var3) {
                    case 1:
                        CoreEngine.exec_f_int_to_void(var4);
                        break;
                    case 2:
                        CoreEngine.exec_i_int_to_void(var4);
                        break;
                    case 3:
                        if ((CoreEngine.val_scenebase_a.sceneStateId) !== (var4)) {
                            CoreEngine.exec_a_int_bool_scenebase_to_void(var4, false, CoreEngine.val_scenebase_a);
                        }
                        break;
                    case 4:
                        CoreEngine.exec_a_int_bool_scenebase_to_void(var4, true, CoreEngine.val_scenebase_a);
                        break;
                    case 5:
                        (this.isInitialized = false);
                        (this.isRunning = true);
                        let var42 = CoreEngine.val_globalcontext_a.currentScene;
                        if (CoreEngine.val_globalcontext_a.currentScene.isSceneVisible) {
                            (var42.isSceneVisible = false);
                            (var42.isScenePaused = true);
                            for (let var33 = 0; (var33 < 33); var33++) {
                                CoreEngine.exec_a_int_bool_scenebase_to_void(var42.sceneExtraShorts[var33], true, var42);
                            }
                        }
                        (var42 = CoreEngine.val_globalcontext_a.currentScene);
                        if (!CoreEngine.val_globalcontext_a.currentScene.isSceneActive) {
                            (var42.isSceneActive = true);
                            (var42.sceneTimers[1] = Date.now());
                            let root42 = (var42);
                            if (!root42.isLoaded) {
                                root42.flowController.pauseFlow();
                                (root42.isLoaded = true);
                            }
                        }
                        break;
                    case 6:
                        (this.val_long_c = Date.now());
                        if (this.isRunning) {
                            let var39 = CoreEngine.val_globalcontext_a.currentScene;
                            if (!CoreEngine.val_globalcontext_a.currentScene.isSceneVisible) {
                                (var39.isSceneVisible = true);
                                (var39.isScenePaused = true);
                            }
                            (var39 = CoreEngine.val_globalcontext_a.currentScene);
                            if (CoreEngine.val_globalcontext_a.currentScene.isSceneActive) {
                                (var39.isSceneActive = false);
                                let var10000 = var39.sceneTimers;
                                let var6 = (var39.sceneTimers[0] + (Date.now() - var39.sceneTimers[1]));
                                (var10000[0] = var6);
                                (var39.sceneTimers[1] = 0);
                                let root39 = (var39);
                                if (root39.isLoaded) {
                                    (root39.gameTimer = (root39.gameTimer + (Date.now() - root39.lastUpdateTimestamp)));
                                    let var32 = 0;
                                    ((var32 = CoreEngine.exec_a_to_rootgamestate().inputManager).activeKeyBitmask = 0);
                                    (var32.pressedKeyBitmask = 0);
                                    (var32.releasedKeyBitmask = 0);
                                    (var32.repeatedKeyBitmask = 0);
                                    (root39.isLoaded = false);
                                    root39.flowController.resumeFlow();
                                }
                            }
                            CoreEngine.getGlobalAudioContext();
                            CoreEngine.exec_a_bool_to_void(this.isBackgrounded);
                            (this.isRunning = false);
                            (this.val_bool_g = true);
                        }
                        break;
                    case 7:
                        (CoreEngine.isGlobalPaused = true);
                        (CoreEngine.val_globalcontext_a.currentScene.isScenePaused = true);
                        break;
                    case 8:
                        let var38 = CoreEngine.val_globalcontext_a.currentScene;
                        if (!CoreEngine.val_globalcontext_a.currentScene.isTransitioning) {
                            (var38.isTransitioning = true);
                        }
                        CoreEngine.exec_b_gamemidletloop_to_void(CoreEngine.val_gamemidletloop_a);
                }
            }
        } catch (var21) {
            console.error("[GameMidletLoop] Event loop error:", var21);
        }

        if (this.isRunning) {
            if ((this.val_bool_h && CoreEngine.val_maincanvasbridge_a.isShown())) {
                (this.val_bool_h = false);
                this.stopGameLoop();
            }
            return;
        }

        try {
            let var35 = CoreEngine.val_maincanvasbridge_a;
            let frameDelta = 0;
            if ((this.targetFrameTimeMs) === (-1)) {
                (frameDelta = (((Date.now() - this.lastFrameTimeMs)) | 0));
            } else {
                (frameDelta = (((this.targetFrameTimeMs - this.lastFrameTimeMs)) | 0));
            }
            let var25 = frameDelta;
            (frameDelta -= var35.canvasWidth);
            let var23 = CoreEngine.val_globalcontext_a.currentScene;
            let var22 = var23.sceneDuration;
            if ((CoreEngine.val_globalcontext_a.currentScene.sceneStateId) !== (0)) {
                if ((var22) === (Integer.MAX_VALUE)) {
                    (var22 = -350);
                } else {
                    if (((var22 += frameDelta) > 150)) {
                        (var22 = 0);
                    }
                }
            }
            (var23.sceneDuration = var22);
            let rootState = (var23);
            let var24 = rootState.inputManager;
            let var26 = 0;
            (rootState.lastUpdateTimestamp = (var26 = Date.now()));
            rootState.flowController.updateFlow((var26 - rootState.gameTimer));
            (rootState.isScenePaused = true);
            if ((var24.activeKeyBitmask > 0)) {
                var24.activeKeyBitmask--;
            }
            (var24.releasedKeyBitmask = 0);
            (var24.repeatedKeyBitmask = 0);
            (var35.canvasWidth = var25);
            (CoreEngine.isGlobalPaused = true);
        } catch (var19) {
            console.error("[GameMidletLoop] Frame update error:", var19);
        }
        if (this.isExitRequested) {
            return;
        }
        if (((var1 - this.val_long_c) < 2000)) {
            (CoreEngine.isGlobalPaused = true);
            (CoreEngine.val_globalcontext_a.currentScene.isScenePaused = true);
        }
        if ((CoreEngine.isGlobalPaused && CoreEngine.val_globalcontext_a.currentScene.isScenePaused)) {
            CoreEngine.val_maincanvasbridge_a.repaint();
            try {
                CoreEngine.val_maincanvasbridge_a.serviceRepaints();
            } catch (var12) {
                console.error("[GameMidletLoop] Repaint error:", var12);
            }
        }
        this.lastFrameTimeMs = var1;
    }
}
globalThis.GameMidletLoop = GameMidletLoop;


export class SDKMIDlet extends GameMidletLoop {
    constructor() {
        super();
        CoreEngine.f_a_sdkmidlet = this;
        CoreEngine.midletInstance = this;
    }
}
globalThis.SDKMIDlet = SDKMIDlet;

// Static initialization phase
export function initEngine() {
    console.log("[Engine] Initializing UMK3 Static Tables...");
    TransformTable.val_arr_int_a;
    PatternTable.val_arr_int_a;
    ResourceSlotTable.val_arr_byte_a;
    AudioMetaTable.val_arr_string_a;
    CharacterPresetTable.val_arr_byte_a;
    console.log("[Engine] UMK3 Static Tables Initialized Successfully!");
}
