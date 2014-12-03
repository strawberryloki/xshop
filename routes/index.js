var express = require('express');
var User = require('../models/user.js');
var router = express.Router();
var crypto = require('crypto');
var Post = require('../models/post.js');

//============= Functions =================

function checkLogin(req, res, next) {
    if (!req.session.user) {
        req.session.error = 'You have not Login';
        return res.redirect('/login');
    }
    next();
}

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.session.error = 'You have already Login';
        return res.redirect('/');
    }
    next();
}

// ========================================

/* GET home page. */
router.get('/', function (req, res) {
    Post.get(null, function (err, posts) {
        if (err) {
            posts = [];
        }
        res.render('index', {
            title: 'X-Shop',
            posts: posts,
        });
    });
});


/* GET register page. */
router.get('/reg', checkNotLogin);
router.get('/reg', function (req, res) {
    res.render('reg', {
        title: 'Register'
    });
});

/* POST register request. */
router.post('/reg', checkNotLogin);
router.post('/reg', function (req, res) {
    // check whether the password is consistent 
    if (req.body["password-repeat"] !== req.body.password) {
        req.session.error = 'The two passwords is not the same';
        return res.redirect('/reg');
    }
    
    //generate the md5 value of password
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User({
        name: req.body.username,
        password: password,
    });
    
    //check whether the username is existed
    User.get(newUser.name, function (err, user) {
        if (user){
            err = 'Username already exists.';
        }
        if (err) {
            req.session.error = err;
            return res.redirect('/reg');
        }
        //Create User if no error
        newUser.save(function (err) {
            if (err) {
                req.session.error = err;
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.session.success = 'Register Successfully';
            res.redirect('/');
        });
    });
});

/* GET Login page. */
router.get('/login', checkNotLogin);
router.get('/login', function (req, res) {
    res.render('login', {
        title: 'X-Shop Login',
    });
});

/* POST Login request. */
router.post('/login', checkNotLogin);
router.post('/login', function (req, res) {
    //generate the md5 value
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    User.get(req.body.username, function (err, user) {
        if (!user) {
            req.session.error = 'The user is not existed';
            return res.redirect('/login');
        }
        if (user.password !== password) {
            req.session.error = 'Wrong Password';
            return res.redirect('/login');
        }
        req.session.user = user;
        req.session.success = 'Login Successfully';
        res.redirect('/');
    });
});


/* GET Logout page. */
router.get('/logout', checkLogin);
router.get('/logout', function (req, res) {
    req.session.user = null;
    req.session.success = 'Success Logout';
    res.redirect('/');
});


/* POST post request. */
router.post('/post', checkLogin);
router.post('/post', function (req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function (err) {
        if (err) {
            req.session.error = err;
            return res.redirect('/');
        }
        req.session.success = '发表成功';
        res.redirect('/u/' + currentUser.name);
    });
});


/* GET User page. */
router.get('/u/:user', function (req, res) {
    User.get(req.params.user, function (err, user) {
        if (!user) {
            req.session.error = '用户不存在';
            return res.redirect('/');
        }
        Post.get(user.name, function (err, posts) {
            if (err) {
                req.session.error = err;
                return res.redirect('/');
            }
            res.render('user', {
                title: user.name,
                posts: posts,
            });
        });
    });
});


module.exports = router;