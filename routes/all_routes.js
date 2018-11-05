var express = require('express');
var router = express.Router();

var visit = require('../controllers/visit');

/* Handle each webpage function here. */

router.get('/visit', visit.get);
router.post('/visit', visit.post);

// For invalid paths.
router.all('*', function(req, res)
    {
    res.send({message: 'Invalid route.'}, 404);
    });

// For visit/other
router.all('/visit/*', function(req, res)
    {
    res.send({message: 'Invalid route.'}, 404);
    });

module.exports = router;