import { app } from './app';
import { env } from './env';
import { logServerError, logServerInfo } from './common/utils';

const start = async () => {
    try {
        const PORT = env.PORT || 3000

        await app.listen({
            host: '0.0.0.0',
            port: PORT
        });

        logServerInfo(PORT, env.NODE_ENV);
    } catch (err: unknown) {
        logServerError(err, app);
        process.exit(1);
    }
};

start();