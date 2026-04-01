import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstraps the NestJS service and exposes OpenAPI documentation endpoints.
 */
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
  // Expose the OpenAPI document as a downloadable JSON file.
  httpAdapter.get('/public/openapi.json', (_req: unknown, res: any) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="loan-decision-service.openapi.json"');
    res.send(JSON.stringify(document, null, 2));
  });

  const port = Number(process.env.PORT ?? 3002);
  await app.listen(port);
}

void bootstrap();
