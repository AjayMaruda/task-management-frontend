import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';
import { API_ROUTES } from '@/services/apiRoutes';

export type TaskStatus = 'todo' | 'in_progress' | 'completed' | 'done';

export interface Task {
  id: string;
  _id?: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  status: TaskStatus;
  assignee?: string;
  createdAt?: string;
}

export interface FetchTasksParams {
  page?: number;
  limit?: number;
  sortKey?: string;
  sortValue?: 'asc' | 'desc';
  search?: string;
  status?: string;
  priority?: string;
  assignee?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  status?: TaskStatus;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignee?: string;
}

export interface UpdateTaskPayload {
  id: string;
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: 'low' | 'medium' | 'high';
  dueDate?: string;
  assignee?: string;
}

interface TaskState {
  tasks: Task[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
  lastFetchParams?: FetchTasksParams;
}

const initialState: TaskState = {
  tasks: [],
  totalCount: 0,
  currentPage: 1,
  totalPages: 1,
  loading: false,
  error: null,
};

export interface FetchTasksResult {
  list: Task[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const extractSingleTask = (responseBody: any, fallbackId?: string): any => {
  if (!responseBody) return { id: fallbackId || '' };

  let taskObj = responseBody;
  if (typeof responseBody === 'object' && 'data' in responseBody && responseBody.data && typeof responseBody.data === 'object') {
    const dataObj = responseBody.data;
    if ('task' in dataObj && dataObj.task && typeof dataObj.task === 'object') {
      taskObj = dataObj.task;
    } else if ('item' in dataObj && dataObj.item && typeof dataObj.item === 'object') {
      taskObj = dataObj.item;
    } else {
      taskObj = dataObj;
    }
  } else if (typeof responseBody === 'object' && 'task' in responseBody && responseBody.task && typeof responseBody.task === 'object') {
    taskObj = responseBody.task;
  }

  return {
    ...taskObj,
    id: taskObj.id || taskObj._id || fallbackId || '',
  };
};

const normalizeTask = (t: any): Task => {
  let st = (t.status || (t.completed ? 'completed' : 'todo')).toString().toLowerCase();
  if (!['todo', 'in_progress', 'completed', 'done'].includes(st)) st = 'todo';

  let pr = (t.priority || 'medium').toString().toLowerCase();
  if (!['low', 'medium', 'high'].includes(pr)) pr = 'medium';

  return {
    ...t,
    id: t.id || t._id || '',
    status: st as TaskStatus,
    priority: pr as 'low' | 'medium' | 'high',
  };
};



export const fetchTasksThunk = createAsyncThunk<
  FetchTasksResult,
  FetchTasksParams | void,
  { rejectValue: string; getState: any }
>('tasks/fetchTasks', async (params, { rejectWithValue, getState }) => {
  try {
    const state = getState() as { tasks: TaskState };
    const queryParams = params ?? state.tasks.lastFetchParams ?? { page: 1, limit: 10 };
    const response = await apiService.post<any>(API_ROUTES.TASKS.LIST, queryParams);
    const rawData = response.data;
    let list: any[] = [];
    let totalCount = 0;
    let currentPage = 1;
    let totalPages = 1;

    if (rawData && typeof rawData === 'object' && 'data' in rawData && rawData.data && typeof rawData.data === 'object') {
      const dataObj = rawData.data;
      if ('list' in dataObj && Array.isArray(dataObj.list)) {
        list = dataObj.list;
      } else if ('tasks' in dataObj && Array.isArray(dataObj.tasks)) {
        list = dataObj.tasks;
      } else if (Array.isArray(dataObj)) {
        list = dataObj;
      }
      totalCount = dataObj.totalCount ?? list.length;
      currentPage = dataObj.currentPage ?? 1;
      totalPages = dataObj.totalPages ?? 1;
    } else if (Array.isArray(rawData)) {
      list = rawData;
      totalCount = rawData.length;
    }

    const normalizedList = list.map(normalizeTask);

    return {
      list: normalizedList,
      totalCount,
      currentPage,
      totalPages,
    };
  } catch {
    return rejectWithValue('Failed to fetch tasks.');
  }
});

export const createTaskThunk = createAsyncThunk<
  Task,
  CreateTaskPayload,
  { rejectValue: string; dispatch: any; getState: any }
>('tasks/createTask', async (taskData, { rejectWithValue, dispatch, getState }) => {
  try {
    const payload = {
      status: 'todo',
      ...taskData,
      dueDate: taskData.dueDate ? new Date(taskData.dueDate).toISOString() : new Date().toISOString(),
    };
    const response = await apiService.post<any>(API_ROUTES.TASKS.CREATE, payload);
    const raw = extractSingleTask(response.data, `task-${Date.now()}`);
    const normalized = normalizeTask({
      ...payload,
      ...raw,
      id: raw.id || raw._id || `task-${Date.now()}`,
    });

    // Refresh list using last known params so sort/filter/page context is preserved
    const state = getState() as { tasks: TaskState };
    dispatch(fetchTasksThunk(state.tasks.lastFetchParams));

    return normalized;
  } catch {
    return rejectWithValue('Failed to create task.');
  }
});

export const updateTaskThunk = createAsyncThunk<
  Task,
  UpdateTaskPayload,
  { rejectValue: string; dispatch: any; getState: any }
>('tasks/updateTask', async ({ id, ...updateData }, { rejectWithValue, dispatch, getState }) => {
  try {
    const payload = {
      ...updateData,
      ...(updateData.dueDate ? { dueDate: new Date(updateData.dueDate).toISOString() } : {}),
    };
    const response = await apiService.put<any>(API_ROUTES.TASKS.UPDATE(id), payload);
    const raw = extractSingleTask(response.data, id);
    const normalized = normalizeTask({ ...updateData, ...raw, id: raw.id || raw._id || id });

    // Refresh list using last known params so sort/filter/page context is preserved
    const state = getState() as { tasks: TaskState };
    dispatch(fetchTasksThunk(state.tasks.lastFetchParams));

    return normalized;
  } catch {
    return rejectWithValue('Failed to update task.');
  }
});

export const deleteTaskThunk = createAsyncThunk<
  string,
  string,
  { rejectValue: string; dispatch: any; getState: any }
>('tasks/deleteTask', async (id, { rejectWithValue, dispatch, getState }) => {
  try {
    await apiService.delete(API_ROUTES.TASKS.DELETE(id));
    // Refresh list using last known params so sort/filter/page context is preserved
    const state = getState() as { tasks: TaskState };
    dispatch(fetchTasksThunk(state.tasks.lastFetchParams));
    return id;
  } catch {
    return rejectWithValue('Failed to delete task.');
  }
});

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchTasksThunk.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        if (action.meta.arg) {
          state.lastFetchParams = action.meta.arg;
        }
      })
      .addCase(fetchTasksThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload.list;
        state.totalCount = action.payload.totalCount;
        state.currentPage = action.payload.currentPage;
        state.totalPages = action.payload.totalPages;
        if (action.meta.arg) {
          state.lastFetchParams = action.meta.arg;
        }
      })
      .addCase(fetchTasksThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Failed to fetch tasks.';
      })
      // Create
      .addCase(createTaskThunk.fulfilled, (state, action) => {
        if (state.currentPage === 1 && action.payload && action.payload.id) {
          state.tasks.unshift(action.payload);
          if (state.tasks.length > 10) {
            state.tasks.pop();
          }
        }
        state.totalCount += 1;
      })
      // Update
      .addCase(updateTaskThunk.fulfilled, (state, action) => {
        const index = state.tasks.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      // Delete
      .addCase(deleteTaskThunk.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((t) => t.id !== action.payload);
        state.totalCount = Math.max(0, state.totalCount - 1);
      });
  },
});

export const selectTasks = (state: { tasks: TaskState }) => state.tasks.tasks;
export const selectTasksLoading = (state: { tasks: TaskState }) => state.tasks.loading;
export const selectTasksTotalCount = (state: { tasks: TaskState }) => state.tasks.totalCount;
export const selectTasksCurrentPage = (state: { tasks: TaskState }) => state.tasks.currentPage;
export const selectTasksTotalPages = (state: { tasks: TaskState }) => state.tasks.totalPages;

export default taskSlice.reducer;
