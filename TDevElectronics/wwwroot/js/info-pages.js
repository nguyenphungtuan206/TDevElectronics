/* About / Support: open-now badge + highlight today's opening hours (Vietnam time) */
(function(){'use strict';
var b=document.getElementById('sp-open');if(!b)return;
var d,h,m;try{var p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Ho_Chi_Minh',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date()),o={};p.forEach(function(x){o[x.type]=x.value});
d={Sun:0,Mon:1,Tue:2,Wed:3,Thu:4,Fri:5,Sat:6}[o.weekday];h=+o.hour%24;m=+o.minute}catch(e){return}
var t=h*60+m,open=d>=1&&d<=5&&t>=540&&t<1080;
b.classList.toggle('on',open);b.querySelector('b').textContent=open?'Open now':'Closed now';
var li=document.querySelector('.sp-hours li[data-d="'+d+'"]');if(li)li.classList.add('today');
})();
