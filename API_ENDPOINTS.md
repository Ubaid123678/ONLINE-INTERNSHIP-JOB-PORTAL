# API Endpoints Documentation

## Base URL
- **Development**: `http://localhost:5000/api`

## Authentication Endpoints

### Register User
- **URL**: `/auth/register`
- **Method**: `POST`
- **Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student" // or "client"
}
```
- **Success Response**: 
  - **Code**: 201
  - **Content**: 
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "profile": {}
  }
}
```
- **Error Responses**:
  - **Code**: 400 - Missing required fields or invalid data
  - **Code**: 409 - Email already registered
  - **Code**: 500 - Server error

### Login User
- **URL**: `/auth/login`
- **Method**: `POST`
- **Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "profile": {}
  }
}
```
- **Error Responses**:
  - **Code**: 400 - Missing email or password
  - **Code**: 401 - Invalid credentials
  - **Code**: 500 - Server error

### Get Current User
- **URL**: `/auth/me`
- **Method**: `GET`
- **Headers**: 
  - `Authorization`: `Bearer {token}`
- **Success Response**: 
  - **Code**: 200
  - **Content**: 
```json
{
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "profile": {}
  }
}
```
- **Error Responses**:
  - **Code**: 401 - Unauthorized (no token or invalid token)
  - **Code**: 404 - User not found
  - **Code**: 500 - Server error

## Configuration

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

### Backend (.env)
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/online_internship_portal
JWT_SECRET=verysecret
ADMIN_REGISTRATION_SECRET=admin-6pZ3!N4sQw
EMAIL_USER=your@gmail.com
EMAIL_PASS=app-password
```

## User Roles
- `student`: Can browse and apply for jobs/internships
- `client`: Can post job/internship opportunities
- `admin`: Has administrative privileges

## Notes
- All authenticated requests require `Authorization: Bearer {token}` header
- Tokens expire after 7 days
- Email addresses are normalized to lowercase
- Passwords must be at least 6 characters long
- Name must be at least 2 characters long
