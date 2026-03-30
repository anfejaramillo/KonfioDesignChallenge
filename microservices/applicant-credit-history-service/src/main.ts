import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Applicant Credit History Service API')
    .setDescription('OpenAPI documentation for applicant-credit-history-service')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('public/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const httpAdapter = app.getHttpAdapter();
  httpAdapter.get('/public/openapi.json', (_req: unknown, res: any) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="applicant-credit-history-service.openapi.json"');
    res.send(JSON.stringify(document, null, 2));
  });

  await app.listen(3001);
}

void bootstrap();
