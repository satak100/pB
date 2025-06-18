CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255),
    role VARCHAR(20) NOT NULL CHECK (role IN ('player', 'architect')),
    google_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP DEFAULT NOW()
);