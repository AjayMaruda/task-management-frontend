export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: string;
}

const STORAGE_KEY = 'task_management_dashboard_tasks';

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Setup Project Boilerplate',
    description: 'Initialize React + Vite frontend, configure PrimeReact, Tailwind CSS, Formik, and Husky hook setup.',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'high',
    completed: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Integrate Tailwind CSS & PrimeReact Styling',
    description: 'Ensure Tailwind styling plays nicely with PrimeReact component custom designs and class overrides.',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    priority: 'medium',
    completed: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Create Dashboard & Workflows',
    description: 'Build premium list and validation form to showcase adding, completing, and removing tasks.',
    dueDate: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    priority: 'low',
    completed: false,
    createdAt: new Date().toISOString(),
  }
];

export const taskService = {
  getTasks(): Task[] {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
      return defaultTasks;
    }
    try {
      return JSON.parse(data) as Task[];
    } catch {
      return defaultTasks;
    }
  },

  saveTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }
};
