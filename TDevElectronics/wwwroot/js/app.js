(()=>{
/* Xác thực nằm ở server. Nếu chạy qua server (npm start) -> dùng /api/me; nếu mở file tĩnh -> chế độ demo, KHÔNG có quyền admin. */
const SRVP=/^https?:$/.test(location.protocol)&&typeof fetch==='function'?fetch('/api/me',{credentials:'same-origin',cache:'no-store'}).then(r=>r.ok&&/json/.test(r.headers.get('content-type')||'')?r.json():null).catch(()=>null):Promise.resolve(null);
SRVP.then(boot);
function boot(J){const SRV=!!J;let SU=(J&&J.user)||null;
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const M=n=>'$'+n.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const PAGE = document.body.dataset.page || 'home',U = id => id === 'home' ? 'index.html' : id + '.html',PU = k => '/Product/Detail?sku=' + encodeURIComponent(k),QS = new URLSearchParams(location.search);
const S={get(k,f){try{const v=localStorage.getItem('tdev-'+k);if(v==null)return f;const j=JSON.parse(v),ty=x=>Array.isArray(x)?'a':x===null?'n':typeof x;return(f!==undefined&&f!==null&&ty(j)!==ty(f))?f:j}catch(e){return f}},set(k,v){try{localStorage.setItem('tdev-'+k,JSON.stringify(v))}catch(e){}}};
const esc=s=>s.replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const P={laptop:{n:'MacBook Air M4',b:'Apple',c:'Laptops',p:[[25,999],[10,1049],[1,1099]],s:'13.6-inch · 16GB / 256GB · Sky blue'},headphones:{n:'Sony WH-1000XM5',b:'Sony',c:'Audio',p:[[1,249]],s:'Wireless · Noise cancelling · Black'},hub:{n:'Anker 565 USB-C Hub',b:'Anker',c:'Accessories',p:[[25,69],[1,79]],s:'11-in-1 · 100W pass-through · Gray'},phone:{n:'Galaxy S25',b:'Samsung',c:'Phones',p:[[1,799]],s:'256GB · 5G · Icy blue'},printer:{n:'HP LaserJet Pro M404dn',b:'HP',c:'Printers',p:[[10,229],[1,249]],s:'Mono laser · 38 ppm · Duplex · Ethernet'},chair:{n:'Ergohuman Elite Mesh Chair',b:'Ergohuman',c:'Office Furniture',p:[[10,479],[1,529]],s:'Mesh back · Headrest · 4D armrests'},airpods:{n:'AirPods Pro 2',b:'Apple',c:'Audio',p:[[1,199]],s:'USB-C · Active noise cancellation'}};
const unit=(k,q)=>{const p=P[k];if(!p||!p.p||!p.p.length)return 0;const t=p.p.find(t=>q>=t[0])||p.p[p.p.length-1];return t[1]},base=k=>unit(k,1);

const OM={laptop:['laptop',1,'Everyday'],headphones:['headphones',2,'Over-ear'],hub:['plug',3,'Hub'],phone:['phone',1,'Everyday'],printer:['printer',2,'Office'],chair:['chair',2,'Seating'],airpods:['headphones',1,'Earbuds']};
Object.keys(OM).forEach(k=>Object.assign(P[k],{t:OM[k][1],x:OM[k][2]}));
/* New products: [key,name,brand,category,spec,price,icon,tint,rating,tag]. Add a row here and it shows up on its category page, the shop and its own detail page. */
[['iphone-16','iPhone 16','Apple','Phones','128GB · A18 · Ultramarine',799,'phone',2,'4.8','Everyday'],
['iphone-16-pro','iPhone 16 Pro','Apple','Phones','256GB · Titanium · 48MP camera',999,'phone',1,'4.9','Camera'],
['pixel-9','Pixel 9','Google','Phones','128GB · Tensor G4 · Peony',699,'phone',3,'4.7','Everyday'],
['pixel-9a','Pixel 9a','Google','Phones','128GB · 7 years of updates',499,'phone',2,'4.6','Value'],
['galaxy-a56','Galaxy A56','Samsung','Phones','128GB · 5G · Two-day battery',449,'phone',1,'4.6','Value'],
['galaxy-s25-ultra','Galaxy S25 Ultra','Samsung','Phones','512GB · S Pen · 200MP camera',1299,'phone',3,'4.9','Camera'],
['galaxy-z-fold6','Galaxy Z Fold6','Samsung','Phones','Folds open to 7.6 inches · 256GB',1799,'phone',2,'4.6','Foldable'],
['macbook-pro-14','MacBook Pro 14 M4','Apple','Laptops','14.2-inch · 16GB / 512GB · Space black',1599,'laptop',2,'4.9','Creators'],
['dell-xps-13','Dell XPS 13','Dell','Laptops','13.4-inch · 16GB / 512GB · Platinum',1199,'laptop',1,'4.6','Everyday'],
['latitude-7450','Dell Latitude 7450','Dell','Laptops','14-inch · 16GB / 512GB · vPro',1399,'laptop',3,'4.7','Business'],
['thinkpad-x1','ThinkPad X1 Carbon','Lenovo','Laptops','14-inch · 32GB / 1TB · 1.1 kg',1649,'laptop',2,'4.8','Business'],
['galaxy-book4-pro','Galaxy Book4 Pro','Samsung','Laptops','14-inch AMOLED · 16GB / 512GB',1449,'laptop',1,'4.5','Creators'],
['surface-laptop-7','Surface Laptop 7','Microsoft','Laptops','13.8-inch · 16GB / 256GB · Snapdragon',999,'laptop',3,'4.5','Everyday'],
['chromebook-plus','Acer Chromebook Plus','Acer','Laptops','14-inch · 8GB / 128GB · Silver',399,'laptop',1,'4.4','Budget'],
['airpods-max','AirPods Max','Apple','Audio','Spatial audio · USB-C · 20h battery',549,'headphones',2,'4.7','Over-ear'],
['galaxy-buds3-pro','Galaxy Buds3 Pro','Samsung','Audio','ANC · 24-bit audio · Silver',249,'headphones',1,'4.6','Earbuds'],
['wf-1000xm5','Sony WF-1000XM5','Sony','Audio','Noise cancelling · 8h battery',299,'headphones',3,'4.8','Earbuds'],
['pixel-buds-pro-2','Pixel Buds Pro 2','Google','Audio','ANC · Fits small ears · Hazel',229,'headphones',2,'4.5','Earbuds'],
['soundcore-space-one','Soundcore Space One','Anker','Audio','ANC · 40h battery · Midnight',99,'headphones',1,'4.5','Over-ear'],
['srs-xb100','Sony SRS-XB100','Sony','Audio','Waterproof speaker · 16h battery',59,'headphones',3,'4.6','Speaker'],
['flexispot-e7','Flexispot E7 Standing Desk','Flexispot','Office Furniture','Electric sit-stand · 140×70cm · Dual motor',449,'desk',1,'4.8','Desk'],
['hbada-e3','HBADA E3 Ergonomic Chair','HBADA','Office Furniture','Lumbar support · Mesh back · Tilt lock',179,'chair',3,'4.5','Seating'],
['ikea-idasen','IKEA IDÅSEN Standing Desk','IKEA','Office Furniture','Sit/stand · 160×80cm · Memory presets',399,'desk',2,'4.6','Desk'],
['hirsh-cabinet','Hirsh 3-Drawer Cabinet','Hirsh','Office Furniture','Steel · Lockable · A4 files',129,'desk',3,'4.4','Storage'],
['ergotron-lx','Ergotron LX Monitor Arm','Ergotron','Office Furniture','Single arm · Up to 32-inch · Clamp mount',149,'laptop',1,'4.8','Setup'],
['solemate-footrest','Kensington SoleMate Footrest','Kensington','Office Furniture','Adjustable height · Memory foam · Non-slip',59,'chair',2,'4.5','Comfort'],
['meeting-table','Conference Table 6ft','Flash Furniture','Office Furniture','Seats 6–8 · Cable ports · Walnut',349,'desk',3,'4.5','Meeting'],
['brother-mfc-l2750dw','Brother MFC-L2750DW','Brother','Printers','Mono laser · Print, scan, copy, fax · Wi-Fi',299,'printer',1,'4.7','All-in-one'],
['canon-g3770','Canon PIXMA G3770','Canon','Printers','Ink tank · Wi-Fi · Print, scan, copy',219,'printer',3,'4.5','Ink tank'],
['epson-l3250','Epson EcoTank L3250','Epson','Printers','Ink tank · Wi-Fi · 5,760 dpi',199,'printer',2,'4.7','Ink tank'],
['hp-m454dw','HP Color LaserJet M454dw','HP','Printers','Colour laser · 28 ppm · Duplex · Wi-Fi',499,'printer',1,'4.6','Colour laser'],
['brother-hl-l2370dw','Brother HL-L2370DW','Brother','Printers','Compact mono laser · Duplex · Wi-Fi',169,'printer',3,'4.5','Compact'],
['epson-l15150','Epson EcoTank L15150','Epson','Printers','A3 · Ink tank · Duplex · Wi-Fi',749,'printer',2,'4.6','A3'],
['brother-ql-820nwb','Brother QL-820NWB','Brother','Printers','Label printer · Wi-Fi · Auto-cutter',189,'printer',1,'4.8','Labels'],
['power-bank-737','Anker 737 Power Bank','Anker','Accessories','24,000mAh · 140W · Smart display',109,'bolt',1,'4.7','Power'],
['nano-65w','Anker Nano 65W Charger','Anker','Accessories','GaN · 2 USB-C + 1 USB-A',35,'plug',2,'4.8','Power'],
['magsafe-charger','MagSafe Charger','Apple','Accessories','25W · 1m USB-C cable',39,'bolt',3,'4.6','Power'],
['charging-cube','Anker 3-in-1 Cube','Anker','Accessories','Phone, watch and earbuds',99,'plug',1,'4.5','Power'],
['samsung-45w','Samsung 45W Charger','Samsung','Accessories','Super Fast Charging 2.0',39,'plug',2,'4.6','Power'],
['usbc-cable','Belkin USB-C Cable','Belkin','Accessories','240W · 2m · Braided black',25,'plug',3,'4.7','Cable'],
['tb-dock','Dell Thunderbolt Dock','Dell','Accessories','Dual 4K · 130W · 8 ports',299,'laptop',1,'4.5','Hub']
].forEach(a=>{P[a[0]]={n:a[1],b:a[2],c:a[3],s:a[4],p:[[1,a[5]]],i:a[6],t:a[7],r:a[8],x:a[9]}});
const relFor=k=>Object.keys(P).filter(x=>x!==k).sort((a,b)=>(P[b].c===P[k].c)-(P[a].c===P[k].c)).slice(0,4);
const loadCart=()=>{const c=S.get('cart',{}),o={};if(c&&typeof c==='object'&&!Array.isArray(c))Object.keys(c).forEach(k=>{const q=Math.floor(+c[k]);if(q>0)o[k]=Math.min(99,q)});return o};
let cart=loadCart(),wl=S.get('wl',[]),oc=S.get('oc',1048),placed=S.get('on',{}),qc=S.get('qc',2084);
const curUser=()=>SRV?SU:S.get('sess',null);
const flashLast=()=>{const l=toast.last;if(l&&Date.now()-l.t<2500)try{sessionStorage.setItem('flash',l.m)}catch(e){}};
const toast=m=>{toast.last={m,t:Date.now()};const t=$('#ts');t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>t.classList.remove('on'),2200)};
const live=()=>Object.keys(cart).filter(k=>P[k]);
const cnt=()=>live().reduce((a,k)=>a+cart[k],0);
const tot=()=>{const sub=live().reduce((a,k)=>a+unit(k,cart[k])*cart[k],0),ship=sub===0||sub>=500?0:9,tax=Math.round(sub*8)/100;return{sub,ship,tax,total:sub+ship+tax}};
let payM=S.get('pay','card');const fee=()=>payM==='cod'?5:0,due=()=>tot().total+fee();
const saveCart=()=>{S.set('cart',cart);sync()};
function addToCart(k,q=1){const p=P[k];if(!p){toast('This product is no longer available');return false}
 const have=cart[k]||0,nq=Math.min(99,have+Math.max(1,Math.floor(+q)||1));if(nq===have){toast('You already have the maximum quantity in your cart');return false}
 cart[k]=nq;saveCart();return true}
const today=()=>{const d=new Date();return String(d.getDate()).padStart(2,'0')+' '+MO[d.getMonth()]+' '+d.getFullYear()};
function addRow(sel,cells){const tb=$(sel+' table');if(!tb)return;const r=tb.rows[1].cloneNode(true);cells.forEach((h,i)=>r.cells[i].innerHTML=h);if(tb.rows[1])tb.rows[1].classList.remove('hl');tb.rows[1].before(r);r.classList.add('hl')}
function sync(){const n=cnt(),t=tot();$$('.cb em').forEach(e=>e.textContent=n);
 $$('[data-b]').forEach(e=>{const b=e.dataset.b;if(b==='items')e.textContent=`Subtotal · ${n} item${n==1?'':'s'}`;else if(b==='sub3')e.textContent=`Secure checkout · ${n} item${n==1?'':'s'} · ${t.ship?'Delivery '+M(t.ship):'Free delivery'}`;else if(b==='tag'){e.textContent=t.ship?'Add more for free shipping':'Free shipping unlocked';e.style.display=''}else if(b==='sub')e.textContent=M(t.sub);else if(b==='ship')e.textContent=t.ship?M(t.ship):'Free';else if(b==='tax')e.textContent=M(t.tax);else if(b==='total')e.textContent=M(t.total);else if(b==='due')e.textContent=M(due());else if(b==='fee'){e.textContent=M(fee());e.closest('p').style.display=fee()?'':'none'}else if(b==='place')e.textContent=`Place Order · ${M(due())}`});
 const rv=$('#checkout [data-step="3"] table');if(rv)rv.innerHTML='<tr><th>Product</th><th>Quantity</th><th>Price</th></tr>'+live().map(k=>`<tr><td><b>${P[k].n}</b></td><td>${cart[k]}</td><td>${M(unit(k,cart[k])*cart[k])}</td></tr>`).join('');
 renderCart()}
function renderCart(){const w=$('#cart .lay2'),ks=live(),t=tot(),sub=$('#cart h1+p');if(!w)return;
 if(!ks.length){w.innerHTML='<div class="cd empty"><h3>Your cart is empty</h3><p class="m">Find your next upgrade and it will show up here.</p><a class="bt" href="shop.html">Browse products</a></div>';sub.textContent='0 items · Nothing here yet.';return}
 const need=500-t.sub;sub.textContent=`${ks.length} product${ks.length>1?'s':''} · ${cnt()} item${cnt()==1?'':'s'} · Ready for a better everyday.`;
 w.innerHTML=`<div><div class="mint ship"><b>${need>0?`Add ${M(need)} more for free shipping`:'You’ve unlocked free shipping!'}</b><div class="bar"><i style="width:${Math.min(100,t.sub/5)}%"></i></div><small class="m">Free delivery on orders over $500 · Arrives ${ETA}</small></div>${ks.map(k=>`<div class="cd ci"><div class="ph ${k} th2"></div><div class="x"><h3>${P[k].n}</h3><small class="m">${P[k].b.toUpperCase()} · ${P[k].s}</small><br><span class="tg">In stock</span><br><a class="m" data-rm="${k}">Remove</a></div><div class="qty"><a data-qd="-1" data-k="${k}">−</a><b>${cart[k]}</b><a data-qd="1" data-k="${k}">+</a></div><b class="pr">${M(unit(k,cart[k])*cart[k])}</b></div>`).join('')}<div class="hx"><a class="bo" href="shop.html">Continue shopping</a><a class="bo" data-clear>Clear cart</a></div></div><aside class="cd sum"><h3>Order summary</h3>${t.ship?'':'<span class="tg">Free shipping unlocked</span>'}<p class="sl"><span class="m">Subtotal · ${cnt()} items</span><b>${M(t.sub)}</b></p><p class="sl"><span class="m">Shipping</span><b>${t.ship?M(t.ship):'Free'}</b></p><p class="sl"><span class="m">Tax (8%)</span><b>${M(t.tax)}</b></p><hr><p class="sl"><b>Total</b><b class="tot">${M(t.total)}</b></p><a class="bt wd" href="checkout.html">Proceed to Checkout →</a><small class="m">Secure checkout. Manufacturer warranty and a 30-day return window included.</small></aside>`}
function wlSync(){$$('.wc').forEach(e=>e.textContent=wl.length||'');$$('.pc').forEach(c=>{const h=$('.hr',c);if(h)h.classList.toggle('on',wl.includes(c.dataset.k))});const w=$('.wl');if(w)w.lastChild.textContent='Wishlist'+(wl.length?` (${wl.length})`:'')}
/* shop */
const CATS=['Phones','Laptops','Audio','Office Furniture','Printers','Accessories'],BR=['Apple','Samsung','Sony','Anker','Dell','HP'],SORTS=['Recommended','Price: Low to High','Price: High to Low'];
const F={cats:new Set(),brands:new Set(),q:'',sort:0,wl:0};
function shop(){const g=$('#shop .g3');if(!g)return;const ks=Object.keys(P).sort((a,b)=>F.sort?(base(a)-base(b))*(F.sort===1?1:-1):0);
 const cards=$$('.pc',g);cards.sort((a,b)=>ks.indexOf(a.dataset.k)-ks.indexOf(b.dataset.k)).forEach(c=>g.append(c));let n=0;
 cards.forEach(c=>{const p=P[c.dataset.k],ok=(!F.wl||wl.includes(c.dataset.k))&&(!F.cats.size||F.cats.has(p.c))&&(!F.brands.size||F.brands.has(p.b))&&(!F.q||(p.n+p.b+p.c+p.s).toLowerCase().includes(F.q));c.style.display=ok?'':'none';if(ok)n++});
 $('#shop .hx .m').textContent=(F.cats.size||F.brands.size||F.q||F.wl)?`Showing ${n} matching product${n==1?'':'s'}`:`Showing 1–${n} of ${n} products`;
 let e=$('#none');if(!n){if(!e){e=document.createElement('p');e.id='none';e.className='m';e.textContent='No devices match these filters. Try Reset filters.';g.after(e)}}else if(e)e.remove();
 $('#shop .sel').firstChild.textContent='Sort: '+SORTS[F.sort]+' '}
function readBoxes(){F.cats.clear();F.brands.clear();$$('#shop .fs .ck').forEach(l=>{const t=l.textContent.trim().replace(/ \(\d+\)$/,'');if($('input',l).checked){if(CATS.includes(t))F.cats.add(t);if(BR.includes(t))F.brands.add(t)}})}
function setCat(name){$$('#shop .fs .ck').forEach(l=>{const t=l.textContent.trim().replace(/ \(\d+\)$/,'');if(CATS.includes(t))$('input',l).checked=t===name});F.q='';readBoxes();shop()}
function reset(){$$('#shop .fs .ck input').forEach((i,x)=>i.checked=x>=CATS.length+BR.length);F.q='';F.sort=0;F.wl=0;const h=$('#hs');if(h)h.value='';readBoxes();shop()}
/* checkout */
const PAYN={qr:'QR code · scan with your banking or e-wallet app',card:'Card',paypal:'PayPal',apple:'Apple Pay · confirm on your device',google:'Google Pay · confirm on your device',bank:'Bank transfer · invoice emailed after you order',net30:'Net 30 invoice · due 30 days after delivery',bnpl:'4 installments · 0% interest',cod:'Pay on delivery · card or cash to the courier'};
let qrExp=0,qrKey='';
function qrDraw(t){const q=qrcode(0,'M');q.addData(`TDEV|ORDER:TD-1048|AMOUNT:${t.toFixed(2)}|CUR:USD`);q.make();$('#qrbox').innerHTML=q.createSvgTag({cellSize:4,margin:0,scalable:true});$('#qra').textContent=M(t);qrExp=Date.now()+600000;qrKey=String(t);$('.qrb').classList.remove('x');qrTick()}
function qrTick(){const e=$('#qrt');if(!e||!qrExp)return;const r=Math.max(0,Math.round((qrExp-Date.now())/1000));e.textContent=r?`${Math.floor(r/60)}:${String(r%60).padStart(2,'0')}`:'Expired';$('.qrb').classList.toggle('x',!r)}
setInterval(qrTick,1000);
document.addEventListener('click',e=>{if(e.target.closest('#qrr')){const t=due()||0;qrDraw(t);toast('New QR code generated')}});
const NUMD=v=>v.replace(/\D/g,''),brandOf=n=>/^4/.test(n)?'Visa':/^(5[1-5]|2[2-7])/.test(n)?'Mastercard':/^3[47]/.test(n)?'Amex':'';
const luhn=n=>{let s=0,d=false;for(let i=n.length-1;i>=0;i--){let x=+n[i];if(d){x*=2;if(x>9)x-=9}s+=x;d=!d}return n.length>0&&s%10===0};
const fmtNum=v=>{const d=NUMD(v).slice(0,brandOf(NUMD(v))==='Amex'?15:16);return brandOf(d)==='Amex'?[d.slice(0,4),d.slice(4,10),d.slice(10)].filter(Boolean).join(' '):d.replace(/(.{4})/g,'$1 ').trim()};
const fmtExp=v=>{let d=NUMD(v).slice(0,4);if(d.length===1&&+d>1)d='0'+d;return d.length>2?d.slice(0,2)+' / '+d.slice(2):d};
const fErr=(i,m)=>{const f=i.closest('.fld'),e=$('.fe',f);f.classList.toggle('bad',!!m);if(e)e.textContent=m||'';return!m};
const CHK={
 ch:i=>fErr(i,i.value.trim().length<2?'Enter the name on the card.':''),
 cn:i=>{const d=NUMD(i.value),need=brandOf(d)==='Amex'?15:16;return fErr(i,!d?'Enter your card number.':d.length<need?`Card number should have ${need} digits.`:!luhn(d)?'This card number looks incorrect.':'')},
 ce:i=>{const d=NUMD(i.value),mo=+d.slice(0,2),yr=2000+ +d.slice(2,4),n=new Date();return fErr(i,d.length<4?'Use MM / YY.':mo<1||mo>12?'Month must be 01–12.':(yr<n.getFullYear()||(yr===n.getFullYear()&&mo<n.getMonth()+1))?'This card has expired.':'')},
 cc:i=>{const need=brandOf(NUMD($('#cn').value))==='Amex'?4:3;return fErr(i,NUMD(i.value).length<need?`Enter the ${need}-digit security code.`:'')},
 ppm:i=>fErr(i,/^\S+@\S+\.\S+$/.test(i.value.trim())?'':'Enter a valid PayPal email.'),
 n3c:i=>fErr(i,i.value.trim()?'':'Enter your company name.'),
 n3e:i=>fErr(i,/^\S+@\S+\.\S+$/.test(i.value.trim())?'':'Enter a valid email address.')};
const MFIELDS={card:['ch','cn','ce','cc'],paypal:['ppm'],net30:['n3c','n3e']};
function payValidate(){const bad=(MFIELDS[payM]||[]).map(id=>[id,CHK[id]($('#'+id))]).filter(r=>!r[1]);if(bad.length){$('#'+bad[0][0]).focus();toast('Please check the highlighted payment details');return false}return true}
const cardLabel=()=>{const d=NUMD($('#cn').value),b=brandOf(d)||'Card';return `${b} ending ${d.slice(-4)||'····'} · ${$('#ch').value.trim()||'Cardholder'}`};
document.addEventListener('input',e=>{const i=e.target;if(!i.id)return;if(i.id==='cn'){i.value=fmtNum(i.value);const b=brandOf(NUMD(i.value)),t=$('#cbr');t.textContent=b;t.style.display=b?'':'none';if(i.closest('.fld').classList.contains('bad'))CHK.cn(i)}
 else if(i.id==='ce'){i.value=fmtExp(i.value);if(i.closest('.fld').classList.contains('bad'))CHK.ce(i)}
 else if(i.id==='cc'){i.value=NUMD(i.value).slice(0,4);if(i.closest('.fld').classList.contains('bad'))CHK.cc(i)}
 else if(CHK[i.id]&&i.closest('.fld').classList.contains('bad'))CHK[i.id](i)});
document.addEventListener('focusout',e=>{const i=e.target;if(i.id&&CHK[i.id]&&$('#checkout').contains(i))CHK[i.id](i)});
const PSTAT={card:'Paid',paypal:'Paid',apple:'Paid',google:'Paid',qr:'Paid',bank:'Awaiting transfer',net30:'Invoiced · due in 30 days',bnpl:'1 of 4 paid',cod:'Pay on delivery'},PNAME={card:'Card',paypal:'PayPal',apple:'Apple Pay',google:'Google Pay',qr:'QR code',bank:'Bank transfer',net30:'Net 30 invoice',bnpl:'Installments',cod:'Pay on delivery'};
let placing=false;
function placeOrder(btn){placing=true;const old=btn.innerHTML;btn.classList.add('ld');btn.innerHTML='<span class="spn"></span>Processing payment…';
 setTimeout(()=>{const id=++oc,t=due(),m=payM,n=cnt(),tx='TXN-'+id+Math.floor(Math.random()*9000+1000),lab=PSTAT[m],q=Math.floor(t*100/4)/100;
  S.set('oc',oc);placed[id]=t;S.set('on',placed);
  const msg={bank:`Please transfer ${M(t)} within 5 days using reference TD-${id}. We ship as soon as it arrives.`,net30:'Your invoice is due 30 days after delivery.',bnpl:`Your first payment of ${M(q)} was taken. The next 3 follow every 2 weeks.`,cod:`Please have ${M(t)} ready for the courier.`}[m]||'Payment received. We’re preparing your order.';
  {const u=curUser(),h=$('#checkout .conf h2'),sm=$('#checkout .conf small'),em=(($$('#checkout [data-step="1"] .fld input')[2]||{}).value||'').trim()||(u&&u.email)||'';if(u&&h)h.textContent=`Nice choice, ${u.name.split(' ')[0]}. Your order is in!`;if(sm&&em)sm.textContent=`Confirmation and invoice sent to ${em}.`}
  $('[data-b="conf"]').textContent=`TD-${id} · ${M(t)} · ${lab} · Arrives ${ETA}`;$('#cfx').innerHTML=`Transaction <b>${tx}</b> · ${PNAME[m]}<br>${msg}`;
  {const _r=[`<b>TD-${id}</b>`,today(),`${n} items`,M(t),`<span class="tg ${m==='bank'?'a':'b'}">${m==='bank'?'Awaiting payment':'Processing'}</span>`,'View'];addRow('#account',_r);const L=S.get('orows',[]);L.push(_r);S.set('orows',L)}
  {const _t=`<td><b>${tx}</b></td><td>TD-${id}</td><td>${today()}</td><td>${m==='card'?cardLabel().split(' · ')[0].replace('ending','••••'):PNAME[m]}</td><td>${M(t)}</td><td><span class="tg ${/^Paid|paid/.test(lab)?'':'a'}">${lab}</span></td>`;const tb=$('#txt');if(tb)tb.insertRow(1).innerHTML=_t;const L=S.get('trows',[]);L.push(_t);S.set('trows',L)}
  cart={};saveCart();toast(`Order TD-${id} placed`);btn.classList.remove('ld');btn.innerHTML=old;placing=false;step(4);$('#checkout').scrollIntoView()},1300)}
/* ---------- địa chỉ giao hàng theo quốc gia (mặc định Việt Nam) ---------- */
const CCODES='AF AX AL DZ AS AD AO AI AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BM BT BO BQ BA BW BR BN BG BF BI CV KH CM CA KY CF TD CL CN CO KM CG CD CK CR CI HR CW CY CZ DK DJ DM DO EC EG SV GQ ER EE SZ ET FK FO FJ FI FR GF PF GA GM GE DE GH GI GR GL GD GP GU GT GG GN GW GY HT VA HN HK HU IS IN ID IQ IE IM IL IT JM JP JE JO KZ KE KI KR KW KG LA LV LB LS LR LY LI LT LU MO MG MW MY MV ML MT MH MQ MR MU YT MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NC NZ NI NE NG NU NF MK MP NO OM PK PW PS PA PG PY PE PH PN PL PT PR QA RE RO RU RW BL SH KN LC MF PM VC WS SM ST SA SN RS SC SL SG SX SK SI SB SO ZA SS ES LK SD SR SJ SE CH TW TJ TZ TH TL TG TK TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VE VN VG VI WF EH YE ZM ZW XK'.split(' ');
const VN_P=['Hà Nội','Thành phố Hồ Chí Minh','Hải Phòng','Đà Nẵng','Cần Thơ','Huế','An Giang','Bắc Ninh','Cà Mau','Cao Bằng','Đắk Lắk','Điện Biên','Đồng Nai','Đồng Tháp','Gia Lai','Hà Tĩnh','Hưng Yên','Khánh Hòa','Lai Châu','Lâm Đồng','Lạng Sơn','Lào Cai','Nghệ An','Ninh Bình','Phú Thọ','Quảng Ngãi','Quảng Ninh','Quảng Trị','Sơn La','Tây Ninh','Thái Nguyên','Thanh Hóa','Tuyên Quang','Vĩnh Long'].map(x=>[x,x]);
const US_S=[['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['DC','District of Columbia'],['FL','Florida'],['GA','Georgia'],['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming']];
const CA_P=[['AB','Alberta'],['BC','British Columbia'],['MB','Manitoba'],['NB','New Brunswick'],['NL','Newfoundland and Labrador'],['NS','Nova Scotia'],['NT','Northwest Territories'],['NU','Nunavut'],['ON','Ontario'],['PE','Prince Edward Island'],['QC','Quebec'],['SK','Saskatchewan'],['YT','Yukon']];
const AU_S=[['ACT','Australian Capital Territory'],['NSW','New South Wales'],['NT','Northern Territory'],['QLD','Queensland'],['SA','South Australia'],['TAS','Tasmania'],['VIC','Victoria'],['WA','Western Australia']];
const AG_={l1:{lb:'Street address',ph:'House number and street name',ac:'address-line1',req:1},l2:{lb:'Apartment, suite, unit (optional)',ph:'Apt, suite, building, floor',ac:'address-line2'},w:{lb:'Ward / Commune',ph:'',ac:'address-level3',req:1},d:{lb:'District (if any)',ph:'',ac:'address-level2'},c:{lb:'City',ph:'City / Town',ac:'address-level2',req:1},r:{lb:'State / Province / Region (optional)',ph:'State / Province',ac:'address-level1'},p:{lb:'Postal code (optional)',ph:'Postal code',ac:'postal-code'}};
const AC={VN:{rows:[['l1'],['w','d'],['r','p']],l1:{lb:'Street address (house no., street, alley)',ph:'e.g. 12 Nguyen Hue Street'},w:{ph:'e.g. Ben Nghe Ward'},d:{ph:'Leave blank if your address has no district'},r:{lb:'Province / City',type:'select',opts:VN_P,req:1,ph:'Select province / city'},p:{ph:'6 digits, e.g. 700000',re:/^\d{6}$/}},
 US:{r:{lb:'State',type:'select',opts:US_S,req:1,ph:'Select state'},p:{lb:'ZIP code',ph:'e.g. 94105',req:1,re:/^\d{5}(-\d{4})?$/}},
 CA:{r:{lb:'Province / Territory',type:'select',opts:CA_P,req:1,ph:'Select province'},p:{lb:'Postal code',ph:'A1A 1A1',req:1,re:/^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/}},
 AU:{c:{lb:'Suburb / City'},r:{lb:'State / Territory',type:'select',opts:AU_S,req:1,ph:'Select state'},p:{lb:'Postcode',ph:'e.g. 2000',req:1,re:/^\d{4}$/}},
 GB:{c:{lb:'Town / City'},r:{lb:'County (optional)',ph:'County'},p:{lb:'Postcode',ph:'e.g. SW1A 1AA',req:1,re:/^[A-Za-z]{1,2}\d[A-Za-z\d]? ?\d[A-Za-z]{2}$/}},
 JP:{r:{lb:'Prefecture',ph:'e.g. Tokyo',req:1},c:{lb:'City / Ward'},p:{ph:'123-4567',req:1,re:/^\d{3}-?\d{4}$/}},
 NL:{p:{lb:'Postal code',ph:'1234 AB',req:1,re:/^\d{4} ?[A-Za-z]{2}$/}},BR:{r:{lb:'State',ph:'e.g. SP',req:1},p:{lb:'Postal code (CEP)',ph:'12345-678',req:1,re:/^\d{5}-?\d{3}$/}},
 SE:{p:{lb:'Postal code',ph:'123 45',req:1,re:/^\d{3} ?\d{2}$/}},PL:{p:{lb:'Postal code',ph:'12-345',req:1,re:/^\d{2}-\d{3}$/}},PT:{p:{lb:'Postal code',ph:'1234-567',req:1,re:/^\d{4}-\d{3}$/}},
 IN:{r:{lb:'State',ph:'e.g. Maharashtra',req:1},p:{lb:'PIN code',ph:'6 digits',req:1,re:/^\d{6}$/}},CN:{r:{lb:'Province',ph:'e.g. Guangdong',req:1},p:{lb:'Postal code',ph:'6 digits',req:1,re:/^\d{6}$/}},
 MX:{r:{lb:'State',req:1,ph:'State'}},TH:{r:{lb:'Province',req:1,ph:'Province'}},MY:{r:{lb:'State',req:1,ph:'State'}},ID:{r:{lb:'Province',req:1,ph:'Province'}},PH:{r:{lb:'Province',req:1,ph:'Province'}},KR:{r:{lb:'Province / City',req:1,ph:'e.g. Seoul'}}};
const addPost=(cs,re,ph)=>cs.split(' ').forEach(c=>{AC[c]=AC[c]||{};AC[c].p=Object.assign({lb:'Postal code',ph,req:1,re},AC[c].p||{})});
addPost('DE FR ES IT TH KR MY ID MX TR FI EE GR HR RS UA',/^\d{5}$/,'5 digits');addPost('AT BE CH DK NO NZ ZA HU LU BG PH CY',/^\d{4}$/,'4 digits');addPost('SG RU BY KZ',/^\d{6}$/,'6 digits');addPost('TW',/^\d{3}(\d{2,3})?$/,'e.g. 100');
const POSTFIRST='DE FR ES IT NL BE AT CH DK SE NO PL PT FI CZ SK HU GR HR SI EE LV LT LU RS BG RO'.split(' ');
const PHN={VN:{re:/^(?:\+84|84|0)(?:[35789]\d{8}|2\d{9})$/,ph:'0912 345 678 or +84 912 345 678',msg:'Enter a valid Vietnamese phone number, e.g. 0912 345 678.'},US:{re:/^(?:\+?1)?[2-9]\d{9}$/,ph:'+1 415 555 0132'},CA:{re:/^(?:\+?1)?[2-9]\d{9}$/,ph:'+1 416 555 0132'},GB:{ph:'+44 7911 123456'},AU:{ph:'+61 412 345 678'},JP:{ph:'+81 90 1234 5678'},KR:{ph:'+82 10 1234 5678'},CN:{ph:'+86 138 0013 8000'},SG:{ph:'+65 9123 4567'},TH:{ph:'+66 81 234 5678'},DE:{ph:'+49 151 23456789'},FR:{ph:'+33 6 12 34 56 78'},IN:{ph:'+91 98765 43210'}};
const phCfg=cc=>Object.assign({re:/^\+?\d{7,15}$/,ph:'Include country code, e.g. +65 9123 4567',msg:'Enter a valid phone number, including the country code.'},PHN[cc]||{});
const addrCfg=cc=>{const o=AC[cc]||{},f={};Object.keys(AG_).forEach(k=>f[k]=Object.assign({},AG_[k],o[k]||{}));return{rows:o.rows||[['l1'],['l2'],['c','r','p']],f}};
const gv=id=>{const e=$('#'+id);return e?e.value.trim():''};
const cName=cc=>{try{return new Intl.DisplayNames([document.documentElement.lang||'en'],{type:'region'}).of(cc)||cc}catch(e){return cc}};
const guessCC=()=>{const sv=S.get('shipaddr',null);if(sv&&sv.cc)return sv.cc;let l='';try{l=navigator.language||''}catch(e){}let tz='';try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||''}catch(e){}
 if(document.documentElement.lang==='vi'||/^vi/i.test(l)||/Ho_Chi_Minh|Saigon/.test(tz))return'VN';try{const r=new Intl.Locale(l).region;if(r&&CCODES.includes(r))return r}catch(e){}return'VN'};
function ctryOpts(sel){const lg=document.documentElement.lang||'en',nm=CCODES.map(c=>[c,cName(c)]).sort((a,b)=>a[1].localeCompare(b[1],lg));const top=nm.filter(x=>x[0]==='VN'),rest=nm.filter(x=>x[0]!=='VN');return[...top,...rest].map(x=>`<option data-notr value="${x[0]}"${x[0]===sel?' selected':''}>${esc(x[1])}</option>`).join('')}
function fldHTML(k,f){const id='ad-'+k,star=f.req?' *':'';return`<label class="fld"><small>${f.lb}${star}</small>${f.type==='select'?`<select id="${id}" autocomplete="${f.ac}"><option value="">${f.ph||'Select'}</option>${f.opts.map(o=>`<option data-notr value="${esc(o[0])}">${esc(o[1])}</option>`).join('')}</select>`:`<input id="${id}" autocomplete="${f.ac}" placeholder="${esc(f.ph||'')}"${k==='p'?' autocapitalize="characters"':''}>`}<span class="fe"></span></label>`}
function renderAddr(cc,vals){const cf=addrCfg(cc),box=$('#addr');if(!box)return;vals=vals||{};
 box.innerHTML=`<label class="fld"><small>Country / Region *</small><select id="ad-cc" autocomplete="country">${ctryOpts(cc)}</select></label>`+cf.rows.map(r=>`<div class="${r.length===1?'':r.length===2?'g2s':'g3s'}">${r.map(k=>fldHTML(k,cf.f[k])).join('')}</div>`).join('');
 cf.rows.flat().forEach(k=>{const e=$('#ad-'+k);if(e&&vals[k]!=null)e.value=vals[k]});phHint(cc)}
function phHint(cc){const e=$('#ad-ph');if(e)e.placeholder=phCfg(cc).ph}
function addrGet(){const cc=gv('ad-cc'),a={cc,n:gv('ad-n'),co:gv('ad-co'),e:gv('ad-e'),ph:gv('ad-ph')};['l1','l2','w','d','c','r','p'].forEach(k=>a[k]=gv('ad-'+k));return a}
function regName(a){const f=addrCfg(a.cc).f.r;if(f.type==='select'&&a.r){const o=f.opts.find(x=>x[0]===a.r);return o?(['US','CA','AU'].includes(a.cc)?o[0]:o[1]):a.r}return a.r}
function addrLines(a){const r=regName(a),pf=POSTFIRST.includes(a.cc);let L;
 if(a.cc==='VN')L=[[a.l1,a.w,a.d,r].filter(Boolean).join(', ')+(a.p?' '+a.p:'')];
 else L=[a.l1,a.l2,pf?[a.p,a.c].filter(Boolean).join(' ')+(r?', '+r:''):[[a.c,r].filter(Boolean).join(', '),a.p].filter(Boolean).join(' ')].filter(Boolean);
 return[...L.filter(Boolean),cName(a.cc)]}
function addrFieldMsg(k,f){const e=$('#ad-'+k);if(!e)return'';const val=e.value.trim();if(!val)return f.req?(f.type==='select'?'Please select an option.':'This field is required.'):'';if(f.re&&!f.re.test(val))return'Postal code format looks wrong. Example: '+(f.ph||'').replace(/^e\.g\. /,'');return''}
function shipValidate(){let first=null;const bad=(id,m)=>{const i=$('#'+id);if(!i)return;fErr(i,m);if(m&&!first)first=i};
 bad('ad-n',gv('ad-n').length<2?'Enter your full name.':'');bad('ad-e',/^\S+@\S+\.\S+$/.test(gv('ad-e'))?'':'Enter a valid email address.');
 const cc=gv('ad-cc')||'VN',pc=phCfg(cc);bad('ad-ph',pc.re.test(gv('ad-ph').replace(/[\s().-]/g,''))?'':pc.msg);
 const cf=addrCfg(cc);cf.rows.flat().forEach(k=>bad('ad-'+k,addrFieldMsg(k,cf.f[k])));
 if(first){first.focus();return false}
 const a=addrGet();S.set('shipaddr',a);S.set('shipto',{name:a.n,co:a.co,phone:a.ph,lines:addrLines(a)});return true}
function addrReview(){const a=addrGet();return[esc(a.n)+(a.co?' · '+esc(a.co):''),...addrLines(a).map(esc),esc(a.ph)].join('<br>')}
function addrInit(){if(!$('#addr'))return;const sv=S.get('shipaddr',null)||{},cc=guessCC();renderAddr(cc,sv.cc===cc?sv:{});const ph=$('#ad-ph');if(ph&&sv.ph&&!ph.value)ph.value=sv.ph;
 new MutationObserver(()=>{const s=$('#ad-cc');if(s)s.innerHTML=ctryOpts(s.value)}).observe(document.documentElement,{attributes:true,attributeFilter:['lang']})}
document.addEventListener('change',e=>{const t=e.target;if(t.id==='ad-cc'){const keep=addrGet();renderAddr(t.value,keep);const s=$('#ad-cc');if(s)s.focus()}else if(t.closest&&t.closest('#addr')&&t.id){const k=t.id.slice(3),f=addrCfg(gv('ad-cc')).f[k];if(f)fErr(t,addrFieldMsg(k,f))}});
document.addEventListener('focusout',e=>{const t=e.target;if(!t.id||!t.closest||!t.closest('#checkout [data-step="1"]'))return;const cc=gv('ad-cc')||'VN';
 if(t.id==='ad-n')fErr(t,t.value.trim().length<2?'Enter your full name.':'');else if(t.id==='ad-e')fErr(t,/^\S+@\S+\.\S+$/.test(t.value.trim())?'':'Enter a valid email address.');
 else if(t.id==='ad-ph'){const pc=phCfg(cc);fErr(t,pc.re.test(t.value.replace(/[\s().-]/g,''))?'':pc.msg)}
 else if(t.closest('#addr')&&t.id!=='ad-cc'){const k=t.id.slice(3),f=addrCfg(cc).f[k];if(f)fErr(t,addrFieldMsg(k,f))}});
document.addEventListener('input',e=>{const t=e.target;if(t.id&&t.id.startsWith('ad-')&&t.closest('.fld.bad'))fErr(t,'')});
function payUpdate(){const r=$('#checkout .pm input:checked'),m=r?r.dataset.m:'card';
 $$('#checkout .pm .opt').forEach(e=>e.classList.toggle('on',$('input',e).checked));
 $$('#checkout .pd').forEach(e=>e.style.display=e.dataset.m===m?'':'none');
 payM=m;S.set('pay',m);sync();const t=due(),q=Math.floor(t*100/4)/100,l=Math.round((t-q*3)*100)/100,tb=$('#inst');
 if(tb)tb.innerHTML='<tr><th>Payment</th><th>When</th><th>Amount</th></tr>'+['Today','In 2 weeks','In 4 weeks','In 6 weeks'].map((w,i)=>`<tr${i?'':' class="hl"'}><td><b>${i+1} of 4</b></td><td>${w}</td><td>${M(i<3?q:l)}</td></tr>`).join('');
 if(m==='qr'&&qrKey!==String(t))qrDraw(t);
 {const ln=$('#checkout [data-step="3"] .cd.ln p.m');if(ln&&$('#ad-cc')){ln.setAttribute('data-notr','');ln.innerHTML=addrReview()}}
 const pw=$('#pwith');if(pw)pw.textContent=m==='card'?cardLabel():m==='paypal'?'PayPal · '+(($('#ppm')||{}).value||'').trim():m==='bnpl'?`4 × ${M(q)} · every 2 weeks · 0% interest`:PAYN[m]}
document.addEventListener('click',e=>{const o=e.target.closest('#checkout .pm .opt');if(!o)return;const r=$('input',o);if(r&&!r.checked)r.checked=true;payUpdate()});
document.addEventListener('change',e=>{if(e.target.matches&&e.target.matches('#checkout .pm input'))payUpdate()});
function step(n){if(n===2||n===3)setTimeout(payUpdate,0);$$('#checkout [data-step]').forEach(e=>e.style.display=+e.dataset.step===n?'':'none');$$('#checkout .steps a').forEach((a,i)=>a.classList.toggle('on',i+1===Math.min(n,3)))}
/* auth, rfq, admin helpers */
const bad=(sel,msg)=>{let e=$(sel+' .er');if(!e){e=document.createElement('p');e.className='er';$(sel+' [data-act]').after(e)}e.textContent=msg};
const ok=sel=>{const e=$(sel+' .er');if(e)e.remove()};
const rq=l=>$$('#rfq .fld').find(f=>$('small',f).textContent.startsWith(l));
function rfq(){const a=Math.max(0,+rq('MacBook Air quantity').querySelector('input').value||0),b=Math.max(0,+rq('USB-C Hub quantity').querySelector('input').value||0);
 const sub=a*unit('laptop',a||1)+b*unit('hub',b||1),tax=Math.round(sub*8)/100,set=(k,v)=>{const e=$(`[data-r="${k}"]`);if(e)e.textContent=v};
 $('[data-r="lines"]').innerHTML=`${a} × MacBook Air M4 · ${M(unit('laptop',a||1))} / unit<br>${b} × Anker 565 USB-C Hub · ${M(unit('hub',b||1))} / unit`;set('units',`Subtotal · ${a+b} units`);set('sub',M(sub));set('tax',M(tax));set('total',M(sub+tax));const tr=$$('#rfq .tw tr');if(tr[2]){tr[1].cells[2].textContent=a;tr[1].cells[3].textContent=M(unit('laptop',a||1));tr[2].cells[2].textContent=b;tr[2].cells[3].textContent=M(unit('hub',b||1))}return sub}
function csv(tb){return[...tb.rows].filter(r=>r.style.display!=='none').map(r=>[...r.cells].map(c=>'"'+c.textContent.trim().replace(/"/g,'""')+'"').join(',')).join('\n')}
/* events */
document.addEventListener('click',e=>{const T=e.target,c=s=>T.closest(s);let x;
 if(x=c('.hr')){e.preventDefault();const k=c('.pc').dataset.k;wl=wl.includes(k)?wl.filter(i=>i!==k):[...wl,k];S.set('wl',wl);wlSync();toast(wl.includes(k)?'Saved to your wishlist':'Removed from wishlist');return}
 if(x=c('.bx')){e.preventDefault();const k=c('.pc').dataset.k;if(addToCart(k))toast(`${P[k].n} added to your cart`);return}
 if((x=c('a.ph'))&&x.closest('.pc')&&!c('.hr')){e.preventDefault();location.href=PU(x.closest('.pc').dataset.k);return}
 if(x=c('[data-p]')){e.preventDefault();location.href=PU(x.dataset.p);return}
 if(x=c('[data-add]')){const q=+$('#pq').textContent||1;if(addToCart(cur,q))toast(`Added ${q} × ${P[cur].n} to your cart`);return}
 if(x=c('[data-q]')){const q=Math.max(1,Math.min(99,+$('#pq').textContent+ +x.dataset.q));$('#pq').textContent=q;$('#pp').textContent=M(unit(cur,q));tier(q);return}
 if(x=c('.sw i')){$$('.sw i').forEach(i=>i.classList.toggle('on',i===x));$('.sw').previousElementSibling.innerHTML='<b>Color: '+['Sky blue','Silver','Starlight','Midnight'][[...x.parentNode.children].indexOf(x)]+'</b>';return}
 if(x=c('.op a')){$$('.op a').forEach(i=>i.classList.toggle('on',i===x));return}
 if((x=c('[data-qd]'))&&x.dataset.k&&cart[x.dataset.k]!=null){const k=x.dataset.k,q=cart[k]+ +x.dataset.qd;if(q<1)delete cart[k];else cart[k]=Math.min(99,q);saveCart();return}
 if(x=c('[data-rm]')){delete cart[x.dataset.rm];saveCart();toast('Removed from your cart');return}
 if(c('[data-clear]')){cart={};saveCart();return}
 
 if(c('#shop .sel')){F.sort=(F.sort+1)%3;shop();return}
 if(c('#shop .fs .bo')||c('#shop .chp .pc2')){reset();return}
 if((x=c('[data-go]'))&&x.closest('#checkout')){e.preventDefault();const n=+x.dataset.go;
  if(n===3&&!payValidate())return;if(n===2&&!shipValidate()){toast('Please check the highlighted fields');return}
  if(n===4){if(!cnt()){toast('Your cart is empty');return}if(!$('#checkout [data-step="3"] .ck input').checked){toast('Please accept the Terms of Service');return}if(!placing)placeOrder(x);return}
  step(n);$('#checkout').scrollIntoView();return}
 if(x=c('#checkout .steps a')){const n=[...x.parentNode.children].indexOf(x)+1;if(n>=2&&n<=3&&$('#ad-cc')&&!shipValidate()){toast('Please check the highlighted fields');return}step(n);return}
 if(x=c('[data-act="login"]')){const v=$$('#login .fld input').map(i=>i.value.trim());if(!/^\S+@\S+\.\S+$/.test(v[0])){e.preventDefault();bad('#login','Enter a valid email address.')}else if(v[1].length<6){e.preventDefault();bad('#login','Password must be at least 6 characters.')}else{ok('#login');toast('Welcome back!')}return}
 if(x=c('[data-act="register"]')){const v=$$('#register .fld input').map(i=>i.value.trim()),tc=$$('#register .ck input')[2];let m='';
  if(!v[0]||!v[1]||!v[2])m='Please fill in your name and company.';else if(!/^\S+@\S+\.\S+$/.test(v[3]))m='Enter a valid business email.';else if(v[6].length<8)m='Password needs at least 8 characters.';else if(v[6]!==v[7])m='Passwords do not match.';else if(!tc.checked)m='Please accept the Terms of Service.';
  if(m){e.preventDefault();bad('#register',m)}else{ok('#register');toast('Account created. Welcome to TDev!')}return}
 if(x=c('[data-act="rfq"]')){{const miss=$$('#rfq .fld').some(f=>$('small',f).textContent.includes('*')&&!$('input',f).value.trim());if(miss||!$('#rfq .ck input').checked){e.preventDefault();toast(miss?'Please complete the required fields':'Please accept the Privacy Policy');return}}if(!rfq()){e.preventDefault();toast('Add at least one device quantity');return}const sub=rfq(),pn=$$('#rfq .fld').find(f=>$('small',f).textContent.startsWith('Project name')).querySelector('input').value||'New project';
  {const _u=curUser(),_q=[`<b>Q-${++qc}</b>`,esc((_u&&(_u.company||_u.name))||'Customer'),esc(pn),M(sub),'<span class="tg a">Under review</span>','View'];addRow('#quotes',_q);const L=S.get('qrows',[]);L.push(_q);S.set('qrows',L);const fv=t=>{const f=rq(t);return f?$('input,textarea',f).value.trim():''},qa=+rq('MacBook Air quantity').querySelector('input').value||0,qb=+rq('USB-C Hub quantity').querySelector('input').value||0,ln=[];if(qa>0)ln.push(['MacBook Air M4','LAP-M4',qa,unit('laptop',qa)]);if(qb>0)ln.push(['Anker 565 USB-C Hub','ACC-HUB',qb,unit('hub',qb)]);const dt=S.get('qdet',{});dt['Q-'+qc]={contact:fv('Contact name'),email:fv('Business email'),phone:fv('Phone'),tax:fv('Company tax ID'),date:fv('Target delivery date'),budget:fv('Budget'),addr:fv('Delivery address'),notes:fv('Project notes'),at:new Date().toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'}),lines:ln};S.set('qdet',dt)}S.set('qc',qc);toast(`Quote request Q-${qc} sent`);flashLast();return}
 /* admin */
 const ad=c('.ad');if(ad){const tb=$('table',ad),st=$('.state',ad);
  if(x=c('.tl .bo')){const b=new Blob([csv(tb)],{type:'text/csv'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='tdev-'+ad.id+'.csv';a.click();toast('CSV exported');return}
  if(c('.tl .bt')){if(st){st.scrollIntoView({behavior:'smooth'});toast('Fill in the form below')}return}
  if((x=c('td.act'))&&x.cellIndex>0){$$('tr',tb).forEach(r=>r.classList.toggle('hl',r===x.parentNode));if(st){st.scrollIntoView({behavior:'smooth'});toast('Editing '+x.parentNode.cells[0].textContent.trim())}return}
  if(x=c('.fr a')){toast(x.classList.contains('rd')?'Request rejected':x.classList.contains('bt')?'Changes saved':'Cancelled');return}}
});
document.addEventListener('input',e=>{const T=e.target;
 if(T.closest('#shop .fs')){readBoxes();shop()}
 if(T.closest('#rfq'))rfq();
 const ad=T.closest('.ad');if(ad&&T.closest('.tl .sf'))adFilter(ad);
 if(T.id==='hs'&&PAGE==='shop'){F.q=T.value.toLowerCase().trim();shop()}});
document.addEventListener('change',e=>{if(e.target.closest('#shop .fs')){readBoxes();shop()}});
document.addEventListener('keydown',e=>{if(e.key!=='Enter')return;
 if(e.target.id==='hs'){F.q=e.target.value.toLowerCase().trim();$$('#shop .fs .ck input').forEach((i,x)=>{if(x<CATS.length+BR.length)i.checked=false});readBoxes();if(PAGE!=='shop'){location.href=U('shop')+'?q='+encodeURIComponent(F.q);return}shop()}
});
/* patches */
const MO=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],ETA=(()=>{const f=n=>{const d=new Date();d.setDate(d.getDate()+n);return d},a=f(4),b=f(5);return MO[a.getMonth()]+' '+a.getDate()+'–'+(a.getMonth()===b.getMonth()?'':MO[b.getMonth()]+' ')+b.getDate()})();
let cur='laptop';const pr=$('#product'),orig=pr?$$('.g2>.cd',pr).map(e=>e.innerHTML):[],dsc=pr?$('.stars+p',pr).textContent:'';
const tier=q=>{const a=[...P[cur].p].reverse();let h=0;a.forEach((t,i)=>{if(q>=t[0])h=i});$$('.bp tr:not(:first-child)',pr).forEach((r,i)=>r.classList.toggle('hl',i===h))};
function showProduct(k){if(!pr||!P[k])return;cur=k;const p=P[k],L=k==='laptop',col=$('.g2d>div:last-child',pr),m=($('.sp',$(`.pc[data-k="${k}"]`)).textContent.match(/(\d\.\d) \((\d+)\)/))||[0,'4.8','100'],a=[...p.p].reverse(),b=base(k);
 $('.cr',pr).textContent=`Home  /  ${p.c} / ${p.n}`;$$('.gal,.th .ph',pr).forEach(e=>e.className=e.className.replace(/^ph \S+/,'ph '+k));
 $('small.m',col).textContent=`${p.b.toUpperCase()} / ${p.c.toUpperCase()}`;$('h1',col).textContent=p.n;
 rvHead();$('.stars+p',col).textContent=L?dsc:p.s+'.';
 $('.tg',col).textContent=L?'In stock · 120 available':k==='chair'?'Only 8 left':'In stock';
 [$('.sw',pr).previousElementSibling,$('.sw',pr),$('.op',pr)].forEach(e=>e.style.display=L?'':'none');
 $('.bp table',pr).innerHTML='<tr><th>Quantity</th><th>Unit price</th><th>Savings</th></tr>'+a.map((t,i)=>{const n=a[i+1],r=n?(n[0]-1>t[0]?`${t[0]}–${n[0]-1} units`:`${t[0]} unit`):`${t[0]}+ units`;return`<tr><td><b>${r}</b></td><td>${M(t[1])}</td><td>${t[1]<b?`$${b-t[1]} / unit`:'Retail'}</td></tr>`}).join('');
 $$('p.m',col).pop().innerHTML=`<small>Arrives ${ETA} · 30-day returns · ${L?'1-year Apple':p.b+' manufacturer'} warranty</small>`;
 const cd=$$('.g2>.cd:not(.xt)',pr);if(L)cd.forEach((e,i)=>e.innerHTML=orig[i]);else{cd[0].innerHTML=`<h3>About this device</h3><p class="m">${p.s}. Backed by the manufacturer warranty and our 30-day return policy.</p>`;cd[1].innerHTML=`<h3>Technical specifications</h3><dl class="sp2"><dt>Brand</dt><dd>${p.b}</dd><dt>Category</dt><dd>${p.c}</dd><dt>Details</dt><dd>${p.s}</dd><dt>Warranty</dt><dd>Manufacturer warranty</dd></dl>`}
 if(p.about||p.ovw){const h=lines(p.ovw);cd[0].innerHTML=`<h3>${p.about?'About this device':'Overview'}</h3>${p.about?`<p class="m">${esc(p.about).replace(/\n/g,'<br>')}</p>`:''}${h.length?`<ul class="cl">${h.map(x=>`<li>${ic('check')}${esc(x)}</li>`).join('')}</ul>`:''}`}
 if(p.spec){const r=lines(p.spec).map(x=>{const m=x.match(/^([^:|=]{1,40}?)\s*[:|=]\s*(.+)$/);return m?[m[1].trim(),m[2].trim()]:['Details',x]});cd[1].innerHTML=`<h3>Technical specifications</h3><dl class="sp2">${r.map(x=>`<dt>${esc(x[0])}</dt><dd>${esc(x[1])}</dd>`).join('')}</dl>`}
 $('#pq').textContent=1;$('#pp').textContent=M(b);tier(1);gal(k,0);renderRel();tabs()}
$$('table').forEach(t=>{const i=[...t.rows[0].cells].findIndex(c=>c.textContent.trim()==='Action');if(i>-1)[...t.rows].slice(1).forEach(r=>r.cells[i]&&r.cells[i].classList.add('act'))});
$$('tr.hl').forEach(r=>{if(!r.closest('.ad,.bp'))r.classList.remove('hl')});
$$('a:not([href]),.sel,.sw i,.hr').forEach(e=>{e.tabIndex=0;e.setAttribute('role',e.matches('.sw i')?'radio':'button');if(e.matches('.hr'))e.setAttribute('aria-label','Toggle wishlist')});
{const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;while(n=w.nextNode())if(n.parentNode.tagName!=='SCRIPT'&&/Oct(ober)? 12–13/.test(n.nodeValue))n.nodeValue=n.nodeValue.replace(/Oct(?:ober)? 12–13/g,ETA)}
document.addEventListener('keydown',e=>{const T=e.target;if((e.key==='Enter'||e.key===' ')&&T.matches&&T.matches('a:not([href]),.sel,.sw i,.hr')){e.preventDefault();T.dispatchEvent(new MouseEvent('click',{bubbles:true}))}if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();$('#hs').focus()}});
document.addEventListener('change',e=>{const T=e.target;if(T.type==='radio'&&T.closest('.opt'))$$(`input[name="${T.name}"]`).forEach(i=>i.closest('.opt').classList.toggle('on',i.checked))});
document.addEventListener('submit',e=>{if(e.target.id==='nl'){e.preventDefault();const i=$('input',e.target);if(/^\S+@\S+\.\S+$/.test(i.value)){toast('Thanks! You’re on the list.');i.value=''}else toast('Enter a valid email address')}});
document.addEventListener('click',e=>{const a=e.target.closest('.tabs a');if(!a)return;const t=a.closest('.tabs');$$('a',t).forEach(i=>i.classList.toggle('on',i===a));const ad2=a.closest('.ad');if(ad2){adFilter(ad2);return}const tb=$('.tw table',t.closest('.ab,.pg'));if(!tb||a.closest('#product'))return;
 const l=a.textContent.replace(/\(\d+\)/,'').trim().toLowerCase(),s=l.replace(/s$/,'');[...tb.rows].slice(1).forEach(r=>{const x=r.textContent.toLowerCase();r.style.display=/^all/.test(l)||x.includes(l)||x.includes(s)?'':'none'})});
if(PAGE==='checkout'&&!cnt()){try{sessionStorage.setItem('flash','Your cart is empty')}catch(e){}location.replace(U('cart'))}
/* v3: theme, gallery angles, tabs, search, categories */
const setTheme=t=>{document.documentElement.dataset.theme=t;try{localStorage.setItem('tdev-theme',t)}catch(e){}};
const AR={laptop:1.555,headphones:1.555,hub:1.555,phone:1.555,printer:1.654,chair:1.654,airpods:1.705};
const VW={laptop:[['Front view'],['Screen',.39,.28,2.3],['Keyboard',.47,.5,2.4],['Trackpad & edge',.42,.6,2.6]],
headphones:[['Front view'],['Headband',.48,.16,2.2],['Ear cup',.6,.6,2.4],['Cushion',.33,.53,2.4]],
hub:[['Front view'],['Left ports',.3,.37,3],['USB-A & SD',.55,.37,3],['Cable',.88,.39,3]],
phone:[['Front & back'],['Display',.33,.36,2],['Camera',.55,.17,3.2],['Back panel',.62,.5,2.2]],
printer:[['Front view'],['Control panel',.62,.3,2.6],['Paper tray',.5,.7,2.4],['Output tray',.45,.17,2.6]],
chair:[['Front view'],['Backrest',.5,.3,2.4],['Armrest',.7,.5,2.6],['Base & wheels',.5,.85,2.6]],
airpods:[['Front view'],['Earbuds',.45,.42,2.6],['Charging case',.52,.66,2.4],['Lid',.52,.25,2.6]]};
let vi=0;
const IMG_OK=/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/;
const vcss=(k,v)=>{const im=v[4]&&IMG_OK.test(v[4])?`background-image:url('${v[4]}')!important;background-repeat:no-repeat!important;background-size:cover!important;background-position:center!important;`:'';if(!v[1])return im;const z=v[3],W=AR[k]*z,H=z,cl=n=>Math.max(0,Math.min(1,n));return`background-size:auto ${z*100}%;background-position:${(cl((v[1]*W-.6)/(W-1.2))*100).toFixed(1)}% ${(cl((v[2]*H-.5)/(H-1))*100).toFixed(1)}%`};
function gal(k,i){const V=VW[k],g=$('.gal',pr),th=$('.th',pr);if(!$('.gn',g))g.insertAdjacentHTML('beforeend','<button class="gn" data-gn="-1" aria-label="Previous view">‹</button><button class="gn r" data-gn="1" aria-label="Next view">›</button>');
 vi=(i+V.length)%V.length;
 if(th.dataset.k!==k){th.dataset.k=k;th.innerHTML=V.map((v,j)=>`<div class="ph ${k}" role="button" tabindex="0" data-v="${j}" aria-label="${v[0]}" style="${vcss(k,v)}"></div>`).join('')}
 g.style.cssText=vcss(k,V[vi]);$$('.ph',th).forEach((e,j)=>e.classList.toggle('on',j===vi));
 $('#gcap').textContent=`${V[vi][0]} · ${vi+1} of ${V.length}`}
const ic=n=>`<svg class="i"><use href="#i-${n}"/></svg>`;
const lines=t=>String(t||'').split('\n').map(x=>x.trim()).filter(Boolean);

    {
        const g = $('#shop .g3') || $('#pc-src'); if (g) { Object.keys(P).forEach(k => { const p = P[k]; if (!p.i) return; g.insertAdjacentHTML('beforeend', `<div class="pc" data-k="${k}"><a class="ph ${k}" ass="ph ${k}" href="${PU(k)}"><svg class="i hr"><use href="#i-heart"/></svg></a>><svg class="i hr"><use href="#i-heart"/></svg></a><small class="br">${p.b.toUpperCase()}</small><b>${p.n}</b><p class="sp">${p.s}<br><span class="st">★</span> ${p.r} (${40 + (k.length * 37) % 210})</p><h3 class="pr">${M(p.p[0][1])}</h3><span class="tg">In stock</span><a class="bx" href="product.html">Add to Cart</a></div>`) }); }
 let css='';Object.keys(P).forEach(k=>{const p=P[k];if(!p.i)return;const s=document.getElementById('i-'+p.i);if(!s)return;const v=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#5B78FF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">${s.innerHTML}</svg>`;css+=`.ph.${k}{background-image:url("data:image/svg+xml,${encodeURIComponent(v)}");background-repeat:no-repeat;background-size:32%;background-color:var(--t${p.t})}`});
 const st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 Object.keys(P).forEach(k=>{if(!VW[k]){VW[k]=[['Front view']];AR[k]=1.555}})}
const relSrc={};Object.keys(P).forEach(k=>{const c=$(`.pc[data-k="${k}"]`);if(c)relSrc[k]=c.outerHTML.replace(/ style="[^"]*"/,'')});
const REL={laptop:['hub','headphones','airpods','phone'],headphones:['airpods','laptop','phone','hub'],hub:['laptop','phone','printer','headphones'],phone:['airpods','headphones','hub','laptop'],printer:['laptop','hub','chair','phone'],chair:['laptop','printer','hub','headphones'],airpods:['phone','laptop','headphones','hub']};
function renderRel(){const w=$('#rel');if(!w)return;const ks=(REL[cur]||relFor(cur)).filter(k=>relSrc[k]&&k!==cur);
 w.innerHTML=`<div class="hx"><div><h3>You might also like</h3><p class="m">Pairs well with ${P[cur].n}. Complete your setup with these picks.</p></div><a class="pc2" href="shop.html">Browse all products ${ic('arrow')}</a></div><div class="g4">${ks.map(k=>relSrc[k]).join('')}</div>`;
 $$('.hr',w).forEach(e=>{e.tabIndex=0;e.setAttribute('role','button');e.setAttribute('aria-label','Toggle wishlist')});wlSync();fixLinks(w)}
/* ---------- Đánh giá sao (1–5) + bình luận văn bản; lưu localStorage 'tdev-rv' theo từng sản phẩm ---------- */
const RV={all(){const o=S.get('rv',{});return o&&typeof o==='object'?o:{}},of(k){const a=RV.all()[k];return Array.isArray(a)?a.filter(r=>r&&typeof r==='object'&&r.r>=1&&r.r<=5):[]},put(k,l){const o=RV.all();o[k]=l;S.set('rv',o)}};
let rvPick=0;const rvPh=()=>{let v=false;try{const l=localStorage.getItem('tdev-lang');v=l?l==='vi':/^vi/i.test(navigator.language||'')}catch(e){}return v?'Chia sẻ trải nghiệm của bạn về sản phẩm này…':'Share your experience with this product…'};
document.addEventListener('tdev-lang',()=>{const t=$('#rv-t');if(t)t.placeholder=rvPh()});
const rvBase=k=>{const c=$(`.pc[data-k="${k}"] .sp`),m=c&&c.textContent.match(/(\d\.\d) \((\d+)\)/);return m?[parseFloat(m[1]),parseInt(m[2],10)]:[4.8,100]};
const rvAgg=k=>{const b=rvBase(k),l=RV.of(k),N=b[1]+l.length;return[((b[0]*b[1]+l.reduce((x,r)=>x+r.r,0))/N).toFixed(1),N]};
const rvStars=n=>{const r=Math.max(0,Math.min(5,Math.round(n)));return'★'.repeat(r)+'☆'.repeat(5-r)};
function rvHead(){const col=pr&&$('.g2d>div:last-child',pr);if(!col)return;const g=rvAgg(cur);$('.stars',col).innerHTML=`${rvStars(g[0])} <small class="m">&nbsp;${g[0]} out of 5 · ${g[1]} verified reviews</small>`}
function rvHTML(k){const p=P[k],l=RV.of(k),g=rvAgg(k),u=curUser(),
 form=u&&u.role==='admin'?'<p class="m">Admins can’t write reviews.</p>':u?`<div class="rvf"><b>Write a review</b><small class="m">Your rating</small><div class="rsw" role="radiogroup" data-notr>${[1,2,3,4,5].map(n=>`<button type="button" class="rs${n<=rvPick?' on':''}" data-rs="${n}" role="radio" aria-label="${n}/5">★</button>`).join('')}</div><label class="fld"><small>Your comment (optional)</small><textarea id="rv-t" rows="3" maxlength="500" placeholder="${rvPh()}"></textarea></label><button type="button" class="bt" data-rv="post">Post review</button></div>`:'<div class="rvf"><b>Write a review</b><p class="m">Sign in to rate this product and leave a comment.</p><a class="bo" href="login.html" data-rvlogin>Sign in</a></div>',
 mine=u?u.email:null,
 items=l.map((r,i)=>({r,i})).reverse().map(({r,i})=>`<div class="rvi"><div class="rvh"><b data-notr>${esc(r.n||'')}</b><span class="stars" data-notr>${rvStars(r.r)}</span><small class="m" data-notr>${esc(r.d||'')}</small>${mine&&r.e===mine?`<a class="rvx" role="button" tabindex="0" data-rv="del" data-i="${i}">Delete</a>`:''}</div>${r.t?`<p class="rvt" data-notr>${esc(r.t)}</p>`:''}</div>`).join('');
 return`<h3>Customer reviews</h3><p class="stars">${rvStars(g[0])} <small class="m">&nbsp;${g[0]} out of 5 · ${g[1]} verified reviews</small></p>${form}<div class="rvl">${items}<div class="rvi"><div class="rvh"><span class="stars">★★★★★</span></div><p class="rvt">“Setup took minutes and it does exactly what we hoped.”</p><small class="m">Verified buyer · ${p.n}</small></div></div>`}
document.addEventListener('click',e=>{const T=e.target,c=s=>T.closest&&T.closest(s);let x;
 if(c('[data-rvlogin]')){try{sessionStorage.setItem('next',PU(cur)+'&tab=rv')}catch(_){}return}
 if(pr&&(x=c('.g2d>div:last-child>.stars'))){tabs(2);const tb=$('.tabs',pr);if(tb)tb.scrollIntoView({behavior:'smooth',block:'start'});return}
 if(x=c('[data-rs]')){rvPick=+x.dataset.rs;$$('.rs',x.parentNode).forEach(b=>{const on=+b.dataset.rs<=rvPick;b.classList.toggle('on',on);b.setAttribute('aria-checked',on&&+b.dataset.rs===rvPick?'true':'false')});return}
 if(x=c('[data-rv="post"]')){const u=curUser();if(!u||u.role==='admin')return;if(!rvPick){toast('Please choose a star rating.');return}
  const t=($('#rv-t')?$('#rv-t').value:'').trim().slice(0,500),l=RV.of(cur),en={n:u.name||String(u.email||'').split('@')[0]||'Customer',e:u.email,r:rvPick,t,d:new Date().toISOString().slice(0,10)},i=l.findIndex(r=>r.e===u.email);
  if(i>=0)l[i]=en;else l.push(en);RV.put(cur,l);rvPick=0;rvHead();tabs(2);toast('Thanks for your review!');return}
 if(x=c('[data-rv="del"]')){const u=curUser(),l=RV.of(cur),i=+x.dataset.i;if(u&&l[i]&&l[i].e===u.email){l.splice(i,1);RV.put(cur,l);rvHead();tabs(2);toast('Your review was deleted.')}return}
});
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('.rvx')){e.preventDefault();e.target.click()}});
function tabs(i){const g=$('.g2',pr),p=P[cur],tb=$('.tabs',pr),sp0=$(`.pc[data-k="${cur}"] .sp`),m=sp0&&sp0.textContent.match(/\((\d+)\)/);
 if(i===undefined)i=[...tb.children].findIndex(a=>a.classList.contains('on'));
 if(!$('.xt',g))g.insertAdjacentHTML('beforeend','<div class="cd xt"></div><div class="cd xt"></div>');
 const xt=$$('.xt',g),cs=$$('.cd:not(.xt)',g);
 try{xt[0].innerHTML=rvHTML(cur)}catch(err){console.error('reviews',err);xt[0].innerHTML='<h3>Customer reviews</h3><p class="m">Reviews could not be loaded. Please reload the page.</p>'}
 try{const sh=lines(p.ship);xt[1].innerHTML=`<h3>Delivery &amp; warranty</h3><ul class="cl">${sh.length?sh.map(x=>`<li>${ic('check')}${esc(x)}</li>`).join(''):`<li>${ic('truck')}Arrives ${ETA}</li><li>${ic('undo')}30-day returns</li><li>${ic('shield')}${p.b} manufacturer warranty</li>`}</ul>`}catch(err){console.error('delivery',err)}
 $$('a',tb).forEach((a,j)=>a.classList.toggle('on',j===i));try{if(m)tb.children[2].textContent=`Reviews (${rvAgg(cur)[1]})`}catch(err){console.error('reviews count',err)}
 const rl=$('#rel');if(rl)rl.style.display=i===0?'':'none';const sh=[[cs[0],cs[1]],[cs[1]],[xt[0]],[xt[1]]][i];[...cs,...xt].forEach(e=>{e.style.display=sh.includes(e)?'':'none';e.style.gridColumn=sh.length==1?'1/-1':''})}
document.addEventListener('click',e=>{const T=e.target,c=s=>T.closest(s);let x;
 if(c('a[href="shop.html"]')&&!c('#wlb')&&F.wl){F.wl=0;shop()}
 if(x=c('#product .th .ph')){gal(cur,+x.dataset.v);return}
 if(x=c('.gn')){gal(cur,vi+ +x.dataset.gn);return}
 if(c('.tt')){setTheme(document.documentElement.dataset.theme==='dark'?'light':'dark');return}
 if(c('.sbtn')){if(matchMedia('(max-width:900px)').matches)$('#sf').classList.toggle('open');$('#hs').focus();return}
 if(x=c('#product .tabs a')){tabs([...x.parentNode.children].indexOf(x));return}
 if(c('#wlb')){F.wl=1;$$('#shop .fs .ck input').forEach((i,n)=>{if(n<CATS.length+BR.length)i.checked=false});readBoxes();shop();if(!wl.length)toast('Tap the heart on a product to save it')}});
document.addEventListener('keydown',e=>{const T=e.target;
 if(T.closest&&T.closest('#product .th,#product .gal')){if(e.key==='ArrowRight'){gal(cur,vi+1);e.preventDefault()}if(e.key==='ArrowLeft'){gal(cur,vi-1);e.preventDefault()}}
 if((e.key==='Enter'||e.key===' ')&&T.matches&&T.matches('#product .th .ph')){e.preventDefault();gal(cur,+T.dataset.v)}
 if(e.key==='Escape'&&T.id==='hs')T.blur()});
$('#hs').addEventListener('blur',()=>setTimeout(()=>$('#sf').classList.remove('open'),150));
/* category pages */
const NM={phones:'Phones','laptops':'Laptops',audio:'Audio','office-furniture':'Office Furniture',printers:'Printers',accessories:'Accessories'};
let cimgPend,himgPend;
/* ảnh tile trang chủ = trường img; ảnh panel đầu trang danh mục = trường hero (hai ảnh riêng) */
const cimgOf=(id,f)=>{f=f||'img';const o=S.get('catov',{})[id];return o&&o[f]&&IMG_OK.test(o[f])?o[f]:''};
const ced='<a class="cimg-edit" href="a-cat.html">Change image</a>';
const cHero=(id,k)=>{const im=cimgOf(id,'hero');return im?`<div class="ph cimg" role="img" aria-label="${NM[id]}" style="background-image:url('${im}')"></div>`:vis(k)};
function applyCatImgs(){Object.keys(NM).forEach(id=>$$('a.tile[href="cat-'+id+'.html"]').forEach(t=>{const im=cimgOf(id);t.classList.toggle('has-img',!!im);t.style.backgroundImage=im?`linear-gradient(rgba(15,23,42,.25),rgba(15,23,42,.82)),url('${im}')`:''}))}
function pickCatImg(f,hero){if(!f)return;if(!/^image\/(jpeg|png|webp)$/.test(f.type)){merr('Please choose a JPG, PNG or WebP image.');return}
 const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{const W=Math.min(hero?1200:900,im.width),H=Math.round(im.height*W/im.width),c=document.createElement('canvas');c.width=W;c.height=H;c.getContext('2d').drawImage(im,0,0,W,H);const d=c.toDataURL('image/jpeg',.82);if(hero)himgPend=d;else cimgPend=d;const p=$(hero?'#cf-hprev':'#cf-prev');if(p){p.style.backgroundImage=`url('${d}')`;p.classList.add('on')}};im.onerror=()=>merr('This image could not be read.');im.src=r.result};r.readAsDataURL(f)}
document.addEventListener('change',e=>{if(e.target.id==='cf-f')pickCatImg(e.target.files[0]);if(e.target.id==='cf-hf')pickCatImg(e.target.files[0],true)});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-cimg]');if(!b)return;e.preventDefault();const h=b.dataset.cimg==='hclear';if(h)himgPend='';else cimgPend='';const p=$(h?'#cf-hprev':'#cf-prev');if(p){p.style.backgroundImage='';p.classList.remove('on')}const f=$(h?'#cf-hf':'#cf-f');if(f)f.value=''});
const CAT0=Object.keys(NM).map((id,i)=>({id,name:NM[id],order:i+1,status:'Active',base:true}));
const cdel=()=>S.get('cdel',[]);
const catList=()=>{const ov=S.get('catov',{}),cu=S.get('ccats',[]),dl=cdel();return[...CAT0.filter(c=>!dl.includes(c.id)).map(c=>Object.assign({},c,ov[c.id]||{})),...cu.map(c=>Object.assign({base:false},c))].sort((a,b)=>a.order-b.order)};
const hideDelCats=()=>cdel().forEach(id=>$$('.ddm a[href="cat-'+id+'.html"]').forEach(a=>a.remove()));
/* danh mục do admin thêm: hiện ở menu "Danh mục" và bộ lọc cửa hàng (link -> shop.html?cat=Tên) */
const syncCats=()=>{const act=catList().filter(c=>!c.base&&c.status==='Active');CATS.length=6;act.forEach(c=>CATS.push(c.name));
 $$('[data-cc]').forEach(x=>x.remove());
 const dd=$('.ddm');if(dd)act.forEach(c=>{const a=document.createElement('a');a.href='shop.html?cat='+encodeURIComponent(c.name);a.textContent=c.name;a.setAttribute('data-cc','1');dd.appendChild(a)});
 const fs=$('#shop .fs');if(fs){let last=$$('label.ck',fs)[5];if(last)act.forEach(c=>{const l=document.createElement('label');l.className='ck';l.setAttribute('data-cc','1');const i=document.createElement('input');i.type='checkbox';l.append(i,c.name+' ('+Object.keys(P).filter(k=>P[k].c===c.name).length+')');last.after(l);last=l})}catOrderApply()};
/* menu "Categories" và các thẻ danh mục ở trang chủ xếp theo Display order của admin */
function catOrderApply(){const od={};catList().forEach((c,i)=>{od[c.base?'cat-'+c.id+'.html':'shop.html?cat='+encodeURIComponent(c.name)]=i});
 const srt=(box,sel)=>{if(!box)return;$$(sel,box).map((el,n)=>[el,od[el.getAttribute('href')]!=null?od[el.getAttribute('href')]:999+n]).sort((a,b)=>a[1]-b[1]).forEach(x=>box.appendChild(x[0]))};
 srt($('.ddm'),':scope>a');srt($('#home .g6'),':scope>a.tile')}
const catNav=()=>catList().filter(c=>c.base&&c.status==='Active').map(c=>c.id);
const cd = k => $(`.pc[data-k="${k}"]`).outerHTML.replace(/ style="[^"]*"/, ""), pg = k => `<a class="ph ${k}" href="${PU(k)}" data-p="${k}" aria-label="${P[k].n}"></a>`;
const tiers=k=>P[k].p.map(t=>`<tr><td><b>${t[0]}+ units</b></td><td>${M(t[1])}</td></tr>`).reverse().join('');
const rt=k=>{if(P[k]&&P[k].r)return P[k].r;const m=(($(`.pc[data-k="${k}"] .sp`)||{}).textContent||'').match(/★\s*(\d\.\d)/);return m?m[1]:'4.8'};
const vis = (k, c = '', inn = '') => `<a class="ph ${k} ${c}" href="${PU(k)}" data-p="${k}" aria-label="${P[k].n}">${inn}</a>`;
const add=k=>`<button class="kx" data-k="${k}" data-n="${P[k].n}">Add to Cart</button>`;
const meta=k=>`<small class="br">${P[k].b}</small><b>${P[k].n}</b><p class="sp">${P[k].s}<br><span class="st">★</span> ${rt(k)}</p>`;
const tgs=k=>`<span class="tg b">${P[k].x}</span>`;
const kc=(k,c='',inn='',tag='')=>`<div class="kc ${c}">${vis(k,'',inn)}${tag}${meta(k)}<div class="kf"><h3 class="pr">${M(base(k))}</h3>${add(k)}</div></div>`;
const inCat=n=>Object.keys(P).filter(k=>P[k].c===n);
const R={
phones:()=>{const D=inCat('Phones'),B=[['Under $600','Everyday phones that do the basics well.',k=>base(k)<600],['$600 to $999','The sweet spot for most people.',k=>base(k)>=600&&base(k)<1000],['$1,000 and up','The best cameras and the biggest screens.',k=>base(k)>=1000]];
    return `<div class="c1"><div><span class="pill">5G ready</span><h1>Phones that keep up with you</h1><p class="m">Big screens, long days and cameras that make everyday moments look good. Start with your budget.</p><div class="chips"><span class="tg b">256GB storage</span><span class="tg">5G</span><span class="tg a">Icy blue</span></div><a class="bt" href="${PU('phone')}" data-p="phone">Shop Galaxy S25 ${ic('arrow')}</a> <a class="bo" href="shop.html">All products</a></div>${cHero('phones','phone')}${ced}</div><div class="cpn-slot"></div>`+B.map(b=>{const l=D.filter(b[2]);return l.length?`<div class="band"><div><h2>${b[0]}</h2><p class="m">${b[1]}</p><span class="tg n">${l.length} phone${l.length>1?'s':''}</span></div><div class="bg4">${l.map(k=>kc(k,'','',tgs(k))).join('')}</div></div>`:''}).join('')},
laptops:()=>{const D=inCat('Laptops'),G=[...new Set(D.map(k=>P[k].x))];
    return `<div class="c2">${cHero('laptops', 'laptop')}<div><h1>Power for the way you work</h1><p class="m">${P.laptop.s}. Light enough for every commute, strong enough for the whole day.</p><div class="bp"><h3>Better together · team pricing</h3><div class="tw"><table><tr><th>Quantity</th><th>Unit price</th></tr>${tiers('laptop')}</table></div></div><a class="bt" href="${PU('laptop')}" data-p="laptop">View MacBook Air M4 ${ic('arrow')}</a> <a class="bo" href="rfq.html">Request a bulk quote</a></div>${ced}</div><div class="cpn-slot"></div><div class="fl">${['All',...G].map((t,i)=>`<button class="${i?'':'on'}" data-f="${t}">${t}</button>`).join('')}</div>`+D.map(k=>`<div class="lrow" data-g="${P[k].x}">${vis(k)}<div><small class="br m">${P[k].b}</small><h3>${P[k].n}</h3><p class="sp m">${P[k].s}</p></div><div>${tgs(k)}<p class="sp"><span class="st">★</span> ${rt(k)}</p></div><div class="pe"><h3 class="pr">${M(base(k))}</h3>${add(k)}</div></div>`).join('')},
audio:()=>{const D=inCat('Audio'),G=[...new Set(D.map(k=>P[k].x))],cn=g=>D.filter(k=>P[k].x===g).length,
 gd=[['Commuting','Over-ear','Noise-cancelling headphones that shut out trains and open offices.'],['Working out','Earbuds','Light earbuds that stay put from the first rep to the last.'],['At your desk','Speaker','A compact speaker that fills the room without a tangle of cables.']].filter(a=>G.includes(a[1]));
 return `<section class="chero t4"><div><span class="pill w">Sound, your way</span><h1>Hear more. Hear less noise.</h1><p class="m">Over-ear comfort, pocket-sized buds or a speaker for the desk. Pick a type below or browse everything.</p><div class="eq" aria-hidden="true">${[...Array(16)].map((_,i)=>`<i style="animation-delay:-${(i*.37%1.1).toFixed(2)}s"></i>`).join('')}</div><div class="hbtn"><a class="bt" href="#" data-jump="Over-ear">Shop headphones ${ic('arrow')}</a><a class="bo" href="#" data-jump="Earbuds">Shop earbuds</a></div></div>${cHero('audio','headphones')}${ced}</section><div class="perks">${[['headphones','Noise cancelling','Block out the commute and the open office.'],['bolt','All-day battery','Up to 40 hours on a single charge.'],['shield','Warranty','Manufacturer warranty on every item.']].map(a=>`<div class="uc"><span class="ib">${ic(a[0])}</span><span><b>${a[1]}</b><br><small class="m">${a[2]}</small></span></div>`).join('')}</div><div class="cpn-slot"></div><div class="fl">${['All',...G].map((t,i)=>`<button class="${i?'':'on'}" data-f="${t}">${t} <small>${i?cn(t):D.length}</small></button>`).join('')}</div><div class="bg4 bg4x">${D.map(k=>`<div class="gi" data-g="${P[k].x}">${kc(k,'',`<span class="lb">${P[k].x}</span>`)}</div>`).join('')}</div>${gd.length?`<h2 class="sh">Which one is for you?</h2><div class="g3c">${gd.map(a=>`<a class="cd tipc tipl" href="#" data-jump="${a[1]}"><h3>${a[0]}</h3><p class="m">${a[2]}</p><span class="pc2">Shop this type →</span></a>`).join('')}</div>`:''}<div class="biz"><div><h2>Equipping a whole team?</h2><p class="m">Request a bulk quote for headsets, earbuds and speakers.</p></div><a class="bt" href="rfq.html">Request a bulk quote ${ic('arrow')}</a></div>`},
'office-furniture':()=>{const D=inCat('Office Furniture'),G=[...new Set(D.map(k=>P[k].x))],cn=g=>D.filter(k=>P[k].x===g).length;
 return `<section class="chero t2"><div><span class="pill">Office furniture</span><h1>Comfortable desks and chairs for the whole workday</h1><p class="m">Ergonomic chairs, standing desks and storage for offices of every size. Pick a type below or browse everything.</p><div class="hbtn"><a class="bt" href="#" data-jump="Seating">Shop chairs ${ic('arrow')}</a><a class="bo" href="#" data-jump="Desk">Shop desks</a></div></div>${cHero('office-furniture','chair')}${ced}</section><div class="perks">${[['chair','Ergonomic','Designed to keep you comfortable all day.'],['truck','Bulk pricing','Request a quote for a whole team.'],['shield','Warranty','Manufacturer warranty on every item.']].map(a=>`<div class="uc"><span class="ib">${ic(a[0])}</span><span><b>${a[1]}</b><br><small class="m">${a[2]}</small></span></div>`).join('')}</div><div class="cpn-slot"></div><div class="fl">${['All',...G].map((t,i)=>`<button class="${i?'':'on'}" data-f="${t}">${t} <small>${i?cn(t):D.length}</small></button>`).join('')}</div><div class="bg4">${D.map(k=>`<div class="gi" data-g="${P[k].x}">${kc(k,'',`<span class="lb">${P[k].x}</span>`)}</div>`).join('')}</div><h2 class="sh">How to choose</h2><div class="g3c">${[['Chairs','Look for adjustable lumbar support and armrests.'],['Desks','A sit-stand desk lets you change posture through the day.'],['Meeting tables','Allow about 60cm of table width per seat.']].map(a=>`<div class="cd tipc"><h3>${a[0]}</h3><p class="m">${a[1]}</p></div>`).join('')}</div><div class="biz"><div><h2>Fitting out a whole office?</h2><p class="m">Request a bundle quote and we will price everything together.</p></div><a class="bt" href="rfq.html">Request a bundle quote ${ic('arrow')}</a></div>`},
printers:()=>{const D=inCat('Printers'),G=[...new Set(D.map(k=>P[k].x))],cn=g=>D.filter(k=>P[k].x===g).length;
 return `<section class="chero t3"><div><span class="pill">Printers</span><h1>Find the right printer in seconds</h1><p class="m">Tell us what you print most and we will narrow it down.</p><h4 class="nh">I need a printer for…</h4><div class="needs">${[['printer','Office documents','Fast laser printing, two-sided.','Office'],['bolt','Low cost per page','Refillable ink tanks for home or studio.','Ink tank'],['plug','Labels & shipping','Compact label printers.','Labels']].map(a=>`<a class="need" href="#" data-jump="${a[3]}"><span class="ib">${ic(a[0])}</span><span><b>${a[1]}</b><br><small class="m">${a[2]}</small></span></a>`).join('')}</div></div>${cHero('printers','printer')}${ced}</section><div class="cpn-slot"></div><div class="fl">${['All',...G].map((t,i)=>`<button class="${i?'':'on'}" data-f="${t}">${t} <small>${i?cn(t):D.length}</small></button>`).join('')}</div><div class="bg4">${D.map(k=>`<div class="gi" data-g="${P[k].x}">${kc(k,'',`<span class="lb">${P[k].x}</span>`)}</div>`).join('')}</div><h2 class="sh">Compare at a glance</h2><div class="tw"><table><tr><th>Model</th><th>Type</th><th>Highlights</th><th>Price</th><th></th></tr>${D.map(k=>`<tr><td><b>${P[k].n}</b><br><small class="m">${P[k].b}</small></td><td>${tgs(k)}</td><td>${P[k].s}</td><td><b>${M(base(k))}</b></td><td>${add(k)}</td></tr>`).join('')}</table></div><div class="biz"><div><h2>Printing for a team?</h2><p class="m">Get volume pricing and one invoice for the whole office.</p></div><a class="bt" href="rfq.html">Request a bulk quote ${ic('arrow')}</a></div>`},
accessories:()=>{const D=inCat('Accessories'),G=[...new Set(D.map(k=>P[k].x))],cn=g=>D.filter(k=>P[k].x===g).length;
 return `<section class="chero t1"><div><span class="pill">Accessories</span><h1>Everything that completes your setup</h1><p class="m">Hubs, chargers and cables, picked to work with the rest of your kit.</p><h4 class="nh">Works with</h4><div class="needs nrow">${[['laptop','Laptops','cat-laptops.html'],['phone','Phones','cat-phones.html'],['printer','Printers','cat-printers.html']].map(a=>`<a class="need" href="${a[2]}"><span class="ib">${ic(a[0])}</span><span><b>${a[1]}</b></span></a>`).join('')}</div></div>${cHero('accessories','hub')}${ced}</section><div class="perks">${[['bolt','Fast charging','GaN chargers and power banks up to 140W.'],['plug','Fits your devices','Hubs, docks and cables for laptops and phones.'],['shield','Warranty','Manufacturer warranty on every item.']].map(a=>`<div class="uc"><span class="ib">${ic(a[0])}</span><span><b>${a[1]}</b><br><small class="m">${a[2]}</small></span></div>`).join('')}</div><div class="cpn-slot"></div><div class="fl">${['All',...G].map((t,i)=>`<button class="${i?'':'on'}" data-f="${t}">${t} <small>${i?cn(t):D.length}</small></button>`).join('')}</div><div class="bg4 bg4x">${D.map(k=>`<div class="gi" data-g="${P[k].x}">${kc(k,'',`<span class="lb">${P[k].x}</span>`)}</div>`).join('')}</div><div class="biz"><div><h2>Bulk pricing</h2><p class="m">${M(unit('hub',25))} each from 25 units.</p></div><a class="bt" href="rfq.html">Request a quote ${ic('arrow')}</a></div>`}};
document.addEventListener('click',e=>{const T=e.target;let x;
 if(x=T.closest('.kx')){const k=x.dataset.k;if(addToCart(k))toast(`${x.dataset.n} added to your cart`);return}
 if(x=T.closest('[data-rail]')){const r=$('.rail',x.closest('.c3'));r.scrollBy({left:+x.dataset.rail*r.clientWidth*.8,behavior:'smooth'});return}
 if(x=T.closest('[data-jump]')){e.preventDefault();const b=$(`.fl button[data-f="${x.dataset.jump}"]`,x.closest('.cat'));if(b){b.click();b.scrollIntoView({behavior:'smooth',block:'center'})}return}
 if(x=T.closest('.fl button')){const s=x.closest('.cat');$$('.fl button',s).forEach(b=>b.classList.toggle('on',b===x));if(!CS.get(s)&&s.id)CS.set(s,{q:'',br:new Set(),pr:0,so:0,ty:'All',th:CTH[s.id.replace('cat-','')]||[100,500]});const st=CS.get(s);if(st){st.ty=x.dataset.f;cpnApply(s)}}});
const fixLinks=(r=document)=>$$('.pc a.ph,a[data-p]',r).forEach(a=>{const k=a.dataset.p||a.closest('.pc').dataset.k;if(k)a.setAttribute('href',PU(k))});
/* panel lọc / sắp xếp dùng chung cho 6 trang danh mục: tìm kiếm, thương hiệu, mức giá, sắp xếp, loại (.fl) */
const CS=new WeakMap(),CTH={phones:[600,1000],laptops:[1000,1500],audio:[100,250],'office-furniture':[150,400],printers:[200,400],accessories:[40,100]};
const cpnItems=s=>{const o=[],seen=new Set();$$('.kx[data-k]',s).forEach(b=>{const el=b.closest('.gi')||b.closest('.lrow,.kc,tr');if(el&&!seen.has(el)){seen.add(el);o.push({el,k:b.dataset.k})}});return o};
const rnum=k=>parseFloat(P[k].r||rt(k))||0;
function cpnHTML(id,s){const ks=[...new Set(cpnItems(s).map(i=>i.k))],bc={};ks.forEach(k=>bc[P[k].b]=(bc[P[k].b]||0)+1);
 const br=Object.keys(bc).sort((a,b)=>bc[b]-bc[a]||a.localeCompare(b)),t=CTH[id]||[100,500],pr=['All prices','Under '+M(t[0]),M(t[0])+' – '+M(t[1]),M(t[1])+' and up'];
 return `<section class="cpn" aria-label="Filters and sorting"><div class="cpn-top"><label class="fld cpn-q">${ic('search')}<input type="search" placeholder="Search in this category" aria-label="Search in this category" autocomplete="off"></label><label class="fld cpn-so"><select aria-label="Sort by"><option value="0">Recommended</option><option value="1">Price: Low to High</option><option value="2">Price: High to Low</option><option value="3">Top rated</option></select></label></div><div class="cpn-body"><div><h4>Brand</h4><div class="cpn-ch">${br.map(b=>`<button type="button" class="cpc" data-br="${esc(b)}" aria-pressed="false">${esc(b)} <small>${bc[b]}</small></button>`).join('')}</div></div><div><h4>Price</h4><div class="cpn-ch">${pr.map((p,i)=>`<button type="button" class="cpc${i?'':' on'}" data-pr="${i}" aria-pressed="${i?'false':'true'}">${p}</button>`).join('')}</div></div></div><div class="cpn-ft"><span class="m cpn-n"></span><button type="button" class="cpn-r">Reset filters</button></div><p class="m cpn-e" hidden>No devices match these filters. Try Reset filters.</p></section>`}
function cpnApply(s){const st=CS.get(s);if(!st)return;const its=cpnItems(s),q=st.q.trim().toLowerCase(),a=st.th[0],b=st.th[1];
 const okp=v=>st.pr===0||(st.pr===1?v<a:st.pr===2?v>=a&&v<b:v>=b);
 const cmp=(x,y)=>st.so===1?base(x.k)-base(y.k):st.so===2?base(y.k)-base(x.k):st.so===3?rnum(y.k)-rnum(x.k):0;
 const gr=new Map();its.forEach(i=>{const p=i.el.parentNode;if(!gr.has(p))gr.set(p,[]);gr.get(p).push(i)});
 gr.forEach((l,p)=>{if(l.length<2)return;const anchor=l[l.length-1].el.nextSibling;l.slice().sort((x,y)=>cmp(x,y)||x.el.dataset.o-y.el.dataset.o).forEach(i=>p.insertBefore(i.el,anchor))});
 const ks=new Set();its.forEach(i=>{const p=P[i.k],ok=(st.ty==='All'||p.x===st.ty)&&(!st.br.size||st.br.has(p.b))&&okp(base(i.k))&&(!q||(p.n+' '+p.b+' '+p.s+' '+p.x).toLowerCase().includes(q));i.el.style.display=ok?'':'none';if(ok)ks.add(i.k)});
 $$('.band',s).forEach(bd=>bd.style.display=$$('.kc',bd).some(c=>c.style.display!=='none')?'':'none');
 const n=ks.size,c=$('.cpn-n',s),e=$('.cpn-e',s);if(c)c.textContent=n+(n==1?' product':' products');if(e)e.hidden=n>0}
function cpnReset(s){const st=CS.get(s);if(!st)return;st.q='';st.pr=0;st.so=0;st.ty='All';st.br.clear();$('.cpn-q input',s).value='';$('.cpn-so select',s).value='0';
 $$('.cpc',s).forEach(b=>{const on=b.dataset.pr==='0';b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)});$$('.fl button',s).forEach((b,i)=>b.classList.toggle('on',!i));cpnApply(s)}
function initPanel(s,id){cpnItems(s).forEach((i,x)=>i.el.dataset.o=x);const slot=$('.cpn-slot',s);if(!slot)return;slot.outerHTML=cpnHTML(id,s);CS.set(s,{q:'',br:new Set(),pr:0,so:0,ty:'All',th:CTH[id]||[100,500]});cpnApply(s)}
document.addEventListener('click',e=>{let x;const T=e.target;if(!T.closest)return;
 if(x=T.closest('.cpc')){const s=x.closest('.cat'),st=s&&CS.get(s);if(!st)return;
  if(x.dataset.br!=null){const on=!st.br.has(x.dataset.br);if(on)st.br.add(x.dataset.br);else st.br.delete(x.dataset.br);x.classList.toggle('on',on);x.setAttribute('aria-pressed',on)}
  else{st.pr=+x.dataset.pr;$$('.cpc[data-pr]',s).forEach(b=>{const on=b===x;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on)})}
  cpnApply(s);return}
 if(x=T.closest('.cpn-r')){cpnReset(x.closest('.cat'))}});
document.addEventListener('input',e=>{const i=e.target.closest&&e.target.closest('.cpn-q input');if(!i)return;const s=i.closest('.cat'),st=CS.get(s);if(st){st.q=i.value;cpnApply(s)}});
document.addEventListener('change',e=>{const i=e.target.closest&&e.target.closest('.cpn-so select');if(!i)return;const s=i.closest('.cat'),st=CS.get(s);if(st){st.so=+i.value;cpnApply(s)}});
/* số sản phẩm trên thẻ danh mục ở trang chủ lấy từ dữ liệu thật thay vì con số gõ cứng */
function tileCounts(){Object.keys(NM).forEach(id=>$$('a.tile[href="cat-'+id+'.html"] small').forEach(el=>{const n=inCat(NM[id]).length;el.textContent=n+(n===1?' product':' products')+' →'}))}
function catInit(){Object.keys(NM).forEach(id=>{if(cdel().includes(id))return;const s=$('#cat-'+id);if(s)s.innerHTML=`<p class="cr m"><a href="index.html">Home</a> &nbsp;/&nbsp; <a href="index.html">Find your kind of tech</a> &nbsp;/&nbsp; ${NM[id]}</p><nav class="cn" aria-label="Categories">${catNav().map(c=>`<a href="cat-${c}.html"${c===id?' class="on"':''}>${NM[c]}</a>`).join('')}</nav>`+R[id]();if(s)initPanel(s,id)});tileCounts();applyCatImgs();wlSync();fixLinks()}

/* init */
sync();wlSync();
syncCats();if($('#shop')){if(QS.get('q')){F.q=QS.get('q').toLowerCase().trim();const h=$('#hs');if(h)h.value=QS.get('q')}if(QS.get('wl'))F.wl=1;if(QS.get('cat'))setCat(QS.get('cat'))}
shop();if($('#checkout')){addrInit();step(1)}if($('#rfq'))rfq();if(pr){const k0=QS.get('k');showProduct(P[k0]?k0:(P.laptop?'laptop':Object.keys(P)[0]));if(QS.get('tab')==='rv'){tabs(2);const tb=$('.tabs',pr);if(tb)tb.scrollIntoView({block:'start'})}}catInit();fixLinks();{const r=$(`#checkout .pm input[data-m="${payM}"]`);if(r)r.checked=true}if($('#checkout'))payUpdate();

/* ===== v7: roles, access control, admin tools, settings ===== */
/* v8: Customer sign-in and Admin sign-in are separate pages (#login / #admin-login) */
{
const slug=n=>n.normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'').slice(0,24)||'item';
const SEED=[{name:'Alex Morgan',email:'alex.morgan@northstarlabs.com',company:'Northstar Labs',role:'customer',status:'Active',s:'5483b3c568987d6e',ph:'cfd29c8db344bf758f319d1a1b0d6280582edea3d1ebef3843686e5badfb9449'},{name:'Casey Reed',email:'casey@cedarhealth.com',company:'Cedar Health',role:'customer',status:'Invited',s:'5d5f0d55c1f36652',ph:'8070f222effcea648dbd1e4fa3f6ba7e8bf52c143fc68c1256f7181a434f6673'},{name:'Jordan Blake',email:'jordan@brightworks.co',company:'BrightWorks',role:'customer',status:'Inactive',s:'ee054fe0a35f2b82',ph:'65064d37c4170902e0d2cbce9ae8829456421f1c0341c0db70224bc43fd05ae5'}];
const rs=()=>{try{return Array.from(crypto.getRandomValues(new Uint8Array(8))).map(b=>('0'+b.toString(16)).slice(-2)).join('')}catch(e){return Math.random().toString(16).slice(2,18)}},mk=pw=>{const s=rs();return{s,ph:sha256(s+':'+pw)}},pwOk=(u,pw)=>!!u.ph&&u.ph===sha256(u.s+':'+pw);
const users=()=>{let u=S.get('users',null);if(!u){u=SEED;S.set('users',u)}if(u.some(q=>q.pw)){u.forEach(q=>{if(q.pw){Object.assign(q,mk(q.pw));delete q.pw}});S.set('users',u)}return u};
const me=()=>SRV?SU:S.get('sess',null),role=()=>{const s=me();return s?s.role:'guest'},go=id=>{flashLast();location.href=U(id)},rep=id=>location.replace(U(id));window.TDEV_ME=me;
const cfg=()=>Object.assign({site:'TDev',annOn:false,ann:'Free delivery on orders over $500.',brand:'#3B5BFF',hero:'',heroSub:'',mnt:false,adminTheme:'system',dense:false,aName:'',aOrder:true,aQuote:true,aStock:true},S.get('cfg',{}));
const prefs=()=>Object.assign({theme:'system',size:'100',rm:false,orders:true,promo:false},S.get('pref-'+(me()?me().email:'guest'),{}));
const ini=n=>n.split(/\s+/).map(w=>w[0]).slice(0,2).join('').toUpperCase();
const FD=(id,l,v='',t='text')=>`<label class="fld"><small>${l}</small><input id="${id}" type="${t}" value="${esc(String(v))}"></label>`;
const SL=(id,l,o,v)=>`<label class="fld"><small>${l}</small><select id="${id}">${o.map(x=>`<option${x===v?' selected':''}>${x}</option>`).join('')}</select></label>`;
const SW=(id,l,on,d='')=>`<label class="ck sw2"><input type="checkbox" id="${id}"${on?' checked':''}><span><b>${l}</b>${d?`<br><small class="m">${d}</small>`:''}</span></label>`;
const v=id=>$('#'+id).value,ck=id=>$('#'+id).checked;
function modal(t,b,f){mclose();const m=document.createElement('div');m.className='mdl';m.innerHTML=`<div class="cd" role="dialog" aria-modal="true"><div class="hx"><h2>${t}</h2><button class="x2" data-mc aria-label="Close">✕</button></div>${b}<p class="er" hidden></p><div class="mf">${f}</div></div>`;document.body.appendChild(m);const i=$('input,select',m);if(i)i.focus()}
const mclose=()=>$$('.mdl').forEach(m=>m.remove()),merr=t=>{const e=$('.mdl .er');e.hidden=false;e.textContent=t};
/* ---------- site settings, theme ---------- */
function shade(h,a){const n=parseInt(h.slice(1),16),f=x=>Math.max(0,Math.min(255,Math.round(x*(1+a))));return'#'+[16,8,0].map(s=>f((n>>s)&255).toString(16).padStart(2,'0')).join('')}
function applySite(){const c=cfg(),r=document.documentElement;
 if(c.brand&&c.brand.toLowerCase()!=='#3b5bff'){r.style.setProperty('--p',c.brand);r.style.setProperty('--p2',shade(c.brand,-.18))}else{r.style.removeProperty('--p');r.style.removeProperty('--p2')}
 $$('.lg').forEach(l=>{const b=$('b',l);if(b)b.textContent=c.site[0]||'T';[...l.childNodes].filter(n=>n.nodeType===3).forEach(n=>n.textContent=c.site)});document.title=(document.body.dataset.title?document.body.dataset.title+' · ':'')+c.site+' Electronics Demo';
 let a=$('#ann');if(c.annOn&&c.ann.trim()){if(!a){a=document.createElement('div');a.id='ann';a.className='ann';$('.hd').before(a)}a.textContent=c.ann}else if(a)a.remove();
 const h=$('#home .hero h1'),hp=$('#home .hero p');if(!(window.TDevHero&&TDevHero.custom())){if(h&&c.hero)h.textContent=c.hero;if(hp&&c.heroSub)hp.textContent=c.heroSub}
 document.body.classList.toggle('dense',c.dense)}
function applyTheme(){const adm=PAGE.startsWith('a-'),p=adm?cfg().adminTheme:prefs().theme,t=p==='dark'||p==='light'?p:(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');document.documentElement.dataset.theme=t;
 const pf=adm?{size:'100',rm:false}:prefs();document.body.style.zoom=pf.size==='100'?'':String(+pf.size/100);document.documentElement.classList.toggle('rm',!!pf.rm)}
function mnt(){let o=$('#mnt');const on=cfg().mnt&&role()!=='admin'&&!['admin-login','admin-register'].includes(PAGE);if(on&&!o)document.body.insertAdjacentHTML('beforeend','<div id="mnt"><div class="cd"><h2>We’ll be right back</h2><p class="m">TDev is being updated. Please check again soon.</p><a class="bo" href="admin-login.html">Staff sign in</a></div></div>');else if(!on&&o)o.remove()}
/* ---------- auth ---------- */
/* ---------- auth UI: customer + admin ---------- */
const FE=(i,m)=>{const f=i.closest('.fld');if(!f)return;f.classList.toggle('bad',!!m);const e=$('.fe',f);if(e)e.textContent=m||''};
const FM=(sec,h)=>{const e=$(sec+' .fm');if(!e)return;e.hidden=!h;e.innerHTML=h||''};
const busy=(b,on,t)=>{if(on){b.dataset.t=b.innerHTML;b.innerHTML='<span class="spn"></span>'+t;b.classList.add('ld')}else{b.classList.remove('ld');if(b.dataset.t)b.innerHTML=b.dataset.t}};
const EM=/^\S+@\S+\.\S+$/,gf=(sec,n)=>$(sec+` [data-f="${n}"]`);
function resetAuth(id){const sec='#'+id;$$(sec+' .fld.bad').forEach(f=>f.classList.remove('bad'));FM(sec,'');
 if(id==='login'||id==='admin-login'){gf(sec,'pw').value=''}
 $$(sec+' [data-eye]').forEach(b=>{b.previousElementSibling.type='password';b.textContent='Show'})}
const AUTH_MSG={bad_credentials:'Username/email or password is incorrect.',rate_limited:'Too many attempts. Please wait 15 minutes and try again.',weak_password:'Use 8+ characters with a number and a capital letter.',email_taken:'An account with this email already exists. Sign in instead.',bad_invite:'That invite code isn’t valid or has expired. Ask an existing admin for a new one.',invalid:'Please check your details and try again.',forbidden:'Request blocked. Reload the page and try again.'};
const DEMO_ADMIN={u:'nhom3',p:'123456'}; /* tài khoản admin mặc định cho chế độ demo (mở file tĩnh) */
const NOSRV='Admin accounts need the TDev server for real security. Run <b>npm start</b> and open the site from that address.';
const api=(u,b,m)=>fetch(u,{method:m||'POST',credentials:'same-origin',headers:{'content-type':'application/json'},body:b?JSON.stringify(b):undefined}).then(async r=>{const j=await r.json().catch(()=>null);return Object.assign({},j&&!Array.isArray(j)?j:{},{ok:r.ok,status:r.status,data:j})});
function arrive(u,portal){if(SRV)SU=u;applyAuth();applyTheme();const nx=sessionStorage.getItem('next');sessionStorage.removeItem('next');
 toast(portal==='admin'?'Signed in to the Admin console, '+u.name.split(' ')[0]:'Welcome back, '+u.name.split(' ')[0]);if(portal!=='admin'&&nx&&/^product\.html\?/.test(nx)){flashLast();location.href=nx;return}go(portal==='admin'?'a-dash':(nx||'account'))}
function doLogin(portal){const sec=portal==='admin'?'#admin-login':'#login',ei=gf(sec,'email'),pi=gf(sec,'pw'),btn=$(sec+' [data-go]');
 FM(sec,'');FE(ei,'');FE(pi,'');const em=ei.value.trim(),pw=pi.value;let good=true;
 if(portal==='admin'?!em:!EM.test(em)){FE(ei,portal==='admin'?'Enter your username or email.':'Enter a valid email address.');good=false}
 if(!pw){FE(pi,'Enter your password.');good=false}
 if(!good){(ei.closest('.fld').classList.contains('bad')?ei:pi).focus();return}
 busy(btn,true,'Signing in…');
 if(SRV){api('/api/auth/login',{email:em,password:pw,portal}).then(r=>{busy(btn,false);if(!r.ok)return FM(sec,AUTH_MSG[r.code]||AUTH_MSG.invalid);arrive(r.user,portal)}).catch(()=>{busy(btn,false);FM(sec,'Can’t reach the server. Please try again.')});return}
 setTimeout(()=>{busy(btn,false);
  if(portal==='admin'){if(em.toLowerCase()===DEMO_ADMIN.u&&pw===DEMO_ADMIN.p){const a={email:DEMO_ADMIN.u,name:'Nhom 3',role:'admin',company:'TDev'};S.set('sess',a);return arrive(a,portal)}
   const ad=users().find(q=>q.role==='admin'&&q.email.toLowerCase()===em.toLowerCase());if(ad&&ad.status!=='Inactive'&&pwOk(ad,pw)){const a={email:ad.email,name:ad.name,role:'admin',company:ad.company};S.set('sess',a);return arrive(a,portal)}return FM(sec,AUTH_MSG.bad_credentials)}
  const u=users().find(q=>q.email.toLowerCase()===em.toLowerCase());
  if(!u||u.role==='admin'||u.status==='Inactive'||!pwOk(u,pw))return FM(sec,AUTH_MSG.bad_credentials); /* một thông báo chung, không lộ tài khoản/vai trò */
  S.set('sess',{email:u.email,name:u.name,role:u.role,company:u.company});arrive(u,portal)},350)}
function doReg(){const sec='#register',g=n=>gf(sec,n),bads=[];FM(sec,'');
 const chk=(n,t,m)=>{const i=g(n),v=i.type==='password'?i.value:i.value.trim();FE(i,'');if(!t(v)){FE(i,m);bads.push(i)}};
 chk('fn',v=>v.length>0,'Enter your first name.');chk('ln',v=>v.length>0,'Enter your last name.');
 chk('email',v=>EM.test(v),'Enter a valid email address.');
 if(!SRV&&!bads.includes(g('email'))&&users().some(q=>q.email.toLowerCase()===g('email').value.trim().toLowerCase())){FE(g('email'),AUTH_MSG.email_taken);bads.push(g('email'))}
 chk('ph',v=>v.replace(/\D/g,'').length>=7,'Enter a valid phone number.');
 chk('pw',v=>v.length>=8&&/\d/.test(v)&&/[A-Z]/.test(v),AUTH_MSG.weak_password);
 chk('pw2',v=>v===g('pw').value,'Passwords don’t match.');
 const terms=$('#rg-terms').checked;if(!terms)FM(sec,'Please accept the Terms of Service and Privacy Policy to continue.');
 if(bads.length){bads[0].focus();return}if(!terms)return;
 const btn=$(sec+' [data-go]'),name=g('fn').value.trim()+' '+g('ln').value.trim(),email=g('email').value.trim();busy(btn,true,'Creating account…');
 const done=u=>{if(SRV)SU=u;applyAuth();applyTheme();toast('Account created. Welcome to TDev, '+g('fn').value.trim()+'!');go('account')};
 if(SRV){api('/api/auth/register',{email,name,phone:g('ph').value.trim(),password:g('pw').value}).then(r=>{busy(btn,false);
   if(!r.ok){if(r.code==='email_taken'){FE(g('email'),AUTH_MSG.email_taken);g('email').focus()}else FM(sec,AUTH_MSG[r.code]||AUTH_MSG.invalid);return}done(r.user)}).catch(()=>{busy(btn,false);FM(sec,'Can’t reach the server. Please try again.')});return}
 setTimeout(()=>{busy(btn,false);const u=users();
  u.push(Object.assign({name,email,role:'customer',status:'Active'},mk(g('pw').value)));S.set('users',u);
  S.set('sess',{email,name,role:'customer'});done({name,email,role:'customer'})},350)}
function doAdminReg(){const sec='#admin-register',g=n=>gf(sec,n),bads=[];FM(sec,'');
 const chk=(n,t,m)=>{const i=g(n),v=i.type==='password'?i.value:i.value.trim();FE(i,'');if(!t(v)){FE(i,m);bads.push(i)}};
 chk('name',v=>v.length>1,'Enter your full name.');
 chk('email',v=>EM.test(v),'Enter a valid work email.');
 chk('code',v=>v.length>0,'Enter your invite code.');
 chk('pw',v=>v.length>=12&&/\d/.test(v)&&/[A-Z]/.test(v)&&/[a-z]/.test(v),'Use 12+ characters with upper-case, lower-case and a number.');
 chk('pw2',v=>v===g('pw').value,'Passwords don’t match.');
 const ok2=$('#ag-terms').checked;if(!ok2)FM(sec,'Please confirm you understand the access this account has.');
 if(bads.length){bads[0].focus();return}if(!ok2)return;
 if(!SRV){const em=g('email').value.trim().toLowerCase(),code=g('code').value.trim(),L=lInv(),dflt=nc(code)===nc('nguyenvantu');
  const inv=dflt?null:L.find(i=>i.h===ivh(code));
  if(!dflt&&(!inv||ivSt(inv)!=='active'||(inv.email&&inv.email!==em))){FE(g('code'),AUTH_MSG.bad_invite);g('code').focus();return}
  if(users().some(q=>q.email.toLowerCase()===em)){FE(g('email'),AUTH_MSG.email_taken);g('email').focus();return}
  const btn=$(sec+' [data-go]'),name=g('name').value.trim();busy(btn,true,'Creating account…');
  setTimeout(()=>{busy(btn,false);if(inv){inv.used=Date.now();inv.used_email=em;S.set('invites',L)}
   const u=users();u.push(Object.assign({name,email:em,company:'TDev',role:'admin',status:'Active'},mk(g('pw').value)));S.set('users',u);
   const a={email:em,name,role:'admin',company:'TDev'};S.set('sess',a);applyAuth();applyTheme();toast('Admin account created. Welcome, '+name.split(' ')[0]+'!');go('a-dash')},350);return}
 const btn=$(sec+' [data-go]');busy(btn,true,'Creating account…');
 api('/api/auth/register-admin',{email:g('email').value.trim(),name:g('name').value.trim(),password:g('pw').value,code:g('code').value.trim()}).then(r=>{busy(btn,false);
  if(!r.ok){if(r.code==='bad_invite'){FE(g('code'),AUTH_MSG.bad_invite);g('code').focus()}else if(r.code==='weak_password')FE(g('pw'),'Use 12+ characters with upper-case, lower-case and a number.');else FM(sec,AUTH_MSG[r.code]||AUTH_MSG.invalid);return}
  SU=r.user;applyAuth();applyTheme();toast('Admin account created. Welcome, '+r.user.name.split(' ')[0]+'!');go('a-dash')}).catch(()=>{busy(btn,false);FM(sec,'Can’t reach the server. Please try again.')})}
document.addEventListener('click',e=>{const T=e.target,c=q=>T.closest(q);let x;
 if(x=c('[data-go]')){e.preventDefault();const fn=({login:()=>doLogin('customer'),admin:()=>doLogin('admin'),register:doReg,adminreg:doAdminReg})[x.dataset.go];if(fn)fn();return}
 if(x=c('[data-eye]')){const i=x.previousElementSibling,h=i.type==='password';i.type=h?'text':'password';x.textContent=h?'Hide':'Show';x.setAttribute('aria-label',h?'Hide password':'Show password');return}
 if(c('[data-google]')){toast('Google sign-in isn’t part of this demo. Use the email form.');return}
 if(c('[data-fill]')){const n=Math.floor(100+Math.random()*900),set=(k,v)=>{gf('#register',k).value=v};
  set('fn','Taylor');set('ln','Brooks');set('email','taylor.brooks'+n+'@example.com');set('ph','+1 (415) 555-0188');set('pw','Demo-pass-2026');set('pw2','Demo-pass-2026');
  $('#rg-terms').checked=true;$$('#register .fld.bad').forEach(q=>q.classList.remove('bad'));FM('#register','');gf('#register','pw').dispatchEvent(new Event('input',{bubbles:true}))}});
document.addEventListener('input',e=>{const i=e.target,f=i.closest&&i.closest('.auth-form');if(!f)return;FE(i,'');FM('#'+f.closest('.pg').id,'');
 if(i.dataset.f==='pw'&&$('.sbar',f)){const v=i.value;let n=0;if(v.length>=8)n++;if(/\d/.test(v))n++;if(/[A-Z]/.test(v)&&/[a-z]/.test(v))n++;if(/[^A-Za-z0-9]/.test(v)||v.length>=12)n++;
  const m=Math.max(1,n);$('.sbar',f).dataset.s=v?m:0;$('.sl2',f).textContent=v?['','Weak','Okay','Strong','Very strong'][m]:f.closest('#admin-register')?'Use 12+ characters with upper-case, lower-case and a number.':'Use 8+ characters with a number and a capital letter.'}});
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.matches('.auth-form .fld input')){e.preventDefault();$('[data-go]',e.target.closest('.auth-form')).click()}});
const SIC={'Overview':'grid','Orders':'box','Wishlist':'heart','My Quotes':'file','Profile & addresses':'user','Settings':'gear','Sign out':'undo'};
const sideHTML=(on,s)=>`<span class="av">${ini(s.name)}</span><h3>${esc(s.name)}</h3><p class="m">${esc(s.company||'')}</p><span class="rb c">Customer</span><hr>`+[['Overview','#account','overview'],['Orders','#account','orders'],['Wishlist','#account','wishlist'],['My Quotes','#quotes',''],['Profile & addresses','#account','profile'],['Settings','#settings',''],['Sign out','#login','']].map(([t,h,v])=>`<a class="${t===on?'on':''}" href="${h.slice(1)}.html"${v?` data-view="${v}"`:''}>${SIC[t]?`<svg class="i"><use href="#i-${SIC[t]}"/></svg>`:''}<span>${t.replace('&','&amp;')}</span></a>`).join('');
let accView=['overview','orders','wishlist','profile'].includes(QS.get('view'))?QS.get('view'):'overview';
function setView(v){accView=v||accView;const a=$('#account');if(!a)return;$$('#account [data-v]').forEach(e=>e.classList.toggle('vh',!e.dataset.v.split(' ').includes(accView)));$$('#account .side a[data-view]').forEach(l=>l.classList.toggle('on',l.dataset.view===accView));const s=me();if(s){const w=$('#account [data-p="who"]');if(w)w.innerHTML=`${esc(s.name)} · ${esc(s.company||'')}<br>${esc(s.email)}`}}
document.addEventListener('click',e=>{const l=e.target.closest('a[data-view]');if(!l)return;e.preventDefault();accView=l.dataset.view;if(PAGE==='account'){setView(accView);window.scrollTo({top:0,behavior:'smooth'})}else location.href=U('account')+'?view='+accView});
document.addEventListener('click',e=>{const m=$('#acm');if(!m)return;const a=e.target.closest('.hd a[aria-label="Account"]');if(a&&role()==='customer'){e.preventDefault();m.hidden=!m.hidden;return}if(!e.target.closest('#acm')||e.target.closest('#acm a'))m.hidden=true});
addEventListener('hashchange',()=>{const m=$('#acm');if(m)m.hidden=true});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const m=$('#acm');if(m)m.hidden=true}});
function fillCheckout(s){if(!$('#checkout')||!s)return;const seed=(i,v)=>{if(i&&v!=null&&i.dataset.f!=='1'){i.value=v;i.dataset.f='1'}},f=$$('#checkout [data-step="1"] .fld input');seed(f[0],s.name);seed(f[1],s.company||'');seed(f[2],s.email);seed($('#ch'),s.name);seed($('#ppm'),s.email);seed($('#n3c'),s.company||'');seed($('#ad-ph'),s.phone)}
function applyAuth(){const s=me(),r=role();document.body.dataset.role=r;if(s&&r==='customer')fillCheckout(s);
 const a=$('.hd .ico a[aria-label="Account"]');if(a)a.href=U(r==='admin'?'a-dash':r==='customer'?'account':'login');
 if(!$('#adm'))$('.hd .ico').insertAdjacentHTML('afterbegin','<a class="ib2" id="adm" href="a-dash.html" aria-label="Admin console" title="Admin console"><svg class="i"><use href="#i-grid"/></svg></a>');
 if(!$('.sb [href="a-set.html"]')){const w=$('.sb .ws');w.insertAdjacentHTML('beforebegin','<a href="a-set.html"><svg class="i"><use href="#i-grid"/></svg>Settings</a>')}
 if(!$('.sb .sv')){const w2=$('.sb .ws');w2.insertAdjacentHTML('beforebegin','<a class="sv" href="index.html"><svg class="i"><use href="#i-home"/></svg>View storefront</a>')}
 const rt=$('#rbt');if(rt&&s)rt.textContent=`Signed in as ${cfg().aName||s.name} (Admin). You are viewing the storefront; cart, checkout and quotes are disabled for admin accounts.`;
 $$('.ur').forEach(u=>{if(!$('.rb',u))u.insertAdjacentHTML('afterbegin','<span class="rb a"><svg class="i"><use href="#i-shield"/></svg>Admin</span>');if(!$('.so',u))u.insertAdjacentHTML('beforeend','<button class="so" type="button">Sign out</button>');const av=$('.av',u);if(s&&r==='admin'){const n=cfg().aName||s.name;if(av)av.textContent=ini(n);[...u.childNodes].filter(x=>x.nodeType===3).forEach(x=>x.textContent=' '+n+' ')}});
 if(s&&r==='customer'){const f=s.name.split(' ')[0];{const h1=$('#account h1');if(h1)h1.textContent=`Hey ${f}, welcome back.`}  const c=$('#account .hx.cd');if(c){$('h3',c).textContent=s.company||s.name;$('p.m',c).innerHTML=`${esc(s.name)} · Customer<br>${esc(s.email)}`}
  [['account','Overview'],['quotes','My Quotes'],['settings','Settings']].forEach(([id,on])=>{const sd=$('#'+id+' .side');if(sd)sd.innerHTML=sideHTML(on,s)});
  const ep=$('a.bo',c||document.createElement('i'));if(ep){ep.setAttribute('href',U('settings'));ep.removeAttribute('role');ep.textContent='Edit profile & settings'}
  const am=$('#acm')||$('.hd .ico').appendChild(Object.assign(document.createElement('div'),{id:'acm',hidden:true}));am.setAttribute('role','menu');
  am.innerHTML=`<div class="acm-h"><span class="av sm2">${ini(s.name)}</span><span><b>${esc(s.name)}</b><small class="m">${esc(s.email)}</small></span></div><a href="account.html"><svg class="i"><use href="#i-user"/></svg>My account</a><a href="quotes.html"><svg class="i"><use href="#i-file"/></svg>My quotes</a><a href="settings.html"><svg class="i"><use href="#i-gear"/></svg>Settings</a><hr><a href="login.html"><svg class="i"><use href="#i-undo"/></svg>Sign out</a>`;am.className='acm'}
 else{const am=$('#acm');if(am){am.hidden=true;am.remove()}}
 if(r==='admin'){const n=(cfg().aName||s.name).split(' ')[0];{const h1=$('#a-dash h1');if(h1)h1.textContent=`Hello, ${n}.`}}}
function logout(){const was=role(),to=was==='admin'?'admin-login':'login';toast('You’ve been signed out');
 if(SRV){api('/api/auth/logout').catch(()=>{}).then(()=>{SU=null;go(to)})}else{S.set('sess',null);applyAuth();applyTheme();go(to)}}
document.addEventListener('click',e=>{const T=e.target,c=s=>T.closest(s);let x;
 if(c('.so')||(c('a[href="login.html"]')&&c('a').textContent.trim()==='Sign out')){e.preventDefault();logout();return}
 if(role()==='admin'&&c('.bx,.kx,[data-add]')){e.preventDefault();e.stopImmediatePropagation();toast('Admins can’t place orders. Sign in as a customer to shop.');return}
 if(x=c('.bx,.kx,[data-add]')){const k=x.matches('[data-add]')?cur:(c('.pc')?c('.pc').dataset.k:x.dataset.k);if(P[k]&&P[k].stock===0){e.preventDefault();e.stopImmediatePropagation();toast(P[k].n+' is out of stock');return}}
 if((x=c('a.pc2'))&&/forgot/i.test(x.textContent)){try{sessionStorage.setItem('flash','Password reset by email isn’t available yet. Contact support and we’ll help you get back in.')}catch(_){}return}
 admin(e,T,c)},true);
document.addEventListener('change',e=>{if(e.target.id==='pf-gl'){const inp=e.target,room=3-pfGl.length,fs=[...inp.files];if(!fs.length)return;if(fs.length>room)merr(`You can add up to 3 extra photos. Only the first ${room} were used.`);Promise.all(fs.slice(0,room).map(f=>readImg(f,640,.74))).then(a=>{pfGl.push(...a);pfGlRender();inp.value='';if(fs.length<=room){const er=$('.mdl .er');if(er)er.hidden=true}}).catch(m=>{inp.value='';merr(m)});return}
 if(e.target.id==='pf-img'){const f=e.target.files&&e.target.files[0];if(!f)return;readImg(f).then(d=>{pfImg=d;pfPreview(d);const er=$('.mdl .er');if(er)er.hidden=true}).catch(m=>{e.target.value='';merr(m)})}
 if(e.target.id==='uf-r')$('#uf-rh small').textContent=RH[e.target.value]});
document.addEventListener('click',e=>{if(e.target.closest('.tt')){const adm=PAGE.startsWith('a-'),t=document.documentElement.dataset.theme;if(adm)S.set('cfg',Object.assign(cfg(),{adminTheme:t}));else S.set('pref-'+(me()?me().email:'guest'),Object.assign(prefs(),{theme:t}))}});
/* ---------- catalog (admin) ---------- */
const P0=JSON.parse(JSON.stringify(P)),clean=o=>{Object.keys(o).forEach(k=>{if(!o[k]||typeof o[k]!=='object')delete o[k]});return o},CD=()=>clean(S.get('cprods',{})),OV=()=>clean(S.get('pov',{})),pdel=()=>S.get('pdel',[]),allDefs=()=>{const d=Object.assign({},P0,CD());pdel().forEach(k=>{delete d[k]});return d};
const DI={Phones:'phone',Laptops:'laptop',Audio:'headphones','Office Furniture':'chair',Printers:'printer',Accessories:'plug'},CN=Object.values(NM);
const phDone=new Set(Object.keys(P).filter(k=>P[k].i));
function phCss(k){const p=P[k];if(!p||!p.i||phDone.has(k))return;const s=document.getElementById('i-'+p.i);if(!s)return;phDone.add(k);const g=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#5B78FF" stroke-width="1" stroke-linecap="round" stroke-linejoin="round">${s.innerHTML}</svg>`;const st=document.createElement('style');st.textContent=`.ph.${k}{background-image:url("data:image/svg+xml,${encodeURIComponent(g)}");background-repeat:no-repeat;background-size:32%;background-color:var(--t${p.t||1})}`;document.head.appendChild(st)}
        const cardHtml = k => { const p = P[k]; return `<div class="pc" data-k="${k}"><a class="ph ${k}" href="${PU(k)}"><svg class="i hr"><use href="#i-heart"/></svg></a><small class="br">${esc(p.b).toUpperCase()}</small><b>${esc(p.n)}</b><p class="sp">${esc(p.s)}<br><span class="st">★</span> ${p.r||'4.6'} (${p.rv||8})</p><h3 class="pr">${M(base(k))}</h3><span class="tg${p.stock>0?'':' n'}">${p.stock>0?'In stock':'Out of stock'}</span><a class="bx" href="product.html">Add to Cart</a></div>`};
function paint(c,k){const p=P[k];$('.br',c).textContent=p.b.toUpperCase();$('b',c).textContent=p.n;$('.pr',c).textContent=M(base(k));const sp=$('.sp',c);if(sp.firstChild)sp.firstChild.textContent=p.s;if(p.so){const t=$('.tg',c);if(t){t.textContent=p.stock>0?'In stock':'Out of stock';t.classList.toggle('n',!(p.stock>0))}}}
const IMGRE=/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+\/=]+$/,VW0={},VWB={};
function imgCss(k){const id='pimg-'+k;let st=document.getElementById(id);const p=P[k];
 if(!p||!p.img||!IMGRE.test(p.img)){if(st)st.remove();return}
 if(!st){st=document.createElement('style');st.id=id}
 st.textContent=`.ph.${k}:not(.hs .ph):not(.deal .ph){background-image:url("${p.img}")!important;background-repeat:no-repeat!important;background-size:cover!important;background-position:center!important;background-color:var(--s)}`;document.head.appendChild(st)}
function readImg(file,max=900,q=.82){return new Promise((res,rej)=>{
 if(!/^image\/(jpeg|png|webp|gif)$/.test(file.type))return rej('Choose a JPG, PNG, WebP or GIF image.');
 if(file.size>8*1048576)return rej('That image is too large (max 8 MB).');
 const fr=new FileReader();fr.onerror=()=>rej('Could not read that file.');
 fr.onload=()=>{const im=new Image();im.onerror=()=>rej('That file is not a valid image.');
  im.onload=()=>{const r=Math.min(1,max/Math.max(im.width,im.height)),w=Math.max(1,Math.round(im.width*r)),h=Math.max(1,Math.round(im.height*r)),cv=document.createElement('canvas');cv.width=w;cv.height=h;const cx=cv.getContext('2d');cx.fillStyle='#fff';cx.fillRect(0,0,w,h);cx.drawImage(im,0,0,w,h);res(cv.toDataURL('image/jpeg',q))};im.src=fr.result};fr.readAsDataURL(file)})}
let pfImg,pfGl=[];
function pfGlRender(){const w=$('#pf-gl-pv'),i=$('#pf-gl');if(!w)return;w.innerHTML=pfGl.map((x,n)=>`<span class="gt" style="background-image:url('${x}')"><button type="button" data-pm="rmgl" data-i="${n}" aria-label="Remove photo ${n+1}">✕</button></span>`).join('');if(i)i.disabled=pfGl.length>=3}
function pfPreview(src){const pv=$('#pf-pv');if(!pv)return;pv.style.backgroundImage=src?`url("${src}")`:'';pv.textContent=src?'':'Default illustration';const b=$('[data-pm="rmimg"]');if(b)b.hidden=!src}
function commit(){const D=allDefs(),ov=OV();
 pdel().forEach(k=>{if(P[k]){delete P[k];delete cart[k];delete relSrc[k]}$$(`.pc[data-k="${k}"]`).forEach(c=>c.remove());const hs=document.getElementById('pimg-'+k);if(hs)hs.remove()});
 Object.keys(D).forEach(k=>{const d=D[k],o=ov[k]||{};
  if(o.hide){if(P[k]){delete P[k];$$(`.pc[data-k="${k}"]`).forEach(c=>c.remove());delete cart[k];delete relSrc[k]}const hs=document.getElementById('pimg-'+k);if(hs)hs.remove();return}
  const p=Object.assign({},d);['n','b','c','s','about','ovw','spec','ship'].forEach(f=>{if(o[f])p[f]=o[f]});p.gl=(Array.isArray(o.gl)?o.gl:[]).filter(x=>IMG_OK.test(x)).slice(0,3);if(o.price!=null)p.p=d.p.map(t=>t[0]===1?[1,o.price]:t);
  p.stock=o.stock!=null?o.stock:(d.stock!=null?d.stock:50);p.so=o.stock!=null;if(o.img&&IMGRE.test(o.img))p.img=o.img;else delete p.img;P[k]=p;phCss(k);
  VWB[k]=VWB[k]||VW[k]||[['Front view']];VW[k]=(p.img?[['Front view']]:VWB[k]).concat(p.gl.map((x,i)=>['Photo '+(i+2),0,0,0,x]));imgCss(k);AR[k]=AR[k]||1.555;
  let cs=$$(`.pc[data-k="${k}"]`);if(!cs.length){($('#shop .g3')||$('#pc-src')).insertAdjacentHTML('beforeend',cardHtml(k));cs=$$(`.pc[data-k="${k}"]`)}else cs.forEach(c=>paint(c,k));
  relSrc[k]=cs[0].outerHTML.replace(/ style="[^"]*"/,'')});
 Object.keys(cart).forEach(k=>{if(!P[k])delete cart[k]});saveCart();catInit();shop();wlSync();sync();if($('#cart .lay2'))renderCart()}
const baseP=d=>d.p.find(t=>t[0]===1)[1],skuOf=(k,c)=>c.slice(0,3).toUpperCase()+'-'+k.replace(/^x-/,'').toUpperCase().slice(0,8);
function rAP(){const D=allDefs(),ov=OV(),ks=Object.keys(D),tb=$('#a-prod .tw table');
 tb.innerHTML='<tr><th>Product</th><th>SKU</th><th>Category</th><th>Retail price</th><th>Stock</th><th>Status</th><th>Action</th></tr>'+ks.map(k=>{const d=D[k],o=ov[k]||{},c=o.c||d.c,st=o.stock!=null?o.stock:(d.stock!=null?d.stock:50);return `<tr data-k="${k}" data-st="${o.hide?'Hidden':'Active'}"><td><span class="ph pth ${k}${o.img?' has-img':''}"></span><b>${esc(o.n||d.n)}</b></td><td>${skuOf(k,c)}</td><td>${c}</td><td>${M(o.price!=null?o.price:baseP(d))}</td><td>${st}${st<10?' <span class="tg a">Low</span>':''}</td><td><span class="tg${o.hide?' n':''}">${o.hide?'Hidden':'Active'}</span></td><td class="act">Edit<span class="rm" data-d="prod" data-id="${k}">Delete</span></td></tr>`}).join('');
 $('#a-prod .pgn .m').textContent=`Showing ${ks.length} products`;$('#a-prod .ab>p.m').textContent=`${ks.length} products · ${catList().length} categories · Manage your catalog, prices and images.`}
const FXS=()=>{const v=parseFloat(S.get('fx',25000));return v>0?v:25000};
function pfFxNote(){const e=$('#pf-fx');if(!e)return;const vi=document.documentElement.lang==='vi',f=FXS(),fx=vi?`Tỷ giá: 1 USD = ${f.toLocaleString('vi-VN')} VND`:`Rate: 1 USD = ${f.toLocaleString('en-US')} VND`,c=v('pf-cur'),p=parseFloat(v('pf-p'));
 e.textContent=!(p>0)?fx:c==='VND'?`≈ ${(p/f).toFixed(2)} USD · ${fx}`:`≈ ${Math.round(p*f).toLocaleString(vi?'vi-VN':'en-US')} VND · ${fx}`}
function prodModal(k){const D=allDefs(),o=k?(OV()[k]||{}):{},d=k?D[k]:{n:'',b:'',c:'Phones',s:'',p:[[1,'']]};
 const usd=o.price!=null?o.price:(k?baseP(d):''),pcur=o.cur||(k?'USD':'VND'),pshow=usd===''?'':(pcur==='VND'?Math.round(usd*FXS()):usd);
 modal(k?'Edit product':'Add product',`<div class="g2s">${FD('pf-n','Product name *',o.n||d.n)}${FD('pf-b','Brand *',o.b||d.b)}</div><div class="g2s">${SL('pf-c','Category',catOpts(o.c||d.c),o.c||d.c)}${SL('pf-cur','Price currency',['USD','VND'],pcur)}</div><div class="g2s">${FD('pf-p','Retail price *',pshow,'number')}${FD('pf-k','Stock',o.stock!=null?o.stock:(d.stock!=null?d.stock:50),'number')}</div><p class="m" id="pf-fx" data-notr></p>${SL('pf-s','Status',['Active','Hidden'],o.hide?'Hidden':'Active')}<label class="fld"><small>Short description</small><textarea id="pf-d" rows="2">${esc(o.s||d.s||'')}</textarea></label><label class="fld"><small>About this device</small><textarea id="pf-ab" rows="3" maxlength="1200" placeholder="A few sentences introducing the device">${esc(o.about||'')}</textarea></label><label class="fld"><small>Overview highlights (one per line)</small><textarea id="pf-ow" rows="3" maxlength="800" placeholder="Up to 18 hours of battery life&#10;Silent, fanless design">${esc(o.ovw||'')}</textarea></label><label class="fld"><small>Technical specifications (one per line, “Label: value”)</small><textarea id="pf-sp" rows="4" maxlength="1500" placeholder="Display: 6.1″ OLED&#10;Memory: 8GB&#10;Storage: 256GB">${esc(o.spec||'')}</textarea></label><label class="fld"><small>Delivery &amp; warranty (one per line)</small><textarea id="pf-sh" rows="3" maxlength="800" placeholder="Free delivery in 2–3 business days&#10;12-month manufacturer warranty">${esc(o.ship||'')}</textarea></label><div class="fld pimg"><div id="pf-pv" class="pv" role="img" aria-label="Product image preview"></div><div><small>Product image</small><input id="pf-img" type="file" accept="image/jpeg,image/png,image/webp,image/gif"><p class="m"><small>JPG, PNG, WebP or GIF, up to 8 MB. Shown in the shop, on the product page and in this table. Leave empty to keep the default illustration.</small></p><button type="button" class="bo" data-pm="rmimg" hidden>Remove image</button></div></div><div class="fld pgl"><small>Extra photos (up to 3)</small><div id="pf-gl-pv" class="glp"></div><input id="pf-gl" type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple><p class="m"><small>Small photos shown under the main image on the product page so buyers can see the device from other angles. Optional.</small></p></div>`,
  `<button class="bt" data-pm="save" data-k="${k||''}">Save product</button><button class="bo" data-mc>Cancel</button>${k?`<button class="bo rd" data-d="prod" data-id="${k}">Delete</button>`:''}`);
 pfImg=undefined;$('#pf-p').dataset.cur=pcur;pfFxNote();pfPreview(o.img||'');pfGl=(Array.isArray(o.gl)?o.gl:[]).filter(x=>IMG_OK.test(x)).slice(0,3);pfGlRender()}
document.addEventListener('change',e=>{if(e.target.id==='pf-cur'){const p=$('#pf-p'),x=parseFloat(p.value),to=e.target.value,prev=p.dataset.cur||(to==='VND'?'USD':'VND');if(x>0&&prev!==to)p.value=to==='VND'?Math.round(x*FXS()):Math.round(x/FXS()*100)/100;p.dataset.cur=to;pfFxNote()}});
document.addEventListener('input',e=>{if(e.target.id==='pf-p')pfFxNote()});
function saveProd(k){const n=v('pf-n').trim(),b=v('pf-b').trim(),cur=v('pf-cur')==='VND'?'VND':'USD',raw=parseFloat(v('pf-p')),pr=cur==='VND'?Math.round(raw/FXS()*1e6)/1e6:raw,st=parseInt(v('pf-k'),10),h=v('pf-s')==='Hidden';
 if(!n||!b)return merr('Enter a product name and brand.');if(!(raw>0))return merr('Enter a price greater than 0.');if(cur==='VND'&&raw<1000)return merr('Enter a price of at least 1,000 VND.');if(!(st>=0))return merr('Stock must be 0 or more.');
 const f={n,b,c:v('pf-c'),s:v('pf-d').trim()||n,price:pr,cur,stock:st,hide:h,about:v('pf-ab').trim(),ovw:v('pf-ow').trim(),spec:v('pf-sp').trim(),ship:v('pf-sh').trim(),gl:pfGl.slice(0,3)},isNew=!k,im=pfImg===undefined?(k?(OV()[k]||{}).img:undefined):pfImg;if(im)f.img=im;
 if(isNew){k='x-'+slug(n)+'-'+Date.now().toString(36).slice(-3);const cp=CD();cp[k]={n,b,c:f.c,s:f.s,p:[[1,pr]],i:DI[f.c]||'plug',t:1+Math.floor(Math.random()*3),x:'New',r:'4.6',rv:8,stock:st};S.set('cprods',cp)}
 const ov=OV();ov[k]=f;S.set('pov',ov);
 const sv=OV()[k];if(!sv||(f.img&&sv.img!==f.img)||(f.gl.length&&(!sv.gl||sv.gl.length!==f.gl.length))){if(isNew){const cp=CD();delete cp[k];S.set('cprods',cp)}return merr('Browser storage is full. Try smaller images or fewer photos.')}
 pfImg=undefined;pfGl=[];mclose();commit();rAP();toast(`${n} saved`)}
function delProd(k){const cp=CD(),ov=OV(),built=!cp[k];delete cp[k];delete ov[k];S.set('cprods',cp);S.set('pov',ov);if(built){const l=pdel();if(!l.includes(k)){l.push(k);S.set('pdel',l)}}if(P[k]){delete P[k];$$(`.pc[data-k="${k}"]`).forEach(c=>c.remove());delete cart[k];delete relSrc[k]}mclose();commit();rAP();toast('Product deleted')}
/* ---------- orders ---------- */
const _ss=S.set;if(S.get('ordseen',null)===null)_ss.call(S,'ordseen',Object.keys(S.get('on',{})));
S.set=function(k,val){_ss.call(S,k,val);if(k==='on'&&role()==='customer'){const seen=S.get('ordseen',[]);Object.keys(val).filter(i=>!seen.includes(i)).forEach(i=>{const u=me(),o=S.get('ords',[]);o.unshift({id:'TD-'+i,cust:`${u.name} · ${u.company||'Individual'}`,date:today(),total:M(val[i]),status:payM==='bank'?'Pending':'Processing',ship:S.get('shipto',null),items:Object.keys(cart).map(q=>[P[q]?P[q].n:q,cart[q],M(unit(q,cart[q])*cart[q])])});_ss.call(S,'ords',o);seen.push(i)});_ss.call(S,'ordseen',seen)}};
const OS=['Pending','Processing','Shipped','Delivered','Cancelled'],OC={Pending:'a',Processing:'b',Shipped:'b',Delivered:'',Cancelled:'n'};
const BASE_ORD=[{id:'TD-1048',cust:'Alex Morgan · Northstar Labs',date:'08 Oct 2026',total:'$1,541.16',status:'Processing',items:[['MacBook Air M4',1,'$1,099.00'],['Sony WH-1000XM5',1,'$249.00'],['Anker 565 USB-C Hub',1,'$79.00']]},{id:'TD-1047',cust:'Alex Morgan · Northstar Labs',date:'02 Oct 2026',total:'$3,240.00',status:'Delivered',items:[]},{id:'TD-1046',cust:'Sam Rivera · Vertex Studio',date:'07 Oct 2026',total:'$1,684.80',status:'Shipped',items:[]},{id:'TD-1045',cust:'Taylor Chen · Atlas Consulting',date:'07 Oct 2026',total:'$6,210.00',status:'Pending',items:[]}];
const orders=()=>{const st=S.get('ost',{}),dl=S.get('odel',[]),cx=S.get('ocx',{}),rq=S.get('ocr',{});return[...S.get('ords',[]),...BASE_ORD].filter(o=>!dl.includes(o.id)).map(o=>{const s2=st[o.id]||o.status;return Object.assign({},o,{status:s2,cx:s2==='Cancelled'?cx[o.id]:undefined,rq:s2==='Cancelled'?undefined:rq[o.id]})})};
/* ---------- hủy đơn hàng (bắt buộc kèm lý do) ---------- */
const CX0='Select a reason',CXR={customer:[CX0,'Changed my mind','Ordered by mistake','Found a better price','Delivery will take too long','Wrong item or details','Other'],admin:[CX0,'Out of stock','Payment not received','Customer asked to cancel','Suspected fraud','Wrong item or details','Other']};
const canCx=(st,by)=>(by==='admin'?['Pending','Processing','Shipped']:['Pending','Processing']).includes(st);
const ostat=(id,fb)=>S.get('ost',{})[id]||fb;
const cxHead=c=>c.by==='admin'?'Cancelled by TDev':c.approved?'Cancelled at the customer’s request (approved by TDev)':'Cancelled by the customer';
const cxBox=(o)=>o.status!=='Cancelled'?'':(o.cx?`<div class="cxb"><b>${cxHead(o.cx)} · ${esc(o.cx.at||'')}</b><p class="m">Reason: ${esc(o.cx.reason||'')}</p></div>`:'<div class="cxb"><b>Cancelled</b><p class="m">No reason was recorded for this order.</p></div>');
const rqOpen=o=>!!(o&&o.rq&&o.rq.state==='pending');
const rqBox=(o,adm)=>{if(!o||!o.rq)return'';const r=o.rq;return r.state==='pending'?`<div class="cxb"><b>Cancellation requested by the customer · ${esc(r.at||'')}</b><p class="m">Reason: ${esc(r.reason||'')}</p><p class="m">${adm?'Approve or reject this request below.':'Waiting for TDev to review your request.'}</p></div>`:`<div class="cxb"><b>Cancellation request declined · ${esc(r.rejAt||'')}</b><p class="m">Reason: ${esc(r.rejReason||'')}</p>${adm?'':'<p class="m">If you still need help, please contact support.</p>'}</div>`};
function cxModal(id,by){const o=orders().find(q=>q.id===id),st=o?o.status:ostat(id,'Processing');
 if(st==='Cancelled')return toast(`Order ${id} is already cancelled`);
 if(by==='customer'&&o&&o.rq)return toast(o.rq.state==='pending'?`A cancel request for ${id} is already waiting for approval`:`Your cancel request for ${id} was declined. Please contact support`);
 if(!canCx(st,by))return toast(`Order ${id} is ${st.toLowerCase()} and can’t be cancelled any more`);
 modal(`Cancel order <span data-notr>${esc(id)}</span>`,`<p class="m">${by==='admin'?'The customer will see this reason on their order.':'Please tell us why you want to cancel. TDev will review your request and the order is cancelled once it is approved.'}</p>${SL('cx-r','Reason for cancelling *',CXR[by],CX0)}<label class="fld"><small>Details (required if you choose “Other”)</small><textarea id="cx-n" rows="3" maxlength="300"></textarea></label>`,`<button class="bt rd" data-cx="ok" data-id="${esc(id)}" data-by="${by}">${by==='admin'?'Cancel order':'Send cancel request'}</button><button class="bo" data-mc>Keep order</button>`)}
function cxDo(id,by){const r=v('cx-r'),n=v('cx-n').trim();
 if(!r||r===CX0)return merr('Please choose a reason for cancelling.');
 if(r==='Other'&&n.length<5)return merr('Please describe the reason (at least 5 characters).');
 const o=orders().find(q=>q.id===id),st=o?o.status:ostat(id,'Processing');
 if(!canCx(st,by)){mclose();return toast(`Order ${id} can’t be cancelled any more`)}
 const why=r==='Other'?n:(n?r+' — '+n:r);
 if(by==='customer'){const rq=S.get('ocr',{});if(rq[id]){mclose();return toast(`A cancel request for ${id} is already waiting for approval`)}rq[id]={state:'pending',at:today(),reason:why};S.set('ocr',rq);mclose();refreshAdmin();cOrd();bellSync();return toast(`Cancel request for ${id} sent to TDev`)}
 const ox=S.get('ost',{});ox[id]='Cancelled';S.set('ost',ox);
 const cx=S.get('ocx',{});cx[id]={by,at:today(),reason:why};S.set('ocx',cx);const rq=S.get('ocr',{});if(rq[id]){delete rq[id];S.set('ocr',rq)}
 mclose();refreshAdmin();cOrd();bellSync();toast(`Order ${id} cancelled`)}
function rqApprove(id){const o=orders().find(q=>q.id===id);if(!rqOpen(o))return toast('This request was already handled');if(!canCx(o.status,'admin'))return toast(`Order ${id} can’t be cancelled any more`);
 const ox=S.get('ost',{});ox[id]='Cancelled';S.set('ost',ox);const cx=S.get('ocx',{});cx[id]={by:'customer',at:today(),reason:o.rq.reason,approved:true};S.set('ocx',cx);
 const rq=S.get('ocr',{});delete rq[id];S.set('ocr',rq);mclose();refreshAdmin();cOrd();bellSync();toast(`Order ${id} cancelled`)}
function rqRejectModal(id){modal(`Reject cancel request <span data-notr>${esc(id)}</span>`,`<p class="m">The order stays active. The customer will see your reason.</p><label class="fld"><small>Reason for rejecting *</small><textarea id="rj-n" rows="3" maxlength="300"></textarea></label>`,`<button class="bt rd" data-cx="rejok" data-id="${esc(id)}">Reject request</button><button class="bo" data-mc>Back</button>`)}
function rqRejectDo(id){const n=v('rj-n').trim();if(n.length<5)return merr('Please explain why the request is rejected (at least 5 characters).');const o=orders().find(q=>q.id===id);if(!rqOpen(o)){mclose();return toast('This request was already handled')}
 const rq=S.get('ocr',{});rq[id]=Object.assign({},rq[id],{state:'rejected',rejReason:n,rejAt:today()});S.set('ocr',rq);mclose();refreshAdmin();cOrd();bellSync();toast(`Cancel request for ${id} rejected`)}
/* khách hàng: bảng đơn hàng ở account.html */
const cBase=tg=>!tg?'Processing':tg.classList.contains('a')?'Pending':tg.classList.contains('b')?'Processing':tg.classList.contains('n')?'Cancelled':'Delivered';
function cOrd(){const a=$('#account');if(!a)return;const tb=$('.tw table',a);if(!tb)return;
 [...tb.rows].slice(1).forEach(r=>{const id=r.cells[0].textContent.trim();if(!/^TD-/.test(id))return;r.dataset.id=id;
  const tg=$('.tg',r.cells[4]),o=orders().find(q=>q.id===id),base=r.dataset.b0=r.dataset.b0||cBase(tg),st=o?o.status:ostat(id,base);
  if(tg&&(st!==base||r.dataset.cs)&&r.dataset.cs!==st){tg.className='tg '+(OC[st]||'');tg.textContent=st;r.dataset.cs=st}
  const rqo=o&&o.rq?o.rq.state:'',can=canCx(st,'customer')&&!rqo,key=can+'|'+rqo;if(r.dataset.ca!==key){r.dataset.ca=key;r.cells[5].innerHTML='View'+(can?`<span class="rm" data-cx="open" data-id="${esc(id)}" data-by="customer">Cancel</span>`:'');$$('.rqt',r.cells[4]).forEach(x=>x.remove());if(rqo)r.cells[4].insertAdjacentHTML('beforeend',rqo==='pending'?' <span class="tg a rqt">Cancel requested</span>':' <span class="tg n rqt">Request declined</span>')}}) /* đơn đã thanh toán mà bị hủy -> lịch sử thanh toán hiện "Chờ hoàn tiền" */
 const tx=$('#txt');if(tx)[...tx.rows].slice(1).forEach(r=>{const tg=r.cells[5]&&$('.tg',r.cells[5]);if(!tg||r.dataset.rf==='1'||tg.classList.contains('a'))return;if(ostat(r.cells[1].textContent.trim(),'')==='Cancelled'){r.dataset.rf='1';tg.className='tg a';tg.textContent='Refund pending'}})}
function custOrdModal(id){const r=$(`#account tr[data-id="${id}"]`),o=orders().find(q=>q.id===id);if(!r)return;const st=o?o.status:ostat(id,r.dataset.b0||'Processing'),can=canCx(st,'customer')&&!(o&&o.rq),c=o||{status:st,cx:S.get('ocx',{})[id]};
 modal(`Order <span data-notr>${esc(id)}</span>`,`<p class="m">${esc(r.cells[1].textContent.trim())} · ${esc(r.cells[2].textContent.trim())}</p><hr><div class="tw"><table><tr><th>Product</th><th>Quantity</th><th>Line total</th></tr>${o&&o.items&&o.items.length?o.items.map(i=>`<tr><td><b>${esc(i[0])}</b></td><td>${i[1]}</td><td>${i[2]}</td></tr>`).join(''):'<tr><td colspan="3" class="m">No line items recorded for this demo order.</td></tr>'}</table></div><p><b>Order total: ${esc(r.cells[3].textContent.trim())}</b></p><p>Status: <span class="tg ${OC[st]||''}">${st}</span></p>${c.ship?`<p><b>Deliver to</b><br><span data-notr>${[esc(c.ship.name)+(c.ship.co?' · '+esc(c.ship.co):''),...c.ship.lines.map(esc),esc(c.ship.phone)].join('<br>')}</span></p>`:''}${cxBox(c)}${rqBox(c,0)}`,`${can?`<button class="bo rd" data-cx="open" data-id="${esc(id)}" data-by="customer">Cancel order</button>`:''}<button class="bo" data-mc>Close</button>`)}
function rAO(){const tb0=$$('#a-ord .tw table')[0];if(!tb0)return;const l=orders();tb0.innerHTML='<tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Action</th></tr>'+l.map(o=>`<tr data-id="${esc(o.id)}" data-st="${o.status}"${rqOpen(o)?' data-rq="1"':''}><td><b>${esc(o.id)}</b></td><td>${esc(o.cust)}</td><td>${o.date}</td><td>${o.total}</td><td><span class="tg ${OC[o.status]||''}"${o.cx?` title="${esc(o.cx.reason||'')}"`:''}>${o.status}</span>${rqOpen(o)?' <span class="tg a" title="'+esc(o.rq.reason||'')+'">Cancel requested</span>':''}</td><td class="act">View${rqOpen(o)?`<span class="rm" data-cx="review" data-id="${esc(o.id)}">Review request</span>`:canCx(o.status,'admin')?`<span class="rm" data-cx="open" data-id="${esc(o.id)}" data-by="admin">Cancel</span>`:''}<span class="rm" data-d="ord" data-id="${esc(o.id)}">Delete</span></td></tr>`).join('');$('#a-ord .pgn .m').textContent=`Showing ${l.length} of ${l.length} orders`;$('#a-ord .ab>p.m').textContent=`${l.length} orders · Track payment, fulfillment and delivery.`;
 $$('#a-ord .tabs a').forEach(a=>{const t=a.dataset.s||'all',n=t==='all'?l.length:t==='req'?l.filter(rqOpen).length:l.filter(o=>o.status===t).length,txt=`${t==='all'?'All orders':t==='req'?'Cancel requests':t} (${n})`;if(a.dataset.tx!==txt){a.dataset.tx=txt;a.textContent=txt}})}
function ordModal(id){const o=orders().find(q=>q.id===id);if(!o)return;modal('Order '+o.id,`<p class="m">${esc(o.cust)} · ${o.date}</p><hr><div class="tw"><table><tr><th>Product</th><th>Quantity</th><th>Line total</th></tr>${o.items.length?o.items.map(i=>`<tr><td><b>${esc(i[0])}</b></td><td>${i[1]}</td><td>${i[2]}</td></tr>`).join(''):'<tr><td colspan="3" class="m">No line items recorded for this demo order.</td></tr>'}</table></div><p><b>Order total: ${o.total}</b></p>${o.ship?`<p><b>Deliver to</b><br><span data-notr>${[esc(o.ship.name)+(o.ship.co?' · '+esc(o.ship.co):''),...o.ship.lines.map(esc),esc(o.ship.phone)].join('<br>')}</span></p>`:''}${cxBox(o)}${rqBox(o,1)}${SL('of-s','Order status',OS,o.status)}`,`${rqOpen(o)?`<button class="bt rd" data-cx="approve" data-id="${esc(o.id)}">Approve cancellation</button><button class="bo" data-cx="reject" data-id="${esc(o.id)}">Reject request</button>`:''}<button class="bt" data-om="save" data-id="${o.id}">Update status</button><button class="bo" data-mc>Close</button>${canCx(o.status,'admin')&&!rqOpen(o)?`<button class="bo rd" data-cx="open" data-id="${esc(o.id)}" data-by="admin">Cancel order</button>`:''}<button class="bo rd" data-d="ord" data-id="${esc(o.id)}">Delete</button>`)}
/* khách hàng: xem chi tiết báo giá ở quotes.html */
function custQuoModal(r){const id=r.cells[0].textContent.trim(),q=quotes().find(x=>x.id===id),st=q?q.status:r.cells[4].textContent.trim(),act=r.cells[5].textContent.trim();
 modal(`Quote <span data-notr>${esc(id)}</span>`,`<p class="m">${esc(r.cells[1].textContent.trim())} · ${esc(r.cells[2].textContent.trim())}</p><hr><p><b>Amount before tax: ${esc(q?M(q.amt):r.cells[3].textContent.trim())}</b></p><p>Status: <span class="tg ${QC[st]||''}">${esc(st)}</span></p>`,`${act==='Review'||st==='Quoted'?'<a class="bt" href="checkout.html">Accept &amp; checkout</a>':act==='Renew'?'<a class="bt" href="rfq.html">Request a new quote</a>':''}<button class="bo" data-mc>Close</button>`)}
/* ---------- users ---------- */
const RL={customer:'Customer',admin:'Admin'},RH={Customer:'Customer: shops on the storefront. No access to the Admin console.',Admin:'Admin: manages the store from the Admin console. Cannot place orders or request quotes.'};
let SRVU=[];
const UMSG={self_lockout:'You can’t remove your own admin access.',last_admin:'At least one active admin is required.',email_taken:'An account with this email already exists.',invalid:'Please check the details and try again.'};
async function rAU(){let r;if(SRV){r=await api('/api/admin/users',null,'GET');if(!r.ok)return;SRVU=r.data||[]}else{SRVU=users().map(q=>({name:q.name,email:q.email,company:q.company,role:q.role,status:q.status==='Active'?'active':'inactive'}))}
 $('#a-usr .tw table').innerHTML='<tr><th>Name</th><th>Email</th><th>Company</th><th>Role</th><th>Status</th><th>Action</th></tr>'+SRVU.map((q,i)=>`<tr data-i="${i}" data-st="${q.status==='active'?'Active':'Inactive'}" data-rl="${esc(q.role)}"><td><b>${esc(q.name)}</b></td><td>${esc(q.email)}</td><td>${esc(q.company||'')}</td><td>${RL[q.role]}</td><td><span class="tg ${q.status==='active'?'':'n'}">${q.status==='active'?'Active':'Inactive'}</span></td><td class="act">Edit${SRV?`<span class="rm" data-d="usr" data-id="${i}">Delete</span>`:''}</td></tr>`).join('');
 $('#a-usr .pgn .m').textContent=`Showing ${SRVU.length} of ${SRVU.length} accounts`;$('#a-usr .ab>p.m').textContent=`${SRVU.length} accounts · Manage customers and admin access.`;rInv()}
function userModal(i){if(i==null)return invModal();
 const q=SRVU[i];if(!q)return;modal('Edit user',`${FD('uf-n','Full name *',q.name)}${FD('uf-c','Company',q.company||'')}<div class="g2s">${SL('uf-r','Role',['Customer','Admin'],RL[q.role])}${SL('uf-s','Status',['Active','Inactive'],q.status==='active'?'Active':'Inactive')}</div><p class="m rh" id="uf-rh"><small>${RH[RL[q.role]]}</small></p><p class="m"><small>${esc(q.email)} · ${SRV?'changing role or status signs this person out everywhere.':'Demo mode: changes are saved in this browser only.'}</small></p>`,`<button class="bt" data-um="save" data-i="${i}">Save user</button><button class="bo" data-mc>Cancel</button>${SRV?`<button class="bo rd" data-d="usr" data-id="${i}">Delete</button>`:''}`)}
async function saveUser(i){
 const q=SRVU[i];if(!q)return;const n=v('uf-n').trim();if(n.length<2)return merr('Enter a name.');
 if(!SRV){const u=users(),t=u[i];if(!t)return;const nr=v('uf-r')==='Admin'?'admin':'customer',ns=v('uf-s')==='Active'?'Active':'Inactive',se=me();
  if(se&&se.email===t.email&&(nr!==t.role||ns!=='Active'))return merr(UMSG.self_lockout);
  if(t.role==='admin'&&(nr!=='admin'||ns!=='Active')&&!u.some((x,j)=>j!==i&&x.role==='admin'&&x.status==='Active'))return merr(UMSG.last_admin);
  t.name=n;t.company=v('uf-c').trim();t.role=nr;if(!(t.status==='Invited'&&ns==='Inactive'))t.status=ns;S.set('users',u);
  if(se&&se.email===t.email)S.set('sess',Object.assign(se,{name:t.name,company:t.company}));
  mclose();rAU();toast('User saved');return}
 const r=await api('/api/admin/users/'+q.id,{name:n,company:v('uf-c').trim(),role:v('uf-r')==='Admin'?'admin':'customer',status:v('uf-s')==='Active'?'active':'inactive'},'PATCH');
 if(!r.ok)return merr(UMSG[r.code]||UMSG.invalid);mclose();rAU();toast('User saved')}
/* ---------- mã mời tạo tài khoản admin: tạo · xem danh sách · thu hồi ---------- */
let INV=[];
/* chế độ demo (không cần npm start): mã mời lưu trong localStorage, chỉ lưu băm */
const nc=c=>String(c||'').replace(/[\s-]/g,'').toUpperCase(),ivh=c=>sha256('inv:'+nc(c));
const lInv=()=>S.get('invites',[]),ivSt=i=>i.used?'used':i.revoked?'revoked':i.expires<=Date.now()?'expired':'active';

const IMSG={too_many:'There are too many active invite codes. Revoke the ones you don’t need.',email_taken:'An account with this email already exists.',invalid:'Please check the details and try again.',rate_limited:'Too many attempts. Please wait a few minutes.'};
const IVS={active:['Active',''],used:['Used','b'],expired:['Expired','n'],revoked:['Revoked','n']};
const fdt=t=>{const d=new Date(t),p=n=>String(n).padStart(2,'0');return`${d.getDate()} ${MO[d.getMonth()]} ${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`};
async function rInv(){const t=$('#inv-t'),n=$('#inv-n');if(!t||!n)return;
 let r;if(SRV){r=await api('/api/admin/invites',null,'GET');if(!r.ok){n.textContent='Can’t load invite codes. Reload the page and try again.';return}
 INV=Array.isArray(r.data)?r.data:[]}else INV=lInv().map(i=>Object.assign({},i,{status:ivSt(i)})).sort((a,b)=>b.id-a.id);
 t.innerHTML='<tr><th>Code</th><th>Email</th><th>Created</th><th>Expires</th><th>Status</th><th>Action</th></tr>'+(INV.length?INV.map(i=>{const st=IVS[i.status]||IVS.expired;
  return`<tr><td><code data-notr>••••-••••-••••-••••-${esc(i.hint||'••••')}</code></td><td>${i.email?`<span data-notr>${esc(i.email)}</span>`:'<span class="m">Any email</span>'}${i.status==='used'&&i.used_email?`<small class="m" data-notr>→ ${esc(i.used_email)}</small>`:''}</td><td>${fdt(i.created)}${i.by?`<small class="m" data-notr>${esc(i.by)}</small>`:''}</td><td>${fdt(i.expires)}</td><td><span class="tg ${st[1]}">${st[0]}</span></td><td class="ia"><span role="button" tabindex="0" data-inv="${i.status==='active'?'revoke':'rm'}" data-id="${i.id}">${i.status==='active'?'Revoke':'Remove'}</span></td></tr>`}).join(''):'<tr><td colspan="6" class="m">No invite codes yet. Create one to let a new admin sign up.</td></tr>');
 const na=INV.filter(i=>i.status==='active').length;n.textContent=`${na} active · ${INV.length} total`}
function invModal(){
 modal('Create invite code',`<p class="m">Give a one-time code to a new admin so they can create their own sign-in account on the Admin sign-up page.</p>${FD('iv-e','Work email (optional)','','email')}<p class="m"><small>Leave it empty and the code works with any email. Fill it in to lock the code to that one email.</small></p><label class="fld"><small>Valid for</small><select id="iv-h"><option value="24">24 hours</option><option value="48" selected>48 hours</option><option value="168">7 days</option><option value="720">30 days</option></select></label>`,
  `<button class="bt" data-inv="create">Create code</button><button class="bo" data-mc>Cancel</button>`)}
async function invCreate(btn){const em=v('iv-e').trim();if(em&&!EM.test(em)){btn.disabled=false;return merr('Enter a valid email or leave it empty.')}
 let r;if(!SRV){const L=lInv(),hrs=+v('iv-h')||48;
  if(em&&users().some(q=>q.email.toLowerCase()===em.toLowerCase())){btn.disabled=false;return merr(IMSG.email_taken)}
  if(L.filter(i=>ivSt(i)==='active').length>=20){btn.disabled=false;return merr(IMSG.too_many)}
  const raw=Array.from(crypto.getRandomValues(new Uint8Array(10))).map(b=>('0'+b.toString(16)).slice(-2)).join('').toUpperCase().slice(0,20),exp=Date.now()+hrs*3600e3,m=me();
  L.push({id:Date.now(),h:ivh(raw),email:em.toLowerCase(),created:Date.now(),expires:exp,hint:raw.slice(-4),by:m?m.name:''});S.set('invites',L);
  r={ok:true,code:raw.match(/.{4}/g).join('-'),email:em||null,expires:exp}}
 else try{r=await api('/api/admin/invites',{email:em||undefined,hours:+v('iv-h')})}catch(e){btn.disabled=false;return merr('Can’t reach the server. Please try again.')}
 if(!r.ok){btn.disabled=false;return merr(IMSG[r.code]||IMSG.invalid)}
 invShow(r);rInv()}
function invShow(r){const link=`${location.origin}/admin-register.html?code=${encodeURIComponent(r.code)}${r.email?'&email='+encodeURIComponent(r.email):''}`;
 modal('Invite code created',`<p class="m">${r.email?'This one-time code only works for this email:':'This one-time code works with any email.'}</p>${r.email?`<p><b data-notr>${esc(r.email)}</b></p>`:''}<div class="invc" data-notr>${esc(r.code)}</div><p class="m">Expires: ${fdt(r.expires)}</p><p class="m"><small>It can’t be shown again, so copy it now. The new admin enters it on the Admin sign-up page with their name, email and a password of 12+ characters.</small></p><p class="gr" id="iv-cp" hidden></p>`,
  `<button class="bt" data-inv="copy" data-v="${esc(r.code)}">Copy code</button><button class="bo" data-inv="copy" data-v="${esc(link)}">Copy sign-up link</button><button class="bo" data-mc>Done</button>`)}
async function invCopy(t){const ok=$('#iv-cp'),er=$('.mdl .er');if(er)er.hidden=true;
 const done=g=>{if(!ok)return;if(g){ok.hidden=false;ok.textContent='Copied to clipboard'}else{ok.hidden=true;merr('Couldn’t copy automatically. Select the code and copy it yourself.')}};
 try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(t);return done(true)}}catch(e){}
 const a=document.createElement('textarea');a.value=t;a.setAttribute('readonly','');a.style.cssText='position:fixed;top:0;opacity:0';document.body.appendChild(a);a.select();let g=false;try{g=document.execCommand('copy')}catch(e){}a.remove();done(g)}
async function invDel(id){let r;if(!SRV){const L=lInv(),t=L.find(q=>q.id===id);mclose();if(!t){rInv();return toast('That invite code no longer exists.')}
  const act=ivSt(t)==='active';if(act)t.revoked=Date.now();S.set('invites',act?L:L.filter(q=>q.id!==id));rInv();return toast(act?'Invite code revoked':'Invite code removed')}
 try{r=await api('/api/admin/invites/'+id,null,'DELETE')}catch(e){mclose();return toast('Can’t reach the server. Please try again.')}
 mclose();rInv();toast(!r.ok?'That invite code no longer exists.':r.action==='revoked'?'Invite code revoked':'Invite code removed')}
function invAct(x){const a=x.dataset.inv,id=+x.dataset.id;
 if(a==='new')return invModal();
 if(a==='create'){x.disabled=true;return invCreate(x)}
 if(a==='copy')return invCopy(x.dataset.v);
 if(a==='revoke'){const i=INV.find(q=>q.id===id);if(!i)return;return modal('Revoke this invite code?',`<p class="m">The code ending in <b data-notr>${esc(i.hint||'••••')}</b> will stop working right away. This can’t be undone.</p>`,`<button class="bt rd" data-inv="revokeok" data-id="${id}">Revoke</button><button class="bo" data-mc>Cancel</button>`)}
 if(a==='revokeok'||a==='rm')return invDel(id)}
document.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('td.ia [data-inv]')){e.preventDefault();e.target.click()}});
/* link mời: admin-register.html?code=…&email=… tự điền form, rồi xóa tham số khỏi thanh địa chỉ */
function prefillInvite(){let q;try{q=new URLSearchParams(location.search)}catch(e){return}const c=q.get('code'),em=q.get('email');if(!c&&!em)return;
 if(c)gf('#admin-register','code').value=c.slice(0,60);if(em)gf('#admin-register','email').value=em.slice(0,254);
 try{history.replaceState(null,'',location.pathname)}catch(e){}const f=gf('#admin-register','name');if(f)f.focus()}
