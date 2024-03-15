const pool = require('../config/db');

exports.bookSeat = async (req, res) => {

	const { session_id, user_id, seat_id } = req.body;

	try {
		const seat = await pool.query(
            'SELECT * FROM seats WHERE seat_id = $1 AND session_id = $2 AND is_booked = FALSE',
            [seat_id, session_id]
        );


		if (seat.rows.length === 0) {
            return res.status(404).send('Выбранное место недоступно для бронирования');
        }

        const newBooking = await pool.query(
            'INSERT INTO bookings (session_id, user_id, seat_id) VALUES ($1, $2, $3) RETURNING *',
            [session_id, user_id, seat_id]
        );

        await pool.query(
            'UPDATE seats SET is_booked = TRUE WHERE seat_id = $1',
            [seat_id]
        );

        res.status(201).json({ message: 'Место успешно забронировано', booking: newBooking.rows[0] });
	} catch (error) {
		console.error('Ошибка при бронировании места:', error);
        res.status(500).json({ error: 'Произошла ошибка при бронировании места' });
	}
};

exports.showBookSeat = async (req, res) => {

	try {
		const bookingsData = await pool.query('SELECT * FROM bookings');
		res.json({ bookingsData: bookingsData.rows });

	} catch (error) {
		console.error('Ошибка при получении данных:', error);
        res.status(500).send('Произошла ошибка при получении данных из базы данных.');
	}
};