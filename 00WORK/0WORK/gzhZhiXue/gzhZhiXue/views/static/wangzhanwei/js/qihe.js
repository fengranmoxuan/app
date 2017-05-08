/**
 * Created by Administrator on 2017/3/30.
 */



    document.getElementsByTagName("html")[0].style.fontSize=document.documentElement.clientWidth/15+"px";
    var li=document.getElementById('menu').getElementsByTagName('li');
    var tab=document.getElementById('content').children;

    for(var i=0;i<li.length;i++){
        li[i].index = i;
        li[i].onclick=function(){
            for(var i=0;i<li.length;i++){
                li[i].className=" ";
                tab[i].style.display="none";
            };
            this.className = "tabFocus";
            tab[this.index].style.display="block";
        };
    };

/******评论跳转*****/