/* ---------- admin: categories, quotes, dashboard ---------- */
const dnum=s=>parseFloat(String(s).replace(/[^0-9.]/g,''))||0,pdate=s=>{const m=/^(\d{1,2}) (\w{3}) (\d{4})$/.exec(String(s).trim());return m?new Date(+m[3],MO.indexOf(m[2]),+m[1]):null},ptxt=h=>new DOMParser().parseFromString(String(h),'text/html').body.textContent;
const refreshAdmin=()=>{rAO();rAD();rAQ()};
const catOpts=cur=>{const l=catList().filter(c=>c.status==='Active').map(c=>c.name);if(cur&&!l.includes(cur))l.push(cur);return l};
const catCount=(name,all)=>{const D=allDefs(),ov=OV();return Object.keys(D).filter(k=>{const o=ov[k]||{};return(all||!o.hide)&&(o.c||D[k].c)===name}).length};
function rAC(){const tb=$('#a-cat .tw table');if(!tb)return;const l=catList();
 tb.innerHTML='<tr><th>Category</th><th>URL slug</th><th>Products</th><th>Display order</th><th>Status</th><th>Action</th></tr>'+l.map(c=>`<tr data-id="${esc(c.id)}" data-st="${esc(c.status)}"><td>${c.img&&IMG_OK.test(c.img)?`<span class="cth" style="background-image:url('${c.img}')"></span>`:''}<b>${esc(c.name)}</b></td><td>${esc(c.id)}</td><td>${catCount(c.name)}</td><td>${c.order}</td><td><span class="tg${c.status==='Active'?'':' n'}">${c.status}</span></td><td class="act">Edit<span class="rm" data-d="cat" data-id="${esc(c.id)}">Delete</span></td></tr>`).join('');
 $('#a-cat .ab>p.m').textContent=`${l.length} categories · ${l.reduce((a,c)=>a+catCount(c.name),0)} products · Keep discovery simple and friendly.`;
 $('#a-cat .pgn .m').textContent=`Showing ${l.length} of ${l.length} categories`}
