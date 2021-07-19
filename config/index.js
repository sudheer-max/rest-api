import dotenv from 'dotenv';

dotenv.config();

export const {
    APP_PORT,
    DB_URL,
    DEBUG_MODE,
    JWT_ACCESS_TOKEN,
    JWT_REFRESH_TOKEN,
    APP_URL
} = process.env;