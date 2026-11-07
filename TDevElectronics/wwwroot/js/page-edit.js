/* Chỉnh sửa nội dung trang (chỉ admin) — sửa chữ trực tiếp, đổi ảnh, thêm/sửa/xoá khối nội dung.
   Dữ liệu lưu localStorage 'tdev-pgedit' theo từng trang (cùng cách với banner, ảnh danh mục, sản phẩm...):
   { "<trang>": { t:{<khoá>:{all|vi|en:"chữ"}}, i:{<khoá>:{src,alt}}, b:[{id,h,p,img,cap}] } }
   Khoá của chữ/ảnh = thứ tự trong HTML gốc của trang (quét NGAY khi script chạy, trước app.js/i18n) nên khách và admin cùng khoá.
   Script này phải được nạp ĐẦU TIÊN trong cụm script cuối trang.
   Giao diện chỉnh sửa nằm TRONG khu admin: Settings → Edit pages (a-set.html) nhúng trang qua <iframe src="<trang>.html?pe=1&embed=1">.
   Mở trực tiếp <trang>.html?pe=1 bằng admin sẽ được chuyển về a-set.html#edit-pages, không bật chế độ sửa trên giao diện khách. */
(function(){'use strict';
var LS='tdev-pgedit',body=document.body,page=body.getAttribute('data-page')||'';
var EMB=false;try{EMB=window.self!==window.top&&/[?&]embed=1(&|$)/.test(location.search)}catch(e){EMB=/[?&]embed=1(&|$)/.test(location.search)}
if(EMB)document.documentElement.classList.add('pe-emb');
if(!page||body.classList.contains('adm')||/^(a-|login$|register$|admin-login$|admin-register$|account$|quotes$|settings$|cart$|checkout$|product$|notfound$)/.test(page))return;
var main=document.querySelector('main');if(!main)return;
var sec=main.querySelector('section.pg')||main;
var LANG=(function(){try{var s=localStorage.getItem('tdev-lang');if(s==='en'||s==='vi')return s}catch(e){}return /^vi/i.test(navigator.language||'')?'vi':'en'})();
var VI=LANG==='vi';
var TX={
 edit:['Chỉnh sửa trang','Edit page'],editing:['Đang chỉnh sửa','Editing'],lang:['Tiếng Việt','English'],
 hint:['Bấm vào chữ để sửa trực tiếp. Dùng nút “Đổi ảnh” trên từng ảnh. Thêm khối ảnh/văn bản mới bằng nút bên dưới.','Click any text to edit it. Use “Change image” on each picture. Add new image/text blocks with the button below.'],
 both:['Áp dụng chữ cho cả hai ngôn ngữ','Apply text to both languages'],
 add:['＋ Thêm khối nội dung','＋ Add content block'],save:['Lưu thay đổi','Save changes'],cancel:['Hủy','Cancel'],
 reset:['Khôi phục trang về bản gốc','Reset page to default'],goto:['Chuyển sang trang khác','Go to another page'],
 chImg:['🖼 Đổi ảnh','🖼 Change image'],useOrig:['Dùng ảnh gốc','Use original image'],apply:['Áp dụng','Apply'],
 imgT:['Đổi ảnh','Change image'],blkNew:['Thêm khối nội dung','Add content block'],blkEdit:['Sửa khối nội dung','Edit content block'],
 blkSave:['Lưu khối','Save block'],rmImg:['Bỏ ảnh','Remove image'],
 fH:['Tiêu đề (không bắt buộc)','Heading (optional)'],fP:['Nội dung (không bắt buộc)','Text (optional)'],fCap:['Chú thích ảnh (không bắt buộc)','Image caption (optional)'],
 fAlt:['Mô tả ảnh (alt)','Image description (alt)'],fUrl:['Hoặc dán đường dẫn ảnh (https://… hoặc assets/img/…)','Or paste an image URL (https://… or assets/img/…)'],
 fFile:['Tải ảnh lên (JPG, PNG, WebP)','Upload an image (JPG, PNG, WebP)'],
 eType:['Chỉ nhận ảnh JPG, PNG hoặc WebP.','Please choose a JPG, PNG or WebP image.'],eSize:['Ảnh quá lớn (tối đa 8 MB).','Image too large (max 8 MB).'],
 eRead:['Không đọc được ảnh này.','Could not read this image.'],eUrl:['Đường dẫn ảnh không hợp lệ.','That image URL is not valid.'],
 eEmpty:['Hãy nhập ít nhất tiêu đề, nội dung hoặc ảnh.','Enter at least a heading, text or an image.'],
 eFull:['Bộ nhớ trình duyệt đã đầy. Hãy dùng ảnh nhỏ hơn hoặc ít ảnh hơn.','Browser storage is full. Try smaller or fewer images.'],
 saved:['Đã lưu thay đổi của trang.','Page changes saved.'],resetOk:['Đã khôi phục trang về bản gốc.','Page restored to default.'],
 cfmCancel:['Bỏ các thay đổi chưa lưu?','Discard unsaved changes?'],cfmReset:['Khôi phục toàn bộ trang này về bản gốc? Mọi chỉnh sửa của trang sẽ bị xóa.','Restore this whole page to its original? All edits on this page will be removed.'],
 cfmDel:['Xóa khối này?','Delete this block?'],cfmLeave:['Bạn có thay đổi chưa lưu.','You have unsaved changes.'],
 up:['Chuyển lên','Move up'],down:['Chuyển xuống','Move down'],ed:['Sửa','Edit'],del:['Xóa','Delete'],
 pageL:['Trang','Page']
};
var T=function(k){return TX[k][VI?0:1]};
var PAGES=[['index.html','Trang chủ','Home'],['shop.html','Sản phẩm','Products'],['cat-phones.html','Danh mục: Điện thoại','Category: Phones'],['cat-laptops.html','Danh mục: Laptop','Category: Laptops'],['cat-audio.html','Danh mục: Âm thanh','Category: Audio'],['cat-office-furniture.html','Danh mục: Nội thất văn phòng','Category: Office Furniture'],['cat-printers.html','Danh mục: Máy in','Category: Printers'],['cat-accessories.html','Danh mục: Phụ kiện','Category: Accessories'],['business-buying.html','Mua cho doanh nghiệp','Business buying'],['rfq.html','Yêu cầu báo giá','Request a Quote'],['about.html','Giới thiệu','About Us'],['support.html','Hỗ trợ','Support'],['privacy.html','Chính sách bảo mật','Privacy Policy'],['terms.html','Điều khoản dịch vụ','Terms of Service']];

/* ---------- tiện ích ---------- */
var obj=function(o){return o&&typeof o==='object'&&!Array.isArray(o)?o:{}};
var str=function(s,n){return typeof s==='string'?s.slice(0,n):''};
var clone=function(o){return JSON.parse(JSON.stringify(o))};
var h=function(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
var IMG_RE=[/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/,/^https?:\/\/[^\s"'()<>\\]+$/i,/^assets\/[\w.\/-]+$/];
var okImg=function(u){return typeof u==='string'&&u.length<1500000&&u.indexOf('..')<0&&IMG_RE.some(function(r){return r.test(u)})};
var OK_TAG=/^(B|I|EM|STRONG|BR|U|MARK)$/;
/* chỉ giữ chữ + vài thẻ định dạng không thuộc tính -> an toàn khi gán innerHTML */
function clean(html){var t=document.createElement('template');t.innerHTML=String(html);var out=document.createElement('div');
 (function walk(src,dst){for(var n=src.firstChild;n;n=n.nextSibling){
  if(n.nodeType===3)dst.appendChild(document.createTextNode(n.nodeValue));
  else if(n.nodeType===1){var tg=n.tagName;
   if(OK_TAG.test(tg)){var c=document.createElement(tg.toLowerCase());if(tg!=='BR')walk(n,c);dst.appendChild(c)}
   else if(!/^(SCRIPT|STYLE|IFRAME|OBJECT|EMBED)$/.test(tg))walk(n,dst)}}})(t.content,out);
 return out.innerHTML.slice(0,4000)}
var plain=function(html){var d=document.createElement('div');d.innerHTML=html;return d.textContent};

/* ---------- lưu trữ ---------- */
function loadAll(){try{return obj(JSON.parse(localStorage.getItem(LS)||'{}'))}catch(e){return{}}}
function loadPage(){var d=obj(loadAll()[page]),t={},i={},b=[];
 Object.keys(obj(d.t)).slice(0,500).forEach(function(k){var o=obj(d.t[k]),r={};['all','vi','en'].forEach(function(l){if(typeof o[l]==='string'&&o[l].trim())r[l]=clean(o[l])});if(Object.keys(r).length)t[k]=r});
 Object.keys(obj(d.i)).slice(0,200).forEach(function(k){var o=obj(d.i[k]);if(okImg(o.src))i[k]={src:o.src,alt:str(o.alt,200)}});
 (Array.isArray(d.b)?d.b:[]).slice(0,30).forEach(function(x){x=obj(x);if(!/^[a-z0-9]{4,24}$/.test(x.id||''))return;
  var r={id:x.id,h:str(x.h,200),p:str(x.p,3000),img:okImg(x.img)?x.img:'',cap:str(x.cap,300)};if(r.h||r.p||r.img)b.push(r)});
 return{t:t,i:i,b:b}}
function savePage(pd){var all=loadAll();
 if(!Object.keys(pd.t).length&&!Object.keys(pd.i).length&&!pd.b.length)delete all[page];else all[page]=pd;
 try{localStorage.setItem(LS,JSON.stringify(all));return true}catch(e){return false}}

/* ---------- nhận diện phần tử chữ / ảnh (quét theo thứ tự HTML) ---------- */
var EX_TAG=/^(A|BUTTON|SELECT|TEXTAREA|INPUT|LABEL|SVG|SCRIPT|STYLE|NOSCRIPT|OPTION|CODE|KBD|IFRAME|CANVAS|VIDEO|AUDIO|TH|TD|TR|TABLE|FORM)$/i;
var EX_SEL='#hero,.hs,.pc,.kc,.rail,.rel,.tw,table,form,.fld,.rvl,.rvf,.rvi,.th,.gal,.ci,.sum,.cn,.fl,.chp,.stars,.av,#shop .hx .m,.tabs,.steps,.pgn,nav,[data-notr],[data-k],[contenteditable],.pe-ui,.pe-mdl,.pe-blk,.pe-ov,.hedit,.cimg-edit,.hdots,.hbar,#pc-src,#ts,a,button,label,select,textarea,svg';
var INLINE=/^(B|I|EM|STRONG|BR|U|MARK)$/;
var memo=new Map();
function dynId(el){var a=el.closest('[id]');return !!a&&a!==sec&&a!==main}
function calcText(el){
 if(EX_TAG.test(el.tagName)||el.closest(EX_SEL)||dynId(el))return false;
 var has=false;for(var n=el.firstChild;n;n=n.nextSibling){if(n.nodeType===1){if(!INLINE.test(n.tagName))return false}else if(n.nodeType===3&&n.nodeValue.trim())has=true}
 return has}
function isText(el){if(memo.has(el))return memo.get(el);var r=calcText(el);
 if(r){for(var p=el.parentElement;p&&p!==main;p=p.parentElement){if(isText(p)){r=false;break}}}
 memo.set(el,r);return r}
var IMG_EX='#hero,.hs,.pc,.kc,.rail,.rel,.tw,table,.th,.gal,.ci,.pgn,[data-k],.tile.has-img,.pe-blk,[data-notr],.pe-ui,.pe-mdl,.pe-ov,.hdots,.cn,.fl,svg';
function isImg(el){
 if(el.closest(IMG_EX)||dynId(el))return false;
 if(el.tagName==='IMG')return true;
 if(/^(SCRIPT|STYLE)$/i.test(el.tagName))return false;
 var bi='';try{bi=getComputedStyle(el).backgroundImage}catch(e){}
 return bi.indexOf('url(')>=0}

var TXT=[],IMG=[],ORIG=new Map(),IORIG=new Map(),saved=loadPage(),dynN=0;
function tagText(el,key){el.setAttribute('data-pe-t',key);var it={el:el,key:key};TXT.push(it);var o=saved.t[key];
 if(o){var v=o[LANG]||o.all;if(v)setText(el,v)}return it}
function tagImg(el,key){el.setAttribute('data-pe-i',key);var it={el:el,key:key};IMG.push(it);var o=saved.i[key];if(o)setImg(el,o);return it}
function setText(el,val){if(!ORIG.has(el))ORIG.set(el,{n:[].slice.call(el.childNodes),notr:el.hasAttribute('data-notr')});
 el.setAttribute('data-notr','');el.innerHTML=clean(val)}
function origHtml(el){var o=ORIG.get(el);if(!o)return null;var d=document.createElement('div');o.n.forEach(function(n){d.appendChild(n.cloneNode(true))});return clean(d.innerHTML)}
function setImg(el,o){if(!IORIG.has(el))IORIG.set(el,{src:el.getAttribute('src'),srcset:el.getAttribute('srcset'),alt:el.getAttribute('alt'),style:el.getAttribute('style')});
 if(el.tagName==='IMG'){el.removeAttribute('srcset');el.setAttribute('src',o.src);if(o.alt)el.setAttribute('alt',o.alt)}
 else{/* !important: thắng cả luật ảnh sản phẩm do trang Products chèn (.ph.<mã>!important) */
  [['background-image','url("'+o.src+'")'],['background-size','cover'],['background-position','center'],['background-repeat','no-repeat']].forEach(function(d){el.style.setProperty(d[0],d[1],'important')})}}
function unsetImg(el){var s=IORIG.get(el);if(!s)return;['src','srcset','alt','style'].forEach(function(a){if(s[a]==null)el.removeAttribute(a);else el.setAttribute(a,s[a])});IORIG.delete(el)}

/* quét tĩnh (HTML gốc) — chạy ngay */
(function(){var ti=0,ii=0;main.querySelectorAll('*').forEach(function(el){
 if(isText(el))tagText(el,'t'+(ti++));
 if(isImg(el))tagImg(el,'i'+(ii++))})})();
/* quét động: trang danh mục (cat-*) do JS dựng sau khi tải */
function scanDyn(){var ti=0,ii=0;main.querySelectorAll('*').forEach(function(el){
 var st=el.getAttribute('data-pe-t'),si=el.getAttribute('data-pe-i'),it;
 var t=st?st.charAt(0)==='d':isText(el),im=si?si.charAt(0)==='d':isImg(el);
 if(t){var kt='dt'+(ti++);if(!st){it=tagText(el,kt);if(editing)prepText(it)}}
 if(im){var ki='di'+(ii++);if(!si){it=tagImg(el,ki);if(editing)prepImg(it)}}})}
if(/^cat-/.test(page)){var dt=0,mo=new MutationObserver(function(){if(dt)return;dt=setTimeout(function(){dt=0;memo=new Map();scanDyn();if(saved.b.length&&!main.querySelector('.pe-blk')){renderBlocks(editing?draft.b:saved.b);if(editing)blockBars()}if(editing)placeAll()},140)});
 mo.observe(main,{childList:true,subtree:true});window.addEventListener('load',function(){memo=new Map();scanDyn()})}

/* ---------- khối nội dung thêm mới ---------- */
function renderBlocks(list){main.querySelectorAll('.pe-blk').forEach(function(x){x.remove()});
 list.forEach(function(b){var s=h('section','pe-blk cd');s.setAttribute('data-notr','');s.setAttribute('data-pe-b',b.id);
  var box=h('div','pe-blk-t');if(b.h)box.appendChild(h('h2',null,b.h));if(b.p)box.appendChild(h('p','pe-blk-p',b.p));
  if(box.childNodes.length)s.appendChild(box);
  if(b.img){s.classList.add('has-img');var f=h('figure','pe-blk-f'),im=h('img');im.src=b.img;im.alt=b.cap||b.h||'';im.loading='lazy';f.appendChild(im);if(b.cap)f.appendChild(h('figcaption',null,b.cap));s.appendChild(f)}
  sec.appendChild(s)})}
renderBlocks(saved.b);

/* ---------- đổi ngôn ngữ: nạp lại để chữ đã sửa/bản dịch khớp ngôn ngữ ---------- */
document.addEventListener('tdev-lang',function(){if(editing||Object.keys(saved.t).some(function(k){return saved.t[k].vi||saved.t[k].en}))location.reload()});

/* ================= phần dành cho admin ================= */
var ui,panel,fab,layer,editing=false,dirty=false,draft=null,bothBox,ovs=[],raf=0,toastT=0;
var isAdmin=function(){return body.dataset.role==='admin'};
function toast(m){var t=document.querySelector('.pe-toast');if(!t){t=h('div','pe-toast');t.setAttribute('data-notr','');t.setAttribute('role','status');body.appendChild(t)}
 t.textContent=m;t.classList.add('on');clearTimeout(toastT);toastT=setTimeout(function(){t.classList.remove('on')},3200)}
try{var fl=sessionStorage.getItem('tdev-pe-flash');if(fl){sessionStorage.removeItem('tdev-pe-flash');window.addEventListener('load',function(){toast(fl)})}}catch(e){}
function noPe(){if(EMB)return location.pathname+'?pe=1&embed=1';var u=new URL(location.href);u.searchParams.delete('pe');return u.pathname+(u.search||'')+u.hash}
function mark(){dirty=true;if(EMB)try{parent.postMessage({tdev:'pe-dirty',v:1},'*')}catch(e){}}
function leave(msg){try{if(msg)sessionStorage.setItem('tdev-pe-flash',msg)}catch(e){}dirty=false;if(EMB)try{parent.postMessage({tdev:'pe-dirty',v:0},'*')}catch(e){}location.href=noPe()}

function build(){if(ui||!isAdmin())return;
 if(!EMB){/* giao diện khách: không có nút sửa. Link cũ ?pe=1 -> chuyển vào Settings → Edit pages của admin */
  if(new URLSearchParams(location.search).get('pe')==='1'){var cp=(location.pathname.split('/').pop()||'index.html');location.replace('a-set.html?epage='+encodeURIComponent(cp)+'#edit-pages')}
  return}
 ui=h('div','pe-ui pe-dock');ui.setAttribute('data-notr','');
 fab=h('button','pe-fab',T('edit'));fab.type='button';fab.hidden=true;ui.appendChild(fab);
 panel=h('div','pe-panel');panel.hidden=true;
 var hd=h('div','pe-h');hd.appendChild(h('b',null,T('editing')));hd.appendChild(h('span','pe-lang',T('lang')));panel.appendChild(hd);
 panel.appendChild(h('p','pe-hint',T('hint')));
 var lb=h('label','pe-chk');bothBox=h('input');bothBox.type='checkbox';bothBox.checked=true;lb.appendChild(bothBox);lb.appendChild(h('span',null,T('both')));panel.appendChild(lb);
 var add=h('button','pe-btn',T('add'));add.type='button';add.addEventListener('click',function(){blockModal(null)});panel.appendChild(add);
 /* chọn trang nằm ở khung Edit pages của admin (cửa sổ cha) */
 var row=h('div','pe-row'),sv=h('button','pe-btn p',T('save')),cn=h('button','pe-btn',T('cancel'));sv.type=cn.type='button';
 sv.addEventListener('click',save);cn.addEventListener('click',function(){if(dirty&&!confirm(T('cfmCancel')))return;leave('')});row.appendChild(sv);row.appendChild(cn);panel.appendChild(row);
 var rs=h('button','pe-link',T('reset'));rs.type='button';rs.addEventListener('click',function(){if(!confirm(T('cfmReset')))return;var all=loadAll();delete all[page];try{localStorage.setItem(LS,JSON.stringify(all))}catch(e){}leave(T('resetOk'))});panel.appendChild(rs);
 ui.appendChild(panel);body.appendChild(ui);
 layer=h('div','pe-layer');layer.setAttribute('data-notr','');body.appendChild(layer);
 enter()}
if(isAdmin())build();
new MutationObserver(function(){if(isAdmin())build();else if(ui){ui.remove();layer&&layer.remove();ui=null}}).observe(body,{attributes:true,attributeFilter:['data-role']});

function prepText(it){var el=it.el;it.start=clean(el.innerHTML);el.setAttribute('data-notr','');el.setAttribute('contenteditable','true');el.setAttribute('spellcheck','false')}
function prepImg(it){var b=h('button','pe-ov pe-imgbtn',T('chImg'));b.type='button';b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();imgModal(it)});layer.appendChild(b);ovs.push({el:it.el,btn:b,kind:'img'})}
function enter(){if(editing)return;editing=true;draft=clone(saved);document.documentElement.classList.add('pe-on');
 fab.hidden=true;panel.hidden=false;
 TXT.forEach(prepText);IMG.forEach(prepImg);blockBars();placeAll();window.addEventListener('scroll',sched,{passive:true});window.addEventListener('resize',sched);setInterval(placeAll,500)}

/* chặn thao tác thật (đi link, gửi form, bấm nút) trong vùng nội dung khi đang sửa */
document.addEventListener('click',function(e){if(!editing)return;var t=e.target;if(!t||!t.closest)return;
 if(t.closest('.pe-ui,.pe-mdl,.pe-ov'))return;
 if(EMB&&t.closest('.tt'))return;/* nút sáng/tối vẫn dùng được để xem trước */if(t.closest('[contenteditable]'))return;
 if(t.closest('main')||t.closest('a[href],button')){e.preventDefault();e.stopPropagation()}},true);
document.addEventListener('submit',function(e){if(editing)e.preventDefault()},true);
document.addEventListener('input',function(e){if(editing&&e.target&&e.target.hasAttribute&&e.target.hasAttribute('data-pe-t'))mark()},true);
document.addEventListener('paste',function(e){var t=e.target;if(!editing||!t||!t.closest||!t.closest('[data-pe-t]'))return;e.preventDefault();
 var s=(e.clipboardData||window.clipboardData).getData('text/plain').replace(/\r?\n+/g,' ');document.execCommand('insertText',false,s)},true);
document.addEventListener('keydown',function(e){var t=e.target;if(!editing||!t||!t.closest)return;var el=t.closest('[data-pe-t]');if(!el)return;
 if(e.key==='Enter'){e.preventDefault();if(/^(P|DIV)$/.test(el.tagName))document.execCommand('insertLineBreak')}
 else if(e.key==='Escape')el.blur()},true);
window.addEventListener('message',function(e){if(EMB&&e.source===parent&&e.data&&e.data.tdev==='pe-discard')dirty=false});
window.addEventListener('beforeunload',function(e){if(editing&&dirty){e.preventDefault();e.returnValue=T('cfmLeave')}});

/* ---------- vị trí các nút trên ảnh/khối ---------- */
function sched(){if(raf)return;raf=requestAnimationFrame(function(){raf=0;placeAll()})}
function placeAll(){if(!editing)return;var sx=window.pageXOffset,sy=window.pageYOffset;
 ovs=ovs.filter(function(o){if(!o.el.isConnected){o.btn.remove();return false}return true});
 ovs.forEach(function(o){var r=o.el.getBoundingClientRect(),vis=r.width>=40&&r.height>=28&&getComputedStyle(o.el).visibility!=='hidden';
  o.btn.style.display=vis?'':'none';if(!vis)return;var w=o.btn.offsetWidth||110;
  o.btn.style.left=Math.max(4,r.right+sx-w-10)+'px';o.btn.style.top=(r.top+sy+10)+'px'})}
function blockBars(){ovs=ovs.filter(function(o){if(o.kind==='blk'){o.btn.remove();return false}return true});
 main.querySelectorAll('.pe-blk').forEach(function(s){var id=s.getAttribute('data-pe-b'),bar=h('div','pe-ov pe-blkbar');
  [['ed','✎',function(){blockModal(id)}],['up','▲',function(){moveBlock(id,-1)}],['down','▼',function(){moveBlock(id,1)}],['del','🗑',function(){delBlock(id)}]].forEach(function(a){
   var b=h('button',null,a[1]);b.type='button';b.title=T(a[0]);b.setAttribute('aria-label',T(a[0]));b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();a[2]()});bar.appendChild(b)});
  layer.appendChild(bar);ovs.push({el:s,btn:bar,kind:'blk'})});placeAll()}
function refreshBlocks(){renderBlocks(draft.b);blockBars();mark()}
function moveBlock(id,d){var i=draft.b.findIndex(function(x){return x.id===id}),j=i+d;if(i<0||j<0||j>=draft.b.length)return;var t=draft.b[i];draft.b[i]=draft.b[j];draft.b[j]=t;refreshBlocks()}
function delBlock(id){if(!confirm(T('cfmDel')))return;draft.b=draft.b.filter(function(x){return x.id!==id});refreshBlocks()}

/* ---------- hộp thoại ---------- */
var mdlEl=null;
function closeModal(){if(mdlEl){mdlEl.remove();mdlEl=null}}
function openModal(title,nodes,btns){closeModal();var m=h('div','pe-mdl');m.setAttribute('data-notr','');
 var cd=h('div','cd');cd.setAttribute('role','dialog');cd.setAttribute('aria-modal','true');cd.appendChild(h('h2',null,title));
 var er=h('p','er');er.hidden=true;cd.appendChild(er);nodes.forEach(function(n){cd.appendChild(n)});
 var row=h('div','pe-mrow');btns.forEach(function(b){row.appendChild(b)});cd.appendChild(row);m.appendChild(cd);
 m.addEventListener('mousedown',function(e){if(e.target===m)closeModal()});
 m.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal()});
 body.appendChild(m);mdlEl=m;m.err=function(s){er.textContent=s;er.hidden=!s};var f=cd.querySelector('input,textarea');if(f)f.focus();return m}
