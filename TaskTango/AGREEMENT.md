# Frontend and Backend Agreement for Task Tango Website

## 1. Objective
This agreement establishes the communication and integration standards between the frontend (React) and backend (Spring Boot, MySQL) teams for the Task Tango Website. It outlines API structure, data formats, error handling, authentication, and state management to ensure smooth collaboration.

---

## 2. Frontend Responsibilities
- **User Interface (UI)**: Build the UI with React, ensuring it is responsive and accessible across devices.
- **State Management**: Use React's state management system (e.g., hooks, context API) or Redux to manage client-side state.
- **API Consumption**: Fetch data from the backend using the standardized API endpoints and handle responses correctly (including error handling).
- **Form Validation**: Perform basic client-side validation before sending any data to the backend.
- **Authentication**: Ensure secure storage of JWT tokens (in local storage or cookies) and attach them to API requests when necessary.
- **Routing**: Manage client-side routing using React Router, ensuring protected routes are accessible only to authenticated users.

---

## 3. Backend Responsibilities
- **API Development**: Provide a RESTful API that enables CRUD operations for tasks, users, and any other necessary entities.
- **Data Persistence**: Use MyBatis to interact with a MySQL database for storing task data, user data, etc.
- **Authentication and Authorization**: Implement JWT-based authentication and role-based access control for users. Tokens should be valid for a specific duration and refreshable.
- **Business Logic**: All business rules (e.g., task assignment, deadline logic) should be implemented in the backend.
- **Error Handling**: Provide standardized error responses with appropriate HTTP status codes and messages.
- **Documentation**: Keep API documentation (e.g., Swagger or Postman collection) up-to-date for frontend use.

---

## 4. API Specifications
- **Base URL**: `https://v1`

### 4.1. Authentication
- **Login**
    - Method: `POST /auth/login`
    - Request Body:
      ```json
      {
        "username": "string",
        "password": "string"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Login successful",
        "data": {
          "id": "int",
          "token": "string"
        }
      }
      ```
      - HTTP Status: 200 OK for successful login, 401 Unauthorized for failed login.

- **Register**
    - Method: `POST /auth/register`
    - Request Body:
      ```json
      {
        "username": "string",
        "password": "string",
        "email": "string",
        "phone": "string",
        "userType": "string"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "User registered successfully",
        "data": {
          "userId": "int",
          "username": "string",
          "password": "string",
          "email": "string",
          "phone": "string",
          "userType": "string"
        }
      }
      ```
      - HTTP Status: 201 Created on success, 400 Bad Request on validation error.

- **DELETE**
    - Method: `DELETE /auth/delete`
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Account deleted successfully",
        "data": null
      }
      ```
      - HTTP Status: 201 Created on success, 400 Bad Request on validation error.

### 4.2. Board Management
- **Get Board by ID**
    - Method: `GET /boards/{boardId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
  - Response:
    ```json
    {
      "code": 1,
      "msg": "Board found",
      "data": {
          "boardId": "int",
          "title": "string",
          "stages": [
            {
              "stageId": "int",
              "title": "string",
              "description": "string",
              "items": [
                {
                  "itemId": "int",
                  "title": "string",
                  "description": "string",
                  "labels": [
                    {
                      "labelId": "int",
                      "name": "string",
                      "color": "string"
                    }
                  ],
                  "dueDate": "LocalDateTime"
                }
              ]
            }
          ]
        }
    }
    ```
    - HTTP Status: 200 OK if board found, 404 Not Found if the board does not exist.

- **Get All Boards**
    - Method: `GET /boards`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Boards retrieved",
        "data": {
            "boards": [
              {
                "boardId": "int",
                "title": "string",
                "stages": [
                  {
                    "stageId": "int",
                    "title": "string",
                    "description": "string",
                    "items": [
                      {
                        "itemId": "int",
                        "title": "string",
                        "description": "string",
                        "labels": [
                          {
                            "labelId": "int",
                            "name": "string",
                            "color": "string"
                          }
                        ],
                        "dueDate": "LocalDateTime"
                      }
                    ]
                  }
                ]
              }
            ]
        }
      }
      ```
        - HTTP Status: 200 OK if boards found, 404 Not Found if no boards exist

- **Create a New Board**
    - Method: `POST /boards`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "title": "string"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Board created successfully",
        "data": {
          "boardId": "int",
          "title": "string"
        }
      }
      ```
      - HTTP Status: 201 Created on success, 400 Bad Request on validation failure.

- **Update Board Name**
    - Method: `PUT /boards/{boardId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "title": "string"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Board updated successfully",
        "data": {
          "boardId": "int",
          "title": "string"
        }
      }
      ```
        - HTTP Status: 200 OK on success, 404 Not Found if board does not exist.

