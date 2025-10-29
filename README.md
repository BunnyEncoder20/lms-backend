# LMS Backend @ Nest.js Project

This document outlines the structure of the LMS backend project, built with Nest.js. It details the modules, controllers, services, and other components to provide a clear understanding of the codebase, particularly for replicating functionalities like the authentication flow.

## Project Structure

The project is organized into several modules, each responsible for a specific set of features.

### Modules

-   **App Module (`src/app.module.ts`):** The root module of the application.
-   **Auth Module (`src/auth/auth.module.ts`):** Handles user authentication and authorization.
-   **Users Module (`src/users/users.module.ts`):** Manages user-related operations.
-   **Prisma Module (`src/prisma/prisma.module.ts`):** Provides the Prisma service for database interactions.

---

### Auth Module

The `Auth` module is responsible for handling user authentication, including registration, login, and token management.

-   **Controllers:**
    -   `auth.controller.ts`: Handles standard email/password authentication.
    -   `passport-auth.controller.ts`: Manages authentication via third-party providers.
-   **Services:**
    -   `auth.service.ts`: Contains the business logic for authentication.
-   **DTOs (Data Transfer Objects):**
    -   `passport-signin.dto.ts`: Defines the shape of the data for signing in.
    -   `passport-signup.dto.ts`: Defines the shape of the data for signing up.
-   **Guards:**
    -   `auth.guard.ts`: A general authentication guard.
    -   `passport.guard.ts`: A guard for passport-based authentication strategies.
    -   `roles.guard.ts`: A guard for role-based access control.
-   **Strategies:**
    -   `jwt.strategy.ts`: Implements JWT-based authentication.
    -   `refreshToken.strategy.ts`: Implements a strategy for refreshing tokens.
-   **Decorators:**
    -   `roles.decorator.ts`: A decorator to assign roles to routes.
    -   `user.decorator.ts`: A decorator to inject the user object into the request.

---

### Users Module

The `Users` module manages user data and interactions.

-   **Controllers:**
    -   `users.controller.ts`: Handles CRUD operations for users.
-   **Services:**
    -   `users.service.ts`: Contains the business logic for user management.
-   **DTOs:**
    -   `create-user.dto.ts`: Defines the data structure for creating a new user.
    -   `update-user.dto.ts`: Defines the data structure for updating a user.
    -   `response-user.dto.ts`: Defines the data structure for user responses.

---

### Common Components

The `common` directory contains shared components used across the application.

-   **Interceptors:**
    -   `response.interceptor.ts`: Intercepts responses to format them consistently.
-   **Constants:**
    -   `app-roles.constant.ts`: Defines application-wide role constants.

---
