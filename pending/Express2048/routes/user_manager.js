var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    port     :  3306 ,
    user     : 'root',
    password : 'abmxkok199867',
    database : 'dbTest'
});

connection.connect();

var loginUser = { userid: null, username: null, score: 0 };
var loginInfo = { loginUser: loginUser, loginState: false };

var login = function( username, password, fn ){
    var sql = 'SELECT userid, username, password, score FROM jsuser WHERE username = ? ';
    var  sqlParams = [ username ];
    connection.query(sql,sqlParams,function (err, result) {
        if(err){
            console.log('[Login ERROR] - ',err.message);
            return;
        }
        console.log('-----------------------------Login-------------------------------');
        // console.log('result:',result);
        if( result.length === 0 ){ //结果为空
            console.log('没有此账户！');
            return ;
        }
        if( password !== result[0].password ){
            console.log('密码错误！');
            return;
        }
        console.log('登陆成功！正在获取当前用户信息……');
        loginUser.userid = result[0].userid;
        loginUser.username = result[0].username;
        loginUser.score = result[0].score;
        console.log('当前用户'+loginUser.username+', 分数：'+loginUser.score);
        loginInfo.loginState = true;
        loginInfo.loginUser = loginUser;
        console.log('-------------------------Send to Client-----------------------------\n');
        fn( {   result:"true",
            username: loginUser.username,
            score: loginUser.score});

    });
};

exports.login = login;

var setBestScore = function ( username, score, fn ){
    var sql = 'UPDATE jsuser SET score = ? WHERE username = ? ';
    var  sqlParams = [ score, username ];
    console.log('-------------------------Execute SQL-------------------------------');
    connection.query(sql,sqlParams,function (err, result) {
        if(err){
            console.log('[setBestScore ERROR] - ',err.message);
            return;
        }
        console.log('-------------------------setBestScore-------------------------------'+score);
        loginInfo.loginUser.score = score;
        console.log('-------------------------Send to Client-----------------------------\n');
        if(result.length===0) {
            fn({result:"false"});
        }else fn( {   result:"true",
            username: loginUser.username,
            score: loginUser.score});
    });

};
exports.setBestScore = setBestScore;

var register = function (username, password, fn) {
    console.log("register: "+username+" "+password);
    var sql = 'INSERT INTO jsuser(username, password, score) VALUE(?, ?, 0)';
    var  sqlParams = [ username, password ];
    console.log('-------------------------Execute SQL-------------------------------');
    connection.query(sql,sqlParams,function (err, result) {
        if(err){
            console.log('[Register ERROR] - ',err.message);
            return;
        }
        console.log('-------------------------Register-------------------------------');

        if(result.length===0) {
            fn({result:"false"});
        }else fn( {   result:"true"});
    });

};

exports.register = register;

var closeDB = function () {
    connection.end();
};

exports.closeDB = closeDB;

