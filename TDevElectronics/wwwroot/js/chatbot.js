/* Chatbot TDev — một nút nổi phẳng 2D tối giản (màu theo giao diện site) có mặt ở giao diện khách VÀ giao diện admin.
   - Hai chatbot độc lập: "cust" (trang khách) và "adm" (khu admin, body.adm). Mỗi bot có cài đặt riêng.
   - Admin chỉnh ở Settings → Chatbot (a-set.html): bật/tắt, tên, vị trí, hiệu ứng chuyển động, bong bóng chào, lời chào,
     câu trả lời dự phòng, nút trả lời nhanh, hỏi-đáp tùy chỉnh (từ khóa → câu trả lời), dùng/không dùng đáp án có sẵn, chat thử.
   - Chạy hoàn toàn trên trình duyệt (không cần mạng/AI ngoài): khớp từ khóa (EN + VI, không dấu) + tìm sản phẩm trên trang.
   - Dữ liệu cài đặt: localStorage 'tdev-chatbot'; lịch sử chat: sessionStorage 'tdev-bot-h-<cust|adm>' (mất khi đóng tab).
   - Không hiện trong khung xem trước nhúng (iframe) của Edit pages. Mọi chữ hiển thị đều qua textContent (không chèn HTML). */
(function(){'use strict';
var KEY='tdev-chatbot',body=document.body,BASE=body.classList.contains('adm')?'adm':'cust';
var LANG=(function(){try{var s=localStorage.getItem('tdev-lang');if(s==='en'||s==='vi')return s}catch(e){}return /^vi/i.test(navigator.language||'')?'vi':'en'})();
var L=function(vi,en){return LANG==='vi'?vi:en};
var obj=function(o){return o&&typeof o==='object'&&!Array.isArray(o)?o:{}};
var arr=function(a){return Array.isArray(a)?a:[]};
var str=function(s,n){return typeof s==='string'?s.slice(0,n):''};
var clone=function(o){return JSON.parse(JSON.stringify(o))};
var h=function(tag,cls,txt){var e=document.createElement(tag);if(cls)e.className=cls;if(txt!=null)e.textContent=txt;return e};
var nz=function(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/g,'d').replace(/[^a-z0-9\s-]/g,' ').replace(/\s+/g,' ').trim()};
var okHref=function(u){return typeof u==='string'&&u.length<300&&/^(https?:\/\/[^\s"'<>]+|[\w-]+\.html(#[\w-]+)?(\?[\w=&%.-]*)?)$/i.test(u)};

/* ---------- logo TDev (chữ T trong ô vuông bo góc) ---------- */
var logo=function(inv){return '<svg viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="'+(inv?'#fff':'#3B5BFF')+'"/><path d="M8.5 9h15v3.6h-5.7V24h-3.6V12.6H8.5z" fill="'+(inv?'#2563EB':'#fff')+'"/></svg>'};

/* ---------- cài đặt ---------- */
var DEF={
 cust:{on:true,name:'TDev Assistant',pos:'right',fx3d:true,tip:true,builtin:true,welcome:'',fallback:'',quick:null,faq:[]},
 adm:{on:true,name:'TDev Admin Assistant',pos:'right',fx3d:true,tip:true,builtin:true,welcome:'',fallback:'',quick:null,faq:[]}};
function normK(r,k){r=obj(r);var d=DEF[k];
 return{on:r.on!==false,name:str(r.name,40).trim()||d.name,pos:r.pos==='left'?'left':'right',fx3d:r.fx3d!==false,tip:r.tip!==false,builtin:r.builtin!==false,
  welcome:str(r.welcome,600),fallback:str(r.fallback,400),
  quick:Array.isArray(r.quick)?r.quick.map(function(s){return str(s,60).trim()}).filter(Boolean).slice(0,6):null,
  faq:arr(r.faq).map(function(x){x=obj(x);return{k:str(x.k,200).trim(),a:str(x.a,800).trim()}}).filter(function(x){return x.k&&x.a}).slice(0,20)}}
function norm(raw){raw=obj(raw);return{cust:normK(raw.cust,'cust'),adm:normK(raw.adm,'adm')}}
function load(){try{return norm(JSON.parse(localStorage.getItem(KEY)||'{}'))}catch(e){return norm({})}}
function store(c){try{localStorage.setItem(KEY,JSON.stringify(norm(c)));return true}catch(e){return false}}

/* ---------- nội dung có sẵn: [từ khóa (không dấu, cách nhau bằng dấu phẩy), VI, EN, liên kết [[href,VI,EN]]] ---------- */
var SUP=['support.html','Liên hệ hỗ trợ','Contact support'];
var KB={
 cust:[
  ['hello,hi,hey,xin chao,chao,alo,good morning,good afternoon','Xin chào! Mình có thể giúp gì cho bạn hôm nay?','Hello! How can I help you today?'],
  ['thanks,thank you,cam on,thank','Rất vui được giúp bạn! Cần gì thêm cứ hỏi mình nhé.','Happy to help! Just ask if you need anything else.'],
  ['order,orders,track,tracking,status,don hang,theo doi,trang thai,dat hang,where is my','Bạn xem trạng thái đơn hàng ở Tài khoản → Đơn hàng. Đơn chưa giao có thể gửi yêu cầu hủy ngay tại đó.','You can see your order status in My account → Orders. You can also send a cancel request from there.',[['account.html','Tài khoản của tôi','My account']]],
  ['cancel,cancellation,huy don,huy','Để hủy đơn: mở Tài khoản, chọn đơn rồi gửi yêu cầu hủy. Đơn sẽ được hủy sau khi TDev duyệt.','To cancel an order: open My account, choose the order and send a cancel request. It is cancelled once TDev approves it.',[['account.html','Tài khoản của tôi','My account']]],
  ['delivery,shipping,ship,giao hang,van chuyen,free delivery,mien phi','Giao hàng miễn phí cho đơn doanh nghiệp, và toàn bộ đơn hàng được giao cùng một lần.','Delivery is free on business orders, and everything arrives in one coordinated delivery.',[SUP]],
  ['return,returns,refund,exchange,doi tra,hoan tien,tra hang','Hàng chưa sử dụng được đổi trả trong 30 ngày. Hãy liên hệ hỗ trợ kèm mã đơn hàng để được hướng dẫn.','Unused items can be returned within 30 days. Contact support with your order number and we will guide you.',[SUP]],
  ['warranty,guarantee,genuine,authentic,bao hanh,chinh hang','Mọi thiết bị đều chính hãng từ nhà cung cấp ủy quyền và có bảo hành của nhà sản xuất. Có thể mở rộng bảo hành theo yêu cầu.','Every device comes from an authorised supplier and includes the manufacturer warranty. Extended cover is available on request.',[SUP]],
  ['quote,quotes,rfq,bulk,business,team,bao gia,doanh nghiep,so luong,cong ty','Hãy dùng form Yêu cầu báo giá và cho biết nhu cầu; TDev gửi báo giá riêng trong vòng một ngày làm việc. Giá theo số lượng bắt đầu từ 10 thiết bị, tiết kiệm đến 12%.','Use the Request a Quote form and tell us what you need; we send a tailored quote within one business day. Team pricing starts from 10 units, with up to 12% volume savings.',[['rfq.html','Yêu cầu báo giá','Request a quote'],['business-buying.html','Mua cho doanh nghiệp','Business buying']]],
  ['payment,pay,card,paypal,net 30,net30,invoice,thanh toan,hoa don','Khi thanh toán bạn có thể chọn thẻ, PayPal hoặc hóa đơn Net 30 kèm đơn mua hàng (PO). Đơn doanh nghiệp có hóa đơn thuế.','At checkout you can pay by card, PayPal or a Net 30 invoice with a purchase order. Business orders include tax invoices.',[['cart.html','Giỏ hàng','Cart']]],
  ['account,login,log in,sign in,register,sign up,password,dang nhap,dang ky,tai khoan,mat khau','Đăng nhập hoặc tạo tài khoản để xem đơn hàng, báo giá và cài đặt của bạn.','Sign in or create an account to see your orders, quotes and settings.',[['login.html','Đăng nhập','Sign in'],['register.html','Tạo tài khoản','Create account']]],
  ['contact,support,human,agent,phone,email,call,address,hours,open,lien he,ho tro,nhan vien,tu van,dia chi,gio mo cua,dien thoai','Hỗ trợ làm việc Thứ Hai–Thứ Sáu, 9:00–18:00. Email support@tdev.com (phản hồi trong 1 ngày làm việc) hoặc gọi +1 (415) 555-0100. Văn phòng: TP. Vinh, Nghệ An.','Support is open Monday–Friday, 9am–6pm. Email support@tdev.com (we reply within one business day) or call +1 (415) 555-0100. Office: Vinh City, Nghe An, Vietnam.',[SUP]],
  ['category,categories,danh muc,phone,phones,laptop,laptops,audio,printer,printers,furniture,accessories,dien thoai,may in,am thanh,tai nghe,noi that,phu kien','Bạn có thể xem sản phẩm theo danh mục:','You can browse products by category:',[['cat-phones.html','Điện thoại','Phones'],['cat-laptops.html','Laptop','Laptops'],['cat-audio.html','Âm thanh','Audio'],['cat-office-furniture.html','Nội thất văn phòng','Office furniture'],['cat-printers.html','Máy in','Printers'],['cat-accessories.html','Phụ kiện','Accessories']]],
  ['language,currency,vnd,usd,ngon ngu,tien te,tieng viet,english','Bấm EN / VI ở đầu trang để đổi ngôn ngữ: tiếng Việt hiển thị giá theo VND, tiếng Anh hiển thị theo USD.','Use the EN / VI switch at the top of the page: Vietnamese shows prices in VND, English in USD.'],
  ['cart,checkout,buy,purchase,gio hang,mua hang','Thêm sản phẩm vào giỏ rồi thanh toán ở bước Checkout.','Add products to your cart, then pay at Checkout.',[['shop.html','Xem sản phẩm','Browse products'],['cart.html','Giỏ hàng','Cart']]],
  ['help,what can you do,giup,lam duoc gi,huong dan','Mình có thể tìm sản phẩm, hướng dẫn theo dõi/hủy đơn, giải đáp giao hàng, đổi trả, bảo hành, thanh toán và hướng dẫn xin báo giá. Bạn cứ hỏi nhé!','I can find products, explain tracking/cancelling orders, and answer questions about delivery, returns, warranty, payment and quotes. Just ask!']],
 adm:[
  ['hello,hi,hey,xin chao,chao,alo','Xin chào! Bạn cần mình hướng dẫn phần nào của trang quản trị?','Hello! Which part of the admin console can I help you with?'],
  ['thanks,thank you,cam on','Không có gì! Cần gì thêm cứ hỏi mình.','You’re welcome! Ask me anything else.'],
  ['help,what can you do,giup,lam duoc gi,huong dan','Mình hướng dẫn: sản phẩm, danh mục, đơn hàng, báo giá, người dùng & mã mời, xuất PDF/Excel, banner & sản phẩm trang chủ, sửa nội dung trang, bảo trì, tỷ giá và cài đặt chatbot.','I can guide you through products, categories, orders, quotes, users & invite codes, PDF/Excel export, the homepage banner & products, page editing, maintenance mode, the exchange rate and chatbot settings.'],
  ['product,products,add product,san pham,them san pham,stock,ton kho,gia ban','Vào Products → bấm Add product, điền tên, thương hiệu, danh mục, giá và tồn kho. Bấm vào một dòng để sửa hoặc xóa sản phẩm.','Open Products and press Add product: fill in name, brand, category, price and stock. Click a row to edit or delete a product.',[['a-prod.html','Mở Products','Open Products']]],
  ['category,categories,danh muc','Ở Categories bạn thêm, sửa, đổi ảnh hoặc xóa danh mục (phải chuyển hết sản phẩm sang danh mục khác trước khi xóa).','In Categories you can add, edit, change images or delete categories (move its products to another category before deleting).',[['a-cat.html','Mở Categories','Open Categories']]],
  ['order,orders,don hang,status,trang thai,dispatch,giao hang','Ở Orders bạn xem chi tiết đơn, đổi trạng thái (Pending, Processing, Shipped, Delivered, Cancelled) và duyệt hoặc từ chối yêu cầu hủy của khách.','In Orders you can view an order, change its status (Pending, Processing, Shipped, Delivered, Cancelled) and approve or reject customer cancel requests.',[['a-ord.html','Mở Orders','Open Orders']]],
  ['quote,quotes,rfq,bao gia','Ở Quote Requests bạn xem, chỉnh sửa và phản hồi các yêu cầu báo giá của doanh nghiệp.','In Quote Requests you can review, edit and respond to business quote requests.',[['a-quo.html','Mở Quote Requests','Open Quote Requests']]],
  ['user,users,invite,invitation,admin code,nguoi dung,ma moi,moi admin','Ở Users bạn đổi vai trò/trạng thái tài khoản và tạo mã mời để người khác đăng ký quản trị viên.','In Users you can change an account’s role/status and create invite codes so others can sign up as admins.',[['a-usr.html','Mở Users','Open Users']]],
  ['export,pdf,excel,xlsx,bao cao,xuat,download,tai ve','Các trang Products, Categories, Orders, Quotes và Users đều có nút Export PDF và Export Excel (tên cột theo ngôn ngữ đang chọn).','The Products, Categories, Orders, Quotes and Users pages have Export PDF and Export Excel buttons (column names follow the selected language).'],
  ['banner,hero,slider,homepage,trang chu,home products','Vào Settings → Homepage banner để sửa slide ở đầu trang chủ, và Homepage products để chọn sản phẩm nổi bật.','In Settings, use Homepage banner to edit the slider at the top of the homepage and Homepage products to pick featured products.',[['a-set.html','Mở Settings','Open Settings']]],
  ['edit page,edit pages,noi dung,sua trang,about,privacy,terms,text','Settings → Edit pages: chọn trang, bấm vào chữ để sửa, đổi ảnh, thêm khối nội dung rồi bấm Lưu thay đổi.','Settings → Edit pages: choose a page, click text to edit it, change images, add content blocks, then press Save changes.',[['a-set.html#edit-pages','Mở Edit pages','Open Edit pages']]],
  ['maintenance,bao tri,be right back','Settings → Website → bật Maintenance mode để khách thấy trang “be right back”. Quản trị viên vẫn đăng nhập và làm việc bình thường.','Settings → Website → turn on Maintenance mode to show customers a “be right back” page. Admins can still sign in and work.',[['a-set.html','Mở Settings','Open Settings']]],
  ['exchange rate,ty gia,vnd,usd,currency,tien te','Settings → Website → Exchange rate đặt tỷ giá 1 USD = ? VND dùng để hiển thị giá bằng VND.','Settings → Website → Exchange rate sets the 1 USD = ? VND rate used to show prices in VND.',[['a-set.html','Mở Settings','Open Settings']]],
  ['reset,demo data,xoa du lieu','Settings → Demo data → Reset demo data sẽ xóa mọi thứ bạn đã thêm trong trình duyệt này (kể cả cài đặt chatbot).','Settings → Demo data → Reset demo data removes everything you added in this browser (including chatbot settings).',[['a-set.html','Mở Settings','Open Settings']]],
  ['chatbot,bot,tro ly,chat','Settings → Chatbot cho phép chỉnh riêng chatbot của khách và chatbot của admin: bật/tắt, tên, vị trí, hiệu ứng chuyển động, lời chào, nút trả lời nhanh và hỏi-đáp tùy chỉnh.','Settings → Chatbot lets you configure the customer chatbot and the admin chatbot separately: on/off, name, position, motion effects, greeting, quick replies and custom Q&A.',[['a-set.html#chatbot-settings','Mở cài đặt Chatbot','Open Chatbot settings']]],
  ['dashboard,tong quan,thong ke,revenue,doanh thu','Dashboard tóm tắt doanh thu, đơn hàng, báo giá và việc cần xử lý trong ngày.','The Dashboard summarises revenue, orders, quotes and what needs attention today.',[['a-dash.html','Mở Dashboard','Open Dashboard']]]]};
var QUICK={
 cust:[['Theo dõi đơn hàng','Track my order'],['Giao hàng & đổi trả','Delivery & returns'],['Yêu cầu báo giá','Request a quote'],['Bảo hành','Warranty'],['Liên hệ hỗ trợ','Contact support']],
 adm:[['Thêm sản phẩm','Add a product'],['Quản lý đơn hàng','Manage orders'],['Duyệt báo giá','Review quotes'],['Xuất PDF / Excel','Export PDF / Excel'],['Banner & bảo trì','Banner & maintenance']]};
var defQuick=function(k){return QUICK[k].map(function(q){return q[LANG==='vi'?0:1]})};
function defWelcome(k,name){
 if(k==='adm')return L('Xin chào'+(name?' '+name:'')+'! Mình là trợ lý quản trị TDev. Hỏi mình cách thêm sản phẩm, xử lý đơn hàng, duyệt báo giá, xuất file hay chỉnh trang nhé.','Hi'+(name?' '+name:'')+'! I’m the TDev admin assistant. Ask me how to add products, handle orders, review quotes, export data or edit pages.');
 return L('Xin chào'+(name?' '+name:'')+'! Mình là trợ lý TDev. Mình có thể giúp bạn tìm sản phẩm, theo dõi đơn hàng, xin báo giá hoặc giải đáp thắc mắc.','Hi'+(name?' '+name:'')+'! I’m the TDev assistant. I can help you find products, track orders, request a quote or answer questions.')}
function defFallback(k){return k==='adm'
 ?L('Mình chưa hiểu câu hỏi này. Thử hỏi về: sản phẩm, đơn hàng, báo giá, người dùng, xuất file, banner, bảo trì hoặc chatbot.','I’m not sure about that one. Try asking about products, orders, quotes, users, export, the banner, maintenance or the chatbot.')
 :L('Mình chưa chắc về câu hỏi này. Bạn thử hỏi về sản phẩm, đơn hàng, giao hàng, đổi trả, bảo hành hoặc báo giá, hoặc liên hệ đội hỗ trợ nhé.','I’m not sure about that one. Try asking about products, orders, delivery, returns, warranty or quotes, or contact our support team.')}
function defTip(k){return k==='adm'?L('Hỏi mình cách dùng trang quản trị 👋','Ask me how to use the console 👋'):L('Cần mình giúp gì không? 👋','Need a hand? 👋')}

/* ---------- khớp câu hỏi ---------- */
function kwScore(m,kws){var p=' '+m+' ',s=0;kws.forEach(function(k){k=k.trim();if(!k)return;
 if(k.length<=3?p.indexOf(' '+k+' ')>=0:p.indexOf(' '+k)>=0)s+=Math.max(2,k.length)});return s}
var STOP=' the and for with you are can how what where your have has not this that from con cho cua toi ban muon khong nao nhu nay gi la va co mot cac nhung hay xin vui long tim mua xem help need want find show looking price gia cost '.split(' ');
function cards(){var seen={},out=[];document.querySelectorAll('.pc[data-k]').forEach(function(c){var k=c.getAttribute('data-k');if(seen[k])return;seen[k]=1;
 var b=c.querySelector('b'),br=c.querySelector('.br'),pr=c.querySelector('.pr'),sp=c.querySelector('.sp');
 out.push({k:k,n:b?b.textContent.trim():k,b:br?br.textContent.trim():'',p:pr?pr.textContent.trim():'',hay:nz((b?b.textContent:'')+' '+(br?br.textContent:'')),d:nz(sp?sp.textContent:'')})});return out}
function prodSearch(m){var tk=m.split(' ').filter(function(t){return(t.length>=3||/^\d+$/.test(t)&&t.length>=2)&&STOP.indexOf(t)<0});if(!tk.length)return[];
 return cards().map(function(c){var s=0;tk.forEach(function(t){if(c.hay.indexOf(t)>=0)s+=3;else if(c.d.indexOf(t)>=0)s+=1});return{c:c,s:s}})
  .filter(function(x){return x.s>=3}).sort(function(a,b){return b.s-a.s}).slice(0,3).map(function(x){return{k:x.c.k,n:x.c.n,b:x.c.b,p:x.c.p}})}
function answer(text,k){var c=load()[k],m=nz(text),out={t:'',links:[],prods:[]};
 var best=null,bs=0;c.faq.forEach(function(f){var s=kwScore(m,f.k.split(/[,;\n]/).map(nz));if(nz(f.k)===m)s+=50;if(s>bs){bs=s;best=f}});
 if(best){out.t=best.a;return out}
 if(c.builtin){
  var oid=k==='cust'&&String(text).match(/TD-\d+/i);
  if(oid){out.t=L('Mình thấy mã đơn '+oid[0].toUpperCase()+'. Bạn xem trạng thái và chi tiết ở Tài khoản → Đơn hàng nhé.','I see order '+oid[0].toUpperCase()+'. You can check its status and details in My account → Orders.');out.links=[{h:'account.html',l:L('Tài khoản của tôi','My account')}];return out}
  var e=null,es=0;KB[k].forEach(function(x){var s=kwScore(m,x[0].split(','));if(s>es){es=s;e=x}});
  if(e){out.t=e[LANG==='vi'?1:2];out.links=arr(e[3]).map(function(l){return{h:l[0],l:l[LANG==='vi'?1:2]}})}
  if(k==='cust'){out.prods=prodSearch(m);if(out.prods.length&&!out.t)out.t=L('Mình tìm thấy các sản phẩm phù hợp:','Here’s what I found:')}
  if(out.t)return out}
 out.t=c.fallback||defFallback(k);if(k==='cust')out.links=[{h:SUP[0],l:SUP[LANG==='vi'?1:2]}];return out}

/* ---------- widget ---------- */
var EMB=false;try{EMB=window.self!==window.top}catch(e){EMB=true}
var root,panel,msgs,chips,inp,tip,fab,mode=null,testing=false,hist=[],opened=false,booted=false,tipT=0;
var kind=function(){return mode||BASE};
var hkey=function(){return 'tdev-bot-h-'+kind()};
function userName(){try{var u=window.TDEV_ME&&window.TDEV_ME();if(u&&u.name&&u.role!=='admin'||u&&u.name&&kind()==='adm')return String(u.name).trim().split(/\s+/)[0]}catch(e){}return ''}
function persist(){if(testing)return;try{sessionStorage.setItem(hkey(),JSON.stringify(hist.slice(-40)))}catch(e){}}
function restore(){hist=[];if(testing)return;try{arr(JSON.parse(sessionStorage.getItem(hkey())||'[]')).slice(-40).forEach(function(x){x=obj(x);if(x.r!=='u'&&x.r!=='b')return;
 hist.push({r:x.r,t:str(x.t,1500),links:arr(x.links).filter(function(l){return okHref(obj(l).h)}).slice(0,8).map(function(l){return{h:l.h,l:str(l.l,60)}}),
  prods:arr(x.prods).slice(0,3).map(function(p){p=obj(p);return{k:str(p.k,60),n:str(p.n,80),b:str(p.b,40),p:str(p.p,30)}})})})}catch(e){}}
/* [chữ](liên kết) -> thẻ a (chỉ http(s) hoặc trang .html trong site) */
function rich(el,text){var re=/\[([^\]]{1,60})\]\(([^)\s]{1,300})\)/g,i=0,m;text=String(text);
 while((m=re.exec(text))){if(m.index>i)el.appendChild(document.createTextNode(text.slice(i,m.index)));
  if(okHref(m[2])){var a=h('a',null,m[1]);a.href=m[2];if(/^https?:/i.test(m[2])){a.target='_blank';a.rel='noopener noreferrer'}el.appendChild(a)}else el.appendChild(document.createTextNode(m[0]));i=re.lastIndex}
 if(i<text.length)el.appendChild(document.createTextNode(text.slice(i)))}
function render(m,anim){var row=h('div','tdb-r'+(m.r==='u'?' u':''));if(!anim)row.style.animation='none';
 if(m.r==='b'){var av=h('span','tdb-ba');av.innerHTML=logo(false);row.appendChild(av)}
 var b=h('div','tdb-b'),t=h('div','tdb-t');rich(t,m.t);b.appendChild(t);
 if(m.links&&m.links.length){var ls=h('div','tdb-lks');m.links.forEach(function(l){var a=h('a','tdb-lk',l.l+' →');a.href=l.h;ls.appendChild(a)});b.appendChild(ls)}
 (m.prods||[]).forEach(function(p){var a=h('a','tdb-pd');a.href='product.html?k='+encodeURIComponent(p.k);var s=h('span');s.appendChild(h('small',null,p.b));s.appendChild(h('b',null,p.n));a.appendChild(s);a.appendChild(h('em',null,p.p));b.appendChild(a)});
 row.appendChild(b);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;return row}
function push(m,anim){hist.push(m);render(m,anim!==false);persist()}
function welcome(){var c=load()[kind()],w=c.welcome?c.welcome.replace(/\{name\}/g,userName()).replace(/\s+([!,.?])/g,'$1').replace(/ {2,}/g,' ').trim():defWelcome(kind(),userName());push({r:'b',t:w,links:[],prods:[]})}
function paintChips(){chips.textContent='';var c=load()[kind()];(c.quick||defQuick(kind())).forEach(function(q){var b=h('button','tdb-c',q);b.type='button';b.addEventListener('click',function(){send(q)});chips.appendChild(b)})}
function paintAll(){msgs.textContent='';hist.forEach(function(m){render(m,false)});msgs.scrollTop=msgs.scrollHeight}
function send(text){text=String(text||'').trim().slice(0,300);if(!text)return;push({r:'u',t:text,links:[],prods:[]});inp.value='';
 var row=h('div','tdb-r'),av=h('span','tdb-ba'),b=h('div','tdb-b'),d=h('span','tdb-dots');av.innerHTML=logo(false);d.appendChild(h('i'));d.appendChild(h('i'));d.appendChild(h('i'));b.appendChild(d);row.appendChild(av);row.appendChild(b);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;
 var k=kind(),r=answer(text,k);setTimeout(function(){row.remove();if(kind()!==k)return;push({r:'b',t:r.t,links:r.links,prods:r.prods})},450+Math.min(text.length*8,500))}
function apply(){if(!root)return;var k=kind(),c=load()[k];
 root.className='tdb'+(k==='adm'?' adm':'')+(c.pos==='left'?' left':'')+(c.fx3d?'':' flat')+(opened?' open':'');
 root.hidden=!c.on&&!testing;
 root.querySelector('.tdb-n').textContent=c.name;
 root.querySelector('.tdb-st').textContent=testing?L('Chế độ thử','Test mode'):L('Trực tuyến','Online');
 root.querySelector('.tdb-ft').textContent=L('Hỗ trợ bởi TDev','Powered by TDev');
 fab.setAttribute('aria-label',opened?L('Đóng chat','Close chat'):L('Mở chat','Open chat'));
 panel.setAttribute('aria-label',c.name);inp.placeholder=L('Nhập câu hỏi của bạn…','Type your question…');
 [].forEach.call(root.querySelectorAll('[data-a="reset"]'),function(b){b.title=L('Cuộc trò chuyện mới','New conversation')});
 [].forEach.call(root.querySelectorAll('[data-a="close"]'),function(b){b.title=L('Đóng','Close')});
 paintChips()}
function openChat(){if(opened)return;opened=true;if(!booted){booted=true;restore();if(!hist.length)welcome();else paintAll()}
 panel.hidden=false;tip.hidden=true;apply();setTimeout(function(){inp.focus()},120);msgs.scrollTop=msgs.scrollHeight}
function closeChat(){if(!opened)return;opened=false;panel.hidden=true;
 if(testing){testing=false;mode=null;booted=false;hist=[];msgs.textContent=''}
 apply()}
function resetChat(){hist=[];msgs.textContent='';persist();welcome()}
function build(){
 root=h('div','tdb');root.setAttribute('data-notr','');
 root.innerHTML='<div class="tdb-panel" role="dialog" hidden><div class="tdb-h"><span class="tdb-av">'+logo(false)+'</span><span class="tdb-ht"><b class="tdb-n"></b><small><i class="tdb-on"></i><span class="tdb-st"></span></small></span><span class="tdb-hbs"><button type="button" class="tdb-hb" data-a="reset"><svg viewBox="0 0 24 24"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg></button><button type="button" class="tdb-hb" data-a="close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button></span></div><div class="tdb-m" role="log" aria-live="polite"></div><div class="tdb-q"></div><form class="tdb-f" autocomplete="off"><input type="text" class="tdb-i" maxlength="300" aria-label="Message"><button class="tdb-s" type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13"/><path d="M22 2l-7 20-4-9-9-4z"/></svg></button></form><div class="tdb-ft"></div></div>'
  +'<div class="tdb-fw"><div class="tdb-tip" hidden></div><div class="tdb-fl"><button type="button" class="tdb-fab"><span class="tdb-orb"><span class="tdb-logo" aria-hidden="true">TDev</span><span class="tdb-xx"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></span></span><span class="tdb-ring"></span></button></div></div>';
 panel=root.querySelector('.tdb-panel');msgs=root.querySelector('.tdb-m');chips=root.querySelector('.tdb-q');inp=root.querySelector('.tdb-i');tip=root.querySelector('.tdb-tip');fab=root.querySelector('.tdb-fab');
 fab.addEventListener('click',function(){opened?closeChat():openChat()});
 tip.addEventListener('click',openChat);
 root.querySelector('.tdb-f').addEventListener('submit',function(e){e.preventDefault();send(inp.value)});
 root.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;if(b.dataset.a==='close')closeChat();else if(b.dataset.a==='reset')resetChat()});
 root.addEventListener('keydown',function(e){if(e.key==='Escape'&&opened){closeChat();fab.focus()}});
 body.appendChild(root);apply();
 /* bong bóng chào */
 var c=load()[kind()],seen=false;try{seen=!!sessionStorage.getItem('tdev-bot-tip')}catch(e){}
 if(c.tip&&c.on&&!seen)tipT=setTimeout(function(){if(opened||!load()[kind()].tip)return;tip.textContent=defTip(kind());tip.hidden=false;try{sessionStorage.setItem('tdev-bot-tip','1')}catch(e){}setTimeout(function(){tip.hidden=true},9000)},2600)}
