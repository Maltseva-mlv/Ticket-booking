const pool = require('../config/db');

exports.getMoviesData  = async (req, res) => {

    try {
        const movies = await pool.query(
            'SELECT * FROM movies'
        );

        res.json({ movies: movies.rows });
    } catch (error) {
        console.error('Ошибка при получении данных:', error);
        res.status(500).send('Произошла ошибка при получении данных из базы данных.');
    }
};

exports.createMovie  = async (req, res) => {

    try {
        const { title, description, release_date, duration } = req.body;

        const newMovie = await pool.query(
            'INSERT INTO movies (title, description, release_date, duration) VALUES ($1, $2, $3, $4) RETURNING *',
            [title, description, release_date, duration]
        );
        
        res.status(201).send(`Фильм ${newMovie.rows[0].title } успешно добавлен`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getSessions = async (req, res) => {

    try {

        const sessions = await pool.query(
            'SELECT s.*, m.title AS movie_title FROM sessions s JOIN movies m ON s.movie_id = m.movie_id'
        );

        res.json({ sessions: sessions.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createSession = async (req, res) => {

    try {
        const { movie_title, start_time, date } = req.body;

        const movieQuery = await pool.query(
            'SELECT movie_id FROM movies WHERE title = $1',
            [movie_title]
        );

        if (movieQuery.rows.length === 0) {
            return res.status(404).send('Фильм не найден');
        }

        const movie_id = movieQuery.rows[0].movie_id;

        await pool.query(
            'INSERT INTO sessions (movie_id, start_time, date) VALUES ($1, $2, $3) RETURNING *',
            [movie_id, start_time, date]
        );

        res.status(201).send(`Сеанс фильма ${movie_title} успешно добавлен`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}