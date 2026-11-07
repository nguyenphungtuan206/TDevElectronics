/* Công cụ chẩn đoán: chỉ chạy khi URL có ?debug=1  (vd: cat-laptops.html?debug=1) */
(function(){
if(!/[?&]debug=1/.test(location.search))return;
var errs=[],log=[];
window.addEventListener('error',function(e){errs.push((e.message||'error')+' @ '+String(e.filename||'').split('/').pop()+':'+(e.lineno||'?'))},true);
window.addEventListener('unhandledrejection',function(e){errs.push('promise: '+(e.reason&&e.reason.message||e.reason))});
function vis(el){return el&&el.style.display!=='none'}
function items(){var s={},o=[];[].forEach.call(document.querySelectorAll('.cat .kx[data-k]'),function(b){var el=b.closest('.gi')||b.closest('.lrow,.kc,tr');if(el&&!s[el.dataset.o||o.length+':'+b.dataset.k]){s[el.dataset.o||o.length+':'+b.dataset.k]=1;o.push(el)}});return o}
function t(name,ok,info){log.push((ok?'✔ ':'✘ ')+name+(info?' — '+info:''))}
function run(){
  try{
    var page=document.body.dataset.page||'?';
    log.push('Trang: '+page+' | '+location.protocol+'//'+(location.host||'(file)'));
    log.push('Trình duyệt: '+navigator.userAgent.replace(/Mozilla\/5.0 /,'').slice(0,90));
    var sc=[].map.call(document.scripts,function(s){return (s.getAttribute('src')||'').replace(/^js\//,'')}).filter(Boolean).join(', ');
    log.push('Scripts: '+sc);
    var tile=document.querySelector('a.tile[href="cat-laptops.html"] small');if(tile)log.push('Ô Laptops ở trang chủ: '+tile.textContent);
    var chips=[].slice.call(document.querySelectorAll('.cat .fl button'));
    if(page.indexOf('cat-')===0){
      t('Có nút lọc (.fl button)',chips.length>1,chips.length+' nút');
      if(chips.length>1){
        var all=items(),n0=all.filter(vis).length;chips[1].click();var n1=items().filter(vis).length;
        t('Bấm nút "'+chips[1].textContent.trim().slice(0,20)+'" làm đổi danh sách',n1!==n0||n0===0,n0+' → '+n1+' sản phẩm');
        t('Nút được đánh dấu "on"',chips[1].classList.contains('on'));
        chips[0].click();t('Bấm "All" trả lại đủ sản phẩm',items().filter(vis).length===n0);
      }
    }
    if(page==='product'){
      var tabs=[].slice.call(document.querySelectorAll('#product .tabs a')),rel=document.getElementById('rel');
      t('Có 4 tab',tabs.length===4,tabs.length+' tab');
      if(tabs.length>2){
        tabs[2].click();
        var shown=[].filter.call(document.querySelectorAll('#product .g2 > .cd'),function(c){return c.style.display!=='none'}).map(function(c){return (c.querySelector('h3')||{}).textContent});
        t('Bấm tab Reviews hiện "Customer reviews"',shown.indexOf('Customer reviews')>-1||shown.indexOf('Đánh giá của khách hàng')>-1,'đang hiện: '+shown.join(' / '));
        t('Mục "You might also like" bị ẩn',rel&&rel.style.display==='none');
        t('Có form/nút đăng nhập để đánh giá',!!document.querySelector('.rvf'));
        tabs[0].click();
      }
    }
  }catch(e){errs.push('self-test: '+e.message)}
  show();
}
function show(){
  var d=document.createElement('div');
  d.style.cssText='position:fixed;left:10px;bottom:10px;z-index:99999;max-width:min(560px,92vw);max-height:60vh;overflow:auto;background:#fff;color:#111;border:3px solid '+(errs.length||/✘/.test(log.join())?'#d00':'#0a0')+';border-radius:10px;padding:10px 12px;font:12px/1.5 monospace;white-space:pre-wrap;box-shadow:0 8px 30px rgba(0,0,0,.4)';
  d.textContent='TDev debug (chụp ảnh khung này gửi lại)\n'+log.join('\n')+'\nLỗi JS: '+(errs.length?'\n  '+errs.join('\n  '):'không có');
  var x=document.createElement('button');x.textContent='✕';x.style.cssText='position:absolute;top:2px;right:4px;border:0;background:none;cursor:pointer';x.onclick=function(){d.remove()};d.appendChild(x);
  document.body.appendChild(d);
}
window.addEventListener('load',function(){setTimeout(run,1500)});
})();
