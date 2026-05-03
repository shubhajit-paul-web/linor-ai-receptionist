var Me=Object.defineProperty,Be=Object.defineProperties;var Re=Object.getOwnPropertyDescriptors;var te=Object.getOwnPropertySymbols;var De=Object.prototype.hasOwnProperty,He=Object.prototype.propertyIsEnumerable;var re=(T,C,I)=>C in T?Me(T,C,{enumerable:!0,configurable:!0,writable:!0,value:I}):T[C]=I,E=(T,C)=>{for(var I in C||(C={}))De.call(C,I)&&re(T,I,C[I]);if(te)for(var I of te(C))He.call(C,I)&&re(T,I,C[I]);return T},W=(T,C)=>Be(T,Re(C));(function(){"use strict";const T={botName:"Assistant",primaryColor:"#6366f1",welcomeMessage:"Hi! How can I help you today?",position:"bottom-right",offsetX:24,offsetY:24,zIndex:2147483647,buttonSize:56,windowWidth:380,windowHeight:580,hideAttribution:!1,avatarUrl:null,apiKey:null,apiUrl:null,sessionTtlHours:24,maxRetries:3,requestTimeoutMs:3e4,defaultSuggestions:["Book an appointment","Working hours","Services offered","Contact info"]};function C(e){const r=e.replace("#",""),n=r.length===3?r.split("").map(a=>a+a).join(""):r,t=/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(n);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16)].join(", "):"99, 102, 241"}function I(e){const r=typeof window!="undefined"&&window.__AI_WIDGET_CONFIG__?window.__AI_WIDGET_CONFIG__:{},n=typeof window!="undefined"&&window.LinorConfig?window.LinorConfig:{},t={};if(e){const s=w=>e.getAttribute(`data-${w}`),o=w=>{const c=parseInt(s(w),10);return isNaN(c)?void 0:c};s("api-key")&&(t.apiKey=s("api-key")),s("api-url")&&(t.apiUrl=s("api-url")),s("bot-name")&&(t.botName=s("bot-name")),s("primary-color")&&(t.primaryColor=s("primary-color")),s("welcome-message")&&(t.welcomeMessage=s("welcome-message")),s("position")&&(t.position=s("position")),s("avatar-url")&&(t.avatarUrl=s("avatar-url")),s("hide-attribution")&&(t.hideAttribution=s("hide-attribution")!=="false");const h=o("offset-x");h!==void 0&&(t.offsetX=h);const u=o("offset-y");u!==void 0&&(t.offsetY=u);const p=o("z-index");p!==void 0&&(t.zIndex=p);const l=o("button-size");l!==void 0&&(t.buttonSize=l);const b=o("window-width");b!==void 0&&(t.windowWidth=b);const g=o("window-height");g!==void 0&&(t.windowHeight=g);const m=o("session-ttl-hours");m!==void 0&&(t.sessionTtlHours=m);const v=o("max-retries");v!==void 0&&(t.maxRetries=v);const A=o("request-timeout-ms");A!==void 0&&(t.requestTimeoutMs=A);const f=s("default-suggestions");f!=null&&(t.defaultSuggestions=f.split("|").map(w=>w.trim()).filter(Boolean).slice(0,4))}const a=E(E(E(E({},T),r),n),t);return["bottom-right","bottom-left","top-right","top-left"].includes(a.position)||(console.warn(`[AI Widget] Invalid position "${a.position}". Falling back to "bottom-right".`),a.position="bottom-right"),a.primaryRgb=C(a.primaryColor),a.apiKey||console.warn("[AI Widget] Missing api-key. Widget will be disabled. Set data-api-key on the script tag or window.LinorConfig.apiKey."),a.apiUrl||console.warn("[AI Widget] Missing api-url. Widget will be disabled. Set data-api-url on the script tag or window.LinorConfig.apiUrl."),a}function ae(e){let r=E({},e);const n=new Set;return{getState(){return r},setState(t){const a=r,i=typeof t=="function"?t(r):t;r=E(E({},r),i),n.forEach(s=>s(r,a))},subscribe(t){return n.add(t),()=>n.delete(t)}}}function ne(e,r=[]){return{isOpen:!1,messages:r,status:"idle",error:null,sessionId:e,unreadCount:0}}const U={get(e){try{const r=localStorage.getItem(e);return r!==null?JSON.parse(r):null}catch(r){return null}},set(e,r){try{return localStorage.setItem(e,JSON.stringify(r)),!0}catch(n){return!1}},remove(e){try{localStorage.removeItem(e)}catch(r){}},isAvailable(){try{const e="__ai_widget_test__";return localStorage.setItem(e,"1"),localStorage.removeItem(e),!0}catch(e){return!1}}};function P(){return`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function se(){return`sess_${P()}`}function ie(e,r){const n=`ai_widget_session_${e}`,t=r*60*60*1e3;function a(i){return Date.now()-i>t}return{load(){const i=U.get(n);return i?a(i.lastActive)?(U.remove(n),null):{sessionId:i.sessionId,messages:Array.isArray(i.messages)?i.messages:[]}:null},save(i,s){U.set(n,{sessionId:i,messages:s,lastActive:Date.now()})},clear(){U.remove(n)},createNew(){return se()}}}class F extends Error{constructor(r){super(r),this.name="NetworkError"}}class q extends Error{constructor(r){super(`Request timed out after ${r}ms`),this.name="TimeoutError"}}class R extends Error{constructor(r,n){super(r),this.name="ApiError",this.status=n}}async function oe(e,r,n){const t=new AbortController,a=setTimeout(()=>t.abort(),n);try{return await fetch(e,W(E({},r),{signal:t.signal}))}catch(i){throw i.name==="AbortError"?new q(n):new F(i.message||"Network request failed")}finally{clearTimeout(a)}}async function le(e,r=3,n=600){let t;for(let a=0;a<=r;a++)try{return await e()}catch(i){if(t=i,i instanceof R&&i.status>=400&&i.status<500)throw i;if(a<r){const s=n*Math.pow(2,a),o=Math.random()*200;await new Promise(h=>setTimeout(h,s+o))}}throw t}function de(e){return e instanceof q?{message:"The request took too long. Please try again.",retryable:!0}:e instanceof F?{message:"No internet connection. Please check your network.",retryable:!0}:e instanceof R?e.status===401||e.status===403?{message:"Authentication failed. Please check your API key.",retryable:!1}:e.status>=500?{message:"Server error. We're working on it — please try again.",retryable:!0}:{message:"Something went wrong. Please try again.",retryable:!0}:{message:"An unexpected error occurred. Please try again.",retryable:!0}}async function ce(e,r){const{apiKey:n,apiUrl:t,sessionId:a,maxRetries:i,requestTimeoutMs:s}=r;return le(async()=>{var g,m,v,A;const h=e[e.length-1],u=e.slice(0,-1).map(({role:f,content:w})=>({role:f,content:w})),p=await oe(t,{method:"POST",headers:{"Content-Type":"application/json","x-api-key":n,Authorization:`Bearer ${n}`,"X-Widget-Session":a||"","X-Widget-Version":"1.0.0"},body:JSON.stringify({message:h.content,sessionId:a,history:u})},s);if(!p.ok){let f="";try{const w=await p.json();f=w.error||w.message||JSON.stringify(w)}catch(w){f=await p.text().catch(()=>`HTTP ${p.status}`)}throw new R(f||`HTTP ${p.status}`,p.status)}let l;try{l=await p.json()}catch(f){throw new R("Invalid JSON in API response",200)}const b=(A=(v=(m=(g=l.reply)!=null?g:l.message)!=null?m:l.content)!=null?v:l.text)!=null?A:l.answer;if(typeof b!="string"||b.trim()==="")throw new R("Unrecognised response format from API",200);return{reply:b.trim(),suggestions:ue(l.suggestions)}},i)}function ue(e){if(!Array.isArray(e))return[];const r=new Set,n=[];for(const t of e){if(typeof t!="string")continue;const a=t.trim();if(!a)continue;const i=a.length>60?a.slice(0,60).trim():a,s=i.toLowerCase();if(!r.has(s)&&(r.add(s),n.push(i),n.length>=4))break}return n}function pe(){const e=new Map;return{on(r,n){return e.has(r)||e.set(r,new Set),e.get(r).add(n),()=>this.off(r,n)},off(r,n){var t;(t=e.get(r))==null||t.delete(n)},emit(r,n){var t;(t=e.get(r))==null||t.forEach(a=>{try{a(n)}catch(i){console.error(`[AI Widget] EventBus error in handler for "${r}":`,i)}})},clear(){e.clear()}}}const fe=["button:not([disabled])","textarea:not([disabled])","input:not([disabled])","a[href]",'[tabindex]:not([tabindex="-1"])'].join(", ");function Y(e){return Array.from(e.querySelectorAll(fe)).filter(r=>!r.closest("[hidden]")&&r.offsetParent!==null)}function be(e){let r=!1;function n(t){if(!r||t.key!=="Tab")return;const a=Y(e);if(a.length===0){t.preventDefault();return}const i=a[0],s=a[a.length-1],o=t.target;t.shiftKey?o===i&&(t.preventDefault(),s.focus()):o===s&&(t.preventDefault(),i.focus())}return{activate(t){r=!0,e.addEventListener("keydown",n);const a=t||Y(e)[0];a&&requestAnimationFrame(()=>a.focus())},deactivate(t){r=!1,e.removeEventListener("keydown",n),t&&requestAnimationFrame(()=>t.focus())}}}function ge(e,r){e.textContent="",requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.textContent=r})})}function he(e){return`
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      /* === Brand === */
      --primary:          ${e.primaryColor};
      --primary-rgb:      ${e.primaryRgb};
      --primary-light:    rgba(${e.primaryRgb}, 0.12);
      --primary-hover:    rgba(${e.primaryRgb}, 0.88);

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
      --z-widget:         ${e.zIndex};

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
  `}function me(e){const r=e.position||"bottom-right",n=r.includes("left"),t=r.includes("top"),a=typeof e.offsetX=="number"?e.offsetX:24,i=typeof e.offsetY=="number"?e.offsetY:24,s=typeof e.buttonSize=="number"?e.buttonSize:56,o=typeof e.windowWidth=="number"?e.windowWidth:380,h=typeof e.windowHeight=="number"?e.windowHeight:580,u=12,p=i+s+u,l=n?"left":"right",b=t?"top":"bottom",g=t?"-14px":"14px",m=`${t?"top":"bottom"} ${n?"left":"right"}`,v=Math.max(s-4,44);return`
    /* ===================================================
       LAUNCHER BUTTON
    =================================================== */

    .launcher {
      position: fixed;
      ${b}: ${i}px;
      ${l}: ${a}px;
      z-index: var(--z-widget);
      width: ${s}px;
      height: ${s}px;
      border-radius: var(--radius-full);
      background: var(--primary);
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-inverse);
      box-shadow: 0 4px 16px rgba(var(--primary-rgb), 0.45),
                  0 2px 6px rgba(0,0,0,0.12);
      transition: transform var(--transition-spring),
                  box-shadow var(--transition-base);
      outline: none;
      pointer-events: all;
      user-select: none;
      -webkit-tap-highlight-color: transparent;
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
      ${b}: ${p}px;
      ${l}: ${a}px;
      z-index: var(--z-widget);
      width: ${o}px;
      height: ${h}px;
      max-height: calc(100dvh - ${p+16}px);
      background: var(--surface);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-xl);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      pointer-events: none;
      /* Animation start state */
      opacity: 0;
      transform: scale(0.93) translateY(${g});
      transform-origin: ${m};
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
        height: calc(100dvh - ${v+i+u+16}px);
        max-height: calc(100dvh - ${v+i+u+16}px);
        ${b}: ${v+i+u}px;
        ${l}: 8px;
        ${n?"right: 8px;":"left: 8px;"}
        border-radius: var(--radius-lg) var(--radius-lg) var(--radius-md) var(--radius-md);
        transform-origin: ${t?"top":"bottom"} center;
      }

      .launcher {
        ${b}: ${Math.max(i-10,8)}px;
        ${l}: ${Math.max(a-10,8)}px;
        width: ${v}px;
        height: ${v}px;
      }
    }
  `}function xe(){return`
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
  `}function ye(){return`
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
  `}function d(e,r={},...n){const t=document.createElement(e);for(const[a,i]of Object.entries(r))if(i!=null)if(a==="class")t.className=i;else if(a==="style"&&typeof i=="string")t.style.cssText=i;else if(a==="html")t.innerHTML=i;else if(a.startsWith("on")&&typeof i=="function"){const s=a.slice(2).toLowerCase();t.addEventListener(s,i)}else t.setAttribute(a,i);for(const a of n.flat(1/0))a!=null&&(typeof a=="string"||typeof a=="number"?t.appendChild(document.createTextNode(String(a))):a instanceof Node&&t.appendChild(a));return t}function K(e){const n=Date.now()-e,t=Math.floor(n/6e4);return t<1?"just now":t<60?`${t} min ago`:new Date(e).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function M(e){const r=e.trim().split(/\s+/);return r.length===1?r[0][0].toUpperCase():(r[0][0]+r[r.length-1][0]).toUpperCase()}const ve=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
  <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"/>
  <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.124-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"/>
</svg>`,G=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</svg>`,we=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
</svg>`,_e=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
  <polyline points="6 9 12 15 18 9"/>
