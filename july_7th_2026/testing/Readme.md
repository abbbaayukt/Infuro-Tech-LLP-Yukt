# Task Manager Backend

Complete Postman Test Suite for the NestJS Task Manager Backend.

---

# Features Covered

- Authentication
- JWT
- RBAC
- Permission Guard
- Tenant Guard
- Multi Tenancy
- Cache Validation
- CRUD
- Validation
- Negative Testing
- Performance Testing

---

# Import Order

1. Import Environment
2. Import all Collections
3. Select Environment
4. Run Collections

---

# Environment Variables

| Variable | Description |
|-----------|-------------|
| baseUrl | API URL |
| adminToken | Admin JWT |
| userToken | User JWT |
| tenantId | Tenant ID |
| roleId | Role ID |
| taskId | Task ID |
| ticketId | Ticket ID |

Most variables are automatically populated.

---

# Execution Order

00 Setup

↓

01 Authentication

↓

02 Tenant

↓

03 Roles

↓

04 Users

↓

05 Tasks

↓

06 Tickets

↓

07 Negative Testing

↓

08 Cache Validation

↓

09 Multi Tenant

↓

10 End To End

↓

11 Performance

---

# Automation

Every collection automatically stores IDs.

No manual copy-paste required.

---

# Newman

Run everything

newman run "10 - End To End.postman_collection.json" \
-e TaskManager.postman_environment.json

---

# Expected Status Codes

200 OK

201 Created

400 Validation Error

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

---

# Tested Features

✔ JWT

✔ Tenant Guard

✔ Permission Guard

✔ Role Cache

✔ Tenant Cache

✔ CRUD

✔ Validation

✔ Multi Tenant Isolation

✔ Cache Refresh

✔ Cache Miss

✔ Cache Hit

✔ Login Lock

✔ Role Change

✔ Role Permission Refresh

✔ User CRUD

✔ Task CRUD

✔ Ticket CRUD

✔ Swagger Compatible
