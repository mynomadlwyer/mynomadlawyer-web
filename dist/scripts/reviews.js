export function initReviews(){
 document.querySelectorAll('.ti-widget').forEach(widget=>{
  const container=widget.querySelector('.ti-widget-container'),track=widget.querySelector('.ti-reviews-container-wrapper'),items=[...widget.querySelectorAll('.ti-review-item')];
  const next=widget.querySelector('.ti-next'),prev=widget.querySelector('.ti-prev');let index=0,columns=4,paused=false;
  function update(){const width=widget.getBoundingClientRect().width;columns=Math.max(1,Math.min(4,Math.floor(width/300)));container.className='ti-widget-container ti-col-'+columns;index=Math.min(index,Math.max(0,items.length-columns));track.style.setProperty('--review-columns',columns);track.scrollTo({left:index*track.clientWidth/columns,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});prev.style.visibility=index===0?'hidden':'visible';next.style.visibility=index>=items.length-columns?'hidden':'visible';}
  next?.addEventListener('click',()=>{index=Math.min(index+1,items.length-columns);update();});prev?.addEventListener('click',()=>{index=Math.max(0,index-1);update();});
  [next,prev].forEach(b=>b?.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();b.click();}}));
  widget.querySelectorAll('.ti-read-more').forEach((button,i)=>{if(items[i].querySelector('.ti-review-content').textContent.trim().length<180)button.style.visibility='hidden';button.addEventListener('click',()=>{const open=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(open));button.textContent=open?'Hide':'Read more';items[i].classList.toggle('review-expanded',open);});button.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();button.click();}});});
  let touchX;track.addEventListener('touchstart',e=>touchX=e.touches[0].clientX,{passive:true});track.addEventListener('touchend',e=>{const delta=touchX-e.changedTouches[0].clientX;if(Math.abs(delta)>40){index=Math.max(0,Math.min(items.length-columns,index+(delta>0?1:-1)));update();}},{passive:true});
  widget.addEventListener('mouseenter',()=>paused=true);widget.addEventListener('mouseleave',()=>paused=false);widget.addEventListener('focusin',()=>paused=true);widget.addEventListener('focusout',()=>paused=false);
  new ResizeObserver(update).observe(widget);update();
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches)setInterval(()=>{const r=widget.getBoundingClientRect();if(!paused&&!document.hidden&&r.top<innerHeight&&r.bottom>0&&!widget.querySelector('.review-expanded')){index=index>=items.length-columns?0:index+1;update();}},6000);
 });
}
