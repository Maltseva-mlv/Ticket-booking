const express = require('express');
const PORT = process.env.PORT || 8081;
const getMovies = require('./src/routes/moviesRoutes');
const authRouter = require('./src/routes/authRouter');
const bookingsRoutes = require('./src/routes/bookingsRoutes');
const app = express();

app.use(express.json());

app.use('/', getMovies);
app.use('/auth', authRouter);
app.use('/', bookingsRoutes);

app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`);
});

