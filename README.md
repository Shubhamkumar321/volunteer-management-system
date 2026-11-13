# VolunteerConnect

VolunteerConnect is a full-stack volunteer and event management platform. Volunteers can find events, register, and manage their profiles. Organizers can submit events for review, and administrators can moderate events, view reports, and export report data.

## Features

- Account registration with email OTP verification, login, and password reset by OTP.
- Public event browsing and city-based search.
- Event creation with category, city, date, start/end time, capacity, description, address, and image.
- Event moderation by administrators. Pending events can be approved or rejected with a required rejection reason.
- Volunteer event registration, capacity checks, registration history, and cancellation.
- User profile viewing and updating, including password changes.
- Admin dashboard analytics and detailed user, event, and registration reports.
- One-click CSV export containing user, event, and registration reports.
- Email notifications to admins when an event is submitted, to the volunteer and organizer when a volunteer registers, and to organizers when an event is approved or rejected.
- Responsive React interface with role-protected volunteer and admin pages.

## Technology

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, React Router, Axios, Bootstrap, React Icons, SweetAlert2 |
| Backend | Java 21, Spring Boot 4, Spring MVC, Spring Security, Spring Data JPA, Bean Validation |
| Database | MySQL |
| Authentication | JWT bearer tokens |
| Email | Spring Mail / SMTP |
| API documentation | SpringDoc OpenAPI / Swagger UI |

## Repository Layout

```text
volunteer-management-system/
├── README.md
├── volunteer-management/             # Spring Boot API
│   ├── pom.xml
│   ├── mvnw
│   └── src/
└── volunteer-management-frontend/    # React + Vite application
    ├── package.json
    ├── index.html
    └── src/
```

The frontend contains page components, shared components, authentication context, API service modules, styles, and location data. The backend contains controllers, DTOs, JPA entities, repositories, security configuration, and service implementations.

## Requirements

- Java 21.
- Node.js and npm. Use a Node.js release supported by the installed Vite version.
- MySQL server.
- An SMTP account if email verification and notification emails need to be delivered.

## Configuration

### MySQL

Create the database before starting the API:

```sql
CREATE DATABASE volunteer_management;
```

The backend uses `spring.datasource.*` settings in `volunteer-management/src/main/resources/application.properties`. Set the JDBC URL, database username, and password for your local MySQL instance. Hibernate is configured to update the schema automatically during development.

### Backend settings

The main settings are:

| Setting | Purpose |
| --- | --- |
| `spring.datasource.url` | MySQL JDBC connection string |
| `spring.datasource.username` / `spring.datasource.password` | Database credentials |
| `server.port` | Backend port; defaults to `8080` |
| `jwt.secret` / `jwt.expiration` | JWT signing secret and token lifetime |
| `spring.mail.host` / `spring.mail.port` | SMTP server connection |
| `spring.mail.username` / `spring.mail.password` | SMTP account credentials |
| `file.upload-dir` | Event image upload directory |
| `spring.servlet.multipart.max-file-size` | Maximum image upload size |

Spring Boot environment variables can override the corresponding application properties. For local or deployed environments, use variables such as `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`, `JWT_SECRET`, `SPRING_MAIL_HOST`, `SPRING_MAIL_PORT`, `SPRING_MAIL_USERNAME`, and `SPRING_MAIL_PASSWORD` rather than committing secrets.

> **Security:** The current backend properties file contains credentials. Rotate any credentials that have been shared, remove secrets from tracked configuration, and supply new values through environment variables or an untracked local configuration file before deploying or sharing the repository. The development admin bootstrap is also implemented in `AdminInitializer`; replace its development credentials and provisioning approach before production use.

### Frontend API URL

The Axios client currently targets `http://localhost:8080` in `volunteer-management-frontend/src/services/api.js`. Change that base URL for a non-local backend deployment.

## Run Locally

Start the backend and frontend in separate terminals.

### 1. Start the backend

From the repository root:

```sh
cd volunteer-management
sh mvnw spring-boot:run
```

On Windows, run `mvnw.cmd spring-boot:run` from the backend directory. Ensure MySQL is running and the database and backend settings are configured first.

The API listens on `http://localhost:8080` by default.

### 2. Start the frontend

From the repository root in another terminal:

```sh
cd volunteer-management-frontend
npm install
npm run dev
```

Vite prints the local frontend URL, normally `http://localhost:5173`.

### 3. API documentation

When the backend is running, Swagger UI is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

OpenAPI JSON is available at `http://localhost:8080/v3/api-docs`.

