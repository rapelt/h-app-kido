var express = require('express');
var router = express.Router();

// routes
router.post('/googleClassAttendance', googleClassAttendance);

module.exports = router;

function googleClassAttendance(req, res) {
    var stuff = req.body;
    console.log(stuff[0][0]);
    res.sendStatus(200);
}
