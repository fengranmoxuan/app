/**
 * Created by jishubu on 17/1/27.
 */

let wxTools = require('./tools');
let request = require('request');
let config = require('../config');
const WXInfo = config.WXinfo;

module.exports = {
    // 第一步： 验证 基本设置里的url  get
    checkUrl: function (r) {
        console.log(r);
        let sign = [WXInfo.TOKEN, r.timestamp, r.nonce].sort();
        sign = wxTools.sha1(sign.join(''));
        if (sign == r.signature) {
            return r.echostr;
        }
        return 'error';
    },
// 第二步： 获取access_token, 在 wxTools
// 第三步： 更改公众号的底部菜单。
    button_menu: function (cb) {
        wxTools.get_access_token(function (token) {
            let url = 'https://api.weixin.qq.com/cgi-bin/menu/create?access_token='+token;
            request.post({
                url:url,
                form:JSON.stringify(WXInfo.menus)
            },function (e,r,b) {
                if( r.statusCode == 200 ){
                    let a = {r:r,m:WXInfo.menus};
                    cb(a);
                }
            });
        });
    },
    
// 第四步、 从同一接口，获取prepay_id
    getPrepayId: function (p,cb) {
        let url_unify = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
        let prepare_id_param = {
            openid:p.openid,
            appid: WXInfo.APPID,
            mch_id: WXInfo.mch_id,
            notify_url: WXInfo.pay_notify_url,
            trade_type: 'JSAPI',    //：JSAPI，NATIVE，APP
            nonce_str: wxTools.noncestr(),
            out_trade_no: wxTools.get_out_trade_no(),
            body: p.body,
            detail: {},//{}, //p.detail
            total_fee: 1,//parseFloat(p.fee),  //,*100
            spbill_create_ip: '192.168.1.1',//p.ip,
            // p.ip,
        };
        prepare_id_param['sign'] = wxTools.pay_sign(prepare_id_param);
        request.post(
            {
                url: url_unify,// method:'POST',
                body: wxTools.json2xml_self(prepare_id_param),
            },
            (err,res,xml)=>{
                console.log(prepare_id_param);
            if( res.statusCode == 200){
                wxTools.xml2json(xml,(r)=>{
                    if( r == null ){
                        return;
                    }
                    if (r.return_code.indexOf('FAIL')>=0 ){
                        console.log('failed===>: ',r);
                    }else{
                        console.log(r);
                        //  这里是为 前端调起支付窗口用的。
                        let order ={
                            appId: WXInfo.APPID,
                            nonceStr:r.nonce_str[0],
                            package: 'prepay_id='+ r.prepay_id[0],
                            timeStamp: wxTools.timestamp(),
                            signType:'MD5',
                        };
                        order['paySign'] = wxTools.pay_sign(order);
                        cb(r,order,prepare_id_param);
                        
                        // send to data server
                        // let json = wxTools.xml2jsonIssue(r);
                        let json = {};
                        json = wxTools.jsonJoin(prepare_id_param,json);
                        // json = wxTools.jsonJoin(r,json);
                        json = wxTools.jsonJoin(order,json);
                        let a = {};
                        a['prepay'] = json;
                        a['out_trade_no'] = prepare_id_param['out_trade_no'];
                        // a['to'] = p.to;
                        console.log('ttttttt:',a);
                        wxTools.prepay(a);
                    }
                });
            }
        });
    },

    // 第六步、 支付回调
    pay_notify: function (r,cb) {
        let reply = {
            return_code: "FAIL",
            return_msg: "FAIL"
        };
        if (r.return_code == "SUCCESS") {
            reply = {
                return_code: "SUCCESS",
                return_msg: "OK"
            };
        }
        cb(reply);
    },

    // 第七步： 生成签名， 为前段config服务
    config_sign: function (url,cb) {
        let a = {
            noncestr: wxTools.noncestr(),
            timestamp: wxTools.timestamp(),
            url: url
        };
        wxTools.get_access_token((token)=>{
            // console.log(token);
            wxTools.jsapi_ticket(token,(r)=>{
                a['jsapi_ticket'] = r.ticket;
                a['sign'] = wxTools.wx_sign_sh1(a);
                a['APPID'] = WXInfo.APPID;
                cb(a);
            });
        });
    },

    // 第八步： 获取所有的用户的openids
    // {"total":2,"count":2,"data":{"openid":["","OPENID1","OPENID2"]},"next_openid":"NEXT_OPENID"}
    userOpenIds: function () {
        //https://api.weixin.qq.com/cgi-bin/user/get?access_token=ACCESS_TOKEN&next_openid=NEXT_OPENID
        wxTools.get_access_token((token)=>{
            let url = 'https://api.weixin.qq.com/cgi-bin/user/get?access_token='+token;
            request.get(url,(e,r,b)=>{
                if( r.statusCode == 200 ){
                    // console.log(b);
                }
            });
        });
    },
    // 第九步： 根据openid，获取个人的基本信息。
    userInfoByOpenId: function (openId) {
        wxTools.get_access_token((token)=>{
            let url = 'https://api.weixin.qq.com/cgi-bin/user/info?access_token='+token+'&openid='+openId+'&lang=zh_CN';
            request.get(url,(e,r,b)=>{
                // console.log(b);
            });
        });
    },

    // 第十步： 当用户关注的时候， 微信把这个事件推送到这里，同时，应该发送一个消息给用户
    pushAttention: function (e) {
    
    },
    
    // 第十一步： 登录认证，获取用户的openid, 注意这里有跳转, 可以是相同页面，刷新oauth之后，再显示：
    OAuth: function (redirect,s) {
        let url = "https://open.weixin.qq.com/connect/oauth2/authorize?";
        let p = {
            appid: WXInfo.APPID,
            redirect_uri:WXInfo.host + redirect,  //refreshToken
            response_type: 'code',
            scope: 'snsapi_base',
            state: s+'#wechat_redirect',
        };
        url += wxTools.implode(p,'&');
        return url;
    },
    // oauth 可以用来登录，使用用户的openid来登录，也可以用来支付，也就是用户必须先登录才能支付。
    OAuthOpenID: function (code,state,cb) {
        let url = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+ WXInfo.APPID+
            '&secret='+WXInfo.APPSECRET+ '&code='+code+'&grant_type=authorization_code';
        request.get(url,(e,r,b)=>{
            let d = JSON.parse(b);
            //使用这个token，可以得到openid，下次还需要刷新吗？
            global.access_token_openid = b.access_token;
            //console.log(d);
            cb(d);
        });
    },
    
};

