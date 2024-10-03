import { createSlice } from "@reduxjs/toolkit";
import { fetchStateData,updateFilterState } from "../thunks/stateThunk";

const stateSlice = createSlice({
  name: "state/report-3016",
  initialState: {
    data: {
      data:[],
      statusCode:0,
      message:"",
      success:false
    },
    dataClone:[],

    isLoading:false,
    isError:false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStateData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStateData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        state.dataClone = action.payload.data===""?[]:action.payload;
      })
      .addCase(fetchStateData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      .addCase(updateFilterState.fulfilled, (state, action) => {
        state.data.data = action.payload
        state.isLoading = false;
      });
  },
});

export default stateSlice.reducer;