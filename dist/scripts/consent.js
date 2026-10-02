export function initConsent(){
 const banner=document.querySelector('.cky-consent-container');const modal=document.querySelector('.cky-modal');const overlay=document.querySelector('.cky-overlay');const revisit=document.querySelector('.cky-btn-revisit-wrapper');
 const key='mynomadlawyer-local-consent';let saved;try{saved=JSON.parse(localStorage.getItem(key));}catch{}
 const toggle=modal.querySelector('#ckySwitchanalytics');if(toggle)toggle.checked=!!saved?.analytics;
 const visibility=(el,shown)=>el.classList.toggle('cky-hide',!shown);
 function showBanner(){visibility(banner,!saved);revisit.classList.toggle('cky-revisit-hide',!saved);}
 let lastFocus;
 function open(){lastFocus=document.activeElement;visibility(banner,false);visibility(modal,true);visibility(overlay,true);modal.classList.add('cky-modal-open');document.body.classList.add('consent-open');modal.querySelector('.cky-btn-close').focus();}
 function close(){visibility(modal,false);visibility(overlay,false);modal.classList.remove('cky-modal-open');document.body.classList.remove('consent-open');showBanner();lastFocus?.focus();}
 function save(analytics){saved={necessary:true,analytics,updatedAt:new Date().toISOString()};try{localStorage.setItem(key,JSON.stringify(saved));}catch{}if(toggle)toggle.checked=analytics;close();}
 document.querySelectorAll('[data-cky-tag="settings-button"],.cky-btn-revisit').forEach(x=>x.addEventListener('click',open));
 document.querySelectorAll('[data-cky-tag="reject-button"],[data-cky-tag="detail-reject-button"]').forEach(x=>x.addEventListener('click',()=>save(false)));
 document.querySelectorAll('[data-cky-tag="accept-button"],[data-cky-tag="detail-accept-button"]').forEach(x=>x.addEventListener('click',()=>save(true)));
 modal.querySelector('[data-cky-tag="detail-save-button"]').addEventListener('click',()=>save(!!toggle?.checked));
 modal.querySelector('.cky-btn-close').addEventListener('click',close);overlay.addEventListener('click',close);
 modal.querySelectorAll('.cky-accordion-btn').forEach(btn=>btn.addEventListener('click',()=>{const expanded=btn.getAttribute('aria-expanded')==='true';btn.setAttribute('aria-expanded',String(!expanded));btn.closest('.cky-accordion').classList.toggle('cky-accordion-active',!expanded);}));
 modal.querySelectorAll('.cky-show-desc-btn').forEach(button=>button.addEventListener('click',()=>{const short=modal.querySelector('.cookie-description-short'),long=modal.querySelector('.cookie-description-long');const expand=!short.hidden;short.hidden=expand;long.hidden=!expand;const shown=expand?long:short;shown.querySelector('button')?.focus();}));
 modal.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.preventDefault();close();}
  if(e.key==='Tab'){const focusable=[...modal.querySelectorAll('button,a[href],input')].filter(x=>x.getClientRects().length&&!x.disabled);const first=focusable[0],last=focusable.at(-1);if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}}
 });
 showBanner();
}
