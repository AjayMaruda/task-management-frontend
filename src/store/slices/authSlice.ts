import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { apiService } from "@/services/apiService";
import { API_ROUTES } from "@/services/apiRoutes";
import { jwtDecode } from "jwt-decode";
import type { RegisterFormValues } from "@/utils/validation";

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

const storedToken = sessionStorage.getItem("accessToken");

/* eslint-disable @typescript-eslint/no-explicit-any */
export const extractUserFromToken = (
  token: string | null,
  existingUser?: AuthUser | null,
): AuthUser | null => {
  if (!token && !existingUser) return null;
  if (!token && existingUser) return existingUser;
  try {
    const decoded = jwtDecode<Record<string, any>>(token!);
    const id =
      decoded.id ||
      decoded._id ||
      decoded.sub ||
      decoded.userId ||
      decoded.user_id ||
      existingUser?.id ||
      "";
    let name =
      decoded.name ||
      decoded.username ||
      decoded.user_name ||
      decoded.fullName ||
      decoded.full_name ||
      existingUser?.name ||
      "";
    if (!name && (decoded.firstName || decoded.first_name || decoded.lastName || decoded.last_name)) {
      name = `${decoded.firstName || decoded.first_name || ""} ${decoded.lastName || decoded.last_name || ""}`.trim();
    }
    const email =
      decoded.email ||
      decoded.userEmail ||
      decoded.user_email ||
      decoded.mail ||
      existingUser?.email ||
      "";

    if (!name && email) {
      name = email.split("@")[0];
    }

    if (id || name || email) {
      return {
        id: id || existingUser?.id || "",
        name: name || existingUser?.name || "TaskFlow User",
        email: email || existingUser?.email || "",
      };
    }
  } catch (e) {
    console.error("Failed to decode JWT token:", e);
  }
  return existingUser ?? null;
};

const initialState: AuthState = {
  token: storedToken,
  user: extractUserFromToken(storedToken),
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
  const token =
    payload.token ??
    payload.accessToken ??
    payload.data?.token ??
    payload.data?.accessToken;
  let user = payload.user ?? payload.data?.user ?? null;

  if (!token) {
    throw new Error("Login succeeded, but no access token was returned.");
  }

  user = extractUserFromToken(token, user);

  return { token, user };
};

export const fetchCurrentUserThunk = createAsyncThunk<
  AuthUser,
  string,
  { rejectValue: string }
>("auth/fetchUser", async (id, { rejectWithValue }) => {
  try {
    const response = await apiService.get<{ data?: AuthUser } | AuthUser>(
      API_ROUTES.USERS.ME(id),
    );
    const user =
      "data" in response.data && response.data.data
        ? response.data.data
        : response.data;
    return user as AuthUser;
  } catch {
    return rejectWithValue("Failed to fetch user profile.");
  }
});

export const loginThunk = createAsyncThunk<
  LoginResponse,
  LoginCredentials,
  { rejectValue: string }
>("auth/login", async (credentials, { rejectWithValue, dispatch }) => {
  try {
    const response = await apiService.post<LoginApiResponse>(
      API_ROUTES.AUTH.LOGIN,
      credentials,
    );
    const normalized = normalizeLoginResponse(response.data);

    if (normalized.token) {
      sessionStorage.setItem("accessToken", normalized.token);

      if (!normalized.user) {
        try {
          const decoded = jwtDecode<{ id?: string; sub?: string }>(
            normalized.token,
          );
          const userId = decoded.id || decoded.sub;
          if (userId) {
            dispatch(fetchCurrentUserThunk(userId));
          }
        } catch (e) {
          console.error("Failed to decode token:", e);
        }
      }
    }

    return normalized;
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Invalid email or password.";
    return rejectWithValue(message);
  }
});

export const registerThunk = createAsyncThunk<
  void,
  RegisterFormValues,
  { rejectValue: string }
>("auth/register", async (data, { rejectWithValue }) => {
  try {
    await apiService.post(API_ROUTES.AUTH.REGISTER, data);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Registration failed.";
    return rejectWithValue(message);
  }
});

export const initializeAuth = createAsyncThunk(
  "auth/initialize",
  async (_, { getState, dispatch }) => {
    const state = getState() as { auth: AuthState };
    if (state.auth.token) {
      try {
        const decodedUser = extractUserFromToken(state.auth.token, state.auth.user);
        if (decodedUser && (!state.auth.user || !state.auth.user.name || !state.auth.user.email)) {
          dispatch(setUserFromToken(decodedUser));
        }
        const decoded = jwtDecode<Record<string, any>>(state.auth.token);
        const userId = decoded.id || decoded._id || decoded.sub || decoded.userId || decodedUser?.id;
        if (userId) {
          dispatch(fetchCurrentUserThunk(userId));
        }
      } catch (e) {
        console.error("Invalid token on initialization", e);
        dispatch(logout());
      }
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.loading = false;
      state.error = null;
      sessionStorage.removeItem("accessToken");
    },
    clearAuthError(state) {
      state.error = null;
    },
    setUserFromToken(state, action: PayloadAction<AuthUser | null>) {
      if (action.payload) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = extractUserFromToken(action.payload.token, action.payload.user ?? state.user);
        sessionStorage.setItem("accessToken", action.payload.token);
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed. Please try again.";
      })
      // Register
      .addCase(registerThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Registration failed.";
      })
      // Fetch User
      .addCase(fetchCurrentUserThunk.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload,
          id: action.payload?.id || state.user?.id || "",
          name: action.payload?.name || state.user?.name || "User",
          email: action.payload?.email || state.user?.email || "",
        };
      });
  },
});

export const { logout, clearAuthError, setUserFromToken } = authSlice.actions;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  !!state.auth.token;
export const selectAuthUser = (state: { auth: AuthState }) => state.auth.user;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;

export default authSlice.reducer;
