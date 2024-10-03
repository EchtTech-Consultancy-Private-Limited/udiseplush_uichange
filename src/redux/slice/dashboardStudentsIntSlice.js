import { createSlice } from "@reduxjs/toolkit";
import { fetchStudentStatsIntData } from "../thunks/dashboardThunk"; 

const dashboarStudentStateInt = createSlice({
  name: "StudentStatsInt",
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
      .addCase(fetchStudentStatsIntData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchStudentStatsIntData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        
      })
      .addCase(fetchStudentStatsIntData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboarStudentStateInt.reducer;