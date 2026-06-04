var gd=Object.defineProperty;var _d=(i,e,t)=>e in i?gd(i,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[e]=t;var W=(i,e,t)=>_d(i,typeof e!="symbol"?e+"":e,t);(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const o of r.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function t(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerPolicy&&(r.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?r.credentials="include":s.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(s){if(s.ep)return;s.ep=!0;const r=t(s);fetch(s.href,r)}})();class vd{constructor(e,t){W(this,"el");this.el=document.createElement("div"),this.el.className="screen landing-screen",this.el.innerHTML=`
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
 */const ta="165",gn={ROTATE:0,DOLLY:1,PAN:2},In={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},xd=0,ya=1,Sd=2,kl=1,Md=2,fn=3,kn=0,Lt=1,Et=2,On=0,zi=1,ba=2,Ea=3,Aa=4,yd=5,ti=100,bd=101,Ed=102,Ad=103,Td=104,wd=200,Rd=201,Cd=202,Pd=203,ko=204,Ho=205,Ld=206,Id=207,Dd=208,Nd=209,Ud=210,Od=211,Fd=212,Bd=213,zd=214,kd=0,Hd=1,Gd=2,pr=3,Vd=4,Wd=5,Xd=6,Yd=7,Hl=0,Zd=1,qd=2,Fn=0,jd=1,$d=2,Kd=3,Jd=4,Qd=5,eu=6,tu=7,Gl=300,Wi=301,Xi=302,Go=303,Vo=304,Lr=306,fr=1e3,ii=1001,Wo=1002,Wt=1003,nu=1004,Rs=1005,Kt=1006,Zr=1007,si=1008,Hn=1009,iu=1010,su=1011,mr=1012,Vl=1013,Yi=1014,Un=1015,Ir=1016,Wl=1017,Xl=1018,Zi=1020,ru=35902,ou=1021,au=1022,sn=1023,cu=1024,lu=1025,ki=1026,qi=1027,hu=1028,Yl=1029,du=1030,Zl=1031,ql=1033,qr=33776,jr=33777,$r=33778,Kr=33779,Ta=35840,wa=35841,Ra=35842,Ca=35843,Pa=36196,La=37492,Ia=37496,Da=37808,Na=37809,Ua=37810,Oa=37811,Fa=37812,Ba=37813,za=37814,ka=37815,Ha=37816,Ga=37817,Va=37818,Wa=37819,Xa=37820,Ya=37821,Jr=36492,Za=36494,qa=36495,uu=36283,ja=36284,$a=36285,Ka=36286,pu=3200,fu=3201,jl=0,mu=1,Dn="",tn="srgb",Vn="srgb-linear",na="display-p3",Dr="display-p3-linear",gr="linear",st="srgb",_r="rec709",vr="p3",pi=7680,Ja=519,gu=512,_u=513,vu=514,$l=515,xu=516,Su=517,Mu=518,yu=519,Xo=35044,Qa="300 es",xn=2e3,xr=2001;class hi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const n=this._listeners;return n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const s=this._listeners[e];if(s!==void 0){const r=s.indexOf(t);r!==-1&&s.splice(r,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const n=this._listeners[e.type];if(n!==void 0){e.target=this;const s=n.slice(0);for(let r=0,o=s.length;r<o;r++)s[r].call(this,e);e.target=null}}}const Tt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let ec=1234567;const Hi=Math.PI/180,ps=180/Math.PI;function rn(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Tt[i&255]+Tt[i>>8&255]+Tt[i>>16&255]+Tt[i>>24&255]+"-"+Tt[e&255]+Tt[e>>8&255]+"-"+Tt[e>>16&15|64]+Tt[e>>24&255]+"-"+Tt[t&63|128]+Tt[t>>8&255]+"-"+Tt[t>>16&255]+Tt[t>>24&255]+Tt[n&255]+Tt[n>>8&255]+Tt[n>>16&255]+Tt[n>>24&255]).toLowerCase()}function yt(i,e,t){return Math.max(e,Math.min(t,i))}function ia(i,e){return(i%e+e)%e}function bu(i,e,t,n,s){return n+(i-e)*(s-n)/(t-e)}function Eu(i,e,t){return i!==e?(t-i)/(e-i):0}function ls(i,e,t){return(1-t)*i+t*e}function Au(i,e,t,n){return ls(i,e,1-Math.exp(-t*n))}function Tu(i,e=1){return e-Math.abs(ia(i,e*2)-e)}function wu(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Ru(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Cu(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Pu(i,e){return i+Math.random()*(e-i)}function Lu(i){return i*(.5-Math.random())}function Iu(i){i!==void 0&&(ec=i);let e=ec+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Du(i){return i*Hi}function Nu(i){return i*ps}function Uu(i){return(i&i-1)===0&&i!==0}function Ou(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Fu(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Bu(i,e,t,n,s){const r=Math.cos,o=Math.sin,a=r(t/2),c=o(t/2),l=r((e+n)/2),h=o((e+n)/2),d=r((e-n)/2),u=o((e-n)/2),m=r((n-e)/2),g=o((n-e)/2);switch(s){case"XYX":i.set(a*h,c*d,c*u,a*l);break;case"YZY":i.set(c*u,a*h,c*d,a*l);break;case"ZXZ":i.set(c*d,c*u,a*h,a*l);break;case"XZX":i.set(a*h,c*g,c*m,a*l);break;case"YXY":i.set(c*m,a*h,c*g,a*l);break;case"ZYZ":i.set(c*g,c*m,a*h,a*l);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function Jt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Qe(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Bn={DEG2RAD:Hi,RAD2DEG:ps,generateUUID:rn,clamp:yt,euclideanModulo:ia,mapLinear:bu,inverseLerp:Eu,lerp:ls,damp:Au,pingpong:Tu,smoothstep:wu,smootherstep:Ru,randInt:Cu,randFloat:Pu,randFloatSpread:Lu,seededRandom:Iu,degToRad:Du,radToDeg:Nu,isPowerOfTwo:Uu,ceilPowerOfTwo:Ou,floorPowerOfTwo:Fu,setQuaternionFromProperEuler:Bu,normalize:Qe,denormalize:Jt};class K{constructor(e=0,t=0){K.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,s=e.elements;return this.x=s[0]*t+s[3]*n+s[6],this.y=s[1]*t+s[4]*n+s[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(yt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),s=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*s+e.x,this.y=r*s+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ke{constructor(e,t,n,s,r,o,a,c,l){ke.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l)}set(e,t,n,s,r,o,a,c,l){const h=this.elements;return h[0]=e,h[1]=s,h[2]=a,h[3]=t,h[4]=r,h[5]=c,h[6]=n,h[7]=o,h[8]=l,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[3],c=n[6],l=n[1],h=n[4],d=n[7],u=n[2],m=n[5],g=n[8],_=s[0],f=s[3],p=s[6],x=s[1],v=s[4],S=s[7],R=s[2],A=s[5],T=s[8];return r[0]=o*_+a*x+c*R,r[3]=o*f+a*v+c*A,r[6]=o*p+a*S+c*T,r[1]=l*_+h*x+d*R,r[4]=l*f+h*v+d*A,r[7]=l*p+h*S+d*T,r[2]=u*_+m*x+g*R,r[5]=u*f+m*v+g*A,r[8]=u*p+m*S+g*T,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8];return t*o*h-t*a*l-n*r*h+n*a*c+s*r*l-s*o*c}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=h*o-a*l,u=a*c-h*r,m=l*r-o*c,g=t*d+n*u+s*m;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return e[0]=d*_,e[1]=(s*l-h*n)*_,e[2]=(a*n-s*o)*_,e[3]=u*_,e[4]=(h*t-s*c)*_,e[5]=(s*r-a*t)*_,e[6]=m*_,e[7]=(n*c-l*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,s,r,o,a){const c=Math.cos(r),l=Math.sin(r);return this.set(n*c,n*l,-n*(c*o+l*a)+o+e,-s*l,s*c,-s*(-l*o+c*a)+a+t,0,0,1),this}scale(e,t){return this.premultiply(Qr.makeScale(e,t)),this}rotate(e){return this.premultiply(Qr.makeRotation(-e)),this}translate(e,t){return this.premultiply(Qr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<9;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Qr=new ke;function Kl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function fs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function zu(){const i=fs("canvas");return i.style.display="block",i}const tc={};function sa(i){i in tc||(tc[i]=!0,console.warn(i))}function ku(i,e,t){return new Promise(function(n,s){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}const nc=new ke().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),ic=new ke().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),Cs={[Vn]:{transfer:gr,primaries:_r,toReference:i=>i,fromReference:i=>i},[tn]:{transfer:st,primaries:_r,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Dr]:{transfer:gr,primaries:vr,toReference:i=>i.applyMatrix3(ic),fromReference:i=>i.applyMatrix3(nc)},[na]:{transfer:st,primaries:vr,toReference:i=>i.convertSRGBToLinear().applyMatrix3(ic),fromReference:i=>i.applyMatrix3(nc).convertLinearToSRGB()}},Hu=new Set([Vn,Dr]),et={enabled:!0,_workingColorSpace:Vn,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Hu.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const n=Cs[e].toReference,s=Cs[t].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return Cs[i].primaries},getTransfer:function(i){return i===Dn?gr:Cs[i].transfer}};function Gi(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function eo(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let fi;class Gu{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{fi===void 0&&(fi=fs("canvas")),fi.width=e.width,fi.height=e.height;const n=fi.getContext("2d");e instanceof ImageData?n.putImageData(e,0,0):n.drawImage(e,0,0,e.width,e.height),t=fi}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=fs("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const s=n.getImageData(0,0,e.width,e.height),r=s.data;for(let o=0;o<r.length;o++)r[o]=Gi(r[o]/255)*255;return n.putImageData(s,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Gi(t[n]/255)*255):t[n]=Gi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Vu=0;class Jl{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Vu++}),this.uuid=rn(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let o=0,a=s.length;o<a;o++)s[o].isDataTexture?r.push(to(s[o].image)):r.push(to(s[o]))}else r=to(s);n.url=r}return t||(e.images[this.uuid]=n),n}}function to(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Gu.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let Wu=0;class At extends hi{constructor(e=At.DEFAULT_IMAGE,t=At.DEFAULT_MAPPING,n=ii,s=ii,r=Kt,o=si,a=sn,c=Hn,l=At.DEFAULT_ANISOTROPY,h=Dn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wu++}),this.uuid=rn(),this.name="",this.source=new Jl(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=o,this.anisotropy=l,this.format=a,this.internalFormat=null,this.type=c,this.offset=new K(0,0),this.repeat=new K(1,1),this.center=new K(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ke,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Gl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case fr:e.x=e.x-Math.floor(e.x);break;case ii:e.x=e.x<0?0:1;break;case Wo:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case fr:e.y=e.y-Math.floor(e.y);break;case ii:e.y=e.y<0?0:1;break;case Wo:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}At.DEFAULT_IMAGE=null;At.DEFAULT_MAPPING=Gl;At.DEFAULT_ANISOTROPY=1;class rt{constructor(e=0,t=0,n=0,s=1){rt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=s}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,s){return this.x=e,this.y=t,this.z=n,this.w=s,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*s+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*s+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*s+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*s+o[15]*r,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,s,r;const c=e.elements,l=c[0],h=c[4],d=c[8],u=c[1],m=c[5],g=c[9],_=c[2],f=c[6],p=c[10];if(Math.abs(h-u)<.01&&Math.abs(d-_)<.01&&Math.abs(g-f)<.01){if(Math.abs(h+u)<.1&&Math.abs(d+_)<.1&&Math.abs(g+f)<.1&&Math.abs(l+m+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const v=(l+1)/2,S=(m+1)/2,R=(p+1)/2,A=(h+u)/4,T=(d+_)/4,C=(g+f)/4;return v>S&&v>R?v<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(v),s=A/n,r=T/n):S>R?S<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(S),n=A/s,r=C/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=T/r,s=C/r),this.set(n,s,r,t),this}let x=Math.sqrt((f-g)*(f-g)+(d-_)*(d-_)+(u-h)*(u-h));return Math.abs(x)<.001&&(x=1),this.x=(f-g)/x,this.y=(d-_)/x,this.z=(u-h)/x,this.w=Math.acos((l+m+p-1)/2),this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xu extends hi{constructor(e=1,t=1,n={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new rt(0,0,e,t),this.scissorTest=!1,this.viewport=new rt(0,0,e,t);const s={width:e,height:t,depth:1};n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Kt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},n);const r=new At(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace);r.flipY=!1,r.generateMipmaps=n.generateMipmaps,r.internalFormat=n.internalFormat,this.textures=[];const o=n.count;for(let a=0;a<o;a++)this.textures[a]=r.clone(),this.textures[a].isRenderTargetTexture=!0;this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let s=0,r=this.textures.length;s<r;s++)this.textures[s].image.width=e,this.textures[s].image.height=t,this.textures[s].image.depth=n;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,s=e.textures.length;n<s;n++)this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new Jl(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class ci extends Xu{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class Ql extends At{constructor(e=null,t=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Yu extends At{constructor(e=null,t=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:s},this.magFilter=Wt,this.minFilter=Wt,this.wrapR=ii,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Xt{constructor(e=0,t=0,n=0,s=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=s}static slerpFlat(e,t,n,s,r,o,a){let c=n[s+0],l=n[s+1],h=n[s+2],d=n[s+3];const u=r[o+0],m=r[o+1],g=r[o+2],_=r[o+3];if(a===0){e[t+0]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d;return}if(a===1){e[t+0]=u,e[t+1]=m,e[t+2]=g,e[t+3]=_;return}if(d!==_||c!==u||l!==m||h!==g){let f=1-a;const p=c*u+l*m+h*g+d*_,x=p>=0?1:-1,v=1-p*p;if(v>Number.EPSILON){const R=Math.sqrt(v),A=Math.atan2(R,p*x);f=Math.sin(f*A)/R,a=Math.sin(a*A)/R}const S=a*x;if(c=c*f+u*S,l=l*f+m*S,h=h*f+g*S,d=d*f+_*S,f===1-a){const R=1/Math.sqrt(c*c+l*l+h*h+d*d);c*=R,l*=R,h*=R,d*=R}}e[t]=c,e[t+1]=l,e[t+2]=h,e[t+3]=d}static multiplyQuaternionsFlat(e,t,n,s,r,o){const a=n[s],c=n[s+1],l=n[s+2],h=n[s+3],d=r[o],u=r[o+1],m=r[o+2],g=r[o+3];return e[t]=a*g+h*d+c*m-l*u,e[t+1]=c*g+h*u+l*d-a*m,e[t+2]=l*g+h*m+a*u-c*d,e[t+3]=h*g-a*d-c*u-l*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,s){return this._x=e,this._y=t,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,s=e._y,r=e._z,o=e._order,a=Math.cos,c=Math.sin,l=a(n/2),h=a(s/2),d=a(r/2),u=c(n/2),m=c(s/2),g=c(r/2);switch(o){case"XYZ":this._x=u*h*d+l*m*g,this._y=l*m*d-u*h*g,this._z=l*h*g+u*m*d,this._w=l*h*d-u*m*g;break;case"YXZ":this._x=u*h*d+l*m*g,this._y=l*m*d-u*h*g,this._z=l*h*g-u*m*d,this._w=l*h*d+u*m*g;break;case"ZXY":this._x=u*h*d-l*m*g,this._y=l*m*d+u*h*g,this._z=l*h*g+u*m*d,this._w=l*h*d-u*m*g;break;case"ZYX":this._x=u*h*d-l*m*g,this._y=l*m*d+u*h*g,this._z=l*h*g-u*m*d,this._w=l*h*d+u*m*g;break;case"YZX":this._x=u*h*d+l*m*g,this._y=l*m*d+u*h*g,this._z=l*h*g-u*m*d,this._w=l*h*d-u*m*g;break;case"XZY":this._x=u*h*d-l*m*g,this._y=l*m*d-u*h*g,this._z=l*h*g+u*m*d,this._w=l*h*d+u*m*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,s=Math.sin(n);return this._x=e.x*s,this._y=e.y*s,this._z=e.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],s=t[4],r=t[8],o=t[1],a=t[5],c=t[9],l=t[2],h=t[6],d=t[10],u=n+a+d;if(u>0){const m=.5/Math.sqrt(u+1);this._w=.25/m,this._x=(h-c)*m,this._y=(r-l)*m,this._z=(o-s)*m}else if(n>a&&n>d){const m=2*Math.sqrt(1+n-a-d);this._w=(h-c)/m,this._x=.25*m,this._y=(s+o)/m,this._z=(r+l)/m}else if(a>d){const m=2*Math.sqrt(1+a-n-d);this._w=(r-l)/m,this._x=(s+o)/m,this._y=.25*m,this._z=(c+h)/m}else{const m=2*Math.sqrt(1+d-n-a);this._w=(o-s)/m,this._x=(r+l)/m,this._y=(c+h)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<Number.EPSILON?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(yt(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const s=Math.min(1,t/n);return this.slerp(e,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,s=e._y,r=e._z,o=e._w,a=t._x,c=t._y,l=t._z,h=t._w;return this._x=n*h+o*a+s*l-r*c,this._y=s*h+o*c+r*a-n*l,this._z=r*h+o*l+n*c-s*a,this._w=o*h-n*a-s*c-r*l,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const n=this._x,s=this._y,r=this._z,o=this._w;let a=o*e._w+n*e._x+s*e._y+r*e._z;if(a<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,a=-a):this.copy(e),a>=1)return this._w=o,this._x=n,this._y=s,this._z=r,this;const c=1-a*a;if(c<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*n+t*this._x,this._y=m*s+t*this._y,this._z=m*r+t*this._z,this.normalize(),this}const l=Math.sqrt(c),h=Math.atan2(l,a),d=Math.sin((1-t)*h)/l,u=Math.sin(t*h)/l;return this._w=o*d+this._w*u,this._x=n*d+this._x*u,this._y=s*d+this._y*u,this._z=r*d+this._z*u,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(s*Math.sin(e),s*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class L{constructor(e=0,t=0,n=0){L.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(sc.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(sc.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*s,this.y=r[1]*t+r[4]*n+r[7]*s,this.z=r[2]*t+r[5]*n+r[8]*s,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,s=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*s+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*s+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*s+r[14])*o,this}applyQuaternion(e){const t=this.x,n=this.y,s=this.z,r=e.x,o=e.y,a=e.z,c=e.w,l=2*(o*s-a*n),h=2*(a*t-r*s),d=2*(r*n-o*t);return this.x=t+c*l+o*d-a*h,this.y=n+c*h+a*l-r*d,this.z=s+c*d+r*h-o*l,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,s=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*s,this.y=r[1]*t+r[5]*n+r[9]*s,this.z=r[2]*t+r[6]*n+r[10]*s,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(e,Math.min(t,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,s=e.y,r=e.z,o=t.x,a=t.y,c=t.z;return this.x=s*c-r*a,this.y=r*o-n*c,this.z=n*a-s*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return no.copy(this).projectOnVector(e),this.sub(no)}reflect(e){return this.sub(no.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(yt(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,s=this.z-e.z;return t*t+n*n+s*s}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const s=Math.sin(t)*e;return this.x=s*Math.sin(n),this.y=Math.cos(t)*e,this.z=s*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),s=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=s,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const no=new L,sc=new Xt;class xs{constructor(e=new L(1/0,1/0,1/0),t=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Zt.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Zt.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=Zt.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=r.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,Zt):Zt.fromBufferAttribute(r,o),Zt.applyMatrix4(e.matrixWorld),this.expandByPoint(Zt);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ps.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ps.copy(n.boundingBox)),Ps.applyMatrix4(e.matrixWorld),this.union(Ps)}const s=e.children;for(let r=0,o=s.length;r<o;r++)this.expandByObject(s[r],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,Zt),Zt.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(Qi),Ls.subVectors(this.max,Qi),mi.subVectors(e.a,Qi),gi.subVectors(e.b,Qi),_i.subVectors(e.c,Qi),An.subVectors(gi,mi),Tn.subVectors(_i,gi),Zn.subVectors(mi,_i);let t=[0,-An.z,An.y,0,-Tn.z,Tn.y,0,-Zn.z,Zn.y,An.z,0,-An.x,Tn.z,0,-Tn.x,Zn.z,0,-Zn.x,-An.y,An.x,0,-Tn.y,Tn.x,0,-Zn.y,Zn.x,0];return!io(t,mi,gi,_i,Ls)||(t=[1,0,0,0,1,0,0,0,1],!io(t,mi,gi,_i,Ls))?!1:(Is.crossVectors(An,Tn),t=[Is.x,Is.y,Is.z],io(t,mi,gi,_i,Ls))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Zt).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Zt).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(cn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),cn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),cn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),cn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),cn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),cn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),cn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),cn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(cn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const cn=[new L,new L,new L,new L,new L,new L,new L,new L],Zt=new L,Ps=new xs,mi=new L,gi=new L,_i=new L,An=new L,Tn=new L,Zn=new L,Qi=new L,Ls=new L,Is=new L,qn=new L;function io(i,e,t,n,s){for(let r=0,o=i.length-3;r<=o;r+=3){qn.fromArray(i,r);const a=s.x*Math.abs(qn.x)+s.y*Math.abs(qn.y)+s.z*Math.abs(qn.z),c=e.dot(qn),l=t.dot(qn),h=n.dot(qn);if(Math.max(-Math.max(c,l,h),Math.min(c,l,h))>a)return!1}return!0}const Zu=new xs,es=new L,so=new L;class Nr{constructor(e=new L,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):Zu.setFromPoints(e).getCenter(n);let s=0;for(let r=0,o=e.length;r<o;r++)s=Math.max(s,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(s),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;es.subVectors(e,this.center);const t=es.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),s=(n-this.radius)*.5;this.center.addScaledVector(es,s/n),this.radius+=s}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(so.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(es.copy(e.center).add(so)),this.expandByPoint(es.copy(e.center).sub(so))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ln=new L,ro=new L,Ds=new L,wn=new L,oo=new L,Ns=new L,ao=new L;class Ur{constructor(e=new L,t=new L(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ln)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=ln.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(ln.copy(this.origin).addScaledVector(this.direction,t),ln.distanceToSquared(e))}distanceSqToSegment(e,t,n,s){ro.copy(e).add(t).multiplyScalar(.5),Ds.copy(t).sub(e).normalize(),wn.copy(this.origin).sub(ro);const r=e.distanceTo(t)*.5,o=-this.direction.dot(Ds),a=wn.dot(this.direction),c=-wn.dot(Ds),l=wn.lengthSq(),h=Math.abs(1-o*o);let d,u,m,g;if(h>0)if(d=o*c-a,u=o*a-c,g=r*h,d>=0)if(u>=-g)if(u<=g){const _=1/h;d*=_,u*=_,m=d*(d+o*u+2*a)+u*(o*d+u+2*c)+l}else u=r,d=Math.max(0,-(o*u+a)),m=-d*d+u*(u+2*c)+l;else u=-r,d=Math.max(0,-(o*u+a)),m=-d*d+u*(u+2*c)+l;else u<=-g?(d=Math.max(0,-(-o*r+a)),u=d>0?-r:Math.min(Math.max(-r,-c),r),m=-d*d+u*(u+2*c)+l):u<=g?(d=0,u=Math.min(Math.max(-r,-c),r),m=u*(u+2*c)+l):(d=Math.max(0,-(o*r+a)),u=d>0?r:Math.min(Math.max(-r,-c),r),m=-d*d+u*(u+2*c)+l);else u=o>0?-r:r,d=Math.max(0,-(o*u+a)),m=-d*d+u*(u+2*c)+l;return n&&n.copy(this.origin).addScaledVector(this.direction,d),s&&s.copy(ro).addScaledVector(Ds,u),m}intersectSphere(e,t){ln.subVectors(e.center,this.origin);const n=ln.dot(this.direction),s=ln.dot(ln)-n*n,r=e.radius*e.radius;if(s>r)return null;const o=Math.sqrt(r-s),a=n-o,c=n+o;return c<0?null:a<0?this.at(c,t):this.at(a,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,s,r,o,a,c;const l=1/this.direction.x,h=1/this.direction.y,d=1/this.direction.z,u=this.origin;return l>=0?(n=(e.min.x-u.x)*l,s=(e.max.x-u.x)*l):(n=(e.max.x-u.x)*l,s=(e.min.x-u.x)*l),h>=0?(r=(e.min.y-u.y)*h,o=(e.max.y-u.y)*h):(r=(e.max.y-u.y)*h,o=(e.min.y-u.y)*h),n>o||r>s||((r>n||isNaN(n))&&(n=r),(o<s||isNaN(s))&&(s=o),d>=0?(a=(e.min.z-u.z)*d,c=(e.max.z-u.z)*d):(a=(e.max.z-u.z)*d,c=(e.min.z-u.z)*d),n>c||a>s)||((a>n||n!==n)&&(n=a),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,t)}intersectsBox(e){return this.intersectBox(e,ln)!==null}intersectTriangle(e,t,n,s,r){oo.subVectors(t,e),Ns.subVectors(n,e),ao.crossVectors(oo,Ns);let o=this.direction.dot(ao),a;if(o>0){if(s)return null;a=1}else if(o<0)a=-1,o=-o;else return null;wn.subVectors(this.origin,e);const c=a*this.direction.dot(Ns.crossVectors(wn,Ns));if(c<0)return null;const l=a*this.direction.dot(oo.cross(wn));if(l<0||c+l>o)return null;const h=-a*wn.dot(ao);return h<0?null:this.at(h/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class it{constructor(e,t,n,s,r,o,a,c,l,h,d,u,m,g,_,f){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,s,r,o,a,c,l,h,d,u,m,g,_,f)}set(e,t,n,s,r,o,a,c,l,h,d,u,m,g,_,f){const p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=s,p[1]=r,p[5]=o,p[9]=a,p[13]=c,p[2]=l,p[6]=h,p[10]=d,p[14]=u,p[3]=m,p[7]=g,p[11]=_,p[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,s=1/vi.setFromMatrixColumn(e,0).length(),r=1/vi.setFromMatrixColumn(e,1).length(),o=1/vi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*s,t[1]=n[1]*s,t[2]=n[2]*s,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,s=e.y,r=e.z,o=Math.cos(n),a=Math.sin(n),c=Math.cos(s),l=Math.sin(s),h=Math.cos(r),d=Math.sin(r);if(e.order==="XYZ"){const u=o*h,m=o*d,g=a*h,_=a*d;t[0]=c*h,t[4]=-c*d,t[8]=l,t[1]=m+g*l,t[5]=u-_*l,t[9]=-a*c,t[2]=_-u*l,t[6]=g+m*l,t[10]=o*c}else if(e.order==="YXZ"){const u=c*h,m=c*d,g=l*h,_=l*d;t[0]=u+_*a,t[4]=g*a-m,t[8]=o*l,t[1]=o*d,t[5]=o*h,t[9]=-a,t[2]=m*a-g,t[6]=_+u*a,t[10]=o*c}else if(e.order==="ZXY"){const u=c*h,m=c*d,g=l*h,_=l*d;t[0]=u-_*a,t[4]=-o*d,t[8]=g+m*a,t[1]=m+g*a,t[5]=o*h,t[9]=_-u*a,t[2]=-o*l,t[6]=a,t[10]=o*c}else if(e.order==="ZYX"){const u=o*h,m=o*d,g=a*h,_=a*d;t[0]=c*h,t[4]=g*l-m,t[8]=u*l+_,t[1]=c*d,t[5]=_*l+u,t[9]=m*l-g,t[2]=-l,t[6]=a*c,t[10]=o*c}else if(e.order==="YZX"){const u=o*c,m=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=_-u*d,t[8]=g*d+m,t[1]=d,t[5]=o*h,t[9]=-a*h,t[2]=-l*h,t[6]=m*d+g,t[10]=u-_*d}else if(e.order==="XZY"){const u=o*c,m=o*l,g=a*c,_=a*l;t[0]=c*h,t[4]=-d,t[8]=l*h,t[1]=u*d+_,t[5]=o*h,t[9]=m*d-g,t[2]=g*d-m,t[6]=a*h,t[10]=_*d+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(qu,e,ju)}lookAt(e,t,n){const s=this.elements;return Ot.subVectors(e,t),Ot.lengthSq()===0&&(Ot.z=1),Ot.normalize(),Rn.crossVectors(n,Ot),Rn.lengthSq()===0&&(Math.abs(n.z)===1?Ot.x+=1e-4:Ot.z+=1e-4,Ot.normalize(),Rn.crossVectors(n,Ot)),Rn.normalize(),Us.crossVectors(Ot,Rn),s[0]=Rn.x,s[4]=Us.x,s[8]=Ot.x,s[1]=Rn.y,s[5]=Us.y,s[9]=Ot.y,s[2]=Rn.z,s[6]=Us.z,s[10]=Ot.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,s=t.elements,r=this.elements,o=n[0],a=n[4],c=n[8],l=n[12],h=n[1],d=n[5],u=n[9],m=n[13],g=n[2],_=n[6],f=n[10],p=n[14],x=n[3],v=n[7],S=n[11],R=n[15],A=s[0],T=s[4],C=s[8],b=s[12],y=s[1],P=s[5],N=s[9],U=s[13],G=s[2],Z=s[6],F=s[10],j=s[14],k=s[3],ie=s[7],se=s[11],he=s[15];return r[0]=o*A+a*y+c*G+l*k,r[4]=o*T+a*P+c*Z+l*ie,r[8]=o*C+a*N+c*F+l*se,r[12]=o*b+a*U+c*j+l*he,r[1]=h*A+d*y+u*G+m*k,r[5]=h*T+d*P+u*Z+m*ie,r[9]=h*C+d*N+u*F+m*se,r[13]=h*b+d*U+u*j+m*he,r[2]=g*A+_*y+f*G+p*k,r[6]=g*T+_*P+f*Z+p*ie,r[10]=g*C+_*N+f*F+p*se,r[14]=g*b+_*U+f*j+p*he,r[3]=x*A+v*y+S*G+R*k,r[7]=x*T+v*P+S*Z+R*ie,r[11]=x*C+v*N+S*F+R*se,r[15]=x*b+v*U+S*j+R*he,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],s=e[8],r=e[12],o=e[1],a=e[5],c=e[9],l=e[13],h=e[2],d=e[6],u=e[10],m=e[14],g=e[3],_=e[7],f=e[11],p=e[15];return g*(+r*c*d-s*l*d-r*a*u+n*l*u+s*a*m-n*c*m)+_*(+t*c*m-t*l*u+r*o*u-s*o*m+s*l*h-r*c*h)+f*(+t*l*d-t*a*m-r*o*d+n*o*m+r*a*h-n*l*h)+p*(-s*a*h-t*c*d+t*a*u+s*o*d-n*o*u+n*c*h)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const s=this.elements;return e.isVector3?(s[12]=e.x,s[13]=e.y,s[14]=e.z):(s[12]=e,s[13]=t,s[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],s=e[2],r=e[3],o=e[4],a=e[5],c=e[6],l=e[7],h=e[8],d=e[9],u=e[10],m=e[11],g=e[12],_=e[13],f=e[14],p=e[15],x=d*f*l-_*u*l+_*c*m-a*f*m-d*c*p+a*u*p,v=g*u*l-h*f*l-g*c*m+o*f*m+h*c*p-o*u*p,S=h*_*l-g*d*l+g*a*m-o*_*m-h*a*p+o*d*p,R=g*d*c-h*_*c-g*a*u+o*_*u+h*a*f-o*d*f,A=t*x+n*v+s*S+r*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const T=1/A;return e[0]=x*T,e[1]=(_*u*r-d*f*r-_*s*m+n*f*m+d*s*p-n*u*p)*T,e[2]=(a*f*r-_*c*r+_*s*l-n*f*l-a*s*p+n*c*p)*T,e[3]=(d*c*r-a*u*r-d*s*l+n*u*l+a*s*m-n*c*m)*T,e[4]=v*T,e[5]=(h*f*r-g*u*r+g*s*m-t*f*m-h*s*p+t*u*p)*T,e[6]=(g*c*r-o*f*r-g*s*l+t*f*l+o*s*p-t*c*p)*T,e[7]=(o*u*r-h*c*r+h*s*l-t*u*l-o*s*m+t*c*m)*T,e[8]=S*T,e[9]=(g*d*r-h*_*r-g*n*m+t*_*m+h*n*p-t*d*p)*T,e[10]=(o*_*r-g*a*r+g*n*l-t*_*l-o*n*p+t*a*p)*T,e[11]=(h*a*r-o*d*r-h*n*l+t*d*l+o*n*m-t*a*m)*T,e[12]=R*T,e[13]=(h*_*s-g*d*s+g*n*u-t*_*u-h*n*f+t*d*f)*T,e[14]=(g*a*s-o*_*s-g*n*c+t*_*c+o*n*f-t*a*f)*T,e[15]=(o*d*s-h*a*s+h*n*c-t*d*c-o*n*u+t*a*u)*T,this}scale(e){const t=this.elements,n=e.x,s=e.y,r=e.z;return t[0]*=n,t[4]*=s,t[8]*=r,t[1]*=n,t[5]*=s,t[9]*=r,t[2]*=n,t[6]*=s,t[10]*=r,t[3]*=n,t[7]*=s,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],s=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,s))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),s=Math.sin(t),r=1-n,o=e.x,a=e.y,c=e.z,l=r*o,h=r*a;return this.set(l*o+n,l*a-s*c,l*c+s*a,0,l*a+s*c,h*a+n,h*c-s*o,0,l*c-s*a,h*c+s*o,r*c*c+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,s,r,o){return this.set(1,n,r,0,e,1,o,0,t,s,1,0,0,0,0,1),this}compose(e,t,n){const s=this.elements,r=t._x,o=t._y,a=t._z,c=t._w,l=r+r,h=o+o,d=a+a,u=r*l,m=r*h,g=r*d,_=o*h,f=o*d,p=a*d,x=c*l,v=c*h,S=c*d,R=n.x,A=n.y,T=n.z;return s[0]=(1-(_+p))*R,s[1]=(m+S)*R,s[2]=(g-v)*R,s[3]=0,s[4]=(m-S)*A,s[5]=(1-(u+p))*A,s[6]=(f+x)*A,s[7]=0,s[8]=(g+v)*T,s[9]=(f-x)*T,s[10]=(1-(u+_))*T,s[11]=0,s[12]=e.x,s[13]=e.y,s[14]=e.z,s[15]=1,this}decompose(e,t,n){const s=this.elements;let r=vi.set(s[0],s[1],s[2]).length();const o=vi.set(s[4],s[5],s[6]).length(),a=vi.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),e.x=s[12],e.y=s[13],e.z=s[14],qt.copy(this);const l=1/r,h=1/o,d=1/a;return qt.elements[0]*=l,qt.elements[1]*=l,qt.elements[2]*=l,qt.elements[4]*=h,qt.elements[5]*=h,qt.elements[6]*=h,qt.elements[8]*=d,qt.elements[9]*=d,qt.elements[10]*=d,t.setFromRotationMatrix(qt),n.x=r,n.y=o,n.z=a,this}makePerspective(e,t,n,s,r,o,a=xn){const c=this.elements,l=2*r/(t-e),h=2*r/(n-s),d=(t+e)/(t-e),u=(n+s)/(n-s);let m,g;if(a===xn)m=-(o+r)/(o-r),g=-2*o*r/(o-r);else if(a===xr)m=-o/(o-r),g=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=l,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=h,c[9]=u,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=g,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,s,r,o,a=xn){const c=this.elements,l=1/(t-e),h=1/(n-s),d=1/(o-r),u=(t+e)*l,m=(n+s)*h;let g,_;if(a===xn)g=(o+r)*d,_=-2*d;else if(a===xr)g=r*d,_=-1*d;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=2*l,c[4]=0,c[8]=0,c[12]=-u,c[1]=0,c[5]=2*h,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=_,c[14]=-g,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let s=0;s<16;s++)if(t[s]!==n[s])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const vi=new L,qt=new it,qu=new L(0,0,0),ju=new L(1,1,1),Rn=new L,Us=new L,Ot=new L,rc=new it,oc=new Xt;class en{constructor(e=0,t=0,n=0,s=en.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=s}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,s=this._order){return this._x=e,this._y=t,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const s=e.elements,r=s[0],o=s[4],a=s[8],c=s[1],l=s[5],h=s[9],d=s[2],u=s[6],m=s[10];switch(t){case"XYZ":this._y=Math.asin(yt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-h,m),this._z=Math.atan2(-o,r)):(this._x=Math.atan2(u,l),this._z=0);break;case"YXZ":this._x=Math.asin(-yt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(a,m),this._z=Math.atan2(c,l)):(this._y=Math.atan2(-d,r),this._z=0);break;case"ZXY":this._x=Math.asin(yt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-d,m),this._z=Math.atan2(-o,l)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-yt(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(u,m),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-o,l));break;case"YZX":this._z=Math.asin(yt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-h,l),this._y=Math.atan2(-d,r)):(this._x=0,this._y=Math.atan2(a,m));break;case"XZY":this._z=Math.asin(-yt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(u,l),this._y=Math.atan2(a,r)):(this._x=Math.atan2(-h,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return rc.makeRotationFromQuaternion(e),this.setFromRotationMatrix(rc,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return oc.setFromEuler(this),this.setFromQuaternion(oc,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}en.DEFAULT_ORDER="XYZ";class ra{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let $u=0;const ac=new L,xi=new Xt,hn=new it,Os=new L,ts=new L,Ku=new L,Ju=new Xt,cc=new L(1,0,0),lc=new L(0,1,0),hc=new L(0,0,1),dc={type:"added"},Qu={type:"removed"},Si={type:"childadded",child:null},co={type:"childremoved",child:null};class bt extends hi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$u++}),this.uuid=rn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=bt.DEFAULT_UP.clone();const e=new L,t=new en,n=new Xt,s=new L(1,1,1);function r(){n.setFromEuler(t,!1)}function o(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new it},normalMatrix:{value:new ke}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=bt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ra,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return xi.setFromAxisAngle(e,t),this.quaternion.multiply(xi),this}rotateOnWorldAxis(e,t){return xi.setFromAxisAngle(e,t),this.quaternion.premultiply(xi),this}rotateX(e){return this.rotateOnAxis(cc,e)}rotateY(e){return this.rotateOnAxis(lc,e)}rotateZ(e){return this.rotateOnAxis(hc,e)}translateOnAxis(e,t){return ac.copy(e).applyQuaternion(this.quaternion),this.position.add(ac.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(cc,e)}translateY(e){return this.translateOnAxis(lc,e)}translateZ(e){return this.translateOnAxis(hc,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(hn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?Os.copy(e):Os.set(e,t,n);const s=this.parent;this.updateWorldMatrix(!0,!1),ts.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hn.lookAt(ts,Os,this.up):hn.lookAt(Os,ts,this.up),this.quaternion.setFromRotationMatrix(hn),s&&(hn.extractRotation(s.matrixWorld),xi.setFromRotationMatrix(hn),this.quaternion.premultiply(xi.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(dc),Si.child=e,this.dispatchEvent(Si),Si.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Qu),co.child=e,this.dispatchEvent(co),co.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),hn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),hn.multiply(e.parent.matrixWorld)),e.applyMatrix4(hn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(dc),Si.child=e,this.dispatchEvent(Si),Si.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,s=this.children.length;n<s;n++){const o=this.children[n].getObjectByProperty(e,t);if(o!==void 0)return o}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const s=this.children;for(let r=0,o=s.length;r<o;r++)s[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ts,e,Ku),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ts,Ju,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,s=t.length;n<s;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,s=t.length;n<s;n++){const r=t[n];(r.matrixWorldAutoUpdate===!0||e===!0)&&r.updateMatrixWorld(e)}}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),t===!0){const s=this.children;for(let r=0,o=s.length;r<o;r++){const a=s[r];a.matrixWorldAutoUpdate===!0&&a.updateWorldMatrix(!1,!0)}}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(a=>({boxInitialized:a.boxInitialized,boxMin:a.box.min.toArray(),boxMax:a.box.max.toArray(),sphereInitialized:a.sphereInitialized,sphereRadius:a.sphere.radius,sphereCenter:a.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(a,c){return a[c.uuid]===void 0&&(a[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const c=a.shapes;if(Array.isArray(c))for(let l=0,h=c.length;l<h;l++){const d=c[l];r(e.shapes,d)}else r(e.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let c=0,l=this.material.length;c<l;c++)a.push(r(e.materials,this.material[c]));s.material=a}else s.material=r(e.materials,this.material);if(this.children.length>0){s.children=[];for(let a=0;a<this.children.length;a++)s.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){s.animations=[];for(let a=0;a<this.animations.length;a++){const c=this.animations[a];s.animations.push(r(e.animations,c))}}if(t){const a=o(e.geometries),c=o(e.materials),l=o(e.textures),h=o(e.images),d=o(e.shapes),u=o(e.skeletons),m=o(e.animations),g=o(e.nodes);a.length>0&&(n.geometries=a),c.length>0&&(n.materials=c),l.length>0&&(n.textures=l),h.length>0&&(n.images=h),d.length>0&&(n.shapes=d),u.length>0&&(n.skeletons=u),m.length>0&&(n.animations=m),g.length>0&&(n.nodes=g)}return n.object=s,n;function o(a){const c=[];for(const l in a){const h=a[l];delete h.metadata,c.push(h)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const s=e.children[n];this.add(s.clone())}return this}}bt.DEFAULT_UP=new L(0,1,0);bt.DEFAULT_MATRIX_AUTO_UPDATE=!0;bt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const jt=new L,dn=new L,lo=new L,un=new L,Mi=new L,yi=new L,uc=new L,ho=new L,uo=new L,po=new L;class Vt{constructor(e=new L,t=new L,n=new L){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,s){s.subVectors(n,t),jt.subVectors(e,t),s.cross(jt);const r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(e,t,n,s,r){jt.subVectors(s,t),dn.subVectors(n,t),lo.subVectors(e,t);const o=jt.dot(jt),a=jt.dot(dn),c=jt.dot(lo),l=dn.dot(dn),h=dn.dot(lo),d=o*l-a*a;if(d===0)return r.set(0,0,0),null;const u=1/d,m=(l*c-a*h)*u,g=(o*h-a*c)*u;return r.set(1-m-g,g,m)}static containsPoint(e,t,n,s){return this.getBarycoord(e,t,n,s,un)===null?!1:un.x>=0&&un.y>=0&&un.x+un.y<=1}static getInterpolation(e,t,n,s,r,o,a,c){return this.getBarycoord(e,t,n,s,un)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,un.x),c.addScaledVector(o,un.y),c.addScaledVector(a,un.z),c)}static isFrontFacing(e,t,n,s){return jt.subVectors(n,t),dn.subVectors(e,t),jt.cross(dn).dot(s)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,s){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[s]),this}setFromAttributeAndIndices(e,t,n,s){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,s),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return jt.subVectors(this.c,this.b),dn.subVectors(this.a,this.b),jt.cross(dn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Vt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Vt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,s,r){return Vt.getInterpolation(e,this.a,this.b,this.c,t,n,s,r)}containsPoint(e){return Vt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Vt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,s=this.b,r=this.c;let o,a;Mi.subVectors(s,n),yi.subVectors(r,n),ho.subVectors(e,n);const c=Mi.dot(ho),l=yi.dot(ho);if(c<=0&&l<=0)return t.copy(n);uo.subVectors(e,s);const h=Mi.dot(uo),d=yi.dot(uo);if(h>=0&&d<=h)return t.copy(s);const u=c*d-h*l;if(u<=0&&c>=0&&h<=0)return o=c/(c-h),t.copy(n).addScaledVector(Mi,o);po.subVectors(e,r);const m=Mi.dot(po),g=yi.dot(po);if(g>=0&&m<=g)return t.copy(r);const _=m*l-c*g;if(_<=0&&l>=0&&g<=0)return a=l/(l-g),t.copy(n).addScaledVector(yi,a);const f=h*g-m*d;if(f<=0&&d-h>=0&&m-g>=0)return uc.subVectors(r,s),a=(d-h)/(d-h+(m-g)),t.copy(s).addScaledVector(uc,a);const p=1/(f+_+u);return o=_*p,a=u*p,t.copy(n).addScaledVector(Mi,o).addScaledVector(yi,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const eh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Cn={h:0,s:0,l:0},Fs={h:0,s:0,l:0};function fo(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class ve{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const s=e;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=tn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.toWorkingColorSpace(this,t),this}setRGB(e,t,n,s=et.workingColorSpace){return this.r=e,this.g=t,this.b=n,et.toWorkingColorSpace(this,s),this}setHSL(e,t,n,s=et.workingColorSpace){if(e=ia(e,1),t=yt(t,0,1),n=yt(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=fo(o,r,e+1/3),this.g=fo(o,r,e),this.b=fo(o,r,e-1/3)}return et.toWorkingColorSpace(this,s),this}setStyle(e,t=tn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const o=s[1],a=s[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=s[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=tn){const n=eh[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Gi(e.r),this.g=Gi(e.g),this.b=Gi(e.b),this}copyLinearToSRGB(e){return this.r=eo(e.r),this.g=eo(e.g),this.b=eo(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=tn){return et.fromWorkingColorSpace(wt.copy(this),e),Math.round(yt(wt.r*255,0,255))*65536+Math.round(yt(wt.g*255,0,255))*256+Math.round(yt(wt.b*255,0,255))}getHexString(e=tn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=et.workingColorSpace){et.fromWorkingColorSpace(wt.copy(this),t);const n=wt.r,s=wt.g,r=wt.b,o=Math.max(n,s,r),a=Math.min(n,s,r);let c,l;const h=(a+o)/2;if(a===o)c=0,l=0;else{const d=o-a;switch(l=h<=.5?d/(o+a):d/(2-o-a),o){case n:c=(s-r)/d+(s<r?6:0);break;case s:c=(r-n)/d+2;break;case r:c=(n-s)/d+4;break}c/=6}return e.h=c,e.s=l,e.l=h,e}getRGB(e,t=et.workingColorSpace){return et.fromWorkingColorSpace(wt.copy(this),t),e.r=wt.r,e.g=wt.g,e.b=wt.b,e}getStyle(e=tn){et.fromWorkingColorSpace(wt.copy(this),e);const t=wt.r,n=wt.g,s=wt.b;return e!==tn?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(e,t,n){return this.getHSL(Cn),this.setHSL(Cn.h+e,Cn.s+t,Cn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Cn),e.getHSL(Fs);const n=ls(Cn.h,Fs.h,t),s=ls(Cn.s,Fs.s,t),r=ls(Cn.l,Fs.l,t);return this.setHSL(n,s,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,s=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*s,this.g=r[1]*t+r[4]*n+r[7]*s,this.b=r[2]*t+r[5]*n+r[8]*s,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const wt=new ve;ve.NAMES=eh;let ep=0;class di extends hi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:ep++}),this.uuid=rn(),this.name="",this.type="Material",this.blending=zi,this.side=kn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ko,this.blendDst=Ho,this.blendEquation=ti,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ve(0,0,0),this.blendAlpha=0,this.depthFunc=pr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ja,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=pi,this.stencilZFail=pi,this.stencilZPass=pi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const s=this[t];if(s===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==zi&&(n.blending=this.blending),this.side!==kn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ko&&(n.blendSrc=this.blendSrc),this.blendDst!==Ho&&(n.blendDst=this.blendDst),this.blendEquation!==ti&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==pr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ja&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==pi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==pi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==pi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){const o=[];for(const a in r){const c=r[a];delete c.metadata,o.push(c)}return o}if(t){const r=s(e.textures),o=s(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const s=t.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class Qt extends di{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ve(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new en,this.combine=Hl,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const _t=new L,Bs=new K;class It{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Xo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Un,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return sa("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[e+s]=t.array[n+s];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Bs.fromBufferAttribute(this,t),Bs.applyMatrix3(e),this.setXY(t,Bs.x,Bs.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Jt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Qe(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Jt(t,this.array)),t}setX(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Jt(t,this.array)),t}setY(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Jt(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Jt(t,this.array)),t}setW(e,t){return this.normalized&&(t=Qe(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,s){return e*=this.itemSize,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),s=Qe(s,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e*=this.itemSize,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),s=Qe(s,this.array),r=Qe(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=s,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xo&&(e.usage=this.usage),e}}class th extends It{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class nh extends It{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Ce extends It{constructor(e,t,n){super(new Float32Array(e),t,n)}}let tp=0;const Gt=new it,mo=new bt,bi=new L,Ft=new xs,ns=new xs,Mt=new L;class Fe extends hi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:tp++}),this.uuid=rn(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Kl(e)?nh:th)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new ke().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(e),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Gt.makeRotationFromQuaternion(e),this.applyMatrix4(Gt),this}rotateX(e){return Gt.makeRotationX(e),this.applyMatrix4(Gt),this}rotateY(e){return Gt.makeRotationY(e),this.applyMatrix4(Gt),this}rotateZ(e){return Gt.makeRotationZ(e),this.applyMatrix4(Gt),this}translate(e,t,n){return Gt.makeTranslation(e,t,n),this.applyMatrix4(Gt),this}scale(e,t,n){return Gt.makeScale(e,t,n),this.applyMatrix4(Gt),this}lookAt(e){return mo.lookAt(e),mo.updateMatrix(),this.applyMatrix4(mo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(bi).negate(),this.translate(bi.x,bi.y,bi.z),this}setFromPoints(e){const t=[];for(let n=0,s=e.length;n<s;n++){const r=e[n];t.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Ce(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new xs);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,s=t.length;n<s;n++){const r=t[n];Ft.setFromBufferAttribute(r),this.morphTargetsRelative?(Mt.addVectors(this.boundingBox.min,Ft.min),this.boundingBox.expandByPoint(Mt),Mt.addVectors(this.boundingBox.max,Ft.max),this.boundingBox.expandByPoint(Mt)):(this.boundingBox.expandByPoint(Ft.min),this.boundingBox.expandByPoint(Ft.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Nr);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const n=this.boundingSphere.center;if(Ft.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){const a=t[r];ns.setFromBufferAttribute(a),this.morphTargetsRelative?(Mt.addVectors(Ft.min,ns.min),Ft.expandByPoint(Mt),Mt.addVectors(Ft.max,ns.max),Ft.expandByPoint(Mt)):(Ft.expandByPoint(ns.min),Ft.expandByPoint(ns.max))}Ft.getCenter(n);let s=0;for(let r=0,o=e.count;r<o;r++)Mt.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Mt));if(t)for(let r=0,o=t.length;r<o;r++){const a=t[r],c=this.morphTargetsRelative;for(let l=0,h=a.count;l<h;l++)Mt.fromBufferAttribute(a,l),c&&(bi.fromBufferAttribute(e,l),Mt.add(bi)),s=Math.max(s,n.distanceToSquared(Mt))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,s=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new It(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],c=[];for(let C=0;C<n.count;C++)a[C]=new L,c[C]=new L;const l=new L,h=new L,d=new L,u=new K,m=new K,g=new K,_=new L,f=new L;function p(C,b,y){l.fromBufferAttribute(n,C),h.fromBufferAttribute(n,b),d.fromBufferAttribute(n,y),u.fromBufferAttribute(r,C),m.fromBufferAttribute(r,b),g.fromBufferAttribute(r,y),h.sub(l),d.sub(l),m.sub(u),g.sub(u);const P=1/(m.x*g.y-g.x*m.y);isFinite(P)&&(_.copy(h).multiplyScalar(g.y).addScaledVector(d,-m.y).multiplyScalar(P),f.copy(d).multiplyScalar(m.x).addScaledVector(h,-g.x).multiplyScalar(P),a[C].add(_),a[b].add(_),a[y].add(_),c[C].add(f),c[b].add(f),c[y].add(f))}let x=this.groups;x.length===0&&(x=[{start:0,count:e.count}]);for(let C=0,b=x.length;C<b;++C){const y=x[C],P=y.start,N=y.count;for(let U=P,G=P+N;U<G;U+=3)p(e.getX(U+0),e.getX(U+1),e.getX(U+2))}const v=new L,S=new L,R=new L,A=new L;function T(C){R.fromBufferAttribute(s,C),A.copy(R);const b=a[C];v.copy(b),v.sub(R.multiplyScalar(R.dot(b))).normalize(),S.crossVectors(A,b);const P=S.dot(c[C])<0?-1:1;o.setXYZW(C,v.x,v.y,v.z,P)}for(let C=0,b=x.length;C<b;++C){const y=x[C],P=y.start,N=y.count;for(let U=P,G=P+N;U<G;U+=3)T(e.getX(U+0)),T(e.getX(U+1)),T(e.getX(U+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new It(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,m=n.count;u<m;u++)n.setXYZ(u,0,0,0);const s=new L,r=new L,o=new L,a=new L,c=new L,l=new L,h=new L,d=new L;if(e)for(let u=0,m=e.count;u<m;u+=3){const g=e.getX(u+0),_=e.getX(u+1),f=e.getX(u+2);s.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,f),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),a.fromBufferAttribute(n,g),c.fromBufferAttribute(n,_),l.fromBufferAttribute(n,f),a.add(h),c.add(h),l.add(h),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(_,c.x,c.y,c.z),n.setXYZ(f,l.x,l.y,l.z)}else for(let u=0,m=t.count;u<m;u+=3)s.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),o.fromBufferAttribute(t,u+2),h.subVectors(o,r),d.subVectors(s,r),h.cross(d),n.setXYZ(u+0,h.x,h.y,h.z),n.setXYZ(u+1,h.x,h.y,h.z),n.setXYZ(u+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Mt.fromBufferAttribute(e,t),Mt.normalize(),e.setXYZ(t,Mt.x,Mt.y,Mt.z)}toNonIndexed(){function e(a,c){const l=a.array,h=a.itemSize,d=a.normalized,u=new l.constructor(c.length*h);let m=0,g=0;for(let _=0,f=c.length;_<f;_++){a.isInterleavedBufferAttribute?m=c[_]*a.data.stride+a.offset:m=c[_]*h;for(let p=0;p<h;p++)u[g++]=l[m++]}return new It(u,h,d)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Fe,n=this.index.array,s=this.attributes;for(const a in s){const c=s[a],l=e(c,n);t.setAttribute(a,l)}const r=this.morphAttributes;for(const a in r){const c=[],l=r[a];for(let h=0,d=l.length;h<d;h++){const u=l[h],m=e(u,n);c.push(m)}t.morphAttributes[a]=c}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,c=o.length;a<c;a++){const l=o[a];t.addGroup(l.start,l.count,l.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const l in c)c[l]!==void 0&&(e[l]=c[l]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const c in n){const l=n[c];e.data.attributes[c]=l.toJSON(e.data)}const s={};let r=!1;for(const c in this.morphAttributes){const l=this.morphAttributes[c],h=[];for(let d=0,u=l.length;d<u;d++){const m=l[d];h.push(m.toJSON(e.data))}h.length>0&&(s[c]=h,r=!0)}r&&(e.data.morphAttributes=s,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere={center:a.center.toArray(),radius:a.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone(t));const s=e.attributes;for(const l in s){const h=s[l];this.setAttribute(l,h.clone(t))}const r=e.morphAttributes;for(const l in r){const h=[],d=r[l];for(let u=0,m=d.length;u<m;u++)h.push(d[u].clone(t));this.morphAttributes[l]=h}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let l=0,h=o.length;l<h;l++){const d=o[l];this.addGroup(d.start,d.count,d.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const pc=new it,jn=new Ur,zs=new Nr,fc=new L,Ei=new L,Ai=new L,Ti=new L,go=new L,ks=new L,Hs=new K,Gs=new K,Vs=new K,mc=new L,gc=new L,_c=new L,Ws=new L,Xs=new L;class Be extends bt{constructor(e=new Fe,t=new Qt){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}getVertexPosition(e,t){const n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(s,e);const a=this.morphTargetInfluences;if(r&&a){ks.set(0,0,0);for(let c=0,l=r.length;c<l;c++){const h=a[c],d=r[c];h!==0&&(go.fromBufferAttribute(d,e),o?ks.addScaledVector(go,h):ks.addScaledVector(go.sub(t),h))}t.add(ks)}return t}raycast(e,t){const n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),zs.copy(n.boundingSphere),zs.applyMatrix4(r),jn.copy(e.ray).recast(e.near),!(zs.containsPoint(jn.origin)===!1&&(jn.intersectSphere(zs,fc)===null||jn.origin.distanceToSquared(fc)>(e.far-e.near)**2))&&(pc.copy(r).invert(),jn.copy(e.ray).applyMatrix4(pc),!(n.boundingBox!==null&&jn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,jn)))}_computeIntersections(e,t,n){let s;const r=this.geometry,o=this.material,a=r.index,c=r.attributes.position,l=r.attributes.uv,h=r.attributes.uv1,d=r.attributes.normal,u=r.groups,m=r.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const f=u[g],p=o[f.materialIndex],x=Math.max(f.start,m.start),v=Math.min(a.count,Math.min(f.start+f.count,m.start+m.count));for(let S=x,R=v;S<R;S+=3){const A=a.getX(S),T=a.getX(S+1),C=a.getX(S+2);s=Ys(this,p,e,n,l,h,d,A,T,C),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(a.count,m.start+m.count);for(let f=g,p=_;f<p;f+=3){const x=a.getX(f),v=a.getX(f+1),S=a.getX(f+2);s=Ys(this,o,e,n,l,h,d,x,v,S),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}else if(c!==void 0)if(Array.isArray(o))for(let g=0,_=u.length;g<_;g++){const f=u[g],p=o[f.materialIndex],x=Math.max(f.start,m.start),v=Math.min(c.count,Math.min(f.start+f.count,m.start+m.count));for(let S=x,R=v;S<R;S+=3){const A=S,T=S+1,C=S+2;s=Ys(this,p,e,n,l,h,d,A,T,C),s&&(s.faceIndex=Math.floor(S/3),s.face.materialIndex=f.materialIndex,t.push(s))}}else{const g=Math.max(0,m.start),_=Math.min(c.count,m.start+m.count);for(let f=g,p=_;f<p;f+=3){const x=f,v=f+1,S=f+2;s=Ys(this,o,e,n,l,h,d,x,v,S),s&&(s.faceIndex=Math.floor(f/3),t.push(s))}}}}function np(i,e,t,n,s,r,o,a){let c;if(e.side===Lt?c=n.intersectTriangle(o,r,s,!0,a):c=n.intersectTriangle(s,r,o,e.side===kn,a),c===null)return null;Xs.copy(a),Xs.applyMatrix4(i.matrixWorld);const l=t.ray.origin.distanceTo(Xs);return l<t.near||l>t.far?null:{distance:l,point:Xs.clone(),object:i}}function Ys(i,e,t,n,s,r,o,a,c,l){i.getVertexPosition(a,Ei),i.getVertexPosition(c,Ai),i.getVertexPosition(l,Ti);const h=np(i,e,t,n,Ei,Ai,Ti,Ws);if(h){s&&(Hs.fromBufferAttribute(s,a),Gs.fromBufferAttribute(s,c),Vs.fromBufferAttribute(s,l),h.uv=Vt.getInterpolation(Ws,Ei,Ai,Ti,Hs,Gs,Vs,new K)),r&&(Hs.fromBufferAttribute(r,a),Gs.fromBufferAttribute(r,c),Vs.fromBufferAttribute(r,l),h.uv1=Vt.getInterpolation(Ws,Ei,Ai,Ti,Hs,Gs,Vs,new K)),o&&(mc.fromBufferAttribute(o,a),gc.fromBufferAttribute(o,c),_c.fromBufferAttribute(o,l),h.normal=Vt.getInterpolation(Ws,Ei,Ai,Ti,mc,gc,_c,new L),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));const d={a,b:c,c:l,normal:new L,materialIndex:0};Vt.getNormal(Ei,Ai,Ti,d.normal),h.face=d}return h}class Ss extends Fe{constructor(e=1,t=1,n=1,s=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:s,heightSegments:r,depthSegments:o};const a=this;s=Math.floor(s),r=Math.floor(r),o=Math.floor(o);const c=[],l=[],h=[],d=[];let u=0,m=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,s,o,2),g("x","z","y",1,-1,e,n,-t,s,o,3),g("x","y","z",1,-1,e,t,n,s,r,4),g("x","y","z",-1,-1,e,t,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new Ce(l,3)),this.setAttribute("normal",new Ce(h,3)),this.setAttribute("uv",new Ce(d,2));function g(_,f,p,x,v,S,R,A,T,C,b){const y=S/T,P=R/C,N=S/2,U=R/2,G=A/2,Z=T+1,F=C+1;let j=0,k=0;const ie=new L;for(let se=0;se<F;se++){const he=se*P-U;for(let we=0;we<Z;we++){const Le=we*y-N;ie[_]=Le*x,ie[f]=he*v,ie[p]=G,l.push(ie.x,ie.y,ie.z),ie[_]=0,ie[f]=0,ie[p]=A>0?1:-1,h.push(ie.x,ie.y,ie.z),d.push(we/T),d.push(1-se/C),j+=1}}for(let se=0;se<C;se++)for(let he=0;he<T;he++){const we=u+he+Z*se,Le=u+he+Z*(se+1),$=u+(he+1)+Z*(se+1),ee=u+(he+1)+Z*se;c.push(we,Le,ee),c.push(Le,$,ee),k+=6}a.addGroup(m,k,b),m+=k,u+=j}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ss(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ji(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const s=i[t][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=s.clone():Array.isArray(s)?e[t][n]=s.slice():e[t][n]=s}}return e}function Pt(i){const e={};for(let t=0;t<i.length;t++){const n=ji(i[t]);for(const s in n)e[s]=n[s]}return e}function ip(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function ih(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const sp={clone:ji,merge:Pt};var rp=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,op=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Gn extends di{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=rp,this.fragmentShader=op,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ji(e.uniforms),this.uniformsGroups=ip(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const s in this.uniforms){const o=this.uniforms[s].value;o&&o.isTexture?t.uniforms[s]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[s]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[s]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[s]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[s]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[s]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[s]={type:"m4",value:o.toArray()}:t.uniforms[s]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class sh extends bt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=xn}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Pn=new L,vc=new K,xc=new K;class Bt extends sh{constructor(e=50,t=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=ps*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Hi*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ps*2*Math.atan(Math.tan(Hi*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Pn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Pn.x,Pn.y).multiplyScalar(-e/Pn.z),Pn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Pn.x,Pn.y).multiplyScalar(-e/Pn.z)}getViewSize(e,t){return this.getViewBounds(e,vc,xc),t.subVectors(xc,vc)}setViewOffset(e,t,n,s,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(Hi*.5*this.fov)/this.zoom,n=2*t,s=this.aspect*n,r=-.5*s;const o=this.view;if(this.view!==null&&this.view.enabled){const c=o.fullWidth,l=o.fullHeight;r+=o.offsetX*s/c,t-=o.offsetY*n/l,s*=o.width/c,n*=o.height/l}const a=this.filmOffset;a!==0&&(r+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,t,t-n,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const wi=-90,Ri=1;class ap extends bt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const s=new Bt(wi,Ri,e,t);s.layers=this.layers,this.add(s);const r=new Bt(wi,Ri,e,t);r.layers=this.layers,this.add(r);const o=new Bt(wi,Ri,e,t);o.layers=this.layers,this.add(o);const a=new Bt(wi,Ri,e,t);a.layers=this.layers,this.add(a);const c=new Bt(wi,Ri,e,t);c.layers=this.layers,this.add(c);const l=new Bt(wi,Ri,e,t);l.layers=this.layers,this.add(l)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,s,r,o,a,c]=t;for(const l of t)this.remove(l);if(e===xn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===xr)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const l of t)this.add(l),l.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,o,a,c,l,h]=this.children,d=e.getRenderTarget(),u=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,s),e.render(t,r),e.setRenderTarget(n,1,s),e.render(t,o),e.setRenderTarget(n,2,s),e.render(t,a),e.setRenderTarget(n,3,s),e.render(t,c),e.setRenderTarget(n,4,s),e.render(t,l),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,s),e.render(t,h),e.setRenderTarget(d,u,m),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class rh extends At{constructor(e,t,n,s,r,o,a,c,l,h){e=e!==void 0?e:[],t=t!==void 0?t:Wi,super(e,t,n,s,r,o,a,c,l,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class cp extends ci{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},s=[n,n,n,n,n,n];this.texture=new rh(s,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Kt}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ss(5,5,5),r=new Gn({name:"CubemapFromEquirect",uniforms:ji(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Lt,blending:On});r.uniforms.tEquirect.value=t;const o=new Be(s,r),a=t.minFilter;return t.minFilter===si&&(t.minFilter=Kt),new ap(1,10,this).update(e,o),t.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,n,s){const r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,s);e.setRenderTarget(r)}}const _o=new L,lp=new L,hp=new ke;class _n{constructor(e=new L(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,s){return this.normal.set(e,t,n),this.constant=s,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const s=_o.subVectors(n,t).cross(lp.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(s,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(_o),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||hp.getNormalMatrix(e),s=this.coplanarPoint(_o).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const $n=new Nr,Zs=new L;class oa{constructor(e=new _n,t=new _n,n=new _n,s=new _n,r=new _n,o=new _n){this.planes=[e,t,n,s,r,o]}set(e,t,n,s,r,o){const a=this.planes;return a[0].copy(e),a[1].copy(t),a[2].copy(n),a[3].copy(s),a[4].copy(r),a[5].copy(o),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=xn){const n=this.planes,s=e.elements,r=s[0],o=s[1],a=s[2],c=s[3],l=s[4],h=s[5],d=s[6],u=s[7],m=s[8],g=s[9],_=s[10],f=s[11],p=s[12],x=s[13],v=s[14],S=s[15];if(n[0].setComponents(c-r,u-l,f-m,S-p).normalize(),n[1].setComponents(c+r,u+l,f+m,S+p).normalize(),n[2].setComponents(c+o,u+h,f+g,S+x).normalize(),n[3].setComponents(c-o,u-h,f-g,S-x).normalize(),n[4].setComponents(c-a,u-d,f-_,S-v).normalize(),t===xn)n[5].setComponents(c+a,u+d,f+_,S+v).normalize();else if(t===xr)n[5].setComponents(a,d,_,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),$n.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),$n.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere($n)}intersectsSprite(e){return $n.center.set(0,0,0),$n.radius=.7071067811865476,$n.applyMatrix4(e.matrixWorld),this.intersectsSphere($n)}intersectsSphere(e){const t=this.planes,n=e.center,s=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const s=t[n];if(Zs.x=s.normal.x>0?e.max.x:e.min.x,Zs.y=s.normal.y>0?e.max.y:e.min.y,Zs.z=s.normal.z>0?e.max.z:e.min.z,s.distanceToPoint(Zs)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function oh(){let i=null,e=!1,t=null,n=null;function s(r,o){t(r,o),n=i.requestAnimationFrame(s)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(s),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function dp(i){const e=new WeakMap;function t(a,c){const l=a.array,h=a.usage,d=l.byteLength,u=i.createBuffer();i.bindBuffer(c,u),i.bufferData(c,l,h),a.onUploadCallback();let m;if(l instanceof Float32Array)m=i.FLOAT;else if(l instanceof Uint16Array)a.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(l instanceof Int16Array)m=i.SHORT;else if(l instanceof Uint32Array)m=i.UNSIGNED_INT;else if(l instanceof Int32Array)m=i.INT;else if(l instanceof Int8Array)m=i.BYTE;else if(l instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(l instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+l);return{buffer:u,type:m,bytesPerElement:l.BYTES_PER_ELEMENT,version:a.version,size:d}}function n(a,c,l){const h=c.array,d=c._updateRange,u=c.updateRanges;if(i.bindBuffer(l,a),d.count===-1&&u.length===0&&i.bufferSubData(l,0,h),u.length!==0){for(let m=0,g=u.length;m<g;m++){const _=u[m];i.bufferSubData(l,_.start*h.BYTES_PER_ELEMENT,h,_.start,_.count)}c.clearUpdateRanges()}d.count!==-1&&(i.bufferSubData(l,d.offset*h.BYTES_PER_ELEMENT,h,d.offset,d.count),d.count=-1),c.onUploadCallback()}function s(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function r(a){a.isInterleavedBufferAttribute&&(a=a.data);const c=e.get(a);c&&(i.deleteBuffer(c.buffer),e.delete(a))}function o(a,c){if(a.isGLBufferAttribute){const h=e.get(a);(!h||h.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);if(l===void 0)e.set(a,t(a,c));else if(l.version<a.version){if(l.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(l.buffer,a,c),l.version=a.version}}return{get:s,remove:r,update:o}}class Or extends Fe{constructor(e=1,t=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:s};const r=e/2,o=t/2,a=Math.floor(n),c=Math.floor(s),l=a+1,h=c+1,d=e/a,u=t/c,m=[],g=[],_=[],f=[];for(let p=0;p<h;p++){const x=p*u-o;for(let v=0;v<l;v++){const S=v*d-r;g.push(S,-x,0),_.push(0,0,1),f.push(v/a),f.push(1-p/c)}}for(let p=0;p<c;p++)for(let x=0;x<a;x++){const v=x+l*p,S=x+l*(p+1),R=x+1+l*(p+1),A=x+1+l*p;m.push(v,S,A),m.push(S,R,A)}this.setIndex(m),this.setAttribute("position",new Ce(g,3)),this.setAttribute("normal",new Ce(_,3)),this.setAttribute("uv",new Ce(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Or(e.width,e.height,e.widthSegments,e.heightSegments)}}var up=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,pp=`#ifdef USE_ALPHAHASH
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
#endif`,fp=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,mp=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,gp=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,_p=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,vp=`#ifdef USE_AOMAP
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
#endif`,xp=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Sp=`#ifdef USE_BATCHING
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
#endif`,Mp=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,yp=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,bp=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ep=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Ap=`#ifdef USE_IRIDESCENCE
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
#endif`,Tp=`#ifdef USE_BUMPMAP
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
#endif`,wp=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Rp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Cp=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Pp=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Lp=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Ip=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Dp=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Np=`#if defined( USE_COLOR_ALPHA )
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
#endif`,Up=`#define PI 3.141592653589793
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
} // validated`,Op=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,Fp=`vec3 transformedNormal = objectNormal;
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
#endif`,Bp=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,zp=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,kp=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Hp=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Gp="gl_FragColor = linearToOutputTexel( gl_FragColor );",Vp=`
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
}`,Wp=`#ifdef USE_ENVMAP
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
#endif`,Xp=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Yp=`#ifdef USE_ENVMAP
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
#endif`,Zp=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,qp=`#ifdef USE_ENVMAP
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
#endif`,jp=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,$p=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Kp=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Jp=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Qp=`#ifdef USE_GRADIENTMAP
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
}`,ef=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,tf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,nf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,sf=`uniform bool receiveShadow;
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
#endif`,rf=`#ifdef USE_ENVMAP
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
#endif`,of=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,af=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,cf=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,lf=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,hf=`PhysicalMaterial material;
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
#endif`,df=`struct PhysicalMaterial {
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
}`,uf=`
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
#endif`,pf=`#if defined( RE_IndirectDiffuse )
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
#endif`,ff=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,mf=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,gf=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,_f=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,vf=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,xf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Sf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Mf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,yf=`#if defined( USE_POINTS_UV )
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
#endif`,bf=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Ef=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Af=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Tf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,wf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Rf=`#ifdef USE_MORPHTARGETS
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
#endif`,Cf=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Pf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Lf=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,If=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Df=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Nf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Uf=`#ifdef USE_NORMALMAP
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
#endif`,Of=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Ff=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Bf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,zf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,kf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Hf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Gf=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Vf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Wf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Xf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Yf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Zf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,qf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,$f=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Kf=`float getShadowMask() {
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
}`,Jf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Qf=`#ifdef USE_SKINNING
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
#endif`,em=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,tm=`#ifdef USE_SKINNING
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
#endif`,nm=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,im=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,sm=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,rm=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,om=`#ifdef USE_TRANSMISSION
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
#endif`,am=`#ifdef USE_TRANSMISSION
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
#endif`,cm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,lm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,hm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,dm=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const um=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,pm=`uniform sampler2D t2D;
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
}`,fm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,mm=`#ifdef ENVMAP_TYPE_CUBE
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
}`,gm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,_m=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vm=`#include <common>
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
}`,xm=`#if DEPTH_PACKING == 3200
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
}`,Sm=`#define DISTANCE
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
}`,Mm=`#define DISTANCE
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
}`,ym=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,bm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Em=`uniform float scale;
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
}`,Am=`uniform vec3 diffuse;
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
}`,Tm=`#include <common>
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
}`,wm=`uniform vec3 diffuse;
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
}`,Rm=`#define LAMBERT
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
}`,Cm=`#define LAMBERT
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
}`,Pm=`#define MATCAP
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
}`,Lm=`#define MATCAP
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
}`,Im=`#define NORMAL
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
}`,Dm=`#define NORMAL
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
}`,Nm=`#define PHONG
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
}`,Um=`#define PHONG
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
}`,Om=`#define STANDARD
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
}`,Fm=`#define STANDARD
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
}`,Bm=`#define TOON
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
}`,zm=`#define TOON
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
}`,km=`uniform float size;
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
}`,Hm=`uniform vec3 diffuse;
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
}`,Gm=`#include <common>
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
}`,Vm=`uniform vec3 color;
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
}`,Wm=`uniform float rotation;
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
}`,Xm=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:up,alphahash_pars_fragment:pp,alphamap_fragment:fp,alphamap_pars_fragment:mp,alphatest_fragment:gp,alphatest_pars_fragment:_p,aomap_fragment:vp,aomap_pars_fragment:xp,batching_pars_vertex:Sp,batching_vertex:Mp,begin_vertex:yp,beginnormal_vertex:bp,bsdfs:Ep,iridescence_fragment:Ap,bumpmap_pars_fragment:Tp,clipping_planes_fragment:wp,clipping_planes_pars_fragment:Rp,clipping_planes_pars_vertex:Cp,clipping_planes_vertex:Pp,color_fragment:Lp,color_pars_fragment:Ip,color_pars_vertex:Dp,color_vertex:Np,common:Up,cube_uv_reflection_fragment:Op,defaultnormal_vertex:Fp,displacementmap_pars_vertex:Bp,displacementmap_vertex:zp,emissivemap_fragment:kp,emissivemap_pars_fragment:Hp,colorspace_fragment:Gp,colorspace_pars_fragment:Vp,envmap_fragment:Wp,envmap_common_pars_fragment:Xp,envmap_pars_fragment:Yp,envmap_pars_vertex:Zp,envmap_physical_pars_fragment:rf,envmap_vertex:qp,fog_vertex:jp,fog_pars_vertex:$p,fog_fragment:Kp,fog_pars_fragment:Jp,gradientmap_pars_fragment:Qp,lightmap_pars_fragment:ef,lights_lambert_fragment:tf,lights_lambert_pars_fragment:nf,lights_pars_begin:sf,lights_toon_fragment:of,lights_toon_pars_fragment:af,lights_phong_fragment:cf,lights_phong_pars_fragment:lf,lights_physical_fragment:hf,lights_physical_pars_fragment:df,lights_fragment_begin:uf,lights_fragment_maps:pf,lights_fragment_end:ff,logdepthbuf_fragment:mf,logdepthbuf_pars_fragment:gf,logdepthbuf_pars_vertex:_f,logdepthbuf_vertex:vf,map_fragment:xf,map_pars_fragment:Sf,map_particle_fragment:Mf,map_particle_pars_fragment:yf,metalnessmap_fragment:bf,metalnessmap_pars_fragment:Ef,morphinstance_vertex:Af,morphcolor_vertex:Tf,morphnormal_vertex:wf,morphtarget_pars_vertex:Rf,morphtarget_vertex:Cf,normal_fragment_begin:Pf,normal_fragment_maps:Lf,normal_pars_fragment:If,normal_pars_vertex:Df,normal_vertex:Nf,normalmap_pars_fragment:Uf,clearcoat_normal_fragment_begin:Of,clearcoat_normal_fragment_maps:Ff,clearcoat_pars_fragment:Bf,iridescence_pars_fragment:zf,opaque_fragment:kf,packing:Hf,premultiplied_alpha_fragment:Gf,project_vertex:Vf,dithering_fragment:Wf,dithering_pars_fragment:Xf,roughnessmap_fragment:Yf,roughnessmap_pars_fragment:Zf,shadowmap_pars_fragment:qf,shadowmap_pars_vertex:jf,shadowmap_vertex:$f,shadowmask_pars_fragment:Kf,skinbase_vertex:Jf,skinning_pars_vertex:Qf,skinning_vertex:em,skinnormal_vertex:tm,specularmap_fragment:nm,specularmap_pars_fragment:im,tonemapping_fragment:sm,tonemapping_pars_fragment:rm,transmission_fragment:om,transmission_pars_fragment:am,uv_pars_fragment:cm,uv_pars_vertex:lm,uv_vertex:hm,worldpos_vertex:dm,background_vert:um,background_frag:pm,backgroundCube_vert:fm,backgroundCube_frag:mm,cube_vert:gm,cube_frag:_m,depth_vert:vm,depth_frag:xm,distanceRGBA_vert:Sm,distanceRGBA_frag:Mm,equirect_vert:ym,equirect_frag:bm,linedashed_vert:Em,linedashed_frag:Am,meshbasic_vert:Tm,meshbasic_frag:wm,meshlambert_vert:Rm,meshlambert_frag:Cm,meshmatcap_vert:Pm,meshmatcap_frag:Lm,meshnormal_vert:Im,meshnormal_frag:Dm,meshphong_vert:Nm,meshphong_frag:Um,meshphysical_vert:Om,meshphysical_frag:Fm,meshtoon_vert:Bm,meshtoon_frag:zm,points_vert:km,points_frag:Hm,shadow_vert:Gm,shadow_frag:Vm,sprite_vert:Wm,sprite_frag:Xm},le={common:{diffuse:{value:new ve(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ke}},envmap:{envMap:{value:null},envMapRotation:{value:new ke},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ke}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ke}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ke},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ke},normalScale:{value:new K(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ke},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ke}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ke}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ke}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ve(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new ve(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0},uvTransform:{value:new ke}},sprite:{diffuse:{value:new ve(16777215)},opacity:{value:1},center:{value:new K(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ke},alphaMap:{value:null},alphaMapTransform:{value:new ke},alphaTest:{value:0}}},nn={basic:{uniforms:Pt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Pt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new ve(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Pt([le.common,le.specularmap,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.fog,le.lights,{emissive:{value:new ve(0)},specular:{value:new ve(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Pt([le.common,le.envmap,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.roughnessmap,le.metalnessmap,le.fog,le.lights,{emissive:{value:new ve(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Pt([le.common,le.aomap,le.lightmap,le.emissivemap,le.bumpmap,le.normalmap,le.displacementmap,le.gradientmap,le.fog,le.lights,{emissive:{value:new ve(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Pt([le.common,le.bumpmap,le.normalmap,le.displacementmap,le.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Pt([le.points,le.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Pt([le.common,le.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Pt([le.common,le.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Pt([le.common,le.bumpmap,le.normalmap,le.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Pt([le.sprite,le.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new ke},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ke}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:Pt([le.common,le.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:Pt([le.lights,le.fog,{color:{value:new ve(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};nn.physical={uniforms:Pt([nn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ke},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ke},clearcoatNormalScale:{value:new K(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ke},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ke},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ke},sheen:{value:0},sheenColor:{value:new ve(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ke},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ke},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ke},transmissionSamplerSize:{value:new K},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ke},attenuationDistance:{value:0},attenuationColor:{value:new ve(0)},specularColor:{value:new ve(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ke},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ke},anisotropyVector:{value:new K},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ke}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const qs={r:0,b:0,g:0},Kn=new en,Ym=new it;function Zm(i,e,t,n,s,r,o){const a=new ve(0);let c=r===!0?0:1,l,h,d=null,u=0,m=null;function g(x){let v=x.isScene===!0?x.background:null;return v&&v.isTexture&&(v=(x.backgroundBlurriness>0?t:e).get(v)),v}function _(x){let v=!1;const S=g(x);S===null?p(a,c):S&&S.isColor&&(p(S,1),v=!0);const R=i.xr.getEnvironmentBlendMode();R==="additive"?n.buffers.color.setClear(0,0,0,1,o):R==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(i.autoClear||v)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function f(x,v){const S=g(v);S&&(S.isCubeTexture||S.mapping===Lr)?(h===void 0&&(h=new Be(new Ss(1,1,1),new Gn({name:"BackgroundCubeMaterial",uniforms:ji(nn.backgroundCube.uniforms),vertexShader:nn.backgroundCube.vertexShader,fragmentShader:nn.backgroundCube.fragmentShader,side:Lt,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),h.geometry.deleteAttribute("uv"),h.onBeforeRender=function(R,A,T){this.matrixWorld.copyPosition(T.matrixWorld)},Object.defineProperty(h.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(h)),Kn.copy(v.backgroundRotation),Kn.x*=-1,Kn.y*=-1,Kn.z*=-1,S.isCubeTexture&&S.isRenderTargetTexture===!1&&(Kn.y*=-1,Kn.z*=-1),h.material.uniforms.envMap.value=S,h.material.uniforms.flipEnvMap.value=S.isCubeTexture&&S.isRenderTargetTexture===!1?-1:1,h.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.uniforms.backgroundRotation.value.setFromMatrix4(Ym.makeRotationFromEuler(Kn)),h.material.toneMapped=et.getTransfer(S.colorSpace)!==st,(d!==S||u!==S.version||m!==i.toneMapping)&&(h.material.needsUpdate=!0,d=S,u=S.version,m=i.toneMapping),h.layers.enableAll(),x.unshift(h,h.geometry,h.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new Be(new Or(2,2),new Gn({name:"BackgroundMaterial",uniforms:ji(nn.background.uniforms),vertexShader:nn.background.vertexShader,fragmentShader:nn.background.fragmentShader,side:kn,depthTest:!1,depthWrite:!1,fog:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,l.material.toneMapped=et.getTransfer(S.colorSpace)!==st,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||u!==S.version||m!==i.toneMapping)&&(l.material.needsUpdate=!0,d=S,u=S.version,m=i.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,v){x.getRGB(qs,ih(i)),n.buffers.color.setClear(qs.r,qs.g,qs.b,v,o)}return{getClearColor:function(){return a},setClearColor:function(x,v=1){a.set(x),c=v,p(a,c)},getClearAlpha:function(){return c},setClearAlpha:function(x){c=x,p(a,c)},render:_,addToRenderList:f}}function qm(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=u(null);let r=s,o=!1;function a(y,P,N,U,G){let Z=!1;const F=d(U,N,P);r!==F&&(r=F,l(r.object)),Z=m(y,U,N,G),Z&&g(y,U,N,G),G!==null&&e.update(G,i.ELEMENT_ARRAY_BUFFER),(Z||o)&&(o=!1,S(y,P,N,U),G!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(G).buffer))}function c(){return i.createVertexArray()}function l(y){return i.bindVertexArray(y)}function h(y){return i.deleteVertexArray(y)}function d(y,P,N){const U=N.wireframe===!0;let G=n[y.id];G===void 0&&(G={},n[y.id]=G);let Z=G[P.id];Z===void 0&&(Z={},G[P.id]=Z);let F=Z[U];return F===void 0&&(F=u(c()),Z[U]=F),F}function u(y){const P=[],N=[],U=[];for(let G=0;G<t;G++)P[G]=0,N[G]=0,U[G]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:N,attributeDivisors:U,object:y,attributes:{},index:null}}function m(y,P,N,U){const G=r.attributes,Z=P.attributes;let F=0;const j=N.getAttributes();for(const k in j)if(j[k].location>=0){const se=G[k];let he=Z[k];if(he===void 0&&(k==="instanceMatrix"&&y.instanceMatrix&&(he=y.instanceMatrix),k==="instanceColor"&&y.instanceColor&&(he=y.instanceColor)),se===void 0||se.attribute!==he||he&&se.data!==he.data)return!0;F++}return r.attributesNum!==F||r.index!==U}function g(y,P,N,U){const G={},Z=P.attributes;let F=0;const j=N.getAttributes();for(const k in j)if(j[k].location>=0){let se=Z[k];se===void 0&&(k==="instanceMatrix"&&y.instanceMatrix&&(se=y.instanceMatrix),k==="instanceColor"&&y.instanceColor&&(se=y.instanceColor));const he={};he.attribute=se,se&&se.data&&(he.data=se.data),G[k]=he,F++}r.attributes=G,r.attributesNum=F,r.index=U}function _(){const y=r.newAttributes;for(let P=0,N=y.length;P<N;P++)y[P]=0}function f(y){p(y,0)}function p(y,P){const N=r.newAttributes,U=r.enabledAttributes,G=r.attributeDivisors;N[y]=1,U[y]===0&&(i.enableVertexAttribArray(y),U[y]=1),G[y]!==P&&(i.vertexAttribDivisor(y,P),G[y]=P)}function x(){const y=r.newAttributes,P=r.enabledAttributes;for(let N=0,U=P.length;N<U;N++)P[N]!==y[N]&&(i.disableVertexAttribArray(N),P[N]=0)}function v(y,P,N,U,G,Z,F){F===!0?i.vertexAttribIPointer(y,P,N,G,Z):i.vertexAttribPointer(y,P,N,U,G,Z)}function S(y,P,N,U){_();const G=U.attributes,Z=N.getAttributes(),F=P.defaultAttributeValues;for(const j in Z){const k=Z[j];if(k.location>=0){let ie=G[j];if(ie===void 0&&(j==="instanceMatrix"&&y.instanceMatrix&&(ie=y.instanceMatrix),j==="instanceColor"&&y.instanceColor&&(ie=y.instanceColor)),ie!==void 0){const se=ie.normalized,he=ie.itemSize,we=e.get(ie);if(we===void 0)continue;const Le=we.buffer,$=we.type,ee=we.bytesPerElement,fe=$===i.INT||$===i.UNSIGNED_INT||ie.gpuType===Vl;if(ie.isInterleavedBufferAttribute){const de=ie.data,He=de.stride,Ie=ie.offset;if(de.isInstancedInterleavedBuffer){for(let Ye=0;Ye<k.locationSize;Ye++)p(k.location+Ye,de.meshPerAttribute);y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=de.meshPerAttribute*de.count)}else for(let Ye=0;Ye<k.locationSize;Ye++)f(k.location+Ye);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let Ye=0;Ye<k.locationSize;Ye++)v(k.location+Ye,he/k.locationSize,$,se,He*ee,(Ie+he/k.locationSize*Ye)*ee,fe)}else{if(ie.isInstancedBufferAttribute){for(let de=0;de<k.locationSize;de++)p(k.location+de,ie.meshPerAttribute);y.isInstancedMesh!==!0&&U._maxInstanceCount===void 0&&(U._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let de=0;de<k.locationSize;de++)f(k.location+de);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let de=0;de<k.locationSize;de++)v(k.location+de,he/k.locationSize,$,se,he*ee,he/k.locationSize*de*ee,fe)}}else if(F!==void 0){const se=F[j];if(se!==void 0)switch(se.length){case 2:i.vertexAttrib2fv(k.location,se);break;case 3:i.vertexAttrib3fv(k.location,se);break;case 4:i.vertexAttrib4fv(k.location,se);break;default:i.vertexAttrib1fv(k.location,se)}}}}x()}function R(){C();for(const y in n){const P=n[y];for(const N in P){const U=P[N];for(const G in U)h(U[G].object),delete U[G];delete P[N]}delete n[y]}}function A(y){if(n[y.id]===void 0)return;const P=n[y.id];for(const N in P){const U=P[N];for(const G in U)h(U[G].object),delete U[G];delete P[N]}delete n[y.id]}function T(y){for(const P in n){const N=n[P];if(N[y.id]===void 0)continue;const U=N[y.id];for(const G in U)h(U[G].object),delete U[G];delete N[y.id]}}function C(){b(),o=!0,r!==s&&(r=s,l(r.object))}function b(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:a,reset:C,resetDefaultState:b,dispose:R,releaseStatesOfGeometry:A,releaseStatesOfProgram:T,initAttributes:_,enableAttribute:f,disableUnusedAttributes:x}}function jm(i,e,t){let n;function s(l){n=l}function r(l,h){i.drawArrays(n,l,h),t.update(h,n,1)}function o(l,h,d){d!==0&&(i.drawArraysInstanced(n,l,h,d),t.update(h,n,d))}function a(l,h,d){if(d===0)return;const u=e.get("WEBGL_multi_draw");if(u===null)for(let m=0;m<d;m++)this.render(l[m],h[m]);else{u.multiDrawArraysWEBGL(n,l,0,h,0,d);let m=0;for(let g=0;g<d;g++)m+=h[g];t.update(m,n,1)}}function c(l,h,d,u){if(d===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let g=0;g<l.length;g++)o(l[g],h[g],u[g]);else{m.multiDrawArraysInstancedWEBGL(n,l,0,h,0,u,0,d);let g=0;for(let _=0;_<d;_++)g+=h[_];for(let _=0;_<u.length;_++)t.update(g,n,u[_])}}this.setMode=s,this.render=r,this.renderInstances=o,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function $m(i,e,t,n){let s;function r(){if(s!==void 0)return s;if(e.has("EXT_texture_filter_anisotropic")===!0){const A=e.get("EXT_texture_filter_anisotropic");s=i.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function o(A){return!(A!==sn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(A){const T=A===Ir&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==Hn&&n.convert(A)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==Un&&!T)}function c(A){if(A==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let l=t.precision!==void 0?t.precision:"highp";const h=c(l);h!==l&&(console.warn("THREE.WebGLRenderer:",l,"not supported, using",h,"instead."),l=h);const d=t.logarithmicDepthBuffer===!0,u=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_TEXTURE_SIZE),_=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),v=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),S=m>0,R=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:c,textureFormatReadable:o,textureTypeReadable:a,precision:l,logarithmicDepthBuffer:d,maxTextures:u,maxVertexTextures:m,maxTextureSize:g,maxCubemapSize:_,maxAttributes:f,maxVertexUniforms:p,maxVaryings:x,maxFragmentUniforms:v,vertexTextures:S,maxSamples:R}}function Km(i){const e=this;let t=null,n=0,s=!1,r=!1;const o=new _n,a=new ke,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(d,u){const m=d.length!==0||u||n!==0||s;return s=u,n=d.length,m},this.beginShadows=function(){r=!0,h(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(d,u){t=h(d,u,0)},this.setState=function(d,u,m){const g=d.clippingPlanes,_=d.clipIntersection,f=d.clipShadows,p=i.get(d);if(!s||g===null||g.length===0||r&&!f)r?h(null):l();else{const x=r?0:n,v=x*4;let S=p.clippingState||null;c.value=S,S=h(g,u,v,m);for(let R=0;R!==v;++R)S[R]=t[R];p.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function l(){c.value!==t&&(c.value=t,c.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function h(d,u,m,g){const _=d!==null?d.length:0;let f=null;if(_!==0){if(f=c.value,g!==!0||f===null){const p=m+_*4,x=u.matrixWorldInverse;a.getNormalMatrix(x),(f===null||f.length<p)&&(f=new Float32Array(p));for(let v=0,S=m;v!==_;++v,S+=4)o.copy(d[v]).applyMatrix4(x,a),o.normal.toArray(f,S),f[S+3]=o.constant}c.value=f,c.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,f}}function Jm(i){let e=new WeakMap;function t(o,a){return a===Go?o.mapping=Wi:a===Vo&&(o.mapping=Xi),o}function n(o){if(o&&o.isTexture){const a=o.mapping;if(a===Go||a===Vo)if(e.has(o)){const c=e.get(o).texture;return t(c,o.mapping)}else{const c=o.image;if(c&&c.height>0){const l=new cp(c.height);return l.fromEquirectangularTexture(i,o),e.set(o,l),o.addEventListener("dispose",s),t(l.texture,o.mapping)}else return null}}return o}function s(o){const a=o.target;a.removeEventListener("dispose",s);const c=e.get(a);c!==void 0&&(e.delete(a),c.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}class ah extends sh{constructor(e=-1,t=1,n=1,s=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=s,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,s,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2;let r=n-e,o=n+e,a=s+t,c=s-t;if(this.view!==null&&this.view.enabled){const l=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=l*this.view.offsetX,o=r+l*this.view.width,a-=h*this.view.offsetY,c=a-h*this.view.height}this.projectionMatrix.makeOrthographic(r,o,a,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const Ui=4,Sc=[.125,.215,.35,.446,.526,.582],ni=20,vo=new ah,Mc=new ve;let xo=null,So=0,Mo=0,yo=!1;const ei=(1+Math.sqrt(5))/2,Ci=1/ei,yc=[new L(-ei,Ci,0),new L(ei,Ci,0),new L(-Ci,0,ei),new L(Ci,0,ei),new L(0,ei,-Ci),new L(0,ei,Ci),new L(-1,1,-1),new L(1,1,-1),new L(-1,1,1),new L(1,1,1)];class bc{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,s=100){xo=this._renderer.getRenderTarget(),So=this._renderer.getActiveCubeFace(),Mo=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(e,n,s,r),t>0&&this._blur(r,0,0,t),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Tc(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Ac(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(xo,So,Mo),this._renderer.xr.enabled=yo,e.scissorTest=!1,js(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Wi||e.mapping===Xi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),xo=this._renderer.getRenderTarget(),So=this._renderer.getActiveCubeFace(),Mo=this._renderer.getActiveMipmapLevel(),yo=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Kt,minFilter:Kt,generateMipmaps:!1,type:Ir,format:sn,colorSpace:Vn,depthBuffer:!1},s=Ec(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=Ec(e,t,n);const{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Qm(r)),this._blurMaterial=eg(r,e,t)}return s}_compileMaterial(e){const t=new Be(this._lodPlanes[0],e);this._renderer.compile(t,vo)}_sceneToCubeUV(e,t,n,s){const a=new Bt(90,1,t,n),c=[1,-1,1,1,1,1],l=[1,1,1,-1,-1,-1],h=this._renderer,d=h.autoClear,u=h.toneMapping;h.getClearColor(Mc),h.toneMapping=Fn,h.autoClear=!1;const m=new Qt({name:"PMREM.Background",side:Lt,depthWrite:!1,depthTest:!1}),g=new Be(new Ss,m);let _=!1;const f=e.background;f?f.isColor&&(m.color.copy(f),e.background=null,_=!0):(m.color.copy(Mc),_=!0);for(let p=0;p<6;p++){const x=p%3;x===0?(a.up.set(0,c[p],0),a.lookAt(l[p],0,0)):x===1?(a.up.set(0,0,c[p]),a.lookAt(0,l[p],0)):(a.up.set(0,c[p],0),a.lookAt(0,0,l[p]));const v=this._cubeSize;js(s,x*v,p>2?v:0,v,v),h.setRenderTarget(s),_&&h.render(g,a),h.render(e,a)}g.geometry.dispose(),g.material.dispose(),h.toneMapping=u,h.autoClear=d,e.background=f}_textureToCubeUV(e,t){const n=this._renderer,s=e.mapping===Wi||e.mapping===Xi;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=Tc()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Ac());const r=s?this._cubemapMaterial:this._equirectMaterial,o=new Be(this._lodPlanes[0],r),a=r.uniforms;a.envMap.value=e;const c=this._cubeSize;js(t,0,0,3*c,2*c),n.setRenderTarget(t),n.render(o,vo)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const s=this._lodPlanes.length;for(let r=1;r<s;r++){const o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),a=yc[(s-r-1)%yc.length];this._blur(e,r-1,r,o,a)}t.autoClear=n}_blur(e,t,n,s,r){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,s,"latitudinal",r),this._halfBlur(o,e,n,n,s,"longitudinal",r)}_halfBlur(e,t,n,s,r,o,a){const c=this._renderer,l=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const h=3,d=new Be(this._lodPlanes[s],l),u=l.uniforms,m=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*m):2*Math.PI/(2*ni-1),_=r/g,f=isFinite(r)?1+Math.floor(h*_):ni;f>ni&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${f} samples when the maximum is set to ${ni}`);const p=[];let x=0;for(let T=0;T<ni;++T){const C=T/_,b=Math.exp(-C*C/2);p.push(b),T===0?x+=b:T<f&&(x+=2*b)}for(let T=0;T<p.length;T++)p[T]=p[T]/x;u.envMap.value=e.texture,u.samples.value=f,u.weights.value=p,u.latitudinal.value=o==="latitudinal",a&&(u.poleAxis.value=a);const{_lodMax:v}=this;u.dTheta.value=g,u.mipInt.value=v-n;const S=this._sizeLods[s],R=3*S*(s>v-Ui?s-v+Ui:0),A=4*(this._cubeSize-S);js(t,R,A,3*S,2*S),c.setRenderTarget(t),c.render(d,vo)}}function Qm(i){const e=[],t=[],n=[];let s=i;const r=i-Ui+1+Sc.length;for(let o=0;o<r;o++){const a=Math.pow(2,s);t.push(a);let c=1/a;o>i-Ui?c=Sc[o-i+Ui-1]:o===0&&(c=0),n.push(c);const l=1/(a-2),h=-l,d=1+l,u=[h,h,d,h,d,d,h,h,d,d,h,d],m=6,g=6,_=3,f=2,p=1,x=new Float32Array(_*g*m),v=new Float32Array(f*g*m),S=new Float32Array(p*g*m);for(let A=0;A<m;A++){const T=A%3*2/3-1,C=A>2?0:-1,b=[T,C,0,T+2/3,C,0,T+2/3,C+1,0,T,C,0,T+2/3,C+1,0,T,C+1,0];x.set(b,_*g*A),v.set(u,f*g*A);const y=[A,A,A,A,A,A];S.set(y,p*g*A)}const R=new Fe;R.setAttribute("position",new It(x,_)),R.setAttribute("uv",new It(v,f)),R.setAttribute("faceIndex",new It(S,p)),e.push(R),s>Ui&&s--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function Ec(i,e,t){const n=new ci(i,e,t);return n.texture.mapping=Lr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function js(i,e,t,n,s){i.viewport.set(e,t,n,s),i.scissor.set(e,t,n,s)}function eg(i,e,t){const n=new Float32Array(ni),s=new L(0,1,0);return new Gn({name:"SphericalGaussianBlur",defines:{n:ni,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:aa(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function Ac(){return new Gn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:aa(),fragmentShader:`

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
		`,blending:On,depthTest:!1,depthWrite:!1})}function Tc(){return new Gn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:aa(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:On,depthTest:!1,depthWrite:!1})}function aa(){return`

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
	`}function tg(i){let e=new WeakMap,t=null;function n(a){if(a&&a.isTexture){const c=a.mapping,l=c===Go||c===Vo,h=c===Wi||c===Xi;if(l||h){let d=e.get(a);const u=d!==void 0?d.texture.pmremVersion:0;if(a.isRenderTargetTexture&&a.pmremVersion!==u)return t===null&&(t=new bc(i)),d=l?t.fromEquirectangular(a,d):t.fromCubemap(a,d),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),d.texture;if(d!==void 0)return d.texture;{const m=a.image;return l&&m&&m.height>0||h&&m&&s(m)?(t===null&&(t=new bc(i)),d=l?t.fromEquirectangular(a):t.fromCubemap(a),d.texture.pmremVersion=a.pmremVersion,e.set(a,d),a.addEventListener("dispose",r),d.texture):null}}}return a}function s(a){let c=0;const l=6;for(let h=0;h<l;h++)a[h]!==void 0&&c++;return c===l}function r(a){const c=a.target;c.removeEventListener("dispose",r);const l=e.get(c);l!==void 0&&(e.delete(c),l.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function ng(i){const e={};function t(n){if(e[n]!==void 0)return e[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return e[n]=s,s}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const s=t(n);return s===null&&sa("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ig(i,e,t,n){const s={},r=new WeakMap;function o(d){const u=d.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);for(const g in u.morphAttributes){const _=u.morphAttributes[g];for(let f=0,p=_.length;f<p;f++)e.remove(_[f])}u.removeEventListener("dispose",o),delete s[u.id];const m=r.get(u);m&&(e.remove(m),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function a(d,u){return s[u.id]===!0||(u.addEventListener("dispose",o),s[u.id]=!0,t.memory.geometries++),u}function c(d){const u=d.attributes;for(const g in u)e.update(u[g],i.ARRAY_BUFFER);const m=d.morphAttributes;for(const g in m){const _=m[g];for(let f=0,p=_.length;f<p;f++)e.update(_[f],i.ARRAY_BUFFER)}}function l(d){const u=[],m=d.index,g=d.attributes.position;let _=0;if(m!==null){const x=m.array;_=m.version;for(let v=0,S=x.length;v<S;v+=3){const R=x[v+0],A=x[v+1],T=x[v+2];u.push(R,A,A,T,T,R)}}else if(g!==void 0){const x=g.array;_=g.version;for(let v=0,S=x.length/3-1;v<S;v+=3){const R=v+0,A=v+1,T=v+2;u.push(R,A,A,T,T,R)}}else return;const f=new(Kl(u)?nh:th)(u,1);f.version=_;const p=r.get(d);p&&e.remove(p),r.set(d,f)}function h(d){const u=r.get(d);if(u){const m=d.index;m!==null&&u.version<m.version&&l(d)}else l(d);return r.get(d)}return{get:a,update:c,getWireframeAttribute:h}}function sg(i,e,t){let n;function s(u){n=u}let r,o;function a(u){r=u.type,o=u.bytesPerElement}function c(u,m){i.drawElements(n,m,r,u*o),t.update(m,n,1)}function l(u,m,g){g!==0&&(i.drawElementsInstanced(n,m,r,u*o,g),t.update(m,n,g))}function h(u,m,g){if(g===0)return;const _=e.get("WEBGL_multi_draw");if(_===null)for(let f=0;f<g;f++)this.render(u[f]/o,m[f]);else{_.multiDrawElementsWEBGL(n,m,0,r,u,0,g);let f=0;for(let p=0;p<g;p++)f+=m[p];t.update(f,n,1)}}function d(u,m,g,_){if(g===0)return;const f=e.get("WEBGL_multi_draw");if(f===null)for(let p=0;p<u.length;p++)l(u[p]/o,m[p],_[p]);else{f.multiDrawElementsInstancedWEBGL(n,m,0,r,u,0,_,0,g);let p=0;for(let x=0;x<g;x++)p+=m[x];for(let x=0;x<_.length;x++)t.update(p,n,_[x])}}this.setMode=s,this.setIndex=a,this.render=c,this.renderInstances=l,this.renderMultiDraw=h,this.renderMultiDrawInstances=d}function rg(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,a){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=a*(r/3);break;case i.LINES:t.lines+=a*(r/2);break;case i.LINE_STRIP:t.lines+=a*(r-1);break;case i.LINE_LOOP:t.lines+=a*r;break;case i.POINTS:t.points+=a*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function s(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:s,update:n}}function og(i,e,t){const n=new WeakMap,s=new rt;function r(o,a,c){const l=o.morphTargetInfluences,h=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,d=h!==void 0?h.length:0;let u=n.get(a);if(u===void 0||u.count!==d){let y=function(){C.dispose(),n.delete(a),a.removeEventListener("dispose",y)};var m=y;u!==void 0&&u.texture.dispose();const g=a.morphAttributes.position!==void 0,_=a.morphAttributes.normal!==void 0,f=a.morphAttributes.color!==void 0,p=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],v=a.morphAttributes.color||[];let S=0;g===!0&&(S=1),_===!0&&(S=2),f===!0&&(S=3);let R=a.attributes.position.count*S,A=1;R>e.maxTextureSize&&(A=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const T=new Float32Array(R*A*4*d),C=new Ql(T,R,A,d);C.type=Un,C.needsUpdate=!0;const b=S*4;for(let P=0;P<d;P++){const N=p[P],U=x[P],G=v[P],Z=R*A*4*P;for(let F=0;F<N.count;F++){const j=F*b;g===!0&&(s.fromBufferAttribute(N,F),T[Z+j+0]=s.x,T[Z+j+1]=s.y,T[Z+j+2]=s.z,T[Z+j+3]=0),_===!0&&(s.fromBufferAttribute(U,F),T[Z+j+4]=s.x,T[Z+j+5]=s.y,T[Z+j+6]=s.z,T[Z+j+7]=0),f===!0&&(s.fromBufferAttribute(G,F),T[Z+j+8]=s.x,T[Z+j+9]=s.y,T[Z+j+10]=s.z,T[Z+j+11]=G.itemSize===4?s.w:1)}}u={count:d,texture:C,size:new K(R,A)},n.set(a,u),a.addEventListener("dispose",y)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)c.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let g=0;for(let f=0;f<l.length;f++)g+=l[f];const _=a.morphTargetsRelative?1:1-g;c.getUniforms().setValue(i,"morphTargetBaseInfluence",_),c.getUniforms().setValue(i,"morphTargetInfluences",l)}c.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),c.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function ag(i,e,t,n){let s=new WeakMap;function r(c){const l=n.render.frame,h=c.geometry,d=e.get(c,h);if(s.get(d)!==l&&(e.update(d),s.set(d,l)),c.isInstancedMesh&&(c.hasEventListener("dispose",a)===!1&&c.addEventListener("dispose",a),s.get(c)!==l&&(t.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&t.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,l))),c.isSkinnedMesh){const u=c.skeleton;s.get(u)!==l&&(u.update(),s.set(u,l))}return d}function o(){s=new WeakMap}function a(c){const l=c.target;l.removeEventListener("dispose",a),t.remove(l.instanceMatrix),l.instanceColor!==null&&t.remove(l.instanceColor)}return{update:r,dispose:o}}class ch extends At{constructor(e,t,n,s,r,o,a,c,l,h=ki){if(h!==ki&&h!==qi)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&h===ki&&(n=Yi),n===void 0&&h===qi&&(n=Zi),super(null,s,r,o,a,c,h,n,l),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=a!==void 0?a:Wt,this.minFilter=c!==void 0?c:Wt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const lh=new At,hh=new ch(1,1);hh.compareFunction=$l;const dh=new Ql,uh=new Yu,ph=new rh,wc=[],Rc=[],Cc=new Float32Array(16),Pc=new Float32Array(9),Lc=new Float32Array(4);function Ki(i,e,t){const n=i[0];if(n<=0||n>0)return i;const s=e*t;let r=wc[s];if(r===void 0&&(r=new Float32Array(s),wc[s]=r),e!==0){n.toArray(r,0);for(let o=1,a=0;o!==e;++o)a+=t,i[o].toArray(r,a)}return r}function vt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function xt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function Fr(i,e){let t=Rc[e];t===void 0&&(t=new Int32Array(e),Rc[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function cg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function lg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;i.uniform2fv(this.addr,e),xt(t,e)}}function hg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(vt(t,e))return;i.uniform3fv(this.addr,e),xt(t,e)}}function dg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;i.uniform4fv(this.addr,e),xt(t,e)}}function ug(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(vt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),xt(t,e)}else{if(vt(t,n))return;Lc.set(n),i.uniformMatrix2fv(this.addr,!1,Lc),xt(t,n)}}function pg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(vt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),xt(t,e)}else{if(vt(t,n))return;Pc.set(n),i.uniformMatrix3fv(this.addr,!1,Pc),xt(t,n)}}function fg(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(vt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),xt(t,e)}else{if(vt(t,n))return;Cc.set(n),i.uniformMatrix4fv(this.addr,!1,Cc),xt(t,n)}}function mg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function gg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;i.uniform2iv(this.addr,e),xt(t,e)}}function _g(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;i.uniform3iv(this.addr,e),xt(t,e)}}function vg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;i.uniform4iv(this.addr,e),xt(t,e)}}function xg(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Sg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(vt(t,e))return;i.uniform2uiv(this.addr,e),xt(t,e)}}function Mg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(vt(t,e))return;i.uniform3uiv(this.addr,e),xt(t,e)}}function yg(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(vt(t,e))return;i.uniform4uiv(this.addr,e),xt(t,e)}}function bg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);const r=this.type===i.SAMPLER_2D_SHADOW?hh:lh;t.setTexture2D(e||r,s)}function Eg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture3D(e||uh,s)}function Ag(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTextureCube(e||ph,s)}function Tg(i,e,t){const n=this.cache,s=t.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),t.setTexture2DArray(e||dh,s)}function wg(i){switch(i){case 5126:return cg;case 35664:return lg;case 35665:return hg;case 35666:return dg;case 35674:return ug;case 35675:return pg;case 35676:return fg;case 5124:case 35670:return mg;case 35667:case 35671:return gg;case 35668:case 35672:return _g;case 35669:case 35673:return vg;case 5125:return xg;case 36294:return Sg;case 36295:return Mg;case 36296:return yg;case 35678:case 36198:case 36298:case 36306:case 35682:return bg;case 35679:case 36299:case 36307:return Eg;case 35680:case 36300:case 36308:case 36293:return Ag;case 36289:case 36303:case 36311:case 36292:return Tg}}function Rg(i,e){i.uniform1fv(this.addr,e)}function Cg(i,e){const t=Ki(e,this.size,2);i.uniform2fv(this.addr,t)}function Pg(i,e){const t=Ki(e,this.size,3);i.uniform3fv(this.addr,t)}function Lg(i,e){const t=Ki(e,this.size,4);i.uniform4fv(this.addr,t)}function Ig(i,e){const t=Ki(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function Dg(i,e){const t=Ki(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function Ng(i,e){const t=Ki(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function Ug(i,e){i.uniform1iv(this.addr,e)}function Og(i,e){i.uniform2iv(this.addr,e)}function Fg(i,e){i.uniform3iv(this.addr,e)}function Bg(i,e){i.uniform4iv(this.addr,e)}function zg(i,e){i.uniform1uiv(this.addr,e)}function kg(i,e){i.uniform2uiv(this.addr,e)}function Hg(i,e){i.uniform3uiv(this.addr,e)}function Gg(i,e){i.uniform4uiv(this.addr,e)}function Vg(i,e,t){const n=this.cache,s=e.length,r=Fr(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),xt(n,r));for(let o=0;o!==s;++o)t.setTexture2D(e[o]||lh,r[o])}function Wg(i,e,t){const n=this.cache,s=e.length,r=Fr(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),xt(n,r));for(let o=0;o!==s;++o)t.setTexture3D(e[o]||uh,r[o])}function Xg(i,e,t){const n=this.cache,s=e.length,r=Fr(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),xt(n,r));for(let o=0;o!==s;++o)t.setTextureCube(e[o]||ph,r[o])}function Yg(i,e,t){const n=this.cache,s=e.length,r=Fr(t,s);vt(n,r)||(i.uniform1iv(this.addr,r),xt(n,r));for(let o=0;o!==s;++o)t.setTexture2DArray(e[o]||dh,r[o])}function Zg(i){switch(i){case 5126:return Rg;case 35664:return Cg;case 35665:return Pg;case 35666:return Lg;case 35674:return Ig;case 35675:return Dg;case 35676:return Ng;case 5124:case 35670:return Ug;case 35667:case 35671:return Og;case 35668:case 35672:return Fg;case 35669:case 35673:return Bg;case 5125:return zg;case 36294:return kg;case 36295:return Hg;case 36296:return Gg;case 35678:case 36198:case 36298:case 36306:case 35682:return Vg;case 35679:case 36299:case 36307:return Wg;case 35680:case 36300:case 36308:case 36293:return Xg;case 36289:case 36303:case 36311:case 36292:return Yg}}class qg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=wg(t.type)}}class jg{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Zg(t.type)}}class $g{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const s=this.seq;for(let r=0,o=s.length;r!==o;++r){const a=s[r];a.setValue(e,t[a.id],n)}}}const bo=/(\w+)(\])?(\[|\.)?/g;function Ic(i,e){i.seq.push(e),i.map[e.id]=e}function Kg(i,e,t){const n=i.name,s=n.length;for(bo.lastIndex=0;;){const r=bo.exec(n),o=bo.lastIndex;let a=r[1];const c=r[2]==="]",l=r[3];if(c&&(a=a|0),l===void 0||l==="["&&o+2===s){Ic(t,l===void 0?new qg(a,i,e):new jg(a,i,e));break}else{let d=t.map[a];d===void 0&&(d=new $g(a),Ic(t,d)),t=d}}}class ur{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){const r=e.getActiveUniform(t,s),o=e.getUniformLocation(t,r.name);Kg(r,o,this)}}setValue(e,t,n,s){const r=this.map[t];r!==void 0&&r.setValue(e,n,s)}setOptional(e,t,n){const s=t[n];s!==void 0&&this.setValue(e,n,s)}static upload(e,t,n,s){for(let r=0,o=t.length;r!==o;++r){const a=t[r],c=n[a.id];c.needsUpdate!==!1&&a.setValue(e,c.value,s)}}static seqWithValue(e,t){const n=[];for(let s=0,r=e.length;s!==r;++s){const o=e[s];o.id in t&&n.push(o)}return n}}function Dc(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const Jg=37297;let Qg=0;function e0(i,e){const t=i.split(`
`),n=[],s=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=s;o<r;o++){const a=o+1;n.push(`${a===e?">":" "} ${a}: ${t[o]}`)}return n.join(`
`)}function t0(i){const e=et.getPrimaries(et.workingColorSpace),t=et.getPrimaries(i);let n;switch(e===t?n="":e===vr&&t===_r?n="LinearDisplayP3ToLinearSRGB":e===_r&&t===vr&&(n="LinearSRGBToLinearDisplayP3"),i){case Vn:case Dr:return[n,"LinearTransferOETF"];case tn:case na:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function Nc(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),s=i.getShaderInfoLog(e).trim();if(n&&s==="")return"";const r=/ERROR: 0:(\d+)/.exec(s);if(r){const o=parseInt(r[1]);return t.toUpperCase()+`

`+s+`

`+e0(i.getShaderSource(e),o)}else return s}function n0(i,e){const t=t0(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function i0(i,e){let t;switch(e){case jd:t="Linear";break;case $d:t="Reinhard";break;case Kd:t="OptimizedCineon";break;case Jd:t="ACESFilmic";break;case eu:t="AgX";break;case tu:t="Neutral";break;case Qd:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function s0(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(cs).join(`
`)}function r0(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function o0(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){const r=i.getActiveAttrib(e,s),o=r.name;let a=1;r.type===i.FLOAT_MAT2&&(a=2),r.type===i.FLOAT_MAT3&&(a=3),r.type===i.FLOAT_MAT4&&(a=4),t[o]={type:r.type,location:i.getAttribLocation(e,o),locationSize:a}}return t}function cs(i){return i!==""}function Uc(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Oc(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const a0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yo(i){return i.replace(a0,l0)}const c0=new Map;function l0(i,e){let t=ze[e];if(t===void 0){const n=c0.get(e);if(n!==void 0)t=ze[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Yo(t)}const h0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Fc(i){return i.replace(h0,d0)}function d0(i,e,t,n){let s="";for(let r=parseInt(e);r<parseInt(t);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function Bc(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function u0(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===kl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Md?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===fn&&(e="SHADOWMAP_TYPE_VSM"),e}function p0(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Wi:case Xi:e="ENVMAP_TYPE_CUBE";break;case Lr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function f0(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Xi:e="ENVMAP_MODE_REFRACTION";break}return e}function m0(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Hl:e="ENVMAP_BLENDING_MULTIPLY";break;case Zd:e="ENVMAP_BLENDING_MIX";break;case qd:e="ENVMAP_BLENDING_ADD";break}return e}function g0(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:n,maxMip:t}}function _0(i,e,t,n){const s=i.getContext(),r=t.defines;let o=t.vertexShader,a=t.fragmentShader;const c=u0(t),l=p0(t),h=f0(t),d=m0(t),u=g0(t),m=s0(t),g=r0(r),_=s.createProgram();let f,p,x=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(cs).join(`
`),f.length>0&&(f+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(cs).join(`
`),p.length>0&&(p+=`
`)):(f=[Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+h:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(cs).join(`
`),p=[Bc(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+l:"",t.envMap?"#define "+h:"",t.envMap?"#define "+d:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+c:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Fn?"#define TONE_MAPPING":"",t.toneMapping!==Fn?ze.tonemapping_pars_fragment:"",t.toneMapping!==Fn?i0("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,n0("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(cs).join(`
`)),o=Yo(o),o=Uc(o,t),o=Oc(o,t),a=Yo(a),a=Uc(a,t),a=Oc(a,t),o=Fc(o),a=Fc(a),t.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,f=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+f,p=["#define varying in",t.glslVersion===Qa?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Qa?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const v=x+f+o,S=x+p+a,R=Dc(s,s.VERTEX_SHADER,v),A=Dc(s,s.FRAGMENT_SHADER,S);s.attachShader(_,R),s.attachShader(_,A),t.index0AttributeName!==void 0?s.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function T(P){if(i.debug.checkShaderErrors){const N=s.getProgramInfoLog(_).trim(),U=s.getShaderInfoLog(R).trim(),G=s.getShaderInfoLog(A).trim();let Z=!0,F=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(Z=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,R,A);else{const j=Nc(s,R,"vertex"),k=Nc(s,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+N+`
`+j+`
`+k)}else N!==""?console.warn("THREE.WebGLProgram: Program Info Log:",N):(U===""||G==="")&&(F=!1);F&&(P.diagnostics={runnable:Z,programLog:N,vertexShader:{log:U,prefix:f},fragmentShader:{log:G,prefix:p}})}s.deleteShader(R),s.deleteShader(A),C=new ur(s,_),b=o0(s,_)}let C;this.getUniforms=function(){return C===void 0&&T(this),C};let b;this.getAttributes=function(){return b===void 0&&T(this),b};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=s.getProgramParameter(_,Jg)),y},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Qg++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=R,this.fragmentShader=A,this}let v0=0;class x0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,s=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(s)===!1&&(o.add(s),s.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new S0(e),t.set(e,n)),n}}class S0{constructor(e){this.id=v0++,this.code=e,this.usedTimes=0}}function M0(i,e,t,n,s,r,o){const a=new ra,c=new x0,l=new Set,h=[],d=s.logarithmicDepthBuffer,u=s.vertexTextures;let m=s.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(b){return l.add(b),b===0?"uv":`uv${b}`}function f(b,y,P,N,U){const G=N.fog,Z=U.geometry,F=b.isMeshStandardMaterial?N.environment:null,j=(b.isMeshStandardMaterial?t:e).get(b.envMap||F),k=j&&j.mapping===Lr?j.image.height:null,ie=g[b.type];b.precision!==null&&(m=s.getMaxPrecision(b.precision),m!==b.precision&&console.warn("THREE.WebGLProgram.getParameters:",b.precision,"not supported, using",m,"instead."));const se=Z.morphAttributes.position||Z.morphAttributes.normal||Z.morphAttributes.color,he=se!==void 0?se.length:0;let we=0;Z.morphAttributes.position!==void 0&&(we=1),Z.morphAttributes.normal!==void 0&&(we=2),Z.morphAttributes.color!==void 0&&(we=3);let Le,$,ee,fe;if(ie){const $e=nn[ie];Le=$e.vertexShader,$=$e.fragmentShader}else Le=b.vertexShader,$=b.fragmentShader,c.update(b),ee=c.getVertexShaderID(b),fe=c.getFragmentShaderID(b);const de=i.getRenderTarget(),He=U.isInstancedMesh===!0,Ie=U.isBatchedMesh===!0,Ye=!!b.map,D=!!b.matcap,Ze=!!j,We=!!b.aoMap,nt=!!b.lightMap,ye=!!b.bumpMap,qe=!!b.normalMap,Ge=!!b.displacementMap,De=!!b.emissiveMap,ot=!!b.metalnessMap,I=!!b.roughnessMap,E=b.anisotropy>0,X=b.clearcoat>0,J=b.dispersion>0,te=b.iridescence>0,ne=b.sheen>0,xe=b.transmission>0,ce=E&&!!b.anisotropyMap,ae=X&&!!b.clearcoatMap,Ne=X&&!!b.clearcoatNormalMap,re=X&&!!b.clearcoatRoughnessMap,ge=te&&!!b.iridescenceMap,Ve=te&&!!b.iridescenceThicknessMap,Ae=ne&&!!b.sheenColorMap,ue=ne&&!!b.sheenRoughnessMap,Ue=!!b.specularMap,Oe=!!b.specularColorMap,ct=!!b.specularIntensityMap,M=xe&&!!b.transmissionMap,Y=xe&&!!b.thicknessMap,z=!!b.gradientMap,q=!!b.alphaMap,Q=b.alphaTest>0,Se=!!b.alphaHash,Pe=!!b.extensions;let lt=Fn;b.toneMapped&&(de===null||de.isXRRenderTarget===!0)&&(lt=i.toneMapping);const ft={shaderID:ie,shaderType:b.type,shaderName:b.name,vertexShader:Le,fragmentShader:$,defines:b.defines,customVertexShaderID:ee,customFragmentShaderID:fe,isRawShaderMaterial:b.isRawShaderMaterial===!0,glslVersion:b.glslVersion,precision:m,batching:Ie,batchingColor:Ie&&U._colorsTexture!==null,instancing:He,instancingColor:He&&U.instanceColor!==null,instancingMorph:He&&U.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:de===null?i.outputColorSpace:de.isXRRenderTarget===!0?de.texture.colorSpace:Vn,alphaToCoverage:!!b.alphaToCoverage,map:Ye,matcap:D,envMap:Ze,envMapMode:Ze&&j.mapping,envMapCubeUVHeight:k,aoMap:We,lightMap:nt,bumpMap:ye,normalMap:qe,displacementMap:u&&Ge,emissiveMap:De,normalMapObjectSpace:qe&&b.normalMapType===mu,normalMapTangentSpace:qe&&b.normalMapType===jl,metalnessMap:ot,roughnessMap:I,anisotropy:E,anisotropyMap:ce,clearcoat:X,clearcoatMap:ae,clearcoatNormalMap:Ne,clearcoatRoughnessMap:re,dispersion:J,iridescence:te,iridescenceMap:ge,iridescenceThicknessMap:Ve,sheen:ne,sheenColorMap:Ae,sheenRoughnessMap:ue,specularMap:Ue,specularColorMap:Oe,specularIntensityMap:ct,transmission:xe,transmissionMap:M,thicknessMap:Y,gradientMap:z,opaque:b.transparent===!1&&b.blending===zi&&b.alphaToCoverage===!1,alphaMap:q,alphaTest:Q,alphaHash:Se,combine:b.combine,mapUv:Ye&&_(b.map.channel),aoMapUv:We&&_(b.aoMap.channel),lightMapUv:nt&&_(b.lightMap.channel),bumpMapUv:ye&&_(b.bumpMap.channel),normalMapUv:qe&&_(b.normalMap.channel),displacementMapUv:Ge&&_(b.displacementMap.channel),emissiveMapUv:De&&_(b.emissiveMap.channel),metalnessMapUv:ot&&_(b.metalnessMap.channel),roughnessMapUv:I&&_(b.roughnessMap.channel),anisotropyMapUv:ce&&_(b.anisotropyMap.channel),clearcoatMapUv:ae&&_(b.clearcoatMap.channel),clearcoatNormalMapUv:Ne&&_(b.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:re&&_(b.clearcoatRoughnessMap.channel),iridescenceMapUv:ge&&_(b.iridescenceMap.channel),iridescenceThicknessMapUv:Ve&&_(b.iridescenceThicknessMap.channel),sheenColorMapUv:Ae&&_(b.sheenColorMap.channel),sheenRoughnessMapUv:ue&&_(b.sheenRoughnessMap.channel),specularMapUv:Ue&&_(b.specularMap.channel),specularColorMapUv:Oe&&_(b.specularColorMap.channel),specularIntensityMapUv:ct&&_(b.specularIntensityMap.channel),transmissionMapUv:M&&_(b.transmissionMap.channel),thicknessMapUv:Y&&_(b.thicknessMap.channel),alphaMapUv:q&&_(b.alphaMap.channel),vertexTangents:!!Z.attributes.tangent&&(qe||E),vertexColors:b.vertexColors,vertexAlphas:b.vertexColors===!0&&!!Z.attributes.color&&Z.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!Z.attributes.uv&&(Ye||q),fog:!!G,useFog:b.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:b.flatShading===!0,sizeAttenuation:b.sizeAttenuation===!0,logarithmicDepthBuffer:d,skinning:U.isSkinnedMesh===!0,morphTargets:Z.morphAttributes.position!==void 0,morphNormals:Z.morphAttributes.normal!==void 0,morphColors:Z.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:we,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:b.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:lt,decodeVideoTexture:Ye&&b.map.isVideoTexture===!0&&et.getTransfer(b.map.colorSpace)===st,premultipliedAlpha:b.premultipliedAlpha,doubleSided:b.side===Et,flipSided:b.side===Lt,useDepthPacking:b.depthPacking>=0,depthPacking:b.depthPacking||0,index0AttributeName:b.index0AttributeName,extensionClipCullDistance:Pe&&b.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:Pe&&b.extensions.multiDraw===!0&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:b.customProgramCacheKey()};return ft.vertexUv1s=l.has(1),ft.vertexUv2s=l.has(2),ft.vertexUv3s=l.has(3),l.clear(),ft}function p(b){const y=[];if(b.shaderID?y.push(b.shaderID):(y.push(b.customVertexShaderID),y.push(b.customFragmentShaderID)),b.defines!==void 0)for(const P in b.defines)y.push(P),y.push(b.defines[P]);return b.isRawShaderMaterial===!1&&(x(y,b),v(y,b),y.push(i.outputColorSpace)),y.push(b.customProgramCacheKey),y.join()}function x(b,y){b.push(y.precision),b.push(y.outputColorSpace),b.push(y.envMapMode),b.push(y.envMapCubeUVHeight),b.push(y.mapUv),b.push(y.alphaMapUv),b.push(y.lightMapUv),b.push(y.aoMapUv),b.push(y.bumpMapUv),b.push(y.normalMapUv),b.push(y.displacementMapUv),b.push(y.emissiveMapUv),b.push(y.metalnessMapUv),b.push(y.roughnessMapUv),b.push(y.anisotropyMapUv),b.push(y.clearcoatMapUv),b.push(y.clearcoatNormalMapUv),b.push(y.clearcoatRoughnessMapUv),b.push(y.iridescenceMapUv),b.push(y.iridescenceThicknessMapUv),b.push(y.sheenColorMapUv),b.push(y.sheenRoughnessMapUv),b.push(y.specularMapUv),b.push(y.specularColorMapUv),b.push(y.specularIntensityMapUv),b.push(y.transmissionMapUv),b.push(y.thicknessMapUv),b.push(y.combine),b.push(y.fogExp2),b.push(y.sizeAttenuation),b.push(y.morphTargetsCount),b.push(y.morphAttributeCount),b.push(y.numDirLights),b.push(y.numPointLights),b.push(y.numSpotLights),b.push(y.numSpotLightMaps),b.push(y.numHemiLights),b.push(y.numRectAreaLights),b.push(y.numDirLightShadows),b.push(y.numPointLightShadows),b.push(y.numSpotLightShadows),b.push(y.numSpotLightShadowsWithMaps),b.push(y.numLightProbes),b.push(y.shadowMapType),b.push(y.toneMapping),b.push(y.numClippingPlanes),b.push(y.numClipIntersection),b.push(y.depthPacking)}function v(b,y){a.disableAll(),y.supportsVertexTextures&&a.enable(0),y.instancing&&a.enable(1),y.instancingColor&&a.enable(2),y.instancingMorph&&a.enable(3),y.matcap&&a.enable(4),y.envMap&&a.enable(5),y.normalMapObjectSpace&&a.enable(6),y.normalMapTangentSpace&&a.enable(7),y.clearcoat&&a.enable(8),y.iridescence&&a.enable(9),y.alphaTest&&a.enable(10),y.vertexColors&&a.enable(11),y.vertexAlphas&&a.enable(12),y.vertexUv1s&&a.enable(13),y.vertexUv2s&&a.enable(14),y.vertexUv3s&&a.enable(15),y.vertexTangents&&a.enable(16),y.anisotropy&&a.enable(17),y.alphaHash&&a.enable(18),y.batching&&a.enable(19),y.dispersion&&a.enable(20),y.batchingColor&&a.enable(21),b.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.skinning&&a.enable(4),y.morphTargets&&a.enable(5),y.morphNormals&&a.enable(6),y.morphColors&&a.enable(7),y.premultipliedAlpha&&a.enable(8),y.shadowMapEnabled&&a.enable(9),y.doubleSided&&a.enable(10),y.flipSided&&a.enable(11),y.useDepthPacking&&a.enable(12),y.dithering&&a.enable(13),y.transmission&&a.enable(14),y.sheen&&a.enable(15),y.opaque&&a.enable(16),y.pointsUvs&&a.enable(17),y.decodeVideoTexture&&a.enable(18),y.alphaToCoverage&&a.enable(19),b.push(a.mask)}function S(b){const y=g[b.type];let P;if(y){const N=nn[y];P=sp.clone(N.uniforms)}else P=b.uniforms;return P}function R(b,y){let P;for(let N=0,U=h.length;N<U;N++){const G=h[N];if(G.cacheKey===y){P=G,++P.usedTimes;break}}return P===void 0&&(P=new _0(i,y,b,r),h.push(P)),P}function A(b){if(--b.usedTimes===0){const y=h.indexOf(b);h[y]=h[h.length-1],h.pop(),b.destroy()}}function T(b){c.remove(b)}function C(){c.dispose()}return{getParameters:f,getProgramCacheKey:p,getUniforms:S,acquireProgram:R,releaseProgram:A,releaseShaderCache:T,programs:h,dispose:C}}function y0(){let i=new WeakMap;function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function t(r){i.delete(r)}function n(r,o,a){i.get(r)[o]=a}function s(){i=new WeakMap}return{get:e,remove:t,update:n,dispose:s}}function b0(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function zc(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function kc(){const i=[];let e=0;const t=[],n=[],s=[];function r(){e=0,t.length=0,n.length=0,s.length=0}function o(d,u,m,g,_,f){let p=i[e];return p===void 0?(p={id:d.id,object:d,geometry:u,material:m,groupOrder:g,renderOrder:d.renderOrder,z:_,group:f},i[e]=p):(p.id=d.id,p.object=d,p.geometry=u,p.material=m,p.groupOrder=g,p.renderOrder=d.renderOrder,p.z=_,p.group=f),e++,p}function a(d,u,m,g,_,f){const p=o(d,u,m,g,_,f);m.transmission>0?n.push(p):m.transparent===!0?s.push(p):t.push(p)}function c(d,u,m,g,_,f){const p=o(d,u,m,g,_,f);m.transmission>0?n.unshift(p):m.transparent===!0?s.unshift(p):t.unshift(p)}function l(d,u){t.length>1&&t.sort(d||b0),n.length>1&&n.sort(u||zc),s.length>1&&s.sort(u||zc)}function h(){for(let d=e,u=i.length;d<u;d++){const m=i[d];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:n,transparent:s,init:r,push:a,unshift:c,finish:h,sort:l}}function E0(){let i=new WeakMap;function e(n,s){const r=i.get(n);let o;return r===void 0?(o=new kc,i.set(n,[o])):s>=r.length?(o=new kc,r.push(o)):o=r[s],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function A0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new L,color:new ve};break;case"SpotLight":t={position:new L,direction:new L,color:new ve,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new L,color:new ve,distance:0,decay:0};break;case"HemisphereLight":t={direction:new L,skyColor:new ve,groundColor:new ve};break;case"RectAreaLight":t={color:new ve,position:new L,halfWidth:new L,halfHeight:new L};break}return i[e.id]=t,t}}}function T0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case"SpotLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K};break;case"PointLight":t={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new K,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let w0=0;function R0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function C0(i){const e=new A0,t=T0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let l=0;l<9;l++)n.probe.push(new L);const s=new L,r=new it,o=new it;function a(l){let h=0,d=0,u=0;for(let b=0;b<9;b++)n.probe[b].set(0,0,0);let m=0,g=0,_=0,f=0,p=0,x=0,v=0,S=0,R=0,A=0,T=0;l.sort(R0);for(let b=0,y=l.length;b<y;b++){const P=l[b],N=P.color,U=P.intensity,G=P.distance,Z=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)h+=N.r*U,d+=N.g*U,u+=N.b*U;else if(P.isLightProbe){for(let F=0;F<9;F++)n.probe[F].addScaledVector(P.sh.coefficients[F],U);T++}else if(P.isDirectionalLight){const F=e.get(P);if(F.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const j=P.shadow,k=t.get(P);k.shadowBias=j.bias,k.shadowNormalBias=j.normalBias,k.shadowRadius=j.radius,k.shadowMapSize=j.mapSize,n.directionalShadow[m]=k,n.directionalShadowMap[m]=Z,n.directionalShadowMatrix[m]=P.shadow.matrix,x++}n.directional[m]=F,m++}else if(P.isSpotLight){const F=e.get(P);F.position.setFromMatrixPosition(P.matrixWorld),F.color.copy(N).multiplyScalar(U),F.distance=G,F.coneCos=Math.cos(P.angle),F.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),F.decay=P.decay,n.spot[_]=F;const j=P.shadow;if(P.map&&(n.spotLightMap[R]=P.map,R++,j.updateMatrices(P),P.castShadow&&A++),n.spotLightMatrix[_]=j.matrix,P.castShadow){const k=t.get(P);k.shadowBias=j.bias,k.shadowNormalBias=j.normalBias,k.shadowRadius=j.radius,k.shadowMapSize=j.mapSize,n.spotShadow[_]=k,n.spotShadowMap[_]=Z,S++}_++}else if(P.isRectAreaLight){const F=e.get(P);F.color.copy(N).multiplyScalar(U),F.halfWidth.set(P.width*.5,0,0),F.halfHeight.set(0,P.height*.5,0),n.rectArea[f]=F,f++}else if(P.isPointLight){const F=e.get(P);if(F.color.copy(P.color).multiplyScalar(P.intensity),F.distance=P.distance,F.decay=P.decay,P.castShadow){const j=P.shadow,k=t.get(P);k.shadowBias=j.bias,k.shadowNormalBias=j.normalBias,k.shadowRadius=j.radius,k.shadowMapSize=j.mapSize,k.shadowCameraNear=j.camera.near,k.shadowCameraFar=j.camera.far,n.pointShadow[g]=k,n.pointShadowMap[g]=Z,n.pointShadowMatrix[g]=P.shadow.matrix,v++}n.point[g]=F,g++}else if(P.isHemisphereLight){const F=e.get(P);F.skyColor.copy(P.color).multiplyScalar(U),F.groundColor.copy(P.groundColor).multiplyScalar(U),n.hemi[p]=F,p++}}f>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=le.LTC_FLOAT_1,n.rectAreaLTC2=le.LTC_FLOAT_2):(n.rectAreaLTC1=le.LTC_HALF_1,n.rectAreaLTC2=le.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=d,n.ambient[2]=u;const C=n.hash;(C.directionalLength!==m||C.pointLength!==g||C.spotLength!==_||C.rectAreaLength!==f||C.hemiLength!==p||C.numDirectionalShadows!==x||C.numPointShadows!==v||C.numSpotShadows!==S||C.numSpotMaps!==R||C.numLightProbes!==T)&&(n.directional.length=m,n.spot.length=_,n.rectArea.length=f,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=v,n.pointShadowMap.length=v,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=v,n.spotLightMatrix.length=S+R-A,n.spotLightMap.length=R,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=T,C.directionalLength=m,C.pointLength=g,C.spotLength=_,C.rectAreaLength=f,C.hemiLength=p,C.numDirectionalShadows=x,C.numPointShadows=v,C.numSpotShadows=S,C.numSpotMaps=R,C.numLightProbes=T,n.version=w0++)}function c(l,h){let d=0,u=0,m=0,g=0,_=0;const f=h.matrixWorldInverse;for(let p=0,x=l.length;p<x;p++){const v=l[p];if(v.isDirectionalLight){const S=n.directional[d];S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(f),d++}else if(v.isSpotLight){const S=n.spot[m];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(f),S.direction.setFromMatrixPosition(v.matrixWorld),s.setFromMatrixPosition(v.target.matrixWorld),S.direction.sub(s),S.direction.transformDirection(f),m++}else if(v.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(f),o.identity(),r.copy(v.matrixWorld),r.premultiply(f),o.extractRotation(r),S.halfWidth.set(v.width*.5,0,0),S.halfHeight.set(0,v.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(v.isPointLight){const S=n.point[u];S.position.setFromMatrixPosition(v.matrixWorld),S.position.applyMatrix4(f),u++}else if(v.isHemisphereLight){const S=n.hemi[_];S.direction.setFromMatrixPosition(v.matrixWorld),S.direction.transformDirection(f),_++}}}return{setup:a,setupView:c,state:n}}function Hc(i){const e=new C0(i),t=[],n=[];function s(h){l.camera=h,t.length=0,n.length=0}function r(h){t.push(h)}function o(h){n.push(h)}function a(){e.setup(t)}function c(h){e.setupView(t,h)}const l={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:s,state:l,setupLights:a,setupLightsView:c,pushLight:r,pushShadow:o}}function P0(i){let e=new WeakMap;function t(s,r=0){const o=e.get(s);let a;return o===void 0?(a=new Hc(i),e.set(s,[a])):r>=o.length?(a=new Hc(i),o.push(a)):a=o[r],a}function n(){e=new WeakMap}return{get:t,dispose:n}}class L0 extends di{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=pu,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class I0 extends di{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const D0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,N0=`uniform sampler2D shadow_pass;
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
}`;function U0(i,e,t){let n=new oa;const s=new K,r=new K,o=new rt,a=new L0({depthPacking:fu}),c=new I0,l={},h=t.maxTextureSize,d={[kn]:Lt,[Lt]:kn,[Et]:Et},u=new Gn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new K},radius:{value:4}},vertexShader:D0,fragmentShader:N0}),m=u.clone();m.defines.HORIZONTAL_PASS=1;const g=new Fe;g.setAttribute("position",new It(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Be(g,u),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kl;let p=this.type;this.render=function(A,T,C){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||A.length===0)return;const b=i.getRenderTarget(),y=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),N=i.state;N.setBlending(On),N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const U=p!==fn&&this.type===fn,G=p===fn&&this.type!==fn;for(let Z=0,F=A.length;Z<F;Z++){const j=A[Z],k=j.shadow;if(k===void 0){console.warn("THREE.WebGLShadowMap:",j,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;s.copy(k.mapSize);const ie=k.getFrameExtents();if(s.multiply(ie),r.copy(k.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(r.x=Math.floor(h/ie.x),s.x=r.x*ie.x,k.mapSize.x=r.x),s.y>h&&(r.y=Math.floor(h/ie.y),s.y=r.y*ie.y,k.mapSize.y=r.y)),k.map===null||U===!0||G===!0){const he=this.type!==fn?{minFilter:Wt,magFilter:Wt}:{};k.map!==null&&k.map.dispose(),k.map=new ci(s.x,s.y,he),k.map.texture.name=j.name+".shadowMap",k.camera.updateProjectionMatrix()}i.setRenderTarget(k.map),i.clear();const se=k.getViewportCount();for(let he=0;he<se;he++){const we=k.getViewport(he);o.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),N.viewport(o),k.updateMatrices(j,he),n=k.getFrustum(),S(T,C,k.camera,j,this.type)}k.isPointLightShadow!==!0&&this.type===fn&&x(k,C),k.needsUpdate=!1}p=this.type,f.needsUpdate=!1,i.setRenderTarget(b,y,P)};function x(A,T){const C=e.update(_);u.defines.VSM_SAMPLES!==A.blurSamples&&(u.defines.VSM_SAMPLES=A.blurSamples,m.defines.VSM_SAMPLES=A.blurSamples,u.needsUpdate=!0,m.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new ci(s.x,s.y)),u.uniforms.shadow_pass.value=A.map.texture,u.uniforms.resolution.value=A.mapSize,u.uniforms.radius.value=A.radius,i.setRenderTarget(A.mapPass),i.clear(),i.renderBufferDirect(T,null,C,u,_,null),m.uniforms.shadow_pass.value=A.mapPass.texture,m.uniforms.resolution.value=A.mapSize,m.uniforms.radius.value=A.radius,i.setRenderTarget(A.map),i.clear(),i.renderBufferDirect(T,null,C,m,_,null)}function v(A,T,C,b){let y=null;const P=C.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(P!==void 0)y=P;else if(y=C.isPointLight===!0?c:a,i.localClippingEnabled&&T.clipShadows===!0&&Array.isArray(T.clippingPlanes)&&T.clippingPlanes.length!==0||T.displacementMap&&T.displacementScale!==0||T.alphaMap&&T.alphaTest>0||T.map&&T.alphaTest>0){const N=y.uuid,U=T.uuid;let G=l[N];G===void 0&&(G={},l[N]=G);let Z=G[U];Z===void 0&&(Z=y.clone(),G[U]=Z,T.addEventListener("dispose",R)),y=Z}if(y.visible=T.visible,y.wireframe=T.wireframe,b===fn?y.side=T.shadowSide!==null?T.shadowSide:T.side:y.side=T.shadowSide!==null?T.shadowSide:d[T.side],y.alphaMap=T.alphaMap,y.alphaTest=T.alphaTest,y.map=T.map,y.clipShadows=T.clipShadows,y.clippingPlanes=T.clippingPlanes,y.clipIntersection=T.clipIntersection,y.displacementMap=T.displacementMap,y.displacementScale=T.displacementScale,y.displacementBias=T.displacementBias,y.wireframeLinewidth=T.wireframeLinewidth,y.linewidth=T.linewidth,C.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const N=i.properties.get(y);N.light=C}return y}function S(A,T,C,b,y){if(A.visible===!1)return;if(A.layers.test(T.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&y===fn)&&(!A.frustumCulled||n.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(C.matrixWorldInverse,A.matrixWorld);const U=e.update(A),G=A.material;if(Array.isArray(G)){const Z=U.groups;for(let F=0,j=Z.length;F<j;F++){const k=Z[F],ie=G[k.materialIndex];if(ie&&ie.visible){const se=v(A,ie,b,y);A.onBeforeShadow(i,A,T,C,U,se,k),i.renderBufferDirect(C,null,U,se,A,k),A.onAfterShadow(i,A,T,C,U,se,k)}}}else if(G.visible){const Z=v(A,G,b,y);A.onBeforeShadow(i,A,T,C,U,Z,null),i.renderBufferDirect(C,null,U,Z,A,null),A.onAfterShadow(i,A,T,C,U,Z,null)}}const N=A.children;for(let U=0,G=N.length;U<G;U++)S(N[U],T,C,b,y)}function R(A){A.target.removeEventListener("dispose",R);for(const C in l){const b=l[C],y=A.target.uuid;y in b&&(b[y].dispose(),delete b[y])}}}function O0(i){function e(){let M=!1;const Y=new rt;let z=null;const q=new rt(0,0,0,0);return{setMask:function(Q){z!==Q&&!M&&(i.colorMask(Q,Q,Q,Q),z=Q)},setLocked:function(Q){M=Q},setClear:function(Q,Se,Pe,lt,ft){ft===!0&&(Q*=lt,Se*=lt,Pe*=lt),Y.set(Q,Se,Pe,lt),q.equals(Y)===!1&&(i.clearColor(Q,Se,Pe,lt),q.copy(Y))},reset:function(){M=!1,z=null,q.set(-1,0,0,0)}}}function t(){let M=!1,Y=null,z=null,q=null;return{setTest:function(Q){Q?fe(i.DEPTH_TEST):de(i.DEPTH_TEST)},setMask:function(Q){Y!==Q&&!M&&(i.depthMask(Q),Y=Q)},setFunc:function(Q){if(z!==Q){switch(Q){case kd:i.depthFunc(i.NEVER);break;case Hd:i.depthFunc(i.ALWAYS);break;case Gd:i.depthFunc(i.LESS);break;case pr:i.depthFunc(i.LEQUAL);break;case Vd:i.depthFunc(i.EQUAL);break;case Wd:i.depthFunc(i.GEQUAL);break;case Xd:i.depthFunc(i.GREATER);break;case Yd:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}z=Q}},setLocked:function(Q){M=Q},setClear:function(Q){q!==Q&&(i.clearDepth(Q),q=Q)},reset:function(){M=!1,Y=null,z=null,q=null}}}function n(){let M=!1,Y=null,z=null,q=null,Q=null,Se=null,Pe=null,lt=null,ft=null;return{setTest:function($e){M||($e?fe(i.STENCIL_TEST):de(i.STENCIL_TEST))},setMask:function($e){Y!==$e&&!M&&(i.stencilMask($e),Y=$e)},setFunc:function($e,mt,gt){(z!==$e||q!==mt||Q!==gt)&&(i.stencilFunc($e,mt,gt),z=$e,q=mt,Q=gt)},setOp:function($e,mt,gt){(Se!==$e||Pe!==mt||lt!==gt)&&(i.stencilOp($e,mt,gt),Se=$e,Pe=mt,lt=gt)},setLocked:function($e){M=$e},setClear:function($e){ft!==$e&&(i.clearStencil($e),ft=$e)},reset:function(){M=!1,Y=null,z=null,q=null,Q=null,Se=null,Pe=null,lt=null,ft=null}}}const s=new e,r=new t,o=new n,a=new WeakMap,c=new WeakMap;let l={},h={},d=new WeakMap,u=[],m=null,g=!1,_=null,f=null,p=null,x=null,v=null,S=null,R=null,A=new ve(0,0,0),T=0,C=!1,b=null,y=null,P=null,N=null,U=null;const G=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,F=0;const j=i.getParameter(i.VERSION);j.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(j)[1]),Z=F>=1):j.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(j)[1]),Z=F>=2);let k=null,ie={};const se=i.getParameter(i.SCISSOR_BOX),he=i.getParameter(i.VIEWPORT),we=new rt().fromArray(se),Le=new rt().fromArray(he);function $(M,Y,z,q){const Q=new Uint8Array(4),Se=i.createTexture();i.bindTexture(M,Se),i.texParameteri(M,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(M,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Pe=0;Pe<z;Pe++)M===i.TEXTURE_3D||M===i.TEXTURE_2D_ARRAY?i.texImage3D(Y,0,i.RGBA,1,1,q,0,i.RGBA,i.UNSIGNED_BYTE,Q):i.texImage2D(Y+Pe,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,Q);return Se}const ee={};ee[i.TEXTURE_2D]=$(i.TEXTURE_2D,i.TEXTURE_2D,1),ee[i.TEXTURE_CUBE_MAP]=$(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),ee[i.TEXTURE_2D_ARRAY]=$(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),ee[i.TEXTURE_3D]=$(i.TEXTURE_3D,i.TEXTURE_3D,1,1),s.setClear(0,0,0,1),r.setClear(1),o.setClear(0),fe(i.DEPTH_TEST),r.setFunc(pr),ye(!1),qe(ya),fe(i.CULL_FACE),We(On);function fe(M){l[M]!==!0&&(i.enable(M),l[M]=!0)}function de(M){l[M]!==!1&&(i.disable(M),l[M]=!1)}function He(M,Y){return h[M]!==Y?(i.bindFramebuffer(M,Y),h[M]=Y,M===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=Y),M===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=Y),!0):!1}function Ie(M,Y){let z=u,q=!1;if(M){z=d.get(Y),z===void 0&&(z=[],d.set(Y,z));const Q=M.textures;if(z.length!==Q.length||z[0]!==i.COLOR_ATTACHMENT0){for(let Se=0,Pe=Q.length;Se<Pe;Se++)z[Se]=i.COLOR_ATTACHMENT0+Se;z.length=Q.length,q=!0}}else z[0]!==i.BACK&&(z[0]=i.BACK,q=!0);q&&i.drawBuffers(z)}function Ye(M){return m!==M?(i.useProgram(M),m=M,!0):!1}const D={[ti]:i.FUNC_ADD,[bd]:i.FUNC_SUBTRACT,[Ed]:i.FUNC_REVERSE_SUBTRACT};D[Ad]=i.MIN,D[Td]=i.MAX;const Ze={[wd]:i.ZERO,[Rd]:i.ONE,[Cd]:i.SRC_COLOR,[ko]:i.SRC_ALPHA,[Ud]:i.SRC_ALPHA_SATURATE,[Dd]:i.DST_COLOR,[Ld]:i.DST_ALPHA,[Pd]:i.ONE_MINUS_SRC_COLOR,[Ho]:i.ONE_MINUS_SRC_ALPHA,[Nd]:i.ONE_MINUS_DST_COLOR,[Id]:i.ONE_MINUS_DST_ALPHA,[Od]:i.CONSTANT_COLOR,[Fd]:i.ONE_MINUS_CONSTANT_COLOR,[Bd]:i.CONSTANT_ALPHA,[zd]:i.ONE_MINUS_CONSTANT_ALPHA};function We(M,Y,z,q,Q,Se,Pe,lt,ft,$e){if(M===On){g===!0&&(de(i.BLEND),g=!1);return}if(g===!1&&(fe(i.BLEND),g=!0),M!==yd){if(M!==_||$e!==C){if((f!==ti||v!==ti)&&(i.blendEquation(i.FUNC_ADD),f=ti,v=ti),$e)switch(M){case zi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ba:i.blendFunc(i.ONE,i.ONE);break;case Ea:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Aa:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",M);break}else switch(M){case zi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case ba:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case Ea:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Aa:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",M);break}p=null,x=null,S=null,R=null,A.set(0,0,0),T=0,_=M,C=$e}return}Q=Q||Y,Se=Se||z,Pe=Pe||q,(Y!==f||Q!==v)&&(i.blendEquationSeparate(D[Y],D[Q]),f=Y,v=Q),(z!==p||q!==x||Se!==S||Pe!==R)&&(i.blendFuncSeparate(Ze[z],Ze[q],Ze[Se],Ze[Pe]),p=z,x=q,S=Se,R=Pe),(lt.equals(A)===!1||ft!==T)&&(i.blendColor(lt.r,lt.g,lt.b,ft),A.copy(lt),T=ft),_=M,C=!1}function nt(M,Y){M.side===Et?de(i.CULL_FACE):fe(i.CULL_FACE);let z=M.side===Lt;Y&&(z=!z),ye(z),M.blending===zi&&M.transparent===!1?We(On):We(M.blending,M.blendEquation,M.blendSrc,M.blendDst,M.blendEquationAlpha,M.blendSrcAlpha,M.blendDstAlpha,M.blendColor,M.blendAlpha,M.premultipliedAlpha),r.setFunc(M.depthFunc),r.setTest(M.depthTest),r.setMask(M.depthWrite),s.setMask(M.colorWrite);const q=M.stencilWrite;o.setTest(q),q&&(o.setMask(M.stencilWriteMask),o.setFunc(M.stencilFunc,M.stencilRef,M.stencilFuncMask),o.setOp(M.stencilFail,M.stencilZFail,M.stencilZPass)),De(M.polygonOffset,M.polygonOffsetFactor,M.polygonOffsetUnits),M.alphaToCoverage===!0?fe(i.SAMPLE_ALPHA_TO_COVERAGE):de(i.SAMPLE_ALPHA_TO_COVERAGE)}function ye(M){b!==M&&(M?i.frontFace(i.CW):i.frontFace(i.CCW),b=M)}function qe(M){M!==xd?(fe(i.CULL_FACE),M!==y&&(M===ya?i.cullFace(i.BACK):M===Sd?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):de(i.CULL_FACE),y=M}function Ge(M){M!==P&&(Z&&i.lineWidth(M),P=M)}function De(M,Y,z){M?(fe(i.POLYGON_OFFSET_FILL),(N!==Y||U!==z)&&(i.polygonOffset(Y,z),N=Y,U=z)):de(i.POLYGON_OFFSET_FILL)}function ot(M){M?fe(i.SCISSOR_TEST):de(i.SCISSOR_TEST)}function I(M){M===void 0&&(M=i.TEXTURE0+G-1),k!==M&&(i.activeTexture(M),k=M)}function E(M,Y,z){z===void 0&&(k===null?z=i.TEXTURE0+G-1:z=k);let q=ie[z];q===void 0&&(q={type:void 0,texture:void 0},ie[z]=q),(q.type!==M||q.texture!==Y)&&(k!==z&&(i.activeTexture(z),k=z),i.bindTexture(M,Y||ee[M]),q.type=M,q.texture=Y)}function X(){const M=ie[k];M!==void 0&&M.type!==void 0&&(i.bindTexture(M.type,null),M.type=void 0,M.texture=void 0)}function J(){try{i.compressedTexImage2D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function te(){try{i.compressedTexImage3D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function ne(){try{i.texSubImage2D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function xe(){try{i.texSubImage3D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function ce(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function ae(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function Ne(){try{i.texStorage2D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function re(){try{i.texStorage3D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function ge(){try{i.texImage2D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function Ve(){try{i.texImage3D.apply(i,arguments)}catch(M){console.error("THREE.WebGLState:",M)}}function Ae(M){we.equals(M)===!1&&(i.scissor(M.x,M.y,M.z,M.w),we.copy(M))}function ue(M){Le.equals(M)===!1&&(i.viewport(M.x,M.y,M.z,M.w),Le.copy(M))}function Ue(M,Y){let z=c.get(Y);z===void 0&&(z=new WeakMap,c.set(Y,z));let q=z.get(M);q===void 0&&(q=i.getUniformBlockIndex(Y,M.name),z.set(M,q))}function Oe(M,Y){const q=c.get(Y).get(M);a.get(Y)!==q&&(i.uniformBlockBinding(Y,q,M.__bindingPointIndex),a.set(Y,q))}function ct(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),l={},k=null,ie={},h={},d=new WeakMap,u=[],m=null,g=!1,_=null,f=null,p=null,x=null,v=null,S=null,R=null,A=new ve(0,0,0),T=0,C=!1,b=null,y=null,P=null,N=null,U=null,we.set(0,0,i.canvas.width,i.canvas.height),Le.set(0,0,i.canvas.width,i.canvas.height),s.reset(),r.reset(),o.reset()}return{buffers:{color:s,depth:r,stencil:o},enable:fe,disable:de,bindFramebuffer:He,drawBuffers:Ie,useProgram:Ye,setBlending:We,setMaterial:nt,setFlipSided:ye,setCullFace:qe,setLineWidth:Ge,setPolygonOffset:De,setScissorTest:ot,activeTexture:I,bindTexture:E,unbindTexture:X,compressedTexImage2D:J,compressedTexImage3D:te,texImage2D:ge,texImage3D:Ve,updateUBOMapping:Ue,uniformBlockBinding:Oe,texStorage2D:Ne,texStorage3D:re,texSubImage2D:ne,texSubImage3D:xe,compressedTexSubImage2D:ce,compressedTexSubImage3D:ae,scissor:Ae,viewport:ue,reset:ct}}function F0(i,e,t,n,s,r,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),l=new K,h=new WeakMap;let d;const u=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(I,E){return m?new OffscreenCanvas(I,E):fs("canvas")}function _(I,E,X){let J=1;const te=ot(I);if((te.width>X||te.height>X)&&(J=X/Math.max(te.width,te.height)),J<1)if(typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&I instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&I instanceof ImageBitmap||typeof VideoFrame<"u"&&I instanceof VideoFrame){const ne=Math.floor(J*te.width),xe=Math.floor(J*te.height);d===void 0&&(d=g(ne,xe));const ce=E?g(ne,xe):d;return ce.width=ne,ce.height=xe,ce.getContext("2d").drawImage(I,0,0,ne,xe),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+ne+"x"+xe+")."),ce}else return"data"in I&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),I;return I}function f(I){return I.generateMipmaps&&I.minFilter!==Wt&&I.minFilter!==Kt}function p(I){i.generateMipmap(I)}function x(I,E,X,J,te=!1){if(I!==null){if(i[I]!==void 0)return i[I];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+I+"'")}let ne=E;if(E===i.RED&&(X===i.FLOAT&&(ne=i.R32F),X===i.HALF_FLOAT&&(ne=i.R16F),X===i.UNSIGNED_BYTE&&(ne=i.R8)),E===i.RED_INTEGER&&(X===i.UNSIGNED_BYTE&&(ne=i.R8UI),X===i.UNSIGNED_SHORT&&(ne=i.R16UI),X===i.UNSIGNED_INT&&(ne=i.R32UI),X===i.BYTE&&(ne=i.R8I),X===i.SHORT&&(ne=i.R16I),X===i.INT&&(ne=i.R32I)),E===i.RG&&(X===i.FLOAT&&(ne=i.RG32F),X===i.HALF_FLOAT&&(ne=i.RG16F),X===i.UNSIGNED_BYTE&&(ne=i.RG8)),E===i.RG_INTEGER&&(X===i.UNSIGNED_BYTE&&(ne=i.RG8UI),X===i.UNSIGNED_SHORT&&(ne=i.RG16UI),X===i.UNSIGNED_INT&&(ne=i.RG32UI),X===i.BYTE&&(ne=i.RG8I),X===i.SHORT&&(ne=i.RG16I),X===i.INT&&(ne=i.RG32I)),E===i.RGB&&X===i.UNSIGNED_INT_5_9_9_9_REV&&(ne=i.RGB9_E5),E===i.RGBA){const xe=te?gr:et.getTransfer(J);X===i.FLOAT&&(ne=i.RGBA32F),X===i.HALF_FLOAT&&(ne=i.RGBA16F),X===i.UNSIGNED_BYTE&&(ne=xe===st?i.SRGB8_ALPHA8:i.RGBA8),X===i.UNSIGNED_SHORT_4_4_4_4&&(ne=i.RGBA4),X===i.UNSIGNED_SHORT_5_5_5_1&&(ne=i.RGB5_A1)}return(ne===i.R16F||ne===i.R32F||ne===i.RG16F||ne===i.RG32F||ne===i.RGBA16F||ne===i.RGBA32F)&&e.get("EXT_color_buffer_float"),ne}function v(I,E){let X;return I?E===null||E===Yi||E===Zi?X=i.DEPTH24_STENCIL8:E===Un?X=i.DEPTH32F_STENCIL8:E===mr&&(X=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Yi||E===Zi?X=i.DEPTH_COMPONENT24:E===Un?X=i.DEPTH_COMPONENT32F:E===mr&&(X=i.DEPTH_COMPONENT16),X}function S(I,E){return f(I)===!0||I.isFramebufferTexture&&I.minFilter!==Wt&&I.minFilter!==Kt?Math.log2(Math.max(E.width,E.height))+1:I.mipmaps!==void 0&&I.mipmaps.length>0?I.mipmaps.length:I.isCompressedTexture&&Array.isArray(I.image)?E.mipmaps.length:1}function R(I){const E=I.target;E.removeEventListener("dispose",R),T(E),E.isVideoTexture&&h.delete(E)}function A(I){const E=I.target;E.removeEventListener("dispose",A),b(E)}function T(I){const E=n.get(I);if(E.__webglInit===void 0)return;const X=I.source,J=u.get(X);if(J){const te=J[E.__cacheKey];te.usedTimes--,te.usedTimes===0&&C(I),Object.keys(J).length===0&&u.delete(X)}n.remove(I)}function C(I){const E=n.get(I);i.deleteTexture(E.__webglTexture);const X=I.source,J=u.get(X);delete J[E.__cacheKey],o.memory.textures--}function b(I){const E=n.get(I);if(I.depthTexture&&I.depthTexture.dispose(),I.isWebGLCubeRenderTarget)for(let J=0;J<6;J++){if(Array.isArray(E.__webglFramebuffer[J]))for(let te=0;te<E.__webglFramebuffer[J].length;te++)i.deleteFramebuffer(E.__webglFramebuffer[J][te]);else i.deleteFramebuffer(E.__webglFramebuffer[J]);E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer[J])}else{if(Array.isArray(E.__webglFramebuffer))for(let J=0;J<E.__webglFramebuffer.length;J++)i.deleteFramebuffer(E.__webglFramebuffer[J]);else i.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&i.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&i.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let J=0;J<E.__webglColorRenderbuffer.length;J++)E.__webglColorRenderbuffer[J]&&i.deleteRenderbuffer(E.__webglColorRenderbuffer[J]);E.__webglDepthRenderbuffer&&i.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const X=I.textures;for(let J=0,te=X.length;J<te;J++){const ne=n.get(X[J]);ne.__webglTexture&&(i.deleteTexture(ne.__webglTexture),o.memory.textures--),n.remove(X[J])}n.remove(I)}let y=0;function P(){y=0}function N(){const I=y;return I>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+I+" texture units while this GPU supports only "+s.maxTextures),y+=1,I}function U(I){const E=[];return E.push(I.wrapS),E.push(I.wrapT),E.push(I.wrapR||0),E.push(I.magFilter),E.push(I.minFilter),E.push(I.anisotropy),E.push(I.internalFormat),E.push(I.format),E.push(I.type),E.push(I.generateMipmaps),E.push(I.premultiplyAlpha),E.push(I.flipY),E.push(I.unpackAlignment),E.push(I.colorSpace),E.join()}function G(I,E){const X=n.get(I);if(I.isVideoTexture&&Ge(I),I.isRenderTargetTexture===!1&&I.version>0&&X.__version!==I.version){const J=I.image;if(J===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(J.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Le(X,I,E);return}}t.bindTexture(i.TEXTURE_2D,X.__webglTexture,i.TEXTURE0+E)}function Z(I,E){const X=n.get(I);if(I.version>0&&X.__version!==I.version){Le(X,I,E);return}t.bindTexture(i.TEXTURE_2D_ARRAY,X.__webglTexture,i.TEXTURE0+E)}function F(I,E){const X=n.get(I);if(I.version>0&&X.__version!==I.version){Le(X,I,E);return}t.bindTexture(i.TEXTURE_3D,X.__webglTexture,i.TEXTURE0+E)}function j(I,E){const X=n.get(I);if(I.version>0&&X.__version!==I.version){$(X,I,E);return}t.bindTexture(i.TEXTURE_CUBE_MAP,X.__webglTexture,i.TEXTURE0+E)}const k={[fr]:i.REPEAT,[ii]:i.CLAMP_TO_EDGE,[Wo]:i.MIRRORED_REPEAT},ie={[Wt]:i.NEAREST,[nu]:i.NEAREST_MIPMAP_NEAREST,[Rs]:i.NEAREST_MIPMAP_LINEAR,[Kt]:i.LINEAR,[Zr]:i.LINEAR_MIPMAP_NEAREST,[si]:i.LINEAR_MIPMAP_LINEAR},se={[gu]:i.NEVER,[yu]:i.ALWAYS,[_u]:i.LESS,[$l]:i.LEQUAL,[vu]:i.EQUAL,[Mu]:i.GEQUAL,[xu]:i.GREATER,[Su]:i.NOTEQUAL};function he(I,E){if(E.type===Un&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===Kt||E.magFilter===Zr||E.magFilter===Rs||E.magFilter===si||E.minFilter===Kt||E.minFilter===Zr||E.minFilter===Rs||E.minFilter===si)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(I,i.TEXTURE_WRAP_S,k[E.wrapS]),i.texParameteri(I,i.TEXTURE_WRAP_T,k[E.wrapT]),(I===i.TEXTURE_3D||I===i.TEXTURE_2D_ARRAY)&&i.texParameteri(I,i.TEXTURE_WRAP_R,k[E.wrapR]),i.texParameteri(I,i.TEXTURE_MAG_FILTER,ie[E.magFilter]),i.texParameteri(I,i.TEXTURE_MIN_FILTER,ie[E.minFilter]),E.compareFunction&&(i.texParameteri(I,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(I,i.TEXTURE_COMPARE_FUNC,se[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Wt||E.minFilter!==Rs&&E.minFilter!==si||E.type===Un&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||n.get(E).__currentAnisotropy){const X=e.get("EXT_texture_filter_anisotropic");i.texParameterf(I,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,s.getMaxAnisotropy())),n.get(E).__currentAnisotropy=E.anisotropy}}}function we(I,E){let X=!1;I.__webglInit===void 0&&(I.__webglInit=!0,E.addEventListener("dispose",R));const J=E.source;let te=u.get(J);te===void 0&&(te={},u.set(J,te));const ne=U(E);if(ne!==I.__cacheKey){te[ne]===void 0&&(te[ne]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,X=!0),te[ne].usedTimes++;const xe=te[I.__cacheKey];xe!==void 0&&(te[I.__cacheKey].usedTimes--,xe.usedTimes===0&&C(E)),I.__cacheKey=ne,I.__webglTexture=te[ne].texture}return X}function Le(I,E,X){let J=i.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(J=i.TEXTURE_2D_ARRAY),E.isData3DTexture&&(J=i.TEXTURE_3D);const te=we(I,E),ne=E.source;t.bindTexture(J,I.__webglTexture,i.TEXTURE0+X);const xe=n.get(ne);if(ne.version!==xe.__version||te===!0){t.activeTexture(i.TEXTURE0+X);const ce=et.getPrimaries(et.workingColorSpace),ae=E.colorSpace===Dn?null:et.getPrimaries(E.colorSpace),Ne=E.colorSpace===Dn||ce===ae?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ne);let re=_(E.image,!1,s.maxTextureSize);re=De(E,re);const ge=r.convert(E.format,E.colorSpace),Ve=r.convert(E.type);let Ae=x(E.internalFormat,ge,Ve,E.colorSpace,E.isVideoTexture);he(J,E);let ue;const Ue=E.mipmaps,Oe=E.isVideoTexture!==!0,ct=xe.__version===void 0||te===!0,M=ne.dataReady,Y=S(E,re);if(E.isDepthTexture)Ae=v(E.format===qi,E.type),ct&&(Oe?t.texStorage2D(i.TEXTURE_2D,1,Ae,re.width,re.height):t.texImage2D(i.TEXTURE_2D,0,Ae,re.width,re.height,0,ge,Ve,null));else if(E.isDataTexture)if(Ue.length>0){Oe&&ct&&t.texStorage2D(i.TEXTURE_2D,Y,Ae,Ue[0].width,Ue[0].height);for(let z=0,q=Ue.length;z<q;z++)ue=Ue[z],Oe?M&&t.texSubImage2D(i.TEXTURE_2D,z,0,0,ue.width,ue.height,ge,Ve,ue.data):t.texImage2D(i.TEXTURE_2D,z,Ae,ue.width,ue.height,0,ge,Ve,ue.data);E.generateMipmaps=!1}else Oe?(ct&&t.texStorage2D(i.TEXTURE_2D,Y,Ae,re.width,re.height),M&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,re.width,re.height,ge,Ve,re.data)):t.texImage2D(i.TEXTURE_2D,0,Ae,re.width,re.height,0,ge,Ve,re.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Oe&&ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Y,Ae,Ue[0].width,Ue[0].height,re.depth);for(let z=0,q=Ue.length;z<q;z++)if(ue=Ue[z],E.format!==sn)if(ge!==null)if(Oe){if(M)if(E.layerUpdates.size>0){for(const Q of E.layerUpdates){const Se=ue.width*ue.height;t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,z,0,0,Q,ue.width,ue.height,1,ge,ue.data.slice(Se*Q,Se*(Q+1)),0,0)}E.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,z,0,0,0,ue.width,ue.height,re.depth,ge,ue.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,z,Ae,ue.width,ue.height,re.depth,0,ue.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Oe?M&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,z,0,0,0,ue.width,ue.height,re.depth,ge,Ve,ue.data):t.texImage3D(i.TEXTURE_2D_ARRAY,z,Ae,ue.width,ue.height,re.depth,0,ge,Ve,ue.data)}else{Oe&&ct&&t.texStorage2D(i.TEXTURE_2D,Y,Ae,Ue[0].width,Ue[0].height);for(let z=0,q=Ue.length;z<q;z++)ue=Ue[z],E.format!==sn?ge!==null?Oe?M&&t.compressedTexSubImage2D(i.TEXTURE_2D,z,0,0,ue.width,ue.height,ge,ue.data):t.compressedTexImage2D(i.TEXTURE_2D,z,Ae,ue.width,ue.height,0,ue.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Oe?M&&t.texSubImage2D(i.TEXTURE_2D,z,0,0,ue.width,ue.height,ge,Ve,ue.data):t.texImage2D(i.TEXTURE_2D,z,Ae,ue.width,ue.height,0,ge,Ve,ue.data)}else if(E.isDataArrayTexture)if(Oe){if(ct&&t.texStorage3D(i.TEXTURE_2D_ARRAY,Y,Ae,re.width,re.height,re.depth),M)if(E.layerUpdates.size>0){let z;switch(Ve){case i.UNSIGNED_BYTE:switch(ge){case i.ALPHA:z=1;break;case i.LUMINANCE:z=1;break;case i.LUMINANCE_ALPHA:z=2;break;case i.RGB:z=3;break;case i.RGBA:z=4;break;default:throw new Error(`Unknown texel size for format ${ge}.`)}break;case i.UNSIGNED_SHORT_4_4_4_4:case i.UNSIGNED_SHORT_5_5_5_1:case i.UNSIGNED_SHORT_5_6_5:z=1;break;default:throw new Error(`Unknown texel size for type ${Ve}.`)}const q=re.width*re.height*z;for(const Q of E.layerUpdates)t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Q,re.width,re.height,1,ge,Ve,re.data.slice(q*Q,q*(Q+1)));E.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,re.width,re.height,re.depth,ge,Ve,re.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ae,re.width,re.height,re.depth,0,ge,Ve,re.data);else if(E.isData3DTexture)Oe?(ct&&t.texStorage3D(i.TEXTURE_3D,Y,Ae,re.width,re.height,re.depth),M&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,re.width,re.height,re.depth,ge,Ve,re.data)):t.texImage3D(i.TEXTURE_3D,0,Ae,re.width,re.height,re.depth,0,ge,Ve,re.data);else if(E.isFramebufferTexture){if(ct)if(Oe)t.texStorage2D(i.TEXTURE_2D,Y,Ae,re.width,re.height);else{let z=re.width,q=re.height;for(let Q=0;Q<Y;Q++)t.texImage2D(i.TEXTURE_2D,Q,Ae,z,q,0,ge,Ve,null),z>>=1,q>>=1}}else if(Ue.length>0){if(Oe&&ct){const z=ot(Ue[0]);t.texStorage2D(i.TEXTURE_2D,Y,Ae,z.width,z.height)}for(let z=0,q=Ue.length;z<q;z++)ue=Ue[z],Oe?M&&t.texSubImage2D(i.TEXTURE_2D,z,0,0,ge,Ve,ue):t.texImage2D(i.TEXTURE_2D,z,Ae,ge,Ve,ue);E.generateMipmaps=!1}else if(Oe){if(ct){const z=ot(re);t.texStorage2D(i.TEXTURE_2D,Y,Ae,z.width,z.height)}M&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ge,Ve,re)}else t.texImage2D(i.TEXTURE_2D,0,Ae,ge,Ve,re);f(E)&&p(J),xe.__version=ne.version,E.onUpdate&&E.onUpdate(E)}I.__version=E.version}function $(I,E,X){if(E.image.length!==6)return;const J=we(I,E),te=E.source;t.bindTexture(i.TEXTURE_CUBE_MAP,I.__webglTexture,i.TEXTURE0+X);const ne=n.get(te);if(te.version!==ne.__version||J===!0){t.activeTexture(i.TEXTURE0+X);const xe=et.getPrimaries(et.workingColorSpace),ce=E.colorSpace===Dn?null:et.getPrimaries(E.colorSpace),ae=E.colorSpace===Dn||xe===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,E.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,E.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ae);const Ne=E.isCompressedTexture||E.image[0].isCompressedTexture,re=E.image[0]&&E.image[0].isDataTexture,ge=[];for(let q=0;q<6;q++)!Ne&&!re?ge[q]=_(E.image[q],!0,s.maxCubemapSize):ge[q]=re?E.image[q].image:E.image[q],ge[q]=De(E,ge[q]);const Ve=ge[0],Ae=r.convert(E.format,E.colorSpace),ue=r.convert(E.type),Ue=x(E.internalFormat,Ae,ue,E.colorSpace),Oe=E.isVideoTexture!==!0,ct=ne.__version===void 0||J===!0,M=te.dataReady;let Y=S(E,Ve);he(i.TEXTURE_CUBE_MAP,E);let z;if(Ne){Oe&&ct&&t.texStorage2D(i.TEXTURE_CUBE_MAP,Y,Ue,Ve.width,Ve.height);for(let q=0;q<6;q++){z=ge[q].mipmaps;for(let Q=0;Q<z.length;Q++){const Se=z[Q];E.format!==sn?Ae!==null?Oe?M&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Q,0,0,Se.width,Se.height,Ae,Se.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Q,Ue,Se.width,Se.height,0,Se.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Oe?M&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Q,0,0,Se.width,Se.height,Ae,ue,Se.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Q,Ue,Se.width,Se.height,0,Ae,ue,Se.data)}}}else{if(z=E.mipmaps,Oe&&ct){z.length>0&&Y++;const q=ot(ge[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,Y,Ue,q.width,q.height)}for(let q=0;q<6;q++)if(re){Oe?M&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,ge[q].width,ge[q].height,Ae,ue,ge[q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Ue,ge[q].width,ge[q].height,0,Ae,ue,ge[q].data);for(let Q=0;Q<z.length;Q++){const Pe=z[Q].image[q].image;Oe?M&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Q+1,0,0,Pe.width,Pe.height,Ae,ue,Pe.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Q+1,Ue,Pe.width,Pe.height,0,Ae,ue,Pe.data)}}else{Oe?M&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,Ae,ue,ge[q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,Ue,Ae,ue,ge[q]);for(let Q=0;Q<z.length;Q++){const Se=z[Q];Oe?M&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Q+1,0,0,Ae,ue,Se.image[q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,Q+1,Ue,Ae,ue,Se.image[q])}}}f(E)&&p(i.TEXTURE_CUBE_MAP),ne.__version=te.version,E.onUpdate&&E.onUpdate(E)}I.__version=E.version}function ee(I,E,X,J,te,ne){const xe=r.convert(X.format,X.colorSpace),ce=r.convert(X.type),ae=x(X.internalFormat,xe,ce,X.colorSpace);if(!n.get(E).__hasExternalTextures){const re=Math.max(1,E.width>>ne),ge=Math.max(1,E.height>>ne);te===i.TEXTURE_3D||te===i.TEXTURE_2D_ARRAY?t.texImage3D(te,ne,ae,re,ge,E.depth,0,xe,ce,null):t.texImage2D(te,ne,ae,re,ge,0,xe,ce,null)}t.bindFramebuffer(i.FRAMEBUFFER,I),qe(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,J,te,n.get(X).__webglTexture,0,ye(E)):(te===i.TEXTURE_2D||te>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,J,te,n.get(X).__webglTexture,ne),t.bindFramebuffer(i.FRAMEBUFFER,null)}function fe(I,E,X){if(i.bindRenderbuffer(i.RENDERBUFFER,I),E.depthBuffer){const J=E.depthTexture,te=J&&J.isDepthTexture?J.type:null,ne=v(E.stencilBuffer,te),xe=E.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ce=ye(E);qe(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ce,ne,E.width,E.height):X?i.renderbufferStorageMultisample(i.RENDERBUFFER,ce,ne,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,ne,E.width,E.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,xe,i.RENDERBUFFER,I)}else{const J=E.textures;for(let te=0;te<J.length;te++){const ne=J[te],xe=r.convert(ne.format,ne.colorSpace),ce=r.convert(ne.type),ae=x(ne.internalFormat,xe,ce,ne.colorSpace),Ne=ye(E);X&&qe(E)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Ne,ae,E.width,E.height):qe(E)?a.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Ne,ae,E.width,E.height):i.renderbufferStorage(i.RENDERBUFFER,ae,E.width,E.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function de(I,E){if(E&&E.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,I),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(E.depthTexture).__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),G(E.depthTexture,0);const J=n.get(E.depthTexture).__webglTexture,te=ye(E);if(E.depthTexture.format===ki)qe(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0,te):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,J,0);else if(E.depthTexture.format===qi)qe(E)?a.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0,te):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,J,0);else throw new Error("Unknown depthTexture format")}function He(I){const E=n.get(I),X=I.isWebGLCubeRenderTarget===!0;if(I.depthTexture&&!E.__autoAllocateDepthBuffer){if(X)throw new Error("target.depthTexture not supported in Cube render targets");de(E.__webglFramebuffer,I)}else if(X){E.__webglDepthbuffer=[];for(let J=0;J<6;J++)t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer[J]),E.__webglDepthbuffer[J]=i.createRenderbuffer(),fe(E.__webglDepthbuffer[J],I,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer=i.createRenderbuffer(),fe(E.__webglDepthbuffer,I,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ie(I,E,X){const J=n.get(I);E!==void 0&&ee(J.__webglFramebuffer,I,I.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),X!==void 0&&He(I)}function Ye(I){const E=I.texture,X=n.get(I),J=n.get(E);I.addEventListener("dispose",A);const te=I.textures,ne=I.isWebGLCubeRenderTarget===!0,xe=te.length>1;if(xe||(J.__webglTexture===void 0&&(J.__webglTexture=i.createTexture()),J.__version=E.version,o.memory.textures++),ne){X.__webglFramebuffer=[];for(let ce=0;ce<6;ce++)if(E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer[ce]=[];for(let ae=0;ae<E.mipmaps.length;ae++)X.__webglFramebuffer[ce][ae]=i.createFramebuffer()}else X.__webglFramebuffer[ce]=i.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){X.__webglFramebuffer=[];for(let ce=0;ce<E.mipmaps.length;ce++)X.__webglFramebuffer[ce]=i.createFramebuffer()}else X.__webglFramebuffer=i.createFramebuffer();if(xe)for(let ce=0,ae=te.length;ce<ae;ce++){const Ne=n.get(te[ce]);Ne.__webglTexture===void 0&&(Ne.__webglTexture=i.createTexture(),o.memory.textures++)}if(I.samples>0&&qe(I)===!1){X.__webglMultisampledFramebuffer=i.createFramebuffer(),X.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let ce=0;ce<te.length;ce++){const ae=te[ce];X.__webglColorRenderbuffer[ce]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,X.__webglColorRenderbuffer[ce]);const Ne=r.convert(ae.format,ae.colorSpace),re=r.convert(ae.type),ge=x(ae.internalFormat,Ne,re,ae.colorSpace,I.isXRRenderTarget===!0),Ve=ye(I);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ve,ge,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,X.__webglColorRenderbuffer[ce])}i.bindRenderbuffer(i.RENDERBUFFER,null),I.depthBuffer&&(X.__webglDepthRenderbuffer=i.createRenderbuffer(),fe(X.__webglDepthRenderbuffer,I,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(ne){t.bindTexture(i.TEXTURE_CUBE_MAP,J.__webglTexture),he(i.TEXTURE_CUBE_MAP,E);for(let ce=0;ce<6;ce++)if(E.mipmaps&&E.mipmaps.length>0)for(let ae=0;ae<E.mipmaps.length;ae++)ee(X.__webglFramebuffer[ce][ae],I,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,ae);else ee(X.__webglFramebuffer[ce],I,E,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ce,0);f(E)&&p(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(xe){for(let ce=0,ae=te.length;ce<ae;ce++){const Ne=te[ce],re=n.get(Ne);t.bindTexture(i.TEXTURE_2D,re.__webglTexture),he(i.TEXTURE_2D,Ne),ee(X.__webglFramebuffer,I,Ne,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,0),f(Ne)&&p(i.TEXTURE_2D)}t.unbindTexture()}else{let ce=i.TEXTURE_2D;if((I.isWebGL3DRenderTarget||I.isWebGLArrayRenderTarget)&&(ce=I.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ce,J.__webglTexture),he(ce,E),E.mipmaps&&E.mipmaps.length>0)for(let ae=0;ae<E.mipmaps.length;ae++)ee(X.__webglFramebuffer[ae],I,E,i.COLOR_ATTACHMENT0,ce,ae);else ee(X.__webglFramebuffer,I,E,i.COLOR_ATTACHMENT0,ce,0);f(E)&&p(ce),t.unbindTexture()}I.depthBuffer&&He(I)}function D(I){const E=I.textures;for(let X=0,J=E.length;X<J;X++){const te=E[X];if(f(te)){const ne=I.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,xe=n.get(te).__webglTexture;t.bindTexture(ne,xe),p(ne),t.unbindTexture()}}}const Ze=[],We=[];function nt(I){if(I.samples>0){if(qe(I)===!1){const E=I.textures,X=I.width,J=I.height;let te=i.COLOR_BUFFER_BIT;const ne=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,xe=n.get(I),ce=E.length>1;if(ce)for(let ae=0;ae<E.length;ae++)t.bindFramebuffer(i.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,xe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,xe.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,xe.__webglFramebuffer);for(let ae=0;ae<E.length;ae++){if(I.resolveDepthBuffer&&(I.depthBuffer&&(te|=i.DEPTH_BUFFER_BIT),I.stencilBuffer&&I.resolveStencilBuffer&&(te|=i.STENCIL_BUFFER_BIT)),ce){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,xe.__webglColorRenderbuffer[ae]);const Ne=n.get(E[ae]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Ne,0)}i.blitFramebuffer(0,0,X,J,0,0,X,J,te,i.NEAREST),c===!0&&(Ze.length=0,We.length=0,Ze.push(i.COLOR_ATTACHMENT0+ae),I.depthBuffer&&I.resolveDepthBuffer===!1&&(Ze.push(ne),We.push(ne),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,We)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,Ze))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ce)for(let ae=0;ae<E.length;ae++){t.bindFramebuffer(i.FRAMEBUFFER,xe.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.RENDERBUFFER,xe.__webglColorRenderbuffer[ae]);const Ne=n.get(E[ae]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,xe.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ae,i.TEXTURE_2D,Ne,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,xe.__webglMultisampledFramebuffer)}else if(I.depthBuffer&&I.resolveDepthBuffer===!1&&c){const E=I.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[E])}}}function ye(I){return Math.min(s.maxSamples,I.samples)}function qe(I){const E=n.get(I);return I.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function Ge(I){const E=o.render.frame;h.get(I)!==E&&(h.set(I,E),I.update())}function De(I,E){const X=I.colorSpace,J=I.format,te=I.type;return I.isCompressedTexture===!0||I.isVideoTexture===!0||X!==Vn&&X!==Dn&&(et.getTransfer(X)===st?(J!==sn||te!==Hn)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",X)),E}function ot(I){return typeof HTMLImageElement<"u"&&I instanceof HTMLImageElement?(l.width=I.naturalWidth||I.width,l.height=I.naturalHeight||I.height):typeof VideoFrame<"u"&&I instanceof VideoFrame?(l.width=I.displayWidth,l.height=I.displayHeight):(l.width=I.width,l.height=I.height),l}this.allocateTextureUnit=N,this.resetTextureUnits=P,this.setTexture2D=G,this.setTexture2DArray=Z,this.setTexture3D=F,this.setTextureCube=j,this.rebindTextures=Ie,this.setupRenderTarget=Ye,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=nt,this.setupDepthRenderbuffer=He,this.setupFrameBufferTexture=ee,this.useMultisampledRTT=qe}function B0(i,e){function t(n,s=Dn){let r;const o=et.getTransfer(s);if(n===Hn)return i.UNSIGNED_BYTE;if(n===Wl)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Xl)return i.UNSIGNED_SHORT_5_5_5_1;if(n===ru)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===iu)return i.BYTE;if(n===su)return i.SHORT;if(n===mr)return i.UNSIGNED_SHORT;if(n===Vl)return i.INT;if(n===Yi)return i.UNSIGNED_INT;if(n===Un)return i.FLOAT;if(n===Ir)return i.HALF_FLOAT;if(n===ou)return i.ALPHA;if(n===au)return i.RGB;if(n===sn)return i.RGBA;if(n===cu)return i.LUMINANCE;if(n===lu)return i.LUMINANCE_ALPHA;if(n===ki)return i.DEPTH_COMPONENT;if(n===qi)return i.DEPTH_STENCIL;if(n===hu)return i.RED;if(n===Yl)return i.RED_INTEGER;if(n===du)return i.RG;if(n===Zl)return i.RG_INTEGER;if(n===ql)return i.RGBA_INTEGER;if(n===qr||n===jr||n===$r||n===Kr)if(o===st)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===qr)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===jr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===$r)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Kr)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===qr)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===jr)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===$r)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Kr)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Ta||n===wa||n===Ra||n===Ca)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Ta)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===wa)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Ra)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Ca)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Pa||n===La||n===Ia)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Pa||n===La)return o===st?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ia)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Da||n===Na||n===Ua||n===Oa||n===Fa||n===Ba||n===za||n===ka||n===Ha||n===Ga||n===Va||n===Wa||n===Xa||n===Ya)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Da)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Na)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ua)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Oa)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Fa)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ba)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===za)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ka)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ha)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ga)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Va)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Wa)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Xa)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Ya)return o===st?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Jr||n===Za||n===qa)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Jr)return o===st?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Za)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===qa)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===uu||n===ja||n===$a||n===Ka)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===Jr)return r.COMPRESSED_RED_RGTC1_EXT;if(n===ja)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===$a)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ka)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Zi?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}class z0 extends Bt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class zt extends bt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const k0={type:"move"};class Eo{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new zt,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new zt,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new zt,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let s=null,r=null,o=null;const a=this._targetRay,c=this._grip,l=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(l&&e.hand){o=!0;for(const _ of e.hand.values()){const f=t.getJointPose(_,n),p=this._getHandJoint(l,_);f!==null&&(p.matrix.fromArray(f.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=f.radius),p.visible=f!==null}const h=l.joints["index-finger-tip"],d=l.joints["thumb-tip"],u=h.position.distanceTo(d.position),m=.02,g=.005;l.inputState.pinching&&u>m+g?(l.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!l.inputState.pinching&&u<=m-g&&(l.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));a!==null&&(s=t.getPose(e.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(a.matrix.fromArray(s.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,s.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(s.linearVelocity)):a.hasLinearVelocity=!1,s.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(s.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(k0)))}return a!==null&&(a.visible=s!==null),c!==null&&(c.visible=r!==null),l!==null&&(l.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new zt;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}const H0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,G0=`
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

}`;class V0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,n){if(this.texture===null){const s=new At,r=e.properties.get(s);r.__webglTexture=t.texture,(t.depthNear!=n.depthNear||t.depthFar!=n.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=s}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Gn({vertexShader:H0,fragmentShader:G0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Be(new Or(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}}class W0 extends hi{constructor(e,t){super();const n=this;let s=null,r=1,o=null,a="local-floor",c=1,l=null,h=null,d=null,u=null,m=null,g=null;const _=new V0,f=t.getContextAttributes();let p=null,x=null;const v=[],S=[],R=new K;let A=null;const T=new Bt;T.layers.enable(1),T.viewport=new rt;const C=new Bt;C.layers.enable(2),C.viewport=new rt;const b=[T,C],y=new z0;y.layers.enable(1),y.layers.enable(2);let P=null,N=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let ee=v[$];return ee===void 0&&(ee=new Eo,v[$]=ee),ee.getTargetRaySpace()},this.getControllerGrip=function($){let ee=v[$];return ee===void 0&&(ee=new Eo,v[$]=ee),ee.getGripSpace()},this.getHand=function($){let ee=v[$];return ee===void 0&&(ee=new Eo,v[$]=ee),ee.getHandSpace()};function U($){const ee=S.indexOf($.inputSource);if(ee===-1)return;const fe=v[ee];fe!==void 0&&(fe.update($.inputSource,$.frame,l||o),fe.dispatchEvent({type:$.type,data:$.inputSource}))}function G(){s.removeEventListener("select",U),s.removeEventListener("selectstart",U),s.removeEventListener("selectend",U),s.removeEventListener("squeeze",U),s.removeEventListener("squeezestart",U),s.removeEventListener("squeezeend",U),s.removeEventListener("end",G),s.removeEventListener("inputsourceschange",Z);for(let $=0;$<v.length;$++){const ee=S[$];ee!==null&&(S[$]=null,v[$].disconnect(ee))}P=null,N=null,_.reset(),e.setRenderTarget(p),m=null,u=null,d=null,s=null,x=null,Le.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){r=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){a=$,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return l||o},this.setReferenceSpace=function($){l=$},this.getBaseLayer=function(){return u!==null?u:m},this.getBinding=function(){return d},this.getFrame=function(){return g},this.getSession=function(){return s},this.setSession=async function($){if(s=$,s!==null){if(p=e.getRenderTarget(),s.addEventListener("select",U),s.addEventListener("selectstart",U),s.addEventListener("selectend",U),s.addEventListener("squeeze",U),s.addEventListener("squeezestart",U),s.addEventListener("squeezeend",U),s.addEventListener("end",G),s.addEventListener("inputsourceschange",Z),f.xrCompatible!==!0&&await t.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(R),s.renderState.layers===void 0){const ee={antialias:f.antialias,alpha:!0,depth:f.depth,stencil:f.stencil,framebufferScaleFactor:r};m=new XRWebGLLayer(s,t,ee),s.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),x=new ci(m.framebufferWidth,m.framebufferHeight,{format:sn,type:Hn,colorSpace:e.outputColorSpace,stencilBuffer:f.stencil})}else{let ee=null,fe=null,de=null;f.depth&&(de=f.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ee=f.stencil?qi:ki,fe=f.stencil?Zi:Yi);const He={colorFormat:t.RGBA8,depthFormat:de,scaleFactor:r};d=new XRWebGLBinding(s,t),u=d.createProjectionLayer(He),s.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),x=new ci(u.textureWidth,u.textureHeight,{format:sn,type:Hn,depthTexture:new ch(u.textureWidth,u.textureHeight,fe,void 0,void 0,void 0,void 0,void 0,void 0,ee),stencilBuffer:f.stencil,colorSpace:e.outputColorSpace,samples:f.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1})}x.isXRRenderTarget=!0,this.setFoveation(c),l=null,o=await s.requestReferenceSpace(a),Le.setContext(s),Le.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function Z($){for(let ee=0;ee<$.removed.length;ee++){const fe=$.removed[ee],de=S.indexOf(fe);de>=0&&(S[de]=null,v[de].disconnect(fe))}for(let ee=0;ee<$.added.length;ee++){const fe=$.added[ee];let de=S.indexOf(fe);if(de===-1){for(let Ie=0;Ie<v.length;Ie++)if(Ie>=S.length){S.push(fe),de=Ie;break}else if(S[Ie]===null){S[Ie]=fe,de=Ie;break}if(de===-1)break}const He=v[de];He&&He.connect(fe)}}const F=new L,j=new L;function k($,ee,fe){F.setFromMatrixPosition(ee.matrixWorld),j.setFromMatrixPosition(fe.matrixWorld);const de=F.distanceTo(j),He=ee.projectionMatrix.elements,Ie=fe.projectionMatrix.elements,Ye=He[14]/(He[10]-1),D=He[14]/(He[10]+1),Ze=(He[9]+1)/He[5],We=(He[9]-1)/He[5],nt=(He[8]-1)/He[0],ye=(Ie[8]+1)/Ie[0],qe=Ye*nt,Ge=Ye*ye,De=de/(-nt+ye),ot=De*-nt;ee.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(ot),$.translateZ(De),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert();const I=Ye+De,E=D+De,X=qe-ot,J=Ge+(de-ot),te=Ze*D/E*I,ne=We*D/E*I;$.projectionMatrix.makePerspective(X,J,te,ne,I,E),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}function ie($,ee){ee===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(ee.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(s===null)return;_.texture!==null&&($.near=_.depthNear,$.far=_.depthFar),y.near=C.near=T.near=$.near,y.far=C.far=T.far=$.far,(P!==y.near||N!==y.far)&&(s.updateRenderState({depthNear:y.near,depthFar:y.far}),P=y.near,N=y.far,T.near=P,T.far=N,C.near=P,C.far=N,T.updateProjectionMatrix(),C.updateProjectionMatrix(),$.updateProjectionMatrix());const ee=$.parent,fe=y.cameras;ie(y,ee);for(let de=0;de<fe.length;de++)ie(fe[de],ee);fe.length===2?k(y,T,C):y.projectionMatrix.copy(T.projectionMatrix),se($,y,ee)};function se($,ee,fe){fe===null?$.matrix.copy(ee.matrixWorld):($.matrix.copy(fe.matrixWorld),$.matrix.invert(),$.matrix.multiply(ee.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(ee.projectionMatrix),$.projectionMatrixInverse.copy(ee.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ps*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return y},this.getFoveation=function(){if(!(u===null&&m===null))return c},this.setFoveation=function($){c=$,u!==null&&(u.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(y)};let he=null;function we($,ee){if(h=ee.getViewerPose(l||o),g=ee,h!==null){const fe=h.views;m!==null&&(e.setRenderTargetFramebuffer(x,m.framebuffer),e.setRenderTarget(x));let de=!1;fe.length!==y.cameras.length&&(y.cameras.length=0,de=!0);for(let Ie=0;Ie<fe.length;Ie++){const Ye=fe[Ie];let D=null;if(m!==null)D=m.getViewport(Ye);else{const We=d.getViewSubImage(u,Ye);D=We.viewport,Ie===0&&(e.setRenderTargetTextures(x,We.colorTexture,u.ignoreDepthValues?void 0:We.depthStencilTexture),e.setRenderTarget(x))}let Ze=b[Ie];Ze===void 0&&(Ze=new Bt,Ze.layers.enable(Ie),Ze.viewport=new rt,b[Ie]=Ze),Ze.matrix.fromArray(Ye.transform.matrix),Ze.matrix.decompose(Ze.position,Ze.quaternion,Ze.scale),Ze.projectionMatrix.fromArray(Ye.projectionMatrix),Ze.projectionMatrixInverse.copy(Ze.projectionMatrix).invert(),Ze.viewport.set(D.x,D.y,D.width,D.height),Ie===0&&(y.matrix.copy(Ze.matrix),y.matrix.decompose(y.position,y.quaternion,y.scale)),de===!0&&y.cameras.push(Ze)}const He=s.enabledFeatures;if(He&&He.includes("depth-sensing")){const Ie=d.getDepthInformation(fe[0]);Ie&&Ie.isValid&&Ie.texture&&_.init(e,Ie,s.renderState)}}for(let fe=0;fe<v.length;fe++){const de=S[fe],He=v[fe];de!==null&&He!==void 0&&He.update(de,ee,l||o)}he&&he($,ee),ee.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ee}),g=null}const Le=new oh;Le.setAnimationLoop(we),this.setAnimationLoop=function($){he=$},this.dispose=function(){}}}const Jn=new en,X0=new it;function Y0(i,e){function t(f,p){f.matrixAutoUpdate===!0&&f.updateMatrix(),p.value.copy(f.matrix)}function n(f,p){p.color.getRGB(f.fogColor.value,ih(i)),p.isFog?(f.fogNear.value=p.near,f.fogFar.value=p.far):p.isFogExp2&&(f.fogDensity.value=p.density)}function s(f,p,x,v,S){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(f,p):p.isMeshToonMaterial?(r(f,p),d(f,p)):p.isMeshPhongMaterial?(r(f,p),h(f,p)):p.isMeshStandardMaterial?(r(f,p),u(f,p),p.isMeshPhysicalMaterial&&m(f,p,S)):p.isMeshMatcapMaterial?(r(f,p),g(f,p)):p.isMeshDepthMaterial?r(f,p):p.isMeshDistanceMaterial?(r(f,p),_(f,p)):p.isMeshNormalMaterial?r(f,p):p.isLineBasicMaterial?(o(f,p),p.isLineDashedMaterial&&a(f,p)):p.isPointsMaterial?c(f,p,x,v):p.isSpriteMaterial?l(f,p):p.isShadowMaterial?(f.color.value.copy(p.color),f.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(f,p){f.opacity.value=p.opacity,p.color&&f.diffuse.value.copy(p.color),p.emissive&&f.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.bumpMap&&(f.bumpMap.value=p.bumpMap,t(p.bumpMap,f.bumpMapTransform),f.bumpScale.value=p.bumpScale,p.side===Lt&&(f.bumpScale.value*=-1)),p.normalMap&&(f.normalMap.value=p.normalMap,t(p.normalMap,f.normalMapTransform),f.normalScale.value.copy(p.normalScale),p.side===Lt&&f.normalScale.value.negate()),p.displacementMap&&(f.displacementMap.value=p.displacementMap,t(p.displacementMap,f.displacementMapTransform),f.displacementScale.value=p.displacementScale,f.displacementBias.value=p.displacementBias),p.emissiveMap&&(f.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,f.emissiveMapTransform)),p.specularMap&&(f.specularMap.value=p.specularMap,t(p.specularMap,f.specularMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest);const x=e.get(p),v=x.envMap,S=x.envMapRotation;v&&(f.envMap.value=v,Jn.copy(S),Jn.x*=-1,Jn.y*=-1,Jn.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(Jn.y*=-1,Jn.z*=-1),f.envMapRotation.value.setFromMatrix4(X0.makeRotationFromEuler(Jn)),f.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,f.reflectivity.value=p.reflectivity,f.ior.value=p.ior,f.refractionRatio.value=p.refractionRatio),p.lightMap&&(f.lightMap.value=p.lightMap,f.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,f.lightMapTransform)),p.aoMap&&(f.aoMap.value=p.aoMap,f.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,f.aoMapTransform))}function o(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform))}function a(f,p){f.dashSize.value=p.dashSize,f.totalSize.value=p.dashSize+p.gapSize,f.scale.value=p.scale}function c(f,p,x,v){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.size.value=p.size*x,f.scale.value=v*.5,p.map&&(f.map.value=p.map,t(p.map,f.uvTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function l(f,p){f.diffuse.value.copy(p.color),f.opacity.value=p.opacity,f.rotation.value=p.rotation,p.map&&(f.map.value=p.map,t(p.map,f.mapTransform)),p.alphaMap&&(f.alphaMap.value=p.alphaMap,t(p.alphaMap,f.alphaMapTransform)),p.alphaTest>0&&(f.alphaTest.value=p.alphaTest)}function h(f,p){f.specular.value.copy(p.specular),f.shininess.value=Math.max(p.shininess,1e-4)}function d(f,p){p.gradientMap&&(f.gradientMap.value=p.gradientMap)}function u(f,p){f.metalness.value=p.metalness,p.metalnessMap&&(f.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,f.metalnessMapTransform)),f.roughness.value=p.roughness,p.roughnessMap&&(f.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,f.roughnessMapTransform)),p.envMap&&(f.envMapIntensity.value=p.envMapIntensity)}function m(f,p,x){f.ior.value=p.ior,p.sheen>0&&(f.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),f.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(f.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,f.sheenColorMapTransform)),p.sheenRoughnessMap&&(f.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,f.sheenRoughnessMapTransform))),p.clearcoat>0&&(f.clearcoat.value=p.clearcoat,f.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(f.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,f.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(f.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===Lt&&f.clearcoatNormalScale.value.negate())),p.dispersion>0&&(f.dispersion.value=p.dispersion),p.iridescence>0&&(f.iridescence.value=p.iridescence,f.iridescenceIOR.value=p.iridescenceIOR,f.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],f.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(f.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,f.iridescenceMapTransform)),p.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),p.transmission>0&&(f.transmission.value=p.transmission,f.transmissionSamplerMap.value=x.texture,f.transmissionSamplerSize.value.set(x.width,x.height),p.transmissionMap&&(f.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,f.transmissionMapTransform)),f.thickness.value=p.thickness,p.thicknessMap&&(f.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=p.attenuationDistance,f.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(f.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(f.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=p.specularIntensity,f.specularColor.value.copy(p.specularColor),p.specularColorMap&&(f.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,f.specularColorMapTransform)),p.specularIntensityMap&&(f.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,p){p.matcap&&(f.matcap.value=p.matcap)}function _(f,p){const x=e.get(p).light;f.referencePosition.value.setFromMatrixPosition(x.matrixWorld),f.nearDistance.value=x.shadow.camera.near,f.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Z0(i,e,t,n){let s={},r={},o=[];const a=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function c(x,v){const S=v.program;n.uniformBlockBinding(x,S)}function l(x,v){let S=s[x.id];S===void 0&&(g(x),S=h(x),s[x.id]=S,x.addEventListener("dispose",f));const R=v.program;n.updateUBOMapping(x,R);const A=e.render.frame;r[x.id]!==A&&(u(x),r[x.id]=A)}function h(x){const v=d();x.__bindingPointIndex=v;const S=i.createBuffer(),R=x.__size,A=x.usage;return i.bindBuffer(i.UNIFORM_BUFFER,S),i.bufferData(i.UNIFORM_BUFFER,R,A),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,v,S),S}function d(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(x){const v=s[x.id],S=x.uniforms,R=x.__cache;i.bindBuffer(i.UNIFORM_BUFFER,v);for(let A=0,T=S.length;A<T;A++){const C=Array.isArray(S[A])?S[A]:[S[A]];for(let b=0,y=C.length;b<y;b++){const P=C[b];if(m(P,A,b,R)===!0){const N=P.__offset,U=Array.isArray(P.value)?P.value:[P.value];let G=0;for(let Z=0;Z<U.length;Z++){const F=U[Z],j=_(F);typeof F=="number"||typeof F=="boolean"?(P.__data[0]=F,i.bufferSubData(i.UNIFORM_BUFFER,N+G,P.__data)):F.isMatrix3?(P.__data[0]=F.elements[0],P.__data[1]=F.elements[1],P.__data[2]=F.elements[2],P.__data[3]=0,P.__data[4]=F.elements[3],P.__data[5]=F.elements[4],P.__data[6]=F.elements[5],P.__data[7]=0,P.__data[8]=F.elements[6],P.__data[9]=F.elements[7],P.__data[10]=F.elements[8],P.__data[11]=0):(F.toArray(P.__data,G),G+=j.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,N,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(x,v,S,R){const A=x.value,T=v+"_"+S;if(R[T]===void 0)return typeof A=="number"||typeof A=="boolean"?R[T]=A:R[T]=A.clone(),!0;{const C=R[T];if(typeof A=="number"||typeof A=="boolean"){if(C!==A)return R[T]=A,!0}else if(C.equals(A)===!1)return C.copy(A),!0}return!1}function g(x){const v=x.uniforms;let S=0;const R=16;for(let T=0,C=v.length;T<C;T++){const b=Array.isArray(v[T])?v[T]:[v[T]];for(let y=0,P=b.length;y<P;y++){const N=b[y],U=Array.isArray(N.value)?N.value:[N.value];for(let G=0,Z=U.length;G<Z;G++){const F=U[G],j=_(F),k=S%R;k!==0&&R-k<j.boundary&&(S+=R-k),N.__data=new Float32Array(j.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=S,S+=j.storage}}}const A=S%R;return A>0&&(S+=R-A),x.__size=S,x.__cache={},this}function _(x){const v={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(v.boundary=4,v.storage=4):x.isVector2?(v.boundary=8,v.storage=8):x.isVector3||x.isColor?(v.boundary=16,v.storage=12):x.isVector4?(v.boundary=16,v.storage=16):x.isMatrix3?(v.boundary=48,v.storage=48):x.isMatrix4?(v.boundary=64,v.storage=64):x.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",x),v}function f(x){const v=x.target;v.removeEventListener("dispose",f);const S=o.indexOf(v.__bindingPointIndex);o.splice(S,1),i.deleteBuffer(s[v.id]),delete s[v.id],delete r[v.id]}function p(){for(const x in s)i.deleteBuffer(s[x]);o=[],s={},r={}}return{bind:c,update:l,dispose:p}}class q0{constructor(e={}){const{canvas:t=zu(),context:n=null,depth:s=!0,stencil:r=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:l=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:d=!1}=e;this.isWebGLRenderer=!0;let u;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");u=n.getContextAttributes().alpha}else u=o;const m=new Uint32Array(4),g=new Int32Array(4);let _=null,f=null;const p=[],x=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=tn,this.toneMapping=Fn,this.toneMappingExposure=1;const v=this;let S=!1,R=0,A=0,T=null,C=-1,b=null;const y=new rt,P=new rt;let N=null;const U=new ve(0);let G=0,Z=t.width,F=t.height,j=1,k=null,ie=null;const se=new rt(0,0,Z,F),he=new rt(0,0,Z,F);let we=!1;const Le=new oa;let $=!1,ee=!1;const fe=new it,de=new L,He={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ie=!1;function Ye(){return T===null?j:1}let D=n;function Ze(w,O){return t.getContext(w,O)}try{const w={alpha:!0,depth:s,stencil:r,antialias:a,premultipliedAlpha:c,preserveDrawingBuffer:l,powerPreference:h,failIfMajorPerformanceCaveat:d};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${ta}`),t.addEventListener("webglcontextlost",Y,!1),t.addEventListener("webglcontextrestored",z,!1),t.addEventListener("webglcontextcreationerror",q,!1),D===null){const O="webgl2";if(D=Ze(O,w),D===null)throw Ze(O)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(w){throw console.error("THREE.WebGLRenderer: "+w.message),w}let We,nt,ye,qe,Ge,De,ot,I,E,X,J,te,ne,xe,ce,ae,Ne,re,ge,Ve,Ae,ue,Ue,Oe;function ct(){We=new ng(D),We.init(),ue=new B0(D,We),nt=new $m(D,We,e,ue),ye=new O0(D),qe=new rg(D),Ge=new y0,De=new F0(D,We,ye,Ge,nt,ue,qe),ot=new Jm(v),I=new tg(v),E=new dp(D),Ue=new qm(D,E),X=new ig(D,E,qe,Ue),J=new ag(D,X,E,qe),ge=new og(D,nt,De),ae=new Km(Ge),te=new M0(v,ot,I,We,nt,Ue,ae),ne=new Y0(v,Ge),xe=new E0,ce=new P0(We),re=new Zm(v,ot,I,ye,J,u,c),Ne=new U0(v,J,nt),Oe=new Z0(D,qe,nt,ye),Ve=new jm(D,We,qe),Ae=new sg(D,We,qe),qe.programs=te.programs,v.capabilities=nt,v.extensions=We,v.properties=Ge,v.renderLists=xe,v.shadowMap=Ne,v.state=ye,v.info=qe}ct();const M=new W0(v,D);this.xr=M,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const w=We.get("WEBGL_lose_context");w&&w.loseContext()},this.forceContextRestore=function(){const w=We.get("WEBGL_lose_context");w&&w.restoreContext()},this.getPixelRatio=function(){return j},this.setPixelRatio=function(w){w!==void 0&&(j=w,this.setSize(Z,F,!1))},this.getSize=function(w){return w.set(Z,F)},this.setSize=function(w,O,H=!0){if(M.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=w,F=O,t.width=Math.floor(w*j),t.height=Math.floor(O*j),H===!0&&(t.style.width=w+"px",t.style.height=O+"px"),this.setViewport(0,0,w,O)},this.getDrawingBufferSize=function(w){return w.set(Z*j,F*j).floor()},this.setDrawingBufferSize=function(w,O,H){Z=w,F=O,j=H,t.width=Math.floor(w*H),t.height=Math.floor(O*H),this.setViewport(0,0,w,O)},this.getCurrentViewport=function(w){return w.copy(y)},this.getViewport=function(w){return w.copy(se)},this.setViewport=function(w,O,H,V){w.isVector4?se.set(w.x,w.y,w.z,w.w):se.set(w,O,H,V),ye.viewport(y.copy(se).multiplyScalar(j).round())},this.getScissor=function(w){return w.copy(he)},this.setScissor=function(w,O,H,V){w.isVector4?he.set(w.x,w.y,w.z,w.w):he.set(w,O,H,V),ye.scissor(P.copy(he).multiplyScalar(j).round())},this.getScissorTest=function(){return we},this.setScissorTest=function(w){ye.setScissorTest(we=w)},this.setOpaqueSort=function(w){k=w},this.setTransparentSort=function(w){ie=w},this.getClearColor=function(w){return w.copy(re.getClearColor())},this.setClearColor=function(){re.setClearColor.apply(re,arguments)},this.getClearAlpha=function(){return re.getClearAlpha()},this.setClearAlpha=function(){re.setClearAlpha.apply(re,arguments)},this.clear=function(w=!0,O=!0,H=!0){let V=0;if(w){let B=!1;if(T!==null){const oe=T.texture.format;B=oe===ql||oe===Zl||oe===Yl}if(B){const oe=T.texture.type,pe=oe===Hn||oe===Yi||oe===mr||oe===Zi||oe===Wl||oe===Xl,me=re.getClearColor(),_e=re.getClearAlpha(),Te=me.r,Re=me.g,be=me.b;pe?(m[0]=Te,m[1]=Re,m[2]=be,m[3]=_e,D.clearBufferuiv(D.COLOR,0,m)):(g[0]=Te,g[1]=Re,g[2]=be,g[3]=_e,D.clearBufferiv(D.COLOR,0,g))}else V|=D.COLOR_BUFFER_BIT}O&&(V|=D.DEPTH_BUFFER_BIT),H&&(V|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(V)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",Y,!1),t.removeEventListener("webglcontextrestored",z,!1),t.removeEventListener("webglcontextcreationerror",q,!1),xe.dispose(),ce.dispose(),Ge.dispose(),ot.dispose(),I.dispose(),J.dispose(),Ue.dispose(),Oe.dispose(),te.dispose(),M.dispose(),M.removeEventListener("sessionstart",mt),M.removeEventListener("sessionend",gt),Dt.stop()};function Y(w){w.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),S=!0}function z(){console.log("THREE.WebGLRenderer: Context Restored."),S=!1;const w=qe.autoReset,O=Ne.enabled,H=Ne.autoUpdate,V=Ne.needsUpdate,B=Ne.type;ct(),qe.autoReset=w,Ne.enabled=O,Ne.autoUpdate=H,Ne.needsUpdate=V,Ne.type=B}function q(w){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",w.statusMessage)}function Q(w){const O=w.target;O.removeEventListener("dispose",Q),Se(O)}function Se(w){Pe(w),Ge.remove(w)}function Pe(w){const O=Ge.get(w).programs;O!==void 0&&(O.forEach(function(H){te.releaseProgram(H)}),w.isShaderMaterial&&te.releaseShaderCache(w))}this.renderBufferDirect=function(w,O,H,V,B,oe){O===null&&(O=He);const pe=B.isMesh&&B.matrixWorld.determinant()<0,me=ud(w,O,H,V,B);ye.setMaterial(V,pe);let _e=H.index,Te=1;if(V.wireframe===!0){if(_e=X.getWireframeAttribute(H),_e===void 0)return;Te=2}const Re=H.drawRange,be=H.attributes.position;let Ke=Re.start*Te,ht=(Re.start+Re.count)*Te;oe!==null&&(Ke=Math.max(Ke,oe.start*Te),ht=Math.min(ht,(oe.start+oe.count)*Te)),_e!==null?(Ke=Math.max(Ke,0),ht=Math.min(ht,_e.count)):be!=null&&(Ke=Math.max(Ke,0),ht=Math.min(ht,be.count));const dt=ht-Ke;if(dt<0||dt===1/0)return;Ue.setup(B,V,me,H,_e);let Ut,Je=Ve;if(_e!==null&&(Ut=E.get(_e),Je=Ae,Je.setIndex(Ut)),B.isMesh)V.wireframe===!0?(ye.setLineWidth(V.wireframeLinewidth*Ye()),Je.setMode(D.LINES)):Je.setMode(D.TRIANGLES);else if(B.isLine){let Me=V.linewidth;Me===void 0&&(Me=1),ye.setLineWidth(Me*Ye()),B.isLineSegments?Je.setMode(D.LINES):B.isLineLoop?Je.setMode(D.LINE_LOOP):Je.setMode(D.LINE_STRIP)}else B.isPoints?Je.setMode(D.POINTS):B.isSprite&&Je.setMode(D.TRIANGLES);if(B.isBatchedMesh)B._multiDrawInstances!==null?Je.renderMultiDrawInstances(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount,B._multiDrawInstances):Je.renderMultiDraw(B._multiDrawStarts,B._multiDrawCounts,B._multiDrawCount);else if(B.isInstancedMesh)Je.renderInstances(Ke,dt,B.count);else if(H.isInstancedBufferGeometry){const Me=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,Rt=Math.min(H.instanceCount,Me);Je.renderInstances(Ke,dt,Rt)}else Je.render(Ke,dt)};function lt(w,O,H){w.transparent===!0&&w.side===Et&&w.forceSinglePass===!1?(w.side=Lt,w.needsUpdate=!0,Ts(w,O,H),w.side=kn,w.needsUpdate=!0,Ts(w,O,H),w.side=Et):Ts(w,O,H)}this.compile=function(w,O,H=null){H===null&&(H=w),f=ce.get(H),f.init(O),x.push(f),H.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),w!==H&&w.traverseVisible(function(B){B.isLight&&B.layers.test(O.layers)&&(f.pushLight(B),B.castShadow&&f.pushShadow(B))}),f.setupLights();const V=new Set;return w.traverse(function(B){const oe=B.material;if(oe)if(Array.isArray(oe))for(let pe=0;pe<oe.length;pe++){const me=oe[pe];lt(me,H,B),V.add(me)}else lt(oe,H,B),V.add(oe)}),x.pop(),f=null,V},this.compileAsync=function(w,O,H=null){const V=this.compile(w,O,H);return new Promise(B=>{function oe(){if(V.forEach(function(pe){Ge.get(pe).currentProgram.isReady()&&V.delete(pe)}),V.size===0){B(w);return}setTimeout(oe,10)}We.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let ft=null;function $e(w){ft&&ft(w)}function mt(){Dt.stop()}function gt(){Dt.start()}const Dt=new oh;Dt.setAnimationLoop($e),typeof self<"u"&&Dt.setContext(self),this.setAnimationLoop=function(w){ft=w,M.setAnimationLoop(w),w===null?Dt.stop():Dt.start()},M.addEventListener("sessionstart",mt),M.addEventListener("sessionend",gt),this.render=function(w,O){if(O!==void 0&&O.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(S===!0)return;if(w.matrixWorldAutoUpdate===!0&&w.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),M.enabled===!0&&M.isPresenting===!0&&(M.cameraAutoUpdate===!0&&M.updateCamera(O),O=M.getCamera()),w.isScene===!0&&w.onBeforeRender(v,w,O,T),f=ce.get(w,x.length),f.init(O),x.push(f),fe.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),Le.setFromProjectionMatrix(fe),ee=this.localClippingEnabled,$=ae.init(this.clippingPlanes,ee),_=xe.get(w,p.length),_.init(),p.push(_),M.enabled===!0&&M.isPresenting===!0){const oe=v.xr.getDepthSensingMesh();oe!==null&&Nt(oe,O,-1/0,v.sortObjects)}Nt(w,O,0,v.sortObjects),_.finish(),v.sortObjects===!0&&_.sort(k,ie),Ie=M.enabled===!1||M.isPresenting===!1||M.hasDepthSensing()===!1,Ie&&re.addToRenderList(_,w),this.info.render.frame++,$===!0&&ae.beginShadows();const H=f.state.shadowsArray;Ne.render(H,w,O),$===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const V=_.opaque,B=_.transmissive;if(f.setupLights(),O.isArrayCamera){const oe=O.cameras;if(B.length>0)for(let pe=0,me=oe.length;pe<me;pe++){const _e=oe[pe];Wn(V,B,w,_e)}Ie&&re.render(w);for(let pe=0,me=oe.length;pe<me;pe++){const _e=oe[pe];bn(_,w,_e,_e.viewport)}}else B.length>0&&Wn(V,B,w,O),Ie&&re.render(w),bn(_,w,O);T!==null&&(De.updateMultisampleRenderTarget(T),De.updateRenderTargetMipmap(T)),w.isScene===!0&&w.onAfterRender(v,w,O),Ue.resetDefaultState(),C=-1,b=null,x.pop(),x.length>0?(f=x[x.length-1],$===!0&&ae.setGlobalState(v.clippingPlanes,f.state.camera)):f=null,p.pop(),p.length>0?_=p[p.length-1]:_=null};function Nt(w,O,H,V){if(w.visible===!1)return;if(w.layers.test(O.layers)){if(w.isGroup)H=w.renderOrder;else if(w.isLOD)w.autoUpdate===!0&&w.update(O);else if(w.isLight)f.pushLight(w),w.castShadow&&f.pushShadow(w);else if(w.isSprite){if(!w.frustumCulled||Le.intersectsSprite(w)){V&&de.setFromMatrixPosition(w.matrixWorld).applyMatrix4(fe);const pe=J.update(w),me=w.material;me.visible&&_.push(w,pe,me,H,de.z,null)}}else if((w.isMesh||w.isLine||w.isPoints)&&(!w.frustumCulled||Le.intersectsObject(w))){const pe=J.update(w),me=w.material;if(V&&(w.boundingSphere!==void 0?(w.boundingSphere===null&&w.computeBoundingSphere(),de.copy(w.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),de.copy(pe.boundingSphere.center)),de.applyMatrix4(w.matrixWorld).applyMatrix4(fe)),Array.isArray(me)){const _e=pe.groups;for(let Te=0,Re=_e.length;Te<Re;Te++){const be=_e[Te],Ke=me[be.materialIndex];Ke&&Ke.visible&&_.push(w,pe,Ke,H,de.z,be)}}else me.visible&&_.push(w,pe,me,H,de.z,null)}}const oe=w.children;for(let pe=0,me=oe.length;pe<me;pe++)Nt(oe[pe],O,H,V)}function bn(w,O,H,V){const B=w.opaque,oe=w.transmissive,pe=w.transparent;f.setupLightsView(H),$===!0&&ae.setGlobalState(v.clippingPlanes,H),V&&ye.viewport(y.copy(V)),B.length>0&&Xn(B,O,H),oe.length>0&&Xn(oe,O,H),pe.length>0&&Xn(pe,O,H),ye.buffers.depth.setTest(!0),ye.buffers.depth.setMask(!0),ye.buffers.color.setMask(!0),ye.setPolygonOffset(!1)}function Wn(w,O,H,V){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;f.state.transmissionRenderTarget[V.id]===void 0&&(f.state.transmissionRenderTarget[V.id]=new ci(1,1,{generateMipmaps:!0,type:We.has("EXT_color_buffer_half_float")||We.has("EXT_color_buffer_float")?Ir:Hn,minFilter:si,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace}));const oe=f.state.transmissionRenderTarget[V.id],pe=V.viewport||y;oe.setSize(pe.z,pe.w);const me=v.getRenderTarget();v.setRenderTarget(oe),v.getClearColor(U),G=v.getClearAlpha(),G<1&&v.setClearColor(16777215,.5),Ie?re.render(H):v.clear();const _e=v.toneMapping;v.toneMapping=Fn;const Te=V.viewport;if(V.viewport!==void 0&&(V.viewport=void 0),f.setupLightsView(V),$===!0&&ae.setGlobalState(v.clippingPlanes,V),Xn(w,H,V),De.updateMultisampleRenderTarget(oe),De.updateRenderTargetMipmap(oe),We.has("WEBGL_multisampled_render_to_texture")===!1){let Re=!1;for(let be=0,Ke=O.length;be<Ke;be++){const ht=O[be],dt=ht.object,Ut=ht.geometry,Je=ht.material,Me=ht.group;if(Je.side===Et&&dt.layers.test(V.layers)){const Rt=Je.side;Je.side=Lt,Je.needsUpdate=!0,va(dt,H,V,Ut,Je,Me),Je.side=Rt,Je.needsUpdate=!0,Re=!0}}Re===!0&&(De.updateMultisampleRenderTarget(oe),De.updateRenderTargetMipmap(oe))}v.setRenderTarget(me),v.setClearColor(U,G),Te!==void 0&&(V.viewport=Te),v.toneMapping=_e}function Xn(w,O,H){const V=O.isScene===!0?O.overrideMaterial:null;for(let B=0,oe=w.length;B<oe;B++){const pe=w[B],me=pe.object,_e=pe.geometry,Te=V===null?pe.material:V,Re=pe.group;me.layers.test(H.layers)&&va(me,O,H,_e,Te,Re)}}function va(w,O,H,V,B,oe){w.onBeforeRender(v,O,H,V,B,oe),w.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,w.matrixWorld),w.normalMatrix.getNormalMatrix(w.modelViewMatrix),B.onBeforeRender(v,O,H,V,w,oe),B.transparent===!0&&B.side===Et&&B.forceSinglePass===!1?(B.side=Lt,B.needsUpdate=!0,v.renderBufferDirect(H,O,V,B,w,oe),B.side=kn,B.needsUpdate=!0,v.renderBufferDirect(H,O,V,B,w,oe),B.side=Et):v.renderBufferDirect(H,O,V,B,w,oe),w.onAfterRender(v,O,H,V,B,oe)}function Ts(w,O,H){O.isScene!==!0&&(O=He);const V=Ge.get(w),B=f.state.lights,oe=f.state.shadowsArray,pe=B.state.version,me=te.getParameters(w,B.state,oe,O,H),_e=te.getProgramCacheKey(me);let Te=V.programs;V.environment=w.isMeshStandardMaterial?O.environment:null,V.fog=O.fog,V.envMap=(w.isMeshStandardMaterial?I:ot).get(w.envMap||V.environment),V.envMapRotation=V.environment!==null&&w.envMap===null?O.environmentRotation:w.envMapRotation,Te===void 0&&(w.addEventListener("dispose",Q),Te=new Map,V.programs=Te);let Re=Te.get(_e);if(Re!==void 0){if(V.currentProgram===Re&&V.lightsStateVersion===pe)return Sa(w,me),Re}else me.uniforms=te.getUniforms(w),w.onBuild(H,me,v),w.onBeforeCompile(me,v),Re=te.acquireProgram(me,_e),Te.set(_e,Re),V.uniforms=me.uniforms;const be=V.uniforms;return(!w.isShaderMaterial&&!w.isRawShaderMaterial||w.clipping===!0)&&(be.clippingPlanes=ae.uniform),Sa(w,me),V.needsLights=fd(w),V.lightsStateVersion=pe,V.needsLights&&(be.ambientLightColor.value=B.state.ambient,be.lightProbe.value=B.state.probe,be.directionalLights.value=B.state.directional,be.directionalLightShadows.value=B.state.directionalShadow,be.spotLights.value=B.state.spot,be.spotLightShadows.value=B.state.spotShadow,be.rectAreaLights.value=B.state.rectArea,be.ltc_1.value=B.state.rectAreaLTC1,be.ltc_2.value=B.state.rectAreaLTC2,be.pointLights.value=B.state.point,be.pointLightShadows.value=B.state.pointShadow,be.hemisphereLights.value=B.state.hemi,be.directionalShadowMap.value=B.state.directionalShadowMap,be.directionalShadowMatrix.value=B.state.directionalShadowMatrix,be.spotShadowMap.value=B.state.spotShadowMap,be.spotLightMatrix.value=B.state.spotLightMatrix,be.spotLightMap.value=B.state.spotLightMap,be.pointShadowMap.value=B.state.pointShadowMap,be.pointShadowMatrix.value=B.state.pointShadowMatrix),V.currentProgram=Re,V.uniformsList=null,Re}function xa(w){if(w.uniformsList===null){const O=w.currentProgram.getUniforms();w.uniformsList=ur.seqWithValue(O.seq,w.uniforms)}return w.uniformsList}function Sa(w,O){const H=Ge.get(w);H.outputColorSpace=O.outputColorSpace,H.batching=O.batching,H.batchingColor=O.batchingColor,H.instancing=O.instancing,H.instancingColor=O.instancingColor,H.instancingMorph=O.instancingMorph,H.skinning=O.skinning,H.morphTargets=O.morphTargets,H.morphNormals=O.morphNormals,H.morphColors=O.morphColors,H.morphTargetsCount=O.morphTargetsCount,H.numClippingPlanes=O.numClippingPlanes,H.numIntersection=O.numClipIntersection,H.vertexAlphas=O.vertexAlphas,H.vertexTangents=O.vertexTangents,H.toneMapping=O.toneMapping}function ud(w,O,H,V,B){O.isScene!==!0&&(O=He),De.resetTextureUnits();const oe=O.fog,pe=V.isMeshStandardMaterial?O.environment:null,me=T===null?v.outputColorSpace:T.isXRRenderTarget===!0?T.texture.colorSpace:Vn,_e=(V.isMeshStandardMaterial?I:ot).get(V.envMap||pe),Te=V.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Re=!!H.attributes.tangent&&(!!V.normalMap||V.anisotropy>0),be=!!H.morphAttributes.position,Ke=!!H.morphAttributes.normal,ht=!!H.morphAttributes.color;let dt=Fn;V.toneMapped&&(T===null||T.isXRRenderTarget===!0)&&(dt=v.toneMapping);const Ut=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Je=Ut!==void 0?Ut.length:0,Me=Ge.get(V),Rt=f.state.lights;if($===!0&&(ee===!0||w!==b)){const Ht=w===b&&V.id===C;ae.setState(V,w,Ht)}let tt=!1;V.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==Rt.state.version||Me.outputColorSpace!==me||B.isBatchedMesh&&Me.batching===!1||!B.isBatchedMesh&&Me.batching===!0||B.isBatchedMesh&&Me.batchingColor===!0&&B.colorTexture===null||B.isBatchedMesh&&Me.batchingColor===!1&&B.colorTexture!==null||B.isInstancedMesh&&Me.instancing===!1||!B.isInstancedMesh&&Me.instancing===!0||B.isSkinnedMesh&&Me.skinning===!1||!B.isSkinnedMesh&&Me.skinning===!0||B.isInstancedMesh&&Me.instancingColor===!0&&B.instanceColor===null||B.isInstancedMesh&&Me.instancingColor===!1&&B.instanceColor!==null||B.isInstancedMesh&&Me.instancingMorph===!0&&B.morphTexture===null||B.isInstancedMesh&&Me.instancingMorph===!1&&B.morphTexture!==null||Me.envMap!==_e||V.fog===!0&&Me.fog!==oe||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==ae.numPlanes||Me.numIntersection!==ae.numIntersection)||Me.vertexAlphas!==Te||Me.vertexTangents!==Re||Me.morphTargets!==be||Me.morphNormals!==Ke||Me.morphColors!==ht||Me.toneMapping!==dt||Me.morphTargetsCount!==Je)&&(tt=!0):(tt=!0,Me.__version=V.version);let an=Me.currentProgram;tt===!0&&(an=Ts(V,O,B));let ws=!1,Yn=!1,Wr=!1;const St=an.getUniforms(),En=Me.uniforms;if(ye.useProgram(an.program)&&(ws=!0,Yn=!0,Wr=!0),V.id!==C&&(C=V.id,Yn=!0),ws||b!==w){St.setValue(D,"projectionMatrix",w.projectionMatrix),St.setValue(D,"viewMatrix",w.matrixWorldInverse);const Ht=St.map.cameraPosition;Ht!==void 0&&Ht.setValue(D,de.setFromMatrixPosition(w.matrixWorld)),nt.logarithmicDepthBuffer&&St.setValue(D,"logDepthBufFC",2/(Math.log(w.far+1)/Math.LN2)),(V.isMeshPhongMaterial||V.isMeshToonMaterial||V.isMeshLambertMaterial||V.isMeshBasicMaterial||V.isMeshStandardMaterial||V.isShaderMaterial)&&St.setValue(D,"isOrthographic",w.isOrthographicCamera===!0),b!==w&&(b=w,Yn=!0,Wr=!0)}if(B.isSkinnedMesh){St.setOptional(D,B,"bindMatrix"),St.setOptional(D,B,"bindMatrixInverse");const Ht=B.skeleton;Ht&&(Ht.boneTexture===null&&Ht.computeBoneTexture(),St.setValue(D,"boneTexture",Ht.boneTexture,De))}B.isBatchedMesh&&(St.setOptional(D,B,"batchingTexture"),St.setValue(D,"batchingTexture",B._matricesTexture,De),St.setOptional(D,B,"batchingColorTexture"),B._colorsTexture!==null&&St.setValue(D,"batchingColorTexture",B._colorsTexture,De));const Xr=H.morphAttributes;if((Xr.position!==void 0||Xr.normal!==void 0||Xr.color!==void 0)&&ge.update(B,H,an),(Yn||Me.receiveShadow!==B.receiveShadow)&&(Me.receiveShadow=B.receiveShadow,St.setValue(D,"receiveShadow",B.receiveShadow)),V.isMeshGouraudMaterial&&V.envMap!==null&&(En.envMap.value=_e,En.flipEnvMap.value=_e.isCubeTexture&&_e.isRenderTargetTexture===!1?-1:1),V.isMeshStandardMaterial&&V.envMap===null&&O.environment!==null&&(En.envMapIntensity.value=O.environmentIntensity),Yn&&(St.setValue(D,"toneMappingExposure",v.toneMappingExposure),Me.needsLights&&pd(En,Wr),oe&&V.fog===!0&&ne.refreshFogUniforms(En,oe),ne.refreshMaterialUniforms(En,V,j,F,f.state.transmissionRenderTarget[w.id]),ur.upload(D,xa(Me),En,De)),V.isShaderMaterial&&V.uniformsNeedUpdate===!0&&(ur.upload(D,xa(Me),En,De),V.uniformsNeedUpdate=!1),V.isSpriteMaterial&&St.setValue(D,"center",B.center),St.setValue(D,"modelViewMatrix",B.modelViewMatrix),St.setValue(D,"normalMatrix",B.normalMatrix),St.setValue(D,"modelMatrix",B.matrixWorld),V.isShaderMaterial||V.isRawShaderMaterial){const Ht=V.uniformsGroups;for(let Yr=0,md=Ht.length;Yr<md;Yr++){const Ma=Ht[Yr];Oe.update(Ma,an),Oe.bind(Ma,an)}}return an}function pd(w,O){w.ambientLightColor.needsUpdate=O,w.lightProbe.needsUpdate=O,w.directionalLights.needsUpdate=O,w.directionalLightShadows.needsUpdate=O,w.pointLights.needsUpdate=O,w.pointLightShadows.needsUpdate=O,w.spotLights.needsUpdate=O,w.spotLightShadows.needsUpdate=O,w.rectAreaLights.needsUpdate=O,w.hemisphereLights.needsUpdate=O}function fd(w){return w.isMeshLambertMaterial||w.isMeshToonMaterial||w.isMeshPhongMaterial||w.isMeshStandardMaterial||w.isShadowMaterial||w.isShaderMaterial&&w.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return T},this.setRenderTargetTextures=function(w,O,H){Ge.get(w.texture).__webglTexture=O,Ge.get(w.depthTexture).__webglTexture=H;const V=Ge.get(w);V.__hasExternalTextures=!0,V.__autoAllocateDepthBuffer=H===void 0,V.__autoAllocateDepthBuffer||We.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),V.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(w,O){const H=Ge.get(w);H.__webglFramebuffer=O,H.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(w,O=0,H=0){T=w,R=O,A=H;let V=!0,B=null,oe=!1,pe=!1;if(w){const _e=Ge.get(w);_e.__useDefaultFramebuffer!==void 0?(ye.bindFramebuffer(D.FRAMEBUFFER,null),V=!1):_e.__webglFramebuffer===void 0?De.setupRenderTarget(w):_e.__hasExternalTextures&&De.rebindTextures(w,Ge.get(w.texture).__webglTexture,Ge.get(w.depthTexture).__webglTexture);const Te=w.texture;(Te.isData3DTexture||Te.isDataArrayTexture||Te.isCompressedArrayTexture)&&(pe=!0);const Re=Ge.get(w).__webglFramebuffer;w.isWebGLCubeRenderTarget?(Array.isArray(Re[O])?B=Re[O][H]:B=Re[O],oe=!0):w.samples>0&&De.useMultisampledRTT(w)===!1?B=Ge.get(w).__webglMultisampledFramebuffer:Array.isArray(Re)?B=Re[H]:B=Re,y.copy(w.viewport),P.copy(w.scissor),N=w.scissorTest}else y.copy(se).multiplyScalar(j).floor(),P.copy(he).multiplyScalar(j).floor(),N=we;if(ye.bindFramebuffer(D.FRAMEBUFFER,B)&&V&&ye.drawBuffers(w,B),ye.viewport(y),ye.scissor(P),ye.setScissorTest(N),oe){const _e=Ge.get(w.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+O,_e.__webglTexture,H)}else if(pe){const _e=Ge.get(w.texture),Te=O||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,_e.__webglTexture,H||0,Te)}C=-1},this.readRenderTargetPixels=function(w,O,H,V,B,oe,pe){if(!(w&&w.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let me=Ge.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&pe!==void 0&&(me=me[pe]),me){ye.bindFramebuffer(D.FRAMEBUFFER,me);try{const _e=w.texture,Te=_e.format,Re=_e.type;if(!nt.textureFormatReadable(Te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!nt.textureTypeReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=w.width-V&&H>=0&&H<=w.height-B&&D.readPixels(O,H,V,B,ue.convert(Te),ue.convert(Re),oe)}finally{const _e=T!==null?Ge.get(T).__webglFramebuffer:null;ye.bindFramebuffer(D.FRAMEBUFFER,_e)}}},this.readRenderTargetPixelsAsync=async function(w,O,H,V,B,oe,pe){if(!(w&&w.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=Ge.get(w).__webglFramebuffer;if(w.isWebGLCubeRenderTarget&&pe!==void 0&&(me=me[pe]),me){ye.bindFramebuffer(D.FRAMEBUFFER,me);try{const _e=w.texture,Te=_e.format,Re=_e.type;if(!nt.textureFormatReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!nt.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(O>=0&&O<=w.width-V&&H>=0&&H<=w.height-B){const be=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,be),D.bufferData(D.PIXEL_PACK_BUFFER,oe.byteLength,D.STREAM_READ),D.readPixels(O,H,V,B,ue.convert(Te),ue.convert(Re),0),D.flush();const Ke=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);await ku(D,Ke,4);try{D.bindBuffer(D.PIXEL_PACK_BUFFER,be),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,oe)}finally{D.deleteBuffer(be),D.deleteSync(Ke)}return oe}}finally{const _e=T!==null?Ge.get(T).__webglFramebuffer:null;ye.bindFramebuffer(D.FRAMEBUFFER,_e)}}},this.copyFramebufferToTexture=function(w,O=null,H=0){w.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),O=arguments[0]||null,w=arguments[1]);const V=Math.pow(2,-H),B=Math.floor(w.image.width*V),oe=Math.floor(w.image.height*V),pe=O!==null?O.x:0,me=O!==null?O.y:0;De.setTexture2D(w,0),D.copyTexSubImage2D(D.TEXTURE_2D,H,0,0,pe,me,B,oe),ye.unbindTexture()},this.copyTextureToTexture=function(w,O,H=null,V=null,B=0){w.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),V=arguments[0]||null,w=arguments[1],O=arguments[2],B=arguments[3]||0,H=null);let oe,pe,me,_e,Te,Re;H!==null?(oe=H.max.x-H.min.x,pe=H.max.y-H.min.y,me=H.min.x,_e=H.min.y):(oe=w.image.width,pe=w.image.height,me=0,_e=0),V!==null?(Te=V.x,Re=V.y):(Te=0,Re=0);const be=ue.convert(O.format),Ke=ue.convert(O.type);De.setTexture2D(O,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,O.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,O.unpackAlignment);const ht=D.getParameter(D.UNPACK_ROW_LENGTH),dt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),Ut=D.getParameter(D.UNPACK_SKIP_PIXELS),Je=D.getParameter(D.UNPACK_SKIP_ROWS),Me=D.getParameter(D.UNPACK_SKIP_IMAGES),Rt=w.isCompressedTexture?w.mipmaps[B]:w.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,Rt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Rt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,me),D.pixelStorei(D.UNPACK_SKIP_ROWS,_e),w.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,B,Te,Re,oe,pe,be,Ke,Rt.data):w.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,B,Te,Re,Rt.width,Rt.height,be,Rt.data):D.texSubImage2D(D.TEXTURE_2D,B,Te,Re,be,Ke,Rt),D.pixelStorei(D.UNPACK_ROW_LENGTH,ht),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,dt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ut),D.pixelStorei(D.UNPACK_SKIP_ROWS,Je),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Me),B===0&&O.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),ye.unbindTexture()},this.copyTextureToTexture3D=function(w,O,H=null,V=null,B=0){w.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),H=arguments[0]||null,V=arguments[1]||null,w=arguments[2],O=arguments[3],B=arguments[4]||0);let oe,pe,me,_e,Te,Re,be,Ke,ht;const dt=w.isCompressedTexture?w.mipmaps[B]:w.image;H!==null?(oe=H.max.x-H.min.x,pe=H.max.y-H.min.y,me=H.max.z-H.min.z,_e=H.min.x,Te=H.min.y,Re=H.min.z):(oe=dt.width,pe=dt.height,me=dt.depth,_e=0,Te=0,Re=0),V!==null?(be=V.x,Ke=V.y,ht=V.z):(be=0,Ke=0,ht=0);const Ut=ue.convert(O.format),Je=ue.convert(O.type);let Me;if(O.isData3DTexture)De.setTexture3D(O,0),Me=D.TEXTURE_3D;else if(O.isDataArrayTexture||O.isCompressedArrayTexture)De.setTexture2DArray(O,0),Me=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,O.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,O.unpackAlignment);const Rt=D.getParameter(D.UNPACK_ROW_LENGTH),tt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),an=D.getParameter(D.UNPACK_SKIP_PIXELS),ws=D.getParameter(D.UNPACK_SKIP_ROWS),Yn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,dt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,dt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,_e),D.pixelStorei(D.UNPACK_SKIP_ROWS,Te),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Re),w.isDataTexture||w.isData3DTexture?D.texSubImage3D(Me,B,be,Ke,ht,oe,pe,me,Ut,Je,dt.data):O.isCompressedArrayTexture?D.compressedTexSubImage3D(Me,B,be,Ke,ht,oe,pe,me,Ut,dt.data):D.texSubImage3D(Me,B,be,Ke,ht,oe,pe,me,Ut,Je,dt),D.pixelStorei(D.UNPACK_ROW_LENGTH,Rt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,tt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,an),D.pixelStorei(D.UNPACK_SKIP_ROWS,ws),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Yn),B===0&&O.generateMipmaps&&D.generateMipmap(Me),ye.unbindTexture()},this.initRenderTarget=function(w){Ge.get(w).__webglFramebuffer===void 0&&De.setupRenderTarget(w)},this.initTexture=function(w){w.isCubeTexture?De.setTextureCube(w,0):w.isData3DTexture?De.setTexture3D(w,0):w.isDataArrayTexture||w.isCompressedArrayTexture?De.setTexture2DArray(w,0):De.setTexture2D(w,0),ye.unbindTexture()},this.resetState=function(){R=0,A=0,T=null,ye.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===na?"display-p3":"srgb",t.unpackColorSpace=et.workingColorSpace===Dr?"display-p3":"srgb"}}class j0 extends bt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new en,this.environmentIntensity=1,this.environmentRotation=new en,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class $0{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=Xo,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=rn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return sa("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let s=0,r=this.stride;s<r;s++)this.array[e+s]=t.array[n+s];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=rn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const Ct=new L;class Sr{constructor(e,t,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyMatrix4(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.applyNormalMatrix(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Ct.fromBufferAttribute(this,t),Ct.transformDirection(e),this.setXYZ(t,Ct.x,Ct.y,Ct.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Jt(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Qe(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=Qe(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Jt(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Jt(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Jt(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Jt(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,s){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),s=Qe(s,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this}setXYZW(e,t,n,s,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=Qe(t,this.array),n=Qe(n,this.array),s=Qe(s,this.array),r=Qe(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=s,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return new It(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Sr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const t=[];for(let n=0;n<this.count;n++){const s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}class Zo extends di{constructor(e){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new ve(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.rotation=e.rotation,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}let Pi;const is=new L,Li=new L,Ii=new L,Di=new K,ss=new K,fh=new it,$s=new L,rs=new L,Ks=new L,Gc=new K,Ao=new K,Vc=new K;class To extends bt{constructor(e=new Zo){if(super(),this.isSprite=!0,this.type="Sprite",Pi===void 0){Pi=new Fe;const t=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),n=new $0(t,5);Pi.setIndex([0,1,2,0,2,3]),Pi.setAttribute("position",new Sr(n,3,0,!1)),Pi.setAttribute("uv",new Sr(n,2,3,!1))}this.geometry=Pi,this.material=e,this.center=new K(.5,.5)}raycast(e,t){e.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),Li.setFromMatrixScale(this.matrixWorld),fh.copy(e.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(e.camera.matrixWorldInverse,this.matrixWorld),Ii.setFromMatrixPosition(this.modelViewMatrix),e.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&Li.multiplyScalar(-Ii.z);const n=this.material.rotation;let s,r;n!==0&&(r=Math.cos(n),s=Math.sin(n));const o=this.center;Js($s.set(-.5,-.5,0),Ii,o,Li,s,r),Js(rs.set(.5,-.5,0),Ii,o,Li,s,r),Js(Ks.set(.5,.5,0),Ii,o,Li,s,r),Gc.set(0,0),Ao.set(1,0),Vc.set(1,1);let a=e.ray.intersectTriangle($s,rs,Ks,!1,is);if(a===null&&(Js(rs.set(-.5,.5,0),Ii,o,Li,s,r),Ao.set(0,1),a=e.ray.intersectTriangle($s,Ks,rs,!1,is),a===null))return;const c=e.ray.origin.distanceTo(is);c<e.near||c>e.far||t.push({distance:c,point:is.clone(),uv:Vt.getInterpolation(is,$s,rs,Ks,Gc,Ao,Vc,new K),face:null,object:this})}copy(e,t){return super.copy(e,t),e.center!==void 0&&this.center.copy(e.center),this.material=e.material,this}}function Js(i,e,t,n,s,r){Di.subVectors(i,t).addScalar(.5).multiply(n),s!==void 0?(ss.x=r*Di.x-s*Di.y,ss.y=s*Di.x+r*Di.y):ss.copy(Di),i.copy(e),i.x+=ss.x,i.y+=ss.y,i.applyMatrix4(fh)}class kt extends di{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new ve(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Mr=new L,yr=new L,Wc=new it,os=new Ur,Qs=new Nr,wo=new L,Xc=new L;class K0 extends bt{constructor(e=new Fe,t=new kt){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[0];for(let s=1,r=t.count;s<r;s++)Mr.fromBufferAttribute(t,s-1),yr.fromBufferAttribute(t,s),n[s]=n[s-1],n[s]+=Mr.distanceTo(yr);e.setAttribute("lineDistance",new Ce(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){const n=this.geometry,s=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Qs.copy(n.boundingSphere),Qs.applyMatrix4(s),Qs.radius+=r,e.ray.intersectsSphere(Qs)===!1)return;Wc.copy(s).invert(),os.copy(e.ray).applyMatrix4(Wc);const a=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=a*a,l=this.isLineSegments?2:1,h=n.index,u=n.attributes.position;if(h!==null){const m=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=m,f=g-1;_<f;_+=l){const p=h.getX(_),x=h.getX(_+1),v=er(this,e,os,c,p,x);v&&t.push(v)}if(this.isLineLoop){const _=h.getX(g-1),f=h.getX(m),p=er(this,e,os,c,_,f);p&&t.push(p)}}else{const m=Math.max(0,o.start),g=Math.min(u.count,o.start+o.count);for(let _=m,f=g-1;_<f;_+=l){const p=er(this,e,os,c,_,_+1);p&&t.push(p)}if(this.isLineLoop){const _=er(this,e,os,c,g-1,m);_&&t.push(_)}}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const s=t[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=s.length;r<o;r++){const a=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=r}}}}}function er(i,e,t,n,s,r){const o=i.geometry.attributes.position;if(Mr.fromBufferAttribute(o,s),yr.fromBufferAttribute(o,r),t.distanceSqToSegment(Mr,yr,wo,Xc)>n)return;wo.applyMatrix4(i.matrixWorld);const c=e.ray.origin.distanceTo(wo);if(!(c<e.near||c>e.far))return{distance:c,point:Xc.clone().applyMatrix4(i.matrixWorld),index:s,face:null,faceIndex:null,object:i}}const Yc=new L,Zc=new L;class Yt extends K0{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const t=e.attributes.position,n=[];for(let s=0,r=t.count;s<r;s+=2)Yc.fromBufferAttribute(t,s),Zc.fromBufferAttribute(t,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+Yc.distanceTo(Zc);e.setAttribute("lineDistance",new Ce(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class qo extends At{constructor(e,t,n,s,r,o,a,c,l){super(e,t,n,s,r,o,a,c,l),this.isCanvasTexture=!0,this.needsUpdate=!0}}class on{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,s=this.getPoint(0),r=0;t.push(0);for(let o=1;o<=e;o++)n=this.getPoint(o/e),r+=n.distanceTo(s),t.push(r),s=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t){const n=this.getLengths();let s=0;const r=n.length;let o;t?o=t:o=e*n[r-1];let a=0,c=r-1,l;for(;a<=c;)if(s=Math.floor(a+(c-a)/2),l=n[s]-o,l<0)a=s+1;else if(l>0)c=s-1;else{c=s;break}if(s=c,n[s]===o)return s/(r-1);const h=n[s],u=n[s+1]-h,m=(o-h)/u;return(s+m)/(r-1)}getTangent(e,t){let s=e-1e-4,r=e+1e-4;s<0&&(s=0),r>1&&(r=1);const o=this.getPoint(s),a=this.getPoint(r),c=t||(o.isVector2?new K:new L);return c.copy(a).sub(o).normalize(),c}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t){const n=new L,s=[],r=[],o=[],a=new L,c=new it;for(let m=0;m<=e;m++){const g=m/e;s[m]=this.getTangentAt(g,new L)}r[0]=new L,o[0]=new L;let l=Number.MAX_VALUE;const h=Math.abs(s[0].x),d=Math.abs(s[0].y),u=Math.abs(s[0].z);h<=l&&(l=h,n.set(1,0,0)),d<=l&&(l=d,n.set(0,1,0)),u<=l&&n.set(0,0,1),a.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],a),o[0].crossVectors(s[0],r[0]);for(let m=1;m<=e;m++){if(r[m]=r[m-1].clone(),o[m]=o[m-1].clone(),a.crossVectors(s[m-1],s[m]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(yt(s[m-1].dot(s[m]),-1,1));r[m].applyMatrix4(c.makeRotationAxis(a,g))}o[m].crossVectors(s[m],r[m])}if(t===!0){let m=Math.acos(yt(r[0].dot(r[e]),-1,1));m/=e,s[0].dot(a.crossVectors(r[0],r[e]))>0&&(m=-m);for(let g=1;g<=e;g++)r[g].applyMatrix4(c.makeRotationAxis(s[g],m*g)),o[g].crossVectors(s[g],r[g])}return{tangents:s,normals:r,binormals:o}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}class ca extends on{constructor(e=0,t=0,n=1,s=1,r=0,o=Math.PI*2,a=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=e,this.aY=t,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=o,this.aClockwise=a,this.aRotation=c}getPoint(e,t=new K){const n=t,s=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const o=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(o?r=0:r=s),this.aClockwise===!0&&!o&&(r===s?r=-s:r=r-s);const a=this.aStartAngle+e*r;let c=this.aX+this.xRadius*Math.cos(a),l=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const h=Math.cos(this.aRotation),d=Math.sin(this.aRotation),u=c-this.aX,m=l-this.aY;c=u*h-m*d+this.aX,l=u*d+m*h+this.aY}return n.set(c,l)}copy(e){return super.copy(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}toJSON(){const e=super.toJSON();return e.aX=this.aX,e.aY=this.aY,e.xRadius=this.xRadius,e.yRadius=this.yRadius,e.aStartAngle=this.aStartAngle,e.aEndAngle=this.aEndAngle,e.aClockwise=this.aClockwise,e.aRotation=this.aRotation,e}fromJSON(e){return super.fromJSON(e),this.aX=e.aX,this.aY=e.aY,this.xRadius=e.xRadius,this.yRadius=e.yRadius,this.aStartAngle=e.aStartAngle,this.aEndAngle=e.aEndAngle,this.aClockwise=e.aClockwise,this.aRotation=e.aRotation,this}}class J0 extends ca{constructor(e,t,n,s,r,o){super(e,t,n,n,s,r,o),this.isArcCurve=!0,this.type="ArcCurve"}}function la(){let i=0,e=0,t=0,n=0;function s(r,o,a,c){i=r,e=a,t=-3*r+3*o-2*a-c,n=2*r-2*o+a+c}return{initCatmullRom:function(r,o,a,c,l){s(o,a,l*(a-r),l*(c-o))},initNonuniformCatmullRom:function(r,o,a,c,l,h,d){let u=(o-r)/l-(a-r)/(l+h)+(a-o)/h,m=(a-o)/h-(c-o)/(h+d)+(c-a)/d;u*=h,m*=h,s(o,a,u,m)},calc:function(r){const o=r*r,a=o*r;return i+e*r+t*o+n*a}}}const tr=new L,Ro=new la,Co=new la,Po=new la;class Q0 extends on{constructor(e=[],t=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=s}getPoint(e,t=new L){const n=t,s=this.points,r=s.length,o=(r-(this.closed?0:1))*e;let a=Math.floor(o),c=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/r)+1)*r:c===0&&a===r-1&&(a=r-2,c=1);let l,h;this.closed||a>0?l=s[(a-1)%r]:(tr.subVectors(s[0],s[1]).add(s[0]),l=tr);const d=s[a%r],u=s[(a+1)%r];if(this.closed||a+2<r?h=s[(a+2)%r]:(tr.subVectors(s[r-1],s[r-2]).add(s[r-1]),h=tr),this.curveType==="centripetal"||this.curveType==="chordal"){const m=this.curveType==="chordal"?.5:.25;let g=Math.pow(l.distanceToSquared(d),m),_=Math.pow(d.distanceToSquared(u),m),f=Math.pow(u.distanceToSquared(h),m);_<1e-4&&(_=1),g<1e-4&&(g=_),f<1e-4&&(f=_),Ro.initNonuniformCatmullRom(l.x,d.x,u.x,h.x,g,_,f),Co.initNonuniformCatmullRom(l.y,d.y,u.y,h.y,g,_,f),Po.initNonuniformCatmullRom(l.z,d.z,u.z,h.z,g,_,f)}else this.curveType==="catmullrom"&&(Ro.initCatmullRom(l.x,d.x,u.x,h.x,this.tension),Co.initCatmullRom(l.y,d.y,u.y,h.y,this.tension),Po.initCatmullRom(l.z,d.z,u.z,h.z,this.tension));return n.set(Ro.calc(c),Co.calc(c),Po.calc(c)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new L().fromArray(s))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}function qc(i,e,t,n,s){const r=(n-e)*.5,o=(s-t)*.5,a=i*i,c=i*a;return(2*t-2*n+r+o)*c+(-3*t+3*n-2*r-o)*a+r*i+t}function e_(i,e){const t=1-i;return t*t*e}function t_(i,e){return 2*(1-i)*i*e}function n_(i,e){return i*i*e}function hs(i,e,t,n){return e_(i,e)+t_(i,t)+n_(i,n)}function i_(i,e){const t=1-i;return t*t*t*e}function s_(i,e){const t=1-i;return 3*t*t*i*e}function r_(i,e){return 3*(1-i)*i*i*e}function o_(i,e){return i*i*i*e}function ds(i,e,t,n,s){return i_(i,e)+s_(i,t)+r_(i,n)+o_(i,s)}class mh extends on{constructor(e=new K,t=new K,n=new K,s=new K){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new K){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ds(e,s.x,r.x,o.x,a.x),ds(e,s.y,r.y,o.y,a.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class a_ extends on{constructor(e=new L,t=new L,n=new L,s=new L){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=e,this.v1=t,this.v2=n,this.v3=s}getPoint(e,t=new L){const n=t,s=this.v0,r=this.v1,o=this.v2,a=this.v3;return n.set(ds(e,s.x,r.x,o.x,a.x),ds(e,s.y,r.y,o.y,a.y),ds(e,s.z,r.z,o.z,a.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this.v3.copy(e.v3),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e.v3=this.v3.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this.v3.fromArray(e.v3),this}}class gh extends on{constructor(e=new K,t=new K){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=e,this.v2=t}getPoint(e,t=new K){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new K){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class c_ extends on{constructor(e=new L,t=new L){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=e,this.v2=t}getPoint(e,t=new L){const n=t;return e===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(e).add(this.v1)),n}getPointAt(e,t){return this.getPoint(e,t)}getTangent(e,t=new L){return t.subVectors(this.v2,this.v1).normalize()}getTangentAt(e,t){return this.getTangent(e,t)}copy(e){return super.copy(e),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class _h extends on{constructor(e=new K,t=new K,n=new K){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new K){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(hs(e,s.x,r.x,o.x),hs(e,s.y,r.y,o.y)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class l_ extends on{constructor(e=new L,t=new L,n=new L){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=e,this.v1=t,this.v2=n}getPoint(e,t=new L){const n=t,s=this.v0,r=this.v1,o=this.v2;return n.set(hs(e,s.x,r.x,o.x),hs(e,s.y,r.y,o.y),hs(e,s.z,r.z,o.z)),n}copy(e){return super.copy(e),this.v0.copy(e.v0),this.v1.copy(e.v1),this.v2.copy(e.v2),this}toJSON(){const e=super.toJSON();return e.v0=this.v0.toArray(),e.v1=this.v1.toArray(),e.v2=this.v2.toArray(),e}fromJSON(e){return super.fromJSON(e),this.v0.fromArray(e.v0),this.v1.fromArray(e.v1),this.v2.fromArray(e.v2),this}}class vh extends on{constructor(e=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=e}getPoint(e,t=new K){const n=t,s=this.points,r=(s.length-1)*e,o=Math.floor(r),a=r-o,c=s[o===0?o:o-1],l=s[o],h=s[o>s.length-2?s.length-1:o+1],d=s[o>s.length-3?s.length-1:o+2];return n.set(qc(a,c.x,l.x,h.x,d.x),qc(a,c.y,l.y,h.y,d.y)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const s=this.points[t];e.points.push(s.toArray())}return e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const s=e.points[t];this.points.push(new K().fromArray(s))}return this}}var jc=Object.freeze({__proto__:null,ArcCurve:J0,CatmullRomCurve3:Q0,CubicBezierCurve:mh,CubicBezierCurve3:a_,EllipseCurve:ca,LineCurve:gh,LineCurve3:c_,QuadraticBezierCurve:_h,QuadraticBezierCurve3:l_,SplineCurve:vh});class h_ extends on{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(e){this.curves.push(e)}closePath(){const e=this.curves[0].getPoint(0),t=this.curves[this.curves.length-1].getPoint(1);if(!e.equals(t)){const n=e.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new jc[n](t,e))}return this}getPoint(e,t){const n=e*this.getLength(),s=this.getCurveLengths();let r=0;for(;r<s.length;){if(s[r]>=n){const o=s[r]-n,a=this.curves[r],c=a.getLength(),l=c===0?0:1-o/c;return a.getPointAt(l,t)}r++}return null}getLength(){const e=this.getCurveLengths();return e[e.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const e=[];let t=0;for(let n=0,s=this.curves.length;n<s;n++)t+=this.curves[n].getLength(),e.push(t);return this.cacheLengths=e,e}getSpacedPoints(e=40){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return this.autoClose&&t.push(t[0]),t}getPoints(e=12){const t=[];let n;for(let s=0,r=this.curves;s<r.length;s++){const o=r[s],a=o.isEllipseCurve?e*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?e*o.points.length:e,c=o.getPoints(a);for(let l=0;l<c.length;l++){const h=c[l];n&&n.equals(h)||(t.push(h),n=h)}}return this.autoClose&&t.length>1&&!t[t.length-1].equals(t[0])&&t.push(t[0]),t}copy(e){super.copy(e),this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(s.clone())}return this.autoClose=e.autoClose,this}toJSON(){const e=super.toJSON();e.autoClose=this.autoClose,e.curves=[];for(let t=0,n=this.curves.length;t<n;t++){const s=this.curves[t];e.curves.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.autoClose=e.autoClose,this.curves=[];for(let t=0,n=e.curves.length;t<n;t++){const s=e.curves[t];this.curves.push(new jc[s.type]().fromJSON(s))}return this}}class ms extends h_{constructor(e){super(),this.type="Path",this.currentPoint=new K,e&&this.setFromPoints(e)}setFromPoints(e){this.moveTo(e[0].x,e[0].y);for(let t=1,n=e.length;t<n;t++)this.lineTo(e[t].x,e[t].y);return this}moveTo(e,t){return this.currentPoint.set(e,t),this}lineTo(e,t){const n=new gh(this.currentPoint.clone(),new K(e,t));return this.curves.push(n),this.currentPoint.set(e,t),this}quadraticCurveTo(e,t,n,s){const r=new _h(this.currentPoint.clone(),new K(e,t),new K(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(e,t,n,s,r,o){const a=new mh(this.currentPoint.clone(),new K(e,t),new K(n,s),new K(r,o));return this.curves.push(a),this.currentPoint.set(r,o),this}splineThru(e){const t=[this.currentPoint.clone()].concat(e),n=new vh(t);return this.curves.push(n),this.currentPoint.copy(e[e.length-1]),this}arc(e,t,n,s,r,o){const a=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(e+a,t+c,n,s,r,o),this}absarc(e,t,n,s,r,o){return this.absellipse(e,t,n,n,s,r,o),this}ellipse(e,t,n,s,r,o,a,c){const l=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(e+l,t+h,n,s,r,o,a,c),this}absellipse(e,t,n,s,r,o,a,c){const l=new ca(e,t,n,s,r,o,a,c);if(this.curves.length>0){const d=l.getPoint(0);d.equals(this.currentPoint)||this.lineTo(d.x,d.y)}this.curves.push(l);const h=l.getPoint(1);return this.currentPoint.copy(h),this}copy(e){return super.copy(e),this.currentPoint.copy(e.currentPoint),this}toJSON(){const e=super.toJSON();return e.currentPoint=this.currentPoint.toArray(),e}fromJSON(e){return super.fromJSON(e),this.currentPoint.fromArray(e.currentPoint),this}}class Sn extends Fe{constructor(e=1,t=1,n=1,s=32,r=1,o=!1,a=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:s,heightSegments:r,openEnded:o,thetaStart:a,thetaLength:c};const l=this;s=Math.floor(s),r=Math.floor(r);const h=[],d=[],u=[],m=[];let g=0;const _=[],f=n/2;let p=0;x(),o===!1&&(e>0&&v(!0),t>0&&v(!1)),this.setIndex(h),this.setAttribute("position",new Ce(d,3)),this.setAttribute("normal",new Ce(u,3)),this.setAttribute("uv",new Ce(m,2));function x(){const S=new L,R=new L;let A=0;const T=(t-e)/n;for(let C=0;C<=r;C++){const b=[],y=C/r,P=y*(t-e)+e;for(let N=0;N<=s;N++){const U=N/s,G=U*c+a,Z=Math.sin(G),F=Math.cos(G);R.x=P*Z,R.y=-y*n+f,R.z=P*F,d.push(R.x,R.y,R.z),S.set(Z,T,F).normalize(),u.push(S.x,S.y,S.z),m.push(U,1-y),b.push(g++)}_.push(b)}for(let C=0;C<s;C++)for(let b=0;b<r;b++){const y=_[b][C],P=_[b+1][C],N=_[b+1][C+1],U=_[b][C+1];h.push(y,P,U),h.push(P,N,U),A+=6}l.addGroup(p,A,0),p+=A}function v(S){const R=g,A=new K,T=new L;let C=0;const b=S===!0?e:t,y=S===!0?1:-1;for(let N=1;N<=s;N++)d.push(0,f*y,0),u.push(0,y,0),m.push(.5,.5),g++;const P=g;for(let N=0;N<=s;N++){const G=N/s*c+a,Z=Math.cos(G),F=Math.sin(G);T.x=b*F,T.y=f*y,T.z=b*Z,d.push(T.x,T.y,T.z),u.push(0,y,0),A.x=Z*.5+.5,A.y=F*.5*y+.5,m.push(A.x,A.y),g++}for(let N=0;N<s;N++){const U=R+N,G=P+N;S===!0?h.push(G,G+1,U):h.push(G+1,G,U),C+=3}l.addGroup(p,C,S===!0?1:2),p+=C}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Sn(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Br extends Sn{constructor(e=1,t=1,n=32,s=1,r=!1,o=0,a=Math.PI*2){super(0,e,t,n,s,r,o,a),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:o,thetaLength:a}}static fromJSON(e){return new Br(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}const nr=new L,ir=new L,Lo=new L,sr=new Vt;class $c extends Fe{constructor(e=null,t=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:t},e!==null){const s=Math.pow(10,4),r=Math.cos(Hi*t),o=e.getIndex(),a=e.getAttribute("position"),c=o?o.count:a.count,l=[0,0,0],h=["a","b","c"],d=new Array(3),u={},m=[];for(let g=0;g<c;g+=3){o?(l[0]=o.getX(g),l[1]=o.getX(g+1),l[2]=o.getX(g+2)):(l[0]=g,l[1]=g+1,l[2]=g+2);const{a:_,b:f,c:p}=sr;if(_.fromBufferAttribute(a,l[0]),f.fromBufferAttribute(a,l[1]),p.fromBufferAttribute(a,l[2]),sr.getNormal(Lo),d[0]=`${Math.round(_.x*s)},${Math.round(_.y*s)},${Math.round(_.z*s)}`,d[1]=`${Math.round(f.x*s)},${Math.round(f.y*s)},${Math.round(f.z*s)}`,d[2]=`${Math.round(p.x*s)},${Math.round(p.y*s)},${Math.round(p.z*s)}`,!(d[0]===d[1]||d[1]===d[2]||d[2]===d[0]))for(let x=0;x<3;x++){const v=(x+1)%3,S=d[x],R=d[v],A=sr[h[x]],T=sr[h[v]],C=`${S}_${R}`,b=`${R}_${S}`;b in u&&u[b]?(Lo.dot(u[b].normal)<=r&&(m.push(A.x,A.y,A.z),m.push(T.x,T.y,T.z)),u[b]=null):C in u||(u[C]={index0:l[x],index1:l[v],normal:Lo.clone()})}}for(const g in u)if(u[g]){const{index0:_,index1:f}=u[g];nr.fromBufferAttribute(a,_),ir.fromBufferAttribute(a,f),m.push(nr.x,nr.y,nr.z),m.push(ir.x,ir.y,ir.z)}this.setAttribute("position",new Ce(m,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class zr extends ms{constructor(e){super(e),this.uuid=rn(),this.type="Shape",this.holes=[]}getPointsHoles(e){const t=[];for(let n=0,s=this.holes.length;n<s;n++)t[n]=this.holes[n].getPoints(e);return t}extractPoints(e){return{shape:this.getPoints(e),holes:this.getPointsHoles(e)}}copy(e){super.copy(e),this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(s.clone())}return this}toJSON(){const e=super.toJSON();e.uuid=this.uuid,e.holes=[];for(let t=0,n=this.holes.length;t<n;t++){const s=this.holes[t];e.holes.push(s.toJSON())}return e}fromJSON(e){super.fromJSON(e),this.uuid=e.uuid,this.holes=[];for(let t=0,n=e.holes.length;t<n;t++){const s=e.holes[t];this.holes.push(new ms().fromJSON(s))}return this}}const d_={triangulate:function(i,e,t=2){const n=e&&e.length,s=n?e[0]*t:i.length;let r=xh(i,0,s,t,!0);const o=[];if(!r||r.next===r.prev)return o;let a,c,l,h,d,u,m;if(n&&(r=g_(i,e,r,t)),i.length>80*t){a=l=i[0],c=h=i[1];for(let g=t;g<s;g+=t)d=i[g],u=i[g+1],d<a&&(a=d),u<c&&(c=u),d>l&&(l=d),u>h&&(h=u);m=Math.max(l-a,h-c),m=m!==0?32767/m:0}return gs(r,o,t,a,c,m,0),o}};function xh(i,e,t,n,s){let r,o;if(s===w_(i,e,t,n)>0)for(r=e;r<t;r+=n)o=Kc(r,i[r],i[r+1],o);else for(r=t-n;r>=e;r-=n)o=Kc(r,i[r],i[r+1],o);return o&&kr(o,o.next)&&(vs(o),o=o.next),o}function li(i,e){if(!i)return i;e||(e=i);let t=i,n;do if(n=!1,!t.steiner&&(kr(t,t.next)||at(t.prev,t,t.next)===0)){if(vs(t),t=e=t.prev,t===t.next)break;n=!0}else t=t.next;while(n||t!==e);return e}function gs(i,e,t,n,s,r,o){if(!i)return;!o&&r&&M_(i,n,s,r);let a=i,c,l;for(;i.prev!==i.next;){if(c=i.prev,l=i.next,r?p_(i,n,s,r):u_(i)){e.push(c.i/t|0),e.push(i.i/t|0),e.push(l.i/t|0),vs(i),i=l.next,a=l.next;continue}if(i=l,i===a){o?o===1?(i=f_(li(i),e,t),gs(i,e,t,n,s,r,2)):o===2&&m_(i,e,t,n,s,r):gs(li(i),e,t,n,s,r,1);break}}}function u_(i){const e=i.prev,t=i,n=i.next;if(at(e,t,n)>=0)return!1;const s=e.x,r=t.x,o=n.x,a=e.y,c=t.y,l=n.y,h=s<r?s<o?s:o:r<o?r:o,d=a<c?a<l?a:l:c<l?c:l,u=s>r?s>o?s:o:r>o?r:o,m=a>c?a>l?a:l:c>l?c:l;let g=n.next;for(;g!==e;){if(g.x>=h&&g.x<=u&&g.y>=d&&g.y<=m&&Oi(s,a,r,c,o,l,g.x,g.y)&&at(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function p_(i,e,t,n){const s=i.prev,r=i,o=i.next;if(at(s,r,o)>=0)return!1;const a=s.x,c=r.x,l=o.x,h=s.y,d=r.y,u=o.y,m=a<c?a<l?a:l:c<l?c:l,g=h<d?h<u?h:u:d<u?d:u,_=a>c?a>l?a:l:c>l?c:l,f=h>d?h>u?h:u:d>u?d:u,p=jo(m,g,e,t,n),x=jo(_,f,e,t,n);let v=i.prevZ,S=i.nextZ;for(;v&&v.z>=p&&S&&S.z<=x;){if(v.x>=m&&v.x<=_&&v.y>=g&&v.y<=f&&v!==s&&v!==o&&Oi(a,h,c,d,l,u,v.x,v.y)&&at(v.prev,v,v.next)>=0||(v=v.prevZ,S.x>=m&&S.x<=_&&S.y>=g&&S.y<=f&&S!==s&&S!==o&&Oi(a,h,c,d,l,u,S.x,S.y)&&at(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;v&&v.z>=p;){if(v.x>=m&&v.x<=_&&v.y>=g&&v.y<=f&&v!==s&&v!==o&&Oi(a,h,c,d,l,u,v.x,v.y)&&at(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;S&&S.z<=x;){if(S.x>=m&&S.x<=_&&S.y>=g&&S.y<=f&&S!==s&&S!==o&&Oi(a,h,c,d,l,u,S.x,S.y)&&at(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function f_(i,e,t){let n=i;do{const s=n.prev,r=n.next.next;!kr(s,r)&&Sh(s,n,n.next,r)&&_s(s,r)&&_s(r,s)&&(e.push(s.i/t|0),e.push(n.i/t|0),e.push(r.i/t|0),vs(n),vs(n.next),n=i=r),n=n.next}while(n!==i);return li(n)}function m_(i,e,t,n,s,r){let o=i;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&E_(o,a)){let c=Mh(o,a);o=li(o,o.next),c=li(c,c.next),gs(o,e,t,n,s,r,0),gs(c,e,t,n,s,r,0);return}a=a.next}o=o.next}while(o!==i)}function g_(i,e,t,n){const s=[];let r,o,a,c,l;for(r=0,o=e.length;r<o;r++)a=e[r]*n,c=r<o-1?e[r+1]*n:i.length,l=xh(i,a,c,n,!1),l===l.next&&(l.steiner=!0),s.push(b_(l));for(s.sort(__),r=0;r<s.length;r++)t=v_(s[r],t);return t}function __(i,e){return i.x-e.x}function v_(i,e){const t=x_(i,e);if(!t)return e;const n=Mh(t,i);return li(n,n.next),li(t,t.next)}function x_(i,e){let t=e,n=-1/0,s;const r=i.x,o=i.y;do{if(o<=t.y&&o>=t.next.y&&t.next.y!==t.y){const u=t.x+(o-t.y)*(t.next.x-t.x)/(t.next.y-t.y);if(u<=r&&u>n&&(n=u,s=t.x<t.next.x?t:t.next,u===r))return s}t=t.next}while(t!==e);if(!s)return null;const a=s,c=s.x,l=s.y;let h=1/0,d;t=s;do r>=t.x&&t.x>=c&&r!==t.x&&Oi(o<l?r:n,o,c,l,o<l?n:r,o,t.x,t.y)&&(d=Math.abs(o-t.y)/(r-t.x),_s(t,i)&&(d<h||d===h&&(t.x>s.x||t.x===s.x&&S_(s,t)))&&(s=t,h=d)),t=t.next;while(t!==a);return s}function S_(i,e){return at(i.prev,i,e.prev)<0&&at(e.next,i,i.next)<0}function M_(i,e,t,n){let s=i;do s.z===0&&(s.z=jo(s.x,s.y,e,t,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,y_(s)}function y_(i){let e,t,n,s,r,o,a,c,l=1;do{for(t=i,i=null,r=null,o=0;t;){for(o++,n=t,a=0,e=0;e<l&&(a++,n=n.nextZ,!!n);e++);for(c=l;a>0||c>0&&n;)a!==0&&(c===0||!n||t.z<=n.z)?(s=t,t=t.nextZ,a--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;t=n}r.nextZ=null,l*=2}while(o>1);return i}function jo(i,e,t,n,s){return i=(i-t)*s|0,e=(e-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,i|e<<1}function b_(i){let e=i,t=i;do(e.x<t.x||e.x===t.x&&e.y<t.y)&&(t=e),e=e.next;while(e!==i);return t}function Oi(i,e,t,n,s,r,o,a){return(s-o)*(e-a)>=(i-o)*(r-a)&&(i-o)*(n-a)>=(t-o)*(e-a)&&(t-o)*(r-a)>=(s-o)*(n-a)}function E_(i,e){return i.next.i!==e.i&&i.prev.i!==e.i&&!A_(i,e)&&(_s(i,e)&&_s(e,i)&&T_(i,e)&&(at(i.prev,i,e.prev)||at(i,e.prev,e))||kr(i,e)&&at(i.prev,i,i.next)>0&&at(e.prev,e,e.next)>0)}function at(i,e,t){return(e.y-i.y)*(t.x-e.x)-(e.x-i.x)*(t.y-e.y)}function kr(i,e){return i.x===e.x&&i.y===e.y}function Sh(i,e,t,n){const s=or(at(i,e,t)),r=or(at(i,e,n)),o=or(at(t,n,i)),a=or(at(t,n,e));return!!(s!==r&&o!==a||s===0&&rr(i,t,e)||r===0&&rr(i,n,e)||o===0&&rr(t,i,n)||a===0&&rr(t,e,n))}function rr(i,e,t){return e.x<=Math.max(i.x,t.x)&&e.x>=Math.min(i.x,t.x)&&e.y<=Math.max(i.y,t.y)&&e.y>=Math.min(i.y,t.y)}function or(i){return i>0?1:i<0?-1:0}function A_(i,e){let t=i;do{if(t.i!==i.i&&t.next.i!==i.i&&t.i!==e.i&&t.next.i!==e.i&&Sh(t,t.next,i,e))return!0;t=t.next}while(t!==i);return!1}function _s(i,e){return at(i.prev,i,i.next)<0?at(i,e,i.next)>=0&&at(i,i.prev,e)>=0:at(i,e,i.prev)<0||at(i,i.next,e)<0}function T_(i,e){let t=i,n=!1;const s=(i.x+e.x)/2,r=(i.y+e.y)/2;do t.y>r!=t.next.y>r&&t.next.y!==t.y&&s<(t.next.x-t.x)*(r-t.y)/(t.next.y-t.y)+t.x&&(n=!n),t=t.next;while(t!==i);return n}function Mh(i,e){const t=new $o(i.i,i.x,i.y),n=new $o(e.i,e.x,e.y),s=i.next,r=e.prev;return i.next=e,e.prev=i,t.next=s,s.prev=t,n.next=t,t.prev=n,r.next=n,n.prev=r,n}function Kc(i,e,t,n){const s=new $o(i,e,t);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function vs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function $o(i,e,t){this.i=i,this.x=e,this.y=t,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function w_(i,e,t,n){let s=0;for(let r=e,o=t-n;r<t;r+=n)s+=(i[o]-i[r])*(i[r+1]+i[o+1]),o=r;return s}class us{static area(e){const t=e.length;let n=0;for(let s=t-1,r=0;r<t;s=r++)n+=e[s].x*e[r].y-e[r].x*e[s].y;return n*.5}static isClockWise(e){return us.area(e)<0}static triangulateShape(e,t){const n=[],s=[],r=[];Jc(e),Qc(n,e);let o=e.length;t.forEach(Jc);for(let c=0;c<t.length;c++)s.push(o),o+=t[c].length,Qc(n,t[c]);const a=d_.triangulate(n,s);for(let c=0;c<a.length;c+=3)r.push(a.slice(c,c+3));return r}}function Jc(i){const e=i.length;e>2&&i[e-1].equals(i[0])&&i.pop()}function Qc(i,e){for(let t=0;t<e.length;t++)i.push(e[t].x),i.push(e[t].y)}class Ms extends Fe{constructor(e=new zr([new K(0,.5),new K(-.5,-.5),new K(.5,-.5)]),t=12){super(),this.type="ShapeGeometry",this.parameters={shapes:e,curveSegments:t};const n=[],s=[],r=[],o=[];let a=0,c=0;if(Array.isArray(e)===!1)l(e);else for(let h=0;h<e.length;h++)l(e[h]),this.addGroup(a,c,h),a+=c,c=0;this.setIndex(n),this.setAttribute("position",new Ce(s,3)),this.setAttribute("normal",new Ce(r,3)),this.setAttribute("uv",new Ce(o,2));function l(h){const d=s.length/3,u=h.extractPoints(t);let m=u.shape;const g=u.holes;us.isClockWise(m)===!1&&(m=m.reverse());for(let f=0,p=g.length;f<p;f++){const x=g[f];us.isClockWise(x)===!0&&(g[f]=x.reverse())}const _=us.triangulateShape(m,g);for(let f=0,p=g.length;f<p;f++){const x=g[f];m=m.concat(x)}for(let f=0,p=m.length;f<p;f++){const x=m[f];s.push(x.x,x.y,0),r.push(0,0,1),o.push(x.x,x.y)}for(let f=0,p=_.length;f<p;f++){const x=_[f],v=x[0]+d,S=x[1]+d,R=x[2]+d;n.push(v,S,R),c+=3}}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}toJSON(){const e=super.toJSON(),t=this.parameters.shapes;return R_(t,e)}static fromJSON(e,t){const n=[];for(let s=0,r=e.shapes.length;s<r;s++){const o=t[e.shapes[s]];n.push(o)}return new Ms(n,e.curveSegments)}}function R_(i,e){if(e.shapes=[],Array.isArray(i))for(let t=0,n=i.length;t<n;t++){const s=i[t];e.shapes.push(s.uuid)}else e.shapes.push(i.uuid);return e}class ui extends Fe{constructor(e=1,t=32,n=16,s=0,r=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:s,phiLength:r,thetaStart:o,thetaLength:a},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const c=Math.min(o+a,Math.PI);let l=0;const h=[],d=new L,u=new L,m=[],g=[],_=[],f=[];for(let p=0;p<=n;p++){const x=[],v=p/n;let S=0;p===0&&o===0?S=.5/t:p===n&&c===Math.PI&&(S=-.5/t);for(let R=0;R<=t;R++){const A=R/t;d.x=-e*Math.cos(s+A*r)*Math.sin(o+v*a),d.y=e*Math.cos(o+v*a),d.z=e*Math.sin(s+A*r)*Math.sin(o+v*a),g.push(d.x,d.y,d.z),u.copy(d).normalize(),_.push(u.x,u.y,u.z),f.push(A+S,1-v),x.push(l++)}h.push(x)}for(let p=0;p<n;p++)for(let x=0;x<t;x++){const v=h[p][x+1],S=h[p][x],R=h[p+1][x],A=h[p+1][x+1];(p!==0||o>0)&&m.push(v,S,A),(p!==n-1||c<Math.PI)&&m.push(S,R,A)}this.setIndex(m),this.setAttribute("position",new Ce(g,3)),this.setAttribute("normal",new Ce(_,3)),this.setAttribute("uv",new Ce(f,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ui(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class ri extends di{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new ve(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ve(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=jl,this.normalScale=new K(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new en,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}const br={enabled:!1,files:{},add:function(i,e){this.enabled!==!1&&(this.files[i]=e)},get:function(i){if(this.enabled!==!1)return this.files[i]},remove:function(i){delete this.files[i]},clear:function(){this.files={}}};class C_{constructor(e,t,n){const s=this;let r=!1,o=0,a=0,c;const l=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.itemStart=function(h){a++,r===!1&&s.onStart!==void 0&&s.onStart(h,o,a),r=!0},this.itemEnd=function(h){o++,s.onProgress!==void 0&&s.onProgress(h,o,a),o===a&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return c?c(h):h},this.setURLModifier=function(h){return c=h,this},this.addHandler=function(h,d){return l.push(h,d),this},this.removeHandler=function(h){const d=l.indexOf(h);return d!==-1&&l.splice(d,2),this},this.getHandler=function(h){for(let d=0,u=l.length;d<u;d+=2){const m=l[d],g=l[d+1];if(m.global&&(m.lastIndex=0),m.test(h))return g}return null}}}const P_=new C_;class ys{constructor(e){this.manager=e!==void 0?e:P_,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(e,t){const n=this;return new Promise(function(s,r){n.load(e,s,t,r)})}parse(){}setCrossOrigin(e){return this.crossOrigin=e,this}setWithCredentials(e){return this.withCredentials=e,this}setPath(e){return this.path=e,this}setResourcePath(e){return this.resourcePath=e,this}setRequestHeader(e){return this.requestHeader=e,this}}ys.DEFAULT_MATERIAL_NAME="__DEFAULT";const pn={};class L_ extends Error{constructor(e,t){super(e),this.response=t}}class I_ extends ys{constructor(e){super(e)}load(e,t,n,s){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=br.get(e);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(pn[e]!==void 0){pn[e].push({onLoad:t,onProgress:n,onError:s});return}pn[e]=[],pn[e].push({onLoad:t,onProgress:n,onError:s});const o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin"}),a=this.mimeType,c=this.responseType;fetch(o).then(l=>{if(l.status===200||l.status===0){if(l.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||l.body===void 0||l.body.getReader===void 0)return l;const h=pn[e],d=l.body.getReader(),u=l.headers.get("X-File-Size")||l.headers.get("Content-Length"),m=u?parseInt(u):0,g=m!==0;let _=0;const f=new ReadableStream({start(p){x();function x(){d.read().then(({done:v,value:S})=>{if(v)p.close();else{_+=S.byteLength;const R=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:m});for(let A=0,T=h.length;A<T;A++){const C=h[A];C.onProgress&&C.onProgress(R)}p.enqueue(S),x()}},v=>{p.error(v)})}}});return new Response(f)}else throw new L_(`fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,l)}).then(l=>{switch(c){case"arraybuffer":return l.arrayBuffer();case"blob":return l.blob();case"document":return l.text().then(h=>new DOMParser().parseFromString(h,a));case"json":return l.json();default:if(a===void 0)return l.text();{const d=/charset="?([^;"\s]*)"?/i.exec(a),u=d&&d[1]?d[1].toLowerCase():void 0,m=new TextDecoder(u);return l.arrayBuffer().then(g=>m.decode(g))}}}).then(l=>{br.add(e,l);const h=pn[e];delete pn[e];for(let d=0,u=h.length;d<u;d++){const m=h[d];m.onLoad&&m.onLoad(l)}}).catch(l=>{const h=pn[e];if(h===void 0)throw this.manager.itemError(e),l;delete pn[e];for(let d=0,u=h.length;d<u;d++){const m=h[d];m.onError&&m.onError(l)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}}class D_ extends ys{constructor(e){super(e)}load(e,t,n,s){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);const r=this,o=br.get(e);if(o!==void 0)return r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o;const a=fs("img");function c(){h(),br.add(e,this),t&&t(this),r.manager.itemEnd(e)}function l(d){h(),s&&s(d),r.manager.itemError(e),r.manager.itemEnd(e)}function h(){a.removeEventListener("load",c,!1),a.removeEventListener("error",l,!1)}return a.addEventListener("load",c,!1),a.addEventListener("error",l,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(a.crossOrigin=this.crossOrigin),r.manager.itemStart(e),a.src=e,a}}class N_ extends ys{constructor(e){super(e)}load(e,t,n,s){const r=new At,o=new D_(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(a){r.image=a,r.needsUpdate=!0,t!==void 0&&t(r)},n,s),r}}class ha extends bt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new ve(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),t}}const Io=new it,el=new L,tl=new L;class yh{constructor(e){this.camera=e,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new K(512,512),this.map=null,this.mapPass=null,this.matrix=new it,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new oa,this._frameExtents=new K(1,1),this._viewportCount=1,this._viewports=[new rt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;el.setFromMatrixPosition(e.matrixWorld),t.position.copy(el),tl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(tl),t.updateMatrixWorld(),Io.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Io),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Io)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const nl=new it,as=new L,Do=new L;class U_ extends yh{constructor(){super(new Bt(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new K(4,2),this._viewportCount=6,this._viewports=[new rt(2,1,1,1),new rt(0,1,1,1),new rt(3,1,1,1),new rt(1,1,1,1),new rt(3,0,1,1),new rt(1,0,1,1)],this._cubeDirections=[new L(1,0,0),new L(-1,0,0),new L(0,0,1),new L(0,0,-1),new L(0,1,0),new L(0,-1,0)],this._cubeUps=[new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,1,0),new L(0,0,1),new L(0,0,-1)]}updateMatrices(e,t=0){const n=this.camera,s=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),as.setFromMatrixPosition(e.matrixWorld),n.position.copy(as),Do.copy(n.position),Do.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(Do),n.updateMatrixWorld(),s.makeTranslation(-as.x,-as.y,-as.z),nl.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(nl)}}class O_ extends ha{constructor(e,t,n=0,s=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new U_}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}}class F_ extends yh{constructor(){super(new ah(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class B_ extends ha{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(bt.DEFAULT_UP),this.updateMatrix(),this.target=new bt,this.shadow=new F_}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class z_ extends ha{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}const il=new it;class k_{constructor(e,t,n=0,s=1/0){this.ray=new Ur(e,t),this.near=n,this.far=s,this.camera=null,this.layers=new ra,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return il.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(il),this}intersectObject(e,t=!0,n=[]){return Ko(e,this,n,t),n.sort(sl),n}intersectObjects(e,t=!0,n=[]){for(let s=0,r=e.length;s<r;s++)Ko(e[s],this,n,t);return n.sort(sl),n}}function sl(i,e){return i.distance-e.distance}function Ko(i,e,t,n){let s=!0;if(i.layers.test(e.layers)&&i.raycast(e,t)===!1&&(s=!1),s===!0&&n===!0){const r=i.children;for(let o=0,a=r.length;o<a;o++)Ko(r[o],e,t,!0)}}class rl{constructor(e=1,t=0,n=0){return this.radius=e,this.phi=t,this.theta=n,this}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(yt(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class ol extends Yt{constructor(e=10,t=10,n=4473924,s=8947848){n=new ve(n),s=new ve(s);const r=t/2,o=e/t,a=e/2,c=[],l=[];for(let u=0,m=0,g=-a;u<=t;u++,g+=o){c.push(-a,0,g,a,0,g),c.push(g,0,-a,g,0,a);const _=u===r?n:s;_.toArray(l,m),m+=3,_.toArray(l,m),m+=3,_.toArray(l,m),m+=3,_.toArray(l,m),m+=3}const h=new Fe;h.setAttribute("position",new Ce(c,3)),h.setAttribute("color",new Ce(l,3));const d=new kt({vertexColors:!0,toneMapped:!1});super(h,d),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class H_ extends Yt{constructor(e=1){const t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],s=new Fe;s.setAttribute("position",new Ce(t,3)),s.setAttribute("color",new Ce(n,3));const r=new kt({vertexColors:!0,toneMapped:!1});super(s,r),this.type="AxesHelper"}setColors(e,t,n){const s=new ve,r=this.geometry.attributes.color.array;return s.set(e),s.toArray(r,0),s.toArray(r,3),s.set(t),s.toArray(r,6),s.toArray(r,9),s.set(n),s.toArray(r,12),s.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ta}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ta);class al extends ys{constructor(e){super(e)}load(e,t,n,s){const r=this,o=new I_(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(e,function(a){try{t(r.parse(a))}catch(c){s?s(c):console.error(c),r.manager.itemError(e)}},n,s)}parse(e){function t(l){const h=new DataView(l),d=32/8*3+32/8*3*3+16/8,u=h.getUint32(80,!0);if(80+32/8+u*d===h.byteLength)return!0;const g=[115,111,108,105,100];for(let _=0;_<5;_++)if(n(g,h,_))return!1;return!0}function n(l,h,d){for(let u=0,m=l.length;u<m;u++)if(l[u]!==h.getUint8(d+u))return!1;return!0}function s(l){const h=new DataView(l),d=h.getUint32(80,!0);let u,m,g,_=!1,f,p,x,v,S;for(let P=0;P<70;P++)h.getUint32(P,!1)==1129270351&&h.getUint8(P+4)==82&&h.getUint8(P+5)==61&&(_=!0,f=new Float32Array(d*3*3),p=h.getUint8(P+6)/255,x=h.getUint8(P+7)/255,v=h.getUint8(P+8)/255,S=h.getUint8(P+9)/255);const R=84,A=12*4+2,T=new Fe,C=new Float32Array(d*3*3),b=new Float32Array(d*3*3),y=new ve;for(let P=0;P<d;P++){const N=R+P*A,U=h.getFloat32(N,!0),G=h.getFloat32(N+4,!0),Z=h.getFloat32(N+8,!0);if(_){const F=h.getUint16(N+48,!0);F&32768?(u=p,m=x,g=v):(u=(F&31)/31,m=(F>>5&31)/31,g=(F>>10&31)/31)}for(let F=1;F<=3;F++){const j=N+F*12,k=P*3*3+(F-1)*3;C[k]=h.getFloat32(j,!0),C[k+1]=h.getFloat32(j+4,!0),C[k+2]=h.getFloat32(j+8,!0),b[k]=U,b[k+1]=G,b[k+2]=Z,_&&(y.set(u,m,g).convertSRGBToLinear(),f[k]=y.r,f[k+1]=y.g,f[k+2]=y.b)}}return T.setAttribute("position",new It(C,3)),T.setAttribute("normal",new It(b,3)),_&&(T.setAttribute("color",new It(f,3)),T.hasColors=!0,T.alpha=S),T}function r(l){const h=new Fe,d=/solid([\s\S]*?)endsolid/g,u=/facet([\s\S]*?)endfacet/g,m=/solid\s(.+)/;let g=0;const _=/[\s]+([+-]?(?:\d*)(?:\.\d*)?(?:[eE][+-]?\d+)?)/.source,f=new RegExp("vertex"+_+_+_,"g"),p=new RegExp("normal"+_+_+_,"g"),x=[],v=[],S=[],R=new L;let A,T=0,C=0,b=0;for(;(A=d.exec(l))!==null;){C=b;const y=A[0],P=(A=m.exec(y))!==null?A[1]:"";for(S.push(P);(A=u.exec(y))!==null;){let G=0,Z=0;const F=A[0];for(;(A=p.exec(F))!==null;)R.x=parseFloat(A[1]),R.y=parseFloat(A[2]),R.z=parseFloat(A[3]),Z++;for(;(A=f.exec(F))!==null;)x.push(parseFloat(A[1]),parseFloat(A[2]),parseFloat(A[3])),v.push(R.x,R.y,R.z),G++,b++;Z!==1&&console.error("THREE.STLLoader: Something isn't right with the normal of face number "+g),G!==3&&console.error("THREE.STLLoader: Something isn't right with the vertices of face number "+g),g++}const N=C,U=b-C;h.userData.groupNames=S,h.addGroup(N,U,T),T++}return h.setAttribute("position",new Ce(x,3)),h.setAttribute("normal",new Ce(v,3)),h}function o(l){return typeof l!="string"?new TextDecoder().decode(l):l}function a(l){if(typeof l=="string"){const h=new Uint8Array(l.length);for(let d=0;d<l.length;d++)h[d]=l.charCodeAt(d)&255;return h.buffer||h}else return l}const c=a(e);return t(c)?s(c):r(o(e))}}const cl={type:"change"},No={type:"start"},ll={type:"end"},ar=new Ur,hl=new _n,G_=Math.cos(70*Bn.DEG2RAD);class V_ extends hi{constructor(e,t){super(),this.object=e,this.domElement=t,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new L,this.cursor=new L,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:gn.ROTATE,MIDDLE:gn.DOLLY,RIGHT:gn.PAN},this.touches={ONE:In.ROTATE,TWO:In.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return a.phi},this.getAzimuthalAngle=function(){return a.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(M){M.addEventListener("keydown",ae),this._domElementKeyEvents=M},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ae),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(cl),n.update(),r=s.NONE},this.update=function(){const M=new L,Y=new Xt().setFromUnitVectors(e.up,new L(0,1,0)),z=Y.clone().invert(),q=new L,Q=new Xt,Se=new L,Pe=2*Math.PI;return function(ft=null){const $e=n.object.position;M.copy($e).sub(n.target),M.applyQuaternion(Y),a.setFromVector3(M),n.autoRotate&&r===s.NONE&&N(y(ft)),n.enableDamping?(a.theta+=c.theta*n.dampingFactor,a.phi+=c.phi*n.dampingFactor):(a.theta+=c.theta,a.phi+=c.phi);let mt=n.minAzimuthAngle,gt=n.maxAzimuthAngle;isFinite(mt)&&isFinite(gt)&&(mt<-Math.PI?mt+=Pe:mt>Math.PI&&(mt-=Pe),gt<-Math.PI?gt+=Pe:gt>Math.PI&&(gt-=Pe),mt<=gt?a.theta=Math.max(mt,Math.min(gt,a.theta)):a.theta=a.theta>(mt+gt)/2?Math.max(mt,a.theta):Math.min(gt,a.theta)),a.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,a.phi)),a.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(h,n.dampingFactor):n.target.add(h),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor);let Dt=!1;if(n.zoomToCursor&&A||n.object.isOrthographicCamera)a.radius=se(a.radius);else{const Nt=a.radius;a.radius=se(a.radius*l),Dt=Nt!=a.radius}if(M.setFromSpherical(a),M.applyQuaternion(z),$e.copy(n.target).add(M),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,h.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),h.set(0,0,0)),n.zoomToCursor&&A){let Nt=null;if(n.object.isPerspectiveCamera){const bn=M.length();Nt=se(bn*l);const Wn=bn-Nt;n.object.position.addScaledVector(S,Wn),n.object.updateMatrixWorld(),Dt=!!Wn}else if(n.object.isOrthographicCamera){const bn=new L(R.x,R.y,0);bn.unproject(n.object);const Wn=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),n.object.updateProjectionMatrix(),Dt=Wn!==n.object.zoom;const Xn=new L(R.x,R.y,0);Xn.unproject(n.object),n.object.position.sub(Xn).add(bn),n.object.updateMatrixWorld(),Nt=M.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;Nt!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(Nt).add(n.object.position):(ar.origin.copy(n.object.position),ar.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(ar.direction))<G_?e.lookAt(n.target):(hl.setFromNormalAndCoplanarPoint(n.object.up,n.target),ar.intersectPlane(hl,n.target))))}else if(n.object.isOrthographicCamera){const Nt=n.object.zoom;n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/l)),Nt!==n.object.zoom&&(n.object.updateProjectionMatrix(),Dt=!0)}return l=1,A=!1,Dt||q.distanceToSquared(n.object.position)>o||8*(1-Q.dot(n.object.quaternion))>o||Se.distanceToSquared(n.target)>o?(n.dispatchEvent(cl),q.copy(n.object.position),Q.copy(n.object.quaternion),Se.copy(n.target),!0):!1}}(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",ge),n.domElement.removeEventListener("pointerdown",ot),n.domElement.removeEventListener("pointercancel",E),n.domElement.removeEventListener("wheel",te),n.domElement.removeEventListener("pointermove",I),n.domElement.removeEventListener("pointerup",E),n.domElement.getRootNode().removeEventListener("keydown",xe,{capture:!0}),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ae),n._domElementKeyEvents=null)};const n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=s.NONE;const o=1e-6,a=new rl,c=new rl;let l=1;const h=new L,d=new K,u=new K,m=new K,g=new K,_=new K,f=new K,p=new K,x=new K,v=new K,S=new L,R=new K;let A=!1;const T=[],C={};let b=!1;function y(M){return M!==null?2*Math.PI/60*n.autoRotateSpeed*M:2*Math.PI/60/60*n.autoRotateSpeed}function P(M){const Y=Math.abs(M*.01);return Math.pow(.95,n.zoomSpeed*Y)}function N(M){c.theta-=M}function U(M){c.phi-=M}const G=function(){const M=new L;return function(z,q){M.setFromMatrixColumn(q,0),M.multiplyScalar(-z),h.add(M)}}(),Z=function(){const M=new L;return function(z,q){n.screenSpacePanning===!0?M.setFromMatrixColumn(q,1):(M.setFromMatrixColumn(q,0),M.crossVectors(n.object.up,M)),M.multiplyScalar(z),h.add(M)}}(),F=function(){const M=new L;return function(z,q){const Q=n.domElement;if(n.object.isPerspectiveCamera){const Se=n.object.position;M.copy(Se).sub(n.target);let Pe=M.length();Pe*=Math.tan(n.object.fov/2*Math.PI/180),G(2*z*Pe/Q.clientHeight,n.object.matrix),Z(2*q*Pe/Q.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(G(z*(n.object.right-n.object.left)/n.object.zoom/Q.clientWidth,n.object.matrix),Z(q*(n.object.top-n.object.bottom)/n.object.zoom/Q.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}}();function j(M){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l/=M:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function k(M){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?l*=M:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function ie(M,Y){if(!n.zoomToCursor)return;A=!0;const z=n.domElement.getBoundingClientRect(),q=M-z.left,Q=Y-z.top,Se=z.width,Pe=z.height;R.x=q/Se*2-1,R.y=-(Q/Pe)*2+1,S.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function se(M){return Math.max(n.minDistance,Math.min(n.maxDistance,M))}function he(M){d.set(M.clientX,M.clientY)}function we(M){ie(M.clientX,M.clientX),p.set(M.clientX,M.clientY)}function Le(M){g.set(M.clientX,M.clientY)}function $(M){u.set(M.clientX,M.clientY),m.subVectors(u,d).multiplyScalar(n.rotateSpeed);const Y=n.domElement;N(2*Math.PI*m.x/Y.clientHeight),U(2*Math.PI*m.y/Y.clientHeight),d.copy(u),n.update()}function ee(M){x.set(M.clientX,M.clientY),v.subVectors(x,p),v.y>0?j(P(v.y)):v.y<0&&k(P(v.y)),p.copy(x),n.update()}function fe(M){_.set(M.clientX,M.clientY),f.subVectors(_,g).multiplyScalar(n.panSpeed),F(f.x,f.y),g.copy(_),n.update()}function de(M){ie(M.clientX,M.clientY),M.deltaY<0?k(P(M.deltaY)):M.deltaY>0&&j(P(M.deltaY)),n.update()}function He(M){let Y=!1;switch(M.code){case n.keys.UP:M.ctrlKey||M.metaKey||M.shiftKey?U(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):F(0,n.keyPanSpeed),Y=!0;break;case n.keys.BOTTOM:M.ctrlKey||M.metaKey||M.shiftKey?U(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):F(0,-n.keyPanSpeed),Y=!0;break;case n.keys.LEFT:M.ctrlKey||M.metaKey||M.shiftKey?N(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):F(n.keyPanSpeed,0),Y=!0;break;case n.keys.RIGHT:M.ctrlKey||M.metaKey||M.shiftKey?N(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):F(-n.keyPanSpeed,0),Y=!0;break}Y&&(M.preventDefault(),n.update())}function Ie(M){if(T.length===1)d.set(M.pageX,M.pageY);else{const Y=Oe(M),z=.5*(M.pageX+Y.x),q=.5*(M.pageY+Y.y);d.set(z,q)}}function Ye(M){if(T.length===1)g.set(M.pageX,M.pageY);else{const Y=Oe(M),z=.5*(M.pageX+Y.x),q=.5*(M.pageY+Y.y);g.set(z,q)}}function D(M){const Y=Oe(M),z=M.pageX-Y.x,q=M.pageY-Y.y,Q=Math.sqrt(z*z+q*q);p.set(0,Q)}function Ze(M){n.enableZoom&&D(M),n.enablePan&&Ye(M)}function We(M){n.enableZoom&&D(M),n.enableRotate&&Ie(M)}function nt(M){if(T.length==1)u.set(M.pageX,M.pageY);else{const z=Oe(M),q=.5*(M.pageX+z.x),Q=.5*(M.pageY+z.y);u.set(q,Q)}m.subVectors(u,d).multiplyScalar(n.rotateSpeed);const Y=n.domElement;N(2*Math.PI*m.x/Y.clientHeight),U(2*Math.PI*m.y/Y.clientHeight),d.copy(u)}function ye(M){if(T.length===1)_.set(M.pageX,M.pageY);else{const Y=Oe(M),z=.5*(M.pageX+Y.x),q=.5*(M.pageY+Y.y);_.set(z,q)}f.subVectors(_,g).multiplyScalar(n.panSpeed),F(f.x,f.y),g.copy(_)}function qe(M){const Y=Oe(M),z=M.pageX-Y.x,q=M.pageY-Y.y,Q=Math.sqrt(z*z+q*q);x.set(0,Q),v.set(0,Math.pow(x.y/p.y,n.zoomSpeed)),j(v.y),p.copy(x);const Se=(M.pageX+Y.x)*.5,Pe=(M.pageY+Y.y)*.5;ie(Se,Pe)}function Ge(M){n.enableZoom&&qe(M),n.enablePan&&ye(M)}function De(M){n.enableZoom&&qe(M),n.enableRotate&&nt(M)}function ot(M){n.enabled!==!1&&(T.length===0&&(n.domElement.setPointerCapture(M.pointerId),n.domElement.addEventListener("pointermove",I),n.domElement.addEventListener("pointerup",E)),!ue(M)&&(Ve(M),M.pointerType==="touch"?Ne(M):X(M)))}function I(M){n.enabled!==!1&&(M.pointerType==="touch"?re(M):J(M))}function E(M){switch(Ae(M),T.length){case 0:n.domElement.releasePointerCapture(M.pointerId),n.domElement.removeEventListener("pointermove",I),n.domElement.removeEventListener("pointerup",E),n.dispatchEvent(ll),r=s.NONE;break;case 1:const Y=T[0],z=C[Y];Ne({pointerId:Y,pageX:z.x,pageY:z.y});break}}function X(M){let Y;switch(M.button){case 0:Y=n.mouseButtons.LEFT;break;case 1:Y=n.mouseButtons.MIDDLE;break;case 2:Y=n.mouseButtons.RIGHT;break;default:Y=-1}switch(Y){case gn.DOLLY:if(n.enableZoom===!1)return;we(M),r=s.DOLLY;break;case gn.ROTATE:if(M.ctrlKey||M.metaKey||M.shiftKey){if(n.enablePan===!1)return;Le(M),r=s.PAN}else{if(n.enableRotate===!1)return;he(M),r=s.ROTATE}break;case gn.PAN:if(M.ctrlKey||M.metaKey||M.shiftKey){if(n.enableRotate===!1)return;he(M),r=s.ROTATE}else{if(n.enablePan===!1)return;Le(M),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(No)}function J(M){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;$(M);break;case s.DOLLY:if(n.enableZoom===!1)return;ee(M);break;case s.PAN:if(n.enablePan===!1)return;fe(M);break}}function te(M){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(M.preventDefault(),n.dispatchEvent(No),de(ne(M)),n.dispatchEvent(ll))}function ne(M){const Y=M.deltaMode,z={clientX:M.clientX,clientY:M.clientY,deltaY:M.deltaY};switch(Y){case 1:z.deltaY*=16;break;case 2:z.deltaY*=100;break}return M.ctrlKey&&!b&&(z.deltaY*=10),z}function xe(M){M.key==="Control"&&(b=!0,n.domElement.getRootNode().addEventListener("keyup",ce,{passive:!0,capture:!0}))}function ce(M){M.key==="Control"&&(b=!1,n.domElement.getRootNode().removeEventListener("keyup",ce,{passive:!0,capture:!0}))}function ae(M){n.enabled===!1||n.enablePan===!1||He(M)}function Ne(M){switch(Ue(M),T.length){case 1:switch(n.touches.ONE){case In.ROTATE:if(n.enableRotate===!1)return;Ie(M),r=s.TOUCH_ROTATE;break;case In.PAN:if(n.enablePan===!1)return;Ye(M),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case In.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Ze(M),r=s.TOUCH_DOLLY_PAN;break;case In.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;We(M),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(No)}function re(M){switch(Ue(M),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;nt(M),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;ye(M),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Ge(M),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;De(M),n.update();break;default:r=s.NONE}}function ge(M){n.enabled!==!1&&M.preventDefault()}function Ve(M){T.push(M.pointerId)}function Ae(M){delete C[M.pointerId];for(let Y=0;Y<T.length;Y++)if(T[Y]==M.pointerId){T.splice(Y,1);return}}function ue(M){for(let Y=0;Y<T.length;Y++)if(T[Y]==M.pointerId)return!0;return!1}function Ue(M){let Y=C[M.pointerId];Y===void 0&&(Y=new K,C[M.pointerId]=Y),Y.set(M.pageX,M.pageY)}function Oe(M){const Y=M.pointerId===T[0]?T[1]:T[0];return C[Y]}n.domElement.addEventListener("contextmenu",ge),n.domElement.addEventListener("pointerdown",ot),n.domElement.addEventListener("pointercancel",E),n.domElement.addEventListener("wheel",te,{passive:!1}),n.domElement.getRootNode().addEventListener("keydown",xe,{passive:!0,capture:!0}),this.update()}}class $t{static addAxisLabel(e,t,n,s,r){const o=document.createElement("canvas");o.width=64,o.height=64;const a=o.getContext("2d");a.font="bold 48px Orbitron, monospace",a.fillStyle=s,a.textAlign="center",a.textBaseline="middle",a.fillText(t,32,32);const c=new qo(o);r.push(c);const l=new Zo({map:c,depthTest:!1}),h=new To(l);h.position.copy(n),h.scale.set(1,1,1),e.add(h)}static setLastSpriteScale(e,t){const n=e.children;for(let s=n.length-1;s>=0;s--)if(n[s]instanceof To){n[s].scale.set(t,t,t);break}}static addTickSprite(e,t,n,s,r,o){const a=document.createElement("canvas");a.width=128,a.height=64;const c=a.getContext("2d");c.font="bold 26px Orbitron, monospace",c.textAlign="center",c.textBaseline="middle",c.fillStyle=s==="x"?"rgba(255,120,100,0.85)":s==="z"?"rgba(100,180,255,0.85)":"rgba(220,230,255,0.7)",c.fillText(t,64,32);const l=new qo(a);o.push(l);const h=new Zo({map:l,depthTest:!1,transparent:!0}),d=new To(h);d.position.copy(n);const u=r*.05;d.scale.set(u,u*.5,1),e.add(d)}static addGridTicks(e,t,n,s,r,o){for(let a=-n;a<=n;a+=t)a!==0&&($t.addTickSprite(e,String(a),new L(a,0,s),"x",r,o),$t.addTickSprite(e,String(a),new L(s,0,a),"z",r,o));$t.addTickSprite(e,"0",new L(s,0,s),"o",r,o)}}const Ni={x:0,y:0,z:0};class bh{constructor(e,t){W(this,"el");W(this,"canvasWrap");W(this,"topBar");W(this,"overlayEl");W(this,"storageKey");W(this,"scene",null);W(this,"camera",null);W(this,"renderer",null);W(this,"controls",null);W(this,"savedTarget",new L);W(this,"rafId",0);W(this,"ro");W(this,"textures",[]);W(this,"lastFrameTime",0);W(this,"loop",e=>{this.rafId=requestAnimationFrame(this.loop);const t=this.lastFrameTime?e-this.lastFrameTime:0;this.lastFrameTime=e;const n=this.canvasWrap.clientWidth,s=this.canvasWrap.clientHeight;if(n===0||s===0)return;const r=this.renderer,o=r.domElement;(o.width!==n||o.height!==s)&&(r.setSize(n,s,!1),this.camera.aspect=n/s,this.camera.updateProjectionMatrix()),this.onTick(t),this.controls.update(),r.render(this.scene,this.camera)});this.opts=t,this.storageKey=`bey_view_${t.title.toLowerCase().replace(/\s+/g,"_")}`,this.el=document.createElement("div"),this.el.className="screen sandbox-screen hidden",this.canvasWrap=document.createElement("div"),this.canvasWrap.className="sandbox-canvas-wrap",this.el.appendChild(this.canvasWrap);const n=document.createElement("div");n.className="sandbox-overlay",n.innerHTML=`
      <div class="sandbox-top-bar">
        <button class="game-btn back-btn"  id="sb-back">← Back</button>
        <span  class="sandbox-title">${t.title}</span>
        <button class="game-btn reset-btn" id="sb-reset" title="Reset camera view to default">↺ View</button>
      </div>
      <div class="sandbox-hint">Orbit · Left drag &nbsp;|&nbsp; Pan · Right drag &nbsp;|&nbsp; Zoom · Scroll</div>
    `,this.el.appendChild(n),e.appendChild(this.el),this.overlayEl=n,this.topBar=n.querySelector(".sandbox-top-bar"),n.querySelector("#sb-back").addEventListener("click",()=>t.onBack()),n.querySelector("#sb-reset").addEventListener("click",()=>this.resetView()),this.ro=new ResizeObserver(()=>this.resize())}addTopBarButton(e,t=""){const n=document.createElement("button");return n.className="game-btn",n.textContent=e,n.title=t,this.topBar.appendChild(n),n}getScene(){return this.scene}getCamera(){return this.camera}getControls(){return this.controls}getRendererCanvas(){var e;return((e=this.renderer)==null?void 0:e.domElement)??null}addToScene(...e){e.forEach(t=>{var n;return(n=this.scene)==null?void 0:n.add(t)})}removeFromScene(...e){e.forEach(t=>{var n;return(n=this.scene)==null?void 0:n.remove(t)})}addOverlayPanel(e){const t=document.createElement("div");return t.className=e,this.overlayEl.appendChild(t),t}initScene(){if(this.scene)return;this.scene=new j0;const{defaultCam:e,camFar:t}=this.opts;this.camera=new Bt(55,1,.1,t),this.camera.position.set(e.x,e.y,e.z),this.camera.lookAt(0,0,0),this.buildScene()}mountRenderer(){this.renderer=new q0({antialias:!0,stencil:!0}),this.renderer.setPixelRatio(Math.min(window.devicePixelRatio,2)),this.renderer.setClearColor(526351),this.canvasWrap.appendChild(this.renderer.domElement),this.controls=new V_(this.camera,this.renderer.domElement),this.controls.enableDamping=!0,this.controls.dampingFactor=.07,this.controls.screenSpacePanning=!0,this.controls.minDistance=this.opts.minZoom,this.controls.maxDistance=this.opts.maxZoom,this.controls.mouseButtons={LEFT:gn.ROTATE,MIDDLE:gn.DOLLY,RIGHT:gn.PAN},this.controls.touches={ONE:In.ROTATE,TWO:In.DOLLY_PAN},this.loadView(),this.lastFrameTime=0}unmountRenderer(){this.saveView(),this.controls&&(this.savedTarget.copy(this.controls.target),this.controls.dispose(),this.controls=null),this.renderer&&(this.renderer.domElement.remove(),this.renderer.dispose(),this.renderer=null)}saveView(){if(!this.camera||!this.controls)return;const e={camX:this.camera.position.x,camY:this.camera.position.y,camZ:this.camera.position.z,tgtX:this.controls.target.x,tgtY:this.controls.target.y,tgtZ:this.controls.target.z};localStorage.setItem(this.storageKey,JSON.stringify(e))}loadView(){if(!(!this.camera||!this.controls))try{const e=localStorage.getItem(this.storageKey);if(!e)return;const t=JSON.parse(e);this.camera.position.set(t.camX,t.camY,t.camZ),this.controls.target.set(t.tgtX,t.tgtY,t.tgtZ),this.controls.update()}catch{}}resetView(){var t;localStorage.removeItem(this.storageKey);const{defaultCam:e}=this.opts;(t=this.camera)==null||t.position.set(e.x,e.y,e.z),this.controls&&(this.controls.target.set(Ni.x,Ni.y,Ni.z),this.controls.update()),this.savedTarget.set(Ni.x,Ni.y,Ni.z)}buildCustom(e){}buildScene(){const e=this.scene,{gridSize:t,gridDivs:n,tickEvery:s,tickRange:r,accentHex:o}=this.opts;e.add(new ol(t,n,o,2763338));const a=new ol(t,n,2763338,1710638);a.rotation.x=Math.PI/2,a.position.set(0,t/2,-t/2),e.add(a);const c=t/2*.25,l=this.opts.axisYOffset??0,h=new zt;h.position.set(0,l,0),h.add(new H_(c)),e.add(h);const d=t/2*.32;$t.addAxisLabel(e,"X",new L(d,l+c*.1,0),"#ff4d4d",this.textures),$t.addAxisLabel(e,"Y",new L(c*.1,l+d,0),"#4dff88",this.textures),$t.addAxisLabel(e,"Z",new L(0,l+c*.1,d),"#4db8ff",this.textures);const u=t/2*.07;$t.setLastSpriteScale(e,u),$t.setLastSpriteScale(e,u),$t.setLastSpriteScale(e,u);const m=Math.max(.1,t*.018);$t.addGridTicks(e,s,r,m,t,this.textures);const g=Math.max(.1,t*.001);e.add(new Be(new ui(g,12,12),new Qt({color:o}))),e.add(new z_(16777215,.5));const _=new B_(16777215,1);_.position.set(t*.3,t*.5,t*.3),e.add(_);const f=t*.2,p=new O_(o,2,f);p.position.set(0,t*.05,0),e.add(p),this.buildCustom(e)}resize(){if(!this.renderer||!this.camera)return;const e=this.canvasWrap.clientWidth,t=this.canvasWrap.clientHeight;e===0||t===0||(this.renderer.setSize(e,t,!1),this.camera.aspect=e/t,this.camera.updateProjectionMatrix())}onTick(e){}setVisible(e){this.el.classList.toggle("hidden",!e),e?(this.initScene(),this.mountRenderer(),this.ro.observe(this.canvasWrap),this.rafId=requestAnimationFrame(this.loop)):(cancelAnimationFrame(this.rafId),this.ro.disconnect(),this.unmountRenderer())}dispose(){var e;cancelAnimationFrame(this.rafId),this.ro.disconnect(),this.unmountRenderer(),(e=this.scene)==null||e.traverse(t=>{const n=t;if(n.geometry&&n.geometry.dispose(),n.material){const s=Array.isArray(n.material)?n.material:[n.material];for(const r of s){for(const o of Object.values(r))o instanceof At&&o.dispose();r.dispose()}}});for(const t of this.textures)t.dispose();this.textures.length=0,this.scene=null,this.camera=null,this.el.remove()}}const dl={tiltAngle:0,pivotOffset:0,spinDir:"right"};class W_{constructor(){W(this,"axis",{...dl});W(this,"parts",new Map);W(this,"sectors",new Map);W(this,"groups",new Map);W(this,"rootChildIds",[]);W(this,"_partSeq",0);W(this,"_sectorSeq",0);W(this,"_groupSeq",0)}getAxis(){return this.axis}setAxis(e){Object.assign(this.axis,e)}getPart(e){const t=this.parts.get(e);if(!t)throw new Error(`Part not found: ${e}`);return t}getAllParts(){return[...this.parts.values()]}hasPart(e){return this.parts.has(e)}findPartOfSector(e){for(const[t,n]of this.parts)if(n.sectorIds.includes(e))return t;return null}addPart(e){this.parts.set(e.id,e)}updatePart(e,t){const n=this.getPart(e);Object.assign(n,t)}removePart(e){this.parts.delete(e)}getSector(e){const t=this.sectors.get(e);if(!t)throw new Error(`Sector not found: ${e}`);return t}hasSector(e){return this.sectors.has(e)}addSector(e){this.sectors.set(e.id,e)}updateSector(e,t){const n=this.getSector(e);Object.assign(n,t)}removeSector(e){this.sectors.delete(e)}getGroup(e){const t=this.groups.get(e);if(!t)throw new Error(`Group not found: ${e}`);return t}getAllGroups(){return[...this.groups.values()]}hasGroup(e){return this.groups.has(e)}addGroup(e){this.groups.set(e.id,e)}updateGroup(e,t){const n=this.getGroup(e);Object.assign(n,t)}removeGroup(e){this.groups.delete(e)}getRootChildIds(){return this.rootChildIds}setRootChildIds(e){this.rootChildIds=[...e]}addToRoot(e){this.rootChildIds.includes(e)||this.rootChildIds.push(e)}removeFromRoot(e){this.rootChildIds=this.rootChildIds.filter(t=>t!==e)}nextPartId(){return`part-${++this._partSeq}`}nextSectorId(){return`sector-${++this._sectorSeq}`}nextGroupId(){return`group-${++this._groupSeq}`}serialize(){return{axis:{...this.axis},rootChildIds:[...this.rootChildIds],groups:[...this.groups.values()].map(e=>({...e,childIds:[...e.childIds]})),parts:[...this.parts.values()].map(e=>({...e,sectorIds:[...e.sectorIds]})),sectors:[...this.sectors.values()].map(e=>({...e})),partSeq:this._partSeq,sectorSeq:this._sectorSeq,groupSeq:this._groupSeq}}deserialize(e){this.axis={...e.axis},this.parts.clear(),this.sectors.clear(),this.groups.clear();for(const t of e.parts)this.parts.set(t.id,{...t,sectorIds:[...t.sectorIds]});for(const t of e.sectors)this.sectors.set(t.id,{...t});for(const t of e.groups)this.groups.set(t.id,{...t,childIds:[...t.childIds]});this.rootChildIds=[...e.rootChildIds],this._partSeq=e.partSeq,this._sectorSeq=e.sectorSeq,this._groupSeq=e.groupSeq}reset(){this.axis={...dl},this.parts.clear(),this.sectors.clear(),this.groups.clear(),this.rootChildIds=[],this._partSeq=0,this._sectorSeq=0,this._groupSeq=0}}const X_=50;class Y_{constructor(){W(this,"undoStack",[]);W(this,"redoStack",[]);W(this,"onStackChange")}execute(e){var t;e.execute(),this.undoStack.push(e),this.undoStack.length>X_&&this.undoStack.shift(),this.redoStack=[],(t=this.onStackChange)==null||t.call(this)}undo(){var t;const e=this.undoStack.pop();e&&(e.undo(),this.redoStack.push(e),(t=this.onStackChange)==null||t.call(this))}redo(){var t;const e=this.redoStack.pop();e&&(e.execute(),this.undoStack.push(e),(t=this.onStackChange)==null||t.call(this))}get canUndo(){return this.undoStack.length>0}get canRedo(){return this.redoStack.length>0}clear(){var e;this.undoStack=[],this.redoStack=[],(e=this.onStackChange)==null||e.call(this)}}function da(i){return Math.max(8,Math.ceil(Math.abs(i)/5))}function Fi(i,e,t,n,s,r,o){const a=s-n;for(let c=0;c<=o;c++){const l=Bn.degToRad(n+a*(c/o));i.push(e*Math.cos(l),r,t*Math.sin(l))}}function Eh(i,e,t,n,s){for(let r=0;r<s;r++){const o=t+r,a=o+1,c=n+r,l=c+1;e.push(o,a,l,o,l,c)}}function ul(i,e,t,n,s,r){for(let o=0;o<s;o++){const a=n+o,c=a+1;r?e.push(t,c,a):e.push(t,a,c)}}function pl(i,e,t,n,s){for(let r=0;r<n;r++){const o=e+r,a=o+1,c=t+r,l=c+1;s?i.push(o,c,l,o,l,a):i.push(o,a,l,o,l,c)}}function Ah(i,e){const t=new Fe;return t.setAttribute("position",new Ce(i,3)),t.setIndex(e),t.computeVertexNormals(),t}class Z_{buildMeshGeometry(e){const{startAngle:t,endAngle:n,height:s,topRadiusX:r,topRadiusZ:o,bottomRadiusX:a,bottomRadiusZ:c}=e,l=n-t,h=Math.abs(l)>=359.9,d=da(l),u=[],m=[],g=0;Fi(u,a,c,t,n,0,d);const _=d+1;Fi(u,r,o,t,n,s,d),Eh(u,m,g,_,d);const f=u.length/3;u.push(0,0,0);const p=u.length/3;if(u.push(0,s,0),ul(u,m,f,g,d,!0),ul(u,m,p,_,d,!1),!h){const x=g,v=_;m.push(f,x,v,f,v,p);const S=g+d,R=_+d;m.push(f,p,R,f,R,S)}return Ah(u,m)}buildEdgeGeometry(e){return Th(e,!1)}}class q_{buildMeshGeometry(e){const{startAngle:t,endAngle:n,height:s,topRadiusX:r,topRadiusZ:o,bottomRadiusX:a,bottomRadiusZ:c,innerTopRadiusX:l,innerTopRadiusZ:h,innerBottomRadiusX:d,innerBottomRadiusZ:u}=e,m=n-t,g=Math.abs(m)>=359.9,_=da(m),f=[],p=[],x=0;Fi(f,a,c,t,n,0,_);const v=_+1;Fi(f,r,o,t,n,s,_);const S=2*(_+1);Fi(f,d,u,t,n,0,_);const R=3*(_+1);Fi(f,l,h,t,n,s,_),Eh(f,p,x,v,_);for(let A=0;A<_;A++){const T=S+A,C=T+1,b=R+A,y=b+1;p.push(T,b,y,T,y,C)}if(pl(p,x,S,_,!0),pl(p,v,R,_,!1),!g){p.push(x,S,R,x,R,v);const A=x+_,T=S+_,C=v+_,b=R+_;p.push(A,C,b,A,b,T)}return Ah(f,p)}buildEdgeGeometry(e){return Th(e,!0)}}function Th(i,e){const{startAngle:t,endAngle:n,height:s,topRadiusX:r,topRadiusZ:o,bottomRadiusX:a,bottomRadiusZ:c,innerTopRadiusX:l,innerTopRadiusZ:h,innerBottomRadiusX:d,innerBottomRadiusZ:u}=i,m=n-t,g=Math.abs(m)>=359.9,_=da(m),f=[];function p(R,A,T){let C=Bn.degToRad(t),b=Math.cos(C),y=Math.sin(C);for(let P=1;P<=_;P++){const N=Bn.degToRad(t+m*(P/_)),U=Math.cos(N),G=Math.sin(N);f.push(R*b,T,A*y,R*U,T,A*G),b=U,y=G}}function x(R,A,T,C,b){for(const y of b){const P=Bn.degToRad(y);f.push(R*Math.cos(P),0,A*Math.sin(P)),f.push(T*Math.cos(P),s,C*Math.sin(P))}}const v=g?[t,t+90,t+180,t+270]:[t,n];p(a,c,0),p(r,o,s),x(a,c,r,o,v),e&&(p(d,u,0),p(l,h,s),x(d,u,l,h,v));const S=new Fe;return S.setAttribute("position",new Ce(f,3)),S}const j_=new Z_,$_=new q_;function cr(i){return i?$_:j_}const K_=58879,J_=16777215,Q_=16739125,ev=2763338,fl=.05;function ml(i){return{id:i.id,name:i.name,startAngle:0,endAngle:360,height:i.height,topRadiusX:i.topRadiusX,topRadiusZ:i.topRadiusZ,bottomRadiusX:i.bottomRadiusX,bottomRadiusZ:i.bottomRadiusZ,isHollow:i.isHollow,innerTopRadiusX:i.innerTopRadiusX,innerTopRadiusZ:i.innerTopRadiusZ,innerBottomRadiusX:i.innerBottomRadiusX,innerBottomRadiusZ:i.innerBottomRadiusZ,material:i.material,weight:i.weight,color:i.color}}class tv{constructor(e,t){W(this,"pivotAnchor",new zt);W(this,"axisRoot",new zt);W(this,"spinGroup",new zt);W(this,"freeSpinGroup",new zt);W(this,"axisLine");W(this,"pivotMarker");W(this,"groundDisc");W(this,"partObjects",new Map);W(this,"viewMode","hitbox");W(this,"sharedEdgeMat",new kt({color:J_,transparent:!0,opacity:.35}));this.scene=e,this.store=t,this.pivotAnchor.add(this.axisRoot),this.axisRoot.add(this.spinGroup,this.freeSpinGroup),e.add(this.pivotAnchor);const n=new Sn(fl,fl,40,12),s=new Qt({color:K_,transparent:!0,opacity:.5});this.axisLine=new Be(n,s);const r=new ui(.3,12,12),o=new Qt({color:Q_});this.pivotMarker=new Be(r,o);const a=new Sn(1.5,1.5,.05,32),c=new Qt({color:ev,transparent:!0,opacity:.6});this.groundDisc=new Be(a,c),this.axisRoot.add(this.axisLine,this.pivotMarker,this.groundDisc),this.rebuildAxis()}setAxisPose(e,t){this.pivotAnchor.position.y=t,this.pivotAnchor.rotation.x=Bn.degToRad(e),this.axisRoot.position.y=-t,this.pivotMarker.position.y=t,this.groundDisc.position.y=0}rebuildAxis(){const e=this.store.getAxis();this.setAxisPose(e.tiltAngle,e.pivotOffset)}rebuildPart(e){this._disposePartObjects(e);const t=this.store.getPart(e),n=this._buildHitboxMesh(t),s=this._buildHitboxEdges(t),r=null;n.position.y=t.axisOffsetY,s.position.y=t.axisOffsetY;const o=t.freeSpin?"free":"spin";(o==="free"?this.freeSpinGroup:this.spinGroup).add(n,s),this.partObjects.set(e,{hitboxMesh:n,hitboxEdges:s,presentMesh:r,owner:o}),this._applyViewMode(e)}rebuildSector(e){const t=this.store.findPartOfSector(e);t&&this.rebuildPart(t)}removePart(e){this._disposePartObjects(e)}updateSpinGroups(){for(const e of this.store.getAllParts()){const t=this.partObjects.get(e.id);if(!t)continue;const n=e.freeSpin?"free":"spin";if(t.owner===n)continue;const s=t.owner==="free"?this.freeSpinGroup:this.spinGroup,r=n==="free"?this.freeSpinGroup:this.spinGroup;s.remove(t.hitboxMesh,t.hitboxEdges),t.presentMesh&&s.remove(t.presentMesh),r.add(t.hitboxMesh,t.hitboxEdges),t.presentMesh&&r.add(t.presentMesh),t.owner=n}}setViewMode(e){this.viewMode=e;for(const t of this.partObjects.keys())this._applyViewMode(t)}setPartVisible(e,t){const n=this.partObjects.get(e);n&&(n.hitboxMesh.visible=t&&this.viewMode!=="present",n.hitboxEdges.visible=t&&this.viewMode!=="present",n.presentMesh&&(n.presentMesh.visible=t&&this.viewMode!=="hitbox"))}dispose(){for(const e of[...this.partObjects.keys()])this._disposePartObjects(e);this.scene.remove(this.pivotAnchor),this._disposeMeshObj(this.axisLine),this._disposeMeshObj(this.pivotMarker),this._disposeMeshObj(this.groundDisc),this.sharedEdgeMat.dispose()}_buildHitboxMesh(e){if(e.sectorIds.length===0){const s=cr(e.isHollow).buildMeshGeometry(ml(e)),r=new ri({color:e.color,side:Et,roughness:.6,metalness:e.material==="metal"?.6:.1});return new Be(s,r)}const t=new zt;for(const n of e.sectorIds){const s=this.store.getSector(n),o=cr(s.isHollow).buildMeshGeometry(s),a=new ri({color:s.color,side:Et,roughness:.6,metalness:s.material==="metal"?.6:.1}),c=new Be(o,a);c.userData.sectorId=n,t.add(c)}return t}_buildHitboxEdges(e){if(e.sectorIds.length===0){const s=cr(e.isHollow).buildEdgeGeometry(ml(e));return new Yt(s,this.sharedEdgeMat)}const t=new zt;for(const n of e.sectorIds){const s=this.store.getSector(n),o=cr(s.isHollow).buildEdgeGeometry(s);t.add(new Yt(o,this.sharedEdgeMat))}return t}loadPresentationSTL(e,t){const n=this.store.getPart(e),s=this.partObjects.get(e);if(!s)return;s.presentMesh&&((s.owner==="free"?this.freeSpinGroup:this.spinGroup).remove(s.presentMesh),this._disposeMeshObj(s.presentMesh));const r=new ri({color:n.presentationColor,side:Et,roughness:.5,metalness:.1}),o=new Be(t,r);o.position.y=n.axisOffsetY,(s.owner==="free"?this.freeSpinGroup:this.spinGroup).add(o),s.presentMesh=o,this._applyViewMode(e)}_applyViewMode(e){const t=this.partObjects.get(e);if(!t)return;const n=this.viewMode!=="present",s=this.viewMode!=="hitbox";t.hitboxMesh.visible=n,t.hitboxEdges.visible=n,t.presentMesh&&(t.presentMesh.visible=s)}_disposePartObjects(e){const t=this.partObjects.get(e);if(!t)return;const n=t.owner==="free"?this.freeSpinGroup:this.spinGroup;n.remove(t.hitboxMesh,t.hitboxEdges),this._disposeMeshObj(t.hitboxMesh),this._disposeEdgeObj(t.hitboxEdges),t.presentMesh&&(n.remove(t.presentMesh),this._disposeMeshObj(t.presentMesh)),this.partObjects.delete(e)}_disposeMeshObj(e){e.traverse(t=>{const n=t;n.geometry&&n.geometry.dispose(),n.material&&(Array.isArray(n.material)?n.material:[n.material]).forEach(r=>r.dispose())})}_disposeEdgeObj(e){e.traverse(t=>{const n=t;n.geometry&&n.geometry.dispose()})}}const nv=300;class iv{constructor(e){W(this,"spinning",!1);W(this,"angle",0);W(this,"_scratchDir",new L);this.renderer=e}startSpin(){this.spinning=!0}stopSpin(){this.spinning=!1}get isSpinning(){return this.spinning}setTiltAngle(e,t){this.renderer.setAxisPose(e,t)}tick(e,t){if(!this.spinning||e<=0)return;const n=nv/60*2*Math.PI*(e/1e3);this.angle+=t==="right"?n:-n,this.renderer.spinGroup.rotation.y=this.angle}resetAngle(){this.angle=0,this.renderer.spinGroup.rotation.y=0}orientTiltToCamera(e){const t=this._scratchDir;if(e.getWorldDirection(t),t.y=0,t.lengthSq()<1e-4)return;t.normalize();const n=Math.atan2(t.x,t.z);this.renderer.axisRoot.rotation.y=n}}class wh{constructor(e){W(this,"bodyEl");W(this,"headerEl");W(this,"nodes",new Map);W(this,"sel",new Set);W(this,"dragId",null);W(this,"dropTarget",null);W(this,"ctxMenu");W(this,"idSeq",0);W(this,"nodeActions",new Map);W(this,"onDelete",()=>{});W(this,"onGroup",()=>{});W(this,"onCombine",()=>{});W(this,"onReparent",()=>{});W(this,"onSelect",()=>{});W(this,"onVisibilityToggle",()=>{});this.container=e,e.innerHTML=`
      <div class="scene-tree-header"><span class="scene-tree-header-title">SCENE</span></div>
      <div class="scene-tree-body"></div>
    `,this.headerEl=e.querySelector(".scene-tree-header"),this.bodyEl=e.querySelector(".scene-tree-body"),this.ctxMenu=document.createElement("div"),this.ctxMenu.className="tree-ctx-menu hidden",document.body.appendChild(this.ctxMenu),document.addEventListener("pointerdown",t=>{this.ctxMenu.contains(t.target)||this.hideCtx()}),document.addEventListener("keydown",t=>{t.key==="Delete"&&this.deleteSelected(),t.key==="Escape"&&this.clearSel()})}get header(){return this.headerEl}add(e,t,n,s=null,r){const o=document.createElement("div");o.className="tree-node",o.dataset.id=e;const a=document.createElement("div");a.className="tree-node-row",a.draggable=!0,a.style.setProperty("--depth",String(this.depthOf(s)));const c=document.createElement("span");c.className="tree-caret";const l=document.createElement("span");l.className="tree-node-icon",l.textContent=n;const h=document.createElement("span");if(h.className="tree-node-label",h.textContent=t,a.appendChild(c),a.appendChild(l),a.appendChild(h),r!=null&&r.onAddChild){const g=document.createElement("button");g.className="tree-add-btn",g.textContent="+",g.title="Add arena",g.addEventListener("click",_=>{_.stopPropagation(),r.onAddChild()}),a.appendChild(g)}if(r!=null&&r.addChildButtons)for(const g of r.addChildButtons){const _=document.createElement("button");_.className=`tree-add-btn${g.className?" "+g.className:""}`,_.textContent=g.label,_.title=g.title,_.addEventListener("click",f=>{f.stopPropagation(),g.onClick()}),a.appendChild(_)}const d=document.createElement("button");d.className="tree-vis-btn",d.textContent="👁",d.title="Toggle visibility",d.tabIndex=-1,a.appendChild(d);const u=document.createElement("div");u.className="tree-children",o.appendChild(a),o.appendChild(u);const m={id:e,label:t,icon:n,parentId:s,childIds:[],expanded:!0,rowEl:a,childrenEl:u,nodeEl:o};if(this.nodes.set(e,m),s){const g=this.nodes.get(s);g&&(g.childIds.push(e),g.childrenEl.appendChild(o),this.refreshCaret(g))}else this.bodyEl.appendChild(o);this.wireRow(m,d)}remove(e){const t=this.nodes.get(e);if(t){if([...t.childIds].forEach(n=>this.remove(n)),t.parentId){const n=this.nodes.get(t.parentId);n&&(n.childIds=n.childIds.filter(s=>s!==e),this.refreshCaret(n))}t.nodeEl.remove(),this.nodes.delete(e),this.sel.delete(e),this.nodeActions.delete(e)}}setLabel(e,t){const n=this.nodes.get(e);if(!n)return;n.label=t;const s=n.rowEl.querySelector(".tree-node-label");s&&(s.textContent=t)}setNodeActions(e,t){this.nodeActions.set(e,t)}select(e,t){var n,s;t||(this.sel.forEach(r=>{var o;return(o=this.nodes.get(r))==null?void 0:o.rowEl.classList.remove("tree-node--selected")}),this.sel.clear()),this.sel.has(e)&&t?(this.sel.delete(e),(n=this.nodes.get(e))==null||n.rowEl.classList.remove("tree-node--selected")):(this.sel.add(e),(s=this.nodes.get(e))==null||s.rowEl.classList.add("tree-node--selected")),this.onSelect([...this.sel])}clearSel(){this.sel.forEach(e=>{var t;return(t=this.nodes.get(e))==null?void 0:t.rowEl.classList.remove("tree-node--selected")}),this.sel.clear(),this.onSelect([])}showCtx(e,t,n){this.sel.has(n)||this.select(n,!1);const s=[...this.sel],r=this.nodeActions.get(n)??[],o=[{label:"Delete",action:()=>this.deleteSelected()},{label:"Group",action:()=>this.groupSelected(),disabled:s.length<1},{label:"Combine",action:()=>this.combineSelected(),disabled:s.length<2}];this.ctxMenu.innerHTML="";const a=l=>l.forEach(h=>{const d=document.createElement("button");d.className="tree-ctx-item",d.textContent=h.label,h.disabled&&(d.disabled=!0),d.addEventListener("click",()=>{h.action(),this.hideCtx()}),this.ctxMenu.appendChild(d)});if(a(r),r.length){const l=document.createElement("div");l.className="tree-ctx-sep",this.ctxMenu.appendChild(l)}a(o),this.ctxMenu.classList.remove("hidden");const c=this.ctxMenu.getBoundingClientRect();this.ctxMenu.style.left=`${Math.min(e,window.innerWidth-c.width-8)}px`,this.ctxMenu.style.top=`${Math.min(t,window.innerHeight-c.height-8)}px`}hideCtx(){this.ctxMenu.classList.add("hidden")}deleteSelected(){const e=[...this.sel];e.length&&(e.forEach(t=>this.remove(t)),this.onDelete(e))}groupSelected(){const e=[...this.sel];if(!e.length)return;const t=`group-${++this.idSeq}`;this.add(t,"Group","▣",this.nodes.get(e[0]).parentId??null),e.forEach(n=>this.reparentTo(n,t)),this.clearSel(),this.select(t,!1),this.onGroup(t,e)}combineSelected(){const e=[...this.sel];e.length<2||this.onCombine(e)}refreshCaret(e){const t=e.rowEl.querySelector(".tree-caret");t&&(t.textContent=e.childIds.length===0?"":e.expanded?"▾":"▸")}toggleExpand(e){const t=this.nodes.get(e);!t||!t.childIds.length||(t.expanded=!t.expanded,t.childrenEl.classList.toggle("tree-children--collapsed",!t.expanded),this.refreshCaret(t))}wireRow(e,t){const{rowEl:n,id:s}=e;n.addEventListener("click",o=>{const a=o.target;a.classList.contains("tree-caret")?this.toggleExpand(s):!a.classList.contains("tree-vis-btn")&&!a.classList.contains("tree-add-btn")&&this.select(s,o.ctrlKey||o.metaKey)});let r=!0;t.addEventListener("click",o=>{o.stopPropagation(),r=!r,t.textContent=r?"👁":"🚫",t.classList.toggle("hidden-obj",!r),this.onVisibilityToggle(s,r),this.cascadeVisibility(s,r)}),n.addEventListener("contextmenu",o=>{o.preventDefault(),this.showCtx(o.clientX,o.clientY,s)}),n.addEventListener("dragstart",o=>{this.dragId=s,o.dataTransfer.effectAllowed="move",n.classList.add("tree-node--dragging")}),n.addEventListener("dragend",()=>{this.dragId=null,n.classList.remove("tree-node--dragging"),this.clearDrop()}),n.addEventListener("dragover",o=>{if(!this.dragId||this.dragId===s)return;o.preventDefault(),o.dataTransfer.dropEffect="move";const a=(o.clientY-n.getBoundingClientRect().top)/n.getBoundingClientRect().height,c=a<.28?"before":a>.72?"after":"inside";this.clearDrop(),this.dropTarget={id:s,pos:c},n.classList.add(`tree-drop-${c}`)}),n.addEventListener("dragleave",()=>this.clearDrop()),n.addEventListener("drop",o=>{if(o.preventDefault(),!this.dragId||!this.dropTarget||this.dropTarget.id!==s)return;const a=this.dragId,{pos:c}=this.dropTarget;if(this.clearDrop(),c==="inside")this.reparentTo(a,s);else{const l=this.nodes.get(s);this.reparentTo(a,l.parentId,c==="before"?s:null,c==="after"?s:null)}})}cascadeVisibility(e,t){const n=this.nodes.get(e);if(n)for(const s of n.childIds)this.onVisibilityToggle(s,t),this.cascadeVisibility(s,t)}reparentTo(e,t,n=null,s=null){var a,c,l;const r=this.nodes.get(e);if(!r)return;if(r.parentId){const h=this.nodes.get(r.parentId);h&&(h.childIds=h.childIds.filter(d=>d!==e),this.refreshCaret(h))}r.nodeEl.remove(),r.parentId=t,r.rowEl.style.setProperty("--depth",String(this.depthOf(t)));const o=t?(a=this.nodes.get(t))==null?void 0:a.childrenEl:this.bodyEl;if(o){if(n)o.insertBefore(r.nodeEl,((c=this.nodes.get(n))==null?void 0:c.nodeEl)??null);else if(s){const h=(l=this.nodes.get(s))==null?void 0:l.nodeEl;h?h.after(r.nodeEl):o.appendChild(r.nodeEl)}else o.appendChild(r.nodeEl);if(t){const h=this.nodes.get(t);h.childIds=[...h.childrenEl.children].map(d=>d.dataset.id??"").filter(Boolean),this.refreshCaret(h)}this.onReparent(e,t,n??s)}}clearDrop(){var e;this.dropTarget&&((e=this.nodes.get(this.dropTarget.id))==null||e.rowEl.classList.remove("tree-drop-before","tree-drop-inside","tree-drop-after"),this.dropTarget=null)}depthOf(e){if(!e)return 0;const t=this.nodes.get(e);return t?this.depthOf(t.parentId)+1:0}dispose(){this.ctxMenu.remove()}}class Rh{constructor(e){W(this,"content");W(this,"onClose",()=>{});e.innerHTML=`
      <div class="prop-header">PROPERTIES<button class="prop-close-btn" title="Close panel">×</button></div>
      <div class="prop-content"></div>
    `,this.content=e.querySelector(".prop-content"),e.querySelector(".prop-close-btn").addEventListener("click",()=>this.onClose()),this.showEmpty()}showEmpty(){this.content.innerHTML='<div class="prop-empty">Select an item<br>to inspect</div>'}section(e){const t=document.createElement("div");t.className="prop-section-title",t.textContent=e,this.content.appendChild(t)}readRow(e,t){const n=document.createElement("div");n.className="prop-row",n.innerHTML=`<span class="prop-label">${e}</span><span class="prop-value-read">${t}</span>`,this.content.appendChild(n)}numRow(e,t,n,s,r,o){const a=document.createElement("div");a.className="prop-row";const c=document.createElement("span");c.className="prop-label",c.textContent=e;const l=document.createElement("input");return l.className="prop-input",l.type="number",l.value=String(parseFloat(t.toFixed(3))),l.min=String(n),l.max=String(s),l.step=String(r),l.addEventListener("input",()=>o(parseFloat(l.value)||0)),a.appendChild(c),a.appendChild(l),this.content.appendChild(a),l}colorRow(e,t,n){const s=document.createElement("div");s.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=e;const o=document.createElement("input");return o.type="color",o.className="prop-color-input",o.value="#"+t.toString(16).padStart(6,"0"),o.addEventListener("input",()=>n(parseInt(o.value.slice(1),16))),s.appendChild(r),s.appendChild(o),this.content.appendChild(s),o}toggleRow(e,t,n){const s=document.createElement("div");s.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=e;const o=document.createElement("button");return o.className="prop-profile-btn"+(t?" active":""),o.textContent=t?"✦ On":"◌ Off",o.addEventListener("click",()=>{const a=!o.classList.contains("active");o.classList.toggle("active",a),o.textContent=a?"✦ On":"◌ Off",n(a)}),s.appendChild(r),s.appendChild(o),this.content.appendChild(s),o}textRow(e,t,n){const s=document.createElement("div");s.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=e;const o=document.createElement("input");return o.type="text",o.className="prop-text-input",o.value=t,o.addEventListener("input",()=>n(o.value)),s.appendChild(r),s.appendChild(o),this.content.appendChild(s),o}selectRow(e,t,n,s){const r=document.createElement("div");r.className="prop-row";const o=document.createElement("span");o.className="prop-label",o.textContent=e;const a=document.createElement("select");a.className="prop-select";for(const c of t){const l=document.createElement("option");l.value=c.value,l.textContent=c.label,l.selected=c.value===n,a.appendChild(l)}return a.addEventListener("change",()=>s(a.value)),r.appendChild(o),r.appendChild(a),this.content.appendChild(r),a}buttonRow(e,t,n){const s=document.createElement("div");s.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent=e;const o=document.createElement("button");return o.className="game-btn prop-action-btn",o.textContent=t,o.addEventListener("click",n),s.appendChild(r),s.appendChild(o),this.content.appendChild(s),o}}const gl=[{value:"plastic",label:"Plastic"},{value:"metal",label:"Metal"},{value:"rubber",label:"Rubber"},{value:"resin",label:"Resin"},{value:"custom",label:"Custom"}];class sv extends Rh{showAxis(e,t){this.content.innerHTML="",this.section("SPIN AXIS"),this.numRow("Tilt angle °",e.tiltAngle,0,45,.5,s=>t({tiltAngle:s})),this.numRow("Pivot offset cm",e.pivotOffset,0,20,.1,s=>t({pivotOffset:s})),this.section("SPIN DIRECTION");const n=document.createElement("div");n.className="prop-profile-row";for(const s of["left","right"]){const r=document.createElement("button");r.className="prop-profile-btn"+(e.spinDir===s?" active":""),r.textContent=s==="left"?"◀ Left":"Right ▶",r.addEventListener("click",()=>{n.querySelectorAll(".prop-profile-btn").forEach(o=>o.classList.remove("active")),r.classList.add("active"),t({spinDir:s})}),n.appendChild(r)}this.content.appendChild(n)}showPart(e,t,n,s){this.content.innerHTML="",this.section("NAME"),this.textRow("Name",e.name,o=>t({name:o})),this.section("TYPE");const r=document.createElement("div");r.className="prop-profile-row";for(const[o,a]of[[!1,"⬡ Solid"],[!0,"◯ Pipe"]]){const c=document.createElement("button");c.className="prop-profile-btn"+(e.isHollow===o?" active":""),c.textContent=a,c.addEventListener("click",()=>{r.querySelectorAll(".prop-profile-btn").forEach(l=>l.classList.remove("active")),c.classList.add("active"),t({isHollow:o})}),r.appendChild(c)}this.content.appendChild(r),this.toggleRow("Free Spin",e.freeSpin,o=>t({freeSpin:o})),this.section("POSITION"),this.numRow("Y offset cm",e.axisOffsetY,-10,30,.1,o=>t({axisOffsetY:o})),this.section("DIMENSIONS"),this.numRow("Height cm",e.height,.1,10,.1,o=>t({height:o})),this.numRow("Top Rx cm",e.topRadiusX,.1,10,.1,o=>t({topRadiusX:o})),this.numRow("Top Rz cm",e.topRadiusZ,.1,10,.1,o=>t({topRadiusZ:o})),this.numRow("Bot Rx cm",e.bottomRadiusX,.1,10,.1,o=>t({bottomRadiusX:o})),this.numRow("Bot Rz cm",e.bottomRadiusZ,.1,10,.1,o=>t({bottomRadiusZ:o})),e.isHollow&&(this.section("INNER DIMENSIONS"),this.numRow("Top iRx cm",e.innerTopRadiusX,.05,9,.05,o=>t({innerTopRadiusX:o})),this.numRow("Top iRz cm",e.innerTopRadiusZ,.05,9,.05,o=>t({innerTopRadiusZ:o})),this.numRow("Bot iRx cm",e.innerBottomRadiusX,.05,9,.05,o=>t({innerBottomRadiusX:o})),this.numRow("Bot iRz cm",e.innerBottomRadiusZ,.05,9,.05,o=>t({innerBottomRadiusZ:o}))),this.section("MATERIAL"),this.selectRow("Material",gl,e.material,o=>t({material:o})),this.numRow("Weight g",e.weight,.01,200,.01,o=>t({weight:o})),this.colorRow("Color",e.color,o=>t({color:o})),this.section("SECTORS"),e.sectorIds.length===0?this.buttonRow("Cut part","Cut into sectors…",()=>{const o=prompt("Number of sectors (2–12):","3"),a=parseInt(o??"3",10);isNaN(a)||a<2||n(Math.min(12,a))}):this.readRow("Sectors",String(e.sectorIds.length)),this.section("PRESENTATION"),this.colorRow("Present color",e.presentationColor,o=>t({presentationColor:o})),this.buttonRow("STL model",e.presentationSTLb64?"✓ Replace STL":"Import STL…",()=>s())}showSector(e,t,n){this.content.innerHTML="",this.section("NAME"),this.textRow("Name",e.name,c=>n({name:c})),this.section("ARC"),this.numRow("Start angle °",e.startAngle,0,360,1,c=>n({startAngle:c})),this.numRow("End angle °",e.endAngle,0,360,1,c=>n({endAngle:c})),this.section("DIMENSIONS"),this.numRow("Height cm",e.height,.1,10,.1,c=>n({height:c})),this.numRow("Top Rx cm",e.topRadiusX,.1,10,.1,c=>n({topRadiusX:c})),this.numRow("Top Rz cm",e.topRadiusZ,.1,10,.1,c=>n({topRadiusZ:c})),this.numRow("Bot Rx cm",e.bottomRadiusX,.1,10,.1,c=>n({bottomRadiusX:c})),this.numRow("Bot Rz cm",e.bottomRadiusZ,.1,10,.1,c=>n({bottomRadiusZ:c})),e.isHollow&&(this.section("INNER DIMENSIONS"),this.numRow("Top iRx cm",e.innerTopRadiusX,.05,9,.05,c=>n({innerTopRadiusX:c})),this.numRow("Top iRz cm",e.innerTopRadiusZ,.05,9,.05,c=>n({innerTopRadiusZ:c})),this.numRow("Bot iRx cm",e.innerBottomRadiusX,.05,9,.05,c=>n({innerBottomRadiusX:c})),this.numRow("Bot iRz cm",e.innerBottomRadiusZ,.05,9,.05,c=>n({innerBottomRadiusZ:c}))),this.section("MATERIAL"),this.selectRow("Material",gl,e.material,c=>n({material:c})),this.colorRow("Color",e.color,c=>n({color:c})),this.section("WEIGHT"),t.sectorIds.map(()=>0);const s=document.createElement("div");s.className="prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent="Weight g";const o=document.createElement("input");o.type="number",o.className="prop-input",o.value=String(e.weight),o.min="0.001",o.max="200",o.step="0.001";const a=document.createElement("span");a.className="prop-weight-hint",a.textContent=`/ ${t.weight.toFixed(3)} g total`,o.addEventListener("input",()=>{n({weight:parseFloat(o.value)||0})}),s.appendChild(r),s.appendChild(o),s.appendChild(a),this.content.appendChild(s)}showGroup(e,t){this.content.innerHTML="",this.section("GROUP"),this.textRow("Name",e.name,t),this.readRow("Children",String(e.childIds.length))}}class rv{constructor(e,t){W(this,"description","Add part");this.ctx=e,this.data=t}execute(){this.ctx.store.addPart(this.data),this.ctx.store.addToRoot(this.data.id),this.ctx.onPartAdded(this.data.id)}undo(){this.ctx.store.removePart(this.data.id),this.ctx.store.removeFromRoot(this.data.id),this.ctx.onPartRemoved(this.data.id)}}class ov{constructor(e,t){W(this,"description","Delete part");W(this,"snapshot");W(this,"snapshotSectors");W(this,"wasInRoot");W(this,"parentGroupId");this.ctx=e,this.partId=t,this.snapshot={...e.store.getPart(t),sectorIds:[...e.store.getPart(t).sectorIds]},this.snapshotSectors=this.snapshot.sectorIds.map(n=>({...e.store.getSector(n)})),this.wasInRoot=e.store.getRootChildIds().includes(t),this.parentGroupId=this._findParentGroup()}_findParentGroup(){for(const e of this.ctx.store.getAllGroups())if(e.childIds.includes(this.partId))return e.id;return null}execute(){for(const e of this.snapshot.sectorIds)this.ctx.store.removeSector(e);if(this.ctx.store.removePart(this.partId),this.wasInRoot&&this.ctx.store.removeFromRoot(this.partId),this.parentGroupId){const e=this.ctx.store.getGroup(this.parentGroupId);this.ctx.store.updateGroup(this.parentGroupId,{childIds:e.childIds.filter(t=>t!==this.partId)})}this.ctx.onPartRemoved(this.partId)}undo(){for(const e of this.snapshotSectors)this.ctx.store.addSector(e);if(this.ctx.store.addPart(this.snapshot),this.wasInRoot&&this.ctx.store.addToRoot(this.partId),this.parentGroupId){const e=this.ctx.store.getGroup(this.parentGroupId);this.ctx.store.updateGroup(this.parentGroupId,{childIds:[...e.childIds,this.partId]})}this.ctx.onPartAdded(this.partId)}}class _l{constructor(e,t,n){W(this,"description","Update part");W(this,"prev");this.ctx=e,this.id=t,this.next=n;const s=e.store.getPart(t);this.prev=Object.fromEntries(Object.keys(n).map(r=>[r,s[r]]))}execute(){this.ctx.store.updatePart(this.id,this.next),this.ctx.onPartUpdated(this.id)}undo(){this.ctx.store.updatePart(this.id,this.prev),this.ctx.onPartUpdated(this.id)}}class av{constructor(e,t,n){W(this,"description","Cut into sectors");W(this,"oldSectorIds");this.ctx=e,this.partId=t,this.newSectors=n,this.oldSectorIds=[...e.store.getPart(t).sectorIds]}execute(){for(const e of this.oldSectorIds)this.ctx.store.removeSector(e);for(const e of this.newSectors)this.ctx.store.addSector(e);this.ctx.store.updatePart(this.partId,{sectorIds:this.newSectors.map(e=>e.id)}),this.ctx.onPartUpdated(this.partId)}undo(){for(const e of this.newSectors)this.ctx.store.removeSector(e.id);for(const e of this.oldSectorIds);this.ctx.store.updatePart(this.partId,{sectorIds:this.oldSectorIds}),this.ctx.onPartUpdated(this.partId)}}class cv{constructor(e,t,n,s){W(this,"description","Update sector");W(this,"prev");this.ctx=e,this.partId=t,this.sectorId=n,this.next=s;const r=e.store.getSector(n);this.prev=Object.fromEntries(Object.keys(s).map(o=>[o,r[o]]))}execute(){this.ctx.store.updateSector(this.sectorId,this.next),this.ctx.onSectorUpdated(this.sectorId)}undo(){this.ctx.store.updateSector(this.sectorId,this.prev),this.ctx.onSectorUpdated(this.sectorId)}}class lv{constructor(e,t,n){W(this,"description","Delete sector");W(this,"snapshot");this.ctx=e,this.partId=t,this.sectorId=n,this.snapshot={...e.store.getSector(n)}}execute(){this.ctx.store.removeSector(this.sectorId);const e=this.ctx.store.getPart(this.partId);this.ctx.store.updatePart(this.partId,{sectorIds:e.sectorIds.filter(t=>t!==this.sectorId)}),this.ctx.onSectorRemoved(this.partId,this.sectorId)}undo(){this.ctx.store.addSector(this.snapshot);const e=this.ctx.store.getPart(this.partId);this.ctx.store.updatePart(this.partId,{sectorIds:[...e.sectorIds,this.sectorId]}),this.ctx.onSectorAdded(this.partId,this.sectorId)}}class vl{constructor(e,t){W(this,"description","Add group");this.ctx=e,this.data=t}execute(){this.ctx.store.addGroup(this.data),this.ctx.store.addToRoot(this.data.id),this.ctx.onGroupAdded(this.data.id)}undo(){this.ctx.store.removeGroup(this.data.id),this.ctx.store.removeFromRoot(this.data.id),this.ctx.onGroupRemoved(this.data.id)}}class hv{constructor(e,t){W(this,"description","Delete group");W(this,"snapshot");W(this,"wasInRoot");this.ctx=e,this.groupId=t;const n=e.store.getGroup(t);this.snapshot={...n,childIds:[...n.childIds]},this.wasInRoot=e.store.getRootChildIds().includes(t)}execute(){for(const e of this.snapshot.childIds)this.ctx.store.addToRoot(e);this.ctx.store.removeGroup(this.groupId),this.wasInRoot&&this.ctx.store.removeFromRoot(this.groupId),this.ctx.onGroupRemoved(this.groupId)}undo(){this.ctx.store.addGroup(this.snapshot),this.wasInRoot&&this.ctx.store.addToRoot(this.groupId);for(const e of this.snapshot.childIds)this.ctx.store.removeFromRoot(e);this.ctx.onGroupAdded(this.groupId)}}class dv{constructor(e,t,n){W(this,"description","Update group");W(this,"prev");this.ctx=e,this.id=t,this.next=n;const s=e.store.getGroup(t);this.prev=Object.fromEntries(Object.keys(n).map(r=>[r,s[r]]))}execute(){this.ctx.store.updateGroup(this.id,this.next),this.ctx.onGroupUpdated(this.id)}undo(){this.ctx.store.updateGroup(this.id,this.prev),this.ctx.onGroupUpdated(this.id)}}function Er(i,e="Leave",t="Stay"){return new Promise(n=>{const s=document.createElement("div");s.className="confirm-overlay",s.innerHTML=`
      <div class="confirm-dialog" role="dialog" aria-modal="true">
        <p class="confirm-msg">${i}</p>
        <div class="confirm-actions">
          <button class="game-btn btn-danger" id="c-ok">${e}</button>
          <button class="game-btn" id="c-cancel">${t}</button>
        </div>
      </div>
    `,document.body.appendChild(s);const r=a=>{s.remove(),window.removeEventListener("keydown",o),n(a)},o=a=>{a.key==="Enter"&&r(!0),a.key==="Escape"&&r(!1)};s.querySelector("#c-ok").addEventListener("click",()=>r(!0)),s.querySelector("#c-cancel").addEventListener("click",()=>r(!1)),s.addEventListener("click",a=>{a.target===s&&r(!1)}),window.addEventListener("keydown",o)})}const Uo="bey_beyblade_builder";class uv extends bh{constructor(t,n){super(t,{title:"Beyblade Builder",accentHex:58879,onBack:n,gridSize:15,gridDivs:15,tickEvery:5,tickRange:7,defaultCam:{x:12,y:8,z:14},camFar:500,minZoom:.5,maxZoom:50});W(this,"store",new W_);W(this,"history",new Y_);W(this,"beyRenderer");W(this,"animator");W(this,"tree");W(this,"panel");W(this,"rightPanelEl");W(this,"leftPanelEl");W(this,"undoBtn");W(this,"redoBtn");W(this,"playBtn");W(this,"stopBtn");W(this,"tiltInput");W(this,"pivotInput");W(this,"spinLeftBtn");W(this,"spinRightBtn");W(this,"viewBtns",{});W(this,"_onKey",t=>{(/mac/i.test(navigator.platform)?t.metaKey:t.ctrlKey)&&(t.key==="z"&&!t.shiftKey&&(t.preventDefault(),this._undo()),(t.key==="z"&&t.shiftKey||t.key==="y")&&(t.preventDefault(),this._redo()))});this.undoBtn=this.addTopBarButton("↩ Undo","Undo (Ctrl+Z)"),this.redoBtn=this.addTopBarButton("↪ Redo","Redo (Ctrl+Y)");const r=this.addTopBarButton("✕ Reset","Clear all parts and reset axis to defaults");this.undoBtn.addEventListener("click",()=>this._undo()),this.redoBtn.addEventListener("click",()=>this._redo()),r.addEventListener("click",()=>{this._confirmReset()}),this.history.onStackChange=()=>this._syncUndoButtons(),this._syncUndoButtons()}setVisible(t){super.setVisible(t),t?document.addEventListener("keydown",this._onKey):document.removeEventListener("keydown",this._onKey)}buildCustom(t){this.beyRenderer=new tv(t,this.store),this.animator=new iv(this.beyRenderer);const n=this.addOverlayPanel("sandbox-left-panel");this.leftPanelEl=n,this.tree=new wh(n);const s=document.createElement("button");s.className="tree-collapse-btn",s.textContent="◀",s.title="Collapse panel",this.tree.header.appendChild(s),s.addEventListener("click",()=>{const l=n.classList.toggle("sandbox-left-panel--collapsed");s.textContent=l?"▶":"◀",s.title=l?"Expand panel":"Collapse panel"});const r=document.createElement("button");r.className="game-btn tree-add-root-btn",r.textContent="+ Part",r.title="Add a new part to the scene",r.addEventListener("click",()=>this._addPart());const o=document.createElement("button");o.className="game-btn tree-add-root-btn",o.textContent="+ Group",o.title="Add a new group",o.addEventListener("click",()=>this._addGroup());const a=document.createElement("div");a.className="tree-add-root-row",a.appendChild(r),a.appendChild(o),n.appendChild(a);const c=this.addOverlayPanel("sandbox-right-panel");this.rightPanelEl=c,this.panel=new sv(c),this.panel.onClose=()=>{this.tree.clearSel(),this.rightPanelEl.style.display="none"},this.tree.add("axis","🔄 Axis","🔄",null),this.tree.setNodeActions("axis",[{label:"Properties",action:()=>this._selectAxis()}]),this._buildBottomBar(),this._wireTree(),this._loadFromStorage()}onTick(t){this.animator.tick(t,this.store.getAxis().spinDir)}_buildBottomBar(){const t="calc(67 * var(--mm))",n="calc(23 * var(--mm))",s=c=>{const l=c?n:t;this.rightPanelEl.style.bottom=l,this.leftPanelEl.style.bottom=l},r=this.addOverlayPanel("beyblade-bottom-bar");r.innerHTML=`
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
    `;const o=r.querySelector("#bey-bar-toggle"),a=r.querySelector(".bey-bar-collapse-arrow");o.addEventListener("click",()=>{const c=r.classList.toggle("beyblade-bottom-bar--collapsed");a.textContent=c?"▶":"▼",s(c)}),s(!1),this.tiltInput=r.querySelector("#bey-tilt"),this.pivotInput=r.querySelector("#bey-pivot"),this.spinLeftBtn=r.querySelector("#bey-spin-left"),this.spinRightBtn=r.querySelector("#bey-spin-right"),this.playBtn=r.querySelector("#bey-play"),this.stopBtn=r.querySelector("#bey-stop"),this.viewBtns.hitbox=r.querySelector("#bey-view-hitbox"),this.viewBtns.both=r.querySelector("#bey-view-both"),this.viewBtns.present=r.querySelector("#bey-view-present"),this.tiltInput.addEventListener("input",()=>this._applyAxisPose()),this.pivotInput.addEventListener("input",()=>this._applyAxisPose()),this.spinLeftBtn.addEventListener("click",()=>{this.store.setAxis({spinDir:"left"}),this.spinLeftBtn.classList.add("active"),this.spinRightBtn.classList.remove("active")}),this.spinRightBtn.addEventListener("click",()=>{this.store.setAxis({spinDir:"right"}),this.spinRightBtn.classList.add("active"),this.spinLeftBtn.classList.remove("active")}),this.playBtn.addEventListener("click",()=>{this.animator.startSpin(),this.playBtn.classList.add("active"),this.stopBtn.classList.remove("active")}),this.stopBtn.addEventListener("click",()=>{this.animator.stopSpin(),this.animator.resetAngle(),this.stopBtn.classList.add("active"),this.playBtn.classList.remove("active")}),Object.entries(this.viewBtns).forEach(([c,l])=>{l.addEventListener("click",()=>this._setViewMode(c))})}_applyAxisPose(){const t=parseFloat(this.tiltInput.value)||0,n=parseFloat(this.pivotInput.value)||0;this.store.setAxis({tiltAngle:t,pivotOffset:n}),this.animator.setTiltAngle(t,n)}_setViewMode(t){this.beyRenderer.setViewMode(t),Object.entries(this.viewBtns).forEach(([n,s])=>{s.classList.toggle("active",n===t)})}_wireTree(){this.tree.onSelect=t=>{if(t.length===0){this.panel.showEmpty();return}const n=t[0];if(n==="axis"){this._selectAxis();return}if(this.store.hasPart(n))this._selectPart(n);else if(this.store.hasSector(n)){const s=this.store.findPartOfSector(n);s&&this._selectSector(n,s)}else this.store.hasGroup(n)&&this._selectGroup(n)},this.tree.onDelete=t=>{for(const n of t)if(n!=="axis")if(this.store.hasPart(n))this.history.execute(new ov(this._ctx(),n));else if(this.store.hasSector(n)){const s=this.store.findPartOfSector(n);s&&this.history.execute(new lv(this._ctx(),s,n))}else this.store.hasGroup(n)&&this.history.execute(new hv(this._ctx(),n));this.panel.showEmpty()},this.tree.onVisibilityToggle=(t,n)=>{this.store.hasPart(t)&&this.beyRenderer.setPartVisible(t,n)},this.tree.onGroup=(t,n)=>{const r={id:this.store.nextGroupId(),name:"Group",childIds:n};this.history.execute(new vl(this._ctx(),r))}}_selectAxis(){this.rightPanelEl.style.display="";const t=this.store.getAxis();this.panel.showAxis(t,n=>{this.store.setAxis(n),this.tiltInput.value=String(this.store.getAxis().tiltAngle),this.pivotInput.value=String(this.store.getAxis().pivotOffset),this._applyAxisPose(),this._saveToStorage()})}_selectPart(t){this.rightPanelEl.style.display="";const n=this.store.getPart(t);this.panel.showPart(n,s=>{this.history.execute(new _l(this._ctx(),t,s))},s=>this._cutPart(t,s),()=>this._importSTL(t))}_selectSector(t,n){this.rightPanelEl.style.display="";const s=this.store.getSector(t),r=this.store.getPart(n);this.panel.showSector(s,r,o=>{this.history.execute(new cv(this._ctx(),n,t,o))})}_selectGroup(t){this.rightPanelEl.style.display="";const n=this.store.getGroup(t);this.panel.showGroup(n,s=>{this.history.execute(new dv(this._ctx(),t,{name:s})),this.tree.setLabel(t,s)})}_addPart(){const t=this.store.nextPartId(),n={id:t,name:`Part ${t.split("-")[1]}`,isHollow:!1,freeSpin:!1,axisOffsetY:0,height:1,topRadiusX:2,topRadiusZ:2,bottomRadiusX:2,bottomRadiusZ:2,innerTopRadiusX:0,innerTopRadiusZ:0,innerBottomRadiusX:0,innerBottomRadiusZ:0,sectorIds:[],material:"plastic",weight:1,color:58879,presentationColor:11184810};this.history.execute(new rv(this._ctx(),n))}_addGroup(){const t=this.store.nextGroupId(),n={id:t,name:`Group ${t.split("-")[1]}`,childIds:[]};this.history.execute(new vl(this._ctx(),n))}_cutPart(t,n){const s=this.store.getPart(t),r=360/n,o=s.weight/n,a=[];for(let c=0;c<n;c++){const l=this.store.nextSectorId();a.push({id:l,name:`Sector ${c+1}`,startAngle:r*c,endAngle:r*(c+1),height:s.height,topRadiusX:s.topRadiusX,topRadiusZ:s.topRadiusZ,bottomRadiusX:s.bottomRadiusX,bottomRadiusZ:s.bottomRadiusZ,isHollow:s.isHollow,innerTopRadiusX:s.innerTopRadiusX,innerTopRadiusZ:s.innerTopRadiusZ,innerBottomRadiusX:s.innerBottomRadiusX,innerBottomRadiusZ:s.innerBottomRadiusZ,material:s.material,weight:parseFloat(o.toFixed(3)),color:s.color})}this.history.execute(new av(this._ctx(),t,a))}_importSTL(t){const n=document.createElement("input");n.type="file",n.accept=".stl",n.addEventListener("change",()=>{var o;const s=(o=n.files)==null?void 0:o[0];if(!s)return;const r=new FileReader;r.onload=()=>{const c=new al().parse(r.result);this.beyRenderer.loadPresentationSTL(t,c);const l=btoa(String.fromCharCode(...new Uint8Array(r.result)));this.store.updatePart(t,{presentationSTLb64:l}),this._saveToStorage()},r.readAsArrayBuffer(s)}),n.click()}_ctx(){return{store:this.store,onPartAdded:t=>{this._onPartAdded(t)},onPartRemoved:t=>{this._onPartRemoved(t)},onPartUpdated:t=>{this._onPartUpdated(t)},onSectorAdded:(t,n)=>{this._onSectorAdded(t,n)},onSectorRemoved:(t,n)=>{this._onSectorRemoved(t,n)},onSectorUpdated:t=>{this._onSectorUpdated(t)},onGroupAdded:t=>{this._onGroupAdded(t)},onGroupRemoved:t=>{this._onGroupRemoved(t)},onGroupUpdated:t=>{this._onGroupUpdated(t)},onRootOrderChanged:()=>{this._rebuildTree()},onAxisUpdated:()=>{this.beyRenderer.rebuildAxis(),this._saveToStorage()},onTreeRebuild:()=>{this._rebuildTree()}}}_onPartAdded(t){const n=this.store.getPart(t);this.beyRenderer.rebuildPart(t),this.tree.add(t,n.name,n.isHollow?"◯":"⬡",null,{addChildButtons:[{label:"S+",title:"Cut into sectors",onClick:()=>{const s=parseInt(prompt("Number of sectors (2–12):","3")??"3",10)||3;this._cutPart(t,Math.max(2,Math.min(12,s)))}}]}),this.tree.setNodeActions(t,[{label:"Free Spin: "+(n.freeSpin?"ON":"OFF"),action:()=>{this.history.execute(new _l(this._ctx(),t,{freeSpin:!this.store.getPart(t).freeSpin}))}}]),this._saveToStorage()}_onPartRemoved(t){this.beyRenderer.removePart(t),this.tree.remove(t),this._saveToStorage()}_onPartUpdated(t){if(!this.store.hasPart(t))return;const n=this.store.getPart(t);this.beyRenderer.rebuildPart(t),this.beyRenderer.updateSpinGroups(),this.tree.setLabel(t,n.name),this._rebuildSectorNodes(t),this._saveToStorage()}_onSectorAdded(t,n){const s=this.store.getSector(n);this.tree.add(n,s.name,"◔",t),this.beyRenderer.rebuildPart(t),this._saveToStorage()}_onSectorRemoved(t,n){this.tree.remove(n),this.beyRenderer.rebuildPart(t),this._saveToStorage()}_onSectorUpdated(t){const n=this.store.findPartOfSector(t);n&&this.beyRenderer.rebuildPart(n),this._saveToStorage()}_onGroupAdded(t){const n=this.store.getGroup(t);this.tree.add(t,n.name,"📦",null),this._saveToStorage()}_onGroupRemoved(t){this.tree.remove(t),this._saveToStorage()}_onGroupUpdated(t){this.store.hasGroup(t)&&(this.tree.setLabel(t,this.store.getGroup(t).name),this._saveToStorage())}_rebuildSectorNodes(t){const n=this.store.getPart(t),s=this.tree.nodes;for(const[r]of s)this.store.hasSector(r)&&!n.sectorIds.includes(r)&&this.tree.remove(r);for(const r of n.sectorIds){const o=this.store.getSector(r);this.tree.nodes.has(r)||this.tree.add(r,o.name,"◔",t)}}_rebuildTree(){const t=this.tree.nodes;for(const[n]of t)n!=="axis"&&this.tree.remove(n);for(const n of this.store.getAllGroups())this.tree.add(n.id,n.name,"📦",null);for(const n of this.store.getRootChildIds())if(this.store.hasPart(n)){const s=this.store.getPart(n);this.tree.add(n,s.name,s.isHollow?"◯":"⬡",null);for(const r of s.sectorIds){const o=this.store.getSector(r);this.tree.add(r,o.name,"◔",n)}}for(const n of this.store.getAllParts())this.beyRenderer.rebuildPart(n.id);this.panel.showEmpty(),this._saveToStorage()}async _confirmReset(){await Er(`Reset the beyblade builder?
All parts, sectors and groups will be cleared.`,"Reset","Cancel")&&this._resetBuilder()}_resetBuilder(){this.animator.stopSpin(),this.animator.resetAngle(),this.playBtn.classList.remove("active"),this.stopBtn.classList.remove("active");for(const n of this.store.getAllParts())this.beyRenderer.removePart(n.id);this.store.reset(),this.history.clear(),this.tiltInput.value="0",this.pivotInput.value="0",this.spinLeftBtn.classList.remove("active"),this.spinRightBtn.classList.add("active"),this._applyAxisPose(),this._setViewMode("hitbox");const t=this.tree.nodes;for(const[n]of t)n!=="axis"&&this.tree.remove(n);this.panel.showEmpty(),this._syncUndoButtons(),localStorage.removeItem(Uo)}_undo(){this.history.canUndo&&(this.history.undo(),this._rebuildTree())}_redo(){this.history.canRedo&&(this.history.redo(),this._rebuildTree())}_syncUndoButtons(){this.undoBtn.style.opacity=this.history.canUndo?"1":"0.4",this.redoBtn.style.opacity=this.history.canRedo?"1":"0.4"}_saveToStorage(){try{const t=this.store.serialize();localStorage.setItem(Uo,JSON.stringify(t))}catch{}}_loadFromStorage(){try{const t=localStorage.getItem(Uo);if(!t)return;const n=JSON.parse(t);this.store.deserialize(n);const s=this.store.getAxis();this.tiltInput.value=String(s.tiltAngle),this.pivotInput.value=String(s.pivotOffset),s.spinDir==="left"&&(this.spinLeftBtn.classList.add("active"),this.spinRightBtn.classList.remove("active")),this._applyAxisPose(),this._rebuildTree();for(const r of this.store.getAllParts())if(r.presentationSTLb64){const o=new al,a=Uint8Array.from(atob(r.presentationSTLb64),l=>l.charCodeAt(0)).buffer,c=o.parse(a);this.beyRenderer.loadPresentationSTL(r.id,c)}}catch{}}}const je=Math.PI*2,Xe=Math.PI/180,vn=100,xl=30,Sl=8,Ml=15260864,yl=20,oi=.5,Nn=.02,bl=2,Oo=6,Ch="abs",pv={rubber:{restitution:.15,spinLossFactor:.05,damageFactor:.2},stone:{restitution:.4,spinLossFactor:.12,damageFactor:.55},abs:{restitution:.65,spinLossFactor:.15,damageFactor:.7},metal:{restitution:.9,spinLossFactor:.2,damageFactor:1}},ua=10,Ar=10,fv=10,mv=5,Ph=30,gv=20,_v=90,vv=15,xv=10,Sv=30,Ln=64,Mv=48,Tr=8,Lh=3,Ih=0,Dh="parabolic",Nh=0,Uh=60,Oh=4,Jo=.4,Fh=1,Bh=1,zh=3,kh=1,Hh=.85,yv=96,bv=96,$i={PARABOLIC_BOWL:64,STRAIGHT_BOWL:48,SCOOP_RINGS:36,MOAT_HALF:20},Ee={SURFACE_LIFT:.05,SUB_STEPS_PER_SEG:8,ARROW_SPACING:12,ARROW_HALF_W:.8,ARROW_LEN:2,MARKER_SIZE:1.5,OVERLAP_THRESHOLD:1.5,OVERLAP_SPHERE_R:1.2,WIDTH_MIN:.5,WIDTH_MAX:5,SPEED_MULT_MIN:.5,SPEED_MULT_MAX:5,LAUNCH_FORCE_MIN:0,LAUNCH_FORCE_MAX:5,SWAP_PRIORITY_MIN:0,SWAP_PRIORITY_MAX:10,HANDLE_RADIUS:1.2,HANDLE_COLOR:43775,HANDLE_HOVER_COLOR:65535,INACTIVE_OPACITY_MULT:.4,DEFAULT_SEG_LENGTH:8,DEFAULT_WIDTH:1.5,DEFAULT_COLOR:16768256,DEFAULT_OPACITY:.85,DEFAULT_SPEED_MULT:1.5,DEFAULT_DIRECTION:"forward",DEFAULT_EXIT:"normal",DEFAULT_LAUNCH_FORCE:1,DEFAULT_SWAP_PRIORITY:5,DEFAULT_TARGET:"beyblade",DEFAULT_ACTIVATION:"always",DEFAULT_PERIOD_MS:2e3,DEFAULT_DUTY:.5,DEFAULT_FADE_MS:300,DEFAULT_PROX_RADIUS:10,DEFAULT_OSC_AMP:2,DEFAULT_OSC_FREQ:.5,DEFAULT_OSC_PHASE:0,DEFAULT_OSC_AXIS:"lateral"},wr=new Map,Rr=new Map;function pa(i){return i.surface==="custom_png"&&i.customTileData?`custom:${i.customTileData.slice(0,40)}:${i.tileScale}`:`${i.color}_${i.surface}`}function Gh(i){return`${pa(i)}:${i.transparent?"t":"o"}:${i.opacity??1}:${i.side??Et}:${i.baseMaterial??""}`}function Vh(i,e){const n=document.createElement("canvas");n.width=n.height=256;const s=n.getContext("2d"),r=i>>16&255,o=i>>8&255,a=i&255,c=`rgb(${r},${o},${a})`,l=`rgba(${Math.min(r+64,255)},${Math.min(o+64,255)},${Math.min(a+64,255)},0.55)`,h=`rgba(${Math.max(r-50,0)},${Math.max(o-50,0)},${Math.max(a-50,0)},0.60)`;switch(s.fillStyle=c,s.fillRect(0,0,256,256),e){case"checker":{s.fillStyle=l;for(let u=0;u<256;u+=32)for(let m=0;m<256;m+=32)(u/32+m/32)%2===0&&s.fillRect(u,m,32,32);break}case"grid":{s.strokeStyle=l,s.lineWidth=2;for(let d=0;d<=256;d+=32)s.beginPath(),s.moveTo(d,0),s.lineTo(d,256),s.stroke(),s.beginPath(),s.moveTo(0,d),s.lineTo(256,d),s.stroke();break}case"hex":{const u=28*Math.sqrt(3)/2;s.strokeStyle=l,s.lineWidth=2;for(let m=-1;m<256/u+1;m++)for(let g=-1;g<256/28+1;g++){const _=g*28*1.5+m%2*28*.75,f=m*u;s.beginPath();for(let p=0;p<6;p++){const x=(p*60-30)*Xe;p===0?s.moveTo(_+28/2*Math.cos(x),f+28/2*Math.sin(x)):s.lineTo(_+28/2*Math.cos(x),f+28/2*Math.sin(x))}s.closePath(),s.stroke()}break}case"stripes":{s.strokeStyle=l,s.lineWidth=10;for(let d=-256;d<256*2;d+=24)s.beginPath(),s.moveTo(d,0),s.lineTo(d+256,256),s.stroke();break}case"dots":{s.fillStyle=l;for(let d=16;d<256;d+=32)for(let u=16;u<256;u+=32)s.beginPath(),s.arc(d,u,6,0,je),s.fill();break}case"concrete":{s.fillStyle=l;for(let d=0;d<1800;d++){const u=Math.random()*256,m=Math.random()*256,g=Math.random()*5+1;s.fillRect(u,m,g,g*.4)}break}case"metal":{for(let d=0;d<256;d+=3)s.fillStyle=`rgba(255,255,255,${Math.random()*.15})`,s.fillRect(0,d,256,2);break}case"wood":{for(let d=8;d<256;d+=14)s.strokeStyle=h,s.lineWidth=3+d%3,s.beginPath(),s.arc(256/2,256/2,d,0,je),s.stroke();break}case"ice":{s.strokeStyle=l,s.lineWidth=1.5;const d=[[50,0,180,200],[200,30,60,220],[120,80,240,180],[0,120,160,256],[80,180,250,40]];for(const[u,m,g,_]of d)s.beginPath(),s.moveTo(u,m),s.lineTo((u+g)/2+(Math.random()-.5)*40,(m+_)/2+(Math.random()-.5)*40),s.lineTo(g,_),s.stroke();break}case"sand":{s.fillStyle=l;for(let d=0;d<3e3;d++){const u=Math.random()*256,m=Math.random()*256;s.fillRect(u,m,1.5,1.5)}break}case"lava_rock":{const d=[];for(let m=0;m<25;m++)d.push([Math.random()*256,Math.random()*256]);const u=s.getImageData(0,0,256,256);for(let m=0;m<256;m++)for(let g=0;g<256;g++){let _=1/0,f=0;for(let v=0;v<d.length;v++){const S=(g-d[v][0])**2+(m-d[v][1])**2;S<_&&(_=S,f=v)}const p=f%2===0?.85:1,x=(m*256+g)*4;u.data[x]=Math.round(r*p),u.data[x+1]=Math.round(o*p),u.data[x+2]=Math.round(a*p),u.data[x+3]=255}s.putImageData(u,0,0);break}}return n}function ut(i){const e=Gh(i),t=Rr.get(e);if(t)return t.refs++,t.mat;let n=null;if(i.surface!=="plain"){const c=pa(i),l=wr.get(c);if(l)l.refs++,n=l.tex;else{let h;if(i.surface==="custom_png"&&i.customTileData)h=new N_().load(i.customTileData);else{const d=Vh(i.color,i.surface);h=new qo(d)}h.wrapS=h.wrapT=fr,h.repeat.set(20/i.tileScale,20/i.tileScale),wr.set(c,{tex:h,refs:1}),n=h}}const s={abs:[.65,0],metal:[.15,.88],stone:[.9,.02],rubber:[.95,0]},[r,o]=i.baseMaterial?s[i.baseMaterial]:[i.surface==="metal"?.25:i.surface==="ice"?.1:.65,i.surface==="metal"?.7:i.surface==="ice"?.1:.08],a=new ri({color:i.surface==="plain"?i.color:16777215,map:n??void 0,side:i.side??Et,roughness:r,metalness:o,transparent:i.transparent??!1,opacity:i.opacity??1});return Rr.set(e,{mat:a,refs:1}),a}function Cr(i,e=1){return new ri({color:new ve(i.color),emissive:new ve(i.emissive),emissiveIntensity:i.emissiveIntensity*.5,side:Et,roughness:.6,metalness:0,transparent:e<1,opacity:e,depthWrite:e>=1})}function Ev(i){const e=Gh(i),t=Rr.get(e);if(t&&(t.refs--,t.refs<=0)){t.mat.dispose(),Rr.delete(e);const n=pa(i),s=wr.get(n);s&&(s.refs--,s.refs<=0&&(s.tex.dispose(),wr.delete(n)))}}function Wh(i,e,t){for(const n of t)if(Xh(i,e,n))return!0;return!1}function Xh(i,e,t){const n=i-t.cx,s=e-t.cz,r=Math.cos(-t.rotY),o=Math.sin(-t.rotY),a=n*r-s*o,c=n*o+s*r;if(t.pts){const l=t.pts,h=l.length;let d=!1;for(let u=0,m=h-1;u<h;m=u++)l[u].y>c!=l[m].y>c&&a<(l[m].x-l[u].x)*(c-l[u].y)/(l[m].y-l[u].y)+l[u].x&&(d=!d);return d}return(a/t.rx)**2+(c/t.rz)**2<=1}function Av(i,e,t,n,s){const r=Math.cos(-s.rotY),o=Math.sin(-s.rotY),a=i-s.cx,c=e-s.cz,l=t-s.cx,h=n-s.cz,d=a*r-c*o,u=a*o+c*r,m=l*r-h*o,g=l*o+h*r,_=m-d,f=g-u;let p=1/0;if(s.pts){const x=s.pts,v=x.length;for(let S=0;S<v;S++){const R=x[S].x,A=x[S].y,T=x[(S+1)%v].x,C=x[(S+1)%v].y,b=_*(C-A)-f*(T-R);if(Math.abs(b)<1e-10)continue;const y=((R-d)*(C-A)-(A-u)*(T-R))/b,P=((R-d)*f-(A-u)*_)/b;y>=-1e-6&&y<=1+1e-6&&P>=-1e-6&&P<=1+1e-6&&(p=Math.min(p,Math.max(0,y)))}}else{const x=s.rx,v=s.rz,S=(_/x)**2+(f/v)**2,R=2*(d*_/x**2+u*f/v**2),A=(d/x)**2+(u/v)**2-1,T=R*R-4*S*A;if(T>=0){const C=Math.sqrt(T);for(const b of[(-R-C)/(2*S),(-R+C)/(2*S)])b>=-1e-6&&b<=1+1e-6&&(p=Math.min(p,Math.max(0,b)))}}return p===1/0?-1:p}function Tv(i,e){const t=i.length,n=i.map(r=>Xh(r.x,r.z,e));if(n.every(r=>!r))return i;if(n.every(r=>r))return[];const s=[];for(let r=0;r<t;r++){const o=(r+1)%t,a=i[r],c=i[o],l=n[r],h=n[o];if(l||s.push(a),l!==h){const d=Av(a.x,a.z,c.x,c.z,e);d>=0&&s.push({x:a.x+d*(c.x-a.x),y:a.y+d*(c.y-a.y),z:a.z+d*(c.z-a.z)})}}return s}function Vi(i,e,t,n,s){let r=i;for(const a of e)if(r=Tv(r,a),r.length<3)return;const o=t.length/3;for(const a of r)t.push(a.x,a.y,a.z);for(let a=1;a<r.length-1;a++)s?n.push(o,o+a+1,o+a):n.push(o,o+a,o+a+1)}function Yh(i,e,t,n=[],s=!1){const r=i.length,o=[],a=[];if(n.length===0){o.push(0,t(0,0,0),0);for(let l=1;l<=e;l++){const h=l/e;for(let d=0;d<r;d++){const u=i[d].x*h,m=i[d].y*h;o.push(u,t(u,m,h),m)}}for(let l=0;l<r;l++){const h=1+l,d=1+(l+1)%r;s?a.push(0,d,h):a.push(0,h,d)}for(let l=1;l<e;l++){const h=1+(l-1)*r,d=1+l*r;for(let u=0;u<r;u++){const m=h+u,g=h+(u+1)%r,_=d+u,f=d+(u+1)%r;a.push(m,g,_,g,f,_)}}}else{const l={x:0,y:t(0,0,0),z:0},h=[];for(let d=1;d<=e;d++){const u=d/e,m=[];for(let g=0;g<r;g++){const _=i[g].x*u,f=i[g].y*u;m.push({x:_,y:t(_,f,u),z:f})}h.push(m)}for(let d=0;d<r;d++)Vi([l,h[0][d],h[0][(d+1)%r]],n,o,a,s);for(let d=0;d<e-1;d++){const u=h[d],m=h[d+1];for(let g=0;g<r;g++){const _=u[g],f=u[(g+1)%r],p=m[g],x=m[(g+1)%r];Vi([_,f,p],n,o,a,!1),Vi([f,x,p],n,o,a,!1)}}}const c=new Fe;return c.setAttribute("position",new Ce(o,3)),c.setIndex(a),c.computeVertexNormals(),c}function wv(i,e,t,n,s,r,o,a){const c=i.length,l=n-t,h=(f,p,x)=>n-t*(1-x*x);if(a.length===0){s.push(0,l,0);for(let f=1;f<=e;f++){const p=f/e,x=n-t*(1-p*p);for(let v=0;v<c;v++)s.push(i[v].x*p,x,i[v].y*p)}for(let f=0;f<c;f++){const p=o+1+f,x=o+1+(f+1)%c;r.push(o+0,x,p)}for(let f=1;f<e;f++){const p=o+1+(f-1)*c,x=o+1+f*c;for(let v=0;v<c;v++){const S=p+v,R=p+(v+1)%c,A=x+v,T=x+(v+1)%c;r.push(S,R,A,R,T,A)}}return o+1+e*c}const d={x:0,y:l,z:0},u=[];for(let f=1;f<=e;f++){const p=f/e,x=[];for(let v=0;v<c;v++){const S=i[v].x*p,R=i[v].y*p;x.push({x:S,y:h(S,R,p),z:R})}u.push(x)}const m=[],g=[];for(let f=0;f<c;f++)Vi([d,u[0][f],u[0][(f+1)%c]],a,m,g,!0);for(let f=0;f<e-1;f++){const p=u[f],x=u[f+1];for(let v=0;v<c;v++){const S=p[v],R=p[(v+1)%c],A=x[v],T=x[(v+1)%c];Vi([S,R,A],a,m,g,!1),Vi([R,T,A],a,m,g,!1)}}const _=s.length/3;for(const f of m)s.push(f);for(const f of g)r.push(_+f);return _+m.length/3}function Hr(i,e){const t=i.length,n=[];for(let s=0;s<t;s++){const r=i[s],o=i[(s+1)%t];n.push(r.x,e,r.y,o.x,e,o.y)}return n}function fa(i,e,t){const n=i.length,s=e-t,r=[];for(let a=0;a<n;a++){const c=i[a],l=i[(a+1)%n];r.push(c.x,s,c.y,l.x,s,l.y)}const o=Math.max(1,Math.floor(n/8));for(let a=0;a<n;a+=o)r.push(i[a].x,e,i[a].y,i[a].x,s,i[a].y);return r}function Mn(i,e){const t=e*Xe;return{lx:i*Math.cos(t),lz:i*Math.sin(t)}}function Gr(i){const{lx:e,lz:t}=Mn(i.posR,i.posAngle);return{cx:e,cz:t,rotY:i.rotY*Xe}}function pt(i){const{radiusX:e,radiusZ:t,openingShape:n,sides:s,starInner:r}=i,o=[];switch(n){case"circle":case"ellipse":{for(let c=0;c<96;c++){const l=c/96*je;o.push(new K(e*Math.cos(l),t*Math.sin(l)))}break}case"rectangle":o.push(new K(e,t),new K(-e,t),new K(-e,-t),new K(e,-t));break;case"hexagon":for(let a=0;a<6;a++){const c=a/6*je+Math.PI/6;o.push(new K(e*Math.cos(c),t*Math.sin(c)))}break;case"triangle":for(let a=0;a<3;a++){const c=a/3*je-Math.PI/2;o.push(new K(e*Math.cos(c),t*Math.sin(c)))}break;case"star":{const a=Math.max(3,Math.min(12,Math.round(s))),c=Math.max(.1,Math.min(.95,r));for(let l=0;l<a*2;l++){const h=l/(a*2)*je-Math.PI/2,d=l%2===0?1:c;o.push(new K(e*d*Math.cos(h),t*d*Math.sin(h)))}break}}return o}function Zh(i,e){if(i.length===e)return i;const t=i.length,n=[0];for(let o=0;o<t;o++){const a=i[o],c=i[(o+1)%t];n.push(n[o]+Math.hypot(c.x-a.x,c.y-a.y))}const s=n[t],r=[];for(let o=0;o<e;o++){const a=o/e*s;let c=0;for(let m=0;m<t;m++)if(n[m+1]>=a){c=m;break}const l=n[c+1]-n[c],h=l>0?(a-n[c])/l:0,d=i[c],u=i[(c+1)%t];r.push(new K(d.x+(u.x-d.x)*h,d.y+(u.y-d.y)*h))}return r}function qh(i,e,t){if(i.stepApplyToAll)return i.wallProfile;const n=Math.atan2(t,e),s=Rv(n,i);return i.stepEdgeProfiles[s]??i.wallProfile}function Rv(i,e){const t=e.openingShape,n=(i%je+je)%je;if(t==="circle"||t==="ellipse"){const s=e.stepArcDivisions;return Math.floor(n/(je/s))%s}if(t==="rectangle"){const s=n*180/Math.PI;return s<45||s>=315?1:s<135?2:s<225?3:0}if(t==="hexagon")return Math.floor((n+Math.PI/6)%je/(je/6))%6;if(t==="triangle")return Math.floor((n+Math.PI/2)%je/(je/3))%3;if(t==="star"){const s=Math.max(3,Math.min(12,Math.round(e.sides)));return Math.floor((n+Math.PI/2)%je/(je/s))%s}return 0}function jh(i,e,t,n,s){if(t==="full")return!0;if(t==="none")return!1;const o=(t==="zigzag"&&e%2===1?(n+180)%360:n)*Xe,a=(i%je+je)%je,c=(o%je+je)%je,l=c+s*Xe;return l<=je?a>=c&&a<=l:a>=c||a<=l-je}function $h(i,e,t){const n=i.posY,s=i.depth,r=qh(i,e,t);if(r==="step"){const a=Math.min(Math.sqrt((e/i.radiusX)**2+(t/i.radiusZ)**2),1),c=Math.sqrt(Math.max(0,1-i.stepStartDepth/s));if(a>c)return i.stepRiserProfile==="straight"?n-s:n-s*(1-a*a);const l=c>0?a/c:0,h=i.stepCount,d=s-i.stepStartDepth,u=n-s,m=v=>u+v*d/h,g=Math.min(Math.floor(l*h),h-1),_=l*h-Math.floor(l*h),f=1-Jo;if(_<f)return m(g);const p=(_-f)/Jo,x=Math.atan2(t,e);return jh(x,g,i.rampMode,i.rampAngle,i.rampWidth)||i.stepRiserProfile==="straight"?m(g)+p*(m(g+1)-m(g)):n-s*(1-a*a)}if(r==="straight")return n-s;const o=Math.min(Math.sqrt((e/i.radiusX)**2+(t/i.radiusZ)**2),1);return n-s*(1-o*o)}function Kh(i,e){const t=i.posY;if(i.wallProfile==="straight")return t-i.depth;const n=Math.max(i.radiusX,i.radiusZ,.001),s=Math.min(e/n,1);return t-i.depth*(1-s*s)}function Cv(i,e,t,n){const{lx:s,lz:r}=Mn(i.posR,i.posAngle),o=$h(e,s,r),a=i.rotY*Xe,c=Math.cos(-a),l=Math.sin(-a),h=t-s,d=n-r,u=h*c-d*l,m=h*l+d*c,g=Math.min(Math.sqrt((u/i.radiusX)**2+(m/i.radiusZ)**2),1);return o-i.depth*(1-g*g)}function zn(i,e,t){if(i.parentZoneId){const n=t.get(i.parentZoneId);if(n)return(s,r)=>Cv(n,e,s,r)}return(n,s)=>$h(e,n,s)}function bs(i,e){const{lx:t,lz:n}=Mn(e.posR,e.posAngle),s=Math.cos(i.rotY),r=Math.sin(i.rotY);return{wx:i.posX+t*s-n*r,wz:i.posZ+t*r+n*s,wRotY:i.rotY+e.rotY*Xe}}const Jh={water:{color:1736660,opacity:.65,emissive:17663,emissiveIntensity:.08,glowColor:3381759},lava:{color:16724736,opacity:.8,emissive:16720384,emissiveIntensity:.35,glowColor:16737792},swamp:{color:4021274,opacity:.75,emissive:2245632,emissiveIntensity:.05,glowColor:3364096},poison:{color:8913100,opacity:.7,emissive:6684842,emissiveIntensity:.15,glowColor:11141375},sand:{color:13936707,opacity:.85,emissive:0,emissiveIntensity:0,glowColor:null},ice:{color:11197951,opacity:.6,emissive:8965375,emissiveIntensity:.08,glowColor:11197951},void:{color:0,opacity:1,emissive:0,emissiveIntensity:0,glowColor:null},custom:{color:16777215,opacity:.7,emissive:0,emissiveIntensity:0,glowColor:null}},Pv={water:"💧 Water",lava:"🔥 Lava",swamp:"🌿 Swamp",poison:"☠ Poison",sand:"🏜 Sand",ice:"❄ Ice",void:"🌑 Void",custom:"🎨 Custom"};function Qh(i){if(i.fill==="custom")return{color:i.fillColor??16777215,opacity:i.fillOpacity,emissive:0,emissiveIntensity:0,glowColor:null};const e=Jh[i.fill];return{color:e.color,opacity:e.opacity,emissive:e.emissive,emissiveIntensity:e.emissiveIntensity,glowColor:e.glowColor}}function ed(i,e,t=0,n=[]){const s=n.length>0?$i.PARABOLIC_BOWL*2:$i.PARABOLIC_BOWL;return Yh(i,s,(o,a,c)=>t-e*(1-c*c),n,!0)}function Lv(i,e,t=0){const n=i.length,s=[],r=[];for(const a of i)s.push(a.x,t,a.y);for(const a of i)s.push(a.x,t-e,a.y);s.push(0,t-e,0);for(let a=0;a<n;a++){const c=a,l=(a+1)%n,h=n+a,d=n+(a+1)%n;r.push(c,l,h,l,d,h)}for(let a=0;a<n;a++)r.push(2*n,n+(a+1)%n,n+a);const o=new Fe;return o.setAttribute("position",new Ce(s,3)),o.setIndex(r),o.computeVertexNormals(),o}function Iv(i,e,t,n=0){const s=[...Hr(i,n),...t==="straight"?fa(i,n,e):[]],r=new Fe;return r.setAttribute("position",new Ce(s,3)),r}function ma(i,e,t,n,s,r,o=0){const a=i.length,c=Zh(e,a),l=$i.MOAT_HALF,h=o-t,d=t+r,u=i.map((v,S)=>new K((v.x+c[S].x)/2,(v.y+c[S].y)/2)),m=[],g=n==="parabolic"?u:i;for(let v=0;v<=l;v++){const S=v/l,R=1-S,A=n==="parabolic"?o-t*(1-R*R):o-t*S,T=[];for(let C=0;C<a;C++)T.push([i[C].x*(1-S)+g[C].x*S,A,i[C].y*(1-S)+g[C].y*S]);m.push(T)}if(n==="straight"||s==="straight"){const v=s==="parabolic"?u:c,S=8;for(let A=1;A<=S;A++){const T=A/S,C=[];for(let b=0;b<a;b++)C.push([g[b].x*(1-T)+v[b].x*T,h,g[b].y*(1-T)+v[b].y*T]);m.push(C)}const R=s==="parabolic"?u:c;for(let A=1;A<=l;A++){const T=A/l,C=s==="parabolic"?h+d*T*T:h+d*T,b=[];for(let y=0;y<a;y++)b.push([R[y].x*(1-T)+c[y].x*T,C,R[y].y*(1-T)+c[y].y*T]);m.push(b)}}else for(let v=1;v<=l;v++){const S=v/l,R=h+d*S*S,A=[];for(let T=0;T<a;T++)A.push([u[T].x*(1-S)+c[T].x*S,R,u[T].y*(1-S)+c[T].y*S]);m.push(A)}const _=[];for(const v of m)for(const S of v)_.push(S[0],S[1],S[2]);const f=[],p=m.length;for(let v=0;v<p-1;v++){const S=v*a,R=(v+1)*a;for(let A=0;A<a;A++){const T=S+A,C=S+(A+1)%a,b=R+A,y=R+(A+1)%a;f.push(T,C,b,C,y,b)}}const x=new Fe;return x.setAttribute("position",new Ce(_,3)),x.setIndex(f),x.computeVertexNormals(),x}function ga(i,e,t,n,s=0){const r=i.length,o=Zh(e,r),a=s+n,c=Math.max(1,Math.floor(r/8)),l=[...Hr(i,s),...fa(i,s,t)];for(let d=0;d<r;d++){const u=o[d],m=o[(d+1)%r];l.push(u.x,a,u.y,m.x,a,m.y),l.push(u.x,s-t,u.y,m.x,s-t,m.y),d%c===0&&l.push(u.x,a,u.y,u.x,s-t,u.y)}const h=new Fe;return h.setAttribute("position",new Ce(l,3)),h}function td(i,e,t,n=0,s=[]){const r=i.length,o=n-e,a=[],c=[];let l=0;if(t==="parabolic"){const _=s.length>0?$i.PARABOLIC_BOWL*2:$i.STRAIGHT_BOWL;l=wv(i,_,e,n,a,c,l,s)}else{const _=l;for(const x of i)a.push(x.x,n,x.y);const f=_+r;for(const x of i)a.push(x.x,o,x.y);for(let x=0;x<r;x++){const v=_+x,S=_+(x+1)%r,R=f+x,A=f+(x+1)%r;c.push(v,S,R,S,A,R)}const p=f+r;a.push(0,o,0);for(let x=0;x<r;x++)s.length>0&&Wh((i[x].x+i[(x+1)%r].x)/3,(i[x].y+i[(x+1)%r].y)/3,s)||c.push(p,f+x,f+(x+1)%r);l=p+1}const h=l;for(const _ of i)a.push(_.x,n,_.y);const d=h+r;for(const _ of i)a.push(_.x,o,_.y);for(let _=0;_<r;_++){const f=h+_,p=h+(_+1)%r,x=d+_,v=d+(_+1)%r;c.push(f,x,p,p,x,v)}l=d+r;const u=l;a.push(0,o,0);const m=u+1;for(const _ of i)a.push(_.x,o,_.y);for(let _=0;_<r;_++)c.push(u,m+_,m+(_+1)%r);const g=new Fe;return g.setAttribute("position",new Ce(a,3)),g.setIndex(c),g.computeVertexNormals(),g}function Dv(i,e,t=0){const n=[...Hr(i,t),...fa(i,t,e)],s=new Fe;return s.setAttribute("position",new Ce(n,3)),s}function nd(i,e,t,n,s,r,o){const a=i.length,c=Math.cos(r),l=Math.sin(r);function h(f,p){return o(n+f*c-p*l,s+f*l+p*c)}if(t==="parabolic"){const f=h(0,0),p=(x,v,S)=>(S===0?f:h(x,v))-e*(1-S*S)+Nn*S*S;return Yh(i,$i.SCOOP_RINGS,p)}const d=[],u=[],m=h(0,0)-e;for(let f=0;f<a;f++)d.push(i[f].x,h(i[f].x,i[f].y)+Nn,i[f].y);for(let f=0;f<a;f++)d.push(i[f].x,m,i[f].y);const g=2*a;d.push(0,m,0);for(let f=0;f<a;f++){const p=f,x=(f+1)%a,v=a+f,S=a+(f+1)%a;u.push(p,v,x,x,v,S)}for(let f=0;f<a;f++)u.push(g,a+(f+1)%a,a+f);const _=new Fe;return _.setAttribute("position",new Ce(d,3)),_.setIndex(u),_.computeVertexNormals(),_}function id(i,e,t,n,s,r,o){const a=i.length,c=Math.cos(r),l=Math.sin(r);function h(f,p){return o(n+f*c-p*l,s+f*l+p*c)}const u=h(0,0)-e,m=Hr(i.map(f=>new K(f.x,f.y)),0);m.length=0;for(let f=0;f<a;f++){const p=i[f],x=i[(f+1)%a],v=h(p.x,p.y)+Nn,S=h(x.x,x.y)+Nn;m.push(p.x,v,p.y,x.x,S,x.y)}const g=Math.max(1,Math.floor(a/8));for(let f=0;f<a;f+=g){const p=i[f],x=h(p.x,p.y)+Nn;if(t==="parabolic")for(let v=0;v<12;v++){const S=v/12,R=(v+1)/12,A=h(p.x*S,p.y*S),T=h(p.x*R,p.y*R),C=S===0?u:A-e*(1-S*S)+Nn*S*S,b=R===1?x:T-e*(1-R*R)+Nn*R*R;m.push(p.x*S,C,p.y*S,p.x*R,b,p.y*R)}else m.push(p.x,x,p.y,p.x,u,p.y)}const _=new Fe;return _.setAttribute("position",new Ce(m,3)),_}function Vr(i,e,t,n,s,r,o){return{meshGeo:nd(i,e,t,n,s,r,o),edgeGeo:id(i,e,t,n,s,r,o)}}function Ji(i,e,t,n,s){const r=i.length,o=Math.cos(n),a=Math.sin(n);function c(u,m){return s(e+u*o-m*a,t+u*a+m*o)}const l=[],h=[];for(let u=0;u<=Oo;u++){const m=u/Oo;for(let g=0;g<r;g++){const _=i[g].x,f=i[g].y,p=Math.sqrt(_*_+f*f),x=p>0?_+_/p*bl*m:_,v=p>0?f+f/p*bl*m:f;l.push(x,c(x,v)+Nn*(1-m),v)}}for(let u=0;u<Oo;u++)for(let m=0;m<r;m++){const g=u*r+m,_=u*r+(m+1)%r,f=(u+1)*r+m,p=(u+1)*r+(m+1)%r;h.push(g,_,f,_,p,f)}const d=new Fe;return d.setAttribute("position",new Ce(l,3)),d.setIndex(h),d.computeVertexNormals(),d}function El(i,e,t,n,s){const r=[];for(let c=0;c<i;c++){const l=c/i*je+t;r.push(new K(e*Math.cos(l),e*Math.sin(l)))}const o=new zr(r);for(const c of s){if(c.posY>oi)continue;const l=Math.max(c.radiusX,c.radiusZ);if(s.some(_=>{if(_===c||_.posY>oi||Math.max(_.radiusX,_.radiusZ)<=l)return!1;const f=c.posX-_.posX,p=c.posZ-_.posZ,x=Math.cos(-_.rotY),v=Math.sin(-_.rotY),S=f*x-p*v,R=f*v+p*x;return(S/_.radiusX)**2+(R/_.radiusZ)**2<=1}))continue;const d=pt(c),u=Math.cos(c.rotY),m=Math.sin(c.rotY),g=d.map(_=>new K(_.x*u-_.y*m+c.posX,_.x*m+_.y*u+c.posZ)).reverse();o.holes.push(new ms(g))}const a=new Ms(o);return a.rotateX(Math.PI/2),a.translate(0,n,0),a}function Al(i,e,t){const n=-i.depth,s=Math.cos(i.rotY),r=Math.sin(i.rotY),o=pt(i).map(l=>new K(l.x*s-l.y*r,l.x*r+l.y*s)),a=new zr(o);for(const l of[...e,...t]){const{lx:h,lz:d}=Mn(l.posR,l.posAngle),u=h*s-d*r,m=h*r+d*s,g=Math.cos(l.rotY*Xe),_=Math.sin(l.rotY*Xe),f=pt(l).map(p=>new K(p.x*g-p.y*_+u,p.x*_+p.y*g+m)).reverse();a.holes.push(new ms(f))}const c=new Ms(a);return c.rotateX(Math.PI/2),c.translate(0,n,0),c}function Tl(i,e=[]){const t=i.innerRimOffset,n=pt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner}),s=new zr(n);for(const o of e){const a=new ms;a.absellipse(o.cx,o.cz,o.rx,o.rz,0,je,!1,0),s.holes.push(a)}const r=new Ms(s);return r.rotateX(Math.PI/2),r.translate(0,t,0),r}function Nv(i,e,t){if(i.wallProfile==="straight")return new L(-e,0,-t).normalize();const n=i.radiusX,s=i.radiusZ,r=i.depth;return new L(-2*r*e/(n*n),1,-2*r*t/(s*s)).normalize()}function Uv(i,e,t){return t.surfaceFollow?Nv(e,i.x-e.posX,i.z-e.posZ):new L(0,1,0)}function sd(i,e){const{lx:t,lz:n}=Mn(i.startR,i.startAngle),s=e(t,n)+Ee.SURFACE_LIFT,r=new L(t,s,n);let o=new Xt().setFromEuler(new en(0,i.startDir*Xe,0));const a=[r.clone()],c=Ee.SUB_STEPS_PER_SEG;for(const l of i.segments){if(new L(0,0,1).applyQuaternion(o),new L(1,0,0).applyQuaternion(o),l.rotY!==0&&(o=new Xt().setFromAxisAngle(new L(0,1,0),l.rotY*Xe).multiply(o)),l.rotX!==0){const u=new L(1,0,0).applyQuaternion(o);o=new Xt().setFromAxisAngle(u,l.rotX*Xe).multiply(o)}if(l.rotZ!==0){const u=new L(0,0,1).applyQuaternion(o);o=new Xt().setFromAxisAngle(u,l.rotZ*Xe).multiply(o)}const h=new L(0,0,1).applyQuaternion(o),d=l.length/c;for(let u=0;u<c;u++)r.addScaledVector(h,d),i.surfaceFollow&&(r.y=e(r.x,r.z)+Ee.SURFACE_LIFT),a.push(r.clone())}return a}function Ov(i){const e=Ee.SUB_STEPS_PER_SEG,t=[i[0].clone()];for(let n=1;n<i.length;n++)n%e===0&&t.push(i[n].clone());return(i.length-1)%e!==0&&t.push(i[i.length-1].clone()),t}function Fv(i,e,t){const n=i.length;if(n<2)return new Fe;const s=[],r=[];for(let a=0;a<n;a++){const c=i[a],l=e[a];let h;a===0?h=i[1].clone().sub(i[0]):a===n-1?h=i[n-1].clone().sub(i[n-2]):h=i[a+1].clone().sub(i[a-1]),h.lengthSq()<1e-12&&h.set(0,0,1),h.normalize();const d=new L().crossVectors(h,l).normalize();d.lengthSq()<1e-12&&d.set(1,0,0);const u=c.clone().addScaledVector(d,-t/2),m=c.clone().addScaledVector(d,t/2);s.push(u.x,u.y,u.z),s.push(m.x,m.y,m.z)}for(let a=0;a<n-1;a++){const c=a*2,l=a*2+1,h=(a+1)*2,d=(a+1)*2+1;r.push(c,l,h,l,d,h)}const o=new Fe;return o.setAttribute("position",new Ce(s,3)),o.setIndex(r),o.computeVertexNormals(),o}function Bv(i,e){const t=new ui(Ee.MARKER_SIZE,8,6),n=new Qt({color:e,depthTest:!1,transparent:!0,opacity:.9}),s=new Be(t,n);return s.position.copy(i),s}function zv(i,e){const t=new Br(Ee.MARKER_SIZE*.8,Ee.MARKER_SIZE*2,6),n=new Qt({color:e,depthTest:!1,transparent:!0,opacity:.9}),s=new Be(t,n);return s.position.copy(i),s}function kv(i,e,t){const n=[];let s=0;for(let r=1;r<i.length;r++){const o=i[r].distanceTo(i[r-1]);if(s+=o,s>=Ee.ARROW_SPACING){s=0;const a=i[r].clone().sub(i[r-1]).normalize();t==="reverse"&&a.negate();const c=new Br(Ee.ARROW_HALF_W,Ee.ARROW_LEN,4),l=new Qt({color:e,depthTest:!1,transparent:!0,opacity:.7}),h=new Be(c,l);h.position.copy(i[r]);const d=new L(0,1,0);Math.abs(a.dot(d))<.99&&h.quaternion.setFromUnitVectors(d,a),n.push(h)}}return n}function Hv(i,e,t){const s=[];for(let a=0;a<=32;a++){const c=a/32*Math.PI*2;s.push(new L(i.x+Math.cos(c)*e,i.y+.05,i.z+Math.sin(c)*e))}const r=new Fe().setFromPoints(s),o=new kt({color:t,transparent:!0,opacity:.5});return new Be(r,o)}function Gv(i,e){const t=[];for(let n=0;n<i.length;n++){const s=new ui(Ee.HANDLE_RADIUS,8,6),r=new Qt({color:Ee.HANDLE_COLOR,depthTest:!1,transparent:!0,opacity:.9}),o=new Be(s,r);o.position.copy(i[n]);const a=n===0?"start":`joint_${n}`;o.userData={slId:e.id,handleType:a,handleIndex:n},t.push({mesh:o,type:a,index:n})}return t}function Vv(i){const e=new ui(Ee.OVERLAP_SPHERE_R,8,6),t=new Qt({color:16729088,transparent:!0,opacity:.6}),n=new Be(e,t);return n.position.copy(i),n}function wl(i,e){return sd(i,e)}function yn(i,e=0,t=0,n=0,s=0){return{id:"",length:i,rotX:e,rotY:t,rotZ:n,speedMult:s,objRotX:0,objRotY:0,objRotZ:0}}function Wv(i,e){const t=i/e;return Array.from({length:e},()=>yn(t))}function Xv(i,e){const n=2*Math.PI*i/e,s=360/e;return Array.from({length:e},()=>yn(n,0,s))}function Yv(i,e,t){const s=2*Math.PI*i*e/t,r=e*360/t;return Array.from({length:t},()=>yn(s,1,r))}function Zv(i,e,t){const n=Math.atan2(i,e)*(180/Math.PI)*2;return Array.from({length:t},(s,r)=>yn(e,0,r%2===0?n:-n))}function qv(i,e,t){return Array.from({length:t},(n,s)=>{const r=Math.sin(s/t*Math.PI*2)*i;return yn(e,0,r)})}function jv(i,e,t){return Array.from({length:e},()=>yn(t,i))}function $v(i,e){const n=2*Math.PI*i/e,s=360/e;return Array.from({length:e},()=>yn(n,s))}function Kv(i,e,t){const s=2*Math.PI*i*e/t,r=e*360/t;return Array.from({length:t},()=>yn(s,5,r))}function Jv(i,e,t,n){return Array.from({length:t},(s,r)=>{const o=r/(t-1),a=yn(n,i*o);return a.speedMult=1+(e-1)*o,a})}function Qv(i,e,t=[]){const{depth:n,radiusX:s,radiusZ:r,stepCount:o,stepStartDepth:a,stepRiserProfile:c,rampMode:l,rampAngle:h,rampWidth:d}=i,u=e-n,m=n-a,g=Math.sqrt(Math.max(0,1-a/n)),_=1-Jo,f=P=>u+P*m/o,p=P=>e-n*(1-P*P),x=(P,N)=>s*P*Math.cos(N),v=(P,N)=>r*P*Math.sin(N),S=[],R=[],A=[],T=yv;function C(P,N,U,G,Z,F,j,k,ie,se,he,we){const Le=(x(P,N)+x(U,G)+x(Z,F)+x(j,k))*.25,$=(v(P,N)+v(U,G)+v(Z,F)+v(j,k))*.25;if(t.length>0&&Wh(Le,$,t))return;const ee=S.length/3;S.push(x(P,N),ie,v(P,N)),S.push(x(U,G),se,v(U,G)),S.push(x(Z,F),he,v(Z,F)),S.push(x(j,k),we,v(j,k)),R.push(ee,ee+1,ee+2,ee+1,ee+3,ee+2)}for(let P=0;P<T;P++){const N=P/T*je,U=(P+1)/T*je;A.push(x(1,N),e,v(1,N),x(1,U),e,v(1,U))}for(let P=0;P<T;P++){const N=P/T*je,U=(P+1)/T*je,G=(N+U)*.5,Z=qh(i,s*.5*Math.cos(G),r*.5*Math.sin(G));if(Z!=="step"){for(let j=0;j<24;j++){const k=j/24,ie=(j+1)/24,se=Z==="straight"?u:p(k),he=Z==="straight"?u:p(ie);C(k,N,k,U,ie,N,ie,U,se,se,he,he)}continue}if(a>0&&g<1){const F=Math.max(4,Math.round((1-g)*20));for(let j=0;j<F;j++){const k=g+j/F*(1-g),ie=g+(j+1)/F*(1-g),se=c==="straight"?u:p(k),he=c==="straight"?u:p(ie);C(k,N,k,U,ie,N,ie,U,se,se,he,he)}A.push(x(g,N),f(o),v(g,N),x(g,U),f(o),v(g,U))}for(let F=0;F<o;F++){const j=F/o,k=j+_/o,ie=(F+1)/o,se=j*g,he=k*g,we=ie*g,Le=f(F),ee=jh(G,F,l,h,d)||c==="straight"?f(F+1):p(we);C(se,N,se,U,he,N,he,U,Le,Le,Le,Le),C(he,N,he,U,we,N,we,U,Le,Le,ee,ee),A.push(x(we,N),Le,v(we,N),x(we,U),Le,v(we,U))}}const b=new Fe;b.setAttribute("position",new Ce(S,3)),b.setIndex(R),b.computeVertexNormals();const y=new Fe;return y.setAttribute("position",new Ce(A,3)),{geo:b,edgeGeo:y}}function ex(i,e,t,n,s){const{depth:r,radiusX:o,radiusZ:a,color:c,spiralTurns:l,spiralClockwise:h,spiralLedgeWidth:d,spiralLedgeHeight:u,spiralRadiusFrac:m}=i,g=e-r,_=t/n*je,f=l*je*(h?1:-1),p=Math.ceil(l*bv),x=Math.max(o,a,.001),v=m,S=Math.max(0,m-d/x),R=[],A=[];for(let N=0;N<=p;N++){const U=N/p,G=_+U*f,Z=Math.cos(G),F=Math.sin(G),j=g+U*Math.max(0,r-u),k=j+u;if(R.push(v*o*Z,j,v*a*F),R.push(S*o*Z,j,S*a*F),R.push(v*o*Z,k,v*a*F),R.push(S*o*Z,k,S*a*F),N<p){const ie=N*4,se=(N+1)*4;A.push(ie+2,ie+3,se+2,ie+3,se+3,se+2),A.push(ie,se,ie+1,se,se+1,ie+1),A.push(ie,ie+2,se,ie+2,se+2,se),A.push(ie+1,se+1,ie+3,se+1,se+3,ie+3)}}const T=new Fe;T.setAttribute("position",new Ce(R,3)),T.setIndex(A),T.computeVertexNormals();const C={abs:[.65,0],metal:[.15,.88],stone:[.9,.02],rubber:[.95,0]},[b,y]=s?C[s]:[.65,.08],P=new ri({color:new ve(c).lerp(new ve(16777215),.3),side:Et,roughness:b,metalness:y});return new Be(T,P)}function Es(i){return new ve(i).lerp(new ve(16777215),.5)}function tx(i){return i.isMoat||i.posY>oi?!1:i.stepApplyToAll?i.wallProfile==="step":i.stepEdgeProfiles.some(e=>e==="step")}function nx(i){return!i.isMoat&&i.stepApplyToAll&&i.wallProfile==="spiral"}function ix(i){const e=i.wallProfile;return e==="parabolic"||e==="spiral"?"parabolic":e==="step"?i.stepRiserProfile==="straight"?"straight":"parabolic":"straight"}function rd(i,e,t,n){if(i.isMoat){const a=pt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});return[ma(e,a,i.depth,i.wallProfile,i.innerWallProfile,i.innerRimOffset,t),ga(e,a,i.depth,i.innerRimOffset,t)]}if(i.posY>oi)return[td(e,i.depth,i.wallProfile,t,n),Dv(e,i.depth,t)];if(tx(i)){const{geo:a,edgeGeo:c}=Qv(i,t,n);return[a,c]}const s=ix(i),r=s==="parabolic"?ed(e,i.depth,t,n):Lv(e,i.depth,t),o=Iv(e,i.depth,s,t);return[r,o]}function od(i,e){const t=[];if(!nx(i))return t;for(let n=0;n<i.spiralCount;n++){const s=ex(i,0,n,i.spiralCount,i.baseMaterial);s.position.set(i.posX,i.posY,i.posZ),s.rotation.y=i.rotY,e.add(s),t.push(s)}return t}function sx(i,e){for(const t of i.spiralMeshes)e&&e.remove(t),t.geometry.dispose(),t.material.dispose();i.spiralMeshes=[]}function Rl(i,e=[],t){const n=pt(i),s=ut({color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale,baseMaterial:i.baseMaterial}),r=0,[o,a]=rd(i,n,r,e),c=new Be(o,s);c.position.set(i.posX,i.posY,i.posZ),c.rotation.y=i.rotY;const l=new Yt(a,new kt({color:Es(i.color)}));return l.position.set(i.posX,i.posY,i.posZ),l.rotation.y=i.rotY,t&&(i.spiralMeshes=od(i,t)),[c,l]}function Fo(i,e=[],t){const n=pt(i);i.mesh.geometry.dispose(),i.edges.geometry.dispose();const s=0,[r,o]=rd(i,n,s,e);i.mesh.geometry=r,i.edges.geometry=o;for(const a of[i.mesh,i.edges])a.position.set(i.posX,i.posY,i.posZ),a.rotation.y=i.rotY;t&&(sx(i,t),i.spiralMeshes=od(i,t))}function Cl(i,e,t,n,s){const r=pt(i),a=Ji(r,0,0,0,(h,d)=>0),c=ut({color:e,surface:t,customTileData:n,tileScale:s}),l=new Be(a,c);return l.position.set(i.posX,i.posY,i.posZ),l.rotation.y=i.rotY,l}function Pl(i){const e={color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale,baseMaterial:i.baseMaterial};Ev(e),i.mesh.material=ut(e),i.edges.material.color.copy(Es(i.color))}function Ll(i,e,t,n){const s=pt(i),r=ut({color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale}),{cx:o,cz:a,rotY:c}=Gr(i),l=zn({parentZoneId:null},e,n),{meshGeo:h,edgeGeo:d}=Vr(s,i.depth,"straight",o,a,c,l),{wx:u,wz:m,wRotY:g}=bs(e,i),_=new Be(h,r);_.position.set(u,0,m),_.rotation.y=g;const f=new Yt(d,new kt({color:Es(i.color)}));f.position.set(u,0,m),f.rotation.y=g;const p=ut({color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale}),x=new Be(Ji(s,o,a,c,l),p);return x.position.set(u,0,m),x.rotation.y=g,[_,f,x]}function Qn(i,e,t,n){const s=pt(i),{cx:r,cz:o,rotY:a}=Gr(i),c=zn({parentZoneId:null},e,n);i.mesh.geometry.dispose(),i.edges.geometry.dispose();const{meshGeo:l,edgeGeo:h}=Vr(s,i.depth,"straight",r,o,a,c);i.mesh.geometry=l,i.edges.geometry=h,i.seamMesh.geometry.dispose(),i.seamMesh.geometry=Ji(s,r,o,a,c);const{wx:d,wz:u,wRotY:m}=bs(e,i);for(const g of[i.mesh,i.edges,i.seamMesh])g.position.set(d,0,u),g.rotation.y=m}function Bo(i,e,t,n){const s=pt(i),{cx:r,cz:o,rotY:a}=Gr(i),c=zn(i,e,n),l=Qh(i);let h,d;if(i.isMoat){const x=Kh(e,i.posR),v=pt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});h=ma(s,v,i.depth,"parabolic",i.innerWallProfile,i.innerRimOffset,x),d=ga(s,v,i.depth,i.innerRimOffset,x)}else({meshGeo:h,edgeGeo:d}=Vr(s,i.depth,"parabolic",r,o,a,c));const{wx:u,wz:m,wRotY:g}=bs(e,i),_=new Be(h,Cr(l,i.fillOpacity));_.position.set(u,0,m),_.rotation.y=g;const f=new Yt(d,new kt({color:Es(l.color)}));f.position.set(u,0,m),f.rotation.y=g;const p=new Be(Ji(s,r,o,a,c),Cr(l,i.fillOpacity));return p.position.set(u,0,m),p.rotation.y=g,[_,f,p]}function lr(i,e,t,n,s){const r=pt(i),{cx:o,cz:a,rotY:c}=Gr(i),{wx:l,wz:h,wRotY:d}=bs(e,i),u=zn(i,e,s),m=Qh(i);if(i.mesh.geometry.dispose(),i.edges.geometry.dispose(),i.isMoat){const g=Kh(e,i.posR),_=pt({openingShape:i.innerOpeningShape,radiusX:i.innerRadiusX,radiusZ:i.innerRadiusZ,sides:i.innerSides,starInner:i.innerStarInner});i.mesh.geometry=ma(r,_,i.depth,"parabolic",i.innerWallProfile,i.innerRimOffset,g),i.edges.geometry=ga(r,_,i.depth,i.innerRimOffset,g)}else{const{meshGeo:g,edgeGeo:_}=Vr(r,i.depth,"parabolic",o,a,c,u);i.mesh.geometry=g,i.edges.geometry=_}i.mesh.material.dispose(),i.mesh.material=Cr(m,i.fillOpacity),i.edges.material.color.copy(Es(m.color));for(const g of[i.mesh,i.edges])g.position.set(l,0,h),g.rotation.y=d;i.seamMesh.geometry.dispose(),i.seamMesh.geometry=Ji(r,o,a,c,u),i.seamMesh.material.dispose(),i.seamMesh.material=Cr(m,i.fillOpacity),i.seamMesh.position.set(l,0,h),i.seamMesh.rotation.y=d}function rx(i,e){return{id:i,length:Ee.DEFAULT_SEG_LENGTH,rotX:0,rotY:0,rotZ:0,speedMult:0,objRotX:0,objRotY:0,objRotZ:0}}function ox(i,e,t,n=null){return{id:t,name:i,parentArenaId:e,parentZoneId:n,startR:0,startAngle:0,startDir:0,segments:[rx(`${t}-seg-0`)],surfaceFollow:!0,targetType:Ee.DEFAULT_TARGET,targetTag:"",activationMode:Ee.DEFAULT_ACTIVATION,triggerEvent:"",endEvent:"",activeDuration:0,period:Ee.DEFAULT_PERIOD_MS,activeDuty:Ee.DEFAULT_DUTY,activationRadius:Ee.DEFAULT_PROX_RADIUS,fadeIn:Ee.DEFAULT_FADE_MS,fadeOut:Ee.DEFAULT_FADE_MS,oscillate:!1,oscAxis:Ee.DEFAULT_OSC_AXIS,oscAmplitude:Ee.DEFAULT_OSC_AMP,oscFrequency:Ee.DEFAULT_OSC_FREQ,oscPhase:Ee.DEFAULT_OSC_PHASE,width:Ee.DEFAULT_WIDTH,color:Ee.DEFAULT_COLOR,opacity:Ee.DEFAULT_OPACITY,glowColor:null,speedMultiplier:Ee.DEFAULT_SPEED_MULT,entryCondition:"always",direction:Ee.DEFAULT_DIRECTION,exitBehavior:Ee.DEFAULT_EXIT,launchForce:Ee.DEFAULT_LAUNCH_FORCE,specialMoveName:"",allowMidAirEntry:!1,overridePhysics:!1,swapPriority:Ee.DEFAULT_SWAP_PRIORITY,totalLength:0,mesh:null,edges:null,markerMeshes:[],handleMeshes:[],overlapMarkers:[]}}function Qo(i,e,t){const n=zn({parentZoneId:i.parentZoneId},e,t),s=sd(i,n),r=s.map(C=>Uv(C,e,i)),o=Fv(s,r,i.width),a=i.activationMode!=="always",c=a?i.opacity*Ee.INACTIVE_OPACITY_MULT:i.opacity,l=new ri({color:i.color,emissive:i.glowColor??i.color,emissiveIntensity:i.glowColor?.6:.2,transparent:!0,opacity:c,side:Et,depthWrite:!1}),h=new Be(o,l),d=s.map(C=>C.clone()),u=new Fe().setFromPoints(d),m=new kt({color:i.color,transparent:!0,opacity:a?.3:.6}),g=new Yt(u,m);let _=0;for(let C=1;C<s.length;C++)_+=s[C].distanceTo(s[C-1]);const f=[];s.length>0&&f.push(Bv(s[0],i.color)),i.exitBehavior!=="loop"&&s.length>1&&f.push(zv(s[s.length-1],i.color));const p=kv(s,i.color,i.direction==="bidirectional"?"bidirectional":i.direction==="reverse"?"reverse":"forward");f.push(...p),i.activationMode==="proximity"&&s.length>0&&f.push(Hv(s[0],i.activationRadius,i.color));const x=Ov(s),S=Gv(x,i).map(C=>C.mesh);S.forEach(C=>{C.visible=!1});const R=e.posX,A=e.posZ,T=e.rotY*Xe;for(const C of[h,g,...f,...S])C.position.set(R,0,A),C.rotation.y=T;return{mesh:h,edges:g,markerMeshes:f,handleMeshes:S,totalLength:_}}function ax(i,e,t,n,s,r){i.mesh&&(r(i.mesh),i.mesh.geometry.dispose(),i.mesh.material.dispose()),i.edges&&(r(i.edges),i.edges.geometry.dispose(),i.edges.material.dispose());for(const d of i.markerMeshes)r(d),d.geometry.dispose(),d.material.dispose();for(const d of i.handleMeshes)r(d),d.geometry.dispose(),d.material.dispose();for(const d of i.overlapMarkers)r(d),d.geometry.dispose(),d.material.dispose();i.markerMeshes=[],i.handleMeshes=[],i.overlapMarkers=[];const{mesh:o,edges:a,markerMeshes:c,handleMeshes:l,totalLength:h}=Qo(i,e,t);i.mesh=o,i.edges=a,i.markerMeshes=c,i.handleMeshes=l,i.totalLength=h,s(o,a,...c,...l)}function cx(i){return{name:i,openingShape:"circle",wallProfile:"parabolic",radiusX:50,radiusZ:50,depth:20,sides:5,starInner:.5,color:8947848,surface:"plain",customTileData:null,tileScale:20,baseMaterial:Ch,posX:0,posZ:0,posY:0,rotY:0,isMoat:!1,innerRadiusX:25,innerRadiusZ:25,innerOpeningShape:"circle",innerSides:5,innerStarInner:.5,innerWallProfile:"parabolic",innerRimOffset:0,stepApplyToAll:!0,stepEdgeProfiles:[],stepArcDivisions:Oh,stepCount:Lh,stepStartDepth:Ih,stepRiserProfile:Dh,rampMode:"full",rampAngle:Nh,rampWidth:Uh,spiralTurns:Fh,spiralClockwise:!0,spiralCount:Bh,spiralLedgeWidth:zh,spiralLedgeHeight:kh,spiralRadiusFrac:Hh,spiralMeshes:[],pitIds:[],zoneIds:[],wallIds:[],speedLineIds:[],mesh:null,edges:null,floorMesh:null,islandMesh:null,rimSeamMesh:null}}function Il(i,e,t){return{id:t,name:i,parentArenaId:e,openingShape:"circle",radiusX:10,radiusZ:10,depth:8,sides:5,starInner:.5,color:5592405,surface:"plain",customTileData:null,tileScale:10,posR:0,posAngle:0,rotY:0,mesh:null,edges:null,seamMesh:null}}function Dl(i,e,t,n=null){return{id:t,name:i,parentArenaId:e,parentZoneId:n,openingShape:"circle",radiusX:15,radiusZ:15,depth:8,sides:5,starInner:.5,color:3368601,surface:"plain",customTileData:null,tileScale:10,fill:"water",fillColor:null,fillOpacity:.65,posR:0,posAngle:0,rotY:0,isMoat:!1,innerRadiusX:8,innerRadiusZ:8,innerOpeningShape:"circle",innerSides:5,innerStarInner:.5,innerWallProfile:"parabolic",innerRimOffset:0,pitIds:[],zoneIds:[],speedLineIds:[],mesh:null,edges:null,seamMesh:null}}const Nl={circle:"Circle",ellipse:"Ellipse",rectangle:"Rect",hexagon:"Hexagon",triangle:"Triangle",star:"Star"},Ul={circle:"●",ellipse:"◯",rectangle:"▭",hexagon:"⬡",triangle:"△",star:"★"},hr={plain:"Plain",checker:"Checker",grid:"Grid",hex:"Hex",stripes:"Stripes",dots:"Dots",concrete:"Concrete",metal:"Metal",wood:"Wood",ice:"Ice",sand:"Sand",lava_rock:"Lava",custom_png:"Custom"};class lx extends Rh{constructor(){super(...arguments);W(this,"_stepCountSlider",null)}showBase(t,n,s,r){this.content.innerHTML="",this.section("OCTAGON BASE"),this.readRow("Flat-to-flat","200 cm"),this.numRow("Height",t.height,5,80,1,a=>{t.height=a,n()}),this.numRow("Sides",t.sides,3,16,1,a=>{t.sides=Math.round(a),n()}),this.section("SURFACE"),this.colorRow("Color",t.color,a=>{t.color=a,s(a)}),this.surfaceRow(t,r);const o=document.createElement("div");o.className="prop-hint",o.textContent="Click [+] on the base node to add an arena",this.content.appendChild(o)}showArena(t,n,s,r,o,a,c){this.content.innerHTML="",this.section("NAME");const l=document.createElement("input");l.type="text",l.className="prop-text-input",l.value=t.name,l.addEventListener("input",()=>{t.name=l.value,o(t.name)}),this.content.appendChild(l),this.section("OPENING SHAPE"),this.shapeGrid(t,r),t.openingShape==="star"&&(this.numRow("Points",t.sides,3,12,1,h=>{t.sides=Math.round(h),r()}),this.numRow("Inner frac",t.starInner,.1,.95,.05,h=>{t.starInner=h,s()})),this.section("MOAT"),this.toggleRow("Ring/Moat",t.isMoat,h=>{t.isMoat=h,r()}),t.isMoat&&(this.numRow("Inner R X",t.innerRadiusX,5,t.radiusX-5,1,h=>{t.innerRadiusX=h,s()}),this.numRow("Inner R Z",t.innerRadiusZ,5,t.radiusZ-5,1,h=>{t.innerRadiusZ=h,s()}),this.numRow("Inner Y offset",t.innerRimOffset,-t.depth+1,200,1,h=>{t.innerRimOffset=h,s()}),this.section("INNER SHAPE"),this.innerShapeGrid(t,r),this.section("OUTER WALL"),this.profileRow(t,"wallProfile",r),this.section("INNER WALL"),this.innerProfileRow(t,r)),t.isMoat||(this.section("WALL PROFILE"),this.wallProfileSection(t,r,s)),this.section("DIMENSIONS"),this.numRow("Radius X",t.radiusX,5,vn,1,h=>{t.radiusX=h,s(),this._refreshStepCountMax(t)}),this.numRow("Radius Z",t.radiusZ,5,vn,1,h=>{t.radiusZ=h,s()}),this.numRow("Depth",t.depth,1,n,.5,h=>{t.depth=h,this._refreshStepCountMax(t),s()}),this.section("SURFACE"),this.materialRow(t,a),this.colorRow("Color",t.color,h=>{t.color=h,a()}),this.surfaceRow(t,c),this.section("POSITION"),this.numRow("X",t.posX,-vn,vn,1,h=>{t.posX=h,s()}),this.numRow("Z",t.posZ,-vn,vn,1,h=>{t.posZ=h,s()}),this.numRow("Y (tower)",t.posY,0,200,1,h=>{t.posY=h,s()}),this.numRow("Rot Y °",Bn.radToDeg(t.rotY),-180,180,1,h=>{t.rotY=Bn.degToRad(h),s()})}showPit(t,n,s,r,o,a,c){this.content.innerHTML="",this.section("NAME");const l=document.createElement("input");l.type="text",l.className="prop-text-input",l.value=t.name,l.addEventListener("input",()=>{t.name=l.value,o(t.name)}),this.content.appendChild(l),this.section("OPENING SHAPE"),this.shapeGrid(t,r),t.openingShape==="star"&&(this.numRow("Points",t.sides,3,12,1,u=>{t.sides=Math.round(u),r()}),this.numRow("Inner frac",t.starInner,.1,.95,.05,u=>{t.starInner=u,s()})),this.section("DIMENSIONS");const h=Math.min(n.radiusX,n.radiusZ);this.numRow("Radius X",t.radiusX,2,Math.max(2,h-t.posR),1,u=>{t.radiusX=u,s()}),this.numRow("Radius Z",t.radiusZ,2,Math.max(2,h-t.posR),1,u=>{t.radiusZ=u,s()}),this.numRow("Depth",t.depth,1,n.depth,.5,u=>{t.depth=u,s()}),this.section("SURFACE"),this.colorRow("Color",t.color,u=>{t.color=u,a()}),this.surfaceRow(t,c),this.section("POSITION (arena-local)");const d=Math.max(t.radiusX,t.radiusZ);this.numRow("Dist (cm)",t.posR,0,Math.max(0,h-d),1,u=>{t.posR=u,s()}),this.numRow("Angle °",t.posAngle,0,360,1,u=>{t.posAngle=u,s()}),this.numRow("Rotate °",t.rotY,0,360,1,u=>{t.rotY=u,s()})}showZone(t,n,s,r,o){this.content.innerHTML="",this.section("NAME");const a=document.createElement("input");a.type="text",a.className="prop-text-input",a.value=t.name,a.addEventListener("input",()=>{t.name=a.value,o(t.name)}),this.content.appendChild(a),this.section("OPENING SHAPE"),this.shapeGrid(t,r),t.openingShape==="star"&&(this.numRow("Points",t.sides,3,12,1,d=>{t.sides=Math.round(d),r()}),this.numRow("Inner frac",t.starInner,.1,.95,.05,d=>{t.starInner=d,s()})),this.section("MOAT"),this.toggleRow("Ring/Moat",t.isMoat,d=>{t.isMoat=d,r()}),t.isMoat&&(this.numRow("Inner R X",t.innerRadiusX,2,t.radiusX-2,1,d=>{t.innerRadiusX=d,s()}),this.numRow("Inner R Z",t.innerRadiusZ,2,t.radiusZ-2,1,d=>{t.innerRadiusZ=d,s()}),this.numRow("Inner Y offset",t.innerRimOffset,-(t.depth-1),100,1,d=>{t.innerRimOffset=d,s()}),this.section("INNER SHAPE"),this.innerShapeGrid(t,r),this.section("INNER WALL"),this.innerProfileRow(t,r)),this.section("DIMENSIONS");const c=Math.min(n.radiusX,n.radiusZ),l=Math.min(15,n.depth);this.numRow("Radius X",t.radiusX,2,Math.max(2,c-t.posR),1,d=>{t.radiusX=d,s()}),this.numRow("Radius Z",t.radiusZ,2,Math.max(2,c-t.posR),1,d=>{t.radiusZ=d,s()}),this.numRow("Depth",t.depth,1,l,.5,d=>{t.depth=d,s()}),this.section("FILL"),this.fillGrid(t,s),this.section("POSITION (arena-local)");const h=Math.max(t.radiusX,t.radiusZ);this.numRow("Dist (cm)",t.posR,0,Math.max(0,c-h),1,d=>{t.posR=d,s()}),this.numRow("Angle °",t.posAngle,0,360,1,d=>{t.posAngle=d,s()}),this.numRow("Rotate °",t.rotY,0,360,1,d=>{t.rotY=d,s()})}shapeGrid(t,n){const s=document.createElement("div");s.className="prop-shape-grid",["circle","ellipse","rectangle","hexagon","triangle","star"].forEach(r=>{const o=document.createElement("button");o.className="prop-shape-btn"+(t.openingShape===r?" active":""),o.innerHTML=`<span class="prop-shape-icon">${Ul[r]}</span><span>${Nl[r]}</span>`,o.addEventListener("click",()=>{t.openingShape=r,n()}),s.appendChild(o)}),this.content.appendChild(s)}innerShapeGrid(t,n){const s=document.createElement("div");s.className="prop-shape-grid",["circle","ellipse","rectangle","hexagon","triangle","star"].forEach(r=>{const o=document.createElement("button");o.className="prop-shape-btn"+(t.innerOpeningShape===r?" active":""),o.innerHTML=`<span class="prop-shape-icon">${Ul[r]}</span><span>${Nl[r]}</span>`,o.addEventListener("click",()=>{t.innerOpeningShape=r,n()}),s.appendChild(o)}),this.content.appendChild(s),t.innerOpeningShape==="star"&&(this.numRow("Points",t.innerSides,3,12,1,r=>{t.innerSides=Math.round(r),n()}),this.numRow("Inner frac",t.innerStarInner,.1,.95,.05,r=>{t.innerStarInner=r,n()}))}_refreshStepCountMax(t){if(!this._stepCountSlider)return;const n=Math.max(1,Math.floor((t.depth-t.stepStartDepth)/10));this._stepCountSlider.max=String(n),t.stepCount>n&&(t.stepCount=n),this._stepCountSlider.value=String(t.stepCount)}profileRow(t,n,s){const r=document.createElement("div");r.className="prop-profile-row";const o=[["parabolic","⌣ Bowl"],["straight","▮ Straight"],["step","▭ Step"],["spiral","↺ Spiral"]];for(const[a,c]of o){const l=document.createElement("button");l.className="prop-profile-btn"+(t.wallProfile===a?" active":""),l.textContent=c,l.addEventListener("click",()=>{t.wallProfile=a,s()}),r.appendChild(l)}this.content.appendChild(r)}innerProfileRow(t,n){const s=document.createElement("div");s.className="prop-profile-row";const r=[["parabolic","⌣ Bowl"],["straight","▮ Straight"],["step","▭ Step"]];for(const[o,a]of r){const c=document.createElement("button");c.className="prop-profile-btn"+(t.innerWallProfile===o?" active":""),c.textContent=a,c.addEventListener("click",()=>{t.innerWallProfile=o,n()}),s.appendChild(c)}this.content.appendChild(s)}wallProfileSection(t,n,s){const r=t.openingShape==="circle"||t.openingShape==="ellipse";if(this.toggleRow("Apply to all edges",t.stepApplyToAll,a=>{t.stepApplyToAll=a,a&&t.wallProfile==="step"&&(t.stepEdgeProfiles=[]),n()}),t.stepApplyToAll){const a=document.createElement("div");a.className="prop-profile-row";const c=[["parabolic","⌣ Bowl"],["straight","▮ Straight"],["step","▭ Step"],["spiral","↺ Spiral"]];for(const[l,h]of c){const d=document.createElement("button");d.className="prop-profile-btn"+(t.wallProfile===l?" active":""),d.textContent=h,d.addEventListener("click",()=>{t.wallProfile=l,n()}),a.appendChild(d)}this.content.appendChild(a)}else{if(r){const l=document.createElement("div");l.className="prop-profile-row";const h=document.createElement("span");h.className="prop-row-label",h.textContent="Arc Divs",l.appendChild(h);for(const d of[1,2,4,8]){const u=document.createElement("button");u.className="prop-profile-btn"+(t.stepArcDivisions===d?" active":""),u.textContent=String(d),u.addEventListener("click",()=>{t.stepArcDivisions=d,n()}),l.appendChild(u)}this.content.appendChild(l)}const a=this._edgeCount(t),c=this._edgeLabels(t,a);t.stepEdgeProfiles.length!==a&&(t.stepEdgeProfiles=Array.from({length:a},(l,h)=>t.stepEdgeProfiles[h]??t.wallProfile??"parabolic"));for(let l=0;l<a;l++){const h=document.createElement("div");h.className="prop-edge-label",h.textContent=c[l],this.content.appendChild(h);const d=document.createElement("div");d.className="prop-profile-row";const u=[["parabolic","⌣ Bowl"],["straight","▮ Straight"],["step","▭ Step"]];for(const[m,g]of u){const _=document.createElement("button"),f=l;_.className="prop-profile-btn"+(t.stepEdgeProfiles[f]===m?" active":""),_.textContent=g,_.addEventListener("click",()=>{t.stepEdgeProfiles[f]=m,n()}),d.appendChild(_)}this.content.appendChild(d)}}if(t.stepApplyToAll?t.wallProfile==="step":t.stepEdgeProfiles.some(a=>a==="step")){const a=Math.max(1,Math.floor((t.depth-t.stepStartDepth)/10));t.stepCount>a&&(t.stepCount=a);const c=document.createElement("div");c.className="prop-sub-section",c.textContent="— Step Options —",this.content.appendChild(c),this.numRow("Step Start (cm)",t.stepStartDepth,0,Math.max(0,t.depth-10),1,_=>{t.stepStartDepth=_,this._refreshStepCountMax(t),s()}),this._stepCountSlider=null,this.numRow("Step Count",t.stepCount,1,a,1,_=>{t.stepCount=Math.round(_),s()});const l=this.content.querySelectorAll("input[type=range]");this._stepCountSlider=l[l.length-1]??null;const h=document.createElement("div");h.className="prop-profile-row";const d=document.createElement("span");d.className="prop-row-label",d.textContent="Riser",h.appendChild(d);for(const[_,f]of[["parabolic","⌣ Parabolic"],["straight","╱ Straight"]]){const p=document.createElement("button");p.className="prop-profile-btn"+(t.stepRiserProfile===_?" active":""),p.textContent=f,p.addEventListener("click",()=>{t.stepRiserProfile=_,s()}),h.appendChild(p)}this.content.appendChild(h);const u=document.createElement("div");u.className="prop-profile-row";const m=document.createElement("span");m.className="prop-row-label",m.textContent="Ramp",u.appendChild(m);const g=[["full","Full"],["one-side","1-Side"],["zigzag","Zigzag"],["none","None"]];for(const[_,f]of g){const p=document.createElement("button");p.className="prop-profile-btn"+(t.rampMode===_?" active":""),p.textContent=f,p.addEventListener("click",()=>{t.rampMode=_,s()}),u.appendChild(p)}this.content.appendChild(u),t.rampMode!=="full"&&t.rampMode!=="none"&&(this.numRow("Ramp Angle°",t.rampAngle,0,359,1,_=>{t.rampAngle=_,s()}),this.numRow("Ramp Width°",t.rampWidth,10,180,1,_=>{t.rampWidth=_,s()}))}if(t.stepApplyToAll&&t.wallProfile==="spiral"){const a=document.createElement("div");a.className="prop-sub-section",a.textContent="— Spiral Options —",this.content.appendChild(a),this.numRow("Turns",t.spiralTurns,.5,4,.5,c=>{t.spiralTurns=c,n()}),this.numRow("Helices",t.spiralCount,1,4,1,c=>{t.spiralCount=Math.round(c),n()}),this.toggleRow("Clockwise",t.spiralClockwise,c=>{t.spiralClockwise=c,n()}),this.numRow("Ledge Width cm",t.spiralLedgeWidth,1,8,.5,c=>{t.spiralLedgeWidth=c,n()}),this.numRow("Ledge Height cm",t.spiralLedgeHeight,.3,3,.1,c=>{t.spiralLedgeHeight=c,n()}),this.numRow("Wall Radius",t.spiralRadiusFrac,.3,1,.05,c=>{t.spiralRadiusFrac=c,n()})}}_edgeCount(t){const n=t.openingShape;return n==="circle"||n==="ellipse"?t.stepArcDivisions:n==="rectangle"?4:n==="hexagon"?6:n==="triangle"?3:n==="star"?Math.max(3,Math.min(12,Math.round(t.sides))):4}_edgeLabels(t,n){const s=t.openingShape;return s==="rectangle"?["N side","E side","S side","W side"]:s==="circle"||s==="ellipse"?Array.from({length:n},(r,o)=>`Arc ${o+1}`):Array.from({length:n},(r,o)=>`Side ${o+1}`)}materialRow(t,n){const s=[["abs","▣ ABS","Plastic (smooth, low grip)"],["metal","⬡ Metal","Metal (shiny, very low friction)"],["stone","◈ Stone","Stone (rough, high grip)"]],r=document.createElement("div");r.className="prop-row";const o=document.createElement("span");o.className="prop-label",o.textContent="Material",r.appendChild(o);const a=document.createElement("div");a.className="prop-profile-row";const c=[];for(const[l,h,d]of s){const u=document.createElement("button");u.className="game-btn prop-profile-btn"+(t.baseMaterial===l?" active":""),u.textContent=h,u.title=d,u.addEventListener("click",()=>{t.baseMaterial=l,c.forEach((m,g)=>m.classList.toggle("active",s[g][0]===l)),n()}),c.push(u),a.appendChild(u)}r.appendChild(a),this.content.appendChild(r)}surfaceRow(t,n){const s=["plain","checker","grid","hex","stripes","dots","concrete","metal","wood","ice","sand","lava_rock","custom_png"],r=document.createElement("div");r.className="prop-surface-grid";const o=[];for(const a of s){const c=document.createElement("button");if(c.className="prop-surface-btn"+(t.surface===a?" active":""),c.title=hr[a],a!=="custom_png"){const l=document.createElement("canvas");l.className="prop-surface-preview",l.width=32,l.height=32,l.getContext("2d").drawImage(Vh(t.color,a),0,0,32,32),c.appendChild(l),c.appendChild(document.createTextNode(hr[a]))}else c.textContent="📁 "+hr[a];c.addEventListener("click",()=>{if(a==="custom_png"){this.openPngPicker(t,n,r);return}t.surface=a,o.forEach((l,h)=>l.classList.toggle("active",s[h]===a)),n()}),o.push(c),r.appendChild(c)}this.content.appendChild(r),t.surface==="custom_png"&&this.renderCustomTileRow(t,n)}openPngPicker(t,n,s){const r=document.createElement("input");r.type="file",r.accept="image/png,image/jpeg",r.addEventListener("change",()=>{var c;const o=(c=r.files)==null?void 0:c[0];if(!o)return;const a=new FileReader;a.onload=()=>{var l;t.customTileData=a.result,t.surface="custom_png",(l=this.content.querySelector(".prop-surface-custom-row"))==null||l.remove(),this.renderCustomTileRow(t,n);for(const h of s.querySelectorAll(".prop-surface-btn"))h.classList.toggle("active",h.title===hr.custom_png);n()},a.readAsDataURL(o)}),r.click()}renderCustomTileRow(t,n){const s=document.createElement("div");if(s.className="prop-surface-custom-row",t.customTileData){const c=document.createElement("img");c.className="prop-surface-thumb",c.src=t.customTileData,s.appendChild(c)}const r=document.createElement("span");r.className="prop-label",r.textContent="Tile scale";const o=document.createElement("input");o.type="number",o.className="prop-input",o.value=String(t.tileScale),o.min="1",o.max="200",o.step="1",o.addEventListener("input",()=>{t.tileScale=parseFloat(o.value)||20,n()});const a=document.createElement("button");a.className="game-btn",a.textContent="✕ Clear",a.addEventListener("click",()=>{t.customTileData=null,t.surface="plain",s.remove(),n()}),s.appendChild(r),s.appendChild(o),s.appendChild(a),this.content.appendChild(s)}fillGrid(t,n){const s=["water","lava","swamp","poison","sand","ice","void","custom"],r=document.createElement("div");r.className="prop-fill-grid";const o=[];for(const a of s){const c=document.createElement("button");c.className="prop-fill-btn"+(t.fill===a?" active":"");const l=document.createElement("span");l.className="prop-fill-swatch",l.style.background="#"+Jh[a].color.toString(16).padStart(6,"0"),c.appendChild(l),c.appendChild(document.createTextNode(Pv[a])),c.addEventListener("click",()=>{t.fill=a,o.forEach((h,d)=>h.classList.toggle("active",s[d]===a)),this.updateFillCustomRow(t,n),n()}),o.push(c),r.appendChild(c)}this.content.appendChild(r),this.numRow("Opacity",t.fillOpacity,.1,1,.05,a=>{t.fillOpacity=a,n()}),t.fill==="custom"&&this.buildFillCustomRow(t,n)}updateFillCustomRow(t,n){var s;(s=this.content.querySelector(".prop-fill-custom-row"))==null||s.remove(),t.fill==="custom"&&this.buildFillCustomRow(t,n)}buildFillCustomRow(t,n){const s=document.createElement("div");s.className="prop-fill-custom-row prop-row";const r=document.createElement("span");r.className="prop-label",r.textContent="Fill color";const o=document.createElement("input");o.type="color",o.className="prop-color-input",o.value="#"+(t.fillColor??16777215).toString(16).padStart(6,"0"),o.addEventListener("input",()=>{t.fillColor=parseInt(o.value.slice(1),16),n()}),s.appendChild(r),s.appendChild(o),this.content.appendChild(s)}showWall(t,n,s){this.content.innerHTML="",this.section("NAME");const r=document.createElement("input");r.type="text",r.className="prop-text-input",r.value=t.name,r.addEventListener("input",()=>{t.name=r.value,s(t.name)}),this.content.appendChild(r),this.section("ATTACHMENT"),t.parentType==="base"?(this.numRow("X (cm)",t.basePosX,-200,200,1,c=>{t.basePosX=c,n()}),this.numRow("Z (cm)",t.basePosZ,-200,200,1,c=>{t.basePosZ=c,n()}),this.numRow("Rot Y°",t.baseRotY,0,360,1,c=>{t.baseRotY=c,n()}),this.numRow("Length (cm)",t.baseLength,10,500,1,c=>{t.baseLength=c,n()})):(this.toggleRow("Full Perimeter",t.fullPerimeter,c=>{t.fullPerimeter=c,c&&!t.hasGaps&&(t.tilt=0),n()}),t.fullPerimeter||(this.numRow("Arc Start°",t.arcStart,0,360,1,c=>{t.arcStart=c,n()}),this.numRow("Arc End°",t.arcEnd,0,360,1,c=>{t.arcEnd=c,n()}))),this.section("PROFILE"),this.numRow("Height (cm)",t.height,ua,100,1,c=>{t.height=c,n()});const o=t.fullPerimeter&&!t.hasGaps,a=this.numRow("Tilt°",t.tilt,-90,30,1,c=>{o||(t.tilt=c,n())});if(o){const c=document.createElement("div");c.className="prop-hint",c.textContent="Use partial arc or gaps to enable tilt",a==null||a.appendChild(c)}this.section("TOP PROFILE"),this._wallTopProfileRow(t,n),t.topProfile!=="flat"&&(this.numRow("Amplitude (cm)",t.topAmplitude,0,10,.5,c=>{t.topAmplitude=c,n()}),this.numRow("Frequency",t.topFrequency,.1,5,.1,c=>{t.topFrequency=c,n()})),this.section("GAPS"),this.toggleRow("Has Gaps",t.hasGaps,c=>{t.hasGaps=c,!c&&t.fullPerimeter&&(t.tilt=0),n()}),t.hasGaps&&(this.numRow("Panel Width (cm)",t.panelWidth,Ar,500,1,c=>{t.panelWidth=c,n()}),this.numRow("Gap Width (cm)",t.gapWidth,Ar,500,1,c=>{t.gapWidth=c,n()})),this.section("DOUBLE WALL (/\\)"),this.toggleRow("Enable",t.isDouble,c=>{t.isDouble=c,n()}),t.isDouble&&(this.numRow("Peak Height (cm)",t.peakHeight,1,t.height,1,c=>{t.peakHeight=c,n()}),this.numRow("Peak Tilt°",t.peakTilt,0,60,1,c=>{t.peakTilt=c,n()})),this.section("PHYSICS MATERIAL"),this._wallMaterialRow(t,["rubber","stone","abs","metal"],n),this.section("APPEARANCE"),this.colorRow("Color",t.color,c=>{t.color=c,n()}),this.surfaceRow({surface:t.surface,customTileData:null,tileScale:20,color:t.color},()=>n())}showBridge(t,n,s,r,o,a){this.content.innerHTML="",this.section("NAME");const c=document.createElement("input");c.type="text",c.className="prop-text-input",c.value=t.name,c.addEventListener("input",()=>{t.name=c.value,o(t.name)}),this.content.appendChild(c),this.section("START ANCHOR");const l=t.startRef,h=[["none","Floating"],["arena","Arena"],["wall","Wall"],["freepoint","Free pt"]],d=document.createElement("div");d.className="prop-profile-row";const u=(l==null?void 0:l.type)??"none";for(const[f,p]of h){const x=document.createElement("button");x.className="prop-profile-btn"+(u===f?" active":""),x.textContent=p,x.addEventListener("click",()=>{f==="none"?t.startRef=null:(t.startRef=t.startRef??{type:f,id:"",angle:0,wallHeight:0,freePosX:0,freePosY:31,freePosZ:0,freeDirDeg:0},t.startRef.type=f),r()}),d.appendChild(x)}this.content.appendChild(d),(l==null?void 0:l.type)==="arena"?(this._selectRow("Arena",[...n.entries()],l.id,f=>{l.id=f,r()}),this.numRow("Angle°",l.angle,0,360,1,f=>{l.angle=f,r()})):(l==null?void 0:l.type)==="wall"?(this._selectRow("Wall",[...s.entries()],l.id,f=>{l.id=f,r()}),this.numRow("Angle°",l.angle,0,360,1,f=>{l.angle=f,r()}),this.numRow("Height t",l.wallHeight,0,1,.05,f=>{l.wallHeight=f,r()})):(l==null?void 0:l.type)==="freepoint"&&(this.numRow("X (cm)",l.freePosX,-500,500,1,f=>{l.freePosX=f,r()}),this.numRow("Y (cm)",l.freePosY,0,500,1,f=>{l.freePosY=f,r()}),this.numRow("Z (cm)",l.freePosZ,-500,500,1,f=>{l.freePosZ=f,r()}),this.numRow("Heading°",l.freeDirDeg,0,360,1,f=>{l.freeDirDeg=f,r()})),this.section("TRACK CROSS-SECTION");const m=t.section;this.numRow("Width (cm)",m.width,5,100,1,f=>{m.width=f,r()});const g=document.createElement("div");g.className="prop-profile-row";for(const[f,p]of[["flat","━ Flat"],["u_channel","⌣ U-Channel"]]){const x=document.createElement("button");x.className="prop-profile-btn"+(m.crossSection===f?" active":""),x.textContent=p,x.addEventListener("click",()=>{m.crossSection=f,r()}),g.appendChild(x)}this.content.appendChild(g),m.crossSection==="u_channel"&&this.numRow("Depth (cm)",m.depth,1,20,.5,f=>{m.depth=f,r()}),this.toggleRow("Left Rail Wall",m.hasLeftWall,f=>{m.hasLeftWall=f,r()}),this.toggleRow("Right Rail Wall",m.hasRightWall,f=>{m.hasRightWall=f,r()}),(m.hasLeftWall||m.hasRightWall)&&this.numRow("Rail Wall Height (cm)",m.sideWallHeight,2,30,1,f=>{m.sideWallHeight=f,r()}),this.section("BRIDGE MATERIAL"),this._wallMaterialRow(m,["stone","abs","metal"],r),this.section("APPEARANCE"),this.colorRow("Color",t.color,f=>{t.color=f,r()}),this.surfaceRow({surface:t.surface,customTileData:null,tileScale:20,color:t.color},()=>r()),this.section("SEGMENTS");const _=document.createElement("div");_.className="prop-hint",_.textContent="Track shape does not change when you add segments — only path does.",this.content.appendChild(_),this._addSegmentButtons(a)}showBridgeSegment(t,n,s){this.content.innerHTML="",this.section("NAME");const r=document.createElement("input");switch(r.type="text",r.className="prop-text-input",r.value=t.name,r.addEventListener("input",()=>{t.name=r.value,s(t.name)}),this.content.appendChild(r),this.section("SEGMENT TYPE"),this._addSegmentButtons(a=>{t.type=a,n()},t.type),this.section("SHAPE"),t.type){case"straight":this.numRow("Length (cm)",t.length,5,500,1,a=>{t.length=a,n()});break;case"ramp":this.numRow("Length (cm)",t.length,5,500,1,a=>{t.length=a,n()}),this.numRow("Ramp Angle°",t.rampAngle,-45,45,1,a=>{t.rampAngle=a,n()});break;case"curve":this.numRow("Radius (cm)",t.curveRadius,5,200,1,a=>{t.curveRadius=a,n()}),this.numRow("Angle°",t.curveAngle,10,360,5,a=>{t.curveAngle=a,n()}),this._dirRow(t,n),this.numRow("Bank°",t.bankAngle,0,60,1,a=>{t.bankAngle=a,n()});break;case"hairpin":this.numRow("Radius (cm)",t.curveRadius,5,100,1,a=>{t.curveRadius=a,n()}),this._dirRow(t,n);break;case"loop":this.numRow("Loop Radius (cm)",t.loopRadius,5,100,1,a=>{t.loopRadius=a,n()});break;case"corkscrew":this.numRow("Length (cm)",t.corkscrewLength,10,300,1,a=>{t.corkscrewLength=a,n()}),this.numRow("Turns",t.corkscrewTurns,.5,5,.5,a=>{t.corkscrewTurns=a,n()});break;case"chicane":this.numRow("Radius (cm)",t.curveRadius,5,100,1,a=>{t.curveRadius=a,n()}),this.numRow("Half Angle°",t.curveAngle/2,10,90,5,a=>{t.curveAngle=a*2,n()}),this._dirRow(t,n);break;case"bezier":this.numRow("CP1 X",t.cp1X,-200,200,1,a=>{t.cp1X=a,n()}),this.numRow("CP1 Y",t.cp1Y,-100,200,1,a=>{t.cp1Y=a,n()}),this.numRow("CP1 Z",t.cp1Z,-200,200,1,a=>{t.cp1Z=a,n()}),this.numRow("CP2 X",t.cp2X,-200,200,1,a=>{t.cp2X=a,n()}),this.numRow("CP2 Y",t.cp2Y,-100,200,1,a=>{t.cp2Y=a,n()}),this.numRow("CP2 Z",t.cp2Z,-200,200,1,a=>{t.cp2Z=a,n()}),this.numRow("End X",t.endX,-200,200,1,a=>{t.endX=a,n()}),this.numRow("End Y",t.endY,-100,200,1,a=>{t.endY=a,n()}),this.numRow("End Z",t.endZ,-200,200,1,a=>{t.endZ=a,n()});break}this.section("APPEARANCE");const o=document.createElement("div");o.className="prop-hint",o.textContent="Cross-section (width/depth/physics) is always set on the parent bridge.",this.content.appendChild(o)}_wallTopProfileRow(t,n){const s=[["flat","━ Flat"],["triangles","▲ Triangles"],["waves","∿ Waves"],["serrated","⟋ Serrated"],["crenellated","⊓ Crenellated"]],r=document.createElement("div");r.className="prop-profile-row";const o=[];for(const[a,c]of s){const l=document.createElement("button");l.className="prop-profile-btn"+(t.topProfile===a?" active":""),l.textContent=c,l.addEventListener("click",()=>{t.topProfile=a,o.forEach((h,d)=>h.classList.toggle("active",s[d][0]===a)),n()}),o.push(l),r.appendChild(l)}this.content.appendChild(r)}_wallMaterialRow(t,n,s){const r={rubber:"🔴 Rubber",stone:"◈ Stone",abs:"▣ ABS",metal:"⬡ Metal"},o=document.createElement("div");o.className="prop-profile-row";const a=[];for(const c of n){const l=pv[c],h=document.createElement("button");h.className="prop-profile-btn"+(t.material===c?" active":""),h.textContent=r[c],h.title=`Restitution ${l.restitution} · Spin-loss ${l.spinLossFactor} · Damage ×${l.damageFactor}`,h.addEventListener("click",()=>{t.material=c,a.forEach((d,u)=>d.classList.toggle("active",n[u]===c)),s()}),a.push(h),o.appendChild(h)}this.content.appendChild(o)}_addSegmentButtons(t,n){const s=[["straight","━","Straight"],["ramp","↗","Ramp"],["curve","↩","Curve"],["hairpin","↺","Hairpin"],["loop","⭕","Loop"],["corkscrew","🌀","Corkscrew"],["chicane","⟨⟩","Chicane"],["bezier","〜","Bezier"]],r=document.createElement("div");r.className="prop-shape-grid";for(const[o,a,c]of s){const l=document.createElement("button");l.className="prop-shape-btn"+(n===o?" active":""),l.innerHTML=`<span class="prop-shape-icon">${a}</span><span>${c}</span>`,l.addEventListener("click",()=>t(o)),r.appendChild(l)}this.content.appendChild(r)}_dirRow(t,n){const s=document.createElement("div");s.className="prop-profile-row";const r=document.createElement("span");r.className="prop-row-label",r.textContent="Direction",s.appendChild(r);for(const[o,a]of[["left","↰ Left"],["right","↱ Right"]]){const c=document.createElement("button");c.className="prop-profile-btn"+(t.curveDirection===o?" active":""),c.textContent=a,c.addEventListener("click",()=>{t.curveDirection=o,n()}),s.appendChild(c)}this.content.appendChild(s)}_selectRow(t,n,s,r){const o=document.createElement("div");o.className="prop-row";const a=document.createElement("span");a.className="prop-label",a.textContent=t;const c=document.createElement("select");c.className="prop-input";for(const[l,h]of n){const d=document.createElement("option");d.value=l,d.textContent=h,l===s&&(d.selected=!0),c.appendChild(d)}c.addEventListener("change",()=>r(c.value)),o.appendChild(a),o.appendChild(c),this.content.appendChild(o)}showSpeedLine(t,n,s,r,o,a,c,l){this.content.innerHTML="",this.section("NAME");const h=document.createElement("input");h.type="text",h.className="prop-text-input",h.value=t.name,h.addEventListener("input",()=>{t.name=h.value,o(t.name)}),this.content.appendChild(h),this.section("START");const d=Math.min(n.radiusX,n.radiusZ);this.numRow("Start Dist",t.startR,0,d,.5,p=>{t.startR=p,s()}),this.numRow("Start Angle",t.startAngle,0,360,1,p=>{t.startAngle=p,s()}),this.numRow("Start Dir °",t.startDir,-180,180,1,p=>{t.startDir=p,s()}),this.section("SEGMENTS");const u=document.createElement("div");u.className="prop-row";const m=document.createElement("span");m.className="prop-label",m.textContent="Add from template";const g=document.createElement("select");g.className="prop-select";for(const[p,x]of[["blank","Blank"],["straight","Straight"],["circle","Circle"],["spiral","Spiral"],["zigzag","Zigzag"],["wave","Wave"],["climb","Climb"],["loop","Loop (aerial)"],["corkscrew","Corkscrew"],["ramp","Launch Ramp"]]){const v=document.createElement("option");v.value=p,v.textContent=x,g.appendChild(v)}const _=document.createElement("button");_.className="game-btn",_.style.marginLeft="4px",_.textContent="+ Add",_.addEventListener("click",()=>{let p=[];switch(g.value){case"blank":p=[{id:"",length:Ee.DEFAULT_SEG_LENGTH,rotX:0,rotY:0,rotZ:0,speedMult:0,objRotX:0,objRotY:0,objRotZ:0}];break;case"straight":p=Wv(40,5);break;case"circle":p=Xv(20,36),t.surfaceFollow;break;case"spiral":p=Yv(20,1,18);break;case"zigzag":p=Zv(8,8,8);break;case"wave":p=qv(5,8,8);break;case"climb":p=jv(15,6,8);break;case"loop":p=$v(12,12),t.surfaceFollow=!1,t.overridePhysics=!0;break;case"corkscrew":p=Kv(10,1,12),t.surfaceFollow=!1;break;case"ramp":p=Jv(45,3,6,8),t.surfaceFollow=!1;break}c(p)}),u.appendChild(m),u.appendChild(g),u.appendChild(_),this.content.appendChild(u);for(let p=0;p<t.segments.length;p++){const x=t.segments[p],v=document.createElement("div");v.className="prop-row",v.style.cursor="pointer";const S=document.createElement("span");S.className="prop-label",S.textContent=`▶ Segment ${p+1}`;const R=document.createElement("button");R.className="game-btn",R.textContent="✕",R.style.marginLeft="auto",R.style.fontSize="0.75em",R.addEventListener("click",C=>{C.stopPropagation(),l(p)}),v.appendChild(S),v.appendChild(R),this.content.appendChild(v);const A=document.createElement("div");A.style.display="none",A.style.paddingLeft="12px",v.addEventListener("click",()=>{const C=A.style.display!=="none";A.style.display=C?"none":"block",S.textContent=(C?"▶":"▼")+` Segment ${p+1}`});const T=(C,b,y,P,N,U)=>{const G=document.createElement("div");G.className="prop-row";const Z=document.createElement("span");Z.className="prop-label",Z.textContent=C;const F=document.createElement("input");F.type="number",F.className="prop-input",F.value=String(b),F.min=String(y),F.max=String(P),F.step=String(N),F.addEventListener("input",()=>{U(parseFloat(F.value)||0),r(p)}),G.appendChild(Z),G.appendChild(F),A.appendChild(G)};T("Length cm",x.length,.5,100,.5,C=>{x.length=C}),T("Rot X °",x.rotX,-180,180,1,C=>{x.rotX=C}),T("Rot Y °",x.rotY,-180,180,1,C=>{x.rotY=C}),T("Rot Z °",x.rotZ,-180,180,1,C=>{x.rotZ=C}),T("Speed ×",x.speedMult,0,Ee.SPEED_MULT_MAX,.1,C=>{x.speedMult=C}),T("Obj Rot X°/cm",x.objRotX,-45,45,.5,C=>{x.objRotX=C}),T("Obj Rot Y°/cm",x.objRotY,-45,45,.5,C=>{x.objRotY=C}),T("Obj Rot Z°/cm",x.objRotZ,-45,45,.5,C=>{x.objRotZ=C}),this.content.appendChild(A)}const f=document.createElement("button");f.className="game-btn",f.textContent="+ Add segment",f.style.width="100%",f.style.margin="4px 0",f.addEventListener("click",()=>c([{id:"",length:Ee.DEFAULT_SEG_LENGTH,rotX:0,rotY:0,rotZ:0,speedMult:0,objRotX:0,objRotY:0,objRotZ:0}])),this.content.appendChild(f),this.toggleRow("Surface Follow",t.surfaceFollow,p=>{t.surfaceFollow=p,s()}),this.section("RIBBON"),this.numRow("Width cm",t.width,Ee.WIDTH_MIN,Ee.WIDTH_MAX,.1,p=>{t.width=p,a()}),this.colorRow("Color",t.color,p=>{t.color=p,a()}),this.numRow("Opacity",t.opacity,0,1,.05,p=>{t.opacity=p,a()}),this.toggleRow("Glow",t.glowColor!==null,p=>{t.glowColor=p?t.color:null,a()}),this.section("TARGET & ACTIVATION"),this.selectRow("Target",[{value:"beyblade",label:"Beyblade"},{value:"water",label:"Water"},{value:"obstacle",label:"Obstacle"},{value:"item",label:"Item"},{value:"any",label:"Any"},{value:"custom",label:"Custom"}],t.targetType,p=>{t.targetType=p,s()}),t.targetType==="custom"&&this.textRow("Target Tag",t.targetTag,p=>{t.targetTag=p}),this.selectRow("Activation",[{value:"always",label:"Always"},{value:"event",label:"Event"},{value:"periodic",label:"Periodic"},{value:"proximity",label:"Proximity"}],t.activationMode,p=>{t.activationMode=p,s()}),t.activationMode==="event"?(this.textRow("Trigger Event",t.triggerEvent,p=>{t.triggerEvent=p}),this.textRow("End Event",t.endEvent,p=>{t.endEvent=p}),this.numRow("Active ms",t.activeDuration,0,6e4,100,p=>{t.activeDuration=p}),this.numRow("Fade In ms",t.fadeIn,0,5e3,50,p=>{t.fadeIn=p}),this.numRow("Fade Out ms",t.fadeOut,0,5e3,50,p=>{t.fadeOut=p})):t.activationMode==="periodic"?(this.numRow("Period ms",t.period,100,1e4,100,p=>{t.period=p}),this.numRow("Duty 0–1",t.activeDuty,0,1,.05,p=>{t.activeDuty=p}),this.numRow("Fade In ms",t.fadeIn,0,5e3,50,p=>{t.fadeIn=p}),this.numRow("Fade Out ms",t.fadeOut,0,5e3,50,p=>{t.fadeOut=p})):t.activationMode==="proximity"&&this.numRow("Radius cm",t.activationRadius,1,100,1,p=>{t.activationRadius=p,s()}),this.section("OSCILLATION"),this.toggleRow("Oscillate",t.oscillate,p=>{t.oscillate=p}),t.oscillate&&(this.selectRow("Axis",[{value:"path",label:"Path"},{value:"lateral",label:"Lateral"},{value:"normal",label:"Normal"},{value:"all",label:"All"}],t.oscAxis,p=>{t.oscAxis=p}),this.numRow("Amplitude cm",t.oscAmplitude,0,20,.5,p=>{t.oscAmplitude=p}),this.numRow("Frequency Hz",t.oscFrequency,.1,10,.1,p=>{t.oscFrequency=p}),this.numRow("Phase °",t.oscPhase,0,360,5,p=>{t.oscPhase=p})),this.section("GAMEPLAY"),this.numRow("Speed ×",t.speedMultiplier,Ee.SPEED_MULT_MIN,Ee.SPEED_MULT_MAX,.1,p=>{t.speedMultiplier=p}),this.selectRow("Entry",[{value:"always",label:"Always"},{value:"moving_only",label:"Moving only"},{value:"fast_only",label:"Fast only"},{value:"slow_only",label:"Slow only"}],t.entryCondition,p=>{t.entryCondition=p}),this.selectRow("Direction",[{value:"forward",label:"Forward"},{value:"reverse",label:"Reverse"},{value:"bidirectional",label:"Both"}],t.direction,p=>{t.direction=p}),this.selectRow("Exit",[{value:"normal",label:"Normal"},{value:"launch",label:"Launch"},{value:"loop",label:"Loop (repeat)"},{value:"special_move",label:"Special Move"}],t.exitBehavior,p=>{t.exitBehavior=p,s()}),t.exitBehavior==="launch"&&this.numRow("Launch ×",t.launchForce,Ee.LAUNCH_FORCE_MIN,Ee.LAUNCH_FORCE_MAX,.1,p=>{t.launchForce=p}),t.exitBehavior==="special_move"&&this.textRow("Move Name",t.specialMoveName,p=>{t.specialMoveName=p}),this.toggleRow("Mid-Air Entry",t.allowMidAirEntry,p=>{t.allowMidAirEntry=p}),this.toggleRow("Override Physics",t.overridePhysics,p=>{t.overridePhysics=p}),this.numRow("Swap Priority",t.swapPriority,Ee.SWAP_PRIORITY_MIN,Ee.SWAP_PRIORITY_MAX,1,p=>{t.swapPriority=Math.round(p)}),this.section("INFO"),this.readRow("Total Length",`${t.totalLength.toFixed(1)} cm`),this.readRow("Segments",String(t.segments.length)),this.readRow("Overlaps",String(t.overlapMarkers.length))}}function Ol(i){return{id:i.id,name:i.name,parentArenaId:i.parentArenaId,parentZoneId:i.parentZoneId,startR:i.startR,startAngle:i.startAngle,startDir:i.startDir,segments:i.segments.map(e=>({...e})),surfaceFollow:i.surfaceFollow,targetType:i.targetType,targetTag:i.targetTag,activationMode:i.activationMode,triggerEvent:i.triggerEvent,endEvent:i.endEvent,activeDuration:i.activeDuration,period:i.period,activeDuty:i.activeDuty,activationRadius:i.activationRadius,fadeIn:i.fadeIn,fadeOut:i.fadeOut,oscillate:i.oscillate,oscAxis:i.oscAxis,oscAmplitude:i.oscAmplitude,oscFrequency:i.oscFrequency,oscPhase:i.oscPhase,width:i.width,color:i.color,opacity:i.opacity,glowColor:i.glowColor,speedMultiplier:i.speedMultiplier,entryCondition:i.entryCondition,direction:i.direction,exitBehavior:i.exitBehavior,launchForce:i.launchForce,specialMoveName:i.specialMoveName,allowMidAirEntry:i.allowMidAirEntry,overridePhysics:i.overridePhysics,swapPriority:i.swapPriority}}function ad(i){return{id:i.id,name:i.name,openingShape:i.openingShape,radiusX:i.radiusX,radiusZ:i.radiusZ,depth:i.depth,sides:i.sides,starInner:i.starInner,color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale,posR:i.posR,posAngle:i.posAngle,rotY:i.rotY}}function cd(i,e,t){return{id:i.id,name:i.name,parentZoneId:i.parentZoneId,openingShape:i.openingShape,radiusX:i.radiusX,radiusZ:i.radiusZ,depth:i.depth,sides:i.sides,starInner:i.starInner,color:i.color,surface:i.surface,customTileData:i.customTileData,tileScale:i.tileScale,fill:i.fill,fillColor:i.fillColor,fillOpacity:i.fillOpacity,posR:i.posR,posAngle:i.posAngle,rotY:i.rotY,isMoat:i.isMoat,innerRadiusX:i.innerRadiusX,innerRadiusZ:i.innerRadiusZ,innerOpeningShape:i.innerOpeningShape,innerSides:i.innerSides,innerStarInner:i.innerStarInner,innerWallProfile:i.innerWallProfile,innerRimOffset:i.innerRimOffset,pits:i.pitIds.map(n=>{const s=e.get(n);return s?ad(s):null}).filter(Boolean),zones:i.zoneIds.map(n=>{const s=t.get(n);return s?cd(s,e,t):null}).filter(Boolean)}}function hx(i,e,t,n){return{id:i,name:e.name,openingShape:e.openingShape,wallProfile:e.wallProfile,radiusX:e.radiusX,radiusZ:e.radiusZ,depth:e.depth,sides:e.sides,starInner:e.starInner,color:e.color,surface:e.surface,customTileData:e.customTileData,tileScale:e.tileScale,baseMaterial:e.baseMaterial,posX:e.posX,posZ:e.posZ,posY:e.posY,rotY:e.rotY,isMoat:e.isMoat,innerRadiusX:e.innerRadiusX,innerRadiusZ:e.innerRadiusZ,innerOpeningShape:e.innerOpeningShape,innerSides:e.innerSides,innerStarInner:e.innerStarInner,innerWallProfile:e.innerWallProfile,innerRimOffset:e.innerRimOffset,stepApplyToAll:e.stepApplyToAll,stepEdgeProfiles:e.stepEdgeProfiles,stepArcDivisions:e.stepArcDivisions,stepCount:e.stepCount,stepStartDepth:e.stepStartDepth,stepRiserProfile:e.stepRiserProfile,rampMode:e.rampMode,rampAngle:e.rampAngle,rampWidth:e.rampWidth,spiralTurns:e.spiralTurns,spiralClockwise:e.spiralClockwise,spiralCount:e.spiralCount,spiralLedgeWidth:e.spiralLedgeWidth,spiralLedgeHeight:e.spiralLedgeHeight,spiralRadiusFrac:e.spiralRadiusFrac,pits:e.pitIds.map(s=>ad(t.get(s))).filter(Boolean),zones:e.zoneIds.filter(s=>{const r=n.get(s);return r&&!r.parentZoneId}).map(s=>cd(n.get(s),t,n)),walls:[],speedLines:[]}}function ea(i){return{id:i.id,name:i.name,parentId:i.parentId,parentType:i.parentType,fullPerimeter:i.fullPerimeter,arcStart:i.arcStart,arcEnd:i.arcEnd,basePosX:i.basePosX,basePosZ:i.basePosZ,baseRotY:i.baseRotY,baseLength:i.baseLength,height:i.height,tilt:i.tilt,hasGaps:i.hasGaps,gapWidth:i.gapWidth,panelWidth:i.panelWidth,topProfile:i.topProfile,topAmplitude:i.topAmplitude,topFrequency:i.topFrequency,isDouble:i.isDouble,peakHeight:i.peakHeight,peakTilt:i.peakTilt,holes:i.holes.map(e=>({id:e.id,shape:e.shape,posAlong:e.posAlong,posHeight:e.posHeight,radiusU:e.radiusU,radiusV:e.radiusV})),color:i.color,surface:i.surface,material:i.material}}function dx(i){return{type:i.type,id:i.id,angle:i.angle,wallHeight:i.wallHeight,freePosX:i.freePosX,freePosY:i.freePosY,freePosZ:i.freePosZ,freeDirDeg:i.freeDirDeg}}function ux(i){return{id:i.id,name:i.name,orderIndex:i.orderIndex,type:i.type,length:i.length,rampAngle:i.rampAngle,curveRadius:i.curveRadius,curveAngle:i.curveAngle,curveDirection:i.curveDirection,bankAngle:i.bankAngle,cp1X:i.cp1X,cp1Y:i.cp1Y,cp1Z:i.cp1Z,cp2X:i.cp2X,cp2Y:i.cp2Y,cp2Z:i.cp2Z,endX:i.endX,endY:i.endY,endZ:i.endZ,loopRadius:i.loopRadius,corkscrewLength:i.corkscrewLength,corkscrewTurns:i.corkscrewTurns,color:i.color,surface:i.surface}}function px(i,e,t){const n=i.section;return{id:i.id,name:i.name,startRef:i.startRef?dx(i.startRef):null,segments:i.segmentIds.map(s=>{const r=e.get(s);return r?ux(r):null}).filter(Boolean),section:{width:n.width,crossSection:n.crossSection,depth:n.depth,hasLeftWall:n.hasLeftWall,hasRightWall:n.hasRightWall,sideWallHeight:n.sideWallHeight,material:n.material},color:i.color,surface:i.surface,walls:i.wallIds.map(s=>{const r=t.get(s);return r?ea(r):null}).filter(Boolean)}}function ld(i,e,t){const n=i.length;if(n===0)return[];let s=(e%360+360)%360,r=(t%360+360)%360;const o=r<=s,a=i.map(l=>(Math.atan2(l.y,l.x)/Xe+360)%360),c=[];for(let l=0;l<n;l++){const h=(l+1)%n,d=a[l],u=a[h];(g=>o?g>=s||g<=r:g>=s&&g<=r)(d)&&c.push(i[l].clone());for(const g of[s,r])if(o?fx(d,u,g):hd(d,u,g)){const f=mx(d,u,g);f>0&&f<1&&c.push(new K(i[l].x+f*(i[h].x-i[l].x),i[l].y+f*(i[h].y-i[l].y)))}}return c}function hd(i,e,t){const n=Math.min(i,e),s=Math.max(i,e);return t>n&&t<s}function fx(i,e,t){return hd(i,e,t)}function mx(i,e,t,n){return i===e?0:(t-i)/(e-i)}function gx(i,e,t,n,s){if(e==="flat"||t===0)return 0;const r=i*s*n*Math.PI*2;switch(e){case"triangles":return t*Math.abs(i*s*n%1*2-1);case"waves":return t*.5*(1+Math.sin(r));case"serrated":{const o=i*s*n%1;return t*(1-o)}case"crenellated":return t*Math.round(Math.sin(r)*.5+.5);default:return 0}}function _x(i,e,t,n,s,r,o,a,c,l,h){const d=Math.max(-Math.PI/2,Math.min(30*Xe,n*Xe)),u=Math.max(ua,t);let m=0;for(let v=0;v<i.length-1;v++){const S=i[v+1].x-i[v].x,R=i[v+1].y-i[v].y;m+=Math.sqrt(S*S+R*R)}const g=m/100,_=[],f=[],p=[],x=i.length;if(s){const v=Math.max(0,Math.min(60*Xe,o*Xe));for(let S=0;S<x;S++){const R=i[S],A=h(R);_.push(R.x,e,R.y),f.push(0,1,0);const T=R.x+-Math.sin(v)*r*A.x,C=R.y+-Math.sin(v)*r*A.y,b=e+Math.cos(v)*r;_.push(T,b,C),f.push(0,1,0)}for(let S=0;S<x-1;S++){const R=S*2,A=S*2+1,T=(S+1)*2,C=(S+1)*2+1;p.push(R,T,C,R,C,A)}}else{for(let v=0;v<x;v++){const S=v/Math.max(x-1,1),R=i[v],A=h(R),T=gx(S,a,c,l,g),C=u+T;_.push(R.x,e,R.y),f.push(0,0,1);const b=R.x+-Math.sin(d)*C*A.x,y=R.y+-Math.sin(d)*C*A.y,P=e+Math.cos(d)*C;_.push(b,P,y),f.push(0,0,1)}for(let v=0;v<x-1;v++){const S=v*2,R=v*2+1,A=(v+1)*2,T=(v+1)*2+1;p.push(S,A,T,S,T,R)}}return{positions:_,normals:f,indices:p}}function vx(i,e,t,n=0,s=0){const r=i.fullPerimeter&&!i.hasGaps?0:i.tilt;let o,a,c;if(i.parentType==="base"){const _=Math.max(1,i.baseLength),f=Math.cos(i.baseRotY*Xe),p=Math.sin(i.baseRotY*Xe),x=i.basePosX,v=i.basePosZ;o=[new K(x-_/2*f,v-_/2*p),new K(x+_/2*f,v+_/2*p)],a=x,c=v}else o=i.fullPerimeter?e:ld(e,i.arcStart,i.arcEnd),a=n,c=s;if(o.length<2)return new Fe;const l=_=>{const f=a-_.x,p=c-_.y,x=Math.sqrt(f*f+p*p)||1;return new K(f/x,p/x)},h=[],d=[];let u=0;const m=dd(o,i);for(const _ of m){const{positions:f,indices:p}=_x(_,t,i.height,r,i.isDouble,i.peakHeight,i.peakTilt,i.topProfile,i.topAmplitude,i.topFrequency,l);h.push(...f),d.push(...p.map(x=>x+u)),u+=f.length/3}const g=new Fe;return g.setAttribute("position",new Ce(h,3)),g.setIndex(d),g.computeVertexNormals(),g}function dd(i,e){if(!e.hasGaps)return[i];const t=Math.max(Ar,e.gapWidth),n=Math.max(Ar,e.panelWidth),s=t+n,r=[0];for(let l=1;l<i.length;l++){const h=i[l].x-i[l-1].x,d=i[l].y-i[l-1].y;r.push(r[r.length-1]+Math.sqrt(h*h+d*d))}const o=r[r.length-1],a=[];let c=0;for(;c<o;){const l=Math.min(c+n,o),h=xx(i,r,c,l);h.length>=2&&a.push(h),c+=s}return a}function xx(i,e,t,n){const s=[];for(let r=0;r<i.length;r++){const o=e[r];if(o>=t&&o<=n)s.push(i[r].clone());else if(r>0){const a=e[r-1];for(const c of[t,n])if(c>a&&c<o){const l=(c-a)/(o-a);s.push(new K(i[r-1].x+l*(i[r].x-i[r-1].x),i[r-1].y+l*(i[r].y-i[r-1].y)))}}}return s}function Sx(i,e,t,n=0,s=0){const r=i.fullPerimeter&&!i.hasGaps?0:i.tilt,o=Math.max(-Math.PI/2,Math.min(30*Xe,r*Xe)),a=Math.max(ua,i.height);let c,l,h;if(i.parentType==="base"){const g=Math.max(1,i.baseLength),_=Math.cos(i.baseRotY*Xe),f=Math.sin(i.baseRotY*Xe);c=[new K(i.basePosX-g/2*_,i.basePosZ-g/2*f),new K(i.basePosX+g/2*_,i.basePosZ+g/2*f)],l=i.basePosX,h=i.basePosZ}else c=i.fullPerimeter?e:ld(e,i.arcStart,i.arcEnd),l=n,h=s;const d=[],u=dd(c,i);for(const g of u){const _=g.length;for(let f=0;f<_-1;f++)d.push(g[f].x,t,g[f].y),d.push(g[f+1].x,t,g[f+1].y);for(let f=0;f<_-1;f++){const[p,x,v]=dr(g[f],t,a,o,l,h),[S,R,A]=dr(g[f+1],t,a,o,l,h);d.push(p,x,v,S,R,A)}if(_>0){const[f,p,x]=dr(g[0],t,a,o,l,h);d.push(g[0].x,t,g[0].y,f,p,x);const v=g[_-1],[S,R,A]=dr(v,t,a,o,l,h);d.push(v.x,t,v.y,S,R,A)}}const m=new Fe;return m.setAttribute("position",new Ce(d,3)),m}function dr(i,e,t,n,s,r){const o=s-i.x,a=r-i.y,c=Math.sqrt(o*o+a*a)||1,l=o/c,h=a/c,d=i.x+-Math.sin(n)*t*l,u=i.y+-Math.sin(n)*t*h,m=e+Math.cos(n)*t;return[d,m,u]}function Mx(i,e,t,n){return{id:i,name:e,parentId:t,parentType:n,fullPerimeter:!0,arcStart:0,arcEnd:360,basePosX:0,basePosZ:0,baseRotY:0,baseLength:20,height:10,tilt:0,hasGaps:!1,gapWidth:10,panelWidth:20,topProfile:"flat",topAmplitude:3,topFrequency:1,isDouble:!1,peakHeight:8,peakTilt:30,holes:[],color:8956620,surface:"plain",material:"abs",mesh:null,edges:null}}function Fl(i){return{pos:i.pos.clone(),dir:i.dir.clone(),up:i.up.clone()}}function As(i){return new L().crossVectors(i.dir,i.up).normalize()}const mn={pos:new L(0,31,0),dir:new L(1,0,0),up:new L(0,1,0)};function yx(i,e,t,n){if(i.type==="freepoint"){const s=i.freeDirDeg*Xe;return{pos:new L(i.freePosX,i.freePosY,i.freePosZ),dir:new L(Math.cos(s),0,Math.sin(s)).normalize(),up:new L(0,1,0)}}if(i.type==="arena"){const s=e.get(i.id);if(!s)return Fl(mn);const r=i.angle*Xe,o=s.radiusX,a=s.radiusZ,c=s.posX+o*Math.cos(r),l=s.posZ+a*Math.sin(r),h=n+s.posY,d=-a*Math.sin(r),u=o*Math.cos(r),m=Math.sqrt(d*d+u*u)||1;return{pos:new L(c,h,l),dir:new L(d/m,0,u/m),up:new L(0,1,0)}}return Fl(mn)}function _a(i,e){switch(i.type){case"straight":return Bl(e,i.length,Ln);case"ramp":return Ex(e,i.length,i.rampAngle,Ln);case"curve":return Pr(e,i.curveRadius,i.curveAngle,i.curveDirection,i.bankAngle,Ln);case"hairpin":return Pr(e,i.curveRadius||xv,180,i.curveDirection,i.bankAngle,Ln);case"loop":return Ax(e,i.loopRadius,Mv);case"corkscrew":return Tx(e,i.corkscrewLength,i.corkscrewTurns,Ln);case"chicane":return wx(e,i.curveRadius,i.curveAngle/2,i.curveDirection,Ln);case"bezier":return Rx(e,i,Ln);default:return Bl(e,Ph,Ln)}}function bx(i,e){const t=_a(i,e);return t[t.length-1]}function Bl(i,e,t){const n=[];for(let s=0;s<t;s++){const r=s/(t-1);n.push({pos:i.pos.clone().addScaledVector(i.dir,r*e),dir:i.dir.clone(),up:i.up.clone()})}return n}function Ex(i,e,t,n){const s=t*Xe;As(i);const r=i.dir.clone().multiplyScalar(Math.cos(s)).addScaledVector(i.up,Math.sin(s)).normalize(),o=[];for(let a=0;a<n;a++){const c=a/(n-1);o.push({pos:i.pos.clone().addScaledVector(r,c*e),dir:r.clone(),up:i.up.clone()})}return o}function Pr(i,e,t,n,s,r){const o=t*Xe,a=n==="right"?1:-1,c=As(i),l=i.pos.clone().addScaledVector(c,a*e),h=s*Xe,d=[];for(let u=0;u<r;u++){const m=u/(r-1),g=m*o,_=i.pos.clone().sub(l),f=ai(_,i.up,-a*g),p=l.clone().add(f),x=ai(i.dir.clone(),i.up,-a*g),v=ai(i.up.clone(),x,a*h*m);d.push({pos:p,dir:x.normalize(),up:v.normalize()})}return d}function Ax(i,e,t){const n=As(i),s=i.pos.clone().addScaledVector(i.up,e),r=[];for(let o=0;o<t;o++){const c=o/(t-1)*Math.PI*2,l=i.pos.clone().sub(s),h=ai(l,n,-c),d=s.clone().add(h),u=ai(i.dir.clone(),n,-c),m=ai(i.up.clone(),n,-c);r.push({pos:d,dir:u.normalize(),up:m.normalize()})}return r}function Tx(i,e,t,n){const s=[];for(let r=0;r<n;r++){const o=r/(n-1),a=o*t*Math.PI*2,c=i.pos.clone().addScaledVector(i.dir,o*e),l=ai(i.up.clone(),i.dir,a);s.push({pos:c,dir:i.dir.clone(),up:l.normalize()})}return s}function wx(i,e,t,n,s){const r=Math.ceil(s/2),o=Pr(i,e,t,n,0,r),a=o[o.length-1],l=Pr(a,e,t,n==="left"?"right":"left",0,s-r+1);return[...o,...l.slice(1)]}function Rx(i,e,t){const n=As(i),s=i.pos.clone(),r=zo(i,n,e.cp1X,e.cp1Y,e.cp1Z),o=zo(i,n,e.cp2X,e.cp2Y,e.cp2Z),a=zo(i,n,e.endX,e.endY,e.endZ),c=[];for(let l=0;l<t;l++){const h=l/(t-1),d=Cx(s,r,o,a,h),u=Px(s,r,o,a,h).normalize(),m=new L(0,1,0),g=new L().crossVectors(u,m).normalize(),_=new L().crossVectors(g,u).normalize();c.push({pos:d,dir:u,up:_})}return c}function zo(i,e,t,n,s){return i.pos.clone().addScaledVector(e,t).addScaledVector(i.up,n).addScaledVector(i.dir,s)}function Cx(i,e,t,n,s){const r=1-s;return i.clone().multiplyScalar(r**3).addScaledVector(e,3*r*r*s).addScaledVector(t,3*r*s*s).addScaledVector(n,s**3)}function Px(i,e,t,n,s){const r=1-s;return e.clone().sub(i).multiplyScalar(3*r*r).addScaledVector(t.clone().sub(e),6*r*s).addScaledVector(n.clone().sub(t),3*s*s)}function ai(i,e,t){return i.applyQuaternion(new Xt().setFromAxisAngle(e.clone().normalize(),t))}function Bi(i,e){const t=Tr,n=As(i),s=e.width/2,r=[];for(let o=0;o<=t;o++){const a=o/t,c=-s+a*e.width;let l=0;if(e.crossSection==="u_channel"&&e.depth>0){const h=(a-.5)*2;l=-e.depth*(1-h*h)}r.push(i.pos.clone().addScaledVector(n,c).addScaledVector(i.up,l))}return r}function Lx(i,e,t){const n=_a(i,e),s=n.length,r=Tr+1,o=[],a=[];for(let m=0;m<s;m++){const g=Bi(n[m],t);for(const _ of g)o.push(_.x,_.y,_.z)}for(let m=0;m<s-1;m++)for(let g=0;g<r-1;g++){const _=m*r+g,f=m*r+g+1,p=(m+1)*r+g,x=(m+1)*r+g+1;a.push(_,p,x,_,x,f)}if(t.hasLeftWall||t.hasRightWall){const m=t.sideWallHeight;for(let p=0;p<s;p++){const x=Bi(n[p],t),v=n[p];for(const S of["left","right"]){if(S==="left"&&!t.hasLeftWall||S==="right"&&!t.hasRightWall)continue;const R=S==="left"?x[0]:x[Tr],A=R.clone().addScaledVector(v.up,m);o.push(R.x,R.y,R.z),o.push(A.x,A.y,A.z)}}let _=s*r;const f=(t.hasLeftWall?2:0)+(t.hasRightWall?2:0);for(let p=0;p<s-1;p++){let x=0;for(const v of["left","right"]){if(v==="left"&&!t.hasLeftWall||v==="right"&&!t.hasRightWall)continue;const S=_+p*f+x,R=S+1,A=_+(p+1)*f+x,T=A+1;a.push(S,A,T,S,T,R),x+=2}}}const c=Bi(n[0],t),l=o.length/3;for(const m of c)o.push(m.x,m.y,m.z);for(let m=0;m<r-2;m++)a.push(l,l+m+1,l+m+2);const h=Bi(n[s-1],t),d=o.length/3;for(const m of h)o.push(m.x,m.y,m.z);for(let m=0;m<r-2;m++)a.push(d,d+m+2,d+m+1);const u=new Fe;return u.setAttribute("position",new Ce(o,3)),u.setIndex(a),u.computeVertexNormals(),u}function Ix(i,e,t){const n=_a(i,e),s=[],r=Tr;for(let a=0;a<n.length-1;a++){const c=Bi(n[a],t),l=Bi(n[a+1],t);s.push(c[0].x,c[0].y,c[0].z,l[0].x,l[0].y,l[0].z),s.push(c[r].x,c[r].y,c[r].z,l[r].x,l[r].y,l[r].z);const h=Math.floor(r/2);s.push(c[h].x,c[h].y,c[h].z,l[h].x,l[h].y,l[h].z)}const o=new Fe;return o.setAttribute("position",new Ce(s,3)),o}function Dx(){return{width:fv,crossSection:"u_channel",depth:mv,hasLeftWall:!0,hasRightWall:!0,sideWallHeight:5,material:"abs"}}function Nx(i,e,t,n,s="straight"){return{id:i,name:e,bridgeId:t,orderIndex:n,type:s,length:Ph,rampAngle:0,curveRadius:gv,curveAngle:_v,curveDirection:"right",bankAngle:0,cp1X:10,cp1Y:0,cp1Z:10,cp2X:20,cp2Y:0,cp2Z:20,endX:0,endY:0,endZ:30,loopRadius:vv,corkscrewLength:Sv,corkscrewTurns:1,color:null,surface:null,mesh:null,edges:null}}class Ux extends bh{constructor(t,n){super(t,n);W(this,"baseMesh",null);W(this,"baseEdges",null);W(this,"topFaceMesh",null);W(this,"solidMode",!0);W(this,"modeBtn");W(this,"arenaStorageKey");W(this,"baseConfig",{height:xl,sides:Sl,color:Ml,surface:"plain",customTileData:null,tileScale:yl});W(this,"sceneTree");W(this,"sceneObjects",new Map);W(this,"arenas",new Map);W(this,"arenaSeq",0);W(this,"pits",new Map);W(this,"pitSeq",0);W(this,"zones",new Map);W(this,"zoneSeq",0);W(this,"walls",new Map);W(this,"wallSeq",0);W(this,"bridges",new Map);W(this,"bridgeSeq",0);W(this,"segments",new Map);W(this,"segmentSeq",0);W(this,"bridgesByArena",new Map);W(this,"speedLines",new Map);W(this,"speedlineSeq",0);W(this,"slSegSeq",0);W(this,"selectedSlId",null);W(this,"slDrag",null);W(this,"slRaycaster",new k_);W(this,"_onPointerDown");W(this,"_onPointerMove");W(this,"_onPointerUp");W(this,"props");W(this,"selectedId",null);W(this,"undoStack",[]);W(this,"redoStack",[]);W(this,"_undoTimerId",0);W(this,"_preChangeState",null);W(this,"undoBtn");W(this,"redoBtn");W(this,"conflicts",new Set);W(this,"CONFLICT_COLOR",16720384);this.arenaStorageKey=`bey_arena_${n.title.toLowerCase().replace(/\s+/g,"_")}`,this.modeBtn=this.addTopBarButton("● Solid","Toggle solid / mesh view"),this.modeBtn.addEventListener("click",()=>this.toggleMode());const s=this.addTopBarButton("Reset Arena","Reset arena configuration");s.className+=" reset-arena-btn",s.addEventListener("click",()=>{this.resetArena()}),this.undoBtn=this.addTopBarButton("↩ Undo","Undo (Ctrl+Z)"),this.undoBtn.addEventListener("click",()=>this.undo()),this.redoBtn=this.addTopBarButton("↪ Redo","Redo (Ctrl+Y)"),this.redoBtn.addEventListener("click",()=>this.redo());const r=this.addOverlayPanel("sandbox-left-panel");this.sceneTree=new wh(r);const o=document.createElement("button");o.className="tree-collapse-btn",o.textContent="◀",o.title="Collapse panel",this.sceneTree.header.appendChild(o),o.addEventListener("click",()=>{const c=r.classList.toggle("sandbox-left-panel--collapsed");o.textContent=c?"▶":"◀",o.title=c?"Expand panel":"Collapse panel"}),this.sceneTree.add("octagon-base","Octagon Base","⬡",null,{onAddChild:()=>this.addArena(),addChildButtons:[{label:"A+",title:"Add arena",className:"",onClick:()=>this.addArena()},{label:"B+",title:"Add bridge",className:"zone-btn",onClick:()=>this.addBridge()},{label:"W+",title:"Add base wall",className:"pit-btn",onClick:()=>this.addWall("octagon-base","base")}]});const a=this.addOverlayPanel("sandbox-right-panel");this.props=new lx(a),this.props.onClose=()=>{this.selectedId=null,this.sceneTree.clearSel(),this.props.showEmpty()},this.sceneTree.onSelect=c=>{if(this.selectedSlId){const l=this.speedLines.get(this.selectedSlId);l&&this._hideSlHandles(l)}this.selectedSlId=null,this.selectedId=c.length===1?c[0]:null,this.selectedId&&this.speedLines.has(this.selectedId)&&(this.selectedSlId=this.selectedId,this._showSlHandles(this.speedLines.get(this.selectedId))),this.renderProps()},this.sceneTree.onVisibilityToggle=(c,l)=>{(this.sceneObjects.get(c)??[]).forEach(h=>{h.visible=l})},this.sceneTree.onDelete=c=>{this.captureUndo();for(const l of c){const h=this.arenas.get(l);if(h){const u=[...h.pitIds],m=[...h.zoneIds];for(const _ of u)this.removePitFromScene(_);for(const _ of m)this.removeZoneFromScene(_);const g=this.sceneObjects.get(l);g&&(this.removeFromScene(...g),this.sceneObjects.delete(l)),this.disposeArena(h),this.arenas.delete(l),this.updateTopFace(),this.updateAllMoatIslandCaps();continue}if(this.pits.has(l)){const u=this.pits.get(l),m=this.arenas.get(u.parentArenaId);this.removePitFromScene(l),m&&(this.updateArenaFloor(m),this.updateArenaBowlHoles(m,u.parentArenaId));continue}if(this.zones.has(l)){const u=this.zones.get(l),m=this.arenas.get(u.parentArenaId);this.removeZoneFromScene(l),m&&(this.updateArenaFloor(m),this.updateArenaBowlHoles(m,u.parentArenaId));continue}if(this.speedLines.has(l)){this.captureUndo(),this._removeSpeedLine(l);continue}if(this.walls.has(l)){this.removeWall(l);continue}if(this.segments.has(l)){this.removeSegment(l);continue}if(this.bridges.has(l)){this.removeBridge(l);continue}const d=this.sceneObjects.get(l);d&&(this.removeFromScene(...d),this.sceneObjects.delete(l))}c.some(l=>l===this.selectedId)&&(this.selectedId=null,this.props.showEmpty()),this.saveArena(),this._flushUndoPending()},document.addEventListener("keydown",c=>{!c.ctrlKey&&!c.metaKey||(c.key==="z"||c.key==="Z"?(c.preventDefault(),c.shiftKey?this.redo():this.undo()):(c.key==="y"||c.key==="Y")&&(c.preventDefault(),this.redo()))}),this.updateUndoRedoUI(),this._onPointerDown=c=>this._slPointerDown(c),this._onPointerMove=c=>this._slPointerMove(c),this._onPointerUp=c=>this._slPointerUp(c)}serializeConfig(){const t={baseConfig:{...this.baseConfig},arenaSeq:this.arenaSeq,pitSeq:this.pitSeq,zoneSeq:this.zoneSeq,arenas:[...this.arenas.entries()].map(([n,s])=>{const r=hx(n,s,this.pits,this.zones);return r.walls=[...this.walls.values()].filter(o=>o.parentType==="arena"&&o.parentId===n).map(ea),r.speedLines=[...this.speedLines.values()].filter(o=>o.parentArenaId===n&&o.parentZoneId===null).map(Ol),r}),baseWalls:[...this.walls.values()].filter(n=>n.parentType==="base").map(ea),bridges:[...this.bridges.values()].map(n=>px(n,this.segments,this.walls)),wallSeq:this.wallSeq,bridgeSeq:this.bridgeSeq,segmentSeq:this.segmentSeq,speedLineSeq:this.speedlineSeq,speedLines:[...this.speedLines.values()].filter(n=>n.parentZoneId!==null).map(Ol)};return JSON.stringify(t)}captureUndo(){this._preChangeState||(this._preChangeState=this.serializeConfig()),clearTimeout(this._undoTimerId),this._undoTimerId=window.setTimeout(()=>this._flushUndoPending(),400)}_flushUndoPending(){if(clearTimeout(this._undoTimerId),!this._preChangeState)return;const t=this._preChangeState;this._preChangeState=null,this.serializeConfig()!==t&&(this.undoStack.push(t),this.undoStack.length>50&&this.undoStack.shift(),this.redoStack=[],this.updateUndoRedoUI())}undo(){if(this._flushUndoPending(),!this.undoStack.length)return;this.redoStack.push(this.serializeConfig());const t=JSON.parse(this.undoStack.pop());this._applyConfigToScene(t),this.saveArena(),this.updateUndoRedoUI()}redo(){if(this._flushUndoPending(),!this.redoStack.length)return;this.undoStack.push(this.serializeConfig());const t=JSON.parse(this.redoStack.pop());this._applyConfigToScene(t),this.saveArena(),this.updateUndoRedoUI()}updateUndoRedoUI(){this.undoBtn.disabled=this.undoStack.length===0,this.redoBtn.disabled=this.redoStack.length===0,this.undoBtn.style.opacity=this.undoStack.length===0?"0.4":"",this.redoBtn.style.opacity=this.redoStack.length===0?"0.4":""}_clearArenas(){for(const t of this.speedLines.values())this._disposeSpeedLine(t);this.speedLines.clear(),this.speedlineSeq=0,this.slSegSeq=0;for(const[t]of this.arenas.entries())this.sceneTree.remove(t);for(const t of this.pits.values())this.disposePit(t),this.removeFromScene(t.mesh,t.edges),t.seamMesh&&this.removeFromScene(t.seamMesh);for(const t of this.zones.values())this.disposeZone(t),this.removeFromScene(t.mesh,t.edges),t.seamMesh&&this.removeFromScene(t.seamMesh);for(const t of this.arenas.values())this.disposeArena(t),this.removeFromScene(t.mesh,t.edges);for(const t of this.walls.values())this._disposeWall(t);for(const t of this.bridges.values())this._disposeBridge(t);this.pits.clear(),this.zones.clear(),this.arenas.clear(),this.walls.clear(),this.bridges.clear(),this.segments.clear(),this.bridgesByArena.clear(),this.sceneObjects.clear(),this.arenaSeq=0,this.pitSeq=0,this.zoneSeq=0,this.wallSeq=0,this.bridgeSeq=0,this.segmentSeq=0}_applyConfigToScene(t){this._clearArenas(),this.baseConfig={...this.baseConfig,...t.baseConfig},this.rebuildBase(),this.arenaSeq=t.arenaSeq,this.pitSeq=t.pitSeq,this.zoneSeq=t.zoneSeq,this.wallSeq=t.wallSeq??0,this.bridgeSeq=t.bridgeSeq??0,this.segmentSeq=t.segmentSeq??0,this.speedlineSeq=t.speedLineSeq??0,this._loadArenasFromConfig(t),this.selectedId=null,this.sceneTree.clearSel(),this.props.showEmpty()}disposeArena(t){for(const n of t.spiralMeshes??[])this.removeFromScene(n),n.geometry.dispose(),n.material.dispose();t.spiralMeshes=[],t.mesh.geometry.dispose(),t.mesh.material.dispose(),t.edges.geometry.dispose(),t.edges.material.dispose(),t.floorMesh&&(t.floorMesh.geometry.dispose(),t.floorMesh.material.dispose(),this.removeFromScene(t.floorMesh)),t.islandMesh&&(t.islandMesh.geometry.dispose(),t.islandMesh.material.dispose(),this.removeFromScene(t.islandMesh)),t.rimSeamMesh&&(t.rimSeamMesh.geometry.dispose(),t.rimSeamMesh.material.dispose(),this.removeFromScene(t.rimSeamMesh))}disposePit(t){t.mesh.geometry.dispose(),t.mesh.material.dispose(),t.edges.geometry.dispose(),t.edges.material.dispose(),t.seamMesh&&(t.seamMesh.geometry.dispose(),t.seamMesh.material.dispose())}disposeZone(t){t.mesh.geometry.dispose(),t.mesh.material.dispose(),t.edges.geometry.dispose(),t.edges.material.dispose(),t.seamMesh&&(t.seamMesh.geometry.dispose(),t.seamMesh.material.dispose())}_disposeSpeedLine(t){t.mesh&&(this.removeFromScene(t.mesh),t.mesh.geometry.dispose(),t.mesh.material.dispose()),t.edges&&(this.removeFromScene(t.edges),t.edges.geometry.dispose(),t.edges.material.dispose());for(const n of t.markerMeshes)this.removeFromScene(n),n.geometry.dispose(),n.material.dispose();for(const n of t.handleMeshes)this.removeFromScene(n),n.geometry.dispose(),n.material.dispose();for(const n of t.overlapMarkers)this.removeFromScene(n),n.geometry.dispose(),n.material.dispose();t.markerMeshes=[],t.handleMeshes=[],t.overlapMarkers=[],this.sceneObjects.delete(t.id),this.sceneTree.remove(t.id)}_addSpeedLine(t,n=null){this.captureUndo();const s=`sl-${++this.speedlineSeq}`,r=`Speed Line ${this.speedlineSeq}`,o=this.arenas.get(t);if(!o)return;const a=ox(r,t,s,n);a.segments[0].id=`${s}-seg-${++this.slSegSeq}`,this.speedLines.set(s,a),o.speedLineIds.push(s);const{mesh:c,edges:l,markerMeshes:h,handleMeshes:d,totalLength:u}=Qo(a,o,this.zones);a.mesh=c,a.edges=l,a.markerMeshes=h,a.handleMeshes=d,a.totalLength=u,this.addToScene(c,l,...h,...d),this.sceneObjects.set(s,[c,l]);const m=n??t;this.sceneTree.add(s,r,"↝",m),this._checkSpeedLineOverlaps(t),this.saveArena()}_removeSpeedLine(t){const n=this.speedLines.get(t);if(!n)return;this._disposeSpeedLine(n);const s=this.arenas.get(n.parentArenaId);if(s&&(s.speedLineIds=s.speedLineIds.filter(r=>r!==t)),n.parentZoneId){const r=this.zones.get(n.parentZoneId);r&&(r.speedLineIds=r.speedLineIds.filter(o=>o!==t))}this.speedLines.delete(t),this.selectedSlId===t&&(this.selectedSlId=null),this._checkSpeedLineOverlaps(n.parentArenaId),this.saveArena()}_updateSpeedLine(t){const n=this.arenas.get(t.parentArenaId);n&&(ax(t,n,this.zones,this.getScene(),(...s)=>this.addToScene(...s),(...s)=>this.removeFromScene(...s)),this.sceneObjects.set(t.id,[t.mesh,t.edges]))}_addSegmentsToLine(t,n){const s=this.speedLines.get(t);if(s){for(const r of n)r.id=`${t}-seg-${++this.slSegSeq}`;s.segments.push(...n),this._updateSpeedLine(s),this.saveArena()}}_removeSegmentFromLine(t,n){const s=this.speedLines.get(t);s&&(s.segments.length<=1||(s.segments.splice(n,1),this._updateSpeedLine(s),this.saveArena()))}_showSlHandles(t){t.handleMeshes.forEach(n=>{n.visible=!0})}_hideSlHandles(t){t.handleMeshes.forEach(n=>{n.visible=!1})}_checkSpeedLineOverlaps(t){const n=this.arenas.get(t);if(!n)return;const s=[...this.speedLines.values()].filter(r=>r.parentArenaId===t);for(const r of s){for(const o of r.overlapMarkers)this.removeFromScene(o),o.geometry.dispose(),o.material.dispose();r.overlapMarkers=[]}if(!(s.length<2))for(let r=0;r<s.length;r++)for(let o=r+1;o<s.length;o++){const a=s[r],c=s[o],l=zn({parentZoneId:a.parentZoneId},n,this.zones),h=zn({parentZoneId:c.parentZoneId},n,this.zones),d=wl(a,l),u=wl(c,h);e:for(const m of d)for(const g of u)if(m.distanceTo(g)<Ee.OVERLAP_THRESHOLD){const _=m.clone().add(g).multiplyScalar(.5),f=Vv(_);a.overlapMarkers.push(f),this.addToScene(f);break e}}}_restoreSpeedLineSave(t,n){const s=this.arenas.get(n);if(s)for(const r of t){const o={...r,totalLength:0,mesh:null,edges:null,markerMeshes:[],handleMeshes:[],overlapMarkers:[]};if(this.speedLines.set(o.id,o),s.speedLineIds.push(o.id),o.parentZoneId){const m=this.zones.get(o.parentZoneId);m&&!m.speedLineIds.includes(o.id)&&m.speedLineIds.push(o.id)}const{mesh:a,edges:c,markerMeshes:l,handleMeshes:h,totalLength:d}=Qo(o,s,this.zones);o.mesh=a,o.edges=c,o.markerMeshes=l,o.handleMeshes=h,o.totalLength=d,this.addToScene(a,c,...l,...h),this.sceneObjects.set(o.id,[a,c]);const u=o.parentZoneId??n;this.sceneTree.add(o.id,o.name,"↝",u)}}_slPointerDown(t){const n=this.selectedSlId?this.speedLines.get(this.selectedSlId):null;if(!n)return;const s=this.getRendererCanvas();if(!s)return;const r=this.getCamera();if(!r)return;const o=s.getBoundingClientRect(),a=(t.clientX-o.left)/o.width*2-1,c=-((t.clientY-o.top)/o.height)*2+1;this.slRaycaster.setFromCamera(new K(a,c),r);const l=this.slRaycaster.intersectObjects(n.handleMeshes,!1);if(!l.length)return;const h=l[0].object,{handleType:d,handleIndex:u}=h.userData,m=this.arenas.get(n.parentArenaId);if(!m)return;const g=-(this.baseConfig.height+m.posY),_=new _n(new L(0,1,0),g);this.slDrag={slId:n.id,handleType:d,handleIndex:u,dragPlane:_};const f=this.getControls();f&&(f.enabled=!1),s.setPointerCapture(t.pointerId)}_slPointerMove(t){const n=this.getRendererCanvas();if(!n)return;const s=this.getCamera();if(!s)return;const r=n.getBoundingClientRect(),o=(t.clientX-r.left)/r.width*2-1,a=-((t.clientY-r.top)/r.height)*2+1;if(this.slRaycaster.setFromCamera(new K(o,a),s),!this.slDrag){const p=this.selectedSlId?this.speedLines.get(this.selectedSlId):null;if(p){const x=this.slRaycaster.intersectObjects(p.handleMeshes,!1);for(const v of p.handleMeshes)v.material.color.setHex(Ee.HANDLE_COLOR);x.length&&x[0].object.material.color.setHex(Ee.HANDLE_HOVER_COLOR)}return}const{slId:c,handleType:l,handleIndex:h,dragPlane:d}=this.slDrag,u=this.speedLines.get(c);if(!u)return;const m=this.arenas.get(u.parentArenaId);if(!m)return;const g=new L;if(!this.slRaycaster.ray.intersectPlane(d,g))return;const{alx:_,alz:f}=Ox(g.x,g.z,m);if(l==="start")u.startR=Math.hypot(_,f),u.startAngle=Math.atan2(f,_)*(180/Math.PI);else{const p=h-1;p>=0&&p<u.segments.length&&(u.segments[p].rotY=Math.atan2(_,f)*(180/Math.PI)%180)}this._updateSpeedLine(u),this.selectedId===c&&this.renderProps()}_slPointerUp(t){if(!this.slDrag)return;const n=this.getRendererCanvas();n&&n.releasePointerCapture(t.pointerId);const s=this.getControls();s&&(s.enabled=!0),this.slDrag=null,this.captureUndo(),this.saveArena(),this._flushUndoPending()}_disposeWall(t){t.mesh&&(t.mesh.geometry.dispose(),t.mesh.material.dispose(),this.removeFromScene(t.mesh),t.mesh=null),t.edges&&(t.edges.geometry.dispose(),t.edges.material.dispose(),this.removeFromScene(t.edges),t.edges=null),this.sceneObjects.delete(t.id),this.sceneTree.remove(t.id)}_disposeBridge(t){for(const n of t.segmentIds){const s=this.segments.get(n);s&&(s.mesh&&(s.mesh.geometry.dispose(),s.mesh.material.dispose(),this.removeFromScene(s.mesh),s.mesh=null),s.edges&&(s.edges.geometry.dispose(),s.edges.material.dispose(),this.removeFromScene(s.edges),s.edges=null),this.sceneObjects.delete(n),this.sceneTree.remove(n),this.segments.delete(n))}for(const n of t.wallIds){const s=this.walls.get(n);s&&(this._disposeWall(s),this.walls.delete(n))}t.group&&this.removeFromScene(t.group),this.sceneObjects.delete(t.id),this.sceneTree.remove(t.id)}_getArenaRimPts(t){const n=this.arenas.get(t);return n?pt(n):[]}_arenaRimY(t){const n=this.arenas.get(t);return n?this.baseConfig.height+n.posY:this.baseConfig.height}applyWall(t){let n,s,r=0,o=0;if(t.parentType==="arena"){const h=this.arenas.get(t.parentId);if(!h)return;n=pt(h),s=this.baseConfig.height+h.posY,r=h.posX,o=h.posZ}else if(t.parentType==="base")n=[],s=this.baseConfig.height;else return;const a=this.getScene();if(!a)return;const c=vx(t,n,s,r,o),l=Sx(t,n,s,r,o);if(t.mesh)t.mesh.geometry.dispose(),t.mesh.geometry=c;else{const h=ut({color:t.color,surface:t.surface,customTileData:null,tileScale:20});t.mesh=new Be(c,h),a.add(t.mesh)}if(t.edges)t.edges.geometry.dispose(),t.edges.geometry=l;else{const h=new ve(t.color).lerp(new ve(16777215),.5);t.edges=new Yt(l,new kt({color:h})),a.add(t.edges)}this.sceneObjects.set(t.id,[t.mesh,t.edges])}addWall(t,n){this.captureUndo();const s=`wall-${++this.wallSeq}`,r=`Wall ${this.wallSeq}`,o=Mx(s,r,t,n);this.walls.set(s,o),this.applyWall(o);const a=n==="base"?"octagon-base":t;this.sceneTree.add(s,r,"🧱",a),this.saveArena()}removeWall(t){const n=this.walls.get(t);if(n){if(this._disposeWall(n),this.walls.delete(t),n.parentType==="arena"){const s=this.arenas.get(n.parentId);s&&(s.wallIds=s.wallIds.filter(r=>r!==t))}if(n.parentType==="bridge"){const s=[...this.bridges.values()].find(r=>r.wallIds.includes(t));s&&(s.wallIds=s.wallIds.filter(r=>r!==t))}this.saveArena()}}rebuildDependentsOf(t){for(const s of this.walls.values())s.parentType==="arena"&&s.parentId===t&&this.applyWall(s);const n=this.bridgesByArena.get(t);if(n)for(const s of n){const r=this.bridges.get(s);r&&r.segmentIds.length>0&&this.applyBridgeFromSegment(r.segmentIds[0])}}_segmentStartPose(t){const n=this.bridges.get(t.bridgeId);if(!n)return{...mn,pos:mn.pos.clone(),dir:mn.dir.clone(),up:mn.up.clone()};let s=n.startRef?yx(n.startRef,this.arenas,this.walls,this.baseConfig.height):{pos:mn.pos.clone(),dir:mn.dir.clone(),up:mn.up.clone()};for(const r of n.segmentIds){if(r===t.id)break;const o=this.segments.get(r);o&&(s=bx(o,s))}return s}applySegment(t){const n=this.bridges.get(t.bridgeId);if(!n)return;const s=this.getScene();if(!s)return;const r=this._segmentStartPose(t),o=t.color??n.color,a=t.surface??n.surface,c=Lx(t,r,n.section),l=Ix(t,r,n.section);if(t.mesh?(t.mesh.geometry.dispose(),t.mesh.material.dispose(),t.mesh.geometry=c,t.mesh.material=ut({color:o,surface:a,customTileData:null,tileScale:20})):(t.mesh=new Be(c,ut({color:o,surface:a,customTileData:null,tileScale:20})),n.group.add(t.mesh),s.add(n.group)),t.edges)t.edges.geometry.dispose(),t.edges.geometry=l;else{const h=new ve(o).lerp(new ve(16777215),.5);t.edges=new Yt(l,new kt({color:h})),n.group.add(t.edges)}this.sceneObjects.set(t.id,[t.mesh,t.edges])}applyBridgeFromSegment(t){const n=this.segments.get(t);if(!n)return;const s=this.bridges.get(n.bridgeId);if(!s)return;const r=s.segmentIds.indexOf(t);if(!(r<0))for(let o=r;o<s.segmentIds.length;o++){const a=this.segments.get(s.segmentIds[o]);a&&this.applySegment(a)}}addBridge(){this.captureUndo();const t=`bridge-${++this.bridgeSeq}`,n=`Bridge ${this.bridgeSeq}`,s=new zt,r={id:t,name:n,startRef:null,segmentIds:[],section:Dx(),color:11184844,surface:"metal",wallIds:[],group:s};this.bridges.set(t,r);const o=this.getScene();o&&o.add(s),this.sceneTree.add(t,n,"🌉","octagon-base",{addChildButtons:[{label:"Seg+",title:"Add segment",className:"zone-btn",onClick:()=>this.addSegment(t,"straight")},{label:"W+",title:"Add wall",className:"pit-btn",onClick:()=>this.addWall(t,"bridge")}]}),this.addSegment(t,"straight"),this.saveArena()}removeBridge(t){var s;const n=this.bridges.get(t);if(n){if(this._disposeBridge(n),this.bridges.delete(t),((s=n.startRef)==null?void 0:s.type)==="arena"){const r=this.bridgesByArena.get(n.startRef.id);r&&(r.delete(t),r.size||this.bridgesByArena.delete(n.startRef.id))}this.saveArena()}}addSegment(t,n){const s=this.bridges.get(t);if(!s)return;this.captureUndo();const r=`seg-${++this.segmentSeq}`,o=`Seg ${this.segmentSeq}`,a=Nx(r,o,t,s.segmentIds.length,n);this.segments.set(r,a),s.segmentIds.push(r),this.applySegment(a);const c=zl(n);this.sceneTree.add(r,o,c,t),this.saveArena()}removeSegment(t){const n=this.segments.get(t);if(!n)return;const s=this.bridges.get(n.bridgeId);if(!s)return;const r=s.segmentIds.indexOf(t);if(!(r<0)){this.captureUndo(),n.mesh&&(n.mesh.geometry.dispose(),n.mesh.material.dispose(),this.removeFromScene(n.mesh),n.mesh=null),n.edges&&(n.edges.geometry.dispose(),n.edges.material.dispose(),this.removeFromScene(n.edges),n.edges=null),this.sceneObjects.delete(t),this.sceneTree.remove(t),s.segmentIds.splice(r,1),this.segments.delete(t);for(let o=r;o<s.segmentIds.length;o++){const a=this.segments.get(s.segmentIds[o]);a&&(a.orderIndex=o,this.applySegment(a))}this.saveArena()}}buildCustom(t){const n=this.baseConfig.height,s=this.baseConfig.sides,r=vn/Math.cos(Math.PI/s),o=Math.PI/s,a=ut({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.baseMesh=new Be(new Sn(r,r,n,s,1,!0),a),this.baseMesh.rotation.y=o,this.baseMesh.position.y=-n/2,t.add(this.baseMesh);const c=new Sn(r,r,n,s,1,!1);this.baseEdges=new Yt(new $c(c),new kt({color:12101768})),this.baseEdges.rotation.y=o,this.baseEdges.position.y=-n/2,t.add(this.baseEdges),c.dispose();const l=ut({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.topFaceMesh=new Be(El(s,r,o,0,[]),l),t.add(this.topFaceMesh),this.sceneObjects.set("octagon-base",[this.baseMesh,this.baseEdges,this.topFaceMesh]),this.loadArena()}rebuildBase(){if(!this.baseMesh||!this.baseEdges||!this.topFaceMesh)return;const t=this.baseConfig.height,n=this.baseConfig.sides,s=vn/Math.cos(Math.PI/n),r=Math.PI/n;this.baseMesh.geometry.dispose(),this.baseMesh.geometry=new Sn(s,s,t,n,1,!0),this.baseMesh.rotation.y=r,this.baseMesh.position.y=-t/2;const o=ut({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.baseMesh.material.dispose(),this.baseMesh.material=o;const a=new Sn(s,s,t,n,1,!1);this.baseEdges.geometry.dispose(),this.baseEdges.geometry=new $c(a),this.baseEdges.rotation.y=r,this.baseEdges.position.y=-t/2,a.dispose();const c=ut({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.topFaceMesh.material.dispose(),this.topFaceMesh.material=c;for(const l of this.arenas.values())l.depth>t&&(l.depth=t),Fo(l,this.getArenaHoles(l),this.getScene()??void 0),this.updateArenaChildren(l),this.updateArenaRimSeam(l)}updateTopFace(){if(!this.topFaceMesh)return;const t=this.baseConfig.sides,n=vn/Math.cos(Math.PI/t),s=Math.PI/t,r=El(t,n,s,0,[...this.arenas.values()]);this.topFaceMesh.geometry.dispose(),this.topFaceMesh.geometry=r}getArenaHoles(t){if(t.isMoat||t.wallProfile==="straight"||t.wallProfile==="spiral")return[];const n=[];for(const s of t.pitIds){const r=this.pits.get(s);if(!r)continue;const{lx:o,lz:a}=Mn(r.posR,r.posAngle);n.push({cx:o,cz:a,rx:r.radiusX,rz:r.radiusZ,rotY:r.rotY*Xe,pts:pt(r)})}for(const s of t.zoneIds){const r=this.zones.get(s);if(!r)continue;const{lx:o,lz:a}=Mn(r.posR,r.posAngle);n.push({cx:o,cz:a,rx:r.radiusX,rz:r.radiusZ,rotY:r.rotY*Xe,pts:pt(r)})}return n}updateArenaBowlHoles(t,n){if(t.isMoat)return;const s=t.posY>oi;if(!s&&t.wallProfile!=="parabolic")return;const r=this.getArenaHoles(t),o=pt(t);t.mesh.geometry.dispose(),s?t.mesh.geometry=td(o,t.depth,t.wallProfile,0,r):t.mesh.geometry=ed(o,t.depth,0,r)}updateArenaFloor(t){if(t.posY>oi||t.wallProfile!=="straight"||t.isMoat){t.floorMesh&&(this.removeFromScene(t.floorMesh),t.floorMesh.geometry.dispose(),t.floorMesh.material.dispose(),t.floorMesh=null);return}const n=t.pitIds.map(o=>this.pits.get(o)).filter(Boolean),s=t.zoneIds.map(o=>this.zones.get(o)).filter(Boolean),r=Al(t,n,s);if(t.floorMesh)t.floorMesh.geometry.dispose(),t.floorMesh.geometry=r;else{const o=ut({color:t.color,surface:t.surface,customTileData:t.customTileData,tileScale:t.tileScale});t.floorMesh=new Be(r,o),t.floorMesh.position.set(t.posX,t.posY,t.posZ),t.floorMesh.rotation.y=t.rotY,this.addToScene(t.floorMesh);const a=this.sceneObjects.get(this._arenaIdFor(t));a&&a.push(t.floorMesh)}}getArenasOnIsland(t){const n=[],s=Math.cos(-t.rotY),r=Math.sin(-t.rotY);for(const o of this.arenas.values()){if(o===t||Math.abs(o.posY-t.innerRimOffset)>1)continue;const a=o.posX-t.posX,c=o.posZ-t.posZ,l=a*s-c*r,h=a*r+c*s;(l/t.innerRadiusX)**2+(h/t.innerRadiusZ)**2<=1&&n.push({cx:l,cz:h,rx:o.radiusX,rz:o.radiusZ})}return n}updateIslandCap(t,n){if(!t.isMoat){t.islandMesh&&(this.removeFromScene(t.islandMesh),t.islandMesh.geometry.dispose(),t.islandMesh.material.dispose(),t.islandMesh=null);return}const s=Tl(t,this.getArenasOnIsland(t));if(t.islandMesh)t.islandMesh.geometry.dispose(),t.islandMesh.geometry=s,t.islandMesh.position.set(t.posX,t.posY,t.posZ),t.islandMesh.rotation.y=t.rotY;else{const r=ut({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});t.islandMesh=new Be(s,r),t.islandMesh.position.set(t.posX,t.posY,t.posZ),t.islandMesh.rotation.y=t.rotY,this.addToScene(t.islandMesh);const o=this.sceneObjects.get(n);o&&o.push(t.islandMesh)}}updateAllMoatIslandCaps(){for(const[t,n]of this.arenas.entries())n.isMoat&&this.updateIslandCap(n,t)}updateArenaRimSeam(t){const n=pt(t),r=Ji(n,0,0,0,(o,a)=>0);if(t.rimSeamMesh)t.rimSeamMesh.geometry.dispose(),t.rimSeamMesh.geometry=r,t.rimSeamMesh.position.set(t.posX,t.posY,t.posZ),t.rimSeamMesh.rotation.y=t.rotY;else{const o=ut({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});t.rimSeamMesh=new Be(r,o),t.rimSeamMesh.position.set(t.posX,t.posY,t.posZ),t.rimSeamMesh.rotation.y=t.rotY,this.addToScene(t.rimSeamMesh)}}_arenaIdFor(t){for(const[n,s]of this.arenas.entries())if(s===t)return n;return""}updateArenaChildren(t){for(const n of t.pitIds){const s=this.pits.get(n);s&&Qn(s,t,this.pits,this.zones)}for(const n of t.zoneIds){const s=this.zones.get(n);s&&(lr(s,t,this.getScene(),this.pits,this.zones),this._updateZoneChildren(s,t))}for(const n of t.speedLineIds){const s=this.speedLines.get(n);s&&this._updateSpeedLine(s)}}_updateZoneChildren(t,n){for(const s of t.pitIds){const r=this.pits.get(s);r&&Qn(r,n,this.pits,this.zones)}for(const s of t.zoneIds){const r=this.zones.get(s);r&&(lr(r,n,this.getScene(),this.pits,this.zones),this._updateZoneChildren(r,n))}for(const s of t.speedLineIds??[]){const r=this.speedLines.get(s);r&&this._updateSpeedLine(r)}}renderProps(){const t=this.selectedId;if(!t){this.props.showEmpty();return}if(t==="octagon-base"){this.props.showBase(this.baseConfig,()=>{this.captureUndo(),this.rebuildBase(),this.updateTopFace(),this.saveArena()},h=>{this.captureUndo(),this.baseConfig.color=h;const d=ut({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});this.baseMesh.material.dispose(),this.baseMesh.material=d,this.topFaceMesh.material.dispose(),this.topFaceMesh.material=ut({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale}),this.saveArena()},()=>{this.captureUndo(),this.rebuildBase(),this.updateTopFace(),this.saveArena()});return}const n=this.arenas.get(t);if(n){this.props.showArena(n,this.baseConfig.height,()=>{this.captureUndo(),Fo(n,this.getArenaHoles(n),this.getScene()??void 0),this.updateArenaChildren(n),this.updateArenaFloor(n),this.updateIslandCap(n,t),this.updateArenaRimSeam(n),this.updateAllMoatIslandCaps(),this.updateTopFace(),this.rebuildDependentsOf(t),this.saveArena()},()=>{this.captureUndo(),Fo(n,this.getArenaHoles(n),this.getScene()??void 0),this.updateArenaChildren(n),this.updateArenaFloor(n),this.updateIslandCap(n,t),this.updateArenaRimSeam(n),this.updateAllMoatIslandCaps(),this.updateTopFace(),this.rebuildDependentsOf(t),this.renderProps(),this.saveArena()},h=>{this.captureUndo(),this.sceneTree.setLabel(t,h),this.saveArena()},()=>{this.captureUndo(),Pl(n),this.saveArena()},()=>{this.captureUndo(),Pl(n),this.saveArena()});return}const s=this.pits.get(t);if(s){const h=this.arenas.get(s.parentArenaId);this.props.showPit(s,h,()=>{this.captureUndo(),Qn(s,h,this.pits,this.zones),this.updateArenaBowlHoles(h,s.parentArenaId),this.updateArenaFloor(h),this.checkSiblingConflicts(this.directParentId(s),this.directParentType(s)),this.saveArena()},()=>{this.captureUndo(),Qn(s,h,this.pits,this.zones),this.updateArenaBowlHoles(h,s.parentArenaId),this.updateArenaFloor(h),this.checkSiblingConflicts(this.directParentId(s),this.directParentType(s)),this.renderProps(),this.saveArena()},d=>{this.captureUndo(),this.sceneTree.setLabel(t,d),this.saveArena()},()=>{this.captureUndo();const d=new ve(s.color).lerp(new ve(16777215),.5);s.edges.material.color.copy(d),Qn(s,h,this.pits,this.zones),this.saveArena()},()=>{this.captureUndo(),Qn(s,h,this.pits,this.zones),this.saveArena()});return}const r=this.zones.get(t);if(r){const h=this.arenas.get(r.parentArenaId);this.props.showZone(r,h,()=>{this.captureUndo(),lr(r,h,this.getScene(),this.pits,this.zones),this.updateArenaBowlHoles(h,r.parentArenaId),this.updateArenaFloor(h),this.checkSiblingConflicts(this.directParentId(r),this.directParentType(r)),this.saveArena()},()=>{this.captureUndo(),lr(r,h,this.getScene(),this.pits,this.zones),this.updateArenaBowlHoles(h,r.parentArenaId),this.updateArenaFloor(h),this.checkSiblingConflicts(this.directParentId(r),this.directParentType(r)),this.renderProps(),this.saveArena()},d=>{this.captureUndo(),this.sceneTree.setLabel(t,d),this.saveArena()});return}const o=this.speedLines.get(t);if(o){const h=this.arenas.get(o.parentArenaId);this.props.showSpeedLine(o,h,()=>{this.captureUndo(),this._updateSpeedLine(o),this._checkSpeedLineOverlaps(o.parentArenaId),this.saveArena()},d=>{this.captureUndo(),this._updateSpeedLine(o),this.saveArena()},d=>{this.captureUndo(),this.sceneTree.setLabel(t,d),this.saveArena()},()=>{this.captureUndo(),this._updateSpeedLine(o),this.saveArena()},d=>{this.captureUndo(),this._addSegmentsToLine(t,d),this.renderProps()},d=>{this.captureUndo(),this._removeSegmentFromLine(t,d),this.renderProps()});return}const a=this.walls.get(t);if(a){this.props.showWall(a,()=>{this.captureUndo(),this.applyWall(a),this.saveArena()},h=>{this.captureUndo(),this.sceneTree.setLabel(t,h),this.saveArena()});return}const c=this.bridges.get(t);if(c){const h=new Map([...this.arenas.entries()].map(([u,m])=>[u,m.name])),d=new Map([...this.walls.entries()].map(([u,m])=>[u,m.name]));this.props.showBridge(c,h,d,()=>{this.captureUndo(),c.segmentIds.length>0&&this.applyBridgeFromSegment(c.segmentIds[0]),this.saveArena()},u=>{this.captureUndo(),this.sceneTree.setLabel(t,u),this.saveArena()},u=>{this.addSegment(t,u)});return}const l=this.segments.get(t);if(l){this.props.showBridgeSegment(l,()=>{this.captureUndo(),this.applyBridgeFromSegment(l.id),this.saveArena()},h=>{this.captureUndo(),this.sceneTree.setLabel(t,h),this.saveArena()});return}this.props.showEmpty()}toggleMode(){this.solidMode=!this.solidMode,this.modeBtn.textContent=this.solidMode?"● Solid":"○ Mesh",this.baseMesh&&(this.baseMesh.visible=this.solidMode),this.topFaceMesh&&(this.topFaceMesh.visible=this.solidMode);for(const t of this.arenas.values()){t.mesh.visible=this.solidMode,t.floorMesh&&(t.floorMesh.visible=this.solidMode),t.islandMesh&&(t.islandMesh.visible=this.solidMode),t.rimSeamMesh&&(t.rimSeamMesh.visible=this.solidMode);for(const n of t.spiralMeshes??[])n.visible=this.solidMode}for(const t of this.pits.values())t.mesh.visible=this.solidMode,t.seamMesh&&(t.seamMesh.visible=this.solidMode);for(const t of this.zones.values())t.mesh.visible=this.solidMode,t.seamMesh&&(t.seamMesh.visible=this.solidMode)}addArena(){this.captureUndo();const t=`arena-${++this.arenaSeq}`,n=cx(`Arena ${this.arenaSeq}`),[s,r]=Rl(n,[],this.getScene()??void 0);n.mesh=s,n.edges=r;const o=Cl(n,this.baseConfig.color,this.baseConfig.surface,this.baseConfig.customTileData,this.baseConfig.tileScale);n.rimSeamMesh=o,this.addToScene(s,r,o,...n.spiralMeshes??[]),this.sceneObjects.set(t,[s,r,o]),this.arenas.set(t,n),this.sceneTree.add(t,n.name,"⏺","octagon-base",{addChildButtons:[{label:"P+",title:"Add pit",className:"pit-btn",onClick:()=>this.addPit(t)},{label:"Z+",title:"Add zone",className:"zone-btn",onClick:()=>this.addZone(t)},{label:"W+",title:"Add wall",className:"pit-btn",onClick:()=>this.addWall(t,"arena")},{label:"SL+",title:"Add speed line",className:"sl-btn",onClick:()=>this._addSpeedLine(t)}]}),this.updateTopFace(),this.updateAllMoatIslandCaps(),this.saveArena()}directParentId(t){return t.parentZoneId?t.parentZoneId:t.parentArenaId}directParentType(t){return t.parentZoneId?"zone":"arena"}getSiblings(t,n){const s=[];if(n==="arena"){const r=this.arenas.get(t);if(!r)return s;for(const o of r.pitIds){const a=this.pits.get(o);a&&s.push({id:o,item:a,kind:"pit"})}for(const o of r.zoneIds){const a=this.zones.get(o);a&&s.push({id:o,item:a,kind:"zone"})}}else{const r=this.zones.get(t);if(!r)return s;for(const o of r.pitIds){const a=this.pits.get(o);a&&s.push({id:o,item:a,kind:"pit"})}for(const o of r.zoneIds){const a=this.zones.get(o);a&&s.push({id:o,item:a,kind:"zone"})}}return s}minRadius(t){return Math.min(t.radiusX,t.radiusZ)}itemCenter(t){const{lx:n,lz:s}=Mn(t.posR,t.posAngle);return{cx:n,cz:s}}checkSiblingConflicts(t,n){const s=this.getSiblings(t,n),r=new Set([...this.conflicts].filter(a=>s.some(c=>c.id===a))),o=new Set;for(let a=0;a<s.length;a++)for(let c=a+1;c<s.length;c++){const l=s[a],h=s[c],d=this.itemCenter(l.item),u=this.itemCenter(h.item),m=Math.hypot(d.cx-u.cx,d.cz-u.cz),g=this.minRadius(l.item),_=this.minRadius(h.item),f=g+_,p=Math.abs(g-_),x=m<f,v=m<=p;if(x){if(l.kind!==h.kind)v||(o.add(l.id),o.add(h.id));else if(!v){this.mergeSameType(l,h,t,n);return}}}for(const a of r)if(!o.has(a)){const c=this.pits.get(a);if(c){const h=new ve(c.color).lerp(new ve(16777215),.5);c.edges.material.color.set(h)}const l=this.zones.get(a);if(l){const h=new ve(l.color).lerp(new ve(16777215),.5);l.edges.material.color.set(h)}this.conflicts.delete(a)}for(const a of o)if(!this.conflicts.has(a)){const c=this.pits.get(a);c&&c.edges.material.color.set(this.CONFLICT_COLOR);const l=this.zones.get(a);l&&l.edges.material.color.set(this.CONFLICT_COLOR),this.conflicts.add(a)}}convexHull(t){const n=[...t].sort((a,c)=>a.x!==c.x?a.x-c.x:a.y-c.y),s=(a,c,l)=>(c.x-a.x)*(l.y-a.y)-(c.y-a.y)*(l.x-a.x),r=[];for(const a of n){for(;r.length>=2&&s(r[r.length-2],r[r.length-1],a)<=0;)r.pop();r.push(a)}const o=[];for(let a=n.length-1;a>=0;a--){const c=n[a];for(;o.length>=2&&s(o[o.length-2],o[o.length-1],c)<=0;)o.pop();o.push(c)}return r.pop(),o.pop(),[...r,...o]}mergeSameType(t,n,s,r){const o=this.arenas.get((t.kind==="pit",t.item.parentArenaId));if(!o)return;const a=f=>{const{lx:p,lz:x}=Mn(f.posR,f.posAngle),v=Math.cos(f.rotY*Xe),S=Math.sin(f.rotY*Xe);return pt(f).map(R=>new K(R.x*v-R.y*S+p,R.x*S+R.y*v+x))},c=[...a(t.item),...a(n.item)],l=this.convexHull(c);if(l.length<3)return;const h=l.reduce((f,p)=>f+p.x,0)/l.length,d=l.reduce((f,p)=>f+p.y,0)/l.length,u=Math.hypot(h,d),m=Math.atan2(d,h)/Xe,g=Math.max(t.item.depth,n.item.depth),_=l.map(f=>new K(f.x-h,f.y-d));if(t.kind==="pit"){const f=t.item,p=`pit-${++this.pitSeq}`,x=Il(`Pit ${this.pitSeq}`,f.parentArenaId,p);x.posR=u,x.posAngle=m,x.depth=g,x.radiusX=Math.max(..._.map(G=>Math.abs(G.x)))||10,x.radiusZ=Math.max(..._.map(G=>Math.abs(G.y)))||10;const v=zn({parentZoneId:null},o,this.zones),S=nd(_,g,"straight",0,0,0,v),R=id(_,g,"straight",0,0,0,v),A=ut({color:f.color,surface:f.surface,customTileData:f.customTileData,tileScale:f.tileScale}),T=new ve(f.color).lerp(new ve(16777215),.5),C=new Be(S,A),b=new Yt(R,new kt({color:T})),{wx:y,wz:P,wRotY:N}=bs(o,x);C.position.set(y,0,P),C.rotation.y=N,b.position.set(y,0,P),b.rotation.y=N;const U=new Be(new Fe,ut({color:f.color,surface:f.surface,customTileData:f.customTileData,tileScale:f.tileScale}));U.position.set(y,0,P),U.rotation.y=N,x.mesh=C,x.edges=b,x.seamMesh=U,this.removePitFromScene(t.id),this.removePitFromScene(n.id),this.pits.set(p,x),Qn(x,o,this.pits,this.zones),this.addToScene(C,b,U),this.sceneObjects.set(p,[C,b,U]),this.addChildToParent(p,"pit",s,r),this.sceneTree.add(p,x.name,"▼",s)}else{const f=t.item,p=`zone-${++this.zoneSeq}`,x=Dl(`Zone ${this.zoneSeq}`,f.parentArenaId,p,f.parentZoneId);x.posR=u,x.posAngle=m,x.depth=g,x.radiusX=Math.max(..._.map(A=>Math.abs(A.x)))||15,x.radiusZ=Math.max(..._.map(A=>Math.abs(A.y)))||15,x.fill=f.fill,x.fillColor=f.fillColor;const[v,S,R]=Bo(x,o,this.pits,this.zones);x.mesh=v,x.edges=S,x.seamMesh=R,this.removeZoneFromScene(t.id),this.removeZoneFromScene(n.id),this.zones.set(p,x),this.addToScene(v,S,R),this.sceneObjects.set(p,[v,S,R]),this.addChildToParent(p,"zone",s,r),this.sceneTree.add(p,x.name,"◈",s,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(p,"zone")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(p,"zone")}]})}this.saveArena()}addChildToParent(t,n,s,r){const o=n==="pit"?"pitIds":"zoneIds";if(r==="arena"){const a=this.arenas.get(s);a&&a[o].push(t)}else{const a=this.zones.get(s);a&&a[o].push(t)}}removePitFromScene(t){const n=this.pits.get(t);if(!n)return;this.disposePit(n),this.removeFromScene(n.mesh,n.edges),n.seamMesh&&this.removeFromScene(n.seamMesh),this.sceneObjects.delete(t),this.sceneTree.remove(t),this.pits.delete(t);const s=this.arenas.get(n.parentArenaId);s&&(s.pitIds=s.pitIds.filter(r=>r!==t))}removeZoneFromScene(t){const n=this.zones.get(t);if(!n)return;this.disposeZone(n),this.removeFromScene(n.mesh,n.edges),n.seamMesh&&this.removeFromScene(n.seamMesh),this.sceneObjects.delete(t),this.sceneTree.remove(t),this.zones.delete(t);const s=this.arenas.get(n.parentArenaId);if(s&&(s.zoneIds=s.zoneIds.filter(r=>r!==t)),n.parentZoneId){const r=this.zones.get(n.parentZoneId);r&&(r.zoneIds=r.zoneIds.filter(o=>o!==t))}}addPit(t){this.addPitToParent(t,"arena")}addZone(t){this.addZoneToParent(t,"arena")}addPitToParent(t,n){let s;if(n==="arena")s=t;else{const d=this.zones.get(t);if(!d)return;s=d.parentArenaId}const r=this.arenas.get(s);if(!r)return;this.captureUndo();const o=`pit-${++this.pitSeq}`,a=Il(`Pit ${this.pitSeq}`,s,o);a.depth=Math.min(a.depth,r.depth),a.radiusX=Math.min(a.radiusX,r.radiusX*.4),a.radiusZ=Math.min(a.radiusZ,r.radiusZ*.4);const[c,l,h]=Ll(a,r,this.pits,this.zones);a.mesh=c,a.edges=l,a.seamMesh=h,this.addToScene(c,l,h),this.sceneObjects.set(o,[c,l,h]),this.pits.set(o,a),this.addChildToParent(o,"pit",t,n),this.sceneTree.add(o,a.name,"▼",t),this.updateArenaBowlHoles(r,s),this.updateArenaFloor(r),this.checkSiblingConflicts(t,n),this.saveArena()}addZoneToParent(t,n){let s;if(n==="arena")s=t;else{const u=this.zones.get(t);if(!u)return;s=u.parentArenaId}const r=this.arenas.get(s);if(!r)return;this.captureUndo();const o=`zone-${++this.zoneSeq}`,a=n==="zone"?t:null,c=Dl(`Zone ${this.zoneSeq}`,s,o,a);c.depth=Math.min(c.depth,Math.min(15,r.depth)),c.radiusX=Math.min(c.radiusX,r.radiusX*.3),c.radiusZ=Math.min(c.radiusZ,r.radiusZ*.3);const[l,h,d]=Bo(c,r,this.pits,this.zones);c.mesh=l,c.edges=h,c.seamMesh=d,this.addToScene(l,h,d),this.sceneObjects.set(o,[l,h,d]),this.zones.set(o,c),this.addChildToParent(o,"zone",t,n),this.sceneTree.add(o,c.name,"◈",t,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(o,"zone")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(o,"zone")}]}),this.updateArenaBowlHoles(r,s),this.updateArenaFloor(r),this.checkSiblingConflicts(t,n),this.saveArena()}saveArena(){localStorage.setItem(this.arenaStorageKey,this.serializeConfig())}restorePitSave(t,n,s,r){const o={id:t.id,name:t.name,parentArenaId:n,openingShape:t.openingShape,radiusX:t.radiusX,radiusZ:t.radiusZ,depth:t.depth,sides:t.sides,starInner:t.starInner,color:t.color,surface:t.surface,customTileData:t.customTileData,tileScale:t.tileScale,posR:t.posR,posAngle:t.posAngle,rotY:t.rotY,mesh:null,edges:null,seamMesh:null};this.pits.set(t.id,o),r.pitIds.push(t.id);const[a,c,l]=Ll(o,r,this.pits,this.zones);o.mesh=a,o.edges=c,o.seamMesh=l,this.addToScene(a,c,l),this.sceneObjects.set(t.id,[a,c,l]),this.sceneTree.add(t.id,o.name,"▼",s)}restoreZoneSave(t,n,s,r){const o={id:t.id,name:t.name,parentArenaId:n,parentZoneId:t.parentZoneId,openingShape:t.openingShape,radiusX:t.radiusX,radiusZ:t.radiusZ,depth:t.depth,sides:t.sides,starInner:t.starInner,color:t.color,surface:t.surface,customTileData:t.customTileData,tileScale:t.tileScale,fill:t.fill,fillColor:t.fillColor,fillOpacity:t.fillOpacity,posR:t.posR,posAngle:t.posAngle,rotY:t.rotY,isMoat:t.isMoat,innerRadiusX:t.innerRadiusX,innerRadiusZ:t.innerRadiusZ,innerOpeningShape:t.innerOpeningShape,innerSides:t.innerSides,innerStarInner:t.innerStarInner,innerWallProfile:t.innerWallProfile,innerRimOffset:t.innerRimOffset,pitIds:[],zoneIds:[],speedLineIds:[],mesh:null,edges:null,seamMesh:null};this.zones.set(t.id,o),r.zoneIds.push(t.id);const[a,c,l]=Bo(o,r,this.pits,this.zones);o.mesh=a,o.edges=c,o.seamMesh=l,this.addToScene(a,c,l),this.sceneObjects.set(t.id,[a,c,l]),this.sceneTree.add(t.id,o.name,"◈",s,{addChildButtons:[{label:"P+",title:"Add nested pit",className:"pit-btn",onClick:()=>this.addPitToParent(t.id,"zone")},{label:"Z+",title:"Add nested zone",className:"zone-btn",onClick:()=>this.addZoneToParent(t.id,"zone")}]});for(const h of t.pits)this.restorePitSave(h,n,t.id,r);for(const h of t.zones)this.restoreZoneSave(h,n,t.id,r)}_loadArenasFromConfig(t){for(const n of t.arenas){const s={name:n.name,openingShape:n.openingShape,wallProfile:n.wallProfile,radiusX:n.radiusX,radiusZ:n.radiusZ,depth:n.depth,sides:n.sides,starInner:n.starInner,color:n.color,surface:n.surface,customTileData:n.customTileData,tileScale:n.tileScale,baseMaterial:n.baseMaterial??Ch,posX:n.posX,posZ:n.posZ,posY:n.posY,rotY:n.rotY,isMoat:n.isMoat,innerRadiusX:n.innerRadiusX,innerRadiusZ:n.innerRadiusZ,innerOpeningShape:n.innerOpeningShape,innerSides:n.innerSides,innerStarInner:n.innerStarInner,innerWallProfile:n.innerWallProfile,innerRimOffset:n.innerRimOffset,stepApplyToAll:n.stepApplyToAll??!0,stepEdgeProfiles:n.stepEdgeProfiles??[],stepArcDivisions:n.stepArcDivisions??Oh,stepCount:n.stepCount??Lh,stepStartDepth:n.stepStartDepth??Ih,stepRiserProfile:n.stepRiserProfile??Dh,rampMode:n.rampMode??"full",rampAngle:n.rampAngle??Nh,rampWidth:n.rampWidth??Uh,spiralTurns:n.spiralTurns??Fh,spiralClockwise:n.spiralClockwise??!0,spiralCount:n.spiralCount??Bh,spiralLedgeWidth:n.spiralLedgeWidth??zh,spiralLedgeHeight:n.spiralLedgeHeight??kh,spiralRadiusFrac:n.spiralRadiusFrac??Hh,spiralMeshes:[],pitIds:[],zoneIds:[],wallIds:[],speedLineIds:[],mesh:null,edges:null,floorMesh:null,islandMesh:null,rimSeamMesh:null};this.arenas.set(n.id,s),this.sceneTree.add(n.id,s.name,"⏺","octagon-base",{addChildButtons:[{label:"P+",title:"Add pit",className:"pit-btn",onClick:()=>this.addPit(n.id)},{label:"Z+",title:"Add zone",className:"zone-btn",onClick:()=>this.addZone(n.id)},{label:"W+",title:"Add wall",className:"pit-btn",onClick:()=>this.addWall(n.id,"arena")},{label:"SL+",title:"Add speed line",className:"sl-btn",onClick:()=>this._addSpeedLine(n.id)}]});for(const h of n.pits)this.restorePitSave(h,n.id,n.id,s);for(const h of n.zones)this.restoreZoneSave(h,n.id,n.id,s);const r=this.getArenaHoles(s),[o,a]=Rl(s,r,this.getScene()??void 0);s.mesh=o,s.edges=a;const c=Cl(s,this.baseConfig.color,this.baseConfig.surface,this.baseConfig.customTileData,this.baseConfig.tileScale);s.rimSeamMesh=c,this.addToScene(o,a,c,...s.spiralMeshes??[]);const l=[o,a,c,...s.spiralMeshes??[]];if(s.isMoat){const h=Tl(s),d=ut({color:this.baseConfig.color,surface:this.baseConfig.surface,customTileData:this.baseConfig.customTileData,tileScale:this.baseConfig.tileScale});s.islandMesh=new Be(h,d),s.islandMesh.position.set(s.posX,s.posY,s.posZ),s.islandMesh.rotation.y=s.rotY,this.addToScene(s.islandMesh),l.push(s.islandMesh)}if(s.wallProfile==="straight"&&!s.isMoat&&s.posY<=oi){const h=s.pitIds.map(g=>this.pits.get(g)).filter(Boolean),d=s.zoneIds.map(g=>this.zones.get(g)).filter(Boolean),u=Al(s,h,d),m=ut({color:s.color,surface:s.surface,customTileData:s.customTileData,tileScale:s.tileScale});s.floorMesh=new Be(u,m),s.floorMesh.position.set(s.posX,s.posY,s.posZ),s.floorMesh.rotation.y=s.rotY,this.addToScene(s.floorMesh),l.push(s.floorMesh)}this.sceneObjects.set(n.id,l);for(const h of n.walls??[])this._restoreWallSave(h)}this.updateTopFace();for(const n of t.baseWalls??[])this._restoreWallSave(n);for(const n of t.bridges??[])this._restoreBridgeSave(n);for(const n of t.arenas)n.speedLines&&this._restoreSpeedLineSave(n.speedLines,n.id);if(t.speedLines)for(const n of t.speedLines)this.arenas.get(n.parentArenaId)&&this._restoreSpeedLineSave([n],n.parentArenaId);for(const n of this.arenas.keys())this._checkSpeedLineOverlaps(n)}_restoreWallSave(t){const n={id:t.id,name:t.name,parentId:t.parentId,parentType:t.parentType,fullPerimeter:t.fullPerimeter,arcStart:t.arcStart,arcEnd:t.arcEnd,basePosX:t.basePosX,basePosZ:t.basePosZ,baseRotY:t.baseRotY,baseLength:t.baseLength,height:t.height,tilt:t.tilt,hasGaps:t.hasGaps,gapWidth:t.gapWidth,panelWidth:t.panelWidth,topProfile:t.topProfile,topAmplitude:t.topAmplitude,topFrequency:t.topFrequency,isDouble:t.isDouble,peakHeight:t.peakHeight,peakTilt:t.peakTilt,holes:t.holes.map(r=>({...r})),color:t.color,surface:t.surface,material:t.material,mesh:null,edges:null};this.walls.set(t.id,n),this.applyWall(n);const s=t.parentType==="base"?"octagon-base":t.parentId;if(this.sceneTree.add(t.id,n.name,"🧱",s),t.parentType==="arena"){const r=this.arenas.get(t.parentId);r&&!r.wallIds.includes(t.id)&&r.wallIds.push(t.id)}}_restoreBridgeSave(t){var o;const n=new zt,s={id:t.id,name:t.name,startRef:t.startRef??null,segmentIds:[],section:{...t.section},color:t.color,surface:t.surface,wallIds:[],group:n};this.bridges.set(t.id,s);const r=this.getScene();r&&r.add(n),this.sceneTree.add(t.id,s.name,"🌉","octagon-base",{addChildButtons:[{label:"Seg+",title:"Add segment",className:"zone-btn",onClick:()=>this.addSegment(t.id,"straight")},{label:"W+",title:"Add wall",className:"pit-btn",onClick:()=>this.addWall(t.id,"bridge")}]}),((o=s.startRef)==null?void 0:o.type)==="arena"&&(this.bridgesByArena.has(s.startRef.id)||this.bridgesByArena.set(s.startRef.id,new Set),this.bridgesByArena.get(s.startRef.id).add(t.id));for(const a of t.segments){const c={id:a.id,name:a.name,bridgeId:t.id,orderIndex:a.orderIndex,type:a.type,length:a.length,rampAngle:a.rampAngle,curveRadius:a.curveRadius,curveAngle:a.curveAngle,curveDirection:a.curveDirection,bankAngle:a.bankAngle,cp1X:a.cp1X,cp1Y:a.cp1Y,cp1Z:a.cp1Z,cp2X:a.cp2X,cp2Y:a.cp2Y,cp2Z:a.cp2Z,endX:a.endX,endY:a.endY,endZ:a.endZ,loopRadius:a.loopRadius,corkscrewLength:a.corkscrewLength,corkscrewTurns:a.corkscrewTurns,color:a.color,surface:a.surface,mesh:null,edges:null};this.segments.set(a.id,c),s.segmentIds.push(a.id);const l=zl(c.type);this.sceneTree.add(a.id,c.name,l,t.id)}s.segmentIds.length>0&&this.applyBridgeFromSegment(s.segmentIds[0]);for(const a of t.walls)this._restoreWallSave(a)}loadArena(){try{const t=localStorage.getItem(this.arenaStorageKey);if(!t)return;const n=JSON.parse(t);this.baseConfig={...this.baseConfig,...n.baseConfig},this.rebuildBase(),this.arenaSeq=n.arenaSeq,this.pitSeq=n.pitSeq,this.zoneSeq=n.zoneSeq,this.wallSeq=n.wallSeq??0,this.bridgeSeq=n.bridgeSeq??0,this.segmentSeq=n.segmentSeq??0,this.speedlineSeq=n.speedLineSeq??0,this._loadArenasFromConfig(n)}catch{localStorage.removeItem(this.arenaStorageKey)}}setVisible(t){super.setVisible(t);const n=this.getRendererCanvas();t&&n?(n.addEventListener("pointerdown",this._onPointerDown),n.addEventListener("pointermove",this._onPointerMove),n.addEventListener("pointerup",this._onPointerUp)):!t&&n&&(n.removeEventListener("pointerdown",this._onPointerDown),n.removeEventListener("pointermove",this._onPointerMove),n.removeEventListener("pointerup",this._onPointerUp))}async resetArena(){if(await Er(`Reset arena?
All arenas, pits, zones, walls and bridges will be cleared.`,"Reset","Cancel")){this.captureUndo();for(const n of this.speedLines.values())this._disposeSpeedLine(n);this.speedLines.clear(),this.speedlineSeq=0,this.slSegSeq=0;for(const[n,s]of this.arenas.entries()){for(const r of s.pitIds){const o=this.pits.get(r);o&&(this.disposePit(o),this.removeFromScene(o.mesh,o.edges),o.seamMesh&&this.removeFromScene(o.seamMesh)),this.pits.delete(r),this.sceneObjects.delete(r)}for(const r of s.zoneIds){const o=this.zones.get(r);o&&(this.disposeZone(o),this.removeFromScene(o.mesh,o.edges),o.seamMesh&&this.removeFromScene(o.seamMesh)),this.zones.delete(r),this.sceneObjects.delete(r)}this.disposeArena(s),this.removeFromScene(s.mesh,s.edges),this.sceneObjects.delete(n),this.sceneTree.remove(n)}for(const n of this.walls.values())this._disposeWall(n);for(const n of this.bridges.values())this._disposeBridge(n);this.arenas.clear(),this.arenaSeq=0,this.pits.clear(),this.pitSeq=0,this.zones.clear(),this.zoneSeq=0,this.walls.clear(),this.wallSeq=0,this.bridges.clear(),this.bridgeSeq=0,this.segments.clear(),this.segmentSeq=0,this.bridgesByArena.clear(),this.baseConfig={height:xl,sides:Sl,color:Ml,surface:"plain",customTileData:null,tileScale:yl},this.rebuildBase(),this.updateTopFace(),this.selectedId=null,this.sceneTree.clearSel(),this.props.showEmpty(),localStorage.removeItem(this.arenaStorageKey),this._flushUndoPending()}}}function Ox(i,e,t){const n=i-t.posX,s=e-t.posZ,r=Math.cos(-t.rotY*Xe),o=Math.sin(-t.rotY*Xe);return{alx:n*r-s*o,alz:n*o+s*r}}function zl(i){switch(i){case"straight":return"━";case"curve":return"↩";case"ramp":return"↗";case"loop":return"⭕";case"hairpin":return"↺";case"corkscrew":return"🌀";case"chicane":return"⟨⟩";case"bezier":return"〜";default:return"━"}}class Fx{constructor(){W(this,"current","landing");W(this,"landing");W(this,"beyblade");W(this,"arena");const e=document.getElementById("app");this.landing=new vd(e,{onBeyblade:()=>this.go("beyblade"),onArena:()=>this.go("arena")}),this.beyblade=new uv(e,()=>{this.confirmLeave()}),this.arena=new Ux(e,{title:"Arena Sandbox",accentHex:16739125,onBack:()=>{this.confirmLeave()},gridSize:200,gridDivs:20,tickEvery:20,tickRange:100,defaultCam:{x:150,y:100,z:175},camFar:2e3,minZoom:5,maxZoom:1500,axisYOffset:0}),this.mountGlobalControls(e),window.addEventListener("popstate",n=>{var r;const s=((r=n.state)==null?void 0:r.screen)??this.pathToScreen();this.current!=="landing"&&s==="landing"?this.confirmPopLeave():this.show(s)});const t=this.pathToScreen();history.replaceState({screen:t},"",location.pathname),this.show(t)}go(e){const t=e==="landing"?"/":`/${e}`;history.pushState({screen:e},"",t),this.show(e)}show(e){this.current=e,this.landing.setVisible(e==="landing"),this.beyblade.setVisible(e==="beyblade"),this.arena.setVisible(e==="arena")}pathToScreen(){const e=location.pathname;return e==="/beyblade"?"beyblade":e==="/arena"?"arena":"landing"}async confirmLeave(){await Er(`Leave the sandbox?
Your view will be saved.`,"Leave","Stay")&&this.go("landing")}async confirmPopLeave(){await Er(`Leave the sandbox?
Your view will be saved.`,"Leave","Stay")?this.show("landing"):history.go(1)}mountGlobalControls(e){let t=1;const n=.1,s=.5,r=2,o=l=>{t=Math.min(r,Math.max(s,+l.toFixed(2))),document.documentElement.style.setProperty("--ui-scale",String(t))},a=document.createElement("div");a.className="global-controls",a.innerHTML=`
      <button class="ctrl-btn" id="scale-down"  title="Decrease UI size">−</button>
      <button class="ctrl-btn" id="scale-reset" title="Reset UI size">○</button>
      <button class="ctrl-btn" id="scale-up"    title="Increase UI size">+</button>
    `,e.appendChild(a),a.querySelector("#scale-down").addEventListener("click",()=>o(t-n)),a.querySelector("#scale-up").addEventListener("click",()=>o(t+n)),a.querySelector("#scale-reset").addEventListener("click",()=>o(1));const c=document.createElement("button");c.className="fs-btn",c.title="Toggle fullscreen",c.textContent="⛶",e.appendChild(c),c.addEventListener("click",()=>{document.fullscreenElement?document.exitFullscreen().catch(()=>{}):document.documentElement.requestFullscreen().catch(()=>{})}),document.addEventListener("fullscreenchange",()=>{c.title=document.fullscreenElement?"Exit fullscreen":"Enter fullscreen"}),window.addEventListener("keydown",l=>{(l.key==="f"||l.key==="F")&&c.click(),l.key==="="&&o(t+n),l.key==="-"&&o(t-n),l.key==="0"&&o(1)})}}new Fx;
