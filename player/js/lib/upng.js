// Pako Inflate + UPNG
(function(e,t){typeof exports==`object`&&typeof module<`u`?t(exports):typeof define==`function`&&define.amd?define([`exports`],t):(e=typeof globalThis<`u`?globalThis:e||self,t(e.pako={}))})(this,function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t=4,n=0,r=1,i=2;function a(e){let t=e.length;for(;--t>=0;)e[t]=0}var o=0,s=1,c=2,l=29,u=256,d=286,f=30,p=19,m=573,h=15,g=16,_=256,v=16,y=17,b=18,x=new Uint8Array([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0]),S=new Uint8Array([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13]);new Uint8Array([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7]);var C=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),w=512,T=Array(288*2);a(T);var E=Array(f*2);a(E);var D=Array(w);a(D);var O=Array(256);a(O);var k=Array(l);a(k);var A=Array(f);a(A);var j=e=>e<256?D[e]:D[256+(e>>>7)],M=(e,t)=>{e.pending_buf[e.pending++]=t&255,e.pending_buf[e.pending++]=t>>>8&255},N=(e,t,n)=>{e.bi_valid>g-n?(e.bi_buf|=t<<e.bi_valid&65535,M(e,e.bi_buf),e.bi_buf=t>>g-e.bi_valid,e.bi_valid+=n-g):(e.bi_buf|=t<<e.bi_valid&65535,e.bi_valid+=n)},P=(e,t,n)=>{N(e,n[t*2],n[t*2+1])},ee=(e,t)=>{let n=0;do n|=e&1,e>>>=1,n<<=1;while(--t>0);return n>>>1},te=(e,t)=>{let n=t.dyn_tree,r=t.max_code,i=t.stat_desc.static_tree,a=t.stat_desc.has_stree,o=t.stat_desc.extra_bits,s=t.stat_desc.extra_base,c=t.stat_desc.max_length,l,u,d,f,p,g,_=0;for(f=0;f<=h;f++)e.bl_count[f]=0;for(n[e.heap[e.heap_max]*2+1]=0,l=e.heap_max+1;l<m;l++)u=e.heap[l],f=n[n[u*2+1]*2+1]+1,f>c&&(f=c,_++),n[u*2+1]=f,!(u>r)&&(e.bl_count[f]++,p=0,u>=s&&(p=o[u-s]),g=n[u*2],e.opt_len+=g*(f+p),a&&(e.static_len+=g*(i[u*2+1]+p)));if(_!==0){do{for(f=c-1;e.bl_count[f]===0;)f--;e.bl_count[f]--,e.bl_count[f+1]+=2,e.bl_count[c]--,_-=2}while(_>0);for(f=c;f!==0;f--)for(u=e.bl_count[f];u!==0;)d=e.heap[--l],!(d>r)&&(n[d*2+1]!==f&&(e.opt_len+=(f-n[d*2+1])*n[d*2],n[d*2+1]=f),u--)}},ne=(e,t,n)=>{let r=Array(16),i=0,a,o;for(a=1;a<=h;a++)i=i+n[a-1]<<1,r[a]=i;for(o=0;o<=t;o++){let t=e[o*2+1];t!==0&&(e[o*2]=ee(r[t]++,t))}},re=e=>{let t;for(t=0;t<d;t++)e.dyn_ltree[t*2]=0;for(t=0;t<f;t++)e.dyn_dtree[t*2]=0;for(t=0;t<p;t++)e.bl_tree[t*2]=0;e.dyn_ltree[_*2]=1,e.opt_len=e.static_len=0,e.sym_next=e.matches=0},ie=e=>{e.bi_valid>8?M(e,e.bi_buf):e.bi_valid>0&&(e.pending_buf[e.pending++]=e.bi_buf),e.bi_buf=0,e.bi_valid=0},ae=(e,t,n,r)=>{let i=t*2,a=n*2;return e[i]<e[a]||e[i]===e[a]&&r[t]<=r[n]},oe=(e,t,n)=>{let r=e.heap[n],i=n<<1;for(;i<=e.heap_len&&(i<e.heap_len&&ae(t,e.heap[i+1],e.heap[i],e.depth)&&i++,!ae(t,r,e.heap[i],e.depth));)e.heap[n]=e.heap[i],n=i,i<<=1;e.heap[n]=r},se=(e,t,n)=>{let r,i,a=0,o,s;if(e.sym_next!==0)do r=e.pending_buf[e.sym_buf+a++]&255,r+=(e.pending_buf[e.sym_buf+a++]&255)<<8,i=e.pending_buf[e.sym_buf+a++],r===0?P(e,i,t):(o=O[i],P(e,o+u+1,t),s=x[o],s!==0&&(i-=k[o],N(e,i,s)),r--,o=j(r),P(e,o,n),s=S[o],s!==0&&(r-=A[o],N(e,r,s)));while(a<e.sym_next);P(e,_,t)},ce=(e,t)=>{let n=t.dyn_tree,r=t.stat_desc.static_tree,i=t.stat_desc.has_stree,a=t.stat_desc.elems,o,s,c=-1,l;for(e.heap_len=0,e.heap_max=m,o=0;o<a;o++)n[o*2]===0?n[o*2+1]=0:(e.heap[++e.heap_len]=c=o,e.depth[o]=0);for(;e.heap_len<2;)l=e.heap[++e.heap_len]=c<2?++c:0,n[l*2]=1,e.depth[l]=0,e.opt_len--,i&&(e.static_len-=r[l*2+1]);for(t.max_code=c,o=e.heap_len>>1;o>=1;o--)oe(e,n,o);l=a;do o=e.heap[1],e.heap[1]=e.heap[e.heap_len--],oe(e,n,1),s=e.heap[1],e.heap[--e.heap_max]=o,e.heap[--e.heap_max]=s,n[l*2]=n[o*2]+n[s*2],e.depth[l]=(e.depth[o]>=e.depth[s]?e.depth[o]:e.depth[s])+1,n[o*2+1]=n[s*2+1]=l,e.heap[1]=l++,oe(e,n,1);while(e.heap_len>=2);e.heap[--e.heap_max]=e.heap[1],te(e,t),ne(n,c,e.bl_count)},le=(e,t,n)=>{let r,i=-1,a,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),t[(n+1)*2+1]=65535,r=0;r<=n;r++)a=o,o=t[(r+1)*2+1],!(++s<c&&a===o)&&(s<l?e.bl_tree[a*2]+=s:a===0?s<=10?e.bl_tree[y*2]++:e.bl_tree[b*2]++:(a!==i&&e.bl_tree[a*2]++,e.bl_tree[v*2]++),s=0,i=a,o===0?(c=138,l=3):a===o?(c=6,l=3):(c=7,l=4))},ue=(e,t,n)=>{let r,i=-1,a,o=t[1],s=0,c=7,l=4;for(o===0&&(c=138,l=3),r=0;r<=n;r++)if(a=o,o=t[(r+1)*2+1],!(++s<c&&a===o)){if(s<l)do P(e,a,e.bl_tree);while(--s!==0);else a===0?s<=10?(P(e,y,e.bl_tree),N(e,s-3,3)):(P(e,b,e.bl_tree),N(e,s-11,7)):(a!==i&&(P(e,a,e.bl_tree),s--),P(e,v,e.bl_tree),N(e,s-3,2));s=0,i=a,o===0?(c=138,l=3):a===o?(c=6,l=3):(c=7,l=4)}},de=e=>{let t;for(le(e,e.dyn_ltree,e.l_desc.max_code),le(e,e.dyn_dtree,e.d_desc.max_code),ce(e,e.bl_desc),t=p-1;t>=3&&e.bl_tree[C[t]*2+1]===0;t--);return e.opt_len+=3*(t+1)+5+5+4,t},fe=(e,t,n,r)=>{let i;for(N(e,t-257,5),N(e,n-1,5),N(e,r-4,4),i=0;i<r;i++)N(e,e.bl_tree[C[i]*2+1],3);ue(e,e.dyn_ltree,t-1),ue(e,e.dyn_dtree,n-1)},pe=e=>{let t=4093624447,i;for(i=0;i<=31;i++,t>>>=1)if(t&1&&e.dyn_ltree[i*2]!==0)return n;if(e.dyn_ltree[18]!==0||e.dyn_ltree[20]!==0||e.dyn_ltree[26]!==0)return r;for(i=32;i<u;i++)if(e.dyn_ltree[i*2]!==0)return r;return n},me=(e,t,n,r)=>{N(e,(o<<1)+ +!!r,3),ie(e),M(e,n),M(e,~n),n&&e.pending_buf.set(e.window.subarray(t,t+n),e.pending),e.pending+=n},he=(e,n,r,a)=>{let o,l,u=0;e.level>0?(e.strm.data_type===i&&(e.strm.data_type=pe(e)),ce(e,e.l_desc),ce(e,e.d_desc),u=de(e),o=e.opt_len+3+7>>>3,l=e.static_len+3+7>>>3,(l<=o||e.strategy===t)&&(o=l)):o=l=r+5,r+4<=o&&n!==-1?me(e,n,r,a):e.strategy===t||l===o?(N(e,(s<<1)+ +!!a,3),se(e,T,E)):(N(e,(c<<1)+ +!!a,3),fe(e,e.l_desc.max_code+1,e.d_desc.max_code+1,u+1),se(e,e.dyn_ltree,e.dyn_dtree)),re(e),a&&ie(e)},F=(e,t,n)=>(e.pending_buf[e.sym_buf+e.sym_next++]=t,e.pending_buf[e.sym_buf+e.sym_next++]=t>>8,e.pending_buf[e.sym_buf+e.sym_next++]=n,t===0?e.dyn_ltree[n*2]++:(e.matches++,t--,e.dyn_ltree[(O[n]+u+1)*2]++,e.dyn_dtree[j(t)*2]++),e.sym_next===e.sym_end),ge=(e,t,n,r)=>{let i=e&65535|0,a=e>>>16&65535|0,o=0;for(;n!==0;){o=n>2e3?2e3:n,n-=o;do i=i+t[r++]|0,a=a+i|0;while(--o);i%=65521,a%=65521}return i|a<<16|0},_e=(()=>{let e=new Uint32Array(256*8),t;for(let n=0;n<256;n++){t=n;for(let e=0;e<8;e++)t=t&1?3988292384^t>>>1:t>>>1;e[n]=t}for(let n=0;n<256;n++){t=e[n];for(let r=256;r<256*8;r+=256)t=e[t&255]^t>>>8,e[r+n]=t}return e})(),I=(e,t,n,r)=>{let i=_e,a=r+n,o=r;e^=-1;for(let n=a-7;o<n;o+=8)e^=t[o]|t[o+1]<<8|t[o+2]<<16|t[o+3]<<24,e=i[1792+(e&255)]^i[1536+(e>>>8&255)]^i[1280+(e>>>16&255)]^i[1024+(e>>>24)]^i[768+t[o+4]]^i[512+t[o+5]]^i[256+t[o+6]]^i[t[o+7]];for(;o<a;o++)e=e>>>8^i[(e^t[o])&255];return e^-1},ve={2:`need dictionary`,1:`stream end`,0:``,"-1":`file error`,"-2":`stream error`,"-3":`data error`,"-4":`insufficient memory`,"-5":`buffer error`,"-6":`incompatible version`},L=3,ye=258,R=262,z=1,be=2,xe=3,Se=4,Ce=e=>{let t,n,r,i=e.w_size;t=e.hash_size,r=t;do n=e.head[--r],e.head[r]=n>=i?n-i:0;while(--t);t=i,r=t;do n=e.prev[--r],e.prev[r]=n>=i?n-i:0;while(--t)},we=(e,t,n)=>(t<<e.hash_shift^n)&e.hash_mask,B=(e,t)=>{let n;if(e.legacy_hash)n=e.ins_h=we(e,e.ins_h,e.window[t+L-1]);else{let r=e.window,i=r[t]|r[t+1]<<8|r[t+2]<<16|r[t+3]<<24;n=e.ins_h=Math.imul(i,66521)+66521>>>16&e.hash_mask}let r=e.prev[t&e.w_mask]=e.head[n];return e.head[n]=t,r},Te=e=>{let t=e.state,n=t.pending;n>e.avail_out&&(n=e.avail_out),n!==0&&(e.output.set(t.pending_buf.subarray(t.pending_out,t.pending_out+n),e.next_out),e.next_out+=n,t.pending_out+=n,e.total_out+=n,e.avail_out-=n,t.pending-=n,t.pending===0&&(t.pending_out=0))},V=(e,t)=>{he(e,e.block_start>=0?e.block_start:-1,e.strstart-e.block_start,t),e.block_start=e.strstart,Te(e.strm)},Ee=(e,t,n,r)=>{let i=e.avail_in;return i>r&&(i=r),i===0?0:(e.avail_in-=i,t.set(e.input.subarray(e.next_in,e.next_in+i),n),e.state.wrap===1?e.adler=ge(e.adler,t,i,n):e.state.wrap===2&&(e.adler=I(e.adler,t,i,n)),e.next_in+=i,e.total_in+=i,i)},De=(e,t)=>{let n=e.max_chain_length,r=e.strstart,i,a,o=e.prev_length,s=e.nice_match,c=e.strstart>e.w_size-R?e.strstart-(e.w_size-R):0,l=e.window,u=e.w_mask,d=e.prev,f=e.strstart+ye,p=l[r+o-1],m=l[r+o];e.prev_length>=e.good_match&&(n>>=2),s>e.lookahead&&(s=e.lookahead);do{if(i=t,l[i+o]!==m||l[i+o-1]!==p||l[i]!==l[r]||l[++i]!==l[r+1])continue;r+=2,i++;do;while(l[++r]===l[++i]&&l[++r]===l[++i]&&l[++r]===l[++i]&&l[++r]===l[++i]&&l[++r]===l[++i]&&l[++r]===l[++i]&&l[++r]===l[++i]&&l[++r]===l[++i]&&r<f);if(a=ye-(f-r),r=f-ye,a>o){if(e.match_start=t,o=a,a>=s)break;p=l[r+o-1],m=l[r+o]}}while((t=d[t&u])>c&&--n!==0);return o<=e.lookahead?o:e.lookahead},Oe=e=>{let t=e.w_size,n,r,i;do{if(r=e.window_size-e.lookahead-e.strstart,e.strstart>=t+(t-R)&&(e.window.set(e.window.subarray(t,t+t-r),0),e.match_start-=t,e.strstart-=t,e.block_start-=t,e.insert>e.strstart&&(e.insert=e.strstart),Ce(e),r+=t),e.strm.avail_in===0)break;if(n=Ee(e.strm,e.window,e.strstart+e.lookahead,r),e.lookahead+=n,!e.legacy_hash){if(e.lookahead+e.insert>L)for(i=e.strstart-e.insert;e.insert&&(B(e,i),i++,e.insert--,!(e.lookahead+e.insert<=L)););}else if(e.lookahead+e.insert>=L)for(i=e.strstart-e.insert,e.ins_h=e.window[i],e.ins_h=we(e,e.ins_h,e.window[i+1]);e.insert&&(B(e,i),i++,e.insert--,!(e.lookahead+e.insert<L)););}while(e.lookahead<R&&e.strm.avail_in!==0)},ke=(e,t)=>{let n=e.pending_buf_size-5>e.w_size?e.w_size:e.pending_buf_size-5,r,i,a,o=0,s=e.strm.avail_in;do{if(r=65535,a=e.bi_valid+42>>3,e.strm.avail_out<a||(a=e.strm.avail_out-a,i=e.strstart-e.block_start,r>i+e.strm.avail_in&&(r=i+e.strm.avail_in),r>a&&(r=a),r<n&&(r===0&&t!==4||t===0||r!==i+e.strm.avail_in)))break;o=+(t===4&&r===i+e.strm.avail_in),me(e,0,0,o),e.pending_buf[e.pending-4]=r,e.pending_buf[e.pending-3]=r>>8,e.pending_buf[e.pending-2]=~r,e.pending_buf[e.pending-1]=~r>>8,Te(e.strm),i&&(i>r&&(i=r),e.strm.output.set(e.window.subarray(e.block_start,e.block_start+i),e.strm.next_out),e.strm.next_out+=i,e.strm.avail_out-=i,e.strm.total_out+=i,e.block_start+=i,r-=i),r&&(Ee(e.strm,e.strm.output,e.strm.next_out,r),e.strm.next_out+=r,e.strm.avail_out-=r,e.strm.total_out+=r)}while(o===0);return s-=e.strm.avail_in,s&&(s>=e.w_size?(e.matches=2,e.window.set(e.strm.input.subarray(e.strm.next_in-e.w_size,e.strm.next_in),0),e.strstart=e.w_size,e.insert=e.strstart):(e.window_size-e.strstart<=s&&(e.strstart-=e.w_size,e.window.set(e.window.subarray(e.w_size,e.w_size+e.strstart),0),e.matches<2&&e.matches++,e.insert>e.strstart&&(e.insert=e.strstart)),e.window.set(e.strm.input.subarray(e.strm.next_in-s,e.strm.next_in),e.strstart),e.strstart+=s,e.insert+=s>e.w_size-e.insert?e.w_size-e.insert:s),e.block_start=e.strstart),e.high_water<e.strstart&&(e.high_water=e.strstart),o?Se:t!==0&&t!==4&&e.strm.avail_in===0&&e.strstart===e.block_start?be:(a=e.window_size-e.strstart,e.strm.avail_in>a&&e.block_start>=e.w_size&&(e.block_start-=e.w_size,e.strstart-=e.w_size,e.window.set(e.window.subarray(e.w_size,e.w_size+e.strstart),0),e.matches<2&&e.matches++,a+=e.w_size,e.insert>e.strstart&&(e.insert=e.strstart)),a>e.strm.avail_in&&(a=e.strm.avail_in),a&&(Ee(e.strm,e.window,e.strstart,a),e.strstart+=a,e.insert+=a>e.w_size-e.insert?e.w_size-e.insert:a),e.high_water<e.strstart&&(e.high_water=e.strstart),a=e.bi_valid+42>>3,a=e.pending_buf_size-a>65535?65535:e.pending_buf_size-a,n=a>e.w_size?e.w_size:a,i=e.strstart-e.block_start,(i>=n||(i||t===4)&&t!==0&&e.strm.avail_in===0&&i<=a)&&(r=i>a?a:i,o=+(t===4&&e.strm.avail_in===0&&r===i),me(e,e.block_start,r,o),e.block_start+=r,Te(e.strm)),o?xe:z)},Ae=(e,t)=>{let n,r;for(;;){if(e.lookahead<R){if(Oe(e),e.lookahead<R&&t===0)return z;if(e.lookahead===0)break}if(n=0,e.lookahead>=L&&(n=B(e,e.strstart)),n!==0&&e.strstart-n<=e.w_size-R&&(e.match_length=De(e,n)),e.match_length>=L)if(r=F(e,e.strstart-e.match_start,e.match_length-L),e.lookahead-=e.match_length,e.match_length<=e.max_lazy_match&&e.lookahead>=L){e.match_length--;do e.strstart++,n=B(e,e.strstart);while(--e.match_length!==0);e.strstart++}else e.strstart+=e.match_length,e.match_length=0,e.legacy_hash&&(e.ins_h=e.window[e.strstart],e.ins_h=we(e,e.ins_h,e.window[e.strstart+1]));else r=F(e,0,e.window[e.strstart]),e.lookahead--,e.strstart++;if(r&&(V(e,!1),e.strm.avail_out===0))return z}return e.insert=e.strstart<L-1?e.strstart:L-1,t===4?(V(e,!0),e.strm.avail_out===0?xe:Se):e.sym_next&&(V(e,!1),e.strm.avail_out===0)?z:be},H=(e,t)=>{let n,r,i;for(;;){if(e.lookahead<R){if(Oe(e),e.lookahead<R&&t===0)return z;if(e.lookahead===0)break}if(n=0,e.lookahead>=L&&(n=B(e,e.strstart)),e.prev_length=e.match_length,e.prev_match=e.match_start,e.match_length=L-1,n!==0&&e.prev_length<e.max_lazy_match&&e.strstart-n<=e.w_size-R&&(e.match_length=De(e,n),e.match_length<=5&&(e.strategy===1||e.match_length===L&&e.strstart-e.match_start>4096)&&(e.match_length=L-1)),e.prev_length>=L&&e.match_length<=e.prev_length){i=e.strstart+e.lookahead-L,r=F(e,e.strstart-1-e.prev_match,e.prev_length-L),e.lookahead-=e.prev_length-1,e.prev_length-=2;do++e.strstart<=i&&(n=B(e,e.strstart));while(--e.prev_length!==0);if(e.match_available=0,e.match_length=L-1,e.strstart++,r&&(V(e,!1),e.strm.avail_out===0))return z}else if(e.match_available){if(r=F(e,0,e.window[e.strstart-1]),r&&V(e,!1),e.strstart++,e.lookahead--,e.strm.avail_out===0)return z}else e.match_available=1,e.strstart++,e.lookahead--}return e.match_available&&(r=F(e,0,e.window[e.strstart-1]),e.match_available=0),e.insert=e.strstart<L-1?e.strstart:L-1,t===4?(V(e,!0),e.strm.avail_out===0?xe:Se):e.sym_next&&(V(e,!1),e.strm.avail_out===0)?z:be},U=class{constructor(e,t,n,r,i){this.good_length=e,this.max_lazy=t,this.nice_length=n,this.max_chain=r,this.func=i}};new U(0,0,0,0,ke),new U(4,4,8,4,Ae),new U(4,5,16,8,Ae),new U(4,6,32,32,Ae),new U(4,4,16,16,H),new U(8,16,32,32,H),new U(8,16,128,128,H),new U(8,32,128,256,H),new U(32,128,258,1024,H),new U(32,258,258,4096,H);var W=16209,je=16191;function Me(e,t){let n,r,i,a,o,s,c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E=e.state;n=e.next_in,w=e.input,r=n+(e.avail_in-5),i=e.next_out,T=e.output,a=i-(t-e.avail_out),o=i+(e.avail_out-257),s=E.dmax,c=E.wsize,l=E.whave,u=E.wnext,d=E.window,f=E.hold,p=E.bits,m=E.lencode,h=E.distcode,g=(1<<E.lenbits)-1,_=(1<<E.distbits)-1;top:do{p<15&&(f+=w[n++]<<p,p+=8,f+=w[n++]<<p,p+=8),v=m[f&g];dolen:for(;;){if(y=v>>>24,f>>>=y,p-=y,y=v>>>16&255,y===0)T[i++]=v&65535;else if(y&16){b=v&65535,y&=15,y&&(p<y&&(f+=w[n++]<<p,p+=8),b+=f&(1<<y)-1,f>>>=y,p-=y),p<15&&(f+=w[n++]<<p,p+=8,f+=w[n++]<<p,p+=8),v=h[f&_];dodist:for(;;){if(y=v>>>24,f>>>=y,p-=y,y=v>>>16&255,y&16){if(x=v&65535,y&=15,p<y&&(f+=w[n++]<<p,p+=8,p<y&&(f+=w[n++]<<p,p+=8)),x+=f&(1<<y)-1,x>s){e.msg=`invalid distance too far back`,E.mode=W;break top}if(f>>>=y,p-=y,y=i-a,x>y){if(y=x-y,y>l&&E.sane){e.msg=`invalid distance too far back`,E.mode=W;break top}if(S=0,C=d,u===0){if(S+=c-y,y<b){b-=y;do T[i++]=d[S++];while(--y);S=i-x,C=T}}else if(u<y){if(S+=c+u-y,y-=u,y<b){b-=y;do T[i++]=d[S++];while(--y);if(S=0,u<b){y=u,b-=y;do T[i++]=d[S++];while(--y);S=i-x,C=T}}}else if(S+=u-y,y<b){b-=y;do T[i++]=d[S++];while(--y);S=i-x,C=T}for(;b>2;)T[i++]=C[S++],T[i++]=C[S++],T[i++]=C[S++],b-=3;b&&(T[i++]=C[S++],b>1&&(T[i++]=C[S++]))}else{S=i-x;do T[i++]=T[S++],T[i++]=T[S++],T[i++]=T[S++],b-=3;while(b>2);b&&(T[i++]=T[S++],b>1&&(T[i++]=T[S++]))}}else if(y&64){e.msg=`invalid distance code`,E.mode=W;break top}else{v=h[(v&65535)+(f&(1<<y)-1)];continue dodist}break}}else if(!(y&64)){v=m[(v&65535)+(f&(1<<y)-1)];continue dolen}else if(y&32){E.mode=je;break top}else{e.msg=`invalid literal/length code`,E.mode=W;break top}break}}while(n<r&&i<o);b=p>>3,n-=b,p-=b<<3,f&=(1<<p)-1,e.next_in=n,e.next_out=i,e.avail_in=n<r?5+(r-n):5-(n-r),e.avail_out=i<o?257+(o-i):257-(i-o),E.hold=f,E.bits=p}var G=15,Ne=852,Pe=592,Fe=0,Ie=1,Le=2,Re=new Uint16Array([3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0]),ze=new Uint8Array([16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,199,75]),Be=new Uint16Array([1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0]),Ve=new Uint8Array([16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64]),K=(e,t,n,r,i,a,o,s)=>{let c=s.bits,l=0,u=0,d=0,f=0,p=0,m=0,h=0,g=0,_=0,v=0,y,b,x,S,C,w=null,T,E=new Uint16Array(16),D=new Uint16Array(16),O=null,k,A,j;for(l=0;l<=G;l++)E[l]=0;for(u=0;u<r;u++)E[t[n+u]]++;for(p=c,f=G;f>=1&&E[f]===0;f--);if(p>f&&(p=f),f===0)return i[a++]=20971520,i[a++]=20971520,s.bits=1,0;for(d=1;d<f&&E[d]===0;d++);for(p<d&&(p=d),g=1,l=1;l<=G;l++)if(g<<=1,g-=E[l],g<0)return-1;if(g>0&&(e===Fe||f!==1))return-1;for(D[1]=0,l=1;l<G;l++)D[l+1]=D[l]+E[l];for(u=0;u<r;u++)t[n+u]!==0&&(o[D[t[n+u]]++]=u);if(e===Fe?(w=O=o,T=20):e===Ie?(w=Re,O=ze,T=257):(w=Be,O=Ve,T=0),v=0,u=0,l=d,C=a,m=p,h=0,x=-1,_=1<<p,S=_-1,e===Ie&&_>Ne||e===Le&&_>Pe)return 1;for(;;){k=l-h,o[u]+1<T?(A=0,j=o[u]):o[u]>=T?(A=O[o[u]-T],j=w[o[u]-T]):(A=96,j=0),y=1<<l-h,b=1<<m,d=b;do b-=y,i[C+(v>>h)+b]=k<<24|A<<16|j|0;while(b!==0);for(y=1<<l-1;v&y;)y>>=1;if(y===0?v=0:(v&=y-1,v+=y),u++,--E[l]===0){if(l===f)break;l=t[n+o[u]]}if(l>p&&(v&S)!==x){for(h===0&&(h=p),C+=d,m=l-h,g=1<<m;m+h<f&&(g-=E[m+h],!(g<=0));)m++,g<<=1;if(_+=1<<m,e===Ie&&_>Ne||e===Le&&_>Pe)return 1;x=v&S,i[x]=p<<24|m<<16|C-a|0}}return v!==0&&(i[C+v]=l-h<<24|4194304),s.bits=p,0},He=0,Ue=1,We=2,q=16180,Ge=16181,Ke=16182,qe=16183,Je=16184,Ye=16185,Xe=16186,Ze=16187,Qe=16188,$e=16189,J=16190,Y=16191,et=16192,tt=16193,nt=16194,rt=16195,it=16196,at=16197,ot=16198,st=16199,ct=16200,lt=16201,ut=16202,dt=16203,ft=16204,pt=16205,mt=16206,ht=16207,gt=16208,X=16209,_t=16210,vt=16211,yt=852,bt=592,xt=e=>(e>>>24&255)+(e>>>8&65280)+((e&65280)<<8)+((e&255)<<24),St=class{constructor(){this.strm=null,this.mode=0,this.last=!1,this.wrap=0,this.havedict=!1,this.flags=0,this.dmax=0,this.check=0,this.total=0,this.head=null,this.wbits=0,this.wsize=0,this.whave=0,this.wnext=0,this.window=null,this.hold=0,this.bits=0,this.length=0,this.offset=0,this.extra=0,this.lencode=null,this.distcode=null,this.lenbits=0,this.distbits=0,this.ncode=0,this.nlen=0,this.ndist=0,this.have=0,this.next=null,this.lens=new Uint16Array(320),this.work=new Uint16Array(288),this.lendyn=null,this.distdyn=null,this.sane=0,this.back=0,this.was=0}},Z=e=>{if(!e)return 1;let t=e.state;return+(!t||t.strm!==e||t.mode<q||t.mode>vt)},Ct=e=>{if(Z(e))return-2;let t=e.state;return e.total_in=e.total_out=t.total=0,e.msg=``,t.wrap&&(e.adler=t.wrap&1),t.mode=q,t.last=0,t.havedict=0,t.flags=-1,t.dmax=32768,t.head=null,t.hold=0,t.bits=0,t.lencode=t.lendyn=new Int32Array(yt),t.distcode=t.distdyn=new Int32Array(bt),t.sane=1,t.back=-1,0},wt=e=>{if(Z(e))return-2;let t=e.state;return t.wsize=0,t.whave=0,t.wnext=0,Ct(e)},Tt=(e,t)=>{let n;if(Z(e))return-2;let r=e.state;return t<0?(n=0,t=-t):(n=(t>>4)+5,t<48&&(t&=15)),t&&(t<8||t>15)?-2:(r.window!==null&&r.wbits!==t&&(r.window=null),r.wrap=n,r.wbits=t,wt(e))},Et=(e,t)=>{if(!e)return-2;let n=new St;e.state=n,n.strm=e,n.window=null,n.mode=q;let r=Tt(e,t);return r!==0&&(e.state=null),r},Dt=!0,Ot,kt,At=e=>{if(Dt){Ot=new Int32Array(512),kt=new Int32Array(32);let t=0;for(;t<144;)e.lens[t++]=8;for(;t<256;)e.lens[t++]=9;for(;t<280;)e.lens[t++]=7;for(;t<288;)e.lens[t++]=8;for(K(Ue,e.lens,0,288,Ot,0,e.work,{bits:9}),t=0;t<32;)e.lens[t++]=5;K(We,e.lens,0,32,kt,0,e.work,{bits:5}),Dt=!1}e.lencode=Ot,e.lenbits=9,e.distcode=kt,e.distbits=5},jt=(e,t,n,r)=>{let i,a=e.state;return a.window===null&&(a.window=new Uint8Array(1<<a.wbits)),a.wsize===0&&(a.wsize=1<<a.wbits,a.wnext=0,a.whave=0),r>=a.wsize?(a.window.set(t.subarray(n-a.wsize,n),0),a.wnext=0,a.whave=a.wsize):(i=a.wsize-a.wnext,i>r&&(i=r),a.window.set(t.subarray(n-r,n-r+i),a.wnext),r-=i,r?(a.window.set(t.subarray(n-r,n),0),a.wnext=r,a.whave=a.wsize):(a.wnext+=i,a.wnext===a.wsize&&(a.wnext=0),a.whave<a.wsize&&(a.whave+=i))),0},Mt=(e,t)=>{let n,r,i,a,o,s,c,l,u,d,f,p,m,h,g=0,_,v,y,b,x,S,C,w,T=new Uint8Array(4),E,D,O=new Uint8Array([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]);if(Z(e)||!e.output||!e.input&&e.avail_in!==0)return-2;n=e.state,n.mode===Y&&(n.mode=et),o=e.next_out,i=e.output,c=e.avail_out,a=e.next_in,r=e.input,s=e.avail_in,l=n.hold,u=n.bits,d=s,f=c,w=0;inf_leave:for(;;)switch(n.mode){case q:if(n.wrap===0){n.mode=et;break}for(;u<16;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if(n.wrap&2&&l===35615){n.wbits===0&&(n.wbits=15),n.check=0,T[0]=l&255,T[1]=l>>>8&255,n.check=I(n.check,T,2,0),l=0,u=0,n.mode=Ge;break}if(n.head&&(n.head.done=!1),!(n.wrap&1)||(((l&255)<<8)+(l>>8))%31){e.msg=`incorrect header check`,n.mode=X;break}if((l&15)!=8){e.msg=`unknown compression method`,n.mode=X;break}if(l>>>=4,u-=4,C=(l&15)+8,n.wbits===0&&(n.wbits=C),C>15||C>n.wbits){e.msg=`invalid window size`,n.mode=X;break}n.dmax=1<<n.wbits,n.flags=0,e.adler=n.check=1,n.mode=l&512?$e:Y,l=0,u=0;break;case Ge:for(;u<16;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if(n.flags=l,(n.flags&255)!=8){e.msg=`unknown compression method`,n.mode=X;break}if(n.flags&57344){e.msg=`unknown header flags set`,n.mode=X;break}n.head&&(n.head.text=l>>8&1),n.flags&512&&n.wrap&4&&(T[0]=l&255,T[1]=l>>>8&255,n.check=I(n.check,T,2,0)),l=0,u=0,n.mode=Ke;case Ke:for(;u<32;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}n.head&&(n.head.time=l>>>0),n.flags&512&&n.wrap&4&&(T[0]=l&255,T[1]=l>>>8&255,T[2]=l>>>16&255,T[3]=l>>>24&255,n.check=I(n.check,T,4,0)),l=0,u=0,n.mode=qe;case qe:for(;u<16;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}n.head&&(n.head.xflags=l&255,n.head.os=l>>8),n.flags&512&&n.wrap&4&&(T[0]=l&255,T[1]=l>>>8&255,n.check=I(n.check,T,2,0)),l=0,u=0,n.mode=Je;case Je:if(n.flags&1024){for(;u<16;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}n.length=l,n.head&&(n.head.extra_len=l),n.flags&512&&n.wrap&4&&(T[0]=l&255,T[1]=l>>>8&255,n.check=I(n.check,T,2,0)),l=0,u=0}else n.head&&(n.head.extra=null);n.mode=Ye;case Ye:if(n.flags&1024&&(p=n.length,p>s&&(p=s),p&&(n.head&&(C=n.head.extra_len-n.length,n.head.extra||(n.head.extra=new Uint8Array(n.head.extra_len)),n.head.extra.set(r.subarray(a,a+p),C)),n.flags&512&&n.wrap&4&&(n.check=I(n.check,r,p,a)),s-=p,a+=p,n.length-=p),n.length))break inf_leave;n.length=0,n.mode=Xe;case Xe:if(n.flags&2048){if(s===0)break inf_leave;p=0;do C=r[a+p++],n.head&&C&&n.length<65536&&(n.head.name+=String.fromCharCode(C),n.length++);while(C&&p<s);if(n.flags&512&&n.wrap&4&&(n.check=I(n.check,r,p,a)),s-=p,a+=p,C)break inf_leave}else n.head&&(n.head.name=null);n.length=0,n.mode=Ze;case Ze:if(n.flags&4096){if(s===0)break inf_leave;p=0;do C=r[a+p++],n.head&&C&&n.length<65536&&(n.head.comment+=String.fromCharCode(C),n.length++);while(C&&p<s);if(n.flags&512&&n.wrap&4&&(n.check=I(n.check,r,p,a)),s-=p,a+=p,C)break inf_leave}else n.head&&(n.head.comment=null);n.mode=Qe;case Qe:if(n.flags&512){for(;u<16;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if(n.wrap&4&&l!==(n.check&65535)){e.msg=`header crc mismatch`,n.mode=X;break}l=0,u=0}n.head&&(n.head.hcrc=n.flags>>9&1,n.head.done=!0),e.adler=n.check=0,n.mode=Y;break;case $e:for(;u<32;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}e.adler=n.check=xt(l),l=0,u=0,n.mode=J;case J:if(n.havedict===0)return e.next_out=o,e.avail_out=c,e.next_in=a,e.avail_in=s,n.hold=l,n.bits=u,2;e.adler=n.check=1,n.mode=Y;case Y:if(t===5||t===6)break inf_leave;case et:if(n.last){l>>>=u&7,u-=u&7,n.mode=mt;break}for(;u<3;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}switch(n.last=l&1,l>>>=1,--u,l&3){case 0:n.mode=tt;break;case 1:if(At(n),n.mode=st,t===6){l>>>=2,u-=2;break inf_leave}break;case 2:n.mode=it;break;case 3:e.msg=`invalid block type`,n.mode=X}l>>>=2,u-=2;break;case tt:for(l>>>=u&7,u-=u&7;u<32;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if((l&65535)!=(l>>>16^65535)){e.msg=`invalid stored block lengths`,n.mode=X;break}if(n.length=l&65535,l=0,u=0,n.mode=nt,t===6)break inf_leave;case nt:n.mode=rt;case rt:if(p=n.length,p){if(p>s&&(p=s),p>c&&(p=c),p===0)break inf_leave;i.set(r.subarray(a,a+p),o),s-=p,a+=p,c-=p,o+=p,n.length-=p;break}n.mode=Y;break;case it:for(;u<14;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if(n.nlen=(l&31)+257,l>>>=5,u-=5,n.ndist=(l&31)+1,l>>>=5,u-=5,n.ncode=(l&15)+4,l>>>=4,u-=4,n.nlen>286||n.ndist>30){e.msg=`too many length or distance symbols`,n.mode=X;break}n.have=0,n.mode=at;case at:for(;n.have<n.ncode;){for(;u<3;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}n.lens[O[n.have++]]=l&7,l>>>=3,u-=3}for(;n.have<19;)n.lens[O[n.have++]]=0;if(n.lencode=n.lendyn,n.lenbits=7,E={bits:n.lenbits},w=K(He,n.lens,0,19,n.lencode,0,n.work,E),n.lenbits=E.bits,w){e.msg=`invalid code lengths set`,n.mode=X;break}n.have=0,n.mode=ot;case ot:for(;n.have<n.nlen+n.ndist;){for(;g=n.lencode[l&(1<<n.lenbits)-1],_=g>>>24,v=g>>>16&255,y=g&65535,!(_<=u);){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if(y<16)l>>>=_,u-=_,n.lens[n.have++]=y;else{if(y===16){for(D=_+2;u<D;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if(l>>>=_,u-=_,n.have===0){e.msg=`invalid bit length repeat`,n.mode=X;break}C=n.lens[n.have-1],p=3+(l&3),l>>>=2,u-=2}else if(y===17){for(D=_+3;u<D;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}l>>>=_,u-=_,C=0,p=3+(l&7),l>>>=3,u-=3}else{for(D=_+7;u<D;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}l>>>=_,u-=_,C=0,p=11+(l&127),l>>>=7,u-=7}if(n.have+p>n.nlen+n.ndist){e.msg=`invalid bit length repeat`,n.mode=X;break}for(;p--;)n.lens[n.have++]=C}}if(n.mode===X)break;if(n.lens[256]===0){e.msg=`invalid code -- missing end-of-block`,n.mode=X;break}if(n.lenbits=9,E={bits:n.lenbits},w=K(Ue,n.lens,0,n.nlen,n.lencode,0,n.work,E),n.lenbits=E.bits,w){e.msg=`invalid literal/lengths set`,n.mode=X;break}if(n.distbits=6,n.distcode=n.distdyn,E={bits:n.distbits},w=K(We,n.lens,n.nlen,n.ndist,n.distcode,0,n.work,E),n.distbits=E.bits,w){e.msg=`invalid distances set`,n.mode=X;break}if(n.mode=st,t===6)break inf_leave;case st:n.mode=ct;case ct:if(s>=6&&c>=258){e.next_out=o,e.avail_out=c,e.next_in=a,e.avail_in=s,n.hold=l,n.bits=u,Me(e,f),o=e.next_out,i=e.output,c=e.avail_out,a=e.next_in,r=e.input,s=e.avail_in,l=n.hold,u=n.bits,n.mode===Y&&(n.back=-1);break}for(n.back=0;g=n.lencode[l&(1<<n.lenbits)-1],_=g>>>24,v=g>>>16&255,y=g&65535,!(_<=u);){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if(v&&!(v&240)){for(b=_,x=v,S=y;g=n.lencode[S+((l&(1<<b+x)-1)>>b)],_=g>>>24,v=g>>>16&255,y=g&65535,!(b+_<=u);){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}l>>>=b,u-=b,n.back+=b}if(l>>>=_,u-=_,n.back+=_,n.length=y,v===0){n.mode=pt;break}if(v&32){n.back=-1,n.mode=Y;break}if(v&64){e.msg=`invalid literal/length code`,n.mode=X;break}n.extra=v&15,n.mode=lt;case lt:if(n.extra){for(D=n.extra;u<D;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}n.length+=l&(1<<n.extra)-1,l>>>=n.extra,u-=n.extra,n.back+=n.extra}n.was=n.length,n.mode=ut;case ut:for(;g=n.distcode[l&(1<<n.distbits)-1],_=g>>>24,v=g>>>16&255,y=g&65535,!(_<=u);){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if(!(v&240)){for(b=_,x=v,S=y;g=n.distcode[S+((l&(1<<b+x)-1)>>b)],_=g>>>24,v=g>>>16&255,y=g&65535,!(b+_<=u);){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}l>>>=b,u-=b,n.back+=b}if(l>>>=_,u-=_,n.back+=_,v&64){e.msg=`invalid distance code`,n.mode=X;break}n.offset=y,n.extra=v&15,n.mode=dt;case dt:if(n.extra){for(D=n.extra;u<D;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}n.offset+=l&(1<<n.extra)-1,l>>>=n.extra,u-=n.extra,n.back+=n.extra}if(n.offset>n.dmax){e.msg=`invalid distance too far back`,n.mode=X;break}n.mode=ft;case ft:if(c===0)break inf_leave;if(p=f-c,n.offset>p){if(p=n.offset-p,p>n.whave&&n.sane){e.msg=`invalid distance too far back`,n.mode=X;break}p>n.wnext?(p-=n.wnext,m=n.wsize-p):m=n.wnext-p,p>n.length&&(p=n.length),h=n.window}else h=i,m=o-n.offset,p=n.length;p>c&&(p=c),c-=p,n.length-=p;do i[o++]=h[m++];while(--p);n.length===0&&(n.mode=ct);break;case pt:if(c===0)break inf_leave;i[o++]=n.length,c--,n.mode=ct;break;case mt:if(n.wrap){for(;u<32;){if(s===0)break inf_leave;s--,l|=r[a++]<<u,u+=8}if(f-=c,e.total_out+=f,n.total+=f,n.wrap&4&&f&&(e.adler=n.check=n.flags?I(n.check,i,f,o-f):ge(n.check,i,f,o-f)),f=c,n.wrap&4&&(n.flags?l:xt(l))!==n.check){e.msg=`incorrect data check`,n.mode=X;break}l=0,u=0}n.mode=ht;case ht:if(n.wrap&&n.flags){for(;u<32;){if(s===0)break inf_leave;s--,l+=r[a++]<<u,u+=8}if(n.wrap&4&&l!==(n.total&4294967295)){e.msg=`incorrect length check`,n.mode=X;break}l=0,u=0}n.mode=gt;case gt:w=1;break inf_leave;case X:w=-3;break inf_leave;case _t:return-4;case vt:default:return-2}return e.next_out=o,e.avail_out=c,e.next_in=a,e.avail_in=s,n.hold=l,n.bits=u,(n.wsize||f!==e.avail_out&&n.mode<X&&(n.mode<mt||t!==4))&&jt(e,e.output,e.next_out,f-e.avail_out)?(n.mode=_t,-4):(d-=e.avail_in,f-=e.avail_out,e.total_in+=d,e.total_out+=f,n.total+=f,n.wrap&4&&f&&(e.adler=n.check=n.flags?I(n.check,i,f,e.next_out-f):ge(n.check,i,f,e.next_out-f)),e.data_type=n.bits+(n.last?64:0)+(n.mode===Y?128:0)+(n.mode===st||n.mode===nt?256:0),(d===0&&f===0||t===4)&&w===0&&(w=-5),w)},Nt=e=>{if(Z(e))return-2;let t=e.state;return t.window&&(t.window=null),e.state=null,0},Pt=(e,t)=>{let n=t.length,r,i,a;return Z(e)||(r=e.state,r.wrap!==0&&r.mode!==J)?-2:r.mode===J&&(i=1,i=ge(i,t,n,0),i!==r.check)?-3:(a=jt(e,t,n,n),a?(r.mode=_t,-4):(r.havedict=1,0))},Ft=class{constructor(){this.input=null,this.next_in=0,this.avail_in=0,this.total_in=0,this.output=null,this.next_out=0,this.avail_out=0,this.total_out=0,this.msg=``,this.state=null,this.data_type=2,this.adler=0}},It=e=>{let t=new Uint8Array(e.reduce((e,t)=>e+t.length,0)),n=0;for(let r of e)t.set(r,n),n+=r.length;return t};function Q(e){"@babel/helpers - typeof";return Q=typeof Symbol==`function`&&typeof Symbol.iterator==`symbol`?function(e){return typeof e}:function(e){return e&&typeof Symbol==`function`&&e.constructor===Symbol&&e!==Symbol.prototype?`symbol`:typeof e},Q(e)}function Lt(e,t){if(Q(e)!=`object`||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var r=n.call(e,t||`default`);if(Q(r)!=`object`)return r;throw TypeError(`@@toPrimitive must return a primitive value.`)}return(t===`string`?String:Number)(e)}function Rt(e){var t=Lt(e,`string`);return Q(t)==`symbol`?t:t+``}function $(e,t,n){return(t=Rt(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function zt(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function Bt(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]==null?{}:arguments[t];t%2?zt(Object(n),!0).forEach(function(t){$(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):zt(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var Vt=Object.prototype.toString,Ht={chunkSize:1024*64,windowBits:15,raw:!1,dictionary:new Uint8Array},Ut=class{constructor(e={}){$(this,`options`,void 0),$(this,`err`,void 0),$(this,`msg`,void 0),$(this,`ended`,void 0),$(this,`started`,void 0),$(this,`chunks`,void 0),$(this,`strm`,void 0),$(this,`result`,void 0),this.options=Object.assign({},Ht,e);let t=this.options;t.raw&&t.windowBits>=0&&t.windowBits<16&&(t.windowBits=-t.windowBits,t.windowBits===0&&(t.windowBits=-15)),t.windowBits>=0&&t.windowBits<16&&!e.windowBits&&(t.windowBits+=32),t.windowBits>15&&t.windowBits<48&&(t.windowBits&15||(t.windowBits|=15)),this.err=0,this.msg=``,this.ended=!1,this.started=!1,this.chunks=[],this.result=new Uint8Array,this.strm=new Ft,this.strm.avail_out=0;let n=Et(this.strm,t.windowBits);if(n!==0)throw Error(ve[n]);Vt.call(t.dictionary)===`[object ArrayBuffer]`&&(t.dictionary=new Uint8Array(t.dictionary));let r=t.dictionary;if(t.raw&&r.length&&(n=Pt(this.strm,r),n!==0))throw Error(ve[n])}push(e,t=!1){let n=this.strm,r=this.options.chunkSize,i,a,o;if(this.ended)return this.err===0;for(a=typeof t==`number`?t:t===!0?4:0,Vt.call(e)===`[object ArrayBuffer]`?n.input=new Uint8Array(e):n.input=e,n.next_in=0,n.avail_in=n.input.length,this.started||(this.started=!0,this.onStart(n));;){if(n.avail_out===0&&(n.output=new Uint8Array(r),n.next_out=0,n.avail_out=r),i=Mt(n,a),i===2){let e=this.options.dictionary;e.length&&(i=Pt(n,e),i===0?i=Mt(n,a):i===-3&&(i=2))}for(;n.avail_in>0&&i===1&&n.state.wrap&2&&n.state.flags!==0&&n.input[n.next_in]!==0;)wt(n),i=Mt(n,a);if(i===-2||i===-3||i===2||i===-4)break;if(o=n.avail_out,n.next_out&&(n.avail_out===0||i===1||a>0)&&(this.onData(n.output.length===n.next_out?n.output:n.output.subarray(0,n.next_out)),n.avail_out=0,n.next_out=0),!((i===0||i===-5)&&o===0)){if(i===1){i=Nt(this.strm);break}if(n.avail_in===0){if(a===4){i=Nt(this.strm),i===0&&(i=-5);break}return!0}}}return this.err=i,this.msg=n.msg||ve[i],this.ended=!0,this.onEnd(i),i===0}onStart(e){}onData(e){this.chunks.push(e)}onEnd(e){e===0&&(this.result=It(this.chunks)),this.chunks=[]}};function Wt(e,t={}){let n=new Ut(t);if(n.push(e,!0),n.err)throw Error(n.msg);let r=n.result;return t.toText?new TextDecoder().decode(r):r}function Gt(e,t={}){return Wt(e,Bt(Bt({},t),{},{raw:!0}))}e.Inflate=Ut,e.inflate=Wt,e.ungzip=Wt,e.inflateRaw=Gt});
//# sourceMappingURL=pako_inflate.umd.min.js.map
;

;(function(){
var UPNG = {};

// Make available for import by `require()`
var pako;
var _root = typeof window !== "undefined" ? window : globalThis; _root.UPNG = UPNG;
pako = _root.pako || (typeof exports !== "undefined" ? exports : null) || globalThis.pako;
function log() { if (typeof process=="undefined" || process.env.NODE_ENV=="development") console.log.apply(console, arguments);  }
(function(UPNG, pako){

	

	

UPNG.toRGBA8 = function(out)
{
	var w = out.width, h = out.height;
	if(out.tabs.acTL==null) return [UPNG.toRGBA8.decodeImage(out.data, w, h, out).buffer];
	
	var frms = [];
	if(out.frames[0].data==null) out.frames[0].data = out.data;
	
	var img, empty = new Uint8Array(w*h*4);
	for(var i=0; i<out.frames.length; i++)
	{
		var frm = out.frames[i];
		var fx=frm.rect.x, fy=frm.rect.y, fw = frm.rect.width, fh = frm.rect.height;
		var fdata = UPNG.toRGBA8.decodeImage(frm.data, fw,fh, out);
		
		if(i==0) img = fdata;
		else if(frm.blend  ==0) UPNG._copyTile(fdata, fw, fh, img, w, h, fx, fy, 0);
		else if(frm.blend  ==1) UPNG._copyTile(fdata, fw, fh, img, w, h, fx, fy, 1);
		
		frms.push(img.buffer);  img = img.slice(0);
		
		if     (frm.dispose==0) {}
		else if(frm.dispose==1) UPNG._copyTile(empty, fw, fh, img, w, h, fx, fy, 0);
		else if(frm.dispose==2) {
			var pi = i-1;
			while(out.frames[pi].dispose==2) pi--;
			img = new Uint8Array(frms[pi]).slice(0);
		}
	}
	return frms;
}
UPNG.toRGBA8.decodeImage = function(data, w, h, out)
{
	var area = w*h, bpp = UPNG.decode._getBPP(out);
	var bpl = Math.ceil(w*bpp/8);	// bytes per line

	var bf = new Uint8Array(area*4), bf32 = new Uint32Array(bf.buffer);
	var ctype = out.ctype, depth = out.depth;
	var rs = UPNG._bin.readUshort;
	
	//console.log(ctype, depth);

	if     (ctype==6) { // RGB + alpha
		var qarea = area<<2;
		if(depth== 8) for(var i=0; i<qarea;i++) {  bf[i] = data[i];  /*if((i&3)==3 && data[i]!=0) bf[i]=255;*/ }
		if(depth==16) for(var i=0; i<qarea;i++) {  bf[i] = data[i<<1];  }
	}
	else if(ctype==2) {	// RGB
		var ts=out.tabs["tRNS"], tr=-1, tg=-1, tb=-1;
		if(ts) {  tr=ts[0];  tg=ts[1];  tb=ts[2];  }
		if(depth== 8) for(var i=0; i<area; i++) {  var qi=i<<2, ti=i*3;  bf[qi] = data[ti];  bf[qi+1] = data[ti+1];  bf[qi+2] = data[ti+2];  bf[qi+3] = 255;
			if(tr!=-1 && data[ti]   ==tr && data[ti+1]   ==tg && data[ti+2]   ==tb) bf[qi+3] = 0;  }
		if(depth==16) for(var i=0; i<area; i++) {  var qi=i<<2, ti=i*6;  bf[qi] = data[ti];  bf[qi+1] = data[ti+2];  bf[qi+2] = data[ti+4];  bf[qi+3] = 255;
			if(tr!=-1 && rs(data,ti)==tr && rs(data,ti+2)==tg && rs(data,ti+4)==tb) bf[qi+3] = 0;  }
	}
	else if(ctype==3) {	// palette
		var p=out.tabs["PLTE"], ap=out.tabs["tRNS"], tl=ap?ap.length:0;
		//console.log(p, ap);
		if(depth==1) for(var y=0; y<h; y++) {  var s0 = y*bpl, t0 = y*w;
			for(var i=0; i<w; i++) { var qi=(t0+i)<<2, j=((data[s0+(i>>3)]>>(7-((i&7)<<0)))& 1), cj=3*j;  bf[qi]=p[cj];  bf[qi+1]=p[cj+1];  bf[qi+2]=p[cj+2];  bf[qi+3]=(j<tl)?ap[j]:255;  }
		}
		if(depth==2) for(var y=0; y<h; y++) {  var s0 = y*bpl, t0 = y*w;
			for(var i=0; i<w; i++) { var qi=(t0+i)<<2, j=((data[s0+(i>>2)]>>(6-((i&3)<<1)))& 3), cj=3*j;  bf[qi]=p[cj];  bf[qi+1]=p[cj+1];  bf[qi+2]=p[cj+2];  bf[qi+3]=(j<tl)?ap[j]:255;  }
		}
		if(depth==4) for(var y=0; y<h; y++) {  var s0 = y*bpl, t0 = y*w;
			for(var i=0; i<w; i++) { var qi=(t0+i)<<2, j=((data[s0+(i>>1)]>>(4-((i&1)<<2)))&15), cj=3*j;  bf[qi]=p[cj];  bf[qi+1]=p[cj+1];  bf[qi+2]=p[cj+2];  bf[qi+3]=(j<tl)?ap[j]:255;  }
		}
		if(depth==8) for(var i=0; i<area; i++ ) {  var qi=i<<2, j=data[i]                      , cj=3*j;  bf[qi]=p[cj];  bf[qi+1]=p[cj+1];  bf[qi+2]=p[cj+2];  bf[qi+3]=(j<tl)?ap[j]:255;  }
	}
	else if(ctype==4) {	// gray + alpha
		if(depth== 8)  for(var i=0; i<area; i++) {  var qi=i<<2, di=i<<1, gr=data[di];  bf[qi]=gr;  bf[qi+1]=gr;  bf[qi+2]=gr;  bf[qi+3]=data[di+1];  }
		if(depth==16)  for(var i=0; i<area; i++) {  var qi=i<<2, di=i<<2, gr=data[di];  bf[qi]=gr;  bf[qi+1]=gr;  bf[qi+2]=gr;  bf[qi+3]=data[di+2];  }
	}
	else if(ctype==0) {	// gray
		var tr = out.tabs["tRNS"] ? out.tabs["tRNS"] : -1;
		if(depth== 1) for(var i=0; i<area; i++) {  var gr=255*((data[i>>3]>>(7 -((i&7)   )))& 1), al=(gr==tr*255)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
		if(depth== 2) for(var i=0; i<area; i++) {  var gr= 85*((data[i>>2]>>(6 -((i&3)<<1)))& 3), al=(gr==tr* 85)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
		if(depth== 4) for(var i=0; i<area; i++) {  var gr= 17*((data[i>>1]>>(4 -((i&1)<<2)))&15), al=(gr==tr* 17)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
		if(depth== 8) for(var i=0; i<area; i++) {  var gr=data[i  ] , al=(gr           ==tr)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
		if(depth==16) for(var i=0; i<area; i++) {  var gr=data[i<<1], al=(rs(data,i<<1)==tr)?0:255;  bf32[i]=(al<<24)|(gr<<16)|(gr<<8)|gr;  }
	}
	return bf;
}



UPNG.decode = function(buff)
{
	var data = new Uint8Array(buff), offset = 8, bin = UPNG._bin, rUs = bin.readUshort, rUi = bin.readUint;
	var out = {tabs:{}, frames:[]};
	var dd = new Uint8Array(data.length), doff = 0;	 // put all IDAT data into it
	var fd, foff = 0;	// frames
	
	var mgck = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
	for(var i=0; i<8; i++) if(data[i]!=mgck[i]) throw "The input is not a PNG file!";

	while(offset<data.length)
	{
		var len  = bin.readUint(data, offset);  offset += 4;
		var type = bin.readASCII(data, offset, 4);  offset += 4;
		//log(type,len);
		
		if     (type=="IHDR")  {  UPNG.decode._IHDR(data, offset, out);  }
		else if(type=="IDAT") {
			for(var i=0; i<len; i++) dd[doff+i] = data[offset+i];
			doff += len;
		}
		else if(type=="acTL")  {
			out.tabs[type] = {  num_frames:rUi(data, offset), num_plays:rUi(data, offset+4)  };
			fd = new Uint8Array(data.length);
		}
		else if(type=="fcTL")  {
			if(foff!=0) {  var fr = out.frames[out.frames.length-1];
				fr.data = UPNG.decode._decompress(out, fd.slice(0,foff), fr.rect.width, fr.rect.height);  foff=0;
			}
			var rct = {x:rUi(data, offset+12),y:rUi(data, offset+16),width:rUi(data, offset+4),height:rUi(data, offset+8)};
			var del = rUs(data, offset+22);  del = rUs(data, offset+20) / (del==0?100:del);
			var frm = {rect:rct, delay:Math.round(del*1000), dispose:data[offset+24], blend:data[offset+25]};
			//console.log(frm);
			out.frames.push(frm);
		}
		else if(type=="fdAT") {
			for(var i=0; i<len-4; i++) fd[foff+i] = data[offset+i+4];
			foff += len-4;
		}
		else if(type=="pHYs") {
			out.tabs[type] = [bin.readUint(data, offset), bin.readUint(data, offset+4), data[offset+8]];
		}
		else if(type=="cHRM") {
			out.tabs[type] = [];
			for(var i=0; i<8; i++) out.tabs[type].push(bin.readUint(data, offset+i*4));
		}
		else if(type=="tEXt") {
			if(out.tabs[type]==null) out.tabs[type] = {};
			var nz = bin.nextZero(data, offset);
			var keyw = bin.readASCII(data, offset, nz-offset);
			var text = bin.readASCII(data, nz+1, offset+len-nz-1);
			out.tabs[type][keyw] = text;
		}
		else if(type=="iTXt") {
			if(out.tabs[type]==null) out.tabs[type] = {};
			var nz = 0, off = offset;
			nz = bin.nextZero(data, off);
			var keyw = bin.readASCII(data, off, nz-off);  off = nz + 1;
			var cflag = data[off], cmeth = data[off+1];  off+=2;
			nz = bin.nextZero(data, off);
			var ltag = bin.readASCII(data, off, nz-off);  off = nz + 1;
			nz = bin.nextZero(data, off);
			var tkeyw = bin.readUTF8(data, off, nz-off);  off = nz + 1;
			var text  = bin.readUTF8(data, off, len-(off-offset));
			out.tabs[type][keyw] = text;
		}
		else if(type=="PLTE") {
			out.tabs[type] = bin.readBytes(data, offset, len);
		}
		else if(type=="hIST") {
			var pl = out.tabs["PLTE"].length/3;
			out.tabs[type] = [];  for(var i=0; i<pl; i++) out.tabs[type].push(rUs(data, offset+i*2));
		}
		else if(type=="tRNS") {
			if     (out.ctype==3) out.tabs[type] = bin.readBytes(data, offset, len);
			else if(out.ctype==0) out.tabs[type] = rUs(data, offset);
			else if(out.ctype==2) out.tabs[type] = [ rUs(data,offset),rUs(data,offset+2),rUs(data,offset+4) ];
			//else console.log("tRNS for unsupported color type",out.ctype, len);
		}
		else if(type=="gAMA") out.tabs[type] = bin.readUint(data, offset)/100000;
		else if(type=="sRGB") out.tabs[type] = data[offset];
		else if(type=="bKGD")
		{
			if     (out.ctype==0 || out.ctype==4) out.tabs[type] = [rUs(data, offset)];
			else if(out.ctype==2 || out.ctype==6) out.tabs[type] = [rUs(data, offset), rUs(data, offset+2), rUs(data, offset+4)];
			else if(out.ctype==3) out.tabs[type] = data[offset];
		}
		else if(type=="IEND") {
			if(foff!=0) {  var fr = out.frames[out.frames.length-1];
				fr.data = UPNG.decode._decompress(out, fd.slice(0,foff), fr.rect.width, fr.rect.height);  foff=0;
			}	
			out.data = UPNG.decode._decompress(out, dd, out.width, out.height);  break;
		}
		//else {  log("unknown chunk type", type, len);  }
		offset += len;
		var crc = bin.readUint(data, offset);  offset += 4;
	}
	delete out.compress;  delete out.interlace;  delete out.filter;
	return out;
}

UPNG.decode._decompress = function(out, dd, w, h) {
	if(out.compress ==0) dd = UPNG.decode._inflate(dd);

	if     (out.interlace==0) dd = UPNG.decode._filterZero(dd, out, 0, w, h);
	else if(out.interlace==1) dd = UPNG.decode._readInterlace(dd, out);
	return dd;
}

UPNG.decode._inflate = function(data) {  return pako["inflate"](data);  }

UPNG.decode._readInterlace = function(data, out)
{
	var w = out.width, h = out.height;
	var bpp = UPNG.decode._getBPP(out), cbpp = bpp>>3, bpl = Math.ceil(w*bpp/8);
	var img = new Uint8Array( h * bpl );
	var di = 0;

	var starting_row  = [ 0, 0, 4, 0, 2, 0, 1 ];
	var starting_col  = [ 0, 4, 0, 2, 0, 1, 0 ];
	var row_increment = [ 8, 8, 8, 4, 4, 2, 2 ];
	var col_increment = [ 8, 8, 4, 4, 2, 2, 1 ];

	var pass=0;
	while(pass<7)
	{
		var ri = row_increment[pass], ci = col_increment[pass];
		var sw = 0, sh = 0;
		var cr = starting_row[pass];  while(cr<h) {  cr+=ri;  sh++;  }
		var cc = starting_col[pass];  while(cc<w) {  cc+=ci;  sw++;  }
		var bpll = Math.ceil(sw*bpp/8);
		UPNG.decode._filterZero(data, out, di, sw, sh);

		var y=0, row = starting_row[pass];
		while(row<h)
		{
			var col = starting_col[pass];
			var cdi = (di+y*bpll)<<3;

			while(col<w)
			{
				if(bpp==1) {
					var val = data[cdi>>3];  val = (val>>(7-(cdi&7)))&1;
					img[row*bpl + (col>>3)] |= (val << (7-((col&3)<<0)));
				}
				if(bpp==2) {
					var val = data[cdi>>3];  val = (val>>(6-(cdi&7)))&3;
					img[row*bpl + (col>>2)] |= (val << (6-((col&3)<<1)));
				}
				if(bpp==4) {
					var val = data[cdi>>3];  val = (val>>(4-(cdi&7)))&15;
					img[row*bpl + (col>>1)] |= (val << (4-((col&1)<<2)));
				}
				if(bpp>=8) {
					var ii = row*bpl+col*cbpp;
					for(var j=0; j<cbpp; j++) img[ii+j] = data[(cdi>>3)+j];
				}
				cdi+=bpp;  col+=ci;
			}
			y++;  row += ri;
		}
		if(sw*sh!=0) di += sh * (1 + bpll);
		pass = pass + 1;
	}
	return img;
}

UPNG.decode._getBPP = function(out) {
	var noc = [1,null,3,1,2,null,4][out.ctype];
	return noc * out.depth;
}

UPNG.decode._filterZero = function(data, out, off, w, h)
{
	var bpp = UPNG.decode._getBPP(out), bpl = Math.ceil(w*bpp/8), paeth = UPNG.decode._paeth;
	bpp = Math.ceil(bpp/8);

	for(var y=0; y<h; y++)  {
		var i = off+y*bpl, di = i+y+1;
		var type = data[di-1];

		if     (type==0) for(var x=  0; x<bpl; x++) data[i+x] = data[di+x];
		else if(type==1) {
			for(var x=  0; x<bpp; x++) data[i+x] = data[di+x];
			for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + data[i+x-bpp])&255;
		}
		else if(y==0) {
			for(var x=  0; x<bpp; x++) data[i+x] = data[di+x];
			if(type==2) for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x])&255;
			if(type==3) for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + (data[i+x-bpp]>>1) )&255;
			if(type==4) for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + paeth(data[i+x-bpp], 0, 0) )&255;
		}
		else {
			if(type==2) { for(var x=  0; x<bpl; x++) data[i+x] = (data[di+x] + data[i+x-bpl])&255;  }

			if(type==3) { for(var x=  0; x<bpp; x++) data[i+x] = (data[di+x] + (data[i+x-bpl]>>1))&255;
			              for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + ((data[i+x-bpl]+data[i+x-bpp])>>1) )&255;  }

			if(type==4) { for(var x=  0; x<bpp; x++) data[i+x] = (data[di+x] + paeth(0, data[i+x-bpl], 0))&255;
						  for(var x=bpp; x<bpl; x++) data[i+x] = (data[di+x] + paeth(data[i+x-bpp], data[i+x-bpl], data[i+x-bpp-bpl]) )&255;  }
		}
	}
	return data;
}

UPNG.decode._paeth = function(a,b,c)
{
	var p = a+b-c, pa = Math.abs(p-a), pb = Math.abs(p-b), pc = Math.abs(p-c);
	if (pa <= pb && pa <= pc)  return a;
	else if (pb <= pc)  return b;
	return c;
}

UPNG.decode._IHDR = function(data, offset, out)
{
	var bin = UPNG._bin;
	out.width  = bin.readUint(data, offset);  offset += 4;
	out.height = bin.readUint(data, offset);  offset += 4;
	out.depth     = data[offset];  offset++;
	out.ctype     = data[offset];  offset++;
	out.compress  = data[offset];  offset++;
	out.filter    = data[offset];  offset++;
	out.interlace = data[offset];  offset++;
}

UPNG._bin = {
	nextZero   : function(data,p)  {  while(data[p]!=0) p++;  return p;  },
	readUshort : function(buff,p)  {  return (buff[p]<< 8) | buff[p+1];  },
	writeUshort: function(buff,p,n){  buff[p] = (n>>8)&255;  buff[p+1] = n&255;  },
	readUint   : function(buff,p)  {  return (buff[p]*(256*256*256)) + ((buff[p+1]<<16) | (buff[p+2]<< 8) | buff[p+3]);  },
	writeUint  : function(buff,p,n){  buff[p]=(n>>24)&255;  buff[p+1]=(n>>16)&255;  buff[p+2]=(n>>8)&255;  buff[p+3]=n&255;  },
	readASCII  : function(buff,p,l){  var s = "";  for(var i=0; i<l; i++) s += String.fromCharCode(buff[p+i]);  return s;    },
	writeASCII : function(data,p,s){  for(var i=0; i<s.length; i++) data[p+i] = s.charCodeAt(i);  },
	readBytes  : function(buff,p,l){  var arr = [];   for(var i=0; i<l; i++) arr.push(buff[p+i]);   return arr;  },
	pad : function(n) { return n.length < 2 ? "0" + n : n; },
	readUTF8 : function(buff, p, l) {
		var s = "", ns;
		for(var i=0; i<l; i++) s += "%" + UPNG._bin.pad(buff[p+i].toString(16));
		try {  ns = decodeURIComponent(s); }
		catch(e) {  return UPNG._bin.readASCII(buff, p, l);  }
		return  ns;
	}
}
UPNG._copyTile = function(sb, sw, sh, tb, tw, th, xoff, yoff, mode)
{
	var w = Math.min(sw,tw), h = Math.min(sh,th);
	var si=0, ti=0;
	for(var y=0; y<h; y++)
		for(var x=0; x<w; x++)
		{
			if(xoff>=0 && yoff>=0) {  si = (y*sw+x)<<2;  ti = (( yoff+y)*tw+xoff+x)<<2;  }
			else                   {  si = ((-yoff+y)*sw-xoff+x)<<2;  ti = (y*tw+x)<<2;  }
			
			if     (mode==0) {  tb[ti] = sb[si];  tb[ti+1] = sb[si+1];  tb[ti+2] = sb[si+2];  tb[ti+3] = sb[si+3];  }
			else if(mode==1) {
				var fa = sb[si+3]*(1/255), fr=sb[si]*fa, fg=sb[si+1]*fa, fb=sb[si+2]*fa; 
				var ba = tb[ti+3]*(1/255), br=tb[ti]*ba, bg=tb[ti+1]*ba, bb=tb[ti+2]*ba; 
				
				var ifa=1-fa, oa = fa+ba*ifa, ioa = (oa==0?0:1/oa);
				tb[ti+3] = 255*oa;  
				tb[ti+0] = (fr+br*ifa)*ioa;  
				tb[ti+1] = (fg+bg*ifa)*ioa;   
				tb[ti+2] = (fb+bb*ifa)*ioa;  
			}
			else if(mode==2){	// copy only differences, otherwise zero
				var fa = sb[si+3], fr=sb[si], fg=sb[si+1], fb=sb[si+2]; 
				var ba = tb[ti+3], br=tb[ti], bg=tb[ti+1], bb=tb[ti+2]; 
				if(fa==ba && fr==br && fg==bg && fb==bb) {  tb[ti]=0;  tb[ti+1]=0;  tb[ti+2]=0;  tb[ti+3]=0;  }
				else {  tb[ti]=fr;  tb[ti+1]=fg;  tb[ti+2]=fb;  tb[ti+3]=fa;  }
			}
			else if(mode==3){	// check if can be blended
				var fa = sb[si+3], fr=sb[si], fg=sb[si+1], fb=sb[si+2]; 
				var ba = tb[ti+3], br=tb[ti], bg=tb[ti+1], bb=tb[ti+2]; 
				if(fa==ba && fr==br && fg==bg && fb==bb) continue;
				//if(fa!=255 && ba!=0) return false;
				if(fa<220 && ba>20) return false;
			}
		}
	return true;
}



UPNG.encode = function(bufs, w, h, ps, dels, forbidPlte)
{
	if(ps==null) ps=0;
	if(forbidPlte==null) forbidPlte = false;
	var data = new Uint8Array(bufs[0].byteLength*bufs.length+100);
	var wr=[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
	for(var i=0; i<8; i++) data[i]=wr[i];
	var offset = 8,  bin = UPNG._bin, crc = UPNG.crc.crc, wUi = bin.writeUint, wUs = bin.writeUshort, wAs = bin.writeASCII;

	var nimg = UPNG.encode.compressPNG(bufs, w, h, ps, forbidPlte);

	wUi(data,offset, 13);     offset+=4;
	wAs(data,offset,"IHDR");  offset+=4;
	wUi(data,offset,w);  offset+=4;
	wUi(data,offset,h);  offset+=4;
	data[offset] = nimg.depth;  offset++;  // depth
	data[offset] = nimg.ctype;  offset++;  // ctype
	data[offset] = 0;  offset++;  // compress
	data[offset] = 0;  offset++;  // filter
	data[offset] = 0;  offset++;  // interlace
	wUi(data,offset,crc(data,offset-17,17));  offset+=4; // crc

	// 9 bytes to say, that it is sRGB
	wUi(data,offset, 1);      offset+=4;
	wAs(data,offset,"sRGB");  offset+=4;
	data[offset] = 1;  offset++;
	wUi(data,offset,crc(data,offset-5,5));  offset+=4; // crc

	var anim = bufs.length>1;
	if(anim) {
		wUi(data,offset, 8);      offset+=4;
		wAs(data,offset,"acTL");  offset+=4;
		wUi(data,offset, bufs.length);      offset+=4;
		wUi(data,offset, 0);      offset+=4;
		wUi(data,offset,crc(data,offset-12,12));  offset+=4; // crc
	}

	if(nimg.ctype==3) {
		var dl = nimg.plte.length;
		wUi(data,offset, dl*3);  offset+=4;
		wAs(data,offset,"PLTE");  offset+=4;
		for(var i=0; i<dl; i++){
			var ti=i*3, c=nimg.plte[i], r=(c)&255, g=(c>>8)&255, b=(c>>16)&255;
			data[offset+ti+0]=r;  data[offset+ti+1]=g;  data[offset+ti+2]=b;
		}
		offset+=dl*3;
		wUi(data,offset,crc(data,offset-dl*3-4,dl*3+4));  offset+=4; // crc

		if(nimg.gotAlpha) {
			wUi(data,offset, dl);  offset+=4;
			wAs(data,offset,"tRNS");  offset+=4;
			for(var i=0; i<dl; i++)  data[offset+i]=(nimg.plte[i]>>24)&255;
			offset+=dl;
			wUi(data,offset,crc(data,offset-dl-4,dl+4));  offset+=4; // crc
		}
	}
	
	var fi = 0;
	for(var j=0; j<nimg.frames.length; j++)
	{
		var fr = nimg.frames[j];
		if(anim) {
			wUi(data,offset, 26);     offset+=4;
			wAs(data,offset,"fcTL");  offset+=4;
			wUi(data, offset, fi++);   offset+=4;
			wUi(data, offset, fr.rect.width );   offset+=4;
			wUi(data, offset, fr.rect.height);   offset+=4;
			wUi(data, offset, fr.rect.x);   offset+=4;
			wUi(data, offset, fr.rect.y);   offset+=4;
			wUs(data, offset, dels[j]);   offset+=2;
			wUs(data, offset,  1000);   offset+=2;
			data[offset] = fr.dispose;  offset++;	// dispose
			data[offset] = fr.blend  ;  offset++;	// blend
			wUi(data,offset,crc(data,offset-30,30));  offset+=4; // crc
		}
				
		var imgd = fr.cimg, dl = imgd.length;
		wUi(data,offset, dl+(j==0?0:4));     offset+=4;
		var ioff = offset;
		wAs(data,offset,(j==0)?"IDAT":"fdAT");  offset+=4;
		if(j!=0) {  wUi(data, offset, fi++);  offset+=4;  }
		for(var i=0; i<dl; i++) data[offset+i] = imgd[i];
		offset += dl;
		wUi(data,offset,crc(data,ioff,offset-ioff));  offset+=4; // crc
	}

	wUi(data,offset, 0);     offset+=4;
	wAs(data,offset,"IEND");  offset+=4;
	wUi(data,offset,crc(data,offset-4,4));  offset+=4; // crc

	return data.buffer.slice(0,offset);
}

UPNG.encode.compressPNG = function(bufs, w, h, ps, forbidPlte)
{
	var out = UPNG.encode.compress(bufs, w, h, ps, false, forbidPlte);
	for(var i=0; i<bufs.length; i++) {
		var frm = out.frames[i], nw=frm.rect.width, nh=frm.rect.height, bpl=frm.bpl, bpp=frm.bpp;
		var fdata = new Uint8Array(nh*bpl+nh);
		frm.cimg = UPNG.encode._filterZero(frm.img,nh,bpp,bpl,fdata);
	}	
	return out;
}

UPNG.encode.compress = function(bufs, w, h, ps, forGIF, forbidPlte)
{
	if(forbidPlte==null) forbidPlte = false;
	
	var ctype = 6, depth = 8, bpp = 4, alphaAnd=255
	
	for(var j=0; j<bufs.length; j++)  {  // when not quantized, other frames can contain colors, that are not in an initial frame
		var img = new Uint8Array(bufs[j]), ilen = img.length;
		for(var i=0; i<ilen; i+=4) alphaAnd &= img[i+3];
	}
	var gotAlpha = (alphaAnd)!=255;
	
	var cmap={}, plte=[];  if(bufs.length!=0) {  cmap[0]=0;  plte.push(0);  if(ps!=0) ps--;  } 
	
	
	if(ps!=0) {
		var qres = UPNG.quantize(bufs, ps, forGIF);  bufs = qres.bufs;
		for(var i=0; i<qres.plte.length; i++) {  var c=qres.plte[i].est.rgba;  if(cmap[c]==null) {  cmap[c]=plte.length;  plte.push(c);  }     }
	}
	else {
		// what if ps==0, but there are <=256 colors?  we still need to detect, if the palette could be used
		for(var j=0; j<bufs.length; j++)  {  // when not quantized, other frames can contain colors, that are not in an initial frame
			var img32 = new Uint32Array(bufs[j]), ilen = img32.length;
			for(var i=0; i<ilen; i++) {
				var c = img32[i];
				if((i<w || (c!=img32[i-1] && c!=img32[i-w])) && cmap[c]==null) {  cmap[c]=plte.length;  plte.push(c);  if(plte.length>=300) break;  }
			}
		}
	}
	
	var brute = gotAlpha ? forGIF : false;		// brute : frames can only be copied, not "blended"
	var cc=plte.length;  //console.log(cc);
	if(cc<=256 && forbidPlte==false) {
		if(cc<= 2) depth=1;  else if(cc<= 4) depth=2;  else if(cc<=16) depth=4;  else depth=8;
		if(forGIF) depth=8;
		gotAlpha = true;
	}
	
	
	var frms = [];
	for(var j=0; j<bufs.length; j++)
	{
		var cimg = new Uint8Array(bufs[j]), cimg32 = new Uint32Array(cimg.buffer);
		
		var nx=0, ny=0, nw=w, nh=h, blend=0;
		if(j!=0 && !brute) {
			var tlim = (forGIF || j==1 || frms[frms.length-2].dispose==2)?1:2, tstp = 0, tarea = 1e9;
			for(var it=0; it<tlim; it++)
			{
				var pimg = new Uint8Array(bufs[j-1-it]), p32 = new Uint32Array(bufs[j-1-it]);
				var mix=w,miy=h,max=-1,may=-1;
				for(var y=0; y<h; y++) for(var x=0; x<w; x++) {
					var i = y*w+x;
					if(cimg32[i]!=p32[i]) {
						if(x<mix) mix=x;  if(x>max) max=x;
						if(y<miy) miy=y;  if(y>may) may=y;
					}
				}
				var sarea = (max==-1) ? 1 : (max-mix+1)*(may-miy+1);
				if(sarea<tarea) {
					tarea = sarea;  tstp = it;  
					if(max==-1) {  nx=ny=0;  nw=nh=1;  }
					else {  nx = mix; ny = miy; nw = max-mix+1; nh = may-miy+1;  }
				}
			}
			
			var pimg = new Uint8Array(bufs[j-1-tstp]);
			if(tstp==1) frms[frms.length-1].dispose = 2;
			
			var nimg = new Uint8Array(nw*nh*4), nimg32 = new Uint32Array(nimg.buffer);
			UPNG.   _copyTile(pimg,w,h, nimg,nw,nh, -nx,-ny, 0);
			if(UPNG._copyTile(cimg,w,h, nimg,nw,nh, -nx,-ny, 3)) {
				UPNG._copyTile(cimg,w,h, nimg,nw,nh, -nx,-ny, 2);  blend = 1;
			}
			else {
				UPNG._copyTile(cimg,w,h, nimg,nw,nh, -nx,-ny, 0);  blend = 0;
			}
			cimg = nimg;  cimg32 = new Uint32Array(cimg.buffer);
		}
		var bpl = 4*nw;
		if(cc<=256 && forbidPlte==false) {
			bpl = Math.ceil(depth*nw/8);
			var nimg = new Uint8Array(bpl*nh);
			for(var y=0; y<nh; y++) {  var i=y*bpl, ii=y*nw;
				if     (depth==8) for(var x=0; x<nw; x++) nimg[i+(x)   ]   =  (cmap[cimg32[ii+x]]             );
				else if(depth==4) for(var x=0; x<nw; x++) nimg[i+(x>>1)]  |=  (cmap[cimg32[ii+x]]<<(4-(x&1)*4));
				else if(depth==2) for(var x=0; x<nw; x++) nimg[i+(x>>2)]  |=  (cmap[cimg32[ii+x]]<<(6-(x&3)*2));
				else if(depth==1) for(var x=0; x<nw; x++) nimg[i+(x>>3)]  |=  (cmap[cimg32[ii+x]]<<(7-(x&7)*1));
			}
			cimg=nimg;  ctype=3;  bpp=1;
		}
		else if(gotAlpha==false && bufs.length==1) {	// some next "reduced" frames may contain alpha for blending
			var nimg = new Uint8Array(nw*nh*3), area=nw*nh;
			for(var i=0; i<area; i++) { var ti=i*3, qi=i*4;  nimg[ti]=cimg[qi];  nimg[ti+1]=cimg[qi+1];  nimg[ti+2]=cimg[qi+2];  }
			cimg=nimg;  ctype=2;  bpp=3;  bpl=3*nw;
		}
		frms.push({rect:{x:nx,y:ny,width:nw,height:nh}, img:cimg, bpl:bpl, bpp:bpp, blend:blend, dispose:brute?1:0});
	}
	return {ctype:ctype, depth:depth, plte:plte, gotAlpha:gotAlpha, frames:frms  };
}

UPNG.encode._filterZero = function(img,h,bpp,bpl,data)
{
	var fls = [];
	for(var t=0; t<5; t++) {  if(h*bpl>500000 && (t==2 || t==3 || t==4)) continue;
		for(var y=0; y<h; y++) UPNG.encode._filterLine(data, img, y, bpl, bpp, t);
		fls.push(pako["deflate"](data));  if(bpp==1) break;
	}
	var ti, tsize=1e9;
	for(var i=0; i<fls.length; i++) if(fls[i].length<tsize) {  ti=i;  tsize=fls[i].length;  }
	return fls[ti];
}
UPNG.encode._filterLine = function(data, img, y, bpl, bpp, type)
{
	var i = y*bpl, di = i+y, paeth = UPNG.decode._paeth
	data[di]=type;  di++;

	if(type==0) for(var x=0; x<bpl; x++) data[di+x] = img[i+x];
	else if(type==1) {
		for(var x=  0; x<bpp; x++) data[di+x] =  img[i+x];
		for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x]-img[i+x-bpp]+256)&255;
	}
	else if(y==0) {
		for(var x=  0; x<bpp; x++) data[di+x] = img[i+x];

		if(type==2) for(var x=bpp; x<bpl; x++) data[di+x] = img[i+x];
		if(type==3) for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x] - (img[i+x-bpp]>>1) +256)&255;
		if(type==4) for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x] - paeth(img[i+x-bpp], 0, 0) +256)&255;
	}
	else {
		if(type==2) { for(var x=  0; x<bpl; x++) data[di+x] = (img[i+x]+256 - img[i+x-bpl])&255;  }
		if(type==3) { for(var x=  0; x<bpp; x++) data[di+x] = (img[i+x]+256 - (img[i+x-bpl]>>1))&255;
					  for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x]+256 - ((img[i+x-bpl]+img[i+x-bpp])>>1))&255;  }
		if(type==4) { for(var x=  0; x<bpp; x++) data[di+x] = (img[i+x]+256 - paeth(0, img[i+x-bpl], 0))&255;
					  for(var x=bpp; x<bpl; x++) data[di+x] = (img[i+x]+256 - paeth(img[i+x-bpp], img[i+x-bpl], img[i+x-bpp-bpl]))&255;  }
	}
}

UPNG.crc = {
	table : ( function() {
	   var tab = new Uint32Array(256);
	   for (var n=0; n<256; n++) {
			var c = n;
			for (var k=0; k<8; k++) {
				if (c & 1)  c = 0xedb88320 ^ (c >>> 1);
				else        c = c >>> 1;
			}
			tab[n] = c;  }
		return tab;  })(),
	update : function(c, buf, off, len) {
		for (var i=0; i<len; i++)  c = UPNG.crc.table[(c ^ buf[off+i]) & 0xff] ^ (c >>> 8);
		return c;
	},
	crc : function(b,o,l)  {  return UPNG.crc.update(0xffffffff,b,o,l) ^ 0xffffffff;  }
}


UPNG.quantize = function(bufs, ps, roundAlpha)
{	
	var imgs = [], totl = 0;
	for(var i=0; i<bufs.length; i++) {  imgs.push(UPNG.encode.alphaMul(new Uint8Array(bufs[i]), roundAlpha));  totl+=bufs[i].byteLength;  }
	
	var nimg = new Uint8Array(totl), nimg32 = new Uint32Array(nimg.buffer), noff=0;
	for(var i=0; i<imgs.length; i++) {
		var img = imgs[i], il = img.length;
		for(var j=0; j<il; j++) nimg[noff+j] = img[j];
		noff += il;
	}
	
	var root = {i0:0, i1:nimg.length, bst:null, est:null, tdst:0, left:null, right:null };  // basic statistic, extra statistic
	root.bst = UPNG.quantize.stats(  nimg,root.i0, root.i1  );  root.est = UPNG.quantize.estats( root.bst );
	var leafs = [root];
	
	while(leafs.length<ps)
	{
		var maxL = 0, mi=0;
		for(var i=0; i<leafs.length; i++) if(leafs[i].est.L > maxL) {  maxL=leafs[i].est.L;  mi=i;  }
		if(maxL<1e-3) break;
		var node = leafs[mi];
		
		var s0 = UPNG.quantize.splitPixels(nimg,nimg32, node.i0, node.i1, node.est.e, node.est.eMq255);
		
		var ln = {i0:node.i0, i1:s0, bst:null, est:null, tdst:0, left:null, right:null };  ln.bst = UPNG.quantize.stats( nimg, ln.i0, ln.i1 );  
		ln.est = UPNG.quantize.estats( ln.bst );
		var rn = {i0:s0, i1:node.i1, bst:null, est:null, tdst:0, left:null, right:null };  rn.bst = {R:[], m:[], N:node.bst.N-ln.bst.N};
		for(var i=0; i<16; i++) rn.bst.R[i] = node.bst.R[i]-ln.bst.R[i];
		for(var i=0; i< 4; i++) rn.bst.m[i] = node.bst.m[i]-ln.bst.m[i];
		rn.est = UPNG.quantize.estats( rn.bst );
		
		node.left = ln;  node.right = rn;
		leafs[mi]=ln;  leafs.push(rn);
	}
	leafs.sort(function(a,b) {  return b.bst.N-a.bst.N;  });
	
	for(var ii=0; ii<imgs.length; ii++) {
		var planeDst = UPNG.quantize.planeDst;
		var sb = new Uint8Array(imgs[ii].buffer), tb = new Uint32Array(imgs[ii].buffer), len = sb.length;
		
		var stack = [], si=0;
		for(var i=0; i<len; i+=4) {
			var r=sb[i]*(1/255), g=sb[i+1]*(1/255), b=sb[i+2]*(1/255), a=sb[i+3]*(1/255);
			
			//  exact, but too slow :(
			//var nd = UPNG.quantize.getNearest(root, r, g, b, a);
			var nd = root;
			while(nd.left) nd = (planeDst(nd.est,r,g,b,a)<=0) ? nd.left : nd.right;
			
			tb[i>>2] = nd.est.rgba;
		}
		imgs[ii]=tb.buffer;
	}
	return {  bufs:imgs, plte:leafs  };
}
UPNG.quantize.getNearest = function(nd, r,g,b,a)
{
	if(nd.left==null) {  nd.tdst = UPNG.quantize.dist(nd.est.q,r,g,b,a);  return nd;  }
	var planeDst = UPNG.quantize.planeDst(nd.est,r,g,b,a);
	
	var node0 = nd.left, node1 = nd.right;
	if(planeDst>0) {  node0=nd.right;  node1=nd.left;  }
	
	var ln = UPNG.quantize.getNearest(node0, r,g,b,a);
	if(ln.tdst<=planeDst*planeDst) return ln;
	var rn = UPNG.quantize.getNearest(node1, r,g,b,a);
	return rn.tdst<ln.tdst ? rn : ln;
}
UPNG.quantize.planeDst = function(est, r,g,b,a) {  var e = est.e;  return e[0]*r + e[1]*g + e[2]*b + e[3]*a - est.eMq;  }
UPNG.quantize.dist     = function(q,   r,g,b,a) {  var d0=r-q[0], d1=g-q[1], d2=b-q[2], d3=a-q[3];  return d0*d0+d1*d1+d2*d2+d3*d3;  }

UPNG.quantize.splitPixels = function(nimg, nimg32, i0, i1, e, eMq)
{
	var vecDot = UPNG.quantize.vecDot;
	i1-=4;
	var shfs = 0;
	while(i0<i1)
	{
		while(vecDot(nimg, i0, e)<=eMq) i0+=4;
		while(vecDot(nimg, i1, e)> eMq) i1-=4;
		if(i0>=i1) break;
		
		var t = nimg32[i0>>2];  nimg32[i0>>2] = nimg32[i1>>2];  nimg32[i1>>2]=t;
		
		i0+=4;  i1-=4;
	}
	while(vecDot(nimg, i0, e)>eMq) i0-=4;
	return i0+4;
}
UPNG.quantize.vecDot = function(nimg, i, e)
{
	return nimg[i]*e[0] + nimg[i+1]*e[1] + nimg[i+2]*e[2] + nimg[i+3]*e[3];
}
UPNG.quantize.stats = function(nimg, i0, i1){
	var R = [0,0,0,0,  0,0,0,0,  0,0,0,0,  0,0,0,0];
	var m = [0,0,0,0];
	var N = (i1-i0)>>2;
	for(var i=i0; i<i1; i+=4)
	{
		var r = nimg[i]*(1/255), g = nimg[i+1]*(1/255), b = nimg[i+2]*(1/255), a = nimg[i+3]*(1/255);
		//var r = nimg[i], g = nimg[i+1], b = nimg[i+2], a = nimg[i+3];
		m[0]+=r;  m[1]+=g;  m[2]+=b;  m[3]+=a;
		
		R[ 0] += r*r;  R[ 1] += r*g;  R[ 2] += r*b;  R[ 3] += r*a;  
		               R[ 5] += g*g;  R[ 6] += g*b;  R[ 7] += g*a; 
		                              R[10] += b*b;  R[11] += b*a;  
		                                             R[15] += a*a;  
	}
	R[4]=R[1];  R[8]=R[2];  R[12]=R[3];  R[9]=R[6];  R[13]=R[7];  R[14]=R[11];
	
	return {R:R, m:m, N:N};
}
UPNG.quantize.estats = function(stats){
	var R = stats.R, m = stats.m, N = stats.N;
	
	var m0 = m[0], m1 = m[1], m2 = m[2], m3 = m[3], iN = (N==0 ? 0 : 1/N);
	var Rj = [
		R[ 0] - m0*m0*iN,  R[ 1] - m0*m1*iN,  R[ 2] - m0*m2*iN,  R[ 3] - m0*m3*iN,  
		R[ 4] - m1*m0*iN,  R[ 5] - m1*m1*iN,  R[ 6] - m1*m2*iN,  R[ 7] - m1*m3*iN,
		R[ 8] - m2*m0*iN,  R[ 9] - m2*m1*iN,  R[10] - m2*m2*iN,  R[11] - m2*m3*iN,  
		R[12] - m3*m0*iN,  R[13] - m3*m1*iN,  R[14] - m3*m2*iN,  R[15] - m3*m3*iN 
	];
	
	var A = Rj, M = UPNG.M4;
	var b = [0.5,0.5,0.5,0.5], mi = 0, tmi = 0;
	
	if(N!=0)
	for(var i=0; i<10; i++) {
		b = M.multVec(A, b);  tmi = Math.sqrt(M.dot(b,b));  b = M.sml(1/tmi,  b);
		if(Math.abs(tmi-mi)<1e-9) break;  mi = tmi;
	}	
	//b = [0,0,1,0];  mi=N;
	var q = [m0*iN, m1*iN, m2*iN, m3*iN];
	var eMq255 = M.dot(M.sml(255,q),b);
	
	var ia = (q[3]<0.001) ? 0 : 1/q[3];
	
	return {  Cov:Rj, q:q, e:b, L:mi,  eMq255:eMq255, eMq : M.dot(b,q),
				rgba: (((Math.round(255*q[3])<<24) | (Math.round(255*q[2]*ia)<<16) |  (Math.round(255*q[1]*ia)<<8) | (Math.round(255*q[0]*ia)<<0))>>>0)  };
}
UPNG.M4 = {
	multVec : function(m,v) {
			return [
				m[ 0]*v[0] + m[ 1]*v[1] + m[ 2]*v[2] + m[ 3]*v[3],
				m[ 4]*v[0] + m[ 5]*v[1] + m[ 6]*v[2] + m[ 7]*v[3],
				m[ 8]*v[0] + m[ 9]*v[1] + m[10]*v[2] + m[11]*v[3],
				m[12]*v[0] + m[13]*v[1] + m[14]*v[2] + m[15]*v[3]
			];
	},
	dot : function(x,y) {  return  x[0]*y[0]+x[1]*y[1]+x[2]*y[2]+x[3]*y[3];  },
	sml : function(a,y) {  return [a*y[0],a*y[1],a*y[2],a*y[3]];  }
}

UPNG.encode.alphaMul = function(img, roundA) {
	var nimg = new Uint8Array(img.length), area = img.length>>2; 
	for(var i=0; i<area; i++) {
		var qi=i<<2, ia=img[qi+3];   
		if(roundA) ia = ((ia<128))?0:255;
		var a = ia*(1/255);
		nimg[qi+0] = img[qi+0]*a;  nimg[qi+1] = img[qi+1]*a;  nimg[qi+2] = img[qi+2]*a;  nimg[qi+3] = ia;
	}
	return nimg;
}

	
	
	
	
	


})(UPNG, pako);
})();


;
const _UPNG = typeof window !== 'undefined' && window.UPNG ? window.UPNG : (typeof UPNG !== 'undefined' ? UPNG : globalThis.UPNG);
export default _UPNG;
export const decode = _UPNG ? _UPNG.decode : null;
export const toRGBA8 = _UPNG ? _UPNG.toRGBA8 : null;
