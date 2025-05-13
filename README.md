# Query Management Application
This is a simple **Query Management Application** where users can create queries. Each query will have a title, description, date, and a status (OPEN, RESOLVED). The application will consist of a simple frontend (UI), a backend API, and a database to persist the query data.

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
Description: Fetch all user form data (questions and answers).
Response:
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
Status codes:
* 200 OK: Data fetched successfully
* 500 Internal Server Error: Unexpected server issue

