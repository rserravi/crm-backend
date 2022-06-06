# CRM Ticket System API

This api is a part of create CRM Ticket system with MERN stack from scratch

## How to use

- run 'git clone ...'
- run 'npm start'

Note: Make sure you have nodemon is installed in your system otherwise you can install as a dev dependencies in the project

## API resources

### User API Resources

All the user API router follows '/v1/user/'

| #     | Routers                          | Verbs  | Progress | Is Private | Description                                      |
| ----- | -------------------------------- | ------ | -------- | ---------- | ------------------------------------------------ |
| 1     | '/v1/user/login'                 | POST   | DONE     | No         | Verify user authentication and return JWT        |
| 2     | '/v1/user/reset-password'        | POST   | DONE     | No         | Verify email and email pin to reset the password |
| 3     | '/v1/user/reset-password'        | PATCH  | DONE     | No         | Replace with new password.                       |
| 4     | '/v1/user/logout'                | DELETE | DONE     | Yes        | Delete user accessJWT.                           |
| 5     | '/v1/user/'                      | GET    | DONE     | Yes        | Get users info                                   |
| 6     | '/v1/user/'                      | POST   | DONE     | No         | Create a user                                    |

### Ticket API resources

| #     | Routers                          | Verbs | Progress | Is Private | Description                                       |
| ----- | -------------------------------- | ------ | -------- | ---------- | ------------------------------------------------ |
| 1     | '/v1/ticket'                     | GET    | DONE     |Yes         | Get All ticket for the logined in user           |
| 2     | '/v1/ticket/{id}'                | GET    | DONE     |Yes         | Get a ticket details                             |
| 3     | '/v1/ticket'                     | POST   | DONE     |Yes         | Create a new ticket                              |
| 4     | '/v1/ticket{id}'                 | PUT    | TODO     |Yes         | Update ticket details ie. reply message          |
| 5     | '/v1/ticket/close-ticket/{id}    | PATCH  | TODO     |Yes         | Update ticket status to close                    |
| 6     | '/v1/ticket/{id}                 | DELETE | TODO     |Yes         | Delete a ticket                                  |

### Tokens API resources

All the Tokens API router follows '/v1/tokens'

| #     | Routers                          | Verbs | Progress | Is Private | Description                                      |
| ----- | -------------------------------- | ----- | -------- | ---------- | ------------------------------------------------ |
| 1     | '/v1/tokens'                     | GET   | DONE     |no          | Get a fresh access JWT                           |