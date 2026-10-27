import pino from 'pino';
import { env } from './config/env';

export const logger = pino({
  level: env.nodeEnv === 'test' ? 'silent' : env.isProd ? 'info' : 'debug',
  transport: env.isProd ? undefined : { target: 'pino-pretty', options: { colorize: true } },
});
