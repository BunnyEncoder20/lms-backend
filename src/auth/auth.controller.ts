import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(
      createUserDto.email,
      createUserDto.password,
      createUserDto.name,
      createUserDto.rank,
      createUserDto.role,
    );
  }

  @Post('signin')
  signIn(@Body() data: { email: string; pass: string }) {
    return this.authService.signIn(data.email, data.pass);
  }
}

/*
 - Operational & security checklist (must-do for intranet)
 -   Always use TLS internally (don’t assume intranet is safe).
 -   Keep access tokens short (minutes) and use refresh tokens for UX.
 -   Hash refresh tokens in DB (like passwords) — never store plaintext.
 -   Provide token revocation: maintain refresh token store or session store.
 -   Implement rate limiting on login endpoints (prevent brute force).
 -   Use helmet, input validation (class-validator), and sanitized outputs.
 -   Secure secret management and rotate keys (JWT signing keys).
 -   For multiple services, use JWKS and key rotation for RS256.
 -   Audit/log authentication events and admin actions.
 -   Consider mutual TLS for service-to-service if very sensitive.
 -
 - Which Auth to Pick:
 -   - Multi-application intranet that needs SSO → run Keycloak (OIDC) internally and validate tokens
 in Nest.
 -   - Single application, mostly browser users → Server-side sessions (Redis) + CSRF protection.
 -   - API-first / microservices → JWT bearer with short-lived access tokens + refresh token rotation
 and central auth service.
 -
 - After careful considerations with System (and Sub-system) Architectures,
 - It's BEST to move with Token (Bearer) based authn-atuhz
 -
 - Suggested Implementation Plan (Step-by-Step)
 -   Phase 1: Core Auth Service
 -     NestJS module: AuthModule
 -     Use @nestjs/jwt, bcrypt, Passport, and a DB (Postgres or similar)
 -     Entities: User, RefreshToken (hashed)
 -     Routes:
 -       POST /auth/login
 -       POST /auth/refresh
 -       POST /auth/logout
 -       GET /auth/me
 -     Guard: AuthGuard('jwt') for protected routes.
 -
 -   Phase 2: Role-based Access
 -     Add roles/permissions table or field on User
 -     Implement RolesGuard using @Roles() decorator
 -
 -   Phase 3: Token rotation + blacklisting
 -     Each refresh rotates (old one invalidated)
 -     Optionally, add a revoked_at field to RefreshToken table
 -
 -   Phase 4: Federation-ready
 -     Once ready, integrate Keycloak (or any IdP)
 -     Replace your /login logic with an OIDC flow
 -     Subsystems stay untouched — they still just verify JWTs.
 -
 */
