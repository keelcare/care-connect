# Backend Documentation Request for Frontend Development

Please create comprehensive documentation that will enable the frontend team to integrate with the backend API. This documentation should be created in the backend repository and should include all the information needed to build a fully functional frontend application.

## Required Documentation Files

### 1. API Documentation (`API.md`)

Create a complete API reference guide that includes:

#### General Information
- **Base URL**: What is the backend API base URL?
  - Local development URL (e.g., `http://localhost:3000`)
  - Staging URL (if applicable)
  - Production URL (if applicable)
- **API Version**: Current API version
- **Default Response Format**: JSON structure conventions

#### Authentication & Authorization
- **Authentication Method**: Describe the authentication strategy (JWT, OAuth, session-based, etc.)
- **How to Obtain Tokens**: Step-by-step process for authentication
  - Login endpoint details
  - Registration endpoint details
  - Token refresh mechanism (if applicable)
- **How to Use Tokens**: Where to include tokens in requests (headers, cookies, etc.)
  - Example: `Authorization: Bearer <token>`
- **Token Expiration**: Token lifetime and refresh strategy
- **Protected vs Public Endpoints**: Clear indication of which endpoints require authentication

#### CORS Configuration
- **Allowed Origins**: What frontend origins are allowed?
- **Allowed Methods**: What HTTP methods are supported?
- **Allowed Headers**: What custom headers can be sent?
- **Credentials**: Are credentials (cookies, authorization headers) allowed?

#### All API Endpoints
For **each endpoint**, provide:

1. **Endpoint Path**: Full path (e.g., `/api/users/:id`)
2. **HTTP Method**: GET, POST, PUT, PATCH, DELETE, etc.
3. **Description**: What does this endpoint do?
4. **Authentication Required**: Yes/No
5. **Authorization**: Required roles/permissions (if applicable)
6. **Request Parameters**:
   - Path parameters (e.g., `:id`)
   - Query parameters (e.g., `?page=1&limit=10`)
   - Request headers
7. **Request Body** (for POST/PUT/PATCH):
   - Complete JSON schema
   - Field types
   - Required vs optional fields
   - Validation rules (min/max length, format, etc.)
   - Example request body
8. **Response**:
   - Success status code (e.g., 200, 201)
   - Response body schema
   - Example success response
9. **Error Responses**:
   - Possible error status codes (400, 401, 403, 404, 500, etc.)
   - Error response format
   - Example error responses

**Example Format:**
```markdown
### GET /api/users/:id

**Description**: Retrieve a user profile by ID

**Authentication**: Required

**Path Parameters**:
- `id` (string, required): User UUID

**Query Parameters**: None

**Request Headers**:
- `Authorization: Bearer <token>` (required)

**Response** (200 OK):
```json
{
  "id": "uuid-here",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "PARENT",
  "createdAt": "2025-01-01T00:00:00.000Z"
}
```

**Error Responses**:
- 401 Unauthorized: Missing or invalid token
- 404 Not Found: User not found
```

#### Pagination
- How is pagination implemented?
- Query parameters used (e.g., `page`, `limit`, `offset`)
- Response format for paginated data

#### Filtering & Sorting
- What query parameters are supported for filtering?
- How to sort results?
- Example queries

#### Rate Limiting
- Are there rate limits?
- How are they enforced?
- Response headers or error codes for rate limiting

---

### 2. Data Models & TypeScript Types (`TYPES.md`)

Provide TypeScript interface definitions for all data models used in the API:

#### User Models
```typescript
interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'PARENT' | 'NANNY';
  createdAt: string;
  updatedAt: string;
}

interface UserProfile {
  // ... complete interface
}
```

#### DTOs (Data Transfer Objects)
For each endpoint, provide the TypeScript interfaces for:
- Request DTOs (CreateUserDto, UpdateUserDto, etc.)
- Response DTOs
- Query parameter DTOs

#### Enums
All enums used in the backend (e.g., UserRole, NannyStatus, etc.)

---

