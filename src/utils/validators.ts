export interface TaskFormValues {
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
}

export const validateTaskForm = (values: TaskFormValues) => {
  const errors: Record<string, string> = {};

  if (!values.title) {
    errors.title = 'Title is required';
  } else if (values.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }

  if (!values.description) {
    errors.description = 'Description is required';
  } else if (values.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }

  if (!values.dueDate) {
    errors.dueDate = 'Due date is required';
  } else {
    const selectedDate = new Date(values.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }

  if (!values.priority) {
    errors.priority = 'Priority is required';
  }

  return errors;
};
