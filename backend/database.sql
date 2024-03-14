CREATE DATABASE Cinema;

CREATE TABLE Movies(
    movie_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    release_date DATE,
    duration INTEGER
);

CREATE TABLE sessions (
    session_id SERIAL PRIMARY KEY,
    movie_id INTEGER REFERENCES movies(movie_id),
    start_time TIME,
    end_time TIME,
    date DATE
);

CREATE TABLE seats (
    seat_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES sessions(session_id),
    seat_number INTEGER,
    is_booked BOOLEAN DEFAULT FALSE
);

CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES sessions(session_id),
    user_id INTEGER REFERENCES users(user_id),
    seat_id INTEGER REFERENCES seats(seat_id),
    booking_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'user'
);


