import dotenv from 'dotenv';
dotenv.config();

const getEnv = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;
    if (value === undefined) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

export const config = {
    port: parseInt(getEnv('PORT', '5000'), 10),
    jwt: {
        accessSecret: getEnv('JWT_ACCESS_SECRET', 'access_secret_placeholder'),
        refreshSecret: getEnv('JWT_REFRESH_SECRET', 'refresh_secret_placeholder'),
        accessExpiresIn: '15m',
        refreshExpiresIn: '7d',
    },
    google: {
        clientId: getEnv('GOOGLE_CLIENT_ID', 'placeholder_client_id'),
    },
    frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:3000'),
    nodeEnv: getEnv('NODE_ENV', 'development'),
};
