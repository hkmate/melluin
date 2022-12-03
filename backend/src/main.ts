import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import * as CONFIG from '../resources/server-config.json';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, { cors: true });
    await app.listen(CONFIG.server.port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
