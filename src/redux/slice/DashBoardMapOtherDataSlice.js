import { createSlice } from "@reduxjs/toolkit";
import { fetchMaptatsOtherData } from "../thunks/dashboardThunk"; 

const dashboarMapStatePer = createSlice({
  name: "MapStatsPer",
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
      .addCase(fetchMaptatsOtherData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMaptatsOtherData.fulfilled, (state, action) => {
        state.data = action.payload.data===""?[]:action.payload;
        state.isLoading = false;
      })
      .addCase(fetchMaptatsOtherData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboarMapStatePer.reducer;