import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { TasksPage } from '../pages/TasksPage';
import { LoginPage } from '../pages/LoginPage';

import { RegisterPage } from '../pages/RegisterPage';

// ── Application Route Map ─────────────────────────────────────────────────────
//
//   /login          → LoginPage        (public)
//   /register       → RegisterPage     (public)
//   /               → TasksPage        (protected — requires auth)
//   *               → redirect to /   (catch-all)
//
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    // Protected zone — all children require a valid session token
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <TasksPage />,
      },
    ],
  },
  {
    // Catch-all: unknown paths go to home (ProtectedRoute handles auth check)
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

export default router;