function catModal(id){const c=id?catList().find(q=>q.id===id):null;if(id&&!c)return;const base=c&&c.base;cimgPend=undefined;himgPend=undefined;const cim=base?cimgOf(c.id):'',him=base?cimgOf(c.id,'hero'):'';
 modal(c?'Edit category':'Add category',`<label class="fld"><small>Category name *</small><input id="cf-n" value="${esc(c?c.name:'')}"${base?' disabled':''}></label><label class="fld"><small>URL slug *</small><input id="cf-s" value="${esc(c?c.id:'')}" placeholder="e.g. gaming"${c?' disabled':''}></label><div class="g2s">${FD('cf-o','Display order',c?c.order:catList().length+1,'number')}${SL('cf-t','Status',['Active','Hidden'],c?c.status:'Active')}</div>${base?`<div class="fld"><small>Home tile image (card on the home page)</small><div class="cimgp${cim?' on':''}" id="cf-prev"${cim?` style="background-image:url('${cim}')"`:''}></div><div class="cimga"><input type="file" id="cf-f" accept="image/png,image/jpeg,image/webp"><button type="button" class="bo" data-cimg="clear">Remove image</button></div><small class="m">JPG, PNG or WebP. It is resized automatically. Leave it empty to keep the default look.</small></div><div class="fld"><small>Category page banner image (panel at the top of the category page)</small><div class="cimgp${him?' on':''}" id="cf-hprev"${him?` style="background-image:url('${him}')"`:''}></div><div class="cimga"><input type="file" id="cf-hf" accept="image/png,image/jpeg,image/webp"><button type="button" class="bo" data-cimg="hclear">Remove image</button></div><small class="m">Separate from the home tile. Leave it empty to show the default product photo.</small></div>`:''}<p class="m"><small>${base?'Built-in categories keep their name and URL. Hidden categories disappear from the category menu and from the product form. Deleting one removes it from the store menu too.':'New categories can be assigned to products. A storefront page is not created automatically for a new category.'}</small></p>`,
  `<button class="bt" data-cm="save" data-id="${c?esc(c.id):''}">Save category</button><button class="bo" data-mc>Cancel</button>${c?`<button class="bo rd" data-cm="del" data-id="${esc(c.id)}">Delete</button>`:''}`)}
