/**
 * Created by Administrator on 2017/4/5.
 */

var fn={
    fillExam:function(q){
        console.log(q);
        for(var i=0;i<q.length;i++){
            var str2='';
            if (q[i] == "_") {
                str2 += "<input type='text' readonly='readonly' onkeypress='javascript:return false' style='word-break:break-all'>"
            } else {
                str2 += q[i]
            }
            console.log(str2)
            return str2
        }

    }

}
$(function () {
    var allText = sessionStorage.this_exam;
    console.log(allText)
    var allTexts = JSON.parse(allText);
    console.log(allTexts)
    var $id = allTexts[0]._id;
    console.log($id)
    var params = {
        id: $id
    };
    $.ajax({
        url:"http://s2.zhishi.asia:3001/exams/paperItems",
        method:"GET",
        data:params,
        dataType:'json',
        success:function(data) {
            console.log(data)
            if (data.r == 1) {
                window.text = data.d.items;
                $.each(window.text, function (index,data) {
                    console.log(data);
                    //单词
                    if (data.t == "dictationExams") {
                        var dicLi= "<div class='types' data-type='"+ index + "'>" +
                            "<div class='text_one swiper-slide'>" +
                            "<p>" + data.t+ "题" + "</p>" +
                            "</div>"+
                            "<div class='second'>"
                        $.each(data.exams, function (index, item) {
                            var $question=item.q;
                            $.each($question,function(idx,itemIn){
                                var times=idx+1;
                                var strQu =fn.fillExam(itemIn.q);
                                console.log(strQu)
                                dicLi+= "<div  class='anyType' data-index='" + idx + "'>" +
                                    "<div class='text_one swiper-slide'>" +
                                    "<p>" + "第" + times + "题" + "</p>" +
                                    "<div class='ti'>" + strQu + "</div>" +
                                    "</div>" +
                                    "</div>";
                            })
                        });
                        dicLi+="</div></div>";
                        console.log("组合提前加");
                        console.log(dicLi);
                        $(".text_type").append(dicLi);
                    }
                //    句子
                if (data.t == "dPExams") {
                    $(".text_type").append(
                        "<div class='types' data-type='"+ index + "'>" +
                        "<div class='text_one swiper-slide'>" +
                        "<p>" + data.t+ "题" + "</p>" +
                        "</div>"+
                        "<div class='third '></div>"+
                        "</div>"
                    )
                    $.each(data.exams, function (index, item) {
                          var dp=item.e;
                        $.each(dp, function (index, item) {
                            //console.log(item);
                            var times=index+1;
                            $(".third").append(
                                "<div class='anyType' data-index='" + index + "'>" +
                                "<div class='text_one swiper-slide'>" +
                                "<p>" + "第" + times + "题" + "</p>" +
                                "<div class='ti'>" + item.q + "</div>" +
                                "</div>"
                            )
                        })
                        var times=index+1;
                        $(".third").append(
                            "<div class='anyType' data-index='" + index + "'>" +
                            "<div class='text_one swiper-slide'>" +
                            "<p>" + "第" + times + "题" + "</p>" +
                            "<div class='ti'>" + item.q + "</div>" +
                            "</div>"
                        )
                    })
                 }
                    //选择
                   if (data.t == "dCExams") {
                        $(".text_type").append(
                            "<div class='types' data-type='" + index + "'>" +
                            "<div class='text_one swiper-slide'>" +
                            "<p>" + data.t+ "题" + "</p>" +
                            "</div>"+
                            "<div class='four'></div>"+
                            "</div>"
                        )
                        $.each(data.exams, function (i, item) {
                            $check = item.e;
                            $.each($check, function (index, d) {
                                var counts=index+1;
                                var oHtml = "<div class='outer  swiper-slide anyType' data-index='" + index + "'>" +
                                    "<div class='inter'>" +
                                    "<div class='text_chose' >" + "<span>" + counts+'、'+ "</span>" + + "<div>" + d.q + "</div>" + "</div>" +
                                    "<div class='chose' >";
                                $.each(d.chooses, function (index, data) {
                                    oHtml += "<div class='chose_answer'>" + "<span>" + data.i + "</span>" + "<p>" + data.b + "</p>" + "</div>";
                                });
                                oHtml +=
                                    "</div>" +
                                    "</div>"

                                $(".four").append(oHtml);
                            });
                        });
                        $(".chose .chose_answer ").click(function () {
                            //var dataCell = $(this).parent().parent().parent().attr('data-cell-index');
                            //var outIndex = $(this).parent().parent().attr('data-index');
                            //
                            $(this).addClass("chose_border").siblings().removeClass("chose_border");
                            $(this).children('span').addClass("chose_bg");
                            $(this).siblings().children('span').removeClass("chose_bg");
                        });
                    }
                })
            }

            m=$('.swiper-slide').length*screen.width;
            $('#slider').css({'width':m+'px'});
            var left=0;
            $('#slider').bind('swipeleft',function(){
                if(left<m-screen.width){
                    left +=screen.width;
                    $(this).css({"marginLeft":-left+"px"});
                }
            });
            $('#slider').bind('swiperight',function(){
                if(left>0){
                    left-=screen.width;
                    $(this).css({"marginLeft":-left+"px"});
                }
            });
            //$('.anyType').bind('click',function(){
            //    var sums=$('.anyType').length;
            //  console.log(sums);
            //    var intIndex=$(this).attr('data-index');
            //    var outIndex=$(this).parent().parent().attr('data-type');
            //    var $audio=window.text[outIndex].exams[intIndex].path;
            //    console.log($audio)
            //    console.log( window.text)
            //    console.log( window.text[outIndex].exams[intIndex])
            //    console.log('外层'+outIndex+"内层"+intIndex)
            //
            //})
            //$('.audio').bind('click',function(){
            //
            //})

        }
    });
    $("#button").on("click", function () {
        $(".danchuang").css('display', 'block');
        document.body.style.overflow = 'hidden';
        $(".danchuang").on("click", ".tanchuang .queren", function () {
            document.body.style.overflow = 'auto';
            $(".danchuang").css('display', 'none');
        });
    });

});
//var $ti = $('.ti').html();
//var str2 = "";
//$.each($ti, function (index, data) {
//    if (data == "_") {
//        str2 += "<input type='text' readonly='readonly' onkeypress='javascript:return false' style='word-break:break-all'>"
//    } else {
//        str2 += data
//    }
//});
//$('.ti').html(str2);
//$('.ti').bind("click", function () {
//    $("#footer").css("display", "block");
//});
//var key = {};
//var k = "";
//$(".ti input").bind("click", function () {
//    k = $(this).index();
//    var sttrr = 'index' + k;
//    if (!key[sttrr]) {
//        key[sttrr] = '';
//    } else {
//        console.log(key[sttrr])
//    }
//});
//$(".ziMu input").bind("click", function () {
//    var sttrr = 'index' + k;
//    console.log(key[sttrr]);
//    var v = $(this).val();
//    $(".ti input")[k].value += v;
//    if ($(".ti input")[k].value.length !== 0) {
//        var text_length = $(".ti input")[k].value.length;//获取当前文本框的长度
//        console.log(text_length)
//        var current_width = parseInt(text_length) * 0.28;//该16是改变前的宽度除以当前字符串的长度,算出每个字符的长度
//        console.log(current_width)
//        $(".ti input").eq(k).css("width", current_width + "rem");
//    }
//});
//$("#delete").bind("click", function () {
//    var sttrr = 'index' + k;
//    key[sttrr] = key[sttrr].substring(0, key[sttrr].length - 1);
//    $(".ti input")[k].value = $(".ti input")[k].value.substring(0, $(".ti input")[k].value.length - 1);
//});
//$("#free").bind("click", function () {
//    $(".ti input")[k].value = $(".ti input")[k].value + " ";
//});



