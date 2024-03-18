import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { welcome } from './utils/welcome';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  if (process.env.IS_WORKER === 'true') {
    const kafkaHost = process.env.KAFKA_HOST;
    const kafkaPort = process.env.KAFKA_PORT;
    const kafkaApp = await NestFactory.createMicroservice<MicroserviceOptions>(
      AppModule,
      {
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'dast-api',
            brokers: [`${kafkaHost}:${kafkaPort}`],
          },
          consumer: {
            groupId: 'dast-worker',
            heartbeatInterval: 500,
            retry: { restartOnFailure: async () => false },
          },
        },
      },
    );
    await kafkaApp.listen();
  }
  await app.listen(process.env.PORT);
  welcome();
}
bootstrap();
