import { createSlice } from "@reduxjs/toolkit";
import { fetchTeachersStatsIntData } from "../thunks/dashboardThunk"; 

const dashboarTeacherStateInt = createSlice({
  name: "TeacherStatsInt",
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
      .addCase(fetchTeachersStatsIntData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTeachersStatsIntData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        
      })
      .addCase(fetchTeachersStatsIntData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboarTeacherStateInt.reducer;