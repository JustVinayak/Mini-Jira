# MiniJira

A full-stack task and project management system inspired by tools like Jira. Built to demonstrate production-style backend architecture, secured REST APIs, and a modern React frontend with real-time drag-and-drop.

---
## 🗺️ Overview

Mini-Jira lets teams organize work across projects:

* **Admins** create projects and add team members
* **Members** get assigned tasks within projects they belong to
* Tasks move through a Kanban board (To Do → In Progress → Done) via drag-and-drop
* Users can comment on tasks for collaboration
* Everything is secured with JWT-based, role-based authentication (Admin / Member)

This project was built in phases — backend foundation, business logic + testing, security, and frontend — with each phase committed incrementally rather than as one large drop.

---
## 🚀 Features

1. [x] **Authentication & Security:** JWT login, BCrypt hashing, and role-based permissions (`SecurityConfig` & `@PreAuthorize`).
2. [x] **Project Management:** Complete project lifecycle, ownership tracking, and member assignment.
3. [x] **Task Management:** Full CRUD operations with priority indicators, due dates, filtering, and strict business-rule validation.
4. [x] **Interactive Kanban Board:** Drag-and-drop workflow (To Do, In Progress, Done) featuring optimistic UI updates and auto-rollback on failure.
5. [x] **Comments System:** Threaded task-level collaboration with add and delete capabilities.
6. [x] **Robust Backend:** Global JSON exception handling (400/401/404/409) and deep JUnit/Mockito test coverage.

---

## 🛠️ Tech Stack



| Layer | Technology                                                            |
| :--- |:----------------------------------------------------------------------|
| **Backend** | Java, Spring Boot, Spring Security, Spring Data JPA, Maven, Hibernate |
| **Auth** | JWT (jjwt), BCrypt password hashing, role-based access control        |
| **Database** | MySQL                                                                 |
| **Testing** | JUnit 5, Mockito                                                      |
| **Frontend** | React (Vite), React Router, Axios, `@dnd-kit`                         |
| **Tooling** | Git, GitHub, Postman, ESLint                                          |
| **Deployment** | AWS EC2 *(Phase 5 — in progress)*                                     |


---

## 🏗️ Project Architecture

### Project Structure

The project is split into separate backend and frontend repositories:

```text
D:\PROJECTS\
├── minijira/           # Spring Boot backend
└── minijira-frontend/  # React frontend
```

#### 📁 Backend Layout
```text
src/
├── main/
│   ├── java/com/vinayak/minijira/
│   │   ├── config/       # Configurations (Security, CORS)
│   │   ├── controller/   # REST Controllers (Thin layer)
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entity/       # Database Entities
│   │   ├── enums/        # Global Enums (Priorities, Roles)
│   │   ├── exception/    # Global Error Handling
│   │   ├── repository/   # JPA Repositories
│   │   ├── security/     # JWT & Authentication Filters
│   │   └── service/      # Business Logic (Isolated)
│   └── resources/
│       └── application.properties
└── test/                 # JUnit & Mockito Unit Tests
```

#### 📁 Frontend Layout
```text
src/
├── api/        # Axios configurations & API services
├── components/ # Reusable UI elements & Protected routes
├── context/    # Global Auth State Management
├── pages/      # View pages (Login, Dashboard, Board)
├── App.jsx     # Main Router
├── index.css   # Styles
└── main.jsx    # Application Entry point
```

### Architecture Notes

The backend follows a standard layered architecture:

```text
Controller ➔ Service ➔ Repository ➔ Database
```

* **Separation of Concerns:** Business logic lives exclusively in the service layer. Controllers stay thin, and repositories stay dumb. This maximizes testability using mocked repositories.
* **Database Relations:**
  * **One-to-Many:** Project ➔ Tasks, Task ➔ Comments
  * **Many-to-One:** Task ➔ Assignee, Comment ➔ Author
  * **Many-to-Many:** Project ↔ Members

---
## ⚙️ Getting Started

### Backend

**Requirements:** Java 17+, Maven, MySQL

1. Create the database:

```sql
CREATE DATABASE minijira;
```

2. Configure `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/minijira
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
jwt.secret=<your-base64-encoded-secret>
```

3. Run the app:

```bash
mvn spring-boot:run
```
4. On first run, a default admin user is seeded automatically:

```
Email: admin@minijira.com
Password: admin123
```