function saveCat(id){const ord=parseInt(v('cf-o'),10),stt=v('cf-t');if(!(ord>=1))return merr('Display order must be 1 or more.');
 const ord0=id?(catList().find(q=>q.id===id)||{order:Infinity}).order:Infinity,tid=id||v('cf-s').trim().toLowerCase();
 const nm=v('cf-n').trim(),dup=x=>catList().some(q=>q.id!==x&&q.name.toLowerCase()===nm.toLowerCase());
 if(id){const c=catList().find(q=>q.id===id);if(!c)return;
  if(c.base){const ov=S.get('catov',{});ov[id]=Object.assign({},ov[id],{order:ord,status:stt});if(cimgPend!==undefined){if(cimgPend)ov[id].img=cimgPend;else delete ov[id].img}if(himgPend!==undefined){if(himgPend)ov[id].hero=himgPend;else delete ov[id].hero}S.set('catov',ov);if((cimgPend&&S.get('catov',{})[id].img!==cimgPend)||(himgPend&&S.get('catov',{})[id].hero!==himgPend))return merr('This image is too large for the browser storage. Try a smaller picture.')}
  else{if(!nm)return merr('Enter a category name.');if(dup(id))return merr('A category with this name already exists.');const cu=S.get('ccats',[]),i=cu.findIndex(q=>q.id===id);if(i>-1){const old=cu[i].name;cu[i]=Object.assign(cu[i],{name:nm,order:ord,status:stt});S.set('ccats',cu);if(old!==nm)renameCat(old,nm)}}}
 else{const sl=v('cf-s').trim().toLowerCase();if(!nm)return merr('Enter a category name.');if(!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(sl)||sl.length>24)return merr('URL slug: lowercase letters, numbers and hyphens, up to 24 characters.');if(catList().some(q=>q.id===sl))return merr('This URL slug is already used.');if(dup(''))return merr('A category with this name already exists.');const cu=S.get('ccats',[]);cu.push({id:sl,name:nm,order:ord,status:stt});S.set('ccats',cu)}
 normCats(tid,ord,ord0);mclose();rAC();catInit();toast('Category saved')}
