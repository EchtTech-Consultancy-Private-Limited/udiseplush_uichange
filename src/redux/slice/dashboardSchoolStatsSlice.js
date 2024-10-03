import { createSlice } from "@reduxjs/toolkit";
import { fetchSchoolStatsData } from "../thunks/dashboardThunk"; 

const dashboarSchoolState = createSlice({
  name: "schoolStats",
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
      .addCase(fetchSchoolStatsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSchoolStatsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        
      })
      .addCase(fetchSchoolStatsData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboarSchoolState.reducer;