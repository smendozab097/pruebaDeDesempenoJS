# Cinema SPA

## Description
This project is a Single Page Application (SPA) built to manage cinema functions and reservations. It demonstrates modern web development principles using Vanilla JavaScript (ES6+), Vite, TailwindCSS, and JSON Server. It includes role-based access control, session persistence, and a dynamic UI.

## Technologies Used
* HTML5 / CSS3
* JavaScript (ES6+)
* Vite
* TailwindCSS
* JSON Server
* SweetAlert2

## Installation
1. Clone the repository and navigate to the project directory.
2. Install dependencies for the client:
   ```bash
   cd client
   npm install
   ```
3. Install dependencies for the API (json-server):
   ```bash
   cd api
   npm install
   ```

## Running the project
From the `client` directory, run:
```bash
npm run dev
```

## Running json-server
From the `api` directory, run:
```bash
npm run dev
```
(Alternatively, run `npx json-server --watch db.json --port 3000` from the `api` directory)

## Test Users
**Admin User:**
* Email: admin@test.com
* Password: A123456

**Standard User:**
* Email: user@test.com
* Password: A123456

## Project Structure
```txt
.
├── api
│   ├── db.json (Database)
│   └── package.json
└── client
    ├── src
    │   ├── components (Reusable UI parts like Sidebar)
    │   ├── router (SPA Routing logic and guards)
    │   ├── services (API call logic)
    │   ├── views (Pages: loginView, homeView, carteleraAdminView, reservationListView)
    │   ├── main.js (Entry point)
    │   └── style.css
    ├── index.html
    └── vite.config.js
```

## Role Permissions
**Admin:**
* Can view the movie catalog.
* Can create, edit, and delete movie functions.
* Can view all user reservations.
* Can cancel any reservation.

**User:**
* Can view the movie catalog.
* Can book tickets for active functions.
* Can view only their own reservations.
* Can cancel their own reservations.

## Technical Decisions
* **Architecture:** Modular SPA with centralized routing and service files for API interaction, ensuring separation of concerns.
* **Routing:** Implemented using the History API without page reloads. Includes route guards based on user roles and authentication status.
* **Styling:** TailwindCSS is used for rapid UI development with a responsive and clean design. SweetAlert2 provides elegant modal dialogs and alerts.
* **State Management:** Session is persisted in `localStorage`. The application dynamically reacts to data changes by re-fetching and re-rendering specific DOM sections.
* **Code Style (Beginner-Friendly):** The codebase intentionally avoids complex ES6+ syntax such as `.map()`, object destructuring, optional chaining, and nested ternary operators. It utilizes classic `for` loops and standard `if/else` conditions to ensure it is highly accessible and easy to understand for beginners.