</svg>`,ke=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
  <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/>
</svg>`,Se=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13" aria-hidden="true">
  <polyline points="1 4 1 10 7 10"/>
  <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
</svg>`;function Ae(e,r,n){const t=d("span",{class:"launcher__icon launcher__icon--chat",html:ve}),a=d("span",{class:"launcher__icon launcher__icon--close",html:G}),i=d("span",{class:"launcher__badge","aria-label":"unread messages",role:"status"});i.setAttribute("hidden","");const s=d("button",{class:"launcher",type:"button","aria-label":`Open chat with ${n.botName}`,"aria-expanded":"false","aria-haspopup":"dialog"},t,a,i),o=()=>r.emit("toggle");s.addEventListener("click",o);function h(l,b){const g=l.isOpen!==(b==null?void 0:b.isOpen),m=l.unreadCount!==(b==null?void 0:b.unreadCount);if(g&&(s.classList.toggle("is-open",l.isOpen),s.setAttribute("aria-expanded",String(l.isOpen)),s.setAttribute("aria-label",l.isOpen?"Close chat":`Open chat with ${n.botName}`)),m||g){const v=l.unreadCount;v>0&&!l.isOpen?(i.textContent=v>99?"99+":String(v),i.removeAttribute("hidden"),i.setAttribute("aria-label",`${v} unread message${v!==1?"s":""}`)):i.setAttribute("hidden","")}}const u=e.subscribe(h);function p(){u(),s.removeEventListener("click",o)}return{el:s,destroy:p}}function Ee(e,r){let n;if(r.avatarUrl){const m=d("img",{class:"header__avatar-img",src:r.avatarUrl,alt:`${r.botName} avatar`});m.addEventListener("error",()=>{m.replaceWith(t())}),n=m}else n=t();function t(){return d("span",{class:"header__avatar-fallback","aria-hidden":"true"},M(r.botName))}const a=d("span",{class:"header__status-dot",title:"Online","aria-hidden":"true"}),i=d("div",{class:"header__avatar"},n,a),s=d("div",{class:"header__name"},r.botName),o=d("div",{class:"header__subtitle"},"Active now"),h=d("div",{class:"header__info"},s,o),u=d("button",{class:"header__btn",type:"button","aria-label":"Close chat",html:_e}),p=()=>e.emit("close");u.addEventListener("click",p);const l=d("div",{class:"header__actions"},u),b=d("header",{class:"header",role:"banner"},i,h,l);function g(){u.removeEventListener("click",p)}return{el:b,destroy:g}}function V({suggestions:e=[],bus:r,messageId:n=null,ariaLabel:t="Suggested replies"}){const a=d("div",{class:"suggestions",role:"group","aria-label":t});let i=n,s=!1;function o(l){if(a.textContent="",!Array.isArray(l)||l.length===0){a.setAttribute("hidden","");return}a.removeAttribute("hidden"),l.forEach(b=>{const g=d("button",{type:"button",class:"suggestion-chip","aria-label":`Send: ${b}`});g.textContent=b,g.addEventListener("click",()=>{s||(u(!0),r.emit("suggestion-click",{text:b,messageId:i}))}),a.appendChild(g)})}function h({suggestions:l=[],messageId:b=i}={}){i=b,s=!1,o(l)}function u(l){s=!!l,a.classList.toggle("suggestions--disabled",s);for(const b of a.querySelectorAll(".suggestion-chip"))b.disabled=s,b.setAttribute("aria-disabled",String(s))}function p(){a.textContent=""}return o(e),{el:a,update:h,setDisabled:u,destroy:p}}function Ce(e,r,n,t=!0){const a=e.role==="user";let i=null;if(!a)if(r.avatarUrl){const c=document.createElement("img");c.src=r.avatarUrl,c.alt="",i=d("div",{class:"bubble-avatar"},c),c.addEventListener("error",()=>{c.replaceWith(document.createTextNode(M(r.botName)))})}else i=d("div",{class:`bubble-avatar${t?"":" bubble-avatar--hidden"}`,"aria-hidden":"true"},M(r.botName));const s=d("div",{class:`bubble bubble--${a?"user":"assistant"}`});s.textContent=e.content;const o=d("div",{class:"bubble-retry-row","aria-live":"polite"});o.setAttribute("hidden","");const h=d("button",{class:"bubble-retry-btn",type:"button","aria-label":"Retry sending this message",html:`${Se} Retry`});h.addEventListener("click",()=>{n.emit("retry-message",{messageId:e.id,content:e.content})});const u=d("span",{class:"bubble-retry-row__text"},"Failed to send.");o.appendChild(u),o.appendChild(h);const p=d("div",{class:`bubble-meta bubble-meta--${a?"user":"assistant"}`,"aria-label":new Date(e.timestamp).toLocaleTimeString()});p.textContent=K(e.timestamp);let l=null;a||(l=V({suggestions:Array.isArray(e.suggestions)?e.suggestions:[],bus:n,messageId:e.id}));const b=[s];l&&b.push(l.el),b.push(o,p);const g=d("div",{class:"bubble-content"},...b),m=a?[g]:[i,g],v=d("div",{class:`bubble-wrapper bubble-wrapper--${a?"user":"assistant"}`,role:"listitem","data-message-id":e.id},...m);A(e.status);function A(c){s.classList.remove("bubble--sending","bubble--failed"),c==="sending"?(s.classList.add("bubble--sending"),o.setAttribute("hidden","")):c==="failed"?(s.classList.add("bubble--failed"),o.removeAttribute("hidden")):o.setAttribute("hidden","")}function f(c){if(c.content!==e.content&&(s.textContent=c.content,e.content=c.content),c.status!==e.status&&(e.status=c.status,A(c.status)),c.timestamp!==e.timestamp&&(e.timestamp=c.timestamp,p.textContent=K(c.timestamp)),l){const S=Array.isArray(c.suggestions)?c.suggestions:[],y=Array.isArray(e.suggestions)?e.suggestions:[];(S.length!==y.length||S.some(($,N)=>$!==y[N]))&&(e.suggestions=S,l.update({suggestions:S,messageId:e.id}))}}function w(c){i&&i.classList.toggle("bubble-avatar--hidden",!c)}return{el:v,update:f,setAvatarVisible:w}}const Ie=[{delayMs:1500,text:"Thinking…"},{delayMs:5e3,text:"Processing…"},{delayMs:1e4,text:"Almost ready…"}];function ze(e,r){let n;if(r.avatarUrl){n=d("div",{class:"bubble-avatar"});const g=document.createElement("img");g.src=r.avatarUrl,g.alt="",g.addEventListener("error",()=>{g.replaceWith(document.createTextNode(M(r.botName)))}),n.appendChild(g)}else n=d("div",{class:"bubble-avatar","aria-hidden":"true"},M(r.botName));const t=d("div",{class:"typing-dots","aria-hidden":"true"},d("span",{class:"typing-dot"}),d("span",{class:"typing-dot"}),d("span",{class:"typing-dot"})),a=d("span",{class:"typing-label","aria-live":"polite"}),i=d("div",{class:"typing-bubble"},t,a),s=d("div",{class:"typing-indicator",role:"status","aria-label":`${r.botName} is thinking`},n,i);s.setAttribute("hidden","");let o=[];function h(){a.textContent="",a.classList.remove("typing-label--visible"),o=Ie.map(({delayMs:g,text:m})=>setTimeout(()=>{a.textContent=m,a.classList.add("typing-label--visible"),s.setAttribute("aria-label",`${r.botName}: ${m}`)},g))}function u(){o.forEach(clearTimeout),o=[],a.textContent="",a.classList.remove("typing-label--visible"),s.setAttribute("aria-label",`${r.botName} is thinking`)}function p(g,m){g.status!==(m==null?void 0:m.status)&&(g.status==="loading"?(s.removeAttribute("hidden"),h()):(s.setAttribute("hidden",""),u()))}const l=e.subscribe(p);function b(){u(),l()}return{el:s,destroy:b}}function Te(e,r,n){const t=d("div",{class:"sr-only","aria-live":"polite","aria-atomic":"false",role:"log"});let a;if(n.avatarUrl){const c=document.createElement("img");c.src=n.avatarUrl,c.alt="",c.style.cssText="width:100%;height:100%;object-fit:cover;border-radius:50%",a=d("div",{class:"messages-welcome__avatar"},c)}else a=d("div",{class:"messages-welcome__avatar"},M(n.botName));const i=V({suggestions:Array.isArray(n.defaultSuggestions)?n.defaultSuggestions:[],bus:r,messageId:null,ariaLabel:"Quick start options"}),s=d("div",{class:"messages-welcome","aria-hidden":"true"},a,d("p",{class:"messages-welcome__text"},n.welcomeMessage),i.el),{el:o,destroy:h}=ze(e,n),u=d("div",{role:"list","aria-label":"Chat messages"}),p=d("div",{class:"messages-area","aria-label":"Messages",tabindex:"0"},s,u,o,t),l=new Map;let b=!1,g=0;p.addEventListener("scroll",()=>{b=p.scrollHeight-p.scrollTop-p.clientHeight>60},{passive:!0});function m(c=!1){(!b||c)&&requestAnimationFrame(()=>{p.scrollTop=p.scrollHeight})}function v(c){const S=new Set(c.map(y=>y.id));for(const[y,$]of l)S.has(y)||($.el.remove(),l.delete(y));c.forEach((y,$)=>{var B;const N=$===c.length-1||((B=c[$+1])==null?void 0:B.role)!==y.role;if(l.has(y.id)){const{handle:L}=l.get(y.id);L.update(y),L.setAvatarVisible(y.role==="assistant"&&N)}else{const L=y.role==="assistant"&&N,D=Ce(y,n,r,L);u.appendChild(D.el),l.set(y.id,{el:D.el,handle:D}),y.role==="assistant"&&ge(t,`${n.botName}: ${y.content}`)}})}function A(c,S){const y=c.messages!==(S==null?void 0:S.messages),$=c.status!==(S==null?void 0:S.status);if(y){const N=c.messages.length>0;s.setAttribute("aria-hidden",String(N)),s.style.display=N?"none":"",v(c.messages),c.messages.length>g&&(b=!1,m(!0)),g=c.messages.length}$&&c.status==="loading"&&m(),p.setAttribute("aria-busy",String(c.status==="loading"))}const f=e.subscribe(A);A(e.getState(),null);function w(){f(),h(),i.destroy(),l.clear()}return{el:p,scrollToBottom:m,destroy:w}}function $e(e,r,n){const t=document.createElement("textarea");t.className="input-textarea",t.placeholder=`Message ${n.botName}…`,t.setAttribute("aria-label","Type a message"),t.setAttribute("rows","1"),t.setAttribute("maxlength","2000"),t.setAttribute("autocomplete","off"),t.setAttribute("spellcheck","true");const a=d("button",{class:"send-btn",type:"button","aria-label":"Send message",html:we,disabled:""}),i=d("div",{class:"input-wrapper"},t),s=d("div",{class:"input-area",role:"form","aria-label":"Message input"},i,a),o=d("div",{class:"input-container"},s);n.hideAttribution||o.appendChild(d("div",{class:"input-footer"},d("span",{class:"input-footer__text"},"Powered by AI Receptionist")));function h(){t.style.height="auto",t.style.height=`${t.scrollHeight}px`}t.addEventListener("input",()=>{h(),u()});function u(){const f=t.value.trim().length>0;a.disabled=!f||l()}function p(){const f=t.value.trim();!f||l()||(r.emit("send",f),t.value="",t.style.height="auto",a.disabled=!0,t.focus())}a.addEventListener("click",p),t.addEventListener("keydown",f=>{f.key==="Enter"&&!f.shiftKey&&(f.preventDefault(),p())});function l(){return e.getState().status==="loading"}function b(f){t.disabled=f,i.classList.toggle("is-disabled",f),f?a.disabled=!0:u()}function g(f,w){f.status!==(w==null?void 0:w.status)&&b(f.status==="loading")}const m=e.subscribe(g);function v(){requestAnimationFrame(()=>t.focus())}function A(){m()}return{el:o,focus:v,destroy:A}}function Ne(e,r){const n=d("span",{class:"error-banner__icon",html:ke,"aria-hidden":"true"}),t=d("span",{class:"error-banner__text"}),a=d("button",{class:"error-banner__retry",type:"button","aria-label":"Retry"},"Retry"),i=d("button",{class:"error-banner__dismiss",type:"button","aria-label":"Dismiss error",html:G}),s=d("div",{class:"error-banner",role:"alert","aria-live":"assertive"},n,t,a,i);s.setAttribute("hidden",""),a.addEventListener("click",()=>{r.emit("retry-last")}),i.addEventListener("click",()=>{r.emit("dismiss-error")});function o(p,l){p.error!==(l==null?void 0:l.error)&&(p.error?(t.textContent=p.error.message,a.style.display=p.error.retryable?"":"none",s.removeAttribute("hidden")):s.setAttribute("hidden",""))}const h=e.subscribe(o);function u(){h()}return{el:s,destroy:u}}function Le(e,r){var Q,Z;const n=document.createElement("style");n.textContent=[he(r),me(r),xe(),ye()].join(`
`),e.appendChild(n);const t=ie(r.apiKey,r.sessionTtlHours),a=t.load(),i=(Q=a==null?void 0:a.sessionId)!=null?Q:t.createNew(),s=(Z=a==null?void 0:a.messages)!=null?Z:[];r.sessionId=i;const o=ae(ne(i,s));let h=null;o.subscribe(x=>{clearTimeout(h),h=setTimeout(()=>{t.save(x.sessionId,x.messages)},300)});const u=pe(),{el:p}=Ae(o,u,r),{el:l}=Ee(u,r),{el:b,scrollToBottom:g}=Te(o,u,r),{el:m}=Ne(o,u),{el:v,focus:A}=$e(o,u,r),f=document.createElement("div");f.className="widget-window",f.setAttribute("role","dialog"),f.setAttribute("aria-modal","true"),f.setAttribute("aria-label",`Chat with ${r.botName}`),f.setAttribute("aria-hidden","true"),f.appendChild(l),f.appendChild(b),f.appendChild(m),f.appendChild(v),e.appendChild(f),e.appendChild(p);const w=be(f);let c=p;u.on("toggle",()=>{const{isOpen:x}=o.getState();x?y():S()}),u.on("close",()=>{y()}),u.on("send",x=>{N(x)}),u.on("retry-last",()=>{const{messages:x}=o.getState(),k=[...x].reverse().find(_=>_.role==="user"&&_.status==="failed");k&&B(k)}),u.on("retry-message",({messageId:x,content:k})=>{const{messages:_}=o.getState(),z=_.find(O=>O.id===x);z&&B(z)}),u.on("dismiss-error",()=>{o.setState({error:null})}),u.on("suggestion-click",({text:x,messageId:k})=>{k&&o.setState(_=>({messages:_.messages.map(z=>z.id===k?W(E({},z),{suggestions:[]}):z)})),N(x)});function S(){o.setState({isOpen:!0,unreadCount:0}),f.classList.add("is-open"),f.removeAttribute("aria-hidden"),w.activate(null),A(),g(!0),f.setAttribute("aria-label",`Chat with ${r.botName} — dialog`)}function y(){o.setState({isOpen:!1}),f.classList.remove("is-open"),f.setAttribute("aria-hidden","true"),w.deactivate(c)}const $=x=>{x.key==="Escape"&&o.getState().isOpen&&y()};document.addEventListener("keydown",$);async function N(x){if(o.getState().status==="loading")return;const _={id:P(),role:"user",content:x,timestamp:Date.now(),status:"sending"};o.setState(z=>({messages:[...z.messages,_],status:"loading",error:null})),await L(_)}async function B(x){o.setState(k=>({messages:k.messages.map(_=>_.id===x.id?W(E({},_),{status:"sending"}):_),status:"loading",error:null})),await L(x)}async function L(x){o.setState(k=>({messages:k.messages.map(_=>_.id===x.id?W(E({},_),{status:"sent"}):_)}));try{const k=o.getState().messages.filter(H=>H.status!=="failed"),{reply:_,suggestions:z}=await ce(k,r),O={id:P(),role:"assistant",content:_,timestamp:Date.now(),status:"sent",suggestions:z};o.setState(H=>({messages:[...H.messages.map(j=>{var ee;return j.role==="assistant"&&((ee=j.suggestions)!=null&&ee.length)?W(E({},j),{suggestions:[]}):j}),O],status:"idle",error:null})),o.getState().isOpen||o.setState(H=>({unreadCount:H.unreadCount+1}))}catch(k){const _=de(k);o.setState(z=>({messages:z.messages.map(O=>O.id===x.id?W(E({},O),{status:"failed"}):O),status:"error",error:{message:_.message,retryable:_.retryable,failedMessageId:x.id}})),console.error("[AI Widget] API call failed:",k)}}function D(){document.removeEventListener("keydown",$),u.clear(),h&&clearTimeout(h)}return{open:S,close:y,toggle:()=>o.getState().isOpen?y():S(),destroy:D,on:(x,k)=>u.on(x,k),off:(x,k)=>u.off(x,k),getState:()=>E({},o.getState())}}const X="ai-receptionist-widget-host";function Oe(e){if(document.getElementById(X))return console.warn("[AI Widget] Already initialized. Call window.LinorWidget.destroy() first to re-mount."),typeof window!="undefined"&&window.LinorWidget||null;const r=document.createElement("div");r.id=X,r.style.cssText=["position: fixed","z-index: 2147483647","top: 0","left: 0","width: 0","height: 0","overflow: visible","pointer-events: none"].join("; ");const n=r.attachShadow({mode:"closed"});document.body.appendChild(r);const t=Le(n,e),a=t.destroy;return t.destroy=()=>{a(),r.remove(),typeof window!="undefined"&&window.LinorWidget===t&&delete window.LinorWidget},t}const We=typeof document!="undefined"?document.currentScript:null;function J(){const e=I(We);if(!e.apiKey||!e.apiUrl)return;const r=Oe(e);r&&typeof window!="undefined"&&(window.LinorWidget=r)}typeof document!="undefined"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",J,{once:!0}):J())})();
//# sourceMappingURL=widget.js.map
