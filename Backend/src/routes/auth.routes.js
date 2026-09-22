const express = require("express");
const {
  register,
  login,
  logout,
  getMe,
} = require("../controllers/auth.controller.js");
const { authenticateUser } = require("../middlewares/auth.middleware.js");

const router = express.Router();

/**
 * @route /api/auth/register
 * @description Register a user
 * @access Public
 */
router.post("/register", register);

/**
 * @route /api/auth/login
 * @description Login a user
 * @access Public
 */
router.post("/login", login);

/**
 * @route /api/auth/logout
 * @description Logout a user
 * @access Private
 */
router.get("/logout", logout);

/**
 * @route /api/auth/logout
 * @description Logout a user
 * @access Private
 */
router.get("/get-me", authenticateUser, getMe);







module.exports = router;
