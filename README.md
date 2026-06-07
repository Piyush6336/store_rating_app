# Store Rating Web App

Full-stack store rating application built with React, Express.js, Node.js, and PostgreSQL.

## Features

- Single login system for admin, normal user, and store owner roles.
- Normal user signup.
- Admin dashboard with user, store, and rating counts.
- Admin can add users and stores.
- Admin can filter and sort users and stores.
- Normal users can search stores and submit or update ratings from 1 to 5.
- Store owners can view users who rated their store and see the average rating.
- Password update for logged-in users.

## Setup

### Database

Create a PostgreSQL database:

```sql
CREATE DATABASE store_rating_app;
```

Run these files in order:

```bash
psql -U postgres -d store_rating_app -f backend/db/schema.sql
psql -U postgres -d store_rating_app -f backend/db/seed.sql
```

Seed login:

- Admin: `admin@gmail.com`
- Store owner: `owner@gmail.com`
- Password for both: `Password@123`

### Backend

```bash
cd backend
copy .env.example .env
npm install
npm run dev
```

Update `.env` if your PostgreSQL username, password, or database name is different.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Validation Rules

- Name: 20 to 60 characters.
- Address: required and maximum 400 characters.
- Password: 8 to 16 characters, at least one uppercase letter and one special character.
- Email: standard email format.