### 3. Environment Variables (`ENV_SETUP.md`)

Document all environment variables needed:

#### Backend Environment Variables
List all environment variables the backend uses, so the frontend team understands the backend configuration:
```
DATABASE_URL=
JWT_SECRET=
GOOGLE_MAPS_API_KEY=
```

#### Frontend Environment Variables Needed
Specify what the frontend needs to configure:
```
VITE_API_BASE_URL=http://localhost:3000
VITE_GOOGLE_MAPS_API_KEY=your-key-here
```

---

### 4. Setup & Running Instructions (`SETUP.md`)

Provide clear instructions for:

#### Prerequisites
- Node.js version required
- PostgreSQL version
- Docker (if used)
- Any other dependencies

#### Local Development Setup
```bash
# Step-by-step commands to:
# 1. Clone the repository
# 2. Install dependencies
# 3. Set up the database
# 4. Run migrations
# 5. Seed the database (if applicable)
# 6. Start the development server
```

#### Database Setup
- How to create the database
- How to run migrations
- How to seed test data
- Database connection details

#### Running the Backend
- Development mode command
- Production mode command
- Default port
- Health check endpoint

---

### 5. Error Handling Guide (`ERROR_HANDLING.md`)

Document the error response format and common errors:

#### Standard Error Response Format
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "details": [
    {
      "field": "email",
      "message": "Email must be a valid email address"
    }
  ]
}
```

#### Common Error Codes
- 400: Bad Request - What causes this?
- 401: Unauthorized - What causes this?
- 403: Forbidden - What causes this?
- 404: Not Found - What causes this?
- 409: Conflict - What causes this?
- 422: Unprocessable Entity - What causes this?
- 500: Internal Server Error - How should frontend handle this?

---

### 6. Feature-Specific Documentation

For each major feature, provide:

#### User & Profile Management
- Available endpoints
- User roles and permissions
- Profile fields and validation rules

#### Location & Geo Matching
- How location data is stored
- Geo-matching algorithm details
- Required Google Maps API setup
- Coordinate format (latitude, longitude)

#### [Any Other Features]
- Document each feature's API surface

---

### 7. Testing & Development (`TESTING.md`)

Provide information about:

#### Test Accounts
- Sample user credentials for testing
- Different user roles available

#### Seed Data
- What test data is available?
- How to reset/reseed the database

#### API Testing
- Postman collection (if available)
- Example cURL commands for key endpoints

---

### 8. Deployment Information (`DEPLOYMENT.md`)

Document:

#### Production URLs
- API base URL
- WebSocket URL (if applicable)

#### Environment Differences
- What changes between development and production?

#### Health & Status Endpoints
- Health check endpoint
- Status/version endpoint

---

## Deliverables Checklist

Please create the following files in the backend repository:

- [ ] `docs/API.md` - Complete API reference
- [ ] `docs/TYPES.md` - TypeScript type definitions
- [ ] `docs/ENV_SETUP.md` - Environment configuration
- [ ] `docs/SETUP.md` - Setup and running instructions
- [ ] `docs/ERROR_HANDLING.md` - Error handling guide
- [ ] `docs/TESTING.md` - Testing guide with test data
- [ ] `docs/DEPLOYMENT.md` - Deployment information
- [ ] `docs/FRONTEND_INTEGRATION.md` - Quick start guide for frontend developers

## Additional Requests

1. **OpenAPI/Swagger**: If possible, generate Swagger documentation accessible at `/api/docs`
2. **Postman Collection**: Export a Postman collection with example requests for all endpoints
3. **Example Requests**: Provide working cURL or HTTP examples for each endpoint
4. **Changelog**: Document any breaking changes or version updates

## Format

Please use clear markdown formatting with:
- Code blocks with syntax highlighting
- Tables for structured data
- Clear headings and subheadings
- Examples for every concept
- Links between related documentation sections

---

**Note**: This documentation will be used by the frontend team to build a complete client application, so please be as detailed and accurate as possible. Include real examples from your codebase rather than placeholders.
