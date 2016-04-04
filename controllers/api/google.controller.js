var express = require('express');
var router = express.Router();

// routes
router.post('/googleClassAttendance', googleClassAttendance);

module.exports = router;

function googleClassAttendance(req, res) {
    console.log("request body", req.body);
    res.sendStatus(200);
}
