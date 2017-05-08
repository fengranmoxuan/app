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
                    // ��ȡ��Ϣ
                    // window.ds.auth();

                },
                error: function(xhr, type){
                    alert('Ajax error!')
                }
            })
    },

    checkWXApi: function () {
        wx.checkJsApi({
            jsApiList: ['chooseWXPay'], // ��Ҫ����JS�ӿ��б�����JS�ӿ��б����¼2,
            success: function(res) {
                console.log(res)
                // �Լ�ֵ�Ե���ʽ���أ����õ�apiֵtrue��������Ϊfalse
                // �磺{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
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
					timestamp: order.timeStamp, // ֧��ǩ��ʱ�����ע��΢��jssdk�е�����ʹ��timestamp�ֶξ�ΪСд�� // �����°��֧����̨����ǩ��ʹ�õ�timeStamp�ֶ������д���е�S�ַ�
					nonceStr: order.nonceStr, // ֧��ǩ��������������� 32 λ
					package: order.package, // ͳһ֧���ӿڷ��ص�prepay_id����ֵ���ύ��ʽ�磺prepay_id=***��
					signType:'MD5', // ǩ����ʽ��Ĭ��Ϊ'SHA1'��ʹ���°�֧���贫��'MD5'
					paySign: order.paySign, // ֧��ǩ��
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
        //        timestamp: order.timeStamp, // ֧��ǩ��ʱ�����ע��΢��jssdk�е�����ʹ��timestamp�ֶξ�ΪСд�� // �����°��֧����̨����ǩ��ʹ�õ�timeStamp�ֶ������д���е�S�ַ�
        //        nonceStr: order.nonceStr, // ֧��ǩ��������������� 32 λ
        //        package: order.package, // ͳһ֧���ӿڷ��ص�prepay_id����ֵ���ύ��ʽ�磺prepay_id=***��
        //        signType: order.signType, // ǩ����ʽ��Ĭ��Ϊ'SHA1'��ʹ���°�֧���贫��'MD5'
        //        paySign: order.paySign, // ֧��ǩ��
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
                title: title, // �������
                desc: desc, // ��������
                link: window.location.href, // ��������
                imgUrl: image, // ����ͼ��
                type: '', // ��������,music��video��link������Ĭ��Ϊlink
                dataUrl: '', // ���type��music��video����Ҫ�ṩ�������ӣ�Ĭ��Ϊ��
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

    // // implode ƴ�� a=b&c=d, ����ƴ��
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