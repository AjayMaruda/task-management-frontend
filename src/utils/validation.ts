import { VALIDATION_MESSAGES } from "../constants/uiConstants";

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface RegisterFormValues {
  name: string;
  phone: string;
  email: string;
  password: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: "low" | "medium" | "high";
}

export const validateLoginForm = (values: LoginFormValues) => {
  const errors: Partial<LoginFormValues> = {};

  if (!values.email) {
    errors.email = VALIDATION_MESSAGES.emailRequired;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = VALIDATION_MESSAGES.emailInvalid;
  }

  if (!values.password) {
    errors.password = VALIDATION_MESSAGES.passwordRequired;
  } else if (values.password.length < 8) {
    errors.password = VALIDATION_MESSAGES.passwordMinLength;
  }

  return errors;
};

export const validateRegisterForm = (values: RegisterFormValues) => {
  const errors: Partial<RegisterFormValues> = {};

  if (!values.name) {
    errors.name = "Name is required";
  } else if (values.name.length < 3) {
    errors.name = "Name must be at least 3 characters";
  }

  if (!values.phone) {
    errors.phone = VALIDATION_MESSAGES.phoneRequired;
  } else if (!/^\+?[0-9]{7,15}$/.test(values.phone)) {
    errors.phone = VALIDATION_MESSAGES.phoneInvalid;
  }

  if (!values.email) {
    errors.email = VALIDATION_MESSAGES.emailRequired;
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = VALIDATION_MESSAGES.emailInvalid;
  }

  if (!values.password) {
    errors.password = VALIDATION_MESSAGES.passwordRequired;
  } else if (values.password.length < 8) {
    errors.password = VALIDATION_MESSAGES.passwordMinLength;
  }

  return errors;
};

export const validateTaskForm = (values: TaskFormValues) => {
  const errors: Partial<Record<keyof TaskFormValues, string>> = {};

  if (!values.title) {
    errors.title = VALIDATION_MESSAGES.titleRequired;
  } else if (values.title.trim().length < 3) {
    errors.title = VALIDATION_MESSAGES.titleMinLength;
  }

  if (!values.description) {
    errors.description = VALIDATION_MESSAGES.descriptionRequired;
  } else if (values.description.trim().length < 10) {
    errors.description = VALIDATION_MESSAGES.descriptionMinLength;
  }

  if (!values.dueDate) {
    errors.dueDate = VALIDATION_MESSAGES.dueDateRequired;
  } else {
    const selectedDate = new Date(values.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.dueDate = VALIDATION_MESSAGES.dueDatePast;
    }
  }

  if (!values.priority) {
    errors.priority = VALIDATION_MESSAGES.priorityRequired;
  }

  return errors;
};
