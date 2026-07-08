# Ticket: Build a Basic NestJS Tasks CRUD API (Beginner Onboarding)

**Type:** Task / Onboarding
**Priority:** Medium
**Assignee:** [Beginner Developer]
**Labels:** nestjs, backend, onboarding

## Summary
Set up a NestJS project and implement a simple `Tasks` REST API to learn the
framework's core building blocks: Modules, Controllers, Services, and DTOs.
A working reference implementation is attached — use it to check your own
work, or to run first and understand the pieces before rebuilding it yourself.

## Background
NestJS is a Node.js framework for building server-side apps using TypeScript
and an Angular-like architecture (decorators, dependency injection, modules).
This ticket is the standard "first project" for anyone new to the framework.

## Acceptance Criteria
- [ ] NestJS CLI installed (`npm i -g @nestjs/cli`)
- [ ] New project created (`nest new project-name`)
- [ ] `TasksModule`, `TasksController`, `TasksService` generated
- [ ] `GET /tasks` — returns list of tasks
- [ ] `GET /tasks/:id` — returns a single task, 404 if not found
- [ ] `POST /tasks` — creates a task from request body
- [ ] `PATCH /tasks/:id` — updates a task
- [ ] `DELETE /tasks/:id` — deletes a task
- [ ] All endpoints manually tested (curl or Postman)
- [ ] App runs cleanly with `npm run start:dev`

## Attached Reference App
A tested, working implementation is included (`src/` folder). It was built
and verified end to end:
1. `npm install` — dependencies resolved successfully
2. `nest build` — compiled with no errors
3. App started on port 3000
4. Full CRUD lifecycle tested via curl:
   - `POST /tasks` → created task `{id:1, title:"Learn NestJS", completed:false}`
   - `GET /tasks` → returned the created task
   - `PATCH /tasks/1` → set `completed:true`
   - `GET /tasks/1` → confirmed the update
   - `DELETE /tasks/1` → removed the task
   - `GET /tasks` → confirmed empty list

## How to Use This Ticket
1. Read `README.md` in the attached project for setup steps.
2. Run the reference app yourself first (`npm install && npm run start:dev`).
3. Test each endpoint with curl or Postman to see expected behavior.
4. Delete the `tasks/` folder and rebuild it yourself using `nest g resource tasks`
   or manually, without looking at the reference, to reinforce learning.
5. Compare your version against the reference when done.

## Learning Notes
- **Module** groups a feature's pieces together and is imported into `AppModule`.
- **Controller** defines routes and only handles HTTP concerns (params, body, status codes).
- **Service** holds the actual logic/data; it's `@Injectable()` so Nest can inject it into the controller.
- **DTO** (Data Transfer Object) shapes what a request body should look like.

## Estimated Effort
1–2 hours (setup + build + test)

## Definition of Done
- App runs locally without errors.
- All 5 endpoints work as described and were manually verified.
- Developer can explain, in their own words, what a Module/Controller/Service does.
