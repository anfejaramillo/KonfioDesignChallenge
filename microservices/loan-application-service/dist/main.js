"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const swaggerConfig = new swagger_1.DocumentBuilder()
        .setTitle('Loan Application Service API')
        .setDescription('Public OpenAPI documentation for loan-application-service')
        .setVersion('1.0.0')
        .addTag('loan-applications')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
    swagger_1.SwaggerModule.setup('public/docs', app, document, {
        customSiteTitle: 'Loan Application Service - OpenAPI',
        jsonDocumentUrl: 'public/openapi.json',
    });
    await app.listen(3000);
}
void bootstrap();