- **Delete Board**
    - Method: `DELETE /boards/{boardId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response: HTTP Status 204 No Content on successful deletion, 400 Bad Request if Tasks still in Board


### 4.3. Task Management
- **Get Task by ID**
    - Method: `GET /tasks/{taskId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Task found",
        "data": {
            "itemId": "int",
            "title": "string",
            "description": "string",
            "stageId": "int",
            "labels": [
              {
                "labelId": "int",
                "name": "string",
                "color": "string"
              }
            ],
            "dueDate": "LocalDateTime"
        }
      }
      ```
      - HTTP Status: 200 OK if task found, 404 Not Found if the task does not exist.

- **Get All Tasks**
    - Method: `GET /tasks`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Tasks retrieved",
        "data": {
            "items": [
              {
                "itemId": "int",
                "title": "string",
                "description": "string",
                "stageId": "int",
                "labels": [
                  {
                    "labelId": "int",
                    "name": "string",
                    "color": "string"
                  }
                ],
                "dueDate": "LocalDateTime"
              }
            ]
        }
      }
      ```
        - HTTP Status: 200 OK if tasks found, 404 Not Found if no tasks exist.

- **Create a New Task**
    - Method: `POST /tasks`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "title": "string",
        "description": "string",
        "stageId": "int",
        "labels": [
          {
            "labelId": "int",
            "name": "string",
            "color": "string"
          }
        ],
        "dueDate": "LocalDateTime"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Task created successfully",
        "data": {
          "itemId": "int",
          "title": "string",
          "description": "string",
          "stageId": "int",
          "dueDate": "LocalDateTime"
        }
      }
      ```
      - HTTP Status: 201 Created on success, 400 Bad Request on validation failure.

- **Update Task Body**
    - Method: `PUT /tasks/{taskId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "title": "string",
        "description": "string",
        "dueDate": "LocalDateTime"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Task updated successfully",
        "data": {
            "itemId": "int",
            "title": "string",
            "description": "string",
            "stageId": "int",
            "labels": [
              {
                "labelId": "int",
                "name": "string",
                "color": "string"
              }
            ],
            "dueDate": "LocalDateTime"
          }
      }
      ```
      - HTTP Status: 200 OK on success, 404 Not Found if task does not exist.

- **Delete Task**
    - Method: `DELETE /tasks/{taskId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response: HTTP Status 204 No Content on successful deletion.

### 4.4 Label Management
- **Get Label By ID**
    - Method: `GET /labels/{labelId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Label found",
        "data": {
            "labelId": "int",
            "name": "string",
            "color": "string"
        }
      }
      ```
      - HTTP Status: 200 OK if label found, 404 Not Found if the label does not exist.


- **Get All Labels**
    - Method: `GET /labels`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Labels retrieved",
        "data": {
            "labels": [
              {
                "labelId": "int",
                "name": "string",
                "color": "string"
              }
            ]
        }
      }
      ```
        - HTTP Status: 200 OK if labels found, 404 Not Found if no labels exist.

- **Create a New Label**
    - Method: `POST /labels`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "name": "string",
        "color": "string"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Label created successfully",
        "data": {
            "labelId": "int",
            "name": "string",
            "color": "string"
        }
      }
      ```
      - HTTP Status: 201 Created on success, 400 Bad Request on validation failure.

- **Update Label**
    - Method: `PUT /labels/{labelId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
       "name": "string",
       "color": "string"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Label updated successfully",
        "data": {
            "labelId": "int",
            "name": "string",
            "color": "string"
        }
      }
      ```
      - HTTP Status: 200 OK on success, 404 Not Found if label does not exist.

- **Add Labels to Task**
    - Method: `POST /labels/addlabels/{itemId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "labels": [
          {
            "labelId": "int",
            "name": "string",
            "color": "string"
          }
        ]
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Label added to {itemId} successfully",
        "data": {
            "itemId": "int",
            "title": "string",
            "description": "string",
            "stageId": "int",
            "labels": [
              {
                "labelId": "int",
                "name": "string",
                "color": "string"
              }
            ],
            "dueDate": "LocalDateTime"
          }
      }
      ```
        - HTTP Status: 200 OK on success, 404 Not Found if task does not exist.

- **Remove Labels from Task**
    - Method: `DELETE /labels/removelabels/{itemId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "labels": [
          {
            "labelId": "int",
            "name": "string",
            "color": "string"
          }
        ]
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Label removed from {itemId} successfully",
        "data": {
            "itemId": "int",
            "title": "string",
            "description": "string",
            "stageId": "int",
            "labels": [
              {
                "labelId": "int",
                "name": "string",
                "color": "string"
              }
            ],
            "dueDate": "LocalDateTime"
          }
      }
      ```
        - HTTP Status: 200 OK on success, 404 Not Found if task does not exist.


