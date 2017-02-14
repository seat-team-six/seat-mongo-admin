var express = require('express')
var app = express()
var mongo_express = require('./mongo-express/lib/middleware')
var mongo_express_config = require('./mongo_express_config')
var path = require('path')
var uuidV4 = require('uuid/v4');
var cookieSession = require('cookie-session')
var bodyParser = require('body-parser')

const port = process.env.PORT || 3001;
const user = process.env.ADMIN_USER || "test"
const pw = process.env.ADMIN_PW || "password"
const key1 = process.env.KEY1 || 'key1'
const key2 = process.env.KEY2 || 'key2'

app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))

var users = {}

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/login.html'));
})

app.post('/login', (req, res) => {
    if (req.body.username == user && req.body.password == pw) {
        const id = uuidV4();
        users[id] = true;
        req.session.id = id;
        res.redirect("/")
    }
    res.redirect("/login")
});

app.use('/', isLoggedIn, mongo_express(mongo_express_config))

app.listen(port, function () {
  console.log('Example app listening on port 3000!')
})

function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.session.id != undefined && users[req.session.id])
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}