/* đặt danh mục vào đúng vị trí đã nhập, các danh mục khác tự dồn lại thành 1..N (không còn trùng số thứ tự) */
function normCats(id,ord,ord0){const l=catList().map(c=>({c,k:c.id===id?(ord>ord0?ord+.5:ord-.5):Number(c.order)||0}));l.sort((x,y)=>x.k-y.k);
 const ov=S.get('catov',{}),cu=S.get('ccats',[]);
 l.forEach((x,i)=>{const c=x.c;if(c.base)ov[c.id]=Object.assign({},ov[c.id],{order:i+1});else{const q=cu.find(z=>z.id===c.id);if(q)q.order=i+1}});
 S.set('catov',ov);S.set('ccats',cu)}
function renameCat(a,b){const cp=CD(),ov=OV();Object.keys(cp).forEach(k=>{if(cp[k].c===a)cp[k].c=b});Object.keys(ov).forEach(k=>{if(ov[k].c===a)ov[k].c=b});S.set('cprods',cp);S.set('pov',ov);commit()}
function delCat(id){const c=catList().find(q=>q.id===id);if(!c)return;const n=catCount(c.name,true);if(n)return merr(`Move its ${n} product${n==1?'':'s'} to another category first.`);
 if(c.base){const l=cdel();if(!l.includes(id)){l.push(id);S.set('cdel',l)}const ov=S.get('catov',{});delete ov[id];S.set('catov',ov)}else S.set('ccats',S.get('ccats',[]).filter(q=>q.id!==id));
 mclose();rAC();catInit();hideDelCats();toast('Category deleted')}
