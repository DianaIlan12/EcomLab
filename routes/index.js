const express = require('express');
const router = express.Router();
const payments = require('../controller/Payments');

const { adminAuth, userAuth } = require("../middleware/auth");

/* GET home page. */
router.get('/', userAuth, function (req, res, next) {
  res.render('index', { status: req.body.status });
});


router.get('/v2/MsMiddleware/Customer/:id', (req, res) => {
  res.send(`Salami davit - customer: ${req.params.id}`).status(200)
})
// Auth pages

router.get('/login', function (req, res, next) {
  res.render('login', { });
});

router.get('/register', function (req, res, next) {
  res.render('register', { });
});

router.post('/', userAuth, function (req, res, next) {
  res.render('index', { status: req.body.status });
});

router.get('/return/:returnId', function (req, res, next) {
  res.render('return', { id: req.params.returnId });
});

router.post('/callback', payments.callback)

module.exports = router;
