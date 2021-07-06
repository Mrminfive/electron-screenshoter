export const env = (process.env.CI_ENV as 'dev' | 'prod') || 'dev';

export const isDev = env === 'dev';
export const isProd = env === 'prod';
