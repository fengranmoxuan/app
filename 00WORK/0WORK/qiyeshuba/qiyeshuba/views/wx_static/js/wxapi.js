/**
 * Created by Administrator on 2017/4/24.
 */
/**
 * Created by dupengfei on 2017/2/2.
 */
//
// import weixin  from 'weixin-js-sdk';
//
// var tools = require('./wxconfig');
//

// const nonceStr = Math.random().toString(30);
// const timestamp = Date.now().toString().toLowerCase();
var wxapi = {
    config: function () {
            var url ="https://app.bzby365.com:8010/a/pub_num/createPayBill?openid='oiRRFw8XxXgLi4oiSiGgHTkr1pbY'&price=1& boy='123'";
            $.ajax({
                type: 'POST',
                url: 'https://app.bzby365.com:8010/a/pub_num/createPayBill',
                data: {openid:'oiRRFw8XxXgLi4oiSiGgHTkr1pbY',price:1,boy:"123"},
                dataType: 'json',
                timeout: 300,
                context: $('body'),
                success: function(json){
                    console.log(json)

                    wx.config({
                        debug: false,
                        appId: json.APPID,
                        timestamp: json.timestamp,
                        nonceStr: json.noncestr,
                        signature: json.sign,
                        //debug: false,
                        //appId: json.APPID,
                        //timestamp: json.timestamp,
                        //nonceStr: json.noncestr,
                        //signature: json.sign,
                        jsApiList: [
                            'checkJsApi',
                            'onMenuShareTimeline',
                            'onMenuShareAppMessage',
                            'onMenuShareQQ',
                            'onMenuShareWeibo',
                            'hideMenuItems',
                            'showMenuItems',
                            'hideAllNonBaseMenuItem',
                            'showAllNonBaseMenuItem',
                            'translateVoice',
                            'startRecord',
                            'stopRecord',
                            'onRecordEnd',
                            'playVoice',
                            'pauseVoice',
                            'stopVoice',
                            'uploadVoice',
                            'downloadVoice',
                            'chooseImage',
                            'previewImage',
                            'uploadImage',
                            'downloadImage',
                            'getNetworkType',
                            'openLocation',
                            'getLocation',
                            'hideOptionMenu',
                            'showOptionMenu',
                            'closeWindow',
                            'scanQRCode',
                            'chooseWXPay', // for pay
                            'openProductSpecificView',
                            'addCard',
                            'chooseCard',
                            'openCard'
                        ],
                    });
                    // 获取信息
                    // window.ds.auth();

                },
                error: function(xhr, type){
                    alert('Ajax error!')
                }
            })
    },

    checkWXApi: function () {
        wx.checkJsApi({
            jsApiList: ['chooseWXPay'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
            success: function(res) {
                console.log(res)
                // 以键值对的形式返回，可用的api值true，不可用为false
                // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
                // alert('chooseWXPay ok');
            }
        });
    },


    invokePay: function (p,cb) {
        // var {body, detail, fee,to} = p;
        var body = p.body, detail=p.detail, price=p.price;
        this.checkWXApi();
        var id = document.getElementById('openopen');
        //var openid = id.innerText;
        var openid = 'oiRRFw8XxXgLi4oiSiGgHTkr1pbY';
        console.log('openid',openid);

        //var url = this.urlEncode('https://app.bzby365.com:8010/a/pub_num/createPayBill',{body:body,price:price,detail:detail,openid:openid});



        $.ajax({
			type: 'POST',
			url: 'https://app.bzby365.com:8010/a/pub_num/createPayBill',
			data: {openid:'oiRRFw8XxXgLi4oiSiGgHTkr1pbY',price:1,boy:"123"},
			dataType: 'json',
			timeout: 300,
			context: $('body'),
			success: function(data){
				console.log(data)
             var order=data;
				var pay ={
					appId:order.appId,
					timestamp: order.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。 // 但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
					nonceStr: order.nonceStr, // 支付签名随机串，不长于 32 位
					package: order.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
					signType:'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
					paySign: order.paySign, // 支付签名
					success: function (res) {
						console.log(res)
						cb({r:1,d:res});
						// alert('pay success'+fee);
					},
					fail: function (res) {
						alert(JSON.stringify(res));
						cb({r:0});
					},
				};
				// wx.chooseWXPay(pay);
				wx.ready(function () {
					wx.chooseWXPay(pay);
				});
//				this.append(data.project.html)
			},
			error: function(xhr, type){
				alert('Ajax error!')
			}
		})


        //fetch(url).then(function(r)  {
        //    console.log(r)
        //    return r.json();
        //    // return  JSON.parse(r);
        //}).then(function(json){
        //    var order = json.d;
        //    // alert(JSON.stringify(order));
        //    var pay ={
        //        appId:order.appId,
        //        timestamp: order.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。 // 但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
        //        nonceStr: order.nonceStr, // 支付签名随机串，不长于 32 位
        //        package: order.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
        //        signType: order.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
        //        paySign: order.paySign, // 支付签名
        //        success: function (res) {
        //            cb({r:1,d:res});
        //            // alert('pay success'+fee);
        //        },
        //        fail: function (res) {
        //            alert(JSON.stringify(res));
        //            cb({r:0});
        //        },
        //    };
        //    // wx.chooseWXPay(pay);
        //    wx.ready(function () {
        //        wx.chooseWXPay(pay);
        //    });
        //});




    },

    invokeShare: function (title,image,desc,type,dataUrl) {
        wx.ready(function () {
            alert('invoke share');
            wx.onMenuShareTimeline({
                title: title,
                imgUrl:image,
                link: window.location.href,
                success:function(){

                },
                cancel: function () {

                }
            });
            wx.onMenuShareAppMessage({
                title: title, // 分享标题
                desc: desc, // 分享描述
                link: window.location.href, // 分享链接
                imgUrl: image, // 分享图标
                type: '', // 分享类型,music、video或link，不填默认为link
                dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
            });
        });
        alert('not ready');
    },

    // sign: function (payParam) {
    //     var str = this.implode(payParam, '&');
    //     var md5 = crypto.createHash('md5');
    //     md5.update(str);
    //     str = md5.digest('hex').toUpperCase();
    //     return str;
    // },


    configUrl: function () {
        var host = window.location.hostname;
        var port = window.location.port;
        var path = window.location.pathname;
        var search = window.location.search;
        var param = '/wx/jsapi_ticket?'+'host=http://' + host+'&port='+port+ '&path='+path+'&search='+ search;
        if( port == undefined || port == ''){
            return 'http://'+host+param;
        }
        if ( host.substr(-1) == '/' ) host = host.substr(0,host.length-1);
        // var hostname = host + ':'+ port;
        return 'http://'+host+param;
    },

    urlEncode: function (path,param) {
        var host = 'http://'+window.location.hostname + '/wx'+path;
        var str = this.implode(param,'&');
        return host+'?'+str;
    },

    // // implode 拼接 a=b&c=d, 排序拼接
    implode: function (dic, span) {
        span = span === undefined ? '' : span;
        var str = '';
        var keys = Object.keys(dic).sort();
        keys.forEach(function(v)  {
            var s = [v, dic[v]].join('=');
            str = str == '' ? s : [str, s].join(span);
        });
        return str;
    },
};


window.wxapi = wxapi;