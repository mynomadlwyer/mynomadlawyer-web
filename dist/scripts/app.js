import {initNavigation} from './navigation.js';
import {initConsent} from './consent.js';
import {initForms} from './forms.js';
import {initReviews} from './reviews.js';
initNavigation();initConsent();initForms();initReviews();
if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
 const observer=new IntersectionObserver(entries=>{for(const entry of entries)if(entry.isIntersecting){entry.target.classList.add('animated',entry.target.dataset.animation);observer.unobserve(entry.target);}}, {threshold:0.15});
 document.querySelectorAll('[data-animation]').forEach(el=>observer.observe(el));
}
