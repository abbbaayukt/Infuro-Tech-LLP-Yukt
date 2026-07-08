# Ticket: Add JWT Authentication to Tasks API (Task 2 — Enhancement)

## Summary
Add user registration/login and protect the existing `Tasks` endpoints with
JWT-based authentication, so only logged-in users can create, view, update,
or delete tasks.

## Background
Task 1 delivered an open Tasks CRUD API with no access control. This ticket
introduces a `Users` module and an `Auth` module so requests to `/tasks/*`
require a valid JWT issued at login.

## Acceptance Criteria
- [ ] Install auth dependencies: `@nestjs/jwt`, `@nestjs/passport`, `passport`, `passport-jwt`, `bcryptjs` (+ their `@types` as dev deps)
- [ ] `UsersModule` created with an in-memory `UsersService` (no DB needed yet)
  - [ ] Stores `id`, `username`, and a bcrypt-hashed password
  - [ ] Rejects duplicate usernames on registration
- [ ] `AuthModule` created with:
  - [ ] `POST /auth/register` — creates a user (`{ username, password }`)
  - [ ] `POST /auth/login` — validates credentials, returns `{ access_token }`
- [ ] `JwtStrategy` (passport-jwt) validates the bearer token on protected routes
- [ ] `JwtAuthGuard` created and applied to the `TasksController` (`@UseGuards(JwtAuthGuard)`)
- [ ] Unauthenticated requests to any `/tasks/*` route return `401 Unauthorized`
- [ ] Authenticated requests (valid `Authorization: Bearer <token>` header) succeed as before
- [ ] JWT secret and expiry pulled from a constant/config, not hardcoded inline in multiple places
- [ ] `.env` / config note added so the secret can be overridden in real deployments

## Suggested File Additions
```
src/
├── users/
│   ├── user.interface.ts
│   ├── users.service.ts
│   └── users.module.ts
└── auth/
    ├── auth.constants.ts
    ├── auth.service.ts
    ├── auth.controller.ts
    ├── auth.module.ts
    ├── dto/
    │   ├── register.dto.ts
    │   └── login.dto.ts
    ├── strategies/
    │   └── jwt.strategy.ts
    └── guards/
        └── jwt-auth.guard.ts
```

## Manual Test Plan
1. `POST /auth/register` with `{ "username": "alice", "password": "secret123" }` → `201` with user id/username (no password returned)
2. `POST /auth/login` with the same credentials → `200` with `{ access_token }`
3. `GET /tasks` **without** an `Authorization` header → `401 Unauthorized`
4. `GET /tasks` **with** `Authorization: Bearer <access_token>` → `200` (list works as before)
5. Repeat for `POST`, `PATCH`, `DELETE` on `/tasks` — all require the token
6. Try logging in with a wrong password → `401 Unauthorized`
7. Try registering the same username twice → `409 Conflict`

## Learning Notes
- **Guard** (`JwtAuthGuard`) runs before the route handler and can block the request — this is how Nest enforces auth declaratively via `@UseGuards()`.
- **Strategy** (`JwtStrategy`) plugs into Passport and defines *how* a token is validated (where to find it, how to verify its signature, what to attach to `request.user`).
- Passwords are never stored in plain text — only a bcrypt hash is kept.
- The JWT secret must never be hardcoded in a real project; use environment variables (e.g., via `@nestjs/config`).

## Out of Scope (future tickets)
- Persisting users in a real database (currently in-memory, resets on restart)
- Refresh tokens / token revocation
- Role-based access control (e.g., only task owners can edit their own tasks)


## Definition of Done
- Register and login endpoints work and return a valid JWT.
- All Tasks endpoints reject requests without a valid token.
