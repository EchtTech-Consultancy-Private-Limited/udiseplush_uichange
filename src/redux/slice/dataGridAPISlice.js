import { createSlice } from "@reduxjs/toolkit";

const dataGridAPISlice = createSlice({
    name: 'column/ag-grid',
    initialState:{
        column:false,
    },
    reducers: {
      hideShowColumn(state,action) {
        state.column=action.payload;
      }
    },
  })
  
  export const { hideShowColumn } = dataGridAPISlice.actions
  export default dataGridAPISlice.reducer