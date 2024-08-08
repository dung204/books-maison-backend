<p align="center">
  <a href="http://api.books-maison.live/api-docs" target="blank"><img src="static/images/books-maison-logo-dark.svg" width="400" alt="Nest Logo" /></a>
</p>

<p align="center">The RESTful API for Books Maison - an online library web application</p>

Live API documentation: [http://api.books-maison.live/api-docs](http://api.books-maison.live/api-docs)

## Table of Contents

- [1. Primary Features](#1-primary-features)
- [2. Technologies Used](#2-technologies-used)
- [3. Getting Started](#3-getting-started)
  - [3.1. Prerequisites](#31-prerequisites)
  - [3.2. Installation](#32-installation)
- [4. License](#4-license)

## 1. Primary Features

- CRUD (Create, Read, Update, Delete) users, books, authors, checkouts, fines
- User authentication and authorization using JWT (JSON Web Token)
- Allowing users to borrow and return books
- Calculating fines for late returns
- Allowing users to pay fines using [Momo E-wallet](https://www.momo.vn/)

> **Note**:
>
> - Whenever a user borrows a book, a checkout record is created with a due date.
> - If the user returns the book after the due date, a fine is calculated based on the number of days the book is overdue.

## 2. Technologies Used

- [NestJS](https://nestjs.com/): A progressive Node.js framework for building efficient, reliable and scalable server-side applications.
- [TypeORM](https://typeorm.io/): An ORM that can run in NodeJS, Browser, Cordova, PhoneGap, Ionic, React Native, NativeScript, Expo, and Electron platforms and can be used with TypeScript and JavaScript (ES5, ES6, ES7, ES8).
- [PostgreSQL](https://www.postgresql.org/): A powerful, open source object-relational database system.
- [Redis](https://redis.io/): An open source, in-memory data structure store, used as a database, cache, and message broker.
- [Swagger UI](https://swagger.io/tools/swagger-ui/): A tool that generates interactive API documentation that lets you try out the API calls directly in the browser.
- [Docker](https://www.docker.com/): A platform for developing, shipping, and running applications in containers.
- [DigitalOcean](https://www.digitalocean.com/): A cloud infrastructure provider that offers cloud services to help deploy modern apps.

## 3. Getting Started

### 3.1. Prerequisites

You need to have the following installed on your machine:

- [Node.js 22.3.0+](https://nodejs.org/en/download/)
- [Yarn 1.22.22](https://yarnpkg.com/getting-started/install)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Git](https://git-scm.com/downloads)

Once installed Node.js, you also have to enable [`corepack`](https://nodejs.org/api/corepack.html), and install the correct version of Yarn:

```bash
corepack enable && corepack install --global yarn@1.22.22
```

### 3.2. Installation

1. Clone the repository:

```bash
git clone https://github.com/dung204/books-maison-backend.git
```

2. Change into the project directory:

```bash
cd books-maison-backend
```

3. Install the dependencies:

```bash
yarn install --frozen-lockfile
```

4. Create a `.env` file in the root of the project. The `.env` **must** contains all variables in the [`.env.example`](.env.example) file.

> **Note**: The `MOMO_IPN_URL` environment variable is the URL that Momo will send the IPN (Instant Payment Notification) to. You must a service like [ngrok](https://ngrok.com/), to expose your local server to the internet, and then use the generated URL as the value for this variable.

5. To run the application in development mode, you have to install PostgreSQL and Redis (on your local machine or using Docker). You have to make sure that the PostgreSQL and Redis connection in `.env` file is correct. Once ready, you can run the following command:

```bash
yarn start:dev
```

6. The application **always run in HTTPS mode**, which requires two files: `cert.pem` - the public TLS certificate and `key.pem` - the private key. Both files are stored in the `cert` directory, in the root of the project.

7. To run the application in production-like mode, you can use Docker Compose with the following command:

```bash
docker-compose up -d
```

8. Run the database migrations:

```bash
yarn migration:run
```

In case of running with Docker Compose, you have to run the migrations inside the Docker container. You can do this by running the following command:

```bash
docker-compose exec api yarn migration:run
```

> **Note**: `api` is the name of the service in the [`docker-compose.yml`](docker-compose.yml) file.

9. The application should be running at `http://localhost:<APP_PORT>`, where `APP_PORT` is the environment variable in the `.env` file. The API documentation can be found at `http://localhost:<APP_PORT>/api-docs`.

10. To stop the application running with Docker Compose, you can run the following command:

```bash
docker-compose down
```

## 4. License

This project is licensed under the Unlicense - see the [LICENSE](LICENSE) file for details.

[![DigitalOcean Referral Badge](https://web-platforms.sfo2.cdn.digitaloceanspaces.com/WWW/Badge%203.svg)](https://www.digitalocean.com/?refcode=2fd2624bd8d3&utm_campaign=Referral_Invite&utm_medium=Referral_Program&utm_source=badge)
