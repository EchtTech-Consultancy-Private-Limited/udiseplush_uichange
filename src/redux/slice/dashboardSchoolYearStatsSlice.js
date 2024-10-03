import { createSlice } from "@reduxjs/toolkit";
import { fetchSchoolStatsDataYear } from "../thunks/dashboardThunk";

const dashboarSchoolStateYear = createSlice({
  name: "schoolStatsYear",
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
      .addCase(fetchSchoolStatsDataYear.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSchoolStatsDataYear.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;

      })
      .addCase(fetchSchoolStatsDataYear.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })

  },
});

export default dashboarSchoolStateYear.reducer;