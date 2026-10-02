export function initForms(){
 document.querySelectorAll('[data-local-form]').forEach(form=>{
  const fields=[...form.querySelectorAll('input,select,textarea')];
  function validate(field){
   const id=field.id+'-error';let error=form.querySelector('#'+id);const valid=field.checkValidity();
   const descriptions=new Set((field.getAttribute('aria-describedby')||'').split(/\s+/).filter(Boolean));
   if(!valid){if(!error){error=document.createElement('em');error.id=id;error.className='wpforms-error';field.closest('.wpforms-field').append(error);}error.textContent=field.validity.valueMissing?'This field is required.':'Please enter a valid email address.';field.setAttribute('aria-invalid','true');field.classList.add('wpforms-error');descriptions.add(id);}
   else{error?.remove();field.removeAttribute('aria-invalid');field.classList.remove('wpforms-error');descriptions.delete(id);}
   if(descriptions.size)field.setAttribute('aria-describedby',[...descriptions].join(' '));else field.removeAttribute('aria-describedby');return valid;
  }
  fields.forEach(f=>{f.addEventListener('input',()=>{if(f.hasAttribute('aria-invalid'))validate(f);});f.addEventListener('change',()=>{if(f.hasAttribute('aria-invalid'))validate(f);});});
  form.addEventListener('submit',e=>{
   e.preventDefault();const invalid=fields.filter(f=>!validate(f));const status=form.querySelector('.local-form-status');
   if(invalid.length){status.hidden=true;invalid[0].focus();return;}
   status.textContent='Formulario validado. Esta réplica funciona en local: no se ha enviado ni guardado tu consulta.';status.hidden=false;status.setAttribute('tabindex','-1');status.focus();
  });
 });
}