- **Delete Label**
    - Method: `DELETE /labels/{labelId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response: HTTP Status 204 No Content on successful deletion.

### 4.5 Stage Management
- **Get Stage By ID**
    - Method: `GET /stages/{stageId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Stage found",
        "data": {
            "stageId": "int",
            "boardId": "int",
            "title": "string",
            "description": "string",
            "items": [
              {
                "itemId": "int",
                "title": "string",
                "description": "string",
                "labels": [
                  {
                    "labelId": "int",
                    "name": "string",
                    "color": "string"
                  }
                ],
                "dueDate": "LocalDateTime"
              }
            ]
        }
      }
      ```
      - HTTP Status: 200 OK if stage found, 404 Not Found if the stage does not exist.

- **Get All Stages**
    - Method: `GET /stages`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Stages retrieved",
        "data": {
            "stages": [
              {
                "stageId": "int",
                "boardId": "int",
                "title": "string",
                "description": "string",
                "items": [
                  {
                    "itemId": "int",
                    "title": "string",
                    "description": "string",
                    "labels": [
                      {
                        "labelId": "int",
                        "name": "string",
                        "color": "string"
                      }
                    ],
                    "dueDate": "LocalDateTime"
                  }
                ]
              }
            ]
        }
      }
      ```
        - HTTP Status: 200 OK if stages found, 404 Not Found if no stages exist.


- **Create a New Stage**
    - Method: `POST /stages`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "boardId": "int",
        "title": "string",
        "description": "string"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Stage created successfully",
        "data": {
            "stageId": "int",
            "boardId": "int",
            "title": "string",
            "description": "string"
        }
      }
      ```
      - HTTP Status: 201 Created on success, 400 Bad Request on validation failure.

- **Update Stage Body**
    - Method: `PUT /stages/{stageId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "title": "string",
        "description": "string"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Stage updated successfully",
        "data": {
            "stageId": "int",
            "boardId": "int",
            "title": "string",
            "description": "string",
            "items": [
              {
                "itemId": "int",
                "title": "string",
                "description": "string",
                "labels": [
                  {
                    "labelId": "int",
                    "name": "string",
                    "color": "string"
                  }
                ],
                "dueDate": "LocalDateTime"
              }
            ]
        }
      }
      ```
      - HTTP Status: 200 OK on success, 404 Not Found if stage does not exist.

- **Change Stage of Task**
    - Method: `PUT /stages/change/{itemId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Request Body:
      ```json
      {
        "stageId": "int"
      }
      ```
    - Response:
      ```json
      {
        "code": 1,
        "msg": "Stage of {itemId} changed successfully",
        "data": {
            "itemId": "int",
            "title": "string",
            "description": "string",
            "stageId": "int",
            "labels": [
              {
                "labelId": "int",
                "name": "string",
                "color": "string"
              }
            ],
            "dueDate": "LocalDateTime"
          }
      }
      ```
        - HTTP Status: 200 OK on success, 404 Not Found if task does not exist.

- **Delete Stage**
    - Method: `DELETE /stages/{stageId}`
    - Request Header:
      ```
      Authorization: Bearer <JWT token>
      ```
    - Response: HTTP Status 204 No Content on successful deletion, 400 Bad Request if Tasks still in Stage

---

## 5. Data Exchange Format
- All data between frontend and backend should be exchanged in **JSON** format.
- Date fields should follow the **ISO 8601** format (e.g., `"2024-10-10T12:00:00Z"`).

---

## 6. Authentication and Authorization
- Backend will provide **JWT tokens** after successful login or registration.
- Frontend must include the JWT token in the `Authorization` header for all protected routes.
- Tokens should be stored securely on the client side (local storage or HTTP-only cookies).
- Tokens should have an expiration time, and the frontend will handle token refreshes or reauthentication if needed.

---

## 7. Error Handling
- **Frontend**: Handle errors returned by the API (e.g., `400 Bad Request`, `401 Unauthorized`, `404 Not Found`, `500 Internal Server Error`). Display appropriate error messages to users based on the `msg` field in the response.
- **Backend**: Return errors in the following structure:
    ```json
    {
      "code": 0,
      "msg": "string",
      "data": null
    }
    ```

- HTTP Status Codes:
    - **200 OK**: Successful requests
    - **201 Created**: Successful resource creation
    - **400 Bad Request**: Validation or input errors
    - **401 Unauthorized**: Missing or invalid authentication token
    - **404 Not Found**: Requested resource not found
    - **500 Internal Server Error**: Unexpected server errors

---

## 8. Communication and Testing
- **Backend Documentation**: API documentation must be provided using **Swagger** or **Postman** collection.
- **Testing**: Both teams will use a shared Postman collection for testing API endpoints.
- **Error Logging**: Frontend will log errors in the browser console, and the backend will use a logging framework (e.g., Logback) for server-side logs.
- **Regular Updates**: The backend team must notify the frontend team of any breaking changes to the API at least 2 days in advance.

---
