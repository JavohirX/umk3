import com.ea.sdk.SDKMIDlet;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Random;
import javax.microedition.lcdui.Display;
import javax.microedition.media.Manager;
import javax.microedition.media.Player;
import javax.microedition.media.control.VolumeControl;
import javax.microedition.rms.RecordStore;

/**
 * Primary game engine core. Implements combat physics, player and AI state updates,
 * collision and hurtbox/hitbox detection, combo inputs, round timers, projectile tracking,
 * and screen-space rendering pipelines. Implements {@link EntityInterface}.
 */
public final class CoreEngine implements EntityInterface {
   public int[] actorPhysicsArray;
   public boolean actorActiveFlag;
   public AnimationSet currentAnimSet;
   public SpritePartSequence[] spriteSequences;
   public int actorTimerR;
   public int actorTimerS;
   public int actorTimerT;
   public int actorTimerU;
   public int actorTimerV;
   public int actorTimerW;
   public int actorTimerX;
   public int actorTimerY;
   public int actorTimerZ;
   public int actorCounterA;
   public int actorCounterB;
   public int actorCounterC;
   public int actorCounterD;
   public int actorCounterE;
   public int actorCurrentAnimIndex;
   public byte[][][] characterMoveFrames;
   public int actorSubStateG;
   public int actorSubStateH;
   public int actorLifecycleState = 0;
   public static CoreEngine[] actorPoolArray;
   public int characterId;
   public int playerSlot;
   public int animationTick;
   public int facingDirectionFlag;
   public byte[] scratchpadBuffer;
   public int playerSideIndex;
   public int layerDepth;
   public int val_int_O;
   public boolean val_bool_o;
   public boolean val_bool_p;
   public boolean val_bool_q;
   public int spawnParamP;
   public boolean val_bool_r;
   public boolean val_bool_s;
   public boolean val_bool_t;
   public int val_int_Q;
   public int val_int_R;
   public int val_int_S;
   public int requestedAnimIndex;
   public int currentHealth;
   public int superMeterEnergy;
   public int energyDrainFlag;
   public EncodedTextBuffer fighterNameBuffer;
   public CoreEngine opposingActorRef;
   public int val_int_X;
   public int[] val_arr_int_g;
   public int val_int_Y;
   public ActorStateMachine linkedStateMachine;
   public int val_int_Z;
   public byte[][] val_arr_arr_byte_a;
   public boolean val_bool_u;
   public boolean val_bool_v;
   public boolean val_bool_w;
   public boolean val_bool_x;
   public boolean val_bool_y;
   public boolean val_bool_z;
   public SpritePartSequence val_spritepartsequence_e;
   public AnimationSet val_animationset_f;
   public boolean val_bool_A;
   public boolean val_bool_B;
   public int val_int_aa;
   public EncodedTextBuffer fighterTitleBuffer;
   public int val_int_ab;
   public int val_int_ac;
   public boolean val_bool_C;
   public boolean val_bool_D;
   public boolean val_bool_E;
   public boolean val_bool_F;
   public AnimationSet val_animationset_g;
   public SpritePartSequence val_spritepartsequence_f;
   public boolean val_bool_G;
   public int val_int_ad;
   public short[] spriteTransformLookupB;
   public short[] spriteTransformLookupC;
   public static byte[] val_arr_byte_c;
   public static int[] val_arr_int_h;
   public static AnimationSet val_animationset_h;
   public static SpritePartSequence[] val_arr_spritepartsequence_b;
   public static SpritePartSequence val_spritepartsequence_g;
   public static SpritePartSequence val_spritepartsequence_h;
   public static int val_int_ae;
   public static byte val_byte_c;
   public static byte val_byte_d;
   public static int val_int_af;
   public static int val_int_ag;
   public static int val_int_ah;
   public static int val_int_ai;
   public static int val_int_aj;
   public static int val_int_ak;
   public static boolean val_bool_a;
   public static int val_int_al;
   public static int val_int_am;
   public static int[] val_arr_int_i;
   public static int[][] val_arr_arr_int_a;
   public static int val_int_an;
   public static boolean[][] val_arr_arr_bool_a;
   public static int[] val_arr_int_j;
   public static int[][] val_arr_arr_int_b;
   public static InputStream val_inputstream_a;
   public static int val_int_b = -1;
   public static int val_int_c = -1;
   public static int val_int_d = -1;
   public static byte[] val_arr_byte_d;
   public static int[] val_arr_int_a;
   public static int[] val_arr_int_b;
   public static byte val_byte_e;
   public static AnimationSet val_animationset_i;
   public static byte[][] val_arr_arr_byte_b = new byte[3][0];
   public static byte[] val_arr_byte_e = new byte[3];
   public static byte[] val_arr_byte_f = new byte[3];
   public static int[] val_arr_int_k = new int[3];
   public static int[] val_arr_int_l = new int[3];
   public static int[] val_arr_int_m = new int[3];
   public static int[] val_arr_int_n = new int[3];
   public static int[] val_arr_int_o = new int[3];
   public static int[] val_arr_int_p = new int[3];
   public static int val_int_ao;
   public static int val_int_ap;
   public static int val_int_aq;
   public static int val_int_ar;
   public static int val_int_as;
   public static int val_int_at;
   public static AnimationSet val_animationset_j;
   public static SpritePartSequence val_spritepartsequence_i;
   public static int val_int_au;
   public static int val_int_av;
   public static int val_int_aw;
   public static int val_int_ax;
   public static int val_int_ay;
   public static int val_int_az;
   public static int[] val_arr_int_q;
   public static byte[] val_arr_byte_g;
   public static SDKMIDlet midletInstance;
   public static Thread val_thread_a;
   public static boolean val_bool_H;
   public static int val_int_aA;
   public static byte val_byte_f = -1;
   public static byte val_byte_g = -1;
   public static int val_int_aB;
   public static int val_int_aC;
   public static int val_int_aD;
   public static int[] val_arr_int_r;
   public static int val_int_aE;
   public static boolean val_bool_I;
   public static boolean val_bool_J;
   public static int[] val_arr_int_s = new int[5];
   public static int val_int_aF;
   public static int[] val_arr_int_t;
   public static EncodedTextBuffer[] val_arr_encodedtextbuffer_a;
   public static int[] val_arr_int_u;
   public static int val_int_aG;
   public static EncodedTextBuffer val_encodedtextbuffer_d;
   public static byte val_byte_h;
   public static byte val_byte_i;
   public static int val_int_aH;
   public static boolean[] val_arr_bool_a = new boolean[29];
   public static int[] val_arr_int_v;
   public static int[] val_arr_int_w;
   public static int[] val_arr_int_x;
   public static int[] val_arr_int_y;
   public static int[] val_arr_int_z;
   public static int[] val_arr_int_A;
   public static int[] val_arr_int_B;
   public static int[] val_arr_int_C;
   public static int[] val_arr_int_D;
   public static int[] val_arr_int_E;
   public static int[] val_arr_int_F;
   public static int[] val_arr_int_G;
   public static int[] val_arr_int_H;
   public static int[] val_arr_int_I;
   public static int[] val_arr_int_J;
   public static int[] val_arr_int_K;
   public static int[] val_arr_int_L;
   public static int[] val_arr_int_M;
   public static int[] val_arr_int_N;
   public static int val_int_aI;
   public static int val_int_aJ;
   public static int val_int_aK;
   public static int[] val_arr_int_O = new int[4];
   public static int[] val_arr_int_P = new int[4];
   public static int[] val_arr_int_Q = new int[4];
   public static int val_int_aL;
   public static int val_int_aM;
   public static int val_int_aN;
   public static int val_int_aO;
   public static int val_int_aP;
   public static int val_int_aQ;
   public static int val_int_aR;
   public static EncodedTextBuffer val_encodedtextbuffer_e;
   public static int val_int_aS;
   public static short[] val_arr_short_d;
   public static int val_int_aT;
   public static int val_int_aU;
   public static int val_int_aV;
   public static int val_int_aW;
   public static int val_int_aX;
   public static int val_int_aY;
   public static int val_int_aZ;
   public static boolean val_bool_K;
   public static boolean val_bool_L;
   public static boolean val_bool_M;
   public static boolean val_bool_N;
   public static int[] val_arr_int_R;
   public static int[] val_arr_int_S;
   public static AnimationSet[] val_arr_animationset_a;
   public static AnimationSet[] val_arr_animationset_b;
   public static int[] val_arr_int_T;
   public static int[] val_arr_int_U;
   public static int[] val_arr_int_V;
   public static int[] val_arr_int_W;
   public static SpritePartSequence[] val_arr_spritepartsequence_c;
   public static SpritePartSequence[] val_arr_spritepartsequence_d;
   public static int[] val_arr_int_X;
   public static int[] val_arr_int_Y;
   public static int[] val_arr_int_Z;
   public static int[] val_arr_int_aa;
   public static int[] val_arr_int_ab;
   public static int[] val_arr_int_ac;
   public static int[] val_arr_int_ad;
   public static int[] val_arr_int_ae;
   public static int[] val_arr_int_af;
   public static int val_int_ba;
   public static boolean val_bool_O;
   public static boolean val_bool_P;
   public static int val_int_bb;
   public static int val_int_bc;
   public static byte[] val_arr_byte_h;
   public static byte[] val_arr_byte_i;
   public static byte[][] val_arr_arr_byte_c = new byte[10][3];
   public static int[] val_arr_int_ag = new int[10];
   public static EncodedTextBuffer[] val_arr_encodedtextbuffer_b = new EncodedTextBuffer[10];
   public static EncodedTextBuffer[] val_arr_encodedtextbuffer_c = new EncodedTextBuffer[10];
   public static EncodedTextBuffer[] val_arr_encodedtextbuffer_d = new EncodedTextBuffer[10];
   public static int val_int_bd;
   public static int val_int_be;
   public static int val_int_bf;
   public static int val_int_bg;
   public static int val_int_bh;
   public static int val_int_bi;
   public static EncodedTextBuffer val_encodedtextbuffer_f;
   public static EncodedTextBuffer val_encodedtextbuffer_g;
   public static EncodedTextBuffer val_encodedtextbuffer_h;
   public static int val_int_bj;
   public static int val_int_bk;
   public static int val_int_bl;
   public static int val_int_bm;
   public static int val_int_bn;
   public static int val_int_bo;
   public static boolean val_bool_Q;
   public static boolean val_bool_R;
   public static short[] val_arr_short_e;
   public static byte[] val_arr_byte_j;
   public static EncodedTextBuffer[] val_arr_encodedtextbuffer_e;
   public static int val_int_bp;
   public static boolean val_bool_S;
   public static int val_int_bq;
   public static int val_int_br;
   public static boolean val_bool_T;
   public static int val_int_bs;
   public static int val_int_bt = 167772241;
   public static int[] val_arr_int_ah;
   public static AnimationSet val_animationset_k;
   public static SpritePartSequence[] val_arr_spritepartsequence_e;
   public static int[] val_arr_int_ai;
   public static int[] val_arr_int_aj = new int[4];
   public static int[] val_arr_int_ak = new int[4];
   public static int[] val_arr_int_al = new int[4];
   public static int[] val_arr_int_am = new int[4];
   public static int val_int_e;
   public static int val_int_f;
   public static long val_long_a;
   public static int val_int_bu = 0;
   public static int val_int_bv = 2;
   public static int val_int_g = -1;
   public static int val_int_bw = 0;
   public static int val_int_bx = 1;
   public static boolean val_bool_b;
   public static int val_int_h = -1;
   public static int val_int_i;
   public static GraphicsAdapter val_graphicsadapter_a;
   public static MarketPanelController val_marketpanelcontroller_a;
   public static boolean val_bool_c = false;
   public static boolean val_bool_d;
   public static boolean val_bool_e;
   public static AudioManager val_audiomanager_a;
   public static int val_int_by;
   public static AnimationSet val_animationset_a;
   public static AnimationSet val_animationset_b;
   public static AnimationSet val_animationset_c;
   public static AnimationSet val_animationset_d;
   public static SpritePartSequence val_spritepartsequence_a;
   public static SpritePartSequence val_spritepartsequence_b;
   public static SpritePartSequence val_spritepartsequence_c;
   public static SpritePartSequence val_spritepartsequence_d;
   public static int val_int_j;
   public static int val_int_k;
   public static int val_int_l;
   public static int val_int_m;
   public static InputManager val_inputmanager_a;
   public static Object[] val_arr_object_a = new Object[9];
   public static int val_int_n;
   public static int val_int_o;
   public static int val_int_bz;
   public static int val_int_bA;
   public static int val_int_bB;
   public static int val_int_bC;
   public static int val_int_bD;
   public static int val_int_bE;
   public static int val_int_p;
   public static boolean val_bool_f;
   public static boolean val_bool_g = true;
   public static boolean val_bool_h = false;
   public static boolean val_bool_i = true;
   public static boolean val_bool_j = true;
   public static boolean val_bool_U;
   public static String val_string_a;
   public static boolean val_bool_V = true;
   public static short[] val_arr_short_a;
   public static EncodedTextBuffer val_encodedtextbuffer_a = new EncodedTextBuffer();
   public static boolean val_bool_k = false;
   public static int val_int_bF;
   public static int val_int_bG;
   public static int val_int_bH;
   public static boolean val_bool_W;
   public static boolean val_bool_X;
   public static byte val_byte_j;
   public static byte val_byte_k;
   public static int val_int_bI;
   public static byte val_byte_l;
   public static byte val_byte_m;
   public static int val_int_bJ;
   public static int val_int_bK;
   public static EncodedTextBuffer val_encodedtextbuffer_i;
   public static int val_int_bL;
   public static int val_int_bM;
   public static int val_int_bN;
   public static AnimationSet val_animationset_l;
   public static SpritePartSequence val_spritepartsequence_j;
   public static SpritePartSequence val_spritepartsequence_k;
   public static SpritePartSequence val_spritepartsequence_l;
   public static int val_int_bO;
   public static int val_int_bP;
   public static boolean val_bool_Y;
   public static int[] val_arr_int_an;
   public static AnimationSet[] val_arr_animationset_c;
   public static int[] val_arr_int_ao;
   public static int[] val_arr_int_ap;
   public static SpritePartSequence[] val_arr_spritepartsequence_f;
   public static SpritePartSequence[] val_arr_spritepartsequence_g;
   public static int val_int_bQ;
   public static int val_int_bR;
   public static int[] val_arr_int_aq;
   public static int[] val_arr_int_ar;
   public static int[] val_arr_int_as;
   public static int[] val_arr_int_at;
   public static int val_int_bS;
   public static EncodedTextBuffer val_encodedtextbuffer_j;
   public static byte val_byte_n;
   public static int val_int_bT;
   public static int val_int_bU;
   public static int val_int_bV;
   public static byte val_byte_o;
   public static byte val_byte_p;
   public static int[][] val_arr_arr_int_c;
   public static int[] val_arr_int_au;
   public static int val_int_bW;
   public static int[] val_arr_int_av;
   public static int val_int_bX;
   public static int val_int_bY;
   public static int[] val_arr_int_aw;
   public static EncodedTextBuffer val_encodedtextbuffer_k;
   public static EncodedTextBuffer val_encodedtextbuffer_l;
   public static int val_int_bZ;
   public static int val_int_ca;
   public static int val_int_cb;
   public static int val_int_cc;
   public static int val_int_cd;
   public static int val_int_ce;
   public static int val_int_cf;
   public static int val_int_cg;
   public static int val_int_ch;
   public static int val_int_ci;
   public static int val_int_cj;
   public static int val_int_ck;
   public static int val_int_cl;
   public static int val_int_cm;
   public static int val_int_cn;
   public static int val_int_co;
   public static int val_int_cp;
   public static int val_int_cq;
   public static boolean[][] val_arr_arr_bool_b;
   public static int val_int_cr;
   public static int val_int_cs;
   public static boolean val_bool_Z;
   public static int[] val_arr_int_ax;
   public static AnimationSet[] val_arr_animationset_d;
   public static int[] val_arr_int_ay;
   public static int[] val_arr_int_az;
   public static SpritePartSequence[] val_arr_spritepartsequence_h;
   public static SpritePartSequence[] val_arr_spritepartsequence_i;
   public static int val_int_ct;
   public static int[] val_arr_int_aA;
   public static int[] val_arr_int_aB;
   public static int[] val_arr_int_aC;
   public static int[] val_arr_int_aD;
   public static int val_int_cu;
   public static int val_int_cv;
   public static boolean val_bool_aa;
   public static int[] val_arr_int_c = new int[6];
   public static int[] val_arr_int_d = new int[4];
   public static int val_int_cw;
   public static int val_int_cx;
   public static int[] val_arr_int_aE;
   public static int val_int_cy;
   public static int val_int_cz;
   public static int[][] val_arr_arr_int_d;
   public static int val_int_cA;
   public static EncodedTextBuffer val_encodedtextbuffer_m;
   public static short[] val_arr_short_f;
   public static int val_int_cB;
   public static int val_int_cC;
   public static int val_int_cD;
   public static int val_int_cE;
   public static boolean val_bool_ab;
   public static boolean val_bool_ac;
   public static boolean val_bool_ad;
   public static boolean val_bool_ae;
   public static boolean val_bool_af;
   public static int val_int_cF;
   public static boolean val_bool_ag;
   public static int val_int_cG;
   public static boolean val_bool_ah;
   public static boolean val_bool_ai;
   public static long val_long_c;
   public static long val_long_d;
   public static long val_long_e;
   public static long val_long_f;
   public static long val_long_g;
   public static boolean val_bool_aj;
   public static int val_int_cH;
   public static AnimationSet val_animationset_m;
   public static SpritePartSequence val_spritepartsequence_m;
   public static int val_int_cI;
   public static int val_int_cJ;
   public static int val_int_cK;
   public static int val_int_cL;
   public static int val_int_cM;
   public static int val_int_cN;
   public static EncodedTextBuffer val_encodedtextbuffer_n;
   public static boolean val_bool_ak;
   public static boolean val_bool_al;
   public static byte[] val_arr_byte_k;
   public static boolean val_bool_am;
   public static int val_int_cO;
   public static byte val_byte_q = 4;
   public static byte[][] val_arr_arr_byte_d;
   public static byte[] val_arr_byte_l;
   public static int val_int_cP;
   public static int val_int_cQ;
   public static int val_int_cR;
   public static int val_int_cS;
   public static int val_int_cT;
   public static int val_int_cU;
   public static int val_int_cV;
   public static int val_int_cW;
   public static int val_int_cX;
   public static int val_int_cY;
   public static int val_int_cZ;
   public static int val_int_da;
   public static int val_int_db;
   public static int val_int_dc;
   public static int val_int_dd;
   public static int val_int_de;
   public static int val_int_df;
   public static int val_int_dg;
   public static int val_int_dh;
   public static int val_int_di;
   public static int val_int_dj;
   public static int val_int_dk;
   public static int val_int_dl;
   public static int val_int_dm;
   public static int val_int_dn;
   public static int val_int_do;
   public static int val_int_dp;
   public static int val_int_dq;
   public static int val_int_dr;
   public static int val_int_ds;
   public static int val_int_dt;
   public static int val_int_du;
   public static int val_int_dv;
   public static int val_int_dw;
   public static int val_int_dx;
   public static int val_int_dy;
   public static int val_int_dz;
   public static EncodedTextBuffer val_encodedtextbuffer_o;
   public static int val_int_dA;
   public static int[] val_arr_int_aF;
   public static int val_int_dB;
   public static int val_int_dC;
   public static EncodedTextBuffer val_encodedtextbuffer_p;
   public static EncodedTextBuffer val_encodedtextbuffer_q;
   public static EncodedTextBuffer val_encodedtextbuffer_r;
   public static AnimationSet val_animationset_n;
   public static SpritePartSequence val_spritepartsequence_n;
   public static int[] val_arr_int_aG = new int[2];
   public static EncodedTextBuffer[] val_arr_encodedtextbuffer_f = new EncodedTextBuffer[2];
   public static EncodedTextBuffer[] val_arr_encodedtextbuffer_g = new EncodedTextBuffer[2];
   public static EncodedTextBuffer val_encodedtextbuffer_s;
   public static EncodedTextBuffer val_encodedtextbuffer_t;
   public static int[] val_arr_int_aH = new int[2];
   public static int[] val_arr_int_aI = new int[2];
   public static int[] val_arr_int_aJ = new int[2];
   public static int[] val_arr_int_aK = new int[2];
   public static int[] val_arr_int_aL = new int[2];
   public static int[] val_arr_int_aM = new int[2];
   public static int[] val_arr_int_aN = new int[2];
   public static int val_int_dD;
   public static int val_int_dE;
   public static int val_int_dF;
   public static int val_int_dG;
   public static int val_int_dH;
   public static int val_int_dI;
   public static int val_int_dJ;
   public static int val_int_dK;
   public static boolean val_bool_an;
   public static boolean val_bool_ao;
   public static boolean val_bool_ap;
   public static boolean val_bool_aq;
   public static boolean val_bool_ar;
   public static boolean val_bool_as;
   public static boolean val_bool_at;
   public static boolean val_bool_au;
   public static boolean val_bool_av;
   public static int val_int_dL;
   public static int val_int_q;
   public static int val_int_dM;
   public static int val_int_dN;
   public static int val_int_dO;
   public static int val_int_dP;
   public static byte val_byte_r;
   public static int val_int_dQ;
   public static int val_int_dR;
   public static CoreEngine val_coreengine_b;
   public static CoreEngine val_coreengine_c;
   public static CoreEngine val_coreengine_d;
   public static int val_int_dS;
   public static int val_int_dT;
   public static int val_int_dU;
   public static int val_int_dV;
   public static CoreEngine val_coreengine_e;
   public static boolean val_bool_aw;
   public static boolean val_bool_ax;
   public static byte val_byte_s;
   public static byte val_byte_t;
   public static EncodedTextBuffer val_encodedtextbuffer_u;
   public static EncodedTextBuffer val_encodedtextbuffer_v;
   public static EncodedTextBuffer val_encodedtextbuffer_w;
   public static AnimationSet val_animationset_o;
   public static SpritePartSequence val_spritepartsequence_o;
   public static AnimationSet val_animationset_p;
   public static SpritePartSequence val_spritepartsequence_p;
   public static int val_int_dW;
   public static int val_int_dX;
   public static int val_int_dY;
   public static boolean val_bool_ay;
   public static boolean val_bool_az;
   public static boolean val_bool_aA;
   public static int val_int_dZ;
   public static int val_int_ea;
   public static EncodedTextBuffer val_encodedtextbuffer_x;
   public static EncodedTextBuffer val_encodedtextbuffer_y;
   public static EncodedTextBuffer val_encodedtextbuffer_z;
   public static EncodedTextBuffer val_encodedtextbuffer_A;
   public static EncodedTextBuffer val_encodedtextbuffer_B;
   public static EncodedTextBuffer val_encodedtextbuffer_C;
   public static EncodedTextBuffer val_encodedtextbuffer_D;
   public static EncodedTextBuffer val_encodedtextbuffer_E;
   public static EncodedTextBuffer val_encodedtextbuffer_F;
   public static EncodedTextBuffer val_encodedtextbuffer_G;
   public static EncodedTextBuffer val_encodedtextbuffer_H;
   public static EncodedTextBuffer val_encodedtextbuffer_I;
   public static EncodedTextBuffer val_encodedtextbuffer_J;
   public static EncodedTextBuffer val_encodedtextbuffer_K;
   public static int val_int_eb;
   public static int val_int_ec;
   public static int val_int_ed;
   public static boolean val_bool_aB;
   public static int val_int_ee;
   public static AnimationSet val_animationset_q;
   public static SpritePartSequence val_spritepartsequence_q;
   public static int val_int_ef;
   public static SpritePartSequence val_spritepartsequence_r;
   public static int val_int_eg;
   public static EncodedTextBuffer val_encodedtextbuffer_L;
   public static short[] val_arr_short_g;
   public static EncodedTextBuffer val_encodedtextbuffer_M;
   public static short[] val_arr_short_h;
   public static int val_int_eh;
   public static int val_int_ei;
   public static boolean val_bool_aC;
   public static boolean val_bool_aD;
   public static boolean val_bool_aE;
   public static EncodedTextBuffer val_encodedtextbuffer_N;
   public static int val_int_ej;
   public static EncodedTextBuffer val_encodedtextbuffer_O;
   public static boolean val_bool_aF;
   public static boolean val_bool_aG;
   public static int val_int_ek;
   public static boolean val_bool_aH;
   public static boolean val_bool_aI;
   public static boolean val_bool_aJ;
   public static boolean val_bool_aK;
   public static boolean val_bool_aL;
   public static boolean val_bool_aM;
   public static int[][] val_arr_arr_int_e;
   public static int[][] val_arr_arr_int_f;
   public static int[][] val_arr_arr_int_g;
   public static int[] val_arr_int_aO;
   public static EffectActor[] val_arr_effectactor_a;
   public static int val_int_el;
   public static int val_int_em;
   public static AnimationSet[] val_arr_animationset_e;
   public static AnimationSet val_animationset_r;
   public static AnimationSet[] val_arr_animationset_f;
   public static AnimationSet val_animationset_s;
   public static AnimationSet val_animationset_t;
   public static AnimationSet val_animationset_u;
   public static SpritePartSequence val_spritepartsequence_s;
   public static SpritePartSequence val_spritepartsequence_t;
   public static AnimationSet val_animationset_v;
   public static SpritePartSequence[] val_arr_spritepartsequence_j;
   public static SpritePartSequence val_spritepartsequence_u;
   public static SpritePartSequence val_spritepartsequence_v;
   public static SpritePartSequence val_spritepartsequence_w;
   public static SpritePartSequence val_spritepartsequence_x;
   public static SpritePartSequence val_spritepartsequence_y;
   public static SpritePartSequence val_spritepartsequence_z;
   public static SpritePartSequence val_spritepartsequence_A;
   public static int[] val_arr_int_aP;
   public static int[] val_arr_int_aQ;
   public static AnimationSet val_animationset_w;
   public static SpritePartSequence val_spritepartsequence_B;
   public static AnimationSet val_animationset_x;
   public static SpritePartSequence[] val_arr_spritepartsequence_k;
   public static RenderContext val_rendercontext_a;
   public static GlobalContext val_globalcontext_a;
   public static Object val_object_a = new Object();
   public static GameMidletLoop val_gamemidletloop_a;
   public static SceneBase val_scenebase_a;
   public static MainCanvasBridge val_maincanvasbridge_a;
   public static boolean isGlobalPaused = true;
   public static GameMidletLoop val_gamemidletloop_b;
   public static long frameTimestampMs = 25L;
   public static short audioChannelCount = 1;
   public static byte[] val_arr_byte_m = new byte[0];
   public static RecordStore saveRecordStore = null;
   public static byte[] val_arr_byte_n = null;
   public static int val_int_en = -1;
   public static int val_int_eo = -1;
   public static int val_int_ep = -1;
   public static boolean val_bool_aN = false;
   public static String[] val_arr_string_a;
   public static int[] val_arr_int_e;
   public static String[] val_arr_string_b = new String[0];
   public static SpritePartSequence[][] val_arr_arr_spritepartsequence_a;
   public static AnimationSet[] val_arr_animationset_g;
   public static ActorStateMachine[] val_arr_actorstatemachine_a;
   public static byte[] val_arr_byte_o;
   public static int[] val_arr_int_aR;
   public static int[] val_arr_int_aS;
   public static int[] val_arr_int_aT;
   public static int[] val_arr_int_aU;
   public static int[] val_arr_int_aV;
   public static int[] val_arr_int_aW;
   public static int[][] val_arr_arr_int_h;
   public static short[][] val_arr_arr_short_c;
   public static short[][] val_arr_arr_short_d;
   public static short[][] val_arr_arr_short_e;
   public static short[][] val_arr_arr_short_f;
   public static int[] val_arr_int_aX;
   public static int[] val_arr_int_aY;
   public static int[] val_arr_int_aZ;
   public static int[] val_arr_int_ba;
   public static int[] val_arr_int_bb;
   public static int[] val_arr_int_bc;
   public static int[] val_arr_int_bd;
   public static int[] val_arr_int_be;
   public static int[] val_arr_int_bf;
   public static byte[][] val_arr_arr_byte_e;
   public static byte[][] val_arr_arr_byte_f;
   public static byte[][] val_arr_arr_byte_g;
   public static byte[][] val_arr_arr_byte_h;
   public static byte[][] val_arr_arr_byte_i;
   public static byte[][] val_arr_arr_byte_j;
   public static byte[][] val_arr_arr_byte_k;
   public static byte[][] val_arr_arr_byte_l;
   public static byte[][] val_arr_arr_byte_m;
   public static byte[][] val_arr_arr_byte_n;
   public static byte[][] val_arr_arr_byte_o;
   public static byte[][] val_arr_arr_byte_p;
   public static byte[][] val_arr_arr_byte_q;
   public static byte[][] val_arr_arr_byte_r;
   public static byte[][] val_arr_arr_byte_s;
   public static byte[][] val_arr_arr_byte_t;
   public static byte[][] val_arr_arr_byte_u;
   public static byte[][] val_arr_arr_byte_v;
   public static byte[][][][] val_arr_arr_arr_arr_byte_a;
   public static int[][] val_arr_arr_int_i;
   public static byte[][][] val_arr_arr_arr_byte_b;
   public static byte[][] val_arr_arr_byte_w;
   public static short[][] val_arr_arr_short_g;
   public static short[][] val_arr_arr_short_h;
   public static short[] val_arr_short_i;
   public static short[] val_arr_short_j;
   public static short[] val_arr_short_k;
   public static short[] val_arr_short_l;
   public static short[] val_arr_short_m;
   public static short[] val_arr_short_n;
   public static short[] val_arr_short_o;
   public static short[] val_arr_short_p;
   public static short[] val_arr_short_q;
   public static short[] val_arr_short_r;
   public static short[] val_arr_short_s;
   public static short[] val_arr_short_t;
   public static short[] val_arr_short_u;
   public static short[] val_arr_short_v;
   public static short[] val_arr_short_w;
   public static short[] val_arr_short_x;
   public static short[] val_arr_short_y;
   public static short[] val_arr_short_z;
   public static short[] val_arr_short_A;
   public static short[] val_arr_short_B;
   public static short[] val_arr_short_C;
   public static short[] val_arr_short_D;
   public static short[] val_arr_short_E;
   public static short[] val_arr_short_F;
   public static byte[][] val_arr_arr_byte_x;
   public static int[] val_arr_int_bg;
   public static String[] val_arr_string_c;
   public static int[] val_arr_int_bh;
   public static byte[][] val_arr_arr_byte_y;
   public static String[] val_arr_string_d;
   public static int val_int_eq;
   public static int val_int_er;
   public static int val_int_es;
   public static int val_int_et;
   public static byte[] val_arr_byte_p;
   public static int val_int_eu;
   public static int val_int_ev;
   public static AnimationSet val_animationset_y;
   public static SpritePartSequence val_spritepartsequence_C;
   public static boolean val_bool_aO;
   public static int val_int_ew;
   public static AnimationSet val_animationset_z;
   public static SpritePartSequence val_spritepartsequence_D;
   public static SpritePartSequence val_spritepartsequence_E;
   public static SpritePartSequence val_spritepartsequence_F;
   public static int val_int_ex;
   public static int val_int_ey;
   public static boolean val_bool_aP;
   public static int val_int_ez;
   public static int val_int_eA;
   public static AnimationSet val_animationset_A;
   public static AnimationSet val_animationset_B;
   public static SpritePartSequence val_spritepartsequence_G;
   public static SpritePartSequence val_spritepartsequence_H;
   public static boolean val_bool_aQ;
   public static CoreEngine val_coreengine_f;
   public static AnimationSet val_animationset_C;
   public static SpritePartSequence val_spritepartsequence_I;
   public static int[] val_arr_int_bi;
   public static int[][] val_arr_arr_int_j;
   public static short[][] val_arr_arr_short_a;
   public static short[][] val_arr_arr_short_b;
   public static int[] val_arr_int_bj;
   public static Random globalRandom = new Random(System.currentTimeMillis());
   public static long[] val_arr_long_a;
   public static EntityInterface[][] val_arr_arr_entityinterface_a = null;
   public static int[] val_arr_int_bk = null;
   public static int val_int_eB = -1;
   public static int val_int_eC = 0;
   public static int[] val_arr_int_bl = null;
   public static int val_int_eD = 0;
   public static int val_int_eE = 0;
   public static int[] val_arr_int_bm = null;
   public static int[] val_arr_int_bn = null;
   public static int[] val_arr_int_bo = null;
   public static int[] val_arr_int_bp = null;
   public static int[] val_arr_int_bq = null;
   public static int[] val_arr_int_br = null;
   public static int val_int_eF = 0;
   public static int val_int_eG = 0;
   public static int val_int_eH = 0;
   public static int val_int_eI = 0;
   public static int val_int_eJ = -1;
   public static int[] val_arr_int_bs = new int[800];
   public static int[][] val_arr_arr_int_k;
   public static byte[][][] val_arr_arr_arr_byte_c;
   public static byte[][] val_arr_arr_byte_z;
   public static String[] val_arr_string_e;
   public static int val_int_eK;
   public static int val_int_eL;
   public static int val_int_eM;
   public static int val_int_eN;
   public static int val_int_eO;
   public static int val_int_eP;
   public static int val_int_eQ;
   public static int val_int_eR;
   public static int val_int_eS;
   public static int val_int_eT;
   public static int val_int_eU;
   public static int val_int_eV;
   public static int val_int_eW;
   public static int val_int_eX;
   public static byte val_byte_a = 8;
   public static byte val_byte_b = (byte)(0 + val_byte_a + 6);
   public static byte[] val_arr_byte_a = new byte[5];
   public static boolean val_bool_m;

   public CoreEngine() {
      this.actorPhysicsArray = new int[11];
      this.scratchpadBuffer = new byte[128];
      exec_a_arr_byte_to_void(this.scratchpadBuffer);
      this.setActorAnimation(1);
   }

   public void setActorAnimation(int var1) {
      if (this.actorCurrentAnimIndex != var1 && this.canAcceptAnimCommand()) {
         this.requestedAnimIndex = var1;
         this.actorCurrentAnimIndex = var1;
      }
   }

   public byte getActiveComboByte() {
      if (this.facingDirectionFlag == 0) {
         byte var3;
         if (this.actorCurrentAnimIndex == 1) {
            if (this.playerSideIndex == 0) {
               var3 = 0;
            } else {
               var3 = 2;
            }
         } else if (this.playerSideIndex == 0) {
            var3 = 1;
         } else {
            var3 = 3;
         }

         int[] var1 = val_arr_arr_int_k[var3];

         for (byte var4 = 0; var4 < var1.length; var4++) {
            int var2;
            if (var4 != 0 && var4 != 1 && var4 != 2 && var4 != 3) {
               var2 = val_int_dH;
            } else {
               var2 = val_int_dF;
            }

            if ((var1[var4] & var2) != 0) {
               return var4;
            }
         }
      }

      return 10;
   }

   public boolean canAcceptAnimCommand() {
      boolean var1;
      if (this.actorTimerW != 0
         && this.actorTimerW != 1
         && this.actorTimerW != 2
         && this.actorTimerW != 3
         && (this.actorTimerW != 9 || this.actorTimerX != 0)
         && (this.actorTimerW != 12 || this.actorTimerX != 0)
         && (this.actorTimerW != 14 || this.actorTimerX < 200)
         && (this.actorTimerW != 25 || this.actorTimerX != 0)
         && (this.actorTimerW != 24 || this.actorTimerX != 0)
         && (this.actorTimerW != 15 || this.actorTimerX != 0)
         && this.actorTimerW != 102) {
         var1 = false;
      } else {
         var1 = true;
      }

      return var1;
   }

   public static CoreEngine spawnActor(int var0, int var1, int var2, int var3, int var4, int var5, boolean var6, int var7) {
      CoreEngine var8 = null;

      for (int var9 = 0; var9 < 8; var9++) {
         if (actorPoolArray[var9].actorLifecycleState == 0) {
            (var8 = actorPoolArray[var9]).facingDirectionFlag = var9;
            var8.setCharacterId(var0);
            var8.layerDepth = var4;
            var8.playerSideIndex = var5;
            var8.val_bool_o = var6;
            var8.val_int_O = var7;
            var8.val_bool_q = true;
            var8.setActorPosition(var1, 0);
            var8.setActorAnimation(var3);
            break;
         }
      }

      return var8;
   }

   public void adjustEnergyMeter(int var1) {
      if (var1 < 0 && this.superMeterEnergy > 0) {
         this.energyDrainFlag = 0;
      }

      this.superMeterEnergy += var1;
      this.superMeterEnergy = Math.max(this.superMeterEnergy, 0);
      this.superMeterEnergy = Math.min(this.superMeterEnergy, 25600);
   }

   public final String toString() {
      return this.fighterNameBuffer.toString();
   }

   public void setCharacterId(int var1) {
      boolean var2;
      if (this.characterId == var1 && this.actorLifecycleState == 2) {
         var2 = false;
      } else {
         var2 = true;
      }

      this.characterId = var1;
      if (var2) {
         exec_a_entityinterface_int_to_void(this, this.val_int_O);
         this.setActorLifecycle(1);
      }
   }

   public void setActorPosition(int var1, int var2) {
      this.actorPhysicsArray[0] = var1 << 8;
      this.actorPhysicsArray[1] = var2 << 8;
      this.actorPhysicsArray[8] = var1 << 8;
      this.actorPhysicsArray[9] = var2 << 8;
      this.actorPhysicsArray[7] = 0;
   }

   public static void initActorPool() {
      actorPoolArray = new CoreEngine[8];

      for (int var0 = 0; var0 < actorPoolArray.length; var0++) {
         actorPoolArray[var0] = new CoreEngine();
      }
   }

   public void setActorLifecycle(int var1) {
      switch (var1) {
         case 0:
         default:
            break;
         case 1:
            this.val_bool_p = false;
            this.animationTick = 0;
            break;
         case 2:
            this.updateActor(0);
            this.actorActiveFlag = true;
            if (this.val_bool_q) {
               exec_b_entityinterface_int_to_void(this, this.val_int_O);
            }

            if (this.val_bool_o) {
               this.val_bool_p = true;
            }

            this.val_bool_y = true;
            this.val_bool_A = false;
            break;
         case 3:
            exec_a_entityinterface_int_to_void(this, this.val_int_O);
            CoreEngine var2 = this;

            for (int var3 = 0; var3 < actorPoolArray.length; var3++) {
               if (actorPoolArray[var3] == var2) {
                  actorPoolArray[var3].actorLifecycleState = 0;
               }
            }

            int var4 = this.characterId;
            int var5 = 0;

            boolean var10000;
            while (true) {
               if (var5 >= actorPoolArray.length) {
                  var10000 = true;
                  break;
               }

               if (actorPoolArray[var5] != null && actorPoolArray[var5].characterId == var4) {
                  var10000 = false;
                  break;
               }

               var5++;
            }

            if (var10000) {
               exec_E_int_to_void(this.spriteTransformLookupB[0]);
               exec_J_int_to_void(this.characterId);
            }
      }

      this.actorLifecycleState = var1;
   }

   public static void tickActors() {
      if (actorPoolArray == null) {
         initActorPool();
      }

      for (int var0 = 0; var0 < actorPoolArray.length; var0++) {
         CoreEngine var1;
         switch ((var1 = actorPoolArray[var0]).actorLifecycleState) {
            case 1:
               if (var1.animationTick >= 4) {
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
                     var1.currentHealth = 100;
                     var1.superMeterEnergy = 25600;
                     var1.spriteTransformLookupB = val_arr_arr_short_g[var1.characterId];
                     var1.spriteTransformLookupC = val_arr_arr_short_h[var1.characterId];
                     var1.characterMoveFrames = val_arr_arr_arr_arr_byte_a[var1.characterId];
                     if (var1.playerSideIndex == 1 && var1.characterMoveFrames != null) {
                        byte[][][] var2 = var1.characterMoveFrames;
                        byte[][][] var7 = new byte[var1.characterMoveFrames.length][][];

                        for (int var3 = 0; var3 < var2.length; var3++) {
                           var7[var3] = new byte[var2[var3].length][];

                           for (int var4 = 0; var4 < var2[var3].length; var4++) {
                              if (var4 == 0) {
                                 switch (var3) {
                                    case 0:
                                       var7[var3][var4] = new byte[2];
                                       var7[var3][var4][0] = 9;
                                       var7[var3][var4][1] = 2;
                                       break;
                                    case 1:
                                       var7[var3][var4] = new byte[2];
                                       var7[var3][var4][0] = 7;
                                       var7[var3][var4][1] = 2;
                                       break;
                                    case 2:
                                       var7[var3][var4] = new byte[1];
                                       var7[var3][var4][0] = 2;
                                 }
                              } else {
                                 var7[var3][var4] = new byte[var2[var3][var4].length];

                                 for (int var5 = 0; var5 < var2[var3][var4].length; var5++) {
                                    byte var6 = var2[var3][var4][var5];
                                    boolean var8;
                                    if (var4 % 2 == 0) {
                                       var8 = true;
                                    } else {
                                       var8 = false;
                                    }

                                    if (!var8 || var6 != 0 && var6 != 1) {
                                       var7[var3][var4][var5] = var6;
                                    } else {
                                       var7[var3][var4][var5] = 2;
                                    }
                                 }
                              }
                           }
                        }

                        var1.characterMoveFrames = var7;
                     }

                     if (var1.playerSideIndex == 0) {
                        var1.val_arr_arr_byte_a = val_arr_arr_arr_byte_b[var1.characterId];
                     } else {
                        var1.val_arr_arr_byte_a = val_arr_arr_byte_w;
                     }

                     int var12 = var1.characterId;
                     byte[][][] var10 = var1.characterMoveFrames;
                     byte[][] var9 = var1.val_arr_arr_byte_a;
                     EncodedTextBuffer var14 = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(46, null);
                     EncodedTextBuffer[] var15;
                     (var15 = new EncodedTextBuffer[8])[0] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(val_arr_int_bd[var12], null);
                     var15[1] = new EncodedTextBuffer(exec_a_arr_byte_to_string(var9[0]));
                     var15[2] = new EncodedTextBuffer(exec_a_arr_byte_to_string(var9[1]));
                     if (var10 != null) {
                        var15[3] = new EncodedTextBuffer(exec_a_arr_arr_byte_to_string(var10[0]));
                        var15[4] = new EncodedTextBuffer(exec_a_arr_arr_byte_to_string(var10[1]));
                        var15[5] = new EncodedTextBuffer(exec_a_arr_arr_byte_to_string(var10[2]));
                     } else {
                        var15[3] = new EncodedTextBuffer("---");
                        var15[4] = new EncodedTextBuffer("---");
                        var15[5] = new EncodedTextBuffer("---");
                     }

                     boolean var13;
                     if (var12 != 6) {
                        var13 = true;
                     } else {
                        var13 = false;
                     }

                     boolean var11 = var13;
                     if (var9[2] != null && var13) {
                        var15[6] = new EncodedTextBuffer(exec_a_arr_byte_to_string(var9[2]));
                     } else {
                        var15[6] = new EncodedTextBuffer("---");
                     }

                     if (var9[3] != null && var11) {
                        var15[7] = new EncodedTextBuffer(exec_a_arr_byte_to_string(var9[3]));
                     } else {
                        var15[7] = new EncodedTextBuffer("---");
                     }

                     var1.fighterTitleBuffer = var14.concatAll(var15);
                     var1.fighterNameBuffer = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(val_arr_int_bd[var1.characterId], null);
                     var1.val_arr_int_g = val_arr_arr_int_i[var1.characterId];
                     var1.animationTick++;
               }
         }

         if (actorPoolArray[var0].actorLifecycleState == 2) {
            SpritePartSequence var16;
            CoreEngine var17;
            if ((var17 = actorPoolArray[var0]).val_bool_y
               && (var16 = var17.exec_a_to_spritepartsequence()) != null
               && var17.actorTimerW != 18
               && var17.actorTimerW != 19) {
               var17.actorTimerR = var16.getPartYOffset(var17.actorTimerR, val_int_e);
            }

            exec_a_coreengine_to_void(var17);
            var17.val_bool_u = false;
            var17.val_bool_v = false;
         }
      }
   }

   public void setActorSubState(int var1) {
      this.val_bool_z = false;
      this.actorTimerV = var1;
      this.actorTimerR = 1;
   }

   public void setActorDirection(int var1) {
      this.val_bool_z = false;
      this.actorTimerV = var1;
      SpritePartSequence var10001 = this.exec_a_to_spritepartsequence();
      var1 = var10001.sequenceFlags;
      int var2 = var10001.partOffsets.length - 1;
      this.actorTimerR = exec_a_int_int_int_to_int(var1, var2, 2);
   }

   public void setActorHealthDelta(int var1) {
      this.val_bool_z = false;
      this.actorTimerV = var1;
      SpritePartSequence var10001 = this.exec_a_to_spritepartsequence();
      var1 = var10001.sequenceFlags;
      int var2 = var10001.partOffsets.length - 1;
      this.actorTimerR = exec_a_int_int_int_to_int(var1, var2, 1);
   }

   public void exec_a_spritepartsequence_animationset_to_void(SpritePartSequence var1, AnimationSet var2) {
      this.actorTimerR = 1;
      this.val_bool_z = true;
      this.val_spritepartsequence_e = var1;
      this.val_animationset_f = var2;
   }

   public boolean exec_f_to_bool() {
      int var3 = val_arr_int_aS[this.characterId];

      try {
         byte var2;
         if (exec_y_to_bool()) {
            var2 = 2;
         } else {
            var2 = 1;
         }

         int[] var1 = new int[var2];
         if (exec_y_to_bool()) {
            var2 = 2;
         } else {
            var2 = 1;
         }

         byte[] var8 = new byte[var2];
         CoreEngine var4 = this;
         boolean var5;
         if (val_int_dQ == val_int_dR) {
            var5 = true;
         } else {
            var5 = false;
         }

         if ((var5 || exec_A_to_bool()) && var4 == val_coreengine_c) {
            var5 = true;
         } else {
            var5 = false;
         }

         if (var5) {
            var1[0] = val_arr_int_aT[this.characterId];
         } else {
            var1[0] = -1;
         }

         var8[0] = 0;
         if (exec_y_to_bool()) {
            var8[1] = 0;
            var1[1] = val_arr_int_aU[this.characterId];
         }

         this.currentAnimSet = exec_a_int_arr_int_arr_byte_bool_to_animationset(var3, var1, var8, false);
         return false;
      } catch (Exception var6) {
         return true;
      }
   }

   public void exec_r_int_to_void(int var1) {
      this.spawnParamP = var1;
      this.currentAnimSet.setFrame(this.spawnParamP);
   }

   public boolean exec_g_to_bool() {
      int[] var4 = val_arr_arr_int_h[this.characterId];

      try {
         this.spriteSequences = new SpritePartSequence[var4.length / 2];

         for (byte var1 = 0; var1 < var4.length; var1 += 2) {
            int var2 = var4[var1];
            int var3 = var4[var1 + 1];
            if (var2 != -1) {
               this.spriteSequences[var1 / 2] = exec_a_int_int_to_spritepartsequence(var2, var3);
            }
         }

         return false;
      } catch (Exception var5) {
         return true;
      }
   }

   public final void updateActor(int var1) {
      if (this.exec_r_to_bool()) {
         boolean var2;
         if (var1 != 6 && var1 != 8 && var1 != 7 && var1 != 3 && var1 != 11 && var1 != 17 && var1 != 30 && var1 != 16 && var1 != 10) {
            var2 = false;
         } else {
            var2 = true;
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
            this.actorTimerY = 0;
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
            this.val_bool_y = true;
            this.val_int_Y = 0;
      }

      this.val_bool_r = false;
      this.val_bool_w = false;
      this.val_bool_x = false;
      this.val_bool_s = false;
      this.val_bool_z = false;
      this.val_int_ad = 0;
      if (var1 == 30 || var1 == 4 || var1 == 31 || var1 == 9 || var1 == 26) {
         val_coreengine_d = this;
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
            if (this.playerSlot == 19) {
               this.exec_b_int_to_bool(5);
            }
            break;
         case 19:
            CoreEngine var3;
            boolean var4;
            if ((var3 = exec_b_coreengine_to_coreengine(this)).characterId != 2 && var3.characterId != 5) {
               var4 = false;
            } else {
               var4 = true;
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
            if (exec_g_to_int() >= 64 && exec_b_coreengine_to_coreengine(this).actorTimerW != 15) {
               this.exec_b_int_to_bool(0);
            }
      }

      label134:
      switch (var1) {
         case 0:
            exec_b_coreengine_to_void(this);
            if (this.actorTimerW == 24) {
               this.setActorDirection(1);
            } else {
               this.setActorSubState(0);
            }
            break;
         case 1:
            if (this.actorTimerW != 1) {
               this.setActorSubState(6);
            }
            break;
         case 2:
            if (this.actorTimerW != 2) {
               this.setActorDirection(6);
            }
            break;
         case 3:
            if (this.actorTimerW != 3) {
               if (this.actorTimerW == 25) {
                  this.setActorDirection(5);
               } else if (this.actorTimerW != 11 && this.actorTimerW != 10) {
                  this.setActorSubState(4);
               } else {
                  this.setActorHealthDelta(4);
               }
            }
            break;
         case 4:
            this.setActorSubState(10);
            this.val_bool_F = false;
            this.val_bool_E = false;
            exec_a_arr_byte_to_void(this.scratchpadBuffer);
            break;
         case 5:
            this.setActorSubState(14);
            exec_a_arr_byte_to_void(this.scratchpadBuffer);
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
            exec_a_arr_byte_to_void(this.scratchpadBuffer);
            break;
         case 10:
            this.setActorSubState(15);
            exec_a_arr_byte_to_void(this.scratchpadBuffer);
            break;
         case 11:
            this.setActorSubState(13);
            exec_a_arr_byte_to_void(this.scratchpadBuffer);
            break;
         case 12:
            this.setActorSubState(3);
            break;
         case 13:
            exec_M_int_to_void(500);
            val_int_eW = 300;
            this.setActorSubState(8);
            break;
         case 14:
            exec_b_coreengine_to_void(this);
            this.setActorSubState(9);
            break;
         case 15:
            this.setActorSubState(2);
            break;
         case 16:
            if (this.actorTimerW != 16) {
               this.setActorSubState(7);
            }
            break;
         case 17:
            this.actorCounterE += 2500;
            this.setActorSubState(16);
            this.opposingActorRef.updateActor(18);
            exec_a_arr_byte_to_void(this.scratchpadBuffer);
            val_coreengine_d = this;
            break;
         case 18:
            this.actorActiveFlag = false;
            this.val_bool_s = true;
            break;
         case 19:
            this.exec_s_int_to_void(16);
            this.actorActiveFlag = false;
            this.val_bool_s = false;
            break;
         case 20:
            this.setActorSubState(33);
            break;
         case 21:
            this.actorTimerZ = 0;
            this.linkedStateMachine = null;
            if (this.actorActiveFlag) {
               this.setActorSubState(21);
            } else {
               this.setActorSubState(27);
            }

            this.exec_r_to_void();
            break;
         case 22:
            this.val_bool_s = true;
            this.setActorSubState(22);
            break;
         case 23:
            this.exec_r_int_to_void(1);
            this.val_int_Z = (this.actorTimerR & 65532) >>> 2;
            break;
         case 24:
            this.setActorSubState(1);
            this.val_bool_G = true;
            break;
         case 25:
            this.setActorSubState(5);
            this.val_bool_G = true;
            break;
         case 26:
            this.actorCounterA = 0;
            switch (this.characterId) {
               case 0:
                  this.setActorSubState(26);
                  this.actorCurrentAnimIndex = -this.actorCurrentAnimIndex;
                  break label134;
               case 1:
                  this.setActorSubState(26);
                  break label134;
               case 2:
                  this.setActorSubState(26);
                  this.actorTimerS = 1;
                  break label134;
               case 3:
                  this.setActorSubState(19);
                  break label134;
               case 4:
                  this.actorActiveFlag = false;
                  break;
               case 5:
                  exec_a_int_int_bool_bool_to_void(this.exec_a_to_int(), this.exec_b_to_int() - 55, true, false);
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
            val_coreengine_d = this;
            val_int_eu = 0;
            val_int_ev = 0;
            val_bool_aO = false;
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
            this.val_int_aa = 500;
            exec_a_arr_byte_to_void(this.scratchpadBuffer);
            this.setActorSubState(this.characterMoveFrames[this.actorSubStateG][(this.actorSubStateH << 1) + 1][0]);
            break;
         case 31:
            if (this.val_bool_E) {
               this.setActorDirection(11);
            } else {
               this.setActorSubState(11);
            }

            this.val_bool_F = false;
            exec_a_arr_byte_to_void(this.scratchpadBuffer);
            break;
         case 32:
            this.exec_r_to_void();
            this.setActorSubState(23);
            break;
         case 34:
            this.actorActiveFlag = false;
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
            this.actorActiveFlag = true;
            this.actorPhysicsArray[1] = 0;
            this.val_bool_t = true;
      }

      this.actorTimerX = 0;
      this.playerSlot = this.actorTimerW;
      this.actorTimerW = var1;
   }

   public void exec_r_to_void() {
      this.actorPhysicsArray[7] = 0;
      this.actorPhysicsArray[4] = 0;
      this.actorPhysicsArray[2] = 0;
      this.actorPhysicsArray[3] = 0;
   }

   public SpritePartSequence exec_a_to_spritepartsequence() {
      if (this.val_bool_z) {
         return this.val_spritepartsequence_e;
      } else {
         return this.spriteSequences != null && this.actorTimerV >= 0 && this.actorTimerV < this.spriteSequences.length
            ? this.spriteSequences[this.actorTimerV]
            : null;
      }
   }

   public boolean exec_h_to_bool() {
      boolean var1;
      if ((this.actorTimerR & 3) == 0) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public byte[] exec_a_to_arr_byte() {
      return this.actorSubStateH + 1 << 1 >= this.characterMoveFrames[this.actorSubStateG].length
         ? null
         : this.characterMoveFrames[this.actorSubStateG][this.actorSubStateH + 1 << 1];
   }

   public int[] exec_d_to_arr_int() {
      return this.val_arr_int_g;
   }

   public void exec_d_int_int_to_void(int var1, int var2) {
      this.actorTimerV = var1;
      this.actorTimerR = this.exec_a_to_spritepartsequence().getPartXOffset(var2);
   }

   public boolean exec_i_to_bool() {
      boolean var1;
      if (this.currentHealth <= 0) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public boolean exec_j_to_bool() {
      boolean var1;
      if (this.superMeterEnergy <= 0) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public int exec_e_to_int() {
      return this.layerDepth;
   }

   public void exec_e_int_int_to_void(int var1, int var2) {
      int var3 = this.actorPhysicsArray[0] + var1;
      this.actorPhysicsArray[0] = var3;
      var3 = this.actorPhysicsArray[1] + var2;
      this.actorPhysicsArray[1] = var3;
      var3 = this.actorPhysicsArray[8] + var1;
      this.actorPhysicsArray[8] = var3;
      var3 = this.actorPhysicsArray[9] + var2;
      this.actorPhysicsArray[9] = var3;
   }

   public boolean exec_k_to_bool() {
      return this.val_bool_p;
   }

   public void exec_s_to_void() {
      CoreEngine var1 = exec_b_coreengine_to_coreengine(this);
      CoreEngine var2 = exec_a_coreengine_to_coreengine(this);
      this.val_int_ab = this.val_int_ab + val_int_f;
      int var3 = 0;
      switch (val_int_bx) {
         case 0:
            var3 = 5;
            break;
         case 1:
            var3 = 20;
            break;
         case 2:
            var3 = 40;
      }

      switch (val_int_cz) {
         case 0:
            var3 += 5;
            break;
         case 1:
            var3 += 10;
            break;
         case 2:
            var3 += 20;
      }

      switch (val_int_bx) {
         case 0:
            var3 += val_int_cA << 3;
            break;
         case 1:
            var3 += val_int_cA * 10;
            break;
         case 2:
            var3 += val_int_cA * 12;
      }

      var3 = Math.min(100, var3);
      if (this.val_int_ab > this.val_int_ac) {
         this.val_int_ac = exec_a_int_int_to_int(700, 2000);
         this.val_int_ab = 0;
         boolean var8;
         if (exec_a_int_int_to_int(0, 100) < var3) {
            var8 = true;
         } else {
            var8 = false;
         }

         this.val_bool_C = var8;
      }

      if (this.characterId == 6) {
         var1 = this;
         var2 = exec_b_coreengine_to_coreengine(this);
         switch (var1.actorTimerW) {
            case 0:
            case 1:
            case 2:
            case 3:
               if (var1.playerSlot == 24 || var1.playerSlot == 25 || var1.playerSlot == 15) {
                  var1.updateActor(26);
                  return;
               }

               if (var2.actorTimerW == 10) {
                  if (var2.actorTimerX < 200) {
                     var1.updateActor(2);
                     return;
                  }

                  if (exec_g_to_int() < 64) {
                     var1.updateActor(21);
                     return;
                  }

                  var1.updateActor(26);
                  return;
               }

               if (var2.actorTimerW != 27 || var2.actorTimerX >= 630) {
                  if (var2.actorTimerW == 21 || var2.actorTimerW == 12) {
                     byte var6;
                     if (exec_a_int_int_to_int(0, 1) == 0) {
                        var6 = 21;
                     } else {
                        var6 = 26;
                     }

                     var1.updateActor(var6);
                     return;
                  }

                  if (var2.actorTimerW == 9) {
                     if (var2.playerSlot == 8) {
                        var1.updateActor(21);
                        return;
                     }

                     var1.updateActor(26);
                     return;
                  }

                  if (var2.actorTimerW == 6) {
                     var1.updateActor(26);
                     return;
                  }

                  if (exec_g_to_int() <= 64) {
                     switch (exec_a_int_int_to_int(0, 3)) {
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

                  if (var2.actorTimerW == 1) {
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
                  if (this.val_int_ab > 1800) {
                     switch (exec_a_int_int_to_int(0, 1)) {
                        case 0:
                           this.updateActor(26);
                           break;
                        case 1:
                           if (this.exec_s_to_bool()) {
                              this.updateActor(21);
                           }
                     }
                  } else if (this.actorTimerW != 0) {
                     this.updateActor(0);
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
                  if (this.playerSlot == 15 && (var1.actorTimerW == 4 || var1.actorTimerW == 31)) {
                     this.updateActor(11);
                     return;
                  }

                  if (var1.actorTimerW == 30 && exec_g_to_int() <= 64 && (this.playerSlot == 24 || this.playerSlot == 25)) {
                     if (var2 != null) {
                        this.opposingActorRef = var2;
                        this.updateActor(17);
                        return;
                     }

                     this.updateActor(2);
                     return;
                  }

                  if (val_int_dL == 3) {
                     if (var1.actorTimerV == 22) {
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
                     if (var1.actorTimerW == 1) {
                        this.updateActor(2);
                        return;
                     }

                     if (var1.actorTimerW == 12 || var1.actorTimerW == 13 || var1.actorTimerW == 14) {
                        this.updateActor(2);
                        return;
                     }

                     if (this.actorTimerW == 3 && var1.linkedStateMachine != null && var1.linkedStateMachine.isGrounded()) {
                        this.updateActor(3);
                        return;
                     }

                     if (var1.actorTimerW == 22 && !var1.exec_i_to_bool()) {
                        if (exec_g_to_int() > 60) {
                           this.updateActor(1);
                           return;
                        }

                        this.updateActor(10);
                        return;
                     }

                     if (var1.actorTimerW == 23) {
                        if (exec_g_to_int() > 60) {
                           this.updateActor(1);
                           return;
                        }

                        this.updateActor(10);
                        return;
                     }

                     if (exec_g_to_int() > 92 && exec_g_to_int() < 106 && exec_a_int_int_to_int(0, 100) <= 10 && this.exec_s_to_bool()) {
                        this.updateActor(21);
                        return;
                     }

                     if (var1.actorTimerW == 21) {
                        if (exec_g_to_int() > 128) {
                           if (this.characterId == 1) {
                              this.updateActor(26);
                              return;
                           }

                           if (this.characterId == 0) {
                              this.updateActor(26);
                              return;
                           }

                           if (this.characterId == 5) {
                              this.updateActor(26);
                              return;
                           }

                           this.updateActor(3);
                           return;
                        }

                        if (exec_g_to_int() > 92) {
                           this.updateActor(6);
                           return;
                        }

                        this.updateActor(11);
                        return;
                     }

                     if (var2 != null && exec_a_int_int_to_int(0, 100) <= 20) {
                        this.opposingActorRef = var2;
                        this.updateActor(17);
                        return;
                     }

                     if (var1.actorTimerW == 10 && exec_g_to_int() < 60) {
                        if (var1.actorTimerX > 300) {
                           this.updateActor(10);
                           return;
                        }

                        this.updateActor(3);
                        return;
                     }

                     if (var1.actorTimerW == 5) {
                        this.updateActor(11);
                        return;
                     }

                     if (var1.actorTimerW != 6 && var1.actorTimerW != 9) {
                        if (var1.actorTimerW == 8) {
                           if (exec_g_to_int() > 128 && this.exec_s_to_bool()) {
                              this.updateActor(21);
                              return;
                           }

                           if (this.actorTimerX >= 500) {
                              this.updateActor(6);
                              return;
                           }

                           if (this.actorTimerW != 0) {
                              this.updateActor(0);
                              return;
                           }
                           break;
                        }

                        if ((var1.actorTimerW == 6 || var1.actorTimerW == 7) && exec_g_to_int() >= 100 && (this.characterId == 2 || this.characterId == 3)) {
                           if (this.characterId == 2) {
                              this.updateActor(26);
                              return;
                           }
                           break;
                        }

                        if (exec_g_to_int() < 60) {
                           if (var1.actorActiveFlag) {
                              this.actorSubStateH = 0;
                              this.actorSubStateG = exec_a_int_int_to_int(0, this.characterMoveFrames.length - 1);
                              this.updateActor(30);
                              return;
                           }

                           switch (exec_a_int_int_to_int(0, 3)) {
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

                     if (var1.actorPhysicsArray[4] > 0 && exec_g_to_int() < 48) {
                        this.updateActor(10);
                        return;
                     }

                     this.updateActor(16);
                     return;
                  }
               case 6:
                  if (this.actorTimerX > 500) {
                     this.updateActor(9);
                     return;
                  }
                  break;
               case 30:
                  if (this.val_bool_r && this.exec_a_to_arr_byte() != null && this.val_int_aa >= 150 && this.val_int_aa < 400 && this.val_bool_C) {
                     this.exec_t_to_void();
                  }
            }
         }
      }
   }

   public boolean exec_l_to_bool() {
      boolean var1;
      if (!this.val_bool_G && !this.exec_i_to_bool() && val_int_dL == 3 && exec_b_coreengine_to_coreengine(this).actorTimerW == 22) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public void exec_t_to_void() {
      this.actorSubStateH++;
      if (this.actorSubStateH < this.characterMoveFrames[this.actorSubStateG].length / 2) {
         this.superMeterEnergy = 0;
         this.updateActor(30);
      }
   }

   public boolean exec_a_arr_byte_to_bool(byte[] var1) {
      for (int var2 = 0; var2 < 2; var2++) {
         int var5 = var2;
         byte[] var4 = var1;
         byte[] var3 = this.scratchpadBuffer;
         int var6 = 0;
         int var7 = 0;
         int var8 = 0;
         byte var9 = -100;
         byte var10 = -100;
         int var12 = var5;

         boolean var10000;
         label71: {
            while (var12 < var3.length) {
               byte var13 = var3[var12];
               int var11 = var4[var4.length - 1 - var6];
               if (var9 != -100 && var13 == var9 && var8 > 0) {
                  var8++;
               } else if (var13 != var11 || var8 != 0 && var10 == var13) {
                  if (var13 == 10) {
                     var7++;
                     var8 = 0;
                  } else if (var13 != var11) {
                     break;
                  }
               } else {
                  var6++;
                  var9 = (byte)var11;
                  var8++;
                  var7 = 0;
                  var10 = (byte)var11;
               }

               var11 = var7;
               if (val_int_dL == 3) {
                  var13 = 3;
               } else {
                  var13 = 1;
               }

               if (var11 <= var13 * 9) {
                  var11 = var8;
                  if (val_int_dL == 3) {
                     var13 = 3;
                  } else {
                     var13 = 1;
                  }

                  if (var11 <= var13 * 6) {
                     if (var6 == var4.length) {
                        var10000 = true;
                        break label71;
                     }

                     var12++;
                     continue;
                  }
               }

               var10000 = false;
               break label71;
            }

            var10000 = false;
         }

         if (var10000) {
            return true;
         }
      }

      return false;
   }

   public void exec_u_to_void() {
      if (!val_bool_am || this != val_coreengine_c) {
         byte var1 = this.getActiveComboByte();
         byte var2 = -1;
         boolean var3 = false;
         if (this.characterId == 0
            && this.exec_t_to_bool()
            && !this.actorActiveFlag
            && (this.actorTimerW == 6 || this.actorTimerW == 8 || this.actorTimerW == 7 || this.actorTimerW == 9)
            && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[1])) {
            var2 = 26;
            var3 = true;
         } else {
            boolean var4;
            if (this.spriteTransformLookupC == null
               || this.actorTimerW != 6
                  && this.actorTimerW != 7
                  && this.actorTimerW != 8
                  && this.actorTimerW != 9
                  && (this.actorTimerW != 36 || this.playerSlot != 9)) {
               var4 = false;
            } else {
               var4 = true;
            }

            if (var4 && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[0])) {
               var2 = 21;
               var3 = true;
            }
         }

         if (var2 == -1) {
            switch (this.actorTimerW) {
               case 0:
               case 1:
               case 2:
               case 3:
               case 16:
                  if (this.exec_l_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[3])) {
                     var2 = 33;
                     var3 = true;
                  } else if (this.exec_m_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[2])) {
                     var2 = 28;
                     var3 = true;
                  } else if (this.exec_t_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[1])) {
                     var2 = 26;
                     var3 = true;
                  } else if (exec_a_coreengine_to_coreengine(this) != null && this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(4))) {
                     this.opposingActorRef = exec_a_coreengine_to_coreengine(this);
                     if (this.opposingActorRef != null) {
                        var2 = 17;
                        var3 = true;
                     }
                  } else if (this.exec_s_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[0])) {
                     var2 = 21;
                     var3 = true;
                  } else if (exec_g_to_int() < 64 && this.actorTimerW != 3 && this.exec_f_to_int() >= 0) {
                     this.actorSubStateG = this.exec_f_to_int();
                     this.actorSubStateH = 0;
                     var2 = 30;
                     var3 = true;
                  } else if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(0)) && !this.exec_j_to_bool()) {
                     if (this.playerSlot != 16 || this.actorTimerX > 1200) {
                        var2 = 16;
                     }
                  } else if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(3))) {
                     var2 = 11;
                  } else if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(2))) {
                     var2 = 5;
                  }
                  break;
               case 27:
                  if (exec_b_coreengine_to_coreengine(this).actorTimerT > 0) {
                     if (this.exec_t_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[1])) {
                        var2 = 26;
                        var3 = true;
                     } else if (this.exec_s_to_bool() && this.exec_a_arr_byte_to_bool(this.val_arr_arr_byte_a[0])) {
                        var2 = 21;
                        var3 = true;
                     }
                  }
            }
         }

         if (var2 == -1) {
            label189:
            switch (this.actorTimerW) {
               case 0:
                  if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(1))) {
                     var2 = 4;
                  }

                  if (var2 == -1) {
                     switch (var1) {
                        case 4:
                           var2 = 8;
                           break label189;
                        case 5:
                           var2 = 7;
                           break label189;
                        case 6:
                           var2 = 6;
                           break label189;
                        case 7:
                           var2 = 1;
                           break label189;
                        case 8:
                           var2 = 3;
                           break label189;
                        case 9:
                           var2 = 2;
                     }
                  }
                  break;
               case 1:
                  if (var1 != 7 || !this.val_bool_p) {
                     var2 = 0;
                  }
                  break;
               case 2:
                  if (var1 != 9 || !this.val_bool_p) {
                     var2 = 0;
                  }
                  break;
               case 3:
                  if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(1))) {
                     var2 = 10;
                  }

                  if (var2 == -1) {
                     switch (var1) {
                        case 4:
                           var2 = 8;
                           break label189;
                        case 5:
                           var2 = 7;
                           break label189;
                        case 6:
                           var2 = 6;
                           break label189;
                        case 7:
                           var2 = 1;
                        case 8:
                        default:
                           break label189;
                        case 9:
                           var2 = 2;
                     }
                  }
                  break;
               case 4:
                  if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(1)) && this.actorTimerX > 200 && !this.exec_r_to_bool()) {
                     var2 = 31;
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
                  if (var1 == 2 || var1 == 0 || var1 == 1) {
                     var2 = 9;
                     var3 = true;
                  }
                  break;
               case 14:
                  switch (var1) {
                     case 4:
                        var2 = 8;
                        break label189;
                     case 5:
                        var2 = 7;
                        break label189;
                     case 6:
                        var2 = 6;
                     default:
                        break label189;
                  }
               case 16:
                  switch (var1) {
                     case 4:
                        var2 = 8;
                        break;
                     case 5:
                        var2 = 7;
                        break;
                     case 6:
                        var2 = 6;
                     case 7:
                     default:
                        break;
                     case 8:
                        var2 = 3;
                        break;
                     case 9:
                        var2 = 2;
                  }

                  if (var2 == -1 && this.getActiveComboByte() != 7) {
                     var2 = 0;
                  }
                  break;
               case 30:
                  byte[] var6;
                  if (this.val_bool_r
                     && (var6 = this.exec_a_to_arr_byte()) != null
                     && this.val_int_aa >= 150
                     && this.val_int_aa < 400
                     && this.exec_a_arr_byte_to_bool(var6)) {
                     this.exec_t_to_void();
                  }
                  break;
               case 31:
                  if (this.exec_a_arr_byte_to_bool(this.exec_b_int_to_arr_byte(1)) && !this.val_bool_F) {
                     boolean var5;
                     if (!this.val_bool_E) {
                        var5 = true;
                     } else {
                        var5 = false;
                     }

                     this.val_bool_E = var5;
                     this.val_bool_F = true;
                  }
            }
         }

         if (var3) {
            exec_a_arr_byte_to_void(this.scratchpadBuffer);
         }

         if (var2 != -1) {
            this.updateActor(var2);
         }
      }
   }

   public int exec_f_to_int() {
      if (this.characterMoveFrames != null && exec_b_coreengine_to_coreengine(this).actorActiveFlag) {
         for (int var1 = 0; var1 < this.characterMoveFrames.length; var1++) {
            if (this.exec_a_arr_byte_to_bool(this.characterMoveFrames[var1][0])) {
               return var1;
            }
         }

         return -1;
      } else {
         return -1;
      }
   }

   public boolean exec_m_to_bool() {
      if (!this.exec_i_to_bool() && val_int_dL == 3 && exec_b_coreengine_to_coreengine(this).actorTimerW == 22 && this.exec_s_to_bool()) {
         switch (this.characterId) {
            case 2:
               boolean var1;
               if (exec_g_to_int() < 128) {
                  var1 = true;
               } else {
                  var1 = false;
               }

               return var1;
            default:
               return true;
         }
      } else {
         return false;
      }
   }

   public AnimationSet exec_a_to_animationset() {
      return this.val_bool_z ? this.val_animationset_f : this.currentAnimSet;
   }

   public void exec_c_graphicsadapter_to_void(GraphicsAdapter var1) {
      int var2 = (this.actorPhysicsArray[0] >> 8) - val_int_eO;
      int var3 = (this.actorPhysicsArray[1] >> 8) - exec_k_to_int();
      SpritePartSequence var4 = this.exec_a_to_spritepartsequence();
      AnimationSet var5;
      if ((var5 = this.exec_a_to_animationset()) != null && var4 != null) {
         byte var7;
         if (this.actorCurrentAnimIndex == 1) {
            var7 = 0;
         } else {
            var7 = 4;
         }

         int var6 = var7;
         if (this.actorTimerW == 18 || this.val_bool_D) {
            var6 = this.val_int_X;
            if (this.actorCurrentAnimIndex == -1) {
               switch (var6) {
                  case 0:
                     var6 = 4;
                     break;
                  case 1:
                     var6 = 7;
                     break;
                  case 2:
                     var6 = 6;
                     break;
                  case 3:
                     var6 = 5;
               }
            }
         }

         if (this.actorTimerW == 100 || this.actorTimerW == 101) {
            var1.setColor(9985856);
            int var7_x = (this.linkedStateMachine.actorBoundsArray[0] >> 8) - val_int_eO;
            int var8 = (this.linkedStateMachine.actorBoundsArray[1] >> 8) - exec_k_to_int();
            var1.drawLine(var2 + this.spriteTransformLookupB[1] * this.actorCurrentAnimIndex, var8 - 1, var7_x, var8 - 1);
            var1.drawLine(var2 + this.spriteTransformLookupB[1] * this.actorCurrentAnimIndex, var8, var7_x, var8);
         }

         if (this.val_bool_B) {
            byte var10;
            if (val_bool_d) {
               var10 = 1;
            } else {
               var10 = -1;
            }

            var2 += var10 << 1;
         }

         this.val_bool_B = false;
         var4.drawSequence(this.actorTimerR, var5, var2, var3, var6);
      }
   }

   public final boolean isActive() {
      boolean var1;
      if (!this.val_bool_A && this.actorTimerW != 23 && (this.actorTimerW != 26 || this.characterId != 5)) {
         var1 = false;
      } else {
         var1 = true;
      }

      return var1;
   }

   public final int[] getBounds() {
      return this.actorPhysicsArray;
   }

   public final boolean checkIntersect(int[] var1) {
      boolean var2 = false;
      boolean var3 = false;
      boolean var4 = false;
      boolean var5 = false;
      boolean var6 = false;
      boolean var7 = false;
      boolean var8 = false;
      boolean var9 = false;
      short var10 = 0;
      short[] var11 = val_arr_short_D;
      if (this.actorTimerW == 26) {
         switch (this.characterId) {
            case 0:
               var11 = val_arr_short_v;
               var10 = 13;
               var3 = true;
               break;
            case 1:
               var11 = val_arr_short_u;
               var10 = 12;
               var2 = true;
               break;
            case 2:
               var8 = true;
               break;
            case 3:
               var11 = val_arr_short_B;
               var10 = 15;
               var6 = true;
               var2 = true;
               var5 = true;
               break;
            case 4:
               var11 = val_arr_short_B;
               var10 = 17;
               var6 = true;
               var2 = true;
               var5 = true;
            case 5:
            default:
               break;
            case 6:
               var11 = val_arr_short_C;
               var10 = 14;
               var6 = true;
               var2 = true;
               var5 = true;
               var4 = true;
         }
      } else {
         switch (this.actorTimerW) {
            case 4:
            case 31:
               var6 = true;
               var10 = 5;
               if (this.characterId == 6) {
                  var11 = val_arr_short_C;
                  var10 = 14;
                  var2 = true;
                  var5 = true;
                  var4 = true;
               }
               break;
            case 5:
               var10 = 15;
               if (this.characterId == 6) {
                  var11 = val_arr_short_C;
                  var2 = true;
                  var10 = 14;
                  var5 = true;
                  var4 = true;
                  var6 = true;
               }
               break;
            case 9:
               var11 = val_arr_short_z;
               var2 = true;
               var10 = 14;
               var5 = true;
               var6 = true;
               break;
            case 10:
               var11 = val_arr_short_w;
               var2 = true;
               var10 = 20;
               var5 = true;
               var7 = true;
               break;
            case 11:
               var11 = val_arr_short_y;
               var2 = true;
               var10 = 10;
               var9 = true;
               break;
            case 30:
               byte[] var12;
               if ((var12 = this.characterMoveFrames[this.actorSubStateG][(this.actorSubStateH << 1) + 1])[3] == 1) {
                  var11 = val_arr_short_A;
               } else if (var12[3] == 2) {
                  var11 = val_arr_short_B;
               }

               var5 = true;
               boolean var13;
               if (var12[3] > 0) {
                  var13 = true;
               } else {
                  var13 = false;
               }

               var2 = var13;
               var10 = var12[2];
               if (var12[4] == 1) {
                  var6 = true;
               } else {
                  var6 = false;
               }

               if (var12[4] == 2) {
                  var7 = true;
               } else {
                  var7 = false;
               }
         }
      }

      if (this.characterId == 6) {
         var10 <<= 1;
      }

      var1[0] = var11[0] << 8;
      var1[1] = var11[1] << 8;
      var1[3] = var11[2];
      var1[5] = var10;
      short var22;
      if (var2) {
         var22 = 256;
      } else {
         var22 = 0;
      }

      var1[4] = var22;
      int var23 = var1[4];
      if (var3) {
         var10 = 128;
      } else {
         var10 = 0;
      }

      var1[4] = var23 | var10;
      int var24 = var1[4];
      int var15;
      if (var4) {
         var15 = 2;
      } else {
         var15 = 0;
      }

      var1[4] = var24 | var15;
      int var25 = var1[4];
      if (var5) {
         var15 = 8192;
      } else {
         var15 = 0;
      }

      var1[4] = var25 | var15;
      int var26 = var1[4];
      if (var6) {
         var15 = 2048;
      } else {
         var15 = 0;
      }

      var1[4] = var26 | var15;
      int var27 = var1[4];
      if (var7) {
         var15 = 4096;
      } else {
         var15 = 0;
      }

      var1[4] = var27 | var15;
      int var28 = var1[4];
      int var19;
      if (var8) {
         var19 = 1;
      } else {
         var19 = 0;
      }

      var1[4] = var28 | var19;
      int var29 = var1[4];
      if (var9) {
         var19 = (byte)4;
      } else {
         var19 = (byte)0;
      }

      var1[4] = var29 | var19;
      int var30 = var1[4];
      if (var9) {
         var19 = 16384;
      } else {
         var19 = 0;
      }

      var1[4] = var30 | var19;
      var1[2] = this.actorTimerW;
      return true;
   }

   public final boolean checkHitBox(int var1, int[] var2, int var3) {
      int var4;
      int var5;
      short[] var6;
      var4 = this.exec_a_to_int();
      var5 = this.exec_b_to_int();
      var6 = null;
      label102:
      switch (var1) {
         case 0:
            switch (this.actorTimerW) {
               case 3:
               case 11:
               case 13:
               case 14:
                  var6 = val_arr_short_i;
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
                  var6 = val_arr_short_n;
                  break label102;
               case 6:
               case 7:
               case 8:
               case 9:
               case 35:
               case 36:
                  var6 = val_arr_short_m;
                  break label102;
               case 21:
                  if (this.actorActiveFlag) {
                     var6 = val_arr_short_n;
                  } else {
                     var6 = val_arr_short_m;
                  }

                  var6 = var6;
                  break label102;
               case 26:
                  if (this.characterId == 1) {
                     var6 = val_arr_short_j;
                  } else if (this.characterId == 3) {
                     var6 = val_arr_short_k;
                  } else {
                     if (this.characterId == 5) {
                        return false;
                     }

                     if (this.characterId == 6) {
                        var6 = val_arr_short_i;
                     } else {
                        var6 = val_arr_short_l;
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
                     var6 = val_arr_arr_short_e[this.characterId];
                  }
                  break;
               case 5:
                  if (this.exec_a_int_to_bool(290)) {
                     var6 = val_arr_arr_short_f[this.characterId];
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
                  if (this.actorTimerX > 80) {
                     var6 = val_arr_arr_short_c[this.characterId];
                  }
                  break;
               case 10:
                  if (this.exec_a_int_to_bool(200)) {
                     var6 = val_arr_short_o;
                  }
                  break;
               case 11:
                  if (this.exec_a_int_to_bool(300)) {
                     var6 = val_arr_arr_short_d[this.characterId];
                  }
                  break;
               case 26:
                  if (this.characterId == 1 && this.actorTimerX > 100) {
                     var6 = val_arr_short_p;
                  } else if (this.characterId == 0) {
                     var6 = val_arr_short_q;
                  } else if (this.characterId == 3) {
                     if (this.actorTimerV == 26) {
                        var6 = val_arr_short_r;
                     }
                  } else if (this.characterId == 4 && this.actorTimerX > 0) {
                     var6 = val_arr_short_E;
                  } else if (this.characterId == 6 && this.actorTimerX > 250) {
                     var6 = val_arr_short_F;
                  } else if (this.characterId == 2 && this.actorTimerX > 250) {
                     var6 = val_arr_short_s;
                  }
                  break;
               case 30:
                  byte[] var7 = this.characterMoveFrames[this.actorSubStateG][(this.actorSubStateH << 1) + 1];
                  if (this.actorTimerX >= 20 * var7[1] && this.actorTimerX < 20 * var7[1] + 200) {
                     var6 = val_arr_short_t;
                  }
            }
      }

      if (var6 != null) {
         var2[var3] = var5 + var6[0];
         var2[var3 + 3] = var5 + var6[3];
         if (this.actorCurrentAnimIndex == 1) {
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

   public boolean exec_a_int_to_bool(int var1) {
      boolean var2;
      if (this.actorTimerX >= var1 && this.actorTimerX < var1 + 140) {
         var2 = true;
      } else {
         var2 = false;
      }

      return var2;
   }

   public final int getStateValue(int var1) {
      return this.actorTimerW != 18 && this.actorTimerW != 19 ? 1 : 0;
   }

   public final boolean testCollision(int[] var1) {
      boolean var2 = false;
      byte var3 = 0;
      int var4 = 0;
      int var5 = 0;
      int var6 = 0;
      if (this.actorTimerW == 26) {
         switch (this.characterId) {
            case 0:
               if (!this.val_bool_s) {
                  if (this.val_bool_w) {
                     var5 = -(4096 * this.actorCurrentAnimIndex);
                     var6 = 20480;
                     var4 = 800;
                     this.actorActiveFlag = false;
                     var2 = true;
                     this.val_bool_s = true;
                     this.actorTimerX = 0;
                  } else {
                     var5 = 32768 * this.actorCurrentAnimIndex;
                     var6 = 8192;
                     var4 = 500;
                     this.actorActiveFlag = false;
                     var2 = true;
                     this.val_bool_s = true;
                  }
               }
         }
      } else if (this.actorTimerW == 17 && this.characterId == 5 && this.actorActiveFlag && this.actorTimerX < 750 && this.actorTimerX > 100) {
         var5 = -(4096 * this.actorCurrentAnimIndex);
         var6 = 32768;
         var4 = 750;
         this.actorActiveFlag = false;
         var2 = true;
         this.val_bool_s = true;
      }

      if (this.val_bool_t) {
         var3 = 120;
         var4 = 100;
         var5 = 0;
         var6 = -768;
         this.val_bool_t = false;
         var2 = true;
      } else if (!this.actorActiveFlag || this.actorTimerW != 8 && this.actorTimerW != 7 && this.actorTimerW != 6) {
         if ((this.actorTimerW == 12 || this.actorTimerW == 19 || this.actorTimerW == 22) && !this.val_bool_s) {
            if (this.actorTimerW == 12 && this.actorCounterB >= 2) {
               var4 = this.val_int_S * 204 >> 8;
               var5 = this.val_int_Q * 204 >> 8;
               var6 = this.val_int_R * 204 >> 8;
            } else {
               var4 = this.val_int_S;
               var5 = this.val_int_Q;
               var6 = this.val_int_R;
            }

            this.actorActiveFlag = false;
            this.val_bool_s = true;
            var2 = true;
         }
      } else {
         if (this.actorTimerW == 7) {
            var6 = 0;
         } else {
            var6 = this.actorCurrentAnimIndex;
         }

         var5 = var6;
         if (this.actorTimerW == 8) {
            var5 = -var6;
         }

         var5 *= 28672;
         var6 = 28672;
         var4 = 800;
         this.actorActiveFlag = false;
         var2 = true;
      }

      if (var2) {
         var1[0] = 5;
         var1[1] = var3;
         var1[2] = var4;
         var1[3] = var5;
         var1[4] = var6;
         return true;
      } else {
         return false;
      }
   }

   public final int interactWithEntity(EntityInterface var1, int[] var2) {
      val_coreengine_e = this;
      if (var1 instanceof CoreEngine) {
         CoreEngine var36;
         (var36 = (CoreEngine)var1).checkIntersect(var2);
         int var19 = var2[5];
         exec_e_coreengine_to_void(this);
         byte var16 = 15;
         int var4 = var2[4];
         boolean var5 = (var4 & 256) != 0;
         boolean var6 = (var4 & 4) != 0;
         boolean var7 = (var4 & 128) != 0;
         boolean var8 = (var4 & 2) != 0;
         boolean var21 = (var4 & 1) != 0;
         boolean var24 = (var4 & 16384) != 0;
         int var27 = var36.actorCurrentAnimIndex;
         this.val_int_Q = var2[0] * var27;
         this.val_int_R = var2[1];
         this.val_int_S = var2[3];
         if (!this.actorActiveFlag || var5) {
            var16 = 12;
            this.actorCounterB++;
         }

         if (var16 != 12 && var7) {
            var16 = 27;
         }

         if (var21) {
            var16 = 34;
         }

         var21 = false;
         if (!this.exec_a_bool_to_bool(var6) && !this.exec_b_bool_to_bool(var6)) {
            this.updateActor(var16);
         } else {
            if (var8) {
               this.updateActor(27);
            } else if (!var6 && !this.exec_n_to_bool()) {
               this.updateActor(24);
            } else {
               this.updateActor(25);
            }

            var21 = true;
         }

         if (var19 > 0) {
            if (var21) {
               if (this.exec_b_bool_to_bool(var6)) {
                  var19 <<= 1;
               }

               this.exec_s_int_to_void(var19 / 3);
            } else {
               this.exec_s_int_to_void(var19);
            }

            var36.val_bool_x = true;
         }

         if (var24) {
            if (var21) {
               this.actorCounterD++;
            } else {
               this.actorCounterC++;
            }
         }

         if (var21) {
            var36.val_bool_w = true;
            if (exec_b_coreengine_to_coreengine(this).actorTimerW == 26) {
               exec_b_coreengine_to_coreengine(this).exec_b_int_to_bool(12);
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
                  exec_M_int_to_void(100);
                  this.exec_b_int_to_bool(6);
                  break;
               case 26:
                  if (exec_b_coreengine_to_coreengine(this).characterId == 6) {
                     this.exec_b_int_to_bool(6);
                  } else if (exec_b_coreengine_to_coreengine(this).characterId == 1) {
                     this.exec_b_int_to_bool(5);
                  } else {
                     exec_b_coreengine_to_coreengine(this).exec_b_int_to_bool(11);
                  }
                  break;
               case 30:
                  if (!var5 && var36.actorTimerV != 25) {
                     this.exec_b_int_to_bool(5);
                  } else {
                     this.exec_b_int_to_bool(6);
                  }
            }

            switch (var36.actorTimerW) {
               case 4:
               case 31:
                  var36.actorCounterE += 500;
                  break;
               case 5:
                  var36.actorCounterE += 2000;
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
                  var36.actorCounterE += 2000;
                  break;
               case 10:
                  var36.actorCounterE += 2000;
                  break;
               case 11:
                  var36.actorCounterE += 1000;
                  break;
               case 26:
                  var36.actorCounterE += 2000;
                  break;
               case 30:
                  var36.actorCounterE += 500;
            }

            if ((var4 & 8192) != 0) {
               val_int_eW = 300;
            }

            this.actorCurrentAnimIndex = -var27;
            byte var37 = -1;
            if ((var4 & 4096) != 0) {
               var37 = 0;
            } else if ((var4 & 2048) != 0) {
               if (this.actorCurrentAnimIndex == 1) {
                  var37 = 2;
               } else {
                  var37 = 1;
               }
            }

            if (var37 >= 0) {
               var27 = this.exec_a_to_int();
               int var24_val = (this.characterId == 5) ? 1 : 0;
               exec_a_int_int_int_int_to_void(var37, var27, -87, var24_val);
            }
         }

         return 0;
      } else {
         if (!(var1 instanceof ActorStateMachine)) {
            return 0;
         }

         ActorStateMachine var12 = (ActorStateMachine)var1;
         boolean var11 = this.exec_a_bool_to_bool(false);
         int var10 = val_arr_int_bj[var12.actorActionFrame];
         int var9 = this.actorCurrentAnimIndex;
         byte var20;
         switch (var12.actorActionFrame) {
            case 0:
               if (!var11) {
                  if (var9 == -1) {
                     var20 = 2;
                  } else {
                     var20 = 1;
                  }
                  break;
               }
            default:
               var20 = -1;
         }

         if (var10 > 0) {
            exec_e_coreengine_to_void(this);
            exec_M_int_to_void(100);
         }

         if (!var11 && !this.exec_b_bool_to_bool(false)) {
            var12.val_coreengine_b.actorCounterE += 2000;
            this.exec_s_int_to_void(var10);
            if (var12.val_coreengine_b != null && var12.val_coreengine_b.characterId == 5) {
               this.exec_b_int_to_bool(14);
            } else {
               var12.val_coreengine_b.exec_b_int_to_bool(8);
            }

            CoreEngine var14 = this;
            ActorStateMachine var18 = var12;
            if (!var12.isActorActive) {
               var18.val_coreengine_a = var14;
               var14 = var18.val_coreengine_b;
               short var17;
               if ((var17 = var18.val_coreengine_b.spriteTransformLookupB[0]) == 0) {
                  if (var14.actorTimerW == 21) {
                     var14.updateActor(101);
                     var14.linkedStateMachine.val_coreengine_a.updateActor(102);
                  }
               } else if (var17 == 1) {
                  if (var14.linkedStateMachine.val_coreengine_a.actorTimerW == 23) {
                     var14.updateActor(23);
                     var14.linkedStateMachine.val_coreengine_a.actorTimerX = 3500;
                  } else {
                     if (var14.actorTimerW != 23 && var14.actorTimerW == 21) {
                        var14.updateActor(0);
                     }

                     var14.linkedStateMachine.val_coreengine_a.updateActor(23);
                  }
               } else if (var17 == 2) {
                  var14.linkedStateMachine.val_coreengine_a.updateActor(27);
               }

               var18.isActorActive = true;
               var18.setActionFrame(1);
               if (var18.actorActionFrame == 3) {
                  var18.setPosition(var18.val_coreengine_a.exec_a_to_int(), var18.val_coreengine_a.exec_b_to_int() + -12);
                  var18.actorFacingDirection = -var18.val_coreengine_a.actorCurrentAnimIndex;
               } else if (var18.actorActionFrame != 5 && var18.actorActionFrame != 4) {
                  if (var18.actorActionFrame == 6) {
                     var18.val_coreengine_a.updateActor(12);
                     var18.val_coreengine_a.exec_a_arr_short_to_void(val_arr_short_C);
                  }
               } else if (var18.val_coreengine_a.actorActiveFlag) {
                  var18.val_coreengine_a.updateActor(27);
               } else {
                  var18.val_coreengine_a.updateActor(12);
                  var18.val_coreengine_a.exec_a_arr_short_to_void(val_arr_short_B);
               }
            }
         } else {
            if (this.actorTimerW != 3 && this.actorTimerW != 3) {
               this.updateActor(24);
            } else {
               this.updateActor(25);
            }

            this.exec_s_int_to_void(var10 / 3);
            CoreEngine var13 = this;
            ActorStateMachine var3 = var12;
            label253:
            if (!var12.isActorActive) {
               var3.isActorActive = true;
               if (var3.actorActionFrame == 3) {
                  var3.val_coreengine_a = var13;
                  var3.setPosition(var3.val_coreengine_a.exec_a_to_int(), var3.val_coreengine_a.exec_b_to_int() + -12);
                  var3.actorFacingDirection = -var3.val_coreengine_a.actorCurrentAnimIndex;
               } else if (var3.actorActionFrame == 1) {
                  var3.val_coreengine_a = var13;
                  var3.setPosition(var3.val_coreengine_a.exec_a_to_int(), var3.getPosY());
               } else if (var3.actorActionFrame == 6) {
                  var3.val_coreengine_a = var13;
                  var13.updateActor(27);
               } else if (var3.actorActionFrame == 5 || var3.actorActionFrame == 4) {
                  var3.val_coreengine_a = var13;
                  var3.setActionFrame(1);
                  break label253;
               }

               var3.setActionFrame(2);
            }

            if (var12.val_coreengine_b == null) {
               this.exec_b_int_to_bool(1);
            } else {
               var12.val_coreengine_b.exec_b_int_to_bool(9);
            }
         }

         if (var20 >= 0) {
            int var35 = this.exec_a_to_int();
            int var11_y = this.exec_b_to_int() + -87;
            int var23_val = (this.characterId == 5) ? 1 : 0;
            exec_a_int_int_int_int_to_void(var20, var35, var11_y, var23_val);
         }

         return 0;
      }
   }

   public boolean exec_b_int_to_bool(int var1) {
      byte var2;
      if ((var2 = val_arr_arr_byte_x[this.characterId][var1]) == -1) {
         return false;
      }

      exec_a_byte_bool_to_void((byte)var2, false);
      return true;
   }

   public boolean exec_a_bool_to_bool(boolean var1) {
      if (this.val_bool_p && this.exec_o_to_bool()) {
         boolean var2;
         if (this.layerDepth == 0) {
            if (this.getActiveComboByte() == 9) {
               var2 = true;
            } else {
               var2 = false;
            }
         } else {
            var2 = this.val_bool_C;
         }

         if (var2 && !var1 || this.exec_n_to_bool()) {
            return true;
         }
      }

      return false;
   }

   public boolean exec_n_to_bool() {
      if (this.layerDepth == 0) {
         boolean var1;
         if (this.getActiveComboByte() == 8) {
            var1 = true;
         } else {
            var1 = false;
         }

         return var1;
      } else {
         return this.val_bool_C;
      }
   }

   public boolean exec_o_to_bool() {
      boolean var1;
      if (!this.actorActiveFlag
         || this.actorTimerW != 2
            && this.actorTimerW != 0
            && this.actorTimerW != 1
            && this.actorTimerW != 3
            && this.actorTimerW != 16
            && this.actorTimerW != 14
            && this.actorTimerW != 27
            && this.actorTimerW != 25
            && this.actorTimerW != 24) {
         var1 = false;
      } else {
         var1 = true;
      }

      return var1;
   }

   public boolean exec_b_bool_to_bool(boolean var1) {
      if (this.exec_o_to_bool() && !this.exec_a_bool_to_bool(var1)) {
         if (this.playerSideIndex != 1 || this.layerDepth != 0 || val_bool_am && this == val_coreengine_c) {
            var1 = false;
         } else {
            var1 = true;
         }

         if (var1) {
            return true;
         }
      }

      return false;
   }

   public void exec_s_int_to_void(int var1) {
      if (exec_b_coreengine_to_coreengine(this) == null || exec_b_coreengine_to_coreengine(this).currentHealth > 0) {
         if (this.characterId == 6) {
            var1 /= 2;
         }

         this.currentHealth -= var1;
         this.actorTimerU += var1;
         if (this.currentHealth < 0) {
            this.currentHealth = 0;
         }
      }
   }

   public final void applyAction(int var1) {
      switch (var1) {
         case 2:
            this.val_bool_u = true;
            return;
         case 4:
            this.val_bool_v = true;
         default:
            return;
         case 8:
            this.actorActiveFlag = true;
      }
   }

   public final void updateTick() {
      this.val_bool_r = true;
      this.val_int_ad = this.actorTimerX;
      if (this.characterId != 0 || this.actorTimerW != 26) {
         if (!this.actorActiveFlag) {
            this.val_bool_t = true;
         }
      }
   }

   public final int exec_a_to_int() {
      return this.actorPhysicsArray[0] >> 8;
   }

   public final int exec_b_to_int() {
      return this.actorPhysicsArray[1] >> 8;
   }

   public byte[] exec_b_int_to_arr_byte(int var1) {
      return val_arr_arr_arr_byte_c[this.playerSideIndex][var1];
   }

   public boolean exec_p_to_bool() {
      boolean var1;
      if ((this.exec_a_to_int() >= val_int_as + 48 || this.actorCurrentAnimIndex != 1)
         && (this.exec_a_to_int() <= val_int_at - 48 || this.actorCurrentAnimIndex != -1)) {
         var1 = false;
      } else {
         var1 = true;
      }

      return var1;
   }

   public boolean exec_q_to_bool() {
      boolean var1;
      if ((this.actorTimerW != 26 || this.characterId != 0 || this.val_bool_r) && (this.actorTimerW != 26 || this.characterId != 5)) {
         var1 = false;
      } else {
         var1 = true;
      }

      return var1;
   }

   public boolean exec_r_to_bool() {
      boolean var1;
      if (this.characterId == 6) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public final boolean isAlive() {
      boolean var1;
      if (this.actorActiveFlag && this.actorTimerW != 12 && this.actorTimerW != 9) {
         var1 = false;
      } else {
         var1 = true;
      }

      return var1;
   }

   public void exec_a_arr_short_to_void(short[] var1) {
      this.val_int_Q = -this.actorCurrentAnimIndex * var1[0] << 8;
      this.val_int_R = var1[1] << 8;
      this.val_int_S = var1[2];
      this.val_bool_s = false;
   }

   public boolean exec_s_to_bool() {
      boolean var1;
      if (exec_b_coreengine_to_coreengine(this).actorTimerW == 19 || this.linkedStateMachine != null && this.linkedStateMachine.isGrounded()) {
         var1 = false;
      } else {
         var1 = true;
      }

      if (this.characterId != 0) {
         return var1;
      }

      if (!var1 || val_int_dL == 2 && exec_b_coreengine_to_coreengine(this).actorTimerW == 22) {
         var1 = false;
      } else {
         var1 = true;
      }

      return var1;
   }

   public boolean exec_t_to_bool() {
      if (this.characterId == 0) {
         boolean var2;
         if (this.actorCounterA > 2000) {
            var2 = true;
         } else {
            var2 = false;
         }

         return var2;
      } else if (this.characterId == 2) {
         boolean var1;
         if (exec_b_coreengine_to_coreengine(this).actorCounterB <= 0) {
            var1 = true;
         } else {
            var1 = false;
         }

         return var1;
      } else {
         return true;
      }
   }

   public boolean exec_u_to_bool() {
      boolean var1;
      if (this.actorLifecycleState == 2) {
         var1 = true;
      } else {
         var1 = false;
      }

      return var1;
   }

   public static void exec_a_coreengine_to_void(CoreEngine var0) {
      var0.actorTimerX = var0.actorTimerX + val_int_e;
      CoreEngine var7 = var0;
      var0.energyDrainFlag = var0.energyDrainFlag + val_int_e;
      if (var7.energyDrainFlag > 3000) {
         var7.adjustEnergyMeter(val_int_e * 19200 / 1000);
      }

      var7 = var0;
      var0.val_int_Y = var0.val_int_Y + val_int_e;
      if (!var7.actorActiveFlag || var7.actorTimerW == 13 || var7.actorTimerW == 14) {
         var7.val_int_Y = 0;
      }

      var0.actorTimerZ = var0.actorTimerZ + val_int_e;
      var0.actorCounterA = var0.actorCounterA + val_int_e;
      if (var0.exec_a_bool_to_bool(false)) {
         exec_b_coreengine_to_void(var0);
      }

      var0.actorTimerY = var0.actorTimerY + val_int_e;
      var7 = var0;
      int var9 = var0.getActiveComboByte();

      byte[] var51 = var7.scratchpadBuffer;
      for (int var8 = var51.length - 2; var8 >= 0; var8--) {
         var51[var8 + 1] = var51[var8];
      }

      var51[0] = (byte)var9;
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

      label1033:
      switch (var0.actorTimerW) {
         case 0:
            if (var0.exec_i_to_bool()) {
               if (val_int_dL == 3) {
                  var0.updateActor(22);
               } else {
                  var0.updateActor(12);
                  var0.val_bool_s = true;
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
               var0.val_bool_s = true;
            }
            break;
         case 4:
            if (var0.exec_s_to_bool() && var0.exec_a_arr_byte_to_bool(var0.val_arr_arr_byte_a[0])) {
               var0.updateActor(21);
            } else if (var0.exec_t_to_bool() && var0.exec_a_arr_byte_to_bool(var0.val_arr_arr_byte_a[1])) {
               var0.updateActor(26);
            } else if (var0.val_bool_F) {
               if (var0.actorTimerX > 200) {
                  var0.updateActor(31);
               }
            } else if (var0.exec_h_to_bool()) {
               var0.updateActor(0);
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
            if (var0.actorActiveFlag && var0.actorTimerX > 500) {
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
            if (var0.actorTimerX > 200 && var0.actorActiveFlag) {
               var0.updateActor(13);
            }
            break;
         case 13:
            if (var0.actorTimerX > 150 && (!var0.exec_i_to_bool() || val_int_dL == 3)) {
               var0.updateActor(14);
            }
            break;
         case 14:
            if (var0.exec_h_to_bool()) {
               if (!var0.exec_i_to_bool()) {
                  var0.updateActor(0);
               } else if (val_int_dL == 3) {
                  var0.updateActor(22);
               } else {
                  var0.updateActor(13);
               }
            }
            break;
         case 15:
            if (var0.exec_h_to_bool()
               && (
                  exec_b_coreengine_to_coreengine(var0) == null
                     || exec_b_coreengine_to_coreengine(var0).actorTimerW != 30
                     || exec_b_coreengine_to_coreengine(var0).actorSubStateH <= 0
               )) {
               var0.updateActor(0);
            }
            break;
         case 16:
            if (var0.exec_j_to_bool()) {
               var0.updateActor(0);
            }
            break;
         case 17:
            var7 = var0;
            boolean var55;
            if (var0.actorTimerX > var7.val_arr_int_g[0]) {
               var55 = true;
            } else {
               var55 = false;
            }

            if (var55 && var0.opposingActorRef.actorTimerW == 18) {
               int[] var1 = var0.exec_d_to_arr_int();
               var0.opposingActorRef.val_bool_s = false;
               var0.opposingActorRef.val_int_Q = -((var1[2] << 8) * var0.actorCurrentAnimIndex);
               var0.opposingActorRef.val_int_R = var1[3] << 8;
               var0.opposingActorRef.val_int_S = var1[4];
               var0.opposingActorRef.updateActor(19);
               exec_a_coreengine_arr_int_int_int_int_int_to_void(
                  var0.opposingActorRef,
                  var1,
                  var0.spriteSequences[16].getFrameCount() - 1,
                  var0.exec_a_to_int(),
                  var0.exec_b_to_int(),
                  -var0.actorCurrentAnimIndex
               );
               if (var0.characterId == 5) {
                  exec_aq_to_void();
               }
            }

            var7 = var0;
            boolean var57;
            if (var0.exec_h_to_bool() && var7.actorTimerX > var7.val_arr_int_g[1]) {
               var57 = true;
            } else {
               var57 = false;
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
            var7 = var0;
            boolean var53;
            if (!var0.exec_h_to_bool()
               || (!var7.actorActiveFlag || var7.actorTimerX <= val_arr_int_bg[var7.characterId]) && (var7.actorActiveFlag || var7.actorTimerX <= 450)) {
               var53 = false;
            } else {
               var53 = true;
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
            if (val_int_dL != 3
               && val_int_dL != 4
               && !var0.exec_i_to_bool()
               && (var0.actorTimerX > 1300 || !exec_b_coreengine_to_coreengine(var0).actorActiveFlag)) {
               var0.updateActor(0);
            }
            break;
         case 23:
            if (var0.actorTimerX > 3500) {
               if (var0.actorActiveFlag) {
                  var0.updateActor(0);
               } else {
                  var0.updateActor(35);
               }
            }
            break;
         case 24:
            if (var0.actorTimerX > 300) {
               var0.updateActor(0);
            }
            break;
         case 25:
            if (var0.actorTimerX > 300) {
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
                  if (var0.actorActiveFlag && var0.actorTimerX > 500) {
                     var0.updateActor(0);
                  }
                  break label1033;
               case 1:
                  if (var0.actorTimerX > 750) {
                     var0.updateActor(0);
                  }
                  break label1033;
               case 2:
                  if (var0.actorTimerX > 3000
                     || exec_b_coreengine_to_coreengine(var0).actorTimerW == 34 && exec_b_coreengine_to_coreengine(var0).actorTimerX > 800) {
                     var0.updateActor(0);
                  }
               case 3:
               default:
                  break label1033;
               case 4:
                  if (var0.actorTimerX > 800) {
                     var0.actorActiveFlag = true;
                     var0.updateActor(0);
                  }
                  break label1033;
               case 5:
                  if (var0.actorTimerV == 27 && var0.exec_h_to_bool()) {
                     var0.updateActor(0);
                  }
                  break label1033;
               case 6:
                  if (var0.actorTimerX > 700) {
                     var0.updateActor(0);
                  }
                  break label1033;
            }
         case 27:
            if (var0.actorTimerX > 630) {
               if (var0.actorActiveFlag) {
                  var0.updateActor(0);
               } else {
                  var0.updateActor(35);
               }
            }
            break;
         case 30:
            if (var0.exec_h_to_bool() && var0.actorTimerX >= 600) {
               var0.updateActor(0);
            }
            break;
         case 31:
            if (var0.exec_s_to_bool() && var0.exec_a_arr_byte_to_bool(var0.val_arr_arr_byte_a[0])) {
               var0.updateActor(21);
            } else if (var0.exec_t_to_bool() && var0.exec_a_arr_byte_to_bool(var0.val_arr_arr_byte_a[1])) {
               var0.updateActor(26);
            } else if (var0.val_bool_F) {
               if (var0.val_bool_E && var0.actorTimerX >= 250 || !var0.val_bool_E && var0.actorTimerX >= 400) {
                  var0.updateActor(31);
                  var0.val_bool_F = false;
               }
            } else if (var0.exec_h_to_bool() && var0.actorTimerX > 700) {
               var0.updateActor(0);
            }
            break;
         case 32:
            if (var0.actorTimerX > 2500) {
               if (var0.actorActiveFlag) {
                  var0.updateActor(0);
               } else {
                  var0.updateActor(35);
               }
            }
            break;
         case 34:
            if (var0.actorTimerX > 3000) {
               var0.updateActor(35);
            }
            break;
         case 35:
            if (var0.actorActiveFlag) {
               var0.actorActiveFlag = true;
               var0.updateActor(13);
               var0.setActorPosition(var0.exec_a_to_int(), 0);
            }
            break;
         case 36:
            if (var0.actorActiveFlag) {
               var0.actorActiveFlag = true;
               var0.updateActor(0);
               var0.setActorPosition(var0.exec_a_to_int(), 0);
            }
            break;
         case 100:
            if (var0.exec_h_to_bool() && exec_g_to_int() <= 64) {
               var0.updateActor(0);
               var0.linkedStateMachine.val_coreengine_a.updateActor(22);
               var0.linkedStateMachine.setFacingDirection(3);
            }
            break;
         case 101:
            if (var0.actorTimerX > 300) {
               var0.updateActor(100);
            }
            break;
         case 102:
            if (exec_b_coreengine_to_coreengine(var0).actorTimerW != 21
               && exec_b_coreengine_to_coreengine(var0).actorTimerW != 101
               && exec_b_coreengine_to_coreengine(var0).actorTimerW != 100
               && var0.actorTimerX > 300) {
               var0.updateActor(0);
            }
      }

      label961:
      switch (var0.actorTimerW) {
         case 0:
            if (var0.actorTimerV == 1 && var0.exec_h_to_bool()) {
               var0.setActorSubState(0);
            }
            break;
         case 1:
            exec_a_entityinterface_int_int_to_void(var0, 28672 * var0.actorCurrentAnimIndex * val_int_e / 1000, 0);
            break;
         case 2:
            exec_a_entityinterface_int_int_to_void(var0, -28672 * var0.actorCurrentAnimIndex * val_int_e / 1000, 0);
            break;
         case 3:
            if (var0.actorTimerV == 5 && var0.exec_h_to_bool()) {
               var0.setActorHealthDelta(4);
            }
            break;
         case 6:
            if (var0.actorTimerV == 17 && var0.actorTimerX >= 100) {
               var0.setActorSubState(18);
            }
            break;
         case 8:
            if (var0.actorTimerV == 17 && var0.actorTimerX >= 100) {
               var0.setActorDirection(18);
            }
            break;
         case 10:
            if (var0.val_bool_r && var0.actorTimerX < 1000) {
               int var28 = Math.min(5, var0.spriteSequences[var0.actorTimerV].getFrameCount() - 1);
               var0.actorTimerR = var0.exec_a_to_spritepartsequence().getPartXOffset(var28);
            }
            break;
         case 12:
            if (var0.actorPhysicsArray[0] == 0) {
               exec_a_entityinterface_int_int_to_void(var0, 0, 7680 * val_int_e / 1000);
            } else if (var0.actorTimerX < var0.actorPhysicsArray[3] / 3) {
               var0.setActorSubState(3);
            }
            break;
         case 16:
            exec_a_entityinterface_int_int_to_void(var0, 57344 * var0.actorCurrentAnimIndex * val_int_e / 1000, 0);
            var0.adjustEnergyMeter(-25600 * val_int_e / 1000);
            break;
         case 17:
            if (var0.opposingActorRef.actorTimerW == 18) {
               int[] var27 = var0.exec_d_to_arr_int();
               int var21 = exec_j_int_to_int(var0.actorTimerR);
               exec_a_coreengine_arr_int_int_int_int_int_to_void(
                  var0.opposingActorRef, var27, var21, var0.exec_a_to_int(), var0.exec_b_to_int(), -var0.actorCurrentAnimIndex
               );
            }
            break;
         case 21:
            short[] var25;
            if (var0.actorActiveFlag) {
               var25 = var0.spriteTransformLookupB;
            } else {
               var25 = var0.spriteTransformLookupC;
            }

            if (var0.actorTimerX > var25[3] && var0.linkedStateMachine == null) {
               short var86 = var25[0];
               int var89 = var0.exec_a_to_int() + var25[1] * var0.actorCurrentAnimIndex;
               int var90 = var0.exec_b_to_int() + var25[2];
               CoreEngine var26 = var0;
               int var20 = var0.val_int_O;
               int var82 = var0.actorCurrentAnimIndex;
               var9 = var90;
               int var72 = var89;
               short var66 = var86;
               int var30 = 0;
               ActorStateMachine var87 = null;

               while (true) {
                  if (var30 >= 8) {
                     var87 = null;
                     break;
                  }

                  if (!val_arr_actorstatemachine_a[var30].isGrounded()) {
                     ActorStateMachine var31;
                     (var31 = val_arr_actorstatemachine_a[var30]).actorActionFrame = var66;
                     var31.actorTimer = var20;
                     var31.setPosition(var72, var9);
                     var31.actorFacingDirection = var82;
                     var31.val_coreengine_b = var26;
                     var31.setFacingDirection(2);
                     var87 = var31;
                     break;
                  }

                  var30++;
               }

               var0.linkedStateMachine = var87;
            }
            break;
         case 23:
            if (var0.actorTimerX < 1000) {
               var0.val_bool_B = true;
            }

            var0.exec_d_int_int_to_void(var0.actorTimerV, var0.val_int_Z);
            if (var0.characterId == 0) {
               var7 = var0;
               if (var0.linkedStateMachine != null && var7.linkedStateMachine.isGrounded()) {
                  var7.linkedStateMachine.setFacingDirection(3);
                  var7.linkedStateMachine = null;
               }
            }

            var7 = var0;
            if (var0.opposingActorRef != null) {
               var7.opposingActorRef.updateActor(0);
               var7.opposingActorRef = null;
            }
            break;
         case 26:
            switch (var0.characterId) {
               case 0:
                  boolean var24;
                  if (var0.actorCurrentAnimIndex == -1) {
                     var24 = var0.val_bool_u;
                  } else {
                     var24 = var0.val_bool_v;
                  }

                  int var19 = exec_p_to_int() - exec_o_to_int() - 64;
                  if (var0.val_bool_w) {
                     if (var0.actorTimerV != 18) {
                        var0.val_bool_s = false;
                        var0.setActorSubState(18);
                        var0.actorTimerX = 0;
                     }
                  } else if (var0.val_bool_x) {
                     var0.val_bool_x = false;
                     var0.val_bool_t = true;
                  } else if (var24) {
                     var0.exec_e_int_int_to_void(-var0.actorCurrentAnimIndex * (var19 << 8), 0);
                  }
                  break label961;
               case 1:
                  if (!var0.val_bool_r) {
                     exec_a_entityinterface_int_int_to_void(var0, 90112 * var0.actorCurrentAnimIndex * val_int_e / 1000, 0);
                  }
                  break label961;
               case 2:
                  var0.actorTimerS = val_spritepartsequence_I.getPartYOffset(var0.actorTimerS, val_int_e);
                  break label961;
               case 3:
                  if (var0.val_bool_r && var0.actorTimerX - var0.val_int_ad <= 200) {
                     exec_a_entityinterface_int_int_to_void(var0, 0, 0);
                  } else if (var0.actorTimerX < 800 && !var0.val_bool_r) {
                     if (var0.actorTimerV == 19) {
                        var0.actorActiveFlag = false;
                        exec_a_entityinterface_int_int_to_void(var0, 0, -98304 * val_int_e / 1000);
                        if (var0.exec_b_to_int() <= -80) {
                           var0.setActorPosition(var0.exec_a_to_int(), -80);
                           var0.setActorSubState(26);
                        }
                     } else if (var0.actorTimerV == 26) {
                        exec_a_entityinterface_int_int_to_void(var0, var0.actorCurrentAnimIndex * 131072 * val_int_e / 1000, 0);
                     }
                  } else {
                     if (var0.actorTimerV != 19) {
                        var0.setActorDirection(19);
                     }

                     exec_a_entityinterface_int_int_to_void(var0, 0, 98304 * val_int_e / 1000);
                     if (var0.exec_b_to_int() >= 0) {
                        var0.setActorPosition(var0.exec_a_to_int(), 0);
                        var0.actorActiveFlag = true;
                        var0.updateActor(0);
                     }
                  }
                  break label961;
               case 4:
                  if (!var0.val_bool_r) {
                     exec_a_entityinterface_int_int_to_void(var0, 98304 * var0.actorCurrentAnimIndex * val_int_e / 1000, 0);
                  }
                  break label961;
               case 5:
                  if (var0.exec_h_to_bool() && var0.actorTimerV == 26) {
                     int var18 = exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                     int var23;
                     if (exec_b_coreengine_to_coreengine(var0).exec_p_to_bool()) {
                        var23 = var18 - (var0.actorCurrentAnimIndex << 6);
                     } else {
                        var23 = var18 + (var0.actorCurrentAnimIndex << 6);
                     }

                     var0.setActorPosition(var23, 0);
                     var0.setActorDirection(27);
                     exec_a_int_int_bool_bool_to_void(var0.exec_a_to_int(), var0.exec_b_to_int() - 55, true, true);
                     var0.actorCounterE += 2000;
                  }
                  break label961;
               case 6:
                  if (var0.actorTimerX <= 400 && !var0.val_bool_r) {
                     exec_a_entityinterface_int_int_to_void(var0, var0.actorCurrentAnimIndex * 49152 * val_int_e / 1000, 0);
                  }
               default:
                  break label961;
            }
         case 27:
            exec_a_entityinterface_int_int_to_void(var0, var0.actorCurrentAnimIndex * -20480 * val_int_e / 1000, 0);
            break;
         case 28:
            int var29 = val_int_eu;
            if (!val_bool_g) {
               switch (val_int_eu) {
                  case 0:
                     exec_ak_to_void();
                     break;
                  case 1:
                     if (val_int_ev == 0) {
                        var0.setActorSubState(6);
                     } else {
                        if (exec_g_to_int() > 64 && val_int_ev < 3000) {
                           var0.exec_e_int_int_to_void(var0.actorCurrentAnimIndex * 28672 * val_int_e / 1000, 0);
                           break;
                        }

                        exec_ak_to_void();
                     }
                     break;
                  case 2:
                     if (val_int_ev == 0) {
                        var0.setActorSubState(4);
                     } else if (val_int_ev > 1000) {
                        exec_ak_to_void();
                     }
                     break;
                  case 3:
                     if (val_int_ev == 0) {
                        var0.setActorSubState(15);
                     } else if (val_int_ev > 200) {
                        exec_ak_to_void();
                     }
                     break;
                  case 4:
                     if (val_int_ev == 0) {
                        exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                        exec_M_int_to_void(500);
                        exec_b_coreengine_to_coreengine(var0).setActorSubState(3);
                        exec_b_coreengine_to_coreengine(var0).val_int_Q = var0.actorCurrentAnimIndex * val_arr_short_x[0] << 8;
                        exec_b_coreengine_to_coreengine(var0).val_int_R = val_arr_short_x[1] << 8;
                        exec_b_coreengine_to_coreengine(var0).val_int_S = val_arr_short_x[2];
                        exec_b_coreengine_to_coreengine(var0).val_bool_s = false;
                        int var48 = exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                        int var40 = exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -87;
                        byte var35;
                        if (exec_b_coreengine_to_coreengine(var0).characterId == 5) {
                           var35 = 1;
                        } else {
                           var35 = 0;
                        }

                        exec_a_int_int_int_int_to_void(0, var48, var40, var35);
                        exec_aq_to_void();
                     } else if (val_int_ev > 400 && exec_b_coreengine_to_coreengine(var0).actorActiveFlag) {
                        exec_ak_to_void();
                     }
                     break;
                  case 5:
                     if (val_int_ev == 0) {
                        var0.setActorSubState(33);
                        exec_b_coreengine_to_coreengine(var0).setActorSubState(8);
                        exec_aq_to_void();
                     } else if (var0.exec_h_to_bool()) {
                        val_bool_aO = true;
                     }
               }
            } else {
               label930:
               switch (var0.characterId) {
                  case 0:
                     switch (val_int_eu) {
                        case 0:
                           var0.setActorSubState(28);
                           exec_b_coreengine_to_coreengine(var0).val_bool_y = false;
                           var0.val_bool_y = false;
                           exec_ak_to_void();
                           exec_R_to_void();
                           break label930;
                        case 1:
                           exec_R_to_void();
                           exec_ak_to_void();
                           break label930;
                        case 2:
                           if (val_int_ev == 0) {
                              exec_ab_to_void();
                           }

                           exec_U_to_void();
                           exec_ak_to_void();
                           break label930;
                        case 3:
                           var0.val_bool_y = true;
                           if (var0.exec_h_to_bool()) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 4:
                           if (val_int_ev != 0) {
                              if (val_int_ev > 1500) {
                                 exec_ak_to_void();
                              }
                              break label930;
                           }

                           int var34 = var0.exec_a_to_int() + 37 * var0.actorCurrentAnimIndex;
                           int var39 = var0.exec_b_to_int() + -72;
                           int var17 = exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                           int var47 = exec_b_coreengine_to_coreengine(var0).exec_b_to_int();

                           for (int var22 = 0; var22 < 12; var22++) {
                              int var88 = var17 + (exec_a_int_int_to_int(0, 48) - 24);
                              int var81 = var22 * 80;
                              var9 = var88;
                              int var71 = var39;
                              int var63 = var34;
                              exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
                                 var34,
                                 var71,
                                 var9 - var63,
                                 var71,
                                 400,
                                 var81,
                                 2,
                                 0,
                                 1500,
                                 (byte)0,
                                 false,
                                 false,
                                 false,
                                 false,
                                 false,
                                 false,
                                 val_animationset_u,
                                 val_spritepartsequence_s,
                                 val_animationset_u,
                                 val_spritepartsequence_s
                              );
                           }

                           exec_i_int_int_to_void(var17, var47);
                           var0.val_bool_A = true;
                           val_int_ev = 0;
                           break label930;
                        case 5:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                              exec_M_int_to_void(500);
                              exec_g_int_int_to_void(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int()
                              );
                           } else if (val_int_ev > 300) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 6:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0)
                                 .exec_a_spritepartsequence_animationset_to_void(val_spritepartsequence_C, val_animationset_y);
                           } else if (val_int_ev > 1500) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 7:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0).val_bool_y = true;
                           } else if (exec_b_coreengine_to_coreengine(var0).exec_h_to_bool()) {
                              val_bool_aO = true;
                           }
                        default:
                           break label930;
                     }
                  case 1:
                     switch (val_int_eu) {
                        case 0:
                           if (val_int_ev != 0) {
                              if (val_int_ev > 1000) {
                                 exec_ak_to_void();
                              }
                              break label930;
                           }

                           var0.val_bool_A = true;
                           var0.val_bool_y = false;
                           if (val_animationset_v == null || val_arr_spritepartsequence_j == null) {
                              try {
                                 int[] var62 = val_arr_int_aP;
                                 AnimationSet var70 = exec_b_int_to_animationset(val_arr_int_aP[0]);
                                 SpritePartSequence[] var76 = new SpritePartSequence[(var62.length - 1) / 2];

                                 for (byte var80 = 1; var80 < var62.length; var80 += 2) {
                                    var76[var80 / 2] = exec_a_int_int_to_spritepartsequence(var62[var80], var62[var80 + 1]);
                                 }

                                 val_animationset_v = var70;
                                 val_arr_spritepartsequence_j = var76;
                              } catch (Exception var15) {
                              }
                           }

                           if (val_animationset_w == null || val_spritepartsequence_B == null) {
                              try {
                                 val_animationset_w = exec_b_int_to_animationset(134217837);
                                 val_spritepartsequence_B = exec_a_int_int_to_spritepartsequence(134217758, 0);
                              } catch (Exception var14) {
                              }
                           }

                           exec_U_to_void();
                           break label930;
                        case 1:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(28);
                              var0.val_bool_y = true;
                           } else if (var0.exec_h_to_bool()) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 2:
                           if (val_int_ev == 0) {
                              val_bool_aw = false;
                              exec_i_int_int_to_void(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int()
                              );
                              int var84 = var0.exec_a_to_int() + var0.actorCurrentAnimIndex * 37;
                              int var85 = var0.exec_b_to_int() + -90;
                              int var79 = exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -90;
                              var9 = exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                              int var69 = var85;
                              int var61 = var84;
                              exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
                                 var84,
                                 var69,
                                 var9 - var61,
                                 var69 - var79,
                                 1000,
                                 0,
                                 2,
                                 0,
                                 1000,
                                 (byte)0,
                                 false,
                                 false,
                                 false,
                                 false,
                                 false,
                                 false,
                                 val_animationset_w,
                                 val_spritepartsequence_B,
                                 val_animationset_w,
                                 val_spritepartsequence_B
                              );
                              val_int_ev = 0;
                           } else if (val_int_ev > 400) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 3:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0).val_bool_y = false;
                              exec_b_coreengine_to_coreengine(var0).exec_r_int_to_void(1);
                              exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                           } else if (val_int_ev > 1000) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 4:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(6);
                           } else {
                              if (exec_g_to_int() > 64 && val_int_ev < 3000) {
                                 var0.exec_e_int_int_to_void(var0.actorCurrentAnimIndex * 28672 * val_int_e / 1000, 0);
                                 break label930;
                              }

                              exec_ak_to_void();
                           }
                           break label930;
                        case 5:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(4);
                           } else if (val_int_ev > 1000) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 6:
                           if (val_int_ev == 0) {
                              exec_M_int_to_void(500);
                              var0.setActorSubState(15);
                           } else if (val_int_ev > 200) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 7:
                           if (val_int_ev != 0) {
                              if (val_int_ev > 1000) {
                                 exec_ak_to_void();
                              }
                              break label930;
                           }

                           exec_h_byte_to_void((byte)53);
                           exec_b_coreengine_to_coreengine(var0).setActorSubState(-1);
                           int var68 = exec_b_coreengine_to_coreengine(var0).exec_b_to_int();
                           int var60 = exec_b_coreengine_to_coreengine(var0).exec_a_to_int();

                           for (int var74 = 0; var74 < 5; var74++) {
                              for (int var10 = 0; var10 < val_arr_spritepartsequence_j.length; var10++) {
                                 byte var16 = 0;
                                 switch (var74) {
                                    case 0:
                                       var16 = -24;
                                       break;
                                    case 1:
                                       var16 = -12;
                                       break;
                                    case 2:
                                       var16 = 0;
                                       break;
                                    case 3:
                                       var16 = 12;
                                       break;
                                    case 4:
                                       var16 = 24;
                                 }

                                 int var83 = var60 + var16;
                                 int var10001 = var68 + -var10 * 10;
                                 int var10002 = exec_a_int_int_to_int(0, 128) - 64;
                                 int var10003 = exec_a_int_int_to_int(160, 220);
                                 exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
                                    var83,
                                    var10001,
                                    var10002,
                                    var10003,
                                    var10003 * 7,
                                    0,
                                    5,
                                    2,
                                    0,
                                    (byte)0,
                                    true,
                                    false,
                                    false,
                                    false,
                                    true,
                                    false,
                                    val_animationset_v,
                                    val_arr_spritepartsequence_j[var10],
                                    val_animationset_v,
                                    val_arr_spritepartsequence_j[var10]
                                 );
                              }
                           }

                           exec_aq_to_void();
                           break label930;
                        case 8:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(33);
                           } else if (var0.exec_h_to_bool()) {
                              val_bool_aO = true;
                           }
                        default:
                           break label930;
                     }
                  case 2:
                     switch (val_int_eu) {
                        case 0:
                           if (val_int_ev == 0) {
                              var0.val_bool_A = true;
                              exec_b_coreengine_to_coreengine(var0).val_bool_y = false;
                              exec_b_coreengine_to_coreengine(var0).setActorSubState(22);
                           } else if (val_int_ev > 1000) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 1:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(6);
                              exec_i_int_int_to_void(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int()
                              );
                           } else {
                              if (exec_g_to_int() > 54 && val_int_ev < 3000) {
                                 var0.exec_e_int_int_to_void(var0.actorCurrentAnimIndex * 28672 * val_int_e / 1000, 0);
                                 break label930;
                              }

                              exec_ak_to_void();
                           }
                           break label930;
                        case 2:
                           if (val_int_ev == 0) {
                              var0.setActorPosition(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int() - var0.actorCurrentAnimIndex * 54, var0.exec_b_to_int()
                              );
                              var0.setActorSubState(4);
                           } else if (val_int_ev > 1000) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 3:
                           if (val_int_ev == 0) {
                              val_int_ev = 0;
                              exec_M_int_to_void(500);
                              var0.setActorSubState(24);
                           } else if (val_int_ev > 150) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 4:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                              exec_b_coreengine_to_coreengine(var0).setActorSubState(31);
                              int var46 = exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                              int var38 = exec_b_coreengine_to_coreengine(var0).exec_b_to_int() - 78;
                              byte var33;
                              if (exec_b_coreengine_to_coreengine(var0).characterId == 5) {
                                 var33 = 1;
                              } else {
                                 var33 = 0;
                              }

                              exec_a_int_int_int_int_to_void(0, var46, var38, var33);
                              exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int(),
                                 exec_b_coreengine_to_coreengine(var0).exec_b_to_int() - 78,
                                 32 * var0.actorCurrentAnimIndex,
                                 112,
                                 1000,
                                 0,
                                 5,
                                 2,
                                 0,
                                 (byte)0,
                                 true,
                                 false,
                                 false,
                                 false,
                                 true,
                                 false,
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_animationset(),
                                 exec_b_coreengine_to_coreengine(var0).spriteSequences[32],
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_animationset(),
                                 exec_b_coreengine_to_coreengine(var0).spriteSequences[32]
                              );
                              exec_aq_to_void();
                           } else if (val_int_ev > 1500) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 5:
                           if (val_int_ev == 0) {
                              int var45 = exec_b_coreengine_to_coreengine(var0).exec_a_to_int();
                              int var37 = exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -87;
                              byte var32;
                              if (exec_b_coreengine_to_coreengine(var0).characterId == 5) {
                                 var32 = 1;
                              } else {
                                 var32 = 0;
                              }

                              exec_a_int_int_int_int_to_void(0, var45, var37, var32);
                              var0.setActorSubState(33);
                           } else if (var0.exec_h_to_bool()) {
                              val_bool_aO = true;
                           }
                        default:
                           break label930;
                     }
                  case 3:
                     switch (val_int_eu) {
                        case 0:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(0);
                              exec_b_coreengine_to_coreengine(var0).val_bool_y = false;
                              exec_b_coreengine_to_coreengine(var0).setActorSubState(22);
                              exec_R_to_void();
                              exec_ab_to_void();
                              exec_U_to_void();
                           } else if (val_int_ev > 1000) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 1:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(28);
                           } else if (var0.exec_h_to_bool()) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 2:
                           exec_ak_to_void();
                           break label930;
                        case 3:
                           if (val_int_ev > 1000) {
                              exec_ak_to_void();
                           } else {
                              val_bool_aP = true;
                              int var44 = var0.exec_a_to_int() + var0.actorCurrentAnimIndex * 19;
                              int var36 = var0.exec_b_to_int() + -70;
                              val_int_ex = exec_b_int_int_int_int_to_int(
                                 var44, var44 + var0.actorCurrentAnimIndex * -32, var44 + var0.actorCurrentAnimIndex * 80, val_int_ev
                              );
                              val_int_ey = exec_b_int_int_int_int_to_int(var36, var36 + -100, var36 + -20, val_int_ev);
                           }
                           break label930;
                        case 4:
                           if (val_int_ev == 0) {
                              val_int_ez = val_int_ex;
                              val_int_eA = val_int_ey;
                           } else if (val_int_ev > 400) {
                              exec_ak_to_void();
                           } else {
                              int var10000 = exec_b_coreengine_to_coreengine(var0).exec_a_to_int() - val_int_ez;
                              int var43 = exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -32 - val_int_eA;
                              val_int_ex = var10000 * val_int_ev / 400 + val_int_ez;
                              val_int_ey = val_int_eA + var43 * val_int_ev / 400;
                           }
                           break label930;
                        case 5:
                           if (val_int_ev == 0) {
                              exec_M_int_to_void(500);
                              exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                              exec_g_int_int_to_void(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int()
                              );
                              val_bool_aP = false;
                           } else if (val_int_ev > 300) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 6:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0)
                                 .exec_a_spritepartsequence_animationset_to_void(val_spritepartsequence_C, val_animationset_y);
                           } else if (val_int_ev > 1500) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 7:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0).val_bool_y = true;
                              var0.setActorSubState(33);
                           } else {
                              val_bool_aO = true;
                           }
                        default:
                           break label930;
                     }
                  case 4:
                     switch (val_int_eu) {
                        case 0:
                           if (val_int_ev == 0) {
                              exec_R_to_void();
                              var0.setActorSubState(33);
                           } else if (var0.exec_h_to_bool()) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 1:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0).val_bool_y = false;

                              try {
                                 val_animationset_A = exec_b_int_to_animationset(134217844);
                                 val_animationset_B = exec_a_int_to_animationset(134217845);
                                 val_spritepartsequence_G = exec_a_int_int_to_spritepartsequence(134217775, 0);
                                 val_spritepartsequence_H = exec_a_int_int_to_spritepartsequence(134217776, 0);
                              } catch (Exception var13) {
                              }

                              exec_ab_to_void();
                              exec_U_to_void();
                           } else {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 2:
                           if (val_int_ev == 0) {
                              var0.exec_a_spritepartsequence_animationset_to_void(val_spritepartsequence_H, val_animationset_B);
                           } else if (var0.exec_h_to_bool()) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 3:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(-1);
                              val_bool_aw = false;
                              exec_i_int_int_to_void(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int()
                              );
                           } else if (val_int_ev >= 1000) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 4:
                           if (val_int_ev == 0) {
                              exec_f_coreengine_to_void(exec_b_coreengine_to_coreengine(var0));
                              var0.setActorPosition(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int()
                              );
                              var0.setActorSubState(28);
                              val_bool_aQ = true;
                              val_coreengine_f = var0;
                           } else if (val_int_ev >= 50) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 5:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                              exec_g_int_int_to_void(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int()
                              );
                           } else if (val_int_ev >= 300) {
                              exec_ak_to_void();
                           } else if (var0.exec_h_to_bool()) {
                              var0.setActorSubState(-1);
                              val_coreengine_f = null;
                              val_bool_aQ = false;
                           }
                           break label930;
                        case 6:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0)
                                 .exec_a_spritepartsequence_animationset_to_void(val_spritepartsequence_C, val_animationset_y);
                           } else if (val_int_ev >= 1500) {
                              exec_ak_to_void();
                           } else if (var0.exec_h_to_bool()) {
                              var0.setActorSubState(-1);
                              val_coreengine_f = null;
                              val_bool_aQ = false;
                           }
                           break label930;
                        case 7:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0).val_bool_y = true;
                           } else if (val_int_ev > 1000) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 8:
                           if (val_int_ev == 0) {
                              var0.setActorPosition(exec_b_coreengine_to_coreengine(var0).exec_a_to_int() - 64, var0.exec_b_to_int());
                              AnimationSet var73 = val_animationset_B;
                              SpritePartSequence var67 = val_spritepartsequence_H;
                              var7 = var0;
                              var0.actorTimerR = 2;
                              var7.val_bool_z = true;
                              var7.val_spritepartsequence_e = var67;
                              var7.val_animationset_f = var73;
                              var7.actorTimerR = exec_a_int_int_int_to_int(
                                 var7.val_spritepartsequence_e.getTotalDuration(), var7.val_spritepartsequence_e.getFrameCount() - 1, 2
                              );
                           } else if (var0.exec_h_to_bool()) {
                              exec_ak_to_void();
                           }
                           break label930;
                        case 9:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(33);
                           } else if (var0.exec_h_to_bool()) {
                              val_bool_aO = true;
                           }
                        default:
                           break label930;
                     }
                  case 5:
                     switch (val_int_eu) {
                        case 0:
                           if (val_int_ev == 0) {
                              var0.val_bool_A = true;
                              var0.setActorSubState(0);
                              exec_K_to_void();
                              if (val_animationset_s == null) {
                                 try {
                                    byte var58;
                                    if (exec_B_to_bool()) {
                                       var58 = 0;
                                    } else {
                                       var58 = 3;
                                    }

                                    val_animationset_s = exec_a_int_byte_to_animationset(134217840, var58);
                                    val_spritepartsequence_z = exec_a_int_int_to_spritepartsequence(134217770, 0);
                                 } catch (Exception var12) {
                                 }
                              }
                           } else if (val_int_ev > 1000) {
                              exec_ak_to_void();
                           }
                           break;
                        case 1:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(28);
                           } else if (var0.exec_h_to_bool()) {
                              exec_ak_to_void();
                           }
                           break;
                        case 2:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(29);
                           } else if (val_int_ev > 1000) {
                              exec_ak_to_void();
                           }
                           break;
                        case 3:
                           if (val_int_ev == 0) {
                              val_int_ev = 0;
                           } else if (var0.exec_b_to_int() > -200) {
                              var0.exec_e_int_int_to_void(0, -32768 * val_int_e / 1000);
                           } else {
                              exec_ak_to_void();
                           }
                           break;
                        case 4:
                           if (val_int_ev == 0) {
                              var0.setActorPosition(exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), var0.exec_b_to_int() - 78);
                              var0.val_int_X = 2;
                              var0.val_bool_D = true;
                              exec_i_int_int_to_void(
                                 exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int()
                              );
                           } else if (var0.exec_b_to_int() < -220) {
                              var0.exec_e_int_int_to_void(0, 32768 * val_int_e / 1000);
                           } else {
                              exec_ak_to_void();
                           }
                           break;
                        case 5:
                           if (val_int_ev == 0) {
                              exec_M_int_to_void(500);
                              exec_b_coreengine_to_coreengine(var0).setActorSubState(22);
                              exec_b_coreengine_to_coreengine(var0).val_bool_y = false;
                              val_int_ew = 0;
                              exec_b_coreengine_to_coreengine(var0).exec_b_int_to_bool(13);
                           } else if (val_int_ew >= 4) {
                              exec_ak_to_void();
                           } else {
                              exec_aq_to_void();
                              var0.exec_e_int_int_to_void(0, 24576 * val_int_e / 1000);
                              if (val_int_ew == 0 || val_int_ev / 160 > val_int_ew) {
                                 int var42 = val_int_ew * 24;
                                 exec_h_int_int_to_void(
                                    exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + -87 + var42
                                 );
                                 if (val_int_ew % 2 == 0) {
                                    exec_f_int_int_to_void(
                                       exec_b_coreengine_to_coreengine(var0).exec_a_to_int(),
                                       exec_b_coreengine_to_coreengine(var0).exec_b_to_int() + var42 - 78
                                    );
                                 }

                                 val_int_ew++;
                              }

                              if (val_int_ev >= 700 && exec_b_coreengine_to_coreengine(var0).actorTimerV != -1) {
                                 exec_b_coreengine_to_coreengine(var0).actorTimerV = -1;
                              }
                           }
                           break;
                        case 6:
                           if (val_int_ev == 0) {
                              exec_b_coreengine_to_coreengine(var0).actorTimerV = -1;
                           } else if (var0.exec_b_to_int() < 100) {
                              var0.exec_e_int_int_to_void(0, 24576 * val_int_e / 1000);
                           } else {
                              exec_ak_to_void();
                           }
                           break;
                        case 7:
                           if (val_int_ev == 0) {
                              var0.setActorPosition(exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), 0);
                              var0.val_bool_D = false;
                              var0.setActorDirection(27);
                              exec_a_int_int_bool_bool_to_void(var0.exec_a_to_int(), var0.exec_b_to_int() - 55, true, true);
                           } else if (var0.exec_h_to_bool()) {
                              exec_ak_to_void();
                           }
                           break;
                        case 8:
                           if (val_int_ev == 0) {
                              var0.setActorSubState(33);
                           } else {
                              val_bool_aO = true;
                           }
                     }
               }
            }

            if (val_int_eu == var29) {
               val_int_ev = val_int_ev + val_int_e;
            } else {
               val_int_ev = 0;
            }
            break;
         case 30:
            if (var0.val_bool_r) {
               boolean var41;
               if (var0.val_int_aa == 0) {
                  var41 = true;
               } else {
                  var41 = false;
               }

               var0.val_bool_y = var41;
               var0.val_int_aa = Math.max(0, var0.val_int_aa - val_int_e);
            } else {
               exec_a_entityinterface_int_int_to_void(var0, 16384 * var0.actorCurrentAnimIndex * val_int_e / 1000, 0);
            }
            break;
         case 33:
            int var6 = val_int_eu;
            switch (val_int_eu) {
               case 0:
                  if (val_int_ev == 0) {
                     exec_b_coreengine_to_coreengine(var0).val_bool_y = false;
                     var0.setActorSubState(33);
                  } else if (var0.exec_h_to_bool()) {
                     exec_ak_to_void();
                  }
                  break;
               case 1:
                  if (val_int_ev == 0) {
                     exec_R_to_void();
                     exec_U_to_void();
                     CoreEngine var5 = exec_b_coreengine_to_coreengine(var0);
                     int var4 = val_arr_int_aV[var5.characterId];
                     int var3 = val_arr_int_aW[var5.characterId];
                     if (var4 != -1) {
                        try {
                           var5.val_animationset_g = exec_a_int_to_animationset(var4);
                           var5.val_spritepartsequence_f = exec_a_int_int_to_spritepartsequence(var3, 0);
                        } catch (Exception var11) {
                        }
                     }

                     exec_U_to_void();
                  } else {
                     exec_ak_to_void();
                  }
                  break;
               case 2:
                  if (val_int_ev == 0) {
                     exec_aq_to_void();
                     exec_g_int_int_to_void(exec_b_coreengine_to_coreengine(var0).exec_a_to_int(), exec_b_coreengine_to_coreengine(var0).exec_b_to_int());
                  } else if (val_int_ev > 300) {
                     exec_ak_to_void();
                  }
                  break;
               case 3:
                  if (val_int_ev == 0) {
                     exec_b_coreengine_to_coreengine(var0)
                        .exec_a_spritepartsequence_animationset_to_void(
                           exec_b_coreengine_to_coreengine(var0).val_spritepartsequence_f, exec_b_coreengine_to_coreengine(var0).val_animationset_g
                        );
                  } else if (val_int_ev > 2500) {
                     val_bool_aO = true;
                  }
            }

            if (val_int_eu == var6) {
               val_int_ev = val_int_ev + val_int_e;
            } else {
               val_int_ev = 0;
            }
            break;
         case 34:
            var0.exec_r_to_void();
            var0.actorActiveFlag = false;
            if (var0.exec_b_to_int() <= -80) {
               exec_a_entityinterface_int_int_to_void(var0, -var0.actorCurrentAnimIndex * 4096 * val_int_e / 1000, 0);
            } else {
               exec_a_entityinterface_int_int_to_void(var0, 0, -16384 * val_int_e / 1000);
            }

            var0.setActorSubState(3);
            break;
         case 35:
            exec_a_entityinterface_int_int_to_void(var0, 0, 73728 * val_int_e / 1000);
            break;
         case 36:
            if (var0.playerSlot != 9 || var0.actorTimerX >= 180) {
               exec_a_entityinterface_int_int_to_void(var0, 0, 73728 * val_int_e / 1000);
            }
            break;
         case 100:
            CoreEngine var2 = var0.linkedStateMachine.val_coreengine_a;
            if (exec_g_to_int() > 64) {
               exec_a_entityinterface_int_int_to_void(var2, (-var0.actorCurrentAnimIndex << 16) * val_int_e / 1000, 0);
            }

            var2.exec_d_int_int_to_void(3, 0);
            break;
         case 102:
            var0.exec_d_int_int_to_void(3, 0);
      }

      if (var0.canAcceptAnimCommand()) {
         var0.actorCurrentAnimIndex = var0.requestedAnimIndex;
      }
   }

   public static void renderAllActors() {
      if (val_int_dN == 2) {
         int var0 = val_int_dL;
         byte var1 = val_byte_e;
         if (val_int_bv != 1) {
            switch (var0) {
               case 0:
               case 1:
               case 2:
                  if (!val_bool_aF && !val_bool_aG) {
                     val_bool_aF = true;
                     exec_b_byte_bool_to_void((byte)CharacterPresetTable.val_arr_arr_int_a[var1][22], false);
                     val_int_ek = 0;
                  } else if (val_bool_aF && !val_bool_aG) {
                     if ((val_int_ek = val_int_ek + val_int_e) > AudioMetaTable.val_arr_int_b[(byte)CharacterPresetTable.val_arr_arr_int_a[var1][22]]) {
                        val_bool_aF = false;
                        val_bool_aG = true;
                     }
                  } else if (val_bool_aG && !val_bool_aH) {
                     val_bool_aH = true;
                     exec_b_byte_bool_to_void((byte)CharacterPresetTable.val_arr_arr_int_a[var1][23], false);
                  }
                  break;
               case 3:
                  if (!val_bool_aI) {
                     val_bool_aI = true;
                     exec_b_byte_bool_to_void((byte)15, false);
                  }
                  break;
               case 4:
                  if (val_bool_aI) {
                     val_bool_aI = false;
                     if (val_int_eb == 1) {
                        if (!val_bool_aJ) {
                           val_bool_aJ = true;
                           exec_b_byte_bool_to_void((byte)13, true);
                        }
                     } else if (!val_bool_aM) {
                        val_bool_aM = true;
                        exec_b_byte_bool_to_void((byte)11, true);
                     }
                  }
               case 5:
               default:
                  break;
               case 6:
                  if (val_bool_aJ) {
                     val_bool_aJ = false;
                     val_bool_aK = true;
                     exec_b_byte_bool_to_void((byte)14, false);
                  } else if (!val_bool_aL && !val_bool_aK && !val_bool_aM) {
                     val_bool_aL = true;
                     exec_b_byte_bool_to_void((byte)12, false);
                  }
            }
         }
      }

      val_int_dO = val_int_dO + val_int_e;
      switch (val_int_dN) {
         case 1:
            if (val_int_dP > 0 && val_int_dP < 5) {
               if (val_coreengine_b == null) {
                  int var33 = val_int_dQ;
                  byte var25;
                  if (val_int_bw == 1) {
                     var25 = 0;
                  } else {
                     var25 = 1;
                  }

                  (val_coreengine_b = spawnActor(var33, -64, 0, 1, 0, var25, false, 0)).actorCounterE = (int)val_long_g;
                  exec_U_to_void();
               } else {
                  tickActors();
                  val_int_dP = 1 + val_coreengine_b.animationTick;
               }
            } else if (val_int_dP < 5 || val_int_dP >= 9) {
               switch (val_int_dP) {
                  case 0:
                     exec_a_byte_to_void((byte)2);
                     exec_a_byte_to_void((byte)3);
                     if (!val_bool_am) {
                        exec_d_bool_to_void(true);
                        exec_I_to_void();
                     }

                     initActorPool();
                     exec_Q_to_void();
                     val_arr_arr_entityinterface_a = new EntityInterface[3][50];
                     val_arr_int_bl = new int[20];
                     val_arr_int_bp = new int[20];
                     val_arr_int_bq = new int[4];
                     val_arr_int_bk = new int[3];
                     val_arr_int_br = new int[8];
                     val_int_eC = 0;
                     exec_T_to_void();
                     val_bool_aO = false;
                     val_int_eu = 0;
                     val_int_ev = 0;
                     if (!val_bool_P) {
                        try {
                           val_arr_animationset_b = new AnimationSet[val_arr_int_S.length];

                           for (int var31 = 0; var31 < val_arr_int_S.length; var31++) {
                              val_arr_animationset_b[var31] = exec_a_int_int_byte_bool_to_animationset(val_arr_int_S[var31], -1, (byte)0, false);
                           }

                           val_arr_spritepartsequence_d = new SpritePartSequence[val_arr_int_U.length];
                           val_arr_int_ae = new int[val_arr_int_U.length];
                           val_arr_int_ac = new int[val_arr_int_U.length];
                           val_arr_int_ad = new int[val_arr_int_U.length];

                           for (int var32 = 0; var32 < val_arr_int_U.length; var32++) {
                              val_arr_spritepartsequence_d[var32] = exec_a_int_int_to_spritepartsequence(val_arr_int_U[var32], 1);
                              val_arr_int_ae[var32] = 1;
                              val_arr_int_ac[var32] = val_arr_spritepartsequence_d[var32].getSequenceWidth(val_arr_animationset_b[val_arr_int_W[var32]]);
                              val_arr_int_ad[var32] = val_arr_spritepartsequence_d[var32].getSequenceHeight(val_arr_animationset_b[val_arr_int_W[var32]]);
                           }

                           val_bool_P = true;
                        } catch (Exception var13) {
                           var13.printStackTrace();
                        }
                     }

                     try {
                        val_animationset_z = exec_a_int_int_byte_bool_to_animationset(134217839, -1, (byte)0, false);
                        val_spritepartsequence_D = exec_a_int_int_to_spritepartsequence(134217767, 1);
                        val_spritepartsequence_E = exec_a_int_int_to_spritepartsequence(134217768, 1);
                        val_spritepartsequence_F = exec_a_int_int_to_spritepartsequence(134217769, 1);
                     } catch (Exception var12) {
                     }

                     if (exec_A_to_bool()) {
                        exec_R_to_void();
                        val_encodedtextbuffer_w = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(115, null);
                     }

                     val_int_dT = 0;
                     val_int_dP++;
                     exec_U_to_void();
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
                     exec_a_byte_int_to_void(val_byte_r, -1);
                     val_int_dP++;
                     exec_U_to_void();
                     break;
                  case 10:
                     val_int_dP++;
                     break;
                  case 11:
                     val_int_dP++;
                     break;
                  case 12:
                     val_int_dP++;
                     break;
                  case 13:
                     val_int_dP++;
                     break;
                  case 14:
                     val_int_dP++;
                     break;
                  case 15:
                     val_int_dP++;
                     break;
                  case 16:
                     val_int_dP++;
                     break;
                  case 17:
                     val_int_dP++;
                     break;
                  case 18:
                     val_int_dP++;
                     break;
                  case 19:
                     val_int_dP++;
                     break;
                  case 20:
                     val_int_dP++;
                     break;
                  case 21:
                     val_arr_effectactor_a = new EffectActor[50];
                     val_int_el = 0;
                     val_int_em = -1;

                     for (byte var28 = 0; var28 < 50; var28++) {
                        val_arr_effectactor_a[var28] = new EffectActor();
                        val_arr_effectactor_a[var28].effectCoordinates = new int[11];
                     }

                     if (val_arr_animationset_e == null) {
                        try {
                           val_arr_animationset_e = new AnimationSet[2];
                           val_arr_animationset_f = new AnimationSet[2];
                           AnimationSet[] var29 = val_arr_animationset_e;
                           byte var41;
                           if (val_bool_j) {
                              var41 = 0;
                           } else {
                              var41 = 3;
                           }

                           byte var18 = var41;
                           var29[0] = exec_a_int_int_byte_bool_to_animationset(134217825, -1, var18, false);
                           AnimationSet[] var42 = val_arr_animationset_f;
                           byte var30;
                           if (val_bool_j) {
                              var30 = 0;
                           } else {
                              var30 = 3;
                           }

                           var18 = var30;
                           var42[0] = exec_a_int_int_byte_bool_to_animationset(134217826, -1, var18, false);
                           val_spritepartsequence_u = exec_a_int_int_to_spritepartsequence(134217729, 1);
                           val_spritepartsequence_w = exec_a_int_int_to_spritepartsequence(134217728, 0);
                           val_spritepartsequence_y = exec_a_int_int_to_spritepartsequence(134217730, 0);
                        } catch (Exception var11) {
                        }
                     }

                     val_int_dP++;
                     exec_U_to_void();
                     break;
                  case 22:
                     EncodedTextBuffer var22 = val_coreengine_c.fighterNameBuffer;
                     EncodedTextBuffer var17 = val_coreengine_b.fighterNameBuffer;
                     int var14 = val_int_bA;
                     int var7 = val_int_bz;
                     exec_a_byte_to_void((byte)1);
                     exec_a_byte_to_void((byte)0);
                     val_int_cQ = var7;
                     val_int_cP = var14;
                     val_encodedtextbuffer_p = var17;
                     val_encodedtextbuffer_q = var22;
                     val_int_dz = 99;
                     val_encodedtextbuffer_o = exec_a_int_to_encodedtextbuffer(99);
                     val_int_dA = 0;
                     val_int_dt = 0;
                     val_int_du = 0;
                     exec_b_byte_to_void((byte)0);
                     val_int_cT = exec_a_encodedtextbuffer_to_int(val_encodedtextbuffer_o);
                     val_int_cU = exec_c_to_int();
                     val_int_cR = 0 + val_int_cP / 2 - val_int_cT / 2;
                     val_int_cS = val_int_cQ + 5;
                     val_int_cV = 5;
                     val_int_cY = val_int_cR - 3 - val_int_cV;
                     val_int_cW = val_int_cP - 5 - val_int_cY;
                     val_int_cX = val_int_cS + val_int_cU + 3;
                     val_int_dB = 10240;
                     (val_encodedtextbuffer_r = new EncodedTextBuffer(10)).appendInt(val_int_dA);
                     exec_b_byte_to_void((byte)4);
                     val_int_dl = exec_l_to_int();
                     val_int_dk = val_int_cX - val_int_dl - 2;
                     val_arr_int_aF = new int[val_int_cY + 1];

                     for (int var5 = 0; var5 < val_int_cY + 1; var5++) {
                        if (var5 % 2 == 0) {
                           val_arr_int_aF[var5] = 2005401600;
                        } else {
                           val_arr_int_aF[var5] = 2009858048;
                        }
                     }

                     exec_b_byte_to_void((byte)1);
                     val_int_cZ = exec_c_to_int() + 4;
                     val_int_di = val_int_cV + 5;
                     val_int_dj = val_int_cW + val_int_cY - 5;
                     val_int_dm = val_int_cX + 2;
                     val_int_db = 25600;
                     val_int_da = 25600;
                     val_int_dd = 0;
                     val_int_dc = 0;
                     val_int_dh = 0;
                     val_int_dg = 0;
                     val_int_dn = val_int_cY * 40 / 100;
                     if ((val_int_do = val_int_cZ * 40 / 100) < 3) {
                        val_int_do = 3;
                     }

                     val_int_dq = 25600;
                     val_int_dp = 25600;
                     val_int_df = 25600;
                     val_int_de = 25600;
                     val_int_dr = val_int_ds = val_int_dn;
                     val_int_dC = 17920;

                     try {
                        val_animationset_n = exec_a_int_int_byte_bool_to_animationset(150994953, -1, (byte)0, false);
                        val_spritepartsequence_n = exec_a_int_int_to_spritepartsequence(150994944, 0);
                     } catch (Exception var10) {
                     }

                     val_int_dw = val_spritepartsequence_n.getSequenceWidth(val_animationset_n);
                     val_int_dv = val_spritepartsequence_n.getSequenceHeight(val_animationset_n);
                     val_int_dy = 5;
                     val_int_dx = val_int_cX + val_int_cZ + val_int_do + 5;
                     val_encodedtextbuffer_s = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(126, null);
                     val_encodedtextbuffer_t = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(127, null);
                     exec_U_to_void();
                     val_int_dP++;
                     break;
                  case 23:
                     exec_D_int_to_void(val_coreengine_b.characterId);
                     exec_N_int_to_void(val_coreengine_b.spriteTransformLookupB[0]);
                     exec_D_int_to_void(val_coreengine_c.characterId);
                     exec_N_int_to_void(val_coreengine_c.spriteTransformLookupB[0]);
                     val_int_dP++;
               }
            } else if (val_coreengine_c == null) {
               int var4 = val_int_dR;
               byte var3;
               if (val_bool_am) {
                  var3 = 0;
               } else {
                  var3 = 2;
               }

               byte var2;
               if (val_int_bw == 1) {
                  var2 = 0;
               } else {
                  var2 = 1;
               }

               val_coreengine_c = spawnActor(var4, 64, 0, -1, var3, var2, false, 1);
               if (val_bool_am) {
                  val_int_ei = val_coreengine_c.currentHealth;
               }

               exec_U_to_void();
            } else {
               tickActors();
               val_int_dP = 5 + val_coreengine_c.animationTick;
            }

            if (val_int_dP == 24) {
               exec_U_to_void();
               exec_z_int_to_void(2);
            }
         case 0:
         case 2:
         case 3:
         default:
            val_int_ej = val_int_ej - val_int_e;
            if (val_bool_h && val_coreengine_b != null && val_coreengine_b.scratchpadBuffer != null) {
               if (val_bool_aD) {
                  val_coreengine_b.currentHealth = 100;
               }

               if (val_bool_aE) {
                  val_coreengine_c.currentHealth = 100;
               }

               int var38 = val_int_dQ;
               int var6 = val_int_dR;
               byte var20 = val_byte_r;
               boolean var15 = false;
               CoreEngine var23 = val_coreengine_b;

               for (int var26 = 0; var26 < val_arr_arr_byte_z.length; var26++) {
                  if (var23.exec_a_arr_byte_to_bool(val_arr_arr_byte_z[var26])) {
                     boolean var43 = false;
                     byte var34 = 0;
                     boolean var34_flag = false;
                     switch (var26) {
                        case 0:
                           val_coreengine_b.currentHealth = 0;
                           val_coreengine_b.updateActor(13);
                           val_coreengine_b.actorPhysicsArray[1] = 0;
                           drawTextLabel(2);
                           val_coreengine_c.updateActor(0);
                           val_bool_aD = false;
                           break;
                        case 1:
                           val_coreengine_c.currentHealth = 0;
                           val_coreengine_c.updateActor(13);
                           val_coreengine_c.actorPhysicsArray[1] = 0;
                           drawTextLabel(2);
                           val_coreengine_b.updateActor(0);
                           val_bool_aE = false;
                           break;
                        case 2:
                           if (!val_bool_aC) {
                              var43 = true;
                           } else {
                              var43 = false;
                           }

                           val_bool_aC = var43;
                           var43 = true;
                           var34_flag = val_bool_aC;
                           break;
                        case 3:
                           if (!val_bool_aD) {
                              var43 = true;
                           } else {
                              var43 = false;
                           }

                           val_bool_aD = var43;
                           var43 = true;
                           var34_flag = val_bool_aD;
                           break;
                        case 4:
                           if (!val_bool_aE) {
                              var43 = true;
                           } else {
                              var43 = false;
                           }

                           val_bool_aE = var43;
                           var43 = true;
                           var34_flag = val_bool_aE;
                           break;
                        case 5:
                           val_int_dS = 0;
                           break;
                        case 6:
                           CoreEngine var44 = val_coreengine_c;
                           if (val_coreengine_c.layerDepth == 0) {
                              var34 = 2;
                           } else {
                              var34 = 0;
                           }

                           var44.layerDepth = var34;
                           var43 = true;
                           if (val_coreengine_c.layerDepth == 2) {
                              var34 = 1;
                           } else {
                              var34 = 0;
                           }
                           break;
                        case 7:
                           val_coreengine_b.actorCounterE += 100000;
                           break;
                        case 8:
                           var38 = (var38 + 1) % 7;
                           var15 = true;
                           break;
                        case 9:
                           var6 = (var6 + 1) % 7;
                           var15 = true;
                           break;
                        case 10:
                           var20 = (byte)((var20 + 1) % CharacterPresetTable.val_arr_arr_int_a.length);
                           var15 = true;
                     }

                     exec_a_arr_byte_to_void(var23.scratchpadBuffer);
                     EncodedTextBuffer var8;
                     StringBuffer var9 = new StringBuffer().append(val_arr_string_e[var26]);
                     String var49;
                     if (var43) {
                        StringBuffer var48 = new StringBuffer().append(" - ");
                        String var36;
                        if (var34_flag) {
                           var36 = "ON";
                        } else {
                           var36 = "OFF";
                        }

                        var49 = var48.append(var36).toString();
                     } else {
                        var49 = "";
                     }

                     var8 = new EncodedTextBuffer(var9.append(var49).toString());
                     val_encodedtextbuffer_N = var8;
                     val_int_ej = 3500;
                  }

                  if (var15) {
                     exec_M_to_void();
                     exec_a_int_int_byte_to_void(var38, var6, var20);
                     return;
                  }
               }
            }

            if (val_bool_ax) {
               exec_M_to_void();
            }

            if (val_int_dN == 2 && !exec_z_to_bool()) {
               updateBattleState();
               transitionGameState();
               tickActors();
               renderOverlays();
               updateVsScreenState();
               exec_F_to_void();
               renderHUD();
               if (val_coreengine_b.exec_a_to_int() < val_coreengine_c.exec_a_to_int()) {
                  val_coreengine_b.setActorAnimation(1);
                  val_coreengine_c.setActorAnimation(-1);
               } else {
                  val_coreengine_b.setActorAnimation(-1);
                  val_coreengine_c.setActorAnimation(1);
               }

               int var55 = val_coreengine_b.exec_a_to_int() + (val_coreengine_c.exec_a_to_int() - val_coreengine_b.exec_a_to_int()) / 2;
               int var54 = (val_coreengine_c.exec_b_to_int() + val_coreengine_b.exec_b_to_int()) / 2;
               CoreEngine var50;
               if (val_coreengine_b.actorTimerW == 18) {
                  var50 = val_coreengine_b;
               } else if (val_coreengine_c.actorTimerW == 18) {
                  var50 = val_coreengine_c;
               } else {
                  var50 = null;
               }

               if (var50 != null) {
                  CoreEngine var10000 = exec_b_coreengine_to_coreengine(var50);
                  var55 = var10000.exec_a_to_int();
                  var54 = var10000.exec_b_to_int();
               }

               boolean var51 = false;
               if (val_bool_aw) {
                  if (!val_coreengine_b.exec_q_to_bool() && !val_coreengine_c.exec_q_to_bool()) {
                     var54 += 0 - val_int_bE / 2 + val_int_ar;
                     var51 = true;
                  } else if (!val_coreengine_b.exec_q_to_bool() && val_coreengine_c.exec_q_to_bool()) {
                     var55 = val_coreengine_b.exec_a_to_int();
                     var54 += 0 - val_int_bE / 2 + val_int_ar;
                     var51 = true;
                  } else if (val_coreengine_b.exec_q_to_bool() && !val_coreengine_c.exec_q_to_bool()) {
                     var55 = val_coreengine_c.exec_a_to_int();
                     var54 += 0 - val_int_bE / 2 + val_int_ar;
                     var51 = true;
                  }
               }

               if (var51) {
                  exec_a_int_int_bool_to_void(var55, var54, false);
               }
            }

            if (val_int_dN == 2) {
               int var10002 = val_coreengine_b.superMeterEnergy >> 8;
               int var10003 = val_coreengine_c.superMeterEnergy >> 8;
               int var10006 = val_int_dS / 1000;
               int var40 = (int)val_long_d;
               int var39 = var10006;
               int var27 = val_int_dV;
               int var24 = val_int_dU;
               int var21 = var10003;
               int var16 = var10002;
               int var52 = val_coreengine_c.currentHealth;
               val_int_da = val_coreengine_b.currentHealth << 8;
               val_int_db = var52 << 8;
               val_int_dp = var16 << 8;
               val_int_dq = var21 << 8;
               val_int_dt = var24;
               val_int_du = var27;
               if (val_int_dz != var39) {
                  val_int_dz = var39;
                  val_encodedtextbuffer_o = exec_a_int_to_encodedtextbuffer(var39);
               }

               if (val_int_dA != var40) {
                  (val_encodedtextbuffer_r = new EncodedTextBuffer(10)).appendInt(var40);
                  val_int_dA = var40;
               }

               EncodedTextBuffer var53 = val_coreengine_c.fighterNameBuffer;
               val_encodedtextbuffer_p = val_coreengine_b.fighterNameBuffer;
               val_encodedtextbuffer_q = var53;
               int var37 = val_coreengine_b.actorCounterE;
               if (val_coreengine_b.actorCounterE != val_long_c) {
                  if (val_long_d == 0L) {
                     val_long_f = 1000L;
                     val_long_e = val_long_c;
                     val_long_d = var37;
                  } else {
                     val_long_f = 0L;
                     val_long_e = val_long_d;
                  }
               }

               val_long_c = var37;
               exec_A_to_void();
               renderBackground();
            }

            if (val_int_dL != 14) {
               exec_a_byte_byte_to_void(val_byte_s, val_byte_t);
            }
      }
   }

   public static void renderHUD() {
      for (val_int_eC = 0; val_int_eC < 3; val_int_eC++) {
         for (val_int_eB = 0; val_int_eB < val_arr_int_bk[val_int_eC]; val_int_eB++) {
            EntityInterface var0;
            if ((val_arr_int_bm = (var0 = val_arr_arr_entityinterface_a[val_int_eC][val_int_eB]).getBounds()) != null && var0.isAlive()) {
               return;
            }
         }
      }

      for (val_int_eC = 0; val_int_eC < 3; val_int_eC++) {
         for (val_int_eB = 0; val_int_eB < val_arr_int_bk[val_int_eC]; val_int_eB++) {
            EntityInterface var6;
            if ((val_arr_int_bm = (var6 = val_arr_arr_entityinterface_a[val_int_eC][val_int_eB]).getBounds()) != null && !var6.isAlive()) {
               for (int var7 = 0; var7 < var6.getStateValue(0); var7++) {
                  if (var6.checkHitBox(0, val_arr_int_bl, val_int_eD)) {
                     val_int_eE = val_int_eD;
                     val_int_eD += 5;
                     int[] var1 = val_arr_int_bq;

                     for (int var2 = val_int_eC + 1; var2 < 3; var2++) {
                        for (int var3 = 0; var3 < val_arr_int_bk[var2]; var3++) {
                           val_arr_int_bo = val_arr_arr_entityinterface_a[var2][var3].getBounds();

                           for (int var4 = 0; var4 < val_arr_arr_entityinterface_a[var2][var3].getStateValue(0); var4++) {
                              if (val_arr_arr_entityinterface_a[var2][var3].checkHitBox(0, val_arr_int_bl, val_int_eD)) {
                                 int var10000 = exec_a_int_int_int_int_to_int(
                                    val_arr_int_bl[val_int_eD + 1], val_arr_int_bl[val_int_eD + 3], val_arr_int_bl[val_int_eD + 2], val_arr_int_bl[val_int_eD]
                                 );
                                 int var5 = 0;
                                 var1[0] = 0;
                                 var1[1] = 0;
                                 var1[2] = 0;
                                 var1[3] = 0;
                                 val_arr_int_bn = val_arr_arr_entityinterface_a[var2][var3].getBounds();
                                 switch (var10000) {
                                    case 1:
                                       var1[0] = val_arr_int_bl[val_int_eD + 1] - val_arr_int_bl[val_int_eE + 2] - 1;
                                       if ((val_arr_int_bn[10] ^ 1) == 1) {
                                          var1[1] = val_arr_int_bl[val_int_eD] - val_arr_int_bl[val_int_eE + 3];
                                       }

                                       var5 = 1;
                                       break;
                                    case 2:
                                       var1[0] = val_arr_int_bl[val_int_eD + 2] - val_arr_int_bl[val_int_eE + 1] + 1;
                                       if ((val_arr_int_bn[10] ^ 1) == 1) {
                                          var1[1] = val_arr_int_bl[val_int_eD] - val_arr_int_bl[val_int_eE + 3];
                                       }

                                       var5 = 1;
                                       break;
                                    case 3:
                                       if ((val_arr_int_bn[10] & 4) == 4 && (val_arr_int_bn[10] & 8) == 8) {
                                          var1[0] = (val_arr_int_bl[val_int_eD + 1] - val_arr_int_bl[val_int_eE + 2] >> 1) - 1;
                                          var1[2] = (val_arr_int_bl[val_int_eE + 2] - val_arr_int_bl[val_int_eD + 1] >> 1) + 1;
                                       } else if ((val_arr_int_bn[10] & 4) == 4) {
                                          var1[0] = val_arr_int_bl[val_int_eD + 1] - val_arr_int_bl[val_int_eE + 2] - 1;
                                       } else if ((val_arr_int_bn[10] & 8) == 8) {
                                          var1[2] = val_arr_int_bl[val_int_eE + 2] - val_arr_int_bl[val_int_eD + 1] + 1;
                                       }

                                       var5 = 1;
                                       break;
                                    case 4:
                                       if ((val_arr_int_bn[10] & 8) == 8 && (val_arr_int_bn[10] & 4) == 4) {
                                          var1[0] = (val_arr_int_bl[val_int_eD + 2] - val_arr_int_bl[val_int_eE + 1] >> 1) + 1;
                                          var1[2] = (val_arr_int_bl[val_int_eE + 1] - val_arr_int_bl[val_int_eD + 2] >> 1) - 1;
                                       } else if ((val_arr_int_bn[10] & 8) == 8) {
                                          var1[0] = val_arr_int_bl[val_int_eD + 2] - val_arr_int_bl[val_int_eE + 1] + 1;
                                       } else if ((val_arr_int_bn[10] & 4) == 4) {
                                          var1[2] = val_arr_int_bl[val_int_eE + 1] - val_arr_int_bl[val_int_eD + 2] - 1;
                                       }

                                       var5 = 1;
                                       break;
                                    case 5:
                                       var1[2] = val_arr_int_bl[val_int_eE + 2] - val_arr_int_bl[val_int_eD + 1] + 1;
                                       if ((val_arr_int_bn[10] ^ 1) == 1) {
                                          var1[3] = val_arr_int_bl[val_int_eE] - val_arr_int_bl[val_int_eD + 3];
                                       }

                                       var5 = 1;
                                       break;
                                    case 6:
                                       var1[2] = val_arr_int_bl[val_int_eE + 1] - val_arr_int_bl[val_int_eD + 2] - 1;
                                       if ((val_arr_int_bn[10] ^ 1) == 1) {
                                          var1[3] = val_arr_int_bl[val_int_eE] - val_arr_int_bl[val_int_eD + 3];
                                       }

                                       var5 = 1;
                                 }

                                 if (var5 != 0) {
                                    var5 = val_arr_int_bm[0] + (var1[0] << 8);
                                    val_arr_int_bm[0] = var5;
                                    var5 = val_arr_int_bm[1] + (var1[1] << 8);
                                    val_arr_int_bm[1] = var5;
                                    if (val_arr_int_bm[7] != 0) {
                                       var5 = val_arr_int_bm[8] + (var1[0] << 8);
                                       val_arr_int_bm[8] = var5;
                                       var5 = val_arr_int_bm[9] + (var1[1] << 8);
                                       val_arr_int_bm[9] = var5;
                                    }

                                    if (val_arr_int_bm[7] != 0) {
                                       var5 = val_arr_int_bm[8] + (var1[2] << 8);
                                       val_arr_int_bm[8] = var5;
                                       var5 = val_arr_int_bm[9] + (var1[3] << 8);
                                       val_arr_int_bm[9] = var5;
                                    }

                                    if (val_arr_int_bm[1] > 0) {
                                       val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].applyAction(8);
                                       val_arr_int_bm[1] = 0;
                                    } else if (val_arr_int_bm[1] < val_int_eF) {
                                       val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].applyAction(1);
                                       val_arr_int_bm[1] = val_int_eF;
                                    }

                                    if (val_arr_int_bm[0] < val_int_eG) {
                                       val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].applyAction(2);
                                       val_arr_int_bm[0] = val_int_eG;
                                    } else if (val_arr_int_bm[0] > val_int_eH) {
                                       val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].applyAction(4);
                                       val_arr_int_bm[0] = val_int_eH;
                                    }

                                    var5 = val_arr_int_bo[0] + (var1[2] << 8);
                                    val_arr_int_bo[0] = var5;
                                    var5 = val_arr_int_bo[1] + (var1[3] << 8);
                                    val_arr_int_bo[1] = var5;
                                    if (val_arr_int_bo[1] > 0) {
                                       val_arr_int_bo[1] = 0;
                                    } else if (val_arr_int_bo[1] < val_int_eF) {
                                       val_arr_int_bo[1] = val_int_eF;
                                    }

                                    if (val_arr_int_bo[0] < val_int_eG) {
                                       val_arr_int_bo[0] = val_int_eG;
                                    } else if (val_arr_int_bo[0] > val_int_eH) {
                                       val_arr_int_bo[0] = val_int_eH;
                                    }
                                 }
                              }
                           }
                        }
                     }

                     val_int_eD -= 5;
                  }
               }
            }
         }
      }
   }

   public static void renderBackground() {
      CoreEngine var0;
      val_int_dM = val_int_dM + val_int_e;
      var0 = exec_a_to_coreengine();
      label356:
      switch (val_int_dL) {
         case 0:
            if (val_int_dM - val_int_aA > 2500 || val_bool_am) {
               val_int_aA = 0;
               drawTextLabel(1);
            }
            break;
         case 1:
            if (val_int_dM >= 1500) {
               drawTextLabel(2);
            }
            break;
         case 2:
            if (exec_z_to_bool()) {
               drawTextLabel(11);
            } else if (val_coreengine_b.currentHealth <= 0 || val_coreengine_c.currentHealth <= 0) {
               if (val_coreengine_c.currentHealth <= 0 && exec_A_to_bool()) {
                  boolean var5;
                  if (exec_A_to_bool() && val_int_ec < val_arr_byte_k.length - 1) {
                     var5 = true;
                  } else {
                     var5 = false;
                  }

                  if (var5) {
                     drawTextLabel(13);
                     break;
                  }
               }

               boolean var6;
               if (val_bool_am) {
                  if (val_int_dQ != 6 && val_coreengine_c.exec_i_to_bool()) {
                     var6 = true;
                  } else {
                     var6 = false;
                  }
               } else if (val_int_dQ == 6
                  || val_int_dR == 6
                  || (val_int_dU <= 0 || !val_coreengine_c.exec_i_to_bool()) && (val_int_dV <= 0 || !val_coreengine_b.exec_i_to_bool())) {
                  var6 = false;
               } else {
                  var6 = true;
               }

               if (var6) {
                  val_bool_aO = false;
                  drawTextLabel(3);
               } else {
                  if (exec_a_to_coreengine() == val_coreengine_b && val_int_dU > 0 && exec_b_coreengine_to_coreengine(exec_a_to_coreengine()).characterId == 6) {
                     if (val_int_cA == exec_m_to_int() - 1) {
                        var6 = true;
                     } else {
                        var6 = false;
                     }

                     if (var6) {
                        exec_ac_to_void();
                        drawTextLabel(6);
                        break;
                     }
                  }

                  drawTextLabel(6);
               }
            }
            break;
         case 3:
            byte var1;
            if (val_int_bx != 0 && val_int_cz != 0) {
               var1 = 1;
            } else {
               var1 = 2;
            }

            var1 *= 3500;
            boolean var2;
            if (val_coreengine_b.actorTimerW != 28 && val_coreengine_c.actorTimerW != 28) {
               var2 = false;
            } else {
               var2 = true;
            }

            if (var2) {
               val_int_eb = 1;
               drawTextLabel(4);
            } else {
               if (val_coreengine_b.actorTimerW != 33 && val_coreengine_c.actorTimerW != 33) {
                  var2 = false;
               } else {
                  var2 = true;
               }

               if (var2) {
                  val_int_eb = 2;
                  drawTextLabel(4);
               } else if (val_int_dM - val_int_aA >= var1 && !val_bool_aC || val_coreengine_e != null && val_bool_ay && val_bool_az) {
                  val_int_aA = 0;
                  CoreEngine var12;
                  if ((var12 = exec_b_coreengine_to_coreengine(var0)).actorTimerW == 22) {
                     var12.updateActor(12);
                     var12.val_bool_s = true;
                  }

                  drawTextLabel(6);
               }
            }
            break;
         case 4:
            if (val_bool_aO) {
               drawTextLabel(6);
            }
            break;
         case 5:
            if (val_bool_at) {
               drawTextLabel(15);
            }

            val_int_ee = val_int_ee + val_int_e;
            switch (val_int_ed) {
               case 0:
                  if (val_coreengine_c.exec_h_to_bool() && val_coreengine_c.actorActiveFlag
                     || val_coreengine_c.actorTimerW == 22
                     || val_coreengine_c.actorTimerW == 102) {
                     val_int_ed++;
                     val_int_ee = 0;
                  }
                  break label356;
               case 1:
                  if (val_int_ee > 500) {
                     exec_a_byte_bool_to_void((byte)47, false);
                     exec_M_int_to_void(2000);
                     val_int_ed++;
                     val_int_ee = 0;
                     val_int_eg = 1;
                  }
                  break label356;
               case 2:
                  if (val_int_ee > 2000) {
                     val_int_ed++;
                     val_int_eg = val_spritepartsequence_r.getPartXOffset(0);
                  }
                  break label356;
               case 3:
                  val_int_ef = 1;
                  val_int_ed++;
                  break label356;
               case 4:
                  if ((val_int_ef & 65532) >>> 2 == val_spritepartsequence_q.partOffsets.length - 2) {
                     val_int_ed++;
                     val_int_ee = 0;
                  }
                  break label356;
               case 5:
                  if (val_int_ee > 1000) {
                     val_int_ed++;
                     val_int_ee = 0;
                  }
                  break label356;
               case 6:
                  if (val_int_ee > 1000) {
                     val_int_ed++;
                     val_int_ee = 0;
                  }
                  break label356;
               case 7:
                  if (val_int_ee > 1000) {
                     val_int_ed++;
                     val_int_ee = 0;
                  }
                  break label356;
               case 8:
                  if (val_int_ee > 1000) {
                     val_int_ed++;
                     val_int_ee = 0;
                  }
                  break label356;
               case 9:
                  if (val_int_ee > 1000) {
                     val_int_ed++;
                     val_int_ee = 0;
                  }
                  break label356;
               case 10:
                  if (val_int_ee > 3000) {
                     drawTextLabel(15);
                  }
               default:
                  break label356;
            }
         case 6:
            if (val_int_dM - val_int_aA > 1500) {
               val_int_aA = 0;
               drawTextLabel(7);
            }
            break;
         case 7:
            if (val_int_dM - val_int_aA > 1000) {
               if (!val_bool_am && exec_a_to_coreengine().layerDepth != 2) {
                  drawTextLabel(8);
               } else {
                  exec_V_to_void();
               }
            }
            break;
         case 8:
            if (val_int_dM - val_int_aA > 2000) {
               val_int_aA = 0;
               exec_V_to_void();
            }
            break;
         case 9:
            if (val_int_dM - val_int_aA > 3500) {
               val_int_aA = 0;
               exec_W_to_void();
            }
            break;
         case 10:
            if (val_int_dM - val_int_aA > 3500) {
               val_int_aA = 0;
               exec_W_to_void();
            }
            break;
         case 11:
            if (val_int_dM > 1500) {
               if (var0 != null) {
                  drawTextLabel(6);
               } else {
                  drawTextLabel(12);
               }
            }
            break;
         case 12:
            if (val_int_dM >= 1500) {
               if (val_int_dU != 2 && val_int_dV != 2) {
                  drawTextLabel(0);
               } else {
                  drawTextLabel(15);
               }
            }
            break;
         case 13:
            if (val_coreengine_c.actorLifecycleState == 2) {
               exec_D_int_to_void(val_int_dR);
               exec_N_int_to_void(val_coreengine_c.spriteTransformLookupB[0]);
               exec_U_to_void();
               val_coreengine_c.updateActor(6);
               drawTextLabel(2);
            }
            break;
         case 14:
            exec_a_byte_byte_to_void((byte)1, (byte)2);
            if (val_bool_at) {
               val_bool_aO = false;
               exec_z_int_to_void(2);
            } else if (val_bool_au) {
               val_bool_ax = true;
            }
            break;
         case 15:
            if (exec_x_to_bool()) {
               val_bool_ax = true;
            } else {
               drawTextLabel(14);
            }
      }

      label259:
      switch (val_int_dL) {
         case 0:
            val_coreengine_b.setActorPosition(-64, 0);
            val_coreengine_c.setActorPosition(64, 0);
            updateBattleState();
            transitionGameState();
            renderHUD();
            renderOverlays();
         case 1:
         case 3:
         case 4:
         case 8:
         case 11:
         case 12:
         default:
            break;
         case 2:
            if (val_bool_am) {
               if (val_int_ei != val_coreengine_c.currentHealth) {
                  val_int_ei = val_coreengine_c.currentHealth;
                  val_int_eh = 0;
               }

               if ((val_int_eh = val_int_eh + val_int_e) > 3500) {
                  val_int_eh = 0;
                  val_coreengine_c.currentHealth = 100;
                  val_int_ei = val_coreengine_c.currentHealth;
               }
            }

            if (!val_bool_am) {
               val_int_dS = val_int_dS - val_int_e;
            }

            for (int var15 = 0; var15 < 2; var15++) {
               CoreEngine var10;
               if (var15 == 0) {
                  var10 = val_coreengine_b;
               } else {
                  var10 = val_coreengine_c;
               }

               var0 = var10;
               if (var10.actorCounterB >= 4
                  && exec_b_coreengine_to_coreengine(var10).actorTimerW != 21
                  && exec_b_coreengine_to_coreengine(var10).actorTimerW != 26
                  && exec_b_coreengine_to_coreengine(var10).actorTimerW != 30) {
                  exec_c_coreengine_to_void(exec_b_coreengine_to_coreengine(var10));
               }

               if (var0.actorCounterC >= 4
                  && exec_b_coreengine_to_coreengine(var0).actorTimerW != 21
                  && exec_b_coreengine_to_coreengine(var0).actorTimerW != 26
                  && exec_b_coreengine_to_coreengine(var0).actorTimerW != 30) {
                  exec_c_coreengine_to_void(exec_b_coreengine_to_coreengine(var0));
                  var0.actorCounterC = 0;
               }
            }
            break;
         case 5:
            if (val_int_ed <= 0) {
               exec_i_int_int_to_void(val_coreengine_c.exec_a_to_int(), 0);
            } else {
               exec_a_int_int_bool_to_void(0, 0, true);
            }

            if (val_int_ed < 7) {
               val_int_eW = 300;
            }

            switch (val_int_ed) {
               case 0:
               case 5:
                  boolean var14;
                  if (!val_bool_aB) {
                     var14 = true;
                  } else {
                     var14 = false;
                  }

                  val_bool_aB = var14;
                  break label259;
               case 1:
               case 7:
                  val_bool_aB = true;
                  break label259;
               case 2:
                  val_bool_aB = false;
                  val_int_eg = val_spritepartsequence_r.getPartYOffset(val_int_eg, val_int_e);
               case 3:
               default:
                  break label259;
               case 4:
                  val_bool_aB = false;
                  val_int_ef = val_spritepartsequence_q.getPartYOffset(val_int_ef, val_int_e);
                  break label259;
               case 6:
                  val_bool_aB = true;
                  val_int_ef = val_spritepartsequence_q.getPartYOffset(val_int_ef, val_int_e);
                  break label259;
               case 8:
                  val_bool_aB = false;
                  break label259;
            }
         case 6:
         case 7:
            if (var0.actorTimerW != 20
               && (var0.actorTimerW == 0 || var0.actorTimerW == 3 || var0.actorTimerW == 1 || var0.actorTimerW == 16)
               && !exec_z_to_bool()) {
               var0.updateActor(20);
            }
            break;
         case 9:
            val_int_dX = val_spritepartsequence_o.getPartYOffset(val_int_dX, val_int_e);
            break;
         case 10:
            val_int_dY = val_spritepartsequence_p.getPartYOffset(val_int_dY, val_int_e);
            break;
         case 13:
            if (val_coreengine_c.actorLifecycleState == 0 && val_int_dM >= 750) {
               int var8 = val_int_ec;
               byte var13 = val_arr_byte_k[var8];
               if (val_coreengine_b.actorCurrentAnimIndex == 1) {
                  var8 = val_int_eH >> 8;
               } else {
                  var8 = val_int_eG >> 8;
               }

               int var10003 = -val_coreengine_b.actorCurrentAnimIndex;
               exec_h_byte_to_void(val_arr_byte_o[var13]);
               val_coreengine_c = spawnActor(var13, var8, 0, var10003, 2, 0, true, 1);
               val_int_dR = var13;
               exec_U_to_void();
            }
      }

      val_coreengine_e = null;
   }

   public static void drawTextLabel(int var0) {
      switch (val_int_dL) {
         case 2:
            exec_ai_to_void();
      }

      val_bool_ay = false;
      val_bool_az = false;
      val_int_dM = 0;
      switch (var0) {
         case 0:
            exec_Z_to_void();
            exec_P_to_void();
            exec_S_to_void();
            val_coreengine_b.setActorPosition(-64, 0);
            val_coreengine_b.setActorAnimation(1);
            val_coreengine_b.currentHealth = 100;
            val_coreengine_b.superMeterEnergy = 25600;
            val_coreengine_b.updateActor(0);
            val_coreengine_b.val_bool_p = false;
            exec_a_arr_byte_to_void(val_coreengine_b.scratchpadBuffer);
            val_coreengine_b.val_bool_A = false;
            val_coreengine_b.actorTimerU = 0;
            val_coreengine_b.actorTimerT = 0;
            val_coreengine_b.actorActiveFlag = true;
            val_coreengine_b.val_bool_G = false;
            val_coreengine_b.val_bool_y = true;
            val_coreengine_b.actorTimerZ = 99000;
            val_coreengine_b.actorCounterA = 99000;
            val_coreengine_b.actorCounterC = 0;
            val_coreengine_b.actorCounterD = 0;
            val_coreengine_b.actorCounterB = 0;
            val_coreengine_b.exec_r_int_to_void(0);
            val_coreengine_c.setActorPosition(64, 0);
            val_coreengine_c.setActorAnimation(-1);
            val_coreengine_c.currentHealth = 100;
            val_coreengine_c.superMeterEnergy = 25600;
            val_coreengine_c.updateActor(0);
            val_coreengine_c.val_bool_p = false;
            exec_a_arr_byte_to_void(val_coreengine_c.scratchpadBuffer);
            val_coreengine_c.val_bool_A = false;
            val_coreengine_c.actorTimerU = 0;
            val_coreengine_c.actorTimerT = 0;
            val_coreengine_c.actorActiveFlag = true;
            val_coreengine_c.val_bool_G = false;
            val_coreengine_c.val_bool_y = true;
            val_coreengine_c.actorTimerZ = 99000;
            val_coreengine_c.actorCounterA = 99000;
            val_coreengine_c.actorCounterC = 0;
            val_coreengine_c.actorCounterD = 0;
            val_coreengine_c.actorCounterB = 0;
            val_coreengine_c.exec_r_int_to_void(0);
            val_bool_aw = true;
            val_int_dc = 0;
            val_int_dd = 0;
            val_int_de = 0;
            val_int_df = 0;
            exec_ai_to_void();
            val_int_dS = 99000;
            val_int_dT++;
            exec_a_int_int_bool_to_void(0, 0, true);
            exec_K_int_to_void(0);
            if (!val_bool_am) {
               switch (val_int_dT) {
                  case 1:
                     exec_a_byte_bool_to_void((byte)40, false);
                     break;
                  case 2:
                     exec_a_byte_bool_to_void((byte)41, false);
                     break;
                  case 3:
                     exec_a_byte_bool_to_void((byte)42, false);
               }
            }

            val_encodedtextbuffer_x = val_encodedtextbuffer_u.substring(val_int_dT);
            if (exec_A_to_bool()) {
               val_int_ec = 0;
               val_coreengine_c.val_bool_p = false;
               val_coreengine_c.val_bool_o = false;
               val_coreengine_c.setCharacterId(val_arr_byte_k[0]);
               exec_D_int_to_void(val_coreengine_c.characterId);
               exec_N_int_to_void(val_arr_arr_short_g[val_coreengine_c.characterId][0]);
               exec_U_to_void();
            }
            break;
         case 1:
            val_encodedtextbuffer_A = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(24, null);
            exec_a_byte_bool_to_void((byte)14, false);
            break;
         case 2:
            val_coreengine_b.val_bool_p = true;
            val_coreengine_c.val_bool_p = true;
            break;
         case 3:
            val_coreengine_b.val_bool_p = false;
            val_coreengine_c.val_bool_p = false;
            exec_a_to_coreengine().val_bool_p = true;
            boolean var8;
            switch (exec_b_coreengine_to_coreengine(exec_a_to_coreengine()).characterId) {
               case 2:
                  var8 = false;
                  break;
               case 3:
                  var8 = false;
                  break;
               default:
                  var8 = true;
            }

            if (var8) {
               val_encodedtextbuffer_G = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(64, null);
               exec_a_byte_bool_to_void((byte)16, false);
            } else {
               val_encodedtextbuffer_G = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(65, null);
               exec_a_byte_bool_to_void((byte)15, false);
            }
            break;
         case 4:
            exec_K_int_to_void(1);
            val_coreengine_b.val_bool_p = false;
            val_coreengine_c.val_bool_p = false;
            val_bool_aw = false;
            break;
         case 5:
            val_coreengine_b.currentAnimSet = null;
            val_byte_s = 3;
            val_byte_t = 0;
            exec_ac_to_void();
            exec_b_byte_to_void((byte)4);
            val_encodedtextbuffer_B = val_encodedtextbuffer_v.copyFrom(exec_a_to_coreengine().fighterNameBuffer);
            val_arr_short_g = exec_a_encodedtextbuffer_int_to_arr_short(
               val_encodedtextbuffer_L = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(69, null), val_int_bD - 16
            );
            val_arr_short_h = exec_a_encodedtextbuffer_int_to_arr_short(
               val_encodedtextbuffer_M = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(70, null), val_int_bD - 16
            );
            exec_K_int_to_void(1);
            val_int_dU = 2;
            val_bool_aB = false;
            val_int_ed = 0;
            val_int_ee = 0;
            val_bool_aw = false;
            val_coreengine_b.val_bool_p = false;
            val_coreengine_c.val_bool_p = false;
            exec_i_int_int_to_void(val_coreengine_c.exec_a_to_int(), 0);

            try {
               val_animationset_q = exec_a_int_int_byte_bool_to_animationset(134217842, -1, (byte)0, false);
               val_spritepartsequence_q = exec_a_int_int_to_spritepartsequence(134217772, 0);
               val_spritepartsequence_r = exec_a_int_int_to_spritepartsequence(100663311, 1);
               exec_U_to_void();
               exec_U_to_void();
            } catch (Exception var4) {
            }
            break;
         case 6:
            switch (val_int_eb) {
               case 1:
                  try {
                     byte var5;
                     if (val_bool_j) {
                        var5 = 0;
                     } else {
                        var5 = 3;
                     }

                     var5 = var5;
                     val_animationset_o = exec_a_int_int_byte_bool_to_animationset(150994955, -1, var5, false);
                     val_spritepartsequence_o = exec_a_int_int_to_spritepartsequence(150994946, 1);
                     val_int_dX = 1;
                     val_int_dW = val_spritepartsequence_o.getSequenceHeight(val_animationset_o);
                     exec_U_to_void();
                  } catch (Exception var3) {
                  }
                  break;
               case 2:
                  try {
                     val_animationset_p = exec_a_int_int_byte_bool_to_animationset(150994954, -1, (byte)0, false);
                     val_spritepartsequence_p = exec_a_int_int_to_spritepartsequence(150994945, 0);
                     val_int_dY = 1;
                     exec_U_to_void();
                  } catch (Exception var2) {
                  }
            }

            CoreEngine var7;
            if ((var7 = exec_a_to_coreengine()) == val_coreengine_c) {
               val_int_dV++;
            } else if (var7 == val_coreengine_b) {
               val_int_dU++;
            }

            val_coreengine_b.val_bool_p = false;
            val_coreengine_c.val_bool_p = false;
            if (var7 != null) {
               exec_a_byte_bool_to_void(val_arr_byte_o[var7.characterId], false);
            }

            if (var7 != null) {
               val_encodedtextbuffer_B = val_encodedtextbuffer_v.copyFrom(var7.fighterNameBuffer);
            } else {
               val_encodedtextbuffer_B = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(57, null);
            }
            break;
         case 7:
            if (exec_a_to_coreengine() != null) {
               exec_a_byte_bool_to_void((byte)54, false);
            }
            break;
         case 8:
            boolean var1;
            if (exec_a_to_coreengine() != null && exec_a_to_coreengine().currentHealth == 100) {
               var1 = true;
            } else {
               var1 = false;
            }

            val_int_dZ = 1000 * (val_int_dS / 1000);
            CoreEngine var10 = exec_a_to_coreengine();
            var10.actorCounterE = var10.actorCounterE + val_int_dZ;
            val_encodedtextbuffer_E = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(62, null);
            (val_encodedtextbuffer_F = new EncodedTextBuffer(6)).appendInt(val_int_dZ);
            if (var1) {
               exec_a_byte_bool_to_void((byte)17, false);
               if (val_bool_aA && val_int_dT == 2) {
                  val_int_ea = 500000;
                  var10 = exec_a_to_coreengine();
                  var10.actorCounterE = var10.actorCounterE + val_int_ea;
                  val_encodedtextbuffer_C = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(61, null);
               } else {
                  val_int_ea = 200000;
                  var10 = exec_a_to_coreengine();
                  var10.actorCounterE = var10.actorCounterE + val_int_ea;
                  val_encodedtextbuffer_C = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(60, null);
                  if (val_int_dT == 1) {
                     val_bool_aA = true;
                  }
               }
            } else {
               val_int_ea = 800 * exec_a_to_coreengine().currentHealth;
               var10 = exec_a_to_coreengine();
               var10.actorCounterE = var10.actorCounterE + val_int_ea;
               val_encodedtextbuffer_C = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(63, null);
            }

            (val_encodedtextbuffer_D = new EncodedTextBuffer(6)).appendInt(val_int_ea);
            break;
         case 9:
            exec_a_byte_bool_to_void((byte)13, true);
            if (exec_a_to_coreengine().layerDepth == 0) {
               exec_a_to_coreengine().actorCounterE += 100000;
               val_encodedtextbuffer_I = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(66, null);
               (val_encodedtextbuffer_H = new EncodedTextBuffer(6)).appendInt(100000);
            } else {
               val_encodedtextbuffer_I = new EncodedTextBuffer();
               val_encodedtextbuffer_H = new EncodedTextBuffer();
            }
            break;
         case 10:
            exec_a_byte_bool_to_void((byte)5, true);
            if (exec_a_to_coreengine().layerDepth == 0) {
               exec_a_to_coreengine().actorCounterE += 100000;
               val_encodedtextbuffer_J = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(67, null);
               (val_encodedtextbuffer_K = new EncodedTextBuffer(6)).appendInt(100000);
            } else {
               val_encodedtextbuffer_J = new EncodedTextBuffer();
               val_encodedtextbuffer_K = new EncodedTextBuffer();
            }
            break;
         case 11:
            val_encodedtextbuffer_y = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(58, null);
            break;
         case 12:
            val_encodedtextbuffer_z = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(57, null);
            val_int_dU++;
            val_int_dV++;
            break;
         case 13:
            exec_P_to_void();
            exec_S_to_void();
            exec_g_int_int_to_void(val_coreengine_c.exec_a_to_int(), val_coreengine_c.exec_b_to_int());
            val_coreengine_c.setActorLifecycle(3);
            if (val_coreengine_c.characterId != val_coreengine_b.characterId) {
               exec_E_int_to_void(val_arr_arr_short_g[val_coreengine_c.characterId][0]);
               exec_J_int_to_void(val_coreengine_c.characterId);
            }

            exec_U_to_void();
            val_int_ec++;
            break;
         case 14:
            val_encodedtextbuffer_O = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(85, null);
            val_int_q = 1;
            val_long_c = val_long_g;
            val_long_d = val_long_g;
            val_long_e = val_long_g;
            exec_ah_to_void();
            exec_U_to_void();
         case 15:
      }

      val_int_dL = var0;
   }

   public static void renderOverlays() {
      val_int_eJ = -1;

      for (val_int_eC = 0; val_int_eC < 3; val_int_eC++) {
         for (val_int_eB = 0; val_int_eB < val_arr_int_bk[val_int_eC]; val_int_eB++) {
            for (int var0 = 0; var0 < val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].getStateValue(1); var0++) {
               if (val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].checkHitBox(1, val_arr_int_bl, val_int_eD)) {
                  val_int_eE = val_int_eD;
                  val_int_eD += 5;
                  boolean var1 = false;

                  for (int var2 = 0; var2 < 3; var2++) {
                     if (var2 != val_int_eC) {
                        for (int var3 = 0; var3 < val_arr_int_bk[var2]; var3++) {
                           val_arr_int_bo = val_arr_arr_entityinterface_a[var2][var3].getBounds();

                           for (int var4 = 0; var4 < val_arr_arr_entityinterface_a[var2][var3].getStateValue(0); var4++) {
                              if (val_arr_arr_entityinterface_a[var2][var3].checkHitBox(0, val_arr_int_bl, val_int_eD)
                                 && exec_a_int_int_int_int_to_int(
                                       val_arr_int_bl[val_int_eD + 1],
                                       val_arr_int_bl[val_int_eD + 3],
                                       val_arr_int_bl[val_int_eD + 2],
                                       val_arr_int_bl[val_int_eD]
                                    )
                                    != 0) {
                                 val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].checkIntersect(val_arr_int_br);
                                 exec_a_int_int_int_int_arr_int_to_void(
                                    val_arr_int_bl[val_int_eD + 1],
                                    val_arr_int_bl[val_int_eD + 3],
                                    val_arr_int_bl[val_int_eD + 2],
                                    val_arr_int_bl[val_int_eD],
                                    val_arr_int_bq
                                 );
                                 if (!var1) {
                                    exec_a_arr_int_arr_int_int_int_int_int_to_void(val_arr_int_br, val_arr_int_bq, var2, var3, val_int_eC, val_int_eB);
                                    var1 = true;
                                 }
                              }
                           }

                           for (int var5 = 0; var5 < val_arr_arr_entityinterface_a[var2][var3].getStateValue(1); var5++) {
                              if (val_arr_arr_entityinterface_a[var2][var3].checkHitBox(1, val_arr_int_bl, val_int_eD)
                                 && exec_a_int_int_int_int_to_int(
                                       val_arr_int_bl[val_int_eD + 1],
                                       val_arr_int_bl[val_int_eD + 3],
                                       val_arr_int_bl[val_int_eD + 2],
                                       val_arr_int_bl[val_int_eD]
                                    )
                                    != 0) {
                                 val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].checkIntersect(val_arr_int_br);
                                 exec_a_int_int_int_int_arr_int_to_void(
                                    val_arr_int_bl[val_int_eD + 1],
                                    val_arr_int_bl[val_int_eD + 3],
                                    val_arr_int_bl[val_int_eD + 2],
                                    val_arr_int_bl[val_int_eD],
                                    val_arr_int_bq
                                 );
                                 if (!var1) {
                                    exec_a_arr_int_arr_int_int_int_int_int_to_void(val_arr_int_br, val_arr_int_bq, var2, var3, val_int_eC, val_int_eB);
                                    var1 = true;
                                 }
                              }
                           }
                        }
                     }
                  }

                  val_int_eD -= 5;
               }
            }
         }
      }

      if (val_int_eJ != -1) {
         val_arr_int_br[0] = val_arr_int_bs[val_int_eJ];
         val_arr_int_br[1] = val_arr_int_bs[val_int_eJ + 1];
         val_arr_int_br[2] = val_arr_int_bs[val_int_eJ + 2];
         val_arr_int_br[3] = val_arr_int_bs[val_int_eJ + 3];
         val_arr_int_br[4] = val_arr_int_bs[val_int_eJ + 4];
         val_arr_int_br[5] = val_arr_int_bs[val_int_eJ + 5];
         val_arr_int_br[6] = val_arr_int_bs[val_int_eJ + 6];
         val_arr_int_br[7] = val_arr_int_bs[val_int_eJ + 7];
         val_arr_int_bq[0] = val_arr_int_bs[val_int_eJ + 8];
         val_arr_int_bq[1] = val_arr_int_bs[val_int_eJ + 9];
         val_arr_int_bq[2] = val_arr_int_bs[val_int_eJ + 10];
         val_arr_int_bq[3] = val_arr_int_bs[val_int_eJ + 11];
         val_arr_arr_entityinterface_a[val_arr_int_bs[val_int_eJ + 12]][val_arr_int_bs[val_int_eJ + 13]]
            .interactWithEntity(val_arr_arr_entityinterface_a[val_arr_int_bs[val_int_eJ + 14]][val_arr_int_bs[val_int_eJ + 15]], val_arr_int_br);
         val_arr_arr_entityinterface_a[val_arr_int_bs[val_int_eJ + 14]][val_arr_int_bs[val_int_eJ + 15]].updateTick();
         val_int_eI = 0;
      } else {
         for (byte var6 = 0; var6 < val_int_eI; var6 += 16) {
            val_arr_int_br[0] = val_arr_int_bs[var6];
            val_arr_int_br[1] = val_arr_int_bs[var6 + 1];
            val_arr_int_br[2] = val_arr_int_bs[var6 + 2];
            val_arr_int_br[3] = val_arr_int_bs[var6 + 3];
            val_arr_int_br[4] = val_arr_int_bs[var6 + 4];
            val_arr_int_br[5] = val_arr_int_bs[var6 + 5];
            val_arr_int_br[6] = val_arr_int_bs[var6 + 6];
            val_arr_int_br[7] = val_arr_int_bs[var6 + 7];
            val_arr_int_bq[0] = val_arr_int_bs[var6 + 8];
            val_arr_int_bq[1] = val_arr_int_bs[var6 + 9];
            val_arr_int_bq[2] = val_arr_int_bs[var6 + 10];
            val_arr_int_bq[3] = val_arr_int_bs[var6 + 11];
            val_arr_arr_entityinterface_a[val_arr_int_bs[var6 + 12]][val_arr_int_bs[var6 + 13]]
               .interactWithEntity(val_arr_arr_entityinterface_a[val_arr_int_bs[var6 + 14]][val_arr_int_bs[var6 + 15]], val_arr_int_br);
            val_arr_arr_entityinterface_a[val_arr_int_bs[var6 + 14]][val_arr_int_bs[var6 + 15]].updateTick();
         }

         val_int_eI = 0;
      }
   }

   public static void tickGameState() {
      if (val_bool_ah) {
         initGameState();
      } else if (val_bool_ai) {
         if (val_bool_ao) {
            val_int_cO = 0;
            val_int_cE++;
            val_bool_af = true;
         } else {
            val_bool_af = false;
         }

         if (val_bool_an) {
            val_int_cO = 0;
            val_int_cE--;
            val_bool_ad = true;
         } else {
            val_bool_ad = false;
         }

         if (val_bool_ar) {
            if ((val_int_cO = val_int_cO + val_int_e) > 150) {
               val_int_cO = 0;
               val_int_cE--;
            }

            val_bool_ad = true;
         }

         if (val_bool_as) {
            if ((val_int_cO = val_int_cO + val_int_e) > 150) {
               val_int_cO = 0;
               val_int_cE++;
            }

            val_bool_af = true;
         }

         if (val_bool_au) {
            val_bool_ai = false;
            exec_Z_to_void();
         }

         if (val_int_cE + val_int_cF > val_arr_short_f[0] + 1) {
            val_int_cE = val_arr_short_f[0] - val_int_cF + 1;
         }

         if (val_int_cE <= 0) {
            val_int_cE = 1;
         }

         if (val_bool_ab) {
            if (val_int_cE + val_int_cF <= val_arr_short_f[0]) {
               val_bool_ae = true;
            } else {
               val_bool_ae = false;
            }

            if (val_int_cE > 1) {
               val_bool_ac = true;
               return;
            }

            val_bool_ac = false;
         }
      } else if (val_int_cw == 3 && val_int_dL != 14 && val_bool_au) {
         exec_k_to_void();
      } else {
         if (val_int_cw == 3 && val_int_dL != 14 && val_int_dL != 5 && val_bool_at) {
            if (val_int_cw == 3 && exec_v_to_bool()) {
               exec_l_to_void();
               val_bool_ai = true;
               exec_b_byte_to_void(val_byte_q);
               val_arr_short_f = exec_a_encodedtextbuffer_int_to_arr_short(
                  val_encodedtextbuffer_m = (val_encodedtextbuffer_m = (val_encodedtextbuffer_m = new EncodedTextBuffer(500))
                        .appendBuffer(val_coreengine_b.fighterTitleBuffer))
                     .appendString("||" + exec_a_to_encodedtextbuffer()),
                  val_int_n - 16
               );
               val_int_cE = 1;
               val_int_cF = (val_int_o - val_int_ai) / exec_l_to_int();
               exec_a_byte_byte_to_void((byte)0, (byte)4);
               boolean var8 = val_arr_short_f[0] > val_int_cF;
               val_bool_ab = var8;
               if (var8) {
                  val_int_cF = (val_int_o - val_int_ai - 2 * exec_h_to_int()) / exec_l_to_int() - 1;
                  val_int_cO = 0;
               }

               int var8_pos = (val_int_o - val_int_ai) / 2;
               int var10;
               if (val_bool_ab) {
                  var10 = exec_h_to_int() - 7 * exec_l_to_int() / 4;
               } else {
                  var10 = 0;
               }

               val_int_cB = (val_int_cB = var8_pos + var10) - Math.min(val_arr_short_f[0], val_int_cF) * exec_l_to_int() / 2;
               return;
            }
         } else {
            label369: {
               val_int_cx = val_int_cx + val_int_e;
               switch (val_int_cw) {
                  case 0:
                     if (val_bool_aa && !val_bool_am) {
                        val_int_cz = val_int_bZ;
                        val_int_cA = val_int_ce;
                        val_arr_arr_int_d = val_arr_arr_int_c;
                        val_bool_ag = true;
                        val_int_cy = val_int_cu;
                        exec_u_int_to_void(4);
                        break label369;
                     }

                     exec_u_int_to_void(1);
                     break label369;
                  case 1:
                     if (val_bool_W) {
                        val_int_cy = exec_n_to_int();
                        if (val_bool_am) {
                           exec_u_int_to_void(3);
                        } else {
                           exec_u_int_to_void(2);
                        }
                     }

                     if (val_bool_X) {
                        exec_u_int_to_void(11);
                     }
                     break label369;
                  case 2:
                     if (!val_bool_Z) {
                        break label369;
                     }

                     val_int_cz = val_int_bZ;
                     val_int_cG = exec_j_to_int();
                     exec_a_byte_byte_to_void((byte)0, (byte)0);
                     boolean var1;
                     if (val_int_cy == 6) {
                        var1 = true;
                     } else {
                        var1 = val_bool_ag;
                     }

                     if (!var1) {
                        val_bool_ag = true;
                        exec_u_int_to_void(10);
                        break label369;
                     }
                     break;
                  case 3:
                     if (!val_bool_ax) {
                        break label369;
                     }

                     if (!exec_x_to_bool()) {
                        exec_X_to_void();
                        break label369;
                     }

                     if (!val_bool_am) {
                        val_int_cA++;
                        exec_b_to_byte();
                        if (val_int_cA >= exec_m_to_int()) {
                           if (val_bool_al) {
                              val_bool_al = false;
                              exec_u_int_to_void(7);
                           } else if (val_int_cy == 6) {
                              exec_u_int_to_void(6);
                           } else {
                              exec_u_int_to_void(5);
                           }

                           exec_d_bool_to_void(false);
                           exec_I_to_void();
                        } else {
                           exec_u_int_to_void(4);
                        }
                        break label369;
                     }

                     exec_b_to_byte();
                     break;
                  case 4:
                     if (val_bool_Z) {
                        val_arr_byte_k = null;
                        boolean var4;
                        if (val_arr_arr_int_c[val_int_bZ][val_int_ce + 1] == -2) {
                           var4 = true;
                        } else {
                           var4 = false;
                        }

                        if (var4) {
                           (val_arr_byte_k = new byte[3])[0] = 4;
                           val_arr_byte_k[1] = 1;
                           val_arr_byte_k[2] = 0;
                           val_int_cG = val_arr_byte_k[0];
                        } else {
                           if (val_arr_arr_int_c[val_int_bZ][val_int_ce + 1] == -1) {
                              var4 = true;
                           } else {
                              var4 = false;
                           }

                           if (var4) {
                              (val_arr_byte_k = new byte[2])[0] = 3;
                              val_arr_byte_k[1] = 2;
                              val_int_cG = val_arr_byte_k[0];
                           } else {
                              if (val_arr_arr_int_c[val_int_bZ][val_int_ce + 1] >= 0) {
                                 var4 = true;
                              } else {
                                 var4 = false;
                              }

                              if (var4) {
                                 val_int_cG = exec_j_to_int();
                              }
                           }
                        }

                        exec_u_int_to_void(3);
                     }
                     break label369;
                  case 5:
                     if (val_bool_at || val_bool_av || val_encodedtextbuffer_m == null) {
                        exec_u_int_to_void(6);
                     }
                     break label369;
                  case 6:
                     if (val_bool_at || val_bool_av) {
                        exec_X_to_void();
                     }
                     break label369;
                  case 7:
                     if (val_bool_at || val_bool_av) {
                        exec_u_int_to_void(5);
                     }
                     break label369;
                  case 8:
                     val_bool_S = !val_bool_S;
                     if (val_bool_ap && --val_int_bp < 0) {
                        val_int_bp = 2;
                     }

                     if (val_bool_aq && ++val_int_bp > 2) {
                        val_int_bp = 0;
                     }

                     if (val_bool_an) {
                        exec_x_int_to_void(val_arr_byte_j[val_int_bp] + 1);
                        val_int_bq = 20;
                        val_int_br = 20;
                     }

                     if (val_bool_ao) {
                        exec_x_int_to_void(val_arr_byte_j[val_int_bp] - 1);
                        val_int_bq = 20;
                        val_int_br = 20;
                     }

                     if (val_bool_ar && --val_int_br <= 0) {
                        if ((val_int_bq -= 4) < 2) {
                           val_int_bq = 2;
                        }

                        val_int_br = val_int_bq;
                        exec_x_int_to_void(val_arr_byte_j[val_int_bp] + 1);
                     }

                     if (val_bool_as && --val_int_br <= 0) {
                        if ((val_int_bq -= 4) < 2) {
                           val_int_bq = 2;
                        }

                        val_int_br = val_int_bq;
                        exec_x_int_to_void(val_arr_byte_j[val_int_bp] - 1);
                     }

                     if (val_bool_av && ++val_int_bp > 2) {
                        if (val_bool_Q) {
                           val_bool_R = true;
                        } else {
                           val_int_bp = 2;
                        }
                     }

                     if (val_bool_Q && val_bool_at) {
                        val_bool_R = true;
                     }

                     val_arr_int_aj[0] = val_int_bm + val_int_bn / 2 - val_arr_int_al[0] / 2 + val_int_bp * (val_int_bn + val_int_bo);
                     val_arr_int_aj[1] = val_int_bm + val_int_bn / 2 - val_arr_int_al[0] / 2 + val_int_bp * (val_int_bn + val_int_bo);
                     byte var0 = (byte)(val_bool_Q ? 1 : 0);
                     val_byte_h = var0;
                     exec_a_byte_byte_to_void(var0, val_byte_i);
                     if (val_bool_R) {
                        val_int_cH = exec_a_arr_byte_int_to_int(val_arr_byte_j, (int)val_long_c);
                        exec_u_int_to_void(9);
                     }
                     break label369;
                  case 9:
                     if (val_int_cx > 3000 || val_bool_at || val_bool_av) {
                        exec_d_bool_to_void(false);
                        exec_I_to_void();
                        exec_u_int_to_void(11);
                     }
                     break label369;
                  case 10:
                     if (!val_bool_at && !val_bool_av) {
                        break label369;
                     }
                     break;
                  default:
                     break label369;
               }

               exec_u_int_to_void(3);
            }

            switch (val_int_cw) {
               case 1:
                  switch (val_int_bG) {
                     case 0:
                        if (val_bool_ap) {
                           exec_e_byte_to_void(PatternTable.val_arr_arr_byte_a[val_byte_n][4]);
                        }

                        if (val_bool_aq) {
                           exec_e_byte_to_void(PatternTable.val_arr_arr_byte_a[val_byte_n][5]);
                        }

                        if (val_bool_an) {
                           exec_e_byte_to_void(PatternTable.val_arr_arr_byte_a[val_byte_n][6]);
                        }

                        if (val_bool_ao) {
                           exec_e_byte_to_void(PatternTable.val_arr_arr_byte_a[val_byte_n][7]);
                        }

                        if (val_bool_au) {
                           val_bool_X = true;
                        }

                        if (val_bool_at || val_bool_av) {
                           switch (PatternTable.val_arr_arr_byte_a[val_byte_n][1]) {
                              case 0:
                              case 1:
                                 if (exec_a_byte_to_bool(val_byte_n)) {
                                    exec_a_byte_bool_to_void(val_arr_byte_o[exec_n_to_int()], false);
                                    exec_A_int_to_void(2);
                                    if (!val_bool_Y) {
                                       exec_C_int_to_void(PatternTable.val_arr_arr_byte_a[val_byte_n][0]);
                                    }

                                    exec_an_to_void();
                                    return;
                                 }
                                 break;
                              case 2:
                                 exec_A_int_to_void(1);
                                 return;
                           }
                        }

                        val_int_bP = val_int_bP + val_int_e;
                        if (!val_bool_Y && val_int_bP > 700) {
                           if (exec_a_byte_to_bool(val_byte_n)) {
                              exec_C_int_to_void(PatternTable.val_arr_arr_byte_a[val_byte_n][0]);
                              val_spritepartsequence_j = val_spritepartsequence_k;
                              val_int_bO = 1;
                           } else {
                              val_int_bP = 0;
                           }
                        }
                        break;
                     case 1:
                        if ((val_int_bI = val_int_bI + val_int_e) > 1000) {
                           exec_e_byte_to_void(val_byte_j);
                           exec_a_byte_bool_to_void(val_arr_byte_o[exec_n_to_int()], false);
                           exec_A_int_to_void(2);
                           if (!val_bool_Y) {
                              exec_C_int_to_void(PatternTable.val_arr_arr_byte_a[val_byte_n][0]);
                           }

                           exec_an_to_void();
                        } else {
                           exec_e_byte_to_void(val_byte_k = exec_c_to_byte());
                        }
                        break;
                     case 2:
                        try {
                           val_int_bF = val_int_bF + val_int_e;
                           int var7;
                           if (val_int_bH == 16711680) {
                              var7 = 16777215;
                           } else {
                              var7 = 16711680;
                           }

                           val_int_bH = var7;
                           if (val_int_bF - val_int_aA > 1000) {
                              val_int_aA = 0;
                              val_bool_W = true;
                           }
                        } catch (Exception var2) {
                        }
                  }

                  if (val_bool_Y) {
                     val_int_bO = val_spritepartsequence_j.getPartYOffset(val_int_bO, val_int_e);
                  }

                  exec_a_byte_byte_to_void(val_byte_l, val_byte_m);
                  return;
               case 2:
               case 4:
                  updateSplashState();
                  return;
               case 3:
                  val_long_f = val_long_f + val_int_e;
                  val_long_d = Math.min(val_long_d = Math.max(val_long_d = val_long_e + (val_long_c - val_long_e) * val_long_f / 1000L, val_long_e), val_long_c);
                  renderAllActors();
                  return;
               case 5:
               case 10:
                  val_int_cI = val_spritepartsequence_m.getPartYOffset(val_int_cI, val_int_e);
               case 6:
               case 9:
                  exec_a_byte_byte_to_void((byte)3, (byte)0);
                  exec_b_byte_to_void((byte)4);
                  if (!val_bool_ak && (val_int_cD = val_int_cD - 5376 * val_int_e / 1000) >> 8 < 8 + 2 * exec_c_to_int()) {
                     if ((val_int_cD >> 8) + (val_arr_short_f[0] - val_int_cE + 1) * exec_c_to_int() < val_int_o - val_int_ai - exec_c_to_int()) {
                        val_int_cD = val_int_cD + 5376 * val_int_e / 1000;
                        val_bool_ak = true;
                     } else {
                        val_int_cE++;
                        val_int_cD = val_int_cD + (exec_c_to_int() << 8);
                     }
                  }

                  val_int_cC = (val_int_o - val_int_ai - (val_int_cD >> 8)) / exec_c_to_int();
                  break;
               case 7:
                  exec_a_byte_byte_to_void((byte)3, (byte)0);
                  return;
               case 8:
                  return;
            }
         }
      }
   }

   public static void tickSubState() {
      if (val_bool_I) {
         for (int var0 = 0; var0 < val_int_n; var0 += val_arr_int_X[0]) {
            for (int var1 = 0; var1 < val_int_o; var1 += val_arr_int_Y[0]) {
               exec_b_int_int_int_to_void(0, var0, var1);
            }
         }
      }

      if (val_bool_I) {
         for (int var6 = 0; var6 <= val_int_n; var6 += val_arr_int_X[1]) {
            exec_b_int_int_int_to_void(1, var6, 0);
         }
      }

      switch (val_int_aH) {
         case 0:
         case 1:
            exec_a_bool_bool_bool_bool_int_int_int_int_bool_to_void(
               val_bool_K, val_bool_M, val_bool_L, val_bool_N, val_int_aV, val_int_aW, val_int_aX, val_int_aY, false
            );
            break;
         case 2:
         case 3:
            exec_a_bool_bool_bool_bool_int_int_int_int_bool_to_void(
               val_bool_K, val_bool_M, val_bool_L, val_bool_N, val_int_aV, val_int_aW, val_int_aX, val_int_aY, true
            );
      }

      exec_b_byte_to_void((byte)4);
      exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_d, val_int_n / 2, val_int_aI, 17);
      switch (val_int_aE) {
         case 0:
         case 1:
         case 2:
         case 3:
            for (int var15 = 0; var15 < val_arr_int_t.length; var15++) {
               int var7 = val_int_bb;
               int var8 = val_int_aL + var15 * (val_arr_int_P[val_int_aH] + val_arr_int_Q[val_int_aH]);
               int var9 = val_int_ba;
               int var10 = val_arr_int_P[val_int_aH];
               EncodedTextBuffer var11 = val_arr_encodedtextbuffer_a[val_arr_int_t[var15]];
               int var20 = val_arr_int_u[val_arr_int_t[var15]];
               boolean var18;
               if (val_int_aD == val_arr_int_t[var15]) {
                  var18 = true;
               } else {
                  var18 = false;
               }

               int var5 = val_int_aH;
               int var4 = -1;
               if (val_arr_int_r != null && val_arr_int_r[val_arr_int_t[var15]] == 20) {
                  var4 = 6;
               }

               byte var14 = (byte)var4;
               boolean var2 = var18;
               if (var5 == 0) {
                  val_graphicsadapter_a.setColor(789000);
                  val_graphicsadapter_a.fillRect(var7 + val_arr_int_Y[3], var8, var9 - 2 * val_arr_int_Y[3], val_arr_int_Y[3]);
                  val_graphicsadapter_a.setColor(10920337);
                  val_graphicsadapter_a.fillRect(var7 + val_arr_int_Y[3], var8 + var10 - val_arr_int_Y[3], var9 - 2 * val_arr_int_Y[3], val_arr_int_Y[3]);
                  val_graphicsadapter_a.setColor(1842466);
                  val_graphicsadapter_a.fillRect(var7, var8 + val_arr_int_Y[3], val_arr_int_Y[3], var10 - 2 * val_arr_int_Y[3]);
                  val_graphicsadapter_a.setColor(13618372);
                  val_graphicsadapter_a.fillRect(var7 + var9 - val_arr_int_Y[3], var8 + val_arr_int_Y[3], val_arr_int_Y[3], var10 - 2 * val_arr_int_Y[3]);
                  val_arr_spritepartsequence_c[2]
                     .drawSequence(val_arr_int_ab[2], val_arr_animationset_a[val_arr_int_V[2]], var7 - val_arr_int_Z[2], var8 - val_arr_int_aa[2], 0);
                  val_arr_spritepartsequence_c[3]
                     .drawSequence(
                        val_arr_int_ab[3],
                        val_arr_animationset_a[val_arr_int_V[3]],
                        var7 - val_arr_int_Z[3] + var9 - val_arr_int_X[3],
                        var8 - val_arr_int_aa[3],
                        0
                     );
                  val_arr_spritepartsequence_c[4]
                     .drawSequence(
                        val_arr_int_ab[4],
                        val_arr_animationset_a[val_arr_int_V[4]],
                        var7 - val_arr_int_Z[4],
                        var8 - val_arr_int_aa[4] + var10 - val_arr_int_Y[4],
                        0
                     );
                  val_arr_spritepartsequence_c[5]
                     .drawSequence(
                        val_arr_int_ab[5],
                        val_arr_animationset_a[val_arr_int_V[5]],
                        var7 - val_arr_int_Z[5] + var9 - val_arr_int_X[5],
                        var8 - val_arr_int_aa[5] + var10 - val_arr_int_Y[5],
                        0
                     );
                  int var10001 = val_arr_int_Y[3];
                  int var10003 = val_arr_int_Y[3];
                  int var10005 = val_arr_int_Y[3] << 1;
                  int var3 = var10 - 2 * val_arr_int_Y[3];
                  var4 = var9 - var10005;
                  var5 = var8 + var10003;
                  int var21 = var7 + var10001;

                  for (int var19 = 0; var19 < var3; var19++) {
                     val_graphicsadapter_a.drawRGB(val_arr_int_af, var19 % 2, var4, var21, var5 + var19, var4);
                  }
               } else if (var18) {
                  if (var5 != 2 && var5 != 3) {
                     exec_b_int_int_int_to_void(6, var7 + var9 / 2 - var20 / 2 - val_int_bc - val_arr_int_X[6], var8 + var10 / 2 - val_arr_int_Y[6] / 2);
                     exec_b_int_int_int_to_void(6, var7 + var9 / 2 + var20 / 2 + val_int_bc, var8 + var10 / 2 - val_arr_int_Y[6] / 2);
                  } else {
                     exec_a_int_int_int_to_void(0, var7 + var9 / 2 - var20 / 2 - val_int_bc - val_arr_int_X[6], var8 + var10 / 2 - val_arr_int_Y[6] / 2);
                     exec_a_int_int_int_to_void(0, var7 + var9 / 2 + var20 / 2 + val_int_bc, var8 + var10 / 2 - val_arr_int_Y[6] / 2);
                  }
               }

               if (var14 != -1) {
                  exec_b_byte_to_void(var14);
               } else if (var2) {
                  exec_b_byte_to_void((byte)5);
               } else {
                  exec_b_byte_to_void((byte)4);
               }

               exec_a_encodedtextbuffer_int_int_int_to_void(var11, var7 + var9 / 2 - var20 / 2, var8 + var10 / 2 - exec_c_to_int() / 2, 20);
            }
            break;
         case 4:
         case 5:
         case 6:
            exec_b_byte_to_void((byte)4);
            exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
               val_encodedtextbuffer_e, val_arr_short_d, val_int_aS, Math.min(val_arr_short_d[0], val_int_aR), val_int_aM, val_int_aN, val_int_aU
            );
            return;
         case 7:
            exec_b_byte_to_void((byte)4);
            int var13 = val_int_bd;

            for (int var12 = 0; var12 < val_int_bi; var12++) {
               if (val_int_bs != var12 || !val_bool_T) {
                  exec_a_encodedtextbuffer_int_int_int_to_void(val_arr_encodedtextbuffer_c[var12], val_int_be, var13, 24);
                  exec_a_encodedtextbuffer_int_int_int_to_void(val_arr_encodedtextbuffer_b[var12], val_int_be, var13, 20);
                  exec_a_encodedtextbuffer_int_int_int_to_void(val_arr_encodedtextbuffer_d[var12], val_int_bf, var13, 24);
               }

               var13 += val_int_bh + val_int_bg;
            }
      }
   }

   public static void transitionGameState() {
      for (val_int_eC = 0; val_int_eC < 3; val_int_eC++) {
         for (val_int_eB = 0; val_int_eB < val_arr_int_bk[val_int_eC]; val_int_eB++) {
            (val_arr_int_bm = val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].getBounds())[10] = 16777215;
            if (!val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].isActive() && val_arr_int_bm != null) {
               if (val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].testCollision(val_arr_int_bp)) {
                  int[] var0 = val_arr_int_bp;
                  val_arr_int_bm[4] = 0;
                  val_arr_int_bm[2] = var0[1];
                  val_arr_int_bm[3] = var0[2];
                  val_arr_int_bm[5] = var0[3];
                  val_arr_int_bm[6] = var0[4];
                  val_arr_int_bm[7] = var0[0];
                  val_arr_int_bm[8] = val_arr_int_bm[0];
                  val_arr_int_bm[9] = val_arr_int_bm[1];
                  if (val_arr_int_bm[7] == 5 && val_arr_int_bm[6] < 0) {
                     val_arr_int_bm[4] = val_arr_int_bm[3] / 2;
                     val_arr_int_bm[6] = -val_arr_int_bm[6];
                     val_arr_int_bm[8] = val_arr_int_bm[8] - val_arr_int_bm[5] / 2;
                     long var1 = 4L * val_arr_int_bm[6] * val_arr_int_bm[4] * val_arr_int_bm[4];
                     val_arr_int_bm[9] = (int)(4L * val_arr_int_bm[6] * val_arr_int_bm[4] / val_arr_int_bm[3])
                        + val_arr_int_bm[9]
                        - (int)(var1 / (val_arr_int_bm[3] * val_arr_int_bm[3]));
                  }
               }

               if (val_arr_int_bm[7] != 0) {
                  if (val_arr_int_bm[2] > 0) {
                     int var9 = val_arr_int_bm[2] - val_int_e;
                     val_arr_int_bm[2] = var9;
                  } else {
                     if (val_arr_int_bm[7] != 5) {
                        val_arr_int_bm[4] = Math.min(val_arr_int_bm[4] + val_int_e, val_arr_int_bm[3]);
                     } else {
                        int var7 = val_arr_int_bm[4] + val_int_e;
                        val_arr_int_bm[4] = var7;
                     }

                     long var14;
                     label109: {
                        var14 = 0L;
                        long var10000;
                        switch (val_arr_int_bm[7]) {
                           case 1:
                              var10000 = val_arr_int_bm[4] << 8;
                              long var23 = val_arr_int_bm[3] << 8;
                              long var18 = var10000;
                              if (var10000 < 0L) {
                                 var10000 = 0L;
                              } else {
                                 long var24;
                                 var10000 = var24 = (var18 << 8) / var23;
                                 var10000 = (var10000 * var10000 >> 8) * var24 >> 8;
                              }

                              var14 = var10000;
                              break label109;
                           case 2:
                              var10000 = val_arr_int_bm[4] << 8;
                              long var20 = val_arr_int_bm[3] << 8;
                              long var17 = var10000;
                              if (var10000 < 0L) {
                                 var10000 = 0L;
                              } else {
                                 var20 = (var17 << 8) / var20;
                                 var10000 = 3L * var20;
                                 long var22 = (var20 * var20 >> 8) * var20 >> 8;
                                 var10000 = var10000 - 3L * (var20 * var20 >> 8) + var22;
                              }

                              var14 = var10000;
                              break label109;
                           case 3:
                              var10000 = val_arr_int_bm[4] << 8;
                              long var5 = val_arr_int_bm[3] << 8;
                              long var3 = var10000;
                              if (var10000 < 0L) {
                                 var10000 = 0L;
                              } else {
                                 var5 = (var5 - var3 << 8) / var5;
                                 var10000 = 256L - (3L * (var3 = var5 * var5 >> 8) - 2L * (var3 * var5 >> 8));
                              }
                              break;
                           case 4:
                           case 5:
                              var10000 = (val_arr_int_bm[4] << 8) / val_arr_int_bm[3];
                              break;
                           default:
                              break label109;
                        }

                        var14 = var10000;
                     }

                     val_arr_int_bm[0] = val_arr_int_bm[8] + (int)(var14 * val_arr_int_bm[5] >> 8);
                     switch (val_arr_int_bm[7]) {
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                           if (val_arr_int_bm[6] != 0) {
                              val_arr_int_bm[1] = val_arr_int_bm[9] - (int)(var14 * val_arr_int_bm[6] >> 8);
                           }
                           break;
                        case 5:
                           int var32 = val_arr_int_bm[9];
                           var14 = 4L * val_arr_int_bm[6] * val_arr_int_bm[4] * val_arr_int_bm[4];
                           val_arr_int_bm[1] = var32
                              - (int)(4L * val_arr_int_bm[6] * val_arr_int_bm[4] / val_arr_int_bm[3])
                              + (int)(var14 / (val_arr_int_bm[3] * val_arr_int_bm[3]));
                     }

                     if (val_arr_int_bm[7] != 5) {
                        if (val_arr_int_bm[4] == val_arr_int_bm[3]) {
                           val_arr_int_bm[7] = 0;
                        }
                     } else if (val_arr_int_bm[1] >= 0) {
                        val_arr_int_bm[7] = 0;
                        if (val_arr_int_bm[1] == 0) {
                           int var8 = val_arr_int_bm[1] + 1;
                           val_arr_int_bm[1] = var8;
                        }
                     }
                  }
               }

               if (val_arr_int_bm[1] > 0) {
                  val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].applyAction(8);
                  val_arr_int_bm[1] = 0;
               } else if (val_arr_int_bm[1] < val_int_eF) {
                  val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].applyAction(1);
                  if (val_int_eC != 2) {
                     val_arr_int_bm[1] = val_int_eF;
                  }
               }

               if (val_arr_int_bm[0] < val_int_eG) {
                  val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].applyAction(2);
                  if (val_int_eC != 2) {
                     val_arr_int_bm[0] = val_int_eG;
                  }
               } else if (val_arr_int_bm[0] > val_int_eH) {
                  val_arr_arr_entityinterface_a[val_int_eC][val_int_eB].applyAction(4);
                  if (val_int_eC != 2) {
                     val_arr_int_bm[0] = val_int_eH;
                  }
               }

               if (val_arr_int_bm[1] == 0) {
                  int var10 = val_arr_int_bm[10] ^ 1;
                  val_arr_int_bm[10] = var10;
               }

               if (val_arr_int_bm[1] == val_int_eF) {
                  int var11 = val_arr_int_bm[10] ^ 2;
                  val_arr_int_bm[10] = var11;
               }

               if (val_arr_int_bm[0] == val_int_eG) {
                  int var12 = val_arr_int_bm[10] ^ 4;
                  val_arr_int_bm[10] = var12;
               }

               if (val_arr_int_bm[0] == val_int_eH) {
                  int var13 = val_arr_int_bm[10] ^ 8;
                  val_arr_int_bm[10] = var13;
               }
            }
         }
      }
   }

   public static void exec_a_arr_int_bool_encodedtextbuffer_to_void(int[] var0, boolean var1, EncodedTextBuffer var2) {
      exec_b_byte_to_void((byte)4);
      val_int_aE = var0[0];
      val_bool_I = (boolean)var1;
      val_bool_K = false;
      val_bool_L = false;
      val_byte_h = 0;
      byte var3 = (byte)(val_int_aF > 0 ? 4 : 0);
      val_byte_i = var3;
      switch (val_int_aE) {
         case 0:
            val_int_aH = 0;
            val_byte_h = 3;
            break;
         case 1:
            val_int_aH = 2;
            val_byte_h = 3;
            break;
         case 2:
            val_int_aH = 3;
            val_byte_h = 1;
            break;
         case 3:
            val_int_aH = 1;
            val_byte_h = 1;
            break;
         case 4:
            val_int_aH = 1;
            val_byte_h = 1;
            val_byte_i = 2;
            break;
         case 5:
            val_int_aH = 1;
            break;
         case 6:
            val_int_aH = 3;
      }

      val_encodedtextbuffer_d = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[1], null);
      switch (val_int_aE) {
         case 0:
         case 1:
            var3 = 0;

            for (int var8 = 0; var8 < (var0.length - 2) / 2; var8++) {
               if (!val_arr_bool_a[var0[(var8 << 1) + 2 + 1]]) {
                  var3++;
               }
            }

            val_int_aG = var3;
            val_arr_int_r = new int[var3];
            val_arr_encodedtextbuffer_a = new EncodedTextBuffer[val_int_aG];
            val_arr_int_u = new int[val_int_aG];
            boolean isOverMax = (val_int_aG > val_arr_int_O[val_int_aH]);
            val_bool_J = isOverMax;
            if (isOverMax) {
               val_arr_int_t = new int[3];
            } else {
               val_arr_int_t = new int[val_int_aG];
            }

            exec_L_to_void();
            int var17 = 0;

            for (int var9 = 0; var9 < (var0.length - 2) / 2; var9++) {
               if (!val_arr_bool_a[var0[(var9 << 1) + 2 + 1]]) {
                  val_arr_encodedtextbuffer_a[var17] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[(var9 << 1) + 2], null);
                  val_arr_int_r[var17] = var0[(var9 << 1) + 2 + 1];
                  val_arr_int_u[var17] = exec_a_encodedtextbuffer_to_int(val_arr_encodedtextbuffer_a[var17]);
                  var17++;
               }
            }

            exec_e_int_to_void(0);
            return;
         case 2:
         case 3:
            val_arr_encodedtextbuffer_a = new EncodedTextBuffer[val_int_aG = var0.length - 2];
            val_arr_int_u = new int[val_int_aG];
            val_arr_int_r = null;
            boolean var14;
            if (val_int_aG > val_arr_int_O[val_int_aH]) {
               var14 = true;
            } else {
               var14 = false;
            }

            val_bool_J = var14;
            if (var14) {
               val_arr_int_t = new int[3];
            } else {
               val_arr_int_t = new int[val_int_aG];
            }

            exec_L_to_void();

            for (int var15 = 0; var15 < val_int_aG; var15++) {
               val_arr_encodedtextbuffer_a[var15] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[var15 + 2], null);
               val_arr_int_u[var15] = exec_a_encodedtextbuffer_to_int(val_arr_encodedtextbuffer_a[var15]);
            }

            exec_e_int_to_void(0);
            return;
         case 4:
         case 5:
         case 6:
            val_arr_int_r = null;
            exec_b_byte_to_void((byte)4);
            boolean var10;
            boolean var4 = (val_int_aE == 4);
            byte var5 = (byte)(val_int_aE != 4 ? 20 : 17);
            int var1_val = (val_int_aE != 4 ? val_int_bb : val_int_n / 2);
            int var10_val = (val_int_aE != 4 ? val_int_aJ : val_int_aJ + (val_int_aK - val_int_aJ) / 2);

            EncodedTextBuffer var6 = var2;
            if (var2 == null) {
               var6 = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[2], null);
            }

            int var10000 = val_int_n - 2 * val_int_bb;
            val_int_aM = var1_val;
            val_int_aN = var10_val;
            val_int_aO = var10000;
            val_int_aP = val_int_aK - val_int_aJ;
            val_encodedtextbuffer_e = var6;
            exec_b_byte_to_void((byte)4);
            val_int_aQ = val_int_aP / exec_c_to_int();
            val_arr_short_d = exec_a_encodedtextbuffer_int_to_arr_short(val_encodedtextbuffer_e, val_int_aO);
            val_int_aS = 1;
            val_int_aT = Math.max(val_arr_short_d[0] - val_int_aQ + val_int_aS, val_int_aS);
            int var19;
            if (val_int_aQ > val_arr_short_d[0]) {
               var19 = val_arr_short_d[0];
            } else {
               var19 = val_int_aQ;
            }

            val_int_aR = var19;
            val_int_aU = var5;
            if (var4) {
               val_int_aN = val_int_aN - Math.min(val_arr_short_d[0], val_int_aR) * exec_c_to_int() / 2;
            }

            exec_J_to_void();
      }
   }

   public static void exec_A_to_void() {
      if (val_int_dc > val_int_da) {
         val_int_dc = Math.max(val_int_da, val_int_dc - (val_int_e * val_int_dB + 500) / 1000);
      } else if (val_int_dc < val_int_da) {
         val_int_dc = Math.min(val_int_da, val_int_dc + (val_int_e * val_int_dB + 500) / 1000);
      }

      if (val_int_dd > val_int_db) {
         val_int_dd = Math.max(val_int_db, val_int_dd - (val_int_e * val_int_dB + 500) / 1000);
      } else if (val_int_dd < val_int_db) {
         val_int_dd = Math.min(val_int_db, val_int_dd + (val_int_e * val_int_dB + 500) / 1000);
      }

      if (val_int_de > val_int_dp) {
         val_int_de = Math.max(val_int_dp, val_int_de - (val_int_e * val_int_dC + 500) / 1000);
      } else if (val_int_de < val_int_dp) {
         val_int_de = Math.min(val_int_dp, val_int_de + (val_int_e * val_int_dC + 500) / 1000);
      }

      if (val_int_df > val_int_dq) {
         val_int_df = Math.max(val_int_dq, val_int_df - (val_int_e * val_int_dC + 500) / 1000);
      } else if (val_int_df < val_int_dq) {
         val_int_df = Math.min(val_int_dq, val_int_df + (val_int_e * val_int_dC + 500) / 1000);
      }

      val_int_dg = val_int_dc * val_int_cY / 100 >> 8;
      val_int_dh = val_int_dd * val_int_cY / 100 >> 8;
      val_int_dr = val_int_de * val_int_dn / 100 >> 8;
      val_int_ds = val_int_df * val_int_dn / 100 >> 8;

      for (int var0 = 0; var0 < 2; var0++) {
         switch (val_arr_int_aG[var0]) {
            case 0:
            default:
               break;
            case 1:
               int var3 = val_arr_int_aN[var0] + val_int_e;
               val_arr_int_aN[var0] = var3;
               val_arr_int_aJ[var0] = val_arr_int_aH[var0] + (val_arr_int_aI[var0] - val_arr_int_aH[var0]) * val_arr_int_aN[var0] / 600;
               if (val_arr_int_aN[var0] > 600) {
                  val_arr_int_aJ[var0] = val_arr_int_aI[var0];
               }

               val_arr_int_aM[var0] = val_arr_int_aK[var0] + (val_arr_int_aL[var0] - val_arr_int_aK[var0]) * (val_arr_int_aN[var0] - 300) / 600;
               if (val_arr_int_aN[var0] - 300 > 600) {
                  val_arr_int_aM[var0] = val_arr_int_aL[var0];
                  val_arr_int_aG[var0] = 2;
                  val_arr_int_aN[var0] = 0;
               }
               break;
            case 2:
               int var2 = val_arr_int_aN[var0] + val_int_e;
               val_arr_int_aN[var0] = var2;
               if (val_arr_int_aN[var0] > 500) {
                  val_arr_int_aG[var0] = 3;
                  val_arr_int_aN[var0] = 0;
               }
               break;
            case 3:
               int var1 = val_arr_int_aN[var0] + val_int_e;
               val_arr_int_aN[var0] = var1;
               val_arr_int_aJ[var0] = val_arr_int_aI[var0] - (val_arr_int_aI[var0] - val_arr_int_aH[var0]) * val_arr_int_aN[var0] / 600;
               if (val_arr_int_aN[var0] > 600) {
                  val_arr_int_aJ[var0] = val_arr_int_aH[var0];
               }

               if (val_arr_int_aN[var0] > 300) {
                  val_arr_int_aM[var0] = val_arr_int_aL[var0] - (val_arr_int_aL[var0] - val_arr_int_aK[var0]) * (val_arr_int_aN[var0] - 300) / 600;
               }

               if (val_arr_int_aN[var0] - 300 > 600) {
                  val_arr_int_aM[var0] = val_arr_int_aK[var0];
                  val_arr_int_aG[var0] = 0;
               }
         }
      }
   }

   public static int readIntFromBytes(byte[] var0) {
      FontCharmap var1;
      if ((var1 = exec_a_to_fontcharmap()).val_bool_a) {
         return var1.val_byte_e;
      }

      var1.val_byte_a = var0[1];
      var1.val_int_a = (var0[2] & 255) << 16 | (var0[3] & 255) << 8 | var0[4] & 255;
      short var2 = readShortBigEndian(var0, 5);
      var1.val_byte_e = var0[7];
      short var10001 = var0[8];
      short var3 = 10;
      var1.val_byte_c = (byte)(var10001 + 1);
      var1.val_byte_b = (byte)(var0[9] + 1);
      var1.val_arr_byte_a = new byte[var1.val_byte_e];
      var1.val_arr_arr_byte_a = new byte[var1.val_byte_e][];
      var1.val_arr_byte_e = new byte[var1.val_byte_e];
      var1.val_arr_short_a = new short[var1.val_byte_b];
      var1.val_arr_byte_b = new byte[var1.val_byte_b];
      var1.val_arr_byte_c = new byte[var1.val_byte_b];
      var1.val_arr_arr_short_a = new short[var1.val_byte_e][];
      var1.val_arr_short_b = new short[var1.val_byte_b];

      for (int var4 = 0; var4 < var1.val_arr_short_b.length; var4++) {
         var1.val_arr_short_b[var4] = 0;
      }

      var1.val_arr_short_c = new short[var1.val_byte_b];

      for (int var5 = 0; var5 < var1.val_arr_short_c.length; var5++) {
         var1.val_arr_short_c[var5] = 0;
      }

      var1.val_arr_byte_d = new byte[var1.val_byte_b];
      var1.val_arr_arr_byte_b = new byte[var1.val_byte_c][];
      var1.val_arr_arr_short_b = new short[var1.val_byte_c][];

      for (int var13 = 0; var13 < var1.val_byte_c; var13++) {
         var1.val_arr_arr_short_b[var13] = null;
      }

      var1.val_arr_short_a[0] = var2;

      for (int var14 = 0; var14 < var1.val_byte_e; var14++) {
         var1.val_arr_arr_short_a[var14] = new short[var1.val_byte_b];
      }

      for (int var15 = 0; var15 < var1.val_byte_c; var15++) {
         var1.val_arr_arr_byte_b[var15] = null;
      }

      short var10 = (short)(var2 + 1);

      for (int var16 = 0; var16 < var1.val_byte_e; var16++) {
         var1.val_arr_arr_byte_a[var16] = new byte[5];

         for (int var6 = 0; var6 < 5; var6++) {
            var1.val_arr_arr_byte_a[var16][var6] = var0[var3 + var6];
         }

         short var20 = (short)((short)(var3 + 5) + 1);
         var1.val_arr_byte_a[var16] = var0[(short)(var3 + 5)];
         var3 = (short)(var20 + 1);
         var1.val_arr_byte_e[var16] = var0[var20];
         if (var2 > 0) {
            if (var1.val_arr_arr_short_b[0] == null) {
               var1.val_arr_arr_short_b[0] = new short[var1.val_byte_e * var10];
            }

            for (int var21 = 0; var21 < var10; var21++) {
               var1.val_arr_arr_short_b[0][var16 * var10 + var21] = readShortBigEndian(var0, var3);
               var3 = (short)(var3 + 2);
            }
         }
      }

      if (var2 > 0) {
         short var22 = var1.val_arr_arr_short_b[0][var1.val_byte_e * var10 - 1];
         var1.val_arr_arr_byte_b[0] = new byte[var22];
         byte[] var10000 = var1.val_arr_arr_byte_b[0];
         short var7 = var22;
         short var17 = var3;
         byte[] var11 = var0;
         byte[] var8 = var10000;
         System.arraycopy(var11, var17, var8, 0, var7);
         var3 += var22;
      }

      for (int var23 = 1; var23 < var1.val_byte_b; var23++) {
         var1.val_arr_byte_b[var23] = (byte)(var0[var3] & 192);
         var1.val_arr_byte_c[var23] = (byte)(var0[var3] & 63);
         short var18;
         var10001 = var18 = (short)(var3 + 1);
         short[] var12 = var1.val_arr_short_a;
         var3 = readShortBigEndian(var0, var10001);
         var12[var23] = var3;
         var3 = (short)(var18 + 2);
         if (var1.val_arr_short_a[var23] + 1 > var1.val_arr_short_c[var1.val_arr_byte_c[var23]]) {
            var1.val_arr_short_c[var1.val_arr_byte_c[var23]] = (short)(var1.val_arr_short_a[var23] + 1);
         }

         for (int var19 = 0; var19 < var1.val_byte_e; var19++) {
            var1.val_arr_arr_short_a[var19][var23] = readShortBigEndian(var0, var3);
            if ((var1.val_arr_arr_short_a[var19][var23] & '\uffff') > (var1.val_arr_short_b[var1.val_arr_byte_c[var23]] & '\uffff')) {
               var1.val_arr_short_b[var1.val_arr_byte_c[var23]] = var1.val_arr_arr_short_a[var19][var23];
            }

            var3 = (short)(var3 + 2);
         }
      }

      if (var1.val_arr_byte_a[var1.val_byte_d] > 1) {
         var1.setFontStyle(var1.val_arr_byte_a[var1.val_byte_d]);
      }

      var1.val_bool_a = true;
      return var1.val_byte_e;
   }

   public static void initGameState() {
      if (val_arr_spritepartsequence_c != null) {
         for (int var0 = 0; var0 < val_arr_int_T.length; var0++) {
            val_arr_int_ab[var0] = val_arr_spritepartsequence_c[var0].getPartYOffset(val_arr_int_ab[var0], val_int_e);
         }
      }

      if (val_arr_spritepartsequence_d != null) {
         for (int var1 = 0; var1 < val_arr_int_U.length; var1++) {
            val_arr_int_ae[var1] = val_arr_spritepartsequence_d[var1].getPartYOffset(val_arr_int_ae[var1], val_int_e);
         }
      }

      if (val_bool_at || val_bool_av) {
         switch (val_int_aC) {
            case 8:
               SceneBase var3 = val_globalcontext_a.currentScene;
               if (!val_globalcontext_a.currentScene.isTransitioning) {
                  var3.isTransitioning = true;
               }

               exec_b_gamemidletloop_to_void(val_gamemidletloop_a);
               return;
            case 9:
               exec_N_to_void();
               exec_d_bool_to_void(false);
               val_long_g = 0L;
               val_bool_U = false;
               exec_I_to_void();
               exec_w_to_bool();
               return;
            case 10:
               exec_h_int_to_void(val_int_aD);
               exec_w_to_bool();
               return;
            case 11:
               exec_h_int_to_void(val_int_aD);
               exec_I_to_void();
               setGameState(5);
               return;
            case 12:
               System.out.println("s_currentSelectedItem 1");
               exec_I_int_to_void(val_int_aD);
               if (val_int_aD == 2) {
                  exec_a_byte_bool_to_void((byte)38, false);
               } else if (val_int_aD == 0) {
                  exec_b_byte_bool_to_void((byte)5, false);
               }

               exec_w_to_bool();
               return;
            case 13:
               if (val_int_aD != val_int_bv) {
                  exec_I_int_to_void(val_int_aD);
                  exec_I_to_void();
               }

               if (val_int_aD == 2) {
                  exec_a_byte_bool_to_void((byte)38, false);
               } else if (val_int_aD - 1 == 0) {
                  exec_b_byte_bool_to_void((byte)13, false);
               }

               if (val_bool_b) {
                  setGameState(6);
                  return;
               }

               val_int_bu = 1;
               if (val_bool_V) {
                  setGameState(7);
                  return;
               }

               setGameState(9);
               return;
            case 14:
            case 28:
               val_int_bu = val_int_aD;
               if (val_int_aD == 0) {
                  exec_M_int_to_void(100);
               }

               exec_w_to_bool();
               return;
            case 15:
               System.out.println("5");
               if (val_int_aD != val_int_bu) {
                  val_int_bu = val_int_aD;
                  exec_I_to_void();
               }

               if (val_int_aD == 0) {
                  exec_M_int_to_void(100);
               }

               if (val_bool_V) {
                  setGameState(7);
               } else {
                  setGameState(9);
               }
               break;
            case 16:
               val_int_bx = val_int_aD;
               exec_w_to_bool();
               return;
            case 17:
               System.out.println("6");
               if (val_int_aD != val_int_bx) {
                  val_int_bx = val_int_aD;
                  exec_I_to_void();
               }

               setGameState(8);
               break;
            case 18:
               val_int_bw = val_int_aD;
               exec_w_to_bool();
               return;
            case 19:
               val_int_bw = val_int_aD;
               val_bool_V = false;
               exec_I_to_void();
               setGameState(9);
               break;
            case 20:
            case 22:
            case 23:
            case 24:
            case 26:
            default:
               if (val_int_aE == 0) {
                  exec_a_byte_bool_to_void((byte)38, false);
                  exec_L_int_to_void(val_int_aC);
                  exec_c_int_to_void(val_arr_int_r[val_int_aD]);
                  return;
               }

               if (val_int_aE == 1) {
                  exec_L_int_to_void(val_int_aC);
                  exec_c_int_to_void(val_arr_int_r[val_int_aD]);
               }
               break;
            case 21:
               setGameState(11);
               return;
            case 25:
               exec_I_to_void();
               val_bool_ah = false;
               exec_Z_to_void();
               exec_af_to_void();
               setGameState(9);
               break;
            case 27:
               exec_I_int_to_void(val_int_aD);
               if (val_int_aD == 2) {
                  exec_a_byte_bool_to_void((byte)38, false);
               } else if (val_int_aD - 1 == 0) {
                  exec_b_byte_bool_to_void((byte)13, false);
               }

               exec_w_to_bool();
         }
      }

      if (val_bool_au) {
         switch (val_int_aC) {
            case 1:
               exec_I_to_void();
               exec_w_to_bool();
            case 7:
               break;
            case 21:
               exec_d_bool_to_void(false);
               val_long_g = 0L;
               exec_I_to_void();
               setGameState(11);
               break;
            default:
               if (exec_w_to_bool()) {
                  return;
               }
         }
      }

      switch (val_int_aE) {
         case 0:
         case 3:
            if (val_bool_ao) {
               exec_e_int_to_void(val_int_aD + 1);
               if (val_bool_I) {
                  exec_a_byte_bool_to_void((byte)37, false);
               }
            }

            if (val_bool_an) {
               exec_e_int_to_void(val_int_aD - 1);
               if (val_bool_I) {
                  exec_a_byte_bool_to_void((byte)37, false);
               }
            }

            exec_O_to_void();
            break;
         case 1:
         case 2:
            if (val_bool_ao) {
               exec_e_int_to_void(val_int_aD + 1);
            }

            if (val_bool_an) {
               exec_e_int_to_void(val_int_aD - 1);
            }

            exec_O_to_void();
            break;
         case 4:
         case 5:
         case 6:
            exec_J_to_void();
            break;
         case 7:
            if (val_int_bs != -1) {
               boolean var2;
               if (!val_bool_T) {
                  var2 = true;
               } else {
                  var2 = false;
               }

               val_bool_T = var2;
               if (val_bool_at || val_bool_av) {
                  exec_c_int_to_void(0);
               }
            }
      }

      exec_a_byte_byte_to_void(val_byte_h, val_byte_i);
   }

   public static void exec_u_int_to_void(int var0) {
      exec_H_int_to_void(val_int_cw);
      exec_a_byte_byte_to_void((byte)0, (byte)0);
      switch (var0) {
         case 0:
            val_int_cz = -1;
            val_int_cA = 0;
            val_arr_arr_int_d = null;
            val_bool_ag = false;
            val_long_c = 0L;
            break;
         case 1:
            val_int_bS = 8;
            val_encodedtextbuffer_j = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(26, null);

            try {
               val_arr_animationset_c = new AnimationSet[val_arr_int_an.length];

               for (int var15 = 0; var15 < val_arr_int_an.length; var15++) {
                  if (var15 == 2) {
                     val_arr_animationset_c[var15] = exec_a_int_int_byte_bool_to_animationset(val_arr_int_an[var15], 167772231, (byte)0, false);
                  } else {
                     val_arr_animationset_c[var15] = exec_a_int_int_byte_bool_to_animationset(val_arr_int_an[var15], -1, (byte)0, false);
                  }
               }

               val_arr_spritepartsequence_f = new SpritePartSequence[val_arr_int_ao.length];
               val_arr_int_at = new int[val_arr_int_ao.length];
               val_arr_int_ar = new int[val_arr_int_ao.length];
               val_arr_int_as = new int[val_arr_int_ao.length];

               for (int var19 = 0; var19 < val_arr_int_ao.length; var19++) {
                  val_arr_spritepartsequence_f[var19] = exec_a_int_int_to_spritepartsequence(val_arr_int_ao[var19], 1);
                  val_arr_int_at[var19] = 1;
                  val_arr_int_ar[var19] = val_arr_spritepartsequence_f[var19].getSequenceWidth(val_arr_animationset_c[val_arr_int_ap[var19]]);
                  val_arr_int_as[var19] = val_arr_spritepartsequence_f[var19].getSequenceHeight(val_arr_animationset_c[val_arr_int_ap[var19]]);
               }

               val_arr_spritepartsequence_g = new SpritePartSequence[val_arr_int_aR.length];
               val_arr_int_aq = new int[val_arr_int_aR.length];
               val_int_bQ = val_arr_int_ar[1];
               val_int_bR = 5;

               for (int var20 = 0; var20 < val_arr_int_aR.length; var20++) {
                  val_arr_spritepartsequence_g[var20] = exec_a_int_int_to_spritepartsequence(val_arr_int_aR[var20], 1);
                  val_arr_int_aq[var20] = 1;
               }
            } catch (Exception var10) {
            }

            val_bool_W = false;
            val_bool_X = false;
            val_bool_Y = false;
            val_int_bP = 0;
            exec_A_int_to_void(0);
            exec_e_byte_to_void((byte)0);
            int var22 = 0;
            int var16 = 0;

            for (int var21 = 0; var21 < PatternTable.val_arr_arr_byte_a.length; var21++) {
               var22 = Math.max(var22, exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var21][2]));
               var16 = Math.max(var16, exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var21][3]));
            }

            val_int_bJ = var22 + val_int_bQ;
            val_int_bK = var16 + val_int_bQ;
            val_int_bT = val_int_n - val_int_bJ - 16;
            val_int_bU = val_int_bS + (val_int_o - val_int_ai - val_int_bS - val_int_bK) / 2;
            exec_b_byte_to_void((byte)4);
            val_int_bL = val_int_o - val_int_ai - exec_c_to_int();
            val_int_bM = val_int_bT / 2;
            val_int_bN = val_int_bU + val_int_bK;
            exec_U_to_void();
            break;
         case 2:
            int[][] var14 = new int[3][0];
            byte var18 = 9;

            for (int var3 = 2; var3 >= 0; var3--) {
               var14[var3] = new int[var18 + 1];
               var14[var3][0] = val_arr_int_aE[var3];

               for (int var4 = var18; var4 > 0; var4--) {
                  if (var4 == var18) {
                     var14[var3][var4] = 6;
                  } else if (var4 == var18 - 1 && var3 > 0) {
                     if (var3 == 2) {
                        var14[var3][var4] = -2;
                     } else if (var3 == 1) {
                        var14[var3][var4] = -1;
                     }
                  } else if (var4 == var18 - 2 && var3 == 2) {
                     var14[var3][var4] = -1;
                  } else {
                     boolean var23 = false;

                     while (!var23) {
                        var14[var3][var4] = exec_a_int_int_to_int(0, 6);
                        var23 = true;

                        for (int var24 = var18; var24 > var4; var24--) {
                           if (var14[var3][var24] == var14[var3][var4]) {
                              var23 = false;
                           }
                        }
                     }
                  }
               }

               var18 -= 2;
               if (var18 < 3) {
                  var18 = 3;
               }
            }

            val_arr_arr_int_d = var14;
            exec_H_to_void();
            exec_a_arr_arr_int_to_void(val_arr_arr_int_d);
            val_int_cu = val_int_cy;
            exec_v_int_to_void(0);
            break;
         case 3:
            if (val_long_c > val_long_g && !val_bool_am) {
               val_long_g = val_long_c;
            }

            int var6 = val_int_cy;
            int var5;
            if (val_bool_am) {
               var5 = val_int_cy;
            } else {
               var5 = val_int_cG;
            }

            exec_a_int_int_byte_to_void(var6, var5, exec_b_to_byte());
            if (!val_bool_am) {
               val_long_d = val_long_g;
               val_long_e = val_long_g;
            }
            break;
         case 4:
            exec_H_to_void();
            exec_a_arr_arr_int_to_void(val_arr_arr_int_d);
            val_int_bZ = val_int_cz;
            exec_y_int_to_void(val_int_cA);
            val_int_cu = val_int_cy;
            exec_v_int_to_void(4);
            break;
         case 5:
            exec_b_byte_to_void((byte)4);

            try {
               val_animationset_m = exec_a_int_int_byte_bool_to_animationset(val_arr_int_aS[val_int_cy], -1, (byte)0, false);
               val_spritepartsequence_m = exec_a_int_int_to_spritepartsequence(val_arr_arr_int_h[val_int_cy][66], 0);
               val_int_cI = 1;
               val_int_cK = val_spritepartsequence_m.getSequenceHeight(val_animationset_m);
               AnimationSet var2 = val_animationset_m;
               SpritePartSequence var12 = val_spritepartsequence_m;
               val_spritepartsequence_m.renderPart(val_spritepartsequence_m.partOffsets.length - 1, var2, val_arr_int_d, 0);
               val_int_cJ = val_arr_int_d[2] - val_arr_int_d[0];
               var2 = val_animationset_m;
               var12 = val_spritepartsequence_m;
               val_spritepartsequence_m.renderPart(val_spritepartsequence_m.partOffsets.length - 1, var2, val_arr_int_d, 0);
               val_int_cL = -val_arr_int_d[0];
               val_int_cM = val_int_o - val_int_ai - (val_int_o - val_int_ai - 8 - exec_c_to_int() - val_int_cK) / 2;
            } catch (Exception var8) {
            }

            val_encodedtextbuffer_n = val_encodedtextbuffer_B.prepend(new EncodedTextBuffer(""));
            exec_B_int_to_void(val_arr_int_be[val_int_cy]);
            exec_U_to_void();
            break;
         case 6:
            val_encodedtextbuffer_n = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(128, null);
            exec_F_int_to_void(111);
            break;
         case 7:
            exec_F_int_to_void(134);
            break;
         case 8:
            exec_b_byte_to_void((byte)4);

            try {
               val_animationset_k = exec_a_int_int_byte_bool_to_animationset(val_int_bt, -1, (byte)0, false);
               val_arr_spritepartsequence_e = new SpritePartSequence[4];
               val_arr_int_ai = new int[4];
               val_arr_int_al = new int[4];
               val_arr_int_am = new int[4];
               val_arr_int_aj = new int[4];
               val_arr_int_ak = new int[4];

               for (int var1 = 0; var1 < 4; var1++) {
                  val_arr_spritepartsequence_e[var1] = exec_a_int_int_to_spritepartsequence(val_arr_int_ah[var1], 0);
                  val_arr_int_ai[var1] = 1;
                  val_arr_int_al[var1] = val_arr_spritepartsequence_e[var1].getSequenceWidth(val_animationset_k);
                  val_arr_int_am[var1] = val_arr_spritepartsequence_e[var1].getSequenceHeight(val_animationset_k);
               }
            } catch (Exception var9) {
            }

            val_int_bp = 0;
            val_encodedtextbuffer_f = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(113, null);
            val_encodedtextbuffer_g = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(114, null);
            val_encodedtextbuffer_h = new EncodedTextBuffer("_");
            val_arr_short_e = exec_a_encodedtextbuffer_int_to_arr_short(val_encodedtextbuffer_g, val_int_n - 32);
            if ((val_int_bj = (val_int_bk = (val_int_o - val_int_ai) / 2 - val_arr_short_e[0] * exec_c_to_int()) / 2) > val_int_bk - exec_c_to_int()) {
               val_int_bj = val_int_bk - exec_c_to_int();
            }

            val_int_bl = (val_int_bl = (val_int_o - val_int_ai - (val_int_bk + val_arr_short_e[0] * exec_c_to_int())) / 2)
               + val_int_bk
               + val_arr_short_e[0] * exec_c_to_int();
            val_int_bo = 16;
            val_int_bn = exec_a_encodedtextbuffer_to_int(val_encodedtextbuffer_h);
            val_int_bm = 3 * (val_int_bn + val_int_bo);
            val_int_bm = (val_int_n - val_int_bm) / 2 + val_int_bo / 2;
            val_arr_int_aj[2] = val_int_bm - 3 * val_arr_int_al[2];
            val_arr_int_aj[3] = val_int_bm + 3 * (val_int_bn + val_int_bo) - val_int_bo + 2 * val_arr_int_al[3];
            val_arr_int_aj[0] = val_int_bm + val_int_bn / 2 - val_arr_int_al[0] / 2;
            val_arr_int_aj[1] = val_int_bm + val_int_bn / 2 - val_arr_int_al[1] / 2;
            val_arr_int_ak[0] = val_int_bl - 2 * val_arr_int_am[0];
            val_arr_int_ak[1] = val_int_bl + exec_c_to_int() + val_arr_int_am[1];
            val_arr_int_ak[2] = val_int_bl + exec_c_to_int() / 2 - val_arr_int_am[2] / 2;
            val_arr_int_ak[3] = val_int_bl + exec_c_to_int() / 2 - val_arr_int_am[3] / 2;
            val_arr_byte_j = new byte[3];
            val_arr_encodedtextbuffer_e = new EncodedTextBuffer[3];

            for (int var11 = 0; var11 < 3; var11++) {
               val_arr_byte_j[var11] = val_arr_byte_h[var11];
               val_arr_encodedtextbuffer_e[var11] = new EncodedTextBuffer(1);
               val_arr_encodedtextbuffer_e[var11].appendInt(0);
               val_arr_encodedtextbuffer_e[var11].setCharAt(0, (char)val_arr_short_a[val_arr_byte_j[var11]]);
            }

            val_bool_Q = true;
            val_byte_h = 1;
            val_byte_i = 0;
            val_encodedtextbuffer_d = new EncodedTextBuffer("");
            val_bool_L = false;
            val_bool_K = false;
            val_bool_R = false;
            val_int_bq = 20;
            val_int_br = 20;
            break;
         case 9:
            exec_F_int_to_void(68);
            break;
         case 10:
            exec_b_byte_to_void((byte)4);

            try {
               val_animationset_m = exec_a_int_int_byte_bool_to_animationset(val_arr_int_aS[val_int_cy], -1, (byte)0, false);
               val_spritepartsequence_m = exec_a_int_int_to_spritepartsequence(val_arr_arr_int_h[val_int_cy][0], 1);
               val_int_cI = 1;
               val_int_cK = val_spritepartsequence_m.getSequenceHeight(val_animationset_m);
               val_int_cJ = val_spritepartsequence_m.getSequenceWidth(val_animationset_m);
               val_int_cL = -val_spritepartsequence_m.getFrameDelay(val_animationset_m);
               val_int_cM = val_int_o - val_int_ai - (val_int_o - val_int_ai - 8 - exec_c_to_int() - val_int_cK) / 2;
            } catch (Exception var7) {
            }

            val_encodedtextbuffer_n = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(val_arr_int_bd[val_int_cy], null);
            exec_B_int_to_void(val_arr_int_bf[val_int_cy]);
            exec_U_to_void();
            break;
         case 11:
            if (val_bool_aj) {
               setGameState(9);
               exec_c_int_to_void(7);
               val_bool_aj = false;
            } else {
               setGameState(9);
            }
      }

      val_int_cx = 0;
      val_int_cw = var0;
   }

   public static void exec_a_encodedtextbuffer_int_int_int_int_int_to_void(EncodedTextBuffer var0, int var1, int var2, int var3, int var4, int var5) {
      FontCharmap var6;
      int var7 = (var6 = exec_a_to_fontcharmap()).val_contextservicenode_a.val_arr_byte_a[3] & 255;
      int var8 = exec_c_to_int();
      int var9 = var6.val_contextservicenode_a.val_arr_byte_a[8];
      byte var10 = var6.val_contextservicenode_a.val_arr_byte_a[9];
      boolean var11;
      if ((var6.val_contextservicenode_a.val_arr_byte_a[10] & 2) != 0) {
         var11 = true;
      } else {
         var11 = false;
      }

      int var12 = 0;
      int var14 = 0;
      if ((var5 & 8) != 0) {
         var12 = 0 - exec_a_encodedtextbuffer_int_int_to_int(var0, var1, var2);
      } else if ((var5 & 1) != 0) {
         var12 = 0 - (exec_a_encodedtextbuffer_int_int_to_int(var0, var1, var2) >> 1);
      }

      if ((var5 & 64) != 0) {
         var14 = 0 - var7;
      } else if ((var5 & 32) != 0) {
         var14 = 0 - var8;
      }

      if (var9 == 1) {
         var3 += var12;
         var4 += var14;
      } else if (var9 == 4) {
         var3 -= var12;
         var4 -= var14;
      } else if (var9 == 2) {
         var3 -= var14;
         var4 += var12;
      } else if (var9 == 8) {
         var3 -= var14;
         var4 -= var12;
      }

      var6.val_arr_int_a[0] = var3;
      var6.val_arr_int_a[1] = var4;
      var12 = var0.flagsByte & 63;
      if ((var9 & 5) != 0) {
         var14 = (var9 & 4) >> 1;
      } else {
         var14 = ((var10 & 1) << 1) + ((~var10 & 2) >> 1);
      }

      byte var24 = (byte)var14;
      if ((var9 & 10) != 0) {
         var14 = (var9 & 8) >> 2;
      } else {
         var14 = (var10 & 2) + (~var10 & 1);
      }

      var10 = (byte)var14;
      var9 = var6.val_graphicsadapter_a.renderContext.targetGraphics.getColor();

      for (int var23 = var1; var23 < var1 + var2; var23++) {
         short var31;
         if ((var31 = var0.getCharAt(var23)) != 173 || var23 == var1 + var2 - 1) {
            int var13 = var6.getKerning((short)var31, var12);
            int var15 = var6.getCharWidth((short)var13);
            if (var13 == -1) {
               if (var31 != 32) {
                  var6.val_graphicsadapter_a.setColor(65280);
                  var6.val_graphicsadapter_a.fillRect(var6.val_arr_int_a[0], var6.val_arr_int_a[1], var15, var8);
                  var6.val_graphicsadapter_a.setColor(16711680);
                  var6.val_graphicsadapter_a
                     .drawLine(var6.val_arr_int_a[0], var6.val_arr_int_a[1], var6.val_arr_int_a[0] + var15, var6.val_arr_int_a[1] + var8);
                  var6.val_graphicsadapter_a
                     .drawLine(var6.val_arr_int_a[0], var6.val_arr_int_a[1] + var8, var6.val_arr_int_a[0] + var15, var6.val_arr_int_a[1]);
               }

               var6.setFontPalette(var6.val_arr_int_a, var15);
            } else {
               short var22 = (short)((var31 = (short)(var13 + 1)) + 1);
               var13 = var6.val_contextservicenode_a.val_arr_byte_b[var31] & 255;

               for (int var16 = 0; var16 < var13; var16++) {
                  if (!var11) {
                     int var17 = var6.val_contextservicenode_a.val_arr_byte_b[var22] & 255;
                     int var18 = var6.val_contextservicenode_a.val_arr_byte_b[var31 = (short)(var22 + 1)] & 255;
                     byte var19 = var6.val_contextservicenode_a.val_arr_byte_b[++var31];
                     short var10004 = ++var31;
                     byte var10003 = var6.val_contextservicenode_a.val_arr_byte_b[var10004];
                     byte var38 = var6.val_contextservicenode_a.val_arr_byte_b[var10004];
                     int var20 = var6.val_contextservicenode_a.val_arr_byte_b[++var31] & 255;
                     var22 = (short)((short)(var31 + 1) + 1);
                     int var21 = var6.val_contextservicenode_a.val_arr_byte_b[(short)(var31 + 1)] & 255;
                     var6.val_arr_int_b[0] = var19;
                     var31 = (short)(var38 - var7);
                     var6.val_arr_int_b[1] = var31;
                     var6.val_arr_int_b[2] = -var19 - var20;
                     var6.val_arr_int_b[3] = var7 - var10003 - var21;
                     var6.val_graphicsadapter_a
                        .drawRegion(
                           (SpriteImage)var6.val_contextservicenode_a.val_object_a,
                           var17,
                           var18,
                           var20,
                           var21,
                           var6.val_contextservicenode_a.val_arr_byte_a[7],
                           var6.val_arr_int_a[0] + var6.val_arr_int_b[var24],
                           var6.val_arr_int_a[1] + var6.val_arr_int_b[var10],
                           0
                        );
                  }
               }

               var6.setFontPalette(var6.val_arr_int_a, var15);
            }
         }
      }

      var6.val_graphicsadapter_a.setColor(var9);
   }

   public static void exec_a_byte_int_to_void(byte var0, int var1) {
      val_byte_e = var0;
      val_animationset_i = null;

      try {
         if ((val_int_az = val_int_ay = Math.max(val_int_ay = (val_int_bE - (CharacterPresetTable.val_arr_arr_int_a[var0][11] << 5)) / 2, 0)) != 0) {
            exec_b_int_int_to_void(Math.max(0, val_int_ay), Math.max(0, val_int_ay));
            val_int_az = val_int_az + (CharacterPresetTable.val_arr_arr_int_a[var0][11] - 10 << 5);
         }

         if (val_int_az == 0 && val_int_bE < 320) {
            val_int_az = val_int_bE - 320;
         }

         val_int_ao = (-CharacterPresetTable.val_arr_arr_int_a[var0][10] << 5) / 2;
         val_int_ap = (CharacterPresetTable.val_arr_arr_int_a[var0][10] << 5) / 2;
         val_int_aq = (val_int_ar = CharacterPresetTable.val_arr_arr_int_a[var0][9] + (val_int_bE - 320) - val_int_az)
            - (CharacterPresetTable.val_arr_arr_int_a[var0][11] << 5);
         val_int_as = val_int_ao + CharacterPresetTable.val_arr_arr_int_a[var0][12];
         val_int_at = val_int_ap - CharacterPresetTable.val_arr_arr_int_a[var0][12];

         for (byte var2 = 0; var2 < 3; var2++) {
            DataInputStream var4 = openResourceStream(CharacterPresetTable.val_arr_arr_int_a[var0][var2]);
            val_arr_byte_e[var2] = (byte)var4.readUnsignedByte();
            val_arr_byte_f[var2] = (byte)var4.readUnsignedByte();
            val_arr_int_k[var2] = val_arr_byte_e[var2] << 5;
            val_arr_int_l[var2] = val_arr_byte_f[var2] << 5;
            var4.readUnsignedByte();
            int var3 = exec_a_datainputstream_to_int(var4);
            val_arr_arr_byte_b[var2] = new byte[val_arr_byte_e[var2] * val_arr_byte_f[var2]];
            var4.readFully(val_arr_arr_byte_b[var2]);
            var4.close();
            if (val_animationset_i == null) {
               switch (var1) {
                  case -1:
                     val_animationset_i = exec_a_int_arr_int_arr_byte_bool_to_animationset(var3, val_arr_int_q, val_arr_byte_g, true);
                     val_int_ax = 0;
                     break;
                  case 0:
                     val_animationset_i = exec_a_int_int_byte_bool_to_animationset(var3, -1, (byte)0, true);
                     val_int_ax = 0;
                     break;
                  case 1:
                     val_animationset_i = exec_a_int_int_byte_bool_to_animationset(var3, -1, (byte)1, true);
                     val_int_ax = 1;
               }
            }

            val_arr_int_m[var2] = (CharacterPresetTable.val_arr_arr_int_a[var0][var2 + 3] << 5) + val_arr_int_k[var2] / 2 - val_int_bC;
            val_arr_int_n[var2] = (-CharacterPresetTable.val_arr_arr_int_a[var0][var2 + 6] << 5) - val_int_az;
            val_arr_int_o[var2] = val_arr_int_m[var2];
            val_arr_int_p[var2] = val_arr_int_n[var2];
         }
      } catch (Exception var6) {
      }

      try {
         int var7 = -1;
         switch (val_byte_e) {
            case 0:
               var7 = 117440552;
               val_spritepartsequence_i = exec_a_int_int_to_spritepartsequence(117440515, 1);
               val_int_au = 1;
               break;
            case 1:
               var7 = 117440551;
               val_spritepartsequence_i = exec_a_int_int_to_spritepartsequence(117440514, 1);
               val_int_au = 1;
               break;
            case 2:
               var7 = 117440550;
               val_int_au = 1;
               val_spritepartsequence_i = exec_a_int_int_to_spritepartsequence(117440513, 1);
               val_int_av = 64;
               break;
            case 3:
               var7 = 117440550;
               val_spritepartsequence_i = exec_a_int_int_to_spritepartsequence(117440513, 1);
               val_int_au = 1;
               val_int_av = 96;
               val_int_aw = 96 + val_int_az + val_int_bz;
               break;
            case 4:
               var7 = 117440549;
               val_spritepartsequence_i = exec_a_int_int_to_spritepartsequence(117440512, 1);
               val_int_au = 1;
         }

         if (var7 != -1) {
            switch (var1) {
               case -1:
                  val_animationset_j = exec_a_int_arr_int_arr_byte_bool_to_animationset(var7, val_arr_int_q, val_arr_byte_g, true);
                  return;
               case 0:
                  val_animationset_j = exec_a_int_int_byte_bool_to_animationset(var7, -1, (byte)0, false);
               default:
                  return;
               case 1:
                  val_animationset_j = exec_a_int_int_byte_bool_to_animationset(var7, -1, (byte)1, false);
                  return;
            }
         }
      } catch (Exception var5) {
      }
   }

   public static void updateSplashState() {
      for (int var0 = 0; var0 < val_arr_int_ay.length; var0++) {
         val_arr_int_aD[var0] = val_arr_spritepartsequence_h[var0].getPartYOffset(val_arr_int_aD[var0], val_int_e);
      }

      exec_a_int_int_bool_to_void(0, 0, true);
      updateBattleState();
      switch (val_int_bV) {
         case 0:
            if (val_bool_ap) {
               if (--val_int_bZ < 0) {
                  val_int_bZ = val_arr_arr_int_c.length - 1;
               }

               exec_ad_to_void();
               exec_a_byte_bool_to_void((byte)37, false);
            }

            if (val_bool_aq) {
               if (++val_int_bZ >= val_arr_arr_int_c.length) {
                  val_int_bZ = 0;
               }

               exec_ad_to_void();
               exec_a_byte_bool_to_void((byte)37, false);
            }

            if (val_bool_av || val_bool_at) {
               exec_a_byte_bool_to_void((byte)38, false);
               exec_v_int_to_void(1);
            }

            if (val_bool_au) {
               exec_u_int_to_void(1);
            }
            break;
         case 1:
            if (++val_int_cr >= val_arr_arr_bool_b[val_int_bZ].length) {
               val_int_cr = val_arr_arr_bool_b[val_int_bZ].length - 1;
               if (++val_int_cs > val_arr_arr_bool_b[val_int_bZ].length) {
                  val_arr_arr_bool_b[val_int_bZ] = new boolean[val_arr_arr_int_c[val_int_bZ].length - 1 + 1];
                  exec_v_int_to_void(2);
                  return;
               }
            }

            for (int var1 = 0; var1 < val_arr_arr_bool_b[val_int_bZ].length; var1++) {
               if (var1 >= val_int_cs && var1 <= val_int_cr) {
                  val_arr_arr_bool_b[val_int_bZ][var1] = true;
               } else {
                  val_arr_arr_bool_b[val_int_bZ][var1] = false;
               }
            }

            if (val_bool_at || val_bool_av) {
               exec_am_to_void();
            }
            break;
         case 2:
            if ((val_int_co = val_int_co + val_int_e) <= 1000) {
               val_int_cq = 0 + val_int_co * val_int_cn / 1000;
            } else if (val_int_co >= 1500) {
               exec_v_int_to_void(3);
            }

            if (val_bool_at || val_bool_av) {
               exec_am_to_void();
            }

            return;
         case 3:
            if ((val_int_cp = val_int_cp + val_int_e) > 2000) {
               exec_v_int_to_void(5);
            } else {
               val_int_cb = 0 + val_int_cp * val_int_cc / 2000;
            }

            if (val_bool_at || val_bool_av) {
               exec_am_to_void();
            }
            break;
         case 4:
            if ((val_int_cm = val_int_cm + val_int_e) >= 1000) {
               val_int_cd = 0;
               if (val_int_cm >= 2000) {
                  exec_am_to_void();
               }
            } else {
               val_int_cd = val_int_cl + val_int_cm * (0 - val_int_cl) / 1000;
            }

            if (val_bool_at || val_bool_av) {
               exec_am_to_void();
            }
            break;
         case 5:
            if ((val_int_cj = val_int_cj + val_int_e) > 500) {
               val_int_ci = val_int_ci + val_int_e;
               val_int_cd = val_int_cf + val_int_ci * (val_int_cg - val_int_cf) / val_int_ch;
               if (val_int_ci >= val_int_ch) {
                  val_int_cd = val_int_cg;
                  if ((val_int_ck = val_int_ck + val_int_e) > 1000) {
                     exec_am_to_void();
                  }
               }
            }

            if (val_bool_at || val_bool_av) {
               exec_am_to_void();
            }
      }

      exec_a_byte_byte_to_void(val_byte_o, val_byte_p);
   }

   public static void updateSelectScreenState() {
      if (!val_bool_O) {
         try {
            val_arr_animationset_a = new AnimationSet[val_arr_int_R.length];

            for (int var0 = 0; var0 < val_arr_int_R.length; var0++) {
               val_arr_animationset_a[var0] = exec_a_int_int_byte_bool_to_animationset(val_arr_int_R[var0], -1, (byte)0, false);
            }

            val_arr_spritepartsequence_c = new SpritePartSequence[val_arr_int_T.length];
            val_arr_int_ab = new int[val_arr_int_T.length];
            val_arr_int_X = new int[val_arr_int_T.length];
            val_arr_int_Y = new int[val_arr_int_T.length];
            val_arr_int_Z = new int[val_arr_int_T.length];
            val_arr_int_aa = new int[val_arr_int_T.length];

            for (int var3 = 0; var3 < val_arr_int_T.length; var3++) {
               val_arr_spritepartsequence_c[var3] = exec_a_int_int_to_spritepartsequence(val_arr_int_T[var3], 1);
               val_arr_int_ab[var3] = 1;
               val_arr_int_X[var3] = val_arr_spritepartsequence_c[var3].getSequenceWidth(val_arr_animationset_a[val_arr_int_V[var3]]);
               val_arr_int_Y[var3] = val_arr_spritepartsequence_c[var3].getSequenceHeight(val_arr_animationset_a[val_arr_int_V[var3]]);
               val_arr_int_Z[var3] = val_arr_spritepartsequence_c[var3].getFrameDelay(val_arr_animationset_a[val_arr_int_V[var3]]);
               int[] var10000 = val_arr_int_aa;
               AnimationSet var1;
               val_arr_spritepartsequence_c[var3].calculateBounds(var1 = val_arr_animationset_a[val_arr_int_V[var3]], val_arr_int_d);
               var10000[var3] = val_arr_int_d[1];
            }

            val_int_bb = 10;
            val_arr_int_af = new int[(val_int_ba = val_int_n - 2 * val_int_bb) + 1];

            for (int var4 = 0; var4 < val_int_ba + 1; var4++) {
               if (var4 % 2 == 0) {
                  val_arr_int_af[var4] = 0;
               } else {
                  val_arr_int_af[var4] = -12304077;
               }
            }

            val_bool_O = true;
         } catch (Exception var2) {
            var2.printStackTrace();
         }

         exec_a_byte_to_void((byte)4);
         exec_a_byte_to_void((byte)5);
         exec_a_byte_to_void((byte)6);
         exec_U_to_void();
      }

      val_int_aV = val_int_n / 2 - exec_i_to_int() / 2;
      val_int_aW = val_arr_int_Y[1];
      val_int_aX = val_int_n / 2 - exec_i_to_int() / 2;
      val_int_aY = val_int_o - val_int_ai - exec_h_to_int();
      exec_b_byte_to_void((byte)4);
      val_int_aI = 8;
      val_int_aJ = val_int_aW + exec_h_to_int() + exec_c_to_int() / 2;
      val_int_aK = val_int_aY - exec_c_to_int() / 2;
      val_int_bc = 15;
      val_arr_int_P[0] = 45;
      val_arr_int_Q[0] = 10;
      val_arr_int_O[0] = (val_int_aK - val_int_aJ) / (val_arr_int_P[0] + val_arr_int_Q[0]);
      val_arr_int_P[1] = 20;
      val_arr_int_Q[1] = 10;
      val_arr_int_O[1] = (val_int_aK - val_int_aJ) / (val_arr_int_P[1] + val_arr_int_Q[1]);
      val_arr_int_P[2] = 20;
      val_arr_int_Q[2] = 10;
      val_arr_int_O[2] = (val_int_aK - val_int_aJ) / (val_arr_int_P[2] + val_arr_int_Q[2]);
      val_arr_int_P[3] = 20;
      val_arr_int_Q[3] = 10;
      val_arr_int_O[3] = (val_int_aK - val_int_aJ) / (val_arr_int_P[3] + val_arr_int_Q[3]);
   }

   public static void updateVsScreenState() {
      if (val_arr_actorstatemachine_a == null) {
         exec_Q_to_void();
      }

      for (int var0 = 0; var0 < val_arr_actorstatemachine_a.length; var0++) {
         ActorStateMachine var1;
         switch ((var1 = val_arr_actorstatemachine_a[var0]).actorCurrentAnimation) {
            case 3:
               var1.setFacingDirection(0);
         }

         if (val_arr_actorstatemachine_a[var0].isGrounded()) {
            val_arr_actorstatemachine_a[var0].actorPosY = (var1 = val_arr_actorstatemachine_a[var0]).actorPosY + val_int_e;
            switch (var1.actorPosX) {
               case 0:
                  if (var1.actorPosY > 1500) {
                     var1.setFacingDirection(3);
                  }
                  break;
               case 1:
                  if (var1.actorActionFrame == 0) {
                     if (var1.val_coreengine_a != null && var1.val_coreengine_a.actorTimerW == 102) {
                        if (var1.actorPosY > 1500) {
                           var1.setFacingDirection(3);
                        }
                        break;
                     }

                     var1.setActionFrame(2);
                  } else if (var1.actorActionFrame == 1) {
                     if (var1.isAnimationFinished()) {
                        var1.setFacingDirection(3);
                     }
                  } else if (var1.actorActionFrame == 3) {
                     if (var1.val_coreengine_a == null || var1.val_coreengine_a.actorTimerW != 32) {
                        var1.val_coreengine_a = null;
                        var1.setActionFrame(2);
                     }
                  } else if (var1.actorActionFrame == 2) {
                     if (var1.actorPosY / 400 > var1.actorVelocityX && var1.actorVelocityX < 2) {
                        var1.clearState();
                        var1.actorVelocityX++;
                     }

                     if (var1.actorPosY < 750) {
                        var1.setPosition(var1.val_coreengine_a.exec_a_to_int() + var1.val_coreengine_a.actorCurrentAnimIndex * 10, var1.getY());
                     } else if (var1.actorPosY < 1500) {
                        var1.translatePosition(-var1.actorFacingDirection * 98304 * val_int_e / 1000, -81920 * val_int_e / 1000);
                     } else {
                        var1.setFacingDirection(3);
                     }
                  } else if (var1.actorActionFrame == 5 && var1.isAnimationFinished()) {
                     var1.setFacingDirection(3);
                  }
                  break;
               case 2:
                  if (var1.actorActionFrame == 0) {
                     if (var1.actorPosY > 500) {
                        var1.setFacingDirection(3);
                     }
                  } else if (var1.actorActionFrame == 2) {
                     if (var1.actorPosY < 1500) {
                        var1.translatePosition(-var1.actorFacingDirection * 98304 * val_int_e / 1000, -81920 * val_int_e / 1000);
                     } else {
                        var1.setFacingDirection(3);
                     }
                  } else if (var1.isAnimationFinished()) {
                     var1.setFacingDirection(3);
                  }
                  break;
               case 3:
                  if (var1.val_coreengine_b == null || var1.val_coreengine_b.actorTimerW != 21) {
                     var1.setFacingDirection(3);
                  } else if (var1.isAnimationFinished()) {
                     var1.setActionFrame(0);
                  }
            }

            switch (var1.actorPosX) {
               case 0:
                  var1.translatePosition(var1.actorFacingDirection * var1.getPosX() * val_int_e / 1000, 0);
                  break;
               case 1:
                  if (var1.actorActionFrame == 0) {
                     var1.actorBoundsArray[0] = var1.val_coreengine_a.actorPhysicsArray[0];
                     var1.actorBoundsArray[1] = var1.val_coreengine_a.actorPhysicsArray[1] + -22016;
                  } else if (var1.actorActionFrame == 3 && var1.val_coreengine_a != null) {
                     exec_a_entityinterface_int_int_to_void(var1.val_coreengine_a, var1.actorFacingDirection * var1.getPosX() * val_int_e / 1000, 0);
                     var1.setPosition(var1.val_coreengine_a.exec_a_to_int(), var1.val_coreengine_a.exec_b_to_int() + -12);
                  }
            }

            SpritePartSequence var2;
            if ((var2 = var1.getCurrentSequence()) != null) {
               var1.actorState = var2.getPartYOffset(var1.actorState, val_int_e);
            }
         }
      }
   }

   public static void exec_c_int_to_void(int var0) {
      val_int_aD = 0;
      val_int_aC = var0;
      switch (var0) {
         case 0:
            exec_b_byte_bool_to_void((byte)5, false);
            exec_aa_to_void();
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_y, true, null);
            if (val_bool_X && val_bool_am) {
               exec_e_int_to_void(exec_e_int_to_int(22));
               val_bool_X = false;
               return;
            }
            break;
         case 1:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_z, true, null);
            return;
         case 2:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_H, true, null);
            return;
         case 3:
            EncodedTextBuffer var9;
            var9 = new EncodedTextBuffer(1000);
            var9.appendBuffer(exec_a_int_encodedtextbuffer_to_encodedtextbuffer(41, null));
            EncodedTextBuffer var4 = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(135, null);
            var9.appendString("||" + var4);
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_J, true, var9);
            return;
         case 4:
            EncodedTextBuffer var8;
            if (val_int_bw == 1) {
               var8 = exec_c_to_encodedtextbuffer();
            } else {
               var8 = exec_b_to_encodedtextbuffer();
            }

            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_K, true, var8);
            return;
         case 5:
            EncodedTextBuffer var10000 = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(val_arr_int_I[2], null);
            String var6 = val_string_a;
            EncodedTextBuffer var3 = var10000;
            if (var10000.childBuffers == null) {
               var3.childBuffers = new EncodedTextBuffer[1];
            }

            var3.childBuffers[0] = new EncodedTextBuffer(var6);
            var10000 = var3.concatAll(var3.childBuffers);
            var3.childBuffers[0] = null;
            EncodedTextBuffer var7 = var10000;
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_I, true, var7);
            return;
         case 6:
            exec_w_int_to_void(-1);
            return;
         case 7:
            exec_w_int_to_void(val_int_cH);
            return;
         case 8:
            exec_a_arr_int_to_void(val_arr_int_M);
            return;
         case 9:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_N, true, null);
            return;
         case 10:
            exec_a_arr_int_bool_to_void(val_arr_int_A, true);
            exec_e_int_to_void(val_int_g);
            return;
         case 11:
            exec_a_arr_int_bool_to_void(val_arr_int_A, false);
            exec_e_int_to_void(val_int_g);
            return;
         case 12:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_B, true, null);
            exec_e_int_to_void(val_int_bv);
            return;
         case 13:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_B, false, null);
            exec_e_int_to_void(val_int_bv);
            return;
         case 14:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_C, true, null);
            exec_e_int_to_void(val_int_bu);
            return;
         case 15:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_C, false, null);
            exec_e_int_to_void(val_int_bu);
            return;
         case 16:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_F, true, null);
            exec_e_int_to_void(val_int_bx);
            return;
         case 17:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_F, false, null);
            exec_e_int_to_void(val_int_bx);
            return;
         case 18:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_G, true, null);
            exec_e_int_to_void(val_int_bw);
            return;
         case 19:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_G, false, null);
            exec_e_int_to_void(val_int_bw);
            return;
         case 20:
            setGameState(10);
            return;
         case 21:
            val_bool_am = false;
            exec_c_to_bool();
            if (val_bool_aa) {
               exec_a_arr_int_to_void(val_arr_int_L);
               return;
            }

            val_long_g = 0L;
            setGameState(11);
            return;
         case 22:
            val_bool_am = true;
            setGameState(11);
            break;
         case 23:
            exec_I_to_void();
            val_bool_ah = false;
            exec_Z_to_void();
            return;
         case 24:
            exec_aa_to_void();
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_v, false, null);
            return;
         case 25:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_w, false, null);
            return;
         case 26:
            EncodedTextBuffer var2;
            var2 = new EncodedTextBuffer(1500);
            EncodedTextBuffer var1;
            if (val_int_bw == 1) {
               var1 = exec_c_to_encodedtextbuffer();
            } else {
               var1 = exec_b_to_encodedtextbuffer();
            }

            var1 = var2.appendBuffer(var1)
               .appendString("||")
               .appendBuffer(val_coreengine_b.fighterTitleBuffer)
               .appendString("||")
               .appendBuffer(exec_a_to_encodedtextbuffer());
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_x, false, var1);
            return;
         case 27:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_D, false, null);
            exec_e_int_to_void(val_int_bv);
            return;
         case 28:
            exec_a_arr_int_bool_encodedtextbuffer_to_void(val_arr_int_E, false, null);
            exec_e_int_to_void(val_int_bu);
            return;
      }
   }

   public static void updateBattleState() {
      if (val_int_eU != val_int_eK) {
         int var0 = 96 * val_int_e / 1000;
         if (val_int_eU > val_int_eK) {
            val_int_eK += var0;
            if (val_int_eU < val_int_eK) {
               val_int_eK = val_int_eU;
            }
         } else {
            val_int_eK -= var0;
            if (val_int_eU > val_int_eK) {
               val_int_eK = val_int_eU;
            }
         }
      }

      if (val_int_eV != val_int_eL) {
         val_int_eL = val_int_eL + (val_int_eV - val_int_eL) / 3;
      }

      if (val_int_eW > 0) {
         val_int_eW = val_int_eW - val_int_e;
         byte var3;
         if (val_bool_e) {
            var3 = 5;
         } else {
            var3 = 0;
         }

         val_int_eX = var3;
      } else {
         val_int_eX = 0;
      }

      val_int_eO = val_int_eK - val_int_eM / 2;
      val_int_eP = val_int_eL - val_int_eN / 2;
      val_int_eQ = val_int_eO + val_int_eM;
      int var4 = val_int_eP + val_int_eN - Math.max(val_int_eR = val_int_eP + val_int_eN, 0);
      val_int_eR -= var4;
      val_int_eP -= var4;
      val_int_eL -= var4;
      var4 = val_int_eP - Math.max(val_int_eP, val_int_aq);
      val_int_eR -= var4;
      val_int_eP -= var4;
      val_int_eL -= var4;
      var4 = val_int_eR - Math.min(val_int_eR, val_int_ar);
      val_int_eR -= var4;
      val_int_eP -= var4;
      val_int_eL -= var4;
      var4 = val_int_eO - Math.max(val_int_eO, val_int_ao);
      val_int_eO -= var4;
      val_int_eQ -= var4;
      val_int_eK -= var4;
      var4 = val_int_eQ - Math.min(val_int_eQ, val_int_ap);
      val_int_eO -= var4;
      val_int_eQ -= var4;
      int var10000 = val_int_eK -= var4;
      int var1 = val_int_eL + val_int_eX + val_int_bE / 2 - val_int_ar;
      var4 = var10000;

      for (int var2 = 0; var2 < 3; var2++) {
         val_arr_int_o[var2] = (var4 * CharacterPresetTable.val_arr_arr_int_a[val_byte_e][var2 + 13] >> 8) + val_arr_int_m[var2];
         val_arr_int_p[var2] = (var1 * CharacterPresetTable.val_arr_arr_int_a[val_byte_e][var2 + 16] >> 8) + val_arr_int_n[var2];
      }

      switch (val_byte_e) {
         case 0:
            val_int_au = val_spritepartsequence_i.getPartYOffset(val_int_au, val_int_e);
            val_int_av = -val_arr_int_o[1] + 352;
            val_int_aw = -val_arr_int_p[1] + 224 + val_int_bz;
            break;
         case 1:
            val_int_au = val_spritepartsequence_i.getPartYOffset(val_int_au, val_int_e);
            val_int_av = -val_arr_int_o[0] + 288;
            val_int_aw = -val_arr_int_p[0] + 160 + val_int_bz;
            break;
         case 2:
            val_int_au = val_spritepartsequence_i.getPartYOffset(val_int_au, val_int_e);
            val_int_aw = 64 - val_arr_int_p[0] + val_arr_int_n[0] + val_int_ay + val_int_bz;
            break;
         case 3:
            val_int_au = val_spritepartsequence_i.getPartYOffset(val_int_au, val_int_e);
            break;
         case 4:
            val_int_au = val_spritepartsequence_i.getPartYOffset(val_int_au, val_int_e);
            val_int_av = -val_arr_int_o[1] + 320;
            val_int_aw = -val_arr_int_p[1] + 256 + val_int_bz;
      }

      val_int_eS = val_int_eO + 36;
      val_int_eT = val_int_eQ - 36;
      if (val_int_dL == 4) {
         exec_c_int_int_int_to_void(Math.max(val_int_eS, val_int_as), -val_int_bE, Math.min(val_int_eT, val_int_at));
      } else {
         exec_c_int_int_int_to_void(Math.max(val_int_eS, val_int_as), val_int_eP + 78, Math.min(val_int_eT, val_int_at));
      }
   }

   // $VF: Handled exception range with multiple entry points by splitting it
   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static void resumeAudioChannel(AudioPlaybackContext var0) {
      while (var0.channelId != 2) {
         var0 = var0.nextContext;
      }

      while (true) {
         AudioClipNode var15 = var0.val_audioclipnode_b;
         if (getClipDuration(var0.val_audioclipnode_b) == 200 && (var15.mediaPlayer != null || isClipPlayable(var15))) {
            AudioPlaybackContext var1 = getGlobalAudioContext();
            boolean var2 = true;
            boolean var3 = false;

            while (!var3) {
               try {
                  synchronized (var1){} // $VF: monitorenter 

                  try {
                     label238: {
                        Throwable var14;
                        AudioPlaybackContext var40;
                        label219: {
                           if (var15.mediaPlayer.getState() != 300) {
                              AudioPlaybackContext var4 = var1.prevContext;
                              String var5 = var15.clipName;
                              boolean var6 = var2;
                              int var7 = Integer.MAX_VALUE;
                              int var8 = -1;
                              boolean var9 = false;
                              AudioClipNode[] var10 = var4.val_arr_audioclipnode_a;
                              int var11 = Integer.MAX_VALUE;
                              int var12 = -1;
                              int var13 = 0;
                              int var36 = 0;
                               AudioClipNode var37 = null;
                               int var41 = -1;
                               synchronized (var40 = getGlobalAudioContext()){} // $VF: monitorenter 

                              try {
                                 var36 = 0;
                              } catch (Throwable var28) {
                                 var14 = var28;
                                 break label219;
                              }

                              label215: {
                                 while (true) {
                                    label240: {
                                       label211: {
                                          try {
                                             if (var36 >= audioChannelCount) {
                                                break label211;
                                             }

                                             if (var10[var36] == null) {
                                                if (var6 && !var9) {
                                                   // $VF: monitorexit
                                                   break;
                                                }
                                                break label240;
                                             }
                                          } catch (Throwable var31) {
                                             var14 = var31;
                                             break label219;
                                          }

                                          try {
                                             if (var10[var36].clipName == var5) {
                                                var13++;
                                             }
                                             break label240;
                                          } catch (Throwable var27) {
                                             var14 = var27;
                                             break label219;
                                          }
                                       }

                                       label242: {
                                          label243: {
                                             try {
                                                if (var9) {
                                                   var8 = var12;
                                                }

                                                if (var8 == -1) {
                                                   break label243;
                                                }

                                                var37 = var10[var8];
                                                var13 = 0;
                                             } catch (Throwable var29) {
                                                var14 = var29;
                                                break label219;
                                             }

                                             while (true) {
                                                try {
                                                   if (var13 > 0) {
                                                      break;
                                                   }

                                                   if (getGlobalAudioContext().contextPool[var13].nextContext.activeClipNode.nextClip == var37) {
                                                      stopClipPlayback(var37);
                                                      // $VF: monitorexit
                                                      break label242;
                                                   }
                                                } catch (Throwable var30) {
                                                   var14 = var30;
                                                   break label219;
                                                }

                                                try {
                                                   var13++;
                                                } catch (Throwable var25) {
                                                   var14 = var25;
                                                   break label219;
                                                }
                                             }

                                             try {
                                                freeAudioClip(var37);
                                             } catch (Throwable var24) {
                                                var14 = var24;
                                                break label219;
                                             }
                                          }

                                          try {
                                             // $VF: monitorexit
                                          } catch (Throwable var23) {
                                             var14 = var23;
                                             break label219;
                                          }

                                          var41 = var8;
                                          break label215;
                                       }

                                       var41 = var8;
                                       break label215;
                                    }

                                    try {
                                       if (var5.equals("audio/midi")) {
                                          if (var13 == 16) {
                                             var9 = true;
                                          }
                                       } else if (var5.equals("audio/x-wav")) {
                                          if (var13 == 16) {
                                             var9 = true;
                                          }
                                       } else if (var5.equals("audio/amr") && var13 == 16) {
                                          var9 = true;
                                       }

                                       if (var10[var36] != null && var10[var36].clipName == var5 && var4.val_arr_int_a[var36] < var11) {
                                          var11 = var4.val_arr_int_a[var36];
                                          var12 = var36;
                                       }

                                       if (var4.val_arr_int_a[var36] < var7 && !var9 && var10[var36] != null) {
                                          var7 = var4.val_arr_int_a[var36];
                                          var8 = var36;
                                       }

                                       var36++;
                                    } catch (Throwable var26) {
                                       var14 = var26;
                                       break label219;
                                    }
                                 }

                                 var41 = var36;
                              }

                              if (var41 != -1) {
                                 var15.mediaPlayer.prefetch();
                                 AudioPlaybackContext var38 = var1.prevContext;
                                 synchronized (var1.prevContext){} // $VF: monitorenter 

                                 try {
                                    var38.val_arr_audioclipnode_a[var41] = var15;
                                    int[] var10000 = var38.val_arr_int_a;
                                    int var10002 = var38.playbackPosition;
                                    int var43 = var38.playbackPosition + 1;
                                    var38.playbackPosition = var43;
                                    var10000[var41] = var10002;
                                    // $VF: monitorexit
                                    break label238;
                                 } catch (Throwable var21) {
                                    Throwable var42 = var21;

                                    while (true) {
                                       try {
                                          // $VF: monitorexit
                                          throw var42;
                                       } catch (Throwable var20) {
                                          var42 = var20;
                                       }
                                    }
                                 }
                              }
                           }

                           var3 = true;
                           break label238;
                        }

                        while (true) {
                           try {
                              // $VF: monitorexit
                              throw var14;
                           } catch (Throwable var22) {
                              var14 = var22;
                           }
                        }
                     }

                     // $VF: monitorexit
                  } catch (Throwable var32) {
                     Throwable var16 = var32;

                     while (true) {
                        try {
                           // $VF: monitorexit
                           throw var16;
                        } catch (Throwable var19) {
                           var16 = var19;
                        }
                     }
                  }
               } catch (Throwable var33) {
                  var2 = false;
               }
            }
         }

         try {
            AudioPlaybackContext var44;
            synchronized (var44 = getGlobalAudioContext()){} // $VF: monitorenter 

            try {
               if (getClipDuration(var15) == 300) {
                  getGlobalAudioContext();
                  if (!getGlobalAudioContext().isPlaying) {
                     destroyAudioChannel(var0);
                     if (var0.isPaused) {
                        var0.isPaused = false;
                     }

                     var15.mediaPlayer.start();
                  }
               }

               // $VF: monitorexit
               return;
            } catch (Throwable var18) {
               Throwable var39 = var18;

               while (true) {
                  try {
                     // $VF: monitorexit
                     throw var39;
                  } catch (Throwable var17) {
                     var39 = var17;
                  }
               }
            }
         } catch (Throwable var34) {
            if (var0.playbackPosition >= 20) {
               return;
            }

            var0.playbackPosition++;
         }
      }
   }

   public static boolean exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
      int var0,
      int var1,
      int var2,
      int var3,
      int var4,
      int var5,
      int var6,
      int var7,
      int var8,
      byte var9,
      boolean var10,
      boolean var11,
      boolean var12,
      boolean var13,
      boolean var14,
      boolean var15,
      AnimationSet var16,
      SpritePartSequence var17,
      AnimationSet var18,
      SpritePartSequence var19
   ) {
      byte var20 = -1;

      for (byte var21 = 0; var21 < 50; var21++) {
         if (val_arr_effectactor_a[var21].effectAccelerationX == 0) {
            var20 = var21;
            break;
         }
      }

      byte var23 = var20;
      if (var20 != -1) {
         val_arr_effectactor_a[var20].effectCoordinates[0] = var0 << 8;
         val_arr_effectactor_a[var20].effectCoordinates[1] = var1 << 8;
         val_arr_effectactor_a[var20].effectPosX = var2;
         val_arr_effectactor_a[var20].effectPosY = var3;
         val_arr_effectactor_a[var20].effectVelocityX = var4;
         val_arr_effectactor_a[var20].effectVelocityY = var5;
         val_arr_effectactor_a[var20].effectCoordinates[2] = var5;
         val_arr_effectactor_a[var20].effectCoordinates[7] = var6;
         val_arr_effectactor_a[var20].effectAlpha = var7;
         val_arr_effectactor_a[var20].effectScale = var8;
         val_arr_effectactor_a[var20].effectAccelerationY = var9;
         val_arr_effectactor_a[var20].isEffectActive = var10;
         val_arr_effectactor_a[var20].effectFlipped = var11;
         val_arr_effectactor_a[var20].effectVisible = var12;
         val_arr_effectactor_a[var20].effectLooping = var13;
         val_arr_effectactor_a[var20].effectAttached = var14;
         val_arr_effectactor_a[var20].val_animationset_a = var16;
         val_arr_effectactor_a[var20].val_spritepartsequence_a = var17;
         val_arr_effectactor_a[var20].val_animationset_b = var18;
         val_arr_effectactor_a[var20].val_spritepartsequence_b = var19;
         val_arr_effectactor_a[var20].val_bool_g = var15;
         val_arr_effectactor_a[var20].effectAccelerationX = 1;
         val_arr_effectactor_a[var20].effectType = 0;
         switch (var9) {
            case 0:
               val_arr_effectactor_a[var20].effectRotation = 1;
               val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(1);
               break;
            case 1:
               val_arr_effectactor_a[var20].effectRotation = 2;
               val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(1);
               break;
            case 2:
               val_arr_effectactor_a[var20].effectRotation = 1;
               val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(0);
               break;
            case 3:
               val_arr_effectactor_a[var20].effectRotation = 2;
               val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(0);
               SpritePartSequence var22 = val_arr_effectactor_a[var20].val_spritepartsequence_a;
               val_arr_effectactor_a[var20].effectRotation = exec_a_int_int_int_to_int(
                  val_arr_effectactor_a[var20].val_spritepartsequence_a.sequenceFlags, var22.partOffsets.length - 1, 2
               );
               break;
            case 4:
               val_arr_effectactor_a[var20].effectRotation = 1;
               val_arr_effectactor_a[var20].val_spritepartsequence_a.setPlaybackMode(2);
            case 5:
         }

         exec_b_entityinterface_int_to_void(val_arr_effectactor_a[var23], 2);
         val_int_el++;
         if (var23 > val_int_em) {
            val_int_em = var23;
         }

         return true;
      } else {
         return false;
      }
   }

   public static void exec_a_arr_byte_int_contextservicenode_to_void(byte[] var0, int var1, ContextServiceNode var2) {
      while (var2.val_short_a == 5) {
         var2 = var2.val_contextservicenode_a;
      }

      try {
         exec_b_bool_to_void(true);
         if (val_arr_byte_n == null) {
            (val_arr_byte_n = new byte[var1 + 3])[0] = (byte)val_int_ep;
            val_arr_byte_n[1] = (byte)(var1 >> 8);
            val_arr_byte_n[2] = (byte)var1;
            System.arraycopy(var0, 0, val_arr_byte_n, 3, var1);
            saveRecordStore.setRecord(val_int_eo, val_arr_byte_n, 0, val_arr_byte_n.length);
         } else {
            int var5 = 0;
            if (val_int_en < val_arr_byte_n.length) {
               var5 = (val_arr_byte_n[val_int_en + 1] & 255) << 8 | val_arr_byte_n[val_int_en + 2] & 255;
            }

            if (var5 == var1) {
               val_int_en += 3;
               System.arraycopy(var0, 0, val_arr_byte_n, val_int_en, var1);
               saveRecordStore.setRecord(val_int_eo, val_arr_byte_n, 0, val_arr_byte_n.length);
            } else if (var5 > var1) {
               val_int_en++;
               val_arr_byte_n[val_int_en++] = (byte)(var1 >> 8);
               val_arr_byte_n[val_int_en++] = (byte)var1;
               System.arraycopy(var0, 0, val_arr_byte_n, val_int_en, var1);
               System.arraycopy(val_arr_byte_n, val_int_en + var5, val_arr_byte_n, val_int_en + var1, val_arr_byte_n.length - val_int_en - var5);
               saveRecordStore.setRecord(val_int_eo, val_arr_byte_n, 0, val_arr_byte_n.length - var5 + var1);
            } else {
               int var3 = val_arr_byte_n.length + var1 - var5;
               if (var5 == 0) {
                  var3 += 3;
               }

               byte[] var6 = new byte[var3];
               System.arraycopy(val_arr_byte_n, 0, var6, 0, val_int_en);
               var6[val_int_en++] = (byte)val_int_ep;
               var6[val_int_en++] = (byte)(var1 >> 8);
               var6[val_int_en++] = (byte)var1;
               System.arraycopy(var0, 0, var6, val_int_en, var1);
               if (var5 != 0) {
                  System.arraycopy(val_arr_byte_n, val_int_en + var5, var6, val_int_en + var1, val_arr_byte_n.length - (val_int_en + var5));
               }

               saveRecordStore.setRecord(val_int_eo, var6, 0, var6.length);
            }
         }

         saveRecordStore.closeRecordStore();
      } catch (Exception var4) {
      }
   }

   public static void exec_F_to_void() {
      for (int var0 = 0; var0 < val_arr_effectactor_a.length; var0++) {
         EffectActor var1;
         if ((var1 = val_arr_effectactor_a[var0]) != null && var1.effectAccelerationX != 0 && var1.effectCoordinates[2] <= 0) {
            var1.effectPalette = var1.effectCoordinates[0] - var1.effectTargetX;
            var1.effectPriority = var1.effectCoordinates[1] - var1.effectTargetY;
            var1.effectTargetX = var1.effectCoordinates[0];
            var1.effectTargetY = var1.effectCoordinates[1];
            switch (var1.effectAccelerationX) {
               case 1:
                  if (var1.effectAccelerationY == 5) {
                     if (var1.effectAccelerationX == 1) {
                        long var10000 = var1.effectPalette;
                        long var6 = var1.effectPriority;
                        long var4 = var10000;
                        long var8 = var10000;
                        if (var4 < 0L) {
                           var8 = 0L - var4;
                        }

                        long var10 = var6;
                        if (var6 < 0L) {
                           var10 = 0L - var6;
                        }

                        int var18 = 0;


                        label136: {
                           if (var10 <= var8) {
                              if (var8 == 0L) {
                                 var18 = var6 >= 0L ? 0 : 2;
                                 break label136;
                              }

                              var8 = (var10 << 9) / var8;
                              var10 = 1L;
                           } else {
                              if (var10 == 0L) {
                                 var18 = var4 >= 0L ? 1 : 3;
                                 break label136;
                              }

                              var8 = (var8 << 9) / var10;
                              var10 = 0L;
                           }

                           var8 = val_arr_long_a[(int)(var8 >> 2)] + var8;
                           if (var4 >= 0L) {
                              if (var6 >= 0L) {
                                 if (var10 != 0L) {
                                    var8 = 1024L - var8;
                                 }
                              } else if (var10 != 0L) {
                                 var8 += 1024L;
                              } else {
                                 var8 = 2048L - var8;
                              }
                           } else if (var6 >= 0L) {
                              if (var10 != 0L) {
                                 var8 += 3072L;
                              } else {
                                 var8 = 4096L - var8;
                              }
                           } else if (var10 != 0L) {
                              var8 = 3072L - var8;
                           } else {
                              var8 += 2048L;
                           }

                           if ((var10 = 180L - (var8 * 90L >> 10)) < 0L) {
                              var10 += 360L;
                           }

                           var18 = (int)var10;
                        }

                        int var3 = var18 * var1.val_spritepartsequence_a.partOffsets.length / 360;
                        int var2 = (var1.effectRotation & 65532) >>> 2;
                        if (var3 != var2) {
                           if (var1.effectFinished) {
                              if (var3 < var2) {
                                 var3 = var2;
                              }
                           } else if (var3 > var2) {
                              var3 = var2;
                           }

                           var1.effectRotation = var1.val_spritepartsequence_a.getPartXOffset(var3);
                        }
                     }
                  } else {
                     var1.effectRotation = var1.val_spritepartsequence_a.getPartYOffset(var1.effectRotation, val_int_e);
                  }

                  if (var1.effectFlipped && var1.effectPriority > 0) {
                     int[] var12 = new int[4];
                     var1.val_spritepartsequence_a.renderPart((var1.effectRotation & 65532) >>> 2, var1.val_animationset_a, var12, 0);
                     if ((var12[3] - var12[1] << 8) / 2 + var1.effectCoordinates[1] >= 0) {
                        var1.effectRotation = 1;
                        var1.effectAccelerationX = 2;
                        var1.effectCoordinates[1] = 0;
                        if (var1.effectAttached) {
                           int[] var19 = var1.effectCoordinates;
                           int var13 = var1.effectCoordinates[1]
                              + (
                                 exec_a_int_int_to_int(0, CharacterPresetTable.val_arr_arr_int_a[val_byte_e][21])
                                       - CharacterPresetTable.val_arr_arr_int_a[val_byte_e][21] / 2
                                    << 8
                              );
                           var19[1] = var13;
                        }

                        var1.val_bool_g = true;
                     }
                  }
                  break;
               case 2:
                  var1.effectRotation = var1.val_spritepartsequence_b.getPartYOffset(var1.effectRotation, val_int_e);
            }

            switch (var1.effectAlpha) {
               case 0:
                  var1.effectScale = var1.effectScale - val_int_e;
                  if (var1.effectScale < 0) {
                     exec_a_effectactor_to_void(var1);
                  }
                  break;
               case 1:
                  if ((var1.effectRotation & 3) == 0) {
                     exec_a_effectactor_to_void(var1);
                  }
               case 2:
            }

            if (var1.effectVisible && (var1.effectCoordinates[0] >> 8 < val_int_eO || var1.effectCoordinates[0] >> 8 > val_int_eQ)) {
               exec_a_effectactor_to_void(var1);
            }
         }
      }
   }

   public static void setGameState(int var0) {
      val_int_by = var0;
      switch (val_int_h) {
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
            val_animationset_c = null;
            val_spritepartsequence_c = null;
            break;
         case 2:
            val_animationset_d = null;
            val_spritepartsequence_d = null;
            break;
         case 3:
            val_animationset_a = null;
            val_animationset_b = null;
            val_spritepartsequence_a = null;
            val_spritepartsequence_b = null;
            break;
         case 9:
            val_arr_animationset_a = null;
            val_arr_spritepartsequence_c = null;
            val_bool_O = false;
            exec_g_byte_to_void((byte)5);
            exec_g_byte_to_void((byte)8);
            exec_g_byte_to_void((byte)7);
            exec_g_byte_to_void((byte)6);
            if (val_int_by != 10) {
               val_marketpanelcontroller_a = null;
            }
            break;
         case 11:
            exec_af_to_void();
      }

      int var10000 = val_int_by;
      exec_m_to_void();
      switch (var10000) {
         case 0:
            exec_h_int_to_int(1);

            try {
               val_animationset_h = exec_a_int_int_byte_bool_to_animationset(167772245, -1, (byte)0, false);
               val_spritepartsequence_g = exec_a_int_int_to_spritepartsequence(167772196, 1);
               val_spritepartsequence_h = exec_a_int_int_to_spritepartsequence(167772197, 1);
               val_arr_spritepartsequence_b = new SpritePartSequence[val_arr_int_h.length];

               for (int var18 = 1; var18 <= 6; var18++) {
                  val_arr_spritepartsequence_b[var18] = exec_a_int_int_to_spritepartsequence(val_arr_int_h[var18], 1);
               }

               val_int_ae = 1;
            } catch (Exception var13) {
               var13.printStackTrace();
            }

            val_int_aj = 20;
            val_int_ak = -15;
            val_int_af = val_int_aj;
            val_int_ag = val_int_n - val_int_aj;
            val_int_ah = val_int_o + val_int_ak;
            val_int_ai = val_int_o - val_int_ah + val_arr_spritepartsequence_b[1].getSequenceHeight(val_animationset_h) / 2;
            val_spritepartsequence_g.getSequenceWidth(val_animationset_h);
            break;
         case 1:
            try {
               val_animationset_c = exec_a_int_int_byte_bool_to_animationset(167772235, -1, (byte)0, false);
               val_spritepartsequence_c = exec_a_int_int_to_spritepartsequence(167772181, 1);
               val_int_l = 1;
            } catch (Exception var12) {
            }
            break;
         case 2:
            try {
               val_animationset_d = exec_a_int_int_byte_bool_to_animationset(167772244, -1, (byte)0, false);
               val_spritepartsequence_d = exec_a_int_int_to_spritepartsequence(167772194, 1);
               val_int_m = 1;
            } catch (Exception var11) {
            }
            break;
         case 3:
            try {
               val_animationset_a = exec_a_int_int_byte_bool_to_animationset(167772242, -1, (byte)0, false);
               val_animationset_b = exec_a_int_int_byte_bool_to_animationset(167772243, -1, (byte)0, false);
               val_spritepartsequence_a = exec_a_int_int_to_spritepartsequence(167772192, 1);
               val_spritepartsequence_b = exec_a_int_int_to_spritepartsequence(167772193, 1);
               val_int_j = 1;
               val_int_k = 1;
            } catch (Exception var10) {
            }
            break;
         case 4:
            updateSelectScreenState();
            exec_c_int_to_void(11);
            break;
         case 5:
            if (val_bool_f) {
               updateSelectScreenState();
            }

            exec_c_int_to_void(13);
            break;
         case 6:
            exec_c_int_to_void(15);
            break;
         case 7:
            exec_c_int_to_void(17);
            break;
         case 8:
            exec_c_int_to_void(19);
            break;
         case 9:
            MarketPanelController var40 = val_marketpanelcontroller_a = new MarketPanelController(val_int_n, val_int_o);
            byte[] var1 = loadResourceBytesByName("/moregames");
            MarketPanelController var14 = var40;
            int var2 = 2;
            byte var3 = var1[1];
            var14.val_arr_string_a = new String[var3];
            var14.val_arr_short_a = new short[var3];
            var14.val_arr_short_b = new short[var3];
            var14.val_arr_short_c = new short[var3];

            for (int var4 = 0; var4 < var3; var4++) {
               int var5;
               byte var21;
               var14.val_arr_string_a[var4] = new String(var1, var5 = var2 + 1, var21 = var1[var2]);
               var2 = var5 + var21;
            }

            int var27 = var3 << 1;
            int var23 = var3 << 2;

            for (int var6 = 0; var6 < var3; var6++) {
               var14.val_arr_short_a[var6] = exec_b_arr_byte_int_to_short(var1, var2);
               var14.val_arr_short_b[var6] = exec_b_arr_byte_int_to_short(var1, var2 + var27);
               var14.val_arr_short_c[var6] = exec_b_arr_byte_int_to_short(var1, var2 + var23);
               var2 += 2;
            }

            int var31 = var2 + var23;

            for (int var28 = 0; var28 < var14.val_arr_encodedtextbuffer_a.length; var28++) {
               var14.val_arr_short_d[var28] = exec_b_arr_byte_int_to_short(var1, var31);
               var31 += 2;
            }

            var23 = var31 + 1;
            int var32 = var1[var31];
            var14.val_arr_arr_short_a = new short[var32][];
            var14.val_arr_arr_short_b = new short[var32][];

            for (int var22 = 0; var22 < var3; var22++) {
               for (int var29 = 0; var29 < var32; var29++) {
                  short var7 = exec_b_arr_byte_int_to_short(var1, var23);
                  short var8 = exec_b_arr_byte_int_to_short(var1, var23 + 2);
                  var23 += 4;
                  if (var7 != -1 && var8 != -1) {
                     if (var14.val_arr_arr_short_a[var29] == null) {
                        var14.val_arr_arr_short_a[var29] = new short[var3];
                        var14.val_arr_arr_short_b[var29] = new short[var3];

                        for (int var9 = 0; var9 < var3; var9++) {
                           var14.val_arr_arr_short_a[var29][var9] = -1;
                           var14.val_arr_arr_short_b[var29][var9] = -1;
                        }
                     }

                     var14.val_arr_arr_short_a[var29][var22] = var7;
                     var14.val_arr_arr_short_b[var29][var22] = var8;
                  }
               }
            }

            int var37 = var23 + 1;
            byte var36 = var1[var23];
            var14.val_arr_short_i = new short[var36];
            var14.val_arr_arr_short_c = new short[var36][];
            var14.val_arr_arr_string_a = new String[var36][];

            for (int var35 = 0; var35 < var36; var35++) {
               int var10001 = var32 = var37 + 1;
               byte var30 = var1[var37];
               short[] var38 = var14.val_arr_short_i;
               short var25 = exec_b_arr_byte_int_to_short(var1, var10001);
               var38[var35] = var25;
               var37 = var32 + 2;
               var14.val_arr_arr_short_c[var35] = new short[var30];
               var14.val_arr_arr_string_a[var35] = new String[var30];

               for (int var34 = 0; var34 < var30; var34++) {
                  var14.val_arr_arr_short_c[var35][var34] = exec_b_arr_byte_int_to_short(var1, var37);
                  int var39 = var37 + 2 + 1;
                  byte var26 = var1[var37 + 2];
                  var14.val_arr_arr_string_a[var35][var34] = new String(var1, var39, var26);
                  var37 = var39 + var26;
               }
            }

            exec_a_byte_to_void((byte)8);
            exec_a_byte_to_void((byte)7);
            Object[] var15;
            (var15 = new Object[5])[0] = val_arr_object_a[ResourceSlotTable.val_arr_byte_a[8]];
            var15[2] = val_arr_object_a[ResourceSlotTable.val_arr_byte_a[7]];
            var15[3] = val_arr_object_a[ResourceSlotTable.val_arr_byte_a[8]];
            var15[4] = val_arr_object_a[ResourceSlotTable.val_arr_byte_a[8]];
            var15[1] = val_arr_object_a[ResourceSlotTable.val_arr_byte_a[8]];
            Object[] var19 = var15;
            MarketPanelController var16 = val_marketpanelcontroller_a;
            val_marketpanelcontroller_a.val_arr_object_a = var19;
            Object var41 = exec_a_to_fontcharmap().val_contextservicenode_a.val_object_b;
            exec_a_object_to_void(var19[0]);
            var16.val_int_D = exec_c_to_int() - exec_d_to_int();
            exec_a_object_to_void(var41);
            updateSelectScreenState();
            boolean[] var17 = val_arr_bool_a;
            boolean var20;
            if (!val_marketpanelcontroller_a.isAvailable()) {
               var20 = true;
            } else {
               var20 = false;
            }

            var17[20] = var20;
            exec_c_int_to_void(0);
            exec_e_to_void();
            initGameState();
            break;
         case 10:
            exec_h_int_to_int(2);
            val_marketpanelcontroller_a.setMarketItem("mnu");
            exec_l_to_void();
            break;
         case 11:
            exec_a_byte_byte_to_void((byte)0, (byte)5);
            val_int_cw = 0;
            exec_u_int_to_void(0);
      }

      val_int_h = val_int_by;
      val_int_i = 0;
   }

   public static void updateRoundResultState() {
      for (byte var0 = 0; var0 < 3; var0++) {
         switch (val_byte_e) {
            case 2:
            case 3:
               if (var0 == 0) {
                  val_spritepartsequence_i.drawSequence(val_int_au, val_animationset_j, val_int_av, val_int_aw, 0);
               }
               break;
            case 4:
               if (var0 == 1) {
                  val_spritepartsequence_i.drawSequence(val_int_au, val_animationset_j, val_int_av, val_int_aw, 0);
               }
         }

         byte var8 = var0;
         int var1 = -val_arr_int_p[var0] % 32;
         int var2 = val_arr_int_p[var0] / 32;
         int var3 = -val_arr_int_o[var0] % 32;
         int var4 = val_arr_int_o[var0] / 32;
         if (var3 > 0) {
            var3 -= 32;
            var4--;
         }

         if (var4 < 0) {
            var4 = var4 % val_arr_byte_e[var8] + val_arr_byte_e[var8];
         }

         if (var4 >= val_arr_byte_e[var8]) {
            var4 %= val_arr_byte_e[var8];
         }

         if (var2 < 0) {
            var1 -= var2 << 5;
            var2 = 0;
         }

         int var5 = val_int_bE;
         if (val_arr_int_p[var8] + var5 > val_arr_int_l[var8]) {
            var5 = val_arr_int_l[var8] + var1 - (var2 << 5);
         }

         while (var1 < var5) {
            int var9 = var3;
            int var10 = var4;
            int var6 = var2 * val_arr_byte_e[var8] + var4;

            while (var9 < val_int_bA) {
               byte var7;
               if ((var7 = val_arr_arr_byte_b[var8][var6]) > 0) {
                  int var10001 = var7 + -1;
                  int var13 = var1 + val_int_bz;
                  int var12 = var9;
                  int var11 = var10001;
                  AnimationSet var16 = val_animationset_i;
                  long var14 = val_animationset_i.val_arr_long_a[var16.animPriorityBytes[var11] & 0xFF];
                  val_graphicsadapter_a.drawRegion(
                     var16.getCurrentFrame(),
                     (int)(var14 >>> 48 & 65535L),
                     (int)(var14 >>> 32 & 65535L),
                     (int)(var14 >>> 16 & 65535L),
                     (int)var14 & 65535,
                     var16.animDurationArray[var11],
                     var12,
                     var13,
                     20
                  );
               }

               var9 += 32;
               var10++;
               var6++;
               if (var10 == val_arr_byte_e[var8]) {
                  var10 = 0;
                  var6 -= val_arr_byte_e[var8];
               }
            }

            var1 += 32;
            var2++;
         }

         switch (val_byte_e) {
            case 0:
               if (var0 == 1) {
                  val_spritepartsequence_i.drawSequence(val_int_au, val_animationset_j, val_int_av, val_int_aw, 0);
               }
               break;
            case 1:
               if (var0 == 1) {
                  val_spritepartsequence_i.drawSequence(val_int_au, val_animationset_j, val_int_av, val_int_aw, 0);
               }
         }
      }
   }

   public static void exec_v_int_to_void(int var0) {
      val_int_bV = var0;
      switch (var0) {
         case 0:
            val_byte_o = 3;
            val_byte_p = 4;
            val_encodedtextbuffer_k = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(27, null);
            val_arr_arr_bool_b = new boolean[val_arr_arr_int_c.length][1];

            for (int var1 = 0; var1 < val_arr_arr_int_c.length; var1++) {
               val_arr_arr_bool_b[var1] = new boolean[val_arr_arr_int_c[var1].length - 1 + 1];
            }

            val_int_cq = 0;
            val_int_cv = 3;
            val_int_cb = 0;
            exec_a_byte_bool_to_void((byte)7, false);
            break;
         case 1:
            val_byte_o = 3;
            val_byte_p = 0;
            val_int_cr = -1;
            val_int_cs = 0;
            val_int_cv = 4;
            break;
         case 2:
            val_byte_o = 3;
            val_byte_p = 0;
            val_int_cn = (val_int_bD - val_arr_int_aB[8]) / 2 - val_arr_int_av[val_int_bZ];
            val_int_co = 0;
            if (val_int_cn == 0) {
               val_int_co = 1000;
            }

            val_int_cq = 0;
            val_int_cv = 4;
            break;
         case 3:
            val_int_cp = 0;
            val_int_cc = val_int_bY + (val_int_bE - val_int_bX) + val_arr_int_aC[8];
            break;
         case 4:
            exec_b_byte_bool_to_void((byte)5, false);
            val_byte_o = 3;
            val_byte_p = 0;
            val_encodedtextbuffer_k = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(val_arr_arr_int_c[val_int_bZ][0], null);
            exec_y_int_to_void(val_int_ce);
            val_int_cv = 3;
            break;
         case 5:
            val_byte_o = 3;
            val_byte_p = 0;
            val_encodedtextbuffer_k = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(val_arr_arr_int_c[val_int_bZ][0], null);
            val_int_ce = 0;
            exec_y_int_to_void(0);
            val_int_cf = val_int_bE / 2 + (val_arr_arr_int_c[val_int_bZ].length - 1) * val_arr_int_aC[6];
            val_int_cg = val_arr_int_aC[6];
            val_int_cd = val_int_cf;
            val_int_ci = 0;
            val_int_ch = 700 * (val_arr_arr_int_c[val_int_bZ].length - 1);
            val_int_cj = 0;
            val_int_ck = 0;
            val_int_cv = 3;
      }

      val_bool_Z = false;
   }

   public static int exec_h_int_to_int(int var0) {
      FontCharmap var1 = exec_a_to_fontcharmap();
      SDKMIDlet var2 = midletInstance;
      byte[] var3 = new byte[2];
      if (exec_e_int_to_bool(var0) && !var1.val_bool_b) {
         return var1.val_arr_short_a[var0];
      }

      InputStream var4 = null;

      try {
         byte var5;
         if ((var1.val_arr_byte_b[var0] & 64) == 0) {
            var5 = var1.val_byte_d;
         } else {
            var5 = 0;
         }

         byte var6 = var5;
         if (var1.val_byte_a == 0) {
            var4 = var2.getClass().getResourceAsStream("/t_" + new String(var1.val_arr_arr_byte_a[var5]).trim());

            for (int var9 = 1; var9 < var0; var9++) {
               if ((var1.val_arr_byte_b[var9] & 64) == 0 || var6 == 0) {
                  skipStreamBytes(var4, (var1.val_arr_short_a[var9] + 1 << 1) + (var1.val_arr_arr_short_a[var6][var9] & '\uffff'));
               }
            }
         } else if (var1.val_byte_a == 1) {
            var4 = var2.getClass().getResourceAsStream("/t_" + new String(var1.val_arr_arr_byte_a[var5]).trim() + var0);
         }

         var5 = var1.val_arr_byte_c[var0];
         if (var1.val_arr_arr_short_b[var5] == null) {
            var1.val_arr_arr_short_b[var5] = new short[var1.val_arr_short_c[var5]];
         }

         for (int var8 = 0; var8 < var1.val_arr_short_a[var0] + 1; var8++) {
            var3[0] = (byte)var4.read();
            var3[1] = (byte)var4.read();
            var1.val_arr_arr_short_b[var5][var8] = readShortBigEndian(var3, 0);
         }

         if (var1.val_arr_arr_byte_b[var5] == null) {
            var1.val_arr_arr_byte_b[var5] = new byte[var1.val_arr_short_b[var5] & 65535];
         }

         bufferedStreamRead(var4, var1.val_arr_arr_byte_b[var5], 0, var1.val_arr_arr_short_a[var6][var0] & 65535);
         var1.val_arr_byte_d[var5] = (byte)var0;
         var4.close();
      } catch (Exception var7) {
      }

      return var1.val_arr_short_a[var0];
   }

   public static void renderScene(GraphicsAdapter var0) {
      if (val_bool_ah) {
         tickSubState();
      } else if (val_bool_ai) {
         exec_b_byte_to_void(val_byte_q);
         int var48 = val_int_cB;
         int var17 = Math.min(val_arr_short_f[0], val_int_cE + val_int_cF);

         for (int var29 = val_int_cE - 1; var29 < var17; var29++) {
            EncodedTextBuffer var58 = val_encodedtextbuffer_m;
            short var67 = val_arr_short_f[var29 + 1];
            int var72 = val_arr_short_f[var29 + 2] - val_arr_short_f[var29 + 1];
            byte var79;
            if (var29 == val_arr_short_f[0] - 1) {
               var79 = 0;
            } else {
               var79 = -1;
            }

            exec_a_encodedtextbuffer_int_int_int_int_int_to_void(var58, var67, var72 + var79, val_int_n / 2, var48, 17);
            var48 += exec_l_to_int();
         }

         if (val_bool_ab) {
            exec_a_bool_bool_bool_bool_int_int_int_int_bool_to_void(
               val_bool_ac,
               val_bool_ad,
               val_bool_ae,
               val_bool_af,
               val_int_n / 2 - exec_i_to_int() / 2,
               0,
               val_int_n / 2 - exec_i_to_int() / 2,
               val_int_o - val_int_ai - exec_h_to_int(),
               true
            );
         }
      } else {
         try {
            switch (val_int_cw) {
               case 1:
                  try {
                     try {
                        for (int var15 = 0; var15 < val_int_n; var15 += val_arr_int_ar[3]) {
                           for (int var25 = 0; var25 < val_int_o; var25 += val_arr_int_as[3]) {
                              exec_e_int_int_int_to_void(3, var15, var25);
                           }
                        }
                     } catch (Exception var8) {
                     }

                     try {
                        Thread.sleep(100L);

                        for (int var26 = 0; var26 <= val_int_n; var26 += val_arr_int_ar[0]) {
                           exec_e_int_int_int_to_void(0, var26, 0);
                        }

                        exec_b_byte_to_void((byte)4);
                        exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_j, val_int_n / 2, val_int_bS, 17);
                     } catch (Exception var9) {
                     }

                     Thread.sleep(30L);
                     int var27 = val_byte_n;
                     val_graphicsadapter_a.setColor(val_int_bH);
                     val_graphicsadapter_a.fillRect(
                        exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var27][2]) + val_int_bT - 3,
                        exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var27][3]) + val_int_bU - 3,
                        val_int_bQ + 6,
                        val_int_bQ + 6
                     );

                     for (byte var47 = 0; var47 < PatternTable.val_arr_arr_byte_a.length; var47++) {
                        byte var57 = PatternTable.val_arr_arr_byte_a[var47][0];
                        byte var66;
                        if (exec_a_byte_to_bool(var47)) {
                           var66 = 0;
                        } else {
                           var66 = PatternTable.val_arr_arr_byte_a[var47][1];
                        }

                        int var83 = exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var47][2]);
                        int var10001 = val_int_bT;
                        var27 = exec_a_byte_to_int(PatternTable.val_arr_arr_byte_a[var47][3]) + val_int_bU;
                        int var16 = var83 + var10001;
                        switch (var66) {
                           case 0:
                              val_arr_spritepartsequence_g[var57].drawSequence(val_arr_int_aq[var57], val_arr_animationset_c[1], var16, var27, 0);
                              break;
                           case 1:
                              val_arr_spritepartsequence_f[1].drawSequence(val_arr_int_aq[1], val_arr_animationset_c[1], var16, var27, 0);
                              break;
                           case 2:
                              val_arr_spritepartsequence_f[2].drawSequence(val_arr_int_aq[2], val_arr_animationset_c[1], var16, var27, 0);
                        }
                     }

                     exec_b_byte_to_void((byte)4);
                     exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_i, val_int_n / 2, val_int_bL, 17);
                     if (val_bool_Y) {
                        val_spritepartsequence_j.drawSequence(val_int_bO, val_animationset_l, val_int_bM, val_int_bN, 0);
                        return;
                     }
                  } catch (Exception var10) {
                  }

                  return;
               case 2:
               case 4:
                  exec_ae_to_void();
                  updateRoundResultState();
                  switch (val_int_bV) {
                     case 0:
                     case 1:
                     case 2:
                     case 3:
                        int var14 = val_int_cb;

                        for (int var24 = 0; var24 < val_arr_arr_int_c.length; var24++) {
                           int var56 = val_arr_int_av[var24] + val_int_cq;
                           int[] var65 = val_arr_arr_int_c[var24];
                           int var10000 = val_int_bX - val_arr_int_aC[8];
                           boolean[] var46 = val_arr_arr_bool_b[var24];
                           int var76 = var10000 + var14 + val_int_bz;
                           if (var46[0]) {
                              val_arr_spritepartsequence_h[7].drawSequence(val_arr_int_aD[7], val_arr_animationset_d[4], var56, var76, 0);
                           } else {
                              val_arr_spritepartsequence_h[7].drawSequence(val_arr_int_aD[7], val_arr_animationset_d[3], var56, var76, 0);
                           }

                           for (int var71 = 0; var71 < var65.length - 1; var71++) {
                              var76 -= val_arr_int_aC[8];
                              if (var46[var71 + 1]) {
                                 val_arr_spritepartsequence_h[8].drawSequence(val_arr_int_aD[8], val_arr_animationset_d[4], var56, var76, 0);
                              } else {
                                 val_arr_spritepartsequence_h[8].drawSequence(val_arr_int_aD[8], val_arr_animationset_d[3], var56, var76, 0);
                              }
                           }
                        }

                        int var77 = val_int_cb;
                        exec_d_int_int_int_to_void(
                           val_int_cv,
                           val_arr_int_av[val_int_bZ] + val_int_cq + val_arr_int_aB[7] / 2 - val_arr_int_aB[3] / 2,
                           val_int_bX - val_arr_int_aC[7] / 2 - exec_c_to_int() / 2 - val_arr_int_aC[3] + var77 + val_int_bz
                        );
                        exec_b_byte_to_void((byte)1);
                        exec_a_encodedtextbuffer_int_int_int_to_void(
                           val_encodedtextbuffer_l,
                           val_arr_int_av[val_int_bZ] + val_int_cq + val_arr_int_aB[7] / 2,
                           val_int_bX - val_arr_int_aC[7] / 2 - exec_c_to_int() / 2 + var77 + val_int_bz,
                           17
                        );
                        break;
                     case 4:
                        exec_a_arr_int_int_int_int_bool_to_void(val_arr_arr_int_c[val_int_bZ], val_int_cu, val_int_ce, val_int_cd, false);
                        break;
                     case 5:
                        exec_a_arr_int_int_int_int_bool_to_void(val_arr_arr_int_c[val_int_bZ], val_int_cu, val_int_ce, val_int_cd, true);
                  }

                  exec_aj_to_void();

                  for (int var78 = 0; var78 <= val_int_n; var78 += val_arr_int_aB[0]) {
                     exec_d_int_int_int_to_void(0, var78, 0);
                  }

                  exec_b_byte_to_void((byte)4);
                  exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_k, val_int_n / 2, val_int_ca, 17);
                  return;
               case 3:
                  var0 = var0;
                  if (val_int_dN == 1) {
                     int var23 = val_int_o / 2 - 4;
                     int var45 = val_int_n - 8;
                     int var10003 = Math.min(var45 * (val_int_dP + 1) / 24, var45);
                     var0.setColor(6689058);
                     var0.fillRect(4, var23, var45, 8);
                     var0.setColor(16729088);
                     var0.fillRect(4, var23, var10003, 8);
                     var0.setColor(249700927);
                     var0.drawRect(4, var23, var45, 8);
                  } else if (val_int_dN == 2) {
                     exec_ae_to_void();
                     if (val_int_dL != 15) {
                        if (val_int_dL != 14 && (val_int_dL != 0 || val_int_dM > 300 && val_coreengine_c.actorLifecycleState == 2)) {
                           var0.setColor(CharacterPresetTable.val_arr_arr_int_a[val_byte_e][19 + val_int_ax]);
                           var0.fillRect(0, val_int_bz, val_int_bD, val_int_bE);
                           updateRoundResultState();
                           if (val_int_dL != 5) {
                              if (val_coreengine_b != null && val_coreengine_b.exec_u_to_bool()) {
                                 exec_d_coreengine_to_void(val_coreengine_b);
                              }

                              if (val_coreengine_c != null && val_coreengine_c.exec_u_to_bool()) {
                                 exec_d_coreengine_to_void(val_coreengine_c);
                              }

                              for (int var3 = 0; var3 < val_arr_effectactor_a.length; var3++) {
                                 EffectActor var4;
                                 if ((var4 = val_arr_effectactor_a[var3]) != null && var4.effectAccelerationX != 0 && var4.val_bool_g) {
                                    exec_b_effectactor_to_void(var4);
                                 }
                              }

                              if (val_coreengine_d == val_coreengine_b) {
                                 if (val_coreengine_c != null && val_coreengine_c.exec_u_to_bool()) {
                                    val_coreengine_c.exec_c_graphicsadapter_to_void(var0);
                                 }

                                 if (val_coreengine_b != null && val_coreengine_b.exec_u_to_bool()) {
                                    val_coreengine_b.exec_c_graphicsadapter_to_void(var0);
                                 }
                              } else {
                                 if (val_coreengine_b != null && val_coreengine_b.exec_u_to_bool()) {
                                    val_coreengine_b.exec_c_graphicsadapter_to_void(var0);
                                 }

                                 if (val_coreengine_c != null && val_coreengine_c.exec_u_to_bool()) {
                                    val_coreengine_c.exec_c_graphicsadapter_to_void(var0);
                                 }
                              }

                              if (val_arr_actorstatemachine_a == null) {
                                 exec_Q_to_void();
                              }

                              for (int var49 = 0; var49 < val_arr_actorstatemachine_a.length; var49++) {
                                 if (val_arr_actorstatemachine_a[var49].actorCurrentAnimation == 2) {
                                    ActorStateMachine var2;
                                    int var59 = ((var2 = val_arr_actorstatemachine_a[var49]).actorBoundsArray[0] >> 8) - val_int_eO;
                                    int var5 = (var2.actorBoundsArray[1] >> 8) - exec_k_to_int();
                                    SpritePartSequence var6 = var2.getCurrentSequence();
                                    AnimationSet var19 = val_arr_animationset_g[var2.actorActionFrame];
                                    var2.actorGroundedFlag = !var2.actorGroundedFlag;
                                    boolean isAction0 = (var2.actorActionFrame == 0 && var2.actorPosX == 2);

                                    if ((!isAction0 || var2.actorGroundedFlag) && var19 != null && var6 != null) {
                                       int transform = (var2.actorFacingDirection == 1) ? 0 : 4;
                                       var6.drawSequence(var2.actorState, var19, var59, var5, transform);
                                    }
                                 }
                              }

                              for (int var50 = 0; var50 < val_arr_effectactor_a.length; var50++) {
                                 EffectActor var60;
                                 if ((var60 = val_arr_effectactor_a[var50]) != null && var60.effectAccelerationX != 0 && !var60.val_bool_g) {
                                    exec_b_effectactor_to_void(var60);
                                 }
                              }

                              if (val_bool_aP) {
                                 val_spritepartsequence_s.drawSequence(1, val_animationset_u, val_int_ex - val_int_eO, val_int_ey - exec_k_to_int(), 0);
                              } else if (val_bool_aQ && val_spritepartsequence_H.partOffsets.length > (val_coreengine_f.actorTimerR & 65532) >>> 2) {
                                 val_spritepartsequence_G.drawSequence(
                                    val_coreengine_f.actorTimerR,
                                    val_animationset_A,
                                    val_coreengine_f.exec_a_to_int() - val_int_eO,
                                    val_coreengine_f.exec_b_to_int() - exec_k_to_int(),
                                    0
                                 );
                              }

                              for (int var51 = 0; var51 < actorPoolArray.length; var51++) {
                                 if (actorPoolArray[var51].actorLifecycleState == 2
                                    && actorPoolArray[var51].characterId == 2
                                    && actorPoolArray[var51].actorTimerW == 26) {
                                    CoreEngine var61 = actorPoolArray[var51];
                                    SpritePartSequence var68 = val_spritepartsequence_I;
                                    int var73 = var61.actorTimerS;
                                    AnimationSet var20 = val_animationset_C;
                                    int var30 = var61.exec_a_to_int() - val_int_eO;
                                    int var82 = var61.exec_b_to_int() - exec_k_to_int();
                                    byte var62;
                                    if (var61.actorCurrentAnimIndex == 1) {
                                       var62 = 0;
                                    } else {
                                       var62 = 4;
                                    }

                                    var68.drawSequence(var73, var20, var30, var82, var62);
                                 }
                              }

                              GraphicsAdapter var52 = var0;
                              exec_b_byte_to_void((byte)0);
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_o, val_int_cR, val_int_cS, 20);
                              if (!val_bool_am) {
                                 exec_b_byte_to_void((byte)4);
                                 exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_r, val_int_cV, val_int_dk, 20);
                              }

                              var52.setColor(255);
                              var52.fillRect(val_int_cV, val_int_cX, val_int_dg, val_int_cZ);
                              var52.fillRect(val_int_cW + val_int_cY - val_int_dh, val_int_cX, val_int_dh, val_int_cZ);
                              exec_a_graphicsadapter_int_int_int_int_to_void(var52, val_int_cV + val_int_dg, val_int_cX, val_int_cY - val_int_dg, val_int_cZ);
                              exec_a_graphicsadapter_int_int_int_int_to_void(var52, val_int_cW, val_int_cX, val_int_cY - val_int_dh, val_int_cZ);
                              var52.setColor(13157464);
                              var52.drawRect(val_int_cV, val_int_cX, val_int_cY, val_int_cZ - 1);
                              var52.drawRect(val_int_cW, val_int_cX, val_int_cY, val_int_cZ - 1);
                              exec_b_byte_to_void((byte)1);
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_p, val_int_di, val_int_dm, 20);
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_q, val_int_dj, val_int_dm, 24);
                              var52.setColor(65280);
                              var52.fillRect(val_int_cV, val_int_cX + val_int_cZ, val_int_dr, val_int_do);
                              var52.fillRect(val_int_cW + val_int_cY - val_int_ds, val_int_cX + val_int_cZ, val_int_ds, val_int_do);
                              exec_a_graphicsadapter_int_int_int_int_to_void(
                                 var52, val_int_cV + val_int_dr, val_int_cX + val_int_cZ, val_int_dn - val_int_dr, val_int_do
                              );
                              exec_a_graphicsadapter_int_int_int_int_to_void(
                                 var52, val_int_cW + val_int_cY - val_int_dn, val_int_cX + val_int_cZ, val_int_dn - val_int_ds, val_int_do
                              );
                              var52.setColor(13157464);
                              var52.drawRect(val_int_cV, val_int_cX + val_int_cZ - 1, val_int_dn, val_int_do);
                              var52.drawRect(val_int_cW + val_int_cY - val_int_dn, val_int_cX + val_int_cZ - 1, val_int_dn, val_int_do);
                              if (!val_bool_am) {
                                 for (int var53 = 0; var53 < val_int_dt; var53++) {
                                    val_spritepartsequence_n.drawSequence(0, val_animationset_n, val_int_cV + (val_int_dy + val_int_dw) * var53, val_int_dx, 0);
                                 }

                                 for (int var54 = 0; var54 < val_int_du; var54++) {
                                    val_spritepartsequence_n.drawSequence(
                                       0, val_animationset_n, val_int_cW + val_int_cY - val_int_dw - (val_int_dy + val_int_dw) * var54, val_int_dx, 0
                                    );
                                 }
                              }

                              exec_b_byte_to_void((byte)4);

                              for (int var55 = 0; var55 < 2; var55++) {
                                 if (val_arr_int_aG[var55] != 0) {
                                    EncodedTextBuffer var63 = val_arr_encodedtextbuffer_f[var55];
                                    int var69 = val_arr_int_aJ[var55];
                                    int var74 = val_int_dD;
                                    byte var21;
                                    if (var55 == 0) {
                                       var21 = 24;
                                    } else {
                                       var21 = 20;
                                    }

                                    exec_a_encodedtextbuffer_int_int_int_to_void(var63, var69, var74, var21);
                                    EncodedTextBuffer var22 = val_arr_encodedtextbuffer_g[var55];
                                    var74 = val_arr_int_aM[var55];
                                    var69 = val_int_dE;
                                    byte var64;
                                    if (var55 == 0) {
                                       var64 = 24;
                                    } else {
                                       var64 = 20;
                                    }

                                    exec_a_encodedtextbuffer_int_int_int_to_void(var22, var74, var69, var64);
                                 }
                              }
                           }
                        }

                        label257:
                        switch (val_int_dL) {
                           case 0:
                              if (val_int_dM > 300 && !val_bool_am) {
                                 exec_b_byte_to_void((byte)4);
                                 exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_x, val_int_bC, val_int_dx + val_int_dv, 17);
                                 if (exec_A_to_bool()) {
                                    exec_b_byte_to_void((byte)1);
                                    exec_a_encodedtextbuffer_int_int_int_to_void(
                                       val_encodedtextbuffer_w, val_int_bC, Math.min(val_int_o - val_int_ai, val_int_bB) - exec_c_to_int(), 17
                                    );
                                 }
                              }

                              val_coreengine_b.setActorPosition(-64, 0);
                              val_coreengine_c.setActorPosition(64, 0);
                              break;
                           case 1:
                              byte var44;
                              if (val_bool_e) {
                                 var44 = 2;
                              } else {
                                 var44 = 3;
                              }

                              exec_b_byte_to_void(var44);
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_A, val_int_bC, val_int_dx + val_int_dv, 17);
                           case 2:
                           case 4:
                           case 13:
                           default:
                              break;
                           case 3:
                              byte var43;
                              if (val_bool_e) {
                                 var43 = 2;
                              } else {
                                 var43 = 3;
                              }

                              exec_b_byte_to_void(var43);
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_G, val_int_bC, val_int_dx + val_int_dv, 17);
                              break;
                           case 5:
                              if (val_bool_aB) {
                                 var0.setColor(16777215);
                                 var0.fillRect(0, val_int_bz, val_int_bD, val_int_bE);
                              }

                              switch (val_int_ed) {
                                 case 0:
                                    val_coreengine_c.exec_c_graphicsadapter_to_void(var0);
                                 case 1:
                                 case 7:
                                 default:
                                    break label257;
                                 case 2:
                                 case 3:
                                 case 4:
                                 case 5:
                                 case 6:
                                    val_spritepartsequence_r.drawSequence(val_int_eg, val_coreengine_c.currentAnimSet, -val_int_eO, -exec_k_to_int(), 0);
                                    if (val_int_ed >= 4) {
                                       val_spritepartsequence_q.drawSequence(val_int_ef, val_animationset_q, -val_int_eO, -exec_k_to_int(), 0);
                                    }
                                    break label257;
                                 case 8:
                                 case 9:
                                 case 10:
                                    exec_b_byte_to_void((byte)4);
                                    int var41 = val_int_dx + val_int_dv;
                                    exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_B, val_int_bC, var41, 17);
                                    var41 += 2 * exec_c_to_int();
                                    if (val_int_ed >= 9) {
                                       exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
                                          val_encodedtextbuffer_L, val_arr_short_g, 1, val_arr_short_g[0], val_int_bC, var41, 17
                                       );
                                       var41 += (val_arr_short_g[0] + 1) * exec_c_to_int();
                                    }

                                    if (val_int_ed == 10) {
                                       exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
                                          val_encodedtextbuffer_M, val_arr_short_h, 1, val_arr_short_h[0], val_int_bC, var41, 17
                                       );
                                    }
                                    break label257;
                              }
                           case 6:
                           case 7:
                              exec_b_byte_to_void((byte)4);
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_B, val_int_bC, val_int_dx + val_int_dv, 17);
                              break;
                           case 8:
                              exec_b_byte_to_void((byte)4);
                              int var37 = val_int_dx + val_int_dv;
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_C, val_int_bC, var37, 17);
                              var37 += exec_c_to_int();
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_D, val_int_bC, var37, 17);
                              if (val_int_dM > 1000) {
                                 var37 += exec_c_to_int();
                                 exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_E, val_int_bC, var37, 17);
                                 var37 += exec_c_to_int();
                                 exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_F, val_int_bC, var37, 17);
                              }
                              break;
                           case 9:
                              exec_b_byte_to_void((byte)4);
                              int var34 = val_int_dx + val_int_dv;
                              val_spritepartsequence_o.drawSequence(val_int_dX, val_animationset_o, val_int_bC, var34, 0);
                              var34 += val_int_dW;
                              if (!val_bool_am) {
                                 exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_I, val_int_bC, var34, 17);
                                 var34 += exec_c_to_int();
                                 exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_H, val_int_bC, var34, 17);
                              }
                              break;
                           case 10:
                              exec_b_byte_to_void((byte)4);
                              int var31 = val_int_dx + val_int_dv + 40;
                              val_spritepartsequence_p.drawSequence(val_int_dY, val_animationset_p, val_int_bC, var31, 0);
                              var31 += 24;
                              if (!val_bool_am) {
                                 exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_J, val_int_bC, var31, 17);
                                 var31 += exec_c_to_int();
                                 exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_K, val_int_bC, var31, 17);
                              }
                              break;
                           case 11:
                              exec_b_byte_to_void((byte)4);
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_y, val_int_bC, val_int_dx + val_int_dv, 17);
                              break;
                           case 12:
                              exec_b_byte_to_void((byte)4);
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_z, val_int_bC, val_int_dx + val_int_dv, 17);
                              break;
                           case 14:
                              exec_b_byte_to_void((byte)4);
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_O, val_int_n / 2, val_int_o / 2 - val_int_ai, 17);
                              val_int_q = 2;
                        }
                     }

                     exec_aj_to_void();
                  }

                  if (val_int_ej > 0) {
                     exec_b_byte_to_void((byte)4);
                     exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_N, val_int_bC, val_int_dx + val_int_dv + 32, 17);
                  }

                  return;
               case 5:
               case 10:
                  exec_ag_to_void();
                  val_spritepartsequence_m.drawSequence(val_int_cI, val_animationset_m, val_int_cL, val_int_cM, 0);
                  exec_c_bool_to_void(false);
                  return;
               case 6:
                  exec_ag_to_void();
                  exec_c_bool_to_void(true);
                  return;
               case 7:
               case 9:
                  exec_b_byte_to_void((byte)4);
                  exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
                     val_encodedtextbuffer_m,
                     val_arr_short_f,
                     val_int_cE,
                     val_arr_short_f[0],
                     val_int_n / 2,
                     val_int_o / 2 - val_arr_short_f[0] * exec_c_to_int() / 2,
                     17
                  );
               default:
                  return;
               case 8:
                  if (!val_bool_R) {
                     exec_b_byte_to_void((byte)4);
                     exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_f, val_int_n / 2, val_int_bj, 17);
                     exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
                        val_encodedtextbuffer_g, val_arr_short_e, 1, val_arr_short_e[0], val_int_n / 2, val_int_bk, 17
                     );
                     int var12 = val_int_bm;

                     for (int var1 = 0; var1 < 3; var1++) {
                        if (var1 != val_int_bp || !val_bool_S) {
                           if (val_arr_byte_j[var1] != 0) {
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_arr_encodedtextbuffer_e[var1], var12, val_int_bl, 20);
                           } else {
                              exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_h, var12, val_int_bl, 20);
                           }
                        }

                        var12 += val_int_bn + val_int_bo;
                     }

                     for (int var18 = 0; var18 < 4; var18++) {
                        val_arr_spritepartsequence_e[var18]
                           .drawSequence(val_arr_int_ai[var18], val_animationset_k, val_arr_int_aj[var18], val_arr_int_ak[var18], 0);
                     }

                     exec_i_to_void();
                     return;
                  }
            }
         } catch (Exception var11) {
         }
      }
   }

   public static Object exec_a_spriteimage_arr_byte_to_object(SpriteImage var0, byte[] var1) {
      FontCharmap var6 = exec_a_to_fontcharmap();
      byte var2;
      boolean isBit128 = ((var2 = var1[0]) & 128) != 0;
      boolean var5 = (var2 & 64) != 0;

      byte[] var7 = new byte[12];
      System.arraycopy(var1, 1, var7, 0, 7);
      var7[7] = 0;
      var7[8] = var7[0];
      var7[9] = var7[1];
      var7[10] = (byte)(isBit128 ? 2 : 1);

      if (var5) {
         var7[10] = (byte)(var7[10] | 128);
      }

      short var3 = (short)readShortBigEndian(var1, 8);
      short var8 = readShortBigEndian(var1, 10);
      var2 = 12;
      short[] var4 = new short[var3];

      for (int var13 = 0; var13 < var3; var13++) {
         var4[var13] = readShortBigEndian(var1, var2);
         var2 += 2;
      }

      short[] var14 = new short[var3 + 1];

      for (int var9 = 0; var9 < var3; var9++) {
         var14[var9] = readShortBigEndian(var1, var2);
         var2 += 2;
      }

      var14[var3] = -1;
      byte[] var16;
      int var17;
      System.arraycopy(var1, var2, var16 = new byte[var17 = (var3 << 1) + var8 * 6], 0, var17);
      short[] var18 = new short[256];

      for (short var11 = 0; var11 < 128; var11++) {
         var18[var11] = (short)exec_a_arr_short_int_int_int_int_fontcharmap_to_int(var4, var11, 0, var3 - 1, var4.length, var6);
      }

      var7[11] = 1;
      Object[] var15;
      (var15 = new Object[6])[0] = var7;
      var15[1] = var4;
      var15[2] = var18;
      var15[3] = var14;
      var15[4] = var16;
      var15[5] = null;
      Object[] var19;
      (var19 = new Object[8])[0] = var0;
      var19[1] = var15[0];
      var19[2] = var15[1];
      var19[3] = var15[2];
      var19[4] = var15[3];
      var19[5] = var15[4];
      var19[6] = var15[5];
      var19[7] = Integer.valueOf(-1);
      return var19;
   }

   public static void exec_a_int_int_int_int_arr_int_to_void(int var0, int var1, int var2, int var3, int[] var4) {
      int var5 = 0;
      int var6 = 0;
      if (val_arr_int_bl[val_int_eE + 2] > var0 && val_arr_int_bl[val_int_eE + 1] < var0) {
         var5 = Math.min(val_arr_int_bl[val_int_eE + 2] - var0, var2 - var0);
      } else if (val_arr_int_bl[val_int_eE + 1] < var2) {
         var5 = Math.min(var2 - val_arr_int_bl[val_int_eE + 1], val_arr_int_bl[val_int_eE + 2] - val_arr_int_bl[val_int_eE + 1]);
      }

      if (val_arr_int_bl[val_int_eE] < var1) {
         var6 = Math.min(var1 - val_arr_int_bl[val_int_eE], var1 - var3);
      } else if (val_arr_int_bl[val_int_eE + 3] < var3) {
         var6 = Math.min(var3 - val_arr_int_bl[val_int_eE + 3], val_arr_int_bl[val_int_eE] - val_arr_int_bl[val_int_eE + 3]);
      }

      var0 = Math.min(var0, val_arr_int_bl[val_int_eE + 2]);
      var2 = Math.min(var2, val_arr_int_bl[val_int_eE + 1]);
      var3 = Math.max(var3, val_arr_int_bl[val_int_eE + 3]);
      var1 = Math.max(var1, val_arr_int_bl[val_int_eE]);
      if (var2 > var0) {
         var0 = var2;
      }

      if (var1 < var3) {
         var3 = var1;
      }

      var4[0] = var3;
      var4[3] = var3 + var6;
      var4[1] = var0;
      var4[2] = var0 + var5;
   }

   public static int exec_a_int_int_int_int_to_int(int var0, int var1, int var2, int var3) {
      if (val_arr_int_bl[val_int_eE + 1] < var2 && val_arr_int_bl[val_int_eE + 2] > var0
         || val_arr_int_bl[val_int_eE + 1] > var2 && val_arr_int_bl[val_int_eE + 2] < var0) {
         if (val_arr_int_bl[val_int_eE] < var1 && val_arr_int_bl[val_int_eE + 3] > var3
            || val_arr_int_bl[val_int_eE] > var1 && val_arr_int_bl[val_int_eE + 3] < var3) {
            if (val_arr_int_bl[val_int_eE + 3] < var3 + (var1 - var3 >> 2)) {
               return val_arr_int_bl[val_int_eE + 2] + val_arr_int_bl[val_int_eE + 1] > var2 + var0 ? 2 : 1;
            } else if (val_arr_int_bl[val_int_eE] < var1 && val_arr_int_bl[val_int_eE] > var1 - (var1 - var3 >> 2)) {
               return val_arr_int_bl[val_int_eE + 2] + val_arr_int_bl[val_int_eE + 1] > var2 + var0 ? 6 : 5;
            } else {
               return val_arr_int_bl[val_int_eE + 2] + val_arr_int_bl[val_int_eE + 1] > var2 + var0 ? 4 : 3;
            }
         } else {
            return 0;
         }
      } else {
         return 0;
      }
   }

   public static short[] exec_a_encodedtextbuffer_int_to_arr_short(EncodedTextBuffer var0, int var1) {
      int var11 = var0.bufferCapacity;
      FontCharmap var2;
      if ((var2 = exec_a_to_fontcharmap()).val_arr_short_e == null) {
         var2.val_arr_short_e = new short[50];
         var2.val_int_b = 50;
      }

      short[] var10 = var2.val_arr_short_e;
      int var12 = var0.flagsByte & 63;
      int var3 = 0;
      int var4 = 0;
      int var5 = -1;
      var10[1] = 0;
      int var6 = 2;

      for (int var7 = 0; var7 < var11; var7++) {
         short var8 = var0.getCharAt(var7);
         if (var6 + 3 >= var2.val_int_b) {
            var2.val_arr_short_e = new short[var2.val_int_b + 50];
            exec_a_arr_short_arr_short_int_to_void(var10, var2.val_arr_short_e, var2.val_int_b);
            var10 = var2.val_arr_short_e;
            var2.val_int_b += 50;
         }

         if (var8 == 124) {
            var10[var6++] = (short)(var7 + 1);
            var3 = 0;
            var4 = 0;
            var5 = -1;
         } else {
            int var9 = var2.getCharWidth(var2.getKerning(var8, var12));
            var3 += var9;
            var4 += var9;
            if (var3 > var1) {
               if (var5 == -1) {
                  var10[var6++] = (short)var7;
                  var3 = var9;
                  var4 = 0;
               } else {
                  var10[var6++] = (short)(var5 + 1);
                  if (var8 != 32 && var8 != 173) {
                     var5 = -1;
                  } else {
                     var5 = var7;
                  }

                  var3 = var4;
                  var4 = 0;
               }
            } else if (var8 == 32 || var8 == 173) {
               var5 = var7;
               var4 = 0;
            }
         }
      }

      var10[0] = (short)(var6 - 1);
      var10[var6] = (short)var11;
      var10[var6 + 1] = 124;
      short[] var13;
      exec_a_arr_short_arr_short_int_to_void(var10, var13 = new short[var6 + 2], var6 + 2);
      return var13;
   }

   public static void exec_w_int_to_void(int var0) {
      val_int_bs = var0;

      for (int var1 = 0; var1 < 10; var1++) {
         val_arr_encodedtextbuffer_c[var1] = new EncodedTextBuffer(4);
         val_arr_encodedtextbuffer_c[var1].appendInt(var1 + 1);
         val_arr_encodedtextbuffer_c[var1].appendString(". ");
         val_arr_encodedtextbuffer_b[var1] = new EncodedTextBuffer(3);
         val_arr_encodedtextbuffer_d[var1] = new EncodedTextBuffer(10);
         val_arr_encodedtextbuffer_d[var1].appendInt(val_arr_int_ag[var1]);

         for (int var2 = 0; var2 < 3; var2++) {
            val_arr_encodedtextbuffer_b[var1].appendInt(0);
            val_arr_encodedtextbuffer_b[var1].setCharAt(var2, (char)val_arr_short_a[val_arr_arr_byte_c[var1][var2]]);
         }
      }

      exec_b_byte_to_void((byte)4);
      val_int_bh = exec_l_to_int();
      val_int_bg = 1;
      int var3;
      if ((val_int_bi = (var3 = val_int_o - val_arr_int_Y[1] - val_int_ai - exec_l_to_int()) / (val_int_bh + val_int_bg)) > 10) {
         val_int_bi = 10;
      }

      val_int_bg = (var3 - val_int_bi * val_int_bh) / val_int_bi;
      val_int_bd = (var3 - val_int_bi * (val_int_bh + val_int_bg)) / 2 + val_arr_int_Y[1] + val_int_bh / 2;
      if (val_int_bs == -1) {
         val_byte_h = 0;
         val_byte_i = 4;
      } else {
         val_byte_h = 1;
         val_byte_i = 0;
      }

      val_bool_L = false;
      val_bool_K = false;
      val_int_aE = 7;
      val_encodedtextbuffer_d = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(21, null);
      val_int_be = 48;
      val_int_bf = val_int_n - 32;
   }

   public static void exec_e_to_void() {
      val_int_dF = val_int_dI;
      val_int_dG = val_int_dJ;
      val_int_dH = val_int_dK;
      val_int_dI = 0;
      val_int_dJ = 0;
      val_int_dK = val_int_dK & ~val_int_dG;
      boolean var0;
      if ((val_int_dF & 32) != 0) {
         var0 = true;
      } else {
         var0 = false;
      }

      val_bool_at = var0;
      if ((val_int_dF & 64) == 0 && (val_int_dF & 524288) == 0) {
         var0 = false;
      } else {
         var0 = true;
      }

      val_bool_au = var0;
      if ((val_int_dF & 512) == 0 && (val_int_dF & 1) == 0) {
         var0 = false;
      } else {
         var0 = true;
      }

      val_bool_an = var0;
      if ((val_int_dF & 32768) == 0 && (val_int_dF & 2) == 0) {
         var0 = false;
      } else {
         var0 = true;
      }

      val_bool_ao = var0;
      if ((val_int_dF & 2048) == 0 && (val_int_dF & 4) == 0) {
         var0 = false;
      } else {
         var0 = true;
      }

      val_bool_ap = var0;
      if ((val_int_dF & 8192) == 0 && (val_int_dF & 8) == 0) {
         var0 = false;
      } else {
         var0 = true;
      }

      val_bool_aq = var0;
      if ((val_int_dF & 4096) == 0 && (val_int_dF & 16) == 0) {
         var0 = false;
      } else {
         var0 = true;
      }

      val_bool_av = var0;
      if ((val_int_dH & 512) == 0 && (val_int_dH & 1) == 0) {
         var0 = false;
      } else {
         var0 = true;
      }

      val_bool_ar = var0;
      if ((val_int_dH & 32768) == 0 && (val_int_dH & 2) == 0) {
         var0 = false;
      } else {
         var0 = true;
      }

      val_bool_as = var0;
   }

   public static void exec_a_object_to_void(Object var0) {
      FontCharmap var1;
      (var1 = exec_a_to_fontcharmap()).val_contextservicenode_a.val_object_b = null;
      var1.val_contextservicenode_a.val_arr_byte_a = null;
      var1.val_contextservicenode_a.val_object_a = null;
      var1.val_contextservicenode_a.val_arr_short_b = null;
      var1.val_contextservicenode_a.val_arr_short_a = null;
      var1.val_contextservicenode_a.val_arr_short_c = null;
      var1.val_contextservicenode_a.val_arr_byte_b = null;
      if (var0 != null) {
         var1.val_contextservicenode_a.val_object_a = ((Object[])var0)[0];
         var1.val_contextservicenode_a.val_arr_byte_a = (byte[])((Object[])var0)[1];

         var1.val_contextservicenode_a.val_arr_short_b = (short[])((Object[])var0)[2];
         var1.val_contextservicenode_a.val_arr_short_a = (short[])((Object[])var0)[3];
         var1.val_contextservicenode_a.val_arr_short_c = (short[])((Object[])var0)[4];
         var1.val_contextservicenode_a.val_arr_byte_b = (byte[])((Object[])var0)[5];
         if (var1.val_arr_byte_a != null
            && var1.val_contextservicenode_a.val_arr_byte_a[11] != var1.val_arr_byte_a[var1.val_byte_d]
            && var1.val_arr_byte_a[var1.val_byte_d] > 1) {
            int var2 = var1.val_contextservicenode_a.val_arr_short_b.length;

            for (short var3 = 128; var3 < 256; var3++) {
               var1.val_contextservicenode_a.val_arr_short_a[var3] = (short)exec_a_arr_short_int_int_int_int_fontcharmap_to_int(
                  var1.val_contextservicenode_a.val_arr_short_b, var1.val_arr_short_d[var3 - 128], 0, var2 - 1, var2, var1
               );
            }

            var1.val_contextservicenode_a.val_arr_byte_a[11] = var1.val_arr_byte_a[var1.val_byte_d];
         }
      }

      var1.val_contextservicenode_a.val_object_b = var0;
   }

   public static void copyByteArray(byte[] var0, int var1, int var2, byte[] var3) {
      var1 = readIntWithLength(var0, var1, var2);
      int var6 = readIntAtOffset(var0, var1) - var1;
      if (var3.length < var6) {
         var6 = var3.length;
      }

      for (int var9 = 0; var9 < var6; var9++) {
         var0[var9 + var1] = var3[var9];
      }

      var6 = (var0[var1 - 8] & 255) << 24 | (var0[var1 - 7] & 255) << 16 | (var0[var1 - 6] & 255) << 8 | var0[var1 - 5] & 255;
      long[] var10 = new long[256];

      for (int var11 = 0; var11 < 256; var11++) {
         long var4 = var11;

         for (int var7 = 0; var7 < 8; var7++) {
            if ((var4 & 1L) != 0L) {
               var4 = 3988292384L ^ var4 >> 1;
            } else {
               var4 >>= 1;
            }
         }

         var10[var11] = var4;
      }

      long var13 = 4294967295L;

      for (int var12 = 0; var12 < var6 + 4; var12++) {
         var13 = var10[(int)(var13 ^ var0[var1 - 4 + var12] & 255L) & 0xFF] ^ var13 >> 8;
      }

      var13 ^= 4294967295L;
      var0[var1 + var6] = (byte)(var13 >> 24 & 255L);
      var0[var1 + var6 + 1] = (byte)(var13 >> 16 & 255L);
      var0[var1 + var6 + 2] = (byte)(var13 >> 8 & 255L);
      var0[var1 + var6 + 3] = (byte)(var13 & 255L);
   }

   public static void exec_H_to_void() {
      exec_a_byte_to_void((byte)1);
      exec_a_byte_int_to_void((byte)4, 1);
      exec_T_to_void();
      val_int_ca = 8;

      try {
         val_arr_animationset_d = new AnimationSet[val_arr_int_ax.length];

         for (int var0 = 0; var0 < val_arr_int_ax.length; var0++) {
            if (var0 == 4) {
               val_arr_animationset_d[var0] = exec_a_int_int_byte_bool_to_animationset(val_arr_int_ax[var0], -1, (byte)2, false);
            } else {
               val_arr_animationset_d[var0] = exec_a_int_int_byte_bool_to_animationset(val_arr_int_ax[var0], -1, (byte)0, false);
            }
         }

         val_arr_spritepartsequence_h = new SpritePartSequence[val_arr_int_ay.length];
         val_arr_int_aD = new int[val_arr_int_ay.length];
         val_arr_int_aB = new int[val_arr_int_ay.length];
         val_arr_int_aC = new int[val_arr_int_ay.length];

         for (int var2 = 0; var2 < val_arr_int_ay.length; var2++) {
            val_arr_spritepartsequence_h[var2] = exec_a_int_int_to_spritepartsequence(val_arr_int_ay[var2], 1);
            val_arr_int_aD[var2] = 1;
            val_arr_int_aB[var2] = val_arr_spritepartsequence_h[var2].getSequenceWidth(val_arr_animationset_d[val_arr_int_az[var2]]);
            val_arr_int_aC[var2] = val_arr_spritepartsequence_h[var2].getSequenceHeight(val_arr_animationset_d[val_arr_int_az[var2]]);
         }

         val_arr_spritepartsequence_i = new SpritePartSequence[val_arr_int_aR.length];
         val_arr_int_aA = new int[val_arr_int_aR.length];
         val_int_ct = val_arr_int_aB[1];

         for (int var3 = 0; var3 < val_arr_int_aR.length; var3++) {
            val_arr_spritepartsequence_i[var3] = exec_a_int_int_to_spritepartsequence(val_arr_int_aR[var3], 1);
            val_arr_int_aA[var3] = 1;
         }
      } catch (Exception var1) {
      }

      exec_U_to_void();
   }

   public static void exec_f_to_void() {
      InputStream var0 = midletInstance.getClass().getResourceAsStream("/index");

      try {
         readStreamBytes(var0, 1);
         val_int_al = readStreamBytes(var0, 2);
         int var1 = readStreamBytes(var0, 1);
         val_int_am = readStreamBytes(var0, 1);
         int var2 = val_int_al;
         int var3 = val_int_am;
         val_arr_int_i = new int[var2];
         val_arr_arr_int_a = new int[var2][var3 + 1];

         for (int var4 = 0; var4 < var2; var4++) {
            val_arr_int_i[var4] = readStreamBytes(var0, 2);

            for (int var5 = 0; var5 < var3 + 1; var5++) {
               val_arr_arr_int_a[var4][var5] = readStreamBytes(var0, var1);
            }

            readStreamBytes(var0, var1);
         }

         int var8;
         val_int_an = var8 = readStreamBytes(var0, 2);
         int var15 = var3 / 8;
         if (var3 % 8 > 0) {
            var15++;
         }

         val_arr_arr_bool_a = new boolean[var8][var3];
         val_arr_int_j = new int[var8];
         val_arr_arr_int_b = new int[var8][];

         for (int var9 = 0; var9 < var8; var9++) {
            int var10 = readStreamBytes(var0, var15);
            int var14 = 0;

            for (int var11 = 0; var11 < var3; var11++) {
               boolean[] var13 = val_arr_arr_bool_a[var9];
               int var6 = var11;
               boolean var7;
               if ((var10 & 1 << var11) != 0) {
                  var7 = true;
               } else {
                  var7 = false;
               }

               var13[var6] = var7;
               if (val_arr_arr_bool_a[var9][var11]) {
                  var14++;
               }
            }

            val_arr_int_j[var9] = readStreamBytes(var0, var1);
            val_arr_arr_int_b[var9] = new int[var14];
            int var17 = 0;

            for (int var16 = 0; var16 < var3; var16++) {
               if (val_arr_arr_bool_a[var9][var16]) {
                  val_arr_arr_int_b[var9][var17++] = readStreamBytes(var0, var1);
               }
            }
         }
      } catch (Exception var12) {
      }

      val_bool_a = true;
   }

   public static void exec_a_arr_int_arr_int_int_int_int_int_to_void(int[] var0, int[] var1, int var2, int var3, int var4, int var5) {
      val_arr_int_bs[val_int_eI] = var0[0];
      val_arr_int_bs[val_int_eI + 1] = var0[1];
      val_arr_int_bs[val_int_eI + 2] = var0[2];
      val_arr_int_bs[val_int_eI + 3] = var0[3];
      val_arr_int_bs[val_int_eI + 4] = var0[4];
      val_arr_int_bs[val_int_eI + 5] = var0[5];
      val_arr_int_bs[val_int_eI + 6] = var0[6];
      val_arr_int_bs[val_int_eI + 7] = var0[7];
      val_arr_int_bs[val_int_eI + 8] = var1[0];
      val_arr_int_bs[val_int_eI + 9] = var1[1];
      val_arr_int_bs[val_int_eI + 10] = var1[2];
      val_arr_int_bs[val_int_eI + 11] = var1[3];
      val_arr_int_bs[val_int_eI + 12] = var2;
      val_arr_int_bs[val_int_eI + 13] = var3;
      val_arr_int_bs[val_int_eI + 14] = var4;
      val_arr_int_bs[val_int_eI + 15] = var5;
      if ((val_arr_int_bs[val_int_eI + 4] | 512) != 0) {
         val_int_eJ = val_int_eI;
      }

      val_int_eI += 16;
   }

   public static int exec_b_int_to_int(int var0) {
      if (exec_a_to_fontcharmap().val_arr_arr_byte_a.length == 1) {
         return 0;
      }

      String var1 = exec_b_string_to_string("Force-Locale");
      int var5;
      String[] var2 = new String[var5 = exec_a_to_fontcharmap().val_arr_arr_byte_a.length];

      for (int var3 = 0; var3 < var5; var3++) {
         var2[var3] = new String(exec_a_to_fontcharmap().val_arr_arr_byte_a[var3]);
      }

      if (var0 == -1) {
         byte var8;
         if (var1 == null) {
            var8 = 2;
         } else {
            String var9;
            var1 = var9 = var1.toLowerCase().trim();
            if (var9.length() < 2) {
               var8 = 2;
            } else if (var9.equals("menu")) {
               var8 = 1;
            } else if (var9.startsWith("auto-")) {
               var8 = 3;
               var1 = var9.substring(5);
            } else {
               var8 = 4;
            }
         }

         for (int var6 = 0; var6 < var2.length; var6++) {
            if (var2[var6].length() > 2) {
               String var4 = var2[var6].substring(0, 2);
               boolean var7 = true;

               for (int var10 = 0; var10 < var2.length; var10++) {
                  if (var6 != var10 && var2[var10].startsWith(var4)) {
                     var7 = false;
                     break;
                  }
               }

               if (var7) {
                  var2[var6] = var4;
               }
            }
         }

         if (var8 == 2 || var8 == 3 || var8 == 1) {
            var0 = exec_a_arr_string_to_byte(var2);
            if (var8 == 1 && var0 >= 0) {
               var0 = -1 - var0;
            }
         }

         if (var8 == 4 || var8 == 3 && var0 == -1) {
            for (int var11 = 0; var11 < var2.length; var11++) {
               if (var1.startsWith(var2[var11])) {
                  var0 = var11;
                  break;
               }
            }
         }

         if (var8 == 4 && var0 == -1) {
            var0 = exec_a_arr_string_to_byte(var2);
         }
      }

      return var0;
   }

   public static void exec_a_arr_int_int_int_int_bool_to_void(int[] var0, int var1, int var2, int var3, boolean var4) {
      int var5 = (val_int_bD - val_arr_int_aB[5]) / 2;
      int var6 = val_int_bE - val_arr_int_aC[6];
      if (var4) {
         var6 += var3 % val_arr_int_aC[5];
      }

      int var7 = (val_int_bE - val_arr_int_aC[0]) / val_arr_int_aC[5] + 1;
      int var8 = var2 - var7 / 2;
      if (var4) {
         var8 += var3 / val_arr_int_aC[5];
      }

      var7 = var8 + var7;

      for (int var9 = var8; var9 <= var7; var9++) {
         if (var9 == -1) {
            exec_d_int_int_int_to_void(5, var5, var6 + val_int_bz);
         } else if (var9 >= -1 && var9 < var0.length - 1) {
            int var10001 = var9 + 1;
            var8 = var6 + val_int_bz;
            int var10 = var5 + 0;
            int var11 = var0[var10001];
            exec_d_int_int_int_to_void(6, var10, var8);
            switch (var11) {
               case -2:
                  exec_d_int_int_int_to_void(10, var10 + 75, var8 + 14);
                  break;
               case -1:
                  exec_d_int_int_int_to_void(9, var10 + 75, var8 + 14);
                  break;
               default:
                  exec_f_int_int_int_to_void(var11, var10 + 75, var8 + 14);
            }

            if (var9 == var2) {
               var11 = var5 + val_arr_int_aB[6] - 75 - val_int_ct;
               var10 = var6 + 14;
               if (!var4) {
                  var8 = var3;
               } else {
                  var8 = 0;
               }

               exec_f_int_int_int_to_void(var1, var11, var10 + var8 + val_int_bz);
            }
         }

         var6 -= val_arr_int_aC[6];
      }
   }

   public static void pauseAudioChannel(AudioPlaybackContext param0) {
      // $VF: Couldn't be decompiled
      // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
      // java.lang.RuntimeException: parsing failure!
      //   at org.jetbrains.java.decompiler.modules.decompiler.decompose.DomHelper.parseGraph(DomHelper.java:211)
      //   at org.jetbrains.java.decompiler.main.rels.MethodProcessor.codeToJava(MethodProcessor.java:174)
      //
      // Bytecode:
      // 00: aload 0
      // 01: getfield AudioPlaybackContext.channelId S
      // 04: bipush 2
      // 05: if_icmpeq 10
      // 08: aload 0
      // 09: getfield AudioPlaybackContext.nextContext LAudioPlaybackContext;
      // 0c: astore 0
      // 0d: goto 00
      // 10: aload 0
      // 11: getfield AudioPlaybackContext.val_audioclipnode_b LAudioClipNode;
      // 14: dup
      // 15: astore 1
      // 16: ifnull f2
      // 19: aload 1
      // 1a: getfield AudioClipNode.mediaPlayer Ljavax/microedition/media/Player;
      // 1d: ifnull f2
      // 20: bipush 0
      // 21: aload 1
      // 22: invokestatic CoreEngine.exec_a_byte_audioclipnode_to_bool (BLAudioClipNode;)Z
      // 25: ifeq 9e
      // 28: invokestatic CoreEngine.getGlobalAudioContext ()LAudioPlaybackContext;
      // 2b: dup
      // 2c: astore 2
      // 2d: monitorenter
      // 2e: aload 0
      // 2f: invokestatic CoreEngine.isChannelActive (LAudioPlaybackContext;)Z
      // 32: ifne 3f
      // 35: aload 0
      // 36: invokestatic CoreEngine.isChannelBusy (LAudioPlaybackContext;)Z
      // 39: ifne 3f
      // 3c: aload 2
      // 3d: monitorexit
      // 3e: return
      // 3f: bipush 1
      // 40: aload 1
      // 41: invokestatic CoreEngine.exec_a_byte_audioclipnode_to_bool (BLAudioClipNode;)Z
      // 44: ifeq 8b
      // 47: invokestatic CoreEngine.getGlobalAudioContext ()LAudioPlaybackContext;
      // 4a: dup
      // 4b: astore 3
      // 4c: monitorenter
      // 4d: aload 0
      // 4e: bipush 0
      // 4f: putfield AudioPlaybackContext.isPaused Z
      // 52: aload 0
      // 53: getfield AudioPlaybackContext.val_audioclipnode_b LAudioClipNode;
      // 56: astore 1
      // 57: invokestatic CoreEngine.getGlobalAudioContext ()LAudioPlaybackContext;
      // 5a: dup
      // 5b: astore 4
      // 5d: monitorenter
      // 5e: aload 1
      // 5f: invokestatic CoreEngine.freeAudioClip (LAudioClipNode;)V
      // 62: aload 1
      // 63: invokestatic CoreEngine.isClipPlayable (LAudioClipNode;)Z
      // 66: pop
      // 67: aload 4
      // 69: monitorexit
      // 6a: goto 73
      // 6d: astore 1
      // 6e: aload 4
      // 70: monitorexit
      // 71: aload 1
      // 72: athrow
      // 73: aload 0
      // 74: invokestatic CoreEngine.destroyAudioChannel (LAudioPlaybackContext;)V
      // 77: aload 0
      // 78: getfield AudioPlaybackContext.isPlaying Z
      // 7b: aload 0
      // 7c: invokestatic CoreEngine.exec_a_bool_audioplaybackcontext_to_void (ZLAudioPlaybackContext;)V
      // 7f: aload 3
      // 80: monitorexit
      // 81: goto 94
      // 84: astore 4
      // 86: aload 3
      // 87: monitorexit
      // 88: aload 4
      // 8a: athrow
      // 8b: aload 1
      // 8c: invokestatic CoreEngine.stopClipPlayback (LAudioClipNode;)V
      // 8f: aload 0
      // 90: bipush 0
      // 91: putfield AudioPlaybackContext.isPaused Z
      // 94: aload 2
      // 95: monitorexit
      // 96: return
      // 97: astore 4
      // 99: aload 2
      // 9a: monitorexit
      // 9b: aload 4
      // 9d: athrow
      // 9e: invokestatic CoreEngine.getGlobalAudioContext ()LAudioPlaybackContext;
      // a1: dup
      // a2: astore 4
      // a4: monitorenter
      // a5: aload 0
      // a6: invokestatic CoreEngine.isChannelActive (LAudioPlaybackContext;)Z
      // a9: ifne b2
      // ac: aload 4
      // ae: monitorexit
      // af: goto d0
      // b2: aload 0
      // b3: getfield AudioPlaybackContext.val_audioclipnode_b LAudioClipNode;
      // b6: getfield AudioClipNode.mediaPlayer Ljavax/microedition/media/Player;
      // b9: invokeinterface javax/microedition/media/Player.stop ()V 1
      // be: aload 0
      // bf: bipush 1
      // c0: putfield AudioPlaybackContext.isPaused Z
      // c3: aload 4
      // c5: monitorexit
      // c6: goto d0
      // c9: astore 3
      // ca: aload 4
      // cc: monitorexit
      // cd: aload 3
      // ce: athrow
      // cf: pop
      // d0: invokestatic CoreEngine.getGlobalAudioContext ()LAudioPlaybackContext;
      // d3: dup
      // d4: astore 4
      // d6: monitorenter
      // d7: aload 0
      // d8: bipush 0
      // d9: putfield AudioPlaybackContext.isPaused Z
      // dc: aload 1
      // dd: getfield AudioClipNode.mediaPlayer Ljavax/microedition/media/Player;
      // e0: lconst_0
      // e1: invokeinterface javax/microedition/media/Player.setMediaTime (J)J 3
      // e6: pop2
      // e7: aload 4
      // e9: monitorexit
      // ea: return
      // eb: astore 3
      // ec: aload 4
      // ee: monitorexit
      // ef: aload 3
      // f0: athrow
      // f1: pop
      // f2: return
      // try (51 -> 58): 59 java/lang/Throwable
      // try (60 -> 62): 59 java/lang/Throwable
      // try (41 -> 72): 73 java/lang/Throwable
      // try (74 -> 76): 73 java/lang/Throwable
      // try (95 -> 100): 111 java/lang/Throwable
      // try (101 -> 110): 111 java/lang/Throwable
      // try (112 -> 114): 111 java/lang/Throwable
      // try (91 -> 100): 116 java/lang/Throwable
      // try (101 -> 116): 116 java/lang/Throwable
      // try (24 -> 32): 86 java/lang/Throwable
      // try (33 -> 85): 86 java/lang/Throwable
      // try (87 -> 89): 86 java/lang/Throwable
      // try (121 -> 131): 132 java/lang/Throwable
      // try (133 -> 135): 132 java/lang/Throwable
      // try (117 -> 137): 137 java/lang/Throwable
   }

   public static void exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(
      EncodedTextBuffer var0, short[] var1, int var2, int var3, int var4, int var5, int var6
   ) {
      FontCharmap var7 = exec_a_to_fontcharmap();
      int var8 = exec_c_to_int();
      int var9 = 0;
      int var10 = 0;
      int var11 = 0;
      if ((var6 & 2) != 0) {
         var11 = var1[0] * var8 - var7.val_contextservicenode_a.val_arr_byte_a[2] >> 1;
         var6 ^= 2;
      } else if ((var6 & 32) != 0) {
         var11 = var1[0] * var8 - var7.val_contextservicenode_a.val_arr_byte_a[2];
         var6 ^= 32;
      }

      var6 |= 16;
      if (var7.val_contextservicenode_a.val_arr_byte_a[9] == 1) {
         var4 -= var11;
         var9 = var8;
      } else if (var7.val_contextservicenode_a.val_arr_byte_a[9] == 4) {
         var4 += var11;
         var9 = -var8;
      } else if (var7.val_contextservicenode_a.val_arr_byte_a[9] == 2) {
         var5 -= var11;
         var10 = var8;
      } else {
         var5 += var11;
         var10 = -var8;
      }

      short var15 = var1[(var1[0] & '\uffff') + 2];

      for (int var17 = var2; var17 < var2 + var3; var17++) {
         var8 = var1[var17] & '\uffff';
         int var12 = (var1[var17 + 1] & '\uffff') - var8;
         short var13;
         if ((var13 = var0.getCharAt((var1[var17 + 1] & '\uffff') - 1)) == var15 || var13 == 32) {
            var12--;
         }

         exec_a_encodedtextbuffer_int_int_int_int_int_to_void(var0, var8, var12, var4, var5, var6);
         var4 += var9;
         var5 += var10;
      }
   }

   public static boolean exec_c_to_bool() {
      try {
         if (val_arr_byte_l == null) {
            int var0;
            byte[] var10000;
            if ((var0 = exec_a_contextservicenode_to_int(exec_c_to_contextservicenode())) == -1) {
               var10000 = null;
            } else {
               exec_c_to_contextservicenode();
               byte[] var6;
               exec_b_arr_byte_to_int(var6 = new byte[var0]);
               var10000 = var6;
            }

            val_arr_byte_l = var10000;
         }

         if (val_arr_byte_l == null) {
            throw new IOException();
         }

         DataInputStream var2;
         var2 = new DataInputStream(new ByteArrayInputStream(val_arr_byte_l));
         exec_I_int_to_void(var2.readByte());
         val_int_bu = var2.readByte();
         exec_h_int_to_void(var2.readByte());
         val_int_bw = var2.readByte();
         val_int_bx = var2.readByte();
         boolean var12 = var2.readBoolean();
         exec_d_bool_to_void(var12);
         if (var12) {
            int[][] var3 = new int[var2.readByte()][0];

            for (int var7 = 0; var7 < var3.length; var7++) {
               var3[var7] = new int[var2.readByte()];

               for (int var1 = 0; var1 < var3[var7].length; var1++) {
                  var3[var7][var1] = var2.readInt();
               }
            }

            val_arr_arr_int_c = var3;
            val_int_bZ = var2.readInt();
            val_int_ce = var2.readInt();
            val_int_cu = var2.readInt();
            val_long_g = var2.readInt();
         }

         byte[] var11 = new byte[3];

         for (int var10 = 0; var10 < 10; var10++) {
            for (int var8 = 0; var8 < 3; var8++) {
               var11[var8] = var2.readByte();
            }

            exec_a_int_arr_byte_to_void(var10, var11);
            int var4 = var2.readInt();
            int var9 = var10;
            val_arr_int_ag[var9] = var4;
         }

         val_bool_U = var2.readBoolean();
         val_bool_V = var2.readBoolean();
         return true;
      } catch (Exception var5) {
         exec_d_bool_to_void(false);
         exec_N_to_void();
         val_bool_V = true;
         exec_I_to_void();
         return false;
      }
   }

   public static int exec_i_int_to_int(int var0) {
      if (var0 == -1) {
         return 1;
      }

      if (var0 == -2) {
         return 2;
      }

      if (var0 == -3) {
         return 3;
      }

      if (var0 == -4) {
         return 4;
      }

      if (var0 == 99999) {
         return 9;
      }

      if (var0 == -8) {
         return 10;
      }

      if (var0 == 42) {
         return 16;
      }

      if (var0 == 35) {
         return 15;
      }

      if (var0 == -5) {
         return 7;
      }

      if (var0 == -6) {
         return 13;
      }

      if (var0 == -7) {
         return 14;
      }

      if (var0 == 99999) {
         return 0;
      }

      if (var0 == 99999) {
         return 0;
      }

      if (var0 == 99999) {
         return 0;
      }

      if (var0 == 99999) {
         return 0;
      }

      if (var0 == 99999) {
         return 0;
      }

      if (var0 == 99999) {
         return 0;
      }

      int var2;
      if (var0 >= 48 && var0 <= 57) {
         var2 = var0 - 48 + 17;
      } else {
         switch (var0) {
            case 0:
               var2 = 0;
               break;
            case 35:
               var2 = 15;
               break;
            case 42:
               var2 = 16;
               break;
            default:
               int var1;
               if (var0 >= 48 && var0 <= 57) {
                  var1 = var0 - 48 + 17;
               } else {
                  switch (var0) {
                     case 8:
                        var1 = 10;
                        break;
                     case 35:
                        var1 = 15;
                        break;
                     case 42:
                        var1 = 16;
                        break;
                     default:
                        var1 = 0;
                  }
               }

               var2 = var1;
               if (var1 != 0) {
                  var2 = var1;
               } else {
                  try {
                     switch (val_maincanvasbridge_a.getGameAction(var0)) {
                        case 1:
                           var2 = 1;
                           break;
                        case 2:
                           var2 = 3;
                        case 3:
                        case 4:
                        case 7:
                        default:
                           break;
                        case 5:
                           var2 = 4;
                           break;
                        case 6:
                           var2 = 2;
                           break;
                        case 8:
                           var2 = 7;
                     }
                  } catch (Exception var3) {
                  }
               }
         }
      }

      return var2;
   }

   public static void exec_a_int_int_int_int_to_void(int var0, int var1, int var2, int var3) {
      switch (var0) {
         case 0:
            if (val_bool_i) {
               exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
                  var1,
                  var2,
                  0,
                  0,
                  0,
                  0,
                  0,
                  1,
                  0,
                  (byte)2,
                  false,
                  false,
                  false,
                  false,
                  false,
                  false,
                  val_arr_animationset_f[var3],
                  val_spritepartsequence_y,
                  val_arr_animationset_f[var3],
                  val_spritepartsequence_y
               );
            }

            for (int var6 = 0; var6 < val_arr_arr_int_e.length; var6++) {
               exec_a_int_int_int_int_int_int_to_void(var1, var2, val_arr_arr_int_e[var6][0], val_arr_arr_int_e[var6][1], val_arr_arr_int_e[var6][2], var3);
            }
            break;
         case 1:
            for (int var5 = 0; var5 < val_arr_arr_int_g.length; var5++) {
               exec_b_int_int_int_int_int_int_to_void(var1, var2, val_arr_arr_int_g[var5][0], val_arr_arr_int_g[var5][1], val_arr_arr_int_g[var5][2], var3);
            }

            exec_a_int_int_int_int_int_int_to_void(var1, var2, 64, 64, 600, var3);
            exec_a_int_int_int_int_int_int_to_void(var1, var2, 64, 64, 600, var3);
            exec_a_int_int_int_int_int_int_to_void(var1, var2, 64, 64, 600, var3);
            return;
         case 2:
            for (int var4 = 0; var4 < val_arr_arr_int_g.length; var4++) {
               exec_b_int_int_int_int_int_int_to_void(var1, var2, -val_arr_arr_int_g[var4][0], val_arr_arr_int_g[var4][1], val_arr_arr_int_g[var4][2], var3);
            }

            exec_a_int_int_int_int_int_int_to_void(var1, var2, -64, 64, 600, var3);
            exec_a_int_int_int_int_int_int_to_void(var1, var2, -64, 64, 600, var3);
            exec_a_int_int_int_int_int_int_to_void(var1, var2, -64, 64, 600, var3);
      }
   }

   public static void exec_b_bool_to_void(boolean var0) {
      try {
         val_bool_aN = true;
         val_int_eo = 1;
         val_int_ep = 0;
         saveRecordStore = RecordStore.openRecordStore("DataStore", true);
         val_int_en = 0;
         if (var0) {
            for (int var2 = saveRecordStore.getNumRecords() + 1; var2 <= val_int_eo; var2++) {
               saveRecordStore.addRecord(val_arr_byte_m, 0, 0);
            }
         } else if (saveRecordStore.getNumRecords() < val_int_eo) {
            val_bool_aN = false;
            return;
         }

         if ((val_arr_byte_n = saveRecordStore.getRecord(val_int_eo)) == null) {
            val_bool_aN = false;
         } else {
            while (val_int_en < val_arr_byte_n.length && val_arr_byte_n[val_int_en] != val_int_ep) {
               val_int_en = (val_int_en = val_int_en + ((val_arr_byte_n[val_int_en + 1] & 255) << 8 | val_arr_byte_n[val_int_en + 2] & 255)) + 3;
            }

            if (val_int_en < val_arr_byte_n.length) {
               var0 = true;
            } else {
               var0 = false;
            }

            val_bool_aN = var0;
         }
      } catch (Exception var1) {
      }
   }

   public static final void exec_a_int_bool_scenebase_to_void(int var0, boolean var1, SceneBase var2) {
      while (true) {
         switch (var0) {
            case 0:
               return;
            case 11:
               if (!var1) {
                  AudioPlaybackContext var9 = val_globalcontext_a.rootAudioContext;
                  setChannelVolume((short)(val_globalcontext_a.rootAudioContext.volumeLevel + 51), var9);
               }

               return;
            case 12:
               if (!var1) {
                  AudioPlaybackContext var8 = val_globalcontext_a.rootAudioContext;
                  setChannelVolume((short)(val_globalcontext_a.rootAudioContext.volumeLevel - 51), var8);
               }

               return;
            default:
               int var3 = var0;
               if (var2.sceneConfigShorts[var0] != 0) {
                  var3 = var2.sceneConfigShorts[var0];
               }

               int var4 = var3;
               short var5 = var2.sceneConfigShorts[var3];
               short var6 = var2.sceneExtraShorts[var5];
               if (var1) {
                  if (var6 == var0) {
                     var2.sceneExtraShorts[var5] = 0;
                     if (var2.sceneStateId == var0) {
                        var2.sceneStateId = 0;
                     }

                     ((RootGameState)var2).inputManager.handleKeyEvent(var4, false);
                     return;
                  }

                  if (var2.sceneCompleteFlag) {
                     var1 = true;
                     var0 = var6;
                     continue;
                  }
               } else if (var6 != 0) {
                  if (var5 != 0) {
                     var5 = var6;
                     if (var2.sceneConfigShorts[var6] != 0) {
                        var5 = var2.sceneConfigShorts[var6];
                     }

                     if (var5 == var4) {
                        return;
                     }
                  }

                  exec_a_int_bool_scenebase_to_void(var6, true, var2);
                  if (!var2.sceneCompleteFlag) {
                     var1 = false;
                     continue;
                  }
               } else {
                  var2.sceneExtraShorts[var5] = (short)var0;
                  var2.sceneStateId = var0;
                  var2.sceneDuration = Integer.MAX_VALUE;
                  ((RootGameState)var2).inputManager.handleKeyEvent(var3, true);
               }

               return;
         }
      }
   }

   public static void exec_I_to_void() {
      try {
         ByteArrayOutputStream var0;
         var0 = new ByteArrayOutputStream();
         DataOutputStream var4;
         var4 = new DataOutputStream(var0);
         var4.writeByte(val_int_bv);
         var4.writeByte(val_int_bu);
         var4.writeByte(val_int_g);
         var4.writeByte(val_int_bw);
         var4.writeByte(val_int_bx);
         if (val_bool_aa) {
            var4.writeBoolean(true);
            int[][] var1 = val_arr_arr_int_c;
            var4.writeByte(var1.length);

            for (int var2 = 0; var2 < var1.length; var2++) {
               var4.writeByte(var1[var2].length);

               for (int var3 = 0; var3 < var1[var2].length; var3++) {
                  var4.writeInt(var1[var2][var3]);
               }
            }

            var4.writeInt(val_int_bZ);
            var4.writeInt(val_int_ce);
            var4.writeInt(val_int_cu);
            var4.writeInt((int)val_long_g);
         } else {
            var4.writeBoolean(false);
         }

         for (int var10 = 0; var10 < 10; var10++) {
            int var6 = var10;
            byte[] var9 = val_arr_arr_byte_c[var6];

            for (int var7 = 0; var7 < 3; var7++) {
               var4.writeByte(var9[var7]);
            }

            var6 = var10;
            var4.writeInt(val_arr_int_ag[var6]);
         }

         var4.writeBoolean(val_bool_U);
         var4.writeBoolean(val_bool_V);
         byte[] var10000 = val_arr_byte_l = var0.toByteArray();
         exec_a_arr_byte_int_contextservicenode_to_void(var10000, var10000.length, exec_c_to_contextservicenode());
         exec_c_to_contextservicenode();
      } catch (Exception var5) {
      }
   }

   public static void exec_a_arr_arr_int_to_void(int[][] var0) {
      val_arr_arr_int_c = var0;
      val_arr_int_au = new int[var0.length];
      val_arr_int_aw = new int[var0.length];
      val_arr_int_av = new int[var0.length];
      val_int_bY = 0;
      val_int_bW = (val_int_bD - val_arr_int_aB[8] * val_arr_arr_int_c.length) / (val_arr_arr_int_c.length + 1);

      for (int var1 = 0; var1 < var0.length; var1++) {
         val_arr_int_au[var1] = (var0[var1].length - 1) * val_arr_int_aC[8];
         if (val_arr_int_au[var1] > val_int_bY) {
            val_int_bY = val_arr_int_au[var1];
         }

         val_arr_int_av[var1] = (var1 + 1) * val_int_bW + var1 * val_arr_int_aB[7];
         val_arr_int_aw[var1] = (var0[var1].length - 1) * val_arr_int_aC[6];
      }

      val_int_bX = Math.max(val_arr_int_aC[0] + val_int_bY, val_int_bE - val_int_ar);
      val_int_bZ = 1;
      exec_ad_to_void();
   }

   public static SpriteImage[] exec_a_int_arr_int_to_arr_spriteimage(int var0, int[] var1) {
      try {
         PackedResourceStream var2;
         var2 = new PackedResourceStream(var0);
         byte[] var7 = new byte[var2.resourceId];
         var2.read(var7);
         var2.close();
         SpriteImage[] var3 = new SpriteImage[var1.length];

         for (int var8 = 0; var8 < var3.length; var8++) {
            if (var1[var8] == -1) {
               var3[var8] = exec_a_arr_byte_int_int_to_spriteimage(var7, 0, var7.length);
               break;
            }
         }

         for (int var9 = 0; var9 < var3.length; var9++) {
            if (var1[var9] != -1) {
               PackedResourceStream var4;
               var4 = new PackedResourceStream(var1[var9]);
               byte[] var5 = new byte[var4.resourceId];
               var4.read(var5);
               var4.close();
               int var10 = 0;

               while (
                  var10 < var7.length - 4
                     && (
                        var7[var10] != val_arr_byte_d[0]
                           || var7[var10 + 1] != val_arr_byte_d[1]
                           || var7[var10 + 2] != val_arr_byte_d[2]
                           || var7[var10 + 3] != val_arr_byte_d[3]
                     )
               ) {
                  var10++;
               }

               System.arraycopy(var5, 0, var7, var10 + -4, var5.length);
               var3[var9] = exec_a_arr_byte_int_int_to_spriteimage(var7, 0, var7.length);
            }
         }

         return var3;
      } catch (Exception var6) {
         return null;
      }
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static void exec_a_short_short_short_gamemidletloop_to_void(short var0, short var1, short var2, GameMidletLoop var3) {
      if (!var3.isInitialized && !var3.isRunning || var0 == 6) {
         switch (var0) {
            case 5:
               var3.isInitialized = true;
               getGlobalAudioContext();
               var3.isBackgrounded = getGlobalAudioContext().isPlaying;
               getGlobalAudioContext();
               exec_a_bool_to_void(true);
               exec_a_int_featureflag_to_void(0, exec_a_to_contextservicenode().val_featureflag_a);
               long[] var4 = var3.frameHistoryArray;
               synchronized (var3.frameHistoryArray){} // $VF: monitorenter 

               try {
                  var3.loopState = 0;
                  // $VF: monitorexit
                  break;
               } catch (Throwable var9) {
                  Throwable var10 = var9;

                  while (true) {
                     try {
                        // $VF: monitorexit
                        throw var10;
                     } catch (Throwable var8) {
                        var10 = var8;
                     }
                  }
               }
            case 6:
               getGlobalAudioContext();
               getGlobalAudioContext();
               exec_a_bool_to_void(false);
         }

         int var11 = 1;
         long[] var5 = var3.frameHistoryArray;
         synchronized (var3.frameHistoryArray){} // $VF: monitorenter 

         try {
            switch (var0) {
               case 1:
                  if (var3.loopState >= 5) {
                     var11 = 0;
                  }
                  break;
               case 5:
               case 6:
                  if (var3.loopState >= 8) {
                     var11 = 0;
                  }
                  break;
               default:
                  if (var3.loopState >= 6) {
                     var11 = 0;
                  }
            }

            if (var11 != 0) {
               long[] var10000 = var3.frameHistoryArray;
               int var10001 = var3.loopState;
               var11 = var3.loopState + 1;
               var3.loopState = var11;
               var10000[var10001] = (long)var0 << 48 | (long)var1 << 32 & 281470681743360L | (long)var2 << 16 & 4294901760L;
            }

            // $VF: monitorexit
         } catch (Throwable var7) {
            Throwable var12 = var7;

            while (true) {
               try {
                  // $VF: monitorexit
                  throw var12;
               } catch (Throwable var6) {
                  var12 = var6;
               }
            }
         }
      }
   }

   public static String exec_a_string_to_string(String var0) {
      if (val_bool_m) {
         if (var0.startsWith("MG_CATURI_")) {
            if (val_arr_byte_a[1] == 2) {
               return null;
            }
         } else if (var0.startsWith("MG_BUYURI_") && val_arr_byte_a[2] == 2) {
            return null;
         }

         if (var0.equals("MG_Impl")) {
            switch (val_arr_byte_a[0]) {
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
            String var1;
            if ((var1 = exec_b_string_to_string(var0)) == null) {
               return null;
            }

            if (val_arr_byte_a[3] == 0) {
               return "";
            }

            var0 = var1.trim();
            if (val_arr_byte_a[3] != -1) {
               int var2 = -1;
               int var4 = 0;

               while (var4 < val_arr_byte_a[3] && (var2 = var0.indexOf(44, var2 + 1)) != -1) {
                  var4++;
               }

               if (var2 != -1) {
                  var0 = var0.substring(0, var2);
               }
            }

            if (val_arr_byte_a[4] != -1) {
               int var5;
               if ((var5 = var0.indexOf(44, 0)) == -1) {
                  return var0;
               }

               var0 = var0.substring(var5 + 1) + ',' + var0.substring(0, var5);
            }

            return var0;
         }
      }

      return exec_b_string_to_string(var0);
   }

   public static SpriteImage exec_a_int_int_byte_to_spriteimage(int var0, int var1, byte var2) {
      int var3 = var0 & 16777215;
      var0 >>>= 24;
      SpriteImage var8;
      if (val_arr_int_bh[var0] == 0) {
         String var9 = val_arr_string_d[var3];
         var8 = exec_a_string_to_spriteimage("/" + var9);
      } else {
         exec_G_int_to_void(var0);
         int var10001 = 0;
         int var5 = 0;
         int var6 = 0;
         try {
            DataInputStream var4 = new DataInputStream(new ByteArrayInputStream(val_arr_arr_byte_y[var0]));
            var10001 = var4.readInt();
            var4.readInt();
            var4.skipBytes(var3 << 3);
            var5 = var4.readInt();
            var6 = 4 + var10001 + 4 + var4.readInt();
            var4.close();
         } catch (Exception varEx) {}
         byte[] var11 = null;
         byte[] var10 = null;
         if (var1 != -1 || var2 != 0) {
            var11 = exec_a_arr_byte_int_int_to_arr_byte(val_arr_arr_byte_y[var0], var6, var5);
         }

         if (var1 != -1) {
            var10 = loadResourceBytes(var1);
         }

         if (var2 != 0) {
            if (var10 == null) {
               var10 = new byte[var11.length];
               System.arraycopy(var11, 0, var10, 0, var11.length);
            }

            exec_a_arr_byte_byte_to_void(var10, var2);
         }

         if (var10 != null) {
            copyByteArray(val_arr_arr_byte_y[var0], var6, var5, var10);
         }

         var8 = exec_a_arr_byte_int_int_to_spriteimage(val_arr_arr_byte_y[var0], var6, var5);
         if (var11 != null) {
            copyByteArray(val_arr_arr_byte_y[var0], var6, var5, var11);
         }

         val_int_er = var6;
         val_int_es = var5;
         val_int_et = var0;
         val_arr_byte_p = var10;
      }

      return var8;
   }

   public static EncodedTextBuffer exec_a_int_encodedtextbuffer_to_encodedtextbuffer(int var0, EncodedTextBuffer var1) {
      FontCharmap var2 = exec_a_to_fontcharmap();
      int var3 = -1;
      short var4 = 0;

      for (int var5 = 0; var5 < var2.val_byte_b; var5++) {
         var4 += var2.val_arr_short_a[var5];
         if (var0 < var4) {
            var3 = var5;
            break;
         }
      }

      int var7 = var0 - (var4 - var2.val_arr_short_a[var3]);
      byte var6 = var2.val_arr_byte_c[var3];
      if (var1 == null) {
         var1 = new EncodedTextBuffer();
      } else if ((var1.flagsByte & 64) != 0) {
         var1.textBytes = null;
         var1.textBytes = null;
      }

      var1.textBytes = var2.val_arr_arr_byte_b[var6];
      var1.textLength = var2.val_arr_arr_short_b[var6][var7] & '\uffff';
      var1.bufferCapacity = (var2.val_arr_arr_short_b[var6][var7 + 1] & '\uffff') - (var2.val_arr_arr_short_b[var6][var7] & '\uffff');
      byte var8 = var2.val_arr_byte_a[var2.val_byte_d];
      if ((var2.val_arr_byte_b[var3] & -63) != 0) {
         var8 = 0;
      }

      if (var8 == 0) {
         var1.bufferCapacity = (short)(var1.bufferCapacity >> 1);
      }

      var1.flagsByte = var8;
      var1.encodingType = var1.bufferCapacity;
      return var1;
   }

   public static SpritePartSequence exec_a_int_int_to_spritepartsequence(int var0, int var1) {
      try {
         DataInputStream var7;
         var0 = (var7 = openResourceStream(var0)).readUnsignedByte();
         int var2 = var7.readUnsignedByte();
         SpritePartSequence var8;
         var8 = new SpritePartSequence(var2, var7.readUnsignedByte(), var1, var0);
         int var9 = 0;

         for (int var10 = 0; var10 < var2; var10++) {
            short var15 = var7.readShort();
            var0 = var7.readUnsignedByte();

            for (int var3 = 0; var3 < var0; var3++) {
               int var10000 = var7.readUnsignedByte();
               short var4 = var7.readShort();
               short var5 = var7.readShort();
               int var11 = var10;
               short var12 = (short)var10000;
               int var6;
               var8.frameOffsets[var6 = var9 * 3] = var12;
               var8.frameOffsets[++var6] = (short)var4;
               var8.frameOffsets[var6 + 1] = (short)var5;
               if (var8.frameDurations != null) {
                  var8.frameDurations[var10] = (byte)var9;
               }

               if (var8.partOffsets[var11] == 0) {
                  short[] var18 = var8.partOffsets;
                  if (var11 == 0) {
                     var6 = var15;
                  } else {
                     var6 = var8.partOffsets[var11 - 1] + var15;
                  }

                  var18[var11] = (short)var6;
                  var8.sequenceFlags += var15;
               }

               var9++;
            }
         }

         var7.close();
         return var8;
      } catch (Exception varEx) {
         return null;
      }
   }

   public static byte[] exec_b_string_to_arr_byte(String var0) {
      String var2 = "/" + var0;
      InputStream var3 = System.out.getClass().getResourceAsStream(var2);
      GrowableByteBuffer var4;
      var4 = new GrowableByteBuffer();

      int var9 = -1;
      try {
         var9 = var3.read();
      } catch (Exception var8) {
         var9 = -1;
      }

      while (var9 != -1) {
         byte var10 = (byte)var9;
         int var5 = var4.byteCount;
         int var6;
         int var1 = var6 = var4.byteCount + 1;
         int var12;
         if (var4.bufferData == null) {
            var12 = 0;
         } else {
            var12 = var4.bufferData.length;
         }

         if (var12 < var6) {
            if (var6 - var12 < var4.maxCapacity) {
               var1 = var12 + var4.maxCapacity;
            }

            byte[] var13 = new byte[var1];

            for (int var11 = 0; var11 < var4.byteCount; var11++) {
               var13[var11] = var4.bufferData[var11];
            }

            var4.bufferData = var13;
         }

         var4.bufferData[var5] = var10;
         var4.byteCount = var6;

         try {
            var9 = var3.read();
         } catch (Exception var7) {
            var9 = -1;
         }
      }

      byte[] var15 = new byte[var4.byteCount];

      for (int var14 = 0; var14 < var4.byteCount; var14++) {
         var15[var14] = var4.bufferData[var14];
      }

      return var15;
   }

   public static void exec_a_entityinterface_int_int_to_void(EntityInterface var0, int var1, int var2) {
      int[] var10000 = val_arr_int_bm = var0.getBounds();
      int var3 = var10000[0] + var1;
      var10000[0] = var3;
      var3 = val_arr_int_bm[1] + var2;
      val_arr_int_bm[1] = var3;
      if (val_arr_int_bm[7] != 0) {
         var3 = val_arr_int_bm[8] + var1;
         val_arr_int_bm[8] = var3;
         var3 = val_arr_int_bm[9] + var2;
         val_arr_int_bm[9] = var3;
      }

      if (val_arr_int_bm[1] > 0) {
         var0.applyAction(8);
         val_arr_int_bm[1] = 0;
      } else if (val_arr_int_bm[1] < val_int_eF) {
         var0.applyAction(1);
         val_arr_int_bm[1] = val_int_eF;
      }

      if (val_arr_int_bm[0] < val_int_eG) {
         var0.applyAction(2);
         val_arr_int_bm[0] = val_int_eG;
      } else {
         if (val_arr_int_bm[0] > val_int_eH) {
            var0.applyAction(4);
            val_arr_int_bm[0] = val_int_eH;
         }
      }
   }

   public static void exec_a_arr_int_bool_to_void(int[] var0, boolean var1) {
      exec_b_byte_to_void((byte)4);
      val_int_aE = var0[0];
      val_bool_I = (boolean)var1;
      val_byte_h = 1;
      byte var_b = (byte)(val_int_aF > 0 ? 4 : 0);
      val_byte_i = var_b;
      val_int_aH = 1;
      val_arr_encodedtextbuffer_a = new EncodedTextBuffer[val_int_aG = val_int_p];
      val_arr_int_u = new int[val_int_aG];
      val_encodedtextbuffer_d = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0[1], null);
      boolean var3;
      if (val_int_aG > val_arr_int_O[val_int_aH]) {
         var3 = true;
      } else {
         var3 = false;
      }

      val_bool_J = var3;
      if (var3) {
         val_arr_int_t = new int[3];
      } else {
         val_arr_int_t = new int[val_int_aG];
      }

      exec_L_to_void();
      val_int_aD = 0;

      for (int var4 = 0; var4 < val_int_aG; var4++) {
         val_arr_encodedtextbuffer_a[var4] = exec_a_int_int_to_encodedtextbuffer(var4, 0);
         val_arr_int_u[var4] = exec_a_encodedtextbuffer_to_int(val_arr_encodedtextbuffer_a[var4]);
      }

      exec_e_int_to_void(0);
   }

   public static void exec_x_int_to_void(int var0) {
      val_arr_byte_j[val_int_bp] = (byte)var0;
      if (val_arr_byte_j[val_int_bp] > val_arr_short_a.length - 1) {
         val_arr_byte_j[val_int_bp] = 0;
      }

      if (val_arr_byte_j[val_int_bp] < 0) {
         val_arr_byte_j[val_int_bp] = (byte)(val_arr_short_a.length - 1);
      }

      val_arr_encodedtextbuffer_e[val_int_bp].setCharAt(0, (char)val_arr_short_a[val_arr_byte_j[val_int_bp]]);
      boolean var1 = true;

      for (int var2 = 0; var2 < 3; var2++) {
         if (val_arr_byte_j[var2] != val_arr_byte_i[var2]) {
            var1 = false;
         }
      }

      if (!var1) {
         var1 = true;
      } else {
         var1 = false;
      }

      val_bool_Q = var1;
   }

   // $VF: Handled exception range with multiple entry points by splitting it
   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static final void assignClipToChannel(AudioClipNode var0, AudioPlaybackContext var1) {
      var1 = var1.nextContext;
      AudioPlaybackContext var2;
      synchronized (var2 = getGlobalAudioContext()){} // $VF: monitorenter 

      Throwable var9 = null;
      label65: {
         label64: {
            try {
               if (var1.val_audioclipnode_b == null) {
                  break label64;
               }

               if (isChannelActive(var1) || isChannelBusy(var1) && !val_globalcontext_a.currentScene.isSceneActive) {
                  pauseAudioChannel(var1);
               }

               if (var1.activeClipNode == var0 && var1.val_audioclipnode_b.mediaPlayer != null) {
                  // $VF: monitorexit
                  return;
               }
            } catch (Throwable var6) {
               var9 = var6;
               break label65;
            }

            try {
               if (getClipDuration(var1.val_audioclipnode_b) != 300 && var1.val_audioclipnode_b.mediaPlayer != null) {
                  freeAudioClip(var1.val_audioclipnode_b);
               }
            } catch (Throwable var5) {
               var9 = var5;
               break label65;
            }
         }

         try {
            var1.activeClipNode = var0;
            var1.playbackPosition = 0;
            if (var1.activeClipNode != null) {
               var0 = var0.nextClip;
               var1.val_audioclipnode_b = var0;
               if (var0.mediaPlayer == null) {
                  isClipPlayable(var0);
               }

               exec_a_bool_audioplaybackcontext_to_void(var1.isPlaying, var1);
            } else {
               var1.val_audioclipnode_b = null;
            }

            // $VF: monitorexit
            return;
         } catch (Throwable var4) {
            var9 = var4;
         }
      }

      while (true) {
         try {
            // $VF: monitorexit
            throw var9;
         } catch (Throwable var3) {
            var9 = var3;
         }
      }
   }

   public static void exec_a_arr_byte_byte_to_void(byte[] var0, byte var1) {
      for (byte var2 = 0; var2 < var0.length - 3; var2 += 3) {
         int var3 = var0[var2] & 255;
         int var4 = var0[var2 + 1] & 255;
         int var5 = var0[var2 + 2] & 255;
         switch (var1) {
            case 1:
               var3 = var3 * 5 / 10;
               var4 = var4 * 5 / 10;
               var5 = var5 * 5 / 10;
               break;
            case 2:
               var3 = Math.min(255, (var3 << 4) / 10);
               var4 = Math.min(255, (var4 << 4) / 10);
               var5 = Math.min(255, (var5 << 4) / 10);
               break;
            case 3:
               var4 = var3 * 7 / 10;
               var3 = (var3 << 2) / 10;
         }

         var0[var2] = (byte)var3;
         var0[var2 + 1] = (byte)var4;
         var0[var2 + 2] = (byte)var5;
      }
   }

   public static boolean exec_c_int_to_bool(int var0) {
      FontCharmap var1;
      byte var2 = (var1 = exec_a_to_fontcharmap()).val_byte_d;
      if (var1.val_arr_arr_byte_a != null && var0 >= 0 && var0 < var1.val_byte_e) {
         var1.val_byte_d = (byte)var0;
      }

      if (var1.val_byte_d != var2) {
         var1.val_bool_b = true;

         for (int var3 = 1; var3 < var1.val_byte_b; var3++) {
            if (exec_e_int_to_bool(var3) && (var1.val_arr_byte_b[var3] & 64) == 0) {
               exec_h_int_to_int(var3);
            }
         }

         var1.val_bool_b = false;
         if (var1.val_arr_byte_a[var1.val_byte_d] != var1.val_arr_byte_a[var2] && var1.val_arr_byte_a[var1.val_byte_d] > 1) {
            var1.setFontStyle(var1.val_arr_byte_a[var1.val_byte_d]);
         }
      }

      boolean var4;
      if (var1.val_byte_d == var0) {
         var4 = true;
      } else {
         var4 = false;
      }

      return var4;
   }

   public static void exec_a_byte_bool_to_void(byte var0, boolean var1) {
      if (var0 != -1) {
         if ((var0 = AudioMetaTable.val_arr_byte_a[var0]) != -1) {
            if (AudioMetaTable.val_arr_int_a[var0] != -1) {
               if (val_int_bv == 2 || var1 && val_int_bv == 0) {
                  if (val_thread_a != null) {
                     if (val_thread_a.isAlive()) {
                        if (AudioMetaTable.val_arr_byte_c[var0] == 1) {
                           return;
                        }

                        try {
                           val_thread_a.join();
                        } catch (Exception var2) {
                        }
                     }

                     val_thread_a = null;
                     val_bool_H = false;
                     val_int_aA = 0;
                  }

                  if (AudioMetaTable.val_arr_byte_b[var0] == 1) {
                     exec_f_byte_to_void(var0);
                     return;
                  }

                  val_bool_H = true;
                  (val_thread_a = new AsyncWorkerThread(var0)).setPriority(10);
                  val_thread_a.start();
               }
            }
         }
      }
   }

   public static void exec_e_int_to_void(int var0) {
      val_int_aD = var0;
      if (var0 >= val_int_aG) {
         val_int_aD = 0;
      }

      if (val_int_aD < 0) {
         val_int_aD = val_int_aG - 1;
      }

      if (val_bool_J) {
         int[] var2 = val_arr_int_t;
         int var4;
         if (val_int_aD > 0) {
            var4 = val_int_aD - 1;
         } else {
            var4 = val_int_aG - 1;
         }

         var2[0] = var4;
         val_arr_int_t[1] = val_int_aD;
         int[] var5 = val_arr_int_t;
         if (val_int_aD < val_int_aG - 1) {
            var0 = val_int_aD + 1;
         } else {
            var0 = 0;
         }

         var5[2] = var0;
      } else {
         int var1 = 0;

         while (var1 < val_int_aG) {
            val_arr_int_t[var1] = var1++;
         }
      }
   }

   public static void exec_g_to_void() {
      for (byte var0 = 0; var0 < 16; var0++) {
         if (AudioMetaTable.val_arr_byte_d[var0] != -1 && AudioMetaTable.val_arr_int_c[AudioMetaTable.val_arr_byte_d[var0]] != -1) {
            try {
               val_audiomanager_a.unloadClip(AudioMetaTable.val_arr_int_c[AudioMetaTable.val_arr_byte_d[var0]]);
            } catch (Exception var2) {
            }
         }
      }

      for (byte var3 = 0; var3 < 55; var3++) {
         if (AudioMetaTable.val_arr_byte_a[var3] != -1 && AudioMetaTable.val_arr_int_a[AudioMetaTable.val_arr_byte_a[var3]] != -1) {
            try {
               val_audiomanager_a.unloadClip(AudioMetaTable.val_arr_int_a[AudioMetaTable.val_arr_byte_a[var3]]);
            } catch (Exception var1) {
            }
         }
      }
   }

   public static void exec_b_byte_bool_to_void(byte var0, boolean var1) {
      if (var0 != -1) {
         if ((var0 = AudioMetaTable.val_arr_byte_d[var0]) != -1) {
            if (AudioMetaTable.val_arr_int_c[var0] != -1) {
               if (val_int_bv == 0 || var1 && val_int_bv == 2) {
                  if (var0 != val_byte_f || AudioMetaTable.val_arr_byte_e[var0] != 0) {
                     exec_l_to_void();
                     val_byte_f = var0;

                     try {
                        if (AudioMetaTable.val_arr_byte_e[var0] == 0) {
                           val_audiomanager_a.setLooping(-1);
                        } else {
                           val_audiomanager_a.setLooping(1);
                        }

                        val_audiomanager_a.currentSoundId = 0;
                        val_audiomanager_a.playSound(AudioMetaTable.val_arr_int_c[var0]);
                     } catch (Throwable var2) {
                     }
                  }
               }
            }
         }
      }
   }

   public static int exec_c_int_to_int(int var0) {
      if (var0 >= 48 && var0 <= 57) {
         return var0 - 48 + 17;
      }

      switch (var0) {
         case 0:
            return 0;
         case 35:
            return 15;
         case 42:
            return 16;
         default:
            int var1;
            if (var0 >= 48 && var0 <= 57) {
               var1 = var0 - 48 + 17;
            } else {
               switch (var0) {
                  case 8:
                     var1 = 10;
                     break;
                  case 35:
                     var1 = 15;
                     break;
                  case 42:
                     var1 = 16;
                     break;
                  default:
                     var1 = 0;
               }
            }

            int var2 = var1;
            if (var1 != 0) {
               return var1;
            } else {
               try {
                  switch (val_maincanvasbridge_a.getGameAction(var0)) {
                     case 1:
                        var2 = 1;
                        break;
                     case 2:
                        var2 = 3;
                     case 3:
                     case 4:
                     case 7:
                     default:
                        break;
                     case 5:
                        var2 = 4;
                        break;
                     case 6:
                        var2 = 2;
                        break;
                     case 8:
                        var2 = 7;
                  }
               } catch (Exception var3) {
               }

               return var2;
            }
      }
   }

   public static void exec_J_to_void() {
      val_int_aZ = val_int_aZ + val_int_e;
      val_bool_M = val_bool_ar;
      val_bool_N = val_bool_as;
      if (val_int_aZ > 100) {
         if (val_bool_N) {
            if (val_int_aS < val_int_aT) {
               val_int_aS++;
            }

            val_int_aZ = 1;
         }

         if (val_bool_M) {
            if (val_int_aS > 1) {
               val_int_aS--;
            }

            val_int_aZ = 0;
         }
      }

      boolean var0;
      if (val_int_aS > 1) {
         var0 = true;
      } else {
         var0 = false;
      }

      val_bool_K = var0;
      if (val_int_aS < val_int_aT) {
         var0 = true;
      } else {
         var0 = false;
      }

      val_bool_L = var0;
   }

   public static int exec_a_arr_byte_int_to_int(byte[] var0, int var1) {
      int var2 = 9;

      for (int var3 = 9; var3 >= 0; var3--) {
         if (var1 > val_arr_int_ag[var3]) {
            var2 = var3;
         }
      }

      for (int var6 = 9; var6 > var2; var6--) {
         int var7 = var6;
         int var8 = var6 - 1;
         byte[] var4 = new byte[3];

         for (int var5 = 0; var5 < 3; var5++) {
            var4[var5] = val_arr_arr_byte_c[var8][var5];
         }

         exec_a_int_arr_byte_to_void(var7, var4);
         val_arr_int_ag[var6] = val_arr_int_ag[var6 - 1];
      }

      exec_a_int_arr_byte_to_void(var2, var0);
      val_arr_int_ag[var2] = var1;
      return var2;
   }

   public static int[] exec_a_int_to_arr_int(int var0) {
      int var1 = val_arr_int_j[var0];
      int[] var2 = val_arr_int_i;
      int var3 = 0;

      for (int var4 = 0; var4 < val_int_al; var4++) {
         if (var2[var4] >= var0 && var4 > 0 && var2[var4 - 1] < var0) {
            var3 = var4;
            break;
         }
      }

      int var7 = 0;
      if (var0 == var2[var3]) {
         var7 = val_arr_arr_int_a[var3][0] - var1;
      } else {
         int var5;
         if ((var5 = var0 + 1) < val_int_an) {
            var7 = val_arr_int_j[var5] - var1;
         }
      }

      (var2 = new int[4])[0] = var3;
      var2[1] = var1;
      var2[2] = var7;
      var2[3] = 0;
      return var2;
   }

   public static String exec_a_arr_byte_to_string(byte[] var0) {
      String var1 = "";

      for (int var2 = 0; var2 < var0.length; var2++) {
         if (var2 > 0) {
            var1 = var1 + "-";
         }

         StringBuffer var4 = new StringBuffer().append(var1);
         byte var10000 = var0[var2];
         EncodedTextBuffer var3;
         var3 = new EncodedTextBuffer("");
         switch (var10000) {
            case 0:
               exec_a_int_encodedtextbuffer_to_encodedtextbuffer(96, var3);
               break;
            case 1:
               exec_a_int_encodedtextbuffer_to_encodedtextbuffer(98, var3);
               break;
            case 2:
               exec_a_int_encodedtextbuffer_to_encodedtextbuffer(96, var3);
               break;
            case 3:
               exec_a_int_encodedtextbuffer_to_encodedtextbuffer(100, var3);
            case 4:
            case 5:
            case 6:
            default:
               break;
            case 7:
               exec_a_int_encodedtextbuffer_to_encodedtextbuffer(88, var3);
               break;
            case 8:
               exec_a_int_encodedtextbuffer_to_encodedtextbuffer(92, var3);
               break;
            case 9:
               exec_a_int_encodedtextbuffer_to_encodedtextbuffer(90, var3);
         }

         var1 = var4.append(var3).toString();
      }

      return var1;
   }

   public static EncodedTextBuffer exec_a_int_int_to_encodedtextbuffer(int var0, int var1) {
      FontCharmap var2 = exec_a_to_fontcharmap();
      if (var1 >= var2.val_arr_short_a[0]) {
         return null;
      }

      var1 += (var2.val_arr_short_a[0] + 1) * var0;
      EncodedTextBuffer var3;
      var3 = new EncodedTextBuffer();
      var3.textBytes = var2.val_arr_arr_byte_b[0];
      var3.textLength = var2.val_arr_arr_short_b[0][var1];
      var3.bufferCapacity = var2.val_arr_arr_short_b[0][var1 + 1] - var2.val_arr_arr_short_b[0][var1] >> 1;
      var3.encodingType = var3.bufferCapacity;
      var3.flagsByte = 0;
      return var3;
   }

   public static void exec_a_byte_to_void(byte var0) {
      byte var1 = ResourceSlotTable.val_arr_byte_a[var0];
      if (val_arr_object_a[var1] == null) {
         switch (ResourceSlotTable.val_arr_arr_int_a[var1][0]) {
            case 0:
               byte[] var2 = exec_a_int_to_arr_byte(ResourceSlotTable.val_arr_arr_int_a[var1][1]);
               if (ResourceSlotTable.val_arr_arr_int_a[var1][3] == -1) {
                  val_arr_object_a[var1] = exec_a_spriteimage_arr_byte_to_object(exec_a_int_to_spriteimage(ResourceSlotTable.val_arr_arr_int_a[var1][2]), var2);
                  return;
               }

               int var10002 = ResourceSlotTable.val_arr_arr_int_a[var1][2];
               int var3 = ResourceSlotTable.val_arr_arr_int_a[var1][3];
               val_arr_object_a[var1] = exec_a_spriteimage_arr_byte_to_object(exec_a_int_arr_int_to_arr_spriteimage(var10002, new int[]{var3})[0], var2);
         }
      }
   }

   public static DataInputStream openResourceStream(int var0) {
      int var1 = var0 & 16777215;
      int var2 = var0 >>> 24;
      int var3 = val_arr_int_bh[var2];
      DataInputStream var4 = null;
      if (var3 == 0) {
         var4 = openResourceStreamByName(val_arr_string_d[var1]);
      } else if (var3 == 1) {
         exec_G_int_to_void(var2);
         DataInputStream var6;
         var6 = new DataInputStream(new ByteArrayInputStream(val_arr_arr_byte_y[var2]));
         var4 = var6;
         try {
            int var10002 = var6.readInt();
            var6.readInt();
            var6.skipBytes(var1 << 3);
            val_int_eq = var6.readInt();
            var2 = var6.readInt();
            var6.reset();
            var6.skipBytes(4 + var10002 + 4 + var2);
         } catch (Exception varEx) {}
      }

      return var4;
   }

   public static final boolean exec_a_tokenstring_to_bool(TokenString var0) {
      boolean var1;
      if (var0.tokenShortArray[0] == 0) {
         var1 = true;
      } else {
         var1 = false;
      }

      boolean var3;
      if (var1) {
         var3 = false;
      } else {
         String var4 = exec_a_tokenstring_to_string(var0);
         GameMidletLoop var5 = val_gamemidletloop_a;
         var1 = false;
         TokenString var10000 = exec_a_string_to_tokenstring("Browser-Launch-Enabled");
         TokenWrapper var6;
         var6 = new TokenWrapper();
         String var11 = exec_a_tokenstring_to_string(var10000);
         var0 = var6.wrappedToken;
         var10000 = exec_a_string_to_tokenstring(exec_c_string_to_string(var11));
         short[] var2 = var10000.tokenShortArray;
         int var3_len = exec_a_arr_short_to_int(var10000.tokenShortArray);
         exec_a_arr_short_int_tokenstring_to_void(var2, var3_len, var0);
         exec_a_tokenstring_to_string(var6.wrappedToken);

         try {
            var5.isTerminated = true;
            var5.gameVersionString = var4;
            exec_b_gamemidletloop_to_void(var5);
            var1 = true;
         } catch (Throwable var7) {
         }

         var3 = var1;
      }

      return (boolean)var3;
   }

   public static void exec_b_effectactor_to_void(EffectActor var0) {
      if (var0.effectCoordinates[2] <= 0) {
         int var10000 = var0.effectCoordinates[0] >> 8;
         int var1 = var0.effectCoordinates[1] >> 8;
         int var2 = var10000 - val_int_eO;
         var1 -= exec_k_to_int();
         switch (var0.effectAccelerationX) {
            case 1:
               if (var0.val_animationset_a != null && var0.val_spritepartsequence_a != null) {
                  var0.val_spritepartsequence_a.drawSequence(var0.effectRotation, var0.val_animationset_a, var2, var1, 0);
               }
               break;
            case 2:
               if (var0.val_animationset_b != null && var0.val_spritepartsequence_b != null) {
                  var0.val_spritepartsequence_b.drawSequence(var0.effectRotation, var0.val_animationset_b, var2, var1, 0);
                  return;
               }
         }
      }
   }

   public static void exec_b_coreengine_to_void(CoreEngine var0) {
      var0.actorCounterC = 0;
      var0.actorCounterB = 0;
      if (var0 == val_coreengine_b) {
         val_bool_ay = true;
      } else if (var0 == val_coreengine_c) {
         val_bool_az = true;
      }

      if (var0.actorTimerT >= 2) {
         if (val_int_dL == 2) {
            CoreEngine var1;
            if (var0 == val_coreengine_b) {
               var1 = val_coreengine_c;
            } else {
               var1 = val_coreengine_b;
            }

            byte var4;
            if (var1 == val_coreengine_b) {
               var4 = 0;
            } else {
               var4 = 1;
            }

            int var3 = var0.actorTimerU;
            int var2 = var0.actorTimerT;
            byte var5 = var4;
            exec_b_byte_to_void((byte)4);
            val_arr_int_aG[var5] = 1;
            val_arr_encodedtextbuffer_f[var5] = val_encodedtextbuffer_s.substring(var2);
            val_arr_encodedtextbuffer_g[var5] = val_encodedtextbuffer_t.substring(var3);
            var3 = 16
               + Math.max(
                  exec_a_encodedtextbuffer_to_int(val_arr_encodedtextbuffer_f[var5]), exec_a_encodedtextbuffer_to_int(val_arr_encodedtextbuffer_g[var5])
               );
            switch (var5) {
               case 0:
                  val_arr_int_aH[0] = 0;
                  val_arr_int_aK[0] = 0;
                  val_arr_int_aI[0] = val_arr_int_aH[0] + var3;
                  val_arr_int_aL[0] = val_arr_int_aK[0] + var3;
                  break;
               default:
                  val_arr_int_aH[1] = val_int_bA;
                  val_arr_int_aK[1] = val_int_bA;
                  val_arr_int_aI[1] = val_arr_int_aH[1] - var3;
                  val_arr_int_aL[1] = val_arr_int_aK[1] - var3;
            }

            val_arr_int_aJ[var5] = val_arr_int_aH[var5];
            val_arr_int_aM[var5] = val_arr_int_aK[var5];
            val_arr_int_aN[var5] = 0;
            val_int_dE = (val_int_dD = val_int_dx + val_int_dv + 8) + exec_c_to_int();
         } else {
            var0.actorTimerT = 0;
            var0.actorTimerU = 0;
         }
      }

      var0.actorTimerT = 0;
      var0.actorTimerU = 0;
   }

   public static void exec_y_int_to_void(int var0) {
      val_int_ce = var0;
      if (var0 >= val_arr_arr_int_c[val_int_bZ].length - 1) {
         val_int_ce = val_arr_arr_int_c[val_int_bZ].length - 1 - 1;
      }

      if (val_int_ce < 0) {
         val_int_ce = 0;
      }

      if (val_int_ce > 0) {
         val_int_cm = 0;
         val_int_cd = val_int_cl = val_arr_int_aC[6];
      } else {
         val_int_cm = 1000;
         val_int_cl = 0;
         val_int_cd = 0;
      }
   }

   public static void exec_d_byte_to_void(byte var0) {
      if (val_arr_byte_c[var0] == 0) {
         val_spritepartsequence_g.drawSequence(val_int_ae, val_animationset_h, 0, val_int_o, 0);
         val_arr_spritepartsequence_b[var0].drawSequence(val_int_ae, val_animationset_h, val_int_af, val_int_ah, 0);
      } else {
         val_spritepartsequence_h.drawSequence(val_int_ae, val_animationset_h, val_int_n, val_int_o, 0);
         val_arr_spritepartsequence_b[var0].drawSequence(val_int_ae, val_animationset_h, val_int_ag, val_int_ah, 0);
      }
   }

   public static void exec_a_entityinterface_int_to_void(EntityInterface var0, int var1) {
      for (int var2 = 0; var2 < val_arr_int_bk[var1]; var2++) {
         if (val_arr_arr_entityinterface_a[var1][var2].equals(var0)) {
            for (int var3 = var2; var3 < val_arr_int_bk[var1] - 1; var3++) {
               val_arr_arr_entityinterface_a[var1][var3] = val_arr_arr_entityinterface_a[var1][var3 + 1];
            }

            int var4 = val_arr_int_bk[var1] - 1;
            val_arr_int_bk[var1] = var4;
         }
      }
   }

   public static void exec_f_int_int_to_void(int var0, int var1) {
      for (int var2 = 0; var2 < val_arr_spritepartsequence_k.length; var2++) {
         int var3 = exec_a_int_int_to_int(0, 8);
         int var4;
         int var5 = (var4 = exec_a_int_int_to_int(160, 220)) * 7;
         int var6;
         if ((var6 = exec_a_int_int_to_int(0, 1)) > 0) {
            var3 += 8;
         } else {
            var3 = -var3 - 8;
         }

         byte var8;
         if (var6 > 0) {
            var8 = 32;
         } else {
            var8 = -32;
         }

         exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
            var0,
            var1,
            var3 + var8,
            var4,
            var5,
            var2 * 100,
            5,
            2,
            0,
            (byte)0,
            true,
            false,
            false,
            false,
            true,
            false,
            val_animationset_x,
            val_arr_spritepartsequence_k[var2],
            val_animationset_x,
            val_arr_spritepartsequence_k[var2]
         );
      }
   }

   public static void exec_a_bool_bool_bool_bool_int_int_int_int_bool_to_void(
      boolean var0, boolean var1, boolean var2, boolean var3, int var4, int var5, int var6, int var7, boolean var8
   ) {
      if (var0) {
         if (var1) {
            if (var8) {
               exec_a_int_int_int_to_void(2, var4, var5);
            } else {
               exec_b_int_int_int_to_void(8, var4, var5);
            }
         } else if (var8) {
            exec_a_int_int_int_to_void(1, var4, var5);
         } else {
            exec_b_int_int_int_to_void(7, var4, var5);
         }
      }

      if (var2) {
         if (var3) {
            if (var8) {
               exec_a_int_int_int_to_void(4, var6, var7);
               return;
            }

            exec_b_int_int_int_to_void(10, var6, var7);
            return;
         }

         if (var8) {
            exec_a_int_int_int_to_void(3, var6, var7);
            return;
         }

         exec_b_int_int_int_to_void(9, var6, var7);
      }
   }

   public static AnimationSet exec_a_int_arr_int_arr_byte_bool_to_animationset(int var0, int[] var1, byte[] var2, boolean var3) {
      DataInputStream var6 = openResourceStream(var0);
      int var7 = 0;
      long[] var10 = null;
      byte[] var9 = null;
      byte[] var19 = null;
      try {
         var7 = exec_a_datainputstream_to_int(var6);
         int var4;
         var10 = new long[var4 = var6.readUnsignedByte()];

         for (int var5 = 0; var5 < var4; var5++) {
            var10[var5] = var6.readLong();
         }

         int var8;
         var9 = new byte[var8 = var6.readUnsignedByte()];
         var19 = new byte[var8];

         for (int var16 = 0; var16 < var8; var16++) {
            var9[var16] = (byte)var6.readUnsignedByte();
            var19[var16] = (byte)var6.readUnsignedByte();
         }

         var6.close();
      } catch (Exception varEx) {}
      boolean var22 = (boolean)var3;
      byte[] var20 = var2;
      int[] var17 = var1;
      byte[] var14 = var19;
      var2 = var9;
      long[] var12 = var10;
      var0 = var7;
      AnimationSet var26;
      var26 = new AnimationSet();
      var26.totalAnimFrames = var17.length;
      var26.spriteImages = new SpriteImage[var26.totalAnimFrames];
      var26.frameDelayArray = var17;
      var26.animConfigBytes = var20;
      var26.animFrameCount = 0;
      var26.spriteImages[var26.animFrameCount] = exec_a_int_int_byte_to_spriteimage(var0, var17[var26.animFrameCount], var20[var26.animFrameCount]);
      var26.isLoaded = var22;
      if (var26.isLoaded && var26.totalAnimFrames > 1) {
         var26.partCountArray = new byte[val_int_es];
         System.arraycopy(val_arr_arr_byte_y[val_int_et], val_int_er, var26.partCountArray, 0, val_int_es);
         var26.spriteIndexMatrix = new byte[var26.totalAnimFrames][0];
         if (val_arr_byte_p != null) {
            var26.spriteIndexMatrix[var26.animFrameCount] = new byte[val_arr_byte_p.length];

            for (int var23 = 0; var23 < val_arr_byte_p.length; var23++) {
               var26.spriteIndexMatrix[var26.animFrameCount][var23] = val_arr_byte_p[var23];
            }
         } else {
            var26.spriteIndexMatrix[var26.animFrameCount] = exec_a_arr_byte_int_int_to_arr_byte(var26.partCountArray, 0, val_int_es);
         }
      }

      var26.animPriorityBytes = var2;
      var26.val_arr_long_a = var12;
      var26.animDurationArray = new int[var14.length];
      var26.currentFrameIndex = var0;

      for (int var24 = 0; var24 < var14.length; var24++) {
         var26.animDurationArray[var24] = val_arr_int_a[var14[var24]];
      }

      for (int var25 = 1; var25 < var26.totalAnimFrames; var25++) {
         byte var21 = var26.animConfigBytes[var25];
         int var4 = var26.frameDelayArray[var25];
         int var3_idx = var25;
         var26.frameDelayArray[var25] = var4;
         var26.animConfigBytes[var25] = var21;
         if (var26.isLoaded) {
            if (var4 != -1) {
               var26.spriteIndexMatrix[var25] = loadResourceBytes(var4);
            } else {
               var26.spriteIndexMatrix[var25] = new byte[var26.spriteIndexMatrix[0].length];
               System.arraycopy(var26.spriteIndexMatrix[0], 0, var26.spriteIndexMatrix[var25], 0, var26.spriteIndexMatrix[0].length);
            }

            if (var21 != 0) {
               exec_a_arr_byte_byte_to_void(var26.spriteIndexMatrix[var3_idx], var21);
            }
         } else {
            var26.spriteImages[var25] = exec_a_int_int_byte_to_spriteimage(var26.currentFrameIndex, var4, var21);
         }
      }

      return var26;
   }

   public static byte exec_a_arr_string_to_byte(String[] var0) {
      byte var1 = -1;
      String var2;
      if ((var2 = System.getProperty("microedition.locale")) != null) {
         String var3;
         int var4;
         if ((var4 = (var3 = var2.toLowerCase().trim()).length()) < 2) {
            return -1;
         }

         for (int var5 = 0; var5 < var0.length; var5++) {
            if (var0[var5].length() > var4 && var0[var5].startsWith(var3)) {
               var1 = -1;
               break;
            }

            if (var3.startsWith(var0[var5])) {
               var1 = (byte)var5;
               break;
            }
         }
      }

      return var1;
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static boolean isClipPlayable(AudioClipNode var0) {
      try {
         AudioPlaybackContext var1;
         synchronized (var1 = getGlobalAudioContext()){} // $VF: monitorenter 

         try {
            var0.mediaPlayer = Manager.createPlayer(new ByteArrayInputStream(var0.prevClip.rawAudioData), var0.clipName);
            var0.mediaPlayer.realize();
            // $VF: monitorexit
         } catch (Throwable var4) {
            Throwable var2 = var4;

            while (true) {
               try {
                  // $VF: monitorexit
                  throw var2;
               } catch (Throwable var3) {
                  var2 = var3;
               }
            }
         }
      } catch (Throwable var5) {
         if (var0.mediaPlayer != null) {
            var0.mediaPlayer.close();
         }

         var0.mediaPlayer = null;
      }

      boolean var6;
      if (var0.mediaPlayer != null) {
         var6 = true;
      } else {
         var6 = false;
      }

      return var6;
   }

   public static int exec_b_arr_byte_to_int(byte[] var0) {
      byte[] var1 = var0;
      int var2 = -1;

      try {
         exec_b_bool_to_void(false);
         if (val_bool_aN) {
            var2 = (val_arr_byte_n[val_int_en + 1] & 255) << 8 | val_arr_byte_n[val_int_en + 2] & 255;
            if (var0.length != var2) {
               var1 = new byte[var2];
            }

            System.arraycopy(val_arr_byte_n, val_int_en + 3, var1, 0, var2);
         }

         saveRecordStore.closeRecordStore();
      } catch (Exception var3) {
      }

      return var2;
   }

   public static int readIntAtOffset(byte[] var0, int var1) {
      while (
         (var0[var1 + 2] != 116 || var0[var1 + 3] != 82 || var0[var1 + 4] != 78 || var0[var1 + 5] != 83)
            && (var0[var1 + 2] != 73 || var0[var1 + 3] != 68 || var0[var1 + 4] != 65 || var0[var1 + 5] != 84)
      ) {
         var1++;
      }

      return var1;
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static void exec_a_bool_audioplaybackcontext_to_void(boolean var0, AudioPlaybackContext var1) {
      while (var1.channelId != 2) {
         var1 = var1.nextContext;
      }

      AudioPlaybackContext var2;
      synchronized (var2 = getGlobalAudioContext()){} // $VF: monitorenter 

      try {
         var1.isPlaying = (boolean)var0;
         if (var1.val_audioclipnode_b != null && var1.val_audioclipnode_b.mediaPlayer != null) {
            try {
               Player var8 = var1.val_audioclipnode_b.mediaPlayer;
               int loopCount = var0 ? -1 : 1;
               var8.setLoopCount(loopCount);
            } catch (Exception var3) {
            }
         }

         // $VF: monitorexit
      } catch (Throwable var5) {
         Throwable var7 = var5;

         while (true) {
            try {
               // $VF: monitorexit
               throw var7;
            } catch (Throwable var4) {
               var7 = var4;
            }
         }
      }
   }

   public static EncodedTextBuffer exec_a_to_encodedtextbuffer() {
      EncodedTextBuffer[] var0;
      (var0 = new EncodedTextBuffer[12])[0] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(88, null);
      var0[1] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(87, null);
      var0[2] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(90, null);
      var0[3] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(89, null);
      var0[4] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(92, null);
      var0[5] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(91, null);
      var0[6] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(96, null);
      var0[7] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(95, null);
      var0[8] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(98, null);
      var0[9] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(97, null);
      if (val_int_bw == 0) {
         var0[8] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(100, null);
         var0[9] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(99, null);
      }

      return exec_a_int_encodedtextbuffer_to_encodedtextbuffer(47, null).concatAll(var0);
   }

   public static int exec_b_int_int_int_int_to_int(int var0, int var1, int var2, int var3) {
      return var3 >= 1000
         ? var1
         : var0
            - (int)((long)(var0 - var2) * var3 / 1000L)
            - (int)((long)(var0 - (int)((long)(var0 - var2) * var3 / 1000L) - (var2 - (int)((long)(var2 - var1) * var3 / 1000L))) * var3 / 1000L);
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static void destroyAudioChannel(AudioPlaybackContext var0) {
      try {
         AudioPlaybackContext var1;
         synchronized (var1 = getGlobalAudioContext()){} // $VF: monitorenter 

         try {
            VolumeControl var6;
            if (var0.val_audioclipnode_b != null && (var6 = (VolumeControl)var0.val_audioclipnode_b.mediaPlayer.getControl("VolumeControl")) != null) {
               getGlobalAudioContext();
               var6.setLevel(100 * var0.volumeLevel * val_globalcontext_a.rootAudioContext.priorityLevel >> 16);
            }

            // $VF: monitorexit
         } catch (Throwable var4) {
            Throwable var2 = var4;

            while (true) {
               try {
                  // $VF: monitorexit
                  throw var2;
               } catch (Throwable var3) {
                  var2 = var3;
               }
            }
         }
      } catch (Exception var5) {
      }
   }

   public static void exec_g_int_int_to_void(int var0, int var1) {
      for (byte var2 = 0; var2 < val_arr_int_aO.length; var2 += 3) {
         int var3 = var0 + val_arr_int_aO[var2];
         int var4 = var1 + val_arr_int_aO[var2 + 1];
         int var5 = val_arr_int_aO[var2 + 2];
         SpritePartSequence var6;
         if (exec_a_int_int_to_int(0, 1) == 0) {
            var6 = val_spritepartsequence_s;
         } else {
            var6 = val_spritepartsequence_t;
         }

         exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
            var3, var4, 1, 1, 1000, var5, 5, 1, 0, (byte)2, false, false, false, false, false, false, val_animationset_u, var6, val_animationset_u, var6
         );
      }
   }

   public static final void exec_a_arr_short_int_tokenstring_to_void(short[] var0, int var1, TokenString var2) {
      if (var2.tokenShortArray != var0) {
         var2.tokenShortArray = null;
         var2.tokenShortArray = new short[var1 + 1];
         short[] var3 = var2.tokenShortArray;

         for (int var4 = 0; var4 < var1; var4++) {
            var3[var4] = var0[var4];
            if (var0[var4] == 0) {
               break;
            }
         }

         var2.tokenShortArray[var2.tokenShortArray.length - 1] = 0;
      }
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static boolean isChannelActive(AudioPlaybackContext var0) {
      while (var0.channelId != 2) {
         var0 = var0.nextContext;
      }

      AudioClipNode var4;
      boolean var5;
      if ((var4 = var0.val_audioclipnode_b) != null && var4.mediaPlayer != null) {
         AudioPlaybackContext var1;
         synchronized (var1 = getGlobalAudioContext()){} // $VF: monitorenter 

         try {
            if (var4 != null && getClipDuration(var4) == 400) {
               var5 = true;
            } else {
               var5 = false;
            }

            // $VF: monitorexit
         } catch (Throwable var3) {
            Throwable var6 = var3;

            while (true) {
               try {
                  // $VF: monitorexit
                  throw var6;
               } catch (Throwable var2) {
                  var6 = var2;
               }
            }
         }
      } else {
         var5 = false;
      }

      return var5;
   }

   public static void exec_c_coreengine_to_void(CoreEngine var0) {
      if (var0.actorTimerW != 27 && var0.actorTimerW != 12) {
         if (var0.actorActiveFlag) {
            var0.updateActor(27);
         } else {
            var0.val_int_S = val_arr_short_D[2];
            var0.val_int_R = val_arr_short_D[1] << 8;
            var0.val_int_Q = -1 * var0.actorCurrentAnimIndex * val_arr_short_D[0] << 8;
            var0.val_bool_s = false;
            var0.updateActor(12);
         }
      }
   }

   public static void exec_a_coreengine_arr_int_int_int_int_int_to_void(CoreEngine var0, int[] var1, int var2, int var3, int var4, int var5) {
      var2 = 5 + var2 * 5;
      int var10002 = var1[var2];
      int var8 = var1[var2 + 1];
      int var10004 = var1[var2 + 2];
      int var10005 = var1[var2 + 3];
      var2 = var1[var2 + 4];
      var0.exec_d_int_int_to_void(var10004, var10005);
      var0.setActorPosition(var3 - var10002 * var5, var4 + var8);
      var0.val_int_X = var2;
      var0.actorCurrentAnimIndex = var5;
   }

   public static int exec_a_contextservicenode_to_int(ContextServiceNode var0) {
      while (var0.val_short_a == 5) {
         var0 = var0.val_contextservicenode_a;
      }

      int var2 = -1;

      try {
         exec_b_bool_to_void(false);
         if (val_bool_aN) {
            var2 = (val_arr_byte_n[val_int_en + 1] & 255) << 8 | val_arr_byte_n[val_int_en + 2] & 255;
         }

         saveRecordStore.closeRecordStore();
      } catch (Exception var1) {
      }

      return var2;
   }

   public static void exec_K_to_void() {
      if (val_animationset_x == null || val_arr_spritepartsequence_k == null) {
         try {
            int[] var0 = val_arr_int_aQ;
            AnimationSet var1 = exec_a_int_int_byte_bool_to_animationset(val_arr_int_aQ[0], -1, (byte)0, false);
            SpritePartSequence[] var2 = new SpritePartSequence[(var0.length - 1) / 2];

            for (byte var3 = 1; var3 < var0.length; var3 += 2) {
               var2[var3 / 2] = exec_a_int_int_to_spritepartsequence(var0[var3], var0[var3 + 1]);
            }

            val_animationset_x = var1;
            val_arr_spritepartsequence_k = var2;
            return;
         } catch (Exception var4) {
         }
      }
   }

   public static void exec_a_int_int_to_void(int var0, int var1) {
      for (int var2 = 0; var2 < val_arr_arr_int_f.length; var2++) {
         int var3;
         exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
            var0,
            var1,
            val_arr_arr_int_f[var2][0],
            val_arr_arr_int_f[var2][1],
            var3 = val_arr_arr_int_f[var2][2],
            0,
            5,
            0,
            var3 + exec_a_int_int_to_int(1000, 2000),
            (byte)5,
            false,
            true,
            false,
            false,
            true,
            false,
            val_animationset_r,
            val_spritepartsequence_v,
            val_animationset_r,
            val_spritepartsequence_x
         );
      }
   }

   public static void exec_z_int_to_void(int var0) {
      switch (var0) {
         case 0:
         case 3:
         default:
            break;
         case 1:
            exec_l_to_void();
            exec_g_to_void();
            val_int_dP = 0;
            val_encodedtextbuffer_v = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(59, null);
            val_encodedtextbuffer_u = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(56, null);
            val_byte_s = 0;
            val_byte_t = 0;
            break;
         case 2:
            exec_Z_to_void();
            val_int_dU = 0;
            val_int_dV = 0;
            val_int_dT = 0;
            if (val_bool_am) {
               val_int_eh = 0;
            }

            exec_K_int_to_void(0);
            drawTextLabel(0);
            val_byte_s = 6;
            val_byte_t = 5;
      }

      val_int_dN = var0;
      val_int_dO = 0;
   }

   public static byte exec_b_to_byte() {
      if (val_bool_am) {
         return (byte)exec_a_int_int_to_int(0, 4);
      }

      if (val_int_cA == exec_m_to_int() - 1) {
         return 4;
      }

      if (val_int_cA == 0) {
         return 0;
      }

      byte var0;
      if ((var0 = (byte)(val_int_cA % 5)) == 4 || val_int_cA >= 4) {
         var0 = (byte)((val_int_cA + val_int_cA / 4) % 5);
      }

      return var0;
   }

   public static void exec_e_byte_to_void(byte var0) {
      val_byte_n = var0;
      val_byte_l = 1;
      val_byte_m = 4;
      val_bool_Y = false;
      val_int_bP = 0;
      if (exec_a_byte_to_bool(var0)) {
         val_encodedtextbuffer_i = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(val_arr_int_bd[PatternTable.val_arr_arr_byte_a[val_byte_n][0]], null);
      } else {
         val_encodedtextbuffer_i = new EncodedTextBuffer("");
         if (PatternTable.val_arr_arr_byte_a[var0][1] == 1) {
            val_byte_l = 0;
         }
      }
   }

   public static void exec_b_int_int_to_void(int var0, int var1) {
      val_int_bz = var0;
      val_int_bA = val_int_n;
      val_int_bB = val_int_o - var1;
      val_int_bD = val_int_bA;
      val_int_bE = val_int_bB - val_int_bz;
      val_int_bC = 0 + val_int_bD / 2;
   }

   public static boolean exec_d_int_to_bool(int var0) {
      int[] var2 = val_arr_arr_int_j[var0];

      try {
         val_arr_arr_spritepartsequence_a[var0] = new SpritePartSequence[var2.length / 2];

         for (byte var1 = 0; var1 < var2.length; var1 += 2) {
            int var10000 = var2[var1];
            int var10001 = var2[var1 + 1];
            SpritePartSequence[] var3 = val_arr_arr_spritepartsequence_a[var0];
            SpritePartSequence var4 = exec_a_int_int_to_spritepartsequence(var10000, var10001);
            var3[var1 / 2] = var4;
         }
      } catch (Exception var5) {
      }

      return false;
   }

   public static void exec_L_to_void() {
      val_int_aL = (val_int_aL = val_int_aJ)
         + (val_int_aK - val_int_aJ - (val_arr_int_t.length * (val_arr_int_P[val_int_aH] + val_arr_int_Q[val_int_aH]) - val_arr_int_Q[val_int_aH])) / 2;
   }

   public static int readIntWithLength(byte[] var0, int var1, int var2) {
      for (int var3 = var1; var3 < var1 + var2 - 4; var3++) {
         if (var0[var3] == 80 && var0[var3 + 1] == 76 && var0[var3 + 2] == 84 && var0[var3 + 3] == 69) {
            return var3 + 4;
         }
      }

      return 0;
   }

   public static void exec_a_effectactor_to_void(EffectActor var0) {
      exec_a_entityinterface_int_to_void(var0, 2);
      var0.effectAccelerationX = 0;
      var0.val_animationset_a = null;
      var0.val_spritepartsequence_a = null;
      var0.val_animationset_b = null;
      var0.val_spritepartsequence_b = null;
      val_int_el--;
      byte var1 = -1;

      for (byte var2 = 0; var2 <= val_int_em; var2++) {
         if (val_arr_effectactor_a[var2].effectAccelerationX != 0) {
            var1 = var2;
         }
      }

      val_int_em = var1;
   }

   public static void exec_c_bool_to_void(boolean var0) {
      exec_b_byte_to_void((byte)4);
      EncodedTextBuffer var3 = val_encodedtextbuffer_m;
      short[] var1 = val_arr_short_f;
      int var2 = val_int_cE;
      int var4 = Math.min(val_arr_short_f[0], val_int_cC);
      int var5;
      if (var0) {
         var5 = val_int_n / 2;
      } else {
         var5 = val_int_cN;
      }

      int var6 = val_int_cD >> 8;
      int alignFlag = var0 ? 1 : 4;
      exec_a_encodedtextbuffer_arr_short_int_int_int_int_int_to_void(var3, var1, var2, var4, var5, var6, 16 | alignFlag);
   }

   public static void exec_A_int_to_void(int var0) {
      val_int_bG = var0;
      val_byte_l = 1;
      val_byte_m = 4;
      switch (val_int_bG) {
         case 0:
            val_int_bH = 16711680;
            return;
         case 1:
            val_int_bH = 16711680;
            val_byte_k = exec_c_to_byte();
            val_byte_j = exec_c_to_byte();
            exec_e_byte_to_void(val_byte_k);
            val_byte_l = 0;
            val_byte_m = 0;
            val_int_bI = 0;
            return;
         case 2:
            val_int_bH = 16777215;
            val_int_bF = 0;
            val_byte_l = 0;
            val_byte_m = 0;
      }
   }

   public static void exec_d_coreengine_to_void(CoreEngine var0) {
      SpritePartSequence var1;
      if (var0.exec_b_to_int() < -20) {
         var1 = val_spritepartsequence_F;
      } else if (var0.exec_b_to_int() < -10) {
         var1 = val_spritepartsequence_E;
      } else {
         var1 = val_spritepartsequence_D;
      }

      if (var1 != null && val_animationset_z != null && var0.actorTimerV != -1) {
         var1.drawSequence(1, val_animationset_z, var0.exec_a_to_int() - val_int_eO, 0 - exec_k_to_int(), 0);
      }
   }

   public static void exec_M_to_void() {
      exec_l_to_void();
      val_coreengine_b = null;
      val_coreengine_c = null;
      val_coreengine_d = null;
      val_animationset_q = null;
      actorPoolArray = null;
      exec_ao_to_void();
      val_arr_effectactor_a = null;
      exec_P_to_void();
      val_arr_animationset_e = null;
      val_arr_animationset_f = null;
      val_spritepartsequence_u = null;
      val_spritepartsequence_w = null;
      val_spritepartsequence_y = null;
      val_animationset_v = null;
      val_arr_spritepartsequence_j = null;
      val_animationset_x = null;
      val_arr_spritepartsequence_k = null;
      val_animationset_w = null;
      val_spritepartsequence_B = null;
      val_animationset_t = null;
      exec_al_to_void();
      val_animationset_u = null;
      val_spritepartsequence_s = null;
      val_spritepartsequence_t = null;
      val_animationset_s = null;
      val_spritepartsequence_z = null;
      val_arr_arr_entityinterface_a = null;
      val_arr_int_bl = null;
      val_arr_int_bp = null;
      val_arr_int_bq = null;
      val_arr_actorstatemachine_a = null;
      val_arr_animationset_g = null;
      val_arr_arr_spritepartsequence_a = null;
      exec_ah_to_void();
      val_arr_int_aF = null;
      exec_g_byte_to_void((byte)1);
      exec_g_byte_to_void((byte)0);
      exec_g_byte_to_void((byte)2);
      exec_g_byte_to_void((byte)3);
      val_bool_P = false;
      val_arr_animationset_b = null;
      val_arr_spritepartsequence_d = null;
      val_animationset_z = null;
      val_spritepartsequence_D = null;
      val_spritepartsequence_E = null;
      val_spritepartsequence_F = null;
      exec_ap_to_void();
      val_bool_aP = false;
      val_animationset_y = null;
      val_spritepartsequence_C = null;
      val_int_eW = 0;
      val_animationset_A = null;
      val_animationset_B = null;
      val_spritepartsequence_G = null;
      val_spritepartsequence_H = null;
   }

   public static String exec_a_arr_arr_byte_to_string(byte[][] var0) {
      String var1 = "";

      for (byte var2 = 0; var2 < var0.length; var2 += 2) {
         if (var2 > 0) {
            var1 = var1 + ",";
         }

         byte[] var10000 = var0[var2];
         StringBuffer var4 = new StringBuffer().append(var1);
         String var3 = exec_a_arr_byte_to_string(var10000);
         var1 = var4.append(var3).toString();
      }

      return var1;
   }

   public static final int exec_a_arr_short_int_int_int_int_fontcharmap_to_int(short[] var0, int var1, int var2, int var3, int var4, FontCharmap var5) {
      while (var2 <= var3) {
         int var6 = var2 + var3 >> 1;
         int var7 = var0[var6] & '\uffff';
         if (var1 == var7) {
            return var6;
         }

         if (var1 < var7) {
            return exec_a_arr_short_int_int_int_int_fontcharmap_to_int(var0, var1, var2, var6 - 1, var4, var5);
         }

         var2 = var6 + 1;
      }

      return var4;
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static void freeAudioClip(AudioClipNode var0) {
      if (var0.mediaPlayer != null) {
         AudioPlaybackContext var1;
         synchronized (var1 = getGlobalAudioContext()){} // $VF: monitorenter 

         try {
            removeClipFromChannel(var0, getGlobalAudioContext().prevContext);

            try {
               var0.mediaPlayer.close();
            } catch (Exception var2) {
            }

            var0.mediaPlayer = null;
            // $VF: monitorexit
         } catch (Throwable var4) {
            Throwable var5 = var4;

            while (true) {
               try {
                  // $VF: monitorexit
                  throw var5;
               } catch (Throwable var3) {
                  var5 = var3;
               }
            }
         }
      }
   }

   public static void exec_a_int_int_bool_bool_to_void(int var0, int var1, boolean var2, boolean var3) {
      byte subType = (byte)(var3 ? 3 : 2);

      exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
         var0,
         var1,
         0,
         0,
         0,
         0,
         0,
         1,
         0,
         subType,
         false,
         false,
         false,
         false,
         false,
         var2,
         val_animationset_t,
         val_spritepartsequence_A,
         val_animationset_t,
         val_spritepartsequence_A
      );
   }

   public static void exec_N_to_void() {
      boolean[] var0 = new boolean[10];
      exec_a_int_arr_byte_to_void(0, val_arr_arr_byte_d[0]);
      val_arr_int_ag[0] = 1000000;
      var0[0] = true;

      for (int var1 = 1; var1 < 10; var1++) {
         int var2;
         do {
            var2 = exec_a_int_int_to_int(1, 9);
         } while (var0[var2]);

         var0[var2] = true;
         exec_a_int_arr_byte_to_void(var1, val_arr_arr_byte_d[var2]);
         int var3 = 1000000 - var1 * 100000;
         var2 = var1;
         val_arr_int_ag[var2] = var3;
      }
   }

   public static void exec_B_int_to_void(int var0) {
      exec_b_byte_to_void((byte)4);
      val_arr_short_f = exec_a_encodedtextbuffer_int_to_arr_short(
         val_encodedtextbuffer_m = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0, null), val_int_n - val_int_cJ - 2
      );
      val_int_cD = val_int_o - 32 << 8;
      val_int_cN = val_int_cJ + 2;
      val_int_cE = 1;
      val_bool_ak = false;
   }

   public static void exec_C_int_to_void(int var0) {
      try {
         val_int_bP = 0;
         val_animationset_l = exec_a_int_int_byte_bool_to_animationset(val_arr_int_aS[var0], -1, (byte)0, false);
         val_spritepartsequence_l = exec_a_int_int_to_spritepartsequence(val_arr_arr_int_h[var0][66], 0);
         val_spritepartsequence_k = exec_a_int_int_to_spritepartsequence(val_arr_arr_int_h[var0][0], 1);
         val_bool_Y = true;
      } catch (Exception var1) {
      }

      exec_U_to_void();
   }

   public static void exec_b_byte_to_void(byte var0) {
      if (val_arr_object_a[ResourceSlotTable.val_arr_byte_a[var0]] == null) {
         exec_a_byte_to_void(ResourceSlotTable.val_arr_byte_a[var0]);
      }

      switch (ResourceSlotTable.val_arr_arr_int_a[ResourceSlotTable.val_arr_byte_a[var0]][0]) {
         case 0:
            exec_a_object_to_void(val_arr_object_a[ResourceSlotTable.val_arr_byte_a[var0]]);
      }
   }

   public static void exec_O_to_void() {
      val_bool_L = val_bool_J;
      val_bool_K = val_bool_J;
      boolean var0;
      if (val_bool_L && val_bool_as) {
         var0 = true;
      } else {
         var0 = false;
      }

      val_bool_N = var0;
      if (val_bool_K && val_bool_ar) {
         var0 = true;
      } else {
         var0 = false;
      }

      val_bool_M = var0;
   }

   public static int bufferedStreamRead(InputStream var0, byte[] var1, int var2, int var3) {
      try {
         for (int var4 = 0; var4 < var3; var4++) {
            int var5;
            if ((var5 = var0.read()) == -1) {
               if (var4 == 0) {
                  var5 = -1;
               } else {
                  var5 = var4;
               }

               return var5;
            }

            var1[var4 + var2] = (byte)var5;
         }

         return var3;
      } catch (Exception varEx) {
         return -1;
      }
   }

   public static TokenString exec_a_string_to_tokenstring(String var0) {
      char[] var1;
      short[] var2 = new short[(var1 = var0.toCharArray()).length + 1];

      for (int var3 = 0; var3 < var1.length; var3++) {
         var2[var3] = (short)var1[var3];
      }

      var2[var2.length - 1] = 0;
      return new TokenString(var2);
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static void removeClipFromChannel(AudioClipNode var0, AudioPlaybackContext var1) {
      synchronized (var1){} // $VF: monitorenter 

      try {
         for (int var5 = 0; var5 < audioChannelCount; var5++) {
            if (var1.val_arr_audioclipnode_a[var5] == var0) {
               var1.val_arr_audioclipnode_a[var5] = null;
               break;
            }
         }

         // $VF: monitorexit
      } catch (Throwable var4) {
         Throwable var2 = var4;

         while (true) {
            try {
               // $VF: monitorexit
               throw var2;
            } catch (Throwable var3) {
               var2 = var3;
            }
         }
      }
   }

   public static void exec_P_to_void() {
      if (val_arr_effectactor_a != null) {
         for (int var0 = 0; var0 < val_arr_effectactor_a.length; var0++) {
            if (val_arr_effectactor_a[var0] != null && val_arr_effectactor_a[var0].effectAccelerationX != 0) {
               exec_a_effectactor_to_void(val_arr_effectactor_a[var0]);
            }
         }
      }
   }

   public static boolean exec_v_to_bool() {
      boolean var0;
      if (val_int_dN == 2) {
         var0 = true;
      } else {
         var0 = false;
      }

      if (var0 && val_int_cw == 3 && !val_bool_ah && val_int_dL != 5 && val_int_dL != 14 && !val_bool_ai) {
         var0 = true;
      } else {
         var0 = false;
      }

      return var0;
   }

   public static void exec_f_byte_to_void(byte var0) {
      if (var0 != -1) {
         if (AudioMetaTable.val_arr_int_a[var0] != -1) {
            try {
               val_audiomanager_a.setLooping(1);
               byte var1;
               val_audiomanager_a.currentSoundId = var1 = AudioMetaTable.val_arr_byte_c[var0];
               val_audiomanager_a.playSound(AudioMetaTable.val_arr_int_a[var0]);
            } catch (Throwable var2) {
            }
         }
      }
   }

   public static SpriteImage exec_a_int_to_spriteimage(int var0) {
      try {
         PackedResourceStream var1;
         var1 = new PackedResourceStream(var0);
         byte[] var4 = new byte[var1.resourceId];
         var1.read(var4, 0, var1.resourceId);
         SpriteImage var2;
         var2 = new SpriteImage(var4, 0, var4.length);
         var1.close();
         return var2;
      } catch (Throwable var3) {
         return null;
      }
   }

   public static void setChannelVolume(short var0, AudioPlaybackContext var1) {
      if (var0 > 255) {
         var0 = 255;
      }

      if (var0 < 0) {
         var0 = 0;
      }

      var1.volumeLevel = var0;
      var1.priorityLevel = var1.volumeLevel;

      for (int var2 = 0; var2 <= 0; var2++) {
         destroyAudioChannel(var1.contextPool[0].nextContext);
      }
   }

   public static boolean exec_a_byte_audioclipnode_to_bool(byte var0, AudioClipNode var1) {
      if (var0 == 1) {
         var1.clipName.equals("audio/x-wav");
         var1.clipName.equals("audio/midi");
         var1.clipName.equals("audio/amr");
         return true;
      } else if (var0 == 0) {
         var1.clipName.equals("audio/x-wav");
         var1.clipName.equals("audio/midi");
         var1.clipName.equals("audio/amr");
         return true;
      } else {
         return false;
      }
   }

   public static void exec_h_to_void() {
      if (val_byte_g != -1 && (val_int_aB = val_int_aB - val_int_e) < 0) {
         val_int_aB = 0;
         exec_b_byte_bool_to_void(val_byte_g, false);
         val_byte_g = -1;
      }

      if (val_bool_H) {
         val_int_aA = val_int_aA + val_int_e;
      }
   }

   public static void exec_D_int_to_void(int var0) {
      switch (var0) {
         case 2:
            try {
               val_animationset_C = exec_a_int_int_byte_bool_to_animationset(134217846, -1, (byte)0, false);
               val_spritepartsequence_I = exec_a_int_int_to_spritepartsequence(134217777, 1);
               return;
            } catch (Exception var3) {
            }
         default:
            return;
         case 3:
            if (val_animationset_r == null) {
               try {
                  val_animationset_r = exec_a_int_int_byte_bool_to_animationset(134217843, -1, (byte)0, false);
                  val_spritepartsequence_v = exec_a_int_int_to_spritepartsequence(134217773, 1);
                  val_spritepartsequence_x = exec_a_int_int_to_spritepartsequence(134217774, 0);
                  return;
               } catch (Exception var2) {
               }
            }

            return;
         case 4:
            exec_Y_to_void();
            return;
         case 5:
            if (val_arr_animationset_e[1] == null) {
               try {
                  val_arr_animationset_e[1] = exec_a_int_int_byte_bool_to_animationset(134217825, 134217822, (byte)0, false);
                  val_arr_animationset_f[1] = exec_a_int_int_byte_bool_to_animationset(134217826, 134217823, (byte)0, false);
               } catch (Exception var1) {
               }
            }

            exec_Y_to_void();
            return;
         case 6:
            exec_Y_to_void();
      }
   }

   public static int exec_a_datainputstream_to_int(DataInputStream var0) {
      int var1 = -1;
      try {
         switch (var0.readUnsignedByte()) {
            case 1:
               int var4 = var0.readUnsignedByte();
               var1 = (var4 & 192) << 18;
               var1 = var4 & 63 | var1;
               break;
            case 2:
               int var10000 = var0.readUnsignedShort();
               var1 = (var10000 & 61440) << 12;
               var1 = var10000 & 4095 | var1;
            case 3:
            default:
               break;
            case 4:
               var1 = var0.readInt();
         }
      } catch (Exception varEx) {}

      return var1;
   }

   public static void exec_E_int_to_void(int var0) {
      val_arr_animationset_g[var0] = null;
      int[] var2 = val_arr_arr_int_j[var0];

      for (byte var1 = 0; var1 < var2.length; var1 += 2) {
         val_arr_arr_spritepartsequence_a[var0][var1 / 2] = null;
      }
   }

   public static int exec_a_encodedtextbuffer_int_int_to_int(EncodedTextBuffer var0, int var1, int var2) {
      FontCharmap var3 = exec_a_to_fontcharmap();
      int var4 = 0;
      int var6 = var0.flagsByte & 63;

      for (int var5 = var1; var5 < var1 + var2; var5++) {
         var4 += var3.getCharWidth(var3.getKerning(var0.getCharAt(var5), var6));
      }

      return var4;
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static void exec_e_audioplaybackcontext_to_void(AudioPlaybackContext var0) {
      AudioPlaybackContext var1;
      synchronized (var1 = getGlobalAudioContext()){} // $VF: monitorenter 

      try {
         for (int var5 = 0; var5 <= 0; var5++) {
            pauseAudioChannel(var0.contextPool[0].nextContext);
         }

         // $VF: monitorexit
      } catch (Throwable var4) {
         Throwable var2 = var4;

         while (true) {
            try {
               // $VF: monitorexit
               throw var2;
            } catch (Throwable var3) {
               var2 = var3;
            }
         }
      }
   }

   public static String exec_a_tokenstring_to_string(TokenString var0) {
      int var1 = exec_a_arr_short_to_int(var0.tokenShortArray);
      int var2 = 0;
      char[] var3 = new char[var1];

      for (int var4 = 0; var4 < var1; var4++) {
         int var5 = var2++;
         var3[var4] = (char)var0.tokenShortArray[var5];
      }

      return new String(var3);
   }

   public static void exec_a_int_int_int_int_int_int_to_void(int var0, int var1, int var2, int var3, int var4, int var5) {
      if (val_bool_i) {
         exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
            var0,
            var1,
            var2,
            var3,
            var4,
            0,
            5,
            0,
            var4 + exec_a_int_int_to_int(1000, 2000),
            (byte)5,
            false,
            true,
            false,
            false,
            true,
            false,
            val_arr_animationset_e[var5],
            val_spritepartsequence_u,
            val_arr_animationset_e[var5],
            val_spritepartsequence_w
         );
      }
   }

   public static void exec_Q_to_void() {
      val_arr_actorstatemachine_a = new ActorStateMachine[8];
      val_arr_arr_spritepartsequence_a = new SpritePartSequence[7][4];
      val_arr_animationset_g = new AnimationSet[7];

      for (int var0 = 0; var0 < val_arr_actorstatemachine_a.length; var0++) {
         val_arr_actorstatemachine_a[var0] = new ActorStateMachine();
      }
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static void stopClipPlayback(AudioClipNode var0) {
      try {
         AudioPlaybackContext var1;
         synchronized (var1 = getGlobalAudioContext()){} // $VF: monitorenter 

         try {
            removeClipFromChannel(var0, getGlobalAudioContext().prevContext);
            var0.mediaPlayer.deallocate();
            // $VF: monitorexit
         } catch (Throwable var3) {
            Throwable var5 = var3;

            while (true) {
               try {
                  // $VF: monitorexit
                  throw var5;
               } catch (Throwable var2) {
                  var5 = var2;
               }
            }
         }
      } catch (Throwable var4) {
      }
   }

   public static void exec_b_int_int_int_int_int_int_to_void(int var0, int var1, int var2, int var3, int var4, int var5) {
      if (val_bool_i) {
         exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
            var0,
            var1,
            var2,
            var3,
            var4,
            0,
            5,
            0,
            500,
            (byte)5,
            false,
            false,
            true,
            true,
            true,
            false,
            val_arr_animationset_e[var5],
            val_spritepartsequence_u,
            val_arr_animationset_e[var5],
            val_spritepartsequence_u
         );
      }
   }

   public static void exec_F_int_to_void(int var0) {
      exec_b_byte_to_void((byte)4);
      val_arr_short_f = exec_a_encodedtextbuffer_int_to_arr_short(
         val_encodedtextbuffer_m = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(var0, null), val_int_n - 16
      );
      val_int_cD = val_int_o - 32 << 8;
      val_int_cN = 8;
      val_int_cE = 1;
      val_bool_ak = false;
   }

   public static boolean exec_w_to_bool() {
      int var0 = -1;
      if (val_int_aF > 0) {
         var0 = val_arr_int_s[val_int_aF];
         val_int_aF--;
      }

      if (var0 != -1) {
         int var10000 = val_int_aC;
         exec_c_int_to_void(var0);
         exec_e_int_to_void(exec_e_int_to_int(var10000));
         return true;
      } else {
         return false;
      }
   }

   public static void exec_b_entityinterface_int_to_void(EntityInterface var0, int var1) {
      if (val_arr_int_bk[var1] <= 50) {
         val_arr_arr_entityinterface_a[var1][val_arr_int_bk[var1]] = var0;
         int var2 = val_arr_int_bk[var1] + 1;
         val_arr_int_bk[var1] = var2;
      }
   }

   public static byte[] exec_a_arr_byte_int_int_to_arr_byte(byte[] var0, int var1, int var2) {
      var1 = readIntWithLength(var0, var1, var2);
      byte[] var3 = new byte[readIntAtOffset(var0, var1) - var1];

      for (int var5 = 0; var5 < var3.length; var5++) {
         var3[var5] = var0[var1 + var5];
      }

      return var3;
   }

   public static void exec_G_int_to_void(int var0) {
      if (val_arr_arr_byte_y[var0] == null) {
         try {
            DataInputStream var1 = openResourceStreamByName(val_arr_string_c[var0]);
            byte[] var2 = new byte[var1.readInt()];
            val_arr_arr_byte_y[var0] = var2;
            var1.readFully(val_arr_arr_byte_y[var0]);
            var1.close();
         } catch (Exception varEx) {}
      }
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static int getClipDuration(AudioClipNode var0) {
      int var1 = 0;
      AudioPlaybackContext var2;
      synchronized (var2 = getGlobalAudioContext()){} // $VF: monitorenter 

      try {
         if (var0.mediaPlayer != null) {
            var1 = var0.mediaPlayer.getState();
         }

         // $VF: monitorexit
         return var1;
      } catch (Throwable var4) {
         Throwable var5 = var4;

         while (true) {
            try {
               // $VF: monitorexit
               throw var5;
            } catch (Throwable var3) {
               var5 = var3;
            }
         }
      }
   }

   public static void exec_a_gamemidletloop_to_void(GameMidletLoop var0) {
      long var1 = System.currentTimeMillis();
      if (var0.targetFrameTimeMs == -1L) {
         var0.targetFrameTimeMs = var1;
      }

      if (!var0.isInitialized && !var0.isRunning && !var0.isPaused && !var0.isExitRequested) {
         exec_a_short_short_short_gamemidletloop_to_void((short)5, (short)0, (short)0, var0);
      }
   }

   public static DataInputStream openResourceStreamByName(String var0) {
      StringBuffer var1;
      var1 = new StringBuffer(var0.length() + 1);
      if (var0.indexOf(47) != 0) {
         var1.append('/');
      }

      var1.append(var0);
      var0 = var1.toString();
      return new DataInputStream(val_inputmanager_a.getClass().getResourceAsStream(var0));
   }

   public static boolean exec_e_int_to_bool(int var0) {
      FontCharmap var1;
      byte var2 = (var1 = exec_a_to_fontcharmap()).val_arr_byte_c[var0];
      boolean var3;
      if (var1.val_arr_arr_byte_b[var2] != null && var1.val_arr_byte_d[var2] == var0) {
         var3 = true;
      } else {
         var3 = false;
      }

      return var3;
   }

   public static int exec_c_to_int() {
      FontCharmap var0;
      return ((var0 = exec_a_to_fontcharmap()).val_contextservicenode_a.val_arr_byte_a[3] & 0xFF)
         + (var0.val_contextservicenode_a.val_arr_byte_a[4] & 0xFF)
         + var0.val_contextservicenode_a.val_arr_byte_a[2];
   }

   public static void exec_R_to_void() {
      if (val_animationset_u == null || val_spritepartsequence_s == null || val_spritepartsequence_t == null) {
         try {
            val_animationset_u = exec_a_int_int_byte_bool_to_animationset(134217835, -1, (byte)0, false);
            val_spritepartsequence_s = exec_a_int_int_to_spritepartsequence(134217755, 0);
            val_spritepartsequence_t = exec_a_int_int_to_spritepartsequence(134217756, 0);
            return;
         } catch (Exception var0) {
         }
      }
   }

   public static CoreEngine exec_a_to_coreengine() {
      if (val_coreengine_b.currentHealth > val_coreengine_c.currentHealth) {
         return val_coreengine_b;
      } else {
         return val_coreengine_b.currentHealth < val_coreengine_c.currentHealth ? val_coreengine_c : null;
      }
   }

   public static void exec_H_int_to_void(int var0) {
      switch (var0) {
         case 1:
            val_arr_spritepartsequence_f = null;
            val_arr_animationset_c = null;
            val_arr_spritepartsequence_g = null;
            val_animationset_l = null;
            val_spritepartsequence_j = null;
            val_spritepartsequence_k = null;
            val_spritepartsequence_l = null;
            return;
         case 2:
         case 4:
            val_arr_animationset_d = null;
            val_arr_spritepartsequence_h = null;
            val_arr_spritepartsequence_i = null;
            exec_g_byte_to_void((byte)1);
            exec_ao_to_void();
            return;
         case 3:
            exec_M_to_void();
            return;
         case 5:
         case 6:
         case 7:
         case 9:
         case 10:
            val_encodedtextbuffer_m = null;
            val_arr_short_f = null;
            val_animationset_m = null;
            val_spritepartsequence_m = null;
         default:
            return;
         case 8:
            val_animationset_k = null;
            val_arr_spritepartsequence_e = null;
      }
   }

   public static void exec_a_int_int_int_to_void(int var0, int var1, int var2) {
      if (val_arr_spritepartsequence_d != null) {
         val_arr_spritepartsequence_d[var0].drawSequence(val_arr_int_ae[var0], val_arr_animationset_b[val_arr_int_W[var0]], var1, var2, 0);
      }
   }

   public static void exec_b_int_int_int_to_void(int var0, int var1, int var2) {
      if (val_arr_spritepartsequence_c != null) {
         val_arr_spritepartsequence_c[var0].drawSequence(val_arr_int_ab[var0], val_arr_animationset_a[val_arr_int_V[var0]], var1, var2, 0);
      }
   }

   public static void exec_a_graphicsadapter_int_int_int_int_to_void(GraphicsAdapter var0, int var1, int var2, int var3, int var4) {
      for (int var5 = 0; var5 < var4; var5++) {
         var0.drawRGB(val_arr_int_aF, var5 % 2, var3, var1, var2 + var5, var3);
      }
   }

   public static boolean exec_a_byte_to_bool(byte var0) {
      boolean var1 = false;
      if (PatternTable.val_arr_arr_byte_a[var0][1] == 0 || PatternTable.val_arr_arr_byte_a[var0][1] == 1 && val_bool_U) {
         var1 = true;
      }

      return var1;
   }

   public static void exec_I_int_to_void(int var0) {
      if (var0 != val_int_bv) {
         val_int_bv = var0;
         exec_l_to_void();
         exec_g_to_void();
         if (val_inputstream_a != null) {
            try {
               val_inputstream_a.close();
            } catch (Exception var2) {
            }

            val_inputstream_a = null;
         }

         AudioManager var1 = val_audiomanager_a;
         boolean var3;
         if (var0 == 1) {
            var3 = false;
         } else {
            var3 = true;
         }

         boolean var5 = var3;
         AudioManager var4 = var1;
         var1.isAudioEnabled = var5;
         if (!var5) {
            var4.stopSound();
         }
      }
   }

   public static void exec_a_int_arr_byte_to_void(int var0, byte[] var1) {
      val_arr_arr_byte_c[var0] = new byte[3];

      for (int var2 = 0; var2 < 3; var2++) {
         val_arr_arr_byte_c[var0][var2] = var1[var2];
      }
   }

   public static void exec_c_int_int_int_to_void(int var0, int var1, int var2) {
      val_int_eG = var0 << 8;
      val_int_eF = var1 << 8;
      val_int_eH = var2 << 8;
   }

   public static void exec_J_int_to_void(int var0) {
      switch (var0) {
         case 2:
            exec_ap_to_void();
         default:
            return;
         case 3:
            exec_al_to_void();
            return;
         case 4:
            val_animationset_t = null;
            return;
         case 5:
            val_arr_animationset_e[1] = null;
            val_arr_animationset_f[1] = null;
            val_animationset_t = null;
            return;
         case 6:
            val_animationset_t = null;
      }
   }

   public static AnimationSet exec_a_int_int_byte_bool_to_animationset(int var0, int var1, byte var2, boolean var3) {
      return exec_a_int_arr_int_arr_byte_bool_to_animationset(var0, new int[]{var1}, new byte[]{var2}, var3);
   }

   public static void exec_S_to_void() {
      if (val_arr_actorstatemachine_a != null) {
         for (int var0 = 0; var0 < val_arr_actorstatemachine_a.length; var0++) {
            val_arr_actorstatemachine_a[var0].setFacingDirection(3);
         }
      }
   }

   public static void exec_b_gamemidletloop_to_void(GameMidletLoop var0) {
      var0.isExitRequested = true;
      exec_e_audioplaybackcontext_to_void(getGlobalAudioContext());
      System.gc();
      if (var0.isTerminated) {
         try {
            var0.platformRequest(var0.gameVersionString);
         } catch (Exception var1) {
         }
      }

      var0.notifyDestroyed();
   }

   public static void exec_d_int_int_int_to_void(int var0, int var1, int var2) {
      val_arr_spritepartsequence_h[var0].drawSequence(val_arr_int_aD[var0], val_arr_animationset_d[val_arr_int_az[var0]], var1, var2, 0);
   }

   public static void exec_e_int_int_int_to_void(int var0, int var1, int var2) {
      val_arr_spritepartsequence_f[var0].drawSequence(val_arr_int_at[var0], val_arr_animationset_c[val_arr_int_ap[var0]], var1, var2, 0);
   }

   public static int readStreamBytes(InputStream var0, int var1) {
      int var2 = 0;
      byte var3 = 0;

      try {
         for (int var4 = var1 << 3; var3 < var4; var3 += 8) {
            var2 |= (var0.read() & 0xFF) << var3;
         }
      } catch (Exception varEx) {}

      return var2;
   }

   public static void exec_a_int_int_bool_to_void(int var0, int var1, boolean var2) {
      if (var2) {
         val_int_eU = var0;
         val_int_eV = var1;
         val_int_eK = var0;
         val_int_eL = var1;
      } else {
         val_int_eU = var0;
         val_int_eV = var1;
      }
   }

   // $VF: Duplicated exception handlers to handle obfuscated exceptions
   // $VF: Could not create synchronized statement, marking monitor enters and exits
   // Please report this to the Vineflower issue tracker, at https://github.com/Vineflower/vineflower/issues with a copy of the class file (if you have the rights to distribute it!)
   public static boolean isChannelBusy(AudioPlaybackContext var0) {
      AudioPlaybackContext var1;
      synchronized (var1 = getGlobalAudioContext()){} // $VF: monitorenter 

      try {
         boolean var5 = var0.isPaused;
         // $VF: monitorexit
         return var5;
      } catch (Throwable var3) {
         Throwable var4 = var3;

         while (true) {
            try {
               // $VF: monitorexit
               throw var4;
            } catch (Throwable var2) {
               var4 = var2;
            }
         }
      }
   }

   public static boolean exec_x_to_bool() {
      if (val_bool_am) {
         return true;
      }

      boolean var0;
      if (val_int_dU == 2 && val_int_dU > val_int_dV) {
         var0 = true;
      } else {
         var0 = false;
      }

      return var0;
   }

   public static CoreEngine exec_a_coreengine_to_coreengine(CoreEngine var0) {
      CoreEngine var1 = exec_b_coreengine_to_coreengine(var0);
      if (!var0.exec_p_to_bool() && exec_g_to_int() <= 64) {
         boolean var3;
         if ((var0 = var0).actorTimerY <= 200
            || var0.exec_r_to_bool()
            || var0.actorTimerW != 0 && var0.actorTimerW != 1 && var0.actorTimerW != 2 && var0.actorTimerW != 16) {
            var3 = false;
         } else {
            var3 = true;
         }

         if (var3) {
            var0 = var1;
            boolean var5;
            if (var1.val_int_Y > 200 && !var0.exec_r_to_bool() && var0.actorTimerW != 27 && var0.actorTimerW != 15) {
               var5 = true;
            } else {
               var5 = false;
            }

            if (var5) {
               return var1;
            }
         }
      }

      return null;
   }

   public static void exec_a_int_int_byte_to_void(int var0, int var1, byte var2) {
      val_int_dQ = var0;
      val_int_dR = var1;
      val_byte_r = var2;
      val_bool_ax = false;
      val_bool_aA = false;
      val_int_ec = 0;
      val_int_eb = 0;
      exec_z_int_to_void(1);
   }

   public static byte[] exec_a_int_to_arr_byte(int var0) {
      try {
         PackedResourceStream var1;
         var1 = new PackedResourceStream(var0);
         byte[] var3 = new byte[var1.resourceId];
         var1.read(var3);
         var1.close();
         return var3;
      } catch (Exception var2) {
         return null;
      }
   }

   public static void exec_a_arr_string_arr_int_arr_string_to_void(String[] var0, int[] var1, String[] var2) {
      val_arr_string_c = var0;
      val_arr_int_bh = var1;
      val_arr_arr_byte_y = new byte[var0.length][];
      val_arr_string_d = var2;
   }

   public static boolean exec_f_int_to_bool(int var0) {
      int var1 = val_arr_int_bi[var0];

      try {
         val_arr_animationset_g[var0] = exec_a_int_int_byte_bool_to_animationset(var1, -1, (byte)0, false);
         return false;
      } catch (Exception var2) {
         return true;
      }
   }

   public static SpriteImage exec_a_string_to_spriteimage(String var0) {
      SpriteImage var1;
      var1 = new SpriteImage(var0);
      if (var1.sourceImage.getImage() == null) {
         throw new RuntimeException("Error creating SDKImage from a file path.");
      } else {
         return var1;
      }
   }

   public static short exec_b_arr_byte_int_to_short(byte[] var0, int var1) {
      return (short)((var0[var1] & 255) << 8 | var0[var1 + 1] & 0xFF);
   }

   public static long skipStreamBytes(InputStream var0, long var1) {
      try {
         for (long var3 = 0L; var3 < var1; var3++) {
            if (var0.read() == -1) {
               return var3;
            }
         }
      } catch (Exception varEx) {}

      return var1;
   }

   public static short readShortBigEndian(byte[] var0, int var1) {
      return (short)((var0[var1] & 255) << 8 | var0[var1 + 1] & 0xFF);
   }

   public static int exec_d_int_to_int(int var0) {
      if (var0 >= 17 && var0 <= 26) {
         return var0 - 17 + 48;
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

   public static void exec_a_int_featureflag_to_void(int var0, FeatureFlag var1) {
      if (var1.flagEnabled) {
         Display.getDisplay(val_globalcontext_a.gameMidletLoop).vibrate(var0);
         System.currentTimeMillis();
      }
   }

   public static void exec_f_int_int_int_to_void(int var0, int var1, int var2) {
      val_arr_spritepartsequence_i[var0].drawSequence(val_arr_int_aA[var0], val_arr_animationset_d[1], var1, var2, 0);
   }

   public static int exec_e_int_to_int(int var0) {
      for (int var1 = 0; var1 < val_int_aG; var1++) {
         if (val_arr_int_r[var1] == var0) {
            return var1;
         }
      }

      return 0;
   }

   public static void exec_K_int_to_void(int var0) {
      val_int_ax = var0;
      val_animationset_i.setFrame(val_int_ax);
      if (val_animationset_j != null) {
         val_animationset_j.setFrame(val_int_ax);
      }
   }

   public static void exec_T_to_void() {
      val_int_eK = 0;
      val_int_eL = val_int_bz;
      val_int_eM = val_int_bD;
      val_int_eN = val_int_bE;
   }

   public static int exec_a_int_int_to_int(int var0, int var1) {
      return Math.abs(globalRandom.nextInt() % (var1 - var0 + 1)) + var0;
   }

   public static byte[] loadResourceBytes(int var0) {
      byte[] var1 = null;

      try {
         DataInputStream var10000 = openResourceStream(var0);
         var10000.readFully(var1 = new byte[val_int_eq]);
         var10000.close();
      } catch (Exception var2) {
      }

      return var1;
   }

   public static void exec_U_to_void() {
      for (int var0 = 0; var0 < val_arr_arr_byte_y.length; var0++) {
         val_arr_arr_byte_y[var0] = null;
      }

      try {
         System.gc();
         Thread.sleep(10L);
      } catch (Exception var1) {
      }
   }

   public static AudioPlaybackContext getGlobalAudioContext() {
      if (val_globalcontext_a.rootAudioContext == null) {
         val_globalcontext_a.rootAudioContext = new AudioPlaybackContext(1);
      }

      return val_globalcontext_a.rootAudioContext;
   }

   public static ContextServiceNode exec_a_to_contextservicenode() {
      if (val_globalcontext_a.serviceNodeC == null) {
         val_globalcontext_a.serviceNodeC = new ContextServiceNode(0);
      }

      return val_globalcontext_a.serviceNodeC;
   }

   public static void exec_h_int_int_to_void(int var0, int var1) {
      if (val_bool_i) {
         exec_a_int_int_int_int_int_int_int_int_int_byte_bool_bool_bool_bool_bool_bool_animationset_spritepartsequence_animationset_spritepartsequence_to_bool(
            var0,
            var1,
            0,
            0,
            0,
            0,
            0,
            1,
            0,
            (byte)2,
            false,
            false,
            false,
            false,
            false,
            false,
            val_animationset_s,
            val_spritepartsequence_z,
            val_animationset_s,
            val_spritepartsequence_z
         );
      }
   }

   public static CoreEngine exec_b_coreengine_to_coreengine(CoreEngine var0) {
      if (var0 == val_coreengine_b) {
         return val_coreengine_c;
      } else {
         return var0 == val_coreengine_c ? val_coreengine_b : null;
      }
   }

   public static int exec_g_to_int() {
      int var0;
      if ((var0 = val_coreengine_c.exec_a_to_int() - val_coreengine_b.exec_a_to_int()) < 0) {
         var0 = -var0;
      }

      return var0;
   }

   public static boolean exec_y_to_bool() {
      boolean var0;
      if (val_int_dQ != 1 && val_int_dR != 1 && !exec_A_to_bool()) {
         var0 = false;
      } else {
         var0 = true;
      }

      return var0;
   }

   public static void exec_V_to_void() {
      if (val_bool_aO) {
         switch (val_int_eb) {
            case 1:
               drawTextLabel(9);
               return;
            case 2:
               drawTextLabel(10);
         }
      } else {
         exec_W_to_void();
      }
   }

   public static void exec_W_to_void() {
      if (val_int_dU != 2 && val_int_dV != 2 && !val_bool_am) {
         drawTextLabel(0);
      } else {
         drawTextLabel(15);
      }
   }

   public static void exec_X_to_void() {
      if ((int)val_long_c > val_arr_int_ag[9]) {
         val_bool_aj = true;
         exec_u_int_to_void(8);
      } else {
         val_bool_aj = false;
         exec_u_int_to_void(9);
      }
   }

   public static byte exec_c_to_byte() {
      byte var0;
      while (!exec_a_byte_to_bool(var0 = (byte)exec_a_int_int_to_int(0, PatternTable.val_arr_arr_byte_a.length - 1)) || val_byte_n == var0) {
      }

      return var0;
   }

   public static void exec_i_to_void() {
      if (val_byte_c != 0) {
         exec_d_byte_to_void(val_byte_c);
      }

      if (val_byte_d != 0) {
         exec_d_byte_to_void(val_byte_d);
      }
   }

   public static AudioManager exec_a_to_audiomanager() {
      FontCharmap var0;
      if ((var0 = exec_a_to_fontcharmap()).val_audiomanager_a == null) {
         var0.val_audiomanager_a = new AudioManager();
      }

      return var0.val_audiomanager_a;
   }

   public static ContextServiceNode exec_b_to_contextservicenode() {
      GlobalContext var0 = val_globalcontext_a;
      if (val_globalcontext_a.serviceNodeB == null) {
         var0.serviceNodeB = new ContextServiceNode(4);
      }

      return var0.serviceNodeB;
   }

   public static ContextServiceNode exec_c_to_contextservicenode() {
      GlobalContext var0 = val_globalcontext_a;
      if (val_globalcontext_a.serviceNodeA == null) {
         var0.serviceNodeA = new ContextServiceNode(5);
      }

      return var0.serviceNodeA;
   }

   public static String exec_c_string_to_string(String var0) {
      String var1 = null;

      try {
         var1 = val_gamemidletloop_a.getAppProperty(var0);
      } catch (Exception var2) {
      }

      if (var1 == null) {
         var1 = "NULL";
      }

      return var1;
   }

   public static GameFlowController exec_a_to_gameflowcontroller() {
      GlobalContext var0 = val_globalcontext_a;
      if (val_globalcontext_a.gameFlowController == null) {
         var0.gameFlowController = new GameFlowController();
      }

      return var0.gameFlowController;
   }

   public static final void exec_a_scenebase_to_void(SceneBase var0) {
      short[] var1 = var0.sceneExtraShorts;

      for (int var2 = 0; var2 < 33; var2++) {
         var1[var2] = 0;
      }

      var0.sceneStateId = 0;
   }

   public static void exec_Y_to_void() {
      if (val_animationset_t == null) {
         try {
            val_animationset_t = exec_a_int_int_byte_bool_to_animationset(134217841, -1, (byte)0, false);
            val_spritepartsequence_A = exec_a_int_int_to_spritepartsequence(134217771, 0);
            return;
         } catch (Exception var0) {
         }
      }
   }

   public static void exec_j_to_void() {
      if (val_coreengine_b != null && val_coreengine_c != null) {
         exec_a_arr_byte_to_void(val_coreengine_b.scratchpadBuffer);
         exec_a_arr_byte_to_void(val_coreengine_c.scratchpadBuffer);
      }
   }

   public static void exec_Z_to_void() {
      val_bool_aG = false;
      val_bool_aF = false;
      val_bool_aH = false;
      val_bool_aI = false;
      val_bool_aJ = false;
      val_bool_aL = false;
      val_bool_aK = false;
      val_bool_aM = false;
   }

   public static void exec_a_encodedtextbuffer_int_int_int_to_void(EncodedTextBuffer var0, int var1, int var2, int var3) {
      exec_a_encodedtextbuffer_int_int_int_int_int_to_void(var0, 0, var0.bufferCapacity, var1, var2, var3);
   }

   public static final void exec_a_int_int_scenebase_to_void(int var0, int var1, SceneBase var2) {
      exec_a_scenebase_to_void(var2);
      var2.sceneConfigShorts[var0] = (short)var1;
   }

   public static final void exec_f_int_to_void(int var0) {
      var0 = exec_i_int_to_int(var0);
      if (val_scenebase_a.sceneStateId != var0) {
         exec_a_int_bool_scenebase_to_void(var0, false, val_scenebase_a);
      }
   }

   public static int[] exec_b_to_arr_int() {
      int[] var0;
      (var0 = new int[3])[0] = 352;
      var0[1] = 416;
      var0[2] = 24;
      return var0;
   }

   public static void exec_a_arr_byte_to_void(byte[] var0) {
      for (int var1 = 0; var1 < var0.length; var1++) {
         var0[var1] = 10;
      }
   }

   public static void exec_g_int_to_void(int var0) {
      val_int_dI |= var0;
      val_int_dK |= var0;
   }

   public static EncodedTextBuffer exec_a_int_to_encodedtextbuffer(int var0) {
      EncodedTextBuffer var1;
      var1 = new EncodedTextBuffer("");
      EncodedTextBuffer var2 = var1;
      if (var0 < 10) {
         String var3 = "0";
         var2 = var1.prepend(new EncodedTextBuffer(var3));
      }

      return var2.prepend(new EncodedTextBuffer(var0, (byte)0));
   }

   public static void exec_k_to_void() {
      if (exec_v_to_bool()) {
         exec_l_to_void();
         exec_g_to_void();
         val_bool_ah = true;
         exec_c_int_to_void(24);
      }
   }

   public static int exec_a_int_int_int_to_int(int var0, int var1, int var2) {
      return var0 << 16 | var1 << 2 | var2;
   }

   public static int exec_h_to_int() {
      int var0;
      if (val_arr_int_ad == null) {
         var0 = val_arr_int_Y[7];
      } else {
         var0 = val_arr_int_ad[1];
      }

      return var0;
   }

   public static int exec_i_to_int() {
      int var0;
      if (val_arr_int_ac == null) {
         var0 = val_arr_int_X[7];
      } else {
         var0 = val_arr_int_ac[1];
      }

      return var0;
   }

   public static void exec_L_int_to_void(int var0) {
      val_int_aF++;
      val_arr_int_s[val_int_aF] = var0;
   }

   public static EncodedTextBuffer exec_b_to_encodedtextbuffer() {
      EncodedTextBuffer[] var0;
      (var0 = new EncodedTextBuffer[2])[0] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(136, null);
      var0[1] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(139, null);
      return exec_a_int_encodedtextbuffer_to_encodedtextbuffer(42, null).concatAll(var0);
   }

   public static EncodedTextBuffer exec_c_to_encodedtextbuffer() {
      EncodedTextBuffer[] var0;
      (var0 = new EncodedTextBuffer[2])[0] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(136, null);
      var0[1] = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(139, null);
      return exec_a_int_encodedtextbuffer_to_encodedtextbuffer(43, null).concatAll(var0);
   }

   public static void exec_aa_to_void() {
      val_int_aF = 0;

      for (int var0 = 0; var0 < 5; var0++) {
         val_arr_int_s[var0] = -1;
      }
   }

   public static void exec_l_to_void() {
      try {
         val_audiomanager_a.stopSound();
      } catch (Throwable var0) {
      }

      val_byte_f = -1;
      val_byte_g = -1;
      val_int_aA = 0;
   }

   public static byte[] loadResourceBytesByName(String var0) {
      try {
         if (var0.charAt(0) == '/') {
            var0 = var0.substring(1);
         }
      } catch (Exception var1) {
      }

      return exec_b_string_to_arr_byte(var0);
   }

   public static void exec_ab_to_void() {
      try {
         val_animationset_y = exec_a_int_int_byte_bool_to_animationset(134217836, -1, (byte)0, false);
         val_spritepartsequence_C = exec_a_int_int_to_spritepartsequence(134217757, 0);
      } catch (Exception var0) {
      }
   }

   public static int exec_a_arr_short_to_int(short[] var0) {
      int var1 = 0;

      while (var0[var1] != 0) {
         var1++;
      }

      return var1;
   }

   public static void exec_a_bool_to_void(boolean var0) {
      getGlobalAudioContext().isPlaying = var0;
      if (var0) {
         exec_e_audioplaybackcontext_to_void(getGlobalAudioContext());
      }
   }

   public static void exec_m_to_void() {
      val_int_dF = 0;
      val_int_dG = 0;
      val_int_dH = 0;
      val_int_dI = 0;
      val_int_dJ = 0;
      val_int_dK = 0;
   }

   public static void exec_ac_to_void() {
      if (val_int_bZ == 2 && !val_bool_U) {
         val_bool_U = true;
         val_bool_al = true;
      }
   }

   public static int exec_j_to_int() {
      return val_arr_arr_int_c[val_int_bZ][val_int_ce + 1];
   }

   public static void exec_ad_to_void() {
      val_encodedtextbuffer_l = exec_a_int_encodedtextbuffer_to_encodedtextbuffer(val_arr_arr_int_c[val_int_bZ][0], null);
   }

   public static void exec_ae_to_void() {
      val_graphicsadapter_a.setClip(0, val_int_bz, val_int_bD, val_int_bE);
   }

   public static void exec_h_int_to_void(int var0) {
      if (var0 >= 0) {
         val_int_g = var0;
         exec_c_int_to_bool(var0);
      }
   }

   public static void exec_n_to_void() {
      if (val_byte_f != -1) {
         byte var10000 = val_byte_f;
         exec_l_to_void();
         val_byte_g = var10000;
         val_int_aB = 1000;
      }
   }

   public static String exec_b_string_to_string(String var0) {
      var0 = var0;
      new TokenWrapper();
      if ((var0 = exec_c_string_to_string(var0)).equals("NULL")) {
         var0 = null;
      }

      return var0;
   }

   public static int exec_k_to_int() {
      return val_int_eP + val_int_eX - val_int_bz;
   }

   public static SpriteImage exec_a_arr_byte_int_int_to_spriteimage(byte[] var0, int var1, int var2) {
      return new SpriteImage(var0, var1, var2);
   }

   public static int exec_l_to_int() {
      return exec_a_to_fontcharmap().val_contextservicenode_a.val_arr_byte_a[3] & 0xFF;
   }

   public static final void exec_c_audioplaybackcontext_to_void(AudioPlaybackContext var0) {
      AudioPlaybackContext var10000 = var0.nextContext;
      var0.nextContext.volumeLevel = 255;
      destroyAudioChannel(var10000);
   }

   public static boolean exec_z_to_bool() {
      boolean var0;
      if (val_int_dS <= 0) {
         var0 = true;
      } else {
         var0 = false;
      }

      return var0;
   }

   public static boolean exec_A_to_bool() {
      boolean var0;
      if (val_arr_byte_k != null) {
         var0 = true;
      } else {
         var0 = false;
      }

      return var0;
   }

   public static void exec_af_to_void() {
      val_arr_byte_k = null;
      val_arr_arr_int_d = null;
      exec_H_int_to_void(val_int_cw);
      val_int_cw = 11;
   }

   public static void exec_ag_to_void() {
      exec_b_byte_to_void((byte)4);
      exec_a_encodedtextbuffer_int_int_int_to_void(val_encodedtextbuffer_n, val_int_n / 2, 8, 17);
   }

   public static int exec_m_to_int() {
      return val_arr_arr_int_c[val_int_bZ].length - 1;
   }

   public static int exec_a_byte_to_int(byte var0) {
      return var0 * (val_int_bQ + val_int_bR);
   }

   public static void exec_M_int_to_void(int var0) {
      if (val_int_bu == 0) {
         if (var0 == 0) {
            ContextServiceNode var1 = exec_a_to_contextservicenode();
            exec_a_int_featureflag_to_void(0, var1.val_featureflag_a);
            return;
         }

         exec_a_int_featureflag_to_void(var0, exec_a_to_contextservicenode().val_featureflag_a);
      }
   }

   public static void exec_g_byte_to_void(byte var0) {
      val_arr_object_a[ResourceSlotTable.val_arr_byte_a[var0]] = null;
   }

   public static long exec_a_to_long() {
      return System.currentTimeMillis() - exec_a_to_rootgamestate().gameTimer;
   }

   public static void exec_i_int_int_to_void(int var0, int var1) {
      val_int_eU = var0;
      val_int_eV = var1;
   }

   public static int exec_a_encodedtextbuffer_to_int(EncodedTextBuffer var0) {
      return exec_a_encodedtextbuffer_int_int_to_int(var0, 0, var0.bufferCapacity);
   }

   public static int exec_d_to_int() {
      return exec_a_to_fontcharmap().val_contextservicenode_a.val_arr_byte_a[2];
   }

   public static void exec_a_arr_short_arr_short_int_to_void(short[] var0, short[] var1, int var2) {
      System.arraycopy(var0, 0, var1, 0, var2);
   }

   public static final void exec_i_int_to_void(int var0) {
      exec_a_int_bool_scenebase_to_void(exec_i_int_to_int(var0), true, val_scenebase_a);
   }

   public static FontCharmap exec_a_to_fontcharmap() {
      return ((RootGameState)val_globalcontext_a.currentScene).fontCharmap;
   }

   public static void exec_e_coreengine_to_void(CoreEngine var0) {
      var0.actorTimerT++;
   }

   public static void exec_ah_to_void() {
      val_animationset_o = null;
      val_spritepartsequence_o = null;
      val_animationset_p = null;
      val_spritepartsequence_p = null;
   }

   public static void exec_j_int_to_void(int var0) {
      val_int_dJ |= var0;
   }

   public static void exec_ai_to_void() {
      val_arr_int_aG[0] = 0;
      val_arr_int_aG[1] = 0;
   }

   public static void exec_d_bool_to_void(boolean var0) {
      val_bool_aa = var0;
      if (!var0) {
         val_int_ce = 0;
      }
   }

   public static int exec_n_to_int() {
      return PatternTable.val_arr_arr_byte_a[val_byte_n][0];
   }

   public static void exec_aj_to_void() {
      val_graphicsadapter_a.setClip(0, 0, val_int_n, val_int_o);
   }

   public static void exec_a_byte_byte_to_void(byte var0, byte var1) {
      val_byte_c = var0;
      val_byte_d = var1;
   }

   public static int exec_o_to_int() {
      return val_int_eO;
   }

   public static void exec_ak_to_void() {
      val_int_eu++;
   }

   public static AnimationSet exec_a_int_byte_to_animationset(int var0, byte var1) {
      return exec_a_int_int_byte_bool_to_animationset(134217840, -1, var1, false);
   }

   public static AnimationSet exec_a_int_to_animationset(int var0) {
      return exec_a_int_int_byte_bool_to_animationset(var0, -1, (byte)0, false);
   }

   public static void exec_N_int_to_void(int var0) {
      exec_f_int_to_bool(var0);
      exec_d_int_to_bool(var0);
   }

   public static void renderSecondary(GraphicsAdapter var0) {
      exec_a_to_fontcharmap().val_graphicsadapter_a = var0;
   }

   public static RootGameState exec_a_to_rootgamestate() {
      return (RootGameState)val_globalcontext_a.currentScene;
   }

   public static TokenString exec_a_arr_short_to_tokenstring(short[] var0) {
      return new TokenString(var0);
   }

   public static final AudioPlaybackContext exec_a_audioplaybackcontext_to_audioplaybackcontext(AudioPlaybackContext var0) {
      return var0.contextPool[0];
   }

   public static void exec_al_to_void() {
      val_animationset_r = null;
      val_spritepartsequence_x = null;
      val_spritepartsequence_v = null;
   }

   public static int exec_j_int_to_int(int var0) {
      return (var0 & 65532) >>> 2;
   }

   public static void exec_am_to_void() {
      val_bool_Z = true;
      exec_l_to_void();
      exec_g_to_void();
   }

   public static void exec_an_to_void() {
      val_spritepartsequence_j = val_spritepartsequence_l;
      val_int_bO = 1;
   }

   public static boolean exec_d_to_bool() {
      val_bool_H = false;
      return false;
   }

   public static void exec_ao_to_void() {
      val_animationset_i = null;
      val_animationset_j = null;
      val_spritepartsequence_i = null;
   }

   public static void exec_ap_to_void() {
      val_spritepartsequence_I = null;
      val_animationset_C = null;
   }

   public static AnimationSet exec_b_int_to_animationset(int var0) {
      return exec_a_int_int_byte_bool_to_animationset(var0, -1, (byte)0, false);
   }

   public static int getTransformMask(int var0) {
      return var0 << 16;
   }

   public static int[] exec_c_to_arr_int() {
      return val_rendercontext_a.clipBounds;
   }

   public static final int exec_a_arr_int_to_int(int[] var0) {
      return var0[0];
   }

   public static final int exec_b_arr_int_to_int(int[] var0) {
      return var0[1];
   }

   public static short[] exec_a_tokenstring_to_arr_short(TokenString var0) {
      return var0.tokenShortArray;
   }

   public static final short exec_a_audioplaybackcontext_to_short(AudioPlaybackContext var0) {
      return var0.volumeLevel;
   }

   public static void exec_f_coreengine_to_void(CoreEngine var0) {
      val_coreengine_d = var0;
   }

   public static int exec_g_int_to_int(int var0) {
      return var0 & 3;
   }

   public static void exec_a_arr_int_to_void(int[] var0) {
      exec_a_arr_int_bool_encodedtextbuffer_to_void(var0, true, null);
   }

   public static void exec_c_byte_to_void(byte var0) {
      exec_f_byte_to_void(var0);
   }

   public static void exec_h_byte_to_void(byte var0) {
      exec_a_byte_bool_to_void(var0, false);
   }

   public static void exec_aq_to_void() {
      val_int_eW = 300;
   }

   public static int exec_p_to_int() {
      return val_int_eQ;
   }

   public static boolean exec_B_to_bool() {
      return val_bool_j;
   }

   public static void exec_o_to_void() {
      val_int_aB = 1000;
   }


    private static void initStaticTables1() {
        val_arr_byte_c = new byte[] {(byte)2, (byte)0, (byte)1, (byte)0, (byte)1, (byte)1, (byte)0};
        val_arr_int_h = new int[] {0, 167772201, 167772200, 167772199, 167772195, 167772202, 167772198};
        val_int_b = -1;
        val_int_c = -1;
        val_int_d = -1;
        val_arr_byte_d = new byte[] {(byte)80, (byte)76, (byte)84, (byte)69};
        val_arr_int_a = new int[] {0, 6, 3, 5, 2, 4, 1, 7};
        val_arr_int_b = new int[] {0, 6, 4, 2, 5, 3, 1, 7};
        val_arr_arr_byte_b = new byte[][] {new byte[] {}, new byte[] {}, new byte[] {}};
        val_arr_byte_e = new byte[] {(byte)0, (byte)0, (byte)0};
        val_arr_byte_f = new byte[] {(byte)0, (byte)0, (byte)0};
        val_arr_int_k = new int[] {0, 0, 0};
        val_arr_int_l = new int[] {0, 0, 0};
        val_arr_int_m = new int[] {0, 0, 0};
        val_arr_int_n = new int[] {0, 0, 0};
        val_arr_int_o = new int[] {0, 0, 0};
        val_arr_int_p = new int[] {0, 0, 0};
        val_arr_int_q = new int[] {-1, -1};
        val_arr_byte_g = new byte[] {(byte)0, (byte)1};
        val_byte_f = (byte)-1;
        val_byte_g = (byte)-1;
        val_arr_int_s = new int[] {0, 0, 0, 0, 0};
        val_arr_bool_a = new boolean[] {false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false};
        val_arr_int_v = new int[] {1, 71, 86, 23, 31, 27, 11, 28, 20, 26, 72, 25};
        val_arr_int_w = new int[] {4, 25, 51};
    }

    private static void initStaticTables2() {
        val_arr_int_x = new int[] {6, 20, 74};
        val_arr_int_y = new int[] {0, 72, 17, 21, 23, 20, 18, 22, 19, 1, 20, 2, 22, 5, 21, 6, 25, 8};
        val_arr_int_z = new int[] {0, 19, 31, 12, 11, 14, 36, 10, 32, 16, 37, 18, 40, 9};
        val_arr_int_A = new int[] {3, 36};
        val_arr_int_B = new int[] {3, 31, 10, 13};
        val_arr_int_C = new int[] {3, 11, 12, 13};
        val_arr_int_D = new int[] {2, 31, 10, 13};
        val_arr_int_E = new int[] {2, 11, 12, 13};
        val_arr_int_F = new int[] {3, 32, 33, 34, 35};
        val_arr_int_G = new int[] {3, 37, 38, 39};
        val_arr_int_H = new int[] {0, 20, 17, 3, 37, 4};
        val_arr_int_I = new int[] {5, 22, 112};
        val_arr_int_J = new int[] {5, 20, 41};
        val_arr_int_K = new int[] {5, 20, 41};
        val_arr_int_L = new int[] {4, 17, 53};
        val_arr_int_M = new int[] {4, 25, 50};
        val_arr_int_N = new int[] {4, 40, 52};
        val_arr_int_O = new int[] {0, 0, 0, 0};
        val_arr_int_P = new int[] {0, 0, 0, 0};
        val_arr_int_Q = new int[] {0, 0, 0, 0};
        val_arr_int_R = new int[] {167772236, 167772237, 167772239, 167772240};
        val_arr_int_S = new int[] {167772240, 167772239};
        val_arr_int_T = new int[] {167772184, 167772189, 167772176, 167772175, 167772178, 167772177, 167772179, 167772164, 167772165, 167772162, 167772163};
        val_arr_int_U = new int[] {167772179, 167772164, 167772165, 167772162, 167772163};
        val_arr_int_V = new int[] {0, 1, 1, 1, 1, 1, 3, 2, 2, 2, 2};
    }

    private static void initStaticTables3() {
        val_arr_int_W = new int[] {0, 1, 1, 1, 1};
        val_arr_byte_h = new byte[] {(byte)11, (byte)11, (byte)11};
        val_arr_byte_i = new byte[] {(byte)0, (byte)0, (byte)0};
        val_arr_arr_byte_c = new byte[][] {new byte[] {(byte)0, (byte)0, (byte)0}, new byte[] {(byte)0, (byte)0, (byte)0}, new byte[] {(byte)0, (byte)0, (byte)0}, new byte[] {(byte)0, (byte)0, (byte)0}, new byte[] {(byte)0, (byte)0, (byte)0}, new byte[] {(byte)0, (byte)0, (byte)0}, new byte[] {(byte)0, (byte)0, (byte)0}, new byte[] {(byte)0, (byte)0, (byte)0}, new byte[] {(byte)0, (byte)0, (byte)0}, new byte[] {(byte)0, (byte)0, (byte)0}};
        val_arr_int_ag = new int[] {0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
        val_arr_encodedtextbuffer_b = new EncodedTextBuffer[] {null, null, null, null, null, null, null, null, null, null};
        val_arr_encodedtextbuffer_c = new EncodedTextBuffer[] {null, null, null, null, null, null, null, null, null, null};
        val_arr_encodedtextbuffer_d = new EncodedTextBuffer[] {null, null, null, null, null, null, null, null, null, null};
        val_int_bt = 167772241;
        val_arr_int_ah = new int[] {167772188, 167772185, 167772186, 167772187};
        val_arr_int_aj = new int[] {0, 0, 0, 0};
        val_arr_int_ak = new int[] {0, 0, 0, 0};
        val_arr_int_al = new int[] {0, 0, 0, 0};
        val_arr_int_am = new int[] {0, 0, 0, 0};
        val_int_bv = 2;
        val_int_g = -1;
        val_int_bx = 1;
        val_int_h = -1;
        val_arr_object_a = new Object[] {null, null, null, null, null, null, null, null, null};
        val_bool_g = true;
        val_bool_i = true;
        val_bool_j = true;
        val_bool_V = true;
        val_arr_int_an = new int[] {167772237, 167772234, 167772236};
        val_arr_int_ao = new int[] {167772189, 167772167, 167772168, 167772184};
    }

    private static void initStaticTables4() {
        val_arr_int_ap = new int[] {0, 1, 1, 2};
        val_arr_int_ax = new int[] {167772237, 167772234, 167772240, 167772238, 167772238, 167772232, 167772233};
        val_arr_int_ay = new int[] {167772189, 167772167, 167772167, 167772179, 167772180, 167772182, 167772183, 167772190, 167772191, 167772160, 167772161};
        val_arr_int_az = new int[] {0, 1, 1, 2, 2, 3, 3, 3, 3, 5, 6};
        val_arr_int_c = new int[] {0, 0, 0, 0, 0, 0};
        val_arr_int_d = new int[] {0, 0, 0, 0};
        val_arr_int_aE = new int[] {28, 29, 30};
        val_byte_q = (byte)4;
        val_arr_arr_byte_d = new byte[][] {new byte[] {(byte)28, (byte)19, (byte)21}, new byte[] {(byte)20, (byte)11, (byte)13}, new byte[] {(byte)12, (byte)28, (byte)31}, new byte[] {(byte)11, (byte)28, (byte)15}, new byte[] {(byte)11, (byte)14, (byte)28}, new byte[] {(byte)25, (byte)22, (byte)1}, new byte[] {(byte)15, (byte)14, (byte)25}, new byte[] {(byte)23, (byte)11, (byte)30}, new byte[] {(byte)33, (byte)11, (byte)15}, new byte[] {(byte)29, (byte)25, (byte)16}};
        val_arr_int_aG = new int[] {0, 0};
        val_arr_encodedtextbuffer_f = new EncodedTextBuffer[] {null, null};
        val_arr_encodedtextbuffer_g = new EncodedTextBuffer[] {null, null};
        val_arr_int_aH = new int[] {0, 0};
        val_arr_int_aI = new int[] {0, 0};
        val_arr_int_aJ = new int[] {0, 0};
        val_arr_int_aK = new int[] {0, 0};
        val_arr_int_aL = new int[] {0, 0};
        val_arr_int_aM = new int[] {0, 0};
        val_arr_int_aN = new int[] {0, 0};
        val_arr_arr_int_e = new int[][] {new int[] {32, 160, 1200}, new int[] {-32, 160, 1200}, new int[] {64, 128, 1200}, new int[] {-64, 128, 1200}, new int[] {96, 96, 1000}, new int[] {-96, 96, 1000}};
        val_arr_arr_int_f = new int[][] {new int[] {32, 160, 900}, new int[] {-32, 160, 900}, new int[] {64, 128, 900}, new int[] {-64, 128, 900}, new int[] {96, 96, 900}, new int[] {-96, 96, 900}};
        val_arr_arr_int_g = new int[][] {new int[] {32, 32, 550}, new int[] {64, 32, 650}, new int[] {96, 32, 620}, new int[] {64, 64, 610}, new int[] {96, 64, 580}, new int[] {64, 96, 590}};
        val_arr_int_aO = new int[] {17, -18, 0, -5, -17, 0, 6, -24, 0, 16, -35, 0, -4, -32, 0, 7, -44, 0, 13, -59, 100, -2, -56, 100, 26, -51, 100, -14, -50, 100, 21, -72, 200, 4, -73, 200, -11, -69, 200, 14, -86, 200, -3, -88, 200, 5, -101, 200, -18, -36, 200, 30, -36, 200};
        val_arr_int_aP = new int[] {134217838, 134217759, 1, 134217760, 1, 134217761, 1, 134217762, 1, 134217763, 1, 134217764, 1, 134217765, 1, 134217766, 1};
        val_arr_int_aQ = new int[] {134217827, 134217731, 1, 134217732, 1, 134217733, 1, 134217734, 1, 134217735, 1, 134217736, 1, 134217736, 1, 134217737, 1, 134217738, 1, 134217738, 1, 134217739, 1};
    }

    private static void initStaticTables5() {
        isGlobalPaused = true;
        frameTimestampMs = 25L;
        audioChannelCount = (short)1;
        val_arr_byte_m = new byte[] {};
        val_int_en = -1;
        val_int_eo = -1;
        val_int_ep = -1;
        val_arr_string_a = new String[] {"a.mbf", "b.mbf", "c.mbf", "d.mbf", "e.mbf", "f.mbf", "g.mbf", "h.mbf", "i.mbf", "j.mbf", "k.mbf"};
        val_arr_int_e = new int[] {1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1};
        val_arr_string_b = new String[] {};
        val_arr_byte_o = new byte[] {(byte)43, (byte)51, (byte)28, (byte)49, (byte)32, (byte)8, (byte)46};
        val_arr_int_aR = new int[] {167772171, 167772174, 167772169, 167772173, 167772170, 167772166, 167772172};
        val_arr_int_aS = new int[] {39, 16777255, 33554472, 67108903, 50331688, 83886120, 100663317};
        val_arr_int_aT = new int[] {37, 16777253, 33554470, 67108901, 50331686, 83886118, 100663314};
        val_arr_int_aU = new int[] {38, 16777254, 33554471, 67108902, 50331687, 83886119, 100663315};
        val_arr_int_aV = new int[] {40, 16777256, 33554473, 67108904, 50331689, 83886121, -1};
        val_arr_int_aW = new int[] {32, 16777248, 33554465, 67108896, 50331681, 83886113, -1};
        val_arr_arr_int_h = new int[][] {new int[] {0, 1, 1, 0, 2, 0, 3, 0, 4, 0, 5, 0, 6, 1, 7, 1, 8, 0, 9, 0, 10, 0, 11, 0, 12, 0, 13, 0, 14, 0, 15, 0, 16, 0, 17, 0, 18, 1, 19, 0, 20, 0, 21, 0, 22, 1, 23, 1, 24, 0, 25, 0, 26, 0, 27, 0, 28, 0, -1, 0, -1, 0, 29, 0, 30, 1, 31, 0}, new int[] {16777217, 1, 16777218, 0, 16777219, 0, 16777220, 0, 16777221, 0, 16777222, 0, 16777223, 1, 16777224, 1, 16777225, 0, 16777226, 0, 16777227, 0, 16777228, 0, 16777229, 0, 16777230, 0, 16777231, 0, 16777232, 0, 16777233, 0, 16777234, 0, 16777235, 1, 16777236, 0, 16777237, 0, 16777238, 0, 16777239, 1, 16777240, 1, 16777241, 0, 16777242, 0, 16777243, 0, -1, 0, 16777244, 0, -1, 0, -1, 0, 16777245, 0, 16777246, 1, 16777247, 0}, new int[] {33554433, 1, 33554434, 0, 33554435, 0, 33554436, 0, 33554437, 0, 33554438, 0, 33554439, 1, 33554440, 1, 33554441, 0, 33554442, 0, 33554443, 0, 33554444, 0, 33554445, 0, 33554446, 0, 33554447, 0, 33554448, 0, 33554449, 0, 33554450, 0, 33554451, 1, 33554452, 0, 33554453, 0, 33554454, 0, 33554455, 1, 33554456, 1, 33554457, 0, 33554458, 0, 33554459, 1, 33554460, 0, 33554461, 0, -1, 0, -1, 0, 33554462, 0, 33554463, 1, 33554464, 0}, new int[] {67108865, 1, 67108866, 0, 67108867, 0, 67108868, 0, 67108869, 0, 67108870, 0, 67108871, 1, 67108872, 1, 67108873, 0, 67108874, 0, 67108875, 0, 67108876, 0, 67108877, 0, 67108878, 0, 67108879, 0, 67108880, 0, 67108881, 0, 67108882, 0, 67108883, 1, 67108884, 0, 67108885, 0, 67108886, 0, 67108887, 1, 67108888, 1, 67108889, 0, 67108890, 0, 67108891, 0, -1, 0, 67108892, 0, -1, 0, -1, 0, 67108893, 0, 67108894, 1, 67108895, 0}, new int[] {50331649, 1, 50331650, 0, 50331651, 0, 50331652, 0, 50331653, 0, 50331654, 0, 50331655, 1, 50331656, 1, 50331657, 0, 50331658, 0, 50331659, 0, 50331660, 0, 50331661, 0, 50331662, 0, 50331663, 0, 50331664, 0, 50331665, 0, 50331666, 0, 50331667, 1, 50331668, 0, 50331669, 0, 50331670, 0, 50331671, 1, 50331672, 1, 50331673, 0, 50331674, 0, 50331675, 0, 50331676, 0, 50331677, 0, -1, 0, -1, 0, 50331678, 0, 50331679, 1, 50331680, 0}, new int[] {83886081, 1, 83886082, 0, 83886083, 0, 83886084, 0, 83886085, 0, 83886086, 0, 83886087, 1, 83886088, 1, 83886089, 0, 83886090, 0, 83886091, 0, 83886092, 0, 83886093, 0, 83886094, 0, 83886095, 0, 83886096, 0, 83886097, 0, 83886098, 0, 83886099, 1, 83886100, 0, 83886101, 0, 83886102, 0, 83886103, 1, 83886104, 1, 83886105, 0, 83886106, 0, 83886107, 0, 83886107, 0, 83886108, 0, 83886109, 1, -1, 0, 83886110, 0, 83886111, 1, 83886112, 0}, new int[] {100663297, 1, 100663298, 0, 100663299, 0, 100663299, 0, 100663297, 1, 100663298, 0, 100663300, 1, 100663300, 1, 100663301, 0, 100663302, 0, 100663303, 0, -1, -1, -1, -1, -1, -1, 100663304, 0, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 100663305, 0, 100663297, 1, 100663306, 1, -1, -1, -1, -1, 100663307, 0, 100663307, 0, -1, -1, -1, -1, -1, 0, 100663308, 0, 100663309, 1, 100663310, 0}};
        val_arr_arr_short_c = new short[][] {new short[] {(short)-55, (short)3, (short)49, (short)-20}, new short[] {(short)-60, (short)36, (short)74, (short)-27}, new short[] {(short)-70, (short)15, (short)60, (short)-30}, new short[] {(short)-72, (short)13, (short)72, (short)-37}, new short[] {(short)-87, (short)11, (short)53, (short)-45}, new short[] {(short)-80, (short)23, (short)78, (short)-34}, new short[] {(short)-70, (short)-8, (short)45, (short)-10}};
        val_arr_arr_short_d = new short[][] {new short[] {(short)-20, (short)40, (short)80, (short)0}, new short[] {(short)-15, (short)30, (short)75, (short)0}, new short[] {(short)-18, (short)44, (short)73, (short)0}, new short[] {(short)-22, (short)44, (short)85, (short)0}, new short[] {(short)-14, (short)31, (short)73, (short)0}, new short[] {(short)-17, (short)36, (short)77, (short)0}, new short[] {(short)-50, (short)12, (short)45, (short)-10}};
        val_arr_arr_short_e = new short[][] {new short[] {(short)-90, (short)10, (short)52, (short)-70}, new short[] {(short)-100, (short)10, (short)58, (short)-80}, new short[] {(short)-90, (short)10, (short)68, (short)-70}, new short[] {(short)-90, (short)10, (short)47, (short)-70}, new short[] {(short)-90, (short)10, (short)47, (short)-70}, new short[] {(short)-90, (short)10, (short)47, (short)-70}, new short[] {(short)-105, (short)10, (short)72, (short)-85}};
        val_arr_arr_short_f = new short[][] {new short[] {(short)-75, (short)10, (short)47, (short)-55}, new short[] {(short)-75, (short)10, (short)46, (short)-55}, new short[] {(short)-75, (short)10, (short)59, (short)-55}, new short[] {(short)-75, (short)10, (short)62, (short)-55}, new short[] {(short)-75, (short)10, (short)53, (short)-55}, new short[] {(short)-75, (short)10, (short)62, (short)-55}, new short[] {(short)-75, (short)10, (short)77, (short)-55}};
        val_arr_int_aX = new int[] {750, 1000, 32, 16, 260, 49, 0, 0, 0, 0, 57, 0, 17, 0, 0, 51, 3, 17, 0, 0, 21, -1, 4, 0, 0, 16, -7, 5, 0, 0, 78, -48, 17, 0, 3, -19, -140, 3, 0, 2, -76, -62, 8, 0, 0};
        val_arr_int_aY = new int[] {600, 1000, 92, 32, 400, 47, 0, 0, 0, 0, 39, -12, 2, 0, 0, 49, -30, 17, 0, 0, 27, -12, 3, 0, 0, -7, -31, 9, 0, 0, -41, -40, 8, 0, 0, -58, -48, 8, 0, 0, -52, -50, 9, 0, 0};
        val_arr_int_aZ = new int[] {580, 1200, 48, 92, 800, 48, 1, 0, 0, 0, 37, 0, 3, 0, 0, 14, -171, 3, 0, 2, -36, -80, 9, 0, 0, -55, -37, 8, 0, 0, -43, 0, 8, 0, 0};
    }

    private static void initStaticTables6() {
        val_arr_int_ba = new int[] {530, 1000, 64, 16, 350, 33, 0, 0, 0, 0, 17, -1, 4, 0, 0, 78, -48, 3, 0, 3, 62, -38, 3, 0, 3, -26, -132, 3, 0, 2, -76, -52, 8, 0, 0};
        val_arr_int_bb = new int[] {580, 1000, 64, 16, 350, 37, 0, 0, 0, 0, 25, 0, 4, 0, 0, 25, -8, 5, 0, 0, 5, -3, 5, 0, 0, 59, -36, 3, 0, 3, -27, -109, 3, 0, 2, -73, -32, 8, 0, 0};
        val_arr_int_bc = new int[] {850, 1000, -112, 86, 650, 32, -1, 0, 0, 0, 22, 0, 0, 0, 0, 64, -51, 3, 0, 3, -14, -110, 3, 0, 2, -8, 0, 8, 0, 0, 0, 0, 8, 0, 0};
        val_arr_int_bd = new int[] {2, 3, 4, 6, 8, 7, 5};
        val_arr_int_be = new int[] {80, 79, 82, 83, 81, 84, 80};
        val_arr_int_bf = new int[] {74, 73, 76, 77, 75, 78, 74};
        val_arr_arr_byte_e = new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)9, (byte)4, (byte)0, (byte)0}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)7, (byte)1, (byte)2}};
        val_arr_arr_byte_f = new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)13, (byte)5, (byte)0, (byte)0}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)8, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)10, (byte)8, (byte)2, (byte)1}};
        val_arr_arr_byte_g = new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)8, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)21, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)21, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)6, (byte)1, (byte)2}};
        val_arr_arr_byte_h = new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)25, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)4, (byte)0, (byte)0}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)17, (byte)7, (byte)2, (byte)1}};
        val_arr_arr_byte_i = new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)10, (byte)5, (byte)0, (byte)0}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)10, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)14, (byte)8, (byte)1, (byte)2}};
        val_arr_arr_byte_j = new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)10, (byte)6, (byte)0, (byte)0}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)17, (byte)4, (byte)0, (byte)0}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)14, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)6, (byte)2, (byte)1}};
        val_arr_arr_byte_k = new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)25, (byte)11, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)15, (byte)7, (byte)2, (byte)1}};
        val_arr_arr_byte_l = new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)24, (byte)10, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)11, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)24, (byte)10, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)11, (byte)8, (byte)2, (byte)1}};
        val_arr_arr_byte_m = new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)25, (byte)11, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)9, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)12, (byte)6, (byte)1, (byte)2}};
        val_arr_arr_byte_n = new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)5, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)9, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)5, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)7, (byte)2, (byte)1}};
        val_arr_arr_byte_o = new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)5, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)9, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)8, (byte)2, (byte)1}};
        val_arr_arr_byte_p = new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)5, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)9, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)14, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)9, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)6, (byte)1, (byte)2}};
        val_arr_arr_byte_q = new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)9, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)2, (byte)1}};
        val_arr_arr_byte_r = new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)9, (byte)2, (byte)1}};
        val_arr_arr_byte_s = new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)9, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)6, (byte)1, (byte)2}};
        val_arr_arr_byte_t = new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)10, (byte)14, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)9, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)2, (byte)1}};
        val_arr_arr_byte_u = new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)9, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)9, (byte)5, (byte)2, (byte)1}};
        val_arr_arr_byte_v = new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)12, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)9, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)6, (byte)1, (byte)2}};
        val_arr_arr_arr_arr_byte_a = new byte[][][][] {new byte[][][] {new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)8, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)21, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)21, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)6, (byte)1, (byte)2}}, new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)13, (byte)5, (byte)0, (byte)0}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)8, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)10, (byte)8, (byte)2, (byte)1}}, new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)9, (byte)4, (byte)0, (byte)0}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)7, (byte)1, (byte)2}}}, new byte[][][] {new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)10, (byte)6, (byte)0, (byte)0}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)17, (byte)4, (byte)0, (byte)0}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)14, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)6, (byte)2, (byte)1}}, new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)10, (byte)5, (byte)0, (byte)0}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)10, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)14, (byte)8, (byte)1, (byte)2}}, new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)25, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)4, (byte)0, (byte)0}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)17, (byte)7, (byte)2, (byte)1}}}, new byte[][][] {new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)25, (byte)11, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)9, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)10, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)12, (byte)6, (byte)1, (byte)2}}, new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)24, (byte)10, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)11, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)24, (byte)10, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)11, (byte)8, (byte)2, (byte)1}}, new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)25, (byte)11, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)10, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)15, (byte)7, (byte)2, (byte)1}}}, new byte[][][] {new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)5, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)9, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)14, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)9, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)6, (byte)1, (byte)2}}, new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)5, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)9, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)8, (byte)2, (byte)1}}, new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)5, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)9, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)5, (byte)4, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)7, (byte)2, (byte)1}}}, new byte[][][] {new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)12, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)9, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)6, (byte)1, (byte)2}}, new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)9, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)9, (byte)5, (byte)2, (byte)1}}, new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)10, (byte)14, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)25, (byte)9, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)2, (byte)1}}}, new byte[][][] {new byte[][] {new byte[] {(byte)7, (byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)9, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)15, (byte)15, (byte)6, (byte)1, (byte)2}}, new byte[][] {new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)5, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)14, (byte)16, (byte)9, (byte)2, (byte)1}}, new byte[][] {new byte[] {(byte)0}, new byte[] {(byte)25, (byte)8, (byte)7, (byte)0, (byte)1}, new byte[] {(byte)0}, new byte[] {(byte)10, (byte)9, (byte)6, (byte)0, (byte)1}, new byte[] {(byte)1}, new byte[] {(byte)24, (byte)9, (byte)7, (byte)2, (byte)1}}}, null};
    }

    private static void initStaticTables7() {
        val_arr_arr_int_i = new int[][] {new int[] {750, 1000, 32, 16, 260, 49, 0, 0, 0, 0, 57, 0, 17, 0, 0, 51, 3, 17, 0, 0, 21, -1, 4, 0, 0, 16, -7, 5, 0, 0, 78, -48, 17, 0, 3, -19, -140, 3, 0, 2, -76, -62, 8, 0, 0}, new int[] {600, 1000, 92, 32, 400, 47, 0, 0, 0, 0, 39, -12, 2, 0, 0, 49, -30, 17, 0, 0, 27, -12, 3, 0, 0, -7, -31, 9, 0, 0, -41, -40, 8, 0, 0, -58, -48, 8, 0, 0, -52, -50, 9, 0, 0}, new int[] {580, 1200, 48, 92, 800, 48, 1, 0, 0, 0, 37, 0, 3, 0, 0, 14, -171, 3, 0, 2, -36, -80, 9, 0, 0, -55, -37, 8, 0, 0, -43, 0, 8, 0, 0}, new int[] {530, 1000, 64, 16, 350, 33, 0, 0, 0, 0, 17, -1, 4, 0, 0, 78, -48, 3, 0, 3, 62, -38, 3, 0, 3, -26, -132, 3, 0, 2, -76, -52, 8, 0, 0}, new int[] {580, 1000, 64, 16, 350, 37, 0, 0, 0, 0, 25, 0, 4, 0, 0, 25, -8, 5, 0, 0, 5, -3, 5, 0, 0, 59, -36, 3, 0, 3, -27, -109, 3, 0, 2, -73, -32, 8, 0, 0}, new int[] {850, 1000, -112, 86, 650, 32, -1, 0, 0, 0, 22, 0, 0, 0, 0, 64, -51, 3, 0, 3, -14, -110, 3, 0, 2, -8, 0, 8, 0, 0, 0, 0, 8, 0, 0}, null};
        val_arr_arr_arr_byte_b = new byte[][][] {new byte[][] {new byte[] {(byte)9, (byte)9, (byte)0}, new byte[] {(byte)8, (byte)9, (byte)0}, new byte[] {(byte)8, (byte)8, (byte)7, (byte)1}, new byte[] {(byte)8, (byte)8, (byte)1}}, new byte[][] {new byte[] {(byte)8, (byte)7, (byte)0}, new byte[] {(byte)9, (byte)9, (byte)1}, new byte[] {(byte)9, (byte)9, (byte)9, (byte)0}, new byte[] {(byte)8, (byte)8, (byte)1}}, new byte[][] {new byte[] {(byte)7, (byte)7, (byte)0}, new byte[] {(byte)9, (byte)9, (byte)9, (byte)0}, new byte[] {(byte)7, (byte)7, (byte)7, (byte)1}, new byte[] {(byte)8, (byte)8, (byte)1}}, new byte[][] {new byte[] {(byte)7, (byte)7, (byte)0}, new byte[] {(byte)7, (byte)9, (byte)0}, new byte[] {(byte)7, (byte)7, (byte)7, (byte)1}, new byte[] {(byte)8, (byte)8, (byte)1}}, new byte[][] {new byte[] {(byte)7, (byte)7, (byte)0}, new byte[] {(byte)7, (byte)7, (byte)1}, new byte[] {(byte)7, (byte)7, (byte)7, (byte)1}, new byte[] {(byte)8, (byte)8, (byte)1}}, new byte[][] {new byte[] {(byte)9, (byte)9, (byte)1}, new byte[] {(byte)7, (byte)9, (byte)0}, new byte[] {(byte)7, (byte)7, (byte)7, (byte)1}, new byte[] {(byte)8, (byte)8, (byte)1}}, new byte[][] {new byte[] {(byte)7, (byte)7, (byte)0}, new byte[] {(byte)7, (byte)7, (byte)1}, null, null}};
        val_arr_arr_byte_w = new byte[][] {new byte[] {(byte)3}, new byte[] {(byte)9, (byte)3}, new byte[] {(byte)3}, new byte[] {(byte)9, (byte)3}};
        val_arr_arr_short_g = new short[][] {new short[] {(short)0, (short)16, (short)-86, (short)50}, new short[] {(short)1, (short)34, (short)-66, (short)150}, new short[] {(short)2, (short)24, (short)-66, (short)200}, new short[] {(short)5, (short)42, (short)-69, (short)100}, new short[] {(short)4, (short)14, (short)-86, (short)170}, new short[] {(short)3, (short)8, (short)-76, (short)0}, new short[] {(short)6, (short)16, (short)-96, (short)280}};
        val_arr_arr_short_h = new short[][] {null, null, new short[] {(short)2, (short)26, (short)-80, (short)100}, null, new short[] {(short)4, (short)46, (short)-110, (short)0}, null, null};
        val_arr_short_i = new short[] {(short)-48, (short)-24, (short)24, (short)0};
        val_arr_short_j = new short[] {(short)-48, (short)-48, (short)32, (short)0};
        val_arr_short_k = new short[] {(short)-88, (short)-48, (short)32, (short)-48};
        val_arr_short_l = new short[] {(short)-80, (short)-22, (short)22, (short)0};
        val_arr_short_m = new short[] {(short)-94, (short)-24, (short)24, (short)-49};
        val_arr_short_n = new short[] {(short)-96, (short)-22, (short)22, (short)0};
        val_arr_short_o = new short[] {(short)-120, (short)8, (short)48, (short)-64};
        val_arr_short_p = new short[] {(short)-16, (short)16, (short)64, (short)0};
        val_arr_short_q = new short[] {(short)-90, (short)16, (short)48, (short)-20};
        val_arr_short_r = new short[] {(short)-100, (short)32, (short)70, (short)-70};
        val_arr_short_s = new short[] {(short)-160, (short)-16, (short)80, (short)-60};
        val_arr_short_t = new short[] {(short)-120, (short)8, (short)48, (short)-12};
        val_arr_short_u = new short[] {(short)32, (short)32, (short)400};
        val_arr_short_v = new short[] {(short)92, (short)92, (short)800};
        val_arr_short_w = new short[] {(short)64, (short)128, (short)1000};
        val_arr_short_x = new short[] {(short)70, (short)245, (short)1600};
        val_arr_short_y = new short[] {(short)32, (short)32, (short)400};
        val_arr_short_z = new short[] {(short)64, (short)92, (short)700};
        val_arr_short_A = new short[] {(short)64, (short)128, (short)1000};
        val_arr_short_B = new short[] {(short)96, (short)64, (short)600};
    }

    private static void initStaticTables8() {
        val_arr_short_C = new short[] {(short)130, (short)72, (short)730};
        val_arr_short_D = new short[] {(short)64, (short)32, (short)400};
        val_arr_short_E = new short[] {(short)-80, (short)-16, (short)68, (short)-50};
        val_arr_short_F = new short[] {(short)-110, (short)10, (short)55, (short)-10};
        val_arr_arr_byte_x = new byte[][] {new byte[] {(byte)2, (byte)6, (byte)39, (byte)-1, (byte)-1, (byte)24, (byte)25, (byte)45, (byte)44, (byte)6, (byte)-1, (byte)39, (byte)6, (byte)12, (byte)9}, new byte[] {(byte)2, (byte)6, (byte)39, (byte)-1, (byte)-1, (byte)24, (byte)25, (byte)52, (byte)-1, (byte)-1, (byte)2, (byte)6, (byte)-1, (byte)12, (byte)9}, new byte[] {(byte)1, (byte)6, (byte)39, (byte)-1, (byte)-1, (byte)20, (byte)21, (byte)31, (byte)29, (byte)6, (byte)30, (byte)-1, (byte)6, (byte)11, (byte)20}, new byte[] {(byte)1, (byte)6, (byte)39, (byte)-1, (byte)-1, (byte)20, (byte)21, (byte)50, (byte)-1, (byte)6, (byte)-1, (byte)34, (byte)6, (byte)11, (byte)20}, new byte[] {(byte)3, (byte)6, (byte)39, (byte)-1, (byte)-1, (byte)22, (byte)23, (byte)35, (byte)34, (byte)34, (byte)36, (byte)-1, (byte)-1, (byte)33, (byte)23}, new byte[] {(byte)0, (byte)6, (byte)39, (byte)-1, (byte)-1, (byte)18, (byte)19, (byte)10, (byte)-1, (byte)6, (byte)34, (byte)-1, (byte)-1, (byte)12, (byte)19}, new byte[] {(byte)4, (byte)6, (byte)39, (byte)-1, (byte)-1, (byte)26, (byte)27, (byte)4, (byte)48, (byte)6, (byte)4, (byte)-1, (byte)6, (byte)47, (byte)9}};
        val_arr_int_bg = new int[] {1500, 1500, 1000, 800, 900, 800, 900};
        val_arr_int_bi = new int[] {134217831, 134217828, 134217829, 134217833, 134217830, 134217832, 134217834};
        val_arr_arr_int_j = new int[][] {new int[] {134217746, 0, 134217745, 0}, new int[] {134217740, 0, 134217741, 0, 134217742, 0}, new int[] {134217743, 1, 134217743, 1}, new int[] {134217750, 1, 134217751, 0, 134217753, 0, 134217752, 1}, new int[] {134217744, 0, 134217744, 0, 134217744, 0}, new int[] {134217747, 1, 134217748, 0, 134217749, 0}, new int[] {134217754, 1, 134217754, 0}};
        val_arr_arr_short_a = new short[][] {new short[] {(short)-5, (short)-32, (short)0, (short)5}, new short[] {(short)-11, (short)15, (short)64, (short)11}, new short[] {(short)-19, (short)-19, (short)18, (short)18}, new short[] {(short)-37, (short)0, (short)40, (short)59}, new short[] {(short)-9, (short)0, (short)88, (short)9}, new short[] {(short)-16, (short)-16, (short)14, (short)16}, new short[] {(short)-26, (short)-28, (short)25, (short)21}};
        val_arr_arr_short_b = new short[][] {new short[] {(short)-5, (short)-32, (short)0, (short)5}, new short[] {(short)-11, (short)15, (short)44, (short)11}, new short[] {(short)-19, (short)-19, (short)18, (short)18}, new short[] {(short)-37, (short)0, (short)40, (short)59}, new short[] {(short)-9, (short)0, (short)44, (short)9}, new short[] {(short)-16, (short)-16, (short)14, (short)16}, new short[] {(short)-26, (short)-28, (short)25, (short)21}};
        val_arr_int_bj = new int[] {5, 0, 15, 0, 15, 18, 25};
        val_arr_long_a = new long[] {0L, 1L, 2L, 3L, 4L, 5L, 7L, 8L, 9L, 10L, 11L, 12L, 13L, 14L, 15L, 16L, 17L, 18L, 19L, 20L, 21L, 22L, 23L, 24L, 25L, 26L, 27L, 28L, 28L, 29L, 30L, 31L, 32L, 32L, 33L, 34L, 35L, 35L, 36L, 37L, 37L, 38L, 39L, 39L, 40L, 40L, 41L, 41L, 42L, 42L, 43L, 43L, 44L, 44L, 44L, 45L, 45L, 45L, 45L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 46L, 45L, 45L, 45L, 44L, 44L, 44L, 43L, 43L, 43L, 42L, 42L, 41L, 41L, 40L, 39L, 39L, 38L, 38L, 37L, 36L, 35L, 35L, 34L, 33L, 32L, 31L, 31L, 30L, 29L, 28L, 27L, 26L, 25L, 24L, 23L, 22L, 21L, 19L, 18L, 17L, 16L, 15L, 14L, 12L, 11L, 10L, 8L, 7L, 6L, 4L, 3L, 1L, 0L};
        val_int_eB = -1;
        val_int_eJ = -1;
        val_arr_int_bs = new int[] {0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
        val_arr_arr_int_k = new int[][] {new int[] {20496, 65536, 0, 0, 256, 513, 1024, 8200, 32770, 2052, 0}, new int[] {20496, 65536, 0, 0, 1024, 513, 256, 2052, 32770, 8200, 0}, new int[] {0, 0, 4112, 16384, 256, 513, 1024, 8200, 32770, 2052, 0}, new int[] {0, 0, 4112, 16384, 1024, 513, 256, 2052, 32770, 8200, 0}};
        val_arr_arr_arr_byte_c = new byte[][][] {new byte[][] {new byte[] {(byte)7, (byte)7}, new byte[] {(byte)0}, new byte[] {(byte)1}, new byte[] {(byte)9, (byte)1}, new byte[] {(byte)7, (byte)0}, new byte[] {(byte)9, (byte)9, (byte)9}}, new byte[][] {new byte[] {(byte)7, (byte)7}, new byte[] {(byte)2}, new byte[] {(byte)7, (byte)2}, new byte[] {(byte)9, (byte)2}, new byte[] {(byte)3}, new byte[] {(byte)9, (byte)9, (byte)9}}};
        val_arr_arr_byte_z = new byte[][] {new byte[] {(byte)7, (byte)7, (byte)9, (byte)9}, new byte[] {(byte)9, (byte)9, (byte)7, (byte)7}, new byte[] {(byte)5, (byte)8, (byte)5, (byte)8}, new byte[] {(byte)6, (byte)5, (byte)4}, new byte[] {(byte)4, (byte)5, (byte)6}, new byte[] {(byte)5, (byte)8, (byte)9, (byte)7}, new byte[] {(byte)8, (byte)8, (byte)5, (byte)5}, new byte[] {(byte)9, (byte)9, (byte)9, (byte)9}, new byte[] {(byte)5, (byte)5, (byte)7, (byte)7}, new byte[] {(byte)5, (byte)5, (byte)9, (byte)9}, new byte[] {(byte)4, (byte)4, (byte)6, (byte)6}};
        val_arr_string_e = new String[] {"INSTANT KILL P1", "INSTANT KILL P2", "FINISH EXTENSION", "GODMODE P1", "GODMODE P2", "INSTANT TIMEOVER", "A.I.", "SCORE BONUS", "CHANGE P1", "CHANGE P2", "CHANGE ARENA"};
        val_byte_a = (byte)8;
        val_byte_b = (byte)14;
        val_arr_byte_a = new byte[] {(byte)0, (byte)0, (byte)0, (byte)0, (byte)0};
    }

        static {
        initStaticTables1();
        initStaticTables2();
        initStaticTables3();
        initStaticTables4();
        initStaticTables5();
        initStaticTables6();
        initStaticTables7();
        initStaticTables8();
    }

}
