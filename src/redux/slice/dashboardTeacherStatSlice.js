import { createSlice } from "@reduxjs/toolkit";
import { fetchTeachersStatsData } from "../thunks/dashboardThunk"; 

const dashboarTeacherState = createSlice({
  name: "TeacherStats",
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
      .addCase(fetchTeachersStatsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTeachersStatsData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        
      })
      .addCase(fetchTeachersStatsData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboarTeacherState.reducer;