function field(label,el){var l=h('label','fld');l.appendChild(h('small',null,label));l.appendChild(el);return l}
function btn(txt,cls,fn){var b=h('button',cls||'pe-btn',txt);b.type='button';b.addEventListener('click',fn);return b}
function shrink(f,cb,max){var r=new FileReader();r.onload=function(){var im=new Image();im.onload=function(){
 var W=Math.min(max||1200,im.width),H=Math.max(1,Math.round(im.height*W/im.width)),c=document.createElement('canvas');c.width=W;c.height=H;
 var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,W,H);x.drawImage(im,0,0,W,H);cb(c.toDataURL('image/jpeg',.82))};
 im.onerror=function(){cb(null)};im.src=r.result};r.onerror=function(){cb(null)};r.readAsDataURL(f)}
/* khung chọn ảnh dùng chung: xem trước + tải lên + dán URL */
function picker(cur,getM){var st={src:cur||''},box=h('div','pe-pick'),pv=h('div','pe-prev'),file=h('input'),url=h('input');
 file.type='file';file.accept='image/jpeg,image/png,image/webp';url.type='text';url.placeholder='https://…  /  assets/img/…';url.autocomplete='off';
 var show=function(){pv.style.backgroundImage=st.src?'url("'+st.src+'")':'';pv.classList.toggle('on',!!st.src)};show();
 file.addEventListener('change',function(){var f=file.files&&file.files[0];if(!f)return;var m=getM();
  if(!/^image\/(jpeg|png|webp)$/.test(f.type)){m&&m.err(T('eType'));return}if(f.size>8e6){m&&m.err(T('eSize'));return}
  shrink(f,function(u){if(!u){m&&m.err(T('eRead'));return}m&&m.err('');st.src=u;url.value='';show()})});
 url.addEventListener('input',function(){var v=url.value.trim(),m=getM();if(!v){m&&m.err('');return}
  if(!okImg(v)){m&&m.err(T('eUrl'));return}m&&m.err('');st.src=v;show()});
 box.appendChild(pv);box.appendChild(field(T('fFile'),file));box.appendChild(field(T('fUrl'),url));
 return{node:box,get:function(){return st.src},clear:function(){st.src='';url.value='';file.value='';show()}}}