/* quotes */
const BASE_QUO=[{id:'Q-2084',co:'Northstar Labs',proj:'25-device rollout',amt:26700,status:'Under review'},{id:'Q-2083',co:'Vertex Studio',proj:'Creator laptop refresh',amt:6380,status:'Pending'},{id:'Q-2078',co:'Northstar Labs',proj:'Audio team upgrade',amt:4980,status:'Quoted'},{id:'Q-2065',co:'Northstar Labs',proj:'Mobile accessories',amt:2180,status:'Accepted'}];
const QSTAT=['Pending','Under review','Quoted','Accepted','Archived'],QC={Pending:'a','Under review':'a',Quoted:'b',Accepted:'',Archived:'n'};
const quotes=()=>{const ov=S.get('qov',{}),qd=S.get('qdel',[]),seen=new Set(),all=[],push=q=>{if(seen.has(q.id)||qd.includes(q.id))return;seen.add(q.id);all.push(Object.assign({},q,ov[q.id]||{}))};
 S.get('aq',[]).forEach(push);S.get('qrows',[]).forEach(r=>{const c=r.map(ptxt);push({id:c[0].trim(),co:c[1],proj:c[2],amt:dnum(c[3]),status:c[4].trim()||'Under review'})});BASE_QUO.forEach(push);
 return all.sort((a,b)=>dnum(b.id)-dnum(a.id))};
