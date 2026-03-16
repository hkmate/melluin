import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {ConfigService} from '@nestjs/config';
import {INestApplication, ValidationPipe} from '@nestjs/common';
import {DocumentBuilder, OpenAPIObject, SwaggerModule} from '@nestjs/swagger';
import helmet from 'helmet';
import {handleMigrations} from '@be/flyway';

// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
const types = require('pg').types
// eslint-disable-next-line @typescript-eslint/no-magic-numbers
types.setTypeParser(20, val => parseInt(val, 10));

process.env.TZ = 'UTC';

// eslint-disable-next-line max-lines-per-function
async function bootstrap(): Promise<void> {
    console.log('Starting NestJs App..');
    const app = await NestFactory.create(AppModule, {
        logger: ['log', 'error', 'warn', 'debug', 'verbose'],
    });
    const config = app.get(ConfigService);

    app.use(helmet());
    app.enableCors({
        origin: config.get('server.security.corsOrigins'),
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
        optionsSuccessStatus: 200
    });

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
            forbidNonWhitelisted: true,
        }),
    );

    app.setGlobalPrefix('api');

    setupOpenApi(app);

    const port = app.get(ConfigService).get<number>('server.port')!;
    await app.listen(port);
}

function setupOpenApi(app: INestApplication): void {
    const needOpenApi = app.get(ConfigService).get<boolean>('server.openApi.generate') ?? false;
    if (!needOpenApi) {
        return;
    }

    const config = new DocumentBuilder()
        .addBearerAuth()
        .setTitle('Melluin API')
        .setVersion('1.4.3')
        .build();
    const documentFactory = (): OpenAPIObject => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, documentFactory);
}


handleMigrations().then(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    bootstrap();
});
