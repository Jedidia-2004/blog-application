# MEVN Blog Application

## App Description

A full-stack blog application built with MongoDB, Express, Vue, and Node.js. Users can register, log in, read posts, and manage their own blog posts. An admin can also delete any user's post.

## Running the Application

Start the backend:

```bash
cd server
npm run dev
```

Start the Vue client:

```bash
cd client
npm install
npm run dev
```

## Test Credentials

### Regular User

```text
Email: guest@mail.com
Username: guest_user
Password: guest12345
```

### Admin User

```text
Email: 2guest@mail.com
Username: 2guest_user
Password: 2guest12345
```

## API Endpoints

Base URL: `http://localhost:4000`

### Authentication

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Log in and receive a token |
| `GET` | `/api/auth/me` | View the logged-in user |

### Blog Posts

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| `GET` | `/api/posts` | Public | View all posts |
| `GET` | `/api/posts/:id` | Public | View one post |
| `POST` | `/api/posts` | Logged-in user | Create a post |
| `PUT/PATCH` | `/api/posts/:id` | Post owner | Update a post |
| `DELETE` | `/api/posts/:id` | Post owner or admin | Delete a post |

### Checking API

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/health` | Check whether the API is running |

Protected endpoints require the login token as a Bearer token:
S