document.addEventListener('tdev-lang',function(){LANG=(function(){try{var s=localStorage.getItem('tdev-lang');if(s==='en'||s==='vi')return s}catch(e){}return LANG})();if(root)apply()});
window.addEventListener('storage',function(e){if(e.key===KEY&&root)apply()});
if(!EMB)build();

window.TDevBot={
 refresh:function(){if(root)apply()},
 clear:function(){try{sessionStorage.removeItem('tdev-bot-h-cust');sessionStorage.removeItem('tdev-bot-h-adm')}catch(e){}if(root&&!testing){hist=[];booted=false;msgs.textContent='';if(opened){booted=true;welcome()}}},
 test:function(k){if(!root||(k!=='cust'&&k!=='adm'))return;opened=false;panel.hidden=true;testing=true;mode=k;booted=true;hist=[];msgs.textContent='';opened=true;panel.hidden=false;tip.hidden=true;welcome();apply();setTimeout(function(){inp.focus()},120)}};

/* ================= Admin: Settings → Chatbot ================= */
var ed=document.getElementById('acb');if(!ed)return;
var toast=function(m){var t=document.getElementById('ts');if(!t)return;t.textContent=m;t.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(function(){t.classList.remove('on')},2400)};
var esc=function(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})};
var draft=load(),savedJ=JSON.stringify(draft),tab='cust';
var opt=function(v,t,cur){return '<option value="'+v+'"'+(v===cur?' selected':'')+'>'+t+'</option>'};
function edBuild(){var d=draft[tab],q=d.quick||defQuick(tab);
 var html='<div class="cd sg" id="chatbot-settings"><div class="hx"><div><h3>Chatbot</h3><p class="m">Each chatbot has its own settings: the customer chatbot appears on the storefront, the admin chatbot inside this console. Changes apply after you save.</p></div><span class="tg" id="cb-st"></span></div>'
 +'<div class="cbt" role="tablist"><button type="button" class="ept-b'+(tab==='cust'?' on':'')+'" data-t="cust">Customer chatbot</button><button type="button" class="ept-b'+(tab==='adm'?' on':'')+'" data-t="adm">Admin chatbot</button></div><div class="cbx">'
 +'<label class="ck sw2"><input type="checkbox" data-f="on"'+(d.on?' checked':'')+'><span><b>Show this chatbot</b><br><small class="m">'+(tab==='cust'?'Visitors and customers see the chat button on the storefront.':'Admins see the chat button in the admin console.')+'</small></span></label>'
 +'<div class="cbg"><label class="fld"><small>Chatbot name</small><input type="text" data-f="name" maxlength="40" value="'+esc(d.name)+'"></label>'
 +'<label class="fld"><small>Button position</small><select data-f="pos">'+opt('right','Bottom right',d.pos)+opt('left','Bottom left',d.pos)+'</select></label></div>'
 +'<label class="ck sw2"><input type="checkbox" data-f="fx3d"'+(d.fx3d?' checked':'')+'><span><b>Motion effects</b><br><small class="m">Soft pulse on the chat button and smooth open animation. Turn off for a completely still look.</small></span></label>'
 +'<label class="ck sw2"><input type="checkbox" data-f="tip"'+(d.tip?' checked':'')+'><span><b>Greeting bubble</b><br><small class="m">A small message next to the button a few seconds after the page opens.</small></span></label>'
 +'<label class="ck sw2"><input type="checkbox" data-f="builtin"'+(d.builtin?' checked':'')+'><span><b>Use built-in answers</b><br><small class="m">'+(tab==='cust'?'Delivery, returns, warranty, quotes, payment, account and product search.':'Guides for products, orders, quotes, users, export, banner, maintenance and more.')+' Your own Q&amp;A below always comes first.</small></span></label>'
 +'<label class="fld"><small>Welcome message (leave empty for the default; {name} = first name)</small><textarea data-f="welcome" rows="3" maxlength="600" placeholder="'+esc(defWelcome(tab,''))+'">'+esc(d.welcome)+'</textarea></label>'
 +'<label class="fld"><small>Reply when the chatbot does not know (leave empty for the default)</small><textarea data-f="fallback" rows="2" maxlength="400" placeholder="'+esc(defFallback(tab))+'">'+esc(d.fallback)+'</textarea></label>'
 +'<div class="cbk"><h4>Quick replies</h4><p class="m"><small>Buttons shown above the message box (up to 6).'+(d.quick?'':' The default buttons are shown until you change them.')+'</small></p>';
 q.forEach(function(s,i){html+='<div class="cbr" data-i="'+i+'"><input type="text" data-f="q" maxlength="60" value="'+esc(s)+'" aria-label="Quick reply"><button type="button" class="bo rd" data-a="q-del">Remove</button></div>'});
 html+='<div class="cba"><button type="button" class="bo" data-a="q-add"'+(q.length>=6?' disabled':'')+'>+ Add quick reply</button>'+(d.quick?'<button type="button" class="bo" data-a="q-def">Use default buttons</button>':'')+'</div></div>'
 +'<div class="cbk"><h4>Custom questions &amp; answers</h4><p class="m"><small>When a message contains one of the keywords, the chatbot gives your answer. Separate keywords with commas. In an answer you can add a link like [Open Orders](a-ord.html) (pages of this site or https:// links).</small></p>';
 d.faq.forEach(function(f,i){html+='<div class="cbr cbf" data-n="'+i+'"><div><label class="fld"><small>Keywords (comma-separated)</small><input type="text" data-f="fk" maxlength="200" value="'+esc(f.k)+'"></label><label class="fld"><small>Answer</small><textarea data-f="fa" rows="3" maxlength="800">'+esc(f.a)+'</textarea></label></div><button type="button" class="bo rd" data-a="f-del">Remove</button></div>'});
 html+='<div class="cba"><button type="button" class="bo" data-a="f-add"'+(d.faq.length>=20?' disabled':'')+'>+ Add question &amp; answer</button></div></div></div>'
 +'<div class="cba"><button type="button" class="bt" data-a="save">Save chatbot settings</button><button type="button" class="bo" data-a="test">Try this chatbot</button><button type="button" class="bo" data-a="hist">Clear chat history</button><button type="button" class="bo rd" data-a="reset">Restore defaults for this chatbot</button></div></div>';
 ed.innerHTML=html;status()}
