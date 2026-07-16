export const API_ROUTES = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
  },
  USERS: {
    ME: (id: string) => `/users/me/${id}`,
  },
  TASKS: {
    CREATE: "/tasks",
    LIST: "/tasks/list",
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
  },
};
