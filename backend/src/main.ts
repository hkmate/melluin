import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {ValidationPipe} from '@nestjs/common';

process.env.TZ = 'UTC';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {cors: true});
    const port = app.get(ConfigService).get<number>('server.port')!;
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true
        }),
    );
    app.setGlobalPrefix('api');
    await app.listen(port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
