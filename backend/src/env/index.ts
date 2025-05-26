import 'dotenv/config';
import { AppError } from 'src/common/AppError';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
    JWT_SECRET: z.string(),
    PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
    console.error('❌ Invalid enviroment variables', _env.error.format());

    throw new AppError('Invalid environment variables', 500, {
        code: 'ENV_VALIDATION_ERROR',
        details: _env.error.format(),
        isOperational: true
    });
}

export const env = _env.data;