function imgModal(it){var cur=(draft.i[it.key]||{}).src||'',isI=it.el.tagName==='IMG',m;
 if(!cur){var s=it.el.getAttribute('src')||it.el.currentSrc||'';if(isI)cur=okImg(s)?s:'';
  else if(!isI){var bi=getComputedStyle(it.el).backgroundImage.match(/url\(["']?([^"')]+)["']?\)/);if(bi&&okImg(bi[1]))cur=bi[1]}}
 var pk=picker(cur,function(){return m}),alt=h('input');alt.type='text';alt.maxLength=200;alt.value=(draft.i[it.key]||{}).alt||it.el.getAttribute('alt')||'';
 var nodes=[pk.node];if(isI)nodes.push(field(T('fAlt'),alt));
 m=openModal(T('imgT'),nodes,[btn(T('apply'),'pe-btn p',function(){var s=pk.get();if(!s||!okImg(s)){m.err(T('eUrl'));return}
   var o={src:s,alt:isI?alt.value.trim().slice(0,200):''};draft.i[it.key]=o;setImg(it.el,o);mark();closeModal();sched()}),
  btn(T('useOrig'),'pe-btn',function(){delete draft.i[it.key];unsetImg(it.el);mark();closeModal();sched()}),
  btn(T('cancel'),'pe-btn',closeModal)])}
