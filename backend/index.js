const express = require('express');
const PORT = process.env.PORT || 8081;
const getMovies = require('./src/routes/moviesRoutes');
const authRouter = require('./src/routes/authRouter');
const app = express();

app.use(express.json());

app.use('/', getMovies);
app.use('/auth', authRouter);

app.listen(PORT, () => {
    console.log(`Сервер запущен на ${PORT} порту`);
});

