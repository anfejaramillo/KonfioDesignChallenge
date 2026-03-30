import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Loan Application Service API')
    .setDescription('Public OpenAPI documentation for loan-application-service')
    .setVersion('1.0.0')
    .addTag('loan-applications')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('public/docs', app, document, {
    customSiteTitle: 'Loan Application Service - OpenAPI',
    jsonDocumentUrl: 'public/openapi.json',
  });

  await app.listen(3000);
}

void bootstrap();
