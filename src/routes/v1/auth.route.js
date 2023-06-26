const express = require('express');
const validate = require('../../middlewares/validate');
const auth = require('../../middlewares/auth');
const authController = require('../../controllers/auth.controller');
const authValidation = require('../../validations/auth.validation');

const router = express.Router();

router.get('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/auth0user', authController.retrieveAuth0UserData);

module.exports = router;

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /auth/auth0user:
 *   get:
 *     summary: Retrieve auth0 user document
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: The created book.
 *         content:
 *           application/json:
 *             schema:
 *                $ref: '#/components/schemas/Success'
 */
