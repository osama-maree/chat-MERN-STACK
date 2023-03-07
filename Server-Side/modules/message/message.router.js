const { auth } = require("../../middleware/auth.js");
const { getMessages, createMessage, getAllusers } = require("./controller/controller.js");

const router = require("express").Router();
router.post('/getallmessage/:from',getMessages)
router.post('/createMessage/:from',createMessage)
router.get('/getusers/:id',getAllusers)
module.exports = router;