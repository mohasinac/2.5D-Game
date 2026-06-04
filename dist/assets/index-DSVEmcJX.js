var Xc=Object.defineProperty;var Yc=(i,e,t)=>e in i?Xc(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var pe=(i,e,t)=>Yc(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();class Zc{constructor(e,t){pe(this,"el");this.el=document.createElement("div"),this.el.className="screen landing-screen",this.el.innerHTML=`
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
    `,e.appendChild(this.el),this.el.querySelector("#btn-beyblade").addEventListener("click",t.onBeyblade),this.el.querySelector("#btn-arena").addEventListener("click",t.onArena)}setVisible(e){this.el.classList.toggle("hidden",!e)}}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Ao="165",cn={ROTATE:0,DOLLY:1,PAN:2},Sn={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},qc=0,qo=1,Kc=2,Xl=1,$c=2,ln=3,Jt=0,Pt=1,Ct=2,An=0,yi=1,Ko=2,$o=3,jo=4,jc=5,Hn=100,Jc=101,Qc=102,eh=103,th=104,nh=200,ih=201,sh=202,rh=203,fo=204,po=205,oh=206,ah=207,lh=208,ch=209,hh=210,uh=211,dh=212,fh=213,ph=214,mh=0,gh=1,_h=2,$s=3,vh=4,xh=5,Mh=6,Sh=7,Yl=0,yh=1,Eh=2,wn=0,bh=1,Th=2,Ah=3,wh=4,Rh=5,Ch=6,Ph=7,Zl=300,Ai=301,wi=302,mo=303,go=304,hr=306,js=1e3,Vn=1001,_o=1002,kt=1003,Lh=1004,fs=1005,Xt=1006,yr=1007,Wn=1008,Rn=1009,Ih=1010,Dh=1011,Js=1012,ql=1013,Ri=1014,bn=1015,ur=1016,Kl=1017,$l=1018,Ci=1020,Uh=35902,Nh=1021,Oh=1022,$t=1023,Fh=1024,Bh=1025,Ei=1026,Pi=1027,zh=1028,jl=1029,kh=1030,Jl=1031,Ql=1033,Er=33776,br=33777,Tr=33778,Ar=33779,Jo=35840,Qo=35841,ea=35842,ta=35843,na=36196,ia=37492,sa=37496,ra=37808,oa=37809,aa=37810,la=37811,ca=37812,ha=37813,ua=37814,da=37815,fa=37816,pa=37817,ma=37818,ga=37819,_a=37820,va=37821,wr=36492,xa=36494,Ma=36495,Hh=36283,Sa=36284,ya=36285,Ea=36286,Gh=3200,Vh=3201,ec=0,Wh=1,En="",qt="srgb",Pn="srgb-linear",wo="display-p3",dr="display-p3-linear",Qs="linear",et="srgb",er="rec709",tr="p3",jn=7680,Xh=7681,Yh=514,nr=519,Zh=512,qh=513,Kh=514,tc=515,$h=516,jh=517,Jh=518,Qh=519,vo=35044,ba="300 es",un=2e3,ir=2001;class Kn{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Et=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ta=1234567;const bi=Math.PI/180,Qi=180/Math.PI;function jt(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Et[i&255]+Et[i>>8&255]+Et[i>>16&255]+Et[i>>24&255]+"-"+Et[e&255]+Et[e>>8&255]+"-"+Et[e>>16&15|64]+Et[e>>24&255]+"-"+Et[t&63|128]+Et[t>>8&255]+"-"+Et[t>>16&255]+Et[t>>24&255]+Et[n&255]+Et[n>>8&255]+Et[n>>16&255]+Et[n>>24&255]).toLowerCase()}function Mt(i,e,t){return Math.max(e,Math.min(t,i))}function Ro(i,e){return(i%e+e)%e}function eu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function tu(i,e,t){return i!==e?(t-i)/(e-i):0}function qi(i,e,t){return(1-t)*i+t*e}function nu(i,e,t,n){return qi(i,e,1-Math.exp(-t*n))}function iu(i,e=1){return e-Math.abs(Ro(i,e*2)-e)}function su(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function ru(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function ou(i,e){return i+Math.floor(Math.random()*(e-i+1))}function au(i,e){return i+Math.random()*(e-i)}function lu(i){return i*(.5-Math.random())}function cu(i){i!==void 0&&(Ta=i);let e=Ta+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function hu(i){return i*bi}function uu(i){return i*Qi}function du(i){return(i&i-1)===0&&i!==0}function fu(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function pu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function mu(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),l=o(t/2),c=r((e+n)/2),u=o((e+n)/2),h=r((e-n)/2),d=o((e-n)/2),p=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*u,l*h,l*d,a*c);break;case"YZY":i.set(l*d,a*u,l*h,a*c);break;case"ZXZ":i.set(l*h,l*d,a*u,a*c);break;case"XZX":i.set(a*u,l*g,l*p,a*c);break;case"YXY":i.set(l*p,a*u,l*g,a*c);break;case"ZYZ":i.set(l*g,l*p,a*u,a*c);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Yt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function $e(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const xo={DEG2RAD:bi,RAD2DEG:Qi,generateUUID:jt,clamp:Mt,euclideanModulo:Ro,mapLinear:eu,inverseLerp:tu,lerp:qi,damp:nu,pingpong:iu,smoothstep:su,smootherstep:ru,randInt:ou,randFloat:au,randFloatSpread:lu,seededRandom:cu,degToRad:hu,radToDeg:uu,isPowerOfTwo:du,ceilPowerOfTwo:fu,floorPowerOfTwo:pu,setQuaternionFromProperEuler:mu,normalize:$e,denormalize:Yt};class J{constructor(e=0,t=0){J.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Mt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Ue{constructor(e,t,n,s,r,o,a,l,c){Ue.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c)}set(e,t,n,s,r,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=s,u[2]=a,u[3]=t,u[4]=r,u[5]=l,u[6]=n,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],u=n[4],h=n[7],d=n[2],p=n[5],g=n[8],_=s[0],m=s[3],f=s[6],M=s[1],v=s[4],S=s[7],R=s[2],w=s[5],A=s[8];return r[0]=o*_+a*M+l*R,r[3]=o*m+a*v+l*w,r[6]=o*f+a*S+l*A,r[1]=c*_+u*M+h*R,r[4]=c*m+u*v+h*w,r[7]=c*f+u*S+h*A,r[2]=d*_+p*M+g*R,r[5]=d*m+p*v+g*w,r[8]=d*f+p*S+g*A,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*a*c-n*r*u+n*a*l+s*r*c-s*o*l}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=u*o-a*c,d=a*l-u*r,p=c*r-o*l,g=t*h+n*d+s*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=h*_,e[1]=(s*c-u*n)*_,e[2]=(a*n-s*o)*_,e[3]=d*_,e[4]=(u*t-s*l)*_,e[5]=(s*r-a*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*o+c*a)+o+e,-s*c,s*l,-s*(-c*o+l*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Rr.makeScale(e,t)),this}rotate(e){return this.premultiply(Rr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Rr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Rr=new Ue;function nc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function es(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function gu(){const i=es("canvas");return i.style.display="block",i}const Aa={};function Co(i){i in Aa||(Aa[i]=!0,console.warn(i))}function _u(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const wa=new Ue().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Ra=new Ue().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),ps={[Pn]:{transfer:Qs,primaries:er,toReference:i=>i,fromReference:i=>i},[qt]:{transfer:et,primaries:er,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[dr]:{transfer:Qs,primaries:tr,toReference:i=>i.applyMatrix3(Ra),fromReference:i=>i.applyMatrix3(wa)},[wo]:{transfer:et,primaries:tr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Ra),fromReference:i=>i.applyMatrix3(wa).convertLinearToSRGB()}},vu=new Set([Pn,dr]),je={enabled:!0,_workingColorSpace:Pn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!vu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=ps[e].toReference,s=ps[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return ps[i].primaries},getTransfer:function(i){return i===En?Qs:ps[i].transfer}};function Ti(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Cr(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Jn;class xu{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Jn===void 0&&(Jn=es("canvas")),Jn.width=e.width,Jn.height=e.height;const n=Jn.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=Jn}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=es("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Ti(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Ti(t[n]/255)*255):t[n]=Ti(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Mu=0;class ic{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Mu++}),this.uuid=jt(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(Pr(s[o].image)):r.push(Pr(s[o]))}else r=Pr(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function Pr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?xu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Su=0;class yt extends Kn{constructor(e=yt.DEFAULT_IMAGE,t=yt.DEFAULT_MAPPING,n=Vn,s=Vn,r=Xt,o=Wn,a=$t,l=Rn,c=yt.DEFAULT_ANISOTROPY,u=En){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Su++}),this.uuid=jt(),this.name="",this.source=new ic(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new J(0,0),this.repeat=new J(1,1),this.center=new J(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ue,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Zl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case js:e.x=e.x-Math.floor(e.x);break;case Vn:e.x=e.x<0?0:1;break;case _o:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case js:e.y=e.y-Math.floor(e.y);break;case Vn:e.y=e.y<0?0:1;break;case _o:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}yt.DEFAULT_IMAGE=null;yt.DEFAULT_MAPPING=Zl;yt.DEFAULT_ANISOTROPY=1;class nt{constructor(e=0,t=0,n=0,s=1){nt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const l=e.elements,c=l[0],u=l[4],h=l[8],d=l[1],p=l[5],g=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(u-d)<.01&&Math.abs(h-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(u+d)<.1&&Math.abs(h+_)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(c+1)/2,S=(p+1)/2,R=(f+1)/2,w=(u+d)/4,A=(h+_)/4,L=(g+m)/4;return v>S&&v>R?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=w/n,r=A/n):S>R?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=w/s,r=L/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=A/r,s=L/r),this.set(n,s,r,t),this}let M=Math.sqrt((m-g)*(m-g)+(h-_)*(h-_)+(d-u)*(d-u));return Math.abs(M)<.001&&(M=1),this.x=(m-g)/M,this.y=(h-_)/M,this.z=(d-u)/M,this.w=Math.acos((c+p+f-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class yu extends Kn{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new nt(0,0,e,t),this.scissorTest=!1,this.viewport=new nt(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new yt(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new ic(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Xn extends yu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class sc extends yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=kt,this.minFilter=kt,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Eu extends yt{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=kt,this.minFilter=kt,this.wrapR=Vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Yn{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let l=n[s+0],c=n[s+1],u=n[s+2],h=n[s+3];const d=r[o+0],p=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h;return}if(a===1){e[t+0]=d,e[t+1]=p,e[t+2]=g,e[t+3]=_;return}if(h!==_||l!==d||c!==p||u!==g){let m=1-a;const f=l*d+c*p+u*g+h*_,M=f>=0?1:-1,v=1-f*f;if(v>Number.EPSILON){const R=Math.sqrt(v),w=Math.atan2(R,f*M);m=Math.sin(m*w)/R,a=Math.sin(a*w)/R}const S=a*M;if(l=l*m+d*S,c=c*m+p*S,u=u*m+g*S,h=h*m+_*S,m===1-a){const R=1/Math.sqrt(l*l+c*c+u*u+h*h);l*=R,c*=R,u*=R,h*=R}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],l=n[s+1],c=n[s+2],u=n[s+3],h=r[o],d=r[o+1],p=r[o+2],g=r[o+3];return e[t]=a*g+u*h+l*p-c*d,e[t+1]=l*g+u*d+c*h-a*p,e[t+2]=c*g+u*p+a*d-l*h,e[t+3]=u*g-a*h-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(n/2),u=a(s/2),h=a(r/2),d=l(n/2),p=l(s/2),g=l(r/2);switch(o){case"XYZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"YXZ":this._x=d*u*h+c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"ZXY":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h-d*p*g;break;case"ZYX":this._x=d*u*h-c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h+d*p*g;break;case"YZX":this._x=d*u*h+c*p*g,this._y=c*p*h+d*u*g,this._z=c*u*g-d*p*h,this._w=c*u*h-d*p*g;break;case"XZY":this._x=d*u*h-c*p*g,this._y=c*p*h-d*u*g,this._z=c*u*g+d*p*h,this._w=c*u*h+d*p*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],l=t[9],c=t[2],u=t[6],h=t[10],d=n+a+h;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(r-c)*p,this._z=(o-s)*p}else if(n>a&&n>h){const p=2*Math.sqrt(1+n-a-h);this._w=(u-l)/p,this._x=.25*p,this._y=(s+o)/p,this._z=(r+c)/p}else if(a>h){const p=2*Math.sqrt(1+a-n-h);this._w=(r-c)/p,this._x=(s+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+h-n-a);this._w=(o-s)/p,this._x=(r+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(Mt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,l=t._y,c=t._z,u=t._w;return this._x=n*u+o*a+s*c-r*l,this._y=s*u+o*l+r*a-n*c,this._z=r*u+o*c+n*l-s*a,this._w=o*u-n*a-s*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const l=1-a*a;if(l<=Number.EPSILON){const p=1-t;return this._w=p*o+t*this._w,this._x=p*n+t*this._x,this._y=p*s+t*this._y,this._z=p*r+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,a),h=Math.sin((1-t)*u)/c,d=Math.sin(t*u)/c;return this._w=o*h+this._w*d,this._x=n*h+this._x*d,this._y=s*h+this._y*d,this._z=r*h+this._z*d,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class P{constructor(e=0,t=0,n=0){P.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(Ca.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(Ca.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*s-a*n),u=2*(a*t-r*s),h=2*(r*n-o*t);return this.x=t+l*c+o*h-a*u,this.y=n+l*u+a*c-r*h,this.z=s+l*h+r*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,l=t.z;return this.x=s*l-r*a,this.y=r*o-n*l,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Lr.copy(this).projectOnVector(e),this.sub(Lr)}reflect(e){return this.sub(Lr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(Mt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Lr=new P,Ca=new Yn;class ss{constructor(e=new P(1/0,1/0,1/0),t=new P(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Ht.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Ht.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Ht.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Ht):Ht.fromBufferAttribute(r,o),Ht.applyMatrix4(e.matrixWorld),this.expandByPoint(Ht);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),ms.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ms.copy(n.boundingBox)),ms.applyMatrix4(e.matrixWorld),this.union(ms)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Ht),Ht.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Fi),gs.subVectors(this.max,Fi),Qn.subVectors(e.a,Fi),ei.subVectors(e.b,Fi),ti.subVectors(e.c,Fi),mn.subVectors(ei,Qn),gn.subVectors(ti,ei),Un.subVectors(Qn,ti);let t=[0,-mn.z,mn.y,0,-gn.z,gn.y,0,-Un.z,Un.y,mn.z,0,-mn.x,gn.z,0,-gn.x,Un.z,0,-Un.x,-mn.y,mn.x,0,-gn.y,gn.x,0,-Un.y,Un.x,0];return!Ir(t,Qn,ei,ti,gs)||(t=[1,0,0,0,1,0,0,0,1],!Ir(t,Qn,ei,ti,gs))?!1:(_s.crossVectors(mn,gn),t=[_s.x,_s.y,_s.z],Ir(t,Qn,ei,ti,gs))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Ht).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Ht).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(nn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),nn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),nn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),nn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),nn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),nn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),nn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),nn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(nn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const nn=[new P,new P,new P,new P,new P,new P,new P,new P],Ht=new P,ms=new ss,Qn=new P,ei=new P,ti=new P,mn=new P,gn=new P,Un=new P,Fi=new P,gs=new P,_s=new P,Nn=new P;function Ir(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){Nn.fromArray(i,r);const a=s.x*Math.abs(Nn.x)+s.y*Math.abs(Nn.y)+s.z*Math.abs(Nn.z),l=e.dot(Nn),c=t.dot(Nn),u=n.dot(Nn);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const bu=new ss,Bi=new P,Dr=new P;class fr{constructor(e=new P,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):bu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;Bi.subVectors(e,this.center);const t=Bi.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(Bi,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Dr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(Bi.copy(e.center).add(Dr)),this.expandByPoint(Bi.copy(e.center).sub(Dr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const sn=new P,Ur=new P,vs=new P,_n=new P,Nr=new P,xs=new P,Or=new P;class Po{constructor(e=new P,t=new P(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,sn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=sn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(sn.copy(this.origin).addScaledVector(this.direction,t),sn.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){Ur.copy(e).add(t).multiplyScalar(.5),vs.copy(t).sub(e).normalize(),_n.copy(this.origin).sub(Ur);const r=e.distanceTo(t)*.5,o=-this.direction.dot(vs),a=_n.dot(this.direction),l=-_n.dot(vs),c=_n.lengthSq(),u=Math.abs(1-o*o);let h,d,p,g;if(u>0)if(h=o*l-a,d=o*a-l,g=r*u,h>=0)if(d>=-g)if(d<=g){const _=1/u;h*=_,d*=_,p=h*(h+o*d+2*a)+d*(o*h+d+2*l)+c}else d=r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d=-r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;else d<=-g?(h=Math.max(0,-(-o*r+a)),d=h>0?-r:Math.min(Math.max(-r,-l),r),p=-h*h+d*(d+2*l)+c):d<=g?(h=0,d=Math.min(Math.max(-r,-l),r),p=d*(d+2*l)+c):(h=Math.max(0,-(o*r+a)),d=h>0?r:Math.min(Math.max(-r,-l),r),p=-h*h+d*(d+2*l)+c);else d=o>0?-r:r,h=Math.max(0,-(o*d+a)),p=-h*h+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),s&&s.copy(Ur).addScaledVector(vs,d),p}intersectSphere(e,t){sn.subVectors(e.center,this.origin);const n=sn.dot(this.direction),s=sn.dot(sn)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,h=1/this.direction.z,d=this.origin;return c>=0?(n=(e.min.x-d.x)*c,s=(e.max.x-d.x)*c):(n=(e.max.x-d.x)*c,s=(e.min.x-d.x)*c),u>=0?(r=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(r=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),h>=0?(a=(e.min.z-d.z)*h,l=(e.max.z-d.z)*h):(a=(e.max.z-d.z)*h,l=(e.min.z-d.z)*h),n>l||a>s)||((a>n||n!==n)&&(n=a),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,sn)!==null}intersectTriangle(e,t,n,s,r){Nr.subVectors(t,e),xs.subVectors(n,e),Or.crossVectors(Nr,xs);let o=this.direction.dot(Or),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;_n.subVectors(this.origin,e);const l=a*this.direction.dot(xs.crossVectors(_n,xs));if(l<0)return null;const c=a*this.direction.dot(Nr.cross(_n));if(c<0||l+c>o)return null;const u=-a*_n.dot(Or);return u<0?null:this.at(u/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class tt{constructor(e,t,n,s,r,o,a,l,c,u,h,d,p,g,_,m){tt.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,l,c,u,h,d,p,g,_,m)}set(e,t,n,s,r,o,a,l,c,u,h,d,p,g,_,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=s,f[1]=r,f[5]=o,f[9]=a,f[13]=l,f[2]=c,f[6]=u,f[10]=h,f[14]=d,f[3]=p,f[7]=g,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new tt().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/ni.setFromMatrixColumn(e,0).length(),r=1/ni.setFromMatrixColumn(e,1).length(),o=1/ni.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(s),c=Math.sin(s),u=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const d=o*u,p=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=-l*h,t[8]=c,t[1]=p+g*c,t[5]=d-_*c,t[9]=-a*l,t[2]=_-d*c,t[6]=g+p*c,t[10]=o*l}else if(e.order==="YXZ"){const d=l*u,p=l*h,g=c*u,_=c*h;t[0]=d+_*a,t[4]=g*a-p,t[8]=o*c,t[1]=o*h,t[5]=o*u,t[9]=-a,t[2]=p*a-g,t[6]=_+d*a,t[10]=o*l}else if(e.order==="ZXY"){const d=l*u,p=l*h,g=c*u,_=c*h;t[0]=d-_*a,t[4]=-o*h,t[8]=g+p*a,t[1]=p+g*a,t[5]=o*u,t[9]=_-d*a,t[2]=-o*c,t[6]=a,t[10]=o*l}else if(e.order==="ZYX"){const d=o*u,p=o*h,g=a*u,_=a*h;t[0]=l*u,t[4]=g*c-p,t[8]=d*c+_,t[1]=l*h,t[5]=_*c+d,t[9]=p*c-g,t[2]=-c,t[6]=a*l,t[10]=o*l}else if(e.order==="YZX"){const d=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=_-d*h,t[8]=g*h+p,t[1]=h,t[5]=o*u,t[9]=-a*u,t[2]=-c*u,t[6]=p*h+g,t[10]=d-_*h}else if(e.order==="XZY"){const d=o*l,p=o*c,g=a*l,_=a*c;t[0]=l*u,t[4]=-h,t[8]=c*u,t[1]=d*h+_,t[5]=o*u,t[9]=p*h-g,t[2]=g*h-p,t[6]=a*u,t[10]=_*h+d}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Tu,e,Au)}lookAt(e,t,n){const s=this.elements;return Ut.subVectors(e,t),Ut.lengthSq()===0&&(Ut.z=1),Ut.normalize(),vn.crossVectors(n,Ut),vn.lengthSq()===0&&(Math.abs(n.z)===1?Ut.x+=1e-4:Ut.z+=1e-4,Ut.normalize(),vn.crossVectors(n,Ut)),vn.normalize(),Ms.crossVectors(Ut,vn),s[0]=vn.x,s[4]=Ms.x,s[8]=Ut.x,s[1]=vn.y,s[5]=Ms.y,s[9]=Ut.y,s[2]=vn.z,s[6]=Ms.z,s[10]=Ut.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],u=n[1],h=n[5],d=n[9],p=n[13],g=n[2],_=n[6],m=n[10],f=n[14],M=n[3],v=n[7],S=n[11],R=n[15],w=s[0],A=s[4],L=s[8],T=s[12],y=s[1],I=s[5],z=s[9],F=s[13],Y=s[2],q=s[6],W=s[10],K=s[14],X=s[3],he=s[7],ue=s[11],me=s[15];return r[0]=o*w+a*y+l*Y+c*X,r[4]=o*A+a*I+l*q+c*he,r[8]=o*L+a*z+l*W+c*ue,r[12]=o*T+a*F+l*K+c*me,r[1]=u*w+h*y+d*Y+p*X,r[5]=u*A+h*I+d*q+p*he,r[9]=u*L+h*z+d*W+p*ue,r[13]=u*T+h*F+d*K+p*me,r[2]=g*w+_*y+m*Y+f*X,r[6]=g*A+_*I+m*q+f*he,r[10]=g*L+_*z+m*W+f*ue,r[14]=g*T+_*F+m*K+f*me,r[3]=M*w+v*y+S*Y+R*X,r[7]=M*A+v*I+S*q+R*he,r[11]=M*L+v*z+S*W+R*ue,r[15]=M*T+v*F+S*K+R*me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],h=e[6],d=e[10],p=e[14],g=e[3],_=e[7],m=e[11],f=e[15];return g*(+r*l*h-s*c*h-r*a*d+n*c*d+s*a*p-n*l*p)+_*(+t*l*p-t*c*d+r*o*d-s*o*p+s*c*u-r*l*u)+m*(+t*c*h-t*a*p-r*o*h+n*o*p+r*a*u-n*c*u)+f*(-s*a*u-t*l*h+t*a*d+s*o*h-n*o*d+n*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],h=e[9],d=e[10],p=e[11],g=e[12],_=e[13],m=e[14],f=e[15],M=h*m*c-_*d*c+_*l*p-a*m*p-h*l*f+a*d*f,v=g*d*c-u*m*c-g*l*p+o*m*p+u*l*f-o*d*f,S=u*_*c-g*h*c+g*a*p-o*_*p-u*a*f+o*h*f,R=g*h*l-u*_*l-g*a*d+o*_*d+u*a*m-o*h*m,w=t*M+n*v+s*S+r*R;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const A=1/w;return e[0]=M*A,e[1]=(_*d*r-h*m*r-_*s*p+n*m*p+h*s*f-n*d*f)*A,e[2]=(a*m*r-_*l*r+_*s*c-n*m*c-a*s*f+n*l*f)*A,e[3]=(h*l*r-a*d*r-h*s*c+n*d*c+a*s*p-n*l*p)*A,e[4]=v*A,e[5]=(u*m*r-g*d*r+g*s*p-t*m*p-u*s*f+t*d*f)*A,e[6]=(g*l*r-o*m*r-g*s*c+t*m*c+o*s*f-t*l*f)*A,e[7]=(o*d*r-u*l*r+u*s*c-t*d*c-o*s*p+t*l*p)*A,e[8]=S*A,e[9]=(g*h*r-u*_*r-g*n*p+t*_*p+u*n*f-t*h*f)*A,e[10]=(o*_*r-g*a*r+g*n*c-t*_*c-o*n*f+t*a*f)*A,e[11]=(u*a*r-o*h*r-u*n*c+t*h*c+o*n*p-t*a*p)*A,e[12]=R*A,e[13]=(u*_*s-g*h*s+g*n*d-t*_*d-u*n*m+t*h*m)*A,e[14]=(g*a*s-o*_*s-g*n*l+t*_*l+o*n*m-t*a*m)*A,e[15]=(o*h*s-u*a*s+u*n*l-t*h*l-o*n*d+t*a*d)*A,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,l=e.z,c=r*o,u=r*a;return this.set(c*o+n,c*a-s*l,c*l+s*a,0,c*a+s*l,u*a+n,u*l-s*o,0,c*l-s*a,u*l+s*o,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,l=t._w,c=r+r,u=o+o,h=a+a,d=r*c,p=r*u,g=r*h,_=o*u,m=o*h,f=a*h,M=l*c,v=l*u,S=l*h,R=n.x,w=n.y,A=n.z;return s[0]=(1-(_+f))*R,s[1]=(p+S)*R,s[2]=(g-v)*R,s[3]=0,s[4]=(p-S)*w,s[5]=(1-(d+f))*w,s[6]=(m+M)*w,s[7]=0,s[8]=(g+v)*A,s[9]=(m-M)*A,s[10]=(1-(d+_))*A,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=ni.set(s[0],s[1],s[2]).length();const o=ni.set(s[4],s[5],s[6]).length(),a=ni.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],Gt.copy(this);const c=1/r,u=1/o,h=1/a;return Gt.elements[0]*=c,Gt.elements[1]*=c,Gt.elements[2]*=c,Gt.elements[4]*=u,Gt.elements[5]*=u,Gt.elements[6]*=u,Gt.elements[8]*=h,Gt.elements[9]*=h,Gt.elements[10]*=h,t.setFromRotationMatrix(Gt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=un){const l=this.elements,c=2*r/(t-e),u=2*r/(n-s),h=(t+e)/(t-e),d=(n+s)/(n-s);let p,g;if(a===un)p=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===ir)p=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return l[0]=c,l[4]=0,l[8]=h,l[12]=0,l[1]=0,l[5]=u,l[9]=d,l[13]=0,l[2]=0,l[6]=0,l[10]=p,l[14]=g,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=un){const l=this.elements,c=1/(t-e),u=1/(n-s),h=1/(o-r),d=(t+e)*c,p=(n+s)*u;let g,_;if(a===un)g=(o+r)*h,_=-2*h;else if(a===ir)g=r*h,_=-1*h;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-d,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-p,l[2]=0,l[6]=0,l[10]=_,l[14]=-g,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const ni=new P,Gt=new tt,Tu=new P(0,0,0),Au=new P(1,1,1),vn=new P,Ms=new P,Ut=new P,Pa=new tt,La=new Yn;class Qt{constructor(e=0,t=0,n=0,s=Qt.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],l=s[1],c=s[5],u=s[9],h=s[2],d=s[6],p=s[10];switch(t){case"XYZ":this._y=Math.asin(Mt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-Mt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(Mt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Mt(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(Mt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-Mt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-u,p),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Pa.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Pa,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return La.setFromEuler(this),this.setFromQuaternion(La,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Qt.DEFAULT_ORDER="XYZ";class rc{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let wu=0;const Ia=new P,ii=new Yn,rn=new tt,Ss=new P,zi=new P,Ru=new P,Cu=new Yn,Da=new P(1,0,0),Ua=new P(0,1,0),Na=new P(0,0,1),Oa={type:"added"},Pu={type:"removed"},si={type:"childadded",child:null},Fr={type:"childremoved",child:null};class St extends Kn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:wu++}),this.uuid=jt(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=St.DEFAULT_UP.clone();const e=new P,t=new Qt,n=new Yn,s=new P(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new tt},normalMatrix:{value:new Ue}}),this.matrix=new tt,this.matrixWorld=new tt,this.matrixAutoUpdate=St.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.multiply(ii),this}rotateOnWorldAxis(e,t){return ii.setFromAxisAngle(e,t),this.quaternion.premultiply(ii),this}rotateX(e){return this.rotateOnAxis(Da,e)}rotateY(e){return this.rotateOnAxis(Ua,e)}rotateZ(e){return this.rotateOnAxis(Na,e)}translateOnAxis(e,t){return Ia.copy(e).applyQuaternion(this.quaternion),this.position.add(Ia.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Da,e)}translateY(e){return this.translateOnAxis(Ua,e)}translateZ(e){return this.translateOnAxis(Na,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(rn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Ss.copy(e):Ss.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),zi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?rn.lookAt(zi,Ss,this.up):rn.lookAt(Ss,zi,this.up),this.quaternion.setFromRotationMatrix(rn),s&&(rn.extractRotation(s.matrixWorld),ii.setFromRotationMatrix(rn),this.quaternion.premultiply(ii.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Oa),si.child=e,this.dispatchEvent(si),si.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Pu),Fr.child=e,this.dispatchEvent(Fr),Fr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),rn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),rn.multiply(e.parent.matrixWorld)),e.applyMatrix4(rn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Oa),si.child=e,this.dispatchEvent(si),si.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zi,e,Ru),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(zi,Cu,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(r(e.materials,this.material[l]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];s.animations.push(r(e.animations,l))}}if(t){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),h=o(e.shapes),d=o(e.skeletons),p=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),h.length>0&&(n.shapes=h),d.length>0&&(n.skeletons=d),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}St.DEFAULT_UP=new P(0,1,0);St.DEFAULT_MATRIX_AUTO_UPDATE=!0;St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Vt=new P,on=new P,Br=new P,an=new P,ri=new P,oi=new P,Fa=new P,zr=new P,kr=new P,Hr=new P;class zt{constructor(e=new P,t=new P,n=new P){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),Vt.subVectors(e,t),s.cross(Vt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){Vt.subVectors(s,t),on.subVectors(n,t),Br.subVectors(e,t);const o=Vt.dot(Vt),a=Vt.dot(on),l=Vt.dot(Br),c=on.dot(on),u=on.dot(Br),h=o*c-a*a;if(h===0)return r.set(0,0,0),null;const d=1/h,p=(c*l-a*u)*d,g=(o*u-a*l)*d;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,an)===null?!1:an.x>=0&&an.y>=0&&an.x+an.y<=1}static getInterpolation(e,t,n,s,r,o,a,l){return this.getBarycoord(e,t,n,s,an)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,an.x),l.addScaledVector(o,an.y),l.addScaledVector(a,an.z),l)}static isFrontFacing(e,t,n,s){return Vt.subVectors(n,t),on.subVectors(e,t),Vt.cross(on).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vt.subVectors(this.c,this.b),on.subVectors(this.a,this.b),Vt.cross(on).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return zt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return zt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return zt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return zt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return zt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;ri.subVectors(s,n),oi.subVectors(r,n),zr.subVectors(e,n);const l=ri.dot(zr),c=oi.dot(zr);if(l<=0&&c<=0)return t.copy(n);kr.subVectors(e,s);const u=ri.dot(kr),h=oi.dot(kr);if(u>=0&&h<=u)return t.copy(s);const d=l*h-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(n).addScaledVector(ri,o);Hr.subVectors(e,r);const p=ri.dot(Hr),g=oi.dot(Hr);if(g>=0&&p<=g)return t.copy(r);const _=p*c-l*g;if(_<=0&&c>=0&&g<=0)return a=c/(c-g),t.copy(n).addScaledVector(oi,a);const m=u*g-p*h;if(m<=0&&h-u>=0&&p-g>=0)return Fa.subVectors(r,s),a=(h-u)/(h-u+(p-g)),t.copy(s).addScaledVector(Fa,a);const f=1/(m+_+d);return o=_*f,a=d*f,t.copy(n).addScaledVector(ri,o).addScaledVector(oi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const oc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},xn={h:0,s:0,l:0},ys={h:0,s:0,l:0};function Gr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Me{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=qt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=je.workingColorSpace){if(e=Ro(e,1),t=Mt(t,0,1),n=Mt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Gr(o,r,e+1/3),this.g=Gr(o,r,e),this.b=Gr(o,r,e-1/3)}return je.toWorkingColorSpace(this,s),this}setStyle(e,t=qt){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=qt){const n=oc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Ti(e.r),this.g=Ti(e.g),this.b=Ti(e.b),this}copyLinearToSRGB(e){return this.r=Cr(e.r),this.g=Cr(e.g),this.b=Cr(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=qt){return je.fromWorkingColorSpace(bt.copy(this),e),Math.round(Mt(bt.r*255,0,255))*65536+Math.round(Mt(bt.g*255,0,255))*256+Math.round(Mt(bt.b*255,0,255))}getHexString(e=qt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.fromWorkingColorSpace(bt.copy(this),t);const n=bt.r,s=bt.g,r=bt.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const h=o-a;switch(c=u<=.5?h/(o+a):h/(2-o-a),o){case n:l=(s-r)/h+(s<r?6:0);break;case s:l=(r-n)/h+2;break;case r:l=(n-s)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=je.workingColorSpace){return je.fromWorkingColorSpace(bt.copy(this),t),e.r=bt.r,e.g=bt.g,e.b=bt.b,e}getStyle(e=qt){je.fromWorkingColorSpace(bt.copy(this),e);const t=bt.r,n=bt.g,s=bt.b;return e!==qt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(xn),this.setHSL(xn.h+e,xn.s+t,xn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(xn),e.getHSL(ys);const n=qi(xn.h,ys.h,t),s=qi(xn.s,ys.s,t),r=qi(xn.l,ys.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const bt=new Me;Me.NAMES=oc;let Lu=0;class $n extends Kn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Lu++}),this.uuid=jt(),this.name="",this.type="Material",this.blending=yi,this.side=Jt,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=fo,this.blendDst=po,this.blendEquation=Hn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Me(0,0,0),this.blendAlpha=0,this.depthFunc=$s,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=nr,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jn,this.stencilZFail=jn,this.stencilZPass=jn,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==yi&&(n.blending=this.blending),this.side!==Jt&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==fo&&(n.blendSrc=this.blendSrc),this.blendDst!==po&&(n.blendDst=this.blendDst),this.blendEquation!==Hn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==$s&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==nr&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jn&&(n.stencilFail=this.stencilFail),this.stencilZFail!==jn&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==jn&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const l=r[a];delete l.metadata,o.push(l)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class pr extends $n{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Me(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qt,this.combine=Yl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const pt=new P,Es=new J;class Zt{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=vo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=bn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Co("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Es.fromBufferAttribute(this,t),Es.applyMatrix3(e),this.setXY(t,Es.x,Es.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix3(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyMatrix4(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.applyNormalMatrix(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)pt.fromBufferAttribute(this,t),pt.transformDirection(e),this.setXYZ(t,pt.x,pt.y,pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Yt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$e(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Yt(t,this.array)),t}setX(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Yt(t,this.array)),t}setY(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Yt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Yt(t,this.array)),t}setW(e,t){return this.normalized&&(t=$e(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),s=$e(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),s=$e(s,this.array),r=$e(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==vo&&(e.usage=this.usage),e}}class ac extends Zt{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class lc extends Zt{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class We extends Zt{constructor(e,t,n){super(new Float32Array(e),t,n)}}let Iu=0;const Bt=new tt,Vr=new St,ai=new P,Nt=new ss,ki=new ss,xt=new P;class it extends Kn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Iu++}),this.uuid=jt(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(nc(e)?lc:ac)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Ue().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Bt.makeRotationFromQuaternion(e),this.applyMatrix4(Bt),this}rotateX(e){return Bt.makeRotationX(e),this.applyMatrix4(Bt),this}rotateY(e){return Bt.makeRotationY(e),this.applyMatrix4(Bt),this}rotateZ(e){return Bt.makeRotationZ(e),this.applyMatrix4(Bt),this}translate(e,t,n){return Bt.makeTranslation(e,t,n),this.applyMatrix4(Bt),this}scale(e,t,n){return Bt.makeScale(e,t,n),this.applyMatrix4(Bt),this}lookAt(e){return Vr.lookAt(e),Vr.updateMatrix(),this.applyMatrix4(Vr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ai).negate(),this.translate(ai.x,ai.y,ai.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new We(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new ss);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new P(-1/0,-1/0,-1/0),new P(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Nt.setFromBufferAttribute(r),this.morphTargetsRelative?(xt.addVectors(this.boundingBox.min,Nt.min),this.boundingBox.expandByPoint(xt),xt.addVectors(this.boundingBox.max,Nt.max),this.boundingBox.expandByPoint(xt)):(this.boundingBox.expandByPoint(Nt.min),this.boundingBox.expandByPoint(Nt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new P,1/0);return}if(e){const n=this.boundingSphere.center;if(Nt.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];ki.setFromBufferAttribute(a),this.morphTargetsRelative?(xt.addVectors(Nt.min,ki.min),Nt.expandByPoint(xt),xt.addVectors(Nt.max,ki.max),Nt.expandByPoint(xt)):(Nt.expandByPoint(ki.min),Nt.expandByPoint(ki.max))}Nt.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)xt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(xt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)xt.fromBufferAttribute(a,c),l&&(ai.fromBufferAttribute(e,c),xt.add(ai)),s=Math.max(s,n.distanceToSquared(xt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Zt(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let L=0;L<n.count;L++)a[L]=new P,l[L]=new P;const c=new P,u=new P,h=new P,d=new J,p=new J,g=new J,_=new P,m=new P;function f(L,T,y){c.fromBufferAttribute(n,L),u.fromBufferAttribute(n,T),h.fromBufferAttribute(n,y),d.fromBufferAttribute(r,L),p.fromBufferAttribute(r,T),g.fromBufferAttribute(r,y),u.sub(c),h.sub(c),p.sub(d),g.sub(d);const I=1/(p.x*g.y-g.x*p.y);isFinite(I)&&(_.copy(u).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(I),m.copy(h).multiplyScalar(p.x).addScaledVector(u,-g.x).multiplyScalar(I),a[L].add(_),a[T].add(_),a[y].add(_),l[L].add(m),l[T].add(m),l[y].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:e.count}]);for(let L=0,T=M.length;L<T;++L){const y=M[L],I=y.start,z=y.count;for(let F=I,Y=I+z;F<Y;F+=3)f(e.getX(F+0),e.getX(F+1),e.getX(F+2))}const v=new P,S=new P,R=new P,w=new P;function A(L){R.fromBufferAttribute(s,L),w.copy(R);const T=a[L];v.copy(T),v.sub(R.multiplyScalar(R.dot(T))).normalize(),S.crossVectors(w,T);const I=S.dot(l[L])<0?-1:1;o.setXYZW(L,v.x,v.y,v.z,I)}for(let L=0,T=M.length;L<T;++L){const y=M[L],I=y.start,z=y.count;for(let F=I,Y=I+z;F<Y;F+=3)A(e.getX(F+0)),A(e.getX(F+1)),A(e.getX(F+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Zt(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let d=0,p=n.count;d<p;d++)n.setXYZ(d,0,0,0);const s=new P,r=new P,o=new P,a=new P,l=new P,c=new P,u=new P,h=new P;if(e)for(let d=0,p=e.count;d<p;d+=3){const g=e.getX(d+0),_=e.getX(d+1),m=e.getX(d+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),a.add(u),l.add(u),c.add(u),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let d=0,p=t.count;d<p;d+=3)s.fromBufferAttribute(t,d+0),r.fromBufferAttribute(t,d+1),o.fromBufferAttribute(t,d+2),u.subVectors(o,r),h.subVectors(s,r),u.cross(h),n.setXYZ(d+0,u.x,u.y,u.z),n.setXYZ(d+1,u.x,u.y,u.z),n.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)xt.fromBufferAttribute(e,t),xt.normalize(),e.setXYZ(t,xt.x,xt.y,xt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,h=a.normalized,d=new c.constructor(l.length*u);let p=0,g=0;for(let _=0,m=l.length;_<m;_++){a.isInterleavedBufferAttribute?p=l[_]*a.data.stride+a.offset:p=l[_]*u;for(let f=0;f<u;f++)d[g++]=c[p++]}return new Zt(d,u,h)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new it,n=this.index.array,s=this.attributes;for(const a in s){const l=s[a],c=e(l,n);t.setAttribute(a,c)}const r=this.morphAttributes;for(const a in r){const l=[],c=r[a];for(let u=0,h=c.length;u<h;u++){const d=c[u],p=e(d,n);l.push(p)}t.morphAttributes[a]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const s={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let h=0,d=c.length;h<d;h++){const p=c[h];u.push(p.toJSON(e.data))}u.length>0&&(s[l]=u,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const c in s){const u=s[c];this.setAttribute(c,u.clone(t))}const r=e.morphAttributes;for(const c in r){const u=[],h=r[c];for(let d=0,p=h.length;d<p;d++)u.push(h[d].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const h=o[c];this.addGroup(h.start,h.count,h.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ba=new tt,On=new Po,bs=new fr,za=new P,li=new P,ci=new P,hi=new P,Wr=new P,Ts=new P,As=new J,ws=new J,Rs=new J,ka=new P,Ha=new P,Ga=new P,Cs=new P,Ps=new P;class ht extends St{constructor(e=new it,t=new pr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){Ts.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=a[l],h=r[l];u!==0&&(Wr.fromBufferAttribute(h,e),o?Ts.addScaledVector(Wr,u):Ts.addScaledVector(Wr.sub(t),u))}t.add(Ts)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),bs.copy(n.boundingSphere),bs.applyMatrix4(r),On.copy(e.ray).recast(e.near),!(bs.containsPoint(On.origin)===!1&&(On.intersectSphere(bs,za)===null||On.origin.distanceToSquared(za)>(e.far-e.near)**2))&&(Ba.copy(r).invert(),On.copy(e.ray).applyMatrix4(Ba),!(n.boundingBox!==null&&On.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,On)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,h=r.attributes.normal,d=r.groups,p=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=o[m.materialIndex],M=Math.max(m.start,p.start),v=Math.min(a.count,Math.min(m.start+m.count,p.start+p.count));for(let S=M,R=v;S<R;S+=3){const w=a.getX(S),A=a.getX(S+1),L=a.getX(S+2);s=Ls(this,f,e,n,c,u,h,w,A,L),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(a.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const M=a.getX(m),v=a.getX(m+1),S=a.getX(m+2);s=Ls(this,o,e,n,c,u,h,M,v,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,_=d.length;g<_;g++){const m=d[g],f=o[m.materialIndex],M=Math.max(m.start,p.start),v=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let S=M,R=v;S<R;S+=3){const w=S,A=S+1,L=S+2;s=Ls(this,f,e,n,c,u,h,w,A,L),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=m.materialIndex,t.push(s))}}else{const g=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=g,f=_;m<f;m+=3){const M=m,v=m+1,S=m+2;s=Ls(this,o,e,n,c,u,h,M,v,S),s&&(s.faceIndex=Math.floor(m/3),t.push(s))}}}}function Du(i,e,t,n,s,r,o,a){let l;if(e.side===Pt?l=n.intersectTriangle(o,r,s,!0,a):l=n.intersectTriangle(s,r,o,e.side===Jt,a),l===null)return null;Ps.copy(a),Ps.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ps);return c<t.near||c>t.far?null:{distance:c,point:Ps.clone(),object:i}}function Ls(i,e,t,n,s,r,o,a,l,c){i.getVertexPosition(a,li),i.getVertexPosition(l,ci),i.getVertexPosition(c,hi);const u=Du(i,e,t,n,li,ci,hi,Cs);if(u){s&&(As.fromBufferAttribute(s,a),ws.fromBufferAttribute(s,l),Rs.fromBufferAttribute(s,c),u.uv=zt.getInterpolation(Cs,li,ci,hi,As,ws,Rs,new J)),r&&(As.fromBufferAttribute(r,a),ws.fromBufferAttribute(r,l),Rs.fromBufferAttribute(r,c),u.uv1=zt.getInterpolation(Cs,li,ci,hi,As,ws,Rs,new J)),o&&(ka.fromBufferAttribute(o,a),Ha.fromBufferAttribute(o,l),Ga.fromBufferAttribute(o,c),u.normal=zt.getInterpolation(Cs,li,ci,hi,ka,Ha,Ga,new P),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new P,materialIndex:0};zt.getNormal(li,ci,hi,h.normal),u.face=h}return u}class rs extends it{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const l=[],c=[],u=[],h=[];let d=0,p=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new We(c,3)),this.setAttribute("normal",new We(u,3)),this.setAttribute("uv",new We(h,2));function g(_,m,f,M,v,S,R,w,A,L,T){const y=S/A,I=R/L,z=S/2,F=R/2,Y=w/2,q=A+1,W=L+1;let K=0,X=0;const he=new P;for(let ue=0;ue<W;ue++){const me=ue*I-F;for(let ze=0;ze<q;ze++){const Xe=ze*y-z;he[_]=Xe*M,he[m]=me*v,he[f]=Y,c.push(he.x,he.y,he.z),he[_]=0,he[m]=0,he[f]=w>0?1:-1,u.push(he.x,he.y,he.z),h.push(ze/A),h.push(1-ue/L),K+=1}}for(let ue=0;ue<L;ue++)for(let me=0;me<A;me++){const ze=d+me+q*ue,Xe=d+me+q*(ue+1),Z=d+(me+1)+q*(ue+1),te=d+(me+1)+q*ue;l.push(ze,Xe,te),l.push(Xe,Z,te),X+=6}a.addGroup(p,X,T),p+=X,d+=K}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new rs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Li(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function wt(i){const e={};for(let t=0;t<i.length;t++){const n=Li(i[t]);for(const s in n)e[s]=n[s]}return e}function Uu(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function cc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const Nu={clone:Li,merge:wt};var Ou=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Fu=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class dn extends $n{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Ou,this.fragmentShader=Fu,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Li(e.uniforms),this.uniformsGroups=Uu(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class hc extends St{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new tt,this.projectionMatrix=new tt,this.projectionMatrixInverse=new tt,this.coordinateSystem=un}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Mn=new P,Va=new J,Wa=new J;class Ot extends hc{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=Qi*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(bi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return Qi*2*Math.atan(Math.tan(bi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Mn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Mn.x,Mn.y).multiplyScalar(-e/Mn.z),Mn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Mn.x,Mn.y).multiplyScalar(-e/Mn.z)}getViewSize(e,t){return this.getViewBounds(e,Va,Wa),t.subVectors(Wa,Va)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(bi*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;r+=o.offsetX*s/l,t-=o.offsetY*n/c,s*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const ui=-90,di=1;class Bu extends St{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Ot(ui,di,e,t);s.layers=this.layers,this.add(s);const r=new Ot(ui,di,e,t);r.layers=this.layers,this.add(r);const o=new Ot(ui,di,e,t);o.layers=this.layers,this.add(o);const a=new Ot(ui,di,e,t);a.layers=this.layers,this.add(a);const l=new Ot(ui,di,e,t);l.layers=this.layers,this.add(l);const c=new Ot(ui,di,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,l]=t;for(const c of t)this.remove(c);if(e===un)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ir)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,l,c,u]=this.children,h=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,l),e.setRenderTarget(n,4,s),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,u),e.setRenderTarget(h,d,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class uc extends yt{constructor(e,t,n,s,r,o,a,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Ai,super(e,t,n,s,r,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class zu extends Xn{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new uc(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Xt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new rs(5,5,5),r=new dn({name:"CubemapFromEquirect",uniforms:Li(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Pt,blending:An});r.uniforms.tEquirect.value=t;const o=new ht(s,r),a=t.minFilter;return t.minFilter===Wn&&(t.minFilter=Xt),new Bu(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}const Xr=new P,ku=new P,Hu=new Ue;class yn{constructor(e=new P(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=Xr.subVectors(n,t).cross(ku.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(Xr),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Hu.getNormalMatrix(e),s=this.coplanarPoint(Xr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Fn=new fr,Is=new P;class Lo{constructor(e=new yn,t=new yn,n=new yn,s=new yn,r=new yn,o=new yn){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=un){const n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],l=s[3],c=s[4],u=s[5],h=s[6],d=s[7],p=s[8],g=s[9],_=s[10],m=s[11],f=s[12],M=s[13],v=s[14],S=s[15];if(n[0].setComponents(l-r,d-c,m-p,S-f).normalize(),n[1].setComponents(l+r,d+c,m+p,S+f).normalize(),n[2].setComponents(l+o,d+u,m+g,S+M).normalize(),n[3].setComponents(l-o,d-u,m-g,S-M).normalize(),n[4].setComponents(l-a,d-h,m-_,S-v).normalize(),t===un)n[5].setComponents(l+a,d+h,m+_,S+v).normalize();else if(t===ir)n[5].setComponents(a,h,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Fn.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),Fn.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Fn)}intersectsSprite(e){return Fn.center.set(0,0,0),Fn.radius=.7071067811865476,Fn.applyMatrix4(e.matrixWorld),this.intersectsSphere(Fn)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Is.x=s.normal.x>0?e.max.x:e.min.x,Is.y=s.normal.y>0?e.max.y:e.min.y,Is.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Is)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function dc(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Gu(i){const e=new WeakMap;function t(a,l){const c=a.array,u=a.usage,h=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:h}}function n(a,l,c){const u=l.array,h=l._updateRange,d=l.updateRanges;if(i.bindBuffer(c,a),h.count===-1&&d.length===0&&i.bufferSubData(c,0,u),d.length!==0){for(let p=0,g=d.length;p<g;p++){const _=d[p];i.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}h.count!==-1&&(i.bufferSubData(c,h.offset*u.BYTES_PER_ELEMENT,u,h.offset,h.count),h.count=-1),l.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(i.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);if(c===void 0)e.set(a,t(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:s,remove:r,update:o}}class mr extends it{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),l=Math.floor(s),c=a+1,u=l+1,h=e/a,d=t/l,p=[],g=[],_=[],m=[];for(let f=0;f<u;f++){const M=f*d-o;for(let v=0;v<c;v++){const S=v*h-r;g.push(S,-M,0),_.push(0,0,1),m.push(v/a),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let M=0;M<a;M++){const v=M+c*f,S=M+c*(f+1),R=M+1+c*(f+1),w=M+1+c*f;p.push(v,S,w),p.push(S,R,w)}this.setIndex(p),this.setAttribute("position",new We(g,3)),this.setAttribute("normal",new We(_,3)),this.setAttribute("uv",new We(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mr(e.width,e.height,e.widthSegments,e.heightSegments)}}var Vu=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Wu=`#ifdef USE_ALPHAHASH
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
#endif`,Xu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Zu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,qu=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Ku=`#ifdef USE_AOMAP
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
#endif`,$u=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,ju=`#ifdef USE_BATCHING
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
#endif`,Ju=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,Qu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ed=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,td=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,nd=`#ifdef USE_IRIDESCENCE
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
#endif`,id=`#ifdef USE_BUMPMAP
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
#endif`,sd=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,rd=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,od=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ad=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,ld=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,cd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,hd=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ud=`#if defined( USE_COLOR_ALPHA )
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
#endif`,dd=`#define PI 3.141592653589793
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
} // validated`,fd=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,pd=`vec3 transformedNormal = objectNormal;
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
#endif`,md=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,gd=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,_d=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,vd=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,xd="gl_FragColor = linearToOutputTexel( gl_FragColor );",Md=`
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
}`,Sd=`#ifdef USE_ENVMAP
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
#endif`,yd=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Ed=`#ifdef USE_ENVMAP
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
#endif`,bd=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Td=`#ifdef USE_ENVMAP
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
#endif`,Ad=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,wd=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Rd=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Cd=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Pd=`#ifdef USE_GRADIENTMAP
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
}`,Ld=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Id=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Dd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Ud=`uniform bool receiveShadow;
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
#endif`,Nd=`#ifdef USE_ENVMAP
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
#endif`,Od=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Fd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Bd=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,zd=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kd=`PhysicalMaterial material;
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
#endif`,Hd=`struct PhysicalMaterial {
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
}`,Gd=`
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
#endif`,Vd=`#if defined( RE_IndirectDiffuse )
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
#endif`,Wd=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Xd=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Yd=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zd=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,qd=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Kd=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$d=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,jd=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,Jd=`#if defined( USE_POINTS_UV )
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
#endif`,Qd=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,ef=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,tf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,nf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,sf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,rf=`#ifdef USE_MORPHTARGETS
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
#endif`,of=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,af=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,lf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,cf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,hf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,df=`#ifdef USE_NORMALMAP
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
#endif`,ff=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,pf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,mf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,gf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,_f=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,vf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,xf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Mf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Sf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,yf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Ef=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Tf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Af=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,wf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Rf=`float getShadowMask() {
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
}`,Cf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Pf=`#ifdef USE_SKINNING
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
#endif`,Lf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,If=`#ifdef USE_SKINNING
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
#endif`,Df=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Uf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Nf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Of=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ff=`#ifdef USE_TRANSMISSION
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
#endif`,Bf=`#ifdef USE_TRANSMISSION
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
#endif`,zf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Hf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Vf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Wf=`uniform sampler2D t2D;
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
}`,Xf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Yf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Zf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,qf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kf=`#include <common>
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
}`,$f=`#if DEPTH_PACKING == 3200
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
}`,jf=`#define DISTANCE
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
}`,Jf=`#define DISTANCE
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
}`,Qf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ep=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,tp=`uniform float scale;
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
}`,np=`uniform vec3 diffuse;
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
}`,ip=`#include <common>
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
}`,sp=`uniform vec3 diffuse;
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
}`,rp=`#define LAMBERT
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
}`,op=`#define LAMBERT
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
}`,ap=`#define MATCAP
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
}`,lp=`#define MATCAP
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
}`,cp=`#define NORMAL
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
}`,hp=`#define NORMAL
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
}`,up=`#define PHONG
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
}`,dp=`#define PHONG
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
}`,fp=`#define STANDARD
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
}`,pp=`#define STANDARD
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
}`,mp=`#define TOON
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
}`,gp=`#define TOON
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
}`,_p=`uniform float size;
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
}`,vp=`uniform vec3 diffuse;
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
}`,xp=`#include <common>
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
}`,Mp=`uniform vec3 color;
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
}`,Sp=`uniform float rotation;
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
}`,yp=`uniform vec3 diffuse;
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
}`,De={alphahash_fragment:Vu,alphahash_pars_fragment:Wu,alphamap_fragment:Xu,alphamap_pars_fragment:Yu,alphatest_fragment:Zu,alphatest_pars_fragment:qu,aomap_fragment:Ku,aomap_pars_fragment:$u,batching_pars_vertex:ju,batching_vertex:Ju,begin_vertex:Qu,beginnormal_vertex:ed,bsdfs:td,iridescence_fragment:nd,bumpmap_pars_fragment:id,clipping_planes_fragment:sd,clipping_planes_pars_fragment:rd,clipping_planes_pars_vertex:od,clipping_planes_vertex:ad,color_fragment:ld,color_pars_fragment:cd,color_pars_vertex:hd,color_vertex:ud,common:dd,cube_uv_reflection_fragment:fd,defaultnormal_vertex:pd,displacementmap_pars_vertex:md,displacementmap_vertex:gd,emissivemap_fragment:_d,emissivemap_pars_fragment:vd,colorspace_fragment:xd,colorspace_pars_fragment:Md,envmap_fragment:Sd,envmap_common_pars_fragment:yd,envmap_pars_fragment:Ed,envmap_pars_vertex:bd,envmap_physical_pars_fragment:Nd,envmap_vertex:Td,fog_vertex:Ad,fog_pars_vertex:wd,fog_fragment:Rd,fog_pars_fragment:Cd,gradientmap_pars_fragment:Pd,lightmap_pars_fragment:Ld,lights_lambert_fragment:Id,lights_lambert_pars_fragment:Dd,lights_pars_begin:Ud,lights_toon_fragment:Od,lights_toon_pars_fragment:Fd,lights_phong_fragment:Bd,lights_phong_pars_fragment:zd,lights_physical_fragment:kd,lights_physical_pars_fragment:Hd,lights_fragment_begin:Gd,lights_fragment_maps:Vd,lights_fragment_end:Wd,logdepthbuf_fragment:Xd,logdepthbuf_pars_fragment:Yd,logdepthbuf_pars_vertex:Zd,logdepthbuf_vertex:qd,map_fragment:Kd,map_pars_fragment:$d,map_particle_fragment:jd,map_particle_pars_fragment:Jd,metalnessmap_fragment:Qd,metalnessmap_pars_fragment:ef,morphinstance_vertex:tf,morphcolor_vertex:nf,morphnormal_vertex:sf,morphtarget_pars_vertex:rf,morphtarget_vertex:of,normal_fragment_begin:af,normal_fragment_maps:lf,normal_pars_fragment:cf,normal_pars_vertex:hf,normal_vertex:uf,normalmap_pars_fragment:df,clearcoat_normal_fragment_begin:ff,clearcoat_normal_fragment_maps:pf,clearcoat_pars_fragment:mf,iridescence_pars_fragment:gf,opaque_fragment:_f,packing:vf,premultiplied_alpha_fragment:xf,project_vertex:Mf,dithering_fragment:Sf,dithering_pars_fragment:yf,roughnessmap_fragment:Ef,roughnessmap_pars_fragment:bf,shadowmap_pars_fragment:Tf,shadowmap_pars_vertex:Af,shadowmap_vertex:wf,shadowmask_pars_fragment:Rf,skinbase_vertex:Cf,skinning_pars_vertex:Pf,skinning_vertex:Lf,skinnormal_vertex:If,specularmap_fragment:Df,specularmap_pars_fragment:Uf,tonemapping_fragment:Nf,tonemapping_pars_fragment:Of,transmission_fragment:Ff,transmission_pars_fragment:Bf,uv_pars_fragment:zf,uv_pars_vertex:kf,uv_vertex:Hf,worldpos_vertex:Gf,background_vert:Vf,background_frag:Wf,backgroundCube_vert:Xf,backgroundCube_frag:Yf,cube_vert:Zf,cube_frag:qf,depth_vert:Kf,depth_frag:$f,distanceRGBA_vert:jf,distanceRGBA_frag:Jf,equirect_vert:Qf,equirect_frag:ep,linedashed_vert:tp,linedashed_frag:np,meshbasic_vert:ip,meshbasic_frag:sp,meshlambert_vert:rp,meshlambert_frag:op,meshmatcap_vert:ap,meshmatcap_frag:lp,meshnormal_vert:cp,meshnormal_frag:hp,meshphong_vert:up,meshphong_frag:dp,meshphysical_vert:fp,meshphysical_frag:pp,meshtoon_vert:mp,meshtoon_frag:gp,points_vert:_p,points_frag:vp,shadow_vert:xp,shadow_frag:Mp,sprite_vert:Sp,sprite_frag:yp},oe={common:{diffuse:{value:new Me(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ue}},envmap:{envMap:{value:null},envMapRotation:{value:new Ue},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ue}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ue}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ue},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ue},normalScale:{value:new J(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ue},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ue}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ue}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ue}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Me(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Me(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0},uvTransform:{value:new Ue}},sprite:{diffuse:{value:new Me(16777215)},opacity:{value:1},center:{value:new J(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ue},alphaMap:{value:null},alphaMapTransform:{value:new Ue},alphaTest:{value:0}}},Kt={basic:{uniforms:wt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:De.meshbasic_vert,fragmentShader:De.meshbasic_frag},lambert:{uniforms:wt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Me(0)}}]),vertexShader:De.meshlambert_vert,fragmentShader:De.meshlambert_frag},phong:{uniforms:wt([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new Me(0)},specular:{value:new Me(1118481)},shininess:{value:30}}]),vertexShader:De.meshphong_vert,fragmentShader:De.meshphong_frag},standard:{uniforms:wt([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new Me(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:De.meshphysical_vert,fragmentShader:De.meshphysical_frag},toon:{uniforms:wt([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new Me(0)}}]),vertexShader:De.meshtoon_vert,fragmentShader:De.meshtoon_frag},matcap:{uniforms:wt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:De.meshmatcap_vert,fragmentShader:De.meshmatcap_frag},points:{uniforms:wt([oe.points,oe.fog]),vertexShader:De.points_vert,fragmentShader:De.points_frag},dashed:{uniforms:wt([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:De.linedashed_vert,fragmentShader:De.linedashed_frag},depth:{uniforms:wt([oe.common,oe.displacementmap]),vertexShader:De.depth_vert,fragmentShader:De.depth_frag},normal:{uniforms:wt([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:De.meshnormal_vert,fragmentShader:De.meshnormal_frag},sprite:{uniforms:wt([oe.sprite,oe.fog]),vertexShader:De.sprite_vert,fragmentShader:De.sprite_frag},background:{uniforms:{uvTransform:{value:new Ue},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:De.background_vert,fragmentShader:De.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ue}},vertexShader:De.backgroundCube_vert,fragmentShader:De.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:De.cube_vert,fragmentShader:De.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:De.equirect_vert,fragmentShader:De.equirect_frag},distanceRGBA:{uniforms:wt([oe.common,oe.displacementmap,{referencePosition:{value:new P},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:De.distanceRGBA_vert,fragmentShader:De.distanceRGBA_frag},shadow:{uniforms:wt([oe.lights,oe.fog,{color:{value:new Me(0)},opacity:{value:1}}]),vertexShader:De.shadow_vert,fragmentShader:De.shadow_frag}};Kt.physical={uniforms:wt([Kt.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ue},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ue},clearcoatNormalScale:{value:new J(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ue},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ue},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ue},sheen:{value:0},sheenColor:{value:new Me(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ue},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ue},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ue},transmissionSamplerSize:{value:new J},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ue},attenuationDistance:{value:0},attenuationColor:{value:new Me(0)},specularColor:{value:new Me(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ue},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ue},anisotropyVector:{value:new J},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ue}}]),vertexShader:De.meshphysical_vert,fragmentShader:De.meshphysical_frag};const Ds={r:0,b:0,g:0},Bn=new Qt,Ep=new tt;function bp(i,e,t,n,s,r,o){const a=new Me(0);let l=r===!0?0:1,c,u,h=null,d=0,p=null;function g(M){let v=M.isScene===!0?M.background:null;return v&&v.isTexture&&(v=(M.backgroundBlurriness>0?t:e).get(v)),v}function _(M){let v=!1;const S=g(M);S===null?f(a,l):S&&S.isColor&&(f(S,1),v=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(M,v){const S=g(v);S&&(S.isCubeTexture||S.mapping===hr)?(u===void 0&&(u=new ht(new rs(1,1,1),new dn({name:"BackgroundCubeMaterial",uniforms:Li(Kt.backgroundCube.uniforms),vertexShader:Kt.backgroundCube.vertexShader,fragmentShader:Kt.backgroundCube.fragmentShader,side:Pt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,w,A){this.matrixWorld.copyPosition(A.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),Bn.copy(v.backgroundRotation),Bn.x*=-1,Bn.y*=-1,Bn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Bn.y*=-1,Bn.z*=-1),u.material.uniforms.envMap.value=S,u.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Ep.makeRotationFromEuler(Bn)),u.material.toneMapped=je.getTransfer(S.colorSpace)!==et,(h!==S||d!==S.version||p!==i.toneMapping)&&(u.material.needsUpdate=!0,h=S,d=S.version,p=i.toneMapping),u.layers.enableAll(),M.unshift(u,u.geometry,u.material,0,0,null)):S&&S.isTexture&&(c===void 0&&(c=new ht(new mr(2,2),new dn({name:"BackgroundMaterial",uniforms:Li(Kt.background.uniforms),vertexShader:Kt.background.vertexShader,fragmentShader:Kt.background.fragmentShader,side:Jt,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(c)),c.material.uniforms.t2D.value=S,c.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,c.material.toneMapped=je.getTransfer(S.colorSpace)!==et,S.matrixAutoUpdate===!0&&S.updateMatrix(),c.material.uniforms.uvTransform.value.copy(S.matrix),(h!==S||d!==S.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,h=S,d=S.version,p=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null))}function f(M,v){M.getRGB(Ds,cc(i)),n.buffers.color.setClear(Ds.r,Ds.g,Ds.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(M,v=1){a.set(M),l=v,f(a,l)},getClearAlpha:function(){return l},setClearAlpha:function(M){l=M,f(a,l)},render:_,addToRenderList:m}}function Tp(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null);let r=s,o=!1;function a(y,I,z,F,Y){let q=!1;const W=h(F,z,I);r!==W&&(r=W,c(r.object)),q=p(y,F,z,Y),q&&g(y,F,z,Y),Y!==null&&e.update(Y,i.ELEMENT_ARRAY_BUFFER),(q||o)&&(o=!1,S(y,I,z,F),Y!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Y).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function u(y){return i.deleteVertexArray(y)}function h(y,I,z){const F=z.wireframe===!0;let Y=n[y.id];Y===void 0&&(Y={},n[y.id]=Y);let q=Y[I.id];q===void 0&&(q={},Y[I.id]=q);let W=q[F];return W===void 0&&(W=d(l()),q[F]=W),W}function d(y){const I=[],z=[],F=[];for(let Y=0;Y<t;Y++)I[Y]=0,z[Y]=0,F[Y]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:z,attributeDivisors:F,object:y,attributes:{},index:null}}function p(y,I,z,F){const Y=r.attributes,q=I.attributes;let W=0;const K=z.getAttributes();for(const X in K)if(K[X].location>=0){const ue=Y[X];let me=q[X];if(me===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(me=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(me=y.instanceColor)),ue===void 0||ue.attribute!==me||me&&ue.data!==me.data)return!0;W++}return r.attributesNum!==W||r.index!==F}function g(y,I,z,F){const Y={},q=I.attributes;let W=0;const K=z.getAttributes();for(const X in K)if(K[X].location>=0){let ue=q[X];ue===void 0&&(X==="instanceMatrix"&&y.instanceMatrix&&(ue=y.instanceMatrix),X==="instanceColor"&&y.instanceColor&&(ue=y.instanceColor));const me={};me.attribute=ue,ue&&ue.data&&(me.data=ue.data),Y[X]=me,W++}r.attributes=Y,r.attributesNum=W,r.index=F}function _(){const y=r.newAttributes;for(let I=0,z=y.length;I<z;I++)y[I]=0}function m(y){f(y,0)}function f(y,I){const z=r.newAttributes,F=r.enabledAttributes,Y=r.attributeDivisors;z[y]=1,F[y]===0&&(i.enableVertexAttribArray(y),F[y]=1),Y[y]!==I&&(i.vertexAttribDivisor(y,I),Y[y]=I)}function M(){const y=r.newAttributes,I=r.enabledAttributes;for(let z=0,F=I.length;z<F;z++)I[z]!==y[z]&&(i.disableVertexAttribArray(z),I[z]=0)}function v(y,I,z,F,Y,q,W){W===!0?i.vertexAttribIPointer(y,I,z,Y,q):i.vertexAttribPointer(y,I,z,F,Y,q)}function S(y,I,z,F){_();const Y=F.attributes,q=z.getAttributes(),W=I.defaultAttributeValues;for(const K in q){const X=q[K];if(X.location>=0){let he=Y[K];if(he===void 0&&(K==="instanceMatrix"&&y.instanceMatrix&&(he=y.instanceMatrix),K==="instanceColor"&&y.instanceColor&&(he=y.instanceColor)),he!==void 0){const ue=he.normalized,me=he.itemSize,ze=e.get(he);if(ze===void 0)continue;const Xe=ze.buffer,Z=ze.type,te=ze.bytesPerElement,de=Z===i.INT||Z===i.UNSIGNED_INT||he.gpuType===ql;if(he.isInterleavedBufferAttribute){const ae=he.data,Ne=ae.stride,Re=he.offset;if(ae.isInstancedInterleavedBuffer){for(let ke=0;ke<X.locationSize;ke++)f(X.location+ke,ae.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let ke=0;ke<X.locationSize;ke++)m(X.location+ke);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let ke=0;ke<X.locationSize;ke++)v(X.location+ke,me/X.locationSize,Z,ue,Ne*te,(Re+me/X.locationSize*ke)*te,de)}else{if(he.isInstancedBufferAttribute){for(let ae=0;ae<X.locationSize;ae++)f(X.location+ae,he.meshPerAttribute);y.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=he.meshPerAttribute*he.count)}else for(let ae=0;ae<X.locationSize;ae++)m(X.location+ae);i.bindBuffer(i.ARRAY_BUFFER,Xe);for(let ae=0;ae<X.locationSize;ae++)v(X.location+ae,me/X.locationSize,Z,ue,me*te,me/X.locationSize*ae*te,de)}}else if(W!==void 0){const ue=W[K];if(ue!==void 0)switch(ue.length){case 2:i.vertexAttrib2fv(X.location,ue);break;case 3:i.vertexAttrib3fv(X.location,ue);break;case 4:i.vertexAttrib4fv(X.location,ue);break;default:i.vertexAttrib1fv(X.location,ue)}}}}M()}function R(){L();for(const y in n){const I=n[y];for(const z in I){const F=I[z];for(const Y in F)u(F[Y].object),delete F[Y];delete I[z]}delete n[y]}}function w(y){if(n[y.id]===void 0)return;const I=n[y.id];for(const z in I){const F=I[z];for(const Y in F)u(F[Y].object),delete F[Y];delete I[z]}delete n[y.id]}function A(y){for(const I in n){const z=n[I];if(z[y.id]===void 0)continue;const F=z[y.id];for(const Y in F)u(F[Y].object),delete F[Y];delete z[y.id]}}function L(){T(),o=!0,r!==s&&(r=s,c(r.object))}function T(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:L,resetDefaultState:T,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:M}}function Ap(i,e,t){let n;function s(c){n=c}function r(c,u){i.drawArrays(n,c,u),t.update(u,n,1)}function o(c,u,h){h!==0&&(i.drawArraysInstanced(n,c,u,h),t.update(u,n,h))}function a(c,u,h){if(h===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let p=0;p<h;p++)this.render(c[p],u[p]);else{d.multiDrawArraysWEBGL(n,c,0,u,0,h);let p=0;for(let g=0;g<h;g++)p+=u[g];t.update(p,n,1)}}function l(c,u,h,d){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)o(c[g],u[g],d[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,u,0,d,0,h);let g=0;for(let _=0;_<h;_++)g+=u[_];for(let _=0;_<d.length;_++)t.update(g,n,d[_])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=l}function wp(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const w=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(w.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(w){return!(w!==$t&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(w){const A=w===ur&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(w!==Rn&&n.convert(w)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&w!==bn&&!A)}function l(w){if(w==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";w="mediump"}return w==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const h=t.logarithmicDepthBuffer===!0,d=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),p=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),f=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),M=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=p>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:h,maxTextures:d,maxVertexTextures:p,maxTextureSize:g,maxCubemapSize:_,maxAttributes:m,maxVertexUniforms:f,maxVaryings:M,maxFragmentUniforms:v,vertexTextures:S,maxSamples:R}}function Rp(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new yn,a=new Ue,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,d){const p=h.length!==0||d||n!==0||s;return s=d,n=h.length,p},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,d){t=u(h,d,0)},this.setState=function(h,d,p){const g=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!s||g===null||g.length===0||r&&!m)r?u(null):c();else{const M=r?0:n,v=M*4;let S=f.clippingState||null;l.value=S,S=u(g,d,v,p);for(let R=0;R!==v;++R)S[R]=t[R];f.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function u(h,d,p,g){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=l.value,g!==!0||m===null){const f=p+_*4,M=d.matrixWorldInverse;a.getNormalMatrix(M),(m===null||m.length<f)&&(m=new Float32Array(f));for(let v=0,S=p;v!==_;++v,S+=4)o.copy(h[v]).applyMatrix4(M,a),o.normal.toArray(m,S),m[S+3]=o.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Cp(i){let e=new WeakMap;function t(o,a){return a===mo?o.mapping=Ai:a===go&&(o.mapping=wi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===mo||a===go)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new zu(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",s),t(c.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const l=e.get(a);l!==void 0&&(e.delete(a),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class fc extends hc{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,l=s-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,o=r+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const xi=4,Xa=[.125,.215,.35,.446,.526,.582],Gn=20,Yr=new fc,Ya=new Me;let Zr=null,qr=0,Kr=0,$r=!1;const kn=(1+Math.sqrt(5))/2,fi=1/kn,Za=[new P(-kn,fi,0),new P(kn,fi,0),new P(-fi,0,kn),new P(fi,0,kn),new P(0,kn,-fi),new P(0,kn,fi),new P(-1,1,-1),new P(1,1,-1),new P(-1,1,1),new P(1,1,1)];class qa{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){Zr=this._renderer.getRenderTarget(),qr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),$r=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ja(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=$a(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Zr,qr,Kr),this._renderer.xr.enabled=$r,e.scissorTest=!1,Us(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ai||e.mapping===wi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Zr=this._renderer.getRenderTarget(),qr=this._renderer.getActiveCubeFace(),Kr=this._renderer.getActiveMipmapLevel(),$r=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Xt,minFilter:Xt,generateMipmaps:!1,type:ur,format:$t,colorSpace:Pn,depthBuffer:!1},s=Ka(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ka(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Pp(r)),this._blurMaterial=Lp(r,e,t)}return s}_compileMaterial(e){const t=new ht(this._lodPlanes[0],e);this._renderer.compile(t,Yr)}_sceneToCubeUV(e,t,n,s){const a=new Ot(90,1,t,n),l=[1,-1,1,1,1,1],c=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,d=u.toneMapping;u.getClearColor(Ya),u.toneMapping=wn,u.autoClear=!1;const p=new pr({name:"PMREM.Background",side:Pt,depthWrite:!1,depthTest:!1}),g=new ht(new rs,p);let _=!1;const m=e.background;m?m.isColor&&(p.color.copy(m),e.background=null,_=!0):(p.color.copy(Ya),_=!0);for(let f=0;f<6;f++){const M=f%3;M===0?(a.up.set(0,l[f],0),a.lookAt(c[f],0,0)):M===1?(a.up.set(0,0,l[f]),a.lookAt(0,c[f],0)):(a.up.set(0,l[f],0),a.lookAt(0,0,c[f]));const v=this._cubeSize;Us(s,M*v,f>2?v:0,v,v),u.setRenderTarget(s),_&&u.render(g,a),u.render(e,a)}g.geometry.dispose(),g.material.dispose(),u.toneMapping=d,u.autoClear=h,e.background=m}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Ai||e.mapping===wi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=ja()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=$a());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new ht(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const l=this._cubeSize;Us(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(o,Yr)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=Za[(s-r-1)%Za.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,h=new ht(this._lodPlanes[s],c),d=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*Gn-1),_=r/g,m=isFinite(r)?1+Math.floor(u*_):Gn;m>Gn&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Gn}`);const f=[];let M=0;for(let A=0;A<Gn;++A){const L=A/_,T=Math.exp(-L*L/2);f.push(T),A===0?M+=T:A<m&&(M+=2*T)}for(let A=0;A<f.length;A++)f[A]=f[A]/M;d.envMap.value=e.texture,d.samples.value=m,d.weights.value=f,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:v}=this;d.dTheta.value=g,d.mipInt.value=v-n;const S=this._sizeLods[s],R=3*S*(s>v-xi?s-v+xi:0),w=4*(this._cubeSize-S);Us(t,R,w,3*S,2*S),l.setRenderTarget(t),l.render(h,Yr)}}function Pp(i){const e=[],t=[],n=[];let s=i;const r=i-xi+1+Xa.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let l=1/a;o>i-xi?l=Xa[o-i+xi-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,h=1+c,d=[u,u,h,u,h,h,u,u,h,h,u,h],p=6,g=6,_=3,m=2,f=1,M=new Float32Array(_*g*p),v=new Float32Array(m*g*p),S=new Float32Array(f*g*p);for(let w=0;w<p;w++){const A=w%3*2/3-1,L=w>2?0:-1,T=[A,L,0,A+2/3,L,0,A+2/3,L+1,0,A,L,0,A+2/3,L+1,0,A,L+1,0];M.set(T,_*g*w),v.set(d,m*g*w);const y=[w,w,w,w,w,w];S.set(y,f*g*w)}const R=new it;R.setAttribute("position",new Zt(M,_)),R.setAttribute("uv",new Zt(v,m)),R.setAttribute("faceIndex",new Zt(S,f)),e.push(R),s>xi&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Ka(i,e,t){const n=new Xn(i,e,t);return n.texture.mapping=hr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Us(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function Lp(i,e,t){const n=new Float32Array(Gn),s=new P(0,1,0);return new dn({name:"SphericalGaussianBlur",defines:{n:Gn,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Io(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function $a(){return new dn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Io(),fragmentShader:`

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
		`,blending:An,depthTest:!1,depthWrite:!1})}function ja(){return new dn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Io(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:An,depthTest:!1,depthWrite:!1})}function Io(){return`

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
	`}function Ip(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const l=a.mapping,c=l===mo||l===go,u=l===Ai||l===wi;if(c||u){let h=e.get(a);const d=h!==void 0?h.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==d)return t===null&&(t=new qa(i)),h=c?t.fromEquirectangular(a,h):t.fromCubemap(a,h),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),h.texture;if(h!==void 0)return h.texture;{const p=a.image;return c&&p&&p.height>0||u&&p&&s(p)?(t===null&&(t=new qa(i)),h=c?t.fromEquirectangular(a):t.fromCubemap(a),h.texture.pmremVersion=a.pmremVersion,e.set(a,h),a.addEventListener("dispose",r),h.texture):null}}}return a}function s(a){let l=0;const c=6;for(let u=0;u<c;u++)a[u]!==void 0&&l++;return l===c}function r(a){const l=a.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function Dp(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&Co("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function Up(i,e,t,n){const s={},r=new WeakMap;function o(h){const d=h.target;d.index!==null&&e.remove(d.index);for(const g in d.attributes)e.remove(d.attributes[g]);for(const g in d.morphAttributes){const _=d.morphAttributes[g];for(let m=0,f=_.length;m<f;m++)e.remove(_[m])}d.removeEventListener("dispose",o),delete s[d.id];const p=r.get(d);p&&(e.remove(p),r.delete(d)),n.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,t.memory.geometries--}function a(h,d){return s[d.id]===!0||(d.addEventListener("dispose",o),s[d.id]=!0,t.memory.geometries++),d}function l(h){const d=h.attributes;for(const g in d)e.update(d[g],i.ARRAY_BUFFER);const p=h.morphAttributes;for(const g in p){const _=p[g];for(let m=0,f=_.length;m<f;m++)e.update(_[m],i.ARRAY_BUFFER)}}function c(h){const d=[],p=h.index,g=h.attributes.position;let _=0;if(p!==null){const M=p.array;_=p.version;for(let v=0,S=M.length;v<S;v+=3){const R=M[v+0],w=M[v+1],A=M[v+2];d.push(R,w,w,A,A,R)}}else if(g!==void 0){const M=g.array;_=g.version;for(let v=0,S=M.length/3-1;v<S;v+=3){const R=v+0,w=v+1,A=v+2;d.push(R,w,w,A,A,R)}}else return;const m=new(nc(d)?lc:ac)(d,1);m.version=_;const f=r.get(h);f&&e.remove(f),r.set(h,m)}function u(h){const d=r.get(h);if(d){const p=h.index;p!==null&&d.version<p.version&&c(h)}else c(h);return r.get(h)}return{get:a,update:l,getWireframeAttribute:u}}function Np(i,e,t){let n;function s(d){n=d}let r,o;function a(d){r=d.type,o=d.bytesPerElement}function l(d,p){i.drawElements(n,p,r,d*o),t.update(p,n,1)}function c(d,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,d*o,g),t.update(p,n,g))}function u(d,p,g){if(g===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let m=0;m<g;m++)this.render(d[m]/o,p[m]);else{_.multiDrawElementsWEBGL(n,p,0,r,d,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}}function h(d,p,g,_){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<d.length;f++)c(d[f]/o,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,d,0,_,0,g);let f=0;for(let M=0;M<g;M++)f+=p[M];for(let M=0;M<_.length;M++)t.update(f,n,_[M])}}this.setMode=s,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=h}function Op(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function Fp(i,e,t){const n=new WeakMap,s=new nt;function r(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,h=u!==void 0?u.length:0;let d=n.get(a);if(d===void 0||d.count!==h){let y=function(){L.dispose(),n.delete(a),a.removeEventListener("dispose",y)};var p=y;d!==void 0&&d.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,m=a.morphAttributes.color!==void 0,f=a.morphAttributes.position||[],M=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let S=0;g===!0&&(S=1),_===!0&&(S=2),m===!0&&(S=3);let R=a.attributes.position.count*S,w=1;R>e.maxTextureSize&&(w=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const A=new Float32Array(R*w*4*h),L=new sc(A,R,w,h);L.type=bn,L.needsUpdate=!0;const T=S*4;for(let I=0;I<h;I++){const z=f[I],F=M[I],Y=v[I],q=R*w*4*I;for(let W=0;W<z.count;W++){const K=W*T;g===!0&&(s.fromBufferAttribute(z,W),A[q+K+0]=s.x,A[q+K+1]=s.y,A[q+K+2]=s.z,A[q+K+3]=0),_===!0&&(s.fromBufferAttribute(F,W),A[q+K+4]=s.x,A[q+K+5]=s.y,A[q+K+6]=s.z,A[q+K+7]=0),m===!0&&(s.fromBufferAttribute(Y,W),A[q+K+8]=s.x,A[q+K+9]=s.y,A[q+K+10]=s.z,A[q+K+11]=Y.itemSize===4?s.w:1)}}d={count:h,texture:L,size:new J(R,w)},n.set(a,d),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const _=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:r}}function Bp(i,e,t,n){let s=new WeakMap;function r(l){const c=n.render.frame,u=l.geometry,h=e.get(l,u);if(s.get(h)!==c&&(e.update(h),s.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",a)===!1&&l.addEventListener("dispose",a),s.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,c))),l.isSkinnedMesh){const d=l.skeleton;s.get(d)!==c&&(d.update(),s.set(d,c))}return h}function o(){s=new WeakMap}function a(l){const c=l.target;c.removeEventListener("dispose",a),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:o}}class pc extends yt{constructor(e,t,n,s,r,o,a,l,c,u=Ei){if(u!==Ei&&u!==Pi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Ei&&(n=Ri),n===void 0&&u===Pi&&(n=Ci),super(null,s,r,o,a,l,u,n,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:kt,this.minFilter=l!==void 0?l:kt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const mc=new yt,gc=new pc(1,1);gc.compareFunction=tc;const _c=new sc,vc=new Eu,xc=new uc,Ja=[],Qa=[],el=new Float32Array(16),tl=new Float32Array(9),nl=new Float32Array(4);function Di(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=Ja[s];if(r===void 0&&(r=new Float32Array(s),Ja[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function gt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function _t(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function gr(i,e){let t=Qa[e];t===void 0&&(t=new Int32Array(e),Qa[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function zp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function kp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;i.uniform2fv(this.addr,e),_t(t,e)}}function Hp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(gt(t,e))return;i.uniform3fv(this.addr,e),_t(t,e)}}function Gp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;i.uniform4fv(this.addr,e),_t(t,e)}}function Vp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),_t(t,e)}else{if(gt(t,n))return;nl.set(n),i.uniformMatrix2fv(this.addr,!1,nl),_t(t,n)}}function Wp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),_t(t,e)}else{if(gt(t,n))return;tl.set(n),i.uniformMatrix3fv(this.addr,!1,tl),_t(t,n)}}function Xp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(gt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),_t(t,e)}else{if(gt(t,n))return;el.set(n),i.uniformMatrix4fv(this.addr,!1,el),_t(t,n)}}function Yp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Zp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;i.uniform2iv(this.addr,e),_t(t,e)}}function qp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gt(t,e))return;i.uniform3iv(this.addr,e),_t(t,e)}}function Kp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;i.uniform4iv(this.addr,e),_t(t,e)}}function $p(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function jp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(gt(t,e))return;i.uniform2uiv(this.addr,e),_t(t,e)}}function Jp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(gt(t,e))return;i.uniform3uiv(this.addr,e),_t(t,e)}}function Qp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(gt(t,e))return;i.uniform4uiv(this.addr,e),_t(t,e)}}function em(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?gc:mc;t.setTexture2D(e||r,s)}function tm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||vc,s)}function nm(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||xc,s)}function im(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||_c,s)}function sm(i){switch(i){case 5126:return zp;case 35664:return kp;case 35665:return Hp;case 35666:return Gp;case 35674:return Vp;case 35675:return Wp;case 35676:return Xp;case 5124:case 35670:return Yp;case 35667:case 35671:return Zp;case 35668:case 35672:return qp;case 35669:case 35673:return Kp;case 5125:return $p;case 36294:return jp;case 36295:return Jp;case 36296:return Qp;case 35678:case 36198:case 36298:case 36306:case 35682:return em;case 35679:case 36299:case 36307:return tm;case 35680:case 36300:case 36308:case 36293:return nm;case 36289:case 36303:case 36311:case 36292:return im}}function rm(i,e){i.uniform1fv(this.addr,e)}function om(i,e){const t=Di(e,this.size,2);i.uniform2fv(this.addr,t)}function am(i,e){const t=Di(e,this.size,3);i.uniform3fv(this.addr,t)}function lm(i,e){const t=Di(e,this.size,4);i.uniform4fv(this.addr,t)}function cm(i,e){const t=Di(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function hm(i,e){const t=Di(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function um(i,e){const t=Di(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function dm(i,e){i.uniform1iv(this.addr,e)}function fm(i,e){i.uniform2iv(this.addr,e)}function pm(i,e){i.uniform3iv(this.addr,e)}function mm(i,e){i.uniform4iv(this.addr,e)}function gm(i,e){i.uniform1uiv(this.addr,e)}function _m(i,e){i.uniform2uiv(this.addr,e)}function vm(i,e){i.uniform3uiv(this.addr,e)}function xm(i,e){i.uniform4uiv(this.addr,e)}function Mm(i,e,t){const n=this.cache,s=e.length,r=gr(t,s);gt(n,r)||(i.uniform1iv(this.addr,r),_t(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||mc,r[o])}function Sm(i,e,t){const n=this.cache,s=e.length,r=gr(t,s);gt(n,r)||(i.uniform1iv(this.addr,r),_t(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||vc,r[o])}function ym(i,e,t){const n=this.cache,s=e.length,r=gr(t,s);gt(n,r)||(i.uniform1iv(this.addr,r),_t(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||xc,r[o])}function Em(i,e,t){const n=this.cache,s=e.length,r=gr(t,s);gt(n,r)||(i.uniform1iv(this.addr,r),_t(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||_c,r[o])}function bm(i){switch(i){case 5126:return rm;case 35664:return om;case 35665:return am;case 35666:return lm;case 35674:return cm;case 35675:return hm;case 35676:return um;case 5124:case 35670:return dm;case 35667:case 35671:return fm;case 35668:case 35672:return pm;case 35669:case 35673:return mm;case 5125:return gm;case 36294:return _m;case 36295:return vm;case 36296:return xm;case 35678:case 36198:case 36298:case 36306:case 35682:return Mm;case 35679:case 36299:case 36307:return Sm;case 35680:case 36300:case 36308:case 36293:return ym;case 36289:case 36303:case 36311:case 36292:return Em}}class Tm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=sm(t.type)}}class Am{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=bm(t.type)}}class wm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const jr=/(\w+)(\])?(\[|\.)?/g;function il(i,e){i.seq.push(e),i.map[e.id]=e}function Rm(i,e,t){const n=i.name,s=n.length;for(jr.lastIndex=0;;){const r=jr.exec(n),o=jr.lastIndex;let a=r[1];const l=r[2]==="]",c=r[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===s){il(t,c===void 0?new Tm(a,i,e):new Am(a,i,e));break}else{let h=t.map[a];h===void 0&&(h=new wm(a),il(t,h)),t=h}}}class Ks{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Rm(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],l=n[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function sl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Cm=37297;let Pm=0;function Lm(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function Im(i){const e=je.getPrimaries(je.workingColorSpace),t=je.getPrimaries(i);let n;switch(e===t?n="":e===tr&&t===er?n="LinearDisplayP3ToLinearSRGB":e===er&&t===tr&&(n="LinearSRGBToLinearDisplayP3"),i){case Pn:case dr:return[n,"LinearTransferOETF"];case qt:case wo:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function rl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+Lm(i.getShaderSource(e),o)}else return s}function Dm(i,e){const t=Im(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Um(i,e){let t;switch(e){case bh:t="Linear";break;case Th:t="Reinhard";break;case Ah:t="OptimizedCineon";break;case wh:t="ACESFilmic";break;case Ch:t="AgX";break;case Ph:t="Neutral";break;case Rh:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Nm(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Yi).join(`
`)}function Om(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Fm(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function Yi(i){return i!==""}function ol(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function al(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Bm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Mo(i){return i.replace(Bm,km)}const zm=new Map;function km(i,e){let t=De[e];if(t===void 0){const n=zm.get(e);if(n!==void 0)t=De[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Mo(t)}const Hm=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ll(i){return i.replace(Hm,Gm)}function Gm(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function cl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Vm(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===$c?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===ln&&(e="SHADOWMAP_TYPE_VSM"),e}function Wm(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ai:case wi:e="ENVMAP_TYPE_CUBE";break;case hr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Xm(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case wi:e="ENVMAP_MODE_REFRACTION";break}return e}function Ym(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Yl:e="ENVMAP_BLENDING_MULTIPLY";break;case yh:e="ENVMAP_BLENDING_MIX";break;case Eh:e="ENVMAP_BLENDING_ADD";break}return e}function Zm(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function qm(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const l=Vm(t),c=Wm(t),u=Xm(t),h=Ym(t),d=Zm(t),p=Nm(t),g=Om(r),_=s.createProgram();let m,f,M=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Yi).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(Yi).join(`
`),f.length>0&&(f+=`
`)):(m=[cl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Yi).join(`
`),f=[cl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+h:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==wn?"#define TONE_MAPPING":"",t.toneMapping!==wn?De.tonemapping_pars_fragment:"",t.toneMapping!==wn?Um("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",De.colorspace_pars_fragment,Dm("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(Yi).join(`
`)),o=Mo(o),o=ol(o,t),o=al(o,t),a=Mo(a),a=ol(a,t),a=al(a,t),o=ll(o),a=ll(a),t.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===ba?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===ba?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=M+m+o,S=M+f+a,R=sl(s,s.VERTEX_SHADER,v),w=sl(s,s.FRAGMENT_SHADER,S);s.attachShader(_,R),s.attachShader(_,w),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function A(I){if(i.debug.checkShaderErrors){const z=s.getProgramInfoLog(_).trim(),F=s.getShaderInfoLog(R).trim(),Y=s.getShaderInfoLog(w).trim();let q=!0,W=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(q=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,R,w);else{const K=rl(s,R,"vertex"),X=rl(s,w,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+z+`
`+K+`
`+X)}else z!==""?console.warn("THREE.WebGLProgram: Program Info Log:",z):(F===""||Y==="")&&(W=!1);W&&(I.diagnostics={runnable:q,programLog:z,vertexShader:{log:F,prefix:m},fragmentShader:{log:Y,prefix:f}})}s.deleteShader(R),s.deleteShader(w),L=new Ks(s,_),T=Fm(s,_)}let L;this.getUniforms=function(){return L===void 0&&A(this),L};let T;this.getAttributes=function(){return T===void 0&&A(this),T};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,Cm)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Pm++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=w,this}let Km=0;class $m{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new jm(e),t.set(e,n)),n}}class jm{constructor(e){this.id=Km++,this.code=e,this.usedTimes=0}}function Jm(i,e,t,n,s,r,o){const a=new rc,l=new $m,c=new Set,u=[],h=s.logarithmicDepthBuffer,d=s.vertexTextures;let p=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(T){return c.add(T),T===0?"uv":`uv${T}`}function m(T,y,I,z,F){const Y=z.fog,q=F.geometry,W=T.isMeshStandardMaterial?z.environment:null,K=(T.isMeshStandardMaterial?t:e).get(T.envMap||W),X=K&&K.mapping===hr?K.image.height:null,he=g[T.type];T.precision!==null&&(p=s.getMaxPrecision(T.precision),p!==T.precision&&console.warn("THREE.WebGLProgram.getParameters:",T.precision,"not supported, using",p,"instead."));const ue=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,me=ue!==void 0?ue.length:0;let ze=0;q.morphAttributes.position!==void 0&&(ze=1),q.morphAttributes.normal!==void 0&&(ze=2),q.morphAttributes.color!==void 0&&(ze=3);let Xe,Z,te,de;if(he){const Ye=Kt[he];Xe=Ye.vertexShader,Z=Ye.fragmentShader}else Xe=T.vertexShader,Z=T.fragmentShader,l.update(T),te=l.getVertexShaderID(T),de=l.getFragmentShaderID(T);const ae=i.getRenderTarget(),Ne=F.isInstancedMesh===!0,Re=F.isBatchedMesh===!0,ke=!!T.map,D=!!T.matcap,He=!!K,Be=!!T.aoMap,Qe=!!T.lightMap,ye=!!T.bumpMap,Ve=!!T.normalMap,Oe=!!T.displacementMap,Ce=!!T.emissiveMap,st=!!T.metalnessMap,C=!!T.roughnessMap,E=T.anisotropy>0,H=T.clearcoat>0,$=T.dispersion>0,Q=T.iridescence>0,ee=T.sheen>0,ve=T.transmission>0,re=E&&!!T.anisotropyMap,se=H&&!!T.clearcoatMap,Pe=H&&!!T.clearcoatNormalMap,ne=H&&!!T.clearcoatRoughnessMap,ge=Q&&!!T.iridescenceMap,Fe=Q&&!!T.iridescenceThicknessMap,be=ee&&!!T.sheenColorMap,le=ee&&!!T.sheenRoughnessMap,Le=!!T.specularMap,Ie=!!T.specularColorMap,ot=!!T.specularIntensityMap,x=ve&&!!T.transmissionMap,G=ve&&!!T.thicknessMap,O=!!T.gradientMap,V=!!T.alphaMap,j=T.alphaTest>0,xe=!!T.alphaHash,we=!!T.extensions;let at=wn;T.toneMapped&&(ae===null||ae.isXRRenderTarget===!0)&&(at=i.toneMapping);const ut={shaderID:he,shaderType:T.type,shaderName:T.name,vertexShader:Xe,fragmentShader:Z,defines:T.defines,customVertexShaderID:te,customFragmentShaderID:de,isRawShaderMaterial:T.isRawShaderMaterial===!0,glslVersion:T.glslVersion,precision:p,batching:Re,batchingColor:Re&&F._colorsTexture!==null,instancing:Ne,instancingColor:Ne&&F.instanceColor!==null,instancingMorph:Ne&&F.morphTexture!==null,supportsVertexTextures:d,outputColorSpace:ae===null?i.outputColorSpace:ae.isXRRenderTarget===!0?ae.texture.colorSpace:Pn,alphaToCoverage:!!T.alphaToCoverage,map:ke,matcap:D,envMap:He,envMapMode:He&&K.mapping,envMapCubeUVHeight:X,aoMap:Be,lightMap:Qe,bumpMap:ye,normalMap:Ve,displacementMap:d&&Oe,emissiveMap:Ce,normalMapObjectSpace:Ve&&T.normalMapType===Wh,normalMapTangentSpace:Ve&&T.normalMapType===ec,metalnessMap:st,roughnessMap:C,anisotropy:E,anisotropyMap:re,clearcoat:H,clearcoatMap:se,clearcoatNormalMap:Pe,clearcoatRoughnessMap:ne,dispersion:$,iridescence:Q,iridescenceMap:ge,iridescenceThicknessMap:Fe,sheen:ee,sheenColorMap:be,sheenRoughnessMap:le,specularMap:Le,specularColorMap:Ie,specularIntensityMap:ot,transmission:ve,transmissionMap:x,thicknessMap:G,gradientMap:O,opaque:T.transparent===!1&&T.blending===yi&&T.alphaToCoverage===!1,alphaMap:V,alphaTest:j,alphaHash:xe,combine:T.combine,mapUv:ke&&_(T.map.channel),aoMapUv:Be&&_(T.aoMap.channel),lightMapUv:Qe&&_(T.lightMap.channel),bumpMapUv:ye&&_(T.bumpMap.channel),normalMapUv:Ve&&_(T.normalMap.channel),displacementMapUv:Oe&&_(T.displacementMap.channel),emissiveMapUv:Ce&&_(T.emissiveMap.channel),metalnessMapUv:st&&_(T.metalnessMap.channel),roughnessMapUv:C&&_(T.roughnessMap.channel),anisotropyMapUv:re&&_(T.anisotropyMap.channel),clearcoatMapUv:se&&_(T.clearcoatMap.channel),clearcoatNormalMapUv:Pe&&_(T.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ne&&_(T.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&_(T.iridescenceMap.channel),iridescenceThicknessMapUv:Fe&&_(T.iridescenceThicknessMap.channel),sheenColorMapUv:be&&_(T.sheenColorMap.channel),sheenRoughnessMapUv:le&&_(T.sheenRoughnessMap.channel),specularMapUv:Le&&_(T.specularMap.channel),specularColorMapUv:Ie&&_(T.specularColorMap.channel),specularIntensityMapUv:ot&&_(T.specularIntensityMap.channel),transmissionMapUv:x&&_(T.transmissionMap.channel),thicknessMapUv:G&&_(T.thicknessMap.channel),alphaMapUv:V&&_(T.alphaMap.channel),vertexTangents:!!q.attributes.tangent&&(Ve||E),vertexColors:T.vertexColors,vertexAlphas:T.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!q.attributes.uv&&(ke||V),fog:!!Y,useFog:T.fog===!0,fogExp2:!!Y&&Y.isFogExp2,flatShading:T.flatShading===!0,sizeAttenuation:T.sizeAttenuation===!0,logarithmicDepthBuffer:h,skinning:F.isSkinnedMesh===!0,morphTargets:q.morphAttributes.position!==void 0,morphNormals:q.morphAttributes.normal!==void 0,morphColors:q.morphAttributes.color!==void 0,morphTargetsCount:me,morphTextureStride:ze,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:T.dithering,shadowMapEnabled:i.shadowMap.enabled&&I.length>0,shadowMapType:i.shadowMap.type,toneMapping:at,decodeVideoTexture:ke&&T.map.isVideoTexture===!0&&je.getTransfer(T.map.colorSpace)===et,premultipliedAlpha:T.premultipliedAlpha,doubleSided:T.side===Ct,flipSided:T.side===Pt,useDepthPacking:T.depthPacking>=0,depthPacking:T.depthPacking||0,index0AttributeName:T.index0AttributeName,extensionClipCullDistance:we&&T.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:we&&T.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:T.customProgramCacheKey()};return ut.vertexUv1s=c.has(1),ut.vertexUv2s=c.has(2),ut.vertexUv3s=c.has(3),c.clear(),ut}function f(T){const y=[];if(T.shaderID?y.push(T.shaderID):(y.push(T.customVertexShaderID),y.push(T.customFragmentShaderID)),T.defines!==void 0)for(const I in T.defines)y.push(I),y.push(T.defines[I]);return T.isRawShaderMaterial===!1&&(M(y,T),v(y,T),y.push(i.outputColorSpace)),y.push(T.customProgramCacheKey),y.join()}function M(T,y){T.push(y.precision),T.push(y.outputColorSpace),T.push(y.envMapMode),T.push(y.envMapCubeUVHeight),T.push(y.mapUv),T.push(y.alphaMapUv),T.push(y.lightMapUv),T.push(y.aoMapUv),T.push(y.bumpMapUv),T.push(y.normalMapUv),T.push(y.displacementMapUv),T.push(y.emissiveMapUv),T.push(y.metalnessMapUv),T.push(y.roughnessMapUv),T.push(y.anisotropyMapUv),T.push(y.clearcoatMapUv),T.push(y.clearcoatNormalMapUv),T.push(y.clearcoatRoughnessMapUv),T.push(y.iridescenceMapUv),T.push(y.iridescenceThicknessMapUv),T.push(y.sheenColorMapUv),T.push(y.sheenRoughnessMapUv),T.push(y.specularMapUv),T.push(y.specularColorMapUv),T.push(y.specularIntensityMapUv),T.push(y.transmissionMapUv),T.push(y.thicknessMapUv),T.push(y.combine),T.push(y.fogExp2),T.push(y.sizeAttenuation),T.push(y.morphTargetsCount),T.push(y.morphAttributeCount),T.push(y.numDirLights),T.push(y.numPointLights),T.push(y.numSpotLights),T.push(y.numSpotLightMaps),T.push(y.numHemiLights),T.push(y.numRectAreaLights),T.push(y.numDirLightShadows),T.push(y.numPointLightShadows),T.push(y.numSpotLightShadows),T.push(y.numSpotLightShadowsWithMaps),T.push(y.numLightProbes),T.push(y.shadowMapType),T.push(y.toneMapping),T.push(y.numClippingPlanes),T.push(y.numClipIntersection),T.push(y.depthPacking)}function v(T,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),T.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.doubleSided&&a.enable(10),y.flipSided&&a.enable(11),y.useDepthPacking&&a.enable(12),y.dithering&&a.enable(13),y.transmission&&a.enable(14),y.sheen&&a.enable(15),y.opaque&&a.enable(16),y.pointsUvs&&a.enable(17),y.decodeVideoTexture&&a.enable(18),y.alphaToCoverage&&a.enable(19),T.push(a.mask)}function S(T){const y=g[T.type];let I;if(y){const z=Kt[y];I=Nu.clone(z.uniforms)}else I=T.uniforms;return I}function R(T,y){let I;for(let z=0,F=u.length;z<F;z++){const Y=u[z];if(Y.cacheKey===y){I=Y,++I.usedTimes;break}}return I===void 0&&(I=new qm(i,y,T,r),u.push(I)),I}function w(T){if(--T.usedTimes===0){const y=u.indexOf(T);u[y]=u[u.length-1],u.pop(),T.destroy()}}function A(T){l.remove(T)}function L(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:S,acquireProgram:R,releaseProgram:w,releaseShaderCache:A,programs:u,dispose:L}}function Qm(){let i=new WeakMap;function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function t(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function eg(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function hl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function ul(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(h,d,p,g,_,m){let f=i[e];return f===void 0?(f={id:h.id,object:h,geometry:d,material:p,groupOrder:g,renderOrder:h.renderOrder,z:_,group:m},i[e]=f):(f.id=h.id,f.object=h,f.geometry=d,f.material=p,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=_,f.group=m),e++,f}function a(h,d,p,g,_,m){const f=o(h,d,p,g,_,m);p.transmission>0?n.push(f):p.transparent===!0?s.push(f):t.push(f)}function l(h,d,p,g,_,m){const f=o(h,d,p,g,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?s.unshift(f):t.unshift(f)}function c(h,d){t.length>1&&t.sort(h||eg),n.length>1&&n.sort(d||hl),s.length>1&&s.sort(d||hl)}function u(){for(let h=e,d=i.length;h<d;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:l,finish:u,sort:c}}function tg(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new ul,i.set(n,[o])):s>=r.length?(o=new ul,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function ng(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new P,color:new Me};break;case"SpotLight":t={position:new P,direction:new P,color:new Me,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new P,color:new Me,distance:0,decay:0};break;case"HemisphereLight":t={direction:new P,skyColor:new Me,groundColor:new Me};break;case"RectAreaLight":t={color:new Me,position:new P,halfWidth:new P,halfHeight:new P};break}return i[e.id]=t,t}}}function ig(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new J,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let sg=0;function rg(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function og(i){const e=new ng,t=ig(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new P);const s=new P,r=new tt,o=new tt;function a(c){let u=0,h=0,d=0;for(let T=0;T<9;T++)n.probe[T].set(0,0,0);let p=0,g=0,_=0,m=0,f=0,M=0,v=0,S=0,R=0,w=0,A=0;c.sort(rg);for(let T=0,y=c.length;T<y;T++){const I=c[T],z=I.color,F=I.intensity,Y=I.distance,q=I.shadow&&I.shadow.map?I.shadow.map.texture:null;if(I.isAmbientLight)u+=z.r*F,h+=z.g*F,d+=z.b*F;else if(I.isLightProbe){for(let W=0;W<9;W++)n.probe[W].addScaledVector(I.sh.coefficients[W],F);A++}else if(I.isDirectionalLight){const W=e.get(I);if(W.color.copy(I.color).multiplyScalar(I.intensity),I.castShadow){const K=I.shadow,X=t.get(I);X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.directionalShadow[p]=X,n.directionalShadowMap[p]=q,n.directionalShadowMatrix[p]=I.shadow.matrix,M++}n.directional[p]=W,p++}else if(I.isSpotLight){const W=e.get(I);W.position.setFromMatrixPosition(I.matrixWorld),W.color.copy(z).multiplyScalar(F),W.distance=Y,W.coneCos=Math.cos(I.angle),W.penumbraCos=Math.cos(I.angle*(1-I.penumbra)),W.decay=I.decay,n.spot[_]=W;const K=I.shadow;if(I.map&&(n.spotLightMap[R]=I.map,R++,K.updateMatrices(I),I.castShadow&&w++),n.spotLightMatrix[_]=K.matrix,I.castShadow){const X=t.get(I);X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,n.spotShadow[_]=X,n.spotShadowMap[_]=q,S++}_++}else if(I.isRectAreaLight){const W=e.get(I);W.color.copy(z).multiplyScalar(F),W.halfWidth.set(I.width*.5,0,0),W.halfHeight.set(0,I.height*.5,0),n.rectArea[m]=W,m++}else if(I.isPointLight){const W=e.get(I);if(W.color.copy(I.color).multiplyScalar(I.intensity),W.distance=I.distance,W.decay=I.decay,I.castShadow){const K=I.shadow,X=t.get(I);X.shadowBias=K.bias,X.shadowNormalBias=K.normalBias,X.shadowRadius=K.radius,X.shadowMapSize=K.mapSize,X.shadowCameraNear=K.camera.near,X.shadowCameraFar=K.camera.far,n.pointShadow[g]=X,n.pointShadowMap[g]=q,n.pointShadowMatrix[g]=I.shadow.matrix,v++}n.point[g]=W,g++}else if(I.isHemisphereLight){const W=e.get(I);W.skyColor.copy(I.color).multiplyScalar(F),W.groundColor.copy(I.groundColor).multiplyScalar(F),n.hemi[f]=W,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=oe.LTC_FLOAT_1,n.rectAreaLTC2=oe.LTC_FLOAT_2):(n.rectAreaLTC1=oe.LTC_HALF_1,n.rectAreaLTC2=oe.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=h,n.ambient[2]=d;const L=n.hash;(L.directionalLength!==p||L.pointLength!==g||L.spotLength!==_||L.rectAreaLength!==m||L.hemiLength!==f||L.numDirectionalShadows!==M||L.numPointShadows!==v||L.numSpotShadows!==S||L.numSpotMaps!==R||L.numLightProbes!==A)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=M,n.directionalShadowMap.length=M,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=M,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=S+R-w,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=A,L.directionalLength=p,L.pointLength=g,L.spotLength=_,L.rectAreaLength=m,L.hemiLength=f,L.numDirectionalShadows=M,L.numPointShadows=v,L.numSpotShadows=S,L.numSpotMaps=R,L.numLightProbes=A,n.version=sg++)}function l(c,u){let h=0,d=0,p=0,g=0,_=0;const m=u.matrixWorldInverse;for(let f=0,M=c.length;f<M;f++){const v=c[f];if(v.isDirectionalLight){const S=n.directional[h];S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),h++}else if(v.isSpotLight){const S=n.spot[p];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(m),p++}else if(v.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),o.identity(),r.copy(v.matrixWorld),r.premultiply(m),o.extractRotation(r),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const S=n.point[d];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(m),d++}else if(v.isHemisphereLight){const S=n.hemi[_];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(m),_++}}}return{setup:a,setupView:l,state:n}}function dl(i){const e=new og(i),t=[],n=[];function s(u){c.camera=u,t.length=0,n.length=0}function r(u){t.push(u)}function o(u){n.push(u)}function a(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:c,setupLights:a,setupLightsView:l,pushLight:r,pushShadow:o}}function ag(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new dl(i),e.set(s,[a])):r>=o.length?(a=new dl(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class lg extends $n{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Gh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class cg extends $n{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const hg=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,ug=`uniform sampler2D shadow_pass;
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
}`;function dg(i,e,t){let n=new Lo;const s=new J,r=new J,o=new nt,a=new lg({depthPacking:Vh}),l=new cg,c={},u=t.maxTextureSize,h={[Jt]:Pt,[Pt]:Jt,[Ct]:Ct},d=new dn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new J},radius:{value:4}},vertexShader:hg,fragmentShader:ug}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const g=new it;g.setAttribute("position",new Zt(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new ht(g,d),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xl;let f=this.type;this.render=function(w,A,L){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||w.length===0)return;const T=i.getRenderTarget(),y=i.getActiveCubeFace(),I=i.getActiveMipmapLevel(),z=i.state;z.setBlending(An),z.buffers.color.setClear(1,1,1,1),z.buffers.depth.setTest(!0),z.setScissorTest(!1);const F=f!==ln&&this.type===ln,Y=f===ln&&this.type!==ln;for(let q=0,W=w.length;q<W;q++){const K=w[q],X=K.shadow;if(X===void 0){console.warn("THREE.WebGLShadowMap:",K,"has no shadow.");continue}if(X.autoUpdate===!1&&X.needsUpdate===!1)continue;s.copy(X.mapSize);const he=X.getFrameExtents();if(s.multiply(he),r.copy(X.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/he.x),s.x=r.x*he.x,X.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/he.y),s.y=r.y*he.y,X.mapSize.y=r.y)),X.map===null||F===!0||Y===!0){const me=this.type!==ln?{minFilter:kt,magFilter:kt}:{};X.map!==null&&X.map.dispose(),X.map=new Xn(s.x,s.y,me),X.map.texture.name=K.name+".shadowMap",X.camera.updateProjectionMatrix()}i.setRenderTarget(X.map),i.clear();const ue=X.getViewportCount();for(let me=0;me<ue;me++){const ze=X.getViewport(me);o.set(r.x*ze.x,r.y*ze.y,r.x*ze.z,r.y*ze.w),z.viewport(o),X.updateMatrices(K,me),n=X.getFrustum(),S(A,L,X.camera,K,this.type)}X.isPointLightShadow!==!0&&this.type===ln&&M(X,L),X.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(T,y,I)};function M(w,A){const L=e.update(_);d.defines.VSM_SAMPLES!==w.blurSamples&&(d.defines.VSM_SAMPLES=w.blurSamples,p.defines.VSM_SAMPLES=w.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new Xn(s.x,s.y)),d.uniforms.shadow_pass.value=w.map.texture,d.uniforms.resolution.value=w.mapSize,d.uniforms.radius.value=w.radius,i.setRenderTarget(w.mapPass),i.clear(),i.renderBufferDirect(A,null,L,d,_,null),p.uniforms.shadow_pass.value=w.mapPass.texture,p.uniforms.resolution.value=w.mapSize,p.uniforms.radius.value=w.radius,i.setRenderTarget(w.map),i.clear(),i.renderBufferDirect(A,null,L,p,_,null)}function v(w,A,L,T){let y=null;const I=L.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(I!==void 0)y=I;else if(y=L.isPointLight===!0?l:a,i.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0){const z=y.uuid,F=A.uuid;let Y=c[z];Y===void 0&&(Y={},c[z]=Y);let q=Y[F];q===void 0&&(q=y.clone(),Y[F]=q,A.addEventListener("dispose",R)),y=q}if(y.visible=A.visible,y.wireframe=A.wireframe,T===ln?y.side=A.shadowSide!==null?A.shadowSide:A.side:y.side=A.shadowSide!==null?A.shadowSide:h[A.side],y.alphaMap=A.alphaMap,y.alphaTest=A.alphaTest,y.map=A.map,y.clipShadows=A.clipShadows,y.clippingPlanes=A.clippingPlanes,y.clipIntersection=A.clipIntersection,y.displacementMap=A.displacementMap,y.displacementScale=A.displacementScale,y.displacementBias=A.displacementBias,y.wireframeLinewidth=A.wireframeLinewidth,y.linewidth=A.linewidth,L.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const z=i.properties.get(y);z.light=L}return y}function S(w,A,L,T,y){if(w.visible===!1)return;if(w.layers.test(A.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&y===ln)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(L.matrixWorldInverse,w.matrixWorld);const F=e.update(w),Y=w.material;if(Array.isArray(Y)){const q=F.groups;for(let W=0,K=q.length;W<K;W++){const X=q[W],he=Y[X.materialIndex];if(he&&he.visible){const ue=v(w,he,T,y);w.onBeforeShadow(i,w,A,L,F,ue,X),i.renderBufferDirect(L,null,F,ue,w,X),w.onAfterShadow(i,w,A,L,F,ue,X)}}}else if(Y.visible){const q=v(w,Y,T,y);w.onBeforeShadow(i,w,A,L,F,q,null),i.renderBufferDirect(L,null,F,q,w,null),w.onAfterShadow(i,w,A,L,F,q,null)}}const z=w.children;for(let F=0,Y=z.length;F<Y;F++)S(z[F],A,L,T,y)}function R(w){w.target.removeEventListener("dispose",R);for(const L in c){const T=c[L],y=w.target.uuid;y in T&&(T[y].dispose(),delete T[y])}}}function fg(i){function e(){let x=!1;const G=new nt;let O=null;const V=new nt(0,0,0,0);return{setMask:function(j){O!==j&&!x&&(i.colorMask(j,j,j,j),O=j)},setLocked:function(j){x=j},setClear:function(j,xe,we,at,ut){ut===!0&&(j*=at,xe*=at,we*=at),G.set(j,xe,we,at),V.equals(G)===!1&&(i.clearColor(j,xe,we,at),V.copy(G))},reset:function(){x=!1,O=null,V.set(-1,0,0,0)}}}function t(){let x=!1,G=null,O=null,V=null;return{setTest:function(j){j?de(i.DEPTH_TEST):ae(i.DEPTH_TEST)},setMask:function(j){G!==j&&!x&&(i.depthMask(j),G=j)},setFunc:function(j){if(O!==j){switch(j){case mh:i.depthFunc(i.NEVER);break;case gh:i.depthFunc(i.ALWAYS);break;case _h:i.depthFunc(i.LESS);break;case $s:i.depthFunc(i.LEQUAL);break;case vh:i.depthFunc(i.EQUAL);break;case xh:i.depthFunc(i.GEQUAL);break;case Mh:i.depthFunc(i.GREATER);break;case Sh:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}O=j}},setLocked:function(j){x=j},setClear:function(j){V!==j&&(i.clearDepth(j),V=j)},reset:function(){x=!1,G=null,O=null,V=null}}}function n(){let x=!1,G=null,O=null,V=null,j=null,xe=null,we=null,at=null,ut=null;return{setTest:function(Ye){x||(Ye?de(i.STENCIL_TEST):ae(i.STENCIL_TEST))},setMask:function(Ye){G!==Ye&&!x&&(i.stencilMask(Ye),G=Ye)},setFunc:function(Ye,dt,ft){(O!==Ye||V!==dt||j!==ft)&&(i.stencilFunc(Ye,dt,ft),O=Ye,V=dt,j=ft)},setOp:function(Ye,dt,ft){(xe!==Ye||we!==dt||at!==ft)&&(i.stencilOp(Ye,dt,ft),xe=Ye,we=dt,at=ft)},setLocked:function(Ye){x=Ye},setClear:function(Ye){ut!==Ye&&(i.clearStencil(Ye),ut=Ye)},reset:function(){x=!1,G=null,O=null,V=null,j=null,xe=null,we=null,at=null,ut=null}}}const s=new e,r=new t,o=new n,a=new WeakMap,l=new WeakMap;let c={},u={},h=new WeakMap,d=[],p=null,g=!1,_=null,m=null,f=null,M=null,v=null,S=null,R=null,w=new Me(0,0,0),A=0,L=!1,T=null,y=null,I=null,z=null,F=null;const Y=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let q=!1,W=0;const K=i.getParameter(i.VERSION);K.indexOf("WebGL")!==-1?(W=parseFloat(/^WebGL (\d)/.exec(K)[1]),q=W>=1):K.indexOf("OpenGL ES")!==-1&&(W=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),q=W>=2);let X=null,he={};const ue=i.getParameter(i.SCISSOR_BOX),me=i.getParameter(i.VIEWPORT),ze=new nt().fromArray(ue),Xe=new nt().fromArray(me);function Z(x,G,O,V){const j=new Uint8Array(4),xe=i.createTexture();i.bindTexture(x,xe),i.texParameteri(x,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(x,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let we=0;we<O;we++)x===i.TEXTURE_3D||x===i.TEXTURE_2D_ARRAY?i.texImage3D(G,0,i.RGBA,1,1,V,0,i.RGBA,i.UNSIGNED_BYTE,j):i.texImage2D(G+we,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,j);return xe}const te={};te[i.TEXTURE_2D]=Z(i.TEXTURE_2D,i.TEXTURE_2D,1),te[i.TEXTURE_CUBE_MAP]=Z(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[i.TEXTURE_2D_ARRAY]=Z(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),te[i.TEXTURE_3D]=Z(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),de(i.DEPTH_TEST),r.setFunc($s),ye(!1),Ve(qo),de(i.CULL_FACE),Be(An);function de(x){c[x]!==!0&&(i.enable(x),c[x]=!0)}function ae(x){c[x]!==!1&&(i.disable(x),c[x]=!1)}function Ne(x,G){return u[x]!==G?(i.bindFramebuffer(x,G),u[x]=G,x===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=G),x===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=G),!0):!1}function Re(x,G){let O=d,V=!1;if(x){O=h.get(G),O===void 0&&(O=[],h.set(G,O));const j=x.textures;if(O.length!==j.length||O[0]!==i.COLOR_ATTACHMENT0){for(let xe=0,we=j.length;xe<we;xe++)O[xe]=i.COLOR_ATTACHMENT0+xe;O.length=j.length,V=!0}}else O[0]!==i.BACK&&(O[0]=i.BACK,V=!0);V&&i.drawBuffers(O)}function ke(x){return p!==x?(i.useProgram(x),p=x,!0):!1}const D={[Hn]:i.FUNC_ADD,[Jc]:i.FUNC_SUBTRACT,[Qc]:i.FUNC_REVERSE_SUBTRACT};D[eh]=i.MIN,D[th]=i.MAX;const He={[nh]:i.ZERO,[ih]:i.ONE,[sh]:i.SRC_COLOR,[fo]:i.SRC_ALPHA,[hh]:i.SRC_ALPHA_SATURATE,[lh]:i.DST_COLOR,[oh]:i.DST_ALPHA,[rh]:i.ONE_MINUS_SRC_COLOR,[po]:i.ONE_MINUS_SRC_ALPHA,[ch]:i.ONE_MINUS_DST_COLOR,[ah]:i.ONE_MINUS_DST_ALPHA,[uh]:i.CONSTANT_COLOR,[dh]:i.ONE_MINUS_CONSTANT_COLOR,[fh]:i.CONSTANT_ALPHA,[ph]:i.ONE_MINUS_CONSTANT_ALPHA};function Be(x,G,O,V,j,xe,we,at,ut,Ye){if(x===An){g===!0&&(ae(i.BLEND),g=!1);return}if(g===!1&&(de(i.BLEND),g=!0),x!==jc){if(x!==_||Ye!==L){if((m!==Hn||v!==Hn)&&(i.blendEquation(i.FUNC_ADD),m=Hn,v=Hn),Ye)switch(x){case yi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ko:i.blendFunc(i.ONE,i.ONE);break;case $o:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case jo:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",x);break}else switch(x){case yi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ko:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case $o:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case jo:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",x);break}f=null,M=null,S=null,R=null,w.set(0,0,0),A=0,_=x,L=Ye}return}j=j||G,xe=xe||O,we=we||V,(G!==m||j!==v)&&(i.blendEquationSeparate(D[G],D[j]),m=G,v=j),(O!==f||V!==M||xe!==S||we!==R)&&(i.blendFuncSeparate(He[O],He[V],He[xe],He[we]),f=O,M=V,S=xe,R=we),(at.equals(w)===!1||ut!==A)&&(i.blendColor(at.r,at.g,at.b,ut),w.copy(at),A=ut),_=x,L=!1}function Qe(x,G){x.side===Ct?ae(i.CULL_FACE):de(i.CULL_FACE);let O=x.side===Pt;G&&(O=!O),ye(O),x.blending===yi&&x.transparent===!1?Be(An):Be(x.blending,x.blendEquation,x.blendSrc,x.blendDst,x.blendEquationAlpha,x.blendSrcAlpha,x.blendDstAlpha,x.blendColor,x.blendAlpha,x.premultipliedAlpha),r.setFunc(x.depthFunc),r.setTest(x.depthTest),r.setMask(x.depthWrite),s.setMask(x.colorWrite);const V=x.stencilWrite;o.setTest(V),V&&(o.setMask(x.stencilWriteMask),o.setFunc(x.stencilFunc,x.stencilRef,x.stencilFuncMask),o.setOp(x.stencilFail,x.stencilZFail,x.stencilZPass)),Ce(x.polygonOffset,x.polygonOffsetFactor,x.polygonOffsetUnits),x.alphaToCoverage===!0?de(i.SAMPLE_ALPHA_TO_COVERAGE):ae(i.SAMPLE_ALPHA_TO_COVERAGE)}function ye(x){T!==x&&(x?i.frontFace(i.CW):i.frontFace(i.CCW),T=x)}function Ve(x){x!==qc?(de(i.CULL_FACE),x!==y&&(x===qo?i.cullFace(i.BACK):x===Kc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):ae(i.CULL_FACE),y=x}function Oe(x){x!==I&&(q&&i.lineWidth(x),I=x)}function Ce(x,G,O){x?(de(i.POLYGON_OFFSET_FILL),(z!==G||F!==O)&&(i.polygonOffset(G,O),z=G,F=O)):ae(i.POLYGON_OFFSET_FILL)}function st(x){x?de(i.SCISSOR_TEST):ae(i.SCISSOR_TEST)}function C(x){x===void 0&&(x=i.TEXTURE0+Y-1),X!==x&&(i.activeTexture(x),X=x)}function E(x,G,O){O===void 0&&(X===null?O=i.TEXTURE0+Y-1:O=X);let V=he[O];V===void 0&&(V={type:void 0,texture:void 0},he[O]=V),(V.type!==x||V.texture!==G)&&(X!==O&&(i.activeTexture(O),X=O),i.bindTexture(x,G||te[x]),V.type=x,V.texture=G)}function H(){const x=he[X];x!==void 0&&x.type!==void 0&&(i.bindTexture(x.type,null),x.type=void 0,x.texture=void 0)}function $(){try{i.compressedTexImage2D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function Q(){try{i.compressedTexImage3D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function ee(){try{i.texSubImage2D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function ve(){try{i.texSubImage3D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function re(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function se(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function Pe(){try{i.texStorage2D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function ne(){try{i.texStorage3D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function ge(){try{i.texImage2D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function Fe(){try{i.texImage3D.apply(i,arguments)}catch(x){console.error("THREE.WebGLState:",x)}}function be(x){ze.equals(x)===!1&&(i.scissor(x.x,x.y,x.z,x.w),ze.copy(x))}function le(x){Xe.equals(x)===!1&&(i.viewport(x.x,x.y,x.z,x.w),Xe.copy(x))}function Le(x,G){let O=l.get(G);O===void 0&&(O=new WeakMap,l.set(G,O));let V=O.get(x);V===void 0&&(V=i.getUniformBlockIndex(G,x.name),O.set(x,V))}function Ie(x,G){const V=l.get(G).get(x);a.get(G)!==V&&(i.uniformBlockBinding(G,V,x.__bindingPointIndex),a.set(G,V))}function ot(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},X=null,he={},u={},h=new WeakMap,d=[],p=null,g=!1,_=null,m=null,f=null,M=null,v=null,S=null,R=null,w=new Me(0,0,0),A=0,L=!1,T=null,y=null,I=null,z=null,F=null,ze.set(0,0,i.canvas.width,i.canvas.height),Xe.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:de,disable:ae,bindFramebuffer:Ne,drawBuffers:Re,useProgram:ke,setBlending:Be,setMaterial:Qe,setFlipSided:ye,setCullFace:Ve,setLineWidth:Oe,setPolygonOffset:Ce,setScissorTest:st,activeTexture:C,bindTexture:E,unbindTexture:H,compressedTexImage2D:$,compressedTexImage3D:Q,texImage2D:ge,texImage3D:Fe,updateUBOMapping:Le,uniformBlockBinding:Ie,texStorage2D:Pe,texStorage3D:ne,texSubImage2D:ee,texSubImage3D:ve,compressedTexSubImage2D:re,compressedTexSubImage3D:se,scissor:be,viewport:le,reset:ot}}function pg(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new J,u=new WeakMap;let h;const d=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,E){return p?new OffscreenCanvas(C,E):es("canvas")}function _(C,E,H){let $=1;const Q=st(C);if((Q.width>H||Q.height>H)&&($=H/Math.max(Q.width,Q.height)),$<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const ee=Math.floor($*Q.width),ve=Math.floor($*Q.height);h===void 0&&(h=g(ee,ve));const re=E?g(ee,ve):h;return re.width=ee,re.height=ve,re.getContext("2d").drawImage(C,0,0,ee,ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+ee+"x"+ve+")."),re}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),C;return C}function m(C){return C.generateMipmaps&&C.minFilter!==kt&&C.minFilter!==Xt}function f(C){i.generateMipmap(C)}function M(C,E,H,$,Q=!1){if(C!==null){if(i[C]!==void 0)return i[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ee=E;if(E===i.RED&&(H===i.FLOAT&&(ee=i.R32F),H===i.HALF_FLOAT&&(ee=i.R16F),H===i.UNSIGNED_BYTE&&(ee=i.R8)),E===i.RED_INTEGER&&(H===i.UNSIGNED_BYTE&&(ee=i.R8UI),H===i.UNSIGNED_SHORT&&(ee=i.R16UI),H===i.UNSIGNED_INT&&(ee=i.R32UI),H===i.BYTE&&(ee=i.R8I),H===i.SHORT&&(ee=i.R16I),H===i.INT&&(ee=i.R32I)),E===i.RG&&(H===i.FLOAT&&(ee=i.RG32F),H===i.HALF_FLOAT&&(ee=i.RG16F),H===i.UNSIGNED_BYTE&&(ee=i.RG8)),E===i.RG_INTEGER&&(H===i.UNSIGNED_BYTE&&(ee=i.RG8UI),H===i.UNSIGNED_SHORT&&(ee=i.RG16UI),H===i.UNSIGNED_INT&&(ee=i.RG32UI),H===i.BYTE&&(ee=i.RG8I),H===i.SHORT&&(ee=i.RG16I),H===i.INT&&(ee=i.RG32I)),E===i.RGB&&H===i.UNSIGNED_INT_5_9_9_9_REV&&(ee=i.RGB9_E5),E===i.RGBA){const ve=Q?Qs:je.getTransfer($);H===i.FLOAT&&(ee=i.RGBA32F),H===i.HALF_FLOAT&&(ee=i.RGBA16F),H===i.UNSIGNED_BYTE&&(ee=ve===et?i.SRGB8_ALPHA8:i.RGBA8),H===i.UNSIGNED_SHORT_4_4_4_4&&(ee=i.RGBA4),H===i.UNSIGNED_SHORT_5_5_5_1&&(ee=i.RGB5_A1)}return(ee===i.R16F||ee===i.R32F||ee===i.RG16F||ee===i.RG32F||ee===i.RGBA16F||ee===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ee}function v(C,E){let H;return C?E===null||E===Ri||E===Ci?H=i.DEPTH24_STENCIL8:E===bn?H=i.DEPTH32F_STENCIL8:E===Js&&(H=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ri||E===Ci?H=i.DEPTH_COMPONENT24:E===bn?H=i.DEPTH_COMPONENT32F:E===Js&&(H=i.DEPTH_COMPONENT16),H}function S(C,E){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==kt&&C.minFilter!==Xt?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function R(C){const E=C.target;E.removeEventListener("dispose",R),A(E),E.isVideoTexture&&u.delete(E)}function w(C){const E=C.target;E.removeEventListener("dispose",w),T(E)}function A(C){const E=n.get(C);if(E.__webglInit===void 0)return;const H=C.source,$=d.get(H);if($){const Q=$[E.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&L(C),Object.keys($).length===0&&d.delete(H)}n.remove(C)}function L(C){const E=n.get(C);i.deleteTexture(E.__webglTexture);const H=C.source,$=d.get(H);delete $[E.__cacheKey],o.memory.textures--}function T(C){const E=n.get(C);if(C.depthTexture&&C.depthTexture.dispose(),C.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(E.__webglFramebuffer[$]))for(let Q=0;Q<E.__webglFramebuffer[$].length;Q++)i.deleteFramebuffer(E.__webglFramebuffer[$][Q]);else i.deleteFramebuffer(E.__webglFramebuffer[$]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[$])}else{if(Array.isArray(E.__webglFramebuffer))for(let $=0;$<E.__webglFramebuffer.length;$++)i.deleteFramebuffer(E.__webglFramebuffer[$]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let $=0;$<E.__webglColorRenderbuffer.length;$++)E.__webglColorRenderbuffer[$]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[$]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const H=C.textures;for(let $=0,Q=H.length;$<Q;$++){const ee=n.get(H[$]);ee.__webglTexture&&(i.deleteTexture(ee.__webglTexture),o.memory.textures--),n.remove(H[$])}n.remove(C)}let y=0;function I(){y=0}function z(){const C=y;return C>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+s.maxTextures),y+=1,C}function F(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function Y(C,E){const H=n.get(C);if(C.isVideoTexture&&Oe(C),C.isRenderTargetTexture===!1&&C.version>0&&H.__version!==C.version){const $=C.image;if($===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Xe(H,C,E);return}}t.bindTexture(i.TEXTURE_2D,H.__webglTexture,i.TEXTURE0+E)}function q(C,E){const H=n.get(C);if(C.version>0&&H.__version!==C.version){Xe(H,C,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,H.__webglTexture,i.TEXTURE0+E)}function W(C,E){const H=n.get(C);if(C.version>0&&H.__version!==C.version){Xe(H,C,E);return}t.bindTexture(i.TEXTURE_3D,H.__webglTexture,i.TEXTURE0+E)}function K(C,E){const H=n.get(C);if(C.version>0&&H.__version!==C.version){Z(H,C,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,H.__webglTexture,i.TEXTURE0+E)}const X={[js]:i.REPEAT,[Vn]:i.CLAMP_TO_EDGE,[_o]:i.MIRRORED_REPEAT},he={[kt]:i.NEAREST,[Lh]:i.NEAREST_MIPMAP_NEAREST,[fs]:i.NEAREST_MIPMAP_LINEAR,[Xt]:i.LINEAR,[yr]:i.LINEAR_MIPMAP_NEAREST,[Wn]:i.LINEAR_MIPMAP_LINEAR},ue={[Zh]:i.NEVER,[Qh]:i.ALWAYS,[qh]:i.LESS,[tc]:i.LEQUAL,[Kh]:i.EQUAL,[Jh]:i.GEQUAL,[$h]:i.GREATER,[jh]:i.NOTEQUAL};function me(C,E){if(E.type===bn&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Xt||E.magFilter===yr||E.magFilter===fs||E.magFilter===Wn||E.minFilter===Xt||E.minFilter===yr||E.minFilter===fs||E.minFilter===Wn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(C,i.TEXTURE_WRAP_S,X[E.wrapS]),i.texParameteri(C,i.TEXTURE_WRAP_T,X[E.wrapT]),(C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY)&&i.texParameteri(C,i.TEXTURE_WRAP_R,X[E.wrapR]),i.texParameteri(C,i.TEXTURE_MAG_FILTER,he[E.magFilter]),i.texParameteri(C,i.TEXTURE_MIN_FILTER,he[E.minFilter]),E.compareFunction&&(i.texParameteri(C,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(C,i.TEXTURE_COMPARE_FUNC,ue[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===kt||E.minFilter!==fs&&E.minFilter!==Wn||E.type===bn&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");i.texParameterf(C,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function ze(C,E){let H=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",R));const $=E.source;let Q=d.get($);Q===void 0&&(Q={},d.set($,Q));const ee=F(E);if(ee!==C.__cacheKey){Q[ee]===void 0&&(Q[ee]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,H=!0),Q[ee].usedTimes++;const ve=Q[C.__cacheKey];ve!==void 0&&(Q[C.__cacheKey].usedTimes--,ve.usedTimes===0&&L(E)),C.__cacheKey=ee,C.__webglTexture=Q[ee].texture}return H}function Xe(C,E,H){let $=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&($=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&($=i.TEXTURE_3D);const Q=ze(C,E),ee=E.source;t.bindTexture($,C.__webglTexture,i.TEXTURE0+H);const ve=n.get(ee);if(ee.version!==ve.__version||Q===!0){t.activeTexture(i.TEXTURE0+H);const re=je.getPrimaries(je.workingColorSpace),se=E.colorSpace===En?null:je.getPrimaries(E.colorSpace),Pe=E.colorSpace===En||re===se?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Pe);let ne=_(E.image,!1,s.maxTextureSize);ne=Ce(E,ne);const ge=r.convert(E.format,E.colorSpace),Fe=r.convert(E.type);let be=M(E.internalFormat,ge,Fe,E.colorSpace,E.isVideoTexture);me($,E);let le;const Le=E.mipmaps,Ie=E.isVideoTexture!==!0,ot=ve.__version===void 0||Q===!0,x=ee.dataReady,G=S(E,ne);if(E.isDepthTexture)be=v(E.format===Pi,E.type),ot&&(Ie?t.texStorage2D(i.TEXTURE_2D,1,be,ne.width,ne.height):t.texImage2D(i.TEXTURE_2D,0,be,ne.width,ne.height,0,ge,Fe,null));else if(E.isDataTexture)if(Le.length>0){Ie&&ot&&t.texStorage2D(i.TEXTURE_2D,G,be,Le[0].width,Le[0].height);for(let O=0,V=Le.length;O<V;O++)le=Le[O],Ie?x&&t.texSubImage2D(i.TEXTURE_2D,O,0,0,le.width,le.height,ge,Fe,le.data):t.texImage2D(i.TEXTURE_2D,O,be,le.width,le.height,0,ge,Fe,le.data);E.generateMipmaps=!1}else Ie?(ot&&t.texStorage2D(i.TEXTURE_2D,G,be,ne.width,ne.height),x&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ne.width,ne.height,ge,Fe,ne.data)):t.texImage2D(i.TEXTURE_2D,0,be,ne.width,ne.height,0,ge,Fe,ne.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Ie&&ot&&t.texStorage3D(i.TEXTURE_2D_ARRAY,G,be,Le[0].width,Le[0].height,ne.depth);for(let O=0,V=Le.length;O<V;O++)if(le=Le[O],E.format!==$t)if(ge!==null)if(Ie){if(x)if(E.layerUpdates.size>0){for(const j of E.layerUpdates){const xe=le.width*le.height;t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,O,0,0,j,le.width,le.height,1,ge,le.data.slice(xe*j,xe*(j+1)),0,0)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,O,0,0,0,le.width,le.height,ne.depth,ge,le.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,O,be,le.width,le.height,ne.depth,0,le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ie?x&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,O,0,0,0,le.width,le.height,ne.depth,ge,Fe,le.data):t.texImage3D(i.TEXTURE_2D_ARRAY,O,be,le.width,le.height,ne.depth,0,ge,Fe,le.data)}else{Ie&&ot&&t.texStorage2D(i.TEXTURE_2D,G,be,Le[0].width,Le[0].height);for(let O=0,V=Le.length;O<V;O++)le=Le[O],E.format!==$t?ge!==null?Ie?x&&t.compressedTexSubImage2D(i.TEXTURE_2D,O,0,0,le.width,le.height,ge,le.data):t.compressedTexImage2D(i.TEXTURE_2D,O,be,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ie?x&&t.texSubImage2D(i.TEXTURE_2D,O,0,0,le.width,le.height,ge,Fe,le.data):t.texImage2D(i.TEXTURE_2D,O,be,le.width,le.height,0,ge,Fe,le.data)}else if(E.isDataArrayTexture)if(Ie){if(ot&&t.texStorage3D(i.TEXTURE_2D_ARRAY,G,be,ne.width,ne.height,ne.depth),x)if(E.layerUpdates.size>0){let O;switch(Fe){case i.UNSIGNED_BYTE:switch(ge){case i.ALPHA:O=1;break;case i.LUMINANCE:O=1;break;case i.LUMINANCE_ALPHA:O=2;break;case i.RGB:O=3;break;case i.RGBA:O=4;break;default:throw new Error(`Unknown texel size for format ${ge}.`)}break;case i.UNSIGNED_SHORT_4_4_4_4:case i.UNSIGNED_SHORT_5_5_5_1:case i.UNSIGNED_SHORT_5_6_5:O=1;break;default:throw new Error(`Unknown texel size for type ${Fe}.`)}const V=ne.width*ne.height*O;for(const j of E.layerUpdates)t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,j,ne.width,ne.height,1,ge,Fe,ne.data.slice(V*j,V*(j+1)));E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ne.width,ne.height,ne.depth,ge,Fe,ne.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,be,ne.width,ne.height,ne.depth,0,ge,Fe,ne.data);else if(E.isData3DTexture)Ie?(ot&&t.texStorage3D(i.TEXTURE_3D,G,be,ne.width,ne.height,ne.depth),x&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ne.width,ne.height,ne.depth,ge,Fe,ne.data)):t.texImage3D(i.TEXTURE_3D,0,be,ne.width,ne.height,ne.depth,0,ge,Fe,ne.data);else if(E.isFramebufferTexture){if(ot)if(Ie)t.texStorage2D(i.TEXTURE_2D,G,be,ne.width,ne.height);else{let O=ne.width,V=ne.height;for(let j=0;j<G;j++)t.texImage2D(i.TEXTURE_2D,j,be,O,V,0,ge,Fe,null),O>>=1,V>>=1}}else if(Le.length>0){if(Ie&&ot){const O=st(Le[0]);t.texStorage2D(i.TEXTURE_2D,G,be,O.width,O.height)}for(let O=0,V=Le.length;O<V;O++)le=Le[O],Ie?x&&t.texSubImage2D(i.TEXTURE_2D,O,0,0,ge,Fe,le):t.texImage2D(i.TEXTURE_2D,O,be,ge,Fe,le);E.generateMipmaps=!1}else if(Ie){if(ot){const O=st(ne);t.texStorage2D(i.TEXTURE_2D,G,be,O.width,O.height)}x&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge,Fe,ne)}else t.texImage2D(i.TEXTURE_2D,0,be,ge,Fe,ne);m(E)&&f($),ve.__version=ee.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function Z(C,E,H){if(E.image.length!==6)return;const $=ze(C,E),Q=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,C.__webglTexture,i.TEXTURE0+H);const ee=n.get(Q);if(Q.version!==ee.__version||$===!0){t.activeTexture(i.TEXTURE0+H);const ve=je.getPrimaries(je.workingColorSpace),re=E.colorSpace===En?null:je.getPrimaries(E.colorSpace),se=E.colorSpace===En||ve===re?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,se);const Pe=E.isCompressedTexture||E.image[0].isCompressedTexture,ne=E.image[0]&&E.image[0].isDataTexture,ge=[];for(let V=0;V<6;V++)!Pe&&!ne?ge[V]=_(E.image[V],!0,s.maxCubemapSize):ge[V]=ne?E.image[V].image:E.image[V],ge[V]=Ce(E,ge[V]);const Fe=ge[0],be=r.convert(E.format,E.colorSpace),le=r.convert(E.type),Le=M(E.internalFormat,be,le,E.colorSpace),Ie=E.isVideoTexture!==!0,ot=ee.__version===void 0||$===!0,x=Q.dataReady;let G=S(E,Fe);me(i.TEXTURE_CUBE_MAP,E);let O;if(Pe){Ie&&ot&&t.texStorage2D(i.TEXTURE_CUBE_MAP,G,Le,Fe.width,Fe.height);for(let V=0;V<6;V++){O=ge[V].mipmaps;for(let j=0;j<O.length;j++){const xe=O[j];E.format!==$t?be!==null?Ie?x&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,j,0,0,xe.width,xe.height,be,xe.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,j,Le,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ie?x&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,j,0,0,xe.width,xe.height,be,le,xe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,j,Le,xe.width,xe.height,0,be,le,xe.data)}}}else{if(O=E.mipmaps,Ie&&ot){O.length>0&&G++;const V=st(ge[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,G,Le,V.width,V.height)}for(let V=0;V<6;V++)if(ne){Ie?x&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,0,0,ge[V].width,ge[V].height,be,le,ge[V].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,Le,ge[V].width,ge[V].height,0,be,le,ge[V].data);for(let j=0;j<O.length;j++){const we=O[j].image[V].image;Ie?x&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,j+1,0,0,we.width,we.height,be,le,we.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,j+1,Le,we.width,we.height,0,be,le,we.data)}}else{Ie?x&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,0,0,be,le,ge[V]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,0,Le,be,le,ge[V]);for(let j=0;j<O.length;j++){const xe=O[j];Ie?x&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,j+1,0,0,be,le,xe.image[V]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+V,j+1,Le,be,le,xe.image[V])}}}m(E)&&f(i.TEXTURE_CUBE_MAP),ee.__version=Q.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function te(C,E,H,$,Q,ee){const ve=r.convert(H.format,H.colorSpace),re=r.convert(H.type),se=M(H.internalFormat,ve,re,H.colorSpace);if(!n.get(E).__hasExternalTextures){const ne=Math.max(1,E.width>>ee),ge=Math.max(1,E.height>>ee);Q===i.TEXTURE_3D||Q===i.TEXTURE_2D_ARRAY?t.texImage3D(Q,ee,se,ne,ge,E.depth,0,ve,re,null):t.texImage2D(Q,ee,se,ne,ge,0,ve,re,null)}t.bindFramebuffer(i.FRAMEBUFFER,C),Ve(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,$,Q,n.get(H).__webglTexture,0,ye(E)):(Q===i.TEXTURE_2D||Q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,$,Q,n.get(H).__webglTexture,ee),t.bindFramebuffer(i.FRAMEBUFFER,null)}function de(C,E,H){if(i.bindRenderbuffer(i.RENDERBUFFER,C),E.depthBuffer){const $=E.depthTexture,Q=$&&$.isDepthTexture?$.type:null,ee=v(E.stencilBuffer,Q),ve=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,re=ye(E);Ve(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,re,ee,E.width,E.height):H?i.renderbufferStorageMultisample(i.RENDERBUFFER,re,ee,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,ee,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ve,i.RENDERBUFFER,C)}else{const $=E.textures;for(let Q=0;Q<$.length;Q++){const ee=$[Q],ve=r.convert(ee.format,ee.colorSpace),re=r.convert(ee.type),se=M(ee.internalFormat,ve,re,ee.colorSpace),Pe=ye(E);H&&Ve(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Pe,se,E.width,E.height):Ve(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Pe,se,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,se,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ae(C,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),Y(E.depthTexture,0);const $=n.get(E.depthTexture).__webglTexture,Q=ye(E);if(E.depthTexture.format===Ei)Ve(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,$,0);else if(E.depthTexture.format===Pi)Ve(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0,Q):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function Ne(C){const E=n.get(C),H=C.isWebGLCubeRenderTarget===!0;if(C.depthTexture&&!E.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");ae(E.__webglFramebuffer,C)}else if(H){E.__webglDepthbuffer=[];for(let $=0;$<6;$++)t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[$]),E.__webglDepthbuffer[$]=i.createRenderbuffer(),de(E.__webglDepthbuffer[$],C,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=i.createRenderbuffer(),de(E.__webglDepthbuffer,C,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Re(C,E,H){const $=n.get(C);E!==void 0&&te($.__webglFramebuffer,C,C.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),H!==void 0&&Ne(C)}function ke(C){const E=C.texture,H=n.get(C),$=n.get(E);C.addEventListener("dispose",w);const Q=C.textures,ee=C.isWebGLCubeRenderTarget===!0,ve=Q.length>1;if(ve||($.__webglTexture===void 0&&($.__webglTexture=i.createTexture()),$.__version=E.version,o.memory.textures++),ee){H.__webglFramebuffer=[];for(let re=0;re<6;re++)if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer[re]=[];for(let se=0;se<E.mipmaps.length;se++)H.__webglFramebuffer[re][se]=i.createFramebuffer()}else H.__webglFramebuffer[re]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){H.__webglFramebuffer=[];for(let re=0;re<E.mipmaps.length;re++)H.__webglFramebuffer[re]=i.createFramebuffer()}else H.__webglFramebuffer=i.createFramebuffer();if(ve)for(let re=0,se=Q.length;re<se;re++){const Pe=n.get(Q[re]);Pe.__webglTexture===void 0&&(Pe.__webglTexture=i.createTexture(),o.memory.textures++)}if(C.samples>0&&Ve(C)===!1){H.__webglMultisampledFramebuffer=i.createFramebuffer(),H.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let re=0;re<Q.length;re++){const se=Q[re];H.__webglColorRenderbuffer[re]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,H.__webglColorRenderbuffer[re]);const Pe=r.convert(se.format,se.colorSpace),ne=r.convert(se.type),ge=M(se.internalFormat,Pe,ne,se.colorSpace,C.isXRRenderTarget===!0),Fe=ye(C);i.renderbufferStorageMultisample(i.RENDERBUFFER,Fe,ge,C.width,C.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+re,i.RENDERBUFFER,H.__webglColorRenderbuffer[re])}i.bindRenderbuffer(i.RENDERBUFFER,null),C.depthBuffer&&(H.__webglDepthRenderbuffer=i.createRenderbuffer(),de(H.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ee){t.bindTexture(i.TEXTURE_CUBE_MAP,$.__webglTexture),me(i.TEXTURE_CUBE_MAP,E);for(let re=0;re<6;re++)if(E.mipmaps&&E.mipmaps.length>0)for(let se=0;se<E.mipmaps.length;se++)te(H.__webglFramebuffer[re][se],C,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,se);else te(H.__webglFramebuffer[re],C,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+re,0);m(E)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let re=0,se=Q.length;re<se;re++){const Pe=Q[re],ne=n.get(Pe);t.bindTexture(i.TEXTURE_2D,ne.__webglTexture),me(i.TEXTURE_2D,Pe),te(H.__webglFramebuffer,C,Pe,i.COLOR_ATTACHMENT0+re,i.TEXTURE_2D,0),m(Pe)&&f(i.TEXTURE_2D)}t.unbindTexture()}else{let re=i.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(re=C.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(re,$.__webglTexture),me(re,E),E.mipmaps&&E.mipmaps.length>0)for(let se=0;se<E.mipmaps.length;se++)te(H.__webglFramebuffer[se],C,E,i.COLOR_ATTACHMENT0,re,se);else te(H.__webglFramebuffer,C,E,i.COLOR_ATTACHMENT0,re,0);m(E)&&f(re),t.unbindTexture()}C.depthBuffer&&Ne(C)}function D(C){const E=C.textures;for(let H=0,$=E.length;H<$;H++){const Q=E[H];if(m(Q)){const ee=C.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ve=n.get(Q).__webglTexture;t.bindTexture(ee,ve),f(ee),t.unbindTexture()}}}const He=[],Be=[];function Qe(C){if(C.samples>0){if(Ve(C)===!1){const E=C.textures,H=C.width,$=C.height;let Q=i.COLOR_BUFFER_BIT;const ee=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ve=n.get(C),re=E.length>1;if(re)for(let se=0;se<E.length;se++)t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let se=0;se<E.length;se++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(Q|=i.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(Q|=i.STENCIL_BUFFER_BIT)),re){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ve.__webglColorRenderbuffer[se]);const Pe=n.get(E[se]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Pe,0)}i.blitFramebuffer(0,0,H,$,0,0,H,$,Q,i.NEAREST),l===!0&&(He.length=0,Be.length=0,He.push(i.COLOR_ATTACHMENT0+se),C.depthBuffer&&C.resolveDepthBuffer===!1&&(He.push(ee),Be.push(ee),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Be)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,He))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),re)for(let se=0;se<E.length;se++){t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,ve.__webglColorRenderbuffer[se]);const Pe=n.get(E[se]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.TEXTURE_2D,Pe,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const E=C.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function ye(C){return Math.min(s.maxSamples,C.samples)}function Ve(C){const E=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Oe(C){const E=o.render.frame;u.get(C)!==E&&(u.set(C,E),C.update())}function Ce(C,E){const H=C.colorSpace,$=C.format,Q=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||H!==Pn&&H!==En&&(je.getTransfer(H)===et?($!==$t||Q!==Rn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),E}function st(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=I,this.setTexture2D=Y,this.setTexture2DArray=q,this.setTexture3D=W,this.setTextureCube=K,this.rebindTextures=Re,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=Qe,this.setupDepthRenderbuffer=Ne,this.setupFrameBufferTexture=te,this.useMultisampledRTT=Ve}function mg(i,e){function t(n,s=En){let r;const o=je.getTransfer(s);if(n===Rn)return i.UNSIGNED_BYTE;if(n===Kl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===$l)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Uh)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Ih)return i.BYTE;if(n===Dh)return i.SHORT;if(n===Js)return i.UNSIGNED_SHORT;if(n===ql)return i.INT;if(n===Ri)return i.UNSIGNED_INT;if(n===bn)return i.FLOAT;if(n===ur)return i.HALF_FLOAT;if(n===Nh)return i.ALPHA;if(n===Oh)return i.RGB;if(n===$t)return i.RGBA;if(n===Fh)return i.LUMINANCE;if(n===Bh)return i.LUMINANCE_ALPHA;if(n===Ei)return i.DEPTH_COMPONENT;if(n===Pi)return i.DEPTH_STENCIL;if(n===zh)return i.RED;if(n===jl)return i.RED_INTEGER;if(n===kh)return i.RG;if(n===Jl)return i.RG_INTEGER;if(n===Ql)return i.RGBA_INTEGER;if(n===Er||n===br||n===Tr||n===Ar)if(o===et)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Er)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===br)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ar)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Er)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===br)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Tr)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ar)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Jo||n===Qo||n===ea||n===ta)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Jo)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Qo)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===ea)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===ta)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===na||n===ia||n===sa)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===na||n===ia)return o===et?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===sa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===ra||n===oa||n===aa||n===la||n===ca||n===ha||n===ua||n===da||n===fa||n===pa||n===ma||n===ga||n===_a||n===va)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===ra)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===oa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===aa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===la)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===ca)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ha)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ua)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===da)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===fa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===pa)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ma)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===ga)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===_a)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===va)return o===et?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===wr||n===xa||n===Ma)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===wr)return o===et?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===xa)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Ma)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Hh||n===Sa||n===ya||n===Ea)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===wr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Sa)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===ya)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ea)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ci?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class gg extends Ot{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Zi extends St{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _g={type:"move"};class Jr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Zi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Zi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new P,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new P),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Zi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new P,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new P),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const u=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],d=u.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&d>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(_g)))}return a!==null&&(a.visible=s!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Zi;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const vg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,xg=`
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

}`;class Mg{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new yt,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new dn({vertexShader:vg,fragmentShader:xg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new ht(new mr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class Sg extends Kn{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",l=1,c=null,u=null,h=null,d=null,p=null,g=null;const _=new Mg,m=t.getContextAttributes();let f=null,M=null;const v=[],S=[],R=new J;let w=null;const A=new Ot;A.layers.enable(1),A.viewport=new nt;const L=new Ot;L.layers.enable(2),L.viewport=new nt;const T=[A,L],y=new gg;y.layers.enable(1),y.layers.enable(2);let I=null,z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Z){let te=v[Z];return te===void 0&&(te=new Jr,v[Z]=te),te.getTargetRaySpace()},this.getControllerGrip=function(Z){let te=v[Z];return te===void 0&&(te=new Jr,v[Z]=te),te.getGripSpace()},this.getHand=function(Z){let te=v[Z];return te===void 0&&(te=new Jr,v[Z]=te),te.getHandSpace()};function F(Z){const te=S.indexOf(Z.inputSource);if(te===-1)return;const de=v[te];de!==void 0&&(de.update(Z.inputSource,Z.frame,c||o),de.dispatchEvent({type:Z.type,data:Z.inputSource}))}function Y(){s.removeEventListener("select",F),s.removeEventListener("selectstart",F),s.removeEventListener("selectend",F),s.removeEventListener("squeeze",F),s.removeEventListener("squeezestart",F),s.removeEventListener("squeezeend",F),s.removeEventListener("end",Y),s.removeEventListener("inputsourceschange",q);for(let Z=0;Z<v.length;Z++){const te=S[Z];te!==null&&(S[Z]=null,v[Z].disconnect(te))}I=null,z=null,_.reset(),e.setRenderTarget(f),p=null,d=null,h=null,s=null,M=null,Xe.stop(),n.isPresenting=!1,e.setPixelRatio(w),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Z){r=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Z){a=Z,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Z){c=Z},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return h},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function(Z){if(s=Z,s!==null){if(f=e.getRenderTarget(),s.addEventListener("select",F),s.addEventListener("selectstart",F),s.addEventListener("selectend",F),s.addEventListener("squeeze",F),s.addEventListener("squeezestart",F),s.addEventListener("squeezeend",F),s.addEventListener("end",Y),s.addEventListener("inputsourceschange",q),m.xrCompatible!==!0&&await t.makeXRCompatible(),w=e.getPixelRatio(),e.getSize(R),s.renderState.layers===void 0){const te={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(s,t,te),s.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new Xn(p.framebufferWidth,p.framebufferHeight,{format:$t,type:Rn,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let te=null,de=null,ae=null;m.depth&&(ae=m.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,te=m.stencil?Pi:Ei,de=m.stencil?Ci:Ri);const Ne={colorFormat:t.RGBA8,depthFormat:ae,scaleFactor:r};h=new XRWebGLBinding(s,t),d=h.createProjectionLayer(Ne),s.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new Xn(d.textureWidth,d.textureHeight,{format:$t,type:Rn,depthTexture:new pc(d.textureWidth,d.textureHeight,de,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await s.requestReferenceSpace(a),Xe.setContext(s),Xe.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function q(Z){for(let te=0;te<Z.removed.length;te++){const de=Z.removed[te],ae=S.indexOf(de);ae>=0&&(S[ae]=null,v[ae].disconnect(de))}for(let te=0;te<Z.added.length;te++){const de=Z.added[te];let ae=S.indexOf(de);if(ae===-1){for(let Re=0;Re<v.length;Re++)if(Re>=S.length){S.push(de),ae=Re;break}else if(S[Re]===null){S[Re]=de,ae=Re;break}if(ae===-1)break}const Ne=v[ae];Ne&&Ne.connect(de)}}const W=new P,K=new P;function X(Z,te,de){W.setFromMatrixPosition(te.matrixWorld),K.setFromMatrixPosition(de.matrixWorld);const ae=W.distanceTo(K),Ne=te.projectionMatrix.elements,Re=de.projectionMatrix.elements,ke=Ne[14]/(Ne[10]-1),D=Ne[14]/(Ne[10]+1),He=(Ne[9]+1)/Ne[5],Be=(Ne[9]-1)/Ne[5],Qe=(Ne[8]-1)/Ne[0],ye=(Re[8]+1)/Re[0],Ve=ke*Qe,Oe=ke*ye,Ce=ae/(-Qe+ye),st=Ce*-Qe;te.matrixWorld.decompose(Z.position,Z.quaternion,Z.scale),Z.translateX(st),Z.translateZ(Ce),Z.matrixWorld.compose(Z.position,Z.quaternion,Z.scale),Z.matrixWorldInverse.copy(Z.matrixWorld).invert();const C=ke+Ce,E=D+Ce,H=Ve-st,$=Oe+(ae-st),Q=He*D/E*C,ee=Be*D/E*C;Z.projectionMatrix.makePerspective(H,$,Q,ee,C,E),Z.projectionMatrixInverse.copy(Z.projectionMatrix).invert()}function he(Z,te){te===null?Z.matrixWorld.copy(Z.matrix):Z.matrixWorld.multiplyMatrices(te.matrixWorld,Z.matrix),Z.matrixWorldInverse.copy(Z.matrixWorld).invert()}this.updateCamera=function(Z){if(s===null)return;_.texture!==null&&(Z.near=_.depthNear,Z.far=_.depthFar),y.near=L.near=A.near=Z.near,y.far=L.far=A.far=Z.far,(I!==y.near||z!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),I=y.near,z=y.far,A.near=I,A.far=z,L.near=I,L.far=z,A.updateProjectionMatrix(),L.updateProjectionMatrix(),Z.updateProjectionMatrix());const te=Z.parent,de=y.cameras;he(y,te);for(let ae=0;ae<de.length;ae++)he(de[ae],te);de.length===2?X(y,A,L):y.projectionMatrix.copy(A.projectionMatrix),ue(Z,y,te)};function ue(Z,te,de){de===null?Z.matrix.copy(te.matrixWorld):(Z.matrix.copy(de.matrixWorld),Z.matrix.invert(),Z.matrix.multiply(te.matrixWorld)),Z.matrix.decompose(Z.position,Z.quaternion,Z.scale),Z.updateMatrixWorld(!0),Z.projectionMatrix.copy(te.projectionMatrix),Z.projectionMatrixInverse.copy(te.projectionMatrixInverse),Z.isPerspectiveCamera&&(Z.fov=Qi*2*Math.atan(1/Z.projectionMatrix.elements[5]),Z.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Z){l=Z,d!==null&&(d.fixedFoveation=Z),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Z)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let me=null;function ze(Z,te){if(u=te.getViewerPose(c||o),g=te,u!==null){const de=u.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let ae=!1;de.length!==y.cameras.length&&(y.cameras.length=0,ae=!0);for(let Re=0;Re<de.length;Re++){const ke=de[Re];let D=null;if(p!==null)D=p.getViewport(ke);else{const Be=h.getViewSubImage(d,ke);D=Be.viewport,Re===0&&(e.setRenderTargetTextures(M,Be.colorTexture,d.ignoreDepthValues?void 0:Be.depthStencilTexture),e.setRenderTarget(M))}let He=T[Re];He===void 0&&(He=new Ot,He.layers.enable(Re),He.viewport=new nt,T[Re]=He),He.matrix.fromArray(ke.transform.matrix),He.matrix.decompose(He.position,He.quaternion,He.scale),He.projectionMatrix.fromArray(ke.projectionMatrix),He.projectionMatrixInverse.copy(He.projectionMatrix).invert(),He.viewport.set(D.x,D.y,D.width,D.height),Re===0&&(y.matrix.copy(He.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),ae===!0&&y.cameras.push(He)}const Ne=s.enabledFeatures;if(Ne&&Ne.includes("depth-sensing")){const Re=h.getDepthInformation(de[0]);Re&&Re.isValid&&Re.texture&&_.init(e,Re,s.renderState)}}for(let de=0;de<v.length;de++){const ae=S[de],Ne=v[de];ae!==null&&Ne!==void 0&&Ne.update(ae,te,c||o)}me&&me(Z,te),te.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:te}),g=null}const Xe=new dc;Xe.setAnimationLoop(ze),this.setAnimationLoop=function(Z){me=Z},this.dispose=function(){}}}const zn=new Qt,yg=new tt;function Eg(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,cc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function s(m,f,M,v,S){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),h(m,f)):f.isMeshPhongMaterial?(r(m,f),u(m,f)):f.isMeshStandardMaterial?(r(m,f),d(m,f),f.isMeshPhysicalMaterial&&p(m,f,S)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(o(m,f),f.isLineDashedMaterial&&a(m,f)):f.isPointsMaterial?l(m,f,M,v):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Pt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Pt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const M=e.get(f),v=M.envMap,S=M.envMapRotation;v&&(m.envMap.value=v,zn.copy(S),zn.x*=-1,zn.y*=-1,zn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(zn.y*=-1,zn.z*=-1),m.envMapRotation.value.setFromMatrix4(yg.makeRotationFromEuler(zn)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function o(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function a(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,M,v){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*M,m.scale.value=v*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function u(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function d(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,M){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Pt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=M.texture,m.transmissionSamplerSize.value.set(M.width,M.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const M=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),m.nearDistance.value=M.shadow.camera.near,m.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function bg(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(M,v){const S=v.program;n.uniformBlockBinding(M,S)}function c(M,v){let S=s[M.id];S===void 0&&(g(M),S=u(M),s[M.id]=S,M.addEventListener("dispose",m));const R=v.program;n.updateUBOMapping(M,R);const w=e.render.frame;r[M.id]!==w&&(d(M),r[M.id]=w)}function u(M){const v=h();M.__bindingPointIndex=v;const S=i.createBuffer(),R=M.__size,w=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,R,w),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,S),S}function h(){for(let M=0;M<a;M++)if(o.indexOf(M)===-1)return o.push(M),M;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(M){const v=s[M.id],S=M.uniforms,R=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let w=0,A=S.length;w<A;w++){const L=Array.isArray(S[w])?S[w]:[S[w]];for(let T=0,y=L.length;T<y;T++){const I=L[T];if(p(I,w,T,R)===!0){const z=I.__offset,F=Array.isArray(I.value)?I.value:[I.value];let Y=0;for(let q=0;q<F.length;q++){const W=F[q],K=_(W);typeof W=="number"||typeof W=="boolean"?(I.__data[0]=W,i.bufferSubData(i.UNIFORM_BUFFER,z+Y,I.__data)):W.isMatrix3?(I.__data[0]=W.elements[0],I.__data[1]=W.elements[1],I.__data[2]=W.elements[2],I.__data[3]=0,I.__data[4]=W.elements[3],I.__data[5]=W.elements[4],I.__data[6]=W.elements[5],I.__data[7]=0,I.__data[8]=W.elements[6],I.__data[9]=W.elements[7],I.__data[10]=W.elements[8],I.__data[11]=0):(W.toArray(I.__data,Y),Y+=K.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,z,I.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(M,v,S,R){const w=M.value,A=v+"_"+S;if(R[A]===void 0)return typeof w=="number"||typeof w=="boolean"?R[A]=w:R[A]=w.clone(),!0;{const L=R[A];if(typeof w=="number"||typeof w=="boolean"){if(L!==w)return R[A]=w,!0}else if(L.equals(w)===!1)return L.copy(w),!0}return!1}function g(M){const v=M.uniforms;let S=0;const R=16;for(let A=0,L=v.length;A<L;A++){const T=Array.isArray(v[A])?v[A]:[v[A]];for(let y=0,I=T.length;y<I;y++){const z=T[y],F=Array.isArray(z.value)?z.value:[z.value];for(let Y=0,q=F.length;Y<q;Y++){const W=F[Y],K=_(W),X=S%R;X!==0&&R-X<K.boundary&&(S+=R-X),z.__data=new Float32Array(K.storage/Float32Array.BYTES_PER_ELEMENT),z.__offset=S,S+=K.storage}}}const w=S%R;return w>0&&(S+=R-w),M.__size=S,M.__cache={},this}function _(M){const v={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(v.boundary=4,v.storage=4):M.isVector2?(v.boundary=8,v.storage=8):M.isVector3||M.isColor?(v.boundary=16,v.storage=12):M.isVector4?(v.boundary=16,v.storage=16):M.isMatrix3?(v.boundary=48,v.storage=48):M.isMatrix4?(v.boundary=64,v.storage=64):M.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",M),v}function m(M){const v=M.target;v.removeEventListener("dispose",m);const S=o.indexOf(v.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function f(){for(const M in s)i.deleteBuffer(s[M]);o=[],s={},r={}}return{bind:l,update:c,dispose:f}}class Tg{constructor(e={}){const{canvas:t=gu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:h=!1}=e;this.isWebGLRenderer=!0;let d;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");d=n.getContextAttributes().alpha}else d=o;const p=new Uint32Array(4),g=new Int32Array(4);let _=null,m=null;const f=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=qt,this.toneMapping=wn,this.toneMappingExposure=1;const v=this;let S=!1,R=0,w=0,A=null,L=-1,T=null;const y=new nt,I=new nt;let z=null;const F=new Me(0);let Y=0,q=t.width,W=t.height,K=1,X=null,he=null;const ue=new nt(0,0,q,W),me=new nt(0,0,q,W);let ze=!1;const Xe=new Lo;let Z=!1,te=!1;const de=new tt,ae=new P,Ne={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Re=!1;function ke(){return A===null?K:1}let D=n;function He(b,U){return t.getContext(b,U)}try{const b={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ao}`),t.addEventListener("webglcontextlost",G,!1),t.addEventListener("webglcontextrestored",O,!1),t.addEventListener("webglcontextcreationerror",V,!1),D===null){const U="webgl2";if(D=He(U,b),D===null)throw He(U)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw console.error("THREE.WebGLRenderer: "+b.message),b}let Be,Qe,ye,Ve,Oe,Ce,st,C,E,H,$,Q,ee,ve,re,se,Pe,ne,ge,Fe,be,le,Le,Ie;function ot(){Be=new Dp(D),Be.init(),le=new mg(D,Be),Qe=new wp(D,Be,e,le),ye=new fg(D),Ve=new Op(D),Oe=new Qm,Ce=new pg(D,Be,ye,Oe,Qe,le,Ve),st=new Cp(v),C=new Ip(v),E=new Gu(D),Le=new Tp(D,E),H=new Up(D,E,Ve,Le),$=new Bp(D,H,E,Ve),ge=new Fp(D,Qe,Ce),se=new Rp(Oe),Q=new Jm(v,st,C,Be,Qe,Le,se),ee=new Eg(v,Oe),ve=new tg,re=new ag(Be),ne=new bp(v,st,C,ye,$,d,l),Pe=new dg(v,$,Qe),Ie=new bg(D,Ve,Qe,ye),Fe=new Ap(D,Be,Ve),be=new Np(D,Be,Ve),Ve.programs=Q.programs,v.capabilities=Qe,v.extensions=Be,v.properties=Oe,v.renderLists=ve,v.shadowMap=Pe,v.state=ye,v.info=Ve}ot();const x=new Sg(v,D);this.xr=x,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const b=Be.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Be.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return K},this.setPixelRatio=function(b){b!==void 0&&(K=b,this.setSize(q,W,!1))},this.getSize=function(b){return b.set(q,W)},this.setSize=function(b,U,B=!0){if(x.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}q=b,W=U,t.width=Math.floor(b*K),t.height=Math.floor(U*K),B===!0&&(t.style.width=b+"px",t.style.height=U+"px"),this.setViewport(0,0,b,U)},this.getDrawingBufferSize=function(b){return b.set(q*K,W*K).floor()},this.setDrawingBufferSize=function(b,U,B){q=b,W=U,K=B,t.width=Math.floor(b*B),t.height=Math.floor(U*B),this.setViewport(0,0,b,U)},this.getCurrentViewport=function(b){return b.copy(y)},this.getViewport=function(b){return b.copy(ue)},this.setViewport=function(b,U,B,k){b.isVector4?ue.set(b.x,b.y,b.z,b.w):ue.set(b,U,B,k),ye.viewport(y.copy(ue).multiplyScalar(K).round())},this.getScissor=function(b){return b.copy(me)},this.setScissor=function(b,U,B,k){b.isVector4?me.set(b.x,b.y,b.z,b.w):me.set(b,U,B,k),ye.scissor(I.copy(me).multiplyScalar(K).round())},this.getScissorTest=function(){return ze},this.setScissorTest=function(b){ye.setScissorTest(ze=b)},this.setOpaqueSort=function(b){X=b},this.setTransparentSort=function(b){he=b},this.getClearColor=function(b){return b.copy(ne.getClearColor())},this.setClearColor=function(){ne.setClearColor.apply(ne,arguments)},this.getClearAlpha=function(){return ne.getClearAlpha()},this.setClearAlpha=function(){ne.setClearAlpha.apply(ne,arguments)},this.clear=function(b=!0,U=!0,B=!0){let k=0;if(b){let N=!1;if(A!==null){const ie=A.texture.format;N=ie===Ql||ie===Jl||ie===jl}if(N){const ie=A.texture.type,ce=ie===Rn||ie===Ri||ie===Js||ie===Ci||ie===Kl||ie===$l,fe=ne.getClearColor(),_e=ne.getClearAlpha(),Te=fe.r,Ae=fe.g,Ee=fe.b;ce?(p[0]=Te,p[1]=Ae,p[2]=Ee,p[3]=_e,D.clearBufferuiv(D.COLOR,0,p)):(g[0]=Te,g[1]=Ae,g[2]=Ee,g[3]=_e,D.clearBufferiv(D.COLOR,0,g))}else k|=D.COLOR_BUFFER_BIT}U&&(k|=D.DEPTH_BUFFER_BIT),B&&(k|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(k)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",G,!1),t.removeEventListener("webglcontextrestored",O,!1),t.removeEventListener("webglcontextcreationerror",V,!1),ve.dispose(),re.dispose(),Oe.dispose(),st.dispose(),C.dispose(),$.dispose(),Le.dispose(),Ie.dispose(),Q.dispose(),x.dispose(),x.removeEventListener("sessionstart",dt),x.removeEventListener("sessionend",ft),Lt.stop()};function G(b){b.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function O(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const b=Ve.autoReset,U=Pe.enabled,B=Pe.autoUpdate,k=Pe.needsUpdate,N=Pe.type;ot(),Ve.autoReset=b,Pe.enabled=U,Pe.autoUpdate=B,Pe.needsUpdate=k,Pe.type=N}function V(b){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function j(b){const U=b.target;U.removeEventListener("dispose",j),xe(U)}function xe(b){we(b),Oe.remove(b)}function we(b){const U=Oe.get(b).programs;U!==void 0&&(U.forEach(function(B){Q.releaseProgram(B)}),b.isShaderMaterial&&Q.releaseShaderCache(b))}this.renderBufferDirect=function(b,U,B,k,N,ie){U===null&&(U=Ne);const ce=N.isMesh&&N.matrixWorld.determinant()<0,fe=Hc(b,U,B,k,N);ye.setMaterial(k,ce);let _e=B.index,Te=1;if(k.wireframe===!0){if(_e=H.getWireframeAttribute(B),_e===void 0)return;Te=2}const Ae=B.drawRange,Ee=B.attributes.position;let Ze=Ae.start*Te,lt=(Ae.start+Ae.count)*Te;ie!==null&&(Ze=Math.max(Ze,ie.start*Te),lt=Math.min(lt,(ie.start+ie.count)*Te)),_e!==null?(Ze=Math.max(Ze,0),lt=Math.min(lt,_e.count)):Ee!=null&&(Ze=Math.max(Ze,0),lt=Math.min(lt,Ee.count));const ct=lt-Ze;if(ct<0||ct===1/0)return;Le.setup(N,k,fe,B,_e);let Dt,qe=Fe;if(_e!==null&&(Dt=E.get(_e),qe=be,qe.setIndex(Dt)),N.isMesh)k.wireframe===!0?(ye.setLineWidth(k.wireframeLinewidth*ke()),qe.setMode(D.LINES)):qe.setMode(D.TRIANGLES);else if(N.isLine){let Se=k.linewidth;Se===void 0&&(Se=1),ye.setLineWidth(Se*ke()),N.isLineSegments?qe.setMode(D.LINES):N.isLineLoop?qe.setMode(D.LINE_LOOP):qe.setMode(D.LINE_STRIP)}else N.isPoints?qe.setMode(D.POINTS):N.isSprite&&qe.setMode(D.TRIANGLES);if(N.isBatchedMesh)N._multiDrawInstances!==null?qe.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances):qe.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else if(N.isInstancedMesh)qe.renderInstances(Ze,ct,N.count);else if(B.isInstancedBufferGeometry){const Se=B._maxInstanceCount!==void 0?B._maxInstanceCount:1/0,Tt=Math.min(B.instanceCount,Se);qe.renderInstances(Ze,ct,Tt)}else qe.render(Ze,ct)};function at(b,U,B){b.transparent===!0&&b.side===Ct&&b.forceSinglePass===!1?(b.side=Pt,b.needsUpdate=!0,us(b,U,B),b.side=Jt,b.needsUpdate=!0,us(b,U,B),b.side=Ct):us(b,U,B)}this.compile=function(b,U,B=null){B===null&&(B=b),m=re.get(B),m.init(U),M.push(m),B.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(m.pushLight(N),N.castShadow&&m.pushShadow(N))}),b!==B&&b.traverseVisible(function(N){N.isLight&&N.layers.test(U.layers)&&(m.pushLight(N),N.castShadow&&m.pushShadow(N))}),m.setupLights();const k=new Set;return b.traverse(function(N){const ie=N.material;if(ie)if(Array.isArray(ie))for(let ce=0;ce<ie.length;ce++){const fe=ie[ce];at(fe,B,N),k.add(fe)}else at(ie,B,N),k.add(ie)}),M.pop(),m=null,k},this.compileAsync=function(b,U,B=null){const k=this.compile(b,U,B);return new Promise(N=>{function ie(){if(k.forEach(function(ce){Oe.get(ce).currentProgram.isReady()&&k.delete(ce)}),k.size===0){N(b);return}setTimeout(ie,10)}Be.get("KHR_parallel_shader_compile")!==null?ie():setTimeout(ie,10)})};let ut=null;function Ye(b){ut&&ut(b)}function dt(){Lt.stop()}function ft(){Lt.start()}const Lt=new dc;Lt.setAnimationLoop(Ye),typeof self<"u"&&Lt.setContext(self),this.setAnimationLoop=function(b){ut=b,x.setAnimationLoop(b),b===null?Lt.stop():Lt.start()},x.addEventListener("sessionstart",dt),x.addEventListener("sessionend",ft),this.render=function(b,U){if(U!==void 0&&U.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),U.parent===null&&U.matrixWorldAutoUpdate===!0&&U.updateMatrixWorld(),x.enabled===!0&&x.isPresenting===!0&&(x.cameraAutoUpdate===!0&&x.updateCamera(U),U=x.getCamera()),b.isScene===!0&&b.onBeforeRender(v,b,U,A),m=re.get(b,M.length),m.init(U),M.push(m),de.multiplyMatrices(U.projectionMatrix,U.matrixWorldInverse),Xe.setFromProjectionMatrix(de),te=this.localClippingEnabled,Z=se.init(this.clippingPlanes,te),_=ve.get(b,f.length),_.init(),f.push(_),x.enabled===!0&&x.isPresenting===!0){const ie=v.xr.getDepthSensingMesh();ie!==null&&It(ie,U,-1/0,v.sortObjects)}It(b,U,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(X,he),Re=x.enabled===!1||x.isPresenting===!1||x.hasDepthSensing()===!1,Re&&ne.addToRenderList(_,b),this.info.render.frame++,Z===!0&&se.beginShadows();const B=m.state.shadowsArray;Pe.render(B,b,U),Z===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();const k=_.opaque,N=_.transmissive;if(m.setupLights(),U.isArrayCamera){const ie=U.cameras;if(N.length>0)for(let ce=0,fe=ie.length;ce<fe;ce++){const _e=ie[ce];Ln(k,N,b,_e)}Re&&ne.render(b);for(let ce=0,fe=ie.length;ce<fe;ce++){const _e=ie[ce];fn(_,b,_e,_e.viewport)}}else N.length>0&&Ln(k,N,b,U),Re&&ne.render(b),fn(_,b,U);A!==null&&(Ce.updateMultisampleRenderTarget(A),Ce.updateRenderTargetMipmap(A)),b.isScene===!0&&b.onAfterRender(v,b,U),Le.resetDefaultState(),L=-1,T=null,M.pop(),M.length>0?(m=M[M.length-1],Z===!0&&se.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,f.pop(),f.length>0?_=f[f.length-1]:_=null};function It(b,U,B,k){if(b.visible===!1)return;if(b.layers.test(U.layers)){if(b.isGroup)B=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(U);else if(b.isLight)m.pushLight(b),b.castShadow&&m.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Xe.intersectsSprite(b)){k&&ae.setFromMatrixPosition(b.matrixWorld).applyMatrix4(de);const ce=$.update(b),fe=b.material;fe.visible&&_.push(b,ce,fe,B,ae.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Xe.intersectsObject(b))){const ce=$.update(b),fe=b.material;if(k&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),ae.copy(b.boundingSphere.center)):(ce.boundingSphere===null&&ce.computeBoundingSphere(),ae.copy(ce.boundingSphere.center)),ae.applyMatrix4(b.matrixWorld).applyMatrix4(de)),Array.isArray(fe)){const _e=ce.groups;for(let Te=0,Ae=_e.length;Te<Ae;Te++){const Ee=_e[Te],Ze=fe[Ee.materialIndex];Ze&&Ze.visible&&_.push(b,ce,Ze,B,ae.z,Ee)}}else fe.visible&&_.push(b,ce,fe,B,ae.z,null)}}const ie=b.children;for(let ce=0,fe=ie.length;ce<fe;ce++)It(ie[ce],U,B,k)}function fn(b,U,B,k){const N=b.opaque,ie=b.transmissive,ce=b.transparent;m.setupLightsView(B),Z===!0&&se.setGlobalState(v.clippingPlanes,B),k&&ye.viewport(y.copy(k)),N.length>0&&In(N,U,B),ie.length>0&&In(ie,U,B),ce.length>0&&In(ce,U,B),ye.buffers.depth.setTest(!0),ye.buffers.depth.setMask(!0),ye.buffers.color.setMask(!0),ye.setPolygonOffset(!1)}function Ln(b,U,B,k){if((B.isScene===!0?B.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[k.id]===void 0&&(m.state.transmissionRenderTarget[k.id]=new Xn(1,1,{generateMipmaps:!0,type:Be.has("EXT_color_buffer_half_float")||Be.has("EXT_color_buffer_float")?ur:Rn,minFilter:Wn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace}));const ie=m.state.transmissionRenderTarget[k.id],ce=k.viewport||y;ie.setSize(ce.z,ce.w);const fe=v.getRenderTarget();v.setRenderTarget(ie),v.getClearColor(F),Y=v.getClearAlpha(),Y<1&&v.setClearColor(16777215,.5),Re?ne.render(B):v.clear();const _e=v.toneMapping;v.toneMapping=wn;const Te=k.viewport;if(k.viewport!==void 0&&(k.viewport=void 0),m.setupLightsView(k),Z===!0&&se.setGlobalState(v.clippingPlanes,k),In(b,B,k),Ce.updateMultisampleRenderTarget(ie),Ce.updateRenderTargetMipmap(ie),Be.has("WEBGL_multisampled_render_to_texture")===!1){let Ae=!1;for(let Ee=0,Ze=U.length;Ee<Ze;Ee++){const lt=U[Ee],ct=lt.object,Dt=lt.geometry,qe=lt.material,Se=lt.group;if(qe.side===Ct&&ct.layers.test(k.layers)){const Tt=qe.side;qe.side=Pt,qe.needsUpdate=!0,Wo(ct,B,k,Dt,qe,Se),qe.side=Tt,qe.needsUpdate=!0,Ae=!0}}Ae===!0&&(Ce.updateMultisampleRenderTarget(ie),Ce.updateRenderTargetMipmap(ie))}v.setRenderTarget(fe),v.setClearColor(F,Y),Te!==void 0&&(k.viewport=Te),v.toneMapping=_e}function In(b,U,B){const k=U.isScene===!0?U.overrideMaterial:null;for(let N=0,ie=b.length;N<ie;N++){const ce=b[N],fe=ce.object,_e=ce.geometry,Te=k===null?ce.material:k,Ae=ce.group;fe.layers.test(B.layers)&&Wo(fe,U,B,_e,Te,Ae)}}function Wo(b,U,B,k,N,ie){b.onBeforeRender(v,U,B,k,N,ie),b.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),N.onBeforeRender(v,U,B,k,b,ie),N.transparent===!0&&N.side===Ct&&N.forceSinglePass===!1?(N.side=Pt,N.needsUpdate=!0,v.renderBufferDirect(B,U,k,N,b,ie),N.side=Jt,N.needsUpdate=!0,v.renderBufferDirect(B,U,k,N,b,ie),N.side=Ct):v.renderBufferDirect(B,U,k,N,b,ie),b.onAfterRender(v,U,B,k,N,ie)}function us(b,U,B){U.isScene!==!0&&(U=Ne);const k=Oe.get(b),N=m.state.lights,ie=m.state.shadowsArray,ce=N.state.version,fe=Q.getParameters(b,N.state,ie,U,B),_e=Q.getProgramCacheKey(fe);let Te=k.programs;k.environment=b.isMeshStandardMaterial?U.environment:null,k.fog=U.fog,k.envMap=(b.isMeshStandardMaterial?C:st).get(b.envMap||k.environment),k.envMapRotation=k.environment!==null&&b.envMap===null?U.environmentRotation:b.envMapRotation,Te===void 0&&(b.addEventListener("dispose",j),Te=new Map,k.programs=Te);let Ae=Te.get(_e);if(Ae!==void 0){if(k.currentProgram===Ae&&k.lightsStateVersion===ce)return Yo(b,fe),Ae}else fe.uniforms=Q.getUniforms(b),b.onBuild(B,fe,v),b.onBeforeCompile(fe,v),Ae=Q.acquireProgram(fe,_e),Te.set(_e,Ae),k.uniforms=fe.uniforms;const Ee=k.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ee.clippingPlanes=se.uniform),Yo(b,fe),k.needsLights=Vc(b),k.lightsStateVersion=ce,k.needsLights&&(Ee.ambientLightColor.value=N.state.ambient,Ee.lightProbe.value=N.state.probe,Ee.directionalLights.value=N.state.directional,Ee.directionalLightShadows.value=N.state.directionalShadow,Ee.spotLights.value=N.state.spot,Ee.spotLightShadows.value=N.state.spotShadow,Ee.rectAreaLights.value=N.state.rectArea,Ee.ltc_1.value=N.state.rectAreaLTC1,Ee.ltc_2.value=N.state.rectAreaLTC2,Ee.pointLights.value=N.state.point,Ee.pointLightShadows.value=N.state.pointShadow,Ee.hemisphereLights.value=N.state.hemi,Ee.directionalShadowMap.value=N.state.directionalShadowMap,Ee.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Ee.spotShadowMap.value=N.state.spotShadowMap,Ee.spotLightMatrix.value=N.state.spotLightMatrix,Ee.spotLightMap.value=N.state.spotLightMap,Ee.pointShadowMap.value=N.state.pointShadowMap,Ee.pointShadowMatrix.value=N.state.pointShadowMatrix),k.currentProgram=Ae,k.uniformsList=null,Ae}function Xo(b){if(b.uniformsList===null){const U=b.currentProgram.getUniforms();b.uniformsList=Ks.seqWithValue(U.seq,b.uniforms)}return b.uniformsList}function Yo(b,U){const B=Oe.get(b);B.outputColorSpace=U.outputColorSpace,B.batching=U.batching,B.batchingColor=U.batchingColor,B.instancing=U.instancing,B.instancingColor=U.instancingColor,B.instancingMorph=U.instancingMorph,B.skinning=U.skinning,B.morphTargets=U.morphTargets,B.morphNormals=U.morphNormals,B.morphColors=U.morphColors,B.morphTargetsCount=U.morphTargetsCount,B.numClippingPlanes=U.numClippingPlanes,B.numIntersection=U.numClipIntersection,B.vertexAlphas=U.vertexAlphas,B.vertexTangents=U.vertexTangents,B.toneMapping=U.toneMapping}function Hc(b,U,B,k,N){U.isScene!==!0&&(U=Ne),Ce.resetTextureUnits();const ie=U.fog,ce=k.isMeshStandardMaterial?U.environment:null,fe=A===null?v.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:Pn,_e=(k.isMeshStandardMaterial?C:st).get(k.envMap||ce),Te=k.vertexColors===!0&&!!B.attributes.color&&B.attributes.color.itemSize===4,Ae=!!B.attributes.tangent&&(!!k.normalMap||k.anisotropy>0),Ee=!!B.morphAttributes.position,Ze=!!B.morphAttributes.normal,lt=!!B.morphAttributes.color;let ct=wn;k.toneMapped&&(A===null||A.isXRRenderTarget===!0)&&(ct=v.toneMapping);const Dt=B.morphAttributes.position||B.morphAttributes.normal||B.morphAttributes.color,qe=Dt!==void 0?Dt.length:0,Se=Oe.get(k),Tt=m.state.lights;if(Z===!0&&(te===!0||b!==T)){const Ft=b===T&&k.id===L;se.setState(k,b,Ft)}let Je=!1;k.version===Se.__version?(Se.needsLights&&Se.lightsStateVersion!==Tt.state.version||Se.outputColorSpace!==fe||N.isBatchedMesh&&Se.batching===!1||!N.isBatchedMesh&&Se.batching===!0||N.isBatchedMesh&&Se.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&Se.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&Se.instancing===!1||!N.isInstancedMesh&&Se.instancing===!0||N.isSkinnedMesh&&Se.skinning===!1||!N.isSkinnedMesh&&Se.skinning===!0||N.isInstancedMesh&&Se.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&Se.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&Se.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&Se.instancingMorph===!1&&N.morphTexture!==null||Se.envMap!==_e||k.fog===!0&&Se.fog!==ie||Se.numClippingPlanes!==void 0&&(Se.numClippingPlanes!==se.numPlanes||Se.numIntersection!==se.numIntersection)||Se.vertexAlphas!==Te||Se.vertexTangents!==Ae||Se.morphTargets!==Ee||Se.morphNormals!==Ze||Se.morphColors!==lt||Se.toneMapping!==ct||Se.morphTargetsCount!==qe)&&(Je=!0):(Je=!0,Se.__version=k.version);let tn=Se.currentProgram;Je===!0&&(tn=us(k,U,N));let ds=!1,Dn=!1,xr=!1;const vt=tn.getUniforms(),pn=Se.uniforms;if(ye.useProgram(tn.program)&&(ds=!0,Dn=!0,xr=!0),k.id!==L&&(L=k.id,Dn=!0),ds||T!==b){vt.setValue(D,"projectionMatrix",b.projectionMatrix),vt.setValue(D,"viewMatrix",b.matrixWorldInverse);const Ft=vt.map.cameraPosition;Ft!==void 0&&Ft.setValue(D,ae.setFromMatrixPosition(b.matrixWorld)),Qe.logarithmicDepthBuffer&&vt.setValue(D,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(k.isMeshPhongMaterial||k.isMeshToonMaterial||k.isMeshLambertMaterial||k.isMeshBasicMaterial||k.isMeshStandardMaterial||k.isShaderMaterial)&&vt.setValue(D,"isOrthographic",b.isOrthographicCamera===!0),T!==b&&(T=b,Dn=!0,xr=!0)}if(N.isSkinnedMesh){vt.setOptional(D,N,"bindMatrix"),vt.setOptional(D,N,"bindMatrixInverse");const Ft=N.skeleton;Ft&&(Ft.boneTexture===null&&Ft.computeBoneTexture(),vt.setValue(D,"boneTexture",Ft.boneTexture,Ce))}N.isBatchedMesh&&(vt.setOptional(D,N,"batchingTexture"),vt.setValue(D,"batchingTexture",N._matricesTexture,Ce),vt.setOptional(D,N,"batchingColorTexture"),N._colorsTexture!==null&&vt.setValue(D,"batchingColorTexture",N._colorsTexture,Ce));const Mr=B.morphAttributes;if((Mr.position!==void 0||Mr.normal!==void 0||Mr.color!==void 0)&&ge.update(N,B,tn),(Dn||Se.receiveShadow!==N.receiveShadow)&&(Se.receiveShadow=N.receiveShadow,vt.setValue(D,"receiveShadow",N.receiveShadow)),k.isMeshGouraudMaterial&&k.envMap!==null&&(pn.envMap.value=_e,pn.flipEnvMap.value=_e.isCubeTexture&&_e.isRenderTargetTexture===!1?-1:1),k.isMeshStandardMaterial&&k.envMap===null&&U.environment!==null&&(pn.envMapIntensity.value=U.environmentIntensity),Dn&&(vt.setValue(D,"toneMappingExposure",v.toneMappingExposure),Se.needsLights&&Gc(pn,xr),ie&&k.fog===!0&&ee.refreshFogUniforms(pn,ie),ee.refreshMaterialUniforms(pn,k,K,W,m.state.transmissionRenderTarget[b.id]),Ks.upload(D,Xo(Se),pn,Ce)),k.isShaderMaterial&&k.uniformsNeedUpdate===!0&&(Ks.upload(D,Xo(Se),pn,Ce),k.uniformsNeedUpdate=!1),k.isSpriteMaterial&&vt.setValue(D,"center",N.center),vt.setValue(D,"modelViewMatrix",N.modelViewMatrix),vt.setValue(D,"normalMatrix",N.normalMatrix),vt.setValue(D,"modelMatrix",N.matrixWorld),k.isShaderMaterial||k.isRawShaderMaterial){const Ft=k.uniformsGroups;for(let Sr=0,Wc=Ft.length;Sr<Wc;Sr++){const Zo=Ft[Sr];Ie.update(Zo,tn),Ie.bind(Zo,tn)}}return tn}function Gc(b,U){b.ambientLightColor.needsUpdate=U,b.lightProbe.needsUpdate=U,b.directionalLights.needsUpdate=U,b.directionalLightShadows.needsUpdate=U,b.pointLights.needsUpdate=U,b.pointLightShadows.needsUpdate=U,b.spotLights.needsUpdate=U,b.spotLightShadows.needsUpdate=U,b.rectAreaLights.needsUpdate=U,b.hemisphereLights.needsUpdate=U}function Vc(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return w},this.getRenderTarget=function(){return A},this.setRenderTargetTextures=function(b,U,B){Oe.get(b.texture).__webglTexture=U,Oe.get(b.depthTexture).__webglTexture=B;const k=Oe.get(b);k.__hasExternalTextures=!0,k.__autoAllocateDepthBuffer=B===void 0,k.__autoAllocateDepthBuffer||Be.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),k.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(b,U){const B=Oe.get(b);B.__webglFramebuffer=U,B.__useDefaultFramebuffer=U===void 0},this.setRenderTarget=function(b,U=0,B=0){A=b,R=U,w=B;let k=!0,N=null,ie=!1,ce=!1;if(b){const _e=Oe.get(b);_e.__useDefaultFramebuffer!==void 0?(ye.bindFramebuffer(D.FRAMEBUFFER,null),k=!1):_e.__webglFramebuffer===void 0?Ce.setupRenderTarget(b):_e.__hasExternalTextures&&Ce.rebindTextures(b,Oe.get(b.texture).__webglTexture,Oe.get(b.depthTexture).__webglTexture);const Te=b.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(ce=!0);const Ae=Oe.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ae[U])?N=Ae[U][B]:N=Ae[U],ie=!0):b.samples>0&&Ce.useMultisampledRTT(b)===!1?N=Oe.get(b).__webglMultisampledFramebuffer:Array.isArray(Ae)?N=Ae[B]:N=Ae,y.copy(b.viewport),I.copy(b.scissor),z=b.scissorTest}else y.copy(ue).multiplyScalar(K).floor(),I.copy(me).multiplyScalar(K).floor(),z=ze;if(ye.bindFramebuffer(D.FRAMEBUFFER,N)&&k&&ye.drawBuffers(b,N),ye.viewport(y),ye.scissor(I),ye.setScissorTest(z),ie){const _e=Oe.get(b.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+U,_e.__webglTexture,B)}else if(ce){const _e=Oe.get(b.texture),Te=U||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,_e.__webglTexture,B||0,Te)}L=-1},this.readRenderTargetPixels=function(b,U,B,k,N,ie,ce){if(!(b&&b.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let fe=Oe.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ce!==void 0&&(fe=fe[ce]),fe){ye.bindFramebuffer(D.FRAMEBUFFER,fe);try{const _e=b.texture,Te=_e.format,Ae=_e.type;if(!Qe.textureFormatReadable(Te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Qe.textureTypeReadable(Ae)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}U>=0&&U<=b.width-k&&B>=0&&B<=b.height-N&&D.readPixels(U,B,k,N,le.convert(Te),le.convert(Ae),ie)}finally{const _e=A!==null?Oe.get(A).__webglFramebuffer:null;ye.bindFramebuffer(D.FRAMEBUFFER,_e)}}},this.readRenderTargetPixelsAsync=async function(b,U,B,k,N,ie,ce){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let fe=Oe.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&ce!==void 0&&(fe=fe[ce]),fe){ye.bindFramebuffer(D.FRAMEBUFFER,fe);try{const _e=b.texture,Te=_e.format,Ae=_e.type;if(!Qe.textureFormatReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Qe.textureTypeReadable(Ae))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(U>=0&&U<=b.width-k&&B>=0&&B<=b.height-N){const Ee=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Ee),D.bufferData(D.PIXEL_PACK_BUFFER,ie.byteLength,D.STREAM_READ),D.readPixels(U,B,k,N,le.convert(Te),le.convert(Ae),0),D.flush();const Ze=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);await _u(D,Ze,4);try{D.bindBuffer(D.PIXEL_PACK_BUFFER,Ee),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ie)}finally{D.deleteBuffer(Ee),D.deleteSync(Ze)}return ie}}finally{const _e=A!==null?Oe.get(A).__webglFramebuffer:null;ye.bindFramebuffer(D.FRAMEBUFFER,_e)}}},this.copyFramebufferToTexture=function(b,U=null,B=0){b.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),U=arguments[0]||null,b=arguments[1]);const k=Math.pow(2,-B),N=Math.floor(b.image.width*k),ie=Math.floor(b.image.height*k),ce=U!==null?U.x:0,fe=U!==null?U.y:0;Ce.setTexture2D(b,0),D.copyTexSubImage2D(D.TEXTURE_2D,B,0,0,ce,fe,N,ie),ye.unbindTexture()},this.copyTextureToTexture=function(b,U,B=null,k=null,N=0){b.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),k=arguments[0]||null,b=arguments[1],U=arguments[2],N=arguments[3]||0,B=null);let ie,ce,fe,_e,Te,Ae;B!==null?(ie=B.max.x-B.min.x,ce=B.max.y-B.min.y,fe=B.min.x,_e=B.min.y):(ie=b.image.width,ce=b.image.height,fe=0,_e=0),k!==null?(Te=k.x,Ae=k.y):(Te=0,Ae=0);const Ee=le.convert(U.format),Ze=le.convert(U.type);Ce.setTexture2D(U,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);const lt=D.getParameter(D.UNPACK_ROW_LENGTH),ct=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Dt=D.getParameter(D.UNPACK_SKIP_PIXELS),qe=D.getParameter(D.UNPACK_SKIP_ROWS),Se=D.getParameter(D.UNPACK_SKIP_IMAGES),Tt=b.isCompressedTexture?b.mipmaps[N]:b.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,Tt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Tt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,fe),D.pixelStorei(D.UNPACK_SKIP_ROWS,_e),b.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,N,Te,Ae,ie,ce,Ee,Ze,Tt.data):b.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,N,Te,Ae,Tt.width,Tt.height,Ee,Tt.data):D.texSubImage2D(D.TEXTURE_2D,N,Te,Ae,Ee,Ze,Tt),D.pixelStorei(D.UNPACK_ROW_LENGTH,lt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ct),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Dt),D.pixelStorei(D.UNPACK_SKIP_ROWS,qe),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Se),N===0&&U.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),ye.unbindTexture()},this.copyTextureToTexture3D=function(b,U,B=null,k=null,N=0){b.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),B=arguments[0]||null,k=arguments[1]||null,b=arguments[2],U=arguments[3],N=arguments[4]||0);let ie,ce,fe,_e,Te,Ae,Ee,Ze,lt;const ct=b.isCompressedTexture?b.mipmaps[N]:b.image;B!==null?(ie=B.max.x-B.min.x,ce=B.max.y-B.min.y,fe=B.max.z-B.min.z,_e=B.min.x,Te=B.min.y,Ae=B.min.z):(ie=ct.width,ce=ct.height,fe=ct.depth,_e=0,Te=0,Ae=0),k!==null?(Ee=k.x,Ze=k.y,lt=k.z):(Ee=0,Ze=0,lt=0);const Dt=le.convert(U.format),qe=le.convert(U.type);let Se;if(U.isData3DTexture)Ce.setTexture3D(U,0),Se=D.TEXTURE_3D;else if(U.isDataArrayTexture||U.isCompressedArrayTexture)Ce.setTexture2DArray(U,0),Se=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,U.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,U.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,U.unpackAlignment);const Tt=D.getParameter(D.UNPACK_ROW_LENGTH),Je=D.getParameter(D.UNPACK_IMAGE_HEIGHT),tn=D.getParameter(D.UNPACK_SKIP_PIXELS),ds=D.getParameter(D.UNPACK_SKIP_ROWS),Dn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,ct.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,ct.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,_e),D.pixelStorei(D.UNPACK_SKIP_ROWS,Te),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ae),b.isDataTexture||b.isData3DTexture?D.texSubImage3D(Se,N,Ee,Ze,lt,ie,ce,fe,Dt,qe,ct.data):U.isCompressedArrayTexture?D.compressedTexSubImage3D(Se,N,Ee,Ze,lt,ie,ce,fe,Dt,ct.data):D.texSubImage3D(Se,N,Ee,Ze,lt,ie,ce,fe,Dt,qe,ct),D.pixelStorei(D.UNPACK_ROW_LENGTH,Tt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Je),D.pixelStorei(D.UNPACK_SKIP_PIXELS,tn),D.pixelStorei(D.UNPACK_SKIP_ROWS,ds),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Dn),N===0&&U.generateMipmaps&&D.generateMipmap(Se),ye.unbindTexture()},this.initRenderTarget=function(b){Oe.get(b).__webglFramebuffer===void 0&&Ce.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?Ce.setTextureCube(b,0):b.isData3DTexture?Ce.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?Ce.setTexture2DArray(b,0):Ce.setTexture2D(b,0),ye.unbindTexture()},this.resetState=function(){R=0,w=0,A=null,ye.reset(),Le.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return un}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===wo?"display-p3":"srgb",t.unpackColorSpace=je.workingColorSpace===dr?"display-p3":"srgb"}}class Ag extends St{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Qt,this.environmentIntensity=1,this.environmentRotation=new Qt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class wg{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=vo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=jt()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Co("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=jt()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const At=new P;class sr{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyMatrix4(e),this.setXYZ(t,At.x,At.y,At.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.applyNormalMatrix(e),this.setXYZ(t,At.x,At.y,At.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)At.fromBufferAttribute(this,t),At.transformDirection(e),this.setXYZ(t,At.x,At.y,At.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Yt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=$e(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=$e(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Yt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Yt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Yt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Yt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),s=$e(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=$e(t,this.array),n=$e(n,this.array),s=$e(s,this.array),r=$e(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new Zt(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new sr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class So extends $n{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new Me(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let pi;const Hi=new P,mi=new P,gi=new P,_i=new J,Gi=new J,Mc=new tt,Ns=new P,Vi=new P,Os=new P,fl=new J,Qr=new J,pl=new J;class eo extends St{constructor(e=new So){if(super(),this.isSprite=!0,this.type="Sprite",pi===void 0){pi=new it;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new wg(t,5);pi.setIndex([0,1,2,0,2,3]),pi.setAttribute("position",new sr(n,3,0,!1)),pi.setAttribute("uv",new sr(n,2,3,!1))}this.geometry=pi,this.material=e,this.center=new J(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),mi.setFromMatrixScale(this.matrixWorld),Mc.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),gi.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&mi.multiplyScalar(-gi.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;Fs(Ns.set(-.5,-.5,0),gi,o,mi,s,r),Fs(Vi.set(.5,-.5,0),gi,o,mi,s,r),Fs(Os.set(.5,.5,0),gi,o,mi,s,r),fl.set(0,0),Qr.set(1,0),pl.set(1,1);let a=e.ray.intersectTriangle(Ns,Vi,Os,!1,Hi);if(a===null&&(Fs(Vi.set(-.5,.5,0),gi,o,mi,s,r),Qr.set(0,1),a=e.ray.intersectTriangle(Ns,Os,Vi,!1,Hi),a===null))return;const l=e.ray.origin.distanceTo(Hi);l<e.near||l>e.far||t.push({distance:l,point:Hi.clone(),uv:zt.getInterpolation(Hi,Ns,Vi,Os,fl,Qr,pl,new J),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Fs(i,e,t,n,s,r){_i.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(Gi.x=r*_i.x-s*_i.y,Gi.y=s*_i.x+r*_i.y):Gi.copy(_i),i.copy(e),i.x+=Gi.x,i.y+=Gi.y,i.applyMatrix4(Mc)}class Cn extends $n{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Me(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const rr=new P,or=new P,ml=new tt,Wi=new Po,Bs=new fr,to=new P,gl=new P;class Rg extends St{constructor(e=new it,t=new Cn){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)rr.fromBufferAttribute(t,s-1),or.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=rr.distanceTo(or);e.setAttribute("lineDistance",new We(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Bs.copy(n.boundingSphere),Bs.applyMatrix4(s),Bs.radius+=r,e.ray.intersectsSphere(Bs)===!1)return;ml.copy(s).invert(),Wi.copy(e.ray).applyMatrix4(ml);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=this.isLineSegments?2:1,u=n.index,d=n.attributes.position;if(u!==null){const p=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const f=u.getX(_),M=u.getX(_+1),v=zs(this,e,Wi,l,f,M);v&&t.push(v)}if(this.isLineLoop){const _=u.getX(g-1),m=u.getX(p),f=zs(this,e,Wi,l,_,m);f&&t.push(f)}}else{const p=Math.max(0,o.start),g=Math.min(d.count,o.start+o.count);for(let _=p,m=g-1;_<m;_+=c){const f=zs(this,e,Wi,l,_,_+1);f&&t.push(f)}if(this.isLineLoop){const _=zs(this,e,Wi,l,g-1,p);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function zs(i,e,t,n,s,r){const o=i.geometry.attributes.position;if(rr.fromBufferAttribute(o,s),or.fromBufferAttribute(o,r),t.distanceSqToSegment(rr,or,to,gl)>n)return;to.applyMatrix4(i.matrixWorld);const l=e.ray.origin.distanceTo(to);if(!(l<e.near||l>e.far))return{distance:l,point:gl.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,object:i}}const _l=new P,vl=new P;class Zn extends Rg{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)_l.fromBufferAttribute(t,s),vl.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+_l.distanceTo(vl);e.setAttribute("lineDistance",new We(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class yo extends yt{constructor(e,t,n,s,r,o,a,l,c){super(e,t,n,s,r,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class en{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let s=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,l=r-1,c;for(;a<=l;)if(s=Math.floor(a+(l-a)/2),c=n[s]-o,c<0)a=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===o)return s/(r-1);const u=n[s],d=n[s+1]-u,p=(o-u)/d;return(s+p)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),l=t||(o.isVector2?new J:new P);return l.copy(a).sub(o).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new P,s=[],r=[],o=[],a=new P,l=new tt;for(let p=0;p<=e;p++){const g=p/e;s[p]=this.getTangentAt(g,new P)}r[0]=new P,o[0]=new P;let c=Number.MAX_VALUE;const u=Math.abs(s[0].x),h=Math.abs(s[0].y),d=Math.abs(s[0].z);u<=c&&(c=u,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),d<=c&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),o[p]=o[p-1].clone(),a.crossVectors(s[p-1],s[p]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(Mt(s[p-1].dot(s[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(a,g))}o[p].crossVectors(s[p],r[p])}if(t===!0){let p=Math.acos(Mt(r[0].dot(r[e]),-1,1));p/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(s[g],p*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class Do extends en{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(e,t=new J){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+e*r;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const u=Math.cos(this.aRotation),h=Math.sin(this.aRotation),d=l-this.aX,p=c-this.aY;l=d*u-p*h+this.aX,c=d*h+p*u+this.aY}return n.set(l,c)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class Cg extends Do{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function Uo(){let i=0,e=0,t=0,n=0;function s(r,o,a,l){i=r,e=a,t=-3*r+3*o-2*a-l,n=2*r-2*o+a+l}return{initCatmullRom:function(r,o,a,l,c){s(o,a,c*(a-r),c*(l-o))},initNonuniformCatmullRom:function(r,o,a,l,c,u,h){let d=(o-r)/c-(a-r)/(c+u)+(a-o)/u,p=(a-o)/u-(l-o)/(u+h)+(l-a)/h;d*=u,p*=u,s(o,a,d,p)},calc:function(r){const o=r*r,a=o*r;return i+e*r+t*o+n*a}}}const ks=new P,no=new Uo,io=new Uo,so=new Uo;class Pg extends en{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new P){const n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:l===0&&a===r-1&&(a=r-2,l=1);let c,u;this.closed||a>0?c=s[(a-1)%r]:(ks.subVectors(s[0],s[1]).add(s[0]),c=ks);const h=s[a%r],d=s[(a+1)%r];if(this.closed||a+2<r?u=s[(a+2)%r]:(ks.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=ks),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),p),_=Math.pow(h.distanceToSquared(d),p),m=Math.pow(d.distanceToSquared(u),p);_<1e-4&&(_=1),g<1e-4&&(g=_),m<1e-4&&(m=_),no.initNonuniformCatmullRom(c.x,h.x,d.x,u.x,g,_,m),io.initNonuniformCatmullRom(c.y,h.y,d.y,u.y,g,_,m),so.initNonuniformCatmullRom(c.z,h.z,d.z,u.z,g,_,m)}else this.curveType==="catmullrom"&&(no.initCatmullRom(c.x,h.x,d.x,u.x,this.tension),io.initCatmullRom(c.y,h.y,d.y,u.y,this.tension),so.initCatmullRom(c.z,h.z,d.z,u.z,this.tension));return n.set(no.calc(l),io.calc(l),so.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new P().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function xl(i,e,t,n,s){const r=(n-e)*.5,o=(s-t)*.5,a=i*i,l=i*a;return(2*t-2*n+r+o)*l+(-3*t+3*n-2*r-o)*a+r*i+t}function Lg(i,e){const t=1-i;return t*t*e}function Ig(i,e){return 2*(1-i)*i*e}function Dg(i,e){return i*i*e}function Ki(i,e,t,n){return Lg(i,e)+Ig(i,t)+Dg(i,n)}function Ug(i,e){const t=1-i;return t*t*t*e}function Ng(i,e){const t=1-i;return 3*t*t*i*e}function Og(i,e){return 3*(1-i)*i*i*e}function Fg(i,e){return i*i*i*e}function $i(i,e,t,n,s){return Ug(i,e)+Ng(i,t)+Og(i,n)+Fg(i,s)}class Sc extends en{constructor(e=new J,t=new J,n=new J,s=new J){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new J){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set($i(e,s.x,r.x,o.x,a.x),$i(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class Bg extends en{constructor(e=new P,t=new P,n=new P,s=new P){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set($i(e,s.x,r.x,o.x,a.x),$i(e,s.y,r.y,o.y,a.y),$i(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class yc extends en{constructor(e=new J,t=new J){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new J){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new J){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class zg extends en{constructor(e=new P,t=new P){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new P){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new P){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class Ec extends en{constructor(e=new J,t=new J,n=new J){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new J){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Ki(e,s.x,r.x,o.x),Ki(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class kg extends en{constructor(e=new P,t=new P,n=new P){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new P){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(Ki(e,s.x,r.x,o.x),Ki(e,s.y,r.y,o.y),Ki(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class bc extends en{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new J){const n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,l=s[o===0?o:o-1],c=s[o],u=s[o>s.length-2?s.length-1:o+1],h=s[o>s.length-3?s.length-1:o+2];return n.set(xl(a,l.x,c.x,u.x,h.x),xl(a,l.y,c.y,u.y,h.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new J().fromArray(s))}return this}}var Ml=Object.freeze({__proto__:null,ArcCurve:Cg,CatmullRomCurve3:Pg,CubicBezierCurve:Sc,CubicBezierCurve3:Bg,EllipseCurve:Do,LineCurve:yc,LineCurve3:zg,QuadraticBezierCurve:Ec,QuadraticBezierCurve3:kg,SplineCurve:bc});class Hg extends en{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Ml[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,l=o.getPoints(a);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(t.push(u),n=u)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new Ml[s.type]().fromJSON(s))}return this}}class Ii extends Hg{constructor(e){super(),this.type="Path",this.currentPoint=new J,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new yc(this.currentPoint.clone(),new J(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new Ec(this.currentPoint.clone(),new J(e,t),new J(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){const a=new Sc(this.currentPoint.clone(),new J(e,t),new J(n,s),new J(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new bc(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(e+a,t+l,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(e+c,t+u,n,s,r,o,a,l),this}absellipse(e,t,n,s,r,o,a,l){const c=new Do(e,t,n,s,r,o,a,l);if(this.curves.length>0){const h=c.getPoint(0);h.equals(this.currentPoint)||this.lineTo(h.x,h.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Mi extends it{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:l};const c=this;s=Math.floor(s),r=Math.floor(r);const u=[],h=[],d=[],p=[];let g=0;const _=[],m=n/2;let f=0;M(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(u),this.setAttribute("position",new We(h,3)),this.setAttribute("normal",new We(d,3)),this.setAttribute("uv",new We(p,2));function M(){const S=new P,R=new P;let w=0;const A=(t-e)/n;for(let L=0;L<=r;L++){const T=[],y=L/r,I=y*(t-e)+e;for(let z=0;z<=s;z++){const F=z/s,Y=F*l+a,q=Math.sin(Y),W=Math.cos(Y);R.x=I*q,R.y=-y*n+m,R.z=I*W,h.push(R.x,R.y,R.z),S.set(q,A,W).normalize(),d.push(S.x,S.y,S.z),p.push(F,1-y),T.push(g++)}_.push(T)}for(let L=0;L<s;L++)for(let T=0;T<r;T++){const y=_[T][L],I=_[T+1][L],z=_[T+1][L+1],F=_[T][L+1];u.push(y,I,F),u.push(I,z,F),w+=6}c.addGroup(f,w,0),f+=w}function v(S){const R=g,w=new J,A=new P;let L=0;const T=S===!0?e:t,y=S===!0?1:-1;for(let z=1;z<=s;z++)h.push(0,m*y,0),d.push(0,y,0),p.push(.5,.5),g++;const I=g;for(let z=0;z<=s;z++){const Y=z/s*l+a,q=Math.cos(Y),W=Math.sin(Y);A.x=T*W,A.y=m*y,A.z=T*q,h.push(A.x,A.y,A.z),d.push(0,y,0),w.x=q*.5+.5,w.y=W*.5*y+.5,p.push(w.x,w.y),g++}for(let z=0;z<s;z++){const F=R+z,Y=I+z;S===!0?u.push(Y,Y+1,F):u.push(Y+1,Y,F),L+=3}c.addGroup(f,L,S===!0?1:2),f+=L}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mi(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const Hs=new P,Gs=new P,ro=new P,Vs=new zt;class Sl extends it{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(bi*t),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],h=new Array(3),d={},p=[];for(let g=0;g<l;g+=3){o?(c[0]=o.getX(g),c[1]=o.getX(g+1),c[2]=o.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:_,b:m,c:f}=Vs;if(_.fromBufferAttribute(a,c[0]),m.fromBufferAttribute(a,c[1]),f.fromBufferAttribute(a,c[2]),Vs.getNormal(ro),h[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,h[1]=`${Math.round(m.x*s)},${Math.round(m.y*s)},${Math.round(m.z*s)}`,h[2]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,!(h[0]===h[1]||h[1]===h[2]||h[2]===h[0]))for(let M=0;M<3;M++){const v=(M+1)%3,S=h[M],R=h[v],w=Vs[u[M]],A=Vs[u[v]],L=`${S}_${R}`,T=`${R}_${S}`;T in d&&d[T]?(ro.dot(d[T].normal)<=r&&(p.push(w.x,w.y,w.z),p.push(A.x,A.y,A.z)),d[T]=null):L in d||(d[L]={index0:c[M],index1:c[v],normal:ro.clone()})}}for(const g in d)if(d[g]){const{index0:_,index1:m}=d[g];Hs.fromBufferAttribute(a,_),Gs.fromBufferAttribute(a,m),p.push(Hs.x,Hs.y,Hs.z),p.push(Gs.x,Gs.y,Gs.z)}this.setAttribute("position",new We(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class os extends Ii{constructor(e){super(e),this.uuid=jt(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new Ii().fromJSON(s))}return this}}const Gg={triangulate:function(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=Tc(i,0,s,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,l,c,u,h,d,p;if(n&&(r=Zg(i,e,r,t)),i.length>80*t){a=c=i[0],l=u=i[1];for(let g=t;g<s;g+=t)h=i[g],d=i[g+1],h<a&&(a=h),d<l&&(l=d),h>c&&(c=h),d>u&&(u=d);p=Math.max(c-a,u-l),p=p!==0?32767/p:0}return ts(r,o,t,a,l,p,0),o}};function Tc(i,e,t,n,s){let r,o;if(s===s_(i,e,t,n)>0)for(r=e;r<t;r+=n)o=yl(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=yl(r,i[r],i[r+1],o);return o&&_r(o,o.next)&&(is(o),o=o.next),o}function qn(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(_r(t,t.next)||rt(t.prev,t,t.next)===0)){if(is(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function ts(i,e,t,n,s,r,o){if(!i)return;!o&&r&&Jg(i,n,s,r);let a=i,l,c;for(;i.prev!==i.next;){if(l=i.prev,c=i.next,r?Wg(i,n,s,r):Vg(i)){e.push(l.i/t|0),e.push(i.i/t|0),e.push(c.i/t|0),is(i),i=c.next,a=c.next;continue}if(i=c,i===a){o?o===1?(i=Xg(qn(i),e,t),ts(i,e,t,n,s,r,2)):o===2&&Yg(i,e,t,n,s,r):ts(qn(i),e,t,n,s,r,1);break}}}function Vg(i){const e=i.prev,t=i,n=i.next;if(rt(e,t,n)>=0)return!1;const s=e.x,r=t.x,o=n.x,a=e.y,l=t.y,c=n.y,u=s<r?s<o?s:o:r<o?r:o,h=a<l?a<c?a:c:l<c?l:c,d=s>r?s>o?s:o:r>o?r:o,p=a>l?a>c?a:c:l>c?l:c;let g=n.next;for(;g!==e;){if(g.x>=u&&g.x<=d&&g.y>=h&&g.y<=p&&Si(s,a,r,l,o,c,g.x,g.y)&&rt(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Wg(i,e,t,n){const s=i.prev,r=i,o=i.next;if(rt(s,r,o)>=0)return!1;const a=s.x,l=r.x,c=o.x,u=s.y,h=r.y,d=o.y,p=a<l?a<c?a:c:l<c?l:c,g=u<h?u<d?u:d:h<d?h:d,_=a>l?a>c?a:c:l>c?l:c,m=u>h?u>d?u:d:h>d?h:d,f=Eo(p,g,e,t,n),M=Eo(_,m,e,t,n);let v=i.prevZ,S=i.nextZ;for(;v&&v.z>=f&&S&&S.z<=M;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Si(a,u,l,h,c,d,v.x,v.y)&&rt(v.prev,v,v.next)>=0||(v=v.prevZ,S.x>=p&&S.x<=_&&S.y>=g&&S.y<=m&&S!==s&&S!==o&&Si(a,u,l,h,c,d,S.x,S.y)&&rt(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;v&&v.z>=f;){if(v.x>=p&&v.x<=_&&v.y>=g&&v.y<=m&&v!==s&&v!==o&&Si(a,u,l,h,c,d,v.x,v.y)&&rt(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;S&&S.z<=M;){if(S.x>=p&&S.x<=_&&S.y>=g&&S.y<=m&&S!==s&&S!==o&&Si(a,u,l,h,c,d,S.x,S.y)&&rt(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function Xg(i,e,t){let n=i;do{const s=n.prev,r=n.next.next;!_r(s,r)&&Ac(s,n,n.next,r)&&ns(s,r)&&ns(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),is(n),is(n.next),n=i=r),n=n.next}while(n!==i);return qn(n)}function Yg(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&t_(o,a)){let l=wc(o,a);o=qn(o,o.next),l=qn(l,l.next),ts(o,e,t,n,s,r,0),ts(l,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function Zg(i,e,t,n){const s=[];let r,o,a,l,c;for(r=0,o=e.length;r<o;r++)a=e[r]*n,l=r<o-1?e[r+1]*n:i.length,c=Tc(i,a,l,n,!1),c===c.next&&(c.steiner=!0),s.push(e_(c));for(s.sort(qg),r=0;r<s.length;r++)t=Kg(s[r],t);return t}function qg(i,e){return i.x-e.x}function Kg(i,e){const t=$g(i,e);if(!t)return e;const n=wc(t,i);return qn(n,n.next),qn(t,t.next)}function $g(i,e){let t=e,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const d=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(d<=r&&d>n&&(n=d,s=t.x<t.next.x?t:t.next,d===r))return s}t=t.next}while(t!==e);if(!s)return null;const a=s,l=s.x,c=s.y;let u=1/0,h;t=s;do r>=t.x&&t.x>=l&&r!==t.x&&Si(o<c?r:n,o,l,c,o<c?n:r,o,t.x,t.y)&&(h=Math.abs(o-t.y)/(r-t.x),ns(t,i)&&(h<u||h===u&&(t.x>s.x||t.x===s.x&&jg(s,t)))&&(s=t,u=h)),t=t.next;while(t!==a);return s}function jg(i,e){return rt(i.prev,i,e.prev)<0&&rt(e.next,i,i.next)<0}function Jg(i,e,t,n){let s=i;do s.z===0&&(s.z=Eo(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Qg(s)}function Qg(i){let e,t,n,s,r,o,a,l,c=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<c&&(a++,n=n.nextZ,!!n);e++);for(l=c;a>0||l>0&&n;)a!==0&&(l===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,c*=2}while(o>1);return i}function Eo(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function e_(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Si(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function t_(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!n_(i,e)&&(ns(i,e)&&ns(e,i)&&i_(i,e)&&(rt(i.prev,i,e.prev)||rt(i,e.prev,e))||_r(i,e)&&rt(i.prev,i,i.next)>0&&rt(e.prev,e,e.next)>0)}function rt(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function _r(i,e){return i.x===e.x&&i.y===e.y}function Ac(i,e,t,n){const s=Xs(rt(i,e,t)),r=Xs(rt(i,e,n)),o=Xs(rt(t,n,i)),a=Xs(rt(t,n,e));return!!(s!==r&&o!==a||s===0&&Ws(i,t,e)||r===0&&Ws(i,n,e)||o===0&&Ws(t,i,n)||a===0&&Ws(t,e,n))}function Ws(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function Xs(i){return i>0?1:i<0?-1:0}function n_(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Ac(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function ns(i,e){return rt(i.prev,i,i.next)<0?rt(i,e,i.next)>=0&&rt(i,i.prev,e)>=0:rt(i,e,i.prev)<0||rt(i,i.next,e)<0}function i_(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function wc(i,e){const t=new bo(i.i,i.x,i.y),n=new bo(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function yl(i,e,t,n){const s=new bo(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function is(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function bo(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function s_(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class ji{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return ji.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];El(e),bl(n,e);let o=e.length;t.forEach(El);for(let l=0;l<t.length;l++)s.push(o),o+=t[l].length,bl(n,t[l]);const a=Gg.triangulate(n,s);for(let l=0;l<a.length;l+=3)r.push(a.slice(l,l+3));return r}}function El(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function bl(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Ui extends it{constructor(e=new os([new J(0,.5),new J(-.5,-.5),new J(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],o=[];let a=0,l=0;if(Array.isArray(e)===!1)c(e);else for(let u=0;u<e.length;u++)c(e[u]),this.addGroup(a,l,u),a+=l,l=0;this.setIndex(n),this.setAttribute("position",new We(s,3)),this.setAttribute("normal",new We(r,3)),this.setAttribute("uv",new We(o,2));function c(u){const h=s.length/3,d=u.extractPoints(t);let p=d.shape;const g=d.holes;ji.isClockWise(p)===!1&&(p=p.reverse());for(let m=0,f=g.length;m<f;m++){const M=g[m];ji.isClockWise(M)===!0&&(g[m]=M.reverse())}const _=ji.triangulateShape(p,g);for(let m=0,f=g.length;m<f;m++){const M=g[m];p=p.concat(M)}for(let m=0,f=p.length;m<f;m++){const M=p[m];s.push(M.x,M.y,0),r.push(0,0,1),o.push(M.x,M.y)}for(let m=0,f=_.length;m<f;m++){const M=_[m],v=M[0]+h,S=M[1]+h,R=M[2]+h;n.push(v,S,R),l+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return r_(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const o=t[e.shapes[s]];n.push(o)}return new Ui(n,e.curveSegments)}}function r_(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class No extends it{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const u=[],h=new P,d=new P,p=[],g=[],_=[],m=[];for(let f=0;f<=n;f++){const M=[],v=f/n;let S=0;f===0&&o===0?S=.5/t:f===n&&l===Math.PI&&(S=-.5/t);for(let R=0;R<=t;R++){const w=R/t;h.x=-e*Math.cos(s+w*r)*Math.sin(o+v*a),h.y=e*Math.cos(o+v*a),h.z=e*Math.sin(s+w*r)*Math.sin(o+v*a),g.push(h.x,h.y,h.z),d.copy(h).normalize(),_.push(d.x,d.y,d.z),m.push(w+S,1-v),M.push(c++)}u.push(M)}for(let f=0;f<n;f++)for(let M=0;M<t;M++){const v=u[f][M+1],S=u[f][M],R=u[f+1][M],w=u[f+1][M+1];(f!==0||o>0)&&p.push(v,S,w),(f!==n-1||l<Math.PI)&&p.push(S,R,w)}this.setIndex(p),this.setAttribute("position",new We(g,3)),this.setAttribute("normal",new We(_,3)),this.setAttribute("uv",new We(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new No(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class o_ extends $n{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Me(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Me(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ec,this.normalScale=new J(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Qt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const Tl={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class a_{constructor(e,t,n){const s=this;let r=!1,o=0,a=0,l;const c=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(u){a++,r===!1&&s.onStart!==void 0&&s.onStart(u,o,a),r=!0},this.itemEnd=function(u){o++,s.onProgress!==void 0&&s.onProgress(u,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,h){return c.push(u,h),this},this.removeHandler=function(u){const h=c.indexOf(u);return h!==-1&&c.splice(h,2),this},this.getHandler=function(u){for(let h=0,d=c.length;h<d;h+=2){const p=c[h],g=c[h+1];if(p.global&&(p.lastIndex=0),p.test(u))return g}return null}}}const l_=new a_;class Oo{constructor(e){this.manager=e!==void 0?e:l_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}Oo.DEFAULT_MATERIAL_NAME="__DEFAULT";class c_ extends Oo{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=Tl.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;const a=es("img");function l(){u(),Tl.add(e,this),t&&t(this),r.manager.itemEnd(e)}function c(h){u(),s&&s(h),r.manager.itemError(e),r.manager.itemEnd(e)}function u(){a.removeEventListener("load",l,!1),a.removeEventListener("error",c,!1)}return a.addEventListener("load",l,!1),a.addEventListener("error",c,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}}class h_ extends Oo{constructor(e){super(e)}load(e,t,n,s){const r=new yt,o=new c_(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class Fo extends St{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Me(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const oo=new tt,Al=new P,wl=new P;class Rc{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new J(512,512),this.map=null,this.mapPass=null,this.matrix=new tt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Lo,this._frameExtents=new J(1,1),this._viewportCount=1,this._viewports=[new nt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;Al.setFromMatrixPosition(e.matrixWorld),t.position.copy(Al),wl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(wl),t.updateMatrixWorld(),oo.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(oo),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(oo)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Rl=new tt,Xi=new P,ao=new P;class u_ extends Rc{constructor(){super(new Ot(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new J(4,2),this._viewportCount=6,this._viewports=[new nt(2,1,1,1),new nt(0,1,1,1),new nt(3,1,1,1),new nt(1,1,1,1),new nt(3,0,1,1),new nt(1,0,1,1)],this._cubeDirections=[new P(1,0,0),new P(-1,0,0),new P(0,0,1),new P(0,0,-1),new P(0,1,0),new P(0,-1,0)],this._cubeUps=[new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,1,0),new P(0,0,1),new P(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),Xi.setFromMatrixPosition(e.matrixWorld),n.position.copy(Xi),ao.copy(n.position),ao.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ao),n.updateMatrixWorld(),s.makeTranslation(-Xi.x,-Xi.y,-Xi.z),Rl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Rl)}}class Bo extends Fo{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new u_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class d_ extends Rc{constructor(){super(new fc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class f_ extends Fo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(St.DEFAULT_UP),this.updateMatrix(),this.target=new St,this.shadow=new d_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class p_ extends Fo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Cl{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(Mt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Pl extends Zn{constructor(e=10,t=10,n=4473924,s=8947848){n=new Me(n),s=new Me(s);const r=t/2,o=e/t,a=e/2,l=[],c=[];for(let d=0,p=0,g=-a;d<=t;d++,g+=o){l.push(-a,0,g,a,0,g),l.push(g,0,-a,g,0,a);const _=d===r?n:s;_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3,_.toArray(c,p),p+=3}const u=new it;u.setAttribute("position",new We(l,3)),u.setAttribute("color",new We(c,3));const h=new Cn({vertexColors:!0,toneMapped:!1});super(u,h),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class m_ extends Zn{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new it;s.setAttribute("position",new We(t,3)),s.setAttribute("color",new We(n,3));const r=new Cn({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){const s=new Me,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ao}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ao);const Ll={type:"change"},lo={type:"start"},Il={type:"end"},Ys=new Po,Dl=new yn,g_=Math.cos(70*xo.DEG2RAD);class __ extends Kn{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new P,this.cursor=new P,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:cn.ROTATE,MIDDLE:cn.DOLLY,RIGHT:cn.PAN},this.touches={ONE:Sn.ROTATE,TWO:Sn.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(x){x.addEventListener("keydown",se),this._domElementKeyEvents=x},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",se),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(Ll),n.update(),r=s.NONE},this.update=function(){const x=new P,G=new Yn().setFromUnitVectors(e.up,new P(0,1,0)),O=G.clone().invert(),V=new P,j=new Yn,xe=new P,we=2*Math.PI;return function(ut=null){const Ye=n.object.position;x.copy(Ye).sub(n.target),x.applyQuaternion(G),a.setFromVector3(x),n.autoRotate&&r===s.NONE&&z(y(ut)),n.enableDamping?(a.theta+=l.theta*n.dampingFactor,a.phi+=l.phi*n.dampingFactor):(a.theta+=l.theta,a.phi+=l.phi);let dt=n.minAzimuthAngle,ft=n.maxAzimuthAngle;isFinite(dt)&&isFinite(ft)&&(dt<-Math.PI?dt+=we:dt>Math.PI&&(dt-=we),ft<-Math.PI?ft+=we:ft>Math.PI&&(ft-=we),dt<=ft?a.theta=Math.max(dt,Math.min(ft,a.theta)):a.theta=a.theta>(dt+ft)/2?Math.max(dt,a.theta):Math.min(ft,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor);let Lt=!1;if(n.zoomToCursor&&w||n.object.isOrthographicCamera)a.radius=ue(a.radius);else{const It=a.radius;a.radius=ue(a.radius*c),Lt=It!=a.radius}if(x.setFromSpherical(a),x.applyQuaternion(O),Ye.copy(n.target).add(x),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),u.set(0,0,0)),n.zoomToCursor&&w){let It=null;if(n.object.isPerspectiveCamera){const fn=x.length();It=ue(fn*c);const Ln=fn-It;n.object.position.addScaledVector(S,Ln),n.object.updateMatrixWorld(),Lt=!!Ln}else if(n.object.isOrthographicCamera){const fn=new P(R.x,R.y,0);fn.unproject(n.object);const Ln=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),n.object.updateProjectionMatrix(),Lt=Ln!==n.object.zoom;const In=new P(R.x,R.y,0);In.unproject(n.object),n.object.position.sub(In).add(fn),n.object.updateMatrixWorld(),It=x.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;It!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(It).add(n.object.position):(Ys.origin.copy(n.object.position),Ys.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Ys.direction))<g_?e.lookAt(n.target):(Dl.setFromNormalAndCoplanarPoint(n.object.up,n.target),Ys.intersectPlane(Dl,n.target))))}else if(n.object.isOrthographicCamera){const It=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/c)),It!==n.object.zoom&&(n.object.updateProjectionMatrix(),Lt=!0)}return c=1,w=!1,Lt||V.distanceToSquared(n.object.position)>o||8*(1-j.dot(n.object.quaternion))>o||xe.distanceToSquared(n.target)>o?(n.dispatchEvent(Ll),V.copy(n.object.position),j.copy(n.object.quaternion),xe.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",ge),n.domElement.removeEventListener("pointerdown",st),n.domElement.removeEventListener("pointercancel",E),n.domElement.removeEventListener("wheel",Q),n.domElement.removeEventListener("pointermove",C),n.domElement.removeEventListener("pointerup",E),n.domElement.getRootNode().removeEventListener("keydown",ve,{capture:!0}),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",se),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new Cl,l=new Cl;let c=1;const u=new P,h=new J,d=new J,p=new J,g=new J,_=new J,m=new J,f=new J,M=new J,v=new J,S=new P,R=new J;let w=!1;const A=[],L={};let T=!1;function y(x){return x!==null?2*Math.PI/60*n.autoRotateSpeed*x:2*Math.PI/60/60*n.autoRotateSpeed}function I(x){const G=Math.abs(x*.01);return Math.pow(.95,n.zoomSpeed*G)}function z(x){l.theta-=x}function F(x){l.phi-=x}const Y=function(){const x=new P;return function(O,V){x.setFromMatrixColumn(V,0),x.multiplyScalar(-O),u.add(x)}}(),q=function(){const x=new P;return function(O,V){n.screenSpacePanning===!0?x.setFromMatrixColumn(V,1):(x.setFromMatrixColumn(V,0),x.crossVectors(n.object.up,x)),x.multiplyScalar(O),u.add(x)}}(),W=function(){const x=new P;return function(O,V){const j=n.domElement;if(n.object.isPerspectiveCamera){const xe=n.object.position;x.copy(xe).sub(n.target);let we=x.length();we*=Math.tan(n.object.fov/2*Math.PI/180),Y(2*O*we/j.clientHeight,n.object.matrix),q(2*V*we/j.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(Y(O*(n.object.right-n.object.left)/n.object.zoom/j.clientWidth,n.object.matrix),q(V*(n.object.top-n.object.bottom)/n.object.zoom/j.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function K(x){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c/=x:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function X(x){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?c*=x:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function he(x,G){if(!n.zoomToCursor)return;w=!0;const O=n.domElement.getBoundingClientRect(),V=x-O.left,j=G-O.top,xe=O.width,we=O.height;R.x=V/xe*2-1,R.y=-(j/we)*2+1,S.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function ue(x){return Math.max(n.minDistance,Math.min(n.maxDistance,x))}function me(x){h.set(x.clientX,x.clientY)}function ze(x){he(x.clientX,x.clientX),f.set(x.clientX,x.clientY)}function Xe(x){g.set(x.clientX,x.clientY)}function Z(x){d.set(x.clientX,x.clientY),p.subVectors(d,h).multiplyScalar(n.rotateSpeed);const G=n.domElement;z(2*Math.PI*p.x/G.clientHeight),F(2*Math.PI*p.y/G.clientHeight),h.copy(d),n.update()}function te(x){M.set(x.clientX,x.clientY),v.subVectors(M,f),v.y>0?K(I(v.y)):v.y<0&&X(I(v.y)),f.copy(M),n.update()}function de(x){_.set(x.clientX,x.clientY),m.subVectors(_,g).multiplyScalar(n.panSpeed),W(m.x,m.y),g.copy(_),n.update()}function ae(x){he(x.clientX,x.clientY),x.deltaY<0?X(I(x.deltaY)):x.deltaY>0&&K(I(x.deltaY)),n.update()}function Ne(x){let G=!1;switch(x.code){case n.keys.UP:x.ctrlKey||x.metaKey||x.shiftKey?F(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,n.keyPanSpeed),G=!0;break;case n.keys.BOTTOM:x.ctrlKey||x.metaKey||x.shiftKey?F(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(0,-n.keyPanSpeed),G=!0;break;case n.keys.LEFT:x.ctrlKey||x.metaKey||x.shiftKey?z(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(n.keyPanSpeed,0),G=!0;break;case n.keys.RIGHT:x.ctrlKey||x.metaKey||x.shiftKey?z(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):W(-n.keyPanSpeed,0),G=!0;break}G&&(x.preventDefault(),n.update())}function Re(x){if(A.length===1)h.set(x.pageX,x.pageY);else{const G=Ie(x),O=.5*(x.pageX+G.x),V=.5*(x.pageY+G.y);h.set(O,V)}}function ke(x){if(A.length===1)g.set(x.pageX,x.pageY);else{const G=Ie(x),O=.5*(x.pageX+G.x),V=.5*(x.pageY+G.y);g.set(O,V)}}function D(x){const G=Ie(x),O=x.pageX-G.x,V=x.pageY-G.y,j=Math.sqrt(O*O+V*V);f.set(0,j)}function He(x){n.enableZoom&&D(x),n.enablePan&&ke(x)}function Be(x){n.enableZoom&&D(x),n.enableRotate&&Re(x)}function Qe(x){if(A.length==1)d.set(x.pageX,x.pageY);else{const O=Ie(x),V=.5*(x.pageX+O.x),j=.5*(x.pageY+O.y);d.set(V,j)}p.subVectors(d,h).multiplyScalar(n.rotateSpeed);const G=n.domElement;z(2*Math.PI*p.x/G.clientHeight),F(2*Math.PI*p.y/G.clientHeight),h.copy(d)}function ye(x){if(A.length===1)_.set(x.pageX,x.pageY);else{const G=Ie(x),O=.5*(x.pageX+G.x),V=.5*(x.pageY+G.y);_.set(O,V)}m.subVectors(_,g).multiplyScalar(n.panSpeed),W(m.x,m.y),g.copy(_)}function Ve(x){const G=Ie(x),O=x.pageX-G.x,V=x.pageY-G.y,j=Math.sqrt(O*O+V*V);M.set(0,j),v.set(0,Math.pow(M.y/f.y,n.zoomSpeed)),K(v.y),f.copy(M);const xe=(x.pageX+G.x)*.5,we=(x.pageY+G.y)*.5;he(xe,we)}function Oe(x){n.enableZoom&&Ve(x),n.enablePan&&ye(x)}function Ce(x){n.enableZoom&&Ve(x),n.enableRotate&&Qe(x)}function st(x){n.enabled!==!1&&(A.length===0&&(n.domElement.setPointerCapture(x.pointerId),n.domElement.addEventListener("pointermove",C),n.domElement.addEventListener("pointerup",E)),!le(x)&&(Fe(x),x.pointerType==="touch"?Pe(x):H(x)))}function C(x){n.enabled!==!1&&(x.pointerType==="touch"?ne(x):$(x))}function E(x){switch(be(x),A.length){case 0:n.domElement.releasePointerCapture(x.pointerId),n.domElement.removeEventListener("pointermove",C),n.domElement.removeEventListener("pointerup",E),n.dispatchEvent(Il),r=s.NONE;break;case 1:const G=A[0],O=L[G];Pe({pointerId:G,pageX:O.x,pageY:O.y});break}}function H(x){let G;switch(x.button){case 0:G=n.mouseButtons.LEFT;break;case 1:G=n.mouseButtons.MIDDLE;break;case 2:G=n.mouseButtons.RIGHT;break;default:G=-1}switch(G){case cn.DOLLY:if(n.enableZoom===!1)return;ze(x),r=s.DOLLY;break;case cn.ROTATE:if(x.ctrlKey||x.metaKey||x.shiftKey){if(n.enablePan===!1)return;Xe(x),r=s.PAN}else{if(n.enableRotate===!1)return;me(x),r=s.ROTATE}break;case cn.PAN:if(x.ctrlKey||x.metaKey||x.shiftKey){if(n.enableRotate===!1)return;me(x),r=s.ROTATE}else{if(n.enablePan===!1)return;Xe(x),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(lo)}function $(x){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Z(x);break;case s.DOLLY:if(n.enableZoom===!1)return;te(x);break;case s.PAN:if(n.enablePan===!1)return;de(x);break}}function Q(x){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(x.preventDefault(),n.dispatchEvent(lo),ae(ee(x)),n.dispatchEvent(Il))}function ee(x){const G=x.deltaMode,O={clientX:x.clientX,clientY:x.clientY,deltaY:x.deltaY};switch(G){case 1:O.deltaY*=16;break;case 2:O.deltaY*=100;break}return x.ctrlKey&&!T&&(O.deltaY*=10),O}function ve(x){x.key==="Control"&&(T=!0,n.domElement.getRootNode().addEventListener("keyup",re,{passive:!0,capture:!0}))}function re(x){x.key==="Control"&&(T=!1,n.domElement.getRootNode().removeEventListener("keyup",re,{passive:!0,capture:!0}))}function se(x){n.enabled===!1||n.enablePan===!1||Ne(x)}function Pe(x){switch(Le(x),A.length){case 1:switch(n.touches.ONE){case Sn.ROTATE:if(n.enableRotate===!1)return;Re(x),r=s.TOUCH_ROTATE;break;case Sn.PAN:if(n.enablePan===!1)return;ke(x),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Sn.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;He(x),r=s.TOUCH_DOLLY_PAN;break;case Sn.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Be(x),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(lo)}function ne(x){switch(Le(x),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Qe(x),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;ye(x),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Oe(x),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Ce(x),n.update();break;default:r=s.NONE}}function ge(x){n.enabled!==!1&&x.preventDefault()}function Fe(x){A.push(x.pointerId)}function be(x){delete L[x.pointerId];for(let G=0;G<A.length;G++)if(A[G]==x.pointerId){A.splice(G,1);return}}function le(x){for(let G=0;G<A.length;G++)if(A[G]==x.pointerId)return!0;return!1}function Le(x){let G=L[x.pointerId];G===void 0&&(G=new J,L[x.pointerId]=G),G.set(x.pageX,x.pageY)}function Ie(x){const G=x.pointerId===A[0]?A[1]:A[0];return L[G]}n.domElement.addEventListener("contextmenu",ge),n.domElement.addEventListener("pointerdown",st),n.domElement.addEventListener("pointercancel",E),n.domElement.addEventListener("wheel",Q,{passive:!1}),n.domElement.getRootNode().addEventListener("keydown",ve,{passive:!0,capture:!0}),this.update()}}class Wt{static addAxisLabel(e,t,n,s,r){const o=document.createElement("canvas");o.width=64,o.height=64;const a=o.getContext("2d");a.font="bold 48px Orbitron, monospace",a.fillStyle=s,a.textAlign="center",a.textBaseline="middle",a.fillText(t,32,32);const l=new yo(o);r.push(l);const c=new So({map:l,depthTest:!1}),u=new eo(c);u.position.copy(n),u.scale.set(1,1,1),e.add(u)}static setLastSpriteScale(e,t){const n=e.children;for(let s=n.length-1;s>=0;s--)if(n[s]instanceof eo){n[s].scale.set(t,t,t);break}}static addTickSprite(e,t,n,s,r,o){const a=document.createElement("canvas");a.width=128,a.height=64;const l=a.getContext("2d");l.font="bold 26px Orbitron, monospace",l.textAlign="center",l.textBaseline="middle",l.fillStyle=s==="x"?"rgba(255,120,100,0.85)":s==="z"?"rgba(100,180,255,0.85)":"rgba(220,230,255,0.7)",l.fillText(t,64,32);const c=new yo(a);o.push(c);const u=new So({map:c,depthTest:!1,transparent:!0}),h=new eo(u);h.position.copy(n);const d=r*.05;h.scale.set(d,d*.5,1),e.add(h)}static addGridTicks(e,t,n,s,r,o){for(let a=-n;a<=n;a+=t)a!==0&&(Wt.addTickSprite(e,String(a),new P(a,0,s),"x",r,o),Wt.addTickSprite(e,String(a),new P(s,0,a),"z",r,o));Wt.addTickSprite(e,"0",new P(s,0,s),"o",r,o)}}const vi={x:0,y:0,z:0};class Cc{constructor(e,t){pe(this,"el");pe(this,"canvasWrap");pe(this,"topBar");pe(this,"overlayEl");pe(this,"storageKey");pe(this,"scene",null);pe(this,"camera",null);pe(this,"renderer",null);pe(this,"controls",null);pe(this,"savedTarget",new P);pe(this,"rafId",0);pe(this,"ro");pe(this,"textures",[]);pe(this,"loop",()=>{this.rafId=requestAnimationFrame(this.loop);const e=this.canvasWrap.clientWidth,t=this.canvasWrap.clientHeight;if(e===0||t===0)return;const n=this.renderer.domElement;(n.width!==e||n.height!==t)&&(this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix()),this.controls.update(),this.renderer.render(this.scene,this.camera)});this.opts=t,this.storageKey=`bey_view_${t.title.toLowerCase().replace(/\s+/g,"_")}`,this.el=document.createElement("div"),this.el.className="screen sandbox-screen hidden",this.canvasWrap=document.createElement("div"),this.canvasWrap.className="sandbox-canvas-wrap",this.el.appendChild(this.canvasWrap);const n=document.createElement("div");n.className="sandbox-overlay",n.innerHTML=`
      <div class="sandbox-top-bar">
        <button class="game-btn back-btn"  id="sb-back">← Back</button>
        <span  class="sandbox-title">${t.title}</span>
        <button class="game-btn reset-btn" id="sb-reset" title="Reset camera view to default">↺ View</button>
      </div>
      <div class="sandbox-hint">Orbit · Left drag &nbsp;|&nbsp; Pan · Right drag &nbsp;|&nbsp; Zoom · Scroll</div>
    `,this.el.appendChild(n),e.appendChild(this.el),this.overlayEl=n,this.topBar=n.querySelector(".sandbox-top-bar"),n.querySelector("#sb-back").addEventListener("click",()=>t.onBack()),n.querySelector("#sb-reset").addEventListener("click",()=>this.resetView()),this.ro=new ResizeObserver(()=>this.resize())}addTopBarButton(e,t=""){const n=document.createElement("button");return n.className="game-btn",n.textContent=e,n.title=t,this.topBar.appendChild(n),n}addToScene(...e){e.forEach(t=>{var n;return(n=this.scene)==null?void 0:n.add(t)})}removeFromScene(...e){e.forEach(t=>{var n;return(n=this.scene)==null?void 0:n.remove(t)})}addOverlayPanel(e){const t=document.createElement("div");return t.className=e,this.overlayEl.appendChild(t),t}initScene(){if(this.scene)return;this.scene=new Ag;const{defaultCam:e,camFar:t}=this.opts;this.camera=new Ot(55,1,.1,t),this.camera.position.set(e.x,e.y,e.z),this.camera.lookAt(0,0,0),this.buildScene()}mountRenderer(){this.renderer=new Tg({antialias:!0,stencil:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(526351),this.canvasWrap.appendChild(this.renderer.domElement),this.controls=new __(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.screenSpacePanning=!0,this.controls.minDistance=this.opts.minZoom,this.controls.maxDistance=this.opts.maxZoom,this.controls.mouseButtons={LEFT:cn.ROTATE,MIDDLE:cn.DOLLY,RIGHT:cn.PAN},this.controls.touches={ONE:Sn.ROTATE,TWO:Sn.DOLLY_PAN},this.loadView()}unmountRenderer(){this.saveView(),this.controls&&(this.savedTarget.copy(this.controls.target),this.controls.dispose(),this.controls=null),this.renderer&&(this.renderer.domElement.remove(),this.renderer.dispose(),this.renderer=null)}saveView(){if(!this.camera||!this.controls)return;const e={camX:this.camera.position.x,camY:this.camera.position.y,camZ:this.camera.position.z,tgtX:this.controls.target.x,tgtY:this.controls.target.y,tgtZ:this.controls.target.z};localStorage.setItem(this.storageKey,JSON.stringify(e))}loadView(){if(!(!this.camera||!this.controls))try{const e=localStorage.getItem(this.storageKey);if(!e)return;const t=JSON.parse(e);this.camera.position.set(t.camX,t.camY,t.camZ),this.controls.target.set(t.tgtX,t.tgtY,t.tgtZ),this.controls.update()}catch{}}resetView(){var t;localStorage.removeItem(this.storageKey);const{defaultCam:e}=this.opts;(t=this.camera)==null||t.position.set(e.x,e.y,e.z),this.controls&&(this.controls.target.set(vi.x,vi.y,vi.z),this.controls.update()),this.savedTarget.set(vi.x,vi.y,vi.z)}buildCustom(e){}buildScene(){const e=this.scene,{gridSize:t,gridDivs:n,tickEvery:s,tickRange:r,accentHex:o}=this.opts;e.add(new Pl(t,n,o,2763338));const a=new Pl(t,n,2763338,1710638);a.rotation.x=Math.PI/2,a.position.set(0,t/2,0),e.add(a);const l=t/2*.25,c=this.opts.axisYOffset??0,u=new Zi;u.position.set(0,c,0),u.add(new m_(l)),e.add(u);const h=t/2*.32;Wt.addAxisLabel(e,"X",new P(h,c+l*.1,0),"#ff4d4d",this.textures),Wt.addAxisLabel(e,"Y",new P(l*.1,c+h,0),"#4dff88",this.textures),Wt.addAxisLabel(e,"Z",new P(0,c+l*.1,h),"#4db8ff",this.textures);const d=t/2*.07;Wt.setLastSpriteScale(e,d),Wt.setLastSpriteScale(e,d),Wt.setLastSpriteScale(e,d);const p=Math.max(.1,t*.018);Wt.addGridTicks(e,s,r,p,t,this.textures);const g=Math.max(.1,t*.001);e.add(new ht(new No(g,12,12),new pr({color:o}))),e.add(new p_(16777215,.5));const _=new f_(16777215,1);_.position.set(t*.3,t*.5,t*.3),e.add(_);const m=t*.2,f=new Bo(o,2,m);f.position.set(0,t*.05,0),e.add(f),this.buildCustom(e)}resize(){if(!this.renderer||!this.camera)return;const e=this.canvasWrap.clientWidth,t=this.canvasWrap.clientHeight;e===0||t===0||(this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}setVisible(e){this.el.classList.toggle("hidden",!e),e?(this.initScene(),this.mountRenderer(),this.ro.observe(this.canvasWrap),this.rafId=requestAnimationFrame(this.loop)):(cancelAnimationFrame(this.rafId),this.ro.disconnect(),this.unmountRenderer())}dispose(){var e;cancelAnimationFrame(this.rafId),this.ro.disconnect(),this.unmountRenderer(),(e=this.scene)==null||e.traverse(t=>{const n=t;if(n.geometry&&n.geometry.dispose(),n.material){const s=Array.isArray(n.material)?n.material:[n.material];for(const r of s){for(const o of Object.values(r))o instanceof yt&&o.dispose();r.dispose()}}});for(const t of this.textures)t.dispose();this.textures.length=0,this.scene=null,this.camera=null,this.el.remove()}}function To(i,e="Leave",t="Stay"){return new Promise(n=>{const s=document.createElement("div");s.className="confirm-overlay",s.innerHTML=`
      <div class="confirm-dialog" role="dialog" aria-modal="true">
        <p class="confirm-msg">${i}</p>
        <div class="confirm-actions">
          <button class="game-btn btn-danger" id="c-ok">${e}</button>
          <button class="game-btn" id="c-cancel">${t}</button>
        </div>
      </div>
    `,document.body.appendChild(s);const r=a=>{s.remove(),window.removeEventListener("keydown",o),n(a)},o=a=>{a.key==="Enter"&&r(!0),a.key==="Escape"&&r(!1)};s.querySelector("#c-ok").addEventListener("click",()=>r(!0)),s.querySelector("#c-cancel").addEventListener("click",()=>r(!1)),s.addEventListener("click",a=>{a.target===s&&r(!1)}),window.addEventListener("keydown",o)})}let v_=0;function x_(){return v_++%255+1}const Tn=Math.PI*2,hn=100,Ge=Math.PI/180,Ke={radius:hn/Math.cos(Math.PI/8),height:30,sides:8,align:Math.PI/8},ar=new Map,lr=new Map;function zo(i){return i.surface==="custom_png"&&i.customTileData?`custom:${i.customTileData.slice(0,40)}:${i.tileScale}`:`${i.color}_${i.surface}`}function Pc(i){return`${zo(i)}:${i.transparent?"t":"o"}:${i.opacity??1}:${i.side??Ct}`}function Lc(i,e){const n=document.createElement("canvas");n.width=n.height=256;const s=n.getContext("2d"),r=i>>16&255,o=i>>8&255,a=i&255,l=`rgb(${r},${o},${a})`,c=`rgba(${Math.min(r+64,255)},${Math.min(o+64,255)},${Math.min(a+64,255)},0.55)`,u=`rgba(${Math.max(r-50,0)},${Math.max(o-50,0)},${Math.max(a-50,0)},0.60)`;switch(s.fillStyle=l,s.fillRect(0,0,256,256),e){case"checker":{s.fillStyle=c;for(let d=0;d<256;d+=32)for(let p=0;p<256;p+=32)(d/32+p/32)%2===0&&s.fillRect(d,p,32,32);break}case"grid":{s.strokeStyle=c,s.lineWidth=2;for(let h=0;h<=256;h+=32)s.beginPath(),s.moveTo(h,0),s.lineTo(h,256),s.stroke(),s.beginPath(),s.moveTo(0,h),s.lineTo(256,h),s.stroke();break}case"hex":{const d=28*Math.sqrt(3)/2;s.strokeStyle=c,s.lineWidth=2;for(let p=-1;p<256/d+1;p++)for(let g=-1;g<256/28+1;g++){const _=g*28*1.5+p%2*28*.75,m=p*d;s.beginPath();for(let f=0;f<6;f++){const M=(f*60-30)*Ge;f===0?s.moveTo(_+28/2*Math.cos(M),m+28/2*Math.sin(M)):s.lineTo(_+28/2*Math.cos(M),m+28/2*Math.sin(M))}s.closePath(),s.stroke()}break}case"stripes":{s.strokeStyle=c,s.lineWidth=10;for(let h=-256;h<256*2;h+=24)s.beginPath(),s.moveTo(h,0),s.lineTo(h+256,256),s.stroke();break}case"dots":{s.fillStyle=c;for(let h=16;h<256;h+=32)for(let d=16;d<256;d+=32)s.beginPath(),s.arc(h,d,6,0,Tn),s.fill();break}case"concrete":{s.fillStyle=c;for(let h=0;h<1800;h++){const d=Math.random()*256,p=Math.random()*256,g=Math.random()*5+1;s.fillRect(d,p,g,g*.4)}break}case"metal":{for(let h=0;h<256;h+=3)s.fillStyle=`rgba(255,255,255,${Math.random()*.15})`,s.fillRect(0,h,256,2);break}case"wood":{for(let h=8;h<256;h+=14)s.strokeStyle=u,s.lineWidth=3+h%3,s.beginPath(),s.arc(256/2,256/2,h,0,Tn),s.stroke();break}case"ice":{s.strokeStyle=c,s.lineWidth=1.5;const h=[[50,0,180,200],[200,30,60,220],[120,80,240,180],[0,120,160,256],[80,180,250,40]];for(const[d,p,g,_]of h)s.beginPath(),s.moveTo(d,p),s.lineTo((d+g)/2+(Math.random()-.5)*40,(p+_)/2+(Math.random()-.5)*40),s.lineTo(g,_),s.stroke();break}case"sand":{s.fillStyle=c;for(let h=0;h<3e3;h++){const d=Math.random()*256,p=Math.random()*256;s.fillRect(d,p,1.5,1.5)}break}case"lava_rock":{const h=[];for(let p=0;p<25;p++)h.push([Math.random()*256,Math.random()*256]);const d=s.getImageData(0,0,256,256);for(let p=0;p<256;p++)for(let g=0;g<256;g++){let _=1/0,m=0;for(let v=0;v<h.length;v++){const S=(g-h[v][0])**2+(p-h[v][1])**2;S<_&&(_=S,m=v)}const f=m%2===0?.85:1,M=(p*256+g)*4;d.data[M]=Math.round(r*f),d.data[M+1]=Math.round(o*f),d.data[M+2]=Math.round(a*f),d.data[M+3]=255}s.putImageData(d,0,0);break}}return n}function Rt(i){const e=Pc(i),t=lr.get(e);if(t)return t.refs++,t.mat;let n=null;if(i.surface!=="plain"){const a=zo(i),l=ar.get(a);if(l)l.refs++,n=l.tex;else{let c;if(i.surface==="custom_png"&&i.customTileData)c=new h_().load(i.customTileData);else{const u=Lc(i.color,i.surface);c=new yo(u)}c.wrapS=c.wrapT=js,c.repeat.set(20/i.tileScale,20/i.tileScale),ar.set(a,{tex:c,refs:1}),n=c}}const s=i.surface==="metal"?.25:i.surface==="ice"?.1:.65,r=i.surface==="metal"?.7:i.surface==="ice"?.1:.08,o=new o_({color:i.surface==="plain"?i.color:16777215,map:n??void 0,side:i.side??Ct,roughness:s,metalness:r,transparent:i.transparent??!1,opacity:i.opacity??1});return lr.set(e,{mat:o,refs:1}),o}function M_(i){const e=Pc(i),t=lr.get(e);if(t&&(t.refs--,t.refs<=0)){t.mat.dispose(),lr.delete(e);const n=zo(i),s=ar.get(n);s&&(s.refs--,s.refs<=0&&(s.tex.dispose(),ar.delete(n)))}}const Ic={water:{color:1736660,opacity:.65,emissive:17663,emissiveIntensity:.08,glowColor:3381759},lava:{color:16724736,opacity:.8,emissive:16720384,emissiveIntensity:.35,glowColor:16737792},swamp:{color:4021274,opacity:.75,emissive:2245632,emissiveIntensity:.05,glowColor:3364096},poison:{color:8913100,opacity:.7,emissive:6684842,emissiveIntensity:.15,glowColor:11141375},sand:{color:13936707,opacity:.85,emissive:0,emissiveIntensity:0,glowColor:null},ice:{color:11197951,opacity:.6,emissive:8965375,emissiveIntensity:.08,glowColor:11197951},void:{color:0,opacity:1,emissive:0,emissiveIntensity:0,glowColor:null},custom:{color:16777215,opacity:.7,emissive:0,emissiveIntensity:0,glowColor:null}},S_={water:"💧 Water",lava:"🔥 Lava",swamp:"🌿 Swamp",poison:"☠ Poison",sand:"🏜 Sand",ice:"❄ Ice",void:"🌑 Void",custom:"🎨 Custom"},Dc={water:{amplitude:.25,frequency:.1,speed:1.2,turbulence:.15},lava:{amplitude:.6,frequency:.04,speed:.2,turbulence:.8},swamp:{amplitude:.18,frequency:.05,speed:.25,turbulence:.5},poison:{amplitude:.35,frequency:.13,speed:1.6,turbulence:.65},sand:{amplitude:0,frequency:0,speed:0,turbulence:0},ice:{amplitude:0,frequency:0,speed:0,turbulence:0},void:{amplitude:0,frequency:0,speed:0,turbulence:0},custom:{amplitude:.2,frequency:.08,speed:.8,turbulence:.3}},y_=`
  uniform float uTime, uAmplitude, uFrequency, uSpeed, uTurbulence;
  varying float vHeight;
  void main() {
    vec3 pos = position;
    float h = 0.0;
    if (uAmplitude > 0.0) {
      float r = length(pos.xz);
      float w1 = sin(r * uFrequency * 1.5 - uTime * uSpeed);
      float w2 = sin(pos.x * uFrequency + uTime * uSpeed * 0.7 + 1.5708)
               * cos(pos.z * uFrequency * 0.8 - uTime * uSpeed * 0.9);
      float w3 = sin(pos.x * uFrequency * 2.7 + pos.z * uFrequency * 2.0 + uTime * uSpeed * 2.1 + 0.785)
               * cos(pos.x * uFrequency * 1.8 - pos.z * uFrequency * 2.5 - uTime * uSpeed * 1.6 + 3.14);
      h = w1 * 0.45 + w2 * 0.35 + w3 * uTurbulence * 0.20;
      pos.y += uAmplitude * h;
    }
    vHeight = h;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`,E_=`
  uniform vec3 uColor; uniform float uOpacity; uniform vec3 uEmissive; uniform float uEmissiveIntensity;
  varying float vHeight;
  void main() {
    float bright = 1.0 + vHeight * 0.22;
    vec3 col = uColor * bright + uEmissive * uEmissiveIntensity * (1.0 + vHeight * 0.4);
    gl_FragColor = vec4(clamp(col, 0.0, 2.0), uOpacity);
  }
`;function Ji(i,e,t){for(const n of t){const s=i-n.cx,r=e-n.cz,o=Math.cos(-n.rotY),a=Math.sin(-n.rotY),l=s*o-r*a,c=s*a+r*o;if((l/n.rx)**2+(c/n.rz)**2<=1.08)return!0}return!1}function mt(i){const{radiusX:e,radiusZ:t,openingShape:n,sides:s,starInner:r}=i,o=[];switch(n){case"circle":case"ellipse":{for(let l=0;l<96;l++){const c=l/96*Tn;o.push(new J(e*Math.cos(c),t*Math.sin(c)))}break}case"rectangle":o.push(new J(e,t),new J(-e,t),new J(-e,-t),new J(e,-t));break;case"hexagon":for(let a=0;a<6;a++){const l=a/6*Tn+Math.PI/6;o.push(new J(e*Math.cos(l),t*Math.sin(l)))}break;case"triangle":for(let a=0;a<3;a++){const l=a/3*Tn-Math.PI/2;o.push(new J(e*Math.cos(l),t*Math.sin(l)))}break;case"star":{const a=Math.max(3,Math.min(12,Math.round(s))),l=Math.max(.1,Math.min(.95,r));for(let c=0;c<a*2;c++){const u=c/(a*2)*Tn-Math.PI/2,h=c%2===0?1:l;o.push(new J(e*h*Math.cos(u),t*h*Math.sin(u)))}break}}return o}function Uc(i,e){if(i.length===e)return i;const t=i.length,n=[0];for(let o=0;o<t;o++){const a=i[o],l=i[(o+1)%t];n.push(n[o]+Math.hypot(l.x-a.x,l.y-a.y))}const s=n[t],r=[];for(let o=0;o<e;o++){const a=o/e*s;let l=0;for(let p=0;p<t;p++)if(n[p+1]>=a){l=p;break}const c=n[l+1]-n[l],u=c>0?(a-n[l])/c:0,h=i[l],d=i[(l+1)%t];r.push(new J(h.x+(d.x-h.x)*u,h.y+(d.y-h.y)*u))}return r}function vr(i,e){const t=Ke.height+i.posY;if(i.wallProfile==="straight")return t-i.depth;const n=Math.max(i.radiusX,i.radiusZ,.001),s=Math.min(e/n,1);return t-i.depth*(1-s*s)}function Nc(i,e,t){const n=Ke.height+i.posY;if(i.wallProfile==="straight")return n-i.depth;const s=Math.min(Math.sqrt((e/i.radiusX)**2+(t/i.radiusZ)**2),1);return n-i.depth*(1-s*s)}function Ul(i,e,t,n){const s=i.posR*Math.cos(i.posAngle*Ge),r=i.posR*Math.sin(i.posAngle*Ge),o=Nc(e,s,r),a=i.rotY*Ge,l=Math.cos(-a),c=Math.sin(-a),u=t-s,h=n-r,d=u*l-h*c,p=u*c+h*l;Math.max(i.radiusX,i.radiusZ,.001);const g=Math.min(Math.sqrt((d/i.radiusX)**2+(p/i.radiusZ)**2),1);return o-i.depth*(1-g*g)}function as(i,e,t,n,s,r,o,a=.02){const l=i.length,c=36,u=Math.cos(r),h=Math.sin(r);function d(f,M){return o(n+f*u-M*h,s+f*h+M*u)}const p=[],g=[],_=d(0,0);if(t==="parabolic"){p.push(0,_-e,0);for(let f=1;f<=c;f++){const M=f/c;for(let v=0;v<l;v++){const S=i[v].x*M,R=i[v].y*M,w=d(S,R);p.push(S,w-e*(1-M*M)+a*M*M,R)}}for(let f=0;f<l;f++)g.push(0,1+f,1+(f+1)%l);for(let f=1;f<c;f++){const M=1+(f-1)*l,v=1+f*l;for(let S=0;S<l;S++){const R=M+S,w=M+(S+1)%l,A=v+S,L=v+(S+1)%l;g.push(R,w,A,w,L,A)}}}else{const f=_-e,M=6;for(let R=0;R<l;R++)p.push(i[R].x,d(i[R].x,i[R].y)+a,i[R].y);for(let R=1;R<=M;R++){const w=R/M;for(let A=0;A<l;A++){const L=d(i[A].x,i[A].y);p.push(i[A].x,L+a-(L+a-f)*w,i[A].y)}}const v=(M+1)*l;p.push(0,f,0);for(let R=0;R<M;R++){const w=R*l,A=(R+1)*l;for(let L=0;L<l;L++){const T=w+L,y=w+(L+1)%l,I=A+L,z=A+(L+1)%l;g.push(T,I,y,y,I,z)}}const S=M*l;for(let R=0;R<l;R++)g.push(v,S+(R+1)%l,S+R)}const m=new it;return m.setAttribute("position",new We(p,3)),m.setIndex(g),m.computeVertexNormals(),m}function ls(i,e,t,n,s,r,o,a=.02){const l=i.length,c=Math.cos(r),u=Math.sin(r);function h(f,M){return o(n+f*c-M*u,s+f*u+M*c)}const d=[],g=h(0,0)-e;for(let f=0;f<l;f++){const M=i[f],v=i[(f+1)%l],S=h(M.x,M.y)+a,R=h(v.x,v.y)+a;d.push(M.x,S,M.y,v.x,R,v.y)}const _=Math.max(1,Math.floor(l/8));for(let f=0;f<l;f+=_){const M=i[f],v=h(M.x,M.y)+a;if(t==="parabolic")for(let S=0;S<12;S++){const R=S/12,w=(S+1)/12,A=h(M.x*R,M.y*R),L=h(M.x*w,M.y*w),T=R===0?g:A-e*(1-R*R)+a*R*R,y=w===1?v:L-e*(1-w*w)+a*w*w;d.push(M.x*R,T,M.y*R,M.x*w,y,M.y*w)}else d.push(M.x,v,M.y,M.x,g,M.y)}const m=new it;return m.setAttribute("position",new We(d,3)),m}function ko(i,e,t=Ke.height,n=[]){const s=i.length,r=n.length>0?128:64,o=[],a=[];o.push(0,t-e,0);for(let u=1;u<=r;u++){const h=u/r,d=t-e*(1-h*h);for(let p=0;p<s;p++)o.push(i[p].x*h,d,i[p].y*h)}const l=n.length>0;for(let u=0;u<s;u++){const h=1+u,d=1+(u+1)%s;if(l){const p=(o[0]+o[h*3]+o[d*3])/3,g=(o[2]+o[h*3+2]+o[d*3+2])/3;if(Ji(p,g,n))continue}a.push(0,1+(u+1)%s,1+u)}for(let u=1;u<r;u++){const h=1+(u-1)*s,d=1+u*s;for(let p=0;p<s;p++){const g=h+p,_=h+(p+1)%s,m=d+p,f=d+(p+1)%s;if(l){const M=(o[g*3]+o[_*3]+o[m*3]+o[f*3])/4,v=(o[g*3+2]+o[_*3+2]+o[m*3+2]+o[f*3+2])/4;if(Ji(M,v,n))continue}a.push(g,_,m,_,f,m)}}const c=new it;return c.setAttribute("position",new We(o,3)),c.setIndex(a),c.computeVertexNormals(),c}function Oc(i,e,t=Ke.height){const n=i.length,s=[],r=[];for(const a of i)s.push(a.x,t,a.y);for(const a of i)s.push(a.x,t-e,a.y);s.push(0,t-e,0);for(let a=0;a<n;a++){const l=a,c=(a+1)%n,u=n+a,h=n+(a+1)%n;r.push(l,c,u,c,h,u)}for(let a=0;a<n;a++)r.push(2*n,n+(a+1)%n,n+a);const o=new it;return o.setAttribute("position",new We(s,3)),o.setIndex(r),o.computeVertexNormals(),o}function Fc(i,e,t,n=Ke.height){const s=i.length,r=[];for(let a=0;a<s;a++){const l=i[a],c=i[(a+1)%s];r.push(l.x,n,l.y,c.x,n,c.y)}if(t==="straight"){for(let l=0;l<s;l++){const c=i[l],u=i[(l+1)%s];r.push(c.x,n-e,c.y,u.x,n-e,u.y)}const a=Math.max(1,Math.floor(s/8));for(let l=0;l<s;l+=a)r.push(i[l].x,n,i[l].y,i[l].x,n-e,i[l].y)}const o=new it;return o.setAttribute("position",new We(r,3)),o}function Ni(i,e,t,n,s,r,o=Ke.height){const a=i.length,l=Uc(e,a),c=20,u=o-t,h=t+r,d=i.map((v,S)=>new J((v.x+l[S].x)/2,(v.y+l[S].y)/2)),p=[],g=n==="parabolic"?d:i;for(let v=0;v<=c;v++){const S=v/c,R=1-S,w=n==="parabolic"?o-t*(1-R*R):o-t*S,A=[];for(let L=0;L<a;L++)A.push([i[L].x*(1-S)+g[L].x*S,w,i[L].y*(1-S)+g[L].y*S]);p.push(A)}if(n==="straight"||s==="straight"){const v=s==="parabolic"?d:l,S=8;for(let w=1;w<=S;w++){const A=w/S,L=[];for(let T=0;T<a;T++)L.push([g[T].x*(1-A)+v[T].x*A,u,g[T].y*(1-A)+v[T].y*A]);p.push(L)}const R=s==="parabolic"?d:l;for(let w=1;w<=c;w++){const A=w/c,L=s==="parabolic"?u+h*A*A:u+h*A,T=[];for(let y=0;y<a;y++)T.push([R[y].x*(1-A)+l[y].x*A,L,R[y].y*(1-A)+l[y].y*A]);p.push(T)}}else for(let v=1;v<=c;v++){const S=v/c,R=u+h*S*S,w=[];for(let A=0;A<a;A++)w.push([d[A].x*(1-S)+l[A].x*S,R,d[A].y*(1-S)+l[A].y*S]);p.push(w)}const _=[];for(const v of p)for(const S of v)_.push(S[0],S[1],S[2]);const m=[],f=p.length;for(let v=0;v<f-1;v++){const S=v*a,R=(v+1)*a;for(let w=0;w<a;w++){const A=S+w,L=S+(w+1)%a,T=R+w,y=R+(w+1)%a;m.push(A,L,T,L,y,T)}}const M=new it;return M.setAttribute("position",new We(_,3)),M.setIndex(m),M.computeVertexNormals(),M}function Oi(i,e,t,n,s=Ke.height){const r=i.length,o=Uc(e,r),a=[],l=s+n,c=Math.max(1,Math.floor(r/8));for(let h=0;h<r;h++){const d=i[h],p=i[(h+1)%r];a.push(d.x,s,d.y,p.x,s,p.y),a.push(d.x,s-t,d.y,p.x,s-t,p.y),h%c===0&&a.push(d.x,s,d.y,d.x,s-t,d.y)}for(let h=0;h<r;h++){const d=o[h],p=o[(h+1)%r];a.push(d.x,l,d.y,p.x,l,p.y),a.push(d.x,s-t,d.y,p.x,s-t,p.y),h%c===0&&a.push(d.x,l,d.y,d.x,s-t,d.y)}const u=new it;return u.setAttribute("position",new We(a,3)),u}function Ho(i,e,t,n=Ke.height,s=[]){const r=i.length,o=n-e,a=[],l=[];let c=0;if(t==="parabolic"){const _=s.length>0?128:48;a.push(0,o,0);for(let m=1;m<=_;m++){const f=m/_,M=n-e*(1-f*f);for(let v=0;v<r;v++)a.push(i[v].x*f,M,i[v].y*f)}for(let m=0;m<r;m++){const f=1+m,M=1+(m+1)%r;if(s.length>0){const v=(a[0]+a[f*3]+a[M*3])/3,S=(a[2]+a[f*3+2]+a[M*3+2])/3;if(Ji(v,S,s))continue}l.push(c+0,c+M,c+f)}for(let m=1;m<_;m++){const f=c+1+(m-1)*r,M=c+1+m*r;for(let v=0;v<r;v++){const S=f+v,R=f+(v+1)%r,w=M+v,A=M+(v+1)%r;if(s.length>0){const L=(a[S*3]+a[R*3]+a[w*3]+a[A*3])/4,T=(a[S*3+2]+a[R*3+2]+a[w*3+2]+a[A*3+2])/4;if(Ji(L,T,s))continue}l.push(S,R,w,R,A,w)}}c+=1+_*r}else{const _=c;for(const M of i)a.push(M.x,n,M.y);const m=_+r;for(const M of i)a.push(M.x,o,M.y);for(let M=0;M<r;M++){const v=_+M,S=_+(M+1)%r,R=m+M,w=m+(M+1)%r;l.push(v,S,R,S,w,R)}const f=m+r;a.push(0,o,0);for(let M=0;M<r;M++)s.length>0&&Ji((i[M].x+i[(M+1)%r].x)/3,(i[M].y+i[(M+1)%r].y)/3,s)||l.push(f,m+M,m+(M+1)%r);c=f+1}const u=c;for(const _ of i)a.push(_.x,n,_.y);const h=u+r;for(const _ of i)a.push(_.x,o,_.y);for(let _=0;_<r;_++){const m=u+_,f=u+(_+1)%r,M=h+_,v=h+(_+1)%r;l.push(m,M,f,f,M,v)}c=h+r;const d=c;a.push(0,o,0);const p=d+1;for(const _ of i)a.push(_.x,o,_.y);for(let _=0;_<r;_++)l.push(d,p+_,p+(_+1)%r);const g=new it;return g.setAttribute("position",new We(a,3)),g.setIndex(l),g.computeVertexNormals(),g}function Bc(i,e,t=Ke.height){const n=i.length,s=t-e,r=[];for(let l=0;l<n;l++){const c=i[l],u=i[(l+1)%n];r.push(c.x,t,c.y,u.x,t,u.y),r.push(c.x,s,c.y,u.x,s,u.y)}const o=Math.max(1,Math.floor(n/8));for(let l=0;l<n;l+=o)r.push(i[l].x,t,i[l].y,i[l].x,s,i[l].y);const a=new it;return a.setAttribute("position",new We(r,3)),a}function Nl(i,e,t,n,s){const r=[];for(let l=0;l<i;l++){const c=l/i*Tn+t;r.push(new J(e*Math.cos(c),e*Math.sin(c)))}const o=new os(r);for(const l of s){if(l.posY>.5)continue;const c=Math.max(l.radiusX,l.radiusZ);if(s.some(_=>{if(_===l||_.posY>.5||Math.max(_.radiusX,_.radiusZ)<=c)return!1;const m=l.posX-_.posX,f=l.posZ-_.posZ,M=Math.cos(-_.rotY),v=Math.sin(-_.rotY),S=m*M-f*v,R=m*v+f*M;return(S/_.radiusX)**2+(R/_.radiusZ)**2<=1}))continue;const h=mt(l),d=Math.cos(l.rotY),p=Math.sin(l.rotY),g=h.map(_=>new J(_.x*d-_.y*p+l.posX,_.x*p+_.y*d+l.posZ)).reverse();o.holes.push(new Ii(g))}const a=new Ui(o);return a.rotateX(Math.PI/2),a.translate(0,n,0),a}function Ol(i,e,t){const n=Ke.height-i.depth,s=Math.cos(i.rotY),r=Math.sin(i.rotY),o=mt(i).map(c=>new J(c.x*s-c.y*r,c.x*r+c.y*s)),a=new os(o);for(const c of[...e,...t]){const u=c.posR*Math.cos(c.posAngle*Ge),h=c.posR*Math.sin(c.posAngle*Ge),d=u*s-h*r,p=u*r+h*s,g=Math.cos(c.rotY*Ge),_=Math.sin(c.rotY*Ge),m=mt(c).map(f=>new J(f.x*g-f.y*_+d,f.x*_+f.y*g+p)).reverse();a.holes.push(new Ii(m))}const l=new Ui(a);return l.rotateX(Math.PI/2),l.translate(0,n,0),l}function Fl(i,e=[]){const t=Ke.height+i.innerRimOffset,n=mt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner}),s=new os(n);for(const o of e){const a=new Ii;a.absellipse(o.cx,o.cz,o.rx,o.rz,0,Tn,!1,0),s.holes.push(a)}const r=new Ui(s);return r.rotateX(Math.PI/2),r.translate(0,t,0),r}function cr(i){const e=mt(i),t=new os(e.map(s=>new J(s.x,s.y)));if(i.isMoat){const s=mt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});t.holes.push(new Ii(s.map(r=>new J(r.x,r.y))))}const n=new Ui(t,32);return n.rotateX(Math.PI/2),n}function zc(i,e,t=0){return new dn({uniforms:{uTime:{value:0},uAmplitude:{value:e.amplitude},uFrequency:{value:e.frequency},uSpeed:{value:e.speed},uTurbulence:{value:e.turbulence},uColor:{value:new Me(i.color)},uOpacity:{value:i.opacity},uEmissive:{value:new Me(i.emissive)},uEmissiveIntensity:{value:i.emissiveIntensity}},vertexShader:y_,fragmentShader:E_,transparent:!0,side:Ct,depthWrite:!1,stencilWrite:!1,stencilRef:t,stencilFunc:t>0?Yh:nr})}function cs(i,e){const t=e.posR*Math.cos(e.posAngle*Ge),n=e.posR*Math.sin(e.posAngle*Ge),s=Math.cos(i.rotY),r=Math.sin(i.rotY);return{wx:i.posX+t*s-n*r,wz:i.posZ+t*r+n*s,wRotY:i.rotY+e.rotY*Ge}}function hs(i,e,t,n){if(i.parentPitId){const s=t.get(i.parentPitId);if(s)return(r,o)=>Ul(s,e,r,o)}if(i.parentZoneId){const s=n.get(i.parentZoneId);if(s)return(r,o)=>Ul(s,e,r,o)}return(s,r)=>Nc(e,s,r)}function kc(i){if(i.fill==="custom")return{color:i.fillColor??16777215,opacity:i.fillOpacity,emissive:0,emissiveIntensity:0,glowColor:null};const e=Ic[i.fill];return{color:e.color,opacity:e.opacity,emissive:e.emissive,emissiveIntensity:e.emissiveIntensity,glowColor:e.glowColor}}function Bl(i,e=[]){const t=mt(i),n=Rt({color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale});let s,r;const o=Ke.height;if(i.isMoat){const u=mt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});s=Ni(t,u,i.depth,i.wallProfile,i.innerWallProfile,i.innerRimOffset,o),r=Oi(t,u,i.depth,i.innerRimOffset,o)}else i.posY>.5?(s=Ho(t,i.depth,i.wallProfile,o,e),r=Bc(t,i.depth,o)):(s=i.wallProfile==="parabolic"?ko(t,i.depth,o,e):Oc(t,i.depth,o),r=Fc(t,i.depth,i.wallProfile,o));const a=new ht(s,n);a.position.set(i.posX,i.posY,i.posZ),a.rotation.y=i.rotY;const l=new Me(i.color).lerp(new Me(16777215),.5),c=new Zn(r,new Cn({color:l}));return c.position.set(i.posX,i.posY,i.posZ),c.rotation.y=i.rotY,[a,c]}function co(i,e=[]){const t=mt(i);i.mesh.geometry.dispose(),i.edges.geometry.dispose();const n=Ke.height;if(i.isMoat){const s=mt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});i.mesh.geometry=Ni(t,s,i.depth,i.wallProfile,i.innerWallProfile,i.innerRimOffset,n),i.edges.geometry=Oi(t,s,i.depth,i.innerRimOffset,n)}else i.posY>.5?(i.mesh.geometry=Ho(t,i.depth,i.wallProfile,n,e),i.edges.geometry=Bc(t,i.depth,n)):(i.mesh.geometry=i.wallProfile==="parabolic"?ko(t,i.depth,n,e):Oc(t,i.depth,n),i.edges.geometry=Fc(t,i.depth,i.wallProfile,n));for(const s of[i.mesh,i.edges])s.position.set(i.posX,i.posY,i.posZ),s.rotation.y=i.rotY}function zl(i){const e={color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale};M_(e);const t=Rt(e);i.mesh.material=t;const n=new Me(i.color).lerp(new Me(16777215),.5);i.edges.material.color.copy(n)}function kl(i,e,t,n){const s=mt(i),r=Rt({color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale,side:i.isMoat?Ct:Jt}),o=i.posR*Math.cos(i.posAngle*Ge),a=i.posR*Math.sin(i.posAngle*Ge),l=i.rotY*Ge,c=hs(i,e,t,n);let u,h;if(i.isMoat){const M=vr(e,i.posR),v=mt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});u=Ni(s,v,i.depth,i.wallProfile,i.innerWallProfile,i.innerRimOffset,M),h=Oi(s,v,i.depth,i.innerRimOffset,M)}else u=as(s,i.depth,i.wallProfile,o,a,l,c),h=ls(s,i.depth,i.wallProfile,o,a,l,c);const{wx:d,wz:p,wRotY:g}=cs(e,i),_=new ht(u,r);_.position.set(d,0,p),_.rotation.y=g;const m=new Me(i.color).lerp(new Me(16777215),.5),f=new Zn(h,new Cn({color:m}));return f.position.set(d,0,p),f.rotation.y=g,[_,f]}function Zs(i,e,t,n){const s=mt(i),r=i.posR*Math.cos(i.posAngle*Ge),o=i.posR*Math.sin(i.posAngle*Ge),a=i.rotY*Ge,l=hs(i,e,t,n);if(i.mesh.geometry.dispose(),i.edges.geometry.dispose(),i.isMoat){const d=vr(e,i.posR),p=mt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});i.mesh.geometry=Ni(s,p,i.depth,i.wallProfile,i.innerWallProfile,i.innerRimOffset,d),i.edges.geometry=Oi(s,p,i.depth,i.innerRimOffset,d)}else i.mesh.geometry=as(s,i.depth,i.wallProfile,r,o,a,l),i.edges.geometry=ls(s,i.depth,i.wallProfile,r,o,a,l);const{wx:c,wz:u,wRotY:h}=cs(e,i);for(const d of[i.mesh,i.edges])d.position.set(c,0,u),d.rotation.y=h}function ho(i,e,t,n){const s=mt(i),r=Rt({color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale,side:i.isMoat?Ct:Jt}),o=i.posR*Math.cos(i.posAngle*Ge),a=i.posR*Math.sin(i.posAngle*Ge),l=i.rotY*Ge,c=hs(i,e,t,n);let u,h;if(i.isMoat){const z=vr(e,i.posR),F=mt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});u=Ni(s,F,i.depth,"parabolic",i.innerWallProfile,i.innerRimOffset,z),h=Oi(s,F,i.depth,i.innerRimOffset,z)}else u=as(s,i.depth,"parabolic",o,a,l,c),h=ls(s,i.depth,"parabolic",o,a,l,c);const{wx:d,wz:p,wRotY:g}=cs(e,i),_=new ht(u,r);_.position.set(d,0,p),_.rotation.y=g;const m=new Me(i.color).lerp(new Me(16777215),.5),f=new Zn(h,new Cn({color:m}));f.position.set(d,0,p),f.rotation.y=g;const M=kc(i),v=c(o,a)-1,S=x_(),R=cr(i),w=new pr({colorWrite:!1,depthWrite:!1,depthTest:!1,side:Ct,stencilWrite:!0,stencilRef:S,stencilFunc:nr,stencilZPass:Xh}),A=new ht(R,w);A.renderOrder=-1,A.position.set(d,v,p),A.rotation.y=g;const L=cr(i),T=zc(M,Dc[i.fill],S),y=new ht(L,T);y.position.set(d,v,p),y.rotation.y=g,y.onBeforeRender=(z,F,Y,q,W)=>{W.uniforms.uTime.value=performance.now()/1e3};let I=null;return i.fillGlow&&M.glowColor!==null&&(I=new Bo(M.glowColor,2,e.radiusX*1.5),I.position.set(d,v+2,p)),[_,f,y,I,A]}function uo(i,e,t,n,s){const r=mt(i),o=i.posR*Math.cos(i.posAngle*Ge),a=i.posR*Math.sin(i.posAngle*Ge),l=i.rotY*Ge,{wx:c,wz:u,wRotY:h}=cs(e,i),d=hs(i,e,n,s),p=d(o,a)-1;if(i.mesh.geometry.dispose(),i.edges.geometry.dispose(),i.isMoat){const f=vr(e,i.posR),M=mt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});i.mesh.geometry=Ni(r,M,i.depth,"parabolic",i.innerWallProfile,i.innerRimOffset,f),i.edges.geometry=Oi(r,M,i.depth,i.innerRimOffset,f)}else i.mesh.geometry=as(r,i.depth,"parabolic",o,a,l,d),i.edges.geometry=ls(r,i.depth,"parabolic",o,a,l,d);for(const f of[i.mesh,i.edges])f.position.set(c,0,u),f.rotation.y=h;i.fillMesh.geometry.dispose(),i.fillMesh.geometry=cr(i),i.fillMesh.scale.set(1,1,1),i.fillMesh.position.set(c,p,u),i.fillMesh.rotation.y=h,i.maskMesh.geometry.dispose(),i.maskMesh.geometry=cr(i),i.maskMesh.position.set(c,p,u),i.maskMesh.rotation.y=h;const g=kc(i),_=i.maskMesh.material.stencilRef;i.fillMesh.material.dispose();const m=zc(g,Dc[i.fill],_);i.fillMesh.material=m,i.fillMesh.onBeforeRender=(f,M,v,S,R)=>{R.uniforms.uTime.value=performance.now()/1e3},i.fillLight&&(t==null||t.remove(i.fillLight),i.fillLight.dispose(),i.fillLight=null),i.fillGlow&&g.glowColor!==null&&(i.fillLight=new Bo(g.glowColor,2,e.radiusX*1.5),i.fillLight.position.set(c,p+2,u),t==null||t.add(i.fillLight))}function b_(i){return{name:i,openingShape:"circle",wallProfile:"parabolic",radiusX:50,radiusZ:50,depth:20,sides:5,starInner:.5,color:8947848,surface:"plain",customTileData:null,tileScale:20,posX:0,posZ:0,posY:0,rotY:0,isMoat:!1,innerRadiusX:25,innerRadiusZ:25,innerOpeningShape:"circle",innerSides:5,innerStarInner:.5,innerWallProfile:"parabolic",innerRimOffset:0,pitIds:[],zoneIds:[],mesh:null,edges:null,floorMesh:null,islandMesh:null}}function Hl(i,e,t,n=null,s=null){return{id:t,name:i,parentArenaId:e,parentPitId:n,parentZoneId:s,openingShape:"circle",wallProfile:"straight",radiusX:10,radiusZ:10,depth:8,sides:5,starInner:.5,color:5592405,surface:"plain",customTileData:null,tileScale:10,posR:0,posAngle:0,rotY:0,isMoat:!1,innerRadiusX:5,innerRadiusZ:5,innerOpeningShape:"circle",innerSides:5,innerStarInner:.5,innerWallProfile:"straight",innerRimOffset:0,pitIds:[],zoneIds:[],mesh:null,edges:null}}function Gl(i,e,t,n=null,s=null){return{id:t,name:i,parentArenaId:e,parentPitId:n,parentZoneId:s,openingShape:"circle",radiusX:15,radiusZ:15,depth:8,sides:5,starInner:.5,color:3368601,surface:"plain",customTileData:null,tileScale:10,fill:"water",fillColor:null,fillOpacity:.65,fillGlow:!0,posR:0,posAngle:0,rotY:0,isMoat:!1,innerRadiusX:8,innerRadiusZ:8,innerOpeningShape:"circle",innerSides:5,innerStarInner:.5,innerWallProfile:"parabolic",innerRimOffset:0,pitIds:[],zoneIds:[],mesh:null,edges:null,fillMesh:null,fillLight:null,maskMesh:null}}class T_{constructor(e){pe(this,"bodyEl");pe(this,"headerEl");pe(this,"nodes",new Map);pe(this,"sel",new Set);pe(this,"dragId",null);pe(this,"dropTarget",null);pe(this,"ctxMenu");pe(this,"idSeq",0);pe(this,"nodeActions",new Map);pe(this,"onDelete",()=>{});pe(this,"onGroup",()=>{});pe(this,"onCombine",()=>{});pe(this,"onReparent",()=>{});pe(this,"onSelect",()=>{});pe(this,"onVisibilityToggle",()=>{});this.container=e,e.innerHTML=`
      <div class="scene-tree-header"><span class="scene-tree-header-title">SCENE</span></div>
      <div class="scene-tree-body"></div>
    `,this.headerEl=e.querySelector(".scene-tree-header"),this.bodyEl=e.querySelector(".scene-tree-body"),this.ctxMenu=document.createElement("div"),this.ctxMenu.className="tree-ctx-menu hidden",document.body.appendChild(this.ctxMenu),document.addEventListener("pointerdown",t=>{this.ctxMenu.contains(t.target)||this.hideCtx()}),document.addEventListener("keydown",t=>{t.key==="Delete"&&this.deleteSelected(),t.key==="Escape"&&this.clearSel()})}get header(){return this.headerEl}add(e,t,n,s=null,r){const o=document.createElement("div");o.className="tree-node",o.dataset.id=e;const a=document.createElement("div");a.className="tree-node-row",a.draggable=!0,a.style.setProperty("--depth",String(this.depthOf(s)));const l=document.createElement("span");l.className="tree-caret";const c=document.createElement("span");c.className="tree-node-icon",c.textContent=n;const u=document.createElement("span");if(u.className="tree-node-label",u.textContent=t,a.appendChild(l),a.appendChild(c),a.appendChild(u),r!=null&&r.onAddChild){const g=document.createElement("button");g.className="tree-add-btn",g.textContent="+",g.title="Add arena",g.addEventListener("click",_=>{_.stopPropagation(),r.onAddChild()}),a.appendChild(g)}if(r!=null&&r.addChildButtons)for(const g of r.addChildButtons){const _=document.createElement("button");_.className=`tree-add-btn${g.className?" "+g.className:""}`,_.textContent=g.label,_.title=g.title,_.addEventListener("click",m=>{m.stopPropagation(),g.onClick()}),a.appendChild(_)}const h=document.createElement("button");h.className="tree-vis-btn",h.textContent="👁",h.title="Toggle visibility",h.tabIndex=-1,a.appendChild(h);const d=document.createElement("div");d.className="tree-children",o.appendChild(a),o.appendChild(d);const p={id:e,label:t,icon:n,parentId:s,childIds:[],expanded:!0,rowEl:a,childrenEl:d,nodeEl:o};if(this.nodes.set(e,p),s){const g=this.nodes.get(s);g&&(g.childIds.push(e),g.childrenEl.appendChild(o),this.refreshCaret(g))}else this.bodyEl.appendChild(o);this.wireRow(p,h)}remove(e){const t=this.nodes.get(e);if(t){if([...t.childIds].forEach(n=>this.remove(n)),t.parentId){const n=this.nodes.get(t.parentId);n&&(n.childIds=n.childIds.filter(s=>s!==e),this.refreshCaret(n))}t.nodeEl.remove(),this.nodes.delete(e),this.sel.delete(e),this.nodeActions.delete(e)}}setLabel(e,t){const n=this.nodes.get(e);if(!n)return;n.label=t;const s=n.rowEl.querySelector(".tree-node-label");s&&(s.textContent=t)}setNodeActions(e,t){this.nodeActions.set(e,t)}select(e,t){var n,s;t||(this.sel.forEach(r=>{var o;return(o=this.nodes.get(r))==null?void 0:o.rowEl.classList.remove("tree-node--selected")}),this.sel.clear()),this.sel.has(e)&&t?(this.sel.delete(e),(n=this.nodes.get(e))==null||n.rowEl.classList.remove("tree-node--selected")):(this.sel.add(e),(s=this.nodes.get(e))==null||s.rowEl.classList.add("tree-node--selected")),this.onSelect([...this.sel])}clearSel(){this.sel.forEach(e=>{var t;return(t=this.nodes.get(e))==null?void 0:t.rowEl.classList.remove("tree-node--selected")}),this.sel.clear(),this.onSelect([])}showCtx(e,t,n){this.sel.has(n)||this.select(n,!1);const s=[...this.sel],r=this.nodeActions.get(n)??[],o=[{label:"Delete",action:()=>this.deleteSelected()},{label:"Group",action:()=>this.groupSelected(),disabled:s.length<1},{label:"Combine",action:()=>this.combineSelected(),disabled:s.length<2}];this.ctxMenu.innerHTML="";const a=c=>c.forEach(u=>{const h=document.createElement("button");h.className="tree-ctx-item",h.textContent=u.label,u.disabled&&(h.disabled=!0),h.addEventListener("click",()=>{u.action(),this.hideCtx()}),this.ctxMenu.appendChild(h)});if(a(r),r.length){const c=document.createElement("div");c.className="tree-ctx-sep",this.ctxMenu.appendChild(c)}a(o),this.ctxMenu.classList.remove("hidden");const l=this.ctxMenu.getBoundingClientRect();this.ctxMenu.style.left=`${Math.min(e,window.innerWidth-l.width-8)}px`,this.ctxMenu.style.top=`${Math.min(t,window.innerHeight-l.height-8)}px`}hideCtx(){this.ctxMenu.classList.add("hidden")}deleteSelected(){const e=[...this.sel];e.length&&(e.forEach(t=>this.remove(t)),this.onDelete(e))}groupSelected(){const e=[...this.sel];if(!e.length)return;const t=`group-${++this.idSeq}`;this.add(t,"Group","▣",this.nodes.get(e[0]).parentId??null),e.forEach(n=>this.reparentTo(n,t)),this.clearSel(),this.select(t,!1),this.onGroup(t,e)}combineSelected(){const e=[...this.sel];e.length<2||this.onCombine(e)}refreshCaret(e){const t=e.rowEl.querySelector(".tree-caret");t&&(t.textContent=e.childIds.length===0?"":e.expanded?"▾":"▸")}toggleExpand(e){const t=this.nodes.get(e);!t||!t.childIds.length||(t.expanded=!t.expanded,t.childrenEl.classList.toggle("tree-children--collapsed",!t.expanded),this.refreshCaret(t))}wireRow(e,t){const{rowEl:n,id:s}=e;n.addEventListener("click",o=>{const a=o.target;a.classList.contains("tree-caret")?this.toggleExpand(s):!a.classList.contains("tree-vis-btn")&&!a.classList.contains("tree-add-btn")&&this.select(s,o.ctrlKey||o.metaKey)});let r=!0;t.addEventListener("click",o=>{o.stopPropagation(),r=!r,t.textContent=r?"👁":"🚫",t.classList.toggle("hidden-obj",!r),this.onVisibilityToggle(s,r),this.cascadeVisibility(s,r)}),n.addEventListener("contextmenu",o=>{o.preventDefault(),this.showCtx(o.clientX,o.clientY,s)}),n.addEventListener("dragstart",o=>{this.dragId=s,o.dataTransfer.effectAllowed="move",n.classList.add("tree-node--dragging")}),n.addEventListener("dragend",()=>{this.dragId=null,n.classList.remove("tree-node--dragging"),this.clearDrop()}),n.addEventListener("dragover",o=>{if(!this.dragId||this.dragId===s)return;o.preventDefault(),o.dataTransfer.dropEffect="move";const a=(o.clientY-n.getBoundingClientRect().top)/n.getBoundingClientRect().height,l=a<.28?"before":a>.72?"after":"inside";this.clearDrop(),this.dropTarget={id:s,pos:l},n.classList.add(`tree-drop-${l}`)}),n.addEventListener("dragleave",()=>this.clearDrop()),n.addEventListener("drop",o=>{if(o.preventDefault(),!this.dragId||!this.dropTarget||this.dropTarget.id!==s)return;const a=this.dragId,{pos:l}=this.dropTarget;if(this.clearDrop(),l==="inside")this.reparentTo(a,s);else{const c=this.nodes.get(s);this.reparentTo(a,c.parentId,l==="before"?s:null,l==="after"?s:null)}})}cascadeVisibility(e,t){const n=this.nodes.get(e);if(n)for(const s of n.childIds)this.onVisibilityToggle(s,t),this.cascadeVisibility(s,t)}reparentTo(e,t,n=null,s=null){var a,l,c;const r=this.nodes.get(e);if(!r)return;if(r.parentId){const u=this.nodes.get(r.parentId);u&&(u.childIds=u.childIds.filter(h=>h!==e),this.refreshCaret(u))}r.nodeEl.remove(),r.parentId=t,r.rowEl.style.setProperty("--depth",String(this.depthOf(t)));const o=t?(a=this.nodes.get(t))==null?void 0:a.childrenEl:this.bodyEl;if(o){if(n)o.insertBefore(r.nodeEl,((l=this.nodes.get(n))==null?void 0:l.nodeEl)??null);else if(s){const u=(c=this.nodes.get(s))==null?void 0:c.nodeEl;u?u.after(r.nodeEl):o.appendChild(r.nodeEl)}else o.appendChild(r.nodeEl);if(t){const u=this.nodes.get(t);u.childIds=[...u.childrenEl.children].map(h=>h.dataset.id??"").filter(Boolean),this.refreshCaret(u)}this.onReparent(e,t,n??s)}}clearDrop(){var e;this.dropTarget&&((e=this.nodes.get(this.dropTarget.id))==null||e.rowEl.classList.remove("tree-drop-before","tree-drop-inside","tree-drop-after"),this.dropTarget=null)}depthOf(e){if(!e)return 0;const t=this.nodes.get(e);return t?this.depthOf(t.parentId)+1:0}dispose(){this.ctxMenu.remove()}}const Vl={circle:"Circle",ellipse:"Ellipse",rectangle:"Rect",hexagon:"Hexagon",triangle:"Triangle",star:"Star"},Wl={circle:"●",ellipse:"◯",rectangle:"▭",hexagon:"⬡",triangle:"△",star:"★"},qs={plain:"Plain",checker:"Checker",grid:"Grid",hex:"Hex",stripes:"Stripes",dots:"Dots",concrete:"Concrete",metal:"Metal",wood:"Wood",ice:"Ice",sand:"Sand",lava_rock:"Lava",custom_png:"Custom"};class A_{constructor(e){pe(this,"content");pe(this,"onClose",()=>{});e.innerHTML=`
      <div class="prop-header">PROPERTIES<button class="prop-close-btn" title="Close panel">×</button></div>
      <div class="prop-content"></div>
    `,this.content=e.querySelector(".prop-content"),e.querySelector(".prop-close-btn").addEventListener("click",()=>this.onClose()),this.showEmpty()}showEmpty(){this.content.innerHTML='<div class="prop-empty">Select an item<br>to inspect</div>'}showBase(e,t,n,s){this.content.innerHTML="",this.section("OCTAGON BASE"),this.readRow("Flat-to-flat","200 cm"),this.numRow("Height",e.height,5,80,1,o=>{e.height=o,t()}),this.numRow("Sides",e.sides,3,16,1,o=>{e.sides=Math.round(o),t()}),this.section("SURFACE"),this.colorRow("Color",e.color,o=>{e.color=o,n(o)}),this.surfaceRow(e,s);const r=document.createElement("div");r.className="prop-hint",r.textContent="Click [+] on the base node to add an arena",this.content.appendChild(r)}showArena(e,t,n,s,r,o){this.content.innerHTML="",this.section("NAME");const a=document.createElement("input");a.type="text",a.className="prop-text-input",a.value=e.name,a.addEventListener("input",()=>{e.name=a.value,s(e.name)}),this.content.appendChild(a),this.section("OPENING SHAPE"),this.shapeGrid(e,n),e.openingShape==="star"&&(this.numRow("Points",e.sides,3,12,1,l=>{e.sides=Math.round(l),n()}),this.numRow("Inner frac",e.starInner,.1,.95,.05,l=>{e.starInner=l,t()})),this.section("MOAT"),this.toggleRow("Ring/Moat",e.isMoat,l=>{e.isMoat=l,n()}),e.isMoat&&(this.numRow("Inner R X",e.innerRadiusX,5,e.radiusX-5,1,l=>{e.innerRadiusX=l,t()}),this.numRow("Inner R Z",e.innerRadiusZ,5,e.radiusZ-5,1,l=>{e.innerRadiusZ=l,t()}),this.numRow("Inner Y offset",e.innerRimOffset,-e.depth+1,200,1,l=>{e.innerRimOffset=l,t()}),this.section("INNER SHAPE"),this.innerShapeGrid(e,n),this.section("OUTER WALL"),this.profileRow(e,"wallProfile",n),this.section("INNER WALL"),this.innerProfileRow(e,n)),e.isMoat||(this.section("WALL PROFILE"),this.profileRow(e,"wallProfile",n)),this.section("DIMENSIONS"),this.numRow("Radius X",e.radiusX,5,hn,1,l=>{e.radiusX=l,t()}),this.numRow("Radius Z",e.radiusZ,5,hn,1,l=>{e.radiusZ=l,t()}),this.numRow("Depth",e.depth,1,Ke.height,.5,l=>{e.depth=l,t()}),this.section("SURFACE"),this.colorRow("Color",e.color,l=>{e.color=l,r()}),this.surfaceRow(e,o),this.section("POSITION"),this.numRow("X",e.posX,-hn,hn,1,l=>{e.posX=l,t()}),this.numRow("Z",e.posZ,-hn,hn,1,l=>{e.posZ=l,t()}),this.numRow("Y (tower)",e.posY,0,200,1,l=>{e.posY=l,t()}),this.numRow("Rot Y °",xo.radToDeg(e.rotY),-180,180,1,l=>{e.rotY=xo.degToRad(l),t()})}showPit(e,t,n,s,r,o,a){this.content.innerHTML="",this.section("NAME");const l=document.createElement("input");l.type="text",l.className="prop-text-input",l.value=e.name,l.addEventListener("input",()=>{e.name=l.value,r(e.name)}),this.content.appendChild(l),this.section("OPENING SHAPE"),this.shapeGrid(e,s),e.openingShape==="star"&&(this.numRow("Points",e.sides,3,12,1,h=>{e.sides=Math.round(h),s()}),this.numRow("Inner frac",e.starInner,.1,.95,.05,h=>{e.starInner=h,n()})),this.section("MOAT"),this.toggleRow("Ring/Moat",e.isMoat,h=>{e.isMoat=h,s()}),e.isMoat&&(this.numRow("Inner R X",e.innerRadiusX,2,e.radiusX-2,1,h=>{e.innerRadiusX=h,n()}),this.numRow("Inner R Z",e.innerRadiusZ,2,e.radiusZ-2,1,h=>{e.innerRadiusZ=h,n()}),this.numRow("Inner Y offset",e.innerRimOffset,-(e.depth-1),100,1,h=>{e.innerRimOffset=h,n()}),this.section("INNER SHAPE"),this.innerShapeGrid(e,s),this.section("OUTER WALL"),this.profileRow(e,"wallProfile",s),this.section("INNER WALL"),this.innerProfileRow(e,s)),e.isMoat||(this.section("WALL PROFILE"),this.profileRow(e,"wallProfile",s)),this.section("DIMENSIONS");const c=Math.min(t.radiusX,t.radiusZ);this.numRow("Radius X",e.radiusX,2,Math.max(2,c-e.posR),1,h=>{e.radiusX=h,n()}),this.numRow("Radius Z",e.radiusZ,2,Math.max(2,c-e.posR),1,h=>{e.radiusZ=h,n()}),this.numRow("Depth",e.depth,1,t.depth,.5,h=>{e.depth=h,n()}),this.section("SURFACE"),this.colorRow("Color",e.color,h=>{e.color=h,o()}),this.surfaceRow(e,a),this.section("POSITION (arena-local)");const u=Math.max(e.radiusX,e.radiusZ);this.numRow("Dist (cm)",e.posR,0,Math.max(0,c-u),1,h=>{e.posR=h,n()}),this.numRow("Angle °",e.posAngle,0,360,1,h=>{e.posAngle=h,n()}),this.numRow("Rotate °",e.rotY,0,360,1,h=>{e.rotY=h,n()})}showZone(e,t,n,s,r,o){this.content.innerHTML="",this.section("NAME");const a=document.createElement("input");a.type="text",a.className="prop-text-input",a.value=e.name,a.addEventListener("input",()=>{e.name=a.value,r(e.name)}),this.content.appendChild(a),this.section("OPENING SHAPE"),this.shapeGrid(e,s),e.openingShape==="star"&&(this.numRow("Points",e.sides,3,12,1,h=>{e.sides=Math.round(h),s()}),this.numRow("Inner frac",e.starInner,.1,.95,.05,h=>{e.starInner=h,n()})),this.section("MOAT"),this.toggleRow("Ring/Moat",e.isMoat,h=>{e.isMoat=h,s()}),e.isMoat&&(this.numRow("Inner R X",e.innerRadiusX,2,e.radiusX-2,1,h=>{e.innerRadiusX=h,n()}),this.numRow("Inner R Z",e.innerRadiusZ,2,e.radiusZ-2,1,h=>{e.innerRadiusZ=h,n()}),this.numRow("Inner Y offset",e.innerRimOffset,-(e.depth-1),100,1,h=>{e.innerRimOffset=h,n()}),this.section("INNER SHAPE"),this.innerShapeGrid(e,s),this.section("INNER WALL"),this.innerProfileRow(e,s)),this.section("DIMENSIONS");const l=Math.min(t.radiusX,t.radiusZ),c=Math.min(15,t.depth);this.numRow("Radius X",e.radiusX,2,Math.max(2,l-e.posR),1,h=>{e.radiusX=h,n()}),this.numRow("Radius Z",e.radiusZ,2,Math.max(2,l-e.posR),1,h=>{e.radiusZ=h,n()}),this.numRow("Depth",e.depth,1,c,.5,h=>{e.depth=h,n()}),this.section("FILL"),this.fillGrid(e,n),this.section("BOWL SURFACE"),this.colorRow("Color",e.color,h=>{e.color=h,n()}),this.surfaceRow(e,o),this.section("POSITION (arena-local)");const u=Math.max(e.radiusX,e.radiusZ);this.numRow("Dist (cm)",e.posR,0,Math.max(0,l-u),1,h=>{e.posR=h,n()}),this.numRow("Angle °",e.posAngle,0,360,1,h=>{e.posAngle=h,n()}),this.numRow("Rotate °",e.rotY,0,360,1,h=>{e.rotY=h,n()})}shapeGrid(e,t){const n=document.createElement("div");n.className="prop-shape-grid",["circle","ellipse","rectangle","hexagon","triangle","star"].forEach(s=>{const r=document.createElement("button");r.className="prop-shape-btn"+(e.openingShape===s?" active":""),r.innerHTML=`<span class="prop-shape-icon">${Wl[s]}</span><span>${Vl[s]}</span>`,r.addEventListener("click",()=>{e.openingShape=s,t()}),n.appendChild(r)}),this.content.appendChild(n)}innerShapeGrid(e,t){const n=document.createElement("div");n.className="prop-shape-grid",["circle","ellipse","rectangle","hexagon","triangle","star"].forEach(s=>{const r=document.createElement("button");r.className="prop-shape-btn"+(e.innerOpeningShape===s?" active":""),r.innerHTML=`<span class="prop-shape-icon">${Wl[s]}</span><span>${Vl[s]}</span>`,r.addEventListener("click",()=>{e.innerOpeningShape=s,t()}),n.appendChild(r)}),this.content.appendChild(n),e.innerOpeningShape==="star"&&(this.numRow("Points",e.innerSides,3,12,1,s=>{e.innerSides=Math.round(s),t()}),this.numRow("Inner frac",e.innerStarInner,.1,.95,.05,s=>{e.innerStarInner=s,t()}))}profileRow(e,t,n){const s=document.createElement("div");s.className="prop-profile-row",["parabolic","straight"].forEach(r=>{const o=document.createElement("button");o.className="prop-profile-btn"+(e.wallProfile===r?" active":""),o.textContent=r==="parabolic"?"⌣ Bowl":"▮ Straight",o.addEventListener("click",()=>{e.wallProfile=r,n()}),s.appendChild(o)}),this.content.appendChild(s)}innerProfileRow(e,t){const n=document.createElement("div");n.className="prop-profile-row",["parabolic","straight"].forEach(s=>{const r=document.createElement("button");r.className="prop-profile-btn"+(e.innerWallProfile===s?" active":""),r.textContent=s==="parabolic"?"⌣ Bowl":"▮ Straight",r.addEventListener("click",()=>{e.innerWallProfile=s,t()}),n.appendChild(r)}),this.content.appendChild(n)}surfaceRow(e,t){const n=["plain","checker","grid","hex","stripes","dots","concrete","metal","wood","ice","sand","lava_rock","custom_png"],s=document.createElement("div");s.className="prop-surface-grid";const r=[];for(const o of n){const a=document.createElement("button");if(a.className="prop-surface-btn"+(e.surface===o?" active":""),a.title=qs[o],o!=="custom_png"){const l=document.createElement("canvas");l.className="prop-surface-preview",l.width=32,l.height=32,l.getContext("2d").drawImage(Lc(e.color,o),0,0,32,32),a.appendChild(l),a.appendChild(document.createTextNode(qs[o]))}else a.textContent="📁 "+qs[o];a.addEventListener("click",()=>{if(o==="custom_png"){this.openPngPicker(e,t,s);return}e.surface=o,r.forEach((l,c)=>l.classList.toggle("active",n[c]===o)),t()}),r.push(a),s.appendChild(a)}this.content.appendChild(s),e.surface==="custom_png"&&this.renderCustomTileRow(e,t)}openPngPicker(e,t,n){const s=document.createElement("input");s.type="file",s.accept="image/png,image/jpeg",s.addEventListener("change",()=>{var a;const r=(a=s.files)==null?void 0:a[0];if(!r)return;const o=new FileReader;o.onload=()=>{var l;e.customTileData=o.result,e.surface="custom_png",(l=this.content.querySelector(".prop-surface-custom-row"))==null||l.remove(),this.renderCustomTileRow(e,t);for(const c of n.querySelectorAll(".prop-surface-btn"))c.classList.toggle("active",c.title===qs.custom_png);t()},o.readAsDataURL(r)}),s.click()}renderCustomTileRow(e,t){const n=document.createElement("div");if(n.className="prop-surface-custom-row",e.customTileData){const a=document.createElement("img");a.className="prop-surface-thumb",a.src=e.customTileData,n.appendChild(a)}const s=document.createElement("span");s.className="prop-label",s.textContent="Tile scale";const r=document.createElement("input");r.type="number",r.className="prop-input",r.value=String(e.tileScale),r.min="1",r.max="200",r.step="1",r.addEventListener("input",()=>{e.tileScale=parseFloat(r.value)||20,t()});const o=document.createElement("button");o.className="game-btn",o.textContent="✕ Clear",o.addEventListener("click",()=>{e.customTileData=null,e.surface="plain",n.remove(),t()}),n.appendChild(s),n.appendChild(r),n.appendChild(o),this.content.appendChild(n)}fillGrid(e,t){const n=["water","lava","swamp","poison","sand","ice","void","custom"],s=document.createElement("div");s.className="prop-fill-grid";const r=[];for(const c of n){const u=document.createElement("button");u.className="prop-fill-btn"+(e.fill===c?" active":"");const h=document.createElement("span");h.className="prop-fill-swatch",h.style.background="#"+Ic[c].color.toString(16).padStart(6,"0"),u.appendChild(h),u.appendChild(document.createTextNode(S_[c])),u.addEventListener("click",()=>{e.fill=c,r.forEach((d,p)=>d.classList.toggle("active",n[p]===c)),this.updateFillCustomRow(e,t),t()}),r.push(u),s.appendChild(u)}this.content.appendChild(s);const o=document.createElement("div");o.className="prop-row";const a=document.createElement("span");a.className="prop-label",a.textContent="Glow light";const l=document.createElement("button");l.className="prop-profile-btn prop-fill-glow-toggle"+(e.fillGlow?" active":""),l.textContent=e.fillGlow?"✦ On":"◌ Off",l.addEventListener("click",()=>{e.fillGlow=!e.fillGlow,l.textContent=e.fillGlow?"✦ On":"◌ Off",l.classList.toggle("active",e.fillGlow),t()}),o.appendChild(a),o.appendChild(l),this.content.appendChild(o),this.numRow("Opacity",e.fillOpacity,.1,1,.05,c=>{e.fillOpacity=c,t()}),e.fill==="custom"&&this.buildFillCustomRow(e,t)}updateFillCustomRow(e,t){var n;(n=this.content.querySelector(".prop-fill-custom-row"))==null||n.remove(),e.fill==="custom"&&this.buildFillCustomRow(e,t)}buildFillCustomRow(e,t){const n=document.createElement("div");n.className="prop-fill-custom-row prop-row";const s=document.createElement("span");s.className="prop-label",s.textContent="Fill color";const r=document.createElement("input");r.type="color",r.className="prop-color-input",r.value="#"+(e.fillColor??16777215).toString(16).padStart(6,"0"),r.addEventListener("input",()=>{e.fillColor=parseInt(r.value.slice(1),16),t()}),n.appendChild(s),n.appendChild(r),this.content.appendChild(n)}toggleRow(e,t,n){const s=document.createElement("div");s.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=e;const o=document.createElement("button");o.className="prop-profile-btn"+(t?" active":""),o.textContent=t?"✦ On":"◌ Off",o.addEventListener("click",()=>{const a=!o.classList.contains("active");o.classList.toggle("active",a),o.textContent=a?"✦ On":"◌ Off",n(a)}),s.appendChild(r),s.appendChild(o),this.content.appendChild(s)}section(e){const t=document.createElement("div");t.className="prop-section-title",t.textContent=e,this.content.appendChild(t)}readRow(e,t){const n=document.createElement("div");n.className="prop-row",n.innerHTML=`<span class="prop-label">${e}</span><span class="prop-value-read">${t}</span>`,this.content.appendChild(n)}numRow(e,t,n,s,r,o){const a=document.createElement("div");a.className="prop-row";const l=document.createElement("span");l.className="prop-label",l.textContent=e;const c=document.createElement("input");c.className="prop-input",c.type="number",c.value=String(parseFloat(t.toFixed(2))),c.min=String(n),c.max=String(s),c.step=String(r),c.addEventListener("input",()=>o(parseFloat(c.value)||0)),a.appendChild(l),a.appendChild(c),this.content.appendChild(a)}colorRow(e,t,n){const s=document.createElement("div");s.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=e;const o=document.createElement("input");o.type="color",o.className="prop-color-input",o.value="#"+t.toString(16).padStart(6,"0"),o.addEventListener("input",()=>n(parseInt(o.value.slice(1),16))),s.appendChild(r),s.appendChild(o),this.content.appendChild(s)}}function Go(i,e,t){return{id:i.id,name:i.name,parentPitId:i.parentPitId,parentZoneId:i.parentZoneId,openingShape:i.openingShape,wallProfile:i.wallProfile,radiusX:i.radiusX,radiusZ:i.radiusZ,depth:i.depth,sides:i.sides,starInner:i.starInner,color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale,posR:i.posR,posAngle:i.posAngle,rotY:i.rotY,isMoat:i.isMoat,innerRadiusX:i.innerRadiusX,innerRadiusZ:i.innerRadiusZ,innerOpeningShape:i.innerOpeningShape,innerSides:i.innerSides,innerStarInner:i.innerStarInner,innerWallProfile:i.innerWallProfile,innerRimOffset:i.innerRimOffset,pits:i.pitIds.map(n=>{const s=e.get(n);return s?Go(s,e,t):null}).filter(Boolean),zones:i.zoneIds.map(n=>{const s=t.get(n);return s?Vo(s,e,t):null}).filter(Boolean)}}function Vo(i,e,t){return{id:i.id,name:i.name,parentPitId:i.parentPitId,parentZoneId:i.parentZoneId,openingShape:i.openingShape,radiusX:i.radiusX,radiusZ:i.radiusZ,depth:i.depth,sides:i.sides,starInner:i.starInner,color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale,fill:i.fill,fillColor:i.fillColor,fillOpacity:i.fillOpacity,fillGlow:i.fillGlow,posR:i.posR,posAngle:i.posAngle,rotY:i.rotY,isMoat:i.isMoat,innerRadiusX:i.innerRadiusX,innerRadiusZ:i.innerRadiusZ,innerOpeningShape:i.innerOpeningShape,innerSides:i.innerSides,innerStarInner:i.innerStarInner,innerWallProfile:i.innerWallProfile,innerRimOffset:i.innerRimOffset,pits:i.pitIds.map(n=>{const s=e.get(n);return s?Go(s,e,t):null}).filter(Boolean),zones:i.zoneIds.map(n=>{const s=t.get(n);return s?Vo(s,e,t):null}).filter(Boolean)}}function w_(i,e,t,n){return{id:i,name:e.name,openingShape:e.openingShape,wallProfile:e.wallProfile,radiusX:e.radiusX,radiusZ:e.radiusZ,depth:e.depth,sides:e.sides,starInner:e.starInner,color:e.color,surface:e.surface,customTileData:e.customTileData,tileScale:e.tileScale,posX:e.posX,posZ:e.posZ,posY:e.posY,rotY:e.rotY,isMoat:e.isMoat,innerRadiusX:e.innerRadiusX,innerRadiusZ:e.innerRadiusZ,innerOpeningShape:e.innerOpeningShape,innerSides:e.innerSides,innerStarInner:e.innerStarInner,innerWallProfile:e.innerWallProfile,innerRimOffset:e.innerRimOffset,pits:e.pitIds.filter(s=>{const r=t.get(s);return r&&!r.parentPitId&&!r.parentZoneId}).map(s=>Go(t.get(s),t,n)),zones:e.zoneIds.filter(s=>{const r=n.get(s);return r&&!r.parentPitId&&!r.parentZoneId}).map(s=>Vo(n.get(s),t,n))}}class R_ extends Cc{constructor(t,n){super(t,n);pe(this,"baseMesh",null);pe(this,"baseEdges",null);pe(this,"topFaceMesh",null);pe(this,"solidMode",!0);pe(this,"modeBtn");pe(this,"arenaStorageKey");pe(this,"baseConfig",{height:Ke.height,sides:Ke.sides,color:15260864,surface:"plain",customTileData:null,tileScale:20});pe(this,"sceneTree");pe(this,"sceneObjects",new Map);pe(this,"arenas",new Map);pe(this,"arenaSeq",0);pe(this,"pits",new Map);pe(this,"pitSeq",0);pe(this,"zones",new Map);pe(this,"zoneSeq",0);pe(this,"props");pe(this,"selectedId",null);pe(this,"undoStack",[]);pe(this,"redoStack",[]);pe(this,"_undoTimerId",0);pe(this,"_preChangeState",null);pe(this,"undoBtn");pe(this,"redoBtn");pe(this,"conflicts",new Set);pe(this,"CONFLICT_COLOR",16720384);this.arenaStorageKey=`bey_arena_${n.title.toLowerCase().replace(/\s+/g,"_")}`,this.modeBtn=this.addTopBarButton("● Solid","Toggle solid / mesh view"),this.modeBtn.addEventListener("click",()=>this.toggleMode());const s=this.addTopBarButton("Reset Arena","Reset arena configuration");s.className+=" reset-arena-btn",s.addEventListener("click",()=>{this.resetArena()}),this.undoBtn=this.addTopBarButton("↩ Undo","Undo (Ctrl+Z)"),this.undoBtn.addEventListener("click",()=>this.undo()),this.redoBtn=this.addTopBarButton("↪ Redo","Redo (Ctrl+Y)"),this.redoBtn.addEventListener("click",()=>this.redo());const r=this.addOverlayPanel("sandbox-left-panel");this.sceneTree=new T_(r);const o=document.createElement("button");o.className="tree-collapse-btn",o.textContent="◀",o.title="Collapse panel",this.sceneTree.header.appendChild(o),o.addEventListener("click",()=>{const l=r.classList.toggle("sandbox-left-panel--collapsed");o.textContent=l?"▶":"◀",o.title=l?"Expand panel":"Collapse panel"}),this.sceneTree.add("octagon-base","Octagon Base","⬡",null,{onAddChild:()=>this.addArena()});const a=this.addOverlayPanel("sandbox-right-panel");this.props=new A_(a),this.props.onClose=()=>{this.selectedId=null,this.sceneTree.clearSel(),this.props.showEmpty()},this.sceneTree.onSelect=l=>{this.selectedId=l.length===1?l[0]:null,this.renderProps()},this.sceneTree.onVisibilityToggle=(l,c)=>{(this.sceneObjects.get(l)??[]).forEach(u=>{u.visible=c})},this.sceneTree.onDelete=l=>{this.captureUndo();for(const c of l){const u=this.arenas.get(c);if(u){const d=[...u.pitIds],p=[...u.zoneIds];for(const _ of d)this.removePitFromScene(_);for(const _ of p)this.removeZoneFromScene(_);const g=this.sceneObjects.get(c);g&&(this.removeFromScene(...g),this.sceneObjects.delete(c)),this.disposeArena(u),this.arenas.delete(c),this.updateTopFace(),this.updateAllMoatIslandCaps();continue}if(this.pits.has(c)){const d=this.pits.get(c),p=this.arenas.get(d.parentArenaId);this.removePitFromScene(c),p&&(this.updateArenaFloor(p),this.updateArenaBowlHoles(p,d.parentArenaId));continue}if(this.zones.has(c)){const d=this.zones.get(c),p=this.arenas.get(d.parentArenaId);this.removeZoneFromScene(c),p&&(this.updateArenaFloor(p),this.updateArenaBowlHoles(p,d.parentArenaId));continue}const h=this.sceneObjects.get(c);h&&(this.removeFromScene(...h),this.sceneObjects.delete(c))}l.some(c=>c===this.selectedId)&&(this.selectedId=null,this.props.showEmpty()),this.saveArena(),this._flushUndoPending()},document.addEventListener("keydown",l=>{!l.ctrlKey&&!l.metaKey||(l.key==="z"||l.key==="Z"?(l.preventDefault(),l.shiftKey?this.redo():this.undo()):(l.key==="y"||l.key==="Y")&&(l.preventDefault(),this.redo()))}),this.updateUndoRedoUI()}serializeConfig(){const t={version:3,baseConfig:{...this.baseConfig},arenaSeq:this.arenaSeq,pitSeq:this.pitSeq,zoneSeq:this.zoneSeq,arenas:[...this.arenas.entries()].map(([n,s])=>w_(n,s,this.pits,this.zones))};return JSON.stringify(t)}captureUndo(){this._preChangeState||(this._preChangeState=this.serializeConfig()),clearTimeout(this._undoTimerId),this._undoTimerId=window.setTimeout(()=>this._flushUndoPending(),400)}_flushUndoPending(){if(clearTimeout(this._undoTimerId),!this._preChangeState)return;const t=this._preChangeState;this._preChangeState=null,this.serializeConfig()!==t&&(this.undoStack.push(t),this.undoStack.length>50&&this.undoStack.shift(),this.redoStack=[],this.updateUndoRedoUI())}undo(){if(this._flushUndoPending(),!this.undoStack.length)return;this.redoStack.push(this.serializeConfig());const t=JSON.parse(this.undoStack.pop());this._applyConfigToScene(t),this.saveArena(),this.updateUndoRedoUI()}redo(){if(this._flushUndoPending(),!this.redoStack.length)return;this.undoStack.push(this.serializeConfig());const t=JSON.parse(this.redoStack.pop());this._applyConfigToScene(t),this.saveArena(),this.updateUndoRedoUI()}updateUndoRedoUI(){this.undoBtn.disabled=this.undoStack.length===0,this.redoBtn.disabled=this.redoStack.length===0,this.undoBtn.style.opacity=this.undoStack.length===0?"0.4":"",this.redoBtn.style.opacity=this.redoStack.length===0?"0.4":""}_clearArenas(){for(const[t]of this.arenas.entries())this.sceneTree.remove(t);for(const t of this.pits.values())this.disposePit(t),this.removeFromScene(t.mesh,t.edges);for(const t of this.zones.values())this.disposeZone(t),this.removeFromScene(t.mesh,t.edges,t.fillMesh,t.maskMesh),t.fillLight&&this.removeFromScene(t.fillLight);for(const t of this.arenas.values())this.disposeArena(t),this.removeFromScene(t.mesh,t.edges);this.pits.clear(),this.zones.clear(),this.arenas.clear(),this.sceneObjects.clear(),this.arenaSeq=0,this.pitSeq=0,this.zoneSeq=0}_applyConfigToScene(t){this._clearArenas(),this.baseConfig={...this.baseConfig,...t.baseConfig},this.rebuildBase(),this.arenaSeq=t.arenaSeq,this.pitSeq=t.pitSeq,this.zoneSeq=t.zoneSeq,this._loadArenasFromConfig(t),this.selectedId=null,this.sceneTree.clearSel(),this.props.showEmpty()}disposeArena(t){t.mesh.geometry.dispose(),t.mesh.material.dispose(),t.edges.geometry.dispose(),t.edges.material.dispose(),t.floorMesh&&(t.floorMesh.geometry.dispose(),t.floorMesh.material.dispose(),this.removeFromScene(t.floorMesh)),t.islandMesh&&(t.islandMesh.geometry.dispose(),t.islandMesh.material.dispose(),this.removeFromScene(t.islandMesh))}disposePit(t){t.mesh.geometry.dispose(),t.mesh.material.dispose(),t.edges.geometry.dispose(),t.edges.material.dispose()}disposeZone(t){t.mesh.geometry.dispose(),t.mesh.material.dispose(),t.edges.geometry.dispose(),t.edges.material.dispose(),t.fillMesh.geometry.dispose(),t.fillMesh.material.dispose(),t.maskMesh.geometry.dispose(),t.maskMesh.material.dispose(),t.fillLight&&(this.removeFromScene(t.fillLight),t.fillLight.dispose())}buildCustom(t){Ke.height=this.baseConfig.height,Ke.sides=this.baseConfig.sides,Ke.radius=hn/Math.cos(Math.PI/this.baseConfig.sides),Ke.align=Math.PI/this.baseConfig.sides;const{radius:n,height:s,sides:r,align:o}=Ke,a=Rt({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.baseMesh=new ht(new Mi(n,n,s,r,1,!0),a),this.baseMesh.rotation.y=o,this.baseMesh.position.y=s/2,t.add(this.baseMesh);const l=new Mi(n,n,s,r,1,!1);this.baseEdges=new Zn(new Sl(l),new Cn({color:12101768})),this.baseEdges.rotation.y=o,this.baseEdges.position.y=s/2,t.add(this.baseEdges),l.dispose();const c=Rt({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.topFaceMesh=new ht(Nl(r,n,o,s,[]),c),t.add(this.topFaceMesh),this.sceneObjects.set("octagon-base",[this.baseMesh,this.baseEdges,this.topFaceMesh]),this.loadArena()}rebuildBase(){if(!this.baseMesh||!this.baseEdges||!this.topFaceMesh)return;Ke.height=this.baseConfig.height,Ke.sides=this.baseConfig.sides,Ke.radius=hn/Math.cos(Math.PI/this.baseConfig.sides),Ke.align=Math.PI/this.baseConfig.sides;const{radius:t,height:n,sides:s,align:r}=Ke;this.baseMesh.geometry.dispose(),this.baseMesh.geometry=new Mi(t,t,n,s,1,!0),this.baseMesh.rotation.y=r,this.baseMesh.position.y=n/2;const o=Rt({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.baseMesh.material.dispose(),this.baseMesh.material=o;const a=new Mi(t,t,n,s,1,!1);this.baseEdges.geometry.dispose(),this.baseEdges.geometry=new Sl(a),this.baseEdges.rotation.y=r,this.baseEdges.position.y=n/2,a.dispose();const l=Rt({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.topFaceMesh.material.dispose(),this.topFaceMesh.material=l;for(const c of this.arenas.values())c.depth>n&&(c.depth=n),co(c,this.getArenaHoles(c))}updateTopFace(){if(!this.topFaceMesh)return;const{radius:t,height:n,sides:s,align:r}=Ke,o=Nl(s,t,r,n,[...this.arenas.values()]);this.topFaceMesh.geometry.dispose(),this.topFaceMesh.geometry=o}getArenaHoles(t){if(t.isMoat||t.wallProfile!=="parabolic")return[];const n=[];for(const s of t.pitIds){const r=this.pits.get(s);r&&n.push({cx:r.posR*Math.cos(r.posAngle*Ge),cz:r.posR*Math.sin(r.posAngle*Ge),rx:r.radiusX,rz:r.radiusZ,rotY:r.rotY*Ge})}for(const s of t.zoneIds){const r=this.zones.get(s);r&&n.push({cx:r.posR*Math.cos(r.posAngle*Ge),cz:r.posR*Math.sin(r.posAngle*Ge),rx:r.radiusX,rz:r.radiusZ,rotY:r.rotY*Ge})}return n}updateArenaBowlHoles(t,n){if(t.isMoat)return;const s=t.posY>.5;if(!s&&t.wallProfile!=="parabolic")return;const r=this.getArenaHoles(t),o=mt(t);t.mesh.geometry.dispose(),s?t.mesh.geometry=Ho(o,t.depth,t.wallProfile,Ke.height,r):t.mesh.geometry=ko(o,t.depth,Ke.height,r)}updateArenaFloor(t){if(t.posY>.5||t.wallProfile!=="straight"||t.isMoat){t.floorMesh&&(this.removeFromScene(t.floorMesh),t.floorMesh.geometry.dispose(),t.floorMesh.material.dispose(),t.floorMesh=null);return}const n=t.pitIds.map(o=>this.pits.get(o)).filter(Boolean),s=t.zoneIds.map(o=>this.zones.get(o)).filter(Boolean),r=Ol(t,n,s);if(t.floorMesh)t.floorMesh.geometry.dispose(),t.floorMesh.geometry=r;else{const o=Rt({color:t.color,surface:t.surface,customTileData:t.customTileData,tileScale:t.tileScale});t.floorMesh=new ht(r,o),t.floorMesh.position.set(t.posX,t.posY,t.posZ),t.floorMesh.rotation.y=t.rotY,this.addToScene(t.floorMesh);const a=this.sceneObjects.get(this._arenaIdFor(t));a&&a.push(t.floorMesh)}}getArenasOnIsland(t){const n=[],s=Math.cos(-t.rotY),r=Math.sin(-t.rotY);for(const o of this.arenas.values()){if(o===t||Math.abs(o.posY-t.innerRimOffset)>1)continue;const a=o.posX-t.posX,l=o.posZ-t.posZ,c=a*s-l*r,u=a*r+l*s;(c/t.innerRadiusX)**2+(u/t.innerRadiusZ)**2<=1&&n.push({cx:c,cz:u,rx:o.radiusX,rz:o.radiusZ})}return n}updateIslandCap(t,n){if(!t.isMoat){t.islandMesh&&(this.removeFromScene(t.islandMesh),t.islandMesh.geometry.dispose(),t.islandMesh.material.dispose(),t.islandMesh=null);return}const s=Fl(t,this.getArenasOnIsland(t));if(t.islandMesh)t.islandMesh.geometry.dispose(),t.islandMesh.geometry=s,t.islandMesh.position.set(t.posX,t.posY,t.posZ),t.islandMesh.rotation.y=t.rotY;else{const r=Rt({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});t.islandMesh=new ht(s,r),t.islandMesh.position.set(t.posX,t.posY,t.posZ),t.islandMesh.rotation.y=t.rotY,this.addToScene(t.islandMesh);const o=this.sceneObjects.get(n);o&&o.push(t.islandMesh)}}updateAllMoatIslandCaps(){for(const[t,n]of this.arenas.entries())n.isMoat&&this.updateIslandCap(n,t)}_arenaIdFor(t){for(const[n,s]of this.arenas.entries())if(s===t)return n;return""}renderProps(){const t=this.selectedId;if(!t){this.props.showEmpty();return}if(t==="octagon-base"){this.props.showBase(this.baseConfig,()=>{this.captureUndo(),this.rebuildBase(),this.updateTopFace(),this.saveArena()},o=>{this.captureUndo(),this.baseConfig.color=o;const a=Rt({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.baseMesh.material.dispose(),this.baseMesh.material=a,this.topFaceMesh.material.dispose(),this.topFaceMesh.material=Rt({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale}),this.saveArena()},()=>{this.captureUndo(),this.rebuildBase(),this.updateTopFace(),this.saveArena()});return}const n=this.arenas.get(t);if(n){this.props.showArena(n,()=>{this.captureUndo(),co(n,this.getArenaHoles(n)),this.updateArenaFloor(n),this.updateIslandCap(n,t),this.updateAllMoatIslandCaps(),this.updateTopFace(),this.saveArena()},()=>{this.captureUndo(),co(n,this.getArenaHoles(n)),this.updateArenaFloor(n),this.updateIslandCap(n,t),this.updateAllMoatIslandCaps(),this.updateTopFace(),this.renderProps(),this.saveArena()},o=>{this.captureUndo(),this.sceneTree.setLabel(t,o),this.saveArena()},()=>{this.captureUndo(),zl(n),this.saveArena()},()=>{this.captureUndo(),zl(n),this.saveArena()});return}const s=this.pits.get(t);if(s){const o=this.arenas.get(s.parentArenaId);this.props.showPit(s,o,()=>{this.captureUndo(),Zs(s,o,this.pits,this.zones),this.updateArenaBowlHoles(o,s.parentArenaId),this.updateArenaFloor(o),this.checkSiblingConflicts(this.directParentId(s),this.directParentType(s)),this.saveArena()},()=>{this.captureUndo(),Zs(s,o,this.pits,this.zones),this.updateArenaBowlHoles(o,s.parentArenaId),this.updateArenaFloor(o),this.checkSiblingConflicts(this.directParentId(s),this.directParentType(s)),this.renderProps(),this.saveArena()},a=>{this.captureUndo(),this.sceneTree.setLabel(t,a),this.saveArena()},()=>{this.captureUndo();const a=new Me(s.color).lerp(new Me(16777215),.5);s.edges.material.color.copy(a),Zs(s,o,this.pits,this.zones),this.saveArena()},()=>{this.captureUndo(),Zs(s,o,this.pits,this.zones),this.saveArena()});return}const r=this.zones.get(t);if(r){const o=this.arenas.get(r.parentArenaId);this.props.showZone(r,o,()=>{this.captureUndo(),uo(r,o,this.getScene(),this.pits,this.zones),this.updateArenaBowlHoles(o,r.parentArenaId),this.updateArenaFloor(o),this.checkSiblingConflicts(this.directParentId(r),this.directParentType(r)),this.saveArena()},()=>{this.captureUndo(),uo(r,o,this.getScene(),this.pits,this.zones),this.updateArenaBowlHoles(o,r.parentArenaId),this.updateArenaFloor(o),this.checkSiblingConflicts(this.directParentId(r),this.directParentType(r)),this.renderProps(),this.saveArena()},a=>{this.captureUndo(),this.sceneTree.setLabel(t,a),this.saveArena()},()=>{this.captureUndo(),uo(r,o,this.getScene(),this.pits,this.zones),this.saveArena()});return}this.props.showEmpty()}getScene(){return this.scene}toggleMode(){this.solidMode=!this.solidMode,this.modeBtn.textContent=this.solidMode?"● Solid":"○ Mesh",this.baseMesh&&(this.baseMesh.visible=this.solidMode),this.topFaceMesh&&(this.topFaceMesh.visible=this.solidMode);for(const t of this.arenas.values())t.mesh.visible=this.solidMode,t.floorMesh&&(t.floorMesh.visible=this.solidMode),t.islandMesh&&(t.islandMesh.visible=this.solidMode);for(const t of this.pits.values())t.mesh.visible=this.solidMode;for(const t of this.zones.values())t.mesh.visible=this.solidMode,t.fillMesh.visible=this.solidMode,t.maskMesh.visible=this.solidMode}addArena(){this.captureUndo();const t=`arena-${++this.arenaSeq}`,n=b_(`Arena ${this.arenaSeq}`),[s,r]=Bl(n,[]);n.mesh=s,n.edges=r,this.addToScene(s,r),this.sceneObjects.set(t,[s,r]),this.arenas.set(t,n),this.sceneTree.add(t,n.name,"⏺","octagon-base",{addChildButtons:[{label:"P+",title:"Add pit",className:"pit-btn",onClick:()=>this.addPit(t)},{label:"Z+",title:"Add zone",className:"zone-btn",onClick:()=>this.addZone(t)}]}),this.updateTopFace(),this.updateAllMoatIslandCaps(),this.saveArena()}directParentId(t){return t.parentPitId?t.parentPitId:t.parentZoneId?t.parentZoneId:t.parentArenaId}directParentType(t){return t.parentPitId?"pit":t.parentZoneId?"zone":"arena"}getSiblings(t,n){const s=[];if(n==="arena"){const r=this.arenas.get(t);if(!r)return s;for(const o of r.pitIds){const a=this.pits.get(o);a&&s.push({id:o,item:a,kind:"pit"})}for(const o of r.zoneIds){const a=this.zones.get(o);a&&s.push({id:o,item:a,kind:"zone"})}}else if(n==="pit"){const r=this.pits.get(t);if(!r)return s;for(const o of r.pitIds){const a=this.pits.get(o);a&&s.push({id:o,item:a,kind:"pit"})}for(const o of r.zoneIds){const a=this.zones.get(o);a&&s.push({id:o,item:a,kind:"zone"})}}else{const r=this.zones.get(t);if(!r)return s;for(const o of r.pitIds){const a=this.pits.get(o);a&&s.push({id:o,item:a,kind:"pit"})}for(const o of r.zoneIds){const a=this.zones.get(o);a&&s.push({id:o,item:a,kind:"zone"})}}return s}minRadius(t){return Math.min(t.radiusX,t.radiusZ)}itemCenter(t){return{cx:t.posR*Math.cos(t.posAngle*Ge),cz:t.posR*Math.sin(t.posAngle*Ge)}}checkSiblingConflicts(t,n){const s=this.getSiblings(t,n),r=new Set([...this.conflicts].filter(a=>s.some(l=>l.id===a))),o=new Set;for(let a=0;a<s.length;a++)for(let l=a+1;l<s.length;l++){const c=s[a],u=s[l],h=this.itemCenter(c.item),d=this.itemCenter(u.item),p=Math.hypot(h.cx-d.cx,h.cz-d.cz),g=this.minRadius(c.item),_=this.minRadius(u.item),m=g+_,f=Math.abs(g-_),M=p<m,v=p<=f;if(M){if(c.kind!==u.kind)v||(o.add(c.id),o.add(u.id));else if(!v){this.mergeSameType(c,u,t,n);return}}}for(const a of r)if(!o.has(a)){const l=this.pits.get(a);if(l){const u=new Me(l.color).lerp(new Me(16777215),.5);l.edges.material.color.set(u)}const c=this.zones.get(a);if(c){const u=new Me(c.color).lerp(new Me(16777215),.5);c.edges.material.color.set(u)}this.conflicts.delete(a)}for(const a of o)if(!this.conflicts.has(a)){const l=this.pits.get(a);l&&l.edges.material.color.set(this.CONFLICT_COLOR);const c=this.zones.get(a);c&&c.edges.material.color.set(this.CONFLICT_COLOR),this.conflicts.add(a)}}convexHull(t){const n=[...t].sort((a,l)=>a.x!==l.x?a.x-l.x:a.y-l.y),s=(a,l,c)=>(l.x-a.x)*(c.y-a.y)-(l.y-a.y)*(c.x-a.x),r=[];for(const a of n){for(;r.length>=2&&s(r[r.length-2],r[r.length-1],a)<=0;)r.pop();r.push(a)}const o=[];for(let a=n.length-1;a>=0;a--){const l=n[a];for(;o.length>=2&&s(o[o.length-2],o[o.length-1],l)<=0;)o.pop();o.push(l)}return r.pop(),o.pop(),[...r,...o]}mergeSameType(t,n,s,r){const o=this.arenas.get((t.kind==="pit",t.item.parentArenaId));if(!o)return;const a=m=>{const f=m.posR*Math.cos(m.posAngle*Ge),M=m.posR*Math.sin(m.posAngle*Ge),v=Math.cos(m.rotY*Ge),S=Math.sin(m.rotY*Ge);return mt(m).map(R=>new J(R.x*v-R.y*S+f,R.x*S+R.y*v+M))},l=[...a(t.item),...a(n.item)],c=this.convexHull(l);if(c.length<3)return;const u=c.reduce((m,f)=>m+f.x,0)/c.length,h=c.reduce((m,f)=>m+f.y,0)/c.length,d=Math.hypot(u,h),p=Math.atan2(h,u)/Ge,g=Math.max(t.item.depth,n.item.depth),_=c.map(m=>new J(m.x-u,m.y-h));if(t.kind==="pit"){const m=t.item,f=`pit-${++this.pitSeq}`,M=Hl(`Pit ${this.pitSeq}`,m.parentArenaId,f,m.parentPitId,m.parentZoneId);M.posR=d,M.posAngle=p,M.depth=g,M.radiusX=Math.max(..._.map(F=>Math.abs(F.x)))||10,M.radiusZ=Math.max(..._.map(F=>Math.abs(F.y)))||10;const v=hs(M,o,this.pits,this.zones),S=as(_,g,"straight",0,0,0,v),R=ls(_,g,"straight",0,0,0,v),w=Rt({color:m.color,surface:m.surface,customTileData:m.customTileData,tileScale:m.tileScale}),A=new Me(m.color).lerp(new Me(16777215),.5),L=new ht(S,w),T=new Zn(R,new Cn({color:A})),{wx:y,wz:I,wRotY:z}=cs(o,M);L.position.set(y,0,I),L.rotation.y=z,T.position.set(y,0,I),T.rotation.y=z,M.mesh=L,M.edges=T,this.removePitFromScene(t.id),this.removePitFromScene(n.id),this.pits.set(f,M),this.addToScene(L,T),this.sceneObjects.set(f,[L,T]),this.addChildToParent(f,"pit",s,r),this.sceneTree.add(f,M.name,"▼",s,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(f,"pit")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(f,"pit")}]})}else{const m=t.item,f=`zone-${++this.zoneSeq}`,M=Gl(`Zone ${this.zoneSeq}`,m.parentArenaId,f,m.parentPitId,m.parentZoneId);M.posR=d,M.posAngle=p,M.depth=g,M.radiusX=Math.max(..._.map(L=>Math.abs(L.x)))||15,M.radiusZ=Math.max(..._.map(L=>Math.abs(L.y)))||15,M.fill=m.fill,M.fillColor=m.fillColor;const[v,S,R,w,A]=ho(M,o,this.pits,this.zones);M.mesh=v,M.edges=S,M.fillMesh=R,M.fillLight=w,M.maskMesh=A,this.removeZoneFromScene(t.id),this.removeZoneFromScene(n.id),this.zones.set(f,M),this.addToScene(v,S,R,A),w&&this.addToScene(w),this.sceneObjects.set(f,w?[v,S,R,A,w]:[v,S,R,A]),this.addChildToParent(f,"zone",s,r),this.sceneTree.add(f,M.name,"◈",s,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(f,"zone")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(f,"zone")}]})}this.saveArena()}addChildToParent(t,n,s,r){const o=n==="pit"?"pitIds":"zoneIds";if(r==="arena"){const a=this.arenas.get(s);a&&a[o].push(t)}else if(r==="pit"){const a=this.pits.get(s);a&&a[o].push(t)}else{const a=this.zones.get(s);a&&a[o].push(t)}}removePitFromScene(t){const n=this.pits.get(t);if(!n)return;this.disposePit(n),this.removeFromScene(n.mesh,n.edges),this.sceneObjects.delete(t),this.sceneTree.remove(t),this.pits.delete(t);const s=this.arenas.get(n.parentArenaId);if(s&&(s.pitIds=s.pitIds.filter(r=>r!==t)),n.parentPitId){const r=this.pits.get(n.parentPitId);r&&(r.pitIds=r.pitIds.filter(o=>o!==t))}if(n.parentZoneId){const r=this.zones.get(n.parentZoneId);r&&(r.pitIds=r.pitIds.filter(o=>o!==t))}}removeZoneFromScene(t){const n=this.zones.get(t);if(!n)return;this.disposeZone(n),this.removeFromScene(n.mesh,n.edges,n.fillMesh,n.maskMesh),n.fillLight&&this.removeFromScene(n.fillLight),this.sceneObjects.delete(t),this.sceneTree.remove(t),this.zones.delete(t);const s=this.arenas.get(n.parentArenaId);if(s&&(s.zoneIds=s.zoneIds.filter(r=>r!==t)),n.parentPitId){const r=this.pits.get(n.parentPitId);r&&(r.zoneIds=r.zoneIds.filter(o=>o!==t))}if(n.parentZoneId){const r=this.zones.get(n.parentZoneId);r&&(r.zoneIds=r.zoneIds.filter(o=>o!==t))}}addPit(t){this.addPitToParent(t,"arena")}addZone(t){this.addZoneToParent(t,"arena")}addPitToParent(t,n){let s;if(n==="arena")s=t;else if(n==="pit"){const d=this.pits.get(t);if(!d)return;s=d.parentArenaId}else{const d=this.zones.get(t);if(!d)return;s=d.parentArenaId}const r=this.arenas.get(s);if(!r)return;this.captureUndo();const o=`pit-${++this.pitSeq}`,a=n==="pit"?t:null,l=n==="zone"?t:null,c=Hl(`Pit ${this.pitSeq}`,s,o,a,l);c.depth=Math.min(c.depth,r.depth),c.radiusX=Math.min(c.radiusX,r.radiusX*.4),c.radiusZ=Math.min(c.radiusZ,r.radiusZ*.4);const[u,h]=kl(c,r,this.pits,this.zones);c.mesh=u,c.edges=h,this.addToScene(u,h),this.sceneObjects.set(o,[u,h]),this.pits.set(o,c),this.addChildToParent(o,"pit",t,n),n!=="arena"&&!r.pitIds.includes(o)&&r.pitIds.push(o),this.sceneTree.add(o,c.name,"▼",t,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(o,"pit")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(o,"pit")}]}),this.updateArenaBowlHoles(r,s),this.updateArenaFloor(r),this.checkSiblingConflicts(t,n),this.saveArena()}addZoneToParent(t,n){let s;if(n==="arena")s=t;else if(n==="pit"){const _=this.pits.get(t);if(!_)return;s=_.parentArenaId}else{const _=this.zones.get(t);if(!_)return;s=_.parentArenaId}const r=this.arenas.get(s);if(!r)return;this.captureUndo();const o=`zone-${++this.zoneSeq}`,a=n==="pit"?t:null,l=n==="zone"?t:null,c=Gl(`Zone ${this.zoneSeq}`,s,o,a,l);c.depth=Math.min(c.depth,Math.min(15,r.depth)),c.radiusX=Math.min(c.radiusX,r.radiusX*.3),c.radiusZ=Math.min(c.radiusZ,r.radiusZ*.3);const[u,h,d,p,g]=ho(c,r,this.pits,this.zones);c.mesh=u,c.edges=h,c.fillMesh=d,c.fillLight=p,c.maskMesh=g,this.addToScene(u,h,d,g),p&&this.addToScene(p),this.sceneObjects.set(o,p?[u,h,d,g,p]:[u,h,d,g]),this.zones.set(o,c),this.addChildToParent(o,"zone",t,n),n!=="arena"&&!r.zoneIds.includes(o)&&r.zoneIds.push(o),this.sceneTree.add(o,c.name,"◈",t,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(o,"zone")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(o,"zone")}]}),this.updateArenaBowlHoles(r,s),this.updateArenaFloor(r),this.checkSiblingConflicts(t,n),this.saveArena()}saveArena(){localStorage.setItem(this.arenaStorageKey,this.serializeConfig())}restorePitSave(t,n,s,r){const o={id:t.id,name:t.name,parentArenaId:n,parentPitId:t.parentPitId??null,parentZoneId:t.parentZoneId??null,openingShape:t.openingShape,wallProfile:t.wallProfile,radiusX:t.radiusX,radiusZ:t.radiusZ,depth:t.depth,sides:t.sides,starInner:t.starInner,color:t.color,surface:t.surface,customTileData:t.customTileData,tileScale:t.tileScale,posR:t.posR,posAngle:t.posAngle,rotY:t.rotY,isMoat:t.isMoat,innerRadiusX:t.innerRadiusX,innerRadiusZ:t.innerRadiusZ,innerOpeningShape:t.innerOpeningShape??t.openingShape,innerSides:t.innerSides??t.sides,innerStarInner:t.innerStarInner??t.starInner,innerWallProfile:t.innerWallProfile??"straight",innerRimOffset:t.innerRimOffset??0,pitIds:[],zoneIds:[],mesh:null,edges:null};this.pits.set(t.id,o),r.pitIds.push(t.id);const[a,l]=kl(o,r,this.pits,this.zones);o.mesh=a,o.edges=l,this.addToScene(a,l),this.sceneObjects.set(t.id,[a,l]),this.sceneTree.add(t.id,o.name,"▼",s,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(t.id,"pit")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(t.id,"pit")}]});for(const c of t.pits??[])this.restorePitSave(c,n,t.id,r);for(const c of t.zones??[])this.restoreZoneSave(c,n,t.id,r)}restoreZoneSave(t,n,s,r){const o={id:t.id,name:t.name,parentArenaId:n,parentPitId:t.parentPitId??null,parentZoneId:t.parentZoneId??null,openingShape:t.openingShape,radiusX:t.radiusX,radiusZ:t.radiusZ,depth:t.depth,sides:t.sides,starInner:t.starInner,color:t.color,surface:t.surface,customTileData:t.customTileData,tileScale:t.tileScale,fill:t.fill,fillColor:t.fillColor,fillOpacity:t.fillOpacity,fillGlow:t.fillGlow,posR:t.posR,posAngle:t.posAngle,rotY:t.rotY,isMoat:t.isMoat,innerRadiusX:t.innerRadiusX,innerRadiusZ:t.innerRadiusZ,innerOpeningShape:t.innerOpeningShape??t.openingShape,innerSides:t.innerSides??t.sides,innerStarInner:t.innerStarInner??t.starInner,innerWallProfile:t.innerWallProfile??"parabolic",innerRimOffset:t.innerRimOffset??0,pitIds:[],zoneIds:[],mesh:null,edges:null,fillMesh:null,fillLight:null,maskMesh:null};this.zones.set(t.id,o),r.zoneIds.push(t.id);const[a,l,c,u,h]=ho(o,r,this.pits,this.zones);o.mesh=a,o.edges=l,o.fillMesh=c,o.fillLight=u,o.maskMesh=h,this.addToScene(a,l,c,h),u&&this.addToScene(u),this.sceneObjects.set(t.id,u?[a,l,c,h,u]:[a,l,c,h]),this.sceneTree.add(t.id,o.name,"◈",s,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(t.id,"zone")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(t.id,"zone")}]});for(const d of t.pits??[])this.restorePitSave(d,n,t.id,r);for(const d of t.zones??[])this.restoreZoneSave(d,n,t.id,r)}_loadArenasFromConfig(t){for(const n of t.arenas){const s={name:n.name,openingShape:n.openingShape,wallProfile:n.wallProfile,radiusX:n.radiusX,radiusZ:n.radiusZ,depth:n.depth,sides:n.sides,starInner:n.starInner,color:n.color,surface:n.surface,customTileData:n.customTileData,tileScale:n.tileScale,posX:n.posX,posZ:n.posZ,posY:n.posY??0,rotY:n.rotY,isMoat:n.isMoat,innerRadiusX:n.innerRadiusX,innerRadiusZ:n.innerRadiusZ,innerOpeningShape:n.innerOpeningShape??n.openingShape,innerSides:n.innerSides??n.sides,innerStarInner:n.innerStarInner??n.starInner,innerWallProfile:n.innerWallProfile??"parabolic",innerRimOffset:n.innerRimOffset??0,pitIds:[],zoneIds:[],mesh:null,edges:null,floorMesh:null,islandMesh:null};this.arenas.set(n.id,s);for(const c of n.pits)this.restorePitSave(c,n.id,n.id,s);for(const c of n.zones)this.restoreZoneSave(c,n.id,n.id,s);const r=this.getArenaHoles(s),[o,a]=Bl(s,r);s.mesh=o,s.edges=a,this.addToScene(o,a);const l=[o,a];if(s.isMoat){const c=Fl(s),u=Rt({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});s.islandMesh=new ht(c,u),s.islandMesh.position.set(s.posX,s.posY,s.posZ),s.islandMesh.rotation.y=s.rotY,this.addToScene(s.islandMesh),l.push(s.islandMesh)}if(s.wallProfile==="straight"&&!s.isMoat&&s.posY<=.5){const c=s.pitIds.map(p=>this.pits.get(p)).filter(Boolean),u=s.zoneIds.map(p=>this.zones.get(p)).filter(Boolean),h=Ol(s,c,u),d=Rt({color:s.color,surface:s.surface,customTileData:s.customTileData,tileScale:s.tileScale});s.floorMesh=new ht(h,d),s.floorMesh.position.set(s.posX,s.posY,s.posZ),s.floorMesh.rotation.y=s.rotY,this.addToScene(s.floorMesh),l.push(s.floorMesh)}this.sceneTree.add(n.id,s.name,"⏺","octagon-base",{addChildButtons:[{label:"P+",title:"Add pit",className:"pit-btn",onClick:()=>this.addPit(n.id)},{label:"Z+",title:"Add zone",className:"zone-btn",onClick:()=>this.addZone(n.id)}]}),this.sceneObjects.set(n.id,l)}this.updateTopFace()}loadArena(){try{const t=localStorage.getItem(this.arenaStorageKey);if(!t)return;const n=JSON.parse(t);if(n.version!==3){localStorage.removeItem(this.arenaStorageKey);return}this.baseConfig={...this.baseConfig,...n.baseConfig},this.rebuildBase(),this.arenaSeq=n.arenaSeq,this.pitSeq=n.pitSeq,this.zoneSeq=n.zoneSeq,this._loadArenasFromConfig(n)}catch{localStorage.removeItem(this.arenaStorageKey)}}async resetArena(){if(await To(`Reset arena?
All arenas, pits, zones and base settings will be cleared.`,"Reset","Cancel")){this.captureUndo();for(const[n,s]of this.arenas.entries()){for(const r of s.pitIds){const o=this.pits.get(r);o&&(this.disposePit(o),this.removeFromScene(o.mesh,o.edges)),this.pits.delete(r),this.sceneObjects.delete(r)}for(const r of s.zoneIds){const o=this.zones.get(r);o&&(this.disposeZone(o),this.removeFromScene(o.mesh,o.edges,o.fillMesh,o.maskMesh),o.fillLight&&this.removeFromScene(o.fillLight)),this.zones.delete(r),this.sceneObjects.delete(r)}this.disposeArena(s),this.removeFromScene(s.mesh,s.edges),this.sceneObjects.delete(n),this.sceneTree.remove(n)}this.arenas.clear(),this.arenaSeq=0,this.pits.clear(),this.pitSeq=0,this.zones.clear(),this.zoneSeq=0,this.baseConfig={height:30,sides:8,color:15260864,surface:"plain",customTileData:null,tileScale:20},this.rebuildBase(),this.updateTopFace(),this.selectedId=null,this.sceneTree.clearSel(),this.props.showEmpty(),localStorage.removeItem(this.arenaStorageKey),this._flushUndoPending()}}}class C_{constructor(){pe(this,"current","landing");pe(this,"landing");pe(this,"beyblade");pe(this,"arena");const e=document.getElementById("app");this.landing=new Zc(e,{onBeyblade:()=>this.go("beyblade"),onArena:()=>this.go("arena")}),this.beyblade=new Cc(e,{title:"Beyblade Sandbox",accentHex:58879,onBack:()=>{this.confirmLeave()},gridSize:15,gridDivs:15,tickEvery:5,tickRange:7,defaultCam:{x:12,y:8,z:14},camFar:500,minZoom:.5,maxZoom:50}),this.arena=new R_(e,{title:"Arena Sandbox",accentHex:16739125,onBack:()=>{this.confirmLeave()},gridSize:200,gridDivs:20,tickEvery:20,tickRange:100,defaultCam:{x:150,y:100,z:175},camFar:2e3,minZoom:5,maxZoom:1500,axisYOffset:30}),this.mountGlobalControls(e),window.addEventListener("popstate",n=>{var r;const s=((r=n.state)==null?void 0:r.screen)??this.pathToScreen();this.current!=="landing"&&s==="landing"?this.confirmPopLeave():this.show(s)});const t=this.pathToScreen();history.replaceState({screen:t},"",location.pathname),this.show(t)}go(e){const t=e==="landing"?"/":`/${e}`;history.pushState({screen:e},"",t),this.show(e)}show(e){this.current=e,this.landing.setVisible(e==="landing"),this.beyblade.setVisible(e==="beyblade"),this.arena.setVisible(e==="arena")}pathToScreen(){const e=location.pathname;return e==="/beyblade"?"beyblade":e==="/arena"?"arena":"landing"}async confirmLeave(){await To(`Leave the sandbox?
Your view will be saved.`,"Leave","Stay")&&this.go("landing")}async confirmPopLeave(){await To(`Leave the sandbox?
Your view will be saved.`,"Leave","Stay")?this.show("landing"):history.go(1)}mountGlobalControls(e){let t=1;const n=.1,s=.5,r=2,o=c=>{t=Math.min(r,Math.max(s,+c.toFixed(2))),document.documentElement.style.setProperty("--ui-scale",String(t))},a=document.createElement("div");a.className="global-controls",a.innerHTML=`
      <button class="ctrl-btn" id="scale-down"  title="Decrease UI size">−</button>
      <button class="ctrl-btn" id="scale-reset" title="Reset UI size">○</button>
      <button class="ctrl-btn" id="scale-up"    title="Increase UI size">+</button>
    `,e.appendChild(a),a.querySelector("#scale-down").addEventListener("click",()=>o(t-n)),a.querySelector("#scale-up").addEventListener("click",()=>o(t+n)),a.querySelector("#scale-reset").addEventListener("click",()=>o(1));const l=document.createElement("button");l.className="fs-btn",l.title="Toggle fullscreen",l.textContent="⛶",e.appendChild(l),l.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}),document.addEventListener("fullscreenchange",()=>{l.title=document.fullscreenElement?"Exit fullscreen":"Enter fullscreen"}),window.addEventListener("keydown",c=>{(c.key==="f"||c.key==="F")&&l.click(),c.key==="="&&o(t+n),c.key==="-"&&o(t-n),c.key==="0"&&o(1)})}}new C_;
