/* Hiệu ứng chuyển trang + khối/gạch menu trượt sang trang mới */
(function(){'use strict';
var de=document.documentElement,pg=document.body.getAttribute('data-page')||'';
var nav=document.querySelector('.r1 nav');
function keyOf(n){n=(n||'').replace(/\.html$/,'');if(n==='shop'||n==='product')return 'shop';if(n.indexOf('cat-')===0)return 'cat';if(n==='rfq'||n==='about'||n==='support')return n;return ''}
var links={};
if(nav){nav.querySelectorAll(':scope>a,:scope>.dd>a').forEach(function(a){var dd=a.parentNode.classList.contains('dd');
  var k=dd?'cat':keyOf((a.getAttribute('href')||'').replace(/^.*\//,''));if(k&&!links[k])links[k]=a})}
var ind=null;
if(nav){ind=document.createElement('div');ind.className='nav-ind';ind.setAttribute('aria-hidden','true');ind.innerHTML='<i></i><b></b>';nav.appendChild(ind)}
function mark(k){Object.keys(links).forEach(function(x){var a=links[x],on=x===k;a.classList.toggle('on',on);if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')})}
function place(a,animate){if(!ind)return;if(!a){ind.style.opacity='0';return}
  var r=a.getBoundingClientRect(),n=nav.getBoundingClientRect();
  if(!animate)ind.classList.add('no-tr');
  ind.style.width=r.width+'px';ind.style.height=r.height+'px';
  ind.style.transform='translate('+(r.left-n.left+nav.scrollLeft)+'px,'+(r.top-n.top)+'px)';ind.style.opacity='1';
  if(!animate){void ind.offsetWidth;ind.classList.remove('no-tr')}}
var cur=keyOf(pg);mark(cur);
function sync(){place(links[cur],false)}
sync();window.addEventListener('resize',sync);window.addEventListener('load',sync);
if(document.fonts&&document.fonts.ready)document.fonts.ready.then(sync);
if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches)return;
window.addEventListener('pageshow',function(e){if(e.persisted){de.classList.remove('pfx-out');mark(cur);sync()}});
document.addEventListener('click',function(e){
  if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
  var a=e.target.closest&&e.target.closest('a[href]');if(!a)return;
  var h=a.getAttribute('href');
  if(!h||h.charAt(0)==='#'||a.target==='_blank'||a.hasAttribute('download')||/^(mailto|tel|javascript):/i.test(h))return;
  var u;try{u=new URL(a.href,location.href)}catch(_){return}
  if(u.origin!==location.origin)return;
  if(u.pathname===location.pathname&&u.search===location.search)return;
  e.preventDefault();
  var k=keyOf(u.pathname.split('/').pop()),t=links[k];
  if(t){mark(k);place(t,true)}else{mark('');place(null)}
  de.classList.add('pfx-out');
  setTimeout(function(){location.href=u.href},340);
});
})();
