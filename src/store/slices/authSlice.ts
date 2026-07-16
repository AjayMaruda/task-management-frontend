import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiService } from '@/services/apiService';
import { API_ROUTES } from '@/services/apiRoutes';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser | null;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}

// ── Initial state — rehydrate token from sessionStorage on page load ───────────
const initialState: AuthState = {
  token: sessionStorage.getItem('accessToken'),
  user: null,
  loading: false,
  error: null,
};

interface LoginApiResponse {
  accessToken?: string;
  token?: string;
  user?: AuthUser;
  data?: {
    accessToken?: string;
    token?: string;
    user?: AuthUser;
  };
}

const normalizeLoginResponse = (payload: LoginApiResponse): LoginResponse => {
  const token = payload.token ?? payload.accessToken ?? payload.data?.token ?? payload.data?.accessToken;
  const user = payload.user ?? payload.data?.user ?? null;

  if (!token) {
    throw new Error('Login succeeded, but no access token was returned.');
  }

  return { token, user };
};

// ── Async thunk — Login ────────────────────────────────────────────────────────
export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const response = await apiService.post<LoginApiResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials,
    );
    return normalizeLoginResponse(response.data);
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : 'Invalid email or password.';
    return rejectWithValue(message);
  }
});

// ── Slice ──────────────────────────────────────────────────────────────────────
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      sessionStorage.removeItem('accessToken');
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        sessionStorage.setItem('accessToken', action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Login failed. Please try again.';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

// ── Selectors ─────────────────────────────────────────────────────────────────
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  !!state.auth.token;
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) => state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
