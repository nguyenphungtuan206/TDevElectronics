/* Settings → Edit pages: nhúng trình chỉnh sửa trang (js/page-edit.js) NGAY TRONG giao diện admin.
   Trang khách được mở trong <iframe src="<trang>.html?pe=1&embed=1"> — chế độ sửa chỉ bật trong khung này. */
(function(){'use strict';
var tabs=document.getElementById('ep-tabs'),fr=document.getElementById('ep-fr');
if(!tabs||!fr)return;
var VI=(function(){try{var s=localStorage.getItem('tdev-lang');if(s==='en'||s==='vi')return s==='vi'}catch(e){}return /^vi/i.test(navigator.language||'')})();
/* [tệp, tên VI, tên EN, nhóm] — bấm nút nào thì chuyển ngay sang trang đó */
var PAGES=[['index.html','Trang chủ','Home','p'],['shop.html','Sản phẩm','Products','p'],['business-buying.html','Mua cho doanh nghiệp','Business buying','p'],['rfq.html','Yêu cầu báo giá','Request a Quote','p'],['about.html','Giới thiệu','About Us','p'],['support.html','Hỗ trợ','Support','p'],['privacy.html','Chính sách bảo mật','Privacy Policy','p'],['terms.html','Điều khoản dịch vụ','Terms of Service','p'],['cat-phones.html','Điện thoại','Phones','c'],['cat-laptops.html','Laptop','Laptops','c'],['cat-audio.html','Âm thanh','Audio','c'],['cat-office-furniture.html','Nội thất văn phòng','Office Furniture','c'],['cat-printers.html','Máy in','Printers','c'],['cat-accessories.html','Phụ kiện','Accessories','c']];
var CFM=VI?'Bạn có thay đổi chưa lưu. Bỏ các thay đổi và chuyển trang?':'You have unsaved changes. Discard them and switch page?';
var dirty=false,cur=null;
var GL={p:VI?'Trang':'Pages',c:VI?'Danh mục':'Categories'},btns={};
['p','c'].forEach(function(g){var row=document.createElement('div'),lb=document.createElement('span');row.className='epg';lb.textContent=GL[g];row.appendChild(lb);
 PAGES.filter(function(x){return x[3]===g}).forEach(function(x){var b=document.createElement('button');b.type='button';b.className='ept-b';b.setAttribute('role','tab');b.textContent=x[VI?1:2];b.addEventListener('click',function(){go(x[0])});btns[x[0]]=b;row.appendChild(b)});tabs.appendChild(row)});
function load(p){cur=p;dirty=false;Object.keys(btns).forEach(function(k){var on=k===p;btns[k].classList.toggle('on',on);btns[k].setAttribute('aria-selected',on)});fr.src=p+'?pe=1&embed=1'}
function valid(p){return PAGES.some(function(x){return x[0]===p})}
function go(p){if(p===cur)return;
 if(dirty){if(!confirm(CFM))return;try{fr.contentWindow.postMessage({tdev:'pe-discard'},'*')}catch(e){}}
 load(p)}
window.addEventListener('message',function(e){if(e.source!==fr.contentWindow||!e.data||e.data.tdev!=='pe-dirty')return;dirty=!!e.data.v});
window.addEventListener('beforeunload',function(e){if(dirty){e.preventDefault();e.returnValue=''}});
var q=new URLSearchParams(location.search).get('epage'),first=valid(q)?q:'index.html';
/* chỉ tải khung khi mục Edit pages sắp được xem (tránh nạp trang nặng mỗi lần mở Settings) */
var box=document.getElementById('edit-pages'),started=false;
function start(){if(started)return;started=true;load(first)}
if(q||location.hash==='#edit-pages'){start();setTimeout(function(){box.scrollIntoView({block:'start'})},120)}
else if('IntersectionObserver' in window){var io=new IntersectionObserver(function(en){if(en.some(function(x){return x.isIntersecting})){io.disconnect();start()}},{rootMargin:'300px'});io.observe(box)}
else start();
})();
