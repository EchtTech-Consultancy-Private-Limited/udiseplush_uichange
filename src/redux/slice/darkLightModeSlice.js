import { createSlice } from "@reduxjs/toolkit";

const darkLightModeSlice = createSlice({
    name: 'dark_light',
    initialState:{
        toggleDarkLight: localStorage.getItem('dark-mode') === 'true',
    },
    reducers: {
      updateToggleDark(state,action) {
        state.toggleDarkLight=action.payload;
      }
    },
  })

  export const { updateToggleDark } = darkLightModeSlice.actions
  export default darkLightModeSlice.reducer