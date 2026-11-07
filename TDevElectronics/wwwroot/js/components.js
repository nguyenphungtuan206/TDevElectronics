/* Component dùng chung: thanh trên cùng của trang admin (trước đây lặp 6 lần trong index.html) */
(function(){
var UR="<span class=\"ur\"><button class=\"ib2 tt\" type=\"button\" aria-label=\"Switch light / dark theme\" title=\"Light / dark\"><svg class=\"moon\" viewBox=\"0 0 24 24\"><path d=\"M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z\"/></svg><svg class=\"sun\" viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"4\"/><path d=\"M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4\"/></svg></button><button class=\"ib2 bell\" type=\"button\" aria-label=\"Notifications\" aria-haspopup=\"true\" aria-expanded=\"false\"><svg class=\"i \"><use href=\"#i-bell\"/></svg><em></em></button><span class=\"av sm2\">JL</span> Jamie Lee</span>";
document.querySelectorAll(".atop[data-t]").forEach(function(e){e.innerHTML="<span>"+e.getAttribute("data-t")+"</span>"+UR});
})();
