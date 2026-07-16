# 🎨 Task Management Frontend Application

<div align="center">

![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![PrimeReact](https://img.shields.io/badge/PrimeReact_v11-FF6C37?style=for-the-badge&logo=react&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

**A dynamic, state-of-the-art Single Page Application (SPA) for task and project management, built with React 19, Vite, PrimeReact, Tailwind CSS v4, and Redux Toolkit.**

[Features](#-key-features) · [Installation](#-installation--setup) · [Project Structure](#-project-structure) · [Scripts](#-available-npm-scripts)

</div>

---

## 🌟 Overview

The **Task Management Frontend** is designed to deliver a visually stunning, responsive, and seamless user experience. By combining **PrimeReact v11's** accessible UI components (`@primeuix/themes`) with **Tailwind CSS v4's** utility-first flexibility and micro-animations, the interface feels alive and highly interactive. Centralized asynchronous state management via **Redux Toolkit** guarantees real-time synchronization between client state and REST API payloads.

---

## ✨ Key Features

* **⚡ React 19 & Vite 6:** Powered by the latest React release and Vite for lightning-fast Hot Module Replacement (HMR) and optimized production bundling.
* **📦 Redux Toolkit State Engine:** Centralized slices (`authSlice`, `taskSlice`) providing predictable asynchronous state transitions (`createAsyncThunk`), automatic token injection, and user session management.
* **🎨 Seamless UI/UX Synthesis:** Premium aesthetic crafted using **PrimeReact** dialogs, data tables, buttons, and form elements styled effortlessly alongside custom **Tailwind CSS v4** design tokens.
* **📋 Dynamic Task Board & Lists:** Comprehensive task views supporting real-time status transitions (`Pending` ➡️ `In Progress` ➡️ `Completed`), multi-field searching, date filtering, and paginated navigation.
* **🔐 Complete Authentication Flow:** Formik-driven login and registration workflows equipped with instant validation feedback, secure JWT local storage persistence, and protected route wrappers (`React Router v7`).
* **🔔 Instant Interactive Feedback:** Real-time toast notifications via **React Hot Toast** keeping users informed during asynchronous CRUD actions and network events.
* **🧹 Strict Type Safety & Linting:** Full TypeScript type definitions across all API responses, component props, and Redux state stores, enforced by ESLint and Husky pre-commit hooks.

---

## 📂 Project Structure

```
task-management-frontend/
├── public/                 # Static assets and favicon icons
├── src/
│   ├── assets/             # Brand logos, illustrations, and global icons
│   ├── components/         # Reusable presentation components (Navbar, Sidebar, TaskCard, TaskModal)
│   ├── constants/          # Application-wide constants, status badges, and API endpoints
│   ├── context/            # React Context providers (Theme, UI state)
│   ├── hooks/              # Custom React hooks (`useAppDispatch`, `useAppSelector`, `useAuth`)
│   ├── pages/              # Top-level route views (`LoginPage`, `RegisterPage`, `TasksPage`)
│   ├── routes/             # App routing tree and protected navigation wrappers
│   ├── services/           # Axios HTTP client configuration and API interceptors (`api.ts`)
│   ├── store/              # Redux Toolkit store setup and slices (`authSlice`, `taskSlice`)
│   ├── utils/              # Helper utilities, date formatters, and validation schemas
│   ├── App.tsx             # Main application wrapper and toast provider setup
│   ├── index.css           # Global CSS variables, Tailwind CSS v4 directives, and custom tokens
│   └── main.tsx            # DOM mounting and provider tree
├── .env.example            # Example environment variables
├── eslint.config.js        # Strict React 19 + TypeScript ESLint configuration
├── vite.config.ts          # Vite bundler options and Tailwind v4 plugin setup
└── package.json            # Dependencies, scripts, and pre-commit automation
```

---

## 🚀 Installation & Setup

### 1. Prerequisites
* **Node.js** (`v18+` or `v20+` recommended)
* **npm** (`v9+`)
* Running instance of the [Task Management Backend API](../task-management-backend/README.md) on `http://localhost:5000`

### 2. Clone & Install Dependencies
```bash
cd task-management-frontend
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` and verify your API endpoint configuration:
```bash
cp .env.example .env
```

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🏃 Running the Application

### Development Server (Hot Reload)
```bash
npm run dev
```
> Open [http://localhost:5173](http://localhost:5173) in your browser to view the application.

### Production Build & Preview
```bash
# Type-check and build for production
npm run build

# Preview the built static assets locally
npm run preview
```

---

## 📖 Available NPM Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts the Vite development server with instant HMR |
| `npm run build` | `tsc -b && vite build` | Type-checks code (`tsc -b`) and bundles for production |
| `npm run lint` | `eslint .` | Runs ESLint across all TypeScript/TSX source files |
| `npm run lint:fix`| `eslint . --fix` | Automatically fixes stylistic and linting errors |
| `npm run type-check`| `tsc --noEmit` | Runs strict TypeScript compiler check without emitting files |
| `npm run preview` | `vite preview` | Serves the production build locally for verification |

---

## 🎨 Design System & Styling Best Practices

This application adheres to modern visual excellence principles:
* **Color Harmonization:** Curated HSL/Hex palettes designed for both light and dark backgrounds with high contrast and accessibility.
* **Component Encapsulation:** PrimeReact components are customized using `@primeuix/themes` to maintain brand consistency without ad-hoc inline overrides.
* **Responsive Breakpoints:** Fully mobile-responsive table layouts, collapsible navigation bars, and fluid dialog modals.

---

## 🛡️ Pre-commit Verification

Husky and `lint-staged` are configured in this repository. Any staged `.ts` or `.tsx` changes automatically undergo zero-warning ESLint verification before commits can complete, ensuring your code remains clean, readable, and bug-free.

---

## 📄 License

Licensed under the **ISC License**.
