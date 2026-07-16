import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  selectTasks,
  selectTasksLoading,
  selectTasksTotalCount,
  selectTasksCurrentPage,
  selectTasksTotalPages,
  fetchTasksThunk,
  createTaskThunk,
  updateTaskThunk,
  deleteTaskThunk,
} from '../store/slices/taskSlice';
import type { TaskStatus, CreateTaskPayload, UpdateTaskPayload, FetchTasksParams } from '../store/slices/taskSlice';

export const useTasks = () => {
  const dispatch = useAppDispatch();
  const tasks = useAppSelector(selectTasks);
  const loading = useAppSelector(selectTasksLoading);
  const totalCount = useAppSelector(selectTasksTotalCount);
  const currentPage = useAppSelector(selectTasksCurrentPage);
  const totalPages = useAppSelector(selectTasksTotalPages);

  const fetchTasks = (params?: FetchTasksParams) => {
    dispatch(fetchTasksThunk(params));
  };

  const addTask = async (taskData: CreateTaskPayload) => {
    return await dispatch(createTaskThunk(taskData)).unwrap();
  };

  const updateTask = (taskData: UpdateTaskPayload) => {
    dispatch(updateTaskThunk(taskData));
  };

  const toggleTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (task) {
      const nextStatus: TaskStatus =
        task.status === 'todo' ? 'in_progress' :
        task.status === 'in_progress' ? 'completed' : 'todo';

      dispatch(updateTaskThunk({
        id: task.id,
        title: task.title,
        description: task.description,
        status: nextStatus,
        priority: task.priority,
        dueDate: task.dueDate,
        ...(task.assignee ? { assignee: task.assignee } : {}),
      }));
    }
  };

  const deleteTask = (id: string) => {
    dispatch(deleteTaskThunk(id));
  };

  return {
    tasks,
    loading,
    totalCount,
    currentPage,
    totalPages,
    fetchTasks,
    addTask,
    updateTask,
    toggleTask,
    deleteTask,
  };
};
