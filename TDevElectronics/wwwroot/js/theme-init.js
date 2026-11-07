try{var s=localStorage.getItem("tdev-theme");if(s!=="light"&&s!=="dark")s=matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";document.documentElement.dataset.theme=s}catch(e){}
