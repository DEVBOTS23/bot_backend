const express = require("express");
const router = express.Router();
const User = require("../modals/User");
const userController = require("../controllers/userController");
const bcrypt = require("bcrypt");

router.route("/")
    .get(userController.getUserDetails)
    .post(userController.userLogin)
    .patch(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;