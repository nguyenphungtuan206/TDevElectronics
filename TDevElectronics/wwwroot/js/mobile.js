/* TDev · mobile.js — điều hướng & bố cục cho điện thoại (≤900px).
   Chỉ THÊM phần tử/lớp; không sửa logic của app.js. Desktop không bị ảnh hưởng (CSS ẩn). */
(function(){
'use strict';
var D=document,B=D.body,PAGE=B.getAttribute('data-page')||'',ADM=B.classList.contains('adm');
var mq=window.matchMedia('(max-width:900px)');
var $=function(s,r){return(r||D).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||D).querySelectorAll(s))};

/* ---------- chuỗi giao diện (EN/VI) ---------- */
var T={menu:['Menu','Menu'],close:['Close','Đóng'],home:['Home','Trang chủ'],shop:['Shop','Cửa hàng'],quote:['Quote','Báo giá'],cart:['Cart','Giỏ hàng'],account:['Account','Tài khoản'],
  filters:['Filters','Bộ lọc'],show:['Show results','Xem kết quả'],wish:['Wishlist','Yêu thích'],search:['Search','Tìm kiếm']};
var lang=function(){return(D.documentElement.lang||'en').toLowerCase().indexOf('vi')===0?1:0};
var t=function(k){return T[k][lang()]};

var ICON={
 menu:'<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
 x:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>',
 use:function(id){return '<svg class="i"><use href="#'+id+'"/></svg>'}
};

/* ---------- khoá cuộn + đóng/mở ---------- */
function closeAll(){B.classList.remove('mn-open','mn-fopen');syncAria()}
function syncAria(){var b=$('.mn-burger');if(b)b.setAttribute('aria-expanded',B.classList.contains('mn-open')?'true':'false')}

/* =====================================================================
   1) STOREFRONT: burger + drawer + scrim + thanh tab dưới đáy
   ===================================================================== */
var nav=!ADM&&$('.hd .r1 nav'),r1=!ADM&&$('.hd .r1');
var scrim=D.createElement('div');scrim.className='mn-scrim';scrim.setAttribute('data-notr','');
B.appendChild(scrim);
scrim.addEventListener('click',closeAll);

if(nav&&r1){
  nav.id=nav.id||'mn-nav';
  /* nút burger đứng đầu hàng header */
  var burger=D.createElement('button');burger.type='button';burger.className='mn-burger';burger.setAttribute('data-notr','');
  burger.setAttribute('aria-controls',nav.id);burger.setAttribute('aria-expanded','false');
  burger.innerHTML=ICON.menu;burger.setAttribute('aria-label',t('menu'));
  r1.insertBefore(burger,r1.firstChild);
  /* đầu drawer: logo + nút đóng */
  var hd=D.createElement('div');hd.className='mn-navhd';hd.setAttribute('data-notr','');
  hd.innerHTML='<a class="lg" href="index.html"><b>T</b>TDev</a><button type="button" class="mn-x" aria-label="'+t('close')+'">'+ICON.x+'</button>';
  nav.insertBefore(hd,nav.firstChild);
  /* khối tiện ích (ngôn ngữ · giao diện · yêu thích) — dùng bản sao, vì i18n/app dùng ủy quyền sự kiện */
  var tools=D.createElement('div');tools.className='mn-tools';tools.setAttribute('data-notr','');nav.appendChild(tools);

  var buildTools=function(){
    tools.innerHTML='';
    ['.hd .ico>.lgt','.hd .ico>.cgt','.hd .ico>.tt'].forEach(function(s){
      var el=$(s);if(!el)return;var c=el.cloneNode(true);c.removeAttribute('id');tools.appendChild(c)});
    var wl=$('#wlb');
    if(wl){var a=D.createElement('a');a.className='mn-wl';a.href=wl.getAttribute('href')||'account.html';
      a.setAttribute('data-view','wishlist');a.innerHTML=ICON.use('i-heart')+'<span>'+t('wish')+'</span>';tools.appendChild(a)}
  };
  var open=function(){buildTools();B.classList.add('mn-open');syncAria()};
  burger.addEventListener('click',function(){B.classList.contains('mn-open')?closeAll():open()});
  $('.mn-x',hd).addEventListener('click',closeAll);
  /* bấm vào liên kết trong drawer -> đóng (trang sẽ chuyển) */
  nav.addEventListener('click',function(e){if(e.target.closest('a[href]'))closeAll()});
  /* khi mở ô tìm kiếm, đóng drawer */
  D.addEventListener('click',function(e){if(e.target.closest('.sbtn'))closeAll()},true);
}

