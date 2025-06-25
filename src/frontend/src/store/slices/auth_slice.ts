import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';

export enum AuthFormMode {
  SIGN_IN = 'SIGN_IN',
  SIGN_UP = 'SIGN_UP',
}

interface AuthState {
  authFormMode: AuthFormMode;
  isLoading: boolean;
}

const initialState: AuthState = { authFormMode: AuthFormMode.SIGN_UP, isLoading: false };

const submitEmail = createAsyncThunk('auth/submitEmail', async (email: string, thunkAPI) => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return thunkAPI.rejectWithValue('response.message');
  // const response = await api.submitEmail(email);
  // if (!response.success) {
  //   return thunkAPI.rejectWithValue(response.message);
  // }
  // return response;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    toggleAuthMode(state) {
      if (state.authFormMode === AuthFormMode.SIGN_IN) {
        state.authFormMode = AuthFormMode.SIGN_UP;
      } else {
        state.authFormMode = AuthFormMode.SIGN_IN;
      }
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitEmail.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(submitEmail.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(submitEmail.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const authActions = { ...authSlice.actions, submitEmail };
export const authReducer = authSlice.reducer;
