import { createSlice } from "@reduxjs/toolkit";
import { fetchSchoolStatsIntData } from "../thunks/dashboardThunk"; 

const dashboarSchoolStateInt = createSlice({
  name: "schoolStatsInt",
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
      .addCase(fetchSchoolStatsIntData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSchoolStatsIntData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        
      })
      .addCase(fetchSchoolStatsIntData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboarSchoolStateInt.reducer;