/* thanh tab dưới đáy (không dùng cho admin: sidebar admin đã thành tab bar bằng CSS) */
if(!ADM){
  var bar=D.createElement('nav');bar.className='mn-bar';bar.setAttribute('data-notr','');bar.setAttribute('aria-label','Primary');
  var curTab=(function(){
    if(PAGE==='home')return 'home';
    if(PAGE==='shop'||PAGE==='product'||PAGE.indexOf('cat-')===0)return 'shop';
    if(PAGE==='rfq'||PAGE==='quotes'||PAGE==='business-buying')return 'quote';
    if(PAGE==='cart'||PAGE==='checkout')return 'cart';
    if(['account','login','register','settings','admin-login','admin-register'].indexOf(PAGE)>-1)return 'account';
    return '';})();
  var items=[['home','index.html','i-home'],['shop','shop.html','i-grid'],['quote','rfq.html','i-file'],['cart','cart.html','i-cart'],['account','login.html','i-user']];
  bar.innerHTML=items.map(function(i){
    return '<a href="'+i[1]+'" data-tab="'+i[0]+'"'+(i[0]===curTab?' class="on" aria-current="page"':'')+'>'+ICON.use(i[2])+(i[0]==='cart'?'<em data-n="0"></em>':'')+'<span>'+t(i[0])+'</span></a>'}).join('');
  B.appendChild(bar);
  /* tab Tài khoản: đi theo liên kết thật của header (login / account / a-dash) */
  var acc=$('a[data-tab="account"]',bar);
  acc.addEventListener('click',function(e){var h=$('.hd .ico a[aria-label="Account"]');if(h){e.preventDefault();location.href=h.getAttribute('href')}});
  /* huy hiệu giỏ hàng đồng bộ với header */
  var cartEm=$('a[data-tab="cart"] em',bar);
  var syncCart=function(){var src=$('.hd .cb em');var n=src?(src.textContent||'').trim():'';cartEm.textContent=n==='0'?'':n;cartEm.setAttribute('data-n',n||'0')};
  var srcEm=$('.hd .cb em');if(srcEm){syncCart();new MutationObserver(syncCart).observe(srcEm,{childList:true,characterData:true,subtree:true})}
  /* nhãn theo ngôn ngữ */
  D.addEventListener('tdev-lang',function(){
    $$('a[data-tab] span',bar).forEach(function(s){s.textContent=t(s.parentNode.getAttribute('data-tab'))});
    if(burger)burger.setAttribute('aria-label',t('menu'));
    var ft=$('.mn-ftoggle span');if(ft)ft.textContent=t('filters');
    var sb=$('.mn-sheetft .bt');if(sb)sb.firstChild.textContent=t('show');
    var sh=$('.mn-sheethd b');if(sh)sh.textContent=t('filters');
  });
}

/* =====================================================================
   2) BỘ LỌC cửa hàng -> bottom-sheet
   ===================================================================== */
function setupFilters(){
  var aside=$('.lay>aside.fs');if(!aside||aside.classList.contains('mn-sheet'))return;
  aside.classList.add('mn-sheet');
  var h=D.createElement('div');h.className='mn-sheethd';h.setAttribute('data-notr','');
  h.innerHTML='<b>'+t('filters')+'</b><button type="button" class="mn-x" aria-label="'+t('close')+'">'+ICON.x+'</button>';
  aside.insertBefore(h,aside.firstChild);
  var f=D.createElement('div');f.className='mn-sheetft';f.setAttribute('data-notr','');
  f.innerHTML='<button type="button" class="bt">'+t('show')+'</button>';aside.appendChild(f);
  var btn=D.createElement('button');btn.type='button';btn.className='mn-ftoggle';btn.setAttribute('data-notr','');
  btn.innerHTML=ICON.use('i-grid')+'<span>'+t('filters')+'</span><em data-n="0"></em>';
  aside.parentNode.insertBefore(btn,aside);
  var count=function(){var n=$$('input:checked',aside).length,em=$('em',btn);em.textContent=n||'';em.setAttribute('data-n',n)};
  count();aside.addEventListener('change',count);aside.addEventListener('click',function(){setTimeout(count,0)});
  btn.addEventListener('click',function(){B.classList.add('mn-fopen')});
  $('.mn-x',h).addEventListener('click',closeAll);$('.bt',f).addEventListener('click',function(){closeAll();var g=$('.lay>div');if(g)g.scrollIntoView({behavior:'smooth',block:'start'})});
}

