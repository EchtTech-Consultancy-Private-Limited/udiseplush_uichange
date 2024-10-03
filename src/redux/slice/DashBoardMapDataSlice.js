import { createSlice } from "@reduxjs/toolkit";
import { fetchMaptatsData } from "../thunks/dashboardThunk"; 

const dashboarMapStateInt = createSlice({
  name: "MapStatsInt",
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
      .addCase(fetchMaptatsData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchMaptatsData.fulfilled, (state, action) => {
        state.data = action.payload.data===""?[]:action.payload;
        state.isLoading = false;
      })
      .addCase(fetchMaptatsData.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
      })
      
  },
});

export default dashboarMapStateInt.reducer;