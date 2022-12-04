import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {cors: true});
    const port = app.get(ConfigService).get<number>('server.port')!;
    await app.listen(port);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
