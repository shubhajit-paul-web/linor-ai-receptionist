var lt=Object.defineProperty,ct=Object.defineProperties;var dt=Object.getOwnPropertyDescriptors;var pe=Object.getOwnPropertySymbols;var ut=Object.prototype.hasOwnProperty,pt=Object.prototype.propertyIsEnumerable;var be=(B,O,$)=>O in B?lt(B,O,{enumerable:!0,configurable:!0,writable:!0,value:$}):B[O]=$,N=(B,O)=>{for(var $ in O||(O={}))ut.call(O,$)&&be(B,$,O[$]);if(pe)for(var $ of pe(O))pt.call(O,$)&&be(B,$,O[$]);return B},j=(B,O)=>ct(B,dt(O));(function(){"use strict";const B={botName:"Assistant",primaryColor:"#6366f1",welcomeMessage:"Hi! How can I help you today?",position:"bottom-right",offsetX:24,offsetY:24,zIndex:2147483647,buttonSize:56,windowWidth:380,windowHeight:580,hideAttribution:!1,avatarUrl:null,apiKey:null,apiUrl:null,sessionTtlHours:24,maxRetries:3,requestTimeoutMs:3e4,defaultSuggestions:["Book an appointment","Working hours","Services offered","Contact info"],enableVoice:!0,enableTTS:!0,ttsDefaultOn:!1,voiceLang:"en-US",enableSounds:!1,soundVolume:.18};function O(t){const r=t.replace("#",""),i=r.length===3?r.split("").map(n=>n+n).join(""):r,e=/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(i);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)].join(", "):"99, 102, 241"}function $(t){const r=typeof window!="undefined"&&window.__AI_WIDGET_CONFIG__?window.__AI_WIDGET_CONFIG__:{},i=typeof window!="undefined"&&window.LinorConfig?window.LinorConfig:{},e={};if(t){const a=A=>t.getAttribute(`data-${A}`),u=A=>{const w=parseInt(a(A),10);return isNaN(w)?void 0:w};a("api-key")&&(e.apiKey=a("api-key")),a("api-url")&&(e.apiUrl=a("api-url")),a("bot-name")&&(e.botName=a("bot-name")),a("primary-color")&&(e.primaryColor=a("primary-color")),a("welcome-message")&&(e.welcomeMessage=a("welcome-message")),a("position")&&(e.position=a("position")),a("avatar-url")&&(e.avatarUrl=a("avatar-url")),a("hide-attribution")&&(e.hideAttribution=a("hide-attribution")!=="false");const g=u("offset-x");g!==void 0&&(e.offsetX=g);const m=u("offset-y");m!==void 0&&(e.offsetY=m);const l=u("z-index");l!==void 0&&(e.zIndex=l);const c=u("button-size");c!==void 0&&(e.buttonSize=c);const b=u("window-width");b!==void 0&&(e.windowWidth=b);const p=u("window-height");p!==void 0&&(e.windowHeight=p);const v=u("session-ttl-hours");v!==void 0&&(e.sessionTtlHours=v);const x=u("max-retries");x!==void 0&&(e.maxRetries=x);const k=u("request-timeout-ms");k!==void 0&&(e.requestTimeoutMs=k);const _=a("default-suggestions");_!=null&&(e.defaultSuggestions=_.split("|").map(A=>A.trim()).filter(Boolean).slice(0,4)),a("enable-voice")!=null&&(e.enableVoice=a("enable-voice")!=="false"),a("enable-tts")!=null&&(e.enableTTS=a("enable-tts")!=="false"),a("tts-default-on")!=null&&(e.ttsDefaultOn=a("tts-default-on")!=="false"),a("enable-sounds")!=null&&(e.enableSounds=a("enable-sounds")!=="false"),a("voice-lang")&&(e.voiceLang=a("voice-lang"))}const n=N(N(N(N({},B),r),i),e);return["bottom-right","bottom-left","top-right","top-left"].includes(n.position)||(console.warn(`[AI Widget] Invalid position "${n.position}". Falling back to "bottom-right".`),n.position="bottom-right"),n.primaryRgb=O(n.primaryColor),n.apiKey||console.warn("[AI Widget] Missing api-key. Widget will be disabled. Set data-api-key on the script tag or window.LinorConfig.apiKey."),n.apiUrl||console.warn("[AI Widget] Missing api-url. Widget will be disabled. Set data-api-url on the script tag or window.LinorConfig.apiUrl."),n}function fe(t){let r=N({},t);const i=new Set;return{getState(){return r},setState(e){const n=r,s=typeof e=="function"?e(r):e;r=N(N({},r),s),i.forEach(a=>a(r,n))},subscribe(e){return i.add(e),()=>i.delete(e)}}}function ge(t,r=[],i={}){return N({isOpen:!1,messages:r,status:"idle",error:null,sessionId:t,unreadCount:0,voiceState:"idle",ttsEnabled:!1,interimTranscript:"",sttSupported:!1,ttsSupported:!1,online:!0},i)}const G={get(t){try{const r=localStorage.getItem(t);return r!==null?JSON.parse(r):null}catch(r){return null}},set(t,r){try{return localStorage.setItem(t,JSON.stringify(r)),!0}catch(i){return!1}},remove(t){try{localStorage.removeItem(t)}catch(r){}},isAvailable(){try{const t="__ai_widget_test__";return localStorage.setItem(t,"1"),localStorage.removeItem(t),!0}catch(t){return!1}}};function Q(){return`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function me(){return`sess_${Q()}`}function he(t,r){const i=`ai_widget_session_${t}`,e=r*60*60*1e3;function n(s){return Date.now()-s>e}return{load(){const s=G.get(i);return s?n(s.lastActive)?(G.remove(i),null):{sessionId:s.sessionId,messages:Array.isArray(s.messages)?s.messages:[]}:null},save(s,a){G.set(i,{sessionId:s,messages:a,lastActive:Date.now()})},clear(){G.remove(i)},createNew(){return me()}}}const xe=2500,ye=/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F000}-\u{1F2FF}*_`~#>]/gu;function ve(){return typeof window=="undefined"?null:window.SpeechRecognition||window.webkitSpeechRecognition||null}function we(){return typeof window!="undefined"&&"speechSynthesis"in window&&typeof window.SpeechSynthesisUtterance=="function"}function ke(t,r){if(!Array.isArray(t)||t.length===0)return null;const i=(r||"").split("-")[0].toLowerCase(),e=t.filter(s=>{const a=(s.lang||"").toLowerCase();return a===r.toLowerCase()||a.startsWith(i)});if(e.length===0)return t[0]||null;const n=s=>{let a=0;s.localService&&(a+=4);const u=(s.name||"").toLowerCase();return/natural|neural|premium|enhanced|online/.test(u)&&(a+=3),/google|microsoft|samantha|alex/.test(u)&&(a+=2),(s.lang||"").toLowerCase()===r.toLowerCase()&&(a+=1),a};return e.sort((s,a)=>n(a)-n(s))[0]}function _e({lang:t="en-US",onResult:r=()=>{},onError:i=()=>{},onStateChange:e=()=>{}}={}){const n=ve(),s=!!n,a=we();let u=null,g=!1,m=!1,l=null,c=null;function b(y){try{e(y)}catch(I){console.error("[AI Widget] voice onStateChange error",I)}}function p(){const y=new n;return y.lang=t,y.interimResults=!0,y.continuous=!1,y.maxAlternatives=1,y.onstart=()=>{g=!0,b("listening"),v()},y.onresult=I=>{var S;let o="",f="";for(let M=I.resultIndex;M<I.results.length;M++){const W=I.results[M],U=((S=W[0])==null?void 0:S.transcript)||"";W.isFinal?f+=U:o+=U}v(),f?r({text:f.trim(),isFinal:!0}):o&&r({text:o.trim(),isFinal:!1})},y.onerror=I=>{if(x(),g=!1,I.error==="aborted"||I.error==="no-speech"){b("idle");return}b("error");const o={"not-allowed":"Microphone access was denied.","service-not-allowed":"Speech service is unavailable.","audio-capture":"No microphone found.",network:"Network issue — voice input needs a connection."}[I.error]||`Voice input failed (${I.error||"unknown"}).`;try{i(new Error(o))}catch(f){}setTimeout(()=>b("idle"),50)},y.onend=()=>{x(),g=!1,b("idle")},y}function v(){x(),l=setTimeout(()=>{if(g&&u)try{u.stop()}catch(y){}},xe)}function x(){l&&(clearTimeout(l),l=null)}function k(){if(!s)return i(new Error("Voice input is not supported in this browser.")),!1;if(g)return!0;E();try{return u=p(),u.start(),!0}catch(y){return b("error"),i(y instanceof Error?y:new Error("Could not start voice input.")),setTimeout(()=>b("idle"),50),!1}}function _(){if(x(),u&&g)try{u.stop()}catch(y){}}function A(){if(!a)return null;if(c)return c;const y=window.speechSynthesis.getVoices()||[];return c=ke(y,t),c}a&&"onvoiceschanged"in window.speechSynthesis&&window.speechSynthesis.addEventListener("voiceschanged",()=>{c=null,A()});function w(y){if(!a||m||!y)return;const I=String(y).replace(ye,"").trim();if(!I)return;E();const o=new window.SpeechSynthesisUtterance(I);o.lang=t,o.rate=1.02,o.pitch=1,o.volume=1;const f=A();f&&(o.voice=f),o.onstart=()=>b("speaking"),o.onend=()=>{b("idle")},o.onerror=()=>{b("idle")};try{window.speechSynthesis.speak(o)}catch(S){b("idle")}}function E(){if(a)try{window.speechSynthesis.cancel()}catch(y){}}function T(y){m=!!y,m&&E()}function z(){return m}function D(){_(),E(),u=null}return{sttSupported:s,ttsSupported:a,startListening:k,stopListening:_,speak:w,cancelSpeaking:E,setMuted:T,isMuted:z,isListening:()=>g,destroy:D}}function Se({enabled:t=!1,volume:r=.18}={}){let i=null,e=!t,n=!1;function s(){if(i||e)return i;const c=typeof window!="undefined"?window.AudioContext||window.webkitAudioContext:null;if(!c)return null;try{i=new c,n=!0}catch(b){i=null}return i}function a(c,b,p,v){const x=i.currentTime;c.gain.setValueAtTime(0,x),c.gain.linearRampToValueAtTime(b,x+p),c.gain.exponentialRampToValueAtTime(1e-4,x+p+v)}function u({freq:c,type:b="sine",duration:p=.12,peak:v=r,glideTo:x=null}){if(s())try{const k=i.createOscillator(),_=i.createGain();k.type=b,k.frequency.setValueAtTime(c,i.currentTime),typeof x=="number"&&k.frequency.exponentialRampToValueAtTime(x,i.currentTime+p),a(_,v,.01,p),k.connect(_).connect(i.destination),k.start(),k.stop(i.currentTime+p+.05)}catch(k){}}function g(c){if(!e&&s())switch(i.state==="suspended"&&i.resume().catch(()=>{}),c){case"send":u({freq:620,glideTo:880,duration:.13,peak:r*.8});break;case"receive":u({freq:880,type:"sine",duration:.08,peak:r*.7}),setTimeout(()=>u({freq:1174,type:"sine",duration:.12,peak:r*.85}),70);break;case"error":u({freq:240,glideTo:140,type:"triangle",duration:.22,peak:r*.9});break}}function m(c){e=!!c}function l(){if(i&&n)try{i.close()}catch(c){}i=null}return{play:g,setMuted:m,isMuted:()=>e,destroy:l}}function Ae(){const t=new Set,r=typeof window!="undefined",i=()=>r&&typeof navigator!="undefined"?navigator.onLine!==!1:!0;let e=i();function n(){const s=i();s!==e&&(e=s,t.forEach(a=>{try{a(e)}catch(u){console.error("[AI Widget] network listener error",u)}}))}return r&&(window.addEventListener("online",n),window.addEventListener("offline",n)),{isOnline:()=>e,subscribe(s){t.add(s);try{s(e)}catch(a){}return()=>t.delete(s)},destroy(){r&&(window.removeEventListener("online",n),window.removeEventListener("offline",n)),t.clear()}}}class Z extends Error{constructor(r){super(r),this.name="NetworkError"}}class ee extends Error{constructor(r){super(`Request timed out after ${r}ms`),this.name="TimeoutError"}}class Y extends Error{constructor(r,i){super(r),this.name="ApiError",this.status=i}}async function Ee(t,r,i){const e=new AbortController,n=setTimeout(()=>e.abort(),i);try{return await fetch(t,j(N({},r),{signal:e.signal}))}catch(s){throw s.name==="AbortError"?new ee(i):new Z(s.message||"Network request failed")}finally{clearTimeout(n)}}async function Ce(t,r=3,i=600){let e;for(let n=0;n<=r;n++)try{return await t()}catch(s){if(e=s,s instanceof Y&&s.status>=400&&s.status<500)throw s;if(n<r){const a=i*Math.pow(2,n),u=Math.random()*200;await new Promise(g=>setTimeout(g,a+u))}}throw e}function Te(t){return t instanceof ee?{message:"The request took too long. Please try again.",retryable:!0}:t instanceof Z?{message:"No internet connection. Please check your network.",retryable:!0}:t instanceof Y?t.status===401||t.status===403?{message:"Authentication failed. Please check your API key.",retryable:!1}:t.status>=500?{message:"Server error. We're working on it — please try again.",retryable:!0}:{message:"Something went wrong. Please try again.",retryable:!0}:{message:"An unexpected error occurred. Please try again.",retryable:!0}}async function Le(t,r){const{apiKey:i,apiUrl:e,sessionId:n,maxRetries:s,requestTimeoutMs:a}=r;return Ce(async()=>{var p,v,x,k;const g=t[t.length-1],m=t.slice(0,-1).map(({role:_,content:A})=>({role:_,content:A})),l=await Ee(e,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":i,Authorization:`Bearer ${i}`,"X-Widget-Session":n||"","X-Widget-Version":"1.0.0"},body:JSON.stringify({message:g.content,sessionId:n,history:m})},a);if(!l.ok){let _="";try{const A=await l.json();_=A.error||A.message||JSON.stringify(A)}catch(A){_=await l.text().catch(()=>`HTTP ${l.status}`)}throw new Y(_||`HTTP ${l.status}`,l.status)}let c;try{c=await l.json()}catch(_){throw new Y("Invalid JSON in API response",200)}const b=(k=(x=(v=(p=c.reply)!=null?p:c.message)!=null?v:c.content)!=null?x:c.text)!=null?k:c.answer;if(typeof b!="string"||b.trim()==="")throw new Y("Unrecognised response format from API",200);return{reply:b.trim(),suggestions:Ie(c.suggestions)}},s)}function Ie(t){if(!Array.isArray(t))return[];const r=new Set,i=[];for(const e of t){if(typeof e!="string")continue;const n=e.trim();if(!n)continue;const s=n.length>60?n.slice(0,60).trim():n,a=s.toLowerCase();if(!r.has(a)&&(r.add(a),i.push(s),i.length>=4))break}return i}function Ne(){const t=new Map;return{on(r,i){return t.has(r)||t.set(r,new Set),t.get(r).add(i),()=>this.off(r,i)},off(r,i){var e;(e=t.get(r))==null||e.delete(i)},emit(r,i){var e;(e=t.get(r))==null||e.forEach(n=>{try{n(i)}catch(s){console.error(`[AI Widget] EventBus error in handler for "${r}":`,s)}})},clear(){t.clear()}}}const ze=["button:not([disabled])","textarea:not([disabled])","input:not([disabled])","a[href]",'[tabindex]:not([tabindex="-1"])'].join(", ");function te(t){return Array.from(t.querySelectorAll(ze)).filter(r=>!r.closest("[hidden]")&&r.offsetParent!==null)}function Oe(t){let r=!1;function i(e){if(!r||e.key!=="Tab")return;const n=te(t);if(n.length===0){e.preventDefault();return}const s=n[0],a=n[n.length-1],u=e.target;e.shiftKey?u===s&&(e.preventDefault(),a.focus()):u===a&&(e.preventDefault(),s.focus())}return{activate(e){r=!0,t.addEventListener("keydown",i);const n=e||te(t)[0];n&&requestAnimationFrame(()=>n.focus())},deactivate(e){r=!1,t.removeEventListener("keydown",i),e&&requestAnimationFrame(()=>e.focus())}}}function Me(t,r){t.textContent="",requestAnimationFrame(()=>{requestAnimationFrame(()=>{t.textContent=r})})}function $e(t){return`
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      /* === Brand === */
      --primary:          ${t.primaryColor};
      --primary-rgb:      ${t.primaryRgb};
      --primary-light:    rgba(${t.primaryRgb}, 0.12);
      --primary-hover:    rgba(${t.primaryRgb}, 0.88);

      /* === Surface === */
      --surface:          #ffffff;
      --surface-alt:      #f7f8fa;
      --surface-raised:   #ffffff;
      --border:           #e5e7eb;
      --border-light:     #f3f4f6;

      /* === Text === */
      --text-primary:     #111827;
      --text-secondary:   #6b7280;
      --text-tertiary:    #9ca3af;
      --text-inverse:     #ffffff;

      /* === Semantic === */
      --error:            #ef4444;
      --error-rgb:        239, 68, 68;
      --error-bg:         #fef2f2;
      --success:          #10b981;
      --warning:          #f59e0b;

      /* === Shadows === */
      --shadow-sm:        0 1px 2px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.1);
      --shadow-md:        0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
      --shadow-lg:        0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
      --shadow-xl:        0 20px 40px -8px rgba(0,0,0,0.18), 0 8px 16px -4px rgba(0,0,0,0.08);

      /* === Radius === */
      --radius-xs:        4px;
      --radius-sm:        6px;
      --radius-md:        12px;
      --radius-lg:        16px;
      --radius-xl:        20px;
      --radius-full:      9999px;

      /* === Typography === */
      --font:             -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                          'Helvetica Neue', Arial, sans-serif;
      --font-size-2xs:    10px;
      --font-size-xs:     11px;
      --font-size-sm:     13px;
      --font-size-md:     14px;
      --font-size-lg:     15px;
      --font-size-xl:     18px;

      /* === Motion === */
      --transition-fast:  0.15s ease;
      --transition-base:  0.2s ease;
      --transition-spring: 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      /* === Z-index === */
      --z-widget:         ${t.zIndex};

      /* === Layout === */
      font-family:        var(--font);
      font-size:          var(--font-size-md);
      line-height:        1.5;
      color:              var(--text-primary);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* Screen-reader only utility */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border-width: 0;
    }
  `}function Re(t){const r=t.position||"bottom-right",i=r.includes("left"),e=r.includes("top"),n=typeof t.offsetX=="number"?t.offsetX:24,s=typeof t.offsetY=="number"?t.offsetY:24,a=typeof t.buttonSize=="number"?t.buttonSize:56,u=typeof t.windowWidth=="number"?t.windowWidth:380,g=typeof t.windowHeight=="number"?t.windowHeight:580,m=12,l=s+a+m,c=i?"left":"right",b=e?"top":"bottom",p=e?"-14px":"14px",v=`${e?"top":"bottom"} ${i?"left":"right"}`,x=Math.max(a-4,44);return`
    /* ===================================================
       LAUNCHER BUTTON
    =================================================== */

    .launcher {
      position: fixed;
      ${b}: ${s}px;
      ${c}: ${n}px;
      z-index: var(--z-widget);
      width: ${a}px;
      height: ${a}px;
      border-radius: var(--radius-full);
      background: linear-gradient(135deg,
        var(--primary) 0%,
        rgba(var(--primary-rgb), 0.82) 100%);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
      box-shadow: 0 4px 16px rgba(var(--primary-rgb), 0.45),
                  0 2px 6px rgba(0,0,0,0.12);
      transition: transform var(--transition-spring),
                  box-shadow var(--transition-base),
                  background var(--transition-base);
      outline: none;
      pointer-events: all;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
      /* Gentle entrance — the button scales in from 0 on mount */
      animation: launcherIn 520ms cubic-bezier(0.22, 1.2, 0.36, 1) both,
                 launcherAttention 3.2s ease-in-out 1.2s 2;
    }

    @keyframes launcherIn {
      from { opacity: 0; transform: scale(0.2); }
      to   { opacity: 1; transform: scale(1);   }
    }

    /* Gentle two-pulse attention — plays twice after mount, then stops */
    @keyframes launcherAttention {
      0%, 100% { box-shadow: 0 4px 16px rgba(var(--primary-rgb), 0.45),
                             0 2px 6px rgba(0,0,0,0.12),
                             0 0 0 0 rgba(var(--primary-rgb), 0.35); }
      50%       { box-shadow: 0 4px 16px rgba(var(--primary-rgb), 0.45),
                              0 2px 6px rgba(0,0,0,0.12),
                              0 0 0 12px rgba(var(--primary-rgb), 0); }
    }

    .launcher:hover {
      transform: scale(1.07);
      box-shadow: 0 6px 22px rgba(var(--primary-rgb), 0.55),
                  0 3px 8px rgba(0,0,0,0.15);
    }

    .launcher:active {
      transform: scale(0.94);
    }

    .launcher:focus-visible {
      box-shadow: 0 0 0 3px var(--surface),
                  0 0 0 5px var(--primary);
    }

    /* Icon swap animation */
    .launcher__icon {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s ease, transform 0.25s ease;
      will-change: transform, opacity;
    }

    .launcher__icon--chat {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    .launcher__icon--close {
      opacity: 0;
      transform: scale(0.4) rotate(-90deg);
    }

    .launcher.is-open .launcher__icon--chat {
      opacity: 0;
      transform: scale(0.4) rotate(90deg);
    }

    .launcher.is-open .launcher__icon--close {
      opacity: 1;
      transform: scale(1) rotate(0deg);
    }

    /* Unread badge */
    .launcher__badge {
      position: absolute;
      top: -3px;
      right: -3px;
      min-width: 20px;
      height: 20px;
      border-radius: var(--radius-full);
      background: var(--error);
      color: var(--text-inverse);
      font-size: var(--font-size-xs);
      font-weight: 700;
      font-family: var(--font);
      line-height: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 5px;
      border: 2px solid var(--surface);
      transform: scale(1);
      transition: transform var(--transition-spring), opacity var(--transition-base);
      pointer-events: none;
    }

    .launcher__badge[hidden] {
      transform: scale(0);
      opacity: 0;
      display: flex; /* override hidden so we can animate out */
    }

    /* ===================================================
       CHAT WINDOW
    =================================================== */

    .widget-window {
      position: fixed;
      ${b}: ${l}px;
      ${c}: ${n}px;
      z-index: var(--z-widget);
      width: ${u}px;
      height: ${g}px;
      max-height: calc(100dvh - ${l+16}px);
      background: var(--surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      pointer-events: none;
      /* Animation start state */
      opacity: 0;
      transform: scale(0.93) translateY(${p});
      transform-origin: ${v};
      transition: opacity 0.2s ease,
                  transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: transform, opacity;
    }

    .widget-window.is-open {
      opacity: 1;
      transform: scale(1) translateY(0);
      pointer-events: all;
    }

    /* ===================================================
       RESPONSIVE — mobile
    =================================================== */

    @media (max-width: 480px) {
      .widget-window {
        width: calc(100vw - 16px);
        height: calc(100dvh - ${x+s+m+16}px);
        max-height: calc(100dvh - ${x+s+m+16}px);
        ${b}: ${x+s+m}px;
        ${c}: 8px;
        ${i?"right: 8px;":"left: 8px;"}
        border-radius: var(--radius-lg) var(--radius-lg) var(--radius-md) var(--radius-md);
        transform-origin: ${e?"top":"bottom"} center;
      }

      .launcher {
        ${b}: ${Math.max(s-10,8)}px;
        ${c}: ${Math.max(n-10,8)}px;
        width: ${x}px;
        height: ${x}px;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .launcher { animation: launcherIn 280ms ease both !important; }
      .widget-window {
        transition: opacity 150ms ease !important;
        transform: none !important;
      }
    }
  `}function Be(){return`
    /* ===================================================
       HEADER
    =================================================== */

    .header {
      display: flex;
      align-items: center;
      gap: 11px;
      padding: 13px 16px;
      border-bottom: 1px solid var(--border);
      background: var(--surface);
      flex-shrink: 0;
    }

    .header__avatar {
      position: relative;
      flex-shrink: 0;
    }

    .header__avatar-img {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-full);
      object-fit: cover;
      display: block;
    }

    .header__avatar-fallback {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-full);
      background: var(--primary);
      color: var(--text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--font-size-md);
      font-weight: 700;
      letter-spacing: -0.3px;
      flex-shrink: 0;
    }

    .header__status-dot {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 10px;
      height: 10px;
      border-radius: var(--radius-full);
      background: var(--success);
      border: 2px solid var(--surface);
    }

    .header__info {
      flex: 1;
      min-width: 0;
    }

    .header__name {
      font-size: var(--font-size-lg);
      font-weight: 600;
      color: var(--text-primary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      line-height: 1.3;
    }

    .header__subtitle {
      font-size: var(--font-size-xs);
      color: var(--success);
      font-weight: 500;
      margin-top: 2px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .header__actions {
      display: flex;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
    }

    .header__btn {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-secondary);
      transition: background var(--transition-fast), color var(--transition-fast);
      padding: 0;
    }

    .header__btn:hover {
      background: var(--surface-alt);
      color: var(--text-primary);
    }

    .header__btn:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 1px;
    }

    /* ===================================================
       MESSAGES AREA
    =================================================== */

    .messages-area {
      flex: 1;
      overflow-y: auto;
      overflow-x: hidden;
      padding: 12px 14px 16px;
      display: flex;
      flex-direction: column;
      gap: 2px;
      background: var(--surface-alt);
      scroll-behavior: smooth;
      overscroll-behavior: contain;
    }

    .messages-area::-webkit-scrollbar {
      width: 4px;
    }

    .messages-area::-webkit-scrollbar-track {
      background: transparent;
    }

    .messages-area::-webkit-scrollbar-thumb {
      background: rgba(0,0,0,0.12);
      border-radius: 2px;
    }

    .messages-area::-webkit-scrollbar-thumb:hover {
      background: rgba(0,0,0,0.22);
    }

    /* Welcome / empty state */
    .messages-welcome {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 20px 12px 12px;
      gap: 8px;
    }

    .messages-welcome__avatar {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-full);
      background: var(--primary-light);
      border: 2px solid rgba(var(--primary-rgb), 0.2);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 700;
      color: var(--primary);
      margin-bottom: 4px;
    }

    .messages-welcome__text {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.6;
      max-width: 260px;
    }

    /* Date / time separator between message groups */
    .date-separator {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 10px 0 4px;
      padding: 0 2px;
    }

    .date-separator__line {
      flex: 1;
      height: 1px;
      background: var(--border);
    }

    .date-separator__text {
      font-size: var(--font-size-2xs);
      color: var(--text-tertiary);
      font-weight: 500;
      white-space: nowrap;
      letter-spacing: 0.3px;
    }

    /* ===================================================
       MESSAGE BUBBLE
    =================================================== */

    .bubble-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 7px;
      max-width: 86%;
      margin-top: 2px;
    }

    .bubble-wrapper--user {
      margin-left: auto;
      flex-direction: row-reverse;
    }

    .bubble-wrapper--assistant {
      margin-right: auto;
    }

    /* Small bot avatar beside each assistant message */
    .bubble-avatar {
      width: 26px;
      height: 26px;
      border-radius: var(--radius-full);
      background: var(--primary);
      color: var(--text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 10px;
      font-weight: 700;
      flex-shrink: 0;
      margin-bottom: 2px;
      overflow: hidden;
    }

    .bubble-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .bubble-avatar--hidden {
      visibility: hidden;
    }

    .bubble-content {
      display: flex;
      flex-direction: column;
    }

    .bubble {
      padding: 9px 13px;
      border-radius: var(--radius-md);
      font-size: var(--font-size-md);
      line-height: 1.55;
      word-break: break-word;
      overflow-wrap: break-word;
      transition: opacity var(--transition-base);
    }

    .bubble--user {
      background: var(--primary);
      color: var(--text-inverse);
      border-radius: var(--radius-md) var(--radius-md) var(--radius-sm) var(--radius-md);
    }

    .bubble--assistant {
      background: var(--surface);
      color: var(--text-primary);
      border: 1px solid var(--border);
      border-radius: var(--radius-md) var(--radius-md) var(--radius-md) var(--radius-sm);
    }

    /* Failed message state */
    .bubble--failed {
      background: var(--error-bg);
      border: 1.5px solid rgba(var(--error-rgb), 0.35);
      color: var(--text-primary);
      opacity: 0.9;
    }

    .bubble-retry-row {
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 5px;
    }

    /* Critical: the 'hidden' attribute must actually hide the row —
       otherwise "Failed to send" bleeds into every successful message. */
    .bubble-retry-row[hidden] {
      display: none !important;
    }

    .bubble-retry-row__text {
      font-size: var(--font-size-xs);
      color: var(--error);
    }

    .bubble-retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      background: none;
      border: none;
      padding: 2px 6px;
      font-size: var(--font-size-xs);
      font-family: var(--font);
      font-weight: 600;
      color: var(--error);
      cursor: pointer;
      border-radius: var(--radius-xs);
      transition: background var(--transition-fast);
    }

    .bubble-retry-btn:hover {
      background: rgba(var(--error-rgb), 0.1);
    }

    .bubble-retry-btn:focus-visible {
      outline: 2px solid var(--error);
      outline-offset: 1px;
    }

    /* Timestamp below each bubble */
    .bubble-meta {
      font-size: var(--font-size-2xs);
      color: var(--text-tertiary);
      margin-top: 3px;
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .bubble-meta--user {
      justify-content: flex-end;
    }

    .bubble-meta--assistant {
      justify-content: flex-start;
      padding-left: 1px;
    }

    /* Sending state: subtle pulse on user message */
    .bubble--sending {
      opacity: 0.7;
    }

    /* ===================================================
       SUGGESTION CHIPS
    =================================================== */

    /* Row container — horizontal, wraps on very narrow screens */
    .suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 8px;
    }

    .suggestions[hidden] {
      display: none;
    }

    /* Welcome-state chips: centered so they sit nicely under the greeting */
    .messages-welcome .suggestions {
      justify-content: center;
      margin-top: 12px;
    }

    .suggestion-chip {
      display: inline-flex;
      align-items: center;
      height: 30px;
      padding: 0 12px;
      background: var(--surface);
      border: 1.5px solid rgba(var(--primary-rgb), 0.35);
      border-radius: 100px;           /* pill */
      font-size: var(--font-size-xs);
      font-family: var(--font);
      font-weight: 500;
      color: var(--primary);
      cursor: pointer;
      white-space: nowrap;
      line-height: 1;
      user-select: none;
      -webkit-user-select: none;
      transition:
        background var(--transition-fast),
        border-color var(--transition-fast),
        color var(--transition-fast),
        transform 80ms ease,
        box-shadow var(--transition-fast),
        opacity var(--transition-fast);
      /* Entrance: fade + slight vertical drift */
      animation: chipIn 220ms ease both;
    }

    @keyframes chipIn {
      from { opacity: 0; transform: translateY(4px); }
      to   { opacity: 1; transform: translateY(0);   }
    }

    /* Stagger entrance for each chip */
    .suggestion-chip:nth-child(1) { animation-delay: 0ms;   }
    .suggestion-chip:nth-child(2) { animation-delay: 50ms;  }
    .suggestion-chip:nth-child(3) { animation-delay: 100ms; }
    .suggestion-chip:nth-child(4) { animation-delay: 150ms; }

    .suggestion-chip:hover {
      background: rgba(var(--primary-rgb), 0.08);
      border-color: var(--primary);
      box-shadow: 0 1px 4px rgba(var(--primary-rgb), 0.18);
    }

    .suggestion-chip:active {
      transform: scale(0.95);
      background: rgba(var(--primary-rgb), 0.14);
      box-shadow: none;
    }

    .suggestion-chip:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    .suggestion-chip:disabled,
    .suggestions--disabled .suggestion-chip {
      opacity: 0.45;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ===================================================
       TYPING INDICATOR
    =================================================== */

    .typing-indicator {
      display: flex;
      align-items: flex-end;
      gap: 7px;
      margin-top: 4px;
      margin-right: auto;
    }

    .typing-indicator[hidden] {
      display: none;
    }

    .typing-bubble {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius-md) var(--radius-md) var(--radius-md) var(--radius-sm);
      padding: 10px 14px;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    /* Dots wrapper (class renamed from typing-bubble to typing-dots) */
    .typing-dots {
      display: flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }

    .typing-dot {
      width: 6px;
      height: 6px;
      border-radius: var(--radius-full);
      background: var(--text-tertiary);
      animation: typingBounce 1.3s infinite ease-in-out both;
    }

    .typing-dot:nth-child(1) { animation-delay: 0ms;   }
    .typing-dot:nth-child(2) { animation-delay: 160ms; }
    .typing-dot:nth-child(3) { animation-delay: 320ms; }

    @keyframes typingBounce {
      0%, 60%, 100% { transform: translateY(0);   opacity: 0.4; }
      30%            { transform: translateY(-5px); opacity: 1;   }
    }

    /* Progress stage label — fades in when text is set */
    .typing-label {
      font-size: var(--font-size-xs);
      color: var(--text-tertiary);
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      max-width: 0;
      overflow: hidden;
      transition:
        opacity 350ms ease,
        max-width 350ms ease;
    }

    .typing-label--visible {
      opacity: 1;
      max-width: 120px; /* generous cap; actual text is short */
    }

    /* ===================================================
       ERROR BANNER
    =================================================== */

    .error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      background: var(--error-bg);
      border-top: 1px solid rgba(var(--error-rgb), 0.2);
      border-bottom: 1px solid rgba(var(--error-rgb), 0.2);
      font-size: var(--font-size-sm);
      color: #991b1b;
      flex-shrink: 0;
    }

    .error-banner[hidden] {
      display: none;
    }

    .error-banner__icon {
      color: var(--error);
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    .error-banner__text {
      flex: 1;
      line-height: 1.4;
    }

    .error-banner__retry {
      flex-shrink: 0;
      background: none;
      border: 1px solid rgba(var(--error-rgb), 0.4);
      border-radius: var(--radius-xs);
      padding: 3px 10px;
      font-size: var(--font-size-xs);
      font-family: var(--font);
      font-weight: 600;
      color: var(--error);
      cursor: pointer;
      white-space: nowrap;
      transition: background var(--transition-fast);
    }

    .error-banner__retry:hover {
      background: rgba(var(--error-rgb), 0.1);
    }

    .error-banner__retry:focus-visible {
      outline: 2px solid var(--error);
      outline-offset: 1px;
    }

    .error-banner__dismiss {
      flex-shrink: 0;
      background: none;
      border: none;
      padding: 2px;
      cursor: pointer;
      color: rgba(var(--error-rgb), 0.7);
      display: flex;
      align-items: center;
      border-radius: var(--radius-xs);
      transition: color var(--transition-fast);
    }

    .error-banner__dismiss:hover {
      color: var(--error);
    }

    .error-banner__dismiss:focus-visible {
      outline: 2px solid var(--error);
      outline-offset: 1px;
    }

    /* ===================================================
       BUBBLE ENTRANCE ANIMATION
    =================================================== */

    .bubble-wrapper {
      animation: bubbleIn 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    @keyframes bubbleIn {
      from {
        opacity: 0;
        transform: translateY(8px) scale(0.985);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .bubble-wrapper--user .bubble {
      background: linear-gradient(135deg,
        var(--primary) 0%,
        rgba(var(--primary-rgb), 0.88) 100%);
      box-shadow: 0 1px 2px rgba(var(--primary-rgb), 0.3),
                  0 4px 12px rgba(var(--primary-rgb), 0.18);
    }

    /* ===================================================
       READ RECEIPTS (inline with timestamp)
    =================================================== */

    .bubble-meta__status {
      display: inline-flex;
      align-items: center;
      color: var(--text-tertiary);
      transition: color var(--transition-base);
    }

    .bubble-meta__status--sent {
      color: var(--text-tertiary);
    }

    .bubble-meta__status--delivered {
      color: var(--primary);
    }

    .bubble-meta__status[hidden] { display: none !important; }

    /* ===================================================
       HEADER — refined avatar + extra actions
    =================================================== */

    .header {
      background: linear-gradient(180deg,
        var(--surface) 0%,
        rgba(var(--primary-rgb), 0.015) 100%);
    }

    .header__avatar-fallback {
      background: linear-gradient(135deg,
        var(--primary) 0%,
        rgba(var(--primary-rgb), 0.78) 100%);
      box-shadow: 0 2px 6px rgba(var(--primary-rgb), 0.28);
    }

    .header__status-dot {
      animation: statusPulse 2.4s ease-in-out infinite;
    }

    @keyframes statusPulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.45); }
      50%       { box-shadow: 0 0 0 5px rgba(16, 185, 129, 0); }
    }

    .header__btn[aria-pressed="true"] {
      background: rgba(var(--primary-rgb), 0.12);
      color: var(--primary);
    }

    /* ===================================================
       WELCOME CARD — richer starter screen
    =================================================== */

    .messages-welcome {
      padding: 28px 16px 16px;
      gap: 10px;
    }

    .messages-welcome__avatar {
      background: linear-gradient(135deg,
        rgba(var(--primary-rgb), 0.14) 0%,
        rgba(var(--primary-rgb), 0.28) 100%);
      border-color: rgba(var(--primary-rgb), 0.28);
      box-shadow: 0 4px 14px rgba(var(--primary-rgb), 0.18);
      animation: welcomeAvatarIn 420ms cubic-bezier(0.22, 1.2, 0.36, 1) both;
    }

    @keyframes welcomeAvatarIn {
      from { opacity: 0; transform: scale(0.6); }
      to   { opacity: 1; transform: scale(1);   }
    }

    .messages-welcome__title {
      font-size: var(--font-size-xl);
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: -0.3px;
      margin-top: 2px;
    }

    .messages-welcome__text {
      font-size: var(--font-size-sm);
      color: var(--text-secondary);
      line-height: 1.55;
      max-width: 280px;
    }

    .messages-welcome__hint {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 3px 10px;
      margin-top: 4px;
      font-size: var(--font-size-2xs);
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      color: var(--primary);
      background: rgba(var(--primary-rgb), 0.1);
      border-radius: var(--radius-full);
    }

    .messages-welcome__hint svg { flex-shrink: 0; }

    /* ===================================================
       SCROLL-TO-BOTTOM FLOATING PILL
    =================================================== */

    .scroll-to-bottom {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%) translateY(8px);
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 5px 12px 5px 10px;
      background: var(--surface);
      color: var(--text-primary);
      border: 1px solid var(--border);
      border-radius: var(--radius-full);
      font-size: var(--font-size-xs);
      font-family: var(--font);
      font-weight: 600;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
      cursor: pointer;
      opacity: 0;
      pointer-events: none;
      transition: opacity 180ms ease, transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 3;
    }

    .scroll-to-bottom.is-visible {
      opacity: 1;
      pointer-events: all;
      transform: translateX(-50%) translateY(0);
    }

    .scroll-to-bottom:hover {
      box-shadow: 0 6px 18px rgba(0, 0, 0, 0.16);
      border-color: rgba(var(--primary-rgb), 0.3);
      color: var(--primary);
    }

    .scroll-to-bottom__count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      background: var(--primary);
      color: var(--text-inverse);
      border-radius: var(--radius-full);
      font-size: 9px;
      font-weight: 700;
    }

    .scroll-to-bottom__count[hidden] { display: none !important; }

    /* Messages area needs to be positioning context for the pill */
    .messages-area {
      position: relative;
    }

    /* ===================================================
       OFFLINE BANNER
    =================================================== */

    .offline-banner {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 7px 14px;
      background: #fef3c7;
      color: #92400e;
      border-bottom: 1px solid rgba(245, 158, 11, 0.3);
      font-size: var(--font-size-xs);
      font-weight: 600;
      flex-shrink: 0;
      animation: bannerSlideIn 240ms ease both;
    }

    .offline-banner[hidden] { display: none !important; }

    @keyframes bannerSlideIn {
      from { opacity: 0; transform: translateY(-100%); }
      to   { opacity: 1; transform: translateY(0);    }
    }

    /* ===================================================
       TYPING INDICATOR — enhanced
    =================================================== */

    .typing-bubble {
      background: linear-gradient(135deg,
        var(--surface) 0%,
        var(--surface-alt) 100%);
      animation: bubbleIn 320ms cubic-bezier(0.22, 1, 0.36, 1) both;
    }

    .typing-dot {
      background: linear-gradient(135deg,
        var(--primary) 0%,
        rgba(var(--primary-rgb), 0.7) 100%);
    }

    .typing-label--visible {
      color: var(--primary);
    }

    /* ===================================================
       RESPECT REDUCED MOTION
    =================================================== */

    @media (prefers-reduced-motion: reduce) {
      .bubble-wrapper,
      .typing-bubble,
      .messages-welcome__avatar,
      .offline-banner,
      .suggestion-chip {
        animation: none !important;
      }
      .header__status-dot { animation: none !important; }
    }
  `}function We(){return`
    /* ===================================================
       INPUT CONTAINER (outer wrapper — stacks input row + footer)
    =================================================== */

    .input-container {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      background: var(--surface);
    }

    /* ===================================================
       INPUT AREA
    =================================================== */

    .input-area {
      padding: 10px 12px 12px;
      background: var(--surface);
      border-top: 1px solid var(--border);
      display: flex;
      align-items: flex-end;
      gap: 8px;
      flex-shrink: 0;
    }

    .input-wrapper {
      flex: 1;
      background: var(--surface-alt);
      border: 1.5px solid var(--border);
      border-radius: var(--radius-md);
      display: flex;
      align-items: flex-end;
      overflow: hidden;
      transition: border-color var(--transition-fast),
                  box-shadow var(--transition-fast);
    }

    .input-wrapper:focus-within {
      border-color: var(--primary);
      box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.15);
      background: var(--surface);
    }

    .input-wrapper.is-disabled {
      opacity: 0.55;
      pointer-events: none;
      /* Subtle animated border shows the request is in-flight */
      border-color: rgba(var(--primary-rgb), 0.4);
      animation: inputPulse 1.8s ease-in-out infinite;
    }

    @keyframes inputPulse {
      0%, 100% { box-shadow: 0 0 0 0px rgba(var(--primary-rgb), 0); }
      50%       { box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.12); }
    }

    .input-textarea {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      padding: 8px 10px 8px 12px;
      font-family: var(--font);
      font-size: var(--font-size-md);
      color: var(--text-primary);
      resize: none;
      min-height: 36px;
      max-height: 116px;
      line-height: 1.5;
      display: block;
      width: 100%;
      overflow-y: auto;
      scrollbar-width: thin;
    }

    .input-textarea::placeholder {
      color: var(--text-tertiary);
    }

    .input-textarea::-webkit-scrollbar {
      width: 3px;
    }

    .input-textarea::-webkit-scrollbar-thumb {
      background: var(--border);
      border-radius: 2px;
    }

    /* Send button */
    .send-btn {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      border: none;
      background: var(--primary);
      color: var(--text-inverse);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: background var(--transition-fast),
                  opacity var(--transition-fast),
                  transform var(--transition-spring);
    }

    .send-btn:disabled {
      background: var(--border);
      color: var(--text-tertiary);
      cursor: not-allowed;
      transform: none;
    }

    .send-btn:not(:disabled):hover {
      filter: brightness(0.87);
      transform: scale(1.06);
    }

    .send-btn:not(:disabled):active {
      transform: scale(0.93);
    }

    .send-btn:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    /* Footer attribution */
    .input-footer {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 4px 0 0;
    }

    .input-footer__text {
      font-size: var(--font-size-2xs);
      color: var(--text-tertiary);
      letter-spacing: 0.2px;
    }

    .input-footer__text a {
      color: var(--text-tertiary);
      text-decoration: none;
    }

    .input-footer__text a:hover {
      text-decoration: underline;
    }

    /* ===================================================
       VOICE INPUT — mic button + listening pulse
    =================================================== */

    .voice-btn {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: var(--radius-sm);
      border: none;
      background: transparent;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      transition:
        background var(--transition-fast),
        color var(--transition-fast),
        transform 120ms ease;
    }

    .voice-btn:hover {
      background: var(--surface-alt);
      color: var(--text-primary);
    }

    .voice-btn:active { transform: scale(0.92); }

    .voice-btn:focus-visible {
      outline: 2px solid var(--primary);
      outline-offset: 2px;
    }

    .voice-btn[hidden] { display: none !important; }

    /* Active "listening" state — red mic + animated rings */
    .voice-btn.is-listening {
      background: rgba(239, 68, 68, 0.1);
      color: var(--error);
    }

    .voice-btn.is-listening::before,
    .voice-btn.is-listening::after {
      content: '';
      position: absolute;
      inset: 4px;
      border-radius: var(--radius-sm);
      border: 2px solid rgba(239, 68, 68, 0.55);
      pointer-events: none;
      animation: voicePulse 1.4s ease-out infinite;
    }

    .voice-btn.is-listening::after {
      animation-delay: 0.7s;
    }

    @keyframes voicePulse {
      0%   { transform: scale(0.92); opacity: 0.8; }
      100% { transform: scale(1.55); opacity: 0;   }
    }

    /* Interim transcript chip appearing above the input */
    .interim-transcript {
      margin: 0 12px 6px;
      padding: 7px 11px;
      background: rgba(var(--primary-rgb), 0.08);
      border: 1px dashed rgba(var(--primary-rgb), 0.4);
      border-radius: var(--radius-sm);
      font-size: var(--font-size-xs);
      color: var(--primary);
      font-style: italic;
      line-height: 1.4;
      display: flex;
      align-items: center;
      gap: 6px;
      animation: bannerSlideIn 220ms ease both;
    }

    .interim-transcript[hidden] { display: none !important; }

    .interim-transcript__dot {
      flex-shrink: 0;
      width: 6px;
      height: 6px;
      border-radius: var(--radius-full);
      background: var(--error);
      animation: blink 1s ease-in-out infinite;
    }

    @keyframes blink {
      0%, 100% { opacity: 1;   }
      50%       { opacity: 0.3; }
    }

    /* ===================================================
       CHARACTER COUNTER
    =================================================== */

    .input-counter {
      font-size: 10px;
      color: var(--text-tertiary);
      font-weight: 500;
      padding: 0 8px 4px 0;
      text-align: right;
      opacity: 0;
      transition: opacity var(--transition-base), color var(--transition-fast);
    }

    .input-counter.is-visible { opacity: 1; }
    .input-counter.is-warn    { color: var(--warning); }
    .input-counter.is-limit   { color: var(--error); }

    /* ===================================================
       REDUCED MOTION
    =================================================== */

    @media (prefers-reduced-motion: reduce) {
      .voice-btn.is-listening::before,
      .voice-btn.is-listening::after,
      .interim-transcript__dot,
      .input-wrapper.is-disabled {
        animation: none !important;
      }
    }
  `}function d(t,r={},...i){const e=document.createElement(t);for(const[n,s]of Object.entries(r))if(s!=null)if(n==="class")e.className=s;else if(n==="style"&&typeof s=="string")e.style.cssText=s;else if(n==="html")e.innerHTML=s;else if(n.startsWith("on")&&typeof s=="function"){const a=n.slice(2).toLowerCase();e.addEventListener(a,s)}else e.setAttribute(n,s);for(const n of i.flat(1/0))n!=null&&(typeof n=="string"||typeof n=="number"?e.appendChild(document.createTextNode(String(n))):n instanceof Node&&e.appendChild(n));return e}function re(t){const i=Date.now()-t,e=Math.floor(i/6e4);return e<1?"just now":e<60?`${e} min ago`:new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function V(t){const r=t.trim().split(/\s+/);return r.length===1?r[0][0].toUpperCase():(r[0][0]+r[r.length-1][0]).toUpperCase()}const De=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
  <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"/>
  <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.124-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"/>
</svg>`,ne=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</svg>`,Ue=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
</svg>`,Pe=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
  <polyline points="6 9 12 15 18 9"/>
