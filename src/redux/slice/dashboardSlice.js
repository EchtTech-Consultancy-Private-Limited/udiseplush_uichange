import { createSlice } from "@reduxjs/toolkit";
import { fetchDashboardData } from "../thunks/dashboardThunk"; 

const dashboardSlice = createSlice({
  name: "dashboard",
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
      .addCase(fetchDashboardData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDashboardData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload.data===""?[]:action.payload;
        
      })
      .addCase(fetchDashboardData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboardSlice.reducer;