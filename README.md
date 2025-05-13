# Query Management Application
This is a simple **Query Management Application** where users can create queries. Each query has a title, description, date, and a status (OPEN, RESOLVED). The application consists of a simple frontend (UI), a backend API, and a database to persist the query data.

Queries in the context of an EDC (electronic data capture) system help identify and flag incorrect data entries for patients and alert effected data managers/ users when a query needs to be resolved.

## Getting Started
Run the following to set up the the backend
- `cd query-management-application-be`
- `docker-compose up`
- `npm run migrate`
- `npm run seed`
- `cd ..`

After setting up the backend, run the following to set up the front end
- `cd query-management-application-be`
- `npm start`

## Tech stack
* [Node](https://nodejs.org/en/)
* [Typescript](www.google.com)
* [Fastify](https://www.fastify.io/)
* [Prisma ORM](https://www.prisma.io/)
* [PostgreSQL](https://www.postgresql.org/)
* [Docker and Compose](https://www.docker.com/)

## API Documentation

### GET /form-data
- **Description**: Fetch all user form data (questions and answers).

- **Response**:
    ```json
    {
        "data": {
            "formData": [
                {
                    "id": "uuid",
                    "question": "What is your name?",
                    "answer": "Alice"
                }
            ]
        }
    }
    ```

- **Status codes**:
    * 200 OK: Data fetched successfully
    * 500 Internal Server Error: Unexpected server issue

### GET /query
- **Description**: Fetch all queries related to form data.

- **Response**:
    ```json
    {
        "data": {
            "query": [
                {
                    "id": "string",
                    "title": "string",
                    "description": "string",
                    "status": "string",
                    "formDataId": "string",
                    "createdAt": "Date",
                    "updatedAt": "Date"
                }
            ]
        }
    }
    ```

- **Status codes**:
    * 200 OK: Data fetched successfully
    * 500 Internal Server Error: Unexpected server issue

### POST /query
- **Description**: Create a new query for a form data entry.

- **Request**:
    ```json
    {
        "data": {
            "query": [
                {
                    "title": "string",
                    "description": "string",
                    "status": "string",
                    "formDataId": "string",
                    "createdAt": "Date",
                }
            ]
        }
    }
    ```

- **Response**:
    ```json
    {
        {
            "message": "Query created successfully",
                "data": {
                    "id": "string"
                }
        }
    }
    ```

- **Status codes**:
    * 200 OK: Data fetched successfully
    * 400 Bad Request: Invalid payload
    * 500 Internal Server Error: Unexpected server issue

### PUT /query:id
- **Description**: Create a new query for a form data entry.

- **Request**:
    ```json
    {
        "status": "Resolved"
    }
    ```

- **Response**:
    ```json
    {
        "message": "Query updated successfully"
    }
    ```

- **Status codes**:
    * 200 OK: Update successful
    * 404 Not Found: Query ID not found
    * 400 Bad Request: Malformed request

### DELETE /query
- **Description**:  DELETE an existing query for a form data entry.

- **Response**:
    ```json
    {
        "data": {
            "message": "Query deleted successfully"
        }
    }
    ```

- **Status codes**:
    * 200 OK: Query deleted successfully
    * 500 Internal Server Error: Unexpected server issue