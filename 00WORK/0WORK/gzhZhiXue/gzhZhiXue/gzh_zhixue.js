/**
 * Created by jishubu on 17/1/27.
 */


let bodyParser = require('body-parser');
let express = require('express');
let app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('./views/static'));
app.set('views','./views');
app.set('view engine', 'ejs');

require('./route/index')(app);
let port = 9001;//80;

// app.use(express.timeout(1200000)).use(function (req,res,next) {
//     setTimeout(function(){
//         res.end('time out!\n');
//     },5000);
//     if(!req.timedout) next();
// });
app.listen(port, function () {
    console.log('Example app listening on port !' + port );
});