const quoWait=q=>q.status==='Pending'||q.status==='Under review';
function rAQ(){const tb=$('#a-quo .tw table');if(!tb)return;const l=quotes();
 tb.innerHTML='<tr><th>Quote</th><th>Company</th><th>Project</th><th>Before tax</th><th>Status</th><th>Action</th></tr>'+l.map(q=>`<tr data-id="${esc(q.id)}" data-st="${esc(q.status)}"><td><b>${esc(q.id)}</b></td><td>${esc(q.co)}</td><td>${esc(q.proj)}</td><td>${M(q.amt)}</td><td><span class="tg ${QC[q.status]||''}">${esc(q.status)}</span></td><td class="act">${q.status==='Quoted'?'Review':'View'}<span class="rm" data-d="quo" data-id="${esc(q.id)}">Delete</span></td></tr>`).join('');
 $('#a-quo .ab>p.m').textContent=`${l.length} requests · ${l.filter(quoWait).length} awaiting review`;
 $('#a-quo .pgn .m').textContent=`Showing ${l.length} of ${l.length} requests`}
const BASE_DET={'Q-2084':{contact:'Alex Morgan',email:'alex.morgan@northstarlabs.com',phone:'+1 (415) 555-0124',tax:'US-94-3812046',date:'26 Oct 2026',budget:'$27,000.00',addr:'250 Market Street, Suite 400, San Francisco, CA 94105',notes:'25 MacBook Air M4 laptops and USB-C hubs for our new engineering team.',lines:[['MacBook Air M4','LAP-M4',25,999],['Anker 565 USB-C Hub','ACC-HUB',25,69]]}};
function quoDetail(q){const d=Object.assign({},BASE_DET[q.id],S.get('qdet',{})[q.id]);if(!d.contact&&!(d.lines&&d.lines.length))return '<p class="m"><small>No detailed request information was recorded for this quote. Details are saved for requests sent through the customer quote form.</small></p>';
 const R=(l,x)=>x?`<dt>${l}</dt><dd>${esc(String(x))}</dd>`:'',L=d.lines||[],sub=L.reduce((a,l)=>a+l[2]*l[3],0),tax=Math.round(sub*8)/100;
 return `<div class="qd"><h4>Customer contact</h4><dl>${R('Contact name',d.contact)}${R('Email',d.email)}${R('Phone',d.phone)}${R('Tax ID',d.tax)}${R('Submitted on',d.at)}</dl>`+
 (L.length?`<h4>Requested products</h4><div class="tw"><table><tr><th>Product</th><th>SKU</th><th>Quantity</th><th>Unit price</th><th>Line total</th></tr>${L.map(l=>`<tr><td><b>${esc(l[0])}</b></td><td>${esc(l[1])}</td><td>${l[2]}</td><td>${M(l[3])}</td><td>${M(l[2]*l[3])}</td></tr>`).join('')}</table></div><dl><dt>Subtotal</dt><dd>${M(sub)}</dd><dt>Tax (8%)</dt><dd>${M(tax)}</dd><dt>Estimated total</dt><dd><b>${M(sub+tax)}</b></dd></dl>`:'')+
 `<h4>Project details</h4><dl>${R('Delivery date',d.date)}${R('Budget (before tax)',d.budget)}${R('Delivery address',d.addr)}${R('Project notes',d.notes)}</dl></div>`}
function quoModal(id){const q=id?quotes().find(x=>x.id===id):null;if(id&&!q)return;
 if(!q)return modal('Create quote',`${FD('qf-c','Company or customer *','')}${FD('qf-p','Project name *','')}<div class="g2s">${FD('qf-a','Amount before tax (USD) *','','number')}${SL('qf-s','Status',QSTAT,'Quoted')}</div><label class="fld"><small>Internal note</small><textarea id="qf-n" rows="2"></textarea></label>`,`<button class="bt" data-qm="save" data-id="">Create quote</button><button class="bo" data-mc>Cancel</button>`);
 modal((q.status==='Quoted'?'Review quote ':'Quote ')+'<span data-notr>'+esc(q.id)+'</span>',`<p class="m">${esc(q.co)} · ${esc(q.proj)}</p><hr>${quoDetail(q)}<hr>${FD('qf-a','Amount before tax (USD)',q.amt,'number')}${SL('qf-s','Status',QSTAT,q.status)}<label class="fld"><small>Internal note</small><textarea id="qf-n" rows="2">${esc(q.note||'')}</textarea></label>`,`<button class="bt" data-qm="save" data-id="${esc(q.id)}">Save changes</button><button class="bo" data-mc>Close</button><button class="bo rd" data-d="quo" data-id="${esc(q.id)}">Delete</button>`)}
function saveQuo(id){const am=parseFloat(v('qf-a')),stt=v('qf-s'),note=v('qf-n').trim();if(!(am>0))return merr('Enter an amount greater than 0.');
 if(!id){const co=v('qf-c').trim(),pj=v('qf-p').trim();if(!co||!pj)return merr('Enter the company and the project name.');const n=quotes().reduce((a,q)=>Math.max(a,dnum(q.id)),2000)+1,qid='Q-'+n,aq=S.get('aq',[]);aq.push({id:qid,co,proj:pj,amt:am,status:stt});S.set('aq',aq);if(note){const o=S.get('qov',{});o[qid]={note};S.set('qov',o)}S.set('qc',n);qc=Math.max(qc,n);mclose();rAQ();rAD();return toast(`Quote ${qid} created`)}
 const ov=S.get('qov',{});ov[id]=Object.assign(ov[id]||{},{amt:am,status:stt,note});S.set('qov',ov);mclose();rAQ();rAD();toast(`${id} updated`)}
/* ---------- xóa (có hộp thoại xác nhận) ---------- */
const DLAB={prod:'product',ord:'order',quo:'quote',cat:'category',usr:'user'};
const DMSG={self_delete:'You can’t delete your own account.',last_admin:'At least one active admin is required.',has_records:'This user already has orders, quotes or invites linked to it. Set the status to Inactive instead.',not_found:'That account no longer exists.'};
function delName(kind,id){try{if(kind==='prod'){const d=allDefs()[id],o=OV()[id]||{};return d?(o.n||d.n):id}if(kind==='ord')return id;if(kind==='quo'){const q=quotes().find(x=>x.id===id);return q?`${q.id} · ${q.co}`:id}if(kind==='cat'){const c=catList().find(x=>x.id===id);return c?c.name:id}if(kind==='usr'){const q=SRVU[+id];return q?q.email:id}}catch(e){}return id}
function askDel(kind,id){if(kind==='cat'){const c=catList().find(q=>q.id===id);if(!c)return;const n=catCount(c.name,true);if(n)return toast(`Can’t delete “${c.name}” yet: move its ${n} product${n==1?'':'s'} to another category first.`)}
 modal('Delete '+DLAB[kind]+'?',`<p class="m"><b>${esc(String(delName(kind,id)))}</b> will be permanently removed. This can’t be undone.</p>`,`<button class="bt rd" data-dok="${kind}" data-id="${esc(String(id))}">Delete</button><button class="bo" data-mc>Cancel</button>`)}
async function doDel(kind,id){
 if(kind==='prod')return delProd(id);
 if(kind==='cat')return delCat(id);
 if(kind==='ord'){const l=S.get('odel',[]);if(!l.includes(id)){l.push(id);S.set('odel',l)}S.set('ords',S.get('ords',[]).filter(o=>o.id!==id));mclose();refreshAdmin();return toast(`Order ${id} deleted`)}
 if(kind==='quo'){const l=S.get('qdel',[]);if(!l.includes(id)){l.push(id);S.set('qdel',l)}S.set('aq',S.get('aq',[]).filter(q=>q.id!==id));mclose();rAQ();rAD();return toast(`Quote ${id} deleted`)}
 if(kind==='usr'){const q=SRVU[+id];if(!q||!SRV){mclose();return}const r=await api('/api/admin/users/'+q.id,null,'DELETE');if(!r.ok)return merr(DMSG[r.code]||UMSG.invalid);mclose();rAU();toast('User deleted')}}
/* ---------- xuất file PDF / Excel ---------- */
let _exp;const loadExp=()=>_exp||(_exp=new Promise((res,rej)=>{if(window.TDExport)return res();const ld=(src,nx)=>{const sc=document.createElement('script');sc.src=src;sc.onload=nx;sc.onerror=()=>{_exp=null;rej(new Error('Can’t load '+src))};document.head.appendChild(sc)};ld('js/export-font.js',()=>ld('js/export.js',res))}));
const numOf=t=>parseFloat(String(t).replace(/[^0-9.\-]/g,''))||0;
const VIH=()=>{try{const l=localStorage.getItem('tdev-lang');return l?l==='vi':/^vi/i.test(navigator.language||'')}catch(e){return false}};
const HD=(en,vi)=>VIH()?vi:en;
const EXP={
 'a-prod':()=>{const D=allDefs(),ov=OV();return{title:HD('Products','Danh sách sản phẩm'),sheet:HD('Products','Sản phẩm'),file:'products',head:HD(['SKU','Product','Brand','Category','Retail price (USD)','Stock','Status'],['SKU','Sản phẩm','Thương hiệu','Danh mục','Giá bán lẻ (USD)','Tồn kho','Trạng thái']),types:['s','s','s','s','c','n','s'],
  rows:Object.keys(D).map(k=>{const d=D[k],o=ov[k]||{},c=o.c||d.c,st=o.stock!=null?o.stock:(d.stock!=null?d.stock:50);return[skuOf(k,c),o.n||d.n,o.b||d.b,c,o.price!=null?o.price:baseP(d),st,o.hide?HD('Hidden','Đang ẩn'):HD('Active','Đang bán')]})}},
 'a-ord':()=>({title:HD('Orders','Danh sách đơn hàng / hóa đơn'),sheet:HD('Orders','Đơn hàng'),file:'orders',head:HD(['Order','Customer','Date','Items','Total (USD)','Status'],['Mã đơn','Khách hàng','Ngày','Sản phẩm','Tổng tiền (USD)','Trạng thái']),types:['s','s','s','s','c','s'],
  rows:orders().map(o=>[o.id,o.cust,o.date,o.items.map(i=>`${i[0]} × ${i[1]}`).join('; '),numOf(o.total),o.status])}),
 'a-quo':()=>({title:HD('Quote requests','Danh sách báo giá'),sheet:HD('Quotes','Báo giá'),file:'quotes',head:HD(['Quote','Company','Project','Amount before tax (USD)','Status','Note'],['Mã báo giá','Công ty','Dự án','Giá trị trước thuế (USD)','Trạng thái','Ghi chú']),types:['s','s','s','c','s','s'],
  rows:quotes().map(q=>[q.id,q.co,q.proj,Number(q.amt)||0,q.status,q.note||''])}),
 'a-cat':()=>({title:HD('Categories','Danh sách danh mục'),sheet:HD('Categories','Danh mục'),file:'categories',head:HD(['Category','URL slug','Products','Display order','Status'],['Danh mục','Đường dẫn','Số sản phẩm','Thứ tự hiển thị','Trạng thái']),types:['s','s','n','n','s'],
  rows:catList().map(c=>[c.name,c.id,catCount(c.name),Number(c.order)||0,c.status])}),
 'a-usr':()=>({title:HD('Users','Danh sách người dùng'),sheet:HD('Users','Người dùng'),file:'users',head:HD(['Name','Email','Company','Role','Status'],['Họ tên','Email','Công ty','Vai trò','Trạng thái']),types:['s','s','s','s','s'],
  rows:SRVU.map(q=>[q.name,q.email,q.company||'',RL[q.role]||q.role,q.status==='active'?HD('Active','Hoạt động'):HD('Inactive','Ngưng')])})};
