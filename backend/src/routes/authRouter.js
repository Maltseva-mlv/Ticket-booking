const express = require('express');
const router = express.Router();
const controller = require('../controllers/authConroller');
const { check } = require('express-validator');

router.post('/registration',[
	check('username', "Имя пользователя не должно быть пустым").notEmpty(),
	check('password', "Пароль должен быть больше 4 символов").isLength({min: 4})
], controller.registration)

router.post('/login', controller.login)

module.exports = router;