import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const types = require('pg').types
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
types.setTypeParser(20, val => parseInt(val, 10));

process.env.TZ = 'UTC';

// eslint-disable-next-line max-lines-per-function
async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
        cors: true,
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    const port = app.get(ConfigService).get<number>('server.port')!;
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );
    app.setGlobalPrefix('api');
    await app.listen(port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
