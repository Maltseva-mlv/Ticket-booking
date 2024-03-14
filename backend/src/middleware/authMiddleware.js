require('dotenv').config();
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET_KEY;

module.exports = function (req, res, next){

	if (req.method === 'OPTIONS'){
		next();
	}

	try {
		const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }

        const token = authorizationHeader.split(' ')[1];

		if (!token) {
            return res.status(403).json({ message: "Пользователь не авторизован" });
        }
		const decodeData = jwt.verify(token, secret);
		req.user = decodeData;
		next();
	} catch (err) {
		console.log(err);
		res.status(403).json({message: "Пользователь не авторизован"})
	}
}