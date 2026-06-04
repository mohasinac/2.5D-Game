var Th=Object.defineProperty;var Ah=(s,t,e)=>t in s?Th(s,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):s[t]=e;var Z=(s,t,e)=>Ah(s,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const r of i)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const r={};return i.integrity&&(r.integrity=i.integrity),i.referrerPolicy&&(r.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?r.credentials="include":i.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(i){if(i.ep)return;i.ep=!0;const r=e(i);fetch(i.href,r)}})();class wh{constructor(t,e){Z(this,"el");this.el=document.createElement("div"),this.el.className="screen landing-screen",this.el.innerHTML=`
      <div class="landing-bg"></div>
      <div class="landing-content">
        <div class="landing-title">
          <span class="title-main">BEYBLADE</span>
          <span class="title-sub">GAME ENGINE</span>
        </div>
        <div class="landing-buttons">
          <button class="game-btn" id="btn-beyblade">
            <span class="btn-icon">◈</span>
            Beyblade Sandbox
          </button>
          <button class="game-btn" id="btn-arena">
            <span class="btn-icon">◎</span>
            Arena Sandbox
          </button>
          <button class="game-btn" id="btn-back" disabled>
            <span class="btn-icon">←</span>
            Back
          </button>
        </div>
      </div>
    `,t.appendChild(this.el),this.el.querySelector("#btn-beyblade").addEventListener("click",e.onBeyblade),this.el.querySelector("#btn-arena").addEventListener("click",e.onArena)}setVisible(t){this.el.classList.toggle("hidden",!t)}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const zo="165",ln={ROTATE:0,DOLLY:1,PAN:2},yn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Rh=0,sa=1,Ch=2,ml=1,Ph=2,cn=3,Dn=0,Re=1,we=2,Pn=0,Ci=1,ra=2,oa=3,aa=4,Lh=5,qn=100,Ih=101,Dh=102,Uh=103,Nh=104,Oh=200,Fh=201,Bh=202,zh=203,Ro=204,Co=205,kh=206,Hh=207,Gh=208,Vh=209,Wh=210,Xh=211,Yh=212,Zh=213,qh=214,jh=0,Kh=1,$h=2,sr=3,Jh=4,Qh=5,tu=6,eu=7,gl=0,nu=1,iu=2,Ln=0,su=1,ru=2,ou=3,au=4,cu=5,lu=6,hu=7,_l=300,Ni=301,Oi=302,Po=303,Lo=304,xr=306,rr=1e3,Kn=1001,Io=1002,ke=1003,uu=1004,Ss=1005,Ye=1006,Or=1007,$n=1008,Un=1009,du=1010,fu=1011,or=1012,vl=1013,Fi=1014,An=1015,Sr=1016,xl=1017,Sl=1018,Bi=1020,pu=35902,mu=1021,gu=1022,Ke=1023,_u=1024,vu=1025,Pi=1026,zi=1027,xu=1028,Ml=1029,Su=1030,yl=1031,bl=1033,Fr=33776,Br=33777,zr=33778,kr=33779,ca=35840,la=35841,ha=35842,ua=35843,da=36196,fa=37492,pa=37496,ma=37808,ga=37809,_a=37810,va=37811,xa=37812,Sa=37813,Ma=37814,ya=37815,ba=37816,Ea=37817,Ta=37818,Aa=37819,wa=37820,Ra=37821,Hr=36492,Ca=36494,Pa=36495,Mu=36283,La=36284,Ia=36285,Da=36286,yu=3200,bu=3201,El=0,Eu=1,En="",qe="srgb",On="srgb-linear",ko="display-p3",Mr="display-p3-linear",ar="linear",te="srgb",cr="rec709",lr="p3",si=7680,Ua=519,Tu=512,Au=513,wu=514,Tl=515,Ru=516,Cu=517,Pu=518,Lu=519,Do=35044,Na="300 es",un=2e3,hr=2001;class ni{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;const n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;const i=this._listeners[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;const n=this._listeners[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,t);t.target=null}}}const ye=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Oa=1234567;const Li=Math.PI/180,rs=180/Math.PI;function $e(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ye[s&255]+ye[s>>8&255]+ye[s>>16&255]+ye[s>>24&255]+"-"+ye[t&255]+ye[t>>8&255]+"-"+ye[t>>16&15|64]+ye[t>>24&255]+"-"+ye[e&63|128]+ye[e>>8&255]+"-"+ye[e>>16&255]+ye[e>>24&255]+ye[n&255]+ye[n>>8&255]+ye[n>>16&255]+ye[n>>24&255]).toLowerCase()}function xe(s,t,e){return Math.max(t,Math.min(e,s))}function Ho(s,t){return(s%t+t)%t}function Iu(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Du(s,t,e){return s!==t?(e-s)/(t-s):0}function ts(s,t,e){return(1-e)*s+e*t}function Uu(s,t,e,n){return ts(s,t,1-Math.exp(-e*n))}function Nu(s,t=1){return t-Math.abs(Ho(s,t*2)-t)}function Ou(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Fu(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Bu(s,t){return s+Math.floor(Math.random()*(t-s+1))}function zu(s,t){return s+Math.random()*(t-s)}function ku(s){return s*(.5-Math.random())}function Hu(s){s!==void 0&&(Oa=s);let t=Oa+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Gu(s){return s*Li}function Vu(s){return s*rs}function Wu(s){return(s&s-1)===0&&s!==0}function Xu(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Yu(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Zu(s,t,e,n,i){const r=Math.cos,o=Math.sin,a=r(e/2),c=o(e/2),l=r((t+n)/2),h=o((t+n)/2),u=r((t-n)/2),d=o((t-n)/2),p=r((n-t)/2),g=o((n-t)/2);switch(i){case"XYX":s.set(a*h,c*u,c*d,a*l);break;case"YZY":s.set(c*d,a*h,c*u,a*l);break;case"ZXZ":s.set(c*u,c*d,a*h,a*l);break;case"XZX":s.set(a*h,c*g,c*p,a*l);break;case"YXY":s.set(c*p,a*h,c*g,a*l);break;case"ZYZ":s.set(c*g,c*p,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Ze(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function Kt(s,t){switch(t.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}const In={DEG2RAD:Li,RAD2DEG:rs,generateUUID:$e,clamp:xe,euclideanModulo:Ho,mapLinear:Iu,inverseLerp:Du,lerp:ts,damp:Uu,pingpong:Nu,smoothstep:Ou,smootherstep:Fu,randInt:Bu,randFloat:zu,randFloatSpread:ku,seededRandom:Hu,degToRad:Gu,radToDeg:Vu,isPowerOfTwo:Wu,ceilPowerOfTwo:Xu,floorPowerOfTwo:Yu,setQuaternionFromProperEuler:Zu,normalize:Kt,denormalize:Ze};class Q{constructor(t=0,e=0){Q.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,o=this.y-t.y;return this.x=r*n-o*i+t.x,this.y=r*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ut{constructor(t,e,n,i,r,o,a,c,l){Ut.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l)}set(t,e,n,i,r,o,a,c,l){const h=this.elements;return h[0]=t,h[1]=i,h[2]=a,h[3]=e,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],u=n[7],d=n[2],p=n[5],g=n[8],_=i[0],f=i[3],m=i[6],x=i[1],v=i[4],M=i[7],R=i[2],w=i[5],A=i[8];return r[0]=o*_+a*x+c*R,r[3]=o*f+a*v+c*w,r[6]=o*m+a*M+c*A,r[1]=l*_+h*x+u*R,r[4]=l*f+h*v+u*w,r[7]=l*m+h*M+u*A,r[2]=d*_+p*x+g*R,r[5]=d*f+p*v+g*w,r[8]=d*m+p*M+g*A,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8];return e*o*h-e*a*l-n*r*h+n*a*c+i*r*l-i*o*c}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=h*o-a*l,d=a*c-h*r,p=l*r-o*c,g=e*u+n*d+i*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=u*_,t[1]=(i*l-h*n)*_,t[2]=(a*n-i*o)*_,t[3]=d*_,t[4]=(h*e-i*c)*_,t[5]=(i*r-a*e)*_,t[6]=p*_,t[7]=(n*c-l*e)*_,t[8]=(o*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+t,-i*l,i*c,-i*(-l*o+c*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(Gr.makeScale(t,e)),this}rotate(t){return this.premultiply(Gr.makeRotation(-t)),this}translate(t,e){return this.premultiply(Gr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}}const Gr=new Ut;function Al(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function os(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function qu(){const s=os("canvas");return s.style.display="block",s}const Fa={};function Go(s){s in Fa||(Fa[s]=!0,console.warn(s))}function ju(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Ba=new Ut().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),za=new Ut().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Ms={[On]:{transfer:ar,primaries:cr,toReference:s=>s,fromReference:s=>s},[qe]:{transfer:te,primaries:cr,toReference:s=>s.convertSRGBToLinear(),fromReference:s=>s.convertLinearToSRGB()},[Mr]:{transfer:ar,primaries:lr,toReference:s=>s.applyMatrix3(za),fromReference:s=>s.applyMatrix3(Ba)},[ko]:{transfer:te,primaries:lr,toReference:s=>s.convertSRGBToLinear().applyMatrix3(za),fromReference:s=>s.applyMatrix3(Ba).convertLinearToSRGB()}},Ku=new Set([On,Mr]),$t={enabled:!0,_workingColorSpace:On,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(s){if(!Ku.has(s))throw new Error(`Unsupported working color space, "${s}".`);this._workingColorSpace=s},convert:function(s,t,e){if(this.enabled===!1||t===e||!t||!e)return s;const n=Ms[t].toReference,i=Ms[e].fromReference;return i(n(s))},fromWorkingColorSpace:function(s,t){return this.convert(s,this._workingColorSpace,t)},toWorkingColorSpace:function(s,t){return this.convert(s,t,this._workingColorSpace)},getPrimaries:function(s){return Ms[s].primaries},getTransfer:function(s){return s===En?ar:Ms[s].transfer}};function Ii(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Vr(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let ri;class $u{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ri===void 0&&(ri=os("canvas")),ri.width=t.width,ri.height=t.height;const n=ri.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ri}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=os("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=Ii(r[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ii(e[n]/255)*255):e[n]=Ii(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Ju=0;class wl{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ju++}),this.uuid=$e(),this.data=t,this.dataReady=!0,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?r.push(Wr(i[o].image)):r.push(Wr(i[o]))}else r=Wr(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function Wr(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?$u.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Qu=0;class Me extends ni{constructor(t=Me.DEFAULT_IMAGE,e=Me.DEFAULT_MAPPING,n=Kn,i=Kn,r=Ye,o=$n,a=Ke,c=Un,l=Me.DEFAULT_ANISOTROPY,h=En){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Qu++}),this.uuid=$e(),this.name="",this.source=new wl(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new Q(0,0),this.repeat=new Q(1,1),this.center=new Q(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ut,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==_l)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case rr:t.x=t.x-Math.floor(t.x);break;case Kn:t.x=t.x<0?0:1;break;case Io:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case rr:t.y=t.y-Math.floor(t.y);break;case Kn:t.y=t.y<0?0:1;break;case Io:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Me.DEFAULT_IMAGE=null;Me.DEFAULT_MAPPING=_l;Me.DEFAULT_ANISOTROPY=1;class ne{constructor(t=0,e=0,n=0,i=1){ne.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const c=t.elements,l=c[0],h=c[4],u=c[8],d=c[1],p=c[5],g=c[9],_=c[2],f=c[6],m=c[10];if(Math.abs(h-d)<.01&&Math.abs(u-_)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+_)<.1&&Math.abs(g+f)<.1&&Math.abs(l+p+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const v=(l+1)/2,M=(p+1)/2,R=(m+1)/2,w=(h+d)/4,A=(u+_)/4,I=(g+f)/4;return v>M&&v>R?v<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(v),i=w/n,r=A/n):M>R?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=w/i,r=I/i):R<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(R),n=A/r,i=I/r),this.set(n,i,r,e),this}let x=Math.sqrt((f-g)*(f-g)+(u-_)*(u-_)+(d-h)*(d-h));return Math.abs(x)<.001&&(x=1),this.x=(f-g)/x,this.y=(u-_)/x,this.z=(d-h)/x,this.w=Math.acos((l+p+m-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class td extends ni{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new ne(0,0,t,e),this.scissorTest=!1,this.viewport=new ne(0,0,t,e);const i={width:t,height:e,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ye,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new Me(i,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n;this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let n=0,i=t.textures.length;n<i;n++)this.textures[n]=t.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const e=Object.assign({},t.texture.image);return this.texture.source=new wl(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Qn extends td{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Rl extends Me{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ke,this.minFilter=ke,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class ed extends Me{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=ke,this.minFilter=ke,this.wrapR=Kn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class ti{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,o,a){let c=n[i+0],l=n[i+1],h=n[i+2],u=n[i+3];const d=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){t[e+0]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u;return}if(a===1){t[e+0]=d,t[e+1]=p,t[e+2]=g,t[e+3]=_;return}if(u!==_||c!==d||l!==p||h!==g){let f=1-a;const m=c*d+l*p+h*g+u*_,x=m>=0?1:-1,v=1-m*m;if(v>Number.EPSILON){const R=Math.sqrt(v),w=Math.atan2(R,m*x);f=Math.sin(f*w)/R,a=Math.sin(a*w)/R}const M=a*x;if(c=c*f+d*M,l=l*f+p*M,h=h*f+g*M,u=u*f+_*M,f===1-a){const R=1/Math.sqrt(c*c+l*l+h*h+u*u);c*=R,l*=R,h*=R,u*=R}}t[e]=c,t[e+1]=l,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,r,o){const a=n[i],c=n[i+1],l=n[i+2],h=n[i+3],u=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return t[e]=a*g+h*u+c*p-l*d,t[e+1]=c*g+h*d+l*u-a*p,t[e+2]=l*g+h*p+a*d-c*u,t[e+3]=h*g-a*u-c*d-l*p,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,o=t._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(i/2),u=a(r/2),d=c(n/2),p=c(i/2),g=c(r/2);switch(o){case"XYZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"YXZ":this._x=d*h*u+l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"ZXY":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u-d*p*g;break;case"ZYX":this._x=d*h*u-l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u+d*p*g;break;case"YZX":this._x=d*h*u+l*p*g,this._y=l*p*u+d*h*g,this._z=l*h*g-d*p*u,this._w=l*h*u-d*p*g;break;case"XZY":this._x=d*h*u-l*p*g,this._y=l*p*u-d*h*g,this._z=l*h*g+d*p*u,this._w=l*h*u+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],o=e[1],a=e[5],c=e[9],l=e[2],h=e[6],u=e[10],d=n+a+u;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(h-c)*p,this._y=(r-l)*p,this._z=(o-i)*p}else if(n>a&&n>u){const p=2*Math.sqrt(1+n-a-u);this._w=(h-c)/p,this._x=.25*p,this._y=(i+o)/p,this._z=(r+l)/p}else if(a>u){const p=2*Math.sqrt(1+a-n-u);this._w=(r-l)/p,this._x=(i+o)/p,this._y=.25*p,this._z=(c+h)/p}else{const p=2*Math.sqrt(1+u-n-a);this._w=(o-i)/p,this._x=(r+l)/p,this._y=(c+h)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(xe(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,o=t._w,a=e._x,c=e._y,l=e._z,h=e._w;return this._x=n*h+o*a+i*l-r*c,this._y=i*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-i*a,this._w=o*h-n*a-i*c-r*l,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);const n=this._x,i=this._y,r=this._z,o=this._w;let a=o*t._w+n*t._x+i*t._y+r*t._z;if(a<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,a=-a):this.copy(t),a>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const p=1-e;return this._w=p*o+e*this._w,this._x=p*n+e*this._x,this._y=p*i+e*this._y,this._z=p*r+e*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),u=Math.sin((1-e)*h)/l,d=Math.sin(e*h)/l;return this._w=o*u+this._w*d,this._x=n*u+this._x*d,this._y=i*u+this._y*d,this._z=r*u+this._z*d,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(t=0,e=0,n=0){L.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(ka.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(ka.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,o=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,o=t.y,a=t.z,c=t.w,l=2*(o*i-a*n),h=2*(a*e-r*i),u=2*(r*n-o*e);return this.x=e+c*l+o*u-a*h,this.y=n+c*h+a*l-r*u,this.z=i+c*u+r*h-o*l,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,o=e.x,a=e.y,c=e.z;return this.x=i*c-r*a,this.y=r*o-n*c,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Xr.copy(this).projectOnVector(t),this.sub(Xr)}reflect(t){return this.sub(Xr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(xe(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Xr=new L,ka=new ti;class us{constructor(t=new L(1/0,1/0,1/0),e=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(He.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(He.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=He.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,He):He.fromBufferAttribute(r,o),He.applyMatrix4(t.matrixWorld),this.expandByPoint(He);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ys.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ys.copy(n.boundingBox)),ys.applyMatrix4(t.matrixWorld),this.union(ys)}const i=t.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,He),He.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Wi),bs.subVectors(this.max,Wi),oi.subVectors(t.a,Wi),ai.subVectors(t.b,Wi),ci.subVectors(t.c,Wi),gn.subVectors(ai,oi),_n.subVectors(ci,ai),kn.subVectors(oi,ci);let e=[0,-gn.z,gn.y,0,-_n.z,_n.y,0,-kn.z,kn.y,gn.z,0,-gn.x,_n.z,0,-_n.x,kn.z,0,-kn.x,-gn.y,gn.x,0,-_n.y,_n.x,0,-kn.y,kn.x,0];return!Yr(e,oi,ai,ci,bs)||(e=[1,0,0,0,1,0,0,0,1],!Yr(e,oi,ai,ci,bs))?!1:(Es.crossVectors(gn,_n),e=[Es.x,Es.y,Es.z],Yr(e,oi,ai,ci,bs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,He).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(He).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(en[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),en[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),en[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),en[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),en[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),en[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),en[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),en[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(en),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}}const en=[new L,new L,new L,new L,new L,new L,new L,new L],He=new L,ys=new us,oi=new L,ai=new L,ci=new L,gn=new L,_n=new L,kn=new L,Wi=new L,bs=new L,Es=new L,Hn=new L;function Yr(s,t,e,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){Hn.fromArray(s,r);const a=i.x*Math.abs(Hn.x)+i.y*Math.abs(Hn.y)+i.z*Math.abs(Hn.z),c=t.dot(Hn),l=e.dot(Hn),h=n.dot(Hn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const nd=new us,Xi=new L,Zr=new L;class yr{constructor(t=new L,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):nd.setFromPoints(t).getCenter(n);let i=0;for(let r=0,o=t.length;r<o;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Xi.subVectors(t,this.center);const e=Xi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Xi,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Zr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Xi.copy(t.center).add(Zr)),this.expandByPoint(Xi.copy(t.center).sub(Zr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}}const nn=new L,qr=new L,Ts=new L,vn=new L,jr=new L,As=new L,Kr=new L;class Vo{constructor(t=new L,e=new L(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,nn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=nn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(nn.copy(this.origin).addScaledVector(this.direction,e),nn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){qr.copy(t).add(e).multiplyScalar(.5),Ts.copy(e).sub(t).normalize(),vn.copy(this.origin).sub(qr);const r=t.distanceTo(e)*.5,o=-this.direction.dot(Ts),a=vn.dot(this.direction),c=-vn.dot(Ts),l=vn.lengthSq(),h=Math.abs(1-o*o);let u,d,p,g;if(h>0)if(u=o*c-a,d=o*a-c,g=r*h,u>=0)if(d>=-g)if(d<=g){const _=1/h;u*=_,d*=_,p=u*(u+o*d+2*a)+d*(o*u+d+2*c)+l}else d=r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;else d=-r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;else d<=-g?(u=Math.max(0,-(-o*r+a)),d=u>0?-r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+l):d<=g?(u=0,d=Math.min(Math.max(-r,-c),r),p=d*(d+2*c)+l):(u=Math.max(0,-(o*r+a)),d=u>0?r:Math.min(Math.max(-r,-c),r),p=-u*u+d*(d+2*c)+l);else d=o>0?-r:r,u=Math.max(0,-(o*d+a)),p=-u*u+d*(d+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(qr).addScaledVector(Ts,d),p}intersectSphere(t,e){nn.subVectors(t.center,this.origin);const n=nn.dot(this.direction),i=nn.dot(nn)-n*n,r=t.radius*t.radius;if(i>r)return null;const o=Math.sqrt(r-i),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,e):this.at(a,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return l>=0?(n=(t.min.x-d.x)*l,i=(t.max.x-d.x)*l):(n=(t.max.x-d.x)*l,i=(t.min.x-d.x)*l),h>=0?(r=(t.min.y-d.y)*h,o=(t.max.y-d.y)*h):(r=(t.max.y-d.y)*h,o=(t.min.y-d.y)*h),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-d.z)*u,c=(t.max.z-d.z)*u):(a=(t.max.z-d.z)*u,c=(t.min.z-d.z)*u),n>c||a>i)||((a>n||n!==n)&&(n=a),(c<i||i!==i)&&(i=c),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,nn)!==null}intersectTriangle(t,e,n,i,r){jr.subVectors(e,t),As.subVectors(n,t),Kr.crossVectors(jr,As);let o=this.direction.dot(Kr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;vn.subVectors(this.origin,t);const c=a*this.direction.dot(As.crossVectors(vn,As));if(c<0)return null;const l=a*this.direction.dot(jr.cross(vn));if(l<0||c+l>o)return null;const h=-a*vn.dot(Kr);return h<0?null:this.at(h/o,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ee{constructor(t,e,n,i,r,o,a,c,l,h,u,d,p,g,_,f){ee.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,o,a,c,l,h,u,d,p,g,_,f)}set(t,e,n,i,r,o,a,c,l,h,u,d,p,g,_,f){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=i,m[1]=r,m[5]=o,m[9]=a,m[13]=c,m[2]=l,m[6]=h,m[10]=u,m[14]=d,m[3]=p,m[7]=g,m[11]=_,m[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ee().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){const e=this.elements,n=t.elements,i=1/li.setFromMatrixColumn(t,0).length(),r=1/li.setFromMatrixColumn(t,1).length(),o=1/li.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(i),l=Math.sin(i),h=Math.cos(r),u=Math.sin(r);if(t.order==="XYZ"){const d=o*h,p=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=-c*u,e[8]=l,e[1]=p+g*l,e[5]=d-_*l,e[9]=-a*c,e[2]=_-d*l,e[6]=g+p*l,e[10]=o*c}else if(t.order==="YXZ"){const d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d+_*a,e[4]=g*a-p,e[8]=o*l,e[1]=o*u,e[5]=o*h,e[9]=-a,e[2]=p*a-g,e[6]=_+d*a,e[10]=o*c}else if(t.order==="ZXY"){const d=c*h,p=c*u,g=l*h,_=l*u;e[0]=d-_*a,e[4]=-o*u,e[8]=g+p*a,e[1]=p+g*a,e[5]=o*h,e[9]=_-d*a,e[2]=-o*l,e[6]=a,e[10]=o*c}else if(t.order==="ZYX"){const d=o*h,p=o*u,g=a*h,_=a*u;e[0]=c*h,e[4]=g*l-p,e[8]=d*l+_,e[1]=c*u,e[5]=_*l+d,e[9]=p*l-g,e[2]=-l,e[6]=a*c,e[10]=o*c}else if(t.order==="YZX"){const d=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=_-d*u,e[8]=g*u+p,e[1]=u,e[5]=o*h,e[9]=-a*h,e[2]=-l*h,e[6]=p*u+g,e[10]=d-_*u}else if(t.order==="XZY"){const d=o*c,p=o*l,g=a*c,_=a*l;e[0]=c*h,e[4]=-u,e[8]=l*h,e[1]=d*u+_,e[5]=o*h,e[9]=p*u-g,e[2]=g*u-p,e[6]=a*h,e[10]=_*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(id,t,sd)}lookAt(t,e,n){const i=this.elements;return De.subVectors(t,e),De.lengthSq()===0&&(De.z=1),De.normalize(),xn.crossVectors(n,De),xn.lengthSq()===0&&(Math.abs(n.z)===1?De.x+=1e-4:De.z+=1e-4,De.normalize(),xn.crossVectors(n,De)),xn.normalize(),ws.crossVectors(De,xn),i[0]=xn.x,i[4]=ws.x,i[8]=De.x,i[1]=xn.y,i[5]=ws.y,i[9]=De.y,i[2]=xn.z,i[6]=ws.z,i[10]=De.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],u=n[5],d=n[9],p=n[13],g=n[2],_=n[6],f=n[10],m=n[14],x=n[3],v=n[7],M=n[11],R=n[15],w=i[0],A=i[4],I=i[8],E=i[12],y=i[1],P=i[5],B=i[9],O=i[13],Y=i[2],q=i[6],G=i[10],K=i[14],X=i[3],ut=i[7],dt=i[11],mt=i[15];return r[0]=o*w+a*y+c*Y+l*X,r[4]=o*A+a*P+c*q+l*ut,r[8]=o*I+a*B+c*G+l*dt,r[12]=o*E+a*O+c*K+l*mt,r[1]=h*w+u*y+d*Y+p*X,r[5]=h*A+u*P+d*q+p*ut,r[9]=h*I+u*B+d*G+p*dt,r[13]=h*E+u*O+d*K+p*mt,r[2]=g*w+_*y+f*Y+m*X,r[6]=g*A+_*P+f*q+m*ut,r[10]=g*I+_*B+f*G+m*dt,r[14]=g*E+_*O+f*K+m*mt,r[3]=x*w+v*y+M*Y+R*X,r[7]=x*A+v*P+M*q+R*ut,r[11]=x*I+v*B+M*G+R*dt,r[15]=x*E+v*O+M*K+R*mt,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],o=t[1],a=t[5],c=t[9],l=t[13],h=t[2],u=t[6],d=t[10],p=t[14],g=t[3],_=t[7],f=t[11],m=t[15];return g*(+r*c*u-i*l*u-r*a*d+n*l*d+i*a*p-n*c*p)+_*(+e*c*p-e*l*d+r*o*d-i*o*p+i*l*h-r*c*h)+f*(+e*l*u-e*a*p-r*o*u+n*o*p+r*a*h-n*l*h)+m*(-i*a*h-e*c*u+e*a*d+i*o*u-n*o*d+n*c*h)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],o=t[4],a=t[5],c=t[6],l=t[7],h=t[8],u=t[9],d=t[10],p=t[11],g=t[12],_=t[13],f=t[14],m=t[15],x=u*f*l-_*d*l+_*c*p-a*f*p-u*c*m+a*d*m,v=g*d*l-h*f*l-g*c*p+o*f*p+h*c*m-o*d*m,M=h*_*l-g*u*l+g*a*p-o*_*p-h*a*m+o*u*m,R=g*u*c-h*_*c-g*a*d+o*_*d+h*a*f-o*u*f,w=e*x+n*v+i*M+r*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return t[0]=x*A,t[1]=(_*d*r-u*f*r-_*i*p+n*f*p+u*i*m-n*d*m)*A,t[2]=(a*f*r-_*c*r+_*i*l-n*f*l-a*i*m+n*c*m)*A,t[3]=(u*c*r-a*d*r-u*i*l+n*d*l+a*i*p-n*c*p)*A,t[4]=v*A,t[5]=(h*f*r-g*d*r+g*i*p-e*f*p-h*i*m+e*d*m)*A,t[6]=(g*c*r-o*f*r-g*i*l+e*f*l+o*i*m-e*c*m)*A,t[7]=(o*d*r-h*c*r+h*i*l-e*d*l-o*i*p+e*c*p)*A,t[8]=M*A,t[9]=(g*u*r-h*_*r-g*n*p+e*_*p+h*n*m-e*u*m)*A,t[10]=(o*_*r-g*a*r+g*n*l-e*_*l-o*n*m+e*a*m)*A,t[11]=(h*a*r-o*u*r-h*n*l+e*u*l+o*n*p-e*a*p)*A,t[12]=R*A,t[13]=(h*_*i-g*u*i+g*n*d-e*_*d-h*n*f+e*u*f)*A,t[14]=(g*a*i-o*_*i-g*n*c+e*_*c+o*n*f-e*a*f)*A,t[15]=(o*u*i-h*a*i+h*n*c-e*u*c-o*n*d+e*a*d)*A,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,o=t.x,a=t.y,c=t.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-i*c,l*c+i*a,0,l*a+i*c,h*a+n,h*c-i*o,0,l*c-i*a,h*c+i*o,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,o){return this.set(1,n,r,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,o=e._y,a=e._z,c=e._w,l=r+r,h=o+o,u=a+a,d=r*l,p=r*h,g=r*u,_=o*h,f=o*u,m=a*u,x=c*l,v=c*h,M=c*u,R=n.x,w=n.y,A=n.z;return i[0]=(1-(_+m))*R,i[1]=(p+M)*R,i[2]=(g-v)*R,i[3]=0,i[4]=(p-M)*w,i[5]=(1-(d+m))*w,i[6]=(f+x)*w,i[7]=0,i[8]=(g+v)*A,i[9]=(f-x)*A,i[10]=(1-(d+_))*A,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;let r=li.set(i[0],i[1],i[2]).length();const o=li.set(i[4],i[5],i[6]).length(),a=li.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),t.x=i[12],t.y=i[13],t.z=i[14],Ge.copy(this);const l=1/r,h=1/o,u=1/a;return Ge.elements[0]*=l,Ge.elements[1]*=l,Ge.elements[2]*=l,Ge.elements[4]*=h,Ge.elements[5]*=h,Ge.elements[6]*=h,Ge.elements[8]*=u,Ge.elements[9]*=u,Ge.elements[10]*=u,e.setFromRotationMatrix(Ge),n.x=r,n.y=o,n.z=a,this}makePerspective(t,e,n,i,r,o,a=un){const c=this.elements,l=2*r/(e-t),h=2*r/(n-i),u=(e+t)/(e-t),d=(n+i)/(n-i);let p,g;if(a===un)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===hr)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=p,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,o,a=un){const c=this.elements,l=1/(e-t),h=1/(n-i),u=1/(o-r),d=(e+t)*l,p=(n+i)*h;let g,_;if(a===un)g=(o+r)*u,_=-2*u;else if(a===hr)g=r*u,_=-1*u;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-d,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-p,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}}const li=new L,Ge=new ee,id=new L(0,0,0),sd=new L(1,1,1),xn=new L,ws=new L,De=new L,Ha=new ee,Ga=new ti;class Je{constructor(t=0,e=0,n=0,i=Je.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],o=i[4],a=i[8],c=i[1],l=i[5],h=i[9],u=i[2],d=i[6],p=i[10];switch(e){case"XYZ":this._y=Math.asin(xe(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,l),this._z=0);break;case"YXZ":this._x=Math.asin(-xe(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-u,r),this._z=0);break;case"ZXY":this._x=Math.asin(xe(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,p),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-xe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(xe(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-u,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-xe(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Ha.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Ha,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Ga.setFromEuler(this),this.setFromQuaternion(Ga,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Je.DEFAULT_ORDER="XYZ";class Cl{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let rd=0;const Va=new L,hi=new ti,sn=new ee,Rs=new L,Yi=new L,od=new L,ad=new ti,Wa=new L(1,0,0),Xa=new L(0,1,0),Ya=new L(0,0,1),Za={type:"added"},cd={type:"removed"},ui={type:"childadded",child:null},$r={type:"childremoved",child:null};class Se extends ni{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=$e(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Se.DEFAULT_UP.clone();const t=new L,e=new Je,n=new ti,i=new L(1,1,1);function r(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ee},normalMatrix:{value:new Ut}}),this.matrix=new ee,this.matrixWorld=new ee,this.matrixAutoUpdate=Se.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Cl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return hi.setFromAxisAngle(t,e),this.quaternion.multiply(hi),this}rotateOnWorldAxis(t,e){return hi.setFromAxisAngle(t,e),this.quaternion.premultiply(hi),this}rotateX(t){return this.rotateOnAxis(Wa,t)}rotateY(t){return this.rotateOnAxis(Xa,t)}rotateZ(t){return this.rotateOnAxis(Ya,t)}translateOnAxis(t,e){return Va.copy(t).applyQuaternion(this.quaternion),this.position.add(Va.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Wa,t)}translateY(t){return this.translateOnAxis(Xa,t)}translateZ(t){return this.translateOnAxis(Ya,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(sn.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Rs.copy(t):Rs.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Yi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?sn.lookAt(Yi,Rs,this.up):sn.lookAt(Rs,Yi,this.up),this.quaternion.setFromRotationMatrix(sn),i&&(sn.extractRotation(i.matrixWorld),hi.setFromRotationMatrix(sn),this.quaternion.premultiply(hi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Za),ui.child=t,this.dispatchEvent(ui),ui.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(cd),$r.child=t,this.dispatchEvent($r),$r.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),sn.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),sn.multiply(t.parent.matrixWorld)),t.applyMatrix4(sn),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Za),ui.child=t,this.dispatchEvent(ui),ui.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,o=i.length;r<o;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,t,od),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Yi,ad,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++){const r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){const i=this.children;for(let r=0,o=i.length;r<o;r++){const a=i[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.visibility=this._visibility,i.active=this._active,i.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),i.maxGeometryCount=this._maxGeometryCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.geometryCount=this._geometryCount,i.matricesTexture=this._matricesTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere={center:i.boundingSphere.center.toArray(),radius:i.boundingSphere.radius}),this.boundingBox!==null&&(i.boundingBox={min:i.boundingBox.min.toArray(),max:i.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const u=c[l];r(t.shapes,u)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(t.materials,this.material[c]));i.material=a}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];i.animations.push(r(t.animations,c))}}if(e){const a=o(t.geometries),c=o(t.materials),l=o(t.textures),h=o(t.images),u=o(t.shapes),d=o(t.skeletons),p=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Se.DEFAULT_UP=new L(0,1,0);Se.DEFAULT_MATRIX_AUTO_UPDATE=!0;Se.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Ve=new L,rn=new L,Jr=new L,on=new L,di=new L,fi=new L,qa=new L,Qr=new L,to=new L,eo=new L;class Be{constructor(t=new L,e=new L,n=new L){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Ve.subVectors(t,e),i.cross(Ve);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Ve.subVectors(i,e),rn.subVectors(n,e),Jr.subVectors(t,e);const o=Ve.dot(Ve),a=Ve.dot(rn),c=Ve.dot(Jr),l=rn.dot(rn),h=rn.dot(Jr),u=o*l-a*a;if(u===0)return r.set(0,0,0),null;const d=1/u,p=(l*c-a*h)*d,g=(o*h-a*c)*d;return r.set(1-p-g,g,p)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,on)===null?!1:on.x>=0&&on.y>=0&&on.x+on.y<=1}static getInterpolation(t,e,n,i,r,o,a,c){return this.getBarycoord(t,e,n,i,on)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,on.x),c.addScaledVector(o,on.y),c.addScaledVector(a,on.z),c)}static isFrontFacing(t,e,n,i){return Ve.subVectors(n,e),rn.subVectors(t,e),Ve.cross(rn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ve.subVectors(this.c,this.b),rn.subVectors(this.a,this.b),Ve.cross(rn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Be.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Be.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return Be.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return Be.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Be.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let o,a;di.subVectors(i,n),fi.subVectors(r,n),Qr.subVectors(t,n);const c=di.dot(Qr),l=fi.dot(Qr);if(c<=0&&l<=0)return e.copy(n);to.subVectors(t,i);const h=di.dot(to),u=fi.dot(to);if(h>=0&&u<=h)return e.copy(i);const d=c*u-h*l;if(d<=0&&c>=0&&h<=0)return o=c/(c-h),e.copy(n).addScaledVector(di,o);eo.subVectors(t,r);const p=di.dot(eo),g=fi.dot(eo);if(g>=0&&p<=g)return e.copy(r);const _=p*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),e.copy(n).addScaledVector(fi,a);const f=h*g-p*u;if(f<=0&&u-h>=0&&p-g>=0)return qa.subVectors(r,i),a=(u-h)/(u-h+(p-g)),e.copy(i).addScaledVector(qa,a);const m=1/(f+_+d);return o=_*m,a=d*m,e.copy(n).addScaledVector(di,o).addScaledVector(fi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}const Pl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Sn={h:0,s:0,l:0},Cs={h:0,s:0,l:0};function no(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class bt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=qe){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,$t.toWorkingColorSpace(this,e),this}setRGB(t,e,n,i=$t.workingColorSpace){return this.r=t,this.g=e,this.b=n,$t.toWorkingColorSpace(this,i),this}setHSL(t,e,n,i=$t.workingColorSpace){if(t=Ho(t,1),e=xe(e,0,1),n=xe(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,o=2*n-r;this.r=no(o,r,t+1/3),this.g=no(o,r,t),this.b=no(o,r,t-1/3)}return $t.toWorkingColorSpace(this,i),this}setStyle(t,e=qe){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=qe){const n=Pl[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ii(t.r),this.g=Ii(t.g),this.b=Ii(t.b),this}copyLinearToSRGB(t){return this.r=Vr(t.r),this.g=Vr(t.g),this.b=Vr(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=qe){return $t.fromWorkingColorSpace(be.copy(this),t),Math.round(xe(be.r*255,0,255))*65536+Math.round(xe(be.g*255,0,255))*256+Math.round(xe(be.b*255,0,255))}getHexString(t=qe){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=$t.workingColorSpace){$t.fromWorkingColorSpace(be.copy(this),e);const n=be.r,i=be.g,r=be.b,o=Math.max(n,i,r),a=Math.min(n,i,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const u=o-a;switch(l=h<=.5?u/(o+a):u/(2-o-a),o){case n:c=(i-r)/u+(i<r?6:0);break;case i:c=(r-n)/u+2;break;case r:c=(n-i)/u+4;break}c/=6}return t.h=c,t.s=l,t.l=h,t}getRGB(t,e=$t.workingColorSpace){return $t.fromWorkingColorSpace(be.copy(this),e),t.r=be.r,t.g=be.g,t.b=be.b,t}getStyle(t=qe){$t.fromWorkingColorSpace(be.copy(this),t);const e=be.r,n=be.g,i=be.b;return t!==qe?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Sn),this.setHSL(Sn.h+t,Sn.s+e,Sn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Sn),t.getHSL(Cs);const n=ts(Sn.h,Cs.h,e),i=ts(Sn.s,Cs.s,e),r=ts(Sn.l,Cs.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const be=new bt;bt.NAMES=Pl;let ld=0;class ii extends ni{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ld++}),this.uuid=$e(),this.name="",this.type="Material",this.blending=Ci,this.side=Dn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ro,this.blendDst=Co,this.blendEquation=qn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new bt(0,0,0),this.blendAlpha=0,this.depthFunc=sr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ua,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=si,this.stencilZFail=si,this.stencilZPass=si,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ci&&(n.blending=this.blending),this.side!==Dn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ro&&(n.blendSrc=this.blendSrc),this.blendDst!==Co&&(n.blendDst=this.blendDst),this.blendEquation!==qn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==sr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ua&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==si&&(n.stencilFail=this.stencilFail),this.stencilZFail!==si&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==si&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(e){const r=i(t.textures),o=i(t.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}class Di extends ii{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new bt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Je,this.combine=gl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const de=new L,Ps=new Q;class Ce{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Do,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=An,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return Go("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ps.fromBufferAttribute(this,e),Ps.applyMatrix3(t),this.setXY(e,Ps.x,Ps.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.applyMatrix3(t),this.setXYZ(e,de.x,de.y,de.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.applyMatrix4(t),this.setXYZ(e,de.x,de.y,de.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.applyNormalMatrix(t),this.setXYZ(e,de.x,de.y,de.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)de.fromBufferAttribute(this,e),de.transformDirection(t),this.setXYZ(e,de.x,de.y,de.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ze(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Kt(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ze(e,this.array)),e}setX(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ze(e,this.array)),e}setY(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ze(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ze(e,this.array)),e}setW(t,e){return this.normalized&&(e=Kt(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),i=Kt(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),i=Kt(i,this.array),r=Kt(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Do&&(t.usage=this.usage),t}}class Ll extends Ce{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class Il extends Ce{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class zt extends Ce{constructor(t,e,n){super(new Float32Array(t),e,n)}}let hd=0;const Fe=new ee,io=new Se,pi=new L,Ue=new us,Zi=new us,_e=new L;class qt extends ni{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:hd++}),this.uuid=$e(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Al(t)?Il:Ll)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ut().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Fe.makeRotationFromQuaternion(t),this.applyMatrix4(Fe),this}rotateX(t){return Fe.makeRotationX(t),this.applyMatrix4(Fe),this}rotateY(t){return Fe.makeRotationY(t),this.applyMatrix4(Fe),this}rotateZ(t){return Fe.makeRotationZ(t),this.applyMatrix4(Fe),this}translate(t,e,n){return Fe.makeTranslation(t,e,n),this.applyMatrix4(Fe),this}scale(t,e,n){return Fe.makeScale(t,e,n),this.applyMatrix4(Fe),this}lookAt(t){return io.lookAt(t),io.updateMatrix(),this.applyMatrix4(io.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(pi).negate(),this.translate(pi.x,pi.y,pi.z),this}setFromPoints(t){const e=[];for(let n=0,i=t.length;n<i;n++){const r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new zt(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new us);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];Ue.setFromBufferAttribute(r),this.morphTargetsRelative?(_e.addVectors(this.boundingBox.min,Ue.min),this.boundingBox.expandByPoint(_e),_e.addVectors(this.boundingBox.max,Ue.max),this.boundingBox.expandByPoint(_e)):(this.boundingBox.expandByPoint(Ue.min),this.boundingBox.expandByPoint(Ue.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new yr);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(t){const n=this.boundingSphere.center;if(Ue.setFromBufferAttribute(t),e)for(let r=0,o=e.length;r<o;r++){const a=e[r];Zi.setFromBufferAttribute(a),this.morphTargetsRelative?(_e.addVectors(Ue.min,Zi.min),Ue.expandByPoint(_e),_e.addVectors(Ue.max,Zi.max),Ue.expandByPoint(_e)):(Ue.expandByPoint(Zi.min),Ue.expandByPoint(Zi.max))}Ue.getCenter(n);let i=0;for(let r=0,o=t.count;r<o;r++)_e.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(_e));if(e)for(let r=0,o=e.length;r<o;r++){const a=e[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)_e.fromBufferAttribute(a,l),c&&(pi.fromBufferAttribute(t,l),_e.add(pi)),i=Math.max(i,n.distanceToSquared(_e))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ce(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let I=0;I<n.count;I++)a[I]=new L,c[I]=new L;const l=new L,h=new L,u=new L,d=new Q,p=new Q,g=new Q,_=new L,f=new L;function m(I,E,y){l.fromBufferAttribute(n,I),h.fromBufferAttribute(n,E),u.fromBufferAttribute(n,y),d.fromBufferAttribute(r,I),p.fromBufferAttribute(r,E),g.fromBufferAttribute(r,y),h.sub(l),u.sub(l),p.sub(d),g.sub(d);const P=1/(p.x*g.y-g.x*p.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(u,-p.y).multiplyScalar(P),f.copy(u).multiplyScalar(p.x).addScaledVector(h,-g.x).multiplyScalar(P),a[I].add(_),a[E].add(_),a[y].add(_),c[I].add(f),c[E].add(f),c[y].add(f))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let I=0,E=x.length;I<E;++I){const y=x[I],P=y.start,B=y.count;for(let O=P,Y=P+B;O<Y;O+=3)m(t.getX(O+0),t.getX(O+1),t.getX(O+2))}const v=new L,M=new L,R=new L,w=new L;function A(I){R.fromBufferAttribute(i,I),w.copy(R);const E=a[I];v.copy(E),v.sub(R.multiplyScalar(R.dot(E))).normalize(),M.crossVectors(w,E);const P=M.dot(c[I])<0?-1:1;o.setXYZW(I,v.x,v.y,v.z,P)}for(let I=0,E=x.length;I<E;++I){const y=x[I],P=y.start,B=y.count;for(let O=P,Y=P+B;O<Y;O+=3)A(t.getX(O+0)),A(t.getX(O+1)),A(t.getX(O+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Ce(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const i=new L,r=new L,o=new L,a=new L,c=new L,l=new L,h=new L,u=new L;if(t)for(let d=0,p=t.count;d<p;d+=3){const g=t.getX(d+0),_=t.getX(d+1),f=t.getX(d+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),o.fromBufferAttribute(e,f),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,f),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(f,l.x,l.y,l.z)}else for(let d=0,p=e.count;d<p;d+=3)i.fromBufferAttribute(e,d+0),r.fromBufferAttribute(e,d+1),o.fromBufferAttribute(e,d+2),h.subVectors(o,r),u.subVectors(i,r),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)_e.fromBufferAttribute(t,e),_e.normalize(),t.setXYZ(e,_e.x,_e.y,_e.z)}toNonIndexed(){function t(a,c){const l=a.array,h=a.itemSize,u=a.normalized,d=new l.constructor(c.length*h);let p=0,g=0;for(let _=0,f=c.length;_<f;_++){a.isInterleavedBufferAttribute?p=c[_]*a.data.stride+a.offset:p=c[_]*h;for(let m=0;m<h;m++)d[g++]=l[p++]}return new Ce(d,h,u)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new qt,n=this.index.array,i=this.attributes;for(const a in i){const c=i[a],l=t(c,n);e.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,u=l.length;h<u;h++){const d=l[h],p=t(d,n);c.push(p)}e.morphAttributes[a]=c}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];e.addGroup(l.start,l.count,l.materialIndex)}return e}toJSON(){const t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(t[l]=c[l]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const c in n){const l=n[c];t.data.attributes[c]=l.toJSON(t.data)}const i={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let u=0,d=l.length;u<d;u++){const p=l[u];h.push(p.toJSON(t.data))}h.length>0&&(i[c]=h,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone(e));const i=t.attributes;for(const l in i){const h=i[l];this.setAttribute(l,h.clone(e))}const r=t.morphAttributes;for(const l in r){const h=[],u=r[l];for(let d=0,p=u.length;d<p;d++)h.push(u[d].clone(e));this.morphAttributes[l]=h}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let l=0,h=o.length;l<h;l++){const u=o[l];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ja=new ee,Gn=new Vo,Ls=new yr,Ka=new L,mi=new L,gi=new L,_i=new L,so=new L,Is=new L,Ds=new Q,Us=new Q,Ns=new Q,$a=new L,Ja=new L,Qa=new L,Os=new L,Fs=new L;class Yt extends Se{constructor(t=new qt,e=new Di){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(r&&a){Is.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],u=r[c];h!==0&&(so.fromBufferAttribute(u,t),o?Is.addScaledVector(so,h):Is.addScaledVector(so.sub(e),h))}e.add(Is)}return e}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ls.copy(n.boundingSphere),Ls.applyMatrix4(r),Gn.copy(t.ray).recast(t.near),!(Ls.containsPoint(Gn.origin)===!1&&(Gn.intersectSphere(Ls,Ka)===null||Gn.origin.distanceToSquared(Ka)>(t.far-t.near)**2))&&(ja.copy(r).invert(),Gn.copy(t.ray).applyMatrix4(ja),!(n.boundingBox!==null&&Gn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Gn)))}_computeIntersections(t,e,n){let i;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,u=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const f=d[g],m=o[f.materialIndex],x=Math.max(f.start,p.start),v=Math.min(a.count,Math.min(f.start+f.count,p.start+p.count));for(let M=x,R=v;M<R;M+=3){const w=a.getX(M),A=a.getX(M+1),I=a.getX(M+2);i=Bs(this,m,t,n,l,h,u,w,A,I),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=f.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let f=g,m=_;f<m;f+=3){const x=a.getX(f),v=a.getX(f+1),M=a.getX(f+2);i=Bs(this,o,t,n,l,h,u,x,v,M),i&&(i.faceIndex=Math.floor(f/3),e.push(i))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const f=d[g],m=o[f.materialIndex],x=Math.max(f.start,p.start),v=Math.min(c.count,Math.min(f.start+f.count,p.start+p.count));for(let M=x,R=v;M<R;M+=3){const w=M,A=M+1,I=M+2;i=Bs(this,m,t,n,l,h,u,w,A,I),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=f.materialIndex,e.push(i))}}else{const g=Math.max(0,p.start),_=Math.min(c.count,p.start+p.count);for(let f=g,m=_;f<m;f+=3){const x=f,v=f+1,M=f+2;i=Bs(this,o,t,n,l,h,u,x,v,M),i&&(i.faceIndex=Math.floor(f/3),e.push(i))}}}}function ud(s,t,e,n,i,r,o,a){let c;if(t.side===Re?c=n.intersectTriangle(o,r,i,!0,a):c=n.intersectTriangle(i,r,o,t.side===Dn,a),c===null)return null;Fs.copy(a),Fs.applyMatrix4(s.matrixWorld);const l=e.ray.origin.distanceTo(Fs);return l<e.near||l>e.far?null:{distance:l,point:Fs.clone(),object:s}}function Bs(s,t,e,n,i,r,o,a,c,l){s.getVertexPosition(a,mi),s.getVertexPosition(c,gi),s.getVertexPosition(l,_i);const h=ud(s,t,e,n,mi,gi,_i,Os);if(h){i&&(Ds.fromBufferAttribute(i,a),Us.fromBufferAttribute(i,c),Ns.fromBufferAttribute(i,l),h.uv=Be.getInterpolation(Os,mi,gi,_i,Ds,Us,Ns,new Q)),r&&(Ds.fromBufferAttribute(r,a),Us.fromBufferAttribute(r,c),Ns.fromBufferAttribute(r,l),h.uv1=Be.getInterpolation(Os,mi,gi,_i,Ds,Us,Ns,new Q)),o&&($a.fromBufferAttribute(o,a),Ja.fromBufferAttribute(o,c),Qa.fromBufferAttribute(o,l),h.normal=Be.getInterpolation(Os,mi,gi,_i,$a,Ja,Qa,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const u={a,b:c,c:l,normal:new L,materialIndex:0};Be.getNormal(mi,gi,_i,u.normal),h.face=u}return h}class ds extends qt{constructor(t=1,e=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};const a=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],u=[];let d=0,p=0;g("z","y","x",-1,-1,n,e,t,o,r,0),g("z","y","x",1,-1,n,e,-t,o,r,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(c),this.setAttribute("position",new zt(l,3)),this.setAttribute("normal",new zt(h,3)),this.setAttribute("uv",new zt(u,2));function g(_,f,m,x,v,M,R,w,A,I,E){const y=M/A,P=R/I,B=M/2,O=R/2,Y=w/2,q=A+1,G=I+1;let K=0,X=0;const ut=new L;for(let dt=0;dt<G;dt++){const mt=dt*P-O;for(let kt=0;kt<q;kt++){const Wt=kt*y-B;ut[_]=Wt*x,ut[f]=mt*v,ut[m]=Y,l.push(ut.x,ut.y,ut.z),ut[_]=0,ut[f]=0,ut[m]=w>0?1:-1,h.push(ut.x,ut.y,ut.z),u.push(kt/A),u.push(1-dt/I),K+=1}}for(let dt=0;dt<I;dt++)for(let mt=0;mt<A;mt++){const kt=d+mt+q*dt,Wt=d+mt+q*(dt+1),j=d+(mt+1)+q*(dt+1),nt=d+(mt+1)+q*dt;c.push(kt,Wt,nt),c.push(Wt,j,nt),X+=6}a.addGroup(p,X,E),p+=X,d+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ds(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}function ki(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone():Array.isArray(i)?t[e][n]=i.slice():t[e][n]=i}}return t}function Ae(s){const t={};for(let e=0;e<s.length;e++){const n=ki(s[e]);for(const i in n)t[i]=n[i]}return t}function dd(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function Dl(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:$t.workingColorSpace}const fd={clone:ki,merge:Ae};var pd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,md=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Nn extends ii{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=pd,this.fragmentShader=md,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=ki(t.uniforms),this.uniformsGroups=dd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Ul extends Se{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ee,this.projectionMatrix=new ee,this.projectionMatrixInverse=new ee,this.coordinateSystem=un}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Mn=new L,tc=new Q,ec=new Q;class Ne extends Ul{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=rs*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Li*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return rs*2*Math.atan(Math.tan(Li*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Mn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Mn.x,Mn.y).multiplyScalar(-t/Mn.z),Mn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Mn.x,Mn.y).multiplyScalar(-t/Mn.z)}getViewSize(t,e){return this.getViewBounds(t,tc,ec),e.subVectors(ec,tc)}setViewOffset(t,e,n,i,r,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Li*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*i/c,e-=o.offsetY*n/l,i*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}const vi=-90,xi=1;class gd extends Se{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Ne(vi,xi,t,e);i.layers=this.layers,this.add(i);const r=new Ne(vi,xi,t,e);r.layers=this.layers,this.add(r);const o=new Ne(vi,xi,t,e);o.layers=this.layers,this.add(o);const a=new Ne(vi,xi,t,e);a.layers=this.layers,this.add(a);const c=new Ne(vi,xi,t,e);c.layers=this.layers,this.add(c);const l=new Ne(vi,xi,t,e);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,o,a,c]=e;for(const l of e)this.remove(l);if(t===un)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===hr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const l of e)this.add(l),l.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),p=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,i),t.render(e,r),t.setRenderTarget(n,1,i),t.render(e,o),t.setRenderTarget(n,2,i),t.render(e,a),t.setRenderTarget(n,3,i),t.render(e,c),t.setRenderTarget(n,4,i),t.render(e,l),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,i),t.render(e,h),t.setRenderTarget(u,d,p),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Nl extends Me{constructor(t,e,n,i,r,o,a,c,l,h){t=t!==void 0?t:[],e=e!==void 0?e:Ni,super(t,e,n,i,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class _d extends Qn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Nl(i,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:Ye}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ds(5,5,5),r=new Nn({name:"CubemapFromEquirect",uniforms:ki(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Re,blending:Pn});r.uniforms.tEquirect.value=e;const o=new Yt(i,r),a=e.minFilter;return e.minFilter===$n&&(e.minFilter=Ye),new gd(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e,n,i){const r=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(r)}}const ro=new L,vd=new L,xd=new Ut;class bn{constructor(t=new L(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=ro.subVectors(n,e).cross(vd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){const n=t.delta(ro),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const r=-(t.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||xd.getNormalMatrix(t),i=this.coplanarPoint(ro).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Vn=new yr,zs=new L;class Wo{constructor(t=new bn,e=new bn,n=new bn,i=new bn,r=new bn,o=new bn){this.planes=[t,e,n,i,r,o]}set(t,e,n,i,r,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(r),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=un){const n=this.planes,i=t.elements,r=i[0],o=i[1],a=i[2],c=i[3],l=i[4],h=i[5],u=i[6],d=i[7],p=i[8],g=i[9],_=i[10],f=i[11],m=i[12],x=i[13],v=i[14],M=i[15];if(n[0].setComponents(c-r,d-l,f-p,M-m).normalize(),n[1].setComponents(c+r,d+l,f+p,M+m).normalize(),n[2].setComponents(c+o,d+h,f+g,M+x).normalize(),n[3].setComponents(c-o,d-h,f-g,M-x).normalize(),n[4].setComponents(c-a,d-u,f-_,M-v).normalize(),e===un)n[5].setComponents(c+a,d+u,f+_,M+v).normalize();else if(e===hr)n[5].setComponents(a,u,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Vn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Vn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Vn)}intersectsSprite(t){return Vn.center.set(0,0,0),Vn.radius=.7071067811865476,Vn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Vn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(zs.x=i.normal.x>0?t.max.x:t.min.x,zs.y=i.normal.y>0?t.max.y:t.min.y,zs.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(zs)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Ol(){let s=null,t=!1,e=null,n=null;function i(r,o){e(r,o),n=s.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function Sd(s){const t=new WeakMap;function e(a,c){const l=a.array,h=a.usage,u=l.byteLength,d=s.createBuffer();s.bindBuffer(c,d),s.bufferData(c,l,h),a.onUploadCallback();let p;if(l instanceof Float32Array)p=s.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?p=s.HALF_FLOAT:p=s.UNSIGNED_SHORT;else if(l instanceof Int16Array)p=s.SHORT;else if(l instanceof Uint32Array)p=s.UNSIGNED_INT;else if(l instanceof Int32Array)p=s.INT;else if(l instanceof Int8Array)p=s.BYTE;else if(l instanceof Uint8Array)p=s.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)p=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:d,type:p,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,c,l){const h=c.array,u=c._updateRange,d=c.updateRanges;if(s.bindBuffer(l,a),u.count===-1&&d.length===0&&s.bufferSubData(l,0,h),d.length!==0){for(let p=0,g=d.length;p<g;p++){const _=d[p];s.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}u.count!==-1&&(s.bufferSubData(l,u.offset*h.BYTES_PER_ELEMENT,h,u.offset,u.count),u.count=-1),c.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=t.get(a);c&&(s.deleteBuffer(c.buffer),t.delete(a))}function o(a,c){if(a.isGLBufferAttribute){const h=t.get(a);(!h||h.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);if(l===void 0)t.set(a,e(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:i,remove:r,update:o}}class br extends qt{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,o=e/2,a=Math.floor(n),c=Math.floor(i),l=a+1,h=c+1,u=t/a,d=e/c,p=[],g=[],_=[],f=[];for(let m=0;m<h;m++){const x=m*d-o;for(let v=0;v<l;v++){const M=v*u-r;g.push(M,-x,0),_.push(0,0,1),f.push(v/a),f.push(1-m/c)}}for(let m=0;m<c;m++)for(let x=0;x<a;x++){const v=x+l*m,M=x+l*(m+1),R=x+1+l*(m+1),w=x+1+l*m;p.push(v,M,w),p.push(M,R,w)}this.setIndex(p),this.setAttribute("position",new zt(g,3)),this.setAttribute("normal",new zt(_,3)),this.setAttribute("uv",new zt(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new br(t.width,t.height,t.widthSegments,t.heightSegments)}}var Md=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,yd=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,bd=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Ed=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Td=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Ad=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,wd=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Rd=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Cd=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Pd=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Ld=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Id=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Dd=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Ud=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Nd=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Od=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Fd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Bd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,zd=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,kd=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Gd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Vd=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( batchId );
	vColor.xyz *= batchingColor.xyz;
#endif`,Wd=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Xd=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Yd=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Zd=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,qd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,jd=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Kd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,$d="gl_FragColor = linearToOutputTexel( gl_FragColor );",Jd=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Qd=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,tf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,ef=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,nf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,sf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,rf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,of=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,af=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,cf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,lf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,hf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,uf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,df=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ff=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,pf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,mf=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,gf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,_f=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,vf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,xf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Sf=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Mf=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,yf=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,bf=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ef=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Tf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Af=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,wf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Rf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Cf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Pf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Lf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,If=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Df=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Uf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Nf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Of=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ff=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Bf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,zf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,kf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Hf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Gf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Vf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Wf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Xf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Yf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Zf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,qf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,jf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Kf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,$f=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Jf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Qf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,tp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,ep=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,np=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ip=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return shadow;
	}
#endif`,sp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,rp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,op=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,ap=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,cp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,lp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,hp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,up=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,dp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,fp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,pp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,mp=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,gp=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,_p=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,vp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,xp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Sp=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Mp=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,yp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,bp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ep=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Tp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ap=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,wp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Rp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,Cp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Pp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Lp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Ip=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Dp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Up=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Np=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Op=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Fp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bp=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,kp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Hp=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Gp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Vp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Wp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Xp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Yp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Zp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,qp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,jp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Kp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,$p=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Jp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Qp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,tm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Dt={alphahash_fragment:Md,alphahash_pars_fragment:yd,alphamap_fragment:bd,alphamap_pars_fragment:Ed,alphatest_fragment:Td,alphatest_pars_fragment:Ad,aomap_fragment:wd,aomap_pars_fragment:Rd,batching_pars_vertex:Cd,batching_vertex:Pd,begin_vertex:Ld,beginnormal_vertex:Id,bsdfs:Dd,iridescence_fragment:Ud,bumpmap_pars_fragment:Nd,clipping_planes_fragment:Od,clipping_planes_pars_fragment:Fd,clipping_planes_pars_vertex:Bd,clipping_planes_vertex:zd,color_fragment:kd,color_pars_fragment:Hd,color_pars_vertex:Gd,color_vertex:Vd,common:Wd,cube_uv_reflection_fragment:Xd,defaultnormal_vertex:Yd,displacementmap_pars_vertex:Zd,displacementmap_vertex:qd,emissivemap_fragment:jd,emissivemap_pars_fragment:Kd,colorspace_fragment:$d,colorspace_pars_fragment:Jd,envmap_fragment:Qd,envmap_common_pars_fragment:tf,envmap_pars_fragment:ef,envmap_pars_vertex:nf,envmap_physical_pars_fragment:pf,envmap_vertex:sf,fog_vertex:rf,fog_pars_vertex:of,fog_fragment:af,fog_pars_fragment:cf,gradientmap_pars_fragment:lf,lightmap_pars_fragment:hf,lights_lambert_fragment:uf,lights_lambert_pars_fragment:df,lights_pars_begin:ff,lights_toon_fragment:mf,lights_toon_pars_fragment:gf,lights_phong_fragment:_f,lights_phong_pars_fragment:vf,lights_physical_fragment:xf,lights_physical_pars_fragment:Sf,lights_fragment_begin:Mf,lights_fragment_maps:yf,lights_fragment_end:bf,logdepthbuf_fragment:Ef,logdepthbuf_pars_fragment:Tf,logdepthbuf_pars_vertex:Af,logdepthbuf_vertex:wf,map_fragment:Rf,map_pars_fragment:Cf,map_particle_fragment:Pf,map_particle_pars_fragment:Lf,metalnessmap_fragment:If,metalnessmap_pars_fragment:Df,morphinstance_vertex:Uf,morphcolor_vertex:Nf,morphnormal_vertex:Of,morphtarget_pars_vertex:Ff,morphtarget_vertex:Bf,normal_fragment_begin:zf,normal_fragment_maps:kf,normal_pars_fragment:Hf,normal_pars_vertex:Gf,normal_vertex:Vf,normalmap_pars_fragment:Wf,clearcoat_normal_fragment_begin:Xf,clearcoat_normal_fragment_maps:Yf,clearcoat_pars_fragment:Zf,iridescence_pars_fragment:qf,opaque_fragment:jf,packing:Kf,premultiplied_alpha_fragment:$f,project_vertex:Jf,dithering_fragment:Qf,dithering_pars_fragment:tp,roughnessmap_fragment:ep,roughnessmap_pars_fragment:np,shadowmap_pars_fragment:ip,shadowmap_pars_vertex:sp,shadowmap_vertex:rp,shadowmask_pars_fragment:op,skinbase_vertex:ap,skinning_pars_vertex:cp,skinning_vertex:lp,skinnormal_vertex:hp,specularmap_fragment:up,specularmap_pars_fragment:dp,tonemapping_fragment:fp,tonemapping_pars_fragment:pp,transmission_fragment:mp,transmission_pars_fragment:gp,uv_pars_fragment:_p,uv_pars_vertex:vp,uv_vertex:xp,worldpos_vertex:Sp,background_vert:Mp,background_frag:yp,backgroundCube_vert:bp,backgroundCube_frag:Ep,cube_vert:Tp,cube_frag:Ap,depth_vert:wp,depth_frag:Rp,distanceRGBA_vert:Cp,distanceRGBA_frag:Pp,equirect_vert:Lp,equirect_frag:Ip,linedashed_vert:Dp,linedashed_frag:Up,meshbasic_vert:Np,meshbasic_frag:Op,meshlambert_vert:Fp,meshlambert_frag:Bp,meshmatcap_vert:zp,meshmatcap_frag:kp,meshnormal_vert:Hp,meshnormal_frag:Gp,meshphong_vert:Vp,meshphong_frag:Wp,meshphysical_vert:Xp,meshphysical_frag:Yp,meshtoon_vert:Zp,meshtoon_frag:qp,points_vert:jp,points_frag:Kp,shadow_vert:$p,shadow_frag:Jp,sprite_vert:Qp,sprite_frag:tm},at={common:{diffuse:{value:new bt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ut}},envmap:{envMap:{value:null},envMapRotation:{value:new Ut},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ut}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ut}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ut},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ut},normalScale:{value:new Q(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ut},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ut}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ut}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ut}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new bt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new bt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0},uvTransform:{value:new Ut}},sprite:{diffuse:{value:new bt(16777215)},opacity:{value:1},center:{value:new Q(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ut},alphaMap:{value:null},alphaMapTransform:{value:new Ut},alphaTest:{value:0}}},je={basic:{uniforms:Ae([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.fog]),vertexShader:Dt.meshbasic_vert,fragmentShader:Dt.meshbasic_frag},lambert:{uniforms:Ae([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new bt(0)}}]),vertexShader:Dt.meshlambert_vert,fragmentShader:Dt.meshlambert_frag},phong:{uniforms:Ae([at.common,at.specularmap,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.fog,at.lights,{emissive:{value:new bt(0)},specular:{value:new bt(1118481)},shininess:{value:30}}]),vertexShader:Dt.meshphong_vert,fragmentShader:Dt.meshphong_frag},standard:{uniforms:Ae([at.common,at.envmap,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.roughnessmap,at.metalnessmap,at.fog,at.lights,{emissive:{value:new bt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Dt.meshphysical_vert,fragmentShader:Dt.meshphysical_frag},toon:{uniforms:Ae([at.common,at.aomap,at.lightmap,at.emissivemap,at.bumpmap,at.normalmap,at.displacementmap,at.gradientmap,at.fog,at.lights,{emissive:{value:new bt(0)}}]),vertexShader:Dt.meshtoon_vert,fragmentShader:Dt.meshtoon_frag},matcap:{uniforms:Ae([at.common,at.bumpmap,at.normalmap,at.displacementmap,at.fog,{matcap:{value:null}}]),vertexShader:Dt.meshmatcap_vert,fragmentShader:Dt.meshmatcap_frag},points:{uniforms:Ae([at.points,at.fog]),vertexShader:Dt.points_vert,fragmentShader:Dt.points_frag},dashed:{uniforms:Ae([at.common,at.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Dt.linedashed_vert,fragmentShader:Dt.linedashed_frag},depth:{uniforms:Ae([at.common,at.displacementmap]),vertexShader:Dt.depth_vert,fragmentShader:Dt.depth_frag},normal:{uniforms:Ae([at.common,at.bumpmap,at.normalmap,at.displacementmap,{opacity:{value:1}}]),vertexShader:Dt.meshnormal_vert,fragmentShader:Dt.meshnormal_frag},sprite:{uniforms:Ae([at.sprite,at.fog]),vertexShader:Dt.sprite_vert,fragmentShader:Dt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ut},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Dt.background_vert,fragmentShader:Dt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ut}},vertexShader:Dt.backgroundCube_vert,fragmentShader:Dt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Dt.cube_vert,fragmentShader:Dt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Dt.equirect_vert,fragmentShader:Dt.equirect_frag},distanceRGBA:{uniforms:Ae([at.common,at.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Dt.distanceRGBA_vert,fragmentShader:Dt.distanceRGBA_frag},shadow:{uniforms:Ae([at.lights,at.fog,{color:{value:new bt(0)},opacity:{value:1}}]),vertexShader:Dt.shadow_vert,fragmentShader:Dt.shadow_frag}};je.physical={uniforms:Ae([je.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ut},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ut},clearcoatNormalScale:{value:new Q(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ut},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ut},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ut},sheen:{value:0},sheenColor:{value:new bt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ut},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ut},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ut},transmissionSamplerSize:{value:new Q},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ut},attenuationDistance:{value:0},attenuationColor:{value:new bt(0)},specularColor:{value:new bt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ut},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ut},anisotropyVector:{value:new Q},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ut}}]),vertexShader:Dt.meshphysical_vert,fragmentShader:Dt.meshphysical_frag};const ks={r:0,b:0,g:0},Wn=new Je,em=new ee;function nm(s,t,e,n,i,r,o){const a=new bt(0);let c=r===!0?0:1,l,h,u=null,d=0,p=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?e:t).get(v)),v}function _(x){let v=!1;const M=g(x);M===null?m(a,c):M&&M.isColor&&(m(M,1),v=!0);const R=s.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function f(x,v){const M=g(v);M&&(M.isCubeTexture||M.mapping===xr)?(h===void 0&&(h=new Yt(new ds(1,1,1),new Nn({name:"BackgroundCubeMaterial",uniforms:ki(je.backgroundCube.uniforms),vertexShader:je.backgroundCube.vertexShader,fragmentShader:je.backgroundCube.fragmentShader,side:Re,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(h)),Wn.copy(v.backgroundRotation),Wn.x*=-1,Wn.y*=-1,Wn.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Wn.y*=-1,Wn.z*=-1),h.material.uniforms.envMap.value=M,h.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(em.makeRotationFromEuler(Wn)),h.material.toneMapped=$t.getTransfer(M.colorSpace)!==te,(u!==M||d!==M.version||p!==s.toneMapping)&&(h.material.needsUpdate=!0,u=M,d=M.version,p=s.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Yt(new br(2,2),new Nn({name:"BackgroundMaterial",uniforms:ki(je.background.uniforms),vertexShader:je.background.vertexShader,fragmentShader:je.background.fragmentShader,side:Dn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=$t.getTransfer(M.colorSpace)!==te,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||d!==M.version||p!==s.toneMapping)&&(l.material.needsUpdate=!0,u=M,d=M.version,p=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function m(x,v){x.getRGB(ks,Dl(s)),n.buffers.color.setClear(ks.r,ks.g,ks.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),c=v,m(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,m(a,c)},render:_,addToRenderList:f}}function im(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=d(null);let r=i,o=!1;function a(y,P,B,O,Y){let q=!1;const G=u(O,B,P);r!==G&&(r=G,l(r.object)),q=p(y,O,B,Y),q&&g(y,O,B,Y),Y!==null&&t.update(Y,s.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,M(y,P,B,O),Y!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(Y).buffer))}function c(){return s.createVertexArray()}function l(y){return s.bindVertexArray(y)}function h(y){return s.deleteVertexArray(y)}function u(y,P,B){const O=B.wireframe===!0;let Y=n[y.id];Y===void 0&&(Y={},n[y.id]=Y);let q=Y[P.id];q===void 0&&(q={},Y[P.id]=q);let G=q[O];return G===void 0&&(G=d(c()),q[O]=G),G}function d(y){const P=[],B=[],O=[];for(let Y=0;Y<e;Y++)P[Y]=0,B[Y]=0,O[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:B,attributeDivisors:O,object:y,attributes:{},index:null}}function p(y,P,B,O){const Y=r.attributes,q=P.attributes;let G=0;const K=B.getAttributes();for(const X in K)if(K[X].location>=0){const dt=Y[X];let mt=q[X];if(mt===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(mt=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(mt=y.instanceColor)),dt===void 0||dt.attribute!==mt||mt&&dt.data!==mt.data)return!0;G++}return r.attributesNum!==G||r.index!==O}function g(y,P,B,O){const Y={},q=P.attributes;let G=0;const K=B.getAttributes();for(const X in K)if(K[X].location>=0){let dt=q[X];dt===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(dt=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(dt=y.instanceColor));const mt={};mt.attribute=dt,dt&&dt.data&&(mt.data=dt.data),Y[X]=mt,G++}r.attributes=Y,r.attributesNum=G,r.index=O}function _(){const y=r.newAttributes;for(let P=0,B=y.length;P<B;P++)y[P]=0}function f(y){m(y,0)}function m(y,P){const B=r.newAttributes,O=r.enabledAttributes,Y=r.attributeDivisors;B[y]=1,O[y]===0&&(s.enableVertexAttribArray(y),O[y]=1),Y[y]!==P&&(s.vertexAttribDivisor(y,P),Y[y]=P)}function x(){const y=r.newAttributes,P=r.enabledAttributes;for(let B=0,O=P.length;B<O;B++)P[B]!==y[B]&&(s.disableVertexAttribArray(B),P[B]=0)}function v(y,P,B,O,Y,q,G){G===!0?s.vertexAttribIPointer(y,P,B,Y,q):s.vertexAttribPointer(y,P,B,O,Y,q)}function M(y,P,B,O){_();const Y=O.attributes,q=B.getAttributes(),G=P.defaultAttributeValues;for(const K in q){const X=q[K];if(X.location>=0){let ut=Y[K];if(ut===void 0&&(K==="instanceMatrix"&&y.instanceMatrix&&(ut=y.instanceMatrix),K==="instanceColor"&&y.instanceColor&&(ut=y.instanceColor)),ut!==void 0){const dt=ut.normalized,mt=ut.itemSize,kt=t.get(ut);if(kt===void 0)continue;const Wt=kt.buffer,j=kt.type,nt=kt.bytesPerElement,ft=j===s.INT||j===s.UNSIGNED_INT||ut.gpuType===vl;if(ut.isInterleavedBufferAttribute){const ct=ut.data,Nt=ct.stride,Rt=ut.offset;if(ct.isInstancedInterleavedBuffer){for(let Ht=0;Ht<X.locationSize;Ht++)m(X.location+Ht,ct.meshPerAttribute);y.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ct.meshPerAttribute*ct.count)}else for(let Ht=0;Ht<X.locationSize;Ht++)f(X.location+Ht);s.bindBuffer(s.ARRAY_BUFFER,Wt);for(let Ht=0;Ht<X.locationSize;Ht++)v(X.location+Ht,mt/X.locationSize,j,dt,Nt*nt,(Rt+mt/X.locationSize*Ht)*nt,ft)}else{if(ut.isInstancedBufferAttribute){for(let ct=0;ct<X.locationSize;ct++)m(X.location+ct,ut.meshPerAttribute);y.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ut.meshPerAttribute*ut.count)}else for(let ct=0;ct<X.locationSize;ct++)f(X.location+ct);s.bindBuffer(s.ARRAY_BUFFER,Wt);for(let ct=0;ct<X.locationSize;ct++)v(X.location+ct,mt/X.locationSize,j,dt,mt*nt,mt/X.locationSize*ct*nt,ft)}}else if(G!==void 0){const dt=G[K];if(dt!==void 0)switch(dt.length){case 2:s.vertexAttrib2fv(X.location,dt);break;case 3:s.vertexAttrib3fv(X.location,dt);break;case 4:s.vertexAttrib4fv(X.location,dt);break;default:s.vertexAttrib1fv(X.location,dt)}}}}x()}function R(){I();for(const y in n){const P=n[y];for(const B in P){const O=P[B];for(const Y in O)h(O[Y].object),delete O[Y];delete P[B]}delete n[y]}}function w(y){if(n[y.id]===void 0)return;const P=n[y.id];for(const B in P){const O=P[B];for(const Y in O)h(O[Y].object),delete O[Y];delete P[B]}delete n[y.id]}function A(y){for(const P in n){const B=n[P];if(B[y.id]===void 0)continue;const O=B[y.id];for(const Y in O)h(O[Y].object),delete O[Y];delete B[y.id]}}function I(){E(),o=!0,r!==i&&(r=i,l(r.object))}function E(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:I,resetDefaultState:E,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:f,disableUnusedAttributes:x}}function sm(s,t,e){let n;function i(l){n=l}function r(l,h){s.drawArrays(n,l,h),e.update(h,n,1)}function o(l,h,u){u!==0&&(s.drawArraysInstanced(n,l,h,u),e.update(h,n,u))}function a(l,h,u){if(u===0)return;const d=t.get("WEBGL_multi_draw");if(d===null)for(let p=0;p<u;p++)this.render(l[p],h[p]);else{d.multiDrawArraysWEBGL(n,l,0,h,0,u);let p=0;for(let g=0;g<u;g++)p+=h[g];e.update(p,n,1)}}function c(l,h,u,d){if(u===0)return;const p=t.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<l.length;g++)o(l[g],h[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,l,0,h,0,d,0,u);let g=0;for(let _=0;_<u;_++)g+=h[_];for(let _=0;_<d.length;_++)e.update(g,n,d[_])}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function rm(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const w=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(w){return!(w!==Ke&&n.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const A=w===Sr&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(w!==Un&&n.convert(w)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==An&&!A)}function c(w){if(w==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=e.precision!==void 0?e.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const u=e.logarithmicDepthBuffer===!0,d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),p=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_TEXTURE_SIZE),_=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),f=s.getParameter(s.MAX_VERTEX_ATTRIBS),m=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),x=s.getParameter(s.MAX_VARYING_VECTORS),v=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),M=p>0,R=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:u,maxTextures:d,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:_,maxAttributes:f,maxVertexUniforms:m,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:M,maxSamples:R}}function om(s){const t=this;let e=null,n=0,i=!1,r=!1;const o=new bn,a=new Ut,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){const p=u.length!==0||d||n!==0||i;return i=d,n=u.length,p},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,p){const g=u.clippingPlanes,_=u.clipIntersection,f=u.clipShadows,m=s.get(u);if(!i||g===null||g.length===0||r&&!f)r?h(null):l();else{const x=r?0:n,v=x*4;let M=m.clippingState||null;c.value=M,M=h(g,d,v,p);for(let R=0;R!==v;++R)M[R]=e[R];m.clippingState=M,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,p,g){const _=u!==null?u.length:0;let f=null;if(_!==0){if(f=c.value,g!==!0||f===null){const m=p+_*4,x=d.matrixWorldInverse;a.getNormalMatrix(x),(f===null||f.length<m)&&(f=new Float32Array(m));for(let v=0,M=p;v!==_;++v,M+=4)o.copy(u[v]).applyMatrix4(x,a),o.normal.toArray(f,M),f[M+3]=o.constant}c.value=f,c.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,f}}function am(s){let t=new WeakMap;function e(o,a){return a===Po?o.mapping=Ni:a===Lo&&(o.mapping=Oi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Po||a===Lo)if(t.has(o)){const c=t.get(o).texture;return e(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new _d(c.height);return l.fromEquirectangularTexture(s,o),t.set(o,l),o.addEventListener("dispose",i),e(l.texture,o.mapping)}else return null}}return o}function i(o){const a=o.target;a.removeEventListener("dispose",i);const c=t.get(a);c!==void 0&&(t.delete(a),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}class Fl extends Ul{constructor(t=-1,e=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,o=n+t,a=i+e,c=i-e;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}const Ai=4,nc=[.125,.215,.35,.446,.526,.582],jn=20,oo=new Fl,ic=new bt;let ao=null,co=0,lo=0,ho=!1;const Zn=(1+Math.sqrt(5))/2,Si=1/Zn,sc=[new L(-Zn,Si,0),new L(Zn,Si,0),new L(-Si,0,Zn),new L(Si,0,Zn),new L(0,Zn,-Si),new L(0,Zn,Si),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class rc{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,i=100){ao=this._renderer.getRenderTarget(),co=this._renderer.getActiveCubeFace(),lo=this._renderer.getActiveMipmapLevel(),ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,i,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=cc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=ac(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(ao,co,lo),this._renderer.xr.enabled=ho,t.scissorTest=!1,Hs(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ni||t.mapping===Oi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),ao=this._renderer.getRenderTarget(),co=this._renderer.getActiveCubeFace(),lo=this._renderer.getActiveMipmapLevel(),ho=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ye,minFilter:Ye,generateMipmaps:!1,type:Sr,format:Ke,colorSpace:On,depthBuffer:!1},i=oc(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=oc(t,e,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=cm(r)),this._blurMaterial=lm(r,t,e)}return i}_compileMaterial(t){const e=new Yt(this._lodPlanes[0],t);this._renderer.compile(e,oo)}_sceneToCubeUV(t,e,n,i){const a=new Ne(90,1,e,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,d=h.toneMapping;h.getClearColor(ic),h.toneMapping=Ln,h.autoClear=!1;const p=new Di({name:"PMREM.Background",side:Re,depthWrite:!1,depthTest:!1}),g=new Yt(new ds,p);let _=!1;const f=t.background;f?f.isColor&&(p.color.copy(f),t.background=null,_=!0):(p.color.copy(ic),_=!0);for(let m=0;m<6;m++){const x=m%3;x===0?(a.up.set(0,c[m],0),a.lookAt(l[m],0,0)):x===1?(a.up.set(0,0,c[m]),a.lookAt(0,l[m],0)):(a.up.set(0,c[m],0),a.lookAt(0,0,l[m]));const v=this._cubeSize;Hs(i,x*v,m>2?v:0,v,v),h.setRenderTarget(i),_&&h.render(g,a),h.render(t,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=d,h.autoClear=u,t.background=f}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===Ni||t.mapping===Oi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=cc()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=ac());const r=i?this._cubemapMaterial:this._equirectMaterial,o=new Yt(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=t;const c=this._cubeSize;Hs(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(o,oo)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodPlanes.length;for(let r=1;r<i;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=sc[(i-r-1)%sc.length];this._blur(t,r-1,r,o,a)}e.autoClear=n}_blur(t,e,n,i,r){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",r),this._halfBlur(o,t,n,n,i,"longitudinal",r)}_halfBlur(t,e,n,i,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,u=new Yt(this._lodPlanes[i],l),d=l.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*jn-1),_=r/g,f=isFinite(r)?1+Math.floor(h*_):jn;f>jn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${jn}`);const m=[];let x=0;for(let A=0;A<jn;++A){const I=A/_,E=Math.exp(-I*I/2);m.push(E),A===0?x+=E:A<f&&(x+=2*E)}for(let A=0;A<m.length;A++)m[A]=m[A]/x;d.envMap.value=t.texture,d.samples.value=f,d.weights.value=m,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-n;const M=this._sizeLods[i],R=3*M*(i>v-Ai?i-v+Ai:0),w=4*(this._cubeSize-M);Hs(e,R,w,3*M,2*M),c.setRenderTarget(e),c.render(u,oo)}}function cm(s){const t=[],e=[],n=[];let i=s;const r=s-Ai+1+nc.length;for(let o=0;o<r;o++){const a=Math.pow(2,i);e.push(a);let c=1/a;o>s-Ai?c=nc[o-s+Ai-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,u=1+l,d=[h,h,u,h,u,u,h,h,u,u,h,u],p=6,g=6,_=3,f=2,m=1,x=new Float32Array(_*g*p),v=new Float32Array(f*g*p),M=new Float32Array(m*g*p);for(let w=0;w<p;w++){const A=w%3*2/3-1,I=w>2?0:-1,E=[A,I,0,A+2/3,I,0,A+2/3,I+1,0,A,I,0,A+2/3,I+1,0,A,I+1,0];x.set(E,_*g*w),v.set(d,f*g*w);const y=[w,w,w,w,w,w];M.set(y,m*g*w)}const R=new qt;R.setAttribute("position",new Ce(x,_)),R.setAttribute("uv",new Ce(v,f)),R.setAttribute("faceIndex",new Ce(M,m)),t.push(R),i>Ai&&i--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function oc(s,t,e){const n=new Qn(s,t,e);return n.texture.mapping=xr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Hs(s,t,e,n,i){s.viewport.set(t,e,n,i),s.scissor.set(t,e,n,i)}function lm(s,t,e){const n=new Float32Array(jn),i=new L(0,1,0);return new Nn({name:"SphericalGaussianBlur",defines:{n:jn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function ac(){return new Nn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function cc(){return new Nn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Xo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Pn,depthTest:!1,depthWrite:!1})}function Xo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function hm(s){let t=new WeakMap,e=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Po||c===Lo,h=c===Ni||c===Oi;if(l||h){let u=t.get(a);const d=u!==void 0?u.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return e===null&&(e=new rc(s)),u=l?e.fromEquirectangular(a,u):e.fromCubemap(a,u),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),u.texture;if(u!==void 0)return u.texture;{const p=a.image;return l&&p&&p.height>0||h&&p&&i(p)?(e===null&&(e=new rc(s)),u=l?e.fromEquirectangular(a):e.fromCubemap(a),u.texture.pmremVersion=a.pmremVersion,t.set(a,u),a.addEventListener("dispose",r),u.texture):null}}}return a}function i(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=t.get(c);l!==void 0&&(t.delete(c),l.dispose())}function o(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:o}}function um(s){const t={};function e(n){if(t[n]!==void 0)return t[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Go("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function dm(s,t,e,n){const i={},r=new WeakMap;function o(u){const d=u.target;d.index!==null&&t.remove(d.index);for(const g in d.attributes)t.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let f=0,m=_.length;f<m;f++)t.remove(_[f])}d.removeEventListener("dispose",o),delete i[d.id];const p=r.get(d);p&&(t.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,e.memory.geometries--}function a(u,d){return i[d.id]===!0||(d.addEventListener("dispose",o),i[d.id]=!0,e.memory.geometries++),d}function c(u){const d=u.attributes;for(const g in d)t.update(d[g],s.ARRAY_BUFFER);const p=u.morphAttributes;for(const g in p){const _=p[g];for(let f=0,m=_.length;f<m;f++)t.update(_[f],s.ARRAY_BUFFER)}}function l(u){const d=[],p=u.index,g=u.attributes.position;let _=0;if(p!==null){const x=p.array;_=p.version;for(let v=0,M=x.length;v<M;v+=3){const R=x[v+0],w=x[v+1],A=x[v+2];d.push(R,w,w,A,A,R)}}else if(g!==void 0){const x=g.array;_=g.version;for(let v=0,M=x.length/3-1;v<M;v+=3){const R=v+0,w=v+1,A=v+2;d.push(R,w,w,A,A,R)}}else return;const f=new(Al(d)?Il:Ll)(d,1);f.version=_;const m=r.get(u);m&&t.remove(m),r.set(u,f)}function h(u){const d=r.get(u);if(d){const p=u.index;p!==null&&d.version<p.version&&l(u)}else l(u);return r.get(u)}return{get:a,update:c,getWireframeAttribute:h}}function fm(s,t,e){let n;function i(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function c(d,p){s.drawElements(n,p,r,d*o),e.update(p,n,1)}function l(d,p,g){g!==0&&(s.drawElementsInstanced(n,p,r,d*o,g),e.update(p,n,g))}function h(d,p,g){if(g===0)return;const _=t.get("WEBGL_multi_draw");if(_===null)for(let f=0;f<g;f++)this.render(d[f]/o,p[f]);else{_.multiDrawElementsWEBGL(n,p,0,r,d,0,g);let f=0;for(let m=0;m<g;m++)f+=p[m];e.update(f,n,1)}}function u(d,p,g,_){if(g===0)return;const f=t.get("WEBGL_multi_draw");if(f===null)for(let m=0;m<d.length;m++)l(d[m]/o,p[m],_[m]);else{f.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,_,0,g);let m=0;for(let x=0;x<g;x++)m+=p[x];for(let x=0;x<_.length;x++)e.update(m,n,_[x])}}this.setMode=i,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=u}function pm(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(e.calls++,o){case s.TRIANGLES:e.triangles+=a*(r/3);break;case s.LINES:e.lines+=a*(r/2);break;case s.LINE_STRIP:e.lines+=a*(r-1);break;case s.LINE_LOOP:e.lines+=a*r;break;case s.POINTS:e.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function mm(s,t,e){const n=new WeakMap,i=new ne;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=h!==void 0?h.length:0;let d=n.get(a);if(d===void 0||d.count!==u){let y=function(){I.dispose(),n.delete(a),a.removeEventListener("dispose",y)};var p=y;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,f=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let M=0;g===!0&&(M=1),_===!0&&(M=2),f===!0&&(M=3);let R=a.attributes.position.count*M,w=1;R>t.maxTextureSize&&(w=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);const A=new Float32Array(R*w*4*u),I=new Rl(A,R,w,u);I.type=An,I.needsUpdate=!0;const E=M*4;for(let P=0;P<u;P++){const B=m[P],O=x[P],Y=v[P],q=R*w*4*P;for(let G=0;G<B.count;G++){const K=G*E;g===!0&&(i.fromBufferAttribute(B,G),A[q+K+0]=i.x,A[q+K+1]=i.y,A[q+K+2]=i.z,A[q+K+3]=0),_===!0&&(i.fromBufferAttribute(O,G),A[q+K+4]=i.x,A[q+K+5]=i.y,A[q+K+6]=i.z,A[q+K+7]=0),f===!0&&(i.fromBufferAttribute(Y,G),A[q+K+8]=i.x,A[q+K+9]=i.y,A[q+K+10]=i.z,A[q+K+11]=Y.itemSize===4?i.w:1)}}d={count:u,texture:I,size:new Q(R,w)},n.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(s,"morphTexture",o.morphTexture,e);else{let g=0;for(let f=0;f<l.length;f++)g+=l[f];const _=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(s,"morphTargetBaseInfluence",_),c.getUniforms().setValue(s,"morphTargetInfluences",l)}c.getUniforms().setValue(s,"morphTargetsTexture",d.texture,e),c.getUniforms().setValue(s,"morphTargetsTextureSize",d.size)}return{update:r}}function gm(s,t,e,n){let i=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,u=t.get(c,h);if(i.get(u)!==l&&(t.update(u),i.set(u,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),i.get(c)!==l&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),i.set(c,l))),c.isSkinnedMesh){const d=c.skeleton;i.get(d)!==l&&(d.update(),i.set(d,l))}return u}function o(){i=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),e.remove(l.instanceMatrix),l.instanceColor!==null&&e.remove(l.instanceColor)}return{update:r,dispose:o}}class Bl extends Me{constructor(t,e,n,i,r,o,a,c,l,h=Pi){if(h!==Pi&&h!==zi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===Pi&&(n=Fi),n===void 0&&h===zi&&(n=Bi),super(null,i,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=a!==void 0?a:ke,this.minFilter=c!==void 0?c:ke,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}const zl=new Me,kl=new Bl(1,1);kl.compareFunction=Tl;const Hl=new Rl,Gl=new ed,Vl=new Nl,lc=[],hc=[],uc=new Float32Array(16),dc=new Float32Array(9),fc=new Float32Array(4);function Gi(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=lc[i];if(r===void 0&&(r=new Float32Array(i),lc[i]=r),t!==0){n.toArray(r,0);for(let o=1,a=0;o!==t;++o)a+=e,s[o].toArray(r,a)}return r}function pe(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function me(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Er(s,t){let e=hc[t];e===void 0&&(e=new Int32Array(t),hc[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function _m(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function vm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2fv(this.addr,t),me(e,t)}}function xm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(pe(e,t))return;s.uniform3fv(this.addr,t),me(e,t)}}function Sm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4fv(this.addr,t),me(e,t)}}function Mm(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;fc.set(n),s.uniformMatrix2fv(this.addr,!1,fc),me(e,n)}}function ym(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;dc.set(n),s.uniformMatrix3fv(this.addr,!1,dc),me(e,n)}}function bm(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(pe(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),me(e,t)}else{if(pe(e,n))return;uc.set(n),s.uniformMatrix4fv(this.addr,!1,uc),me(e,n)}}function Em(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function Tm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2iv(this.addr,t),me(e,t)}}function Am(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pe(e,t))return;s.uniform3iv(this.addr,t),me(e,t)}}function wm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4iv(this.addr,t),me(e,t)}}function Rm(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function Cm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(pe(e,t))return;s.uniform2uiv(this.addr,t),me(e,t)}}function Pm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(pe(e,t))return;s.uniform3uiv(this.addr,t),me(e,t)}}function Lm(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(pe(e,t))return;s.uniform4uiv(this.addr,t),me(e,t)}}function Im(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);const r=this.type===s.SAMPLER_2D_SHADOW?kl:zl;e.setTexture2D(t||r,i)}function Dm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Gl,i)}function Um(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Vl,i)}function Nm(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Hl,i)}function Om(s){switch(s){case 5126:return _m;case 35664:return vm;case 35665:return xm;case 35666:return Sm;case 35674:return Mm;case 35675:return ym;case 35676:return bm;case 5124:case 35670:return Em;case 35667:case 35671:return Tm;case 35668:case 35672:return Am;case 35669:case 35673:return wm;case 5125:return Rm;case 36294:return Cm;case 36295:return Pm;case 36296:return Lm;case 35678:case 36198:case 36298:case 36306:case 35682:return Im;case 35679:case 36299:case 36307:return Dm;case 35680:case 36300:case 36308:case 36293:return Um;case 36289:case 36303:case 36311:case 36292:return Nm}}function Fm(s,t){s.uniform1fv(this.addr,t)}function Bm(s,t){const e=Gi(t,this.size,2);s.uniform2fv(this.addr,e)}function zm(s,t){const e=Gi(t,this.size,3);s.uniform3fv(this.addr,e)}function km(s,t){const e=Gi(t,this.size,4);s.uniform4fv(this.addr,e)}function Hm(s,t){const e=Gi(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Gm(s,t){const e=Gi(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Vm(s,t){const e=Gi(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Wm(s,t){s.uniform1iv(this.addr,t)}function Xm(s,t){s.uniform2iv(this.addr,t)}function Ym(s,t){s.uniform3iv(this.addr,t)}function Zm(s,t){s.uniform4iv(this.addr,t)}function qm(s,t){s.uniform1uiv(this.addr,t)}function jm(s,t){s.uniform2uiv(this.addr,t)}function Km(s,t){s.uniform3uiv(this.addr,t)}function $m(s,t){s.uniform4uiv(this.addr,t)}function Jm(s,t,e){const n=this.cache,i=t.length,r=Er(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTexture2D(t[o]||zl,r[o])}function Qm(s,t,e){const n=this.cache,i=t.length,r=Er(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||Gl,r[o])}function tg(s,t,e){const n=this.cache,i=t.length,r=Er(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Vl,r[o])}function eg(s,t,e){const n=this.cache,i=t.length,r=Er(e,i);pe(n,r)||(s.uniform1iv(this.addr,r),me(n,r));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Hl,r[o])}function ng(s){switch(s){case 5126:return Fm;case 35664:return Bm;case 35665:return zm;case 35666:return km;case 35674:return Hm;case 35675:return Gm;case 35676:return Vm;case 5124:case 35670:return Wm;case 35667:case 35671:return Xm;case 35668:case 35672:return Ym;case 35669:case 35673:return Zm;case 5125:return qm;case 36294:return jm;case 36295:return Km;case 36296:return $m;case 35678:case 36198:case 36298:case 36306:case 35682:return Jm;case 35679:case 36299:case 36307:return Qm;case 35680:case 36300:case 36308:case 36293:return tg;case 36289:case 36303:case 36311:case 36292:return eg}}class ig{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Om(e.type)}}class sg{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=ng(e.type)}}class rg{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,o=i.length;r!==o;++r){const a=i[r];a.setValue(t,e[a.id],n)}}}const uo=/(\w+)(\])?(\[|\.)?/g;function pc(s,t){s.seq.push(t),s.map[t.id]=t}function og(s,t,e){const n=s.name,i=n.length;for(uo.lastIndex=0;;){const r=uo.exec(n),o=uo.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===i){pc(e,l===void 0?new ig(a,s,t):new sg(a,s,t));break}else{let u=e.map[a];u===void 0&&(u=new rg(a),pc(e,u)),e=u}}}class ir{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const r=t.getActiveUniform(e,i),o=t.getUniformLocation(e,r.name);og(r,o,this)}}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,o=e.length;r!==o;++r){const a=e[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(t,c.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function mc(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const ag=37297;let cg=0;function lg(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let o=i;o<r;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}function hg(s){const t=$t.getPrimaries($t.workingColorSpace),e=$t.getPrimaries(s);let n;switch(t===e?n="":t===lr&&e===cr?n="LinearDisplayP3ToLinearSRGB":t===cr&&e===lr&&(n="LinearSRGBToLinearDisplayP3"),s){case On:case Mr:return[n,"LinearTransferOETF"];case qe:case ko:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",s),[n,"LinearTransferOETF"]}}function gc(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),i=s.getShaderInfoLog(t).trim();if(n&&i==="")return"";const r=/ERROR: 0:(\d+)/.exec(i);if(r){const o=parseInt(r[1]);return e.toUpperCase()+`

`+i+`

`+lg(s.getShaderSource(t),o)}else return i}function ug(s,t){const e=hg(t);return`vec4 ${s}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function dg(s,t){let e;switch(t){case su:e="Linear";break;case ru:e="Reinhard";break;case ou:e="OptimizedCineon";break;case au:e="ACESFilmic";break;case lu:e="AgX";break;case hu:e="Neutral";break;case cu:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function fg(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Qi).join(`
`)}function pg(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function mg(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),o=r.name;let a=1;r.type===s.FLOAT_MAT2&&(a=2),r.type===s.FLOAT_MAT3&&(a=3),r.type===s.FLOAT_MAT4&&(a=4),e[o]={type:r.type,location:s.getAttribLocation(t,o),locationSize:a}}return e}function Qi(s){return s!==""}function _c(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function vc(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const gg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Uo(s){return s.replace(gg,vg)}const _g=new Map;function vg(s,t){let e=Dt[t];if(e===void 0){const n=_g.get(t);if(n!==void 0)e=Dt[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Uo(e)}const xg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function xc(s){return s.replace(xg,Sg)}function Sg(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Sc(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Mg(s){let t="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===ml?t="SHADOWMAP_TYPE_PCF":s.shadowMapType===Ph?t="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===cn&&(t="SHADOWMAP_TYPE_VSM"),t}function yg(s){let t="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ni:case Oi:t="ENVMAP_TYPE_CUBE";break;case xr:t="ENVMAP_TYPE_CUBE_UV";break}return t}function bg(s){let t="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Oi:t="ENVMAP_MODE_REFRACTION";break}return t}function Eg(s){let t="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case gl:t="ENVMAP_BLENDING_MULTIPLY";break;case nu:t="ENVMAP_BLENDING_MIX";break;case iu:t="ENVMAP_BLENDING_ADD";break}return t}function Tg(s){const t=s.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function Ag(s,t,e,n){const i=s.getContext(),r=e.defines;let o=e.vertexShader,a=e.fragmentShader;const c=Mg(e),l=yg(e),h=bg(e),u=Eg(e),d=Tg(e),p=fg(e),g=pg(r),_=i.createProgram();let f,m,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Qi).join(`
`),f.length>0&&(f+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(Qi).join(`
`),m.length>0&&(m+=`
`)):(f=[Sc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Qi).join(`
`),m=[Sc(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+l:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor||e.batchingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Ln?"#define TONE_MAPPING":"",e.toneMapping!==Ln?Dt.tonemapping_pars_fragment:"",e.toneMapping!==Ln?dg("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Dt.colorspace_pars_fragment,ug("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Qi).join(`
`)),o=Uo(o),o=_c(o,e),o=vc(o,e),a=Uo(a),a=_c(a,e),a=vc(a,e),o=xc(o),a=xc(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,m=["#define varying in",e.glslVersion===Na?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Na?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const v=x+f+o,M=x+m+a,R=mc(i,i.VERTEX_SHADER,v),w=mc(i,i.FRAGMENT_SHADER,M);i.attachShader(_,R),i.attachShader(_,w),e.index0AttributeName!==void 0?i.bindAttribLocation(_,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function A(P){if(s.debug.checkShaderErrors){const B=i.getProgramInfoLog(_).trim(),O=i.getShaderInfoLog(R).trim(),Y=i.getShaderInfoLog(w).trim();let q=!0,G=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(q=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,R,w);else{const K=gc(i,R,"vertex"),X=gc(i,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+B+`
`+K+`
`+X)}else B!==""?console.warn("THREE.WebGLProgram: Program Info Log:",B):(O===""||Y==="")&&(G=!1);G&&(P.diagnostics={runnable:q,programLog:B,vertexShader:{log:O,prefix:f},fragmentShader:{log:Y,prefix:m}})}i.deleteShader(R),i.deleteShader(w),I=new ir(i,_),E=mg(i,_)}let I;this.getUniforms=function(){return I===void 0&&A(this),I};let E;this.getAttributes=function(){return E===void 0&&A(this),E};let y=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=i.getProgramParameter(_,ag)),y},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=cg++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=w,this}let wg=0;class Rg{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new Cg(t),e.set(t,n)),n}}class Cg{constructor(t){this.id=wg++,this.code=t,this.usedTimes=0}}function Pg(s,t,e,n,i,r,o){const a=new Cl,c=new Rg,l=new Set,h=[],u=i.logarithmicDepthBuffer,d=i.vertexTextures;let p=i.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(E){return l.add(E),E===0?"uv":`uv${E}`}function f(E,y,P,B,O){const Y=B.fog,q=O.geometry,G=E.isMeshStandardMaterial?B.environment:null,K=(E.isMeshStandardMaterial?e:t).get(E.envMap||G),X=K&&K.mapping===xr?K.image.height:null,ut=g[E.type];E.precision!==null&&(p=i.getMaxPrecision(E.precision),p!==E.precision&&console.warn("THREE.WebGLProgram.getParameters:",E.precision,"not supported, using",p,"instead."));const dt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,mt=dt!==void 0?dt.length:0;let kt=0;q.morphAttributes.position!==void 0&&(kt=1),q.morphAttributes.normal!==void 0&&(kt=2),q.morphAttributes.color!==void 0&&(kt=3);let Wt,j,nt,ft;if(ut){const Xt=je[ut];Wt=Xt.vertexShader,j=Xt.fragmentShader}else Wt=E.vertexShader,j=E.fragmentShader,c.update(E),nt=c.getVertexShaderID(E),ft=c.getFragmentShaderID(E);const ct=s.getRenderTarget(),Nt=O.isInstancedMesh===!0,Rt=O.isBatchedMesh===!0,Ht=!!E.map,D=!!E.matcap,Gt=!!K,Bt=!!E.aoMap,Qt=!!E.lightMap,Mt=!!E.bumpMap,Vt=!!E.normalMap,Ot=!!E.displacementMap,Ct=!!E.emissiveMap,ie=!!E.metalnessMap,C=!!E.roughnessMap,b=E.anisotropy>0,H=E.clearcoat>0,$=E.dispersion>0,tt=E.iridescence>0,et=E.sheen>0,vt=E.transmission>0,ot=b&&!!E.anisotropyMap,rt=H&&!!E.clearcoatMap,Pt=H&&!!E.clearcoatNormalMap,it=H&&!!E.clearcoatRoughnessMap,gt=tt&&!!E.iridescenceMap,Ft=tt&&!!E.iridescenceThicknessMap,Et=et&&!!E.sheenColorMap,lt=et&&!!E.sheenRoughnessMap,Lt=!!E.specularMap,It=!!E.specularColorMap,re=!!E.specularIntensityMap,S=vt&&!!E.transmissionMap,V=vt&&!!E.thicknessMap,F=!!E.gradientMap,W=!!E.alphaMap,J=E.alphaTest>0,xt=!!E.alphaHash,wt=!!E.extensions;let oe=Ln;E.toneMapped&&(ct===null||ct.isXRRenderTarget===!0)&&(oe=s.toneMapping);const le={shaderID:ut,shaderType:E.type,shaderName:E.name,vertexShader:Wt,fragmentShader:j,defines:E.defines,customVertexShaderID:nt,customFragmentShaderID:ft,isRawShaderMaterial:E.isRawShaderMaterial===!0,glslVersion:E.glslVersion,precision:p,batching:Rt,batchingColor:Rt&&O._colorsTexture!==null,instancing:Nt,instancingColor:Nt&&O.instanceColor!==null,instancingMorph:Nt&&O.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ct===null?s.outputColorSpace:ct.isXRRenderTarget===!0?ct.texture.colorSpace:On,alphaToCoverage:!!E.alphaToCoverage,map:Ht,matcap:D,envMap:Gt,envMapMode:Gt&&K.mapping,envMapCubeUVHeight:X,aoMap:Bt,lightMap:Qt,bumpMap:Mt,normalMap:Vt,displacementMap:d&&Ot,emissiveMap:Ct,normalMapObjectSpace:Vt&&E.normalMapType===Eu,normalMapTangentSpace:Vt&&E.normalMapType===El,metalnessMap:ie,roughnessMap:C,anisotropy:b,anisotropyMap:ot,clearcoat:H,clearcoatMap:rt,clearcoatNormalMap:Pt,clearcoatRoughnessMap:it,dispersion:$,iridescence:tt,iridescenceMap:gt,iridescenceThicknessMap:Ft,sheen:et,sheenColorMap:Et,sheenRoughnessMap:lt,specularMap:Lt,specularColorMap:It,specularIntensityMap:re,transmission:vt,transmissionMap:S,thicknessMap:V,gradientMap:F,opaque:E.transparent===!1&&E.blending===Ci&&E.alphaToCoverage===!1,alphaMap:W,alphaTest:J,alphaHash:xt,combine:E.combine,mapUv:Ht&&_(E.map.channel),aoMapUv:Bt&&_(E.aoMap.channel),lightMapUv:Qt&&_(E.lightMap.channel),bumpMapUv:Mt&&_(E.bumpMap.channel),normalMapUv:Vt&&_(E.normalMap.channel),displacementMapUv:Ot&&_(E.displacementMap.channel),emissiveMapUv:Ct&&_(E.emissiveMap.channel),metalnessMapUv:ie&&_(E.metalnessMap.channel),roughnessMapUv:C&&_(E.roughnessMap.channel),anisotropyMapUv:ot&&_(E.anisotropyMap.channel),clearcoatMapUv:rt&&_(E.clearcoatMap.channel),clearcoatNormalMapUv:Pt&&_(E.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:it&&_(E.clearcoatRoughnessMap.channel),iridescenceMapUv:gt&&_(E.iridescenceMap.channel),iridescenceThicknessMapUv:Ft&&_(E.iridescenceThicknessMap.channel),sheenColorMapUv:Et&&_(E.sheenColorMap.channel),sheenRoughnessMapUv:lt&&_(E.sheenRoughnessMap.channel),specularMapUv:Lt&&_(E.specularMap.channel),specularColorMapUv:It&&_(E.specularColorMap.channel),specularIntensityMapUv:re&&_(E.specularIntensityMap.channel),transmissionMapUv:S&&_(E.transmissionMap.channel),thicknessMapUv:V&&_(E.thicknessMap.channel),alphaMapUv:W&&_(E.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Vt||b),vertexColors:E.vertexColors,vertexAlphas:E.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!q.attributes.uv&&(Ht||W),fog:!!Y,useFog:E.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:E.flatShading===!0,sizeAttenuation:E.sizeAttenuation===!0,logarithmicDepthBuffer:u,skinning:O.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:mt,morphTextureStride:kt,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:E.dithering,shadowMapEnabled:s.shadowMap.enabled&&P.length>0,shadowMapType:s.shadowMap.type,toneMapping:oe,decodeVideoTexture:Ht&&E.map.isVideoTexture===!0&&$t.getTransfer(E.map.colorSpace)===te,premultipliedAlpha:E.premultipliedAlpha,doubleSided:E.side===we,flipSided:E.side===Re,useDepthPacking:E.depthPacking>=0,depthPacking:E.depthPacking||0,index0AttributeName:E.index0AttributeName,extensionClipCullDistance:wt&&E.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:wt&&E.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:E.customProgramCacheKey()};return le.vertexUv1s=l.has(1),le.vertexUv2s=l.has(2),le.vertexUv3s=l.has(3),l.clear(),le}function m(E){const y=[];if(E.shaderID?y.push(E.shaderID):(y.push(E.customVertexShaderID),y.push(E.customFragmentShaderID)),E.defines!==void 0)for(const P in E.defines)y.push(P),y.push(E.defines[P]);return E.isRawShaderMaterial===!1&&(x(y,E),v(y,E),y.push(s.outputColorSpace)),y.push(E.customProgramCacheKey),y.join()}function x(E,y){E.push(y.precision),E.push(y.outputColorSpace),E.push(y.envMapMode),E.push(y.envMapCubeUVHeight),E.push(y.mapUv),E.push(y.alphaMapUv),E.push(y.lightMapUv),E.push(y.aoMapUv),E.push(y.bumpMapUv),E.push(y.normalMapUv),E.push(y.displacementMapUv),E.push(y.emissiveMapUv),E.push(y.metalnessMapUv),E.push(y.roughnessMapUv),E.push(y.anisotropyMapUv),E.push(y.clearcoatMapUv),E.push(y.clearcoatNormalMapUv),E.push(y.clearcoatRoughnessMapUv),E.push(y.iridescenceMapUv),E.push(y.iridescenceThicknessMapUv),E.push(y.sheenColorMapUv),E.push(y.sheenRoughnessMapUv),E.push(y.specularMapUv),E.push(y.specularColorMapUv),E.push(y.specularIntensityMapUv),E.push(y.transmissionMapUv),E.push(y.thicknessMapUv),E.push(y.combine),E.push(y.fogExp2),E.push(y.sizeAttenuation),E.push(y.morphTargetsCount),E.push(y.morphAttributeCount),E.push(y.numDirLights),E.push(y.numPointLights),E.push(y.numSpotLights),E.push(y.numSpotLightMaps),E.push(y.numHemiLights),E.push(y.numRectAreaLights),E.push(y.numDirLightShadows),E.push(y.numPointLightShadows),E.push(y.numSpotLightShadows),E.push(y.numSpotLightShadowsWithMaps),E.push(y.numLightProbes),E.push(y.shadowMapType),E.push(y.toneMapping),E.push(y.numClippingPlanes),E.push(y.numClipIntersection),E.push(y.depthPacking)}function v(E,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),E.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.doubleSided&&a.enable(10),y.flipSided&&a.enable(11),y.useDepthPacking&&a.enable(12),y.dithering&&a.enable(13),y.transmission&&a.enable(14),y.sheen&&a.enable(15),y.opaque&&a.enable(16),y.pointsUvs&&a.enable(17),y.decodeVideoTexture&&a.enable(18),y.alphaToCoverage&&a.enable(19),E.push(a.mask)}function M(E){const y=g[E.type];let P;if(y){const B=je[y];P=fd.clone(B.uniforms)}else P=E.uniforms;return P}function R(E,y){let P;for(let B=0,O=h.length;B<O;B++){const Y=h[B];if(Y.cacheKey===y){P=Y,++P.usedTimes;break}}return P===void 0&&(P=new Ag(s,y,E,r),h.push(P)),P}function w(E){if(--E.usedTimes===0){const y=h.indexOf(E);h[y]=h[h.length-1],h.pop(),E.destroy()}}function A(E){c.remove(E)}function I(){c.dispose()}return{getParameters:f,getProgramCacheKey:m,getUniforms:M,acquireProgram:R,releaseProgram:w,releaseShaderCache:A,programs:h,dispose:I}}function Lg(){let s=new WeakMap;function t(r){let o=s.get(r);return o===void 0&&(o={},s.set(r,o)),o}function e(r){s.delete(r)}function n(r,o,a){s.get(r)[o]=a}function i(){s=new WeakMap}return{get:t,remove:e,update:n,dispose:i}}function Ig(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.z!==t.z?s.z-t.z:s.id-t.id}function Mc(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function yc(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function o(u,d,p,g,_,f){let m=s[t];return m===void 0?(m={id:u.id,object:u,geometry:d,material:p,groupOrder:g,renderOrder:u.renderOrder,z:_,group:f},s[t]=m):(m.id=u.id,m.object=u,m.geometry=d,m.material=p,m.groupOrder=g,m.renderOrder=u.renderOrder,m.z=_,m.group=f),t++,m}function a(u,d,p,g,_,f){const m=o(u,d,p,g,_,f);p.transmission>0?n.push(m):p.transparent===!0?i.push(m):e.push(m)}function c(u,d,p,g,_,f){const m=o(u,d,p,g,_,f);p.transmission>0?n.unshift(m):p.transparent===!0?i.unshift(m):e.unshift(m)}function l(u,d){e.length>1&&e.sort(u||Ig),n.length>1&&n.sort(d||Mc),i.length>1&&i.sort(d||Mc)}function h(){for(let u=t,d=s.length;u<d;u++){const p=s[u];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:a,unshift:c,finish:h,sort:l}}function Dg(){let s=new WeakMap;function t(n,i){const r=s.get(n);let o;return r===void 0?(o=new yc,s.set(n,[o])):i>=r.length?(o=new yc,r.push(o)):o=r[i],o}function e(){s=new WeakMap}return{get:t,dispose:e}}function Ug(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new L,color:new bt};break;case"SpotLight":e={position:new L,direction:new L,color:new bt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new L,color:new bt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new L,skyColor:new bt,groundColor:new bt};break;case"RectAreaLight":e={color:new bt,position:new L,halfWidth:new L,halfHeight:new L};break}return s[t.id]=e,e}}}function Ng(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Q};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Q};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Q,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let Og=0;function Fg(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function Bg(s){const t=new Ug,e=Ng(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);const i=new L,r=new ee,o=new ee;function a(l){let h=0,u=0,d=0;for(let E=0;E<9;E++)n.probe[E].set(0,0,0);let p=0,g=0,_=0,f=0,m=0,x=0,v=0,M=0,R=0,w=0,A=0;l.sort(Fg);for(let E=0,y=l.length;E<y;E++){const P=l[E],B=P.color,O=P.intensity,Y=P.distance,q=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=B.r*O,u+=B.g*O,d+=B.b*O;else if(P.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(P.sh.coefficients[G],O);A++}else if(P.isDirectionalLight){const G=t.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const K=P.shadow,X=e.get(P);X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.directionalShadow[p]=X,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=P.shadow.matrix,x++}n.directional[p]=G,p++}else if(P.isSpotLight){const G=t.get(P);G.position.setFromMatrixPosition(P.matrixWorld),G.color.copy(B).multiplyScalar(O),G.distance=Y,G.coneCos=Math.cos(P.angle),G.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),G.decay=P.decay,n.spot[_]=G;const K=P.shadow;if(P.map&&(n.spotLightMap[R]=P.map,R++,K.updateMatrices(P),P.castShadow&&w++),n.spotLightMatrix[_]=K.matrix,P.castShadow){const X=e.get(P);X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.spotShadow[_]=X,n.spotShadowMap[_]=q,M++}_++}else if(P.isRectAreaLight){const G=t.get(P);G.color.copy(B).multiplyScalar(O),G.halfWidth.set(P.width*.5,0,0),G.halfHeight.set(0,P.height*.5,0),n.rectArea[f]=G,f++}else if(P.isPointLight){const G=t.get(P);if(G.color.copy(P.color).multiplyScalar(P.intensity),G.distance=P.distance,G.decay=P.decay,P.castShadow){const K=P.shadow,X=e.get(P);X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,X.shadowCameraNear=K.camera.near,X.shadowCameraFar=K.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=P.shadow.matrix,v++}n.point[g]=G,g++}else if(P.isHemisphereLight){const G=t.get(P);G.skyColor.copy(P.color).multiplyScalar(O),G.groundColor.copy(P.groundColor).multiplyScalar(O),n.hemi[m]=G,m++}}f>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=at.LTC_FLOAT_1,n.rectAreaLTC2=at.LTC_FLOAT_2):(n.rectAreaLTC1=at.LTC_HALF_1,n.rectAreaLTC2=at.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;const I=n.hash;(I.directionalLength!==p||I.pointLength!==g||I.spotLength!==_||I.rectAreaLength!==f||I.hemiLength!==m||I.numDirectionalShadows!==x||I.numPointShadows!==v||I.numSpotShadows!==M||I.numSpotMaps!==R||I.numLightProbes!==A)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=f,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=M,n.spotShadowMap.length=M,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=M+R-w,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=A,I.directionalLength=p,I.pointLength=g,I.spotLength=_,I.rectAreaLength=f,I.hemiLength=m,I.numDirectionalShadows=x,I.numPointShadows=v,I.numSpotShadows=M,I.numSpotMaps=R,I.numLightProbes=A,n.version=Og++)}function c(l,h){let u=0,d=0,p=0,g=0,_=0;const f=h.matrixWorldInverse;for(let m=0,x=l.length;m<x;m++){const v=l[m];if(v.isDirectionalLight){const M=n.directional[u];M.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(f),u++}else if(v.isSpotLight){const M=n.spot[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(f),M.direction.setFromMatrixPosition(v.matrixWorld),i.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(i),M.direction.transformDirection(f),p++}else if(v.isRectAreaLight){const M=n.rectArea[g];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(f),o.identity(),r.copy(v.matrixWorld),r.premultiply(f),o.extractRotation(r),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const M=n.point[d];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(f),d++}else if(v.isHemisphereLight){const M=n.hemi[_];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(f),_++}}}return{setup:a,setupView:c,state:n}}function bc(s){const t=new Bg(s),e=[],n=[];function i(h){l.camera=h,e.length=0,n.length=0}function r(h){e.push(h)}function o(h){n.push(h)}function a(){t.setup(e)}function c(h){t.setupView(e,h)}const l={lightsArray:e,shadowsArray:n,camera:null,lights:t,transmissionRenderTarget:{}};return{init:i,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function zg(s){let t=new WeakMap;function e(i,r=0){const o=t.get(i);let a;return o===void 0?(a=new bc(s),t.set(i,[a])):r>=o.length?(a=new bc(s),o.push(a)):a=o[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}class kg extends ii{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Hg extends ii{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}const Gg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Vg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function Wg(s,t,e){let n=new Wo;const i=new Q,r=new Q,o=new ne,a=new kg({depthPacking:bu}),c=new Hg,l={},h=e.maxTextureSize,u={[Dn]:Re,[Re]:Dn,[we]:we},d=new Nn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Q},radius:{value:4}},vertexShader:Gg,fragmentShader:Vg}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new qt;g.setAttribute("position",new Ce(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Yt(g,d),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=ml;let m=this.type;this.render=function(w,A,I){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||w.length===0)return;const E=s.getRenderTarget(),y=s.getActiveCubeFace(),P=s.getActiveMipmapLevel(),B=s.state;B.setBlending(Pn),B.buffers.color.setClear(1,1,1,1),B.buffers.depth.setTest(!0),B.setScissorTest(!1);const O=m!==cn&&this.type===cn,Y=m===cn&&this.type!==cn;for(let q=0,G=w.length;q<G;q++){const K=w[q],X=K.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;i.copy(X.mapSize);const ut=X.getFrameExtents();if(i.multiply(ut),r.copy(X.mapSize),(i.x>h||i.y>h)&&(i.x>h&&(r.x=Math.floor(h/ut.x),i.x=r.x*ut.x,X.mapSize.x=r.x),i.y>h&&(r.y=Math.floor(h/ut.y),i.y=r.y*ut.y,X.mapSize.y=r.y)),X.map===null||O===!0||Y===!0){const mt=this.type!==cn?{minFilter:ke,magFilter:ke}:{};X.map!==null&&X.map.dispose(),X.map=new Qn(i.x,i.y,mt),X.map.texture.name=K.name+".shadowMap",X.camera.updateProjectionMatrix()}s.setRenderTarget(X.map),s.clear();const dt=X.getViewportCount();for(let mt=0;mt<dt;mt++){const kt=X.getViewport(mt);o.set(r.x*kt.x,r.y*kt.y,r.x*kt.z,r.y*kt.w),B.viewport(o),X.updateMatrices(K,mt),n=X.getFrustum(),M(A,I,X.camera,K,this.type)}X.isPointLightShadow!==!0&&this.type===cn&&x(X,I),X.needsUpdate=!1}m=this.type,f.needsUpdate=!1,s.setRenderTarget(E,y,P)};function x(w,A){const I=t.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Qn(i.x,i.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,s.setRenderTarget(w.mapPass),s.clear(),s.renderBufferDirect(A,null,I,d,_,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,s.setRenderTarget(w.map),s.clear(),s.renderBufferDirect(A,null,I,p,_,null)}function v(w,A,I,E){let y=null;const P=I.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(P!==void 0)y=P;else if(y=I.isPointLight===!0?c:a,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const B=y.uuid,O=A.uuid;let Y=l[B];Y===void 0&&(Y={},l[B]=Y);let q=Y[O];q===void 0&&(q=y.clone(),Y[O]=q,A.addEventListener("dispose",R)),y=q}if(y.visible=A.visible,y.wireframe=A.wireframe,E===cn?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:u[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,I.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const B=s.properties.get(y);B.light=I}return y}function M(w,A,I,E,y){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===cn)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,w.matrixWorld);const O=t.update(w),Y=w.material;if(Array.isArray(Y)){const q=O.groups;for(let G=0,K=q.length;G<K;G++){const X=q[G],ut=Y[X.materialIndex];if(ut&&ut.visible){const dt=v(w,ut,E,y);w.onBeforeShadow(s,w,A,I,O,dt,X),s.renderBufferDirect(I,null,O,dt,w,X),w.onAfterShadow(s,w,A,I,O,dt,X)}}}else if(Y.visible){const q=v(w,Y,E,y);w.onBeforeShadow(s,w,A,I,O,q,null),s.renderBufferDirect(I,null,O,q,w,null),w.onAfterShadow(s,w,A,I,O,q,null)}}const B=w.children;for(let O=0,Y=B.length;O<Y;O++)M(B[O],A,I,E,y)}function R(w){w.target.removeEventListener("dispose",R);for(const I in l){const E=l[I],y=w.target.uuid;y in E&&(E[y].dispose(),delete E[y])}}}function Xg(s){function t(){let S=!1;const V=new ne;let F=null;const W=new ne(0,0,0,0);return{setMask:function(J){F!==J&&!S&&(s.colorMask(J,J,J,J),F=J)},setLocked:function(J){S=J},setClear:function(J,xt,wt,oe,le){le===!0&&(J*=oe,xt*=oe,wt*=oe),V.set(J,xt,wt,oe),W.equals(V)===!1&&(s.clearColor(J,xt,wt,oe),W.copy(V))},reset:function(){S=!1,F=null,W.set(-1,0,0,0)}}}function e(){let S=!1,V=null,F=null,W=null;return{setTest:function(J){J?ft(s.DEPTH_TEST):ct(s.DEPTH_TEST)},setMask:function(J){V!==J&&!S&&(s.depthMask(J),V=J)},setFunc:function(J){if(F!==J){switch(J){case jh:s.depthFunc(s.NEVER);break;case Kh:s.depthFunc(s.ALWAYS);break;case $h:s.depthFunc(s.LESS);break;case sr:s.depthFunc(s.LEQUAL);break;case Jh:s.depthFunc(s.EQUAL);break;case Qh:s.depthFunc(s.GEQUAL);break;case tu:s.depthFunc(s.GREATER);break;case eu:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}F=J}},setLocked:function(J){S=J},setClear:function(J){W!==J&&(s.clearDepth(J),W=J)},reset:function(){S=!1,V=null,F=null,W=null}}}function n(){let S=!1,V=null,F=null,W=null,J=null,xt=null,wt=null,oe=null,le=null;return{setTest:function(Xt){S||(Xt?ft(s.STENCIL_TEST):ct(s.STENCIL_TEST))},setMask:function(Xt){V!==Xt&&!S&&(s.stencilMask(Xt),V=Xt)},setFunc:function(Xt,he,ue){(F!==Xt||W!==he||J!==ue)&&(s.stencilFunc(Xt,he,ue),F=Xt,W=he,J=ue)},setOp:function(Xt,he,ue){(xt!==Xt||wt!==he||oe!==ue)&&(s.stencilOp(Xt,he,ue),xt=Xt,wt=he,oe=ue)},setLocked:function(Xt){S=Xt},setClear:function(Xt){le!==Xt&&(s.clearStencil(Xt),le=Xt)},reset:function(){S=!1,V=null,F=null,W=null,J=null,xt=null,wt=null,oe=null,le=null}}}const i=new t,r=new e,o=new n,a=new WeakMap,c=new WeakMap;let l={},h={},u=new WeakMap,d=[],p=null,g=!1,_=null,f=null,m=null,x=null,v=null,M=null,R=null,w=new bt(0,0,0),A=0,I=!1,E=null,y=null,P=null,B=null,O=null;const Y=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,G=0;const K=s.getParameter(s.VERSION);K.indexOf("WebGL")!==-1?(G=parseFloat(/^WebGL (\d)/.exec(K)[1]),q=G>=1):K.indexOf("OpenGL ES")!==-1&&(G=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),q=G>=2);let X=null,ut={};const dt=s.getParameter(s.SCISSOR_BOX),mt=s.getParameter(s.VIEWPORT),kt=new ne().fromArray(dt),Wt=new ne().fromArray(mt);function j(S,V,F,W){const J=new Uint8Array(4),xt=s.createTexture();s.bindTexture(S,xt),s.texParameteri(S,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(S,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let wt=0;wt<F;wt++)S===s.TEXTURE_3D||S===s.TEXTURE_2D_ARRAY?s.texImage3D(V,0,s.RGBA,1,1,W,0,s.RGBA,s.UNSIGNED_BYTE,J):s.texImage2D(V+wt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,J);return xt}const nt={};nt[s.TEXTURE_2D]=j(s.TEXTURE_2D,s.TEXTURE_2D,1),nt[s.TEXTURE_CUBE_MAP]=j(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),nt[s.TEXTURE_2D_ARRAY]=j(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),nt[s.TEXTURE_3D]=j(s.TEXTURE_3D,s.TEXTURE_3D,1,1),i.setClear(0,0,0,1),r.setClear(1),o.setClear(0),ft(s.DEPTH_TEST),r.setFunc(sr),Mt(!1),Vt(sa),ft(s.CULL_FACE),Bt(Pn);function ft(S){l[S]!==!0&&(s.enable(S),l[S]=!0)}function ct(S){l[S]!==!1&&(s.disable(S),l[S]=!1)}function Nt(S,V){return h[S]!==V?(s.bindFramebuffer(S,V),h[S]=V,S===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=V),S===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=V),!0):!1}function Rt(S,V){let F=d,W=!1;if(S){F=u.get(V),F===void 0&&(F=[],u.set(V,F));const J=S.textures;if(F.length!==J.length||F[0]!==s.COLOR_ATTACHMENT0){for(let xt=0,wt=J.length;xt<wt;xt++)F[xt]=s.COLOR_ATTACHMENT0+xt;F.length=J.length,W=!0}}else F[0]!==s.BACK&&(F[0]=s.BACK,W=!0);W&&s.drawBuffers(F)}function Ht(S){return p!==S?(s.useProgram(S),p=S,!0):!1}const D={[qn]:s.FUNC_ADD,[Ih]:s.FUNC_SUBTRACT,[Dh]:s.FUNC_REVERSE_SUBTRACT};D[Uh]=s.MIN,D[Nh]=s.MAX;const Gt={[Oh]:s.ZERO,[Fh]:s.ONE,[Bh]:s.SRC_COLOR,[Ro]:s.SRC_ALPHA,[Wh]:s.SRC_ALPHA_SATURATE,[Gh]:s.DST_COLOR,[kh]:s.DST_ALPHA,[zh]:s.ONE_MINUS_SRC_COLOR,[Co]:s.ONE_MINUS_SRC_ALPHA,[Vh]:s.ONE_MINUS_DST_COLOR,[Hh]:s.ONE_MINUS_DST_ALPHA,[Xh]:s.CONSTANT_COLOR,[Yh]:s.ONE_MINUS_CONSTANT_COLOR,[Zh]:s.CONSTANT_ALPHA,[qh]:s.ONE_MINUS_CONSTANT_ALPHA};function Bt(S,V,F,W,J,xt,wt,oe,le,Xt){if(S===Pn){g===!0&&(ct(s.BLEND),g=!1);return}if(g===!1&&(ft(s.BLEND),g=!0),S!==Lh){if(S!==_||Xt!==I){if((f!==qn||v!==qn)&&(s.blendEquation(s.FUNC_ADD),f=qn,v=qn),Xt)switch(S){case Ci:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ra:s.blendFunc(s.ONE,s.ONE);break;case oa:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case aa:s.blendFuncSeparate(s.ZERO,s.SRC_COLOR,s.ZERO,s.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",S);break}else switch(S){case Ci:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case ra:s.blendFunc(s.SRC_ALPHA,s.ONE);break;case oa:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case aa:s.blendFunc(s.ZERO,s.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",S);break}m=null,x=null,M=null,R=null,w.set(0,0,0),A=0,_=S,I=Xt}return}J=J||V,xt=xt||F,wt=wt||W,(V!==f||J!==v)&&(s.blendEquationSeparate(D[V],D[J]),f=V,v=J),(F!==m||W!==x||xt!==M||wt!==R)&&(s.blendFuncSeparate(Gt[F],Gt[W],Gt[xt],Gt[wt]),m=F,x=W,M=xt,R=wt),(oe.equals(w)===!1||le!==A)&&(s.blendColor(oe.r,oe.g,oe.b,le),w.copy(oe),A=le),_=S,I=!1}function Qt(S,V){S.side===we?ct(s.CULL_FACE):ft(s.CULL_FACE);let F=S.side===Re;V&&(F=!F),Mt(F),S.blending===Ci&&S.transparent===!1?Bt(Pn):Bt(S.blending,S.blendEquation,S.blendSrc,S.blendDst,S.blendEquationAlpha,S.blendSrcAlpha,S.blendDstAlpha,S.blendColor,S.blendAlpha,S.premultipliedAlpha),r.setFunc(S.depthFunc),r.setTest(S.depthTest),r.setMask(S.depthWrite),i.setMask(S.colorWrite);const W=S.stencilWrite;o.setTest(W),W&&(o.setMask(S.stencilWriteMask),o.setFunc(S.stencilFunc,S.stencilRef,S.stencilFuncMask),o.setOp(S.stencilFail,S.stencilZFail,S.stencilZPass)),Ct(S.polygonOffset,S.polygonOffsetFactor,S.polygonOffsetUnits),S.alphaToCoverage===!0?ft(s.SAMPLE_ALPHA_TO_COVERAGE):ct(s.SAMPLE_ALPHA_TO_COVERAGE)}function Mt(S){E!==S&&(S?s.frontFace(s.CW):s.frontFace(s.CCW),E=S)}function Vt(S){S!==Rh?(ft(s.CULL_FACE),S!==y&&(S===sa?s.cullFace(s.BACK):S===Ch?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):ct(s.CULL_FACE),y=S}function Ot(S){S!==P&&(q&&s.lineWidth(S),P=S)}function Ct(S,V,F){S?(ft(s.POLYGON_OFFSET_FILL),(B!==V||O!==F)&&(s.polygonOffset(V,F),B=V,O=F)):ct(s.POLYGON_OFFSET_FILL)}function ie(S){S?ft(s.SCISSOR_TEST):ct(s.SCISSOR_TEST)}function C(S){S===void 0&&(S=s.TEXTURE0+Y-1),X!==S&&(s.activeTexture(S),X=S)}function b(S,V,F){F===void 0&&(X===null?F=s.TEXTURE0+Y-1:F=X);let W=ut[F];W===void 0&&(W={type:void 0,texture:void 0},ut[F]=W),(W.type!==S||W.texture!==V)&&(X!==F&&(s.activeTexture(F),X=F),s.bindTexture(S,V||nt[S]),W.type=S,W.texture=V)}function H(){const S=ut[X];S!==void 0&&S.type!==void 0&&(s.bindTexture(S.type,null),S.type=void 0,S.texture=void 0)}function $(){try{s.compressedTexImage2D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function tt(){try{s.compressedTexImage3D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function et(){try{s.texSubImage2D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function vt(){try{s.texSubImage3D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function ot(){try{s.compressedTexSubImage2D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function rt(){try{s.compressedTexSubImage3D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function Pt(){try{s.texStorage2D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function it(){try{s.texStorage3D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function gt(){try{s.texImage2D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function Ft(){try{s.texImage3D.apply(s,arguments)}catch(S){console.error("THREE.WebGLState:",S)}}function Et(S){kt.equals(S)===!1&&(s.scissor(S.x,S.y,S.z,S.w),kt.copy(S))}function lt(S){Wt.equals(S)===!1&&(s.viewport(S.x,S.y,S.z,S.w),Wt.copy(S))}function Lt(S,V){let F=c.get(V);F===void 0&&(F=new WeakMap,c.set(V,F));let W=F.get(S);W===void 0&&(W=s.getUniformBlockIndex(V,S.name),F.set(S,W))}function It(S,V){const W=c.get(V).get(S);a.get(V)!==W&&(s.uniformBlockBinding(V,W,S.__bindingPointIndex),a.set(V,W))}function re(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),l={},X=null,ut={},h={},u=new WeakMap,d=[],p=null,g=!1,_=null,f=null,m=null,x=null,v=null,M=null,R=null,w=new bt(0,0,0),A=0,I=!1,E=null,y=null,P=null,B=null,O=null,kt.set(0,0,s.canvas.width,s.canvas.height),Wt.set(0,0,s.canvas.width,s.canvas.height),i.reset(),r.reset(),o.reset()}return{buffers:{color:i,depth:r,stencil:o},enable:ft,disable:ct,bindFramebuffer:Nt,drawBuffers:Rt,useProgram:Ht,setBlending:Bt,setMaterial:Qt,setFlipSided:Mt,setCullFace:Vt,setLineWidth:Ot,setPolygonOffset:Ct,setScissorTest:ie,activeTexture:C,bindTexture:b,unbindTexture:H,compressedTexImage2D:$,compressedTexImage3D:tt,texImage2D:gt,texImage3D:Ft,updateUBOMapping:Lt,uniformBlockBinding:It,texStorage2D:Pt,texStorage3D:it,texSubImage2D:et,texSubImage3D:vt,compressedTexSubImage2D:ot,compressedTexSubImage3D:rt,scissor:Et,viewport:lt,reset:re}}function Yg(s,t,e,n,i,r,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new Q,h=new WeakMap;let u;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,b){return p?new OffscreenCanvas(C,b):os("canvas")}function _(C,b,H){let $=1;const tt=ie(C);if((tt.width>H||tt.height>H)&&($=H/Math.max(tt.width,tt.height)),$<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const et=Math.floor($*tt.width),vt=Math.floor($*tt.height);u===void 0&&(u=g(et,vt));const ot=b?g(et,vt):u;return ot.width=et,ot.height=vt,ot.getContext("2d").drawImage(C,0,0,et,vt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+tt.width+"x"+tt.height+") to ("+et+"x"+vt+")."),ot}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+tt.width+"x"+tt.height+")."),C;return C}function f(C){return C.generateMipmaps&&C.minFilter!==ke&&C.minFilter!==Ye}function m(C){s.generateMipmap(C)}function x(C,b,H,$,tt=!1){if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let et=b;if(b===s.RED&&(H===s.FLOAT&&(et=s.R32F),H===s.HALF_FLOAT&&(et=s.R16F),H===s.UNSIGNED_BYTE&&(et=s.R8)),b===s.RED_INTEGER&&(H===s.UNSIGNED_BYTE&&(et=s.R8UI),H===s.UNSIGNED_SHORT&&(et=s.R16UI),H===s.UNSIGNED_INT&&(et=s.R32UI),H===s.BYTE&&(et=s.R8I),H===s.SHORT&&(et=s.R16I),H===s.INT&&(et=s.R32I)),b===s.RG&&(H===s.FLOAT&&(et=s.RG32F),H===s.HALF_FLOAT&&(et=s.RG16F),H===s.UNSIGNED_BYTE&&(et=s.RG8)),b===s.RG_INTEGER&&(H===s.UNSIGNED_BYTE&&(et=s.RG8UI),H===s.UNSIGNED_SHORT&&(et=s.RG16UI),H===s.UNSIGNED_INT&&(et=s.RG32UI),H===s.BYTE&&(et=s.RG8I),H===s.SHORT&&(et=s.RG16I),H===s.INT&&(et=s.RG32I)),b===s.RGB&&H===s.UNSIGNED_INT_5_9_9_9_REV&&(et=s.RGB9_E5),b===s.RGBA){const vt=tt?ar:$t.getTransfer($);H===s.FLOAT&&(et=s.RGBA32F),H===s.HALF_FLOAT&&(et=s.RGBA16F),H===s.UNSIGNED_BYTE&&(et=vt===te?s.SRGB8_ALPHA8:s.RGBA8),H===s.UNSIGNED_SHORT_4_4_4_4&&(et=s.RGBA4),H===s.UNSIGNED_SHORT_5_5_5_1&&(et=s.RGB5_A1)}return(et===s.R16F||et===s.R32F||et===s.RG16F||et===s.RG32F||et===s.RGBA16F||et===s.RGBA32F)&&t.get("EXT_color_buffer_float"),et}function v(C,b){let H;return C?b===null||b===Fi||b===Bi?H=s.DEPTH24_STENCIL8:b===An?H=s.DEPTH32F_STENCIL8:b===or&&(H=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):b===null||b===Fi||b===Bi?H=s.DEPTH_COMPONENT24:b===An?H=s.DEPTH_COMPONENT32F:b===or&&(H=s.DEPTH_COMPONENT16),H}function M(C,b){return f(C)===!0||C.isFramebufferTexture&&C.minFilter!==ke&&C.minFilter!==Ye?Math.log2(Math.max(b.width,b.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?b.mipmaps.length:1}function R(C){const b=C.target;b.removeEventListener("dispose",R),A(b),b.isVideoTexture&&h.delete(b)}function w(C){const b=C.target;b.removeEventListener("dispose",w),E(b)}function A(C){const b=n.get(C);if(b.__webglInit===void 0)return;const H=C.source,$=d.get(H);if($){const tt=$[b.__cacheKey];tt.usedTimes--,tt.usedTimes===0&&I(C),Object.keys($).length===0&&d.delete(H)}n.remove(C)}function I(C){const b=n.get(C);s.deleteTexture(b.__webglTexture);const H=C.source,$=d.get(H);delete $[b.__cacheKey],o.memory.textures--}function E(C){const b=n.get(C);if(C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(b.__webglFramebuffer[$]))for(let tt=0;tt<b.__webglFramebuffer[$].length;tt++)s.deleteFramebuffer(b.__webglFramebuffer[$][tt]);else s.deleteFramebuffer(b.__webglFramebuffer[$]);b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer[$])}else{if(Array.isArray(b.__webglFramebuffer))for(let $=0;$<b.__webglFramebuffer.length;$++)s.deleteFramebuffer(b.__webglFramebuffer[$]);else s.deleteFramebuffer(b.__webglFramebuffer);if(b.__webglDepthbuffer&&s.deleteRenderbuffer(b.__webglDepthbuffer),b.__webglMultisampledFramebuffer&&s.deleteFramebuffer(b.__webglMultisampledFramebuffer),b.__webglColorRenderbuffer)for(let $=0;$<b.__webglColorRenderbuffer.length;$++)b.__webglColorRenderbuffer[$]&&s.deleteRenderbuffer(b.__webglColorRenderbuffer[$]);b.__webglDepthRenderbuffer&&s.deleteRenderbuffer(b.__webglDepthRenderbuffer)}const H=C.textures;for(let $=0,tt=H.length;$<tt;$++){const et=n.get(H[$]);et.__webglTexture&&(s.deleteTexture(et.__webglTexture),o.memory.textures--),n.remove(H[$])}n.remove(C)}let y=0;function P(){y=0}function B(){const C=y;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),y+=1,C}function O(C){const b=[];return b.push(C.wrapS),b.push(C.wrapT),b.push(C.wrapR||0),b.push(C.magFilter),b.push(C.minFilter),b.push(C.anisotropy),b.push(C.internalFormat),b.push(C.format),b.push(C.type),b.push(C.generateMipmaps),b.push(C.premultiplyAlpha),b.push(C.flipY),b.push(C.unpackAlignment),b.push(C.colorSpace),b.join()}function Y(C,b){const H=n.get(C);if(C.isVideoTexture&&Ot(C),C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){const $=C.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Wt(H,C,b);return}}e.bindTexture(s.TEXTURE_2D,H.__webglTexture,s.TEXTURE0+b)}function q(C,b){const H=n.get(C);if(C.version>0&&H.__version!==C.version){Wt(H,C,b);return}e.bindTexture(s.TEXTURE_2D_ARRAY,H.__webglTexture,s.TEXTURE0+b)}function G(C,b){const H=n.get(C);if(C.version>0&&H.__version!==C.version){Wt(H,C,b);return}e.bindTexture(s.TEXTURE_3D,H.__webglTexture,s.TEXTURE0+b)}function K(C,b){const H=n.get(C);if(C.version>0&&H.__version!==C.version){j(H,C,b);return}e.bindTexture(s.TEXTURE_CUBE_MAP,H.__webglTexture,s.TEXTURE0+b)}const X={[rr]:s.REPEAT,[Kn]:s.CLAMP_TO_EDGE,[Io]:s.MIRRORED_REPEAT},ut={[ke]:s.NEAREST,[uu]:s.NEAREST_MIPMAP_NEAREST,[Ss]:s.NEAREST_MIPMAP_LINEAR,[Ye]:s.LINEAR,[Or]:s.LINEAR_MIPMAP_NEAREST,[$n]:s.LINEAR_MIPMAP_LINEAR},dt={[Tu]:s.NEVER,[Lu]:s.ALWAYS,[Au]:s.LESS,[Tl]:s.LEQUAL,[wu]:s.EQUAL,[Pu]:s.GEQUAL,[Ru]:s.GREATER,[Cu]:s.NOTEQUAL};function mt(C,b){if(b.type===An&&t.has("OES_texture_float_linear")===!1&&(b.magFilter===Ye||b.magFilter===Or||b.magFilter===Ss||b.magFilter===$n||b.minFilter===Ye||b.minFilter===Or||b.minFilter===Ss||b.minFilter===$n)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,X[b.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,X[b.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,X[b.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,ut[b.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,ut[b.minFilter]),b.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,dt[b.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(b.magFilter===ke||b.minFilter!==Ss&&b.minFilter!==$n||b.type===An&&t.has("OES_texture_float_linear")===!1)return;if(b.anisotropy>1||n.get(b).__currentAnisotropy){const H=t.get("EXT_texture_filter_anisotropic");s.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(b.anisotropy,i.getMaxAnisotropy())),n.get(b).__currentAnisotropy=b.anisotropy}}}function kt(C,b){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,b.addEventListener("dispose",R));const $=b.source;let tt=d.get($);tt===void 0&&(tt={},d.set($,tt));const et=O(b);if(et!==C.__cacheKey){tt[et]===void 0&&(tt[et]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,H=!0),tt[et].usedTimes++;const vt=tt[C.__cacheKey];vt!==void 0&&(tt[C.__cacheKey].usedTimes--,vt.usedTimes===0&&I(b)),C.__cacheKey=et,C.__webglTexture=tt[et].texture}return H}function Wt(C,b,H){let $=s.TEXTURE_2D;(b.isDataArrayTexture||b.isCompressedArrayTexture)&&($=s.TEXTURE_2D_ARRAY),b.isData3DTexture&&($=s.TEXTURE_3D);const tt=kt(C,b),et=b.source;e.bindTexture($,C.__webglTexture,s.TEXTURE0+H);const vt=n.get(et);if(et.version!==vt.__version||tt===!0){e.activeTexture(s.TEXTURE0+H);const ot=$t.getPrimaries($t.workingColorSpace),rt=b.colorSpace===En?null:$t.getPrimaries(b.colorSpace),Pt=b.colorSpace===En||ot===rt?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pt);let it=_(b.image,!1,i.maxTextureSize);it=Ct(b,it);const gt=r.convert(b.format,b.colorSpace),Ft=r.convert(b.type);let Et=x(b.internalFormat,gt,Ft,b.colorSpace,b.isVideoTexture);mt($,b);let lt;const Lt=b.mipmaps,It=b.isVideoTexture!==!0,re=vt.__version===void 0||tt===!0,S=et.dataReady,V=M(b,it);if(b.isDepthTexture)Et=v(b.format===zi,b.type),re&&(It?e.texStorage2D(s.TEXTURE_2D,1,Et,it.width,it.height):e.texImage2D(s.TEXTURE_2D,0,Et,it.width,it.height,0,gt,Ft,null));else if(b.isDataTexture)if(Lt.length>0){It&&re&&e.texStorage2D(s.TEXTURE_2D,V,Et,Lt[0].width,Lt[0].height);for(let F=0,W=Lt.length;F<W;F++)lt=Lt[F],It?S&&e.texSubImage2D(s.TEXTURE_2D,F,0,0,lt.width,lt.height,gt,Ft,lt.data):e.texImage2D(s.TEXTURE_2D,F,Et,lt.width,lt.height,0,gt,Ft,lt.data);b.generateMipmaps=!1}else It?(re&&e.texStorage2D(s.TEXTURE_2D,V,Et,it.width,it.height),S&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,it.width,it.height,gt,Ft,it.data)):e.texImage2D(s.TEXTURE_2D,0,Et,it.width,it.height,0,gt,Ft,it.data);else if(b.isCompressedTexture)if(b.isCompressedArrayTexture){It&&re&&e.texStorage3D(s.TEXTURE_2D_ARRAY,V,Et,Lt[0].width,Lt[0].height,it.depth);for(let F=0,W=Lt.length;F<W;F++)if(lt=Lt[F],b.format!==Ke)if(gt!==null)if(It){if(S)if(b.layerUpdates.size>0){for(const J of b.layerUpdates){const xt=lt.width*lt.height;e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,F,0,0,J,lt.width,lt.height,1,gt,lt.data.slice(xt*J,xt*(J+1)),0,0)}b.clearLayerUpdates()}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,F,0,0,0,lt.width,lt.height,it.depth,gt,lt.data,0,0)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,F,Et,lt.width,lt.height,it.depth,0,lt.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else It?S&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,F,0,0,0,lt.width,lt.height,it.depth,gt,Ft,lt.data):e.texImage3D(s.TEXTURE_2D_ARRAY,F,Et,lt.width,lt.height,it.depth,0,gt,Ft,lt.data)}else{It&&re&&e.texStorage2D(s.TEXTURE_2D,V,Et,Lt[0].width,Lt[0].height);for(let F=0,W=Lt.length;F<W;F++)lt=Lt[F],b.format!==Ke?gt!==null?It?S&&e.compressedTexSubImage2D(s.TEXTURE_2D,F,0,0,lt.width,lt.height,gt,lt.data):e.compressedTexImage2D(s.TEXTURE_2D,F,Et,lt.width,lt.height,0,lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):It?S&&e.texSubImage2D(s.TEXTURE_2D,F,0,0,lt.width,lt.height,gt,Ft,lt.data):e.texImage2D(s.TEXTURE_2D,F,Et,lt.width,lt.height,0,gt,Ft,lt.data)}else if(b.isDataArrayTexture)if(It){if(re&&e.texStorage3D(s.TEXTURE_2D_ARRAY,V,Et,it.width,it.height,it.depth),S)if(b.layerUpdates.size>0){let F;switch(Ft){case s.UNSIGNED_BYTE:switch(gt){case s.ALPHA:F=1;break;case s.LUMINANCE:F=1;break;case s.LUMINANCE_ALPHA:F=2;break;case s.RGB:F=3;break;case s.RGBA:F=4;break;default:throw new Error(`Unknown texel size for format ${gt}.`)}break;case s.UNSIGNED_SHORT_4_4_4_4:case s.UNSIGNED_SHORT_5_5_5_1:case s.UNSIGNED_SHORT_5_6_5:F=1;break;default:throw new Error(`Unknown texel size for type ${Ft}.`)}const W=it.width*it.height*F;for(const J of b.layerUpdates)e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,J,it.width,it.height,1,gt,Ft,it.data.slice(W*J,W*(J+1)));b.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,it.width,it.height,it.depth,gt,Ft,it.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Et,it.width,it.height,it.depth,0,gt,Ft,it.data);else if(b.isData3DTexture)It?(re&&e.texStorage3D(s.TEXTURE_3D,V,Et,it.width,it.height,it.depth),S&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,it.width,it.height,it.depth,gt,Ft,it.data)):e.texImage3D(s.TEXTURE_3D,0,Et,it.width,it.height,it.depth,0,gt,Ft,it.data);else if(b.isFramebufferTexture){if(re)if(It)e.texStorage2D(s.TEXTURE_2D,V,Et,it.width,it.height);else{let F=it.width,W=it.height;for(let J=0;J<V;J++)e.texImage2D(s.TEXTURE_2D,J,Et,F,W,0,gt,Ft,null),F>>=1,W>>=1}}else if(Lt.length>0){if(It&&re){const F=ie(Lt[0]);e.texStorage2D(s.TEXTURE_2D,V,Et,F.width,F.height)}for(let F=0,W=Lt.length;F<W;F++)lt=Lt[F],It?S&&e.texSubImage2D(s.TEXTURE_2D,F,0,0,gt,Ft,lt):e.texImage2D(s.TEXTURE_2D,F,Et,gt,Ft,lt);b.generateMipmaps=!1}else if(It){if(re){const F=ie(it);e.texStorage2D(s.TEXTURE_2D,V,Et,F.width,F.height)}S&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,gt,Ft,it)}else e.texImage2D(s.TEXTURE_2D,0,Et,gt,Ft,it);f(b)&&m($),vt.__version=et.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function j(C,b,H){if(b.image.length!==6)return;const $=kt(C,b),tt=b.source;e.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+H);const et=n.get(tt);if(tt.version!==et.__version||$===!0){e.activeTexture(s.TEXTURE0+H);const vt=$t.getPrimaries($t.workingColorSpace),ot=b.colorSpace===En?null:$t.getPrimaries(b.colorSpace),rt=b.colorSpace===En||vt===ot?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,b.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,b.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,b.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,rt);const Pt=b.isCompressedTexture||b.image[0].isCompressedTexture,it=b.image[0]&&b.image[0].isDataTexture,gt=[];for(let W=0;W<6;W++)!Pt&&!it?gt[W]=_(b.image[W],!0,i.maxCubemapSize):gt[W]=it?b.image[W].image:b.image[W],gt[W]=Ct(b,gt[W]);const Ft=gt[0],Et=r.convert(b.format,b.colorSpace),lt=r.convert(b.type),Lt=x(b.internalFormat,Et,lt,b.colorSpace),It=b.isVideoTexture!==!0,re=et.__version===void 0||$===!0,S=tt.dataReady;let V=M(b,Ft);mt(s.TEXTURE_CUBE_MAP,b);let F;if(Pt){It&&re&&e.texStorage2D(s.TEXTURE_CUBE_MAP,V,Lt,Ft.width,Ft.height);for(let W=0;W<6;W++){F=gt[W].mipmaps;for(let J=0;J<F.length;J++){const xt=F[J];b.format!==Ke?Et!==null?It?S&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,J,0,0,xt.width,xt.height,Et,xt.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,J,Lt,xt.width,xt.height,0,xt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):It?S&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,J,0,0,xt.width,xt.height,Et,lt,xt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,J,Lt,xt.width,xt.height,0,Et,lt,xt.data)}}}else{if(F=b.mipmaps,It&&re){F.length>0&&V++;const W=ie(gt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,V,Lt,W.width,W.height)}for(let W=0;W<6;W++)if(it){It?S&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,0,0,0,gt[W].width,gt[W].height,Et,lt,gt[W].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,0,Lt,gt[W].width,gt[W].height,0,Et,lt,gt[W].data);for(let J=0;J<F.length;J++){const wt=F[J].image[W].image;It?S&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,J+1,0,0,wt.width,wt.height,Et,lt,wt.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,J+1,Lt,wt.width,wt.height,0,Et,lt,wt.data)}}else{It?S&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,0,0,0,Et,lt,gt[W]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,0,Lt,Et,lt,gt[W]);for(let J=0;J<F.length;J++){const xt=F[J];It?S&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,J+1,0,0,Et,lt,xt.image[W]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+W,J+1,Lt,Et,lt,xt.image[W])}}}f(b)&&m(s.TEXTURE_CUBE_MAP),et.__version=tt.version,b.onUpdate&&b.onUpdate(b)}C.__version=b.version}function nt(C,b,H,$,tt,et){const vt=r.convert(H.format,H.colorSpace),ot=r.convert(H.type),rt=x(H.internalFormat,vt,ot,H.colorSpace);if(!n.get(b).__hasExternalTextures){const it=Math.max(1,b.width>>et),gt=Math.max(1,b.height>>et);tt===s.TEXTURE_3D||tt===s.TEXTURE_2D_ARRAY?e.texImage3D(tt,et,rt,it,gt,b.depth,0,vt,ot,null):e.texImage2D(tt,et,rt,it,gt,0,vt,ot,null)}e.bindFramebuffer(s.FRAMEBUFFER,C),Vt(b)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,$,tt,n.get(H).__webglTexture,0,Mt(b)):(tt===s.TEXTURE_2D||tt>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&tt<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,$,tt,n.get(H).__webglTexture,et),e.bindFramebuffer(s.FRAMEBUFFER,null)}function ft(C,b,H){if(s.bindRenderbuffer(s.RENDERBUFFER,C),b.depthBuffer){const $=b.depthTexture,tt=$&&$.isDepthTexture?$.type:null,et=v(b.stencilBuffer,tt),vt=b.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ot=Mt(b);Vt(b)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ot,et,b.width,b.height):H?s.renderbufferStorageMultisample(s.RENDERBUFFER,ot,et,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,et,b.width,b.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,vt,s.RENDERBUFFER,C)}else{const $=b.textures;for(let tt=0;tt<$.length;tt++){const et=$[tt],vt=r.convert(et.format,et.colorSpace),ot=r.convert(et.type),rt=x(et.internalFormat,vt,ot,et.colorSpace),Pt=Mt(b);H&&Vt(b)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,Pt,rt,b.width,b.height):Vt(b)?a.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Pt,rt,b.width,b.height):s.renderbufferStorage(s.RENDERBUFFER,rt,b.width,b.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function ct(C,b){if(b&&b.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(s.FRAMEBUFFER,C),!(b.depthTexture&&b.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(b.depthTexture).__webglTexture||b.depthTexture.image.width!==b.width||b.depthTexture.image.height!==b.height)&&(b.depthTexture.image.width=b.width,b.depthTexture.image.height=b.height,b.depthTexture.needsUpdate=!0),Y(b.depthTexture,0);const $=n.get(b.depthTexture).__webglTexture,tt=Mt(b);if(b.depthTexture.format===Pi)Vt(b)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0,tt):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0);else if(b.depthTexture.format===zi)Vt(b)?a.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0,tt):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Nt(C){const b=n.get(C),H=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!b.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");ct(b.__webglFramebuffer,C)}else if(H){b.__webglDepthbuffer=[];for(let $=0;$<6;$++)e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer[$]),b.__webglDepthbuffer[$]=s.createRenderbuffer(),ft(b.__webglDepthbuffer[$],C,!1)}else e.bindFramebuffer(s.FRAMEBUFFER,b.__webglFramebuffer),b.__webglDepthbuffer=s.createRenderbuffer(),ft(b.__webglDepthbuffer,C,!1);e.bindFramebuffer(s.FRAMEBUFFER,null)}function Rt(C,b,H){const $=n.get(C);b!==void 0&&nt($.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),H!==void 0&&Nt(C)}function Ht(C){const b=C.texture,H=n.get(C),$=n.get(b);C.addEventListener("dispose",w);const tt=C.textures,et=C.isWebGLCubeRenderTarget===!0,vt=tt.length>1;if(vt||($.__webglTexture===void 0&&($.__webglTexture=s.createTexture()),$.__version=b.version,o.memory.textures++),et){H.__webglFramebuffer=[];for(let ot=0;ot<6;ot++)if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer[ot]=[];for(let rt=0;rt<b.mipmaps.length;rt++)H.__webglFramebuffer[ot][rt]=s.createFramebuffer()}else H.__webglFramebuffer[ot]=s.createFramebuffer()}else{if(b.mipmaps&&b.mipmaps.length>0){H.__webglFramebuffer=[];for(let ot=0;ot<b.mipmaps.length;ot++)H.__webglFramebuffer[ot]=s.createFramebuffer()}else H.__webglFramebuffer=s.createFramebuffer();if(vt)for(let ot=0,rt=tt.length;ot<rt;ot++){const Pt=n.get(tt[ot]);Pt.__webglTexture===void 0&&(Pt.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&Vt(C)===!1){H.__webglMultisampledFramebuffer=s.createFramebuffer(),H.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let ot=0;ot<tt.length;ot++){const rt=tt[ot];H.__webglColorRenderbuffer[ot]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,H.__webglColorRenderbuffer[ot]);const Pt=r.convert(rt.format,rt.colorSpace),it=r.convert(rt.type),gt=x(rt.internalFormat,Pt,it,rt.colorSpace,C.isXRRenderTarget===!0),Ft=Mt(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ft,gt,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ot,s.RENDERBUFFER,H.__webglColorRenderbuffer[ot])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=s.createRenderbuffer(),ft(H.__webglDepthRenderbuffer,C,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(et){e.bindTexture(s.TEXTURE_CUBE_MAP,$.__webglTexture),mt(s.TEXTURE_CUBE_MAP,b);for(let ot=0;ot<6;ot++)if(b.mipmaps&&b.mipmaps.length>0)for(let rt=0;rt<b.mipmaps.length;rt++)nt(H.__webglFramebuffer[ot][rt],C,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,rt);else nt(H.__webglFramebuffer[ot],C,b,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ot,0);f(b)&&m(s.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(vt){for(let ot=0,rt=tt.length;ot<rt;ot++){const Pt=tt[ot],it=n.get(Pt);e.bindTexture(s.TEXTURE_2D,it.__webglTexture),mt(s.TEXTURE_2D,Pt),nt(H.__webglFramebuffer,C,Pt,s.COLOR_ATTACHMENT0+ot,s.TEXTURE_2D,0),f(Pt)&&m(s.TEXTURE_2D)}e.unbindTexture()}else{let ot=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ot=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(ot,$.__webglTexture),mt(ot,b),b.mipmaps&&b.mipmaps.length>0)for(let rt=0;rt<b.mipmaps.length;rt++)nt(H.__webglFramebuffer[rt],C,b,s.COLOR_ATTACHMENT0,ot,rt);else nt(H.__webglFramebuffer,C,b,s.COLOR_ATTACHMENT0,ot,0);f(b)&&m(ot),e.unbindTexture()}C.depthBuffer&&Nt(C)}function D(C){const b=C.textures;for(let H=0,$=b.length;H<$;H++){const tt=b[H];if(f(tt)){const et=C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:s.TEXTURE_2D,vt=n.get(tt).__webglTexture;e.bindTexture(et,vt),m(et),e.unbindTexture()}}}const Gt=[],Bt=[];function Qt(C){if(C.samples>0){if(Vt(C)===!1){const b=C.textures,H=C.width,$=C.height;let tt=s.COLOR_BUFFER_BIT;const et=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,vt=n.get(C),ot=b.length>1;if(ot)for(let rt=0;rt<b.length;rt++)e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+rt,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+rt,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let rt=0;rt<b.length;rt++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(tt|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(tt|=s.STENCIL_BUFFER_BIT)),ot){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,vt.__webglColorRenderbuffer[rt]);const Pt=n.get(b[rt]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Pt,0)}s.blitFramebuffer(0,0,H,$,0,0,H,$,tt,s.NEAREST),c===!0&&(Gt.length=0,Bt.length=0,Gt.push(s.COLOR_ATTACHMENT0+rt),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Gt.push(et),Bt.push(et),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,Bt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Gt))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ot)for(let rt=0;rt<b.length;rt++){e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+rt,s.RENDERBUFFER,vt.__webglColorRenderbuffer[rt]);const Pt=n.get(b[rt]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+rt,s.TEXTURE_2D,Pt,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&c){const b=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[b])}}}function Mt(C){return Math.min(i.maxSamples,C.samples)}function Vt(C){const b=n.get(C);return C.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&b.__useRenderToTexture!==!1}function Ot(C){const b=o.render.frame;h.get(C)!==b&&(h.set(C,b),C.update())}function Ct(C,b){const H=C.colorSpace,$=C.format,tt=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==On&&H!==En&&($t.getTransfer(H)===te?($!==Ke||tt!==Un)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),b}function ie(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(l.width=C.naturalWidth||C.width,l.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(l.width=C.displayWidth,l.height=C.displayHeight):(l.width=C.width,l.height=C.height),l}this.allocateTextureUnit=B,this.resetTextureUnits=P,this.setTexture2D=Y,this.setTexture2DArray=q,this.setTexture3D=G,this.setTextureCube=K,this.rebindTextures=Rt,this.setupRenderTarget=Ht,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=Qt,this.setupDepthRenderbuffer=Nt,this.setupFrameBufferTexture=nt,this.useMultisampledRTT=Vt}function Zg(s,t){function e(n,i=En){let r;const o=$t.getTransfer(i);if(n===Un)return s.UNSIGNED_BYTE;if(n===xl)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Sl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===pu)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===du)return s.BYTE;if(n===fu)return s.SHORT;if(n===or)return s.UNSIGNED_SHORT;if(n===vl)return s.INT;if(n===Fi)return s.UNSIGNED_INT;if(n===An)return s.FLOAT;if(n===Sr)return s.HALF_FLOAT;if(n===mu)return s.ALPHA;if(n===gu)return s.RGB;if(n===Ke)return s.RGBA;if(n===_u)return s.LUMINANCE;if(n===vu)return s.LUMINANCE_ALPHA;if(n===Pi)return s.DEPTH_COMPONENT;if(n===zi)return s.DEPTH_STENCIL;if(n===xu)return s.RED;if(n===Ml)return s.RED_INTEGER;if(n===Su)return s.RG;if(n===yl)return s.RG_INTEGER;if(n===bl)return s.RGBA_INTEGER;if(n===Fr||n===Br||n===zr||n===kr)if(o===te)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Fr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===zr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Fr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Br)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===zr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===kr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ca||n===la||n===ha||n===ua)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ca)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===la)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ha)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ua)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===da||n===fa||n===pa)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===da||n===fa)return o===te?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===pa)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ma||n===ga||n===_a||n===va||n===xa||n===Sa||n===Ma||n===ya||n===ba||n===Ea||n===Ta||n===Aa||n===wa||n===Ra)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ma)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===ga)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===_a)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===va)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===xa)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Sa)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Ma)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ya)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ba)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ea)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ta)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Aa)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===wa)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ra)return o===te?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Hr||n===Ca||n===Pa)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===Hr)return o===te?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Ca)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Pa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Mu||n===La||n===Ia||n===Da)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===Hr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===La)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Ia)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Da)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Bi?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}class qg extends Ne{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}}class Xe extends Se{constructor(){super(),this.isGroup=!0,this.type="Group"}}const jg={type:"move"};class fo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xe,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xe,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xe,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(l&&t.hand){o=!0;for(const _ of t.hand.values()){const f=e.getJointPose(_,n),m=this._getHandJoint(l,_);f!==null&&(m.matrix.fromArray(f.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=f.radius),m.visible=f!==null}const h=l.joints["index-finger-tip"],u=l.joints["thumb-tip"],d=h.position.distanceTo(u.position),p=.02,g=.005;l.inputState.pinching&&d>p+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!l.inputState.pinching&&d<=p-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(jg)))}return a!==null&&(a.visible=i!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Xe;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Kg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,$g=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Jg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e,n){if(this.texture===null){const i=new Me,r=t.properties.get(i);r.__webglTexture=e.texture,(e.depthNear!=n.depthNear||e.depthFar!=n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new Nn({vertexShader:Kg,fragmentShader:$g,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Yt(new br(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class Qg extends ni{constructor(t,e){super();const n=this;let i=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,u=null,d=null,p=null,g=null;const _=new Jg,f=e.getContextAttributes();let m=null,x=null;const v=[],M=[],R=new Q;let w=null;const A=new Ne;A.layers.enable(1),A.viewport=new ne;const I=new Ne;I.layers.enable(2),I.viewport=new ne;const E=[A,I],y=new qg;y.layers.enable(1),y.layers.enable(2);let P=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let nt=v[j];return nt===void 0&&(nt=new fo,v[j]=nt),nt.getTargetRaySpace()},this.getControllerGrip=function(j){let nt=v[j];return nt===void 0&&(nt=new fo,v[j]=nt),nt.getGripSpace()},this.getHand=function(j){let nt=v[j];return nt===void 0&&(nt=new fo,v[j]=nt),nt.getHandSpace()};function O(j){const nt=M.indexOf(j.inputSource);if(nt===-1)return;const ft=v[nt];ft!==void 0&&(ft.update(j.inputSource,j.frame,l||o),ft.dispatchEvent({type:j.type,data:j.inputSource}))}function Y(){i.removeEventListener("select",O),i.removeEventListener("selectstart",O),i.removeEventListener("selectend",O),i.removeEventListener("squeeze",O),i.removeEventListener("squeezestart",O),i.removeEventListener("squeezeend",O),i.removeEventListener("end",Y),i.removeEventListener("inputsourceschange",q);for(let j=0;j<v.length;j++){const nt=M[j];nt!==null&&(M[j]=null,v[j].disconnect(nt))}P=null,B=null,_.reset(),t.setRenderTarget(m),p=null,d=null,u=null,i=null,x=null,Wt.stop(),n.isPresenting=!1,t.setPixelRatio(w),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){a=j,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function(j){l=j},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(j){if(i=j,i!==null){if(m=t.getRenderTarget(),i.addEventListener("select",O),i.addEventListener("selectstart",O),i.addEventListener("selectend",O),i.addEventListener("squeeze",O),i.addEventListener("squeezestart",O),i.addEventListener("squeezeend",O),i.addEventListener("end",Y),i.addEventListener("inputsourceschange",q),f.xrCompatible!==!0&&await e.makeXRCompatible(),w=t.getPixelRatio(),t.getSize(R),i.renderState.layers===void 0){const nt={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(i,e,nt),i.updateRenderState({baseLayer:p}),t.setPixelRatio(1),t.setSize(p.framebufferWidth,p.framebufferHeight,!1),x=new Qn(p.framebufferWidth,p.framebufferHeight,{format:Ke,type:Un,colorSpace:t.outputColorSpace,stencilBuffer:f.stencil})}else{let nt=null,ft=null,ct=null;f.depth&&(ct=f.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,nt=f.stencil?zi:Pi,ft=f.stencil?Bi:Fi);const Nt={colorFormat:e.RGBA8,depthFormat:ct,scaleFactor:r};u=new XRWebGLBinding(i,e),d=u.createProjectionLayer(Nt),i.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),x=new Qn(d.textureWidth,d.textureHeight,{format:Ke,type:Un,depthTexture:new Bl(d.textureWidth,d.textureHeight,ft,void 0,void 0,void 0,void 0,void 0,void 0,nt),stencilBuffer:f.stencil,colorSpace:t.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await i.requestReferenceSpace(a),Wt.setContext(i),Wt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode};function q(j){for(let nt=0;nt<j.removed.length;nt++){const ft=j.removed[nt],ct=M.indexOf(ft);ct>=0&&(M[ct]=null,v[ct].disconnect(ft))}for(let nt=0;nt<j.added.length;nt++){const ft=j.added[nt];let ct=M.indexOf(ft);if(ct===-1){for(let Rt=0;Rt<v.length;Rt++)if(Rt>=M.length){M.push(ft),ct=Rt;break}else if(M[Rt]===null){M[Rt]=ft,ct=Rt;break}if(ct===-1)break}const Nt=v[ct];Nt&&Nt.connect(ft)}}const G=new L,K=new L;function X(j,nt,ft){G.setFromMatrixPosition(nt.matrixWorld),K.setFromMatrixPosition(ft.matrixWorld);const ct=G.distanceTo(K),Nt=nt.projectionMatrix.elements,Rt=ft.projectionMatrix.elements,Ht=Nt[14]/(Nt[10]-1),D=Nt[14]/(Nt[10]+1),Gt=(Nt[9]+1)/Nt[5],Bt=(Nt[9]-1)/Nt[5],Qt=(Nt[8]-1)/Nt[0],Mt=(Rt[8]+1)/Rt[0],Vt=Ht*Qt,Ot=Ht*Mt,Ct=ct/(-Qt+Mt),ie=Ct*-Qt;nt.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(ie),j.translateZ(Ct),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert();const C=Ht+Ct,b=D+Ct,H=Vt-ie,$=Ot+(ct-ie),tt=Gt*D/b*C,et=Bt*D/b*C;j.projectionMatrix.makePerspective(H,$,tt,et,C,b),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}function ut(j,nt){nt===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices(nt.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(i===null)return;_.texture!==null&&(j.near=_.depthNear,j.far=_.depthFar),y.near=I.near=A.near=j.near,y.far=I.far=A.far=j.far,(P!==y.near||B!==y.far)&&(i.updateRenderState({depthNear:y.near,depthFar:y.far}),P=y.near,B=y.far,A.near=P,A.far=B,I.near=P,I.far=B,A.updateProjectionMatrix(),I.updateProjectionMatrix(),j.updateProjectionMatrix());const nt=j.parent,ft=y.cameras;ut(y,nt);for(let ct=0;ct<ft.length;ct++)ut(ft[ct],nt);ft.length===2?X(y,A,I):y.projectionMatrix.copy(A.projectionMatrix),dt(j,y,nt)};function dt(j,nt,ft){ft===null?j.matrix.copy(nt.matrixWorld):(j.matrix.copy(ft.matrixWorld),j.matrix.invert(),j.matrix.multiply(nt.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy(nt.projectionMatrix),j.projectionMatrixInverse.copy(nt.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=rs*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&p===null))return c},this.setFoveation=function(j){c=j,d!==null&&(d.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let mt=null;function kt(j,nt){if(h=nt.getViewerPose(l||o),g=nt,h!==null){const ft=h.views;p!==null&&(t.setRenderTargetFramebuffer(x,p.framebuffer),t.setRenderTarget(x));let ct=!1;ft.length!==y.cameras.length&&(y.cameras.length=0,ct=!0);for(let Rt=0;Rt<ft.length;Rt++){const Ht=ft[Rt];let D=null;if(p!==null)D=p.getViewport(Ht);else{const Bt=u.getViewSubImage(d,Ht);D=Bt.viewport,Rt===0&&(t.setRenderTargetTextures(x,Bt.colorTexture,d.ignoreDepthValues?void 0:Bt.depthStencilTexture),t.setRenderTarget(x))}let Gt=E[Rt];Gt===void 0&&(Gt=new Ne,Gt.layers.enable(Rt),Gt.viewport=new ne,E[Rt]=Gt),Gt.matrix.fromArray(Ht.transform.matrix),Gt.matrix.decompose(Gt.position,Gt.quaternion,Gt.scale),Gt.projectionMatrix.fromArray(Ht.projectionMatrix),Gt.projectionMatrixInverse.copy(Gt.projectionMatrix).invert(),Gt.viewport.set(D.x,D.y,D.width,D.height),Rt===0&&(y.matrix.copy(Gt.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ct===!0&&y.cameras.push(Gt)}const Nt=i.enabledFeatures;if(Nt&&Nt.includes("depth-sensing")){const Rt=u.getDepthInformation(ft[0]);Rt&&Rt.isValid&&Rt.texture&&_.init(t,Rt,i.renderState)}}for(let ft=0;ft<v.length;ft++){const ct=M[ft],Nt=v[ft];ct!==null&&Nt!==void 0&&Nt.update(ct,nt,l||o)}mt&&mt(j,nt),nt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:nt}),g=null}const Wt=new Ol;Wt.setAnimationLoop(kt),this.setAnimationLoop=function(j){mt=j},this.dispose=function(){}}}const Xn=new Je,t_=new ee;function e_(s,t){function e(f,m){f.matrixAutoUpdate===!0&&f.updateMatrix(),m.value.copy(f.matrix)}function n(f,m){m.color.getRGB(f.fogColor.value,Dl(s)),m.isFog?(f.fogNear.value=m.near,f.fogFar.value=m.far):m.isFogExp2&&(f.fogDensity.value=m.density)}function i(f,m,x,v,M){m.isMeshBasicMaterial||m.isMeshLambertMaterial?r(f,m):m.isMeshToonMaterial?(r(f,m),u(f,m)):m.isMeshPhongMaterial?(r(f,m),h(f,m)):m.isMeshStandardMaterial?(r(f,m),d(f,m),m.isMeshPhysicalMaterial&&p(f,m,M)):m.isMeshMatcapMaterial?(r(f,m),g(f,m)):m.isMeshDepthMaterial?r(f,m):m.isMeshDistanceMaterial?(r(f,m),_(f,m)):m.isMeshNormalMaterial?r(f,m):m.isLineBasicMaterial?(o(f,m),m.isLineDashedMaterial&&a(f,m)):m.isPointsMaterial?c(f,m,x,v):m.isSpriteMaterial?l(f,m):m.isShadowMaterial?(f.color.value.copy(m.color),f.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(f,m){f.opacity.value=m.opacity,m.color&&f.diffuse.value.copy(m.color),m.emissive&&f.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(f.map.value=m.map,e(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,e(m.alphaMap,f.alphaMapTransform)),m.bumpMap&&(f.bumpMap.value=m.bumpMap,e(m.bumpMap,f.bumpMapTransform),f.bumpScale.value=m.bumpScale,m.side===Re&&(f.bumpScale.value*=-1)),m.normalMap&&(f.normalMap.value=m.normalMap,e(m.normalMap,f.normalMapTransform),f.normalScale.value.copy(m.normalScale),m.side===Re&&f.normalScale.value.negate()),m.displacementMap&&(f.displacementMap.value=m.displacementMap,e(m.displacementMap,f.displacementMapTransform),f.displacementScale.value=m.displacementScale,f.displacementBias.value=m.displacementBias),m.emissiveMap&&(f.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,f.emissiveMapTransform)),m.specularMap&&(f.specularMap.value=m.specularMap,e(m.specularMap,f.specularMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest);const x=t.get(m),v=x.envMap,M=x.envMapRotation;v&&(f.envMap.value=v,Xn.copy(M),Xn.x*=-1,Xn.y*=-1,Xn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Xn.y*=-1,Xn.z*=-1),f.envMapRotation.value.setFromMatrix4(t_.makeRotationFromEuler(Xn)),f.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=m.reflectivity,f.ior.value=m.ior,f.refractionRatio.value=m.refractionRatio),m.lightMap&&(f.lightMap.value=m.lightMap,f.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,f.lightMapTransform)),m.aoMap&&(f.aoMap.value=m.aoMap,f.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,f.aoMapTransform))}function o(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,m.map&&(f.map.value=m.map,e(m.map,f.mapTransform))}function a(f,m){f.dashSize.value=m.dashSize,f.totalSize.value=m.dashSize+m.gapSize,f.scale.value=m.scale}function c(f,m,x,v){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.size.value=m.size*x,f.scale.value=v*.5,m.map&&(f.map.value=m.map,e(m.map,f.uvTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,e(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function l(f,m){f.diffuse.value.copy(m.color),f.opacity.value=m.opacity,f.rotation.value=m.rotation,m.map&&(f.map.value=m.map,e(m.map,f.mapTransform)),m.alphaMap&&(f.alphaMap.value=m.alphaMap,e(m.alphaMap,f.alphaMapTransform)),m.alphaTest>0&&(f.alphaTest.value=m.alphaTest)}function h(f,m){f.specular.value.copy(m.specular),f.shininess.value=Math.max(m.shininess,1e-4)}function u(f,m){m.gradientMap&&(f.gradientMap.value=m.gradientMap)}function d(f,m){f.metalness.value=m.metalness,m.metalnessMap&&(f.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,f.metalnessMapTransform)),f.roughness.value=m.roughness,m.roughnessMap&&(f.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,f.roughnessMapTransform)),m.envMap&&(f.envMapIntensity.value=m.envMapIntensity)}function p(f,m,x){f.ior.value=m.ior,m.sheen>0&&(f.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),f.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(f.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,f.sheenColorMapTransform)),m.sheenRoughnessMap&&(f.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,f.sheenRoughnessMapTransform))),m.clearcoat>0&&(f.clearcoat.value=m.clearcoat,f.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(f.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,f.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(f.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Re&&f.clearcoatNormalScale.value.negate())),m.dispersion>0&&(f.dispersion.value=m.dispersion),m.iridescence>0&&(f.iridescence.value=m.iridescence,f.iridescenceIOR.value=m.iridescenceIOR,f.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(f.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,f.iridescenceMapTransform)),m.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),m.transmission>0&&(f.transmission.value=m.transmission,f.transmissionSamplerMap.value=x.texture,f.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(f.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,f.transmissionMapTransform)),f.thickness.value=m.thickness,m.thicknessMap&&(f.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=m.attenuationDistance,f.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(f.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(f.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=m.specularIntensity,f.specularColor.value.copy(m.specularColor),m.specularColorMap&&(f.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,f.specularColorMapTransform)),m.specularIntensityMap&&(f.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,m){m.matcap&&(f.matcap.value=m.matcap)}function _(f,m){const x=t.get(m).light;f.referencePosition.value.setFromMatrixPosition(x.matrixWorld),f.nearDistance.value=x.shadow.camera.near,f.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function n_(s,t,e,n){let i={},r={},o=[];const a=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,v){const M=v.program;n.uniformBlockBinding(x,M)}function l(x,v){let M=i[x.id];M===void 0&&(g(x),M=h(x),i[x.id]=M,x.addEventListener("dispose",f));const R=v.program;n.updateUBOMapping(x,R);const w=t.render.frame;r[x.id]!==w&&(d(x),r[x.id]=w)}function h(x){const v=u();x.__bindingPointIndex=v;const M=s.createBuffer(),R=x.__size,w=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,R,w),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,v,M),M}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(x){const v=i[x.id],M=x.uniforms,R=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,v);for(let w=0,A=M.length;w<A;w++){const I=Array.isArray(M[w])?M[w]:[M[w]];for(let E=0,y=I.length;E<y;E++){const P=I[E];if(p(P,w,E,R)===!0){const B=P.__offset,O=Array.isArray(P.value)?P.value:[P.value];let Y=0;for(let q=0;q<O.length;q++){const G=O[q],K=_(G);typeof G=="number"||typeof G=="boolean"?(P.__data[0]=G,s.bufferSubData(s.UNIFORM_BUFFER,B+Y,P.__data)):G.isMatrix3?(P.__data[0]=G.elements[0],P.__data[1]=G.elements[1],P.__data[2]=G.elements[2],P.__data[3]=0,P.__data[4]=G.elements[3],P.__data[5]=G.elements[4],P.__data[6]=G.elements[5],P.__data[7]=0,P.__data[8]=G.elements[6],P.__data[9]=G.elements[7],P.__data[10]=G.elements[8],P.__data[11]=0):(G.toArray(P.__data,Y),Y+=K.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,B,P.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function p(x,v,M,R){const w=x.value,A=v+"_"+M;if(R[A]===void 0)return typeof w=="number"||typeof w=="boolean"?R[A]=w:R[A]=w.clone(),!0;{const I=R[A];if(typeof w=="number"||typeof w=="boolean"){if(I!==w)return R[A]=w,!0}else if(I.equals(w)===!1)return I.copy(w),!0}return!1}function g(x){const v=x.uniforms;let M=0;const R=16;for(let A=0,I=v.length;A<I;A++){const E=Array.isArray(v[A])?v[A]:[v[A]];for(let y=0,P=E.length;y<P;y++){const B=E[y],O=Array.isArray(B.value)?B.value:[B.value];for(let Y=0,q=O.length;Y<q;Y++){const G=O[Y],K=_(G),X=M%R;X!==0&&R-X<K.boundary&&(M+=R-X),B.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),B.__offset=M,M+=K.storage}}}const w=M%R;return w>0&&(M+=R-w),x.__size=M,x.__cache={},this}function _(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function f(x){const v=x.target;v.removeEventListener("dispose",f);const M=o.indexOf(v.__bindingPointIndex);o.splice(M,1),s.deleteBuffer(i[v.id]),delete i[v.id],delete r[v.id]}function m(){for(const x in i)s.deleteBuffer(i[x]);o=[],i={},r={}}return{bind:c,update:l,dispose:m}}class i_{constructor(t={}){const{canvas:e=qu(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1}=t;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const p=new Uint32Array(4),g=new Int32Array(4);let _=null,f=null;const m=[],x=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=qe,this.toneMapping=Ln,this.toneMappingExposure=1;const v=this;let M=!1,R=0,w=0,A=null,I=-1,E=null;const y=new ne,P=new ne;let B=null;const O=new bt(0);let Y=0,q=e.width,G=e.height,K=1,X=null,ut=null;const dt=new ne(0,0,q,G),mt=new ne(0,0,q,G);let kt=!1;const Wt=new Wo;let j=!1,nt=!1;const ft=new ee,ct=new L,Nt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Rt=!1;function Ht(){return A===null?K:1}let D=n;function Gt(T,U){return e.getContext(T,U)}try{const T={alpha:!0,depth:i,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${zo}`),e.addEventListener("webglcontextlost",V,!1),e.addEventListener("webglcontextrestored",F,!1),e.addEventListener("webglcontextcreationerror",W,!1),D===null){const U="webgl2";if(D=Gt(U,T),D===null)throw Gt(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Bt,Qt,Mt,Vt,Ot,Ct,ie,C,b,H,$,tt,et,vt,ot,rt,Pt,it,gt,Ft,Et,lt,Lt,It;function re(){Bt=new um(D),Bt.init(),lt=new Zg(D,Bt),Qt=new rm(D,Bt,t,lt),Mt=new Xg(D),Vt=new pm(D),Ot=new Lg,Ct=new Yg(D,Bt,Mt,Ot,Qt,lt,Vt),ie=new am(v),C=new hm(v),b=new Sd(D),Lt=new im(D,b),H=new dm(D,b,Vt,Lt),$=new gm(D,H,b,Vt),gt=new mm(D,Qt,Ct),rt=new om(Ot),tt=new Pg(v,ie,C,Bt,Qt,Lt,rt),et=new e_(v,Ot),vt=new Dg,ot=new zg(Bt),it=new nm(v,ie,C,Mt,$,d,c),Pt=new Wg(v,$,Qt),It=new n_(D,Vt,Qt,Mt),Ft=new sm(D,Bt,Vt),Et=new fm(D,Bt,Vt),Vt.programs=tt.programs,v.capabilities=Qt,v.extensions=Bt,v.properties=Ot,v.renderLists=vt,v.shadowMap=Pt,v.state=Mt,v.info=Vt}re();const S=new Qg(v,D);this.xr=S,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const T=Bt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Bt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(T){T!==void 0&&(K=T,this.setSize(q,G,!1))},this.getSize=function(T){return T.set(q,G)},this.setSize=function(T,U,z=!0){if(S.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=T,G=U,e.width=Math.floor(T*K),e.height=Math.floor(U*K),z===!0&&(e.style.width=T+"px",e.style.height=U+"px"),this.setViewport(0,0,T,U)},this.getDrawingBufferSize=function(T){return T.set(q*K,G*K).floor()},this.setDrawingBufferSize=function(T,U,z){q=T,G=U,K=z,e.width=Math.floor(T*z),e.height=Math.floor(U*z),this.setViewport(0,0,T,U)},this.getCurrentViewport=function(T){return T.copy(y)},this.getViewport=function(T){return T.copy(dt)},this.setViewport=function(T,U,z,k){T.isVector4?dt.set(T.x,T.y,T.z,T.w):dt.set(T,U,z,k),Mt.viewport(y.copy(dt).multiplyScalar(K).round())},this.getScissor=function(T){return T.copy(mt)},this.setScissor=function(T,U,z,k){T.isVector4?mt.set(T.x,T.y,T.z,T.w):mt.set(T,U,z,k),Mt.scissor(P.copy(mt).multiplyScalar(K).round())},this.getScissorTest=function(){return kt},this.setScissorTest=function(T){Mt.setScissorTest(kt=T)},this.setOpaqueSort=function(T){X=T},this.setTransparentSort=function(T){ut=T},this.getClearColor=function(T){return T.copy(it.getClearColor())},this.setClearColor=function(){it.setClearColor.apply(it,arguments)},this.getClearAlpha=function(){return it.getClearAlpha()},this.setClearAlpha=function(){it.setClearAlpha.apply(it,arguments)},this.clear=function(T=!0,U=!0,z=!0){let k=0;if(T){let N=!1;if(A!==null){const st=A.texture.format;N=st===bl||st===yl||st===Ml}if(N){const st=A.texture.type,ht=st===Un||st===Fi||st===or||st===Bi||st===xl||st===Sl,pt=it.getClearColor(),_t=it.getClearAlpha(),Tt=pt.r,At=pt.g,yt=pt.b;ht?(p[0]=Tt,p[1]=At,p[2]=yt,p[3]=_t,D.clearBufferuiv(D.COLOR,0,p)):(g[0]=Tt,g[1]=At,g[2]=yt,g[3]=_t,D.clearBufferiv(D.COLOR,0,g))}else k|=D.COLOR_BUFFER_BIT}U&&(k|=D.DEPTH_BUFFER_BIT),z&&(k|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",V,!1),e.removeEventListener("webglcontextrestored",F,!1),e.removeEventListener("webglcontextcreationerror",W,!1),vt.dispose(),ot.dispose(),Ot.dispose(),ie.dispose(),C.dispose(),$.dispose(),Lt.dispose(),It.dispose(),tt.dispose(),S.dispose(),S.removeEventListener("sessionstart",he),S.removeEventListener("sessionend",ue),Pe.stop()};function V(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function F(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const T=Vt.autoReset,U=Pt.enabled,z=Pt.autoUpdate,k=Pt.needsUpdate,N=Pt.type;re(),Vt.autoReset=T,Pt.enabled=U,Pt.autoUpdate=z,Pt.needsUpdate=k,Pt.type=N}function W(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function J(T){const U=T.target;U.removeEventListener("dispose",J),xt(U)}function xt(T){wt(T),Ot.remove(T)}function wt(T){const U=Ot.get(T).programs;U!==void 0&&(U.forEach(function(z){tt.releaseProgram(z)}),T.isShaderMaterial&&tt.releaseShaderCache(T))}this.renderBufferDirect=function(T,U,z,k,N,st){U===null&&(U=Nt);const ht=N.isMesh&&N.matrixWorld.determinant()<0,pt=Mh(T,U,z,k,N);Mt.setMaterial(k,ht);let _t=z.index,Tt=1;if(k.wireframe===!0){if(_t=H.getWireframeAttribute(z),_t===void 0)return;Tt=2}const At=z.drawRange,yt=z.attributes.position;let Zt=At.start*Tt,ae=(At.start+At.count)*Tt;st!==null&&(Zt=Math.max(Zt,st.start*Tt),ae=Math.min(ae,(st.start+st.count)*Tt)),_t!==null?(Zt=Math.max(Zt,0),ae=Math.min(ae,_t.count)):yt!=null&&(Zt=Math.max(Zt,0),ae=Math.min(ae,yt.count));const ce=ae-Zt;if(ce<0||ce===1/0)return;Lt.setup(N,k,pt,z,_t);let Ie,jt=Ft;if(_t!==null&&(Ie=b.get(_t),jt=Et,jt.setIndex(Ie)),N.isMesh)k.wireframe===!0?(Mt.setLineWidth(k.wireframeLinewidth*Ht()),jt.setMode(D.LINES)):jt.setMode(D.TRIANGLES);else if(N.isLine){let St=k.linewidth;St===void 0&&(St=1),Mt.setLineWidth(St*Ht()),N.isLineSegments?jt.setMode(D.LINES):N.isLineLoop?jt.setMode(D.LINE_LOOP):jt.setMode(D.LINE_STRIP)}else N.isPoints?jt.setMode(D.POINTS):N.isSprite&&jt.setMode(D.TRIANGLES);if(N.isBatchedMesh)N._multiDrawInstances!==null?jt.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances):jt.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else if(N.isInstancedMesh)jt.renderInstances(Zt,ce,N.count);else if(z.isInstancedBufferGeometry){const St=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,Ee=Math.min(z.instanceCount,St);jt.renderInstances(Zt,ce,Ee)}else jt.render(Zt,ce)};function oe(T,U,z){T.transparent===!0&&T.side===we&&T.forceSinglePass===!1?(T.side=Re,T.needsUpdate=!0,vs(T,U,z),T.side=Dn,T.needsUpdate=!0,vs(T,U,z),T.side=we):vs(T,U,z)}this.compile=function(T,U,z=null){z===null&&(z=T),f=ot.get(z),f.init(U),x.push(f),z.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),T!==z&&T.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(f.pushLight(N),N.castShadow&&f.pushShadow(N))}),f.setupLights();const k=new Set;return T.traverse(function(N){const st=N.material;if(st)if(Array.isArray(st))for(let ht=0;ht<st.length;ht++){const pt=st[ht];oe(pt,z,N),k.add(pt)}else oe(st,z,N),k.add(st)}),x.pop(),f=null,k},this.compileAsync=function(T,U,z=null){const k=this.compile(T,U,z);return new Promise(N=>{function st(){if(k.forEach(function(ht){Ot.get(ht).currentProgram.isReady()&&k.delete(ht)}),k.size===0){N(T);return}setTimeout(st,10)}Bt.get("KHR_parallel_shader_compile")!==null?st():setTimeout(st,10)})};let le=null;function Xt(T){le&&le(T)}function he(){Pe.stop()}function ue(){Pe.start()}const Pe=new Ol;Pe.setAnimationLoop(Xt),typeof self<"u"&&Pe.setContext(self),this.setAnimationLoop=function(T){le=T,S.setAnimationLoop(T),T===null?Pe.stop():Pe.start()},S.addEventListener("sessionstart",he),S.addEventListener("sessionend",ue),this.render=function(T,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),S.enabled===!0&&S.isPresenting===!0&&(S.cameraAutoUpdate===!0&&S.updateCamera(U),U=S.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,U,A),f=ot.get(T,x.length),f.init(U),x.push(f),ft.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Wt.setFromProjectionMatrix(ft),nt=this.localClippingEnabled,j=rt.init(this.clippingPlanes,nt),_=vt.get(T,m.length),_.init(),m.push(_),S.enabled===!0&&S.isPresenting===!0){const st=v.xr.getDepthSensingMesh();st!==null&&Le(st,U,-1/0,v.sortObjects)}Le(T,U,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(X,ut),Rt=S.enabled===!1||S.isPresenting===!1||S.hasDepthSensing()===!1,Rt&&it.addToRenderList(_,T),this.info.render.frame++,j===!0&&rt.beginShadows();const z=f.state.shadowsArray;Pt.render(z,T,U),j===!0&&rt.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=_.opaque,N=_.transmissive;if(f.setupLights(),U.isArrayCamera){const st=U.cameras;if(N.length>0)for(let ht=0,pt=st.length;ht<pt;ht++){const _t=st[ht];Fn(k,N,T,_t)}Rt&&it.render(T);for(let ht=0,pt=st.length;ht<pt;ht++){const _t=st[ht];pn(_,T,_t,_t.viewport)}}else N.length>0&&Fn(k,N,T,U),Rt&&it.render(T),pn(_,T,U);A!==null&&(Ct.updateMultisampleRenderTarget(A),Ct.updateRenderTargetMipmap(A)),T.isScene===!0&&T.onAfterRender(v,T,U),Lt.resetDefaultState(),I=-1,E=null,x.pop(),x.length>0?(f=x[x.length-1],j===!0&&rt.setGlobalState(v.clippingPlanes,f.state.camera)):f=null,m.pop(),m.length>0?_=m[m.length-1]:_=null};function Le(T,U,z,k){if(T.visible===!1)return;if(T.layers.test(U.layers)){if(T.isGroup)z=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(U);else if(T.isLight)f.pushLight(T),T.castShadow&&f.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Wt.intersectsSprite(T)){k&&ct.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ft);const ht=$.update(T),pt=T.material;pt.visible&&_.push(T,ht,pt,z,ct.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Wt.intersectsObject(T))){const ht=$.update(T),pt=T.material;if(k&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),ct.copy(T.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),ct.copy(ht.boundingSphere.center)),ct.applyMatrix4(T.matrixWorld).applyMatrix4(ft)),Array.isArray(pt)){const _t=ht.groups;for(let Tt=0,At=_t.length;Tt<At;Tt++){const yt=_t[Tt],Zt=pt[yt.materialIndex];Zt&&Zt.visible&&_.push(T,ht,Zt,z,ct.z,yt)}}else pt.visible&&_.push(T,ht,pt,z,ct.z,null)}}const st=T.children;for(let ht=0,pt=st.length;ht<pt;ht++)Le(st[ht],U,z,k)}function pn(T,U,z,k){const N=T.opaque,st=T.transmissive,ht=T.transparent;f.setupLightsView(z),j===!0&&rt.setGlobalState(v.clippingPlanes,z),k&&Mt.viewport(y.copy(k)),N.length>0&&Bn(N,U,z),st.length>0&&Bn(st,U,z),ht.length>0&&Bn(ht,U,z),Mt.buffers.depth.setTest(!0),Mt.buffers.depth.setMask(!0),Mt.buffers.color.setMask(!0),Mt.setPolygonOffset(!1)}function Fn(T,U,z,k){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[k.id]===void 0&&(f.state.transmissionRenderTarget[k.id]=new Qn(1,1,{generateMipmaps:!0,type:Bt.has("EXT_color_buffer_half_float")||Bt.has("EXT_color_buffer_float")?Sr:Un,minFilter:$n,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:$t.workingColorSpace}));const st=f.state.transmissionRenderTarget[k.id],ht=k.viewport||y;st.setSize(ht.z,ht.w);const pt=v.getRenderTarget();v.setRenderTarget(st),v.getClearColor(O),Y=v.getClearAlpha(),Y<1&&v.setClearColor(16777215,.5),Rt?it.render(z):v.clear();const _t=v.toneMapping;v.toneMapping=Ln;const Tt=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),f.setupLightsView(k),j===!0&&rt.setGlobalState(v.clippingPlanes,k),Bn(T,z,k),Ct.updateMultisampleRenderTarget(st),Ct.updateRenderTargetMipmap(st),Bt.has("WEBGL_multisampled_render_to_texture")===!1){let At=!1;for(let yt=0,Zt=U.length;yt<Zt;yt++){const ae=U[yt],ce=ae.object,Ie=ae.geometry,jt=ae.material,St=ae.group;if(jt.side===we&&ce.layers.test(k.layers)){const Ee=jt.side;jt.side=Re,jt.needsUpdate=!0,ta(ce,z,k,Ie,jt,St),jt.side=Ee,jt.needsUpdate=!0,At=!0}}At===!0&&(Ct.updateMultisampleRenderTarget(st),Ct.updateRenderTargetMipmap(st))}v.setRenderTarget(pt),v.setClearColor(O,Y),Tt!==void 0&&(k.viewport=Tt),v.toneMapping=_t}function Bn(T,U,z){const k=U.isScene===!0?U.overrideMaterial:null;for(let N=0,st=T.length;N<st;N++){const ht=T[N],pt=ht.object,_t=ht.geometry,Tt=k===null?ht.material:k,At=ht.group;pt.layers.test(z.layers)&&ta(pt,U,z,_t,Tt,At)}}function ta(T,U,z,k,N,st){T.onBeforeRender(v,U,z,k,N,st),T.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),N.onBeforeRender(v,U,z,k,T,st),N.transparent===!0&&N.side===we&&N.forceSinglePass===!1?(N.side=Re,N.needsUpdate=!0,v.renderBufferDirect(z,U,k,N,T,st),N.side=Dn,N.needsUpdate=!0,v.renderBufferDirect(z,U,k,N,T,st),N.side=we):v.renderBufferDirect(z,U,k,N,T,st),T.onAfterRender(v,U,z,k,N,st)}function vs(T,U,z){U.isScene!==!0&&(U=Nt);const k=Ot.get(T),N=f.state.lights,st=f.state.shadowsArray,ht=N.state.version,pt=tt.getParameters(T,N.state,st,U,z),_t=tt.getProgramCacheKey(pt);let Tt=k.programs;k.environment=T.isMeshStandardMaterial?U.environment:null,k.fog=U.fog,k.envMap=(T.isMeshStandardMaterial?C:ie).get(T.envMap||k.environment),k.envMapRotation=k.environment!==null&&T.envMap===null?U.environmentRotation:T.envMapRotation,Tt===void 0&&(T.addEventListener("dispose",J),Tt=new Map,k.programs=Tt);let At=Tt.get(_t);if(At!==void 0){if(k.currentProgram===At&&k.lightsStateVersion===ht)return na(T,pt),At}else pt.uniforms=tt.getUniforms(T),T.onBuild(z,pt,v),T.onBeforeCompile(pt,v),At=tt.acquireProgram(pt,_t),Tt.set(_t,At),k.uniforms=pt.uniforms;const yt=k.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(yt.clippingPlanes=rt.uniform),na(T,pt),k.needsLights=bh(T),k.lightsStateVersion=ht,k.needsLights&&(yt.ambientLightColor.value=N.state.ambient,yt.lightProbe.value=N.state.probe,yt.directionalLights.value=N.state.directional,yt.directionalLightShadows.value=N.state.directionalShadow,yt.spotLights.value=N.state.spot,yt.spotLightShadows.value=N.state.spotShadow,yt.rectAreaLights.value=N.state.rectArea,yt.ltc_1.value=N.state.rectAreaLTC1,yt.ltc_2.value=N.state.rectAreaLTC2,yt.pointLights.value=N.state.point,yt.pointLightShadows.value=N.state.pointShadow,yt.hemisphereLights.value=N.state.hemi,yt.directionalShadowMap.value=N.state.directionalShadowMap,yt.directionalShadowMatrix.value=N.state.directionalShadowMatrix,yt.spotShadowMap.value=N.state.spotShadowMap,yt.spotLightMatrix.value=N.state.spotLightMatrix,yt.spotLightMap.value=N.state.spotLightMap,yt.pointShadowMap.value=N.state.pointShadowMap,yt.pointShadowMatrix.value=N.state.pointShadowMatrix),k.currentProgram=At,k.uniformsList=null,At}function ea(T){if(T.uniformsList===null){const U=T.currentProgram.getUniforms();T.uniformsList=ir.seqWithValue(U.seq,T.uniforms)}return T.uniformsList}function na(T,U){const z=Ot.get(T);z.outputColorSpace=U.outputColorSpace,z.batching=U.batching,z.batchingColor=U.batchingColor,z.instancing=U.instancing,z.instancingColor=U.instancingColor,z.instancingMorph=U.instancingMorph,z.skinning=U.skinning,z.morphTargets=U.morphTargets,z.morphNormals=U.morphNormals,z.morphColors=U.morphColors,z.morphTargetsCount=U.morphTargetsCount,z.numClippingPlanes=U.numClippingPlanes,z.numIntersection=U.numClipIntersection,z.vertexAlphas=U.vertexAlphas,z.vertexTangents=U.vertexTangents,z.toneMapping=U.toneMapping}function Mh(T,U,z,k,N){U.isScene!==!0&&(U=Nt),Ct.resetTextureUnits();const st=U.fog,ht=k.isMeshStandardMaterial?U.environment:null,pt=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:On,_t=(k.isMeshStandardMaterial?C:ie).get(k.envMap||ht),Tt=k.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,At=!!z.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),yt=!!z.morphAttributes.position,Zt=!!z.morphAttributes.normal,ae=!!z.morphAttributes.color;let ce=Ln;k.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ce=v.toneMapping);const Ie=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,jt=Ie!==void 0?Ie.length:0,St=Ot.get(k),Ee=f.state.lights;if(j===!0&&(nt===!0||T!==E)){const Oe=T===E&&k.id===I;rt.setState(k,T,Oe)}let Jt=!1;k.version===St.__version?(St.needsLights&&St.lightsStateVersion!==Ee.state.version||St.outputColorSpace!==pt||N.isBatchedMesh&&St.batching===!1||!N.isBatchedMesh&&St.batching===!0||N.isBatchedMesh&&St.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&St.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&St.instancing===!1||!N.isInstancedMesh&&St.instancing===!0||N.isSkinnedMesh&&St.skinning===!1||!N.isSkinnedMesh&&St.skinning===!0||N.isInstancedMesh&&St.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&St.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&St.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&St.instancingMorph===!1&&N.morphTexture!==null||St.envMap!==_t||k.fog===!0&&St.fog!==st||St.numClippingPlanes!==void 0&&(St.numClippingPlanes!==rt.numPlanes||St.numIntersection!==rt.numIntersection)||St.vertexAlphas!==Tt||St.vertexTangents!==At||St.morphTargets!==yt||St.morphNormals!==Zt||St.morphColors!==ae||St.toneMapping!==ce||St.morphTargetsCount!==jt)&&(Jt=!0):(Jt=!0,St.__version=k.version);let tn=St.currentProgram;Jt===!0&&(tn=vs(k,U,N));let xs=!1,zn=!1,Dr=!1;const ge=tn.getUniforms(),mn=St.uniforms;if(Mt.useProgram(tn.program)&&(xs=!0,zn=!0,Dr=!0),k.id!==I&&(I=k.id,zn=!0),xs||E!==T){ge.setValue(D,"projectionMatrix",T.projectionMatrix),ge.setValue(D,"viewMatrix",T.matrixWorldInverse);const Oe=ge.map.cameraPosition;Oe!==void 0&&Oe.setValue(D,ct.setFromMatrixPosition(T.matrixWorld)),Qt.logarithmicDepthBuffer&&ge.setValue(D,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&ge.setValue(D,"isOrthographic",T.isOrthographicCamera===!0),E!==T&&(E=T,zn=!0,Dr=!0)}if(N.isSkinnedMesh){ge.setOptional(D,N,"bindMatrix"),ge.setOptional(D,N,"bindMatrixInverse");const Oe=N.skeleton;Oe&&(Oe.boneTexture===null&&Oe.computeBoneTexture(),ge.setValue(D,"boneTexture",Oe.boneTexture,Ct))}N.isBatchedMesh&&(ge.setOptional(D,N,"batchingTexture"),ge.setValue(D,"batchingTexture",N._matricesTexture,Ct),ge.setOptional(D,N,"batchingColorTexture"),N._colorsTexture!==null&&ge.setValue(D,"batchingColorTexture",N._colorsTexture,Ct));const Ur=z.morphAttributes;if((Ur.position!==void 0||Ur.normal!==void 0||Ur.color!==void 0)&&gt.update(N,z,tn),(zn||St.receiveShadow!==N.receiveShadow)&&(St.receiveShadow=N.receiveShadow,ge.setValue(D,"receiveShadow",N.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(mn.envMap.value=_t,mn.flipEnvMap.value=_t.isCubeTexture&&_t.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&U.environment!==null&&(mn.envMapIntensity.value=U.environmentIntensity),zn&&(ge.setValue(D,"toneMappingExposure",v.toneMappingExposure),St.needsLights&&yh(mn,Dr),st&&k.fog===!0&&et.refreshFogUniforms(mn,st),et.refreshMaterialUniforms(mn,k,K,G,f.state.transmissionRenderTarget[T.id]),ir.upload(D,ea(St),mn,Ct)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(ir.upload(D,ea(St),mn,Ct),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&ge.setValue(D,"center",N.center),ge.setValue(D,"modelViewMatrix",N.modelViewMatrix),ge.setValue(D,"normalMatrix",N.normalMatrix),ge.setValue(D,"modelMatrix",N.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Oe=k.uniformsGroups;for(let Nr=0,Eh=Oe.length;Nr<Eh;Nr++){const ia=Oe[Nr];It.update(ia,tn),It.bind(ia,tn)}}return tn}function yh(T,U){T.ambientLightColor.needsUpdate=U,T.lightProbe.needsUpdate=U,T.directionalLights.needsUpdate=U,T.directionalLightShadows.needsUpdate=U,T.pointLights.needsUpdate=U,T.pointLightShadows.needsUpdate=U,T.spotLights.needsUpdate=U,T.spotLightShadows.needsUpdate=U,T.rectAreaLights.needsUpdate=U,T.hemisphereLights.needsUpdate=U}function bh(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(T,U,z){Ot.get(T.texture).__webglTexture=U,Ot.get(T.depthTexture).__webglTexture=z;const k=Ot.get(T);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=z===void 0,k.__autoAllocateDepthBuffer||Bt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,U){const z=Ot.get(T);z.__webglFramebuffer=U,z.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(T,U=0,z=0){A=T,R=U,w=z;let k=!0,N=null,st=!1,ht=!1;if(T){const _t=Ot.get(T);_t.__useDefaultFramebuffer!==void 0?(Mt.bindFramebuffer(D.FRAMEBUFFER,null),k=!1):_t.__webglFramebuffer===void 0?Ct.setupRenderTarget(T):_t.__hasExternalTextures&&Ct.rebindTextures(T,Ot.get(T.texture).__webglTexture,Ot.get(T.depthTexture).__webglTexture);const Tt=T.texture;(Tt.isData3DTexture||Tt.isDataArrayTexture||Tt.isCompressedArrayTexture)&&(ht=!0);const At=Ot.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(At[U])?N=At[U][z]:N=At[U],st=!0):T.samples>0&&Ct.useMultisampledRTT(T)===!1?N=Ot.get(T).__webglMultisampledFramebuffer:Array.isArray(At)?N=At[z]:N=At,y.copy(T.viewport),P.copy(T.scissor),B=T.scissorTest}else y.copy(dt).multiplyScalar(K).floor(),P.copy(mt).multiplyScalar(K).floor(),B=kt;if(Mt.bindFramebuffer(D.FRAMEBUFFER,N)&&k&&Mt.drawBuffers(T,N),Mt.viewport(y),Mt.scissor(P),Mt.setScissorTest(B),st){const _t=Ot.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,_t.__webglTexture,z)}else if(ht){const _t=Ot.get(T.texture),Tt=U||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,_t.__webglTexture,z||0,Tt)}I=-1},this.readRenderTargetPixels=function(T,U,z,k,N,st,ht){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let pt=Ot.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ht!==void 0&&(pt=pt[ht]),pt){Mt.bindFramebuffer(D.FRAMEBUFFER,pt);try{const _t=T.texture,Tt=_t.format,At=_t.type;if(!Qt.textureFormatReadable(Tt)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Qt.textureTypeReadable(At)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=T.width-k&&z>=0&&z<=T.height-N&&D.readPixels(U,z,k,N,lt.convert(Tt),lt.convert(At),st)}finally{const _t=A!==null?Ot.get(A).__webglFramebuffer:null;Mt.bindFramebuffer(D.FRAMEBUFFER,_t)}}},this.readRenderTargetPixelsAsync=async function(T,U,z,k,N,st,ht){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let pt=Ot.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&ht!==void 0&&(pt=pt[ht]),pt){Mt.bindFramebuffer(D.FRAMEBUFFER,pt);try{const _t=T.texture,Tt=_t.format,At=_t.type;if(!Qt.textureFormatReadable(Tt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Qt.textureTypeReadable(At))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=T.width-k&&z>=0&&z<=T.height-N){const yt=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,yt),D.bufferData(D.PIXEL_PACK_BUFFER,st.byteLength,D.STREAM_READ),D.readPixels(U,z,k,N,lt.convert(Tt),lt.convert(At),0),D.flush();const Zt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);await ju(D,Zt,4);try{D.bindBuffer(D.PIXEL_PACK_BUFFER,yt),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,st)}finally{D.deleteBuffer(yt),D.deleteSync(Zt)}return st}}finally{const _t=A!==null?Ot.get(A).__webglFramebuffer:null;Mt.bindFramebuffer(D.FRAMEBUFFER,_t)}}},this.copyFramebufferToTexture=function(T,U=null,z=0){T.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,T=arguments[1]);const k=Math.pow(2,-z),N=Math.floor(T.image.width*k),st=Math.floor(T.image.height*k),ht=U!==null?U.x:0,pt=U!==null?U.y:0;Ct.setTexture2D(T,0),D.copyTexSubImage2D(D.TEXTURE_2D,z,0,0,ht,pt,N,st),Mt.unbindTexture()},this.copyTextureToTexture=function(T,U,z=null,k=null,N=0){T.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,T=arguments[1],U=arguments[2],N=arguments[3]||0,z=null);let st,ht,pt,_t,Tt,At;z!==null?(st=z.max.x-z.min.x,ht=z.max.y-z.min.y,pt=z.min.x,_t=z.min.y):(st=T.image.width,ht=T.image.height,pt=0,_t=0),k!==null?(Tt=k.x,At=k.y):(Tt=0,At=0);const yt=lt.convert(U.format),Zt=lt.convert(U.type);Ct.setTexture2D(U,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);const ae=D.getParameter(D.UNPACK_ROW_LENGTH),ce=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Ie=D.getParameter(D.UNPACK_SKIP_PIXELS),jt=D.getParameter(D.UNPACK_SKIP_ROWS),St=D.getParameter(D.UNPACK_SKIP_IMAGES),Ee=T.isCompressedTexture?T.mipmaps[N]:T.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,Ee.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Ee.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,pt),D.pixelStorei(D.UNPACK_SKIP_ROWS,_t),T.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,N,Tt,At,st,ht,yt,Zt,Ee.data):T.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,N,Tt,At,Ee.width,Ee.height,yt,Ee.data):D.texSubImage2D(D.TEXTURE_2D,N,Tt,At,yt,Zt,Ee),D.pixelStorei(D.UNPACK_ROW_LENGTH,ae),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ce),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ie),D.pixelStorei(D.UNPACK_SKIP_ROWS,jt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,St),N===0&&U.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),Mt.unbindTexture()},this.copyTextureToTexture3D=function(T,U,z=null,k=null,N=0){T.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),z=arguments[0]||null,k=arguments[1]||null,T=arguments[2],U=arguments[3],N=arguments[4]||0);let st,ht,pt,_t,Tt,At,yt,Zt,ae;const ce=T.isCompressedTexture?T.mipmaps[N]:T.image;z!==null?(st=z.max.x-z.min.x,ht=z.max.y-z.min.y,pt=z.max.z-z.min.z,_t=z.min.x,Tt=z.min.y,At=z.min.z):(st=ce.width,ht=ce.height,pt=ce.depth,_t=0,Tt=0,At=0),k!==null?(yt=k.x,Zt=k.y,ae=k.z):(yt=0,Zt=0,ae=0);const Ie=lt.convert(U.format),jt=lt.convert(U.type);let St;if(U.isData3DTexture)Ct.setTexture3D(U,0),St=D.TEXTURE_3D;else if(U.isDataArrayTexture||U.isCompressedArrayTexture)Ct.setTexture2DArray(U,0),St=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);const Ee=D.getParameter(D.UNPACK_ROW_LENGTH),Jt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),tn=D.getParameter(D.UNPACK_SKIP_PIXELS),xs=D.getParameter(D.UNPACK_SKIP_ROWS),zn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,ce.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ce.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,_t),D.pixelStorei(D.UNPACK_SKIP_ROWS,Tt),D.pixelStorei(D.UNPACK_SKIP_IMAGES,At),T.isDataTexture||T.isData3DTexture?D.texSubImage3D(St,N,yt,Zt,ae,st,ht,pt,Ie,jt,ce.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(St,N,yt,Zt,ae,st,ht,pt,Ie,ce.data):D.texSubImage3D(St,N,yt,Zt,ae,st,ht,pt,Ie,jt,ce),D.pixelStorei(D.UNPACK_ROW_LENGTH,Ee),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Jt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,tn),D.pixelStorei(D.UNPACK_SKIP_ROWS,xs),D.pixelStorei(D.UNPACK_SKIP_IMAGES,zn),N===0&&U.generateMipmaps&&D.generateMipmap(St),Mt.unbindTexture()},this.initRenderTarget=function(T){Ot.get(T).__webglFramebuffer===void 0&&Ct.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?Ct.setTextureCube(T,0):T.isData3DTexture?Ct.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?Ct.setTexture2DArray(T,0):Ct.setTexture2D(T,0),Mt.unbindTexture()},this.resetState=function(){R=0,w=0,A=null,Mt.reset(),Lt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=t===ko?"display-p3":"srgb",e.unpackColorSpace=$t.workingColorSpace===Mr?"display-p3":"srgb"}}class s_ extends Se{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Je,this.environmentIntensity=1,this.environmentRotation=new Je,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}class r_{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Do,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=$e()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return Go("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let i=0,r=this.stride;i<r;i++)this.array[t+i]=e.array[n+i];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$e()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=$e()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Te=new L;class ur{constructor(t,e,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyMatrix4(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.applyNormalMatrix(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Te.fromBufferAttribute(this,e),Te.transformDirection(t),this.setXYZ(e,Te.x,Te.y,Te.z);return this}getComponent(t,e){let n=this.array[t*this.data.stride+this.offset+e];return this.normalized&&(n=Ze(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Kt(n,this.array)),this.data.array[t*this.data.stride+this.offset+e]=n,this}setX(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Kt(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=Ze(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=Ze(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=Ze(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=Ze(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,i){return t=t*this.data.stride+this.offset,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),i=Kt(i,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Kt(e,this.array),n=Kt(n,this.array),i=Kt(i,this.array),r=Kt(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=i,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return new Ce(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new ur(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const e=[];for(let n=0;n<this.count;n++){const i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class No extends ii{constructor(t){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new bt(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.rotation=t.rotation,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}let Mi;const qi=new L,yi=new L,bi=new L,Ei=new Q,ji=new Q,Wl=new ee,Gs=new L,Ki=new L,Vs=new L,Ec=new Q,po=new Q,Tc=new Q;class mo extends Se{constructor(t=new No){if(super(),this.isSprite=!0,this.type="Sprite",Mi===void 0){Mi=new qt;const e=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new r_(e,5);Mi.setIndex([0,1,2,0,2,3]),Mi.setAttribute("position",new ur(n,3,0,!1)),Mi.setAttribute("uv",new ur(n,2,3,!1))}this.geometry=Mi,this.material=t,this.center=new Q(.5,.5)}raycast(t,e){t.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),yi.setFromMatrixScale(this.matrixWorld),Wl.copy(t.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(t.camera.matrixWorldInverse,this.matrixWorld),bi.setFromMatrixPosition(this.modelViewMatrix),t.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&yi.multiplyScalar(-bi.z);const n=this.material.rotation;let i,r;n!==0&&(r=Math.cos(n),i=Math.sin(n));const o=this.center;Ws(Gs.set(-.5,-.5,0),bi,o,yi,i,r),Ws(Ki.set(.5,-.5,0),bi,o,yi,i,r),Ws(Vs.set(.5,.5,0),bi,o,yi,i,r),Ec.set(0,0),po.set(1,0),Tc.set(1,1);let a=t.ray.intersectTriangle(Gs,Ki,Vs,!1,qi);if(a===null&&(Ws(Ki.set(-.5,.5,0),bi,o,yi,i,r),po.set(0,1),a=t.ray.intersectTriangle(Gs,Vs,Ki,!1,qi),a===null))return;const c=t.ray.origin.distanceTo(qi);c<t.near||c>t.far||e.push({distance:c,point:qi.clone(),uv:Be.getInterpolation(qi,Gs,Ki,Vs,Ec,po,Tc,new Q),face:null,object:this})}copy(t,e){return super.copy(t,e),t.center!==void 0&&this.center.copy(t.center),this.material=t.material,this}}function Ws(s,t,e,n,i,r){Ei.subVectors(s,e).addScalar(.5).multiply(n),i!==void 0?(ji.x=r*Ei.x-i*Ei.y,ji.y=i*Ei.x+r*Ei.y):ji.copy(Ei),s.copy(t),s.x+=ji.x,s.y+=ji.y,s.applyMatrix4(Wl)}class dn extends ii{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new bt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const dr=new L,fr=new L,Ac=new ee,$i=new Vo,Xs=new yr,go=new L,wc=new L;class o_ extends Se{constructor(t=new qt,e=new dn){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)dr.fromBufferAttribute(e,i-1),fr.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=dr.distanceTo(fr);t.setAttribute("lineDistance",new zt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Xs.copy(n.boundingSphere),Xs.applyMatrix4(i),Xs.radius+=r,t.ray.intersectsSphere(Xs)===!1)return;Ac.copy(i).invert(),$i.copy(t.ray).applyMatrix4(Ac);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,d=n.attributes.position;if(h!==null){const p=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=p,f=g-1;_<f;_+=l){const m=h.getX(_),x=h.getX(_+1),v=Ys(this,t,$i,c,m,x);v&&e.push(v)}if(this.isLineLoop){const _=h.getX(g-1),f=h.getX(p),m=Ys(this,t,$i,c,_,f);m&&e.push(m)}}else{const p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=p,f=g-1;_<f;_+=l){const m=Ys(this,t,$i,c,_,_+1);m&&e.push(m)}if(this.isLineLoop){const _=Ys(this,t,$i,c,g-1,p);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){const a=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function Ys(s,t,e,n,i,r){const o=s.geometry.attributes.position;if(dr.fromBufferAttribute(o,i),fr.fromBufferAttribute(o,r),e.distanceSqToSegment(dr,fr,go,wc)>n)return;go.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(go);if(!(c<t.near||c>t.far))return{distance:c,point:wc.clone().applyMatrix4(s.matrixWorld),index:i,face:null,faceIndex:null,object:s}}const Rc=new L,Cc=new L;class fn extends o_{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)Rc.fromBufferAttribute(e,i),Cc.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Rc.distanceTo(Cc);t.setAttribute("lineDistance",new zt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class Oo extends Me{constructor(t,e,n,i,r,o,a,c,l){super(t,e,n,i,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Qe{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){const n=this.getLengths();let i=0;const r=n.length;let o;e?o=e:o=t*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(i=Math.floor(a+(c-a)/2),l=n[i]-o,l<0)a=i+1;else if(l>0)c=i-1;else{c=i;break}if(i=c,n[i]===o)return i/(r-1);const h=n[i],d=n[i+1]-h,p=(o-h)/d;return(i+p)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const o=this.getPoint(i),a=this.getPoint(r),c=e||(o.isVector2?new Q:new L);return c.copy(a).sub(o).normalize(),c}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){const n=new L,i=[],r=[],o=[],a=new L,c=new ee;for(let p=0;p<=t;p++){const g=p/t;i[p]=this.getTangentAt(g,new L)}r[0]=new L,o[0]=new L;let l=Number.MAX_VALUE;const h=Math.abs(i[0].x),u=Math.abs(i[0].y),d=Math.abs(i[0].z);h<=l&&(l=h,n.set(1,0,0)),u<=l&&(l=u,n.set(0,1,0)),d<=l&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],a),o[0].crossVectors(i[0],r[0]);for(let p=1;p<=t;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(i[p-1],i[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(xe(i[p-1].dot(i[p]),-1,1));r[p].applyMatrix4(c.makeRotationAxis(a,g))}o[p].crossVectors(i[p],r[p])}if(e===!0){let p=Math.acos(xe(r[0].dot(r[t]),-1,1));p/=t,i[0].dot(a.crossVectors(r[0],r[t]))>0&&(p=-p);for(let g=1;g<=t;g++)r[g].applyMatrix4(c.makeRotationAxis(i[g],p*g)),o[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class Yo extends Qe{constructor(t=0,e=0,n=1,i=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(t,e=new Q){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(o?r=0:r=i),this.aClockwise===!0&&!o&&(r===i?r=-i:r=r-i);const a=this.aStartAngle+t*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=c-this.aX,p=l-this.aY;c=d*h-p*u+this.aX,l=d*u+p*h+this.aY}return n.set(c,l)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class a_ extends Yo{constructor(t,e,n,i,r,o){super(t,e,n,n,i,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Zo(){let s=0,t=0,e=0,n=0;function i(r,o,a,c){s=r,t=a,e=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){i(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,u){let d=(o-r)/l-(a-r)/(l+h)+(a-o)/h,p=(a-o)/h-(c-o)/(h+u)+(c-a)/u;d*=h,p*=h,i(o,a,d,p)},calc:function(r){const o=r*r,a=o*r;return s+t*r+e*o+n*a}}}const Zs=new L,_o=new Zo,vo=new Zo,xo=new Zo;class c_ extends Qe{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new L){const n=e,i=this.points,r=i.length,o=(r-(this.closed?0:1))*t;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=i[(a-1)%r]:(Zs.subVectors(i[0],i[1]).add(i[0]),l=Zs);const u=i[a%r],d=i[(a+1)%r];if(this.closed||a+2<r?h=i[(a+2)%r]:(Zs.subVectors(i[r-1],i[r-2]).add(i[r-1]),h=Zs),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(u),p),_=Math.pow(u.distanceToSquared(d),p),f=Math.pow(d.distanceToSquared(h),p);_<1e-4&&(_=1),g<1e-4&&(g=_),f<1e-4&&(f=_),_o.initNonuniformCatmullRom(l.x,u.x,d.x,h.x,g,_,f),vo.initNonuniformCatmullRom(l.y,u.y,d.y,h.y,g,_,f),xo.initNonuniformCatmullRom(l.z,u.z,d.z,h.z,g,_,f)}else this.curveType==="catmullrom"&&(_o.initCatmullRom(l.x,u.x,d.x,h.x,this.tension),vo.initCatmullRom(l.y,u.y,d.y,h.y,this.tension),xo.initCatmullRom(l.z,u.z,d.z,h.z,this.tension));return n.set(_o.calc(c),vo.calc(c),xo.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new L().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Pc(s,t,e,n,i){const r=(n-t)*.5,o=(i-e)*.5,a=s*s,c=s*a;return(2*e-2*n+r+o)*c+(-3*e+3*n-2*r-o)*a+r*s+e}function l_(s,t){const e=1-s;return e*e*t}function h_(s,t){return 2*(1-s)*s*t}function u_(s,t){return s*s*t}function es(s,t,e,n){return l_(s,t)+h_(s,e)+u_(s,n)}function d_(s,t){const e=1-s;return e*e*e*t}function f_(s,t){const e=1-s;return 3*e*e*s*t}function p_(s,t){return 3*(1-s)*s*s*t}function m_(s,t){return s*s*s*t}function ns(s,t,e,n,i){return d_(s,t)+f_(s,e)+p_(s,n)+m_(s,i)}class Xl extends Qe{constructor(t=new Q,e=new Q,n=new Q,i=new Q){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new Q){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ns(t,i.x,r.x,o.x,a.x),ns(t,i.y,r.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class g_ extends Qe{constructor(t=new L,e=new L,n=new L,i=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new L){const n=e,i=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ns(t,i.x,r.x,o.x,a.x),ns(t,i.y,r.y,o.y,a.y),ns(t,i.z,r.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Yl extends Qe{constructor(t=new Q,e=new Q){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Q){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Q){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class __ extends Qe{constructor(t=new L,e=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new L){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new L){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Zl extends Qe{constructor(t=new Q,e=new Q,n=new Q){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Q){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(es(t,i.x,r.x,o.x),es(t,i.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class v_ extends Qe{constructor(t=new L,e=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new L){const n=e,i=this.v0,r=this.v1,o=this.v2;return n.set(es(t,i.x,r.x,o.x),es(t,i.y,r.y,o.y),es(t,i.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ql extends Qe{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Q){const n=e,i=this.points,r=(i.length-1)*t,o=Math.floor(r),a=r-o,c=i[o===0?o:o-1],l=i[o],h=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(Pc(a,c.x,l.x,h.x,u.x),Pc(a,c.y,l.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new Q().fromArray(i))}return this}}var Lc=Object.freeze({__proto__:null,ArcCurve:a_,CatmullRomCurve3:c_,CubicBezierCurve:Xl,CubicBezierCurve3:g_,EllipseCurve:Yo,LineCurve:Yl,LineCurve3:__,QuadraticBezierCurve:Zl,QuadraticBezierCurve3:v_,SplineCurve:ql});class x_ extends Qe{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Lc[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const o=i[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const o=r[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new Lc[i.type]().fromJSON(i))}return this}}class as extends x_{constructor(t){super(),this.type="Path",this.currentPoint=new Q,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Yl(this.currentPoint.clone(),new Q(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new Zl(this.currentPoint.clone(),new Q(t,e),new Q(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,o){const a=new Xl(this.currentPoint.clone(),new Q(t,e),new Q(n,i),new Q(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new ql(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+a,e+c,n,i,r,o),this}absarc(t,e,n,i,r,o){return this.absellipse(t,e,n,n,i,r,o),this}ellipse(t,e,n,i,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+l,e+h,n,i,r,o,a,c),this}absellipse(t,e,n,i,r,o,a,c){const l=new Yo(t,e,n,i,r,o,a,c);if(this.curves.length>0){const u=l.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class wn extends qt{constructor(t=1,e=1,n=1,i=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;i=Math.floor(i),r=Math.floor(r);const h=[],u=[],d=[],p=[];let g=0;const _=[],f=n/2;let m=0;x(),o===!1&&(t>0&&v(!0),e>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new zt(u,3)),this.setAttribute("normal",new zt(d,3)),this.setAttribute("uv",new zt(p,2));function x(){const M=new L,R=new L;let w=0;const A=(e-t)/n;for(let I=0;I<=r;I++){const E=[],y=I/r,P=y*(e-t)+t;for(let B=0;B<=i;B++){const O=B/i,Y=O*c+a,q=Math.sin(Y),G=Math.cos(Y);R.x=P*q,R.y=-y*n+f,R.z=P*G,u.push(R.x,R.y,R.z),M.set(q,A,G).normalize(),d.push(M.x,M.y,M.z),p.push(O,1-y),E.push(g++)}_.push(E)}for(let I=0;I<i;I++)for(let E=0;E<r;E++){const y=_[E][I],P=_[E+1][I],B=_[E+1][I+1],O=_[E][I+1];h.push(y,P,O),h.push(P,B,O),w+=6}l.addGroup(m,w,0),m+=w}function v(M){const R=g,w=new Q,A=new L;let I=0;const E=M===!0?t:e,y=M===!0?1:-1;for(let B=1;B<=i;B++)u.push(0,f*y,0),d.push(0,y,0),p.push(.5,.5),g++;const P=g;for(let B=0;B<=i;B++){const Y=B/i*c+a,q=Math.cos(Y),G=Math.sin(Y);A.x=E*G,A.y=f*y,A.z=E*q,u.push(A.x,A.y,A.z),d.push(0,y,0),w.x=q*.5+.5,w.y=G*.5*y+.5,p.push(w.x,w.y),g++}for(let B=0;B<i;B++){const O=R+B,Y=P+B;M===!0?h.push(Y,Y+1,O):h.push(Y+1,Y,O),I+=3}l.addGroup(m,I,M===!0?1:2),m+=I}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wn(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}const qs=new L,js=new L,So=new L,Ks=new Be;class Ic extends qt{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const i=Math.pow(10,4),r=Math.cos(Li*e),o=t.getIndex(),a=t.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],u=new Array(3),d={},p=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:f,c:m}=Ks;if(_.fromBufferAttribute(a,l[0]),f.fromBufferAttribute(a,l[1]),m.fromBufferAttribute(a,l[2]),Ks.getNormal(So),u[0]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,u[1]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,u[2]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,!(u[0]===u[1]||u[1]===u[2]||u[2]===u[0]))for(let x=0;x<3;x++){const v=(x+1)%3,M=u[x],R=u[v],w=Ks[h[x]],A=Ks[h[v]],I=`${M}_${R}`,E=`${R}_${M}`;E in d&&d[E]?(So.dot(d[E].normal)<=r&&(p.push(w.x,w.y,w.z),p.push(A.x,A.y,A.z)),d[E]=null):I in d||(d[I]={index0:l[x],index1:l[v],normal:So.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:f}=d[g];qs.fromBufferAttribute(a,_),js.fromBufferAttribute(a,f),p.push(qs.x,qs.y,qs.z),p.push(js.x,js.y,js.z)}this.setAttribute("position",new zt(p,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class Tr extends as{constructor(t){super(t),this.uuid=$e(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(new as().fromJSON(i))}return this}}const S_={triangulate:function(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let r=jl(s,0,i,e,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,u,d,p;if(n&&(r=T_(s,t,r,e)),s.length>80*e){a=l=s[0],c=h=s[1];for(let g=e;g<i;g+=e)u=s[g],d=s[g+1],u<a&&(a=u),d<c&&(c=d),u>l&&(l=u),d>h&&(h=d);p=Math.max(l-a,h-c),p=p!==0?32767/p:0}return cs(r,o,e,a,c,p,0),o}};function jl(s,t,e,n,i){let r,o;if(i===O_(s,t,e,n)>0)for(r=t;r<e;r+=n)o=Dc(r,s[r],s[r+1],o);else for(r=e-n;r>=t;r-=n)o=Dc(r,s[r],s[r+1],o);return o&&Ar(o,o.next)&&(hs(o),o=o.next),o}function ei(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Ar(e,e.next)||se(e.prev,e,e.next)===0)){if(hs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function cs(s,t,e,n,i,r,o){if(!s)return;!o&&r&&P_(s,n,i,r);let a=s,c,l;for(;s.prev!==s.next;){if(c=s.prev,l=s.next,r?y_(s,n,i,r):M_(s)){t.push(c.i/e|0),t.push(s.i/e|0),t.push(l.i/e|0),hs(s),s=l.next,a=l.next;continue}if(s=l,s===a){o?o===1?(s=b_(ei(s),t,e),cs(s,t,e,n,i,r,2)):o===2&&E_(s,t,e,n,i,r):cs(ei(s),t,e,n,i,r,1);break}}}function M_(s){const t=s.prev,e=s,n=s.next;if(se(t,e,n)>=0)return!1;const i=t.x,r=e.x,o=n.x,a=t.y,c=e.y,l=n.y,h=i<r?i<o?i:o:r<o?r:o,u=a<c?a<l?a:l:c<l?c:l,d=i>r?i>o?i:o:r>o?r:o,p=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==t;){if(g.x>=h&&g.x<=d&&g.y>=u&&g.y<=p&&wi(i,a,r,c,o,l,g.x,g.y)&&se(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function y_(s,t,e,n){const i=s.prev,r=s,o=s.next;if(se(i,r,o)>=0)return!1;const a=i.x,c=r.x,l=o.x,h=i.y,u=r.y,d=o.y,p=a<c?a<l?a:l:c<l?c:l,g=h<u?h<d?h:d:u<d?u:d,_=a>c?a>l?a:l:c>l?c:l,f=h>u?h>d?h:d:u>d?u:d,m=Fo(p,g,t,e,n),x=Fo(_,f,t,e,n);let v=s.prevZ,M=s.nextZ;for(;v&&v.z>=m&&M&&M.z<=x;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=f&&v!==i&&v!==o&&wi(a,h,c,u,l,d,v.x,v.y)&&se(v.prev,v,v.next)>=0||(v=v.prevZ,M.x>=p&&M.x<=_&&M.y>=g&&M.y<=f&&M!==i&&M!==o&&wi(a,h,c,u,l,d,M.x,M.y)&&se(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;v&&v.z>=m;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=f&&v!==i&&v!==o&&wi(a,h,c,u,l,d,v.x,v.y)&&se(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;M&&M.z<=x;){if(M.x>=p&&M.x<=_&&M.y>=g&&M.y<=f&&M!==i&&M!==o&&wi(a,h,c,u,l,d,M.x,M.y)&&se(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function b_(s,t,e){let n=s;do{const i=n.prev,r=n.next.next;!Ar(i,r)&&Kl(i,n,n.next,r)&&ls(i,r)&&ls(r,i)&&(t.push(i.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),hs(n),hs(n.next),n=s=r),n=n.next}while(n!==s);return ei(n)}function E_(s,t,e,n,i,r){let o=s;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&D_(o,a)){let c=$l(o,a);o=ei(o,o.next),c=ei(c,c.next),cs(o,t,e,n,i,r,0),cs(c,t,e,n,i,r,0);return}a=a.next}o=o.next}while(o!==s)}function T_(s,t,e,n){const i=[];let r,o,a,c,l;for(r=0,o=t.length;r<o;r++)a=t[r]*n,c=r<o-1?t[r+1]*n:s.length,l=jl(s,a,c,n,!1),l===l.next&&(l.steiner=!0),i.push(I_(l));for(i.sort(A_),r=0;r<i.length;r++)e=w_(i[r],e);return e}function A_(s,t){return s.x-t.x}function w_(s,t){const e=R_(s,t);if(!e)return t;const n=$l(e,s);return ei(n,n.next),ei(e,e.next)}function R_(s,t){let e=t,n=-1/0,i;const r=s.x,o=s.y;do{if(o<=e.y&&o>=e.next.y&&e.next.y!==e.y){const d=e.x+(o-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(d<=r&&d>n&&(n=d,i=e.x<e.next.x?e:e.next,d===r))return i}e=e.next}while(e!==t);if(!i)return null;const a=i,c=i.x,l=i.y;let h=1/0,u;e=i;do r>=e.x&&e.x>=c&&r!==e.x&&wi(o<l?r:n,o,c,l,o<l?n:r,o,e.x,e.y)&&(u=Math.abs(o-e.y)/(r-e.x),ls(e,s)&&(u<h||u===h&&(e.x>i.x||e.x===i.x&&C_(i,e)))&&(i=e,h=u)),e=e.next;while(e!==a);return i}function C_(s,t){return se(s.prev,s,t.prev)<0&&se(t.next,s,s.next)<0}function P_(s,t,e,n){let i=s;do i.z===0&&(i.z=Fo(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,L_(i)}function L_(s){let t,e,n,i,r,o,a,c,l=1;do{for(e=s,s=null,r=null,o=0;e;){for(o++,n=e,a=0,t=0;t<l&&(a++,n=n.nextZ,!!n);t++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||e.z<=n.z)?(i=e,e=e.nextZ,a--):(i=n,n=n.nextZ,c--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;e=n}r.nextZ=null,l*=2}while(o>1);return s}function Fo(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function I_(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function wi(s,t,e,n,i,r,o,a){return(i-o)*(t-a)>=(s-o)*(r-a)&&(s-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(r-a)>=(i-o)*(n-a)}function D_(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!U_(s,t)&&(ls(s,t)&&ls(t,s)&&N_(s,t)&&(se(s.prev,s,t.prev)||se(s,t.prev,t))||Ar(s,t)&&se(s.prev,s,s.next)>0&&se(t.prev,t,t.next)>0)}function se(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Ar(s,t){return s.x===t.x&&s.y===t.y}function Kl(s,t,e,n){const i=Js(se(s,t,e)),r=Js(se(s,t,n)),o=Js(se(e,n,s)),a=Js(se(e,n,t));return!!(i!==r&&o!==a||i===0&&$s(s,e,t)||r===0&&$s(s,n,t)||o===0&&$s(e,s,n)||a===0&&$s(e,t,n))}function $s(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Js(s){return s>0?1:s<0?-1:0}function U_(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&Kl(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function ls(s,t){return se(s.prev,s,s.next)<0?se(s,t,s.next)>=0&&se(s,s.prev,t)>=0:se(s,t,s.prev)<0||se(s,s.next,t)<0}function N_(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function $l(s,t){const e=new Bo(s.i,s.x,s.y),n=new Bo(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Dc(s,t,e,n){const i=new Bo(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function hs(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function Bo(s,t,e){this.i=s,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function O_(s,t,e,n){let i=0;for(let r=t,o=e-n;r<e;r+=n)i+=(s[o]-s[r])*(s[r+1]+s[o+1]),o=r;return i}class is{static area(t){const e=t.length;let n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return is.area(t)<0}static triangulateShape(t,e){const n=[],i=[],r=[];Uc(t),Nc(n,t);let o=t.length;e.forEach(Uc);for(let c=0;c<e.length;c++)i.push(o),o+=e[c].length,Nc(n,e[c]);const a=S_.triangulate(n,i);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function Uc(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Nc(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class fs extends qt{constructor(t=new Tr([new Q(0,.5),new Q(-.5,-.5),new Q(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};const n=[],i=[],r=[],o=[];let a=0,c=0;if(Array.isArray(t)===!1)l(t);else for(let h=0;h<t.length;h++)l(t[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new zt(i,3)),this.setAttribute("normal",new zt(r,3)),this.setAttribute("uv",new zt(o,2));function l(h){const u=i.length/3,d=h.extractPoints(e);let p=d.shape;const g=d.holes;is.isClockWise(p)===!1&&(p=p.reverse());for(let f=0,m=g.length;f<m;f++){const x=g[f];is.isClockWise(x)===!0&&(g[f]=x.reverse())}const _=is.triangulateShape(p,g);for(let f=0,m=g.length;f<m;f++){const x=g[f];p=p.concat(x)}for(let f=0,m=p.length;f<m;f++){const x=p[f];i.push(x.x,x.y,0),r.push(0,0,1),o.push(x.x,x.y)}for(let f=0,m=_.length;f<m;f++){const x=_[f],v=x[0]+u,M=x[1]+u,R=x[2]+u;n.push(v,M,R),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes;return F_(e,t)}static fromJSON(t,e){const n=[];for(let i=0,r=t.shapes.length;i<r;i++){const o=e[t.shapes[i]];n.push(o)}return new fs(n,t.curveSegments)}}function F_(s,t){if(t.shapes=[],Array.isArray(s))for(let e=0,n=s.length;e<n;e++){const i=s[e];t.shapes.push(i.uuid)}else t.shapes.push(s.uuid);return t}class wr extends qt{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],u=new L,d=new L,p=[],g=[],_=[],f=[];for(let m=0;m<=n;m++){const x=[],v=m/n;let M=0;m===0&&o===0?M=.5/e:m===n&&c===Math.PI&&(M=-.5/e);for(let R=0;R<=e;R++){const w=R/e;u.x=-t*Math.cos(i+w*r)*Math.sin(o+v*a),u.y=t*Math.cos(o+v*a),u.z=t*Math.sin(i+w*r)*Math.sin(o+v*a),g.push(u.x,u.y,u.z),d.copy(u).normalize(),_.push(d.x,d.y,d.z),f.push(w+M,1-v),x.push(l++)}h.push(x)}for(let m=0;m<n;m++)for(let x=0;x<e;x++){const v=h[m][x+1],M=h[m][x],R=h[m+1][x],w=h[m+1][x+1];(m!==0||o>0)&&p.push(v,M,w),(m!==n-1||c<Math.PI)&&p.push(M,R,w)}this.setIndex(p),this.setAttribute("position",new zt(g,3)),this.setAttribute("normal",new zt(_,3)),this.setAttribute("uv",new zt(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new wr(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class ss extends ii{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new bt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new bt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=El,this.normalScale=new Q(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Je,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}const pr={enabled:!1,files:{},add:function(s,t){this.enabled!==!1&&(this.files[s]=t)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}};class B_{constructor(t,e,n){const i=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(h){a++,r===!1&&i.onStart!==void 0&&i.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,i.onProgress!==void 0&&i.onProgress(h,o,a),o===a&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(h){i.onError!==void 0&&i.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,u){return l.push(h,u),this},this.removeHandler=function(h){const u=l.indexOf(h);return u!==-1&&l.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=l.length;u<d;u+=2){const p=l[u],g=l[u+1];if(p.global&&(p.lastIndex=0),p.test(h))return g}return null}}}const z_=new B_;class ps{constructor(t){this.manager=t!==void 0?t:z_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){const n=this;return new Promise(function(i,r){n.load(t,i,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}}ps.DEFAULT_MATERIAL_NAME="__DEFAULT";const an={};class k_ extends Error{constructor(t,e){super(t),this.response=e}}class H_ extends ps{constructor(t){super(t)}load(t,e,n,i){t===void 0&&(t=""),this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=pr.get(t);if(r!==void 0)return this.manager.itemStart(t),setTimeout(()=>{e&&e(r),this.manager.itemEnd(t)},0),r;if(an[t]!==void 0){an[t].push({onLoad:e,onProgress:n,onError:i});return}an[t]=[],an[t].push({onLoad:e,onProgress:n,onError:i});const o=new Request(t,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=an[t],u=l.body.getReader(),d=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),p=d?parseInt(d):0,g=p!==0;let _=0;const f=new ReadableStream({start(m){x();function x(){u.read().then(({done:v,value:M})=>{if(v)m.close();else{_+=M.byteLength;const R=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:p});for(let w=0,A=h.length;w<A;w++){const I=h[w];I.onProgress&&I.onProgress(R)}m.enqueue(M),x()}},v=>{m.error(v)})}}});return new Response(f)}else throw new k_(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{const u=/charset="?([^;"\s]*)"?/i.exec(a),d=u&&u[1]?u[1].toLowerCase():void 0,p=new TextDecoder(d);return l.arrayBuffer().then(g=>p.decode(g))}}}).then(l=>{pr.add(t,l);const h=an[t];delete an[t];for(let u=0,d=h.length;u<d;u++){const p=h[u];p.onLoad&&p.onLoad(l)}}).catch(l=>{const h=an[t];if(h===void 0)throw this.manager.itemError(t),l;delete an[t];for(let u=0,d=h.length;u<d;u++){const p=h[u];p.onError&&p.onError(l)}this.manager.itemError(t)}).finally(()=>{this.manager.itemEnd(t)}),this.manager.itemStart(t)}setResponseType(t){return this.responseType=t,this}setMimeType(t){return this.mimeType=t,this}}class G_ extends ps{constructor(t){super(t)}load(t,e,n,i){this.path!==void 0&&(t=this.path+t),t=this.manager.resolveURL(t);const r=this,o=pr.get(t);if(o!==void 0)return r.manager.itemStart(t),setTimeout(function(){e&&e(o),r.manager.itemEnd(t)},0),o;const a=os("img");function c(){h(),pr.add(t,this),e&&e(this),r.manager.itemEnd(t)}function l(u){h(),i&&i(u),r.manager.itemError(t),r.manager.itemEnd(t)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),t.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(t),a.src=t,a}}class V_ extends ps{constructor(t){super(t)}load(t,e,n,i){const r=new Me,o=new G_(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(t,function(a){r.image=a,r.needsUpdate=!0,e!==void 0&&e(r)},n,i),r}}class qo extends Se{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new bt(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}}const Mo=new ee,Oc=new L,Fc=new L;class Jl{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Q(512,512),this.map=null,this.mapPass=null,this.matrix=new ee,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Wo,this._frameExtents=new Q(1,1),this._viewportCount=1,this._viewports=[new ne(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;Oc.setFromMatrixPosition(t.matrixWorld),e.position.copy(Oc),Fc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Fc),e.updateMatrixWorld(),Mo.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Mo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Mo)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Bc=new ee,Ji=new L,yo=new L;class W_ extends Jl{constructor(){super(new Ne(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Q(4,2),this._viewportCount=6,this._viewports=[new ne(2,1,1,1),new ne(0,1,1,1),new ne(3,1,1,1),new ne(1,1,1,1),new ne(3,0,1,1),new ne(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(t,e=0){const n=this.camera,i=this.matrix,r=t.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Ji.setFromMatrixPosition(t.matrixWorld),n.position.copy(Ji),yo.copy(n.position),yo.add(this._cubeDirections[e]),n.up.copy(this._cubeUps[e]),n.lookAt(yo),n.updateMatrixWorld(),i.makeTranslation(-Ji.x,-Ji.y,-Ji.z),Bc.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Bc)}}class X_ extends qo{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new W_}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}}class Y_ extends Jl{constructor(){super(new Fl(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Z_ extends qo{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Se.DEFAULT_UP),this.updateMatrix(),this.target=new Se,this.shadow=new Y_}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}}class q_ extends qo{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}class zc{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(xe(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class kc extends fn{constructor(t=10,e=10,n=4473924,i=8947848){n=new bt(n),i=new bt(i);const r=e/2,o=t/e,a=t/2,c=[],l=[];for(let d=0,p=0,g=-a;d<=e;d++,g+=o){c.push(-a,0,g,a,0,g),c.push(g,0,-a,g,0,a);const _=d===r?n:i;_.toArray(l,p),p+=3,_.toArray(l,p),p+=3,_.toArray(l,p),p+=3,_.toArray(l,p),p+=3}const h=new qt;h.setAttribute("position",new zt(c,3)),h.setAttribute("color",new zt(l,3));const u=new dn({vertexColors:!0,toneMapped:!1});super(h,u),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class j_ extends fn{constructor(t=1){const e=[0,0,0,t,0,0,0,0,0,0,t,0,0,0,0,0,0,t],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new qt;i.setAttribute("position",new zt(e,3)),i.setAttribute("color",new zt(n,3));const r=new dn({vertexColors:!0,toneMapped:!1});super(i,r),this.type="AxesHelper"}setColors(t,e,n){const i=new bt,r=this.geometry.attributes.color.array;return i.set(t),i.toArray(r,0),i.toArray(r,3),i.set(e),i.toArray(r,6),i.toArray(r,9),i.set(n),i.toArray(r,12),i.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:zo}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=zo);class Hc extends ps{constructor(t){super(t)}load(t,e,n,i){const r=this,o=new H_(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(t,function(a){try{e(r.parse(a))}catch(c){i?i(c):console.error(c),r.manager.itemError(t)}},n,i)}parse(t){function e(l){const h=new DataView(l),u=32/8*3+32/8*3*3+16/8,d=h.getUint32(80,!0);if(80+32/8+d*u===h.byteLength)return!0;const g=[115,111,108,105,100];for(let _=0;_<5;_++)if(n(g,h,_))return!1;return!0}function n(l,h,u){for(let d=0,p=l.length;d<p;d++)if(l[d]!==h.getUint8(u+d))return!1;return!0}function i(l){const h=new DataView(l),u=h.getUint32(80,!0);let d,p,g,_=!1,f,m,x,v,M;for(let P=0;P<70;P++)h.getUint32(P,!1)==1129270351&&h.getUint8(P+4)==82&&h.getUint8(P+5)==61&&(_=!0,f=new Float32Array(u*3*3),m=h.getUint8(P+6)/255,x=h.getUint8(P+7)/255,v=h.getUint8(P+8)/255,M=h.getUint8(P+9)/255);const R=84,w=12*4+2,A=new qt,I=new Float32Array(u*3*3),E=new Float32Array(u*3*3),y=new bt;for(let P=0;P<u;P++){const B=R+P*w,O=h.getFloat32(B,!0),Y=h.getFloat32(B+4,!0),q=h.getFloat32(B+8,!0);if(_){const G=h.getUint16(B+48,!0);G&32768?(d=m,p=x,g=v):(d=(G&31)/31,p=(G>>5&31)/31,g=(G>>10&31)/31)}for(let G=1;G<=3;G++){const K=B+G*12,X=P*3*3+(G-1)*3;I[X]=h.getFloat32(K,!0),I[X+1]=h.getFloat32(K+4,!0),I[X+2]=h.getFloat32(K+8,!0),E[X]=O,E[X+1]=Y,E[X+2]=q,_&&(y.set(d,p,g).convertSRGBToLinear(),f[X]=y.r,f[X+1]=y.g,f[X+2]=y.b)}}return A.setAttribute("position",new Ce(I,3)),A.setAttribute("normal",new Ce(E,3)),_&&(A.setAttribute("color",new Ce(f,3)),A.hasColors=!0,A.alpha=M),A}function r(l){const h=new qt,u=/solid([\s\S]*?)endsolid/g,d=/facet([\s\S]*?)endfacet/g,p=/solid\s(.+)/;let g=0;const _=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,f=new RegExp("vertex"+_+_+_,"g"),m=new RegExp("normal"+_+_+_,"g"),x=[],v=[],M=[],R=new L;let w,A=0,I=0,E=0;for(;(w=u.exec(l))!==null;){I=E;const y=w[0],P=(w=p.exec(y))!==null?w[1]:"";for(M.push(P);(w=d.exec(y))!==null;){let Y=0,q=0;const G=w[0];for(;(w=m.exec(G))!==null;)R.x=parseFloat(w[1]),R.y=parseFloat(w[2]),R.z=parseFloat(w[3]),q++;for(;(w=f.exec(G))!==null;)x.push(parseFloat(w[1]),parseFloat(w[2]),parseFloat(w[3])),v.push(R.x,R.y,R.z),Y++,E++;q!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+g),Y!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+g),g++}const B=I,O=E-I;h.userData.groupNames=M,h.addGroup(B,O,A),A++}return h.setAttribute("position",new zt(x,3)),h.setAttribute("normal",new zt(v,3)),h}function o(l){return typeof l!="string"?new TextDecoder().decode(l):l}function a(l){if(typeof l=="string"){const h=new Uint8Array(l.length);for(let u=0;u<l.length;u++)h[u]=l.charCodeAt(u)&255;return h.buffer||h}else return l}const c=a(t);return e(c)?i(c):r(o(t))}}const Gc={type:"change"},bo={type:"start"},Vc={type:"end"},Qs=new Vo,Wc=new bn,K_=Math.cos(70*In.DEG2RAD);class $_ extends ni{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:ln.ROTATE,MIDDLE:ln.DOLLY,RIGHT:ln.PAN},this.touches={ONE:yn.ROTATE,TWO:yn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(S){S.addEventListener("keydown",rt),this._domElementKeyEvents=S},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",rt),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Gc),n.update(),r=i.NONE},this.update=function(){const S=new L,V=new ti().setFromUnitVectors(t.up,new L(0,1,0)),F=V.clone().invert(),W=new L,J=new ti,xt=new L,wt=2*Math.PI;return function(le=null){const Xt=n.object.position;S.copy(Xt).sub(n.target),S.applyQuaternion(V),a.setFromVector3(S),n.autoRotate&&r===i.NONE&&B(y(le)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let he=n.minAzimuthAngle,ue=n.maxAzimuthAngle;isFinite(he)&&isFinite(ue)&&(he<-Math.PI?he+=wt:he>Math.PI&&(he-=wt),ue<-Math.PI?ue+=wt:ue>Math.PI&&(ue-=wt),he<=ue?a.theta=Math.max(he,Math.min(ue,a.theta)):a.theta=a.theta>(he+ue)/2?Math.max(he,a.theta):Math.min(ue,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor);let Pe=!1;if(n.zoomToCursor&&w||n.object.isOrthographicCamera)a.radius=dt(a.radius);else{const Le=a.radius;a.radius=dt(a.radius*l),Pe=Le!=a.radius}if(S.setFromSpherical(a),S.applyQuaternion(F),Xt.copy(n.target).add(S),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0)),n.zoomToCursor&&w){let Le=null;if(n.object.isPerspectiveCamera){const pn=S.length();Le=dt(pn*l);const Fn=pn-Le;n.object.position.addScaledVector(M,Fn),n.object.updateMatrixWorld(),Pe=!!Fn}else if(n.object.isOrthographicCamera){const pn=new L(R.x,R.y,0);pn.unproject(n.object);const Fn=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Pe=Fn!==n.object.zoom;const Bn=new L(R.x,R.y,0);Bn.unproject(n.object),n.object.position.sub(Bn).add(pn),n.object.updateMatrixWorld(),Le=S.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Le!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Le).add(n.object.position):(Qs.origin.copy(n.object.position),Qs.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Qs.direction))<K_?t.lookAt(n.target):(Wc.setFromNormalAndCoplanarPoint(n.object.up,n.target),Qs.intersectPlane(Wc,n.target))))}else if(n.object.isOrthographicCamera){const Le=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),Le!==n.object.zoom&&(n.object.updateProjectionMatrix(),Pe=!0)}return l=1,w=!1,Pe||W.distanceToSquared(n.object.position)>o||8*(1-J.dot(n.object.quaternion))>o||xt.distanceToSquared(n.target)>o?(n.dispatchEvent(Gc),W.copy(n.object.position),J.copy(n.object.quaternion),xt.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",gt),n.domElement.removeEventListener("pointerdown",ie),n.domElement.removeEventListener("pointercancel",b),n.domElement.removeEventListener("wheel",tt),n.domElement.removeEventListener("pointermove",C),n.domElement.removeEventListener("pointerup",b),n.domElement.getRootNode().removeEventListener("keydown",vt,{capture:!0}),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",rt),n._domElementKeyEvents=null)};const n=this,i={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=i.NONE;const o=1e-6,a=new zc,c=new zc;let l=1;const h=new L,u=new Q,d=new Q,p=new Q,g=new Q,_=new Q,f=new Q,m=new Q,x=new Q,v=new Q,M=new L,R=new Q;let w=!1;const A=[],I={};let E=!1;function y(S){return S!==null?2*Math.PI/60*n.autoRotateSpeed*S:2*Math.PI/60/60*n.autoRotateSpeed}function P(S){const V=Math.abs(S*.01);return Math.pow(.95,n.zoomSpeed*V)}function B(S){c.theta-=S}function O(S){c.phi-=S}const Y=function(){const S=new L;return function(F,W){S.setFromMatrixColumn(W,0),S.multiplyScalar(-F),h.add(S)}}(),q=function(){const S=new L;return function(F,W){n.screenSpacePanning===!0?S.setFromMatrixColumn(W,1):(S.setFromMatrixColumn(W,0),S.crossVectors(n.object.up,S)),S.multiplyScalar(F),h.add(S)}}(),G=function(){const S=new L;return function(F,W){const J=n.domElement;if(n.object.isPerspectiveCamera){const xt=n.object.position;S.copy(xt).sub(n.target);let wt=S.length();wt*=Math.tan(n.object.fov/2*Math.PI/180),Y(2*F*wt/J.clientHeight,n.object.matrix),q(2*W*wt/J.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(Y(F*(n.object.right-n.object.left)/n.object.zoom/J.clientWidth,n.object.matrix),q(W*(n.object.top-n.object.bottom)/n.object.zoom/J.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function K(S){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=S:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function X(S){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=S:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function ut(S,V){if(!n.zoomToCursor)return;w=!0;const F=n.domElement.getBoundingClientRect(),W=S-F.left,J=V-F.top,xt=F.width,wt=F.height;R.x=W/xt*2-1,R.y=-(J/wt)*2+1,M.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function dt(S){return Math.max(n.minDistance,Math.min(n.maxDistance,S))}function mt(S){u.set(S.clientX,S.clientY)}function kt(S){ut(S.clientX,S.clientX),m.set(S.clientX,S.clientY)}function Wt(S){g.set(S.clientX,S.clientY)}function j(S){d.set(S.clientX,S.clientY),p.subVectors(d,u).multiplyScalar(n.rotateSpeed);const V=n.domElement;B(2*Math.PI*p.x/V.clientHeight),O(2*Math.PI*p.y/V.clientHeight),u.copy(d),n.update()}function nt(S){x.set(S.clientX,S.clientY),v.subVectors(x,m),v.y>0?K(P(v.y)):v.y<0&&X(P(v.y)),m.copy(x),n.update()}function ft(S){_.set(S.clientX,S.clientY),f.subVectors(_,g).multiplyScalar(n.panSpeed),G(f.x,f.y),g.copy(_),n.update()}function ct(S){ut(S.clientX,S.clientY),S.deltaY<0?X(P(S.deltaY)):S.deltaY>0&&K(P(S.deltaY)),n.update()}function Nt(S){let V=!1;switch(S.code){case n.keys.UP:S.ctrlKey||S.metaKey||S.shiftKey?O(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):G(0,n.keyPanSpeed),V=!0;break;case n.keys.BOTTOM:S.ctrlKey||S.metaKey||S.shiftKey?O(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):G(0,-n.keyPanSpeed),V=!0;break;case n.keys.LEFT:S.ctrlKey||S.metaKey||S.shiftKey?B(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):G(n.keyPanSpeed,0),V=!0;break;case n.keys.RIGHT:S.ctrlKey||S.metaKey||S.shiftKey?B(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):G(-n.keyPanSpeed,0),V=!0;break}V&&(S.preventDefault(),n.update())}function Rt(S){if(A.length===1)u.set(S.pageX,S.pageY);else{const V=It(S),F=.5*(S.pageX+V.x),W=.5*(S.pageY+V.y);u.set(F,W)}}function Ht(S){if(A.length===1)g.set(S.pageX,S.pageY);else{const V=It(S),F=.5*(S.pageX+V.x),W=.5*(S.pageY+V.y);g.set(F,W)}}function D(S){const V=It(S),F=S.pageX-V.x,W=S.pageY-V.y,J=Math.sqrt(F*F+W*W);m.set(0,J)}function Gt(S){n.enableZoom&&D(S),n.enablePan&&Ht(S)}function Bt(S){n.enableZoom&&D(S),n.enableRotate&&Rt(S)}function Qt(S){if(A.length==1)d.set(S.pageX,S.pageY);else{const F=It(S),W=.5*(S.pageX+F.x),J=.5*(S.pageY+F.y);d.set(W,J)}p.subVectors(d,u).multiplyScalar(n.rotateSpeed);const V=n.domElement;B(2*Math.PI*p.x/V.clientHeight),O(2*Math.PI*p.y/V.clientHeight),u.copy(d)}function Mt(S){if(A.length===1)_.set(S.pageX,S.pageY);else{const V=It(S),F=.5*(S.pageX+V.x),W=.5*(S.pageY+V.y);_.set(F,W)}f.subVectors(_,g).multiplyScalar(n.panSpeed),G(f.x,f.y),g.copy(_)}function Vt(S){const V=It(S),F=S.pageX-V.x,W=S.pageY-V.y,J=Math.sqrt(F*F+W*W);x.set(0,J),v.set(0,Math.pow(x.y/m.y,n.zoomSpeed)),K(v.y),m.copy(x);const xt=(S.pageX+V.x)*.5,wt=(S.pageY+V.y)*.5;ut(xt,wt)}function Ot(S){n.enableZoom&&Vt(S),n.enablePan&&Mt(S)}function Ct(S){n.enableZoom&&Vt(S),n.enableRotate&&Qt(S)}function ie(S){n.enabled!==!1&&(A.length===0&&(n.domElement.setPointerCapture(S.pointerId),n.domElement.addEventListener("pointermove",C),n.domElement.addEventListener("pointerup",b)),!lt(S)&&(Ft(S),S.pointerType==="touch"?Pt(S):H(S)))}function C(S){n.enabled!==!1&&(S.pointerType==="touch"?it(S):$(S))}function b(S){switch(Et(S),A.length){case 0:n.domElement.releasePointerCapture(S.pointerId),n.domElement.removeEventListener("pointermove",C),n.domElement.removeEventListener("pointerup",b),n.dispatchEvent(Vc),r=i.NONE;break;case 1:const V=A[0],F=I[V];Pt({pointerId:V,pageX:F.x,pageY:F.y});break}}function H(S){let V;switch(S.button){case 0:V=n.mouseButtons.LEFT;break;case 1:V=n.mouseButtons.MIDDLE;break;case 2:V=n.mouseButtons.RIGHT;break;default:V=-1}switch(V){case ln.DOLLY:if(n.enableZoom===!1)return;kt(S),r=i.DOLLY;break;case ln.ROTATE:if(S.ctrlKey||S.metaKey||S.shiftKey){if(n.enablePan===!1)return;Wt(S),r=i.PAN}else{if(n.enableRotate===!1)return;mt(S),r=i.ROTATE}break;case ln.PAN:if(S.ctrlKey||S.metaKey||S.shiftKey){if(n.enableRotate===!1)return;mt(S),r=i.ROTATE}else{if(n.enablePan===!1)return;Wt(S),r=i.PAN}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(bo)}function $(S){switch(r){case i.ROTATE:if(n.enableRotate===!1)return;j(S);break;case i.DOLLY:if(n.enableZoom===!1)return;nt(S);break;case i.PAN:if(n.enablePan===!1)return;ft(S);break}}function tt(S){n.enabled===!1||n.enableZoom===!1||r!==i.NONE||(S.preventDefault(),n.dispatchEvent(bo),ct(et(S)),n.dispatchEvent(Vc))}function et(S){const V=S.deltaMode,F={clientX:S.clientX,clientY:S.clientY,deltaY:S.deltaY};switch(V){case 1:F.deltaY*=16;break;case 2:F.deltaY*=100;break}return S.ctrlKey&&!E&&(F.deltaY*=10),F}function vt(S){S.key==="Control"&&(E=!0,n.domElement.getRootNode().addEventListener("keyup",ot,{passive:!0,capture:!0}))}function ot(S){S.key==="Control"&&(E=!1,n.domElement.getRootNode().removeEventListener("keyup",ot,{passive:!0,capture:!0}))}function rt(S){n.enabled===!1||n.enablePan===!1||Nt(S)}function Pt(S){switch(Lt(S),A.length){case 1:switch(n.touches.ONE){case yn.ROTATE:if(n.enableRotate===!1)return;Rt(S),r=i.TOUCH_ROTATE;break;case yn.PAN:if(n.enablePan===!1)return;Ht(S),r=i.TOUCH_PAN;break;default:r=i.NONE}break;case 2:switch(n.touches.TWO){case yn.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Gt(S),r=i.TOUCH_DOLLY_PAN;break;case yn.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Bt(S),r=i.TOUCH_DOLLY_ROTATE;break;default:r=i.NONE}break;default:r=i.NONE}r!==i.NONE&&n.dispatchEvent(bo)}function it(S){switch(Lt(S),r){case i.TOUCH_ROTATE:if(n.enableRotate===!1)return;Qt(S),n.update();break;case i.TOUCH_PAN:if(n.enablePan===!1)return;Mt(S),n.update();break;case i.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Ot(S),n.update();break;case i.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Ct(S),n.update();break;default:r=i.NONE}}function gt(S){n.enabled!==!1&&S.preventDefault()}function Ft(S){A.push(S.pointerId)}function Et(S){delete I[S.pointerId];for(let V=0;V<A.length;V++)if(A[V]==S.pointerId){A.splice(V,1);return}}function lt(S){for(let V=0;V<A.length;V++)if(A[V]==S.pointerId)return!0;return!1}function Lt(S){let V=I[S.pointerId];V===void 0&&(V=new Q,I[S.pointerId]=V),V.set(S.pageX,S.pageY)}function It(S){const V=S.pointerId===A[0]?A[1]:A[0];return I[V]}n.domElement.addEventListener("contextmenu",gt),n.domElement.addEventListener("pointerdown",ie),n.domElement.addEventListener("pointercancel",b),n.domElement.addEventListener("wheel",tt,{passive:!1}),n.domElement.getRootNode().addEventListener("keydown",vt,{passive:!0,capture:!0}),this.update()}}class We{static addAxisLabel(t,e,n,i,r){const o=document.createElement("canvas");o.width=64,o.height=64;const a=o.getContext("2d");a.font="bold 48px Orbitron, monospace",a.fillStyle=i,a.textAlign="center",a.textBaseline="middle",a.fillText(e,32,32);const c=new Oo(o);r.push(c);const l=new No({map:c,depthTest:!1}),h=new mo(l);h.position.copy(n),h.scale.set(1,1,1),t.add(h)}static setLastSpriteScale(t,e){const n=t.children;for(let i=n.length-1;i>=0;i--)if(n[i]instanceof mo){n[i].scale.set(e,e,e);break}}static addTickSprite(t,e,n,i,r,o){const a=document.createElement("canvas");a.width=128,a.height=64;const c=a.getContext("2d");c.font="bold 26px Orbitron, monospace",c.textAlign="center",c.textBaseline="middle",c.fillStyle=i==="x"?"rgba(255,120,100,0.85)":i==="z"?"rgba(100,180,255,0.85)":"rgba(220,230,255,0.7)",c.fillText(e,64,32);const l=new Oo(a);o.push(l);const h=new No({map:l,depthTest:!1,transparent:!0}),u=new mo(h);u.position.copy(n);const d=r*.05;u.scale.set(d,d*.5,1),t.add(u)}static addGridTicks(t,e,n,i,r,o){for(let a=-n;a<=n;a+=e)a!==0&&(We.addTickSprite(t,String(a),new L(a,0,i),"x",r,o),We.addTickSprite(t,String(a),new L(i,0,a),"z",r,o));We.addTickSprite(t,"0",new L(i,0,i),"o",r,o)}}const Ti={x:0,y:0,z:0};class Ql{constructor(t,e){Z(this,"el");Z(this,"canvasWrap");Z(this,"topBar");Z(this,"overlayEl");Z(this,"storageKey");Z(this,"scene",null);Z(this,"camera",null);Z(this,"renderer",null);Z(this,"controls",null);Z(this,"savedTarget",new L);Z(this,"rafId",0);Z(this,"ro");Z(this,"textures",[]);Z(this,"lastFrameTime",0);Z(this,"loop",t=>{this.rafId=requestAnimationFrame(this.loop);const e=this.lastFrameTime?t-this.lastFrameTime:0;this.lastFrameTime=t;const n=this.canvasWrap.clientWidth,i=this.canvasWrap.clientHeight;if(n===0||i===0)return;const r=this.renderer,o=r.domElement;(o.width!==n||o.height!==i)&&(r.setSize(n,i,!1),this.camera.aspect=n/i,this.camera.updateProjectionMatrix()),this.onTick(e),this.controls.update(),r.render(this.scene,this.camera)});this.opts=e,this.storageKey=`bey_view_${e.title.toLowerCase().replace(/\s+/g,"_")}`,this.el=document.createElement("div"),this.el.className="screen sandbox-screen hidden",this.canvasWrap=document.createElement("div"),this.canvasWrap.className="sandbox-canvas-wrap",this.el.appendChild(this.canvasWrap);const n=document.createElement("div");n.className="sandbox-overlay",n.innerHTML=`
      <div class="sandbox-top-bar">
        <button class="game-btn back-btn"  id="sb-back">← Back</button>
        <span  class="sandbox-title">${e.title}</span>
        <button class="game-btn reset-btn" id="sb-reset" title="Reset camera view to default">↺ View</button>
      </div>
      <div class="sandbox-hint">Orbit · Left drag &nbsp;|&nbsp; Pan · Right drag &nbsp;|&nbsp; Zoom · Scroll</div>
    `,this.el.appendChild(n),t.appendChild(this.el),this.overlayEl=n,this.topBar=n.querySelector(".sandbox-top-bar"),n.querySelector("#sb-back").addEventListener("click",()=>e.onBack()),n.querySelector("#sb-reset").addEventListener("click",()=>this.resetView()),this.ro=new ResizeObserver(()=>this.resize())}addTopBarButton(t,e=""){const n=document.createElement("button");return n.className="game-btn",n.textContent=t,n.title=e,this.topBar.appendChild(n),n}addToScene(...t){t.forEach(e=>{var n;return(n=this.scene)==null?void 0:n.add(e)})}removeFromScene(...t){t.forEach(e=>{var n;return(n=this.scene)==null?void 0:n.remove(e)})}addOverlayPanel(t){const e=document.createElement("div");return e.className=t,this.overlayEl.appendChild(e),e}initScene(){if(this.scene)return;this.scene=new s_;const{defaultCam:t,camFar:e}=this.opts;this.camera=new Ne(55,1,.1,e),this.camera.position.set(t.x,t.y,t.z),this.camera.lookAt(0,0,0),this.buildScene()}mountRenderer(){this.renderer=new i_({antialias:!0,stencil:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(526351),this.canvasWrap.appendChild(this.renderer.domElement),this.controls=new $_(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.screenSpacePanning=!0,this.controls.minDistance=this.opts.minZoom,this.controls.maxDistance=this.opts.maxZoom,this.controls.mouseButtons={LEFT:ln.ROTATE,MIDDLE:ln.DOLLY,RIGHT:ln.PAN},this.controls.touches={ONE:yn.ROTATE,TWO:yn.DOLLY_PAN},this.loadView(),this.lastFrameTime=0}unmountRenderer(){this.saveView(),this.controls&&(this.savedTarget.copy(this.controls.target),this.controls.dispose(),this.controls=null),this.renderer&&(this.renderer.domElement.remove(),this.renderer.dispose(),this.renderer=null)}saveView(){if(!this.camera||!this.controls)return;const t={camX:this.camera.position.x,camY:this.camera.position.y,camZ:this.camera.position.z,tgtX:this.controls.target.x,tgtY:this.controls.target.y,tgtZ:this.controls.target.z};localStorage.setItem(this.storageKey,JSON.stringify(t))}loadView(){if(!(!this.camera||!this.controls))try{const t=localStorage.getItem(this.storageKey);if(!t)return;const e=JSON.parse(t);this.camera.position.set(e.camX,e.camY,e.camZ),this.controls.target.set(e.tgtX,e.tgtY,e.tgtZ),this.controls.update()}catch{}}resetView(){var e;localStorage.removeItem(this.storageKey);const{defaultCam:t}=this.opts;(e=this.camera)==null||e.position.set(t.x,t.y,t.z),this.controls&&(this.controls.target.set(Ti.x,Ti.y,Ti.z),this.controls.update()),this.savedTarget.set(Ti.x,Ti.y,Ti.z)}buildCustom(t){}buildScene(){const t=this.scene,{gridSize:e,gridDivs:n,tickEvery:i,tickRange:r,accentHex:o}=this.opts;t.add(new kc(e,n,o,2763338));const a=new kc(e,n,2763338,1710638);a.rotation.x=Math.PI/2,a.position.set(0,e/2,-e/2),t.add(a);const c=e/2*.25,l=this.opts.axisYOffset??0,h=new Xe;h.position.set(0,l,0),h.add(new j_(c)),t.add(h);const u=e/2*.32;We.addAxisLabel(t,"X",new L(u,l+c*.1,0),"#ff4d4d",this.textures),We.addAxisLabel(t,"Y",new L(c*.1,l+u,0),"#4dff88",this.textures),We.addAxisLabel(t,"Z",new L(0,l+c*.1,u),"#4db8ff",this.textures);const d=e/2*.07;We.setLastSpriteScale(t,d),We.setLastSpriteScale(t,d),We.setLastSpriteScale(t,d);const p=Math.max(.1,e*.018);We.addGridTicks(t,i,r,p,e,this.textures);const g=Math.max(.1,e*.001);t.add(new Yt(new wr(g,12,12),new Di({color:o}))),t.add(new q_(16777215,.5));const _=new Z_(16777215,1);_.position.set(e*.3,e*.5,e*.3),t.add(_);const f=e*.2,m=new X_(o,2,f);m.position.set(0,e*.05,0),t.add(m),this.buildCustom(t)}resize(){if(!this.renderer||!this.camera)return;const t=this.canvasWrap.clientWidth,e=this.canvasWrap.clientHeight;t===0||e===0||(this.renderer.setSize(t,e,!1),this.camera.aspect=t/e,this.camera.updateProjectionMatrix())}onTick(t){}setVisible(t){this.el.classList.toggle("hidden",!t),t?(this.initScene(),this.mountRenderer(),this.ro.observe(this.canvasWrap),this.rafId=requestAnimationFrame(this.loop)):(cancelAnimationFrame(this.rafId),this.ro.disconnect(),this.unmountRenderer())}dispose(){var t;cancelAnimationFrame(this.rafId),this.ro.disconnect(),this.unmountRenderer(),(t=this.scene)==null||t.traverse(e=>{const n=e;if(n.geometry&&n.geometry.dispose(),n.material){const i=Array.isArray(n.material)?n.material:[n.material];for(const r of i){for(const o of Object.values(r))o instanceof Me&&o.dispose();r.dispose()}}});for(const e of this.textures)e.dispose();this.textures.length=0,this.scene=null,this.camera=null,this.el.remove()}}const Xc={tiltAngle:0,pivotOffset:0,spinDir:"right"};class J_{constructor(){Z(this,"axis",{...Xc});Z(this,"parts",new Map);Z(this,"sectors",new Map);Z(this,"groups",new Map);Z(this,"rootChildIds",[]);Z(this,"_partSeq",0);Z(this,"_sectorSeq",0);Z(this,"_groupSeq",0)}getAxis(){return this.axis}setAxis(t){Object.assign(this.axis,t)}getPart(t){const e=this.parts.get(t);if(!e)throw new Error(`Part not found: ${t}`);return e}getAllParts(){return[...this.parts.values()]}hasPart(t){return this.parts.has(t)}findPartOfSector(t){for(const[e,n]of this.parts)if(n.sectorIds.includes(t))return e;return null}addPart(t){this.parts.set(t.id,t)}updatePart(t,e){const n=this.getPart(t);Object.assign(n,e)}removePart(t){this.parts.delete(t)}getSector(t){const e=this.sectors.get(t);if(!e)throw new Error(`Sector not found: ${t}`);return e}hasSector(t){return this.sectors.has(t)}addSector(t){this.sectors.set(t.id,t)}updateSector(t,e){const n=this.getSector(t);Object.assign(n,e)}removeSector(t){this.sectors.delete(t)}getGroup(t){const e=this.groups.get(t);if(!e)throw new Error(`Group not found: ${t}`);return e}getAllGroups(){return[...this.groups.values()]}hasGroup(t){return this.groups.has(t)}addGroup(t){this.groups.set(t.id,t)}updateGroup(t,e){const n=this.getGroup(t);Object.assign(n,e)}removeGroup(t){this.groups.delete(t)}getRootChildIds(){return this.rootChildIds}setRootChildIds(t){this.rootChildIds=[...t]}addToRoot(t){this.rootChildIds.includes(t)||this.rootChildIds.push(t)}removeFromRoot(t){this.rootChildIds=this.rootChildIds.filter(e=>e!==t)}nextPartId(){return`part-${++this._partSeq}`}nextSectorId(){return`sector-${++this._sectorSeq}`}nextGroupId(){return`group-${++this._groupSeq}`}serialize(){return{version:1,axis:{...this.axis},rootChildIds:[...this.rootChildIds],groups:[...this.groups.values()].map(t=>({...t,childIds:[...t.childIds]})),parts:[...this.parts.values()].map(t=>({...t,sectorIds:[...t.sectorIds]})),sectors:[...this.sectors.values()].map(t=>({...t})),partSeq:this._partSeq,sectorSeq:this._sectorSeq,groupSeq:this._groupSeq}}deserialize(t){this.axis={...t.axis},this.parts.clear(),this.sectors.clear(),this.groups.clear();for(const e of t.parts)this.parts.set(e.id,{...e,sectorIds:[...e.sectorIds]});for(const e of t.sectors)this.sectors.set(e.id,{...e});for(const e of t.groups)this.groups.set(e.id,{...e,childIds:[...e.childIds]});this.rootChildIds=[...t.rootChildIds],this._partSeq=t.partSeq,this._sectorSeq=t.sectorSeq,this._groupSeq=t.groupSeq}reset(){this.axis={...Xc},this.parts.clear(),this.sectors.clear(),this.groups.clear(),this.rootChildIds=[],this._partSeq=0,this._sectorSeq=0,this._groupSeq=0}}const Q_=50;class t0{constructor(){Z(this,"undoStack",[]);Z(this,"redoStack",[]);Z(this,"onStackChange")}execute(t){var e;t.execute(),this.undoStack.push(t),this.undoStack.length>Q_&&this.undoStack.shift(),this.redoStack=[],(e=this.onStackChange)==null||e.call(this)}undo(){var e;const t=this.undoStack.pop();t&&(t.undo(),this.redoStack.push(t),(e=this.onStackChange)==null||e.call(this))}redo(){var e;const t=this.redoStack.pop();t&&(t.execute(),this.undoStack.push(t),(e=this.onStackChange)==null||e.call(this))}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}clear(){var t;this.undoStack=[],this.redoStack=[],(t=this.onStackChange)==null||t.call(this)}}function jo(s){return Math.max(8,Math.ceil(Math.abs(s)/5))}function Ri(s,t,e,n,i,r,o){const a=i-n;for(let c=0;c<=o;c++){const l=In.degToRad(n+a*(c/o));s.push(t*Math.cos(l),r,e*Math.sin(l))}}function th(s,t,e,n,i){for(let r=0;r<i;r++){const o=e+r,a=o+1,c=n+r,l=c+1;t.push(o,a,l,o,l,c)}}function Yc(s,t,e,n,i,r){for(let o=0;o<i;o++){const a=n+o,c=a+1;r?t.push(e,c,a):t.push(e,a,c)}}function Zc(s,t,e,n,i){for(let r=0;r<n;r++){const o=t+r,a=o+1,c=e+r,l=c+1;i?s.push(o,c,l,o,l,a):s.push(o,a,l,o,l,c)}}function eh(s,t){const e=new qt;return e.setAttribute("position",new zt(s,3)),e.setIndex(t),e.computeVertexNormals(),e}class e0{buildMeshGeometry(t){const{startAngle:e,endAngle:n,height:i,topRadiusX:r,topRadiusZ:o,bottomRadiusX:a,bottomRadiusZ:c}=t,l=n-e,h=Math.abs(l)>=359.9,u=jo(l),d=[],p=[],g=0;Ri(d,a,c,e,n,0,u);const _=u+1;Ri(d,r,o,e,n,i,u),th(d,p,g,_,u);const f=d.length/3;d.push(0,0,0);const m=d.length/3;if(d.push(0,i,0),Yc(d,p,f,g,u,!0),Yc(d,p,m,_,u,!1),!h){const x=g,v=_;p.push(f,x,v,f,v,m);const M=g+u,R=_+u;p.push(f,m,R,f,R,M)}return eh(d,p)}buildEdgeGeometry(t){return nh(t,!1)}}class n0{buildMeshGeometry(t){const{startAngle:e,endAngle:n,height:i,topRadiusX:r,topRadiusZ:o,bottomRadiusX:a,bottomRadiusZ:c,innerTopRadiusX:l,innerTopRadiusZ:h,innerBottomRadiusX:u,innerBottomRadiusZ:d}=t,p=n-e,g=Math.abs(p)>=359.9,_=jo(p),f=[],m=[],x=0;Ri(f,a,c,e,n,0,_);const v=_+1;Ri(f,r,o,e,n,i,_);const M=2*(_+1);Ri(f,u,d,e,n,0,_);const R=3*(_+1);Ri(f,l,h,e,n,i,_),th(f,m,x,v,_);for(let w=0;w<_;w++){const A=M+w,I=A+1,E=R+w,y=E+1;m.push(A,E,y,A,y,I)}if(Zc(m,x,M,_,!0),Zc(m,v,R,_,!1),!g){m.push(x,M,R,x,R,v);const w=x+_,A=M+_,I=v+_,E=R+_;m.push(w,I,E,w,E,A)}return eh(f,m)}buildEdgeGeometry(t){return nh(t,!0)}}function nh(s,t){const{startAngle:e,endAngle:n,height:i,topRadiusX:r,topRadiusZ:o,bottomRadiusX:a,bottomRadiusZ:c,innerTopRadiusX:l,innerTopRadiusZ:h,innerBottomRadiusX:u,innerBottomRadiusZ:d}=s,p=n-e,g=Math.abs(p)>=359.9,_=jo(p),f=[];function m(R,w,A){let I=In.degToRad(e),E=Math.cos(I),y=Math.sin(I);for(let P=1;P<=_;P++){const B=In.degToRad(e+p*(P/_)),O=Math.cos(B),Y=Math.sin(B);f.push(R*E,A,w*y,R*O,A,w*Y),E=O,y=Y}}function x(R,w,A,I,E){for(const y of E){const P=In.degToRad(y);f.push(R*Math.cos(P),0,w*Math.sin(P)),f.push(A*Math.cos(P),i,I*Math.sin(P))}}const v=g?[e,e+90,e+180,e+270]:[e,n];m(a,c,0),m(r,o,i),x(a,c,r,o,v),t&&(m(u,d,0),m(l,h,i),x(u,d,l,h,v));const M=new qt;return M.setAttribute("position",new zt(f,3)),M}const i0=new e0,s0=new n0;function tr(s){return s?s0:i0}const r0=58879,o0=16777215,a0=16739125,c0=2763338,qc=.05;function jc(s){return{id:s.id,name:s.name,startAngle:0,endAngle:360,height:s.height,topRadiusX:s.topRadiusX,topRadiusZ:s.topRadiusZ,bottomRadiusX:s.bottomRadiusX,bottomRadiusZ:s.bottomRadiusZ,isHollow:s.isHollow,innerTopRadiusX:s.innerTopRadiusX,innerTopRadiusZ:s.innerTopRadiusZ,innerBottomRadiusX:s.innerBottomRadiusX,innerBottomRadiusZ:s.innerBottomRadiusZ,material:s.material,weight:s.weight,color:s.color}}class l0{constructor(t,e){Z(this,"pivotAnchor",new Xe);Z(this,"axisRoot",new Xe);Z(this,"spinGroup",new Xe);Z(this,"freeSpinGroup",new Xe);Z(this,"axisLine");Z(this,"pivotMarker");Z(this,"groundDisc");Z(this,"partObjects",new Map);Z(this,"viewMode","hitbox");Z(this,"sharedEdgeMat",new dn({color:o0,transparent:!0,opacity:.35}));this.scene=t,this.store=e,this.pivotAnchor.add(this.axisRoot),this.axisRoot.add(this.spinGroup,this.freeSpinGroup),t.add(this.pivotAnchor);const n=new wn(qc,qc,40,12),i=new Di({color:r0,transparent:!0,opacity:.5});this.axisLine=new Yt(n,i);const r=new wr(.3,12,12),o=new Di({color:a0});this.pivotMarker=new Yt(r,o);const a=new wn(1.5,1.5,.05,32),c=new Di({color:c0,transparent:!0,opacity:.6});this.groundDisc=new Yt(a,c),this.axisRoot.add(this.axisLine,this.pivotMarker,this.groundDisc),this.rebuildAxis()}setAxisPose(t,e){this.pivotAnchor.position.y=e,this.pivotAnchor.rotation.x=In.degToRad(t),this.axisRoot.position.y=-e,this.pivotMarker.position.y=e,this.groundDisc.position.y=0}rebuildAxis(){const t=this.store.getAxis();this.setAxisPose(t.tiltAngle,t.pivotOffset)}rebuildPart(t){this._disposePartObjects(t);const e=this.store.getPart(t),n=this._buildHitboxMesh(e),i=this._buildHitboxEdges(e),r=null;n.position.y=e.axisOffsetY,i.position.y=e.axisOffsetY;const o=e.freeSpin?"free":"spin";(o==="free"?this.freeSpinGroup:this.spinGroup).add(n,i),this.partObjects.set(t,{hitboxMesh:n,hitboxEdges:i,presentMesh:r,owner:o}),this._applyViewMode(t)}rebuildSector(t){const e=this.store.findPartOfSector(t);e&&this.rebuildPart(e)}removePart(t){this._disposePartObjects(t)}updateSpinGroups(){for(const t of this.store.getAllParts()){const e=this.partObjects.get(t.id);if(!e)continue;const n=t.freeSpin?"free":"spin";if(e.owner===n)continue;const i=e.owner==="free"?this.freeSpinGroup:this.spinGroup,r=n==="free"?this.freeSpinGroup:this.spinGroup;i.remove(e.hitboxMesh,e.hitboxEdges),e.presentMesh&&i.remove(e.presentMesh),r.add(e.hitboxMesh,e.hitboxEdges),e.presentMesh&&r.add(e.presentMesh),e.owner=n}}setViewMode(t){this.viewMode=t;for(const e of this.partObjects.keys())this._applyViewMode(e)}setPartVisible(t,e){const n=this.partObjects.get(t);n&&(n.hitboxMesh.visible=e&&this.viewMode!=="present",n.hitboxEdges.visible=e&&this.viewMode!=="present",n.presentMesh&&(n.presentMesh.visible=e&&this.viewMode!=="hitbox"))}dispose(){for(const t of[...this.partObjects.keys()])this._disposePartObjects(t);this.scene.remove(this.pivotAnchor),this._disposeMeshObj(this.axisLine),this._disposeMeshObj(this.pivotMarker),this._disposeMeshObj(this.groundDisc),this.sharedEdgeMat.dispose()}_buildHitboxMesh(t){if(t.sectorIds.length===0){const i=tr(t.isHollow).buildMeshGeometry(jc(t)),r=new ss({color:t.color,side:we,roughness:.6,metalness:t.material==="metal"?.6:.1});return new Yt(i,r)}const e=new Xe;for(const n of t.sectorIds){const i=this.store.getSector(n),o=tr(i.isHollow).buildMeshGeometry(i),a=new ss({color:i.color,side:we,roughness:.6,metalness:i.material==="metal"?.6:.1}),c=new Yt(o,a);c.userData.sectorId=n,e.add(c)}return e}_buildHitboxEdges(t){if(t.sectorIds.length===0){const i=tr(t.isHollow).buildEdgeGeometry(jc(t));return new fn(i,this.sharedEdgeMat)}const e=new Xe;for(const n of t.sectorIds){const i=this.store.getSector(n),o=tr(i.isHollow).buildEdgeGeometry(i);e.add(new fn(o,this.sharedEdgeMat))}return e}loadPresentationSTL(t,e){const n=this.store.getPart(t),i=this.partObjects.get(t);if(!i)return;i.presentMesh&&((i.owner==="free"?this.freeSpinGroup:this.spinGroup).remove(i.presentMesh),this._disposeMeshObj(i.presentMesh));const r=new ss({color:n.presentationColor,side:we,roughness:.5,metalness:.1}),o=new Yt(e,r);o.position.y=n.axisOffsetY,(i.owner==="free"?this.freeSpinGroup:this.spinGroup).add(o),i.presentMesh=o,this._applyViewMode(t)}_applyViewMode(t){const e=this.partObjects.get(t);if(!e)return;const n=this.viewMode!=="present",i=this.viewMode!=="hitbox";e.hitboxMesh.visible=n,e.hitboxEdges.visible=n,e.presentMesh&&(e.presentMesh.visible=i)}_disposePartObjects(t){const e=this.partObjects.get(t);if(!e)return;const n=e.owner==="free"?this.freeSpinGroup:this.spinGroup;n.remove(e.hitboxMesh,e.hitboxEdges),this._disposeMeshObj(e.hitboxMesh),this._disposeEdgeObj(e.hitboxEdges),e.presentMesh&&(n.remove(e.presentMesh),this._disposeMeshObj(e.presentMesh)),this.partObjects.delete(t)}_disposeMeshObj(t){t.traverse(e=>{const n=e;n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material:[n.material]).forEach(r=>r.dispose())})}_disposeEdgeObj(t){t.traverse(e=>{const n=e;n.geometry&&n.geometry.dispose()})}}const h0=300;class u0{constructor(t){Z(this,"spinning",!1);Z(this,"angle",0);Z(this,"_scratchDir",new L);this.renderer=t}startSpin(){this.spinning=!0}stopSpin(){this.spinning=!1}get isSpinning(){return this.spinning}setTiltAngle(t,e){this.renderer.setAxisPose(t,e)}tick(t,e){if(!this.spinning||t<=0)return;const n=h0/60*2*Math.PI*(t/1e3);this.angle+=e==="right"?n:-n,this.renderer.spinGroup.rotation.y=this.angle}resetAngle(){this.angle=0,this.renderer.spinGroup.rotation.y=0}orientTiltToCamera(t){const e=this._scratchDir;if(t.getWorldDirection(e),e.y=0,e.lengthSq()<1e-4)return;e.normalize();const n=Math.atan2(e.x,e.z);this.renderer.axisRoot.rotation.y=n}}class ih{constructor(t){Z(this,"bodyEl");Z(this,"headerEl");Z(this,"nodes",new Map);Z(this,"sel",new Set);Z(this,"dragId",null);Z(this,"dropTarget",null);Z(this,"ctxMenu");Z(this,"idSeq",0);Z(this,"nodeActions",new Map);Z(this,"onDelete",()=>{});Z(this,"onGroup",()=>{});Z(this,"onCombine",()=>{});Z(this,"onReparent",()=>{});Z(this,"onSelect",()=>{});Z(this,"onVisibilityToggle",()=>{});this.container=t,t.innerHTML=`
      <div class="scene-tree-header"><span class="scene-tree-header-title">SCENE</span></div>
      <div class="scene-tree-body"></div>
    `,this.headerEl=t.querySelector(".scene-tree-header"),this.bodyEl=t.querySelector(".scene-tree-body"),this.ctxMenu=document.createElement("div"),this.ctxMenu.className="tree-ctx-menu hidden",document.body.appendChild(this.ctxMenu),document.addEventListener("pointerdown",e=>{this.ctxMenu.contains(e.target)||this.hideCtx()}),document.addEventListener("keydown",e=>{e.key==="Delete"&&this.deleteSelected(),e.key==="Escape"&&this.clearSel()})}get header(){return this.headerEl}add(t,e,n,i=null,r){const o=document.createElement("div");o.className="tree-node",o.dataset.id=t;const a=document.createElement("div");a.className="tree-node-row",a.draggable=!0,a.style.setProperty("--depth",String(this.depthOf(i)));const c=document.createElement("span");c.className="tree-caret";const l=document.createElement("span");l.className="tree-node-icon",l.textContent=n;const h=document.createElement("span");if(h.className="tree-node-label",h.textContent=e,a.appendChild(c),a.appendChild(l),a.appendChild(h),r!=null&&r.onAddChild){const g=document.createElement("button");g.className="tree-add-btn",g.textContent="+",g.title="Add arena",g.addEventListener("click",_=>{_.stopPropagation(),r.onAddChild()}),a.appendChild(g)}if(r!=null&&r.addChildButtons)for(const g of r.addChildButtons){const _=document.createElement("button");_.className=`tree-add-btn${g.className?" "+g.className:""}`,_.textContent=g.label,_.title=g.title,_.addEventListener("click",f=>{f.stopPropagation(),g.onClick()}),a.appendChild(_)}const u=document.createElement("button");u.className="tree-vis-btn",u.textContent="👁",u.title="Toggle visibility",u.tabIndex=-1,a.appendChild(u);const d=document.createElement("div");d.className="tree-children",o.appendChild(a),o.appendChild(d);const p={id:t,label:e,icon:n,parentId:i,childIds:[],expanded:!0,rowEl:a,childrenEl:d,nodeEl:o};if(this.nodes.set(t,p),i){const g=this.nodes.get(i);g&&(g.childIds.push(t),g.childrenEl.appendChild(o),this.refreshCaret(g))}else this.bodyEl.appendChild(o);this.wireRow(p,u)}remove(t){const e=this.nodes.get(t);if(e){if([...e.childIds].forEach(n=>this.remove(n)),e.parentId){const n=this.nodes.get(e.parentId);n&&(n.childIds=n.childIds.filter(i=>i!==t),this.refreshCaret(n))}e.nodeEl.remove(),this.nodes.delete(t),this.sel.delete(t),this.nodeActions.delete(t)}}setLabel(t,e){const n=this.nodes.get(t);if(!n)return;n.label=e;const i=n.rowEl.querySelector(".tree-node-label");i&&(i.textContent=e)}setNodeActions(t,e){this.nodeActions.set(t,e)}select(t,e){var n,i;e||(this.sel.forEach(r=>{var o;return(o=this.nodes.get(r))==null?void 0:o.rowEl.classList.remove("tree-node--selected")}),this.sel.clear()),this.sel.has(t)&&e?(this.sel.delete(t),(n=this.nodes.get(t))==null||n.rowEl.classList.remove("tree-node--selected")):(this.sel.add(t),(i=this.nodes.get(t))==null||i.rowEl.classList.add("tree-node--selected")),this.onSelect([...this.sel])}clearSel(){this.sel.forEach(t=>{var e;return(e=this.nodes.get(t))==null?void 0:e.rowEl.classList.remove("tree-node--selected")}),this.sel.clear(),this.onSelect([])}showCtx(t,e,n){this.sel.has(n)||this.select(n,!1);const i=[...this.sel],r=this.nodeActions.get(n)??[],o=[{label:"Delete",action:()=>this.deleteSelected()},{label:"Group",action:()=>this.groupSelected(),disabled:i.length<1},{label:"Combine",action:()=>this.combineSelected(),disabled:i.length<2}];this.ctxMenu.innerHTML="";const a=l=>l.forEach(h=>{const u=document.createElement("button");u.className="tree-ctx-item",u.textContent=h.label,h.disabled&&(u.disabled=!0),u.addEventListener("click",()=>{h.action(),this.hideCtx()}),this.ctxMenu.appendChild(u)});if(a(r),r.length){const l=document.createElement("div");l.className="tree-ctx-sep",this.ctxMenu.appendChild(l)}a(o),this.ctxMenu.classList.remove("hidden");const c=this.ctxMenu.getBoundingClientRect();this.ctxMenu.style.left=`${Math.min(t,window.innerWidth-c.width-8)}px`,this.ctxMenu.style.top=`${Math.min(e,window.innerHeight-c.height-8)}px`}hideCtx(){this.ctxMenu.classList.add("hidden")}deleteSelected(){const t=[...this.sel];t.length&&(t.forEach(e=>this.remove(e)),this.onDelete(t))}groupSelected(){const t=[...this.sel];if(!t.length)return;const e=`group-${++this.idSeq}`;this.add(e,"Group","▣",this.nodes.get(t[0]).parentId??null),t.forEach(n=>this.reparentTo(n,e)),this.clearSel(),this.select(e,!1),this.onGroup(e,t)}combineSelected(){const t=[...this.sel];t.length<2||this.onCombine(t)}refreshCaret(t){const e=t.rowEl.querySelector(".tree-caret");e&&(e.textContent=t.childIds.length===0?"":t.expanded?"▾":"▸")}toggleExpand(t){const e=this.nodes.get(t);!e||!e.childIds.length||(e.expanded=!e.expanded,e.childrenEl.classList.toggle("tree-children--collapsed",!e.expanded),this.refreshCaret(e))}wireRow(t,e){const{rowEl:n,id:i}=t;n.addEventListener("click",o=>{const a=o.target;a.classList.contains("tree-caret")?this.toggleExpand(i):!a.classList.contains("tree-vis-btn")&&!a.classList.contains("tree-add-btn")&&this.select(i,o.ctrlKey||o.metaKey)});let r=!0;e.addEventListener("click",o=>{o.stopPropagation(),r=!r,e.textContent=r?"👁":"🚫",e.classList.toggle("hidden-obj",!r),this.onVisibilityToggle(i,r),this.cascadeVisibility(i,r)}),n.addEventListener("contextmenu",o=>{o.preventDefault(),this.showCtx(o.clientX,o.clientY,i)}),n.addEventListener("dragstart",o=>{this.dragId=i,o.dataTransfer.effectAllowed="move",n.classList.add("tree-node--dragging")}),n.addEventListener("dragend",()=>{this.dragId=null,n.classList.remove("tree-node--dragging"),this.clearDrop()}),n.addEventListener("dragover",o=>{if(!this.dragId||this.dragId===i)return;o.preventDefault(),o.dataTransfer.dropEffect="move";const a=(o.clientY-n.getBoundingClientRect().top)/n.getBoundingClientRect().height,c=a<.28?"before":a>.72?"after":"inside";this.clearDrop(),this.dropTarget={id:i,pos:c},n.classList.add(`tree-drop-${c}`)}),n.addEventListener("dragleave",()=>this.clearDrop()),n.addEventListener("drop",o=>{if(o.preventDefault(),!this.dragId||!this.dropTarget||this.dropTarget.id!==i)return;const a=this.dragId,{pos:c}=this.dropTarget;if(this.clearDrop(),c==="inside")this.reparentTo(a,i);else{const l=this.nodes.get(i);this.reparentTo(a,l.parentId,c==="before"?i:null,c==="after"?i:null)}})}cascadeVisibility(t,e){const n=this.nodes.get(t);if(n)for(const i of n.childIds)this.onVisibilityToggle(i,e),this.cascadeVisibility(i,e)}reparentTo(t,e,n=null,i=null){var a,c,l;const r=this.nodes.get(t);if(!r)return;if(r.parentId){const h=this.nodes.get(r.parentId);h&&(h.childIds=h.childIds.filter(u=>u!==t),this.refreshCaret(h))}r.nodeEl.remove(),r.parentId=e,r.rowEl.style.setProperty("--depth",String(this.depthOf(e)));const o=e?(a=this.nodes.get(e))==null?void 0:a.childrenEl:this.bodyEl;if(o){if(n)o.insertBefore(r.nodeEl,((c=this.nodes.get(n))==null?void 0:c.nodeEl)??null);else if(i){const h=(l=this.nodes.get(i))==null?void 0:l.nodeEl;h?h.after(r.nodeEl):o.appendChild(r.nodeEl)}else o.appendChild(r.nodeEl);if(e){const h=this.nodes.get(e);h.childIds=[...h.childrenEl.children].map(u=>u.dataset.id??"").filter(Boolean),this.refreshCaret(h)}this.onReparent(t,e,n??i)}}clearDrop(){var t;this.dropTarget&&((t=this.nodes.get(this.dropTarget.id))==null||t.rowEl.classList.remove("tree-drop-before","tree-drop-inside","tree-drop-after"),this.dropTarget=null)}depthOf(t){if(!t)return 0;const e=this.nodes.get(t);return e?this.depthOf(e.parentId)+1:0}dispose(){this.ctxMenu.remove()}}class sh{constructor(t){Z(this,"content");Z(this,"onClose",()=>{});t.innerHTML=`
      <div class="prop-header">PROPERTIES<button class="prop-close-btn" title="Close panel">×</button></div>
      <div class="prop-content"></div>
    `,this.content=t.querySelector(".prop-content"),t.querySelector(".prop-close-btn").addEventListener("click",()=>this.onClose()),this.showEmpty()}showEmpty(){this.content.innerHTML='<div class="prop-empty">Select an item<br>to inspect</div>'}section(t){const e=document.createElement("div");e.className="prop-section-title",e.textContent=t,this.content.appendChild(e)}readRow(t,e){const n=document.createElement("div");n.className="prop-row",n.innerHTML=`<span class="prop-label">${t}</span><span class="prop-value-read">${e}</span>`,this.content.appendChild(n)}numRow(t,e,n,i,r,o){const a=document.createElement("div");a.className="prop-row";const c=document.createElement("span");c.className="prop-label",c.textContent=t;const l=document.createElement("input");return l.className="prop-input",l.type="number",l.value=String(parseFloat(e.toFixed(3))),l.min=String(n),l.max=String(i),l.step=String(r),l.addEventListener("input",()=>o(parseFloat(l.value)||0)),a.appendChild(c),a.appendChild(l),this.content.appendChild(a),l}colorRow(t,e,n){const i=document.createElement("div");i.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=t;const o=document.createElement("input");return o.type="color",o.className="prop-color-input",o.value="#"+e.toString(16).padStart(6,"0"),o.addEventListener("input",()=>n(parseInt(o.value.slice(1),16))),i.appendChild(r),i.appendChild(o),this.content.appendChild(i),o}toggleRow(t,e,n){const i=document.createElement("div");i.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=t;const o=document.createElement("button");return o.className="prop-profile-btn"+(e?" active":""),o.textContent=e?"✦ On":"◌ Off",o.addEventListener("click",()=>{const a=!o.classList.contains("active");o.classList.toggle("active",a),o.textContent=a?"✦ On":"◌ Off",n(a)}),i.appendChild(r),i.appendChild(o),this.content.appendChild(i),o}textRow(t,e,n){const i=document.createElement("div");i.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=t;const o=document.createElement("input");return o.type="text",o.className="prop-text-input",o.value=e,o.addEventListener("input",()=>n(o.value)),i.appendChild(r),i.appendChild(o),this.content.appendChild(i),o}selectRow(t,e,n,i){const r=document.createElement("div");r.className="prop-row";const o=document.createElement("span");o.className="prop-label",o.textContent=t;const a=document.createElement("select");a.className="prop-select";for(const c of e){const l=document.createElement("option");l.value=c.value,l.textContent=c.label,l.selected=c.value===n,a.appendChild(l)}return a.addEventListener("change",()=>i(a.value)),r.appendChild(o),r.appendChild(a),this.content.appendChild(r),a}buttonRow(t,e,n){const i=document.createElement("div");i.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=t;const o=document.createElement("button");return o.className="game-btn prop-action-btn",o.textContent=e,o.addEventListener("click",n),i.appendChild(r),i.appendChild(o),this.content.appendChild(i),o}}const Kc=[{value:"plastic",label:"Plastic"},{value:"metal",label:"Metal"},{value:"rubber",label:"Rubber"},{value:"resin",label:"Resin"},{value:"custom",label:"Custom"}];class d0 extends sh{showAxis(t,e){this.content.innerHTML="",this.section("SPIN AXIS"),this.numRow("Tilt angle °",t.tiltAngle,0,45,.5,i=>e({tiltAngle:i})),this.numRow("Pivot offset cm",t.pivotOffset,0,20,.1,i=>e({pivotOffset:i})),this.section("SPIN DIRECTION");const n=document.createElement("div");n.className="prop-profile-row";for(const i of["left","right"]){const r=document.createElement("button");r.className="prop-profile-btn"+(t.spinDir===i?" active":""),r.textContent=i==="left"?"◀ Left":"Right ▶",r.addEventListener("click",()=>{n.querySelectorAll(".prop-profile-btn").forEach(o=>o.classList.remove("active")),r.classList.add("active"),e({spinDir:i})}),n.appendChild(r)}this.content.appendChild(n)}showPart(t,e,n,i){this.content.innerHTML="",this.section("NAME"),this.textRow("Name",t.name,o=>e({name:o})),this.section("TYPE");const r=document.createElement("div");r.className="prop-profile-row";for(const[o,a]of[[!1,"⬡ Solid"],[!0,"◯ Pipe"]]){const c=document.createElement("button");c.className="prop-profile-btn"+(t.isHollow===o?" active":""),c.textContent=a,c.addEventListener("click",()=>{r.querySelectorAll(".prop-profile-btn").forEach(l=>l.classList.remove("active")),c.classList.add("active"),e({isHollow:o})}),r.appendChild(c)}this.content.appendChild(r),this.toggleRow("Free Spin",t.freeSpin,o=>e({freeSpin:o})),this.section("POSITION"),this.numRow("Y offset cm",t.axisOffsetY,-10,30,.1,o=>e({axisOffsetY:o})),this.section("DIMENSIONS"),this.numRow("Height cm",t.height,.1,10,.1,o=>e({height:o})),this.numRow("Top Rx cm",t.topRadiusX,.1,10,.1,o=>e({topRadiusX:o})),this.numRow("Top Rz cm",t.topRadiusZ,.1,10,.1,o=>e({topRadiusZ:o})),this.numRow("Bot Rx cm",t.bottomRadiusX,.1,10,.1,o=>e({bottomRadiusX:o})),this.numRow("Bot Rz cm",t.bottomRadiusZ,.1,10,.1,o=>e({bottomRadiusZ:o})),t.isHollow&&(this.section("INNER DIMENSIONS"),this.numRow("Top iRx cm",t.innerTopRadiusX,.05,9,.05,o=>e({innerTopRadiusX:o})),this.numRow("Top iRz cm",t.innerTopRadiusZ,.05,9,.05,o=>e({innerTopRadiusZ:o})),this.numRow("Bot iRx cm",t.innerBottomRadiusX,.05,9,.05,o=>e({innerBottomRadiusX:o})),this.numRow("Bot iRz cm",t.innerBottomRadiusZ,.05,9,.05,o=>e({innerBottomRadiusZ:o}))),this.section("MATERIAL"),this.selectRow("Material",Kc,t.material,o=>e({material:o})),this.numRow("Weight g",t.weight,.01,200,.01,o=>e({weight:o})),this.colorRow("Color",t.color,o=>e({color:o})),this.section("SECTORS"),t.sectorIds.length===0?this.buttonRow("Cut part","Cut into sectors…",()=>{const o=prompt("Number of sectors (2–12):","3"),a=parseInt(o??"3",10);isNaN(a)||a<2||n(Math.min(12,a))}):this.readRow("Sectors",String(t.sectorIds.length)),this.section("PRESENTATION"),this.colorRow("Present color",t.presentationColor,o=>e({presentationColor:o})),this.buttonRow("STL model",t.presentationSTLb64?"✓ Replace STL":"Import STL…",()=>i())}showSector(t,e,n){this.content.innerHTML="",this.section("NAME"),this.textRow("Name",t.name,c=>n({name:c})),this.section("ARC"),this.numRow("Start angle °",t.startAngle,0,360,1,c=>n({startAngle:c})),this.numRow("End angle °",t.endAngle,0,360,1,c=>n({endAngle:c})),this.section("DIMENSIONS"),this.numRow("Height cm",t.height,.1,10,.1,c=>n({height:c})),this.numRow("Top Rx cm",t.topRadiusX,.1,10,.1,c=>n({topRadiusX:c})),this.numRow("Top Rz cm",t.topRadiusZ,.1,10,.1,c=>n({topRadiusZ:c})),this.numRow("Bot Rx cm",t.bottomRadiusX,.1,10,.1,c=>n({bottomRadiusX:c})),this.numRow("Bot Rz cm",t.bottomRadiusZ,.1,10,.1,c=>n({bottomRadiusZ:c})),t.isHollow&&(this.section("INNER DIMENSIONS"),this.numRow("Top iRx cm",t.innerTopRadiusX,.05,9,.05,c=>n({innerTopRadiusX:c})),this.numRow("Top iRz cm",t.innerTopRadiusZ,.05,9,.05,c=>n({innerTopRadiusZ:c})),this.numRow("Bot iRx cm",t.innerBottomRadiusX,.05,9,.05,c=>n({innerBottomRadiusX:c})),this.numRow("Bot iRz cm",t.innerBottomRadiusZ,.05,9,.05,c=>n({innerBottomRadiusZ:c}))),this.section("MATERIAL"),this.selectRow("Material",Kc,t.material,c=>n({material:c})),this.colorRow("Color",t.color,c=>n({color:c})),this.section("WEIGHT"),e.sectorIds.map(()=>0);const i=document.createElement("div");i.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent="Weight g";const o=document.createElement("input");o.type="number",o.className="prop-input",o.value=String(t.weight),o.min="0.001",o.max="200",o.step="0.001";const a=document.createElement("span");a.className="prop-weight-hint",a.textContent=`/ ${e.weight.toFixed(3)} g total`,o.addEventListener("input",()=>{n({weight:parseFloat(o.value)||0})}),i.appendChild(r),i.appendChild(o),i.appendChild(a),this.content.appendChild(i)}showGroup(t,e){this.content.innerHTML="",this.section("GROUP"),this.textRow("Name",t.name,e),this.readRow("Children",String(t.childIds.length))}}class f0{constructor(t,e){Z(this,"description","Add part");this.ctx=t,this.data=e}execute(){this.ctx.store.addPart(this.data),this.ctx.store.addToRoot(this.data.id),this.ctx.onPartAdded(this.data.id)}undo(){this.ctx.store.removePart(this.data.id),this.ctx.store.removeFromRoot(this.data.id),this.ctx.onPartRemoved(this.data.id)}}class p0{constructor(t,e){Z(this,"description","Delete part");Z(this,"snapshot");Z(this,"snapshotSectors");Z(this,"wasInRoot");Z(this,"parentGroupId");this.ctx=t,this.partId=e,this.snapshot={...t.store.getPart(e),sectorIds:[...t.store.getPart(e).sectorIds]},this.snapshotSectors=this.snapshot.sectorIds.map(n=>({...t.store.getSector(n)})),this.wasInRoot=t.store.getRootChildIds().includes(e),this.parentGroupId=this._findParentGroup()}_findParentGroup(){for(const t of this.ctx.store.getAllGroups())if(t.childIds.includes(this.partId))return t.id;return null}execute(){for(const t of this.snapshot.sectorIds)this.ctx.store.removeSector(t);if(this.ctx.store.removePart(this.partId),this.wasInRoot&&this.ctx.store.removeFromRoot(this.partId),this.parentGroupId){const t=this.ctx.store.getGroup(this.parentGroupId);this.ctx.store.updateGroup(this.parentGroupId,{childIds:t.childIds.filter(e=>e!==this.partId)})}this.ctx.onPartRemoved(this.partId)}undo(){for(const t of this.snapshotSectors)this.ctx.store.addSector(t);if(this.ctx.store.addPart(this.snapshot),this.wasInRoot&&this.ctx.store.addToRoot(this.partId),this.parentGroupId){const t=this.ctx.store.getGroup(this.parentGroupId);this.ctx.store.updateGroup(this.parentGroupId,{childIds:[...t.childIds,this.partId]})}this.ctx.onPartAdded(this.partId)}}class $c{constructor(t,e,n){Z(this,"description","Update part");Z(this,"prev");this.ctx=t,this.id=e,this.next=n;const i=t.store.getPart(e);this.prev=Object.fromEntries(Object.keys(n).map(r=>[r,i[r]]))}execute(){this.ctx.store.updatePart(this.id,this.next),this.ctx.onPartUpdated(this.id)}undo(){this.ctx.store.updatePart(this.id,this.prev),this.ctx.onPartUpdated(this.id)}}class m0{constructor(t,e,n){Z(this,"description","Cut into sectors");Z(this,"oldSectorIds");this.ctx=t,this.partId=e,this.newSectors=n,this.oldSectorIds=[...t.store.getPart(e).sectorIds]}execute(){for(const t of this.oldSectorIds)this.ctx.store.removeSector(t);for(const t of this.newSectors)this.ctx.store.addSector(t);this.ctx.store.updatePart(this.partId,{sectorIds:this.newSectors.map(t=>t.id)}),this.ctx.onPartUpdated(this.partId)}undo(){for(const t of this.newSectors)this.ctx.store.removeSector(t.id);for(const t of this.oldSectorIds);this.ctx.store.updatePart(this.partId,{sectorIds:this.oldSectorIds}),this.ctx.onPartUpdated(this.partId)}}class g0{constructor(t,e,n,i){Z(this,"description","Update sector");Z(this,"prev");this.ctx=t,this.partId=e,this.sectorId=n,this.next=i;const r=t.store.getSector(n);this.prev=Object.fromEntries(Object.keys(i).map(o=>[o,r[o]]))}execute(){this.ctx.store.updateSector(this.sectorId,this.next),this.ctx.onSectorUpdated(this.sectorId)}undo(){this.ctx.store.updateSector(this.sectorId,this.prev),this.ctx.onSectorUpdated(this.sectorId)}}class _0{constructor(t,e,n){Z(this,"description","Delete sector");Z(this,"snapshot");this.ctx=t,this.partId=e,this.sectorId=n,this.snapshot={...t.store.getSector(n)}}execute(){this.ctx.store.removeSector(this.sectorId);const t=this.ctx.store.getPart(this.partId);this.ctx.store.updatePart(this.partId,{sectorIds:t.sectorIds.filter(e=>e!==this.sectorId)}),this.ctx.onSectorRemoved(this.partId,this.sectorId)}undo(){this.ctx.store.addSector(this.snapshot);const t=this.ctx.store.getPart(this.partId);this.ctx.store.updatePart(this.partId,{sectorIds:[...t.sectorIds,this.sectorId]}),this.ctx.onSectorAdded(this.partId,this.sectorId)}}class Jc{constructor(t,e){Z(this,"description","Add group");this.ctx=t,this.data=e}execute(){this.ctx.store.addGroup(this.data),this.ctx.store.addToRoot(this.data.id),this.ctx.onGroupAdded(this.data.id)}undo(){this.ctx.store.removeGroup(this.data.id),this.ctx.store.removeFromRoot(this.data.id),this.ctx.onGroupRemoved(this.data.id)}}class v0{constructor(t,e){Z(this,"description","Delete group");Z(this,"snapshot");Z(this,"wasInRoot");this.ctx=t,this.groupId=e;const n=t.store.getGroup(e);this.snapshot={...n,childIds:[...n.childIds]},this.wasInRoot=t.store.getRootChildIds().includes(e)}execute(){for(const t of this.snapshot.childIds)this.ctx.store.addToRoot(t);this.ctx.store.removeGroup(this.groupId),this.wasInRoot&&this.ctx.store.removeFromRoot(this.groupId),this.ctx.onGroupRemoved(this.groupId)}undo(){this.ctx.store.addGroup(this.snapshot),this.wasInRoot&&this.ctx.store.addToRoot(this.groupId);for(const t of this.snapshot.childIds)this.ctx.store.removeFromRoot(t);this.ctx.onGroupAdded(this.groupId)}}class x0{constructor(t,e,n){Z(this,"description","Update group");Z(this,"prev");this.ctx=t,this.id=e,this.next=n;const i=t.store.getGroup(e);this.prev=Object.fromEntries(Object.keys(n).map(r=>[r,i[r]]))}execute(){this.ctx.store.updateGroup(this.id,this.next),this.ctx.onGroupUpdated(this.id)}undo(){this.ctx.store.updateGroup(this.id,this.prev),this.ctx.onGroupUpdated(this.id)}}function mr(s,t="Leave",e="Stay"){return new Promise(n=>{const i=document.createElement("div");i.className="confirm-overlay",i.innerHTML=`
      <div class="confirm-dialog" role="dialog" aria-modal="true">
        <p class="confirm-msg">${s}</p>
        <div class="confirm-actions">
          <button class="game-btn btn-danger" id="c-ok">${t}</button>
          <button class="game-btn" id="c-cancel">${e}</button>
        </div>
      </div>
    `,document.body.appendChild(i);const r=a=>{i.remove(),window.removeEventListener("keydown",o),n(a)},o=a=>{a.key==="Enter"&&r(!0),a.key==="Escape"&&r(!1)};i.querySelector("#c-ok").addEventListener("click",()=>r(!0)),i.querySelector("#c-cancel").addEventListener("click",()=>r(!1)),i.addEventListener("click",a=>{a.target===i&&r(!1)}),window.addEventListener("keydown",o)})}const Eo="bey_beyblade_builder",S0=1;class M0 extends Ql{constructor(e,n){super(e,{title:"Beyblade Builder",accentHex:58879,onBack:n,gridSize:15,gridDivs:15,tickEvery:5,tickRange:7,defaultCam:{x:12,y:8,z:14},camFar:500,minZoom:.5,maxZoom:50});Z(this,"store",new J_);Z(this,"history",new t0);Z(this,"beyRenderer");Z(this,"animator");Z(this,"tree");Z(this,"panel");Z(this,"rightPanelEl");Z(this,"leftPanelEl");Z(this,"undoBtn");Z(this,"redoBtn");Z(this,"playBtn");Z(this,"stopBtn");Z(this,"tiltInput");Z(this,"pivotInput");Z(this,"spinLeftBtn");Z(this,"spinRightBtn");Z(this,"viewBtns",{});Z(this,"_onKey",e=>{(/mac/i.test(navigator.platform)?e.metaKey:e.ctrlKey)&&(e.key==="z"&&!e.shiftKey&&(e.preventDefault(),this._undo()),(e.key==="z"&&e.shiftKey||e.key==="y")&&(e.preventDefault(),this._redo()))});this.undoBtn=this.addTopBarButton("↩ Undo","Undo (Ctrl+Z)"),this.redoBtn=this.addTopBarButton("↪ Redo","Redo (Ctrl+Y)");const r=this.addTopBarButton("✕ Reset","Clear all parts and reset axis to defaults");this.undoBtn.addEventListener("click",()=>this._undo()),this.redoBtn.addEventListener("click",()=>this._redo()),r.addEventListener("click",()=>{this._confirmReset()}),this.history.onStackChange=()=>this._syncUndoButtons(),this._syncUndoButtons()}setVisible(e){super.setVisible(e),e?document.addEventListener("keydown",this._onKey):document.removeEventListener("keydown",this._onKey)}buildCustom(e){this.beyRenderer=new l0(e,this.store),this.animator=new u0(this.beyRenderer);const n=this.addOverlayPanel("sandbox-left-panel");this.leftPanelEl=n,this.tree=new ih(n);const i=document.createElement("button");i.className="tree-collapse-btn",i.textContent="◀",i.title="Collapse panel",this.tree.header.appendChild(i),i.addEventListener("click",()=>{const l=n.classList.toggle("sandbox-left-panel--collapsed");i.textContent=l?"▶":"◀",i.title=l?"Expand panel":"Collapse panel"});const r=document.createElement("button");r.className="game-btn tree-add-root-btn",r.textContent="+ Part",r.title="Add a new part to the scene",r.addEventListener("click",()=>this._addPart());const o=document.createElement("button");o.className="game-btn tree-add-root-btn",o.textContent="+ Group",o.title="Add a new group",o.addEventListener("click",()=>this._addGroup());const a=document.createElement("div");a.className="tree-add-root-row",a.appendChild(r),a.appendChild(o),n.appendChild(a);const c=this.addOverlayPanel("sandbox-right-panel");this.rightPanelEl=c,this.panel=new d0(c),this.panel.onClose=()=>{this.tree.clearSel(),this.rightPanelEl.style.display="none"},this.tree.add("axis","🔄 Axis","🔄",null),this.tree.setNodeActions("axis",[{label:"Properties",action:()=>this._selectAxis()}]),this._buildBottomBar(),this._wireTree(),this._loadFromStorage()}onTick(e){this.animator.tick(e,this.store.getAxis().spinDir)}_buildBottomBar(){const e="calc(67 * var(--mm))",n="calc(23 * var(--mm))",i=c=>{const l=c?n:e;this.rightPanelEl.style.bottom=l,this.leftPanelEl.style.bottom=l},r=this.addOverlayPanel("beyblade-bottom-bar");r.innerHTML=`
      <div class="bey-bar-header">
        <button class="bey-bar-collapse-btn" id="bey-bar-toggle">
          <span class="bey-bar-collapse-arrow">▼</span>
          <span>ANIMATION</span>
        </button>
      </div>
      <div class="bey-bar-content">
        <div class="bey-bar-row">
          <span class="bey-bar-label">TILT</span>
          <input class="bey-bar-input" id="bey-tilt" type="number" min="0" max="45" step="0.5" value="0">
          <span class="bey-bar-unit">°</span>
          <span class="bey-bar-sep"></span>
          <span class="bey-bar-label">PIVOT</span>
          <input class="bey-bar-input" id="bey-pivot" type="number" min="0" max="20" step="0.1" value="0">
          <span class="bey-bar-unit">cm</span>
          <span class="bey-bar-sep"></span>
          <button class="game-btn bey-spin-btn" id="bey-spin-left"  title="Spin left">◀ LEFT</button>
          <button class="game-btn bey-spin-btn active" id="bey-spin-right" title="Spin right">RIGHT ▶</button>
          <span class="bey-bar-sep"></span>
          <button class="game-btn bey-spin-btn" id="bey-play" title="Start spin animation">▶ PLAY</button>
          <button class="game-btn bey-spin-btn" id="bey-stop" title="Stop spin animation">■ STOP</button>
          <span class="bey-bar-sep"></span>
          <button class="game-btn bey-view-btn active" id="bey-view-hitbox"  title="Hitbox only">HITBOX</button>
          <button class="game-btn bey-view-btn" id="bey-view-both"    title="Hitbox + presentation">BOTH</button>
          <button class="game-btn bey-view-btn" id="bey-view-present" title="Presentation only">PRESENT</button>
        </div>
      </div>
    `;const o=r.querySelector("#bey-bar-toggle"),a=r.querySelector(".bey-bar-collapse-arrow");o.addEventListener("click",()=>{const c=r.classList.toggle("beyblade-bottom-bar--collapsed");a.textContent=c?"▶":"▼",i(c)}),i(!1),this.tiltInput=r.querySelector("#bey-tilt"),this.pivotInput=r.querySelector("#bey-pivot"),this.spinLeftBtn=r.querySelector("#bey-spin-left"),this.spinRightBtn=r.querySelector("#bey-spin-right"),this.playBtn=r.querySelector("#bey-play"),this.stopBtn=r.querySelector("#bey-stop"),this.viewBtns.hitbox=r.querySelector("#bey-view-hitbox"),this.viewBtns.both=r.querySelector("#bey-view-both"),this.viewBtns.present=r.querySelector("#bey-view-present"),this.tiltInput.addEventListener("input",()=>this._applyAxisPose()),this.pivotInput.addEventListener("input",()=>this._applyAxisPose()),this.spinLeftBtn.addEventListener("click",()=>{this.store.setAxis({spinDir:"left"}),this.spinLeftBtn.classList.add("active"),this.spinRightBtn.classList.remove("active")}),this.spinRightBtn.addEventListener("click",()=>{this.store.setAxis({spinDir:"right"}),this.spinRightBtn.classList.add("active"),this.spinLeftBtn.classList.remove("active")}),this.playBtn.addEventListener("click",()=>{this.animator.startSpin(),this.playBtn.classList.add("active"),this.stopBtn.classList.remove("active")}),this.stopBtn.addEventListener("click",()=>{this.animator.stopSpin(),this.animator.resetAngle(),this.stopBtn.classList.add("active"),this.playBtn.classList.remove("active")}),Object.entries(this.viewBtns).forEach(([c,l])=>{l.addEventListener("click",()=>this._setViewMode(c))})}_applyAxisPose(){const e=parseFloat(this.tiltInput.value)||0,n=parseFloat(this.pivotInput.value)||0;this.store.setAxis({tiltAngle:e,pivotOffset:n}),this.animator.setTiltAngle(e,n)}_setViewMode(e){this.beyRenderer.setViewMode(e),Object.entries(this.viewBtns).forEach(([n,i])=>{i.classList.toggle("active",n===e)})}_wireTree(){this.tree.onSelect=e=>{if(e.length===0){this.panel.showEmpty();return}const n=e[0];if(n==="axis"){this._selectAxis();return}if(this.store.hasPart(n))this._selectPart(n);else if(this.store.hasSector(n)){const i=this.store.findPartOfSector(n);i&&this._selectSector(n,i)}else this.store.hasGroup(n)&&this._selectGroup(n)},this.tree.onDelete=e=>{for(const n of e)if(n!=="axis")if(this.store.hasPart(n))this.history.execute(new p0(this._ctx(),n));else if(this.store.hasSector(n)){const i=this.store.findPartOfSector(n);i&&this.history.execute(new _0(this._ctx(),i,n))}else this.store.hasGroup(n)&&this.history.execute(new v0(this._ctx(),n));this.panel.showEmpty()},this.tree.onVisibilityToggle=(e,n)=>{this.store.hasPart(e)&&this.beyRenderer.setPartVisible(e,n)},this.tree.onGroup=(e,n)=>{const r={id:this.store.nextGroupId(),name:"Group",childIds:n};this.history.execute(new Jc(this._ctx(),r))}}_selectAxis(){this.rightPanelEl.style.display="";const e=this.store.getAxis();this.panel.showAxis(e,n=>{this.store.setAxis(n),this.tiltInput.value=String(this.store.getAxis().tiltAngle),this.pivotInput.value=String(this.store.getAxis().pivotOffset),this._applyAxisPose(),this._saveToStorage()})}_selectPart(e){this.rightPanelEl.style.display="";const n=this.store.getPart(e);this.panel.showPart(n,i=>{this.history.execute(new $c(this._ctx(),e,i))},i=>this._cutPart(e,i),()=>this._importSTL(e))}_selectSector(e,n){this.rightPanelEl.style.display="";const i=this.store.getSector(e),r=this.store.getPart(n);this.panel.showSector(i,r,o=>{this.history.execute(new g0(this._ctx(),n,e,o))})}_selectGroup(e){this.rightPanelEl.style.display="";const n=this.store.getGroup(e);this.panel.showGroup(n,i=>{this.history.execute(new x0(this._ctx(),e,{name:i})),this.tree.setLabel(e,i)})}_addPart(){const e=this.store.nextPartId(),n={id:e,name:`Part ${e.split("-")[1]}`,isHollow:!1,freeSpin:!1,axisOffsetY:0,height:1,topRadiusX:2,topRadiusZ:2,bottomRadiusX:2,bottomRadiusZ:2,innerTopRadiusX:0,innerTopRadiusZ:0,innerBottomRadiusX:0,innerBottomRadiusZ:0,sectorIds:[],material:"plastic",weight:1,color:58879,presentationColor:11184810};this.history.execute(new f0(this._ctx(),n))}_addGroup(){const e=this.store.nextGroupId(),n={id:e,name:`Group ${e.split("-")[1]}`,childIds:[]};this.history.execute(new Jc(this._ctx(),n))}_cutPart(e,n){const i=this.store.getPart(e),r=360/n,o=i.weight/n,a=[];for(let c=0;c<n;c++){const l=this.store.nextSectorId();a.push({id:l,name:`Sector ${c+1}`,startAngle:r*c,endAngle:r*(c+1),height:i.height,topRadiusX:i.topRadiusX,topRadiusZ:i.topRadiusZ,bottomRadiusX:i.bottomRadiusX,bottomRadiusZ:i.bottomRadiusZ,isHollow:i.isHollow,innerTopRadiusX:i.innerTopRadiusX,innerTopRadiusZ:i.innerTopRadiusZ,innerBottomRadiusX:i.innerBottomRadiusX,innerBottomRadiusZ:i.innerBottomRadiusZ,material:i.material,weight:parseFloat(o.toFixed(3)),color:i.color})}this.history.execute(new m0(this._ctx(),e,a))}_importSTL(e){const n=document.createElement("input");n.type="file",n.accept=".stl",n.addEventListener("change",()=>{var o;const i=(o=n.files)==null?void 0:o[0];if(!i)return;const r=new FileReader;r.onload=()=>{const c=new Hc().parse(r.result);this.beyRenderer.loadPresentationSTL(e,c);const l=btoa(String.fromCharCode(...new Uint8Array(r.result)));this.store.updatePart(e,{presentationSTLb64:l}),this._saveToStorage()},r.readAsArrayBuffer(i)}),n.click()}_ctx(){return{store:this.store,onPartAdded:e=>{this._onPartAdded(e)},onPartRemoved:e=>{this._onPartRemoved(e)},onPartUpdated:e=>{this._onPartUpdated(e)},onSectorAdded:(e,n)=>{this._onSectorAdded(e,n)},onSectorRemoved:(e,n)=>{this._onSectorRemoved(e,n)},onSectorUpdated:e=>{this._onSectorUpdated(e)},onGroupAdded:e=>{this._onGroupAdded(e)},onGroupRemoved:e=>{this._onGroupRemoved(e)},onGroupUpdated:e=>{this._onGroupUpdated(e)},onRootOrderChanged:()=>{this._rebuildTree()},onAxisUpdated:()=>{this.beyRenderer.rebuildAxis(),this._saveToStorage()},onTreeRebuild:()=>{this._rebuildTree()}}}_onPartAdded(e){const n=this.store.getPart(e);this.beyRenderer.rebuildPart(e),this.tree.add(e,n.name,n.isHollow?"◯":"⬡",null,{addChildButtons:[{label:"S+",title:"Cut into sectors",onClick:()=>{const i=parseInt(prompt("Number of sectors (2–12):","3")??"3",10)||3;this._cutPart(e,Math.max(2,Math.min(12,i)))}}]}),this.tree.setNodeActions(e,[{label:"Free Spin: "+(n.freeSpin?"ON":"OFF"),action:()=>{this.history.execute(new $c(this._ctx(),e,{freeSpin:!this.store.getPart(e).freeSpin}))}}]),this._saveToStorage()}_onPartRemoved(e){this.beyRenderer.removePart(e),this.tree.remove(e),this._saveToStorage()}_onPartUpdated(e){if(!this.store.hasPart(e))return;const n=this.store.getPart(e);this.beyRenderer.rebuildPart(e),this.beyRenderer.updateSpinGroups(),this.tree.setLabel(e,n.name),this._rebuildSectorNodes(e),this._saveToStorage()}_onSectorAdded(e,n){const i=this.store.getSector(n);this.tree.add(n,i.name,"◔",e),this.beyRenderer.rebuildPart(e),this._saveToStorage()}_onSectorRemoved(e,n){this.tree.remove(n),this.beyRenderer.rebuildPart(e),this._saveToStorage()}_onSectorUpdated(e){const n=this.store.findPartOfSector(e);n&&this.beyRenderer.rebuildPart(n),this._saveToStorage()}_onGroupAdded(e){const n=this.store.getGroup(e);this.tree.add(e,n.name,"📦",null),this._saveToStorage()}_onGroupRemoved(e){this.tree.remove(e),this._saveToStorage()}_onGroupUpdated(e){this.store.hasGroup(e)&&(this.tree.setLabel(e,this.store.getGroup(e).name),this._saveToStorage())}_rebuildSectorNodes(e){const n=this.store.getPart(e),i=this.tree.nodes;for(const[r]of i)this.store.hasSector(r)&&!n.sectorIds.includes(r)&&this.tree.remove(r);for(const r of n.sectorIds){const o=this.store.getSector(r);this.tree.nodes.has(r)||this.tree.add(r,o.name,"◔",e)}}_rebuildTree(){const e=this.tree.nodes;for(const[n]of e)n!=="axis"&&this.tree.remove(n);for(const n of this.store.getAllGroups())this.tree.add(n.id,n.name,"📦",null);for(const n of this.store.getRootChildIds())if(this.store.hasPart(n)){const i=this.store.getPart(n);this.tree.add(n,i.name,i.isHollow?"◯":"⬡",null);for(const r of i.sectorIds){const o=this.store.getSector(r);this.tree.add(r,o.name,"◔",n)}}for(const n of this.store.getAllParts())this.beyRenderer.rebuildPart(n.id);this.panel.showEmpty(),this._saveToStorage()}async _confirmReset(){await mr(`Reset the beyblade builder?
All parts, sectors and groups will be cleared.`,"Reset","Cancel")&&this._resetBuilder()}_resetBuilder(){this.animator.stopSpin(),this.animator.resetAngle(),this.playBtn.classList.remove("active"),this.stopBtn.classList.remove("active");for(const n of this.store.getAllParts())this.beyRenderer.removePart(n.id);this.store.reset(),this.history.clear(),this.tiltInput.value="0",this.pivotInput.value="0",this.spinLeftBtn.classList.remove("active"),this.spinRightBtn.classList.add("active"),this._applyAxisPose(),this._setViewMode("hitbox");const e=this.tree.nodes;for(const[n]of e)n!=="axis"&&this.tree.remove(n);this.panel.showEmpty(),this._syncUndoButtons(),localStorage.removeItem(Eo)}_undo(){this.history.canUndo&&(this.history.undo(),this._rebuildTree())}_redo(){this.history.canRedo&&(this.history.redo(),this._rebuildTree())}_syncUndoButtons(){this.undoBtn.style.opacity=this.history.canUndo?"1":"0.4",this.redoBtn.style.opacity=this.history.canRedo?"1":"0.4"}_saveToStorage(){try{const e=this.store.serialize();localStorage.setItem(Eo,JSON.stringify(e))}catch{}}_loadFromStorage(){try{const e=localStorage.getItem(Eo);if(!e)return;const n=JSON.parse(e);if(n.version!==S0)return;this.store.deserialize(n);const i=this.store.getAxis();this.tiltInput.value=String(i.tiltAngle),this.pivotInput.value=String(i.pivotOffset),i.spinDir==="left"&&(this.spinLeftBtn.classList.add("active"),this.spinRightBtn.classList.remove("active")),this._applyAxisPose(),this._rebuildTree();for(const r of this.store.getAllParts())if(r.presentationSTLb64){const o=new Hc,a=Uint8Array.from(atob(r.presentationSTLb64),l=>l.charCodeAt(0)).buffer,c=o.parse(a);this.beyRenderer.loadPresentationSTL(r.id,c)}}catch{}}}const Rn=Math.PI*2,ze=Math.PI/180,hn=100,Qc=30,tl=8,el=15260864,nl=20,Jn=.5,Tn=.02,il=2,To=6,Hi={PARABOLIC_BOWL:64,STRAIGHT_BOWL:48,SCOOP_RINGS:36,MOAT_HALF:20},gr=new Map,_r=new Map;function Ko(s){return s.surface==="custom_png"&&s.customTileData?`custom:${s.customTileData.slice(0,40)}:${s.tileScale}`:`${s.color}_${s.surface}`}function rh(s){return`${Ko(s)}:${s.transparent?"t":"o"}:${s.opacity??1}:${s.side??we}`}function oh(s,t){const n=document.createElement("canvas");n.width=n.height=256;const i=n.getContext("2d"),r=s>>16&255,o=s>>8&255,a=s&255,c=`rgb(${r},${o},${a})`,l=`rgba(${Math.min(r+64,255)},${Math.min(o+64,255)},${Math.min(a+64,255)},0.55)`,h=`rgba(${Math.max(r-50,0)},${Math.max(o-50,0)},${Math.max(a-50,0)},0.60)`;switch(i.fillStyle=c,i.fillRect(0,0,256,256),t){case"checker":{i.fillStyle=l;for(let d=0;d<256;d+=32)for(let p=0;p<256;p+=32)(d/32+p/32)%2===0&&i.fillRect(d,p,32,32);break}case"grid":{i.strokeStyle=l,i.lineWidth=2;for(let u=0;u<=256;u+=32)i.beginPath(),i.moveTo(u,0),i.lineTo(u,256),i.stroke(),i.beginPath(),i.moveTo(0,u),i.lineTo(256,u),i.stroke();break}case"hex":{const d=28*Math.sqrt(3)/2;i.strokeStyle=l,i.lineWidth=2;for(let p=-1;p<256/d+1;p++)for(let g=-1;g<256/28+1;g++){const _=g*28*1.5+p%2*28*.75,f=p*d;i.beginPath();for(let m=0;m<6;m++){const x=(m*60-30)*ze;m===0?i.moveTo(_+28/2*Math.cos(x),f+28/2*Math.sin(x)):i.lineTo(_+28/2*Math.cos(x),f+28/2*Math.sin(x))}i.closePath(),i.stroke()}break}case"stripes":{i.strokeStyle=l,i.lineWidth=10;for(let u=-256;u<256*2;u+=24)i.beginPath(),i.moveTo(u,0),i.lineTo(u+256,256),i.stroke();break}case"dots":{i.fillStyle=l;for(let u=16;u<256;u+=32)for(let d=16;d<256;d+=32)i.beginPath(),i.arc(u,d,6,0,Rn),i.fill();break}case"concrete":{i.fillStyle=l;for(let u=0;u<1800;u++){const d=Math.random()*256,p=Math.random()*256,g=Math.random()*5+1;i.fillRect(d,p,g,g*.4)}break}case"metal":{for(let u=0;u<256;u+=3)i.fillStyle=`rgba(255,255,255,${Math.random()*.15})`,i.fillRect(0,u,256,2);break}case"wood":{for(let u=8;u<256;u+=14)i.strokeStyle=h,i.lineWidth=3+u%3,i.beginPath(),i.arc(256/2,256/2,u,0,Rn),i.stroke();break}case"ice":{i.strokeStyle=l,i.lineWidth=1.5;const u=[[50,0,180,200],[200,30,60,220],[120,80,240,180],[0,120,160,256],[80,180,250,40]];for(const[d,p,g,_]of u)i.beginPath(),i.moveTo(d,p),i.lineTo((d+g)/2+(Math.random()-.5)*40,(p+_)/2+(Math.random()-.5)*40),i.lineTo(g,_),i.stroke();break}case"sand":{i.fillStyle=l;for(let u=0;u<3e3;u++){const d=Math.random()*256,p=Math.random()*256;i.fillRect(d,p,1.5,1.5)}break}case"lava_rock":{const u=[];for(let p=0;p<25;p++)u.push([Math.random()*256,Math.random()*256]);const d=i.getImageData(0,0,256,256);for(let p=0;p<256;p++)for(let g=0;g<256;g++){let _=1/0,f=0;for(let v=0;v<u.length;v++){const M=(g-u[v][0])**2+(p-u[v][1])**2;M<_&&(_=M,f=v)}const m=f%2===0?.85:1,x=(p*256+g)*4;d.data[x]=Math.round(r*m),d.data[x+1]=Math.round(o*m),d.data[x+2]=Math.round(a*m),d.data[x+3]=255}i.putImageData(d,0,0);break}}return n}function ve(s){const t=rh(s),e=_r.get(t);if(e)return e.refs++,e.mat;let n=null;if(s.surface!=="plain"){const a=Ko(s),c=gr.get(a);if(c)c.refs++,n=c.tex;else{let l;if(s.surface==="custom_png"&&s.customTileData)l=new V_().load(s.customTileData);else{const h=oh(s.color,s.surface);l=new Oo(h)}l.wrapS=l.wrapT=rr,l.repeat.set(20/s.tileScale,20/s.tileScale),gr.set(a,{tex:l,refs:1}),n=l}}const i=s.surface==="metal"?.25:s.surface==="ice"?.1:.65,r=s.surface==="metal"?.7:s.surface==="ice"?.1:.08,o=new ss({color:s.surface==="plain"?s.color:16777215,map:n??void 0,side:s.side??we,roughness:i,metalness:r,transparent:s.transparent??!1,opacity:s.opacity??1});return _r.set(t,{mat:o,refs:1}),o}function vr(s,t=1){return new ss({color:new bt(s.color),emissive:new bt(s.emissive),emissiveIntensity:s.emissiveIntensity*.5,side:we,roughness:.6,metalness:0,transparent:t<1,opacity:t,depthWrite:t>=1})}function y0(s){const t=rh(s),e=_r.get(t);if(e&&(e.refs--,e.refs<=0)){e.mat.dispose(),_r.delete(t);const n=Ko(s),i=gr.get(n);i&&(i.refs--,i.refs<=0&&(i.tex.dispose(),gr.delete(n)))}}function b0(s,t,e){for(const n of e)if(ah(s,t,n))return!0;return!1}function ah(s,t,e){const n=s-e.cx,i=t-e.cz,r=Math.cos(-e.rotY),o=Math.sin(-e.rotY),a=n*r-i*o,c=n*o+i*r;if(e.pts){const l=e.pts,h=l.length;let u=!1;for(let d=0,p=h-1;d<h;p=d++)l[d].y>c!=l[p].y>c&&a<(l[p].x-l[d].x)*(c-l[d].y)/(l[p].y-l[d].y)+l[d].x&&(u=!u);return u}return(a/e.rx)**2+(c/e.rz)**2<=1}function E0(s,t,e,n,i){const r=Math.cos(-i.rotY),o=Math.sin(-i.rotY),a=s-i.cx,c=t-i.cz,l=e-i.cx,h=n-i.cz,u=a*r-c*o,d=a*o+c*r,p=l*r-h*o,g=l*o+h*r,_=p-u,f=g-d;let m=1/0;if(i.pts){const x=i.pts,v=x.length;for(let M=0;M<v;M++){const R=x[M].x,w=x[M].y,A=x[(M+1)%v].x,I=x[(M+1)%v].y,E=_*(I-w)-f*(A-R);if(Math.abs(E)<1e-10)continue;const y=((R-u)*(I-w)-(w-d)*(A-R))/E,P=((R-u)*f-(w-d)*_)/E;y>=-1e-6&&y<=1+1e-6&&P>=-1e-6&&P<=1+1e-6&&(m=Math.min(m,Math.max(0,y)))}}else{const x=i.rx,v=i.rz,M=(_/x)**2+(f/v)**2,R=2*(u*_/x**2+d*f/v**2),w=(u/x)**2+(d/v)**2-1,A=R*R-4*M*w;if(A>=0){const I=Math.sqrt(A);for(const E of[(-R-I)/(2*M),(-R+I)/(2*M)])E>=-1e-6&&E<=1+1e-6&&(m=Math.min(m,Math.max(0,E)))}}return m===1/0?-1:m}function T0(s,t){const e=s.length,n=s.map(r=>ah(r.x,r.z,t));if(n.every(r=>!r))return s;if(n.every(r=>r))return[];const i=[];for(let r=0;r<e;r++){const o=(r+1)%e,a=s[r],c=s[o],l=n[r],h=n[o];if(l||i.push(a),l!==h){const u=E0(a.x,a.z,c.x,c.z,t);u>=0&&i.push({x:a.x+u*(c.x-a.x),y:a.y+u*(c.y-a.y),z:a.z+u*(c.z-a.z)})}}return i}function Ui(s,t,e,n,i){let r=s;for(const a of t)if(r=T0(r,a),r.length<3)return;const o=e.length/3;for(const a of r)e.push(a.x,a.y,a.z);for(let a=1;a<r.length-1;a++)i?n.push(o,o+a+1,o+a):n.push(o,o+a,o+a+1)}function ch(s,t,e,n=[],i=!1){const r=s.length,o=[],a=[];if(n.length===0){o.push(0,e(0,0,0),0);for(let l=1;l<=t;l++){const h=l/t;for(let u=0;u<r;u++){const d=s[u].x*h,p=s[u].y*h;o.push(d,e(d,p,h),p)}}for(let l=0;l<r;l++){const h=1+l,u=1+(l+1)%r;i?a.push(0,u,h):a.push(0,h,u)}for(let l=1;l<t;l++){const h=1+(l-1)*r,u=1+l*r;for(let d=0;d<r;d++){const p=h+d,g=h+(d+1)%r,_=u+d,f=u+(d+1)%r;a.push(p,g,_,g,f,_)}}}else{const l={x:0,y:e(0,0,0),z:0},h=[];for(let u=1;u<=t;u++){const d=u/t,p=[];for(let g=0;g<r;g++){const _=s[g].x*d,f=s[g].y*d;p.push({x:_,y:e(_,f,d),z:f})}h.push(p)}for(let u=0;u<r;u++)Ui([l,h[0][u],h[0][(u+1)%r]],n,o,a,i);for(let u=0;u<t-1;u++){const d=h[u],p=h[u+1];for(let g=0;g<r;g++){const _=d[g],f=d[(g+1)%r],m=p[g],x=p[(g+1)%r];Ui([_,f,m],n,o,a,!1),Ui([f,x,m],n,o,a,!1)}}}const c=new qt;return c.setAttribute("position",new zt(o,3)),c.setIndex(a),c.computeVertexNormals(),c}function A0(s,t,e,n,i,r,o,a){const c=s.length,l=n-e,h=(f,m,x)=>n-e*(1-x*x);if(a.length===0){i.push(0,l,0);for(let f=1;f<=t;f++){const m=f/t,x=n-e*(1-m*m);for(let v=0;v<c;v++)i.push(s[v].x*m,x,s[v].y*m)}for(let f=0;f<c;f++){const m=o+1+f,x=o+1+(f+1)%c;r.push(o+0,x,m)}for(let f=1;f<t;f++){const m=o+1+(f-1)*c,x=o+1+f*c;for(let v=0;v<c;v++){const M=m+v,R=m+(v+1)%c,w=x+v,A=x+(v+1)%c;r.push(M,R,w,R,A,w)}}return o+1+t*c}const u={x:0,y:l,z:0},d=[];for(let f=1;f<=t;f++){const m=f/t,x=[];for(let v=0;v<c;v++){const M=s[v].x*m,R=s[v].y*m;x.push({x:M,y:h(M,R,m),z:R})}d.push(x)}const p=[],g=[];for(let f=0;f<c;f++)Ui([u,d[0][f],d[0][(f+1)%c]],a,p,g,!0);for(let f=0;f<t-1;f++){const m=d[f],x=d[f+1];for(let v=0;v<c;v++){const M=m[v],R=m[(v+1)%c],w=x[v],A=x[(v+1)%c];Ui([M,R,w],a,p,g,!1),Ui([R,A,w],a,p,g,!1)}}const _=i.length/3;for(const f of p)i.push(f);for(const f of g)r.push(_+f);return _+p.length/3}function Rr(s,t){const e=s.length,n=[];for(let i=0;i<e;i++){const r=s[i],o=s[(i+1)%e];n.push(r.x,t,r.y,o.x,t,o.y)}return n}function $o(s,t,e){const n=s.length,i=t-e,r=[];for(let a=0;a<n;a++){const c=s[a],l=s[(a+1)%n];r.push(c.x,i,c.y,l.x,i,l.y)}const o=Math.max(1,Math.floor(n/8));for(let a=0;a<n;a+=o)r.push(s[a].x,t,s[a].y,s[a].x,i,s[a].y);return r}function Cn(s,t){const e=t*ze;return{lx:s*Math.cos(e),lz:s*Math.sin(e)}}function Cr(s){const{lx:t,lz:e}=Cn(s.posR,s.posAngle);return{cx:t,cz:e,rotY:s.rotY*ze}}function fe(s){const{radiusX:t,radiusZ:e,openingShape:n,sides:i,starInner:r}=s,o=[];switch(n){case"circle":case"ellipse":{for(let c=0;c<96;c++){const l=c/96*Rn;o.push(new Q(t*Math.cos(l),e*Math.sin(l)))}break}case"rectangle":o.push(new Q(t,e),new Q(-t,e),new Q(-t,-e),new Q(t,-e));break;case"hexagon":for(let a=0;a<6;a++){const c=a/6*Rn+Math.PI/6;o.push(new Q(t*Math.cos(c),e*Math.sin(c)))}break;case"triangle":for(let a=0;a<3;a++){const c=a/3*Rn-Math.PI/2;o.push(new Q(t*Math.cos(c),e*Math.sin(c)))}break;case"star":{const a=Math.max(3,Math.min(12,Math.round(i))),c=Math.max(.1,Math.min(.95,r));for(let l=0;l<a*2;l++){const h=l/(a*2)*Rn-Math.PI/2,u=l%2===0?1:c;o.push(new Q(t*u*Math.cos(h),e*u*Math.sin(h)))}break}}return o}function lh(s,t){if(s.length===t)return s;const e=s.length,n=[0];for(let o=0;o<e;o++){const a=s[o],c=s[(o+1)%e];n.push(n[o]+Math.hypot(c.x-a.x,c.y-a.y))}const i=n[e],r=[];for(let o=0;o<t;o++){const a=o/t*i;let c=0;for(let p=0;p<e;p++)if(n[p+1]>=a){c=p;break}const l=n[c+1]-n[c],h=l>0?(a-n[c])/l:0,u=s[c],d=s[(c+1)%e];r.push(new Q(u.x+(d.x-u.x)*h,u.y+(d.y-u.y)*h))}return r}function hh(s,t,e){const n=s.posY;if(s.wallProfile==="straight")return n-s.depth;const i=Math.min(Math.sqrt((t/s.radiusX)**2+(e/s.radiusZ)**2),1);return n-s.depth*(1-i*i)}function uh(s,t){const e=s.posY;if(s.wallProfile==="straight")return e-s.depth;const n=Math.max(s.radiusX,s.radiusZ,.001),i=Math.min(t/n,1);return e-s.depth*(1-i*i)}function w0(s,t,e,n){const{lx:i,lz:r}=Cn(s.posR,s.posAngle),o=hh(t,i,r),a=s.rotY*ze,c=Math.cos(-a),l=Math.sin(-a),h=e-i,u=n-r,d=h*c-u*l,p=h*l+u*c,g=Math.min(Math.sqrt((d/s.radiusX)**2+(p/s.radiusZ)**2),1);return o-s.depth*(1-g*g)}function ms(s,t,e){if(s.parentZoneId){const n=e.get(s.parentZoneId);if(n)return(i,r)=>w0(n,t,i,r)}return(n,i)=>hh(t,n,i)}function gs(s,t){const{lx:e,lz:n}=Cn(t.posR,t.posAngle),i=Math.cos(s.rotY),r=Math.sin(s.rotY);return{wx:s.posX+e*i-n*r,wz:s.posZ+e*r+n*i,wRotY:s.rotY+t.rotY*ze}}const dh={water:{color:1736660,opacity:.65,emissive:17663,emissiveIntensity:.08,glowColor:3381759},lava:{color:16724736,opacity:.8,emissive:16720384,emissiveIntensity:.35,glowColor:16737792},swamp:{color:4021274,opacity:.75,emissive:2245632,emissiveIntensity:.05,glowColor:3364096},poison:{color:8913100,opacity:.7,emissive:6684842,emissiveIntensity:.15,glowColor:11141375},sand:{color:13936707,opacity:.85,emissive:0,emissiveIntensity:0,glowColor:null},ice:{color:11197951,opacity:.6,emissive:8965375,emissiveIntensity:.08,glowColor:11197951},void:{color:0,opacity:1,emissive:0,emissiveIntensity:0,glowColor:null},custom:{color:16777215,opacity:.7,emissive:0,emissiveIntensity:0,glowColor:null}},R0={water:"💧 Water",lava:"🔥 Lava",swamp:"🌿 Swamp",poison:"☠ Poison",sand:"🏜 Sand",ice:"❄ Ice",void:"🌑 Void",custom:"🎨 Custom"};function fh(s){if(s.fill==="custom")return{color:s.fillColor??16777215,opacity:s.fillOpacity,emissive:0,emissiveIntensity:0,glowColor:null};const t=dh[s.fill];return{color:t.color,opacity:t.opacity,emissive:t.emissive,emissiveIntensity:t.emissiveIntensity,glowColor:t.glowColor}}function Jo(s,t,e=0,n=[]){const i=n.length>0?Hi.PARABOLIC_BOWL*2:Hi.PARABOLIC_BOWL;return ch(s,i,(o,a,c)=>e-t*(1-c*c),n,!0)}function ph(s,t,e=0){const n=s.length,i=[],r=[];for(const a of s)i.push(a.x,e,a.y);for(const a of s)i.push(a.x,e-t,a.y);i.push(0,e-t,0);for(let a=0;a<n;a++){const c=a,l=(a+1)%n,h=n+a,u=n+(a+1)%n;r.push(c,l,h,l,u,h)}for(let a=0;a<n;a++)r.push(2*n,n+(a+1)%n,n+a);const o=new qt;return o.setAttribute("position",new zt(i,3)),o.setIndex(r),o.computeVertexNormals(),o}function mh(s,t,e,n=0){const i=[...Rr(s,n),...e==="straight"?$o(s,n,t):[]],r=new qt;return r.setAttribute("position",new zt(i,3)),r}function Pr(s,t,e,n,i,r,o=0){const a=s.length,c=lh(t,a),l=Hi.MOAT_HALF,h=o-e,u=e+r,d=s.map((v,M)=>new Q((v.x+c[M].x)/2,(v.y+c[M].y)/2)),p=[],g=n==="parabolic"?d:s;for(let v=0;v<=l;v++){const M=v/l,R=1-M,w=n==="parabolic"?o-e*(1-R*R):o-e*M,A=[];for(let I=0;I<a;I++)A.push([s[I].x*(1-M)+g[I].x*M,w,s[I].y*(1-M)+g[I].y*M]);p.push(A)}if(n==="straight"||i==="straight"){const v=i==="parabolic"?d:c,M=8;for(let w=1;w<=M;w++){const A=w/M,I=[];for(let E=0;E<a;E++)I.push([g[E].x*(1-A)+v[E].x*A,h,g[E].y*(1-A)+v[E].y*A]);p.push(I)}const R=i==="parabolic"?d:c;for(let w=1;w<=l;w++){const A=w/l,I=i==="parabolic"?h+u*A*A:h+u*A,E=[];for(let y=0;y<a;y++)E.push([R[y].x*(1-A)+c[y].x*A,I,R[y].y*(1-A)+c[y].y*A]);p.push(E)}}else for(let v=1;v<=l;v++){const M=v/l,R=h+u*M*M,w=[];for(let A=0;A<a;A++)w.push([d[A].x*(1-M)+c[A].x*M,R,d[A].y*(1-M)+c[A].y*M]);p.push(w)}const _=[];for(const v of p)for(const M of v)_.push(M[0],M[1],M[2]);const f=[],m=p.length;for(let v=0;v<m-1;v++){const M=v*a,R=(v+1)*a;for(let w=0;w<a;w++){const A=M+w,I=M+(w+1)%a,E=R+w,y=R+(w+1)%a;f.push(A,I,E,I,y,E)}}const x=new qt;return x.setAttribute("position",new zt(_,3)),x.setIndex(f),x.computeVertexNormals(),x}function Lr(s,t,e,n,i=0){const r=s.length,o=lh(t,r),a=i+n,c=Math.max(1,Math.floor(r/8)),l=[...Rr(s,i),...$o(s,i,e)];for(let u=0;u<r;u++){const d=o[u],p=o[(u+1)%r];l.push(d.x,a,d.y,p.x,a,p.y),l.push(d.x,i-e,d.y,p.x,i-e,p.y),u%c===0&&l.push(d.x,a,d.y,d.x,i-e,d.y)}const h=new qt;return h.setAttribute("position",new zt(l,3)),h}function Qo(s,t,e,n=0,i=[]){const r=s.length,o=n-t,a=[],c=[];let l=0;if(e==="parabolic"){const _=i.length>0?Hi.PARABOLIC_BOWL*2:Hi.STRAIGHT_BOWL;l=A0(s,_,t,n,a,c,l,i)}else{const _=l;for(const x of s)a.push(x.x,n,x.y);const f=_+r;for(const x of s)a.push(x.x,o,x.y);for(let x=0;x<r;x++){const v=_+x,M=_+(x+1)%r,R=f+x,w=f+(x+1)%r;c.push(v,M,R,M,w,R)}const m=f+r;a.push(0,o,0);for(let x=0;x<r;x++)i.length>0&&b0((s[x].x+s[(x+1)%r].x)/3,(s[x].y+s[(x+1)%r].y)/3,i)||c.push(m,f+x,f+(x+1)%r);l=m+1}const h=l;for(const _ of s)a.push(_.x,n,_.y);const u=h+r;for(const _ of s)a.push(_.x,o,_.y);for(let _=0;_<r;_++){const f=h+_,m=h+(_+1)%r,x=u+_,v=u+(_+1)%r;c.push(f,x,m,m,x,v)}l=u+r;const d=l;a.push(0,o,0);const p=d+1;for(const _ of s)a.push(_.x,o,_.y);for(let _=0;_<r;_++)c.push(d,p+_,p+(_+1)%r);const g=new qt;return g.setAttribute("position",new zt(a,3)),g.setIndex(c),g.computeVertexNormals(),g}function gh(s,t,e=0){const n=[...Rr(s,e),...$o(s,e,t)],i=new qt;return i.setAttribute("position",new zt(n,3)),i}function _h(s,t,e,n,i,r,o){const a=s.length,c=Math.cos(r),l=Math.sin(r);function h(f,m){return o(n+f*c-m*l,i+f*l+m*c)}if(e==="parabolic"){const f=h(0,0),m=(x,v,M)=>(M===0?f:h(x,v))-t*(1-M*M)+Tn*M*M;return ch(s,Hi.SCOOP_RINGS,m)}const u=[],d=[],p=h(0,0)-t;for(let f=0;f<a;f++)u.push(s[f].x,h(s[f].x,s[f].y)+Tn,s[f].y);for(let f=0;f<a;f++)u.push(s[f].x,p,s[f].y);const g=2*a;u.push(0,p,0);for(let f=0;f<a;f++){const m=f,x=(f+1)%a,v=a+f,M=a+(f+1)%a;d.push(m,v,x,x,v,M)}for(let f=0;f<a;f++)d.push(g,a+(f+1)%a,a+f);const _=new qt;return _.setAttribute("position",new zt(u,3)),_.setIndex(d),_.computeVertexNormals(),_}function vh(s,t,e,n,i,r,o){const a=s.length,c=Math.cos(r),l=Math.sin(r);function h(f,m){return o(n+f*c-m*l,i+f*l+m*c)}const d=h(0,0)-t,p=Rr(s.map(f=>new Q(f.x,f.y)),0);p.length=0;for(let f=0;f<a;f++){const m=s[f],x=s[(f+1)%a],v=h(m.x,m.y)+Tn,M=h(x.x,x.y)+Tn;p.push(m.x,v,m.y,x.x,M,x.y)}const g=Math.max(1,Math.floor(a/8));for(let f=0;f<a;f+=g){const m=s[f],x=h(m.x,m.y)+Tn;if(e==="parabolic")for(let v=0;v<12;v++){const M=v/12,R=(v+1)/12,w=h(m.x*M,m.y*M),A=h(m.x*R,m.y*R),I=M===0?d:w-t*(1-M*M)+Tn*M*M,E=R===1?x:A-t*(1-R*R)+Tn*R*R;p.push(m.x*M,I,m.y*M,m.x*R,E,m.y*R)}else p.push(m.x,x,m.y,m.x,d,m.y)}const _=new qt;return _.setAttribute("position",new zt(p,3)),_}function Ir(s,t,e,n,i,r,o){return{meshGeo:_h(s,t,e,n,i,r,o),edgeGeo:vh(s,t,e,n,i,r,o)}}function Vi(s,t,e,n,i){const r=s.length,o=Math.cos(n),a=Math.sin(n);function c(d,p){return i(t+d*o-p*a,e+d*a+p*o)}const l=[],h=[];for(let d=0;d<=To;d++){const p=d/To;for(let g=0;g<r;g++){const _=s[g].x,f=s[g].y,m=Math.sqrt(_*_+f*f),x=m>0?_+_/m*il*p:_,v=m>0?f+f/m*il*p:f;l.push(x,c(x,v)+Tn*(1-p),v)}}for(let d=0;d<To;d++)for(let p=0;p<r;p++){const g=d*r+p,_=d*r+(p+1)%r,f=(d+1)*r+p,m=(d+1)*r+(p+1)%r;h.push(g,_,f,_,m,f)}const u=new qt;return u.setAttribute("position",new zt(l,3)),u.setIndex(h),u.computeVertexNormals(),u}function sl(s,t,e,n,i){const r=[];for(let c=0;c<s;c++){const l=c/s*Rn+e;r.push(new Q(t*Math.cos(l),t*Math.sin(l)))}const o=new Tr(r);for(const c of i){if(c.posY>Jn)continue;const l=Math.max(c.radiusX,c.radiusZ);if(i.some(_=>{if(_===c||_.posY>Jn||Math.max(_.radiusX,_.radiusZ)<=l)return!1;const f=c.posX-_.posX,m=c.posZ-_.posZ,x=Math.cos(-_.rotY),v=Math.sin(-_.rotY),M=f*x-m*v,R=f*v+m*x;return(M/_.radiusX)**2+(R/_.radiusZ)**2<=1}))continue;const u=fe(c),d=Math.cos(c.rotY),p=Math.sin(c.rotY),g=u.map(_=>new Q(_.x*d-_.y*p+c.posX,_.x*p+_.y*d+c.posZ)).reverse();o.holes.push(new as(g))}const a=new fs(o);return a.rotateX(Math.PI/2),a.translate(0,n,0),a}function rl(s,t,e){const n=-s.depth,i=Math.cos(s.rotY),r=Math.sin(s.rotY),o=fe(s).map(l=>new Q(l.x*i-l.y*r,l.x*r+l.y*i)),a=new Tr(o);for(const l of[...t,...e]){const{lx:h,lz:u}=Cn(l.posR,l.posAngle),d=h*i-u*r,p=h*r+u*i,g=Math.cos(l.rotY*ze),_=Math.sin(l.rotY*ze),f=fe(l).map(m=>new Q(m.x*g-m.y*_+d,m.x*_+m.y*g+p)).reverse();a.holes.push(new as(f))}const c=new fs(a);return c.rotateX(Math.PI/2),c.translate(0,n,0),c}function ol(s,t=[]){const e=s.innerRimOffset,n=fe({openingShape:s.innerOpeningShape,radiusX:s.innerRadiusX,radiusZ:s.innerRadiusZ,sides:s.innerSides,starInner:s.innerStarInner}),i=new Tr(n);for(const o of t){const a=new as;a.absellipse(o.cx,o.cz,o.rx,o.rz,0,Rn,!1,0),i.holes.push(a)}const r=new fs(i);return r.rotateX(Math.PI/2),r.translate(0,e,0),r}function _s(s){return new bt(s).lerp(new bt(16777215),.5)}function al(s,t=[]){const e=fe(s),n=ve({color:s.color,surface:s.surface,customTileData:s.customTileData,tileScale:s.tileScale}),i=0;let r,o;if(s.isMoat){const l=fe({openingShape:s.innerOpeningShape,radiusX:s.innerRadiusX,radiusZ:s.innerRadiusZ,sides:s.innerSides,starInner:s.innerStarInner});r=Pr(e,l,s.depth,s.wallProfile,s.innerWallProfile,s.innerRimOffset,i),o=Lr(e,l,s.depth,s.innerRimOffset,i)}else s.posY>Jn?(r=Qo(e,s.depth,s.wallProfile,i,t),o=gh(e,s.depth,i)):(r=s.wallProfile==="parabolic"?Jo(e,s.depth,i,t):ph(e,s.depth,i),o=mh(e,s.depth,s.wallProfile,i));const a=new Yt(r,n);a.position.set(s.posX,s.posY,s.posZ),a.rotation.y=s.rotY;const c=new fn(o,new dn({color:_s(s.color)}));return c.position.set(s.posX,s.posY,s.posZ),c.rotation.y=s.rotY,[a,c]}function Ao(s,t=[]){const e=fe(s);s.mesh.geometry.dispose(),s.edges.geometry.dispose();const n=0;if(s.isMoat){const i=fe({openingShape:s.innerOpeningShape,radiusX:s.innerRadiusX,radiusZ:s.innerRadiusZ,sides:s.innerSides,starInner:s.innerStarInner});s.mesh.geometry=Pr(e,i,s.depth,s.wallProfile,s.innerWallProfile,s.innerRimOffset,n),s.edges.geometry=Lr(e,i,s.depth,s.innerRimOffset,n)}else s.posY>Jn?(s.mesh.geometry=Qo(e,s.depth,s.wallProfile,n,t),s.edges.geometry=gh(e,s.depth,n)):(s.mesh.geometry=s.wallProfile==="parabolic"?Jo(e,s.depth,n,t):ph(e,s.depth,n),s.edges.geometry=mh(e,s.depth,s.wallProfile,n));for(const i of[s.mesh,s.edges])i.position.set(s.posX,s.posY,s.posZ),i.rotation.y=s.rotY}function cl(s,t,e,n,i){const r=fe(s),a=Vi(r,0,0,0,(h,u)=>0),c=ve({color:t,surface:e,customTileData:n,tileScale:i}),l=new Yt(a,c);return l.position.set(s.posX,s.posY,s.posZ),l.rotation.y=s.rotY,l}function ll(s){const t={color:s.color,surface:s.surface,customTileData:s.customTileData,tileScale:s.tileScale};y0(t),s.mesh.material=ve(t),s.edges.material.color.copy(_s(s.color))}function hl(s,t,e,n){const i=fe(s),r=ve({color:s.color,surface:s.surface,customTileData:s.customTileData,tileScale:s.tileScale}),{cx:o,cz:a,rotY:c}=Cr(s),l=ms({parentZoneId:null},t,n),{meshGeo:h,edgeGeo:u}=Ir(i,s.depth,"straight",o,a,c,l),{wx:d,wz:p,wRotY:g}=gs(t,s),_=new Yt(h,r);_.position.set(d,0,p),_.rotation.y=g;const f=new fn(u,new dn({color:_s(s.color)}));f.position.set(d,0,p),f.rotation.y=g;const m=ve({color:s.color,surface:s.surface,customTileData:s.customTileData,tileScale:s.tileScale}),x=new Yt(Vi(i,o,a,c,l),m);return x.position.set(d,0,p),x.rotation.y=g,[_,f,x]}function Yn(s,t,e,n){const i=fe(s),{cx:r,cz:o,rotY:a}=Cr(s),c=ms({parentZoneId:null},t,n);s.mesh.geometry.dispose(),s.edges.geometry.dispose();const{meshGeo:l,edgeGeo:h}=Ir(i,s.depth,"straight",r,o,a,c);s.mesh.geometry=l,s.edges.geometry=h,s.seamMesh.geometry.dispose(),s.seamMesh.geometry=Vi(i,r,o,a,c);const{wx:u,wz:d,wRotY:p}=gs(t,s);for(const g of[s.mesh,s.edges,s.seamMesh])g.position.set(u,0,d),g.rotation.y=p}function wo(s,t,e,n){const i=fe(s),{cx:r,cz:o,rotY:a}=Cr(s),c=ms(s,t,n),l=fh(s);let h,u;if(s.isMoat){const x=uh(t,s.posR),v=fe({openingShape:s.innerOpeningShape,radiusX:s.innerRadiusX,radiusZ:s.innerRadiusZ,sides:s.innerSides,starInner:s.innerStarInner});h=Pr(i,v,s.depth,"parabolic",s.innerWallProfile,s.innerRimOffset,x),u=Lr(i,v,s.depth,s.innerRimOffset,x)}else({meshGeo:h,edgeGeo:u}=Ir(i,s.depth,"parabolic",r,o,a,c));const{wx:d,wz:p,wRotY:g}=gs(t,s),_=new Yt(h,vr(l,s.fillOpacity));_.position.set(d,0,p),_.rotation.y=g;const f=new fn(u,new dn({color:_s(l.color)}));f.position.set(d,0,p),f.rotation.y=g;const m=new Yt(Vi(i,r,o,a,c),vr(l,s.fillOpacity));return m.position.set(d,0,p),m.rotation.y=g,[_,f,m]}function er(s,t,e,n,i){const r=fe(s),{cx:o,cz:a,rotY:c}=Cr(s),{wx:l,wz:h,wRotY:u}=gs(t,s),d=ms(s,t,i),p=fh(s);if(s.mesh.geometry.dispose(),s.edges.geometry.dispose(),s.isMoat){const g=uh(t,s.posR),_=fe({openingShape:s.innerOpeningShape,radiusX:s.innerRadiusX,radiusZ:s.innerRadiusZ,sides:s.innerSides,starInner:s.innerStarInner});s.mesh.geometry=Pr(r,_,s.depth,"parabolic",s.innerWallProfile,s.innerRimOffset,g),s.edges.geometry=Lr(r,_,s.depth,s.innerRimOffset,g)}else{const{meshGeo:g,edgeGeo:_}=Ir(r,s.depth,"parabolic",o,a,c,d);s.mesh.geometry=g,s.edges.geometry=_}s.mesh.material.dispose(),s.mesh.material=vr(p,s.fillOpacity),s.edges.material.color.copy(_s(p.color));for(const g of[s.mesh,s.edges])g.position.set(l,0,h),g.rotation.y=u;s.seamMesh.geometry.dispose(),s.seamMesh.geometry=Vi(r,o,a,c,d),s.seamMesh.material.dispose(),s.seamMesh.material=vr(p,s.fillOpacity),s.seamMesh.position.set(l,0,h),s.seamMesh.rotation.y=u}function C0(s){return{name:s,openingShape:"circle",wallProfile:"parabolic",radiusX:50,radiusZ:50,depth:20,sides:5,starInner:.5,color:8947848,surface:"plain",customTileData:null,tileScale:20,posX:0,posZ:0,posY:0,rotY:0,isMoat:!1,innerRadiusX:25,innerRadiusZ:25,innerOpeningShape:"circle",innerSides:5,innerStarInner:.5,innerWallProfile:"parabolic",innerRimOffset:0,pitIds:[],zoneIds:[],mesh:null,edges:null,floorMesh:null,islandMesh:null,rimSeamMesh:null}}function ul(s,t,e){return{id:e,name:s,parentArenaId:t,openingShape:"circle",radiusX:10,radiusZ:10,depth:8,sides:5,starInner:.5,color:5592405,surface:"plain",customTileData:null,tileScale:10,posR:0,posAngle:0,rotY:0,mesh:null,edges:null,seamMesh:null}}function dl(s,t,e,n=null){return{id:e,name:s,parentArenaId:t,parentZoneId:n,openingShape:"circle",radiusX:15,radiusZ:15,depth:8,sides:5,starInner:.5,color:3368601,surface:"plain",customTileData:null,tileScale:10,fill:"water",fillColor:null,fillOpacity:.65,posR:0,posAngle:0,rotY:0,isMoat:!1,innerRadiusX:8,innerRadiusZ:8,innerOpeningShape:"circle",innerSides:5,innerStarInner:.5,innerWallProfile:"parabolic",innerRimOffset:0,pitIds:[],zoneIds:[],mesh:null,edges:null,seamMesh:null}}const fl={circle:"Circle",ellipse:"Ellipse",rectangle:"Rect",hexagon:"Hexagon",triangle:"Triangle",star:"Star"},pl={circle:"●",ellipse:"◯",rectangle:"▭",hexagon:"⬡",triangle:"△",star:"★"},nr={plain:"Plain",checker:"Checker",grid:"Grid",hex:"Hex",stripes:"Stripes",dots:"Dots",concrete:"Concrete",metal:"Metal",wood:"Wood",ice:"Ice",sand:"Sand",lava_rock:"Lava",custom_png:"Custom"};class P0 extends sh{showBase(t,e,n,i){this.content.innerHTML="",this.section("OCTAGON BASE"),this.readRow("Flat-to-flat","200 cm"),this.numRow("Height",t.height,5,80,1,o=>{t.height=o,e()}),this.numRow("Sides",t.sides,3,16,1,o=>{t.sides=Math.round(o),e()}),this.section("SURFACE"),this.colorRow("Color",t.color,o=>{t.color=o,n(o)}),this.surfaceRow(t,i);const r=document.createElement("div");r.className="prop-hint",r.textContent="Click [+] on the base node to add an arena",this.content.appendChild(r)}showArena(t,e,n,i,r,o,a){this.content.innerHTML="",this.section("NAME");const c=document.createElement("input");c.type="text",c.className="prop-text-input",c.value=t.name,c.addEventListener("input",()=>{t.name=c.value,r(t.name)}),this.content.appendChild(c),this.section("OPENING SHAPE"),this.shapeGrid(t,i),t.openingShape==="star"&&(this.numRow("Points",t.sides,3,12,1,l=>{t.sides=Math.round(l),i()}),this.numRow("Inner frac",t.starInner,.1,.95,.05,l=>{t.starInner=l,n()})),this.section("MOAT"),this.toggleRow("Ring/Moat",t.isMoat,l=>{t.isMoat=l,i()}),t.isMoat&&(this.numRow("Inner R X",t.innerRadiusX,5,t.radiusX-5,1,l=>{t.innerRadiusX=l,n()}),this.numRow("Inner R Z",t.innerRadiusZ,5,t.radiusZ-5,1,l=>{t.innerRadiusZ=l,n()}),this.numRow("Inner Y offset",t.innerRimOffset,-t.depth+1,200,1,l=>{t.innerRimOffset=l,n()}),this.section("INNER SHAPE"),this.innerShapeGrid(t,i),this.section("OUTER WALL"),this.profileRow(t,"wallProfile",i),this.section("INNER WALL"),this.innerProfileRow(t,i)),t.isMoat||(this.section("WALL PROFILE"),this.profileRow(t,"wallProfile",i)),this.section("DIMENSIONS"),this.numRow("Radius X",t.radiusX,5,hn,1,l=>{t.radiusX=l,n()}),this.numRow("Radius Z",t.radiusZ,5,hn,1,l=>{t.radiusZ=l,n()}),this.numRow("Depth",t.depth,1,e,.5,l=>{t.depth=l,n()}),this.section("SURFACE"),this.colorRow("Color",t.color,l=>{t.color=l,o()}),this.surfaceRow(t,a),this.section("POSITION"),this.numRow("X",t.posX,-hn,hn,1,l=>{t.posX=l,n()}),this.numRow("Z",t.posZ,-hn,hn,1,l=>{t.posZ=l,n()}),this.numRow("Y (tower)",t.posY,0,200,1,l=>{t.posY=l,n()}),this.numRow("Rot Y °",In.radToDeg(t.rotY),-180,180,1,l=>{t.rotY=In.degToRad(l),n()})}showPit(t,e,n,i,r,o,a){this.content.innerHTML="",this.section("NAME");const c=document.createElement("input");c.type="text",c.className="prop-text-input",c.value=t.name,c.addEventListener("input",()=>{t.name=c.value,r(t.name)}),this.content.appendChild(c),this.section("OPENING SHAPE"),this.shapeGrid(t,i),t.openingShape==="star"&&(this.numRow("Points",t.sides,3,12,1,u=>{t.sides=Math.round(u),i()}),this.numRow("Inner frac",t.starInner,.1,.95,.05,u=>{t.starInner=u,n()})),this.section("DIMENSIONS");const l=Math.min(e.radiusX,e.radiusZ);this.numRow("Radius X",t.radiusX,2,Math.max(2,l-t.posR),1,u=>{t.radiusX=u,n()}),this.numRow("Radius Z",t.radiusZ,2,Math.max(2,l-t.posR),1,u=>{t.radiusZ=u,n()}),this.numRow("Depth",t.depth,1,e.depth,.5,u=>{t.depth=u,n()}),this.section("SURFACE"),this.colorRow("Color",t.color,u=>{t.color=u,o()}),this.surfaceRow(t,a),this.section("POSITION (arena-local)");const h=Math.max(t.radiusX,t.radiusZ);this.numRow("Dist (cm)",t.posR,0,Math.max(0,l-h),1,u=>{t.posR=u,n()}),this.numRow("Angle °",t.posAngle,0,360,1,u=>{t.posAngle=u,n()}),this.numRow("Rotate °",t.rotY,0,360,1,u=>{t.rotY=u,n()})}showZone(t,e,n,i,r){this.content.innerHTML="",this.section("NAME");const o=document.createElement("input");o.type="text",o.className="prop-text-input",o.value=t.name,o.addEventListener("input",()=>{t.name=o.value,r(t.name)}),this.content.appendChild(o),this.section("OPENING SHAPE"),this.shapeGrid(t,i),t.openingShape==="star"&&(this.numRow("Points",t.sides,3,12,1,h=>{t.sides=Math.round(h),i()}),this.numRow("Inner frac",t.starInner,.1,.95,.05,h=>{t.starInner=h,n()})),this.section("MOAT"),this.toggleRow("Ring/Moat",t.isMoat,h=>{t.isMoat=h,i()}),t.isMoat&&(this.numRow("Inner R X",t.innerRadiusX,2,t.radiusX-2,1,h=>{t.innerRadiusX=h,n()}),this.numRow("Inner R Z",t.innerRadiusZ,2,t.radiusZ-2,1,h=>{t.innerRadiusZ=h,n()}),this.numRow("Inner Y offset",t.innerRimOffset,-(t.depth-1),100,1,h=>{t.innerRimOffset=h,n()}),this.section("INNER SHAPE"),this.innerShapeGrid(t,i),this.section("INNER WALL"),this.innerProfileRow(t,i)),this.section("DIMENSIONS");const a=Math.min(e.radiusX,e.radiusZ),c=Math.min(15,e.depth);this.numRow("Radius X",t.radiusX,2,Math.max(2,a-t.posR),1,h=>{t.radiusX=h,n()}),this.numRow("Radius Z",t.radiusZ,2,Math.max(2,a-t.posR),1,h=>{t.radiusZ=h,n()}),this.numRow("Depth",t.depth,1,c,.5,h=>{t.depth=h,n()}),this.section("FILL"),this.fillGrid(t,n),this.section("POSITION (arena-local)");const l=Math.max(t.radiusX,t.radiusZ);this.numRow("Dist (cm)",t.posR,0,Math.max(0,a-l),1,h=>{t.posR=h,n()}),this.numRow("Angle °",t.posAngle,0,360,1,h=>{t.posAngle=h,n()}),this.numRow("Rotate °",t.rotY,0,360,1,h=>{t.rotY=h,n()})}shapeGrid(t,e){const n=document.createElement("div");n.className="prop-shape-grid",["circle","ellipse","rectangle","hexagon","triangle","star"].forEach(i=>{const r=document.createElement("button");r.className="prop-shape-btn"+(t.openingShape===i?" active":""),r.innerHTML=`<span class="prop-shape-icon">${pl[i]}</span><span>${fl[i]}</span>`,r.addEventListener("click",()=>{t.openingShape=i,e()}),n.appendChild(r)}),this.content.appendChild(n)}innerShapeGrid(t,e){const n=document.createElement("div");n.className="prop-shape-grid",["circle","ellipse","rectangle","hexagon","triangle","star"].forEach(i=>{const r=document.createElement("button");r.className="prop-shape-btn"+(t.innerOpeningShape===i?" active":""),r.innerHTML=`<span class="prop-shape-icon">${pl[i]}</span><span>${fl[i]}</span>`,r.addEventListener("click",()=>{t.innerOpeningShape=i,e()}),n.appendChild(r)}),this.content.appendChild(n),t.innerOpeningShape==="star"&&(this.numRow("Points",t.innerSides,3,12,1,i=>{t.innerSides=Math.round(i),e()}),this.numRow("Inner frac",t.innerStarInner,.1,.95,.05,i=>{t.innerStarInner=i,e()}))}profileRow(t,e,n){const i=document.createElement("div");i.className="prop-profile-row",["parabolic","straight"].forEach(r=>{const o=document.createElement("button");o.className="prop-profile-btn"+(t.wallProfile===r?" active":""),o.textContent=r==="parabolic"?"⌣ Bowl":"▮ Straight",o.addEventListener("click",()=>{t.wallProfile=r,n()}),i.appendChild(o)}),this.content.appendChild(i)}innerProfileRow(t,e){const n=document.createElement("div");n.className="prop-profile-row",["parabolic","straight"].forEach(i=>{const r=document.createElement("button");r.className="prop-profile-btn"+(t.innerWallProfile===i?" active":""),r.textContent=i==="parabolic"?"⌣ Bowl":"▮ Straight",r.addEventListener("click",()=>{t.innerWallProfile=i,e()}),n.appendChild(r)}),this.content.appendChild(n)}surfaceRow(t,e){const n=["plain","checker","grid","hex","stripes","dots","concrete","metal","wood","ice","sand","lava_rock","custom_png"],i=document.createElement("div");i.className="prop-surface-grid";const r=[];for(const o of n){const a=document.createElement("button");if(a.className="prop-surface-btn"+(t.surface===o?" active":""),a.title=nr[o],o!=="custom_png"){const c=document.createElement("canvas");c.className="prop-surface-preview",c.width=32,c.height=32,c.getContext("2d").drawImage(oh(t.color,o),0,0,32,32),a.appendChild(c),a.appendChild(document.createTextNode(nr[o]))}else a.textContent="📁 "+nr[o];a.addEventListener("click",()=>{if(o==="custom_png"){this.openPngPicker(t,e,i);return}t.surface=o,r.forEach((c,l)=>c.classList.toggle("active",n[l]===o)),e()}),r.push(a),i.appendChild(a)}this.content.appendChild(i),t.surface==="custom_png"&&this.renderCustomTileRow(t,e)}openPngPicker(t,e,n){const i=document.createElement("input");i.type="file",i.accept="image/png,image/jpeg",i.addEventListener("change",()=>{var a;const r=(a=i.files)==null?void 0:a[0];if(!r)return;const o=new FileReader;o.onload=()=>{var c;t.customTileData=o.result,t.surface="custom_png",(c=this.content.querySelector(".prop-surface-custom-row"))==null||c.remove(),this.renderCustomTileRow(t,e);for(const l of n.querySelectorAll(".prop-surface-btn"))l.classList.toggle("active",l.title===nr.custom_png);e()},o.readAsDataURL(r)}),i.click()}renderCustomTileRow(t,e){const n=document.createElement("div");if(n.className="prop-surface-custom-row",t.customTileData){const a=document.createElement("img");a.className="prop-surface-thumb",a.src=t.customTileData,n.appendChild(a)}const i=document.createElement("span");i.className="prop-label",i.textContent="Tile scale";const r=document.createElement("input");r.type="number",r.className="prop-input",r.value=String(t.tileScale),r.min="1",r.max="200",r.step="1",r.addEventListener("input",()=>{t.tileScale=parseFloat(r.value)||20,e()});const o=document.createElement("button");o.className="game-btn",o.textContent="✕ Clear",o.addEventListener("click",()=>{t.customTileData=null,t.surface="plain",n.remove(),e()}),n.appendChild(i),n.appendChild(r),n.appendChild(o),this.content.appendChild(n)}fillGrid(t,e){const n=["water","lava","swamp","poison","sand","ice","void","custom"],i=document.createElement("div");i.className="prop-fill-grid";const r=[];for(const o of n){const a=document.createElement("button");a.className="prop-fill-btn"+(t.fill===o?" active":"");const c=document.createElement("span");c.className="prop-fill-swatch",c.style.background="#"+dh[o].color.toString(16).padStart(6,"0"),a.appendChild(c),a.appendChild(document.createTextNode(R0[o])),a.addEventListener("click",()=>{t.fill=o,r.forEach((l,h)=>l.classList.toggle("active",n[h]===o)),this.updateFillCustomRow(t,e),e()}),r.push(a),i.appendChild(a)}this.content.appendChild(i),this.numRow("Opacity",t.fillOpacity,.1,1,.05,o=>{t.fillOpacity=o,e()}),t.fill==="custom"&&this.buildFillCustomRow(t,e)}updateFillCustomRow(t,e){var n;(n=this.content.querySelector(".prop-fill-custom-row"))==null||n.remove(),t.fill==="custom"&&this.buildFillCustomRow(t,e)}buildFillCustomRow(t,e){const n=document.createElement("div");n.className="prop-fill-custom-row prop-row";const i=document.createElement("span");i.className="prop-label",i.textContent="Fill color";const r=document.createElement("input");r.type="color",r.className="prop-color-input",r.value="#"+(t.fillColor??16777215).toString(16).padStart(6,"0"),r.addEventListener("input",()=>{t.fillColor=parseInt(r.value.slice(1),16),e()}),n.appendChild(i),n.appendChild(r),this.content.appendChild(n)}}function xh(s){return{id:s.id,name:s.name,openingShape:s.openingShape,radiusX:s.radiusX,radiusZ:s.radiusZ,depth:s.depth,sides:s.sides,starInner:s.starInner,color:s.color,surface:s.surface,customTileData:s.customTileData,tileScale:s.tileScale,posR:s.posR,posAngle:s.posAngle,rotY:s.rotY}}function Sh(s,t,e){return{id:s.id,name:s.name,parentZoneId:s.parentZoneId,openingShape:s.openingShape,radiusX:s.radiusX,radiusZ:s.radiusZ,depth:s.depth,sides:s.sides,starInner:s.starInner,color:s.color,surface:s.surface,customTileData:s.customTileData,tileScale:s.tileScale,fill:s.fill,fillColor:s.fillColor,fillOpacity:s.fillOpacity,posR:s.posR,posAngle:s.posAngle,rotY:s.rotY,isMoat:s.isMoat,innerRadiusX:s.innerRadiusX,innerRadiusZ:s.innerRadiusZ,innerOpeningShape:s.innerOpeningShape,innerSides:s.innerSides,innerStarInner:s.innerStarInner,innerWallProfile:s.innerWallProfile,innerRimOffset:s.innerRimOffset,pits:s.pitIds.map(n=>{const i=t.get(n);return i?xh(i):null}).filter(Boolean),zones:s.zoneIds.map(n=>{const i=e.get(n);return i?Sh(i,t,e):null}).filter(Boolean)}}function L0(s,t,e,n){return{id:s,name:t.name,openingShape:t.openingShape,wallProfile:t.wallProfile,radiusX:t.radiusX,radiusZ:t.radiusZ,depth:t.depth,sides:t.sides,starInner:t.starInner,color:t.color,surface:t.surface,customTileData:t.customTileData,tileScale:t.tileScale,posX:t.posX,posZ:t.posZ,posY:t.posY,rotY:t.rotY,isMoat:t.isMoat,innerRadiusX:t.innerRadiusX,innerRadiusZ:t.innerRadiusZ,innerOpeningShape:t.innerOpeningShape,innerSides:t.innerSides,innerStarInner:t.innerStarInner,innerWallProfile:t.innerWallProfile,innerRimOffset:t.innerRimOffset,pits:t.pitIds.map(i=>xh(e.get(i))).filter(Boolean),zones:t.zoneIds.filter(i=>{const r=n.get(i);return r&&!r.parentZoneId}).map(i=>Sh(n.get(i),e,n))}}class I0 extends Ql{constructor(e,n){super(e,n);Z(this,"baseMesh",null);Z(this,"baseEdges",null);Z(this,"topFaceMesh",null);Z(this,"solidMode",!0);Z(this,"modeBtn");Z(this,"arenaStorageKey");Z(this,"baseConfig",{height:Qc,sides:tl,color:el,surface:"plain",customTileData:null,tileScale:nl});Z(this,"sceneTree");Z(this,"sceneObjects",new Map);Z(this,"arenas",new Map);Z(this,"arenaSeq",0);Z(this,"pits",new Map);Z(this,"pitSeq",0);Z(this,"zones",new Map);Z(this,"zoneSeq",0);Z(this,"props");Z(this,"selectedId",null);Z(this,"undoStack",[]);Z(this,"redoStack",[]);Z(this,"_undoTimerId",0);Z(this,"_preChangeState",null);Z(this,"undoBtn");Z(this,"redoBtn");Z(this,"conflicts",new Set);Z(this,"CONFLICT_COLOR",16720384);this.arenaStorageKey=`bey_arena_${n.title.toLowerCase().replace(/\s+/g,"_")}`,this.modeBtn=this.addTopBarButton("● Solid","Toggle solid / mesh view"),this.modeBtn.addEventListener("click",()=>this.toggleMode());const i=this.addTopBarButton("Reset Arena","Reset arena configuration");i.className+=" reset-arena-btn",i.addEventListener("click",()=>{this.resetArena()}),this.undoBtn=this.addTopBarButton("↩ Undo","Undo (Ctrl+Z)"),this.undoBtn.addEventListener("click",()=>this.undo()),this.redoBtn=this.addTopBarButton("↪ Redo","Redo (Ctrl+Y)"),this.redoBtn.addEventListener("click",()=>this.redo());const r=this.addOverlayPanel("sandbox-left-panel");this.sceneTree=new ih(r);const o=document.createElement("button");o.className="tree-collapse-btn",o.textContent="◀",o.title="Collapse panel",this.sceneTree.header.appendChild(o),o.addEventListener("click",()=>{const c=r.classList.toggle("sandbox-left-panel--collapsed");o.textContent=c?"▶":"◀",o.title=c?"Expand panel":"Collapse panel"}),this.sceneTree.add("octagon-base","Octagon Base","⬡",null,{onAddChild:()=>this.addArena()});const a=this.addOverlayPanel("sandbox-right-panel");this.props=new P0(a),this.props.onClose=()=>{this.selectedId=null,this.sceneTree.clearSel(),this.props.showEmpty()},this.sceneTree.onSelect=c=>{this.selectedId=c.length===1?c[0]:null,this.renderProps()},this.sceneTree.onVisibilityToggle=(c,l)=>{(this.sceneObjects.get(c)??[]).forEach(h=>{h.visible=l})},this.sceneTree.onDelete=c=>{this.captureUndo();for(const l of c){const h=this.arenas.get(l);if(h){const d=[...h.pitIds],p=[...h.zoneIds];for(const _ of d)this.removePitFromScene(_);for(const _ of p)this.removeZoneFromScene(_);const g=this.sceneObjects.get(l);g&&(this.removeFromScene(...g),this.sceneObjects.delete(l)),this.disposeArena(h),this.arenas.delete(l),this.updateTopFace(),this.updateAllMoatIslandCaps();continue}if(this.pits.has(l)){const d=this.pits.get(l),p=this.arenas.get(d.parentArenaId);this.removePitFromScene(l),p&&(this.updateArenaFloor(p),this.updateArenaBowlHoles(p,d.parentArenaId));continue}if(this.zones.has(l)){const d=this.zones.get(l),p=this.arenas.get(d.parentArenaId);this.removeZoneFromScene(l),p&&(this.updateArenaFloor(p),this.updateArenaBowlHoles(p,d.parentArenaId));continue}const u=this.sceneObjects.get(l);u&&(this.removeFromScene(...u),this.sceneObjects.delete(l))}c.some(l=>l===this.selectedId)&&(this.selectedId=null,this.props.showEmpty()),this.saveArena(),this._flushUndoPending()},document.addEventListener("keydown",c=>{!c.ctrlKey&&!c.metaKey||(c.key==="z"||c.key==="Z"?(c.preventDefault(),c.shiftKey?this.redo():this.undo()):(c.key==="y"||c.key==="Y")&&(c.preventDefault(),this.redo()))}),this.updateUndoRedoUI()}serializeConfig(){const e={version:4,baseConfig:{...this.baseConfig},arenaSeq:this.arenaSeq,pitSeq:this.pitSeq,zoneSeq:this.zoneSeq,arenas:[...this.arenas.entries()].map(([n,i])=>L0(n,i,this.pits,this.zones))};return JSON.stringify(e)}captureUndo(){this._preChangeState||(this._preChangeState=this.serializeConfig()),clearTimeout(this._undoTimerId),this._undoTimerId=window.setTimeout(()=>this._flushUndoPending(),400)}_flushUndoPending(){if(clearTimeout(this._undoTimerId),!this._preChangeState)return;const e=this._preChangeState;this._preChangeState=null,this.serializeConfig()!==e&&(this.undoStack.push(e),this.undoStack.length>50&&this.undoStack.shift(),this.redoStack=[],this.updateUndoRedoUI())}undo(){if(this._flushUndoPending(),!this.undoStack.length)return;this.redoStack.push(this.serializeConfig());const e=JSON.parse(this.undoStack.pop());this._applyConfigToScene(e),this.saveArena(),this.updateUndoRedoUI()}redo(){if(this._flushUndoPending(),!this.redoStack.length)return;this.undoStack.push(this.serializeConfig());const e=JSON.parse(this.redoStack.pop());this._applyConfigToScene(e),this.saveArena(),this.updateUndoRedoUI()}updateUndoRedoUI(){this.undoBtn.disabled=this.undoStack.length===0,this.redoBtn.disabled=this.redoStack.length===0,this.undoBtn.style.opacity=this.undoStack.length===0?"0.4":"",this.redoBtn.style.opacity=this.redoStack.length===0?"0.4":""}_clearArenas(){for(const[e]of this.arenas.entries())this.sceneTree.remove(e);for(const e of this.pits.values())this.disposePit(e),this.removeFromScene(e.mesh,e.edges),e.seamMesh&&this.removeFromScene(e.seamMesh);for(const e of this.zones.values())this.disposeZone(e),this.removeFromScene(e.mesh,e.edges),e.seamMesh&&this.removeFromScene(e.seamMesh);for(const e of this.arenas.values())this.disposeArena(e),this.removeFromScene(e.mesh,e.edges);this.pits.clear(),this.zones.clear(),this.arenas.clear(),this.sceneObjects.clear(),this.arenaSeq=0,this.pitSeq=0,this.zoneSeq=0}_applyConfigToScene(e){this._clearArenas(),this.baseConfig={...this.baseConfig,...e.baseConfig},this.rebuildBase(),this.arenaSeq=e.arenaSeq,this.pitSeq=e.pitSeq,this.zoneSeq=e.zoneSeq,this._loadArenasFromConfig(e),this.selectedId=null,this.sceneTree.clearSel(),this.props.showEmpty()}disposeArena(e){e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.edges.geometry.dispose(),e.edges.material.dispose(),e.floorMesh&&(e.floorMesh.geometry.dispose(),e.floorMesh.material.dispose(),this.removeFromScene(e.floorMesh)),e.islandMesh&&(e.islandMesh.geometry.dispose(),e.islandMesh.material.dispose(),this.removeFromScene(e.islandMesh)),e.rimSeamMesh&&(e.rimSeamMesh.geometry.dispose(),e.rimSeamMesh.material.dispose(),this.removeFromScene(e.rimSeamMesh))}disposePit(e){e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.edges.geometry.dispose(),e.edges.material.dispose(),e.seamMesh&&(e.seamMesh.geometry.dispose(),e.seamMesh.material.dispose())}disposeZone(e){e.mesh.geometry.dispose(),e.mesh.material.dispose(),e.edges.geometry.dispose(),e.edges.material.dispose(),e.seamMesh&&(e.seamMesh.geometry.dispose(),e.seamMesh.material.dispose())}buildCustom(e){const n=this.baseConfig.height,i=this.baseConfig.sides,r=hn/Math.cos(Math.PI/i),o=Math.PI/i,a=ve({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.baseMesh=new Yt(new wn(r,r,n,i,1,!0),a),this.baseMesh.rotation.y=o,this.baseMesh.position.y=-n/2,e.add(this.baseMesh);const c=new wn(r,r,n,i,1,!1);this.baseEdges=new fn(new Ic(c),new dn({color:12101768})),this.baseEdges.rotation.y=o,this.baseEdges.position.y=-n/2,e.add(this.baseEdges),c.dispose();const l=ve({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.topFaceMesh=new Yt(sl(i,r,o,0,[]),l),e.add(this.topFaceMesh),this.sceneObjects.set("octagon-base",[this.baseMesh,this.baseEdges,this.topFaceMesh]),this.loadArena()}rebuildBase(){if(!this.baseMesh||!this.baseEdges||!this.topFaceMesh)return;const e=this.baseConfig.height,n=this.baseConfig.sides,i=hn/Math.cos(Math.PI/n),r=Math.PI/n;this.baseMesh.geometry.dispose(),this.baseMesh.geometry=new wn(i,i,e,n,1,!0),this.baseMesh.rotation.y=r,this.baseMesh.position.y=-e/2;const o=ve({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.baseMesh.material.dispose(),this.baseMesh.material=o;const a=new wn(i,i,e,n,1,!1);this.baseEdges.geometry.dispose(),this.baseEdges.geometry=new Ic(a),this.baseEdges.rotation.y=r,this.baseEdges.position.y=-e/2,a.dispose();const c=ve({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.topFaceMesh.material.dispose(),this.topFaceMesh.material=c;for(const l of this.arenas.values())l.depth>e&&(l.depth=e),Ao(l,this.getArenaHoles(l)),this.updateArenaChildren(l),this.updateArenaRimSeam(l)}updateTopFace(){if(!this.topFaceMesh)return;const e=this.baseConfig.sides,n=hn/Math.cos(Math.PI/e),i=Math.PI/e,r=sl(e,n,i,0,[...this.arenas.values()]);this.topFaceMesh.geometry.dispose(),this.topFaceMesh.geometry=r}getArenaHoles(e){if(e.isMoat||e.wallProfile!=="parabolic")return[];const n=[];for(const i of e.pitIds){const r=this.pits.get(i);if(!r)continue;const{lx:o,lz:a}=Cn(r.posR,r.posAngle);n.push({cx:o,cz:a,rx:r.radiusX,rz:r.radiusZ,rotY:r.rotY*ze,pts:fe(r)})}for(const i of e.zoneIds){const r=this.zones.get(i);if(!r)continue;const{lx:o,lz:a}=Cn(r.posR,r.posAngle);n.push({cx:o,cz:a,rx:r.radiusX,rz:r.radiusZ,rotY:r.rotY*ze,pts:fe(r)})}return n}updateArenaBowlHoles(e,n){if(e.isMoat)return;const i=e.posY>Jn;if(!i&&e.wallProfile!=="parabolic")return;const r=this.getArenaHoles(e),o=fe(e);e.mesh.geometry.dispose(),i?e.mesh.geometry=Qo(o,e.depth,e.wallProfile,0,r):e.mesh.geometry=Jo(o,e.depth,0,r)}updateArenaFloor(e){if(e.posY>Jn||e.wallProfile!=="straight"||e.isMoat){e.floorMesh&&(this.removeFromScene(e.floorMesh),e.floorMesh.geometry.dispose(),e.floorMesh.material.dispose(),e.floorMesh=null);return}const n=e.pitIds.map(o=>this.pits.get(o)).filter(Boolean),i=e.zoneIds.map(o=>this.zones.get(o)).filter(Boolean),r=rl(e,n,i);if(e.floorMesh)e.floorMesh.geometry.dispose(),e.floorMesh.geometry=r;else{const o=ve({color:e.color,surface:e.surface,customTileData:e.customTileData,tileScale:e.tileScale});e.floorMesh=new Yt(r,o),e.floorMesh.position.set(e.posX,e.posY,e.posZ),e.floorMesh.rotation.y=e.rotY,this.addToScene(e.floorMesh);const a=this.sceneObjects.get(this._arenaIdFor(e));a&&a.push(e.floorMesh)}}getArenasOnIsland(e){const n=[],i=Math.cos(-e.rotY),r=Math.sin(-e.rotY);for(const o of this.arenas.values()){if(o===e||Math.abs(o.posY-e.innerRimOffset)>1)continue;const a=o.posX-e.posX,c=o.posZ-e.posZ,l=a*i-c*r,h=a*r+c*i;(l/e.innerRadiusX)**2+(h/e.innerRadiusZ)**2<=1&&n.push({cx:l,cz:h,rx:o.radiusX,rz:o.radiusZ})}return n}updateIslandCap(e,n){if(!e.isMoat){e.islandMesh&&(this.removeFromScene(e.islandMesh),e.islandMesh.geometry.dispose(),e.islandMesh.material.dispose(),e.islandMesh=null);return}const i=ol(e,this.getArenasOnIsland(e));if(e.islandMesh)e.islandMesh.geometry.dispose(),e.islandMesh.geometry=i,e.islandMesh.position.set(e.posX,e.posY,e.posZ),e.islandMesh.rotation.y=e.rotY;else{const r=ve({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});e.islandMesh=new Yt(i,r),e.islandMesh.position.set(e.posX,e.posY,e.posZ),e.islandMesh.rotation.y=e.rotY,this.addToScene(e.islandMesh);const o=this.sceneObjects.get(n);o&&o.push(e.islandMesh)}}updateAllMoatIslandCaps(){for(const[e,n]of this.arenas.entries())n.isMoat&&this.updateIslandCap(n,e)}updateArenaRimSeam(e){const n=fe(e),r=Vi(n,0,0,0,(o,a)=>0);if(e.rimSeamMesh)e.rimSeamMesh.geometry.dispose(),e.rimSeamMesh.geometry=r,e.rimSeamMesh.position.set(e.posX,e.posY,e.posZ),e.rimSeamMesh.rotation.y=e.rotY;else{const o=ve({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});e.rimSeamMesh=new Yt(r,o),e.rimSeamMesh.position.set(e.posX,e.posY,e.posZ),e.rimSeamMesh.rotation.y=e.rotY,this.addToScene(e.rimSeamMesh)}}_arenaIdFor(e){for(const[n,i]of this.arenas.entries())if(i===e)return n;return""}updateArenaChildren(e){for(const n of e.pitIds){const i=this.pits.get(n);i&&Yn(i,e,this.pits,this.zones)}for(const n of e.zoneIds){const i=this.zones.get(n);i&&(er(i,e,this.getScene(),this.pits,this.zones),this._updateZoneChildren(i,e))}}_updateZoneChildren(e,n){for(const i of e.pitIds){const r=this.pits.get(i);r&&Yn(r,n,this.pits,this.zones)}for(const i of e.zoneIds){const r=this.zones.get(i);r&&(er(r,n,this.getScene(),this.pits,this.zones),this._updateZoneChildren(r,n))}}renderProps(){const e=this.selectedId;if(!e){this.props.showEmpty();return}if(e==="octagon-base"){this.props.showBase(this.baseConfig,()=>{this.captureUndo(),this.rebuildBase(),this.updateTopFace(),this.saveArena()},o=>{this.captureUndo(),this.baseConfig.color=o;const a=ve({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.baseMesh.material.dispose(),this.baseMesh.material=a,this.topFaceMesh.material.dispose(),this.topFaceMesh.material=ve({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale}),this.saveArena()},()=>{this.captureUndo(),this.rebuildBase(),this.updateTopFace(),this.saveArena()});return}const n=this.arenas.get(e);if(n){this.props.showArena(n,this.baseConfig.height,()=>{this.captureUndo(),Ao(n,this.getArenaHoles(n)),this.updateArenaChildren(n),this.updateArenaFloor(n),this.updateIslandCap(n,e),this.updateArenaRimSeam(n),this.updateAllMoatIslandCaps(),this.updateTopFace(),this.saveArena()},()=>{this.captureUndo(),Ao(n,this.getArenaHoles(n)),this.updateArenaChildren(n),this.updateArenaFloor(n),this.updateIslandCap(n,e),this.updateArenaRimSeam(n),this.updateAllMoatIslandCaps(),this.updateTopFace(),this.renderProps(),this.saveArena()},o=>{this.captureUndo(),this.sceneTree.setLabel(e,o),this.saveArena()},()=>{this.captureUndo(),ll(n),this.saveArena()},()=>{this.captureUndo(),ll(n),this.saveArena()});return}const i=this.pits.get(e);if(i){const o=this.arenas.get(i.parentArenaId);this.props.showPit(i,o,()=>{this.captureUndo(),Yn(i,o,this.pits,this.zones),this.updateArenaBowlHoles(o,i.parentArenaId),this.updateArenaFloor(o),this.checkSiblingConflicts(this.directParentId(i),this.directParentType(i)),this.saveArena()},()=>{this.captureUndo(),Yn(i,o,this.pits,this.zones),this.updateArenaBowlHoles(o,i.parentArenaId),this.updateArenaFloor(o),this.checkSiblingConflicts(this.directParentId(i),this.directParentType(i)),this.renderProps(),this.saveArena()},a=>{this.captureUndo(),this.sceneTree.setLabel(e,a),this.saveArena()},()=>{this.captureUndo();const a=new bt(i.color).lerp(new bt(16777215),.5);i.edges.material.color.copy(a),Yn(i,o,this.pits,this.zones),this.saveArena()},()=>{this.captureUndo(),Yn(i,o,this.pits,this.zones),this.saveArena()});return}const r=this.zones.get(e);if(r){const o=this.arenas.get(r.parentArenaId);this.props.showZone(r,o,()=>{this.captureUndo(),er(r,o,this.getScene(),this.pits,this.zones),this.updateArenaBowlHoles(o,r.parentArenaId),this.updateArenaFloor(o),this.checkSiblingConflicts(this.directParentId(r),this.directParentType(r)),this.saveArena()},()=>{this.captureUndo(),er(r,o,this.getScene(),this.pits,this.zones),this.updateArenaBowlHoles(o,r.parentArenaId),this.updateArenaFloor(o),this.checkSiblingConflicts(this.directParentId(r),this.directParentType(r)),this.renderProps(),this.saveArena()},a=>{this.captureUndo(),this.sceneTree.setLabel(e,a),this.saveArena()});return}this.props.showEmpty()}getScene(){return this.scene}toggleMode(){this.solidMode=!this.solidMode,this.modeBtn.textContent=this.solidMode?"● Solid":"○ Mesh",this.baseMesh&&(this.baseMesh.visible=this.solidMode),this.topFaceMesh&&(this.topFaceMesh.visible=this.solidMode);for(const e of this.arenas.values())e.mesh.visible=this.solidMode,e.floorMesh&&(e.floorMesh.visible=this.solidMode),e.islandMesh&&(e.islandMesh.visible=this.solidMode),e.rimSeamMesh&&(e.rimSeamMesh.visible=this.solidMode);for(const e of this.pits.values())e.mesh.visible=this.solidMode,e.seamMesh&&(e.seamMesh.visible=this.solidMode);for(const e of this.zones.values())e.mesh.visible=this.solidMode,e.seamMesh&&(e.seamMesh.visible=this.solidMode)}addArena(){this.captureUndo();const e=`arena-${++this.arenaSeq}`,n=C0(`Arena ${this.arenaSeq}`),[i,r]=al(n,[]);n.mesh=i,n.edges=r;const o=cl(n,this.baseConfig.color,this.baseConfig.surface,this.baseConfig.customTileData,this.baseConfig.tileScale);n.rimSeamMesh=o,this.addToScene(i,r,o),this.sceneObjects.set(e,[i,r,o]),this.arenas.set(e,n),this.sceneTree.add(e,n.name,"⏺","octagon-base",{addChildButtons:[{label:"P+",title:"Add pit",className:"pit-btn",onClick:()=>this.addPit(e)},{label:"Z+",title:"Add zone",className:"zone-btn",onClick:()=>this.addZone(e)}]}),this.updateTopFace(),this.updateAllMoatIslandCaps(),this.saveArena()}directParentId(e){return e.parentZoneId?e.parentZoneId:e.parentArenaId}directParentType(e){return e.parentZoneId?"zone":"arena"}getSiblings(e,n){const i=[];if(n==="arena"){const r=this.arenas.get(e);if(!r)return i;for(const o of r.pitIds){const a=this.pits.get(o);a&&i.push({id:o,item:a,kind:"pit"})}for(const o of r.zoneIds){const a=this.zones.get(o);a&&i.push({id:o,item:a,kind:"zone"})}}else{const r=this.zones.get(e);if(!r)return i;for(const o of r.pitIds){const a=this.pits.get(o);a&&i.push({id:o,item:a,kind:"pit"})}for(const o of r.zoneIds){const a=this.zones.get(o);a&&i.push({id:o,item:a,kind:"zone"})}}return i}minRadius(e){return Math.min(e.radiusX,e.radiusZ)}itemCenter(e){const{lx:n,lz:i}=Cn(e.posR,e.posAngle);return{cx:n,cz:i}}checkSiblingConflicts(e,n){const i=this.getSiblings(e,n),r=new Set([...this.conflicts].filter(a=>i.some(c=>c.id===a))),o=new Set;for(let a=0;a<i.length;a++)for(let c=a+1;c<i.length;c++){const l=i[a],h=i[c],u=this.itemCenter(l.item),d=this.itemCenter(h.item),p=Math.hypot(u.cx-d.cx,u.cz-d.cz),g=this.minRadius(l.item),_=this.minRadius(h.item),f=g+_,m=Math.abs(g-_),x=p<f,v=p<=m;if(x){if(l.kind!==h.kind)v||(o.add(l.id),o.add(h.id));else if(!v){this.mergeSameType(l,h,e,n);return}}}for(const a of r)if(!o.has(a)){const c=this.pits.get(a);if(c){const h=new bt(c.color).lerp(new bt(16777215),.5);c.edges.material.color.set(h)}const l=this.zones.get(a);if(l){const h=new bt(l.color).lerp(new bt(16777215),.5);l.edges.material.color.set(h)}this.conflicts.delete(a)}for(const a of o)if(!this.conflicts.has(a)){const c=this.pits.get(a);c&&c.edges.material.color.set(this.CONFLICT_COLOR);const l=this.zones.get(a);l&&l.edges.material.color.set(this.CONFLICT_COLOR),this.conflicts.add(a)}}convexHull(e){const n=[...e].sort((a,c)=>a.x!==c.x?a.x-c.x:a.y-c.y),i=(a,c,l)=>(c.x-a.x)*(l.y-a.y)-(c.y-a.y)*(l.x-a.x),r=[];for(const a of n){for(;r.length>=2&&i(r[r.length-2],r[r.length-1],a)<=0;)r.pop();r.push(a)}const o=[];for(let a=n.length-1;a>=0;a--){const c=n[a];for(;o.length>=2&&i(o[o.length-2],o[o.length-1],c)<=0;)o.pop();o.push(c)}return r.pop(),o.pop(),[...r,...o]}mergeSameType(e,n,i,r){const o=this.arenas.get((e.kind==="pit",e.item.parentArenaId));if(!o)return;const a=f=>{const{lx:m,lz:x}=Cn(f.posR,f.posAngle),v=Math.cos(f.rotY*ze),M=Math.sin(f.rotY*ze);return fe(f).map(R=>new Q(R.x*v-R.y*M+m,R.x*M+R.y*v+x))},c=[...a(e.item),...a(n.item)],l=this.convexHull(c);if(l.length<3)return;const h=l.reduce((f,m)=>f+m.x,0)/l.length,u=l.reduce((f,m)=>f+m.y,0)/l.length,d=Math.hypot(h,u),p=Math.atan2(u,h)/ze,g=Math.max(e.item.depth,n.item.depth),_=l.map(f=>new Q(f.x-h,f.y-u));if(e.kind==="pit"){const f=e.item,m=`pit-${++this.pitSeq}`,x=ul(`Pit ${this.pitSeq}`,f.parentArenaId,m);x.posR=d,x.posAngle=p,x.depth=g,x.radiusX=Math.max(..._.map(Y=>Math.abs(Y.x)))||10,x.radiusZ=Math.max(..._.map(Y=>Math.abs(Y.y)))||10;const v=ms({parentZoneId:null},o,this.zones),M=_h(_,g,"straight",0,0,0,v),R=vh(_,g,"straight",0,0,0,v),w=ve({color:f.color,surface:f.surface,customTileData:f.customTileData,tileScale:f.tileScale}),A=new bt(f.color).lerp(new bt(16777215),.5),I=new Yt(M,w),E=new fn(R,new dn({color:A})),{wx:y,wz:P,wRotY:B}=gs(o,x);I.position.set(y,0,P),I.rotation.y=B,E.position.set(y,0,P),E.rotation.y=B;const O=new Yt(new qt,ve({color:f.color,surface:f.surface,customTileData:f.customTileData,tileScale:f.tileScale}));O.position.set(y,0,P),O.rotation.y=B,x.mesh=I,x.edges=E,x.seamMesh=O,this.removePitFromScene(e.id),this.removePitFromScene(n.id),this.pits.set(m,x),Yn(x,o,this.pits,this.zones),this.addToScene(I,E,O),this.sceneObjects.set(m,[I,E,O]),this.addChildToParent(m,"pit",i,r),this.sceneTree.add(m,x.name,"▼",i)}else{const f=e.item,m=`zone-${++this.zoneSeq}`,x=dl(`Zone ${this.zoneSeq}`,f.parentArenaId,m,f.parentZoneId);x.posR=d,x.posAngle=p,x.depth=g,x.radiusX=Math.max(..._.map(w=>Math.abs(w.x)))||15,x.radiusZ=Math.max(..._.map(w=>Math.abs(w.y)))||15,x.fill=f.fill,x.fillColor=f.fillColor;const[v,M,R]=wo(x,o,this.pits,this.zones);x.mesh=v,x.edges=M,x.seamMesh=R,this.removeZoneFromScene(e.id),this.removeZoneFromScene(n.id),this.zones.set(m,x),this.addToScene(v,M,R),this.sceneObjects.set(m,[v,M,R]),this.addChildToParent(m,"zone",i,r),this.sceneTree.add(m,x.name,"◈",i,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(m,"zone")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(m,"zone")}]})}this.saveArena()}addChildToParent(e,n,i,r){const o=n==="pit"?"pitIds":"zoneIds";if(r==="arena"){const a=this.arenas.get(i);a&&a[o].push(e)}else{const a=this.zones.get(i);a&&a[o].push(e)}}removePitFromScene(e){const n=this.pits.get(e);if(!n)return;this.disposePit(n),this.removeFromScene(n.mesh,n.edges),n.seamMesh&&this.removeFromScene(n.seamMesh),this.sceneObjects.delete(e),this.sceneTree.remove(e),this.pits.delete(e);const i=this.arenas.get(n.parentArenaId);i&&(i.pitIds=i.pitIds.filter(r=>r!==e))}removeZoneFromScene(e){const n=this.zones.get(e);if(!n)return;this.disposeZone(n),this.removeFromScene(n.mesh,n.edges),n.seamMesh&&this.removeFromScene(n.seamMesh),this.sceneObjects.delete(e),this.sceneTree.remove(e),this.zones.delete(e);const i=this.arenas.get(n.parentArenaId);if(i&&(i.zoneIds=i.zoneIds.filter(r=>r!==e)),n.parentZoneId){const r=this.zones.get(n.parentZoneId);r&&(r.zoneIds=r.zoneIds.filter(o=>o!==e))}}addPit(e){this.addPitToParent(e,"arena")}addZone(e){this.addZoneToParent(e,"arena")}addPitToParent(e,n){let i;if(n==="arena")i=e;else{const u=this.zones.get(e);if(!u)return;i=u.parentArenaId}const r=this.arenas.get(i);if(!r)return;this.captureUndo();const o=`pit-${++this.pitSeq}`,a=ul(`Pit ${this.pitSeq}`,i,o);a.depth=Math.min(a.depth,r.depth),a.radiusX=Math.min(a.radiusX,r.radiusX*.4),a.radiusZ=Math.min(a.radiusZ,r.radiusZ*.4);const[c,l,h]=hl(a,r,this.pits,this.zones);a.mesh=c,a.edges=l,a.seamMesh=h,this.addToScene(c,l,h),this.sceneObjects.set(o,[c,l,h]),this.pits.set(o,a),this.addChildToParent(o,"pit",e,n),this.sceneTree.add(o,a.name,"▼",e),this.updateArenaBowlHoles(r,i),this.updateArenaFloor(r),this.checkSiblingConflicts(e,n),this.saveArena()}addZoneToParent(e,n){let i;if(n==="arena")i=e;else{const d=this.zones.get(e);if(!d)return;i=d.parentArenaId}const r=this.arenas.get(i);if(!r)return;this.captureUndo();const o=`zone-${++this.zoneSeq}`,a=n==="zone"?e:null,c=dl(`Zone ${this.zoneSeq}`,i,o,a);c.depth=Math.min(c.depth,Math.min(15,r.depth)),c.radiusX=Math.min(c.radiusX,r.radiusX*.3),c.radiusZ=Math.min(c.radiusZ,r.radiusZ*.3);const[l,h,u]=wo(c,r,this.pits,this.zones);c.mesh=l,c.edges=h,c.seamMesh=u,this.addToScene(l,h,u),this.sceneObjects.set(o,[l,h,u]),this.zones.set(o,c),this.addChildToParent(o,"zone",e,n),this.sceneTree.add(o,c.name,"◈",e,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(o,"zone")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(o,"zone")}]}),this.updateArenaBowlHoles(r,i),this.updateArenaFloor(r),this.checkSiblingConflicts(e,n),this.saveArena()}saveArena(){localStorage.setItem(this.arenaStorageKey,this.serializeConfig())}restorePitSave(e,n,i,r){const o={id:e.id,name:e.name,parentArenaId:n,openingShape:e.openingShape,radiusX:e.radiusX,radiusZ:e.radiusZ,depth:e.depth,sides:e.sides,starInner:e.starInner,color:e.color,surface:e.surface,customTileData:e.customTileData,tileScale:e.tileScale,posR:e.posR,posAngle:e.posAngle,rotY:e.rotY,mesh:null,edges:null,seamMesh:null};this.pits.set(e.id,o),r.pitIds.push(e.id);const[a,c,l]=hl(o,r,this.pits,this.zones);o.mesh=a,o.edges=c,o.seamMesh=l,this.addToScene(a,c,l),this.sceneObjects.set(e.id,[a,c,l]),this.sceneTree.add(e.id,o.name,"▼",i)}restoreZoneSave(e,n,i,r){const o={id:e.id,name:e.name,parentArenaId:n,parentZoneId:e.parentZoneId??null,openingShape:e.openingShape,radiusX:e.radiusX,radiusZ:e.radiusZ,depth:e.depth,sides:e.sides,starInner:e.starInner,color:e.color,surface:e.surface,customTileData:e.customTileData,tileScale:e.tileScale,fill:e.fill,fillColor:e.fillColor,fillOpacity:e.fillOpacity,posR:e.posR,posAngle:e.posAngle,rotY:e.rotY,isMoat:e.isMoat,innerRadiusX:e.innerRadiusX,innerRadiusZ:e.innerRadiusZ,innerOpeningShape:e.innerOpeningShape??e.openingShape,innerSides:e.innerSides??e.sides,innerStarInner:e.innerStarInner??e.starInner,innerWallProfile:e.innerWallProfile??"parabolic",innerRimOffset:e.innerRimOffset??0,pitIds:[],zoneIds:[],mesh:null,edges:null,seamMesh:null};this.zones.set(e.id,o),r.zoneIds.push(e.id);const[a,c,l]=wo(o,r,this.pits,this.zones);o.mesh=a,o.edges=c,o.seamMesh=l,this.addToScene(a,c,l),this.sceneObjects.set(e.id,[a,c,l]),this.sceneTree.add(e.id,o.name,"◈",i,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(e.id,"zone")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(e.id,"zone")}]});for(const h of e.pits??[])this.restorePitSave(h,n,e.id,r);for(const h of e.zones??[])this.restoreZoneSave(h,n,e.id,r)}_loadArenasFromConfig(e){for(const n of e.arenas){const i={name:n.name,openingShape:n.openingShape,wallProfile:n.wallProfile,radiusX:n.radiusX,radiusZ:n.radiusZ,depth:n.depth,sides:n.sides,starInner:n.starInner,color:n.color,surface:n.surface,customTileData:n.customTileData,tileScale:n.tileScale,posX:n.posX,posZ:n.posZ,posY:n.posY??0,rotY:n.rotY,isMoat:n.isMoat,innerRadiusX:n.innerRadiusX,innerRadiusZ:n.innerRadiusZ,innerOpeningShape:n.innerOpeningShape??n.openingShape,innerSides:n.innerSides??n.sides,innerStarInner:n.innerStarInner??n.starInner,innerWallProfile:n.innerWallProfile??"parabolic",innerRimOffset:n.innerRimOffset??0,pitIds:[],zoneIds:[],mesh:null,edges:null,floorMesh:null,islandMesh:null,rimSeamMesh:null};this.arenas.set(n.id,i),this.sceneTree.add(n.id,i.name,"⏺","octagon-base",{addChildButtons:[{label:"P+",title:"Add pit",className:"pit-btn",onClick:()=>this.addPit(n.id)},{label:"Z+",title:"Add zone",className:"zone-btn",onClick:()=>this.addZone(n.id)}]});for(const h of n.pits)this.restorePitSave(h,n.id,n.id,i);for(const h of n.zones)this.restoreZoneSave(h,n.id,n.id,i);const r=this.getArenaHoles(i),[o,a]=al(i,r);i.mesh=o,i.edges=a;const c=cl(i,this.baseConfig.color,this.baseConfig.surface,this.baseConfig.customTileData,this.baseConfig.tileScale);i.rimSeamMesh=c,this.addToScene(o,a,c);const l=[o,a,c];if(i.isMoat){const h=ol(i),u=ve({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});i.islandMesh=new Yt(h,u),i.islandMesh.position.set(i.posX,i.posY,i.posZ),i.islandMesh.rotation.y=i.rotY,this.addToScene(i.islandMesh),l.push(i.islandMesh)}if(i.wallProfile==="straight"&&!i.isMoat&&i.posY<=Jn){const h=i.pitIds.map(g=>this.pits.get(g)).filter(Boolean),u=i.zoneIds.map(g=>this.zones.get(g)).filter(Boolean),d=rl(i,h,u),p=ve({color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale});i.floorMesh=new Yt(d,p),i.floorMesh.position.set(i.posX,i.posY,i.posZ),i.floorMesh.rotation.y=i.rotY,this.addToScene(i.floorMesh),l.push(i.floorMesh)}this.sceneObjects.set(n.id,l)}this.updateTopFace()}loadArena(){try{const e=localStorage.getItem(this.arenaStorageKey);if(!e)return;const n=JSON.parse(e);if(n.version!==4){localStorage.removeItem(this.arenaStorageKey);return}this.baseConfig={...this.baseConfig,...n.baseConfig},this.rebuildBase(),this.arenaSeq=n.arenaSeq,this.pitSeq=n.pitSeq,this.zoneSeq=n.zoneSeq,this._loadArenasFromConfig(n)}catch{localStorage.removeItem(this.arenaStorageKey)}}async resetArena(){if(await mr(`Reset arena?
All arenas, pits, zones and base settings will be cleared.`,"Reset","Cancel")){this.captureUndo();for(const[n,i]of this.arenas.entries()){for(const r of i.pitIds){const o=this.pits.get(r);o&&(this.disposePit(o),this.removeFromScene(o.mesh,o.edges),o.seamMesh&&this.removeFromScene(o.seamMesh)),this.pits.delete(r),this.sceneObjects.delete(r)}for(const r of i.zoneIds){const o=this.zones.get(r);o&&(this.disposeZone(o),this.removeFromScene(o.mesh,o.edges),o.seamMesh&&this.removeFromScene(o.seamMesh)),this.zones.delete(r),this.sceneObjects.delete(r)}this.disposeArena(i),this.removeFromScene(i.mesh,i.edges),this.sceneObjects.delete(n),this.sceneTree.remove(n)}this.arenas.clear(),this.arenaSeq=0,this.pits.clear(),this.pitSeq=0,this.zones.clear(),this.zoneSeq=0,this.baseConfig={height:Qc,sides:tl,color:el,surface:"plain",customTileData:null,tileScale:nl},this.rebuildBase(),this.updateTopFace(),this.selectedId=null,this.sceneTree.clearSel(),this.props.showEmpty(),localStorage.removeItem(this.arenaStorageKey),this._flushUndoPending()}}}class D0{constructor(){Z(this,"current","landing");Z(this,"landing");Z(this,"beyblade");Z(this,"arena");const t=document.getElementById("app");this.landing=new wh(t,{onBeyblade:()=>this.go("beyblade"),onArena:()=>this.go("arena")}),this.beyblade=new M0(t,()=>{this.confirmLeave()}),this.arena=new I0(t,{title:"Arena Sandbox",accentHex:16739125,onBack:()=>{this.confirmLeave()},gridSize:200,gridDivs:20,tickEvery:20,tickRange:100,defaultCam:{x:150,y:100,z:175},camFar:2e3,minZoom:5,maxZoom:1500,axisYOffset:0}),this.mountGlobalControls(t),window.addEventListener("popstate",n=>{var r;const i=((r=n.state)==null?void 0:r.screen)??this.pathToScreen();this.current!=="landing"&&i==="landing"?this.confirmPopLeave():this.show(i)});const e=this.pathToScreen();history.replaceState({screen:e},"",location.pathname),this.show(e)}go(t){const e=t==="landing"?"/":`/${t}`;history.pushState({screen:t},"",e),this.show(t)}show(t){this.current=t,this.landing.setVisible(t==="landing"),this.beyblade.setVisible(t==="beyblade"),this.arena.setVisible(t==="arena")}pathToScreen(){const t=location.pathname;return t==="/beyblade"?"beyblade":t==="/arena"?"arena":"landing"}async confirmLeave(){await mr(`Leave the sandbox?
Your view will be saved.`,"Leave","Stay")&&this.go("landing")}async confirmPopLeave(){await mr(`Leave the sandbox?
Your view will be saved.`,"Leave","Stay")?this.show("landing"):history.go(1)}mountGlobalControls(t){let e=1;const n=.1,i=.5,r=2,o=l=>{e=Math.min(r,Math.max(i,+l.toFixed(2))),document.documentElement.style.setProperty("--ui-scale",String(e))},a=document.createElement("div");a.className="global-controls",a.innerHTML=`
      <button class="ctrl-btn" id="scale-down"  title="Decrease UI size">−</button>
      <button class="ctrl-btn" id="scale-reset" title="Reset UI size">○</button>
      <button class="ctrl-btn" id="scale-up"    title="Increase UI size">+</button>
    `,t.appendChild(a),a.querySelector("#scale-down").addEventListener("click",()=>o(e-n)),a.querySelector("#scale-up").addEventListener("click",()=>o(e+n)),a.querySelector("#scale-reset").addEventListener("click",()=>o(1));const c=document.createElement("button");c.className="fs-btn",c.title="Toggle fullscreen",c.textContent="⛶",t.appendChild(c),c.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}),document.addEventListener("fullscreenchange",()=>{c.title=document.fullscreenElement?"Exit fullscreen":"Enter fullscreen"}),window.addEventListener("keydown",l=>{(l.key==="f"||l.key==="F")&&c.click(),l.key==="="&&o(e+n),l.key==="-"&&o(e-n),l.key==="0"&&o(1)})}}new D0;
