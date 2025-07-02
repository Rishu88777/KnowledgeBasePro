# Knowledge Base Backend

A Spring Boot backend for the Knowledge Base Platform with MongoDB integration.

## Prerequisites

- Java 17 or higher
- Maven 3.6+
- MongoDB running on localhost:27017

## Setup Instructions

1. **Start MongoDB**
   ```bash
   # Make sure MongoDB is running on localhost:27017
   mongod --dbpath /path/to/your/db
   ```

2. **Build and Run**
   ```bash
   cd backend
   mvn clean install
   mvn spring-boot:run
   ```

3. **API will be available at**: `http://localhost:8080`

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/email/{email}` - Get user by email
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Documents
- `GET /api/documents` - Get all documents (with optional userId param for filtering)
- `GET /api/documents/{id}` - Get document by ID (with userId param for permission check)
- `GET /api/documents/author/{authorId}` - Get documents by author
- `GET /api/documents/public` - Get public documents
- `GET /api/documents/search?q={query}` - Search documents
- `POST /api/documents` - Create new document (requires authorId param)
- `PUT /api/documents/{id}` - Update document (requires userId param)
- `DELETE /api/documents/{id}` - Delete document (requires userId param)
- `POST /api/documents/{id}/share` - Share document (requires ownerId param)
- `DELETE /api/documents/{id}/share/{userId}` - Remove document access (requires ownerId param)

## Database Schema

### Users Collection
```json
{
  "_id": "ObjectId",
  "email": "string (unique)",
  "name": "string",
  "avatar": "string (optional)",
  "createdAt": "LocalDateTime"
}
```

### Documents Collection
```json
{
  "_id": "ObjectId",
  "title": "string (text indexed)",
  "content": "string (text indexed)",
  "authorId": "string",
  "author": "User object",
  "isPublic": "boolean",
  "sharedWith": [
    {
      "userId": "string",
      "user": "User object",
      "permission": "view|edit",
      "grantedAt": "LocalDateTime"
    }
  ],
  "mentions": ["string array of user IDs"],
  "createdAt": "LocalDateTime",
  "updatedAt": "LocalDateTime",
  "versions": [
    {
      "id": "string",
      "content": "string",
      "title": "string",
      "authorId": "string",
      "author": "User object",
      "createdAt": "LocalDateTime",
      "changeDescription": "string"
    }
  ]
}
```

## Features Implemented

- ✅ Document CRUD operations
- ✅ User management
- ✅ Document sharing with permissions (view/edit)
- ✅ Version control and history
- ✅ Search functionality
- ✅ Public/private document visibility
- ✅ Permission-based access control
- ✅ CORS configuration for frontend integration

## Testing

Run tests with:
```bash
mvn test
```

## Development

The application uses Spring Boot DevTools for hot reloading during development.