function status(){var st=document.getElementById('cb-st');if(!st)return;var dirty=JSON.stringify(norm(draft))!==savedJ;st.textContent=dirty?'Unsaved changes':'Saved';st.className='tg'+(dirty?' b':'')}
function ensureQ(){var d=draft[tab];if(!d.quick)d.quick=defQuick(tab).slice();return d.quick}
ed.addEventListener('input',function(e){var t=e.target,f=t.dataset&&t.dataset.f;if(!f||t.type==='checkbox'||t.tagName==='SELECT')return;var d=draft[tab];
 if(f==='name')d.name=t.value;else if(f==='welcome')d.welcome=t.value;else if(f==='fallback')d.fallback=t.value;
 else if(f==='q'){ensureQ()[+t.closest('[data-i]').dataset.i]=t.value}
 else if(f==='fk')d.faq[+t.closest('[data-n]').dataset.n].k=t.value;else if(f==='fa')d.faq[+t.closest('[data-n]').dataset.n].a=t.value;
 status()});
ed.addEventListener('change',function(e){var t=e.target,f=t.dataset&&t.dataset.f;if(!f||(t.type!=='checkbox'&&t.tagName!=='SELECT'))return;var d=draft[tab];
 if(f==='pos')d.pos=t.value==='left'?'left':'right';else if(t.type==='checkbox')d[f]=t.checked;status()});
