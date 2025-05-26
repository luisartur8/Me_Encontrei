import { app } from './app';
import { env } from './env';

const start = async () => {
    try {
        const PORT = env.PORT || 3000

        await app.listen({
            host: '0.0.0.0',
            port: PORT
        });
        console.log(`✅ Servidor rodando em http://localhost:${PORT}`);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();