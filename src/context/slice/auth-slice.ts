import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { AppState } from '../store/types';

export interface AuthState {
  id: number;
  token: string | undefined;
  phone: number | string | undefined;
  firstName: string | undefined;
  lastName: string | undefined;
  email: string | undefined;
  username: string | undefined;
  studyPlace: string | undefined;
  grade: string | undefined;
  image: string | undefined;
  problemSetCoins: number | undefined;
  contestCoins: number | undefined;
  rank: number | undefined;
  likes: number | undefined;
  disLikes: number | undefined;
  rightSubmissions: number | undefined;
  totalSubmissions: number | undefined;
  wrongSubmissions: number | undefined;
  telegram: string | undefined;
  bio: string | undefined;
  status: string | undefined;
  country: string | undefined;
  submissions: Record<string, any>[];
  certificates: Record<string, any>[];
  questions: Record<string, any>;
  answers: Record<string, any>;
  isCollapsed?: boolean;
  filter: Record<string, any>;
  search: string;
  role: string | 'User' | 'Admin';
}

const initialState: AuthState = {
  id: 0,
  token: '',
  phone: '',
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  studyPlace: '',
  telegram: '',
  bio: '',
  status: '',
  country: '',
  grade: '',
  image: '',
  problemSetCoins: 0,
  contestCoins: 0,
  rank: 0,
  likes: 0,
  disLikes: 0,
  rightSubmissions: 0,
  totalSubmissions: 0,
  wrongSubmissions: 0,
  submissions: [{}],
  certificates: [{}],
  questions: {},
  answers: {},
  isCollapsed: false,
  filter: {},
  search: '',
  role: 'User',
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state: AuthState, { payload }: PayloadAction<AuthState>) => {
      return {
        ...state,
        ...payload,
      };
    },
    logout: () => {
      return initialState;
    },
    toggleCollapse: (state: AuthState) => {
      return {
        ...state,
        isCollapsed: !state.isCollapsed,
      };
    },
    saveFilter: (
      state: AuthState,
      { payload }: PayloadAction<Pick<AuthState, 'filter'>>
    ) => {
      const { filter } = payload;
      state.filter = filter;
    },
    handleSearch: (
      state: AuthState,
      { payload }: PayloadAction<Pick<AuthState, 'search'>>
    ) => {
      const { search } = payload;
      state.search = search;
    },
  },
});

export const { login, logout, toggleCollapse, saveFilter, handleSearch } =
  authSlice.actions;

export const user = (state: AppState) => state.auth;

export default authSlice.reducer;
