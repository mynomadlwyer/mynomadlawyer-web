export function initNavigation(){
 const nav=document.querySelector('#site-navigation');
 const toggles=[...document.querySelectorAll('.menu-toggle')];
 const setOpen=open=>{nav.classList.toggle('toggled',open);document.body.classList.toggle('mobile-menu-open',open);document.querySelector('#mobile-menu-control-wrapper').classList.toggle('toggled',open);toggles.forEach(t=>t.setAttribute('aria-expanded',String(open)));};
 toggles.forEach(t=>t.addEventListener('click',()=>setOpen(!nav.classList.contains('toggled'))));
 nav.querySelectorAll('a[href]').forEach(a=>{if(a.getAttribute('href')===location.pathname){a.parentElement.classList.add('current-menu-item');a.setAttribute('aria-current','page');}});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav.classList.contains('toggled')){setOpen(false);toggles[0].focus();}});
 matchMedia('(min-width: 1025px)').addEventListener('change',e=>{if(e.matches)setOpen(false);});
 const control=document.querySelector('.gt_current-lang')||document.querySelector('.gt-current-lang');
 const options=document.querySelector('.gt_options');
 if(control&&options){
  const show=open=>{options.style.display=open?'block':'none';options.classList.toggle('gt-open',open);control.setAttribute('aria-expanded',String(open));control.querySelector('.gt_float_switcher-arrow')?.classList.toggle('gt_arrow_rotate',open);};
  control.addEventListener('click',e=>{e.stopPropagation();show(control.getAttribute('aria-expanded')!=='true');});
  control.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();control.click();}if(e.key==='Escape')show(false);});
  document.addEventListener('click',e=>{if(!e.target.closest('.menu-item-gtranslate'))show(false);});
  options.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>show(false)));
 }
}
