# MiniJira

MiniJira is a project management and task tracking application inspired by tools like Jira.

The project is being built using Spring Boot and MySQL, with a RESTful backend architecture. It allows users to create projects, manage project members, and will provide task and collaboration features as development progresses.

---

## 🚀 Features

### Currently Implemented

- User management
- User roles (ADMIN / MEMBER)
- Project creation
- Project ownership
- Add members to projects
- RESTful APIs
- MySQL database integration
- JPA/Hibernate entity relationships
- Service and repository layers
- Postman API collection for testing
- JWT-based stateless authentication
- Role-based access control (Admin / Member)
- BCrypt password hashing

[//]: # (### Coming Soon)

[//]: # ()
[//]: # (- Task management)

[//]: # (- Task assignment)

[//]: # (- Task status management)

[//]: # (- Task priorities)

[//]: # (- Due dates)

[//]: # (- Comments on tasks)

[//]: # (- DTO-based API responses)

[//]: # (- Input validation)

[//]: # (- Global exception handling)

[//]: # (- Password hashing)

[//]: # (- JWT authentication)

[//]: # (- Role-based authorization)

[//]: # (- React frontend)

[//]: # (- Docker support)

---

## 🛠️ Tech Stack

### Backend

- Java
- Spring Boot
- Spring Web
- Spring Data JPA
- Hibernate
- Maven

### Database

- MySQL

### Testing & API Development

- Postman
- IntelliJ IDEA HTTP Client

### Development Tools

- Git
- GitHub
- Lombok

---

## 🏗️ Project Architecture

MiniJira follows a layered architecture:

```text
Client
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
JPA / Hibernate
   ↓
MySQL
```
## Main Layers
```text
controller/
Handles REST API requests

service/
Contains business logic

repository/
Handles database operations

entity/
Contains JPA entities

enums/
Contains application enums
```
---
## ⚙️ Getting Started

### Prerequisites

Make sure you have installed:

* Java 17 or later
* Maven
* MySQL
* IntelliJ IDEA (recommended)
* Git

### **1. Clone the repository**

    Navigate into the project:
    cd mini-jira

### **2. Create the MySQL database**

    Open MySQL Workbench or MySQL Command Line Client and run:
    CREATE DATABASE minijira;

### **3. Configure the database**

    Configure your database connection in:
    src/main/resources/application.properties

    Example:

    spring.application.name=minijira
    spring.datasource.url=jdbc:mysql://localhost:3306/minijira

_Set the following environment variables:_

1. [ ] DB_USERNAME = root
2. [ ] DB_PASSWORD = your_mysql_password

On first run, a default admin user is seeded automatically (admin@minijira.com / admin123). Use this to log in and create additional users.

### **4. Run the application**

    .\mvnw.cmd spring-boot:run

---

### 📡 Current APIs

---
**Users**
* POST /api/users
* GET /api/users
* GET /api/users/{id}

**Projects**
* POST /api/projects
* GET /api/projects
* GET /api/projects/{id}
* POST /api/projects/{id}/members

--- 
### 🧪 API Testing

---
A Postman collection is included in the repository:

_postman/mini-jira.postman_collection.json_

The collection contains requests for testing:

1. User creation
2. User retrieval
3. Project creation
4. Adding project members
5. Project retrieval

Import the collection into Postman and make sure the Spring Boot application is running before sending requests.

---
### 👨‍💻 Author

---
### **Vinayak Bhatt**

_Computer Science Graduate | Full Stack Developer_

---
### ⭐ Project Goal

---
MiniJira is being developed as a full-stack project to demonstrate practical experience with:

1. [x] Java
2. [x] Spring Boot
3. [x] REST APIs
4. [x] Spring Data JPA
5. [x] MySQL
6. [x] React
7. [x] Authentication & Authorization
8. [x] Docker
9. [x] Git & GitHub

The project focuses on clean architecture, RESTful API design, database relationships, and scalable backend development.

---
### 🧐 Challenges & Debugging

---

* Diagnosed a misleading 403 error that was actually masking an internal 500 —
  Spring Security was blocking the internal `/error` forward before Spring Boot
  could render the real exception. Fixed by explicitly permitting `/error` in
  the security config, which surfaced the real root cause (a duplicate DB entry).


* Reviewed and mitigated CVE-2024-31033 in the JWT dependency by generating
  signing keys as random bytes rather than deriving them from a string.