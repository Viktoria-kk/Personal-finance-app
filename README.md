# personal-finance-app

This is a personal finance web application built with a separate backend and frontend structure.

### Project Structure

```text
personal-finance-app/
  backend/    Node.js, Express, MongoDB API and main application logic
  frontend/   HTML, CSS, and JavaScript user interface
```

### Backend

The backend contains the main project logic and API.

Technologies used:

- Node.js
- Express
- MongoDB
- Modular architecture, feature-based

### Frontend

The frontend contains the user interface.

Technologies used:

- HTML
- CSS
- JavaScript

### How To Run The Project

Open a terminal in the backend folder:

```bash
cd personal-finance-app/backend
npm install
npm run start
```

Then open:

```text
http://localhost:5000/login.html
```

## Demo Accounts

You can use the following demo accounts to explore the application without creating a new user.

> **Password for all accounts:** `password123`

| Name          | Email                       |
| ------------- | --------------------------- |
| James Carter  | `james.carter@example.com`  |
| Mia Thompson  | `mia.thompson@example.com`  |
| Noah Wilson   | `noah.wilson@example.com`   |
| Olivia Martin | `olivia.martin@example.com` |
| Liam Anderson | `liam.anderson@example.com` |
| Ava Mitchell  | `ava.mitchell@example.com`  |
| Ethan Brooks  | `ethan.brooks@example.com`  |

### Note

The backend serves the frontend statically from the `frontend` folder, so the app should be opened through the backend server URL above.
