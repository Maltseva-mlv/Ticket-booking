require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_KEY;
const pool = require('../config/db');

module.exports = async function (req, res, next) {

        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }

        const token = authorizationHeader.split(' ')[1];

        if (!token) {
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }

		try {
			const decodedToken = jwt.verify(token, secret);
			const userId = decodedToken.id;
	
			const user = await pool.query('SELECT * FROM users WHERE user_id = $1', [userId]);
	
			if (user.rows.length === 0) {
				console.log(user);
				return res.status(403).json({ message: "Пользователь не найден" });
			}
	
			const isAdmin = user.rows[0].role === 'admin';
			if (!isAdmin) {
				return res.status(403).json({ message: "Доступ запрещен" });
			}
	
			next();
		} catch (err) {
			console.log(err);
			return res.status(403).json({ message: "Ошибка аутентификации" });
		}
    
}
