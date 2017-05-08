/**
 * Created by dupengfei on 2017/2/1.
 */
let express = require('express');
let route = express.Router();
let wxSdk = require('../utils/wxApi');
let wxconfig = require('../config');
let tools = require('../utils/tools');

// 这里是第一步，在公众号设置里面填写 url 验证的地方。
route.get(wxconfig.WXinfo.url_check, (req,res,next)=>{
    let r = req.query;
    let result = wxSdk.checkUrl(r);
    res.send(result);
});

// 第二步， 生产菜单
route.get(wxconfig.WXinfo.url_menus, (req,res,next)=>{
    wxSdk.button_menu((r)=>{
        res.send(r);
    });
});

// 第三步骤： gzh接受到用户消息后， 推送到这个url地址+6
route.get(wxconfig.WXinfo.url_message, (req,res,next)=>{
    let q = req.query;
    console.log(q);
});

// OAuth for openids
route.get('/gzh/OAuth',(req,res,next)=>{
    let url = wxSdk.OAuth();
    // res.send({r:url});
    res.redirect(url);
});

// 第四步： 支付功能,获得预支付id， 同时out_trade_no也需要定下来，这里写入数据库
route.get(wxconfig.WXinfo.url_order, (req,res,next)=>{
    let q ={
        body: req.query.body,
        detail: req.query.detail,
        fee: req.query.fee,
        ip: req.connection.remoteAddress,
        openid: req.query.openid,
        to: req.query.to,
    };
    console.log('order',q);
    wxSdk.getPrepayId(q,(r,order,p)=>{
        console.log('--<order prepay:',order);
        res.send({r:1,d:order});
    });
});
// 第五步： 支付成功回调
route.post('/zhishi/payNotify',(req,res,next)=>{
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk) {
        req.rawBody += chunk;
    });
    req.on('end', function() {
        tools.xml2json(req.rawBody,(json)=>{
            json = tools.xml2jsonIssue(json);
            console.log('pay-notify-------->:',json);
            tools.payNotify(json);
            if( json.result_code.indexOf('SUCCESS') >= 0 ){
                let a = '<xml><return_code><![CDATA[SUCCESS]]></return_code> <return_msg><![CDATA[OK]]></return_msg> </xml>';
                res.send(a);
            }else{
                res.send('');
            }
        });
    });
    
    // {   appid: [ 'wx676736eb70168159' ],
    //     bank_type: [ 'CFT' ],
    //     cash_fee: [ '1' ],
    //     fee_type: [ 'CNY' ],
    //     is_subscribe: [ 'Y' ],
    //     mch_id: [ '1430631302' ],
    //     nonce_str: [ '5qmvr1rzqft44ymgssn8w7b9' ],
    //     openid: [ 'o7sCIw0SefC9GVfD1ybowCBMuV60' ],
    //     out_trade_no: [ '1487141504084' ],
    //     result_code: [ 'SUCCESS' ],
    //     return_code: [ 'SUCCESS' ],
    //     sign: [ '27A497B17FE7A79C5AFD3B9093541D59' ],
    //     time_end: [ '20170215145152' ],
    //     total_fee: [ '1' ],
    //     trade_type: [ 'JSAPI' ],
    //     transaction_id: [ '4001422001201702150028594720' ]
    // }
});

// 第六部： 获得jsapi_ticket for config
route.get('/jsapi_ticket',(req,res,next)=>{
    let q = req.query;
    let url = q.host+q.path+q.search+'&state='+q.state;
    // console.log(url);
    let sended = false;
    wxSdk.config_sign(url,(d)=>{
        // console.log('wx config ticket: ',d);
        // 这里会有请求超时，从而无法使用res， 造成服务崩溃，如何解决？
        // console.log(req.timeout);
        // if (!req.timeout)
        if( !sended){
            res.send(d);
            sended = true;
            console.log('send:',q,url);
        }else{
            console.log('send have happened:',q,url);
        }
        // else{
        //     console.log('time out!');
        //     res.send({r:0});
        // }
    });
});

module.exports = route;
