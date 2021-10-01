var express = require('express');
var router = express.Router();
const auth = require("../src/auth");

router.post('/', async function (req, res) {
    await auth.registerUser(res, "users", req.body);

    // return res.status(201).json({ data });
});

module.exports = router;
