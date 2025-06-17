import { configureStore } from '@reduxjs/toolkit';
import searchBarReducer from '../features/header/searchBarSlice';
import sideBarReducer from '../features/header/sideBarSlice';
import themeReducer from '../features/header/themeSlice';
import miniPlayerReducer from '../features/body/miniPlayerSlice';

const store = configureStore({
    reducer: {
        searchBar: searchBarReducer,
        sideBar: sideBarReducer,
        themes: themeReducer,
        miniPlayer: miniPlayerReducer,
    },
});

export default store;