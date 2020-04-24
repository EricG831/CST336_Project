/* App Configuration */
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var mysql = require('mysql');
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

/* Configure MySQL DBMS */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'ericg',
    password: 'ericg',
    database: 'library_db'
});
connection.connect();

//default route
app.get('/', function(req, res){
    res.render('login');
});

app.get('/login', function(req, res){
    console.log(req.query.username, req.query.password);
     var stmt = 'select * from FP_user where userName=\'' 
                + req.query.username + '\' and password=\'' 
                + req.query.password + '\';';
    console.log(stmt);
    var user = null;
    connection.query(stmt, function(error, results){
        if(error){
            throw error;
        } else if(results.length){      //user is in db
            user = results;
            console.log(user[0].userId);
            res.render('home');
        } else {                        //user is not in db - do this as a pop up later
            console.log("User not found");
            res.render("loginError");
        }
    });
});

/* Create a new author - Get author information */
app.get('/user/new', function(req, res){
    res.render('user_new');
});

/* Create a new user - Add user into DBMS */
app.post('/user/new', function(req, res){
   console.log(req.body);
  connection.query('SELECT COUNT(*) FROM FP_user;', function(error, result){
      if(error) throw error;
      if(result.length){
            var userId = result[0]['COUNT(*)'] + 1;
            var stmt = 'INSERT INTO FP_user ' +
                      '(userId, userName, password) '+
                      'VALUES ' +
                      '(' + 
                      userId + ',"' +
                      req.body.username + '","' +
                      req.body.password + '"' +
                      ');';
            console.log(stmt);
            connection.query(stmt, function(error, result){
                if(error) throw error;
                res.redirect('/');
            })
      }
  });
});

/* The handler for undefined routes */
app.get('*', function(req, res){
   res.render('error'); 
});

/* Start the application server */
app.listen(process.env.PORT || 3000, function(){
    console.log('Server has been started');
})