function blockModal(id){var b=id?draft.b.find(function(x){return x.id===id}):null,m;
 var hh=h('input'),pp=h('textarea'),cap=h('input');hh.type=cap.type='text';hh.maxLength=200;cap.maxLength=300;pp.rows=4;pp.maxLength=3000;
 hh.value=b?b.h:'';pp.value=b?b.p:'';cap.value=b?b.cap:'';
 var pk=picker(b?b.img:'',function(){return m});
 var nodes=[field(T('fH'),hh),field(T('fP'),pp),pk.node,field(T('fCap'),cap)];
 m=openModal(b?T('blkEdit'):T('blkNew'),nodes,[
  btn(T('blkSave'),'pe-btn p',function(){var o={id:b?b.id:Math.random().toString(36).slice(2,10)+Date.now().toString(36).slice(-4),h:hh.value.trim(),p:pp.value.trim(),img:pk.get(),cap:cap.value.trim()};
   if(o.img&&!okImg(o.img)){m.err(T('eUrl'));return}if(!o.h&&!o.p&&!o.img){m.err(T('eEmpty'));return}
   if(b)draft.b[draft.b.indexOf(b)]=o;else draft.b.push(o);closeModal();refreshBlocks();
   if(!b){var el=main.querySelector('[data-pe-b="'+o.id+'"]');if(el&&el.scrollIntoView)el.scrollIntoView({behavior:'smooth',block:'center'})}}),
  btn(T('rmImg'),'pe-btn',function(){pk.clear()}),btn(T('cancel'),'pe-btn',closeModal)])}

/* ---------- lưu ---------- */
function save(){var both=bothBox.checked;
 TXT.forEach(function(it){var el=it.el;if(!el.hasAttribute('contenteditable'))return;var cur=clean(el.innerHTML);if(cur===it.start)return;
  if(!plain(cur).trim()){el.innerHTML=it.start;return}
  var orig=origHtml(el);if(orig==null)orig=it.start;var o=obj(draft.t[it.key]);
  if(both){if(cur===orig)delete draft.t[it.key];else draft.t[it.key]={all:cur}}
  else{if(cur===orig)delete o[LANG];else o[LANG]=cur;if(Object.keys(o).length)draft.t[it.key]=o;else delete draft.t[it.key]}});
 var pd={t:draft.t,i:draft.i,b:draft.b};
 if(!savePage(pd)){toast(T('eFull'));return}
 leave(T('saved'))}
})();