</svg>`,He=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
  <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/>
</svg>`,Fe=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13" aria-hidden="true">
  <polyline points="1 4 1 10 7 10"/>
  <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
</svg>`,je=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
  <rect x="9" y="3" width="6" height="12" rx="3"/>
  <path d="M5 11a7 7 0 0 0 14 0"/>
  <line x1="12" y1="18" x2="12" y2="22"/>
  <line x1="8" y1="22" x2="16" y2="22"/>
</svg>`,Ve=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17" aria-hidden="true">
  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
  <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
</svg>`,ie=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="17" height="17" aria-hidden="true">
  <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
  <line x1="23" y1="9" x2="17" y2="15"/>
  <line x1="17" y1="9" x2="23" y2="15"/>
</svg>`,Ye=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
  <line x1="12" y1="5" x2="12" y2="19"/>
  <polyline points="19 12 12 19 5 12"/>
</svg>`,qe=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
  <path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9L12 2z"/>
  <path d="M19 14l.9 2.4L22 17l-2.1.6L19 20l-.9-2.4L16 17l2.1-.6L19 14z"/>
  <path d="M5 14l.9 2.4L8 17l-2.1.6L5 20l-.9-2.4L2 17l2.1-.6L5 14z"/>
</svg>`,ae=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="11" height="11" aria-hidden="true">
  <polyline points="20 6 9 17 4 12"/>
