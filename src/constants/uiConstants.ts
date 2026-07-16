export const APP_TEXT = {
  brandName: "TaskFlow",
  tagline: "Premium Workspace Dashboard",
  footerRights: "All rights reserved.",
};

export const COMMON_TEXT = {
  required: "Required",
};

export const ARIA_LABELS = {
  deleteTask: "Delete task",
  hidePassword: "Hide password",
  showPassword: "Show password",
};

export const LOGIN_TEXT = {
  title: "Welcome back",
  subtitle: "Sign in to your account to continue",
  noAccount: "Don't have an account?",
  createAccount: "Create account",
  signingIn: "Signing in...",
  signIn: "Sign in",
};

export const TASK_PAGE_TEXT = {
  progress: "Progress",
  completed: "Completed",
  logout: "Logout",
  workspaceTitle: "Task Workspace",
  workspaceDescription:
    "Create, organize, and track your daily tasks using our sleek dashboard built with PrimeReact interactive components, Formik validation, and Tailwind CSS.",
  totalTasks: "Total Tasks",
  footer: "TaskFlow Workspace. Driven by React, PrimeReact, & Tailwind CSS.",
};

export const TASK_FORM_TEXT = {
  title: "Create New Task",
  creating: "Creating...",
  createTask: "Create Task",
};

export const TASK_LIST_TEXT = {
  title: "Task Directory",
  pending: "Pending",
  empty: "No tasks logged yet. Complete the form to add one!",
};

export const FORM_LABELS = {
  email: "Email address",
  password: "Password",
  taskTitle: "Task Title",
  description: "Description",
  dueDate: "Due Date",
  priority: "Priority Level",
};

export const TASK_PRIORITY_OPTIONS = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
] as const;

export const TABLE_HEADERS = {
  status: "Status",
  taskDetails: "Task Details",
  dueDate: "Due Date",
  priority: "Priority",
  actions: "Actions",
};

export const VALIDATION_MESSAGES = {
  emailRequired: "Email is required",
  emailInvalid: "Enter a valid email address",
  passwordRequired: "Password is required",
  passwordMinLength: "Password must be at least 8 characters",
  titleRequired: "Title is required",
  titleMinLength: "Title must be at least 3 characters",
  descriptionRequired: "Description is required",
  descriptionMinLength: "Description must be at least 10 characters",
  dueDateRequired: "Due date is required",
  dueDatePast: "Due date cannot be in the past",
  priorityRequired: "Priority is required",
};
