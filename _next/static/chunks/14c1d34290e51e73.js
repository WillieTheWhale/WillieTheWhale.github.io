(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,18998,e=>{"use strict";var t=e.i(43476),i=e.i(71645),a=e.i(8560),o=e.i(90072),r=e.i(4421),n=e.i(51332),l=e.i(94409),u=e.i(8598),s=e.i(11289);let m=`
  uniform float uTime;
  uniform float uHover;
  uniform vec2  uHoverPos;
  uniform float uDriftAmpX;
  uniform float uDriftAmpY;
  uniform float uDriftFx;
  uniform float uDriftFy;
  uniform float uPhase;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    if (uHover > 0.001) {
      float d = distance(uv, uHoverPos);
      float wave = sin(d * 28.0 - uTime * 7.0) * exp(-d * 4.5);
      p.z += wave * 18.0 * uHover;
      p.x += wave * 6.0 * uHover;
    }
    p.x += sin(uTime * uDriftFx * 6.2831 + uPhase) * uDriftAmpX;
    p.y += sin(uTime * uDriftFy * 6.2831 + uPhase * 1.7) * uDriftAmpY;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`,d=`
  precision highp float;
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uTime;
  uniform float uPhase;
  uniform float uBreatheAmp;
  uniform float uBreatheF;
  uniform float uSkew;
  uniform float uVel;
  uniform vec2 uSize;
  varying vec2 vUv;

  void main() {
    float xShift = uSkew * (vUv.y - 0.5);
    float xm = vUv.x + xShift;
    if (xm < 0.0 || xm > 1.0) discard;

    float split = clamp(uVel * 0.0016, -0.012, 0.012);
    vec2 uv = vec2(xm, vUv.y);
    float r = texture2D(uMap, uv + vec2(0.0, split)).r;
    float g = texture2D(uMap, uv).g;
    float b = texture2D(uMap, uv - vec2(0.0, split)).b;

    // Screen-print halftone: a fine dot grid in pixel space, lightening
    // between the dots so the photograph reads as printed, not pasted.
    vec2 cell = fract(uv * uSize / 3.2) - 0.5;
    float dot = 1.0 - smoothstep(0.24, 0.46, length(cell));
    float screen = mix(0.80, 1.0, dot);

    float breathe = 1.0 + uBreatheAmp * sin(uTime * uBreatheF * 6.2831 + uPhase);
    gl_FragColor = vec4(r, g, b, uOpacity * breathe * screen);
  }
`,v=(0,i.memo)(function(){let e=(0,i.useRef)(null),v=(0,r.useStore)(e=>e.deviceTier);return(0,i.useEffect)(()=>{let t=e.current;if(!t)return;let i=window.innerWidth,r=window.innerHeight,f=new a.WebGLRenderer({alpha:!0,antialias:!1});f.setPixelRatio(Math.min(window.devicePixelRatio,2)),f.setSize(i,r),f.domElement.style.width="100%",f.domElement.style.height="100%",t.appendChild(f.domElement);let h=new o.OrthographicCamera(0,i,0,r,-1e3,1e3),c=new o.Scene,p=(0,n.generateFragments)(v),w=new o.TextureLoader,x=new Map,y=[],g=e=>0x9e3779b1*e%1e3/1e3;p.forEach((e,a)=>{let l=e.x/100*i,u=e.y/100*r;if(!x.has(e.srcIndex)){let t=w.load(n.SKY_PHOTOS[e.srcIndex]);t.colorSpace=o.SRGBColorSpace,x.set(e.srcIndex,t)}let s=new o.PlaneGeometry(e.width,e.height,14,10),v=new o.ShaderMaterial({vertexShader:m,fragmentShader:d,transparent:!0,depthWrite:!1,side:o.DoubleSide,uniforms:{uMap:{value:x.get(e.srcIndex)},uOpacity:{value:e.opacity},uTime:{value:0},uHover:{value:0},uHoverPos:{value:new o.Vector2(.5,.5)},uDriftAmpX:{value:14+30*g(a)},uDriftAmpY:{value:6+18*g(a+7)},uDriftFx:{value:.015+.04*g(a+13)},uDriftFy:{value:.012+.035*g(a+29)},uPhase:{value:g(a+3)*Math.PI*2},uBreatheAmp:{value:.08+.12*g(a+17)},uBreatheF:{value:.01+.02*g(a+23)},uSkew:{value:e.skew},uVel:{value:0},uSize:{value:new o.Vector2(e.width,e.height)}}}),f=new o.Mesh(s,v);f.position.set(l+e.width/2,u+e.height/2,-(.1*a)),f.scale.y=-1,c.add(f);let h=null;e.caption&&((h=document.createElement("span")).className="sky-caption",h.textContent=e.caption,h.style.left=`${l}px`,t.appendChild(h)),y.push({mesh:f,mat:v,baseX:l+e.width/2,baseY:u+e.height/2,pf:e.parallaxFactor,hover:0,w:e.width,h:e.height,caption:h,atVH:e.atVH,opacity:e.opacity})});let S={x:-9999,y:-9999},b=e=>{S.x=e.clientX,S.y=e.clientY};window.addEventListener("pointermove",b,{passive:!0});let F=0,M=0,P=-1,D=new o.Clock,H=(0,u.bindLayerOpacity)("fragments",t),A=()=>{let e=D.getElapsedTime(),i=window.scrollY;F+=(l.scrollVelocityRef.current-F)*.12;let a=l.diveRef.current;a!==P&&(P=a,t.style.transform=a>0?`scale(${(1+1.35*a).toFixed(4)})`:"");let o=i/Math.max(1,window.innerHeight);for(let t of y){let a=t.baseY-i*t.pf;t.mesh.position.y=a;let r=(0,s.windowVis)(o,t.atVH);t.mesh.visible=r>.001,t.mat.uniforms.uOpacity.value=t.opacity*r,t.caption&&(t.caption.style.transform=`translateY(${(a+t.h/2+4).toFixed(1)}px)`,t.caption.style.opacity=r.toFixed(2));let n=S.x-t.mesh.position.x,l=S.y-a,u=Math.hypot(n,l)<.75*Math.max(t.w,t.h);t.hover+=(!!u-t.hover)*(u?.14:.06),t.mat.uniforms.uHover.value=t.hover,u&&t.mat.uniforms.uHoverPos.value.set(Math.min(1,Math.max(0,n/t.w+.5)),Math.min(1,Math.max(0,.5-l/t.h))),t.mat.uniforms.uTime.value=e,t.mat.uniforms.uVel.value=F}f.render(c,h),M=requestAnimationFrame(A)};M=requestAnimationFrame(A);let T=()=>{document.hidden?cancelAnimationFrame(M):M=requestAnimationFrame(A)};document.addEventListener("visibilitychange",T);let E=()=>{let e=window.innerWidth,t=window.innerHeight;f.setSize(e,t),h.right=e,h.bottom=t,h.updateProjectionMatrix()};return window.addEventListener("resize",E),()=>{for(let e of(H(),cancelAnimationFrame(M),document.removeEventListener("visibilitychange",T),window.removeEventListener("pointermove",b),window.removeEventListener("resize",E),y))e.mesh.geometry.dispose(),e.mat.dispose(),e.caption?.remove();x.forEach(e=>e.dispose()),f.dispose(),t.removeChild(f.domElement)}},[v]),(0,t.jsx)("div",{ref:e,className:"fixed inset-0 pointer-events-none overflow-hidden",style:{zIndex:2,transformOrigin:"66% 31%"},"aria-hidden":"true"})});e.s(["default",0,v])},80412,e=>{e.n(e.i(18998))}]);