</svg>`,Ge=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" width="13" height="11" aria-hidden="true">
  <polyline points="1 12 6 17 15 7"/>
  <polyline points="9 12 14 17 23 7"/>
</svg>`,Ke=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14" aria-hidden="true">
  <line x1="2" y1="2" x2="22" y2="22"/>
  <path d="M8.5 16.5a5 5 0 0 1 7 0"/>
  <path d="M2 8.82a15 15 0 0 1 4.17-2.65"/>
  <path d="M10.66 5c4.01-.36 8.14.9 11.34 3.76"/>
  <path d="M16.85 11.25a10 10 0 0 1 2.22 1.68"/>
  <path d="M5 13a10 10 0 0 1 5.24-2.76"/>
  <line x1="12" y1="20" x2="12.01" y2="20"/>
</svg>`;function Xe(t,r,i){const e=d("span",{class:"launcher__icon launcher__icon--chat",html:De}),n=d("span",{class:"launcher__icon launcher__icon--close",html:ne}),s=d("span",{class:"launcher__badge","aria-label":"unread messages",role:"status"});s.setAttribute("hidden","");const a=d("button",{class:"launcher",type:"button","aria-label":`Open chat with ${i.botName}`,"aria-expanded":"false","aria-haspopup":"dialog"},e,n,s),u=()=>r.emit("toggle");a.addEventListener("click",u);function g(c,b){const p=c.isOpen!==(b==null?void 0:b.isOpen),v=c.unreadCount!==(b==null?void 0:b.unreadCount);if(p&&(a.classList.toggle("is-open",c.isOpen),a.setAttribute("aria-expanded",String(c.isOpen)),a.setAttribute("aria-label",c.isOpen?"Close chat":`Open chat with ${i.botName}`)),v||p){const x=c.unreadCount;x>0&&!c.isOpen?(s.textContent=x>99?"99+":String(x),s.removeAttribute("hidden"),s.setAttribute("aria-label",`${x} unread message${x!==1?"s":""}`)):s.setAttribute("hidden","")}}const m=t.subscribe(g);function l(){m(),a.removeEventListener("click",u)}return{el:a,destroy:l}}function Je(t,r,i){let e;if(i.avatarUrl){const E=d("img",{class:"header__avatar-img",src:i.avatarUrl,alt:`${i.botName} avatar`});E.addEventListener("error",()=>{E.replaceWith(n())}),e=E}else e=n();function n(){return d("span",{class:"header__avatar-fallback","aria-hidden":"true"},V(i.botName))}const s=d("span",{class:"header__status-dot",title:"Online","aria-hidden":"true"}),a=d("div",{class:"header__avatar"},e,s),u=d("div",{class:"header__name"},i.botName),g=d("div",{class:"header__subtitle"},"Active now"),m=d("div",{class:"header__info"},u,g),l=d("button",{class:"header__btn",type:"button","aria-label":"Turn on voice responses","aria-pressed":"false",title:"Voice responses",html:ie});l.setAttribute("hidden","");const c=()=>r.emit("tts-toggle");l.addEventListener("click",c);function b(E){const T=E.ttsSupported&&i.enableTTS!==!1;l.toggleAttribute("hidden",!T);const z=!!E.ttsEnabled;l.innerHTML=z?Ve:ie,l.setAttribute("aria-pressed",String(z)),l.setAttribute("aria-label",z?"Turn off voice responses":"Turn on voice responses"),l.title=z?"Voice responses: on":"Voice responses: off"}const p=d("button",{class:"header__btn",type:"button","aria-label":"Close chat",html:Pe}),v=()=>r.emit("close");p.addEventListener("click",v);const x=d("div",{class:"header__actions"},l,p),k=d("header",{class:"header",role:"banner"},a,m,x);function _(E,T){(E.ttsEnabled!==(T==null?void 0:T.ttsEnabled)||E.ttsSupported!==(T==null?void 0:T.ttsSupported))&&b(E)}const A=t.subscribe(_);b(t.getState());function w(){p.removeEventListener("click",v),l.removeEventListener("click",c),A()}return{el:k,destroy:w}}function se({suggestions:t=[],bus:r,messageId:i=null,ariaLabel:e="Suggested replies"}){const n=d("div",{class:"suggestions",role:"group","aria-label":e});let s=i,a=!1;function u(c){if(n.textContent="",!Array.isArray(c)||c.length===0){n.setAttribute("hidden","");return}n.removeAttribute("hidden"),c.forEach(b=>{const p=d("button",{type:"button",class:"suggestion-chip","aria-label":`Send: ${b}`});p.textContent=b,p.addEventListener("click",()=>{a||(m(!0),r.emit("suggestion-click",{text:b,messageId:s}))}),n.appendChild(p)})}function g({suggestions:c=[],messageId:b=s}={}){s=b,a=!1,u(c)}function m(c){a=!!c,n.classList.toggle("suggestions--disabled",a);for(const b of n.querySelectorAll(".suggestion-chip"))b.disabled=a,b.setAttribute("aria-disabled",String(a))}function l(){n.textContent=""}return u(t),{el:n,update:g,setDisabled:m,destroy:l}}function Qe(t,r,i,e=!0){const n=t.role==="user";let s=null;if(!n)if(r.avatarUrl){const w=document.createElement("img");w.src=r.avatarUrl,w.alt="",s=d("div",{class:"bubble-avatar"},w),w.addEventListener("error",()=>{w.replaceWith(document.createTextNode(V(r.botName)))})}else s=d("div",{class:`bubble-avatar${e?"":" bubble-avatar--hidden"}`,"aria-hidden":"true"},V(r.botName));const a=d("div",{class:`bubble bubble--${n?"user":"assistant"}`});a.textContent=t.content;let u=null;if(n){u=d("div",{class:"bubble-retry-row","aria-live":"polite"}),u.setAttribute("hidden","");const w=d("button",{class:"bubble-retry-btn",type:"button","aria-label":"Retry sending this message",html:`${Fe} Retry`});w.addEventListener("click",()=>{i.emit("retry-message",{messageId:t.id,content:t.content})});const E=d("span",{class:"bubble-retry-row__text"},"Failed to send.");u.appendChild(E),u.appendChild(w)}const g=d("span",{class:"bubble-meta__time"},re(t.timestamp));let m=null;n&&(m=d("span",{class:"bubble-meta__status","aria-hidden":"true",html:ae}),m.setAttribute("hidden",""));const l=d("div",{class:`bubble-meta bubble-meta--${n?"user":"assistant"}`,"aria-label":new Date(t.timestamp).toLocaleTimeString()},g,m);let c=null;n||(c=se({suggestions:Array.isArray(t.suggestions)?t.suggestions:[],bus:i,messageId:t.id}));const b=[a];c&&b.push(c.el),u&&b.push(u),b.push(l);const p=d("div",{class:"bubble-content"},...b),v=n?[p]:[s,p],x=d("div",{class:`bubble-wrapper bubble-wrapper--${n?"user":"assistant"}`,role:"listitem","data-message-id":t.id},...v);k(t.status);function k(w){a.classList.remove("bubble--sending","bubble--failed"),w==="sending"?(a.classList.add("bubble--sending"),u&&u.setAttribute("hidden",""),m&&m.setAttribute("hidden","")):w==="failed"?(a.classList.add("bubble--failed"),u&&u.removeAttribute("hidden"),m&&m.setAttribute("hidden","")):(u&&u.setAttribute("hidden",""),m&&(m.innerHTML=w==="delivered"?Ge:ae,m.classList.toggle("bubble-meta__status--delivered",w==="delivered"),m.classList.toggle("bubble-meta__status--sent",w!=="delivered"),m.removeAttribute("hidden")))}function _(w){if(w.content!==t.content&&(a.textContent=w.content,t.content=w.content),w.status!==t.status&&(t.status=w.status,k(w.status)),w.timestamp!==t.timestamp&&(t.timestamp=w.timestamp,g.textContent=re(w.timestamp),l.setAttribute("aria-label",new Date(w.timestamp).toLocaleTimeString())),c){const E=Array.isArray(w.suggestions)?w.suggestions:[],T=Array.isArray(t.suggestions)?t.suggestions:[];(E.length!==T.length||E.some((z,D)=>z!==T[D]))&&(t.suggestions=E,c.update({suggestions:E,messageId:t.id}))}}function A(w){s&&s.classList.toggle("bubble-avatar--hidden",!w)}return{el:x,update:_,setAvatarVisible:A}}const Ze=[{delayMs:1500,text:"Thinking…"},{delayMs:5e3,text:"Processing…"},{delayMs:1e4,text:"Almost ready…"}];function et(t,r){let i;if(r.avatarUrl){i=d("div",{class:"bubble-avatar"});const p=document.createElement("img");p.src=r.avatarUrl,p.alt="",p.addEventListener("error",()=>{p.replaceWith(document.createTextNode(V(r.botName)))}),i.appendChild(p)}else i=d("div",{class:"bubble-avatar","aria-hidden":"true"},V(r.botName));const e=d("div",{class:"typing-dots","aria-hidden":"true"},d("span",{class:"typing-dot"}),d("span",{class:"typing-dot"}),d("span",{class:"typing-dot"})),n=d("span",{class:"typing-label","aria-live":"polite"}),s=d("div",{class:"typing-bubble"},e,n),a=d("div",{class:"typing-indicator",role:"status","aria-label":`${r.botName} is thinking`},i,s);a.setAttribute("hidden","");let u=[];function g(){n.textContent="",n.classList.remove("typing-label--visible"),u=Ze.map(({delayMs:p,text:v})=>setTimeout(()=>{n.textContent=v,n.classList.add("typing-label--visible"),a.setAttribute("aria-label",`${r.botName}: ${v}`)},p))}function m(){u.forEach(clearTimeout),u=[],n.textContent="",n.classList.remove("typing-label--visible"),a.setAttribute("aria-label",`${r.botName} is thinking`)}function l(p,v){p.status!==(v==null?void 0:v.status)&&(p.status==="loading"?(a.removeAttribute("hidden"),g()):(a.setAttribute("hidden",""),m()))}const c=t.subscribe(l);function b(){m(),c()}return{el:a,destroy:b}}function tt(t,r,i){const e=d("div",{class:"sr-only","aria-live":"polite","aria-atomic":"false",role:"log"});let n;if(i.avatarUrl){const o=document.createElement("img");o.src=i.avatarUrl,o.alt="",o.style.cssText="width:100%;height:100%;object-fit:cover;border-radius:50%",n=d("div",{class:"messages-welcome__avatar"},o)}else n=d("div",{class:"messages-welcome__avatar"},V(i.botName));const s=se({suggestions:Array.isArray(i.defaultSuggestions)?i.defaultSuggestions:[],bus:r,messageId:null,ariaLabel:"Quick start options"}),a=d("div",{class:"messages-welcome__title"},`Hi, I'm ${i.botName}`),u=d("div",{class:"messages-welcome__hint"},d("span",{class:"messages-welcome__hint-icon",html:qe}),"AI Assistant"),g=d("div",{class:"messages-welcome","aria-hidden":"true"},n,u,a,d("p",{class:"messages-welcome__text"},i.welcomeMessage),s.el),{el:m,destroy:l}=et(t,i),c=d("div",{role:"list","aria-label":"Chat messages"}),b=d("span",{class:"scroll-to-bottom__count"});b.setAttribute("hidden","");const p=d("button",{type:"button",class:"scroll-to-bottom","aria-label":"Jump to latest message"},d("span",{class:"scroll-to-bottom__icon",html:Ye,"aria-hidden":"true"}),d("span",{class:"scroll-to-bottom__label"},"Latest"),b),v=d("div",{class:"messages-area","aria-label":"Messages",tabindex:"0"},g,c,m,p,e),x=new Map;let k=!1,_=0,A=0;function w(){const o=k;p.classList.toggle("is-visible",o),o||(A=0),E()}function E(){A>0?(b.textContent=A>99?"99+":String(A),b.removeAttribute("hidden")):b.setAttribute("hidden","")}v.addEventListener("scroll",()=>{const o=v.scrollHeight-v.scrollTop-v.clientHeight,f=k;k=o>60,f!==k&&w()},{passive:!0}),p.addEventListener("click",()=>{k=!1,A=0,T(!0),w()});function T(o=!1){(!k||o)&&requestAnimationFrame(()=>{v.scrollTop=v.scrollHeight})}function z(o){const f=new Set(o.map(S=>S.id));for(const[S,M]of x)f.has(S)||(M.el.remove(),x.delete(S));o.forEach((S,M)=>{var U;const W=M===o.length-1||((U=o[M+1])==null?void 0:U.role)!==S.role;if(x.has(S.id)){const{handle:P}=x.get(S.id);P.update(S),P.setAvatarVisible(S.role==="assistant"&&W)}else{const P=S.role==="assistant"&&W,H=Qe(S,i,r,P);c.appendChild(H.el),x.set(S.id,{el:H.el,handle:H}),S.role==="assistant"&&Me(e,`${i.botName}: ${S.content}`)}})}function D(o,f){const S=o.messages!==(f==null?void 0:f.messages),M=o.status!==(f==null?void 0:f.status);if(S){const W=o.messages.length>0;if(g.setAttribute("aria-hidden",String(W)),g.style.display=W?"none":"",z(o.messages),o.messages.length>_)if(k){const H=o.messages.slice(_).filter(X=>X.role==="assistant").length;A+=H,E()}else T(!0);_=o.messages.length}M&&o.status==="loading"&&T(),v.setAttribute("aria-busy",String(o.status==="loading"))}const y=t.subscribe(D);D(t.getState(),null);function I(){y(),l(),s.destroy(),x.clear()}return{el:v,scrollToBottom:T,destroy:I}}const K=2e3,oe=1700;function rt(t,r,i){const e=document.createElement("textarea");e.className="input-textarea",e.placeholder=`Message ${i.botName}…`,e.setAttribute("aria-label","Type a message"),e.setAttribute("rows","1"),e.setAttribute("maxlength",String(K)),e.setAttribute("autocomplete","off"),e.setAttribute("spellcheck","true");const n=d("button",{class:"send-btn",type:"button","aria-label":"Send message",html:Ue,disabled:""}),s=d("button",{class:"voice-btn",type:"button","aria-label":"Start voice input","aria-pressed":"false",html:je});s.setAttribute("hidden",""),s.addEventListener("click",()=>{_()||r.emit("voice-toggle")});const a=d("div",{class:"input-wrapper"},e),u=d("span",{class:"interim-transcript__dot","aria-hidden":"true"}),g=d("span",{class:"interim-transcript__text"}),m=d("div",{class:"interim-transcript",role:"status","aria-live":"polite"},u,g);m.setAttribute("hidden","");const l=d("div",{class:"input-counter","aria-live":"polite"}),c=d("div",{class:"input-area",role:"form","aria-label":"Message input"},a,s,n),b=d("div",{class:"input-container"},m,c,l);i.hideAttribution||b.appendChild(d("div",{class:"input-footer"},d("span",{class:"input-footer__text"},"Powered by AI Receptionist")));function p(){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}e.addEventListener("input",()=>{p(),v(),x()});function v(){const o=e.value.trim().length>0;n.disabled=!o||_()}function x(){const o=e.value.length,f=K-o;l.classList.toggle("is-visible",o>=oe),l.classList.toggle("is-warn",o>=oe&&o<K),l.classList.toggle("is-limit",o>=K),l.textContent=`${f} left`}function k(){const o=e.value.trim();!o||_()||(r.emit("send",o),e.value="",e.style.height="auto",n.disabled=!0,x(),e.focus())}n.addEventListener("click",k),e.addEventListener("keydown",o=>{if((o.ctrlKey||o.metaKey)&&o.key.toLowerCase()==="m"){!s.hasAttribute("hidden")&&!_()&&(o.preventDefault(),r.emit("voice-toggle"));return}o.key==="Enter"&&!o.shiftKey&&(o.preventDefault(),k())});function _(){const o=t.getState();return o.status==="loading"||o.online===!1}function A(o){e.disabled=o,a.classList.toggle("is-disabled",o),o?n.disabled=!0:v()}function w(o){o.online===!1?e.placeholder="You are offline — messages will resume once reconnected":o.voiceState==="listening"?e.placeholder="Listening… speak now or click mic to stop":o.status==="loading"?e.placeholder=`${i.botName} is thinking…`:e.placeholder=`Message ${i.botName}…`}function E(o){const f=o.sttSupported&&i.enableVoice!==!1;s.toggleAttribute("hidden",!f);const S=o.voiceState==="listening";s.classList.toggle("is-listening",S),s.setAttribute("aria-pressed",String(S)),s.setAttribute("aria-label",S?"Stop voice input":"Start voice input")}function T(o){const f=o.voiceState==="listening"&&typeof o.interimTranscript=="string"&&o.interimTranscript.trim().length>0;m.toggleAttribute("hidden",!f),f&&(g.textContent=o.interimTranscript)}function z(o,f){(o.status!==(f==null?void 0:f.status)||o.online!==(f==null?void 0:f.online))&&A(_()),(o.status!==(f==null?void 0:f.status)||o.online!==(f==null?void 0:f.online)||o.voiceState!==(f==null?void 0:f.voiceState))&&w(o),(o.voiceState!==(f==null?void 0:f.voiceState)||o.sttSupported!==(f==null?void 0:f.sttSupported))&&E(o),(o.interimTranscript!==(f==null?void 0:f.interimTranscript)||o.voiceState!==(f==null?void 0:f.voiceState))&&T(o)}const D=t.subscribe(z);z(t.getState(),null),x();function y(){requestAnimationFrame(()=>e.focus())}function I(){D()}return{el:b,focus:y,destroy:I}}function nt(t,r){const i=d("span",{class:"error-banner__icon",html:He,"aria-hidden":"true"}),e=d("span",{class:"error-banner__text"}),n=d("button",{class:"error-banner__retry",type:"button","aria-label":"Retry"},"Retry"),s=d("button",{class:"error-banner__dismiss",type:"button","aria-label":"Dismiss error",html:ne}),a=d("div",{class:"error-banner",role:"alert","aria-live":"assertive"},i,e,n,s);a.setAttribute("hidden",""),n.addEventListener("click",()=>{r.emit("retry-last")}),s.addEventListener("click",()=>{r.emit("dismiss-error")});function u(l,c){l.error!==(c==null?void 0:c.error)&&(l.error?(e.textContent=l.error.message,n.style.display=l.error.retryable?"":"none",a.removeAttribute("hidden")):a.setAttribute("hidden",""))}const g=t.subscribe(u);function m(){g()}return{el:a,destroy:m}}function it(t){const r=d("div",{class:"offline-banner",role:"status","aria-live":"polite"},d("span",{html:Ke,"aria-hidden":"true"}),d("span",null,"You are offline — we will reconnect automatically"));r.setAttribute("hidden","");function i(n,s){n.online!==(s==null?void 0:s.online)&&r.toggleAttribute("hidden",n.online!==!1)}const e=t.subscribe(i);return{el:r,destroy(){e()}}}function at(t,r){var X,de;const i=document.createElement("style");i.textContent=[$e(r),Re(r),Be(),We()].join(`
`),t.appendChild(i);const e=he(r.apiKey,r.sessionTtlHours),n=e.load(),s=(X=n==null?void 0:n.sessionId)!=null?X:e.createNew(),a=(de=n==null?void 0:n.messages)!=null?de:[];r.sessionId=s;const u=Ae(),g=_e({lang:r.voiceLang||"en-US",onResult:({text:h,isFinal:L})=>{L?(l.setState({interimTranscript:""}),h&&p.emit("send",h)):l.setState({interimTranscript:h})},onError:h=>{l.setState({voiceState:"idle",interimTranscript:"",error:{message:h.message,retryable:!1,failedMessageId:null}})},onStateChange:h=>{h!=="listening"?l.setState({voiceState:h,interimTranscript:""}):l.setState({voiceState:h})}}),m=Se({enabled:!!r.enableSounds,volume:typeof r.soundVolume=="number"?r.soundVolume:.18}),l=fe(ge(s,a,{sttSupported:g.sttSupported,ttsSupported:g.ttsSupported,ttsEnabled:g.ttsSupported&&r.enableTTS!==!1&&!!r.ttsDefaultOn,online:u.isOnline()}));g.setMuted(!l.getState().ttsEnabled);let c=null;l.subscribe(h=>{clearTimeout(c),c=setTimeout(()=>{e.save(h.sessionId,h.messages)},300)});const b=u.subscribe(h=>{l.setState({online:h})}),p=Ne(),{el:v}=Xe(l,p,r),{el:x,destroy:k}=Je(l,p,r),{el:_,destroy:A}=it(l),{el:w,scrollToBottom:E}=tt(l,p,r),{el:T}=nt(l,p),{el:z,focus:D}=rt(l,p,r),y=document.createElement("div");y.className="widget-window",y.setAttribute("role","dialog"),y.setAttribute("aria-modal","true"),y.setAttribute("aria-label",`Chat with ${r.botName}`),y.setAttribute("aria-hidden","true"),y.appendChild(x),y.appendChild(_),y.appendChild(w),y.appendChild(T),y.appendChild(z),t.appendChild(y),t.appendChild(v);const I=Oe(y);let o=v;p.on("toggle",()=>{const{isOpen:h}=l.getState();h?S():f()}),p.on("close",()=>{S()}),p.on("send",h=>{W(h)}),p.on("retry-last",()=>{const{messages:h}=l.getState(),L=[...h].reverse().find(C=>C.role==="user"&&C.status==="failed");L&&U(L)}),p.on("retry-message",({messageId:h,content:L})=>{const{messages:C}=l.getState(),R=C.find(F=>F.id===h);R&&U(R)}),p.on("dismiss-error",()=>{l.setState({error:null})}),p.on("suggestion-click",({text:h,messageId:L})=>{L&&l.setState(C=>({messages:C.messages.map(R=>R.id===L?j(N({},R),{suggestions:[]}):R)})),W(h)}),p.on("voice-toggle",()=>{const h=l.getState();h.status!=="loading"&&(h.voiceState==="listening"?g.stopListening():(g.cancelSpeaking(),g.startListening()))}),p.on("tts-toggle",()=>{const h=!l.getState().ttsEnabled;l.setState({ttsEnabled:h}),g.setMuted(!h),h||g.cancelSpeaking()});function f(){l.setState({isOpen:!0,unreadCount:0}),y.classList.add("is-open"),y.removeAttribute("aria-hidden"),I.activate(null),D(),E(!0),y.setAttribute("aria-label",`Chat with ${r.botName} — dialog`)}function S(){l.setState({isOpen:!1}),y.classList.remove("is-open"),y.setAttribute("aria-hidden","true"),I.deactivate(o),g.stopListening(),g.cancelSpeaking()}const M=h=>{h.key==="Escape"&&l.getState().isOpen&&S()};document.addEventListener("keydown",M);async function W(h){if(l.getState().status==="loading")return;const C={id:Q(),role:"user",content:h,timestamp:Date.now(),status:"sending"};l.setState(R=>({messages:[...R.messages,C],status:"loading",error:null})),m.play("send"),await P(C)}async function U(h){l.setState(L=>({messages:L.messages.map(C=>C.id===h.id?j(N({},C),{status:"sending"}):C),status:"loading",error:null})),await P(h)}async function P(h){l.setState(L=>({messages:L.messages.map(C=>C.id===h.id?j(N({},C),{status:"sent"}):C)}));try{const L=l.getState().messages.filter(q=>q.status!=="failed"),{reply:C,suggestions:R}=await Le(L,r),F={id:Q(),role:"assistant",content:C,timestamp:Date.now(),status:"sent",suggestions:R};l.setState(q=>({messages:[...q.messages.map(J=>{var ue;return J.role==="assistant"&&((ue=J.suggestions)!=null&&ue.length)?j(N({},J),{suggestions:[]}):J}),F],status:"idle",error:null})),l.getState().isOpen||l.setState(q=>({unreadCount:q.unreadCount+1})),m.play("receive"),l.getState().ttsEnabled&&g.speak(C)}catch(L){const C=Te(L);l.setState(R=>({messages:R.messages.map(F=>F.id===h.id?j(N({},F),{status:"failed"}):F),status:"error",error:{message:C.message,retryable:C.retryable,failedMessageId:h.id}})),m.play("error"),console.error("[AI Widget] API call failed:",L)}}function H(){document.removeEventListener("keydown",M),p.clear(),c&&clearTimeout(c);try{b()}catch(h){}try{u.destroy()}catch(h){}try{g.destroy()}catch(h){}try{m.destroy()}catch(h){}try{k()}catch(h){}try{A()}catch(h){}}return{open:f,close:S,toggle:()=>l.getState().isOpen?S():f(),destroy:H,on:(h,L)=>p.on(h,L),off:(h,L)=>p.off(h,L),getState:()=>N({},l.getState())}}const le="ai-receptionist-widget-host";function st(t){if(document.getElementById(le))return console.warn("[AI Widget] Already initialized. Call window.LinorWidget.destroy() first to re-mount."),typeof window!="undefined"&&window.LinorWidget||null;const r=document.createElement("div");r.id=le,r.style.cssText=["position: fixed","z-index: 2147483647","top: 0","left: 0","width: 0","height: 0","overflow: visible","pointer-events: none"].join("; ");const i=r.attachShadow({mode:"closed"});document.body.appendChild(r);const e=at(i,t),n=e.destroy;return e.destroy=()=>{n(),r.remove(),typeof window!="undefined"&&window.LinorWidget===e&&delete window.LinorWidget},e}const ot=typeof document!="undefined"?document.currentScript:null;function ce(){const t=$(ot);if(!t.apiKey||!t.apiUrl)return;const r=st(t);r&&typeof window!="undefined"&&(window.LinorWidget=r)}typeof document!="undefined"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",ce,{once:!0}):ce())})();
//# sourceMappingURL=widget.js.map