ed.addEventListener('click',function(e){var tb=e.target.closest('[data-t]');if(tb){tab=tb.dataset.t;edBuild();return}
 var b=e.target.closest('[data-a]');if(!b||b.disabled)return;var a=b.dataset.a,d=draft[tab];
 if(a==='q-add'){var q=ensureQ();if(q.length<6){q.push('');edBuild();var ins=ed.querySelectorAll('[data-f="q"]');if(ins.length)ins[ins.length-1].focus()}return}
 if(a==='q-del'){ensureQ().splice(+b.closest('[data-i]').dataset.i,1);edBuild();return}
 if(a==='q-def'){d.quick=null;edBuild();return}
 if(a==='f-add'){if(d.faq.length<20){d.faq.push({k:'',a:''});edBuild();var fk=ed.querySelectorAll('[data-f="fk"]');if(fk.length)fk[fk.length-1].focus()}return}
 if(a==='f-del'){d.faq.splice(+b.closest('[data-n]').dataset.n,1);edBuild();return}
 if(a==='save'){draft=norm(draft);if(!store(draft)){toast('Could not save in this browser.');return}savedJ=JSON.stringify(draft);if(window.TDevBot)TDevBot.refresh();edBuild();toast('Chatbot settings saved');return}
 if(a==='test'){if(JSON.stringify(norm(draft))!==savedJ)toast('Test uses the saved settings. Save first to try your changes.');if(window.TDevBot)TDevBot.test(tab);return}
 if(a==='hist'){if(window.TDevBot)TDevBot.clear();toast('Chat history cleared');return}
 if(a==='reset'){if(!confirm('Restore the default settings of this chatbot?'))return;draft[tab]=normK({},tab);edBuild();toast('Defaults restored. Press Save to apply.')}});
window.addEventListener('beforeunload',function(e){if(JSON.stringify(norm(draft))!==savedJ){e.preventDefault();e.returnValue=''}});
edBuild();
if(location.hash==='#chatbot-settings'){var bx=document.getElementById('chatbot-settings');if(bx)setTimeout(function(){bx.scrollIntoView({block:'start'})},150)}
})();
