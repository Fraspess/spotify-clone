import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: any | null;
}

const getStorageItem = (key: string) => {
  const item = localStorage.getItem(key);
  if (!item || item === 'null' || item === 'undefined' || item.includes('object')) return null;
  return item;
};

const initialState: AuthState = {
  accessToken: getStorageItem('accessToken'),
  refreshToken: getStorageItem('refreshToken'),
  user: (() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch { return null; }
  })(),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      { payload }: PayloadAction<{ accessToken: string; refreshToken?: string; user?: any }>
    ) => {
      state.accessToken = payload.accessToken;
      if (payload.refreshToken) state.refreshToken = payload.refreshToken;
      if (payload.user) state.user = payload.user;

      localStorage.setItem("accessToken",payload.accessToken);
      if (payload.refreshToken) localStorage.setItem('refreshToken', payload.refreshToken);
      if (payload.user) localStorage.setItem('user', JSON.stringify(payload.user));
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;