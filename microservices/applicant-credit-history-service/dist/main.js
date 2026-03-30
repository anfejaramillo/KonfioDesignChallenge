"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Applicant Credit History Service API')
        .setDescription('OpenAPI documentation for applicant-credit-history-service')
        .setVersion('1.0.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('public/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
        },
    });
    const httpAdapter = app.getHttpAdapter();
    httpAdapter.get('/public/openapi.json', (_req, res) => {
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Content-Disposition', 'attachment; filename="applicant-credit-history-service.openapi.json"');
        res.send(JSON.stringify(document, null, 2));
    });
    await app.listen(3001);
}
void bootstrap();