## Frontend Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Home page |
| `/events` | Public | Browse and search approved events |
| `/register` | Public | Create an account and verify email |
| `/login` | Public | Sign in and request password-reset OTP |
| `/dashboard` | Volunteer | Volunteer dashboard |
| `/profile` | Volunteer | View and update profile |
| `/create-event` | Volunteer | Submit an event for admin review |
| `/my-events` | Volunteer | View events created by the current user |
| `/my-registrations` | Volunteer | View or cancel event registrations |
| `/admin-dashboard` | Admin | Review events, view analytics and reports, export CSV |

The frontend stores the JWT and current user in browser local storage. API requests attach the token as a bearer token. The backend separately enforces role access; client-side route protection is not the security boundary.

## API Overview

All paths below are relative to `http://localhost:8080`. Protected endpoints require `Authorization: Bearer <token>`.

### Authentication (`/api/auth`)

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/register` | Start account registration and send a verification OTP |
| `POST` | `/verify-registration-otp` | Verify registration OTP and activate the account |
| `POST` | `/login` | Authenticate and obtain a JWT |
| `POST` | `/forgot-password` | Request password-reset OTP |
| `POST` | `/reset-password` | Verify OTP and set a new password |

### Public events (`/api/public`)

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/events` | List upcoming approved events |
| `GET` | `/events/{id}` | Get an event by ID |
| `GET` | `/events/search?city={city}` | Search upcoming approved events by city |

### Volunteer endpoints (`/api/user`)

These endpoints require the `USER` role.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` / `PUT` | `/profile` | Read or update the signed-in user's profile |
| `PUT` | `/change-password` | Change the signed-in user's password |
| `POST` | `/events` | Create an event for admin review |
| `GET` | `/events/my-events` | List events created by the signed-in user |
| `POST` | `/events/{eventId}/register` | Register for an approved event |
| `GET` | `/registrations` | List the signed-in user's registrations |
| `DELETE` | `/registrations/{id}` | Cancel a registration owned by the signed-in user |
| `POST` | `/files/event-image` | Upload an event image (`multipart/form-data`, field `file`) |

### Admin endpoints (`/api/admin`)

These endpoints require the `ADMIN` role.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/dashboard` | Dashboard counts and summary analytics |
| `GET` | `/reports` | User, event, and registration report data |
| `GET` | `/events/pending` | List events awaiting review |
| `PUT` | `/events/{id}/approve` | Approve an event and notify its organizer |
| `PUT` | `/events/{id}/reject` | Reject an event and notify its organizer |
| `GET` | `/events/approved` | List approved events for admin reporting |
| `GET` | `/events/rejected` | List rejected events for admin reporting |
| `POST` | `/categories` | Create an event category |

A rejection request must include a nonblank reason, for example:

```json
{
  "reason": "Please add a complete event address and safety plan."
}
```

## Event and Registration Rules

- New events must have a future start time and an end time later than their start time.
- New events begin with `PENDING` status and are not publicly listed until approved.
- Only approved, upcoming events can be joined.
- The event organizer cannot register for their own event.
- A user cannot register for the same event twice, and event capacity is enforced.
- Successful registrations store a registration timestamp used in the confirmation email and reports.
- Event and registration records use statuses such as `PENDING`, `APPROVED`, `REJECTED`, `REGISTERED`, and `CANCELLED`.

## Email Notifications

The backend sends mail through the configured SMTP provider:

- Registration sends the volunteer a confirmation with event name, registration date, and event date; the organizer also receives the volunteer and event details.
- Event creation notifies admin accounts that a new event awaits review.
- Approval notifies the organizer that the event was approved.
- Rejection notifies the organizer and includes the required rejection reason.

Emails depend on valid SMTP settings and connectivity. Delivery failures are logged by the backend and do not undo a successfully saved event or registration.

## Reports and CSV Export

The admin dashboard's first three total cards open user, event, and registration tables. **Export all reports (CSV)** downloads all three datasets in one CSV file. Text values are quoted and escaped, and spreadsheet formula prefixes are guarded during export.

The report API returns user contact and account fields but never returns password hashes. Access is restricted to administrators.

## Development Commands

Frontend commands, from `volunteer-management-frontend`:

```sh
npm run dev       # Start the Vite development server
npm run build     # Create a production build in dist/
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint
```

Backend commands, from `volunteer-management`:

```sh
sh mvnw -DskipTests compile   # Compile the backend
sh mvnw test                  # Run backend tests
sh mvnw package               # Package the application
```

Backend tests use the configured Spring application context and may require a reachable MySQL database and valid configuration.
