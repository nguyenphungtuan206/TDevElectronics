/* Banner trang chủ (slider): dữ liệu tuỳ chỉnh lưu ở localStorage 'tdev-hero' (admin sửa ở Cài đặt → Homepage banner).
   Chưa có dữ liệu -> giữ nguyên 5 slide mặc định trong index.html.
   Sau đó: bấm vào banner để chuyển slide, tự chạy mỗi 6s, có nút, chấm, vuốt, phím mũi tên */
(function(){
'use strict';
const KEY='tdev-hero',PRE=['laptop','phone','headphones','airpods','hub','printer','chair'],MAX=10;
const IMGRE=/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/,LINKRE=/^(?!\s*(javascript|data|vbscript):)[^\s"'<>\\]{1,300}$/i;
const NOTE='Genuine products · Expert support · Business-ready pricing';
const mk=(pill,title,text,b1t,b1l,b2t,b2l,i1,i2,ct,cs,th)=>({pill,title,text,b1t,b1l,b2t,b2l,note:NOTE,bg:'',i1,i2,ct,cs,th});
const DEF=[
 mk('A little upgrade. A lot of possibility.','Great tech.\nGood things ahead.','Meet the devices that make your everyday better. From one happy upgrade to a whole team’s next chapter.','Find your next upgrade','shop.html','Shop for your business','rfq.html','laptop','headphones','MacBook Air M4','Light on weight. Big on possibility.',1),
 mk('New season. New favorites.','Power in your pocket.\nEvery single day.','Fast, bright and built to keep up with you. Find the phone that fits your life and your budget.','Shop phones','cat-phones.html','Shop for your business','rfq.html','phone','airpods','Galaxy S25','Fast. Bright. Always ready.',2),
 mk('Sound that moves you.','Less noise.\nMore wow.','Save $100 on Sony WH-1000XM5. Your favorite playlist deserves this.','Shop audio','cat-audio.html','Shop for your business','rfq.html','headphones','airpods','Sony WH-1000XM5','Quiet the world. Hear every detail.',3),
 mk('Built for the working day.','Sit well.\nPrint fast. Work better.','Ergonomic furniture and reliable printers that keep your whole office productive.','Shop office furniture','cat-office-furniture.html','Shop for your business','rfq.html','chair','printer','Ergohuman Elite Mesh Chair','Comfort for the whole workday.',4),
 mk('TDev for business','Big ideas need\ngreat tools.','Equip 10 people or 1,000. Get tailored quotes, volume savings and a real person who knows your business.','Request a bulk quote','rfq.html','How business buying works','business-buying.html','hub','laptop','Anker 565 USB-C Hub','One hub. Every device connected.',5)];
const BLANK=Object.assign(mk('','','','Shop now','shop.html','','','laptop','','','',1),{b2t:'',b2l:''});
const str=(v,n)=>typeof v==='string'?v.slice(0,n):'';
const link=v=>{v=str(v,300).trim();return LINKRE.test(v)?v:''};
const pic=v=>typeof v==='string'&&(PRE.includes(v)||IMGRE.test(v))?v:'';
function clean(s){s=s&&typeof s==='object'?s:{};const th=Math.round(+s.th);
 return{pill:str(s.pill,80),title:str(s.title,120),text:str(s.text,300),b1t:str(s.b1t,40),b1l:link(s.b1l),b2t:str(s.b2t,40),b2l:link(s.b2l),note:str(s.note,120),bg:IMGRE.test(s.bg)?s.bg:'',i1:pic(s.i1),i2:pic(s.i2),ct:str(s.ct,60),cs:str(s.cs,80),th:th>=1&&th<=5?th:1}}
function load(){try{const v=JSON.parse(localStorage.getItem(KEY)||'null');if(Array.isArray(v)&&v.length)return v.slice(0,MAX).map(clean)}catch(e){}return null}
const imgUrl=v=>IMGRE.test(v)?v:PRE.includes(v)?'assets/img/'+v+(v==='printer'||v==='chair'?'.svg':'.jpg'):'';
window.TDevHero={KEY,MAX,PRE,DEF,BLANK,sanitize:clean,safeLink:s=>!!link(s),imgUrl,
 custom:()=>!!load(),
 list:()=>(load()||DEF).map(s=>Object.assign({},s)),
 save(a){try{localStorage.setItem(KEY,JSON.stringify(a.slice(0,MAX).map(clean)));return true}catch(e){return false}},
 reset(){try{localStorage.removeItem(KEY)}catch(e){}}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function slideHtml(s,i){
 const ph=(v,sz)=>!v?'':IMGRE.test(v)?`<div class="ph ${sz}" style="background-image:url('${v}')"></div>`:`<div class="ph ${v} ${sz}"></div>`;
 const btn=(t,l,c)=>t&&l?`<a class="${c}" href="${esc(l)}">${esc(t)}${c==='bt'?' <svg class="i "><use href="#i-arrow"/></svg>':''}</a> `:'';
 const cap=s.ct||s.cs?`<div class="cap"><svg class="i "><use href="#i-bolt"/></svg><span><b>${esc(s.ct)}</b>${s.ct&&s.cs?'<br>':''}${esc(s.cs)}</span></div>`:'';
 const hv=s.i1||s.i2||cap?`<div class="hv">${ph(s.i1,'big')}${ph(s.i2,'sm')}${cap}</div>`:'';
 return`<div class="hsl s${s.th}${i?'':' on'}" data-i="${i}"><div class="sbg"${s.bg?` style="--sbg:url('${s.bg}')"`:''}></div><div class="sin${hv?'':' nohv'}"><div class="stx">${s.pill?`<span class="pill w">${esc(s.pill)}</span>`:''}<h1>${esc(s.title).replace(/\r?\n/g,'<br>')}</h1>${s.text?`<p>${esc(s.text)}</p>`:''}${btn(s.b1t,s.b1l,'bt')}${btn(s.b2t,s.b2l,'bw')}${s.note?`<small>${esc(s.note)}</small>`:''}</div>${hv}</div></div>`}
const hero=document.getElementById('hero');if(!hero)return;
const saved=load();
if(saved){
 hero.querySelectorAll('.hsl').forEach(x=>x.remove());
 hero.insertAdjacentHTML('afterbegin',saved.map(slideHtml).join(''));
 const dd=hero.querySelector('.hdots');
 if(dd)dd.innerHTML=saved.map((_,i)=>`<button type="button" class="hdot${i?'':' on'}" data-go="${i}" aria-label="Slide ${i+1}"></button>`).join('');
}
hero.classList.toggle('one',hero.querySelectorAll('.hsl').length<2);
if(!hero.querySelector('.hedit'))hero.insertAdjacentHTML('beforeend','<a class="hedit" href="a-set.html#banner">✎ Edit banner</a>');
const slides=[...hero.querySelectorAll('.hsl')],dots=[...hero.querySelectorAll('.hdot')],bar=hero.querySelector('.hbar i');
const N=slides.length,DELAY=6000;let cur=0,hover=false;
const still=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||document.documentElement.classList.contains('rm');
hero.style.setProperty('--hd',DELAY+'ms');
function restart(){hero.classList.remove('run');void hero.offsetWidth;if(!still())hero.classList.add('run')}
function go(i){
 i=(i+N)%N;if(i===cur){restart();return}
 slides[cur].classList.remove('on');dots[cur].classList.remove('on');
 cur=i;slides[cur].classList.add('on');dots[cur].classList.add('on');
 slides.forEach((s,k)=>s.setAttribute('aria-hidden',k===cur?'false':'true'));
 restart();
}
/* hết thanh tiến trình -> slide kế */
bar.addEventListener('animationend',()=>go(cur+1));
/* bấm vào bất kỳ chỗ nào của banner (trừ link / nút) -> slide kế */
hero.addEventListener('click',e=>{
 if(e.target.closest('a,.hdot'))return;
 if(e.target.closest('.hp')){go(cur-1);return}
 go(cur+1);
});
dots.forEach(d=>d.addEventListener('click',e=>{e.stopPropagation();go(+d.dataset.go)}));
/* tạm dừng khi rê chuột / đang focus */
const pause=v=>hero.classList.toggle('paused',v);
hero.addEventListener('mouseenter',()=>{hover=true;pause(true)});
hero.addEventListener('mouseleave',()=>{hover=false;pause(false)});
/* vuốt trên điện thoại */
let x0=null;
hero.addEventListener('touchstart',e=>{x0=e.touches[0].clientX;pause(true)},{passive:true});
hero.addEventListener('touchend',e=>{
 pause(false);if(x0==null)return;
 const dx=e.changedTouches[0].clientX-x0;x0=null;
 if(Math.abs(dx)>50){e.preventDefault();go(cur+(dx<0?1:-1))}
});
/* bàn phím */
hero.tabIndex=0;
hero.addEventListener('keydown',e=>{
 if(e.key==='ArrowRight'){go(cur+1)}else if(e.key==='ArrowLeft'){go(cur-1)}
});
/* tab ẩn -> dừng */
document.addEventListener('visibilitychange',()=>pause(document.hidden||hover));
go(0);
})();
