import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * Bootstraps the NestJS HTTP server and exposes Swagger documentation.
 */
async function bootstrap(): Promise<void> {
  // Create Nest application from root module.
  const app = await NestFactory.create(AppModule);

  // Configure OpenAPI metadata for external consumers.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Loan Application Service API')
    .setDescription('Public OpenAPI documentation for loan-application-service')
    .setVersion('1.0.0')
    .addTag('loan-applications')
    .build();

  // Generate and expose Swagger UI and JSON endpoints.
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('public/docs', app, document, {
    customSiteTitle: 'Loan Application Service - OpenAPI',
    jsonDocumentUrl: 'public/openapi.json',
  });

  // Start HTTP listener on the service default port.
  await app.listen(3000);
}

void bootstrap();
