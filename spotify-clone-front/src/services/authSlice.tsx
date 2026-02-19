import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  user: any | null;
}

const getInitialToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'null' || token === 'undefined' || token.includes('object')) return null;
  return token;
};

const getInitialUser = () => {
  const user = localStorage.getItem('user');
  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

const initialState: AuthState = {
  token: getInitialToken(),
  user: getInitialUser(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload }: PayloadAction<{ token: string | any; user?: any }>
    ) => {
      const tokenString = typeof payload.token === 'object' 
        ? payload.token.accessToken || payload.token.token 
        : payload.token;

      if (tokenString) {
        state.token = tokenString;
        state.user = payload.user || null;
        
        localStorage.setItem('token', tokenString);
        if (payload.user) {
          localStorage.setItem('user', JSON.stringify(payload.user));
        }
      }
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('auth');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;