/* =====================================================================
   3) BẢNG -> THẺ (≥4 cột). Gắn data-label từ hàng tiêu đề.
   ===================================================================== */
function cardify(root){
  $$('.tw table',root||D).forEach(function(tb){
    var rows=$$('tr',tb);if(!rows.length)return;
    var head=rows[0],ths=$$(':scope>th',head);
    if(!ths.length){var th=$('thead tr',tb);if(th){head=th;ths=$$(':scope>th',head)}}
    if(ths.length<4){tb.classList.remove('mn-card');if(tb.parentNode)tb.parentNode.classList.remove('mn-card');return}
    var labels=ths.map(function(x){return(x.textContent||'').trim()});
    tb.classList.add('mn-card');tb.parentNode.classList.add('mn-card');head.classList.add('mn-h');
    rows.forEach(function(tr){if(tr===head)return;
      $$(':scope>td',tr).forEach(function(td,i){var l=labels[i]||'';if(td.getAttribute('data-label')!==l)td.setAttribute('data-label',l)})});
  });
}
var raf=0;function schedule(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;cardify();wrapSide();if(!ADM)setupFilters()})}
var main=$('main')||B;
/* chỉ lắng nghe thêm/bớt nút (childList) để không tự kích hoạt vòng lặp */
new MutationObserver(schedule).observe(main,{childList:true,subtree:true});
D.addEventListener('tdev-lang',function(){setTimeout(function(){D.querySelectorAll('.tw table.mn-card').forEach(function(tb){tb.classList.add('mn-card')});
  $$('.tw table').forEach(function(tb){var r=$('tr.mn-h',tb);if(!r)return;var labels=$$(':scope>th',r).map(function(x){return(x.textContent||'').trim()});
    $$('tr',tb).forEach(function(tr){if(tr===r)return;$$(':scope>td',tr).forEach(function(td,i){td.setAttribute('data-label',labels[i]||'')})})})},80)});

/* ---------- đồng bộ khi xoay màn hình / đổi kích thước ---------- */
var onMq=function(){if(!mq.matches)closeAll()};
if(mq.addEventListener)mq.addEventListener('change',onMq);else if(mq.addListener)mq.addListener(onMq);
D.addEventListener('keydown',function(e){if(e.key==='Escape')closeAll()});
window.addEventListener('pageshow',closeAll);


/* =====================================================================
   4) Ảnh đại diện: header (thay biểu tượng người dùng) + bọc dải menu tài khoản
   ===================================================================== */
function me(){try{return window.TDEV_ME&&window.TDEV_ME()}catch(e){return null}}
function initials(n){n=String(n||'').trim();if(!n)return'';var p=n.split(/\s+/);return((p[0][0]||'')+(p.length>1?p[p.length-1][0]:'')).toUpperCase()}
/* menu bên của tài khoản: bọc các liên kết vào dải cuộn ngang (app.js dựng lại menu -> bọc lại) */
function wrapSide(){
  $$('.lay3>.side').forEach(function(sd){
    if($(':scope>.mn-sl',sd))return;
    var links=$$(':scope>a',sd);if(!links.length)return;
    var w=D.createElement('div');w.className='mn-sl';sd.appendChild(w);links.forEach(function(l){w.appendChild(l)})
  })
}

/* admin: cuộn thanh tab đáy tới mục đang mở */
if(ADM){var sb=$('.sb');if(sb){var cur=$('a[href="'+PAGE+'.html"]',sb);if(cur){var go=function(){sb.scrollLeft=cur.offsetLeft-(sb.clientWidth-cur.offsetWidth)/2};go();setTimeout(go,400)}}}
schedule();
/* trang dựng nội dung muộn (admin / cửa hàng): quét lại vài lần đầu */
[300,900,1800].forEach(function(ms){setTimeout(schedule,ms)});
})();
