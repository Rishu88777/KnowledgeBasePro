# KnowledgeBasePro Backend (Spring Boot)

This is the backend for the KnowledgeBasePro app, built with Spring Boot and MongoDB.

## Requirements
- Java 17+
- Maven
- MongoDB (running locally or update URI in `application.properties`)

## Setup
1. `cd backend`
2. `mvn clean install`
3. `mvn spring-boot:run`

The backend will start on `http://localhost:8080` by default.

## API
- All endpoints are prefixed with `/api`.
- See `src/main/resources/application.properties` for configuration.

---

**Note:**
- JWT secret and MongoDB URI should be set in `application.properties`.
- This backend is designed to work with the KnowledgeBasePro React frontend. 