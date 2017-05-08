/**
 * Created by dupengfei on 2017/2/1.
 * 微信配置需要的说明：
 * 1、token  在开发=--》基本配置--》checkUrl 来验证我们的服务器地址。
 * 2、更改菜单， 主动访问 menu
 * 3、配置授权接口。  公众号设置--》功能设置。
 */



const DATASERVER = 'http://s2.zhishi.asia:3001';
const WXInfo = {
    // 1.  Base information
    TOKEN: 'zhishi_zhixue',
    APPID: 'wxa3b0c0c711bb39dc',
    APPSECRET: '45b27e0b17781bcdd87c568cd0e87642',
    mch_id: '1438676502',
    key: 'zhixuegongzhongzhixuegongzhong88',
    grant_type: 'client_credential',  // get access token.

    // 2.  url information
    hostname: 'https://api.weixin.qq.com',
    port: 80,
    // access token
    access_token_getPath: '/cgi-bin/token',
    access_token_getParam: 'grant_type=client_credential&appid=%s&secret=%s',
    // 生成 菜单
    button_menu_postPath: '/cgi-bin/menu/create',

    // jsapi_ticket_url:'https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=%s&type=jsapi',
    jsapi_ticket_url:'https://api.weixin.qq.com/cgi-bin/ticket/getticket',
    prepay_id_path: 'https://api.mch.weixin.qq.com/pay/unifiedorder',
    // 发送消息给用户
    send_msg: 'https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=ACCESS_TOKEN',
    // asscess_token_get: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=%s&secret=%s',
    // button_menu: 'https://api.weixin.qq.com/?access_token=%s',
    // 3.  paramater information
    // 这是公众号底部的菜单
    menus: {
        button: [{
                name: "知识",
                type: "view",
                sub_button:[
                    {
                        type:"view",
                        name:"线上考试",
                        url: "http://gzh.whatsgroup.com.cn/exam"
                    }, {
                        type:"view",
                        name:"绘本源",
                        url:"http://gzh.whatsgroup.com.cn/wangzhanwei/huiben"
                    },
                    // {
                    //     type:"view",
                    //     name:"地图",
                    //     url:"http://gzh.whatsgroup.com.cn/exam/map"
                    // },
                ]
            }, {
                name: "家庭建设",
                type: "view",
                sub_button:[
                    {
                        type:"view",
                        name:"柒和系统",
                        url:"http://gzh.whatsgroup.com.cn/wangzhanwei"
                    },
                ]
            },{
                name: "知识App",
                type: "view",
                url: "http://gzh.whatsgroup.com.cn/user/download"
            }
        ]
    },
    // setting
    host: 'http://gzh.whatsgroup.com.cn/',
    pay_notify_url: 'http://gzh.whatsgroup.com.cn/wx/zhishi/payNotify',
    
    
    // 4、 这里对外的url
    url_check:'/zhishi/checkUrl',
    url_menus:'/gzh/menus',
    url_order: '/zhishi/order',
    url_notify: '/zhishi/payNotify',
    url_message: '/zhishi/pushMessage',
    
    // 5、权限 url
    url_pages: 'http://gzh.whatsgroup.com.cn/races',
    
    ds: DATASERVER,
};
//
// // get prepare_id parameter
// let prepare_id_param = {
//     appid: WXInfo.APPID,
//     mch_id: WXInfo.mch_id,
//     notify_url: WXInfo.pay_notify_url,
//     trade_type: 'JSAPI',//：JSAPI，NATIVE，APP
//     nonce_str: (Math.random()).toString(),
//     out_trade_no: Date.now(),
//
//     body: '',
//     detail: '',
//     total_fee: 0.1,
//     spbill_create_ip: '',
//
// };

module.exports.WXinfo = WXInfo;
