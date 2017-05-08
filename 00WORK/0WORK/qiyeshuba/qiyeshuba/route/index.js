/**
 * Created by jishubu on 17/1/27.
 */

let express = require('express');
let route = express.Router();
let wxSdk = require('../utils/wxApi');

function routerUrl(url,path,req,res) {
    let code = req.query.code;
    let s = req.query._id;
    console.log('_id is ?:',s);
    s = s === undefined?'111':s;
    if( code === undefined ){
        let l = wxSdk.OAuth(url,s);
        // console.log('redirect',l);
        return res.redirect(l);
    }else {
        // get oauth
        let state = req.query.state;
        wxSdk.OAuthOpenID(code,state,(r)=>{
            console.log('------->',r.openid,path);
            let openid = 0,m = 0;
            if ( r.openid ) openid = r.openid;
            return res.render(path, {openid:openid,mobile:m});
        });
    }
}

route.get('/', function (req, res) {
    // routerUrl('/',req,res);
    res.send('you are monkey!!');
    // let r = req.query;
    // let result = wxSdk.checkUrl(r);
    // res.send(result);
});

///////////////////////////
route.get('/borrow/index', function (req, res,next) {
    routerUrl('borrow/index','borrow/index.ejs',req,res);
});
route.get('/return/index', function (req, res,next) {
    routerUrl('return/index','return/index.ejs',req,res);
});
route.get('/user/index', function (req, res,next) {
    routerUrl('user/index','user/index.ejs',req,res);
});

// route.get('/wangzhanwei/Vdetail', function (req, res,next) {
//     routerUrl('wangzhanwei/Vdetail','wangzhanwei/Vdetail.ejs',req,res);
// });
// route.get('/wangzhanwei/Adetail', function (req, res,next) {
//     routerUrl('wangzhanwei/Adetail','wangzhanwei/Adetail.ejs',req,res);
// });
// /////////////////////////////////////////////////////////
// route.get('/wangzhanwei/video', function (req, res,next) {
//     routerUrl('wangzhanwei/video','wangzhanwei/video.ejs',req,res);
// });
// route.get('/wangzhanwei/comment', function (req, res,next) {
//     routerUrl('wangzhanwei/comment','wangzhanwei/comment.ejs',req,res);
// });
// route.get('/wangzhanwei/pay', function (req, res,next) {
//     routerUrl('wangzhanwei/pay','wangzhanwei/pay.ejs',req,res);
// });
// route.get('/wangzhanwei', function (req, res,next) {
//     routerUrl('wangzhanwei','wangzhanwei/index.ejs',req,res);
// });

///////////////////////////
//书柜部分
route.get('/exam/map', function (req, res,next) {
    routerUrl('exam/map','exam/map.ejs',req,res);
});
//书柜部分结束

/////////////////////////////////////////////////////////
route.get('/exam', function (req, res,next) {
    routerUrl('exam','exam/races.ejs',req,res);
});
route.get('/exam/raceDetail', function (req, res,next) {
    routerUrl('exam/raceDetail','exam/raceDetail.ejs',req,res);
});
route.get('/exam/apply', function (req, res,next) {
    routerUrl('exam/apply','exam/apply.ejs',req,res);
});
route.get('/exam/grade', function (req, res,next) {
    routerUrl('exam/grade','exam/grade.ejs',req,res);
});
route.get('/exam/exam', function (req, res,next) {
    routerUrl('exam/exam','exam/exam.ejs',req,res);
});
route.get('/downloadapp', function (req, res,next) {
    res.send();
});
route.get('/author', function (req, res,next) {
    routerUrl('author','',req,res);
});
/////////////////////////////////////////////////////////
route.get('/races', function (req, res) {
    routerUrl('races','exam/races.ejs',req,res);
});


module.exports = function(app) {
    app.use('/',route);
    app.use('/wx', require('./wx'));
};


