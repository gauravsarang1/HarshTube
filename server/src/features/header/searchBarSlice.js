import { createSlice } from "@reduxjs/toolkit";

const searchBarSlice = createSlice({
  name: "searchBar",
  initialState: {
    searchTerm: "",
    isSearchBarOpen: false,
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    }
  }
});

export const { setSearchTerm } = searchBarSlice.actions;
export default searchBarSlice.reducer;