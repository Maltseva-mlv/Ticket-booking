const express = require('express');
const { bookSeat, showBookSeat } = require('../controllers/bookingsController');
const router = express.Router();

router.post('/bookings', bookSeat);
router.get('/bookings', showBookSeat);

module.exports = router;
