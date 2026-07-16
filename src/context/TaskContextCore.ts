import { createContext } from 'react';
import type { Task } from '../services/taskService';

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
