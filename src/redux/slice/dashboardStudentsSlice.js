import { createSlice } from "@reduxjs/toolkit";
import { fetchStudentStatsData } from "../thunks/dashboardThunk"; 

const dashboarStudentState = createSlice({
  name: "StudentStats",
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
      .addCase(fetchStudentStatsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStudentStatsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        
      })
      .addCase(fetchStudentStatsData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboarStudentState.reducer;