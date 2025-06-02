import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);
  const port = configService.get('PORT', 3000);
  const apiPrefix = configService.get('API_PREFIX', 'api/v1');

  // Configuração do prefixo global
  app.setGlobalPrefix(apiPrefix);

  // Servir arquivos estáticos (favicon, etc.)
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Configuração de CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', '*'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });

  // Pipes globais para validação
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Filtros globais para tratamento de exceções
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Brain Agriculture API')
    .setDescription('Sistema de gestão rural - API para gerenciamento de produtores, fazendas e culturas')
    .setVersion('1.0')
    .addTag('Sistema', 'Informações do sistema e health check')
    .addTag('Produtores', 'Operações relacionadas aos produtores rurais')
    .addTag('Fazendas', 'Operações relacionadas às fazendas')
    .addTag('Culturas', 'Operações relacionadas às culturas')
    .addTag('Safras', 'Operações relacionadas às safras')
    .addTag('Culturas das Fazendas', 'Operações relacionadas às culturas cultivadas nas fazendas')
    .addTag('Dashboard', 'Operações relacionadas aos dashboards e relatórios')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${apiPrefix}/docs`, app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(port);
  console.log(`🚀 Aplicação rodando em: http://localhost:${port}/${apiPrefix}`);
  console.log(`📚 Documentação Swagger: http://localhost:${port}/${apiPrefix}/docs`);
}

bootstrap().catch((error) => {
  console.error('❌ Erro ao inicializar a aplicação:', error);
  process.exit(1);
}); 