import { createSlice } from '@reduxjs/toolkit';

const sideBarSlice = createSlice({
  name: 'sideBar',
  initialState: {
    isSideBarOpen: false,
  },
  reducers: {
    toggleSideBar: (state) => {
      state.isSideBarOpen = !state.isSideBarOpen;
    },
    closeSideBar: (state) => {
      state.isSideBarOpen = false;
    },
  },
});

export const { toggleSideBar, closeSideBar } = sideBarSlice.actions;
export default sideBarSlice.reducer;