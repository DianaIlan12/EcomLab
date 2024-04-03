const auth = require('../controller/Auth');
const express = require('express')
const router = express.Router()
const { adminAuth } = require("../middleware/auth");

//Register User
router.post('/register', auth.register)
router.post('/login', auth.login)
router.put("/update", adminAuth, auth.update)
router.delete("/deleteUser", auth.deleteUser)
router.get("/getUsers", auth.getUsers)

module.exports = router;