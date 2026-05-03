var Te=Object.defineProperty,$e=Object.defineProperties;var Ne=Object.getOwnPropertyDescriptors;var X=Object.getOwnPropertySymbols;var Le=Object.prototype.hasOwnProperty,Oe=Object.prototype.propertyIsEnumerable;var J=(z,E,S)=>E in z?Te(z,E,{enumerable:!0,configurable:!0,writable:!0,value:S}):z[E]=S,A=(z,E)=>{for(var S in E||(E={}))Le.call(E,S)&&J(z,S,E[S]);if(X)for(var S of X(E))Oe.call(E,S)&&J(z,S,E[S]);return z},R=(z,E)=>$e(z,Ne(E));(function(){"use strict";const z={botName:"Assistant",primaryColor:"#6366f1",welcomeMessage:"Hi! How can I help you today?",position:"bottom-right",offsetX:24,offsetY:24,zIndex:2147483647,buttonSize:56,windowWidth:380,windowHeight:580,hideAttribution:!1,avatarUrl:null,apiKey:null,apiUrl:null,sessionTtlHours:24,maxRetries:3,requestTimeoutMs:3e4};function E(t){const r=t.replace("#",""),s=r.length===3?r.split("").map(a=>a+a).join(""):r,e=/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(s);return e?[parseInt(e[1],16),parseInt(e[2],16),parseInt(e[3],16)].join(", "):"99, 102, 241"}function S(t){const r=typeof window!="undefined"&&window.__AI_WIDGET_CONFIG__?window.__AI_WIDGET_CONFIG__:{},s=typeof window!="undefined"&&window.LinorConfig?window.LinorConfig:{},e={};if(t){const i=l=>t.getAttribute(`data-${l}`),o=l=>{const b=parseInt(i(l),10);return isNaN(b)?void 0:b};i("api-key")&&(e.apiKey=i("api-key")),i("api-url")&&(e.apiUrl=i("api-url")),i("bot-name")&&(e.botName=i("bot-name")),i("primary-color")&&(e.primaryColor=i("primary-color")),i("welcome-message")&&(e.welcomeMessage=i("welcome-message")),i("position")&&(e.position=i("position")),i("avatar-url")&&(e.avatarUrl=i("avatar-url")),i("hide-attribution")&&(e.hideAttribution=i("hide-attribution")!=="false");const u=o("offset-x");u!==void 0&&(e.offsetX=u);const d=o("offset-y");d!==void 0&&(e.offsetY=d);const p=o("z-index");p!==void 0&&(e.zIndex=p);const f=o("button-size");f!==void 0&&(e.buttonSize=f);const m=o("window-width");m!==void 0&&(e.windowWidth=m);const x=o("window-height");x!==void 0&&(e.windowHeight=x);const v=o("session-ttl-hours");v!==void 0&&(e.sessionTtlHours=v);const g=o("max-retries");g!==void 0&&(e.maxRetries=g);const _=o("request-timeout-ms");_!==void 0&&(e.requestTimeoutMs=_)}const a=A(A(A(A({},z),r),s),e);return["bottom-right","bottom-left","top-right","top-left"].includes(a.position)||(console.warn(`[AI Widget] Invalid position "${a.position}". Falling back to "bottom-right".`),a.position="bottom-right"),a.primaryRgb=E(a.primaryColor),a.apiKey||console.warn("[AI Widget] Missing api-key. Widget will be disabled. Set data-api-key on the script tag or window.LinorConfig.apiKey."),a.apiUrl||console.warn("[AI Widget] Missing api-url. Widget will be disabled. Set data-api-url on the script tag or window.LinorConfig.apiUrl."),a}function Z(t){let r=A({},t);const s=new Set;return{getState(){return r},setState(e){const a=r,n=typeof e=="function"?e(r):e;r=A(A({},r),n),s.forEach(i=>i(r,a))},subscribe(e){return s.add(e),()=>s.delete(e)}}}function Q(t,r=[]){return{isOpen:!1,messages:r,status:"idle",error:null,sessionId:t,unreadCount:0}}const D={get(t){try{const r=localStorage.getItem(t);return r!==null?JSON.parse(r):null}catch(r){return null}},set(t,r){try{return localStorage.setItem(t,JSON.stringify(r)),!0}catch(s){return!1}},remove(t){try{localStorage.removeItem(t)}catch(r){}},isAvailable(){try{const t="__ai_widget_test__";return localStorage.setItem(t,"1"),localStorage.removeItem(t),!0}catch(t){return!1}}};function U(){return`${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`}function ee(){return`sess_${U()}`}function te(t,r){const s=`ai_widget_session_${t}`,e=r*60*60*1e3;function a(n){return Date.now()-n>e}return{load(){const n=D.get(s);return n?a(n.lastActive)?(D.remove(s),null):{sessionId:n.sessionId,messages:Array.isArray(n.messages)?n.messages:[]}:null},save(n,i){D.set(s,{sessionId:n,messages:i,lastActive:Date.now()})},clear(){D.remove(s)},createNew(){return ee()}}}class H extends Error{constructor(r){super(r),this.name="NetworkError"}}class j extends Error{constructor(r){super(`Request timed out after ${r}ms`),this.name="TimeoutError"}}class M extends Error{constructor(r,s){super(r),this.name="ApiError",this.status=s}}async function re(t,r,s){const e=new AbortController,a=setTimeout(()=>e.abort(),s);try{return await fetch(t,R(A({},r),{signal:e.signal}))}catch(n){throw n.name==="AbortError"?new j(s):new H(n.message||"Network request failed")}finally{clearTimeout(a)}}async function ae(t,r=3,s=600){let e;for(let a=0;a<=r;a++)try{return await t()}catch(n){if(e=n,n instanceof M&&n.status>=400&&n.status<500)throw n;if(a<r){const i=s*Math.pow(2,a),o=Math.random()*200;await new Promise(u=>setTimeout(u,i+o))}}throw e}function ne(t){return t instanceof j?{message:"The request took too long. Please try again.",retryable:!0}:t instanceof H?{message:"No internet connection. Please check your network.",retryable:!0}:t instanceof M?t.status===401||t.status===403?{message:"Authentication failed. Please check your API key.",retryable:!1}:t.status>=500?{message:"Server error. We're working on it — please try again.",retryable:!0}:{message:"Something went wrong. Please try again.",retryable:!0}:{message:"An unexpected error occurred. Please try again.",retryable:!0}}async function se(t,r){const{apiKey:s,apiUrl:e,sessionId:a,maxRetries:n,requestTimeoutMs:i}=r;return ae(async()=>{var f,m,x,v;const u=await re(e,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${s}`,"X-Widget-Session":a||"","X-Widget-Version":"1.0.0"},body:JSON.stringify({messages:t.map(({role:g,content:_})=>({role:g,content:_})),session_id:a})},i);if(!u.ok){let g="";try{const _=await u.json();g=_.error||_.message||JSON.stringify(_)}catch(_){g=await u.text().catch(()=>`HTTP ${u.status}`)}throw new M(g||`HTTP ${u.status}`,u.status)}let d;try{d=await u.json()}catch(g){throw new M("Invalid JSON in API response",200)}const p=(v=(x=(m=(f=d.reply)!=null?f:d.message)!=null?m:d.content)!=null?x:d.text)!=null?v:d.answer;if(typeof p!="string"||p.trim()==="")throw new M("Unrecognised response format from API",200);return p.trim()},n)}function ie(){const t=new Map;return{on(r,s){return t.has(r)||t.set(r,new Set),t.get(r).add(s),()=>this.off(r,s)},off(r,s){var e;(e=t.get(r))==null||e.delete(s)},emit(r,s){var e;(e=t.get(r))==null||e.forEach(a=>{try{a(s)}catch(n){console.error(`[AI Widget] EventBus error in handler for "${r}":`,n)}})},clear(){t.clear()}}}const oe=["button:not([disabled])","textarea:not([disabled])","input:not([disabled])","a[href]",'[tabindex]:not([tabindex="-1"])'].join(", ");function P(t){return Array.from(t.querySelectorAll(oe)).filter(r=>!r.closest("[hidden]")&&r.offsetParent!==null)}function le(t){let r=!1;function s(e){if(!r||e.key!=="Tab")return;const a=P(t);if(a.length===0){e.preventDefault();return}const n=a[0],i=a[a.length-1],o=e.target;e.shiftKey?o===n&&(e.preventDefault(),i.focus()):o===i&&(e.preventDefault(),n.focus())}return{activate(e){r=!0,t.addEventListener("keydown",s);const a=e||P(t)[0];a&&requestAnimationFrame(()=>a.focus())},deactivate(e){r=!1,t.removeEventListener("keydown",s),e&&requestAnimationFrame(()=>e.focus())}}}function de(t,r){t.textContent="",requestAnimationFrame(()=>{requestAnimationFrame(()=>{t.textContent=r})})}function ce(t){return`
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
  `}function ue(t){const r=t.position||"bottom-right",s=r.includes("left"),e=r.includes("top"),a=typeof t.offsetX=="number"?t.offsetX:24,n=typeof t.offsetY=="number"?t.offsetY:24,i=typeof t.buttonSize=="number"?t.buttonSize:56,o=typeof t.windowWidth=="number"?t.windowWidth:380,u=typeof t.windowHeight=="number"?t.windowHeight:580,d=12,p=n+i+d,f=s?"left":"right",m=e?"top":"bottom",x=e?"-14px":"14px",v=`${e?"top":"bottom"} ${s?"left":"right"}`,g=Math.max(i-4,44);return`
    /* ===================================================
       LAUNCHER BUTTON
    =================================================== */

    .launcher {
      position: fixed;
      ${m}: ${n}px;
      ${f}: ${a}px;
      z-index: var(--z-widget);
      width: ${i}px;
      height: ${i}px;
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
      ${m}: ${p}px;
      ${f}: ${a}px;
      z-index: var(--z-widget);
      width: ${o}px;
      height: ${u}px;
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
      transform: scale(0.93) translateY(${x});
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
        height: calc(100dvh - ${g+n+d+16}px);
        max-height: calc(100dvh - ${g+n+d+16}px);
        ${m}: ${g+n+d}px;
        ${f}: 8px;
        ${s?"right: 8px;":"left: 8px;"}
        border-radius: var(--radius-lg) var(--radius-lg) var(--radius-md) var(--radius-md);
        transform-origin: ${e?"top":"bottom"} center;
      }

      .launcher {
        ${m}: ${Math.max(n-10,8)}px;
        ${f}: ${Math.max(a-10,8)}px;
        width: ${g}px;
        height: ${g}px;
      }
    }
  `}function pe(){return`
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
      gap: 4px;
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
  `}function fe(){return`
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
  `}function c(t,r={},...s){const e=document.createElement(t);for(const[a,n]of Object.entries(r))if(n!=null)if(a==="class")e.className=n;else if(a==="style"&&typeof n=="string")e.style.cssText=n;else if(a==="html")e.innerHTML=n;else if(a.startsWith("on")&&typeof n=="function"){const i=a.slice(2).toLowerCase();e.addEventListener(i,n)}else e.setAttribute(a,n);for(const a of s.flat(1/0))a!=null&&(typeof a=="string"||typeof a=="number"?e.appendChild(document.createTextNode(String(a))):a instanceof Node&&e.appendChild(a));return e}function F(t){const s=Date.now()-t,e=Math.floor(s/6e4);return e<1?"just now":e<60?`${e} min ago`:new Date(t).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})}function O(t){const r=t.trim().split(/\s+/);return r.length===1?r[0][0].toUpperCase():(r[0][0]+r[r.length-1][0]).toUpperCase()}const be=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
  <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 00-1.032-.211 50.89 50.89 0 00-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 002.433 3.984L7.28 21.53A.75.75 0 016 21v-4.03a48.527 48.527 0 01-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979z"/>
  <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 001.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.124-2.811-2.664-2.94A49.392 49.392 0 0015.75 7.5z"/>
</svg>`,q=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18" aria-hidden="true">
  <line x1="18" y1="6" x2="6" y2="18"/>
  <line x1="6" y1="6" x2="18" y2="18"/>
</svg>`,ge=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="17" height="17" aria-hidden="true">
  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z"/>
</svg>`,me=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true">
  <polyline points="6 9 12 15 18 9"/>
</svg>`,he=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="15" height="15" aria-hidden="true">
  <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd"/>
</svg>`,xe=`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13" aria-hidden="true">
  <polyline points="1 4 1 10 7 10"/>
  <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
</svg>`;function ve(t,r,s){const e=c("span",{class:"launcher__icon launcher__icon--chat",html:be}),a=c("span",{class:"launcher__icon launcher__icon--close",html:q}),n=c("span",{class:"launcher__badge","aria-label":"unread messages",role:"status"});n.setAttribute("hidden","");const i=c("button",{class:"launcher",type:"button","aria-label":`Open chat with ${s.botName}`,"aria-expanded":"false","aria-haspopup":"dialog"},e,a,n),o=()=>r.emit("toggle");i.addEventListener("click",o);function u(f,m){const x=f.isOpen!==(m==null?void 0:m.isOpen),v=f.unreadCount!==(m==null?void 0:m.unreadCount);if(x&&(i.classList.toggle("is-open",f.isOpen),i.setAttribute("aria-expanded",String(f.isOpen)),i.setAttribute("aria-label",f.isOpen?"Close chat":`Open chat with ${s.botName}`)),v||x){const g=f.unreadCount;g>0&&!f.isOpen?(n.textContent=g>99?"99+":String(g),n.removeAttribute("hidden"),n.setAttribute("aria-label",`${g} unread message${g!==1?"s":""}`)):n.setAttribute("hidden","")}}const d=t.subscribe(u);function p(){d(),i.removeEventListener("click",o)}return{el:i,destroy:p}}function ye(t,r){let s;if(r.avatarUrl){const v=c("img",{class:"header__avatar-img",src:r.avatarUrl,alt:`${r.botName} avatar`});v.addEventListener("error",()=>{v.replaceWith(e())}),s=v}else s=e();function e(){return c("span",{class:"header__avatar-fallback","aria-hidden":"true"},O(r.botName))}const a=c("span",{class:"header__status-dot",title:"Online","aria-hidden":"true"}),n=c("div",{class:"header__avatar"},s,a),i=c("div",{class:"header__name"},r.botName),o=c("div",{class:"header__subtitle"},"Active now"),u=c("div",{class:"header__info"},i,o),d=c("button",{class:"header__btn",type:"button","aria-label":"Close chat",html:me}),p=()=>t.emit("close");d.addEventListener("click",p);const f=c("div",{class:"header__actions"},d),m=c("header",{class:"header",role:"banner"},n,u,f);function x(){d.removeEventListener("click",p)}return{el:m,destroy:x}}function we(t,r,s,e=!0){const a=t.role==="user";let n=null;if(!a)if(r.avatarUrl){const l=document.createElement("img");l.src=r.avatarUrl,l.alt="",n=c("div",{class:"bubble-avatar"},l),l.addEventListener("error",()=>{l.replaceWith(document.createTextNode(O(r.botName)))})}else n=c("div",{class:`bubble-avatar${e?"":" bubble-avatar--hidden"}`,"aria-hidden":"true"},O(r.botName));const i=c("div",{class:`bubble bubble--${a?"user":"assistant"}`});i.textContent=t.content;const o=c("div",{class:"bubble-retry-row","aria-live":"polite"});o.setAttribute("hidden","");const u=c("button",{class:"bubble-retry-btn",type:"button","aria-label":"Retry sending this message",html:`${xe} Retry`});u.addEventListener("click",()=>{s.emit("retry-message",{messageId:t.id,content:t.content})});const d=c("span",{class:"bubble-retry-row__text"},"Failed to send.");o.appendChild(d),o.appendChild(u);const p=c("div",{class:`bubble-meta bubble-meta--${a?"user":"assistant"}`,"aria-label":new Date(t.timestamp).toLocaleTimeString()});p.textContent=F(t.timestamp);const f=c("div",{class:"bubble-content"},i,o,p),m=a?[f]:[n,f],x=c("div",{class:`bubble-wrapper bubble-wrapper--${a?"user":"assistant"}`,role:"listitem","data-message-id":t.id},...m);v(t.status);function v(l){i.classList.remove("bubble--sending","bubble--failed"),l==="sending"?(i.classList.add("bubble--sending"),o.setAttribute("hidden","")):l==="failed"?(i.classList.add("bubble--failed"),o.removeAttribute("hidden")):o.setAttribute("hidden","")}function g(l){l.content!==t.content&&(i.textContent=l.content,t.content=l.content),l.status!==t.status&&(t.status=l.status,v(l.status)),l.timestamp!==t.timestamp&&(t.timestamp=l.timestamp,p.textContent=F(l.timestamp))}function _(l){n&&n.classList.toggle("bubble-avatar--hidden",!l)}return{el:x,update:g,setAvatarVisible:_}}function _e(t,r){let s;if(r.avatarUrl){s=c("div",{class:"bubble-avatar"});const u=document.createElement("img");u.src=r.avatarUrl,u.alt="",u.addEventListener("error",()=>{u.replaceWith(document.createTextNode(O(r.botName)))}),s.appendChild(u)}else s=c("div",{class:"bubble-avatar","aria-hidden":"true"},O(r.botName));const e=c("div",{class:"typing-bubble","aria-hidden":"true"},c("span",{class:"typing-dot"}),c("span",{class:"typing-dot"}),c("span",{class:"typing-dot"})),a=c("div",{class:"typing-indicator",role:"status","aria-label":`${r.botName} is typing`},s,e);a.setAttribute("hidden","");function n(u,d){if(u.status===(d==null?void 0:d.status))return;u.status==="loading"?a.removeAttribute("hidden"):a.setAttribute("hidden","")}const i=t.subscribe(n);function o(){i()}return{el:a,destroy:o}}function ke(t,r,s){const e=c("div",{class:"sr-only","aria-live":"polite","aria-atomic":"false",role:"log"});let a;if(s.avatarUrl){const b=document.createElement("img");b.src=s.avatarUrl,b.alt="",b.style.cssText="width:100%;height:100%;object-fit:cover;border-radius:50%",a=c("div",{class:"messages-welcome__avatar"},b)}else a=c("div",{class:"messages-welcome__avatar"},O(s.botName));const n=c("div",{class:"messages-welcome","aria-hidden":"true"},a,c("p",{class:"messages-welcome__text"},s.welcomeMessage)),{el:i,destroy:o}=_e(t,s),u=c("div",{role:"list","aria-label":"Chat messages"}),d=c("div",{class:"messages-area","aria-label":"Messages",tabindex:"0"},n,u,i,e),p=new Map;let f=!1,m=0;d.addEventListener("scroll",()=>{f=d.scrollHeight-d.scrollTop-d.clientHeight>60},{passive:!0});function x(b=!1){(!f||b)&&requestAnimationFrame(()=>{d.scrollTop=d.scrollHeight})}function v(b){const T=new Set(b.map(y=>y.id));for(const[y,C]of p)T.has(y)||(C.el.remove(),p.delete(y));b.forEach((y,C)=>{var B;const $=C===b.length-1||((B=b[C+1])==null?void 0:B.role)!==y.role;if(p.has(y.id)){const{handle:L}=p.get(y.id);L.update(y),L.setAvatarVisible(y.role==="assistant"&&$)}else{const L=y.role==="assistant"&&$,W=we(y,s,r,L);u.appendChild(W.el),p.set(y.id,{el:W.el,handle:W}),y.role==="assistant"&&de(e,`${s.botName}: ${y.content}`)}})}function g(b,T){const y=b.messages!==(T==null?void 0:T.messages),C=b.status!==(T==null?void 0:T.status);if(y){const $=b.messages.length>0;n.setAttribute("aria-hidden",String($)),n.style.display=$?"none":"",v(b.messages),b.messages.length>m&&(f=!1,x(!0)),m=b.messages.length}C&&b.status==="loading"&&x(),d.setAttribute("aria-busy",String(b.status==="loading"))}const _=t.subscribe(g);g(t.getState(),null);function l(){_(),o(),p.clear()}return{el:d,scrollToBottom:x,destroy:l}}function Ee(t,r,s){const e=document.createElement("textarea");e.className="input-textarea",e.placeholder=`Message ${s.botName}…`,e.setAttribute("aria-label","Type a message"),e.setAttribute("rows","1"),e.setAttribute("maxlength","2000"),e.setAttribute("autocomplete","off"),e.setAttribute("spellcheck","true");const a=c("button",{class:"send-btn",type:"button","aria-label":"Send message",html:ge,disabled:""}),n=c("div",{class:"input-wrapper"},e),i=c("div",{class:"input-area",role:"form","aria-label":"Message input"},n,a),o=c("div",{class:"input-container"},i);s.hideAttribution||o.appendChild(c("div",{class:"input-footer"},c("span",{class:"input-footer__text"},"Powered by AI Receptionist")));function u(){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}e.addEventListener("input",()=>{u(),d()});function d(){const l=e.value.trim().length>0;a.disabled=!l||f()}function p(){const l=e.value.trim();!l||f()||(r.emit("send",l),e.value="",e.style.height="auto",a.disabled=!0,e.focus())}a.addEventListener("click",p),e.addEventListener("keydown",l=>{l.key==="Enter"&&!l.shiftKey&&(l.preventDefault(),p())});function f(){return t.getState().status==="loading"}function m(l){e.disabled=l,n.classList.toggle("is-disabled",l),l?a.disabled=!0:d()}function x(l,b){l.status!==(b==null?void 0:b.status)&&m(l.status==="loading")}const v=t.subscribe(x);function g(){requestAnimationFrame(()=>e.focus())}function _(){v()}return{el:o,focus:g,destroy:_}}function Ae(t,r){const s=c("span",{class:"error-banner__icon",html:he,"aria-hidden":"true"}),e=c("span",{class:"error-banner__text"}),a=c("button",{class:"error-banner__retry",type:"button","aria-label":"Retry"},"Retry"),n=c("button",{class:"error-banner__dismiss",type:"button","aria-label":"Dismiss error",html:q}),i=c("div",{class:"error-banner",role:"alert","aria-live":"assertive"},s,e,a,n);i.setAttribute("hidden",""),a.addEventListener("click",()=>{r.emit("retry-last")}),n.addEventListener("click",()=>{r.emit("dismiss-error")});function o(p,f){p.error!==(f==null?void 0:f.error)&&(p.error?(e.textContent=p.error.message,a.style.display=p.error.retryable?"":"none",i.removeAttribute("hidden")):i.setAttribute("hidden",""))}const u=t.subscribe(o);function d(){u()}return{el:i,destroy:d}}function Se(t,r){var G,V;const s=document.createElement("style");s.textContent=[ce(r),ue(r),pe(),fe()].join(`
`),t.appendChild(s);const e=te(r.apiKey,r.sessionTtlHours),a=e.load(),n=(G=a==null?void 0:a.sessionId)!=null?G:e.createNew(),i=(V=a==null?void 0:a.messages)!=null?V:[];r.sessionId=n;const o=Z(Q(n,i));let u=null;o.subscribe(h=>{clearTimeout(u),u=setTimeout(()=>{e.save(h.sessionId,h.messages)},300)});const d=ie(),{el:p}=ve(o,d,r),{el:f}=ye(d,r),{el:m,scrollToBottom:x}=ke(o,d,r),{el:v}=Ae(o,d),{el:g,focus:_}=Ee(o,d,r),l=document.createElement("div");l.className="widget-window",l.setAttribute("role","dialog"),l.setAttribute("aria-modal","true"),l.setAttribute("aria-label",`Chat with ${r.botName}`),l.setAttribute("aria-hidden","true"),l.appendChild(f),l.appendChild(m),l.appendChild(v),l.appendChild(g),t.appendChild(l),t.appendChild(p);const b=le(l);let T=p;d.on("toggle",()=>{const{isOpen:h}=o.getState();h?C():y()}),d.on("close",()=>{C()}),d.on("send",h=>{B(h)}),d.on("retry-last",()=>{const{messages:h}=o.getState(),k=[...h].reverse().find(w=>w.role==="user"&&w.status==="failed");k&&L(k)}),d.on("retry-message",({messageId:h,content:k})=>{const{messages:w}=o.getState(),N=w.find(I=>I.id===h);N&&L(N)}),d.on("dismiss-error",()=>{o.setState({error:null})});function y(){o.setState({isOpen:!0,unreadCount:0}),l.classList.add("is-open"),l.removeAttribute("aria-hidden"),b.activate(null),_(),x(!0),l.setAttribute("aria-label",`Chat with ${r.botName} — dialog`)}function C(){o.setState({isOpen:!1}),l.classList.remove("is-open"),l.setAttribute("aria-hidden","true"),b.deactivate(T)}const $=h=>{h.key==="Escape"&&o.getState().isOpen&&C()};document.addEventListener("keydown",$);async function B(h){if(o.getState().status==="loading")return;const w={id:U(),role:"user",content:h,timestamp:Date.now(),status:"sending"};o.setState(N=>({messages:[...N.messages,w],status:"loading",error:null})),await W(w)}async function L(h){o.setState(k=>({messages:k.messages.map(w=>w.id===h.id?R(A({},w),{status:"sending"}):w),status:"loading",error:null})),await W(h)}async function W(h){o.setState(k=>({messages:k.messages.map(w=>w.id===h.id?R(A({},w),{status:"sent"}):w)}));try{const k=o.getState().messages.filter(I=>I.status!=="failed"),w=await se(k,r),N={id:U(),role:"assistant",content:w,timestamp:Date.now(),status:"sent"};o.setState(I=>({messages:[...I.messages,N],status:"idle",error:null})),o.getState().isOpen||o.setState(I=>({unreadCount:I.unreadCount+1}))}catch(k){const w=ne(k);o.setState(N=>({messages:N.messages.map(I=>I.id===h.id?R(A({},I),{status:"failed"}):I),status:"error",error:{message:w.message,retryable:w.retryable,failedMessageId:h.id}})),console.error("[AI Widget] API call failed:",k)}}function Ie(){document.removeEventListener("keydown",$),d.clear(),u&&clearTimeout(u)}return{open:y,close:C,toggle:()=>o.getState().isOpen?C():y(),destroy:Ie,on:(h,k)=>d.on(h,k),off:(h,k)=>d.off(h,k),getState:()=>A({},o.getState())}}const K="ai-receptionist-widget-host";function Ce(t){if(document.getElementById(K))return console.warn("[AI Widget] Already initialized. Call window.LinorWidget.destroy() first to re-mount."),typeof window!="undefined"&&window.LinorWidget||null;const r=document.createElement("div");r.id=K,r.style.cssText=["position: fixed","z-index: 2147483647","top: 0","left: 0","width: 0","height: 0","overflow: visible","pointer-events: none"].join("; ");const s=r.attachShadow({mode:"closed"});document.body.appendChild(r);const e=Se(s,t),a=e.destroy;return e.destroy=()=>{a(),r.remove(),typeof window!="undefined"&&window.LinorWidget===e&&delete window.LinorWidget},e}const ze=typeof document!="undefined"?document.currentScript:null;function Y(){const t=S(ze);if(!t.apiKey||!t.apiUrl)return;const r=Ce(t);r&&typeof window!="undefined"&&(window.LinorWidget=r)}typeof document!="undefined"&&(document.readyState==="loading"?document.addEventListener("DOMContentLoaded",Y,{once:!0}):Y())})();
//# sourceMappingURL=widget.js.map
