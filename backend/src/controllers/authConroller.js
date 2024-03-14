const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const {validationResult} = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET_KEY;

const generateAccessToken = (id, last_name) => {

	const payload = {
		id, 
		last_name
	}

	return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {

	async registration(req, res){
		try{

			const errors = validationResult(req);
			
			if (!errors.isEmpty()){
				return res.status(400).json({message: 'Ошибка при регистрации', errors})
			}

			const { username, password, email, role } = req.body;

			const candidate = await pool.query(
				'SELECT * FROM users WHERE username = $1', [username]
			);

			if (candidate.rows.length > 0) {
				return res.status(400).json({message: "Пользователь с таким именем уже существует"})
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const user = await pool.query(
				'INSERT INTO users (username, password, email, role) VALUES ($1, $2, $3, $4) RETURNING username',
				[username, hashedPassword, email, role]
			);
			
			res.status(201).send(`Пользователь ${user.rows[0].username} успешно зарегистрирован`);

		} catch (err) {
			console.log(err);
			res.status(400).json({message: 'Ошибка регистрации'})
		}
	}

	async login(req, res){
		try{

			const { username, password } = req.body;
			const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
			
			if (user.rows.length > 0) {
				const isValid = await bcrypt.compare(password, user.rows[0].password);
				if (!isValid) {
					res.status(400).send('Введен неверный пароль');
				} 

				const token = generateAccessToken(user.rows[0].user_id, user.rows[0].username);
				res.json({ token });
			} else {
				res.status(404).send('Пользователь не найден');
			}

		} catch (err) {
			console.log(err);
			res.status(400).json({message: 'Ошибка при входе'})
		}
	}
}

module.exports = new authController();