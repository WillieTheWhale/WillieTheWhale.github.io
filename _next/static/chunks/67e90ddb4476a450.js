(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,55856,t=>{"use strict";var e=t.i(43476),a=t.i(71645),r=t.i(4421),o=t.i(76200),i=t.i(8598),l=t.i(94409),s=t.i(5754),n=t.i(36884);function h(t,e){let a=[];for(let r=0;r<=e;r++)a.push(function(t,e,a,r,o){let i=1-o;return{x:i*i*i*t.x+3*i*i*o*e.x+3*i*o*o*a.x+o*o*o*r.x,y:i*i*i*t.y+3*i*i*o*e.y+3*i*o*o*a.y+o*o*o*r.y}}(t[0],t[1],t[2],t[3],r/e));return a}function c(t,e,a,r){let o=[];for(let i=0;i<=r;i++){let l=i/r,s=1-l;o.push({x:s*s*t.x+2*s*l*e.x+l*l*a.x,y:s*s*t.y+2*s*l*e.y+l*l*a.y})}return o}function p(t,e){let a=.003*t.x+.002*t.y,r=8e-4*e;return{x:t.x+12*Math.sin(a+r),y:t.y+8*Math.cos(1.3*a+.7*r)}}function u(t,e){return a=>{let r,o,i=Math.pow((o=Math.min(1,Math.max(0,(a-0)/.12)))*o*(3-2*o),.7);switch(e){case 0:r=Math.pow(1-a,1.5);break;case 1:r=(.35+.65*Math.sin(a*Math.PI*.9+.1))*Math.pow(1-a,.35);break;default:r=Math.sin(a*Math.PI)}let l=.94+.06*Math.sin(17.3*a+t);return Math.max(.3,t*r*i*l)}}function f(t,e){return a=>{let r;r=0===e?a<.15?Math.sin(a/.15*Math.PI/2):Math.pow(Math.max(0,1-(a-.15)/.85),1.5):Math.pow(Math.sin(a*Math.PI),.55);let o=.96+.04*Math.sin(19.7*a+t);return Math.max(.3,t*r*o)}}function d(t,e,a,r){let o={x:t.x+Math.cos(e)*a,y:t.y+Math.sin(e)*a},i=-(o.y-t.y),l=o.x-t.x,s=Math.sqrt(i*i+l*l)||1,n=i/s,h=l/s;return[t,{x:t.x+(o.x-t.x)*.33+n*a*r,y:t.y+(o.y-t.y)*.33+h*a*r},{x:t.x+(o.x-t.x)*.66+n*a*r*.6,y:t.y+(o.y-t.y)*.66+h*a*r*.6},o]}var y=t.i(90072),v=t.i(8560);let x=`
  uniform float uScrollY;
  uniform float uTime;
  uniform float uDensity;
  uniform float uGlobalAlpha;

  // Scroll-driven wobble plus a very slow time term so the field breathes
  // at rest (ambient motion: slow and constant, per the motion spec).
  vec2 place(vec2 p) {
    float phase = p.x * 0.003 + p.y * 0.002;
    float s = uScrollY * 0.0008 + uTime * 0.045;
    return p + vec2(sin(phase + s) * 12.0, cos(phase * 1.3 + s * 0.7) * 8.0);
  }
  // Density gating (roadmap W3): element order fraction vs a per-class
  // threshold, soft-faded so nothing pops. The 1.08 keeps the tail of every
  // class fully visible at density 1.
  float gateVis(vec2 g) {
    float thresh = pow(uDensity, g.y) * 1.08;
    return 1.0 - smoothstep(thresh - 0.06, thresh + 0.02, g.x);
  }
`,g=x+`
  attribute vec2 aPerp;
  attribute float aCross;
  attribute float aHalfWidth;
  attribute float aT;
  attribute vec4 aColor;
  attribute vec2 aGate;
  attribute float aTaper;
  varying float vCross;
  varying float vT;
  varying vec4 vColor;
  varying vec2 vGate;
  varying float vTaper;
  varying float vCover;
  varying float vHW;
  void main() {
    vec2 c = place(position.xy);
    float hw = max(aHalfWidth, 0.7);
    vCover = min(1.0, aHalfWidth / 0.7);
    vec2 p = c + aPerp * aCross * hw;
    vCross = aCross; vT = aT; vColor = aColor; vGate = aGate; vTaper = aTaper; vHW = hw;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`,m=x+`
  precision highp float;
  varying float vCross;
  varying float vT;
  varying vec4 vColor;
  varying vec2 vGate;
  varying float vTaper;
  varying float vCover;
  varying float vHW;
  void main() {
    float vis = gateVis(vGate);
    // Fixed ~1px anti-aliasing at the edge, whatever the width — so a wide
    // tube keeps a crisp contour and a solid body, a hairline stays soft.
    float dpx = abs(vCross) * vHW;
    float edge = 1.0 - smoothstep(vHW - 1.0, vHW + 0.15, dpx);
    float ef = vTaper > 0.0
      ? min(smoothstep(0.0, vTaper, vT), smoothstep(0.0, vTaper, 1.0 - vT))
      : 1.0;
    float a = vColor.a * vis * edge * ef * vCover * uGlobalAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(vColor.rgb, a);
  }
`,b=x+`
  attribute vec2 aPerp;
  attribute float aCross;
  attribute float aHalfWidth;
  attribute float aT;
  attribute float aOpacity;
  attribute vec2 aGate;
  varying float vD;
  varying float vHW;
  varying float vT;
  varying float vOp;
  varying vec2 vGate;
  const float GLOW = 14.0;
  void main() {
    vec2 c = place(position.xy);
    float ext = aHalfWidth + GLOW;
    vec2 p = c + aPerp * aCross * ext;
    vD = aCross * ext; vHW = aHalfWidth; vT = aT; vOp = aOpacity; vGate = aGate;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`,w=x+`
  precision highp float;
  varying float vD;
  varying float vHW;
  varying float vT;
  varying float vOp;
  varying vec2 vGate;
  void main() {
    float vis = gateVis(vGate);
    float d = abs(vD);
    float core = 1.0 - smoothstep(vHW - 0.7, vHW + 0.7, d);
    float aura = exp(-pow(d / (vHW * 3.0 + 2.0), 2.0)) * 0.14;
    float glow = exp(-pow(d / 12.0, 2.0)) * 0.22;
    float ef = min(smoothstep(0.0, 0.15, vT), smoothstep(0.0, 0.15, 1.0 - vT));
    float a = (core + aura + glow) * vOp * ef * vis * uGlobalAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(0.0, 0.6, 1.0, min(a, 1.0));
  }
`,M=x+`
  attribute vec2 aUV;
  attribute float aR;
  attribute float aOpacity;
  attribute vec2 aGate;
  attribute float aSoft;
  varying float vD;
  varying float vR;
  varying float vOp;
  varying vec2 vGate;
  varying float vSoft;
  void main() {
    vec2 c = place(position.xy);
    float ext = aR + 0.7;
    vec2 p = c + aUV * ext;
    vD = length(aUV) * ext; vR = aR; vOp = aOpacity; vGate = aGate; vSoft = aSoft;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`,T=x+`
  precision highp float;
  varying float vD;
  varying float vR;
  varying float vOp;
  varying vec2 vGate;
  varying float vSoft;
  void main() {
    float vis = gateVis(vGate);
    float hard = 1.0 - smoothstep(vR - 0.7, vR + 0.7, vD);
    float soft = exp(-pow(vD / (vR * 0.55), 2.0));
    float a = mix(hard, soft, vSoft) * vOp * vis * uGlobalAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(0.0, 0.0, 0.0, a);
  }
`,C=x+`
  attribute vec2 aPerp;
  attribute float aCross;
  attribute float aHalfWidth;
  attribute float aSeed;
  attribute float aOpacity;
  attribute vec2 aGate;
  varying vec2 vNormalXY;
  varying float vWorldY;
  varying float vSeed;
  varying float vOp;
  varying vec2 vGate;
  varying float vCross;
  const float HALF_PI = 1.5707963267948966;
  void main() {
    vec2 c = place(position.xy);
    vec2 p = c + aPerp * aCross * aHalfWidth;
    // Fake tube cross-section: centre faces the camera (matcap centre,
    // bright), edges graze away (matcap rim). aPerp is the LOCAL
    // tangent-perpendicular so the reflection follows every bend.
    vNormalXY = aPerp * sin(aCross * HALF_PI);
    vWorldY = p.y; vSeed = aSeed; vOp = aOpacity; vGate = aGate; vCross = aCross;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 0.0, 1.0);
  }
`,S=x+`
  precision highp float;
  uniform sampler2D uMatcap;
  uniform vec3 uTint;
  uniform vec3 uTintSky;
  uniform vec3 uTintGround;
  uniform float uViewportH;
  varying vec2 vNormalXY;
  varying float vWorldY;
  varying float vSeed;
  varying float vOp;
  varying vec2 vGate;
  varying float vCross;
  void main() {
    float vis = gateVis(vGate);
    vec2 uv = vNormalXY * 0.5 + 0.5;
    uv += vec2(sin(vSeed * 12.9898) * 0.015, cos(vSeed * 78.233) * 0.015);
    uv = clamp(uv, 0.02, 0.98);
    vec3 mc = texture2D(uMatcap, uv).rgb;
    float envT = clamp(vWorldY / max(uViewportH, 1.0), 0.0, 1.0);
    vec3 envTint = mix(uTintSky, uTintGround, envT);
    vec3 color = mc * mix(vec3(1.0), envTint, 0.28) * uTint;
    float edge = 1.0 - smoothstep(0.84, 1.0, abs(vCross));
    float a = vOp * vis * edge * uGlobalAlpha;
    if (a < 0.002) discard;
    gl_FragColor = vec4(color, a);
  }
`;class P{pos=[];perp=[];cross=[];hw=[];t=[];idx=[];extra={};vcount=0;constructor(t){for(const[e,a]of Object.entries(t))this.extra[e]={size:a,data:[]}}get empty(){return 0===this.vcount}addStrip(t,e,a){let r=t.length;if(r<2)return;let o=this.vcount;for(let o=0;o<r;o++){let i,l,s=o/(r-1);0===o?(i=t[1].x-t[0].x,l=t[1].y-t[0].y):o===r-1?(i=t[r-1].x-t[r-2].x,l=t[r-1].y-t[r-2].y):(i=t[o+1].x-t[o-1].x,l=t[o+1].y-t[o-1].y);let n=Math.sqrt(i*i+l*l)||1,h=-l/n,c=i/n,p=e(o,s),u=a(o,s);for(let e of[1,-1])for(let[a,{data:r}]of(this.pos.push(t[o].x,t[o].y,0),this.perp.push(h,c),this.cross.push(e),this.hw.push(p),this.t.push(s),Object.entries(this.extra)))r.push(...u[a])}for(let t=0;t<r-1;t++){let e=o+2*t,a=e+1,r=e+2,i=e+3;this.idx.push(e,r,a,r,i,a)}this.vcount+=2*r}build(){let t=new y.BufferGeometry;for(let[e,{size:a,data:r}]of(t.setAttribute("position",new y.Float32BufferAttribute(this.pos,3)),t.setAttribute("aPerp",new y.Float32BufferAttribute(this.perp,2)),t.setAttribute("aCross",new y.Float32BufferAttribute(this.cross,1)),t.setAttribute("aHalfWidth",new y.Float32BufferAttribute(this.hw,1)),t.setAttribute("aT",new y.Float32BufferAttribute(this.t,1)),Object.entries(this.extra)))t.setAttribute(e,new y.Float32BufferAttribute(r,a));return t.setIndex(this.idx),t}}class G{pos=[];uv=[];r=[];op=[];gate=[];soft=[];idx=[];vcount=0;get empty(){return 0===this.vcount}add(t,e,a,r,o,i=0){let l=this.vcount;for(let[l,s]of[[-1,-1],[1,-1],[1,1],[-1,1]])this.pos.push(t,e,0),this.uv.push(l,s),this.r.push(a),this.op.push(r),this.gate.push(o[0],o[1]),this.soft.push(i);this.idx.push(l,l+1,l+2,l,l+2,l+3),this.vcount+=4}build(){let t=new y.BufferGeometry;return t.setAttribute("position",new y.Float32BufferAttribute(this.pos,3)),t.setAttribute("aUV",new y.Float32BufferAttribute(this.uv,2)),t.setAttribute("aR",new y.Float32BufferAttribute(this.r,1)),t.setAttribute("aOpacity",new y.Float32BufferAttribute(this.op,1)),t.setAttribute("aGate",new y.Float32BufferAttribute(this.gate,2)),t.setAttribute("aSoft",new y.Float32BufferAttribute(this.soft,1)),t.setIndex(this.idx),t}}let A=(t,e,a=8)=>{let r=[];for(let o=0;o<=a;o++){let i=o/a;r.push({x:t.x+(e.x-t.x)*i,y:t.y+(e.y-t.y)*i})}return r},F=[0,0,0],W=[.02,.027,.055],E=[1,1,1],k=[160/255,160/255,160/255],O=[170/255,170/255,170/255];class R{renderer;scene=new y.Scene;camera;batches=[];matcapA;matcapB;porcelain;disposed=!1;viewH=1;onTexturesLoaded=null;u={uScrollY:{value:0},uTime:{value:0},uDensity:{value:1},uGlobalAlpha:{value:1},uViewportH:{value:1e3}};constructor(t){this.renderer=new v.WebGLRenderer({canvas:t,alpha:!0,antialias:!0,premultipliedAlpha:!1}),this.renderer.setClearColor(0,0),this.camera=new y.OrthographicCamera(0,1,0,1,-1e3,1e3);const e=new y.TextureLoader,a=()=>this.onTexturesLoaded?.();for(const t of(this.matcapA=e.load("/assets/textures/matcap-chrome-a.webp",a),this.matcapB=e.load("/assets/textures/matcap-chrome-b.webp",a),[this.matcapA,this.matcapB]))t.colorSpace=y.SRGBColorSpace,t.wrapS=y.ClampToEdgeWrapping,t.wrapT=y.ClampToEdgeWrapping,t.generateMipmaps=!1,t.minFilter=y.LinearFilter,t.magFilter=y.LinearFilter;this.porcelain=function(){let t=new Uint8Array(16384);for(let e=0;e<64;e++)for(let a=0;a<64;a++){let r=a/63*2-1,o=e/63*2-1,i=.985-.42*Math.pow(Math.min(1,Math.hypot(r,o)),2.2)+.16*Math.max(0,1-Math.hypot(r+.35,o-.35)/.6),l=(64*e+a)*4;t[l]=Math.round(255*Math.min(1,i)),t[l+1]=Math.round(255*Math.min(1,i+.006)),t[l+2]=Math.round(255*Math.min(1,i+.018)),t[l+3]=255}let e=new y.DataTexture(t,64,64,y.RGBAFormat);return e.colorSpace=y.SRGBColorSpace,e.minFilter=y.LinearFilter,e.magFilter=y.LinearFilter,e.needsUpdate=!0,e}()}resize(t,e,a){this.disposed||(this.viewH=e,this.renderer.setPixelRatio(a),this.renderer.setSize(t,e,!0),this.camera.left=0,this.camera.right=t,this.setViewOffset(0))}setViewOffset(t){this.camera.top=t,this.camera.bottom=t+this.viewH,this.camera.updateProjectionMatrix()}clear(){for(let{mesh:t,mat:e}of this.batches)this.scene.remove(t),t.geometry.dispose(),e.dispose();this.batches=[]}addBatch(t,e,a,r,o){let i=new y.ShaderMaterial({vertexShader:e,fragmentShader:a,transparent:!0,depthWrite:!1,depthTest:!1,side:y.DoubleSide,uniforms:{...this.u,...r}}),l=new y.Mesh(t,i);l.renderOrder=o,l.frustumCulled=!1,this.scene.add(l),this.batches.push({mesh:l,mat:i})}ribbonUniforms(t,e){return{uMatcap:{value:t},uTint:{value:new y.Color(e)},uTintSky:{value:new y.Color(0xd9e4ee)},uTintGround:{value:new y.Color(724242)}}}setScene(t){if(this.disposed)return;this.clear();let e=t.focalRadius,a=(t,e)=>e>1?t/(e-1):0,r={aColor:4,aGate:2,aTaper:1},o=(t,e,a,r,o,i,l,s)=>{t.addStrip(e,(t,e)=>s?s(e):a*(e<l?e/l:e>1-l?(1-e)/l:1)/2,()=>({aColor:[r[0],r[1],r[2],o],aGate:i,aTaper:[s?0:l]}))},i=t=>Math.min(1,t/.06,(1-t)/.06),l=new G;l.add(t.focal.x+.1*e,t.focal.y+.06*e,1.15*e,.1,[0,1.6],1);let s=new P(r);t.arcs.forEach((e,r)=>o(s,c(e.p0,e.cp,e.p1,16),e.width,O,e.opacity,[a(r,t.arcs.length),1],.15)),t.throughs.forEach((e,r)=>o(s,e.cp?c(e.p0,e.cp,e.p1,16):A(e.p0,e.p1),e.width,F,e.opacity,[a(r,t.throughs.length),1],.12)),t.hairlines.forEach((e,r)=>o(s,A(e.p0,e.p1,6),.5,e.gray?k:F,e.opacity,[a(r,t.hairlines.length),1.4],.15)),t.bundles.forEach((e,r)=>e.lines.forEach(i=>o(s,A(i.p0,i.p1,6),e.width,F,e.opacity,[a(r,t.bundles.length),1.2],.18))),t.scratches.forEach((e,r)=>o(s,e.cp?c(e.p0,e.cp,e.p1,8):A(e.p0,e.p1,3),e.width,F,e.opacity,[a(r,t.scratches.length),1.6],0)),t.wires.forEach((e,r)=>o(s,e.points,e.width,F,e.opacity,[a(r,t.wires.length),1.2],.06)),t.bolts.forEach((e,r)=>o(s,e.points,e.width,F,e.opacity,[a(r,t.bolts.length),1.1],.05)),t.fibers.forEach((e,r)=>e.strands.forEach(i=>o(s,i,e.width,F,e.opacity,[a(r,t.fibers.length),1.2],.08))),t.whips.forEach((e,r)=>o(s,e.points,e.maxWidth,F,e.opacity,[a(r,t.whips.length),1],0,t=>e.maxWidth*Math.sin(t*Math.PI)/2));let n=new G;t.blots.forEach((e,r)=>n.add(e.x,e.y,e.r,e.opacity,[a(r,t.blots.length),1],.35*(e.r>6)));let p=new P(r);t.swipes.forEach((e,r)=>o(p,h(e.cp,40),1,W,e.opacity,[a(r,t.swipes.length),.85],0,t=>e.widthFn(t)/2));let u=new P(r),f=new P({aSeed:1,aOpacity:1,aGate:2});t.cables.forEach((e,r)=>{let l=[a(r,t.cables.length),.9],s=e.width>8?2:1.4;o(u,e.points,1,F,e.opacity,l,0,t=>e.width*i(t)/2+s),f.addStrip(e.points,(t,a)=>e.width*i(a)/2,()=>({aSeed:[7.1*r],aOpacity:[.98],aGate:l}))}),t.scribbles.forEach((e,r)=>{let i=[a(r,t.scribbles.length),1.1];o(u,e.points,1,F,.9,i,0,()=>e.width/2+1.2),f.addStrip(e.points,()=>e.width/2,()=>({aSeed:[3.3*r],aOpacity:[.98],aGate:i}))});let d={aSeed:1,aOpacity:1,aGate:2},y=new P(d),v=new P(d),x=new P(d),R=(t,e,a,r,o,i,l)=>{t.addStrip(h(e,i),(t,e)=>a(e)/2,()=>({aSeed:[r],aOpacity:[o],aGate:l}))};t.inks.forEach((e,r)=>R(y,e.cp,e.widthFn,e.seed,.92,50,[a(r,t.inks.length),.8])),t.brushes.forEach((e,r)=>R(y,e.cp,e.widthFn,e.seed,e.opacity,60,[a(r,t.brushes.length),.7])),t.brushTangles.forEach((e,r)=>R(v,e.cp,e.widthFn,e.seed,e.opacity,30,[a(r,t.brushTangles.length),1.5])),t.thickCyans.forEach((e,r)=>R(x,e.cp,e.widthFn,e.seed,.9,40,[a(r,t.thickCyans.length),1]));let $=new P(r);t.streaks.forEach((e,r)=>o($,e.points,e.width,E,e.opacity,[a(r,t.streaks.length),1.2],0,t=>e.width*Math.sin(Math.min(1,1.15*t)*Math.PI)/2));let B=new G;t.splatter.forEach((e,r)=>B.add(e.x,e.y,e.r,e.opacity,[a(r,t.splatter.length),1.5])),t.scratches.forEach((e,r)=>{e.hasDot&&B.add(e.p0.x,e.p0.y,.7*e.width,e.opacity,[a(r,t.scratches.length),1.6])}),t.accents.forEach((e,r)=>{e.hasDot&&B.add(e.p0.x,e.p0.y,.8*e.width,e.opacity,[a(r,t.accents.length),1.4])});let I=new P(r);t.accents.forEach((e,r)=>I.addStrip(e.cp?c(e.p0,e.cp,e.p1,8):A(e.p0,e.p1,3),()=>e.width/2,()=>({aColor:[0,0,0,e.opacity],aGate:[a(r,t.accents.length),1.4],aTaper:[0]})));let H=new P({aOpacity:1,aGate:2});t.cyans.forEach((e,r)=>H.addStrip(e.cp?c(e.p0,e.cp,e.p1,16):A(e.p0,e.p1,4),()=>e.width/2,()=>({aOpacity:[e.opacity],aGate:[a(r,t.cyans.length),1.1]}))),t.thickCyans.forEach((e,r)=>H.addStrip(h(e.cp,24),(t,a)=>.35*e.widthFn(a),()=>({aOpacity:[.45],aGate:[a(r,t.thickCyans.length),1]})));let D=0;l.empty||this.addBatch(l.build(),M,T,{},D++),s.empty||this.addBatch(s.build(),g,m,{},D++),n.empty||this.addBatch(n.build(),M,T,{},D++),p.empty||this.addBatch(p.build(),g,m,{},D++),y.empty||this.addBatch(y.build(),C,S,this.ribbonUniforms(this.matcapA,0xffffff),D++),v.empty||this.addBatch(v.build(),C,S,this.ribbonUniforms(this.matcapB,0xffffff),D++),u.empty||this.addBatch(u.build(),g,m,{},D++),f.empty||this.addBatch(f.build(),C,S,this.ribbonUniforms(this.porcelain,0xffffff),D++),$.empty||this.addBatch($.build(),g,m,{},D++),B.empty||this.addBatch(B.build(),M,T,{},D++),I.empty||this.addBatch(I.build(),g,m,{},D++),H.empty||this.addBatch(H.build(),b,w,{},D++),x.empty||this.addBatch(x.build(),C,S,this.ribbonUniforms(this.matcapA,3389695),D++)}render(t,e,a,r,o){this.disposed||(this.u.uScrollY.value=t,this.u.uTime.value=o,this.u.uDensity.value=e,this.u.uGlobalAlpha.value=a,this.u.uViewportH.value=r,this.renderer.render(this.scene,this.camera))}dispose(){this.disposed||(this.disposed=!0,this.clear(),this.matcapA.dispose(),this.matcapB.dispose(),this.porcelain.dispose(),this.renderer.dispose())}}let $=[],B=!1;function I(t){if(!B||0===$.length)return null;let e=Math.floor(Math.abs(7.3*t)%$.length),a=$[e];return a.complete&&a.naturalWidth>0?a:null}function H(t){let e=t.length,a=[];for(let r=0;r<e;r++){let o,i;0===r?(o=t[1].x-t[0].x,i=t[1].y-t[0].y):r===e-1?(o=t[e-1].x-t[e-2].x,i=t[e-1].y-t[e-2].y):(o=t[r+1].x-t[r-1].x,i=t[r+1].y-t[r-1].y);let l=Math.sqrt(o*o+i*i)||1;a.push({x:-i/l,y:o/l})}return a}function D(t,e,a,r,o=1){let i=I(r);if(!i)return;let l=e.length;if(l<2)return;let s=H(e),n=i.naturalWidth,h=i.naturalHeight,c=[],p=[];for(let t=0;t<l;t++){let r=a(t/(l-1))/2;c.push({x:e[t].x+s[t].x*r,y:e[t].y+s[t].y*r}),p.push({x:e[t].x-s[t].x*r,y:e[t].y-s[t].y*r})}t.save(),t.globalAlpha=o;for(let e=0;e<l-1;e++){let r=e/(l-1),o=(e+1)/(l-1),s=r*n,u=o*n;a(r)/2<.2&&a(o)/2<.2||(L(t,i,s,0,u,0,s,h,c[e].x,c[e].y,c[e+1].x,c[e+1].y,p[e].x,p[e].y),L(t,i,u,0,u,h,s,h,c[e+1].x,c[e+1].y,p[e+1].x,p[e+1].y,p[e].x,p[e].y))}t.restore()}function L(t,e,a,r,o,i,l,s,n,h,c,p,u,f){t.save(),t.beginPath(),t.moveTo(n,h),t.lineTo(c,p),t.lineTo(u,f),t.closePath(),t.clip();let d=(a-l)*(i-s)-(o-l)*(r-s);if(.001>Math.abs(d))return void t.restore();let y=1/d,v=((n-u)*(i-s)-(c-u)*(r-s))*y,x=((h-f)*(i-s)-(p-f)*(r-s))*y,g=((c-u)*(a-l)-(n-u)*(o-l))*y,m=((p-f)*(a-l)-(h-f)*(o-l))*y;t.transform(v,x,g,m,n-v*a-g*r,h-x*a-m*r),t.drawImage(e,0,0),t.restore()}function V(t,e,a,r){let o=e.length;if(o<2)return;let i=H(e);t.fillStyle=r,t.beginPath();for(let r=0;r<o;r++){let l=a(r/(o-1))/2,s=e[r].x+i[r].x*l,n=e[r].y+i[r].y*l;0===r?t.moveTo(s,n):t.lineTo(s,n)}for(let r=o-1;r>=0;r--){let l=a(r/(o-1))/2;t.lineTo(e[r].x-i[r].x*l,e[r].y-i[r].y*l)}t.closePath(),t.fill()}function Y(t,e,a,r){V(t,e,a,"rgba(5,7,14,0.9)"),I(r)&&D(t,e,a,r,1)}function q(t,e,a,r,o=[0,0,0]){let i=o[2]>200;V(t,e,a,i?"rgba(0,80,140,0.85)":"rgba(5,7,14,0.92)"),!i&&I(r)&&D(t,e,a,r,.9)}function U(t,e,a,r,o,i,l=.15){let s=a.x-e.x,n=a.y-e.y,h=Math.sqrt(s*s+n*n);if(h<1)return;let c=-n/h,p=s/h,u=t.createLinearGradient(e.x,e.y,a.x,a.y);u.addColorStop(0,`rgba(${i},0)`),u.addColorStop(Math.min(l,.49),`rgba(${i},${o})`),u.addColorStop(Math.max(1-l,.51),`rgba(${i},${o})`),u.addColorStop(1,`rgba(${i},0)`);let f=t=>t<l?t/l:t>1-l?(1-t)/l:1;t.fillStyle=u,t.beginPath();for(let a=0;a<=10;a++){let o=a/10,i=r*f(o)*.5,l=e.x+s*o+c*i,h=e.y+n*o+p*i;0===a?t.moveTo(l,h):t.lineTo(l,h)}for(let a=10;a>=0;a--){let o=a/10,i=r*f(o)*.5;t.lineTo(e.x+s*o-c*i,e.y+n*o-p*i)}t.closePath(),t.fill()}function j(t,e,a,r,o,i=.15){let l=e.length;if(l<2)return;let s=H(e),n=t.createLinearGradient(e[0].x,e[0].y,e[l-1].x,e[l-1].y);n.addColorStop(0,`rgba(${o},0)`),n.addColorStop(Math.min(i,.49),`rgba(${o},${r})`),n.addColorStop(Math.max(1-i,.51),`rgba(${o},${r})`),n.addColorStop(1,`rgba(${o},0)`);let h=t=>t<i?t/i:t>1-i?(1-t)/i:1;t.fillStyle=n,t.beginPath();for(let r=0;r<l;r++){let o=a*h(r/(l-1))*.5,i=e[r].x+s[r].x*o,n=e[r].y+s[r].y*o;0===r?t.moveTo(i,n):t.lineTo(i,n)}for(let r=l-1;r>=0;r--){let o=a*h(r/(l-1))*.5;t.lineTo(e[r].x-s[r].x*o,e[r].y-s[r].y*o)}t.closePath(),t.fill()}function _(t,e,a){let r=Math.min(1,Math.max(0,Math.pow(e,a)));return r>=1?t:t.slice(0,Math.round(t.length*r))}let N=(t,e)=>t.map(t=>p(t,e)),[z,X]=s.FOCAL,K=(0,a.memo)(function(){let t=(0,a.useRef)(null),y=(0,a.useRef)(null),v=(0,a.useRef)(null),x=(0,a.useRef)(null),g=(0,a.useRef)(null),m=(0,a.useRef)({w:0,h:0,vh:0,dpr:1}),b=(0,a.useRef)(-1),w=(0,a.useRef)(null),M=(0,a.useRef)(null),T=(0,a.useRef)(!1),C=(0,a.useRef)(0),S=(0,a.useRef)(0),P=(0,a.useRef)(0),G=(0,r.useStore)(t=>t.deviceTier),A=(0,a.useRef)(null),F=(0,a.useCallback)(()=>{if(C.current)return;let t=()=>{A.current?.(window.scrollY);let e=i.smoothedTuneRef.current,a=Math.abs(e-P.current)>5e-4||e>.002;P.current=e,C.current=a?requestAnimationFrame(t):0};C.current=requestAnimationFrame(t)},[]),W=(0,a.useCallback)(()=>{if(S.current)return;let t=()=>{A.current?.(window.scrollY),S.current=requestAnimationFrame(t)};S.current=requestAnimationFrame(t)},[]),E=(0,a.useCallback)(()=>{S.current&&cancelAnimationFrame(S.current),S.current=0},[]),k=(0,a.useCallback)(e=>{let a=g.current,o=m.current;if(!a)return;let{densityOverride:l}=r.useStore.getState(),s=l??i.smoothedDensityRef.current,n=s<.12?Math.max(.08,s/.12):1;if(T.current&&M.current){let t=Math.min(.8*o.vh,.12*e);M.current.setViewOffset(.8*o.vh+t),M.current.render(e,s,n,o.h,performance.now()/1e3);return}let u=t.current,f=y.current;if(!u||!f)return;let d=u.getContext("2d");d.setTransform(o.dpr,0,0,o.dpr,0,0),function(t,e,a,r,o,i=1){for(let l of(t.clearRect(0,0,r,o),t.globalAlpha=i<.12?Math.max(.08,i/.12):1,e.focalRadius,_(e.arcs,i,1)))j(t,c(p(l.p0,a),p(l.cp,a),p(l.p1,a),16),l.width,l.opacity,"170,170,170",.15);for(let r of _(e.throughs,i,1)){let e=p(r.p0,a),o=p(r.p1,a);r.cp?j(t,c(e,p(r.cp,a),o,16),r.width,r.opacity,"0,0,0",.12):U(t,e,o,r.width,r.opacity,"0,0,0",.12)}for(let r of _(e.hairlines,i,1.4))U(t,p(r.p0,a),p(r.p1,a),.5,r.opacity,r.gray?"160,160,160":"0,0,0");for(let r of _(e.bundles,i,1.2))for(let e of r.lines)U(t,p(e.p0,a),p(e.p1,a),r.width,r.opacity,"0,0,0",.18);for(let r of(t.lineCap="round",t.lineJoin="round",_(e.scratches,i,1.6))){let e=p(r.p0,a),o=p(r.p1,a);if(t.strokeStyle=`rgba(0,0,0,${r.opacity})`,t.lineWidth=r.width,t.beginPath(),t.moveTo(e.x,e.y),r.cp){let e=p(r.cp,a);t.quadraticCurveTo(e.x,e.y,o.x,o.y)}else t.lineTo(o.x,o.y);t.stroke(),r.hasDot&&(t.fillStyle=`rgba(0,0,0,${r.opacity})`,t.beginPath(),t.arc(e.x,e.y,.7*r.width,0,2*Math.PI),t.fill())}for(let r of _(e.wires,i,1.2)){t.strokeStyle=`rgba(0,0,0,${r.opacity})`,t.lineWidth=r.width;var l=N(r.points,a);if(!(l.length<2)){if(t.beginPath(),t.moveTo(l[0].x,l[0].y),2===l.length)t.lineTo(l[1].x,l[1].y);else{for(let e=1;e<l.length-1;e++)t.quadraticCurveTo(l[e].x,l[e].y,(l[e].x+l[e+1].x)/2,(l[e].y+l[e+1].y)/2);t.lineTo(l[l.length-1].x,l[l.length-1].y)}t.stroke()}}let s=e=>{t.beginPath(),e.forEach((e,a)=>0===a?t.moveTo(e.x,e.y):t.lineTo(e.x,e.y)),t.stroke()};for(let r of _(e.bolts,i,1.1))t.strokeStyle=`rgba(0,0,0,${r.opacity})`,t.lineWidth=r.width,s(N(r.points,a));for(let r of _(e.fibers,i,1.2))for(let e of(t.strokeStyle=`rgba(0,0,0,${r.opacity})`,t.lineWidth=r.width,r.strands))s(N(e,a));for(let r of _(e.blots,i,1)){let e=p({x:r.x,y:r.y},a);t.fillStyle=`rgba(0,0,0,${r.opacity})`,t.beginPath(),t.arc(e.x,e.y,r.r,0,2*Math.PI),t.fill()}for(let r of _(e.swipes,i,.85))V(t,h(r.cp.map(t=>p(t,a)),40),r.widthFn,`rgba(5,7,14,${r.opacity})`);for(let r of _(e.whips,i,1))!function(t,e,a,r){let o=t=>a*Math.sin(t*Math.PI);V(t,e,o,`rgba(0,0,0,${r})`);let i=73.1*a+137.3*r+.01*e[0].x;a>4&&I(i)&&D(t,e,o,i,.7*r)}(t,N(r.points,a),r.maxWidth,r.opacity);for(let r of _(e.inks,i,.8))q(t,h(r.cp.map(t=>p(t,a)),50),r.widthFn,r.seed,r.rgb);for(let r of _(e.brushTangles,i,1.5))Y(t,h(r.cp.map(t=>p(t,a)),30),r.widthFn,r.seed);for(let r of _(e.brushes,i,.7))Y(t,h(r.cp.map(t=>p(t,a)),60),r.widthFn,r.seed);let n=(e,a,r)=>{V(t,e,t=>2*a(t)+2.4,`rgba(0,0,0,${r})`),V(t,e,t=>2*a(t),"rgba(244,246,249,0.96)")},u=t=>Math.min(1,t/.06,(1-t)/.06);for(let t of _(e.cables,i,.9))n(N(t.points,a),e=>t.width*u(e)/2,t.opacity);for(let t of _(e.scribbles,i,1.1))n(N(t.points,a),()=>t.width/2,.9);for(let r of _(e.streaks,i,1.2))V(t,N(r.points,a),t=>r.width*Math.sin(Math.min(1,1.15*t)*Math.PI),`rgba(255,255,255,${r.opacity})`);for(let r of _(e.splatter,i,1.5)){let e=p({x:r.x,y:r.y},a);t.fillStyle=`rgba(0,0,0,${r.opacity})`,t.beginPath(),t.arc(e.x,e.y,r.r,0,2*Math.PI),t.fill()}for(let r of(t.lineCap="round",_(e.accents,i,1.4))){let e=p(r.p0,a),o=p(r.p1,a);if(t.strokeStyle=`rgba(0,0,0,${r.opacity})`,t.lineWidth=r.width,t.beginPath(),t.moveTo(e.x,e.y),r.cp){let e=p(r.cp,a);t.quadraticCurveTo(e.x,e.y,o.x,o.y)}else t.lineTo(o.x,o.y);t.stroke(),r.hasDot&&(t.fillStyle=`rgba(0,0,0,${r.opacity})`,t.beginPath(),t.arc(e.x,e.y,.8*r.width,0,2*Math.PI),t.fill())}let f=(e,r,o)=>{let i=p(e.p0,a),l=p(e.p1,a),s=t.createLinearGradient(i.x,i.y,l.x,l.y),n=e.opacity*o;if(s.addColorStop(0,"rgba(0,153,255,0)"),s.addColorStop(.15,`rgba(0,153,255,${n})`),s.addColorStop(.85,`rgba(0,153,255,${n})`),s.addColorStop(1,"rgba(0,153,255,0)"),t.strokeStyle=s,t.lineWidth=e.width*r,t.beginPath(),t.moveTo(i.x,i.y),e.cp){let r=p(e.cp,a);t.quadraticCurveTo(r.x,r.y,l.x,l.y)}else t.lineTo(l.x,l.y);t.stroke()},d=_(e.cyans,i,1.1);for(let t of d)f(t,4,.2);for(let r of _(e.thickCyans,i,1))q(t,h(r.cp.map(t=>p(t,a)),40),r.widthFn,r.seed,r.rgb);for(let t of d)f(t,1,1)}(d,a,e,o.w,o.h,s);let v=f.getContext("2d");v.setTransform(o.dpr,0,0,o.dpr,0,0),function(t,e,a,r,o,i=1){for(let l of(t.clearRect(0,0,r,o),t.globalAlpha=i<.12?Math.max(.08,i/.12):1,t.lineCap="round",_(e.cyans,i,1.1))){let e=p(l.p0,a),r=p(l.p1,a),o=t.createLinearGradient(e.x,e.y,r.x,r.y);if(o.addColorStop(0,"rgba(0,153,255,0)"),o.addColorStop(.15,`rgba(0,153,255,${l.opacity})`),o.addColorStop(.85,`rgba(0,153,255,${l.opacity})`),o.addColorStop(1,"rgba(0,153,255,0)"),t.strokeStyle=o,t.lineWidth=l.width,t.beginPath(),t.moveTo(e.x,e.y),l.cp){let e=p(l.cp,a);t.quadraticCurveTo(e.x,e.y,r.x,r.y)}else t.lineTo(r.x,r.y);t.stroke()}for(let r of _(e.thickCyans,i,1))q(t,h(r.cp.map(t=>p(t,a)),40),r.widthFn,r.seed,r.rgb)}(v,a,e,o.w,o.h,s),F()},[F]);(0,a.useEffect)(()=>{A.current=k},[k]);let O=(0,a.useCallback)(()=>{let e=t.current,a=y.current,i=v.current,l=x.current;if(!e||!a||!i||!l)return;let p="mobile"===G?1:Math.min(window.devicePixelRatio,2),b=Math.round(window.innerWidth),w=Math.round(window.innerHeight),C=Math.round(.8*w),S=w+2*C;l.style.top=`-${C}px`,l.style.height=`${S}px`,l.style.transformOrigin=`${100*z}% ${X*w+C}px`,g.current=function(t,e,a,r,o,i,l,p){let y=Math.sqrt(a*a+r*r),v=2*Math.PI/(n.PHI*n.PHI),x={x:t,y:e},g=.13*Math.min(a,o),m=t=>t.map(([t,e])=>({x:t*a,y:e*o+p})),b=[],w=[];for(let t of s.BLADES)b.push({cp:m(t.cp),maxWidth:t.width,opacity:.96,widthFn:u(t.width,t.taper),seed:100*l()});let M=(a,r)=>({x:t+Math.cos(a)*g*r,y:e+Math.sin(a)*g*r}),T=(t,e,a,r,o,i,s,n=!0)=>{let h=d(t,e,a,r);if(b.push({cp:h,maxWidth:o,opacity:s,widthFn:u(o,i),seed:100*l()}),n)for(let t=0;t<4;t++){let t=h[3];w.push({x:t.x+(l()-.5)*30,y:t.y+(l()-.5)*30,r:1+3.2*l(),opacity:.3+.5*l()})}};for(let t=0;t<Math.ceil(2*i);t++){let e=t*v+1.1+(l()-.5)*.5;T(M(e,.15+.4*l()),e,y*(.3+.35*l()),(l()-.5)*.35,16+22*l(),Math.floor(3*l()),.88+.12*l())}for(let t=0;t<Math.ceil(3*i);t++){let e=t*v+(l()-.5)*.8;T(M(e,.2+.5*l()),e+(l()-.5)*.6,y*(.08+.12*l()),(l()-.5)*.5,12+16*l(),.6>l()?0:1,.85+.15*l())}for(let o=0;o<Math.ceil(3*i);o++){let o=Math.floor(4*l()),i=1===o?a+20:3===o?-20:l()*a,s=0===o?-20:2===o?r+20:l()*r,n=Math.atan2(e-s,t-i)+(l()-.5)*.5;T({x:i,y:s},n,y*(.18+.2*l()),(l()-.5)*.4,14+22*l(),2,.75+.25*l(),!1)}let C=[Math.atan2(r,a),Math.atan2(r,-a),Math.atan2(a,-r),Math.atan2(-a,-r)];for(let t=0;t<2;t++){let e=C[t]+(l()-.5)*.15;T(M(e,.1+.35*l()),e,y*(.35+.25*l()),(l()-.5)*.2,18+18*l(),Math.floor(3*l()),.9+.1*l())}let S=[];for(let a=0;a<Math.floor(30*i);a++){let r=a*v+(l()-.5)*.3,o=y*(.2+.7*l()),i=15*l(),s={x:t+Math.cos(r)*i,y:e+Math.sin(r)*i},n={x:t+Math.cos(r)*o,y:e+Math.sin(r)*o},h=.3>l();S.push({p0:s,p1:n,cp:h?{x:(s.x+n.x)/2+(l()-.5)*o*.08,y:(s.y+n.y)/2+(l()-.5)*o*.08}:void 0,width:.8+4.2*l(),opacity:.3+.5*l()})}let P=[];for(let a=0;a<Math.floor(110*i);a++){let r=(a+.5)*v+(l()-.5)*.5,o=y*(.1+.8*l()),i=15*l();P.push({p0:{x:t+Math.cos(r)*i,y:e+Math.sin(r)*i},p1:{x:t+Math.cos(r)*o,y:e+Math.sin(r)*o},opacity:.03+.17*l(),gray:.4>l()})}for(let a=0;a<Math.floor(24*i);a++){let r=a*v+(l()-.5)*.8,o=y*(.15+.45*l()),i=t+Math.cos(r)*o,s=e+Math.sin(r)*o,n=r+(l()-.5)*.7,h=y*(.05+.3*l());P.push({p0:{x:i,y:s},p1:{x:i+Math.cos(n)*h,y:s+Math.sin(n)*h},opacity:.03+.12*l(),gray:.5>l()})}let{cables:G,swipes:A,fibers:F,scribbles:W,streaks:E,bolts:k,wires:O,blots:R}=function(t,e,a,r){let o=[r()*Math.PI*2,r()*Math.PI*2,r()*Math.PI*2],i=()=>.6>r()?o[Math.floor(r()*o.length)]+(r()-.5)*.8:r()*Math.PI*2,l=a=>{let o=r()*Math.PI*2,i=Math.pow(r(),2)*e*a;return{x:t.x+Math.cos(o)*i,y:t.y+Math.sin(o)*i}},s=(t,e,a,r,o)=>{let i={x:t.x+Math.cos(e)*a,y:t.y+Math.sin(e)*a},l=-Math.sin(e),s=Math.cos(e);return c(t,{x:(t.x+i.x)/2+l*a*r,y:(t.y+i.y)/2+s*a*r},i,o)},n=[];for(let t=0;t<Math.round(26*a);t++){let t=e*(.3+1.1*Math.pow(r(),.9)),a=d(l(.25),i(),t,(r()-.5)*1);n.push({points:h(a,22),width:2.2+4.2*r(),opacity:.8+.2*r()})}let p=[];for(let t=0;t<Math.round(6*a);t++){let t=5+10*r();p.push({cp:d(l(.3),i(),e*(.3+.9*r()),(r()-.5)*1.1),widthFn:f(t,.5>r()?0:1),opacity:.85+.15*r()})}let u=[];for(let t=0;t<Math.round(9*a);t++){let t=l(.3),a=i(),o=e*(.6+1.6*r()),n=(r()-.5)*1.2,h=6+Math.floor(9*r()),c=1.2+1.6*r(),p=[];for(let e=0;e<h;e++){let i=(e-(h-1)/2)*c,l=-Math.sin(a),u=Math.cos(a),f=s({x:t.x+l*i,y:t.y+u*i},a+(r()-.5)*.08,o*(.85+.3*r()),n+(r()-.5)*.1,22);p.push(f.map(t=>({x:t.x+(r()-.5)*1.5,y:t.y+(r()-.5)*1.5})))}u.push({strands:p,width:.45+.4*r(),opacity:.3+.45*r()})}let y=[];for(let o=0;o<Math.round(7*a);o++){let a=l(.6),o=r()*Math.PI*2,i=[a],s=30+Math.floor(34*r());for(let l=0;l<s;l++){o+=(r()-.5)*1.3+(.08>r()?.6*Math.PI:0);let l=6+12*r(),s=(a={x:a.x+Math.cos(o)*l,y:a.y+Math.sin(o)*l}).x-t.x,n=a.y-t.y;Math.hypot(s,n)>1.6*e&&(o=Math.atan2(-n,-s)+(r()-.5)*.6),i.push(a)}y.push({points:i,width:1.6+1.2*r()})}let v=[];for(let t=0;t<Math.round(20*a);t++)v.push({points:s(l(.45),i(),e*(.15+.85*r()),(r()-.5)*.3,10),width:1+2.6*r(),opacity:.6+.4*r()});let x=[];for(let t=0;t<Math.round(6*a);t++){let t=l(.35),a=i(),o=[t],s=5+Math.floor(5*r()),n=e*(.5+1.3*r());for(let e=0;e<s;e++){a+=(r()-.5)*1.6;let e=n/s*(.5+r());t={x:t.x+Math.cos(a)*e,y:t.y+Math.sin(a)*e},o.push(t)}x.push({points:o,width:.6+1.1*r(),opacity:.45+.5*r()})}let g=[];for(let t=0;t<Math.round(14*a);t++){let t=l(.4),a=i(),o=e*(.6+1.6*r()),s={x:t.x+Math.cos(a)*o,y:t.y+Math.sin(a)*o},n=-Math.sin(a),h=Math.cos(a),p={x:(t.x+s.x)/2+n*o*(r()-.5)*1.4,y:(t.y+s.y)/2+h*o*(r()-.5)*1.4};g.push({points:c(t,p,s,24),width:.5+.8*r(),opacity:.3+.5*r()})}let m=[];for(let t=0;t<Math.round(5*a);t++){let t=l(.25);m.push({x:t.x,y:t.y,r:9+16*r(),opacity:.85+.15*r()})}for(let t=0;t<Math.round(32*a);t++){let t=l(.95);m.push({x:t.x,y:t.y,r:1.5+12*Math.pow(r(),1.6),opacity:.35+.6*r()})}return{cables:n,swipes:p,fibers:u,scribbles:y,streaks:v,bolts:x,wires:g,blots:m}}(x,g,i,l);for(let t of s.TUBES)G.push({points:h(m(t.cp),48),width:t.width,opacity:t.opacity??1});for(let t of s.SWIPES)A.push({cp:m(t.cp),widthFn:f(t.width,t.variant),opacity:.94});let $=[],B=t=>0===t?{x:l()*a,y:-40}:1===t?{x:a+40,y:l()*r}:2===t?{x:l()*a,y:r+40}:{x:-40,y:l()*r};for(let o=0;o<Math.floor(12*i);o++){let o=Math.floor(4*l()),i=(o+1+Math.floor(3*l()))%4;$.push({p0:B(o),cp:{x:t+(l()-.5)*a*.5,y:e+(l()-.5)*r*.5},p1:B(i),width:.4+.8*l(),opacity:.04+.1*l()})}let I=1/n.PHI,H=[{x:a/3,y:r/3},{x:2*a/3,y:r/3},{x:a/3,y:2*r/3},{x:2*a/3,y:2*r/3},{x:a/4,y:r/4},{x:3*a/4,y:r/4},{x:a/4,y:3*r/4},{x:3*a/4,y:3*r/4},{x:a*I,y:r*I},{x:a*(1-I),y:r*I},{x:a*I,y:r*(1-I)},{x:a*(1-I),y:r*(1-I)}],D=[];for(let t=0;t<Math.floor(24*i);t++){let t=H[Math.floor(l()*H.length)],e=t.x+(l()-.5)*a*.16,o=t.y+(l()-.5)*r*.16,i=l()*Math.PI*2,s=20+50*l(),n={x:e,y:o},h={x:e+Math.cos(i)*s,y:o+Math.sin(i)*s},c=.35>l();D.push({p0:n,p1:h,cp:c?{x:(n.x+h.x)/2+(l()-.5)*s*.3,y:(n.y+h.y)/2+(l()-.5)*s*.3}:void 0,width:.5+3*l(),opacity:.2+.4*l(),hasDot:.4>l()})}let L=[];for(let a=0;a<Math.floor(34*i);a++){let a=l()*Math.PI*2,r=g*(1.15+1.3*l()),o=t+Math.cos(a)*r,i=e+Math.sin(a)*r,s=l()*Math.PI*2,n=8+34*l(),h={x:o,y:i},c={x:o+Math.cos(s)*n,y:i+Math.sin(s)*n},p=.3>l();L.push({p0:h,p1:c,cp:p?{x:(h.x+c.x)/2+(l()-.5)*n*.4,y:(h.y+c.y)/2+(l()-.5)*n*.4}:void 0,width:.4+2*l(),opacity:.15+.4*l(),hasDot:.2>l()})}let V=[];for(let a=0;a<Math.floor(22*i);a++){let r=a<4?C[a]+(l()-.5)*.52:l()*Math.PI*2,o=(l()-.5)*30,i=-Math.sin(r)*o,s=Math.cos(r)*o,n=.6*y,h={x:t+i-Math.cos(r)*n,y:e+s-Math.sin(r)*n},c={x:t+i+Math.cos(r)*n,y:e+s+Math.sin(r)*n},p=.4>l();V.push({p0:h,p1:c,cp:p?{x:(h.x+c.x)/2+(l()-.5)*n*.06,y:(h.y+c.y)/2+(l()-.5)*n*.06}:void 0,width:.4+1.1*l(),opacity:.05+.15*l()})}let Y=[];for(let a=0;a<Math.floor(10*i);a++){let r=a*v+(l()-.5)*.6,o=y*(.18+.35*l()),i=M(r,.2+.5*l()),s={x:t+Math.cos(r)*o,y:e+Math.sin(r)*o},n=o*(.05+.12*l())*(.5>l()?1:-1),h={x:(i.x+s.x)/2+Math.cos(r+Math.PI/2)*n,y:(i.y+s.y)/2+Math.sin(r+Math.PI/2)*n};Y.push({points:c(i,h,s,20),maxWidth:2+4*l(),opacity:.15+.35*l()})}let q=[];for(let t=0;t<Math.floor(8*i);t++){let t=M(l()*Math.PI*2,.3+.8*l()),e=l()*Math.PI*2,a=y*(.05+.07*l()),r=(l()-.5)*1.2,o=3+9*l(),i=.5>l()?0:2;q.push({cp:d(t,e,a,r),maxWidth:o,opacity:.5+.35*l(),widthFn:u(o,i),seed:100*l()})}let U=[];for(let t=0;t<Math.ceil(+i);t++){let e=t*v+(l()-.5)*.4,a=M(e,.1+.4*l()),r=y*(.22+.3*l()),o=(l()-.5)*.25,i=30+28*l(),s=.6>l()?0:1;U.push({cp:d(a,e,r,o),maxWidth:i,widthFn:f(i,s),seed:100*l(),rgb:[0,0,0]})}let j=[];for(let t=0;t<Math.ceil(2*i);t++){let e=t*v+(l()-.5)*.5+.3*Math.PI,a=M(e,.2+.6*l()),r=y*(.18+.3*l()),o=(l()-.5)*.35,i=12+25*l(),s=.5>l()?0:1;j.push({cp:d(a,e,r,o),maxWidth:i,widthFn:f(i,s),seed:100*l(),rgb:[0,153,255]})}let _=[];for(let a=0;a<Math.ceil(4*i);a++){let r=a*v+(l()-.5)*.6,o=y*(.1+.35*l()),i=t+Math.cos(r)*o,s=e+Math.sin(r)*o,n=r+(l()-.5)*.5,h=5+Math.floor(6*l()),c=3+8*l(),p=y*(.08+.25*l()),u=[],f=-Math.sin(n),d=Math.cos(n);for(let t=0;t<h;t++){let e=(t-(h-1)/2)*c,a=p*(.7+.6*l());u.push({p0:{x:i+f*e,y:s+d*e},p1:{x:i+f*e+Math.cos(n)*a,y:s+d*e+Math.sin(n)*a}})}_.push({lines:u,width:.3+.7*l(),opacity:.06+.14*l()})}return{focal:x,focalRadius:g,brushes:b,brushTangles:q,inks:U,thickCyans:j,cyans:S,hairlines:P,bundles:_,throughs:V,arcs:$,accents:D,scratches:L,whips:Y,splatter:w,cables:G,swipes:A,fibers:F,scribbles:W,streaks:E,bolts:k,wires:O,blots:R}}(z*b,X*w+C,b,S,w,"mobile"===G?.35:"tablet"===G?.55:1,(0,o.mulberry32)(s.TEXTURE_SEED),C),m.current={w:b,h:S,vh:w,dpr:p};let P=("desktop"===G||"wide"===G)&&!r.useStore.getState().reducedMotion&&function(){try{let t=document.createElement("canvas");return!!(t.getContext("webgl2")||t.getContext("webgl"))}catch{return!1}}(),F=!1;if(P)try{if(!M.current){let t=new R(i);t.onTexturesLoaded=()=>A.current?.(window.scrollY),M.current=t}M.current.resize(b,w,p),M.current.setScene(g.current),F=!0}catch{M.current?.dispose(),M.current=null}else M.current&&(M.current.dispose(),M.current=null);for(let t of(T.current=F,F&&!document.hidden?W():E(),i.style.display=F?"block":"none",i.style.top=`${C}px`,i.style.width=`${b}px`,i.style.height=`${w}px`,[e,a]))t.style.display=F?"none":"block",t.width=F?1:b*p,t.height=F?1:S*p,t.style.width=`${b}px`,t.style.height=`${S}px`;F||(function(){if(B)return Promise.resolve();let t=["/assets/textures/brush/stroke.webp","/assets/textures/brush/stroke2.webp"];return new Promise(e=>{let a=0;$=t.map(r=>{let o=new Image;return o.onload=o.onerror=()=>{++a>=t.length&&(B=!0,e())},o.src=r,o})})})().then(()=>{g.current&&A.current?.(window.scrollY)}),k(window.scrollY)},[G,k,W,E]);return(0,a.useEffect)(()=>{let t=()=>{document.hidden?E():T.current&&W()};return document.addEventListener("visibilitychange",t),()=>document.removeEventListener("visibilitychange",t)},[W,E]),(0,a.useEffect)(()=>{O();let t=()=>{w.current&&clearTimeout(w.current),w.current=setTimeout(O,200)};return window.addEventListener("resize",t),()=>{window.removeEventListener("resize",t),w.current&&clearTimeout(w.current)}},[O]),(0,a.useEffect)(()=>{let t=x.current;if(!t)return;let e=!1,a=()=>{let a=window.scrollY,r=.8*m.current.vh,o=l.diveRef.current,i=o>0?`scale(${(1+1.7*o).toFixed(4)})`:"";t.style.transform=T.current?i:`translateY(${-Math.min(r,.12*a)}px) ${i}`,!T.current&&Math.abs(a-b.current)>2&&(b.current=a,k(a)),e=!1},r=()=>{e||(e=!0,requestAnimationFrame(a))};return window.addEventListener("scroll",r,{passive:!0}),()=>window.removeEventListener("scroll",r)},[k]),(0,a.useEffect)(()=>()=>{C.current&&cancelAnimationFrame(C.current),C.current=0,E(),M.current?.dispose(),M.current=null},[E]),(0,e.jsxs)("div",{ref:x,className:"fixed left-0 right-0 pointer-events-none will-change-transform",style:{zIndex:1},"aria-hidden":"true",children:[(0,e.jsx)("canvas",{ref:y,className:"absolute top-0 left-0",style:{filter:"blur(20px)",opacity:.7}}),(0,e.jsx)("canvas",{ref:t,className:"absolute top-0 left-0"}),(0,e.jsx)("canvas",{ref:v,className:"absolute top-0 left-0"})]})});t.s(["default",0,K],55856)},22661,t=>{t.n(t.i(55856))}]);