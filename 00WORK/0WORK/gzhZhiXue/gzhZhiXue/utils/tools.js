/**
 * Created by dupengfei on 2017/2/1.
 */
let crypto = require('crypto');
let util = require('util');
let xmlJS = require('xml2js');
let request = require('request');
let config = require('../config');
const WXInfo = config.WXinfo;

module.exports = {
/////////////////////////////////////////////////////////////////////////////////////////
// tools for check or sign
    pay_sign: function (pay) {
        let str = this.implode(pay, '&');
        str += '&key='+WXInfo.key;
        // console.log(str);
        let md5 = crypto.createHash('md5');
        return md5.update(str).digest('hex').toUpperCase();
    },

    wx_sign: function (payParam) {
        let str = this.implode(payParam, '&');
        let md5 = crypto.createHash('md5');
        md5.update(str);
        str = md5.digest('hex').toUpperCase();
        return str;
    },

    wx_sign_sh1:function (p) {
        let str = this.implode(p, '&');
        // console.log(str);
        let md5 = crypto.createHash('sha1');
        return md5.update(str).digest('hex');//.toUpperCase();
    },
    
    get_access_token: function (cb) {
        let _this = this;
        if (global.access_token !== undefined) {
            console.log('global.access_token:', global.access_token);
            cb(global.access_token);
            return;
        }
        _this.access_token(cb);
        // 7000, 提前几个毫秒访问, 这是非安全性token获取，也就是不能保证 global里的token最新
        setInterval(()=>{_this.access_token(cb)}, 7000 * 1000);
    },
    
// 获得到 access token的值
    access_token: function (cb) {
        let access_url = 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid='+
            WXInfo.APPID+'&secret='+WXInfo.APPSECRET;
        request.get(access_url, function (e,r,b) {
            if( r.statusCode == 200 ){
                let json = JSON.parse(b);
                global.access_token = json.access_token;
                cb(json.access_token);
            }else{
                console.log('request error!');
                cb({});
            }
        });
    },

    // 获得 jsapi_ticket
    jsapi_ticket: function (token,cb) {
        let url = WXInfo.jsapi_ticket_url+'?access_token='+token+'&type=jsapi';
        request.get(url,(e,r,d)=>{
            if( r.statusCode == 200 ){
                // console.log(d);
                d = JSON.parse(d);
                global.jsapi_ticket = d.ticket;
                cb(d);
            }else{
                cb({});
            }
        });
    },

// implode 拼接 a=b&c=d, 排序拼接
    implode: function (dic, span) {
        span = span === undefined ? '' : span;
        let str = '';
        let keys = Object.keys(dic).sort();
        keys.forEach((v) => {
            let s = [v, dic[v]].join('=');
            str = str == '' ? s : [str, s].join(span);
        });
        return str;
    },
//  sha1 加密
    sha1: function (str) {
        let md5sum = crypto.createHash('sha1');
        str = md5sum.update(str, 'utf8').digest('hex');
        // str = md5sum.digest('hex');
        // console.log('==>', str);
        return str;
    },

    MD5: function (str) {
        let md5sum = crypto.createHash('md5');
        return md5sum.update(str, 'utf8').digest('hex');
    },

    xml2json: function(xml, cb){
        (new xmlJS.Parser()).parseString(xml, (e,r)=>{
            e?cb(null):r?cb(r.xml):cb(null);
        });
    },
    xml2jsonIssue:function (json) {
        let j = {};
        Object.keys(json).map((v,i)=>{
            j[v] = json[v][0];
        });
        return j;
    },

    json2xml: function (json) {
        return (new xmlJS.Builder()).buildObject(json);
    },

    json2xml_self: function (json) {
        let keys = Object.keys(json);
        let xml = '<xml>';
        keys.forEach((v)=>{
            xml += ('<'+v+'>' + json[v] +'</'+v+'>');
        });
        xml += '</xml>';
        return xml;
    },

    noncestr: function(){
        return Math.random().toString(36).substr(2,30);
    },

    timestamp:function () {
        let t = parseInt(Date.now() / 1000);
        return t.toString();
    },

    get_out_trade_no: function () {
        let d = Date.now();
        return d.toString();
    },
    
    /////////////////////////////////////////////////////
    postJson: function(url,p,cb){
        request.post(url,{
            // headers: {
            //     // 'Content-Type': 'application/x-www-form-urlencoded'
            //     // 'Content-Type': 'application/json'
            // },
            // body: JSON.stringify(p)
            form: {d:JSON.stringify(p)}
        }, function (e,r,b) {
            r.statusCode == 200?cb({r:1,d:JSON.parse(b)}):cb({r:0});
        });
    },
    getJson: function (url,p,cb) {
        url = [url,this.implode(p,'&')].join('?');
        request.get(url, function (e,r,b) {
            r.statusCode == 200 ? cb({r:1,d:JSON.parse(b)}): cb({r:0});
        });
    },
    
    getXml: function () {
    
    },
    postXml: function () {
    
    },
    
    // slice two json
    jsonJoin: function(json1,json2){
        Object.keys(json1).map((v,i)=>{
            json2[v] = json1[v];
        });
        return json2;
    },
    
    
    ///////////////////////////////////////////////////////////////////////
    // ds\
    auth: function () {
    
    },
    payNotify: function(json){
        let url = WXInfo.ds + '/wx/gzh/s/payNotify';
        // [1,2,3].forEach(()=>{ setInterval(()=>{_this.access_token(cb)}, 7000 * 1000);
            this.postJson(url,json,(d)=>{
                console.log(json.total_fee+'元 notify success!');
            });
        // });
    },
    prepay: function (json) {
        let url = WXInfo.ds + '/wx/gzh/s/prepay';
        this.postJson(url,json,(d)=>{
            console.log(json.prepay.total_fee+'元 prepay success!');
        });
    },
};