Log in with these credentials to get a JWT, then use that token to create additional users/projects through the API. (There is intentionally no open "create admin" endpoint — see Security Notes below for why.)

### Frontend

**Requirements:** Node.js 18+

```bash
cd minijira-frontend
npm install
npm run dev
```

The app runs at `http://localhost:5173` and expects the backend at `http://localhost:8080`.

---

### 📡 Current APIs

---
### API Endpoints

| Method | Endpoint | Access |
| :--- | :--- | :--- |
| POST | `/api/auth/login` | Public |
| GET/POST | `/api/users` | Public* |
| GET/POST | `/api/projects` | Authenticated |
| POST | `/api/projects/{id}/members` | Authenticated |
| DELETE | `/api/projects/{id}` | Admin only |
| GET/POST | `/api/tasks` | Authenticated |
| PATCH | `/api/tasks/{id}/status` | Authenticated |
| PATCH | `/api/tasks/{id}/assign` | Authenticated |
| GET/POST | `/api/comments` | Authenticated |

--- 
### 🧪 Testing

---
### Testing & Quality Assurance

A full Postman collection (including negative/role-denial test cases) is included in the `/postman` directory.

#### 🟢 Backend Unit Tests
Execute the test suite using the Maven wrapper:
```bash
.\mvnw.cmd test
```
**Coverage includes:**
* **Business Logic:** Task business rules, default status assignments, and missing entity edge cases (project/task/user).
* **Comments:** Validation of comment creation and not-found handling.
* **Security:** JWT generation, cryptographic validation, expired token rejection, and tampered payload detection.

#### 🎯 API & Postman Testing
The endpoint validation strategy covers:
* **Authentication:** Login flows and proper token generation.
* **Access Control:** Restricted endpoint access and explicit **ADMIN vs. MEMBER** authorization boundaries.
* **Error Resilience:** Input validation errors and garbage/malformed JWT rejection.
* **Core Features:** End-to-end task mutations, comment tracking, and Kanban status updates.

#### 💻 Frontend End-to-End Testing
The complete user workflow has been verified end-to-end:

```text
Login ➔ JWT Stored ➔ Projects Loaded ➔ Project Opened ➔ Tasks Loaded
                                                            │
                                                            ▼
Status Persisted ➔ Page Refreshed ➔ PATCH to Backend ➔ Task Dragged
```

---
### 🛡️ Security Architecture

---

* **Password Hashing:** Passwords are fully hashed via **BCrypt** before persistence; plain text is never stored.
* **Stateless Auth:** Implements stateless JWT-based authentication (`SessionCreationPolicy.STATELESS`) via a custom `JwtAuthFilter`.
* **Dual-Layer Authorization:** Enforced via URL rules in `SecurityConfig` and method-level `@PreAuthorize` tags (e.g., Admin-only deletions), backed by negative test cases verifying `403 Forbidden` responses.
* **Cryptographic Keys (CVE-2024-31033 Mitigated):** Signing keys are generated as raw, random bytes (`Jwts.SIG.HS256.key().build()`) and stored Base64-encoded. This avoids string-derived key flaws flagged in `CVE-2024-31033`.
* **Dev Environment Note:** The `/api/users` endpoint is temporarily open (`permitAll()`) for local bootstrapping via a startup `DataSeeder`. *Production warning:* Must be restricted to `hasRole('ADMIN')` to eliminate privilege escalation risks.

---
### 🧐 Challenges & Debugging

---

* **The Misleading 403 (Masked 500 Error):**
  * *The Issue:* Spring Security blocked internal `/error` forwards, causing all unhandled runtime exceptions to surface as a generic `403 Forbidden`.
  * *The Fix:* Enabled security debug logging, tracked the filter behavior, and explicitly allowed `/error` paths in the configuration. This exposed the actual underlying issue (a duplicate-email database constraint violation).
* **Seeded Admin Hash Mismatch:**
  * *The Issue:* The initial administrative account failed authentication checks.
  * *The Fix:* Inspected the raw MySQL password column and found the startup seeder executed before BCrypt was fully wired into the user service layer. Remediated by re-generating and comparing fresh cryptographic hashes.

---
### 👨‍💻 Author

---
### **Vinayak Bhatt**

_Computer Science Graduate | Full Stack Developer_

_MiniJira — Full Stack Project Management Application_

---