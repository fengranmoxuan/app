/**
 * Created by dupengfei on 2017/2/1.
 */

const DATASERVER = 'http://s2.zhishi.asia:3001';
const WXInfo = {
    // 1.  Base information
    TOKEN: 'yhu08pzrdtgalagd3892gcapyzbjvl03',
    APPID: 'wxa8e3bb1fa34af929',
    APPSECRET: '0ed3e312b0a2f377d1be8a0e15a6e9cb',
    mch_id: '1286682601',
    key: '3BZbFEMNYHhuKg4E9nClkk4SB4SDE94y',
    
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
                name: "借书",
                type: "view",
                url: "http://wx.bzby365.com/borrow/index"
            },
            {
                name: "还书",
                type: "view",
                url:"http://wx.bzby365.com/return/index",
            },{
                name: "个人中心",
                type: "view",
                url:"http://wx.bzby365.com/user/index"
            }
        ]
    },
    
    // setting
    host: 'http://wx.bzby365.com/',
    pay_notify_url: 'http://wx.bzby365.com/wx/payNotify',
    
    // 4、 这里对外的url
    //     a/wx/wx_response
    url_check:'/wx/checkUrl',
    url_menus:'/wx/menus',
    url_order: '/order',
    url_notify: '/wx/payNotify',
    url_message: '/wx/pushMessage',
    
    // 5、权限 url
    url_pages: 'http://wx.bzby365.com/races',
    
    ds: DATASERVER,
};


module.exports.WXinfo = WXInfo;