const p2=n=>String(n).padStart(2,'0');
async function doExport(sec,fmt,btn){const d=EXP[sec]();if(!d.rows.length)return toast('There is nothing to export yet.');
 if(btn.classList.contains('ld'))return;btn.classList.add('ld');
 try{await loadExp();const now=new Date(),day=`${now.getFullYear()}-${p2(now.getMonth()+1)}-${p2(now.getDate())}`,stamp=`${p2(now.getDate())}/${p2(now.getMonth()+1)}/${now.getFullYear()} ${p2(now.getHours())}:${p2(now.getMinutes())}`,who=cfg().aName||(me()&&me().name)||'Admin',site=cfg().site||'TDev';
  if(fmt==='pdf'){TDExport.download(TDExport.pdf({title:d.title,subtitle:`${site} · ${d.rows.length} ${HD('records','dòng')} · ${stamp} · ${who}`,footer:`${site} Electronics · ${d.title}`,pageLabel:HD('Page','Trang'),head:d.head,rows:d.rows,types:d.types}),`tdev-${d.file}-${day}.pdf`,'application/pdf')}
  else{TDExport.download(TDExport.xlsx({sheet:d.sheet,title:d.title,author:who,head:d.head,rows:d.rows,types:d.types}),`tdev-${d.file}-${day}.xlsx`,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')}
  toast(`${d.title}: ${fmt==='pdf'?'PDF':'Excel'} file ready (${d.rows.length})`)}
 catch(e){toast('Export failed: '+(e&&e.message||e))}finally{btn.classList.remove('ld')}}
/* dashboard: every figure comes from the orders / quotes / catalog stored in this browser */
function rAD(){const sec=$('#a-dash');if(!sec)return;const l=orders(),q=quotes(),now=new Date(),n=now.getDate(),
 mo=l.filter(o=>{const d=pdate(o.date);return d&&d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear()}),live=mo.filter(o=>o.status!=='Cancelled'),rev=live.reduce((a,o)=>a+dnum(o.total),0),
 aw=q.filter(quoWait).length,disp=l.filter(o=>o.status==='Pending'||o.status==='Processing').length,D=allDefs(),ov=OV(),
 low=Object.keys(D).filter(k=>{const o=ov[k]||{};if(o.hide)return false;const st=o.stock!=null?o.stock:(D[k].stock!=null?D[k].stock:50);return st<10}).length,
 cu=new Set(l.map(o=>o.cust.split(' · ')[0])).size;
 $('.ab>p.m',sec).textContent=now.toLocaleDateString('en-US',{weekday:'long',year:'numeric',month:'long',day:'numeric'})+' · Here’s how TDev is doing.';
 const kp=$$('.g4 .cd',sec),set=(i,a,h,sub)=>{$('small.m',kp[i]).textContent=a;$('h2',kp[i]).textContent=h;$('small.gr',kp[i]).textContent=sub};
 set(0,'Revenue this month',M(rev),`${live.length} order${live.length==1?'':'s'}, cancelled excluded`);set(1,'Orders this month',String(mo.length),`${disp} to dispatch`);set(2,'Quote requests',String(q.length),`${aw} awaiting your response`);set(3,'Customers',String(cu),'With at least one order');
 const c1=$$('.lay2>.cd',sec)[0],day=Array(n).fill(0);live.forEach(o=>{const d=pdate(o.date);if(d&&d.getDate()<=n)day[d.getDate()-1]+=dnum(o.total)});let cum=0;const pts=day.map(x=>cum+=x),mx=Math.max(...pts,1),xy=pts.map((y,i)=>`${n>1?(i/(n-1)*600).toFixed(1):0},${(200-y/mx*180).toFixed(1)}`).join(' ');
 $('p.m small',c1).textContent=`USD · ${MO[now.getMonth()]} 1–${n}, ${now.getFullYear()}`;const sv=$('svg.chart',c1);sv.innerHTML=`<g style="stroke:var(--bd)"><path d="M0 20h600M0 75h600M0 130h600M0 185h600"/></g><polyline points="${xy}" fill="none" stroke="#3B5BFF" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;sv.setAttribute('aria-label',`Cumulative revenue, ${MO[now.getMonth()]} 1–${n}`);
 $('small.m',c1).textContent=`Cumulative revenue ${M(rev)} · month to date`;
 $$('.at .nb',sec).forEach((e,i)=>e.textContent=[aw,disp,low][i]);
 $('.tw table',sec).innerHTML='<tr><th>Order</th><th>Customer</th><th>Date</th><th>Total</th><th>Status</th><th>Action</th></tr>'+(l.length?l.slice(0,5).map(o=>`<tr data-id="${esc(o.id)}"><td><b>${esc(o.id)}</b></td><td>${esc(o.cust)}</td><td>${esc(o.date)}</td><td>${esc(o.total)}</td><td><span class="tg ${OC[o.status]||''}">${o.status}</span></td><td class="act">View</td></tr>`).join(''):'<tr><td colspan="6" class="m">No orders yet.</td></tr>');
 const cnt={};l.filter(o=>o.status!=='Cancelled').forEach(o=>(o.items||[]).forEach(i=>{cnt[i[0]]=(cnt[i[0]]||0)+(+i[1]||0)}));const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,3);
 $$('.g2>.cd',sec)[0].innerHTML='<h3>Top-performing devices</h3>'+(top.length?top.map(([a,c])=>`<p class="sl"><span class="m">${esc(a)}</span><b>${c} sold</b></p>`).join(''):'<p class="m">No sales recorded yet.</p>');
 const mi=$('.mint',sec);$('h3',mi).textContent='Quote requests';$('h2',mi).textContent=String(q.length);$('p.m',mi).textContent=`${aw} waiting for your response. Open a request to review it and update its status.`}
/* ---------- settings pages ---------- */

function fillCS(){const p=prefs(),u=me();$('#cs').innerHTML=`<div class="cd sg"><h3>Appearance</h3><p class="m">Applies to the shopping site only.</p>${SL('cs-t','Theme',['System','Light','Dark'],p.theme[0].toUpperCase()+p.theme.slice(1))}${SL('cs-z','Text size',['Default','Large','Extra large'],{'100':'Default','110':'Large','120':'Extra large'}[p.size])}${SW('cs-m','Reduce motion',p.rm,'Turns off animations and transitions.')}</div><div class="cd sg"><h3>Notifications</h3>${SW('cs-o','Order updates',p.orders,'Emails when your order status changes.')}${SW('cs-n','Product news and deals',p.promo)}</div><div class="cd sg"><h3>Profile</h3>${FD('cs-n1','Full name',u.name)}${FD('cs-c','Company',u.company||'')}<label class="fld"><small>Email (sign-in)</small><input value="${esc(u.email)}" disabled></label></div><button class="bt" data-sv="cust">Save settings</button>`}
function fillAS(){const c=cfg(),u=me();$('#as').innerHTML=`<div class="cd sg"><h3>Website</h3><p class="m">What customers see on the storefront.</p>${FD('as-s','Store name',c.site)}${FD('as-h','Homepage headline (leave empty for default)',c.hero)}${FD('as-hs','Homepage subtext (leave empty for default)',c.heroSub)}<label class="fld"><small>Brand colour</small><input id="as-b" type="color" value="${c.brand}"></label>${SW('as-ao','Show announcement bar',c.annOn)}${FD('as-a','Announcement text',c.ann)}${SW('as-mt','Maintenance mode',c.mnt,'Customers see a “be right back” page. Admins can still sign in and work.')}${FD('as-fx','Exchange rate: 1 USD = ? VND (used to show prices in VND)',FXS(),'number')}<button class="bt" data-sv="site">Save website settings</button></div><div class="cd sg"><h3>Admin console</h3>${FD('as-n','Display name',c.aName||(u?u.name:''))}${SL('as-t','Theme',['System','Light','Dark'],c.adminTheme[0].toUpperCase()+c.adminTheme.slice(1))}${SW('as-d','Compact tables',c.dense)}${SW('as-no','Alert me about new orders',c.aOrder)}${SW('as-nq','Alert me about new quote requests',c.aQuote)}${SW('as-ns','Alert me about low stock',c.aStock)}<button class="bt" data-sv="admin">Save console settings</button></div><div class="cd sg"><h3>Demo data</h3><p class="m">Removes products, orders, users and settings you added in this browser.</p><button class="bo rd" data-reset>Reset demo data</button></div>`}
/* ---------- banner trang chủ (slider): thêm / sửa / đổi ảnh / xóa / sắp xếp slide ---------- */
const HB=new Proxy({},{get:(_,k)=>window.TDevHero&&window.TDevHero[k]}),hbOk=()=>!!window.TDevHero,HBT=[['Midnight','rgba(10,15,30,.92),rgba(10,15,30,.55)'],['Indigo','rgba(30,27,75,.95),rgba(59,91,255,.55)'],['Emerald','rgba(6,40,38,.95),rgba(11,122,100,.55)'],['Amber','rgba(40,20,12,.95),rgba(180,83,9,.5)'],['Ocean','rgba(15,23,42,.95),rgba(47,73,214,.55)']],
 HBP=[['','None'],['laptop','Laptop'],['phone','Phone'],['headphones','Headphones'],['airpods','Earbuds'],['hub','USB-C hub'],['printer','Printer'],['chair','Office chair']];
let hbEdit=-1,hbP={};
const hbOne=t=>String(t).replace(/\s*\n+\s*/g,' '),hbVi=()=>window.TDevLang&&TDevLang.get()==='vi',hbQ=(en,vi)=>hbVi()?vi:en;
const hbBg=s=>`background-image:linear-gradient(90deg,${HBT[s.th-1][1]}),url('${s.bg||'assets/img/hero.jpg'}')`;
function hbRender(){const w=$('#ahb');if(!w)return;if(!hbOk()){window.addEventListener('load',hbRender,{once:true});return}const L=HB.list(),cus=HB.custom();
 w.innerHTML=`<div class="cd sg" id="banner"><div class="hx"><div><h3>Homepage banner</h3><p class="m">Edit, add, reorder or remove the slides in the big slider at the top of the homepage, and change their pictures.</p></div><div class="hba"><button class="bt" type="button" data-hb="add">+ Add slide</button><a class="bo" href="index.html">View homepage</a></div></div>${L.map((s,i)=>`<div class="hbr"><span class="hbt" style="${hbBg(s)}"></span><div class="hbi"><b>${esc(hbOne(s.title)||'(No headline)')}</b><small class="m">${esc(s.pill||s.text||'')}</small></div><div class="hbb"><button class="bo" type="button" data-hb="up" data-i="${i}" aria-label="Move up"${i?'':' disabled'}>↑</button><button class="bo" type="button" data-hb="down" data-i="${i}" aria-label="Move down"${i<L.length-1?'':' disabled'}>↓</button><button class="bo" type="button" data-hb="edit" data-i="${i}">Edit</button><button class="bo rd" type="button" data-hb="del" data-i="${i}"${L.length>1?'':' disabled'}>Delete</button></div></div>`).join('')}<p class="m"><small>${cus?'Your own banner is shown on the homepage.':'The default banner is shown. Your first change creates your own copy.'}</small></p>${cus?'<button class="bo rd" type="button" data-hb="reset">Restore default banner</button>':''}</div>`;
 if(location.hash==='#banner'&&!hbRender.done){hbRender.done=1;const b=$('#banner');if(b)setTimeout(()=>b.scrollIntoView({block:'start'}),60)}}
function hbSave(L){if(!HB.save(L)){toast('Not enough browser storage for these pictures. Use smaller pictures or remove a slide.');return false}hbRender();return true}
function hbImgField(k,l,pre){return`<div class="fld"><small>${l}</small><div class="cimgp" id="hb-pv-${k}"></div><div class="cimga">${pre?`<select id="hb-ps-${k}" aria-label="${l}">${HBP.map(p=>`<option value="${p[0]}">${p[1]}</option>`).join('')}<option value="_c" hidden>Your own picture</option></select>`:''}<input type="file" id="hb-f-${k}" accept="image/png,image/jpeg,image/webp"><button type="button" class="bo" data-hb="clr" data-k="${k}">${pre?'Remove':'Use default photo'}</button></div></div>`}
function hbPrev(k){const pv=$('#hb-pv-'+k),v=hbP[k]||'';if(!pv)return;const u=k==='bg'?(v||'assets/img/hero.jpg'):HB.imgUrl(v);pv.style.backgroundImage=u?`url("${u}")`:'';pv.classList.toggle('on',!!u);const se=$('#hb-ps-'+k);if(se)se.value=/^data:/.test(v)?'_c':v}
function hbModal(i){if(!hbOk())return;const L=HB.list(),s=i>=0?L[i]:Object.assign({},HB.BLANK);hbEdit=i;hbP={bg:s.bg,i1:s.i1,i2:s.i2};
 modal(i>=0?'Edit slide':'Add slide',`${FD('hb-pill','Badge text',s.pill)}<label class="fld"><small>Headline * (use a new line to break it)</small><textarea id="hb-title" rows="2" maxlength="120">${esc(s.title)}</textarea></label><label class="fld"><small>Description</small><textarea id="hb-text" rows="3" maxlength="300">${esc(s.text)}</textarea></label><div class="g2s">${FD('hb-b1t','Main button text',s.b1t)}${FD('hb-b1l','Main button link',s.b1l)}</div><div class="g2s">${FD('hb-b2t','Second button text',s.b2t)}${FD('hb-b2l','Second button link',s.b2l)}</div>${FD('hb-note','Small text under the buttons',s.note)}${SL('hb-th','Colour overlay',HBT.map(t=>t[0]),HBT[s.th-1][0])}${hbImgField('bg','Background photo (large picture behind the text)',false)}${hbImgField('i1','Main picture (large card on the right)',true)}${hbImgField('i2','Small picture (second card)',true)}<div class="g2s">${FD('hb-ct','Caption title',s.ct)}${FD('hb-cs','Caption text',s.cs)}</div><small class="m">Leave a button text empty to hide that button. Pictures are resized automatically (JPG, PNG or WebP).</small>`,
  `<button class="bt" type="button" data-hbm="save">Save slide</button><button class="bo" type="button" data-mc>Cancel</button>`);
 ['bg','i1','i2'].forEach(hbPrev)}
function hbSaveSlide(){const v=id=>($('#'+id)||{value:''}).value,L=HB.list(),
  s={pill:v('hb-pill').trim(),title:v('hb-title').trim(),text:v('hb-text').trim(),b1t:v('hb-b1t').trim(),b1l:v('hb-b1l').trim(),b2t:v('hb-b2t').trim(),b2l:v('hb-b2l').trim(),note:v('hb-note').trim(),bg:hbP.bg,i1:hbP.i1,i2:hbP.i2,ct:v('hb-ct').trim(),cs:v('hb-cs').trim(),th:Math.max(1,HBT.findIndex(t=>t[0]===v('hb-th'))+1)};
 if(!s.title)return merr('Enter a headline.');
 for(const [t,l] of [['b1t','b1l'],['b2t','b2l']]){if(s[t]&&!s[l])return merr('Enter a link for the button (for example shop.html).');if(s[l]&&!HB.safeLink(s[l]))return merr('That link is not valid. Use a page such as shop.html or an address starting with https://');if(!s[t])s[l]=''}
 if(hbEdit<0&&L.length>=HB.MAX)return merr(`You can have up to ${HB.MAX} slides.`);
 const n=HB.sanitize(s);if(hbEdit>=0)L[hbEdit]=n;else L.push(n);
 if(hbSave(L)){mclose();toast('Slide saved')}}
document.addEventListener('change',e=>{const t=e.target,m=t.id&&t.id.match(/^hb-(f|ps)-(bg|i1|i2)$/);if(!m)return;const k=m[2];
 if(m[1]==='ps'){if(t.value!=='_c')hbP[k]=t.value;hbPrev(k);return}
 const f=t.files&&t.files[0];if(!f)return;readImg(f,k==='bg'?1600:800,k==='bg'?.78:.82).then(d=>{hbP[k]=d;hbPrev(k);const er=$('.mdl .er');if(er)er.hidden=true}).catch(m2=>{t.value='';merr(m2)})});
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-hb],[data-hbm]');if(!b||!hbOk())return;e.preventDefault();
 if(b.dataset.hbm==='save'){hbSaveSlide();return}
 const a=b.dataset.hb,i=+b.dataset.i;
 if(a==='clr'){const k=b.dataset.k;hbP[k]='';hbPrev(k);const f=$('#hb-f-'+k);if(f)f.value='';return}
 if(a==='add'){if(HB.list().length>=HB.MAX)return toast(`You can have up to ${HB.MAX} slides.`);hbModal(-1);return}
 if(a==='edit'){hbModal(i);return}
 const L=HB.list();
 if(a==='up'||a==='down'){const j=a==='up'?i-1:i+1;if(j<0||j>=L.length)return;[L[i],L[j]]=[L[j],L[i]];hbSave(L);return}
 if(a==='del'){if(L.length<2)return;if(!confirm(hbQ('Delete this slide from the homepage banner?','Xóa slide này khỏi banner trang chủ?')))return;L.splice(i,1);if(hbSave(L))toast('Slide deleted');return}
 if(a==='reset'){if(!confirm(hbQ('Restore the default homepage banner? Your own slides will be removed.','Khôi phục banner trang chủ mặc định? Các slide bạn đã tạo sẽ bị xóa.')))return;HB.reset();hbRender();toast('Default banner restored')}});
const TH=s=>s.toLowerCase();
/* ---------- bộ lọc bảng admin: tab + trạng thái + tìm kiếm ---------- */
const FSTAT={'a-prod':['Active','Hidden'],'a-cat':['Active','Hidden'],'a-ord':OS,'a-quo':QSTAT,'a-usr':['Active','Inactive']};
function adFilter(ad){if(!ad||!FSTAT[ad.id])return;const tb=$('.tw table',ad);if(!tb)return;
 const tab=$('.tabs a.on',ad),tk=tab&&tab.dataset.s?tab.dataset.s:'all',fs=ad.dataset.fst||'',inp=$('.tl .sf input',ad),q=inp?inp.value.toLowerCase().trim():'';let shown=0,total=0;
 const rs=[...tb.rows].slice(1).filter(r=>r.dataset.st!=null);if(q)rs.forEach(r=>r.style.display='');
 rs.forEach(r=>{total++;const s0=r.dataset.st,okT=tk==='all'||(tk==='req'?r.dataset.rq==='1':tk.startsWith('r:')?r.dataset.rl===tk.slice(2):s0===tk),ok=okT&&(!fs||s0===fs)&&(!q||(r.innerText+' '+r.textContent).toLowerCase().includes(q));r.style.display=ok?'':'none';if(ok)shown++});
 let e=$('.nores',ad);if(total&&!shown){if(!e){e=document.createElement('p');e.className='m nores';e.textContent='No records match these filters.';$('.tw',ad).after(e)}}else if(e)e.remove()}
function selMenu(ad,sel){let m=$('.smenu',sel);if(m){m.hidden=!m.hidden;sel.setAttribute('aria-expanded',String(!m.hidden));return}
 const cur=ad.dataset.fst||'';m=document.createElement('div');m.className='smenu';m.setAttribute('role','listbox');
 m.innerHTML=['',...(FSTAT[ad.id]||[])].map(o=>`<a role="option" tabindex="0" data-sopt="${esc(o)}" class="${o===cur?'on':''}">${o||'All statuses'}</a>`).join('');sel.appendChild(m);sel.setAttribute('aria-expanded','true')}
const selClose=()=>$$('.sel .smenu').forEach(m=>{m.hidden=true;m.parentNode.setAttribute('aria-expanded','false')});
document.addEventListener('click',e=>{if(!e.target.closest('.sel'))selClose()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){selClose();const b=$('.bellm');if(b)b.hidden=true}});
/* chuông thông báo của admin */
const lowCount=()=>{const D=allDefs(),ov=OV();return Object.keys(D).filter(k=>{const o=ov[k]||{};if(o.hide)return false;const st=o.stock!=null?o.stock:(D[k].stock!=null?D[k].stock:50);return st<10}).length};
function bellData(){const c=cfg(),l=orders(),it=[];const nrq=l.filter(rqOpen).length,np=l.filter(o=>o.status==='Pending').length,npr=l.filter(o=>o.status==='Processing').length,nq=quotes().filter(quoWait).length,nl=lowCount();
 if(nrq)it.unshift([nrq,nrq===1?'cancel request is waiting for approval':'cancel requests are waiting for approval','a-ord.html']);
 if(c.aOrder&&np)it.push([np,np===1?'order is waiting for confirmation':'orders are waiting for confirmation','a-ord.html']);
 if(c.aOrder&&npr)it.push([npr,npr===1?'order is being processed':'orders are being processed','a-ord.html']);
 if(c.aQuote&&nq)it.push([nq,nq===1?'quote request needs a response':'quote requests need a response','a-quo.html']);
 if(c.aStock&&nl)it.push([nl,nl===1?'product is low on stock':'products are low on stock','a-prod.html']);return it}
function bellSync(){const b=$('.atop .bell');if(!b)return;const it=bellData(),n=it.reduce((a,x)=>a+x[0],0),em=$('em',b);if(em)em.textContent=n>99?'99+':(n||'');
 let m=$('.bellm');if(!m){m=document.createElement('div');m.className='bellm';m.hidden=true;m.setAttribute('role','menu');$('.atop').appendChild(m)}
 m.innerHTML='<h4>Notifications</h4>'+(it.length?it.map(x=>`<a href="${x[2]}">${x[0]} ${x[1]}</a>`).join(''):'<p class="m">You’re all caught up.</p>')+'<a class="bell-s" href="a-set.html">Notification settings</a>'}
document.addEventListener('click',e=>{const b=e.target.closest('.atop .bell');if(b){e.preventDefault();bellSync();const m=$('.bellm');if(m)m.hidden=!m.hidden;b.setAttribute('aria-expanded',String(m&&!m.hidden));return}if(!e.target.closest('.bellm')){const m=$('.bellm');if(m)m.hidden=true}});
/* bản nháp báo giá + in */
const DRF='rfqdraft';
function rfqDraft(){const f=$$('#rfq .fld input,#rfq .fld textarea,#rfq .fld select');S.set(DRF,f.map(i=>i.type==='checkbox'?i.checked:i.value));toast('Draft saved on this device')}
function rfqRestore(){const d=S.get(DRF,null);if(!Array.isArray(d))return;$$('#rfq .fld input,#rfq .fld textarea,#rfq .fld select').forEach((i,n)=>{if(d[n]==null)return;if(i.type==='checkbox')i.checked=!!d[n];else i.value=d[n]});rfq()}
document.addEventListener('click',e=>{if(e.target.closest('[data-draft]')){e.preventDefault();rfqDraft()}else if(e.target.closest('[data-print]')){e.preventDefault();window.print()}});
/* ---------- admin click router ---------- */
function admin(e,T,c){let x;
 if(x=c('[data-inv]')){e.stopImmediatePropagation();e.preventDefault();invAct(x);return}
 if(x=c('[data-dok]')){e.stopImmediatePropagation();e.preventDefault();doDel(x.dataset.dok,x.dataset.id);return}
 if(x=c('[data-d]')){e.stopImmediatePropagation();e.preventDefault();askDel(x.dataset.d,x.dataset.id);return}
 if(x=c('[data-mc]')||(T.classList&&T.classList.contains('mdl')?T:null)){mclose();return}
 if(x=c('[data-pm]')){e.stopImmediatePropagation();const a=x.dataset.pm;if(a==='rmimg'){pfImg='';const fi=$('#pf-img');if(fi)fi.value='';pfPreview('')}else if(a==='rmgl'){pfGl.splice(+x.dataset.i,1);pfGlRender()}else a==='save'?saveProd(x.dataset.k):delProd(x.dataset.k);return}
 if(x=c('[data-cx]')){e.stopImmediatePropagation();e.preventDefault();const a=x.dataset.cx,id=x.dataset.id;if(a==='ok')cxDo(id,x.dataset.by);else if(a==='approve')rqApprove(id);else if(a==='reject'){mclose();rqRejectModal(id)}else if(a==='rejok')rqRejectDo(id);else if(a==='review'){mclose();ordModal(id)}else{mclose();cxModal(id,x.dataset.by)}return}
 if(x=c('[data-om]')){const id=x.dataset.id,ns=v('of-s'),o=orders().find(q=>q.id===id);
  if(ns==='Cancelled'&&o&&o.status!=='Cancelled'){if(!canCx(o.status,'admin'))return merr('This order can’t be cancelled any more.');mclose();cxModal(id,'admin');return}
  const st=S.get('ost',{});st[id]=ns;S.set('ost',st);if(ns!=='Cancelled'){const cx=S.get('ocx',{});if(cx[id]){delete cx[id];S.set('ocx',cx)}}mclose();refreshAdmin();bellSync();toast(`${id} marked ${ns}`);return}
 if((x=c('#quotes td.act'))&&x.cellIndex>0&&/^Q-/.test(x.parentNode.cells[0].textContent.trim())){e.stopImmediatePropagation();e.preventDefault();custQuoModal(x.parentNode);return}
 if((x=c('#account td.act'))&&x.cellIndex>0&&x.parentNode.dataset.id){e.stopImmediatePropagation();e.preventDefault();custOrdModal(x.parentNode.dataset.id);return}
 if(x=c('[data-um]')){saveUser(x.dataset.i);return}
 if(x=c('[data-cm]')){e.stopImmediatePropagation();x.dataset.cm==='save'?saveCat(x.dataset.id):delCat(x.dataset.id);return}
 if(x=c('[data-qm]')){e.stopImmediatePropagation();saveQuo(x.dataset.id);return}
 if(x=c('[data-sv]')){const k=x.dataset.sv;
  if(k==='cust'){const u=users(),s=me(),n=v('cs-n1').trim();if(n.length<2)return toast('Enter your full name');const z={'Default':'100','Large':'110','Extra large':'120'}[v('cs-z')];S.set('pref-'+s.email,{theme:TH(v('cs-t')),size:z,rm:ck('cs-m'),orders:ck('cs-o'),promo:ck('cs-n')});const i=u.findIndex(q=>q.email===s.email);if(i>-1){u[i].name=n;u[i].company=v('cs-c').trim();S.set('users',u)}S.set('sess',Object.assign(s,{name:n,company:v('cs-c').trim()}));applyAuth();applyTheme()}
  if(k==='site'){const c0=cfg();if(!v('as-s').trim())return toast('Enter a store name');const fx=parseFloat(v('as-fx'));if(!(fx>=1000&&fx<=1000000))return toast('Enter an exchange rate between 1,000 and 1,000,000 VND per USD');const fxOld=FXS();S.set('fx',fx);if(fx!==fxOld)setTimeout(()=>location.reload(),700);S.set('cfg',Object.assign(c0,{site:v('as-s').trim(),hero:v('as-h').trim(),heroSub:v('as-hs').trim(),brand:v('as-b'),annOn:ck('as-ao'),ann:v('as-a'),mnt:ck('as-mt')}));applySite();mnt()}
  if(k==='admin'){S.set('cfg',Object.assign(cfg(),{aName:v('as-n').trim(),adminTheme:TH(v('as-t')),dense:ck('as-d'),aOrder:ck('as-no'),aQuote:ck('as-nq'),aStock:ck('as-ns')}));applySite();applyAuth();applyTheme()}
  toast('Settings saved');return}
 if(c('[data-reset]')){if(confirm('Reset all demo data in this browser?')){['cprods','pov','ords','ost','users','cfg','sess','ordseen','invites','cdel','shipaddr','shipto','ocx','ocr','fx','hero','homeprods','pgedit','chatbot'].forEach(k=>localStorage.removeItem('tdev-'+k));location.href=U('login')}return}
 const ad=c('#a-prod,#a-ord,#a-usr,#a-cat,#a-quo,#a-dash');if(!ad)return;
 if(x=c('.sel .smenu [data-sopt]')){e.stopImmediatePropagation();e.preventDefault();const o=x.dataset.sopt,sel=x.closest('.sel');ad.dataset.fst=o;const lb=$('[data-sl]',sel);if(lb)lb.textContent=o||'All statuses';selClose();adFilter(ad);return}
 if((x=c('.tl .sel'))&&FSTAT[ad.id]){e.stopImmediatePropagation();e.preventDefault();selMenu(ad,x);return}
 if((x=c('[data-exp]'))&&EXP[ad.id]){e.stopImmediatePropagation();e.preventDefault();doExport(ad.id,x.dataset.exp,x);return}
 if(c('.tl .bt')){e.stopImmediatePropagation();e.preventDefault();({'a-prod':()=>prodModal(),'a-usr':()=>userModal(null),'a-cat':()=>catModal(null),'a-quo':()=>quoModal(null)}[ad.id]||(()=>toast('Orders are created when customers check out')))();return}
 if((x=c('td.act'))&&x.cellIndex>0){e.stopImmediatePropagation();const r=x.parentNode;({'a-prod':()=>prodModal(r.dataset.k),'a-ord':()=>ordModal(r.dataset.id),'a-dash':()=>ordModal(r.dataset.id),'a-usr':()=>userModal(+r.dataset.i),'a-cat':()=>catModal(r.dataset.id),'a-quo':()=>quoModal(r.dataset.id)}[ad.id])()}}
/* ---------- routing ---------- */
function route(){const id=PAGE,r=role();let to=null,msg='';
 if(id.startsWith('a-')&&r!=='admin'){if(r==='customer'){to='account';msg='The Admin console is for administrators only. You’re signed in as a customer.'}else{to='admin-login';msg='Sign in as an administrator to continue.'}}
 else if(r==='admin'&&['cart','checkout','account','quotes','settings','rfq'].includes(id)&&!(id==='rfq'&&QS.get('pe')==='1')){to='a-dash';msg='Administrators manage the store here. Use a customer account to shop.'}
 else if((id==='admin-login'||id==='admin-register')&&r==='customer'){to='account';msg='You’re signed in as a customer. Sign out first to use an admin account.'}
 else if(r==='guest'&&['account','quotes','settings','checkout'].includes(id)){to='login';msg='Please sign in to continue.';sessionStorage.setItem('next',id)}
 else if((id==='login'||id==='register'||id==='admin-login'||id==='admin-register')&&r!=='guest')to=r==='admin'?'a-dash':'account';
 else if(id.startsWith('cat-')&&cdel().includes(id.slice(4))){to='shop';msg='That category has been deleted.'}
 if(to){try{if(msg)sessionStorage.setItem('flash',msg)}catch(e){}rep(to);return true}
 if(['login','register','admin-login','admin-register'].includes(id))resetAuth(id);if(id==='admin-register')prefillInvite();
 if(id==='a-prod')rAP();if(id==='a-ord')rAO();if(id==='a-cat')rAC();if(id==='a-quo')rAQ();if(id==='a-dash')rAD();if(id==='a-usr')rAU();if(id==='a-set'){fillAS();hbRender()}if(id==='settings')fillCS();if(id==='account')setView(accView);
 $$('.pgn>div').forEach(d=>{d.style.display='none'});hideDelCats();applyTheme();mnt();
 if(FSTAT[id]){const ad=$('#'+id);let t=0;new MutationObserver(()=>{if(t)return;t=requestAnimationFrame(()=>{t=0;adFilter(ad)})}).observe($('.tw',ad),{childList:true,subtree:true});adFilter(ad)}
 if(id.startsWith('a-'))bellSync();if(id==='rfq')rfqRestore();return false}
if(!SRV&&!S.get('users',null))users();
commit();if(pr&&QS.get('k')&&P[QS.get('k')]&&cur!==QS.get('k'))showProduct(QS.get('k'));applySite();applyAuth();
S.get('orows',[]).forEach(r=>addRow('#account',r));S.get('trows',[]).forEach(t=>{const tb=$('#txt');if(tb)tb.insertRow(1).innerHTML=t});S.get('qrows',[]).forEach(r=>addRow('#quotes',r));cOrd();
if(!route()){let f=null;try{f=sessionStorage.getItem('flash');sessionStorage.removeItem('flash')}catch(e){}if(f)setTimeout(()=>toast(f),80)}
}
}
})();

/* v16: Esc đóng hộp thoại; ô Action (Edit/View/Delete) dùng được bằng bàn phím */
(()=>{
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){const m=document.querySelector('.mdl');if(m){const b=m.querySelector('[data-mc]');if(b)b.click();else m.remove()}}
  const t=e.target;
  if((e.key==='Enter'||e.key===' ')&&t&&t.matches&&t.matches('td.act,td.act .rm')){e.preventDefault();t.click()}
});
const mark=()=>document.querySelectorAll('td.act,td.act .rm').forEach(x=>{if(!x.hasAttribute('tabindex'))x.tabIndex=0});
new MutationObserver(mark).observe(document.body,{childList:true,subtree:true});mark();
})();

/* v17: khung bảng ở trang cá nhân cao bằng thanh menu bên trái, dữ liệu dài thì cuộn bằng con lăn chuột */
(()=>{
const a=document.getElementById('account');if(!a)return;
const sync=()=>{const sd=a.querySelector('.side');if(sd&&sd.offsetHeight)a.style.setProperty('--side-h',sd.offsetHeight+'px')};
sync();addEventListener('load',sync);addEventListener('resize',sync);
if(window.ResizeObserver){const ro=new ResizeObserver(sync);const sd=a.querySelector('.side');if(sd)ro.observe(sd)}
new MutationObserver(sync).observe(a,{childList:true,subtree:true});
})();
