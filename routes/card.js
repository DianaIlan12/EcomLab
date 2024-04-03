const cards = require('../controller/Cards');
const express = require('express')
const router = express.Router()

//delete card
router.delete('/:recId', cards.delete);
//Get all Card
router.get('/', cards.findAll)

router.get('/', (req, res) => {
  res.status(400).send("Wrong place")
})

module.exports = router;