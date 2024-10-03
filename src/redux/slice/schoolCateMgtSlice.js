import { createSlice } from "@reduxjs/toolkit";
import { fetchSchoolCateMgtData } from "../thunks/schoolCateMgtThunk";

const schoolCateMgtSlice = createSlice({
  name: "school/cate-mgt",
  initialState: {
    data: {
      data:[],
      statusCode:0,
      message:"",
      success:false
    },
    isLoading:false,
    isError:false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSchoolCateMgtData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSchoolCateMgtData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
      })
      .addCase(fetchSchoolCateMgtData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      });
  },
});

export default schoolCateMgtSlice.reducer;