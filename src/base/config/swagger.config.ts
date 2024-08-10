import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function configSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Books Maison API')
    .setLicense('The Unlicense', 'https://unlicense.org/')
    .setDescription(
      'The API for Books Maison - an online library web application',
    )
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: 'Enter JWT authentication (access) token',
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'JWT',
    )
    .addTag('auth', 'Operations about authentication & authorization')
    .addTag('users', 'Operations about users')
    .addTag('me', 'Operations for the current authenticated user')
    .addTag('books', 'Operations about books')
    .addTag('favourite-books', 'Operations about favourite books')
    .addTag('authors', 'Operations about authors')
    .addTag('categories', 'Operations about categories')
    .addTag('checkouts', 'Operations about checkouts')
    .addTag('fines', 'Operations about fines')
    .addTag('transactions', 'Operations about money transactions')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api-docs', app, document, {
    customSiteTitle: 'Books Maison API Documentation',
    customfavIcon: '/images/favicon.ico',
  });
}
