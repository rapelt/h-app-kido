var express = require('express');
var router = express.Router();

// routes
router.post('/googleClassAttendance', googleClassAttendance);

module.exports = router;

function googleClassAttendance(req, res) {
    console.log("GOOGLE YAY 8888");
    res.sendStatus(200);
}
