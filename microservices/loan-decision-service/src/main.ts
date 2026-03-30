import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Loan Decision Service API')
    .setDescription('OpenAPI documentation for loan-decision-service')
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
    res.setHeader('Content-Disposition', 'attachment; filename="loan-decision-service.openapi.json"');
    res.send(JSON.stringify(document, null, 2));
  });

  await app.listen(3002);
}

void bootstrap();
