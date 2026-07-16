import React, { useState } from 'react';
import { taskService } from '../services/taskService';
import type { Task } from '../services/taskService';
import { TaskContext } from './TaskContextCore';

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Lazy initializer: reads localStorage once on mount, so no effect is needed.
  const [tasks, setTasks] = useState<Task[]>(() => taskService.getTasks());

  const addTask = (newTaskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: Math.random().toString(36).substr(2, 9),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    taskService.saveTasks(updatedTasks);
  };

  const toggleTask = (id: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    taskService.saveTasks(updatedTasks);
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    setTasks(updatedTasks);
    taskService.saveTasks(updatedTasks);
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask }}>
      {children}
    </TaskContext.Provider>
  );
};
