# GEMINI.md

## Project Overview

This project is the backend for a Learning Management System (LMS) built with the **Nest.js** framework. It uses **TypeScript** as the primary programming language.

The key technologies and architectural patterns are:

*   **Framework:** Nest.js, a progressive Node.js framework for building efficient, reliable and scalable server-side applications.
*   **Database:** **PostgreSQL** is used as the relational database.
*   **ORM:** **Prisma** is used as the Object-Relational Mapper (ORM) to interact with the database. The database schema is defined in `prisma/schema.prisma`.
*   **Authentication:** Authentication is implemented using **JWTs (JSON Web Tokens)** with Passport.js.
*   **Containerization:** The project is set up to run in **Docker** containers, with services for the backend application, PostgreSQL, and Redis defined in `docker-compose.yml` files.
*   **API:** The API uses global validation pipes and response interceptors for consistent request handling and response formatting.

## Building and Running

### Local Development

To run the application in a local development environment, you can use the following npm scripts defined in `package.json`:

*   **Install dependencies:**
    ```bash
    npm install
    ```
*   **Run the application in watch mode:**
    ```bash
    npm run start:dev
    ```
*   **Build the application:**
    ```bash
    npm run build
    ```
*   **Run the production build:**
    ```bash
    npm run start:prod
    ```

### Docker

The project includes Docker configurations for development and production environments.

*   **Start all services in the background:**
    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
    ```
*   **Stop all services:**
    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml down
    ```

## Testing

The project uses **Jest** for unit and end-to-end testing.

*   **Run unit tests:**
    ```bash
    npm run test
    ```
*   **Run end-to-end tests:**
    ```bash
    npm run test:e2e
    ```

## Development Conventions

*   **Code Style:** The project uses **Prettier** for code formatting and **ESLint** for linting. You can format the code using the following command:
    ```bash
    npm run format
    ```
*   **Database Migrations:** Database schema changes are managed with **Prisma Migrate**. To create a new migration, you can use the Prisma CLI.
*   **API DTOs:** Data Transfer Objects (DTOs) are used to define the shape of API request and response bodies. These DTOs use `class-validator` and `class-transformer` for validation and transformation.
