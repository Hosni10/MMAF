# Authentication API Documentation

This document provides details about the API endpoints for user authentication and management.

---

## User Routes

### 1. User Registration

- **Endpoint:** `/register`
- **Method:** `POST`
- **Description:** Registers a new user in the system.
- **Request Body:**
  ```json
  {
    "name": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - `201 Created`: User registered successfully.
  - `400 Bad Request`: Invalid input or user already exists.

### 2. User Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Description:** Authenticates a user and returns a session token.
- **Request Body:**
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```
- **Response:**
  - `200 OK`: Login successful, returns a token.
  - `401 Unauthorized`: Invalid credentials.

### 3. User Logout

- **Endpoint:** `/logout`
- **Method:** `POST`
- **Description:** Logs out the currently authenticated user.
- **Authentication:** Required.

### 4. Forget Password

- **Endpoint:** `/forgetPassword` or `/forget-Password`
- **Method:** `POST`
- **Description:** Sends a password reset link to the user's email.
- **Request Body:**
  ```json
  {
    "email": "string"
  }
  ```

### 5. Reset Password

- **Endpoint:** `/resetPassword/:token` or `/reset-password`
- **Method:** `POST`
- **Description:** Resets the user's password using a token.
- **URL Parameters:**
  - `token` (for `/resetPassword/:token`): The password reset token from the email.
- **Request Body:**
  ```json
  {
    "newPassword": "string"
  }
  ```

### 6. Get Single User

- **Endpoint:** `/getUser/:id`
- **Method:** `GET`
- **Description:** Retrieves details of a specific user.
- **URL Parameters:**
  - `id`: The ID of the user.

### 7. Update User Profile

- **Endpoint:** `/updateProfile/:id`
- **Method:** `PUT`
- **Description:** Updates the profile of a user, including profile image.
- **URL Parameters:**
  - `id`: The ID of the user.
- **Request Body:** `multipart/form-data` with an `image` field.

### 8. Get All Users

- **Endpoint:** `/getAll`
- **Method:** `GET`
- **Description:** Retrieves a list of all users.

### 9. Get Dashboard Data

- **Endpoint:** `/getDashboard`
- **Method:** `GET`
- **Description:** Retrieves dashboard-related length data.

### 10. Verify User Token

- **Endpoint:** `/verify`
- **Method:** `GET`
- **Description:** Verifies a user token.

---

## Authorized Routes

These endpoints require authentication and proper authorization.

### 1. Add User

- **Endpoint:** `/addUser`
- **Method:** `POST`
- **Description:** Adds a new user (authorized action).
- **Authentication:** Required (`isAuth` middleware with `addUsersEndpoints.ADD_USER` permission).
- **Request Body:** `multipart/form-data` with user details and an `image` field.

### 2. Update User

- **Endpoint:** `/update/:id`
- **Method:** `PUT`
- **Description:** Updates a user's information (authorized action).
- **Authentication:** Required (`isAuth` middleware with `addUsersEndpoints.UPDATE_USER` permission).
- **URL Parameters:**
  - `id`: The ID of the user to update.
- **Request Body:** `multipart/form-data` with user details and an `image` field.

### 3. Delete User

- **Endpoint:** `/:id`
- **Method:** `DELETE`
- **Description:** Deletes a user (authorized action).
- **Authentication:** Required (`isAuth` middleware with `addUsersEndpoints.DELETE_USER` permission).
- **URL Parameters:**
  - `id`: The ID of the user to delete. 