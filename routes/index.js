var express = require('express');
var router = express.Router();

// Home
router.get('/', (req, res) => {
  res.render('index', { title: 'Blackboard Hope' });
});

module.exports = router;
