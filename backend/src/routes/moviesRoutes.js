const express = require('express');
const { getMoviesData, createMovie, getSessions, createSession } = require('../controllers/moviesController');
const roleMiddleware = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/movies', getMoviesData);
router.post('/movies', roleMiddleware, createMovie);

router.get('/sessions', getSessions);
router.post('/sessions', roleMiddleware, createSession);

module.exports = router;
